# Wk2-Q7-DROP — manual steps (after launchd fires)

**Automation status:** macOS launchd job `com.peng.wk2-q7-drop` armed Mon 2026-05-11 22:42 TPE. Fires Tue 2026-05-12 09:55 TPE. Runs `~/bin/wk2-q7-drop-ship.sh` (idempotent — re-runs are safe). Plist at `~/Library/LaunchAgents/com.peng.wk2-q7-drop.plist`. Survives Claude session clear AND laptop reboot.

**What the script does (git-only):**
1. Flips `published: false → true` on `docs/blog/wk2-missing-description-impact.md`
2. `git commit -m "blog: ship Wk2 Q7 article — missing-description impact (4 failure modes)"`
3. `git push origin main`
4. Logs to `/tmp/wk2-q7-drop-ship.log`

**What it does NOT do** (your manual steps below): dev.to cross-post, GitHub Discussion replies, r/mcp posting (the last is banned per `feedback_reddit_velocity.md`).

**Verify fire next morning (Tue ~10:00 TPE):**
```bash
cat /tmp/wk2-q7-drop-ship.log
cd "/Users/pengspirit/incultnito/Dev/Backend/repos/Month 1 and 2 - MCP Inspect"
git log -1 --oneline   # should show "blog: ship Wk2 Q7 article..."
```

**After ship is verified, unload the launchd job** so it doesn't re-fire on May 12, 2027:
```bash
launchctl bootout gui/$(id -u) /Users/pengspirit/Library/LaunchAgents/com.peng.wk2-q7-drop.plist
rm /Users/pengspirit/Library/LaunchAgents/com.peng.wk2-q7-drop.plist
rm /Users/pengspirit/bin/wk2-q7-drop-ship.sh   # optional cleanup
```

---

## Step A — dev.to cross-post (target: Tue ~10:00–10:15 TPE)

**Account:** `@incultnitollc` — **no underscore** (the schema-descriptions article account). NOT `@incultnito_llc` (that's the anti-purpose article's account; different login).

**Verify first:**
```bash
curl -s "https://dev.to/api/users/by_username?url=incultnitollc" | python3 -m json.tool
```

**Manual paste workflow** — do NOT auto-POST. Per `feedback_devto_rate_limit.md`, new accounts get 403'd after ~3 rapid POSTs.

**Source:** `docs/blog/wk2-missing-description-impact.md` (open in editor, copy body below frontmatter)

**dev.to article settings:**
- Title: copy from frontmatter `title:` field
- Cover image: upload `docs/assets/og-card.png`
- Canonical URL: set to the GitHub file URL (matches the existing schema-descriptions article pattern):
  `https://github.com/Incultnitollc/mcp-probe/blob/main/docs/blog/wk2-missing-description-impact.md`
- Tags: `mcp`, `ai`, `llm`, `tooling` (4 max on dev.to)
- Publish immediately (not draft)

---

## Step B — GitHub Discussion replies (target: Tue ~10:15–10:35 TPE)

### B1. github.com/modelcontextprotocol/modelcontextprotocol/discussions/2682
- This is the existing RFC thread "MCP Server Conformance Checklist"
- **Reply only.** Do NOT top-post. Do NOT lead with `npm install`. Do NOT say "I built X."
- Frame the reply as: "Wrote up failure-mode analysis for Q7 of the checklist (missing-description impact) — three+ distinct failure modes traced from real servers, complements the conformance-checklist framing here. Link: [dev.to URL]."
- Keep it 2–3 sentences. The thread owners are spec authors / core maintainers — high signal, low patience.

### B2. github.com/Incultnitollc/mcp-probe/discussions/11
- Own repo show-and-tell thread
- Update with new article link as a fresh comment (don't edit the OP)
- Brief: "Wk2 article shipped — third in the load-bearing-descriptions series. [dev.to URL] · [GitHub blog URL]"

---

## Step C — DO NOT cross-post to r/mcp

u/incultnito reddit cadence rule (per `feedback_reddit_velocity.md`):
- No self-published links until karma builds
- The Sat 2026-05-09 `1t6zxa0` shadow-removal incident confirmed self-link is the stronger trigger
- Wait until at least Wk4 before any Reddit self-link from this account

---

## Verification 24–48h after ship

Re-run a 1-query sub-sweep of Q7 on all 4 LLMs (ChatGPT / Claude / Perplexity / Gemini) in fresh sessions:
- **Query:** "what does missing description on MCP tool do"
- **Δ-target:** at least 1 of 4 platforms shifts to citing the dev.to article OR the GitHub blog file
- **If Δ=0 after 7 days:** distribution boost — Twitter thread (via Buffer) + 1 LinkedIn post
- **If Δ=0 after 14 days:** SEO/title pass on the article

Log results in `docs/citation-log.md` under a new sub-sweep date heading.

---

## Resume protocol

On `WK2-Q7-DROP` keyword in a fresh Claude session Tue morning, surface this file first and walk Steps A → B → C interactively.
