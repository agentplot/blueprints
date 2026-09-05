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
- **unit** — one approved piece of construction work. Proposed as a
  single document the operator can read whole; once approved it is
  broken into work items and worked by its type.
- **unit type** — the named, operator-extensible machine that takes a
  unit from approved to landed: its stages, the sessions each stage
  runs, where an item goes back to when a stage judges it not done,
  whether it needs a change directory, and where its work lands. Chore,
  fast and default are types; so is anything the operator adds.
- **planning** — the session that reads one built repository's backlog,
  as-built and open bolts and proposes units, each with a target bolt:
  an open one, or a new one with a proposed name.
- **proposal** — planning's document for one run: the bolts it
  proposes, new or open, and the units in each with their types and
  dependencies. One decision on the plan; nothing in it is a bolt or a
  unit until its yes.
- **work item** — one task of a unit, worked through construction
  stages by sessions, merged into the bolt when complete.
- **service** — one process a repository declares that listens in a
  place: a dev server, a worker. A state object per open bolt's place,
  started and stopped only by the machinery.
- **line** — a branch the machinery owns: each repository's shared
  line, a bolt's line off a built repository's shared line, an intent's
  line off the books' shared line.
- **landing** — the machinery's effect that moves a line's work onto
  its parent: a bolt's line onto the shared line by the repository's
  policy, direct or pull-request; an intent's line by the archive. A
  bolt is landing from the operator's close until the landing passes or
  fails.
- **place** — a worktree the machinery prepares for one session off one
  line: a work item's place off its bolt's line, an elaboration's place
  off its intent's line, and a bolt's own place for the operator.
- **session** — one agent process working one job in one place, with a
  bounded goal and a fixed set of ways to end.
- **finding** — an idea a session has while doing its job that it
  judges worth the operator's consideration but outside its job.
  Offered, never acted on by the session.
- **chore** — a small fix a session judges necessary but cannot or
  should not do itself, because it lies across a repository or branch
  boundary or outside its job. Offered; if accepted, it is a unit of
  the chore type: one agent scoped to the right place, no change
  directory, never a bolt of its own.
- **decision** — one thing the plan asks the operator: created when a
  choice becomes the operator's to make, retracted when it is made or
  can no longer be made, numbered once for the organization.
- **response** — the operator's answer to a decision, or a dictation;
  recorded as `op-response`, applied exactly once.
- **the plan** — the single surface where everything awaiting the
  operator's response is presented, and where the response is given.
- **curation** — the step that turns many raw signals into a few
  intents worth elaborating.
- **signal** — one raw piece of input from a source: an excerpt of a
  meeting transcript, a log observation, a piece of user feedback, a
  chat message, a session's finding about something outside its job.
  A signal is a record with a source and a date; it is never work and
  never a plan decision on its own.
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
  idempotently, and derives the plan's decisions. It holds no knowledge of
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

### A.1 The operator's response

1. The operator gives their response in one place, the plan, and the response
   is applied exactly once.
2. The response can be given from a phone: a short reply in a chat
   channel, or a choice on a served page, are both sufficient for
   any decision. Anything needing more than a short reply is answered
   on the page.
3. The operator can also act directly on the state where it is kept,
   and the machinery treats that act as the response too.
4. The operator may invoke, by dictation, any transition that undoes
    or defers work — drop, hold and resume, send back to a stage, retire
    a session, take over, finish, close — on any object, and the
    machinery performs it with its effects and records it. The operator
    may not invoke a transition that asserts work was done. A session
    ended by hand is read as a session gone, never as a response.
5. Nothing the operator has not approved exists as work. Proposals may
   exist; work may not.
6. Approval given once is never re-asked, and never silently
   discarded. A given response that cannot be applied is reported.

### A.2 The plan

7. The plan is derivable: at any moment its content is a function of
   the current state of the system, not of what any process remembers.
   If the machinery restarts, the same plan results.
8. The plan is always current. New material joins the standing plan;
   nothing waits for a next one. The operator who opens the plan sees
   everything that stands.
9. A decision appears exactly when a choice becomes the operator's
   to make, and disappears when the decision is made or can no longer
   be made. The model must show, for every decision kind, what creates it
   and what retracts it.
10. The decision kinds are at least:
   - a proposed intent, with its proposed elaborations
   - a proposed unit breakdown for a bolt
   - a thread whose work is all done: close it?
   - a standing session that has gone idle: finish it, or keep it?
   - a finding offered by a session: pursue it (as an elaboration or
     unit), or drop it
   - a chore offered by a session: accept or reject
   - a question a session cannot answer itself
11. Decisions are grouped so that "yes to all" is a meaningful answer for a
    simple plan, and any single decision can be answered on its own.
12. The operator's own dictation ("add this idea", "do this chore")
    skips the plan and is applied directly.
13. One response is enough. After a response is applied, everything that follows
    without a further decision proceeds by the machinery on its own: an
    approved unit becomes items, items start sessions, exits advance
    stages, merges happen, the next stage begins. The operator never
    nudges. A decision says what its yes starts, and after a yes the only
    things that wait are a session's work and the next decision that is
    the operator's.
14. The plan shows, outside its count of decisions, what has reached done,
    landed, closed or dropped since the last delivery to the sink the
    operator is reading. One delivery mark per sink is recorded state,
    so the tail is derivable like the decisions.
15. Every decision carries a short number, unique in the organization, given
    once and never reused. The page and the chat show the same number,
    a response names it, and no rendering of the plan is stored.
16. A decision for construction says where the work goes. A proposed unit
    names its target bolt: an open bolt, or a new one with a proposed
    name. On the decision the operator may rename the bolt or route the unit
    to another open bolt or a new one.
17. A unit proposal is a document, reviewed on its own surface. The decision's
    answers are yes, drop, or redo with the operator's notes; an
    annotation the operator leaves on the document is the response on it.
18. A chat rendering of the plan carries the same decisions and numbers as the
    page, one line each, and a link to the page.
19. The page is also a capture surface. Text the operator types there is
    a capture with one signal of kind ask, so curation sees it; text
    with a prefix is a dictation — `intent: …` opens an intent,
    `chore <repository>: …` proposes a chore, `bolt <name>: …` proposes
    a unit on that bolt — and the page submission is the delivery, so it
    is recorded once like any response.

