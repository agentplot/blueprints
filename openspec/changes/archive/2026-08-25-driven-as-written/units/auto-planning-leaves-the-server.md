# Unit: auto-planning-leaves-the-server

System: flywheel

Work reaches the board through a dispatch plan or the operator's own
dictation, never through a server pass reading the book. The server
still charges one today: `plan_runs` watches every bound system, marks
standing cards `stale` when their recorded heads move, and charges a
planning run whenever a system has no fresh standing card and its book
has settled — which re-cards work nobody asked for the moment a plan's
apply moves its cards to Ready. That machinery comes out.

Sequence: 1 of 1 · builds on: none
Type: `bolt-quick` · Price: 1 change · ~0.5 days

| # | change | delivers | sources | after | why this bolt |
|---|--------|----------|---------|-------|---------------|
| 1 | `the-server-sheds-plan-runs` | `plan_runs`, its `stale` marking, the planner charge and its backoff leave `_flywheel_server.py`, with the tests that pinned them rewritten to pin their absence; the fleet's book bindings keep feeding `book_dir` to the loops — the binding's other job is untouched | the operator's dictation, 2026-08-19 ("remove the server's plan_runs charge and its staleness marking") · #356, the writeback that records planning-is-routed | — | the deliverable is a board that holds only work the operator's word put there |

## Left out

- The `bolt-planning` skill and the planner profile — the unit-card
  grammar and board mode are load-bearing (the dispatch plan's apply
  uses them), and a planning run the operator charges by work order
  remains legitimate. Only the server's autonomous charge goes.
- The `stale` label itself on the tracker — history keeps it; nothing
  writes it once this lands.

Dictated by the operator, 2026-08-19 — born ready on their word.
