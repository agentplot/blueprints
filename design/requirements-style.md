# A statement of invariants

Call it **a statement of invariants**, short form **the statement**.
The invariant is the unit of the form, so it belongs in the name, and
mechanism-freedom is not a second idea but the test that a candidate
clause is an invariant of the design rather than a fact about one
implementation. `flywheel-next/requirements.md` already calls itself a
statement ("The statement is in three parts"), so the short form needs
no teaching. That file is the worked example throughout, and every good
example below is quoted from it.

## 1. What it is for

Every clause states one thing that is always true of the system, or one
thing the system never does. Nothing else is a clause. The statement is
the set of those, ordered so a person can read them, and written to
admit any model that satisfies them. That is the whole discipline: a
clause that rules out a design you have not thought of is over-tight,
and the cause is almost always that it fixed a mechanism instead of an
invariant. Its reader is a model that does not exist yet, a person or
an agent about to design the thing, not a builder verifying a change.

|  | the statement | OpenSpec |
|---|---|---|
| reader | a model not yet designed | a builder verifying one change |
| unit | a numbered clause carrying one invariant | `### Requirement:` with SHALL sentences |
| scenarios | apart, in a conformance suite, citing clause numbers | `#### Scenario:` nested under the requirement |
| structure | one flat file, parts by abstraction | capability directories, one specification each |
| change | the clause is rewritten in place; its number never moves | ADDED / MODIFIED / REMOVED deltas, archived at landing |
| checking | a person reads it; the suite cites it | a tool validates it |
| mechanism | named only in the givens and the third part | named freely; it is the change being built |
| when | before there is a design | once there is one |

Both are wanted, for different moments. The statement is what a design
is derived from; OpenSpec is what a built thing is checked against. A
statement written in OpenSpec's shape bakes the author's solution into
the requirements and the model never gets a chance.

## 2. The three parts

The parts are levels of abstraction, and only the first is always
present.

1. **What must hold of the thing itself.** Required. The invariants of
   the system considered on its own, with nothing outside it named.
   Divided into lettered sections by concern, and usually the bulk of
   the file.
2. **What the system needs from the world.** Optional, and warranted
   only when the system has seams to an environment it does not own:
   storage, a network, a host, another service. Written as the few
   operations it asks for and the guarantee each must give, and as the
   rule that binds those abstract names to something real.
3. **How the world provides it.** Optional, and only meaningful when
   the second part exists. One section per way the second part is
   satisfied, each naming real tools and mapping every operation to how
   that way satisfies it.

A system with no seam, a calculation, a format, a protocol, has only
the first part, and inventing the other two for it produces ceremony
with nothing in it.

Flywheel's statement is the worked instance:

| the part | Flywheel calls it | what it holds |
|---|---|---|
| what must hold of the thing itself | Part A, the data plane | the objects, their machines, the claims and the ledger, the signals, the rail, the engine |
| what the system needs from the world | Part B, the state store contract | seven operations, five guarantees, and the rules binding evidence and effect names to a profile |
| how the world provides it | Part C, the profiles | the tracker profile, the git-only profile, a custom profile |

The names in the middle column are Flywheel's, chosen because storage
is the seam it has. A statement whose seam is a network or a scheduler
names its second part after that.

## 3. The shape of the document

One flat file, in this order.

1. **Title and preamble.** What the statement is, what its parts are,
   and the mechanism rule stated in the open so a reader can hold you
   to it.
2. **Purpose.** One paragraph on what the system is for.
3. **Actors.** A table, one row per actor, columns *may decide* and
   *may not*. This is what stops a later clause from quietly granting
   the machinery authority that belongs to a person.
4. **Vocabulary.** The objects, one entry each, a definition and
   nothing else, prefaced with "Terms are defined by meaning. A model
   may add terms; it may not redefine these."
5. **The three parts**, as section 2 above.
6. **Global invariants.** Labelled `I1` onward; one that holds only
   under a profile says so. Not a different kind of statement from a
   clause: these are the few whose scope is the whole system rather
   than one concern, gathered so a model can be checked against them at
   a glance.
7. **Non-goals.** What the statement declines to cover.
8. **Environment givens.** Constraints of the world, not design
   choices. See section 6.
9. **Questions the model must answer.** Where the modeller's judgment
   is wanted, marked as not requirements.
10. **Scenarios the model must satisfy.** Numbered `S1` onward, stated
    as what the operator experiences.
11. **What to deliver.**

The conformance scenarios themselves live beside the model, never in
the statement. Each cites the clauses it exercises in a `satisfies:`
list, and the suite's check fails when a number names no clause or a
clause is cited by nothing. That closes the loop between rule and test
without nesting either inside the other.

## 4. Rules for a clause

