# Decision: monitoring is the OpenSpec UI board

## Decision
The operator watches the flywheel on the OpenSpec UI board running against
blueprints main. Intents and bolts are changes there, with native task
progress, so every actor that keeps its change committed keeps the board
current — and nothing in the loops maintains a status surface by hand. There
is no custom dashboard. One gap is known and deliberately unbuilt: a
cross-intent release queue that predicts ripple from the map edges out of a
staged handoff. It gets built only if its absence is felt in use.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/conducting.md` (to be rewritten)
- Produced by: `sessions/2026-08-05-loop-pivot/loop-pivot-design.html`;
  designed in `openspec/changes/add-flywheel-loops/design.md`

## Consequences
- Retired: the spike's bespoke dashboard, and the JSON its conductors
  rebuilt after every task check-off.
- Appended writeback task: the monitoring surface named in `conducting.md`,
  including what the operator does at the board (pull an intent, give the
  release word) versus what it only shows.
- Standing constraint on the schemas: an intent's or bolt's `tasks.md` is
  the progress signal, so typed sections and checkbox lines are load-bearing
  for the board, not just for readers.
