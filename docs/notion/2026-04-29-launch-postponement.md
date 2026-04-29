# Decision: postpone Wed 04-29 21:45 launch → 4-week pre-launch playbook

**Date:** 2026-04-29 (Wed) ~10:00 Taipei
**Notion target:** Decisions Log (database `4acefbb1-e3b1-4c1b-9b80-24e2e3bf3d62`)
**Status:** POSTPONED · DROP-READY LOCK released
**Owner:** Peng
**Entities affected:** Incultnito LLC; mcp-probe (package); GitHub org `incultnitollc`
**Related GCal events:** all 11 launch-week events from Wed 04-29 21:30 through Mon 05-05 22:00 → suspend or move

## Decision

Postpone the planned **Wed 2026-04-29 21:45 Taipei** launch indefinitely. Replace the "single big-bang launch night" plan with a **4-week pre-launch playbook** that builds seed audience and AI-citation surface first, then gates Show HN on a 5-metric trigger rather than a calendar date.

DROP-READY LOCK released — postponement means more prep work, which means more commits.

## Why

Cold-launching a dev-tool with **zero warm audience** on HN + 3 Reddits + Twitter + Discord is 90% noise. The launch copy is ready; the **distribution** isn't. Specifically:

1. Solo founder, no prior platform, English-teacher day job — there are no 30-50 warm contacts ready to upvote/comment in the first hour to lift HN past page 3.
2. Show HN with no seed = single coin-flip we can't influence.
3. Anthropic's MCP Inspector owns the obvious queries (*"MCP server validation tool"*, *"how to test MCP server"*) — competing head-on is uphill.
4. The greenfield queries (*"MCP server CI pipeline"*, *"missing description on MCP tool"*, *"MCP server pre-publish checklist"*) currently have **no authoritative answer** in any LLM's training data. That's the lane to own.
5. Postponing today is what catching the bug at rehearsal-time looks like — the rehearsal earlier this morning already caught a critical `REPO_URL` 404 bug at `scripts/launch.sh:22` that would have shipped a broken HN headline.

## Strategy reframe

| Old plan | New plan |
|---|---|
| Single big-bang launch Wed 21:45 Taipei | 4-week pre-launch presence + content sprint, then trigger-gated Show HN |
| Compete on "what tool exists" queries | Skip those (Anthropic Inspector wins); own 4 greenfield query lanes |
| Blog `published: false` until launch night | Flip `published: true` Week 1 — blog is the seed, not the climax |
| Single-day distribution | Weekly scorecard drops + daily community presence |

## What was executed today

| Step | Where | Commit / verification |
|---|---|---|
| Three parallel specialist reviews requested | Developer Advocate · Growth Hacker · AI Citation Strategist | Returned within 5 min each; full outputs preserved in session log |
| Plan synthesis | this doc + launch memory | unified 4-week playbook with Week-0 harm fixes + Week 1-4 cadence + 5-metric trigger |
| Week-0 harm-audit fixes shipped | `README.md` · `docs/blog/week-2-testing-mcp-servers.md` · `docs/scorecards/SUMMARY.md` | `26e5bdb` |
| Postponement decision log | this file | this commit |

### The Week-0 fixes (already shipped in `26e5bdb`)

- README: `## What it does` → `## Test your MCP server in 30 seconds` (mirrors high-intent query string)
- README: added `## CI integration` H2 with sample GH Actions snippet (greenfield query "MCP server CI pipeline")
- README: added `## Compared to MCP Inspector` H2 (entity bridging vs the Anthropic-owned reference tool)
- README: added "Built on the Anthropic Model Context Protocol (MCP) spec" entity-bridging line
- Blog: title rewritten to mirror greenfield query *"missing parameter descriptions break MCP clients"*
- SUMMARY.md: 2-sentence declarative TL;DR lede at top (citation-friendly)

## The unified 4-week playbook

### Week 1 — Foundation (~7 hrs)

- Flip blog `published: true` and cross-post to dev.to (canonical = GitHub blog file)
- Write `docs/checklist.md` "MCP Server Pre-Publish Checklist" (P1.1, greenfield query 10)
- PR to `punkpeye/awesome-mcp-servers` (Tools section)
- Reshape blog into "MCP Server Conformance Checklist" → post as GitHub Discussion in `modelcontextprotocol/servers` (frame as community standard, NOT product post)
- Tue 21:00 TPE: publish first community scorecard (Postgres MCP server)
- Daily Discord/Reddit cadence: 4 helpful replies in MCP Discord using `mcp-probe test` evidence, 2 r/mcp replies on existing threads, 1 r/ClaudeAI

### Week 2 — SEO Beachhead

- Write `docs/ci.md` "MCP Server CI Pipeline (GitHub Actions)" (P2.1, greenfield query 6)
- Cross-post to Hashnode
- Stack Overflow: 1-2 unanswered `[mcp]` tag answers
- Tue: publish GitHub MCP scorecard
- Continue daily presence cadence
- Monday metric snapshot

