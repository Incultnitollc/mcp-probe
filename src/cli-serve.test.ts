import { describe, it, expect, afterEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

/**
 * The default npm bin (`mcp-probe`) must be able to launch the MCP server via a
 * `serve` subcommand, so the registry entry can run `npx @scope/pkg serve`.
 */
describe("mcp-probe serve", () => {
  let client: Client | undefined;

  afterEach(async () => {
    await client?.close();
    client = undefined;
  });

  it("starts the MCP server over stdio via the CLI serve subcommand", async () => {
    const transport = new StdioClientTransport({
      command: "npx",
      args: ["tsx", "src/cli.ts", "serve"],
    });
    client = new Client({ name: "e2e", version: "0.0.0" });
    await client.connect(transport);

    const { tools } = await client.listTools();
    const names = tools.map((t) => t.name).sort();
    expect(names).toEqual(["probe_server", "score_server"]);
  }, 30000);
});
