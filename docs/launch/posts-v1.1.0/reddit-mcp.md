# Reddit r/mcp — v1.1.0 publishability score (paste-ready)

**Submit at:** https://www.reddit.com/r/mcp/submit
**Flair:** Tools / Showcase (check sub rules)
**Day:** Launch day, after Show HN posts
**Mention ratio target:** ≤50% probe-mentions across post + first 10 replies. Headline is the finding, not the tool.
**Anti-patterns checklist:**
- [ ] No self-link from u/incultnito (use Peng's main account; see `feedback_reddit_velocity.md`)
- [ ] Body leads with diagnostic, npm install line near the bottom
- [ ] No "I built X" top-frame
- [ ] No DM offers, no @mentions
- [ ] ≥10 min spacing from any other r/mcp activity on the same account

## Title

```
Every official @modelcontextprotocol MCP server lands at exactly 60/100 on schema-description density — same cap fires on all five
```

## Body

```
Ran a 5-axis publishability check against the five servers shipped
under the official @modelcontextprotocol/ scope. Every one of them
scores 60/100 composite, and the same axis fires the cap on every one:
schema descriptions are too thin on per-tool axis density (purpose,
mutation, side-effects, invariants, examples).

    Server                             Composite  Protocol  Edge  Publish
    -------------------------------    ---------  --------  ----  -------
    server-sequential-thinking            60        100      100     20
    server-memory                         60        100       85     50
    server-everything                     60        100       94     20
    server-filesystem                     60        100       57     50
    server-github (legacy)                60        100       26     50

Protocol scores are 100 across the board — the wire format is right.
The 40-point gap is entirely how the schemas read. Per-axis breakdown:

    Axis                       seq-think  memory  every   filesys  github
    -----------------------    ---------  ------  -----   -------  ------
    description-five-axis        FAIL      FAIL   FAIL     FAIL    FAIL
    enum-shape                   PASS      PASS   PASS     PASS    PASS
    mutation-legibility          FAIL      PASS   FAIL     PASS    PASS
    anti-purpose-clause          SKIP      FAIL   FAIL     FAIL    FAIL

Two universals jump out:

1. enum-shape passes everywhere — no official server ships prose-only
   enums.
2. description-five-axis fails on 63 of 63 tools across the five
   servers. Global per-tool axis averages: 1.00/5 (memory), 0.55/5
   (everything), 0.88/5 (filesystem), 0.44/5 (github). The cap is
   firing because the descriptions don't cover purpose, mutation,
   side-effects, invariants, and examples — they cover one or two.

One pattern: every multi-tool server with mutating tools fails
anti-purpose-clause. No official server tells a planner "do not use
for X, prefer Y" on delete / send / transfer style tools.

I'm not framing this as a bug in the reference servers. It's the bar
they ship at, which means it's also the bar most third-party servers
will start from. Useful as a public baseline.

Full scorecards (per-server raw output + composite math):
https://github.com/Incultnitollc/mcp-probe/blob/main/docs/publishability-scorecards/SUMMARY.md

Methodology — the v1.1.0 score subcommand:

    npm install -g @incultnitollc/mcp-probe
    mcp-probe score "npx -y @modelcontextprotocol/server-everything" --full

The score lane is one of three I think are now visible in the
ecosystem — peer tools, not replacements:

- @modelcontextprotocol/conformance — am I spec-compliant?
- @stephenywilson/mcp-doctor        — will this server pwn me?
- @incultnitollc/mcp-probe          — is my server publishable?

If you maintain a server and want the same scorecard run against it,
drop the npm install command or repo and I'll paste the output as a
reply.
```

## Follow-up reply variants

**A. Probe-free (use when the comment is conceptual / "is this fair?")**

```
The cap fires per-tool, not per-server — each tool gets scored across
purpose, mutation, side-effects, invariants, examples. A tool that
averages below 3.0/5 axes triggers the ≤60 composite ceiling. Across
the five official servers, every single tool (63/63) lands below 3.0.
That's why protocol-100 servers still hit 60.

Per-server axis averages: memory 1.00/5, everything 0.55/5, filesystem
0.88/5, github 0.44/5. None of them are stuffing one axis hard; they're
documenting one axis (usually purpose) and leaving the others empty.
```

**B. Mention-once (use when someone asks how to run it on their server)**

```
mcp-probe score "<your-command>" --full --package ./package.json

That runs the full 5-axis breakdown plus protocol + edge-case checks
and points distribution-metadata at your package.json so it can
factor description/keyword/repo/license/homepage. Paste the output
back here and I'll read the cap-firing axis with you.
```

**C. Technical deep-dive (use when someone asks how the axes are scored)**

```
Per-axis sketch for description-five-axis specifically:

- purpose       — what does the tool do, in plain language
- mutation      — does it read or write; if write, what changes
- side-effects  — network calls, FS writes outside scope, external API
- invariants    — what stays true before/after; pre/postconditions
- examples      — at least one concrete arg shape

Scoring is 0 or 1 per axis based on string-match heuristics over the
tool's description + the per-property description fields. A tool gets
a score 0..5; the per-tool score is what goes into the 3.0 cutoff.

The math is server-agnostic in v1.1.0 — no per-domain calibration yet
(filesystem tools and API tools are scored identically). That's a
known limitation, deferred. Spec:
github.com/Incultnitollc/mcp-probe/blob/main/docs/specs/publishability-score-v1.1.0.md
```

## After posting

- Reply to every comment within 1 hour for the first 4 hours
- If someone links their server, run the score against it and paste the scorecard back
- Link from Twitter thread only after 20+ upvotes
- If the post is removed by automod, do NOT repost same day; check sub rules + DM mods next morning
