# mcp-probe — SESSION RESUME TASK LIST
# Resume keyword: WK-END-SNAPSHOT | Last updated: 2026-06-20 (PM)
# Repo: Incultnitollc/mcp-probe · Branch: docs/mcpr-cross-link
# ⏰ Calendar resume event set: Fri 2026-06-19 00:00 Taipei (popup reminder)

> **On session load: display this entire file to Peng, verbatim, including all copy-paste blocks.**

> ⚠️ **PROBE-PUBLISH is DEAD/STALE — do not use it.** Superseded by this keyword (WK-END-SNAPSHOT).
> Registry publish done 6/8 (v1.1.2 live). Pre-publish checklist published as dev.to article 6/15.

---

## GATE STATUS
- **Show HN = EXTEND. Do NOT fire.** 6/15 re-check = 1/5 (needed ≥3/5).
- Live metrics 6/18: stars 1 · npm weekly 107 organic (↑ from ~94) · forks 1 · mentions 0 · ext-replies 0.
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

## ★ B1 — Reddit r/mcp  (⏳ MODMAIL-PENDING — do NOT repost)
> **2026-06-20 status:** Posted (text-only AND with-link) — BOTH removed by **Reddit's site-wide filter**, not r/mcp mods.
> Account checked: **NOT shadowbanned** (profile visible in incognito), **250 karma**, email verified. So it is NOT a karma/shadowban problem — account flagged for self-promo pattern or r/mcp account-age threshold.
> **Action taken:** modmail sent to r/mcp mods to approve from queue. **Now passive — wait for approval. Do NOT re-attempt the post** (more attempts deepen the spam flag).
> When approved → reply to every comment within ~1hr (canned reply below).

**WHY:** Reddit is the #1 surface ChatGPT + Perplexity crawl. Moves the greenfield citation lanes off 0.

### Steps
1. **WHERE:** Open https://www.reddit.com/r/mcp/
2. Log in top-right with **personal** Reddit account (NOT brand).
3. Click **Create Post**.
4. Stay on the **Text** tab. ⚠️ NOT the **Link** tab — link posts get auto-flagged as spam.
5. TITLE (copy-paste):
```
A pre-publish checklist for MCP servers (schema, descriptions, health, CI)
```
6. BODY (copy-paste):
```
Kept shipping MCP servers with missing tool descriptions and broken schemas, so I wrote down the checks I run before publishing — schema validity, description coverage, health probe, CI gating. Wrote it up here: https://dev.to/incultnitollc/the-mcp-server-pre-publish-checklist-5h4e

Curious what others gate on before they publish a server.
```
7. Click **Post**. **DONE =** post live, ends with a question.

### ⚠️ After posting (critical — 1 hr window)
- Reply to **every** comment within ~1 hr or mods flag self-promo.
- **Engineer tone.** Acknowledge limits, e.g. _"the health probe is shallow right now — only checks startup + tool list."_
- Do NOT shill. No "check out my tool." Answer the question, link only if relevant.
- Canned reply if asked "what does it actually check?" (copy-paste):
```
Right now: schema validity (JSON Schema parse + required fields), description coverage (flags tools/params with empty descriptions), a shallow health probe (starts the server, lists tools, checks it responds), and a CI exit-code gate so you can fail a build on a bad score. Happy to take requests on what else to gate.
```

## ★ B2 — MCP Discord #showcase  ✅ COMPLETED 2026-06-20

### Steps (done — kept for record)
1. **WHERE:** Open the official **Model Context Protocol** Discord server.
2. Go to channel `#showcase`.
   - If no `#showcase` → use `#tools`.
   - ⚠️ **NOT `#general`** — wrong scope, reads as spam.
3. MESSAGE (copy-paste):
```
Wrote up a pre-publish checklist for MCP servers — schema, tool descriptions, health, CI gating: https://dev.to/incultnitollc/the-mcp-server-pre-publish-checklist-5h4e
```
4. Send. **DONE =** posted in a relevant channel.

## ⏳ D — PR #156  (PASSIVE — nudge #2 sent 2026-06-20, do NOT ping again)
- URL: https://github.com/punkpeye/awesome-mcp-devtools/pull/156
- Status: **open, clean merge, 2 comments (both Peng), maintainer silent since 6/15.**
- Nudge #1 6/15, Nudge #2 6/20 (https://github.com/punkpeye/awesome-mcp-devtools/pull/156#issuecomment-4756529490). No more pings — two is the ceiling, further nudges read as nagging. Wait for maintainer.
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
