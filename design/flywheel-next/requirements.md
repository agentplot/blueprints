# Flywheel next — requirements
<!-- ANCHOR: preamble -->

A statement of what the instance must do and what must always hold,
written to admit any model that satisfies it.

The statement is in three parts. Part A is the data plane: the objects,
their machines, the claims and the ledger, the signals, the rail, and
the engine that drives them. Part B is the state store contract: the
few operations the engine needs from durable, shared storage, and the
guarantees each must give. Part C is the profiles: the ways that
contract is satisfied, one per kind of storage the flywheel may run on.

Parts A and B name no mechanism the model is free to choose: no labels,
columns, queues, loops, guards, files or services. Two things of the
world they do name freely, because section 9 fixes them and no model
may displace them: git, and OpenSpec as the change and specification
format. Every other real tool is named only in section 9 and in Part C,
where naming them is the point. A reader who has never seen the current
code should be able to design from Parts A and B, git and OpenSpec
alone.

## 1. Purpose

The flywheel turns an operator's intent into built software with the
operator spending their attention only where judgment is needed. It
runs design work that settles what to build, and construction work
that builds it, using AI agent sessions for the work and the operator
for the decisions. Everything it does is inspectable after the fact.

<!-- ANCHOR_END: preamble -->
<!-- ANCHOR: actors -->
## 2. Actors

| actor | may decide | may not |
|---|---|---|
| **operator** | which intents are worth pursuing; whether a proposed piece of work starts; whether a standing session is finished; whether a thread of work is closed; whether an offered idea or chore is accepted; every answer to a question the machinery cannot answer itself | nothing is required of the operator for work that needs no judgment |
| **the machinery** | when to start, advance, finish and retire work whose conditions are met; what to offer the operator and when; what to record | it never invents work, never approves work, never closes a thread on its own |
| **an agent session** | how to do the one job it was given; what to report; whether to raise a question, offer a finding, or offer a chore | it never changes the state of anything outside its job; it never starts other work |
| **signal sources** (people, meeting transcripts, logs, user feedback, other tools) | nothing; they only supply raw material | |

<!-- ANCHOR_END: actors -->
<!-- ANCHOR: glossary -->
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
  dependencies. One decision on the rail; nothing in it is a bolt or a
  unit until its yes.
- **work item** — one task of a unit, worked through construction
  stages by sessions, merged into the bolt when complete.
- **service** — one process a repository declares that listens in a
  place: a dev server, a worker. A state object per open bolt's place,
  started and stopped only by the machinery.
- **line** — a branch the machinery owns: each repository's shared
  line, a bolt's line off a built repository's shared line, an intent's
  line off the blueprints' shared line.
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
- **decision** — one thing the rail asks the operator: created when a
  choice becomes the operator's to make, retracted when it is made or
  can no longer be made, numbered once for the flywheel.
- **response** — the operator's answer to a decision, or a dictation;
  recorded as `op-response`, applied exactly once.
- **rail** — the derived, numbered list of the decisions that stand, in
  the model's order; the page draws it as the rail titled Decisions, the
  chat prints it as a numbered list; formerly the plan.
- **curation** — the step that turns many raw signals into a few
  intents worth elaborating.
- **signal** — one raw piece of input from a source: an excerpt of a
  meeting transcript, a log observation, a piece of user feedback, a
  chat message, a session's finding about something outside its job.
  A signal is a record with a source and a date; it is never work and
  never a rail decision on its own.
- **capture** — one source event as recorded: a meeting, a day of one
  chat channel, a log run, a forwarded message. It holds provenance and
  the pointer to the raw material, and the signals read from it.
- **move** — curation's stored judgment on one signal: attach to an
  open intent, challenge a standing claim, join a proposed new intent,
  answered by a decision made since, route to the chore or the ask
  curation offered for it, or drop, with a reason.
- **claim** — one statement of what is true at the destination: a
  boundary, an owner, a coupling, a store, an invariant, or a behavior.
  It is a requirement block in the blueprints' OpenSpec specifications,
  with a stable name, a version that is the hash of its text and so
  moves only when its text moves, at least one scenario saying how one
  would know it holds, and a scope. A claim is **proposed** while it
  sits in its intent's change and **standing** once the intent's
  landing has archived it into the standing specifications.
- **as-built** — the built repository's standing OpenSpec
  specifications: what that software does as of all construction
  landed. Every as-built statement is a requirement block naming the
  claim and claim version it serves.
- **verdict** — one stored judgment that a repository satisfies a claim:
  satisfied, partial, not satisfied, or not applicable, with the claim
  version and repository revision judged, the evidence, and the date.
- **ledger** — the verdicts, kept for every repository the instance
  tracks.
- **scope** — the repositories a claim applies to: all of them, a kind
  of repository, every repository declaring a capability, or named
  repositories.
- **instance** — one thing the state holds: one blueprints repository,
  one state repository, the repositories it tracks, its sinks and its
  numbers, isolated from every other (218, 219). It belongs to exactly
  one account. This is the word every requirement, machine, atom,
  profile and permission uses; the customer's word for it on every
  surface is *flywheel* (S206).
- **account** — who may respond, and what they may respond to: the
  Frontegg account on a hosted tier, the manifest's authored operators
  list on a self-managed host. It holds one or more instances, and
  membership, roles and each member's chat addresses live on it, not on
  an instance (247). A user signs in to an account, sees its instances,
  and switches accounts to see others.
- **flywheel** — the product and the machinery: this design, the
  binary, and what it does. On a customer-facing surface it is also the
  customer's name for an instance, so a control that switches instances
  is rendered "Switch flywheel" and a page that lists them lists
  flywheels (S206).
- **organization** — a company, or an organization at the git host. It
  is never the thing the state holds; that is an instance, and who may
  respond in it is an account.
- **state** — everything the machinery must remember between runs and
  share between hosts: objects, their states, ownership, verdicts,
  offers, and the operator's answers.
- **lease** — a host's recorded ownership of an object for a bounded
  time, renewed while the host works and expired by rule when it does
  not.
- **data plane** — the objects, machines, claims, ledger, signals, rail
  derivation and scenarios: what the flywheel is about, independent of
  where its state is kept.
- **state store** — durable, shared storage and the operator's
  surfaces, reached through a fixed set of operations with fixed
  guarantees. The data plane touches nothing else. It is not the
  control plane, which is the service side of A.37 and another thing
  entirely.
- **engine** — the generic part: it loads definitions, evaluates
  predicates over evidence, chooses transitions, runs effects
  idempotently, and derives the rail's decisions. It holds no knowledge of
  what the flywheel is about.
- **domain** — the flywheel's own part: its machine definitions and the
  predicate and effect atoms those definitions name.
- **profile** — one way of satisfying the state store contract: a
  binding from every evidence and effect name to a real store and
  service, with the guarantees provided.
- **effect** — one act on the world the engine performs on a
  transition, named by a machine definition, carried out through the
  state store, written idempotently, and safe to repeat.
- **tool** — one operation of the state store the operator may
  invoke, with a schema naming its arguments by object id: the one way
  anything — a page control, a chat, the dispatch agent, the machinery
  — moves an object. A dictation is a tool the operator invoked.
- **host's agent** — the agent that serves the operator's free text on
  a surface: the instance's dispatch agent for chat, a model
  running in the page's browser. It reads and answers with the query
  tools on its own, and every write it makes is a proposed tool call
  the operator confirms. The machinery never parses free text.
- **interpreter** — the function of the host's agent that turns free
  text into a proposed tool call for the operator to confirm; a
  message that asks for several things yields several, one card each.
  Nothing at all when the operator used a control.
- **blueprints repository** — an instance's content repository,
  one of its two central repositories beside the state repository: the
  book, the claims, the context map, the manifest, the OpenSpec changes
  for intents with their records, and what the machinery writes under
  its prefix (203). Short: the blueprints.
- **book** — one content type inside the blueprints: the design book
  of chapters, with the claims fenced in the chapters that explain
  them (23, 97). A chapter is a page of it. Its first part is the
  fundamentals part.
- **fundamentals part** — the part of the book that states what the
  system fundamentally is and what must always hold, written as a
  statement of invariants, with the claims that make a clause checkable
  included under them (318). It is a part of the book and not a fourth
  artifact beside the book, the claims and the context map.
- **statement of invariants** — the form the fundamentals part is
  written in: every clause states one thing that is always true of the
  system or one thing the system never does, the clauses numbered in
  one sequence and naming no mechanism, the whole written to admit any
  model that satisfies it. Short form **the statement**; this file is
  one.

<!-- ANCHOR_END: glossary -->
## 4. Requirements — Part A, the data plane

Each requirement is a statement that can be shown true or false of a
model.

### A.1 The operator's response
<!-- ANCHOR: a01 -->

1. The operator gives their response in one place, the rail, and the response
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

<!-- ANCHOR_END: a01 -->
### A.2 The rail
<!-- ANCHOR: a02 -->

7. The rail is derivable: at any moment its content is a function of
   the current state of the system, not of what any process remembers.
   If the machinery restarts, the same rail results.
8. The rail is always current. New material joins the standing rail;
   nothing waits for a next one. The operator who opens the rail sees
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
    simple rail, and any single decision can be answered on its own.
12. The operator's own dictation ("add this idea", "do this chore")
    skips the rail and is applied directly.
13. One response is enough. After a response is applied, everything that follows
    without a further decision proceeds by the machinery on its own: an
    approved unit becomes items, items start sessions, exits advance
    stages, merges happen, the next stage begins. The operator never
    nudges. A decision says what its yes starts, and after a yes the only
    things that wait are a session's work and the next decision that is
    the operator's.
14. The rail shows, outside its count of decisions, what has reached done,
    landed, closed or dropped since the last delivery to the sink the
    operator is reading. One delivery mark per sink is recorded state,
    so the tail is derivable like the decisions.
15. Every decision carries a short number, unique in the instance, given
    once and never reused. The page and the chat show the same number,
    a response names it, and no rendering of the rail is stored.
16. A decision for construction says where the work goes. A proposed unit
    names its target bolt: an open bolt, or a new one with a proposed
    name. On the decision the operator may rename the bolt or route the unit
    to another open bolt or a new one.
17. A unit proposal is a document, reviewed on its own surface. The decision's
    answers are yes, drop, or redo with the operator's notes; an
    annotation the operator leaves on the document is the response on it.
18. A chat rendering of the rail carries the same decisions and numbers as the
    page, one line each, and a link to the page.
19. The page is also a capture surface. Text the operator types there is
    a capture with one signal of kind ask, so curation sees it. The
    operator may mark a capture as an intent, which is a judgment made
    with a control, never a word parsed out of the text. The page
    submission is the delivery, so it is recorded once like any
    response. The page's typed input is one palette in one grammar, the
    same grammar the chat carries: plain text is that capture, a
    leading `/` names a command of 193's catalogue, and a bare number is
    the reply grammar of 194. The page parses no text on its own side.

The catalogue of decisions, the reply grammar and the counting rules are
mocked in `design/flywheel-next/rail-mockup.md`: one rendering of these
requirements, iterated against the running rail rather than on paper.

<!-- ANCHOR_END: a02 -->
### A.3 Intents and curation
<!-- ANCHOR: a03 -->

20. Signals arrive from many sources at many rates. Curation, not the
    elaboration machinery, decides which become intents. Curation may
    be a person, an agent, or both, and it may run outside the
    instance; the flywheel must accept its output.
21. An intent carries at most one elaboration awaiting approval at a
    time. New material for the intent joins that proposal.
22. An intent's close is proposed when all its elaborations are done,
    and only the operator closes it.
23. The output of design is the design book: the durable statement of
    the destination, as prose, diagrams and samples the operator can
    judge, and as claims the machinery can address. Sessions write the
    destination there; anything else they produce is a record, not a
    source of truth.

<!-- ANCHOR_END: a03 -->
### A.4 Elaborations and their types
<!-- ANCHOR: a04 -->

24. An elaboration is one session, one conversation, one place. It is
    not split into many small sessions by the machinery.
25. Elaboration types differ in how they end, and the model must
    distinguish at least:
    - **self-closing**: research, writing, a throwaway prototype whose
      answer is a note. The session ends itself when its deliverable is
      written, and the machinery finishes the elaboration.
    - **standing**: an exploration, a prototype the operator wants to
      see running, an interactive page. The session stays alive after
      it goes idle. Idle is offered on the rail as "finish or keep";
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

<!-- ANCHOR_END: a04 -->
### A.5 Planning and construction
<!-- ANCHOR: a05 -->

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
    on the rail. Either way the unit carries a type, a bolt and its
    dependencies like any other.
34a. A unit's proposal cites the standing claims in scope it serves,
    which are already among its inputs (89, 102), and cites none when
    none fits. A unit may therefore cite no claim: it carries a type, a
    bolt and its dependencies like any other (34), and its change is
    written and landed like any other, but it produces no as-built
    statement and no verdict, and the ledger has no cell for it. This
    is a case of 99, not an exception to it: construction that names no
    claim satisfies none. A unit never proposes a claim for its own
    work; claims are written on the design side (23, 97), and small
    work connects to a coarse claim by citing it. A chore citing a
    claim makes that claim's verdict due again when it lands (64).
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
    unit is finished. The close is proposed on the rail when that holds.
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
    machinery's. A hosted host has no private network: the page and the
    tool server are served at the tier's own name and the identity token
    is the boundary there (191, 249, 291), and a place's endpoints are
    still published beyond it only on the operator's word.
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
    the bolt's line. The blueprints repository has a shared line; an intent
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

