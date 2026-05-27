# r/mcp hunt log — wk4 presence 2026-05-27

**Run time:** 2026-05-27 09:35 TPE (01:35 UTC)
**Method:** curl r/mcp `new.json?limit=25` + `top.json?t=week&limit=25` + keyword search.json for `tool description`, `schema validation`, `before publishing`. Filtered to 3-18 comments, not locked/archived, not showcase/"I built".

## Final picks

| Thread | Comments | Template | Probe? | Notes |
|---|---|---|---|---|
| [1tmwzoj — How can i improve the use of tools?](https://reddit.com/r/mcp/comments/1tmwzoj/) | 7 | R2 | Y | FastMCP calculator, OP describes wrong-tool-first behavior. Direct match for R2. Existing replies converging on "tool descriptions" — my angle adds anti-purpose + parameter descriptions, two pieces no one else named explicitly. Probe mention near end as one of two diagnostic options (alongside Inspector). |

## Considered + skipped

- **1too0cl** "Can i make a mcp tool use other tool?" — 1c, too thin / from same OP as 1tmwzoj, OP is asking about tool chaining not schema quality. Skip.
- **1to5c9c** "How thin are you keeping your MCP servers?" — 23c, architecture/design discussion (thin adapter vs fat workflow). Conversation is healthy and on-topic, but NOT a schema-quality question — probe wouldn't materially answer the OP's question, and a reply here without a probe mention would be fine but doesn't move the dial. Skip for cadence efficiency.
- **1to9ka8** "What are the best ways to distribute your MCP?" — 2c, distribution channel question. Off-template (Q7 territory, not R1/R2). Skip.
- **1tjyv5b** "How are you handling auth and security on MCP servers in production?" — 33c, security/auth lane. Per `decision_security_suite_before_show_hn.md`, `@stephenywilson/mcp-doctor` owns install-time security. Probe doesn't fit; skip.
- **1tle6gl** "Reducing Context Window Efficiently in MCP" — 31c, context-bloat topic. Tangential to schema quality, probe-mention would feel shoehorned. Skip.
- **1tauwhg** "outputSchema in MCP: useful feature or token tax" — 7c, but opinion-soliciting OP-led design discussion, 15 days old. Not a question probe answers. Skip.
- **1tnb6x4** "Just set up Fast HTML MCP in 5 minutes" — 2c, too thin and showcase-adjacent.
- **1ta6wee** "Every MCP server you add makes your agent slightly dumber" — 8c, older (~15 days), and aligns with already-fired q7/t7 amplify thread on context bloat. Skip duplicate angle.

## Why only 1 candidate, not 2

The r/mcp newest feed this week is heavy on showcase / "I built X" posts (server announcements, connectors). Question-flair posts that match R1/R2 keyword triggers cleanly are sparse. 1tmwzoj is the one clean R2 hit; second-best (1to5c9c) is design discussion, not schema quality — a probe mention there would push the probe-mention ratio above 50% for the week with no honest reason. Better to ship one strong draft than dilute the cadence.

**Probe-mention ratio:** 1/1 this draft (100% local, but 1 reply only; weekly tally will incorporate GitHub-venue replies which trend lower probe-mention).
