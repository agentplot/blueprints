# Decision: blueprints is a built repo, and a design session never builds

## Decision
Two write scopes, not one, and they are different:

- **The intent conductor** writes its change's canonical artifacts —
  `intent.md`, `decisions/`, `tasks.md`, `design.md` — and the books and
  the context map.
- **A design session** writes its own assigned session directory under
  that change, and the books and the context map. It never writes the
  canonical artifacts; it reports, and the conductor promotes.

**The books and the map are the design loop's exclusively.** The two
scopes above say who may write a chapter; this says who may not. A bolt
never carries a book-chapter edit or a map move — not as a proposal, not
as a side effect of one, however naturally the chapter edit falls out of
the work. A chapter is where the destination is stated, and the
destination is what the design loop exists to write; a bolt that edits one
is writing design through the construction gate, and it will collide with
the session chartered for the same chapter.

The line inside `books/` is chapter versus machinery, not path:
`books/<book>/src/**` is design-loop territory; `books/CLAUDE.md`, a
book's `CLAUDE.md` and `BUILDOUT_PROMPT.md`, `SUMMARY.md` where it moves
only because machinery moved it, and the book skills are construction.

Every other file edit in any repo is construction and leaves through the
phase gate as a handoff — including edits to blueprints itself. When an
intent's subject is the machinery blueprints carries — its skills, agent
profiles, schema instructions, `CLAUDE.md` conventions, plugins —
blueprints is that intent's built repo in the ordinary sense, and being the
repo the conductor happens to run in changes nothing.

A design session is single-purpose within the intent: it burns fog into
decisions, writes the destination into the books and map, and reports what
to check off. It does not dispatch agent work. Work that dispatches agents
is a proposal in a bolt, and a small one is a one-proposal bolt, never an
untracked edit.

The two scopes were first written as one — "the change's own artifacts
under `openspec/changes/<id>/`" — which is true of both and therefore
grants a session the canonical artifacts when read literally, which is how
a steering surface is read. `sole-writer-conductors.md` and
`session-directories.md` had it right all along and this record was the
loose one.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/conducting.md` (to be rewritten)
- Produced by: the operator's word, given directly to this conductor after
  it proposed launching a design session to rename an agent profile and
  rewrite two skills: "there's a difference between design sessions, which
  are meant to be single-purpose within the intent (closing out fog and
  checking things off), and tasks that dispatch actual agent work … that's
  actually construction against the blueprint repo and requires it. As the
  dispatcher you're deciding whether to fire it off as a short-circuit,
  quick one-off bolt that does openspec and construction all in one go."
- The conductor had also proposed doing the rename inline as a "pure
  chore", which contradicts `decisions/every-handoff-is-a-bolt.md`. The
  chore route belongs to dispatch at the moment of triage, before an intent
  exists; it is not a way to drain a task already sitting on one.
- The schema already said this and was not enough: `flywheel-intent`'s
  `tasks` instruction defines Writeback as "book chapter rewrites
  (destination voice) and context map updates". Six tasks that edit
  profiles, skills, schema files, and conventions docs had been filed there
  anyway. A definition that is only correct is not a guardrail.

## Consequences
- `tasks.md` re-sorts: Writeback keeps only the three book-chapter tasks;
  the profile rename, the two skill rewrites, the schema instruction edits,
  the `books/CLAUDE.md` and book-skill changes, the root `CLAUDE.md` entry
  points, and the `openspec-construction` retirement all become Handoff
  tasks naming their built repo and their proposal.
- The `flywheel-inception` skill gains the rule as a rule, not an
  implication: name the two things a conductor and its sessions write, and
  state that everything else is a handoff whatever repo it lives in. The
  dispatch section states that the chore route is dispatch's alone, at
  triage, and closes once an intent owns the work.
- The design-session section states that a session closes fog and writes
  the destination, and that a session is never the way to make an agent
  build something.
- The profile bodies carry the same line, since a session that reads only
  its profile must not be able to reach the wrong conclusion. Both errors
  above were made by an agent that had read the skill.
- This is the loop catching a defect in itself, which is the intent's own
  subject — worth naming in `conducting.md` as the reason the rule is
  stated positively rather than left to be inferred from the task types.
- The compression propagated before it was caught. It reached
  `bolt-flywheel-machinery`'s proposals as a rule on the surfaces where it
  is load-bearing — the steering surfaces an agent reads first — and as a
  citation elsewhere, so it was about to be installed by the bolt whose
  subject is stopping agents from writing what they should not. The bolt
  fixed them in construction and correctly did not touch this record. That
  a compressed rule spreads faster than a wrong one is the same lesson as
  this record's own sentence about definitions that are only correct.

  This consequence first named three carrying proposals. There were four,
  and the fourth carried it as a citation rather than a rule. The count is
  not restored, because an enumeration of what neighbours currently say is
  exactly the state claim this bolt taught the loop to stop writing — a
  later reader treats such a list as exhaustive, and it goes stale the next
  time a proposal is amended. What is durable is that it propagated and
  where it was load-bearing, which is what the paragraph now says.
- Rests on `decisions/every-handoff-is-a-bolt.md`, which had already closed
  the only exit this decision now points at.
