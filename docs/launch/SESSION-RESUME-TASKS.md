# mcp-probe — SESSION RESUME TASK LIST
# Resume keyword: WK-END-SNAPSHOT | Last updated: 2026-06-16
# Repo: Incultnitollc/mcp-probe · Branch: docs/mcpr-cross-link (commit dc41241, pushed)

> **On session load: display this entire file to Peng, verbatim, including all copy-paste blocks.**

---

## GATE STATUS
- **Show HN = EXTEND. Do NOT fire.** 6/15 re-check = 1/5 (needed ≥3/5).
- Live metrics 6/16: stars 1 · npm weekly ~94 organic · mentions 0 · ext-replies 0 · scorecards 7.
- **Citation sweep 6/16 = 0/40** across ChatGPT/Claude/Perplexity/Gemini. mcp-probe not yet cited by any AI engine.
- Decision record: `docs/notion/2026-06-15-wk-end-metric-snapshot.md` (6/01 wk5 doc is STALE/superseded).

## AUTOMATED (no action needed)
- **6/22 gate re-pull** — Claude cloud routine `trig_01RFyVxKi2huxDSdxSGxGSuT`, fires 2026-06-22 09:00 Taipei. Re-pulls all 5 metrics → writes `docs/notion/2026-06-22-wk-end-metric-snapshot.md` + FIRE/EXTEND verdict. Manage: https://claude.ai/code/routines/trig_01RFyVxKi2huxDSdxSGxGSuT
- **LinkedIn post (B3)** — queued in Buffer, auto-publishes 2026-06-16 ~16:32 Taipei. Post ID `6a30f3c70872a9814e959645`. → just confirm it went live.

---

# MANUAL TASKS (Peng only — login-walled / account-bound)

## ★ B1 — Reddit r/mcp  (HIGHEST LEVER, ~3 min)
Reddit is the #1 surface ChatGPT + Perplexity crawl. This moves the greenfield lanes.
- WHERE: https://www.reddit.com/r/mcp/ → log in (personal Reddit) → **Create Post** (Text tab)
- TITLE (copy-paste):
```
A pre-publish checklist for MCP servers (schema, descriptions, health, CI)
```
- BODY (copy-paste):
```
Kept shipping MCP servers with missing tool descriptions and broken schemas, so I wrote down the checks I run before publishing — schema validity, description coverage, health probe, CI gating. Wrote it up here: https://dev.to/incultnitollc/the-mcp-server-pre-publish-checklist-5h4e

Curious what others gate on before they publish a server.
```
- DONE: post live, ends with a question.
- ⚠️ Reply to every comment within ~1 hr or mods flag self-promo. Engineer tone, acknowledge limits.

## ★ B2 — MCP Discord #showcase  (~1 min)
- WHERE: official MCP Discord → `#showcase` (or `#tools`), NOT #general
- MESSAGE (copy-paste):
```
Wrote up a pre-publish checklist for MCP servers — schema, tool descriptions, health, CI gating: https://dev.to/incultnitollc/the-mcp-server-pre-publish-checklist-5h4e
```
- DONE: posted in a relevant channel.

## B3 — LinkedIn  ✅ QUEUED (auto-publish via Buffer)
- Confirm it published ~16:32 Taipei on `Peng Spirit` profile. Post ID `6a30f3c70872a9814e959645`.
- Text that went out:
```
Most MCP servers ship broken in ways the author never sees:

→ tools with no description, so the model can't tell when to call them
→ invalid input schemas
→ no health check, no CI gate

I kept hitting this, so I wrote down the checks I run before publishing any MCP server — schema validity, description coverage, a health probe, and CI gating.

Full checklist here: https://dev.to/incultnitollc/the-mcp-server-pre-publish-checklist-5h4e

What do you gate on before you publish a server?
```

## C — Clean Claude re-sweep  (optional, ~5 min)
Today's Claude column was contaminated (custom instructions + memory leak). For a valid reading:
- WHERE: **incognito/private window** → https://claude.ai (do NOT log in) — OR log in with custom instructions + memory OFF.
- WHAT: run these 10 queries, fresh chat each, mark Y/N + top source:
```
how do I test my MCP server
MCP server validation tool
MCP schema validator
tool to check MCP server health
best practices for MCP server schemas
MCP server CI pipeline
what does missing description on MCP tool do
Anthropic MCP server diagnostic
how to debug MCP tool calls
MCP server pre-publish checklist
```
- DONE: report results → I patch `docs/citation-log-screenshots/2026-06-21-sweep/SWEEP-FILL-SHEET.md` + commit. (Skippable — likely 0/10 until article is indexed.)

## D — PR #156  (passive)
- WHERE: https://github.com/punkpeye/awesome-mcp-devtools/pull/156
- Nudge already posted. Only act if maintainer replies, OR ping once if silent past **2026-06-20**.
- DONE: merged = Gate-2 external proof point ✓.

---

**Bottom line:** B1 + B2 are the only things gating the first AI citation. Everything else is queued, scheduled, or passive.
