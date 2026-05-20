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
    const out = renderPublishabilityBlock(results, true);
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
    const out = renderPublishabilityBlock([], true, score);
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
    const out = renderPublishabilityBlock([], true, score);
    expect(out).toContain("Caps applied");
    expect(out).toContain("≤60");
  });
});
