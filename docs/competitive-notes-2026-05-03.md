# Competitive notes — 2026-05-03

**Source:** Sunday 2026-05-03 Week-1 baseline AI citation sweep (`docs/citation-log.md`).
**Trigger:** Three tools surfaced as top sources for LLM responses to MCP-validation queries that were not on prior mcp-probe competitive radar.
**Audit budget:** 20 min. Output is a snapshot for Week-3 `docs/comparison.md` ingestion, not a finished comparison.

## At a glance

| Tool | Stars | Last push | Lang | Lane | Threat |
|---|---|---|---|---|---|
| `RHEcosystemAppEng/mcp-validation` | 7 | 2025-11-04 (6 mo) | Python | Server validation + CI | **HIGH** |
| `alpic-ai/grizzly` | 36 | 2025-06-05 (11 mo, stale) | TypeScript | GUI testing (Inspector lane) | LOW |
| `mcp-schema-validator` (PyPI, Sumedh99) | n/a | 2025-04-30 (13 mo, abandoned) | Python | LLM-output schema check (adjacent) | NEGLIGIBLE |

## 1. `RHEcosystemAppEng/mcp-validation` — Red Hat ecosystem

**What it is.** Comprehensive Python CLI + library for validating MCP servers. Pip-installable as `mcp-validation`. Ships under the Red Hat Ecosystem App Engineering org. README references a `modelcontextprotocol/mcp-validation` canonical path that **does not exist** — likely aspirational positioning to imply Anthropic-blessed status.

**What it does** (from README features list):
- Multi-transport: stdio, HTTP, SSE
- **OAuth 2.0 Dynamic Client Registration (RFC 7591)** — full browser-based auth flow
- Pre-registered OAuth + Bearer-token auth
- Container runtime support (`podman`/`docker run -i --rm <image>`)
- Security scanning via `mcp-scan` integration (vulnerability detection)
- Registry schema validation
- JSON reports + CI/CD exit codes
- Tool/prompt/resource discovery

**Scope vs mcp-probe.** Direct overlap on ~70% of mcp-probe's core feature set. `mcp-probe` advantages: 30-sec setup, scorecard methodology across 4 official servers (no equivalent in `mcp-validation`), npm-native (Node ecosystem), CLI-peer-of-Inspector positioning. `mcp-validation` advantages: OAuth depth, container runtime, security scan integration, Red Hat brand halo, PyPI domain authority.

