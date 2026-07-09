import chalk from "chalk";
import type { Change, ChangeSeverity, DiffReport } from "./diff.js";

const SEVERITY_ORDER: ChangeSeverity[] = ["breaking", "security", "additive", "info"];

const SEVERITY_LABEL: Record<ChangeSeverity, string> = {
  breaking: "BREAKING",
  security: "SECURITY",
  additive: "ADDITIVE",
  info: "INFO",
};

const SEVERITY_EMOJI: Record<ChangeSeverity, string> = {
  breaking: "❌",
  security: "⚠️",
  additive: "✅",
  info: "ℹ️",
};

function paint(sev: ChangeSeverity, text: string): string {
  switch (sev) {
    case "breaking":
      return chalk.red.bold(text);
    case "security":
      return chalk.yellow.bold(text);
    case "additive":
      return chalk.green(text);
    case "info":
      return chalk.dim(text);
  }
}

/** Human-readable terminal diff. */
export function renderDiffTerminal(report: DiffReport): string {
  const lines: string[] = [];
  lines.push("");
  lines.push(chalk.bold("═══════════════════════════════════════════"));
  lines.push(chalk.bold("  MCP Contract Diff"));
  if (report.baselineServer || report.currentServer) {
    lines.push(
      chalk.dim(
        `  ${report.baselineServer ?? "?"} → ${report.currentServer ?? "?"}`
      )
    );
  }
  lines.push(chalk.bold("═══════════════════════════════════════════"));
  lines.push("");

  if (report.identical) {
    lines.push(chalk.green("✓ No contract changes — surface is identical."));
    lines.push("");
    return lines.join("\n");
  }

  lines.push(summaryLine(report));
  lines.push("");

  for (const sev of SEVERITY_ORDER) {
    const group = report.changes.filter((c) => c.severity === sev);
    if (group.length === 0) continue;
    lines.push(paint(sev, `${SEVERITY_EMOJI[sev]} ${SEVERITY_LABEL[sev]} (${group.length})`));
    for (const c of group) {
      lines.push(`  ${paint(sev, "•")} ${c.detail}`);
      const detail = beforeAfter(c);
      if (detail) lines.push(chalk.dim(`      ${detail}`));
    }
    lines.push("");
  }
  return lines.join("\n");
}

/** GitHub-flavored markdown for a PR comment. */
export function renderDiffMarkdown(report: DiffReport): string {
  const lines: string[] = [];
  const route = `\`${report.baselineServer ?? "?"}\` → \`${report.currentServer ?? "?"}\``;
  lines.push(`### 🎬 MCP Contract Diff`);
  lines.push("");

  if (report.identical) {
    lines.push(`✅ **No contract changes.** The server surface matches the recorded \`.mcpvcr\` baseline (${route}).`);
    lines.push("");
    lines.push(`<sub>Powered by <a href="https://github.com/Incultnitollc/mcp-probe">mcp-probe</a> — contract testing for MCP.</sub>`);
    return lines.join("\n");
  }

  const { counts } = report;
  const verdict =
    counts.breaking > 0
      ? `❌ **${counts.breaking} breaking change${counts.breaking === 1 ? "" : "s"}** detected.`
      : counts.security > 0
        ? `⚠️ **${counts.security} security signal${counts.security === 1 ? "" : "s"}** — review before merge.`
        : `✅ **Backward-compatible.** Only additive / informational changes.`;
  lines.push(verdict);
  lines.push("");
  lines.push(
    `| Breaking | Security | Additive | Info |`,
    `|:--:|:--:|:--:|:--:|`,
    `| ${counts.breaking} | ${counts.security} | ${counts.additive} | ${counts.info} |`
  );
  lines.push("");

  for (const sev of SEVERITY_ORDER) {
    const group = report.changes.filter((c) => c.severity === sev);
    if (group.length === 0) continue;
    const open = sev === "breaking" || sev === "security" ? " open" : "";
    lines.push(
      `<details${open}><summary>${SEVERITY_EMOJI[sev]} ${SEVERITY_LABEL[sev]} (${group.length})</summary>`
    );
    lines.push("");
    for (const c of group) {
      lines.push(`- ${c.detail}`);
      const ba = beforeAfter(c);
      if (ba) lines.push(`  - ${ba}`);
    }
    lines.push("");
    lines.push(`</details>`);
    lines.push("");
  }
  lines.push(`<sub>Powered by <a href="https://github.com/Incultnitollc/mcp-probe">mcp-probe</a> — contract testing for MCP.</sub>`);
  return lines.join("\n");
}

function summaryLine(report: DiffReport): string {
  const { counts } = report;
  const parts: string[] = [];
  for (const sev of SEVERITY_ORDER) {
    if (counts[sev] > 0) parts.push(paint(sev, `${counts[sev]} ${SEVERITY_LABEL[sev].toLowerCase()}`));
  }
  return parts.join(chalk.dim("  ·  "));
}

function beforeAfter(c: Change): string | null {
  if (c.before === undefined && c.after === undefined) return null;
  const before = truncate(c.before ?? "∅");
  const after = truncate(c.after ?? "∅");
  return `"${before}" → "${after}"`;
}

function truncate(text: string, max = 140): string {
  const oneLine = text.replace(/\s+/g, " ").trim();
  return oneLine.length > max ? oneLine.slice(0, max - 1) + "…" : oneLine;
}
