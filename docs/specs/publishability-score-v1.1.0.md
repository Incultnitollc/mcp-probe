---
title: mcp-probe v1.1.0 — Publishability Score Spec
status: draft
last_revised: 2026-05-18
ship_target: 2026-05-23 (Sat 14:00 TPE)
supersedes: docs/specs/security-suite-v1.1.0.md (held; security lane deferred to v1.2+)
authors: Peng + Claude (Opus 4.7, brainstorming + writing-plans flow)
---

# mcp-probe v1.1.0 — Publishability Score Spec

## Scope

Turn the 7-section `docs/checklist.md` into a machine-checkable 0–100 composite score, ship as `@incultnitollc/mcp-probe@1.1.0` by **Sat 2026-05-23 14:00 TPE**. Audience: server author running `npm publish`. Failure mode addressed: "the schema looks fine to a human, the model can't ground tool selection on it, the install works but the agent picks the wrong tool."

Source of authority for the scope pivot away from security-suite-v1.1.0.md:
- Pivot decision: `memory/decision_security_suite_before_show_hn.md` (revised 2026-05-17)
- Triggering finding: `@stephenywilson/mcp-doctor@0.4.0` (released 2026-05-15) owns the install-time security audit lane with `.env`/`.ssh`/secrets detection + ALLOW/ASK/BLOCK firewall preview. 207 wkly DL, 6-day head start. Different audience (server installer pre-install) — but lane-adjacent enough to make head-on competition the wrong v1.1.0 play.

Out of scope for v1.1.0 (see § 8): install-time security audit, prompt-injection runtime checks, SSRF, CVE/supply-chain, rate-limiting, command-injection fuzzing, OAuth scoping. Security as a domain is deferred to v1.2+; the v1.1.0 composite does **not** include a Security domain.

## Build-phase plan (5 calendar days + ship day = 6)

| Day | Date (TPE) | Work | Gate |
|---|---|---|---|
| D0 | Mon 5/18 | Spec block (this doc) + types append to `src/types.ts` + `test-fixtures/publishable-server.ts` + `test-fixtures/unpublishable-server.ts` | TDD: fixtures load via stdio in vitest, `npm test` green |
| D1 | Tue 5/19 | 3 static checks: `description-five-axis`, `enum-shape`, `mutation-legibility` | each check has `*.test.ts` green on both fixtures (pass on publishable, fail on unpublishable) |
| D2 | Wed 5/20 | `distribution-metadata` + `anti-purpose-clause` + `publishability-scorer.ts` (composite, caps, bands) | re-score 5 existing scorecards in `docs/scorecards/`; predicted ranges land per § 4.6 calibration |
| D3 | Thu 5/21 | `publishability-printer.ts` + `html-reporter.ts` extension + JSON shape + CLI flag (`--publishability`, `--publishability-only`, `--fail-under N`, `--package <path>`) + `score` subcommand | `npx . test --help` shows new flags; `npx . score "node test-fixtures/publishable-server.ts"` runs end-to-end |
| D4 | Fri 5/22 | Self-audit run against all 5 existing servers + capture scores in `docs/publishability-scorecards/` + README banner + CHANGELOG | All 5 scorecards committed; README + CHANGELOG updated |
| D5 | Sat 5/23 | `npm version minor` → 1.1.0, `npm publish` (webauthn — native Terminal per `feedback_npm_webauthn_publish.md`) | `npm view @incultnitollc/mcp-probe version` returns `1.1.0` |

**Slip rule:** if v1.1.0 ships >Sat 5/23, push Show HN from Tue 6/2 to Tue 6/9 rather than ship overstated copy. (Same rule as the held security-suite spec; deadline mechanism unchanged.)

---

## 1. What "publishability" means

A server is **publishable** when:

1. The protocol handshake completes against the packaged tarball (`Protocol` domain).
2. Every advertised tool, resource, and prompt is actually callable (`Edge cases` domain).
3. The schema gives an LLM enough grounding to pick the right tool with the right arguments on the first call (`Publishability` domain — NEW).

