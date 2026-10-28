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
caller says so. Where the kind lands its work, flume submits the place's
branch to the repository's merge queue after the last stage. A
submission the merge queue fails sends the place back to a stage the
kind names. A place moves on when its agent goes quiet, when the merge
queue decides, and on the watch the host's terminal keeps, for flume
runs no process of its own. flume reports where every place stands. It
removes each place once its work has landed, been dropped, or, for a
kind that never lands, been declared done by its caller, and keeps any
branch that holds work its base lacks. It launches on the host it runs
on, and only when asked, and starts an agent only while the host has
room for one, by the priorities its callers give, so a host's launched
work is one queue flume keeps. What to launch, what matters most and
what comes next are its callers' to decide, how many agents run at once
is the host's fact, and whether submitted work lands is the merge
queue's.

<!-- ANCHOR_END: preamble -->
<!-- ANCHOR: actors -->
## 2. Actors

| actor | may decide | may not |
|---|---|---|
| **a caller** (the operator, millpond, headwater, sounding, crew) | what to launch and when: the repository, kind, brief, name and base, which stages wait on its word and whether the submission does, and its agents' settings, where in the terminal each runs among them; when to tell, stop, retry, finish, drop or declare done any place; each place's priority, at the launch and after it | it never changes a place's kind, brief or base after the launch, never ends an agent that is not quiet without forcing it, never opens, sends to or closes an agent's terminal itself, and never makes flume run anything in a place but its readiness, its teardown and its stages' agents |
| **the repository's authors** | the repository's kinds, with whether each lands and where a failed submission sends a place back; what a worktree needs to be ready, and what removing one must undo; each seam's profile (105) | they never decide who launches or when, and never make flume remove a commit a branch holds that its base lacks |
| **an agent** (a coding agent program working one stage) | how to do its stage, and what it commits in its place; whether to stop short, and what to say | it never ends, starts or moves a stage but by stopping its own short, never goes quiet with its deliverable missing and nothing said (110), never submits, merges or lands, and never acts in another place |
| **the merge queue** | whether and when a submitted branch lands on its base, and, where its profile does so, removing a landed place through its repository's teardown | it never receives a place's work from the place's agent (71), and removes a place only once its submission landed (113) |
| **flume** | when a stage has ended; starting each next stage that waits on no word, when the host has room for it and in its callers' priority order; submitting a landing kind's place after its last stage, and sending it back when the submission fails; sending prompts and tells; when a place whose work is over is removed | it never decides what to launch, sets no bound of its own on agents and holds no cap on places, orders places by nothing but the priorities its callers gave, never commits, merges or lands, never removes what it did not make or a commit its base lacks, never ends an agent that is not quiet unless forced, never answers an agent's question to a person, and runs no process of its own between its commands (120) |
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
  submission's hold and mark.
- **brief**: what the work is, as the caller wrote it.
- **mark**: words of a caller's own that a launch carries, by which
  callers find places.
- **kind**: a named list of stages in order, at a version. It also says
  how its places' branches are named, whether its first stage starts in
  a place that could not be made ready, and whether it lands.
- **version**: of a kind, the number its declaration gives it, with
  which the kind is named.
- **lands**: of a kind, that flume submits each of its places to the
  merge queue after the last stage, and sends a place back to a stage
  the kind names when its submission fails. A kind that does not land
  never reaches the merge queue.
- **declaration**: a written set of kinds, in the one form every tool
  of the family reads (section 9): flume's own, a repository's, or one a
  launch carries.
- **stage**: one step of a kind: its name, its prompt, its deliverable
  or that it is a conversation, and its agent's settings.
- **conversation**: a stage whose agent works with the operator, which
  has no deliverable and ends only on its caller's finish.
- **deliverable**: what must exist for a stage that is not a
  conversation to end, in one of the forms of 24.
- **prompt**: the text a stage's agent is sent to begin the stage,
  filled from the launch, the place and a retry's words.
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
  it changes and why, and its tasks, each ticked when done. Its
  **planning is complete** when every part the plan needs before its
  tasks start is written, and it is **archived** when it is filed as
  done.
- **agent**: one process of a coding agent program, started by flume to
  work one stage in one place.
- **settings**: what an agent starts with beyond its prompt: its
  program, its model, its instructions, its environment, and where in
  the terminal it runs, such as beside a pane its caller names.
- **identity**: the one name flume gives an agent, naming its
  repository, its place, its stage and which start of the stage it is.
- **agent state**: what an agent is doing: **working**; **waiting**,
  ready for input; **asking**, waiting on a question it put to a person;
  **stopped**; or **unknown**, when flume cannot read it.
