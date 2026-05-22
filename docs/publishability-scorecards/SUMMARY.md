# Publishability scorecards — v1.1.0 launch baseline

**Captured:** 2026-05-22 (TPE) with `@incultnitollc/mcp-probe@1.1.0` on `node dist/cli.js score "<server>" --full`.

## TL;DR — every official Anthropic MCP server scores 60/100

**4 of 5 official Anthropic-shipped MCP servers cluster at exactly 60/100** under the v1.1.0 publishability rubric. The fifth (`server-filesystem`) lands at the same 60. The cap is fired by the same axis every time: **`description-five-axis`** — schema descriptions are too thin on per-tool axis density (purpose, mutation, side-effects, invariants, examples), so the composite hits the ≤60 publishability ceiling.

This is the v1.1.0 value proposition surfaced empirically: **the bar Anthropic ships at is the bar most MCP servers will start from. mcp-probe shows authors exactly where the 40 points are.**

## Composite

| Server | Composite | Band | Protocol | Edge cases | Publishability | Cap fired |
|---|---:|---|---:|---:|---:|---|
| `@modelcontextprotocol/server-sequential-thinking` | **60** | Rough (C) | 100 | 100 | 20 | `description-five-axis` |
| `@modelcontextprotocol/server-memory` | **60** | Rough (C) | 100 | 85 | 50 | `description-five-axis` |
| `@modelcontextprotocol/server-everything` | **60** | Rough (C) | 100 | 94 | 20 | `description-five-axis` |
| `@modelcontextprotocol/server-filesystem` | **60** | Rough (C) | 100 | 57 | 50 | `description-five-axis` |
| `@modelcontextprotocol/server-github` (legacy) | **60** | Rough (C) | 100 | 26 | 50 | `description-five-axis` |

All five protocol scores are 100/100 — these servers are protocol-correct. The 40-point gap is entirely about how the schemas read, not whether the wire format is right.

## Per-server failure axes

| Server | description-five-axis | enum-shape | mutation-legibility | anti-purpose-clause |
|---|---|---|---|---|
| sequential-thinking | FAIL (1/1 below 3.0) | PASS | FAIL (no mutation signal) | SKIP (single-tool) |
| memory | FAIL (9/9 below 3.0, global avg 1.00/5) | PASS | PASS (7/9 disclose) | FAIL (4/4 high-blast missing) |
| everything | FAIL (13/13 below 3.0, global avg 0.55/5) | PASS | FAIL (13/13 silent) | FAIL (3/3 high-blast missing) |
| filesystem | FAIL (14/14 below 3.0, global avg 0.88/5) | PASS | PASS (14/14 disclose) | FAIL (12/12 high-blast missing) |
| github (legacy) | FAIL (26/26 below 3.0, global avg 0.44/5) | PASS | PASS (23/26 disclose) | FAIL (6/6 high-blast missing) |

**Two universals:** `enum-shape` passes everywhere (no prose-only enums in any official server), and `description-five-axis` fails everywhere. **One pattern:** every multi-tool server with mutating tools fails `anti-purpose-clause` — no official server tells a planner "do not use for X, prefer Y."

`distribution-metadata` is `SKIP` on every server above because the score subcommand was invoked without `--package` (these are remote npm packages, not local sources). The action consumer-side check (`uses: incultnitollc/mcp-probe@v1` with `package: ./package.json`) is the intended surface for that axis.

## Methodology

```bash
# v1.1.0+ score subcommand — shorthand for `test --publishability-only`
node dist/cli.js score "npx -y @modelcontextprotocol/server-<name>" --full
```

`--full` runs the standard inspection alongside the publishability suite so the scorecard captures both the protocol/edge-case sub-scores and the 5-axis publishability breakdown.

## Raw scorecards

- [`server-sequential-thinking.txt`](server-sequential-thinking.txt)
- [`server-memory.txt`](server-memory.txt)
- [`server-everything.txt`](server-everything.txt)
- [`server-filesystem.txt`](server-filesystem.txt)
- [`server-github.txt`](server-github.txt) — legacy `@modelcontextprotocol/server-github@2025.4.8`; superseded by `github/github-mcp-server` (Go).

## What about install-time security?

mcp-probe is the **pre-publish quality** lane (server authors, before they ship). For **install-time security** (server installers, before they connect a third-party server), see [`@stephenywilson/mcp-doctor`](https://www.npmjs.com/package/@stephenywilson/mcp-doctor) — different audience, different lane, complementary tool.

## See also

- Calibration drift writeup: [`docs/specs/publishability-score-v1.1.0-amendments.md`](../specs/publishability-score-v1.1.0-amendments.md)
- v1.1.0 spec: [`docs/specs/publishability-score-v1.1.0.md`](../specs/publishability-score-v1.1.0.md)
- Tool-call scorecards (separate dimension — what fraction of tools mcp-probe can call automatically): [`docs/scorecards/SUMMARY.md`](../scorecards/SUMMARY.md)
