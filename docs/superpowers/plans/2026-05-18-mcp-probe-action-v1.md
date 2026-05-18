# mcp-probe-action v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `incultnitollc/mcp-probe@v1` to the GitHub Marketplace by Wed 2026-05-20 — a composite GitHub Action that wraps `@incultnitollc/mcp-probe` CLI with `command`, `fail-under`, `publishability`, and `html-report` inputs.

**Architecture:** Composite Action (no Docker, no JavaScript bundle) — `action.yml` at repo root + a `run-mcp-probe.sh` script that calls `npx -y @incultnitollc/mcp-probe@<version>` with parsed flags. Independent of v1.1.0 release cycle — users on `@v1` automatically pick up 1.1.0 features once `publishability: 'true'` is set.

**Tech Stack:** GitHub Actions composite type, bash, optional `jq` for output parsing. No Node bundle, no TypeScript build.

**Spec:** `docs/specs/mcp-probe-action-v1.md` (commit `809f7d4`).

---

## File Structure

```
.
├── action.yml                              # NEW — Marketplace contract (REPO ROOT)
├── run-mcp-probe.sh                        # NEW — composite-action runner (REPO ROOT)
├── README.md                               # MODIFY — add "## GitHub Action" section
├── CHANGELOG.md                            # MODIFY — Action v1 entry (separate from CLI 1.1.0)
├── .npmignore                              # MODIFY — exclude Action artifacts from npm tarball
├── .github/workflows/
│   └── action-self-test.yml                # NEW — runs ./ against test-fixtures
└── examples/                               # NEW directory
    ├── basic.yml                           # NEW
    ├── publishability-gate.yml             # NEW
    └── matrix.yml                          # NEW
```

---

## Day 0 — Mon 2026-05-18 (today)

### Task 0.1: Create `action.yml` at repo root

**Files:**
- Create: `action.yml` (repo root)

- [ ] **Step 1: Verify Marketplace constraints**

Verify the working directory is the repo root and that no `action.yml` exists yet:

Run: `ls action.yml 2>/dev/null && echo "EXISTS" || echo "NOT YET"`
Expected: `NOT YET`.

- [ ] **Step 2: Write `action.yml`**

Create `action.yml` at repo root:

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
    description: 'Fail the job if the publishability composite score drops below this value (0–100). Requires publishability: "true". Default 0 (no gating, scorecard-only).'
    required: false
    default: '0'

  publishability:
    description: 'Run the publishability suite — 5 checks + 0–100 composite (requires mcp-probe >= 1.1.0). Default false (v1.1.0 ships 2026-05-23).'
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

- [ ] **Step 3: Validate YAML syntax**

Run: `npx --yes js-yaml action.yml >/dev/null && echo "YAML OK"`
Expected: `YAML OK`. (If `js-yaml` is unavailable, use `python3 -c "import yaml; yaml.safe_load(open('action.yml'))" && echo "YAML OK"`.)

- [ ] **Step 4: Commit**

```bash
git add action.yml
git commit -m "feat(action): action.yml — composite Action contract for Marketplace (action D0)"
```

---

### Task 0.2: Create `run-mcp-probe.sh` runner script

**Files:**
- Create: `run-mcp-probe.sh` (repo root)

- [ ] **Step 1: Write the runner script**

Create `run-mcp-probe.sh`:

```bash
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
```

- [ ] **Step 2: Make it executable**

Run: `chmod +x run-mcp-probe.sh`

- [ ] **Step 3: Lint with shellcheck**

Run: `shellcheck run-mcp-probe.sh 2>&1 | head -20`
Expected: zero errors. Warnings about quoting are acceptable for this script.

If `shellcheck` is not installed: `brew install shellcheck` then re-run.

- [ ] **Step 4: Local dry-run (without GHA env vars present)**

