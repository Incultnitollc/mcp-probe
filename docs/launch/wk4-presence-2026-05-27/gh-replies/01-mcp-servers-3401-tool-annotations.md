---
venue: gh-issue
thread_url: https://github.com/modelcontextprotocol/servers/issues/3401
thread_title: "Add tool annotations to server-everything (13 tools, 0 annotated)"
op_question: "server-everything is the MCP reference server but exposes 13 tools with zero annotations; should demonstrate annotation usage as best practice"
state_check: "OPEN, not locked, verified 2026-05-27 09:45 TPE"
template: D2
probe_mention: Y
ratio_note: "1/4 probe-mentioned so far — within ≤50% rule (target: 2/4)"
---

Annotations on the reference server are doubly load-bearing because anyone learning MCP looks at this code first, then mirrors whatever pattern they see — or whatever pattern they *don't* see. Empty annotations read as "annotations aren't part of the contract," and that's the shape that propagates downstream.

A few framings worth folding in if/when a PR lands:

**`readOnlyHint: true` is not a safety claim — it's a side-effect claim.** The `get-env` case the OP and agentward-ai called out is the cleanest demonstration: read-only on the local machine, catastrophic on the network. The annotations correctly describe `get-env` itself; the risk is composition with any tool that has `openWorldHint: true`. If the reference server documents this distinction in code (read-only + openWorldHint=false on `get-env`, openWorldHint=true on whatever outbound tool gets added later), it teaches the chaining model alongside the annotations.

**`idempotentHint: false` on `trigger-long-running-operation` and `simulate-research-query` is the right call.** Worth saying out loud because it's the easiest annotation to fill in wrong: "the tool returns the same shape" is not the same as "calling it twice has the same effect." Operations that allocate state, mint IDs, or start streams are non-idempotent even when the return shape is identical.

**`openWorldHint` is the annotation that actually changes scheduling behavior on careful clients** — it tells the client whether retries are safe and whether to gate the tool behind extra consent. Defaulting to `false` on every tool here is correct (this server doesn't touch the network), but worth pairing with at least one tool that *would* set `openWorldHint: true` (a stub fetch tool, behind a flag) so the reference shows both sides of the contract.

For folks who want to audit their own servers' annotation coverage before publishing: Anthropic's MCP Inspector surfaces annotations in the tools panel — good for eyeballing. For automated lint over the live launch command (so it catches stuff that depends on the runtime config, not just the static schema), `npx @incultnitostudiosllc/mcp-probe test "<launch command>"` flags missing annotations alongside the more common missing-description warnings. Different stages of the pipeline; both worth running before tagging a release.

Either way, adding annotations to `server-everything` is the highest-leverage doc change in this repo right now — the comment-thread evidence here (and the same complaint reappearing across community servers) is that authors don't add annotations they haven't seen modeled.
