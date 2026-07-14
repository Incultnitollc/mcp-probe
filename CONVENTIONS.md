# CONVENTIONS.md — MCP Probe (@incultnitollc/mcp-probe) · hybrid-agent house rules

Consumed by **Aider** (Groq/Llama for the 80%, Claude Opus 4.8 for the 20%).

## Identity (never mix)
- **Incultnito LLC** = legal entity. **MCP Probe** = free OSS **CLI + GitHub Action** that tests/benchmarks
  MCP servers ("VCR-for-MCP"). Published to npm as `@incultnitollc/mcp-probe`. Part of the MCP-stack funnel.

## Stack (this repo)
- **Node.js + TypeScript (ESM)**, distributed as a CLI. MCP SDK, commander, chalk, ora, zod.
- Main dir `src/` (flat): `cli.ts, mcp-server.ts, client.ts, bench/, diff/, printer/, reporters/`. Tests colocated `*.test.ts`.
- Build `tsc` · dev `tsx src/cli.ts` · **test `vitest run`**.
- `action.yml` + `server.json` are the public GitHub-Action / registry contract — treat as a stable API.

## Non-negotiable rules
- **Plan first. MINIMAL diff.** No unrequested refactors, no new deps without asking — this is a published package, keep the dep tree lean.
- **Inspect before changing.** Read the file + its imports and any colocated `.test.ts` first.
- **Public-contract awareness.** Changing CLI flags, `action.yml` inputs, or `server.json` is a breaking change → `ocode` + explicit sign-off, bump the version, update CHANGELOG.md/MIGRATION.md.
- **Secrets = placeholders only.** No real keys anywhere.
- Keep it green: `vitest run` must pass before declaring a change done.

## 🚨 MODEL UPGRADE TRIGGER RULE  (advisory — for the Groq/Llama `fcode` leg)
Before acting, self-check the task. If ANY trigger below is true, **DO NOT attempt the change.**
Print EXACTLY this banner and stop:

    ================================================
    🚨 MODEL UPGRADE ADVISORY 🚨
    This task needs advanced architectural reasoning
    or multi-file state changes. Re-run with `ocode`
    (Claude Opus 4.8) instead of `fcode` (Llama).
    Reason: <one line>
    ================================================

Triggers:
  1. The change spans > 2 files, OR touches the MCP client/server protocol handling or the diff/bench engines.
  2. It changes a PUBLIC contract: CLI flags, `action.yml`, `server.json`, or the reporter output format.
  3. It requires designing a NEW abstraction / module boundary.
  4. You are < 80% confident the change is correct AND complete.

> NOTE: this banner is a SOFT nudge — a 70B model is unreliable at flagging its own blind spots.
> The REAL control is you choosing `ocode` for protocol + public-contract work. Do not trust `fcode` to self-escalate.
