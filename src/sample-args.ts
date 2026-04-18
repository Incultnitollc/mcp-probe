import path from "node:path";

/**
 * Extra knowledge callers can feed into sample generation.
 * Currently just allowed filesystem roots (discovered via
 * `list_allowed_directories` on filesystem-style servers), so we
 * stop sending `/tmp/test` to sandboxed servers.
 */
export interface SampleArgsContext {
  allowedDirectories?: string[];
}

/**
 * Generates sample arguments for a tool based on its inputSchema.
 * Used to auto-call tools during inspection.
 */
export function generateSampleArgs(
  inputSchema: {
    type: "object";
    properties?: Record<string, object>;
    required?: string[];
  },
  context: SampleArgsContext = {}
): Record<string, unknown> {
  const args: Record<string, unknown> = {};
  const props = inputSchema.properties ?? {};
  const required = new Set(inputSchema.required ?? []);

  for (const [name, schema] of Object.entries(props)) {
    if (!required.has(name)) continue;

    const def = schema as Record<string, unknown>;
    args[name] = generateValue(name, def, context);
  }

  return args;
}

function generateValue(
  name: string,
  schema: Record<string, unknown>,
  context: SampleArgsContext
): unknown {
  if ("default" in schema) return schema.default;

  if (Array.isArray(schema.enum) && schema.enum.length > 0) {
    return schema.enum[0];
  }

  if (Array.isArray(schema.oneOf) && schema.oneOf.length > 0) {
    return generateValue(name, schema.oneOf[0] as Record<string, unknown>, context);
  }
  if (Array.isArray(schema.anyOf) && schema.anyOf.length > 0) {
    return generateValue(name, schema.anyOf[0] as Record<string, unknown>, context);
  }

  const type = schema.type as string;

  switch (type) {
    case "string":
      if (typeof schema.pattern === "string") {
        return matchPattern(schema.pattern);
      }
      return guessStringValue(name, schema, context);
    case "number":
    case "integer":
      return guessNumberValue(name, schema);
    case "boolean":
      return false;
    case "array": {
      const minItems = typeof schema.minItems === "number" ? schema.minItems : 0;
      if (minItems > 0 && schema.items && typeof schema.items === "object") {
        return Array.from({ length: minItems }, () =>
          generateValue("item", schema.items as Record<string, unknown>, context)
        );
      }
      if (isPathName(name) && context.allowedDirectories?.length) {
        return [context.allowedDirectories[0]];
      }
      return [];
    }
    case "object": {
      if (schema.properties && typeof schema.properties === "object") {
        return generateSampleArgs(
          {
            type: "object",
            properties: schema.properties as Record<string, object>,
            required: schema.required as string[] | undefined,
          },
          context
        );
      }
      return {};
    }
    default:
      return "test";
  }
}

function matchPattern(pattern: string): string {
  if (pattern.includes("[0-9a-f]{8}") && pattern.includes("[0-9a-f]{4}")) {
    return "12345678-1234-1234-1234-123456789abc";
  }
  if (pattern.includes("T") && pattern.includes("Z")) {
    return "2024-01-01T00:00:00Z";
  }
  if (pattern.includes("\\d{4}") && pattern.includes("\\d{2}")) {
    return "2024-01-01";
  }
  if (/^\^?\[0-9a-f\]/.test(pattern) || /^\^?\[a-f0-9\]/.test(pattern)) {
    return "abcdef12";
  }
  return "test";
}

function isPathName(name: string): boolean {
  const lower = name.toLowerCase();
  if (lower.includes("url")) return false;
  return (
    lower === "path" ||
    lower === "paths" ||
    lower.endsWith("_path") ||
    lower.endsWith("path") ||
    lower === "source" ||
    lower === "destination" ||
    lower === "src" ||
    lower === "dst"
  );
}

function guessStringValue(
  name: string,
  schema: Record<string, unknown>,
  context: SampleArgsContext
): string {
  const lower = name.toLowerCase();

  if (lower.includes("url") || lower.includes("uri")) return "https://example.com";
  if (lower.includes("email")) return "test@example.com";

  if (isPathName(name)) {
    return pickPathValue(schema, context);
  }

  if (lower.includes("name")) return "test";
  if (lower.includes("query")) return "test query";
  if (lower.includes("message") || lower.includes("text") || lower.includes("content"))
    return "Hello from mcp-inspect";

  if (typeof schema.minLength === "number") {
    return "x".repeat(schema.minLength as number);
  }

  return "test";
}

function pickPathValue(
  schema: Record<string, unknown>,
  context: SampleArgsContext
): string {
  const dirs = context.allowedDirectories ?? [];
  if (dirs.length === 0) return "/tmp/test";

  const base = dirs[0];
  const desc = String(schema.description ?? "").toLowerCase();

  // If the description tells us whether this expects a file or a
  // directory, respect it. Otherwise default to the allowed root
  // itself — safe for list_directory-style tools and understood
  // as an EISDIR semantic error for read_file-style tools (which
  // is a "can't invent file contents" client-side limitation,
  // not a sandbox violation).
  if (desc.includes("director")) return base;
  if (desc.includes("file")) return path.join(base, "mcp-probe-test.txt");
  return base;
}

function guessNumberValue(name: string, schema: Record<string, unknown>): number {
  if (typeof schema.minimum === "number") return schema.minimum as number;
  if (typeof schema.maximum === "number") return Math.min(1, schema.maximum as number);
  return 1;
}
