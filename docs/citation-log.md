# mcp-probe — AI citation sweep log

Weekly cadence: **Sunday 15:00 TPE**, ≤15 min, 10 queries × 4 LLMs = 40 cells.

**Greenfield lanes** (mcp-probe should be winning these): Q6, Q7, Q9, Q10.
**Inspector-owned lanes** (Anthropic MCP Inspector currently dominates): Q1–Q5, Q8.

For each row, mark `Y` or `N` in **Cited?** (Y = mcp-probe is cited or linked anywhere in the response). Paste the top result's URL or domain in **Top source** — whether or not mcp-probe was cited — so we can see who's eating each query.

The tally at the bottom of each weekly section is what feeds the Monday metric snapshot's "Citation sweep: X cited / 40" line.

---

## 2026-05-03 — Week 1 baseline

### Q1: how do I test my MCP server  *(Inspector lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | None                                             |
| Claude     |   N     | None                                             |
| Perplexity |   N     | https://modelcontextprotocol.io/docs/tools/inspector                                             |
| Gemini     |   N     | None                                             |

### Q2: MCP server validation tool  *(Inspector lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | https://github.com/RHEcosystemAppEng/mcp-validation                                            |
| Claude     |   N     | None                                            |
| Perplexity |   N     | https://github.com/RHEcosystemAppEng/mcp-validation                                            |
| Gemini     |   N     | https://jimmysong.io/ai/inspector/#:~:text=Inspector%20is%20a%20visual%20testing%20and%20validation%20tool%20for%20MCP,Key%20Features                                            |

### Q3: MCP schema validator  *(Inspector lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     |  https://pypi.org/project/mcp-schema-validator/?utm_source=chatgpt.com                                            |
| Claude     |   N     |  None                                            |
| Perplexity |   N     |  https://github.com/RHEcosystemAppEng/mcp-validation                                            |
| Gemini     |   N    |   https://github.com/modelcontextprotocol/inspector                                           |

### Q4: tool to check MCP server health  *(Inspector lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | https://modelcontextprotocol.io/docs/tools/inspector                                             |
| Claude     |   N     | None                                             |
| Perplexity |   N     | https://mcpservers.org/servers/dbsectrainer/mcp-server-health-monitor                                            |
| Gemini     |   N     | https://medium.com/@punkpeye/mcp-inspector-is-now-stable-a-browser-based-tool-for-testing-mcp-servers-cac0c6b414dd#:~:text=Select%20your%20authentication%20method%20(None,configure%20parameters%2C%20and%20execute%20requests.                                             |

### Q5: best practices for MCP server schemas  *(Inspector lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | None                                             |
| Claude     |   N     | https://mcpcat.io/guides/understanding-json-rpc-protocol-mcp/#:~:text=Tools%20expose%20executable%20functions%20that,%2C%20enabling%20type%2Dsafe%20invocations.                                             |
| Perplexity |   N     | https://modelcontextprotocol.info/docs/best-practices/                                             |
| Gemini     |   N     | https://mcpcat.io/guides/understanding-json-rpc-protocol-mcp/                                             |

### Q6: MCP server CI pipeline  *(GREENFIELD — mcp-probe lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | None                                             |
| Claude     |   N     | https://docs.github.com/en/actions                                             |
| Perplexity |   N     | https://aws.amazon.com/blogs/awsmarketplace/transform-ci-cd-pipelines-with-circleci-mcp-and-aws-agentic-ai/                                              |
| Gemini     |   N     | https://milvus.io/ai-quick-reference/whats-the-best-way-to-deploy-an-model-context-protocol-mcp-server-to-production#:~:text=Next%2C%20automate%20deployment%20using%20a,of%20users%20before%20full%20rollout.                                             |

### Q7: what does missing description on MCP tool do  *(GREENFIELD — mcp-probe lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | None                                             |
| Claude     |   N     | None                                             |
| Perplexity |   N     | https://www.merge.dev/blog/mcp-tool-schema                                             |
| Gemini     |   N     | None                                             |

### Q8: Anthropic MCP server diagnostic  *(Inspector lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | https://github.com/alpic-ai/grizzly?utm_source=chatgpt.com                                             |
| Claude     |   N     | None                                             |
| Perplexity |   N     | https://github.com/modelcontextprotocol/inspector                                             |
| Gemini     |   N     |  https://github.com/modelcontextprotocol/inspector                                            |

### Q9: how to debug MCP tool calls  *(GREENFIELD — mcp-probe lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | None                                             |
| Claude     |   N     | None                                             |
| Perplexity |   N     | https://fast.io/resources/mcp-server-debugging/                                             |
| Gemini     |   N     | None                                             |

### Q10: MCP server pre-publish checklist  *(GREENFIELD — mcp-probe lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | None                                             |
| Claude     |   N     | https://modelcontextprotocol.io/                                             |
| Perplexity |   N     | https://www.zealynx.io/blogs/mcp-security-checklist                                             |
| Gemini     |   N     | None                                             |

