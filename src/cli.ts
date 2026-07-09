#!/usr/bin/env node

import { Command } from "commander";
import { writeFileSync } from "node:fs";
import { inspectServer } from "./client.js";
import { benchServer } from "./bench.js";
import { watchServer } from "./watcher.js";
import { createProbeMcpServer } from "./mcp-server.js";
import { parseTarget, createTransport } from "./transport.js";
import type { TransportKind } from "./types.js";
import { captureSnapshot, parseFailOn, evaluateGate } from "./contract.js";
import { writeSnapshot, readSnapshot, type SnapshotDocument } from "./snapshot.js";
import { diffSnapshots, type DiffReport } from "./diff.js";
import { renderDiffTerminal, renderDiffMarkdown } from "./diff-printer.js";

const program = new Command();

// ── Shared helpers for the contract commands (record / diff / gate) ─────────

function validateTransportKind(kind?: string): void {
  if (kind && !["stdio", "sse", "http"].includes(kind)) {
    throw new Error(`Invalid --transport "${kind}". Expected stdio, sse, or http.`);
  }
}

function errExit(error: unknown): never {
  console.error("Error:", error instanceof Error ? error.message : error);
  process.exit(1);
}

const collectHeader = (value: string, prev: string[] = []): string[] => [...prev, value];

interface CompareOpts {
  baseline: string;
  against?: string;
  transport?: string;
  header: string[];
  timeout: string;
}

/** Resolve the baseline snapshot plus the "current" surface (live target or a second file). */
async function resolveSnapshots(
  target: string | undefined,
  opts: CompareOpts
): Promise<{ baseline: SnapshotDocument; current: SnapshotDocument }> {
  const baseline = readSnapshot(opts.baseline);
  let current: SnapshotDocument;
  if (opts.against) {
    if (target) {
      throw new Error("Provide either a <target> or --against <file>, not both.");
    }
    current = readSnapshot(opts.against);
  } else if (target) {
    validateTransportKind(opts.transport);
    const spec = parseTarget(target, {
      transport: opts.transport as TransportKind | undefined,
      headers: opts.header,
    });
    const transport = createTransport(spec);
    current = await captureSnapshot(transport, { timeout: parseInt(opts.timeout, 10) });
  } else {
    throw new Error(
      "Nothing to compare: pass a <target> to record the live surface, or --against <file>."
    );
  }
  return { baseline, current };
}

function emitDiff(report: DiffReport, opts: { json?: boolean; markdown?: string }): void {
  if (opts.markdown) {
    writeFileSync(opts.markdown, renderDiffMarkdown(report) + "\n", "utf-8");
  }
  if (opts.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(renderDiffTerminal(report));
  }
}

program
  .name("mcp-probe")
  .description("One command to diagnose your MCP server (stdio, SSE, or Streamable HTTP)")
  .version("1.2.0");

