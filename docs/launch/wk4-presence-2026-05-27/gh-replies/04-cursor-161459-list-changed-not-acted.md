---
venue: cursor-forum
thread_url: https://forum.cursor.com/t/mcp-notifications-tools-list-changed-not-acted-on-mid-session/161459
thread_title: "MCP: notifications/tools/list_changed not acted on mid-session"
op_question: "Cursor CLI ignores notifications/tools/list_changed mid-session; blocks lazy-loading patterns where servers dynamically register tools post-startup. Same behavior filed in anthropics/claude-code#62058"
state_check: "OPEN, not closed, not archived, verified 2026-05-27 09:50 TPE (created 2026-05-24, 1 reply)"
template: D2-adjacent (protocol-conformance, not schema-quality)
probe_mention: N
ratio_note: "2/4 probe-mentioned across batch — under ≤50% rule. Intentionally probe-free: probe scans schemas, not notification handling."
---

The spec language on this is unambiguous — `notifications/tools/list_changed` is defined as the server's signal that the client should re-issue `tools/list`. The 2025-11-25 schema lists it as one of the server-to-client notifications that "indicates that the list of tools the server offers has changed, possibly subsequent to a change in available tools or because of a configuration change," and the client's expected behavior is a fresh `tools/list` call. Anything else is a client bug, not a server protocol violation, which matters for the framing of the cross-filed Claude Code issue: this isn't a "feature request," it's a conformance gap.

The lazy-loading pattern the OP described is exactly the use case the notification exists for, and it's the use case that hurts most when the notification gets dropped:

- **Discovery-tool pattern:** server exposes 1 tool at startup (`list_available_capabilities`), then registers the full set after the user (or agent) opts in. Without `list_changed` handling, the client only sees the discovery tool forever.
- **Auth-gated tool surface:** server exposes a `login` tool first, then registers user-specific tools post-auth. Without `list_changed`, the user has to restart the session after logging in.
- **Per-workspace tool surfaces:** server detects project type post-handshake (e.g. "this is a Rails repo, exposing rails-specific tools"), then registers them. Without `list_changed`, the model sees the union or the empty set.

All three patterns reduce baseline context cost meaningfully when the client honors the notification, and all three degrade to "user has to restart" without it.

A few things worth confirming in the repro to strengthen the bug report:

1. **Is the notification arriving at the client at all?** Worth checking the MCP transport logs (stdio servers: stderr usually surfaces the outbound write; HTTP servers: server-side log of the SSE event). If the notification never leaves the server, it's a server-side framing bug, not a client bug.
2. **If the notification arrives, does the client log receiving it?** Cursor's MCP logs (typically under `Output → MCP` in the IDE, or whatever the CLI equivalent is) should show inbound JSON-RPC. If the inbound shows up but no subsequent `tools/list` request goes out, that nails it as client-side dropped.
3. **Cold-restart parity.** If a session restart causes the *full* updated tool list to appear, that confirms server-side discovery is working — the gap really is just the live re-fetch.

The spec doesn't currently mandate a debounce or backoff for re-fetching, which is something worth flagging upstream — a server that legitimately changes its tool list often (per-workspace, per-conversation context) could trigger a re-fetch storm if every notification produced an immediate `tools/list`. The reasonable client behavior is "re-fetch on first notification, then coalesce subsequent notifications within a small window." Something to suggest in the issue body, not blocking.

On the cross-fire with `anthropics/claude-code#62058` — that's the right precedent to cite, but worth noting that two clients with the same gap is evidence of a documentation gap in the spec rather than two independent regressions. The notification is specified, but the "client SHOULD re-fetch" behavior isn't called out as a normative requirement in the spec text I can find — it's implied by the notification's purpose. An RFC against `modelcontextprotocol/modelcontextprotocol` to make that requirement normative would close the door on this recurring across clients.

Until the fix lands, the practical workaround for server authors who need this today is to register the full tool surface at startup and use empty input-schemas or annotation flags to mark conditionally-available tools as "currently unavailable" — degraded but discoverable. Not ideal, but it works against clients that don't honor the notification.
