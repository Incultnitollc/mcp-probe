#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createProbeMcpServer } from "./mcp-server.js";

async function main(): Promise<void> {
  const server = createProbeMcpServer();
  await server.connect(new StdioServerTransport());
}

main().catch((error) => {
  console.error("mcp-probe-server failed to start:", error);
  process.exit(1);
});
