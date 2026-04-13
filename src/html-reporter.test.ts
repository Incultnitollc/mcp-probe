import { describe, it, expect } from "vitest";
import { generateHtmlReport } from "./html-reporter.js";
import type { InspectResult } from "./types.js";

function makeResult(overrides: Partial<InspectResult> = {}): InspectResult {
  return {
    tools: [],
    resources: [],
    prompts: [],
    toolResults: [],
    resourceResults: [],
    promptResults: [],
    schemaIssues: [],
    complianceIssues: [],
    score: { toolsCallable: 0, toolsTotal: 0, resourcesReadable: 0, resourcesTotal: 0, promptsGettable: 0, promptsTotal: 0, schemaWarnings: 0, schemaErrors: 0, complianceErrors: 0, complianceWarnings: 0 },
    durationMs: 100,
    ...overrides,
  };
}

describe("generateHtmlReport", () => {
  it("returns a complete HTML document", () => {
    const html = generateHtmlReport(makeResult());
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("MCP Doctor Report");
    expect(html).toContain("</html>");
  });

  it("shows ALL CHECKS PASSED when all pass", () => {
    const html = generateHtmlReport(makeResult({
      score: { toolsCallable: 1, toolsTotal: 1, resourcesReadable: 0, resourcesTotal: 0, promptsGettable: 0, promptsTotal: 0, schemaWarnings: 0, schemaErrors: 0, complianceErrors: 0, complianceWarnings: 0 },
    }));
    expect(html).toContain("ALL CHECKS PASSED");
  });

  it("shows SOME CHECKS FAILED when some fail", () => {
    const html = generateHtmlReport(makeResult({
      score: { toolsCallable: 0, toolsTotal: 1, resourcesReadable: 0, resourcesTotal: 0, promptsGettable: 0, promptsTotal: 0, schemaWarnings: 0, schemaErrors: 0, complianceErrors: 0, complianceWarnings: 0 },
    }));
    expect(html).toContain("SOME CHECKS FAILED");
  });

  it("includes server name when provided", () => {
    const html = generateHtmlReport(makeResult({ serverName: "test-server" }));
    expect(html).toContain("test-server");
  });

  it("escapes HTML in tool names", () => {
    const html = generateHtmlReport(makeResult({
      tools: [{ name: "<script>alert('xss')</script>", inputSchema: { type: "object" } }],
      toolResults: [{ tool: "<script>alert('xss')</script>", success: true, durationMs: 10 }],
      score: { toolsCallable: 1, toolsTotal: 1, resourcesReadable: 0, resourcesTotal: 0, promptsGettable: 0, promptsTotal: 0, schemaWarnings: 0, schemaErrors: 0, complianceErrors: 0, complianceWarnings: 0 },
    }));
    expect(html).not.toContain("<script>alert");
    expect(html).toContain("&lt;script&gt;");
  });
});
