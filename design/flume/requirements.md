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
ways each contract is satisfied. An analysis of storage may replace the
store's profile in Part C, and nothing above it changes.

Parts A and B name no mechanism: no command, file, format, field,
program, service or tool. One thing of the world they name freely,
because section 9 fixes it: git, with its branches, commits and
worktrees. Every other real tool is named only in section 9 and in
Part C. A reader who has never seen an agent launcher should be able to
design from Parts A and B and git alone.

A number prefixed `Flywheel` cites Flywheel's statement, the standard
flume's agents meet as sessions. Each clause that cites it stands
without it.

## 1. Purpose

flume launches one piece of work in one place and follows it through
its whole life. A caller names a repository, a kind, a brief and a
name. flume makes a worktree of the repository on a branch of its own,
makes it ready as the repository declares, and takes it through the
kind's stages, starting a fresh agent for each and handing it the
stage's prompt. Each agent commits its work in the place. A stage ends
when what it was to deliver exists, or when its agent says what it
needs to go on, and never because the agent went quiet. A stage that is
a conversation with the operator ends when its caller says so. Where
the kind lands its work, flume submits the place's branch to the
repository's merge queue after the last stage. A submission the merge
queue fails sends the place back to a stage the kind names. flume
reports where every place stands. It removes each place once its work
has landed, been dropped, or, for a kind that never lands, been
declared done by its caller, and keeps any branch that holds work its
base lacks. It launches on the host it runs on, and only when asked.
What to launch, how much at once and what comes next are its callers'
to decide, and whether submitted work lands is the merge queue's.

<!-- ANCHOR_END: preamble -->
<!-- ANCHOR: actors -->
## 2. Actors

| actor | may decide | may not |
|---|---|---|
| **a caller** (the operator, millpond, headwater, sounding, crew) | what to launch and when: the repository, kind, brief, name and base, which stages wait on its word and whether the submission does, and its agents' settings, where in the terminal each runs among them; when to tell, stop, retry, finish, drop or declare done each of its places; how many places it runs at once | it never changes a place's kind, brief or base after the launch, never ends an agent that is not quiet without forcing it, never opens, sends to or closes an agent's terminal itself, and never makes flume run anything in a place but its readiness, its teardown and its stages' agents |
| **the repository's authors** | the kinds the repository declares, with whether each lands and where a failed submission sends a place back; what a worktree needs to be ready; and what removing one must undo | they never decide who launches or when, and never make flume remove a commit a branch holds that its base lacks |
| **an agent** (a coding agent program working one stage) | how to do its stage, and what it commits in its place; whether to stop short, and what to say | it never ends, starts or moves a stage but by stopping its own short, never goes quiet with its deliverable missing and nothing said (45), never submits, merges or lands, and never acts in another place |
| **the merge queue** | whether and when a submitted branch lands on its base, and, where its profile does so, removing a landed place through its repository's teardown | it receives a place's work only from flume (79), and removes a place only once its submission landed (54) |
| **flume** | when a stage has ended; starting each next stage that waits on no word; submitting a landing kind's place after its last stage, and sending it back when the submission fails; sending prompts and tells; when a place whose work is over is removed | it never decides what to launch, holds no cap on places, never commits, merges or lands, never removes what it did not make or a commit its base lacks, never ends an agent that is not quiet unless forced, and never answers an agent's question to a person |
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
  brief, a name, a base, and the caller's settings, stages on hold,
  submission's hold and mark.
- **brief**: what the work is, as the caller wrote it.
- **mark**: words of a caller's own that a launch carries, by which the
  caller finds its places.
- **kind**: a named, ordered list of stages, with how its places'
  branches are named, whether its first stage starts in a place that
  could not be made ready, and whether it lands.
- **lands**: of a kind, that flume submits each of its places to the
  merge queue after the last stage, and sends a place back to a stage
  the kind names when its submission fails. A kind that does not land
  never reaches the merge queue.
- **declaration**: a written set of kinds: flume's own, a repository's,
  or one a launch carries.
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
- **identity**: the one name flume gives an agent, naming its place and
  its stage.
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
  its stage's deliverable missing and nothing said (45).
- **end**: of a stage, that it **delivered**, that it **ended short**,
  or, of a conversation, that it was **finished**.
- **on hold**: of a stage or a submission, that it waits on its
  caller's word before it starts.
- **stuck**: of a stage, that its agent has been quiet past the stage's
  limit with nothing delivered and nothing said.
- **lost**: of a stage, that its agent stopped with nothing delivered
  and nothing said.
- **stage state**: where a stage stands: not reached, on hold, waiting
  on its place's readiness, started, begun, never begun, stuck, lost,
  stopped by its caller, delivered, ended short, or finished.
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
- **submission**: a place's branch that flume offered to the merge
  queue for its base, and what the merge queue records of it.
- **failed**: of a submission, that the merge queue removed it as the
  cause of a failure or for a conflict.
- **landed**: of a place's work, that the merge queue records a
  submission flume made of the place's own branch landed on its base.
- **over**: of a place's work, that it landed, was dropped, or was
  declared done.
- **tidy**: removing a place whose work is over, and its branch where 75
  allows.
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
2. A launch names a repository on the host, a kind, a brief, a name and
   a base. Either it makes one place, records it, and starts its first
   stage, puts it on hold, or leaves it waiting on the place's
   readiness (12); or it is refused, naming why, and leaves nothing it
   made behind.
