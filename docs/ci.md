---
title: "MCP Server CI Pipeline (GitHub Actions): from lint to publish, with a conformance gate"
description: "A working GitHub Actions pipeline for a TypeScript MCP server — lint, type-check, unit tests, an MCP conformance gate, and tag-driven publish with OIDC provenance. Copy-pasteable YAML, with every job explained and the common pitfalls called out."
tags: [mcp, githubactions, cicd, typescript, devops]
cover_image: "https://raw.githubusercontent.com/incultnitollc/mcp-probe/main/docs/assets/og-card.png"
canonical_url: "https://github.com/Incultnitollc/mcp-probe/blob/main/docs/ci.md"
published: true
---

Most MCP server repos I've looked at have a CI file that does three things: `npm ci`, `npm run build`, `npm test`. Tests pass, the badge goes green, the package ships. Then a client connects and half the calls fail in ways no unit test would catch — wrong argument shapes, missing schema descriptions, a publish that went out without provenance, a monorepo that built the wrong package.

"Tests pass" is not a sufficient pre-publish gate for an MCP server. The contract surface is bigger than the function signatures. The schema you ship is part of the runtime behavior, the transport handshake is part of the runtime behavior, and the npm artifact you cut on tag has its own failure modes once it lands on a user's machine. CI has to cover all of that.

This is a working pipeline for a typical TypeScript MCP server: five jobs, real version pins, copy-pasteable YAML. Each job is explained underneath, with the pitfalls that have cost me the most time — `NPM_TOKEN` scope, OIDC provenance, monorepo `npm ci` traps — and an honest take on where a conformance gate helps and where it doesn't.

## What a minimum viable MCP server CI looks like

Five gates, in order, fail-fast:

1. **Lint** — ESLint on the source. Catches the obvious before anything heavy runs.
2. **Type-check** — `tsc --noEmit`. The type errors a build would catch, surfaced without producing artifacts.
3. **Unit tests** — Vitest or Jest. Whatever you have. Pure-function coverage of the tool handlers.
4. **Conformance gate** — start the server, enumerate every tool/resource/prompt, run them with auto-generated arguments, check the schemas. Fail on missing descriptions, malformed required fields, tools that error on a basic call.
5. **Publish** — on a version tag only, with `--provenance` and OIDC trusted publishing.

The order matters. Lint is cheapest, type-check is cheap, unit tests are medium, conformance needs a running server, publish only fires once on tag. Putting them in this order means a typo fails in ten seconds instead of after a four-minute build.

## The pipeline

