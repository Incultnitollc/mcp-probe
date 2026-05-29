# mcp-probe — AI citation sweep log

## 2026-05-22 — v1.1.0 SHIPPED (lane lock-in)

**`@incultnitollc/mcp-probe@1.1.0`** published to npm (~16:15 TPE Fri 2026-05-22), GitHub Release `v1.1.0` live at https://github.com/Incultnitollc/mcp-probe/releases/tag/v1.1.0. Pulled forward 1 day from original Sat 5/23 D5 slot to unblock tonight's Probe Clinic (#13 / #2768) and the Show HN draft gate.

**New lane positioning (explicit in README + CHANGELOG):**

| Tool | Audience | Question answered |
|---|---|---|
| `@modelcontextprotocol/conformance` | SDK / spec authors | "Am I spec-compliant?" |
| `@stephenywilson/mcp-doctor` | Server **installers** (pre-install) | "Will this server pwn me?" |
| **`@incultnitollc/mcp-probe`** | Server **authors** (pre-publish) | "Is my server publishable?" |

mcp-probe v1.1.0 publishability composite (0–100, 5 axes: description-five-axis / enum-shape / mutation-legibility / anti-purpose-clause / distribution-metadata) is the differentiator. Launch-day headline finding (`docs/publishability-scorecards/SUMMARY.md`): all 5 official Anthropic MCP servers cluster at exactly 60/100 — the `description-five-axis` cap fires on every one.

**Next measurement event:** Sun 2026-05-24 15:00 TPE — Q7 sweep (first sweep post-amplify-fire + post-v1.1.0-ship; both signals stacked). Watch Q6/Q7/Q9/Q10 greenfield lanes for any Δ from the 0/40 Wk3 baseline.

---

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

---

## 2026-05-15 (Thu) — Wk2 Q7 Δ-sweep (T+3 days post-ship)

Sub-sweep — re-run of Q7 only (`what does missing description on MCP tool do`) on all 4 LLMs, fresh sessions. Compares against the 2026-05-12 ship-event marker. **Not a full 10-query sweep.**

Cite targets scanned for (any = Y): `incultnitollc`, `incultnito`, `mcp-probe`, `Peng`, "four failure modes", dev.to slug `4jn2`, GitHub path `wk2-missing-description-impact`.

### Q7 — Δ-result table

| Platform   | Status | Evidence snippet | Screenshot |
|------------|--------|------------------|------------|
| ChatGPT    | N | Unauth `chatgpt.com/?q=…`. Composed 4-section answer. Sources cited: `mcpservers.org/servers/QuantGeekDev/mcp-framework` (×3 inline), `docs.rs/crate/turul-mcp-derive`, `smartbear.com/blog/…swagger-mcp-tools`. No incultnito / mcp-probe / Peng / "four failure modes" hits. | `docs/citation-log-screenshots/2026-05-15-delta-sweep/chatgpt.png` |
| Claude     | N (auth-walled) | `claude.ai/new` requires login. Did not attempt login per playbook. No query run. | `docs/citation-log-screenshots/2026-05-15-delta-sweep/claude.png` |
| Perplexity | N | Unauth `perplexity.ai/search?q=…` (Cloudflare cleared after ~5s). 10 sources listed; top inline: `merge.dev/blog/mcp-tool-description` (×3) and `github.com/cline/cline/issues/5458`. Note: merge.dev URL drifted from `-schema` (Wk1) → `-description` (now); still merge.dev domain. No target-string hits. | `docs/citation-log-screenshots/2026-05-15-delta-sweep/perplexity.png` |
| Gemini     | N | Logged-in Peng-Ta session, Temporary Chat mode (72h ephemeral, not used for training). Composed 4-impact answer ("Intent Mapping / Hallucination Risk / Parameter Accuracy / Categorization Failures") with NO sources cited. Framing rhymes with mcp-probe's "four failure modes" article but no attribution. | `docs/citation-log-screenshots/2026-05-15-delta-sweep/gemini.png` |

### Tally — 2026-05-15 Δ-sweep

- **Q7 cited: 0 / 4** (3 platforms answered with no citation; 1 auth-walled)
- **Δ vs 2026-05-12 ship-event baseline: 0 cells flipped N→Y**
- **Δ vs Wk2 full sweep (2026-05-10) Q7 row: 0 cells flipped** (was 0/4, still 0/4)

### Findings

1. **Gemini answer pattern moved toward our framing without attribution.** Wk2 (2026-05-10) Gemini Q7 = generic "LLM-selection-failure." 2026-05-15 Gemini Q7 = explicit 4-impact list ("Intent Mapping / Hallucination / Parameter Accuracy / Categorization Failures") — structurally parallel to the published article's "four failure modes" (selection invisibility / argument-shape guessing / validator down-weighting / routing collapse). Could be coincidence (the framing is intuitive); could be early ingestion without citation. Re-check at next sweep.
2. **ChatGPT pulled in three new competitor sources in 3 days.** `mcpservers.org/servers/QuantGeekDev/mcp-framework`, `docs.rs/crate/turul-mcp-derive`, `smartbear.com/blog/…swagger-mcp-tools` — none were in the Wk1 or Wk2 Q7 cells. ChatGPT's browsing layer is actively crawling MCP framework docs for this query; mcp-probe blog post not surfacing yet.
3. **Perplexity source drift on merge.dev.** Wk1/Wk2 cited `merge.dev/blog/mcp-tool-schema`; today cites `merge.dev/blog/mcp-tool-description` — different article, same domain. merge.dev is consolidating authority on this query lane.
4. **Claude auth-walled — cannot measure.** Wk2 finding ("Claude composes generic, ALL 4 greenfield lanes open") cannot be re-verified this sweep without login. Schedule manual check or accept blind spot until full Sun sweep.
5. **No incumbent has linked to the dev.to or GitHub blog yet.** Three days is short for LLM browsing layers to discover + index a fresh post outside of high-traffic surfaces. Expected.

### Trigger decision

Δ = 0/4 → **arm 7-day trigger per playbook: Tue 2026-05-19**:
- Twitter thread via Buffer (`schedulingType=automatic` per `feedback_buffer_twitter_automatic.md`)
- 1 LinkedIn post
- Anchor both on dev.to slug `4jn2` (no u/incultnito self-link risk on these surfaces)
- Resume keyword: `Q7-T7-AMPLIFY`

If next Δ-sweep (~Sun 2026-05-19 full sweep or ad-hoc post-amplify check) still 0/4 by Wed 2026-05-26 (14-day mark) → SEO/title pass on dev.to + GitHub blog (resume `Q7-T14-SEO`).

---

## 2026-05-19 (Tue) — Wk2 Q7 Δ-sweep T+7 PRE-FIRE — Δ = 0/2 measured, amplify ON

