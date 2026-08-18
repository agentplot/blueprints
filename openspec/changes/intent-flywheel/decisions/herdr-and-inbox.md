# Decision: requests reach a conductor by herdr prompt, or by its inbox

## Decision
Agents reach each other two ways and no others. When the target conductor
is running — `herdr agent list` shows `intent-<slug>` or `bolt-<slug>` —
the request is a `herdr agent prompt`. When it is not, the request is a
file in the change's own `inbox/` (`inbox/<date>-<from>-<slug>.md`), which
the conductor drains at every turn start. No watchers, no polling. Draining
is not an append: the conductor revises the earliest artifact the request
touches, re-walks the artifact sequence forward so the downstream records
stay coherent, and deletes the drained file in the same commit. Discord is
the operator's channel, not a bus between agents.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/conducting.md` (to be rewritten)
- Produced by: `sessions/2026-08-05-loop-pivot/loop-pivot-design.html`;
  designed in `openspec/changes/add-flywheel-loops/design.md`

## Consequences
- Landed in `add-flywheel-loops`: the inbox round-trip proven on
  `bolt-rocs-records` — request dropped, folded into tasks, file deleted,
  one commit.
- Appended writeback task: the messaging rules into `conducting.md`.
- Open question left standing: whether a Discord-bridge-connected session
  can trigger on non-mention messages, and whether a webhook receiver is
  worth having for remote intake → research task.
