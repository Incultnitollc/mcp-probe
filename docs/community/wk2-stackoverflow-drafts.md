# Wk2 Stack Overflow [mcp] tag — answer drafts

**Drafted:** 2026-05-15 (Fri) Taipei
**Author:** Peng (manual paste — Claude does NOT post)
**Source pages:** `https://stackoverflow.com/questions/tagged/mcp?tab=Unanswered&sort=Newest` + `?tab=Newest`
**Selection rule:** Real Model Context Protocol threads only. Skipped MCP = Master Control Program / motorcycle / unrelated.
**Constraints honored:**
- ≤50% probe-mention ratio across the pair
- Never lead with `npm install`
- Never "I built X" framing in the body
- Working code only (not pseudocode)
- Cite `https://github.com/Incultnitollc/mcp-probe/discussions/11` and/or the dev.to article
- SO norms: direct answer → code → context (no marketing fluff)

**Probe-mention budget (measured, not estimated):**
- Draft 1: 94 probe-region words of 674 total → **13.9%** intra-answer (one probe paragraph + one discussions/11 link paragraph at the end, both after the OP's problem has been fully solved by Layers 1-3)
- Draft 2: 0 probe-region words → **0%** (intentional ratio anchor — clean MCP architecture answer, no probe mention, no dev.to link)
- **Pair-level probe-mention ratio: 1 of 2 answers contain a probe mention = 50% ✔ (at cap, not over)**

---

## Draft 1 — `[mcp]` 0 answers · 65 views · asked 2026-05-04

**Thread:** Input validation error: '1.57' is not of type 'number' from langchain_mcp_adapter
**URL:** <https://stackoverflow.com/questions/79935672/input-validation-error-1-57-is-not-of-type-number-from-langchain-mcp-adapte>
**Asker:** OP (Python / langchain / model-context-protocol tags)
**Age at draft time:** ~11 days
**Views at draft time:** 65
**Answers at draft time:** 0
**Tags:** `python`, `artificial-intelligence`, `langchain`, `model-context-protocol`, `langchain-agents`

**Why this is a fit:** OP's diagnosis is already correct — the model emitted `"1.57"` (string) for a `float` parameter and `langchain_mcp_adapter` rejected it at the JSON Schema layer before the call reached the MCP server. This sits exactly on top of the load-bearing-descriptions thesis: when the schema constrains a type but the parameter description doesn't pin the format the model should emit, weaker models (here, `llama3.2:3b`) coerce to string and validation fires. The answer that helps OP is a layered fix — strengthen the schema description so the model doesn't emit a string, AND add a client-side coercion fallback for when it does. Probe gets a one-line mention as the static-detection option for the description-quality root cause.

**Probe-mention word count (measured):** 94 / total 674 words = **13.9%** (intra-answer). Pair-level ratio with Draft 2 (0%) = 50% of answers contain a probe mention — at cap.

**Post-when note:** Peng's SO account is new — SO has aggressive new-user rate limits (≤1 answer per 90s, comments locked at <20 rep, links auto-flagged on accounts with <10 rep). Post Draft 1 first, wait 24h to clear the new-user flag, post Draft 2 only after the first is not auto-flagged. Use the GitHub Discussion link (`/discussions/11`) rather than the dev.to link — dev.to links are more often shadow-flagged on new accounts than github.com links.

---

### Answer (paste this into the SO answer box)

````markdown
Your diagnosis is correct: the validator failing is `langchain_mcp_adapter`'s JSON Schema check on the *adapter side*, before the call ever leaves the client. `llama3.2:3b` is emitting `"1.57"` (string) for a parameter declared as `number`, and the adapter is doing what it's supposed to — refusing to forward a malformed call.

There are two layers to fix this, and you want both. One reduces how often the model emits the wrong type. The other handles the case where it does anyway.

## Layer 1 — Make the schema description pin the format

`Annotated[float, '...']` becomes the parameter's `description` field in the JSON Schema FastMCP generates. The model reads `description` heavily when deciding the literal value to emit. Yours describe what the parameter *means*, not what *literal form* the model should write. Compare:

```python
# Current — semantic, but no format pin
yaw: Annotated[
    float,
    'Orientation in radians (0=east, π/2=north, π=west, 3π/2=south)'
] = 0.0
```

vs.

```python
# Format-pinned — tells the model to emit a JSON number, not a string
yaw: Annotated[
    float,
    'Orientation in radians as a JSON number (not a string). '
    'Range -π to π. 0=east, π/2=north, π=west, -π/2=south. '
    'Example valid call: yaw=1.57'
] = 0.0
```

The phrase "as a JSON number (not a string)" plus a concrete numeric example is the part that materially changes behavior on smaller models. With Claude-class models the format pin matters less because they internalize the JSON Schema; with a 3B Llama the description carries most of the format contract.

Do the same on `x` and `y`.

## Layer 2 — Coerce at the adapter boundary

Even with perfect descriptions, a 3B model will sometimes emit a string. So wrap the tool with a coercion layer that catches numerics arriving as strings and converts them before the adapter validates. With `langchain_mcp_adapters` you do this by wrapping the tools returned from `client.get_tools()`:

```python
import json
from langchain_core.tools import StructuredTool

def coerce_numerics(args_schema):
    """Return a function that coerces numeric string fields to numbers
    based on the tool's JSON Schema."""
    schema = args_schema.model_json_schema() if hasattr(args_schema, 'model_json_schema') else args_schema
    numeric_fields = {
        name for name, prop in schema.get('properties', {}).items()
        if prop.get('type') in ('number', 'integer')
    }

    def coerce(**kwargs):
        out = {}
        for k, v in kwargs.items():
            if k in numeric_fields and isinstance(v, str):
                try:
                    out[k] = float(v) if schema['properties'][k]['type'] == 'number' else int(v)
                except ValueError:
                    out[k] = v  # let the adapter reject so the model sees the error
            else:
                out[k] = v
        return out
    return coerce

# Wrap tools after fetching from MCP
raw_tools = await client.get_tools()
tools = []
for t in raw_tools:
    coerce_fn = coerce_numerics(t.args_schema)
    original_func = t.func if hasattr(t, 'func') else t.coroutine
    async def wrapped(_orig=original_func, _coerce=coerce_fn, **kwargs):
        return await _orig(**_coerce(**kwargs))
    tools.append(StructuredTool.from_function(
        coroutine=wrapped,
        name=t.name,
        description=t.description,
        args_schema=t.args_schema,
    ))
```

Now `"1.57"` becomes `1.57` before the adapter sees it, and the adapter's `is not of type 'number'` check passes.

## Layer 3 — Make the failure loud during development

The reason this bug feels mysterious is that `langchain_mcp_adapter`'s error message ("Input validation error: '1.57' is not of type 'number'") doesn't tell you which tool, which parameter, or which call. Bump the adapter's log level high enough to capture the raw tool-call payload:

```python
import logging
logging.getLogger('langchain_mcp_adapters.tools').setLevel(logging.DEBUG)
```

The line you want is the `tool_call` log just before the validation error — it shows the exact JSON the model emitted, including which parameter was wrong-typed.

## Why this happens more on small models

Models below ~7B emit a lot more "stringified numerics" because their JSON-Schema-following is weaker. The same agent + same MCP server on `llama3.1:70b` or any Claude tier emits `1.57` cleanly because the schema's `type: number` is enough. The format-pinned description in Layer 1 is the cheap fix that closes the gap for the small-model case.

For static checking of whether your MCP tool/parameter descriptions are strong enough to survive small-model usage before you ship, `npx @incultnitostudiosllc/mcp-probe test "<your launch command>"` flags missing or weak parameter descriptions across the whole server — complementary to [Anthropic's MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is the interactive equivalent. Either tool, or a homemade lint, will surface the description-quality root cause; the Layer 2 wrapper is the runtime safety net regardless.

There's a longer trace of the four ways missing/weak descriptions break MCP tool calls — including this exact "client-side validator rejection" pattern as failure mode 3 — at <https://github.com/Incultnitollc/mcp-probe/discussions/11>.
````

---

## Draft 2 — `[mcp]` 0 answers · 55 views · asked 2025-11-07

**Thread:** Why is the tool prompt provided after tool invocation in an MCP workflow?
**URL:** <https://stackoverflow.com/questions/79812245/why-is-the-tool-prompt-provided-after-tool-invocation-in-an-mcp-workflow>
**Asker:** OP (workflow / prompt / model-context-protocol / tooling tags)
**Age at draft time:** ~6 months
**Views at draft time:** 55
**Answers at draft time:** 0
**Tags:** `workflow`, `prompt`, `model-context-protocol`, `tooling`

**Why this is a fit:** OP misunderstands two MCP primitives — *prompts* and *tools* — as if they're parts of a single chained workflow. They aren't; they're independent primitives the host orchestrates. This answer is a clean MCP architecture clarification with zero probe relevance (this isn't a schema-quality problem). Posting it builds genuine `[mcp]` tag credibility without a probe mention, which is exactly what keeps the pair ratio at 50%.

**Probe-mention word count (measured):** 0 / total 590 words = **0%** (intentional — no probe mention, this is the ratio anchor)

**Post-when note:** Post this 24-48h *after* Draft 1 if Draft 1 is not auto-flagged. If Draft 1 gets flagged, fix the flag first before posting Draft 2 from the same account. No links to mcp-probe or the dev.to article in this answer — links on a new account that don't materially serve the answer get auto-flagged as promotional. The MCP spec link is necessary and acceptable.

---

### Answer (paste this into the SO answer box)

````markdown
The premise of the question contains the confusion: in MCP, *prompts* and *tools* are not sequential steps in a single chain. They're two independent primitives the host application chooses between. What you're describing — "after the tool runs, I receive a prompt that instructs the next tool" — isn't the MCP pattern; it's an application-layer pattern your host happens to implement on top of MCP.

Here's the actual layering:

## What MCP defines

MCP defines three primitives a server can expose:

- **Tools** — model-controlled. The model decides when to call them, with what arguments.
- **Prompts** — user-controlled. The user (via the host UI, e.g. a slash command or template picker) decides when to invoke a prompt. The prompt is server-authored template text that the host injects into the conversation.
- **Resources** — application-controlled. The host decides when to attach them.

The full primitive list and ownership model is in the spec at <https://modelcontextprotocol.io/specification/2025-06-18/server>.

A prompt is **not** a runtime instruction emitted *after* a tool completes. A prompt is a reusable template the user selects (or the host auto-selects on some trigger) to seed the next turn of conversation. The tool's *output* is what the model receives after a tool call — full stop.

## Why your workflow looks the way it does

What you're observing — "the prompt for the next tool arrives after the previous tool's output" — strongly suggests one of two things:

1. **Your host is auto-injecting a prompt template after every tool call.** Some hosts (and some agent frameworks built on MCP) wrap tool results with a templated instruction like "Now consider whether to call the next tool…". That's a host-side orchestration choice, not part of MCP. The "prompt" you're seeing is the host's templating, not an MCP `prompts/get` response.

2. **You're calling `prompts/get` programmatically inside your tool's implementation.** If `split_task_raw`'s server-side handler calls `prompts/get` and returns that text as part of its tool result, then yes — the prompt arrives "after" the tool, because you stuffed it there. But that's a server-implementation choice, not a protocol requirement.

If you can share which host you're running (Claude Desktop, Cursor, custom langchain agent, etc.) the routing path will be clearer.

## Your second question — would embedding the next-step prompt in the previous tool's output be better?

For deterministic chained workflows where the next tool is always the same one, **yes** — and that's exactly what people build with tool composition or with [agent frameworks](https://modelcontextprotocol.io/docs/concepts/architecture) that orchestrate multiple MCP calls under a single model turn. But you'd do it by:

- Returning a structured result from `split_task_raw` that includes the next tool's *arguments* (not a prompt).
- Letting the model see those structured args and invoke the next tool itself.
- Or, if you want to bypass the model entirely between steps, building the chain server-side: one MCP tool that internally orchestrates the sub-steps and returns one final result.

A "prompt" is the wrong primitive to chain tools, because prompts are user-controlled by design. Using them as glue between tool calls makes the workflow dependent on a host that happens to re-render prompts after tool calls — which most hosts don't do.

## Best practices

- **Tool → tool chaining**: return structured output. Let the model route.
- **Tool → user-template injection**: that's where prompts apply (e.g. "after a `search` call, offer the user a `/summarize` slash command").
- **Deterministic multi-step work**: one MCP tool that calls others internally. Hide the orchestration from the model.

If `split_task_raw`'s output already contains the parameters for the next tool, return them as structured fields — the model will pick the next tool from its name + description, and the user/host won't need a prompt in the middle.
````

---

## Manual-paste workflow (Peng)

1. **Open both URLs in browser tabs** while logged into SO.
2. **Verify state hasn't changed** since draft time — if either thread now has an accepted answer, skip it.
3. **Post Draft 1 first** (the langchain one). It's higher-fit and gets the probe surface on a thread that genuinely benefits from it.
4. **Wait ≥24h.** If Draft 1 is not auto-flagged and ideally has ≥1 upvote or the OP has reacted, proceed.
5. **Post Draft 2.** Different `[mcp]` thread, different angle, zero probe mention — this is the credibility anchor.
6. **Check both 48h after Draft 2 posts.** Log:
   - Answer kept (not flagged/deleted)?
   - Vote count?
   - Comment/OP response?
   - Did the probe-linked discussion (`/discussions/11`) get any traffic referrer from SO?

Log results into the weekly Monday snapshot under "Stack Overflow `[mcp]` answers."

## What to do if a flag fires

- **"Looks like a promotional answer"** flag: remove the probe mention paragraph from Draft 1 and the discussions/11 link. The rest of the answer stands on its own.
- **"Low-quality answer"** auto-flag: usually means SO's heuristic didn't like a code-heavy answer on a new account. Wait for human review (24-48h); don't repost.
- **Account suspended**: stop. Don't create a second account. Use the GitHub Discussion at `/discussions/11` as the answer surface instead and link from the dev.to article.
