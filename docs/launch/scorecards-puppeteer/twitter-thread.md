# Twitter/X thread — 4 tweets, Buffer-schedulable

**Channel type:** automatic (per `feedback_buffer_twitter_automatic.md` — notification mode rejected for Twitter)
**Posting account:** @PengSpirit (existing)
**Pin:** No. Single thread, no pin.
**Anti-pattern guard:**
- Headline is the finding (cluster pattern), not the tool
- Probe install line appears once, in tweet 4
- No @AnthropicAI tag
- No "I built X" framing
- No emoji

## 1/4

```
6 of 6 official @modelcontextprotocol MCP servers now score 56–60/100
on schema-description density. Same axis fires the cap every time:
description-five-axis. Puppeteer just joined the cluster at 56 —
lowest per-tool axis avg measured to date (0.17 / 5).
```

## 2/4

```
Server                              Composite  Edge  Publish  Per-tool axis
---------------------------------   ---------  ----  -------  -------------
server-sequential-thinking             60      100      20    n/a (single)
server-memory                          60       85      50    1.00 / 5
server-everything                      60       94      20    0.55 / 5
server-filesystem                      60       57      50    0.88 / 5
server-github (legacy)                 60       26      50    0.44 / 5
server-puppeteer (deprecated)          56       50      20    0.17 / 5
```

## 3/4

```
What 0.17 / 5 looks like:

puppeteer_navigate — "Navigate to a URL."

That's purpose. No mutation signal (changes page state). No side-effects
(can hit any URL — high-blast). No invariants (new tab? same tab?
unclear). No examples. A planner LLM has nothing to pattern-match on.

Same shape on the other 6 tools.
```

## 4/4

```
Full scorecard + 6-server summary:
https://github.com/Incultnitollc/mcp-probe/discussions

Reproduce on your own server:
  mcp-probe score "<your-command>" --full

Methodology:
https://github.com/Incultnitollc/mcp-probe/blob/main/docs/specs/publishability-score-v1.1.0.md
```

## Buffer setup

- Channel: Twitter @PengSpirit (verify Buffer connection live)
- Scheduling type: **automatic** (per stored feedback)
- Spacing: 1 hour between tweets in thread queue, OR use Buffer's native thread feature if available
- Best post window: Tue–Thu 09:00–11:00 TPE (memory shows Wk2 amplify slots in this window)

## Post-publish checklist

- [ ] Add `https://x.com/PengSpirit/status/<id>` to citation log under WK5
- [ ] Watch for replies from Anthropic devrel handles — do not @ them first
- [ ] If <50 impressions in 4 hr, do NOT delete; let it breathe
