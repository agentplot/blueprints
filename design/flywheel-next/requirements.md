# Flywheel next — requirements

A statement of what the flywheel must do and what must always hold,
written to admit any model that satisfies it.

The statement is in three parts. Part A is the data plane: the objects,
their machines, the claims and the ledger, the signals, the plan, and
the engine that drives them. Part B is the control plane contract: the
few operations the engine needs from durable, shared storage, and the
guarantees each must give. Part C is the profiles: the ways that
contract is satisfied, one per kind of storage the flywheel may run on.

Parts A and B name no mechanism: no labels, columns, queues, loops,
guards, files, or tools. A reader who has never seen the current code
should be able to design from Parts A and B alone. Real tools are named
only in section 9 and in Part C, where naming them is the point.

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
- **capture** — one source event as recorded: a meeting, a day of one
  chat channel, a log run, a forwarded message. It holds provenance and
  the pointer to the raw material, and the signals read from it.
- **move** — curation's stored judgment on one signal: attach to an
  open intent, challenge a standing claim, join a proposed new intent,
  answered by a decision made since, or drop, with a reason.
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
  offers, and the operator's answers.
- **lease** — a host's recorded ownership of an object for a bounded
  time, renewed while the host works and expired by rule when it does
  not.
- **data plane** — the objects, machines, claims, ledger, signals, plan
  derivation and scenarios: what the flywheel is about, independent of
  where its state is kept.
- **control plane** — durable, shared storage and the operator's
  surfaces, reached through a fixed set of operations with fixed
  guarantees. The data plane touches nothing else.
- **engine** — the generic part: it loads definitions, evaluates
  predicates over evidence, chooses transitions, runs effects
  idempotently, and derives the plan's rows. It holds no knowledge of
  what the flywheel is about.
- **domain** — the flywheel's own part: its machine definitions and the
  predicate and effect atoms those definitions name.
- **profile** — one way of satisfying the control plane contract: a
  binding from every evidence and effect name to a real store and
  service, with the guarantees provided.
- **effect** — one act on the world the engine performs on a
  transition, named by a machine definition, carried out through the
  control plane, written idempotently, and safe to repeat.

## 4. Requirements — Part A, the data plane

Each requirement is a statement that can be shown true or false of a
model.

### A.1 The operator's word

1. The operator gives their word in one place, the plan, and the word
   is applied exactly once.
2. The word can be given from a phone: a short reply in a chat
   channel, or a choice on a served page, are both sufficient for
   any decision. Anything needing more than a short reply is answered
   on the page.
3. The operator can also act directly on the state where it is kept,
   and the machinery treats that act as the word too.
4. Nothing the operator has not approved exists as work. Proposals may
   exist; work may not.
5. Approval given once is never re-asked, and never silently
   discarded. A given word that cannot be applied is reported.

### A.2 The plan

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

The catalogue of rows is being mocked as a terse tree, one example of
every row kind, in `design/flywheel-next/plan-mockup.md`, and what the
plan does and does not do will be encoded there once it is settled with
the operator.

### A.3 Intents and curation

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

### A.4 Elaborations and their types

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

### A.5 Construction

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
25. A stage may send an item back to an earlier stage. The bolt's type
    names, for each stage, the agent that works it, the stage an item
    returns to when the stage judges it not done, and how many times
    that may happen before the item stops and waits on the operator.
26. Every operation on a repository that changes what a branch or a
    working place is — creating a line of work, preparing or removing a
    place to work in, merging finished work into the bolt, landing the
    bolt — is an effect the machinery performs itself, deterministically
    and repeatably.
27. A session is handed a place already prepared for it and commits
    inside that place only. It never creates a line of work, never
    merges, and never lands. A session that attempts one is refused,
    and the refusal is reported.

### A.6 Findings and chores

28. A session may offer a finding at any time. A finding about the
    session's own intent or bolt is a proposal on the plan for that
    thread. A finding about anything else is a signal (A.15). Neither
    is work until the operator says so, and neither interrupts the
    session that offered it.
29. A session should make small fixes inside its own job rather than
    offer them. It offers a chore only when the fix lies outside what it
    may touch.
