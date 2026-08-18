# Decision: the gate is one approval per release batch, and the conductor never idles on it

## Decision
The conductor drives continuously. An unblocked Writeback task is spawned
as a session without asking anyone — writeback is books and the map, which
is the conductor's own scope. An unblocked Handoff task is prepared to the
point of one decision: the proposals batched, the bolt named, the repos and
merge criteria drafted into a release document. Then the gate is **one
approval covering the whole batch**, and the release document rides the
**desk channel**: a plannotator round over the document, where the
operator reads and annotates the batched proposals, the merge criteria,
the repo list, and the bolt-type choice presented explicitly — because a
release plan is a document, and the channel table routes margin notes on a
document that already exists to the desk. `AskUserQuestion` remains the
stand-in only where there is genuinely nothing to read.

Asking is not waiting: the conductor opens the round and keeps working on
everything the release does not gate.

The gate authorizes release. It is not a meeting, a status report, or a
reason to stop. A conductor that has unblocked work and is waiting for the
operator to raise the subject is malfunctioning.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/conducting.md` (to be rewritten)
- Produced by: the operator's word, given directly to this conductor after
  it reported a frontier of seven unblocked handoffs and three unblocked
  writebacks and then waited: "i guess i don't understand why we're not
  checking off tasks. are you saying that you are waiting on some approval
  from me? this seems like a gap … i think when handoff and writeback tasks
  are not blocked it's your job to queue or batch those up as new herdr
  opus sessions. you can get approval from me with askuser tool (for now,
  discord when we hook up that HIL channel)."
- He also named the shape of the confusion: the task list mixes tasks that
  drive the intent loop through design sessions with tasks that spawn
  handoff and writeback work, and the skill reads as though both wait on
  the same human moment.
- Amended 2026-08-10 on the operator's channel feedback, via dispatch:
  "There was an actual release plan for bolts and I was shown that in an
  AskUserQuestion, which was a lot less user-friendly than it would have
  been in a plannotator screen." This record first routed release to the
  sentence cell of the channel table and said the gate is explicitly not
  a plannotator round — a reading it now reverses: a release plan reads
  as margin notes on a document that exists, and the handoff rule was the
  one clause contradicting the table.

## Consequences
- `flywheel-inception`'s conductor section is rewritten around driving
  rather than around permission: Design tasks spawn design sessions,
  Writeback tasks spawn writeback sessions, Handoff tasks are batched and
  gated in one approval per batch. The handoff-is-a-request paragraph
  keeps its rule — the conductor never writes a bolt change — and loses
  its implication that the conductor waits to be asked.
- The gate's channel follows `decisions/human-loop-channels.md` by answer
  shape: the release document is a desk round, with the bolt-type choice
  explicit inside it (→ `decisions/bolt-type-is-the-operators-choice.md`).
- Batching is the unit: one round covers every releasable proposal, and
  the conductor does the naming and drafting before asking, so the
  operator answers rather than designs.
- Carrying the amendment into the machinery is construction — the handoff
  skill, the release-request shape, and `flywheel-intent`'s
  `apply.instruction` ("the approval is asked for inline"). Released by
  the operator 2026-08-10 into bolt-plugin-shape as a new row, sequenced
  after skills-shed. (This bullet first asserted a "release-request row"
  that never existed on that registry — a state claim written without
  reading it, corrected here the same day the bolt refuted it.)
- `flywheel-intent`'s `tasks` instruction states which task types wait on
  a human and which do not — today it defines the types without saying
  that only Handoff has a gate. (The count is three, not the four this
  record was written against: `adr-is-a-handoff.md` retired the ADR type,
  leaving Design, Writeback, Handoff.)
- The two design-session profiles and the writeback session type all carry
  the never-idle line, since the conductor's failure here was reasoning
  from the skill it had read.
- Rests on `decisions/blueprints-is-a-built-repo.md`, which drew the
  session/construction line this decision puts in motion, and on
  `decisions/every-handoff-is-a-bolt.md`, which the gate still guards.
