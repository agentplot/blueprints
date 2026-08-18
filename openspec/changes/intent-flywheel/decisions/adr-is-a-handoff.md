# Decision: the ADR task type retires; an ADR is a handoff

## Decision
`flywheel-intent` loses its **ADR** task type. The typed sections are
Design, Writeback, and Handoff — three, not four. An architecture decision
record destined for a built repo is a Handoff task like any other
built-repo edit: it names the repo, the ADR to generate, and the sources
that argue it, then leaves through the operator's approval into the bolt
that carries the work it explains.

**The Handoff task is the trigger, and the bolt conductor is the writer.**
The intent names that an ADR is wanted and hands over the material; the
conductor writes it into the built repo's log4brains layout as a direct
edit, ahead of the code, with no proposal row of its own
(`decisions/bolt-conductor-latitude.md`). Nothing else signals an ADR, so
an intent that does not name one on a task will not get one.

"Ahead of construction", which is what the ADR type was reaching for, is
preserved by **ordering inside the bolt** rather than by bypassing the
approval.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/conducting.md`
- Produced by: the operator's word, on a finding routed by
  `bolt-flywheel-machinery`: the schema defines ADR as "architecture
  decision records written into a built repo (log4brains layout), ahead of
  construction", while `decisions/blueprints-is-a-built-repo.md` makes
  every file edit outside the change's own artifacts, the books and the map
  a handoff. Both cannot be followed. A conductor meeting an ADR task on
  its frontier had no stated move at all.
- The type predates the rule. It was written when a conductor was assumed
  able to write into a built repo directly; the two-things rule came later,
  out of the operator's correction, and supersedes it.
- The alternative considered and rejected was a third carve-out — "the
  destination record wherever it lives", books and map in blueprints, the
  ADR tree in a built repo. Coherent, and rejected because it reopens a
  boundary at exactly the moment a bolt has spent four review rounds
  keeping it at two, with nothing to enforce where the carve-outs stop.

## Consequences
- Schema: `flywheel-intent`'s `tasks` instruction drops the ADR type and
  its Consequences line ("writeback, ADRs in built repos, handoffs, or new
  questions" loses the middle term); the `tasks` template and the
  decision-record template follow.
- `flywheel-inception`'s task-type list drops it, and the conductor
  requirement's enumeration of Design / Writeback / Handoff becomes
  complete rather than accidentally short.
- The Handoff instruction gains the ADR as a named case, and states what
  the task line must carry: the repo, the decision to record, and the
  sources. Written first in its bolt, so the built repo carries the
  reasoning before it carries the change.
- The gate now covers everything entering a built repo, with no exception
  a later reader has to remember. That was the point of the rule and it is
  now true without qualification.
- A cost, accepted: an intent can no longer put a decision into a built
  repo on its own authority. The operator gates it. For a document that
  exists to tell that repo's contributors why their code is about to
  change, that is the right owner.
- Both files this touches — `flywheel-loop-skills`' conductor section and
  `flywheel-schema-instructions`' tasks instruction — are mid-review in
  `bolt-flywheel-machinery` and fold it in without a new proposal.
- Rests on `decisions/blueprints-is-a-built-repo.md` and
  `decisions/every-handoff-is-a-bolt.md`, which together leave exactly one
  route into a built repo.
