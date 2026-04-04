import { describe, it, expect } from "vitest";
import { validateToolSchemas } from "./schema-validator.js";
import type { ToolInfo } from "./types.js";

describe("validateToolSchemas", () => {
  it("returns no issues for a well-formed tool", () => {
    const tools: ToolInfo[] = [
      {
        name: "echo",
        description: "Echoes input",
        inputSchema: {
          type: "object",
          properties: {
            message: { type: "string", description: "The message to echo" },
          },
          required: ["message"],
        },
      },
    ];
    const issues = validateToolSchemas(tools);
    expect(issues).toEqual([]);
  });

  it("warns on missing tool description", () => {
    const tools: ToolInfo[] = [
      {
        name: "no-desc",
        inputSchema: { type: "object" },
      },
    ];
    const issues = validateToolSchemas(tools);
    expect(issues).toContainEqual({
      tool: "no-desc",
      issue: "Missing tool description",
      severity: "warning",
    });
  });

  it("errors on required field not in properties", () => {
    const tools: ToolInfo[] = [
      {
        name: "bad-required",
        description: "Test tool",
        inputSchema: {
          type: "object",
          properties: {
            a: { type: "string", description: "A field" },
          },
          required: ["a", "b"],
        },
      },
    ];
    const issues = validateToolSchemas(tools);
    expect(issues).toContainEqual({
      tool: "bad-required",
      issue: 'Required field "b" not found in properties',
      severity: "error",
    });
  });

  it("warns on property missing description", () => {
    const tools: ToolInfo[] = [
      {
        name: "no-prop-desc",
        description: "Test tool",
        inputSchema: {
          type: "object",
          properties: {
            foo: { type: "string" },
          },
        },
      },
    ];
    const issues = validateToolSchemas(tools);
    expect(issues).toContainEqual({
      tool: "no-prop-desc",
      issue: 'Property "foo" missing description',
      severity: "warning",
    });
  });
});