The catalogue of decisions, the reply grammar and the counting rules are
mocked in `design/flywheel-next/plan-mockup.md`: one rendering of these
requirements, iterated against the running plan rather than on paper.

### A.3 Intents and curation

20. Signals arrive from many sources at many rates. Curation, not the
    elaboration machinery, decides which become intents. Curation may
    be a person, an agent, or both, and it may run outside the
    flywheel; the flywheel must accept its output.
21. An intent carries at most one elaboration awaiting approval at a
    time. New material for the intent joins that proposal.
22. An intent's close is proposed when all its elaborations are done,
    and only the operator closes it.
23. The output of design is the design book: the durable statement of
    the destination, as prose, diagrams and samples the operator can
    judge, and as claims the machinery can address. Sessions write the
    destination there; anything else they produce is a record, not a
    source of truth.

### A.4 Elaborations and their types

24. An elaboration is one session, one conversation, one place. It is
    not split into many small sessions by the machinery.
25. Elaboration types differ in how they end, and the model must
    distinguish at least:
    - **self-closing**: research, writing, a throwaway prototype whose
      answer is a note. The session ends itself when its deliverable is
      written, and the machinery finishes the elaboration.
    - **standing**: an exploration, a prototype the operator wants to
      see running, an interactive page. The session stays alive after
      it goes idle. Idle is offered on the plan as "finish or keep";
      only the operator's response ends it.
    - **with-operator**: a back-and-forth the operator is in. The
      machinery never asks about it, and ends it only by the operator's
      dictation. Present means a keystroke in the session within a
      window the profile states; the machinery may not infer more.
26. A standing session is never ended by the machinery because it is
    idle, because its work items are closed, or because a restart
    forgot it.
27. The type of an elaboration is chosen when it is proposed and can be
    corrected by the operator's response.

### A.5 Planning and construction

28. Planning is a session of its own, run for one built repository when
    that repository's backlog changes: a claim in scope becomes
    standing, a verdict is recorded or falls stale, or an ask names the
    repository. It reads the backlog, the as-built and the repository's
    open bolts, and proposes units.
29. Each proposed unit names a target bolt: an open bolt when the work
    belongs with what that bolt already holds, otherwise a new bolt with
    a proposed name. The planning session sees every open bolt of the
    repository when it chooses. A bolt's name is the operator's to
    change at any time and is never the bolt's identity.
30. A bolt targets one built repository and is a deliverable. No order
    among bolts is stored or enforced; the bolts of one repository
    proceed independently of each other.
31. Within a bolt a unit may depend on other units of the same bolt. A
    unit starts when its dependencies are merged; units with no unmet
    dependency run at once, side by side. The proposal states the
    dependencies and the operator's response may change them.
32. The number of sessions running at once on a host is bounded by a
    setting of that host. At the bound, ready work waits in a stated
    order, and nothing is lost or started twice.
33. A bolt lives as long as its work: a fix merged within the hour, or a
    line that accumulates for weeks while the operator tests it. Nothing
    ages a bolt out.
34. Work may reach a bolt without an intent. The operator's dictation
    naming a bolt is applied directly; a planning judgment may route an
    ask, a finding or a signal to a unit on an open bolt, as a proposal
    on the plan. Either way the unit carries a type, a bolt and its
    dependencies like any other.
35. A proposed unit whose cited claim moved is replaced by planning's
    next proposal, silently, because a proposal is not work. An approved
    unit that has not started whose claim moved is a decision: redo or keep.
    A started unit follows the claim-moved rule of A.14.
36. A unit is proposed as one document the operator reads whole.
    Approval turns it into work items; nothing before approval creates
    work items.
37. Every unit has a **type**, chosen when it is proposed and
    correctable by the operator's response. The type is the machine that
    takes the unit from approved to landed: its stages in order, and for
    each stage the sessions that work it. A bolt may hold units of
    different types.
38. Several work items may be in flight at once. Merges into the bolt
    happen one at a time in a fixed order.
39. A bolt lands once, when the operator closes it, and only if every
    unit is finished. The close is proposed on the plan when that holds.
40. A landing that fails is reported and leaves the bolt open.
41. A stage may send an item back to an earlier stage. The unit's type names, for each stage, the agent that works it, the stage an item
    returns to when the stage judges it not done, and how many times
    that may happen before the item stops and waits on the operator.
42. Every operation on a repository that changes what a branch or a
    working place is — creating a line of work, preparing or removing a
    place to work in, merging finished work into the bolt, landing the
    bolt — is an effect the machinery performs itself, deterministically
    and repeatably.
43. A session is handed a place already prepared for it and commits
    inside that place only. It never creates a line of work, never
    merges, and never lands. A session that attempts one is refused,
    and the refusal is reported.
44. Every open bolt has a place kept on the host — its worktree at the
    head of its line, refreshed by the machinery after each merge —
    where the operator runs and tests the bolt with no session involved.
    Sessions never work in that place; each is given its own.
45. A process started in a place, by a session or by the operator,
    belongs to that place: it ends when the place is removed, and the
    ports it listens on are derived from the place so that two places on
    one host never collide. How a repository starts its servers under
    that rule is the repository's own instruction (A.11); the machinery
    requires only the rule.
46. The endpoints the processes in a place serve are recorded with the
    place and shown on the page beside the bolt, so the operator reaches
    a bolt's running system by a link. Publishing an endpoint beyond the
    operator's private network is the operator's choice, never the
    machinery's.
47. A repository declares its services — a dev server, a worker, anything
    that listens — as data in the repository: a name, how it starts in a
    place, and what it serves. Every open bolt's place carries one
    service object per declaration, with a machine of its own: stopped,
    starting, running, failed. Starting and stopping are effects the
    machinery performs in the place, bound to the worktree so they end
    with it; the page shows each service beside the bolt with its
    endpoint and lets the operator start or stop it by dictation.
48. A session starts or stops a service only through the command the
    machinery provides, which is the same path the operator's dictation
    takes, so the service's state is one record however it was moved.
    A process a session starts any other way is its own, is not shown,
    and ends with the place. Adding or changing a service declaration
    is a chore on the repository, never a session's side effect.