Pre-amplify Δ-sweep fired ~19:53 TPE in this session (well before the 22:00 Buffer/LinkedIn fire window). Two platforms measured via unauth surfaces; ChatGPT + Claude blind-spotted per `feedback_no_login_sweep_preference.md` (logged-in surfaces not available in CLI session — would need Peng's manual hand-fire pre-22:00 to fill).

**Cells measured: 2 / 4** (Gemini via Google AI Mode, Perplexity unauth). Cells skipped: 2 (ChatGPT, Claude — login wall).

### Q7: what does missing description on MCP tool do

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   —     | Login-walled, not measured (Peng manual fill if pre-fire desired)                                       |
| Claude     |   —     | Auth-walled, not measured                                       |
| Perplexity |   N     | https://modelcontextprotocol.info/docs/concepts/tools/ (3 cites) + arXiv 2602.14878 + r/ClaudeCode `1nvxho9` — 10 sources, no mcp-probe / dev.to / GitHub blog                                       |
| Gemini     |   N     | **arxiv.org/html/2602.14878v2 "Model Context Protocol (MCP) Tool Descriptions Are Smelly!"** (Feb 16, 2026 paper, cited 3+ times) + FastMCP + modelcontextprotocol.io spec + LangChain + r/mcp `1ooqeqy` — 17 sources, no mcp-probe                                       |

### Δ vs 5/15 T+3 baseline (0/4)

**Δ = 0 / 2 measured.** No platform flipped N→Y in 7 days post-ship for the cells measurable from this session.

### Major lane shift — new headline competitor

**`arxiv.org/html/2602.14878` "MCP Tool Descriptions Are Smelly!"** — academic paper dated Feb 16, 2026 — now owns Gemini's answer structure for this query. Cited 3+ times in the Gemini AI Mode response and is the anchor source for "if descriptions are defective, underspecified, or misleading, the FM may select the wrong tool." This is the **new authoritative source** in the Q7 lane.

**Implications:**
1. Gemini's previous "four failure modes" drift (noted 5/15) has been **replaced** by an arXiv-anchored 3-category framing (execution failures / SDK framework behaviors / UI degradation). Convergence with the dev.to article framing was ingestion-without-attribution at best; now the paper has displaced it entirely.
2. The arXiv paper is academic-authority — harder to displace than a competitor npm tool would be. Our dev.to article's "four failure modes" framing may now read as derivative against the paper unless we sharpen the differentiator: **mcp-probe is the pre-publish CLI that detects these failures before they ship**, not a survey of the failure types themselves.
3. Perplexity converged on `modelcontextprotocol.info/docs/concepts/tools/` (a tertiary mirror of the official spec) — that mirror is now stickier than the canonical `modelcontextprotocol.io` for this query.

### Decision matrix application (from 5/18 T+6 entry above)

5/19 Δ = 0/2 measured → falls into "Δ = 0/4 or 1/4" row → **Fire Q7-T7-AMPLIFY as planned (Buffer Twitter + LinkedIn).**

If Peng runs a manual ChatGPT/Claude check before 22:00 and either flips Y, append to this section + re-evaluate per the matrix (Δ = 2/4 → Twitter only, Δ ≥ 3/4 → cancel).

### Amplify content framing (this fire only)

Pivot the amplification copy from "four failure modes" (which the arXiv paper now owns at higher authority) to **"the pre-publish CLI that catches these failures before npm publish"** — drives the reader to the npm package and the upcoming v1.1.0 publishability-score (5/23 ship). The dev.to article remains the landing URL but the social copy must position mcp-probe as the *prevention layer*, not the *taxonomy*.

### 14-day trigger unchanged

If Sat 2026-05-23 (or next sweep ≥ Wed 5/26) still shows Δ = 0 across measured cells → SEO/title pass (`Q7-T14-SEO`) — but with the arXiv paper now in-lane, SEO pass probably needs a re-framing edit, not just a title tweak.

### Screenshots

`.playwright-mcp/page-2026-05-19T11-53-42-940Z.yml` (Google AI Mode Q7) + `.playwright-mcp/page-2026-05-19T11-54-39-031Z.yml` (Perplexity Q7) — accessibility-tree snapshots, not PNGs; sufficient for source-list verification.

---

## 2026-05-18 (Mon) — Wk2 Q7 Δ-sweep T+6 — NOT MEASURED (skip)

Pre-T+7 ad-hoc sweep slot per 5/15 plan: skipped. **No fresh 4-LLM measurement recorded.** Peng acknowledged completing the time slot but did not paste platform-by-platform Δ data before clear-and-quit; logged as skip rather than fabricate.

### Why this is acceptable

1. **Tue 5/19 22:00 Q7-T7-AMPLIFY is the binding decision point**, not the T+6 ad-hoc. T+6 was a courtesy pre-fire sanity check; the 7-day playbook trigger fires regardless unless Δ was already ≥3/4 (highly unlikely given 5/15 baseline of 0/4 + no amplification yet + no new content shipped between 5/15 and 5/18).
2. **No state change shipped between 5/15 and 5/18** that would plausibly flip a cell — no new article, no new GitHub blog, no Twitter or LinkedIn yet. The hypothesis that Δ ≠ 0/4 at T+6 requires LLM browsing layers to have discovered + indexed the 5/12 dev.to post on their own, which the 5/15 sweep already showed was not happening (ChatGPT actively crawled competitor MCP framework docs in 3 days but missed our article).
3. **Skip cost is bounded:** Tue 5/19 22:00 amplify-fire serves as both the next data point (post-amplify sweep) and the action trigger. If amplify cancels because Δ is already ≥3/4, we'll catch it at the 22:00 pre-fire check.

### Action at Tue 2026-05-19 22:00 TPE

Run full fresh-session sweep on all 4 LLMs **before** firing Buffer/LinkedIn. Decision matrix:

| 5/19 sweep result | Action |
|---|---|
| Δ = 0/4 or 1/4 | Fire Q7-T7-AMPLIFY as planned (Buffer Twitter + LinkedIn) |
| Δ = 2/4 | Fire Twitter only, hold LinkedIn for Wk3 |
| Δ ≥ 3/4 | **Cancel amplify** — natural indexing succeeded, save LinkedIn slot |

Resume keyword: `Q7-T7-AMPLIFY` (unchanged; pre-fire sweep is part of that workflow now).

### 14-day trigger unchanged

If Tue 5/19 amplify fires AND Sat 2026-05-23 (or next sweep ≥ Wed 5/26) still shows Δ = 0/4 → SEO/title pass (`Q7-T14-SEO`).

---

## 2026-05-16 (Sat) — Week 3 sweep

Sweep #3 — full 10-query sweep across all 4 LLMs. Run via Playwright (unauth surfaces only — Perplexity Q1–Q7 unauth, Q8–Q10 hit Perplexity login wall and were SKIPPED per user no-login preference; ChatGPT all 10 unauth; Gemini all 10 via **Google AI Mode** (`udm=50`), which is Gemini-backed and unauth-friendly — used as proxy for the standalone Gemini surface per same no-login preference; Claude.ai auth-walled and SKIPPED).

**Cells measured: 27 / 40** (10 ChatGPT + 10 Gemini-via-AI-Mode + 7 Perplexity + 0 Claude). Blind spots logged for next-sweep manual fill or accept.

Screenshots: `docs/citation-log-screenshots/2026-05-16-wk3-sweep/` (29 PNGs incl. 2 login-wall evidence shots).

### Q1: how do I test my MCP server  *(Inspector lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | MCP Inspector (composed; `npx @modelcontextprotocol/inspector`) — no URL surfaced unauth                                       |
| Claude     |   —     | Auth-walled, not measured                                       |
| Perplexity |   N     | https://modelcontextprotocol.io/docs/tools/inspector + learn.microsoft.com/en-us/windows/ai/mcp/servers/test-mcp-server                                       |
| Gemini     |   N     | MCP Inspector (Model Context Protocol +1) — composed, Inspector-first                                       |

### Q2: MCP server validation tool  *(Inspector lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | **MCP Doctor** (`npx mcpdoctor test ...`) — listed FIRST as "Best overall compliance validator." NEW competitor surfaced. Also MCP Scan, MCPRadar, MCP Playground Online, MCP Evals, MCP Config Validator, mcp-validation.                                       |
| Claude     |   —     | Auth-walled, not measured                                       |
| Perplexity |   N     | https://github.com/RHEcosystemAppEng/mcp-validation (same as Wk1+Wk2 — sticky)                                       |
| Gemini     |   N     | MCP Inspector + **Janix-ai/mcp-validator** (NEW) + **mcp-eval** (NEW) + **Apify MCP Validator** (NEW)                                       |

### Q3: MCP schema validator  *(Inspector lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | **mcp-schema-validator (PyPI)** listed first (same as Wk1). Also WebMCP Schema Validator (NEW), MCP Playground Schema Linter (NEW), JSON Schema Validator MCP Server, ShapeMCP (NEW)                                       |
| Claude     |   —     | Auth-walled, not measured                                       |
| Perplexity |   N     | https://modelcontextprotocol.io/specification/2025-11-25/basic + https://mcptools.tools/schema-validator/                                       |
| Gemini     |   N     | JSON Schema Validator (MCP Market) + Janix-ai mcp-validator + MuleSoft Flex Gateway Policy                                       |

### Q4: tool to check MCP server health  *(Inspector lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | **MCP Doctor** (again, "Best for developers") + MCP Server Health Monitor + **MCPWatch** (NEW) + **HealthyMCP** (NEW) + **MCPSafetyScanner** (NEW). Multi-tool ranked list.                                       |
| Claude     |   —     | Auth-walled, not measured                                       |
| Perplexity |   N     | https://corcava.com/mcp/guides/mcp-health-checks + https://libraries.io/npm/mcp-health-monitor (mcp-health-monitor sticky from Wk2)                                       |
| Gemini     |   N     | MCP Inspector + **MCP Doctor** + **mcp-server-tester** (NEW) + Sentry MCP Dashboards + Speakeasy + Health Monitor. MCP Doctor now spans ChatGPT AND Gemini for Q4.                                       |

### Q5: best practices for MCP server schemas  *(Inspector lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | "MCP Best Practice" (×2 inline) + Nordic APIs + MCP Protocol + Reddit. Generic principles, multi-source.                                       |
| Claude     |   —     | Auth-walled, not measured                                       |
| Perplexity |   N     | https://www.youtube.com/watch?v=W56H9W7x-ao (sticky from Wk2) + https://modelcontextprotocol.info/docs/best-practices/ + lirantal/awesome-mcp-best-practices + descope.com + docker.com/blog/mcp-server-best-practices/                                       |
| Gemini     |   N     | **Philschmid** (NEW) — primary; generic LLM-readability principles                                       |

### Q6: MCP server CI pipeline  *(GREENFIELD — mcp-probe lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | **MCP Conformance Framework** (`npx @modelcontextprotocol/conformance`) — described as official. **mcp-quality-gate from Wk2 is GONE.** Lane re-occupied by an official-Anthropic-style positioning (verify package exists). Schema snapshot testing also recommended.                                       |
| Claude     |   —     | Auth-walled, not measured                                       |
| Perplexity |   N     | https://bleevht.substack.com/p/integrating-mcp-servers-into-your (sticky from Wk2) + medium kapilkumar080                                       |
| Gemini     |   N     | CircleCI + Medium·Arif Dewi + GitHub MCP Server + CircleCI MCP Server. Generic CI/CD framing. No MCP-specific compliance tool named.                                       |

### Q7: what does missing description on MCP tool do  *(GREENFIELD — mcp-probe lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | MXCP + Docs.rs + **DEV Community** (×2, no URL — could be dev.to but unverifiable). Composed 4-impact answer. **NEW: ChatGPT now cites three sources where Wk2 had zero.**                                       |
| Claude     |   —     | Auth-walled, not measured                                       |
| Perplexity |   N     | Inline cites: modelcontextprotocol + dev + arxiv (no URLs in source list this sweep). **Wk2 cited merge.dev — that has dropped out.** Source-drift continues.                                       |
| Gemini     |   N     | arXiv (×3) + Model Context Protocol + FastMCP + GitHub. Composed 3-failure-mode framing: "Tool Selection Failures (AI Blind Spot)" / "Argument and Parameter Hallucination" / "Brittle Client-Side SDK Fallbacks." **Closer to mcp-probe's "four failure modes" article structure than Wk2's framing was.** Could be ingestion-without-attribution or coincidence — re-check at next sweep.                                       |

### Q8: Anthropic MCP server diagnostic  *(Inspector lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | **Claude API Docs (Anthropic) (×3 inline)** + MCP Inspector + Reddit. Anthropic-doc-anchored answer; very specific re. SSE/Streamable HTTP transport + `anthropic-beta: mcp-client-2025-04-04` header.                                       |
| Claude     |   —     | Auth-walled, not measured                                       |
| Perplexity |   —     | Login wall hit on Q8 (after Q7 free quota exhausted); SKIPPED per user no-login preference. Screenshot: `perplexity-q8-loginwall.png`                                       |
| Gemini     |   N     | Anthropic + Model Context Protocol + GitHub. MCP Inspector featured + path-resolution + command-availability checklist. Anthropic-doc-anchored same as ChatGPT.                                       |

### Q9: how to debug MCP tool calls  *(GREENFIELD — mcp-probe lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | MCP Framework + Model Context Protocol + Reddit. MCP Inspector + raw JSON-RPC logging + Zod schema validation. Inspector-centric.                                       |
| Claude     |   —     | Auth-walled, not measured                                       |
| Perplexity |   —     | Login wall, SKIPPED                                       |
| Gemini     |   N     | **Reddit r/modelcontextprotocol** (×3 inline) + Model Context Protocol + YouTube·Execute Automation. Strong emphasis on stderr-logging-not-stdout pitfall — community-driven content.                                       |

### Q10: MCP server pre-publish checklist  *(GREENFIELD — mcp-probe lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |   N     | Model Context Protocol Docs + **MCP Registry Publishing Guide** + arXiv (×2 inline). MCP Registry framing positions checklist as registry-prep. **Wk2 had no sources cited; now 3.**                                       |
| Claude     |   —     | Auth-walled, not measured                                       |
| Perplexity |   —     | Login wall, SKIPPED                                       |
| Gemini     |   N     | GitHub (×4 inline) + "seven-axis community conformance framework" — explicitly references a community-maintained conformance framework. Comprehensive 8-section checklist.                                       |

### Tally — 2026-05-16

- **Total cited: 0 / 27 measured** (Claude 10 cells unmeasured, Perplexity 3 cells unmeasured)
- Greenfield cited (Q6, Q7, Q9, Q10): **0 / 12 measured** (target lane status: still unclaimed by mcp-probe)
- Inspector-lane cited (Q1–Q5, Q8): **0 / 15 measured**
- Trigger metric (citation): **0** — unchanged from Wk1/Wk2 baseline of 0/40
- **Δ vs Wk2 (10-day window): 0 cells flipped N→Y** for mcp-probe. **Multiple cells flipped sources** (composition + competitor surface shifted significantly — see findings below).

### Week-over-week deltas (measured cells only)

| Δ-Type | Wk1 (5/03) | Wk2 (5/10) | Wk3 (5/16) |
|---|---|---|---|
| mcp-probe citation count | 0 | 0 | 0 |
| Distinct competitor MCP tools surfaced | ~5 | ~8 | **~17** (more than doubled) |
| ChatGPT Q6 top source | None | mcp-quality-gate | **MCP Conformance Framework** (official-style) |
| ChatGPT Q2 top source | pypi mcp-schema-validator | mcp-quality-gate | **MCP Doctor** |
| ChatGPT Q4 top source | modelcontextprotocol.io/inspector | mcp-quality-gate | **MCP Doctor** |
| Perplexity Q1 top source | modelcontextprotocol.io/inspector | same | same (sticky) |
| Perplexity Q2 top source | RHEcosystemAppEng/mcp-validation | same | same (sticky) |
| Perplexity Q4 top source | mcpservers.org health-monitor | libraries.io/mcp-health-monitor | corcava.com (NEW) + libraries.io/mcp-health-monitor |
| Gemini Q7 framing | generic LLM-failure | generic 4-impact (no source) | **3-failure-mode framing closer to mcp-probe article structure** (arXiv-cited) |

### Strategic findings

1. **MCP Doctor (`npx mcpdoctor`) is the new headline competitor.** Surfaced FIRST on ChatGPT Q2 ("Best overall compliance validator"), ChatGPT Q4 ("Best for developers"), AND Gemini Q4. Positioning: CLI-first MCP compliance + CI-friendly. **This is mcp-probe's exact pitch.** Verify on npm before next sweep — if low download counts (similar to mcp-quality-gate's 5/wk), threat is keyword-driven and beatable with one well-ranked article. If real traction, harder collision. Action: log to Wk3 next-actions.