- **own work**: work an agent started that runs on without it, such as
  a test run it waits on.
- **quiet**: of an agent, neither working, asking, nor waiting on own
  work.
- **start**: of a stage, the moment flume starts its agent. A stage has
  **begun** once its agent has received its prompt.
- **stop short**: an agent's word to flume that its stage cannot deliver
  without something, saying what in its own words.
- **stop check**: flume sending back an agent that would go quiet with
  its stage's deliverable missing and nothing said (110).
- **end**: of a stage, that it **delivered**, that it **ended short**,
  or, of a conversation, that it was **finished**.
- **on hold**: of a stage or a submission, that it waits on its
  caller's word before it starts.
- **room**: of a host, how many more agents of flume's places it may
  run at once: the bound its administrator states, less the agents
  running (70).
- **priority**: a place's rank among the places waiting for room on its
  host, given at the launch and changed by its caller after; higher
  starts first, equals in the order they came to wait (70).
- **waiting for room**: of a stage, that it may start and waits only
  for its host to have room (70).
- **stuck**: of a stage, that its agent has been quiet past the stage's
  limit with nothing delivered and nothing said.
- **left**: of a place, that its next move has been its caller's for
  five minutes, or the launch's bound, under no hold's words (130).
- **refused**: of a stage, that a part its prompt asks for had nothing
  to fill it (27).
- **lost**: of a stage, that its agent stopped with nothing delivered
  and nothing said.
- **stage state**: where a stage stands: not reached, on hold, waiting
  on its place's readiness, waiting for room, refused, started, begun, never begun, stuck,
  lost, stopped by its caller, delivered, ended short, or finished.
- **retry**: a caller's ask that a place start one stage of its kind
  afresh, the current stage unless the retry names another, with words
  of the caller's for its prompt; or, naming the submission, that flume
  submit the place again.
- **tell**: words a caller hands the agent of a place's current stage.
- **stop**: a caller's ask that a place's agent end.
- **finish**: a caller's word that a conversation is done.
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
5. Every stage whose prompt asks for the brief gets it whole and as the
   caller wrote it. flume never rewrites, shortens, summarises or
   judges a brief.
6. A launch answers once its place is made and its first stage is
   started, on hold or waiting. It never waits on an agent coming up,
   and whoever needs a stage's start or end learns it from status (43).
7. A launch may carry settings for any of its stages' agents, the
   stages it puts on hold, whether its submission waits on its word,
   the place's priority (70), and a mark. flume keeps the mark with the place and reports it, and
   decides nothing by it.
8. A place's kind, brief, base and settings are fixed by its launch,
   and nothing after the launch changes them. The launch names the
   stages and the submission on hold, and a caller adds to a place after
   it only the words of a retry (49) and a hold with its words (130).

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
19. flume itself, a repository or a launch declares a kind. For a
    launch, a kind's name resolves to exactly one declaration: the
    launch's over the repository's over flume's own. Status names the
    declaration each place runs and the version of its kind.
20. A repository's kinds and its readiness are read from its base's
    revision at the launch. Its binding (105) is read from its default
    branch's current revision: the remote's, after one fetch, where the
    repository has a remote, and its own otherwise. None is read from a
    place's tree or from a change not committed.
21. A place runs its kind, and keeps its repository's binding, as each
    resolved at its launch. A later change to any declaration never
    changes a place already launched.
22. flume's own declaration holds three kinds, and all three land.
    **fix** is a code stage, which delivers commits. Its first stage
    starts in a place that could not be made ready, and a failed
    submission sends it back to code. **chore** is fix's one code stage
    under a prefix of its own, so a branch's name says which it was
    (C.2). **change** is a construct stage,
    which delivers the place's change written; a code stage, which
    delivers its tasks ticked; and a verify stage, which checks the work
    against the change, commits its report in the change, and delivers
    the change archived. A failed submission, and a verify finding
    (131), send it back to code, which is the kind's fix round.
    Every other kind, each of sounding's among them, is a repository's
    or a launch's (19).
23. A kind's declaration holds its version, its stages in order, how its
    places' branches are named, whether its first stage starts in a
    place that could not be made ready, and whether it lands. A kind
    that lands names the stage a failed submission sends a place back
    to, and how many times a place may go back before it waits on its
    caller. A stage's declaration holds its name, its prompt, and its
    deliverable or that it is a conversation, and may hold its agent's
    settings, what it makes besides its deliverable (129), whether it
    waits on its caller's word, and how long its agent may be quiet
    before the stage is stuck. flume reads only a
    kind's places and stages, and runs that much of them: stages in
    order, one agent to each, and the place sent back when its
    submission fails. A kind whose places and stages ask for more, such
    as a stage worked by several agents, is refused (4). flume ignores a
    section of a kind it does not know, such as the elaboration section
    sounding reads, and nothing else a declaration holds changes what
    flume does.