**R1. Every clause is an invariant.** Something always true, or never
done. A clause describing a sequence of events, a phase of work, or a
thing that is true for now is not one.

- Bad: "First the operator approves the proposal, then the machinery
  creates the work items."
- Good: 36. "A unit is proposed as one document the operator reads
  whole. Approval turns it into work items; nothing before approval
  creates work items."

**R2. Name no mechanism in the first two parts.** No label, column,
queue, loop, guard, file, path, field, service or tool. This is the
test for R1: if the sentence would stop being true under a different
implementation that kept every promise the system makes, it was never
an invariant of the design, only of the build you had in mind.

- Bad: "A chore is a GitHub issue in the chores milestone, worked by an
  agent in a multiplexer pane on the bolt's branch and merged by a
  squash commit."
- Good: 60. "A chore is a unit of the chore type: no change directory,
  one stage, one session scoped to the repository and line of work the
  fix belongs on — a bolt's line when it was raised there, the shared
  line otherwise — and merged there by the machinery."

**R3. One clause, one invariant.** Sentences may be several; invariants
may not.

- Bad: "A session may offer a finding at any time, it should make small
  fixes inside its own job rather than offer them, and updating agent
  instructions is a chore."
- Good: three clauses, 58, 59 and 61, each cited on its own thereafter.
  61 alone reads "Updating agent instructions, citations, references,
  and similar housekeeping are chores, not units."

**R4. A definition is a glossary entry; an invariant is a clause.** If
the sentence only tells the reader what a word means, it is not a
clause.

- Bad, as a clause: "A finding is an idea a session has while doing its
  job that it judges worth the operator's consideration but outside its
  job."
- Good: that sentence is the glossary entry for **finding**. The clause
  says what must hold of one. From 58: "Neither is work until the
  operator says so, and neither interrupts the session that offered
  it."

**R5. Constrain the outcome, never the procedure or the shape.**

- Bad: "Each host polls the tracker every thirty seconds for work whose
  conditions are met."
- Good: 130. "Notification only shortens the wait: a host that is never
  notified still converges by reading."
- Bad: "Every object's state is stored in one record per object under a
  state directory."
- Good: 76. "For every state an object can be in, the model names
  exactly one source of truth that proves it. Other places that reflect
  the state are projections, written from the source, never read as
  truth."

**R6. Present tense, and the strong words where they are meant.** Never,
always, only, exactly one, at most one. An invariant hedged with
"generally" or "where possible" is not one.

- Bad: "The machinery should generally avoid interrupting sessions that
  are currently working, where possible."
- Good: 71. "The machinery never interrupts a session that is working.
  Anything it must tell a session waits until the session is idle."

**R7. No scenario inside a clause.** Given/when/then belongs in the
suite.

- Bad: "137. The response takes effect once. *Given* two deliveries of
  one reply, *when* the second arrives, *then* no second transition
  fires."
- Good: 137 states the invariant alone, and scenario S1 carries
  `satisfies: [1, 6, 13, 24]` and replays the duplicate delivery.

**R8. A clause is checkable.** A reader must be able to say of a
candidate model that it does or does not satisfy this one. A clause
that no model could fail is a paragraph of the preamble in disguise.

## 5. Numbers, inserts, citations and renaming

**Numbers are identifiers, not an order.** A clause keeps its number
for the life of the statement, because scenarios, proposals, machine
files and model chapters all cite it by number.

**A new clause takes the next free number in the whole file** and is
placed in the section where it reads best. Numeric order inside a
section is not maintained and should not be restored: A.7 ends at 197,
A.14 carries 195, A.15 carries 215.

**A clause that must be read immediately beside an existing one takes a
lettered insert**: 93a and 93b follow 93, 193a follows 193. Use a
letter only for that reason. Reaching for one merely because the new
rule is about the same topic fills the file with 93c through 93k.

**An amended clause is rewritten in place.** The statement always reads
as one coherent current intent. What changed lives in the proposal that
changed it and in git, never in the clause as an annotation.

**A withdrawn clause's number is retired and never reused.**

**Cite by bare number in parentheses** at the point an earlier
invariant is leaned on: "the machinery performs it with its effects and
records it (4)". State an invariant once and cite it thereafter. One
stated twice will one day be stated two ways.

**Renaming a term: one word, one meaning, everywhere.** When a word is
wanted for two things, rename one and rewrite every occurrence, leaving
no alias. If a surface must still show the displaced word, that is a
clause about rendering, not a second glossary entry. So **instance** is
the word every clause uses, while a clause fixes *flywheel* as the
customer's word for the same thing on every surface.

## 6. Givens and the third part: where the technology goes

The givens section holds two kinds of thing, and marking which is which
is its whole value.

- **A constraint of the world.** "Design books are markdown books in a
  git repository." A model may not contradict it, and a clause may lean
  on it.