3. At most one live place has a given repository, kind and name. A
   launch is refused, naming what stands, when that place, its branch,
   or anything at its place's location already exists, or when its kind
   reads a change and its base already holds a change by its name, open
   or archived. flume never adopts a worktree, a branch or a change it
   did not make for the launch.
4. A launch whose kind resolves to no declaration (19), or whose kind
   names a deliverable flume cannot read (24), is refused naming the
   kind, and makes nothing.
5. Every stage whose prompt asks for the brief gets it whole and as the
   caller wrote it. flume never rewrites, shortens, summarises or
   judges a brief.
6. A launch answers once its place is made and its first stage is
   started, on hold or waiting. It never waits on an agent coming up,
   and whoever needs a stage's start or end learns it from status (47).
7. A launch may carry settings for any of its stages' agents, the
   stages it puts on hold, whether its submission waits on its word,
   and a mark. flume keeps the mark with the place and reports it, and
   decides nothing by it.
8. A place's kind, brief, base, settings, stages on hold and
   submission's hold are fixed by its launch. Nothing after the launch
   changes them, and the words of a retry are the only thing a caller
   adds to a place (56).

### A.2 Places

9. A place is one worktree of its repository, on a branch of its own
   named from its kind and its name the same way for every place of
   that kind. It is cut from its base's current revision where work
   lands on the base, never from a copy of the base that may lag it.
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
    starts, and its prompt carries the step and its words.
13. flume runs nothing in a place but its readiness, its teardown and
    its stages' agents. It runs no check of a place's work.
14. flume never commits, merges, rebases or lands: a stage's agent
    commits its work in its place, and the merge queue lands what flume
    submits. flume moves no branch, except to make a place's branch at
    its launch and to remove it at its tidy (75).
15. A place's work lands only on its base, and its base is the only
    branch flume submits it to or reads its landing against (71).
16. Removing a place ends every agent flume started in it.
17. Places are independent: what one place's agent does, and how its
    stages end, never starts, ends, holds or moves another place.

### A.3 Kinds and stages

18. A kind is an ordered list of one or more stages. Every stage but a
    conversation has exactly one deliverable, and a conversation has
    none (43).
19. flume itself, a repository or a launch declares a kind. For a
    launch, a kind's name resolves to exactly one declaration: the
    launch's over the repository's over flume's own. Status names the
    declaration each place runs.
20. A repository's kinds and its readiness are read from its base's
    revision at the launch, never from a place's tree or from a change
    not committed.
21. A place runs its kind as it resolved at its launch. A later change
    to any declaration never changes a place already launched
    (Flywheel 57).
22. flume's own declaration holds exactly two kinds, and both land.
    **fix** is a code stage, which delivers commits. Its first stage
    starts in a place that could not be made ready, and a failed
    submission sends it back to code. **change** is a construct stage,
    which delivers the place's change written; a code stage, which
    delivers its tasks ticked; and a verify stage, which checks the work
    against the change and delivers the change archived. A failed
    submission sends it back to verify. Every other kind, each of
    sounding's among them, is a repository's or a launch's (19).
23. A kind's declaration holds its stages in order, how its places'
    branches are named, whether its first stage starts in a place that
    could not be made ready, and whether it lands. A kind that lands
    names the stage a failed submission sends a place back to, and how
    many times a place may go back before it waits on its caller
    (Flywheel 41). A stage's declaration holds its name, its prompt, and
    its deliverable or that it is a conversation, and may hold its
    agent's settings, whether it waits on its caller's word, and how
    long its agent may be quiet before the stage is stuck. Nothing else
    a declaration holds changes what flume does.
24. Every deliverable is one of six forms, each read where it lives:
    - **commits**: the place's branch holds a commit made since the
      stage started;
    - **change written**: the place's branch holds the place's change
      with its planning complete, in a commit made since the stage
      started;
    - **tasks ticked**: every task of the place's change is ticked at
      the branch's head, in a commit made since the stage started;
    - **change archived**: the branch's head holds the place's change
      archived, and the branch holds a commit made since the stage
      started;
    - **report**: a file at the path the stage's declaration names,
      written since the stage started;
    - **committed report**: a file inside the place, at the path the
      stage's declaration names, in a commit made since the stage
      started. It stays on the place's branch after the place is tidied
      (75).
25. A deliverable counts only when made since its stage started. flume
    reads every fact of one deliverable at one head of the place's
    branch, and never pairs a fact read at one head with a fact read at
    another.
26. A place has at most one change, named by the place's name, and a
    stage that reads a change reads only that one.
27. A stage's prompt is filled before it is sent. Every part it asks
    for from the launch, the place or a retry is filled, and a part
    asked for with nothing to fill it refuses the stage, naming the
    part. flume never sends a blank where a part was asked for.
28. Every stage's prompt gives its agent the one way to stop short,
    filled in for the place and the stage. No prompt asks an agent to
    submit, merge or push its work (79).
29. A stage's agent is started with its prompt, its settings, its
    identity and its place, and nothing else of flume's. The exact
    prompt a stage would be sent can be rendered without starting an
    agent (Flywheel 89, 90).

### A.4 Agents

30. Each stage starts exactly one fresh agent, working in the place. A
    place has at most one agent at any moment: flume never starts an
    agent while another of the place's is live, and never hands a stage
    an agent another stage or place started.