24. Every deliverable is one of six forms, each read where it lives:
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
      (67).
25. A deliverable counts only when made since its stage started. A
    commit was made since then when the branch's head reaches it and the
    head the stage started at does not. A report was written since then
    when its write time, by the host's clock, is after the stage's
    start. flume reads every fact of one deliverable at one head of the
    place's branch, and never pairs a fact read at one head with a fact
    read at another.
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
29. A stage's agent is started with its prompt, its settings, its
    identity and its place, and nothing else of flume's. Its environment
    is the host user's own login environment with the settings' over it,
    and carries nothing of the caller's session. The exact prompt a
    stage would be sent can be rendered without starting an agent.

### A.4 Agents

30. Each stage starts exactly one fresh agent, working in the place. A
    place has at most one agent at any moment: flume never starts an
    agent while another of the place's is live, and never hands a stage
    an agent another stage or place started.
31. flume never ends an agent that is not quiet, unless a caller forced
    it. An agent whose state or own work flume cannot read is not quiet,
    and status names what flume cannot read. An end flume asked for that
    the agent did not take is reported as a failure, never as done.
32. An agent's program, model and instructions are resolved when it
    starts: from the launch's settings for its stage, else the stage's
    declaration, else flume's own default. Status reports them with the
    agent, and the host's own configuration of the agent program never
    chooses them.
33. Every agent carries an identity flume gives it, which names its
    repository, its place, its stage and which start of the stage it is,
    and which no other live agent on the host carries.
34. flume answers on an agent's behalf only the agent program's
    question whether it may work in the place, and only when the agent
    shows it. It never answers a question that widens what an agent may
    do.
35. flume judges an agent's start by evidence that the agent exists,
    never by the return of what started it. A start flume cannot read
    either way is reported unknown and watched, never reported as
    failed.
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

### A.5 Prompts

37. flume sends a stage's prompt only once its agent is waiting, and
    never into a question the agent has put to a person.
38. A prompt is received or sent again. flume reads, within 60 seconds
    of each sending, whether the agent received it. Where the terminal
    can send to a running agent, flume sends the prompt once more when
    it was not received, and reports the stage never begun when the
    second sending is not received either. Where it cannot, the start
    carries the one sending, and a prompt not received is reported never
    begun. flume never sends a prompt the agent already received, and
    text left typed for a hand to submit is never a stage's state.

### A.6 Stage ends

39. A stage that is not a conversation ends only when its deliverable
    exists or its agent stops short. Between its start and its end the
    agent may end turns, start own work and wait on it, be woken, ask
    and be answered any number of times, and no quiet terminal, ended
    turn or closed terminal ends the stage.
40. A stage that has delivered ends once its agent is quiet. flume then
    ends the agent and starts the next stage when the host has room for
    its agent (70), unless that stage waits on its caller's word (47). After the kind's last stage, flume submits a
    place whose kind lands (111), and any other place waits for its
    caller's done or drop (52, 114).
109. A conversation ends only on its caller's finish. Its agent works
     with the operator, and flume holds it to no quiet limit and no stop
     check, never reports it stuck, and never ends it on its own. A
     finish ends the agent once it is quiet, one that is not quiet only
     when forced (31), and the stage then counts as delivered (40).
41. An agent stops short by saying so to flume, with its words, and
    saying which it does: it asks, needing an answer before its stage
    can deliver, or it finds, naming work a stage before its own must
    do again (131). flume
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
42. A stage that ended short asking starts no next stage, whatever
    else exists. Its place waits for a retry or a drop, and the agent's
    words reach whoever waits on the stage, and status, whole and as the
    agent wrote them. The answer, whoever gives it and however it
    reached the caller, is a retry naming the stage with the answer as
    its words (49), and the fresh agent's prompt carries the question
    with the answer. A stage that ended short finding is sent back as
    131 says.
