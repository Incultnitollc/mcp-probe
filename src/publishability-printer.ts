import chalk from "chalk";
import type { PublishabilityResult, PublishabilityScore } from "./types.js";

function colorByBand(c: number): (s: string) => string {
  if (c >= 85) return chalk.green;
  if (c >= 65) return chalk.yellow;
  if (c >= 40) return chalk.magenta;
  return chalk.red;
}

export function renderPublishabilityBlock(
  results: PublishabilityResult[],
  noColor: boolean,
  score?: PublishabilityScore
): string {
  const C = noColor
    ? {
        green: (s: string) => s,
        red: (s: string) => s,
        yellow: (s: string) => s,
        dim: (s: string) => s,
        bold: (s: string) => s,
      }
    : {
        green: chalk.green,
        red: chalk.red,
        yellow: chalk.yellow,
        dim: chalk.dim,
        bold: chalk.bold,
      };

  const lines: string[] = [];
  lines.push(C.bold("\n  Publishability\n"));

  for (const r of results) {
    const marker =
      r.severity === "info"
        ? C.dim("SKIP")
        : r.passed
        ? C.green("PASS")
        : C.red("FAIL");
    lines.push(`    ${marker}  ${r.check.padEnd(28)} ${C.dim(r.message)}`);
    if (!r.passed && r.perToolFailures?.length) {
      for (const f of r.perToolFailures.slice(0, 3)) {
        lines.push(`           ${C.dim("→")} ${f.tool}: ${f.reason}`);
      }
      if (r.perToolFailures.length > 3) {
        lines.push(
          `           ${C.dim(`+${r.perToolFailures.length - 3} more`)}`
        );
      }
    }
  }

  if (score) {
    const colorize = noColor ? (s: string) => s : colorByBand(score.composite);
    lines.push("");
    lines.push(
      `  Publishability score: ${colorize(`${score.composite} / 100`)}  (${score.bandName}, ${score.grade})`
    );
    lines.push(
      `    Protocol:           ${score.byDomain.protocol.score} / 100${
        score.byDomain.protocol.hardZero ? " (hard zero)" : ""
      }`
    );
    lines.push(
      `    Edge cases:         ${score.byDomain.edgeCases.score} / 100`
    );
    lines.push(
      `    Publishability:     ${score.byDomain.publishability.score} / 100`
    );
    if (score.capsApplied.length > 0) {
      lines.push(`  Caps applied:`);
      for (const cap of score.capsApplied) {
        lines.push(`    ${C.yellow(`≤${cap.ceiling}`)}  ${cap.reason}`);
      }
    } else {
      lines.push(`  Caps applied:       none`);
    }
  }

  return lines.join("\n");
}