31. flume never ends an agent that is not quiet, unless a caller forced
    it. An end flume asked for that the agent did not take is reported
    as a failure, never as done.
32. An agent's program, model and instructions are resolved when it
    starts: from the launch's settings for its stage, else the stage's
    declaration, else flume's own default. Status reports them with the
    agent, and the host's own configuration of the agent program never
    chooses them (Flywheel 173).
33. Every agent carries an identity flume gives it, which names its
    place and its stage and which no other live agent on the host
    carries.
34. flume answers on an agent's behalf only the agent program's
    question whether it may work in the place, and only when the agent
    shows it. It never answers a question that widens what an agent may
    do.
35. flume judges an agent's start by evidence that the agent exists,
    never by the return of what started it. A start flume cannot read
    either way is reported unknown and watched, never reported as
    failed (Flywheel 72).
36. An agent changes what flume holds in one way only, by stopping its
    own stage short. Everything else flume learns of a stage it reads
    from the deliverable and from the agent's state (Flywheel 66).
37. Where in the terminal a stage's agent runs is one of its settings
    (32). A caller may put it beside a pane the caller names, as a
    conversation with the operator wants. flume opens, sends to and
    closes every agent's terminal, and no caller does any of them
    itself.
38. An agent never submits, merges or pushes its place's branch. flume
    refuses each such act wherever the agent program lets it, status
    reports the refusal, and flume reads a landing only from a
    submission it made itself (79; Flywheel 43).

### A.5 Prompts

39. flume sends a stage's prompt only once its agent is waiting, and
    never into a question the agent has put to a person.
40. A prompt is received or sent again. flume reads, within a bound,
    whether the agent received it, sends it once more when it did not,
    and reports the stage never begun when the second sending is not
    received either. flume never sends a prompt the agent already
    received, and text left typed for a hand to submit is never a
    stage's state.

### A.6 Stage ends

41. A stage that is not a conversation ends only when its deliverable
    exists or its agent stops short. Between its start and its end the
    agent may end turns, start own work and wait on it, be woken, ask
    and be answered any number of times, and no quiet terminal, ended
    turn or closed terminal ends the stage.
42. A stage that has delivered ends once its agent is quiet. flume then
    ends the agent and starts the next stage, unless that stage waits on
    its caller's word (51). After the kind's last stage, flume submits a
    place whose kind lands (52), and any other place waits for its
    caller's done or drop (59, 60).
43. A conversation ends only on its caller's finish. Its agent works
    with the operator, and flume holds it to no quiet limit and no stop
    check, never reports it stuck, and never ends it on its own. A
    finish ends the agent once it is quiet, one that is not quiet only
    when forced (31), and the stage then counts as delivered (42).
44. An agent stops short by saying so to flume, with its words. flume
    takes a stop-short only from the agent of the place's current
    stage, and never infers one from anything else.
45. No agent of a stage but a conversation goes quiet with its
    deliverable missing and nothing said. When one would, flume sends it
    back with words naming the deliverable and the way to stop short
    (28). Waiting on own work or on a person's answer is not going
    quiet. Where the agent program gives flume no way to send an agent
    back, the stage is left to 48.
46. A stage that ended short starts no next stage, whatever else
    exists. Its place waits for a retry or a drop, and the agent's words
    reach whoever waits on the stage, and status, whole and as the agent
    wrote them.
47. Whoever waits on a stage learns its end together with what was
    delivered, the head or the report, or with the agent's words.
    Whoever waits on a submission learns its outcome together with the
    commit it landed as, or with the merge queue's words. No caller
    needs to read a terminal to learn how a stage or a submission ended.
48. A stage whose agent has been quiet past the stage's limit, with
    nothing delivered and nothing said, is reported stuck, naming the
    stage and the agent. An agent that is asking, and a conversation's
    agent, are never stuck. flume never ends a stuck stage, and a
    deliverable that appears afterward ends it as any other.
49. A stage whose agent stopped with nothing delivered and nothing said
    is reported lost. flume starts no agent for a lost stage on its own
    (55).
50. A place moves on without anyone asking. Within a bound it states,
    flume reads each stage's end, starts the next stage, submits a place
    whose last stage delivered, reads each submission's outcome, and
    tidies a place whose work is over (71). Asking only shortens the
    wait.
51. A stage or a submission that waits on its caller's word starts only
    on a retry that names it (56).

### A.7 Submissions

52. flume submits a place whose kind lands once its last stage has
    delivered and its agent has ended, unless the launch put the
    submission on hold (51). It submits the place's own branch at its
    head, to its base and to no other branch (15), through the
    repository's merge queue. A place whose kind does not land never
    reaches the merge queue.
53. A failed submission sends the place back to the stage its kind
    names. flume starts that stage with a fresh agent and the merge
    queue's words as its words. The stages after it run again in order
    as 42 and 51 allow, and flume submits again once the last delivers.
    A place that has gone back as many times as its kind allows (23)
    waits for its caller's retry or drop instead. A submission the merge
    queue refuses or withdraws leaves the place waiting for a retry or a
    drop, and status names why.
54. A submission that lands makes the place's work over (71). Where the
    merge queue removes the landed place, it does so only after the
    landing and only through the repository's teardown, and flume
    records the place gone (74).

### A.8 Retries, stops, drops and dones

55. flume starts a stage again on its own only when a failed submission
    sends the place back (53), and never bounds how often a caller
    retries. Status gives how many times each stage has started and how
    many times flume submitted the place.
