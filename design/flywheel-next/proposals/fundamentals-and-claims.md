# Fundamentals, and the claim shape as a given

Three rulings that belong together, because each of them is about the
line between what the flywheel fixes and what an instance may change.

OpenSpec is a given of the design, like git. The shape of a claim is
core; the schemas, instructions and skills that say what goes into one
are extensible. Claims are statements about the destination and never
about a piece of work, so a unit cites the coarse claim it serves or
cites none at all, and the units that landed citing none are read in
one batch on the review surface. And the mechanism-free requirements
statement, the thing this file's own
requirements are written in, is a part of every book. It is produced
like any other chapter, with the claims included under the clauses they
make checkable.

## 1. OpenSpec is a given

The preamble says Parts A and B name no mechanism and that real tools
are named only in section 9 and in Part C. That has not been true for
some time. Clause 97 names OpenSpec, 203 names the OpenSpec changes and
the change directory an intent creates, 213 names the OpenSpec
artifacts every object opens, and the glossary names OpenSpec in
**claim**, **as-built** and **blueprints repository**. Clause 185 names
Conventional Commits, 187 names a change directory, and A.18 names
pull requests.

None of this is a leak to be plugged. Git is a given of the world and
the clauses lean on it freely: a line is a branch, a place is a
worktree, a landing is a merge. OpenSpec is a given in exactly the same
sense. It is how the blueprints and every built repository already
carry proposed changes and archived specifications, section 9 already
says so, and no model of the flywheel is free to displace it. The
preamble should say what the clauses do, rather than the clauses
pretending to a purity the design never wanted.

What the ruling adds is a tier. Since claims-as-specs, the *claim
shape* is what every machine, atom and proof reads: a requirement block
with a stable name and at least one scenario; a change directory
holding one delta per capability; an archive at landing that merges the
deltas into the standing specifications; the content hash of the block
as its version; the `Claim:` line naming the served claim on the built
side. Those five facts are core in the sense of 223. The claim
machine's states are which tree holds the requirement, the ledger
compares a hash to a hash, and the archive effect is what makes a claim
standing. An instance that changed any of them would be running a
different flywheel.

What is extensible is what goes *into* a block: the schemas a
deliverable must satisfy, the instructions that shape what a session
writes, and the skills that produce it (88, 119, 120, 190). Those are
already files an instance adds or overrides under its prefix, and that
is the whole surface an instance needs. A second change or
specification format beside OpenSpec is not a goal, and saying so is
what stops the claim machine from growing a format parameter it would
never be given a second value for.

## 2. The unclaimed unit

Clause 34 lets work reach a bolt without an intent: the operator's
dictation naming a bolt is applied directly, and a planning judgment
may route an ask, a finding or a signal to a unit on an open bolt.
Clauses 60 and 61 make chores units of the chore type, and 61's
examples, being instructions, citations, references and housekeeping,
are exactly the work no claim will ever be written for. Clause 64 says a
chore *may* satisfy a claim. Clause 99 says construction never
satisfies a claim it does not name.

Between them, nothing says whether a unit that cites no claim is legal,
and nothing says what happens after one lands. The model has already
decided it is legal and reads 64 as its licence: `deliverables.yaml`
drops the verdict entry "for a unit whose claims are empty (64)",
`context.yaml` repeats the rule for the chore type, and `gaps.md`
records it as ruling 8. The requirements should grant what the model
relies on.

### What a claim is coarse enough to be

The pressure the loop creates is toward writing a claim for every piece
of work, and that is the failure to design against. A claim is a
statement about the destination, never about a piece of work. Three
tests settle it.

A claim survives a rewrite of the code. "The deploy button is blue" and
"the release pipeline runs the lint step third" do not; they name a
colour and a pipeline step, and a rewrite that keeps every promise the
system makes would falsify both. A statement naming a file, a colour, a
setting, a plugin or a step of a pipeline is not a claim.

A claim has an observer: someone who would want to know if it stopped
holding. Nobody wants to be told the lint step moved. Someone wants to
be told that a deploy from the main line stopped being one automated
step.