30. An accepted chore is done by one agent scoped to the right
    repository and branch, and is merged where it belongs, with no unit,
    no bolt, and no stages. A chore never creates a bolt.
31. Updating agent instructions, citations, references, and similar
    housekeeping are chores, not units.
32. A finding and a chore are artifacts of the change they arose in,
    written where that change's other artifacts live, at the moment the
    session judged them, and archived with the change.
33. Chores raised while a bolt is being built are collected at the bolt
    and done by one session, on the bolt's own line of work, before the
    bolt lands. No process coordinates them; the bolt's own state is
    what says they are outstanding.
34. The first proposal for a repository joining the fleet may contain
    chores as well as units, and a chore may satisfy a claim and
    produce a verdict.

### A.7 Sessions

35. A session is given one job, one place, and a bounded goal. Inside
    the job it is free; its only outputs to the machinery are a fixed
    set of exits: done with deliverables, blocked on a question,
    offering a finding, offering a chore, stalled.
36. A session never moves the state of the machinery itself. It emits
    an exit; the machinery decides what the exit means.
37. The machinery never interrupts a session that is working. Anything
    it must tell a session waits until the session is idle.
38. Starting a session on a slow host may take a long time. The
    machinery treats a slow start as slow, not as failed; it retries;
    and it judges success by evidence that the session exists, never by
    the return of the command that started it.
39. Every action the machinery takes on a session is safe to repeat: a
    repeat of a completed action changes nothing.
40. A session that is not the operator's to keep is retired when the
    work it serves is retired, and its resources are released.

### A.8 State and evidence

41. Every object's state is derivable from durable stores at any
    moment. Nothing held only in a process's memory decides behavior
    after that process restarts.
42. For every state an object can be in, the model names exactly one
    source of truth that proves it. Other places that reflect the state
    are projections, written from the source, never read as truth.
43. A state can never be proven by two stores that disagree. The model
    must say what happens when projections drift from the source.
44. Reading the same stores twice with nothing changed produces the
    same conclusion and no writes.

### A.9 Observability

45. Every write the machinery makes is recorded with its reason and
    the evidence it was based on.
46. For every session, what was expected and what was delivered are
    both recorded, and the difference is the first thing a report shows.
47. Problems with the machinery itself are reported to the operator
    through this record, never filed as work.

### A.10 The engine, the domain, and the model as an artifact

48. The machines are defined as data in standalone files. The same
    definition is rendered into diagrams for people and executed by the
    machinery. The diagram cannot drift from the runtime.
49. The definition is testable without any live service: given a
    described state of the stores, the model's decisions can be
    asserted.
50. Adding an elaboration type, a construction stage, or a plan row
    kind is a change to the definition, not to the machinery's code.
51. The engine is generic. It loads definitions, evaluates predicates
    over evidence, chooses transitions, runs effects idempotently, and
    derives the plan's rows. It knows nothing of intents, elaborations,
    bolts, units, work items, claims or verdicts, and no name of any of
    them appears in it.
52. The domain is the flywheel's machine definitions and the atoms
    those definitions name: one predicate atom per question asked of
    evidence, one effect atom per act on the world. New behavior is new
    definitions and new atoms; it is never a change to the engine.

### A.11 Instructions and skills as data

53. The schemas an artifact must satisfy, the instructions for writing
    each artifact, and the skill for each session type are data,
    versioned like anything else, and a session is given the versions
    in force when it starts.
54. Every session's inputs are enumerable and closed: the schema
    instruction, the type skill, its work order, and the artifacts of
    the change it works. Nothing else reaches it.
55. A test can render the exact prompt a given scenario would produce,
    without starting a session.
56. Changing an instruction is a chore. The model says where the
    instructions live and how a change to one reaches every host.

### A.12 Scenarios and testing as data

57. Every machine is testable on its own against a stand-in control
    plane, with no live service of any kind.
58. A scenario is data: given this evidence, when this tick or event,
    then these transitions, these effects, and these rows. Scenarios
    live beside the definitions they check.
59. A scenario can be dictated in the operator's own words, turned into
    that data, run, and rendered afterwards as a trace a person reads.

