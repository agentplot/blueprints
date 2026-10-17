# flume — requirements
<!-- ANCHOR: preamble -->

A statement of what flume must always do and never do, written to
admit any model that satisfies it.

The statement is in three parts. Part A is what must hold of flume on
its own: how one piece of work is launched in a place of its own, taken
through its kind's stages one fresh agent at a time, followed to its
end, and tidied away. Part B is its contracts: the operations it needs
across its seven seams, the place, the kinds, the change, the agent,
the terminal, the merge queue and the store, and the guarantee each
must give. Part C is the profiles: the ways each contract is satisfied.
An analysis of storage may replace the store's profile in Part C, and
nothing above it changes.

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

flume launches one piece of work in one place and follows it to its
end. A caller names a repository, a kind, a brief and a name. flume
makes a worktree of the repository on a branch of its own, makes it
ready as the repository declares, and takes it through the kind's
stages, starting a fresh agent for each and handing it the stage's
prompt. A stage ends when what it was to deliver exists, or when its
agent says what it needs to go on, and never because the agent went
quiet. flume reports where every place stands, and removes each place
once its work has landed or been dropped, keeping any branch that holds
work its base lacks. It launches on the host it runs on, and only when
asked. What to launch, how much at once and what comes next are its
callers' to decide, and the work lands through the repository's merge
queue, never through flume.

<!-- ANCHOR_END: preamble -->
<!-- ANCHOR: actors -->
## 2. Actors

| actor | may decide | may not |
|---|---|---|
| **a caller** (the operator, millpond, headwater, sounding, crew) | what to launch and when: the repository, kind, brief, name and base, which stages wait on its word, and its agents' settings; when to tell, stop, retry or drop each of its places; how many places it runs at once | it never changes a place's kind, brief or base after the launch, never ends an agent that is not quiet without forcing it, and never makes flume run anything in a place but its readiness, its teardown and its stages' agents |
| **the repository's authors** | the kinds the repository declares, what a worktree needs to be ready, and what removing one must undo | they never decide who launches or when, and never make flume remove a commit a branch holds that its base lacks |
| **an agent** (a coding agent program working one stage) | how to do its stage; whether to stop short, and what to say | it never ends, starts or moves a stage but by stopping its own short, never lands, and never acts in another place |
| **the merge queue** | whether and when a submitted branch lands on its base | it never receives work from flume itself, since a stage's agent submits (71) |
| **flume** | when a stage has ended; starting each next stage that waits on no word; sending prompts and tells; when a place whose work is over is removed | it never decides what to launch, holds no cap on places, never commits, merges, submits or lands, never removes what it did not make or a commit its base lacks, never ends an agent that is not quiet unless forced, and never answers an agent's question to a person |
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
  brief, a name, a base, and the caller's settings, stages on hold and
  mark.
- **brief**: what the work is, as the caller wrote it.
- **mark**: words of a caller's own that a launch carries, by which the
  caller finds its places.
- **kind**: a named, ordered list of stages, with how its places'
  branches are named and whether its first stage starts in a place that
  could not be made ready.
- **declaration**: a written set of kinds: flume's own, a repository's,
  or one a launch carries.
- **stage**: one step of a kind: its name, its prompt, its deliverable,
  and its agent's settings.
- **deliverable**: what must exist for a stage to end, in one of the
  forms of 24.
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
  the terminal it runs.
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
- **end**: of a stage, that it **delivered**, or that it **ended
  short**.
- **on hold**: of a stage, that it waits on its caller's word before its
  agent starts.
- **stuck**: of a stage, that its agent has been quiet past the stage's
  limit with nothing delivered and nothing said.
- **lost**: of a stage, that its agent stopped with nothing delivered
  and nothing said.
- **stage state**: where a stage stands: not reached, on hold, waiting
  on its place's readiness, started, begun, never begun, stuck, lost,
  stopped by its caller, delivered, or ended short.
- **retry**: a caller's ask that a place start one stage of its kind
  afresh, the current stage unless the retry names another, with words
  of the caller's for its prompt.
