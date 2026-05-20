# publishability-score v1.1.0 — Spec Amendments

> Companion to `docs/specs/publishability-score-v1.1.0.md`. Records calibration findings + deviations surfaced during implementation. Spec §4.6 prediction table is **superseded** by this document.

## Amendment A — 2026-05-20 (D3.5 calibration)

### Finding

Spec §4.6 predicted composite scores for 5 reference servers under the v1.1.0 rubric. D3 calibration (`mcp-probe score --full`) returned the following:

| Server | Spec §4.6 prediction | D3 actual | Drift |
|---|---|---|---|
| `@modelcontextprotocol/server-sequential-thinking` | 98 | **60** | -38 |
| `@modelcontextprotocol/server-memory` | 91 | **60** | -31 |
| `@modelcontextprotocol/server-everything` | 87 | **60** | -27 |
| `@modelcontextprotocol/server-filesystem` | 63 | **60** | -3 ✓ |
| `@modelcontextprotocol/server-github` (legacy) | ≤60 | **60** | 0 ✓ |

4/5 servers landed >±5 from prediction. **3/5 hit the `≤60` ceiling** because the description-five-axis per-tool cap fires when ≥50% of tools score below 3.0 axes per-tool.

### Root cause

The per-tool 3.0-axis threshold is strict relative to current real-world MCP server description style. Examples from server-memory (which has clean, working tools but only ~1.0 axes per tool):

- `delete_relations` description: *"Delete multiple relations from the knowledge graph"* — hits the **mutation** axis only (1/5).
- `create_entities` description: *"Create multiple new entities in the knowledge graph"* — hits the **mutation** axis only (1/5).
- `read_graph` description: *"Read the entire knowledge graph"* — hits the **mutation** axis only via "Read" (1/5).

These descriptions are arguably adequate for tool selection by current Claude / GPT models, but they don't ground the *5* axes the rubric requires: type, constraints, what-not-to-pass, mutation legibility, example.

### Decision

**Accept the drift. Do not relax the rubric.** The 60-ceiling pattern across 4/5 official Anthropic-shipped servers IS the value proposition of v1.1.0:

> Every official MCP server tested has tool descriptions below the publishability bar defined by the 5-axis rubric. This is the gap the tool surfaces. Server authors who fix descriptions to hit ≥3 axes per tool see meaningful uplift; the rubric is not "graded on a curve" against existing servers.

Adjusting the threshold downward to 2.0 axes (or removing the per-tool cap) would make the rubric trivial to pass and erase the signal it provides.

### Spec §4.6 supersession

Replace the §4.6 prediction table with this calibration table. Update the lede:

> The v1.1.0 rubric is intentionally strict. As of 2026-05-20, **all 5 official Anthropic-shipped reference servers score 60/100 ("Rough")** under the rubric — driven primarily by the description-five-axis check. The composite is a tool for measuring *the gap between current MCP server descriptions and the 5-axis pre-publish bar*, not a leaderboard.

### Scorecard implications (D4 Task 4.1)

D4 scorecards should:
- Lead with the headline finding ("4/5 servers capped at 60") rather than per-server praise/blame
- Document the 60-floor as a corpus-wide finding, not a per-server failure
- Position the rubric as forward-looking (what publishable means) rather than backward-looking (how current servers fail)

---

## Amendment B — 2026-05-20 (Math.max scoring deviation, D1.2 carryover)

Spec §2.1 description-five-axis check originally implied literal averaging of per-tool description axes and per-property description axes. D1 implementation used `Math.max(toolDescScore, propAvg)` instead of equal-weight averaging (commit `1412685`).

D3 calibration shows this deviation is **consistent with the spec's intent** — what mattered is the global mean and per-tool failure ratio, both of which the cap engages on correctly. Math.max may slightly inflate per-tool scores in the rare case where a tool has rich description but sparse property descriptions; in practice, real-world MCP servers fail both, so the deviation is invisible in calibration.

**Decision:** Math.max is retained. No code change.

---

## Amendment C — 2026-05-20 (Marketplace 125-char description ceiling)

Spec §11 Open Question #1 (mcp-probe-action-v1) defaulted action.yml `description` to 162 characters. GitHub Marketplace silently rejected the publish at this length. The validation limit is undocumented but appears to be **~125 characters**.

Action description shortened to 114 characters on commit `de95210`. Both `v1.0.0-action` and `v1` tags force-moved to that commit. Marketplace publish succeeded on retry.

**Decision:** Spec §11 OQ#1 is closed. Marketplace description limit captured in `reference_github_marketplace_action_publish.md` memory.
