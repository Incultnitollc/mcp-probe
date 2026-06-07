# mcp-probe — Wk6 metric snapshot (PRE-GATE PREP)

**Date captured:** 2026-06-07 ~21:15 TPE (prep for Sun 6/8; gate re-check Mon 2026-06-15).
**Purpose:** Pre-Mon 2026-06-15 GATE re-check. Compare vs Wk5 baseline (1/5). Target **≥3/5** to keep the 2026-06-16 Show HN slot live.
**Source:** `docs/notion/2026-06-02-wk6-restrategy-social-first.md`. Real-calendar reconciliation 2026-06-03.
**⚠️ This is a PREP snapshot, 8 days before the gate.** Tracks A/B/C still have runway (6/8–6/14). It captures where we stand NOW, not the final gate verdict.

---

## Snapshot vs Wk5 baseline + Wk6 gate target

| # | Metric | Wk5 (6/1) | Wk6 target (6/15) | **Current (6/7)** | Δ vs Wk5 | Hit target? |
|---|---|---|---|---|---|---|
| 1 | GH stars (organic) | 1 | ≥10 | **1** | 0 | ✗ |
| 2 | npm weekly DL | 121 | ≥180 | **104** (rolling 7d 6/1–6/7 = **27**) | −17 (−94 rolling) | ✗ |
| 3 | Unsolicited mentions | 0 | ≥2 | **0** | 0 | ✗ |
| 4 | External Discussion replies | 0 | ≥3 | **0** | 0 | ✗ |
| 5 | Scorecards live | 6 | 6 ✓ | **7** ✓ | +1 | ✓ |

**Trigger status: 1/5 hit** (unchanged from Wk5). Only scorecards (self-authored) clears.

---

## Data sources

1. **GH stars = 1** — `gh api repos/Incultnitollc/mcp-probe` → `stargazers_count:1`, `forks:1`, `subscribers:0`, `open_issues:2`. Zero organic stars in 6 weeks.
2. **npm weekly = 104** — `api.npmjs.org/downloads/point/last-week` (window 5/27–6/2, the lagging API window comparable to Wk5's 121). **Current rolling 7-day (6/1–6/7) = 27** (0,4,15,5,3,0,0). The 5/27 mini-spike (48, v0.2.0/install curiosity) has decayed back to the organic floor of ~0–15/day. **Downloads are declining, not climbing toward ≥180.**
3. **Unsolicited mentions = 0** — `gh search code "@incultnitollc/mcp-probe"` + `gh search issues mcp-probe`. Only artifacts naming our package outside our own repos are automated aggregators: `devops-actions/github-actions-marketplace-news` (Marketplace bot) and `linny006/mcp-servers-live` (15-min scraper) — both unchanged from Wk5. All other "mcp-probe"/"probe" issue hits are unrelated (generic health-probes, the unrelated Rust `conikeec/mcp-probe`, and `k08200/mcp-probe` — a separate-owner namesake/fork, not a citation). **Zero genuine human third-party mention.**
4. **External Discussion replies = 0** — `gh api graphql` over all 9 discussions: every comment author is `PengSpirit`. No non-Peng has ever replied. ⚠️ **Correction:** the 2 X replies shipped 6/5 (@milvusio, @PawelHuryn) are **outbound brand replies**, NOT inbound "external Discussion replies" — they do not move metric #4. (A prior session note conflated the two; this metric measures *inbound* engagement on our GH Discussions and is still 0.)
5. **Scorecards live = 7** — `docs/publishability-scorecards/`: server-everything, -filesystem, -github, -memory, -postgres, -puppeteer, -sequential-thinking (+ SUMMARY.md). Threshold met — but this is self-authored content, not external signal.

**Citation sweep (diagnostic, separate):** Wk6 bi-weekly sweep 2026-06-07 = **0/20** (Perplexity 0/10 + Gemini 0/10; ChatGPT+Claude login-walled, owed). Δ 0 vs Wk5. Logged `docs/citation-log.md`, screenshots `docs/citation-log-screenshots/2026-06-07-sweep/`. Not a gate metric per Wk6 re-strategy.

---

## Read

As of 6/7, the needle has **not moved** — 1/5, identical to Wk5, with npm trending *down*. Wk6 distribution work shipped (2 videos, 1 X thread, 2 outbound X replies) but none has converted to the inbound signals the gate measures (stars, third-party mentions, external replies). The strategy's own thesis — social broadcast compounds where singular DMs didn't — has **not yet shown evidence** in the metrics; the compounding (if it comes) would land in the 6/8–6/14 window.

**Brutal honest projection:** to flip to ≥3/5 by 6/15 we need 2 of {stars 1→≥10, npm 104→≥180, mentions 0→≥2, ext replies 0→≥3} to move within 7 days. Stars and external replies require someone outside Peng to act on the video/X push. Nothing in the current data says that's imminent. **Most likely 6/15 outcome on present trajectory: gate MISS → Show HN moves to 2026-06-30** (per the re-strategy's stated fallback).

## What would change the verdict (watch 6/8–6/14)

1. **The Track C replies land an engagement** (philschmid or simonw) → credibility cascade → stars/mentions. Highest-leverage single event.
2. **A video clip breaks containment** (Track A) → npm + stars spike. Track A is the primary bet; needs one clip to actually travel.
3. **punkpeye/awesome-mcp-devtools#156 merges** → first real external listing → unblocks mentions. Still the cheapest external proof point.

## NOTION DECISIONS-LOG PASTE BLOCK

```
2026-06-07 — mcp-probe Wk6 pre-gate snapshot: 1/5 (unchanged from Wk5).
Stars 1/≥10 ✗ · npm 104/≥180 ✗ (rolling 7d=27, declining) · mentions 0/≥2 ✗ ·
ext Discussion replies 0/≥3 ✗ · scorecards 7/6 ✓. Citation sweep 0/20 (Δ0).
Wk6 social-first work shipped but no inbound conversion yet; the 6/8–6/14 window
is decisive. On current trajectory the 6/15 gate misses → Show HN slips to 2026-06-30.
Note: 6/5 X replies are outbound, do NOT count toward ext-replies metric.
Evidence: docs/notion/2026-06-08-wk6-metric-snapshot.md, docs/citation-log.md (Wk6 sweep).
```

## Resume keyword

`WK6-SNAPSHOT` — 1/5 prep (unchanged). Re-capture all 5 + recount on Mon 2026-06-15 for the live gate verdict. ChatGPT+Claude citation sweep still owed.