program
  .command("test")
  .description("Connect to an MCP server and run a full inspection")
  .argument(
    "<target>",
    'MCP server target. A command (e.g. "npx -y @modelcontextprotocol/server-everything") for stdio, or a URL (e.g. "https://example.com/mcp") for remote servers.'
  )
  .option("--json", "Output results as JSON", false)
  .option("--timeout <ms>", "Timeout per operation in milliseconds", "30000")
  .option("--html <path>", "Save HTML report to file")
  .option(
    "--transport <kind>",
    "Force transport: stdio | sse | http (auto-detected from target by default)"
  )
  .option(
    "--header <header>",
    'Header for remote transports, "Name: value". Repeatable.',
    (value: string, prev: string[] = []) => [...prev, value],
    [] as string[]
  )
  .option(
    "--verbose",
    "Print the args mcp-probe sent for every tool/prompt call (PASS rows too)",
    false
  )
  .option(
    "--publishability",
    "Run publishability suite (5 checks + 0-100 composite)",
    false
  )
  .option(
    "--publishability-only",
    "Run publishability suite only — skip tool calls, resource reads, prompt gets",
    false
  )
  .option(
    "--fail-under <score>",
    "Exit non-zero if publishability composite below threshold (0–100)",
    "0"
  )
  .option(
    "--package <path>",
    "Path to package.json for distribution-metadata check (publishability)",
    ""
  )
  .action(
    async (
      target: string,
      opts: {
        json: boolean;
        timeout: string;
        html?: string;
        transport?: string;
        header: string[];
        verbose: boolean;
        publishability: boolean;
        publishabilityOnly: boolean;
        failUnder: string;
        package: string;
      }
    ) => {
      try {
        if (
          opts.transport &&
          !["stdio", "sse", "http"].includes(opts.transport)
        ) {
          throw new Error(
            `Invalid --transport "${opts.transport}". Expected stdio, sse, or http.`
          );
        }

        const spec = parseTarget(target, {
          transport: opts.transport as TransportKind | undefined,
          headers: opts.header,
        });
        const transport = createTransport(spec);

        const result = await inspectServer(transport, {
          json: opts.json,
          timeout: parseInt(opts.timeout, 10),
          html: opts.html,
          verbose: opts.verbose,
          publishability: opts.publishability || opts.publishabilityOnly,
          publishabilityOnly: opts.publishabilityOnly,
          packageJsonPath: opts.package || undefined,
        });

        const { score } = result;
        const allPassed =
          score.toolsCallable === score.toolsTotal &&
          score.resourcesReadable === score.resourcesTotal &&
          score.promptsGettable === score.promptsTotal &&
          score.schemaErrors === 0;

        const failUnder = parseInt(opts.failUnder, 10);
        if (failUnder > 0 && result.publishabilityScore) {
          if (result.publishabilityScore.composite < failUnder) {
            process.exit(1);
          }
        }

        if (!opts.publishabilityOnly && !allPassed) {
          process.exit(1);
        }
      } catch (error) {
        console.error(
          "Error:",
          error instanceof Error ? error.message : error
        );
        process.exit(1);
      }
    }
  );

program
  .command("score")
  .description("Run publishability suite only — shorthand for `test --publishability-only`")
  .argument("<target>", "MCP server target (command or URL)")
  .option("--json", "Output results as JSON", false)
  .option("--timeout <ms>", "Timeout per operation in milliseconds", "30000")
  .option("--html <path>", "Save HTML report to file")
  .option("--package <path>", "Path to package.json for distribution-metadata check", "")
  .option("--fail-under <score>", "Exit non-zero if composite below threshold (0–100)", "0")
  .option(
    "--full",
    "Also run standard inspection (equivalent to `test --publishability`)",
    false
  )
  .option("--transport <kind>", "Force transport: stdio | sse | http")
  .option(
    "--header <header>",
    'Header for remote transports. Repeatable.',
    (value: string, prev: string[] = []) => [...prev, value],
    [] as string[]
  )
  .action(
    async (
      target: string,
      opts: {
        json: boolean;
        timeout: string;
        html?: string;
        package: string;
        failUnder: string;
        full: boolean;
        transport?: string;
        header: string[];
      }
    ) => {
      try {
        if (opts.transport && !["stdio", "sse", "http"].includes(opts.transport)) {
          throw new Error(`Invalid --transport "${opts.transport}".`);
        }
        const spec = parseTarget(target, {
          transport: opts.transport as TransportKind | undefined,
          headers: opts.header,
        });
        const transport = createTransport(spec);
        const result = await inspectServer(transport, {
          json: opts.json,
          timeout: parseInt(opts.timeout, 10),
          html: opts.html,
          publishability: true,
          publishabilityOnly: !opts.full,
          packageJsonPath: opts.package || undefined,
        });
        const failUnder = parseInt(opts.failUnder, 10);
        if (failUnder > 0 && result.publishabilityScore) {
          if (result.publishabilityScore.composite < failUnder) {
            process.exit(1);
          }
        }
      } catch (error) {
        console.error("Error:", error instanceof Error ? error.message : error);
        process.exit(1);
      }
    }
  );

