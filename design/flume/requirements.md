# flume — requirements
<!-- ANCHOR: preamble -->

A statement of what flume must always do and never do, written to
admit any model that satisfies it.

The statement is in three parts. Part A is what must hold of flume on
its own: how one piece of work is launched in a place of its own, taken
through its kind's stages one fresh agent at a time, submitted where
its kind lands, followed to its end, and tidied away. Part B is its
contracts: the operations it needs across its seven seams, the place,
the kinds, the change, the agent, the terminal, the merge queue and the
store, and the guarantee each must give. Part C is the profiles: the
ways each contract is satisfied. The store's profile follows the
family's storage rule (section 9).

Parts A and B name no mechanism: no command, file, format, field,
program, service or tool. One thing of the world they name freely,
because section 9 fixes it: git, with its branches, commits and
worktrees. Every other real tool is named only in section 9 and in
Part C. A reader who has never seen an agent launcher should be able to
design from Parts A and B and git alone.

## 1. Purpose

flume launches one piece of work in one place and follows it through its
whole life. A caller names a repository, a kind and a name, and a brief
for the stages that ask for one. flume makes a worktree of the
repository on a branch of its own, makes it ready as the repository
declares, and takes it through the kind's stages, starting a fresh agent
for each and handing it the stage's prompt. Each agent commits its work
in the place. A stage ends when what it was to deliver exists, or when
its agent says what it needs to go on, and never because the agent went
quiet. A stage that is a conversation with the operator ends when its
caller says so, and so does a stage whose agent plans, once its caller
accepts the plan it put for review. Where the kind lands its work, flume submits the place's
branch to the repository's merge queue after the last stage. A
submission the merge queue fails sends the place back to a stage the
kind names. A place moves on when its agent goes quiet, when the merge
queue decides, and on the watch the host's terminal keeps, for flume
runs no process of its own. flume reports where every place stands. It
removes each place once its work has landed, been dropped, or, for a
kind that never lands, been declared done by its caller, and keeps any
branch that holds work its base lacks. It launches on the host it runs
on, and only when asked, and starts an agent only while the host and
the stream its place runs in have room for one, by the priorities the
host gives its streams and its callers give their places, under an
account of the pool its stream names, so a host's launched work is one
queue flume keeps. Each agent starts with the parts of its prompt that
stay the same from agent to agent first, so a fresh agent reads them
from its account's prompt cache. What to launch, what matters most and
what comes next are its callers' to decide, how many agents run at
once, in which streams and under which accounts are the host's facts,
and whether submitted work lands is the merge queue's.

<!-- ANCHOR_END: preamble -->
<!-- ANCHOR: actors -->
## 2. Actors

| actor | may decide | may not |
|---|---|---|
| **a caller** (the operator, millpond, headwater, sounding, crew) | what to launch and when: the repository, kind, brief, name and base, the stream it runs in, the intent it serves with the intent's brief, and the goals, which stages wait on its word and whether the submission does, and its agents' settings, where in the terminal each runs among them; when to tell, stop, retry, finish, drop or declare done any place; each place's priority, at the launch and after it | it never changes a place's kind, brief or base after the launch, never ends an agent that is not quiet without forcing it, never opens, sends to or closes an agent's terminal itself, and never makes flume run anything in a place but its readiness, its teardown and its stages' agents |
| **the repository's authors** | the repository's kinds, with whether each lands and where a failed submission sends a place back; what a worktree needs to be ready, and what removing one must undo; each seam's profile (105) | they never decide who launches or when, and never make flume remove a commit a branch holds that its base lacks |
| **an agent** (a coding agent program working one stage) | how to do its stage, and what it commits in its place; whether to stop short, and what to say | it never ends, starts or moves a stage but by stopping its own short, never goes quiet with its deliverable missing and nothing said (110), never submits, merges or lands, and never acts in another place |
| **the merge queue** | whether and when a submitted branch lands on its base, and, where its profile does so, removing a landed place through its repository's teardown | it never receives a place's work from the place's agent (71), and removes a place only once its submission landed (113) |
| **flume** | when a stage has ended; starting each next stage that waits on no word, when the host and its stream have room for it, in its streams' and its callers' priority order, under the account its pool makes usable; submitting a landing kind's place after its last stage, and sending it back when the submission fails; sending prompts and tells; when a place whose work is over is removed | it never decides what to launch, sets no bound of its own on agents and holds no cap on places, orders places by nothing but the priorities its callers gave and the host's streams', never commits, merges or lands, never removes what it did not make or a commit its base lacks, never ends an agent that is not quiet unless forced, never answers an agent's question to a person, and runs no process of its own between its commands (120) |
| **the operator** | everything no caller and no repository's author settles | |

<!-- ANCHOR_END: actors -->
<!-- ANCHOR: glossary -->
## 3. Vocabulary

Terms are defined by meaning. A model may add terms; it may not
redefine these.

- **host**: the machine flume runs on, with its terminal and its held
  state.
- **repository**: a git repository on the host, with every worktree of
  it: one common git directory.
- **base**: the branch a place is cut from and the only branch its work
  lands on; the repository's shared branch unless the launch names
  another.
- **caller**: whoever asks flume to launch, or to act on a place it
  launched.
- **launch**: one ask to start a piece of work: a repository, a kind, a
  name, a base, and the caller's brief, settings, stages on hold,
  submission's hold and mark, and, where it gives them, the stream it
  runs in, the intent it serves with the intent's brief, the goals and
  the work's points.
- **brief**: what the work is, as the caller wrote it.
- **mark**: words of a caller's own that a launch carries, by which
  callers find places.
- **kind**: a named list of stages in order, at a version. It also says
  how its places' branches are named, whether its first stage starts in
  a place that could not be made ready, and whether it lands.
- **version**: of a kind, the number its declaration gives it, with
  which, beside its source and its name, the kind is named.
- **source**: a name for where kinds come from: flume's own kinds are
  one source, a repository's own declaration another, a launch's
  declaration a third, and every other source names kinds from outside,
  shared from elsewhere (154).
- **identity**: of a kind, its source, its name and its version (154).
- **package**: a kind from outside as it travels: the declaration of
  that one kind at one version, with every part it names (157).
- **lock**: a list of kinds by identity, each with the hash of its
  content, by which a repository or a host says which kinds from
  outside it runs, and at which version (155).
- **lands**: of a kind, that flume submits each of its places to the
  merge queue after the last stage, and sends a place back to a stage
  the kind names when its submission fails. A kind that does not land
  never reaches the merge queue.
- **declaration**: a written set of kinds, in the one form every tool
  of the family reads (section 9): flume's own, a repository's, one a
  launch carries, or a package's.
- **stage**: one step of a kind: its name, its prompt, its deliverable
  or that it is a conversation, and its agent's settings.
- **task group**: a numbered and titled run of a change's tasks, in the
  change's order.
- **repetition**: one start of a stage that repeats per task group,
  given one task group of the place's change (140).
- **conversation**: a stage whose agent works with the operator, which
  has no deliverable and ends only on its caller's finish.
- **deliverable**: what must exist for a stage that is not a
  conversation to end, in one of the forms of 24.
- **plan**: what an agent working in its program's planning mode puts
  for review when it would leave that mode: the work it would do, as
  its program writes it (24, 163).
- **prompt**: the text a stage's agent is sent to begin the stage,
  filled from the launch, the place and a retry's words. It follows the
  agent's standing prompt (148).
- **standing prompt**: the text an agent starts with ahead of its
  prompt, which every turn of its session carries unchanged: the goals,
  its intent's brief, its stage's standing instructions and its
  settings' instructions, in that order (148).
- **standing instructions**: of a stage, the text its declaration gives
  every agent of the stage alike, with no part filled (23, 148).
- **goals**: what a repository's work is for, as a launch or the
  repository writes it (149).
- **intent**: a caller's name for the work several places serve, such
  as a bolt, with the brief that says what it is for; a place whose
  launch names none serves the intent of its repository and base (147).
- **prompt cache**: what an agent program's maker keeps of the leading
  text of a request, for one account and for a lifetime it sets, so a
  later request that begins with the same text reads it rather than
  taking it in again.
- **place**: a worktree of one repository, on a branch of its own, that
  flume made for one launch.
- **live**: of a place, made and not yet removed; of an agent, started
  and not yet stopped.
- **current stage**: of a place, the stage it most recently started.
- **readiness**: the steps a repository declares a worktree needs
  before work starts in it.
- **teardown**: the steps a repository declares removing a worktree
  must run, to take away what was stood up for it.
- **change**: a written plan of one piece of work in a repository: what
  it changes and why, and its tasks, each ticked when done, in task
  groups. Its
  **planning is complete** when every part the plan needs before its
  tasks start is written, and it is **archived** when it is filed as
  done.
- **agent**: one process of a coding agent program, started by flume to
  work one stage in one place.
- **settings**: what an agent starts with beyond its prompt: its
  program, its model, its mode, its instructions, its environment, and
  where in the terminal it runs, such as beside a pane its caller names.
- **mode**: how far an agent may act in its place without asking a
  person, one of the modes its program names, such as only reading and
  planning, or editing files without asking (162).
- **points**: a caller's measure of how much agent work a place's work
  is, a number of the Fibonacci scale, 1, 2, 3, 5, 8, 13, 21 and on,
  given at the launch; flume never estimates one (165).
- **pace**: of a stream, how many points its places may start in any
  span of a length the host's configuration names, such as 13 a day
  (167).
- **stream**: a named share of a host's work, which the host's
  configuration declares with its own bound on agents running, its
  priority and its pool; every place runs in one (143).
- **account**: an agent program and the environment it runs under,
  which signs it in to an allowance of its own, as the host's
  configuration names it (144).
- **pool**: a named list of accounts in order, with the strategy by
  which flume chooses one at each start (144, 145).
- **spent**: of an account, that an agent's own record said it reached
  a usage limit, until the time the limit resets (146).
- **usable**: of an account, that it is not spent and has room under
  the bound it states (145).
- **affinity**: the stream and the account an intent's places start on,
  kept while that account is usable (147).
- **identity**: the one name flume gives an agent, naming its
  repository, its place, its stage and which start of the stage it is.
- **agent state**: what an agent is doing: **working**; **waiting**,
  ready for input; **asking**, waiting on a question it put to a person;
  **stopped**; or **unknown**, when flume cannot read it.
- **own work**: work an agent started that runs on without it, such as
  a test run it waits on.
- **quiet**: of an agent, neither working, asking, nor waiting on own
  work.
- **start**: of a stage, the moment flume starts its agent. A start is
  **starting** until its agent says it started under the start's
  identity (35), and a stage has **begun** once its agent has received
  its prompt.
- **stop short**: an agent's word to flume that its stage cannot deliver
  without something, saying what in its own words.
- **stop check**: flume sending back an agent that would go quiet with
  its stage's deliverable missing and nothing said (110).
- **end**: of a stage, that it **delivered**, that it **ended short**,
  or, of a conversation, that it was **finished**.
- **on hold**: of a stage or a submission, that it waits on its
  caller's word before it starts.
- **room**: of a host or a stream, how many more agents of flume's
  places it may run at once: the bound its administrator states for it,
  less its agents running (70, 143); of a stream, for a place's first
  start, also its points bound less its points in flight, and its pace
  less what it started in the span (166, 167).
- **in flight**: of a place's points, counted while its work is with
  its agents: from its first stage's start until its last stage
  delivers, and again from a fix round's start until it delivers; a
  place launched whose first stage has not started holds its points
  **queued** (165).
- **priority**: a place's rank among the places waiting for room in its
  stream, given at the launch and changed by its caller after; higher
  starts first, equals in the order they came to wait. A stream's
  priority, which the host's configuration states, ranks the streams
  themselves (70, 143).
- **waiting for room**: of a stage, that it may start and waits only
  for its host or its stream to have room, its stream's points bound or
  pace among it for a place's first start, or for an account of its
  pool to be usable (70, 145, 166, 167).
- **stuck**: of a stage, that its agent has been quiet past the stage's
  limit with nothing delivered and nothing said.
- **stalled**: of a place, that its next move has been its caller's for
  five minutes, or the launch's bound, under no hold's words (130).
- **recipient**: whoever an end of a place goes to: a caller's session,
  or a role's address (43, 132).
- **delivered**: of an end, that it reached its recipient, recorded on
  the place with to whom and when; **pending** until then (43).
- **collect**: a recipient's taking of every end pending for it, by
  `flume inbox`, which delivers each (43).
- **notice**: what a delivery carries into a pane: the end and the place
  to read, never a fact to act on blindly.
- **refused**: of a stage, that a part its prompt asks for had nothing
  to fill it (27).
- **lost**: of a stage, that its agent stopped with nothing delivered
  and nothing said.
- **stage state**: where a stage stands: not reached, on hold, waiting
  on its place's readiness, waiting for room, refused, starting, started, begun, never begun, stuck,
  lost, stopped by its caller, for review, delivered, ended short, or
  finished.
- **retry**: a caller's ask that a place start one stage of its kind
  afresh, the current stage unless the retry names another, with words
  of the caller's for its prompt; or, naming the submission, that flume
  submit the place again.
- **tell**: words a caller hands the agent of a place's current stage.
- **stop**: a caller's ask that a place's agent end.
- **finish**: a caller's word that a conversation is done, or that the
  plan a stage put for review is accepted (163).
- **for review**: of a stage that delivers a plan, that its agent put a
  plan for review and is quiet, and the stage waits on its caller's
  finish, tell or retry (163).
- **drop**: a caller's word that a place's work is given up.
- **done**: a caller's word that the work of a place whose kind does
  not land is complete.
- **forced**: of a stop, a retry, a finish, a drop or a done, that its
  caller asked for it to end an agent that is not quiet.
- **submission**: a place's branch offered to the merge queue for its
  base, and what the merge queue records of it.
- **failed**: of a submission, that the merge queue removed it as the
  cause of a failure or for a conflict.
- **landed**: of a place's work, that the merge queue records a
  submission of the place's own branch landed on its base, flume's or
  one that landed before flume submitted (63).
- **over**: of a place's work, that it landed, was dropped, or was
  declared done.
- **tidy**: removing a place whose work is over, and its branch where 67
  allows.
- **settle**: of a place, flume reading every fact of it again and
  taking each step Part A then allows.
- **watch**: the host's terminal settling, on a bound it states, the
  places whose agents run in it, while flume itself runs nothing.
- **attended**: of flume on a host, that the host's terminal keeps no
  watch (119).
- **held state**: everything flume keeps of its own for the places on
  its host.
- **surface**: one way a caller reaches flume.
- **profile**: one way a contract of Part B is satisfied, as Part C
  describes.

<!-- ANCHOR_END: glossary -->
<!-- ANCHOR: part-a -->
## Part A. What flume decides

### A.1 Launches

1. flume launches only when a caller asks, and only on the host it runs
   on. It never decides what to launch, and never makes a place or
   starts an agent on another host.
2. A launch names a repository on the host, a kind, a name and a base,
   and a brief wherever a stage of its kind asks for one (4). Either it
   makes one place, records it, and starts its first stage, puts it on
   hold, or leaves it waiting on the place's readiness (12); or it is
   refused, naming why, and leaves nothing it made behind.
3. At most one live place has a given repository, kind and name. A
   launch is refused, naming what stands, when that place, its branch,
   or anything at its place's location already exists, or when its kind
   reads a change and either its base already holds a change by its
   name, open or archived, or a live place of the repository whose kind
   reads a change has its name. flume never adopts a worktree, a branch
   or a change it did not make for the launch.
4. A launch whose kind resolves to no declaration (19), asks for more
   than flume runs of a kind (23), or names a deliverable flume cannot
   read (24) is refused naming the kind, and makes nothing. So is a
   launch of a kind that lands where the repository binds no merge
   queue (105). A launch that gives no brief while a stage of its kind
   asks for one is refused naming the stage, and makes nothing (27).
   So is a launch where a stage's agent resolves to a program no agent
   profile binds, or one the host's terminal cannot run, naming the
   program, the stage and where the program came from (32). So is a
   launch naming a stream the host's configuration does not declare,
   naming it (143), and one where a stage's standing instructions ask
   for a part, naming the stage (148). So is a launch whose kind's name
   two sources hold where it names no source, naming each, and one
   naming a version its kind's source does not hold, naming it (154); a
   launch of a kind from outside that no lock records, or that the host
   does not hold, naming its identity (155, 159); one whose kind's
   content does not match its lock's hash, naming the kind and both
   hashes (156); one whose package refers outside itself or names
   another identity than the one it is held at (157); one whose kind
   names something a host owns, naming the field (158); one where a
   stage's agent resolves to a mode its program does not name, naming
   the mode, the stage and where it came from (162); one whose points
   are not a number of the Fibonacci scale, naming them, and one that
   gives no points where its place's stream states a points bound or a
   pace, naming the stream (165).
5. Every stage whose prompt asks for the brief gets it whole and as the
   caller wrote it. flume never rewrites, shortens, summarises or
   judges a brief.
6. A launch answers once its place is made and its first stage is
   started, on hold or waiting. It never waits on an agent coming up,
   and whoever needs a stage's start or end learns it from status (43).
7. A launch may carry settings for its agents, for every stage of its
   kind or for any one of them, the stages it puts on hold, each with its words (130), whether its
   submission waits on its word, the place's priority (70), the stream
   it runs in (143), the intent it serves with the intent's brief (147),
   the goals (149), the work's points (165), the
   recipients of its ends (43), and a mark. A recipient the launch
   names none of is the session that launched it, as the terminal names
   it, or none where it names none. flume keeps the mark with the place and reports it, and
   decides nothing by it.
8. A place's kind, brief, base, stream, intent with its brief and goals,
   points, and the settings its launch carries, are fixed by its launch, and
   nothing after the launch changes them; the host's configuration of
   its agents' settings is read at each start (32), and the account each
   agent runs under is chosen at its start (145). The launch names the stages and the submission on hold, and a caller adds to a place after
   it only the words of a retry (49), a hold with its words (130) and
   a change of priority (70). Its recipients are fixed at its launch.

### A.2 Places

9. A place is one worktree of its repository, on a branch of its own
   named from its kind and its name the same way for every place of
   that kind. It is cut from its base's current revision where work
   lands on the base, never from a copy of the base that may lag it. A
   launch that cannot read that revision is refused, naming why.