Publishability is **not** safety, not security, not performance — those are downstream concerns. Publishability is the contract between schema and tool-selection. Tools that route correctly with vague schemas are exceptions (top-of-distribution agent models, easy domains). Publishability is the floor that lets the median agent succeed.

The 5 checks below correspond to the most-commonly-broken items in the 7-section `docs/checklist.md`. They were chosen by frequency of failure across the 5 existing scorecards (33/63 tools callable, 74 schema warnings total across the 5 servers — almost all traceable to missing descriptions).

---

## 2. The 5 publishability checks

Canonical check IDs — use these names everywhere (code, JSON, CLI output, scorer):

| ID | Severity | Maps to checklist § | Static or dynamic |
|---|---|---|---|
| `description-five-axis` | high | §1 schema hygiene | static |
| `enum-shape` | medium | §1 | static |
| `mutation-legibility` | high | §1 + §6 | static |
| `distribution-metadata` | medium | §5 distribution metadata | static (opt-in via `--package`) |
| `anti-purpose-clause` | low (info / warning only) | §1 | static |

All 5 are static analysis on `tools.list` / `resources.list` / `prompts.list` output (no payload injection, no real-roundtrip vulnerability tests). Test fixtures are in-process MCP servers exposing intentionally-good and intentionally-bad schemas — no network, no real server processes beyond stdio.

### 2.1 `description-five-axis`

- **Checks.** Each `inputSchema.properties[*].description` and each tool description against Mads Hansen's 5-axis parameter contract from `docs/checklist.md` §1.
- **Five axes per description.** (1) value type stated, (2) constraints (range / format / allowed-not-listed-here), (3) what NOT to pass, (4) mutates-vs-narrows-a-read, (5) example when ambiguity likely.
- **Detection.** Score each description 0–5:
  - Axis 1 (type): description mentions `string|number|integer|boolean|array|object|UTF-8|bytes|JSON|seconds|ms|absolute path|relative path|URL|UUID` etc. OR JSON Schema `type` is non-trivial AND description references the type concretely.
  - Axis 2 (constraints): description OR schema declares any of `min|max|maxLength|minLength|pattern|enum|format|examples`.
  - Axis 3 (what NOT): description contains `not|don't|never|avoid|do not|except` near a noun.
  - Axis 4 (mutation-vs-read): description OR `annotations.destructiveHint` OR `annotations.readOnlyHint` OR tool-level statement disambiguates (`"Read-only."`, `"Writes to ..."`, `"Mutating."`).
  - Axis 5 (example): description contains `e.g.|example|for example` OR schema has `examples: []`.
- **Aggregation.** Avg axes-passed across all property descriptions for all tools.
  - **Fail** = avg < 3.0
  - **Pass with warnings** = 3.0 ≤ avg < 4.0
  - **Pass clean** = avg ≥ 4.0
- **Passing fixture example.** Every property has 4+ axes covered. Tool description states mutation-vs-read.
- **Failing fixture example.** `path: { type: "string", description: "the path" }` — 0 axes.
- **False-positive risk.** Highly-narrow tools (one well-named param) may legitimately need less. Mitigation: if a tool has ≤1 properties AND tool-level description scores ≥4, score the tool at the tool level only.
- **Citation.** `docs/checklist.md` §1 (community-contributed by Mads Hansen).

### 2.2 `enum-shape`

- **Checks.** Properties that have allowed-value semantics expressed in prose but no `enum` declaration in schema.
- **Detection.**
  1. For each property description, regex-match patterns suggesting a closed set: `\b(must be|either|one of|allowed values?|valid values?)\b.{0,80}(\bor\b|,)`.
  2. If match AND schema `enum` array is absent (or empty) AND `type === "string"` → fail at the property level.
  3. Multiple in-prose enums = one failure, severity stays medium.