2. **mcp-quality-gate has been displaced on ChatGPT** — gone from Q2, Q4, Q6 entirely. Either ChatGPT's index refreshed and the package's 5-weekly-downloads, no-updates-in-5-weeks signal pushed it out, OR ChatGPT swapped to newer-name competitors (MCP Doctor pattern). The Wk2 ChatGPT-Q6 collision threat ("mcp-quality-gate as exact CI gate positioning") is no longer the active threat. **The lane is recapturable but the new occupant is a more credible competitor.**

3. **ChatGPT now positions Q6 around "MCP Conformance Framework" (`@modelcontextprotocol/conformance`)** — described as official. Verify whether this is a real Anthropic-published package or a model hallucination. If real, the Q6 lane is no longer "greenfield" — it's now Anthropic-owned by direct package. If hallucinated, this is an opportunity (mcp-probe content piece can fill that semantic slot before the model corrects itself). Action: `npm view @modelcontextprotocol/conformance` and `gh repo view modelcontextprotocol/conformance` before next sweep.

4. **Competitor count more than doubled.** Wk2 surfaced ~8 distinct competitor tools; Wk3 surfaces ~17 across all platforms (MCP Doctor, MCP Scan, MCPRadar, MCPWatch, HealthyMCP, MCPSafetyScanner, ShapeMCP, WebMCP Schema Validator, MCP Playground Schema Linter, Janix-ai/mcp-validator, mcp-eval, Apify MCP Validator, mcp-server-tester, MXCP, Philschmid, MCP Registry Publishing Guide, "MCP Conformance Framework"). LLM browsing layers are actively crawling the MCP-tools ecosystem. **mcp-probe needs to be in this set by Wk5 sweep or it gets boxed out.**

