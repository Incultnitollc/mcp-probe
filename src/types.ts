export interface ToolInfo {
  name: string;
  description?: string;
  inputSchema: {
    type: "object";
    properties?: Record<string, object>;
    required?: string[];
  };
  annotations?: {
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
  };
}

export interface ToolCallResult {
  tool: string;
  success: boolean;
  content?: Array<{ type: string; text?: string }>;
  error?: string;
  durationMs: number;
  argsUsed?: Record<string, unknown>;
}

export interface ResourceInfo {
  uri: string;
  name?: string;
  description?: string;
}

export interface ResourceReadResult {
  uri: string;
  success: boolean;
  contentType?: string;
  contentLength?: number;
  error?: string;
  durationMs: number;
}

export interface PromptInfo {
  name: string;
  description?: string;
  arguments?: Array<{ name: string; description?: string; required?: boolean }>;
}

export interface PromptGetResult {
  name: string;
  success: boolean;
  messageCount?: number;
  error?: string;
  durationMs: number;
  argsUsed?: Record<string, string>;
}

export interface ComplianceIssue {
  check: string;
  message: string;
  severity: "error" | "warning" | "info";
}

export interface SchemaIssue {
  tool: string;
  issue: string;
  severity: "error" | "warning";
}

export interface InspectResult {
  serverName?: string;
  tools: ToolInfo[];
  resources: ResourceInfo[];
  prompts: PromptInfo[];
  toolResults: ToolCallResult[];
  resourceResults: ResourceReadResult[];
  promptResults: PromptGetResult[];
  schemaIssues: SchemaIssue[];
  complianceIssues: ComplianceIssue[];
  score: {
    toolsCallable: number;
    toolsTotal: number;
    resourcesReadable: number;
    resourcesTotal: number;
    promptsGettable: number;
    promptsTotal: number;
    schemaWarnings: number;
    schemaErrors: number;
    complianceErrors: number;
    complianceWarnings: number;
  };
  durationMs: number;
  publishabilityResults?: PublishabilityResult[];
  publishabilityScore?: PublishabilityScore;
}

export interface InspectOptions {
  json: boolean;
  timeout: number;
  html?: string;
  verbose?: boolean;
  silent?: boolean;
  publishability?: boolean;
  publishabilityOnly?: boolean;
  packageJsonPath?: string;
}

export interface BenchResult {
  serverName?: string;
  tools: BenchToolResult[];
  iterations: number;
  durationMs: number;
}

export interface BenchToolResult {
  tool: string;
  latencies: number[];
  p50: number;
  p95: number;
  p99: number;
  min: number;
  max: number;
  throughput: number;
  errors: number;
}

export interface BenchOptions {
  iterations: number;
  timeout: number;
  json: boolean;
}

export type TransportKind = "stdio" | "sse" | "http";

export interface StdioTargetSpec {
  kind: "stdio";
  command: string;
  args: string[];
}

export interface HttpTargetSpec {
  kind: "sse" | "http";
  url: URL;
  headers: Record<string, string>;
}

export type TargetSpec = StdioTargetSpec | HttpTargetSpec;

export type PublishabilitySeverity = "high" | "medium" | "low" | "info";

export type PublishabilityCheckId =
  | "description-five-axis"
  | "enum-shape"
  | "mutation-legibility"
  | "distribution-metadata"
  | "anti-purpose-clause";

export interface PublishabilityResult {
  check: PublishabilityCheckId;
  passed: boolean;
  severity: PublishabilitySeverity;
  title: string;
  message: string;
  perToolFailures?: Array<{ tool: string; reason: string }>;
  evidence?: {
    axisAvg?: number;
    failedTools?: string[];
    metadataField?: string;
    skipped?: boolean;
  };
  remediation?: string;
  durationMs: number;
}

export interface PublishabilityCheckContext {
  result: InspectResult;
  packageJsonPath?: string;
  timeout: number;
}

export interface PublishabilityCheck {
  id: PublishabilityCheckId;
  title: string;
  defaultSeverity: PublishabilitySeverity;
  run(ctx: PublishabilityCheckContext): Promise<PublishabilityResult>;
}

export interface PublishabilityScore {
  composite: number;
  grade: "A" | "B" | "C" | "D" | "F";
  bandName: "Publishable" | "Almost" | "Rough" | "Not ready";
  passed: number;
  failed: number;
  capsApplied: Array<{ reason: string; ceiling: number }>;
  byDomain: {
    protocol: { score: number; hardZero: boolean };
    edgeCases: { score: number };
    publishability: { score: number; failures: PublishabilityCheckId[] };
  };
}
