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

---