10. No place checks out its base or any branch the merge queue lands
    on, and no two live places share a branch.
11. flume makes a place ready only by its repository's readiness, read
    from the base's revision (20) and run in the place with an
    environment that carries nothing of the caller's session. A
    repository that declares no readiness has nothing run. flume names
    no repository's script, assumes no tool, and requires no version of
    any.
12. When a place's readiness fails, its first stage waits and status
    names the step that failed and its words, unless the kind starts its
    first stage in a place that could not be made ready. Then the stage
    starts, and its prompt carries the step and its words. A retry of
    the first stage of a place whose readiness failed runs the readiness
    again, as its launch read it (20), and no other retry runs it.
13. flume runs nothing in a place but its readiness, its teardown and
    its stages' agents. It runs no check of a place's work.
14. flume never commits, merges, rebases or lands: a stage's agent
    commits its work in its place, and the merge queue lands what flume
    submits. flume moves no branch, except to make a place's branch at
    its launch and to remove it at its tidy (67).
15. A place's work lands only on its base, and its base is the only
    branch flume submits it to or reads its landing against (63).
16. Removing a place ends every agent flume started in it.
17. Places are independent: what one place's agent does, and how its
    stages end, never starts, ends, holds or moves another place.

### A.3 Kinds and stages

18. A kind is an ordered list of one or more stages. Every stage but a
    conversation has exactly one deliverable, and a conversation has
    none (109).
19. flume itself, a repository, a launch or a package declares a kind,
    and every kind is named by its identity: its source, its name and its
    version (154). For a launch, a kind's name resolves to exactly one
    kind: the launch's over the repository's own over every other
    source's, and among a source's versions to the one 154 gives. Status
    names the identity of the kind each place runs, and for a kind a lock
    records, the hash of its content (155).
20. A repository's kinds, its lock (155) and its readiness are read
    from its base's revision at the launch. Its binding (105) is read
    from its default branch's current revision: the remote's, after one
    fetch, where the repository has a remote, and its own otherwise.
    None is read from a place's tree or from a change not committed.
21. A place runs its kind, and keeps its repository's binding, as each
    resolved at its launch: the kind's identity and its content as read
    then. A later change to any declaration, lock or package the host
    holds never changes a place already launched.
22. flume's own kinds are fix@1, chore@1, change@1, change@2 and
    plan@1, and all five land. **plan** is a plan stage, which delivers
    a plan its caller accepts (163), and then fix's code stage, which
    works to the plan accepted; a failed submission sends it back to
    code. **fix** is a code stage, which delivers commits. Its
    first stage starts in a place that could not be made ready, and a
    failed submission sends it back to code. **chore** is fix's one code
    stage under a prefix of its own, so a branch's name says which it was
    (C.2). **change** at version 2 is a construct stage,
    which delivers the place's change written; a code stage, which
    delivers its tasks ticked and repeats per task group (140); and a
    verify stage, which checks the work
    against the change, commits its report in the change, and delivers
    the change archived. **change** at version 1 is the same, but its
    code stage does not repeat. A failed submission, and a verify
    finding (131), send a change back to code, which is the kind's fix
    round. Both versions of change are flume's own side by side: a
    repository picks one by its lock (155) and a launch by naming it
    (154). Every other kind, each of sounding's among them, is a
    repository's, a launch's or a package's (19).
23. A kind's declaration holds its version, its stages in order, how its
    places' branches are named, whether its first stage starts in a
    place that could not be made ready, and whether it lands. A kind
    that lands names the stage a failed submission sends a place back
    to, and how many times a place may go back before it waits on its
    caller. A kind's declaration may hold settings for the agent of
    every one of its stages. A stage's declaration holds its name, its
    prompt, and its deliverable or that it is a conversation, and may
    hold its standing instructions (148), its agent's settings, what it makes besides its deliverable
    (129), whether it waits on its caller's word, how long its
    agent may be quiet before the stage is stuck, and whether it repeats
    per task group (140). flume reads only a
    kind's places and stages, and runs that much of them: stages in
    order, one agent to each start, a repeating stage's repetitions in
    turn, and the place sent back when its
    submission fails. A kind whose places and stages ask for more, such
    as a stage worked by several agents, is refused (4). flume ignores a
    section of a kind it does not know, such as the elaboration section
    sounding reads, and nothing else a declaration holds changes what
    flume does.
24. Every deliverable is one of seven forms, each read where it lives:
    - **commits**: the place's branch holds a commit made since the
      stage started;
    - **change written**: the place's branch holds the place's change
      with its planning complete, and the newest commit that touches the
      change was made since the stage started;
    - **tasks ticked**: the place's change has at least one task and
      every task is ticked at the branch's head, and the newest commit
      that touches the change was made since the stage started;
    - **change archived**: the branch's head holds the place's change
      archived, and the branch holds a commit made since the stage
      started;
    - **report**: a file at the path the stage's declaration names,
      written since the stage started;
    - **committed report**: a file inside the place, at the path the
      stage's declaration names, in a commit made since the stage
      started. It stays on the place's branch after the place is tidied
      (67);
    - **plan**: the agent's own record says it put a plan for review
      since the stage started, and the plan it names was written since
      then; the newest such plan is the stage's (163).
25. A deliverable counts only when made since its stage started. A
    commit was made since then when the branch's head reaches it and the
    head the stage started at does not. A report was written since then
    when its write time, by the host's clock, is after the stage's
    start. flume reads every fact of one deliverable at one head of the
    place's branch, and never pairs a fact read at one head with a fact
    read at another.
140. A stage whose declaration says it repeats per task group delivers
     tasks ticked (24), and is worked one task group at a time. Each
     repetition is a start of the stage (33, 48): one fresh agent in
     the place, given the first group of the place's change that holds
     a task unticked at the head the repetition starts at. A repetition
     delivers once every task of its group is ticked at the branch's
     head and the newest commit that touches the change was made since
     the repetition started (25). Once it has delivered and its agent
     is quiet, flume ends the agent and, while a task stays unticked,
     starts the next repetition as it starts a next stage (40, 47, 70);
     the stage delivers once every task is ticked. A start with every
     task already ticked, a failed submission's, a finding's or a
     retry's, is one repetition with no group, which delivers as the
     stage does. A repetition's delivery is no end of its stage, and
     nothing of it is delivered to a recipient (43).
154. A kind's identity is its source, its name and its version. flume's
     own kinds are one source, the repository's own declaration another
     and a launch's declaration a third, and no source from outside
     takes their names. Within a source a name and a version name one
     kind, and a source may hold several versions of one name side by
     side, as flume's own holds change@1 and change@2; the repository's
     and a launch's declarations hold one version of each name. A launch
     names its kind by its name, by its name and version, or by its
     whole identity. Naming no source, it takes the kind of that name
     from the launch's declaration, else the repository's own, else the
     one other source that holds the name, flume's own or one a lock
     records (155); where two such sources hold it the launch is refused
     naming each (4). Naming no version, it takes the version the
     repository's lock records for that kind, the newest where it records
     several, else the host's lock's likewise, else the newest its source
     holds. So a repository that records change@1 keeps launching
     change@1 when a later flume adds change@3, and one that records
     nothing takes flume's newest.
155. A repository and a host each may keep a lock: the kinds from
     sources other than the repository's own and a launch's that it runs,
     each by its identity with the hash of its content (156). The
     repository's is read at the base's revision with its kinds (20), the
     host's from its configuration as it stands at the launch. A kind
     from outside, of any source but flume's own, the repository's and a
     launch's, is run only where one of the two locks records it, at the
     version and the hash recorded: nothing from outside runs unlocked.
     Locking is the act of trust, since a kind's prompts drive agents
     with the host's accounts and tools, and the lock fixes to the byte
     the content that was trusted. flume's own kinds are trusted with
     flume, the repository's own with the repository's revision, and a
     launch's with its caller, so none of them needs a lock to run; a
     lock records flume's own to pick their version. Where the two locks
     record one identity with two hashes, the launch is refused naming
     both (4). flume writes a lock only at its caller's asking, by its
     own command, into the working copy or the host's configuration where
     the caller runs it, never at a launch or a settle; a repository's
     lock reaches its places once its caller commits it on the base.
156. A kind's content is its declaration and every part it names, and
     its hash is the family's content hash over them (weir 90). At
     each launch of a kind a lock records, flume reads its content as
     the host holds it, or as flume carries it for its own, and refuses
     the launch where its hash is not the lock's, naming the kind and both
     hashes (4). From the first release of flume that reads locks, a
     version of flume's own kinds keeps its content in every later
     release: a change to what it holds is a new version.
157. A kind from outside travels as a package: the declaration of that
     one kind at one version, with every part it names, its prompts and
     standing instructions, inside the package. A package refers to
     nothing outside itself: no part by a path outside it, and no other
     kind, so no stage of it extends, includes or hands over to another
     kind's. A package whose name or version is not the identity it is
     held at, or that refers outside itself, refuses the launch naming
     it (4). flume's own kinds are packages too, one per version, so
     change@1 and change@2 each carry their own construct and verify.
158. A kind names nothing a host owns, whichever source declares it: no
     environment, account, pool, stream or location on a host (32, 144).
     It may name the agent program it supports, by name, and a model, by
     the name its program gives a class of models, and the host binds
     both through its own layers of 32. A kind's declaration that names
     an environment, or a program by a location, refuses the launch
     naming the field (4). Settings are given to a kind by its name, in
     a repository's or a host's configuration, and join whichever source
     and version the launch's name resolves to (32).
159. The host holds the packages of the kinds from outside it may run,
     each at its identity, several versions of one name side by side.
     How a package reaches the host, copied by a person or taken from a
     shared catalogue, is outside this statement. Holding a package runs
     nothing: only a lock does (155).
123. A report kept beside a place's held state goes when the place is
     tidied (62). A stage delivers one only where its caller keeps what
     the report holds once the place is gone. Every other report a
     reader needs after the place is gone is a committed report (24).
129. A stage's declaration may name what the stage makes besides its
     deliverable, each by a name a caller will want to open: a spike, a
     page, a report kept elsewhere, or a thing that must run. The
     stage's run records each made thing as the run knows it, at
     `made.jsonl` in the place's own folder (128), which `{{made}}`
     renders, one line per thing with its name and what it is: a durable
     thing by its address, a thing that must run by the branch and
     revision that bring it up, since a stage starts no server that
     outlives its place and a running copy of a revision is the merge
     queue's to make and release (C.6); the run may record a thing it
     did not declare. flume reads the lines when the
     stage ends and hands them to whoever waits on the stage and to
     status (43) as the run wrote them, making, checking or rewriting
     no address of its own. A declared thing with no line when the
     agent goes quiet is the deliverable not yet made: the stop check
     sends the agent back naming it (44, 110). The lines go with the
     folder when the place is tidied (62, 123), so a caller that wants
     them after keeps them, as it keeps a report under `{{state}}`. A
     kind that lands makes nothing by landing: the commit it landed as
     is what whoever waits on the submission learns (43), and a preview
     of a revision is the merge queue's, brought up at that revision by
     whoever shows the card and released by them, recorded by no stage.
26. A place has at most one change, named by the place's name, and a
    stage that reads a change reads only that one.
27. A stage's prompt is filled before it is sent. Every part it asks
    for from the launch, the place or a retry is filled. The launch
    checks the brief for every stage (4). Any other part asked for with
    nothing to fill it leaves the stage refused, naming the part, until
    a retry whose words fill it, and starts no agent. flume never sends
    a blank where a part was asked for.
28. Every stage's prompt gives its agent the one way to stop short,
    filled in for the place and the stage. No prompt asks an agent to
    submit, merge or push its work (71).
29. A stage's agent is started with its standing prompt (148), its
    prompt, its settings, its identity and its place, and nothing else
    of flume's. Its environment
    is the host user's own login environment with its account's
    variables over it (32, 144), and carries nothing of the caller's
    session: a caller that wants an agent to run under an account names
    a stream whose pool holds it, never by its own session's
    environment. A value an account gives may name the host user's home
    and the variables of that login environment, and is read against
    them. The exact standing prompt
    and prompt a stage would be sent can be rendered without starting an
    agent.

### A.4 Agents

30. Each start of a stage, each repetition of a repeating stage among
    them (140), starts exactly one fresh agent, working in the place. A
    place has at most one agent at any moment: flume never starts an
    agent while another of the place's is live, and never hands a stage
    an agent another stage or place started.
31. flume never ends an agent that is not quiet, unless a caller forced
    it. An agent whose state or own work flume cannot read is not quiet,
    and status names what flume cannot read. An end flume asked for that
    the agent did not take is reported as a failure, never as done.
32. An agent's program, model, mode and instructions are resolved when
    it starts, each from the first of these that gives it:
    1. the launch's settings (7);
    2. the host's configuration, for the place's repository and kind,
       for the model, the mode and the instructions alone;
    3. the host's configuration, for the kind, for the model, the mode
       and the instructions alone;
    4. the repository's settings for a kind it does not declare, given
       to whichever declaration the kind's name resolves to (19),
       flume's own among them;
    5. the kind's declaration, the repository's own where it is the one
       the name resolves to (23);
    6. flume's own default.

    Within each, a stage's own setting comes before one given for every
    stage of the kind, and each setting is taken whole from the first
    that gives it. Its environment is the account's chosen for it from
    its pool (145), and nothing else gives one: no layer above names a
    variable, and an agent with no pool runs under the login
    environment alone (29, 144). The launch's settings, the
    repository's and the kind's are those the launch read (8, 20, 21);
    the host's configuration, its accounts among it, is read as it
    stands at the start, so a start after a change to it takes the
    change, and an agent already started keeps what it started with.
    The repository's settings and its kinds' carry nothing of one host:
    no environment, no stream, no pool and no account, and a kind's
    declaration names a program by its name alone, never by a location
    on a host (144). Where in the terminal an agent runs (107) is read
    from the launch's settings and the stage's declaration alone. A
    program resolved at a later start that no agent profile binds, or
    that the host's terminal cannot run, or an account's value naming a
    variable the login environment lacks (29), leaves the stage
    refused, naming the program or the variable and where it came from,
    and starts no agent, until a retry (27); so does a mode its program
    does not name (162). Status reports each setting
    and each variable with the agent and where it came from, and the
    agent program's own configuration on the host never chooses one,
    but the mode where no layer gives one (162).
33. Every agent carries an identity flume gives it, which names its
    repository, its place, its stage and which start of the stage it is,
    and which no other live agent on the host carries.
34. flume answers on an agent's behalf only the agent program's
    question whether it may work in the place, and only when the agent
    shows it; and, in a stage that delivers a plan, it declines the
    agent's own ask to leave its planning mode, which keeps the agent
    planning and widens nothing (163). It never answers a question that
    widens what an agent may do, and never accepts a plan.
35. flume judges an agent's start by evidence that the agent exists,
    never by the return of what started it. The evidence is the agent's
    own word that it started under its start's identity and the settings
    its start recorded (161), with flume's guard and stop check in force
    (116, 115); until that word the start
    is starting, and status gives with it what the terminal shows of
    the agent. A start with no such word is never begun at once, with
    what the terminal shows, when its program ended, when the terminal
    reads it held at a question its program asks before it starts that
    flume does not answer (34), or when the terminal reports that the
    program did not come up within the terminal's bound; what started
    the agent says the start failed only so, and never that it
    succeeded. One still starting otherwise is reported never begun at
    the stage's limit (44), or on its caller's stop or retry. A start flume
    cannot read either way is reported unknown and watched, never
    reported as failed.
36. An agent changes what flume holds in one way only, by stopping its
    own stage short. Everything else flume learns of a stage it reads
    from the deliverable and from the agent's state.
107. Where in the terminal a stage's agent runs is one of its settings
     (32). A caller may put it beside a pane the caller names, as a
     conversation with the operator wants. flume opens, sends to and
     closes every agent's terminal, and no caller does any of them
     itself.
108. An agent never submits, merges or pushes its place's branch. flume
     refuses each such act wherever the agent program lets it, and
     status reports the refusal. A submission that gets past the refusal
     is read as any other of the place's own branch (63).
144. A pool names accounts in order, and a strategy, fill-first or
     least-busy (145). An account is an agent program and the
     environment it runs under, which signs it in to an allowance of its
     own, and may state how many agents run on it at once. Accounts
     exist only in pools. A stage's agent runs under an account of its
     stream's pool, else of the host's own pool; where neither names one
     it runs under no account, in the login environment alone (29). The
     account's variables are the agent's whole environment beyond that
     login environment (32), and status gives each with the account as
     where it came from. Accounts, pools and streams are the host's,
     and nothing of a repository's or a kind's names one, so a kind
     shared from host to host carries none: what a kind needs of an
     account it says in terms no host owns, the agent program it
     supports and the model its settings name, and the host's
     configuration binds its kinds to its own pools and streams (143).
     An account whose program is not the one the stage's layers of 32
     resolve is not usable for that stage (145).
145. At each start of a stage whose agent has a pool, flume chooses the
     account. An account is usable while it is not spent (146) and has
     room under the bound it states. The account of the intent's
     affinity (147) is taken while it is usable. Otherwise, under
     fill-first, the first usable account in the pool's order; under
     least-busy, the usable account with the fewest of flume's agents
     running, equals in the pool's order. With none usable the stage
     waits for room (70) until one is, and status gives the soonest time
     an account of the pool stops being spent. The account is chosen
     under the same lock as the room, so two starts never take an
     account's last room between them. Status gives the account with the
     agent, and whether it came from the affinity or the strategy (56).
146. Where an agent's own record says the account it runs under reached
     a usage limit (151), flume records the account spent until the time
     the record names for the limit to reset, or for an hour where it
     names none, in the host's own documents (153), so every flume
     process on the host honours it; flume never asks an agent program
     or its maker whether a limit has reset. A spent account is skipped
     by every start until that time. An agent so stopped is ended once
     quiet (31), and its stage starts afresh under a usable account of
     the pool, or waits for one (145): a start of the stage (33) whose
     words are flume's own, saying that the stage's earlier agent
     stopped at its account's usage limit and that what it committed
     and left is in the place. That start counts toward no bound of the
     kind's (112) and waits on no caller's word. Status says the stage
     moved, from which account to which and why, and that the fresh
     agent starts with nothing the earlier account's prompt cache held
     (56). A stage whose agent ran under no account is read as 43 reads
     it, with the agent's last words.
