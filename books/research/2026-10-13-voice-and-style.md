# Voice and style for the design books: what the field says

Research for the house voice, read on 2026-10-13, so the Vale rules under
`styles/Blueprints` rest on something more than taste. Each rule links
to the section here that justifies it.

## 1. Who the books are for

A senior engineer explaining a settled design to a peer who was not in
the room. That is the register the Willdan books fixed, and nothing
read here argues against it. It is not the register of product
documentation. Google's guide asks for a conversational, friendly voice
addressed as "you" (Google, Voice and tone); Microsoft's asks for
contractions and "write like you speak" (Microsoft, Top 10 tips). Both
write to a user doing a task. A design book writes to a builder reading
a destination, and a builder reads for structure, not warmth. What both
guides say beyond warmth does carry over, and is taken below.

## 2. Clarity: characters as subjects, actions as verbs

Williams (*Style: Toward Clarity and Grace*, with Bizup in later
editions) gives the one test that explains most unclear technical
prose: a sentence is a story about characters doing things, and it reads
clearly when the characters are the grammatical subjects and the actions
are the verbs. Nominalizations, nouns made from verbs ("the formation of
a candidate" for "sluice forms a candidate"), push the action out of
the verb, and the subject becomes an abstraction. His diagnostic: if the
subject is not a character, or the reader waits more than six or seven
words for the verb, rewrite. Long sentences are allowed when subject and
verb line up with character and action.

Three more of his lessons bear on chapters. Cohesion: open a sentence
with what the reader already knows and end it with what is new.
Emphasis: the last words of a sentence are the ones a reader keeps, so
put the point there. Concision: cut words that say nothing, pairs that
say one thing twice, and phrases that a word replaces.

Rules: `Nominalization` (the common "the X of" forms, a suggestion),
`Passive` (a suggestion: the passive hides the character), `ThereIs`
(a sentence that opens with "there is" has no character),
`SentenceLength` (a suggestion at 35 words, since Williams allows long
sentences that line up).

## 3. Plain English is for experts too

GOV.UK's guidance answers the objection that a specialist audience does
not need plain English: research on readers with the highest literacy
found they still prefer it, because they have the most to read and
grasp it faster. The Project Delivery style guide adds the limit that
matters here: plain English does not mean dropping specialist terms;
a word with a precise meaning is the right word, used and explained
once. That is the glossary rule: a term of art is defined once and then
used; a coinage with no definition is a defect.

Rules: `Jargon` (structural metaphors with no definition: lane, rung,
spine, the bar), the glossary rule in the README.

## 4. What the documentation guides contribute

From Google's highlights: active voice so the actor is clear; sentence
case for headings; never announce future features in documentation,
which for a design book becomes: a chapter describes the destination
and names what is unbuilt as unbuilt, in one place. From Microsoft's
top ten: get to the point, lead with what matters; revise weak writing,
which names "there is" and "there are" and asks that a statement start
with a verb or its subject; prune every excess word.

Rules: `Headings` (sentence case), `ThereIs`, `Filler`,
`ThroatClearing`.

## 5. The linters' word lists

Vale's public packages were read for what a design book can borrow.

- **write-good** (`Weasel`, `Passive`, `ThereIs`, `TooWordy`,
  `Cliches`, `So`, `Illusions`, `E-Prime`). `Weasel` is taken, trimmed
  of words a design uses precisely ("several", "various", "largely"
  stay out of the list; "clearly", "obviously", "extremely", "quite",
  "very", "fairly", "relatively", "significantly", "substantially",
  "surprisingly", "interestingly" are in). `ThereIs` is taken. `Passive`
  is taken as a compact rule rather than the package's list of
  participles. `TooWordy` is not taken: it bans "implement",
  "monitor", "requirement", "validate" and "modify", which are this
  book's words.
- **proselint** (34 rules). `Hedging` is three phrases and is covered by
  this style's `Hedges`. `CorporateSpeak` is taken whole. `Hyperbole`
  and `Very` overlap with `Hype` and `Filler`. The rest are typography,
  dates, bias and spelling, which belong to a different gate.
- **Google** and **Microsoft** packages. Each enforces its own guide
  whole: contractions wanted, "you" wanted, "we" banned, a word list of
  product usage. The parts that transfer are already rules here; the
  packages are not adopted, so the voice stays one voice.
- **Readability**, **alex**, **Joblint**: metrics, inclusive language
  and job posts. Not adopted now; `alex` is the one to add if the books
  ever read as a public face.

Packages are not pulled by `vale sync`, which needs the network at
check time. The rules taken are copied into `styles/Blueprints` with
their source named in `link`, so a check is the same offline and in a
job.

## 6. What a chapter never does, and where it came from

The ban lists came from the Willdan books' voice section, which grew
from reading chapters that had gone wrong: hedges where the writer
knew; emphasis words asking the reader to care; adjectives that sell;
metaphors in place of reasons; narration of the designing; throat-
clearing; and structural jargon no glossary defined. Each is a rule,
and the voice section's before-and-after is the README's example.

## 7. Sources

- Google developer documentation style guide: Voice and tone
  (developers.google.com/style/tone); Highlights
  (developers.google.com/style/highlights).
- Microsoft Writing Style Guide: Top 10 tips for style and voice
  (learn.microsoft.com/en-us/style-guide/top-10-tips-style-voice);
  Welcome (learn.microsoft.com/style-guide).
- Joseph M. Williams and Joseph Bizup, *Style: Lessons in Clarity and
  Grace*; the Yale-NUS teaching guide "Grammar, Style, Actions,
  Characters"; Antoine Buteau's summary of the lessons.
- GOV.UK, Writing for GOV.UK
  (gov.uk/guidance/content-design/writing-for-gov-uk); Government
  Project Delivery style guide on specialist language.
- Vale: package list (vale.sh/hub), rule keys (docs.vale.sh/topics/styles);
  errata-ai/write-good and errata-ai/proselint on GitHub.
- Martin Fowler, Architecture Decision Record (martinfowler.com/bliki):
  a record is written once and superseded, never edited, which is the
  book's "git holds history" rule applied to decisions.
