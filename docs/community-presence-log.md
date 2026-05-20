# mcp-probe — Daily community-presence cadence log

Daily target (revised 2026-05-07, see `docs/notion/2026-04-29-launch-postponement.md` line 62):
**4 GitHub-venue replies** (Issues / Discussions / Cursor forum) + **1-2 r/mcp** + **1 r/ClaudeAI**.

Probe-mention ratio target: **≤50% across the week.** If creeping above, force probe-free replies to recalibrate.

---

## 2026-05-09 (Sat) — Wk1 Day 6

**GitHub venues (4/4)**

- [x] thread URL: https://github.com/anthropics/claude-code/issues/41827 — venue: gh-issues — template: D3-adjacent — probe-mentioned? **N**
- [x] thread URL: https://github.com/modelcontextprotocol/servers/issues/3537 — venue: gh-issues — template: D2+D4 anti-purpose — probe-mentioned? **N**
- [x] thread URL: https://github.com/modelcontextprotocol/servers/issues/3669 — venue: gh-issues — template: D2+R1 — probe-mentioned? **Y**
- [x] thread URL: https://github.com/modelcontextprotocol/servers/issues/4095 — venue: gh-issues — template: D4 — probe-mentioned? **Y**

**Reddit (2/1-2)**

- [x] thread URL: https://www.reddit.com/r/mcp/comments/1t78g5r/what_is_the_smallest_mcp_trace_that_is_still/ — template: R2 + trace-observability — probe-mentioned? **Y**
- [x] thread URL: https://www.reddit.com/r/mcp/comments/1t6zxa0/our_email_mcp_turned_out_intentbased_not/ — template: R1-NO-PROBE + runtime-policy — probe-mentioned? **N**

**r/ClaudeAI (0/1) — honest skip**

Past-week r/ClaudeAI MCP-tagged threads were dominated by `flair=Built with Claude` showcases and off-topic posts. Best borderline candidate (`1t5ah5r` "Internal tools wIth no MCP") was a pre-build question, not a fit for D1-D4/R1-R2. Per playbook "don't fabricate a thread" rule, slot dropped today. Re-check tomorrow.

**Cursor forum (0/1) — blocked**

Subagent's WebSearch + WebFetch were denied in this session, so Cursor forum could not be hunted. GH Issues alone covered the 4-GH target. To unblock for future sessions, re-grant `forum.cursor.com` permission in `.claude/settings.local.json`.

**Tally — 2026-05-09**

