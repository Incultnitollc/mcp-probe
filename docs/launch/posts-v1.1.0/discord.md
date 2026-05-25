# Discord (MCP community) — v1.1.0 publishability score (paste-ready)

**Where:** MCP community Discord — `#showcase` or `#community-projects`, whichever the server designates. Check pinned rules before posting.
**When:** Launch day, AM PT — FIRST surface to post in, before HN and Reddit.
**DO NOT:**
- Cross-post to multiple channels. Post once.
- @ anyone (no Anthropic staff, no mods, no maintainers).
- DM Anthropic staff or maintainers asking for boosts.
- Offer DMs in the post body.
- Lead with "I built X" — share the finding first.
- Use emoji. The MCP community Discord is technical; keep the post flat.
- Post in `#general` or `#help` — wrong rooms.

## Message

```
Quick data point from a publishability check I ran today against the
five servers shipped under the official @modelcontextprotocol/ scope.
All five score 60/100 composite on a 5-axis rubric, and the cap fires
on the same axis every time — schema descriptions too thin on per-tool
axis density (purpose, mutation, side-effects, invariants, examples).

    server-sequential-thinking  60   protocol 100  edge 100
    server-memory               60   protocol 100  edge  85
    server-everything           60   protocol 100  edge  94
    server-filesystem           60   protocol 100  edge  57
    server-github (legacy)      60   protocol 100  edge  26

Protocol is 100 across the board. The wire format is right. The
40-point gap is entirely how the schemas read — 63 of 63 tools across
the five servers land below 3.0/5 on axis density. Every multi-tool
server with mutating tools also misses anti-purpose-clause (no "do
not use for X, prefer Y" on delete/send/transfer style tools).

Reading this as a useful baseline, not a bug: it's the bar the
reference servers ship at, which means it's the bar most third-party
servers will start from too.

The rubric ships in v1.1.0 of a CLI I've been working on
(@incultnitollc/mcp-probe). It's the pre-publish quality lane —
distinct from @modelcontextprotocol/conformance (spec compliance) and
@stephenywilson/mcp-doctor (install-time security). Three peer tools,
different audiences.

Scorecards + per-axis breakdown:
github.com/Incultnitollc/mcp-probe/blob/main/docs/publishability-scorecards/SUMMARY.md

Open to "you're scoring this wrong" feedback on the axis weights or
the 3.0 cutoff.
```

## Follow-up reply patterns

**Pattern 1 — someone asks how to run it on their own server**

Reply in-thread (not DM):

```
mcp-probe score "<your-server-command>" --full --package ./package.json

Pastes a per-axis breakdown — which axis fires the cap, per-tool
density average, and the protocol + edge-case sub-scores alongside.
Drop the output back here and I'll read it with you.
```

**Pattern 2 — someone pushes back on the rubric ("isn't a 60 floor just bad calibration")**

Reply in-thread, acknowledge first:

```
Fair pushback — that was my first read too. Two things made me keep it:

1. Protocol = 100 and edge-case spans 26–100 across the five. If the
   rubric were uniformly hard, the sub-scores would spread. They
   don't.
2. The cap fires on the same axis every time (description-five-axis),
   and the per-tool density averages are 0.44–1.00/5. The descriptions
   aren't borderline; they're documenting one axis and leaving four
   empty.

Spec + amendments doc explains the 3.0 cutoff and where I expect
re-calibration in v1.2:
github.com/Incultnitollc/mcp-probe/blob/main/docs/specs/publishability-score-v1.1.0-amendments.md
```

## Post-posting

- Reply to every response for 48 hours.
- If a server maintainer asks for a score, run it and paste the scorecard in the same thread.
- No follow-up posts in other channels for at least 7 days.
- If a mod flags the post, accept the call — do not re-post.
