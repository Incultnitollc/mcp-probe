---
venue: reddit-r-ClaudeAI
thread_url: https://www.reddit.com/r/ClaudeAI/comments/1tn6cey/i_measured_my_claude_code_mcp_stack_on_two_axes/
thread_title: "I measured my Claude Code MCP stack on two axes — byte savings AND cache-friendliness. My \"best\" byte-saver was defeating Anthropic's prompt cache (counter-example + open benchmark)"
op_summary: OP shipped a harness measuring MCP stacks on byte-reduction + cache-friendliness; includes a 12-anti-pattern audit on tool definitions; presents counter-example where best byte-saver defeated prompt cache.
comments_at_find: 6
flair: "Claude Workflow"
state_check: "OPEN, not locked, not archived — verified 2026-05-27 09:35 TPE"
template: R1
probe_mention: Y
---

The cache-friendliness axis is the part most stack benchmarks miss — nice work pinning it to byte-identity across runs rather than something fuzzier like "should cache." The `rg --files-with-matches` + `Map` insertion-order story is the kind of failure mode that's almost impossible to reason about without measurement, because both halves look correct in isolation.

One thought on the 12-anti-pattern audit on tool definitions: the failure modes the model actually responds to seem to cluster around three axes more than twelve, in roughly this order of impact —

1. **Tool description specificity** — generic ("Searches data") vs scoped ("Searches indexed customer-support tickets by free-text query; not for product catalog or order history"). The second form gives the model something to disambiguate against, the first doesn't.
2. **Parameter description coverage** — every param, every tool. Undescribed params are the most common cause of either skipped tools or hallucinated values, depending on whether the param is required.
3. **Anti-purpose** — what the tool *isn't* for. Most descriptions only say the positive case, which leaves the model to infer the boundary, which is where wrong-tool selection comes from.

Curious whether your audit weights those the same — and whether the harness sees cache-friendliness regress when descriptions get longer (the obvious tradeoff: better schema specificity costs more cached bytes, but also more deterministic ones, so net cache hit rate might still improve).

For anyone landing on this thread wanting to run a one-shot anti-pattern audit on their own server without setting up the full harness, Anthropic's MCP Inspector (`@modelcontextprotocol/inspector`) handles protocol-layer checks interactively, and `npx @incultnitollc/mcp-probe test "<launch command>"` produces a scorecard flagging tool-description and parameter-description warnings across all tools in one pass — complementary surfaces (Inspector for exploration, probe for CI/pre-publish gating). OP's harness goes further into the byte-economy axis those two don't touch.