- **tell**: words a caller hands the agent of a place's current stage.
- **stop**: a caller's ask that a place's agent end.
- **drop**: a caller's word that a place's work is given up.
- **forced**: of a stop, a retry or a drop, that its caller asked for it
  to end an agent that is not quiet.
- **submission**: a place's branch offered to the merge queue for its
  base, and what the merge queue records of it.
- **landed**: of a place's work, that the merge queue records a
  submission of the place's own branch landed on its base.
- **over**: of a place's work, that it landed or was dropped.
- **tidy**: removing a place whose work is over, and its branch where 67
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
   and whoever needs a stage's start or end learns it from status (43).
7. A launch may carry settings for any of its stages' agents, the
   stages it puts on hold, and a mark. flume keeps the mark with the
   place and reports it, and decides nothing by it.
8. A place's kind, brief, base, settings and stages on hold are fixed
   by its launch. Nothing after the launch changes them, and the words
   of a retry are the only thing a caller adds to a place (49).

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
14. flume never commits, merges, rebases or lands. It moves no branch,
    except to make a place's branch at its launch and to remove it at
    its tidy (67).
15. A place's work lands only on its base, and its base is the only
    branch flume reads its landing against (63).
16. Removing a place ends every agent flume started in it.
17. Places are independent: what one place's agent does, and how its
    stages end, never starts, ends, holds or moves another place.

### A.3 Kinds and stages

18. A kind is an ordered list of one or more stages, and every stage
    has exactly one deliverable.
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
22. flume's own declaration holds exactly three kinds. **fix** is a
    code stage, which delivers commits, then a submission stage, which
    delivers the landing; its first stage starts in a place that could
    not be made ready. **change** is a construct stage, which delivers
    the place's change written; a code stage, which delivers its tasks
    ticked; a verify stage, which delivers a report; and a submission
    stage, which delivers the landing with the change archived.
    **question** is one stage, which delivers a conclusion as a report.
23. A kind's declaration holds its stages in order, how its places'
    branches are named, and whether its first stage starts in a place
    that could not be made ready. A stage's declaration holds its name,
    its prompt and its deliverable, and may hold its agent's settings,
    whether it waits on its caller's word, and how long its agent may be
    quiet before the stage is stuck. Nothing else a declaration holds
    changes what flume does.
24. Every deliverable is one of five forms, each read where it lives:
    - **commits**: the place's branch holds a commit made since the
      stage started;
    - **change written**: the place's branch holds the place's change
      with its planning complete, in a commit made since the stage
      started;
    - **tasks ticked**: every task of the place's change is ticked at
      the branch's head, in a commit made since the stage started;
    - **report**: a file at the path the stage's declaration names,
      written since the stage started;
    - **landing**: the place's work landed since the stage started and,
      where the stage asks, the base holds the place's change archived
      at the commit it landed as.
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
    filled in for the place and the stage, and a submission stage's
    prompt gives the way to submit (100).
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

### A.5 Prompts

37. flume sends a stage's prompt only once its agent is waiting, and
    never into a question the agent has put to a person.
38. A prompt is received or sent again. flume reads, within a bound,
    whether the agent received it, sends it once more when it did not,
    and reports the stage never begun when the second sending is not
    received either. flume never sends a prompt the agent already
    received, and text left typed for a hand to submit is never a
    stage's state.

### A.6 Stage ends

39. A stage ends only when its deliverable exists or its agent stops
    short. Between its start and its end the agent may end turns, start
    own work and wait on it, be woken, ask and be answered any number of
    times, and no quiet terminal, ended turn or closed terminal ends the
    stage.
40. A stage that has delivered ends once its agent is quiet. flume then
    ends the agent and starts the next stage, unless that stage waits on
    its caller's word (47) or the stage was the kind's last.
41. An agent stops short by saying so to flume, with its words. flume
    takes a stop-short only from the agent of the place's current
    stage, and never infers one from anything else.
42. A stage that ended short starts no next stage, whatever else
    exists. Its place waits for a retry or a drop, and the agent's words
    reach whoever waits on the stage, and status, whole and as the agent
    wrote them.