A claim is judgeable from the repository alone. That is 100's
requirement read backwards: an agent must be able to look at the
repository and say satisfied or not. A statement that needs a running
system, a person's memory or another team's word is not a claim.

The requirements already carry the brake, and it is worth stating in
the instruction so a session feels it. Every claim in scope is judged
once for every repository that joins the fleet (104), and re-judged
whenever its text moves or a challenge lands against it (101). A
granular claim therefore costs a verdict per repository, forever. The
cost of writing one is a sentence; the cost of keeping one is a
standing obligation on the ledger.

### Citation, not creation

Small work connects to a coarse claim by citing it, not by growing a
claim of its own. A unit or chore proposal cites the standing claim in
scope it serves when one exists, and cites nothing when nothing fits.
It never proposes a claim for the work.

Chuck's four cases, worked:

- **Change some button colours.** No claim. Nothing in the destination
  moved, and no standing claim covers a colour.
- **Modify `CLAUDE.md`.** Housekeeping, a chore by 61, and no claim.
- **Add a plugin to the `.claude` settings.** Housekeeping likewise. A
  setting is not a statement about the destination.
- **A small change to the build pipeline.** Cites the deployment claim
  if one stands in scope, something like "a deploy from the main line
  is one automated step". If no such claim stands, it cites nothing,
  and the batch at 3 below is where the operator decides whether the
  claim was missing.

When a chore citing a claim lands, that claim's verdict is re-judged,
which is what 64 already grants and what makes citation worth
anything. The matching is cheap because the standing claims in scope
are already in the session's inputs (89, 102). If matching starts to
feel hard, that is not a gap in the instruction: it is the signal that
the claim set has grown too granular and wants merging.

### The offer, batched on the review surface

An unclaimed unit is invisible to everything downstream: it produces no
as-built statement, so 102's backlog never sees it, and no verdict, so
the ledger has no cell for it. Some of that work genuinely wants a
claim written after the fact, such as a behaviour shipped by dictation
that nobody will remember to state, and most of it never will.

So the question is asked, but not one unit at a time. Raising a rail
decision per landed chore would put a stream of low-value questions in
front of the operator and teach them to answer "no" without reading,
which is exactly how a claim that mattered gets lost. It belongs on the
review surface (122), which already works by accumulation: what changed
since the operator last reviewed, read in one sitting.

The review view therefore lists the units that landed citing no claim
since the last review, under one question: is anything here worth a
claim. *Yes* on a unit opens the normal path, attaching its change to
an intent where a claim is written by an elaboration like any other
(23, 97). *No* is recorded against that unit, on the pattern of the
not-applicable verdict (101), so the unit is never listed again.
Nothing waits on the answer; every unit in the list has already landed.

## 3. The fundamentals part of the book

A blueprints repository carries three layers, and they have been
running together.

**Claims** are OpenSpec requirement blocks in the standing
specifications. A claim is the ledger's unit of tracking: it is scoped
to repositories, it has at least one scenario saying how one would know
it holds, and a verdict is stored per repository against it. A claim
exists to be checked.

**The book** is the prose that explains: chapters, diagrams and
samples, with claims included by anchor where a chapter explains one
(97). The book exists to be understood.

**The fundamentals** are a mechanism-free requirements statement of
what the system fundamentally is and what must always hold, written as
numbered clauses in the style of `design/requirements-style.md`. It
exists to be designed from. It is what a model that has never seen the
code reads before proposing anything.

The third is a part of the book, not a fourth artifact. It is produced
by writing elaborations like any other chapter, under a default
instruction (120, 190) that says to write the destination as numbered,
mechanism-free clauses instead of as narrative, and the blueprints
template ships the skeleton (208) so every book has the part whether or
not anything has been written into it yet.

The positioning, stated once:

- A clause says what must always hold, in language a person judges.
- A claim is the clause the flywheel checks, per repository.
- A claim is included by anchor immediately after the clause it makes
  checkable.
- A clause need not yield a claim. Many constrain the shape of the
  model rather than a behaviour a repository can be judged against.
- A claim may cite the clause it serves in its prose. The machinery
  never reads the citation; it is for the person.

### How it reads

A fragment of the fundamentals part for the flywheel itself, in
`fundamentals/a8-state-and-evidence.md` of the book:

