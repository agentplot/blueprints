# Flywheel next — requirements, all state in git

A statement of what the flywheel must do and what must always hold,
written to admit any model that satisfies it, under one added
constraint: every piece of durable state lives in git repositories, and
the only central service is the git host. There is no tracking system:
no issues, no milestones, no project board. It names no other
mechanism: no labels, columns, queues, loops, guards, files, or tools of
the current implementation. A reader who has never seen the current
code should be able to design from this alone.

## 1. Purpose

The flywheel turns an operator's intent into built software with the
operator spending their attention only where judgment is needed. It
runs design work that settles what to build, and construction work
that builds it, using AI agent sessions for the work and the operator
for the decisions. Everything it does is inspectable after the fact.

## 2. Actors

| actor | may decide | may not |
|---|---|---|
| **operator** | which intents are worth pursuing; whether a proposed piece of work starts; whether a standing session is finished; whether a thread of work is closed; whether an offered idea or chore is accepted; every answer to a question the machinery cannot answer itself | nothing is required of the operator for work that needs no judgment |
| **the machinery** | when to start, advance, finish and retire work whose conditions are met; what to offer the operator and when; what to record | it never invents work, never approves work, never closes a thread on its own |
| **an agent session** | how to do the one job it was given; what to report; whether to raise a question, offer a finding, or offer a chore | it never changes the state of anything outside its job; it never starts other work |
| **signal sources** (people, meeting transcripts, logs, user feedback, other tools) | nothing; they only supply raw material | |

## 3. Vocabulary

Terms are defined by meaning. A model may add terms; it may not
redefine these.

- **intent** — one thread of design work about one subject, pursued
  until the operator closes it. Intents are curated from signals; not
  every signal becomes an intent.
- **elaboration** — one unit of design work on an intent, worked by one
  free-flowing session. An elaboration has a **type**, and the type
  determines how it ends (see 5.4). An elaboration is the smallest
  thing the operator approves on the design side.
- **bolt** — one delivery of construction work to a built repository:
  it accumulates finished units and lands once, when the operator
  closes it.
- **unit** — one approved piece of construction work inside a bolt.
  Proposed as a single document the operator can read whole; once
  approved it is broken into work items.
- **work item** — one task of a unit, worked through construction
  stages by sessions, merged into the bolt when complete.
- **session** — one agent process working one job in one place, with a
  bounded goal and a fixed set of ways to end.
- **finding** — an idea a session has while doing its job that it
  judges worth the operator's consideration but outside its job.
  Offered, never acted on by the session.
- **chore** — a small fix a session judges necessary but cannot or
  should not do itself, because it lies across a repository or branch
  boundary or outside its job. Offered; if accepted, done by one agent
  scoped to the right place, with no further ceremony.
- **the plan** — the single surface where everything awaiting the
  operator's word is presented, and where the word is given.
- **curation** — the step that turns many raw signals into a few
  intents worth elaborating.
- **signal** — one raw piece of input from a source: an excerpt of a
  meeting transcript, a log observation, a piece of user feedback, a
  chat message, a session's finding about something outside its job.
  A signal is a record with a source and a date; it is never work and
  never a plan row on its own.
- **move** — curation's stored judgment on one signal: attach to an
  open intent, challenge a standing claim, join a proposed new intent,
  or drop, with a reason.
- **claim** — one statement in the design book of what is true at the
  destination: a boundary, an owner, a coupling, a store, an invariant,
  or a behavior. It has a stable name, a version that moves only when
  its text moves, at least one scenario saying how one would know it
  holds, and a scope. A claim is **proposed** while its intent is open
  and **standing** once the intent is closed.
- **as-built** — the record, kept with the built software, of what that
  software does as of all construction landed. Every as-built statement
  names the claim and claim version it serves.
- **verdict** — one stored judgment that a repository satisfies a claim:
  satisfied, partial, not satisfied, or not applicable, with the claim
  version and repository revision judged, the evidence, and the date.
- **ledger** — the verdicts, kept for every repository the flywheel
  tracks.
- **scope** — the repositories a claim applies to: all of them, a kind
  of repository, every repository declaring a capability, or named
  repositories.
- **state** — everything the machinery must remember between runs and
  share between hosts: objects, their states, ownership, verdicts,
  offers, and the operator's answers. State lives in git and nowhere
  else.
- **lease** — a host's recorded ownership of an object for a bounded
  time, renewed while the host works and expired by rule when it does
  not.

## 4. Requirements

Each requirement is a statement that can be shown true or false of a
model.

### 4.1 The operator's word

