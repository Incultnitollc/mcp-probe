# Blog cross-link — dev.to draft

**Account decision:** `incultnitollc` (no underscore) — matches 2026-05-12 post on missing-description failure modes, which is the closest thematic predecessor. Per `reference_devto_dual_accounts.md`, verify with `curl https://dev.to/api/articles?username=incultnitollc` before paste.

**Publish path:** dev.to manual paste (per `feedback_devto_rate_limit.md` — API publishes get 403'd on new accounts; manual paste is the workflow for first publishes).

**Cross-link strategy:** The GH Discussion (`/discussions/<n>`) is the canonical artifact. This blog post is the long-form companion that links UP to the Discussion + the SUMMARY, then is itself referenced from the Twitter thread tweet 4 and the Reddit replies as "full writeup".

---

## Title (≤80 chars, dev.to taste)

```
6 of 6 official MCP servers cluster at 56–60/100 on schema-description density
```

## Tags

`mcp`, `anthropic`, `apidesign`, `opensource`

## Cover image

Use the demo.gif in repo root, or generate a simple table screenshot of the 6-server composite. Skip for v1 if friction.

## Canonical URL

`https://github.com/Incultnitollc/mcp-probe/blob/main/docs/publishability-scorecards/SUMMARY.md`

---

## Body

```markdown
After ten days of running the v1.1.0 publishability rubric against
every MCP server I can find on npm under the official `@modelcontextprotocol`
scope, the cluster pattern is now hard to ignore.

**6 of 6 official Anthropic-shipped MCP servers score 56–60/100 on the
v1.1.0 publishability composite.** The cap that fires is the same axis
every time: `description-five-axis`.

| Server | Composite | Protocol | Edge cases | Publish | Per-tool axis avg | Cap |
|---|---:|---:|---:|---:|---:|---|
| `server-sequential-thinking` | 60 | 100 | 100 | 20 | n/a (single tool) | `description-five-axis` |
| `server-memory` | 60 | 100 | 85 | 50 | 1.00 / 5 | `description-five-axis` |
| `server-everything` | 60 | 100 | 94 | 20 | 0.55 / 5 | `description-five-axis` |
| `server-filesystem` | 60 | 100 | 57 | 50 | 0.88 / 5 | `description-five-axis` |
| `server-github` (legacy) | 60 | 100 | 26 | 50 | 0.44 / 5 | `description-five-axis` |
| `server-puppeteer` (deprecated) | 56 | 100 | 50 | 20 | **0.17 / 5** | `description-five-axis` |

Every protocol score is 100. The wire format is right on every server.
The 40-point gap is entirely how the schemas read.

## What "0.17 / 5" looks like in practice

Take Puppeteer's `puppeteer_navigate`. The full schema description is:

> Navigate to a URL.

Score that against the 5 axes:

- **Purpose** — "navigate to a URL" ✓ (1 axis)
- **Mutation signal** — does it read or write? Silent. ✗
- **Side-effects** — network call, can hit any URL, executes JS,
  arbitrary cookie state. High-blast. Silent. ✗
- **Invariants** — does it close existing tabs? Open a new one? Same
  tab? Silent. ✗
- **Examples** — none. ✗

1 / 5. The other six Puppeteer tools score the same way. Average 0.17.

A planner LLM that has to decide whether to call `puppeteer_navigate`
from a tool list of 7 has nothing to pattern-match on. It cannot tell
the difference between `puppeteer_navigate` (mutates browser state, can
hit any URL) and `puppeteer_screenshot` (read-only, current page only)
from the schema alone — they read identically.

## Why this matters more than it looks

The reference servers are calibration anchors. When a server author
opens the docs to figure out "what does a good MCP server look like",
they read these. When an LLM coding agent autocompletes a new MCP
server skeleton, it pattern-matches on these. When the spec doc shows
"here's how to write a tool", it links to these.

If the bar Anthropic ships at is 56–60/100, **that's the bar most
third-party servers will start from too** — and probably stay at,
because there's no public benchmark telling them they're under it.

That's the v1.1.0 thesis: surface the bar so authors can decide where
they want to land. `mcp-probe score` is one command.

```bash
npx -y @incultnitollc/mcp-probe score "<your-command>" --full
```

The 5-axis breakdown tells you exactly which axis is empty on which
tool. Per-tool axis avg below 3.0/5 fires the ≤60 publishability cap.
Fix two axes per tool (mutation signal + one concrete example is
usually fastest) and the cap lifts.

## Methodology

- v1.1.0 spec: <https://github.com/Incultnitollc/mcp-probe/blob/main/docs/specs/publishability-score-v1.1.0.md>
- Calibration drift notes: <https://github.com/Incultnitollc/mcp-probe/blob/main/docs/specs/publishability-score-v1.1.0-amendments.md>
- 6-server summary (canonical): <https://github.com/Incultnitollc/mcp-probe/blob/main/docs/publishability-scorecards/SUMMARY.md>
- Individual server scorecards: under `docs/publishability-scorecards/` in the same repo

## Caveat — install-time security is a different lane

`mcp-probe` is pre-publish quality (server authors, before they ship).
For install-time security (server installers, before they connect a
third-party server), see [`@stephenywilson/mcp-doctor`](https://www.npmjs.com/package/@stephenywilson/mcp-doctor).
Different audience, different lane, complementary tool.
```

## Pre-publish checklist

- [ ] Verify `incultnitollc` account still active on dev.to (`curl https://dev.to/api/articles?username=incultnitollc`)
- [ ] Confirm canonical URL renders the 6-row summary table correctly
- [ ] Paste manually at https://dev.to/new (don't try API — per stored feedback)
- [ ] Add the dev.to URL back to `docs/citation-log.md` under WK5
- [ ] Cross-link to dev.to URL in the Twitter thread tweet 4 (replace SUMMARY link if dev.to ranks better in citation sweeps)

## Skip-it cost

If we don't publish a dev.to companion: GH Discussion still stands as canonical, Twitter + Reddit point to SUMMARY.md directly. Reasonable to defer dev.to to a single combined Wk5 post that bundles 2-3 community-server scorecards once they're scored. Not load-bearing for this drop.
