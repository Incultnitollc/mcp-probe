# Wk6 Re-Strategy — Social-First Distribution

**Date:** 2026-06-02
**Trigger:** Wk5 1/5, Show HN held. 4 wks daily-GH-presence → 0 external validation.
**Evidence:** commit `0dd955d`, `docs/notion/2026-06-01-wk5-metric-snapshot.md`.
**Decision:** Replace singular-DM / per-thread-reply motion with social broadcast + influencer co-sign.

---

## Why singular DMs failed
| Motion | Output | External signal |
|---|---|---|
| 9 GH Discussion threads (Wk1–Wk5) | 100% self-authored | 0 ext replies, 0 ext users |
| 6/6 daily-presence GH thread replies (Wk5) | ~30 min/day for 5 days | 0 follow-ups, 0 inbound |
| 80 LLM queries (Wk3–Wk5) | 0 citations | semantic lanes locked to competitors |
| punkpeye/awesome-mcp-devtools#156 PR | filed, waiting | not merged |

**Lesson:** Per-thread engagement is O(n) work with O(0) compound. Social broadcast is O(1) work with O(audience) compound.

---

## 3 Tracks (Wk6 → Wk9, 4-week sprint)

### TRACK A — Short-form video (PRIMARY)
**Bet:** dev video is the only channel where mcp-probe can leapfrog locked text lanes.
**Output:** 2 videos/wk × 4 wks = 8 videos.
**Channels (cross-post each):** YouTube Shorts, TikTok, X video, LinkedIn video.
**Topic stack (pre-locked):**
1. "Your MCP server is broken — here's the 3-second test" (hook = pain)
2. "What MCP Inspector won't show you" (lane-flank vs locked competitor)
3. "publishability score 0/10 → 8/10 live edit" (only-we-do-this wedge)
4. "I scanned the top 50 MCP servers. Results inside." (data + clip-worthy)
5. "CI/CD for MCP servers — 60-sec setup" (GitHub Action lane re-test)
6. "Why your Claude Desktop dies when you add a server" (failure-mode lane re-test)
7. "MCP server bake-off — 5 frameworks tested" (controversy → shares)
8. "Recap + roadmap" (community signal)
**Tooling:** invoke `social-video-pipeline` skill — Sora 2 + free music + Whisper captions + Buffer scheduling. Defaults already wired.
**Why this beats text:** Inspector + philschmid + Anthropic-docs own SEO; they don't own YouTube/TikTok/X-video lanes for MCP testing.
**Cadence:** Mon + Thu, 21:00 Taipei post.

### TRACK B — X (Twitter) amplification chain
**Bet:** dev Twitter is where MCP discourse happens IRL (swyx, philschmid, simonwillison, transitive-bullsh*t, etc.).
**Output:** 1 thread/wk + 5 high-signal replies/wk to MCP/AI-tooling conversations.
**Thread stack:**
- Wk6: "I shipped an MCP test harness. Here's what I learned about the protocol's sharp edges." (5-tweet thread, end with repo)
- Wk7: "Data: I scanned 50 MCP servers. 38 of them fail this 1 check." (data + chart image)
- Wk8: "publishability score — what it is, why MCP needs it" (manifesto)
- Wk9: "Recap of 4 weeks scanning the MCP ecosystem" (signal-stacking)
**Reply targets:** any tweet from MCP/AI-tooling accounts (>1k followers) where mcp-probe is a *helpful* answer. NOT pitch — answer the actual question.
**Banned:** mass reply, "check out my repo" closer, generic thread bots.
**Channel:** @PengSpirit (existing). Buffer-queued via MCP.