43. Whoever waits on a stage learns its end together with what was
    delivered, the head or the report, and the addresses of what it
    made (129), or with the agent's words.
    Whoever waits on a submission learns its outcome together with the
    commit it landed as, or with the merge queue's words. No caller
    needs to read a terminal to learn how a stage or a submission ended.
    It learns by being told: the settle that reads the end (46) tells
    each waiter on the place once, through the terminal into the
    waiter's own pane (95), and records on the place that it was told,
    to whom and when; a waiter named by a role's address is told in the
    pane of that role's live run, and where none is live the end stands
    untold and wakes the role (132); where the terminal has no pane to tell, the end
    is read from status (56). A wait is by place, naming its stage or
    its submission: it answers at once with an end that stands untold
    to this waiter, and otherwise follows the host's state under a
    timeout, exiting by the outcome or still waiting, driving no settle
    where the terminal keeps watch (119, 122); so a caller whose
    session restarted waits again and loses nothing; an end already
    told to this waiter it answers as a read, telling nobody again. A
    caller that starts may ask for every end untold to it, of the
    places it launched or waits on, which marks nothing told.
44. A stage whose agent has been quiet past the stage's limit, with
    nothing delivered and nothing said, is reported stuck, naming the
    stage and the agent. The limit is 30 minutes where the stage's
    declaration sets none. It runs from flume's first reading of the
    agent quiet with nothing delivered, and starts again whenever flume
    reads the agent not quiet or the place's head moves. An agent that
    is asking, and a conversation's agent, are never stuck. flume never
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

### A.7 Submissions

111. flume submits a place whose kind lands once its last stage has
     delivered and its agent has ended. It does not while the launch
     holds the submission (47), or once the place's work is over (63).
     It submits the place's own branch at its head, to its base and to
     no other branch (15), through the repository's merge queue, the
     place recorded as the submission's submitter. It holds no wait on
     the verdict: every settle that follows asks the merge queue for the
     outcomes of the place's submissions that stand untold to the place
     (133), and settles the place by the one it is told. A place whose kind does not land never reaches the merge
     queue.
112. A failed submission, one the merge queue blamed or found in
     conflict alike, sends the place back to the stage its kind
     names. flume starts that stage with a fresh agent and the merge
     queue's words as its words, the checks blamed and their logs or
     the files contested. The stages after it run again in order
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
     restarted loses nothing, since the outcome stands untold in the
     merge queue's records until a settle asks for it. flume never
     submits the place anew for it (111).
131. A kind runs through on its own. A stage's delivery starts the next
     stage as the host's room allows (70), and the last stage's delivery
     submits a place whose kind lands (40, 111), with no word from any caller, unless the launch
     or a hold put after it asks for one (47). The fix round is the
     stage the kind names for a failed submission (23): a failed or
     conflicting submission starts it with the merge queue's words
     (112), and a stop-short that finds, from the kind's last stage,
     starts it with the findings as its words, as a failed submission
     does; from any other stage a finding is taken as an ask (42). The
     stages after the fix round run again in order and the place is
     submitted again. A place's goings-back, by submission and by
     finding together, count toward the kind's bound (23), past which
     the place waits on its caller, said and told (130, 43). A stop-short
     that asks waits on its answer, which is a retry (42, 49). So a unit's
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
    stage's agent, with its identity, settings and agent state, and
    whether it works past its limit (118); whether the current stage's
    deliverable exists; the place's submission as the merge queue holds
    it, and how many times flume submitted the place; its change's
    tasks and which are ticked; each act of an agent's that flume
    refused (108); the part a refused stage could not fill (27); the
    words of a stop-short, and whether it asked or found, or of a failed
    submission; of a place
    waiting on its caller, the move it waits on, since when, a hold's
    words and whether it is left (130); and, for the host, its agents
    running, the bound it states, its room, and the places waiting for
    room in the order they would start, each with its priority and
    since when (70).
130. A place whose next move is its caller's, a stage or a submission on
     hold (47), a stage ended short asking (42), a readiness that failed (12),
     or a kind's last stage delivered where the kind does not land
     (114), waits on that move from the moment flume read it so, and
     status says which move and since when. A caller may put a place's
     next stage or its submission on hold after the launch, with its
     words saying what for, which status gives with the hold's since
     when; a retry naming the stage or the submission ends the hold (47,
     49). A place waiting on its caller under no hold's words for five
     minutes, or for the launch's bound where it sets one, is left:
     status says so, and whoever waits on the place is told once that
     it is left and which move is theirs (43). A hold's words are the
     caller's to make good: the event they wait for is the caller's to
     see, and flume watches none and ends no hold itself (70, 72). A
     stage waiting for room (70) waits on the host and not on its
     caller: status says so, with its priority and its place in the
     queue, and such a place is never left.
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
    place is tidied flume keeps nothing of it, and whatever outlives a
    place is its caller's to keep, from what flume reported.

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
70. How many agents run at once on a host is the host's fact, stated by
    whoever administers it in the host's own configuration (C.7), never
    counted by flume or a caller, and flume keeps to it. A stage that
    may start, a launch's first or a place's next, starts only while
    the host's agents running, every caller's counted together, are
    under the bound; otherwise it waits for room, a wait that is the
    host's and never its caller's (130). When a settle finds room it
    starts the stages waiting for it in priority order, the highest
    first and equals in the order they came to wait, as many as there
    is room for (46), and an agent running is never ended for a place
    of higher priority (31). A place's priority is given at its launch,
    equal for all where none is given, and its caller may change it
    after, which reorders only what has not started. flume refuses no
    launch for want of room: every launch is taken and waits its turn,
    so a host's launched work is one queue flume keeps, across every
    caller. Status says, for the host, the agents running, the bound,
    the room and the queue (56). Beyond that flume holds no count or
    cap of its own on places, plans nothing across places and orders
    them by nothing but the priorities its callers gave: what to
    launch, what each place holds, what matters most and when a stage
    or a submission on hold starts are the caller's. A host whose
    configuration states no bound has no queue: every stage that may
    start starts, and status gives the agents running and judges no
    room.