### A.13 Coexistence

60. The new flywheel runs beside the current one, against the same
    organization, without either interfering with the other. Its
    scope of objects is disjoint and explicit.

### A.14 Claims, as-built, and the ledger

61. The chapter that explains a claim and the claim itself are one
    source. The prose, the diagram and the sample around a claim are
    what a construction session reads to know what the claim means;
    they cannot drift from it.
62. Only standing claims are planned against. Proposed claims are
    visible and never built.
63. Every as-built statement names the claim and claim version it
    serves. Construction never satisfies a claim it does not name.
64. Whether a repository satisfies a claim is a judgment made by an
    agent, not a computation, and it is stored as a verdict with the
    inputs it was made from.
65. A verdict is reused until its claim's version moves or its evidence
    is gone. A repository changing does not by itself invalidate a
    verdict. Not-applicable is a verdict like any other, so a scope
    judgment is made once.
66. A repository's construction backlog is derived from the ledger:
    every claim in scope with no satisfied or not-applicable verdict.
    It is never stored as a list.
67. A claim amended after construction named it reaches the operator as
    a choice: amend the open work, or let it land and follow it. The
    machinery never restarts or rewrites construction on its own.
68. A repository joining the fleet has an empty ledger. Its first
    planning judges every claim in scope once and offers the unsatisfied
    set as one proposal.
69. A claim's scope is part of the claim, chosen when it is written and
    corrected by the operator's word. A claim about a contract between
    two repositories is in scope for both, and each carries its own
    verdict.

### A.15 Signals and curation

70. Signals are appended by adapters, one record per signal, at any
    rate. The machinery never reads a signal except through curation.
71. Every signal has exactly one standing move, stored with the signal
    id, the target, the reason, and the date. Curation runs over signals
    with no move and never re-judges one that has a move. Only the
    operator's word replaces a move: reviving a dropped signal, or
    splitting a cluster.
72. Claims are the index curation clusters against. A signal either
    fits an open intent, argues with a standing claim, or fits no
    claim; the move follows from which.
73. A proposed intent from curation cites its signals and shows their
    weight: how many, from which sources, over what span. The operator
    sees one row per proposed intent, never a row per signal.
74. Curation is a session with a bounded job and the fixed exits of
    A.7, charged on a cadence or when unmoved signals exceed a
    threshold. It never opens an intent. A person writing the same
    records by hand is also curation.
75. A capture is the unit of provenance: one per source event, holding
    the source, the time, who captured it, and a pointer to the raw
    material. Raw transcripts and logs stay outside version control; the
    capture cites them. Capturing the same source event twice yields one
    capture.
76. Capture is one gesture from wherever the operator is: a forwarded
    message, one word on the phone, a file dropped in a folder. It costs
    no more than a sentence.
77. A signal carries its capture, a kind from a small fixed set
    (constraint, ask, question, commitment, reaction), who asserted it,
    subject tags, the assertion in a sentence, the verbatim excerpt with
    its position, and the claims it argues with when any exist. A signal
    is immutable once written.
78. The signal and move record formats are versioned and stable. Any
    tool that writes them is an adapter; captures made before the
    flywheel existed are read without conversion.
79. An adapter splits arithmetic from judgment. Enumerating source
    events and writing captures runs unattended. Turning a capture into
    signals is a session's judgment and never runs unattended.
80. Every move has a stated consequence. Attach lands the signal as
    evidence on the intent. Challenge accumulates against the claim.
    Join produces or grows a proposed intent. Answered names the claim
    or record that settled it. Drop records the reason.
81. Dropping a proposed intent gives each of its signals a move that
    records the drop. They are not clustered again unless new signals
    join them.
82. Weight counts by event date, never by import date. The status view
    shows the count and age of unmoved signals by source, and an unmoved
    signal is never discarded.

## 5. Requirements — Part B, the control plane contract

The data plane reaches durable, shared state and the operator only
through these operations, and depends only on these guarantees.

### B.1 The operations

