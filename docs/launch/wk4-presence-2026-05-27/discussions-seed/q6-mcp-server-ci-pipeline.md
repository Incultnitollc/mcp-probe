---
title: "How do you set up a CI pipeline for an MCP server?"
category_slug: q-a
---

CI for an MCP server splits cleanly into three layers, and most pre-publish bugs hide in the gap between them:

**1. Wire-protocol conformance** — does the server speak JSON-RPC over the chosen transport (stdio/HTTP), respond to `initialize`, return a clean `tools/list`, and survive a `tools/call` without crashing? This is the layer Anthropic's MCP Inspector (`@modelcontextprotocol/inspector`) was built for — interactive, exploratory. For headless CI, `@modelcontextprotocol/conformance` is the spec-compliance test suite Anthropic publishes; it's the right thing to run inside GitHub Actions to fail a build on protocol-level regressions.

**2. Tool-call surface** — does each tool actually execute end-to-end with realistic inputs, not just register? Most teams write a smoke-test that hits every `tools/list` entry with a representative payload and asserts the response shape. If your server depends on a browser, a DB, or an external API, that fixture goes here.

**3. Schema quality** — the layer that determines whether the agent will *actually pick* your tool at runtime. Wire-conformant servers regularly fail at this layer: tool descriptions too generic, parameters with no `description`, no enum constraints on finite fields, no anti-purpose clause that tells a planner when *not* to call the tool. This is the layer Inspector and conformance suites don't grade.

Concrete example. The official `@modelcontextprotocol/server-memory` is 100/100 on protocol conformance but ships nine tools where the top-level `entities` / `relations` / `observations` array parameter has no description field. An agent reading that schema has no signal for what shape goes in the array. The server is correct at layer 1 and 2, but a planner is going to hesitate at layer 3.

The pipeline most teams end up with looks like:

```yaml
- run: npx -y @modelcontextprotocol/conformance "<launch cmd>"   # layer 1
- run: pnpm test:smoke                                           # layer 2
- run: npx -y @incultnitollc/mcp-probe score "<launch cmd>"      # layer 3
```

That third step is the publishability-quality lane — pre-publish scorecard for server *authors*. For install-time security on the consumer side (a different audience, different lane), `@stephenywilson/mcp-doctor` is the tool that owns that surface.

Three tools, three lanes, one pipeline. If you only run one of them you'll catch about a third of the failure modes.
