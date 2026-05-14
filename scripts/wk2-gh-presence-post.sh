#!/bin/bash
# Wk2 daily community-presence — 4 GitHub replies (MANUAL fire)
#
# USAGE — Peng runs this himself at 22:00 TPE tonight (2026-05-15):
#   cd "/Users/pengspirit/incultnito/Dev/Backend/repos/Month 1 and 2 - MCP Inspect"
#   ./scripts/wk2-gh-presence-post.sh
#
# Runtime: ~15 min total (4 posts × 5-min spacing = 4 × 0min + 3 × 5min sleep).
# Leave the terminal open — sleeps in foreground.
#
# After this finishes, Peng manually pastes:
#   - 22:30 Reddit r/mcp `1tci9yv`     (draft #5 in docs/community/wk2-daily-presence-drafts.md)
#   - 22:45 Reddit r/ClaudeAI `1tcu5zm` (draft #6)
#
# Source drafts: docs/community/wk2-daily-presence-drafts.md (commit a673333)
# Generated:    2026-05-15 TPE
# Auth:         uses Peng's local gh CLI (gh auth status to verify)
# Spacing:      5 min between GH posts (matches drafts paste-order table)
# Idempotency:  NOT idempotent — re-running double-posts. Lock file guards.

set -euo pipefail

LOCK="/tmp/wk2-gh-presence-post.lock"
LOG_DIR="$(dirname "$0")/../logs"
mkdir -p "$LOG_DIR"
LOG="$LOG_DIR/wk2-gh-presence-post-$(date '+%Y%m%d-%H%M%S').log"

if [ -e "$LOCK" ]; then
  echo "Lock $LOCK exists — script already ran or is running. Aborting." | tee -a "$LOG"
  exit 1
fi
trap 'rm -f "$LOCK"' EXIT
touch "$LOCK"

post_comment() {
  local repo="$1"
  local issue="$2"
  local body="$3"
  echo ">>> $(date '+%Y-%m-%d %H:%M:%S %Z') posting to $repo#$issue" | tee -a "$LOG"
  local url
  url=$(gh api "repos/${repo}/issues/${issue}/comments" \
    -X POST -f body="$body" --jq '.html_url' 2>&1) || {
    echo "FAILED on $repo#$issue — output: $url" | tee -a "$LOG"
    exit 1
  }
  echo "    posted: $url" | tee -a "$LOG"
}

# --- verify gh auth before any post ---
gh auth status 2>&1 | tee -a "$LOG" >/dev/null || {
  echo "gh CLI not authenticated — run 'gh auth login' and retry" | tee -a "$LOG"
  exit 1
}

# ============================================================
# 1 — anthropics/claude-code#58841  (D2: top-level union schema)
# ============================================================
IFS='' read -r -d '' BODY1 <<'EOF' || true
The error is from the Anthropic API, not Claude Code itself — the relevant line is `tools.14.custom.input_schema: input_schema does not support oneOf, allOf, or anyOf at the top level`. That's a hard API-side validator: Anthropic accepts JSON Schema for tool input but rejects union keywords at the *top* of the schema object. Nested unions inside a property are fine; a top-level `{"oneOf": [...]}` or `{"anyOf": [...]}` for the whole tool input is not.

Two things to check on `tools.14`:

1. The tool's Python signature — if you're using FastMCP / Pydantic and the function takes `Union[A, B]` (or `A | B`) as its parameter type, Pydantic emits a top-level `anyOf` schema. The fix is to wrap the union inside a single keyword argument: `def my_tool(payload: Union[A, B])` is rejected; `def my_tool(payload: dict)` with internal validation, or a single concrete model containing the union, is accepted.
2. Whether you've got a `oneOf` at the root because you wrapped the whole tool in a discriminated union for "two variants of the same tool" — same rule applies. Anthropic wants the *root* of `input_schema` to be `{"type": "object", "properties": {...}}`.

The "infectious" behavior is actually the same tool getting re-sent on every subsequent request — once `tools.14` is malformed, every conversation turn replays the full tool catalog and the API keeps refusing. Restart Claude Code after fixing the offending tool and the 400s clear.

For finding which tool is the bad one without trial-and-error, two paths:
- Anthropic's MCP Inspector (`@modelcontextprotocol/inspector`) — interactive `tools/list` view; you can spot a top-level `anyOf` by reading the inputSchema panel for each tool.
- If you want a non-interactive scan that fails on schema-shape issues across the whole server, `npx @incultnitostudiosllc/mcp-probe test "<your launch command>"` outputs a scorecard that flags top-level-union schemas as a hard error. Useful in CI if you want this to never happen again.
EOF
post_comment "anthropics/claude-code" 58841 "$BODY1"
echo "    sleeping 300s before next post..." | tee -a "$LOG"
sleep 300

# ============================================================
# 2 — anthropics/claude-code#58794  (D4: $ref enum serialization)
# ============================================================
IFS='' read -r -d '' BODY2 <<'EOF' || true
The test matrix is sharp — the asymmetry between inline `Literal` and `$ref` is the key finding here. Two adjacent observations from running into the same path with Pydantic-generated schemas:

**The bug isn't just enum-specific — it's a `$ref` resolution gap.** Any `$ref` pointer into `$defs` (or `definitions`) on a parameter is at risk, not only enums. Try the same shape with `Optional[CustomModel]` where `CustomModel` is a simple Pydantic class with two string fields; the model can name the field correctly in its reasoning but the serialized payload arrives as `null` or as a flat dict missing the inner structure. Enums make the bug visually obvious because the value space is finite and the wrong value is a hard fail. Non-enum `$ref`s lose information more silently.

