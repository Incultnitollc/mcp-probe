# publishability-score v1.1.0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `@incultnitollc/mcp-probe@1.1.0` to npm by Sat 2026-05-23 14:00 TPE with a 5-check publishability suite (description-five-axis, enum-shape, mutation-legibility, distribution-metadata, anti-purpose-clause) plus a 0–100 composite score, opt-in via `--publishability` flag and `score` subcommand.

**Architecture:** Additive to existing `inspectServer` pipeline. Five pure-function static checks operate on `InspectResult` (no payload injection, no new transport). Dynamic `import()` keeps cold-start cost zero for users not running `--publishability`. Test fixtures are in-process stdio MCP servers (clean + intentionally-broken) in repo-root `test-fixtures/` excluded from the published tarball.

**Tech Stack:** TypeScript 6, Node 20, vitest 3, commander 14, chalk 5, `@modelcontextprotocol/sdk@^1.29.0` (already a dep). No new dependencies.

**Spec:** `docs/specs/publishability-score-v1.1.0.md` (commit `809f7d4`). All deviations during build go in `docs/specs/publishability-score-v1.1.0-amendments.md`.

---

## File Structure

```
src/
  publishability-runner.ts            # NEW — orchestrator
  publishability-runner.test.ts       # NEW
  publishability-checks.ts            # NEW — 5 check implementations
  publishability-checks.test.ts       # NEW
  publishability-axes.ts              # NEW — regex corpus for the 5 axes
  publishability-axes.test.ts         # NEW
  publishability-scorer.ts            # NEW — composite math, caps, bands
  publishability-scorer.test.ts       # NEW
  publishability-printer.ts           # NEW — CLI rendering
  publishability-printer.test.ts      # NEW
  types.ts                            # MODIFY — append new types, extend InspectResult
  cli.ts                              # MODIFY — add flags + score subcommand
  client.ts                           # MODIFY — wire runner + scorer call
  html-reporter.ts                    # MODIFY — append renderPublishabilitySection

test-fixtures/                        # NEW directory at repo root
  publishable-server.ts               # NEW — clean MCP server
  unpublishable-server.ts             # NEW — intentionally broken MCP server

docs/
  publishability-scorecards/          # NEW — D4 self-audit output
    server-everything.txt
    server-filesystem.txt
    server-github.txt
    server-memory.txt
    server-sequential-thinking.txt
    SUMMARY.md

.github/workflows/
  publishability-self-check.yml       # NEW — weekly canary

CHANGELOG.md                          # MODIFY — 1.1.0 entry
README.md                             # MODIFY — v1.1.0 section + mcp-doctor cross-link
package.json                          # MODIFY — version bump (D5)
```

---

## Day 0 — Mon 2026-05-18 (today)

### Task 0.1: Append publishability types to `src/types.ts`

**Files:**
- Modify: `src/types.ts` (append at end)

- [ ] **Step 1: Verify TypeScript baseline is green**

Run: `cd "/Users/pengspirit/incultnito/Dev/Backend/repos/Month 1 and 2 - MCP Inspect" && npx tsc --noEmit`
Expected: no output (clean compile).

- [ ] **Step 2: Append new types to `src/types.ts`**

Append (NEW types only — existing types untouched):

```typescript
export type PublishabilitySeverity = "high" | "medium" | "low" | "info";

export type PublishabilityCheckId =
  | "description-five-axis"
  | "enum-shape"
  | "mutation-legibility"
  | "distribution-metadata"
  | "anti-purpose-clause";

export interface PublishabilityResult {
  check: PublishabilityCheckId;
  passed: boolean;
  severity: PublishabilitySeverity;
  title: string;
  message: string;
  perToolFailures?: Array<{ tool: string; reason: string }>;
  evidence?: {
    axisAvg?: number;
    failedTools?: string[];
    metadataField?: string;
    skipped?: boolean;
  };
  remediation?: string;
  durationMs: number;
}

export interface PublishabilityCheckContext {
  result: InspectResult;
  packageJsonPath?: string;
  timeout: number;
}

export interface PublishabilityCheck {
  id: PublishabilityCheckId;
  title: string;
  defaultSeverity: PublishabilitySeverity;
  run(ctx: PublishabilityCheckContext): Promise<PublishabilityResult>;
}

export interface PublishabilityScore {
  composite: number;
  grade: "A" | "B" | "C" | "D" | "F";
  bandName: "Publishable" | "Almost" | "Rough" | "Not ready";
  passed: number;
  failed: number;
  capsApplied: Array<{ reason: string; ceiling: number }>;
  byDomain: {
    protocol: { score: number; hardZero: boolean };
    edgeCases: { score: number };
    publishability: { score: number; failures: PublishabilityCheckId[] };
  };
}
```

Extend existing `InspectResult` interface — locate the closing `}` of `InspectResult` and add two optional fields BEFORE the closing brace:

```typescript
  publishabilityResults?: PublishabilityResult[];
  publishabilityScore?: PublishabilityScore;
```

- [ ] **Step 3: Verify TypeScript still compiles**

Run: `npx tsc --noEmit`
Expected: no output. If errors, fix before committing.

- [ ] **Step 4: Export new types from `src/lib.ts`**

Modify `src/lib.ts` — extend the existing `export type { ... }` block at lines 6–24 to add:

```typescript
  PublishabilitySeverity,
  PublishabilityCheckId,
  PublishabilityResult,
  PublishabilityCheckContext,
  PublishabilityCheck,
  PublishabilityScore,
```

- [ ] **Step 5: Verify build succeeds**

Run: `npm run build`
Expected: clean compile, `dist/types.d.ts` and `dist/lib.d.ts` updated.

- [ ] **Step 6: Commit**

```bash
git add src/types.ts src/lib.ts
git commit -m "feat(publishability): types — PublishabilityResult, PublishabilityScore, check context (v1.1.0 D0)"
```

---

### Task 0.2: Create `test-fixtures/publishable-server.ts` (clean fixture)

**Files:**
- Create: `test-fixtures/publishable-server.ts`

- [ ] **Step 1: Create test-fixtures/ directory if missing**

Run: `mkdir -p test-fixtures`

- [ ] **Step 2: Write the clean fixture server**

Create `test-fixtures/publishable-server.ts`:

```typescript
#!/usr/bin/env tsx
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  { name: "publishable-fixture", version: "0.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "read_note",
      description: "Read-only. Returns the contents of a single note by id. Does not mutate state.",
      annotations: { readOnlyHint: true },
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Note UUID. Must match pattern ^[0-9a-f-]{36}$. Do not pass file paths or numeric IDs. Example: '6f3b5a4d-90ab-4cdf-8e21-1234567890ab'.",
            pattern: "^[0-9a-f-]{36}$",
          },
        },
        required: ["id"],
        additionalProperties: false,
      },
    },
    {
      name: "create_note",
      description: "Mutating. Writes a new note. Do not use for updates — use update_note instead.",
      annotations: { destructiveHint: false },
      inputSchema: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Note title, 1-200 UTF-8 chars. Cannot be empty. Example: 'Meeting notes 2026-05-18'.",
            minLength: 1,
            maxLength: 200,
          },
          visibility: {
            type: "string",
            description: "Visibility scope.",
            enum: ["private", "team", "public"],
          },
        },
        required: ["title"],
        additionalProperties: false,
      },
    },
    {
      name: "delete_note",
      description: "Mutating. Destructive. Permanently deletes a note. Do not use to archive — use update_note with status='archived' instead. Prefer update_note for soft-delete semantics.",
      annotations: { destructiveHint: true },
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Note UUID to delete. Must be exact match. Do not pass partial IDs or wildcards. Example: '6f3b5a4d-90ab-4cdf-8e21-1234567890ab'.",
            pattern: "^[0-9a-f-]{36}$",
          },
        },
        required: ["id"],
        additionalProperties: false,
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => ({
  content: [{ type: "text", text: `stub: ${req.params.name}` }],
}));

const transport = new StdioServerTransport();
await server.connect(transport);
```

- [ ] **Step 3: Verify fixture compiles**