1. The operator gives their word in one place, the plan, and the word
   is applied exactly once.
2. The word can be given from a phone: a short reply in a chat
   channel, or a choice on a served page, are both sufficient for
   any decision. Anything needing more than a short reply is answered
   on the page.
3. The operator can also act directly on the state, by editing it and
   committing, and the machinery treats that commit as the word too.
4. Nothing the operator has not approved exists as work. Proposals may
   exist; work may not.
5. Approval given once is never re-asked, and never silently
   discarded. A given word that cannot be applied is reported.

### 4.2 The plan

6. The plan is derivable: at any moment its content is a function of
   the current state of the system, not of what any process remembers.
   If the machinery restarts, the same plan results.
7. The plan is always current. New material joins the standing plan;
   nothing waits for a next one. The operator who opens the plan sees
   everything that stands.
8. A plan row appears exactly when a decision becomes the operator's
   to make, and disappears when the decision is made or can no longer
   be made. The model must show, for every row kind, what creates it
   and what retracts it.
9. The row kinds are at least:
   - a proposed intent, with its proposed elaborations
   - a proposed unit breakdown for a bolt
   - a thread whose work is all done: close it?
   - a standing session that has gone idle: finish it, or keep it?
   - a finding offered by a session: pursue it (as an elaboration or
     unit), or drop it
   - a chore offered by a session: accept or reject
   - a question a session cannot answer itself
10. Rows are grouped so that "yes to all" is a meaningful answer for a
    simple plan, and any single row can be answered on its own.
11. The operator's own dictation ("add this idea", "do this chore")
    skips the plan and is applied directly.

### 4.3 Intents and curation

12. Signals arrive from many sources at many rates. Curation, not the
    elaboration machinery, decides which become intents. Curation may
    be a person, an agent, or both, and it may run outside the
    flywheel; the flywheel must accept its output.
13. An intent carries at most one elaboration awaiting approval at a
    time. New material for the intent joins that proposal.
14. An intent's close is proposed when all its elaborations are done,
    and only the operator closes it.
15. The output of design is the design book: the durable statement of
    the destination, as prose, diagrams and samples the operator can
    judge, and as claims the machinery can address. Sessions write the
    destination there; anything else they produce is a record, not a
    source of truth.

### 4.4 Elaborations and their types

16. An elaboration is one session, one conversation, one place. It is
    not split into many small sessions by the machinery.
17. Elaboration types differ in how they end, and the model must
    distinguish at least:
    - **self-closing**: research, writing, a throwaway prototype whose
      answer is a note. The session ends itself when its deliverable is
      written, and the machinery finishes the elaboration.
    - **standing**: an exploration, a prototype the operator wants to
      see running, an interactive page. The session stays alive after
      it goes idle. Idle is offered on the plan as "finish or keep";
      only the operator's word ends it.
    - **with-operator**: a back-and-forth the operator is in. The
      machinery neither ends it nor asks about it while the operator is
      present.
18. A standing session is never ended by the machinery because it is
    idle, because its work items are closed, or because a restart
    forgot it.
19. The type of an elaboration is chosen when it is proposed and can be
    corrected by the operator's word.

### 4.5 Construction

20. A unit is proposed as one document the operator reads whole.
    Approval turns it into work items; nothing before approval creates
    work items.
21. Work items advance through construction stages, each stage done by
    a session of that stage's kind. Which stages a bolt uses is a
    property of the bolt, chosen when it is created.
22. Several work items may be in flight at once. Merges into the bolt
    happen one at a time in a fixed order.
23. A bolt lands once, when the operator closes it, and only if every
    unit is finished. The close is proposed on the plan when that holds.
24. A landing that fails is reported and leaves the bolt open.

### 4.6 Findings and chores

25. A session may offer a finding at any time. A finding about the
    session's own intent or bolt is a proposal on the plan for that
    thread. A finding about anything else is a signal (4.15). Neither
    is work until the operator says so, and neither interrupts the
    session that offered it.
26. A session should make small fixes inside its own job rather than
    offer them. It offers a chore only when the fix lies outside what it
    may touch.
27. An accepted chore is done by one agent scoped to the right
    repository and branch, and is merged where it belongs, with no unit,
    no bolt, and no stages. A chore never creates a bolt.
28. Updating agent instructions, citations, references, and similar
    housekeeping are chores, not units.

### 4.7 Sessions

29. A session is given one job, one place, and a bounded goal. Inside
    the job it is free; its only outputs to the machinery are a fixed
    set of exits: done with deliverables, blocked on a question,
    offering a finding, offering a chore, stalled.