147. A place serves the intent its launch names, or, where it names
     none, the intent of its repository and base. flume keeps each
     intent's affinity in the host's own documents (153): the stream
     and the account the intent's first agent started on. Every later
     start of an agent of a place serving the intent is on that account
     while it is usable, and a later place launched for the intent runs
     in its stream unless its launch names another (143). When the
     account is spent or has no room, the start goes where 145 chooses
     and the affinity moves with it, and status says the intent moved,
     from which account to which and why, and that its agents start
     with nothing the earlier account's prompt cache held (56). An
     affinity goes an hour after the last place serving its intent is
     gone.
161. At each start flume records what its agent is to run under: its
     program, its mode where its settings give one (162), its account,
     and, for each variable its settings and flume
     give its environment (32, C.4), a digest of the variable's name and
     value keyed by the start's secret, never the value. The agent's
     word that it started (35) is taken only where what it runs under
     matches that record. An agent whose word shows another program,
     another mode, or
     a variable missing or with another value, as when a terminal brings
     a pane back without its environment or a person starts the program
     again by hand, is not the stage's agent: flume ends it once quiet
     (31) and starts the stage afresh under the settings resolved then,
     with no caller's word and counting toward no bound of the kind's
     (112), and status says so, naming the mode it started in and each
     variable that differed by
     its name alone (56). A fresh start that differs again is never
     begun (35), naming the same.
162. An agent's mode is one of its settings (32): how far it may act in
     its place without asking a person, named as its program names its
     modes. Every layer of 32 may give it, the launch's, the host's, the
     repository's and the kind's, for every stage or for one; a mode
     names nothing a host owns (158), and a host that wants no
     repository or kind to set its agents' reach states the mode in its
     own layers, which come before theirs. Where no layer gives a mode,
     flume gives the agent none, and the account's own configuration of
     its program decides, as it decides everything else flume does not
     give (144). A stage that delivers a plan starts its agent in its
     program's planning mode whatever the layers give, and status names
     the stage's deliverable as where that mode came from (163). The
     mode is read at the agent's start, as the rest of its settings are,
     and is what its start records (161), so an agent whose program
     began in another mode, as when the account's configuration refuses
     the one asked, is not the stage's agent. What the agent's mode lets
     it do never widens what flume answers for it (34).

### A.5 Prompts

37. flume sends a stage's prompt only once its agent has said it
    started (35) and is waiting, and never into a question the agent
    has put to a person.
38. A prompt is received or sent again. flume reads, within 60 seconds
    of each sending, whether the agent received it, from the agent's
    own word that it received that prompt where its program gives one,
    and otherwise from its own record. Where the terminal
    can send to a running agent, flume sends the prompt once more when
    it was not received, and reports the stage never begun when the
    second sending is not received either. Where it cannot, the start
    carries the one sending, and a prompt not received is reported never
    begun. flume never sends a prompt the agent already received, and
    text left typed for a hand to submit is never a stage's state: no
    sending, received or not, leaves text typed (95).
141. A repetition's prompt carries its task group, the group's number,
     title and tasks as the change gives them, and the path of its
     stage's notes: a file in the place's own folder (C.7) that the
     stage's repetitions write for the ones after them. flume names the
     notes' path, never reads, writes or carries what they hold, and
     they go with the place (62). A repeating stage's prompts differ
     from one repetition to the next only in their last parts.
148. An agent's standing prompt and prompt are assembled in fixed
     layers, from the most stable to the least. Its standing prompt
     holds, in order, the goals (149), its intent's brief (147), its
     stage's standing instructions (23) and its settings' instructions
     (32). Its prompt holds the stage's prompt filled (27): the unit's
     brief and the place's facts, then this run's, a repetition's group,
     the notes' path and a retry's, a failed submission's, a finding's
     or flume's own words, last (141, 146). The goals, the intent's
     brief and the stage's standing instructions are the same, byte for
     byte, for every agent of one repository, intent and stage of a
     kind, in whatever stream: flume fills no part in them, a stage
     whose standing instructions ask for a part refuses the launch
     naming the stage (4), flume puts one fixed separator between
     layers and nothing for a layer that is empty, and nothing that
     differs between starts, a time, an identity, a secret, a start's
     number, a place's location or a branch, is in them. The stage's
     standing instructions are the kind's, and travel with it wherever
     it is declared; the goals, the intent's brief and the unit's brief
     are the caller's or the repository's (149), and never a kind's.
     A kind declared alike in many repositories gives their agents the
     same standing instructions, which its agents read from the prompt
     cache only where they start on one account (147). Where the agent
     program puts text of its own that differs from place to place
     ahead of the standing prompt and can be started so that it does
     not, flume starts it so (C.4).
149. The goals are the launch's where it gives them, else the text of
     the file the repository's declaration names for them (C.2), read
     at the base's revision with its kinds (20), else none. The
     intent's brief is the launch's, given with the intent's name. The
     unit's brief is the launch's brief (5). Each is given to the launch
     as text, which a surface may read from a file its caller names,
     once, at the launch; flume keeps the text with the place, never
     reads the caller's file again (8, 21), and gives each whole and as
     written (5).

### A.6 Stage ends

39. A stage that is not a conversation ends only when its deliverable
    exists or its agent stops short. Between its start and its end the
    agent may end turns, start own work and wait on it, be woken, ask
    and be answered any number of times, and no quiet terminal, ended
    turn or closed terminal ends the stage.
40. A stage that has delivered ends once its agent is quiet, but for a
    stage that delivers a plan, which ends on its caller's finish (163). flume then
    ends the agent and starts the next stage when the host has room for
    its agent (70), unless that stage waits on its caller's word (47). After the kind's last stage, flume submits a
    place whose kind lands (111), and any other place waits for its
    caller's done or drop (52, 114).
109. A conversation ends only on its caller's finish. Its agent works
     with the operator, and flume holds it to no quiet limit and no stop
     check, never reports it stuck, and never ends it on its own. A
     finish ends the agent once it is quiet, one that is not quiet only
     when forced (31), and the stage then counts as delivered (40). A
     finish of a stage that delivers a plan accepts its plan, and ends
     it the same way (163); a finish of any other stage is refused,
     naming the place.
163. A stage that delivers a plan starts its agent in its program's
     planning mode (162), in which it reads the place and changes
     nothing in it. Its deliverable exists once the agent puts a plan for
     review (24). When the agent asks to leave its planning mode, flume
     declines on its behalf, with flume's own words saying that its plan
     is put for review and that notes or an acceptance will come, so the
     agent stays in that mode (34). Once its plan exists and its agent is
     quiet, the stage is for review: it does not end and flume does not
     end its agent (40); the plan, with where it lives, is delivered to
     each recipient of the place as an end is (43), once for each plan
     put; and the place waits on its caller (130). Its caller answers by
     a command it already has:
     - a **tell** of its notes (53), which reaches the live agent, still
       in its planning mode, so it revises the plan in its own session
       and puts it again, delivered again;
     - a **retry** naming the stage with its notes as words (49), which
       starts a fresh agent in its planning mode, its prompt carrying
       the plan last put for review before the notes, as a stop-short's
       question stands before its answer;
     - a **finish** (109), which accepts the newest plan put for review:
       flume keeps a copy of that plan as it stands in the place's own
       folder, ends the agent once it is quiet, one that is not quiet
       only when forced (31), and the stage counts as delivered, so the
       next stage starts as 40 and 47 allow, its prompt able to name the
       plan accepted. A finish before any plan was put is refused,
       naming the place.

     A drop, and a done of a kind that does not land, end the stage as
     they end any (52, 114). The stop check sends back an agent that
     would go quiet before it put a plan (110). A stage for review is
     never stuck (44) and waits on its caller, stalled as 130 says. Its
     agent is live while it waits, so it counts toward the host's and
     its stream's room (70); a caller that would free the room retries
     with its notes rather than telling them. flume never accepts a plan
     on its own and never judges one: whether a plan is good, and who
     reads it, are the caller's.
41. An agent stops short by saying so to flume, with its words, and
    saying which it does: it needs an answer before its stage can
    deliver, or it found work a stage before its own must do again
    (131). flume
    takes a stop-short only from the agent of the place's current stage,
    or from a process that agent started. The stop-short carries a
    secret flume gave that start alone, accepted only while the agent is
    live. flume never infers a stop-short from anything else.
110. No agent of a stage but a conversation goes quiet with its
     deliverable missing and nothing said. When one would, flume sends
     it back with words naming the deliverable and the way to stop short
     (28). Waiting on own work or on a person's answer is not going
     quiet. Where the agent program gives flume no way to send an agent
     back, the stage is left to 44.
42. A stage that ended short needing an answer starts no next stage, whatever
    else exists. Its place waits for a retry or a drop, and the agent's
    words reach the place's recipients, and status, whole and as the
    agent wrote them. The answer, whoever gives it and however it
    reached the caller, is a retry naming the stage with the answer as
    its words (49), and the fresh agent's prompt carries the question
    with the answer. A stage that ended short having found work is sent back as
    131 says.
43. A stage reported lost (45), a prompt never begun (38) and a stage
    reported stuck (44) are ends as a stage's end is, delivered so,
    with what flume read: the agent's last words as its own record
    holds them, the commits on the place's branch since the start, and,
    for a prompt never begun, what the terminal shows of the agent. A notice of an end is sent into a recipient's
    pane only while it asks no question (37), and otherwise stays
    pending; it counts delivered on the terminal's answer, with no
    reading back.
    A place's recipient learns a stage's end together with what was
    delivered, the head or the report, and the addresses of what it
    made (129), or with the agent's words, and a submission's outcome
    together with the commit it landed as, or with the merge queue's
    words. No caller needs to read a terminal to learn how a stage or a
    submission ended. The end is delivered: the settle that reads it
    (46) puts it before each recipient of the place once, as a notice
    through the terminal into the recipient's own pane (95), and records
    on the place that it was delivered, to whom and when; a recipient
    named by a role's address is delivered to in the pane of that role's
    live run, and where none is live the end stays pending and wakes the
    role (132); where the terminal has no pane to deliver to, the end is
    read from status (56). A wait is by place, naming its stage or its
    submission: it answers at once with an end pending for this
    recipient, and otherwise follows the host's state under a timeout,
    exiting by the outcome or still waiting, driving no settle where the
    terminal keeps watch (119, 122); so a caller whose session restarted
    waits again and loses nothing; an end already delivered to this
    recipient it answers as a read, delivering nothing again. A caller
    that starts collects every end pending for it, of the places it
    launched or is recipient of, by `flume inbox`, which delivers each
    and marks it delivered; status and a read mark nothing.
44. A stage whose agent has been quiet past the stage's limit, with
    nothing delivered and nothing said, is reported stuck, naming the
    stage and the agent. The limit is 30 minutes where the stage's
    declaration sets none. It runs from flume's first reading of the
    agent quiet with nothing delivered, and starts again whenever flume
    reads the agent not quiet or the place's head moves. An agent that
    is asking, a conversation's agent and a stage for review (163) are
    never stuck. flume never
    ends a stuck stage, and a deliverable that appears afterward ends it
    as any other.
118. An agent that has worked longer than its stage's limit with nothing
     delivered is reported as working past its limit, naming the stage
     and the agent. The limit runs from the stage's beginning or the
     place's last head move, whichever is later. flume never ends the
     agent on that account (31), and a conversation's agent is never so
     reported.
45. A stage whose agent stopped with nothing delivered and nothing said
    is reported lost. flume starts no agent for a lost stage on its own
    (48).
46. A place moves on as soon as a settle reads that it may. A settle
    reads each stage's end, starts the stages waiting for room, as many
    as the host has room for and in priority order (70), and submits a
    place whose last stage delivered. It sends a place back when its
    submission fails, and tidies a place whose work is over (63). flume
    settles a place whenever its agent goes quiet (121) and whenever
    the host's terminal watches (122), and each settle reads the outcome
    of the place's open submission (111). Under a terminal that keeps no
    watch, it also settles whenever a command of flume's acts (119).
    Where the terminal keeps watch, a place moves on within the watch's
    bound whether or not a caller asks, and asking only shortens the
    wait.
119. Where the host's terminal keeps no watch, flume runs attended:
     every command of flume's that acts on places settles every place on
     its host before it acts. An agent that ended with no word from its
     program, a prompt never received and an agent working past its
     limit are then read only at such a command (38, 45, 118). Status
     and a prompt's rendering settle nothing (29, 57). flume runs
     unattended only under a terminal that keeps watch.
120. flume runs no process of its own between its commands. Every settle
     runs inside a command of flume's, started by an agent going quiet,
     by the terminal's watch or by a caller. No command of flume's waits
     on the merge queue: a submission's outcome is read at the settles
     that follow it (111, 124).
47. A stage or a submission that waits on its caller's word, by the
    launch or by a hold the caller put after it (130), starts only on a
    retry that names it (49).
142. flume settles between a stage's repetitions as between stages
     (46). Status gives a repeating stage with its group's place among
     the change's groups at the head and how many there are, such as
     `code 3/7`. The quiet limit (44), working past it (118) and a
     stall (130) run from each repetition's own start or end, never
     the stage's. A repetition ends short, stuck, lost or never begun
     as a stage does (38, 41 to 45, 110), and that end, a stop (51) and
     a hold (130) name its group; a hold put on a repeating stage while
     it runs holds its next repetition. A retry naming the stage starts
     the first group with a task unticked again, never the stage's
     first group.

### A.7 Submissions

111. flume submits a place whose kind lands once its last stage has
     delivered and its agent has ended. It does not while the launch
     holds the submission (47), or once the place's work is over (63).
     It submits the place's own branch at its head, to its base and to
     no other branch (15), through the repository's merge queue, the
     place recorded as the submission's submitter. It holds no wait on
     the verdict: every settle that follows collects from the merge
     queue the outcomes of the place's submissions pending for the place
     (133), and settles the place by the one delivered. A place whose kind does not land never reaches the merge
     queue.
112. A failed submission, one the merge queue blamed or found in
     conflict alike, sends the place back to the stage its kind
     names. flume starts that stage with a fresh agent and the merge
     queue's words as its words, the checks blamed and their logs or
     the files contested. For a conflict, the words carry the base's
     revision the merge queue tested against, and the stage's agent
     takes the base in by a merge of that revision it commits in its
     place, resolving the files contested, before anything else; a
     merge so asked is the agent's commit in its place (14), never
     flume's, and never a rebase. The stages after it run again in order
     as 40 and 47 allow, and flume submits again once the last delivers.
     A place that has gone back as many times as its kind allows (23),
     by failed submission and by finding together (131),
     waits for its caller's retry or drop instead. A submission the
     merge queue refuses or withdraws leaves the place waiting for a
     retry or a drop, and status names why.
113. A submission of the place's own branch that lands makes the place's
     work over (63), and flume starts nothing more in the place. The
     merge queue removes nothing of the place: flume tidies it (66).
124. A settle that finds the place's submission open and undecided asks
     again at the next settle, and where the merge queue moves only while
     something drives it, drives it one round (125). A host that
     restarted loses nothing, since the outcome stays pending in the
     merge queue's records until a settle collects it. flume never
     submits the place anew for it (111).
131. A kind runs through on its own. A stage's delivery starts the next
     stage as the host's room allows (70), and the last stage's delivery
     submits a place whose kind lands (40, 111), with no word from any caller, unless the launch
     or a hold put after it asks for one (47). The fix round is the
     stage the kind names for a failed submission (23): a failed or
     conflicting submission starts it with the merge queue's words
     (112), and a stop-short that found work, from the kind's last
     stage, starts it with the findings as its words, as a failed
     submission does; from any other stage found work is taken as
     needing an answer (42). The
     stages after the fix round run again in order and the place is
     submitted again. A place's goings-back, by submission and by
     finding together, count toward the kind's bound (23), past which
     the place waits on its caller, said and delivered (130, 43). A
     stop-short that needs an answer waits on it, which is a retry (42, 49). So a unit's
     whole course, from its first stage to its landing, with its fixes
     on the way, runs with no agent of a caller's deciding between the
     steps; what a caller decides is what to launch, what to answer, and
     what to do with a place past its bound (70).

### A.8 Retries, stops, drops and dones

48. flume starts a stage again on its own only when a failed submission
    sends the place back (112), and never bounds how often a caller
    retries. Status gives how many times each stage has started and how
    many times flume submitted the place.
49. A retry starts the stage it names with a fresh agent and the
    retry's words in its prompt, the words of a stop-short the stage
    ended with standing before them, so the agent reads the question
    with its answer (42), and the stages after it then run again
    in order, as 40 and 47 allow. A retry that names the submission
    submits the place's head again and starts no agent. A retry names
    any stage of the place's kind, one after the current stage among
    them, or the submission of a kind that lands. It never changes the
    place's kind, brief or base (8), and flume judges no order of stages
    but its own starts (40).
50. A retry ends the place's agent first, one that is not quiet only
    when forced (31), and is refused, naming the place, when the
    place's work is over.
51. A stop ends the place's agent and nothing else: the stage neither
    ends nor moves on, and waits for a retry or a drop. An agent that is
    not quiet is stopped only when forced (31).
52. A drop makes a place's work over (63). flume ends the place's
    agent, one that is not quiet only when forced, and starts nothing
    more in the place.
114. A done makes the work of a place whose kind does not land over
     (63). flume ends the place's agent, one that is not quiet only when
     forced (31), and starts nothing more in the place. A done on a
     place whose kind lands is refused, naming the place, and its caller
     drops it instead.

### A.9 Tells

53. A tell hands the agent of a place's current stage its words as a
    prompt, or nothing at all. A tell to a place with no live agent, or
    whose agent is asking, is refused with nothing typed.
54. A tell never interrupts a working agent: its words reach the agent
    only once it is waiting. A tell not delivered within the bound its
    caller gives, or within ten minutes where it gives none, is refused
    with nothing typed. A tell delivered is received or sent again as a
    prompt is (38).
55. A tell never starts, ends, holds or moves a stage, never counts as a
    retry or a finish, and never stands for a deliverable.

### A.10 Status

