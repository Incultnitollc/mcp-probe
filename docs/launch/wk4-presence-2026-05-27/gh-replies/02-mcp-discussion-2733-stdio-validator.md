---
venue: gh-discussion
thread_url: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2733
thread_title: "What should a stdio MCP validator check beyond initialize and tools/list?"
op_question: "OP built mcp-stdio-guard for stdio server pre-publish validation; asks for additional checks beyond initialize + tools/list, schema separation, and Python buffering edge cases"
state_check: "OPEN, not locked, verified 2026-05-27 09:45 TPE"
template: D2
probe_mention: Y
ratio_note: "2/4 probe-mentioned this batch — at ≤50% rule ceiling"
---

The three-bucket separation yudin-s sketched (install/runtime, transport hygiene, protocol conformance) is the right top-level cut. The bucket that keeps getting under-served in practice is a fourth one: **schema quality**. It's not a runtime failure and it's not a protocol violation — the server happily passes `initialize + tools/list` — but it's the reason "agent connects but won't call my tool" reports outnumber actual protocol bugs by a wide margin.

Checks that belong in that fourth bucket, in rough order of how often they bite:

```text
Tool schema quality (post-protocol-conformance)
- every tool has a non-empty description
- description is not just a noun phrase ("Search files") — has a verb + scope
- description includes anti-purpose (what the tool is NOT for) — the single biggest disambiguator for wrong-tool-selection
- every parameter has a description (the most common cause of "model guesses values")
- string parameters with finite value sets have enum constraints
- description ≤ 1024 chars (OpenAI hard cap; tightest of major providers)
- annotations populated (readOnlyHint, destructiveHint, idempotentHint, openWorldHint)
- tool count under client trim thresholds (some clients silently truncate after N tools)
```

The "annotations honesty" angle yudin-s mentioned for resources/prompts has a direct parallel for tools: if `destructiveHint: false` is set on a tool whose name starts with `delete_` or `drop_`, that's a contradiction worth flagging — careful clients use those hints to gate consent prompts.

On reproducibility fingerprint — strong yes, and worth including the protocol version the server actually negotiated (server can downgrade), not just the version it claims to support. A server that advertises `2026-03-26` in package metadata but negotiates `2025-11-25` at runtime is the most common cause of "spec-says-this-should-work-but-doesn't" reports.

For separation in the JSON schema (Q2): yes, and the wire format gain is that registry consumers can filter on "passes protocol but has schema warnings" — that's the cohort that needs the most help and currently gets bucketed with "fully broken" because the failure mode is invisible without a schema-level check.

On Python buffering (Q3): treating it as a runtime advisory unless it causes a timeout is the right call. The trickier case is servers that emit *partial* JSON-RPC frames because of buffering interacting with `print()` calls in the wrong order — that one looks like a JSON-RPC framing failure but the root cause is buffering, and a guard that classifies it as "framing" will get a fix that doesn't address the cause. If `mcp-stdio-guard` can detect "stdout produced incomplete frames AND PYTHONUNBUFFERED=1 changes behavior," that's the high-signal advisory.

One more from the repeated-run side: **schema fingerprint stability across runs**. Re-running `tools/list` should return the same tool count, same names, same parameter shapes. Servers that lazy-register tools post-handshake (or whose schemas vary by env) break clients that cache the tool list. Flagging "tool count differs between cold runs" catches a class of bug that protocol-only checks miss.

For folks running adjacent tooling — `mcp-stdio-guard` is the strongest framing-and-process-health check I've seen; `npx @incultnitollc/mcp-probe test "<launch command>"` covers the schema-quality bucket above (descriptions, params, anti-purpose, length caps) and outputs a scorecard you can fail a build on; Anthropic's MCP Inspector is still the right tool for interactive click-through. Three different stages, three different failure surfaces. The more of them are run pre-publish, the fewer "Inspector says fine but my agent ignores it" reports get filed downstream.
