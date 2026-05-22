# GCal — delete clinic event (Fri 2026-05-22 21:00–21:45 TPE)

Event was created earlier today on `pengtawang@gmail.com`. Clinic re-dispositioned as truly async — no live window. Delete the event so it doesn't trigger a 20:45 notification or sit on the calendar as a stale promise.

## Paste-ready Claude Desktop prompt

Open Claude Desktop with the GCal connector active on `pengtawang@gmail.com`:

```
Delete this event from my primary calendar (account: pengtawang@gmail.com).

EVENT TO DELETE:
- Title: Probe Clinic — async scorecard window (MCP Server Clinic)
- Date: Friday 2026-05-22
- Time: 21:00 – 21:45 Asia/Taipei
- Account: pengtawang@gmail.com

If multiple events match this title, list them all and ask me which to delete — do not guess.

Confirm deletion + return the event ID that was removed.
```

## Why deleted

- Peng cannot be at laptop during the announced window — no way to staff live replies.
- Both discussion threads (#13 own repo, #2768 MCP main) were edited to strip "tonight 21:00–21:45" framing and reframe as async (replies batched by hand within ~24h).
- Local cron job `ba3c3e38` was cancelled.
- Retain the discussions; retire the live-window event.
