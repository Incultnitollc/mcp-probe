import { describe, it, expect } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import {
  createProbeMcpServer,
  probeServerTool,
  scoreServerTool,
} from "./mcp-server.js";

const FIXTURE = "npx tsx test-fixtures/unpublishable-server.ts";

describe("createProbeMcpServer", () => {
  it("registers probe_server and score_server tools", async () => {
    const server = createProbeMcpServer();
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    const client = new Client({ name: "test", version: "0.0.0" });
    await Promise.all([
      server.connect(serverTransport),
      client.connect(clientTransport),
    ]);

    const { tools } = await client.listTools();
    const names = tools.map((t) => t.name).sort();
    expect(names).toEqual(["probe_server", "score_server"]);

    await client.close();
  });
});

describe("scoreServerTool", () => {
  it("scores the unpublishable fixture 46/100 grade D", async () => {
    const res = await scoreServerTool({ target: FIXTURE });
    expect(res.isError).toBeFalsy();
    const score = res.structuredContent as { composite: number; grade: string };
    expect(score.composite).toBe(46);
    expect(score.grade).toBe("D");
  }, 30000);

  it("returns an error result (not a throw) on an unreachable target", async () => {
    const res = await scoreServerTool({
      target: "this-command-does-not-exist-xyz",
    });
    expect(res.isError).toBe(true);
    expect(res.content[0]?.type).toBe("text");
  }, 30000);
});

describe("probeServerTool", () => {
  it("inspects the fixture and reports its tools", async () => {
    const res = await probeServerTool({ target: FIXTURE });
    expect(res.isError).toBeFalsy();
    const summary = res.structuredContent as { toolsTotal: number };
    expect(summary.toolsTotal).toBeGreaterThan(0);
  }, 30000);
});