49. The lines are the same shape on both sides. A built repository has
    a shared line; a bolt is a line off it; a work item's place is off
    the bolt's line. The books repository has a shared line; an intent
    is a line off it; an elaboration's place is off the intent's line.
    Proposed claims exist on the intent's line; standing claims exist
    on the shared line, and archiving the intent is the landing of its
    line.
50. A line stays current by taking its parent: a bolt's line and an
    intent's line take the shared line at least when a place is first
    made off them, before they land, and on a cadence the operator sets
    per repository. The take is a merge performed by the machinery,
    never by a session.
51. A place stays current by taking its line: after any sibling place
    merges into the line, every other place off that line is rebased
    onto it. The rebase is performed by the machinery while the place's
    session is idle, never while it works, and a session is told what
    moved under it before it continues.
52. A take or a rebase that conflicts never leaves a half-done tree. A
    place's conflict is a job for the session in that place, with the
    item or elaboration it belongs to. A line's conflict, which has no
    session, becomes a chore on that line whose approval is the cadence
    the operator set or the response that ordered the take. The machinery
    retries the take when the session exits done; a conflict that
    outlasts the type's retry bound waits on the operator.
53. How a landing reaches the shared line — a pull request through the
    repository's own gates, or a direct merge — is the repository's
    policy, stated in the manifest, and the machinery performs whichever
    it says. A bolt's close is not the landing: the landing is the
    machinery's effect, and only a landing that passes the gates moves
    the shared line.
54. A standing elaboration's place is kept as long as its session; a
    self-closing elaboration's place is merged into the intent's line
    when the session exits done and then removed. An intent's line is
    landed by the archive and removed; nothing of an intent lives on a
    branch after it closes.
55. A place is removed by the machinery when the work it served is
    merged, dropped or retired, and the processes tethered to it end
    with it. A bolt's place is removed when the bolt lands or is dropped.
    A place on a host that belongs to no live object is found by
    reconciliation and removed, and the operator may hold a place to
    keep it. Every removal is an effect, recorded like any other.
56. A stage may run several sessions at once, each with its own
    instruction and persona, over the same work. The type states how the
    set is found — a fixed list, or a rule read against the repository
    being worked, such as every persona definition matching a pattern
    — and the join rule that completes the stage: all done, any done,
    or a count. Which sessions ran is recorded with the item. Their
    exits are collected as one set, and every finding, chore and signal
    each offered is recorded.
57. The catalogue of unit types is data, named, versioned, and changed
    by the operator without rebuilding the machinery. A type composed
    only of existing predicate and effect atoms is added with no code
    change at all. A unit records the type version it started under, and
    a type change never moves a unit already in flight.

### A.6 Findings and chores

58. A session may offer a finding at any time. A finding about the
    session's own intent or bolt is a proposal on the plan for that
    thread. A finding about anything else is a signal (A.15). Neither
    is work until the operator says so, and neither interrupts the
    session that offered it.
59. A session should make small fixes inside its own job rather than
    offer them. It offers a chore only when the fix lies outside what it
    may touch.
60. A chore is a unit of the chore type: no change directory, one
    stage, one session scoped to the repository and line of work the fix
    belongs on — a bolt's line when it was raised there, the shared line
    otherwise — and merged there by the machinery. Accepting one is a
    response on the plan and nothing more. A chore never creates a bolt.
61. Updating agent instructions, citations, references, and similar
    housekeeping are chores, not units.
62. A finding and a chore are documents of the change they arose in,
    written where that change's other artifacts live, at the moment the
    session judged them, and archived with the change. The machinery
    keeps one record in state for each, pointing at the document: a
    chore becomes a proposed chore unit, a finding on the session's own
    thread a proposal on that thread, anything else a signal. The
    document is never state and the record never holds the text.
63. Chores raised while a bolt is being built are collected at the bolt
    and done by one session, on the bolt's own line of work, before the
    bolt lands. No process coordinates them; the bolt's own state is
    what says they are outstanding.
64. The first proposal for a repository joining the fleet may contain
    chores as well as units, and a chore may satisfy a claim and
    produce a verdict.

### A.7 Sessions

65. A session is given one job, one place, and a bounded goal. Inside
    the job it is free; its only outputs to the machinery are a fixed
    set of exits: done with deliverables, blocked on a question,
    offering a finding, offering a chore, stalled.
66. A session never moves the state of the machinery itself. It emits
    an exit; the machinery decides what the exit means.
67. A session reports its exit through a command the machinery
    provides, which writes to the control plane. Nothing a session leaves
    on the place's disk is state; what it leaves there is its work.
68. The operator need never open a pane. Everything a session asks of
    the operator is answerable on the page or in chat, and everything a
    session shows the operator is reachable from the page. The pane
    stays reachable for the operator who wants it.
69. The operator may open a session of their own at any time, with the
    machinery's read tools and dictation, and no intent behind it. It is
    a with-operator session on no thread, and it ends by dictation.
70. A session blocked on a question stops only itself. Its item waits on
    the plan; every other item, unit and bolt continues. The answer is
    recorded with the item and given to the same session if it still
    lives, otherwise to a fresh session that starts with it. How often
    each type and stage blocks is recorded, so a type that blocks too
    much is visible.
71. The machinery never interrupts a session that is working. Anything
    it must tell a session waits until the session is idle.
72. Starting a session on a slow host may take a long time. The
    machinery treats a slow start as slow, not as failed; it retries;
    and it judges success by evidence that the session exists, never by
    the return of the command that started it.
73. Every action the machinery takes on a session is safe to repeat: a
    repeat of a completed action changes nothing.
74. A session that is not the operator's to keep is retired when the
    work it serves is retired, and its resources are released.

### A.8 State and evidence

75. Every object's state is derivable from durable stores at any
    moment. Nothing held only in a process's memory decides behavior
    after that process restarts.
76. For every state an object can be in, the model names exactly one
    source of truth that proves it. Other places that reflect the state
    are projections, written from the source, never read as truth.
77. A state can never be proven by two stores that disagree. The model
    must say what happens when projections drift from the source.