56. For every place on its host, status gives the place's repository,
    kind with its version and the declaration it came from, its name,
    branch, base and mark, and whether its kind lands; each stage's
    state, how it ended, and how many times it started; the current
    stage's agent, with its identity, its stream and its account each
    with where it came from (143, 145), its settings each with where it
    came from (32), its agent state, how much of its input its own
    record says was read from the prompt cache on its first request and
    over its session (152), and
    whether it works past its limit (118); each move of a stage or an
    intent from one account to another, with why (146, 147); whether the current stage's
    deliverable exists; the place's submission as the merge queue holds
    it, and how many times flume submitted the place; its change's
    tasks and which are ticked; each act of an agent's that flume
    refused (108); the part a refused stage could not fill (27); the
    words of a stop-short, and whether it needs an answer or found work, or of a failed
    submission; of a place
    waiting on its caller, the move it waits on, since when, a hold's
    words and whether it is stalled (130); the place's points, and
    beside them the time its newest submission spent in the merge queue
    and the time its checks ran (165, 168); a stage for review's plan
    with where it lives (163); for the host and for each of
    its streams, its agents running, the bound it states, its room, its
    points queued and in flight, and
    the places waiting for room in the order they would start, each with
    its stream, its priority, its points and since when (70, 143); for
    each stream, its points bound, its pace with the points started in
    its span and when the next of them leaves it, and the tokens its
    agents' own records gave (166 to 168); and for each
    pool, its accounts, each with its agents running and, while spent,
    until when (146).
130. A place whose next move is its caller's, a stage or a submission on
     hold (47), a stage ended short needing an answer (42), a stage for
     review (163), a stage
     reported lost (45), a prompt never begun (38), a readiness that failed (12),
     or a kind's last stage delivered where the kind does not land
     (114), waits on that move from the moment flume read it so, and
     status says which move and since when. A caller may put a place's
     next stage or its submission on hold after the launch, with its
     words saying what for, which status gives with the hold's since
     when; a retry naming the stage or the submission ends the hold (47,
     49). A place waiting on its caller under no hold's words for five
     minutes, or for the launch's bound where it sets one, is stalled:
     status says so, and each recipient of the place is delivered once
     that it is stalled and which move is theirs (43). A hold's words are the
     caller's to make good: the event they wait for is the caller's to
     see, and flume watches none and ends no hold itself (70, 72). A
     stage waiting for room (70) waits on the host and not on its
     caller: status says so, with its priority and its place in the
     queue, and such a place is never stalled.
57. Asking status starts no agent, sends nothing to one, and writes
    nothing.
58. Every fact status gives of a place's deliverable, change or
    submission is read where it lives when status is asked, at one head
    (25). flume never answers one of them from a record of its own, nor
    keeps one between asks. Status may be asked of one place or of every
    place, and reads places side by side.
59. A fact of a change that flume reads without the change's own reader
    agrees with what that reader gives at the same revision.
60. The same question about the same places gets the same answer,
    whoever asks and through whichever surface. Every surface answers
    from one core, and no surface computes a stage's end, a status, a
    submission or a tidy of its own.
61. Every answer has one form a program reads, the same through every
    surface, and that form only ever gains fields.
62. flume keeps only the live state of the places on its host. Once a
    place is tidied flume keeps nothing of it but, while an end of it
    stands pending for a recipient, the place's document, with no
    worktree and no branch, which goes once every end is delivered or
    its caller drops it; whatever else outlives a place is its caller's
    to keep, from what flume reported.

### A.11 Tidying

63. A place's work is over when it landed, its caller dropped it, or
    its caller declared done a place whose kind does not land. A
    submission of the place's own branch that lands before flume submits
    it is its landing, and flume then never submits the place. Work of
    the place's that reached its base any other way is not its landing,
    and the place stays: inside another place's landing, or pushed to
    the base by a hand.
64. flume removes only places it made, and only once their work is over
    and their agent has stopped. It never removes a worktree it did not
    make, the repository's main worktree, or a worktree whose agent is
    live.
65. flume never removes a place that holds a change not committed, a
    file neither committed nor ignored, or a lock. It keeps it and names
    what it holds.
66. flume removes a place through its repository's teardown, so what
    the repository stood up for the place goes with it. A teardown that
    fails keeps the place, named with the step that failed. No merge
    queue removes a place: flume removes every landed place itself, and
    its branch as 67 says (113).
137. When a place goes, what the terminal made to hold its agents goes
     with it, and what the terminal made for the places of its
     repository on its base goes once it holds nothing of a live place. flume never closes in the
     terminal anything it did not make: what a person put there keeps
     it open, and status names it with what holds it (138).
67. When a place goes, its branch goes only if it holds no commit whose
    change its base lacks, judged by the change each commit makes and
    never by ancestry alone. A branch holding such a commit is kept and
    named once, in the answer to the act that removed its place, and a
    launch that would make it again is refused while it stands (3).
68. flume removes nothing while it cannot read whether a place's work
    is over.

### A.12 Callers

69. flume does the same for every caller and needs none of them. What
    it does for a launch depends on the launch, the repository and the
    host, never on which caller asked or through which surface. flume
    records no owner of a place: any caller may act on any place, and a
    mark only finds places (7).
70. How many agents run at once on a host, and in each of its streams
    (143), is the host's fact, stated by whoever administers it in the
    host's own configuration (C.7), never counted by flume or a caller,
    and flume keeps to it. A stage that may start, a launch's first or a
    place's next, starts only while the host's agents running, every
    caller's and every stream's counted together, are under the host's
    bound, its stream's agents running are under the stream's, and an
    account of its pool is usable (145), and, for a place's first start,
    its stream's points bound and pace leave room for its points (166,
    167); otherwise it waits for room, a
    wait that is the host's and never its caller's (130). When a settle
    finds room it starts the stages waiting for it, streams of higher
    priority first and, within a stream, places of higher priority
    first and equals in the order they came to wait, as many as there
    is room for (46). A stage whose stream has no room, or whose pool
    has no usable account, is passed over for the next that may start,
    and an agent running is never ended for a place of higher priority
    (31). A place's priority is given at its launch,
    equal for all where none is given, and its caller may change it
    after, which reorders only what has not started. flume refuses no
    launch for want of room: every launch is taken and waits its turn,
    so a host's launched work is one queue flume keeps, across every
    caller. Status says, for the host, the agents running, the bound,
    the room and the queue (56). Beyond that flume holds no count or
    cap of its own on places, plans nothing across places and orders
    them by nothing but the priorities its callers gave and its
    streams' (143): what to
    launch, what each place holds, what matters most and when a stage
    or a submission on hold starts are the caller's. A host whose
    configuration states no bound, for itself or for a stream, has no
    queue there: every stage that may start starts as far as the bounds
    stated allow, and status gives the agents running and judges no room
    where no bound is stated.
143. A host's configuration may declare streams, each by a name, with
     its own bound on agents running, its priority among streams and the
     pool its agents' accounts come from (144); every place runs in
     exactly one. A stream may also state a bound on its points in
     flight (166) and a pace (167). A place's stream is the one its launch names, else the
     stream of the intent it serves (147), else the one the host's
     configuration names for its repository and kind, for its
     repository, or for its kind, in that order, else the host's default
     stream, which holds every place nothing names a stream for. A
     launch naming a stream the host's configuration does not declare
     is refused naming it (4). The host's bound caps every stream's
     agents together, and a stream that states no bound of its own is
     held by the host's alone (70). A stream's pool comes before the
     host's own (144), and a stream gives its agents no settings (32);
     the host's bound, its terminal and the runs it wakes for roles
     (132) are the host's alone. A caller names a stream by
     its name, and the name is all a caller needs of a stream. Status
     gives each place's stream and where it came from (56).
165. A launch may give its work's points: one number of the Fibonacci
     scale, 1, 2, 3, 5, 8, 13, 21 and on, which its caller sets and
     flume never estimates, changes or judges. Points belong to the
     place, the unit of work its caller estimated, and never to a stage:
     a caller estimates the work, not the kind's steps, which are the
     kind's. They measure its agents' work alone; the time the merge
     queue spends testing and landing it is the machine's, which the
     merge queue measures and flume reports beside the points, never in
     them (168). A place's points are queued from its launch until its
     first stage starts, and in flight from then until its last stage
     delivers, and again from a fix round's start, by failed submission
     or finding (131), until the last stage delivers again; between
     stages, and while its place waits on its caller, they stay in
     flight, since the work is not done. Once its work is over they are
     neither. A launch that gives no points while its place's stream
     states a points bound or a pace is refused, naming the stream (4):
     flume counts no guess against either. On a stream that states
     neither, points are only reported.
166. A stream's points bound caps its places' points in flight together,
     beside its bound on agents running, which stays, since accounts and
     their usage limits count the sessions that run at once. A place's
     first start waits for room while its stream's points in flight and
     its own would pass the bound, unless none are in flight, so a place
     larger than the bound runs alone; within a stream such a place
     holds the first starts behind it, so smaller places never pass it
     by for ever, and it holds no other stream's starts and no later
     stage of a place already started. A fix round's start puts its
     place's points in flight again whatever the bound, since work begun
     is finished before more is started, and waits only as 70 says for
     agents.
167. A stream's pace is a number of points and a span, an hour, a day or
     a week. A place's first start charges its points to its stream at
     that moment, and a start waits for room while the points its stream
     started in the span just past and its own would pass the pace,
     unless none were started in it, so a place larger than the pace
     starts alone once the span is clear. The span is rolling, the one
     that ends at each start, never a calendar's, so a stream keeps its
     rate over every such span and never spends twice its pace across a
     boundary. Pace is no priority: priority orders what starts (70), and
     pace caps how fast a stream spends; a place within a stream's pace
     still waits its turn by priority. A charge stands once made, the
     place's work dropped among it, and no later stage or fix round
     charges again. A stream that has spent its pace starts no first
     start until the span frees, and status says when the next charge
     leaves the span (56). The charges are kept in the host's own
     documents (153), so every flume process honours them and a place
     tidied leaves its charge behind.
168. flume reports beside a place's points what the machine spent on it:
     the time its newest submission spent in the merge queue, from
     submission to outcome or so far, and the time its checks ran, as
     the merge queue's records give them, read where they live when
     status is asked (58, 99), or that they are unknown. It
     reports each stream's tokens as its agents' own records give them
     (152), counted at each agent's end into the stream's document (153)
     and given over the last day and the last week. flume limits nothing
     on tokens, since they are known only once spent, and on machine
     time, which is the merge queue's.
71. flume submits a place's work, and an agent never does. flume submits
    only places whose kind lands (111), and reads each outcome from the
    merge queue, never from an agent's words or its terminal.
72. flume tells no person anything by itself. A surface shows what
    flume reports when it is asked.
132. A recipient may be named by a role's address, `<partition>/<role>`,
     rather than by a session. A run of the role is a place of the kind
     the host's configuration names for the address (C.7), named by the
     role, so at most one run of an address is live at once (3), and its
     agent takes the address as its session's name. Where a settle finds
     an end pending for an address with no run live or waiting
     for room, or a caller or another tool's carrier asks flume to wake
     the address, flume launches the address's kind at the priority the
     configuration gives it; a wake of an address whose run is live or
     waiting does nothing. The run's start collects every end pending
     for the address (43), so whatever came while no run was live is one
     run's. flume decides nothing in this: which address is a
     place's recipient, what the role's kind does and what its run decides are the
     caller's (69, 70, 72). An address the configuration names no kind
     for is woken by nothing, and status says the ends pending for it.

### A.13 Held state and hosts

73. flume keeps its held state on its host, outside every repository's
    content.
74. Every act flume performs is safe to repeat: a repeat of an act
    already done changes nothing.
75. Two acts on one place at once leave it as one or the other would
    have. Neither leaves the held state half written, and no two acts
    give a place two agents (30).
76. Every place flume made is in its held state until it is removed. No
    act leaves a worktree or a branch of flume's that its held state
    does not name.
77. flume stopping, or its host stopping, loses nothing flume held. On
    its return flume reads every place again from its held state, its
    repository, its terminal and the merge queue, and reports each agent
    that did not survive as lost (45). An agent the terminal resumed is
    the stage's agent, and its stage goes on, only when both its
    identity and its own record are those its stage started with (35).
    An agent the terminal brought back with no word that it started
    under that start's identity (35) is never the stage's agent,
    whatever its own record: the stage is reported lost, and flume ends
    that agent once it is quiet (31).

<!-- ANCHOR_END: part-a -->
<!-- ANCHOR: part-b -->
## Part B. Contracts across the seams

### B.1 The place

78. **make**: given a repository, a revision, a branch name and a
    location, a worktree there on a new branch at that revision; or a
    refusal because the branch or the location already exists (3, 9).
79. **ready**: given a place, each step its repository's readiness
    declares, run in the place in order with an environment that carries
    nothing of the caller's, each with its outcome and its words,
    stopping at the first that fails (11, 12).
80. **read**: given a place, its branch, its head, and whether it holds
    a change not committed, a file neither committed nor ignored, or a
    lock (65).
81. **remove**: given a place, its removal with its repository's
    teardown run, or a refusal naming the step that failed (66).
82. **remove-branch**: given a branch and its base, the branch removed
    when it holds no commit whose change the base lacks, or a refusal
    naming the commits it holds (67).
83. The guarantee: make never touches a branch or a location that
    already exists, and each operation is all or nothing.

### B.2 The kinds

84. **read-kinds**: given a repository and a revision, every kind the
    repository declares there, each with its stages; or that its
    declaration could not be read, with the reason (19, 20).
85. The same revision always gives the same kinds, reading changes
    nothing, and a declaration a launch carries is read the same way
    (19).
160. **read-locked**: given a lock and the packages the host holds, each
     kind the lock records with its content, and whether its content's
     hash is the one recorded; or that the lock or a package could not be
     read, with the reason (155 to 157). The same lock and packages
     always give the same answer, and reading changes nothing.

### B.3 The change

86. **read-change**: given a revision and a name, whether the change
    exists there, whether its planning is complete, its tasks each with
    whether it is ticked and the task group it is in, and whether it is
    archived (3, 24, 26, 140).
87. The same revision always gives the same answer, and reading writes
    nothing (59).
127. **locate**: given a place and a change's name, where the change
    lies in the place, for a prompt's change part (27, C.3); or that the
    profile keeps no change there.

### B.4 The agent

88. **command**: given resolved settings, a place, an identity and a
    prompt, how to start that agent so it works in the place under that
    identity (29, 32, 33).
135. **started**: given an agent, whether the agent has said it started
     under its start's identity and the settings its start recorded,
     with flume's guard and stop check in force; or that it started
     without them, naming each variable that differs by its name and
     whether its program or its mode did, with the mode it began in; or
     unknown (35, 77, 161, 162).
89. **received**: given an agent and a text, whether the agent received
    the text as a prompt, by its own word where the program gives one,
    or unknown (38).
90. **asking**: given an agent, whether it waits on a question it put to
    a person, the program's own ask for a person's permission among
    them (37, 53).
91. **own-work**: given an agent, whether own work it started still
    runs, or unknown (31, 44).
92. **stop-short**: the one way an agent tells flume it stops short,
    carrying its identity, its start's secret and its words (41).
115. **send-back**: given an agent about to go quiet and words naming
     its stage's deliverable, the agent kept at work with those words,
     or that the program gives no way to (110).
116. **guard**: given an agent, each act it would take that submits,
     merges or pushes its place's branch refused and reported, or that
     the program gives no way to (108).
121. **on-quiet**: given an agent, flume told at once each time the
     agent goes quiet, so that flume settles its place; or that the
     program gives no way to (46).
134. **ended**: given an agent, whether the program's own record says
     its session ended, or unknown; what a terminal with no state of its
     own reads an agent's stop from (45, C.5).
151. **spent**: given an agent, whether its own record says the account
     it runs under reached a usage limit, with the time the record names
     for the limit to reset, or unknown (146).
152. **usage**: given an agent, how much of its input its own record
     says was read from the prompt cache, written to it, and neither, on
     its first request and over its session, and how much it wrote out
     over its session, or unknown (56, 148, 168).
164. **plan**: given an agent working in its program's planning mode,
     the newest plan its own record says it put for review, with where
     the plan lives and when it was written, or none, or unknown; and
     each ask of the agent's to leave that mode declined with flume's
     words, so it stays in it, or that the program gives no way to
     (24, 34, 163).
93. The guarantee: each answer is what the agent's own record shows,
    and an answer the record does not give is unknown, never guessed
    from the terminal.

### B.5 The terminal

94. **open**: given a place, a command, an identity and where the
    settings put the agent, an agent running the command in the place
    under that identity, there; or that the start is held at a question
    the program asks before it starts, or that the program did not come
    up within the terminal's bound, each with what the terminal shows;
    or a refusal (30, 35, 107, 136).
95. **send**: given an agent and a text, the text delivered as input
    the agent receives, any text the agent holds typed cleared first,
    or a refusal; no answer, delivered or refused, leaves text typed for
    a hand (38, 53).
96. **state**: given an agent, its agent state (56): stopped only when
    the agent's program no longer runs, and unknown for anything the
    terminal cannot classify.
136. **screen**: given an agent, what the terminal shows of it, for
     status and a prompt never begun (35, 43); or that the terminal
     shows nothing.
97. **close**: given an agent, its end, or a refusal because it did
    not end (31).
138. **tidy**: given a place gone, what the terminal made to hold its
     agents closed, and what it made for the places of its repository
     on its base closed
     once it holds nothing of a live place; or each kept, named with
     what the terminal did not make that holds it (137).
139. **show**: given a place, its stages' states and a one-line count
     of the places of its repository on its base, clues the terminal shows a person
     beside the place's agents, or that it shows none; called at each
     settle that changes a stage's state. A clue is display only:
     nothing flume decides reads it back, and one that fails to show is
     logged and fails nothing (46, 56).
122. **watch**: the terminal settling each place with an agent in it, on
     a bound it states and when an agent's state changes, while flume
     runs nothing; or no watch (46, 119).
98. The guarantee: open never runs a second agent under an identity
    already live, and close never reports an end that did not happen.
    Every operation answers within a bound the profile states, and one
    the terminal does not answer within it is unknown or a refusal in
    the terminal's words, never waited on.

### B.6 The merge queue

117. **submit**: given a place, its branch at its head submitted to its
     base with the place as its submitter, answered once the merge queue
     holds it and before it decides, with the submission it made; or
     refused, naming why (111). Submit holds no wait and removes nothing
     (113).
133. **inbox**: given a place, every decided outcome of the place's
     submissions pending for it: landed, with the commit it landed as;
     failed, with the merge queue's words; or in conflict, with the
     files contested; each then recorded by the merge queue as delivered
     to the place; or that the merge queue could not be read (43, 111,
     112). A withdrawal is delivered by nothing, and read from
     read-submission (99).