30. A session never moves the state of the machinery itself. It emits
    an exit; the machinery decides what the exit means.
31. The machinery never interrupts a session that is working. Anything
    it must tell a session waits until the session is idle.
32. Starting a session on a slow host may take a long time. The
    machinery treats a slow start as slow, not as failed; it retries;
    and it judges success by evidence that the session exists, never by
    the return of the command that started it.
33. Every action the machinery takes on a session is safe to repeat: a
    repeat of a completed action changes nothing.
34. A session that is not the operator's to keep is retired when the
    work it serves is retired, and its resources are released.

### 4.8 State and evidence

35. Every object's state is derivable from durable stores at any
    moment. Nothing held only in a process's memory decides behavior
    after that process restarts.
36. For every state an object can be in, the model names exactly one
    source of truth that proves it. Other places that reflect the state
    are projections, written from the source, never read as truth.
37. A state can never be proven by two stores that disagree. The model
    must say what happens when projections drift from the source.
38. Reading the same stores twice with nothing changed produces the
    same conclusion and no writes.

### 4.9 Observability

39. Every write the machinery makes is a commit, and the commit carries
    its reason and the evidence it was based on. History is the audit
    log; nothing else is kept for that purpose.
40. For every session, what was expected and what was delivered are
    both recorded, and the difference is the first thing a report shows.
41. Problems with the machinery itself are reported to the operator
    through this record, never filed as work.

### 4.10 The model as an artifact

42. The machines are defined as data in standalone files. The same
    definition is rendered into diagrams for people and executed by the
    machinery. The diagram cannot drift from the runtime.
43. The definition is testable without any live service: given a
    described state of the stores, the model's decisions can be
    asserted.
44. Adding an elaboration type, a construction stage, or a plan row
    kind is a change to the definition, not to the machinery's code.

### 4.11 Coexistence

45. The new flywheel runs beside the current one, against the same
    organization, without either interfering with the other. Its
    scope of objects is disjoint and explicit.

### 4.12 Claims, as-built, and the ledger

46. The chapter that explains a claim and the claim itself are one
    source. The prose, the diagram and the sample around a claim are
    what a construction session reads to know what the claim means;
    they cannot drift from it.
47. Only standing claims are planned against. Proposed claims are
    visible and never built.
48. Every as-built statement names the claim and claim version it
    serves. Construction never satisfies a claim it does not name.
49. Whether a repository satisfies a claim is a judgment made by an
    agent, not a computation, and it is stored as a verdict with the
    inputs it was made from.
50. A verdict is reused until its claim's version moves or its evidence
    is gone. A repository changing does not by itself invalidate a
    verdict. Not-applicable is a verdict like any other, so a scope
    judgment is made once.
51. A repository's construction backlog is derived from the ledger:
    every claim in scope with no satisfied or not-applicable verdict.
    It is never stored as a list.
52. A claim amended after construction named it reaches the operator as
    a choice: amend the open work, or let it land and follow it. The
    machinery never restarts or rewrites construction on its own.
53. A repository joining the fleet has an empty ledger. Its first
    planning judges every claim in scope once and offers the unsatisfied
    set as one proposal.
54. A claim's scope is part of the claim, chosen when it is written and
    corrected by the operator's word. A claim about a contract between
    two repositories is in scope for both, and each carries its own
    verdict.

### 4.13 State in git

55. All state is files in git repositories. The git host is the only
    central service. The model says which repositories hold state, how
    the files are laid out, and what one object's file looks like.
56. A change of state is a commit. A commit that reaches the shared
    branch is the fact; a commit that has not is a local intention.
    The model says which branch is shared and how a host learns that
    its commit landed.
57. Two hosts that try to change the same object at the same time
    cannot both succeed. The model states the rule that decides the
    winner and what the loser does. It may rely on the git host
    accepting one update to a branch at a time and rejecting the
    other.
58. Every object is owned by at most one host at a time, through a
    lease recorded in state. Ownership is taken by a commit that lands,
    renewed while the host works, and expires by a rule the model
    states. A host that goes away leaves its objects visibly stale;
    another host takes them over only when the lease has expired, never
    by racing.
59. A host that cannot reach the git host keeps working on what it
    already owns, commits locally, and reconciles when it reconnects.
    The model says what it may and may not do while disconnected.
60. Hosts learn of new state without reading the whole history each
    time. The model states how: a hook from the git host, a bounded
    poll, or a message, and what the latency bound is.

### 4.14 The status view

