# A mechanism-free requirements statement

The name to use is **a mechanism-free requirements statement**, short
form **the statement**. The short form is not coined here:
`flywheel-next/requirements.md` already calls itself one ("The
statement is in three parts"), so nothing new has to be taught, and a
freshly minted term would be a second name for a thing the house
already names. "Mechanism-free" carries the one rule that makes the
form different from every other requirements form, so it belongs in the
full name. That file is the worked example throughout, and every good
example below is quoted from it.

## 1. What it is for

The statement says what must be true of any model of a system, in words
the operator can judge, and says nothing about how. Its reader is a
model that does not exist yet: a person or an agent about to design the
thing, not a builder verifying a change. The statement is written to
admit any model that satisfies it, which is the whole discipline. A
clause that rules out a design you have not thought of is over-tight,
and the cause is almost always a mechanism hiding in it.

|  | the statement | OpenSpec |
|---|---|---|
| reader | a model not yet designed | a builder verifying one change |
| unit | a numbered clause carrying one rule | `### Requirement:` with SHALL sentences |
| scenarios | apart, in a conformance suite, citing clause numbers | `#### Scenario:` nested under the requirement |
| structure | one flat file in three parts by abstraction | capability directories, one specification each |
| change | the clause is rewritten in place; its number never moves | ADDED / MODIFIED / REMOVED deltas, archived at landing |
| checking | a person reads it; the suite cites it | a tool validates it |
| mechanism | named only in the givens and Part C | named freely; it is the change being built |
| when | before there is a design | once there is one |

Both are wanted, for different moments. The statement is what a design
is derived from; OpenSpec is what a built thing is checked against. A
statement written in OpenSpec's shape bakes the author's solution into
the requirements and the model never gets a chance.

## 2. The shape of the document

One flat file, in this order.

1. **Title and preamble.** What the statement is, what the three parts
   are, and the mechanism rule stated in the open so a reader can hold
   you to it.
2. **Purpose.** One paragraph on what the system is for, in the
   operator's words.
3. **Actors.** A table, one row per actor, columns *may decide* and
   *may not*. This is what stops a later clause from quietly granting
   the machinery authority that belongs to a person.
4. **Vocabulary.** The objects, one entry each, a definition and
   nothing else, prefaced with "Terms are defined by meaning. A model
   may add terms; it may not redefine these."
5. **Part A, the data plane.** What must hold of the things
   themselves, in lettered sections by concern (`A.6 Findings and
   chores`). The bulk of the file.
6. **Part B, the contract to the environment.** The few operations the
   system needs from outside itself and the guarantee each must give,
   as `B.1 The operations` and `B.2 The guarantees`, then the rules
   binding abstract names to a profile.
7. **Part C, the profiles.** One section per way that contract is
   satisfied, each with prose, a table of one row per Part B operation,
   and clauses of its own.
8. **Invariants.** The handful that hold at every moment, labelled `I1`
   onward; one that holds only under a profile says so.
9. **Non-goals.** What the statement declines to cover.
10. **Environment givens.** Constraints of the world, not design
    choices. See section 5.
11. **Questions the model must answer.** Where the modeller's judgment
    is wanted, marked as not requirements.
12. **Scenarios the model must satisfy.** Numbered `S1` onward, stated
    as what the operator experiences.
13. **What to deliver.**

The conformance scenarios themselves live beside the model, never in
the statement. Each cites the clauses it exercises in a `satisfies:`
list, and the suite's check fails when a number names no clause or a
clause is cited by nothing. That closes the loop between rule and test
without nesting either inside the other.

## 3. Rules for a clause

**R1. One clause, one rule.** Sentences may be several; rules may not.

- Bad: "A session may offer a finding at any time, it should make small
  fixes inside its own job rather than offer them, and updating agent
  instructions is a chore."
- Good: three clauses, 58, 59 and 61, each cited on its own thereafter.
  61 alone reads "Updating agent instructions, citations, references,
  and similar housekeeping are chores, not units."

**R2. Name no mechanism in Part A or Part B.** No label, column, queue,
loop, guard, file, path, field, service or tool.

- Bad: "A chore is a GitHub issue in the chores milestone, worked by an
  agent in a multiplexer pane on the bolt's branch and merged by a
  squash commit."
- Good: 60. "A chore is a unit of the chore type: no change directory,
  one stage, one session scoped to the repository and line of work the
  fix belongs on — a bolt's line when it was raised there, the shared
  line otherwise — and merged there by the machinery."

**R3. A definition is a glossary entry; a rule is a clause.** If the
sentence only tells the reader what a word means, it is not a clause.

- Bad, as a clause: "A finding is an idea a session has while doing its
  job that it judges worth the operator's consideration but outside its
  job."
- Good: that sentence is the glossary entry for **finding**. The clause
  says what must hold of one. From 58: "Neither is work until the
  operator says so, and neither interrupts the session that offered
  it."

**R4. Say what must hold, not how to make it hold.** The mechanism is
the model's to choose; constrain the outcome instead.

- Bad: "Each host polls the tracker every thirty seconds for work whose
  conditions are met."
- Good: 130. "Notification only shortens the wait: a host that is never
  notified still converges by reading."

**R5. Require a property of the model, not a shape you have in mind.**

- Bad: "Every object's state is stored in one record per object under a
  state directory."
- Good: 76. "For every state an object can be in, the model names
  exactly one source of truth that proves it. Other places that reflect
  the state are projections, written from the source, never read as
  truth."

**R6. Present tense, and the strong words where they are meant.** Never,
always, only, exactly one, at most one.

- Bad: "The machinery should generally avoid interrupting sessions that
  are currently working, where possible."
- Good: 71. "The machinery never interrupts a session that is working.
  Anything it must tell a session waits until the session is idle."

**R7. No scenario inside a clause.** Given/when/then belongs in the
suite.

- Bad: "137. The response takes effect once. *Given* two deliveries of
  one reply, *when* the second arrives, *then* no second transition
  fires."
- Good: 137 states the rule alone, and scenario S1 carries
  `satisfies: [1, 6, 13, 24]` and replays the duplicate delivery.

**R8. A clause is checkable.** A reader must be able to say of a
candidate model that it does or does not satisfy this one. A clause
that no model could fail is a paragraph of the preamble in disguise.

## 4. Numbers, inserts, citations and renaming

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

**Cite by bare number in parentheses** at the point an earlier rule is
leaned on: "the machinery performs it with its effects and records it
(4)". State a rule once and cite it thereafter. A rule stated twice
will one day be stated two ways.

**Renaming a term: one word, one meaning, everywhere.** When a word is
wanted for two things, rename one and rewrite every occurrence, leaving
no alias. If a surface must still show the displaced word, that is a
clause about rendering, not a second glossary entry. So **instance** is
the word every clause uses, while a clause fixes *flywheel* as the
customer's word for the same thing on every surface.

## 5. Givens and Part C: where the technology goes

The givens section holds two kinds of thing, and marking which is which
is its whole value.

- **A constraint of the world.** "Design books are markdown books in a
  git repository." A model may not contradict it, and a clause may lean
  on it.
- **A default of the stack**, introduced as "the rest of the stack,
  which a model builds on unless it says why not": the multiplexer, the
  chat, the book renderer. A model may displace one by saying why.

Part C is where a given becomes a binding, one section per profile. The
test that Part C is doing its job is stated at the head of it: "Parts A
and B do not change to admit a profile." If adding a second profile
forces an edit in A or B, then A or B had a mechanism in it, and the
fix belongs there rather than in the new profile.

## 6. When the author already has a solution

This is the normal case, not a failure. Write the constraint the
solution satisfies, then put the solution where it can be argued with.

- A way of keeping or serving state goes in Part C as one profile.
- A tool the world has already fixed goes in the givens, marked as a
  constraint or as a displaceable default.
- A choice you have made and want defended goes in a proposal file
  beside the statement, whose clauses are ratified into the statement
  when the operator rules on them.

The check: hand Parts A and B to a reader who has never seen your code.
If they cannot arrive at a design different from yours and still
satisfy every clause, then a clause carries your solution and should be
loosened until they can.

## 7. The prompt

Paste this to an agent together with a description of the product.

```
Write a mechanism-free requirements statement for <product>.

It states what must be true of any model of the system, in words the
operator can judge, and nothing about how. Its reader is a model that
does not exist yet. Write it to admit any model that satisfies it: a
clause that rules out a design neither of us has thought of is
over-tight, and the cause is almost always a mechanism hiding in it.

What is fixed, and may be named only in the givens section and in Part
C: <what is fixed>. Everything else is the model's to choose.

Before writing any clause, come back to me with two things and stop:
(1) an actor table, one row per actor, columns "may decide" and "may
not"; (2) a glossary of the objects, one entry each, a definition and
nothing else. Ask me whatever you need to get those right. I will
correct them, and every clause you then write uses only those words.

Document shape, one flat markdown file in this order: title and
preamble; purpose in a paragraph; the actor table; the glossary; Part
A, the data plane, in lettered sections by concern; Part B, the
contract to the environment, being the few operations the system needs
from outside itself and the guarantee each must give; Part C, the profiles,
one section per way that contract is satisfied, each with a table of
one row per Part B operation; invariants labelled I1 onward; non-goals;
environment givens; questions you want my judgment on; numbered
scenarios S1 onward stated as what the operator experiences; what to
deliver.

Rules for Parts A and B:
- They name no mechanism: no label, column, queue, loop, guard, file,
  path, field, service or tool. A reader who has never seen any code
  must be able to design from them alone. Real tools are named only in
  the givens and in Part C, where naming them is the point.
- One clause, one rule. One to three sentences, present tense, in the
  strong words where you mean them: never, always, only, exactly one,
  at most one.
- A definition is a glossary entry; a clause is a rule. If a sentence
  only says what a word means, move it to the glossary.
- State what must hold and what must never happen, never how to bring
  it about.
- Every clause is checkable: I must be able to say of a candidate model
  that it satisfies this one or does not.
- No given/when/then inside a clause. Scenarios go in the scenarios
  section and cite clause numbers.
- Number clauses in one sequence across the whole file. Numbers are
  stable identifiers, so nothing is renumbered later; a clause inserted
  beside an existing one takes a lettered number (93a).
- Cite earlier clauses by bare number in parentheses. State each rule
  once and lean on it thereafter.
- One word, one meaning. If two things want the same word, rename one
  and say so in the glossary.

If you have a solution in mind, write the constraint it satisfies as
the clause and put the solution in Part C as one profile, or in the
givens. Anything you are unsure of goes in the questions section rather
than becoming a clause.
```

The first target is **Switchboard Kit**. Chuck supplies the product
description; the point of putting it through this prompt is to state
what Switchboard Kit must do without naming AWS or any cloud anywhere
in Parts A and B, so a model can propose a solution unprejudiced by the
one already in mind. What is fixed goes in `<what is fixed>` and lands
in the givens, and the cloud that is presumed today becomes one profile
in Part C, where a second profile can be set beside it and compared.