5. **Gemini Q7 framing inched closer to mcp-probe's "four failure modes" article structure.** Wk2 Gemini Q7 = generic "LLM-selection-failure." Wk3 Gemini Q7 = explicit 3-failure-mode list ("Tool Selection / Argument Hallucination / Brittle SDK Fallbacks"). The 5/15 Δ-sweep also flagged this pattern. **Three consecutive datapoints (5/10 generic → 5/15 4-impact → 5/16 3-failure-mode) show framing convergence without attribution.** Could be: (a) coincidence/independent reasoning, (b) ingestion of mcp-probe article without citation, (c) ingestion of competing similar content. Re-check at Wk4 sweep; if convergence continues without attribution, the 14-day SEO/title pass should explicitly include adding more attribution-friendly anchors to the dev.to article.

6. **Q10 ChatGPT framing shifted to MCP-Registry-anchored** ("MCP Registry Publishing Guide" cited). This is consistent with mcp-probe's roadmap (MCP Registry F.1 partial-ingest at 687→3,966 servers). When mcp-probe ships to the MCP Registry post-launch, the Q10 lane should naturally surface — but the framework is now anchored to the registry itself, not third-party checklists.

7. **Perplexity sources are stickiest.** Most Perplexity top sources from Wk1 are still top in Wk3 (Q1 inspector, Q2 RHEcosystemAppEng, Q4 libraries.io mcp-health-monitor partial drift, Q5 youtube W56H9W7x-ao). Perplexity's index is slowest to change — content needs to be ranked there, not just published. SEO/title pass at T+14 should weight Perplexity-friendly anchors.

8. **No mcp-probe surface anywhere.** 27/27 measured cells confirm: zero organic discovery. Wk1+Wk2 deliverables (npm 1.0.2 SEO refresh, 2 dev.to articles, awesome-mcp-devtools PR pending, Buffer thread, Q7 ship event 5/12) have not yet produced any LLM citation. Expected lag is months; this remains baseline behavior, not failure.

### Wk3 next actions (logged for Tue 5/19 Q7-T7-AMPLIFY pre-fire check)