Save as `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  release:
    types: [published]

# Required for OIDC publishing on tag.
permissions:
  contents: read
  id-token: write

jobs:
  # ---------------------------------------------------------------------------
  # Gate 1 — Lint. Fast. Runs first so typos fail in seconds.
  # ---------------------------------------------------------------------------
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm
      - run: npm ci
      - run: npx eslint . --max-warnings=0

  # ---------------------------------------------------------------------------
  # Gate 2 — Type-check. No emit, just the type errors.
  # ---------------------------------------------------------------------------
  typecheck:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm
      - run: npm ci
      - run: npx tsc --noEmit

  # ---------------------------------------------------------------------------
  # Gate 3 — Unit tests. Matrix across the Node versions you support.
  # ---------------------------------------------------------------------------
  test:
    runs-on: ubuntu-latest
    needs: typecheck
    strategy:
      fail-fast: false
      matrix:
        node-version: ["20", "22"]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm
      - run: npm ci
      - run: npm run build
      - run: npm test

  # ---------------------------------------------------------------------------
  # Gate 4 — Conformance. Boot the server, walk every tool/resource/prompt.
  # ---------------------------------------------------------------------------
  conformance:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm
      - run: npm ci
      - run: npm run build
      - name: Conformance gate
        run: npx -y @incultnitollc/mcp-probe@1.0.0 test "node dist/index.js" --json > report.json
      - name: Upload conformance report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: conformance-report-${{ github.sha }}
          path: report.json

  # ---------------------------------------------------------------------------
  # Gate 5 — Publish. Only on a published GitHub release tag. OIDC provenance.
  # ---------------------------------------------------------------------------
  publish:
    runs-on: ubuntu-latest
    needs: conformance
    if: github.event_name == 'release' && github.event.action == 'published'
    environment: npm-publish
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          registry-url: "https://registry.npmjs.org"
      - run: npm ci
      - run: npm run build
      - run: npm publish --provenance --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

That's the whole pipeline. Five jobs, each chained on `needs:`, each pinned to `actions/checkout@v4` and `actions/setup-node@v4`. The pinned version of `@incultnitollc/mcp-probe@1.0.0` on the conformance gate is the version pin you want — don't float `latest` into CI, ever.

## Job 1 — Lint (ESLint)

The cheapest gate, first. It catches unused imports, missing returns, the `any` you forgot to type, and the lint rules your team agreed on six months ago and nobody enforces locally.

`--max-warnings=0` is the important part. If ESLint reports a warning, the job fails. Warnings you tolerate today become the noise that hides a real warning six months from now. Fix, suppress with a comment, or change the rule level — don't let them accumulate.

If your project uses `eslint.config.js` (flat config) or `.eslintrc.json`, the command stays the same — ESLint picks up whichever it finds.

## Job 2 — Type-check (tsc --noEmit)

`tsc --noEmit` runs the TypeScript compiler with no output, just type errors. Faster than a full build because it skips emit, and it catches errors that don't surface in `npm run build` if your build is bundled (`tsup`, `esbuild`, `swc`) — bundlers often skip strict type checks for speed.

Keep this as a separate job from unit tests for failure clarity. When a type error shows up in CI, you want the failure to say "type-check failed at line X" not "tests failed because the build broke."

For MCP servers specifically, type-check catches one failure I've seen often: a tool handler whose return type doesn't match the `CallToolResult` shape from `@modelcontextprotocol/sdk`. The bundler emits it. The runtime client silently sees malformed responses. The type-check catches it before anyone notices.

## Job 3 — Unit tests (Vitest or Jest)

The matrix runs Node 20 and 22 in parallel. Pick whatever your `engines` field in `package.json` supports.

`fail-fast: false` is deliberate. If Node 20 passes and 22 fails, you want both results — knowing the failure is Node-22-specific is useful. With `fail-fast: true` (the default), one failure cancels the other and you lose half the signal.

The order is `npm ci → npm run build → npm test`. Build before test because most MCP server test suites import from `dist/`, not source — they're testing the published shape. If your tests import from source directly, drop the build step here, but you'll still need it in the conformance job.

## Job 4 — The conformance gate

The gate "tests pass" doesn't cover. Unit tests check handler functions in isolation. Conformance tests the actual MCP surface: does the server start, does it advertise the tools you think it does, do the schemas match what the SDK expects, do the tools respond when called.

You can write this yourself. Spawn the server as a subprocess, send `initialize`, then `tools/list`, then `tools/call` for each tool with arguments generated from the input schema. Check the responses. Exit 1 on any failure. Most teams don't, because building it from scratch is two days of work and then you own it forever.

The shortcut is an existing CLI. The example uses `@incultnitollc/mcp-probe@1.0.0` — full disclosure, I wrote it. MIT, source on [GitHub](https://github.com/Incultnitollc/mcp-probe). It enumerates every tool/resource/prompt, runs them with auto-generated arguments matching the declared schema, validates the load-bearing fields (descriptions on required parameters, well-formed required arrays, no malformed types), and exits non-zero on any failure. The `--json` flag dumps a structured scorecard you can upload as an artifact and diff across commits.

The shape of the scorecard:

```json
{
  "toolsCallable": 12,
  "toolsTotal": 13,
  "resourcesReadable": 7,
  "resourcesTotal": 7,
  "promptsGettable": 3,
  "promptsTotal": 4,
  "schemaErrors": 0,
  "schemaWarnings": 1
}
```

What to fail the build on, in order of how strict you want to be:

- **Loose:** `schemaErrors > 0` only. Fails on malformed schemas — type mismatches, missing required arrays, broken `$ref`. These are bugs that the SDK will reject anyway.
- **Standard:** `schemaErrors > 0` OR `toolsCallable < toolsTotal`. Adds "every advertised tool must respond" — a tool that throws on a basic call is a tool that shouldn't have shipped.
- **Strict:** all of the above, plus `schemaWarnings === 0`. Adds "every required parameter has a description." This is the gate I'd want on a public MCP server intended for an LLM client; the parameter descriptions are the contract the model uses to pick the right argument shape.

Pick one and write it into the job. The standard gate is what the YAML above implies (exit code 1 when callable < total). For strict, append a `jq` check:

```yaml
- name: Strict gate — fail on schema warnings
  run: jq -e '.schemaWarnings == 0' report.json