83. The control plane offers exactly these operations, and the engine
    needs no others: read an object's evidence; write an effect; take,
    renew and release a lease on an object; present the plan's rows and
    receive the operator's word; notify a host that state has changed;
    list the objects in a scope; serve the status view. An engine that
    needs a further operation is a change to this contract, stated
    here.
84. **Read.** Given an object's identity, the control plane returns the
    evidence the predicates ask for, as of a point it names. Reading
    twice with nothing changed returns the same evidence and writes
    nothing.
85. **Write an effect.** Every effect is written with an identity of
    its own. A repeat of an effect already written changes nothing, is
    not an error, and is not reported as a second write.
86. **Lease.** A lease on an object is taken, renewed while its holder
    works, and released by its holder or expired by a stated rule. Two
    would-be holders of one object cannot both hold it.
87. **Present and receive.** Rows are presented to the operator and the
    word comes back attributed to the row it answers. A word that
    arrives twice is applied once. A word that cannot be applied is
    handed back to the engine, never dropped.
88. **Notify.** The control plane tells a host that state has changed,
    within a bound the profile states, and without the host re-reading
    everything to find out. Notification only shortens the wait: a host
    that is never notified still converges by reading.
89. **List.** The control plane enumerates the objects in a stated
    scope, so that an engine which remembers nothing can still find
    everything it must act on.
90. **Serve the status view.** The status view is served from the same
    state the engine reads, and is readable with no machinery running
    anywhere.

### B.2 The guarantees

91. **Durable.** What a write reports as written survives the loss of
    every host, all at once, without warning.
92. **Single writer per object.** Two writers of one object cannot both
    succeed. The loser learns that it lost, and reads again before
    deciding anything.
93. **Atomic per write.** A write is wholly applied or not applied. No
    reader ever sees half of one.
94. **Derivable.** Every state the engine decides upon is derivable
    from what read and list return. Nothing the control plane holds
    privately decides behavior.
95. **The word, exactly once.** An operator's word takes effect once,
    however many times it is delivered, and whatever restarts happen
    between its giving and its application.

### B.3 Evidence names and the profile binding

96. A machine definition names the evidence it reads and the effects it
    writes by abstract name only. No definition names a label, a
    column, a field, a file path, a service, or an interface.
97. A profile supplies a binding from every evidence name and every
    effect name the definitions use to the operations of that profile's
    own storage. The binding is data, reviewable on its own, and the
    definitions do not change when the profile changes.
98. An engine runs unchanged against any profile whose binding is
    complete. A binding that leaves an evidence or effect name
    unsatisfied is not a profile.

### B.4 The status view

99. At any moment the operator can see every intent, elaboration,
    bolt, unit, work item and session with its current state, grouped
    by state: queued, in progress, waiting on the operator, done; and
    for each, which host holds it, which host runs it, and whether that
    host is alive. This is a view of the whole, separate from the plan,
    and it needs no machinery running to be read.
100. The status view is a projection of the same state the engine reads.
    It is never a source of truth, and it is never written by hand to
    make it look right.
101. The status view is central: one place for the whole organization,
    reachable from the phone, however many hosts run machinery.
102. Discussion about an object — a question asked, an answer given, a
    note a session left — is part of that object's state, and the status
    view shows it.
103. A status view read while nothing is running shows the state as of
    the last write that reached the central service, and says as of
    when.

### B.5 Hosts and ownership

104. More than one host may run the machinery for one organization at
    once. Every host works from the same shared line of every
    repository and the same central state.
105. Every object is owned by at most one host at a time, through a
    lease, and the owner is visible. Two hosts never work the same
    object. A host that goes away leaves its objects visibly stale;
    another host takes them over only when the lease has expired by the
    stated rule, never by racing.
106. A host that cannot reach the central service keeps working what it
    already owns, records what it does locally, and reconciles when it
    reconnects. The model says what a disconnected host may and may not
    do.

### B.6 The operator's word in transit

107. The word travels over a transport the profile names: a short reply
    where the operator already is, or a choice on a served page. Either
    is sufficient for any decision.
108. The word is recorded with the object it concerns, the row it
     answers, who gave it and when, before any work follows from it.
109. The operator can tell that their word was recorded, without asking
     anyone.