Run:
```bash
COMMAND="npx tsx test-fixtures/publishable-server.ts" \
  RUNNER_TEMP=/tmp \
  GITHUB_OUTPUT=/tmp/gha-output.txt \
  GITHUB_STEP_SUMMARY=/tmp/gha-summary.md \
  ./run-mcp-probe.sh 2>&1 | tail -20
```
Expected: mcp-probe runs against the publishable fixture, output captured, GHA output file populated.

Run: `cat /tmp/gha-output.txt`
Expected: 4 lines (composite-score, band, tools-pass-rate, schema-warnings). composite-score and band may be empty since `publishability` was not enabled in this dry-run.

- [ ] **Step 5: Commit**

```bash
git add run-mcp-probe.sh
git commit -m "feat(action): run-mcp-probe.sh — Action runner script with GHA output parsing (action D0)"
```

---

### Task 0.3: Update `.npmignore` to exclude Action artifacts

**Files:**
- Modify: `.npmignore`

- [ ] **Step 1: Verify current .npmignore**

Run: `cat .npmignore`

- [ ] **Step 2: Append Action exclusions**

Append to `.npmignore`:

```
action.yml
run-mcp-probe.sh
examples/
.github/workflows/action-self-test.yml
```

(These are repo-root Action files that have no business in the npm CLI tarball.)

- [ ] **Step 3: Verify npm pack excludes them**

Run: `npm pack --dry-run 2>&1 | grep -E "action.yml|run-mcp-probe.sh|examples/" || echo "EXCLUDED OK"`
Expected: `EXCLUDED OK`.

- [ ] **Step 4: Commit**

```bash
git add .npmignore
git commit -m "chore(action): .npmignore excludes Action artifacts from npm tarball (action D0)"
```

---

### Task 0.4: Optional — local Action test via `act`

**Files:**
- (read-only; no commits)

- [ ] **Step 1: Check if `act` is installed**

Run: `which act && act --version`
Expected: a version number.

If not installed: `brew install act` (macOS).

- [ ] **Step 2: Create a temporary workflow that uses the local Action**

Run:
```bash
cat > /tmp/act-test-workflow.yml <<'EOF'
name: act-test
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - uses: ./
        with:
          command: 'npx tsx test-fixtures/publishable-server.ts'
EOF
```

- [ ] **Step 3: Run `act` against the workflow**

Run: `act --workflows /tmp/act-test-workflow.yml --pull=false push 2>&1 | tail -30`
Expected: composite Action runs end-to-end. (If `act` has trouble with the composite + tsx fixture, accept the limitation and rely on the in-repo `action-self-test.yml` workflow once tags are pushed — `act` compatibility is best-effort.)

This step is a checkpoint, not a gate. If `act` fails for an environmental reason, proceed to D1 — the real validation is the in-repo self-test workflow that runs on push.

- [ ] **Step 4: Clean up**

Run: `rm /tmp/act-test-workflow.yml`

No commit.

---

## Day 1 — Tue 2026-05-19

### Task 1.1: Restructure README.md to add GitHub Action section

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Read current README**

Run: `wc -l README.md && head -30 README.md`
Note the current top-level structure.

- [ ] **Step 2: Add a GitHub Action section**

Edit `README.md` — after the existing CLI / Quick start sections (or just before the "Compared to MCP Inspector" section, whichever exists), insert:

```markdown
## GitHub Action

Drop mcp-probe into your MCP server's GitHub Actions workflow in two lines:

```yaml
- uses: incultnitollc/mcp-probe@v1
  with:
    command: 'node dist/index.js'
```

Gate your PRs on a publishability composite:

```yaml
- uses: incultnitollc/mcp-probe@v1
  with:
    command: 'node dist/index.js'
    publishability: 'true'
    package: './package.json'
    fail-under: '70'
```

More examples: [`examples/basic.yml`](examples/basic.yml) · [`examples/publishability-gate.yml`](examples/publishability-gate.yml) · [`examples/matrix.yml`](examples/matrix.yml).

Marketplace listing: [github.com/marketplace/actions/mcp-probe](https://github.com/marketplace/actions/mcp-probe).
```