56. A retry starts the stage it names with a fresh agent and the
    retry's words in its prompt, and the stages after it then run again
    in order, as 42 and 51 allow. A retry that names the submission
    submits the place's head again and starts no agent. A retry names a
    stage of the place's kind, or the submission of a kind that lands,
    and never changes the place's kind, brief or base (8).
57. A retry ends the place's agent first, one that is not quiet only
    when forced (31), and is refused, naming the place, when the
    place's work is over.
58. A stop ends the place's agent and nothing else: the stage neither
    ends nor moves on, and waits for a retry or a drop. An agent that is
    not quiet is stopped only when forced (31).
59. A drop makes a place's work over (71). flume ends the place's
    agent, one that is not quiet only when forced, and starts nothing
    more in the place.
60. A done makes the work of a place whose kind does not land over
    (71). flume ends the place's agent, one that is not quiet only when
    forced (31), and starts nothing more in the place. A done on a place
    whose kind lands is refused, naming the place, and its caller drops
    it instead.

### A.9 Tells

61. A tell hands the agent of a place's current stage its words as a
    prompt, or nothing at all. A tell to a place with no live agent, or
    whose agent is asking, is refused with nothing typed.
62. A tell never interrupts a working agent: its words reach the agent
    only once it is waiting (Flywheel 71). A tell not delivered within
    the bound its caller gives, or flume's own, is refused with nothing
    typed, and a tell delivered is received or sent again as a prompt
    is (40).
63. A tell never starts, ends, holds or moves a stage, never counts as a
    retry or a finish, and never stands for a deliverable.

### A.10 Status

64. For every place on its host, status gives the place's repository,
    kind and the declaration it came from, its name, branch, base and
    mark, and whether its kind lands; each stage's state, how it ended,
    and how many times it started; the current stage's agent, with its
    identity, settings and agent state; whether the current stage's
    deliverable exists; the place's submission as the merge queue holds
    it, and how many times flume submitted the place; its change's
    tasks and which are ticked; each act of an agent's that flume
    refused (38); and the words of a stop-short or of a failed
    submission.
65. Asking status starts no agent, sends nothing to one, and writes
    nothing.
66. Every fact status gives of a place's deliverable, change or
    submission is read where it lives when status is asked, at one head
    (25). flume never answers one of them from a record of its own.
67. A fact of a change that flume reads without the change's own reader
    agrees with what that reader gives at the same revision.
68. The same question about the same places gets the same answer,
    whoever asks and through whichever surface. Every surface answers
    from one core, and no surface computes a stage's end, a status, a
    submission or a tidy of its own.
69. Every answer has one form a program reads, the same through every
    surface, and that form only ever gains fields.
70. flume keeps only the live state of the places on its host. Once a
    place is tidied flume keeps nothing of it, and whatever outlives a
    place is its caller's to keep, from what flume reported.

### A.11 Tidying

71. A place's work is over when it landed, its caller dropped it, or
    its caller declared done a place whose kind does not land. Work of
    the place's that reached its base any other way is not its landing,
    and the place stays: inside another place's landing, by a hand, or
    through a submission flume did not make.
72. flume removes only places it made, and only once their work is over
    and their agent has stopped. It never removes a worktree it did not
    make, the repository's main worktree, or a worktree whose agent is
    live.
73. flume never removes a place that holds a change not committed, a
    file neither committed nor ignored, or a lock. It keeps it and names
    what it holds.
74. flume removes a place through its repository's teardown, so what
    the repository stood up for the place goes with it. A teardown that
    fails keeps the place, named with the step that failed. A merge
    queue that removes a landed place does so through the same teardown
    (54). flume then records the place gone and removes only what the
    merge queue left: the place itself when it was kept, and its branch
    as 75 says.
75. When a place goes, its branch goes only if it holds no commit whose
    change its base lacks, judged by the change each commit makes and
    never by ancestry alone. A branch holding such a commit is kept and
    named.
76. flume removes nothing while it cannot read whether a place's work
    is over.

### A.12 Callers

77. flume does the same for every caller and needs none of them. What
    it does for a launch depends on the launch, the repository and the
    host, never on which caller asked or through which surface.
78. flume holds no count or cap of its own on places or agents, plans
    nothing across places, and orders none. How many places a caller
    runs at once, which work each holds, and when each stage or
    submission on hold starts are the caller's.
79. flume submits a place's work, and an agent never does. flume submits
    only places whose kind lands (52), and reads each outcome from the
    merge queue, never from an agent's words or its terminal.
80. flume tells no person anything by itself. A surface shows what
    flume reports when it is asked.

### A.13 Held state and hosts

81. flume keeps its held state on its host, outside every repository's
    content.
82. Every act flume performs is safe to repeat: a repeat of an act
    already done changes nothing (Flywheel 73).
83. Two acts on one place at once leave it as one or the other would
    have. Neither leaves the held state half written, and no two acts
    give a place two agents (30).
84. Every place flume made is in its held state until it is removed. No
    act leaves a worktree or a branch of flume's that its held state
    does not name.
85. flume stopping, or its host stopping, loses nothing flume held. On
    its return flume reads every place again from its held state, its
    repository, its terminal and the merge queue, and reports each agent
    that did not survive as lost (49).

<!-- ANCHOR_END: part-a -->
<!-- ANCHOR: part-b -->
## Part B. Contracts across the seams

### B.1 The place

