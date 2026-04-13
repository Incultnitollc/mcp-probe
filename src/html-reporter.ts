import type { InspectResult } from "./types.js";

export function generateHtmlReport(result: InspectResult): string {
  const { score } = result;
  const allPassed =
    score.toolsCallable === score.toolsTotal &&
    score.resourcesReadable === score.resourcesTotal &&
    score.promptsGettable === score.promptsTotal &&
    score.schemaErrors === 0;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MCP Doctor Report${result.serverName ? ` — ${esc(result.serverName)}` : ""}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,monospace;background:#1a1a2e;color:#e0e0e0;padding:2rem}
h1{color:#fff;margin-bottom:.5rem}
.meta{color:#888;margin-bottom:2rem}
.scorecard{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin-bottom:2rem}
.score-item{background:#16213e;border-radius:8px;padding:1rem;text-align:center}
.score-value{font-size:2rem;font-weight:bold}
.score-label{color:#888;font-size:.85rem;margin-top:.25rem}
.pass{color:#4ade80}.fail{color:#f87171}.warn{color:#fbbf24}
.verdict{font-size:1.5rem;font-weight:bold;padding:1rem;border-radius:8px;text-align:center;margin-bottom:2rem}
.verdict.pass-bg{background:#065f46;color:#4ade80}
.verdict.fail-bg{background:#7f1d1d;color:#f87171}
section{margin-bottom:2rem}
h2{color:#fff;margin-bottom:1rem;border-bottom:1px solid #333;padding-bottom:.5rem}
.item{background:#16213e;border-radius:6px;padding:.75rem 1rem;margin-bottom:.5rem}
.item-header{display:flex;align-items:center;gap:.5rem;cursor:pointer}
.badge{padding:.15rem .5rem;border-radius:4px;font-size:.75rem;font-weight:bold}
.badge.pass{background:#065f46}.badge.fail{background:#7f1d1d}
.badge.warn{background:#78350f;color:#fbbf24}.badge.error{background:#7f1d1d}
.item-name{font-weight:bold;color:#fff}
.item-desc{color:#888;font-size:.85rem}
.item-duration{color:#666;font-size:.8rem;margin-left:auto}
details summary{list-style:none}
details summary::-webkit-details-marker{display:none}
.error-text{color:#f87171;margin-top:.5rem;font-family:monospace;font-size:.85rem;padding:.5rem;background:#2a1a1a;border-radius:4px}
.content-preview{margin-top:.5rem;font-family:monospace;font-size:.85rem;padding:.5rem;background:#0a0a1a;border-radius:4px;max-height:200px;overflow-y:auto;white-space:pre-wrap;color:#aaa}
</style>
</head>
<body>
<h1>MCP Doctor Report</h1>
<p class="meta">${result.serverName ? `Server: ${esc(result.serverName)} | ` : ""}Duration: ${result.durationMs}ms</p>

<div class="verdict ${allPassed ? "pass-bg" : "fail-bg"}">${allPassed ? "ALL CHECKS PASSED" : "SOME CHECKS FAILED"}</div>

<div class="scorecard">
  <div class="score-item"><div class="score-value ${score.toolsCallable === score.toolsTotal ? "pass" : "fail"}">${score.toolsTotal > 0 ? score.toolsCallable + "/" + score.toolsTotal : "N/A"}</div><div class="score-label">Tools Callable</div></div>
  <div class="score-item"><div class="score-value ${score.resourcesReadable === score.resourcesTotal ? "pass" : "fail"}">${score.resourcesTotal > 0 ? score.resourcesReadable + "/" + score.resourcesTotal : "N/A"}</div><div class="score-label">Resources Readable</div></div>
  <div class="score-item"><div class="score-value ${score.promptsGettable === score.promptsTotal ? "pass" : "fail"}">${score.promptsTotal > 0 ? score.promptsGettable + "/" + score.promptsTotal : "N/A"}</div><div class="score-label">Prompts Gettable</div></div>
  <div class="score-item"><div class="score-value ${score.schemaErrors > 0 ? "fail" : "pass"}">${score.schemaErrors}</div><div class="score-label">Schema Errors</div></div>
  <div class="score-item"><div class="score-value ${score.schemaWarnings > 0 ? "warn" : "pass"}">${score.schemaWarnings}</div><div class="score-label">Schema Warnings</div></div>
</div>

${renderTools(result)}
${renderResources(result)}
${renderPrompts(result)}
${renderSchemaIssues(result)}
${renderComplianceIssues(result)}
</body>
</html>`;
}

function renderTools(result: InspectResult): string {
  if (result.tools.length === 0) return "";
  return `<section>
<h2>Tools (${result.tools.length})</h2>
${result.tools.map((tool) => {
    const r = result.toolResults.find((t) => t.tool === tool.name);
    const status = r ? (r.success ? "pass" : "fail") : "warn";
    const label = r ? (r.success ? "PASS" : "FAIL") : "SKIP";
    const content = r?.content?.map((c) => c.text ?? "").filter(Boolean).join("\n");
    return `<div class="item"><details><summary><div class="item-header">
  <span class="badge ${status}">${label}</span>
  <span class="item-name">${esc(tool.name)}</span>
  <span class="item-desc">${esc(tool.description ?? "")}</span>
  ${r ? `<span class="item-duration">${r.durationMs}ms</span>` : ""}
</div></summary>
${r && !r.success && r.error ? `<div class="error-text">${esc(r.error)}</div>` : ""}
${content ? `<div class="content-preview">${esc(content)}</div>` : ""}
</details></div>`;
  }).join("\n")}
</section>`;
}

function renderResources(result: InspectResult): string {
  if (result.resources.length === 0) return "";
  return `<section>
<h2>Resources (${result.resources.length})</h2>
${result.resources.map((res) => {
    const r = result.resourceResults.find((rr) => rr.uri === res.uri);
    const status = r ? (r.success ? "pass" : "fail") : "warn";
    const label = r ? (r.success ? "PASS" : "FAIL") : "SKIP";
    return `<div class="item"><div class="item-header">
  <span class="badge ${status}">${label}</span>
  <span class="item-name">${esc(res.uri)}</span>
  ${r?.contentLength ? `<span class="item-desc">${r.contentLength} bytes</span>` : ""}
  ${r ? `<span class="item-duration">${r.durationMs}ms</span>` : ""}
</div>
${r && !r.success && r.error ? `<div class="error-text">${esc(r.error)}</div>` : ""}
</div>`;
  }).join("\n")}
</section>`;
}

function renderPrompts(result: InspectResult): string {
  if (result.prompts.length === 0) return "";
  return `<section>
<h2>Prompts (${result.prompts.length})</h2>
${result.prompts.map((prompt) => {
    const r = result.promptResults.find((p) => p.name === prompt.name);
    const status = r ? (r.success ? "pass" : "fail") : "warn";
    const label = r ? (r.success ? "PASS" : "FAIL") : "SKIP";
    return `<div class="item"><div class="item-header">
  <span class="badge ${status}">${label}</span>
  <span class="item-name">${esc(prompt.name)}</span>
  <span class="item-desc">${esc(prompt.description ?? "")}</span>
  ${r?.messageCount ? `<span class="item-desc">${r.messageCount} messages</span>` : ""}
  ${r ? `<span class="item-duration">${r.durationMs}ms</span>` : ""}
</div>
${r && !r.success && r.error ? `<div class="error-text">${esc(r.error)}</div>` : ""}
</div>`;
  }).join("\n")}
</section>`;
}

function renderSchemaIssues(result: InspectResult): string {
  if (result.schemaIssues.length === 0) return "";
  return `<section>
<h2>Schema Issues (${result.schemaIssues.length})</h2>
${result.schemaIssues.map((issue) => `<div class="item"><div class="item-header">
  <span class="badge ${issue.severity === "error" ? "error" : "warn"}">${issue.severity.toUpperCase()}</span>
  <span class="item-name">${esc(issue.tool)}</span>
  <span class="item-desc">${esc(issue.issue)}</span>
</div></div>`).join("\n")}
</section>`;
}

function renderComplianceIssues(result: InspectResult): string {
  if (result.complianceIssues.length === 0) return "";
  return `<section>
<h2>Compliance Issues (${result.complianceIssues.length})</h2>
${result.complianceIssues.map((issue) => `<div class="item"><div class="item-header">
  <span class="badge ${issue.severity === "error" ? "error" : "warn"}">${issue.severity.toUpperCase()}</span>
  <span class="item-name">[${esc(issue.check)}]</span>
  <span class="item-desc">${esc(issue.message)}</span>
</div></div>`).join("\n")}
</section>`;
}

function esc(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