- [ ] **Step 3: Verify formatting**

Run: `grep -A 20 "## GitHub Action" README.md`
Expected: the new section reads cleanly with code blocks intact.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs(action): README — GitHub Action section + Marketplace link (action D1)"
```

---

### Task 1.2: Create `examples/basic.yml`

**Files:**
- Create: `examples/basic.yml`

- [ ] **Step 1: Create examples directory**

Run: `mkdir -p examples`

- [ ] **Step 2: Write the basic example**

Create `examples/basic.yml`:

```yaml
# examples/basic.yml — minimal workflow using mcp-probe-action
#
# Copy this into .github/workflows/mcp-probe.yml in your MCP server's
# repository. Adjust `command:` to match how you launch your server.

name: mcp-probe health check

on:
  push:
    branches: [main]
  pull_request:

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

- [ ] **Step 3: Commit**

```bash
git add examples/basic.yml
git commit -m "docs(action): examples/basic.yml — minimal Action workflow (action D1)"
```

---

### Task 1.3: Create `examples/publishability-gate.yml`

**Files:**
- Create: `examples/publishability-gate.yml`

- [ ] **Step 1: Write the publishability-gate example**

Create `examples/publishability-gate.yml`:

```yaml
# examples/publishability-gate.yml — gate PRs on the publishability composite
#
# Requires @incultnitollc/mcp-probe >= 1.1.0 (the publishability suite).
# Adjust `command:` to match how you launch your server.

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
            const band  = '${{ steps.probe.outputs.band }}';
            if (!score) return;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo:  context.repo.repo,
              body:  `**Publishability:** ${score}/100 (${band})`,
            });
```

- [ ] **Step 2: Commit**

```bash
git add examples/publishability-gate.yml
git commit -m "docs(action): examples/publishability-gate.yml — PR comment on composite (action D1)"
```

---

### Task 1.4: Create `examples/matrix.yml`

**Files:**
- Create: `examples/matrix.yml`

- [ ] **Step 1: Write the matrix example**

Create `examples/matrix.yml`:

```yaml
# examples/matrix.yml — run mcp-probe across multiple Node versions,
# upload each run's HTML report as a build artifact.

name: Multi-Node matrix

on:
  push:
    branches: [main]
  pull_request:

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

- [ ] **Step 2: Commit**

```bash
git add examples/matrix.yml
git commit -m "docs(action): examples/matrix.yml — Node matrix + HTML artifact (action D1)"
```

---

### Task 1.5: Add Action CHANGELOG entry

**Files:**
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Append an Action section**

If the CHANGELOG currently has the v1.1.0 CLI entry at top, add ABOVE it (separate v-prefix to indicate Action release):

```markdown
## action-v1.0.0 — 2026-05-20

### Added — `mcp-probe-action` published to GitHub Marketplace

- Composite GitHub Action wrapping `@incultnitollc/mcp-probe` CLI
- Inputs: `command`, `fail-under`, `publishability`, `package`, `html-report`, `mcp-probe-version`, `json-output`
- Outputs: `composite-score`, `band`, `tools-pass-rate`, `schema-warnings`
- Marketplace listing: github.com/marketplace/actions/mcp-probe
- Examples in `examples/basic.yml`, `examples/publishability-gate.yml`, `examples/matrix.yml`
- Self-test workflow `.github/workflows/action-self-test.yml`

Independent of npm CLI release cycle; users on `@v1` pick up CLI updates automatically via `mcp-probe-version: latest` default.

```

- [ ] **Step 2: Commit**

```bash
git add CHANGELOG.md
git commit -m "docs(action): CHANGELOG action-v1.0.0 entry (action D1)"
```

---

### Task 1.6: Create `.github/workflows/action-self-test.yml`

**Files:**
- Create: `.github/workflows/action-self-test.yml`

- [ ] **Step 1: Write the self-test workflow**

Create `.github/workflows/action-self-test.yml`:

```yaml
name: action-self-test

