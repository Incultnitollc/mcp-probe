---
purpose: Cross-link the mcp-probe "MCP Server Clinic" (Discussion #13) from the official MCP org repo
target_repo: modelcontextprotocol/modelcontextprotocol
target_surface: Discussions
suggested_category: "Show and tell" (offering a community scan resource — not a question)
alt_category: "Q&A - Server implementation" (only if a pre-publish/validation question thread is the better host)
fire_mode: MANUAL — Peng pastes. Outward-facing post to the official MCP org repo; not auto-fired.
framing: ASYNC (matches Discussion #13's 2026-05-22 reframe — "no fixed window, batched by hand, usually within 24h"). DOES NOT use the original "21:00–21:45 live, reply within 5 min" framing, which contradicts #13.
state_check: "mcp-probe Discussion #13 verified OPEN + pinned, 0 comments, 2026-05-29 21:15 TPE"
anti_pattern_check: "No 'I built X' framing · no DM/Discord redirect · GitHub Discussions is the canonical user-support venue per MCP community comms policy (Discord is explicitly off-limits)"
---

## Title (if posting as a new Show-and-tell thread)

MCP Server Clinic — paste your launch command, get a publishability scorecard back (async)

## Body

There's a standing async clinic thread over on the mcp-probe repo for anyone who wants a second pair of eyes on their server's schema quality before (or after) they publish:

https://github.com/Incultnitollc/mcp-probe/discussions/13

How it works: drop a comment with the exact launch command you'd ship —

```
npx @incultnitollc/mcp-probe test "<your-server-launch-command>"
```

— local stdio, remote HTTP, SSE all fine, `--header` auth fine — and you get a scorecard back: tools callable vs listed, resources/prompts, schema warnings (missing descriptions, malformed types, prose-only enums), and a 0–100 publishability composite with a five-axis breakdown. Responses are batched by hand, usually within 24h — no fixed window, no DMs, no Discord.

Calibration anchor so the number means something: the official Anthropic servers (server-everything, server-filesystem, server-memory, server-sequential-thinking, server-github) all land at exactly 60/100 under the current scoring — the description-quality cap fires on every one. Full scorecards are in the repo. It's complementary to the MCP Inspector (Inspector for interactive protocol exploration; this for batch schema-quality gating).

Heads-up rule for third-party servers: anything negative gets a 72-hour heads-up to the maintainer before any public issue.

---

### Posting checklist (Peng, manual)

1. `gh issue view`-equivalent not needed — this is a Discussion. Open https://github.com/modelcontextprotocol/modelcontextprotocol/discussions
2. Confirm "Show and tell" category is open for new posts (fall back to a relevant Q&A thread reply if Show-and-tell is restricted).
3. Paste title + body above. Do NOT add a live-window time — keep it async.
4. After posting, log the Discussion URL to `docs/citation-log.md` under the Wk5 daily-presence block.
