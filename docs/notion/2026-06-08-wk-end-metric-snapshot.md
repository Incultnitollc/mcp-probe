# mcp-probe — Wk-end metric snapshot — Mon 2026-06-08 (live, ~18:15 TPE)

**Cadence:** Wk-end snapshot, Mon evenings (per Wk6 re-strategy). Live pull (the 6/7 file was PRE-GATE PREP).
**Purpose:** Track inbound traction vs Wk6 gate targets. Formal GATE re-check Mon 2026-06-15.
**Context:** Active sprint is now **pull-distribution (PROBE-PULL-KICKOFF)** per 2026-06-07 distribution-rethink — social-first gate framework retained here as the running scorecard, but the motion underneath it pivoted push→pull.
**Source:** `docs/notion/2026-06-02-wk6-restrategy-social-first.md` (gate), `docs/notion/2026-06-07-distribution-rethink.md` (active strategy).

---

## Snapshot vs Wk5 baseline + Wk6 gate target

| # | Metric | Wk5 (6/1) | Wk6 target (6/15) | **Current (6/8)** | Δ vs Wk5 | Hit? |
|---|---|---|---|---|---|---|
| 1 | GH stars (organic) | 1 | ≥10 | **1** | 0 | ✗ |
| 2 | npm weekly DL | 121 | ≥180 | **104** (rolling 7d = **39**) | −17 | ✗ |
| 3 | Unsolicited mentions | 0 | ≥2 | **0** | 0 | ✗ |
| 4 | External Discussion replies | 0 | ≥3 | **0** | 0 | ✗ |
| 5 | Scorecards live | 6 | 6 ✓ | **7** ✓ | +1 | ✓ |

**Trigger status: 1/5 hit** (unchanged from Wk5 + 6/7 prep). Only scorecards (self-authored) clears.

**Decision rule:** ≥4/5 → fire Show HN 6/16 · ≥3/5 → ship Track A+B Wk7 · <3/5 → re-strategize/extend.
**→ At 1/5: CONTINUE pull-distribution sprint. Do NOT fire Show HN. Show HN stays slipped toward 2026-06-30.**

---

## Data sources

1. **GH stars = 1** — `gh api repos/Incultnitollc/mcp-probe` → `stars:1, forks:1, subs:0, issues:2`. Zero organic stars in 6 weeks. Δ0.
2. **npm weekly = 104** — `api.npmjs.org/.../last-week` (window 5/27–6/2, the lagging API window comparable to Wk5's 121). **Rolling 7d (6/1–6/7) = 39** (0,4,15,5,3,0,12). 6/8 = 0 so far. The API backfilled 6/7 from 0→12 since the prep snapshot (rolling was 27, now 39) — a mild uptick but still ~4.6× short of ≥180. No sustained climb; organic floor ~0–15/day.
3. **Unsolicited mentions = 0** — `gh search code "@incultnitollc/mcp-probe"` → only `Incultnitollc/mcp-probe` + 2 automated aggregators (`devops-actions/github-actions-marketplace-news` Marketplace bot, `linny006/mcp-servers-live` 15-min scraper). All issue/PR hits are inside our own repo. **Zero genuine human third-party mention.** Δ0.
4. **External Discussion replies = 0** — `gh api graphql` over all 9 discussions: 3 comments, all `PengSpirit`. No non-Peng has ever replied. Δ0. (Reminder: 6/5 X replies are *outbound* brand replies, do NOT count here.)
5. **Scorecards live = 7** — `docs/publishability-scorecards/`: everything, filesystem, github, memory, postgres, puppeteer, sequential-thinking (+ SUMMARY.md). Threshold met — self-authored, not external signal.

**Citation sweep (diagnostic, bi-weekly — not a gate metric):** last sweep 2026-06-07 = **0/20** (Perplexity 0/10 + Gemini 0/10; ChatGPT+Claude login-walled, owed). Next sweep due ~2026-06-21. No new pull today — unchanged 0/20.

**Watch item — punkpeye/awesome-mcp-devtools#156** ("Add mcp-probe to Testing Tools"): still **OPEN**, untouched since 2026-05-05. The cheapest external proof point — still not merged.

---

## Read

Two full weeks past the social-first pivot and one day into pull-distribution, the gate needle is **flat at 1/5** — identical to Wk5 and the 6/7 prep. The only positive tick is npm rolling 7d nudging 27→39 (6/7 backfill), still nowhere near ≥180. Every inbound signal the gate measures — stars, third-party mentions, external replies — remains at zero. The 6/7 push→pull rethink is the correct response to exactly this data; today's pull is the new baseline against which the pull plays (install-time/publish-time discovery, MCP-server wedge, awesome-list merge) get measured. None of those have shipped/landed yet, so no movement expected until they do.

## What would move the verdict (watch 6/8–6/14)

1. **PR #156 merges** → first real external listing → unblocks mentions. Cheapest proof point, still open.
2. **MCP-server wedge ships** (Fork-#2, PROBE-PULL-KICKOFF) → install-time discovery surface, not dependent on social broadcast.
3. **Article #1 syndication** (dev.to canonical) lands a GEO citation → first citation flip.

## NOTION DECISIONS-LOG PASTE BLOCK

```
2026-06-08 — mcp-probe Wk-end snapshot (Mon): 1/5 (unchanged vs Wk5 + 6/7 prep).
Stars 1/≥10 ✗ · npm 104/≥180 ✗ (rolling 7d=39, +12 from 6/7 backfill, still ~4.6× short) ·
mentions 0/≥2 ✗ · ext Discussion replies 0/≥3 ✗ · scorecards 7/6 ✓. Citation sweep 0/20 (no new pull, bi-weekly).
PR #156 still OPEN/unmerged. Decision: CONTINUE pull-distribution sprint (PROBE-PULL-KICKOFF);
do NOT fire Show HN — stays slipped toward 2026-06-30. Formal gate re-check Mon 2026-06-15.
Evidence: docs/notion/2026-06-08-wk-end-metric-snapshot.md.
```

## Resume keyword

`WK-END-SNAPSHOT` — 1/5 (flat). Re-capture all 5 + recount Mon 2026-06-15 for the live gate verdict. ChatGPT+Claude citation sweep still owed.
