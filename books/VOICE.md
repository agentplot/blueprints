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
  subject first. "The lead opens a candidate's runs and assigns them to
  nobody." Not "runs are opened by the lead, which was felt to be the
  right place."
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
  record hold it.

## What a chapter never does

- Hedge where the answer is known, or assert where it is not. An open
  question is named as one, in the book's open questions, not softened
  into prose.
- Narrate the designing: "we chose", "the rationale", "this section".
- Ask the reader to care: "critically", "it is worth noting".
- Sell: "elegant", "clean", "seamless", "powerful".
- Reach for a metaphor where a reason belongs: "load-bearing",
  "source of truth", "north star".
- Use structural jargon without a definition: "lane", "surface",
  "primitive", "the bar".
- Join two thoughts with an em dash or an exclamation. Each thought
  gets a sentence.
- Record that the text changed: no "previously", no "updated to", no
  struck-through text. Rewrite the section whole; git holds history.

## How it is checked

The rules above that a program can read are Vale rules under
`styles/Blueprints`, run by `prose` from the devenv shell or by `vale
design books` with Vale on the path. The narration and heading rules
bind chapters only, since a model is allowed to weigh and a proposal to
argue. A rule starts as a suggestion or a warning; one that has stayed
quiet across a few batches is promoted to an error, and then it refuses
the change. Nothing in a skill or a prompt restates these rules: a
session reads this page, and Vale reads the rest.

## Shape of a book

```
index.md         what the system is and why it exists, one page
<chapters>       one per part of the design, each buildable from
glossary.md      every term of art, defined once
appendix/        the statement, included by anchor from design/
open.md          what is not settled, with the model that holds it
```
