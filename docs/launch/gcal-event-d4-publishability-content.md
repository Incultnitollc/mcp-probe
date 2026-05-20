# GCal event spec — Plan A D4 + Hashnode publish session

**Resume keyword:** `PUBLISHABILITY-D4`

This session has no Google Calendar MCP connector (per `reference_gcal_connector_scope.md`). Use the prompt below in **Claude Desktop**, which has the GCal connector, to arm the event.

---

## Paste-ready Claude Desktop prompt

```
Using Google Calendar connector, create ONE event on pengtawang@gmail.com calendar.

Event details:

Title: D4 PUBLISHABILITY-D4 — scorecards + canary + README + CHANGELOG + Hashnode publish

Date: Friday 2026-05-22

Start: 10:00 Asia/Taipei (UTC+8)

End: 12:00 Asia/Taipei (UTC+8)

Timezone: Asia/Taipei

Color: graphite (color id 8) — matches existing v1.1.0 series

Reminders: 1 popup 30 min before

Location: home laptop — repo "/Users/pengspirit/incultnito/Dev/Backend/repos/Month 1 and 2 - MCP Inspect"

Description (preserve formatting exactly):

Resume keyword: PUBLISHABILITY-D4

Plan A D4 (1.1.0 content + canary) + Plan B D3.3 web-UI publish.
Block: 2hr. Target HEAD after session: D4 commits pushed + Hashnode mirror live.

Agenda (paste-and-commit pattern — most boxes are <15 min):

1. [10:00–10:40] D4.1 — capture 5 publishability scorecards + SUMMARY.md
   - cd "/Users/pengspirit/incultnito/Dev/Backend/repos/Month 1 and 2 - MCP Inspect"
   - mkdir -p docs/publishability-scorecards
   - Run 5 score commands with --full (see project_launch.md D4 block for exact commands)
   - Write SUMMARY.md leading with the 60-floor headline finding (per amendments doc)
   - Commit "docs(publishability): 5 scorecards + SUMMARY with 60-floor finding (v1.1.0 D4.1)"

2. [10:40–10:55] D4.2 — weekly canary workflow
   - Create .github/workflows/publishability-self-check.yml (Mon 09:00 UTC cron, informational only, no --fail-under per amendments)
   - Commit "ci(publishability): weekly canary against server-everything (v1.1.0 D4.2)"

3. [10:55–11:20] D4.3 — README v1.1.0 section
   - Insert "## Publishability score (v1.1.0+)" after existing CLI section
   - Cross-link mcp-doctor (install-time security lane)
   - Link to docs/publishability-scorecards/SUMMARY.md for the 60-floor finding
   - Commit "docs(publishability): README v1.1.0 section + mcp-doctor cross-link (v1.1.0 D4.3)"

4. [11:20–11:30] D4.4 — CHANGELOG 1.1.0 entry
   - Prepend 1.1.0 block above existing action-v1.0.0 entry
   - Include "Findings" subsection with 60-floor pointer
   - Commit "docs(publishability): CHANGELOG 1.1.0 entry (v1.1.0 D4.4)"

5. [11:30–11:55] Plan B D3.3 — Hashnode publish (web UI)
   - Open docs/launch/wk2-hashnode-mirror-ci.md — payload already has Marketplace lede (commit f76897e)
   - Log into Hashnode under @incultnitollc handle
   - Verify docs/ci.md is HTTP 200 on main first (curl check is in the payload doc)
   - New post → paste title, subtitle, body, tags (5 exact), canonical URL (CRITICAL — set BEFORE publish), slug "mcp-server-ci-pipeline-github-actions"
   - Cover image: og-card-ci.png if generated, else fallback docs/assets/og-card.png
   - Publish → verify in incognito → log Hashnode URL to docs/citation-log.md under Wk2 Q6 CI distribution

6. [11:55–12:00] Push + close out
   - git push origin main (4 D4 commits + any citation-log update)
   - Update launch memory + MEMORY.md to mark D4 complete and surface D5 as next
   - Confirm 109+/109+ tests still green, tsc clean

Key references during the session:
- Plan: docs/superpowers/plans/2026-05-18-publishability-score-v1.1.0.md (D4 = lines ~2254–2493)
- Amendments doc (lead with this finding): docs/specs/publishability-score-v1.1.0-amendments.md
- Hashnode payload: docs/launch/wk2-hashnode-mirror-ci.md
- Resume state: memory/project_launch.md § ON RESUME — D3 SHIPPED

After D4 commits land, D5 (npm publish, Sat 2026-05-23) is the only remaining v1.1.0 block. D5 is separately scheduled.

If running over by 12:00: defer Hashnode publish to Sat morning before D5 npm publish — Hashnode is the only soft-deadline step in this block.
```

---

## What "PUBLISHABILITY-D4" resume keyword surfaces

When Peng types `PUBLISHABILITY-D4` on Fri 5/22 morning:

1. Open `memory/project_launch.md` → § ON RESUME — D3 SHIPPED (the new closeout section added 5/20 evening)
2. Surface the D4 agenda from the GCal event description
3. Run the verification one-liner first:
   ```bash
   cd "/Users/pengspirit/incultnito/Dev/Backend/repos/Month 1 and 2 - MCP Inspect"
   git pull origin main && npx tsc --noEmit && npx vitest run
   ```
4. Walk D4.1 → D4.2 → D4.3 → D4.4 → Plan B D3.3 in order
5. Push after each commit OR bundle as final push (Peng's call)

`PUBLISHABILITY-D4` is the only new keyword for this block. `PUBLISHABILITY-SCORE` (D4 + D5 umbrella) and `LAUNCH` (general resume) continue to work.

---

## Sanity checks before pasting the prompt

- [ ] Friday 2026-05-22 10:00 TPE has no conflicting event already (check current GCal)
- [ ] If conflict: shift to 14:00–16:00 TPE same day (afternoon teaching gap)
- [ ] Confirm `pengtawang@gmail.com` is the calendar the playbook events are on (matches D2/D5 prompts)