- **Passing.** `resourceType: { type: "string", enum: ["Text", "Blob"], description: "Resource kind." }`
- **Failing.** `resourceType: { type: "string", description: "Must be Text or Blob." }`
- **False-positive risk.** Open-ended "must be a valid URL" style phrases. Mitigation: regex excludes `valid <noun>` constructs where `<noun>` is `URL|URI|path|email|UUID|date`.
- **Citation.** `docs/checklist.md` §1.

### 2.3 `mutation-legibility`

- **Checks.** Every tool surfaces mutating-vs-read intent on at least one of three channels: tool name prefix, tool description, or `annotations.destructiveHint|readOnlyHint`.
- **Detection.**
  1. Compute `mutation_signal` per tool: true if ANY of —
     - tool name starts with `read_|list_|get_|fetch_|find_|search_|stat_|describe_|count_|exists_|view_|inspect_` (read), OR `create_|update_|delete_|move_|copy_|write_|append_|set_|put_|patch_|merge_|remove_|drop_|truncate_|insert_|upsert_` (mutate).
     - tool description contains `\b(mutating|read-only|writes to|modifies|destructive|side[- ]?effect|deletes?|creates?)\b`.
     - `annotations.destructiveHint === true OR false` OR `annotations.readOnlyHint === true OR false` (explicitly set).
  2. If `mutation_signal === false` → fail at the tool level.
  3. Per-tool, not domain-wide: count failed tools / total tools.
  4. **Fail** if >40% of tools lack mutation signal. **Pass with warnings** if 10–40%. **Pass clean** if <10%.
- **Passing.** Tool `delete_file` with `annotations.destructiveHint: true`.
- **Failing.** Tool `process_record` with description "Processes the record." and no annotations.
- **False-positive risk.** Generic verbs (`run_*`, `execute_*`) — mitigated by description-level scan AND annotation-level fallback.
- **Citation.** `docs/checklist.md` §1 + §6.

### 2.4 `distribution-metadata`

- **Checks.** If `--package <path>` provided, validate `package.json` against §5 of the checklist.
- **Detection.** All must pass:
  - `description` field exists, ≥40 chars, not the npm default boilerplate.
  - `keywords` contains BOTH `mcp` AND `model-context-protocol`.
  - `keywords.length >= 4`.
  - `license` is set and is a SPDX identifier.
  - `engines.node` is set and is a valid semver range.
  - `repository.url` is non-empty and resolves to a public git URL (`github.com|gitlab.com|codeberg.org|bitbucket.org`).
  - `bin` is set if the server is a CLI; absent if not. (Detect via presence of a `cli`-named entrypoint or `bin` field directly.)
- **If `--package` is NOT provided.** Check is skipped (severity `info`, message `"distribution-metadata: skipped (pass --package <path> to enable)"`). Does NOT count toward composite.
- **Passing.** `package.json` with description, keywords incl. both `mcp` and `model-context-protocol`, MIT license, `"engines": {"node": ">=20"}`, repository URL.
- **Failing.** Any single missing or malformed field.
- **False-positive risk.** Private packages, non-npm distribution. Mitigation: explicit opt-in via `--package` flag; absent → skip, no penalty.
- **Citation.** `docs/checklist.md` §5.

### 2.5 `anti-purpose-clause`

- **Checks.** High-blast tools (mutating + DB/FS/HTTP-shaped) state a "do not use for" or "prefer X over Y" clause in their description.
- **Detection.**
  1. **Heuristic — high-blast tool.** Match on tool name regex `/(sql|query|exec|run|delete|drop|truncate|update|write|put|move|copy|merge|fetch|http|post)/i` OR tool has any property named `query|sql|path|filepath|url|endpoint`.
  2. For each matched tool, scan description for at least one of: `\b(do not use|don't use|avoid using|prefer|instead of|rather than|never call)\b`.
  3. **Fail** if 0/N matched tools have the clause. **Pass with warnings** if 1+ but not all. **Pass clean** if all matched tools have the clause OR no matched tools exist.
  4. **Severity = warning only.** Does NOT gate composite. Surfaces as advisory in `publishability-printer.ts` output.