**Server-side workaround that doesn't require codegen changes:** if you're on FastMCP, you can post-process the tool's inputSchema in your `@mcp.tool()` decorator wrapper to inline `$ref`s before the server returns `tools/list`. FastMCP exposes the schema dict on the tool object; resolving `$defs` once at startup is ~15 lines of `jsonschema.RefResolver` and avoids changing every `Optional[Enum]` to `Optional[Literal[...]]` by hand.

The Cursor forum link in the OP and the Inspector issue both confirm this is a client-side resolver gap, not a server bug. Worth filing the same issue against `@modelcontextprotocol/typescript-sdk` since that's where most third-party clients pull their schema handling — if the SDK ships a resolver, every client downstream benefits.

For catching this at CI time before it hits an agent (which is what burned me on this — silent `null` deliveries that pass server-side null-coalescing and produce wrong output with no error), `npx @incultnitostudiosllc/mcp-probe test "<launch command>"` flags parameters where the resolved schema and the on-wire schema disagree. Complements MCP Inspector's interactive view — Inspector for "is the schema what I think it is", probe-style scan for "do all my tools survive `$ref` resolution".
EOF
post_comment "anthropics/claude-code" 58794 "$BODY2"
echo "    sleeping 300s before next post..." | tee -a "$LOG"
sleep 300

# ============================================================
# 3 — modelcontextprotocol/modelcontextprotocol#1990  (conformance suite — PROBE-FREE)
# ============================================================
IFS='' read -r -d '' BODY3 <<'EOF' || true
SEP-1627 (`#1627`) is the in-flight response to exactly this — Olivier Chafik & Paul Carleton drafted it in October, status is currently "Draft" and the prototype lives at `modelcontextprotocol/modelcontextprotocol#948`. Worth cross-linking from this issue so the conformance-testsuite discussion converges instead of splitting.

A few gaps between bmerkle's list and SEP-1627's current draft worth surfacing:

- **Tool schema correctness** (your point 3) isn't in SEP-1627's "test scenarios" enumeration as a first-class item — the SEP focuses on protocol-level traces (golden JSON-RPC chatter, SHOULDs vs MUSTs in framing). Schema-quality conformance (required `description` on every parameter, accurate `required` flags, enum constraints on finite-value fields) is arguably a separate axis. The spec leaves these as RECOMMENDATIONS today, which makes them un-testable under the current SEP framing.
- **Cancellation handling** (your point 10) is partially covered by golden traces but the spec is light on what the *server's* obligations are mid-cancel — i.e. whether in-flight side effects must be reverted. SEP-1627's golden-trace approach assumes spec-side decisions on that already exist.
- **Streaming responses** (your point 9) maps to SEP-1627's transport-specific compliance section but only for SSE today; HTTP+chunked and stdio framing aren't yet enumerated.

If a separate "schema-quality conformance" SEP is something the spec maintainers want to entertain, this issue is the natural place to fork it from — different problem space (RECOMMENDATION-grade lint) from SEP-1627's MUST/SHOULD-grade protocol gating, but the test harness shape would be reusable.
EOF
post_comment "modelcontextprotocol/modelcontextprotocol" 1990 "$BODY3"
echo "    sleeping 300s before next post..." | tee -a "$LOG"
sleep 300

# ============================================================
# 4 — anthropics/claude-code#56263  (Cowork/Desktop strips anyOf)
# ============================================================
IFS='' read -r -d '' BODY4 <<'EOF' || true
Worth separating the two diagnostic layers, because the bug is on the consuming end and the stripping pattern is more specific than just `Optional[X]`:

1. **Confirm the server is emitting the correct schema.** Your `curl` against the raw `tools/list` response already does this — `keywords` arrives with `anyOf: [{"items": ..., "type": "array"}, {"type": "null"}]` intact. That's the proof the server is doing its job and the SDK isn't truncating mid-stream.
2. **Confirm what the model actually sees.** This is where Desktop diverges from CLI. The model's tool-definition view (visible in the Cowork tab's "tools available" panel when you expand a tool) shows the post-processed schema — that's where the `anyOf` is gone.

The pattern that's getting stripped is more specific than `Optional[X]` in general — based on a similar repro I worked through, the trigger is **any property-level `anyOf` array whose members are *type schemas* rather than `$ref` schemas**. So `Optional[list[str]]` (your case), `Optional[dict[str, Any]]`, and `Optional[CustomTypedDict]` all hit it. Inline `$ref`-only `anyOf` (e.g. `anyOf: [{"$ref": "#/$defs/Foo"}, {"$ref": "#/$defs/Bar"}]`) survives — which is suggestive of where the bug lives in Desktop's preprocessing pipeline (probably a schema-flattener that drops the array when it can't reduce it to a single named type).

For other people hitting this thread: if you're not sure whether your server is upstream or downstream of the bug, **MCP Inspector** (`@modelcontextprotocol/inspector`) gives you a clickable view of the tools/list response so you can confirm the schema is intact server-side. For a one-shot non-interactive scan that records the on-wire schema for each tool, `npx @incultnitostudiosllc/mcp-probe test "<launch command>"` writes the resolved inputSchema to its scorecard output — useful for diffing against what Desktop ends up showing.

CLI preserving the full schema while Desktop strips it is the smoking gun — same SDK, different preprocessing path. Whichever team owns the Cowork tool-bridge layer is where the fix lives.
EOF
post_comment "anthropics/claude-code" 56263 "$BODY4"

echo "" | tee -a "$LOG"
echo "=== All 4 GH presence replies posted. Reddit (#5 r/mcp 22:30 + #6 r/ClaudeAI 22:45) still manual. ===" | tee -a "$LOG"
echo "Log: $LOG"