on:
  push:
    branches: [main]
  pull_request:
  workflow_dispatch:

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
```

Note: do NOT add `publishability: 'true'` here until v1.1.0 ships Sat 5/23. Adding it now would fail because 1.0.2 doesn't have the flag. A follow-up commit on Sat 5/23 can flip it on.

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/action-self-test.yml
git commit -m "ci(action): self-test workflow runs ./ against publishable fixture (action D1)"
```

---

### Task 1.7: Push everything for Tue end-of-day

**Files:**
- (push only)

- [ ] **Step 1: Confirm clean working tree**

Run: `git status`
Expected: only untracked `.claude/` / `.playwright-mcp/`; no uncommitted changes.

- [ ] **Step 2: Push commits to origin**

Run: `git push origin main`
Expected: HEAD pushed; multiple commits go up.

- [ ] **Step 3: Verify self-test workflow runs green**

Run: `gh run list --workflow=action-self-test.yml --limit 1`
Expected: a "queued" or "completed" run for the latest push.

Watch it until completion: `gh run watch $(gh run list --workflow=action-self-test.yml --limit 1 --json databaseId --jq '.[0].databaseId')`
Expected: green check. If failure, drill into logs and fix BEFORE D2.

No additional commit needed.

---

## Day 2 — Wed 2026-05-20 (SHIP)

### Task 2.1: Tag immutable + floating major versions

**Files:**
- (git tags only)

- [ ] **Step 1: Confirm `main` is at the desired HEAD**

Run: `git log -1 --oneline`
Note the SHA.

- [ ] **Step 2: Create immutable Action tag**

Run: `git tag -a v1.0.0-action -m "mcp-probe-action v1.0.0 — initial Marketplace release"`

- [ ] **Step 3: Create floating major tag `v1`**

Run: `git tag -a v1 -m "mcp-probe-action v1 — floating major; tracks latest v1.x.x-action"`

- [ ] **Step 4: Push tags**

Run: `git push origin v1.0.0-action v1`
Expected: both tags pushed.

- [ ] **Step 5: Verify tags are visible on GitHub**

Run: `gh api repos/incultnitollc/mcp-probe/tags --jq '.[].name' | head -10`
Expected: `v1` and `v1.0.0-action` appear in the list.

---

### Task 2.2: Create GitHub Release that publishes to Marketplace

**Files:**
- (release only)

- [ ] **Step 1: Create a release for `v1.0.0-action`**

Run:
```bash
gh release create v1.0.0-action \
  --title "mcp-probe-action v1.0.0 — Marketplace launch" \
  --notes "$(cat <<'EOF'
First Marketplace release of `mcp-probe-action`.

## Quick start

\`\`\`yaml
- uses: incultnitollc/mcp-probe@v1
  with:
    command: 'node dist/index.js'
\`\`\`

## Inputs
- `command` (required) — server launch command
- `fail-under` — composite threshold (0–100), requires `publishability: true`
- `publishability` — opt into the v1.1.0+ publishability suite
- `package` — path to package.json for distribution-metadata check
- `html-report` — output path for HTML scorecard
- `mcp-probe-version` — pin to a specific npm version, default \`latest\`
- `json-output` — output path for JSON report

## Outputs
- `composite-score`, `band`, `tools-pass-rate`, `schema-warnings`

See [`examples/`](https://github.com/incultnitollc/mcp-probe/tree/v1/examples) for full workflows.

Spec: [`docs/specs/mcp-probe-action-v1.md`](https://github.com/incultnitollc/mcp-probe/blob/v1/docs/specs/mcp-probe-action-v1.md)
EOF
)"
```

- [ ] **Step 2: Publish to Marketplace via the GitHub web UI**

The `gh release create` command above creates the release but does NOT automatically publish to Marketplace. Marketplace publish requires the checkbox in the web UI.

Open in browser: `gh release view v1.0.0-action --web`

