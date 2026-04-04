/**
 * Generates sample arguments for a tool based on its inputSchema.
 * Used to auto-call tools during inspection.
 */
export function generateSampleArgs(
  inputSchema: {
    type: "object";
    properties?: Record<string, object>;
    required?: string[];
  }
): Record<string, unknown> {
  const args: Record<string, unknown> = {};
  const props = inputSchema.properties ?? {};
  const required = new Set(inputSchema.required ?? []);

  for (const [name, schema] of Object.entries(props)) {
    // Only generate args for required fields (safest approach)
    if (!required.has(name)) continue;

    const def = schema as Record<string, unknown>;
    args[name] = generateValue(name, def);
  }

  return args;
}

function generateValue(name: string, schema: Record<string, unknown>): unknown {
  // Use default if available
  if ("default" in schema) return schema.default;

  // Use first enum value if available
  if (Array.isArray(schema.enum) && schema.enum.length > 0) {
    return schema.enum[0];
  }

  const type = schema.type as string;

  switch (type) {
    case "string":
      return guessStringValue(name, schema);
    case "number":
    case "integer":
      return guessNumberValue(name, schema);
    case "boolean":
      return false;
    case "array":
      return [];
    case "object":
      return {};
    default:
      return "test";
  }
}

function guessStringValue(name: string, schema: Record<string, unknown>): string {
  const lower = name.toLowerCase();

  if (lower.includes("url") || lower.includes("uri")) return "https://example.com";
  if (lower.includes("email")) return "test@example.com";
  if (lower.includes("path")) return "/tmp/test";
  if (lower.includes("name")) return "test";
  if (lower.includes("query")) return "test query";
  if (lower.includes("message") || lower.includes("text") || lower.includes("content"))
    return "Hello from mcp-inspect";

  if (typeof schema.minLength === "number") {
    return "x".repeat(schema.minLength as number);
  }

  return "test";
}

function guessNumberValue(name: string, schema: Record<string, unknown>): number {
  if (typeof schema.minimum === "number") return schema.minimum as number;
  if (typeof schema.maximum === "number") return Math.min(1, schema.maximum as number);
  return 1;
}
