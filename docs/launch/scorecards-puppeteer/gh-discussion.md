# GH Discussion — paste-ready

**Repo:** `Incultnitollc/mcp-probe`
**Category:** Show and tell (slug `show-and-tell`, id `49021696`) — matches Discussion #11 precedent
**Mirror of:** Discussion #11 (server-github legacy) format
**Post via:**

```bash
gh api repos/Incultnitollc/mcp-probe/discussions \
  --method POST \
  -f title="Scorecard: @modelcontextprotocol/server-puppeteer (deprecated) — 56/100 publishability, joins the official 60-cluster" \
  -f body="<paste the body below>" \
  -F category_id=49021696
```

---

## Title

```
Scorecard: @modelcontextprotocol/server-puppeteer (deprecated) — 56/100 publishability, joins the official 60-cluster
```

## Body

```markdown
**Tested:** `@modelcontextprotocol/server-puppeteer@2025.5.12` — deprecated on npm (`Package no longer supported`) but still installed in the wild via Claude Desktop configs and tutorial blog posts. Same "in-the-wild legacy" angle as the [server-github scorecard](https://github.com/Incultnitollc/mcp-probe/discussions/11).

## Score

```
Publishability:      56 / 100   (Rough, C)
  Protocol:          100 / 100
  Edge cases:         50 / 100
  Publishability:     20 / 100
Cap fired:           description-five-axis  (≥50% of tools below per-tool axis threshold)
```

This makes **6 of 6 official Anthropic-shipped MCP servers cluster in the 56–60/100 band** under v1.1.0. The same axis fires the cap every single time.

## Per-axis breakdown

| Axis | Result | Detail |
|---|---|---|
| `description-five-axis` | **FAIL** | Global avg **0.17/5** axes (fail <3.0). **7/7 tools** below per-tool threshold. |
| `enum-shape` | PASS | No prose-only enums detected. |
| `mutation-legibility` | **FAIL** | **7/7 tools silent** on mutating-vs-read (no name prefix, no description signal, no annotation). |
| `distribution-metadata` | SKIP | Pass `--package <path>` to enable. |
| `anti-purpose-clause` | **FAIL** | **1/1 high-blast tool** missing "do not use for" / "prefer" clause (`puppeteer_navigate`). |

Global per-tool axis average **0.17 / 5** is the lowest of any official server measured to date — even the legacy `server-github` averaged 0.44/5. Every Puppeteer tool ships with a one-sentence description and nothing in the parameter properties.

## What "0.17 / 5" looks like in practice

`puppeteer_navigate` is described as:

> Navigate to a URL

That's purpose. No mutation signal (it changes the page state — mutating). No side-effects (network call, can hit any URL — a high-blast tool by any reasonable definition). No invariants (does it close existing tabs? new tab? same tab? unclear). No examples.

A planner LLM that has to decide whether to call `puppeteer_navigate` from a tool list of 7 has nothing to pattern-match on — the schema reads identically to a pure-read tool.

## Where this lands on the official-server map

| Server | Composite | Edge | Publish | Per-tool axis avg | Cap |
|---|---:|---:|---:|---:|---|
| `server-sequential-thinking` | 60 | 100 | 20 | n/a (single tool fails) | `description-five-axis` |
| `server-memory` | 60 | 85 | 50 | 1.00 / 5 | `description-five-axis` |
| `server-everything` | 60 | 94 | 20 | 0.55 / 5 | `description-five-axis` |
| `server-filesystem` | 60 | 57 | 50 | 0.88 / 5 | `description-five-axis` |
| `server-github` (legacy) | 60 | 26 | 50 | 0.44 / 5 | `description-five-axis` |
| **`server-puppeteer`** (deprecated) | **56** | **50** | **20** | **0.17 / 5** | `description-five-axis` |

The 56 (instead of 60) is the edge-case score dipping to 50, not a different publishability story. The headline finding still holds: **every official MCP server hits the same publishability ceiling for the same reason.**

## Caveat — tool-call rows are not part of the publishability score

The raw scorecard shows `0/7 tools callable`. That is **not** the server's fault and **not** input to the publishability composite. The scoring environment didn't have Chrome pre-installed (`npx puppeteer browsers install chrome`); every tool failed with the same `Could not find Chrome (ver. 131.0.6778.204)` error. The publishability axes read the schema only — they don't depend on tool calls. Independent dimension. (Tool-call scorecards live at [`docs/scorecards/SUMMARY.md`](https://github.com/Incultnitollc/mcp-probe/blob/main/docs/scorecards/SUMMARY.md).)

## Reproduce

```bash
npm install -g @incultnitollc/mcp-probe
mcp-probe score "npx -y @modelcontextprotocol/server-puppeteer" --full
```

## See also

- Full 6-server summary: https://github.com/Incultnitollc/mcp-probe/blob/main/docs/publishability-scorecards/SUMMARY.md
- v1.1.0 spec (axis math): https://github.com/Incultnitollc/mcp-probe/blob/main/docs/specs/publishability-score-v1.1.0.md
- Run mcp-probe on your own server: https://github.com/Incultnitollc/mcp-probe/discussions/13

## Heads-up

If you maintain a server that's been deprecated or hands-off, this isn't a bug report — it's a baseline measurement against the current rubric. Happy to re-run if you ship updated descriptions.
```
