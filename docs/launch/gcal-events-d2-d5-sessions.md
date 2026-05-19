# GCal events — D2 (Wed 5/20) + D5 (Sat 5/23) sessions

**Created:** 2026-05-19 TPE
**Resume keywords (code):** `PUBLISHABILITY-SCORE` (Plan A) · `MCP-PROBE-ACTION` (Plan B)
**Plan files:**
- `docs/superpowers/plans/2026-05-18-publishability-score-v1.1.0.md`
- `docs/superpowers/plans/2026-05-18-mcp-probe-action-v1.md`

## Paste-ready Claude Desktop prompt (single shot, creates both events)

Open Claude Desktop, ensure the GCal connector is enabled, paste verbatim:

```
Create two Google Calendar events on my primary calendar in Asia/Taipei.

EVENT 1
- Title: Probe: D2 dual-track build — Plan A 4 TDD + Plan B Marketplace publish
- Date: Wed 2026-05-20
- Time: 22:00 – 01:00 Asia/Taipei (3 hours, ends Thu 2026-05-21 01:00)
- Visibility: Private
- Notification: 15 min before
- Description: [paste the EVENT 1 DESCRIPTION block below verbatim]

EVENT 2
- Title: Probe: D5 ship — npm publish v1.1.0 + GitHub Release
- Date: Sat 2026-05-23
- Time: 14:00 – 15:30 Asia/Taipei (1.5 hours)
- Visibility: Private
- Notification: 30 min before
- Description: [paste the EVENT 2 DESCRIPTION block below verbatim]

Use my primary calendar. Confirm both event IDs back to me after creation.
```

---

## EVENT 1 DESCRIPTION (paste into the Notes field for Wed 5/20)

```
Resume keywords: PUBLISHABILITY-SCORE (Plan A) + MCP-PROBE-ACTION (Plan B)
Plan files:
  - docs/superpowers/plans/2026-05-18-publishability-score-v1.1.0.md
  - docs/superpowers/plans/2026-05-18-mcp-probe-action-v1.md
Repo: /Users/pengspirit/incultnito/Dev/Backend/repos/Month 1 and 2 - MCP Inspect
Branch: main (D1 already merged on 5/19, HEAD = 16398c1 or later)

GOAL — Land Plan A D2 (4 TDD tasks → runner + scorer) AND Plan B D2 (Marketplace publish) in one 3-hour block.

PRE-FLIGHT (5 min):
- [ ] cd repo + git pull origin main
- [ ] npx tsc --noEmit && npx vitest run (expect 92/92 baseline from D1)
- [ ] git log --oneline -5 (should see 16398c1 docs(launch) at top)

PLAN A D2 — publishability-score v1.1.0 (2.5 hours, TDD discipline)
- [ ] 2.1 src/publishability-distribution-metadata.{ts,test.ts} — 5 TDD tests using temp package.json (description ≥80 chars, ≥5 keywords, repository/license/homepage fields)
- [ ] 2.2 src/publishability-anti-purpose-clause.{ts,test.ts} — 4 TDD tests, low severity (warning only — informational axis)
- [ ] 2.3 src/publishability-runner.ts — orchestrates 5 checks → Promise<PublishabilityResult[]>
- [ ] 2.4 src/publishability-scorer.ts — composite math, axis caps, severity bands, A–F grades (computeScore(InspectResult): PublishabilityScore)
- [ ] Verify after each task: npx tsc --noEmit && npx vitest run (target green; ~96/96 by end of 2.1, ~100/100 by end of 2.2)
- [ ] Per-task commits (4 commits)
- [ ] git push origin main at end of Plan A block

DECISION CARRIED FROM D1 (surface to D2 author before scorer math):
- D1 Task 1.2 scoreTool deviation — agent used Math.max(toolDescScore, propAvg) instead of plan's literal averaging. D2 scorer author (Task 2.4) should re-evaluate this before composite math is built. See: src/publishability-checks.ts and commit 1412685.
- D2 layout: continue flat src/publishability-*.ts (matches src/spec-checker.ts repo convention). Do NOT migrate to src/checks/.

PLAN B D2 — mcp-probe-action v1 Marketplace publish (30 min)
- [ ] 2.1 git tag v1.0.0-action (immutable) + git tag -f v1 (floating major) + git push origin --tags
- [ ] 2.2 GitHub Release v1.0.0-action via gh release create OR web UI. Body = Quick start / Inputs / Outputs sections from README.md ## GitHub Action. PUBLISH TO GITHUB MARKETPLACE — icon-only branding, category: Continuous integration (CHECKBOX in web UI; gh CLI cannot toggle this)
- [ ] 2.3 Update memory project_launch.md with "## mcp-probe-action SHIPPED — 2026-05-20" block, mark Plan B done, close MCP-PROBE-ACTION resume keyword

POST-SESSION (5 min):
- [ ] git log --oneline -15 (should show ~5 new commits: 4 Plan A + 1 memory)
- [ ] Update MEMORY.md if any resume keyword needs touching
- [ ] If Plan B Marketplace listing live: paste Marketplace URL into citation-log.md as a new asset surface

IF YOU RUN OUT OF TIME (3 hr cap):
  - Plan A 2.4 scorer can spill into Thu 5/21 evening
  - Plan B 2.2 Marketplace publish — push to Thu 5/21 latest (Thu 22:00 is CF Pages migration, so Plan B before 22:00 Thu)

CONSTRAINTS:
- No new dependencies — package.json deps frozen for v1.1.0 ship
- TDD discipline: red → green → commit, no skipping
- D1 calibration target carries into D3 (Thu 5/21): scorer must match spec §4.6 ±5pts across 5 scorecards (filesystem/everything/github/memory/sequential-thinking)
```

