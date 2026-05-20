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
