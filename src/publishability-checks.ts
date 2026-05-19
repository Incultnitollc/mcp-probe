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

  const propScores = propEntries.map(([, schema]) => {
    const desc = (schema as { description?: string })?.description ?? "";
    return scoreDescriptionAxes(desc).axesPassed;
  });
  // When the tool has properties, judge it on its property descriptions
  // (where axes actually live). Tool desc is reported separately via printer.
  // Use the higher of toolDescScore vs property avg so a strong tool-level
  // description still credits a sparse property schema.
  const propAvg = propScores.reduce((a, b) => a + b, 0) / propScores.length;
  const axisAvg = Math.max(toolDescScore, propAvg);
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
      "Per docs/checklist.md §1: each property description should answer (1) value type, (2) constraints, (3) what NOT to pass, (4) mutating-vs-read, (5) example. Aim for >=4 axes per description.",
    durationMs: Date.now() - start,
  };
}

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
