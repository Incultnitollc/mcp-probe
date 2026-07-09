---
venue: gh-discussion
thread_url: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2812
thread_title: "MCP spec should address tool schema token overhead (~1000 tokens/tool consumed per session)"
op_question: "@luwei-will measured 11 production tools at 100-1024 tokens each; 10x delta is entirely JSON Schema size (param descriptions, nested objects). Proposes protocol-level mitigations to cut the overhead."
state_check: "OPEN, not locked, verified 2026-05-29 21:15 TPE"
template: D2 (adapted)
probe_mention: Y
ratio_note: "1/2 probe-mentioned this batch — at ≤50% rule ceiling; #63451 is probe-free to recalibrate from Wk5 D2's 67%"
---

The 10× delta being entirely in schema size is the right diagnosis, but the mitigation framing worth pinning down first is: **not all of those tokens are equal, and "strip the schema" optimizes the wrong variable.** The token cost and the tool-selection-reliability are in direct tension, and the two failure modes have very different blast radii — a bloated schema costs you context window (recoverable, amortized by prompt caching), but an under-described schema costs you wrong-tool-selection and hallucinated parameters (a silent correctness failure that shows up as "the agent went into a debugging loop blaming the harness").

So the question isn't "how do we cut tokens" — it's "which tokens earn their place." Sorting your own measured data by tokens-per-unit-of-disambiguation rather than raw tokens:

- **High legibility-per-token (keep):** anti-purpose clauses ("not for X"), enum constraints on finite-value string params, the one verb+scope sentence. These are cheap and they're exactly what stops the model guessing.
- **Low legibility-per-token (candidate to trim):** restating the type in prose ("a string representing the name"), nested object descriptions that duplicate the field names, example blocks longer than the description itself.

`ctx_batch_execute` at 1,024 tokens is almost certainly carrying both kinds — the `commands: array of {label, command}` nesting is where the prose tends to duplicate structure the schema already encodes.

On the protocol-level proposals: a lazy/on-demand schema fetch (send names + one-liners up front, full schema on first call) is the most promising of the three because it preserves legibility at call time while cutting the up-front tax — but it shifts the wrong-tool-selection risk earlier (the model picks from one-liners), so the one-liner quality becomes load-bearing in a way it isn't today.

If it's useful to quantify the "which descriptions earn their tokens" split rather than eyeball it: Anthropic's `/v1/messages/count_tokens` (which you're already using) gives you the cost side. For the legibility side, `npx @incultnitollc/mcp-probe test "<launch command>"` scores each tool on a five-axis breakdown (description quality, enum-shape, anti-purpose presence, mutation-legibility, distribution-metadata) — cross-referencing the two tells you which high-token tools are paying for legibility vs paying for prose bloat. Different measurement than Inspector's interactive view; this one's batch over the live launch command so it catches the runtime-config-dependent schemas too.