- **Passing.** `run_sql` description includes `"Do not use for: schema changes, raw production tables, exports, or questions answerable from cached reports."`
- **Failing.** Same tool with no negative-scope language.
- **False-positive risk.** Single-tool servers (no peer to "prefer over"). Mitigation: rule does not fire if total tool count ≤ 2.
- **Citation.** `docs/checklist.md` §1 (community-contributed by Mads Hansen — anti-purpose pattern).

---

## 3. Architecture & integration

### 3.1 File layout — flat, matches existing grain

```
src/
  publishability-runner.ts         # orchestrator — runs all 5 checks, returns PublishabilityResult[]
  publishability-runner.test.ts
  publishability-checks.ts         # the 5 check implementations as pure functions over InspectResult
  publishability-checks.test.ts
  publishability-scorer.ts         # composite math, bands, caps
  publishability-scorer.test.ts
  publishability-printer.ts        # CLI rendering (printer.ts stays untouched)
  publishability-printer.test.ts
test-fixtures/
  publishable-server.ts            # in-process MCP server with clean schemas across all 5 axes
  unpublishable-server.ts          # in-process MCP server with intentionally-broken schemas
```

`test-fixtures/` lives at repo root so it's outside the published tarball (`files: ["dist", "LICENSE", "README.md"]` already excludes).

### 3.2 Public interface — additive to `src/types.ts`

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
  evidence?: { axisAvg?: number; failedTools?: string[]; metadataField?: string };
  remediation?: string;
  durationMs: number;
}

export interface PublishabilityCheckContext {
  result: InspectResult;       // pre-populated by main inspection
  packageJsonPath?: string;    // if --package <path> set
  timeout: number;
}

export interface PublishabilityCheck {
  id: PublishabilityCheckId;
  title: string;
  defaultSeverity: PublishabilitySeverity;
  run(ctx: PublishabilityCheckContext): Promise<PublishabilityResult>;
}

