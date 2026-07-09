import type {
  SnapshotDocument,
  SnapshotTool,
  SnapshotResource,
  SnapshotPrompt,
} from "./snapshot.js";

/**
 * How a single change affects consumers of the contract.
 *
 * - `breaking`  — existing clients can break (removed tool, new required arg,
 *                 property removed, type changed, enum narrowed).
 * - `security`  — the change is a trust / supply-chain signal even when the
 *                 wire contract still validates: a tool *description* mutated
 *                 (rug-pull / tool-poisoning) or a safety annotation weakened.
 * - `additive`  — backward-compatible growth (new tool, new optional field).
 * - `info`      — cosmetic / non-behavioral (server name, resource description).
 */
export type ChangeSeverity = "breaking" | "security" | "additive" | "info";

export type ChangeKind =
  | "tool-removed"
  | "tool-added"
  | "tool-description-changed"
  | "tool-annotation-weakened"
  | "tool-annotation-changed"
  | "tool-required-added"
  | "tool-required-removed"
  | "tool-property-removed"
  | "tool-property-added"
  | "tool-property-type-changed"
  | "tool-enum-narrowed"
  | "tool-enum-widened"
  | "resource-removed"
  | "resource-added"
  | "resource-description-changed"
  | "prompt-removed"
  | "prompt-added"
  | "prompt-required-arg-added"
  | "prompt-arg-removed"
  | "prompt-description-changed"
  | "server-name-changed";

export interface Change {
  kind: ChangeKind;
  severity: ChangeSeverity;
  /** Tool / prompt name, resource uri, or "" for server-level. */
  subject: string;
  /** Property or argument name, when the change is scoped inside a subject. */
  field?: string;
  /** One-line human summary. */
  detail: string;
  before?: string;
  after?: string;
}

export interface DiffReport {
  baselineServer?: string;
  currentServer?: string;
  changes: Change[];
  counts: Record<ChangeSeverity, number>;
  identical: boolean;
}

export const ALL_SEVERITIES: ChangeSeverity[] = [
  "breaking",
  "security",
  "additive",
  "info",
];

/**
 * Compare a recorded baseline against the current surface and classify every
 * change. Pure and deterministic — no I/O, no network.
 */
export function diffSnapshots(
  baseline: SnapshotDocument,
  current: SnapshotDocument
): DiffReport {
  const changes: Change[] = [];

  diffTools(baseline.tools ?? [], current.tools ?? [], changes);
  diffResources(baseline.resources ?? [], current.resources ?? [], changes);
  diffPrompts(baseline.prompts ?? [], current.prompts ?? [], changes);

  const baseName = baseline.server?.name;
  const curName = current.server?.name;
  if (baseName !== undefined && curName !== undefined && baseName !== curName) {
    changes.push({
      kind: "server-name-changed",
      severity: "info",
      subject: "",
      detail: `Server name changed from "${baseName}" to "${curName}".`,
      before: baseName,
      after: curName,
    });
  }

  const counts: Record<ChangeSeverity, number> = {
    breaking: 0,
    security: 0,
    additive: 0,
    info: 0,
  };
  for (const c of changes) counts[c.severity]++;

  // Stable, human-meaningful order: severest first, then by subject.
  const rank: Record<ChangeSeverity, number> = {
    breaking: 0,
    security: 1,
    additive: 2,
    info: 3,
  };
  changes.sort(
    (a, b) =>
      rank[a.severity] - rank[b.severity] ||
      a.subject.localeCompare(b.subject) ||
      a.kind.localeCompare(b.kind) ||
      (a.field ?? "").localeCompare(b.field ?? "")
  );

  return {
    baselineServer: baseName,
    currentServer: curName,
    changes,
    counts,
    identical: changes.length === 0,
  };
}

// ── Tools ────────────────────────────────────────────────────────────────

function diffTools(
  baseline: SnapshotTool[],
  current: SnapshotTool[],
  changes: Change[]
): void {
  const baseMap = byKey(baseline, (t) => t.name);
  const curMap = byKey(current, (t) => t.name);

  for (const [name] of baseMap) {
    if (!curMap.has(name)) {
      changes.push({
        kind: "tool-removed",
        severity: "breaking",
        subject: name,
        detail: `Tool "${name}" was removed.`,
      });
    }
  }
  for (const [name] of curMap) {
    if (!baseMap.has(name)) {
      changes.push({
        kind: "tool-added",
        severity: "additive",
        subject: name,
        detail: `Tool "${name}" was added.`,
      });
    }
  }
  for (const [name, before] of baseMap) {
    const after = curMap.get(name);
    if (after) diffOneTool(name, before, after, changes);
  }
}

