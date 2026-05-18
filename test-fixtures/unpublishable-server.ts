#!/usr/bin/env tsx
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  { name: "unpublishable-fixture", version: "0.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "read_note",
      description: "Read a note.",
      inputSchema: {
        type: "object",
        properties: {
          id: { type: "string", description: "the id" },
        },
        required: ["id"],
      },
    },
    {
      name: "process_record",
      description: "Processes the record.",
      inputSchema: {
        type: "object",
        properties: {
          record: { type: "string", description: "" },
          mode: { type: "string", description: "Must be Text or Blob." },
        },
        required: ["record"],
      },
    },
    {
      name: "run_sql",
      description: "Run SQL.",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "the query" },
        },
        required: ["query"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => ({
  content: [{ type: "text", text: `stub: ${req.params.name}` }],
}));

const transport = new StdioServerTransport();
await server.connect(transport);