43. Whoever waits on a stage learns its end together with what was
    delivered, the head, the report or the commit it landed as, or with
    the agent's words. No caller needs to read a terminal to learn how a
    stage ended.
44. A stage whose agent has been quiet past the stage's limit, with
    nothing delivered and nothing said, is reported stuck, naming the
    stage and the agent. An agent that is asking is never stuck. flume
    never ends a stuck stage, and a deliverable that appears afterward
    ends it as any other.
45. A stage whose agent stopped with nothing delivered and nothing said
    is reported lost. flume starts no agent for a lost stage on its own
    (48).
46. A place moves on without anyone asking: flume reads each stage's
    end, starts the next stage, and tidies a place whose work is over
    (63) within a bound it states, whether or not a caller asks. Asking
    only shortens the wait.
47. A stage that waits on its caller's word starts only on a retry that
    names it (49).

### A.7 Retries, stops and drops

48. flume never starts a stage again on its own, and never bounds how
    often a caller does. Status gives how many times each stage has
    started.
49. A retry starts the stage it names with a fresh agent and the
    retry's words in its prompt, and the stages after it then run again
    in order, as 40 and 47 allow. A retry names a stage of the place's
    kind, and never changes the place's kind, brief or base (8).
50. A retry ends the place's agent first, one that is not quiet only
    when forced (31), and is refused, naming the place, when the
    place's work is over.
51. A stop ends the place's agent and nothing else: the stage neither
    ends nor moves on, and waits for a retry or a drop. An agent that is
    not quiet is stopped only when forced (31).
52. A drop makes a place's work over (63). flume ends the place's
    agent, one that is not quiet only when forced, and starts nothing
    more in the place.

### A.8 Tells

53. A tell hands the agent of a place's current stage its words as a
    prompt, or nothing at all. A tell to a place with no live agent, or
    whose agent is asking, is refused with nothing typed.
54. A tell never interrupts a working agent: its words reach the agent
    only once it is waiting (Flywheel 71). A tell not delivered within
    the bound its caller gives, or flume's own, is refused with nothing
    typed, and a tell delivered is received or sent again as a prompt
    is (38).
55. A tell never starts, ends, holds or moves a stage, never counts as a
    retry, and never stands for a deliverable.

### A.9 Status

56. For every place on its host, status gives the place's repository,
    kind and the declaration it came from, its name, branch, base and
    mark; each stage's state, how it ended, and how many times it
    started; the current stage's agent, with its identity, settings and
    agent state; whether the current stage's deliverable exists; the
    place's submission as the merge queue holds it; its change's tasks
    and which are ticked; and the words of a stop-short.
57. Asking status starts no agent, sends nothing to one, and writes
    nothing.
58. Every fact status gives of a place's deliverable, change or
    submission is read where it lives when status is asked, at one head
    (25). flume never answers one of them from a record of its own.
59. A fact of a change that flume reads without the change's own reader
    agrees with what that reader gives at the same revision.
60. The same question about the same places gets the same answer,
    whoever asks and through whichever surface. Every surface answers
    from one core, and no surface computes a stage's end, a status or a
    tidy of its own.
61. Every answer has one form a program reads, the same through every
    surface, and that form only ever gains fields.
62. flume keeps only the live state of the places on its host. Once a
    place is tidied flume keeps nothing of it, and whatever outlives a
    place is its caller's to keep, from what flume reported.

### A.10 Tidying

63. A place's work is over when it landed or its caller dropped it.
    Work of the place's that reached its base any other way, inside
    another place's landing or by a hand, is not its landing, and the
    place stays.
64. flume removes only places it made, and only once their work is over
    and their agent has stopped. It never removes a worktree it did not
    make, the repository's main worktree, or a worktree whose agent is
    live.
65. flume never removes a place that holds a change not committed, a
    file neither committed nor ignored, or a lock. It keeps it and names
    what it holds.
66. flume removes a place through its repository's teardown, so what
    the repository stood up for the place goes with it. A teardown that
    fails keeps the place, named with the step that failed.
