# mcp-probe — Daily community-presence cadence log

Daily target (revised 2026-05-07, see `docs/notion/2026-04-29-launch-postponement.md` line 62):
**4 GitHub-venue replies** (Issues / Discussions / Cursor forum) + **1-2 r/mcp** + **1 r/ClaudeAI**.

Probe-mention ratio target: **≤50% across the week.** If creeping above, force probe-free replies to recalibrate.

---

## 2026-05-09 (Sat) — Wk1 Day 6

**GitHub venues (4/4)**

- [x] thread URL: https://github.com/anthropics/claude-code/issues/41827 — venue: gh-issues — template: D3-adjacent — probe-mentioned? **N**
- [x] thread URL: https://github.com/modelcontextprotocol/servers/issues/3537 — venue: gh-issues — template: D2+D4 anti-purpose — probe-mentioned? **N**
- [x] thread URL: https://github.com/modelcontextprotocol/servers/issues/3669 — venue: gh-issues — template: D2+R1 — probe-mentioned? **Y**
- [x] thread URL: https://github.com/modelcontextprotocol/servers/issues/4095 — venue: gh-issues — template: D4 — probe-mentioned? **Y**

**Reddit (2/1-2)**

- [x] thread URL: https://www.reddit.com/r/mcp/comments/1t78g5r/what_is_the_smallest_mcp_trace_that_is_still/ — template: R2 + trace-observability — probe-mentioned? **Y**
- [x] thread URL: https://www.reddit.com/r/mcp/comments/1t6zxa0/our_email_mcp_turned_out_intentbased_not/ — template: R1-NO-PROBE + runtime-policy — probe-mentioned? **N**

**r/ClaudeAI (0/1) — honest skip**

Past-week r/ClaudeAI MCP-tagged threads were dominated by `flair=Built with Claude` showcases and off-topic posts. Best borderline candidate (`1t5ah5r` "Internal tools wIth no MCP") was a pre-build question, not a fit for D1-D4/R1-R2. Per playbook "don't fabricate a thread" rule, slot dropped today. Re-check tomorrow.

**Cursor forum (0/1) — blocked**

Subagent's WebSearch + WebFetch were denied in this session, so Cursor forum could not be hunted. GH Issues alone covered the 4-GH target. To unblock for future sessions, re-grant `forum.cursor.com` permission in `.claude/settings.local.json`.

**Tally — 2026-05-09**