78. Reading the same stores twice with nothing changed produces the
    same conclusion and no writes.

### A.9 Observability

79. Every write the machinery makes is recorded with its reason and
    the evidence it was based on.
80. For every session, what was expected and what was delivered are
    both recorded, and the difference is the first thing a report shows.
81. Problems with the machinery itself are reported to the operator
    through this record, never filed as work.
82. Notifications are routed by kind — a blocked session, a stalled
    session, a lost host, a failed landing, new decisions — to sinks the
    operator sets per kind: the chat, the page, the multiplexer's bell on
    a named surface. A host running construction is silent by default.
    Nothing the machinery notices is visible only on the host that
    noticed it.

### A.10 The engine, the domain, and the model as an artifact

83. The machines are defined as data in standalone files. The same
    definition is executed by the machinery and is what every diagram of
    it is checked against: a checker ties every element of a picture to
    a definition and fails when they disagree, so the diagram cannot
    drift from the runtime unnoticed.
84. The definition is testable without any live service: given a
    described state of the stores, the model's decisions can be
    asserted.
85. Adding an elaboration type, a construction stage, or a plan decision
    kind is a change to the definition, not to the machinery's code.
86. The engine is generic. It loads definitions, evaluates predicates
    over evidence, chooses transitions, runs effects idempotently, and
    derives the plan's decisions. It knows nothing of intents, elaborations,
    bolts, units, work items, claims or verdicts, and no name of any of
    them appears in it.
87. The domain is the flywheel's machine definitions and the atoms
    those definitions name: one predicate atom per question asked of
    evidence, one effect atom per act on the world. New behavior is new
    definitions and new atoms; it is never a change to the engine.

### A.11 Instructions and skills as data

88. The schemas an artifact must satisfy, the instructions for writing
    each artifact, and the skill for each session type are data,
    versioned like anything else, and a session is given the versions
    in force when it starts.
89. Every session's inputs are enumerable and closed: the schema
    instruction, the type skill, its work order, and the artifacts of
    the change it works. Nothing else reaches it.
90. A test can render the exact prompt a given scenario would produce,
    without starting a session.
91. Changing an instruction is a chore. The model says where the
    instructions live and how a change to one reaches every host.

### A.12 Scenarios and testing as data

92. Every machine is testable on its own against a stand-in control
    plane, with no live service of any kind.
93. The whole machinery runs with sessions replaced by a stand-in that
    plays a scenario's scripted exits, so that seeding a scenario
    exercises the stores, the engine, the git effects, the plan and the
    page with no agent running. Only the session binding is faked;
    everything the machinery owns is real.
94. A scenario is data: given this evidence, when this tick or event,
    then these transitions, these effects, and these decisions. Scenarios
    live beside the definitions they check.
95. A scenario can be dictated in the operator's own words, turned into
    that data, run, and rendered afterwards as a trace a person reads.

### A.13 Coexistence

96. The new flywheel runs beside the current one, against the same
    organization, without either interfering with the other. Its
    scope of objects is disjoint and explicit.

### A.14 Claims, as-built, and the ledger

97. The chapter that explains a claim and the claim itself are one
    source. The prose, the diagram and the sample around a claim are
    what a construction session reads to know what the claim means;
    they cannot drift from it.
98. Only standing claims are planned against. Proposed claims are
    visible and never built.
99. Every as-built statement names the claim and claim version it
    serves. Construction never satisfies a claim it does not name.
100. Whether a repository satisfies a claim is a judgment made by an
    agent, not a computation, and it is stored as a verdict with the
    inputs it was made from.
101. A verdict is reused until its claim's version moves or its evidence
    is gone. A repository changing does not by itself invalidate a
    verdict. Not-applicable is a verdict like any other, so a scope
    judgment is made once.
102. A repository's construction backlog is derived from the ledger:
    every claim in scope with no satisfied or not-applicable verdict.
    It is never stored as a list.
103. A claim amended after construction named it reaches the operator as
    a choice: amend the open work, or let it land and follow it. The
    machinery never restarts or rewrites construction on its own.
104. A repository joining the fleet has an empty ledger. Its first
    planning judges every claim in scope once and offers the unsatisfied
    set as one proposal.
105. A claim's scope is part of the claim, chosen when it is written and
    corrected by the operator's response. A claim about a contract between
    two repositories is in scope for both, and each carries its own
    verdict.

### A.15 Signals and curation

106. Signals are appended by adapters, one record per signal, at any
    rate. The machinery never reads a signal except through curation.
107. Every signal has exactly one standing move, stored with the signal
    id, the target, the reason, and the date. Curation runs over signals
    with no move and never re-judges one that has a move. Only the
    operator's response replaces a move: reviving a dropped signal, or
    splitting a cluster.
108. Claims are the index curation clusters against. A signal either
    fits an open intent, argues with a standing claim, or fits no
    claim; the move follows from which.
109. A proposed intent from curation cites its signals and shows their
    weight: how many, from which sources, over what span. The operator
    sees one decision per proposed intent, never a decision per signal.
110. Curation is a session with a bounded job and the fixed exits of
    A.7, charged on a cadence or when unmoved signals exceed a
    threshold. It never opens an intent. A person writing the same
    records by hand is also curation.
111. A capture is the unit of provenance: one per source event, holding
    the source, the time, who captured it, and a pointer to the raw
    material. Raw transcripts and logs stay outside version control; the
    capture cites them. Capturing the same source event twice yields one
    capture.
112. Capture is one gesture from wherever the operator is: a forwarded
    message, one word on the phone, a file dropped in a folder. It costs
    no more than a sentence.
113. A signal carries its capture, a kind from a small fixed set
    (constraint, ask, question, commitment, reaction), who asserted it,
    subject tags, the assertion in a sentence, the verbatim excerpt with
    its position, and the claims it argues with when any exist. A signal
    is immutable once written.
114. The signal and move record formats are versioned and stable. Any
    tool that writes them is an adapter; captures made before the
    flywheel existed are read without conversion.
115. An adapter splits arithmetic from judgment. Enumerating source
    events and writing captures runs unattended. Turning a capture into
    signals is a session's judgment and never runs unattended.