67. When a place goes, its branch goes only if it holds no commit whose
    change its base lacks, judged by the change each commit makes and
    never by ancestry alone. A branch holding such a commit is kept and
    named.
68. flume removes nothing while it cannot read whether a place's work
    is over.

### A.11 Callers

69. flume does the same for every caller and needs none of them. What
    it does for a launch depends on the launch, the repository and the
    host, never on which caller asked or through which surface.
70. flume holds no count or cap of its own on places or agents, plans
    nothing across places, and orders none. How many places a caller
    runs at once, which work each holds, and when each stage on hold
    starts are the caller's.
71. flume never submits a place's work. A stage's agent submits it, and
    flume reads the outcome from the merge queue, never from the agent's
    words or its terminal.
72. flume tells no person anything by itself. A surface shows what
    flume reports when it is asked.

### A.12 Held state and hosts

73. flume keeps its held state on its host, outside every repository's
    content.
74. Every act flume performs is safe to repeat: a repeat of an act
    already done changes nothing (Flywheel 73).
75. Two acts on one place at once leave it as one or the other would
    have. Neither leaves the held state half written, and no two acts
    give a place two agents (30).
76. Every place flume made is in its held state until it is removed. No
    act leaves a worktree or a branch of flume's that its held state
    does not name.
77. flume stopping, or its host stopping, loses nothing flume held. On
    its return flume reads every place again from its held state, its
    repository, its terminal and the merge queue, and reports each agent
    that did not survive as lost (45).

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
    carrying its identity and its words (41).
93. The guarantee: each answer is what the agent's own record shows, and
    an answer the record does not give is unknown, never guessed from
    the terminal.

### B.5 The terminal

94. **open**: given a place, a command and an identity, an agent running
    the command in the place under that identity, or a refusal (30).
95. **send**: given an agent and a text, the text delivered as input the
    agent receives, or a refusal; never text typed and left for a hand
    (38, 53).
96. **state**: given an agent, its agent state (56).
97. **close**: given an agent, its end, or a refusal because it did not
    end (31).
98. The guarantee: open never runs a second agent under an identity
    already live, and close never reports an end that did not happen.

### B.6 The merge queue

99. **read-submission**: given a repository and a branch, the newest
    submission of that branch with its target and its state: waiting,
    under test, landed with the commit it landed as, removed as the
    cause of a failure or a conflict with what it named, or withdrawn;
    or none; or that the merge queue could not be read (63, 68, 71).
100. **how-to-submit**: given a place, how its agent submits the place's
     branch to its base, for a prompt to name (28).
101. The guarantee: landed is said only of a submission of that branch
     that the merge queue itself landed, never inferred from what the
     base holds (63).

### B.7 The store

102. **read**: the held state and the version it was read at.
103. **write**: given the version read and the next held state, the
     write, all or nothing, which succeeds only if the held state is
     still at the version read (75).
104. The guarantee: the store holds nothing in a repository's content
     (73), and every flume process on the host reaches the same store.

### B.8 Binding the contracts

105. Each seam is bound by naming one profile of Part C: the terminal
     and the store once for the host; the place, the kinds, the change
     and the merge queue once for each repository; the agent for each
     stage, by its settings (32). Parts A and B do not change to admit a
     profile.
106. One conformance suite holds every profile to Parts A and B; a
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

[[kinds.bump.stages]]
name = "code"
prompt = "prompts/bump-code.md"
deliverable = "commits"
quiet = "45m"            # the stuck limit (44); flume's default when omitted
agent = { program = "claude", model = "opus" }

