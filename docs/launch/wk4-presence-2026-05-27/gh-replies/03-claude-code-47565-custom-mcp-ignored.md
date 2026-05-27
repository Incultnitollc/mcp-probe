---
venue: gh-issue
thread_url: https://github.com/anthropics/claude-code/issues/47565
thread_title: "[MODEL] MCP tool use regression — model ignores custom MCP tools despite explicit CLAUDE.md rules and enforcement hooks"
op_question: "Custom Metis MCP server with 42 memory tools — model ignores them despite CLAUDE.md instructions and SessionEnd hook enforcement; behavior changed mid-March 2026"
state_check: "OPEN, not locked, verified 2026-05-27 09:45 TPE (state=open, locked=false, comments=5)"
template: D1
probe_mention: N
ratio_note: "2/4 probe-mentioned so far — this one intentionally probe-free to recalibrate ratio"
---

There are two separable things in this report and conflating them makes the regression theory harder to test: (1) why a specific tool isn't selected on a turn, and (2) why CLAUDE.md instructions about *when* to call tools get under-followed.

(1) is overwhelmingly a schema-discriminability problem in practice, even when the OP knows the schemas. (2) is an instruction-following question that's mostly orthogonal to the tools — CLAUDE.md telling the model to call X is a separate decision surface from the model evaluating whether X is the right tool for the current turn.

For the tool-selection side, the diagnostic that almost always isolates the cause is to look at one of the tool descriptions the way the model sees it. For `brain_search` for example — what does the description actually say, and does it answer:

- **Scope:** what kind of question is this tool the right answer to?
- **Trigger:** what user intent should activate it?
- **Anti-trigger:** what looks like a fit but isn't (e.g. "for current-session recall, use built-in context, not this tool")?
- **Sibling pointer:** how does it differ from `start_session` / `remember_session` — they're related verbs and the model has to disambiguate among 42 of them?

42 tools on one server is a lot of disambiguation surface. If `brain_search`, `remember_session`, `start_session`, and `learn_lesson` all read as "do something with memory at session boundary," the model will fall back to whichever pattern dominates its priors — which, for "start of work on a coding task," is "no tool call." That's not the model ignoring the tool; it's the schema not giving the model a reason to prefer the tool over the prior.

For the CLAUDE.md side, two separate concerns:

- **CLAUDE.md is read but not deterministically obeyed.** It's a prompt, not a hook contract. "X is required" lives in the same priority class as the rest of the user's prompt — strong instructions degrade under context pressure, conflicting instructions degrade faster. The hard-block belongs at the hook layer (which the OP already has on SessionEnd), not in markdown.
- **A SessionEnd hook that blocks shutdown is the right architecture** — the model arguing with it is bad UX but the architecture is correct. The fix for the argument behavior is probably not in CLAUDE.md ("don't argue") but in making the hook message phrased as a tool call to make, not a thing to defend against. The model can comply with a clear next action; it rationalizes against a critique.

For the timeline question (worked-pre-March, broke-post-March): cross-issue evidence in #45898 / #46935 / #18780 is consistent with a change in how instruction adherence interacts with tool-use heuristics. But "the model used to call X reliably and now doesn't" is also consistent with "the model used to be more deferential to CLAUDE.md and now weighs it lower against turn-immediate context." Both produce the same symptom and need different fixes. Separating those would help the issue get triaged correctly — if there's a transcript pair where the same prompt + same CLAUDE.md produced different behavior pre/post-March, that's the strongest piece of evidence in the report.

On the broader sentiment — the report carries frustration that's audible and the financial number at the bottom is real. None of the above is meant as "you're holding it wrong." 42 tools + enforcement hooks + persistent memory is the textbook MCP architecture; it should work, and it's reasonable to expect the platform to not silently change the contract. The diagnostic split (selection vs. adherence) is the most useful thing a reply can add because both reproduce as "ignores the tool" but only one of them is a Claude Code bug.