86. **make**: given a repository, a revision, a branch name and a
    location, a worktree there on a new branch at that revision; or a
    refusal because the branch or the location already exists (3, 9).
87. **ready**: given a place, each step its repository's readiness
    declares, run in the place in order with an environment that carries
    nothing of the caller's, each with its outcome and its words,
    stopping at the first that fails (11, 12).
88. **read**: given a place, its branch, its head, and whether it holds
    a change not committed, a file neither committed nor ignored, or a
    lock (73).
89. **remove**: given a place, its removal with its repository's
    teardown run, or a refusal naming the step that failed (74).
90. **remove-branch**: given a branch and its base, the branch removed
    when it holds no commit whose change the base lacks, or a refusal
    naming the commits it holds (75).
91. The guarantee: make never touches a branch or a location that
    already exists, and each operation is all or nothing.

### B.2 The kinds

92. **read-kinds**: given a repository and a revision, every kind the
    repository declares there, each with its stages; or that its
    declaration could not be read, with the reason (19, 20).
93. The same revision always gives the same kinds, reading changes
    nothing, and a declaration a launch carries is read the same way
    (19).

### B.3 The change

94. **read-change**: given a revision and a name, whether the change
    exists there, whether its planning is complete, its tasks each with
    whether it is ticked, and whether it is archived (3, 24, 26).
95. The same revision always gives the same answer, and reading writes
    nothing (67).

### B.4 The agent

96. **command**: given resolved settings, a place, an identity and a
    prompt, how to start that agent so it works in the place under that
    identity (29, 32, 33).
97. **received**: given an agent and a text, whether the agent received
    the text as a prompt, or unknown (40).
98. **asking**: given an agent, whether it waits on a question it put to
    a person (39, 61).
99. **own-work**: given an agent, whether own work it started still
    runs, or unknown (31, 48).
100. **stop-short**: the one way an agent tells flume it stops short,
     carrying its identity and its words (44).
101. **send-back**: given an agent about to go quiet and words naming
     its stage's deliverable, the agent kept at work with those words,
     or that the program gives no way to (45).
102. **guard**: given an agent, each act it would take that submits,
     merges or pushes its place's branch refused and reported, or that
     the program gives no way to (38).
103. The guarantee: each answer is what the agent's own record shows,
     and an answer the record does not give is unknown, never guessed
     from the terminal.

### B.5 The terminal

104. **open**: given a place, a command, an identity and where the
     settings put the agent, an agent running the command in the place
     under that identity, there; or a refusal (30, 37).
105. **send**: given an agent and a text, the text delivered as input
     the agent receives, or a refusal; never text typed and left for a
     hand (40, 61).
106. **state**: given an agent, its agent state (64).
107. **close**: given an agent, its end, or a refusal because it did
     not end (31).
108. The guarantee: open never runs a second agent under an identity
     already live, and close never reports an end that did not happen.

### B.6 The merge queue

109. **submit**: given a place, its branch at its head submitted to its
     base. Once the merge queue decides, the outcome: landed, with the
     commit it landed as and whether the place and its branch were
     removed; failed, with the merge queue's words; withdrawn; or
     refused, naming why (52, 53, 54).
110. **read-submission**: given a repository and a branch, the newest
     submission flume made of that branch, with its target and its
     state: waiting, under test, landed with the commit it landed as,
     failed with what it named, or withdrawn; or none; or that the merge
     queue could not be read (71, 76, 79).
111. The guarantee: landed is said only of a submission of that branch
     that the merge queue itself landed, never inferred from what the
     base holds (71). Submit removes a place only after its landing and
     only through its repository's teardown (54, 74).

### B.7 The store

112. **read**: the held state and the version it was read at.
113. **write**: given the version read and the next held state, the
     write, all or nothing, which succeeds only if the held state is
     still at the version read (83).
114. The guarantee: the store holds nothing in a repository's content
     (81), and every flume process on the host reaches the same store.

### B.8 Binding the contracts

115. Each seam is bound by naming one profile of Part C: the terminal
     and the store once for the host; the place, the kinds, the change
     and the merge queue once for each repository, the merge queue
     reached only by a kind that lands (52); the agent for each stage,
     by its settings (32). Parts A and B do not change to admit a
     profile.
116. One conformance suite holds every profile to Parts A and B; a
     profile that fails it is not one.

<!-- ANCHOR_END: part-b -->
<!-- ANCHOR: part-c -->
## Part C. Profiles

Parts A and B do not change to admit a profile.

### C.1 The place

| profile | make | ready | read | remove / remove-branch |
|---|---|---|---|---|
| **worktrunk**: a repository with worktrunk set up | `wt switch --create <branch> --base <revision> --no-cd`, its worktree path `<repository>/places/<kind>--<name>`, the repository's create hooks run | the toolchain, then the runner's setup, that the repository declares in `.config/sluice.toml`, run in the place in sluice's cleaned environment, as sluice readies its own places | `git status --porcelain=v2`; `git worktree list --porcelain` for a lock | `wt remove --no-delete-branch`, so the repository's pre-remove and post-remove hooks run; the branch by `git cherry <base> <branch>`, deleted with `git branch -D` when no line starts with `+` |
| **git worktree**: a repository with no worktree tool | `git worktree add -b <branch> <location> <revision>` | as above | as above | `git worktree remove`, with no teardown; the branch as above |

