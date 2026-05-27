---
venue: reddit-r-mcp
thread_url: https://reddit.com/r/mcp/comments/1tmwzoj/how_can_i_improve_the_use_of_tools/
thread_title: How can i improve the use of tools?
op_summary: OP's FastMCP server has a calculator with +/-/*/÷ tools; LLM tries the wrong tool first before landing on the right one — asks how to improve selection.
comments_at_find: 7
flair: question
state_check: OPEN, not locked, not archived, no accepted answer — verified 2026-05-27 09:35 TPE
template: R2
probe_mention: Y
---

The earlier replies are right that this is a tool-description problem, not a model problem — adding the two pieces the existing answers haven't explicitly named:

**1. Anti-purpose.** Each description should say what the tool is for *and* what it isn't. Right now "divide two numbers" and "subtract two numbers" both match the verb-noun pattern, so the model has nothing structural to rule one out against the other when the user phrasing is ambiguous ("take 4 from 2", "split 4 by 2"). One extra clause — `"Use only for division. For subtraction, use \`subtract\`."` — gives the model a negative signal it can act on. That's usually the single biggest delta on small tool sets where the surface area overlaps.

**2. Parameter descriptions, not just tool descriptions.** Every parameter on every tool needs its own description, even on something as small as a calculator. `dividend` and `divisor` with no `description` field is read by the model as "I don't know what to put here" and it'll often skip the tool entirely rather than guess — which looks externally like "tried other tools first". Same goes for `a` and `b` as parameter names: rename to the role they play (`numerator`, `denominator`) and describe them, and selection stabilizes a lot.

Two things that complement the above for spotting these systematically:

- Anthropic's MCP Inspector (`npx @modelcontextprotocol/inspector`) — interactive, click-through, good for actually running calls and watching argument shape during dev.
- If you want a one-shot scorecard across the whole server flagging missing-description params and weak tool descriptions in CI, `npx @incultnitollc/mcp-probe test "<your fastmcp launch command>"` does that — surfaces #2 above directly. Different tools, different stages; both worth in the loop.

Once descriptions are tightened, the "tries other tools first" behavior usually disappears even on small models.