71. flume submits a place's work, and an agent never does. flume submits
    only places whose kind lands (111), and reads each outcome from the
    merge queue, never from an agent's words or its terminal.
72. flume tells no person anything by itself. A surface shows what
    flume reports when it is asked.
132. A waiter may be named by a role's address, `<partition>/<role>`,
     rather than by a session. A run of the role is a place of the kind
     the host's configuration names for the address (C.7), named by the
     role, so at most one run of an address is live at once (3), and its
     agent takes the address as its session's name. Where a settle finds
     an end standing untold to an address with no run live or waiting
     for room, or a caller or another tool's carrier asks flume to wake
     the address, flume launches the address's kind at the priority the
     configuration gives it; a wake of an address whose run is live or
     waiting does nothing. The run's start asks for every end untold to
     the address (43), so whatever came while no run was live is one
     run's. flume decides nothing in this: which address waits on a
     place, what the role's kind does and what its run decides are the
     caller's (69, 70, 72). An address the configuration names no kind
     for is woken by nothing, and status says the ends that stand untold
     to it.

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

### B.3 The change

86. **read-change**: given a revision and a name, whether the change
    exists there, whether its planning is complete, its tasks each with
    whether it is ticked, and whether it is archived (3, 24, 26).
87. The same revision always gives the same answer, and reading writes
    nothing (59).
127. **locate**: given a place and a change's name, where the change
    lies in the place, for a prompt's change part (27, C.3); or that the
    profile keeps no change there.

### B.4 The agent

88. **command**: given resolved settings, a place, an identity and a
    prompt, how to start that agent so it works in the place under that
    identity (29, 32, 33).
89. **received**: given an agent and a text, whether the agent received
    the text as a prompt, or unknown (38).
90. **asking**: given an agent, whether it waits on a question it put to
    a person (37, 53).
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
93. The guarantee: each answer is what the agent's own record shows,
    and an answer the record does not give is unknown, never guessed
    from the terminal.

### B.5 The terminal

94. **open**: given a place, a command, an identity and where the
    settings put the agent, an agent running the command in the place
    under that identity, there; or a refusal (30, 107).
95. **send**: given an agent and a text, the text delivered as input
    the agent receives, or a refusal; never text typed and left for a
    hand (38, 53).
96. **state**: given an agent, its agent state (56).
97. **close**: given an agent, its end, or a refusal because it did
    not end (31).
122. **watch**: the terminal settling each place with an agent in it, on
     a bound it states and when an agent's state changes, while flume
     runs nothing; or no watch (46, 119).
98. The guarantee: open never runs a second agent under an identity
    already live, and close never reports an end that did not happen.

### B.6 The merge queue

117. **submit**: given a place, its branch at its head submitted to its
     base with the place as its submitter, answered once the merge queue
     holds it and before it decides, with the submission it made; or
     refused, naming why (111). Submit holds no wait and removes nothing
     (113).
133. **untold**: given a place, every decided outcome of the place's
     submissions that stands untold to it: landed, with the commit it
     landed as; failed, with the merge queue's words; or withdrawn; each
     then recorded by the merge queue as told to the place; or that the
     merge queue could not be read (43, 111, 112).
99. **read-submission**: given a repository and a branch, the newest
    submission of that branch, whoever made it, with its target and its
    state: waiting, under test, landed with the commit it landed as,
    failed with what it named, or withdrawn; or none; or that the merge
    queue could not be read (63, 68, 71).