1. **Verify MCP Doctor (`mcpdoctor` npm package).** Check `npm view`, weekly downloads, last publish date, repo activity. If ≤20 weekly downloads and stale, treat as paper threat. If active, write competitive note + adjust Wk3 content list.
2. **Verify `@modelcontextprotocol/conformance` package existence.** If real, scope its overlap with mcp-probe's MVP test set; if hallucinated, file as opportunity for ChatGPT-Q6 content.
3. **Carry the Gemini-Q7 framing-convergence pattern into the Q7-T7-AMPLIFY decision matrix.** If 5/19 amplify-fire Δ ≥ 1/4 platform flips citing dev.to slug `4jn2`, that resolves whether 5/16 Gemini framing was ingestion or coincidence.
4. **No Claude data this sweep.** Either accept the blind spot for Wk3 or schedule a one-off manual Claude check (Peng-Ta logged-in Temporary Chat) before Tue 5/19 amplify-fire.
5. **No Perplexity Q8–Q10 data.** Acceptable for this sweep; Wk4 sweep should plan around Perplexity's free-quota limit (use one fresh-IP browser per ~7 queries, or split across two sessions).

### Resume keyword

`WK3-SWEEP` for any Wk3 follow-up. Wk4 full sweep on schedule for **Sun 2026-05-24 15:00 TPE**.

---

## 2026-05-17 — WK3-VERIFY competitive intel sprint

**Trigger:** Wk3 sweep (5/16) surfaced 3 new sources that needed reality-check before Tue 5/19 Q7-T7-AMPLIFY pre-fire and Sat 5/23 SECURITY-SUITE ship. Sprint run 16:00 TPE.

### Verification results

| # | Claim from Wk3 sweep | Verification command | Result | Threat re-rating |
|---|---|---|---|---|
| 1 | `npx mcpdoctor` = new headline competitor (ChatGPT Q2/Q4, Gemini Q4) | `npm view mcpdoctor` | **404 — package does NOT exist** | **HALLUCINATED.** LLMs invented the bin name. Confirmed by `npm search mcp doctor` returning only unrelated scoped variants. |
| 2 | `@modelcontextprotocol/conformance` (ChatGPT Q6) = official Anthropic | `npm view @modelcontextprotocol/conformance` | **REAL.** `0.1.16`, MIT, 14 versions, maintainers include `jspahrsummers`, `ashwin-ant@anthropic.com`, `fweinberger@anthropic.com`, `ochafik`. Repo `modelcontextprotocol/conformance` (64 stars, last push 2026-05-15). | **HIGH.** Official, actively shipping (3 commits in last 3 days incl. SEP-2243 HTTP Standardization), 5,717 weekly DL vs mcp-probe's 24 = **238× larger**. |
| 3 | awesome-mcp-devtools PR #156 status | `gh pr view 156 --repo punkpeye/awesome-mcp-devtools` | OPEN, 0 comments, 0 reviews, no updates since 2026-05-05 (12 days stale). | **NEUTRAL.** Distribution-channel stall. |

### Surprise finding — real `mcp-doctor` variants surfaced during verification

While verifying claim 1, `npm search mcp doctor` returned three actually-published packages that the Wk3 sweep had NOT surfaced (LLMs were close on name but referenced the wrong slug):

| Package | Published | Weekly DL | 4-wk total | GH stars | Lane |
|---|---|---|---|---|---|
| **`@stephenywilson/mcp-doctor@0.4.0`** | **2026-05-15 (2 days ago)** | **207** | **927** (active 13/28 days) | **0** | **Install-time security audit + tool-call firewall preview** (LOW/MED/HIGH/CRITICAL severity, ALLOW/ASK/BLOCK policy, writes `MCP_TOOL_AUDIT_REPORT.md`) |
| `@maiife-ai-pub/mcp-doctor@0.2.2` | 2026-04-13 | 76 | — | — | "brew doctor for your MCP setup" — health check + auto-fixer |
| `mcp-doctor@0.1.1` (Crooj026) | (older) | 12 | — | — | Config debugging across Claude Desktop / Cursor / VS Code |

**Critical:** `@stephenywilson/mcp-doctor@0.3.0` already ships the **exact security-audit framing** mcp-probe's v1.1.0 SECURITY-SUITE was planned to enter — `.env` / `.ssh` / secrets-dir write detection, shell-execution flagging, credential-arg scanning, severity classification, policy-based ALLOW/ASK/BLOCK. Tagline: *"Before you paste an MCP config into Claude Desktop or Cursor — run MCP Doctor."* Repo created 2026-05-04, last push 2026-05-15. **0 GitHub stars** (npm-driven distribution, not viral) — scrappy newcomer tier, but ~8.6× mcp-probe's weekly DL and clear positioning lock on the install-time security lane.

### Strategic implications for SECURITY-SUITE v1.1.0 (Sat 2026-05-23 ship deadline)

The decision in `decision_security_suite_before_show_hn.md` (build v1.1.0 = 5 MVP security tests + 0–100 score) was made BEFORE knowing stephenywilson shipped install-time firewall preview on 5/15. **The original scope is now dead — that lane is occupied by a more polished, more downloaded incumbent with a 6-day head start.**

**Recommended scope pivot — three lanes now visible:**

| Tool | Audience | When run | Question answered |
|---|---|---|---|
| `@modelcontextprotocol/conformance` | SDK maintainers, spec authors | Continuous (CI) during server/client development | "Am I spec-compliant?" |
| `@stephenywilson/mcp-doctor` | **Operators installing servers** | Pre-install (`mcp-doctor firewall audit ...`) | **"Will this server pwn me?"** |
| **`@incultnitollc/mcp-probe`** (proposed pivot) | **Server authors before npm publish** | **Pre-publish (one-shot)** | **"Is my server publishable?"** |

Differentiated v1.1.0 scope (NOT security suite): **publishability score** — schema completeness, parameter description quality (continues the 5-axis contract from the Mads-Hansen-credited checklist), anti-purpose `do not use for` coverage, semver/changelog hygiene, README + repo metadata checks, MCP-Registry submission readiness. Different audience than mcp-doctor, complementary to conformance.

**T+7 amplification (Tue 5/19 22:00 TPE) — KEEP ON.** Q7 article ("Schema descriptions are load-bearing" / 4 failure modes) is already on-message for pre-publish quality positioning, not security positioning. The competitive shift doesn't kill the amplification — it sharpens the framing. Pre-fire check Mon 5/18 evening still gates the call (skip if Δ ≥ 1 by then).

### Sprint exit state

- Documentation appended to this file (citation-log.md) + memory updates queued for `project_wk3_sweep_findings.md`, `decision_security_suite_before_show_hn.md`, `project_launch.md`.
- No new artifacts in `docs/community/` or `docs/launch/` yet — security-suite copy in `docs/launch/` was never written, so no churn.
- `docs/competitive-notes-2026-05-03.md` is now 14 days stale; the Wk3 verification supersedes its threat ratings. Optional follow-up: write `docs/competitive-notes-2026-05-17.md` as a fresh snapshot before Tue 5/19. Not blocking.