116. Every move has a stated consequence. Attach lands the signal as
    evidence on the intent. Challenge accumulates against the claim.
    Join produces or grows a proposed intent. Answered names the claim
    or record that settled it. Drop records the reason.
117. Dropping a proposed intent gives each of its signals a move that
    records the drop. They are not clustered again unless new signals
    join them.
118. Weight counts by event date, never by import date. The status view
    shows the count and age of unmoved signals by source, and an unmoved
    signal is never discarded.

### A.16 Default instructions and the review surface

119. The instructions that shape what a session writes are data the
    operator can change without a code change, and the boundary between
    them and the engine is explicit: no instruction text exists in the
    engine, and no engine behavior depends on an instruction's wording.
120. The defaults are themselves specified. Unless the operator changes
    them, the instructions in force make every session that settles a
    design conclusion write the chapter that explains it and the claim it
    adds or amends in the same commit; make every session that writes or
    amends a claim update the system context map so the map stays
    current; and make every construction session name the claim its work
    serves.
121. The system context map is versioned like the book, so two versions
    can be compared and the difference read as a change to the design.
122. The operator's review surface is the book and the context map. A
    review view shows what changed in both since the operator last
    reviewed, directs the reader to those chapters and nodes, and is
    derived from history, never stored or hand-written.
123. Changing a default instruction is a chore, and the change is
    versioned so a session started before it and one started after can
    be told apart.
124. A test can show, for a given instruction version and a scenario,
    what a session would be asked to write, without starting one.

### A.17 Sessions charged by the machinery

171. Every agent session is data plane. The engine runs no agent; it
    charges sessions and reads what they leave. A session charged by an
    approved unit or elaboration works the operator's work. A session
    charged by the machinery itself — curation (110), planning (28), a
    conflict fix (52), findings routing — works the machinery's
    judgment. Both have the fixed exits of A.7, and both are refused
    every state change (43).
172. Planning delivers one proposal per run: a document showing the
    bolts it proposes, new or open, and the units in each with their
    types and dependencies. The proposal is one decision — yes, redo
    with notes, later — and each unit in it is separately answerable
    before the yes: bolt <name>, new bolt <name>, rename, type, drop.
    Nothing becomes a bolt or a unit until the proposal's yes. A
    proposal replaced by planning's next run is superseded silently
    (35). The operator sees the proposal on the review surface as one
    document (17, 36).
173. A stage names the kind of agent that works it and the model it
    runs, and any agent the multiplexer can start is a kind: claude,
    codex, opencode. Defaults are declared per role in the manifest:
    one kind and model for elaboration sessions, one for construction
    sessions, one for sessions the machinery charges; a unit type, a
    stage or an elaboration type may name its own. The machinery starts
    every kind through the same command, in a prepared place, with the
    same instruction data (119). Nothing in the machinery depends on
    one agent program's hooks, transcript or files; a session's exits
    are read from what it leaves in its place and from its report
    (A.7).
174. Sessions have affinity to a multiplexer session, declared per host
    in the manifest. With no declaration the defaults hold:
    `flywheel-<org>-intents` for elaboration sessions,
    `flywheel-<org>-bolts` for construction sessions, and
    `flywheel-<org>-machinery` for sessions the machinery charges. A
    declaration may route any kind or repository elsewhere. The
    machinery creates the multiplexer session when it is absent.

### A.18 Landing, pull requests and merge-back

175. A bolt's landing policy is its repository's, from the manifest:
    direct or pull-request. Direct: at close the machinery merges the
    bolt line into the shared line with a merge commit. Pull-request:
    at close the machinery opens the request from the bolt line, and
    the bolt stays open, landing, until the request merges or is
    closed. A closed request is a failed landing (40), and the bolt
    stays open.
176. While the request is open, its reviews and check results are
    evidence on the bolt. A review that asks for a change is a finding
    on the bolt (A.6). An accepted finding is a chore on the bolt line
    (60–63), worked by a session in a place off the line, and its merge
    into the line updates the request. The cycle repeats until the
    request merges.
177. Links the git host or an integration publishes for the request —
    check runs, deployments, ephemeral environments — are surfaced on
    the bolt by an adapter that reads them (114). The machinery neither
    creates nor depends on them.
178. Conversation on a request may be captured as signals by an adapter
    (111–115). Nothing in a request changes an intent except through
    curation (20).
179. The history of an open line is never rewritten. Every take is a
    merge (50), and an item's merge into its bolt line is a squash to
    one commit that names the item, unless the manifest says otherwise
    for that repository. A place is rebased onto its line only while no
    session is working in it (51, 52). The landing's shape is the
    repository's: a merge commit when direct, the repository's merge
    setting when pull-request.
180. A take or a merge that conflicts is a chore on the line (52). On a
    busy line the resolution repeats: after each chore merges the take
    is retried, up to a bound, and at the bound it is a decision: retry
    or hold. The operator is never asked to choose between merge and
    rebase; that choice is the manifest's, per repository.

183. Every tool the machinery drives — the worktree tool, the
    multiplexer, git — is driven by explicit arguments and a
    configuration the machinery writes from the manifest, never by the
    tool's own configuration on the host or in the operator's home.
    The same manifest on two hosts yields the same commands. Where a
    tool generates text, such as a commit title, it runs under that
    written configuration and the result is recorded with the effect.

184. An edit on a proposal before its yes — a unit moved to another
    bolt, dropped, renamed, retyped — is checked before it is recorded:
    a dependency never crosses bolts (31), so an edit that would leave
    one crossing, or leave a unit depending on a dropped unit, is
    refused with the reason, and the operator may take the dependents
    along instead. A rename or a type change never touches a
    dependency. The proposal's history names its lineage: the claims
    the units serve, the elaborations that wrote them, and the intents
    those served (A.14).
185. Every commit the machinery writes carries a Conventional Commits
    message: the type from the unit's type as the manifest maps it, the
    scope the bolt, the subject the item's title, and the body naming
    the unit, the item and the claims served. A direct landing's merge
    commit and a pull request's title are written the same way, so
    release tooling reading the shared line needs nothing from the
    flywheel.

### A.19 Operation

