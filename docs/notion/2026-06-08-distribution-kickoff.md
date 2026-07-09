# mcp-probe — Pull-Distribution Kickoff & Task List

**Resume keyword:** `PROBE-PULL-KICKOFF`
**Date:** 2026-06-07 (kickoff) → resume scheduled Mon 2026-06-08 22:30 TPE
**Parent strategy:** `docs/notion/2026-06-07-distribution-rethink.md`
**On resume:** read this doc + the rethink doc, present the manual task list below, then build the MCP-server wedge (Fork #2) via TDD.

---

## 3 forks — LOCKED (2026-06-07)

| Fork | Decision |
|---|---|
| 1. Pivot social hard? | **YES** — demote to presence-only. Reply quotas + influencer-chase KILLED. |
| 2. Build MCP-server wedge? | **YES** — 2-day spike, TDD. `lib.ts` already exports `inspectServer`/`benchServer`/`checkCompliance` to wrap. |
| 3. mcp-probe vs Registry priority | **Rides alongside** the Registry flagship (scorecards → Vouch badges). Not competing for hours. |

---

## ✅ AUTOMATED — done this session (commits on `docs/mcpr-cross-link`)

| # | Task | Artifact |
|---|---|---|
| A1 | Wk6 bi-weekly citation sweep (0/20) + 20 screenshots | `docs/citation-log.md`, `docs/citation-log-screenshots/2026-06-07-sweep/` (commit `c6c901b`) |
| A2 | Track C reply drafts (@philschmid + @simonw, no-pitch) | `docs/community-presence-log.md` |
| A3 | Wk6 pre-gate metric snapshot (1/5) | `docs/notion/2026-06-08-wk6-metric-snapshot.md` |
| A4 | Distribution rethink strategy | `docs/notion/2026-06-07-distribution-rethink.md` (commit `40ea058`) |
| A5 | npm keyword top-up (publishability, mcp-server-testing, mcp-inspector-alternative) | `package.json` |
| A6 | Article #1 draft "MCP Server Pre-Publish Checklist" (GEO-structured, real CLI commands verified) | `docs/blog/mcp-server-pre-publish-checklist.md` |
| A7 | This kickoff/task-list doc | `docs/notion/2026-06-08-distribution-kickoff.md` |

---

## ✅ BUILT 2026-06-08 — Fork #2 wedge SHIPPED (TDD, 6 new tests, 115/115 green)

| Artifact | What |
|---|---|
| `src/mcp-server.ts` | `probe_server` + `score_server` tools; `createProbeMcpServer()`. Thin wrappers over `inspectServer` — no new probe logic. |
| `src/mcp-server-bin.ts` | `mcp-probe-server` stdio binary (shebang preserved in dist). |
| `src/cli.ts` `serve` | `mcp-probe serve` boots the MCP server — clean `npx @scope/pkg serve` for the registry. |
| `.well-known/mcp/server.json` | Registry discovery: schema `2025-12-11`, name `io.github.incultnitollc/mcp-probe`, npm stdio, `packageArguments:["serve"]`. |
| tests | `mcp-server.test.ts` (in-memory client + live fixture 46/100 D + error path), `mcp-server-bin.test.ts` (real stdio e2e), `cli-serve.test.ts` (real stdio e2e). |
| `package.json` | added `mcp-probe-server` bin. |

**Verify:** `npx tsc --noEmit` ✅ · `npm run build` ✅ (shebang ok) · `vitest run` → **115/115** ✅. (eslint not configured in this repo — skipped.)

**On next npm publish (M4):** bump `version` in `package.json`, `.well-known/mcp/server.json`, and `McpServer({version})` in `mcp-server.ts` together. Then submit to registry via `mcp-publisher` (GitHub-auth namespace `io.github.incultnitollc`).

<details><summary>Original next-session plan (now done)</summary>

## 🔧 NEXT-SESSION ENG — I build (with you), via TDD — Fork #2 wedge

**Goal:** ship mcp-probe AS an MCP server so it lists in the official MCP Registry — the one move that puts us inside the ecosystem's own discovery layer.

1. **`src/mcp-server.ts`** — an MCP server exposing mcp-probe's own capability as agent-callable tools:
   - `probe_server(target)` → wraps `inspectServer` (full inspection)
   - `score_server(target, packagePath?)` → wraps the publishability runner → 0–100 score
   - Reuses existing `lib.ts` exports — no new probe logic.
2. **Tests first** — `src/mcp-server.test.ts` (vitest): tool registration, schema, a probe against `test-fixtures/unpublishable-server.ts` (known 46/100 D), error paths.
3. **`bin` entry** — add `mcp-probe-server` to `package.json` bin, build via tsc.
4. **`.well-known/mcp/server.json`** — registry auto-discovery metadata (verify current schema at registry.modelcontextprotocol.io first — the `server.json` / "Server Cards" spec is the discovery anchor).
5. **Verify:** `npx tsc --noEmit` + `npx eslint . --quiet` + `vitest run` all green before any publish.

*Scaffold sketch (next session refines under TDD — do NOT ship untested):*
```ts
// src/mcp-server.ts  (sketch)
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { inspectServer } from "./lib.js";
import { runPublishability } from "./publishability-runner.js"; // confirm export name
// register tools: probe_server, score_server  → return structured JSON
```

</details>

---

## 📋 MANUAL — for Peng (copy-paste). I cannot do these autonomously.

### M1 — Publish article #1 (Play 2, highest near-term leverage)
**Where:** your own blog/domain FIRST, then syndicate to dev.to 2–10 days later with `rel=canonical`.
**Why first:** content compounds in SEO + AI-training; it's also the GEO fix for the 0/20 citation problem.
- Source: `docs/blog/mcp-server-pre-publish-checklist.md`
- dev.to front-matter to paste when you syndicate (set canonical to your domain URL):
```yaml
---
title: The MCP Server Pre-Publish Checklist
published: true
tags: mcp, ai, opensource, devtools
canonical_url: https://YOUR-DOMAIN/blog/mcp-server-pre-publish-checklist
---
```

### M2 — Chase PR #156 (cheapest external proof point, still OPEN)
**Where:** https://github.com/punkpeye/awesome-mcp-devtools/pull/156
**Action:** one polite nudge comment (value, not begging):
```
Friendly bump 🙏 — happy to adjust the entry to match the Testing Tools
section format if anything's off. mcp-probe scores MCP servers 0–100 on
publishability (description quality, schema, mutation legibility) before
publish — complements Inspector rather than overlapping. Thanks for
maintaining this list!
```

### M3 — Two value-first community answers (Play 3, NEVER pitch)
**Where:** r/mcp + MCP Discord. Find a real "my tool isn't being called / how do I test my server" thread.
**Action:** answer the question, attach a scorecard screenshot (run `npx @incultnitollc/mcp-probe score "npx tsx test-fixtures/unpublishable-server.ts"` → 46/100 D = the demo target). No link-drop; mention mcp-probe only if it directly answers.

### M4 — (OPTIONAL) Publish npm metadata refresh
Marginal on its own — **recommend bundling with the Fork-#2 release** rather than a standalone publish. When you do release:
```bash
npm version patch          # 1.1.0 → 1.1.1
npm run build && npm test
npm publish --access public
```

### M5 — (DEMOTED) Track C replies — fire ONLY if genuinely valuable
Drafts in `docs/community-presence-log.md` (@philschmid, @simonw). Under the new strategy these are presence, not a quota — fire only if you actually want to, paste manually from @Incultnito. No follow-up DM unless they engage.

---

## Gate reset
Show HN re-gated on **Registry-listing-live + ≥1 external repo using the Action** (NOT social metrics). Target **≥2026-06-30**. The 6/15 metric gate will still read 1/5 — expected; this pivot doesn't show in 7 days.

## GCal resume prompt (paste into Claude Desktop when the calendar event fires)
```
PROBE-PULL-KICKOFF — resume mcp-probe pull-distribution. Read
docs/notion/2026-06-08-distribution-kickoff.md and
docs/notion/2026-06-07-distribution-rethink.md. First, list the full task
list in great detail — AUTOMATED (done) vs MANUAL (for me) — with exact
copy-paste commands for every manual task. Then build the Fork-#2 MCP-server
wedge via TDD: src/mcp-server.ts wrapping inspectServer + the publishability
runner, exposing probe_server + score_server tools; add a mcp-probe-server
bin; draft .well-known/mcp/server.json after verifying the current registry
schema; verify with tsc + eslint + vitest all green. Do all automated/eng
work; leave npm publish, dev.to posting, Reddit/Discord answers, and the
PR #156 ping for me to fire manually.
```