```

For more conformance-gate patterns — HTML reports, latency benchmarks, remote HTTP servers, GitLab CI, CircleCI, pre-commit hooks — see [docs/ci-example.md](./ci-example.md) in this repo. That doc is the reference for the gate itself; this doc is the pipeline around it.

## Job 5 — Publish (npm publish on tag, with OIDC provenance)

Publishing to npm from CI has had three eras. Long-lived `NPM_TOKEN` (no expiry, no scope, leaked often). Scoped tokens (better, but didn't prove the artifact came from your CI). And now OIDC trusted publishing — npm verifies the publish came from a specific GitHub Actions workflow in a specific repository, and the package gets a `provenance` attestation anyone can verify with `npm audit signatures`.

Three things make this job work:

1. **`permissions: id-token: write`** at the workflow level. Without it, GitHub doesn't mint the OIDC token, and `--provenance` fails.
2. **`registry-url`** on `setup-node`. Writes the right `.npmrc` so `npm publish` knows where to talk to.
3. **`environment: npm-publish`**. Optional — GitHub Environments gate that lets you require manual approval before publish runs.

The `if:` clause `github.event_name == 'release' && github.event.action == 'published'` means this job only runs on a GitHub Release. Not on push to `main`, not on PR, not on tag-only. Tying publish to a Release means a human is in the loop on version bump and changelog.

To use OIDC, configure it on the npm side too: in your package settings on npmjs.com, add a "Trusted Publisher" pointing at your GitHub org, repo, and workflow filename. Once configured, `NPM_TOKEN` is optional — leaving it in covers fallback. If starting fresh, drop `NODE_AUTH_TOKEN` entirely.

## Pitfalls

**`NPM_TOKEN` scope.** A legacy `NPM_TOKEN` should be a granular access token, not automation. Scope it to one package, 90-day expiry, never reuse across repos. On OIDC, delete the token entirely.

**OIDC provenance refusing to mint.** Usually one of two causes: `permissions: id-token: write` is missing or scoped to the wrong job, or the GitHub Environment has restrictions blocking OIDC. Move the permission to workflow level (as above) and check the environment allows OIDC.

**Monorepo `npm ci` traps.** If your MCP server is one package in a workspaces monorepo, `npm ci` at the root installs every package. Slow. Fix: `npm ci --workspaces=false --include-workspace-root` for root deps, then `npm ci -w packages/your-server` for one workspace.

**Tag-vs-release ambiguity.** `on: push: tags:` fires on any pushed tag, including mistakes. `on: release: types: [published]` fires only on a GitHub Release. Use release for publish.

**Conformance gate timing out on slow startups.** Some MCP servers do non-trivial work on `initialize` — load a model, open a database, hit a remote API. The default 30-second per-operation timeout can be too short. Use `--timeout 60000` or `90000` in CI.

**Build cache across matrix entries.** `cache: npm` keys on the lockfile hash. The cache is shared across matrix entries — if your build emits Node-version-specific artifacts, scope the cache key. Most TypeScript projects don't need to.

## Where a conformance gate fits, and where it doesn't

Honest about scope: a CLI conformance gate is a schema-and-handshake gate. It catches missing descriptions, malformed schemas, tools that error on a basic call, resources that fail to read, prompts that fail to render. It does not catch:

- **Runtime correctness.** A tool that returns "5" when the right answer is "7" passes — conformance checks shape, not value. Unit tests catch that.
- **LLM-side behavior.** Whether a model picks your tool over a competitor's, whether the description disambiguates — those are behaviors, not properties. The descriptions series in this repo's `docs/blog/` covers what to write; testing it needs a different evaluation loop.
- **Performance regressions.** Conformance is pass/fail on the surface. Latency drift is a separate concern — benchmark in a separate job and store as an artifact.

One of five gates. The failure modes it catches are otherwise invisible until a user files an issue, and it costs maybe thirty seconds of CI time. But it's not the whole pipeline — the other four jobs are doing most of the work.

## Next steps

Drop the YAML above into `.github/workflows/ci.yml`, replace the binary in the conformance gate with whatever you use (or build your own), and set `permissions: id-token: write` at the workflow level. Configure OIDC trusted publishing on npm. Cut a release. Watch all five gates run.

If you're shipping an MCP server and you've found other patterns that belong in CI — caching strategies for slow servers, multi-OS matrices, transport-specific gates — the discussion thread is here: [Incultnitollc/mcp-probe#11](https://github.com/Incultnitollc/mcp-probe/discussions/11). Worth comparing notes.
