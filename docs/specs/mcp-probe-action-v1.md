---
title: mcp-probe-action v1 — GitHub Marketplace Action Spec
status: draft
last_revised: 2026-05-18
ship_target: 2026-05-20 (Wed, Marketplace listing live)
authors: Peng + Claude (Opus 4.7, brainstorming + writing-plans flow)
parallel_to: docs/specs/publishability-score-v1.1.0.md
---

# mcp-probe-action v1 — GitHub Marketplace Action Spec

## Scope

Ship a GitHub Actions wrapper around `@incultnitollc/mcp-probe` to the GitHub Marketplace by **Wed 2026-05-20**. Greenfield Query 6 in the 10-query citation sweep ("MCP server CI pipeline GitHub Actions") becomes a Marketplace listing, not just a dev.to article. The Action is independent of v1.1.0 — ships against current `1.0.2` baseline + auto-picks-up `1.1.0` features once published Sat 5/23.

Out of scope for v1: Docker-based Action, GitLab CI, CircleCI orb, Bitbucket Pipes, self-hosted runner optimization, GHES (GitHub Enterprise Server). All single-target: GitHub.com hosted runners + composite Action type.

## Why this matters now

Wk2 D5 shipped `docs/ci.md` (2232 words, MCP Server CI Pipeline article). That article currently points at `npx @incultnitollc/mcp-probe` invocations inline. A Marketplace listing converts the article from "here's a recipe" to "here's a one-line `uses:` install" — orders-of-magnitude friction reduction for adoption.

Q6 baseline citation sweep (2026-05-10): owned by `mcp-quality-gate` on ChatGPT, generic-or-empty on Claude/Perplexity/Gemini. Marketplace listing is the strongest displacement signal possible — Marketplace results are surfaced in GitHub's own search + indexed by all four LLMs.

## Build-phase plan (3 calendar days, parallel to v1.1.0 D0-D2)

| Day | Date (TPE) | Work | Gate |
|---|---|---|---|
| D0 | Mon 5/18 | Spec block (this doc) + `action.yml` skeleton + composite run step + repo-root scaffolding | `act` (local Action runner) executes against this repo's own `ci.yml` workflow |
| D1 | Tue 5/19 | Marketplace `README.md` (root-level) + 3 example workflows + branding asset + `CHANGELOG.md` entry | dry-run via `act` on test repo; README renders correctly on github.com when previewed |
| D2 | Wed 5/20 | Tag `v1.0.0-action` (separate tag from CLI tags) → publish to Marketplace + initial workflow self-test by adding `uses: incultnitollc/mcp-probe@v1` to this repo's `ci.yml` | Marketplace listing live at `github.com/marketplace/actions/mcp-probe` |

**Slip rule:** if Marketplace publish slips past Wed 5/20, accept Thu 5/21 ship. If past Thu 5/21, defer until after v1.1.0 (Mon 5/26) — don't fragment Sat 5/23 publish day.

---

## 1. Action type — composite (not Docker, not JavaScript)

Three Action types exist on GitHub Marketplace: composite, Docker, JavaScript.

- **Composite** (chosen): single `action.yml` + bash steps that invoke `npx -y @incultnitollc/mcp-probe@<version> ...`. No build step. Re-runs use the runner's npx cache, ~5s warm. Fastest publish path — no container registry, no Node bundle, no transpile.
- **Docker container**: required if we shipped our own runtime. We don't — mcp-probe is already on npm. Avoid.
- **JavaScript** (typescript-action template): would bundle `@incultnitollc/mcp-probe` into the Action's `dist/` via ncc. Faster cold-start than composite, BUT requires committing a 2MB+ bundle and re-tagging the Action on every CLI release. Defer until after Marketplace traction justifies the maintenance cost.

Composite Action is the right v1 choice. Re-evaluate JavaScript Action in v2 if adoption justifies the maintenance overhead.

---

## 2. `action.yml` contract

