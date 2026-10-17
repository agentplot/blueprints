# Where questions come from

sounding works the same in four setups. The setup decides who asks the
question and where the operator decides the conclusion.

| Setup | Questions from | Conclusions decided on |
|---|---|---|
| **On its own** | the operator's `/sound` | a card, or sounding's herdr plugin |
| **With millpond** | items millpond sends; a key on a headwater release that needs judgment; `/sound` on a decision a meeting left open, its transcript a source | the same, recorded against the item |
| **With crew** | crew's planner and design agent, calling `sounding open` as crew calls millpond | crew's rail |
| **With Flywheel** | an intent's elaborations, each one a sounding | Flywheel's elaboration types, which write the conclusion into the design book and claims |

Moving from one setup to the next changes who asks and where the
operator decides. The question, the place, the exits and the shape of
a conclusion stay as they are.

## On its own

sounding needs no other tool. The operator opens a question with
`/sound` from any Claude Code session, the sounding works it in a
worktree of its own, and the conclusion comes back on a card or in
sounding's herdr plugin.

An offer still prints its contract lines, and sounding pipes them to
`millpond land` only where millpond is installed. Where an accepted
conclusion is kept with no inbox behind it is on
[Open questions](open.md).

## With millpond

millpond adds two ways in and a home for every conclusion.

- **An item that asks a question.** millpond's `send` takes a sounding
  as its target, and opens it with the item's signals and the captures
  they came from as its sources ([millpond's items](../millpond/items.html)).
- **A key on a headwater release that needs judgment**, such as a major
  release outside the range the repository declares.
- **`/sound` on a decision a meeting left open**, with the meeting's
  transcript as a source. eddy lists the meeting, and millpond keeps
  its capture ([eddy's book](../eddy/)).

The operator decides on a card or in sounding's herdr plugin, and the
decision is recorded against the item. On accept, millpond keeps the
conclusion as the item's record and makes an item of each piece of
work the conclusion proposes. Each offer lands through `millpond land`.

## With crew

crew's planner and design agent open a sounding for an item that asks a
question, calling `sounding open` as crew calls millpond: through its
command line, since crew's Python uses only the standard library
(`code.1`). Each conclusion shows on crew's rail, and the work an
accepted one proposes becomes entries in crew's plan.

A question crew works makes no elaboration worktree of crew's own: the
sounding's worktree is the question's place. A sounding rests on an
item where crew's elaboration rested on an intent (crew ADR 0019), so
the question comes from curation's `join` like any other piece of
work.

## With Flywheel

Each of an intent's elaborations is a sounding. An elaboration is one
session, one conversation, one place (24), and a sounding is one
question in one worktree, one session per round. The session's exits
are the same three:

| Flywheel's elaboration | sounding |
|---|---|
| finishing with deliverables (65) | `sounding conclude` |
| blocked on a question (65) | `sounding ask` |
| offering a finding (58, 62) | `sounding offer` |
| approval given once, never asked again (6) | one decision on each conclusion |

Flywheel's elaboration types stay Flywheel's. An elaboration's type
decides how it ends (25), and what it concludes is written to the
design book and its claims (187). sounding works the question, and the
type writes the conclusion where Flywheel keeps it.