- **A default of the stack**, introduced as "the rest of the stack,
  which a model builds on unless it says why not": the multiplexer, the
  chat, the book renderer. A model may displace one by saying why.

The third part is where a given becomes a binding, one section per way
the world provides what the second part asks for. The test that it is
doing its job is stated at the head of it: "Parts A and B do not change
to admit a profile." If adding a second way forces an edit in the first
two parts, then one of them fixed a mechanism, and the fix belongs
there rather than in the new profile.

## 7. When the author already has a solution

This is the normal case, not a failure. Write the invariant the
solution satisfies, then put the solution where it can be argued with.

- A way the world provides something goes in the third part, as one
  profile.
- A tool the world has already fixed goes in the givens, marked as a
  constraint or as a displaceable default.
- A choice you have made and want defended goes in a proposal file
  beside the statement, whose clauses are ratified into the statement
  when the operator rules on them.

The check: hand the first two parts to a reader who has never seen your
code. If they cannot arrive at a design different from yours and still
satisfy every clause, then a clause carries your solution and should be
loosened until they can.

## 8. The prompt

Paste this to an agent together with a description of the product.

```
Write a statement of invariants for <product>.

Every clause states one thing that is always true of the system, or one
thing the system never does. Nothing else is a clause. Write the set to
admit any model that satisfies it: a clause that rules out a design
neither of us has thought of is over-tight, and the cause is almost
always that it fixed a mechanism instead of an invariant. Its reader is
a model that does not exist yet.

What is fixed, and may be named only in the givens section and in the
third part: <what is fixed>. Everything else is the model's to choose.

Before writing any clause, come back to me with two things and stop:
(1) an actor table, one row per actor, columns "may decide" and "may
not"; (2) a glossary of the objects, one entry each, a definition and
nothing else. Ask me whatever you need to get those right. I will
correct them, and every clause you then write uses only those words.

The statement has up to three parts, in levels of abstraction:
(1) what must hold of the thing itself, required, in lettered sections
    by concern, naming nothing outside the system;
(2) what the system needs from the world, only if it has seams to an
    environment it does not own: the few operations it asks for and the
    guarantee each must give, plus the rule binding those abstract
    names to something real;
(3) how the world provides it, only if (2) exists: one section per way,
    naming real tools, with a table mapping every operation of (2) to
    how that way satisfies it.
Name the parts for this system's own subject matter. If there is no
seam, write only (1) and say so.

Document shape, one flat markdown file in this order: title and
preamble; purpose in a paragraph; the actor table; the glossary; the
parts above; global invariants labelled I1 onward, being the handful
that hold at every moment across every section; non-goals; environment
givens; questions you want my judgment on; numbered scenarios S1 onward
stated as what the operator experiences; what to deliver.

Rules for a clause, and for parts (1) and (2) especially:
- Every clause is an invariant: always true, or never done. A sequence
  of events, a phase of work, or a thing true for now is not one.
- Name no mechanism in parts (1) and (2): no label, column, queue,
  loop, guard, file, path, field, service or tool. This is the test of
  the rule above: if the sentence would stop being true under a
  different implementation that kept every promise the system makes, it
  was never an invariant. A reader who has never seen any code must be
  able to design from those parts alone. Real tools are named only in
  the givens and in part (3), where naming them is the point.
- One clause, one invariant. One to three sentences, present tense, in
  the strong words where you mean them: never, always, only, exactly
  one, at most one. Nothing hedged with "generally" or "where
  possible".
- A definition is a glossary entry; an invariant is a clause. If a
  sentence only says what a word means, move it to the glossary.
- Constrain the outcome, never the procedure or the shape.
- Every clause is checkable: I must be able to say of a candidate model
  that it satisfies this one or does not.
- No given/when/then inside a clause. Scenarios go in the scenarios
  section and cite clause numbers.
- Number clauses in one sequence across the whole file. Numbers are
  stable identifiers, so nothing is renumbered later; a clause inserted
  beside an existing one takes a lettered number (93a).
- Cite earlier clauses by bare number in parentheses. State each
  invariant once and lean on it thereafter.
- One word, one meaning. If two things want the same word, rename one
  and say so in the glossary.

If you have a solution in mind, write the invariant it satisfies as the
clause and put the solution in part (3) as one way, or in the givens.
Anything you are unsure of goes in the questions section rather than
becoming a clause.
```

The first target is **Switchboard Kit**. Chuck supplies the product
description; the point of putting it through this prompt is to state
what Switchboard Kit must always do and never do without naming AWS or
any cloud anywhere in the first two parts, so a model can propose a
solution unprejudiced by the one already in mind. What is fixed goes in
`<what is fixed>` and lands in the givens, and the cloud that is
presumed today becomes one way in the third part, where a second can be
set beside it and compared.
