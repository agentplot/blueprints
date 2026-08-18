# Decision: reads are across the batch, and the conductor chooses them

## Decision
A bolt conductor is accountable for one thing: that the batch it is about
to build is **buildable and internally coherent**. How it satisfies that is
its judgment. Nothing in the schema or the skills prescribes a read that
must always run.

Two corrections follow, and they are the shape of the mistake being fixed:

**Reads are across the batch, not per proposal.** The unit of reading is
the set of proposals a bolt is carrying, because the defects that actually
occur are relational — a rule compressed in one record and carried into
several proposals, a naming collision spanning two, a proposal requiring a
form of a rule its sibling correctly does not state, a positive
specification living in a shared source that four proposals cite and none
restates. A reader holding one proposal cannot see any of those. Five
per-proposal reviews across five rounds saw none of them.

**Reads are instruments, not steps.** The skills name what a read can be
for and what each is good at catching; they do not compose a sequence a
conductor executes. Naming three kinds and requiring all three produces a
liturgy — and a liturgy is performed rather than judged, which is how five
rounds of a well-specified review missed a defect none of them was asked
about.

Kinds worth naming, as instruments:

- **fidelity** — does this match the sources it cites. What review mode
  `agent` already declares, and what it is good at.
- **buildability** — could an agent holding only this and the repo produce
  the right file. Ask where it would stall, guess, go hunting, or do the
  wrong thing confidently.
- **coherence** — do these proposals agree with each other and with the
  decisions they cite. Only visible across the batch.

The `review` column in a bolt's registry keeps its narrow meaning: a
declaration that a particular row wants the operator's eyes. It is not a
statement that a mandatory read type has been performed.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/spec-driven-construction.md`
- Produced by: the operator's word, correcting this conductor's first
  version of the record: reviews should be across proposals, and "we don't
  want to be overly prescriptive implying that the conductor must always
  run a review of a certain type — that's probably the mistake."
- The first version made a buildability read a mandatory per-proposal
  build step. It fixed the wrong half: the read was right and mandating it
  per proposal reproduced the error it was meant to cure.

## The finding that produced it, which stands
`bolt-flywheel-machinery` read its only approved proposal as a builder
holding nothing but `tasks.md` and the repo. Six defects, two of which
would have produced a **wrong file** rather than a slow one: the section's
shape, content order, and actor table existed only in `design.md` while
`tasks.md` cited that file four times without naming the section carrying
the spec; and the actor roster was never listed, so a builder derives it
from `ls .claude/agents/` — the exact mirror two other tasks forbid,
yielding five profiles for four actors and reintroducing a defect three
rounds had removed.

Its author's diagnosis, which is why review structurally could not find it:

> "The deletions were specified late, under review pressure, against text
> that already existed; the addition was specified first, in prose, against
> text that did not. The checking groups grew around the addition and are
> excellent at catching what must not appear — which is why nothing caught
> that what MUST appear was never written down here."

Review pressure hardens the **negative** checks, because negatives are what
a reviewer is good at. The **positive** specification is the part nobody is
adversarial about, so it stays wherever it was first written and never
migrates into the file a builder holds. The corollary: **the more rounds a
proposal survives, the worse this skews.** Rounds do not converge on
buildability; they converge away from it.

## Consequences
- `flywheel-construction` describes the three kinds and what each catches,
  and states that choosing among them is the conductor's judgment against
  its accountability for the batch. It prescribes no sequence and no
  mandatory read.
- `flywheel-bolt`'s instructions stop implying a required review type. The
  `review` column means the operator's eyes are wanted on a row, nothing
  more.
- Nothing here reopens the loop closed by
  `decisions/the-run-replaces-the-review.md`. A read is one pass with no
  verdict and no bounce; it patches a spec or it finds nothing. The
  prohibition is on rounds, and a conductor reaching for an instrument once
  is not a round.
- Proposals that write **new files from scratch** carry buildability risk
  disproportionately, having no existing text to anchor against. Worth
  naming as a heuristic for where a conductor spends a read, not as a rule
  about when it must.
- Strengthens `the-run-replaces-the-review.md` by supplying its mechanism:
  rounds harden the wrong half of a spec, so closing the loop was right for
  a reason neither the operator nor this conductor had at the time.
- A row whose tasks cannot produce the right file is not approved, whatever
  a reader concluded about its claims. Unapproving and re-speccing such a
  row is the re-spec branch of the operator's directive, not a reopening.