181. Operation is a phase the flywheel observes and never runs. A landed
    bolt's releases, environments and runs belong to the delivery
    system. What the flywheel receives from it are signals through
    adapters (106) and links through evidence (177); what it offers it
    are the book, the claims and the as-built ledger (A.14), readable
    from git by any system.
182. An anomaly, an incident or a review raised in operation enters as a
    signal. Curation decides whether it becomes an intent, and planning
    may route it as a unit or a chore on an open bolt (34). A data
    product is worked the same way as software: a repository, its
    bolts, and an operation seen through signals.

186. A landed bolt, an archived intent, or any other finished object
    stays in every view while something about it is live — an open
    request, an environment still up, a signal not yet moved — and for
    a bounded window after, then leaves every view and stays in
    history. Nothing is deleted; the views are derived (B.4).

### A.20 Intents as changes; gathered elaborations

187. An intent is a change in the books repository: its change directory
    is where its elaborations record what they did — research notes,
    session records, prototype notes, an interactive page — as records,
    while what they conclude is written to the book and its claims (23).
    A bolt has no change directory in the books; a unit's change lives
    in its built repository and is written at the unit's first stage
    (37). A proposal (172) is a record in the state with its document
    beside it.
188. Elaborations of one type proposed at the same time on different
    intents may be gathered into one elaboration: one session, one
    conversation, one place (24), covering several intents. Curation or
    planning proposes the gathering and names the intents it covers;
    the operator sees one decision, may pick which intents stay in it,
    and may answer per intent. The session writes its records into each
    covered intent's change directory and its conclusions into the book
    once; each covered intent's elaboration is finished by the one
    session's exit.
189. The operator may open an elaboration over several intents by
    dictation, naming them, as a with-operator or standing session (25).
    Its writeback is per covered intent (188). An intent covered by a
    gathered elaboration carries no other elaboration awaiting approval
    meanwhile (21).

### A.21 Deliverables and their producers

190. An elaboration type or a stage names its deliverables, and for each
    deliverable the skill that produces it, the schema it must satisfy
    (88), and the surface that reviews it (17). The flywheel ships a
    default set, versioned as one thing: book chapter, claim, context
    map, conceptual and logical diagrams in a house style, proposal
    document, verdict. An organization replaces or adds a producer per
    deliverable in the manifest without touching the engine (119), and
    a session is handed the producers in force when it starts (89).
    Changing a producer is a chore (123).

## 5. Requirements — Part B, the control plane contract

The data plane reaches durable, shared state and the operator only
through these operations, and depends only on these guarantees.

### B.1 The operations

125. The control plane offers exactly these operations, and the engine
    needs no others: read an object's evidence; write an effect; take,
    renew and release a lease on an object; present the plan's decisions and
    receive the operator's response; notify a host that state has changed;
    list the objects in a scope; serve the status view. An engine that
    needs a further operation is a change to this contract, stated
    here.
126. **Read.** Given an object's identity, the control plane returns the
    evidence the predicates ask for, as of a point it names. Reading
    twice with nothing changed returns the same evidence and writes
    nothing.
127. **Write an effect.** Every effect is written with an identity of
    its own. A repeat of an effect already written changes nothing, is
    not an error, and is not reported as a second write.
128. **Lease.** A lease on an object is taken, renewed while its holder
    works, and released by its holder or expired by a stated rule. Two
    would-be holders of one object cannot both hold it.
129. **Present and receive.** Decisions are presented to the operator and the
    response comes back attributed to the decision it answers. A document is
    presented for review on a surface the profile's binding names, and
    the operator's annotations on it come back as the response on its decision.
    A response that arrives twice is applied once. A response that cannot be
    applied is handed back to the engine, never dropped.
130. **Notify.** The control plane tells a host that state has changed,
    within a bound the profile states, and without the host re-reading
    everything to find out. Notification only shortens the wait: a host
    that is never notified still converges by reading.
131. **List.** The control plane enumerates the objects in a stated
    scope, so that an engine which remembers nothing can still find
    everything it must act on.
132. **Serve the status view.** The status view is served from the same
    state the engine reads, and is readable with no machinery running
    anywhere.

### B.2 The guarantees

133. **Durable.** What a write reports as written survives the loss of
    every host, all at once, without warning.
134. **Single writer per object.** Two writers of one object cannot both
    succeed. The loser learns that it lost, and reads again before
    deciding anything.
135. **Atomic per write.** A write is wholly applied or not applied. No
    reader ever sees half of one.
136. **Derivable.** Every state the engine decides upon is derivable
    from what read and list return. Nothing the control plane holds
    privately decides behavior.
137. **The response, exactly once.** An operator's response takes effect once,
    however many times it is delivered, and whatever restarts happen
    between its giving and its application.

### B.3 Evidence names and the profile binding

138. A machine definition names the evidence it reads and the effects it
    writes by abstract name only. No definition names a label, a
    column, a field, a file path, a service, or an interface.
139. A profile supplies a binding from every evidence name and every
    effect name the definitions use to the operations of that profile's
    own storage. The binding is data, reviewable on its own, and the
    definitions do not change when the profile changes.
140. An engine runs unchanged against any profile whose binding is
    complete. A binding that leaves an evidence or effect name
    unsatisfied is not a profile.

### B.4 The status view

141. At any moment the operator can see every intent, elaboration,
    bolt, unit, work item and session with its current state, grouped
    by state: queued, in progress, waiting on the operator, done; and
    for each, which host holds it, which host runs it, and whether that
    host is alive. This is a view of the whole, separate from the plan,
    and it needs no machinery running to be read.
142. The status view is a projection of the same state the engine reads.
    It is never a source of truth, and it is never written by hand to
    make it look right.
143. The status view is central: one place for the whole organization,
    reachable from the phone, however many hosts run machinery.
144. Discussion about an object — a question asked, an answer given, a
    note a session left — is part of that object's state, and the status
    view shows it.
145. A status view read while nothing is running shows the state as of
    the last write that reached the central service, and says as of
    when.
146. The status view is derived from list and read alone. The first
    build need not serve it, and the model must show that nothing more is
    needed to serve it later: for any object, its states, responses and
    sessions in order; for any repository, what landed in a period; for
    any bolt, what it holds and what waits; for any host, what it runs
    and its bound.

