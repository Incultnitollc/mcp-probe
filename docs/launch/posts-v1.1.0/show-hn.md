# Show HN — v1.1.0 publishability score (paste-ready)

**Submit at:** https://news.ycombinator.com/submit
**Best time:** Tuesday or Wednesday, 8–10am ET
**Budget:** Sit at the keyboard for 4 hours after posting. Reply to every comment within 30 minutes.

## Title

```
Show HN: Every official Anthropic MCP server scores 60/100 on publishability
```

## URL

```
https://github.com/incultnitollc/mcp-probe
```

## Text (body)

```
mcp-probe v1.1.0 adds a publishability score: a 0–100 composite that
rates an MCP server on whether its schemas, descriptions, and metadata
are ready for someone else to install. Five axes:

- description-five-axis  — per-tool density across purpose, mutation,
                           side-effects, invariants, examples. Below
                           3.0/5 fires a hard ≤60 composite cap.
- enum-shape             — prose-only enums with no JSON Schema enum
- mutation-legibility    — does each tool tell a planner it mutates
- anti-purpose-clause    — high-blast tools (delete, send, transfer)
                           should carry a "do not use for X, prefer Y"
- distribution-metadata  — npm description, keywords, repository,
                           license, homepage

  npm install -g @incultnitollc/mcp-probe
  mcp-probe score "npx -y @modelcontextprotocol/server-everything" --full

I ran it against the five MCP servers shipped under the official
@modelcontextprotocol/ scope. Every one of them lands at 60/100:

  server-sequential-thinking  60  protocol 100  edge 100   publish 20
  server-memory               60  protocol 100  edge  85   publish 50
  server-everything           60  protocol 100  edge  94   publish 20
  server-filesystem           60  protocol 100  edge  57   publish 50
  server-github (legacy)      60  protocol 100  edge  26   publish 50

Protocol scores are 100 across the board — the wire format is right.
The 40-point gap is description-five-axis on every server. Across the
five, 63 of 63 tools score below 3.0/5 on axis density. Every multi-tool
server with mutating tools also fails anti-purpose-clause: no official
server tells a planner "do not use for X, prefer Y."

I don't read this as a bug. I read it as the bar the reference servers
ship at, which is also the bar most third-party servers start from. The
v1.1.0 rubric just makes the 40 points addressable.

mcp-probe sits in a lane next to two peers, not on top of them:

  @modelcontextprotocol/conformance   spec compliance       (SDK authors)
  @stephenywilson/mcp-doctor          install-time security (installers)
  @incultnitollc/mcp-probe            pre-publish quality   (authors)

CI gate via the GitHub Action:

  - uses: incultnitollc/mcp-probe@v1
    with:
      command: 'node dist/index.js'
      publishability: 'true'
      package: './package.json'
      fail-under: '70'

A weekly canary workflow re-scores the five official servers on
Sundays at 03:00 UTC — informational, no fail-under. Solo builder,
MIT licensed, non-coder by training.

Repo:        https://github.com/incultnitollc/mcp-probe
Release:     https://github.com/Incultnitollc/mcp-probe/releases/tag/v1.1.0
Action:      https://github.com/marketplace/actions/mcp-probe-mcp-server-health-check
Scorecards:  docs/publishability-scorecards/SUMMARY.md in the repo

Feedback I'm looking for: is the 5-axis breakdown the right cut, and
where would you push back on the ≤60 cap when description density is
the only thing missing.
```

## HN rules (hard)

- No emoji.
- No exclamation marks.
- No "excited to announce."
- No CAPS.
- Reply to every top-level comment within 30 minutes for 4 hours.
- If criticism lands, thank + acknowledge, don't defend.
- If it gets flagged off front page, do NOT reupload same day.

## Reply prep — likely critical questions

**Q1. "Isn't a 60/100 floor across all five official servers just a calibration problem in your rubric?"**
A. Fair pushback. Protocol scores are 100, edge-case scores span 26–100, and the cap fires on the same axis every time — description-five-axis. If the rubric were uniformly hard, the sub-scores would spread. They don't. The cap is real, but I'm publishing the per-axis breakdown so anyone can disagree on weight.

**Q2. "How is this different from MCP Inspector or @modelcontextprotocol/conformance?"**
A. Inspector is interactive GUI exploration; conformance answers "am I spec-compliant?" for SDK authors. mcp-probe answers "is my server publishable?" for server authors before they ship. Three lanes, peers not replacements. The conformance package is in the README positioning table by name.

**Q3. "What stops a server author from gaming the score by stuffing descriptions?"**
A. The five axes are independent — stuffing one (purpose) doesn't lift the others (mutation, side-effects, invariants, examples). Tools below 3.0/5 average density still fire the cap. You'd have to actually document the tool to clear it. That's the design intent: make the cheap path the documented path.
