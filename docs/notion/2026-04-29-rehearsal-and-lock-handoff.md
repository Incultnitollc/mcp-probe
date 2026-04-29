# Session closeout: Compressed dress rehearsal + DROP-READY LOCK (T-15h to launch)

**Date:** 2026-04-29 (Wed) ~06:00 Taipei
**Notion target:** Decisions Log (database `4acefbb1-e3b1-4c1b-9b80-24e2e3bf3d62`)
**Status:** Executed; DROP-READY LOCK declared
**Owner:** Peng
**Entities affected:** Incultnito LLC (legal); mcp-probe (package); GitHub org `incultnitollc`
**Related GCal event:** "Probe: Compressed dress rehearsal + DROP-READY LOCK" (Peng's resequence; original schedule had these as separate Mon/Tue events)

## Decision

Execute the dress rehearsal as a **read-and-mirror dry-run** of `scripts/launch.sh` (printing URLs without firing the browser opener), fix any stale URLs found, then declare DROP-READY LOCK. No further commits before Wed 21:30 pre-flight.

## Why this approach (not actual `bash scripts/launch.sh`)

- The script has no `--dry-run` flag. Running it unconditionally calls `open` on 4 URLs (HN submit, r/mcp prefilled, r/ClaudeAI prefilled, Twitter intent), with `sleep 2` between each.
- Real risk surface: accidental Submit click during inspection, Reddit "submit page opened twice" warnings, two Twitter compose tabs polluting drafts.
- Mirror-script approach reproduces the exact URL-construction logic (same `url_encode` python3 path, same awk extraction of tweet 1 from twitter-thread.md, same body cat-and-encode) but pipes the URLs to stdout instead of `open`. Same correctness signal, zero side effects.

## What was executed

| Step | Where | Commit / verification |
|---|---|---|
| Read `scripts/launch.sh` end-to-end | local | confirmed 5-channel flow: HN → r/mcp → r/ClaudeAI → Twitter → Discord (manual) |
| **CRITICAL BUG: stale `REPO_URL`** found at line 22 | `scripts/launch.sh:22` | `https://github.com/PengSpirit/mcp-doctor` (BOTH old user AND old repo name; would have 404'd on HN paste + Twitter tweet 1) |
| Bug 2: HN title casing | `scripts/launch.sh:72` | `Mcp-probe` → `mcp-probe` (matches npm package casing) |
| Bug 3: stale install command | `README.md:123` | `cd mcp-doctor` after `git clone .../mcp-probe.git` (left users in non-existent dir) |
| Bug 4: stale license attribution link | `README.md:131` | `[Incultnito LLC](https://github.com/PengSpirit)` → `.../incultnitollc` |
| Structural fix: `.gitignore` | `.gitignore:7` | `scripts/` → `scripts/*` (git can't un-ignore inside a fully-ignored dir; the `!scripts/launch.sh` negation now actually works) |
| Single commit + push | `940b38b` | `de252db..940b38b main -> main` |
| Dry-run verification (mirror script) | bash one-shot | All 4 URLs construct clean; tweet 1 = 270 weighted chars (safe ≤280); REPO_URL HEAD = HTTP/2 200 |
| Final stale-string sweep | grep across all launch surfaces | `scripts/launch.sh README.md MIGRATION.md package.json docs/launch/*.md docs/launch/heads-up/*.md .github/ISSUE_TEMPLATE/config.yml` returns ZERO unexpected hits |

### URLs the launch.sh dry-run will fire tonight

1. **Show HN** → `https://news.ycombinator.com/submit` + manual paste of title `Show HN: mcp-probe – one command to health-check any MCP server` and URL `https://github.com/incultnitollc/mcp-probe`
2. **r/mcp** → `https://old.reddit.com/r/mcp/submit?title=...&text=...` (3,986 chars total)
3. **r/ClaudeAI** → `https://old.reddit.com/r/ClaudeAI/submit?title=...&text=...` (3,350 chars total)
4. **Twitter intent** → `https://twitter.com/intent/tweet?text=...` (tweet 1 + repo URL appended)
5. **Discord** → manual paste (no submit URL); body 2,152 bytes from `docs/launch/discord.md`

### Tweet 1 (decoded — Peng confirmed copy on dry-run)

```
I shipped mcp-probe — one command to test any MCP server.

   npm i -g @incultnitollc/mcp-probe
   mcp-probe test "<server>"

Enumerates every tool, resource, prompt. Calls them. Validates schemas.
Prints a pass/fail scorecard. Exits 0/1 for CI.

https://github.com/incultnitollc/mcp-probe
```

### Findings deliberately preserved (intentional/historical, NOT bugs)

- `README.md:7` — disambiguation prose: *"the unscoped name `mcp-doctor` on npm is owned by an unrelated tool, so this project ships under a scope."* This is the explanation for WHY the package uses `@incultnitollc/mcp-probe` instead of bare `mcp-probe`. Removing it would orphan the question.
- `docs/launch/heads-up/server-everything.md:4` and `server-filesystem.md:4` — `**Filed by:** PengSpirit`. These docs are body copy of issues already filed Apr 19 at `modelcontextprotocol/servers#3984` (filesystem) and `#3985` (everything). The GitHub issues themselves still show `PengSpirit` as filer; updating local copies would falsify the record.
- `docs/superpowers/plans/2026-04-11-sse-http-transports.md` — frozen Apr 11 plan, written before the rename; references to `mcp-doctor` are accurate at writing time.
- `docs/notion/*` historical handoffs — same reasoning.
- `CHANGELOG.md:10` — 1.0.1 release note describes what 1.0.1 did at the time.

## DROP-READY LOCK takes effect after this closeout commit lands on `main`

This handoff doc is the lock-declaration artifact (matches yesterday's pattern of pairing a code/metadata commit with a Notion-handoff commit). After it lands: **no more commits to `main` between now and Wed 21:30 pre-flight.** If a launch-eve fire requires a fix, the lock is broken with a documented decision entry escalating the change.

## Launch sequence reminder (T-15h)

| Time (Taipei) | What | Who |
|---|---|---|
| Wed 21:30 | Pre-flight: monitoring tabs (HN profile, Reddit profile, Twitter, Discord), coffee, last `git status` check | Peng |
| Wed 21:45 | `./scripts/launch.sh` real run; submit HN, r/mcp, r/ClaudeAI, Twitter, paste Discord | Peng |
| Wed 22:00 → Thu 01:45 | 4h active monitoring; ≤30 min HN reply window; ≤1h Reddit | Peng |
| Thu 09:00 | LinkedIn post from `docs/launch/linkedin.md` | Peng |
| Thu 21:00 | r/LocalLLaMA — **only if** HN front page OR r/mcp >50 upvotes | Peng (conditional) |

## Hard rules during launch (already in launch.sh checklist printout — restated for the record)

- ❌ No emoji on HN. No exclamation marks. No "excited to announce".
- ❌ No @ Anthropic staff for boosts.
- ❌ No cross-posting to multiple Discord channels.
- ✅ Reply ≤30 min to every HN comment for 4 hrs post-submit.
- ✅ If a maintainer asks you to test their server — do it on the spot.

## Downstream impact

- **Probe launch Wed 2026-04-29 21:45 Taipei:** GO. All clickable surfaces verified clean. Tweet 1 fits Twitter limit. REPO_URL resolves. Reply windows tabled.
- **Incultnito Studio (PH 2026-05-16):** unaffected — separate product, separate schedule.
- **MCP Registry:** unaffected — sibling repo, separate launch.

## Links

- Rehearsal commit: <https://github.com/incultnitollc/mcp-probe/commit/940b38b>
- Sweep commit (Tue): <https://github.com/incultnitollc/mcp-probe/commit/994fd23>
- npm: <https://www.npmjs.com/package/@incultnitollc/mcp-probe>
- Repo: <https://github.com/incultnitollc/mcp-probe>
- Launch script source: <https://github.com/incultnitollc/mcp-probe/blob/main/scripts/launch.sh>