<!-- ANCHOR_END: a05 -->
### A.6 Findings and chores
<!-- ANCHOR: a06 -->

58. A session may offer a finding at any time. A finding about the
    session's own intent or bolt is a proposal on the rail for that
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
    response on the rail and nothing more. A chore never creates a bolt.
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

<!-- ANCHOR_END: a06 -->
### A.7 Sessions
<!-- ANCHOR: a07 -->

65. A session is given one job, one place, and a bounded goal. Inside
    the job it is free; its only outputs to the machinery are a fixed
    set of exits: done with deliverables, blocked on a question,
    offering a finding, offering a chore, stalled.
66. A session never moves the state of the machinery itself. It emits
    an exit; the machinery decides what the exit means.
67. A session reports its exit through a command the machinery
    provides, which writes to the state store. Nothing a session leaves
    on the place's disk is state; what it leaves there is its work.
68. The operator need never open a pane. Everything a session asks of
    the operator is answerable on the page or in chat, and everything a
    session shows the operator is reachable from the page. The pane
    stays reachable for the operator who wants it.
69. The operator may open a session of their own at any time, with the
    machinery's read tools and dictation, and no intent behind it. It is
    a with-operator session on no thread, and it ends by dictation.
70. A session blocked on a question stops only itself. Its item waits on
    the rail; every other item, unit and bolt continues. The answer is
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
197. Sessions never message each other. A session speaks to the
    machinery only through the tools of 193, and each call carries the
    session's identity, issued when the machinery started it; the tool
    server refuses a call whose identity does not belong to the pane it
    came from, so a session can act only in its own job (43, 89). The
    machinery speaks to a session only through its thread, delivered by
    the multiplexer (deliver_answer, tell_moved). A session charged to
    supervise or plan (171) reads records and calls tools like any
    other and never addresses a session. Messaging built into an agent
    program, and the multiplexer's own messaging, are not used by any
    session (173).

<!-- ANCHOR_END: a07 -->
### A.8 State and evidence
<!-- ANCHOR: a08 -->

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

<!-- ANCHOR_END: a08 -->
### A.9 Observability
<!-- ANCHOR: a09 -->

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

<!-- ANCHOR_END: a09 -->
### A.10 The engine, the domain, and the model as an artifact
<!-- ANCHOR: a10 -->

83. The machines are defined as data in standalone files. The same
    definition is executed by the machinery and is what every diagram of
    it is checked against: a checker ties every element of a picture to
    a definition and fails when they disagree, so the diagram cannot
    drift from the runtime unnoticed.
84. The definition is testable without any live service: given a
    described state of the stores, the model's decisions can be
    asserted.
85. Adding an elaboration type, a construction stage, or a rail decision
    kind is a change to the definition, not to the machinery's code.
86. The engine is generic. It loads definitions, evaluates predicates
    over evidence, chooses transitions, runs effects idempotently, and
    derives the rail's decisions. It knows nothing of intents, elaborations,
    bolts, units, work items, claims or verdicts, and no name of any of
    them appears in it.
87. The domain is the flywheel's machine definitions and the atoms
    those definitions name: one predicate atom per question asked of
    evidence, one effect atom per act on the world. New behavior is new
    definitions and new atoms; it is never a change to the engine.

<!-- ANCHOR_END: a10 -->
### A.11 Instructions and skills as data
<!-- ANCHOR: a11 -->

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

<!-- ANCHOR_END: a11 -->
### A.12 Scenarios and testing as data
<!-- ANCHOR: a12 -->

92. Every machine is testable on its own with no live service of any
    kind. The state store a test runs against is held locally, with no
    network at all: the git-only profile (C.2) against a bare
    repository on the same computer, so there is no git host, no
    tracker and nothing to stand up before a test runs. That is the
    no-live-service run, and in the first build it is the only
    state-store profile there is; the tracker profile (C.1) joins as a
    second binding of the same operations when construction lands on
    the owners' repositories.
93. The whole machinery runs with sessions replaced by a stand-in that
    plays a scenario's scripted exits, so that seeding a scenario
    exercises the stores, the engine, the git effects, the rail and the
    page with no agent running. Only the session binding is faked;
    everything the machinery owns is real.
93a. A build that performs no construction may bind the effects that
    change a line of work or a place to work in (42) to a recorded
    stand-in, which writes the evidence each effect's proof reads and
    touches no repository. The binding is stated like any other (139),
    the machines and their proofs do not change, and a scenario whose
    assertion is about a real take, merge, rebase, conflict or landing
    is not run against it. This is the one binding beside the session's
    that 93 admits, and it is admitted only while no bolt can land;
    everything else the machinery owns is real.
93b. A host may declare the operator as its session binding. Under it
    the machinery charges a session as it always does — a place
    prepared, a work order rendered (89), the session recorded — and
    the rail shows the session as the operator's to run; the operator
    does the work and reports through the same command a session
    reports through (67). The exits, the offers and the refusals are
    the same records, so nothing downstream tells the two apart, and a
    session charged this way is a with-operator session for every rule
    that turns on the type (25). The machinery's own sessions (171) are
    the operator's under the same rule, as 110 already says of
    curation, and a host so bound starts no agent (69).
94. A scenario is data: given this evidence, when this tick or event,
    then these transitions, these effects, and these decisions. Scenarios
    live beside the definitions they check.
95. A scenario can be dictated in the operator's own words, turned into
    that data, run, and rendered afterwards as a trace a person reads.

<!-- ANCHOR_END: a12 -->
### A.13 Coexistence
<!-- ANCHOR: a13 -->

96. The new flywheel runs beside the current one, against the same
    instance, without either interfering with the other. Its
    scope of objects is disjoint and explicit.

<!-- ANCHOR_END: a13 -->
### A.14 Claims, as-built, and the ledger
<!-- ANCHOR: a14 -->

97. A claim's text lives in the blueprints' OpenSpec specifications,
    and the chapter that explains it includes it by anchor, so the two
    are one source and cannot drift. The prose, the diagram and the
    sample around the included claim are what a construction session
    reads to know what the claim means; the specification is what it
    reads to know what the claim says.
98. Only standing claims are planned against. Proposed claims are
    visible and never built.
99. Every as-built statement is a requirement block in the built
    repository's specifications naming the claim and claim version it
    serves; a unit's change carries it and the unit's landing archives
    it. Construction never satisfies a claim it does not name.
100. Whether a repository satisfies a claim is a judgment made by an
    agent, not a computation, and it is stored as a verdict with the
    inputs it was made from.
101. A verdict is reused until its claim's version moves, its evidence
    is gone, or a challenge move (116) is recorded against the claim it
    verifies. A verdict that falls stale for a challenge makes planning
    (28) due for that repository, and its proposal cites the signal. A
    repository changing does not by itself invalidate a verdict.
    Not-applicable is a verdict like any other, so a scope judgment is
    made once.
102. A repository's construction backlog is derived from the ledger:
    every claim in scope with no satisfied or not-applicable verdict.
    It is never stored as a list.
103. A claim amended after construction named it reaches the operator as
    a choice: amend the open work, or let it land and follow it. The
    machinery never restarts or rewrites construction on its own.
104. A repository joining the fleet has an empty ledger. Its first
    planning judges every claim in scope once and offers the unsatisfied
    set as one proposal.
105. A claim's scope is part of the claim: what it attaches to on the
    context map (200), the specification's capability being one
    attachment and the claim's own attachment line holding any more,
    attached when it is written and re-attached by the operator's
    response. A claim about a contract between two
    repositories is in scope for both, and each carries its own
    verdict.
195. A repository's kinds and capabilities are derived from the nodes it
    homes on the context map (199), never declared by hand, and a
    claim's scope is derived from what the claim attaches to (200). A
    node newly homed in a repository, or an attachment newly reaching
    one, brings every claim attached there into that repository's
    scope, so planning becomes due (28) and its next proposal carries
    the newly unmet claims; a node or an attachment removed makes the
    affected verdicts not-applicable (101). The page shows, for a
    repository, its kinds and capabilities, the claims in scope with
    their verdicts, and each claim's attachments with a control to
    re-attach it (193).

<!-- ANCHOR_END: a14 -->
### A.15 Signals and curation
<!-- ANCHOR: a15 -->

106. Signals are appended by adapters, one record per signal, at any
    rate. The machinery never reads a signal except through curation.
107. Every signal has exactly one standing move — attach, challenge,
    join, answered, route or drop — stored with the signal id, the
    target, the reason, and the date. Curation runs over signals
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
    message, one word on the phone, a file dropped in a folder, one key
    on the page opening its palette ready to capture. It costs no more
    than a sentence.
113. A signal carries its capture, a kind from a small fixed set
    (constraint, ask, question, commitment, reaction), who asserted it,
    subject tags, the assertion in a sentence, the verbatim excerpt with
    its position, and the claims it argues with when any exist. A signal
    is immutable once written.
114. The signal and move record formats are versioned and stable. Any
    tool that writes them is an adapter; captures made before the
    instance existed are read without conversion.
115. An adapter splits arithmetic from judgment. Enumerating source
    events and writing captures runs unattended. Turning a capture into
    signals is a session's judgment and never runs unattended.
116. Every move has a stated consequence. Attach lands the signal as
    evidence on the intent. Challenge accumulates against the claim and
    stales the verdicts of the challenged claim in every repository
    that has one (101). Join produces or grows a proposed intent.
    Answered names the claim or record that settled it. Route records
    the chore or the ask that curation, being a session (58–60),
    offered for a signal that argues with no claim. Drop records the
    reason.
117. Dropping a proposed intent gives each of its signals a move that
    records the drop. They are not clustered again unless new signals
    join them.
118. Weight counts by event date, never by import date. The status view
    shows the count and age of unmoved signals by source, and an unmoved
    signal is never discarded.
215. The flywheel ships these adapters: a chat forward, a meeting
    transcript, a log or monitor webhook, a pull-request conversation,
    an issue tracker, a folder drop, and the page's capture box (19).
    There is one kind of adapter: an enumerator that writes one keyed
    capture per source event with a pointer to the raw material (111),
    running on whichever host declares the source, by that host's tick
    (231). The capture endpoint is for callers that cannot reach any
    host's binary. Triage of a source is charged on the host that
    declares it (217e). An instance adds an adapter as a package
    (228).

<!-- ANCHOR_END: a15 -->
### A.16 Default instructions and the review surface
<!-- ANCHOR: a16 -->

119. The instructions that shape what a session writes are data the
    operator can change without a code change, and the boundary between
    them and the engine is explicit: no instruction text exists in the
    engine, and no engine behavior depends on an instruction's wording.
120. The defaults are themselves specified. Unless the operator changes
    them, the instructions in force make every session that settles a
    design conclusion write the chapter that explains it and the claim it
    adds or amends in the same commit; make every session that writes or
    amends a claim write it at the granularity of the destination, so
    that a claim survives a rewrite of the code, has an observer who
    would want to know if it stopped holding, and is judgeable from the
    repository alone (100), and so that no statement naming a file, a
    colour, a setting, a plugin or a step of a pipeline is written as a
    claim; make every session that writes or amends a claim update the
    system context map so the map stays current; make the elaboration
    type that writes the fundamentals part write every clause as an
    invariant, numbered and naming no mechanism (318); and make every
    construction session cite the standing claim in scope its work
    serves, cite none when none fits, and never propose a claim for its
    own work (34a).
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
317. The review surface (122) carries the units that landed citing no
    claim (34a) since the operator last reviewed, as one list under one
    question: is anything here worth a claim. Answering yes for a unit
    attaches its change as material to an intent, open or proposed, and
    the claim is written there by the normal path (23, 97); the unit
    itself is not reopened. Answering no is stored against that unit,
    as a not-applicable verdict is stored once against a claim (101),
    and that unit is never listed again. Every unit in the list has
    already landed, so nothing waits on the answer.
318. The fundamentals part is a part of the book: a statement of
    invariants of what the system is and what must always hold, written
    as clauses numbered in one sequence across the part, each stating
    something always true or never done, and naming no mechanism. A
    clause says what must always hold in language a person judges; a
    claim is the clause the flywheel checks per repository, included by
    anchor immediately after the clause it makes checkable (97). A
    clause need not yield a claim, and a claim's prose may cite the
    clause it serves, which the machinery never reads. The part is
    written by an elaboration type shipped for it, whose deliverables
    are the part, the claims it yields and their map attachments (190);
    the type is self-closing (25) and its session ends when the part
    validates against the schema, which is the style of
    `design/requirements-style.md`. The type is an extensible file in
    the shipped set, never core, composing only templates and atoms the
    release ships (57, 87, 223, 224); changing the type, its schema or
    its producer is a chore (123).
198. The system context map is the scope surface. It is the map of the
    bounded contexts the blueprints describe, in the terms of domain-driven
    design: a context, the elements it names, the relationships between
    contexts typed by the DDD patterns with an upstream and a downstream
    where the pattern has one, and links between elements. Element
    kinds, link kinds and facets come from a vocabulary the instance
    ships and the flywheel extends; the relationship patterns do
    not. Every context, element, relationship and link has a stable id,
    a name as the book writes it, the chapter that states it (120), and
    a status of settled, candidate or open, an open one paired with a
    question. A lane, a tier, a runtime or a store is a tag or a kind;
    the map has no structure for them. The map is data validated
    against the schema and the vocabulary on every commit and versioned
    with the book (121). A session that writes or amends a claim
    updates it (120).

