import { describe, it, expect } from "vitest";
import {
  checkDescriptionFiveAxis,
  checkEnumShape,
  checkMutationLegibility,
} from "./publishability-checks.js";
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

describe("checkEnumShape", () => {
  it("passes when no in-prose enum language exists", () => {
    const tools = [
      makeTool("x", "Reads.", { p: { type: "string", description: "the id" } }),
    ];
    const out = checkEnumShape(tools);
    expect(out.passed).toBe(true);
  });

  it("passes when in-prose enum is matched by schema enum array", () => {
    const tools: ToolInfo[] = [
      {
        name: "x",
        description: "Reads.",
        inputSchema: {
          type: "object",
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
    const tools = [makeTool("frobnicate", "Mutating. Writes to disk.", {})];
    const out = checkMutationLegibility(tools);
    expect(out.passed).toBe(true);
  });

  it("passes when tool has annotations.destructiveHint set", () => {
    const tools: ToolInfo[] = [
      {
        name: "frobnicate",
        description: "anything",
        inputSchema: { type: "object", properties: {} },
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