Path: `action.yml` at **repo root** (Marketplace requires root or dedicated repo — putting it under `.github/actions/<name>/` would not show on Marketplace).

```yaml
name: 'mcp-probe — MCP server health check'
description: 'Validate your Model Context Protocol server in CI. Catches missing descriptions, broken tools, schema regressions, and pre-publish gotchas before users see them.'
author: 'Incultnito LLC'

branding:
  icon: 'check-circle'
  color: 'purple'

inputs:
  command:
    description: 'Command that launches your MCP server (e.g., "node dist/index.js" or "npx -y @your-scope/your-server")'
    required: true

  fail-under:
    description: 'Fail the job if the publishability composite score drops below this value (0–100). Requires --publishability. Default 0 (no gating, scorecard-only).'
    required: false
    default: '0'

  publishability:
    description: 'Run the publishability suite — 5 checks + 0-100 composite (requires mcp-probe >= 1.1.0). Default false (v1.1.0 ships 2026-05-23).'
    required: false
    default: 'false'

  package:
    description: 'Path to your MCP server''s package.json for the distribution-metadata check. Empty = skip the distribution check.'
    required: false
    default: ''

  html-report:
    description: 'Path to write the HTML report. Empty = skip HTML. Set to e.g. "mcp-report.html" then upload via actions/upload-artifact in a follow-on step.'
    required: false
    default: ''

  mcp-probe-version:
    description: 'mcp-probe npm version, dist-tag, or "latest". Default "latest". Pin to a specific version for reproducible builds.'
    required: false
    default: 'latest'

  json-output:
    description: 'Path to write the JSON report. Empty = skip JSON. Useful for downstream parsing.'
    required: false
    default: ''

outputs:
  composite-score:
    description: 'Publishability composite (0–100). Only set when publishability: "true" and mcp-probe >= 1.1.0.'
    value: ${{ steps.run-probe.outputs.composite-score }}

  band:
    description: 'Grade band: publishable / almost / rough / not-ready. Only set when publishability: "true".'
    value: ${{ steps.run-probe.outputs.band }}

  tools-pass-rate:
    description: 'tools_callable / tools_listed (as decimal, e.g. "0.83").'
    value: ${{ steps.run-probe.outputs.tools-pass-rate }}

  schema-warnings:
    description: 'Total schema warning count across all tools.'
    value: ${{ steps.run-probe.outputs.schema-warnings }}

runs:
  using: 'composite'
  steps:
    - name: Verify Node.js >= 20
      shell: bash
      run: |
        node_version=$(node --version | sed 's/v//' | cut -d. -f1)
        if [ "$node_version" -lt 20 ]; then
          echo "::error::mcp-probe requires Node.js 20+. Got version: $(node --version)"
          exit 1
        fi
        echo "Node.js $(node --version) — ok"

    - name: Run mcp-probe
      id: run-probe
      shell: bash
      env:
        MCP_PROBE_VERSION: ${{ inputs.mcp-probe-version }}
        COMMAND: ${{ inputs.command }}
        FAIL_UNDER: ${{ inputs.fail-under }}
        PUBLISHABILITY: ${{ inputs.publishability }}
        PACKAGE_PATH: ${{ inputs.package }}
        HTML_REPORT: ${{ inputs.html-report }}
        JSON_OUTPUT: ${{ inputs.json-output }}
      run: ${{ github.action_path }}/run-mcp-probe.sh
```

Companion script (`run-mcp-probe.sh` at repo root, executable):