**Why LLMs cite it (Q2 ChatGPT, Q2 Perplexity, Q3 Perplexity).**
1. Description is keyword-loaded: "Comprehensive validation tool for Model Context Protocol (MCP) servers with security analysis and JSON reporting" — hits "validation tool" + "MCP" + "JSON reporting" exactly.
2. `RHEcosystemAppEng` org name carries Red Hat brand authority; LLM training corpora and search engines weight Red Hat repos higher.
3. PyPI presence with `pip install mcp-validation` — exact-match brand owns the canonical Python package name.
4. README implies canonical/official status via the `modelcontextprotocol/mcp-validation` path reference (even though that repo doesn't exist).
5. 8 forks > 7 stars suggests downstream Red Hat consumption — internal referencing that may bleed into Red Hat blogs/docs (untested).

**Action for mcp-probe:**
- **Differentiate explicitly in `docs/comparison.md` (Week 3).** Lead with: "mcp-probe is the 30-second pre-publish CLI. mcp-validation is the deep-validation toolkit with OAuth + security scan." Don't pretend feature parity — claim the speed-of-feedback lane.
- **Update npm package description** to be more keyword-loaded. Current package likely loses to mcp-validation on exact-match queries.
- **Tag GitHub repo** with topics `mcp`, `mcp-tools`, `mcp-server`, `validation`, `testing`, `cli` (mirror grizzly's tagging strategy).
- **Position scorecards as the moat.** mcp-probe runs against 4 official Node MCP servers and reports % conformance — `mcp-validation` does single-server validation only. The cross-server comparative report is genuinely unique.
- **Time-cost note:** assume mcp-validation will continue to win Inspector-lane queries unless mcp-probe ships its own keyword-targeted artifact. Don't fight this lane head-on; own greenfield.

## 2. `alpic-ai/grizzly` — visual testing tool

**What it is.** TypeScript GUI testing tool for MCP servers. Tagline "Visual testing tool for MCP servers - on steroids". Released v0.3.0 on 2025-05-18 (one day after repo creation), no pushes since 2025-06-05 — **likely abandoned**. Homepage: `alpic.ai`. Repo properly tagged with `mcp`, `mcp-tools`.

**Scope vs mcp-probe.** Different lane entirely. grizzly is Inspector-class (visual/GUI), not CLI/automation. Competes with Anthropic's MCP Inspector, not with mcp-probe.

**Why LLMs cite it (Q8 ChatGPT).** Repo topics tagged correctly, 36 stars (highest of the three), published early in MCP timeline (May 2025) — first-mover SEO. Description "Visual testing tool for MCP servers" matches the "Anthropic MCP server diagnostic" query because of "MCP servers" + "testing" exact phrase.

**Action for mcp-probe:**
- **No direct response needed.** grizzly is GUI; mcp-probe is CLI. They serve different users.
- **Mention in `docs/comparison.md` Inspector-alternatives section as a reference** — "for visual exploration, see Inspector or grizzly; for automation/CI, mcp-probe."
- **Watch for resurrection signal.** If alpic.ai resumes pushes or releases v0.4+, reassess. Until then, treat as a dormant alternative.

## 3. `mcp-schema-validator` (PyPI, by Sumedh99)

**What it is.** v0.1.0 Python package, MIT, individual maintainer. Released 2025-04-30, no updates in 13 months. Self-described as "early-stage" with "example usage will be added in future versions."

**What it does.** Validates **LLM-generated** MCP component definitions (tools, resources, prompts) against the official MCP TS/Python SDK schemas. Use case: when an LLM writes a tool definition, this checks it's spec-compliant before runtime.

**Scope vs mcp-probe.** **Different problem entirely.** mcp-probe validates deployed/running MCP servers. mcp-schema-validator validates static LLM output before it becomes a server. Adjacent, not overlapping.

**Why LLMs cite it (Q3 ChatGPT).** PyPI domain authority + exact phrase match for "MCP schema validator". Pure SEO ghost — keyword owns the title slot.

**Action for mcp-probe:** **None.** Different problem, abandoned project. Not a real competitor. Acknowledge if asked, ignore otherwise.

## Strategic takeaways

1. **The real competitor is `RHEcosystemAppEng/mcp-validation`, not Inspector.** Prior assumption "Inspector is the incumbent we position against" is incomplete. Inspector owns the GUI/exploration lane; mcp-validation owns the deep-CLI-validation lane. mcp-probe needs to claim a third lane: the **fast pre-publish CLI** with scorecard methodology.

2. **PyPI is where validation gets won; npm is where mcp-probe lives.** Brand-collision risk: if a new user asks an LLM "which MCP validation tool" they'll be pointed at the PyPI package. mcp-probe needs npm-side keyword strength (package description, README H2s) to compete in the Node ecosystem.

3. **GitHub topics matter.** grizzly is dormant but still surfaces because of `mcp` + `mcp-tools` tags. mcp-probe should mirror this taxonomy. (Cheap action — 30 sec on github.com.)

4. **Greenfield greenfield greenfield.** None of these three competitors hold the 4 greenfield queries (Q6 CI pipeline, Q7 missing description, Q9 debug, Q10 pre-publish checklist). Single-article wins from generic blogs hold those slots. The Week 1–3 content sprint is correctly aimed.

## Open follow-ups (not done in this audit)

- [ ] Verify `mcp-validation` PyPI download volume vs `@incultnitollc/mcp-probe` npm weekly DL — if mcp-validation is dominant by ≥10×, treat as priority threat in Week 1 content positioning.
- [ ] Read `RHEcosystemAppEng/mcp-validation` issues/PRs to see if Red Hat is actively consuming it internally (signal: enterprise deployment bias in the SEO).
- [ ] Check whether `mcp-scan` (the security tool mcp-validation integrates with) has its own competitive surface — referenced as `invariantlabs-ai/mcp-scan` in their README.
- [ ] Sanity-check whether `pip install mcp-validation` actually installs the RHEcosystemAppEng tool or someone else's package — name squatting risk on PyPI.