---

## EVENT 2 DESCRIPTION (paste into the Notes field for Sat 5/23)

```
Resume keyword: PUBLISHABILITY-SCORE (final ship)
Plan file: docs/superpowers/plans/2026-05-18-publishability-score-v1.1.0.md § Day 5
Repo: /Users/pengspirit/incultnito/Dev/Backend/repos/Month 1 and 2 - MCP Inspect
Branch: main (D4 should be merged by Fri 5/22 evening)

GOAL — npm publish @incultnitollc/mcp-probe@1.1.0 + GitHub Release + close PUBLISHABILITY-SCORE resume keyword.

NOTE: 11:00 TPE slot today is MCP Registry F.1 finish (~30 min, separate project). This event starts 14:00 TPE — well after.

PRE-FLIGHT (10 min):
- [ ] cd repo + git pull origin main
- [ ] git log --oneline -10 (should see D4 commits: 5 scorecards + canary workflow + README v1.1.0 + CHANGELOG entry)
- [ ] npx tsc --noEmit && npx vitest run (expect full v1.1.0 suite green, ~110+ tests)
- [ ] npm pack --dry-run | tail -30 (verify tarball contents — no test-fixtures, no docs/superpowers, no .claude)
- [ ] npm run build (clean dist/ regenerate)
- [ ] node dist/cli.js score --help (smoke test the new score subcommand)
- [ ] node dist/cli.js test "npx -y @modelcontextprotocol/server-everything" --publishability (full smoke run; verify scorecard renders)

PUBLISH SEQUENCE — Task 5.2 (CRITICAL — NATIVE TERMINAL ONLY):
⚠ DO NOT RUN npm publish FROM CLAUDE'S Bash TOOL ⚠
Per memory feedback_npm_webauthn_publish.md:
  - account uses webauthn security key (no TOTP)
  - --otp= flag does NOT work for security keys
  - Claude `!` redacts the auth URL to *** because npm detects non-TTY
  - Must run from native Terminal.app to surface webauthn prompt

Steps (paste into NATIVE Terminal, not Claude):

  cd "/Users/pengspirit/incultnito/Dev/Backend/repos/Month 1 and 2 - MCP Inspect"
  npm whoami                           # confirm logged in as incultnitostudiosllc
  npm version minor                    # bumps 1.0.2 → 1.1.0, creates tag v1.1.0
  npm publish --access public          # webauthn tap on security key
  git push origin main --follow-tags   # push commit + tag

POST-PUBLISH VERIFICATION (back in Claude session):
- [ ] npm view @incultnitollc/mcp-probe version   (expect 1.1.0)
- [ ] npm view @incultnitollc/mcp-probe description   (expect new v1.1.0 description if updated)
- [ ] open https://www.npmjs.com/package/@incultnitollc/mcp-probe   (verify public page)
- [ ] gh release create v1.1.0 --title "v1.1.0 — publishability score (5-axis)" --notes "$(cat CHANGELOG.md | sed -n '/## \[1.1.0\]/,/## \[1.0.2\]/p' | head -n -1)"
- [ ] (optional) post-publish smoke: npx -y @incultnitollc/mcp-probe@1.1.0 --version

MEMORY + CLOSURE — Task 5.3 (~15 min):
- [ ] Update memory project_launch.md: add "## PUBLISHABILITY-SCORE v1.1.0 SHIPPED — 2026-05-23" block above the ON RESUME section, mark Plan A done, retire the resume keyword (redirect PUBLISHABILITY-SCORE/SECURITY-SUITE to "shipped" disposition)
- [ ] Update MEMORY.md Launch entry: bump to v1.1.0 shipped state
- [ ] Append to docs/citation-log.md: note v1.1.0 ship date + new lane positioning (server authors pre-publish, not server installers pre-install — see decision_security_suite_before_show_hn.md)
- [ ] Re-run Q7 sweep next Sun (5/24) — first measurement post-amplify-fire + post-v1.1.0-ship, both signals stacked

IF PUBLISH FAILS (webauthn / network / 2FA):
  - Do NOT retry blindly. Check ~/.npm/_logs/ for the actual error.
  - Common: npm whoami returns 401 → re-run npm login from native Terminal first.
  - If publish succeeds but git push fails: that's recoverable; npm tarball is the durable artifact.
  - Worst case: roll forward to 1.1.1 with whatever fix; do NOT unpublish 1.1.0.

DOWNSTREAM IMPACT (do not start today, just note):
- mcp-probe-action examples/publishability-gate.yml becomes live-usable once 1.1.0 ships
- Open follow-on PR to punkpeye/awesome-mcp-devtools Actions section (Plan B Task 4.1, optional)

TRIGGER METRIC CHECK (Mon 5/25 snapshot — separate event):
- Did v1.1.0 ship move any of the 5 gate metrics? Track over next 2-week window before considering Show HN re-arm.
```

