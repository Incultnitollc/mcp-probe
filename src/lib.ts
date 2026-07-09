export { inspectServer } from "./client.js";
export { benchServer } from "./bench.js";
export { parseTarget, createTransport } from "./transport.js";
export { checkCompliance } from "./spec-checker.js";

// Contract testing ("VCR for MCP"): record → diff → gate.
export {
  buildSnapshot,
  serializeSnapshot,
  writeSnapshot,
  parseSnapshot,
  readSnapshot,
  stableStringify,
  MCPVCR_FORMAT_VERSION,
} from "./snapshot.js";
export { diffSnapshots, ALL_SEVERITIES } from "./diff.js";
export { renderDiffTerminal, renderDiffMarkdown } from "./diff-printer.js";
export { captureSnapshot, parseFailOn, evaluateGate } from "./contract.js";

export type {
  SnapshotDocument,
  SnapshotTool,
  SnapshotResource,
  SnapshotPrompt,
  BuildSnapshotOptions,
} from "./snapshot.js";
export type { Change, ChangeKind, ChangeSeverity, DiffReport } from "./diff.js";
export type { CaptureOptions, GateResult } from "./contract.js";

export type {
  ToolInfo,
  ToolCallResult,
  ResourceInfo,
  ResourceReadResult,
  PromptInfo,
  PromptGetResult,
  ComplianceIssue,
  SchemaIssue,
  InspectResult,
  InspectOptions,
  BenchResult,
  BenchToolResult,
  BenchOptions,
  TransportKind,
  StdioTargetSpec,
  HttpTargetSpec,
  TargetSpec,
  PublishabilitySeverity,
  PublishabilityCheckId,
  PublishabilityResult,
  PublishabilityCheckContext,
  PublishabilityCheck,
  PublishabilityScore,
} from "./types.js";