199. Every element names the git repository it is built in, its home,
    or inherits the home its context sets; an external context sets none
    and homes nothing. A repository's kinds and capabilities are derived
    by a table the schema fixes from the elements it homes, its kinds
    from their kinds and its capabilities from the contracts among them;
    they are never declared by hand and never read by scope. The
    manifest entry names only the repository's git details (195). The
    map check fails a home naming no manifest entry and a manifest
    entry that no element or context homes.

199a. Until the operator draws a map, the map is derived from the
    manifest by a fixed table: one context per repository, homed there,
    carrying the repository's name and nothing else. A claim's default
    attachment is then a repository's context, its scope that
    repository, and planning, verdicts and the backlog work with no
    book and no drawn map (195, 200). Drawing the map replaces the
    derived contexts with the operator's; no claim moves for it unless
    its attachment does.
200. A claim attaches to a context, an element, a relationship or a
    link, and the attachment lives with the claim (97). Its scope is the
    set of repositories homing what it attaches to, both ends of a
    relationship or a link, derived from the target map and never chosen
    (105). Correcting a scope is re-attaching the claim, one response
    through the scope tool (193). A claim attached to nothing is not
    planned against (98). A change to a vocabulary or to the derivation
    table moves no verdict; only a home change, a re-attachment or a
    claim version does.

201. The map is two complete maps under one schema, current and target,
    the same id naming the same thing in both. The page shows the target
    with two overlays computed by one difference, keyed on id: current
    to target, the design difference, and target at the operator's last
    review to target now (122). Each home carries the ledger verdict for
    the claims attached there, and decisions are markers on what they
    concern. An open element's question is shown with it and can be
    captured in one gesture (112). Tags filter, colour and group the
    drawing and never change its structure.

202. A repository joins the fleet when the target map first homes
    something in it (104). Its first planning's baseline is the claims
    attached to what it homes.
211. The map is moved only through the tools of 193: attach and detach a
    claim (200), set a home (199), add or amend a context, element,
    relationship or link — refused without a chapter ref (120) —, set a
    status with its question, capture a question (201), mark reviewed
    (122), and add a repository (202). A session moves the map only in
    a writeback that also writes the chapter (120); no session changes
    an attachment or a home for work it is doing itself. Every
    construction session's work order names the elements it builds,
    their homes, and the claims attached there (89).

<!-- ANCHOR_END: a16 -->
### A.17 Sessions charged by the machinery
<!-- ANCHOR: a17 -->

171. Every agent session is data plane. The engine runs no agent; it
    charges sessions and reads what they leave. A session charged by an
    approved unit or elaboration works the operator's work. A session
    charged by the machinery itself — curation (110), planning (28), a
    conflict fix (52), findings routing — works the machinery's
    judgment. Both have the fixed exits of A.7, and both are refused
    every state change (43).
172. Planning delivers one proposal per run: a document showing the
    bolts it proposes, new or open, and the units in each with their
    types, their dependencies and a size estimate per unit in
    slot-days, one session slot for one day. The proposal is one
    decision — yes, redo with notes, later — and each unit in it is
    separately answerable before the yes: bolt <name>, new bolt <name>,
    rename, type, drop. Nothing becomes a bolt or a unit until the
    proposal's yes. A proposal replaced by planning's next run is
    superseded silently (35). The operator sees the proposal on the
    review surface as one document (17, 36). At landing the machinery
    records each unit's actual — the slot-days its sessions occupied —
    on the as-built beside the claims the unit served (99, 192).
    Planning calibrates its estimates by unit type and by repository
    from the actuals recorded there; no constant stands in for them.
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
    `flywheel-<instance>-intents` for elaboration sessions,
    `flywheel-<instance>-bolts` for construction sessions, and
    `flywheel-<instance>-machinery` for sessions the machinery charges. A
    declaration may route any kind or repository elsewhere. The
    machinery creates the multiplexer session when it is absent.
196. Every pane and every agent the machinery starts is named by the
    object it works: a session's pane and its agent name are the
    session id, so the multiplexer's listing is a status view of its
    own (B.4). The multiplexer layout is a binding of the sessions
    profile with a shipped default: one multiplexer session per
    instance and role (174); inside it, one workspace per bolt and
    per intent; one tab per unit and per elaboration; one pane per
    session, so sessions of one unit running side by side are split
    panes of one tab. The machinery creates a workspace, tab or pane
    when absent and removes it when its object leaves every view (186).
    An operator's own session (69) is a workspace of its own.

<!-- ANCHOR_END: a17 -->
### A.18 Landing, pull requests and merge-back
<!-- ANCHOR: a18 -->

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

<!-- ANCHOR_END: a18 -->
### A.19 Operation
<!-- ANCHOR: a19 -->

181. Operation is a phase the flywheel observes and never runs. A landed
    bolt's releases, environments and runs belong to the delivery
    system. What the flywheel receives from it are signals through
    adapters (106) and links through evidence (177); what it offers it
    are the book, the claims and the as-built ledger (A.14), readable
    from git by any system.
182. An anomaly, an incident or a review raised in operation enters as a
    signal. Curation decides whether it becomes an intent, and planning
    may route it as a unit or a chore on an open bolt (34), or a chore
    on the shared line when no bolt is open (60). A data product is
    worked the same way as software: a repository, its bolts, and an
    operation seen through signals.

186. A landed bolt, an archived intent, or any other finished object
    stays in every view while something about it is live — an open
    request, an environment still up, a signal not yet moved — and for
    a bounded window after, then leaves every view and stays in
    history. Nothing is deleted; the views are derived (B.4).
192. At landing the built repository's standing specifications are the
    as-built: each claim they name, its version and its scenarios, which
    any delivery system may read from git. Generating and running a
    suite from them is the delivery system's; the machinery writes no
    index beside them (181).

<!-- ANCHOR_END: a19 -->
### A.20 Intents as changes; gathered elaborations
<!-- ANCHOR: a20 -->

187. An intent is a change in the blueprints repository: its change directory
    is where its elaborations record what they did — research notes,
    session records, prototype notes, an interactive page — as records,
    while what they conclude is written to the book and its claims (23).
    A bolt has no change directory in the blueprints; a unit's change lives
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
    selecting them and invoking the operation (193), as a with-operator
    or standing session (25). The new elaboration is fed the covered
    intents' chapters, claims and the records of their earlier
    elaborations (89); those earlier elaborations are unchanged by it.
    Its writeback is per covered intent (188). An intent covered by a
    gathered elaboration carries no other elaboration awaiting approval
    meanwhile (21).

<!-- ANCHOR_END: a20 -->
### A.21 Deliverables and their producers
<!-- ANCHOR: a21 -->

190. An elaboration type or a stage names its deliverables, and for each
    deliverable the skill that produces it, the schema it must satisfy
    (88), and the surface that reviews it (17). The flywheel ships a
    default set, versioned as one thing: book chapter, claim, context
    map, conceptual and logical diagrams in a house style, proposal
    document, surface specification, fundamentals part, verdict. The
    fundamentals part is delivered by an elaboration type shipped for
    it (318) and by no other, since a type is the set of deliverables
    it names. An instance replaces or adds a producer per
    deliverable in the manifest without touching the engine (119), and
    a session is handed the producers in force when it starts (89).
    Changing a producer is a chore (123).
212. A surface specification is a deliverable (190): the surfaces a
    design settles, what each shows and never shows, the flows between
    them as numbered steps, the form of each kind of object, the keys
    and modes, and the rulings with their reasons, written so a
    construction session builds from it without repeating the
    exploration that produced it. It is versioned in the book, cites
    the mockups it was drawn from as records in the intent's change
    directory (187), and a claim about a surface cites its statements.
    The flywheel ships it in the default set with a schema and a
    producer, and every construction session whose work touches a
    surface carries the specification in force in its work order (89).

<!-- ANCHOR_END: a21 -->
### A.22 Endpoints and routing
<!-- ANCHOR: a22 -->

191. How a place's services are reached is a binding of the host, never
    of the machinery: the machinery gives each service a port derived
    from its place (45) and an address to bind, and asks the host's
    router for the URL it records (46). A router is one of at least: a
    local router on the operator's machine that names the place
    (portless: https://<place>.localhost); a private-network router
    that names the host on the operator's network (a tailnet hostname,
    with the host's own proxy or the network's serve feature giving
    each service a name); and a managed platform that runs the host,
    exposes it, and hands the machinery the hostname or the URL, where
    services bind every interface and the platform's ingress publishes
    them within the operator's private network. The manifest names the
    router per host; the same repository declaration serves under
    every router; nothing beyond the private network is published
    unless the operator says so (46). On a hosted host there is no
    private network: the tier's router is the platform's ingress at the
    host's served name, and what stands in for the private network is
    the identity token the tool server verifies on every call (249,
    291). The boundary is the token there and the network on a
    self-managed host; a place's own services are published beyond it
    only when the operator says so, as everywhere.

<!-- ANCHOR_END: a22 -->
### A.23 Where files live
<!-- ANCHOR: a23 -->

203. Three repositories, three owners. The state repository is the
    machinery's alone: nothing a person or a session writes lives
    there, and its layout is the profile's (C.2). The blueprints repository
    is the instance's: the book, the claims, the context map, the
    manifest, the OpenSpec changes for intents and the elaboration
    records inside them are written by people and sessions under the
    book's own layout; the machinery writes there only under the
    prefix `flywheel/` — captures, signals and moves, the rendered map
    — and the OpenSpec change directory it creates when an intent
    opens. A built repository is its owners': code and the
    repository's declarations to the instance under `flywheel/`
    (services, commit types) are theirs; the machinery writes only the
    OpenSpec changes for units, the acceptance file beside the
    as-built (192), and an untracked `.flywheel/` in each place for
    the work order and handoff. Tracked flywheel-facing files sit
    under `flywheel/` in any repository; untracked per-place files
    under `.flywheel/`, excluded from git. The machinery never writes
    outside its prefix except as the effect of a response. Raw
    material that captures cite stays outside every repository (111).

<!-- ANCHOR_END: a23 -->
### A.24 Bootstrapping and repositories
<!-- ANCHOR: a24 -->

204. Initialization is the machinery's, deterministic and repeatable. An
    instance is an object with a machine of its own — absent, blueprints
    ready, state ready, connected, hosted — and `flywheel init` drives
    it: create or adopt the blueprints repository from the blueprints template,
    create the state repository with the profile's layout (C.2), record
    that the flywheel's GitHub App must be installed (a secret the
    operator places, never an agent), and register the first host.
    Every step is an effect with a proof, so running it again changes
    nothing, and the reconciler that advances work advances a
    half-finished bootstrap.
205. A host joins by one command and never by hand. It clones the state,
    the blueprints and every tracked built repository as bare repositories
    under one root the manifest names, keeps one checkout of each
    shared line for the machinery's own merges, and makes worktrees
    only for places (43) and the operator's bolt places (44). The
    layout on disk is the profile's; a host that finds a hand-made
    layout refuses to start and says what differs.
205a. A host has one address, and the instance is in the path: a
    host serving several instances (218) serves them all at that
    one address, `/<instance>/...`, and a link names the instance it
    opens. The settings form edits the keys 233 assigns to the
    instance and shows the host's keys read-only, with a link to
    the host's own screen.
206. A repository is created by the machinery from a response, never by
    a session. An elaboration or a dictation proposes it with its map
    nodes and homes (199, 202); the yes creates it on the git host
    under the instance from the built-repository template, writes
    its manifest entry, its `flywheel/` declarations (203) and its map
    nodes, and the first planning runs its baseline (104). Adopting an
    existing repository is the same steps without the creation.
207. One GitHub App is the connection. Its installation covers every
    repository the manifest lists; adding a repository extends the
    installation or surfaces as a decision under attention (149). No
    host or session uses a personal token. A session in a place is
    given a short-lived installation token scoped to that repository,
    issued by the machinery into the place and written nowhere else.
207a. A self-managed instance uses its own GitHub App, its key
    placed by the operator as 207 says. The hosted tiers use the
    service's App: its key never leaves the service, and the
    installation tokens a pool host (240) needs are minted for it by
    the service, scoped as 207 scopes them.
208. The blueprints template, the built-repository template, the map schema
    and derivation table (198, 199), the fundamentals part's skeleton
    (318), and the shipped skills and deliverables (190) are one
    versioned set released with the flywheel. Initialization and creation stamp the version they used;
    upgrading a repository's template is a chore (123).

<!-- ANCHOR_END: a24 -->
### A.25 Dispatch
<!-- ANCHOR: a25 -->

216. Dispatch is four jobs and no more: the presenter of the chat sink
    (148, 152–155), the capture endpoint for callers that cannot write
    the blueprints repository (106, 112), the capture-reading session (115),
    and the host's agent for chat (194). Each job reads and writes only
    through the state store's operations and tools (125, 193). The
    data plane names none of them (C.1).

216a. A model running in the page's browser is the host's agent for
    the page and nothing else (194). It presents no sink, writes no
    capture except through the capture tool the page already calls
    (19), and reads no capture. An instance may run with no other
    part of dispatch; the rail is then served, answered and captured
    on the page, and nothing arrives through chat or through a
    webhook.

