# GCal event spec — Q7 T+7 amplify (Δ=0 fallback)

**Created:** 2026-05-15 TPE
**Trigger source:** `docs/citation-log.md` § 2026-05-15 Δ-sweep — recorded Δ=0/4 cited, armed 7-day amplification per playbook.
**Resume keyword (code):** `Q7-T7-AMPLIFY`
**Calendar event name (suggested, follows existing `Probe:` prefix convention):**

> **`Probe: Q7 T+7 amplify — Buffer Twitter thread + LinkedIn (Δ=0 fallback)`**

## Event details (paste into Claude Desktop GCal connector)

| Field | Value |
|---|---|
| **Title** | `Probe: Q7 T+7 amplify — Buffer Twitter thread + LinkedIn (Δ=0 fallback)` |
| **Calendar** | Personal (or whichever holds the `Probe:` series) |
| **Date** | Tue **2026-05-19** |
| **Time** | 22:00 – 22:30 Asia/Taipei |
| **Duration** | 30 min |
| **Location** | (none) |
| **Notification** | 30 min before (22:30 → 22:00 alert) |
| **Visibility** | Private |

## Description (paste verbatim into the event Notes field)

```
Resume keyword: Q7-T7-AMPLIFY
Source: docs/citation-log.md § 2026-05-15 Δ-sweep (recorded Δ=0/4 cited)

GOAL — Fire the 7-day Δ=0 amplification on Tue 2026-05-19 if Δ-sweep on 2026-05-18 still shows 0/4 (re-check evening before).

WHY — Wk2 Q7 article shipped 2026-05-12 across 4 surfaces but no AI platform cited it within 3 days. Playbook calls for paid-attention amplification at T+7 before SEO/title pass at T+14.

DELIVERABLES (two surfaces, anchor on dev.to slug `4jn2`):

1. Twitter thread via Buffer
   - schedulingType=automatic (per memory feedback_buffer_twitter_automatic.md)
   - 4-tweet thread, source content: docs/blog/wk2-missing-description-impact.md
   - Anchor URL: https://dev.to/incultnitollc/what-does-a-missing-description-on-an-mcp-tool-actually-do-four-failure-modes-i-traced-from-real-4jn2
   - Channel: @incultnito Twitter (look up channelId via list_channels)
   - Reuse thread shape from prior Buffer post 6a03266b1f0cebfe371efe44 if templating helps

2. LinkedIn post (1 post, not thread)
   - Hook: "Four failure modes from missing MCP tool descriptions"
   - 3-bullet body summarizing failure modes 1-4 from the article
   - CTA: link to dev.to article (same `4jn2` slug)
   - Post manually OR schedule via Buffer if Buffer LinkedIn channel exists
   - Account: Peng Spirit's personal LinkedIn (incultnito@gmail.com)

NO Reddit (u/incultnito self-link rule still active — Reddit amplification waits for karma build).

PRE-FIRE CHECKLIST (run evening of Mon 2026-05-18):
- [ ] Re-run Q7 query on 4 LLMs (resume Q7-DELTA-SWEEP procedure)
- [ ] Append T+6 sweep to docs/citation-log.md
- [ ] If Δ ≥ 1 → amplification SKIPPED, log the win, archive this event
- [ ] If Δ = 0 → proceed with amplification on Tue 22:00

POST-FIRE (Tue 2026-05-19 22:30+):
- [ ] Log Buffer post ID + LinkedIn post URL to docs/community-presence-log.md
- [ ] Update memory project_launch.md with amplification fire date
- [ ] Arm T+14 fallback (Wed 2026-05-26) — resume keyword Q7-T14-SEO, action: SEO/title pass on dev.to + GitHub blog

IF AMPLIFICATION FIRES AND Δ STILL 0 BY T+14 (Wed 2026-05-26):
  → SEO/title pass on dev.to + GitHub blog (resume Q7-T14-SEO)
  → Consider: rewriting H1 to lead with "missing description" rather than "four failure modes"
  → Consider: adding TL;DR atop the article since most LLM crawlers weight the first 200 tokens
```

## Where this event lives in the playbook

```
2026-05-12 (Tue)   Wk2 Q7 article shipped to 4 surfaces                  [done]
2026-05-15 (Fri)   T+3 Δ-sweep: Δ=0/4 cited                              [done — commit 29c33a1]
2026-05-18 (Mon)   T+6 Δ-sweep re-check (evening of, before T+7 fire)    [arm via this event's pre-fire checklist]
2026-05-19 (Tue)   T+7 AMPLIFICATION FIRE  ← THIS EVENT                  [armed]
2026-05-26 (Tue)   T+14 SEO/title pass fallback (resume Q7-T14-SEO)      [conditional on T+7 still=0]
```

## Reason for separate event (vs reusing existing ones)

Pre-postponement `Probe:` calendar series (archived per `~/.claude/projects/.../memory/archive/project_gcal_prompt.md`) ended at the Mon 2026-05-05 "Probe: Launch retrospective" slot. The launch was postponed before that event fired, so the series is dormant. This is the **first new `Probe:` event since the postponement** and the playbook explicitly noted "Re-arm calendar around the trigger-hit week (likely Week 5 = ~2026-05-27 onwards)" — but the Δ=0 fallback at T+7 falls a week earlier. Hence: armed as a standalone event, not part of a re-armed series.

## After this event executes

Either:
1. **Amplification clears Δ** (Δ ≥ 1 by T+14 sweep): close `Q7-T7-AMPLIFY` chain. No further calendar action.
2. **Amplification fails to clear Δ** (Δ still 0 at T+14): create follow-up event for Wed 2026-05-26 using template `Probe: Q7 T+14 SEO/title pass (Δ=0 escalation)` — same paste structure, different deliverable.

---

**Status:** Event armed in docs only. Peng creates the actual GCal entry via Claude Desktop GCal connector (per `reference_gcal_connector_scope.md` — connector is Desktop-only, not available in this CLI session).