61. At any moment the operator can see every intent, elaboration,
    bolt, unit, work item and session with its current state, grouped
    by state: queued, in progress, waiting on the operator, done, and
    which host holds each, and whether that host is alive. This is a
    view of the whole, separate from the plan, and it needs no
    machinery running to be read.
62. The status view is derived from the state in git and nothing else.
    It is never a source of truth, and it is never written by hand to
    make it look right. The model says how it is built and served so
    that it is reachable from the phone.
63. Discussion about an object (a question asked, an answer given, a
    note left by a session) is part of the object's state, in git, and
    the status view shows it.
64. The operator's word from a phone becomes a commit. The model names
    the one writer that turns a short reply or a page choice into that
    commit, and how the operator can tell the commit landed.

### 4.15 Signals and curation

65. Signals are appended by adapters, one record per signal, at any
    rate. The machinery never reads a signal except through curation.
66. Every signal receives exactly one move, stored with the signal id,
    the target, the reason, and the date. Curation runs over signals
    with no move and never re-judges one that has a move.
67. Claims are the index curation clusters against. A signal either
    fits an open intent, argues with a standing claim, or fits no
    claim; the move follows from which.
68. A proposed intent from curation cites its signals and shows their
    weight: how many, from which sources, over what span. The operator
    sees one row per proposed intent, never a row per signal.
69. Curation is a session with a bounded job and the fixed exits of
    4.7, charged on a cadence or when unmoved signals exceed a
    threshold. It never opens an intent. A person writing the same
    records by hand is also curation.

## 5. Invariants

These hold at every moment, not just at the end of an operation.

- I1. No work exists without an approval that can be pointed to.
- I2. No approval is applied twice or lost.
- I3. Every plan row has exactly one creating condition and one
  retracting condition.
- I4. Every state has exactly one source of truth.
- I5. A working session is never interrupted by the machinery.
- I6. A standing session is ended only by the operator's word.
- I7. Restarting the machinery changes no state and no plan.
- I8. The machinery never creates a bolt for a chore.
- I9. Every as-built statement names a standing claim.
- I10. No verdict is recomputed while its inputs are unchanged.
- I11. Every object has at most one owning host, and the status view
  shows it.
- I12. No state exists outside git. A host's memory and disk hold only
  what git already holds or what is about to be committed.
- I13. Two commits that change the same object cannot both land
  without one having seen the other.

## 6. Non-goals

- Replacing the git hosting or the agent runtime.
- A tracking system. Issues, milestones and project boards may exist
  for people, but the machinery never reads or writes them.
- Multi-operator arbitration. One operator per organization.
- Scheduling across hosts for performance. Correctness first.
- A user interface beyond the plan page, the status view, and the chat
  reply.

## 7. Environment givens

Constraints of the world, not design choices.

- The repositories live on a git host that accepts one update to a
  branch at a time and rejects an update whose base is stale. It can
  call a URL when a branch moves, if configured. It offers no other
  service the machinery may depend on.
- Design books are markdown books in a git repository. Built software
  lives in git repositories with their own merge gates.
- The books' repository and every built repository already carry
  proposed changes and archived specifications in the OpenSpec change
  format, with an archive step that moves a change's specifications
  into the standing set. Which repositories the flywheel tracks is
  listed in a manifest in the books' repository.
- Agent sessions are terminal processes on one or more hosts the
  operator runs, started and observed through a multiplexer with an
  agent-aware API. Starting a process can be slow; the API can time
  out.
- The operator has a chat channel that reaches their phone, and a way
  to serve a page to themselves.
- The machinery is a long-running process the operator starts on a
  host. It can be restarted at any time. There may be several hosts.
- The current stack, which a model builds on unless it says why not:
  the machinery is Python 3 with tests that use only the standard
  library; agent sessions are Claude Code started with `claude --agent
  <name>`, one per multiplexer pane; the multiplexer is herdr, driven
  through its `herdr agent` commands; the git host is GitHub, used only
  for repositories, pushes, and webhooks; the chat is a Discord bot;
  the books are mdBook; changes and specifications are OpenSpec with
  custom schemas; small durable tables may be recutils files in git.

## 8. Questions the model must answer

Not requirements; the places where the modeler's judgment is wanted.

- Which objects carry a machine, and which are attributes of another
  object's state? How do the machines relate: nesting, composition,
  or something else?