99. **read-submission**: given a repository and a branch, the newest
    submission of that branch, whoever made it, with its target and its
    state: waiting, under test, landed with the commit it landed as,
    failed with what it named, or withdrawn; when it was submitted and,
    once decided, when, and how long its checks ran, where the merge
    queue records them; or none; or that the merge
    queue could not be read (63, 68, 71, 168).
101. The guarantee: landed is said only of a submission of that branch
     that the merge queue itself landed, never inferred from what the
     base holds (63). Submit removes no place (66, 113), and a pending
     outcome is delivered once to the place and never again.
125. **step**: given a base whose queue moves only while something
     drives it, one round of that queue, returning when the round does;
     nothing where the queue moves on its own (124).
126. **base**: given a repository and a base branch, the revision the
     base stands at where the merge queue's profile says the base lives,
     after the fetch that profile asks (9, C.1), or why it cannot be
     read; a repository with no merge queue bound answers the local
     branch.

### B.7 The store

102. **read**: given a place, or every place, the held state of each and
     the version each was read at.
103. **write**: given a place, the version read and its next held state,
     the write, all or nothing, which succeeds only if that place's held
     state is still at the version read (75). A new place's first write
     succeeds only if it has no held state yet.
104. The guarantee: the store holds nothing in a repository's content
     (73), and every flume process on the host reaches the same store.
128. **folder**: given a place, its own folder beside its held state,
     where its stages write for flume what a declaration puts under
     `{{state}}` (123, C.7), which goes when the place is tidied (62).
153. **host**: the host's own documents beside the places', each
     account's spent time, each intent's affinity, and each stream's
     charges against its pace and its agents' tokens (146, 147, 167,
     168), read
     and written as a place's held state is (102, 103), and reached by
     every flume process on the host (104).

### B.8 Binding the contracts

105. Each seam is bound by naming one profile of Part C: the terminal
     and the store once for the host; the place, the change and the
     merge queue once for each repository, by the binding the repository
     declares (20), and none guessed from another tool's files; the
     kinds by the one form every declaration takes (19); the agent for
     each stage, by its settings (32). A repository that names no place
     profile is bound to the one that needs nothing beyond git. One that
     names no change or merge queue leaves that seam unbound, so flume
     assumes no tool (11). Only a kind that lands reaches the merge
     queue (4, 111). Parts A and B do not change to admit a profile.
106. One conformance suite holds every profile to Parts A and B; a
     profile that fails it is not one.

<!-- ANCHOR_END: part-b -->
<!-- ANCHOR: part-c -->
## Part C. Profiles

Parts A and B do not change to admit a profile. Each profile's commands
and fields are checked against the tool itself, its own documentation
and how it behaves, and written here when the profile is built. flume's
core needs none of them.

### C.1 The place

| profile | make | ready | read | remove / remove-branch |
|---|---|---|---|---|
| **git worktree**: every repository; the one place profile | `git worktree add -b <branch> <location> <revision>`, at `<repository>/places/<kind>--<name>`, with no hook run | the toolchain, then the runner's setup, that the repository declares in `.config/sluice.toml`, run in the place in sluice's cleaned environment, as sluice readies its own places | `git status --porcelain=v2`; `git worktree list --porcelain` for a lock | `git worktree remove`, with no teardown but sluice's release where sluice is the merge queue (C.6); the branch by `git cherry <base> <branch>`, deleted with `git branch -D` when no line starts with `+` |

There is no worktrunk place profile: a worktree tool's create hooks run
a place's code with the host user's full permissions, outside any
executor, and flume runs no `wt submit` (record 0012), so nothing of a
place needs one (record 0014; sluice record 0013 for its own places). A
repository whose `[profiles]` names `place = "worktrunk"` is refused at
the launch, naming the one profile. What the toolchain step makes is kept in the place's own
git directory (C.7). A place's branch is `<prefix>/<name>`, the prefix
its kind's. The base's current revision (9) is where the merge queue's
profile says the base lives: under sluice, `origin/<base>` after one
fetch when `.config/sluice.toml` lands the base on a remote, and the
local `<base>` otherwise. With no merge queue bound, it is the local
`<base>`. A fetch that fails refuses the launch (9). A name is refused
when `git check-ref-format` refuses the branch it gives.

### C.2 The kinds and the binding

A declaration is TOML in the family's kind format (section 9), and flume
reads the fields below of it. A repository's is `.config/flume.toml` at
the base's revision (20); a launch's is the file `flume launch --kinds
<file>` names; a package's is the `kind.toml` at its root (weir C.4);
flume's own are built in, one package per version. Prompt paths are
relative to the declaration's file. A repository's binding (105) is the `[profiles]`
table of the same file, read at its default branch (20). That is
`origin/HEAD`'s revision after one fetch when the repository has a
remote, and the local default branch's otherwise. The place is then cut
from the base where the merge-queue profile says it lives (C.1). With no
table, or a seam left out of it, flume uses the profiles that need no
tool: plain `git worktree`, no change profile and no merge-queue
profile. flume reads no other tool's files to choose one.

```toml
[profiles]
place = "git-worktree"    # the one place profile (C.1); git-worktree when omitted
merge_queue = "sluice"    # reads .config/sluice.toml for where the base lives (C.1); none when omitted, and a kind that lands is refused (4)
change = "openspec"       # (C.3); none when omitted, and a kind that reads a change is refused (4)

[prompt]
goals = "docs/goals.md"   # the file whose text is the goals (149), relative to the repository, read at the base's revision with the kinds (20); none when omitted

[kinds.bump]
version = 2               # status names the kind bump@2 (19); 1 when omitted
branch = "bump"           # the prefix of its places' branches; the kind's name when omitted
starts_unready = false    # whether its first stage starts in a place that could not be made ready (12)
lands = true              # flume submits each place after its last stage (111); false when omitted

[kinds.bump.agents]       # settings for every stage's agent; a stage's own come first (23, 32)
program = "claude"
model = "sonnet"

[kinds.change.agents]     # settings for flume's own change@2, which the repository does not redeclare (32)
model = "opus"
mode = "acceptEdits"      # the agent's mode, one its program names (162); the account's own where no layer gives one
instructions = "Work in British English."

[kinds.change.agents.stages.verify]   # settings for one stage of it
model = "sonnet"

[[kinds.bump.stages]]
name = "code"
prompt = "prompts/bump-code.md"
standing = "prompts/bump-code-standing.md"         # its standing instructions, sent as written with no part filled (148); none when omitted
deliverables = ["commits"]                         # exactly one, spelled as below (18, 24)
makes = ["preview"]       # what the stage makes besides its deliverable, each recorded at {{made}} by its address or, for a thing that must run, by the branch and revision that bring it up (129); none when omitted
agents = [{ program = "claude", model = "opus" }]  # exactly one, with its settings (23, 32)
quiet = "45m"             # the stage's limit (44, 118); 30m when omitted

[[kinds.bump.stages]]
name = "review"
prompt = "prompts/bump-review.md"
conversation = true       # works with the operator and ends on its caller's finish (109); no deliverables
wait = true               # waits on its caller's word (47)
agents = [{ beside = "operator" }]   # opened beside the pane the launch's settings name as `operator` (107)
on_fail = "code"          # the stage a failed submission sends the place back to (112); this stage when omitted
max_send_backs = 3        # how many times a place may go back before it waits on its caller (112); three when omitted
```