function diffOneTool(
  name: string,
  before: SnapshotTool,
  after: SnapshotTool,
  changes: Change[]
): void {
  // Description mutation — the rug-pull / tool-poisoning vector. The wire
  // contract can still validate while the *instructions the model reads* are
  // swapped underneath it, so this is a trust signal, not a compat break.
  if ((before.description ?? "") !== (after.description ?? "")) {
    changes.push({
      kind: "tool-description-changed",
      severity: "security",
      subject: name,
      detail: `Tool "${name}" description changed — review for injected instructions (tool-poisoning / rug-pull).`,
      before: before.description ?? "",
      after: after.description ?? "",
    });
  }

  diffAnnotations(name, before.annotations, after.annotations, changes);

  const beforeReq = new Set(before.inputSchema?.required ?? []);
  const afterReq = new Set(after.inputSchema?.required ?? []);
  for (const field of afterReq) {
    if (!beforeReq.has(field)) {
      changes.push({
        kind: "tool-required-added",
        severity: "breaking",
        subject: name,
        field,
        detail: `Tool "${name}" now requires "${field}" — calls that omit it will fail.`,
      });
    }
  }
  for (const field of beforeReq) {
    if (!afterReq.has(field)) {
      changes.push({
        kind: "tool-required-removed",
        severity: "additive",
        subject: name,
        field,
        detail: `Tool "${name}" no longer requires "${field}".`,
      });
    }
  }

  const beforeProps = asProps(before.inputSchema?.properties);
  const afterProps = asProps(after.inputSchema?.properties);
  for (const field of Object.keys(beforeProps)) {
    if (!(field in afterProps)) {
      changes.push({
        kind: "tool-property-removed",
        severity: "breaking",
        subject: name,
        field,
        detail: `Tool "${name}" removed input property "${field}".`,
      });
    }
  }
  for (const field of Object.keys(afterProps)) {
    if (!(field in beforeProps)) {
      changes.push({
        kind: "tool-property-added",
        severity: "additive",
        subject: name,
        field,
        detail: `Tool "${name}" added input property "${field}".`,
      });
    }
  }
  for (const field of Object.keys(beforeProps)) {
    if (!(field in afterProps)) continue;
    diffProperty(name, field, beforeProps[field], afterProps[field], changes);
  }
}

function diffProperty(
  tool: string,
  field: string,
  before: Record<string, unknown>,
  after: Record<string, unknown>,
  changes: Change[]
): void {
  const beforeType = normType(before.type);
  const afterType = normType(after.type);
  if (beforeType !== afterType) {
    changes.push({
      kind: "tool-property-type-changed",
      severity: "breaking",
      subject: tool,
      field,
      detail: `Tool "${tool}" property "${field}" type changed from ${beforeType || "any"} to ${afterType || "any"}.`,
      before: beforeType,
      after: afterType,
    });
  }

  const beforeEnum = asEnumSet(before.enum);
  const afterEnum = asEnumSet(after.enum);
  if (beforeEnum || afterEnum) {
    // A previously-open field (no enum) becoming constrained restricts callers.
    const removed = beforeEnum
      ? [...beforeEnum].filter((v) => !afterEnum || !afterEnum.has(v))
      : [];
    const added = afterEnum
      ? [...afterEnum].filter((v) => !beforeEnum || !beforeEnum.has(v))
      : [];
    const narrowed = !beforeEnum && afterEnum ? [...afterEnum] : removed;
    const widened = beforeEnum && !afterEnum ? ["<unconstrained>"] : added;

    if ((!beforeEnum && afterEnum) || removed.length > 0) {
      changes.push({
        kind: "tool-enum-narrowed",
        severity: "breaking",
        subject: tool,
        field,
        detail: !beforeEnum
          ? `Tool "${tool}" property "${field}" is now restricted to an enum — previously any value was allowed.`
          : `Tool "${tool}" property "${field}" enum dropped value(s): ${narrowed.join(", ")}.`,
      });
    }
    if ((beforeEnum && !afterEnum) || added.length > 0) {
      changes.push({
        kind: "tool-enum-widened",
        severity: "additive",
        subject: tool,
        field,
        detail:
          beforeEnum && !afterEnum
            ? `Tool "${tool}" property "${field}" enum removed — any value now allowed.`
            : `Tool "${tool}" property "${field}" enum added value(s): ${widened.join(", ")}.`,
      });
    }
  }
}

function diffAnnotations(
  name: string,
  before: SnapshotTool["annotations"],
  after: SnapshotTool["annotations"],
  changes: Change[]
): void {
  const b = before ?? {};
  const a = after ?? {};

  // A safety guarantee being dropped or reversed is a security signal: a tool
  // that was read-only becoming mutating, or non-destructive becoming
  // destructive, can slip past a human who trusted the earlier annotation.
  const readOnlyWeakened = b.readOnlyHint === true && a.readOnlyHint !== true;
  const destructiveWeakened =
    b.destructiveHint !== true && a.destructiveHint === true;
  if (readOnlyWeakened) {
    changes.push({
      kind: "tool-annotation-weakened",
      severity: "security",
      subject: name,
      field: "readOnlyHint",
      detail: `Tool "${name}" is no longer marked read-only (readOnlyHint dropped) — it may now mutate state.`,
    });
  }
  if (destructiveWeakened) {
    changes.push({
      kind: "tool-annotation-weakened",
      severity: "security",
      subject: name,
      field: "destructiveHint",
      detail: `Tool "${name}" is now marked destructive (destructiveHint=true).`,
    });
  }

  for (const key of ["readOnlyHint", "destructiveHint", "idempotentHint"] as const) {
    if ((readOnlyWeakened && key === "readOnlyHint") ||
        (destructiveWeakened && key === "destructiveHint")) {
      continue; // already reported as a weakening
    }
    if (b[key] !== a[key]) {
      changes.push({
        kind: "tool-annotation-changed",
        severity: "info",
        subject: name,
        field: key,
        detail: `Tool "${name}" annotation ${key} changed from ${fmt(b[key])} to ${fmt(a[key])}.`,
        before: fmt(b[key]),
        after: fmt(a[key]),
      });
    }
  }
}

