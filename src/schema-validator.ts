import type { ToolInfo, SchemaIssue } from "./types.js";

export function validateToolSchemas(tools: ToolInfo[]): SchemaIssue[] {
  const issues: SchemaIssue[] = [];

  for (const tool of tools) {
    // Check tool has description
    if (!tool.description || tool.description.trim() === "") {
      issues.push({
        tool: tool.name,
        issue: "Missing tool description",
        severity: "warning",
      });
    }

    // Check inputSchema is valid
    if (!tool.inputSchema) {
      issues.push({
        tool: tool.name,
        issue: "Missing inputSchema",
        severity: "error",
      });
      continue;
    }

    if (tool.inputSchema.type !== "object") {
      issues.push({
        tool: tool.name,
        issue: `inputSchema.type should be "object", got "${tool.inputSchema.type}"`,
        severity: "error",
      });
    }

    // Check required fields reference existing properties
    const props = tool.inputSchema.properties ?? {};
    const required = tool.inputSchema.required ?? [];
    const propNames = Object.keys(props);

    for (const req of required) {
      if (!propNames.includes(req)) {
        issues.push({
          tool: tool.name,
          issue: `Required field "${req}" not found in properties`,
          severity: "error",
        });
      }
    }

    // Check properties have descriptions (common best practice)
    for (const [propName, propDef] of Object.entries(props)) {
      const def = propDef as Record<string, unknown>;
      if (!def.description || (typeof def.description === "string" && def.description.trim() === "")) {
        issues.push({
          tool: tool.name,
          issue: `Property "${propName}" missing description`,
          severity: "warning",
        });
      }
    }
  }

  return issues;
}