---

## Quick conflict-check against existing calendar

| Slot | Existing booking | Conflict? |
|---|---|---|
| Wed 5/20 22:00–01:00 TPE | None known | None |
| Sat 5/23 11:00 TPE (~30 min) | MCPR F.1 finish + verify (per global CLAUDE.md) | Adjacent, no overlap — Event 2 starts 14:00 |
| Sat 5/23 14:00–15:30 TPE | None known | None |

## Manual fallback (if Claude Desktop GCal connector unavailable)

Use calendar.google.com web UI. Both event blocks above are pre-formatted for paste directly into the description field. Times are explicit `Asia/Taipei` — no offset math.

## Why these slots

**Wed 5/20 22:00–01:00 TPE (3 hours):**
- Plan A D2 is 4 TDD tasks + scorer math (~2.5 hours intensive)
- Plan B D2 is tag + Marketplace publish (~30 min)
- Teacher hours end 22:00 — block starts at the boundary
- Single block avoids context switching cost
- Ends before midnight Thu (avoids spillover into Thu 5/21 22:00 CF Pages migration)

**Sat 5/23 14:00–15:30 TPE (1.5 hours):**
- 11:00 TPE slot already locked for MCP Registry F.1
- After F.1 + lunch buffer = 14:00 start
- npm publish itself is ~5 min; webauthn ceremony + verify + Release + memory ~1.5 hr total
- Saturday afternoon = quieter window if publish fails and needs debug
