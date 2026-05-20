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
