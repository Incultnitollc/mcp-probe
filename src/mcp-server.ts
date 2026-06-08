import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { inspectServer } from "./client.js";
import { parseTarget, createTransport } from "./transport.js";
import type { TransportKind } from "./types.js";

/**
 * mcp-probe exposed AS an MCP server: lets an agent inspect and score any
 * other MCP server. Thin wrappers over the existing `inspectServer` pipeline —
 * no new probe logic lives here.
 */

interface ToolResult {
  content: Array<{ type: "text"; text: string }>;
  structuredContent?: Record<string, unknown>;
  isError?: boolean;
}

interface CommonArgs {
  target: string;
  transport?: TransportKind;
  headers?: string[];
  timeout?: number;
}

interface ScoreArgs extends CommonArgs {
  packagePath?: string;
}

function errorResult(error: unknown): ToolResult {
  const message = error instanceof Error ? error.message : String(error);
  return {
    content: [{ type: "text", text: `Error: ${message}` }],
    isError: true,
  };
}

/** Full inspection of an MCP server target. */
export async function probeServerTool(args: CommonArgs): Promise<ToolResult> {
  try {
    const spec = parseTarget(args.target, {
      transport: args.transport,
      headers: args.headers ?? [],
    });
    const result = await inspectServer(createTransport(spec), {
      json: true,
      silent: true,
      timeout: args.timeout ?? 30000,
    });
    const summary = {
      serverName: result.serverName,
      toolsTotal: result.score.toolsTotal,
      toolsCallable: result.score.toolsCallable,
      resourcesTotal: result.score.resourcesTotal,
      promptsTotal: result.score.promptsTotal,
      schemaErrors: result.score.schemaErrors,
      schemaWarnings: result.score.schemaWarnings,
      complianceErrors: result.score.complianceErrors,
      complianceWarnings: result.score.complianceWarnings,
      tools: result.tools.map((t) => t.name),
    };
    return {
      content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      structuredContent: summary,
    };
  } catch (error) {
    return errorResult(error);
  }
}

/** Publishability score (0–100 + grade) for an MCP server target. */
export async function scoreServerTool(args: ScoreArgs): Promise<ToolResult> {
  try {
    const spec = parseTarget(args.target, {
      transport: args.transport,
      headers: args.headers ?? [],
    });
    const result = await inspectServer(createTransport(spec), {
      json: true,
      silent: true,
      timeout: args.timeout ?? 30000,
      publishability: true,
      publishabilityOnly: true,
      packageJsonPath: args.packagePath,
    });
    const score = result.publishabilityScore;
    if (!score) {
      throw new Error("Publishability score unavailable for this target.");
    }
    const structured = { ...score } as unknown as Record<string, unknown>;
    return {
      content: [{ type: "text", text: JSON.stringify(score, null, 2) }],
      structuredContent: structured,
    };
  } catch (error) {
    return errorResult(error);
  }
}

const targetShape = {
  target: z
    .string()
    .describe("MCP server target: a launch command or an http(s) URL."),
  transport: z
    .enum(["stdio", "sse", "http"])
    .optional()
    .describe("Force transport. Inferred from the target when omitted."),
  headers: z
    .array(z.string())
    .optional()
    .describe('Headers for remote transports, e.g. "Authorization: Bearer x".'),
  timeout: z
    .number()
    .optional()
    .describe("Per-operation timeout in milliseconds (default 30000)."),
};

/** Build the mcp-probe MCP server with probe_server + score_server tools. */
export function createProbeMcpServer(): McpServer {
  const server = new McpServer({ name: "mcp-probe", version: "1.1.1" });

  server.registerTool(
    "probe_server",
    {
      title: "Probe MCP server",
      description:
        "Inspect an MCP server: list its tools/resources/prompts, call them, " +
        "and report schema and protocol-compliance issues.",
      inputSchema: targetShape,
    },
    async (args) => (await probeServerTool(args)) as never
  );

  server.registerTool(
    "score_server",
    {
      title: "Score MCP server publishability",
      description:
        "Score an MCP server 0–100 on publishability (description quality, " +
        "enum/schema shape, mutation legibility, distribution metadata) with a " +
        "letter grade — run this before publishing a server.",
      inputSchema: { ...targetShape, packagePath: z.string().optional()
        .describe("Path to the server's package.json for the metadata check.") },
    },
    async (args) => (await scoreServerTool(args)) as never
  );

  return server;
}