217. Dispatch is a host (149) whose declaration takes no object kind,
    no repository and no unit type, and presents the chat sink; it may
    also declare the callers of its endpoint, the sources it triages,
    and the runner of each model job. It runs the same binary, joins by
    the same command (205), heartbeats, holds its leases and ticks like
    every host, and holds a lease only on a sink (148, 150).

217a. Dispatch is stateless between ticks. Every decision it makes is
    derived from what read and list return: the sink's mark, the
    capture keys, the signal records, the response records (136, 7). A
    restart reads the same state and reaches the same conclusion.
    Nothing dispatch holds in memory decides behavior, and no
    conversation persists across ticks or requests.

217b. The two jobs that need a model — reading a capture and
    answering a message — are sessions of A.7: a bounded goal, a
    closed set of inputs (89), a fixed set of exits, an identity the
    tool server checks (197). Each is charged per capture or per
    message and ends when it delivers. Neither carries context from
    one charge to the next.

217c. The sessions binding names a runner per model job: a multiplexer
    pane (173, 174), a bounded loop inside the dispatcher's own
    process, or a session on an agent platform. Every runner starts
    the session with the same work order, instruction data and exits;
    the engine cannot tell them apart. The host's agent's runner
    answers within the operator's patience for a chat reply. A runner
    on an agent platform reaches the tool server only over remote MCP
    with the session's identity, and only across the operator's
    private network (46, 191). On a hosted host the tool server is
    reached at the host's served name and the identity token it
    verifies is the boundary (249, 291); the private network is the
    boundary on a self-managed host.

217d. No host, session or loop addresses dispatch. Dispatch learns of
    state through the profile's notify and its bounded fetch (130,
    165, 166) and through nothing else. Dispatch reaches the operator
    through the sink's own identity — the bot the manifest names and
    the token the operator placed — and never through a person's
    account.

217e. Triage is distinct from curation. Curation gives signals their
    moves on its own cadence and threshold (110). Triage turns one
    capture into its signals, charged by the tick of the host that
    declares the capture's source, immediately or on a cadence the
    manifest names, up to a bound of readers at once (32). A forwarded
    single message charges no reader (S21).

217f. When dispatch is down nothing is lost. Decisions are state and
    any host serves the page (148). Replies wait in the chat and are
    applied once by their delivery id when the presenter returns
    (137). A caller of the endpoint retries; a repeat under the same
    key writes nothing (111). A capture waits with its pointer; an
    unmoved signal is never discarded (118). The sink's lease expires
    by the stated rule and never by racing (150).

217g. Capture is decentralized. Any adapter that can read its source
    and push to the blueprints repository writes captures through its own
    binary, from any machine, and never through dispatch (114). The
    endpoint is for callers that cannot write git. Triage reads every
    capture wherever it was written.

217h. A capture's pointer is reachable by whichever host reads it. The
    manifest names a raw store per source; an adapter puts the raw
    material there before writing the capture, or the host that holds
    it declares that it triages that source. A reader is not charged
    for a pointer that cannot be reached; the capture is a decision
    under attention instead (149).

217i. The placements of dispatch are: the browser agent alone, the
    dispatcher on the operator's machine or in its multiplexer, the
    dispatcher in a long-lived process on a platform, and the invoked
    dispatcher of 270, which is a placement in its own right and is the
    one the hosted tiers use. All run the same declaration. What differs between them is placement, the
    store the secrets are placed in, the network route, and the model
    access (191, 207) — all named in the manifest and none in a
    machine, an atom or a profile operation. A placement that holds no
    socket, no clock and no private route is a placement when a
    scheduler gives it the clock (273), an interactions endpoint gives
    it the replies a socket would carry (277), and a served name with
    an identity check gives it the route (243, 291); it gives up only
    the replies a chat platform delivers over a socket alone (277).

217j. The installation tiers are bindings. A chat platform's adapter, a
    sign-in kind, a router kind and a runner are each code shipped
    once; which an instance uses is data (139). Every response is
    recorded with who gave it and when (153) at every tier; an
    instance that needs the record elsewhere exports it from
    history (167).

217k. Dispatch is installed by the machinery from the manifest and
    never by hand: `flywheel init` records that the instance's
    dispatcher exists and where it is placed (204); the placement's
    own step — a process, a pane, a container, a platform session —
    is an effect with a proof, repeatable, and the secrets it needs
    are placed by the operator and are a decision under attention
    until they are (207). Upgrading dispatch is upgrading the binary
    on that placement; a dispatcher running an older binary than the
    manifest's stamped version is visible on the status view (208).

<!-- ANCHOR_END: a25 -->
### A.26 Instances
<!-- ANCHOR: a26 -->

218. A host runs several instances at once, each isolated on disk and in
    state: nothing crosses between them — no lease, no id, no session,
    no decision number. The page shows one instance at a time and
    switches between them, and the instances of one account are listed
    together, since an account is what a user signs in to (247). Each
    instance has its own sinks, one presenter per sink (148), and no
    sink serves two.
219. An instance is the operator's name for it: one blueprints
    repository, one state repository, the repositories it tracks, its
    sinks and its numbers. An account holds one or more instances and a
    instance belongs to exactly one account. An instance's name may but
    need not coincide with anything at the git host, and its
    repositories are listed by URL, so they may live under any
    organization or account the App reaches (207).
220. From zero: init adopts an existing blueprints repository or creates one
    from the template, and does the same for the state repository and
    for each tracked repository (204, 206). An existing repository
    that lacks the layout is upgraded by a chore (123, 208) and never
    rewritten.
221. An instance is removed by a response, never by deleting files: its
    sessions are ended, its places removed, its state archived, its git
    repositories left on disk; its numbers are never reused (15). The
    account it belonged to stands, with its other flywheels.
222. Every tick reconciles the host's disk against the state (75). A
    bare repository or a checkout that is missing, moved or changed by
    hand is a decision under attention that shows the difference and
    the proposed repair; nothing is repaired without the response,
    except a place's worktree, which is re-made from its line (49).
    Unreadable state is never guessed at. Until the response, the host
    stops covering the affected objects (150), and the status view
    shows why.
233. The page carries one account item: who the operator is and how
    they signed in, the instance they are looking at with a switch
    to any other the host has a root for (218), and from it the
    instance's settings (its manifest as a form, one response per
    save), its hosts and their parts (229), the instance's package
    store apart from any host's (228), and sign-out. A page served on the
    operator's own computer signs in like any other, through the host's
    identity kind (243), so the identity is the same there as anywhere;
    every response the page records carries that identity (153).
    Authentication is the host's kind and authorization the
    instance's: a host declares one kind, the same for every
    instance it serves, and switching instances never changes
    the signed-in identity. Membership in an instance is the
    authored operators list on a self-managed host and the Application's
    assignment on the account on a hosted tier (247);
    what a member may do is the list on a self-managed host and the
    permission the token carries on a hosted one (249), and a call
    without it is refused and recorded as refused; the switcher shows
    an instance the identity is not a member of as not a member.
    The instance's package store and a host's package store are
    separate surfaces.

<!-- ANCHOR_END: a26 -->
### A.27 Machines, types and context
<!-- ANCHOR: a27 -->

223. The machines are of two tiers, and the tier is marked in the
    definition. A **core** machine — every object machine, every engine
    machine, and the structural templates for a line, a place, a
    session and a stage — ships with the release and is never edited by
    an instance; the atoms, the schema and the bindings are core
    with it. An **extensible** machine — a unit type or an elaboration
    type — is a file an instance adds or overrides under the
    prefix in its blueprints (203), and so are the deliverables, the
    vocabularies, the instructions, the schemas and the skills (119,
    190, 198). A core machine may name an extensible one only when the
    release ships that file and lists the reference as an exception; an
    extensible machine composes only templates and atoms that exist
    (57, 87). Changing a core machine is a flywheel release with a new
    set version (208) and the conformance suite green (92–95); changing
    an extensible file is a chore (123). The machinery never moves an
    object because its machine changed: an object in a state its
    machine no longer has is reported under attention (81).
223a. The claim shape is core (223). A requirement block with a stable
    name and at least one scenario, a change directory holding one
    delta per capability, an archive at landing that merges the deltas
    into the standing specifications, the content hash of the block as
    its version, and the `Claim:` line naming the served claim on the
    built side are what every machine, atom and proof reads, and no instance
    changes them. The format that carries the shape is OpenSpec, a
    given (section 9), and a second format beside it is not a goal
    (section 8). What is extensible is what goes into a block: the
    schemas a deliverable must satisfy, the instructions that shape
    what a session writes, and the skills that produce it (88, 119,
    120, 190) are files an instance adds or overrides under its prefix
    like any other extensible file.
224. Every machine file carries a version, and the release carries a
    set version that names the version of every core machine and every
    shipped extensible file (208). An extensible file names the set it
    was written against, and a set the installed flywheel does not read
    is refused (123). An object records the version of the extensible
    machine it runs under (57) and the set version it was created
    under. The registry is a manifest in two parts, validated as one:
    the release's manifest of what it ships, and the instance's
    additions, rendered under the prefix as a registration that lists
    every type name, every version seen, the blueprints commit each first
    appeared at, and whether it is shipped, overridden or added. The
    check runs on every blueprints commit and on every host at every fetch,
    over the union: every reference resolves, every parameter supplied
    is declared, every final a parent waits for exists in the machine
    it names, every deliverable name resolves (190), and every version a
    live object records is present; a version is retired only when no
    live object records it, and a change that would move an object in
    flight is refused and reported (57, 79).
225. Every machine is rendered as a statechart by the build, from its
    definition and nothing else: regions, states, decision kinds,
    finals, submachines, transitions with guard, effects and enter
    commands. The rendering is a build output beside the definition,
    listed with the machine's kind, version, object and the
    requirements it satisfies, and it is what the operator reviews at
    every change to a machine (83); a rendering drawn by hand is not a
    rendering of the machine.
226. The context every kind of session is handed is data, not prose:
    for every session type — each machinery-charged session, each
    elaboration type, each stage of each unit type — one enumeration of
    what its work order carries: the schema instruction, the type
    skill, the work order fields, the artifacts of the change, the
    chapters and claims, the map elements with their homes and
    attachments (211), the surface specification when its work is about
    a surface (212), the deliverables with their producers, schemas and
    surfaces in force (190), the identity (197), and what it must never
    receive (89). The engine renders every work order from that data
    and from nothing else, a test renders it for a given session type,
    instruction version and scenario without starting a session (90,
    124), and a test asserts that what a work order carries is exactly
    the enumeration and that what it must never receive is absent. A
    session type whose enumeration is incomplete is not a session type
    the machinery may charge.
227. Every deliverable entry, shipped or added by an instance, names
    the store the machinery carries it into and the session types that
    are fed it, beside its producer, schema and surface (190). The
    machinery carries a deliverable into its named store by an effect
    with a proof and feeds it to a session only through that session's
    work order (89); a deliverable whose entry names no store is
    refused when the type file is loaded, and the refusal is reported
    (79).

<!-- ANCHOR_END: a27 -->
### A.28 Packages and setup
<!-- ANCHOR: a28 -->

228. A package is one thing of one kind: an adapter, a chat sink, a
    runner, a router, a sign-in, a unit type or an elaboration type, a
    deliverable producer, a map vocabulary, a template, or a scenario
    pack. A per-host package installs on a named host; an instance
    package installs into the blueprints under the prefix (203) and is read
    by every host at the shared line, so no two hosts can differ on a
    type. A package is a git repository at a tag, listed in an index
    that is a file; the shipped set is the default index. A package
    declares the set version it needs (208), its configuration schema
    and the secrets it needs, and is content-hashed and registered
    (224).
229. The setup surface stands apart from the operator's decisions. It
    shows each host's parts with their state — installed · added,
    awaiting install · needs a secret · installing · disabled — and the
    index, instance packages and per-host packages apart. Adding a
    package collects its configuration and names its secrets in the
    same flow, then raises one install decision whose yes runs the
    install as effects with proofs (204); a secret not yet placed is
    under attention (207). A package's configuration is changed on the
    same surface with one response. Removal is a response that ends
    what the package runs and keeps its records. Nothing on the surface
    enters the count except the install decision.
230. A host is added from a host that exists. The operator picks a
    platform and the parts; provisioning runs with the operator's own
    platform credentials, which are never stored; only the chosen
    parts' secrets are handed to the platform's secret store, on
    confirmation. An enrolment decision carrying a one-time, expiring
    token admits the host (205); a host already running the binary is
    adopted by the token alone.
231. The tick is the scheduler. Every timed behaviour of a host,
    adapters included, is a guard on the host's tick, and nothing else
    keeps time. A host is one long-lived process that the platform's
    own launcher starts, so joining installs that one entry; a run
    missed while the host was down is caught up on the next tick, and
    the idempotent key (111) makes the catch-up write nothing twice.
232. Several hosts run on one computer, each a separate process with
    its own host id, root on disk (205), multiplexer session, port range
    from the router (191), heartbeat and leases, so that any scenario
    the model states about hosts — a host lost, a takeover, a bound
    reached, a disconnected host reconciling, several instances —
    can be run and watched on a laptop with no second machine. Two
    hosts on one computer share nothing but the git host and are told
    apart by id alone; the scenario tool (95) can start, stop and
    disconnect them by name.

<!-- ANCHOR_END: a28 -->
### A.29 Users and ownership
<!-- ANCHOR: a29 -->