Expected flow in browser:
1. Click "Edit release"
2. Scroll to "Publish this Action to the GitHub Marketplace"
3. Tick the checkbox + agree to terms
4. Select primary category: **Continuous integration**
5. Select secondary category: **Testing**
6. Click "Update release"

After publish, the listing appears at: `https://github.com/marketplace/actions/mcp-probe`

- [ ] **Step 3: Verify Marketplace listing live**

Run: `curl -sI https://github.com/marketplace/actions/mcp-probe | head -1`
Expected: `HTTP/2 200`. If `301` redirecting to elsewhere or `404`, the listing is not yet live — wait 10 min and retry.

- [ ] **Step 4: Update memory**

Append a line to `/Users/pengspirit/.claude/projects/-Users-pengspirit-incultnito-Dev-Backend-repos-Month-1-and-2---MCP-Inspect/memory/project_launch.md` under a new `## mcp-probe-action SHIPPED — 2026-05-20` section noting Marketplace URL + tag.

---

### Task 2.3: Update the launch memory with shipped state

**Files:**
- Modify: `/Users/pengspirit/.claude/projects/-Users-pengspirit-incultnito-Dev-Backend-repos-Month-1-and-2---MCP-Inspect/memory/project_launch.md`

- [ ] **Step 1: Append a closeout section**

Append:

```markdown
## mcp-probe-action SHIPPED — 2026-05-20

`mcp-probe-action@v1` live on GitHub Marketplace: https://github.com/marketplace/actions/mcp-probe

- Spec: `docs/specs/mcp-probe-action-v1.md`
- Tags: `v1.0.0-action` (immutable), `v1` (floating major)
- Self-test: `.github/workflows/action-self-test.yml` green
- Examples: `examples/basic.yml`, `examples/publishability-gate.yml`, `examples/matrix.yml`

Independent of npm release cycle. Users on `@v1` automatically pick up `@incultnitollc/mcp-probe@1.1.0` features once Sat 5/23 ship lands (via `mcp-probe-version: latest` default).
```

- [ ] **Step 2: Update MEMORY.md index**

Bump the `description:` line on `project_launch.md` to note Action shipped.

---

## Day 3 — Thu 2026-05-21 (distribution drop)

### Task 3.1: Update `docs/ci.md` with Marketplace lede

**Files:**
- Modify: `docs/ci.md`

- [ ] **Step 1: Verify current article state**

Run: `head -30 docs/ci.md`

- [ ] **Step 2: Add a "Quick start (one-liner)" section at the top**

After the article title/intro (preserving SEO target framing for Query 6), insert:

```markdown
## Quick start: just the one-liner

If you only want the install, drop this into `.github/workflows/mcp-probe.yml`:

```yaml
- uses: incultnitollc/mcp-probe@v1
  with:
    command: 'node dist/index.js'
```

Marketplace listing: [github.com/marketplace/actions/mcp-probe](https://github.com/marketplace/actions/mcp-probe).

The rest of this article explains how it works, what each input means, and where it fits in your CI pipeline.

---
```

- [ ] **Step 3: Commit**

```bash
git add docs/ci.md
git commit -m "docs(ci): add Marketplace one-liner lede to ci.md (action D3)"
```

- [ ] **Step 4: Push**

Run: `git push origin main`

---

### Task 3.2: Update dev.to mirror of `docs/ci.md`

**Files:**
- (manual dev.to edit via UI; no repo file)

- [ ] **Step 1: Identify the dev.to URL for the Wk2 CI article**

From `project_launch.md` Wk2 D5 closeout (`docs/ci.md` was committed but dev.to URL is in Hashnode payload `docs/launch/wk2-hashnode-mirror-ci.md`).

Run: `grep -E "dev.to|URL" docs/launch/wk2-hashnode-mirror-ci.md 2>/dev/null | head -5`

If no dev.to mirror exists yet for `docs/ci.md`, skip this task — dev.to was deferred.

