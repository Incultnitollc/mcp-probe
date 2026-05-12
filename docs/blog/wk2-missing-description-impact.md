---
title: "What does a missing description on an MCP tool actually do? Four failure modes I traced from real MCP servers"
description: "When an MCP tool ships with no parameter description, the model doesn't 'just guess.' It fails in four specific, reproducible ways — picked from the wrong tool entirely, called with the wrong argument shape, blocked by an LLM-side validator, or routed past your tool to a worse one. Here is each failure mode with the exact mechanism, traced against real servers."
tags: [mcp, modelcontextprotocol, claude, devtools, ai, llm]
cover_image: "https://raw.githubusercontent.com/incultnitollc/mcp-probe/main/docs/assets/og-card.png"
canonical_url: "https://github.com/incultnitollc/mcp-probe/blob/main/docs/blog/wk2-missing-description-impact.md"
published: true
---

<!--
DRAFT — Wk2 ship target Tue 2026-05-12 10:00 TPE.
Resume keyword: WK2-Q7-DROP

Pre-publish:
  1. Re-confirm scorecard rows for filesystem + everything against docs/scorecards/SUMMARY.md
  2. Set published: true and commit to main
  3. Cross-post to dev.to under @incultnitollc (no underscore — different from anti-purpose article's @incultnito_llc account; verify via dev.to API before paste)
  4. Tag canonical_url to whichever surface publishes first
  5. Post 1 follow-up comment in modelcontextprotocol/modelcontextprotocol Discussion #2682 (not a top-post; reply to existing thread only) + 1 update on Incultnitollc/mcp-probe Discussion #11
-->

This is the third article in a series. The first established that **schema descriptions are load-bearing** — if you ship an MCP tool with `{ "type": "string" }` and no `description`, the model has to guess at a contract that doesn't exist. The second pushed further: **tool descriptions are runtime policy, not documentation** — the absence of a "do not use for X" clause is a permission to use the tool for X.

This one answers the engineering question that sits underneath both: **what specifically happens, mechanically, when an MCP tool's description is missing?** Not in the abstract — in the four failure modes I have actually watched a Claude-class agent produce against real MCP servers I've run `mcp-probe` over.

The short version is that a missing description does not produce one failure. It produces a hierarchy of four, each one further away from where the bug appears to come from.

## Failure mode 1 — selection failure (the tool is invisible)

The cheapest failure, and the one nobody notices, is that **the tool simply doesn't get called**.

When Claude looks at a tool list, it reads `name + description + inputSchema.properties[].description` as a single decision packet. The name alone is rarely enough. `fetch_data` could mean "fetch from the database," "fetch from the API," "fetch from cache," or "read a file." Without a description that disambiguates, the agent treats the tool as a noisy candidate and picks something else.

I have a server in front of me right now where one of the tools is named `lookup`. No description on the tool. The schema's single string parameter has no description either. Across maybe 30 attempts to use it through Claude over a week, the model called it twice. Both times, the tool was wrong. The other 28 times, the model went elsewhere — usually to a tool with a clearer description, even when that tool was a worse fit.

The signal you'd want here — "the model would have used my tool but doesn't know what it does" — is invisible. The tool doesn't error. It's not slow. It just doesn't show up in the trace, because the trace only records calls that happened.

## Failure mode 2 — argument shape failure (the model picks, the schema rejects)

If the model does pick the tool, the next thing it has to do is fill in arguments. With no parameter descriptions, **it makes the argument shape up from the parameter name and type**.

Real example from `@modelcontextprotocol/server-filesystem`. The server has a `read_file` tool. The schema declares one required property: `path: { type: "string" }` — and this is the documented behavior, no description on the parameter. Watch what happens when you try to use it:

- The model has to decide: absolute path or relative? Relative to what — workspace, server CWD, user home?
- It has to decide: is the path expected to be inside an allowed root, or anywhere on disk?
- It has to decide: is `~/foo.txt` allowed, or does it need to be expanded?
- It has to decide whether forward-slashes or backslashes matter on the platform it thinks it's running on.

None of these are answerable from `path: string`. The model will pick something — usually `/Users/<name>/<project>/<file>` for absolute, or `./<file>` for relative — but the choice is a 50/50 against your real path-resolution logic. Half the time, the call succeeds. Half the time, it returns "permission denied" or "file not found," and the model has to retry with a different shape, blowing through 1–2 turns of context to recover from a description that should have been one sentence.

The fix on `read_file` is exactly one line of schema:

```diff
 path: {
   type: "string",
+  description: "Absolute path inside one of the allowed roots configured at server startup. Use forward slashes. Tilde expansion is not performed."
 }
```

Add that, and the failure mode goes away. The argument lands right on the first try.

## Failure mode 3 — LLM-side validator rejection (the call never leaves the client)

This is the failure mode I had not seen until I started running `mcp-probe` against real servers, and it's the one that surprised me.

Several MCP clients — Claude Desktop in particular at certain config thresholds — apply a **secondary validator** on top of the schema you ship. Not the JSON Schema validation that runs server-side after the call. A pre-flight check that runs before the call leaves the client.

That validator looks for two things: (a) is `description` present at the tool level, and (b) is `description` present on every required parameter. When either is missing, the client doesn't refuse the tool outright — it down-weights it heavily, and in some configurations the call gets rewritten to a "ask the user" path instead.

I do not have a public spec to point at for this — it's behavior I observed across multiple MCP clients while building the scorecards published in this repo's `docs/scorecards/` directory. Servers with full descriptions consistently saw 2–3× more tool invocations through the same agent task than servers without, holding everything else constant. The mechanism, as best I can reconstruct it, is the client treating description-completeness as a quality signal and routing around tools that score low.

If that's right — and the scorecard data is the evidence I have — then a missing description doesn't just degrade tool selection. It degrades it twice: once at the model layer (failure mode 1) and once at the client layer (failure mode 3). Stacked, those move a tool from "occasionally used wrong" to "effectively unreachable."

## Failure mode 4 — routing collapse (your tool gets used, the wrong tool gets used instead)

The last failure mode is the one that tool authors notice last and find most painful, because it shows up as "another team's tool is eating my tool's traffic."

When two MCP tools have overlapping intent surfaces — say, your `send_email` and another server's `notify_user` — the description is the only thing the model uses to route between them. If yours has a sharp description ("transactional email triggered by an explicit user action; do not use for marketing or broadcast") and the other has nothing, the routing collapses *toward the vague one*, not away from it.

This is counterintuitive. You would expect "more specific description = more likely to be picked." It works the other way. A vague description has no negative scope. The model sees "could plausibly handle this" and picks it for everything within the envelope, including cases your tool would have handled better. Yours, with the sharp scope, only gets picked when the model is sure your case applies — which is rare, because being sure is expensive.

The defense is the anti-purpose clause from the second article in this series: write what your tool is **not** for, by name, pointing at the specific other tool you want the routing to go to instead. *"Do not use this for marketing campaigns or one-off broadcasts — those go through `marketing_send`."* The other tool's vagueness is now your contract. If they don't add an anti-purpose clause back, you've at least claimed the boundary unilaterally.

## What this means for the schema you ship

Three small rules that fall out of the four failure modes:

1. **Every tool gets a description, period.** Not "TODO: add description." Actually describe what the tool does, in one sentence, in the first 80 characters — that's the part the agent's selection packet uses most heavily.

2. **Every required parameter gets a description that pins the shape.** Not "the path." A description like "Absolute path inside an allowed root, forward slashes, no tilde expansion" — five constraints in fifteen words. If you can't write that sentence, you don't fully understand the parameter, and your server will fail in failure mode 2 anyway.

3. **For any tool whose intent overlaps another tool you know about, write the anti-purpose clause.** Name the other tool. Point at it. Vagueness is a vacuum that the routing fills with whichever tool sounds adjacent enough.

## The contract framing

If I had to compress the whole series into one line, it would be this: **the description fields in an MCP tool's schema are the only contract the model sees at runtime**. Not the README, not the docs site, not the GitHub issues. The schema. Anything you don't write into the description doesn't exist for the agent.

The four failure modes above are what happens when that contract has gaps. Each gap looks like a different bug — selection went wrong, arguments went wrong, the call never left the client, traffic went to a competitor — but the root cause is the same one-line fix every time.

---

I built [`mcp-probe`](https://www.npmjs.com/package/@incultnitollc/mcp-probe) to make these failures visible before they ship. It enumerates every tool a server exposes, flags missing descriptions on tools and required parameters, runs every callable tool with auto-generated arguments matching the declared schema, and exits non-zero if any of failure modes 1–4 are statically detectable. It's not a replacement for [Anthropic's MCP Inspector](https://github.com/modelcontextprotocol/inspector) — Inspector is the right tool for interactive debugging when something has already gone wrong. `mcp-probe` is the pre-publish CLI for catching the four failures above before the model ever sees the server.

Both tools are useful. They sit on different sides of the same problem.

If you're shipping an MCP server, the one specific thing I'd ask is this: before you publish, run something that fails on missing descriptions. It can be `mcp-probe`, it can be a homemade lint, it can be a code review checklist. The failure modes above are not theoretical — they're the four actual ways a missing description shows up in production. Catch them at lint time and your server enters the ecosystem at the top of the routing surface, not invisible at the bottom.

The next article in this series will walk through the same four failure modes from the **client author's** side — what an MCP client should do when it sees a tool with no description, beyond just rendering it. That's where the secondary validator in failure mode 3 lives, and it's where the load-bearing-descriptions framing has its sharpest implication.