234. An account's operators are identities of the host's kind (243):
    on a self-managed host the GitHub usernames of the authored
    operators list, on a hosted tier the users assigned to the account,
    derived and never authored (247). They are the operators of every
    instance the account holds (219). Authorship
    is the GitHub username in either kind (246), and every response
    carries the identity (153). A page served on the operator's own
    computer signs in through the same kind, so the identity is the
    same there as anywhere.
235. One board per flywheel. Every member sees the same rail with
    the same numbers and the same count. A decision answered by one
    member is applied once (7) and shown to every other member as
    answered, by whom and when (153); a second response to it is
    refused as already answered.
236. Sinks are per member. Each member's page and chat are sinks of
    their own with their own delivery mark (14, 148), so the tail since
    the last look, attention acknowledgements and notifications are
    that member's. A shared channel is a sink of its own with one mark.
236a. An entry in the account's operators list carries the member's
    address per chat kind — a Discord user id, a Slack member id —
    keyed by the member's identity (247). Each instance's sinks gain
    one chat sink per member per address, presented by whichever host runs that kind's
    package (228) and holds the lease (148); a member with no chat
    address has a page sink only. Adding or removing an address adds or
    removes the sink in the same write as the list. On a self-managed
    host the list is authored whole; on a hosted tier its identities are
    derived and only the addresses are authored, and adding or removing a
    member is an act on the account (255), never a commit.
237. A decision may carry an owner, and an owner is one member or
    nobody: a role is never an owner. Planning's proposal, the unit or
    elaboration type, or a
    member's response (assign) sets it, and the member named must be one
    of the account's (247); an unowned decision is
    everyone's. The rail and the chat filter to a member's own.
    Ownership never changes what a decision is, whether it counts, or
    who may answer it.

<!-- ANCHOR_END: a29 -->
### A.30 Environments
<!-- ANCHOR: a30 -->

238. Every tracked repository declares the environment its sessions
    need — tools and their versions — in one file the instance reads
    under its prefix (203), or by naming the repository's own
    devcontainer or devenv definition. The machinery binds the
    declaration to a provider per host (devenv, devcontainer, nix, or a
    container image; a binding, 139) and activates it in every place
    before a session starts (43); the environment's version is recorded
    with the place. A host that cannot satisfy a repository's
    environment covers none of its work and says so under attention
    (149).
239. A platform host is created from an image that satisfies the
    environments of the repositories it will cover. Building the image
    from the declarations is an effect, repeatable (204); an image
    behind the declarations is visible on the hosts surface, and
    rebuilding it is a chore (123).

<!-- ANCHOR_END: a30 -->
### A.31 Host pools
<!-- ANCHOR: a31 -->

240. An instance may declare a pool: a platform that provisions
    hosts on demand from the image (239), up to a bound, each joining by
    an enrolment token the machinery issues (230), covering what the
    pool declares, and retiring when idle for a stated time. A pool host
    is ephemeral: it holds no place past its life, and a place it held
    is re-made from its line on another host (52). The hosts surface
    shows the pool, its bound and its live hosts; the operator never
    needs to see a pool host.
241. A pool host serves one flywheel. A host serving several
    instances (218) is the operator's own machine. A service run for
    many instances gives every instance its own pool, and
    nothing is shared between instances but the platform.
242. The machinery adds pool hosts while approved work waits behind the
    bound and drain is the limit (214), within the pool's bound and the
    cost setting the manifest names, and retires them as the queue
    drains. Every such change is an effect with a proof, and the
    flywheel instrument shows it as drain changing.

<!-- ANCHOR_END: a31 -->
### A.32 Identity
<!-- ANCHOR: a32 -->

243. The identity provider is a host binding with two kinds. `github`,
    for self-managed hosts: the page signs in with GitHub's device
    flow, the GitHub username is the identity, the manifest's authored
    operators list with its addresses is membership (236a), every
    operator listed holds every permission on their own instance,
    and flags stand at their definition defaults. `frontegg`, for the
    hosted tiers: identity is Frontegg's through its SDK — the page
    runs the React SDK and the tool server verifies the token it
    carries — with one Application for the whole instance, and
    everything below that names Frontegg applies there and only there.
    In neither kind does the flywheel talk to an enterprise directory
    for sign-in; GitHub stays the git host and the App that reaches the
    repositories (207). A host declares its kind, the same for every
    instance it serves (233).
244. On a hosted host sign-in is Frontegg's hosted login. The SDK builds
    `redirect_uri` from the origin the page is served on, so the host's
    served name is the only per-host fact and it is registered once, as
    an entry on the environment's redirect list, never per flywheel.
    A self-managed host's device flow needs no redirect and no
    registered name.
245. The page on the operator's own computer serves on a localhost
    port, any port, with no proxy and no name required of the user, and
    several hosts on one computer (232) are several ports. Advice on
    portless or a proxy may be given and is never required; the
    flywheel serves no name of its own and adds no redirect entry at
    run time.
246. On a self-managed host the identity is the GitHub username. On a
    hosted host the identity is the Frontegg user, GitHub one social
    connection on it, and the GitHub username the connection carries is
    what authorship uses — commit trailers, pull requests, the git
    host's view of who did the work; a user with no GitHub connection
    may respond and may not be an author, and the flywheel asks for the
    connection at first sign-in. Authorship is the GitHub username in
    both kinds.
247. Membership is held by the account, not by the instance, and the
    account holds the instances (219). On a hosted tier membership is
    the assignment of the flywheel Application to the account's
    Frontegg account — a top-level account, except that the hosted
    service creates its tenants as sub-accounts of the service's own —
    and assignment is the whole of "may respond in it" (233), for every
    instance the account holds; the operators list is derived from the
    account's assigned users at every fetch and rendered read-only,
    only the members' chat addresses (236a) staying authored, and
    adding or removing a member is an act on the account, never a
    commit. On a self-managed host the account is the authored
    operators list in the manifest, edited on the settings form, one
    response per save. Either way the list is per account, and a
    member's chat address per member per account, so a member reads
    every instance of the account under one identity.
247a. Moving an instance to a hosted tier is the upgrade: the service
    creates an account for it, or the operator picks an account they
    already hold, invites the same GitHub usernames the operators list
    carries, and carries every address over; the list is derived from
    then on. Nothing else about the instance moves (218).
248. On a hosted tier roles are held per account and carried in the
    token; a role assigned on a parent account applies down the branch,
    so a tenant inherits the service's roles, and the manifest's roles
    are derived, not authored. On a self-managed host every operator
    listed holds every permission, and a decision's owner names a
    member (237). In both, the rail filters on the owner.
249. On a hosted tier permissions are read from the token by the tool
    server: before any op-response is written the server checks the
    caller's token for the permission the tool declares, on the
    account; a call without it is refused, no response
    is recorded, and the refusal is written to the run record with the
    identity, the tool and the object (79, 153). Membership admits the
    identity to the instance; the permission authorizes the tool.
    On a self-managed host the check is membership in the operators
    list, with the same refusal and the same record.
250. On a hosted tier feature flags are entitlement features, one flag
    per feature, keyed `fw.ff.*`, evaluated in the page and on the tool
    server, and targeted per account only. A flag hides a surface; it
    never authorizes, and the tool behind a hidden surface is still
    guarded by its permission. On a self-managed host every flag stands
    at its definition default.
251. Agents never sign in through the browser. A session in a place acts
    with the identity token the machinery issued it (197) and reaches
    the git host with the App's installation token (207); no session,
    host process or dispatch agent holds a user credential of either
    kind.
252. The definitions — permissions, roles, features and flags — ship in
    the flywheel binary with the set version (208, 224) and are the one
    place they are defined. Only the hosted service's release syncs
    them to the Frontegg environment: the sync reads the environment's
    current definitions and writes only the difference, respecting the
    provider's write ceiling on features, plans and flags; it deletes
    nothing not named as retired, and it never writes a hostname. A
    self-managed host has no environment and never syncs; a hosted host
    whose binary names a permission the environment lacks refuses that
    tool with the reason.
253. A self-managed host signs in every operator through GitHub's
    device flow; there is no local-user case and no unauthenticated
    page. An instance created on a self-managed host lists its
    creating user first in the operators list, so a fresh instance
    is never locked out and a single operator is never asked to
    administer roles. An instance created on a hosted tier is a
    Frontegg account whose creating user holds `owner`.
253a. Until an instance lists more than one operator, a
    self-managed host may serve the page on the operator's private
    network with no sign-in. The single entry of the operators list is
    the identity every response records as given by (153, 236a), the
    private network is the boundary (155), and the host refuses to
    serve unsigned-in as soon as a second operator is listed or the
    page is reached at any address but that network's. This is the one
    exception to 253, and it closes when the account item (233) exists.
254. A hosted host degrades rather than fails when Frontegg is
    unreachable. A token already issued is honoured until it expires;
    past that the page is read-only — the status view, the book and the
    map render, the rail shows its decisions and every control that
    would write is absent, with one attention line saying identity is
    unreachable and since when — for as long as it takes, unbounded. It
    is irrelevant to work: hosts cover work with the App token, not
    with an identity, so the loops keep running and nothing that needs
    a response is answered. Flags fall back to their last-seen values,
    and to their definition defaults when none were seen. A self-managed
    host has no provider to lose: GitHub unreachable blocks a new
    sign-in and nothing else.
255. On a hosted tier identity administration is a surface of the
    instance, not a second console: the account item lists the
    instance's members with their roles and their chat addresses,
    invites a user to the account, grants and revokes the Application,
    and targets a flag on the account. Every one of those is a tool
    call under the identity administration permission, recorded like
    any response (153). On a self-managed host the operators list on
    the settings form is the administration.

<!-- ANCHOR_END: a32 -->
### A.33 Tenancy and encryption
<!-- ANCHOR: a33 -->

256. Everything a shared host keeps between ticks is encrypted at rest
    under a key naming one instance: the clone cache, the body of
    every queued capture, every store holding its content. A store keyed
    per filesystem, volume, queue or table holds no instance's
    content in the clear; it is sealed under that key inside the store.
257. The instance's key is unwrapped only for the duration of a tick
    and only by the role that runs it. The plaintext data key exists in
    a process evaluating that instance's rail and at no other time.
258. The cache is a projection and its loss costs a clone. An
    instance idle past a stated time keeps nothing warm, and its
    next tick re-clones.
259. A shared host assumes a role scoped to one instance for the
    duration of that instance's tick, so one compromised credential
    reaches one flywheel. The scope may be carried by a session tag
    naming the instance, matched against the tag on every key and
    object it opens, so the number of instances is bounded by no
    count of roles. The match is written as the role's own policy over
    every key and object of the account, the resource's instance tag
    equal to the session's, so no key names a role and no role is added
    for a flywheel.
260. A key that is unreachable, deleted or behind a role that no longer
    trusts the service, fails closed. No tick proceeds on state it
    cannot open, every host of that instance shows one attention
    line naming the key and since when (149), running work is not
    interrupted, and nothing is kept unencrypted as a fallback.
261. What the service holds and under which key is a stated fact of the
    tier, rendered on the settings form (233): which stores hold the
    instance's content, which key opens them, which role may use it,
    and when the cache was last evicted.
262. A shared host reads the manifest, the register, the leases, the
    sink's mark and the machinery's prefix (203) and nothing else. The
    clone is partial and sparse to exactly that set, and a read outside
    it is a refusal in the run record (79).
263. Raw material a capture points at (217h) is never read on a host
    serving more than one flywheel. Triage (217e) that must follow
    a pointer into the raw store runs on the operator's own machine or
    on a pool host, and the manifest's raw store is reachable only from
    those. A capture whose whole content is already in hand carries no
    pointer and needs no raw store, so a shared host may triage it in
    the tick that took it.
264. Code is never on a shared host. A built repository is cloned only
    into a pool host serving one instance (241), and retire destroys
    that host and its disk (240).
265. An instance may declare that the machinery writes its state
    records as envelopes under its key. Paths, file names and commit
    metadata stay plaintext, because list, the count and the
    compare-and-swap read only those (162). It is a declaration, never
    the default.
266. Under that declaration the blueprints repository stays plaintext
    except the machinery's own prefix (203), where captures and signals
    are envelopes under the same key. The manifest, the book, the claims
    and the map are read by people and are never encrypted.
267. An instance's key has one of three homes: the operator's own
    hosts when the instance is self-managed, a key tagged with that
    instance in the service's account, or a key in the
    customer's own cloud account reached through a role that trusts the
    service's issuer for that flywheel. The home is a stated fact of
    the tier (261), moving between homes re-wraps data keys and changes
    no history, and in the third home the service holds no credential:
    each tick assumes the role with a token minted for it, and deleting
    the role ends every path.

<!-- ANCHOR_END: a33 -->
### A.34 The hosted tiers
<!-- ANCHOR: a34 -->

268. The tiers are four, named by what exists on the service side. Tier
    0 is your computer: the binary on the operator's own machine, its
    own sign-in kind (243), and nothing of the instance's on the
    service side at all. Tier 1 is the cloud agent: a capture queue, a
    key, a role, a warm cache object and a scheduler entry for the
    instance, with no pool, so the operator's own machines still
    build. Tier 2 is pools: tier 1 with hosts provisioned on demand from
    the instance's image (240). Tier 3 is your account, in two
    shapes the instance chooses in the management console: **stores
    only**, where the key, the capture queue, the warm cache and the
    pool image live in the customer's own cloud account and the service's own
    compute reaches them through a role the instance grants (267,
    276); and **stores and compute**, where the binary itself is
    provisioned into that account through the same granted role and
    nothing of the service's runs there but the control plane (276a).
    A tier is a binding named in the manifest (217j) and never a second
    machinery.
