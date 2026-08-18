# Staged release: bolt-gates-and-config — blueprints' instruments tell the truth

- **Built repo:** willdan-blueprints.
- **Bolt member:** `bolt-default`. Two rows are genuine tool changes
  (`books/preview.py`, the map vocabulary refactor across checker and
  viewer) whose declared review earns its keep; the config rows ride the
  same bolt cheaply.
- **Owner:** `chuck`.
- **ADR lines:** none in this batch.

## Released task lines and their records

1. `openspec/config.yaml` names the old task sections while the schema
   names the new ones → `assertions/config-task-sections.md` (open)
2. `openspec validate --strict` green is not evidence
   → `assertions/validate-is-not-evidence.md` (open)
3. `.claude/commands/opsx/apply.md` contradicts the loop it would carry
   → `decisions/the-trigger-lives-in-the-invocation.md`
4. BATCH — the books gate and the map tool, one handoff
   → `assertions/summary-not-a-link-target.md` ·
   `assertions/map-topology-vocabulary.md` ·
   `assertions/book-grab-symlink.md` (all open)

## Draft registry rows

| proposal | repo | review | waits on |
|---|---|---|---|
| books gate and map tool (the BATCH, one proposal): SUMMARY.md link class in `preview.py`, the topology vocabulary written once, the viewer's `books/` dependency named and optional | willdan-blueprints | agent | — |
| config truths: the validate-is-not-evidence paragraph into `context:`, the task-section enumeration case-aligned with the schema | willdan-blueprints | — | — |
| opsx apply: step 6's sequential walk reconciled with the loop the invocation carries | willdan-blueprints | agent | — |

## What disk says today, per row

**Books gate and map.**
- `books/preview.py`'s `count_links` resolves a link to `SUMMARY.md`
  against the file, which exists, so today such a link passes as *alive* —
  it is not even in the dead population, though mdBook publishes no ToC
  page. The new class reports it by name as dead by construction.
- The topology vocabulary is written twice: `SLOTS`, `STORE_SLOTS`,
  `FAMS` in `context-map/bin/map-check.mjs` (lines 315–317) and
  `CFG_GEOM` in `system-context-map.html` (line 1236). `map-check` can
  pass a combination the viewer cannot draw.
- `context-map/book-grab.js` is a symlink to `../books/book-grab.js`
  (verified `lrwxr-xr-x`); no record names the edge, and the viewer has
  not been shown to work with no `books/` tree.
- Repairing existing SUMMARY.md-link instances in chapters is book work —
  a writeback, not this proposal (the assertion's own boundary).

**Config truths.** `rules.tasks` on main already names
Design/Planning/Research/Prototype/Writeback/Handoff plus Verify — the
substance of `config-task-sections` landed with bolt-loop-layer
(`6b6a5923`). Residual: the schema and the live `tasks.md` headings are
lowercase; the config is capitalized, and an enumeration is the thing an
agent copies. The config's bolt line (Spec/Review/Build/Test/Merge)
matches `bolt-default`'s sections on disk and is not touched. The
`context:` block contains zero occurrences of "validate"; the paragraph to
add is the assertion's practice — diff the artifact against
`openspec instructions <artifact> --change <id>`, and for the
silently-dropped-requirement case the two counts that must agree
(`openspec show <id> --json --deltas-only` requirements and scenarios
against `grep -c '^### Requirement:'`). The upstream OpenSpec defects
stay out: that is the separate `not this intent's` line.

**opsx apply.** Verified verbatim on disk: step 3 runs
`openspec instructions apply --change "<name>" --json` handing over
`tasks[]`; step 6 says "For each pending task: … Continue to next task" —
the sequential walk the loop prompt forbids, and why arms A and B
re-queried 8/8 (`decisions/the-trigger-lives-in-the-invocation.md`). Two
facts the proposal must answer, both measured here: the file is installed
by the OpenSpec CLI (`opsx` experimental commands), so a local edit must
either go upstream or be re-applied on `openspec update` — the proposal
decides which and records it; and the flywheel repo carries its own copy
at `.claude/commands/opsx/apply.md`, which gets the same treatment or the
row records why not.

## Merge criteria (drafted against disk; the release gate is implied)

- A fixture chapter linking `SUMMARY.md` makes
  `python3 books/preview.py --check` report the distinct class, named as
  such; the three existing gates stay green on main.
- The topology vocabulary has one definition read by both the checker and
  the viewer; a combination the viewer cannot draw fails `map-check`.
  `node context-map/bin/map-check.mjs --write` green.
- The viewer's `books/` dependency is recorded in `context-map/README.md`
  and the viewer opens with no `books/` tree present.
- `rules.tasks`'s intent enumeration matches
  `flywheel-intent/schema.yaml`'s section names exactly, case included.
- The `context:` block carries the validate paragraph with both commands;
  `grep -n validate openspec/config.yaml` finds it.
- `.claude/commands/opsx/apply.md` step 6 no longer instructs a
  per-task sequential walk, or explicitly defers to a loop the
  instruction payload supplies; the regeneration question is answered in
  the proposal, and the flywheel-repo copy is reconciled or the
  difference recorded.

## Sequencing

The map-vocabulary half of the BATCH lands **before**
`bolt-flywheel-plugin`'s context-map extraction row builds
(`assertions/map-topology-vocabulary.md`: fix before extraction, not
carried into it). That is a cross-bolt wait recorded on the extraction
row — see `release-context-map-tool.md`. Nothing else here waits on
anything.