### B.5 Hosts and ownership

147. More than one host may run the machinery for one organization at
    once. Every host works from the same shared line of every
    repository and the same central state.
148. There is one plan per organization, derived from the shared state;
    any host can serve it. Exactly one presenter delivers it to each
    sink at a time, held by lease or pinned by the manifest, and a
    dispatcher running outside every host may be that presenter.
149. A host declares in the manifest what it takes: kinds of object,
    repositories, unit types, and whether it presents. It takes leases
    only within its declaration. An object that no host's declaration
    covers is a decision under attention, not a silent wait.
150. Every object is owned by at most one host at a time, through a
    lease, and the owner is visible. Two hosts never work the same
    object. A host that goes away leaves its objects visibly stale;
    another host takes them over only when the lease has expired by the
    stated rule, never by racing. The rule may name the operator's response
    for work that has a session behind it.
151. A host that cannot reach the central service keeps working what it
    already owns, records what it does locally, and reconciles when it
    reconnects. The model says what a disconnected host may and may not
    do.

### B.6 The operator's response in transit

152. The response travels over a transport the profile names: a short reply
    where the operator already is, or a choice on a served page. Either
    is sufficient for any decision.
153. The response is recorded with the object it concerns, the decision it
     answers, who gave it and when, before any work follows from it.
154. The operator can tell that their response was recorded, without asking
     anyone.
155. The page is served on the operator's private network and works on a
    phone; every chat rendering links to it. Where the chat platform
    offers rich rendering and built-in controls for answering, the
    profile uses them as the platform provides them. Nothing is
    invented, and the short reply grammar always works beside them.

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
| present and receive | decisions presented on the item and on the plan page; the response arrives as a short written reply |
| notify | the tracker's own notification of a change to an item |
| list objects in scope | a query over the organization's items |
| serve the status view | the board, plus a page served from the same items |

156. The tracker holds every object's state, is durable, and is
     readable with no host of the operator's running.
157. Objects with a plan-facing lifecycle — intent, elaboration, bolt,
    unit, work item, decision — are tracker items. Signals, moves, claims,
    verdicts and definitions are files in the books repository in every
    profile, never items.
158. An object's state is proven by the tracker's record of it. Anything
     else that shows that state is a projection, written from the
     tracker and never read as truth.
159. The operator acting directly on the tracker — moving an item,
     answering on it, closing it — is the response, and the machinery treats
     it as the response at its next read.

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
| present and receive | a page built from the state and served; the response returns through one named writer as a commit |
| notify | a call from the git host when the shared line moves, a bounded poll, or a message |
| list objects in scope | the layout of the state repositories, read as of the shared line |
| serve the status view | a page built from the state, served without any host of the operator's running |

160. All state is files in git repositories. The git host is the only
     central service. The model says which repositories hold state, how
     the files are laid out, and what one object's file looks like.
161. A change of state is a commit. A commit that reaches the shared
     line is the fact; a commit that has not is a local intention. The
     model says which line is shared and how a host learns that its
     commit landed.
162. The push is the compare-and-swap. Two hosts that try to change the
     same object at the same time cannot both succeed, because the host
     rejects an update whose base is stale. The model states what the
     loser does.
163. A lease is taken by a commit that lands, renewed while the host
     works, and expired by a rule the model states.
164. The operator's response from a phone becomes a commit. The model names
     the one writer that turns a short reply or a page choice into that
     commit, and how the operator can tell the commit landed.
165. A host that cannot reach the git host keeps working on what it
     already owns, commits locally, and reconciles when it reconnects.
     The model says what it may and may not do while disconnected.
     Every host fetches and integrates the shared line on its own, on
     every notify and on a bounded interval, and before every tick; no
     host decides on a read older than that bound, and no person runs
     the sync by hand.
166. Hosts learn of new state without reading the whole history each
     time. The model states how — a call from the git host, a bounded
     poll, or a message — and what the latency bound is.
167. Every write the machinery makes is a commit, and the commit
     carries its reason and the evidence it was based on. History is the
     audit record; nothing else is kept for that purpose.

### C.3 A custom profile

A placeholder. No third profile is specified; this states what one must
provide to conform.

168. A third profile conforms when it binds every evidence name and
     every effect name the definitions use, satisfies every operation of
     B.1 with every guarantee of B.2, serves the status view with no
     host of the operator's running, and passes the conformance suite of
     section 12 unchanged.
169. For each guarantee its storage does not give on its own, a profile
     names the mechanism it adds to provide that guarantee, and where
     that mechanism's own state lives.
170. A profile that cannot provide a guarantee is rejected as a
     profile. The data plane is never weakened to admit one.

## 7. Invariants

These hold at every moment, not just at the end of an operation.

- I1. No work exists without an approval that can be pointed to.
- I2. No approval is applied twice or lost.
- I3. Every plan decision has exactly one creating condition and one
  retracting condition.
- I4. Every state has exactly one source of truth.
- I5. A working session is never interrupted by the machinery.
- I6. A standing session is ended only by the operator's response.
- I7. Restarting the machinery changes no state and no plan.
- I8. The machinery never creates a bolt for a chore.
- I9. Every as-built statement names a standing claim.
- I10. No verdict is recomputed while its inputs are unchanged.
- I11. Every object has at most one owning host, and the status view
  shows it.
- I12. Every operation on a repository that changes a line of work or a
  place to work in is performed by the machinery, never by a session.
- I16. No place off a line is rebased or merged while its session is
  working, and no session starts in a place that is behind its line.
- I13. No machine definition names a store, a service, a path, or a
  field. Storage detail exists only in a profile's binding.
- I14. No state exists outside git. A host's memory and disk hold only
  what git already holds or what is about to be committed. Evidence a
  host observes about the world each tick — a pane's state, a head, a
  gate's result — is not state and is re-observed after a restart.
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
- Machine definitions are YAML validated by a JSON Schema; records are
  recutils files. The binary parses both itself and links no GNU tool.
- Documents are reviewed through plannotator, and rich pages through
  lavish; both are bindings of the review surface, not parts of the
  machinery.
