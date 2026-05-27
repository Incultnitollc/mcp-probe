# r/ClaudeAI hunt log — 2026-05-27 09:35 TPE

Queries (curl + Mozilla UA, sort=new, t=week, limit=30):
- `?q=mcp+tool` → 30 results
- `?q=mcp+server` → 30 results

Filter: 3-15 comments, not locked/archived, not showcase/built flair.

## Candidates considered

| ID | Title | Comments | Flair | Verdict |
|---|---|---|---|---|
| 1to6zg8 | "This is insane." | 4 | mcp | Skip — title too thin to assess fit; likely rant |
| 1tnidlo | "How do you discover and vet MCP servers? package registry yet?" | 8 | Question | **Considered** — registry/discovery question; probe doesn't squarely answer this (probe = schema audit, not discovery). Per rules, no probe mention warranted; reply would be Smithery/Glama discussion, off-axis for cadence. Skip. |
| 1tn6cey | "Measured MCP stack on byte savings + cache-friendliness; 12-anti-pattern audit on tool definitions" | 6 | Claude Workflow | **CHOSEN** — OP literally built a tool-definition anti-pattern audit. Direct probe-lane overlap; honest peer-level reply with probe-mention as one of three surfaces. R1 template. |
| 1tn2o1w | "73% of Anthropic bill was MCP tool calls, not chat" | 5 | Workaround | Skip — cost/response-size problem (Playwright DOM dumps); probe doesn't speak to response size. Reply would be off-axis. |
| 1tmotsp | "MCP Server for agent governance" | 9 | Vibe Coding | Skip — policy/tool-gating, not schema quality. Probe doesn't fit. |
| 1tmo693 | "Claude issues with design and MCP" | 5 | Workaround | Skip — WordPress/Blocksy theme implementation; MCP is incidental, not the core problem. |
| 1tmnj25 | "Master's practicum MCP security/privacy" | 5 | MCP | Skip — student red-team scope, not server-author schema quality. `@stephenywilson/mcp-doctor` owns this lane. |
| 1tm41s3 | "Built a Cybersecurity MCP Server" | 11 | Workaround | Skip — showcase pattern, "I built X" framing. |
| 1tll4mv | "Deterministic multi-subagent orchestration CC 2.1.146" | 9 | news | Skip — news/release thread. |
| 1tlnrhp | "PM running Notion MCP for 3 weeks, add Linear too?" | 9 | other | Skip — tool-stack choice question, off-axis. |

Verified `1tn6cey` state OPEN, not locked, not archived at 2026-05-27 09:35 TPE (created 2026-05-27, very recent — OP likely still engaged).

Probe-mention decision: Y. Justification: OP's "12-anti-pattern audit on tool definitions" is directly probe's primary axis. Reply leads with cache-friendliness diagnosis + three-axis breakdown of tool-definition failure modes (technical content first), then names Inspector + probe at the end as complementary surfaces with OP's harness explicitly positioned as going further on the byte-economy axis. No "I built X", no top-post, no `npm install` lead.