## 6. Requirements — Part C, profiles

A profile is a complete binding of Part B to real storage and real
services. Every profile satisfies every operation of B.1 with every
guarantee of B.2. Parts A and B do not change to admit a profile.

### C.1 The tracker profile

State lives in an organization's tracker: an item per object, grouped
into milestones, arranged on a board. The tracker is the central
service.

| contract operation | how this profile satisfies it |
|---|---|
| read evidence | the item's own fields, its grouping, its board placement and its comments |
| write an effect | a change to an item, carrying the effect's identity so a repeat is recognized |
| lease | a recorded holder on the item, with the time it was taken and renewed |
| present and receive | rows presented on the item and on the plan page; the word arrives as a short written reply |
| notify | the tracker's own notification of a change to an item |
| list objects in scope | a query over the organization's items |
| serve the status view | the board, plus a page served from the same items |

110. The tracker holds every object's state, is durable, and is
     readable with no host of the operator's running.
111. An object's state is proven by the tracker's record of it. Anything
     else that shows that state is a projection, written from the
     tracker and never read as truth.
112. The operator acting directly on the tracker — moving an item,
     answering on it, closing it — is the word, and the machinery treats
     it as the word at its next read.

### C.2 The git-only profile

Every piece of durable state is a file in a git repository, and the git
host is the only central service. There is no tracker: issues,
milestones and boards may exist for people, but the machinery never
reads or writes them.

| contract operation | how this profile satisfies it |
|---|---|
| read evidence | the object's files as of the shared line |
| write an effect | a commit whose message carries the effect's identity, reason and evidence |
| lease | a lease file changed by a commit that lands, renewed while the host works |
| present and receive | a page built from the state and served; the word returns through one named writer as a commit |
| notify | a call from the git host when the shared line moves, a bounded poll, or a message |
| list objects in scope | the layout of the state repositories, read as of the shared line |
| serve the status view | a page built from the state, served without any host of the operator's running |

113. All state is files in git repositories. The git host is the only
     central service. The model says which repositories hold state, how
     the files are laid out, and what one object's file looks like.
114. A change of state is a commit. A commit that reaches the shared
     line is the fact; a commit that has not is a local intention. The
     model says which line is shared and how a host learns that its
     commit landed.
115. The push is the compare-and-swap. Two hosts that try to change the
     same object at the same time cannot both succeed, because the host
     rejects an update whose base is stale. The model states what the
     loser does.
116. A lease is taken by a commit that lands, renewed while the host
     works, and expired by a rule the model states.
117. The operator's word from a phone becomes a commit. The model names
     the one writer that turns a short reply or a page choice into that
     commit, and how the operator can tell the commit landed.
118. A host that cannot reach the git host keeps working on what it
     already owns, commits locally, and reconciles when it reconnects.
     The model says what it may and may not do while disconnected.
119. Hosts learn of new state without reading the whole history each
     time. The model states how — a call from the git host, a bounded
     poll, or a message — and what the latency bound is.
120. Every write the machinery makes is a commit, and the commit
     carries its reason and the evidence it was based on. History is the
     audit record; nothing else is kept for that purpose.

### C.3 A custom profile

A placeholder. No third profile is specified; this states what one must
provide to conform.

121. A third profile conforms when it binds every evidence name and
     every effect name the definitions use, satisfies every operation of
     B.1 with every guarantee of B.2, serves the status view with no
     host of the operator's running, and passes the conformance suite of
     section 12 unchanged.
122. For each guarantee its storage does not give on its own, a profile
     names the mechanism it adds to provide that guarantee, and where
     that mechanism's own state lives.
123. A profile that cannot provide a guarantee is rejected as a
     profile. The data plane is never weakened to admit one.

## 7. Invariants

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
- I12. Every operation on a repository that changes a line of work or a
  place to work in is performed by the machinery, never by a session.
- I13. No machine definition names a store, a service, a path, or a
  field. Storage detail exists only in a profile's binding.
- I14. No state exists outside git. A host's memory and disk hold only
  what git already holds or what is about to be committed.
  *(profile: git-only)*
