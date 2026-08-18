# Session: book-writeback

## Charge
- Change: flywheel
- Directory: sessions/2026-08-06-book-writeback/
- Type: writeback session — books and the context map, destination voice
- Tasks: all three Writeback tasks in `tasks.md`, worked as one pass
  because they share a chapter set and would otherwise contradict each
  other at the seams.

1. Rewrite `books/aidlc-design/src/conducting.md` and
   `authoring-capabilities.md` as the actor-model design — the channel
   matrix (answer shape down one axis, loop across the other, who blocks
   per cell), the bridge configuration and the relay in both directions,
   the review-moment table generated from the sole-writer rule with the
   conductor's triage of returned annotations, the session steering, and
   dispatch under its settled name.
2. Rewrite `spec-driven-construction.md` around the pipeline stages — the
   actor-and-branching figure, the opsx artifact sequence and the
   binding-checklist mapping absorbed from `openspec-construction.md`, and
   one exit from the phase gate.
3. Retire `catalog.md`, `agent-workspaces-plugin.md`,
   `system-design-inception.md`, and `openspec-construction.md` —
   `SUMMARY.md` loses its "Plugins & skills" section, the book skills
   become one-line capabilities in `authoring-capabilities.md`, the
   commissioning-inception half moves to `commissioning.md`, and
   `vocabulary.md`, `walkthrough.md`, `index.md` follow.

## Sources
Every decision in `openspec/changes/flywheel/decisions/` is settled and is
the authority. The ones that bind hardest:
`human-loop-channels` (the matrix), `bridged-singleton` and
`dispatch-singleton-name` (the actor and its name), `review-launch-points`
and `design-session-steering` and `session-types-are-skills` (the session
model), `every-handoff-is-a-bolt` (one exit from the gate),
`the-gate-is-inline` (the conductor drives; the gate authorizes and does
not stall), `blueprints-is-a-built-repo` (what a session writes),
`plugin-chapters-fold` and `proposals-chapter-retires` and
`book-decompose-retires` (the chapter set and what leaves it),
`sole-writer-conductors`, `herdr-and-inbox`, `three-schemas`,
`openspec-ui-monitoring`, `session-directories`, `design-catalog`.

## Standing constraints
- `books/CLAUDE.md` governs voice and mermaid rules. Destination voice: the
  book describes what is, never that a decision was made or when.
- Rewrite chapters in full rather than patching them.
- Done condition: `python3 books/preview.py --check` green,
  `node books/check-mermaid.mjs` green, and
  `node context-map/bin/map-check.mjs --write` green if the map moved.
- You write the books, the map, and this session directory. Nothing else.
  Skills, profiles, and schema files are construction and are already
  tasked as bolt proposals — do not touch them
  (→ decisions/blueprints-is-a-built-repo.md).
- Do not edit `intent.md`, `tasks.md`, `decisions/`, or `design.md`. Report
  and the conductor promotes.

## Known coupling
A live session (`flywheel-session-1`,
`sessions/2026-08-06-flywheel-own-repo/`) is deciding whether flywheel
moves to its own repo and ships as a plugin. If it ships as a plugin, skill
invocation names become `/<plugin>:<skill>` and the chapters that name a
skill get a follow-up touch. That is a small surface and not a reason to
wait — write the chapters now, and prefer naming a capability and what it
is for over quoting an invocation string, which is the standing rule from
`decisions/plugin-chapters-fold.md` anyway.

## Produced
- `report.md` — what landed per chapter, the scope taken beyond the task
  lines and its decision citations, and five findings for the conductor.

## Delivered
- `books/aidlc-design` rewritten to the flywheel: `conducting.md`,
  `authoring-capabilities.md`, `spec-driven-construction.md`, and
  `system-design.md` in full; `SUMMARY.md`, `vocabulary.md`,
  `walkthrough.md`, `index.md`, `foundations.md`, `commissioning.md`,
  `agent-workspaces.md`, `verifications.md` following; `catalog.md`,
  `agent-workspaces-plugin.md`, `system-design-inception.md`,
  `openspec-construction.md`, and `proposals.md` retired.
- `books/overview/src/systems.md` updated per the overview-is-the-sink
  rule.
- Checks green: `books/preview.py --check`, `books/check-mermaid.mjs`,
  `context-map/bin/map-check.mjs`. The map did not move.
- All three Writeback book tasks are done; task 3's wording needs
  `proposals.md` and `system-design.md` added to match what landed.