```markdown
## A.8 State and evidence

75. Every object's state is derivable from durable stores at any
    moment. Nothing held only in a process's memory decides behavior
    after that process restarts.

{{#claim state/derivable-after-restart}}

76. For every state an object can be in, exactly one source of truth
    proves it. Other places that reflect the state are projections,
    written from the source, never read as truth.

77. A state is never proven by two stores that disagree. Where two
    could disagree, the model names which one decides and what the
    other is for.
```

The preprocessor renders the include in place from
`openspec/specs/state/spec.md`:

```markdown
### Requirement: derivable after restart
The engine's decision about an object's state SHALL be a function of
what the durable stores hold at the moment it reads them, and of
nothing a process retained across a restart. Serves clause 75.

#### Scenario: a host is killed mid-flight
- **WHEN** a host is killed while a work item is between stages
- **AND** a fresh host starts with an empty disk
- **THEN** the fresh host reaches the same state for that item as the
  killed host held
```

Clauses 76 and 77 carry no claim. Neither names a behaviour a
repository could be judged to satisfy or not; they constrain how a
model is built, and a verdict against them would be a category error.
Clause 75 does name one, so it has a claim under it and every
repository tracked gets a cell for it.

## Clauses

**Preamble**, replacing the third paragraph.

> Parts A and B name no mechanism the model is free to choose: no
> labels, columns, queues, loops, guards, files or services. Two things
> of the world they do name freely, because section 9 fixes them and no
> model may displace them: git, and OpenSpec as the change and
> specification format. Every other real tool is named only in section
> 9 and in Part C, where naming them is the point. A reader who has
> never seen the current code should be able to design from Parts A and
> B, git and OpenSpec alone.

**223a (new, A.27).**

> The claim shape is core (223). A requirement block with a stable name
> and at least one scenario, a change directory holding one delta per
> capability, an archive at landing that merges the deltas into the
> standing specifications, the content hash of the block as its
> version, and the `Claim:` line naming the served claim on the built
> side are what every machine, atom and proof reads, and no instance
> changes them. The format that carries the shape is OpenSpec, a given
> (section 9), and a second format beside it is not a goal (section 8).
> What is extensible is what goes into a block: the
> schemas a deliverable must satisfy, the instructions that shape what
> a session writes, and the skills that produce it (88, 119, 120, 190)
> are files an instance adds or overrides under its prefix like any
> other extensible file.

**Section 8, one further non-goal.**

> - A second change or specification format beside OpenSpec.

**34a (new, A.5).**

> A unit's proposal cites the standing claims in scope it serves,
> which are already among its inputs (89, 102), and cites none when
> none fits. A unit may therefore cite no claim: it carries a type, a
> bolt and its dependencies like any other (34), and its change is
> written and landed like any other, but it produces no as-built
> statement and no verdict, and the ledger has no cell for it. This is
> a case of 99, not an exception to it: construction that names no
> claim satisfies none. A unit never proposes a claim for its own work;
> claims are written on the design side (23, 97), and small work
> connects to a coarse claim by citing it. A chore citing a claim makes
> that claim's verdict due again when it lands (64).

**317 (new, A.16).**

> The review surface (122) carries the units that landed citing no
> claim (34a) since the operator last reviewed, as one list under one
> question: is anything here worth a claim. Answering yes for a unit
> attaches its change as material to an intent, open or proposed, and
> the claim is written there by the normal path (23, 97); the unit
> itself is not reopened. Answering no is stored against that unit, as
> a not-applicable verdict is stored once against a claim (101), and
> that unit is never listed again. Every unit in the list has already
> landed, so nothing waits on the answer.

**120**, adding two clauses to the sentence listing the defaults in
force.

> …make every session that settles a design conclusion write the
> chapter that explains it and the claim it adds or amends in the same
> commit; make every session that writes or amends a claim write it at
> the granularity of the destination, so that a claim survives a
> rewrite of the code, has an observer who would want to know if it
> stopped holding, and is judgeable from the repository alone (100),
> and so that no statement naming a file, a colour, a setting, a plugin
> or a step of a pipeline is written as a claim; make every session
> that writes or amends a claim update the system context map so the
> map stays current; make every session whose conclusion is about what
> the system fundamentally is write it into the fundamentals part as
> numbered, mechanism-free clauses (318); and make every construction
> session cite the standing claim in scope its work serves, cite none
> when none fits, and never propose a claim for its own work (34a).

