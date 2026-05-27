---
title: "What happens if an MCP tool (or its parameters) is missing a description?"
category_slug: q-a
---

Two distinct failure modes, depending on *which* description is missing.

**Missing tool-level description.** The protocol allows it — `description` is technically optional on the tool object — but a planner that sees `{"name": "search_nodes"}` with no description has nothing to disambiguate against the other tools it can see. The empirically observed failure mode: the agent either picks the wrong tool (whichever one *does* have a description that vaguely matches the user's intent) or refuses to call any tool and answers from its training data. There is no error log on the server side; the call simply never arrives.

**Missing parameter-level description.** More common, and the more interesting failure. The JSON Schema for the parameter is still valid (`{"type": "string"}` parses fine), but the model has no signal for what the field semantically *means*. Two things happen:

1. The agent skips the tool entirely — it doesn't want to risk filling a field it can't reason about.
2. The agent hallucinates a plausible value — and you get a runtime error from a parameter that "shouldn't" have garbage in it.

Concrete example from a real, official server. `@modelcontextprotocol/server-memory` exposes `create_entities` with this parameter schema:

```json
{
  "entities": { "type": "array", "items": { /* ... */ } }
}
```

No `description` on `entities`. The model sees an array of *something* and has to guess from the tool name what should go in it. Compare that to a schema that adds:

```json
{
  "entities": {
    "type": "array",
    "description": "Entities to insert into the knowledge graph. Each entity must have a unique name and at least one observation. Pass [] to insert nothing.",
    "items": { /* ... */ }
  }
}
```

The second form gives the agent an anchor for `name`, an anchor for `observations`, and an explicit guidance on the empty case. Same protocol, dramatically different runtime behavior.

Anthropic's MCP Inspector won't flag a missing parameter description — it validates the protocol, not the prose. For a server-author-side check that does flag it, `@incultnitollc/mcp-probe` runs the `description-five-axis` rubric (purpose, mutation, side-effects, invariants, examples) over every tool and parameter. The 5-axis fail is, empirically, the single most common reason an otherwise wire-correct MCP server is unreliable in production.

`npx -y @incultnitollc/mcp-probe score "<launch command>"` outputs the per-tool failures in one pass.