- Where does event-driven behavior (a session's life) meet
  reconciliation (deriving the state of durable objects from stores),
  and how does one drive the other?
- Where does an agent's free reasoning sit relative to the machine,
  and how are its exits kept to the fixed set?
- How is the plan derived, and what makes it impossible to miss a row?
- What is the minimal set of stores, and what is the source of truth
  for each state?
- How does curation connect to the flywheel without the flywheel
  taking on the batching of signals?
- Where does the ledger live, who writes a verdict, and how does a
  stale verdict become a plan row that cannot be missed?
- What is the layout of state in git: one repository or one per book;
  one shared branch or one per host merged into it; one file per
  object, per state change, or per kind? What does a race between two
  hosts look like in that layout, and how is it resolved?
- How does the operator's phone reply become a commit, and how does
  the status page get rebuilt and served without a central process?
- How is history kept from growing without bound: leases renewed every
  minute for months, heartbeat commits, verdicts re-judged?
- What replaces the tracker's comment thread on an item, and how does
  a session leave a note that the operator sees?

## 9. Scenarios the model must satisfy

Behaviors, stated as what the operator experiences. A model is checked
by walking each one.

- **S1.** The operator approves a proposed elaboration from their
  phone. Work starts. Nothing later asks for that approval again, and
  the approval is never undone by the machinery deciding the work
  "needs approval" afresh.
- **S2.** A prototype elaboration of the standing type finishes its
  build and goes idle. The prototype keeps running. The plan offers
  "finish or keep". The operator opens the prototype the next morning
  and it is still there.
- **S3.** A construction session notices that a shared instruction
  file is stale. It finishes its own job, offers the fix as a chore. The
  operator accepts with one word. One agent fixes the file in the right
  place and merges it. No bolt, no unit, no stages were created.
- **S4.** A session offers a finding: a better approach to a related
  subject. The plan shows it as a proposed elaboration on the relevant
  intent. The operator drops it. Nothing was created.
- **S5.** The machinery is restarted mid-day. Every running session is
  still running. The plan is identical before and after. No object
  changed state.
- **S6.** A host is slow; starting a session takes two minutes. The
  session starts once. No duplicate session is started, and nothing is
  reported as failed.
- **S7.** All elaborations on an intent are done. The plan offers the
  intent's close. The operator says yes. The intent is closed and its
  records archived. Nothing else moved.
- **S8.** Twenty signals arrive from a meeting transcript. Curation
  attaches six to open intents, drops nine, and clusters five into two
  proposed intents, one of which challenges a standing claim. The
  plan shows two rows with their signal weight, not twenty. Every
  signal has a stored move the operator can read.
- **S9.** A build session learns that the boundary a claim draws is
  wrong. It finishes its job and offers a finding. The operator accepts;
  an elaboration amends the claim and its intent closes. The next
  planning sees the open bolt naming the old version and offers two
  rows: amend the bolt, or land it and follow with new work. The
  operator picks. Nothing was rebuilt without them.
- **S10.** A repository joins the fleet two months in. Its ledger is
  empty. The first planning judges every claim in scope once and offers
  one proposal with the unsatisfied set. Claims that do not concern it
  get not-applicable, stored, and are never judged again.
- **S11.** A built repository takes forty commits in a week. No claim
  changed. No verdict was recomputed and the plan did not change.
- **S12.** The operator opens the status view from their phone with no
  machinery running and sees every bolt, unit, and session by state,
  and which host holds each.
- **S13.** Two hosts run the machinery. One loses power mid-build. The
  other host does not touch that build. The status view shows the build
  and its host as stale. When the host returns, the build resumes on
  it, or is taken over by the stated rule, and never runs twice.
- **S14.** Two hosts see the same approved unit at the same moment and
  both try to take it. Exactly one takes it. The other sees the winner
  and moves on to other work. No unit was started twice.
- **S15.** A host's network drops for an hour. It finishes the build it
  owned and commits locally. On reconnect, its commits land and the
  status view catches up. Nothing it did not own was touched, and
  nothing the other hosts did in the hour was lost.
- **S16.** The operator, at a laptop, edits an object's state file by
  hand to close it and commits. The next pass on every host treats
  that as the word. No process had to be told.
- **S17.** The operator opens the status page from the phone six hours
  after the last host stopped. The page shows the state as of the last
  commit that landed, and says so.

## 10. What to deliver

A model that answers section 8, satisfies sections 4 and 5, and walks
section 9 — as a written model plus diagrams in the house style
(`design-diagram`), one per machine family, each stating its claim in
the title. The diagram shows where plan rows are created and retracted
on each machine, and where the ledger is read and written.

Every part of the model names the real tool, library, service or file
format it runs on, taken from the givens in section 7 or added with a
reason. Where the model keeps a store, it says which system holds it
and what one record looks like. A model that describes mechanisms
without naming what runs them is incomplete.