program
  .command("bench")
  .description("Benchmark tool latency on an MCP server")
  .argument("<target>", "MCP server target (command or URL)")
  .option("--iterations <n>", "Number of iterations per tool", "10")
  .option("--json", "Output results as JSON", false)
  .option("--timeout <ms>", "Timeout per operation in milliseconds", "30000")
  .option("--transport <kind>", "Force transport: stdio | sse | http")
  .option(
    "--header <header>",
    'Header for remote transports. Repeatable.',
    (value: string, prev: string[] = []) => [...prev, value],
    [] as string[]
  )
  .action(
    async (
      target: string,
      opts: {
        iterations: string;
        json: boolean;
        timeout: string;
        transport?: string;
        header: string[];
      }
    ) => {
      try {
        if (opts.transport && !["stdio", "sse", "http"].includes(opts.transport)) {
          throw new Error(`Invalid --transport "${opts.transport}".`);
        }
        const spec = parseTarget(target, {
          transport: opts.transport as TransportKind | undefined,
          headers: opts.header,
        });
        const transport = createTransport(spec);
        await benchServer(transport, {
          iterations: parseInt(opts.iterations, 10),
          json: opts.json,
          timeout: parseInt(opts.timeout, 10),
        });
      } catch (error) {
        console.error("Error:", error instanceof Error ? error.message : error);
        process.exit(1);
      }
    }
  );

program
  .command("watch")
  .description("Watch for file changes and re-run inspection")
  .argument("<target>", "MCP server target (command or URL)")
  .option("--path <dir>", "Directory to watch for changes", ".")
  .option("--timeout <ms>", "Timeout per operation in milliseconds", "30000")
  .option("--transport <kind>", "Force transport: stdio | sse | http")
  .option(
    "--header <header>",
    'Header for remote transports. Repeatable.',
    (value: string, prev: string[] = []) => [...prev, value],
    [] as string[]
  )
  .option("--debounce <ms>", "Debounce delay in milliseconds", "500")
  .action(
    async (
      target: string,
      opts: {
        path: string;
        timeout: string;
        transport?: string;
        header: string[];
        debounce: string;
      }
    ) => {
      try {
        if (opts.transport && !["stdio", "sse", "http"].includes(opts.transport)) {
          throw new Error(`Invalid --transport "${opts.transport}".`);
        }
        await watchServer({
          target,
          parseOpts: {
            transport: opts.transport as TransportKind | undefined,
            headers: opts.header,
          },
          inspectOpts: {
            json: false,
            timeout: parseInt(opts.timeout, 10),
          },
          watchPath: opts.path,
          debounceMs: parseInt(opts.debounce, 10),
        });
      } catch (error) {
        console.error("Error:", error instanceof Error ? error.message : error);
        process.exit(1);
      }
    }
  );

