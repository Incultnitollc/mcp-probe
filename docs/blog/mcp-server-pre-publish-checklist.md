# The MCP Server Pre-Publish Checklist

**Before you publish an MCP server, run 10 checks.** Most servers fail at least three — and the failures are invisible until an agent picks the wrong tool, hallucinates an argument, or silently drops your server on connect. This is the checklist we built `mcp-probe` to enforce, distilled to what actually breaks in the wild.

> TL;DR — A publishable MCP server connects cleanly, names tools unambiguously, describes every argument, validates inputs, and ships install metadata. The single most common failure is thin tool descriptions: even the five official Anthropic reference servers cap at **60/100** on description quality.

---

## Why "it works in Inspector" isn't enough

MCP Inspector answers *"does my server connect and list tools?"* That's necessary, not sufficient. The agent doesn't experience your server the way you do in a UI — it experiences your **tool descriptions and schemas as text in a context window**, and it picks tools by reading them. A server can pass Inspector and still be functionally unpublishable because the model can't tell your tools apart.

So the pre-publish question isn't "does it run?" It's **"is it publishable?"** — will a real agent, with no docs and no human in the loop, use it correctly?

---

## The 10-point checklist

### Connection & protocol
1. **Connects without transport errors** — stdio or HTTP, the handshake completes and the protocol version is current.
2. **Lists tools, resources, and prompts** — everything you intend to expose actually appears after `initialize`.
3. **No initialize timeout** — large tool lists can exceed the client's probe timeout and get silently dropped. Keep `initialize` fast.

### Tool legibility (where most servers fail)
4. **Every tool has a real description** — not a restated name. "create_issue: creates an issue" tells the model nothing. The description has to do the disambiguation work.
5. **No naming collisions** — `create_issue` exists in a dozen servers. If yours collides, the model guesses. Namespace or specify.
6. **Arguments are described, not just typed** — every parameter needs a description, required fields marked, enums enumerated. Nested args make the model miss required fields.
7. **Mutations are legible** — a tool that writes/deletes/charges should say so. The model should never discover a side effect at runtime.

### Schema & inputs
8. **Inputs validate** — valid input succeeds, invalid input produces a *useful* error, not a stack trace or a silent pass.
9. **Enum and shape constraints are explicit** — if a field takes one of four values, the schema says so. "string" where you mean an enum is a footgun.

### Distribution
10. **Install metadata ships** — clear package name, runnable example, fresh README, and (when the ecosystem standard lands) a `server.json` so the official MCP Registry can discover you. Devs find tools at install-time, not search-time.

---

## How to score it in 3 seconds

You can walk this list by hand, or run it:

```bash
npx @incultnitollc/mcp-probe score "node ./your-server.js"
```

`mcp-probe` connects to your server, runs all ten checks, and returns a **0–100 publishability score** across five axes — description quality, enum/shape correctness, mutation legibility, anti-"restate the name" clauses, and distribution metadata. A passing server clears ~80. The official reference servers sit at 60 (the description cap fires on every one). A typical first-draft community server lands in the 40s.

Wire it into CI so it runs on every release:

```yaml
# .github/workflows/publishability.yml
- run: npx @incultnitollc/mcp-probe score "node ./dist/server.js" --fail-under 80
```

The exit code gates the publish. Your server can't regress below the bar you set.

---

## The one thing to fix first

If you do nothing else: **rewrite your tool descriptions so a model with no context could choose correctly between yours and a similarly named tool.** That single fix moves more servers across the publishable line than any other on this list — and it's the one almost everyone skips.

---

*`mcp-probe` is an open-source CLI for testing and scoring MCP servers before you publish. `npx @incultnitollc/mcp-probe` · [github.com/incultnitollc/mcp-probe](https://github.com/incultnitollc/mcp-probe)*
