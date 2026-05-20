#!/usr/bin/env node

import { Command } from "commander";
import { inspectServer } from "./client.js";
import { benchServer } from "./bench.js";
import { watchServer } from "./watcher.js";
import { parseTarget, createTransport } from "./transport.js";
import type { TransportKind } from "./types.js";

const program = new Command();

program
  .name("mcp-probe")
  .description("One command to diagnose your MCP server (stdio, SSE, or Streamable HTTP)")
  .version("1.0.1");

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

program.parse();