`agents`, `deliverables`, `makes`, `on_fail` and `max_send_backs` are
the kind format's own names. A kind's `[kinds.<kind>.agents]` table
gives settings to every stage's agent, and a stage's own `agents` come
before it (32). A `[kinds.<kind>]` table holding `agents` and no
stages declares no kind: it gives settings to the kind of that name,
whichever kind the name resolves to (19), at whichever source and
version (154, 158), flume's own fix@1, chore@1, change@1, change@2 and plan@1
among them, and names one stage's by
`[kinds.<kind>.agents.stages.<stage>]`; settings for a stage the kind
does not hold refuse the launch naming the stage (4). A repository's
declaration resolved over by a launch's gives the place nothing of its
own kind's settings. A repository's agents tables give a program, a
model, a mode and instructions, and carry nothing of one host: an `env` in a
repository's `.config/flume.toml` refuses the launch naming the field
(4), since an environment is an account's alone (144, C.7). `mode`
is a field of every agents table, the kind's, a stage's, the
repository's and the host's (C.7), and of a launch's settings, `flume
launch --agent [<stage>.]mode=<mode>`; its values are the agent
profile's (C.4), and one the profile does not name refuses the launch
naming it, the stage and its layer (4, 162). A stage that delivers
`plan` starts in the profile's planning mode whatever the layers give
(163). flume reads `on_fail` and `max_send_backs` on a
kind's last stage only, since under flume a stage fails only by its
place's failed submission. A kind whose stage names more than one agent
or more than one deliverable is refused (4, 23). flume ignores a
section of a kind it does not know, such as an elaboration kind's
elaboration section (23). `repeat = "per-task-group"` on a stage that
delivers `tasks` makes it repeat per task group (140); the format
refuses any other value, and the field on any other stage.
`standing` is a path relative to the declaration's file, as `prompt`
is, and the kind format's own name (weir 53); its text is the stage's
standing instructions (148), and a `{{` part in it refuses the launch
naming the stage (4). The `[prompt]` table is flume's, beside
`[profiles]`, the repository's and no part of any kind, and names the
goals' file alone; a goals file the
revision does not hold refuses the launch naming it (4).

A kind's identity is written `<source>/<name>@<version>`, as
`flume/change@2` or `acme/review@1` (weir C.4). flume's own source is
`flume`, the repository's own `repo` and a launch's `launch`. `flume
launch --kind` takes `change`, `change@1` or `flume/change@1` (154),
and so does a role's `kind` (C.7). A repository's lock is
`.config/flume.lock` at the base's revision (20), and the host's
`$XDG_CONFIG_HOME/flume/flume.lock`, both in the kind format's lock form
(weir C.4):

```toml
[[kinds]]
kind = "flume/change@1"
hash = "sha256:9c1f…"     # the content's hash (156)

[[kinds]]
kind = "acme/review@1"
hash = "sha256:4e07…"
```

`flume kinds lock <identity>…` records each kind it names, at the hash
of its content as the host holds it or as flume carries it, in
`.config/flume.lock` of the working copy it runs in, beside any other
version of the same kind it records; `--host` writes the host's lock
instead, and `--remove` takes an entry out. It reads
only what the host already holds, fetches nothing, and commits nothing:
its caller commits a repository's lock (155). A package's agents tables
and a kind's declaration from any source carry no `env`, and name a
program by its name alone (158).

| deliverable (24) | spelled in `deliverables` |
|---|---|
| commits | `commits` |
| change written | `change` |
| tasks ticked | `tasks` |
| change archived | `archived` |
| report | `report:<path>`, the path relative to the place, or under `{{state}}`, the place's own folder beside the held state, which goes with the place (C.7). A report under `{{state}}` only where the caller keeps it lasting (123) |
| committed report | `committed:<path>`, the path relative to the place; the form for every other report a reader needs after the place is gone (123) |
| plan | `plan`, the plan the agent puts for review where its program writes it (164, C.4); once accepted, flume's copy is `plan.md` in the place's own folder (163, C.7) |

A prompt's parts are `{{brief}}`, `{{name}}`, `{{kind}}`, `{{stage}}`,
`{{branch}}`, `{{base}}`, `{{place}}`, `{{change}}`, `{{report}}`,
`{{made}}`, `{{group}}`, `{{notes}}`, `{{plan}}`, `{{words}}`, `{{unready}}` and
`{{needs}}` (the way to stop short, C.4). `{{#words}}…{{/words}}` renders its body only when there are
words: a retry's, with the question of the stop-short it answers before
them (49), or, for a stage that delivers a plan, with the path of the
plan last put for review before them (163), a failed submission's, the checks blamed and their logs or
the files contested (112), or a finding's (131). `{{plan}}` is the
path of the plan the place's last plan stage had accepted, flume's
copy in the place's own folder, and fills only once one was (27,
163). A launch is refused when
a stage asks for `{{brief}}` and it gives none (4). Any other bare part
with nothing to fill it leaves the stage refused (27), and
`{{report}}` fills only for a stage whose deliverable is a report or a
committed report, and `{{made}}` only for a stage that declares what it
makes, with the path it records the addresses at (129). `{{group}}`
and `{{notes}}` fill only for a stage that repeats: the repetition's
task group, its number, title and tasks, or that it has none, and the
path of the stage's notes (141). No part fills in a stage's standing
instructions (148). `flume prompt <place> <stage>` renders a stage's
standing prompt and prompt and starts nothing (29).

flume's own kinds, their prompts shipped with flume, each version a
package of its own with its prompts inside it (157). Each stage's text
that is the same for every place, what the stage is for, how it works
and what it delivers, is its standing instructions, and its prompt
holds the rest, the place's facts and then its run's:

| kind | branch | first stage starts unready | lands; its last stage's `on_fail` | stages, each with its deliverable |
|---|---|---|---|---|
| **fix@1** | `fix/<name>` | yes | yes; `code` | `code`: `commits` |
| **chore@1** | `chore/<name>` | yes | yes; `code` | `code`: `commits`; fix@1's stage under a prefix of its own, so a branch's name says which it was |
| **change@2** | `change/<name>` | no | yes; `code` | `construct`: `change`; `code`: `tasks`, repeating per task group (140); `verify`: `archived`. The verify prompt checks the work against the change and commits its report as `verify.md` in the change's directory. It then archives the change on the place's branch, the report with it, or stops short finding, with what fails, which sends the place back to code (131). The code prompt, sent again with a failed submission's or a finding's words, fixes what they name and records the fix as a task of the change, ticked. The code stage's standing instructions hold what every repetition is told alike; its prompt holds the place's and the change's paths, then its group, the notes' path and its words, which come last (141, 148). The newest of flume's change, taken by a launch that names no version where no lock records one (154) |
| **plan@1** | `plan/<name>` | no | yes; `code` | `plan`: `plan`, in the agent profile's planning mode, ended by its caller's finish (163); `code`: `commits`, fix@1's code stage with the plan accepted, `{{plan}}`, in its prompt, sent again with a failed submission's words |
| **change@1** | `change/<name>` | no | yes; `code` | `construct`: `change`; `code`: `tasks`, not repeating, one agent for the whole change; `verify`: `archived`, as change@2's. Kept beside change@2 (22): a repository picks it by recording `flume/change@1` in its lock, a launch by naming `change@1`, and a place launched at it keeps it (21) |

sounding hands flume each elaboration kind in the launch, as `flume
launch --kinds <file>`. An elaboration kind is written in the same
format, with an elaboration section that sounding reads and flume
ignores (23). flume reads its places and stages: the branch prefix
`sounding`, whether it lands, and its rounds' stages. A round's stage
delivers `report:{{state}}/conclusion.md`, or is a conversation.
sounding copies the conclusion into its own record when it settles the
round, so the conclusion is never committed on `sounding/<name>`
(123).

### C.3 The change: OpenSpec

| operation | how OpenSpec satisfies it |
|---|---|
| read-change | `openspec/changes/<name>/` at the revision: present when the folder exists; planning complete as `openspec status --change <name> --json` gives `isPlanningComplete`; its tasks the `- [ ]` and `- [x]` lines of `tasks.md`, each in the task group of the `## <n>. <title>` heading above it, a task above every heading in a group of its own with no number or title; archived when `openspec/changes/archive/<date>-<name>/` exists. A change of OpenSpec's spec-driven schema is read from its files with no `openspec` process, and a change of any other schema through `openspec` (59). |

### C.4 The agent: Claude Code

| operation | how Claude Code satisfies it |
|---|---|
| command | `claude` in the place, with flume's own Claude Code plugin loaded by `--plugin-dir`, which holds every hook below, `--model` from the settings resolved for it (32), `--permission-mode` with the mode they resolve where they give one and nothing where they give none (162), the standing prompt as `--append-system-prompt` (148), and `--exclude-dynamic-system-prompt-sections`, which moves what Claude Code's own system prompt holds of one place and host, its working directory, its environment, its memory's paths and the repository's git status, into the first message, so the system prompt ahead of the standing prompt is the same for every agent of one release. Its environment is the host user's login environment with the resolved environment over it, and `FLUME_AGENT`, `FLUME_SECRET`, `FLUME_PLACE` and `FLUME_STAGE`. `FLUME_AGENT` is the identity, `flume:<repository>:<kind>--<name>:<stage>:<n>`, the repository named by an id taken from its common git directory and `<n>` the stage's start. `FLUME_SECRET` is that start's secret. The program's kind, by which a terminal that starts a known agent program names it, is `claude`. The prompt is sent once the started ack has come and the agent waits, or carried as the command's argument under the printed command (C.5) |
| started | the plugin's SessionStart hook runs `flume ack started` with `FLUME_AGENT`, `FLUME_SECRET`, the plugin's version, the session's id, its transcript's path and the start's source; the ack is taken only while the secret is that start's, and a plugin version other than the binary's is reported. A start with no ack is starting. A session the terminal brought back with a bare `claude --resume`, which loads no `--plugin-dir` and carries no `FLUME_*`, acks nothing, so it is never the stage's agent (77). Before it acks, the hook compares what the agent runs under with the start's record (161): the program, read as C.5's check of a pane's foreground reads it, and, for each variable the record names, the digest of that variable in the hook's own environment, keyed by `FLUME_SECRET`; and, where the record names a mode, the hook input's `permission_mode`, which every hook's input carries in 2.1.296. Where any differs it acks nothing, records that the start began without its settings, naming each variable that differs and whether the program or the mode did, with the mode it began in, and starts `flume settle <place>` in the background, so flume ends that agent and starts the stage afresh. The variables a terminal sets for itself, `PATH` and `SHELL` among them, and the login environment beneath the settings are not in the record |
| received | the plugin's UserPromptSubmit hook runs `flume ack received` with the submitted prompt's digest and the start's secret, which Claude Code fires only when it submits the prompt, a prompt queued while the agent worked among them; text typed and never submitted acks nothing. With no ack, the session's transcript holding the prompt as a user turn, or as a queued `enqueue` record, answers received, and a transcript that cannot be read answers unknown |
| asking | a mark the plugin's hook leaves when the agent opens a question or a plan for a person (PreToolUse on `AskUserQuestion` and `ExitPlanMode`, but never on `ExitPlanMode` in a stage that delivers a plan, which the plan row declines), or Claude Code asks a person's permission (its permission-request or permission-prompt notification hook, where the pinned Claude Code has one), open until the transcript holds the answer, and cleared too at UserPromptSubmit and at SessionStart; the terminal's reading alone never decides it |
| own-work | background tasks the transcript shows started and not finished |
| plan | in a stage that delivers a plan, the plugin's PreToolUse hook on `ExitPlanMode` records the plan the tool's input names, its `planFilePath`, or its `plan` text where it names no file, written by the hook beside the start's record, with the time the hook ran, as the pinned 2.1.296 writes them; it then denies the tool with flume's words, that the plan is put for review and that its notes or an acceptance will come as the next message, so the agent stays in plan mode and ends its turn (163). The newest plan so recorded is the stage's, read at the path recorded |
| stop-short | `flume needs "<words>"` needs an answer, and `flume needs --found "<words>"` found work (41, 131); run by the agent or a process it started, refused unless `FLUME_AGENT` names the agent of the place's current stage and `FLUME_SECRET` is that start's, while the agent is live |
| send-back | the plugin's Stop hook blocks the stop, its reason naming the deliverable and `flume needs`, while the stage's deliverable does not exist, the agent has not stopped short, and no background task runs and no question is open; it never blocks a conversation's agent, and in a stage that delivers a plan it names `ExitPlanMode` as the way to put the plan |
| guard | the plugin's PreToolUse hook refuses a command that runs `sluice submit`, `wt submit`, `wt merge` or `git push`, its reason saying that flume submits the place, and leaves the mark status reads (56) |
| on-quiet | the plugin's Stop hook, each time it lets the agent stop, starts `flume settle <place>` in the background, so the place settles the moment its agent goes quiet (46) |
| ended | the plugin's SessionEnd hook marks the start's session ended; a session killed with no hook reads unknown here, and the terminal's state decides (96, 134) |
| last words | the agent's last message in the session's transcript; where the pinned Claude Code has a StopFailure hook, the plugin records the failure's reason there, a refused sign-in or a usage limit among them, as the agent's last words, which status gives with the agent (43) |
| spent | the StopFailure hook's `error` of `rate_limit` with words that open as the pinned Claude Code's own usage-limit messages do, "You've hit your limit · resets …" and "You've hit your session limit · resets …" among them, recorded by the plugin with the time it ran; a `rate_limit` with other words, a model under high load or the server limiting requests, is no usage limit. The time the limit resets is the words' `resets <when> (<zone>)` part, `<when>` a time of day, `3pm` or `3:30pm`, the first such time in the zone after the hook ran, or a date and time, `Nov 2, 3pm` or `Jan 3, 2027, 3:30pm`, and `<zone>` the zone's IANA name; none where the words have no such part (146) |
| usage | the session's transcript: each assistant record's `message.usage`, its `cache_read_input_tokens`, `cache_creation_input_tokens` and `input_tokens`, the first such record's for the first request and their sum for the session, and the sum of its `output_tokens` (152, 168) |

flume answers the folder-trust question when the terminal shows it, and
never the warning about bypassing permissions, a sign-in, a first run's
setup or a repository's MCP servers' approval (34). Each of those shows
before any hook runs, so a start held at one has no started ack. Where
the terminal reads the start held at a question, as herdr does, a
start held at any of those is never begun at once, delivered with the
screen; where it cannot, the start stays starting, status giving the
screen, until the operator answers it and the started ack comes, or it
is reported never begun at the stage's limit (35). Every hook skips
a subagent's input for the acks, and the guard refuses a subagent's
command as its agent's. Each hook calls the binary that started the
agent by its absolute path, written into the plugin with its version,
and never fails or holds up the agent's start or turn.

An account of a pool is `claude` and the `CLAUDE_CONFIG_DIR` of its
configuration home, where the account is signed in (144).

A mode is one of the `--permission-mode` choices of the pinned 2.1.296:
`acceptEdits`, `auto`, `bypassPermissions`, `manual`, `dontAsk` and
`plan`, the planning mode a stage that delivers a plan starts in (162,
163). Where the settings give none, flume passes no `--permission-mode`
and the account's own `settings.json` in its configuration home
decides. A mode the account's configuration does not allow, as
`bypassPermissions` where it disables that mode, starts Claude Code in
another, which the started ack's comparison finds (161); and the
warning Claude Code shows before a session in `bypassPermissions`
where the account has not yet accepted it is one flume never answers
(34). The prompt
cache lives five minutes from its last read by default, and an hour
where the account or the environment enables it, as the pinned Claude
Code decides; so a standing prompt pays wherever agents sharing it start
on one account within that lifetime of each other (147, 148).

The program that runs is the one the agent's settings name (32), by
name or by path, and never another a shell finds first. A terminal that
starts a known program by its kind, as herdr does, types the kind's own
name into the pane's shell; such a terminal sets the pane's environment
so that name runs the program the settings name, and checks that it did
before the start counts, as C.5 says.

### C.5 The terminal

| profile | open | send | state | close | watch |
|---|---|---|---|---|---|
| **herdr** | a pane in the herdr session the launch's settings name, flume's own otherwise: one workspace per repository and base, labelled `<repository> <base>` (`flume bolt/the-surfaces`, `sluice main`), made when the first place on that base opens, and in it one tab per place named `<kind>--<name>`, whose panes are the place's agents, so a stage that runs several agents at once splits its place's tab; where the settings name a pane, a split beside that pane instead, as for a conversation, left where its caller put it. The pane is made in the place with the host user's login environment and the agent's environment (C.4) over it set on it, its `PATH` led by a folder of the start's own holding the kind's name linked to the program the settings name, and its shell one that reads no startup file, so no login shell or rc file of the host's reorders that `PATH`; herdr's agent start runs the program there by the kind its agent profile names, its arguments passed whole, under the agent's herdr name; nothing is typed into the pane's shell. A start whose pane runs anything but the program the settings name is closed and refused, naming what ran, and a program herdr knows no kind for cannot run under herdr (32). The pane is held by its id and its server's socket, and found again by the agent's herdr name where the id no longer answers, as after the pane moves to another workspace: a name of at most 32 of herdr's legal characters made from the identity and unique on the server, a pane found by it taken as the agent's only once herdr lists it under that name. herdr's word that the program is ready is a second signal, never the start (35). A start herdr reads blocked is held at the program's question before it starts: the folder-trust question is answered and herdr waited on until the agent is idle (34), and any other leaves the start never begun with the screen; a start herdr does not see ready within its bound is never begun with the screen (35) | the pane's held input cleared with one ctrl+c while the agent waits, then herdr's prompt to the pane, then received read through the agent (89); a send never leaves text typed: one not received is cleared again before the next | herdr's reading of the agent: working as working; idle and done as waiting, since herdr's done is a finished turn nobody has looked at; blocked as asking only with the agent profile's mark (90), and as unknown without it; herdr's unknown as unknown; stopped only when the pane is gone, or herdr lists no agent in it and its foreground is the shell, or herdr lists it unrestored after its server's restart | herdr ends the pane and its process group, then reads that it is gone | kept by flume's herdr plugin on herdr's server, which runs between flume's commands. It runs `flume settle` for the session's places on a bound it states and at each change of an agent's state, reading every agent's state in one listing per tick |
| **printed command** | the command printed, the prompt carried in it, for a person to run in the place | refused, so every tell is refused and a prompt not received is reported never begun (38) | from the agent profile alone; stopped when its record says the session ended | refused unless the agent's record says the session ended | none, so flume runs attended (119) |

Under herdr a session is named `herdr:<pane>@<socket>`, the pane's id
and its server's socket, wherever a recipient or a launching session is
named (7, 43); a role's run is reached in the pane its live start holds,
found again by that start's herdr name as an agent's pane is (132).
Nothing is sent to a pane found by a name until herdr lists it under
that name, and its id is recorded before anything is sent to it.

The herdr profile records in the host's state, by id and server, each
workspace and tab it made. It closes a place's tab when the place goes,
its panes and their process groups with it (137); and a workspace it
made once that workspace holds no tab of a live place and nothing it
did not make. It never closes a workspace, a tab or a pane it did not
make: a workspace of its own where a person opened a pane is left open,
and status names it with what holds it. At each settle that changes a
stage's state the profile shows display clues, which nothing flume
decides reads back (139): the agent's pane titled with its stage and
state, and the base's workspace given a one-line count of the places
on that base running, asking, waiting on their caller and stalled. A clue
that fails to show is logged and fails nothing. Every herdr call is bounded, ten
seconds where the call states none, one that does not answer within it
read as unknown or refused in herdr's words; each is made with the
caller's own `HERDR_*` variables stripped and the recorded server's
socket passed, so a command run from another pane reaches the right
server. screen (136) is herdr's read of the pane's visible lines. Each
command and field the profile reads is checked against the herdr the
profile pins, 0.9.5 or later.

What the herdr profile reads of herdr 0.9.5, each call
`herdr <words>` with `HERDR_SOCKET_PATH` set to the pane's server, its
answer the JSON `result`, or an `error` whose `code` and `message` are
herdr's refusal and its words:

| operation | herdr's commands and fields |
|---|---|
| server | flume's own session is `flume`: `herdr session list --json`, its `sessions[]` read by `name`, `socket_path` and `running`; where it does not run, `herdr --session flume server` is started headless in a process group of its own and the listing read again until it runs, within the bound |
| open | the place's tab in the base's workspace, the one the host's state records as made for the repository and the place's base where `workspace list` (`workspaces[]`, `workspace_id`) still lists it; with none, `workspace create --cwd <place> --env <K=V>… --label "<repository> <base>" --no-focus`, the label whole, since herdr 0.9.5 states no limit on one,, recorded, its `tab.tab_id` renamed `<kind>--<name>` by `tab rename` and its `root_pane.pane_id` the pane; else `tab list --workspace <w>` (`tabs[]`, `label`, `tab_id`) and `pane list --workspace <w>` (`panes[]`, `tab_id`, `pane_id`), a split in the place's tab where one stands, `tab create --workspace <w> --cwd <place> --env <K=V>… --label <kind>--<name> --no-focus` (`tab.tab_id`, `root_pane.pane_id`) where none does, the tab recorded. Beside a named pane, `herdr:<pane>@<socket>` or a `pane list` entry by `pane_id` or `label`: `pane split <pane> --direction right --cwd <place> --env <K=V>… --no-focus` (`pane.pane_id`). Each `--env` is one variable of the host user's login environment (29), read once, with the agent's environment over it, the resolved environment (32) and flume's own, `PATH` led by the start's folder holding `<kind>` linked to the program, and `SHELL` a script in the start's folder, which herdr runs as the pane's shell, setting `SHELL` back to the user's and execing `zsh -f`, `bash --noprofile --norc`, or else `/bin/sh -i`, with `ENV` and `BASH_ENV` unset. Then `agent start <name> --kind <kind> --pane <pane> --timeout 120000 -- <arguments>`, the call bounded at its timeout and ten seconds more: `agent_started` with `interactive_ready` true is herdr's ready; `agent_not_ready` is the start held at a question, read by `pane read <pane> --source visible --format text`, the folder-trust question answered by `agent send-keys <pane> <keys>`, herdr's key names as the agent profile states them, then `agent wait <pane> --until idle --timeout 30000`, and any other question the start never begun with those lines; `timeout` the start never begun with the pane's visible lines; `agent_name_taken` refused, an agent live under the identity (98); `agent_pane_busy`, `agent_pane_not_found` and `invalid_agent_timeout` refused in herdr's words. Once started, `pane process-info --pane <pane>` and the host's process table read the program in the pane's foreground, which must be the one the settings name, by its path or, for a program a script starts, the script's path among its arguments |
| found again | where `pane get <pane>` answers `pane_not_found`, `agent get <name>` and the pane its answer names, taken only where herdr lists that pane's agent under the name, its id then recorded in place of the old; `agent_not_found` leaves the pane gone |
| send | `agent send-keys <pane> ctrl+c`, then `agent prompt <pane> <text>` |
| state | `pane get <pane>`: `pane_not_found` or `server_not_running` read stopped; `pane.restore_error` set reads stopped; with `pane.agent` set, `pane.agent_status` `working` as working, `idle` and `done` as waiting, `blocked` as asking, `unknown` or anything else as unknown; with no agent, `pane process-info --pane <pane>`, stopped when `process_info.shell_pid` is `process_info.foreground_process_group_id`, unknown otherwise |
| screen | `pane read <pane> --source visible --format text` |
| close | `pane close <pane>`, `pane_not_found` read as already closed; then `pane get <pane>`, gone only on `pane_not_found` |
| tidy | the place's recorded tab: `pane list --workspace <w>` read for panes in it, and a pane flume did not open there keeps it, named; else `tab close <tab>`, a tab already gone read as closed. Then the base's recorded workspace: where `tab list --workspace <w>` holds no tab but those of live places it made and `pane list` no pane it did not open, `workspace close <w>`; otherwise kept, and what holds it named |
| show | `pane report-metadata <pane> --source flume --title "<stage> · <state>" --display-agent <kind>--<name>`; `workspace report-metadata <w> --source flume --token flume=<summary>`, the summary such as `3 running · 1 asking · 1 waiting on caller · 0 stalled`, shown where the host's herdr sidebar rows name `$flume` |

What herdr 0.9.5 was seen to do, which the readings above allow for:
`agent start` types the program's name into the pane's shell, so the
shell's `PATH` and startup files choose which program runs, and hands
it the arguments after `--` byte for byte, 20,000 characters of
instructions with quotes, `$`, backticks and non-ASCII among them; it
answers `agent_started` only once the program is ready for input, which
for Claude Code in a trusted folder came after its SessionStart hook
had run, and at the folder-trust question it answers `agent_not_ready`
at once, leaving the agent `blocked` with its name; it reads Claude
Code's first run's theme picker and its sign-in choice as ready, which
the started ack, never herdr's ready, rules out; a program that is
missing or ends while it starts shows only as `timeout` once the whole
bound has passed. `agent start` sets no environment and no directory of
its own: the pane's, given at `pane split`, `tab create` or `workspace
create`, is what the program sees. No flag names a pane's shell: herdr
runs the `SHELL` of the pane's own environment, after any
`default_shell` the host's herdr configuration sets, as a login shell
on macOS, whose startup files, a nix-darwin `/etc/zshenv` or macOS's
path_helper among them, rebuild `PATH` so that the start's folder no
longer leads it. A pane's id is kept when it moves to
another tab and changes when it moves to another workspace, while its
agent's name goes with it, and a name is gone from `agent list` once
its program exits. A pane's environment is not kept across a restart of
herdr's server, so an agent herdr brings back runs without it and has
no started ack for its start (77); the operator drains flume's places
before restarting herdr's server on purpose. The agent commands take an
agent's name or its pane's id, never `<pane>@<socket>` or a terminal's
id. `agent wait` with no `--timeout` waits for ever, so the profile
always passes one.
`done` comes only after a turn a prompt began, and only on a pane
without focus, a focused pane reading `idle` at the same point; herdr
knows Claude Code by its program's name, `claude`; an agent that
reports its own state from inside its pane, as herdr's own Claude Code
integration does, can stay listed with status `unknown` after its
process has exited, which the profile reads unknown, never stopped, so
the core's reading of the agent's ended decides (134); a pane whose
working directory was removed is listed with a `restore_error` after
its server restarts. The refusals met are `pane_not_found`,
`agent_not_found`, `agent_blocked`, `agent_not_ready`,
`agent_pane_busy`, `agent_name_taken`, `agent_pane_not_found`,
`invalid_agent_timeout`, `timeout` and `server_not_running`; any but
those the readings above name is read unknown, or refused in herdr's
words.

The printed command tidies nothing and shows no clue, since it made
nothing in a terminal. It reads no tool: open prints the line `cd <place> &&`
the command's environment, program, arguments and prompt, and marks it
printed for the identity in the place's folder, refusing to print it
again; its state is unknown, and the core reads its agent stopped once
the agent profile's ended reads yes (134).

### C.6 The merge queue: sluice

| operation | how sluice satisfies it |
|---|---|
| submit | flume runs `sluice submit <base> --no-wait --json` in the place, with no multiplexer's session in its environment, so sluice records the place's worktree as the entry's submitter and no session, pushes nothing into any pane, and answers with the entry at once; a refusal is its exit and words. flume never passes `--check`, and never runs `wt submit`, whose waiting half removes the place (111, 113). |
| inbox | `sluice inbox --json` (sluice clause 51), run in the place, which delivers the place's decided entries pending for it once and marks each delivered; sluice answers nothing again for an outcome already delivered; a withdrawal is read from read-submission (133) |
| read-submission | `sluice status <base> --json`, read once for each repository at each ask; the newest entry submitted from the place's branch, whoever submitted it; landed is that entry landed, its landing commit's `Sluice-*` trailers naming it |
| step | `sluice step <base>`, one round of the base's queue, run by each settle that finds the place's submission undecided; beside a live `sluice run` the step finds the branch's lock held and does nothing, so the queue moves with nothing standing and never twice (124; sluice clause 135) |

On landing sluice removes nothing, and flume tidies every landed place
itself, through the place profile's teardown (C.1), and its branch as
67 says. Whenever
flume removes a place itself, landed, dropped or done, it first runs
`sluice release` in it as part of the place's teardown (66). sluice runs
the repository's `[tests] release`, which ends what the place's runs
left up, and frees the ports it holds for the place; it says `nothing to
release` when it holds none. A release that fails keeps the place, named
with that step (66). Readiness and where the base lives
(C.1) are read from the same `.config/sluice.toml`.

What the profile reads of sluice 0.55.0, each command run with every
multiplexer's session (`HERDR_*`, `ZELLIJ*`, `TMUX`, `TMUX_PANE`)
stripped and `GIT_TERMINAL_PROMPT=0`, a refusal read as its JSON
`error.message` where it gives one and its errors otherwise:

| operation | sluice's commands and fields |
|---|---|
| submit | `sluice submit <base> --no-wait --json` answers `{ahead, branch, id}` and nothing more; the entry is `id` |
| inbox | `sluice inbox --json` answers `outcomes[]`, each with `state`: `landed` with its commit in `landed_as`; `failed`; `conflict` with the files contested in `conflict.paths`. Each one's words are its `notice`, or where it holds none its `state`, `branch` and the `task` of each of its `failed[]`. A failure's notice names the check that failed, not its log. A conflict's base revision is `tested.on` (`tested: {combination, on, submissions}`), never parsed from the notice; a conflict found while the candidate was formed, before any test, carries no `tested`, and its base is then the base's revision where the profile holds it, `<remote>/<base>` or the local base, read with no fetch |
| read-submission | `sluice overview --json`, each of its `branches[].branch`, then `sluice status <branch> --all --json`, its `submissions[]`: the one with the highest `id` whose `from.worktree` is the place's branch, its `state` `queued` as waiting, `testing` as under test, `landed` (with `landed_as`), `failed`, `conflict` or `withdrawn`; any other state is read as not understood. Its `submitted` is when it was submitted; when it was decided and how long its checks ran are read from sluice's records of the entry and its runs where the pinned sluice gives them, checked against it at the build, and unknown where it does not (168) |
| step | `sluice step <base> --json`, run in the repository |
| base | the remote is the `remote` of the base's table under `[branches]` in `.config/sluice.toml`, the base's own or the first pattern with one `*` that names it, read at the local base and else at each remote's tracking copy; where it names one, `git fetch <remote> +refs/heads/<base>:refs/remotes/<remote>/<base>` once, the base at `refs/remotes/<remote>/<base>` |
| place | from the same policy, `[tests] toolchain` as the place's toolchain, `moon setup` where `[tests] runner` is `moon`, and `sluice release` as its teardown, handed to the place profile through the binding |

sluice keeps its host state under `$XDG_STATE_HOME/sluice`, and once a
branch has had a submission its protect hook refuses a commit made to
it directly.

### C.7 The store: the host's state directory

The family's storage rule (section 9) settles where flume's state
lives:

- Each place's live state is host state, one document per place under
  `$XDG_STATE_HOME/flume/` (`~/.local/state/flume/`), and goes when the
  place is tidied (62).
- The host's bound is one word of the host's own configuration,
  `$XDG_CONFIG_HOME/flume/config.toml` (`~/.config/flume/config.toml`):
  `[host] agents = <n>`, how many agents of flume's places the host
  runs at once (70), stated by whoever administers the host. A host
  with no such word states no bound and has no queue.
- The host's streams and pools are tables of the same configuration:
  `[streams.<stream>]` with `agents`, its bound, `priority`, zero where
  it gives none, and `pool`; `[pools.<pool>]` with `strategy`,
  `fill-first` or `least-busy`, and `accounts`, in order, each with a
  `name`, a `program`, an `env` read as an agents table's is, and an
  optional `agents`, the bound on agents running under it (143 to 145).
  A stream may also state `points`, the bound on its points in flight
  (166), and `pace`, `{ points = <n>, per = "hour" | "day" | "week" }`
  (167); a stream that states either refuses a launch that gives no
  points (165), which a launch gives by `flume launch --points <n>`.
  `[host] pool` is the pool of a place whose stream names none. An
  account's `env` is its agents' environment over the login
  environment (32): a leading `~` in a value is the host user's home
  and `$VAR` or `${VAR}` that variable of the host user's login
  environment, never of the caller's session (29), and a variable it
  names that the environment lacks refuses the start naming it. A
  repository, a repository's kind and a kind are given a stream by
  `stream` in `[repos."<repository>"]`, `[repos."<repository>".kinds.<kind>]`
  and `[kinds.<kind>]`. The stream `default` holds every place nothing
  names a stream for, bounded by the host's bound alone unless a
  `[streams.default]` table states its own. So

  ```toml
  [host]
  agents = 8

  [streams.work]
  agents = 5
  priority = 10
  pool = "work"

  [streams.personal]
  agents = 3
  pool = "personal"
  points = 8
  pace = { points = 13, per = "day" }

  [pools.work]
  strategy = "fill-first"
  accounts = [
    { name = "work-1", program = "claude", env = { CLAUDE_CONFIG_DIR = "~/.claude-work-1" }, agents = 4 },
    { name = "work-2", program = "claude", env = { CLAUDE_CONFIG_DIR = "~/.claude-work-2" } },
  ]

  [pools.personal]
  strategy = "least-busy"
  accounts = [{ name = "personal", program = "claude", env = { CLAUDE_CONFIG_DIR = "~/.claude-personal" } }]

  [repos."~/Code/acme"]
  stream = "work"
  ```

  runs acme's places in `work`, up to five of the host's eight agents,
  ahead of `personal`'s, on work-1 until it runs four or is spent and
  then on work-2, while `personal` holds at most 8 points in flight
  and starts at most 13 points in any day.
- Each account's spent time and each intent's affinity is host state,
  one document each beside the places' under `$XDG_STATE_HOME/flume/`,
  `accounts/<pool>/<account>.json` and `intents/<digest>.json`, the
  digest the intent's name's or its repository's and base's, written as
  a place's is (146, 147, 153). So is each stream's,
  `streams/<stream>.json`: each charge against its pace, its place,
  points and time, and each agent's tokens at its end, kept a week,
  the longest span a pace names (167, 168).
- The host's terminal is one word of the same configuration,
  `[host] terminal = "<profile>"`, naming a terminal profile of C.5,
  `herdr` or `printed`, and the printed command where it names none
  (105).
- The settings a host gives its agents are tables of the same
  configuration, by kind, `[kinds.<kind>.agents]`, and by repository
  and kind, `[repos."<repository>".kinds.<kind>.agents]`, the
  repository named by its location on the host as a launch names it;
  each gives `model`, `mode` and `instructions`, and names one stage's by a
  further `.stages.<stage>` table (32). They are read at each agent's
  start. So `[kinds.change.agents] model = "opus"` and
  `[kinds.fix.agents] model = "sonnet"` run change@2 on opus and fix@1
  on sonnet, under whichever account each stage's pool gives. Settings
  for a kind or a stage the place does not run are ignored.
- The roles a host wakes are a table of the same configuration:
  `[roles."<partition>/<role>"]` with `repository`, `kind`,
  `priority`, `base`, the repository's default branch where it names
  none, and an optional `brief`, `stream` and `points`, the place a woken run is launched as
  (132), stated by
  whoever administers the host. An address the table names nothing for
  is woken by nothing.
- The packages of kinds from outside the host holds are host data,
  each a directory under `$XDG_DATA_HOME/flume/kinds/`
  (`~/.local/share/flume/kinds/`), `<source>/<name>@<version>/`, holding
  the package as it travels, its `kind.toml` at its root (157, 159).
  Several versions of one kind lie side by side, and flume reads them
  and never writes them. The host's lock is
  `$XDG_CONFIG_HOME/flume/flume.lock`, of the host's configuration
  (155, C.2).
- What readiness makes for a place, its toolchain among it, is kept in
  the place's own git directory, `git rev-parse --git-dir` in the
  place, and goes with the worktree.
- A deliverable a later reader needs is committed with the work on the
  place's branch, never kept only on the host. The change kind's verify
  report is in the change's directory (22), and any other such report
  is a committed report (24). A report under `{{state}}` is the one
  exception, and only where its caller keeps it lasting, as sounding
  copies a round's `conclusion.md` into its own record (123).

| operation | how the state directory satisfies it |
|---|---|
| read | the place documents, each carrying its own version |
| write | a new document written beside the old and renamed over it, under a lock held for the write, and refused when the place's version has moved. flume makes a new place's document by an atomic create that fails when one exists (75, 103) |

A place's own folder there holds what its stages write for flume, such
as a report a stage's declaration puts under `{{state}}`, a
repeating stage's notes, `notes/<stage>.md`, which `{{notes}}` names
and flume never reads (141), and the plan its caller accepted,
`plan.md`, which `{{plan}}` names (163); it goes when the place is
tidied (62).

<!-- ANCHOR_END: part-c -->
<!-- ANCHOR: invariants -->
## 7. Global invariants

- **I1.** A stage ends only at its deliverable, its agent's stop-short,
  or, for a conversation, its caller's finish; never at a quiet terminal
  (39, 41, 109).
- **I2.** A place has at most one agent, and no agent that is not quiet
  is ended unless a caller forced it (30, 31).
- **I3.** flume submits the places of a kind that lands, and an agent
  never submits. flume never commits, merges or lands, and moves no
  branch but its places' own (14, 71, 108).
- **I4.** flume removes only what it made, and never a commit its base
  lacks (64, 67).
- **I5.** A prompt or a tell is received or reported, never left typed
  (38, 53).
- **I6.** flume decides nothing its callers decide: what to launch, each
  place's priority, or when a stage or a submission on hold starts; how
  many agents run at once, on the host and in each of its streams, the
  streams' priorities and the accounts its agents run under are the
  host's facts, which flume keeps to (1, 70, 143, 144).
- **I7.** A place whose kind does not land never reaches the merge
  queue, and a failed submission sends a place back only to the stage
  its kind names (111, 112).
- **I8.** flume runs no process of its own between its commands. An
  agent going quiet and the terminal's watch settle a place, and every
  settle reads the outcome of its open submission. Under a terminal that keeps no watch, every command
  of flume's that acts settles every place first (46, 119, 120).

<!-- ANCHOR_END: invariants -->
<!-- ANCHOR: non-goals -->
## 8. Non-goals

- Coordinating many hosts: launching on another host, moving a place
  between hosts, or one status across hosts. A caller that spans hosts
  calls each host's flume.
- Deciding what to launch, what matters most or what comes next, or
  planning across places: flume orders a host's waiting work by nothing
  but the priorities its callers gave. A team's bolts, its approvals,
  its review batches and the conflicts between its units are crew's;
  how many agents a host runs at once is the host's fact, stated by its
  administrator, which flume keeps to and nobody counts in slots (70; record 0010).
- Testing or landing work. flume submits a landing kind's place, and
  the merge queue tests it under the repository's gate and lands it.
- Keeping the record of the work a place served: millpond's item,
  crew's plan, sounding's elaborations and their rounds.
- Working an elaboration: its inputs, the soundings it was based on,
  its rounds, its conclusion, the operator's decision on it and its
  elaboration kinds are sounding's.
- Judging a deliverable's content. A later stage's agent or a person
  does.
- Answering an agent's question to a person, or telling a person
  anything by itself.
- Keeping a place current with its base. A caller or a stage's agent
  takes the base into the place, as a stage a conflict sent the place
  back to does (112).

<!-- ANCHOR_END: non-goals -->
<!-- ANCHOR: givens -->
## 9. Environment givens

Constraints already fixed:

- Repositories are git repositories, and places are git worktrees on
  the host flume runs on.
- An agent is a coding agent program run in a terminal on the host. It
  keeps its own record of the prompts it received, and works unattended
  in its place or with the operator.
- Work lands through a merge queue, which tests a branch's work as it
  would land and records each submission.
- The callers are the operator, millpond, headwater, sounding and crew,
  each through flume's command line or a plugin of flume's.
- flume is free and open source.
- A kind is written in the family's one kind format. The format is
  defined once in the family's shared crates, in a public repository of
  the family's own, and the family's other tools build on it. flume
  runs the part of it that 23 names, so a repository's kinds keep their
  meaning in any tool that runs more of the format. An elaboration kind
  is written in the same format, with an elaboration section that
  sounding reads and flume ignores.
- The family's storage rule places each piece of state in the lowest of
  five layers that holds every reader it has. The layers are the host,
  the worktree, the clone, a shared branch and the repository's
  content. Host state goes under the host's own directories for config,
  state, data and cache, by its kind.

The rest of the stack, which a model builds on unless it says why not:

- One static binary, written in Rust, as sluice is, with no daemon of
  its own (120).
- Every answer as JSON on request, the form of (61).
- Three surfaces answering from one core, each a plugin kept outside the
  core as sluice keeps its plugins:
  - a command line: `flume launch`, `status`, `tell`, `stop`, `retry`,
    `finish`, `drop`, `done`, `tidy` and `prompt`; `kinds lock`, which
    writes a lock (155); `needs` for an agent; and `settle`, which the
    two plugins run;
  - a Claude Code plugin that gives every session `/launch` and serves
    `status` over MCP. flume loads it into every agent it starts, and
    its hooks hold the asking mark, the stop check and the guard, and
    settle the place the moment its agent goes quiet;
  - a herdr plugin whose sidebar shows every place in flight with its
    kind, its stage, its agent's state, a change's tasks ticked and its
    submission. Its keys open a place's pane, tell its agent, stop it
    and retry its stage. On herdr's server, which runs between
    flume's commands, it keeps the watch, and so catches an agent that
    crashed, hung or was killed, a prompt never received, and an agent
    stuck working.
- herdr with flume's plugin as the terminal that keeps watch, which
  unattended use needs (119). Under the printed command flume runs
  attended.
- The profiles of Part C: plain git worktrees, the kind format in
  `.config/flume.toml`, OpenSpec, Claude Code, herdr, sluice and the
  host's state directory. A repository with no `[profiles]` table gets
  plain git worktrees and no change or merge-queue profile (C.2).
- How each caller uses flume:

  | caller | launches | keeps |
  |---|---|---|
  | the operator | `/launch <brief>` in any session, or the herdr plugin's key | nothing; the sidebar shows each place |
  | millpond | an item's send, as a fix or a change, the item's brief as the launch's | the item's record and its sends, and the landing, written from the merge queue's record of the place's branch |
  | headwater | its fix key, as a fix with the release's brief | nothing |
  | sounding | each round of an elaboration, as a place of the elaboration kind it hands in the launch, a conversation's agent beside the operator's pane | the inputs, the soundings each was based on, the rounds, the operator's notes and decisions, and the record, with each round's conclusion copied from its report; its go-on is a retry with the operator's notes as words, its accept a done or a retry that releases a held submission, and its drop a drop |
  | crew | each unit, chore or fix of a bolt, as a place of flume's own kinds, change, chore or fix, with no stage and no submission on hold, so the kind runs through and its fix round runs on its own (131); each agent's settings from crew's roles, marked with the bolt; a review note the user marked fix as a fix launched on the bolt's branch with the note as its brief | plans, bolts, proposals, review batches, the rail and its cards; it launches a bolt's work whole, each unit as the work it follows allows, and keeps no slots: the host's room and the queue are flume's, and the user's priorities, set on the rail, reach flume as each place's priority (70); its word to a place is a retry answering a stop-short that asked, or a retry or drop of a place past its kind's bound; it names each place's recipient by a role's address, so a role with no live run is woken to collect an end (132), and each end is delivered to it (43) and reads the rest from status; a role's own work that lands is a place of its own, so no session of crew's submits; it decides no step between a unit's stages, and runs no agent of its own in the place (records 0010 and 0011) |

<!-- ANCHOR_END: givens -->
<!-- ANCHOR: questions -->
## 10. Questions the model must answer

These are not requirements.

- When a verify stage finds work to fix, does its agent stop short with
  the findings for a caller's retry, or does its finding send the place
  back to code by itself, as a failed submission does (42, 112)? Ruled
  2026-10-28: by itself. A stop-short that found work, from the kind's
  last stage, sends the place back to the kind's fix round with the
  findings as its words, counting toward the kind's bound; one that
  needs an answer waits on it (131; record 0011, accepted 2026-10-28).
- Does a caller learn a stage's or a submission's end by asking, or
  does flume tell it, and through what (43, 46)?
- May a repository declare deliverable forms of its own, such as a
  command that must pass (24)?
- How does a kind that lands only some of its place's work, an
  elaboration's writebacks and never its prototype, have only that work
  reach its base without the rest of its branch (67, 111)? sounding's
  statement asks the same.
- How many times does the stop check send an agent back before its
  stage is left to the stuck limit (44, 110)?
- When the operator ends a conversation's agent in its terminal, is the
  conversation finished or lost (45, 109)?
- When the stage a failed submission sends a place back to waits on its
  caller's word, does the return wait on that word too (47, 112)?
  Ruled 2026-10-26: no. The return starts the stage at once with the
  merge queue's words, since the word was given for the work the fix
  continues; the stages after it that wait still wait (47).
- What is a kind's limit on going back when its declaration sets none
  (23, 112)? Ruled 2026-10-26: three, as C.2's example reads; the core
  takes it as a default the binary gives.
- How many times may the stop check send an agent back (110)? Ruled
  2026-10-26: as often as it is asked while the deliverable is missing;
  the stage's quiet limit (44) is the bound, never a count.
- A conversation's agent that stops with no finish (109, 45)? Ruled
  2026-10-26: the stage is reported lost as 45 says, and waits on a
  retry or a finish; nothing ends it but the finish.
- Is a stage or a submission that holds for its caller's word reported
  as waiting too long (47)? Ruled 2026-10-26: no; a hold is a state
  status names, never a wait status warns of.
- How is the most capable model's allowance spent against an account's
  weekly limit overall, rather than one usage limit at a time (144 to
  146)? Not decided (record 0020): until it is, an account is spent
  only when its agent's own record says so.

<!-- ANCHOR_END: questions -->
<!-- ANCHOR: scenarios -->
## 11. Scenarios the model must satisfy

- **S1.** The operator presses headwater's fix key on a release. flume
  makes a fix place on a new branch from the base's current revision,
  readies it, and starts the code stage's agent with the release's
  brief. The agent commits the bump, waits on a test run it started, and
  goes quiet once the run passes. flume ends it and submits the place.
  The merge queue lands the branch, the next settle collects its
  outcome, and flume removes the place through the repository's
  teardown. Its branch,
  which holds nothing the base lacks, goes too.
- **S2.** millpond sends an item as a change. Construct writes the
  change and commits it with its planning complete. Code ticks its tasks
  over four commits, and status shows two of five ticked, then five.
  Verify checks the work against the change, commits its report in the
  change, archives the change and commits, and flume submits the place,
  which lands with the change and its report archived. No caller read a
  terminal at any point.
- **S3.** A code stage's agent ends its turn to wait on a suite it
  started. Its terminal shows nothing for twelve minutes. The stage does
  not end, the stop check does not send the agent back, and the stage is
  not reported stuck while the suite runs. It ends when the last task is
  ticked and the agent is quiet.
- **S4.** A construct agent cannot tell which of two designs the brief
  means, and stops short needing an answer, saying so. The stage ends short, no
  code stage starts, status shows the place waiting on an answer with
  the question, and crew is told the words whole. The design agent's
  answer comes back as a retry of construct with the answer as its
  words, and a fresh agent starts with the question and the answer in
  its prompt (42, 49).
- **S5.** On a loaded host a code stage's agent takes four minutes to
  come up. flume reports the start unknown, not failed, and sends the
  prompt once the agent waits for input. It finds the prompt not
  received, sends it once more, and the agent receives it. Nothing is
  left typed in its terminal.
- **S6.** The operator tells a place's agent while it asks a person a
  question, and the tell is refused with nothing typed. They tell it
  again while it works. The words reach it once it waits for input, and
  its stage is unchanged.
- **S7.** A caller launches two places, every stage after construct and
  each submission on hold. Each construct delivers, and flume starts
  nothing more. The caller's word starts one place's code stage, and
  later its submission. flume launches no third place of its own; which
  work the caller launches next stays the caller's (70).
- **S8.** One unit's work reaches the base inside another place's
  landing. flume does not read it as the first place's landing: the
  place stays, and its next stage waits on crew's word.
- **S9.** A caller drops a fix whose branch holds a commit the base
  lacks. flume ends the fix's quiet agent, removes the place through the
  repository's teardown, and keeps the branch, naming it.
- **S10.** A place's tidy finds a file neither committed nor ignored.
  The place is kept, and status names the file. Another place's teardown
  fails, and that place is kept, naming the step.
- **S11.** headwater's fix key and a millpond send launch the same
  repository, kind and name at once. One place is made, and the other
  launch is refused, naming the place.
- **S12.** The host restarts while a code stage works. flume's held
  state is whole, the agent did not survive, and the stage reads lost.
  flume starts no agent until a caller retries.
- **S13.** A repository declares its own kind at version 1. A place
  launched with it keeps that kind's stages after a later commit to the
  base changes the declaration to version 2, and a place launched after
  that commit runs the new one. Status names the first place's kind at
  version 1 and the second's at version 2.
- **S14.** The operator asks status from the command line, a session
  through its plugin, and herdr's sidebar on its own, about one place.
  All three get the same answer, and none starts or tells an agent.
- **S15.** A launch names a kind no declaration holds. It is refused,
  naming the kind, and no worktree, branch or record is made.
- **S16.** A repository's readiness fails at its toolchain. A change's
  place waits, and status names the step and its words. A fix's place
  starts its code stage, its prompt carrying the step and its words.
- **S17.** A code stage's agent is quiet past its limit with nothing
  delivered and nothing said, under an agent program that gives flume
  no way to send it back. Status reports the stage stuck, naming it and
  the agent, and flume does not end it. A tell wakes the agent, it
  ticks the last task, and the stage ends at its deliverable.
- **S18.** sounding opens an elaboration and launches its first round,
  handing its elaboration kind in the launch: one stage on a
  `sounding/<name>` branch that delivers a report beside the place's
  held state, in a kind that does not land. The agent writes its
  conclusion there, the stage ends, and sounding copies the conclusion
  into its record. sounding's go-on retries the stage with the
  operator's notes as its words, and a fresh agent writes a second
  conclusion, which counts by its write time. sounding's accept is a
  done: flume tidies the place, the report going with it, and keeps its
  branch, which holds the prototype commits the base lacks. No
  submission is ever made, and no conclusion is committed.
- **S19.** The merge queue fails a change's submission as the cause of
  a failure. flume sends the place back to code, whose fresh agent
  has the failing checks as its words, fixes them in its place and
  commits. flume submits again, the second submission lands, and the
  place's work is over.
- **S20.** A caller stops a working agent without forcing it, and the
  stop is refused. Forced, the stop ends the agent, and the stage waits,
  neither ended nor moved on, until a retry.
- **S21.** A retry names a stage of a place whose work landed. It is
  refused, naming the place.
- **S22.** A kind's second stage asks for the brief, and a launch of it
  gives none. The launch is refused, naming the stage and the brief, no
  worktree, branch or record is made, and no agent receives a prompt
  with a blank in it.
- **S23.** sounding launches a round as a conversation beside the
  operator's pane. The operator and the agent work for an hour, and the
  agent goes quiet many times between their turns. flume never sends it
  back and never reports it stuck. sounding's finish ends the quiet
  agent, and the conversation counts as delivered.
- **S24.** A code stage's agent tries to end its session with no commit
  made and nothing said. The stop check sends it back, naming commits
  as its deliverable and the way to stop short. The agent commits, and
  the stage ends at its deliverable.
- **S25.** A code stage's agent tries to submit its place's branch to
  the merge queue itself. flume refuses the act, status reports the
  refusal, nothing reaches the merge queue, and the stage goes on.
- **S26.** A caller declares a fix place done. It is refused, naming
  the place, and the caller drops it instead.
- **S27.** flume runs under the printed command, so nothing keeps
  watch. A code stage's agent is killed with nothing delivered. Nothing
  reads it until the operator next acts through flume, dropping another
  place: that command settles every place first, and status then
  reports the stage lost.
- **S28.** Under herdr with flume's plugin, a code stage's agent
  crashes with nothing delivered, and its stop hook never runs. Within
  the watch's bound, with no caller asking, flume reads the stage lost
  and starts no agent.
- **S29.** A code stage's agent commits and goes quiet. Its stop hook
  settles the place at once: flume ends the agent and starts the next
  stage before the watch next runs.
- **S30.** A fix's code stage delivers and its quiet agent ends while
  the launch holds the submission. The operator submits the place's
  branch to the merge queue by hand, and it lands. flume reads the
  place's work over, never makes the held submission, and tidies the
  place.
- **S31.** A repository's kind gives one stage two agents. A launch of
  it is refused, naming the kind, and makes nothing.
- **S32.** A review stage's prompt asks for a retry's words, and the
  stage is reached with none. It stands refused, naming the part, and
  starts no agent. A retry with words starts it.
- **S33.** A repository declares no binding. A launch of flume's fix
  kind in it is refused, naming the kind and the merge queue it needs. A
  launch of the repository's own kind that does not land makes its
  place with plain git worktrees.
- **S34.** flume's host restarts while a change's submission is under
  test. Nothing of flume's was waiting on it. The submission lands while
  the host is down, and its outcome stays pending in sluice's records.
  The first settle after the restart collects the place's pending
  outcomes, is delivered the landing, never submits anew, and tidies the
  place (124, 133).
- **S35.** crew launches a unit as a change place on its bolt's branch
  with nothing on hold. Construct, code and verify deliver in turn,
  flume submits, and the merge queue blames a test. flume sends the
  place back to code with the blame and the log, code and verify deliver
  again, flume submits again and the place lands; nobody spoke between
  the steps. A second place's verify agent finds the work short of its
  change and stops short having found work; flume sends that place back to code
  with the findings, and the going-back counts with the first toward
  the kind's three (131).
- **S36.** The user marks two notes of a review batch fix on its card.
  crew launches a fix place for each on the bolt's branch with the note
  as its brief; each code stage delivers, flume submits each, and each
  lands with no further word (131, C.2).
- **S37.** A host states a bound of four agents. crew launches a bolt's
  nine units at once as change places. Four construct agents start and
  five places wait for room, status naming each with its priority and
  its place in the queue. As each agent ends, the settle starts the next
  stage waiting, a waiting place's construct or a running place's code,
  by priority. The user raises one waiting unit's priority on the rail;
  crew passes it to flume, and that unit's construct starts at the next
  room (70, 130).
- **S38.** A unit's place names `madswan/planner` as its recipient. Its
  verify stage stops short needing an answer while no planner run is
  live. The settle that reads the stop-short finds the end pending for an address
  with no live run and launches the planner's kind as the host's
  configuration names it. Two more ends come before the run's agent
  starts; the run's start collects everything pending for the address
  and reads all three. A wake that crew's card carrier sends meanwhile does
  nothing, since the run is waiting for room (132).

- **S39.** Under herdr, a code stage's agent is started in a place
  the program does not yet trust, and herdr answers that the start is
  held at a question. The pane shows the folder-trust question; flume
  answers it and waits, within a bound, until herdr reads the agent
  idle. The agent says it started under its start's identity, waits,
  and only then is sent its prompt, which it says it received: the
  stage has begun (34, 35, 37, 38).
- **S40.** Under herdr, a code stage's agent stops at the warning about
  bypassing permissions, and herdr answers that the start is held at a
  question. flume answers nothing and sends no prompt: the start is
  reported never begun at once, delivered with the warning's lines from
  the pane (34, 35, 43).
- **S41.** herdr's server restarts while a code stage's agent works.
  herdr brings the session back bare, with flume's plugin, the start's
  identity and the pane's environment gone, so no word that it started
  comes. flume reads the stage lost, delivers it with the agent's last
  words and the commits since the start, and ends the resumed agent
  once it is quiet. A retry opens a fresh pane with the environment set
  on it again (31, 43, 45, 77).
- **S42.** Under herdr, a code stage's agent commits, ends its turn
  with nobody looking at the pane, and herdr reads it done. flume reads
  it waiting, not stopped: the stage delivered, the agent is ended and
  the next stage starts (40, 96).
- **S43.** A stage's prompt is typed into its agent's pane and never
  submitted. Within 60 seconds no word that it was received comes;
  flume clears the input and sends once more, and the second sending is
  received. Nothing is left typed (38, 95).
- **S44.** The one account of the host's pool gives an environment
  variable naming the host user's home, the repository's declaration
  gives change@2's code stage a model without declaring the kind, and a
  launch of a change gives its verify stage instructions. Construct's
  agent starts with the variable read against the host user's home,
  code's with the repository's model as well, and verify's with the
  launch's instructions; status gives each setting with where it came
  from, the variable from the account. The host's configuration
  changes the account's variable while code works: code's agent keeps
  the value it started with, and verify's starts with the new one (8,
  29, 32, 56, 144).
- **S45.** Under herdr, the program a code stage's agent names is not
  on the pane's `PATH`. herdr does not see it ready within its bound and
  says so; no word that it started has come, so the start is reported
  never begun, delivered with the pane's last lines, and no prompt is
  sent (35, 38, 43).
- **S46.** Under herdr, the operator moves a working code stage's pane
  into another workspace, and its pane id no longer answers. flume
  finds the pane again by the agent's herdr name, checks that herdr
  lists it under that name, records its new id, and the stage goes on:
  its state is read and its next prompt sent there, never into another
  pane (30, 95, 96).
- **S47.** Under herdr, the last place on a repository's base lands
  and is tidied. flume closes the place's tab with its panes, finds the
  base's workspace holding no tab of a live place and nothing it did not make,
  and closes the workspace (64, 137, 138).
- **S48.** Under herdr, a person opens a pane of their own in a
  base's workspace flume made, and the last place on that base is
  dropped. flume closes the place's tab and leaves the workspace open;
  status names the workspace and the person's pane that holds it, and
  flume closes nothing it did not make (137, 138).
- **S49.** Under herdr, a code stage's agent starts, waits, works and
  asks a question. At each settle that changes its state the pane's
  title follows it, starting, waiting, working, asking, and the
  base's workspace shows its count of places running, asking,
  waiting on their caller and stalled. One clue fails to show; the
  failure is logged and the settle goes on, and nothing flume decides
  reads a clue (139).
- **S50.** A change@2 place's change holds three task groups. Its code
  stage starts one agent, given group 1 and the notes' path, which
  ticks the group's tasks, commits and goes quiet. flume ends it and
  starts a fresh agent whose prompt differs only in its group, while
  status gives `code 2/3`. Once group 3's agent ticks the last task
  the stage delivers, and verify starts (40, 140 to 142).
- **S51.** A repetition's agent goes quiet with a task of its group 2
  unticked, and the stop check sends it back naming the group's tasks.
  It stops short needing an answer; status and the end delivered name
  group 2, and the caller's retry starts a fresh agent for group 2,
  never group 1 (41, 42, 49, 110, 142).
- **S52.** A failed submission sends a change@2 place back to code with
  every task ticked. One repetition with no group starts with the merge
  queue's words, records the fix as a task of the change, ticked, and
  the stage delivers (112, 140).
- **S53.** A host states a bound of six agents and two streams, `work`
  with a bound of four and priority 10, and `personal` with a bound of
  three. Five work places and three personal places are launched. Four
  work agents and two personal agents start; one work place waits for
  its stream's room and one personal place for the host's. A work agent
  ends, and the settle starts the waiting work place's stage, its
  stream ranking first (70, 143).
- **S54.** A stream's pool is fill-first over two accounts, the first
  bounded at two agents. Three stages start: two under the first account
  and one under the second. Under least-busy the same three alternate,
  first, second, first (144, 145).
- **S55.** An agent's turn fails with its account's usage limit, the
  record naming a reset at 15:00. flume records the account spent until
  then; another flume process's start in another place passes it over.
  Once the agent is quiet flume ends it and starts its stage afresh
  under the pool's other account, with words saying why; status says
  the stage moved, from which account to which, and that the fresh
  agent starts without the earlier account's prompt cache. No caller's
  word is asked, and the kind's bound is not counted (56, 145, 146).
- **S56.** crew launches three units of one intent under a least-busy
  pool. The first unit's agent starts under the account with the fewest
  agents running, and the other two start under it too while it has
  room, though another account then runs fewer. Once it is spent, the
  next start goes to another account and the affinity moves, status
  saying so (145, 147).
- **S57.** Two change places of one repository and intent start their
  code stages a minute apart under one account. Their agents' standing
  prompts are the same byte for byte, and status gives the second's
  first request as read mostly from the prompt cache. A third place's
  launch gives its own instructions: its agent's goals, intent's brief
  and standing instructions are still the same as theirs (56, 148).
- **S58.** A repository's kind gives a stage standing instructions
  that ask for `{{place}}`. Its launch is refused naming the stage, and
  makes nothing (4, 148).
- **S59.** A repository's lock records `flume/change@1`. A launch of
  `change` naming no version runs change@1, its code stage one agent for
  the whole change; a launch of `change@2` in the same repository runs
  change@2, repeating its code stage. Status names `flume/change@1` and
  `flume/change@2`, each with its hash (19, 22, 154, 155).
- **S60.** The host holds acme/review@1, and a repository declares no
  `review` and locks nothing. A launch of `review` is refused naming
  acme/review@1 as recorded in no lock, and makes nothing. Once
  `flume kinds lock acme/review@1` is run in the repository and its lock
  committed on the base, the same launch runs it, and status names
  `acme/review@1` with its hash (4, 155, 159).
- **S61.** A prompt of the host's acme/review@1 is edited after the
  repository locked it. The next launch of `review` is refused naming
  the kind and both hashes; a place of it launched before the edit runs
  on with the content it launched with (4, 21, 156).
- **S62.** The host holds acme/review@1 and beta/review@3, both locked.
  A launch of `review` is refused naming both; a launch of
  `beta/review` runs beta/review@3 (4, 154).
- **S63.** A package names its standing instructions at
  `../shared/standing.md`, and another gives its agents an `env`. Each
  launch is refused, the first naming the path outside its package, the
  second the field, and makes nothing (4, 157, 158).
- **S65.** A code stage starts under the account work-1, and its program
  comes up in a pane whose environment lacks work-1's
  `CLAUDE_CONFIG_DIR`, as a terminal that brought the pane back without
  its environment leaves it. The SessionStart hook acks nothing and says
  the start began without its settings; flume ends that agent once
  quiet and starts code afresh under work-1 with its environment,
  status naming `CLAUDE_CONFIG_DIR` as missing with no value, and the
  kind's bound is not counted (35, 112, 161).
- **S66.** The host's `[kinds.fix.agents]` gives `mode = "acceptEdits"`
  and the repository's gives `mode = "bypassPermissions"`. A fix@1
  agent starts in acceptEdits, status naming the host's table as where
  its mode came from. Another host gives no mode in any layer, and its
  agent starts with no mode passed, in whatever its account's own
  configuration sets; its start records no mode and compares none
  (32, 161, 162).
- **S67.** A stage's settings give `bypassPermissions`, and the
  account's configuration disables that mode, so the program begins in
  another. Its start's word shows the other mode: the agent is not the
  stage's, flume ends it once quiet and starts the stage afresh, and
  that start, beginning in the other mode again, is never begun, status
  naming the mode asked and the mode it began in (35, 161, 162).
- **S68.** A caller launches plan@1. The plan stage's agent starts in
  its program's planning mode, reads the place and puts a plan for
  review; flume declines its ask to leave planning, and once it is
  quiet the plan is delivered to the caller, the stage for review. The
  caller shows it to the operator and tells the agent their notes; the
  agent revises the plan in its own session and puts it again, which is
  delivered again. The caller finishes the stage: flume copies the plan
  into the place's folder, ends the agent, and starts code, whose
  prompt names the plan accepted. Had the caller retried the stage with
  the notes instead, a fresh agent would have planned again with the
  last plan and the notes in its prompt (49, 109, 163).
- **S69.** A stream states `points = 13`. Places of 8, 8 and 3 points
  are launched in that order at one priority. The first starts; the
  second waits, since 8 and 8 would pass 13, and the third waits behind
  it rather than passing it. The first's last stage delivers and its
  place is submitted, so its points leave flight, and the second and
  third start. The first's submission fails and its code stage starts
  again, its 8 points in flight once more though the stream then holds
  19 (165, 166).
- **S70.** A side project's stream states `pace = { points = 13, per =
  "day" }` and no bound beyond the host's. Places of 5, 5 and 5 points
  are launched at 09:00. Two start at once and the third waits, since
  15 would pass 13 in the day just past; status says the stream's pace
  frees at 09:00 the next day, when the first charge leaves the span,
  and the third starts then. A launch to the stream that gives no
  points is refused, naming the stream (4, 165, 167).

<!-- ANCHOR_END: scenarios -->
<!-- ANCHOR: deliver -->
## 12. What to deliver

A model of flume that satisfies Parts A and B: its components, a place's
record and its states, how a stage's end is read for each form of
deliverable and for a conversation, how a prompt and a tell are
delivered, how the stop check and the guard hold an agent, how a place
is submitted and sent back after a failed submission, how a place
settles under a terminal that keeps watch and under one that does not,
and how a place is tidied, with fixed examples, and how a kind, an agent
program and a terminal are added. A conformance suite whose scenarios
each cite the clauses they exercise, failing when a clause is cited by
nothing. The profiles of Part C, each passing the suite.

<!-- ANCHOR_END: deliver -->
