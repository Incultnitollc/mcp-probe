---
venue: gh-issue
thread_url: https://github.com/anthropics/claude-code/issues/63451
thread_title: "[Bug] Claude Opus 4.8 ignores MCP tool definitions, hallucinates parameters"
op_question: "OP reports Opus 4.8 consistently ignores MCP tool schemas, guesses plausible param names, then loops blaming the tools/harness — a clear regression from 4.7."
state_check: "OPEN, not locked, verified 2026-05-29 21:15 TPE"
template: none (diagnostic, no probe pitch)
probe_mention: N
ratio_note: "probe-free by design — this is a model-regression report, not a schema-quality question; leading with 'your schemas are weak' would be victim-blaming. Keeps batch ratio at 1/2 = 50%."
---

The 4.7 → 4.8 delta is the load-bearing detail here — if the same server + same config behaved on 4.7 and regresses on 4.8, that's a model-side change, and no amount of schema-tightening makes that *not* a regression worth reporting. So this is a real bug report, not a config problem.

That said, there's a useful isolation step that tells you whether you're looking at a pure model regression or a model regression *amplified* by a fragile schema — because the fix path is different for each:

1. **Find one tool that's failing and check whether every parameter has a non-empty `description`.** Tools with fully-described params tend to survive model changes; tools relying on the param *name* alone to convey meaning are the first to break when selection behavior shifts, because the model has nothing but the name to anchor on. If the failing tools are disproportionately the thinly-described ones, you've found the amplifier (still a regression — just one with a workaround while the model side gets fixed).

2. **Check whether it's selection or invocation.** "Ignores the definition" and "hallucinates parameters" are two different failures: the first is the model not picking the tool, the second is picking it but inventing args. The debugging-loop-blaming-the-harness symptom usually means invocation — it called the tool, got a schema-validation error back, and didn't reconcile. Worth saying which one you're seeing in the report, because they point at different parts of the model's tool-use path.

3. **Capture the negotiated protocol version**, not just the advertised one — a server can downgrade at handshake, and a version skew that 4.7 tolerated and 4.8 doesn't would look exactly like "ignores the definition."

None of that diminishes the report — if it's a clean regression on identical inputs, the model-side trace is what matters and the feedback ID is the right artifact. The isolation just helps separate "4.8 got stricter and surfaced a latent schema weakness" from "4.8 regressed on well-formed schemas," which are different fixes on Anthropic's side.