269. On the hosted tiers the dispatcher is one function per tier, and
    each invocation is one instance's tick. It assumes the tier's
    role under a session tag naming that instance (259), fetches,
    evaluates, pushes by compare-and-swap (162), delivers the rail,
    wipes its scratch and exits, retaining nothing between invocations
    (217a); the sandbox is reused across instances, so retaining
    nothing is the tick's own act, its scratch wiped and its data key
    dropped before exit. It runs a model. A tick has a fixed budget the
    placement states, fifteen minutes on the function placement; when
    the budget is short the tick carries triage before it carries a
    reply. The interpreter that answers a message is
    one bounded call per message on the in-process runner (216, 217b,
    217c), and the triage of a self-contained capture, one whose whole
    content is already in the queue such as a chat message or a webhook
    body, runs beside it (217e); both are bounded per tick, and what
    does not fit is carried to the next tick. Which of the two a tick
    runs at all, and at which model class, is the plan's fact (294): a
    plan that buys neither has its free text interpreted in the page
    (216a) and its self-contained captures triaged in one daily batch
    at the sweep (273, 281). Two things never run in
    it: triage over raw material a capture points at, which is a
    transcript on the operator's own machine or in a store they own
    (263), and every elaboration and construction session. Those run on
    a machine of the operator's own or on a pool host. It never holds
    code (264): the declaration it runs takes no object kind, no
    repository and no unit type (217), so there is nothing for it to
    clone. A failure in one instance's tick ends that tick and no
    other (218). Model access on a hosted tier is the service's, carried
    by the tier role and metered into the rail (279, 294), unless the
    instance places a model key of its own instead (207); which
    model provider sees rail text and messages is named in the tier
    statement (261).
270. The tick is invoked, not looped. A long-lived process its
    platform's launcher starts is one invoker among several: a clock, a
    notification, an arriving capture, a chat event, a request for the
    page. Every invoker produces the same tick, and a run missed while
    nothing invoked it is caught up by the next one under the idempotent
    key (111). This amends 231: what 231 requires is that nothing but
    the tick keeps time, not that a process stands. Every invoker
    enqueues on the instance's queue and the queue admits one tick
    of an instance at a time, the instance naming the group the
    queue serializes, so the scheduler's target is the queue and never
    the function. A request for the page is a read under the caller's
    identity and is not an invoker (291).
271. On the hosted tiers the capture endpoint (216) is a managed queue
    per instance with one stateless receiver of the machinery's in
    the acknowledgement path, which verifies the caller's signature,
    answers the platform's liveness check, acknowledges within the
    platform's deadline, and routes by workspace to the instance's
    queue; it holds no key that decrypts and reads no queue. The
    receiver may encrypt what it enqueues and never decrypt, so its
    grant on an instance's key is the encrypting one and the
    tagged session of 259 holds the decrypting one. The item waits for
    a tick. The queue is the caller's retry buffer and not
    state. A capture is captured when its commit lands, a lost queue is
    indistinguishable from a call that never arrived, and a repeat under
    the same key writes nothing (111). Every body it holds is encrypted
    under the instance's key (256).
272. The warm cache is one encrypted object per instance (256)
    holding a bundle of two sparse shallow clones: the state repository,
    and the blueprints restricted to the manifest, the claims and the
    machinery's prefix (203, 262). A tick downloads it, works in its own
    scratch, and uploads it back; it is mounted nowhere and shared with
    nothing. It is evicted when the instance has been idle past the
    stated time, and the next tick re-clones (258).
273. Scheduling on the hosted tiers is one named entry per flywheel.
    At the end of every tick the machinery upserts a single one-shot
    entry carrying the due time the machines computed, deleted when it
    completes. The name is the instance's, so an interim tick
    replaces the entry with its own due time, earlier or later, and at
    most one entry per instance ever exists. An entry that fires and
    finds nothing due is one idempotent tick that reschedules or deletes
    (111). A daily sweep is the backstop for an entry never written. The
    set of entries is a projection: it only shortens the wait, ticking
    rebuilds it, and its loss costs a sweep and never a decision (136).
274. Notification is the primary way a host learns of new state and the
    poll is the backstop (166). The bound is stated per notification
    channel: seconds where a live push reaches the host, a named
    interval where none does. No unconditional poll is the floor, since
    a poll costs the service for every instance whether or not
    anything happened.
275. A pool host on a hosted tier is a microVM created from the
    instance's image (239) when the rail approves work the pool
    covers. No shared network of the service's is required, a container
    runtime runs inside it so a repository's own environment declaration
    works unchanged (238), and it is terminated at retire and never
    suspended, so its disk goes with it (240). The placement states a
    fixed maximum lifetime, and the manifest names a fallback placement
    for a session that must run longer. It serves one instance (241)
    and holds that instance's code and raw material for the length
    of the work, on a disk the platform isolates per host and destroys
    at terminate under the platform's own encryption; an instance
    whose tier statement must name its own key on that disk (261) binds
    its pool to a placement that takes one, a container task with a
    volume under the key. The image is built on a pool host or the
    operator's own machine and never on a shared host, because building
    it reads the repositories' environment declarations (238, 239), and
    its artifact is stored under the instance's key (256).
276. Tier 3's first shape, stores only, is federation. The instance
    creates one role in its own
    account whose trust admits the service's issuer with the
    instance as the subject, and the key, the warm cache, the
    capture queue and the pool image live there (267). Each tick assumes
    that role with a token minted for that tick, so the service stores
    no credential of the instance's and has nothing to rotate or
    leak, and every use of the key is logged in the instance's own
    account. Revocation is deleting the role: the next tick refuses with
    the attention line 260 requires, and running work is not killed. The
    customer registers the service's issuer as an identity provider
    in their own cloud account and allows the role's session to be
    tagged with the instance, and the
    token the service mints carries the instance as a principal tag,
    because a web-identity session takes its tags only from the token it
    presents. The only standing grants in that cloud account are
    the role's trust and the key's grant to that role. The wake from the
    instance's queue carries the instance's name and nothing
    else, and the tick reads the queue itself under the assumed role, so
    nothing of the service's stands with a decrypting grant on the
    instance's key and deleting the role ends every path.
276a. Tier 3's second shape is stores and compute. The binary is
    provisioned into the customer's own cloud account through the same
    role it grants (276), and nothing of the service's runs there.
    What stays on the service side is the control plane and no more: a
    **registry** of instance names, tier, health and counters; a
    **deployer**, which applies the stack through the granted role and
    stamps the binary's version (208); and **identity**, the provider's
    environment holding the redirect entry for the host's served name
    (243, 244, 291). The chat application is still the service's (277,
    290), so rail lines arrive from one bot. Under this shape the
    management console offers dedicated compute, created in the
    customer's own cloud account by the deployer through the same role, and
    each option is stated with what it changes: the dispatcher as an
    invoked function (269) or as a long-lived container, on a container
    service or on an instance of the instance's own; and pools on
    microVMs, on container tasks or on such instances (275). A
    long-lived dispatcher holds the chat platform's gateway socket, so
    free text in a channel is answered where an invoked function must
    take a slash command (277); pool hosts on an instance have no
    lifetime ceiling, so the fallback placement 275 names is not
    needed. Enterprise includes both shapes (281).
277. On the hosted tiers the chat sink's identity may be the service's
    own Slack or Discord application, installed into the instance's
    workspace and scoped to the instance's channel, beside the bot
    the manifest names and the token the operator placed (217d). It
    carries rail text and the interactions it receives and nothing else:
    no repository reach and no key. The record still names who responded
    (153); the application is the service's. On a function placement
    Discord free text is the string option of the application's slash
    command; plain replies in a channel are read only by a placement
    holding the gateway socket. Slack free text arrives over the events
    subscription and needs no socket. The receiver answers an
    interaction with a deferred acknowledgement inside the platform's
    deadline (271), and the tick posts the real reply within the
    interaction token's window or as an ordinary message from the
    application.
278. An intermittent host (150a) keeps its place on a hosted tier. A
    laptop closed past its stale window is away, its leases stand and
    its sessions' clocks pause, and the cloud agent keeps ticking
    everything else, so decisions are delivered and answered and
    captures are accepted and queued while the machine that usually does
    it sleeps. What waits for the lid is only the work that host alone
    covers, and triage still runs only where 263 allows.
290. The receiver of 271 and the chat application of 277 are the two
    shared components of the hosted tiers, and they are the only two.
    Each sees an inbound payload once, in transit, and keeps nothing;
    each is a stated fact of the tier (261). No other process of the
    service's is reached by more than one instance's traffic.
291. The page and the tool server on a hosted tier are served at the
    tier's name by the same function on request, under the caller's
    token (243, 249). The page is a static bundle served at that name.
    The tool server is the binary's own catalogue of tools (193),
    reached over HTTP with the identity token by the page, and over
    standard input and output or in-process, in the shape of the model
    context protocol, by sessions and by the interpreter; the agent is a
    client of the tools and never serves them. A request is a read under
    the caller's identity and never a tick (270), and it neither
    downloads nor decrypts the warm cache (272). The page sink's
    delivery is the tick writing one small page projection per
    instance — the status view and the rail as data, carrying each
    member's page sink and its mark (14, 148, 236) — to an object
    encrypted under the instance's key (256). A request names the
    instance in its path (205a): the server checks the caller's
    token for that user's membership of that instance (247, 249),
    assumes the tier role tagged with it (259), decrypts that one
    projection and returns it. So a request costs one small decrypt and
    reaches neither the git host nor the bundle, and nothing of another
    instance is ever decrypted on a request, because the tag is the
    path's flywheel. A write is a tool call enqueued on the
    instance's queue, which decrypts nothing (271), and it is
    captured and ticked like any other. The instance switcher lists
    only the instances the caller's token is assigned to; one they
    are not assigned to is not shown. On a hosted tier the bundle is
    held in an object store behind a content distribution at the served
    name, which fronts the store for the bundle and the function for the
    tool paths, and it is uploaded at release so its version is the
    binary's (208). A self-managed host embeds the same bundle in the
    binary and serves it itself.
292. An invoked host is alive while its scheduler entry stands or its
    queue holds items. It heartbeats once per tick, its stale window is
    the due time it wrote plus the profile's grace, and 150's takeover
    is raised for it only past that. A host with no entry, no queued
    item and no heartbeat is gone.
293. The tool server at a host's address is a remote server of the model
    context protocol, and its clients are the page, the chat
    application, the interpreter, the sessions the machinery starts
    (over standard input and output or in-process) and a member's own
    client, such as a coding agent on their machine (193, 291). Every
    client is checked by the same rules: membership admits the identity
    to the instance and the permission the tool declares authorizes
    the call (248, 249). The authority a client signs in against is the
    host's identity kind (243), so a hosted host's clients hold a
    Frontegg token and a self-managed host's hold what its device flow
    issued, and a member adds a self-managed host to their own client at
    its localhost address (245) as readily as a hosted one at its served
    name. The catalogue a client is shown is the tool catalogue filtered
    by that caller's permissions, so a tool the caller may not invoke is
    not offered. A tool call from any client is a response recorded like
    any other, with who gave it and when (153).

<!-- ANCHOR_END: a34 -->
### A.35 Plans and presets
<!-- ANCHOR: a35 -->

279. On a hosted tier an instance has a plan: a named set of the
    entitlement features 250 defines, keyed `fw.ff.*`, together with a
    few stated limits, held by the identity provider and billed through
    the payment provider. The flywheel reads it only from the identity
    token and the provider's SDK; it keeps no rail of its own and asks
    no billing system a question at run time. A self-managed host has no
    rail at all, and every flag stands at its definition default there
    (250).
280. A plan hides and it meters; it never authorizes. Permissions come
    from roles and are checked on every tool call (248, 249), and a
    surface a flag hides is still guarded by its permission. Exceeding a
    limit is one attention line (149) and a refused add with the reason,
    never a stopped loop: work already running runs, and the machinery
    never halts a tick over a rail.
281. The ladder is five rungs over the four tiers (268), and what each
    unlocks is a requirement while its price is not. **Free** is tier 0:
    the binary, its sign-in, the instance's own App and bot, every
    package and every surface, with nothing running on the service side.
    **Hobby** is tier 1, and it is cheap to run and needs no model key
    of the operator's. Its chat is structured: a decision carries its
    answers as buttons, and free text in chat is a slash command with
    its arguments (`/fw yes 412`, `/fw capture <text>`), so no model
    call is spent on chat and the rail delivered to chat costs no model
    at all (277). Free-text interpretation on Hobby is the page's
    instead: the model running in the page's browser does the
    interpreter's job there, at no cost to the service (216a). A
    capture that arrives as a chat interaction or a webhook is captured
    at once, which needs no model, and a self-contained capture (217e)
    is triaged in one daily batch at the sweep (273) on the small model
    class, inside a stated included budget of captures a month (294).
    Immediate triage, and free-text interpretation in chat, are
    unlocked on Hobby by placing a model key of the operator's own
    (207) and are included from Pro up. So chat is usable with the
    laptop closed, and the rail reaches the instance's chat and the
    page at a served name (291). What waits for the operator's own
    machine or a pool host is raw-material triage, elaboration and
    construction. **Pro** adds pools with an included allowance and
    metered overage, the package store, the book viewer and the presets,
    and includes the immediate triage of self-contained captures and
    the interpretation of free text in chat, both in the tick (269).
    **Team** adds members with roles, ownership and assignment (237),
    identity administration (255), the management console, a higher
    ceiling on a pool host, and the raising of a job's model class
    above the small one (294). **Enterprise** is tier 3 in both its
    shapes (268, 276, 276a): the customer's own cloud account holding the
    stores alone, or the stores and the compute with the dedicated
    compute options the console offers; enterprise sign-in and
    provisioning through the instance's own directory; a dispatcher
    of its own, in the service account under the first shape and in the
    instance's own under the second; audit export and a private
    pool image.
