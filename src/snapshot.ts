import { writeFileSync, readFileSync } from "node:fs";
import type { InspectResult } from "./types.js";

/**
 * `.mcpvcr` — the contract snapshot ("VCR cassette") for an MCP server.
 *
 * A snapshot is a normalized, deterministically-serialized capture of a
 * server's tool / resource / prompt *surface* (names, descriptions, input
 * schemas, annotations). It carries no live traffic — just the contract that
 * clients depend on. Commit it, then `diff`/`gate` every PR against it to catch
 * breaking schema changes, removed tools, and tool-description mutations (the
 * rug-pull / tool-poisoning vector) before they ship.
 */
export const MCPVCR_FORMAT_VERSION = 1;

export interface SnapshotTool {
  name: string;
  description?: string;
  inputSchema: {
    type: "object";
    properties?: Record<string, unknown>;
    required?: string[];
  };
  annotations?: {
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
  };
}

export interface SnapshotResource {
  uri: string;
  name?: string;
  description?: string;
}

export interface SnapshotPrompt {
  name: string;
  description?: string;
  arguments?: Array<{ name: string; description?: string; required?: boolean }>;
}

export interface SnapshotDocument {
  /** `.mcpvcr` format version. */
  mcpvcr: number;
  /** ISO 8601 record time. Informational only — ignored by `diff`/`gate`. */
  recordedAt?: string;
  server: { name?: string };
  /** Sorted by name. */
  tools: SnapshotTool[];
  /** Sorted by uri. */
  resources: SnapshotResource[];
  /** Sorted by name. */
  prompts: SnapshotPrompt[];
}

export interface BuildSnapshotOptions {
  /** Stamp the snapshot with this ISO time. Omit for a byte-deterministic file. */
  recordedAt?: string;
}

/**
 * Normalize an {@link InspectResult} into a deterministic {@link SnapshotDocument}:
 * entries sorted by their key, `required` arrays sorted, so re-recording an
 * unchanged server produces byte-identical output and diffs stay meaningful.
 */
export function buildSnapshot(
  result: InspectResult,
  options: BuildSnapshotOptions = {}
): SnapshotDocument {
  const tools: SnapshotTool[] = result.tools
    .map((t) => ({
      name: t.name,
      ...(t.description !== undefined ? { description: t.description } : {}),
      inputSchema: {
        type: "object" as const,
        ...(t.inputSchema?.properties !== undefined
          ? { properties: t.inputSchema.properties }
          : {}),
        ...(t.inputSchema?.required !== undefined
          ? { required: [...t.inputSchema.required].sort() }
          : {}),
      },
      ...(t.annotations !== undefined ? { annotations: t.annotations } : {}),
    }))
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

  const resources: SnapshotResource[] = result.resources
    .map((r) => ({
      uri: r.uri,
      ...(r.name !== undefined ? { name: r.name } : {}),
      ...(r.description !== undefined ? { description: r.description } : {}),
    }))
    .sort((a, b) => (a.uri < b.uri ? -1 : a.uri > b.uri ? 1 : 0));

  const prompts: SnapshotPrompt[] = result.prompts
    .map((p) => ({
      name: p.name,
      ...(p.description !== undefined ? { description: p.description } : {}),
      ...(p.arguments !== undefined
        ? {
            arguments: [...p.arguments].sort((a, b) =>
              a.name < b.name ? -1 : a.name > b.name ? 1 : 0
            ),
          }
        : {}),
    }))
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

  return {
    mcpvcr: MCPVCR_FORMAT_VERSION,
    ...(options.recordedAt !== undefined ? { recordedAt: options.recordedAt } : {}),
    server: { ...(result.serverName !== undefined ? { name: result.serverName } : {}) },
    tools,
    resources,
    prompts,
  };
}

/**
 * Deterministic JSON: object keys sorted recursively so semantically-identical
 * documents serialize to identical bytes. Arrays keep their order (the snapshot
 * builder already sorts the arrays that need it).
 */
export function stableStringify(value: unknown): string {
  return JSON.stringify(sortKeys(value), null, 2);
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      out[key] = sortKeys((value as Record<string, unknown>)[key]);
    }
    return out;
  }
  return value;
}

export function serializeSnapshot(doc: SnapshotDocument): string {
  return stableStringify(doc) + "\n";
}

export function writeSnapshot(path: string, doc: SnapshotDocument): void {
  writeFileSync(path, serializeSnapshot(doc), "utf-8");
}

export function parseSnapshot(text: string, source = "snapshot"): SnapshotDocument {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    throw new Error(
      `${source} is not valid JSON: ${err instanceof Error ? err.message : String(err)}`
    );
  }
  if (typeof parsed !== "object" || parsed === null || !("mcpvcr" in parsed)) {
    throw new Error(
      `${source} is not a .mcpvcr snapshot (missing "mcpvcr" version field).`
    );
  }
  const doc = parsed as SnapshotDocument;
  if (doc.mcpvcr > MCPVCR_FORMAT_VERSION) {
    throw new Error(
      `${source} was recorded with a newer .mcpvcr format (v${doc.mcpvcr}); this mcp-probe supports up to v${MCPVCR_FORMAT_VERSION}. Upgrade mcp-probe.`
    );
  }
  doc.tools ??= [];
  doc.resources ??= [];
  doc.prompts ??= [];
  doc.server ??= {};
  return doc;
}

export function readSnapshot(path: string): SnapshotDocument {
  let text: string;
  try {
    text = readFileSync(path, "utf-8");
  } catch (err) {
    throw new Error(
      `Could not read snapshot "${path}": ${err instanceof Error ? err.message : String(err)}`
    );
  }
  return parseSnapshot(text, path);
}
