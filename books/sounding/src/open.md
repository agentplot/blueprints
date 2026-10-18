# Open questions

What the design does not settle, and where each question is held. A
question leaves this page when the operator rules; the ruling lands in
the design, and the chapter that rests on it is rewritten whole.

## sounding's statement

sounding's statement of invariants, `design/sounding/requirements.md`,
is being written from the capture design (`design/capture/plan.md`,
step Q1), while the operator rules decision 11 below. It states the
question and its sources, the place, the three exits, the stop check,
the timebox, rounds, the operator's decision, and what sounding never
does.
A fresh model then reconstructs sounding from the statement alone, and
the operator rules the questions it asks.

The statement becomes this book's appendix, and the chapters cite its
clauses by number. Until it lands, the chapters rest on the capture
design, `design/capture/design.md`, and cite Flywheel's statement,
whose elaboration gains a clause saying it runs on sounding (58, 62).

## The decision awaiting a ruling

The capture design's decision 11 awaits the operator's ruling
(`design/capture/plan.md`, step D2). Each chapter states it as the
design has it.

11. sounding is a standalone tool that works one question in one
    session, in a worktree of its own, and ends on a conclusion the
    operator accepts, sends back or drops. millpond sends it an item
    that asks a question, an accepted conclusion is the item's record,
    and only a finding beyond the question comes back as a capture
    ([Deciding a conclusion](deciding.md)).

## Held by the design

The capture design's own Open section holds these questions about
sounding, beside the details it leaves to sounding's statement:

- **A standing sounding**, which stays open and starts a round when a
  signal on its subject lands, as Flywheel's standing elaborations do
  (25, 26).
- **Where else an accepted conclusion lives.** A repository may keep it
  in its own record, as crew's kits keep `openspec/explorations/`. With
  no inbox behind it, as when sounding runs on its own, this is where
  an accepted conclusion lives at all.
- **crew's two open records disagree.** crew ADR 0019 rests an
  elaboration on an intent and the `new-territory` move, and crew's
  `curation-and-agenda` change leaves intents out and replaces that
  move with `join`. A sounding sent from an item settles both, once
  crew's record says so (plan steps C1 and C6).

## A question's branch

The design names a sounding's branch twice over. flume names a place's
branch `<kind>/<name>`, which for the kind `question` gives
`question/<name>`. The design also names a sounding's branch
`sounding/<name>`, and the Claude Code plugin's guard refuses a sluice
submission from `sounding/*`. The chapters use `sounding/<name>`, as
the design's section on sounding does; flume's book holds the same
question ([flume's open questions](../flume/open.html#a-questions-branch)).

## Left to the statement

The capture design's Open section leaves sounding's own details to its
statement (plan step Q1). In full:

- the timebox's length, and who sets it;
- how a sounding is named, the `<name>` in its branch and its keys;
- where `question.md`, `conclusion.md` and `rounds/` sit in the
  worktree, and whether the session commits them on its branch;
- what the note the stop check accepts holds and where it is kept,
  what parks a sounding, and how a parked one resumes;
- what accept does to the worktree and the branch, and whether drop
  deletes the branch with the worktree;
- whether the work a conclusion proposes reads the sounding's branch
  when it is built;
- the `source`, `event_at` and raw material an offer's capture carries;
- which card `sounding ask` and a conclusion use when sounding runs on
  its own;
- whether a `--with-me` sounding has a timebox and a stop check, and
  how it ends;
- how the operator's notes in plannotator reach go on.