program
  .command("serve")
  .description(
    "Run mcp-probe as an MCP server (stdio) exposing probe_server + score_server tools"
  )
  .action(async () => {
    try {
      const { StdioServerTransport } = await import(
        "@modelcontextprotocol/sdk/server/stdio.js"
      );
      const server = createProbeMcpServer();
      await server.connect(new StdioServerTransport());
    } catch (error) {
      console.error("Error:", error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command("record")
  .description(
    "Record a server's contract surface to a .mcpvcr snapshot (lists only — no tool calls)"
  )
  .argument("<target>", "MCP server target (command or URL)")
  .option("--out <path>", "Snapshot output path", "mcp-snapshot.mcpvcr")
  .option(
    "--stamp",
    "Include a recordedAt timestamp (off by default so committed snapshots stay deterministic)",
    false
  )
  .option("--timeout <ms>", "Timeout per operation in milliseconds", "30000")
  .option("--transport <kind>", "Force transport: stdio | sse | http")
  .option(
    "--header <header>",
    'Header for remote transports, "Name: value". Repeatable.',
    collectHeader,
    [] as string[]
  )
  .action(
    async (
      target: string,
      opts: {
        out: string;
        stamp: boolean;
        timeout: string;
        transport?: string;
        header: string[];
      }
    ) => {
      try {
        validateTransportKind(opts.transport);
        const spec = parseTarget(target, {
          transport: opts.transport as TransportKind | undefined,
          headers: opts.header,
        });
        const transport = createTransport(spec);
        const snapshot = await captureSnapshot(transport, {
          timeout: parseInt(opts.timeout, 10),
          recordedAt: opts.stamp ? new Date().toISOString() : undefined,
        });
        writeSnapshot(opts.out, snapshot);
        console.log(
          `Recorded ${snapshot.tools.length} tools, ${snapshot.resources.length} resources, ${snapshot.prompts.length} prompts → ${opts.out}`
        );
      } catch (error) {
        errExit(error);
      }
    }
  );

program
  .command("diff")
  .description(
    "Diff a live server (or a second snapshot) against a recorded .mcpvcr baseline"
  )
  .argument(
    "[target]",
    "MCP server target for the current surface (command or URL). Omit when using --against."
  )
  .requiredOption("--baseline <path>", "Recorded .mcpvcr baseline to compare against")
  .option("--against <path>", "Compare against a second .mcpvcr file instead of a live target")
  .option("--json", "Output the diff report as JSON", false)
  .option("--markdown <path>", "Write a PR-comment markdown report to this file")
  .option("--timeout <ms>", "Timeout per operation in milliseconds", "30000")
  .option("--transport <kind>", "Force transport: stdio | sse | http")
  .option(
    "--header <header>",
    'Header for remote transports. Repeatable.',
    collectHeader,
    [] as string[]
  )
  .action(
    async (
      target: string | undefined,
      opts: CompareOpts & { json: boolean; markdown?: string }
    ) => {
      try {
        const { baseline, current } = await resolveSnapshots(target, opts);
        const report = diffSnapshots(baseline, current);
        emitDiff(report, opts);
      } catch (error) {
        errExit(error);
      }
    }
  );

program
  .command("gate")
  .description(
    "Fail (exit 1) when the contract diff contains breaking or security changes"
  )
  .argument(
    "[target]",
    "MCP server target (command or URL). Omit when using --against."
  )
  .requiredOption("--baseline <path>", "Recorded .mcpvcr baseline to compare against")
  .option("--against <path>", "Compare against a second .mcpvcr file instead of a live target")
  .option(
    "--fail-on <list>",
    "Comma-separated severities that fail the gate: breaking, security, additive, info",
    "breaking,security"
  )
  .option("--json", "Output the diff report as JSON", false)
  .option("--markdown <path>", "Write a PR-comment markdown report to this file")
  .option("--timeout <ms>", "Timeout per operation in milliseconds", "30000")
  .option("--transport <kind>", "Force transport: stdio | sse | http")
  .option(
    "--header <header>",
    'Header for remote transports. Repeatable.',
    collectHeader,
    [] as string[]
  )
  .action(
    async (
      target: string | undefined,
      opts: CompareOpts & { failOn: string; json: boolean; markdown?: string }
    ) => {
      try {
        const failOn = parseFailOn(opts.failOn);
        const { baseline, current } = await resolveSnapshots(target, opts);
        const report = diffSnapshots(baseline, current);
        emitDiff(report, opts);
        const gate = evaluateGate(report, failOn);
        if (gate.failed) {
          console.error(
            `\nGate FAILED: ${gate.totalViolations} disallowed change(s) [${failOn.join(", ")}].`
          );
          process.exit(1);
        }
        console.log(`\nGate passed — no ${failOn.join(" / ")} changes.`);
      } catch (error) {
        errExit(error);
      }
    }
  );

program.parse();
