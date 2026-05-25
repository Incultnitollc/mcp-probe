# mcp-probe — Wk4 snapshot Mon 2026-05-25 09:00 TPE (run ~22:55 TPE late)

| Metric | Value | Δ vs Wk2 (2026-05-11) | Threshold | Hit? |
|---|---|---|---|---|
| GH stars (organic) | 1 | 0 (still 1) | ≥100 | ✗ |
| npm weekly DL | 196 | +73 (was 123) | ≥150 | ✓ |
| Unsolicited mentions | 0 | 0 (still 0) | ≥5 | ✗ |
| Discussions: threads / replies / distinct users | 3 / 3 / 0 | +3/+3/0 (was 0/0/0) | ≥10 / ≥5 | ✗ |
| Scorecards live | 10 | +10 (none at Wk2) | ≥6 | ✓ |
| Citation sweep | 0/40 cited (Wk3 baseline; Wk4 sweep scheduled Sun 5/24 15:00 TPE, not yet logged) | 0 (still 0/40) | (separate) | — |

**Trigger status: 2/5 hit**

**Decision: extend** (3-4/5 = 2-week extend per rule; 2/5 is below that, lean re-strategize but recent v1.1.0 ship justifies extending the watch window — see context)

## Context for the decision
- v1.1.0 ship was Fri 2026-05-22 — only **3 days** of post-ship signal. Most npm DL (146 of 196) came from ship-day 5/22 alone — install spike, not adoption proof.
- Clinic pivoted async on 5/22 (no live window). Discussion #13 + MCP #2768 open but **zero non-Peng comments** as of this snapshot.
- All 3 Discussions threads + 3 replies are PengSpirit-authored. Distinct non-Peng commenters = **0**.
- Unsolicited mentions: code search returned 65 distinct non-Peng repos with the literal string "mcp-probe", but all reference `conikeec/mcp-probe` (Rust tool, predates ours) or local script names. **Zero mentions of `@incultnitollc/mcp-probe` specifically.**
- Scorecards threshold hit (10 ≥ 6) but that's authored content, not external signal.
- npm DL threshold hit (196 ≥ 150) but spike-driven; weekday tail (5/23 = 5, 5/24 = 12) shows organic floor is still ~10/day.
- Show HN gate per `decision_security_suite_before_show_hn.md` requires 5/5. Currently 2/5. **Do NOT submit Show HN this week.**
- Wk3 citation sweep (5/16) + Wk3 verify sprint (5/17) confirmed 3 incumbents own the install-time security lane; pivot to publishability-score landed and shipped.

## Top 3 levers to pull this week
1. **Unblock first non-Peng Discussions comment** — pin discussion #13 manually in repo UI (GraphQL `pinDiscussion` doesn't exist per memory), and cross-post #2768 link to 1-2 high-signal MCP-author surfaces that allow it (NOT MCP Contributor Discord per `reference_mcp_official_channels.md`). Target: 1 external scorecard request by Fri 5/29.
2. **Twitter/X 60-floor reveal post** — "I tested every official Anthropic MCP server. All score 60/100. Here's why." Buffer-schedule for Tue 5/26 morning ET / late-evening TPE. Currently sitting on the calibration finding without amplification; this is the v1.1.0 launch viral angle that should generate stars + unsolicited mentions.
3. **Wk4 citation sweep** — Sun 5/24 15:00 TPE slot was scheduled per `project_launch.md`. Verify it ran (no Wk4 entry in citation-log.md as of 22:55 5/25). If not yet run, prioritize tonight or tomorrow morning — first sweep post-v1.1.0-ship + post-amplify-fire is the highest-signal measurement of the launch arc.
