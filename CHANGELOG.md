# Changelog

All notable changes to `@incultnitollc/mcp-probe` are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] — 2026-07-09

### Added — contract testing ("VCR for MCP")

A third diagnostic lane alongside `test` (health) and `score` (publishability): **regression testing across versions.** Record a snapshot of a server's contract surface, commit it, then diff or gate every PR against it — catching breaking schema changes and, critically, **tool-description mutations (the rug-pull / tool-poisoning vector)** before they ship.

- **New `record` subcommand** — connects and captures the server's tools / resources / prompts and their schemas to a `.mcpvcr` snapshot. Lists only — never calls a tool, reads a resource, or gets a prompt, so it is safe against live servers. Snapshots are **deterministic** (sorted, stable-keyed): re-recording an unchanged server yields a byte-identical file. `--stamp` adds an informational `recordedAt`; `--out` sets the path.
- **New `diff` subcommand** — compares a live server (or a second `.mcpvcr` via `--against`) to a recorded `--baseline`, classifying every change as **breaking** (removed tool, new required arg, removed property, type change, narrowed enum), **security** (tool-description mutation, dropped `readOnlyHint`, tool became destructive), **additive** (new tool/optional field, widened enum), or **info**. `--json` for machine output, `--markdown <path>` for a ready-to-post PR comment.
- **New `gate` subcommand** — the CI enforcement point. Runs the diff and exits non-zero when it contains disallowed changes. Defaults to `--fail-on breaking,security`; tune with any comma-separated severity set.
- **Library API** — `buildSnapshot`, `readSnapshot`/`writeSnapshot`, `diffSnapshots`, `captureSnapshot`, `evaluateGate`, `renderDiffMarkdown`, and their types are exported from the package entry for programmatic use (e.g. the MCP Registry adapter).
- **New example workflow** — [`examples/contract-gate.yml`](examples/contract-gate.yml): record a committed baseline, gate PRs, and auto-comment the classified diff.

Rides the **2026-07-28 MCP spec** breaking changes: a `.mcpvcr` baseline turns "did we break our clients?" into a one-line CI check.

## [1.1.0] — 2026-05-22

### Added — publishability score

A second, complementary diagnostic alongside the existing `test` flow: a **publishability composite** that scores an MCP server 0–100 on whether its schemas, descriptions, and metadata are ready for other people to install.

- **New `score` subcommand** — shorthand for `test --publishability-only`. Skips the standard inspection phases by default and runs only the publishability suite. Add `--full` to run both.
- **New `--publishability` flag** on `test` — runs the publishability suite alongside the standard inspection.
- **New `--publishability-only` flag** on `test` — runs only the publishability suite, skipping tool/resource/prompt execution.
- **New `--fail-under <score>` flag** — exits non-zero if the composite drops below the threshold (0–100). Wires into CI gates.
- **New `--package <path>` flag** — points the `distribution-metadata` check at a local `package.json`. Skipped when omitted.
- **Five-axis breakdown:**
  - `description-five-axis` — per-tool description density across purpose, mutation, side-effects, invariants, examples. Tools averaging <3.0/5 axes fire a ≤60 composite cap.
  - `enum-shape` — catches prose-only enums (description says "one of: A, B" with no JSON Schema `enum`).
  - `mutation-legibility` — does each tool tell a planner it mutates or only reads (name prefix / description signal / annotation).
  - `anti-purpose-clause` — high-blast tools (delete, send, transfer) should include a "do not use for X, prefer Y" pointer.
  - `distribution-metadata` — npm package readiness: description length, keyword count, `repository` / `license` / `homepage` fields.
- **HTML report extension** — `--html` output now includes a publishability section with an SVG quarter-arc gauge, sub-score bars, caps banner, and per-check listing.
- **GitHub Action support** — `incultnitollc/mcp-probe@v1` (Marketplace listing shipped 2026-05-20) accepts `publishability: 'true'` + `package: './package.json'` + `fail-under: '70'` and exposes `composite-score` / `band` outputs. `examples/publishability-gate.yml` becomes live-usable with this release.
- **Weekly canary workflow** — `.github/workflows/publishability-self-check.yml` re-scores the official MCP servers Sundays at 03:00 UTC; informational only, no fail-under.
- **5 launch-baseline scorecards** — `docs/publishability-scorecards/{server-sequential-thinking,server-memory,server-everything,server-filesystem,server-github}.txt` plus `SUMMARY.md` leading with the 60-floor finding (every official MCP server lands at 60/100 under v1.1.0).

