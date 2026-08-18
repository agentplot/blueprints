# Decision: the file's sole writer runs the review, and the conductor turns annotations into work

## Decision
A review surface is opened by whoever is the sole writer of the file under
review: the triage singleton annotates the intent it just wrote, a
conductor annotates its canonical artifacts, a design session annotates the
decision drafts in its own directory, and a bolt conductor annotates a
generated proposal. Feedback returns to the invoker and nowhere else —
`plannotator annotate` hands its result to the session that ran it — so
annotations are never relayed raw to another actor and never written into
another actor's directory. The conductor triages what comes back into
exactly one of three: a correction it applies before re-walking the
artifact sequence forward; a decision the operator's annotation closed on
its own; or work that needs design, which becomes an appended Design task
and then a session with its own directory and batch. A review round is
therefore a launch point for design sessions by the same route the board
is — it produces the task, and the conductor spawns the session.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/conducting.md` (to be rewritten)
- Produced by: `sessions/2026-08-06-chapters-and-channels/decisions.html` —
  the operator took the through-the-conductor option. The surface's
  evidence for it: `plannotator annotate` is a blocking command whose
  `--json`, `--gate`, and `--result-file` are all shapes of one return to
  the invoker, with no addressing and no fan-out.
- Precedent: this intent's own `decisions/design-catalog.md` was closed in
  a plannotator round, which is the case a bounded review round could not
  have produced.

## Consequences
- Appended writeback task: the review-moment table and the triage rule into
  `conducting.md`, generated from the one rule rather than listed as
  special cases.
- `flywheel-inception` gains the invoker rule and the conductor's triage of
  returned annotations.
- Schema: `flywheel-intent`'s `tasks` instruction states that a review
  round may append a Design task; the `decisions` instruction already
  covers a decision closed in one.
- `flywheel/E2E.md` §2 and §5 name who runs `annotate` at each review
  moment.
- The steering that a spawned session then arrives with is
  → decisions/design-session-steering.md.
