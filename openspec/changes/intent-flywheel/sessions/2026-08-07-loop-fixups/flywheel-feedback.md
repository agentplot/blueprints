# Flywheel feedback — organized

Sections A–D are changes to the machinery, E is consolidation, F is testing,
G is a verification list. Items marked **[landed]** went in on 2026-08-06 and
are here only so the shape can be checked against what was meant.

Two themes run through most of this and are pulled out first: **agent-to-agent
messaging** (A) and **dynamic workflows driving the conductor loop** (B). Most
of the review-procedurality questions turn out to be answered by B.

---

## A. Agent-to-agent messaging

### A1. Transport exists for every leg but one; the envelope exists for none

**What is defined today.** The transport is stated consistently everywhere:
`herdr agent prompt <name>` when the target is running,
`inbox/<date>-<from>-<slug>.md` when it is parked. It appears in both loop
skills, both conductor profiles, dispatch's profile, and `openspec/config.yaml`.

| leg | defined? | where |
|---|---|---|
| design session → its intent conductor | yes | `flywheel-inception` |
| construction agent → its bolt conductor | yes | `flywheel-construction` |
| bolt conductor → dispatch | yes | `flywheel-construction`, for design-level findings and out-of-scope work |
| bolt conductor → intent conductor | yes | `flywheel-construction`, the merge step: report each landed handoff so the intent's task is checked off |
| anyone → any conductor | yes | "prompt its conductor or write to its `inbox/`" |
| **intent conductor → dispatch** | **no route found** | — |

The intent conductor has no documented way to reach dispatch. Dispatch's own
profile describes relaying *inner-loop* escalations outward, and the intent
conductor asks the operator directly with `AskUserQuestion`, so the leg may be
deliberately absent rather than missing. Needs a decision either way.

### A2. Define the envelopes

Transport is defined; **payload is not**. Nothing says what a message contains,
what terminology it uses, or what the receiver is obliged to do with it.

A conductor processing input from its charges — sub-conductors, session agents,
construction agents — is **routing**. The dispositions are:

1. **Respond to the sending agent.**
2. **Extend the bolt** with a standardized new task — e.g. a new proposal added
   to the registry.
3. **Extend the intent** with a standardized new task — e.g. a new decision or
   design task.

Define an envelope schema per disposition so agents use the right terminology
rather than inventing it per message. This is also where the report-length rule
belongs: a message is a shaped object, not an essay.

---

## B. Dynamic workflows drive the conductor loop

The dominant change. It supersedes the "how procedural is review" framing
entirely — review depth stops being a rule in prose and becomes a property of
the workflow and the bolt type.

### B1. The core move

- **Dynamic workflows control the logic a conductor uses when it loops over its
  task list** — both the bolt conductor and the intent conductor.
- **The text that drives the dynamic workflow lives in the schema
  instructions**, not in the skills.

### B2. Multiple bolt-type schemas

Replaces the single `flywheel-bolt` schema:

| schema | character |
|---|---|
| `bolt-opsx-default` | the standard path |
| `bolt-opsx-chore` | simpler, less review |
| `bolt-planned-tasks` | no opsx — just a Claude plan |
| `bolt-opsx-fast` | may have reviews; designed to do one thing and merge |
| `bolt-opsx-deep` | extensive reviews and testing |

This answers three earlier open questions at once — see D3.

### B3. What makes the workflow dynamic: OpenSpec queries piping tasks in

The workflow is not a fixed script. It reads the change's own state through
OpenSpec queries and fans out over what comes back.

- **In an intent:** three proposal handoffs → "for each proposal handoff,
  follow these steps."
- **In a bolt:** three proposals to write and work → first step is *"give me the
  list of proposals that can be worked on now with no dependencies."* Maybe two
  of the three come back. Each of those goes through planning and construction.
  Then loop again and pick up the third, now that its dependencies are built.

Dependency-aware fan-out, re-queried each pass, rather than a fixed batch.

### B4. Merge-back is the conductor's, inside the workflow

Merging a construction branch back to the bolt branch should **not** be the
apply agent's job. It belongs in the conductor's dynamic-workflow logic.

*(Today the apply agents do the merge-backs and the conductor does only the
final landing on main.)*

### B5. Marketplace skills as workflow extensions

`ponytail` and `simplify` are popular marketplace skills that could come in as
**extensions via dynamic workflows**. The smell/integrity check in C3 is a case
of the same idea.

---

## C. The persona-driven construction loop

A case of B, not a separate mechanism — the persona review is one lens the
dynamic workflow can run, and B3 is the general shape it sits inside.

### C1. Build the persona matrix

A matrix of **repos × agent profiles for user personas**, spanning who actually
uses these systems:

- a data scientist using a CLI
- an upstream library developer doing an SDK integration
- a DevOps engineer who needs to test or deploy

### C2. The sequence

1. Write `proposal.md` **first**.
2. Persona review against it — each proposal read from each persona's
   perspective, suggesting updates. Make the updates.