- I15. Two commits that change the same object cannot both land without
  one having seen the other. *(profile: git-only)*

## 8. Non-goals

- Replacing the git hosting or the agent runtime.
- Multi-operator arbitration. One operator per organization.
- Scheduling across hosts for performance. Correctness first.
- A user interface beyond the plan page, the status view, and the chat
  reply.

Which control plane the flywheel runs on is a profile choice, made per
organization, not a non-goal.

## 9. Environment givens

Constraints of the world, not design choices.

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
- A GitHub organization is available for the tracker profile: issues,
  milestones, projects, and their comments are durable and reachable
  without any host of the operator's running.
- For the git-only profile, the git host provides exactly this and no
  more: it accepts one update to a branch at a time, it rejects an
  update whose base is stale, and it can call a URL when a branch
  moves, if configured. No other service of the host may be depended
  on.
- The rewrite targets Rust: a pure engine crate, control-plane adapters
  as trait implementations, and one static binary per host. The
  language is a given, not a design input, and the models stay
  language-agnostic: nothing in a machine definition, a scenario, or a
  profile binding may depend on the implementation language.
- The rest of the stack, which a model builds on unless it says why
  not: agent sessions are Claude Code started with `claude --agent
  <name>`, one per multiplexer pane; the multiplexer is herdr, driven
  through its `herdr agent` commands; the tracker profile's tracker is
  GitHub issues, milestones and a Projects board; the git-only
  profile's git host is GitHub, used only for repositories, pushes and
  webhooks; the chat is a Discord bot; the books are mdBook; changes
  and specifications are OpenSpec with custom schemas; small durable
  tables may be recutils files in git.

## 10. Questions the model must answer

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
- Which profile is built first, and what test proves that a second
  profile conforms without changing a machine definition?
- Where is the line drawn between an engine primitive and a domain
  atom, and what forces a new need to the domain side rather than into
  the engine?
- Are claims OpenSpec requirement blocks included by anchor, or fenced
  claim blocks with a hash lock?
- What is the layout of state in git: one repository or one per book;
  one shared branch or one per host merged into it; one file per
  object, per state change, or per kind? What does a race between two
  hosts look like in that layout, and how is it resolved?
- How does the operator's phone reply become a commit, and how does
  the status page get rebuilt and served without a central process?
- How is history kept from growing without bound: leases renewed every
  minute for months, heartbeat commits, verdicts re-judged?
- What replaces a tracker's comment thread on an item in the git-only
  profile, and how does a session leave a note that the operator sees?

## 11. Scenarios the model must satisfy

Behaviors, stated as what the operator experiences. A model is checked
by walking each one. Each is tagged with the profiles it applies to.

- **S1.** *(all profiles)* The operator approves a proposed elaboration
  from their phone. Work starts. Nothing later asks for that approval
  again, and the approval is never undone by the machinery deciding the
  work "needs approval" afresh.
- **S2.** *(all profiles)* A prototype elaboration of the standing type
  finishes its build and goes idle. The prototype keeps running. The
  plan offers "finish or keep". The operator opens the prototype the
  next morning and it is still there.
- **S3.** *(all profiles)* A construction session notices that a shared
  instruction file is stale. It finishes its own job, offers the fix as
  a chore. The operator accepts with one word. One agent fixes the file
  in the right place and merges it. No bolt, no unit, no stages were
  created.
- **S4.** *(all profiles)* A session offers a finding: a better approach
  to a related subject. The plan shows it as a proposed elaboration on
  the relevant intent. The operator drops it. Nothing was created.
- **S5.** *(all profiles)* The machinery is restarted mid-day. Every
  running session is still running. The plan is identical before and
  after. No object changed state.
- **S6.** *(all profiles)* A host is slow; starting a session takes two
  minutes. The session starts once. No duplicate session is started, and
  nothing is reported as failed.
- **S7.** *(all profiles)* All elaborations on an intent are done. The
  plan offers the intent's close. The operator says yes. The intent is
  closed and its records archived. Nothing else moved.
