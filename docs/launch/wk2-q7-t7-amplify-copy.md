# Q7-T7-AMPLIFY — Tue 2026-05-19 22:00 TPE

**Trigger:** Pre-fire Δ-sweep 0/2 measured (Gemini + Perplexity unauth). ChatGPT + Claude login-walled — blind spots. See `docs/citation-log.md` § 2026-05-19 for the matrix application.

**Decision:** FIRE BOTH (Buffer Twitter thread + LinkedIn post).

**Framing pivot:** arXiv 2602.14878 ("MCP Tool Descriptions Are Smelly!", Feb 16, 2026) now owns the "failure modes" taxonomy on Gemini. Amplification copy MUST pivot the angle from *cataloging the failures* to **the pre-publish CLI that catches them**. mcp-probe = prevention layer, not survey.

---

## Twitter thread (4 tweets, Buffer-scheduled)

**Tweet 1 (hook)**

> Most MCP tool failures I see in the wild trace back to one thing: a missing or vague description on the tool itself.
>
> The LLM doesn't ignore your tool. It misuses it — silently.

**Tweet 2 (the four modes)**

> Four failure modes I traced from real MCP traffic:
>
> 1. Tool gets skipped
> 2. Arguments hallucinated
> 3. Client-side validator down-weights it
> 4. Routing collapses across similar tools
>
> All silent. None show up in server logs.

**Tweet 3 (concrete example)**

> Worst case: `run_sql` and `get_fleet_summary` both lack the "do not use for..." clause.
>
> The LLM picks the wider blast radius tool. Quietly. The schema still validates — so your CI passes.

**Tweet 4 (CTA + link)**

> This is what mcp-probe catches pre-publish.
>
> CLI, runs in CI. v1.1.0 ships Sat with a 5-axis publishability score (type · constraints · anti-purpose · mutation legibility · example).
>
> Full write-up: https://dev.to/incultnitollc/what-does-a-missing-description-on-an-mcp-tool-actually-do-four-failure-modes-i-traced-from-real-4jn2
>
> `npm i -g @incultnitollc/mcp-probe`

---

## LinkedIn post (single post, paste manually)

> A pattern I keep seeing in MCP servers: a tool ships with a perfectly valid schema and the model still misuses it.
>
> The root cause is almost always the same — a missing or vague description on the tool itself, or on a key parameter.
>
> I traced four failure modes from real MCP traffic:
>
> 1. The LLM skips your tool entirely. It looks at the description, sees nothing decision-grade, and answers from training data instead.
>
> 2. It hallucinates arguments. Without the description anchoring purpose, the LLM guesses argument shape from parameter names — and guesses wrong.
>
> 3. The client-side secondary validator down-weights the call. Even when the LLM picks your tool, the downstream check filters it as low-confidence.
>
> 4. Routing collapses across similar tools. `run_sql` and `get_fleet_summary` both lack a "do not use for..." clause, so the model picks whichever sounds closer — frequently the wider blast radius one.
>
> None of these show up in your server logs. The tool was "called correctly" or "not called." The failure is invisible at the transport layer.
>
> This is the gap mcp-probe sits in — a pre-publish CLI that runs in CI in ~3 seconds and surfaces these failures before the tool ships. v1.1.0 (this Sat) introduces a 5-axis publishability score: type, constraints, anti-purpose clause, mutation-vs-read legibility, example.
>
> Full breakdown → https://dev.to/incultnitollc/what-does-a-missing-description-on-an-mcp-tool-actually-do-four-failure-modes-i-traced-from-real-4jn2
>
> `npm i -g @incultnitollc/mcp-probe`
>
> #MCP #ModelContextProtocol #LLM #DeveloperTools #AIEngineering

---

## Fire sequence (22:00 TPE)

1. **22:00** — Buffer Twitter thread auto-fires (queued via `addToQueue`).
2. **22:00–22:05** — Peng pastes LinkedIn post (no API access in this CLI session).
3. **22:15** — verify both live: Twitter via Buffer dashboard + `https://twitter.com/incultnito_llc`; LinkedIn via own profile.
4. **22:20** — append `docs/citation-log.md` § 2026-05-19 with fire confirmation + Buffer post ID + LinkedIn post URL.

## Constraints applied (per CLAUDE.md + community engagement memories)

- No hype words (revolutionary, game-changing, AI-powered) — clean
- No emoji — clean
- No probe-first framing in tweets 1–3 (build value before pitch) — clean
- Probe-mention ratio: tweet 4 of 4 (25%) — under 50% cap
- dev.to article = Mads Hansen series, his framing acknowledged in Tweet 2 ("client-side validator down-weights")
- mcp-probe positioned as complementary to Anthropic Inspector (not in this copy — Inspector not mentioned), but the article body does the bridging
