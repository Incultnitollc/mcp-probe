---
venue: gh-discussion
thread_url: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2733
thread_title: "What should a stdio MCP validator check beyond initialize and tools/list?"
parent_reply: 02-mcp-discussion-2733-stdio-validator.md
reply_to_user: Zawwarsami16
reply_to_summary: "Zawwarsami16 proposed a fifth liveCall bucket (error envelope, input validation honesty, cancellation, progress, concurrency, idempotency-claim verification, timeout classification, observability). Offered to PR live-call checks into mcp-stdio-guard. Also organically referenced mcp-probe."
state_check: "OPEN, not locked — verify before paste"
template: D2-followup
probe_mention: Y
ratio_note: "1 honest scope-acknowledgment mention + 1 mid-flow reference; no pitch. Probe organically named upthread by Zawwarsami16."
drafted_at: 2026-05-28
status: draft-pending-manual-fire
---

Zawwarsami16's liveCall bucket is the right fifth cut. A few threads worth pulling on.

**The schema ↔ liveCall pairing**

A lot of bucket-4 items are *claims* the server makes about itself; the corresponding bucket-5 check is whether the server *honors* that claim under a real call. Pairing them up tightens the audit chain:

| bucket-4 claim (static) | bucket-5 verification (live) |
|---|---|
| `inputSchema.required: ["x"]` | call without `x` → explicit error, not silent default |
| param has `enum: [...]` | call with off-enum value → rejected, not coerced |
| `annotations.idempotentHint: true` | same args twice → equivalent observable state |
| `annotations.readOnlyHint: true` | call mutates no resource the server exposes |
| `annotations.destructiveHint: false` | name doesn't imply destruction *and* no side effects observed |
| tool description X | result aligns with description's stated purpose |

The last row won't survive a strict formal check — description→behavior is fuzzy — but a "tool was invoked with args matching its stated purpose and returned content unrelated to that purpose" advisory would catch a real class of drift bug (descriptions that haven't kept up with handler edits).

**Error envelope: the spec ambiguity is the problem, not either pattern**

The spec permits both `JSON-RPC error response` *and* `tool result with isError:true / content[0].type:"text"` as failure signals. Clients handle these differently. A validator probably shouldn't pick a winner — but it should flag *inconsistency*:

- a server that returns JSON-RPC errors for invalid args but content-as-error for runtime failures is harder for a client to wrap than one that picks one pattern and sticks with it
- a server that returns content-as-error *without* `isError:true` is the worst case — looks like success to any non-MCP-aware wrapper in the chain

"Error-signaling consistency across N tool calls" as a bucket-5 check costs little and catches a lot.

**Concurrency: the request-id correlation bug is underdiagnosed**

The "single I/O queue mixes up which response goes to which id" bug is one of those failures whose only in-the-wild signal is "agent occasionally returns the wrong answer," and almost nobody bisects it to the server. A check that fires N concurrent calls with distinct ids and verifies (a) all return, (b) each response's id matches a request, (c) each response's content matches what *that* specific request asked for — would catch it cheaply. The third condition is what distinguishes wrong-response-routing from races on shared state. Both fail the test but for different reasons, and the remediation diverges.

**Negotiated-version anchor**

This is the sharpest single point in the thread. Static check against `package.json`'s advertised protocol version + live check against the negotiated version + a comparison flag is the closest thing to "did the server actually do what it claimed it could." Most "spec says this should work but doesn't" reports I've seen trace to that gap.

**Scope reality**

Candidly on current tooling: bucket 4 (schema quality) is what `mcp-probe` covers end-to-end today. Bucket 5 (live-call behavior) is mostly uncovered by anything I've seen in the OSS ecosystem, probe included. Zawwarsami16 PR'ing live-call checks into `mcp-stdio-guard` is the right home for that work — the JSON-RPC frame parser and process-lifecycle infrastructure there is the natural foundation, and keeping framing+process+live-call in one binary avoids the "three tools each find a third of the bugs" problem.

If `mcp-stdio-guard` lands a liveCall scorecard, wiring probe to surface its findings inline is straightforward on our side — so registry consumers and CI pipelines can get one composite pass/fail across all five buckets without orchestrating three runners.

The reproducibility fingerprint extended with negotiated protocol version, tool-list hash, and (where discoverable) server-side concurrency limit is the right anchor. If the spec repo wants to ship a reference fingerprint format, that's the artifact registries and CI configs will actually consume.