- **S8.** *(all profiles)* Twenty signals arrive from a meeting
  transcript. Curation attaches six to open intents, drops nine, and
  clusters five into two proposed intents, one of which challenges a
  standing claim. The plan shows two rows with their signal weight, not
  twenty. Every signal has a stored move the operator can read.
- **S9.** *(all profiles)* A build session learns that the boundary a
  claim draws is wrong. It finishes its job and offers a finding. The
  operator accepts; an elaboration amends the claim and its intent
  closes. The next planning sees the open bolt naming the old version
  and offers two rows: amend the bolt, or land it and follow with new
  work. The operator picks. Nothing was rebuilt without them.
- **S10.** *(all profiles)* A repository joins the fleet two months in.
  Its ledger is empty. The first planning judges every claim in scope
  once and offers one proposal with the unsatisfied set. Claims that do
  not concern it get not-applicable, stored, and are never judged again.
- **S11.** *(all profiles)* A built repository takes forty commits in a
  week. No claim changed. No verdict was recomputed and the plan did not
  change.
- **S12.** *(all profiles)* The operator opens the status view from
  their phone with no machinery running and sees every bolt, unit, and
  session by state, and which host holds each.
- **S13.** *(all profiles)* Two hosts run the machinery. One loses power
  mid-build. The other host does not touch that build. The status view
  shows the build and its host as stale. When the host returns, the
  build resumes on it, or is taken over by the stated rule, and never
  runs twice.
- **S14.** *(all profiles)* A review stage judges an item not done and
  sends it back to build. The build session works it again and review
  sends it back a second time. The third review passes, the item merges
  into the bolt, and the bolt lands. The item's history shows both
  send-backs and the retry count that permitted them.
- **S15.** *(all profiles)* A build session tries to create a line of
  work for itself. The attempt is refused and reported. The machinery
  prepares the place, hands it to the session, and the session commits
  inside it. Nothing about the repository's lines of work was changed by
  the session.
- **S16.** *(all profiles)* The operator dictates a scenario in a
  sentence. It becomes scenario data, runs against a stand-in control
  plane with no live service, and produces the transitions, the effects
  and the plan rows it asserts, rendered afterwards as a trace the
  operator reads.
- **S17.** *(profile: git-only)* Two hosts see the same approved unit at
  the same moment and both try to take it. Exactly one takes it. The
  other sees the winner and moves on to other work. No unit was started
  twice.
- **S18.** *(profile: git-only)* A host's network drops for an hour. It
  finishes the build it owned and commits locally. On reconnect, its
  commits land and the status view catches up. Nothing it did not own
  was touched, and nothing the other hosts did in the hour was lost.
- **S19.** *(profile: git-only)* The operator, at a laptop, edits an
  object's state file by hand to close it and commits. The next pass on
  every host treats that as the word. No process had to be told.
- **S20.** *(profile: git-only)* The operator opens the status page from
  the phone six hours after the last host stopped. The page shows the
  state as of the last commit that landed, and says so.
- **S21.** *(all profiles)* The operator forwards a chat message with one
  word. A capture and one signal exist, with a link back to the message.
  Nothing else happened.
- **S22.** *(all profiles)* The same meeting transcript is imported on
  two days. One capture exists, with its signals read once.
- **S23.** *(all profiles)* The operator drops a proposed intent carrying
  five signals. The next curation run does not propose it again. Each
  of the five has a move naming the drop.
- **S24.** *(all profiles)* The operator revives a dropped signal by
  dictation. Its standing move is replaced, and the next run clusters
  it.

## 12. What to deliver

A model that answers section 10, satisfies Parts A, B and C and section
7, and walks section 11 — as a written model plus diagrams in the house
style (`design-diagram`), one per machine family, each stating its claim
in the title. The diagram shows where plan rows are created and
retracted on each machine, and where the ledger is read and written.

Every part of the model names the real tool, library, service or file
format it runs on, taken from the givens in section 9 or added with a
reason. Where the model keeps a store, it says which system holds it
and what one record looks like. A model that describes mechanisms
without naming what runs them is incomplete.

A conformance suite comes with the model: one set of scenarios, run as
data, that every profile must pass unchanged, exercising each operation
of B.1 and each guarantee of B.2. A profile is admitted by passing it.