### TRACK C — Influencer co-sign (1 hit, not 100 DMs)
**Bet:** 1 co-sign from a credible MCP voice > 1,000 cold DMs.
**Target list (max 5, pick 2 to chase):**
| Handle | Audience | Why they'd care |
|---|---|---|
| @swyx | AI-eng community, smol-podcaster | covers dev tools, MCP-curious |
| @simonw (Simon Willison) | LLM-obsessed dev audience | writes weekly about LLM tooling |
| @philschmid | Owns the MCP best-practices SEO lane | mcp-probe complements, not competes |
| @hwchase17 (LangChain) | Adjacent toolchain | MCP integration angle |
| @anthropicai (or DevRel reply) | First-party, highest credential | publishability score + scorecard story |
**Approach:** 1 public, valuable interaction first (substantive reply to their content, no pitch). Wait 1 wk. Then send 1 short DM with a *gift* — pre-run mcp-probe report on a server they care about + zero ask. If they reply, offer a guest segment / co-authored post / data exchange. **Max 2 outreach total this sprint.** No mass.
**Banned:** "love your work" openers, generic asks, follow-up DMs without new value.

---

## What we STOP doing
| Stop | Why |
|---|---|
| Daily GitHub Discussion fires | 0/9 ext replies after 5 wks. Saturated own surface. |
| Per-thread reply farming | O(n) work, O(0) compound, drains 30+ min/day. |
| Multi-Q LLM citation sweeps (weekly) | Diagnostic only — bi-weekly snapshot is enough. |
| Cold DMs to MCP devs | Same shape as singular threads. |
| Hand-writing thread copy from scratch | Use templates + repurpose video scripts. |

## What we KEEP doing
- punkpeye/awesome-mcp-devtools#156 chase — 1 ext listing unlocks Wk6-Wk9 gates
- mcp-probe ship cadence — v1.2 features compound with content
- Wk-end metric snapshot (Mon evenings)

---

## Wk6 schedule (2026-06-02 → 2026-06-08)
| Day | Track | Output |
|---|---|---|
| Mon 6/2 | strategy | this doc + GCal reschedule |
| Tue 6/3 | A | video #1 ("3-second test") — generate via `social-video-pipeline`, queue Buffer |
| Wed 6/4 | B | X thread #1 + 2 high-signal replies |
| Thu 6/5 | A | video #2 ("Inspector won't show") — generate + queue |
| Fri 6/6 | C | influencer Track C — pick 2 targets, log 1 public reply to each |
| Sat 6/7 | rest | — |
| Sun 6/8 | — | Wk6 metric snapshot prep |

## Mon 2026-06-15 GATE re-check (Show HN trigger)
| Metric | Wk5 | Target Wk6 end | Show HN-go (Wk7) |
|---|---|---|---|
| GH stars | 1 | ≥10 | ≥30 |
| npm weekly | 121 | ≥180 | ≥250 |
| Unsolicited mentions | 0 | ≥2 | ≥5 |
| External Discussion replies | 0 | ≥3 | ≥10 |
| Scorecards live | 6 ✓ | 6 ✓ | 6 ✓ |
| **Score** | **1/5** | **≥3/5 = ship Track A+B Wk7** | **≥4/5 = fire Show HN 2026-06-16** |

Move Show HN to 2026-06-30 if Wk6 gate misses.

---

## Risks
- Video pipeline produces low-quality output → quality bar before posting; kill any clip <8/10
- Influencer outreach reads as transactional → 2-target cap, gift-first
- X reply farming drifts back into singular-DM motion → rule: never reply to <500-follower accounts, never reply twice/day to same thread
- Track A is expensive (Sora 2 API) → cap at 2 videos/wk, abort if cost >$50/wk

## Notion paste (Decisions Log)
```
2026-06-02 — Probe distribution pivot: singular-DM/per-thread motion → social-first.
3 tracks: short-form video (primary), X amplification (secondary), 2-target
influencer co-sign (gift-first). Show HN moved to 2026-06-16 conditional on
Wk6 gate ≥3/5 (was 1/5). Strategy doc: docs/notion/2026-06-02-wk6-restrategy-social-first.md.
Evidence: commit 0dd955d.
```