282. Limits are plan metadata and not flags: how many instances, how
    many members, how many pool hours are included, and how much memory
    a pool host may take. The tool server reads them beside the flags
    and refuses the add that would exceed one, with the reason (280).
283. Adding a cloud agent asks nothing about routers or runners: the
    tier fixes both, the platform router at the served name and the
    in-process runner at bound zero (191, 217, 217c). One screen asks
    what the agent listens to and speaks through, its chat platform, its
    meeting source and its capture sources, and offers presets beside
    the selectors. A router or a runner is chosen only for a machine of
    the operator's own or an adopted host, under an advanced disclosure.
284. A preset is a package of the bundle kind: a named set of parts with
    their configuration defaults, offered as one choice and installed
    under one install decision for the whole set (228, 229). A bundle
    runs nothing itself, and removing it removes what it installed and
    no more. The shipped set covers the common cloud-agent shapes, and
    an instance publishes its own bundles in the package store like any
    package.
294. On every hosted plan the instance's own model key is welcome
    and never required (207). Each plan includes a budget on the small
    model class for the jobs the dispatcher runs inside a tick, reading
    a capture and answering a message (217b, 269), stated as a count of
    captures and messages a month; usage past the budget is metered
    through the payment provider like any other overage (279, 282), and
    an instance that places a key of its own is metered on none of
    it. The model class per job is a plan fact, not a flag: small on
    Hobby and on Pro, and raisable per unit type, per elaboration type
    and per stage on Team and Enterprise (285). Where a plan buys no
    in-tick model at all the work still happens, in the page's browser
    (216a) or in the daily batch (281), so a budget spent is one
    attention line and a slower cadence and never a stopped loop (280).
    The surface that lists a host's runners shows which model key that
    host uses and the month's model spend beside the pool hours, and
    the tier statement names which model provider sees rail text and
    messages (261).
295. What "add a host" offers depends on the host serving the surface,
    and the offers are the rail's and the identity kind's together
    (243). A self-managed host offers only hosts the operator controls:
    another computer of theirs, a virtual machine on their own network,
    a container on a platform of their own reached with their own
    credentials and their own secret store, and adopting a host already
    running the binary (230). It offers no cloud agent and no pool, and
    in their place shows one line offering to move the instance to
    the hosted service (247a). A hosted host offers those same options
    and the managed ones beside them, each gated by the plan (279–282):
    the cloud agent from Hobby, pools from Pro, and under tier 3's
    second shape the dedicated compute options on Enterprise (276a,
    281). What the flow asks after the choice is 283's: a managed host
    is asked nothing about routers or runners, because the tier fixes
    both, while a machine of the operator's own is asked for each under
    the advanced disclosure. The flow itself is the guided one the
    surface specification carries (212, S120).

<!-- ANCHOR_END: a35 -->
### A.36 Rulings carried over
<!-- ANCHOR: a36 -->

285. Every unit type and elaboration type declares the model class each
    of its stages runs, so a stage that reviews code may name a
    different class from the stage that writes it. The runner's own
    model is the default where a type names none. This amends 173: the
    manifest's per-role model is the fallback, not the rule.
286. A scenario pack (228) is a development-time instance package.
    It is hidden behind a flag (250) and is never listed in the
    production index, so an instance's operator never meets one by
    browsing the package store.
287. Packages contribute renderers, adapters, sinks, runners, routers,
    unit and elaboration types, deliverable producers, map vocabularies,
    templates and bundles, which extends 228's list with the bundle kind
    (284). They never contribute a core surface: the rail, the board,
    the dock and the console ship in the binary and are the same on
    every host, so no package moves what the operator answers or where
    they answer it.
288. The binary carries its own instrumentation: captures about its own
    operation, its stalls, its refusals and its runway readings (214),
    written to the agentplot instance's instance through the capture
    endpoint (216). They carry no instance content, only the
    machinery's own readings. It is on by default on the hosted tiers,
    where it is a stated fact of the tier (261), and off by default and
    opt-in on a self-managed host.
289. Code isolation is the guarantee the settings form's tier statement
    names (261): a built repository is cloned only onto a host serving
    one instance, and that host is terminated with its disk when the
    work retires (264, 240, 275). No shared host of the service's ever
    holds an instance's code.

<!-- ANCHOR_END: a36 -->
### A.37 The control plane
<!-- ANCHOR: a37 -->

296. There are two products. The **flywheel binary** is open source under a
    permissive licence, and it is everything a self-managed operator runs:
    the machines and the profiles, the page bundle with the rail console
    and the management console, the tool server and its model context
    protocol endpoint (193, 291, 293), the adapters, runners and routers
    (191, 215), the definitions of permissions, roles, features, flags and
    plans (252), and the command line. Nothing is held back from it to make
    a hosted tier work, so tier 0 is the whole product with no service side
    (268, 281). The **control plane** is commercial, source-available to
    enterprise customers for self-hosting, and it is everything that exists
    on the service side: the receiver (271, 290), the per-tier dispatcher
    packaging with its roles and tags (259, 269), the queues (270, 271),
    the scheduler (273), the warm cache and page projection stores and
    their keys (256, 272, 291), the page distribution (291), the registry,
    the deployer (276a), the identity environment and its sync (243, 252),
    the plan and billing integration (279, 282, 294), the pool image build
    and provisioning (239, 240, 275), and the shared chat applications
    (277, 290). Neither reimplements the other: the control plane
    evaluates no guard and decides nothing; it invokes the binary and holds
    what the binary cannot hold between invocations.
297. The line between the two products is the **invocation contract**, and
    it is public, documented in the open-source repository and versioned
    with the set (208). The control plane invokes the binary in two modes.
    In **tick** it provides the instance and its tier, a role session
    tagged with that instance (259), the warm cache and page projection
    objects, the instance's queue and the messages waiting on it, the
    scheduler entry now standing, the identity environment's issuer with
    the definitions version it holds, a model credential or none (294), and
    a scratch directory with a stated budget; the binary returns the cache
    uploaded, the projection written, the rail delivered, the shared lines
    pushed by compare-and-swap, each message acknowledged or left under its
    idempotent key (111), one next due time or a deletion, the run record,
    and an exit with the scratch wiped and the data key dropped (269). In
    **request** it provides the caller's identity token, the instance
    named in the path (205a), a role session tagged with that same
    instance, the page projection object and the definitions version;
    the binary returns the bundle or the projection, a tool call enqueued
    on the queue for a write, or a refusal with the reason and its run
    record (249, 291). A request is never a tick and never reads the warm
    cache (270, 272).
298. Five shapes in that environment are stated and are what a second
    control plane must match: the queue message, one envelope per invoker
    carrying the instance, the idempotent key, the source and a body
    sealed under the instance's key (111, 256, 271); the scheduler
    entry, one named entry per instance whose target is the queue
    (273); the cache object, a bundle of two sparse shallow clones (272);
    the projection object, the status view and the rail as data with each
    member's page sink and its mark (291); and the identity token's claims,
    the identity, the accounts assigned, the roles and permissions on the
    account, and the entitlement features with their flags
    (243, 248, 249, 250). The definitions version is the sixth and couples
    the two products in time (252).
299. Anyone may build a control plane to that contract, and ours is the
    reference implementation. A self-managed host and a hosted host run the
    same binary bytes: nothing is compiled differently and no behaviour is
    gated at build time, so a hosted host differs from a laptop only in
    what its manifest binds — a tier, an identity kind and a router (191,
    217j, 243).
300. The control plane is installable and customizable. It ships as one
    composition of applications and stacks — receiver, dispatcher,
    scheduler, stores and keys, page, registry, deployer, identity sync,
    billing, chat and pools — each stack holding one part of 296's list and
    taking the tenancy choices as parameters: the tier roles and the tag
    key with the policy that matches a resource's instance tag to the
    session's (259), the key homes (267), and whether the queue, the cache,
    the projection and the pool image live in the control plane's account
    or the instance's (276). Installing it is bringing the composition
    into an environment; customizing it is those parameters and no fork.
301. An installed control plane's identity environment is the installer's
    own: their environment with the flywheel Application in it, or any
    provider that issues the token claims of 298, the named provider of 243
    being the reference implementation. This amends 252, which assumed one
    environment and one release: the definitions still ship in the binary
    and are still the one place they are defined, and it is each control
    plane's own release that syncs them into its own environment, by
    difference, under that provider's write ceiling, deleting nothing not
    named as retired and writing no hostname. A self-managed host still has
    no environment and never syncs, and a hosted host whose binary names a
    permission its environment lacks still refuses that tool with the
    reason.
302. Billing is optional in an installed control plane. Where no payment
    provider is bound, the plans of A.35 are entitlement targets alone: a
    plan is still a named set of the `fw.ff.*` features plus its stated
    limits, it still hides and still meters and still never authorizes
    (279, 280), and nothing is charged. A control plane that sells nothing
    omits the billing stack and no other.
303. The shared chat applications of an installed control plane are the
    installer's own, installed into the workspaces it serves with its own
    ids, tokens and signing secrets. This amends 277 and 290 for such an
    installation: the two shared components are still exactly two, the
    receiver and the chat application, each seeing a payload once in
    transit and keeping nothing, and both belong to the installer.
304. A self-hosted control plane is the third shape of tier 3 and the
    fourth flavour of Enterprise (268, 276, 276a, 281). It is not shown in
    marketing and not offered in the management console; it is sold and
    installed by us. Under it nothing of the service's runs at all: no
    process of ours in the installer's accounts, no traffic of their
    instances reaching a machine of ours, no credential of ours
    reaching a key of theirs, and none of their instances in our
    registry. What stays ours is the releases with their set (208, 252),
    the invocation contract as a document, the control plane's source under
    the customer's agreement, and the record of who holds a grant. The
    first instance is a willdan-owned control plane deployed in
    switchboard.
305. From the binary's point of view a self-hosted control plane is
    indistinguishable from ours. A hosted host names an environment (252)
    and that environment may be any control plane's; every fact the binary
    reads about its service side comes through 297's contract and 298's
    shapes and through nothing else. This amends 268 and 276a where they
    read "the service side" as ours alone: read it as the control plane's
    side, which may be an installer's own, and the shapes of tier 3 are
    three — stores only, stores and compute, and the whole control plane
    installed.

<!-- ANCHOR_END: a37 -->
### A.38 The phone
<!-- ANCHOR: a38 -->

306. Every decision is answerable on a phone, and every control and every
    form the page carries is available there. Nothing the page offers is
    reachable only on a desktop, and nothing the phone answers is missing
    on the desktop (2, 155). This promotes S39 from a ruling of the
    surface specification to a requirement of the first build: a page that
    answers on the desktop alone has not met it.
307. The phone is the same served bundle under 760px, and never a second
    application. Its layout is two tabs, Decisions and Board, with the
    dock full screen and a back control, which is the desktop's metaphor
    at a smaller size and not a metaphor of its own (S38, S60). One bundle
    is built, one is served, and its version is the binary's (291).
308. Every chat rendering, every notification and every rail line carries
    a link to the object on the page, at the host's address with the
    instance in the path (205a). The link opens that object in the
    dock with its answer controls in reach. It works whether the page is
    served on a localhost port of the operator's own computer, over the
    operator's private network, or at a hosted served name (245, 291), and
    a link to a host that is away says so rather than failing silently
    (150a).
309. A decision raised reaches the operator's phone through the chat
    sink's own notification, carrying the answer controls the platform
    provides and the link of 308 (155). The page sends no push of its own,
    on any tier. The short reply grammar always works beside the controls.
310. The status view renders from one request, which on the hosted tiers
    is the page projection and its one decrypt (291). The page holds no
    client state a reload loses, so a reload after an answer shows the
    answer recorded, with who gave it and when (153, 154). The bundle
    carries no dependency the phone must fetch from anywhere else.
311. Every answer is one tap or one short reply. Nothing is reachable only
    by hover or by a keyboard, and anything a hover reveals on the desktop
    is reachable by tap on a phone (S61). A long-form answer, a proposal
    edit for one unit among several for instance, is given on the phone
    with the platform's own keyboard. An accelerator — the page's
    palette, a key, a short reply — never carries an operation that no
    control also carries.
312. The management console renders on a phone, its tables as cards. The
    managed add-host journeys complete on a phone, the cloud agent with
    its presets among them (283, 295), which is what Hobby promises an
    operator who has no computer of their own to run (281). A journey that
    needs a computer of the operator's says so on its card rather than
    failing part way through.
313. The tool server's clients include the Claude mobile app, and voice
    through it (293), under the same membership and permission checks as
    every other client (248, 249).