```bash
#!/usr/bin/env bash
set -euo pipefail

# Build the mcp-probe invocation
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

# Always emit JSON for output parsing; respect user's --json path too
JSON_TMP="${RUNNER_TEMP:-/tmp}/mcp-probe-output.json"
ARGS+=("--json")

# Capture text output in addition for human-readable summary
TEXT_TMP="${RUNNER_TEMP:-/tmp}/mcp-probe-output.txt"

set +e
npx -y "@incultnitollc/mcp-probe@${MCP_PROBE_VERSION}" "${ARGS[@]}" > "$JSON_TMP" 2> "$TEXT_TMP"
EXIT_CODE=$?
set -e

# Surface human-readable output to job log
cat "$TEXT_TMP"

# If user requested a JSON file output, copy
if [ -n "$JSON_OUTPUT" ]; then
  cp "$JSON_TMP" "$JSON_OUTPUT"
fi

# Parse outputs (best-effort; uses jq if available, falls back to grep)
if command -v jq >/dev/null 2>&1; then
  COMPOSITE=$(jq -r '.score.composite // empty' "$JSON_TMP" 2>/dev/null || echo "")
  BAND=$(jq -r '.score.band // empty' "$JSON_TMP" 2>/dev/null || echo "")
  TOOLS_PASS=$(jq -r 'if .score.tools_total > 0 then (.score.tools_callable / .score.tools_total) else 0 end' "$JSON_TMP" 2>/dev/null || echo "0")
  SCHEMA_WARN=$(jq -r '.score.schema_warnings // 0' "$JSON_TMP" 2>/dev/null || echo "0")
else
  COMPOSITE=""
  BAND=""
  TOOLS_PASS="0"
  SCHEMA_WARN="0"
fi

# GHA outputs
{
  echo "composite-score=$COMPOSITE"
  echo "band=$BAND"
  echo "tools-pass-rate=$TOOLS_PASS"
  echo "schema-warnings=$SCHEMA_WARN"
} >> "$GITHUB_OUTPUT"

# Job summary (renders on the run page)
{
  echo "## mcp-probe results"
  echo ""
  if [ -n "$COMPOSITE" ]; then
    echo "**Composite score:** $COMPOSITE / 100 ($BAND)"
  fi
  echo "**Tools callable:** $TOOLS_PASS"
  echo "**Schema warnings:** $SCHEMA_WARN"
  echo ""
  echo "<details><summary>Full scorecard</summary>"
  echo ""
  echo '```'
  cat "$TEXT_TMP"
  echo '```'
  echo ""
  echo "</details>"
} >> "$GITHUB_STEP_SUMMARY"

exit "$EXIT_CODE"
```

---

## 3. File layout in repo

```
.
├── action.yml                      # Marketplace contract — REPO ROOT
├── run-mcp-probe.sh                # Composite-action runner script — REPO ROOT
├── .github/
│   └── workflows/
│       ├── ci.yml                  # existing — for mcp-probe CLI tests
│       └── action-self-test.yml    # NEW — uses ./ to self-test the Action
├── examples/                       # NEW — referenced from Marketplace README
│   ├── basic.yml
│   ├── publishability-gate.yml
│   └── matrix.yml
├── dist/                           # existing — CLI dist (npm-published)
├── src/                            # existing — CLI source
└── ...
```

Repo-root placement is required by GitHub Marketplace. The Action and the CLI share a repo (`incultnitollc/mcp-probe`) but live in separate file domains:

- **CLI domain:** `src/`, `dist/`, `package.json`, `tsconfig.json`
- **Action domain:** `action.yml`, `run-mcp-probe.sh`, `examples/`

`.npmignore` adds: `action.yml`, `run-mcp-probe.sh`, `examples/`, `.github/workflows/action-self-test.yml` — keeps the npm tarball lean.

---

## 4. Marketplace README (separate from repo README)

GitHub Marketplace uses the repo README as the landing page. Two paths:

**Path A — overwrite root README to dual-purpose.** Repo README becomes "mcp-probe — CLI + GitHub Action" with both install paths. Risk: dilutes CLI focus.

**Path B (recommended) — restructure root README into ToC sections.** Sections: "Install (npm)" + "Install (GitHub Action)". Each section has its own quick-start. Marketplace reads the full README; the "GitHub Action" anchor surfaces in Marketplace landing-page rendering.

**Path B chosen.** Restructure existing `README.md` (4881 bytes) to add a new "## GitHub Action" section after "## CLI" with minimum-working `uses:` example + link to `examples/` folder + link to full Marketplace listing.

---

## 5. Example workflows (in `examples/`)

### 5.1 `examples/basic.yml` — minimal

```yaml
name: mcp-probe health check

