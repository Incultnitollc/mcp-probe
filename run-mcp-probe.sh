#!/usr/bin/env bash
set -euo pipefail

# run-mcp-probe.sh
# Invoked by action.yml. Translates Action inputs (env vars) into a
# mcp-probe CLI invocation, captures output, parses JSON, sets GHA outputs.

: "${MCP_PROBE_VERSION:=latest}"
: "${COMMAND:?COMMAND env var is required}"
: "${FAIL_UNDER:=0}"
: "${PUBLISHABILITY:=false}"
: "${PACKAGE_PATH:=}"
: "${HTML_REPORT:=}"
: "${JSON_OUTPUT:=}"

ARGS=("test" "$COMMAND")

if [ "${PUBLISHABILITY,,}" = "true" ]; then
  ARGS+=("--publishability")
  if [ -n "$PACKAGE_PATH" ]; then
    ARGS+=("--package" "$PACKAGE_PATH")
  fi
fi

if [ "$FAIL_UNDER" != "0" ]; then
  ARGS+=("--fail-under" "$FAIL_UNDER")
fi

if [ -n "$HTML_REPORT" ]; then
  ARGS+=("--html" "$HTML_REPORT")
fi

JSON_TMP="${RUNNER_TEMP:-/tmp}/mcp-probe-output.json"
TEXT_TMP="${RUNNER_TEMP:-/tmp}/mcp-probe-output.txt"
ARGS+=("--json")

set +e
npx -y "@incultnitollc/mcp-probe@${MCP_PROBE_VERSION}" "${ARGS[@]}" > "$JSON_TMP" 2> "$TEXT_TMP"
EXIT_CODE=$?
set -e

cat "$TEXT_TMP"

if [ -n "$JSON_OUTPUT" ]; then
  cp "$JSON_TMP" "$JSON_OUTPUT"
fi

if command -v jq >/dev/null 2>&1; then
  COMPOSITE=$(jq -r '.score.composite // .publishabilityScore.composite // empty' "$JSON_TMP" 2>/dev/null || echo "")
  BAND=$(jq -r '.score.band // .publishabilityScore.bandName // empty' "$JSON_TMP" 2>/dev/null || echo "")
  TOOLS_PASS=$(jq -r 'if (.score.toolsTotal // 0) > 0 then ((.score.toolsCallable // 0) / .score.toolsTotal) else 0 end' "$JSON_TMP" 2>/dev/null || echo "0")
  SCHEMA_WARN=$(jq -r '.score.schemaWarnings // 0' "$JSON_TMP" 2>/dev/null || echo "0")
else
  COMPOSITE=""
  BAND=""
  TOOLS_PASS="0"
  SCHEMA_WARN="0"
fi

{
  echo "composite-score=$COMPOSITE"
  echo "band=$BAND"
  echo "tools-pass-rate=$TOOLS_PASS"
  echo "schema-warnings=$SCHEMA_WARN"
} >> "${GITHUB_OUTPUT:-/dev/null}"

{
  echo "## mcp-probe results"
  echo ""
  if [ -n "$COMPOSITE" ]; then
    echo "**Composite score:** $COMPOSITE / 100 ($BAND)"
  fi
  echo "**Tools pass rate:** $TOOLS_PASS"
  echo "**Schema warnings:** $SCHEMA_WARN"
  echo ""
  echo "<details><summary>Full scorecard</summary>"
  echo ""
  echo '```'
  cat "$TEXT_TMP"
  echo '```'
  echo ""
  echo "</details>"
} >> "${GITHUB_STEP_SUMMARY:-/dev/null}"

exit "$EXIT_CODE"