101. The guarantee: landed is said only of a submission of that branch
     that the merge queue itself landed, never inferred from what the
     base holds (63). Submit removes no place (66, 113), and an outcome
     untold answers once to the place and never again.
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
| **worktrunk**: a repository that binds `worktrunk` | `wt switch --create <branch> --base <revision> --no-cd`, its worktree path `<repository>/places/<kind>--<name>`, the repository's create hooks run | the toolchain, then the runner's setup, that the repository declares in `.config/sluice.toml`, run in the place in sluice's cleaned environment, as sluice readies its own places | `git status --porcelain=v2`; `git worktree list --porcelain` for a lock | `wt remove --no-delete-branch`, so the repository's pre-remove and post-remove hooks run; the branch by `git cherry <base> <branch>`, deleted with `git branch -D` when no line starts with `+` |
| **git worktree**: a repository that binds `git-worktree`, or names no place profile | `git worktree add -b <branch> <location> <revision>`, at the same path `<repository>/places/<kind>--<name>` | as above | as above | `git worktree remove`, with no teardown but sluice's release where sluice is the merge queue (C.6); the branch as above |

Under either, what the toolchain step makes is kept in the place's own
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
<file>` names; flume's own is built in. Prompt paths are relative to the
declaration's file. A repository's binding (105) is the `[profiles]`
table of the same file, read at its default branch (20). That is
`origin/HEAD`'s revision after one fetch when the repository has a
remote, and the local default branch's otherwise. The place is then cut
from the base where the merge-queue profile says it lives (C.1). With no
table, or a seam left out of it, flume uses the profiles that need no
tool: plain `git worktree`, no change profile and no merge-queue
profile. flume reads no other tool's files to choose one.

```toml
[profiles]
place = "worktrunk"       # or "git-worktree" (C.1); git-worktree when omitted
merge_queue = "sluice"    # reads .config/sluice.toml for where the base lives (C.1); none when omitted, and a kind that lands is refused (4)
change = "openspec"       # (C.3); none when omitted, and a kind that reads a change is refused (4)

[kinds.bump]
version = 2               # status names the kind bump@2 (19); 1 when omitted
branch = "bump"           # the prefix of its places' branches; the kind's name when omitted
starts_unready = false    # whether its first stage starts in a place that could not be made ready (12)
lands = true              # flume submits each place after its last stage (111); false when omitted

[[kinds.bump.stages]]
name = "code"
prompt = "prompts/bump-code.md"
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
the kind format's own names. flume reads `on_fail` and `max_send_backs` on a
kind's last stage only, since under flume a stage fails only by its
place's failed submission. A kind whose stage names more than one agent
or more than one deliverable is refused (4, 23). flume ignores a
section of a kind it does not know, such as an elaboration kind's
elaboration section (23).

| deliverable (24) | spelled in `deliverables` |
|---|---|
| commits | `commits` |
| change written | `change` |
| tasks ticked | `tasks` |
| change archived | `archived` |
| report | `report:<path>`, the path relative to the place, or under `{{state}}`, the place's own folder beside the held state, which goes with the place (C.7). A report under `{{state}}` only where the caller keeps it lasting (123) |
| committed report | `committed:<path>`, the path relative to the place; the form for every other report a reader needs after the place is gone (123) |

A prompt's parts are `{{brief}}`, `{{name}}`, `{{kind}}`, `{{stage}}`,
`{{branch}}`, `{{base}}`, `{{place}}`, `{{change}}`, `{{report}}`,
`{{made}}`, `{{words}}`, `{{unready}}` and `{{needs}}` (the way to stop short,
C.4). `{{#words}}…{{/words}}` renders its body only when there are
words: a retry's, with the question of the stop-short it answers before
them (49), a failed submission's, the checks blamed and their logs or
the files contested (112), or a finding's (131). A launch is refused when
a stage asks for `{{brief}}` and it gives none (4). Any other bare part
with nothing to fill it leaves the stage refused (27), and
`{{report}}` fills only for a stage whose deliverable is a report or a
committed report, and `{{made}}` only for a stage that declares what it
makes, with the path it records the addresses at (129). `flume prompt <place> <stage>` renders a stage's
prompt and starts nothing (29).

flume's own kinds, their prompts shipped with flume:

