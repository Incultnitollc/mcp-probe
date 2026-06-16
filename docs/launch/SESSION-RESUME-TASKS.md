# mcp-probe — SESSION RESUME TASK LIST
# Resume keyword: WK-END-SNAPSHOT | Last updated: 2026-06-16 (PM)
# Repo: Incultnitollc/mcp-probe · Branch: docs/mcpr-cross-link

> **On session load: display this entire file to Peng, verbatim, including all copy-paste blocks.**

> ⚠️ **PROBE-PUBLISH is DEAD/STALE — do not use it.** Superseded by this keyword (WK-END-SNAPSHOT).
> Registry publish done 6/8 (v1.1.2 live). Pre-publish checklist published as dev.to article 6/15.

---

## GATE STATUS
- **Show HN = EXTEND. Do NOT fire.** 6/15 re-check = 1/5 (needed ≥3/5).
- Live metrics 6/16: stars 1 · npm weekly ~94 organic · mentions 0 · ext-replies 0 · scorecards 7.
- **Citation sweep 6/16 = 0/40** across ChatGPT/Claude/Perplexity/Gemini. Not yet cited by any AI engine.
- Decision record: `docs/notion/2026-06-15-wk-end-metric-snapshot.md` (6/01 wk5 doc is STALE/superseded).

## AUTOMATED (no action — verified)
- **6/22 gate re-pull** — Claude cloud routine `trig_01RFyVxKi2huxDSdxSGxGSuT`, fires 2026-06-22 09:00 Taipei. Re-pulls all 5 metrics → writes `docs/notion/2026-06-22-wk-end-metric-snapshot.md` + FIRE/EXTEND verdict. Manage: https://claude.ai/code/routines/trig_01RFyVxKi2huxDSdxSGxGSuT
- **LinkedIn post (B3)** — ✅ **PUBLISHED 2026-06-16 16:32 Taipei.** Post ID `6a30f3c70872a9814e959645`. Live URL: https://www.linkedin.com/feed/update/urn:li:share:7472566640501739520

## AUTOMATION CHECKED — why B1/B2 stay manual
- **B1 Reddit** — no Reddit MCP; Playwright needs your login + human reply judgment → account-bound, cannot automate.
- **B2 Discord** — discord MCP only reaches YOUR paired channel, NOT the official MCP community server → wrong scope, cannot automate.

---

# 🔴 MANUAL TASKS (Peng only — the ONLY blockers to first AI citation)

## ★ B1 — Reddit r/mcp  (HIGHEST LEVER, ~3 min) — DO FIRST
**WHY:** Reddit is the #1 surface ChatGPT + Perplexity crawl. Moves the greenfield citation lanes from 0.

1. Open https://www.reddit.com/r/mcp/ → log in with **personal** Reddit (top-right).
2. Click **Create Post** → stay on the **Text** tab (NOT Link).
3. TITLE (copy-paste):
```
A pre-publish checklist for MCP servers (schema, descriptions, health, CI)
```
4. BODY (copy-paste):
```
Kept shipping MCP servers with missing tool descriptions and broken schemas, so I wrote down the checks I run before publishing — schema validity, description coverage, health probe, CI gating. Wrote it up here: https://dev.to/incultnitollc/the-mcp-server-pre-publish-checklist-5h4e

Curious what others gate on before they publish a server.
```
5. Post. DONE = live, ends with a question.
6. ⚠️ Reply to EVERY comment within ~1 hr or mods flag self-promo. Engineer tone, acknowledge limits ("the health probe is shallow right now"). Do NOT shill.

## ★ B2 — MCP Discord #showcase  (~1 min)
1. Open official **Model Context Protocol** Discord server.
2. Go to `#showcase` (or `#tools` if no showcase). **NOT #general.**
3. MESSAGE (copy-paste):
```
Wrote up a pre-publish checklist for MCP servers — schema, tool descriptions, health, CI gating: https://dev.to/incultnitollc/the-mcp-server-pre-publish-checklist-5h4e
```
4. Send. DONE = posted in a relevant channel.

## ⏳ D — PR #156  (PASSIVE — no action until 2026-06-20)
- URL: https://github.com/punkpeye/awesome-mcp-devtools/pull/156
- Status: **open, clean merge, 1 comment, maintainer silent since 6/15.**
- Nudge already posted. Do nothing until **2026-06-20**. If still silent → ping once (Claude can auto-post that comment on request).
- DONE: merged = Gate-2 external proof point ✓.

## ⏸ C — Clean Claude re-sweep  (OPTIONAL — skip recommended, ~5 min)
Last Claude column was contaminated (memory + custom-instruction leak). For a valid reading only:
- WHERE: **incognito/private window** → https://claude.ai (do NOT log in) — OR log in with custom instructions + memory OFF.
- Run these 10 queries, fresh chat each, mark Y/N + top source:
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
- DONE: report results → Claude patches `docs/citation-log-screenshots/2026-06-21-sweep/SWEEP-FILL-SHEET.md` + commits. (Skippable — likely 0/10 until article is indexed.)

---

**Bottom line:** B1 + B2 are the ONLY things gating the first AI citation. B1 first — it's the lever. Everything else is published, scheduled, or passive.