Run: `npx tsc --noEmit test-fixtures/publishable-server.ts`
Expected: clean. If `tsconfig.json` excludes `test-fixtures/`, run `npx tsc --noEmit --include test-fixtures/publishable-server.ts` (or just don't worry about it — vitest compiles on demand).

- [ ] **Step 4: Smoke-test fixture starts**

Run: `echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-11-25","capabilities":{},"clientInfo":{"name":"test","version":"0"}}}' | timeout 3 npx tsx test-fixtures/publishable-server.ts | head -c 200`
Expected: a JSON-RPC response containing `"protocolVersion"` and `"serverInfo"`.

- [ ] **Step 5: Verify probe sees 3 tools, all clean**

Run: `npx . test "npx tsx test-fixtures/publishable-server.ts" 2>&1 | head -30`
Expected: tools = 3/3 listed (calls may succeed or stub; what matters is that the schema validator does not raise warnings).

- [ ] **Step 6: Commit**

```bash
git add test-fixtures/publishable-server.ts
git commit -m "test(publishability): publishable-server fixture — 3 tools, clean 5-axis schemas (v1.1.0 D0)"
```

---

### Task 0.3: Create `test-fixtures/unpublishable-server.ts` (broken fixture)

**Files:**
- Create: `test-fixtures/unpublishable-server.ts`

- [ ] **Step 1: Write the intentionally-broken fixture server**

Create `test-fixtures/unpublishable-server.ts`:

```typescript
#!/usr/bin/env tsx
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  { name: "unpublishable-fixture", version: "0.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "read_note",
      description: "Read a note.",
      inputSchema: {
        type: "object",
        properties: {
          id: { type: "string", description: "the id" },
        },
        required: ["id"],
      },
    },
    {
      name: "process_record",
      description: "Processes the record.",
      inputSchema: {
        type: "object",
        properties: {
          record: { type: "string", description: "" },
          mode: { type: "string", description: "Must be Text or Blob." },
        },
        required: ["record"],
      },
    },
    {
      name: "run_sql",
      description: "Run SQL.",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "the query" },
        },
        required: ["query"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => ({
  content: [{ type: "text", text: `stub: ${req.params.name}` }],
}));

const transport = new StdioServerTransport();
await server.connect(transport);
```

This fixture is designed to fail all 5 checks:
- `description-five-axis`: all descriptions score <2 axes
- `enum-shape`: `mode` has "Must be Text or Blob" in prose, no `enum` array
- `mutation-legibility`: `process_record` has neither name prefix nor description signal nor annotation
- `distribution-metadata`: will be tested via `--package` against a deliberately-broken package.json in a later task
- `anti-purpose-clause`: `run_sql` (high-blast) has no "do not use for" clause

- [ ] **Step 2: Verify fixture starts**

Run: `echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-11-25","capabilities":{},"clientInfo":{"name":"test","version":"0"}}}' | timeout 3 npx tsx test-fixtures/unpublishable-server.ts | head -c 200`
Expected: JSON-RPC response.

- [ ] **Step 3: Verify probe sees 3 tools + raises schema warnings**

Run: `npx . test "npx tsx test-fixtures/unpublishable-server.ts" 2>&1 | grep -E "(warn|WARN|description)"`
Expected: at least 2 schema warnings raised by existing `schema-validator.ts` (the empty description on `record`, the missing description fragment on `id`).

- [ ] **Step 4: Commit**

```bash
git add test-fixtures/unpublishable-server.ts
git commit -m "test(publishability): unpublishable-server fixture — 3 tools, broken across all 5 axes (v1.1.0 D0)"
```

---

### Task 0.4: Add `test-fixtures/` to `.npmignore`

**Files:**
- Modify: `.npmignore`

- [ ] **Step 1: Verify current .npmignore**

Run: `cat .npmignore`
Note the current content.

- [ ] **Step 2: Append fixture exclusions**

Append to `.npmignore`:

```
test-fixtures/
docs/superpowers/
.playwright-mcp/
```

(The first is the v1.1.0 work; the others harden against accidental publish.)

- [ ] **Step 3: Verify npm pack excludes fixtures**

Run: `npm pack --dry-run 2>&1 | grep -E "test-fixtures|publishable-server"`
Expected: no matches.

- [ ] **Step 4: Commit**

```bash
git add .npmignore
git commit -m "chore(publishability): exclude test-fixtures/ + docs/superpowers/ from npm tarball (v1.1.0 D0)"
```

---

## Day 1 — Tue 2026-05-19

### Task 1.1: Implement `publishability-axes.ts` — axis-detection regex corpus

**Files:**
- Create: `src/publishability-axes.ts`
- Test: `src/publishability-axes.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/publishability-axes.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { scoreDescriptionAxes } from "./publishability-axes.js";

describe("scoreDescriptionAxes", () => {
  it("returns 0 axes for an empty description", () => {
    const out = scoreDescriptionAxes("");
    expect(out.axesPassed).toBe(0);
  });

  it("returns 0 axes for a trivial description", () => {
    const out = scoreDescriptionAxes("the id");
    expect(out.axesPassed).toBe(0);
  });

  it("scores type axis when description mentions a type", () => {
    const out = scoreDescriptionAxes("UTF-8 string");
    expect(out.axes.type).toBe(true);
  });

  it("scores constraints axis when description mentions length/pattern/range", () => {
    const out = scoreDescriptionAxes("Up to 200 characters");
    expect(out.axes.constraints).toBe(true);
  });

  it("scores notAxis (what not to pass) on negative phrasing", () => {
    const out = scoreDescriptionAxes("Do not pass null.");
    expect(out.axes.notAxis).toBe(true);
  });

  it("scores mutation axis on read/write language", () => {
    const out = scoreDescriptionAxes("Mutating. Writes to disk.");
    expect(out.axes.mutation).toBe(true);
  });

  it("scores example axis on 'e.g.' or 'example:'", () => {
    const out = scoreDescriptionAxes("Path. Example: /tmp/x.txt");
    expect(out.axes.example).toBe(true);
  });

  it("scores 5/5 on a full description", () => {
    const out = scoreDescriptionAxes(
      "UTF-8 string, up to 200 chars. Do not pass null. Read-only — only narrows a query. Example: 'Meeting notes'."
    );
    expect(out.axesPassed).toBe(5);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/publishability-axes.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

Create `src/publishability-axes.ts`:

```typescript
export interface AxisScore {
  axes: {
    type: boolean;
    constraints: boolean;
    notAxis: boolean;
    mutation: boolean;
    example: boolean;
  };
  axesPassed: number;
}

const TYPE_TOKENS = /\b(string|number|integer|boolean|array|object|UTF-?8|bytes|JSON|seconds|milliseconds|ms|absolute path|relative path|URL|URI|UUID|UTF8|ASCII|base64|float|decimal|timestamp|date)\b/i;
const CONSTRAINT_TOKENS = /\b(min|max|maxLength|minLength|pattern|range|up to|at most|at least|between|chars?|characters?|bytes?|seconds?|milliseconds?|positive|non-?empty|format)\b/i;
const NOT_TOKENS = /\b(do not|don't|never|avoid|except|must not|cannot|forbidden)\b/i;
const MUTATION_TOKENS = /\b(mutating|read[- ]only|writes? to|modifies?|destructive|side[- ]?effect|deletes?|creates?|inserts?|updates?|removes?|narrows? (?:a )?read)\b/i;
const EXAMPLE_TOKENS = /\b(e\.?g\.?|example|for example|such as)\b/i;

export function scoreDescriptionAxes(description: string): AxisScore {
  const d = description ?? "";
  const axes = {
    type: TYPE_TOKENS.test(d),
    constraints: CONSTRAINT_TOKENS.test(d),
    notAxis: NOT_TOKENS.test(d),
    mutation: MUTATION_TOKENS.test(d),
    example: EXAMPLE_TOKENS.test(d),
  };
  const axesPassed = Object.values(axes).filter(Boolean).length;
  return { axes, axesPassed };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/publishability-axes.test.ts`
Expected: all 8 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/publishability-axes.ts src/publishability-axes.test.ts
git commit -m "feat(publishability): axis-scoring regex corpus + unit tests (v1.1.0 D1)"
```

---

### Task 1.2: Implement `description-five-axis` check

**Files:**
- Create: `src/publishability-checks.ts`
- Test: `src/publishability-checks.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/publishability-checks.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { checkDescriptionFiveAxis } from "./publishability-checks.js";
import type { ToolInfo } from "./types.js";

function makeTool(name: string, desc: string, props: Record<string, { type: string; description: string }>): ToolInfo {
  return {
    name,
    description: desc,
    inputSchema: { type: "object", properties: props },
  };
}

describe("checkDescriptionFiveAxis", () => {
  it("fails on tools with empty descriptions", () => {
    const tools = [makeTool("x", "do something", { p: { type: "string", description: "" } })];
    const out = checkDescriptionFiveAxis(tools);
    expect(out.passed).toBe(false);
  });

  it("fails when global avg axes-passed < 3.0", () => {
    const tools = [
      makeTool("x", "Reads stuff.", { p: { type: "string", description: "the id" } }),
      makeTool("y", "Writes stuff.", { p: { type: "string", description: "the value" } }),
    ];
    const out = checkDescriptionFiveAxis(tools);
    expect(out.passed).toBe(false);
    expect(out.evidence?.axisAvg).toBeLessThan(3.0);
  });

  it("passes (clean) when global avg axes >= 4.0", () => {
    const tools = [
      makeTool(
        "read_note",
        "Read-only. Returns a note by id.",
        {
          id: {
            type: "string",
            description:
              "UUID string. Pattern ^[0-9a-f-]{36}$. Up to 36 characters. Do not pass paths. Example: '6f3b5a4d-90ab-4cdf-8e21-1234567890ab'.",
          },
        }
      ),
    ];
    const out = checkDescriptionFiveAxis(tools);
    expect(out.passed).toBe(true);
    expect(out.evidence?.axisAvg).toBeGreaterThanOrEqual(4.0);
  });

  it("triggers the >=50% per-tool cap when half or more tools score <3.0", () => {
    const tools = [
      makeTool("x", "Reads.", { p: { type: "string", description: "the id" } }),
      makeTool("y", "Writes.", { p: { type: "string", description: "the value" } }),
      makeTool(
        "z",
        "Read-only. Returns a string.",
        {
          q: {
            type: "string",
            description: "UTF-8 string up to 100 chars. Do not pass null. Example: 'foo'.",
          },
        }
      ),
    ];
    const out = checkDescriptionFiveAxis(tools);
    expect(out.passed).toBe(false);
    // 2 of 3 tools (x, y) score <3 → triggers per-tool cap signal
    expect(out.evidence?.failedTools).toContain("x");
    expect(out.evidence?.failedTools).toContain("y");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/publishability-checks.test.ts`
Expected: FAIL — `checkDescriptionFiveAxis` not exported.

- [ ] **Step 3: Write minimal implementation**

Create `src/publishability-checks.ts`:

```typescript
import type { ToolInfo, PublishabilityResult } from "./types.js";
import { scoreDescriptionAxes } from "./publishability-axes.js";

interface ToolScore {
  tool: string;
  axisAvg: number;
  propertyCount: number;
}

function scoreTool(t: ToolInfo): ToolScore {
  const props = t.inputSchema?.properties ?? {};
  const propEntries = Object.entries(props);
  const toolDescScore = scoreDescriptionAxes(t.description ?? "").axesPassed;

  if (propEntries.length === 0) {
    return { tool: t.name, axisAvg: toolDescScore, propertyCount: 0 };
  }

  const propScores = propEntries.map(([_, schema]) => {
    const desc = (schema as { description?: string })?.description ?? "";
    return scoreDescriptionAxes(desc).axesPassed;
  });
  // Tool description contributes one more slot; weight by count
  const all = [toolDescScore, ...propScores];
  const axisAvg = all.reduce((a, b) => a + b, 0) / all.length;
  return { tool: t.name, axisAvg, propertyCount: propEntries.length };
}

export function checkDescriptionFiveAxis(
  tools: ToolInfo[]
): PublishabilityResult {
  const start = Date.now();
  if (tools.length === 0) {
    return {
      check: "description-five-axis",
      passed: true,
      severity: "high",
      title: "Description five-axis coverage",
      message: "No tools to evaluate.",
      durationMs: Date.now() - start,
    };
  }

  const perTool = tools.map(scoreTool);
  const globalAvg =
    perTool.reduce((a, b) => a + b.axisAvg, 0) / perTool.length;
  const failedTools = perTool.filter((p) => p.axisAvg < 3.0).map((p) => p.tool);
  const passed = globalAvg >= 3.0;

  return {
    check: "description-five-axis",
    passed,
    severity: "high",
    title: "Description five-axis coverage",
    message: passed
      ? `Global avg ${globalAvg.toFixed(2)}/5 axes — descriptions ground tool selection.`
      : `Global avg ${globalAvg.toFixed(2)}/5 axes (fail <3.0). ${failedTools.length}/${tools.length} tools below per-tool threshold.`,
    perToolFailures: failedTools.map((t) => ({
      tool: t,
      reason: "per-tool axes avg <3.0",
    })),
    evidence: { axisAvg: globalAvg, failedTools },
    remediation:
      "Per docs/checklist.md §1: each property description should answer (1) value type, (2) constraints, (3) what NOT to pass, (4) mutating-vs-read, (5) example. Aim for ≥4 axes per description.",
    durationMs: Date.now() - start,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/publishability-checks.test.ts`
Expected: all 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/publishability-checks.ts src/publishability-checks.test.ts
git commit -m "feat(publishability): description-five-axis check (v1.1.0 D1)"
```

---

### Task 1.3: Implement `enum-shape` check

**Files:**
- Modify: `src/publishability-checks.ts` (append `checkEnumShape`)
- Modify: `src/publishability-checks.test.ts` (append tests)

- [ ] **Step 1: Append the failing test**

Append to `src/publishability-checks.test.ts`:

```typescript
import { checkEnumShape } from "./publishability-checks.js";

describe("checkEnumShape", () => {
  it("passes when no in-prose enum language exists", () => {
    const tools = [
      makeTool("x", "Reads.", { p: { type: "string", description: "the id" } }),
    ];
    const out = checkEnumShape(tools);
    expect(out.passed).toBe(true);
  });

  it("passes when in-prose enum is matched by schema enum array", () => {
    const tools = [
      {
        name: "x",
        description: "Reads.",
        inputSchema: {
          type: "object" as const,
          properties: {
            mode: {
              type: "string",
              description: "Must be Text or Blob.",
              enum: ["Text", "Blob"],
            },
          },
        },
      },
    ];
    const out = checkEnumShape(tools);
    expect(out.passed).toBe(true);
  });

  it("fails when in-prose enum has no schema enum array", () => {
    const tools = [
      makeTool("x", "Reads.", {
        mode: { type: "string", description: "Must be Text or Blob." },
      }),
    ];
    const out = checkEnumShape(tools);
    expect(out.passed).toBe(false);
  });

  it("ignores 'valid URL' style open-ended phrases", () => {
    const tools = [
      makeTool("x", "Reads.", {
        url: { type: "string", description: "Must be a valid URL." },
      }),
    ];
    const out = checkEnumShape(tools);
    expect(out.passed).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/publishability-checks.test.ts -t "checkEnumShape"`
Expected: FAIL — `checkEnumShape` not exported.

- [ ] **Step 3: Append implementation**

Append to `src/publishability-checks.ts`:

```typescript
const IN_PROSE_ENUM = /\b(must be|either|one of|allowed values?|valid values?)\b.{0,80}(\bor\b|,)/i;
const OPEN_ENDED_ENUM_EXEMPT = /\bvalid\s+(URL|URI|path|email|UUID|date|datetime|hostname|IP)\b/i;

export function checkEnumShape(tools: ToolInfo[]): PublishabilityResult {
  const start = Date.now();
  const failures: Array<{ tool: string; reason: string }> = [];

  for (const tool of tools) {
    const props = (tool.inputSchema?.properties ?? {}) as Record<
      string,
      { type?: string; description?: string; enum?: unknown[] }
    >;
    for (const [propName, schema] of Object.entries(props)) {
      const desc = schema?.description ?? "";
      const hasEnum =
        Array.isArray(schema?.enum) && (schema.enum?.length ?? 0) > 0;
      if (
        schema?.type === "string" &&
        IN_PROSE_ENUM.test(desc) &&
        !OPEN_ENDED_ENUM_EXEMPT.test(desc) &&
        !hasEnum
      ) {
        failures.push({
          tool: tool.name,
          reason: `${propName}: prose mentions enum values but schema has no enum[]`,
        });
      }
    }
  }

  const passed = failures.length === 0;
  return {
    check: "enum-shape",
    passed,
    severity: "medium",
    title: "Enum shape",
    message: passed
      ? "No prose-only enums detected."
      : `${failures.length} properties declare enums in prose but lack schema enum[].`,
    perToolFailures: failures,
    remediation:
      "Per docs/checklist.md §1: declare allowed values as `enum: [...]` on the schema, not just in description prose.",
    durationMs: Date.now() - start,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/publishability-checks.test.ts -t "checkEnumShape"`
Expected: all 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/publishability-checks.ts src/publishability-checks.test.ts
git commit -m "feat(publishability): enum-shape check (v1.1.0 D1)"
```

---

### Task 1.4: Implement `mutation-legibility` check

**Files:**
- Modify: `src/publishability-checks.ts` (append `checkMutationLegibility`)
- Modify: `src/publishability-checks.test.ts` (append tests)

- [ ] **Step 1: Append the failing test**

Append to `src/publishability-checks.test.ts`:

```typescript
import { checkMutationLegibility } from "./publishability-checks.js";

describe("checkMutationLegibility", () => {
  it("passes when tool name prefix discloses read vs mutate", () => {
    const tools = [
      makeTool("read_note", "anything", {}),
      makeTool("create_note", "anything", {}),
      makeTool("delete_note", "anything", {}),
    ];
    const out = checkMutationLegibility(tools);
    expect(out.passed).toBe(true);
  });

  it("passes when tool description signals mutation", () => {
    const tools = [
      makeTool("frobnicate", "Mutating. Writes to disk.", {}),
    ];
    const out = checkMutationLegibility(tools);
    expect(out.passed).toBe(true);
  });

  it("passes when tool has annotations.destructiveHint set", () => {
    const tools = [
      {
        name: "frobnicate",
        description: "anything",
        inputSchema: { type: "object" as const, properties: {} },
        annotations: { destructiveHint: true },
      },
    ];
    const out = checkMutationLegibility(tools);
    expect(out.passed).toBe(true);
  });

  it("fails when >40% of tools have no mutation signal", () => {
    const tools = [
      makeTool("frobnicate", "Does a thing.", {}),
      makeTool("process_record", "Processes it.", {}),
      makeTool("read_note", "Read-only.", {}),
    ];
    // 2 of 3 (66%) have no signal — fails
    const out = checkMutationLegibility(tools);
    expect(out.passed).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/publishability-checks.test.ts -t "checkMutationLegibility"`
Expected: FAIL — `checkMutationLegibility` not exported.

- [ ] **Step 3: Append implementation**

Append to `src/publishability-checks.ts`:

```typescript
const READ_PREFIX = /^(read|list|get|fetch|find|search|stat|describe|count|exists|view|inspect|query)_/i;
const MUTATE_PREFIX = /^(create|update|delete|move|copy|write|append|set|put|patch|merge|remove|drop|truncate|insert|upsert)_/i;
const MUTATION_TOOL_TOKENS = /\b(mutating|read[- ]only|writes? to|modifies?|destructive|side[- ]?effect|deletes?|creates?)\b/i;

function toolHasMutationSignal(tool: ToolInfo): boolean {
  if (READ_PREFIX.test(tool.name) || MUTATE_PREFIX.test(tool.name)) return true;
  if (MUTATION_TOOL_TOKENS.test(tool.description ?? "")) return true;
  if (
    tool.annotations?.destructiveHint !== undefined ||
    tool.annotations?.readOnlyHint !== undefined
  ) {
    return true;
  }
  return false;
}

export function checkMutationLegibility(
  tools: ToolInfo[]
): PublishabilityResult {
  const start = Date.now();
  if (tools.length === 0) {
    return {
      check: "mutation-legibility",
      passed: true,
      severity: "high",
      title: "Mutation legibility",
      message: "No tools to evaluate.",
      durationMs: Date.now() - start,
    };
  }
  const silent = tools.filter((t) => !toolHasMutationSignal(t));
  const silentRatio = silent.length / tools.length;
  const passed = silentRatio <= 0.4;

  return {
    check: "mutation-legibility",
    passed,
    severity: "high",
    title: "Mutation legibility",
    message: passed
      ? `${tools.length - silent.length}/${tools.length} tools disclose mutating-vs-read.`
      : `${silent.length}/${tools.length} tools silent on mutating-vs-read (>40% fails).`,
    perToolFailures: silent.map((t) => ({
      tool: t.name,
      reason: "no name prefix, no description signal, no annotation",
    })),
    evidence: { failedTools: silent.map((t) => t.name) },
    remediation:
      "Per docs/checklist.md §1+§6: surface mutating-vs-read via tool name prefix (read_*, list_*, get_* / create_*, update_*, delete_*), description ('Read-only.' / 'Mutating.'), or annotations.destructiveHint.",
    durationMs: Date.now() - start,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/publishability-checks.test.ts -t "checkMutationLegibility"`
Expected: all 4 tests PASS.

- [ ] **Step 5: Run the full suite to confirm no regressions**

Run: `npx vitest run`
Expected: all existing tests + new tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/publishability-checks.ts src/publishability-checks.test.ts
git commit -m "feat(publishability): mutation-legibility check (v1.1.0 D1)"
```

---

## Day 2 — Wed 2026-05-20

### Task 2.1: Implement `distribution-metadata` check

**Files:**
- Modify: `src/publishability-checks.ts` (append `checkDistributionMetadata`)
- Modify: `src/publishability-checks.test.ts` (append tests)

- [ ] **Step 1: Append the failing test**

Append to `src/publishability-checks.test.ts`:

```typescript
import { checkDistributionMetadata } from "./publishability-checks.js";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

function writeTempPackageJson(content: object): string {
  const dir = mkdtempSync(join(tmpdir(), "mcp-probe-test-"));
  const path = join(dir, "package.json");
  writeFileSync(path, JSON.stringify(content, null, 2));
  return path;
}

describe("checkDistributionMetadata", () => {
  it("returns skipped severity when no path provided", async () => {
    const out = await checkDistributionMetadata(undefined);
    expect(out.passed).toBe(true);
    expect(out.severity).toBe("info");
    expect(out.evidence?.skipped).toBe(true);
  });

  it("passes a fully-formed package.json", async () => {
    const path = writeTempPackageJson({
      name: "my-mcp-server",
      description:
        "MCP server for fetching weather data — supports forecast, alerts, history",
      keywords: ["mcp", "model-context-protocol", "weather", "api"],
      license: "MIT",
      engines: { node: ">=20" },
      repository: { url: "https://github.com/example/weather-mcp" },
    });
    const out = await checkDistributionMetadata(path);
    expect(out.passed).toBe(true);
  });

  it("fails when description is too short", async () => {
    const path = writeTempPackageJson({
      name: "x",
      description: "MCP server",
      keywords: ["mcp", "model-context-protocol", "x", "y"],
      license: "MIT",
      engines: { node: ">=20" },
      repository: { url: "https://github.com/x/y" },
    });
    const out = await checkDistributionMetadata(path);
    expect(out.passed).toBe(false);
  });

  it("fails when keywords missing both mcp tokens", async () => {
    const path = writeTempPackageJson({
      name: "x",
      description:
        "MCP server for fetching weather data — supports forecast, alerts, history",
      keywords: ["weather", "api", "client", "data"],
      license: "MIT",
      engines: { node: ">=20" },
      repository: { url: "https://github.com/x/y" },
    });
    const out = await checkDistributionMetadata(path);
    expect(out.passed).toBe(false);
  });

  it("fails on missing license", async () => {
    const path = writeTempPackageJson({
      name: "x",
      description:
        "MCP server for fetching weather data — supports forecast, alerts, history",
      keywords: ["mcp", "model-context-protocol", "x", "y"],
      engines: { node: ">=20" },
      repository: { url: "https://github.com/x/y" },
    });
    const out = await checkDistributionMetadata(path);
    expect(out.passed).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/publishability-checks.test.ts -t "checkDistributionMetadata"`
Expected: FAIL — `checkDistributionMetadata` not exported.

- [ ] **Step 3: Append implementation**

Append to `src/publishability-checks.ts`:

```typescript
import { readFile } from "node:fs/promises";

const VALID_REPO_HOST = /^(https?:\/\/|git\+https?:\/\/|git@)(github\.com|gitlab\.com|codeberg\.org|bitbucket\.org)/i;

export async function checkDistributionMetadata(
  packageJsonPath: string | undefined
): Promise<PublishabilityResult> {
  const start = Date.now();
  if (!packageJsonPath) {
    return {
      check: "distribution-metadata",
      passed: true,
      severity: "info",
      title: "Distribution metadata",
      message: "Skipped — pass --package <path> to enable.",
      evidence: { skipped: true },
      durationMs: Date.now() - start,
    };
  }

  let pkg: Record<string, unknown>;
  try {
    const raw = await readFile(packageJsonPath, "utf8");
    pkg = JSON.parse(raw);
  } catch (err) {
    return {
      check: "distribution-metadata",
      passed: false,
      severity: "medium",
      title: "Distribution metadata",
      message: `Failed to read ${packageJsonPath}: ${
        err instanceof Error ? err.message : String(err)
      }`,
      durationMs: Date.now() - start,
    };
  }

  const failures: string[] = [];
  const desc = typeof pkg.description === "string" ? pkg.description : "";
  if (desc.length < 40) failures.push("description (<40 chars or missing)");

  const kw = Array.isArray(pkg.keywords)
    ? (pkg.keywords as unknown[]).map(String)
    : [];
  if (kw.length < 4) failures.push("keywords (need at least 4)");
  if (!kw.includes("mcp")) failures.push("keywords (missing 'mcp')");
  if (!kw.includes("model-context-protocol"))
    failures.push("keywords (missing 'model-context-protocol')");

  if (typeof pkg.license !== "string" || pkg.license.length === 0)
    failures.push("license (missing)");

  const engines = pkg.engines as Record<string, string> | undefined;
  if (!engines?.node) failures.push("engines.node (missing)");

  const repo = pkg.repository as { url?: string } | string | undefined;
  const repoUrl =
    typeof repo === "string" ? repo : typeof repo === "object" ? repo?.url : "";
  if (!repoUrl || !VALID_REPO_HOST.test(repoUrl))
    failures.push("repository.url (missing or unsupported host)");

  const passed = failures.length === 0;
  return {
    check: "distribution-metadata",
    passed,
    severity: "medium",
    title: "Distribution metadata",
    message: passed
      ? "package.json passes §5 metadata checks."
      : `${failures.length} metadata issue(s): ${failures.join("; ")}`,
    perToolFailures: failures.map((f) => ({ tool: "package.json", reason: f })),
    remediation:
      "Per docs/checklist.md §5: description ≥40 chars, keywords include both 'mcp' and 'model-context-protocol', SPDX license, engines.node, repository.url.",
    durationMs: Date.now() - start,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/publishability-checks.test.ts -t "checkDistributionMetadata"`
Expected: all 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/publishability-checks.ts src/publishability-checks.test.ts
git commit -m "feat(publishability): distribution-metadata check (v1.1.0 D2)"
```

---

### Task 2.2: Implement `anti-purpose-clause` check

**Files:**
- Modify: `src/publishability-checks.ts` (append `checkAntiPurposeClause`)
- Modify: `src/publishability-checks.test.ts` (append tests)

- [ ] **Step 1: Append the failing test**

Append to `src/publishability-checks.test.ts`:

```typescript
import { checkAntiPurposeClause } from "./publishability-checks.js";

describe("checkAntiPurposeClause", () => {
  it("passes when total tool count <= 2 (rule does not fire)", () => {
    const tools = [
      makeTool("run_sql", "Run SQL.", {}),
      makeTool("read_note", "Read.", {}),
    ];
    const out = checkAntiPurposeClause(tools);
    expect(out.passed).toBe(true);
  });

  it("passes when no high-blast tools exist", () => {
    const tools = [
      makeTool("read_note", "Read.", {}),
      makeTool("list_notes", "List.", {}),
      makeTool("get_note", "Get.", {}),
    ];
    const out = checkAntiPurposeClause(tools);
    expect(out.passed).toBe(true);
  });

  it("passes when all high-blast tools have anti-purpose clauses", () => {
    const tools = [
      makeTool("read_note", "Read.", {}),
      makeTool("run_sql", "Run SQL. Do not use for: schema changes.", {}),
      makeTool("delete_note", "Mutating. Prefer update_note for soft delete.", {}),
    ];
    const out = checkAntiPurposeClause(tools);
    expect(out.passed).toBe(true);
  });

  it("emits warning (still passes) when some high-blast tools lack clause", () => {
    const tools = [
      makeTool("read_note", "Read.", {}),
      makeTool("run_sql", "Run SQL.", {}),
      makeTool("delete_note", "Mutating. Prefer update_note.", {}),
    ];
    const out = checkAntiPurposeClause(tools);
    expect(out.passed).toBe(false);
    expect(out.severity).toBe("low");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/publishability-checks.test.ts -t "checkAntiPurposeClause"`
Expected: FAIL.

- [ ] **Step 3: Append implementation**

Append to `src/publishability-checks.ts`:

```typescript
const HIGH_BLAST_TOOL_NAME = /(sql|query|exec|run|delete|drop|truncate|update|write|put|move|copy|merge|fetch|http|post|insert|upsert|append)/i;
const HIGH_BLAST_PROP_NAME = /^(query|sql|path|filepath|file_path|url|endpoint)$/i;
const ANTI_PURPOSE_TOKENS = /\b(do not use|don't use|avoid using|prefer|instead of|rather than|never call)\b/i;

function isHighBlast(tool: ToolInfo): boolean {
  if (HIGH_BLAST_TOOL_NAME.test(tool.name)) return true;
  const props = tool.inputSchema?.properties ?? {};
  return Object.keys(props).some((n) => HIGH_BLAST_PROP_NAME.test(n));
}

export function checkAntiPurposeClause(tools: ToolInfo[]): PublishabilityResult {
  const start = Date.now();
  if (tools.length <= 2) {
    return {
      check: "anti-purpose-clause",
      passed: true,
      severity: "info",
      title: "Anti-purpose clause coverage",
      message: "Skipped — single-tool or two-tool server (no peer to 'prefer over').",
      durationMs: Date.now() - start,
    };
  }
  const highBlast = tools.filter(isHighBlast);
  if (highBlast.length === 0) {
    return {
      check: "anti-purpose-clause",
      passed: true,
      severity: "info",
      title: "Anti-purpose clause coverage",
      message: "No high-blast tools detected.",
      durationMs: Date.now() - start,
    };
  }
  const missing = highBlast.filter(
    (t) => !ANTI_PURPOSE_TOKENS.test(t.description ?? "")
  );
  const passed = missing.length === 0;
  return {
    check: "anti-purpose-clause",
    passed,
    severity: "low",
    title: "Anti-purpose clause coverage",
    message: passed
      ? `All ${highBlast.length} high-blast tools have anti-purpose clauses.`
      : `${missing.length}/${highBlast.length} high-blast tools missing "do not use for" / "prefer" clauses.`,
    perToolFailures: missing.map((t) => ({
      tool: t.name,
      reason: "high-blast tool without anti-purpose clause",
    })),
    remediation:
      "Per docs/checklist.md §1 (anti-purpose pattern): on tools that can satisfy the same intent as another tool, add 'Do not use for: X' or 'Prefer Y over this'.",
    durationMs: Date.now() - start,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/publishability-checks.test.ts -t "checkAntiPurposeClause"`
Expected: all 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/publishability-checks.ts src/publishability-checks.test.ts
git commit -m "feat(publishability): anti-purpose-clause check (v1.1.0 D2)"
```

---

### Task 2.3: Implement `publishability-runner.ts` (orchestrator)

**Files:**
- Create: `src/publishability-runner.ts`
- Test: `src/publishability-runner.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/publishability-runner.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { runPublishabilitySuite } from "./publishability-runner.js";
import type { InspectResult, ToolInfo } from "./types.js";

function emptyInspectResult(tools: ToolInfo[]): InspectResult {
  return {
    tools,
    resources: [],
    prompts: [],
    toolResults: [],
    resourceResults: [],
    promptResults: [],
    schemaIssues: [],
    complianceIssues: [],
    score: {
      toolsCallable: tools.length,
      toolsTotal: tools.length,
      resourcesReadable: 0,
      resourcesTotal: 0,
      promptsGettable: 0,
      promptsTotal: 0,
      schemaWarnings: 0,
      schemaErrors: 0,
      complianceErrors: 0,
      complianceWarnings: 0,
    },
    durationMs: 0,
  };
}

describe("runPublishabilitySuite", () => {
  it("runs 5 checks and returns 5 results", async () => {
    const result = emptyInspectResult([
      { name: "x", description: "Read.", inputSchema: { type: "object", properties: {} } },
    ]);
    const out = await runPublishabilitySuite({ result, timeout: 30000 });
    expect(out).toHaveLength(5);
    const ids = out.map((r) => r.check).sort();
    expect(ids).toEqual([
      "anti-purpose-clause",
      "description-five-axis",
      "distribution-metadata",
      "enum-shape",
      "mutation-legibility",
    ]);
  });

  it("includes the distribution-metadata as skipped when no --package", async () => {
    const result = emptyInspectResult([
      { name: "x", description: "Read.", inputSchema: { type: "object", properties: {} } },
    ]);
    const out = await runPublishabilitySuite({ result, timeout: 30000 });
    const dist = out.find((r) => r.check === "distribution-metadata")!;
    expect(dist.severity).toBe("info");
    expect(dist.evidence?.skipped).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/publishability-runner.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

Create `src/publishability-runner.ts`:

```typescript
import type {
  PublishabilityCheckContext,
  PublishabilityResult,
} from "./types.js";
import {
  checkDescriptionFiveAxis,
  checkEnumShape,
  checkMutationLegibility,
  checkAntiPurposeClause,
  checkDistributionMetadata,
} from "./publishability-checks.js";

export async function runPublishabilitySuite(
  ctx: PublishabilityCheckContext
): Promise<PublishabilityResult[]> {
  const { tools } = ctx.result;
  return [
    checkDescriptionFiveAxis(tools),
    checkEnumShape(tools),
    checkMutationLegibility(tools),
    await checkDistributionMetadata(ctx.packageJsonPath),
    checkAntiPurposeClause(tools),
  ];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/publishability-runner.test.ts`
Expected: 2 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/publishability-runner.ts src/publishability-runner.test.ts
git commit -m "feat(publishability): runner orchestrates 5 checks (v1.1.0 D2)"
```

---

### Task 2.4: Implement `publishability-scorer.ts` (composite math)

**Files:**
- Create: `src/publishability-scorer.ts`
- Test: `src/publishability-scorer.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/publishability-scorer.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { computeScore } from "./publishability-scorer.js";
import type { InspectResult, PublishabilityResult } from "./types.js";

function baseResult(): InspectResult {
  return {
    tools: [
      { name: "x", inputSchema: { type: "object", properties: { p: { type: "string", description: "..." } } } },
    ],
    resources: [],
    prompts: [],
    toolResults: [{ tool: "x", success: true, durationMs: 1 }],
    resourceResults: [],
    promptResults: [],
    schemaIssues: [],
    complianceIssues: [],
    score: {
      toolsCallable: 1,
      toolsTotal: 1,
      resourcesReadable: 0,
      resourcesTotal: 0,
      promptsGettable: 0,
      promptsTotal: 0,
      schemaWarnings: 0,
      schemaErrors: 0,
      complianceErrors: 0,
      complianceWarnings: 0,
    },
    durationMs: 1,
  };
}

function passResult(check: PublishabilityResult["check"], severity: PublishabilityResult["severity"] = "high"): PublishabilityResult {
  return { check, passed: true, severity, title: check, message: "ok", durationMs: 0 };
}
function failResult(check: PublishabilityResult["check"], severity: PublishabilityResult["severity"] = "high"): PublishabilityResult {
  return { check, passed: false, severity, title: check, message: "fail", durationMs: 0 };
}

describe("computeScore", () => {
  it("returns 100 for a perfectly clean server", () => {
    const r = baseResult();
    r.publishabilityResults = [
      passResult("description-five-axis"),
      passResult("enum-shape", "medium"),
      passResult("mutation-legibility"),
      passResult("distribution-metadata", "info"),
      passResult("anti-purpose-clause", "low"),
    ];
    const s = computeScore(r);
    expect(s.composite).toBe(100);
    expect(s.bandName).toBe("Publishable");
    expect(s.grade).toBe("A");
  });

  it("applies the description-five-axis cap when ≥50% per-tool fail", () => {
    const r = baseResult();
    // 2 of 2 tools below per-tool threshold (100%) triggers cap
    r.tools = [
      { name: "x", inputSchema: { type: "object", properties: { p: { type: "string", description: "the id" } } } },
      { name: "y", inputSchema: { type: "object", properties: { p: { type: "string", description: "the value" } } } },
    ];
    r.score.toolsCallable = 2;
    r.score.toolsTotal = 2;
    r.toolResults = [
      { tool: "x", success: true, durationMs: 1 },
      { tool: "y", success: true, durationMs: 1 },
    ];
    r.publishabilityResults = [
      { ...failResult("description-five-axis"), evidence: { axisAvg: 1.5, failedTools: ["x", "y"] }, perToolFailures: [{ tool: "x", reason: "..." }, { tool: "y", reason: "..." }] },
      passResult("enum-shape", "medium"),
      passResult("mutation-legibility"),
      passResult("distribution-metadata", "info"),
      passResult("anti-purpose-clause", "low"),
    ];
    const s = computeScore(r);
    expect(s.composite).toBeLessThanOrEqual(60);
    expect(s.capsApplied.length).toBeGreaterThan(0);
  });

  it("hard-zeroes when protocol fails to initialize (compliance error)", () => {
    const r = baseResult();
    r.complianceIssues = [{ check: "initialize", message: "Connection failed", severity: "error" }];
    r.score.complianceErrors = 1;
    r.publishabilityResults = [
      passResult("description-five-axis"),
      passResult("enum-shape", "medium"),
      passResult("mutation-legibility"),
      passResult("distribution-metadata", "info"),
      passResult("anti-purpose-clause", "low"),
    ];
    const s = computeScore(r);
    expect(s.byDomain.protocol.hardZero).toBe(true);
    expect(s.composite).toBeLessThanOrEqual(50);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/publishability-scorer.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

Create `src/publishability-scorer.ts`:

```typescript
import type {
  InspectResult,
  PublishabilityScore,
  PublishabilityResult,
  PublishabilityCheckId,
} from "./types.js";

const DEDUCTIONS: Record<PublishabilityCheckId, number> = {
  "description-five-axis": 50,
  "mutation-legibility": 30,
  "enum-shape": 20,
  "distribution-metadata": 20,
  "anti-purpose-clause": 0,
};

function protocolScore(r: InspectResult): { score: number; hardZero: boolean } {
  // Hard zero on compliance errors related to transport/initialize
  const hardZero =
    r.complianceIssues.some(
      (i) =>
        i.severity === "error" &&
        /initialize|transport|connect/i.test(i.check + " " + i.message)
    );
  if (hardZero) return { score: 0, hardZero: true };

  let s = 100;
  s -= r.score.complianceErrors * 25;
  s -= r.score.complianceWarnings * 5;
  return { score: Math.max(s, 0), hardZero: false };
}

function edgeCaseScore(r: InspectResult): { score: number } {
  const toolCallRate =
    r.score.toolsTotal > 0 ? r.score.toolsCallable / r.score.toolsTotal : 1;
  const propertyCount = r.tools.reduce(
    (n, t) => n + Object.keys(t.inputSchema?.properties ?? {}).length,
    0
  );
  const denom = Math.max(Math.min(propertyCount, 50), 1);
  const schemaCleanRate = Math.max(1 - r.score.schemaWarnings / denom, 0);
  const sampleArgsRate = 1.0;
  const sub =
    (0.5 * toolCallRate + 0.3 * schemaCleanRate + 0.2 * sampleArgsRate) * 100;
  return { score: Math.round(sub) };
}

function publishabilityDomainScore(
  results: PublishabilityResult[]
): { score: number; failures: PublishabilityCheckId[] } {
  let s = 100;
  const failures: PublishabilityCheckId[] = [];
  for (const r of results) {
    if (!r.passed && r.severity !== "info") {
      s -= DEDUCTIONS[r.check] ?? 0;
      failures.push(r.check);
    }
  }
  return { score: Math.max(s, 0), failures };
}

function gradeFromComposite(c: number): PublishabilityScore["grade"] {
  if (c >= 85) return "A";
  if (c >= 65) return "B";
  if (c >= 50) return "C";
  if (c >= 40) return "D";
  return "F";
}

function bandFromComposite(c: number): PublishabilityScore["bandName"] {
  if (c >= 85) return "Publishable";
  if (c >= 65) return "Almost";
  if (c >= 40) return "Rough";
  return "Not ready";
}

export function computeScore(result: InspectResult): PublishabilityScore {
  const protocol = protocolScore(result);
  const edge = edgeCaseScore(result);
  const pub = publishabilityDomainScore(result.publishabilityResults ?? []);

  let composite = Math.round(
    protocol.score * 0.35 + edge.score * 0.25 + pub.score * 0.4
  );

  const capsApplied: PublishabilityScore["capsApplied"] = [];

  if (protocol.hardZero) {
    composite = Math.min(composite, 50);
    capsApplied.push({ reason: "protocol hard-zero (initialize/transport failed)", ceiling: 50 });
  }

  // Description-five-axis per-tool cap
  const fiveAxis = (result.publishabilityResults ?? []).find(
    (r) => r.check === "description-five-axis"
  );
  if (fiveAxis && !fiveAxis.passed) {
    const failedTools = fiveAxis.evidence?.failedTools ?? [];
    const total = result.tools.length;
    if (total > 0 && failedTools.length / total >= 0.5) {
      composite = Math.min(composite, 60);
      capsApplied.push({
        reason: "description-five-axis: ≥50% of tools below per-tool axis threshold",
        ceiling: 60,
      });
    }
  }

  const passed = (result.publishabilityResults ?? []).filter(
    (r) => r.passed
  ).length;
  const failed = (result.publishabilityResults ?? []).filter(
    (r) => !r.passed
  ).length;

  return {
    composite,
    grade: gradeFromComposite(composite),
    bandName: bandFromComposite(composite),
    passed,
    failed,
    capsApplied,
    byDomain: {
      protocol,
      edgeCases: edge,
      publishability: pub,
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/publishability-scorer.test.ts`
Expected: 3 tests PASS.

- [ ] **Step 5: Run the full suite**

Run: `npx vitest run`
Expected: all tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/publishability-scorer.ts src/publishability-scorer.test.ts
git commit -m "feat(publishability): scorer — composite, caps, bands, grades (v1.1.0 D2)"
```

---

## Day 3 — Thu 2026-05-21

### Task 3.1: Implement `publishability-printer.ts`

**Files:**
- Create: `src/publishability-printer.ts`
- Test: `src/publishability-printer.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/publishability-printer.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { renderPublishabilityBlock } from "./publishability-printer.js";
import type { PublishabilityResult, PublishabilityScore } from "./types.js";

describe("renderPublishabilityBlock", () => {
  it("renders all 5 checks with pass/fail markers", () => {
    const results: PublishabilityResult[] = [
      { check: "description-five-axis", passed: true, severity: "high", title: "Description five-axis", message: "ok", durationMs: 0 },
      { check: "enum-shape", passed: false, severity: "medium", title: "Enum shape", message: "1 issue", durationMs: 0 },
      { check: "mutation-legibility", passed: true, severity: "high", title: "Mutation", message: "ok", durationMs: 0 },
      { check: "distribution-metadata", passed: true, severity: "info", title: "Distribution", message: "skipped", durationMs: 0 },
      { check: "anti-purpose-clause", passed: true, severity: "low", title: "Anti-purpose", message: "ok", durationMs: 0 },
    ];
    const out = renderPublishabilityBlock(results, false);
    expect(out).toContain("description-five-axis");
    expect(out).toContain("PASS");
    expect(out).toContain("FAIL");
  });

  it("renders the composite score block", () => {
    const score: PublishabilityScore = {
      composite: 78,
      grade: "B",
      bandName: "Almost",
      passed: 4,
      failed: 1,
      capsApplied: [],
      byDomain: {
        protocol: { score: 95, hardZero: false },
        edgeCases: { score: 61 },
        publishability: { score: 75, failures: ["enum-shape"] },
      },
    };
    const out = renderPublishabilityBlock([], false, score);
    expect(out).toContain("Publishability score:");
    expect(out).toContain("78");
    expect(out).toContain("Almost");
  });

  it("renders caps banner when caps fired", () => {
    const score: PublishabilityScore = {
      composite: 60,
      grade: "C",
      bandName: "Rough",
      passed: 3,
      failed: 2,
      capsApplied: [{ reason: "description-five-axis: ≥50% per-tool fail", ceiling: 60 }],
      byDomain: {
        protocol: { score: 100, hardZero: false },
        edgeCases: { score: 22 },
        publishability: { score: 25, failures: ["description-five-axis"] },
      },
    };
    const out = renderPublishabilityBlock([], false, score);
    expect(out).toContain("Caps applied");
    expect(out).toContain("≤60");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/publishability-printer.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

Create `src/publishability-printer.ts`:

```typescript
import chalk from "chalk";
import type { PublishabilityResult, PublishabilityScore } from "./types.js";

function colorByBand(c: number): (s: string) => string {
  if (c >= 85) return chalk.green;
  if (c >= 65) return chalk.yellow;
  if (c >= 40) return chalk.magenta;
  return chalk.red;
}

export function renderPublishabilityBlock(
  results: PublishabilityResult[],
  noColor: boolean,
  score?: PublishabilityScore
): string {
  const C = noColor
    ? { green: (s: string) => s, red: (s: string) => s, yellow: (s: string) => s, dim: (s: string) => s, bold: (s: string) => s }
    : { green: chalk.green, red: chalk.red, yellow: chalk.yellow, dim: chalk.dim, bold: chalk.bold };

  const lines: string[] = [];
  lines.push(C.bold("\n  Publishability\n"));

  for (const r of results) {
    const marker =
      r.severity === "info"
        ? C.dim("SKIP")
        : r.passed
        ? C.green("PASS")
        : C.red("FAIL");
    lines.push(`    ${marker}  ${r.check.padEnd(28)} ${C.dim(r.message)}`);
    if (!r.passed && r.perToolFailures?.length) {
      for (const f of r.perToolFailures.slice(0, 3)) {
        lines.push(`           ${C.dim("→")} ${f.tool}: ${f.reason}`);
      }
      if (r.perToolFailures.length > 3) {
        lines.push(`           ${C.dim(`+${r.perToolFailures.length - 3} more`)}`);
      }
    }
  }

  if (score) {
    const colorize = noColor ? (s: string) => s : colorByBand(score.composite);
    lines.push("");
    lines.push(
      `  Publishability score: ${colorize(`${score.composite} / 100`)}  (${score.bandName}, ${score.grade})`
    );
    lines.push(`    Protocol:           ${score.byDomain.protocol.score} / 100${score.byDomain.protocol.hardZero ? " (hard zero)" : ""}`);
    lines.push(`    Edge cases:         ${score.byDomain.edgeCases.score} / 100`);
    lines.push(`    Publishability:     ${score.byDomain.publishability.score} / 100`);
    if (score.capsApplied.length > 0) {
      lines.push(`  Caps applied:`);
      for (const cap of score.capsApplied) {
        lines.push(`    ${C.yellow(`≤${cap.ceiling}`)}  ${cap.reason}`);
      }
    } else {
      lines.push(`  Caps applied:       none`);
    }
  }

  return lines.join("\n");
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/publishability-printer.test.ts`
Expected: 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/publishability-printer.ts src/publishability-printer.test.ts
git commit -m "feat(publishability): printer renders results + score block + caps banner (v1.1.0 D3)"
```

---

### Task 3.2: Extend `html-reporter.ts` with publishability section

**Files:**
- Modify: `src/html-reporter.ts`

- [ ] **Step 1: Open and inspect existing reporter**

Run: `head -60 src/html-reporter.ts`
Note: identify the function name that generates the report (likely `generateHtmlReport(result: InspectResult): string`).

- [ ] **Step 2: Add `renderPublishabilitySection` and conditionally append it**

In `src/html-reporter.ts`, after the existing main HTML generation block, add a new private function `renderPublishabilitySection(result: InspectResult): string` that returns an empty string if `result.publishabilityResults` is undefined, otherwise renders a `<section class="publishability">` containing:

- Three stacked bar charts (Protocol / Edge / Publishability sub-scores using inline SVG or CSS divs)
- The list of check results with pass/fail labels
- A caps banner if `result.publishabilityScore?.capsApplied.length > 0`

```typescript
// (inside html-reporter.ts — after existing helpers)
function renderPublishabilitySection(result: InspectResult): string {
  const score = result.publishabilityScore;
  const results = result.publishabilityResults;
  if (!score || !results) return "";
  const escapeHtml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const bar = (label: string, value: number) =>
    `<div class="bar-row"><span class="bar-label">${label}</span><div class="bar-track"><div class="bar-fill" style="width: ${value}%"></div></div><span class="bar-value">${value}</span></div>`;
  const caps =
    score.capsApplied.length > 0
      ? `<div class="caps-banner">${score.capsApplied
          .map((c) => `<strong>≤${c.ceiling}</strong>: ${escapeHtml(c.reason)}`)
          .join("<br>")}</div>`
      : "";
  const checkList = results
    .map(
      (r) =>
        `<li class="check ${r.passed ? "pass" : "fail"} sev-${r.severity}"><strong>${escapeHtml(r.check)}</strong> — ${escapeHtml(r.message)}</li>`
    )
    .join("");
  return `
<section class="publishability">
  <h2>Publishability — ${score.composite}/100 (${score.bandName}, ${score.grade})</h2>
  ${caps}
  ${bar("Protocol", score.byDomain.protocol.score)}
  ${bar("Edge cases", score.byDomain.edgeCases.score)}
  ${bar("Publishability", score.byDomain.publishability.score)}
  <ul class="checks">${checkList}</ul>
</section>
<style>
  .publishability { margin-top: 2rem; padding: 1.5rem; border: 1px solid #ddd; border-radius: 8px; }
  .bar-row { display: flex; align-items: center; gap: 0.75rem; margin: 0.25rem 0; }
  .bar-label { width: 8rem; font-family: monospace; }
  .bar-track { flex: 1; height: 0.75rem; background: #f0f0f0; border-radius: 4px; overflow: hidden; }
  .bar-fill { height: 100%; background: #820855; }
  .bar-value { width: 3rem; text-align: right; font-family: monospace; }
  .checks { list-style: none; padding: 0; }
  .check.pass { color: #2a7d2a; }
  .check.fail { color: #c0392b; }
  .caps-banner { padding: 0.5rem 1rem; background: #fff3cd; border-left: 3px solid #f0ad4e; margin: 0.5rem 0; }
</style>
`;
}
```

Then find the line in `generateHtmlReport` that returns the final HTML string and append `${renderPublishabilitySection(result)}` before the closing `</body>` or equivalent.

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 4: Manual smoke test**

Run: `npx . test "npx tsx test-fixtures/publishable-server.ts" --html /tmp/report.html`
(The `--html` flag already exists. Open `/tmp/report.html` — confirm existing HTML still renders. Since `publishabilityResults` is undefined when `--publishability` not set, the new section should be absent.)

- [ ] **Step 5: Commit**

```bash
git add src/html-reporter.ts
git commit -m "feat(publishability): html-reporter optional publishability section (v1.1.0 D3)"
```

---

### Task 3.3: Wire `--publishability` flag + `score` subcommand in `cli.ts`

**Files:**
- Modify: `src/cli.ts`

- [ ] **Step 1: Add new options to the `test` command**

In `src/cli.ts`, locate the `program.command("test")` block. Add these options BEFORE `.action(...)`:

```typescript
  .option("--publishability", "Run publishability suite (5 checks + 0-100 composite)", false)
  .option("--publishability-only", "Run publishability only, skip standard inspection", false)
  .option("--fail-under <score>", "Exit non-zero if publishability composite below threshold (0–100)", "0")
  .option("--package <path>", "Path to package.json for distribution-metadata check (publishability only)", "")
```

Update the `action()` signature to include the new options:

```typescript
    async (
      target: string,
      opts: {
        json: boolean;
        timeout: string;
        html?: string;
        transport?: string;
        header: string[];
        verbose: boolean;
        publishability: boolean;
        publishabilityOnly: boolean;
        failUnder: string;
        package: string;
      }
    ) => {
```

Pass new options into `inspectServer`:

```typescript
        const result = await inspectServer(transport, {
          json: opts.json,
          timeout: parseInt(opts.timeout, 10),
          html: opts.html,
          verbose: opts.verbose,
          publishability: opts.publishability || opts.publishabilityOnly,
          publishabilityOnly: opts.publishabilityOnly,
          packageJsonPath: opts.package || undefined,
        });
```

After the `allPassed` check, add `fail-under` gating:

```typescript
        const failUnder = parseInt(opts.failUnder, 10);
        if (failUnder > 0 && result.publishabilityScore) {
          if (result.publishabilityScore.composite < failUnder) {
            process.exit(1);
          }
        }
```

- [ ] **Step 2: Add the `score` subcommand**

After the existing `test`/`bench`/`watch` blocks in `cli.ts`, add:

```typescript
program
  .command("score")
  .description("Run publishability suite only — shorthand for `test --publishability-only`")
  .argument("<target>", "MCP server target (command or URL)")
  .option("--json", "Output results as JSON", false)
  .option("--timeout <ms>", "Timeout per operation in milliseconds", "30000")
  .option("--html <path>", "Save HTML report to file")
  .option("--package <path>", "Path to package.json for distribution-metadata check", "")
  .option("--fail-under <score>", "Exit non-zero if composite below threshold (0–100)", "0")
  .option("--full", "Also run standard inspection (equivalent to `test --publishability`)", false)
  .option("--transport <kind>", "Force transport: stdio | sse | http")
  .option(
    "--header <header>",
    'Header for remote transports. Repeatable.',
    (value: string, prev: string[] = []) => [...prev, value],
    [] as string[]
  )
  .action(
    async (
      target: string,
      opts: {
        json: boolean;
        timeout: string;
        html?: string;
        package: string;
        failUnder: string;
        full: boolean;
        transport?: string;
        header: string[];
      }
    ) => {
      try {
        if (opts.transport && !["stdio", "sse", "http"].includes(opts.transport)) {
          throw new Error(`Invalid --transport "${opts.transport}".`);
        }
        const spec = parseTarget(target, {
          transport: opts.transport as TransportKind | undefined,
          headers: opts.header,
        });
        const transport = createTransport(spec);
        const result = await inspectServer(transport, {
          json: opts.json,
          timeout: parseInt(opts.timeout, 10),
          html: opts.html,
          publishability: true,
          publishabilityOnly: !opts.full,
          packageJsonPath: opts.package || undefined,
        });
        const failUnder = parseInt(opts.failUnder, 10);
        if (failUnder > 0 && result.publishabilityScore) {
          if (result.publishabilityScore.composite < failUnder) {
            process.exit(1);
          }
        }
      } catch (error) {
        console.error("Error:", error instanceof Error ? error.message : error);
        process.exit(1);
      }
    }
  );
```

- [ ] **Step 3: Verify CLI parses new flags**

Run: `npx . test --help | grep -E "publishability|fail-under|package"`
Expected: 4 lines (one per new option).

Run: `npx . score --help | grep -E "publishability|fail-under|package|full"`
Expected: lines for the score subcommand options.

- [ ] **Step 4: Commit**

```bash
git add src/cli.ts
git commit -m "feat(publishability): CLI flags + score subcommand (v1.1.0 D3)"
```

---

### Task 3.4: Wire runner + scorer into `client.ts` (inspectServer)

**Files:**
- Modify: `src/client.ts`
- Modify: `src/types.ts` (extend `InspectOptions`)

- [ ] **Step 1: Extend `InspectOptions` in `src/types.ts`**

Find the `InspectOptions` interface and add three optional fields:

```typescript
  publishability?: boolean;
  publishabilityOnly?: boolean;
  packageJsonPath?: string;
```

- [ ] **Step 2: Run baseline tests**

Run: `npx vitest run`
Expected: all green (just a type extension; no runtime change yet).

- [ ] **Step 3: Wire the runner + scorer call into `inspectServer`**

In `src/client.ts`, locate the `inspectServer` function. Near the end, after the existing scorecard is computed but before the `printer.printResult(result, ...)` call (or similar — verify line), add:

```typescript
    if (options.publishability) {
      const s = makeSpinner("Running publishability checks...", silent);
      try {
        const { runPublishabilitySuite } = await import("./publishability-runner.js");
        const { computeScore } = await import("./publishability-scorer.js");
        result.publishabilityResults = await runPublishabilitySuite({
          result,
          packageJsonPath: options.packageJsonPath,
          timeout: options.timeout,
        });
        result.publishabilityScore = computeScore(result);
        s.succeed("Publishability checks complete");
      } catch (err) {
        s.fail(
          `Publishability checks failed: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      }
    }
```

If `options.publishabilityOnly` is true, skip the existing tool-call / resource-read / prompt-get loops earlier in the function — wrap them in `if (!options.publishabilityOnly) { ... }`. This is the only mutating change to existing inspection logic.

Then update the printer call site to render the publishability block when present:

```typescript
    if (!options.json && !silent) {
      printResult(result, { verbose: options.verbose });
      if (result.publishabilityResults && result.publishabilityScore) {
        const { renderPublishabilityBlock } = await import("./publishability-printer.js");
        console.log(
          renderPublishabilityBlock(
            result.publishabilityResults,
            false,
            result.publishabilityScore
          )
        );
      }
    }
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 5: End-to-end smoke test against publishable fixture**

Run: `npx . score "npx tsx test-fixtures/publishable-server.ts"`
Expected: scorecard renders, publishability block renders, composite score ≥85, band = "Publishable".

- [ ] **Step 6: End-to-end smoke test against unpublishable fixture**

Run: `npx . score "npx tsx test-fixtures/unpublishable-server.ts"`
Expected: publishability block renders, multiple FAIL markers, composite ≤60, band = "Rough" or "Not ready".

- [ ] **Step 7: Test `--fail-under` exit code**

Run: `npx . score "npx tsx test-fixtures/unpublishable-server.ts" --fail-under 80; echo "exit=$?"`
Expected: `exit=1`.

Run: `npx . score "npx tsx test-fixtures/publishable-server.ts" --fail-under 50; echo "exit=$?"`
Expected: `exit=0`.

- [ ] **Step 8: Test `--package` flag**

Run: `npx . score "npx tsx test-fixtures/publishable-server.ts" --package ./package.json`
Expected: distribution-metadata check runs (PASS), composite includes distribution-metadata domain.

- [ ] **Step 9: Run full test suite**

Run: `npx vitest run`
Expected: all PASS.

- [ ] **Step 10: Commit**

```bash
git add src/client.ts src/types.ts
git commit -m "feat(publishability): wire runner+scorer into inspectServer (v1.1.0 D3)"
```

---

### Task 3.5: Calibrate scorer against 5 existing scorecards

**Files:**
- Test only — sanity-check predictions vs spec §4.6

- [ ] **Step 1: Run --publishability against server-memory**

Run: `npx . score "npx -y @modelcontextprotocol/server-memory" --timeout 60000 2>&1 | grep -E "Publishability score|byDomain|Composite"`
Expected: composite ≈ 91 (predicted in spec). Acceptable range 86–96 (±5).

- [ ] **Step 2: Run --publishability against server-sequential-thinking**

Run: `npx . score "npx -y @modelcontextprotocol/server-sequential-thinking" --timeout 60000 2>&1 | grep -E "Publishability score"`
Expected: composite ≈ 98 (predicted). Acceptable range 93–100.

- [ ] **Step 3: Run --publishability against server-everything**

Run: `npx . score "npx -y @modelcontextprotocol/server-everything" --timeout 60000 2>&1 | grep -E "Publishability score"`
Expected: composite ≈ 87 (predicted). Acceptable range 82–92.

- [ ] **Step 4: Run --publishability against server-filesystem**

Run: `npx . score "npx -y @modelcontextprotocol/server-filesystem /tmp" --timeout 60000 2>&1 | grep -E "Publishability score"`
Expected: composite ≈ 63 (predicted). Acceptable range 58–68.

- [ ] **Step 5: Run --publishability against server-github (legacy)**

If `GITHUB_PERSONAL_ACCESS_TOKEN` is set in env, run:
`GITHUB_PERSONAL_ACCESS_TOKEN=$(gh auth token) npx . score "npx -y @modelcontextprotocol/server-github" --timeout 60000 2>&1 | grep -E "Publishability score|Caps"`
Expected: composite ≤60 with cap applied. Acceptable range 50–60.

- [ ] **Step 6: If any composite is >±5 from prediction, write amendment**

If a composite drifts: create `docs/specs/publishability-score-v1.1.0-amendments.md` and document the actual score + adjusted prediction, then either:
- adjust regex thresholds in `publishability-axes.ts` (rare — only if false-positive rate is provably high), OR
- accept the drift and update spec §4.6 in a separate commit.

No code change if all 5 land within ±5.

- [ ] **Step 7: If calibration is clean, commit a note**

```bash
git commit --allow-empty -m "chore(publishability): D3 calibration verified — all 5 servers within ±5 of spec §4.6 (v1.1.0 D3)"
```

If amendments needed, commit those instead.

---

## Day 4 — Fri 2026-05-22

### Task 4.1: Write 5 publishability scorecards

**Files:**
- Create: `docs/publishability-scorecards/server-everything.txt`
- Create: `docs/publishability-scorecards/server-filesystem.txt`
- Create: `docs/publishability-scorecards/server-github.txt`
- Create: `docs/publishability-scorecards/server-memory.txt`
- Create: `docs/publishability-scorecards/server-sequential-thinking.txt`
- Create: `docs/publishability-scorecards/SUMMARY.md`

- [ ] **Step 1: Create directory**

Run: `mkdir -p docs/publishability-scorecards`

- [ ] **Step 2: Capture each scorecard**

For each server, run and capture to file:

```bash
npx . score "npx -y @modelcontextprotocol/server-memory" --timeout 60000 > docs/publishability-scorecards/server-memory.txt 2>&1

npx . score "npx -y @modelcontextprotocol/server-sequential-thinking" --timeout 60000 > docs/publishability-scorecards/server-sequential-thinking.txt 2>&1

npx . score "npx -y @modelcontextprotocol/server-everything" --timeout 60000 > docs/publishability-scorecards/server-everything.txt 2>&1

npx . score "npx -y @modelcontextprotocol/server-filesystem /tmp" --timeout 60000 > docs/publishability-scorecards/server-filesystem.txt 2>&1

GITHUB_PERSONAL_ACCESS_TOKEN=$(gh auth token 2>/dev/null) npx . score "npx -y @modelcontextprotocol/server-github" --timeout 60000 > docs/publishability-scorecards/server-github.txt 2>&1 || true
```

- [ ] **Step 3: Inspect each output**

Run: `for f in docs/publishability-scorecards/*.txt; do echo "=== $f ==="; grep -E "Publishability score|Caps" "$f"; done`
Expected: each file contains a composite score line. server-github should show "Caps applied".

- [ ] **Step 4: Write SUMMARY.md**

Create `docs/publishability-scorecards/SUMMARY.md`:

```markdown
# Publishability Scorecard Summary — 2026-05-22 (v1.1.0 pre-publish)

## TL;DR

Across the same five official MCP Node servers tested in `docs/scorecards/SUMMARY.md`, the new publishability composite (35% protocol / 25% edge cases / 40% publishability domain) lands in three of four bands. Two servers ship publishable; two are partial; one is capped at "Rough" because over half of its tools have descriptions below the 5-axis threshold.

## Results

| Server | Composite | Band | Notes |
|---|---|---|---|
| `@modelcontextprotocol/server-sequential-thinking` | TBD | TBD | (fill from scorecard) |
| `@modelcontextprotocol/server-memory` | TBD | TBD | |
| `@modelcontextprotocol/server-everything` | TBD | TBD | |
| `@modelcontextprotocol/server-filesystem` | TBD | TBD | |
| `@modelcontextprotocol/server-github` (legacy) | TBD | TBD | Cap applied. |

(Replace TBD with values captured in Step 3 once you read each scorecard.)

## What this measures

These scorecards are the first public output of `mcp-probe score`. They use the canonical 5-axis publishability rubric defined in `docs/checklist.md` §1 + §5 + §6.

These scorecards are **not** install-time security audits. For install-time secrets / sandbox / firewall checks, use [`@stephenywilson/mcp-doctor`](https://www.npmjs.com/package/@stephenywilson/mcp-doctor) (released 2026-05-15) — different lane, different audience (server installer rather than server author).

## Reproduction

```bash
npm install -g @incultnitollc/mcp-probe@1.1.0
mcp-probe score "npx -y @modelcontextprotocol/server-everything"
```

## Methodology

Run on `@incultnitollc/mcp-probe@1.1.0` pre-publish dev build. Default timeout 60s. No fail-under threshold (scorecard-only, not gating).
```

Then manually replace each `TBD` with the actual values from Step 3.

- [ ] **Step 5: Commit**

```bash
git add docs/publishability-scorecards/
git commit -m "docs(publishability): 5 publishability scorecards + SUMMARY (v1.1.0 D4)"
```

---

### Task 4.2: Add weekly self-check workflow

**Files:**
- Create: `.github/workflows/publishability-self-check.yml`

- [ ] **Step 1: Write the workflow file**

Create `.github/workflows/publishability-self-check.yml`:

```yaml
name: publishability-self-check

on:
  schedule:
    - cron: '0 9 * * 1'  # every Monday 09:00 UTC
  workflow_dispatch:

jobs:
  canary:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build

      - name: server-everything canary (composite >= 80)
        run: |
          node dist/cli.js score "npx -y @modelcontextprotocol/server-everything" --fail-under 80
```

- [ ] **Step 2: Verify workflow is well-formed**

Run: `cat .github/workflows/publishability-self-check.yml`
Expected: 16+ lines, well-formed YAML.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/publishability-self-check.yml
git commit -m "ci(publishability): weekly canary against server-everything (v1.1.0 D4)"
```

---

### Task 4.3: Update README.md with v1.1.0 features

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Read existing README sections**

Run: `head -80 README.md`
Note the section structure.

- [ ] **Step 2: Add a new section after the existing CLI section**

Edit `README.md` — find the "## CLI" or "## Quick start" section and add AFTER it:

```markdown
## Publishability score (v1.1.0+)

Get a 0–100 publishability composite — a CI-friendly grade against the 5-axis pre-publish rubric from [`docs/checklist.md`](docs/checklist.md):

```bash
mcp-probe score "npx -y your-mcp-server"
```

Sample output:

```
  Publishability score: 87 / 100  (Publishable, A)
    Protocol:           100 / 100
    Edge cases:         85 / 100
    Publishability:     80 / 100
  Caps applied:         none
```

Gate your CI:

```bash
mcp-probe score "node dist/index.js" --fail-under 70 --package ./package.json
```

The 5 checks: `description-five-axis`, `enum-shape`, `mutation-legibility`, `distribution-metadata`, `anti-purpose-clause`. See [`docs/specs/publishability-score-v1.1.0.md`](docs/specs/publishability-score-v1.1.0.md) for the rubric.

### Not what you wanted?

If you're looking for **install-time security audit** (secrets detection, `.env`/`.ssh` flags, ALLOW/ASK/BLOCK firewall preview), use [`@stephenywilson/mcp-doctor`](https://www.npmjs.com/package/@stephenywilson/mcp-doctor) — different lane, different audience. mcp-probe is for the **server author** before `npm publish`; mcp-doctor is for the **server installer** before adding to Claude Desktop.
```

- [ ] **Step 3: Verify markdown renders**

Run: `head -100 README.md`
Expected: new section reads cleanly.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs(publishability): README v1.1.0 section + mcp-doctor cross-link (v1.1.0 D4)"
```

---

### Task 4.4: Update CHANGELOG.md

**Files:**
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Read existing CHANGELOG**

Run: `cat CHANGELOG.md`

- [ ] **Step 2: Add v1.1.0 entry at top**

Edit `CHANGELOG.md` — add at the top, AFTER the file header:

```markdown
## 1.1.0 — 2026-05-23

### Added
- Publishability suite — 5 static checks (`description-five-axis`, `enum-shape`, `mutation-legibility`, `distribution-metadata`, `anti-purpose-clause`)
- Composite 0–100 score with grade bands: Publishable / Almost / Rough / Not ready
- `--publishability` flag on `test` subcommand (opt-in; default off)
- `--publishability-only` flag — skip standard inspection
- `--fail-under <N>` flag — exit non-zero if composite below threshold
- `--package <path>` flag — score `package.json` distribution metadata
- `score <target>` subcommand — shorthand for `test --publishability-only`
- `score --full` flag — equivalent to `test --publishability`
- HTML report includes publishability section when `--publishability` is set
- JSON output gains optional `publishabilityResults[]` + `publishabilityScore` fields

### Not added (deferred to v1.2+)
- Install-time security audit — see [`@stephenywilson/mcp-doctor`](https://www.npmjs.com/package/@stephenywilson/mcp-doctor)
- Prompt-injection / auth-token-leak / path-traversal runtime checks — drafted in `docs/specs/security-suite-v1.1.0.md` (held)

### Reference
- Spec: `docs/specs/publishability-score-v1.1.0.md`
- 5 scorecards: `docs/publishability-scorecards/`
- Pivot rationale: `memory/decision_security_suite_before_show_hn.md`
```

- [ ] **Step 3: Commit**

```bash
git add CHANGELOG.md
git commit -m "docs(publishability): CHANGELOG 1.1.0 entry (v1.1.0 D4)"
```

---

## Day 5 — Sat 2026-05-23 (SHIP)

### Task 5.1: Pre-publish verification

**Files:**
- (read-only verification)

- [ ] **Step 1: Confirm clean working tree**

Run: `git status`
Expected: only untracked `.claude/` and `.playwright-mcp/` (per repo norm); no uncommitted changes.

- [ ] **Step 2: Confirm full test suite passes**

Run: `npm run build && npm test`
Expected: all tests PASS, no TypeScript errors.

- [ ] **Step 3: Confirm `npm pack --dry-run` excludes fixtures + docs/superpowers**

Run: `npm pack --dry-run 2>&1 | grep -E "test-fixtures|publishability-server|docs/superpowers" || echo "ALL CLEAN"`
Expected: `ALL CLEAN`.

- [ ] **Step 4: Confirm CLI runs from the built dist**

Run: `node dist/cli.js score "npx tsx test-fixtures/publishable-server.ts" 2>&1 | tail -15`
Expected: scorecard + publishability block renders, composite ≥85.

- [ ] **Step 5: Confirm npm whoami**

Run: `npm whoami`
Expected: `incultnitostudiosllc` (the publish account).
If 401: **`!npm login`** in native Terminal (security key flow), then re-run.

---

### Task 5.2: Version bump + publish

**Files:**
- Modify: `package.json` (via `npm version`)

- [ ] **Step 1: Bump version**

Run: `npm version minor -m "1.1.0 — publishability score"`
Expected: `package.json` version bumps `1.0.2` → `1.1.0`, a new commit `1.1.0 — publishability score` is created, tag `v1.1.0` is created.

- [ ] **Step 2: Verify version**

Run: `node -p "require('./package.json').version"`
Expected: `1.1.0`.

- [ ] **Step 3: Publish to npm**

**MUST run in native Terminal.app**, not via Claude `!` (per `feedback_npm_webauthn_publish.md` — `! npm publish` redacts the security-key auth URL):

```bash
cd "/Users/pengspirit/incultnito/Dev/Backend/repos/Month 1 and 2 - MCP Inspect"
npm publish --access public
```

Tap security key when the auth URL prompt appears.

- [ ] **Step 4: Verify registry**

Run: `npm view @incultnitollc/mcp-probe version`
Expected: `1.1.0`.

Run: `npm view @incultnitollc/mcp-probe description`
Expected: keyword-loaded description (existing 1.0.2 string is fine unless updated).

- [ ] **Step 5: Push commits + tags to origin**

Run: `git push origin main --follow-tags`
Expected: HEAD pushed; tag `v1.1.0` pushed.

- [ ] **Step 6: Verify GitHub release page exists (or create one)**

Run: `gh release view v1.1.0 || gh release create v1.1.0 --title "v1.1.0 — publishability score" --notes-file CHANGELOG.md`
Expected: release exists or is created.

---

### Task 5.3: Post-publish memory update

**Files:**
- Modify: `/Users/pengspirit/.claude/projects/-Users-pengspirit-incultnito-Dev-Backend-repos-Month-1-and-2---MCP-Inspect/memory/project_launch.md`

- [ ] **Step 1: Open the launch memory and add a "v1.1.0 SHIPPED" closeout section**

Append to `project_launch.md`:

```markdown
## v1.1.0 SHIPPED — 2026-05-23

`@incultnitollc/mcp-probe@1.1.0` live on npm registry. Publishability suite + 0–100 composite + `score` subcommand + `--fail-under` CI gate.

- Spec: `docs/specs/publishability-score-v1.1.0.md`
- Scorecards: `docs/publishability-scorecards/`
- Commit: <fill with HEAD after publish>
- Tag: v1.1.0

Show HN remains gated on the 5-metric trigger table. v1.1.0 lands the product-depth lever cited in `decision_security_suite_before_show_hn.md`.
```

- [ ] **Step 2: Update MEMORY.md description for project_launch.md**

Bump the `description:` line one-liner to reflect v1.1.0 ship.

---

## Self-Review (writing-plans skill checklist)

**1. Spec coverage:** All sections of `docs/specs/publishability-score-v1.1.0.md` map to tasks above.
- §1 (what publishability means): doc only, no code task needed.
- §2 (5 checks): Tasks 1.2, 1.3, 1.4, 2.1, 2.2.
- §3 (architecture): Tasks 0.1, 3.4, 3.2, 3.3.
- §4 (scorer rubric): Task 2.4.
- §5 (cross-section reconciliations): folded into 2.4's test cases.
- §6 (verification gates): mapped to per-day "End of Day" implied by each Task block.
- §7 (Show HN positioning): docs Task 4.3 (README) + Task 5.3 (memory).
- §8 (out of scope): docs Task 4.4 (CHANGELOG).
- §9 (open questions): #1 confirmed in D0 (vitest in deps), #2 confirmed in D0 server fixture, #3 fully implemented in 1.1, #4 yes scorer is pure, #5 self-check yaml in 4.2, #6 resolved inline in spec §3.3.

**2. Placeholder scan:** Zero TBD/TODO in implementation tasks. The `TBD` markers in Task 4.1 SUMMARY.md template are intentional placeholders the user fills in once scorecards are captured.

**3. Type consistency:** `runPublishabilitySuite` returns `Promise<PublishabilityResult[]>` (defined in Task 0.1, used in Task 2.3 + 3.4). `computeScore` takes `InspectResult`, returns `PublishabilityScore` (defined in Task 0.1, used in Task 2.4 + 3.4). `renderPublishabilityBlock` signature `(results, noColor, score?)` consistent in Task 3.1 + 3.4.

---

**End of plan.**