A place's branch is `<prefix>/<name>`, the prefix its kind's. The
base's current revision (9) is `origin/<base>` after one fetch when the
repository's merge queue lands on a remote, and the local `<base>`
otherwise. A name is refused when `git check-ref-format` refuses the
branch it gives.

### C.2 The kinds

A declaration is TOML. A repository's is `.config/flume.toml` at the
base's revision (20); a launch's is the file `flume launch --kinds
<file>` names; flume's own is built in. Prompt paths are relative to
the declaration's file.

```toml
[kinds.bump]
branch = "bump"          # the prefix of its places' branches; the kind's name when omitted
starts_unready = false   # whether its first stage starts in a place that could not be made ready (12)
lands = true             # flume submits each place after its last stage (52); false when omitted
returns = "code"         # the stage a failed submission sends a place back to (53); the last stage when omitted
returns_max = 3          # how many times a place may go back before it waits on its caller (53); flume's default when omitted

[[kinds.bump.stages]]
name = "code"
prompt = "prompts/bump-code.md"
deliverable = "commits"
quiet = "45m"            # the stuck limit (48); flume's default when omitted
agent = { program = "claude", model = "opus" }

[[kinds.bump.stages]]
name = "review"
prompt = "prompts/bump-review.md"
conversation = true      # works with the operator and ends on its caller's finish (43); no deliverable
wait = true              # waits on its caller's word (51)
agent = { beside = "operator" }   # opened beside the pane the launch's settings name as `operator` (37)
```

| deliverable (24) | spelled |
|---|---|
| commits | `commits` |
| change written | `change` |
| tasks ticked | `tasks` |
| change archived | `archived` |
| report | `report:<path>`, the path relative to the place, or under `{{state}}`, the place's own folder beside the held state (C.7) |
| committed report | `committed:<path>`, the path relative to the place |

A prompt's parts are `{{brief}}`, `{{name}}`, `{{kind}}`, `{{stage}}`,
`{{branch}}`, `{{base}}`, `{{place}}`, `{{change}}`, `{{report}}`,
`{{words}}`, `{{unready}}` and `{{needs}}` (the way to stop short,
C.4). `{{#words}}…{{/words}}` renders its body only when there are
words, as a retry's or a failed submission's; a bare part with nothing
to fill it refuses the stage (27). `flume prompt <place> <stage>`
renders a stage's prompt and starts nothing (29).

flume's own kinds, their prompts shipped with flume:

| kind | branch | first stage starts unready | lands, and returns to | stages, each with its deliverable |
|---|---|---|---|---|
| **fix** | `fix/<name>` | yes | yes, `code` | `code`: `commits` |
| **change** | `change/<name>` | no | yes, `verify` | `construct`: `change`; `code`: `tasks`; `verify`: `archived`, its prompt checking the work against the change, then archiving the change on the place's branch, or stopping short with what fails |

sounding carries the place-and-stage half of each of its elaboration
kinds in the launch, as `flume launch --kinds <file>`: a kind on the
branch prefix `sounding`, its rounds' stages each delivering a
`committed:` report or each a conversation, and whether it lands.

### C.3 The change: OpenSpec

| operation | how OpenSpec satisfies it |
|---|---|
| read-change | `openspec/changes/<name>/` at the revision: present when the folder exists; planning complete as `openspec status --change <name> --json` gives `isPlanningComplete`; its tasks the `- [ ]` and `- [x]` lines of `tasks.md`; archived when `openspec/changes/archive/<date>-<name>/` exists. A change of OpenSpec's spec-driven schema is read from its files with no `openspec` process, and a change of any other schema through `openspec` (67). |

### C.4 The agent: Claude Code

| operation | how Claude Code satisfies it |
|---|---|
| command | `claude` in the place, with `--model` and `--append-system-prompt` from the settings, and `FLUME_AGENT` (the identity), `FLUME_PLACE` and `FLUME_STAGE` in its environment beside the settings' own; the prompt sent once it waits, or carried as the command's argument under the printed command (C.5) |
| received | the session's transcript holds the prompt as a user turn |
| asking | a mark flume's own hook leaves when the agent opens a question or a plan for a person, open until the transcript holds the answer; the terminal's reading alone never decides it |
| own-work | background tasks the transcript shows started and not finished |
| stop-short | `flume needs "<words>"`, run by the agent, refused unless `FLUME_AGENT` names the agent of the place's current stage |
| send-back | flume's own Stop hook blocks the stop, its reason naming the deliverable and `flume needs`, while the stage's deliverable does not exist, the agent has not stopped short, and no background task runs and no question is open; it never blocks a conversation's agent |
| guard | flume's own PreToolUse hook refuses a command that runs `sluice submit`, `wt submit`, `wt merge` or `git push`, its reason saying that flume submits the place, and leaves the mark status reads (64) |

flume answers the folder-trust question when the terminal shows it, and
never the warning about bypassing permissions (34).

### C.5 The terminal

| profile | open | send | state | close |
|---|---|---|---|---|
| **herdr** | a pane in the herdr session the launch's settings name, flume's own otherwise, one tab per place named `<kind>--<name>`; where the settings name a pane, a split beside that pane instead, as for a conversation; the pane and its agent named by the identity | herdr's prompt to the pane, then received read through the agent (97) | herdr's reading of the agent: working as working, idle as waiting, done as stopped, blocked as asking only with the agent profile's mark (98) | herdr ends the pane and its process group, then reads that it is gone |
| **printed command** | the command printed, the prompt carried in it, for a person to run in the place | refused, so every tell is refused and a prompt not received is reported never begun (40) | from the agent profile alone; stopped when its record says the session ended | refused unless the agent's record says the session ended |