**190**, adding one deliverable to the shipped set.

> …The flywheel ships a default set, versioned as one thing: book
> chapter, claim, context map, conceptual and logical diagrams in a
> house style, proposal document, surface specification, fundamentals
> part, verdict.

**318 (new, A.16).**

> The fundamentals part is a part of the book: a mechanism-free
> requirements statement of what the system is and what must always
> hold, written as clauses numbered in one sequence across the part.
> A clause says what must always hold in language a person judges; a
> claim is the clause the flywheel checks per repository, included by
> anchor immediately after the clause it makes checkable (97). A clause
> need not yield a claim, and a claim's prose may cite the clause it
> serves, which the machinery never reads. Its schema is the style of
> `design/requirements-style.md`; its producer is a skill like any
> other deliverable's (190); changing either is a chore (123).

**208**, adding the part to what the template ships.

> The blueprints template, the built-repository template, the map
> schema and derivation table (198, 199), the fundamentals part's
> skeleton (318), and the shipped skills and deliverables (190) are one
> versioned set released with the flywheel.

## What changes where

| where | change |
|---|---|
| requirements preamble | the third paragraph, as above: git and OpenSpec are named givens |
| requirements 34a, 223a, 317, 318 | new, as above |
| requirements 120, 190, 208 | amended, as above |
| requirements section 8 | one non-goal added |
| requirements section 10 | strike "Are claims OpenSpec requirement blocks included by anchor, or fenced claim blocks with a hash lock?", which `claims-as-specs.md` answered |
| `model.md` 8.1 | add the core/extensible line: the five facts of the claim shape are core, the schemas, instructions and skills over a block are extensible |
| `model.md` 8 | a subsection for the unclaimed unit: citation not creation, no cell, no as-built row, and the batched offer on the review surface |
| `model.md` 12 | the fundamentals part as a deliverable, and how its clause numbers relate to claim names |
| `machines/unit.yaml` | `claims` may be empty; a landing with an empty `claims` marks the unit for the review batch, and a chore citing a claim makes that claim's verdict due (64) |
| `machines/ledger-cell.yaml` | no cell exists for a unit that names no claim; the "no claim needed" record is on the unit, not the ledger |
| `machines/atoms.yaml` | one atom for the stored "no claim needed" answer, on the pattern of the not-applicable verdict |
| `profiles/deliverables.yaml` | a `fundamentals-part` entry, store `book`, fed to the design types; the verdict drop for empty claims already reads as 34a and gets the citation |
| `profiles/blueprints.yaml` | the fundamentals part's path under the book's `src/`, shipped as a skeleton by the template |
| `profiles/context.yaml` | the session types fed the fundamentals part in force, beside the surface specification; the claim-granularity instruction among the defaults every design type carries |
| `surfaces.md` | the review view gains the unclaimed-units list with its one question; a unit shows whether a claim was captured, declined, or neither yet; the book viewer renders a fundamentals chapter with its included claims |
| conformance | a scenario for two units landing with no claim, both listed in one review, one answered no, and a later review that lists neither |

## Open

- Whether a clause number in a book's fundamentals part is stable the
  way `requirements.md` numbers are. **Recommended yes**, under the
  same rule: numbers are identifiers that claims, scenarios and
  chapters cite, a new clause takes the next free number in the part,
  and a clause that must be read beside an existing one takes a
  lettered insert (93a). A book whose clause numbers move is a book
  whose citations rot.
- Whether the unclaimed-units batch is also offered when a repository's
  first planning runs (104). That planning already judges every claim
  in scope once, so it is the one other moment the operator is thinking
  about the whole claim set for a repository, and a joining repository
  arrives with a history of landed work that no claim covers.
- Whether the fundamentals part is one part per book, or one per
  bounded context on the map. One per book is assumed above and is
  what the template ships; a large blueprints repository covering
  several contexts may want the second.
