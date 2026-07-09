# Wk6 Video #2 — Brief

**Ship date:** Thu 2026-06-04, 21:00 Taipei (Track A · Mon+Thu cadence)
**Track:** A — short-form video, primary distribution channel
**Skill to invoke:** `social-video-pipeline`
**Strategy source:** `docs/notion/2026-06-02-wk6-restrategy-social-first.md`

---

## Topic

**"What MCP Inspector won't show you"** — lane-flank vs the locked competitor.

## Hook (3 candidates — pick on Thu)

1. "Inspector says green. Your LLM still picks the wrong tool."
2. "Five things MCP Inspector quietly skips."
3. "Your MCP server passes Inspector. It still isn't ship-ready."

Hook target: **lane-flank** — Inspector is fine for protocol handshake and tool-listing; mcp-probe surfaces the publishability layer Inspector doesn't address. Position complementary, not combative.

## Format (same 8s 3-segment structure as Video #1)

| Slot | Duration | Content |
|---|---|---|
| 0.0–1.5s | Sora 2 hook | Brand-consistent cult-luxe metaphor for "what's hidden." Prompt direction: a single magenta thread visible on top of off-white silk; CAMERA slowly pulls back to reveal a second, tangled magenta thread hidden underneath. Editorial 35mm, cult-luxe minimal. NO anime, NO fantasy, NO people, NO text. |
| 1.5–6.5s | Real CLI demo | Side-by-side or sequential: `npx @modelcontextprotocol/inspector ./your-server.js` returns "OK / 3 tools listed" (green). Then `mcp-probe score ./your-server.js` returns the 5-axis breakdown + score. Punchline: "Inspector says PASS, mcp-probe says 46/100." Real data from `test-fixtures/unpublishable-server.ts`. |
| 6.5–8.0s | Brand card | Same outro as Video #1 — `mcp-probe / ship-ready MCP servers / npm i -g @incultnitollc/mcp-probe`. Re-use `work/video-1/brand-card-vert.mp4` to save render time. |

## Real-data targets

- Re-run `node dist/cli.js score "npx tsx ./test-fixtures/unpublishable-server.ts"` for the score column
- Run `npx @modelcontextprotocol/inspector` against same fixture for the "Inspector says green" side. May need to pipe through screencap since Inspector is a web UI — fallback: use Inspector's CLI mode output or screenshot the UI showing "Connected · 3 tools"
- Optional: include `mcp-probe`'s named failure tags from Video #1 for continuity (description-five-axis, enum-shape, mutation-legibility, anti-purpose-clause)

## Brand bar (HARD — same as Video #1)

- Magenta #820855 on off-white #fafaf7
- NO emoji
- NO banned words: revolutionary, game-changing, AI-powered, shop now, browse products, credit packs, invest, profit, yield
- Voice: short, confident, premium. Strong verbs, no hype.
- Quality bar: 8/10 minimum — kill clip if below

## Cross-post matrix (same as Video #1)

| Channel | Aspect | Method | Caption length |
|---|---|---|---|
| TikTok | 9:16 (1080x1920) | Buffer customScheduled `notification` mode (approve on phone) | hashtag-heavy |
| X / Twitter | 16:9 (1920x1080) | Buffer customScheduled `automatic` mode | ≤280 chars |
| LinkedIn | 16:9 (1920x1080) | Buffer customScheduled `automatic` mode | long-form (~500 chars) |
| Instagram Reels | 9:16 (1080x1920) | manual via IG app (Buffer free tier locks 4th channel) | medium + first-comment hashtags |
| YouTube Shorts | 9:16 (1080x1920) | manual via YT Studio (not connected to Buffer) | title ≤100 chars + tags |

**Posting time**: 21:00 Taipei Thu 6/4 (canonical strategy time — Video #1 slipped to 23:00 because of late session start, return to 21:00 for Video #2).

## Pre-session prep (Thu morning)

- Pull Wed 6/3 video #1 metrics: TikTok views, X impressions, LinkedIn reactions, YT Shorts views, IG plays. Note in `docs/notion/2026-06-08-wk6-metric-snapshot.md` (file to be created Mon 6/8).
- Open Thu session with: `standup`
- Then: invoke `social-video-pipeline` with the brief above as args

## Cost target

≤$1 (1 Sora clip @ ~$0.40, free music, Cloudinary free tier, Whisper skipped — silent demo with on-screen text).

## Risk gates

- If Sora hook fails twice → fallback to ImageMagick procedural opening (magenta thread on off-white still-image with subtle animation via ffmpeg zoompan)
- If side-by-side composition gets visually messy → fallback to sequential cuts with hard transition
- If Inspector capture is too complex → just show the score-only frame with one caption "Inspector: PASS · mcp-probe: 46/100"

## Decision sources

- Topic stack pre-locked in `docs/notion/2026-06-02-wk6-restrategy-social-first.md` (Track A, item #2)
- Sora 2 prompt style validated in Video #1 ([[wk6-social-first]] memory)
- Real CLI segment pattern (ImageMagick PNG sequence → ffmpeg concat) proven in Video #1 — re-use approach
