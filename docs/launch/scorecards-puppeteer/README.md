# Puppeteer scorecard drop — distribution kit

**Scored:** 2026-05-26 (TPE) · mcp-probe `@incultnitollc/mcp-probe@1.1.0` · raw output `docs/publishability-scorecards/server-puppeteer.txt`

**Headline:** `@modelcontextprotocol/server-puppeteer` (deprecated) scores **56/100**. Joins the 6-server cluster at 56–60/100 under v1.1.0 rubric — same `description-five-axis` cap fires on every official server.

## Why Puppeteer instead of Postgres (this week's pivot)

Task priority order was Postgres → GitHub MCP → Slack → Filesystem → Puppeteer → Brave. Postgres skipped because `@modelcontextprotocol/server-postgres@0.6.2` fails on `resources/list` without a live DB connection, and Docker isn't running locally. Filesystem already scored in v1.1.0 baseline. Puppeteer is the next un-scored server that runs without external infra.

**Follow-up:** Postgres scorecard is blocked on either (a) Docker + a throwaway Postgres or (b) mcp-probe v1.1.1 patch to gracefully degrade `resources/list` failure. Latter is the right long-term fix; tracked as a probe-issue candidate.

## Files

| File | Purpose | Status |
|---|---|---|
| `gh-discussion.md` | Show-and-tell post body, paste-ready with `gh api` invocation | **draft — ready to fire** |
| `twitter-thread.md` | 4-tweet thread, Buffer-schedulable (automatic mode) | **draft — ready to schedule** |
| `reddit-cross-post.md` | Comment templates + thread shortlist (existing threads only, no top-post) | **draft — needs Peng to pick thread #1 vs #2** |
| `blog-devto.md` | dev.to long-form companion, manual paste workflow | **draft — optional this week** |

## Recommended sequence (if all-green)

| Step | Surface | Time gate | Action |
|---|---|---|---|
| 1 | GH Discussion | Now | Fire `gh-discussion.md` body to `Incultnitollc/mcp-probe/discussions` (cat `show-and-tell`) |
| 2 | Reddit thread #1 | T+15min | Paste thread-#1 reply template into "How thin are you keeping your MCP servers?" |
| 3 | Twitter thread | T+1hr or next Buffer slot | Queue 4-tweet thread on Buffer (automatic) |
| 4 | dev.to | T+24hr or skip | Manual paste at dev.to/new; or defer to combined Wk5 post |
| 5 | citation-log | After each surface | Add URL + timestamp under WK5 entry |

## Anti-pattern guards (load-bearing — re-read before posting)

- `feedback_community_engagement_anti_patterns.md` — no "I built X", no DM offers, ≤50% probe-mentions
- `feedback_reddit_velocity.md` — no self-links from u/incultnito, ≥10 min spacing, use main account
- `feedback_buffer_twitter_automatic.md` — Twitter channel must be `automatic`, not `notification`
- `feedback_devto_rate_limit.md` — manual paste only, no API
- `feedback_manual_fire_external_posts.md` — manual run, not launchd auto-fire, for external surfaces