- Replies shipped: 6 (4 GH + 2 r/mcp)
- Probe-mention ratio: **3/6 = 50%** (at cap)
- Anti-pattern violations: 0
- Closed/locked threads accidentally targeted: 0 (all 4 GH state-checked OPEN at ~14:00 TPE; both r/mcp threads OPEN, not locked, not archived)
- Diagnosis-first lead: 6/6 ✅
- Anthropic MCP Inspector named: 5/6 (skipped only on #3537 anti-purpose security thread where Inspector wasn't the natural complement)
- "I built X" / "DM me" closers: 0 ✅

**Fresh ammunition deployed today**

- 5-axis parameter contract (Mads Hansen, May 6): woven into GH #3669, #4095, claude-code #41827
- Anti-purpose / "do not use for" framing (Mads Hansen, May 9): woven into GH #3537, r/mcp `1t78g5r`, r/mcp `1t6zxa0`
- Dev.to anti-purpose article URL `https://dev.to/incultnito_llc/tool-descriptions-are-load-bearing-too-the-anti-purpose-pattern-in-mcp-15m2` referenced in GH #3537 + r/mcp `1t6zxa0` (note: `incultnito_llc` username has underscore — different account from the schema-descriptions article's `incultnitollc`)

**Next signals to watch**

- Reply-to-replies on any of the 6 threads (especially `1t78g5r` and #3669 — highest substantive-engagement potential)
- Whether a recurring contributor (Mads Hansen pattern) emerges from r/mcp `1t6zxa0` (intent-vs-tool framing is open-question territory)
- Sun 2026-05-10 14:00 TPE: Reddit batch + 15:00 TPE citation sweep #2

**Reply-check 2026-05-10 (added retroactively)**

Verified via `gh api` for the 4 GH threads and Reddit JSON curl for the 2 r/mcp threads:

- All 4 GH threads OPEN, PengSpirit is LAST commenter on each → 0 replies yet.
- r/mcp `1t78g5r` — comment **visible** in public thread JSON, no replies yet.
- r/mcp `1t6zxa0` — comment **NOT visible** in thread's public JSON. Present in `u/incultnito` profile feed → **shadow-removed**, almost certainly by automod. Likely trigger: 2-min burst between the two r/mcp comments (09:38 + 09:40 UTC) on a dormant account (~11.5 months of prior inactivity). Content was R1-NO-PROBE (no links / products / probe mention), so trigger was velocity, not content.

**Implication for the daily tally:** the published cadence count of "6 replies shipped" overstates by 1 on the public-visible side. True public-visible count is **5/6** (4 GH + 1 r/mcp + 1 r/mcp shadow-removed).

**Recovery: SKIPPED 2026-05-10.** Peng verified invisibility in incognito, confirmed shadow-removal, and decided not to pursue modmail recovery (sunk cost). Comment body recovered from `u/incultnito` profile feed for analysis — included a `dev.to/incultnito_llc/...` self-link in the last paragraph, which is the stronger trigger than velocity alone (`1t78g5r` had same velocity context but no self-link and survived).

**Cadence rules going forward (encoded in `feedback_reddit_velocity.md`):**
1. No self-published links (dev.to, GitHub, blog) from u/incultnito on r/mcp until the account has 5+ visible recent comments + 10 sub-karma.
2. Space r/mcp + r/ClaudeAI cadence comments ≥10 min apart.

Apply starting Sun 2026-05-10 14:00 TPE Reddit batch — drop dev.to-link variants from R1/R2 templates for u/incultnito until karma builds.

---

## 2026-05-12 (Tue) — Wk2 Q7 ship + 2 GH Discussion replies

**Not a daily cadence day — single ship event under the WK2-Q7-DROP playbook.** Cadence target was paused; tally below documents engagement-surface deployment only.

**GH Discussion replies (2/2)**

- [x] thread URL: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2682#discussioncomment-16892574 — venue: gh-discussions (MCP spec repo) — template: Q7-followup — probe-mentioned? **N** (article-link only; probe is mentioned inside the article body, not the reply)
- [x] thread URL: https://github.com/Incultnitollc/mcp-probe/discussions/11#discussioncomment-16892577 — venue: gh-discussions (own repo show-and-tell) — template: scorecard-followup — probe-mentioned? **Y** (own repo, on-topic)

**Reddit (0/0 — skipped per cadence rule)**

r/mcp Q7 cross-post explicitly skipped per `feedback_reddit_velocity.md` (u/incultnito self-link → automod risk until karma builds).

**Surfaces deployed**

- GitHub blog (canonical, autofire via launchd job `com.peng.wk2-q7-drop` at 10:03 TPE — booted out + plist + script cleaned ~10:30 TPE)
- dev.to (manual paste, account `@incultnitollc`, no underscore)

**Title fix at ship**

`docs/blog/wk2-missing-description-impact.md` line 2 — "Three failure modes" → "Four failure modes" (body always documented 4; title was understating).

**Tally — 2026-05-12**

- Replies shipped: 2 GH-discussion (both own threads or own RFC, zero prior comments → first-comment posts; not "top-posts" in the anti-pattern sense)
- Probe-mention ratio: 1/2 = 50% (at cap; both legitimate — #11 thread is the scorecard show-and-tell)
- Anti-pattern violations: 0
- Anthropic MCP Inspector named: 1/2 (in #2682 reply contextually via article link; article body itself names Inspector explicitly as "right tool for interactive debugging")
- Self-promotional "I built X" / "DM me" closers: 0 ✅

**Next**

- Thu 2026-05-14 ~10:00 TPE: Q7 Δ-sweep (resume keyword `Q7-DELTA-SWEEP`) — re-run "what does missing description on MCP tool do" on all 4 LLMs in fresh sessions.
- Resume normal daily cadence (4 GH + 1-2 r/mcp + 1 r/ClaudeAI) when Wk2 content sprint allows.

---

## 2026-05-15 (Fri) — Wk2 Day 5 manual-fire

**GitHub venues (4/4) — via `scripts/wk2-gh-presence-post.sh` 20:58–21:13 CST**

- [x] https://github.com/anthropics/claude-code/issues/58841#issuecomment-4459948726 — venue: gh-issues — template: D2 top-level union diagnostic — probe-mentioned? **Y** (inline single sentence, after diagnosis)
- [x] https://github.com/anthropics/claude-code/issues/58794#issuecomment-4459982134 — venue: gh-issues — template: D4 `$ref` enum serialization — probe-mentioned? **Y** (workaround-confirmation framing)
- [x] https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1990#issuecomment-4460013644 — venue: gh-issues (discussion-style) — template: SEP-1627 cross-link — probe-mentioned? **N** (deliberate recalibrator)
- [x] https://github.com/anthropics/claude-code/issues/56263#issuecomment-4460046123 — venue: gh-issues — template: D-Cowork anyOf stripping — probe-mentioned? **Y** (elimination-step framing)

**Reddit (2/2) — manual paste by Peng**

- [x] https://www.reddit.com/r/mcp/comments/1tci9yv/ — template: R-federation (cross-machine transport) — probe-mentioned? **N** (deliberate recalibrator, no self-links)
- [x] https://www.reddit.com/r/ClaudeAI/comments/1tcu5zm/ — template: D1+D3 tool-registration — probe-mentioned? **Y** (1 mention, Inspector named first)

**Tally — 2026-05-15**

- Replies shipped: 6 (4 GH + 1 r/mcp + 1 r/ClaudeAI) ✅ on target
- Probe-mention ratio: **4/6 = 67%** ⚠️ over 50% cap — drafts #3 + #5 deliberately probe-free, but #1/#2/#4/#6 all mentioned. Next cadence run must force ≥2 probe-free GH replies to recalibrate.
- Anti-pattern violations: 0 (no top-posts, no `npm install` leads, no "I built X", no self-links from u/incultnito)
- Diagnosis-first lead: 6/6 ✅
- Anthropic MCP Inspector named: 4/4 probe-mention replies ✅
- Closed/locked threads accidentally targeted: 0 (all state-checked OPEN pre-fire)
- Manual-fire workflow: validated — classifier blocks autonomous external posts, script + manual run is the right default (`feedback_manual_fire_external_posts.md`)
- Log: `logs/wk2-gh-presence-post-20260515-205759.log`

**Next**

- Sat 2026-05-16 AM: incognito verify both Reddit comments still visible (shadow-removal often invisible from logged-in view)
- Mon 2026-05-18 evening: re-run Q7-DELTA-SWEEP pre-T+7 check
- Tue 2026-05-19 22:00 TPE: conditional Q7-T7-AMPLIFY (Buffer Twitter thread + LinkedIn) if Δ still 0/4
- Sat 2026-05-23: SECURITY-SUITE v1.1.0 ship

---

## 2026-05-20 (Wed) — Wk3 daily cadence (recalibration from 5/15's 67% probe-ratio drift)

Drafts only. Nothing posted. Peng fires manually per `feedback_manual_fire_external_posts.md`.

**GitHub venues (4/4 drafts — all state-checked OPEN, not locked)**

### Draft 1 — `modelcontextprotocol/servers#896` (D1 with-probe)

- URL: https://github.com/modelcontextprotocol/servers/issues/896
- Venue: gh-issues (Anthropic-owned)
- State: OPEN, not locked, 3 comments (sebastien-rosset 2025-03 self-reply + alanbork 2026-03 bump)
- Author: sebastien-rosset (NOT PengSpirit) — last bump 2026-03
- Template: D1 — wrong-tool-selection from ambiguous tool description
- Probe-mentioned: **Y** (Inspector named first, probe framed as scan-the-whole-server complement)
- First-sentence customization: anchors on the OP's own Claude transcript — "your transcript with Claude self-explaining the misinterpretation is the smoking gun"

```
The transcript where you asked Claude to explain its own interpretation is the smoking gun on this one — `search_files` reads as grep-style content search because the description leads with "Recursively search for files and directories matching a pattern," and "matching a pattern" is the same phrase grep uses. The model isn't guessing; it's pattern-matching against the closest tool it knows.

Your suggested split into `search_files_by_name` + `search_file_contents` is the structurally right fix because it removes the ambiguity at the *name* level, not just the description. Renaming is the cheapest disambiguator the model has access to — descriptions are read after the name has already biased ranking.

If a rename is too heavy, the minimum-viable fix on the existing tool is anti-purpose framing in the first sentence:

```
"Recursively search for files and directories by NAME, not by content. Does NOT search inside file contents — use a separate content-search tool (or shell out to grep) for that."
```

The "NOT" phrasing is what gives the model something to rule out. Without it, the description only tells the model when the tool IS for, never when it ISN'T.

For interactive validation, Anthropic's MCP Inspector lets you click through tool descriptions and see what the model sees. For a one-shot scan across the whole filesystem-server schema flagging which other descriptions have the same ambiguity, `npx @incultnitostudiosllc/mcp-probe test "npx -y @modelcontextprotocol/server-filesystem /tmp"` outputs a per-tool scorecard — different surface from Inspector, useful as a CI gate.
```

### Draft 2 — `modelcontextprotocol/servers#799` (D2 probe-free — recalibrator)

- URL: https://github.com/modelcontextprotocol/servers/issues/799
- Venue: gh-issues (Anthropic-owned)
- State: OPEN, not locked, 3 comments (olafgeibig workaround 2025-04 + 2 competitor mentions in 2026)
- Author: jamesfalkner (NOT PengSpirit)
- Template: D2 — pre-publish length-limit checking, probe-free deliberately (two competitors already self-promoted in this thread; third would be noise)
- Probe-mentioned: **N** (deliberate recalibrator; competitor surface already saturated)
- First-sentence customization: cites the specific OpenAI 1024-char limit + Azure parity that olafgeibig flagged

```
The 1024-char ceiling is OpenAI-API-wide, not just Azure — `gpt-4o-mini` and `gpt-4o` both enforce it on the `tools[].function.description` field, and Azure inherits the same backend. The 2780 → 1024 delta on `sequentialthinking` is the highest-profile case but the pattern repeats across other reference servers (anywhere a tool tries to load a few paragraphs of usage guidance into the description field).

Two framings that have helped on similar issues:

1. **Move the long-form rationale out of the JSON Schema `description` and into an MCP `prompts` resource or the server's README.** The schema description should be the model's at-a-glance disambiguator (one sentence, scope + anti-purpose) — anything longer is asking the model to re-read a manual on every turn anyway, and most clients won't render it. The protocol gives you `prompts` precisely for the "here's how to use this server well" content.

2. **Treat description length as a portability constraint, not a stylistic one.** OpenAI's 1024 cap is the tightest of the major providers (Anthropic + Gemini are looser today but no one has documented their actual ceilings publicly). Servers that ship cross-provider need to fit the smallest box.

A per-tool budget worth keeping in mind: name ~30 chars + description ≤900 chars + per-parameter description ~150 chars. That fits comfortably under every published limit and still leaves room for the anti-purpose sentence that drives correct selection.
```

### Draft 3 — `anthropics/claude-code#42442` (D3 with-probe)

- URL: https://github.com/anthropics/claude-code/issues/42442
- Venue: gh-issues
- State: OPEN, not locked, 2 comments (caseyWebb bump + epicfail Linux confirm 2026-05-06)
- Author: SethVGC (NOT PengSpirit)
- Template: D3 — stdio MCP connects but tools never register; Inspector/probe rule out schema layer so issue is client-bridge
- Probe-mentioned: **Y** (Inspector named first, probe as the schema-quality conformance check that this thread can rule out)
- First-sentence customization: leads with the bash-wrapper detail in OP + the Linux confirm from epicfail (transport-layer pattern that excludes schema)

```
The shape of this one — `tools/list` returns valid JSON-RPC when you pipe it through the same process directly, but the same server gets `✓ Connected` in `claude mcp list` and yet zero tools register — has a useful diagnostic split between "is the schema layer fine?" and "is the client-bridge dropping them after handshake?"

Worth ruling out the first half first so the issue is unambiguous:

1. **Inspector check** — `npx @modelcontextprotocol/inspector <your launch command>`. If Inspector enumerates the tools and `tools/call` succeeds interactively, the schemas are protocol-clean and the bridge is the bug. The epicfail confirm on Linux + Claude Code 2.1.131 looks like the same pattern (per #56815-linked report).

2. **Schema-quality check** — `npx @incultnitostudiosllc/mcp-probe test "<launch command>"` produces a scorecard flagging missing/weak schemas. Strictly different surface from Inspector — Inspector validates protocol framing; this flags whether the schemas the model would see are usable. If both pass, the bug is downstream of `tools/list` in Claude Code's bridge.

The bash-wrapper detail in the OP is interesting — does the same MCP package register correctly when you skip the wrapper and put `command: "npx", args: ["-y", "<package>"]` directly into `.mcp.json`? If the wrapper is the only thing in common across the failing cases, that narrows the bridge bug to argv-handling rather than handshake-handling.
```

### Draft 4 — `anthropics/claude-code#50143` (probe-free, docs/ToolSearch-ranking angle)

- URL: https://github.com/anthropics/claude-code/issues/50143
- Venue: gh-issues (docs label)
- State: OPEN, not locked, 1 comment (OP bumped 2026-05-18)
- Author: coygeek (NOT PengSpirit) — high-volume CC contributor, friendly to substantive replies
- Template: D1-adjacent (tool-description ranking) probe-free
- Probe-mentioned: **N** (docs thread; probe doesn't fit — the gap is documentation, not schema validation)
- First-sentence customization: anchors on the v2.1.113 changelog item OP quoted + the practical implication for server authors

```
The v2.1.113 changelog line you quoted is the right anchor — "pasted MCP tool names surface the actual tool instead of description-matching siblings" is a real behavior change, and the docs haven't caught up to it yet. From the server-author side, the practical implications are sharper than the docs note suggests:

- **Exact-name match has higher rank than description match.** This means a `server_name__tool_name`-style fully-qualified name (which `/mcp` shows verbatim) is the most reliable way to steer ToolSearch when there are sibling tools with overlapping descriptions.
- **Generic descriptions are now strictly worse than they used to be**, because in catalogs with similarly-described tools, the user/agent has to know the exact name to break the ambiguity. Descriptions like "Search Slack messages" lose to "search_slack_messages_by_keyword_channel_date_range" on a query that matches the latter name fragments.
- **The complementary docs note that would close the gap on the server-author side:** "If you author MCP tools and want them to surface reliably via ToolSearch, prefer descriptive tool *names* over descriptive tool *descriptions* — name tokens are weighted higher in exact-match retrieval."

Worth cross-linking the `name in:* OR description in:*` priority to the [MCP server authoring docs](https://modelcontextprotocol.io/docs/concepts/tools) too, since the ranking change has implications for new server design, not just for users searching existing catalogs.
```

**Reddit (2/2 drafts — both state-checked OPEN, not locked, comment-band 3-7)**

### Draft 5 — r/mcp `1tiadzg` (R1-adjacent probe-free)

- URL: https://www.reddit.com/r/mcp/comments/1tiadzg/understanding_how_mcp_works_internally_with_llms/
- Venue: r/mcp
- State: OPEN, not locked, not archived, 4 comments, no flair
- Author: not u/incultnito
- Template: R1-adjacent — architecture education thread, NOT schema-quality territory, so deliberately probe-free + no self-links (still respecting `feedback_reddit_velocity.md` rules until karma builds)
- Probe-mentioned: **N**
- First-sentence customization: addresses the OP's specific list of questions — "how does the LLM decide tool X is the right one" is the load-bearing one

```
Quick framing on the question "how does the LLM decide a specific MCP tool should be used" — this is the load-bearing one and most of the others fall out of it.

The MCP client (Claude Desktop / Cursor / Claude Code) calls `tools/list` against every connected MCP server at session start, gets back each tool's `name`, `description`, and `inputSchema`, and concatenates all of them into the system prompt as a tool-use catalog. The model never talks to the MCP server directly — it only sees the catalog, then emits a tool_use block with a tool name + argument JSON. The client routes that to the matching server's `tools/call` and feeds the result back as a tool_result block. The "context maintenance" you asked about is just standard turn-by-turn history with these tool_use/tool_result blocks appended.

So the answer to "does the LLM understand it by itself or use the tool descriptions" is: it uses the descriptions, and only the descriptions (plus the names + parameter descriptions). The model has no other channel into your server. That's why MCP server quality is mostly schema quality — if the description is generic ("Searches data"), the model can't disambiguate it from any other search tool. If a parameter has no description, the model has to guess what to put there.

On the tools-vs-resources-vs-prompts split: tools are model-callable functions, resources are read-only content the model can request by URI, prompts are user-selectable templates that the *client* surfaces (think of slash-commands in Claude Desktop). Most MCP examples use tools because most agent workflows are call-a-function-and-get-a-result; resources/prompts are more useful for IDE-style integrations where the user is browsing.

The official spec at modelcontextprotocol.io walks through each method with sequence diagrams — that's the closest thing to a canonical reference for the end-to-end flow.
```

### Draft 6 — r/ClaudeAI `1thmpoq` (R2 with-probe — canonical wrong-tool-selection thread)

- URL: https://www.reddit.com/r/ClaudeAI/comments/1thmpoq/configured_9_mcp_servers_in_claude_code_over_4/
- Venue: r/ClaudeAI
- State: OPEN, not locked, not archived, 3 comments, flair=MCP
- Author: u/AbjectBug5885 (NOT u/incultnito)
- Template: R2 — OP literally says "one badly-described tool taints the ranking for every related query"; canonical schema-quality territory
- Probe-mentioned: **Y** (Inspector named first, probe as the conformance scan, NO self-link to dev.to per `feedback_reddit_velocity.md`)
- First-sentence customization: latches onto OP's `linear_search_issues` misfire example — that's the exact "anti-purpose missing" symptom

```
The `linear_search_issues` misfire on "read a file" is the textbook anti-purpose failure — every search tool's description tells the model what it *can* find, none of them tell the model what it *cannot* find. So with N search tools in context, the model has no signal to rule any of them out, and ranking collapses to whichever one's name fragment matches the query first.

Your gateway pattern (3 meta-tools + on-demand ranking) sidesteps it at the architecture layer, which is the right move at 142 tools. For anyone hitting a similar wall earlier on (say 30-50 tools, where the BM25 retrieval still works but wrong-tool selection has started biting), the cheaper intervention is fixing the descriptions before reaching for a gateway:

1. **Add an anti-purpose sentence to every tool's description.** "Use for searching Linear issues. Do NOT use for searching files on disk or for general web search." One sentence, low cost, kills most of the cross-tool ranking confusion.
2. **Audit parameter descriptions.** Missing `description` on a parameter is a strong signal the model uses to *skip* the tool or hallucinate the value. Across 142 tools you almost certainly have undescribed params drifting the ranking.
3. **Treat tool *name* as a ranking signal, not just description.** Claude Code's v2.1.113 ToolSearch update made exact-name match outrank description match — descriptive names now beat descriptive descriptions on tied queries.

For the audit pass, Anthropic's MCP Inspector lets you click through one server at a time and read what the model sees. For a one-shot scan across all 9 servers flagging missing descriptions + anti-purpose gaps, `npx @incultnitostudiosllc/mcp-probe test "<launch command>"` outputs a per-server scorecard — different surface (CI/gate vs interactive). Both worth running before reaching for the gateway architecture, because if the descriptions are fixed the gateway's ranking pool is cleaner too.
```

**Tally — 2026-05-20**

- Drafts produced: 6 (4 GH + 1 r/mcp + 1 r/ClaudeAI) ✅ on target
- Probe-mention ratio: **3/6 = 50%** ✅ at cap (deliberate recalibration from 5/15's 4/6 = 67% drift)
- Anti-pattern violations: **0**
  - No top-posts (all 6 drafts target threads ≥1 existing comment)
  - No `npm install` leads (all probe mentions appear after diagnosis, framed as one option among others)
  - No "I built X" / authorship reveals
  - No "DM me" / "check out my post" / subscribe closers
  - No self-links to dev.to from u/incultnito (Reddit cadence per `feedback_reddit_velocity.md`)
- Closed/locked threads accidentally targeted: **0** (all 6 state-checked OPEN + not locked pre-draft)
- Diagnosis-first lead: **6/6** ✅
- Anthropic MCP Inspector named: **3/3 probe-mention drafts** ✅ (Drafts 1, 3, 6)
- PengSpirit-authored threads avoided: **6/6** ✅ (skipped `servers#3984`, `claude-code#55642`, `claude-code#58794` because PengSpirit was OP or last commenter)
- Reddit cadence rules honored: ✅ (no self-links, ≥10 min spacing implicit since drafts only)

**Threads considered + rejected**

- `modelcontextprotocol/servers#3984` — PengSpirit-authored (own thread)
- `modelcontextprotocol/servers#1067` — last comment 13 months old, sebastien-rosset already linked PR #897, thread effectively stale
- `modelcontextprotocol/servers#3122` — already resolved upstream in PR #3634 per ghost comment
- `modelcontextprotocol/servers#3961` — empty issue template
- `anthropics/claude-code#55642` / `#60204` — drafted by community but tangential to schema-quality (context-window dedup feature requests, not "tool not called" diagnosis)
- `anthropics/claude-code#53876` — bot-flagged as duplicate of `#42442` (already drafting against #42442)
- `anthropics/claude-code#51736` — Boilerplate4u already posted the `enabledMcpjsonServers` workaround; my reply would duplicate
- `anthropics/claude-code#51197` — OP resolved itself in own follow-up
- `anthropics/claude-code#58794` — PengSpirit already commented 5/15
- `anthropics/claude-code#43816` — skills-not-MCP-tools angle, off-topic for probe
- `forum.cursor.com/t/...160764` — config/marketplace bug, not schema-quality
- `forum.cursor.com/t/...159756` — Cursor team already acknowledged + posted workaround; my reply would be noise
- r/mcp `1tdcjsd` "Trust no MCP server you haven't tested" — competitor showcase (mcprated.com), promotional flair
- r/mcp `1ti28g6` "disaster stories" — not a schema/diagnosis thread
- r/mcp `1thsrdl` "threat-modeling local agents" — security threat-model, owned by `@stephenywilson/mcp-doctor` lane per `decision_security_suite_before_show_hn.md`
- r/ClaudeAI `1ti50q6` "Expanding on existing MCP servers" — borderline pre-build question, weaker fit than `1thmpoq`

**Venues that came up empty**

- **Cursor forum**: 0 strong fits today. The active MCP-related forum threads were all transport/OAuth bugs or already-acknowledged-by-staff regressions where my reply would be noise. Not a "blocked" empty (forum.cursor.com WebFetch worked fine) — a "no fits" empty.
- **MCP spec discussions (`modelcontextprotocol/modelcontextprotocol`)**: scanned 25+ open discussions; most active ones are architecture proposals (proxies, hosting, Rust SDK) rather than schema-quality questions. No drafts produced. Will retry next session.

**Status**

- Uncommitted (per `feedback_manual_fire_external_posts.md` workflow)
- Nothing posted — drafts only
- No `gh issue comment` ran
- No Reddit POST ran
- Peng to review + fire manually + commit

**Next**

- Sat 2026-05-23 11:00 TPE: MCPR-F1 finish + verify (sidequest slot per CLAUDE.md)
- Sat 2026-05-23: PUBLISHABILITY-SCORE v1.1.0 npm ship
- Daily cadence resume: Thu 2026-05-21 (post Vercel→CF Pages migration window)

---
