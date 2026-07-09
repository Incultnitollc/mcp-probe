# mcp-probe — Distribution Rethink (supersedes Wk6 social-first)

**Date:** 2026-06-07
**Trigger:** Peng directive — "stop replying to singular persons; rethink; research whether social marketing is still viable and how to be more reachable."
**Verdict:** **Social broadcast was the wrong primary channel. Pivot from push (social/reply farming) to pull (install-time + publish-time discovery).** Demote social to a supporting role. Stop all 1:1 reply farming immediately.
**Evidence:** 6 wks data (1/5, citation 0/20, 0 organic stars) + 2026 channel research (sources at bottom).

---

## 1. Is social marketing still viable in 2026? — Mostly NO for this tool

| Finding (2026 data) | Implication for mcp-probe |
|---|---|
| Only **~10%** of marketing clients still actively use X; most 2026 onboardings exclude it. | X is now a *niche* channel, not an acquisition engine. |
| X external-link CTR fell **1.8% (2024) → 1.2% (2026)**. | Social barely drives traffic anymore — exactly our 6-wk result. |
| X still works for **real-time B2B/tech conversation**, expert threads. | Keep as *presence/credibility*, not as the growth bet. |
| "Devs find tools at **install-time, not search-time**." | Our whole motion targeted the wrong moment. |
| 1:1 reply farming = O(n) effort, O(0) compound (our own Wk5 lesson, re-confirmed). | **Stop entirely.** Lowest-leverage activity we run. |

**Honest read:** The Wk6 "social-first" pivot doubled down on a *declining* channel. 6 weeks of GitHub-presence + 1 week of social broadcast produced 0 organic stars, 0 mentions, 0 external replies, 0 citations. The channel isn't underperforming — it's the wrong channel for a dev tool.

## 2. The reframe: be reachable at INSTALL-TIME and PUBLISH-TIME

Our users = **MCP server authors**. They don't browse X for a validator. They appear at two moments:
- **Publish-time** — when they ship a server to npm / the MCP Registry / Smithery / Glama / mcp.so.
- **Install-time / CI-time** — when they (or their team) wire up the build.

The whole strategy should intercept those two moments. Conversion math backs it: **package-registry / install-time leads convert at 15–30% vs 2–5% for marketing leads.** Content that targets *problem queries* compounds in both SEO and AI-training. Social does neither.

## 3. New strategy — 4 plays, ranked by leverage

