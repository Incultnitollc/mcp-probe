# GCal event — MCP Server Clinic (Fri 2026-05-22 21:00–21:45 TPE)

**Created (spec):** 2026-05-22 ~15:00 TPE
**Resume keyword:** `CLINIC-2026-05-22`
**Account:** `pengtawang@gmail.com` (NOT `incultnito@gmail.com` — per `reference_gcal_account.md`)

## Paste-ready Claude Desktop prompt

Open Claude Desktop with the GCal connector enabled. Confirm the active Google account is `pengtawang@gmail.com` before pasting:

```
Create one Google Calendar event on my primary calendar in Asia/Taipei.

Use the calendar associated with pengtawang@gmail.com (NOT incultnito@gmail.com). If only incultnito is connected, stop and tell me to switch accounts.

EVENT
- Title: Probe Clinic — async scorecard window (MCP Server Clinic)
- Date: Friday 2026-05-22
- Time: 21:00 – 21:45 Asia/Taipei (45 min)
- Visibility: Private
- Notification: 15 min before
- Description: [paste the DESCRIPTION block below verbatim]

Confirm the event ID after creation.
```

## DESCRIPTION (paste into the Notes field)

```
Async clinic — drop a launch command, get a scorecard.

Own-repo thread (where commenters post their `npx @incultnitollc/mcp-probe test "..."` invocations):
  https://github.com/Incultnitollc/mcp-probe/discussions/13

MCP main-repo cross-link (Q&A — Server implementation):
  https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2768

WINDOW: 21:00–21:45 Asia/Taipei (13:00–13:45 UTC).

PROCEDURE:
- Reply within 5 min to every new comment with a scorecard.
- Use the EXACT mcp-probe test command they pasted; do NOT modify it.
- If their command fails to launch, ask ONE clarifying question — do not guess.
- Promote any non-trivial finding into a follow-up Discussion or an Issue on the
  relevant server repo (72h heads-up rule applies for negative findings).

ANTI-PATTERNS:
- No "I built X" framing — frame replies as "scorecard from mcp-probe".
- No DMs, no Discord redirects.
- Do NOT post in the MCP Contributor Discord under any circumstance.

PRE-FLIGHT (do before 21:00 TPE):
- [ ] Confirm Discussion #13 is pinned in Incultnitollc/mcp-probe (manual — pin
      button in repo UI; GraphQL mutation is unavailable).
- [ ] Smoke-check: `node dist/cli.js score "npx -y @modelcontextprotocol/server-everything" --full`
      returns 60/100 (baseline anchor for replies).
- [ ] Make sure v1.1.0 is on npm (D5 publish should happen before clinic window).

POST-CLINIC:
- Log each reply (commenter handle, command, score, action taken) into
  docs/community-presence-log.md under 2026-05-22.
- If any commenter agreed to a follow-on issue on their server repo, surface
  that in the launch memory as a new touchpoint.
```

## Why this slot

- Public, async, lower-stakes than a live call.
- 45 min fits a single replied-to-everyone batch without dragging into evening.
- Far enough after D5 npm publish (~15:00 TPE if shipping today) that v1.1.0 will be live by clinic time.
- Teacher hours done by 22:00, so 21:00 start is inside the teaching-day boundary but comfortable.
