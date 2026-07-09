import { describe, it, expect } from "vitest";
import {
  buildSnapshot,
  serializeSnapshot,
  parseSnapshot,
  stableStringify,
  MCPVCR_FORMAT_VERSION,
} from "./snapshot.js";
import type { InspectResult } from "./types.js";

function inspectResult(over: Partial<InspectResult> = {}): InspectResult {
  return {
    serverName: "fixture",
    tools: [],
    resources: [],
    prompts: [],
    toolResults: [],
    resourceResults: [],
    promptResults: [],
    schemaIssues: [],
    complianceIssues: [],
    score: {
      toolsCallable: 0,
      toolsTotal: 0,
      resourcesReadable: 0,
      resourcesTotal: 0,
      promptsGettable: 0,
      promptsTotal: 0,
      schemaWarnings: 0,
      schemaErrors: 0,
      complianceErrors: 0,
      complianceWarnings: 0,
    },
    durationMs: 0,
    ...over,
  };
}

describe("buildSnapshot", () => {
  it("captures tools/resources/prompts and the server name", () => {
    const doc = buildSnapshot(
      inspectResult({
        serverName: "srv",
        tools: [{ name: "t", description: "d", inputSchema: { type: "object" } }],
        resources: [{ uri: "file://a" }],
        prompts: [{ name: "p" }],
      })
    );
    expect(doc.mcpvcr).toBe(MCPVCR_FORMAT_VERSION);
    expect(doc.server.name).toBe("srv");
    expect(doc.tools.map((t) => t.name)).toEqual(["t"]);
    expect(doc.resources.map((r) => r.uri)).toEqual(["file://a"]);
    expect(doc.prompts.map((p) => p.name)).toEqual(["p"]);
  });

  it("sorts tools/resources/prompts and required arrays deterministically", () => {
    const doc = buildSnapshot(
      inspectResult({
        tools: [
          { name: "zebra", inputSchema: { type: "object", required: ["b", "a"] } },
          { name: "alpha", inputSchema: { type: "object" } },
        ],
        resources: [{ uri: "file://z" }, { uri: "file://a" }],
        prompts: [{ name: "q" }, { name: "p" }],
      })
    );
    expect(doc.tools.map((t) => t.name)).toEqual(["alpha", "zebra"]);
    expect(doc.tools[1].inputSchema.required).toEqual(["a", "b"]);
    expect(doc.resources.map((r) => r.uri)).toEqual(["file://a", "file://z"]);
    expect(doc.prompts.map((p) => p.name)).toEqual(["p", "q"]);
  });

  it("omits recordedAt by default and includes it when provided", () => {
    expect(buildSnapshot(inspectResult()).recordedAt).toBeUndefined();
    const stamped = buildSnapshot(inspectResult(), { recordedAt: "2026-07-09T00:00:00.000Z" });
    expect(stamped.recordedAt).toBe("2026-07-09T00:00:00.000Z");
  });
});

describe("stableStringify", () => {
  it("produces identical output regardless of key insertion order", () => {
    const a = stableStringify({ b: 1, a: { d: 2, c: 3 } });
    const b = stableStringify({ a: { c: 3, d: 2 }, b: 1 });
    expect(a).toBe(b);
  });

  it("makes re-recording an unchanged server byte-identical", () => {
    const r1 = inspectResult({
      tools: [{ name: "t", description: "d", inputSchema: { type: "object", properties: { x: { type: "string" } } } }],
    });
    // Same surface, different in-memory ordering of the properties object.
    const r2 = inspectResult({
      tools: [{ name: "t", inputSchema: { type: "object", properties: { x: { type: "string" } }, }, description: "d" }],
    });
    expect(serializeSnapshot(buildSnapshot(r1))).toBe(serializeSnapshot(buildSnapshot(r2)));
  });
});

describe("parseSnapshot", () => {
  it("round-trips a serialized snapshot", () => {
    const doc = buildSnapshot(
      inspectResult({ tools: [{ name: "t", inputSchema: { type: "object" } }] })
    );
    expect(parseSnapshot(serializeSnapshot(doc))).toEqual(doc);
  });

  it("rejects JSON that is not a .mcpvcr snapshot", () => {
    expect(() => parseSnapshot('{"hello":"world"}')).toThrow(/not a \.mcpvcr snapshot/);
  });

  it("rejects a snapshot from a newer format version", () => {
    expect(() => parseSnapshot(JSON.stringify({ mcpvcr: 999, tools: [] }))).toThrow(/newer \.mcpvcr format/);
  });

  it("rejects invalid JSON", () => {
    expect(() => parseSnapshot("{not json")).toThrow(/not valid JSON/);
  });
});
