import type { TargetSpec, TransportKind } from "./types.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";

export interface ParseTargetOptions {
  transport?: TransportKind;
  headers?: string[];
}

export function parseTarget(
  target: string,
  opts: ParseTargetOptions
): TargetSpec {
  const isUrl = /^https?:\/\//i.test(target);

  if (isUrl) {
    if (opts.transport === "stdio") {
      throw new Error(
        "--transport stdio is incompatible with a URL target. Pass a command instead."
      );
    }
    const kind: "sse" | "http" = opts.transport === "sse" ? "sse" : "http";
    return {
      kind,
      url: new URL(target),
      headers: parseHeaders(opts.headers ?? []),
    };
  }

  if (opts.transport === "sse" || opts.transport === "http") {
    throw new Error(
      `--transport ${opts.transport} requires a URL target (http:// or https://).`
    );
  }

  const parts = target.split(/\s+/).filter(Boolean);
  return {
    kind: "stdio",
    command: parts[0],
    args: parts.slice(1),
  };
}

function parseHeaders(raw: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const h of raw) {
    const idx = h.indexOf(":");
    if (idx === -1) {
      throw new Error(`Invalid --header "${h}". Expected "Name: value".`);
    }
    const name = h.slice(0, idx).trim();
    const value = h.slice(idx + 1).trim();
    if (!name) throw new Error(`Invalid --header "${h}". Missing name.`);
    out[name] = value;
  }
  return out;
}

export function createTransport(spec: TargetSpec): Transport {
  if (spec.kind === "stdio") {
    return new StdioClientTransport({
      command: spec.command,
      args: spec.args,
      stderr: "pipe",
    });
  }

  const requestInit: RequestInit =
    Object.keys(spec.headers).length > 0 ? { headers: spec.headers } : {};

  if (spec.kind === "sse") {
    return new SSEClientTransport(spec.url, {
      requestInit,
      eventSourceInit:
        Object.keys(spec.headers).length > 0
          ? {
              fetch: (input, init) =>
                fetch(input, { ...init, headers: { ...init?.headers, ...spec.headers } }),
            }
          : undefined,
    });
  }

  // kind === "http"
  return new StreamableHTTPClientTransport(spec.url, { requestInit });
}
