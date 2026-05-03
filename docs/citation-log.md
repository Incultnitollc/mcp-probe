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
