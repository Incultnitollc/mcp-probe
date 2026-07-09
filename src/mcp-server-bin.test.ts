import { describe, it, expect, afterEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

/**
 * End-to-end: launch the mcp-probe server binary over real stdio and talk to it
 * as a client would. Proves the Fork-#2 wedge runs as an actual MCP server.
 */
describe("mcp-probe-server bin (stdio)", () => {
  let client: Client | undefined;

  afterEach(async () => {
    await client?.close();
    client = undefined;
  });

  it("serves probe_server and score_server over stdio", async () => {
    const transport = new StdioClientTransport({
      command: "npx",
      args: ["tsx", "src/mcp-server-bin.ts"],
    });
    client = new Client({ name: "e2e", version: "0.0.0" });
    await client.connect(transport);

    const { tools } = await client.listTools();
    const names = tools.map((t) => t.name).sort();
    expect(names).toEqual(["probe_server", "score_server"]);
  }, 30000);
});