on: [push, pull_request]

jobs:
  health:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build

      - uses: incultnitollc/mcp-probe@v1
        with:
          command: 'node dist/index.js'
```

### 5.2 `examples/publishability-gate.yml` — block PRs below threshold

```yaml
name: Publishability gate

on:
  pull_request:
    branches: [main]

jobs:
  gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build

      - id: probe
        uses: incultnitollc/mcp-probe@v1
        with:
          command: 'node dist/index.js'
          publishability: 'true'
          package: './package.json'
          fail-under: '70'

      - name: Comment on PR
        if: always()
        uses: actions/github-script@v7
        with:
          script: |
            const score = '${{ steps.probe.outputs.composite-score }}';
            const band = '${{ steps.probe.outputs.band }}';
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `**Publishability:** ${score}/100 (${band})`
            });
```

### 5.3 `examples/matrix.yml` — test against multiple Node versions + upload artifact

```yaml
name: Multi-Node matrix

on: [push, pull_request]

jobs:
  matrix:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: ['20', '22']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm ci
      - run: npm run build

      - uses: incultnitollc/mcp-probe@v1
        with:
          command: 'node dist/index.js'
          html-report: 'mcp-report-${{ matrix.node }}.html'

      - if: always()
        uses: actions/upload-artifact@v4
        with:
          name: mcp-report-node-${{ matrix.node }}
          path: mcp-report-${{ matrix.node }}.html
```

---

## 6. Marketplace listing copy

**Listing title:** `mcp-probe — MCP server health check`

**Tagline (160 char limit):** `Validate your Model Context Protocol server in CI. Catches missing descriptions, broken tools, schema regressions before users see them.`

**Categories** (Marketplace allows 1 primary + 1 secondary):
- Primary: **Continuous integration**
- Secondary: **Testing**

**Tags:**
`mcp`, `model-context-protocol`, `validation`, `testing`, `ci`, `health-check`, `schema`, `llm`, `ai`, `claude`

**Branding icon:** `check-circle` (Feather Icons set — Marketplace's standard icon library)
**Branding color:** `purple` (matches Anthropic visual ecosystem; also Incultnito brand `#820855` adjacent)

---

## 7. Versioning strategy

Two tag namespaces in one repo:

- **CLI tags:** `v1.0.0`, `v1.0.1`, `v1.0.2`, `v1.1.0`, ... — track npm package version. Existing.
- **Action tags:** `v1`, `v1.0.0-action`, `v2`, ... — track Action contract. NEW.

Action releases follow GitHub Actions convention: a major-version floating tag (`v1`) that always points at the latest `v1.x.x-action` release. Users pin to `incultnitollc/mcp-probe@v1` (floating) or `@v1.0.0-action` (immutable).

**On v1 release (Wed 5/20):**
1. Tag `v1.0.0-action` on the commit that lands `action.yml` + `run-mcp-probe.sh` + examples.
2. Tag `v1` pointing at the same commit (floating major-version pointer).
3. Submit to Marketplace via `github.com/incultnitollc/mcp-probe/releases/new` → "Publish this Action to the GitHub Marketplace" checkbox.

**On subsequent Action releases:**
- Move `v1` to the new commit alongside the new immutable tag (`v1.0.1-action`, etc.).
- Use `git tag -f v1` + `git push origin v1 --force` (force-update floating major tag).

**Independence from CLI release cycle:**
- Action doesn't need a re-tag when CLI ships `1.1.0` Sat 5/23, because the Action calls `npx -y @incultnitollc/mcp-probe@${MCP_PROBE_VERSION}` with default `latest`.
- Users on `@v1` automatically pick up 1.1.0 features by setting `publishability: 'true'` in their workflow.

