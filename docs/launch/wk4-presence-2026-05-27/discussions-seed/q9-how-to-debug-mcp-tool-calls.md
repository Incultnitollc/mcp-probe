---
title: "How do you debug MCP tool calls when the agent isn't behaving as expected?"
category_slug: q-a
---

Debugging an MCP tool-call issue is mostly about figuring out *which layer* is failing, because the symptoms look identical at the top: "Claude/Cursor isn't using my tool, or is using it wrong."

Work the layers in this order:

**1. Did the call even reach the server?** Run the server with stderr captured (`node server.js 2>server.log`) and look for the JSON-RPC frame. If there's no `tools/call` frame logged, the agent never tried. That's a schema-quality problem (layer 3), not a transport problem.

**2. Did the handshake succeed?** Anthropic's MCP Inspector is the standard interactive check here — connect, watch `initialize` and `tools/list` come back clean, click each tool with synthetic input and confirm the response. If Inspector is green and your client still fails, the problem is on the client side (some agents only surface the first N tools, others trim long descriptions, some require a specific config block).

**3. Did the call execute but return garbage?** This is usually a parameter-quality problem. The agent hallucinated a value because the parameter description was missing or too abstract. Capture the exact JSON-RPC frame the agent sent and compare it to your schema — the field that's wrong is almost always the field with the weakest description.

**4. Did the call execute, return a clean response, but the agent ignored it?** Different problem — your tool returned content the model can't ground against. Tool responses follow the same prose-quality rule as tool definitions: structured, descriptive, with explicit field meaning beats raw blobs.

Concrete example. A team reported "Claude won't call `search_nodes`." The Inspector run was green. The schema looked like:

```json
{
  "name": "search_nodes",
  "description": "Search for nodes",
  "inputSchema": {
    "properties": { "query": { "type": "string" } }
  }
}
```

Two problems. The tool description doesn't say *when* to use this tool versus the three other search tools on the same server. The `query` parameter has no description, so the agent doesn't know whether to put a node ID, a name substring, a regex, or a natural-language phrase in there. Fix both, the call started landing reliably.

Three tools cover the three layers cleanly. Inspector (Anthropic) for interactive protocol exploration. `@modelcontextprotocol/conformance` for headless protocol gating in CI. `@incultnitollc/mcp-probe` for the schema-quality layer (`npx -y @incultnitollc/mcp-probe score "<launch cmd>"`) — flags weak tool descriptions, missing parameter descriptions, and missing anti-purpose clauses in one pass.

For install-time security debugging (e.g., a server you're connecting to that you didn't write), `@stephenywilson/mcp-doctor` owns that lane.
