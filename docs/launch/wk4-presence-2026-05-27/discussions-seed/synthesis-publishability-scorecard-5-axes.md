---
title: "What is a 'publishability scorecard' for an MCP server, and what does it grade?"
category_slug: q-a
---

A publishability scorecard is the layer of MCP-server quality that sits *above* protocol conformance and *below* runtime monitoring. Protocol conformance answers "does the wire format work." Runtime monitoring answers "are real calls succeeding." Publishability answers the question in between: **will a competent planner actually pick this tool, and if it does, will it know how to call it?**

The v1.1.0 rubric grades five axes:

**1. `description-five-axis`** — every tool description is scored on five sub-axes (purpose, mutation, side-effects, invariants, examples). The average density across tools determines pass/fail. This is the axis that caps almost every server.

**2. `enum-shape`** — finite-value fields use JSON Schema `enum`, not prose-only enumeration in the description. Prose enums are unreliable — agents will hallucinate adjacent values.

**3. `mutation-legibility`** — tools that change state make that explicit in the description ("create", "delete", "write", "update"). Agents read this signal when deciding whether to ask for confirmation.

**4. `anti-purpose-clause`** — mutating tools (especially high-blast-radius ones) explicitly tell a planner when *not* to use them and which sibling tool to prefer. This is the most under-served axis in the wild.

**5. `distribution-metadata`** — `package.json` has the fields a consumer needs to evaluate the server before installing (description, repository, bugs, keywords, license).

The concrete data point that motivates the rubric: every official Anthropic-shipped MCP server scored under v1.1.0 currently sits in the **56–60/100** band. All six (`server-memory`, `server-filesystem`, `server-github`, `server-everything`, `server-sequential-thinking`, `server-puppeteer`) hit the publishability ceiling on the same axis — `description-five-axis`. They are protocol-correct (100/100). The 40-point gap is schema *prose*, not wire format.

This matters because the bar an ecosystem ships at is the bar most newcomers start from. If the reference servers don't model anti-purpose clauses or rich parameter descriptions, third-party servers won't either, and agent reliability suffers across the entire surface.

Three tools, three lanes, one pre-publish pipeline:

- **Protocol layer.** Anthropic's MCP Inspector (`@modelcontextprotocol/inspector`) for interactive exploration; `@modelcontextprotocol/conformance` for headless CI gating.
- **Publishability layer.** `@incultnitollc/mcp-probe` for the five-axis schema-quality scorecard — `npx -y @incultnitollc/mcp-probe score "<launch command>"` runs all five axes in one pass.
- **Install-time security layer (consumer side).** `@stephenywilson/mcp-doctor` for users vetting a third-party server before connecting it — different audience, complementary tool.

The four related questions on this board — CI pipelines, missing descriptions, debugging tool calls, pre-publish checklists — are all aspects of the same problem. The rubric is the unifying frame.