---

## 8. Self-test workflow (`.github/workflows/action-self-test.yml`)

```yaml
name: Action self-test

on:
  push:
    branches: [main]
  pull_request:

jobs:
  self-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci
      - run: npm run build

      # Run the LOCAL action (not the Marketplace version)
      # test-fixtures live as .ts — use tsx since this repo doesn't compile them to dist
      - uses: ./
        with:
          command: 'npx tsx test-fixtures/publishable-server.ts'
          publishability: 'true'
          fail-under: '70'
```

This catches `action.yml` regressions before they ship. Runs on every push to main.

---

## 9. Verification gates

- **D0 gate (Mon 5/18):** `action.yml` + `run-mcp-probe.sh` committed; `act -j health` runs locally against `examples/basic.yml`.
- **D1 gate (Tue 5/19):** README dual-section restructured, 3 examples committed, branding asset confirmed; preview the README on GitHub UI renders without errors.
- **D2 gate (Wed 5/20):** `v1.0.0-action` tag pushed + Marketplace publish completed via GitHub UI (release page → "Publish this Action to the GitHub Marketplace" checkbox) + Marketplace listing accessible at `github.com/marketplace/actions/mcp-probe` + self-test workflow green on main.

If D2 gate slips, accept D3 (Thu 5/21). If past D3, defer Action publish to Mon 5/26 to avoid fragmenting the v1.1.0 Sat 5/23 ship day.

---

## 10. Distribution plan after Marketplace launch (Thu 5/21 onward, parallel to v1.1.0 D3-D5)

1. **Update `docs/ci.md`** (the Wk2 D5 article, currently published on GitHub blog + dev.to mirror): add a top-of-article "Just want the one-liner?" section pointing at the Marketplace listing.
2. **dev.to update** to the mirrored CI article with the same "Just want the one-liner?" lede.
3. **Hashnode mirror** of `docs/ci.md` referenced in `docs/launch/wk2-hashnode-mirror-ci.md` — publish + add Marketplace lede.
4. **r/mcp** — defer until u/incultnito karma builds (per `feedback_reddit_velocity.md`). Add to backlog: a self-contained, probe-free post answering "how do I run MCP server tests in CI?" with the Marketplace listing as the natural answer.
5. **awesome-mcp-devtools** (currently has PR #156 open for CLI listing): comment on the PR with a follow-on suggestion to add `mcp-probe-action` once the open PR merges. Do NOT open a competing PR while the first is open-stale.

---

## 11. Open questions for build phase

1. Branding asset — Marketplace accepts a 64×64 PNG OR uses the `branding.icon` Feather Icon. Default to icon-only for v1 (zero asset overhead). Re-evaluate for v2.
2. Should `mcp-probe-version` default to `latest` (always pick up upgrades) or `^1` (pick up minor/patch but not majors)? Default `latest` for v1; users can pin if they want reproducible builds. v2 may default to `^1` once `2.0.0` becomes a foreseeable horizon.
3. `act` (local Action runner) compatibility — composite Actions with environment variables can hit edge cases in `act`. Verify D0 morning before committing to the composite type. Fallback if `act` fails: skip local-runner testing, lean on `action-self-test.yml` workflow once tag is pushed.
4. Output `tools-pass-rate` as decimal `0.83` or percentage `83`? Decimal is parser-friendly; percentage is human-friendly. Pick decimal; downstream workflows can multiply.
5. Marketplace approval timeline — GitHub typically auto-approves first-time Marketplace publishes within 1-2 hours, but can hold for review up to 5 days for "high-risk" categories. Continuous integration is low-risk; expect same-day. Slip rule already accounts for this.

---

**End of spec.** Build phase begins D0 = Mon 2026-05-18 (parallel track to publishability-score-v1.1.0). Spec is the contract — deviations during build go in a follow-up `docs/specs/mcp-probe-action-v1-amendments.md` rather than editing this file in place.
