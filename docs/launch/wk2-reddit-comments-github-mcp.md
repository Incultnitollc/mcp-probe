# Wk2 Reddit cadence — GitHub MCP scorecard cross-posts

Drafted: 2026-05-12 (Tue)
Anchor URL: https://github.com/Incultnitollc/mcp-probe/discussions/11
Rule: COMMENTS ONLY. Never top-post. Min 10 min between submissions. Use u/incultnito only after karma builds — for now, prefer u/incultnitollc or another seasoned account.

---

## 1. r/mcp — "Every MCP server you add makes your agent slightly dumber"

- Thread: https://www.reddit.com/r/mcp/comments/1ta6wee/every_mcp_server_you_add_makes_your_agent/
- Score: 0 · Comments: 7 · Age: 0d (very fresh)
- Why on-topic: OP frames tools/list bloat as the core MCP cost; our 51 schema warnings = literal token-tax evidence.

**Draft comment:**

> The context-bloat framing tracks with what we just measured. We ran a tool-level scorecard against @modelcontextprotocol/server-github (the legacy Node reference server most people still pull from npm) and got 3/26 tools callable end-to-end and 51 schema warnings across the surface — the warnings are exactly the stuff that turns into per-tool tax in every tools/list call. Worth noting Anthropic has quietly moved the canonical implementation to the Go-based github/github-mcp-server, so a lot of pain people blame on "MCP scaling" is actually a legacy-server-with-bad-schemas problem stacking on top of the surface-area problem. Full breakdown of which tools fail and why: https://github.com/Incultnitollc/mcp-probe/discussions/11

---

## 2. r/mcp — "outputSchema in MCP: useful feature or token tax with no payoff?"

- Thread: https://www.reddit.com/r/mcp/comments/1tauwhg/outputschema_in_mcp_useful_feature_or_token_tax/
- Score: 0 · Comments: 5 · Age: 0d
- Why on-topic: schema-design debate — we contribute a real-server data point (inputSchema hygiene comes first).

**Draft comment:**

> Your 3-5x ratio matches what we're seeing on real servers. We just scored the legacy @modelcontextprotocol/server-github reference server tool-by-tool — 3/26 tools were callable end-to-end and 51 schema warnings showed up across inputs alone, before outputSchema even enters the picture. Most of those warnings were missing/inconsistent descriptions and over-loose union types, which is exactly the failure mode that gets worse when you bolt outputSchema on top of an already-noisy tools/list. Real answer is probably: fix inputSchema hygiene first, then opt-in outputSchema per-tool where the structured result is actually consumed. Anthropic's newer Go server (github/github-mcp-server) takes that approach. Per-tool data: https://github.com/Incultnitollc/mcp-probe/discussions/11

---

## 3. r/LocalLLaMA — "Getting lost in a crazy jungle of decentralized skills…"

- Thread: https://www.reddit.com/r/LocalLLaMA/comments/1ta3jy9/getting_lost_in_a_crazy_jungle_of_decentralized/
- Score: 0 · Comments: 22 · Age: 0d
- Why on-topic: OP explicitly plans to wire a private GitHub repo via MCP — legacy-vs-Go warning saves them time.

**Draft comment:**

> Quick heads-up before you wire it to GitHub via MCP — there are two GitHub servers in the wild and the docs don't make it obvious. The legacy one is @modelcontextprotocol/server-github (Node, on npm, what most tutorials still link to). The newer canonical one is github/github-mcp-server (Go, maintained by GitHub directly). We just ran a tool-level scorecard on the legacy Node server: 3/26 tools callable end-to-end and 51 schema warnings, which is why a lot of "my GitHub MCP just hangs" reports trace back to it. If you're starting fresh and want llama.cpp / LM Studio / Codex to all hit the same repo, start with the Go server. Per-tool failure breakdown: https://github.com/Incultnitollc/mcp-probe/discussions/11

---

## Posting checklist

- [ ] r/mcp #1 — post comment, capture permalink + UTC
- [ ] Wait ≥10 min
- [ ] r/mcp #2 — post comment, capture permalink + UTC
- [ ] Wait ≥10 min (different sub, lower automod risk)
- [ ] r/LocalLLaMA #3 — post comment, capture permalink + UTC
- [ ] Update `docs/community-presence-log.md` with replies + permalinks
- [ ] If any comment gets removed → record reason, do not re-post in same sub for 24h
