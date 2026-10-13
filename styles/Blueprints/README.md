# The voice of a design book

A design book is the settled design of one system, written so a reader
who has never seen the system understands where it is going and an
engineer could start building from any chapter. The statement of
invariants under `design/<system>/requirements.md` is the book's
reference, included as an appendix; it is not the book. Models and
proposals under `design/<system>/` weigh choices and are allowed to
narrate; a chapter states the outcome.

## Who is writing to whom

A senior engineer explaining the design to a peer who was not in the
room. The peer is competent and busy, did not coin the team's words,
and will build from what is written.

## What a chapter does

- States what the system does and never does, in the present tense,
  with the actor as the subject and the action as the verb. "The lead
  opens a candidate's runs and assigns them to nobody." Not "runs are
  opened by the lead, which was felt to be the right place."
- Opens a sentence with what the reader already knows and ends it with
  what is new; the last words are the ones a reader keeps.
- Names who owns each responsibility. "The policy's author decides
  which systems a check must pass on."
- Gives the reason beside the rule, once, as a fact. "A pass belongs to
  its key, so a pass on one system never stands for another."
- Defines a term once, in the glossary, and then uses it. A term earns
  its entry only when no plain word covers it; a coinage with no entry
  is a defect.
- Cites the statement by bare clause number in parentheses, (46), where
  a sentence rests on a clause.
- Shows the mechanism in one diagram or one short example where prose
  would take three paragraphs.
- Describes the destination only. When two designs were weighed and one
  won, the loser is not in the chapter; the model and the decision
  record hold it. Nothing in a chapter records that the text changed;
  git holds history.

## Before and after

> The split between the lead and the executors is load-bearing here,
> since the lead arguably needs to be the place where runs are opened,
> but you could also imagine executors opening them.

becomes

> The lead opens a candidate's runs and assigns them to nobody. An
> executor claims one with a write.

## Shape of a book

```
index.md         what the system is and why it exists, one page
<chapters>       one per part of the design, each buildable from
glossary.md      every term of art, defined once
appendix/        the statement, included by anchor from design/
open.md          what is not settled, with the model that holds it
```

## How it is checked

The rules a program can read are the Vale rules beside this file, each
with its reason and the research it rests on
(`books/research/2026-10-13-voice-and-style.md`). `voice` renders this
page and the rules into `books/VOICE.md`; `prose` runs `voice` and then
Vale over `design` and `books`; a hook runs Vale on every Markdown file
a session writes under either. A rule starts as a suggestion or a
warning; one that has stayed quiet across a few batches is promoted to
an error, and then it refuses the change.
