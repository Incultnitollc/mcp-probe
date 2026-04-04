# mcp-doctor

**One command to diagnose your MCP server.**

Tests every tool, resource, and prompt your server exposes — then gives you a health report with a pass/fail scorecard.

```
npx mcp-doctor test "npx -y @modelcontextprotocol/server-everything"
```

```
═══════════════════════════════════════════
  MCP Server Inspection Report
  Server: mcp-servers/everything
═══════════════════════════════════════════

Tools:
  PASS echo — Echoes back the input string (3ms)
  PASS get-sum — Returns the sum of two numbers (1ms)
  PASS get-tiny-image — Returns a tiny MCP logo image. (0ms)
  FAIL simulate-research-query — Requires task-based execution (0ms)

Resources:
  PASS demo://resource/static/document/architecture.md [1604 bytes] (3ms)
  PASS demo://resource/static/document/features.md [8815 bytes] (1ms)

Prompts:
  PASS simple-prompt — A prompt with no arguments [1 messages] (1ms)
  PASS args-prompt — A prompt with two arguments [1 messages] (1ms)

Schema Issues:
  WARN  get-resource-reference — Property "resourceType" missing description

═══════════════════════════════════════════
  Health Check Score
═══════════════════════════════════════════

  Tools callable:      12/13
  Resources readable:  7/7
  Prompts gettable:    3/4
  Schema errors:       0
  Schema warnings:     1
  Total time:          12590ms

  SOME CHECKS FAILED
```

## What it does

| Check | Description |
|-------|-------------|
| **Tool calling** | Calls every tool with auto-generated sample arguments based on the input schema |
| **Resource reading** | Reads every resource and verifies content is returned |
| **Prompt rendering** | Gets every prompt with sample arguments and verifies messages are returned |
| **Schema validation** | Checks tool schemas for missing descriptions, broken required fields, malformed types |
| **Health scoring** | Summarizes everything into a pass/fail scorecard |

## Install

```bash
npm install -g mcp-doctor
```

Or run directly:

```bash
npx mcp-doctor test "your-server-command"
```

## Usage

```bash
# Basic inspection
mcp-doctor test "npx -y @modelcontextprotocol/server-everything"

# JSON output (for CI pipelines)
mcp-doctor test --json "node my-server.js"

# Custom timeout (default: 30s per operation)
mcp-doctor test --timeout 60000 "python my_server.py"
```

### Exit codes

- `0` — All checks passed
- `1` — One or more checks failed (useful for CI gates)

### JSON output

Use `--json` to get structured output for automation:

```bash
mcp-doctor test --json "your-server" | jq '.score'
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

mcp-doctor auto-generates arguments for each tool based on its `inputSchema`:

- Only **required** fields get values (safest approach)
- Uses `default` values and `enum` first choices when available
- Infers smart defaults from field names (`url` → `https://example.com`, `email` → `test@example.com`)
- Falls back to type-appropriate defaults (`string` → `"test"`, `number` → `1`, `boolean` → `false`)

This means tools with complex required inputs may fail — and that's useful information. It tells you your tool isn't self-contained enough for automated testing.

## Use cases

- **MCP server development** — Run mcp-doctor in your test suite to catch regressions
- **CI/CD gates** — Block deploys if your MCP server doesn't pass health checks
- **Server evaluation** — Quickly assess third-party MCP servers before integrating them
- **Schema quality** — Find missing descriptions and malformed schemas before users hit them

## Development

```bash
git clone https://github.com/PengSpirit/mcp-doctor.git
cd mcp-doctor
npm install
npm run dev -- test "npx -y @modelcontextprotocol/server-everything"
npm test
```

## License

MIT - [Incultnito Studios LLC](https://github.com/PengSpirit)
