#!/usr/bin/env tsx
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  { name: "publishable-fixture", version: "0.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "read_note",
      description: "Read-only. Returns the contents of a single note by id. Does not mutate state.",
      annotations: { readOnlyHint: true },
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Note UUID. Must match pattern ^[0-9a-f-]{36}$. Do not pass file paths or numeric IDs. Example: '6f3b5a4d-90ab-4cdf-8e21-1234567890ab'.",
            pattern: "^[0-9a-f-]{36}$",
          },
        },
        required: ["id"],
        additionalProperties: false,
      },
    },
    {
      name: "create_note",
      description: "Mutating. Writes a new note. Do not use for updates — use update_note instead.",
      annotations: { destructiveHint: false },
      inputSchema: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Note title, 1-200 UTF-8 chars. Cannot be empty. Example: 'Meeting notes 2026-05-18'.",
            minLength: 1,
            maxLength: 200,
          },
          visibility: {
            type: "string",
            description: "Visibility scope.",
            enum: ["private", "team", "public"],
          },
        },
        required: ["title"],
        additionalProperties: false,
      },
    },
    {
      name: "delete_note",
      description: "Mutating. Destructive. Permanently deletes a note. Do not use to archive — use update_note with status='archived' instead. Prefer update_note for soft-delete semantics.",
      annotations: { destructiveHint: true },
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Note UUID to delete. Must be exact match. Do not pass partial IDs or wildcards. Example: '6f3b5a4d-90ab-4cdf-8e21-1234567890ab'.",
            pattern: "^[0-9a-f-]{36}$",
          },
        },
        required: ["id"],
        additionalProperties: false,
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => ({
  content: [{ type: "text", text: `stub: ${req.params.name}` }],
}));

const transport = new StdioServerTransport();
await server.connect(transport);