### Tally — 2026-05-03

- **Total cited: 0 / 40**
- Greenfield cited (Q6, Q7, Q9, Q10): 0 / 16
- Inspector-lane cited (Q1–Q5, Q8): 0 / 24
- Trigger metric (citation): 0 / baseline established
- Notes:
  - **Unexpected competitors surfacing in Inspector lanes:** `github.com/RHEcosystemAppEng/mcp-validation` (Red Hat ecosystem) appeared in Q2 ChatGPT + Q2 Perplexity + Q3 Perplexity. `pypi.org/project/mcp-schema-validator` appeared in Q3 ChatGPT. `github.com/alpic-ai/grizzly` appeared in Q8 ChatGPT. Inspector still wins most Inspector-lane cells but is not monolithic — the lane has more fragmentation than assumed.
  - **Greenfield is genuinely greenfield.** Q6/Q7/Q9/Q10 top sources are single-article wins from non-MCP-specific blogs (`fast.io`, `merge.dev`, `zealynx.io`, AWS blog, milvus.io). No incumbent authority. mcp-probe should be able to take these lanes with one solid published artifact each.
  - **Q5 (best practices) is owned by `mcpcat.io`** — a dedicated MCP content site. If we want this lane, we need a "MCP server schema best practices" page that out-ranks them. Add to Week 2 content list.
  - **MCP Inspector dominance < expected.** Of 24 Inspector-lane cells, only ~7 explicitly point to Inspector itself. The rest are scattered across Anthropic generic docs, third-party blogs, and competitors. Positioning mcp-probe as Inspector's CLI peer (per the README entity-bridging line) remains correct; the lane is contested, not locked.

---

## 2026-05-10 — Week 2 sweep

Sweep #2 — first measurement after Wk1 deliverables (npm 1.0.2 SEO refresh, dev.to article ×2, 2 GitHub Discussions, awesome-mcp-devtools PR, Buffer Twitter thread, Mads Hansen contribution loop). Run automated via Playwright.

**Perplexity column complete (Playwright-driven, 10/10 cells filled).** ChatGPT / Claude / Gemini columns pending — auth-walled, queued for parallel-tab batch after user login.

### Q1: how do I test my MCP server  *(Inspector lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | MCP Inspector docs (modelcontextprotocol.io/docs/tools/inspector)                                        |
| Claude     |   N     | None — composed raw curl/JSON-RPC tests, doesn't name Inspector                                        |
| Perplexity |   N     | https://modelcontextprotocol.io/docs/tools/inspector                                             |
| Gemini     |   N     | MCP Inspector + claude_desktop_config.json integration test                                        |