export interface PublishabilityScore {
  composite: number;        // 0–100
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

`InspectResult` gains two optional fields (backwards-compatible):

```typescript
export interface InspectResult {
  // ...existing unchanged...
  publishabilityResults?: PublishabilityResult[];   // present when --publishability set
  publishabilityScore?: PublishabilityScore;
}
```

### 3.3 Runner integration — opt-in `--publishability` flag + `score` subcommand

```typescript
// cli.ts (excerpt)
program
  .command("test")
  // ...existing options...
  .option("--publishability", "Run publishability suite (5 checks + composite)", false)
  .option("--publishability-only", "Run publishability only, skip standard inspection", false)
  .option("--fail-under <score>", "Exit non-zero if composite below threshold (0–100)", "0")
  .option("--package <path>", "Path to package.json for distribution-metadata check", "");

program
  .command("score <target>")
  .description("Run publishability suite only — shorthand for `test --publishability-only`")
  .option("--full", "Also run standard inspection (equivalent to `test --publishability`)", false)
  .option("--package <path>", "Path to package.json for distribution-metadata check", "")
  .option("--fail-under <score>", "Exit non-zero if composite below threshold (0–100)", "0")
  // ...maps to same runner; --full flips publishabilityOnly to false...
```

```typescript
// client.ts — after standard inspection, opt-in:
if (options.publishability) {
  const s = makeSpinner("Running publishability checks...", silent);
  const { runPublishabilitySuite } = await import("./publishability-runner.js");
  result.publishabilityResults = await runPublishabilitySuite({
    result,
    packageJsonPath: options.package || undefined,
    timeout: options.timeout
  });
  const { computeScore } = await import("./publishability-scorer.js");
  result.publishabilityScore = computeScore(result);  // takes full InspectResult — needs all 3 domains
  s?.succeed();
}
```

Dynamic `import()` keeps cold-start cost zero for users not running `--publishability`.

### 3.4 Result merging

- **CLI text.** `publishability-printer.ts` renders a separate "Publishability" block + score block after the existing scorecard. `printer.ts` stays byte-identical (snapshot tests safe).
- **HTML.** `html-reporter.ts` gains opt-in `renderPublishabilitySection(result)` block, appended after scorecard div. Existing HTML output unchanged when `publishabilityResults` undefined.
- **JSON.** `--json` already serializes `InspectResult`. New optional fields are purely additive.
- **Existing `docs/scorecards/*.txt`.** Stay unscored — frozen as v1.0.2 snapshots. New v1.1.0 outputs land in `docs/publishability-scorecards/` to avoid confusing the citation log.

### 3.5 Defaults — opt-in for v1.1.0, flip default in v1.2.0

Most published MCP servers fail at least `description-five-axis` on first run. Auto-running would break every downstream CI that consumes mcp-probe today, including the consumers cited in the dev.to load-bearing-description article series. Don't trigger a silent ecosystem-wide regression.

v1.2.0 flips default to on after a 4-week deprecation window + README banner.

### 3.6 Exit-code semantics

- `--publishability` failure does NOT affect exit code unless `--fail-under <N>` is set.
- With `--fail-under 70`: composite <70 → `process.exit(1)`.
- `prepublishOnly` for mcp-probe itself stays `npm run build && npm test`. The publishability suite does NOT gate mcp-probe's own publish (mcp-probe is a CLI, not a server — the suite would N/A on itself).

### 3.7 Test fixtures — first full-loop integration tests in the repo

`client.test.ts` doesn't spin up a real MCP server today. For publishability we need real `tools.list` roundtrips. Plan:

- `test-fixtures/publishable-server.ts` — real MCP server using `@modelcontextprotocol/sdk/server` with clean schemas across all 5 axes. ~3 tools across read/write/list.
- `test-fixtures/unpublishable-server.ts` — same shape, schemas intentionally broken: empty descriptions, in-prose enums, no mutation signal, no anti-purpose clauses.
- `publishability-runner.test.ts` spawns each via stdio (reusing `createTransport` from `transport.ts`) and asserts `unpublishable` fails 4/5 (`distribution-metadata` skipped without `--package`), `publishable` passes 4/5.

Cost: ~200–300ms per integration test in vitest. Acceptable.

### 3.8 CI

- `npm test` runs all vitest files including `publishability-*.test.ts` (+ ~2s budget).
- `prepublishOnly` unchanged; the new tests gate publish by virtue of being in `npm test`.
- Add `.github/workflows/publishability-self-check.yml` weekly run: `npx . score "npx -y @modelcontextprotocol/server-everything" --fail-under 80`. Catches upstream MCP SDK regressions surfacing as false-positives.

---

## 4. 0–100 composite score rubric

### 4.1 Domain weights — 35/25/40

| Domain | Weight | Rationale |
|---|---|---|
| Protocol conformance | 35% | Spec misses usually surface as warnings, not breakers. Hard-zero only when transport fails to initialize. |
| Edge cases | 25% | Existing `schema-validator` + `sample-args` measures this. Reduced from 30% to avoid double-counting schema warnings with publishability checks. |
| Publishability | 40% | Bumped from 30%. `description-five-axis` failure is unrecoverable for an agent picking tools blind; one critical publishability finding shouldn't be drowned by 99 passing spec checks. |

### 4.2 Within-domain scoring

**Protocol (0–100):**
```
if (transport_fails || initialize_fails) return 0   # hard zero — unusable
sub = 100
sub -= spec_checker.errors   * 25
sub -= spec_checker.warnings * 5
sub -= capabilities_mismatch ? 15 : 0   # claims tools but lists 0
return max(sub, 0)
```

**Edge cases (0–100):**
```
tool_call_rate    = tools_callable / tools_listed             # weight 0.5
schema_clean_rate = 1 - (warnings / min(property_count, 50))  # weight 0.3, floor 0
sample_args_rate  = sample_passes / sample_total              # weight 0.2, default 1.0 if no fixtures
sub = (0.5*tool_call_rate + 0.3*schema_clean_rate + 0.2*sample_args_rate) * 100
```
`schema_clean_rate` normalizes against property count, capped at 50 (anti-gaming — see §4.7).

**Publishability (0–100):**

| Check | Severity | Deduction if failed |
|---|---|---|
| `description-five-axis` | high | −50 |
| `mutation-legibility` | high | −30 |
| `enum-shape` | medium | −20 |
| `distribution-metadata` | medium | −20 (skipped if `--package` not set; no deduction) |
| `anti-purpose-clause` | low | −0 (warning only — does not gate composite) |

```
sub = 100
for check in publishability_checks:
  if check.failed and check.severity != "info":
    sub -= check.deduction
return max(sub, 0)
```

### 4.3 Composite caps (single-finding ceilings)

| Cap | Trigger | Reason |
|---|---|---|
| Composite ≤ 50 | Protocol hard-zero (`transport_fails || initialize_fails`) | Unusable. Doesn't matter what the rest looks like. |
| Composite ≤ 60 | `description-five-axis` fails (global avg <3.0) AND ≥50% of *individual tools* have a per-tool description-axis avg <3.0 | The schema isn't grounding tool selection. Agent will pick wrong tools regardless of how well the rest is done. Per-tool computation: for each tool, average its own properties' axis scores; count tools with avg <3.0; trigger if that count ≥50% of total tools. |

No cap for `mutation-legibility`, `enum-shape`, `distribution-metadata`, `anti-purpose-clause` — they flow through the 40% publishability weight, which alone makes a single high-severity finding ≈ −12 composite.

### 4.4 Grade bands

| Range | Band | Meaning |
|---|---|---|
| 85–100 | **Publishable** | Ship it. Median agent will succeed. |
| 65–84 | **Almost** | One axis fix away. Probably descriptions or enum shape. |
| 40–64 | **Rough** | Multiple sections need work. Will frustrate users. |
| 0–39 | **Not ready** | Don't publish. Run mcp-probe locally and fix before tagging. |

Grade letters (also shipped): A=85+, B=65–84, C=50–64, D=40–49, F=<40.

### 4.5 Reporting format

**CLI text** (after existing Health Check Score block):
```
  Publishability score: 78 / 100  (Almost)
    Protocol:           95 / 100
    Edge cases:         61 / 100
    Publishability:     75 / 100
  Caps applied:         none
```
Chalk colors: green ≥85, yellow 65–84, magenta 40–64, red <40.

**HTML reporter** — quarter-arc gauge for composite + three stacked bars for sub-scores. Caps banner above gauge if any fired.

**JSON output** — new top-level `score` object, additive:
```json
{
  "score": {
    "composite": 78,
    "band": "almost",
    "grade": "B",
    "domains": {
      "protocol":      { "score": 95, "hard_zero": false },
      "edge_cases":    { "score": 61 },
      "publishability":{ "score": 75, "failures": ["enum-shape"] }
    },
    "caps_applied": []
  }
}
```

### 4.6 Calibration — predicted scores for 5 existing servers

Publishability scored against current schema state (estimated from existing scorecards):

| Server | Protocol | Edge | Publishability | Composite | Band |
|---|---|---|---|---|---|
| `server-memory` (9/9, 4 warns) | 100 | ~88 | ~85 (mostly clean descriptions; mutation legibility good) | **91** | Publishable |
| `server-sequential-thinking` (1/1, 0 warns) | 100 | 100 | ~95 | **98** | Publishable |
| `server-everything` (12/13, 1 warn, 7/7 res, 3/4 prompts) | 100 | ~85 | ~80 (one missing-description property caught) | **87** | Publishable |
| `server-filesystem` (8/14, 18 warns ≈ 18 props) | 100 | ~50 | ~50 (description-five-axis fails on ~50% of props; mutation-legibility passes on naming conventions) | **63** | Rough |
| `server-github` (3/26, 51 warns) | 100 | ~22 | ~25 (description-five-axis fails on most properties + ≥50% per-tool cap trigger) | **≤60 (capped)** | Rough |

`server-github` natural composite math: `100*0.35 + 22*0.25 + 25*0.40 = 35 + 5.5 + 10 = 50.5`. The §4.3 cap (composite ≤ 60) does NOT pull this down — 50.5 is already below the ceiling. The cap exists to defend against the inverse failure mode: a server with clean protocol + clean edge cases + broken descriptions could otherwise compute to `100*0.35 + 100*0.25 + 25*0.40 = 70`, which the ≤60 cap correctly pulls down. server-github lands in the "Rough" band on natural math alone; the cap is dormant.

Internal axis pattern holds: `everything ≥ filesystem ≥ github` on publishability sub-score (80 > 50 > 25).

### 4.7 Anti-gaming

| Vector | Exposed? | Mitigation |
|---|---|---|
| Empty descriptions pass length checks | No — `description-five-axis` measures semantic axes, not length. | Already mitigated. |
| Adding boilerplate "Mutates: false" to every tool to pass `mutation-legibility` | Yes — string-match is trivial to game. | `mutation-legibility` requires the disambiguation to match the tool name family OR be an actual `annotations` field — boilerplate text without semantic alignment fails. |
| Adding 200 trivial tools to dilute warning ratio | Yes — more properties = more denominators. | `schema_clean_rate` normalizes against `min(property_count, 50)`. |
| Adding `enum: []` to every property to pass `enum-shape` | No — `enum-shape` only fires when in-prose enum language is detected; adding empty enum arrays produces a different warning class. | Already mitigated. |
| `--package` flag passed to wrong file to game `distribution-metadata` | Possible. | Read `name` field from package.json and warn if it doesn't match the running CLI binary (loose match — not a hard gate). |

---

## 5. Cross-section reconciliations (gotchas resolved)

1. **Check ID naming.** Canonical IDs are short kebab-case (`description-five-axis`, not `mads-hansen-five-axis-parameter-contract`). Code must use canonical IDs.
2. **`description-five-axis` deduction (−50) > sub-score weight (40%).** Intentional — a clean publishability domain can absorb other findings, but description-five-axis failure alone drives sub-score below 50, then the §4.3 cap drags composite to ≤60.
3. **Test fixtures in `test-fixtures/` (root) not `src/test-fixtures/`.** Root placement keeps fixtures outside the published npm tarball without touching `package.json#files`.
4. **`PublishabilityScore.grade` (A–F) vs `bandName` (Publishable/Almost/Rough/Not ready).** Both ship — A–F for at-a-glance, band names for UI copy. Grade letters map: A=85+, B=65–84, C=50–64, D=40–49, F=<40. (Grade boundaries diverge slightly from band ranges by design — A maps to Publishable exactly, but B-C-D split Almost+Rough for finer downstream filtering.)
5. **`anti-purpose-clause` severity = info / warning only.** Confirmed — does not gate composite. Surfaces as advisory only. (Avoid penalizing solo-tool servers and edge-case domains where no peer tool exists to "prefer over".)
6. **Why no Security domain at all in v1.1.0.** Per the 5/17 pivot (`memory/decision_security_suite_before_show_hn.md` and `memory/project_wk3_sweep_findings.md`), `@stephenywilson/mcp-doctor@0.4.0` owns the install-time security audit lane. Adding a Security domain to v1.1.0 risks framing-collision with mcp-doctor + delays ship past 5/23. Security is a v1.2+ decision after Show HN lands.

---

## 6. Verification gates

- **D0 gate (Mon 5/18):** test-fixtures load via stdio, `npm test` green.
- **D1 gate (Tue 5/19):** 3 static checks fail on unpublishable fixture, pass on publishable fixture.
- **D2 gate (Wed 5/20):** all 5 checks (counting `distribution-metadata` as skipped without `--package`) wired up; scorer applied to existing 5 scorecards lands within ±5 of predicted ranges in §4.6.
- **D3 gate (Thu 5/21):** full output renders cleanly in CLI, HTML, and JSON. `score` subcommand works end-to-end.
- **D4 gate (Fri 5/22):** real publishability-scorecards committed for all 5 existing servers + README banner + CHANGELOG entry.
- **D5 gate (Sat 5/23):** `@incultnitollc/mcp-probe@1.1.0` live on npm registry.

If any gate slips by >1 day, escalate: trade scope (drop `anti-purpose-clause` first — it's warning-only and lowest-severity) before sliding deadline. If 2+ gates slip, push Show HN to 2026-06-09 per `memory/decision_security_suite_before_show_hn.md`.

---

## 7. Show HN positioning (after ship)

The v1.1.0 ship makes Show HN copy honest:

- **Pre-1.1.0 copy:** "mcp-probe — fast pre-publish CLI for MCP servers"
- **Post-1.1.0 copy:** "mcp-probe — pre-publish CLI for MCP servers. Scores your schema against the 5-axis publishability rubric the community settled on. Fails CI if your descriptions don't ground tool selection."

The 5-axis framing is already community-validated (Mads Hansen × 2 contributions, dev.to article series, checklist Section 1). Show HN inherits that validation rather than introducing it.

Complementary positioning to `@stephenywilson/mcp-doctor` made explicit in README:

> mcp-probe is the **pre-publish** CLI — run it before `npm publish` to make sure your schema actually grounds tool selection. mcp-doctor is the **pre-install** CLI — run it before adding an MCP server to your Claude Desktop config to flag install-time security risks. Use both.

---

## 8. Out of scope for v1.1.0

Deferred to keep v1.1.0 shippable by 2026-05-23:

1. **Install-time security audit.** `.env`/`.ssh`/secrets detection, ALLOW/ASK/BLOCK firewall — owned by `@stephenywilson/mcp-doctor@0.4.0`+ since 5/15. mcp-probe does not enter this lane in v1.1.
2. **Prompt-injection runtime checks.** Drafted in `docs/specs/security-suite-v1.1.0.md` § 2.1. Held — would require LLM-in-the-loop testing or substantial fixture infrastructure.
3. **Auth-token leak / response scanning.** Held in security-suite spec § 2.4. Substantial dynamic instrumentation cost; mcp-doctor's secrets-detection is upstream of this.
4. **Path-traversal / unbounded-resource-read fuzzing.** Held in security-suite spec § 2.3, 2.5. Same dynamic-cost reason.
5. **Schema-poisoning (sensitive-token in descriptions).** Held in security-suite spec § 2.2. Adjacent to mcp-doctor's secrets-detection lane.
6. **SSRF / supply-chain CVEs / rate-limiting / OAuth scoping / command-injection fuzzing.** Held per the original security-suite spec § 7.

Total checks in v1.1.0: **5** (publishability domain only). Scope locked. **Security domain returns in v1.2+ — TBD after Show HN.**

---

## 9. Open questions for build phase

1. Vitest is confirmed in `package.json` (`devDependencies.vitest: ^3.2.4`). No adjustment needed.
2. `@modelcontextprotocol/sdk` Server import path for test fixtures — verify `server/index.js` vs `server/stdio.js` mapping at D0.
3. `description-five-axis` axis-detection regex set is the load-bearing implementation detail. D1 should commit the regex corpus as `src/publishability-axes.ts` with unit tests per regex BEFORE wiring into the runner.
4. Should `publishability-scorer.ts` be pure (data → data) or own the chalk-coloring decision? Architecture says pure; printer owns chalk.
5. CI weekly self-check workflow — does `--fail-under 80` make sense for `server-everything` as the canary? Calibrate during D4 self-audit. (`server-everything` predicted at 87 above — 80 is a safe canary floor.)
6. ~~Should the `score` subcommand alias `test --publishability` exactly, or shorthand to `test --publishability-only`?~~ **Resolved:** `score <target>` shorthand to `test --publishability-only` (skip standard inspection, fastest path to a composite); `score <target> --full` flag layers standard inspection on top. Documented in §3.3.

---

**End of spec.** Build phase begins D0 = Mon 2026-05-18. Spec is the contract — deviations during build go in a follow-up `docs/specs/publishability-score-v1.1.0-amendments.md` rather than editing this file in place.