// ── Resources ─────────────────────────────────────────────────────────────

function diffResources(
  baseline: SnapshotResource[],
  current: SnapshotResource[],
  changes: Change[]
): void {
  const baseMap = byKey(baseline, (r) => r.uri);
  const curMap = byKey(current, (r) => r.uri);
  for (const [uri] of baseMap) {
    if (!curMap.has(uri)) {
      changes.push({
        kind: "resource-removed",
        severity: "breaking",
        subject: uri,
        detail: `Resource "${uri}" was removed.`,
      });
    }
  }
  for (const [uri] of curMap) {
    if (!baseMap.has(uri)) {
      changes.push({
        kind: "resource-added",
        severity: "additive",
        subject: uri,
        detail: `Resource "${uri}" was added.`,
      });
    }
  }
  for (const [uri, before] of baseMap) {
    const after = curMap.get(uri);
    if (after && (before.description ?? "") !== (after.description ?? "")) {
      changes.push({
        kind: "resource-description-changed",
        severity: "info",
        subject: uri,
        detail: `Resource "${uri}" description changed.`,
        before: before.description ?? "",
        after: after.description ?? "",
      });
    }
  }
}

// ── Prompts ────────────────────────────────────────────────────────────────

function diffPrompts(
  baseline: SnapshotPrompt[],
  current: SnapshotPrompt[],
  changes: Change[]
): void {
  const baseMap = byKey(baseline, (p) => p.name);
  const curMap = byKey(current, (p) => p.name);
  for (const [name] of baseMap) {
    if (!curMap.has(name)) {
      changes.push({
        kind: "prompt-removed",
        severity: "breaking",
        subject: name,
        detail: `Prompt "${name}" was removed.`,
      });
    }
  }
  for (const [name] of curMap) {
    if (!baseMap.has(name)) {
      changes.push({
        kind: "prompt-added",
        severity: "additive",
        subject: name,
        detail: `Prompt "${name}" was added.`,
      });
    }
  }
  for (const [name, before] of baseMap) {
    const after = curMap.get(name);
    if (!after) continue;

    const beforeArgs = byKey(before.arguments ?? [], (a) => a.name);
    const afterArgs = byKey(after.arguments ?? [], (a) => a.name);
    for (const [arg, spec] of afterArgs) {
      const prev = beforeArgs.get(arg);
      const nowRequired = spec.required === true;
      const wasRequired = prev?.required === true;
      if (nowRequired && !wasRequired) {
        changes.push({
          kind: "prompt-required-arg-added",
          severity: "breaking",
          subject: name,
          field: arg,
          detail: prev
            ? `Prompt "${name}" argument "${arg}" is now required.`
            : `Prompt "${name}" added a required argument "${arg}".`,
        });
      }
    }
    for (const [arg] of beforeArgs) {
      if (!afterArgs.has(arg)) {
        changes.push({
          kind: "prompt-arg-removed",
          severity: "breaking",
          subject: name,
          field: arg,
          detail: `Prompt "${name}" removed argument "${arg}".`,
        });
      }
    }
    if ((before.description ?? "") !== (after.description ?? "")) {
      changes.push({
        kind: "prompt-description-changed",
        severity: "info",
        subject: name,
        detail: `Prompt "${name}" description changed.`,
        before: before.description ?? "",
        after: after.description ?? "",
      });
    }
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────

function byKey<T>(items: T[], key: (item: T) => string): Map<string, T> {
  const map = new Map<string, T>();
  for (const item of items) map.set(key(item), item);
  return map;
}

function asProps(props: unknown): Record<string, Record<string, unknown>> {
  if (props === null || typeof props !== "object") return {};
  const out: Record<string, Record<string, unknown>> = {};
  for (const [k, v] of Object.entries(props as Record<string, unknown>)) {
    out[k] = v !== null && typeof v === "object" ? (v as Record<string, unknown>) : {};
  }
  return out;
}

/** JSON Schema `type` may be a string or an array of strings. Normalize both. */
function normType(type: unknown): string {
  if (Array.isArray(type)) return [...type.map(String)].sort().join("|");
  if (typeof type === "string") return type;
  return "";
}

function asEnumSet(value: unknown): Set<string> | null {
  if (!Array.isArray(value)) return null;
  return new Set(value.map((v) => JSON.stringify(v)));
}

function fmt(value: unknown): string {
  return value === undefined ? "unset" : String(value);
}
