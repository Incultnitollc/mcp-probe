# mcp-probe citation sweep — 2026-06-21 — ChatGPT + Claude (OWED, login-walled)

**Status:** Perplexity + Gemini already swept 6/7 = 0/20. This sheet covers the 2 login-walled platforms = 20 remaining cells.
**How:** New chat, no memory/context. Paste each query verbatim. Mark `Y` if mcp-probe is named/linked anywhere; else `N`. Put the top cited URL/domain in **Top source** (even if not us — shows who owns the lane).
**Greenfield lanes (we should win):** Q6, Q7, Q9, Q10. **Inspector-owned:** Q1–Q5, Q8.
**Screenshots:** drop into this same folder. When done, roll tally into the 2026-06-22 Monday snapshot.

> **ChatGPT run: 2026-06-16 via Playwright (Temporary Chat, logged-in Free, web browsing ON).**
> Result: **0/10 cited.** Screenshots `chatgpt-Q1.png … chatgpt-Q10.png` in this folder.
> ⚠️ Caveat: account personalization leaked ("your Incultnito project" on Q2) — not an organic mcp-probe citation; scored N.

---

### Q1: how do I test my MCP server  *(Inspector lane)*
| Platform | Cited? | Top source |
|---|---|---|
| ChatGPT | N | MCP Inspector (@modelcontextprotocol/inspector) |
| Claude  | N | none (training answer, custom SHIP-OUTCOME format; no tool) |

### Q2: MCP server validation tool  *(Inspector lane)*
| Platform | Cited? | Top source |
|---|---|---|
| ChatGPT | N | MCP Inspector / mcp-validation / VibeCheck / MCP Evals (GitHub) |
| Claude  | N | none (clarifying question, no tool named) |

### Q3: MCP schema validator  *(Inspector lane)*
| Platform | Cited? | Top source |
|---|---|---|
| ChatGPT | N | MCP Server Spot |
| Claude  | N | none (clarifying question; mentions "official MCP spec") |

### Q4: tool to check MCP server health  *(Inspector lane)*
| Platform | Cited? | Top source |
|---|---|---|
| ChatGPT | N | MCP Inspector (+ Prometheus/Grafana for prod) |
| Claude  | N | none (personalized — lists your 12 connected MCPs) |

### Q5: best practices for MCP server schemas  *(Inspector lane)*
| Platform | Cited? | Top source |
|---|---|---|
| ChatGPT | N | none (general best-practices, no source) |
| Claude  | N | jsonschemavalidator.net (generic JSON Schema validator) |

### Q6: MCP server CI pipeline  *(GREENFIELD — mcp-probe lane)*
| Platform | Cited? | Top source |
|---|---|---|
| ChatGPT | N | none (Dependabot/Trivy/CodeQL — no MCP-specific tool) |
| Claude  | N* | *mcp-probe named — but from Peng's OWN Claude memory, NOT organic. Scored N |

### Q7: what does missing description on MCP tool do  *(GREENFIELD — mcp-probe lane)*
| Platform | Cited? | Top source |
|---|---|---|
| ChatGPT | N | none (conceptual answer, no source) |
| Claude  | N | none (conceptual answer, no tool) |

### Q8: Anthropic MCP server diagnostic  *(Inspector lane)*
| Platform | Cited? | Top source |
|---|---|---|
| ChatGPT | N | MCP Inspector (+ Altor) |
| Claude  | N | none (clarifying question, no tool) |

### Q9: how to debug MCP tool calls  *(GREENFIELD — mcp-probe lane)*
| Platform | Cited? | Top source |
|---|---|---|
| ChatGPT | N | none (conceptual debug steps, no source) |
| Claude  | N | none (Claude.ai-specific debug steps, no tool) |

### Q10: MCP server pre-publish checklist  *(GREENFIELD — mcp-probe HEADLINE lane)*
| Platform | Cited? | Top source |
|---|---|---|
| ChatGPT | N | none (self-generated checklist, no source/dev.to) — lane WIDE OPEN |
| Claude  | N* | *mcp-probe named — from Peng's OWN memory ("shipping to Show HN ~Jun 16"), NOT dev.to / NOT organic. Scored N |

---

## Tally
- ChatGPT cited: **0 / 10** (run 2026-06-16, Temporary Chat, web ON)
- Claude cited (organic): **0 / 10** (run 2026-06-16) — *Q6 & Q10 named mcp-probe but pulled from Peng's own Claude memory, not an organic citation; both scored N.*
- **6/21 ChatGPT+Claude subtotal: 0 / 20**
- Combined with 6/7 Perplexity+Gemini (0/20) → **full sweep 0 / 40** → feeds 2026-06-22 snapshot.

### ChatGPT read (2026-06-16)
- **0/10 across all platforms.** Inspector lanes (Q1–Q4,Q8) owned by **MCP Inspector**; Q2 also names mcp-validation/VibeCheck/MCP Evals; Q3 → MCP Server Spot.
- **All 4 greenfield lanes (Q6,Q7,Q9,Q10) returned NO cited tool** — ChatGPT answers from training, cites nothing. Lanes are open, not lost.
- Q10 (headline "pre-publish checklist") = self-generated list, **no dev.to / no mcp-probe** → article published 6/15 not yet indexed. **Distribution (Task B) is the unlock**, not content.

### Claude read (2026-06-16) — ⚠️ CONTAMINATED, treat as INVALID citation signal
- Logged in as Peng (Max plan, Haiku 4.5, no web search). Two account features broke test purity:
  1. **Custom instructions** → Claude opens with "I'm going to push back / I disagree…" and asks a clarifying question instead of recommending any tool. So it named **zero** tools (ours OR competitors') on most queries.
  2. **Claude memory** → injected "mcp-probe" itself on Q6 & Q10 ("you're shipping mcp-probe to Show HN ~Jun 16"). That's Peng's own data echoed back, **not** a third-party citation. Scored N.
- **Net organic Claude citations of mcp-probe: 0.** For a clean Claude citation test, re-run logged-out (or memory + custom-instructions OFF).

### Bottom line
- **Full sweep 0/40.** mcp-probe is **not yet cited by any AI engine.** Expected — article published 6/15, zero distribution yet.
- Competitor map: **MCP Inspector** owns testing/diagnostic lanes; **mcp-validation / MCP Server Spot / VibeCheck / MCP Evals** appear on validation lanes.
- **Greenfield lanes (Q6 CI, Q7 missing-desc, Q9 debug, Q10 pre-publish) have NO incumbent** — open for the taking once content is indexed + distributed. → **Task B (Reddit r/mcp + MCP Discord seeding) is the lever.**