- Replies shipped: 6 (4 GH + 2 r/mcp)
- Probe-mention ratio: **3/6 = 50%** (at cap)
- Anti-pattern violations: 0
- Closed/locked threads accidentally targeted: 0 (all 4 GH state-checked OPEN at ~14:00 TPE; both r/mcp threads OPEN, not locked, not archived)
- Diagnosis-first lead: 6/6 ✅
- Anthropic MCP Inspector named: 5/6 (skipped only on #3537 anti-purpose security thread where Inspector wasn't the natural complement)
- "I built X" / "DM me" closers: 0 ✅

**Fresh ammunition deployed today**

- 5-axis parameter contract (Mads Hansen, May 6): woven into GH #3669, #4095, claude-code #41827
- Anti-purpose / "do not use for" framing (Mads Hansen, May 9): woven into GH #3537, r/mcp `1t78g5r`, r/mcp `1t6zxa0`
- Dev.to anti-purpose article URL `https://dev.to/incultnito_llc/tool-descriptions-are-load-bearing-too-the-anti-purpose-pattern-in-mcp-15m2` referenced in GH #3537 + r/mcp `1t6zxa0` (note: `incultnito_llc` username has underscore — different account from the schema-descriptions article's `incultnitollc`)

**Next signals to watch**

- Reply-to-replies on any of the 6 threads (especially `1t78g5r` and #3669 — highest substantive-engagement potential)
- Whether a recurring contributor (Mads Hansen pattern) emerges from r/mcp `1t6zxa0` (intent-vs-tool framing is open-question territory)
- Sun 2026-05-10 14:00 TPE: Reddit batch + 15:00 TPE citation sweep #2

**Reply-check 2026-05-10 (added retroactively)**

Verified via `gh api` for the 4 GH threads and Reddit JSON curl for the 2 r/mcp threads:

- All 4 GH threads OPEN, PengSpirit is LAST commenter on each → 0 replies yet.
- r/mcp `1t78g5r` — comment **visible** in public thread JSON, no replies yet.
- r/mcp `1t6zxa0` — comment **NOT visible** in thread's public JSON. Present in `u/incultnito` profile feed → **shadow-removed**, almost certainly by automod. Likely trigger: 2-min burst between the two r/mcp comments (09:38 + 09:40 UTC) on a dormant account (~11.5 months of prior inactivity). Content was R1-NO-PROBE (no links / products / probe mention), so trigger was velocity, not content.

**Implication for the daily tally:** the published cadence count of "6 replies shipped" overstates by 1 on the public-visible side. True public-visible count is **5/6** (4 GH + 1 r/mcp + 1 r/mcp shadow-removed).

**Recovery: SKIPPED 2026-05-10.** Peng verified invisibility in incognito, confirmed shadow-removal, and decided not to pursue modmail recovery (sunk cost). Comment body recovered from `u/incultnito` profile feed for analysis — included a `dev.to/incultnito_llc/...` self-link in the last paragraph, which is the stronger trigger than velocity alone (`1t78g5r` had same velocity context but no self-link and survived).

**Cadence rules going forward (encoded in `feedback_reddit_velocity.md`):**
1. No self-published links (dev.to, GitHub, blog) from u/incultnito on r/mcp until the account has 5+ visible recent comments + 10 sub-karma.
2. Space r/mcp + r/ClaudeAI cadence comments ≥10 min apart.

Apply starting Sun 2026-05-10 14:00 TPE Reddit batch — drop dev.to-link variants from R1/R2 templates for u/incultnito until karma builds.

---

## 2026-05-12 (Tue) — Wk2 Q7 ship + 2 GH Discussion replies

**Not a daily cadence day — single ship event under the WK2-Q7-DROP playbook.** Cadence target was paused; tally below documents engagement-surface deployment only.

**GH Discussion replies (2/2)**

- [x] thread URL: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2682#discussioncomment-16892574 — venue: gh-discussions (MCP spec repo) — template: Q7-followup — probe-mentioned? **N** (article-link only; probe is mentioned inside the article body, not the reply)
- [x] thread URL: https://github.com/Incultnitollc/mcp-probe/discussions/11#discussioncomment-16892577 — venue: gh-discussions (own repo show-and-tell) — template: scorecard-followup — probe-mentioned? **Y** (own repo, on-topic)

**Reddit (0/0 — skipped per cadence rule)**

r/mcp Q7 cross-post explicitly skipped per `feedback_reddit_velocity.md` (u/incultnito self-link → automod risk until karma builds).

**Surfaces deployed**

- GitHub blog (canonical, autofire via launchd job `com.peng.wk2-q7-drop` at 10:03 TPE — booted out + plist + script cleaned ~10:30 TPE)
- dev.to (manual paste, account `@incultnitollc`, no underscore)

**Title fix at ship**

`docs/blog/wk2-missing-description-impact.md` line 2 — "Three failure modes" → "Four failure modes" (body always documented 4; title was understating).

**Tally — 2026-05-12**

- Replies shipped: 2 GH-discussion (both own threads or own RFC, zero prior comments → first-comment posts; not "top-posts" in the anti-pattern sense)
- Probe-mention ratio: 1/2 = 50% (at cap; both legitimate — #11 thread is the scorecard show-and-tell)
- Anti-pattern violations: 0
- Anthropic MCP Inspector named: 1/2 (in #2682 reply contextually via article link; article body itself names Inspector explicitly as "right tool for interactive debugging")
- Self-promotional "I built X" / "DM me" closers: 0 ✅

**Next**

- Thu 2026-05-14 ~10:00 TPE: Q7 Δ-sweep (resume keyword `Q7-DELTA-SWEEP`) — re-run "what does missing description on MCP tool do" on all 4 LLMs in fresh sessions.
- Resume normal daily cadence (4 GH + 1-2 r/mcp + 1 r/ClaudeAI) when Wk2 content sprint allows.

---

## 2026-05-15 (Fri) — Wk2 Day 5 manual-fire

**GitHub venues (4/4) — via `scripts/wk2-gh-presence-post.sh` 20:58–21:13 CST**

- [x] https://github.com/anthropics/claude-code/issues/58841#issuecomment-4459948726 — venue: gh-issues — template: D2 top-level union diagnostic — probe-mentioned? **Y** (inline single sentence, after diagnosis)
- [x] https://github.com/anthropics/claude-code/issues/58794#issuecomment-4459982134 — venue: gh-issues — template: D4 `$ref` enum serialization — probe-mentioned? **Y** (workaround-confirmation framing)
- [x] https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1990#issuecomment-4460013644 — venue: gh-issues (discussion-style) — template: SEP-1627 cross-link — probe-mentioned? **N** (deliberate recalibrator)
- [x] https://github.com/anthropics/claude-code/issues/56263#issuecomment-4460046123 — venue: gh-issues — template: D-Cowork anyOf stripping — probe-mentioned? **Y** (elimination-step framing)

**Reddit (2/2) — manual paste by Peng**

- [x] https://www.reddit.com/r/mcp/comments/1tci9yv/ — template: R-federation (cross-machine transport) — probe-mentioned? **N** (deliberate recalibrator, no self-links)
- [x] https://www.reddit.com/r/ClaudeAI/comments/1tcu5zm/ — template: D1+D3 tool-registration — probe-mentioned? **Y** (1 mention, Inspector named first)

**Tally — 2026-05-15**

- Replies shipped: 6 (4 GH + 1 r/mcp + 1 r/ClaudeAI) ✅ on target
- Probe-mention ratio: **4/6 = 67%** ⚠️ over 50% cap — drafts #3 + #5 deliberately probe-free, but #1/#2/#4/#6 all mentioned. Next cadence run must force ≥2 probe-free GH replies to recalibrate.
- Anti-pattern violations: 0 (no top-posts, no `npm install` leads, no "I built X", no self-links from u/incultnito)
- Diagnosis-first lead: 6/6 ✅
- Anthropic MCP Inspector named: 4/4 probe-mention replies ✅
- Closed/locked threads accidentally targeted: 0 (all state-checked OPEN pre-fire)
- Manual-fire workflow: validated — classifier blocks autonomous external posts, script + manual run is the right default (`feedback_manual_fire_external_posts.md`)
- Log: `logs/wk2-gh-presence-post-20260515-205759.log`

**Next**

- Sat 2026-05-16 AM: incognito verify both Reddit comments still visible (shadow-removal often invisible from logged-in view)
- Mon 2026-05-18 evening: re-run Q7-DELTA-SWEEP pre-T+7 check
- Tue 2026-05-19 22:00 TPE: conditional Q7-T7-AMPLIFY (Buffer Twitter thread + LinkedIn) if Δ still 0/4
- Sat 2026-05-23: SECURITY-SUITE v1.1.0 ship

---
