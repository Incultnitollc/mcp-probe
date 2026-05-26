# Reddit cross-post — existing threads only, comment-only

**Rules locked-in:**
- NO top-post (per `feedback_community_engagement_anti_patterns.md` + this task brief)
- Comment from Peng's main account (NOT u/incultnito — per `feedback_reddit_velocity.md`)
- ≥10 min spacing from any other r/mcp activity on same account
- Probe install line appears at most once, near the bottom
- Lead with the data, not the tool
- If the comment leads with "I ran mcp-probe", rewrite it

## Thread shortlist (ranked, recon'd 2026-05-26 from r/mcp/new)

| # | Thread | Fit | Why | Risk |
|---|---|---|---|---|
| 1 | [How thin are you keeping your MCP servers?](https://reddit.com/r/mcp/comments/1to5c9c/how_thin_are_you_keeping_your_mcp_servers/) (5c, 2↑, today) | **Strong** | OP asks about MCP server design tradeoffs; description density is a sub-question of "what should the server surface look like". Low engagement = comment more visible. | Slight angle stretch — thread asks logic-density, we answer description-density. Bridge clean in opening line. |
| 2 | [Reducing Context Window Efficiently in MCP](https://reddit.com/r/mcp/comments/1tle6gl/reducing_context_window_efficiently_in_mcp_heres/) (30c, 146↑) | **Strong** | Description density ties directly to context efficiency — better descriptions let the planner pick faster, reducing tool-call churn. High-traffic, but mature, harder to surface a late comment. | Late entry. Reply already crowded. |
| 3 | [Why do you use MCP for internal APIs?](https://reddit.com/r/mcp/comments/1tl7njo/why_do_you_use_mcp_for_internal_apis/) (80c, 25↑) | Medium | Broad MCP design discussion. Could mention "if you're wrapping an internal API, here's the schema-description bar Anthropic ships at". | Tangential — could read as drive-by. |
| 4 | [The architecture we landed on for putting a large typed API behind an MCP server](https://reddit.com/r/mcp/comments/1tkxsic/the_architecture_we_landed_on_for_putting_a_large/) (7c, 19↑) | Medium | Typed-API → schema descriptions are an obvious extension. Author probably cares. | Author may take it personally if posted under their post — be deferential. |

**Recommendation: post to thread #1 first.** Smallest existing comment pool, freshest, on-topic. If it lands clean, post to thread #2 ≥4 hours later with a different angle (context efficiency, not description density).

---

## Reply template — for thread #1 ("How thin are you keeping your MCP servers?")

```
Adjacent answer — not about logic-density (which is what you're asking)
but about description-density on the schema side, which keeps coming up
when I score servers.

Just ran a 5-axis publishability check against all 6 MCP servers
shipped under the @modelcontextprotocol scope. Every single one hits
the same 56–60/100 composite ceiling, and the cap fires from the same
axis: description-five-axis (per-tool descriptions don't cover purpose,
mutation, side-effects, invariants, examples).

    Server                              Composite   Per-tool axis avg
    ---------------------------------   ---------   -----------------
    server-sequential-thinking             60        n/a (single tool)
    server-memory                          60        1.00 / 5
    server-everything                      60        0.55 / 5
    server-filesystem                      60        0.88 / 5
    server-github (legacy)                 60        0.44 / 5
    server-puppeteer (deprecated)          56        0.17 / 5    ← new

puppeteer_navigate, for example, is described as "Navigate to a URL."
That's purpose. No mutation signal (it changes page state), no side-
effects (can hit any URL — high-blast), no invariants (new tab? same
tab? unclear), no examples. A planner LLM has nothing to pattern-match
on.

Whether your server is thin (pure adapter) or thick (workflow inside),
the bar for how the schema reads is the same. Thin doesn't get you off
the hook for description quality — if anything, it raises the bar
because the LLM has fewer behavioural cues elsewhere.

Full 6-server scorecard:
github.com/Incultnitollc/mcp-probe/blob/main/docs/publishability-scorecards/SUMMARY.md
```

## Reply template — for thread #2 ("Reducing Context Window Efficiently in MCP")

```
One angle that's underweighted in context-efficiency conversations:
schema-description density. If a planner has to call a tool, fail,
re-read the description, retry with new args, that's 2–3 extra
round-trips per tool call. Better descriptions cut that to 1.

Concrete data: the 6 official @modelcontextprotocol servers all score
56–60/100 on a per-tool axis check (purpose, mutation, side-effects,
invariants, examples). Per-tool averages: memory 1.00/5, everything
0.55/5, filesystem 0.88/5, github 0.44/5, puppeteer 0.17/5.

The token cost of a thin description compounds with every retry. The
math gets ugly fast at 100+ tools.

If anyone wants to see the full breakdown:
github.com/Incultnitollc/mcp-probe/blob/main/docs/publishability-scorecards/SUMMARY.md
```

## Anti-pattern self-check

Before posting, verify against `feedback_community_engagement_anti_patterns.md`:

- [ ] Comment leads with data/finding, not "I built X"
- [ ] Probe name appears at most twice in the comment
- [ ] No npm install line in the comment body (only the repo link)
- [ ] No DM offer, no @mentions
- [ ] Not posted from u/incultnito (use main account)
- [ ] ≥10 min spacing from any other r/mcp activity
- [ ] If comment is a top-level reply to OP, OK; if reply to another commenter, OK; do NOT start a new top-post

## After posting

- Note the comment permalink in `docs/citation-log.md` under WK5
- Reply to every reply within 1 hour for the first 4 hours
- If automod removes the comment, do NOT repost same day; wait 24 hr + check sub rules
