# mcp-probe — Wk5 snapshot + W5 TRIGGER CHECK — Mon 2026-06-01 (run ~18:40 TPE)

> First Monday after 4 full weeks of activity → full 5-metric trigger evaluation. Paste block below into Notion Decisions Log (`4acefbb1-e3b1-4c1b-9b80-24e2e3bf3d62`).

## Metric snapshot

| Metric | Wk5 value | Δ vs Wk4 (2026-05-25) | Threshold | Hit? |
|---|---|---|---|---|
| GH stars (organic) | 1 | 0 (still 1) | ≥100 | ✗ |
| npm weekly DL | 121 | −75 (was 196) | ≥150 | ✗ |
| Unsolicited mentions | 0 | 0 (still 0) | ≥5 | ✗ |
| Discussions: threads / replies / distinct users | 9 / 0 ext (3 self) / 0 | +6 threads, 0 ext replies | ≥10 / ≥5 | ✗ |
| Scorecards live | 6 publishability (+5 legacy) | stable (Wk4 logged 10 incl. legacy+posted) | ≥6 | ✓ |
| Citation sweep | 0/20 cited (Perplexity 0/10, Gemini 0/10; ChatGPT+Claude not run) | 0 (still 0) | (separate) | — |

**Trigger status: 1/5 hit** (Wk4 was 2/5 — down one).

## Decision: RE-STRATEGIZE — DO NOT push Show HN

Rule: **5/5 → keep tomorrow's Show HN · 3–4/5 → push Show HN out 2 weeks · <3/5 → re-strategize, don't push.**
At **1/5**, the gate is decisively missed. **Tomorrow's Show HN event is HELD/CANCELLED.** Do not submit.

## Why (data sources)

- **GH stars = 1** — `gh api repos/Incultnitollc/mcp-probe`. Zero organic stars in 5 weeks.
- **npm weekly = 121** — `api.npmjs.org/downloads/point/last-week`. Down from Wk4's 196 (which was inflated by the 5/22 ship-day spike of 146). Weekday organic floor is ~8–24/day. The spike was install-curiosity, not retained adoption.
- **Unsolicited mentions = 0** — GH code/issue/PR search + WebSearch. The only artifacts naming `@incultnitollc/mcp-probe` outside our repos are automated aggregator feeds (`devops-actions` Marketplace bot, `linny006/mcp-servers-live` 15-min scraper). Web hits all reference the unrelated Rust `conikeec/mcp-probe`. Zero human third-party mention.
- **Discussions = 9 threads / 0 external replies / 0 distinct external users** — `gh api graphql`. All 9 threads + all 3 comments authored by PengSpirit. No non-Peng has ever replied. (Wk4 was 3 threads; +6 threads added via daily-presence, still 0 external engagement.)
- **Scorecards live = 6** publishability scorecards in `docs/publishability-scorecards/` (+5 legacy in `docs/scorecards/`). Threshold met — but this is self-authored content, not external signal.
- **Citation sweep = 0/20** — full Wk5 sweep logged in `docs/citation-log.md`, screenshots in `docs/citation-log-screenshots/2026-06-01-wk5-sweep/`. No flips vs Wk4; lanes locked to modelcontextprotocol.io (Inspector), philschmid.de, snyk, stainless, mcpjam, mcpcat.

## Read

4 weeks of daily-presence GitHub fires produced **0 organic stars, 0 unsolicited mentions, 0 external Discussion replies, 0 AI citations**. The current distribution motion is not converting attention into traction. A Show HN launched into this would burn the one-time HN card with no supporting social proof. Hold and re-strategize the distribution/positioning before spending the launch.

## Top 3 levers (re-strategy candidates)

1. **Stop daily GitHub-presence fires** — 4 weeks, 0 external signal. The MCP-org Discussion surface is saturated by us and ignored by others. Reallocate that effort.
2. **Pick ONE external proof point and force it** — e.g. land mcp-probe in `punkpeye/awesome-mcp-devtools` (PR #156 was self-submitted — chase the merge), or get ONE real third-party to run it and post. One genuine external mention > 6 more self-authored scorecards.
3. **Re-test the wedge** — every AI-citation lane is locked to Inspector / philschmid / Anthropic-first-party. "Publishability score" isn't surfacing. Decide in the re-strategy session whether the wedge is wrong or just un-amplified, before committing more build/launch budget.

---

## NOTION DECISIONS-LOG PASTE BLOCK

**Title:** mcp-probe W5 Trigger Check — 1/5, re-strategize (Show HN held)
**Date:** 2026-06-01
**Decision:** Do NOT push Show HN. Hold the launch; re-strategize distribution & positioning.
**Trigger:** 1/5 metrics hit (stars 1/≥100 ✗ · npm 121/≥150 ✗ · mentions 0/≥5 ✗ · discussions 0 ext/≥10+≥5 ✗ · scorecards 6/≥6 ✓). Citation sweep 0/20 (no flips). Down from Wk4's 2/5.
**Rationale:** 4 weeks daily-presence → 0 organic stars / 0 unsolicited mentions / 0 external replies / 0 AI citations. Distribution motion not converting; launching Show HN now would waste the one-time card with no social proof.
**Next:** (1) stop daily GH fires; (2) force one external proof point (awesome-mcp-devtools merge or one real third-party runner); (3) re-test the publishability-score wedge vs locked Inspector/philschmid lanes. ChatGPT+Claude manual citation sweep still owed.
**Evidence:** `docs/citation-log.md` (Wk5 section), `docs/citation-log-screenshots/2026-06-01-wk5-sweep/` (20 PNGs), this snapshot.