### Resume keywords

- `SECURITY-SUITE` resume = pivot to `PUBLISHABILITY-SCORE` scope per this section before any v1.1.0 code is written.
- `WK3-VERIFY` = this sprint (closed).
- Wk4 full sweep still on schedule **Sun 2026-05-24 15:00 TPE**.

---

## 2026-05-25 — Week 4 sweep (post-v1.1.0)

Sweep #4 — first full measurement after **v1.1.0 ship** (Fri 2026-05-22 ~16:15 TPE) and the lane lock-in (`@incultnitollc/mcp-probe` = publishability composite, server-author pre-publish). Run automated via Playwright on Sun 2026-05-25 ~22:55 TPE (running late from planned 15:00 slot; logging as Wk4).

**Methodology — 2 platforms automated, 2 documented blind spots:**

- **Perplexity** (perplexity.ai, no login) — 10/10 cells run via Playwright.
- **Gemini** via Google AI Mode (`google.com/search?udm=50` — Gemini-backed unauth proxy per `reference_google_ai_mode_gemini_proxy.md`) — 10/10 cells run via Playwright.
- **ChatGPT** — SKIPPED (UI-detection-walled for unauth Playwright per `feedback_no_login_sweep_preference.md`). Blind spot.
- **Claude** — SKIPPED (claude.ai login required). Blind spot.

Tally normalized to **/20 cells run** (not /40). Wk1–Wk3 baselines used 4 platforms = /40; Wk4+ uses 2 platforms = /20 until Peng auth-cookie pipeline lands.

### Q1: how do I test my MCP server  *(Inspector lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |  SKIP  | (no auth — blind spot)                       |
| Claude     |  SKIP  | (no auth — blind spot)                       |
| Perplexity |   N    | https://modelcontextprotocol.io/docs/tools/inspector |
| Gemini     |   N    | https://modelcontextprotocol.io/docs/tools/inspector |

### Q2: MCP server validation tool  *(Inspector lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |  SKIP  | (no auth — blind spot)                       |
| Claude     |  SKIP  | (no auth — blind spot)                       |
| Perplexity |   N    | https://modelcontextprotocol.io/docs/tools/inspector (mentions mcp-validator / mcp-validation inline; mcp-probe absent) |
| Gemini     |   N    | https://modelcontextprotocol.io/docs/tools/inspector (Janix-ai/mcp-validator + RHEcosystemAppEng/mcp-validation cited inline) |

### Q3: MCP schema validator  *(Inspector lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |  SKIP  | (no auth — blind spot)                       |
| Claude     |  SKIP  | (no auth — blind spot)                       |
| Perplexity |   N    | https://jsontech.net/mcp-tool-schema-validator (NEW competitor — browser-based MCP schema validator) |
| Gemini     |   N    | https://modelcontextprotocol.io/specification/2025-11-25/basic |

### Q4: tool to check MCP server health  *(Inspector lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |  SKIP  | (no auth — blind spot)                       |
| Claude     |  SKIP  | (no auth — blind spot)                       |
| Perplexity |   N    | https://dev.to/rumblingb/mcp-health-monitor-free-tool-to-check-if-your-mcp-servers-are-actually-running-3jih (NEW — dev.to article anchoring this lane) |
| Gemini     |   N    | https://modelcontextprotocol.io/docs/tools/inspector (**mcp-doctor** cited by name + mcpmarket.com listing — `@stephenywilson/mcp-doctor` claiming install-time security lane as predicted) |

### Q5: best practices for MCP server schemas  *(Inspector lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |  SKIP  | (no auth — blind spot)                       |
| Claude     |  SKIP  | (no auth — blind spot)                       |
| Perplexity |   N    | https://www.youtube.com/watch?v=W56H9W7x-ao (same YT video as Wk2 — lane stable) |
| Gemini     |   N    | https://www.philschmid.de/mcp-best-practices (NEW heavy anchor — philschmid.de cited 6× inline; lane consolidating to one author) |

### Q6: MCP server CI pipeline  *(GREENFIELD — mcp-probe lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |  SKIP  | (no auth — blind spot)                       |
| Claude     |  SKIP  | (no auth — blind spot)                       |
| Perplexity |   N    | https://bleevht.substack.com/p/integrating-mcp-servers-into-your (same as Wk2 — lane stable, no incumbent breakout) |
| Gemini     |   N    | https://circleci.com/docs/guides/toolkit/using-the-circleci-mcp-server/ (**query reinterpreted** — "MCP server for CI", not "CI for testing MCP server"; CircleCI/GitLab/Harness platform MCP servers eating the SERP) |

### Q7: what does missing description on MCP tool do  *(GREENFIELD — mcp-probe lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |  SKIP  | (no auth — blind spot)                       |
| Claude     |  SKIP  | (no auth — blind spot)                       |
| Perplexity |   N    | https://forum.cursor.com/t/allmcptool-schema-missing-arguments-field-causes-agents-to-call-mcp-tools-without-required-params/154996 (community forum thread — no specific tool cited; lane STILL OPEN) |
| Gemini     |   N    | https://modelcontextprotocol.io/specification/draft/server/tools (spec + GitHub bug-report threads — no tool cited; lane STILL OPEN) |

### Q8: Anthropic MCP server diagnostic  *(Inspector lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |  SKIP  | (no auth — blind spot)                       |
| Claude     |  SKIP  | (no auth — blind spot)                       |
| Perplexity |   N    | https://modelcontextprotocol.io/docs/tools/inspector (Snyk article cited inline — Snyk strengthening Inspector lane) |
| Gemini     |   N    | https://modelcontextprotocol.io/docs/tools/inspector (anthropic.com/engineering/desktop-extensions also cited — Anthropic owns this lane decisively) |

### Q9: how to debug MCP tool calls  *(GREENFIELD — mcp-probe lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |  SKIP  | (no auth — blind spot)                       |
| Claude     |  SKIP  | (no auth — blind spot)                       |
| Perplexity |   N    | modelcontextprotocol + fast.io (inline cites, link panel collapsed) — generic JSON-RPC tracing framing |
| Gemini     |   N    | https://snyk.io/articles/how-to-debug-mcp-server-with-anthropic-inspector/ (**Snyk now anchoring this lane** — security-vendor content overtaking Inspector docs as top source) |

### Q10: MCP server pre-publish checklist  *(GREENFIELD — mcp-probe HEADLINE lane)*

| Platform   | Cited? | Top source                                   |
|------------|--------|----------------------------------------------|
| ChatGPT    |  SKIP  | (no auth — blind spot)                       |
| Claude     |  SKIP  | (no auth — blind spot)                       |
| Perplexity |   N    | https://modelcontextprotocol.info/tools/registry/publishing/ (LinkedIn post "mcp-audit-checklist" cited 5× inline by subham-kundu — **NEW Wk4 competitor: a LinkedIn checklist post is the top-of-mind reference**) |
| Gemini     |   N    | https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2682 + https://claude.com/docs/connectors/building/review-criteria (**Claude.ai Software Directory review criteria now anchors lane — Anthropic's own published checklist eating mcp-probe's exact positioning**) |