| kind | branch | first stage starts unready | lands; its last stage's `on_fail` | stages, each with its deliverable |
|---|---|---|---|---|
| **fix@1** | `fix/<name>` | yes | yes; `code` | `code`: `commits` |
| **chore@1** | `chore/<name>` | yes | yes; `code` | `code`: `commits`; fix@1's stage under a prefix of its own, so a branch's name says which it was |
| **change@1** | `change/<name>` | no | yes; `code` | `construct`: `change`; `code`: `tasks`; `verify`: `archived`. The verify prompt checks the work against the change and commits its report as `verify.md` in the change's directory. It then archives the change on the place's branch, the report with it, or stops short finding, with what fails, which sends the place back to code (131). The code prompt, sent again with a failed submission's or a finding's words, fixes what they name and records the fix as a task of the change, ticked |

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
| read-change | `openspec/changes/<name>/` at the revision: present when the folder exists; planning complete as `openspec status --change <name> --json` gives `isPlanningComplete`; its tasks the `- [ ]` and `- [x]` lines of `tasks.md`; archived when `openspec/changes/archive/<date>-<name>/` exists. A change of OpenSpec's spec-driven schema is read from its files with no `openspec` process, and a change of any other schema through `openspec` (59). |

### C.4 The agent: Claude Code

| operation | how Claude Code satisfies it |
|---|---|
| command | `claude` in the place, with flume's own Claude Code plugin loaded by `--plugin-dir`, which holds every hook below, and `--model` and `--append-system-prompt` from the settings. Its environment is the host user's login environment with the settings' own over it, and `FLUME_AGENT`, `FLUME_SECRET`, `FLUME_PLACE` and `FLUME_STAGE`. `FLUME_AGENT` is the identity, `flume:<repository>:<kind>--<name>:<stage>:<n>`, the repository named by an id taken from its common git directory and `<n>` the stage's start. `FLUME_SECRET` is that start's secret. The prompt is sent once the agent waits, or carried as the command's argument under the printed command (C.5) |
| received | the session's transcript holds the prompt as a user turn |
| asking | a mark the plugin's hook leaves when the agent opens a question or a plan for a person, open until the transcript holds the answer; the terminal's reading alone never decides it |
| own-work | background tasks the transcript shows started and not finished |
| stop-short | `flume needs "<words>"` asks, and `flume needs --found "<words>"` finds (41, 131); run by the agent or a process it started, refused unless `FLUME_AGENT` names the agent of the place's current stage and `FLUME_SECRET` is that start's, while the agent is live |
| send-back | the plugin's Stop hook blocks the stop, its reason naming the deliverable and `flume needs`, while the stage's deliverable does not exist, the agent has not stopped short, and no background task runs and no question is open; it never blocks a conversation's agent |
| guard | the plugin's PreToolUse hook refuses a command that runs `sluice submit`, `wt submit`, `wt merge` or `git push`, its reason saying that flume submits the place, and leaves the mark status reads (56) |
| on-quiet | the plugin's Stop hook, each time it lets the agent stop, starts `flume settle <place>` in the background, so the place settles the moment its agent goes quiet (46) |

flume answers the folder-trust question when the terminal shows it, and
never the warning about bypassing permissions (34).

### C.5 The terminal

| profile | open | send | state | close | watch |
|---|---|---|---|---|---|
| **herdr** | a pane in the herdr session the launch's settings name, flume's own otherwise, one tab per place named `<kind>--<name>`; where the settings name a pane, a split beside that pane instead, as for a conversation; the pane and its agent named by the identity | herdr's prompt to the pane, then received read through the agent (89) | herdr's reading of the agent: working as working, idle as waiting, done as stopped, blocked as asking only with the agent profile's mark (90) | herdr ends the pane and its process group, then reads that it is gone | kept by flume's herdr plugin on herdr's server, which runs between flume's commands. It runs `flume settle` for the session's places on a bound it states and at each change of an agent's state |
| **printed command** | the command printed, the prompt carried in it, for a person to run in the place | refused, so every tell is refused and a prompt not received is reported never begun (38) | from the agent profile alone; stopped when its record says the session ended | refused unless the agent's record says the session ended | none, so flume runs attended (119) |

### C.6 The merge queue: sluice

| operation | how sluice satisfies it |
|---|---|
| submit | flume runs `sluice submit <base> --no-wait --json` in the place under every place profile, with no multiplexer's session in its environment, so sluice records the place's worktree as the entry's submitter and no session, pushes nothing into any pane, and answers with the entry at once; a refusal is its exit and words. flume never passes `--check`, and never runs `wt submit`, whose waiting half removes the place (111, 113). |
| untold | sluice's one command for a submitter's untold outcomes (sluice clause 51), run in the place, which tells the place's decided entries once and marks each told to it; sluice answers nothing again for an outcome already told (133) |
| read-submission | `sluice status <base> --json`, read once for each repository at each ask; the newest entry submitted from the place's branch, whoever submitted it; landed is that entry landed, its landing commit's `Sluice-*` trailers naming it |
| step | `sluice step <base>`, one round of the base's queue, run by a settle only where no `sluice run` is live on the host (sluice clause 135), so the queue moves with nothing standing (124) |

