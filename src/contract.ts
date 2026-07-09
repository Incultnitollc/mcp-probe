import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { inspectServer } from "./client.js";
import { buildSnapshot, type SnapshotDocument } from "./snapshot.js";
import type { ChangeSeverity, DiffReport } from "./diff.js";
import { ALL_SEVERITIES } from "./diff.js";

export interface CaptureOptions {
  timeout: number;
  /** ISO time to stamp; omit for a byte-deterministic snapshot. */
  recordedAt?: string;
  silent?: boolean;
}

/**
 * Connect to a server and capture its contract surface only — lists
 * tools / resources / prompts and their schemas, without calling any tool,
 * reading any resource, or getting any prompt. Safe to run against live
 * servers: it never triggers side effects.
 */
export async function captureSnapshot(
  transport: Transport,
  options: CaptureOptions
): Promise<SnapshotDocument> {
  const result = await inspectServer(transport, {
    json: false,
    timeout: options.timeout,
    // publishabilityOnly skips Phase 3-5 (callTool / readResource / getPrompt):
    // discovery + schema validation only, so recording has no side effects.
    publishability: false,
    publishabilityOnly: true,
    silent: options.silent ?? true,
  });
  return buildSnapshot(result, { recordedAt: options.recordedAt });
}

export interface GateResult {
  failed: boolean;
  failOn: ChangeSeverity[];
  /** Number of changes in each failing severity. */
  violations: Record<ChangeSeverity, number>;
  totalViolations: number;
}

/** Parse a `--fail-on breaking,security` list into validated severities. */
export function parseFailOn(input: string): ChangeSeverity[] {
  const parts = input
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const invalid = parts.filter((p) => !ALL_SEVERITIES.includes(p as ChangeSeverity));
  if (invalid.length > 0) {
    throw new Error(
      `Invalid --fail-on value(s): ${invalid.join(", ")}. Expected any of: ${ALL_SEVERITIES.join(", ")}.`
    );
  }
  return parts as ChangeSeverity[];
}

/** Apply a gate policy: fail if the diff contains any change of a failing severity. */
export function evaluateGate(report: DiffReport, failOn: ChangeSeverity[]): GateResult {
  const violations: Record<ChangeSeverity, number> = {
    breaking: 0,
    security: 0,
    additive: 0,
    info: 0,
  };
  let total = 0;
  for (const sev of failOn) {
    violations[sev] = report.counts[sev];
    total += report.counts[sev];
  }
  return { failed: total > 0, failOn, violations, totalViolations: total };
}