### PLAY 1 (PRIMARY) — Embed in the workflow (integration flywheel)
**Bet:** the tool that runs *automatically* at publish/CI time beats the tool you have to remember.
- **Ship mcp-probe AS an MCP server** ("probe this server" tool an agent can call) → list in the **official MCP Registry** (`registry.modelcontextprotocol.io`) via `/.well-known/mcp/server.json` auto-discovery + the coming **MCP Server Cards** standard. This is the one move that puts us *inside* the ecosystem's own discovery layer (27k+ servers aggregated across Official/Glama/Smithery).
- **Re-push the GitHub Action** (`docs/specs/mcp-probe-action-v1.md`, `examples/publishability-gate.yml` already exist) — "publishability gate" that runs on every PR/release. Partners/users do the distribution: every repo that adds the gate is a permanent install-time billboard.
- List in **Smithery / Glama / mcp.so / awesome-mcp-devtools** (chase #156 merge — still the cheapest external proof point).

### PLAY 2 (COMPOUNDING) — Problem-focused content, on-domain first
**Bet:** one good comparison/how-to ranks in the top 10 for a year and trains the AI engines.
- Write for the **query, not the product**: "how to publish an MCP server", "why my MCP tool isn't being called", "MCP server pre-publish checklist", "what makes a good MCP tool description".
- Publish on **our domain first**, then syndicate to **dev.to / Hashnode 2–10 days later with `rel=canonical`**. (Dev.to tutorials: 1.5k–5k views, free; multi-platform syndication +85% engagement.)
- This is also our **GEO fix** — the 0/20 citation problem is downstream of having no citation-friendly, problem-answering content. Structure for the "extraction zone": lead each post with a 1–2 sentence direct answer + a named number.

### PLAY 3 (TRUST) — Communities, value-first, never pitch
**Bet:** 52% of dev discovery is "dark social" (untrackable peer rec).
- r/mcp, r/LocalLLaMA, MCP Discord, language communities — **answer real questions with screenshots** (a 46/100 → 8/10 scorecard image), no link-drop. Diagnosis-first (our existing community-presence-log discipline already encodes this).
- This is the ONLY place the old "reply" muscle is allowed — and only as *help in a public forum*, never 1:1 DM/reply farming.

### PLAY 4 (DEMOTED) — Social as presence, not acquisition
- Keep @Incultnito posting the *content* from Play 2 + video clips. 1 substantive post when there's something real to show. **Kill the reply-quota and the influencer-chase as a growth tactic.**
- Track C / influencer co-sign: only if it falls out of genuine content engagement, never as outbound.

## 4. What we STOP (effective today)

| Stop | Why |
|---|---|
| 1:1 reply farming (Track B/C reply quotas) | O(0) compound; lowest-leverage; Peng directive |
| Influencer outreach as a *tactic* | Push motion; same failure shape as cold DMs |
| Daily GitHub Discussion fires | 0/9 external in 6 wks (already stopped, stays stopped) |
| Weekly citation sweeps | Already bi-weekly; keep diagnostic-only |
| Treating "post on X" as a growth lever | CTR collapsed; it's presence, not acquisition |

## 5. Two-week plan (2026-06-08 → 06-21)

| Week | Focus | Concrete output |
|---|---|---|
| Wk A (6/8–6/14) | Foundation | (1) npm metadata rewrite — problem keywords, runnable examples, fresh README; (2) scope "mcp-probe as MCP server" + Registry `server.json`; (3) draft article #1 "MCP server pre-publish checklist" on-domain |
| Wk B (6/15–6/21) | Embed + publish | (1) ship/register MCP-server build OR re-launch GitHub Action with a real example repo; (2) publish article #1 + syndicate to dev.to; (3) 2 value-first community answers (Reddit/Discord) with scorecard screenshots |

**6/15 gate:** likely still misses on current metrics — that's expected; this pivot won't show in 7 days. **Move Show HN to ≥2026-06-30 and gate it on Play-1 traction (Registry listing live + ≥1 external repo using the Action), not on social metrics.**

## 6. Risks
- "Ship as MCP server" is real eng work — timebox a spike before committing; if >2 days, ship the Action re-launch first (already built).
- Content compounds slowly (6–18 mo attribution lag) — set expectations; this is the floor, not a sprint.
- Cross-leverage check: mcp-probe's scorecards feed **MCP Vouch** trust badges + the **MCP Registry** flagship — distribution effort here is not siloed, it compounds the Month-2 bet.

## 7. Strategic fork for Peng (confirm before Wk A)
1. **How hard to pivot social?** Recommend: demote to presence-only, kill reply/influencer quotas. (vs keep a light X cadence)
2. **Build the MCP-server wedge?** Recommend: spike it (2-day cap) — it's the single highest-leverage move (puts us in the ecosystem's own discovery layer). (vs Action-only, zero new eng)
3. **mcp-probe vs MCP Registry priority** — if distribution bandwidth is scarce, the Registry is the flagship; mcp-probe distribution should ride alongside it (badges/scorecards), not compete for the same hours.

## NOTION DECISIONS-LOG PASTE BLOCK
```
2026-06-07 — mcp-probe distribution rethink (supersedes Wk6 social-first).
Verdict: social broadcast = wrong primary channel for a dev tool in 2026
(X ~10% marketer adoption, link CTR 1.8%→1.2%; "devs discover at install-time").
Pivot push→pull: PRIMARY = embed in workflow (ship as MCP server + Registry
.well-known auto-discovery + re-push GitHub Action publishability gate);
COMPOUNDING = problem-focused content on-domain→dev.to (also the GEO fix);
TRUST = value-first community answers; social DEMOTED to presence only.
STOP all 1:1 reply farming + influencer outreach as a tactic.
Show HN re-gated on Registry/Action traction, not social, ≥2026-06-30.
Doc: docs/notion/2026-06-07-distribution-rethink.md.
```