- [ ] **Step 2: If a dev.to mirror exists, paste the same "Quick start (one-liner)" lede into the article via dev.to web UI**

Per `feedback_devto_rate_limit.md`, manual paste workflow — do not auto-POST.

No repo commit.

---

### Task 3.3: Publish Hashnode mirror with Marketplace lede

**Files:**
- (manual Hashnode publish; no repo file)

- [ ] **Step 1: Open the Hashnode mirror payload**

Run: `cat docs/launch/wk2-hashnode-mirror-ci.md | head -30`

- [ ] **Step 2: Add the same Marketplace one-liner lede to the payload**

Edit `docs/launch/wk2-hashnode-mirror-ci.md` and insert the lede block at the top (matching the one added to `docs/ci.md` in Task 3.1).

- [ ] **Step 3: Manually paste into Hashnode editor and publish**

(Per the manual-publish workflow used for Wk2 Q7 drop. No automation.)

- [ ] **Step 4: Commit the updated payload**

```bash
git add docs/launch/wk2-hashnode-mirror-ci.md
git commit -m "docs(launch): hashnode payload — Marketplace one-liner lede (action D3)"
```

- [ ] **Step 5: Push**

Run: `git push origin main`

---

## Optional Day 4+ — distribution to awesome lists (only if v1.1.0 also ships clean Sat 5/23)

### Task 4.1: Open follow-on PR to awesome-mcp-devtools

**Files:**
- (external PR; tracked via gh CLI)

- [ ] **Step 1: Check status of existing PR #156**

Run: `gh api repos/punkpeye/awesome-mcp-devtools/pulls/156 --jq '.state'`

If `closed`: skip — figure out whether merged or rejected before any follow-up.
If `open`: leave a comment offering to add `mcp-probe-action` as a follow-on, but do NOT open a parallel PR.

- [ ] **Step 2: If PR #156 merged, open a small follow-up PR**

Branch and edit the README/Testing-Tools section, adding the Action listing alongside the CLI listing.

Do NOT auto-batch with v1.1.0 ship-day work. This is post-ship distribution, runs at lowest priority.

---

## Self-Review (writing-plans skill checklist)

**1. Spec coverage:** All sections of `docs/specs/mcp-probe-action-v1.md` map to tasks above.
- §1 (Action type — composite): documented in plan header.
- §2 (action.yml contract): Task 0.1.
- §3 (file layout): mapped across Tasks 0.1, 0.2, 0.3, 1.1–1.6.
- §4 (Marketplace README — Path B): Task 1.1.
- §5 (example workflows): Tasks 1.2, 1.3, 1.4.
- §6 (Marketplace listing copy): captured in Task 2.2 release notes + browser-flow step.
- §7 (versioning strategy): Task 2.1.
- §8 (self-test workflow): Task 1.6.
- §9 (verification gates): mapped per-day implicitly via "Push" / "Verify" steps.
- §10 (distribution plan after launch): Tasks 3.1, 3.2, 3.3, 4.1.
- §11 (open questions): #1 default to icon-only — encoded in Task 0.1 `branding.icon`; #2 default `latest` — encoded; #3 `act` flagged best-effort in Task 0.4; #4 decimal output — encoded in run-mcp-probe.sh; #5 Marketplace approval timeline — accepted in Task 2.2.

**2. Placeholder scan:** Zero TBD/TODO. Manual UI flows (dev.to publish, Marketplace web-UI checkbox) are unavoidable but documented as explicit user-driven steps with exact navigation.

**3. Type consistency:** Input names (`command`, `fail-under`, `publishability`, `package`, `html-report`, `mcp-probe-version`, `json-output`) and output names (`composite-score`, `band`, `tools-pass-rate`, `schema-warnings`) are consistent across action.yml (Task 0.1), run-mcp-probe.sh (Task 0.2), and all 3 examples (Tasks 1.2, 1.3, 1.4).

---

**End of plan.**