### Not added (deliberate, deferred)

- **Install-time security checks** — credential scanning, `.env`/`.ssh` detection, ALLOW/ASK/BLOCK firewall preview. This is the lane `@stephenywilson/mcp-doctor` already owns (shipped 2026-05-15); mcp-probe stays on the **pre-publish quality** side. See `decision_security_suite_before_show_hn.md` for the pivot rationale.
- **Per-domain calibration thresholds** — composite math is server-agnostic in v1.1.0. Per-domain calibration (database vs filesystem vs API tools) deferred to a future release.

### Reference

- Spec: [`docs/specs/publishability-score-v1.1.0.md`](docs/specs/publishability-score-v1.1.0.md)
- Calibration drift writeup (60-floor finding across 5 official servers): [`docs/specs/publishability-score-v1.1.0-amendments.md`](docs/specs/publishability-score-v1.1.0-amendments.md)
- Launch baseline scorecards: [`docs/publishability-scorecards/SUMMARY.md`](docs/publishability-scorecards/SUMMARY.md)

## action-v1.0.0 — 2026-05-20

### Added — `mcp-probe-action` published to GitHub Marketplace

- Composite GitHub Action wrapping `@incultnitollc/mcp-probe` CLI
- Inputs: `command`, `fail-under`, `publishability`, `package`, `html-report`, `mcp-probe-version`, `json-output`
- Outputs: `composite-score`, `band`, `tools-pass-rate`, `schema-warnings`
- Marketplace listing: `github.com/marketplace/actions/mcp-probe`
- Examples in `examples/basic.yml`, `examples/publishability-gate.yml`, `examples/matrix.yml`
- Self-test workflow `.github/workflows/action-self-test.yml`

Independent of npm CLI release cycle; users on `@v1` pick up CLI updates automatically via `mcp-probe-version: latest` default.

## [1.0.1] — 2026-04-23

### Changed
- Metadata-only patch. Refreshed `package.json` `repository.url`, `homepage`, and `bugs.url` to point at the renamed GitHub repo (`PengSpirit/mcp-probe`); the 1.0.0 tarball still carried the pre-rename URLs. No code or behavior changes.

## [1.0.0] — 2026-04-23

### Added
- **Library mode.** `inspectServer`, `benchServer`, `parseTarget`, `createTransport`, `checkCompliance` and all types are exported from `@incultnitollc/mcp-probe` (main entry `./dist/lib.js`). Programmatic consumers can now import the probe directly instead of spawning the CLI.
- `InspectOptions.silent?: boolean` — suppresses spinners and stdout/stderr when `true`, so library callers receive a clean `InspectResult` return value without the CLI chrome.

### Changed
- **BREAKING — package name.** Scope moved from `@incultnitostudiosllc/mcp-probe` to `@incultnitollc/mcp-probe`. The old scope referenced a Wyoming LLC filing that is not approved by the Secretary of State; the new scope is tied to the approved legal entity Incultnito LLC. Versions `<= 0.2.1` on the old scope are deprecated on npm with a move notice. Install the new scope.
- **BREAKING — package shape.** `main` now points at the pure library entrypoint (`./dist/lib.js`); the CLI entrypoint is at `./dist/cli.js` and is surfaced via `bin.mcp-probe`. Consumers importing from the old `./dist/index.js` path must switch to the package root or `./lib` subpath; CLI consumers are unaffected.
- Source split: `src/cli.ts` (commander setup, unchanged CLI behavior) and `src/lib.ts` (pure re-exports, zero side effects on import). `src/index.ts` is removed.

### Migration
See [MIGRATION.md](./MIGRATION.md) for a full upgrade path.

## Prior versions

Versions `0.2.1` and earlier shipped under the deprecated `@incultnitostudiosllc/mcp-probe` scope. Release notes for those versions live on the [GitHub releases page](https://github.com/incultnitollc/mcp-probe/releases). No functional changes between `0.2.1` and `1.0.0` beyond the library/CLI split and scope rename — CLI behavior, transports, scoring, and output formats are unchanged.