[[kinds.bump.stages]]
name = "submit"
prompt = "prompts/submit.md"
deliverable = "landing"
wait = true              # waits on its caller's word (47)
```

| deliverable (24) | spelled |
|---|---|
| commits | `commits` |
| change written | `change` |
| tasks ticked | `tasks` |
| report | `report:<path>`, the path relative to the place, or under `{{state}}`, the place's own folder beside the held state (C.7) |
| landing | `landing`, or `landing:archived` where the change must be archived |

A prompt's parts are `{{brief}}`, `{{name}}`, `{{kind}}`, `{{stage}}`,
`{{branch}}`, `{{base}}`, `{{place}}`, `{{change}}`, `{{report}}`,
`{{words}}`, `{{unready}}`, `{{needs}}` (the way to stop short, C.4) and
`{{submit}}` (the way to submit, C.6). `{{#words}}…{{/words}}` renders
its body only when there are words; a bare part with nothing to fill it
refuses the stage (27). `flume prompt <place> <stage>` renders a
stage's prompt and starts nothing (29).

flume's own kinds, their prompts shipped with flume:

| kind | branch | first stage starts unready | stages, each with its deliverable |
|---|---|---|---|
| **fix** | `fix/<name>` | yes | `code`: `commits`; `submit`: `landing` |
| **change** | `change/<name>` | no | `construct`: `change`; `code`: `tasks`; `verify`: `report:{{state}}/verify-<n>.md`, the stage's start count as `<n>`; `submit`: `landing:archived`, its prompt archiving the change on the place's branch before it submits |
| **question** | `sounding/<name>` | no | `round`: `report:conclusion.md` |

### C.3 The change: OpenSpec

| operation | how OpenSpec satisfies it |
|---|---|
| read-change | `openspec/changes/<name>/` at the revision: present when the folder exists; planning complete as `openspec status --change <name> --json` gives `isPlanningComplete`; its tasks the `- [ ]` and `- [x]` lines of `tasks.md`; archived when `openspec/changes/archive/<date>-<name>/` exists. A change of OpenSpec's spec-driven schema is read from its files with no `openspec` process, and a change of any other schema through `openspec` (59). |

### C.4 The agent: Claude Code

| operation | how Claude Code satisfies it |
|---|---|
| command | `claude` in the place, with `--model` and `--append-system-prompt` from the settings, and `FLUME_AGENT` (the identity), `FLUME_PLACE` and `FLUME_STAGE` in its environment beside the settings' own; the prompt sent once it waits, or carried as the command's argument under the printed command (C.5) |
| received | the session's transcript holds the prompt as a user turn |
| asking | a mark flume's own hook leaves when the agent opens a question or a plan for a person, open until the transcript holds the answer; the terminal's reading alone never decides it |
| own-work | background tasks the transcript shows started and not finished |
| stop-short | `flume needs "<words>"`, run by the agent, refused unless `FLUME_AGENT` names the agent of the place's current stage |

flume answers the folder-trust question when the terminal shows it, and
never the warning about bypassing permissions (34).

### C.5 The terminal

| profile | open | send | state | close |
|---|---|---|---|---|
| **herdr** | a pane in the herdr session the launch's settings name, flume's own otherwise, one tab per place named `<kind>--<name>`, the pane and its agent named by the identity | herdr's prompt to the pane, then received read through the agent (89) | herdr's reading of the agent: working as working, idle as waiting, done as stopped, blocked as asking only with the agent profile's mark (90) | herdr ends the pane and its process group, then reads that it is gone |
| **printed command** | the command printed, the prompt carried in it, for a person to run in the place | refused, so every tell is refused and a prompt not received is reported never begun (38) | from the agent profile alone; stopped when its record says the session ended | refused unless the agent's record says the session ended |

### C.6 The merge queue: sluice

| operation | how sluice satisfies it |
|---|---|
| read-submission | `sluice status <base> --json`, the newest entry submitted from the place's branch; landed is that entry landed, its landing commit's `Sluice-*` trailers naming it |
| how-to-submit | `wt submit <base>` run in the place, as the `{{submit}}` part; never `wt submit --help`, which removes the worktree it runs in |

### C.7 The store: the host's state directory

An analysis of storage may replace this profile, and nothing above it
changes.

| operation | how the state directory satisfies it |
|---|---|
| read | the documents under `$XDG_STATE_HOME/flume/` (`~/.local/state/flume/`), one per place, with a version beside them |
| write | a new document written beside the old and renamed over it, under a lock held for the write (75, 103) |

A place's own folder there holds what its stages write for flume, such
as the change kind's verify reports, and goes when the place is tidied
(62).

<!-- ANCHOR_END: part-c -->
<!-- ANCHOR: invariants -->
## 7. Global invariants

- **I1.** A stage ends only at its deliverable or its agent's
  stop-short, never at a quiet terminal (39, 41).
- **I2.** A place has at most one agent, and no agent that is not quiet
  is ended unless a caller forced it (30, 31).
- **I3.** flume never commits, merges, submits or lands, and moves no
  branch but its places' own (14, 71).
- **I4.** flume removes only what it made, and never a commit its base
  lacks (64, 67).
- **I5.** A prompt or a tell is received or reported, never left typed
  (38, 53).
- **I6.** flume decides nothing its callers decide: what to launch, how
  much at once, or when a stage on hold starts (1, 70).

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
- Testing or landing work. The merge queue does both, under the
  repository's gate.
- Keeping the record of the work a place served: millpond's item,
  crew's plan, sounding's rounds.
- Working a question: its sources, its conclusion and the operator's
  decision on it are sounding's.
- Judging a deliverable's content. A later stage's agent or a person
  does.
- Answering an agent's question to a person, or telling a person
  anything by itself.
- Keeping a place current with its base. A caller or a stage's agent
  takes the base into the place.

<!-- ANCHOR_END: non-goals -->
<!-- ANCHOR: givens -->
## 9. Environment givens

Constraints already fixed:

- Repositories are git repositories, and places are git worktrees on
  the host flume runs on.
- An agent is a coding agent program run in a terminal on the host. It
  keeps its own record of the prompts it received, and works unattended
  in its place.
- Work lands through a merge queue, which tests a branch's work as it
  would land and records each submission.
- The callers are the operator, millpond, headwater, sounding and crew,
  each through flume's command line or a plugin of flume's.
- flume is free and open source.

The rest of the stack, which a model builds on unless it says why not:

- One static binary, written in Rust, as sluice is.
- Every answer as JSON on request, the form of (61).
- Three surfaces answering from one core, each a plugin kept outside the
  core as sluice keeps its plugins: a command line (`flume launch`,
  `status`, `tell`, `stop`, `retry`, `drop`, `tidy`, `prompt`, and
  `needs` for an agent); a Claude Code plugin that gives every session
  `/launch` and serves `status` over MCP; and a herdr plugin whose
  sidebar shows every place in flight with its kind, its stage, its
  agent's state and a change's tasks ticked, and whose keys open a
  place's pane, tell its agent, stop it and retry its stage.
- The profiles of Part C: worktrunk, flume's TOML declarations,
  OpenSpec, Claude Code, herdr, sluice and the host's state directory.
- How each caller uses flume:

  | caller | launches | keeps |
  |---|---|---|
  | the operator | `/launch <brief>` in any session, or the herdr plugin's key | nothing; the sidebar shows each place |
  | millpond | an item's send, as a fix or a change, the item's brief as the launch's | the item's record and its sends, and the landing, written from the merge queue's record of the place's branch |
  | headwater | its fix key, as a fix with the release's brief | nothing |
  | sounding | a question, as the place and session of a sounding | the question, its rounds and its conclusion; its go-on is a retry with the operator's notes as words, and its drop a drop |
  | crew | each unit, chore or fix of a team, as a place of a kind crew carries in the launch, every stage after the first on hold, each agent's settings from crew's roles, marked with the team and the slot | plans, bolts, slots and the cap on them, the dispatcher, conductors, approvals and conflicts between units; it starts each stage on hold with a retry and reads each end from status |

<!-- ANCHOR_END: givens -->
<!-- ANCHOR: questions -->
## 10. Questions the model must answer

These are not requirements.

- How does flume read that an agent waits on own work, and what does a
  stage do when that cannot be read (31, 40, 44)?
- Does a deliverable ever send a place back to an earlier stage by
  itself, as a verify report's findings marked for fixing would run
  code again, or is every return a caller's retry (48, 49)?
- Does a caller learn a stage's end by asking, or does flume tell it,
  and through what (43, 46)?
- What is a stage's quiet limit when its declaration sets none, and
  does it run from the agent's last act or from the last change in the
  place (44)?
- Does a retry run the repository's readiness again (11, 49)?
- When the terminal resumes an agent after the host restarts, is that
  agent the stage's agent, and does the stage go on (35, 77)?
- How does flume know a stop-short comes from the current stage's agent
  and from no other process (33, 41)?
- Is a launch whose branch a dropped place left behind refused until
  that branch goes, or does it take another branch (3, 67)?
- Under a terminal that cannot send text after the start, how is a
  prompt received or sent again (38)?
- May a repository declare deliverable forms of its own, such as a
  command that must pass (24)?
- Is a stage ever worked by several agents at once (Flywheel 56), and
  if so in one place or in several (18, 30)?
- How long may a stage wait on its caller's word before flume reports
  it, if ever (47)?
- Who owns a place whose caller is gone, and may another caller drop it
  (62, 70)?
- Does status read every live place's deliverable at each ask, and how
  does it stay quick across many repositories (58)?
- Where is a repository's binding read from: the host's own settings,
  or the repository's declaration beside its kinds (20, 105)?

<!-- ANCHOR_END: questions -->
<!-- ANCHOR: scenarios -->
## 11. Scenarios the model must satisfy

- **S1.** The operator presses headwater's fix key on a release. flume
  makes a fix place on a new branch from the base's current revision,
  readies it, and starts the code stage's agent with the release's
  brief. The agent commits the bump, waits on a test run it started, and
  goes quiet once the run passes. flume ends it and starts the
  submission stage, whose agent submits. The merge queue lands the
  branch, and flume removes the place and its branch, which holds
  nothing the base lacks.
- **S2.** millpond sends an item as a change. Construct writes the
  change and commits it with its planning complete. Code ticks its tasks
  over four commits, and status shows two of five ticked, then five.
  Verify writes its report, and the submission lands with the change
  archived. No caller read a terminal at any point.
- **S3.** A code stage's agent ends its turn to wait on a suite it
  started. Its terminal shows nothing for twelve minutes. The stage does
  not end and is not reported stuck while the suite runs, and it ends
  when the last task is ticked and the agent is quiet.
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
  construct on hold. Each construct delivers, and flume starts nothing
  more. crew's word starts one place's code stage. flume launches no
  third place of its own, and the team's slots, its cap and the work
  each slot holds stay crew's.
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
  delivered and nothing said. Status reports the stage stuck, naming it
  and the agent, and flume does not end it. A tell wakes the agent, it
  ticks the last task, and the stage ends at its deliverable.
- **S18.** sounding launches a question. The agent writes its
  conclusion, and the stage ends. sounding's go-on retries the stage
  with the operator's notes as its words, and a fresh agent writes a
  second conclusion. sounding drops the place, and its branch, holding
  prototype commits the base lacks, is kept.
- **S19.** The merge queue removes a submission as the cause of a
  failure. The submission stage's agent reads the failing checks, fixes
  them in its place and submits again. The second submission lands, and
  the stage ends at the landing.
- **S20.** A caller stops a working agent without forcing it, and the
  stop is refused. Forced, the stop ends the agent, and the stage waits,
  neither ended nor moved on, until a retry.
- **S21.** A retry names a stage of a place whose work landed. It is
  refused, naming the place.
- **S22.** A stage's prompt asks for the brief, and the launch gave
  none. The stage is refused, naming the brief, and no agent receives a
  prompt with a blank in it.

<!-- ANCHOR_END: scenarios -->
<!-- ANCHOR: deliver -->
## 12. What to deliver

A model of flume that satisfies Parts A and B: its components, a
place's record and its states, how a stage's end is read for each form
of deliverable, how a prompt and a tell are delivered, and how a place
is tidied, with fixed examples, and how a kind, an agent program and a
terminal are added. A conformance suite whose scenarios each cite the
clauses they exercise, failing when a clause is cited by nothing. The
profiles of Part C, each passing the suite.

<!-- ANCHOR_END: deliver -->
