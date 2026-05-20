import type {
  InspectResult,
  PublishabilityScore,
  PublishabilityResult,
  PublishabilityCheckId,
} from "./types.js";

const DEDUCTIONS: Record<PublishabilityCheckId, number> = {
  "description-five-axis": 50,
  "mutation-legibility": 30,
  "enum-shape": 20,
  "distribution-metadata": 20,
  "anti-purpose-clause": 0,
};

function protocolScore(r: InspectResult): { score: number; hardZero: boolean } {
  // Hard zero on compliance errors related to transport/initialize
  const hardZero =
    r.complianceIssues.some(
      (i) =>
        i.severity === "error" &&
        /initialize|transport|connect/i.test(i.check + " " + i.message)
    );
  if (hardZero) return { score: 0, hardZero: true };

  let s = 100;
  s -= r.score.complianceErrors * 25;
  s -= r.score.complianceWarnings * 5;
  return { score: Math.max(s, 0), hardZero: false };
}

function edgeCaseScore(r: InspectResult): { score: number } {
  const toolCallRate =
    r.score.toolsTotal > 0 ? r.score.toolsCallable / r.score.toolsTotal : 1;
  const propertyCount = r.tools.reduce(
    (n, t) => n + Object.keys(t.inputSchema?.properties ?? {}).length,
    0
  );
  const denom = Math.max(Math.min(propertyCount, 50), 1);
  const schemaCleanRate = Math.max(1 - r.score.schemaWarnings / denom, 0);
  const sampleArgsRate = 1.0;
  const sub =
    (0.5 * toolCallRate + 0.3 * schemaCleanRate + 0.2 * sampleArgsRate) * 100;
  return { score: Math.round(sub) };
}

function publishabilityDomainScore(
  results: PublishabilityResult[]
): { score: number; failures: PublishabilityCheckId[] } {
  let s = 100;
  const failures: PublishabilityCheckId[] = [];
  for (const r of results) {
    if (!r.passed && r.severity !== "info") {
      s -= DEDUCTIONS[r.check] ?? 0;
      failures.push(r.check);
    }
  }
  return { score: Math.max(s, 0), failures };
}

function gradeFromComposite(c: number): PublishabilityScore["grade"] {
  if (c >= 85) return "A";
  if (c >= 65) return "B";
  if (c >= 50) return "C";
  if (c >= 40) return "D";
  return "F";
}

function bandFromComposite(c: number): PublishabilityScore["bandName"] {
  if (c >= 85) return "Publishable";
  if (c >= 65) return "Almost";
  if (c >= 40) return "Rough";
  return "Not ready";
}

export function computeScore(result: InspectResult): PublishabilityScore {
  const protocol = protocolScore(result);
  const edge = edgeCaseScore(result);
  const pub = publishabilityDomainScore(result.publishabilityResults ?? []);

  let composite = Math.round(
    protocol.score * 0.35 + edge.score * 0.25 + pub.score * 0.4
  );

  const capsApplied: PublishabilityScore["capsApplied"] = [];

  if (protocol.hardZero) {
    composite = Math.min(composite, 50);
    capsApplied.push({ reason: "protocol hard-zero (initialize/transport failed)", ceiling: 50 });
  }

  // Description-five-axis per-tool cap
  const fiveAxis = (result.publishabilityResults ?? []).find(
    (r) => r.check === "description-five-axis"
  );
  if (fiveAxis && !fiveAxis.passed) {
    const failedTools = fiveAxis.evidence?.failedTools ?? [];
    const total = result.tools.length;
    if (total > 0 && failedTools.length / total >= 0.5) {
      composite = Math.min(composite, 60);
      capsApplied.push({
        reason: "description-five-axis: ≥50% of tools below per-tool axis threshold",
        ceiling: 60,
      });
    }
  }

  const passed = (result.publishabilityResults ?? []).filter(
    (r) => r.passed
  ).length;
  const failed = (result.publishabilityResults ?? []).filter(
    (r) => !r.passed
  ).length;

  return {
    composite,
    grade: gradeFromComposite(composite),
    bandName: bandFromComposite(composite),
    passed,
    failed,
    capsApplied,
    byDomain: {
      protocol,
      edgeCases: edge,
      publishability: pub,
    },
  };
}
