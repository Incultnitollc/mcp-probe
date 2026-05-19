# Changelog

All notable changes to `@incultnitollc/mcp-probe` are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
