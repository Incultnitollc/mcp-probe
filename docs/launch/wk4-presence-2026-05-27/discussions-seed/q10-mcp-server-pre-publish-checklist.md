---
title: "What's the pre-publish checklist for an MCP server?"
category_slug: q-a
---

In rough order of "what bites people before publish":

**1. Schema descriptions are load-bearing.** Every tool needs a description that answers four questions: scope (what does it do), trigger (when should an agent call it), anti-trigger (when should it *not*), and sibling pointer (which tool to use instead, if applicable). Every parameter — every tool — needs its own description. Skipping parameter descriptions is the single most common cause of "Claude won't call my tool" reports.

**2. Required vs. optional accuracy.** Parameters that are conceptually required but marked optional cause runtime failures the schema can't predict. Parameters that are conceptually optional but marked required force the agent to hallucinate placeholder values.

**3. Enum constraints on finite-value fields.** If a field accepts one of `"asc" | "desc"`, the schema should say so via `enum`, not via prose in the description. Prose-only enums are the most common axis where servers leak agent confusion.

**4. Anti-purpose clauses on mutating tools.** Any tool that writes, deletes, or has side effects should explicitly say in its description what it shouldn't be used for and which sibling tool to prefer. Empirically: every official Anthropic-shipped multi-tool MCP server with mutating tools is currently missing this. It's the most under-served axis.

**5. Mutation legibility.** A tool that mutates state should signal that in its description (the word "create," "delete," "update," "write" should appear). Agents read this signal when deciding whether to call without confirmation.

**6. Protocol handshake.** `initialize` → `tools/list` → at least one `tools/call` should complete cleanly. Anthropic's MCP Inspector is the standard interactive tool for this. `@modelcontextprotocol/conformance` is the headless equivalent for CI.

**7. Transport sanity.** stdio vs HTTP, and your launch command matches the transport.

**8. README + distribution metadata.** `package.json` has `description`, `repository`, `bugs`, `keywords`, and a license; README documents the launch command and lists each tool.

A concrete data point: under the v1.1.0 publishability rubric, all six official Anthropic-shipped servers (`server-memory`, `server-filesystem`, `server-github`, `server-everything`, `server-sequential-thinking`, `server-puppeteer`) score 56–60/100. They're 100/100 on protocol conformance — the 40-point gap is entirely on items 1–4 above. The bar Anthropic ships at is roughly the bar most servers will start from, which is the practical reason this checklist matters.

Three tools own three lanes here. Inspector for interactive exploration. `@modelcontextprotocol/conformance` for protocol CI gating. `@incultnitollc/mcp-probe` for the publishability/schema-quality layer (items 1–5 + 8) — `npx -y @incultnitollc/mcp-probe score "<launch command>"` produces a scorecard you can fail a build on. For install-time security (consumer side), `@stephenywilson/mcp-doctor` is the complementary tool.
