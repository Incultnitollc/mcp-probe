import { describe, it, expect } from "vitest";
import { checkDescriptionFiveAxis } from "./publishability-checks.js";
import type { ToolInfo } from "./types.js";

function makeTool(
  name: string,
  desc: string,
  props: Record<string, { type: string; description: string }>
): ToolInfo {
  return {
    name,
    description: desc,
    inputSchema: { type: "object", properties: props },
  };
}

describe("checkDescriptionFiveAxis", () => {
  it("fails on tools with empty descriptions", () => {
    const tools = [
      makeTool("x", "do something", { p: { type: "string", description: "" } }),
    ];
    const out = checkDescriptionFiveAxis(tools);
    expect(out.passed).toBe(false);
  });

  it("fails when global avg axes-passed < 3.0", () => {
    const tools = [
      makeTool("x", "Reads stuff.", {
        p: { type: "string", description: "the id" },
      }),
      makeTool("y", "Writes stuff.", {
        p: { type: "string", description: "the value" },
      }),
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
      makeTool("x", "Reads.", {
        p: { type: "string", description: "the id" },
      }),
      makeTool("y", "Writes.", {
        p: { type: "string", description: "the value" },
      }),
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