### Week 3 — Adjacency

- **Ship `mcp-probe-action` GitHub Action** — huge greenfield play
- Write `docs/comparison.md` "mcp-probe vs MCP Inspector: When to Use Each"
- Tue + Thu: double scorecard drop (Slack + Filesystem)
- **Launch MCP Server Clinic** Friday 21:00 Taipei in MCP Discord (45 min, "bring a launch command, get a live scorecard") — ask mod first
- PR to `modelcontextprotocol/servers` README "Community tools" section
- Comment on `modelcontextprotocol/inspector` README cross-mention

### Week 4 — Trigger Check

- Tue + Thu: scorecards 5 + 6 (puppeteer + brave-search)
- Seed 5 GitHub Discussions threads matching greenfield queries (Perplexity-friendly Q&A surface)
- Friday MCP Server Clinic #2
- **Monday end-of-Week-4: trigger check**

## Show HN trigger — ALL 5 must hit simultaneously

| Metric | Threshold | Source |
|---|---|---|
| GitHub stars (organic) | ≥100 | github.com/incultnitollc/mcp-probe |
| npm weekly downloads | ≥150 | npm-stat.com |
| Unsolicited mentions (not from Peng) | ≥5 | GitHub search + X search |
| Scorecards published | ≥6 | `/docs/scorecards` |
| Discussions replies from ≥5 distinct users | ≥10 | own repo |

5/5 → Show HN Tue 09:00 ET (Tue 21:00 Taipei), Week 5.
3-4/5 → extend 2 weeks.
<3/5 → re-strategize, don't push.

## Weekly metric snapshot (Monday 09:00 TPE, ≤5 min)

```
mcp-probe — Week of YYYY-MM-DD
- GH stars: N (Δ +X)
- npm weekly DL: N
- Unsolicited mentions: N
- Discussions threads: N (replies: M from D distinct users)
- Scorecards live: N
- Citation sweep (10 queries × 4 LLMs): X cited / 40 (Δ +Y)
- Trigger status: X/5 hit
- Decision: continue / launch / extend
```

## Manual steps Claude cannot automate (Peng action required)

1. **GCal cleanup** — suspend or move all 11 launch-week events from Wed 04-29 21:30 through Mon 05-05 22:00. Re-arm calendar around the trigger-hit week (likely Week 5 = ~2026-05-27 onwards). Original GCal-arming prompt preserved at `~/.claude/projects/.../memory/archive/project_gcal_prompt.md` if a full re-run is needed.
2. **Cloudflare Web Analytics deferred** — was in the original Week-0 list, but doesn't apply until Peng has a standalone domain hosting the blog. dev.to + Hashnode have built-in stats; GitHub repo has free Insights tab. Revisit if/when a domain is set up.
3. **Paste this decision-log entry into Notion** (in clipboard).
4. **First Sunday citation sweep** — 15 min on Perplexity/ChatGPT/Claude/Gemini against the 10 high-intent queries. Log baselines in `docs/citation-log.md` (to be created Week 1).
5. **Weekly Monday metric snapshot** — paste the template above into Notion, fill in numbers, decide.

## Downstream impact

- **Probe launch:** moved from Wed 2026-04-29 21:45 Taipei → trigger-gated, target Week 5 (~2026-05-27) earliest. Could land as late as Week 6-7 if trigger lags.
- **Incultnito Studio (PH 2026-05-16):** unaffected — separate product, separate launch. The Probe postponement actually *helps* — frees up Peng's launch-week bandwidth for Studio prep.
- **MCP Registry:** unaffected — sibling repo.

## What was NOT changed today

- Tonight's `./scripts/launch.sh` will NOT be run. The 4 prefilled tabs that the rehearsal validated stay unfired.
- No commits to npm. v1.0.1 stays current. Next bump comes when Week 3's `mcp-probe-action` ships.
- No retraction of the 72h heads-up issues filed Apr 19 at `modelcontextprotocol/servers#3984` + `#3985` — they remain valid maintainer courtesy regardless of launch timing.
- Demo gif, OG card, scorecards — all unchanged, all still pre-positioned for the eventual Show HN.

## Links

- Week-0 harm-audit commit: <https://github.com/incultnitollc/mcp-probe/commit/26e5bdb>
- Rehearsal commit (earlier today): <https://github.com/incultnitollc/mcp-probe/commit/940b38b>
- Repo: <https://github.com/incultnitollc/mcp-probe>
- npm: <https://www.npmjs.com/package/@incultnitollc/mcp-probe>
- Anthropic MCP Inspector (peer/reference, NOT competitor): <https://github.com/modelcontextprotocol/inspector>
- awesome-mcp-servers (Week 1 PR target): <https://github.com/punkpeye/awesome-mcp-servers>