3. Fast-forward.
4. Construction.
5. Code review and adversarial review **after**.

### C3. Smell check and rip cord

An integrity or smell check comparing the work against other parts of the
codebase. **If the smell is big enough, the conductor pulls the rip cord and
notifies for a human review.** Could parallelize, or run `simplify`.

### C4. Persona agents exercise the application

When all construction and reviews are done, start a fable agent **per persona**.

- Ground each agent in the intent.
- Ask it to exercise the application the way its persona would.
- Two kinds of finding come back:
  - **New questions or opportunities** the intent does not yet define → pushed
    back into the intent. *(Open: arguably these should have been defined by the
    intent already — is their appearance a signal the intent was incomplete?)*
  - **Missing or incorrectly implemented functionality** that does not line up
    with the intent → the agent writes new proposals through the
    proposal-writing agent, and the workflow runs again.

---

## D. The machinery as it stands

### D1. Every delegated agent is a herdr agent

**[landed, partly]** `conduct`'s content is now inside `flywheel-inception` and
`flywheel-construction`, each with a bundled `reference/herdr.md`, and both
state the never-use-the-`Agent`-tool rule.

**Open: the five session-type skills did not get it** — `flywheel-review`,
`flywheel-interactive`, `flywheel-prototype`, `flywheel-research`,
`flywheel-writeback`. Should all skills carry the reference, or does inheriting
it from `flywheel-inception` (which every session profile already loads) cover
them?

Also open: should `conduct` be retired outright, or kept as the non-flywheel
playbook?

### D2. Skill frontmatter — investigate

Load the `skill-creator` skill and work out what frontmatter a skill can set.
Specifically:

- Should some of these skills be **forked** rather than shared?
- Should the **agent type be declared as frontmatter in the skill itself**,
  rather than the charge naming a profile and a skill separately?

This bears on D1: if a skill can declare its agent type, the profile/skill
pairing rules in `flywheel-inception` get simpler.

### D3. Structural questions — now answered

Recorded as decisions rather than questions.

| question | answer |
|---|---|
| Should bolt types be different schemas? | **Yes** — the five in B2. |
| Should merging the bolt branch back be the conductor's? | **Yes**, in the conductor's dynamic-workflow logic, not the apply agent's (B4). |
| Does a code review replace or outweigh the spec review? | **Neither.** The bolt types balance it, and the dynamic workflow gives finer control. |
| Is "no re-review after fixes" absolute? | **No** — driven by the dynamic workflow. |
| Do agents need to respond to their work item by ID? | still open — bears on A2's envelopes |
| Should `bolt/proposals.md` be one file per proposal? | still open — see G2 |

### D4. Certain edits skip the proposal path

**[landed]** Three named direct edits: `CLAUDE.md`, ADRs, and the loop's own
machinery where the change is small and self-evident. Confirm the list is right;
it is currently three items and closed.

### D5. The audit log — ideas requested

The ask was to keep an audit log instead of taking notes in `tasks.md`. The
"`tasks.md` is orchestration steps only" half landed; the log itself does not
exist. Ideas, as requested:

**The case against a new file.** Three audit trails already exist and none is
being read:

- **Git history** — commits by pathspec, one per artifact change, already
  mandated. With the commit-subject rule now in place these are readable.
- **The conductor's herdr pane transcript** — a real file on disk, complete,
  searchable, and it costs nothing to produce. The retrospective was built
  entirely out of these.
- **The `proposals.md` state ladder** — every row's forward-only progression is
  already a record of what happened to it.

**What actually went wrong** was not a missing log. It was reasoning with
nowhere to go, so it went into `tasks.md` and was re-read every turn. That is
answered by the rule that already landed: reasoning belongs in the decision
record or in the report.

**If something is still wanted, the cheapest version** is not prose. Add
timestamps to the registry's state transitions — the ladder becomes a log for
free, stays machine-shaped, and is never re-read as narrative. A separate
`log.md` would be a fourth trail nobody reads, and an append-only file in the
change directory would be re-read at every turn start like `tasks.md` was.

**Recommendation: no audit log.** Timestamp the state ladder if a record of
sequencing is genuinely needed.

---

## E. Consolidation into the flywheel repo

- The context map app moves into the flywheel repo.
- The book skills are embedded in the flywheel.

---

## F. Testing the flywheel itself

- A fast, local eval.
- A merge end-to-end, scripted in herdr, run for real against a contrived data
  project.

---

## G. Verification list

1. The handoff from an intent to a bolt gets marked complete once the proposals
   exist in the bolt.
2. Confirm the requirement to track proposals as individual files was actually
   added. *(Still an open decision — D3.)*
3. When dispatch creates an intent, the open questions are resolved immediately
   and communicated back to the user.
4. Design sessions get run via dynamic workflows.

---

## Terminology

**"open questions"** is the term, replacing "fog", going forward.