### C.6 The merge queue: sluice

| operation | how sluice satisfies it |
|---|---|
| submit | flume runs `wt submit <base>` in the place under the worktrunk place profile, and `sluice submit <base>` under the git worktree profile, and waits on it: exit 0 is landed, 1 failed or withdrawn, 2 a conflict or a refusal, told apart by read-submission. flume never passes `--no-wait`, `--check` or `--no-remove`. |
| read-submission | `sluice status <base> --json`, the newest entry submitted from the place's branch; landed is that entry landed, its landing commit's `Sluice-*` trailers naming it |

On landing, `wt submit` releases the place with `sluice release`, then
removes it with `wt -C <place> remove --foreground`, so the
repository's pre-remove and post-remove hooks run as the teardown (74),
and deletes the branch once it is merged into the default branch. It
does so as worktrunk's `[merge] remove` sets, true when unset, and
reports a removal that fails while still exiting as landed. flume then
reads the place: one the driver removed it records gone, one the driver
kept it tidies itself, and a branch the driver left, as on a base other
than the default branch, it removes as 75 says. `sluice submit` removes
nothing, and under it flume tidies every landed place itself. A
waiting submit also runs sluice's rounds, so it moves the queue on a
host with no `sluice run` going. Readiness (C.1) reads the same
`.config/sluice.toml`.

### C.7 The store: the host's state directory

An analysis of storage may replace this profile, and nothing above it
changes.

| operation | how the state directory satisfies it |
|---|---|
| read | the documents under `$XDG_STATE_HOME/flume/` (`~/.local/state/flume/`), one per place, with a version beside them |
| write | a new document written beside the old and renamed over it, under a lock held for the write (83, 113) |

A place's own folder there holds what its stages write for flume, such
as a report a stage's declaration puts under `{{state}}`, and goes when
the place is tidied (70).

<!-- ANCHOR_END: part-c -->
<!-- ANCHOR: invariants -->
## 7. Global invariants

- **I1.** A stage ends only at its deliverable, its agent's stop-short,
  or, for a conversation, its caller's finish; never at a quiet terminal
  (41, 43, 44).
- **I2.** A place has at most one agent, and no agent that is not quiet
  is ended unless a caller forced it (30, 31).
- **I3.** flume submits the places of a kind that lands, and an agent
  never submits. flume never commits, merges or lands, and moves no
  branch but its places' own (14, 38, 79).
- **I4.** flume removes only what it made, and never a commit its base
  lacks (72, 75).
- **I5.** A prompt or a tell is received or reported, never left typed
  (40, 61).
- **I6.** flume decides nothing its callers decide: what to launch, how
  much at once, or when a stage or a submission on hold starts (1, 78).
- **I7.** A place whose kind does not land never reaches the merge
  queue, and a failed submission sends a place back only to the stage
  its kind names (52, 53).

<!-- ANCHOR_END: invariants -->
<!-- ANCHOR: non-goals -->
## 8. Non-goals

- Coordinating many hosts: launching on another host, moving a place
  between hosts, or one status across hosts. A caller that spans hosts
  calls each host's flume.
- Deciding what to launch, ordering work, planning across places, or
  bounding how many run. A team's slots, its cap, its bolts, its
  conductors, its approvals and the conflicts between its units are
  crew's.
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
  back to does (53).

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

The rest of the stack, which a model builds on unless it says why not:

- One static binary, written in Rust, as sluice is.
- Every answer as JSON on request, the form of (69).
- Three surfaces answering from one core, each a plugin kept outside the
  core as sluice keeps its plugins: a command line (`flume launch`,
  `status`, `tell`, `stop`, `retry`, `finish`, `drop`, `done`, `tidy`,
  `prompt`, and `needs` for an agent); a Claude Code plugin that gives
  every session `/launch`, serves `status` over MCP, and holds the hooks
  every agent of flume's runs under, the asking mark, the stop check
  and the guard; and a herdr plugin whose sidebar shows every place in
  flight with its kind, its stage, its agent's state, a change's tasks
  ticked and its submission, and whose keys open a place's pane, tell
  its agent, stop it and retry its stage.
- The profiles of Part C: worktrunk, flume's TOML declarations,
  OpenSpec, Claude Code, herdr, sluice and the host's state directory.
- How each caller uses flume:

  | caller | launches | keeps |
  |---|---|---|
  | the operator | `/launch <brief>` in any session, or the herdr plugin's key | nothing; the sidebar shows each place |
  | millpond | an item's send, as a fix or a change, the item's brief as the launch's | the item's record and its sends, and the landing, written from the merge queue's record of the place's branch |
  | headwater | its fix key, as a fix with the release's brief | nothing |
  | sounding | each round of an elaboration, as a place of the kind the elaboration kind carries in the launch, a conversation's agent beside the operator's pane | the inputs, the soundings each was based on, the rounds, the operator's notes and decisions, and the record; its go-on is a retry with the operator's notes as words, its accept a done or a retry that releases a held submission, and its drop a drop |
  | crew | each unit, chore or fix of a team, as a place of a kind crew carries in the launch, every stage after the first and the submission on hold, each agent's settings from crew's roles, marked with the team and the slot | plans, bolts, slots and the cap on them, the dispatcher, conductors, approvals and conflicts between units; it starts each stage and each submission on hold with a retry and reads each end from status |