- Working places are worktrunk worktrees, made and removed with `wt`:
  a place's ports are hashed from the worktree, services are reached
  through portless, and `wt tether` binds a process to the worktree's
  life. A repository's own instructions say how its servers start under
  that rule.

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
- How is the plan derived, and what makes it impossible to miss a decision?
- What is the minimal set of stores, and what is the source of truth
  for each state?
- How does curation connect to the flywheel without the flywheel
  taking on the batching of signals?
- Where does the ledger live, who writes a verdict, and how does a
  stale verdict become a plan decision that cannot be missed?
- Which profile is built first, and what test proves that a second
  profile conforms without changing a machine definition?
- Where is the line drawn between an engine primitive and a domain
  atom, and what forces a new need to the domain side rather than into
  the engine?
- Where does planning sit in the machines: a machine per repository,
  a stage of the bolt, or an elaboration type? What tells it that a
  repository's backlog changed, and how does it see the open bolts?
- What is the cadence rule for a line taking its parent, and what
  proves a place is current before its session starts?
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
  in the right place and it lands. No bolt and no change directory were created.
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
  standing claim. The plan shows two decisions with their signal weight, not
  twenty. Every signal has a stored move the operator can read.
- **S9.** *(all profiles)* A build session learns that the boundary a
  claim draws is wrong. It finishes its job and offers a finding. The
  operator accepts; an elaboration amends the claim and its intent
  closes. The next planning sees the open bolt naming the old version
  and offers two decisions: amend the bolt, or land it and follow with new
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
  and the plan decisions it asserts, rendered afterwards as a trace the
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
  every host treats that as the response. No process had to be told.
- **S20.** *(profile: git-only)* The operator opens the status page from
  the phone six hours after the last host stopped. The page shows the
  state as of the last commit that landed, and says so.
- **S21.** *(all profiles)* The operator forwards a chat message with one
  response. A capture and one signal exist, with a link back to the message.
  Nothing else happened.
- **S22.** *(all profiles)* The same meeting transcript is imported on
  two days. One capture exists, with its signals read once.
- **S23.** *(all profiles)* The operator drops a proposed intent carrying
  five signals. The next curation run does not propose it again. Each
  of the five has a move naming the drop.
- **S24.** *(all profiles)* The operator revives a dropped signal by
  dictation. Its standing move is replaced, and the next run clusters
  it.
- **S25.** *(all profiles)* An elaboration amends a claim. In one commit
  the chapter, the claim, and the context map change. The operator opens
  the review view from the phone and is taken to that chapter and that
  node, with the previous version beside it. Nothing was written by hand
  to produce the view.
- **S26.** *(all profiles)* The operator adds a unit type whose test
  stage runs one session per persona definition found in the repository
  being worked, and completes when all have exited. No code changed.
  The next unit of that type in a repository holding three personas
  runs three sessions; in a repository holding five, five. Which ran is
  recorded, and their findings, chores and signals are all recorded. A
  unit already in flight under the old type is untouched.
- **S27.** *(all profiles)* An intent archives; two of its claims stand
  and are in scope for two repositories. Planning runs once per
  repository. In the first it proposes two units on a new bolt with a
  suggested name; in the second, one unit joined to an open bolt that
  already holds related work. The operator renames the new bolt and
  routes the joined unit to a new bolt instead. Both responses apply; no
  bolt is ordered before the other.
- **S28.** *(all profiles)* A bolt stays open for three weeks while the
  operator runs the system from the bolt's own place after every merge.
  A bug found there is dictated straight to the bolt as a unit, with no
  intent; the next day a finding from a session on another bolt is
  routed to it as a proposal. Both become units of the bolt with their
  dependencies, and the operator closes the bolt when the work is done.
- **S29.** *(all profiles)* A unit has three items; two are independent,
  the third depends on both. The host's bound is two sessions. Both
  independent items run; the third waits, starts when the merges land
  and a slot is free, and nothing is started twice after a restart in
  between.
- **S30.** *(all profiles)* A build session cannot decide between two
  readings of a claim and exits blocked. Only its item waits; the bolt's
  other items merge. The operator answers on the page; the same session
  is still alive and continues with the answer. The block and the answer
  are on the item, and the type's count of blocks moved by one.
- **S31.** *(all profiles)* The operator answers yes to one unit at
  07:40 and looks again at 16:00. Nothing was nudged. The plan's tail
  shows the unit's items built, reviewed and merged since 07:40, and the
  only new decision is the bolt's close.
- **S32.** *(all profiles)* Two units of one bolt build side by side.
  The first merges into the bolt's line. The second's session is
  working; nothing happens to its place. When it goes idle the machinery
  rebases the place onto the line, tells the session what moved, and
  the session continues. The rebase conflicts once; the session resolves
  it in its place; the merge retries and lands.
- **S33.** *(all profiles)* A bolt open for three weeks takes the
  shared line every morning by the repository's cadence, and once more
  before landing. The landing goes through the repository's pull
  request and gates; the gates fail; the bolt stays open with the
  failure on it, and no session is asked to do anything until the
  operator's response.
- **S34.** *(all profiles)* An intent has two elaborations: a research
  elaboration that exits done and a standing prototype. The research
  place merges into the intent's line and is removed; the prototype's
  place is rebased onto the line while idle and kept. The archive lands
  the intent's line on the books' shared line, and the two claims it
  carried are now standing.

## 12. What to deliver

A model that answers section 10, satisfies Parts A, B and C and section
7, and walks section 11 — as a written model plus diagrams in the house
style (`design-diagram`), one per machine family, each stating its claim
in the title. The diagram shows where plan decisions are created and
retracted on each machine, and where the ledger is read and written.

Every part of the model names the real tool, library, service or file
format it runs on, taken from the givens in section 9 or added with a
reason. Where the model keeps a store, it says which system holds it
and what one record looks like. A model that describes mechanisms
without naming what runs them is incomplete.

A conformance suite comes with the model: one set of scenarios, run as
data, that every profile must pass unchanged, exercising each operation
of B.1 and each guarantee of B.2. A profile is admitted by passing it.

Every machine, decision kind, effect and conformance scenario states which
requirements it satisfies, by number. A checker fails when a
requirement is cited nowhere or a citation names no requirement, so
the model and this document cannot drift apart unnoticed.