314. Every scenario of section 11 that carries an operator's response runs
    at a 390px viewport as well as at the desktop's, and the mockups
    render at 390px.

<!-- ANCHOR_END: a38 -->
### A.39 The book viewer
<!-- ANCHOR: a39 -->

315. The instance's book is served by a read-only viewer of its own,
    built from the blueprints' shared line: chapters as mdBook, each
    claim rendered where its chapter includes it by anchor from the
    standing specifications (97). The page links out to a chapter or a
    claim and embeds neither; every chapter and every rendered claim
    links back to the object at the host's address with the instance in
    the path (205a, 308). What is in flight is not in it.
316. The viewer's readers are the host's: on a self-managed host the
    private network is the boundary and the sign-in is 253's, with
    253a's exception; on a hosted tier it is served under the caller's
    token and reads to members of that instance alone (247, 249, 291).
    Serving a book to readers who are not members is one opt-in per
    book, stated on the settings form and revocable there, and a stated
    fact of the tier (261).

<!-- ANCHOR_END: a39 -->
## 5. Requirements — Part B, the state store contract
<!-- ANCHOR: part-b -->

The data plane reaches durable, shared state and the operator only
through these operations, and depends only on these guarantees.

### B.1 The operations

125. The state store offers exactly these operations, and the engine
    needs no others: read an object's evidence; write an effect; take,
    renew and release a lease on an object; present the rail's decisions and
    receive the operator's response; notify a host that state has changed;
    list the objects in a scope; serve the status view. An engine that
    needs a further operation is a change to this contract, stated
    here.
126. **Read.** Given an object's identity, the state store returns the
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
130. **Notify.** The state store tells a host that state has changed,
    within a bound the profile states, and without the host re-reading
    everything to find out. Notification only shortens the wait: a host
    that is never notified still converges by reading.
131. **List.** The state store enumerates the objects in a stated
    scope, so that an engine which remembers nothing can still find
    everything it must act on.
132. **Serve the status view.** The status view is served from the same
    state the engine reads, and is readable with no machinery running
    anywhere.
193. Every operation the operator may invoke — capture, mark as intent,
    answer a decision, drop, later, hold, rename, start or stop a
    service, finish a session, explore over intents, and every other
    transition 4 grants — is exposed by the state store as a tool
    with a schema naming its arguments by object id. The page's
    controls, the chat, the dispatch agent and the machinery all call
    the same tools; no caller has an operation the others lack.
193a. The catalogue, filtered by the caller's permissions (293), is
    itself an operator surface: a client may render it as a list of
    commands that caller may invoke, one call each with its arguments
    named by object id, and offers no command the catalogue lacks.

### B.2 The guarantees

133. **Durable.** What a write reports as written survives the loss of
    every host, all at once, without warning.
134. **Single writer per object.** Two writers of one object cannot both
    succeed. The loser learns that it lost, and reads again before
    deciding anything.
135. **Atomic per write.** A write is wholly applied or not applied. No
    reader ever sees half of one.
136. **Derivable.** Every state the engine decides upon is derivable
    from what read and list return. Nothing the state store holds
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
    host is alive. This is a view of the whole, separate from the rail,
    and it needs no machinery running to be read.
142. The status view is a projection of the same state the engine reads.
    It is never a source of truth, and it is never written by hand to
    make it look right.
143. The status view is central: one place for the whole instance,
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
209. On the status view every kind of object has one form of its own
    and no two kinds share one: a decision is the only thing shaped as
    an answerable card, a proposal reads as a document with its unit
    proposals hanging off it, an intent as a thread with its
    elaborations in order, a bolt as a ledger with its units in order,
    a landed bolt as a record, a signal as a quote. The phase an object
    is in is shown by where it sits, never by its form. A rendering of
    the status view on any surface keeps these forms.
210. An elaboration is a surface of its own, reached from its intent:
    its type and state, its decision when one is pending, its document
    and the records it wrote into the intent's change directory (187),
    its session with last activity (65–68), and, when covered by a
    gathering, the gathering it is in (188). The intent's surface lists
    its elaborations in order and opens each.
213. Every object opens the OpenSpec artifacts behind it, in a view fit
    to the artifact: an intent its change directory — the proposal, the
    records, the deltas, the design, and whether it is archived; a unit
    its change in the built repository, with the steps ff · apply ·
    verify · archive set against its type's stages, its requirement
    blocks, and its tasks with the item and the commit that did each; a
    claim its block with its versions, its attachments and each
    verdict's evidence; a bolt its acceptance file (192); a work item
    its commits (185), its deliverables and its report. Every view is
    derived from the repositories at the shared line and never stored;
    an edit to any of it goes through the review surface (17), never
    through the view.
214. The flywheel instrument is a projection (142), sets no target, and
    the unattended streak is the only thing the operator plays for. It
    shows: runway, in days — the estimated size of the approved
    construction work queued and running (172) divided by the drain,
    where the drain is the alive hosts' bound at the calibrated rate;
    feed — what would add runway and waits on the operator: proposals,
    elaborations waiting, intents; pressure — the approved work waiting
    against the bound; the unattended streak — how long approved work
    has run without a response from the operator, what puts it at risk,
    and what ended the last one; one reading sentence derived from the
    counts — you are the limit · feed it · drain is the limit · primed;
    and velocity, as history. The two backpressure stages are shown as
    such: inception, what waits on the operator; construction, the
    queue against the bound. A compact form of it sits on the status
    view at rest.

### B.5 Hosts and ownership

147. More than one host may run the machinery for one instance at
    once. Every host works from the same shared line of every
    repository and the same central state.
148. There is one rail per instance, derived from the shared state;
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
150a. A host may be declared intermittent — a laptop is by default, a
    cloud or pool host is not. An intermittent host past its stale
    window is shown as away, with since when, on the status view, and
    raises no attention line. The takeover decision of 150 is raised
    for an away host only when a numbered decision or approved work is
    waiting on that host, or when the long bound passes. The leases it
    holds stand; its sessions are neither stalled nor lost while it is
    away, and their stall clocks pause. On its next heartbeat it is
    alive again with nothing to answer.
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
194. Free text from the operator, typed on the page or sent in chat, is
    never parsed by the machinery. The host's agent — the instance's
    dispatch agent for chat, a model running in the page's browser, or
    none at all when the operator used a control — reads and answers
    with the query tools on its own, and every write is a proposed tool
    call the operator confirms. Its interpreter, the function that
    turns text into a proposed call, resolves names against the live
    objects and proposes the call, which is shown to the operator as
    what will be sent; the operator's confirmation is the response and
    is recorded once (153). A message that asks for several things
    yields several proposed calls, one card each, each confirmed and
    recorded on its own. A name that resolves to nothing is asked
    about, never guessed. The numbered reply grammar (`yes 412`, `421:
    <text>`) stays as the deterministic path, because a decision number
    is unambiguous, and is itself one of the tools: answer a decision.

<!-- ANCHOR_END: part-b -->
## 6. Requirements — Part C, profiles
<!-- ANCHOR: part-c -->

A profile is a complete binding of Part B to real storage and real
services. Every profile satisfies every operation of B.1 with every
guarantee of B.2. Parts A and B do not change to admit a profile.

### C.1 The tracker profile

State lives in an instance's tracker: an item per object, grouped
into milestones, arranged on a board. The tracker is the central
service.

| contract operation | how this profile satisfies it |
|---|---|
| read evidence | the item's own fields, its grouping, its board placement and its comments |
| write an effect | a change to an item, carrying the effect's identity so a repeat is recognized |
| lease | a recorded holder on the item, with the time it was taken and renewed |
| present and receive | decisions presented on the item and on the page; the response arrives as a short written reply |
| notify | the tracker's own notification of a change to an item |
| list objects in scope | a query over the instance's items |
| serve the status view | the board, plus a page served from the same items |

The instance's dispatch agent, running outside every host, is this
profile's binding for signals appended by adapters (106) and for
capture in one gesture (112): it is the capture endpoint a delivery
system or a chat calls, and it appends the signal records. The data
plane stays silent about dispatch; it reads signals through curation
like any other.

156. The tracker holds every object's state, is durable, and is
     readable with no host of the operator's running.
157. Objects with a rail-facing lifecycle — intent, elaboration, bolt,
    unit, work item, decision — are tracker items. Signals, moves, claims,
    verdicts and definitions are files in the blueprints repository in every
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

<!-- ANCHOR_END: part-c -->
## 7. Invariants
<!-- ANCHOR: invariants -->

These hold at every moment, not just at the end of an operation.

- I1. No work exists without an approval that can be pointed to.
- I2. No approval is applied twice or lost.
- I3. Every rail decision has exactly one creating condition and one
  retracting condition.
- I4. Every state has exactly one source of truth.
- I5. A working session is never interrupted by the machinery.
- I6. A standing session is ended only by the operator's response.
- I7. Restarting the machinery changes no state and no rail.
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

<!-- ANCHOR_END: invariants -->
## 8. Non-goals
<!-- ANCHOR: non-goals -->

- Replacing the git hosting or the agent runtime.
- Multi-operator arbitration. One operator per flywheel.
- Scheduling across hosts for performance. Correctness first.
- A user interface beyond the page, the status view, and the chat
  reply.
- A second change or specification format beside OpenSpec.

Which state store the flywheel runs on is a profile choice, made per
instance, not a non-goal.

<!-- ANCHOR_END: non-goals -->
## 9. Environment givens
<!-- ANCHOR: givens -->

Constraints of the world, not design choices.

- Design books are markdown books in a git repository. Built software
  lives in git repositories with their own merge gates.
- The blueprints repository and every built repository already carry
  proposed changes and archived specifications in the OpenSpec change
  format, with an archive step that moves a change's specifications
  into the standing set. Which repositories the flywheel tracks is
  listed in a manifest in the blueprints repository.
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
- The rewrite targets Rust: a pure engine crate, state-store adapters
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
  webhooks; the chat is a Discord bot; the book is mdBook; changes
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

<!-- ANCHOR_END: givens -->
## 10. Questions the model must answer
<!-- ANCHOR: questions -->

Not requirements; the places where the modeler's judgment is wanted.

- Which objects carry a machine, and which are attributes of another
  object's state? How do the machines relate: nesting, composition,
  or something else?
- Where does event-driven behavior (a session's life) meet
  reconciliation (deriving the state of durable objects from stores),
  and how does one drive the other?
- Where does an agent's free reasoning sit relative to the machine,
  and how are its exits kept to the fixed set?
- How is the rail derived, and what makes it impossible to miss a decision?
- What is the minimal set of stores, and what is the source of truth
  for each state?
- How does curation connect to the instance without the instance
  taking on the batching of signals?
- Where does the ledger live, who writes a verdict, and how does a
  stale verdict become a rail decision that cannot be missed?
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

<!-- ANCHOR_END: questions -->
## 11. Scenarios the model must satisfy
<!-- ANCHOR: scenarios -->

Behaviors, stated as what the operator experiences. A model is checked
by walking each one. Each is tagged with the profiles it applies to.

- **S1.** *(all profiles)* The operator approves a proposed elaboration
  from their phone. Work starts. Nothing later asks for that approval
  again, and the approval is never undone by the machinery deciding the
  work "needs approval" afresh.
- **S2.** *(all profiles)* A prototype elaboration of the standing type
  finishes its build and goes idle. The prototype keeps running. The
  rail offers "finish or keep". The operator opens the prototype the
  next morning and it is still there.
- **S3.** *(all profiles)* A construction session notices that a shared
  instruction file is stale. It finishes its own job, offers the fix as
  a chore. The operator accepts with one word. One agent fixes the file
  in the right place and it lands. No bolt and no change directory were created.
- **S4.** *(all profiles)* A session offers a finding: a better approach
  to a related subject. The rail shows it as a proposed elaboration on
  the relevant intent. The operator drops it. Nothing was created.
- **S5.** *(all profiles)* The machinery is restarted mid-day. Every
  running session is still running. The rail is identical before and
  after. No object changed state.
- **S6.** *(all profiles)* A host is slow; starting a session takes two
  minutes. The session starts once. No duplicate session is started, and
  nothing is reported as failed.
- **S7.** *(all profiles)* All elaborations on an intent are done. The
  rail offers the intent's close. The operator says yes. The intent is
  closed and its records archived. Nothing else moved.
- **S8.** *(all profiles)* Twenty signals arrive from a meeting
  transcript. Curation attaches six to open intents, drops nine, and
  clusters five into two proposed intents, one of which challenges a
  standing claim. The rail shows two decisions with their signal weight, not
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
  week. No claim changed. No verdict was recomputed and the rail did not
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
- **S16.** *(profile: git-only)* The operator dictates a scenario in a
  sentence. It becomes scenario data, runs against a state store held
  locally with no network — a bare repository on the same computer, no
  live service of any kind — and produces the transitions, the effects
  and the rail decisions it asserts, rendered afterwards as a trace the
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
  07:40 and looks again at 16:00. Nothing was nudged. The rail's tail
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
  the intent's line on the blueprints' shared line, and the two claims it
  carried are now standing.

<!-- ANCHOR_END: scenarios -->
## 12. What to deliver

A model that answers section 10, satisfies Parts A, B and C and section
7, and walks section 11 — as a written model plus diagrams in the house
style (`design-diagram`), one per machine family, each stating its claim
in the title. The diagram shows where rail decisions are created and
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
