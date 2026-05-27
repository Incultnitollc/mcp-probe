# mcp-probe

[![SafeSkill 60/100](https://img.shields.io/badge/SafeSkill-60%2F100_Use%20with%20Caution-orange)](https://safeskill.dev/scan/incultnitollc-mcp-probe)
**One command to diagnose your MCP server.**

Tests every tool, resource, and prompt your server exposes — then gives you a health report with a pass/fail scorecard.

Built on the Anthropic Model Context Protocol (MCP) spec.

> **Note:** Published to npm as `@incultnitollc/mcp-probe`. The CLI binary is `mcp-probe`. The unscoped name `mcp-doctor` on npm is owned by an unrelated tool, so this project ships under a scope. Versions `<= 0.2.1` shipped under the deprecated `@incultnitostudiosllc` scope — install `@incultnitollc/mcp-probe` instead.

<p align="center">
  <img src="demo.gif" alt="mcp-probe demo" width="800" />
</p>

```
npx @incultnitollc/mcp-probe test "npx -y @modelcontextprotocol/server-everything"
```

## Test your MCP server in 30 seconds

| Check | Description |
|-------|-------------|
| **Tool calling** | Calls every tool with auto-generated sample arguments based on the input schema |
| **Resource reading** | Reads every resource and verifies content is returned |
| **Prompt rendering** | Gets every prompt with sample arguments and verifies messages are returned |
| **Schema validation** | Checks tool schemas for missing descriptions, broken required fields, malformed types |
| **Health scoring** | Summarizes everything into a pass/fail scorecard |

## Install

```bash
npm install -g @incultnitollc/mcp-probe
```

Or run directly:

```bash
npx @incultnitollc/mcp-probe test "your-server-command"
```

## Usage

### Local stdio server

```bash
npx @incultnitollc/mcp-probe test "npx -y @modelcontextprotocol/server-everything"
```

### Remote server (Streamable HTTP)

```bash
npx @incultnitollc/mcp-probe test https://your-server.example.com/mcp
```

### Remote server (SSE)

```bash
npx @incultnitollc/mcp-probe test https://your-server.example.com/mcp --transport sse
```

### Authenticated remote server

```bash
npx @incultnitollc/mcp-probe test https://your-server.example.com/mcp \
  --header "Authorization: Bearer $TOKEN"
```

### Options

| Flag | Description |
|---|---|
| `--json` | Output results as JSON |
| `--timeout <ms>` | Per-operation timeout (default 30000) |
| `--transport <kind>` | Force `stdio`, `sse`, or `http` (auto-detected from target) |
| `--header <Name: value>` | Add header to remote transport. Repeatable. |

### Exit codes

- `0` — All checks passed
- `1` — One or more checks failed (useful for CI gates)

### JSON output

Use `--json` to get structured output for automation:

```bash
mcp-probe test --json "your-server" | jq '.score'
```

```json
{
  "toolsCallable": 12,
  "toolsTotal": 13,
  "resourcesReadable": 7,
  "resourcesTotal": 7,
  "promptsGettable": 3,
  "promptsTotal": 4,
  "schemaErrors": 0,
  "schemaWarnings": 1
}
```

## How tool calling works

mcp-probe auto-generates arguments for each tool based on its `inputSchema`:

- Only **required** fields get values (safest approach)
- Uses `default` values and `enum` first choices when available
- Infers smart defaults from field names (`url` → `https://example.com`, `email` → `test@example.com`)
- Falls back to type-appropriate defaults (`string` → `"test"`, `number` → `1`, `boolean` → `false`)

This means tools with complex required inputs may fail — and that's useful information. It tells you your tool isn't self-contained enough for automated testing.

## Publishability score (v1.1.0+)

`mcp-probe` ships a second, complementary check: a **publishability composite** that scores your server 0–100 on whether its schemas, descriptions, and metadata are ready for other people to install. Run it as a shorthand:

```bash
npx @incultnitollc/mcp-probe score "npx -y @your-scope/your-server" --package ./package.json
```

Or fold it into a full `test` run with `--publishability`:

```bash
npx @incultnitollc/mcp-probe test "npx -y @your-scope/your-server" --publishability --package ./package.json
```

The composite combines three sub-scores — **Protocol** (does the wire format work), **Edge cases** (does it handle weird inputs), and **Publishability** (would a stranger understand your tools) — and a five-axis breakdown across the publishability dimension:

| Axis | What it checks |
|---|---|
| `description-five-axis` | Per-tool description density across **purpose, mutation, side-effects, invariants, examples**. Tools below 3.0/5 axes fire a ≤60 composite cap. |
| `enum-shape` | Catches prose-only enums (e.g. `"one of: open, closed"` in the description with no JSON Schema `enum`). |
| `mutation-legibility` | Does each tool tell a planner it mutates, or only reads? Name prefix / description signal / annotation all count. |
| `anti-purpose-clause` | High-blast tools (delete, send, transfer) should include a "do not use for X, prefer Y" pointer to a narrower tool. |
| `distribution-metadata` | npm package readiness — description length, keyword count, `repository` / `license` / `homepage` fields. Skipped without `--package`. |

### What scores look like on real servers

The five official Anthropic MCP servers all land at **60/100** under v1.1.0 — the `description-five-axis` cap fires on every one. That's not a bug in the rubric; that's the bar Anthropic ships at, and the bar most servers will start from. Full scorecards in [`docs/publishability-scorecards/`](docs/publishability-scorecards/SUMMARY.md).

### CI gate

```yaml
- uses: incultnitollc/mcp-probe@v1
  with:
    command: 'node dist/index.js'
    publishability: 'true'
    package: './package.json'
    fail-under: '70'
```

### Pre-publish vs install-time

`mcp-probe`'s publishability score is the **pre-publish quality** lane — for server authors before they ship. For the install-time **security** lane — server installers before they connect a third-party server — see [`@stephenywilson/mcp-doctor`](https://www.npmjs.com/package/@stephenywilson/mcp-doctor). Different audiences, complementary tools.

## Use cases

- **MCP server development** — Run mcp-probe in your test suite to catch regressions
- **CI/CD gates** — Block deploys if your MCP server doesn't pass health checks
- **Server evaluation** — Quickly assess third-party MCP servers before integrating them
- **Schema quality** — Find missing descriptions and malformed schemas before users hit them

## CI integration

`mcp-probe` exits `0` on full pass and `1` on any failure, so it drops directly into any CI pipeline:

```yaml
# .github/workflows/mcp-health.yml
- name: Health-check MCP server
  run: npx @incultnitollc/mcp-probe test "$MCP_SERVER_CMD"
```

Use `--json` for structured output and `jq` to gate on specific metrics (e.g. fail the build if `schemaWarnings > 0`).

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

### Inputs

| Name | Required | Default | Description |
|---|---|---|---|
| `command` | yes | — | Command that launches your MCP server (e.g. `node dist/index.js` or `npx -y @your-scope/your-server`). |
| `fail-under` | no | `0` | Fail the job if the publishability composite drops below this value (0–100). Requires `publishability: 'true'`. |
| `publishability` | no | `false` | Run the publishability suite — 5 checks + 0–100 composite. Requires `mcp-probe >= 1.1.0` (ships 2026-05-23). |
| `package` | no | `''` | Path to `package.json` for the distribution-metadata check. Empty skips the distribution check. |
| `html-report` | no | `''` | Path to write the HTML scorecard. Upload via `actions/upload-artifact` in a follow-on step. |
| `mcp-probe-version` | no | `latest` | npm version, dist-tag, or `latest`. Pin for reproducible builds. |
| `json-output` | no | `''` | Path to write the JSON report for downstream parsing. |

### Outputs

| Name | Description |
|---|---|
| `composite-score` | Publishability composite (0–100). Only set when `publishability: 'true'`. |
| `band` | Grade band: `publishable` / `almost` / `rough` / `not-ready`. Only set when `publishability: 'true'`. |
| `tools-pass-rate` | `tools_callable / tools_listed` as a decimal (e.g. `0.83`). |
| `schema-warnings` | Total schema warning count across all tools. |

More examples: [`examples/basic.yml`](examples/basic.yml) · [`examples/publishability-gate.yml`](examples/publishability-gate.yml) · [`examples/matrix.yml`](examples/matrix.yml).

Marketplace listing: [github.com/marketplace/actions/mcp-probe-mcp-server-health-check](https://github.com/marketplace/actions/mcp-probe-mcp-server-health-check).

## Compared to MCP Inspector

The official [MCP Inspector](https://github.com/modelcontextprotocol/inspector) is a GUI for interactive exploration — point, click, see what a server returns. `mcp-probe` is a CLI for automated, repeatable diagnosis — every tool/resource/prompt called automatically, pass/fail scorecard out, exit code in. Use Inspector when you're exploring; use `mcp-probe` in CI, in pre-publish checks, or when you want a shareable scorecard of someone else's server.

## Development

```bash
git clone https://github.com/incultnitollc/mcp-probe.git
cd mcp-probe
npm install
npm run dev -- test "npx -y @modelcontextprotocol/server-everything"
npm test
```

## License

MIT - [Incultnito LLC](https://github.com/incultnitollc)