### Q2: MCP server validation tool  *(Inspector lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | mcp-quality-gate (GitHub, community validator) + MCP Inspector as baseline                                        |
| Claude     |   N     | @anthropic-ai/sdk (Anthropic's generic SDK, NOT a specific validator) + custom validation script                                        |
| Perplexity |   N     | https://github.com/RHEcosystemAppEng/mcp-validation                                            |
| Gemini     |   N     | MCP Inspector ("Postman for MCP")                                        |

### Q3: MCP schema validator  *(Inspector lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | Ajv (generic JSON Schema lib) + MCP Inspector — no MCP-specific validator named                                        |
| Claude     |   N     | jsonschemavalidator.net + AJV (both generic JSON Schema tools)                                        |
| Perplexity |   N     | https://modelcontextprotocol.io/specification/2025-11-25/basic                                            |
| Gemini     |   N     | MCP Inspector + Ajv + SDK runtime validation                                        |

### Q4: tool to check MCP server health  *(Inspector lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | mcp-quality-gate + MCP Inspector                                        |
| Claude     |   N     | None — DIY health endpoint + custom monitoring script, no third-party tool cited                                        |
| Perplexity |   N     | https://libraries.io/npm/mcp-health-monitor                                            |
| Gemini     |   N     | **Speakeasy** (MCP middleware monitoring) + initialize ping + stderr logs — NEW competitor surfaced                                        |

### Q5: best practices for MCP server schemas  *(Inspector lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | None — generic guidance, no specific tool/article cited                                        |
| Claude     |   N     | None — 10 principles enumerated, no source                                        |
| Perplexity |   N     | https://www.youtube.com/watch?v=W56H9W7x-ao                                            |
| Gemini     |   N     | None — atomic tools / strict typing / descriptions-as-UI principles, no source cited                                        |

### Q6: MCP server CI pipeline  *(GREENFIELD — mcp-probe lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | **mcp-quality-gate** (`npx mcp-quality-gate validate ...`) — DIRECTLY recommended as CI gate. mcp-probe's exact positioning, lost.                                        |
| Claude     |   N     | GitHub Actions docs (generic) + custom workflow YAML. **Lane STILL OPEN on Claude.**                                        |
| Perplexity |   N     | https://bleevht.substack.com/p/integrating-mcp-servers-into-your                                            |
| Gemini     |   N     | None — generic CI (ESLint/tsc/integration test), no MCP-specific tool. **Lane STILL OPEN on Gemini.**                                        |

### Q7: what does missing description on MCP tool do  *(GREENFIELD — mcp-probe lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | None — generic principles, no specific tool/article cited                                        |
| Claude     |   N     | None — generic 4-impact framing + DO/DON'T examples, no source. **Lane STILL OPEN on Claude.**                                        |
| Perplexity |   N     | https://modelcontextprotocol.info/docs/concepts/tools/                                            |
| Gemini     |   N     | None — generic LLM-selection-failure framing, no source. **Lane STILL OPEN on Gemini.**                                        |

### Q8: Anthropic MCP server diagnostic  *(Inspector lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | MCP Inspector                                        |
| Claude     |   N     | AJV + custom 5-test diagnostic script. Notably does NOT mention MCP Inspector by name.                                        |
| Perplexity |   N     | modelcontextprotocol.io (Inspector inline-cited)                                            |
| Gemini     |   N     | Claude Desktop log paths (~/Library/Logs/Claude/mcp.log) + DevTools — different angle from other platforms                                        |

### Q9: how to debug MCP tool calls  *(GREENFIELD — mcp-probe lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | MCP Inspector traffic view                                        |
| Claude     |   N     | None — 5-level debug strategy with console.log + middleware, no third-party tool. **Lane STILL OPEN on Claude.**                                        |
| Perplexity |   N     | https://modelcontextprotocol.io/docs/tools/debugging                                            |
| Gemini     |   N     | MCP Inspector trace + stderr + notifications/message. **Lane STILL OPEN on Gemini.**                                        |

### Q10: MCP server pre-publish checklist  *(GREENFIELD — mcp-probe lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | None — composed generic checklist, no source URL or tool referenced                                        |
| Claude     |   N     | None — composed extensive 7-section checklist (~150 items), no source cited. **Lane STILL OPEN on Claude.**                                        |
| Perplexity |   N     | https://www.zealynx.io/blogs/mcp-security-checklist                                            |
| Gemini     |   N     | None — composed generic checklist, no source URL or tool. **Lane STILL OPEN on Gemini.**                                        |

### Tally — 2026-05-10 (full sweep, 4/4 platforms complete)

- **Total cited: 0 / 40** (no change from Wk1 baseline 0/40)
- Greenfield cited (Q6, Q7, Q9, Q10): 0 / 16
- Inspector-lane cited (Q1–Q5, Q8): 0 / 24
- Trigger metric (citation): 0 / 5 hit. **Δ vs Wk1: 0 cells flipped.**

### Strategic findings

**The biggest signal of this sweep is in Claude — and it's good news.** Claude doesn't cite ANY specific MCP tool in 9/10 queries (the lone exception is Q1 referencing `claude_desktop_config.json`, not an external tool). It composes generic, custom solutions rather than recommending existing packages. **Net: all 4 of mcp-probe's greenfield lanes (Q6, Q7, Q9, Q10) are completely open on Claude — zero competitor incumbency.** A single high-quality Claude-friendly article per lane should win citation outright.

**Per-platform incumbency profile:**

| Platform   | Citation behavior | Inspector named? | Greenfield Q6/Q7/Q9/Q10 winner |
|---|---|---|---|
| ChatGPT    | Names specific tools incl. competitors | Yes | **mcp-quality-gate** wins Q6 directly (CI gate positioning collision); Q7/Q10 OPEN |
| Claude     | Composes generic solutions | NO (only Q1 indirect mention) | ALL 4 OPEN — biggest opportunity surface |
| Perplexity | Cites URLs heavily | Yes | Q6/Q7/Q9 owned by random blogs; Q10 owned by zealynx.io |
| Gemini     | Mixed — names tools when known, generic otherwise | Yes | Q6/Q7/Q9/Q10 all OPEN (no MCP-specific tool cited) |

**Greenfield lanes still genuinely open (i.e., no incumbent competitor):**
- Q6 "MCP server CI pipeline" — open on Claude/Gemini; LOST on ChatGPT to mcp-quality-gate
- Q7 "missing description on MCP tool do" — open on Claude/Gemini/ChatGPT; modelcontextprotocol.info wins Perplexity
- Q9 "how to debug MCP tool calls" — open on Claude/Gemini; Inspector wins Perplexity/ChatGPT (this is actually closer to an Inspector lane)
- Q10 "pre-publish checklist" — open on Claude/Gemini/ChatGPT; **zealynx.io wins Perplexity** (one-off Web3-audit firm article, not a sustained content series — beatable)

### New competitors surfaced this sweep — verified via npm registry

- **mcp-quality-gate** (npm, v0.1.2): created 2026-04-01, last modified 2026-04-01 (no updates in 5+ weeks), **5 weekly downloads**, repo `github.com/bhvbhushan/mcp-quality-gate`, desc "Quality gate for MCP servers — compliance, security, and efficiency testing." LOW velocity. ChatGPT cites it because the package name maps perfectly to "validation/CI gate" queries. Beating it requires (a) outranking on the same keywords or (b) being more discoverable through content.
- **mcp-health-monitor** (npm, v1.0.3): created 2026-04-08, last modified 2026-04-08, **36 weekly downloads**, repo `github.com/oaslananka/mcp-health-monitor`. STALE but more discoverable than mcp-quality-gate. Different category — "MCP server that monitors other MCP servers" — not a CLI tool, less direct competition.
- **mcptools.tools/schema-validator** (web): browser-based MCP config generator + schema validator. Title: "MCP Tools — Free Developer Tools for Model Context Protocol." DIFFERENT CATEGORY (browser tool vs CLI), not direct competition.
- **zealynx.io/blogs/mcp-security-checklist** (article): authored by Carlos (Bloqarl), published 2026-02-11. Zealynx is a Web3/smart-contract audit firm — this MCP article is a one-off, not a content series. The other 9 blog posts on zealynx.io are about Sherlock audits, fuzz testing, smart contracts. **Threat: low — beatable by sustained MCP-focused content.**
- **Speakeasy** (mentioned in Gemini Q4): commercial API tooling co. with MCP middleware. Different category — middleware-as-a-service, not CLI/CI tool.

### Strategic implications for Wk2

1. **Pivot the content sprint to Claude-friendly publishing.** Wk2 should ship `docs/ci.md` (CI pipeline article, already in playbook) optimized for Claude's "compose-from-principles" indexing — make the article authoritative on Q6 specifically. Same for `docs/debug.md` (Q9) and `docs/missing-description.md` (Q7) if not already drafted.

2. **mcp-quality-gate is a paper threat, not a real one.** 5 weekly downloads, no updates in 5+ weeks. The collision is on keyword-matching, not on adoption. A single mcp-probe article that ranks for "MCP CI pipeline" displaces it on ChatGPT next sweep cycle.

3. **Q7/Q9/Q10 are still winnable on 3/4 platforms.** Greenfield strategy remains valid; the four-week playbook's Wk2-3 content list is still aimed at the right targets.

4. **npm metadata SEO refresh hasn't propagated yet (expected).** No platform shifted toward mcp-probe in 1 week — LLM training data lags by months. Don't read 0/40 as failure of the SEO refresh; read it as "wait for Wk4 sweep before re-evaluating."

5. **No probe-mention loop yet.** None of 4 platforms surfaced mcp-probe organically. Trigger metric "citation count" remains at 0. This is consistent with Wk1 baseline; Wk5+ is when we expect first organic surface.

---

## 2026-05-12 (Tue) — Wk2 Q7 ship event marker

Wk2 Q7 article shipped to 4 surfaces. **Not a full sweep — single-event marker for the Δ-measurement baseline.**

| Surface | URL | Time (TPE) |
|---|---|---|
| GitHub blog (canonical) | https://github.com/Incultnitollc/mcp-probe/blob/main/docs/blog/wk2-missing-description-impact.md | 10:03 (launchd fire) |
| dev.to cross-post | https://dev.to/incultnitollc/what-does-a-missing-description-on-an-mcp-tool-actually-do-four-failure-modes-i-traced-from-real-4jn2 | ~12:30 (manual paste) |
| MCP RFC reply (#2682) | https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2682#discussioncomment-16892574 | 20:48 (gh api graphql) |
| Own scorecard reply (#11) | https://github.com/Incultnitollc/mcp-probe/discussions/11#discussioncomment-16892577 | 20:48 (gh api graphql) |

**Title fix at ship:** "Three failure modes" → "Four failure modes" (body documents 4 — selection invisibility, argument-shape guessing, LLM-side validator down-weighting, routing collapse). Source aligned with published version in same commit chain.

**r/mcp:** skipped (banned per `feedback_reddit_velocity.md` — u/incultnito self-link rule active until karma builds).

**Δ-sweep armed Thu 2026-05-14 ~10:00 TPE** (resume keyword `Q7-DELTA-SWEEP`): re-run Q7 query "what does missing description on MCP tool do" on all 4 LLMs in fresh sessions. Append results as a new sub-sweep section above. Target: ≥1/4 platforms flips N→Y citing dev.to or GitHub blog. Δ=0 after 7 days → Twitter thread (Buffer) + 1 LinkedIn post. Δ=0 after 14 days → SEO/title pass.
