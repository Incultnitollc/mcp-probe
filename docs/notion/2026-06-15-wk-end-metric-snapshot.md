# mcp-probe — Wk-end snapshot + FORMAL GATE RE-CHECK — Mon 2026-06-15 (live, ~15:10 TPE)

**Cadence:** Wk-end snapshot, Mon evenings (per Wk6 re-strategy). This is the **formal Wk6 gate re-check** scheduled 2026-06-15.
**Purpose:** Decide continue / launch / extend against Wk6 gate targets.
**Context:** Active motion = **pull-distribution (PROBE-PULL-KICKOFF)** per 2026-06-07 distribution-rethink. Social-first gate retained as running scorecard.
**Source:** `docs/notion/2026-06-02-wk6-restrategy-social-first.md` (gate), `docs/notion/2026-06-08-wk-end-metric-snapshot.md` (prior).

---

## Snapshot vs prior (6/8) + Wk6 gate target

| # | Metric | Wk6 baseline (6/8) | Gate target (6/15) | **Current (6/15)** | Δ vs 6/8 | Hit? |
|---|---|---|---|---|---|---|
| 1 | GH stars (organic) | 1 | ≥10 | **1** | 0 | ✗ |
| 2 | npm weekly DL | 104 | ≥180 | **367 raw / ~94 organic** | see note | ✗ |
| 3 | Unsolicited mentions | 0 | ≥2 | **0** | 0 | ✗ |
| 4 | External Discussion replies | 0 | ≥3 | **0** | 0 | ✗ |
| 5 | Scorecards live | 7 | 6 ✓ | **7** ✓ | 0 | ✓ |

**Trigger status: 1/5 hit** (unchanged from Wk5 / 6/7 / 6/8). Only self-authored scorecards clears.

**Decision rule:** ≥4/5 → fire Show HN · ≥3/5 → ship Track A+B Wk7 · <3/5 → re-strategize/extend.
**→ At 1/5: EXTEND pull-distribution sprint. Do NOT fire Show HN. Show HN stays slipped toward 2026-06-30.**

---

## Data sources

1. **GH stars = 1** — `gh api repos/Incultnitollc/mcp-probe` → stars 1, forks 1, subs 0, issues 2. Zero organic stars in 7 weeks. Δ0.
2. **npm weekly = 367 raw, but publish-day inflated.** Daily 6/8–6/14: **273**, 12, 19, 15, 6, 25, 17. The **273 on 6/8 = v1.1.2 npm publish + registry crawlers** (self-triggered, not inbound). Strip it → **~94 organic over 6 days (avg ~15.7/day)**. Organic floor did lift (prior 0–15/day → now 12–25/day) — a **mild real uptick** — but on an inbound basis it is ~2× short of ≥180. Counting the raw 367 would game the gate with our own publish spike, so scored **✗**. Literal number disclosed for the record.
3. **Unsolicited mentions = 0** — `gh search code "@incultnitollc/mcp-probe"` → only `Incultnitollc/mcp-probe` + 2 automated aggregators (`devops-actions/github-actions-marketplace-news` Marketplace bot, `linny006/mcp-servers-live` 15-min scraper). **Zero genuine human third-party mention.** Δ0.
4. **External Discussion replies = 0** — `gh api graphql` over all 9 discussions: 3 comments, all `PengSpirit`. No non-Peng reply ever. Δ0.
5. **Scorecards live = 7** — `docs/publishability-scorecards/`: everything, filesystem, github, memory, postgres, puppeteer, sequential-thinking (+ SUMMARY.md). Self-authored, not external signal.

**Citation sweep (diagnostic, bi-weekly — not a gate metric):** last sweep 2026-06-07 = **0/20** (Perplexity 0/10 + Gemini 0/10; ChatGPT+Claude login-walled, owed). Next due ~2026-06-21. No new pull today — unchanged 0/20.

**Watch item — punkpeye/awesome-mcp-devtools#156** ("Add mcp-probe to Testing Tools"): still **OPEN**, untouched since **2026-05-05** (41 days). Cheapest external proof point — still not merged.

---

## Read

Formal gate day. Verdict is **flat at 1/5** — identical to Wk5, 6/7, and 6/8. Every inbound signal the gate measures (stars, third-party mentions, external replies) remains at **zero**. The only movement is the npm organic floor nudging ~15/day → ~15.7/day, plus a 273 publish-day spike that is **our own** and does not count. Registry-listing-live (6/8) and the MCP-server wedge shipped, but **no external party has acted on them yet** — no merge, no mention, no star. The pull plays are live but have not landed traction. Nothing here justifies firing Show HN; doing so into 1/5 would burn the one-shot launch.

## What would move the verdict (watch 6/15–6/21)

1. **PR #156 merges** → first real external listing → unblocks mentions. 41 days open. Nudge it.
2. **dev.to article #1 syndication** (canonical URL decision still owed) → first GEO citation candidate before the 6/21 sweep.
3. **Any external star/mention** off the live registry listing → first genuine inbound tick.

## NOTION DECISIONS-LOG PASTE BLOCK

```
2026-06-15 — mcp-probe FORMAL GATE RE-CHECK (Wk-end, Mon): 1/5 (flat vs Wk5/6/8).
Stars 1/≥10 ✗ · npm 367 raw but 273 = publish-day spike → ~94 organic/≥180 ✗ ·
mentions 0/≥2 ✗ · ext Discussion replies 0/≥3 ✗ · scorecards 7/6 ✓. Citation sweep 0/20 (bi-weekly, next ~6/21).
PR #156 still OPEN/unmerged (41d). Decision: EXTEND pull-distribution sprint (PROBE-PULL-KICKOFF);
do NOT fire Show HN — stays slipped toward 2026-06-30. Next gate re-check Mon 2026-06-22.
Evidence: docs/notion/2026-06-15-wk-end-metric-snapshot.md.
```

## Resume keyword

`WK-END-SNAPSHOT` — 1/5 (flat, gate not cleared). Re-capture all 5 Mon 2026-06-22. ChatGPT+Claude citation sweep still owed (~6/21).