On landing sluice removes nothing, and flume tidies every landed place
itself, through the place profile's teardown (C.1), so under worktrunk
the repository's pre-remove and post-remove hooks run as they would for
`wt merge` (66), and its branch as 67 says. Whenever
flume removes a place itself, landed, dropped or done, it first runs
`sluice release` in it as part of the place's teardown (66). sluice runs
the repository's `[tests] release`, which ends what the place's runs
left up, and frees the ports it holds for the place; it says `nothing to
release` when it holds none. A release that fails keeps the place, named
with that step (66). Readiness and where the base lives
(C.1) are read from the same `.config/sluice.toml`.

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
- The roles a host wakes are a table of the same configuration:
  `[roles."<partition>/<role>"]` with `repository`, `kind` and
  `priority`, the place a woken run is launched as (132), stated by
  whoever administers the host. An address the table names nothing for
  is woken by nothing.
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
as a report a stage's declaration puts under `{{state}}`, and goes when
the place is tidied (62).

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
  many agents run at once is the host's fact, which flume keeps to (1,
  70).
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
    `finish`, `drop`, `done`, `tidy` and `prompt`; `needs` for an
    agent; and `settle`, which the two plugins run;
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
- The profiles of Part C: worktrunk, the kind format in
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
  | crew | each unit, chore or fix of a bolt, as a place of flume's own kinds, change, chore or fix, with no stage and no submission on hold, so the kind runs through and its fix round runs on its own (131); each agent's settings from crew's roles, marked with the bolt; a review note the user marked fix as a fix launched on the bolt's branch with the note as its brief | plans, bolts, proposals, review batches, the rail and its cards; it launches a bolt's work whole, each unit as the work it follows allows, and keeps no slots: the host's room and the queue are flume's, and the user's priorities, set on the rail, reach flume as each place's priority (70); its word to a place is a retry answering a stop-short that asked, or a retry or drop of a place past its kind's bound; it names each place's waiter by a role's address, so a role with no live run is woken to hear an end (132), and it is told each end (43) and reads the rest from status; a role's own work that lands is a place of its own, so no session of crew's submits; it decides no step between a unit's stages, and runs no agent of its own in the place (records 0010 and 0011) |

<!-- ANCHOR_END: givens -->
<!-- ANCHOR: questions -->
## 10. Questions the model must answer

These are not requirements.

- When a verify stage finds work to fix, does its agent stop short with
  the findings for a caller's retry, or does its finding send the place
  back to code by itself, as a failed submission does (42, 112)? Ruled
  2026-10-28: by itself. A stop-short that finds, from the kind's last
  stage, sends the place back to the kind's fix round with the findings
  as its words, counting toward the kind's bound; one that asks waits on
  its answer (131; record 0011, accepted 2026-10-28).
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

<!-- ANCHOR_END: questions -->
<!-- ANCHOR: scenarios -->
## 11. Scenarios the model must satisfy

- **S1.** The operator presses headwater's fix key on a release. flume
  makes a fix place on a new branch from the base's current revision,
  readies it, and starts the code stage's agent with the release's
  brief. The agent commits the bump, waits on a test run it started, and
  goes quiet once the run passes. flume ends it and submits the place.
  The merge queue lands the branch and removes the place through the
  repository's teardown, and flume records the place gone. Its branch,
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
  means, and stops short asking, saying so. The stage ends short, no
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
  a failure. flume sends the place back to verify, whose fresh agent
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
  the host is down, and its outcome stands untold in sluice's records.
  The first settle after the restart asks for the place's untold
  outcomes, is told the landing, never submits anew, and tidies the
  place (124, 133).
- **S35.** crew launches a unit as a change place on its bolt's branch
  with nothing on hold. Construct, code and verify deliver in turn,
  flume submits, and the merge queue blames a test. flume sends the
  place back to code with the blame and the log, code and verify deliver
  again, flume submits again and the place lands; nobody spoke between
  the steps. A second place's verify agent finds the work short of its
  change and stops short finding; flume sends that place back to code
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
- **S38.** A unit's place names `madswan/planner` as its waiter. Its
  verify stage stops short asking while no planner run is live. The
  settle that reads the stop-short finds the end untold to an address
  with no live run and launches the planner's kind as the host's
  configuration names it. Two more ends come before the run's agent
  starts; the run's start asks for everything untold to the address and
  reads all three. A wake that crew's card carrier sends meanwhile does
  nothing, since the run is waiting for room (132).

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