<!-- ANCHOR_END: givens -->
<!-- ANCHOR: questions -->
## 10. Questions the model must answer

These are not requirements.

- How does flume read that an agent waits on own work, and what does a
  stage do when that cannot be read (31, 42, 48)?
- When a verify stage finds work to fix, does its agent stop short with
  the findings for a caller's retry, or does its finding send the place
  back to code by itself, as a failed submission does (46, 53)?
- Does a caller learn a stage's or a submission's end by asking, or
  does flume tell it, and through what (47, 50)?
- What is a stage's quiet limit when its declaration sets none, and
  does it run from the agent's last act or from the last change in the
  place (48)?
- Does a retry run the repository's readiness again (11, 56)?
- When the terminal resumes an agent after the host restarts, is that
  agent the stage's agent, and does the stage go on (35, 85)?
- How does flume know a stop-short comes from the current stage's agent
  and from no other process (33, 44)?
- Is a launch whose branch a dropped place left behind refused until
  that branch goes, or does it take another branch (3, 75)?
- Under a terminal that cannot send text after the start, how is a
  prompt received or sent again (40)?
- May a repository declare deliverable forms of its own, such as a
  command that must pass (24)?
- Is a stage ever worked by several agents at once (Flywheel 56), and
  if so in one place or in several (18, 30)?
- How long may a stage or a submission wait on its caller's word before
  flume reports it, if ever (51)?
- Who owns a place whose caller is gone, and may another caller drop it
  or declare it done (70, 78)?
- Does status read every live place's deliverable at each ask, and how
  does it stay quick across many repositories (66)?
- Where is a repository's binding read from: the host's own settings,
  or the repository's declaration beside its kinds (20, 115)?
- How does a kind that lands only some of its place's work, an
  elaboration's writebacks and never its prototype, have only that work
  reach its base without the rest of its branch (52, 75)? sounding's
  statement asks the same.
- How many times does the stop check send an agent back before its
  stage is left to the stuck limit (45, 48)?
- The merge queue moves only while something waits on it or runs it.
  Does flume wait on each submission itself, and what keeps that wait
  going across flume stopping (50, 85)?
- When the operator ends a conversation's agent in its terminal, is the
  conversation finished or lost (43, 49)?
- When the stage a failed submission sends a place back to waits on its
  caller's word, does the return wait on that word too (51, 53)?
- What is a kind's limit on going back when its declaration sets none
  (23, 53)?

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
  Verify checks the work against the change, archives the change and
  commits, and flume submits the place, which lands with the change
  archived. No caller read a terminal at any point.
- **S3.** A code stage's agent ends its turn to wait on a suite it
  started. Its terminal shows nothing for twelve minutes. The stage does
  not end, the stop check does not send the agent back, and the stage is
  not reported stuck while the suite runs. It ends when the last task is
  ticked and the agent is quiet.
- **S4.** A construct agent cannot tell which of two designs the brief
  means, and stops short, saying so. The stage ends short, no code stage
  starts, and crew's conductor reads the words whole from status. The
  conductor retries construct with the design agent's answer as its
  words, and a fresh agent starts with the words in its prompt.
- **S5.** On a loaded host a code stage's agent takes four minutes to
  come up. flume reports the start unknown, not failed, and sends the
  prompt once the agent waits for input. It finds the prompt not
  received, sends it once more, and the agent receives it. Nothing is
  left typed in its terminal.
- **S6.** The operator tells a place's agent while it asks a person a
  question, and the tell is refused with nothing typed. They tell it
  again while it works. The words reach it once it waits for input, and
  its stage is unchanged.
- **S7.** crew launches two places for one team, every stage after
  construct and each submission on hold. Each construct delivers, and
  flume starts nothing more. crew's word starts one place's code stage,
  and later its submission. flume launches no third place of its own,
  and the team's slots, its cap and the work each slot holds stay
  crew's.
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
- **S13.** A repository declares its own kind. A place launched with
  it keeps that kind's stages after a later commit to the base
  changes the declaration, and a place launched after that commit runs
  the new one.
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
  carrying its kind in the launch: one stage on a `sounding/<name>`
  branch that delivers a committed report, in a kind that does not land.
  The agent commits its conclusion, and the stage ends. sounding's go-on
  retries the stage with the operator's notes as its words, and a fresh
  agent commits a second conclusion. sounding's accept is a done: flume
  tidies the place and keeps its branch, which holds the conclusions
  and prototype commits the base lacks. No submission is ever made.
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
- **S22.** A stage's prompt asks for the brief, and the launch gave
  none. The stage is refused, naming the brief, and no agent receives a
  prompt with a blank in it.
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

<!-- ANCHOR_END: scenarios -->
<!-- ANCHOR: deliver -->
## 12. What to deliver

A model of flume that satisfies Parts A and B: its components, a
place's record and its states, how a stage's end is read for each form
of deliverable and for a conversation, how a prompt and a tell are
delivered, how the stop check and the guard hold an agent, how a place
is submitted and sent back after a failed submission, and how a place
is tidied, with fixed examples, and how a kind, an agent program and a
terminal are added. A conformance suite whose scenarios each cite the
clauses they exercise, failing when a clause is cited by nothing. The
profiles of Part C, each passing the suite.

<!-- ANCHOR_END: deliver -->