### Tally — 2026-05-25 (post-v1.1.0 first measurement, 2 platforms run, 2 blind spots)

- **Total cited: 0 / 20** (Perplexity 0/10, Gemini 0/10)
- "publishability" keyword in any response: **0 / 20** — the v1.1.0 differentiator term has not entered the LLM corpus yet (expected; ship was 3 days ago, well inside the indexing latency window)
- Greenfield cited (Q6, Q7, Q9, Q10): **0 / 8** — no flips
- Inspector-lane cited (Q1–Q5, Q8): **0 / 12** — no flips
- Δ vs Wk3 baseline (0/40 → normalize to /20: 0/20): **+0 cells flipped**
- Δ vs 2026-05-22 Q7 sub-sweep at top of file (lane lock-in measurement): no change — Q7 still 0/2 on Perplexity+Gemini
- Greenfield lanes status: **all 4 lanes still open** — no competitor has consolidated Q7/Q9/Q10 to a single tool; only Q6 has drifted (toward platform MCP servers on Gemini)

### Strategic findings

**Most actionable finding:** Q10 has acquired a NEW credible anchor on Gemini in the 7 days since Wk3 — **claude.com/docs/connectors/building/review-criteria** (Anthropic's own MCP connector review criteria for Claude.ai Software Directory). This is Anthropic publishing the exact "is my server publishable?" content mcp-probe v1.1.0 is built around. If Anthropic's first-party review checklist is now an LLM-cited source for the pre-publish query, the lane window is narrowing — content needs to ship in the next 2 weeks or the lane locks to claude.com/docs.

**Top-source consolidation patterns (Wk4):**
1. **`modelcontextprotocol.io/docs/tools/inspector`** — still top source for Q1, Q2, Q4 (Gemini), Q8 across both platforms. Inspector dominance is unshakeable.
2. **`philschmid.de/mcp-best-practices`** — emerged as Q5 Gemini anchor (cited 6× inline in one response). Single-author lane lock for "best practices" content.
3. **`snyk.io/articles/how-to-debug-mcp-server-with-anthropic-inspector`** — emerged as Q9 Gemini anchor. Security vendor content now competing with Inspector docs in debugging lane.
4. **`claude.com/docs/connectors/building/review-criteria`** — NEW Q10 Gemini anchor. First-party Anthropic publishability content threat.
5. **`@stephenywilson/mcp-doctor`** — cited by name in Q4 Gemini response + mcpmarket.com listing. Install-time security lane is now locked (predicted in `decision_security_suite_before_show_hn.md`).

**Per-platform incumbency profile (revised for Wk4, 2 platforms only):**

| Platform   | Citation behavior | Inspector named? | Greenfield Q6/Q7/Q9/Q10 winner |
|---|---|---|---|
| Perplexity | Names specific tools + 3rd-party blogs heavily | Yes (Q1, Q2, Q4, Q8) | Q6 bleevht.substack, Q7 cursor forum, Q9 collapsed, Q10 LinkedIn audit-checklist post |
| Gemini     | Names specific tools + structured deep response | Yes (Q1, Q2, Q4, Q8) | Q6 CircleCI MCP, Q7 spec docs, Q9 Snyk article, Q10 Anthropic review-criteria + GH disc 2682 |

**Blind spots (documented honestly):**
- ChatGPT (10 cells) — historically the platform most likely to surface mcp-quality-gate / RHEcosystemAppEng / pypi mcp-schema-validator. Cannot verify whether v1.1.0 has reached ChatGPT's index. Resume `WK4-CHATGPT-AUTH` to backfill once auth pipeline lands.
- Claude (10 cells) — historically the **highest-leverage platform for mcp-probe** because Claude composes generic answers without naming competitors. Greenfield lanes (Q6/Q7/Q9/Q10) were 100% open on Claude in Wk2. Cannot verify whether that's still true. Resume `WK4-CLAUDE-AUTH`.

### Week-over-week tracking (normalized per total cells run)

| Week | Date | Cells run | Cited | Rate | Notes |
|---|---|---|---|---|---|
| Wk1 baseline | 2026-05-03 | 40 | 0 | 0% | Pre-everything: no npm, no dev.to, no GitHub Discussions activity |
| Wk2 sweep | 2026-05-10 | 40 | 0 | 0% | Post-v1.0.2 SEO refresh + 2× dev.to + 2 GH Discussions + awesome-mcp-devtools PR + Buffer thread |
| Wk3 sweep | 2026-05-17 | 40 | 0 | 0% | Sweep showed Inspector lane fragmentation; PIVOTED scope to PUBLISHABILITY-SCORE (not security) |
| **Wk4 sweep** | **2026-05-25** | **20** | **0** | **0%** | **Post-v1.1.0 ship Fri 5/22 (T+3 days). Publishability composite shipped. Anthropic published competing first-party Q10 anchor.** |

**Caveat on /20 vs /40 comparison:** the /20 measurement could be artificially better OR worse than /40 — Perplexity + Gemini AI Mode are the most aggressive at naming specific 3rd-party tools, so absent ChatGPT + Claude (where Wk2 showed Claude was 100% open on greenfield) we may be measuring the harder-to-flip platforms only. The 0/20 floor is honest; it does not refute the possibility that Claude has flipped Q7/Q9/Q10.

### Decision: keep amplification ON

- T+3 days is well inside indexing latency. No flip was expected at Wk4; the measurement establishes the post-v1.1.0 /20 baseline.
- Greenfield lanes Q7/Q9/Q10 still open on both run platforms (no competitor consolidation). Window remains.
- **NEW WK5 PRIORITY:** Q10 Gemini lane lock risk from claude.com/docs/connectors/building/review-criteria — needs a published artifact (dev.to / blog post / Show HN) explicitly framing "publishability score" before Anthropic's first-party content compounds in citation weight.
- Re-measure Sun 2026-06-01 15:00 TPE (Wk5). Watch Q7 + Q10 specifically. If still 0/8 on greenfield at Wk5, escalate to dedicated dev.to article per lane.

### Resume keywords

- `WK4-CHATGPT-AUTH` / `WK4-CLAUDE-AUTH` — backfill the 2 blind-spot platforms once auth pipeline lands.
- `WK5-Q10-ARTIFACT` — ship a "publishability score" framing article before Anthropic review-criteria compounds.
- Wk5 full sweep schedule: **Sun 2026-06-01 15:00 TPE**.


---

## 2026-05-27 — Wk5 daily-presence fire (3 GH + 1 Twitter, scheduled)

**Fired Tue 2026-05-27 ~09:55 TPE** via gh CLI + Buffer MCP (autonomous, user-authorized override of `feedback_manual_fire_external_posts.md` for this run).

### GitHub-venue replies (3/4 fired)

| # | Venue | Thread | Template | Probe? | Permalink |
|---|---|---|---|---|---|
| 1 | gh-issue | modelcontextprotocol/servers#3401 | D2 | Y | https://github.com/modelcontextprotocol/servers/issues/3401#issuecomment-4550568313 |
| 2 | gh-discussion | modelcontextprotocol/modelcontextprotocol#2733 | D2 | Y | https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2733#discussioncomment-17069684 |
| 3 | gh-issue | anthropics/claude-code#47565 | D1 | N | https://github.com/anthropics/claude-code/issues/47565#issuecomment-4550568449 |
| 4 | cursor-forum | forum.cursor.com/t/.../161459 | D2-adj | N | **NOT FIRED** — no Discourse auth; draft at `docs/launch/wk4-presence-2026-05-27/gh-replies/04-cursor-161459-list-changed-not-acted.md` |

**Fired probe-mention ratio:** 2/3 = 67% (slightly over ≤50% ceiling — recalibrate Wk5 D2 with more probe-free replies).

### Reddit (0/2 fired — all blocked)

| # | Venue | Thread | Template | Probe? | Status |
|---|---|---|---|---|---|
| 5 | reddit-r-mcp | r/mcp/1tmwzoj "How can i improve the use of tools?" | R2 | Y | **DRAFT ONLY** — `feedback_reddit_velocity` blocker (u/incultnito karma) |
| 6 | reddit-r-ClaudeAI | r/ClaudeAI/1tn6cey "MCP stack on 2 axes" | R1-adapted | Y | **DRAFT ONLY** — same blocker |

### Twitter (1 fire — Puppeteer scorecard amplify)

| # | Venue | Surface | Status |
|---|---|---|---|
| 7 | twitter | 4-tweet thread @Incultnito via Buffer | **QUEUED** — Buffer post id `6a164f29aa612799d203b88a`, dueAt 2026-05-27T01:58Z (≈09:58 TPE). Tweets 2+3 compressed to fit 280-char limit; content equivalent. |

### Own-repo Q&A seeded earlier this session

5 Discussions LIVE on `Incultnitollc/mcp-probe` — Perplexity-friendly Q&A surface for greenfield lanes:

- #15 https://github.com/Incultnitollc/mcp-probe/discussions/15 — Q6 CI pipeline
- #16 https://github.com/Incultnitollc/mcp-probe/discussions/16 — Q7 missing description
- #17 https://github.com/Incultnitollc/mcp-probe/discussions/17 — Q9 debug tool calls
- #18 https://github.com/Incultnitollc/mcp-probe/discussions/18 — Q10 pre-publish checklist
- #19 https://github.com/Incultnitollc/mcp-probe/discussions/19 — synthesis (publishability scorecard 5-axis)

### Manual fires — ALL POSTED 2026-05-27 (Peng manual, permalinks pending)

- ✅ Cursor forum #161459 reply
- ✅ r/mcp `1tmwzoj` reply
- ✅ r/ClaudeAI `1tn6cey` reply
- ✅ r/mcp Puppeteer cross-post `1to5c9c` (4a only — backup `1tle6gl` skipped)
- ✅ dev.to Puppeteer blog (incultnitollc acct)

**Permalinks to backfill** when convenient — open the 5 surfaces, copy the comment/post URLs, paste here. Wk5 sweep Sun 2026-06-01 will need them to attribute any citation flips.

### Resume keyword

`WK4-PRESENCE` — drafts under `docs/launch/wk4-presence-2026-05-27/` and `docs/launch/scorecards-puppeteer/`.


---

## 2026-05-28 — Spec-repo thread #2733 follow-up draft (pending manual fire)

**Trigger:** Zawwarsami16 replied to Wk4 fire #2 on `modelcontextprotocol/modelcontextprotocol#2733` with a substantive fifth-bucket proposal (`liveCall` behavior) and organically named `mcp-probe` in their reply. Continued engagement keeps probe in-thread on the spec repo's most-read validator discussion.

### Draft

| # | Venue | Thread | Template | Probe? | Status |
|---|---|---|---|---|---|
| 8 | gh-discussion | modelcontextprotocol/modelcontextprotocol#2733 (followup to Zawwarsami16) | D2-followup | Y | **DRAFT** — `docs/launch/wk4-presence-2026-05-27/gh-replies/02b-mcp-discussion-2733-followup-livecall-bucket.md` |

**Probe-mention posture:** 1 honest scope-acknowledgment ("bucket 4 is what probe covers today; bucket 5 is uncovered, probe included") + 1 mid-flow reference about wiring stdio-guard findings into probe's scorecard. No pitch. Probe was named upthread by Zawwarsami16 organically, so the mention is responsive rather than promotional.

**Fire path:** manual paste by Peng — gh CLI auto-fire OK but content is high-signal enough on the spec repo that a hand-fire keeps cadence natural. Pre-fire state check: verify thread still OPEN and not locked; verify no other reply has landed between draft and fire (re-read top of thread for new context).

**Permalink to backfill** after fire — same row as above.

### Resume keyword

`WK5-2733-FOLLOWUP` — single-thread continuation on the spec repo's validator discussion.

---

## 2026-05-29 — Wk5 daily-presence fire (2 GH + clinic cross-link, manual)

**Fired Fri 2026-05-29 ~21:30 TPE** by Peng (manual paste). Drafts at `docs/launch/wk5-presence-2026-05-29/`.

### GitHub-venue replies (2 fired)

| # | Venue | Thread | Probe? | Permalink |
|---|---|---|---|---|
| 1 | gh-discussion | modelcontextprotocol/modelcontextprotocol#2812 (token overhead) | Y | https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2812#discussioncomment-17106730 |
| 2 | gh-issue | anthropics/claude-code#63451 (Opus 4.8 ignores schemas) | N | https://github.com/anthropics/claude-code/issues/63451#issuecomment-4576668661 |

**Fired probe-mention ratio:** 1/2 = 50% — at ≤50% ceiling, deliberate recalibration from Wk5 D2's 67%.

### Clinic cross-link (new Show-and-tell on MCP org repo)

| Surface | Thread | Framing | Permalink |
|---|---|---|---|
| gh-discussion | modelcontextprotocol/modelcontextprotocol#2816 | async (links mcp-probe #13) | https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2816#discussion-10161869 |

### Not fired this batch (honest shortfall vs 4-GH target)

- modelcontextprotocol#2682 — already engaged (PengSpirit commenter) · #2733 — Wk5 follow-up draft pending separately
- mcp/servers#4250 — empty body · mcp/servers#4254 — territorial-risk (competing scorer resource-add)
- **Reddit r/mcp + r/ClaudeAI — NOT browsed**, curl `.json` hard-403'd all hosts/UAs this session; Cursor forum not swept

### Resume keyword

`WK5-PRESENCE-2026-05-29` — 3 surfaces live; Sun 6/1 sweep should watch #2812 + #2816 for citation pickup.
