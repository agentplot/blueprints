# flume — requirements
<!-- ANCHOR: preamble -->

A statement of what flume must always do and never do, written to
admit any model that satisfies it.

The statement is in three parts. Part A is what must hold of flume on
its own: how one piece of work is launched in a place of its own, taken
through its kind's stages one fresh agent at a time, submitted where
its kind lands, followed to its end, and tidied away. Part B is its
contracts: the operations it needs across its eight seams, the place,
the kinds, the change, the agent, the terminal, the merge queue, the
store and the window, and the guarantee each must give. Part C is the
profiles: the ways each contract is satisfied. The store's profile
follows the family's storage rule (section 9).

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
queue decides, and on the watch a caller keeps over the host, for
flume runs no process of its own. flume reports where every place stands. It
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
| **a caller** (the operator, millpond, headwater, sounding, crew) | what to launch and when: the repository, kind, brief, name and base, the stream it runs in, the intent it serves with the intent's brief, and the goals, which stages wait on its word and whether the submission does, and its agents' settings, where in the terminal each runs among them; when to message, hibernate, resume, stop, retry, finish, drop or declare done any place; each place's priority, at the launch and after it | it never changes a place's kind, brief or base after the launch, never ends an agent that is not quiet without forcing it, never opens, sends to or closes an agent's terminal itself, and never makes flume run anything in a place but its readiness, its teardown and its stages' agents |
| **the repository's authors** | the repository's kinds, with whether each lands and where a failed submission sends a place back; what a worktree needs to be ready, and what removing one must undo; each seam's profile (105) | they never decide who launches or when, and never make flume remove a commit a branch holds that its base lacks |
| **an agent** (a coding agent program working one stage) | how to do its stage, and what it commits in its place; whether to stop short, and what to say | it never ends, starts or moves a stage but by stopping its own short, never goes quiet with its deliverable missing and nothing said (110), never submits, merges or lands, and never acts in another place |
| **the merge queue** | whether and when a submitted branch lands on its base, and, where its profile does so, removing a landed place through its repository's teardown | it never receives a place's work from the place's agent (71), and removes a place only once its submission landed (113) |
| **flume** | when a stage has ended; starting each next stage that waits on no word, when the host and its stream have room for it, in its streams' and its callers' priority order, under the account its pool makes usable; submitting a landing kind's place after its last stage, and sending it back when the submission fails; sending prompts and messages; hibernating a stage whose kind hibernates once its agent is idle past its hibernate time (212); when a place whose work is over is removed | it never decides what to launch, sets no bound of its own on agents and holds no cap on places, orders places by nothing but the priorities its callers gave and the host's streams', never commits, merges or lands, never removes what it did not make or a commit its base lacks, never ends an agent that is not quiet unless forced, never answers an agent's question to a person, and runs no process of its own between its commands (120) |
| **the operator** | everything no caller and no repository's author settles | |

<!-- ANCHOR_END: actors -->
<!-- ANCHOR: glossary -->
## 3. Vocabulary

Terms are defined by meaning. A model may add terms; it may not
redefine these.

- **host**: the machine flume runs on, with its terminals and its held
  state.
- **repository**: a git repository on the host, with every worktree of
  it: one common git directory.
- **base**: the branch a place is cut from and the only branch its work
  lands on; the repository's shared branch unless the launch names
  another.
- **base place**: a place whose kind lands and has no stages. It has
  no worktree: it is a branch the merge queue makes and closes at
  flume's asking, and the state flume holds of it. Other places name its
  branch as their base and land on it through the merge queue, and it
  lands on its own base once its caller says so. Of a place, its base
  place is the live place whose branch is its base (202).
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
- **kind**: a named simple kind or statechart kind, at a version (18).
- **simple kind**: a kind that is a list of stages in order. It also
  says how its places' branches are named, whether its first stage
  starts in a place that could not be made ready, and whether it lands
  (23).
- **statechart kind**: a kind that is a statechart built from the
  templates, run by the engine (175, 176).
- **statechart**: regions side by side, each in one of its states at a
  time, and transitions out of each state in priority order, each with
  a guard over evidence and the effects it performs (175).
- **template**: a statechart a state of a statechart kind runs inside
  it. A statechart kind is built from three: the stage template, which
  runs its sessions and joins them; the session template, one agent's
  life; and the place template, the worktree its sessions work in
  (175).
- **atom**: a name a statechart's guard reads as evidence, or its
  transition performs as an effect, each effect with the evidence that
  proves it done; flume binds each to one seam (178).
- **engine**: the family's code that ticks a statechart: given its
  states and one reading of its evidence, it gives the transitions that
  fire and the effects to perform, and decides nothing else (176).
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
- **stage**: one step of a kind: of a simple kind, its name, its
  prompt, its deliverable or that it is a conversation, and its agent's
  settings; of a statechart kind, a state that runs the stage template
  (175).
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
  flume made for one launch; or a base place, which is its branch and
  the state flume holds of it, with no worktree (202).
- **live**: of a place, made and not yet removed; of an agent, started
  and not yet stopped.
- **current stage**: of a place, the stage it most recently started.
- **readiness**: the steps that equip a worktree for work before work
  starts in it: the tools its repository declares, installed and set up
  as its merge queue equips the working copies of its own runs.
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
  program, its model, its effort, its mode, its instructions, its own settings, its
  environment, where in the terminal it runs, such as beside a pane
  its caller names, and how long it is kept open for an answer once it
  stops short (198).
- **own settings**: of an agent, its program's own settings, as that
  program spells them, such as its status line, its renderer, its hooks
  or what its commits say about who made them; given for each program
  under its name, and passed to that program alone (195).
- **named file**: a settings file in a program's own words that a layer
  of an agent's settings names by its path, its keys beneath that
  layer's own (195).
- **mode**: how far an agent may act in its place without asking a
  person: one of flume's four, plan, ask, edits and full, the same for
  every program, or a value of one program's own given under that
  program's name (162, 169).
- **effort**: of an agent, how hard its program's model works on each
  turn, in its program's own word, such as Claude Code's `xhigh` (197).
- **points**: a caller's measure of how much agent work a place's work
  is, a number of the Fibonacci scale, 1, 2, 3, 5, 8, 13, 21 and on,
  given at the launch; flume never estimates one (165).
- **pace**: of a stream, how many points its places may start in any
  span of a length the host's configuration names, such as 13 a day
  (167).
- **stream**: a named share of a host's work, which the host's
  configuration declares with its own bound on agents running, its
  priority and its pool; every place runs in one (143).
- **label**: of a kind, which part of a stream's work its places are,
  one word such as `inception`, `construction` or `operation`, which
  the kind declares and the host's configuration may give otherwise;
  flume gives a label no meaning but its share of its stream's agents
  (180, 181).
- **owed**: of a label in a stream, how many of the stream's agents
  its places are first in line for, lent to the stream's other labels
  while it has nothing waiting and its own again at the next agent to
  end; of those, the ones held **reserved** for it, which it never
  lends and which stay empty while its places run fewer (181).
  Reserved is the family's one word for what is held for one use and
  never lent, as sluice's runs reserved for submissions are (flume
  record 0063).
- **account**: an agent program and the environment it runs under,
  which signs it in to an allowance of its own, as the host's
  configuration names it (144).
- **pool**: a named list of accounts in order, with the strategy by
  which flume chooses one at each start and the threshold past which
  one takes no new start (144, 145, 185).
- **spent**: of an account, that an agent's own record said it reached
  a usage limit, until the time the limit resets (146).
- **usable**: of an account, that it is not spent, not past its
  threshold, and has room under the bound it states (145, 185).
- **reading**: of an account, what its agent program last reported of
  its allowance in a session flume started: for each of its usage
  windows, how much is used and when it resets, kept by flume in the
  host's own documents, and never written by the host (184, 211).
- **past its threshold**: of an account, that its reading gives a
  window used to its pool's threshold or past it, until that window
  resets (185).
- **affinity**: the stream an intent's places start in, and, for each
  agent program its agents run, the account they start on, each kept
  while that account is usable (147).
- **identity**: the one name flume gives an agent, naming its
  repository, its place, its stage and which start of the stage it is,
  and which session where its stage runs several (33).
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
- **kept open**: of an agent that stopped short needing an answer, live
  and waiting for it in its own session until its time passes, it
  stops or its account is spent (198).
- **hibernating**: of a stage whose kind hibernates it, that its agent
  was ended once quiet and its session kept for a resume, the stage
  neither ended nor moved on, holding no room and no account (212).
- **resume**: a start that goes on with a hibernating stage's own
  session, at a caller's word, a message or an answer (213).
- **standing role**: a role whose kind's stage is a conversation that
  hibernates: one place flume keeps at the role's address, which takes
  its work in batches and hibernates between them, reads the
  repositories its entry names and commits to none (193, 214).
- **stop check**: flume sending back an agent that would go quiet with
  its stage's deliverable missing and nothing said (110).
- **end**: of a stage, that it **delivered**, that it **ended short**,
  or, of a conversation, that it was **finished**.
- **on hold**: of a stage or a submission, that it waits on its
  caller's word before it starts; of the move a place waits on, that a
  caller said in its words that it is making it (130).
- **room**: of a host or a stream, how many more agents of flume's
  places it may run at once: the bound its administrator states for it,
  less its agents running (70, 143); of a stream, for a place's first
  start, also its points bound less its points in flight, and its pace
  less what it started in the span (166, 167); of a stream, for a stage
  of one label, also less what its other labels hold reserved and do not
  use (181).
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
  or a role's address, held by a run of its kind or by a standing
  agent, the answerer behind its stream among them (43, 132, 193).
- **address**: of a role, `<stream>/<role>`: the role a source of the
  host declares for a stream (193). A launch, a stop-short or a carrier
  names it in place of a session, and a stop-short names its own
  stream's role by the role alone (41, 132).
- **answerer**: of a stream, the role a source of the host declares to
  stand behind the places that run there (193). It is the recipient of
  a launch that names none and runs in no session, and a recipient of
  every stall of a place that is not its own.
- **delivered**: of an end and one of its recipients, that the
  recipient confirmed it, naming its key, as weir's delivery is done
  for a reader (weir 102, 107); **pending** for that recipient until
  then, and **expired** once pending past its expiry (43; weir 104).
- **handed over**: of an end, put before a recipient by a notice, a
  wait, the inbox or a session's start, recorded with to whom, when
  and by what; it delivers nothing by itself (43; weir 103).
- **collect**: a recipient's taking of every end pending for it, by
  `flume inbox`, which hands each over, and delivers each where its
  recipient confirms on receipt (43).
- **notice**: what a hand-over carries into a pane: the end, the place
  to read and how to confirm it, never a fact to act on blindly.
- **key**: of an end, the name flume gives it, which no other end of
  the place has, by which a recipient and an answer name it (42, 43).
- **refused**: of a stage, that a part its prompt asks for had nothing
  to fill it (27).
- **lost**: of a stage, that its agent stopped with nothing delivered
  and nothing said.
- **stage state**: where a stage stands: not reached, on hold, waiting
  on its place's readiness, waiting for room, refused, starting, started, begun, never begun, stuck,
  lost, stopped by its caller, hibernating, for review, delivered, ended short, or
  finished.
- **retry**: a caller's ask that a place start one stage of its kind
  afresh, the current stage unless the retry names another, with words
  of the caller's for its prompt; or, naming the submission, that flume
  submit the place again.
- **message**: words a caller hands the agent of a place's current
  stage, or puts to a role at its address (53, 214).
- **stop**: a caller's ask that a place's agent end.
- **finish**: a caller's word that a conversation is done, or that the
  plan a stage put for review is accepted (163).
- **for review**: of a stage that delivers a plan, that its agent put a
  plan for review and is quiet, and the stage waits on its caller's
  finish, message or retry (163).
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
- **watch**: a caller settling every place on the host, on a bound it
  states to flume, whether or not an agent is in a place, while flume
  itself runs nothing (208).
- **attended**: of flume on a host, that no caller keeps watch over it
  (119, 208).
- **window**: a window of the host's display, which a person looks at
  and closes, showing a part of a terminal; flume opens one only at a
  person's asking and keeps nothing of it (186).
- **view**: how a person is shown a stream's part of its terminal:
  a window the host's window program opens under the stream's title,
  or the terminal's own app (186).
- **held state**: everything flume keeps of its own for the places on
  its host.
- **surface**: one way a caller reaches flume.
- **profile**: one way a contract of Part B is satisfied, as Part C
  describes.
- **common profile**: the agent profile that binds every program flume
  carries no profile of its own for, reading of the program only what
  every program gives (170, 171).
- **degraded**: of a part of the agent seam for one program, answered
  not from the program's own record but as its profile declares: not
  offered, unknown, or read from the terminal (170, 171).

<!-- ANCHOR_END: glossary -->
<!-- ANCHOR: part-a -->
## Part A. What flume decides

### A.1 Launches

1. flume launches only when a caller asks, and only on the host it runs
   on. It never decides what to launch, and never makes a place or
   starts an agent on another host. A base place's fix, which its kind
   names, is launched by flume at a settle (203), since its caller asked
   for it in launching the base place. (flume record 0056, accepted 2026-11-07.)
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
   read (24) is refused naming the kind, and makes nothing. While flume
   runs no statechart kind, a launch of one is refused so, naming the
   kind and its format. Once flume runs them, a launch is refused only
   for what neither format holds, or for an atom or a template flume
   does not bind (175, 178). So is a
   launch of a kind that lands where the repository binds no merge
   queue (105). A launch that gives no brief while a stage of its kind
   asks for one is refused naming the stage, and makes nothing (27).
   So is a launch where a stage's agent resolves to a program no agent
   profile binds, or one the host's terminal cannot run, naming the
   program, the stage and where the program came from (32). So is a
   launch naming a stream the host's configuration does not declare,
   naming it (143), and one where a stage's standing instructions ask
   for a part, naming the stage (148). So is a launch naming a version
   its kind's source does not hold, naming it (154), and one naming a
   source the host does not declare, or whose declaration cannot be
   read, naming the declaration and why (191); a
   launch of a kind from outside that no lock records, or that the host
   does not hold, naming its identity (155, 159); one whose kind's
   content does not match its lock's hash, naming the kind and both
   hashes (156); one whose package refers outside itself or names
   another identity than the one it is held at (157); one whose kind
   names something a host owns, naming the field (158), and one whose
   repository's settings give how long an agent is kept open, naming
   the field (198); one where a
   stage's agent resolves to a mode its program's profile has no
   setting for, or to a table of programs that names no entry for its
   program, naming the mode, the program, the stage and where it came
   from, and one that gives `plan` to a stage that delivers neither a
   plan nor a conversation, naming the stage (162, 169); one where a
   stage's agent resolves to a model its program's profile names no way
   to give, naming the program and the stage (172); one where a stage's
   agent resolves to an effort its program's profile does not take,
   naming the effort, the program, the stage and where it came from
   (197); one where a stage's
   agent has a pool that holds no account that can run the stage,
   naming the stage, the pool and the stage's program where its layers
   resolve one (145); one where a stage
   that delivers a plan resolves to a program whose profile offers no
   plan, naming the program and the stage (164); one where a layer
   writes an own setting its program's profile reserves, gives a value
   shaped as a credential, or names a file that cannot be read, or
   where a stage's program cannot take the own settings given for it,
   naming the key, the program, the stage, the layer and the file and
   never the value (195); one whose points
   are not a number of the Fibonacci scale, naming them, and one that
   gives no points where its place's stream states a points bound or a
   pace, naming the stream (165). So is a launch that names no
   recipient and runs in no session where no answerer stands behind its
   stream, saying how to name one (7, 193), or where two roles stand
   behind it, naming both (193); and one that names a role's address no
   source of the host declares, or two declare, where no answerer
   stands behind its stream, naming the address (132).
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
   recipients of its ends (43), and a mark. A launch that names no
   recipient has the session that launched it, as the terminal it runs
   in names it (190), else the answerer behind the place's stream
   (193). A recipient a launch names is a session's name, or a role's
   address written whole (132). flume keeps the mark with the place and
   reports it, and decides nothing by it.
8. A place's kind, brief, base, stream, intent with its brief and goals,
   points, and the settings its launch carries, are fixed by its launch, and
   nothing after the launch changes them; the host's configuration of
   its agents' settings is read at each start (32), and the account each
   agent runs under is chosen at its start (145). The launch names the stages and the submission on hold, and a caller adds to a place after
   it only the words of a retry (49), a hold with its words (130) and
   a change of priority (70). Its recipients are fixed at its launch;
   the answerer behind its stream, as the sources declare it when a
   stall is read, is delivered its stalls besides (130, 193).

### A.2 Places

9. A place is one worktree of its repository, on a branch of its own
   named from its kind and its name the same way for every place of
   that kind. It is cut from its base's current revision where work
   lands on the base, never from a copy of the base that may lag it. A
   launch that cannot read that revision is refused, naming why. A base
   place has no worktree: it is its branch, which the merge queue makes
   (205), and the state flume holds of it (202).
10. No place checks out its base or any branch the merge queue lands
    on, and no two live places share a branch. A base place checks out
    nothing, since it has no worktree (202).
11. flume makes a place ready only by its merge queue's equipping of
    it, the steps the merge queue runs to equip the working copies of
    its own runs, asked at the revision the launch read (20) and run in
    the place with an environment that carries nothing of the caller's
    session. A repository that binds no merge queue has nothing run.
    flume names no repository's script, runs no readiness step of its
    own, assumes no tool, and requires no version of any (record 0036,
    accepted 2026-11-05).
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
    its launch and to remove it at its tidy (67). A base place's branch
    is the merge queue's to make and remove, at flume's asking (202,
    204).
15. A place's work lands only on its base, and its base is the only
    branch flume submits it to or reads its landing against (63).
16. Removing a place ends every agent flume started in it.
17. Places are independent: what one place's agent does, and how its
    stages end, never starts, ends, holds or moves another place.

### A.3 Kinds and stages

18. A kind is a simple kind or a statechart kind (175, 177). A simple
    kind is an ordered list of one or more stages, or, where it lands,
    of none: its places are base places (202). Every stage of a
    simple kind but a conversation has exactly one deliverable, and a
    conversation has none (109).
19. flume itself, a repository, a launch or a package declares a kind,
    and every kind is named by its identity: its source, its name and its
    version (154). For a launch, a kind's name resolves to exactly one
    kind: the launch's over the repository's own over flume's own, and
    among a source's versions to the one 154 gives. A launch names a kind
    of a source the host declares by its source (154). Status names the
    identity of the kind each place runs and where it came from: its
    source, with the source's declaration and where the kind lies, or
    the declaration that holds it. For a package, status names the hash
    of its content and the lock that recorded it too (155, 191).
20. A repository's kinds, its lock (155) and the revision its readiness
    is asked at are read from its base's revision at the launch. Its
    binding (105) is read from its default branch's current revision:
    the remote's, after one fetch, where the repository has a remote,
    and its own otherwise. None is read from a place's tree or from a
    change not committed; what a readiness step installs is what the
    place it runs in holds, which at the launch is that revision (record
    0036, accepted 2026-11-05).
21. A place runs its kind, and keeps its repository's binding, as each
    resolved at its launch: the kind's identity and its content as read
    then. A later change to any declaration, lock or package the host
    holds never changes a place already launched.
22. flume's own kinds are fix@1, chore@1, change@1, change@2, change@3
    and plan@1, all six simple kinds (18), and all six land. **plan** is a plan stage, which delivers
    a plan its caller accepts (163), and then fix's code stage, which
    works to the plan accepted; a failed submission sends it back to
    code. **fix** is a code stage, which delivers commits. Its
    first stage starts in a place that could not be made ready, and a
    failed submission sends it back to code. **chore** is fix's one code
    stage under a prefix of its own, so a branch's name says which it was
    (C.2). **change** at version 3 is a construct stage, which delivers
    the place's change written, each of its tasks naming the narrowest
    check that shows that task done and none running the repository's
    whole checks or a task group's; a code stage, one agent for the whole
    change, which delivers its tasks ticked; and a verify stage, which
    runs the repository's whole checks once and then checks the work as
    version 2's does. (flume record 0054, accepted by the user 2026-11-06) **change** at version 2 is a construct stage,
    which delivers the place's change written; a code stage, which
    delivers its tasks ticked and repeats per task group (140); and a
    verify stage, which checks the work
    against the change, commits its report in the change, and delivers
    the change archived. **change** at version 1 is the same, but its
    code stage does not repeat. A failed submission, and a verify
    finding (131), send a change back to code, which is the kind's fix
    round. Every version of change is flume's own side by side: a
    repository picks one by its lock (155) and a launch by naming it
    (154). Every other kind, each of sounding's among them, is a
    repository's, a launch's or a package's (19).
23. A simple kind's declaration holds its version, its stages in
    order, how its places' branches are named, whether its first stage
    starts in a place that could not be made ready, and whether it
    lands. One that lands names the stage a failed submission sends a
    place back to, and how many times a place may go back before it
    waits on its caller. One that lands with no stages may name its landing fix, the kind its fixes run as when the merge queue sends its branch back, by that kind's identity with its version, and how many it runs before its place waits on its caller (203; weir record 0005, the user's, 2026-11-07). It may
    hold settings for the agent of every one of its stages. A stage's declaration holds its name, its prompt, and
    its deliverable or that it is a conversation, and may hold its
    standing instructions (148), its agent's settings, what it makes
    besides its deliverable (129), whether it waits on its caller's
    word, how long its agent may be quiet before the stage is stuck, and
    whether it repeats per task group (140). flume reads only a simple
    kind's places and stages, and runs that much of them: stages in
    order, one agent to each start, a repeating stage's repetitions in
    turn, and the place sent back when its submission fails. A simple
    kind whose places and stages ask for more, such as a stage worked by
    several agents or with several deliverables, is refused (4); a
    statechart kind holds them (175). flume ignores a section of a kind
    it does not know, such as the elaboration section sounding reads,
    and nothing else a declaration holds changes what flume does. (Its sentence on a kind with no stages from flume record 0056's amendment of 2026-11-07.)
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
     side, as flume's own holds change@1, change@2 and change@3; the repository's
     and a launch's declarations hold one version of each name. A launch
     names its kind by its name, by its name and version, or by its
     whole identity. Naming no source, it takes the kind by that name
     from the launch's declaration, else the repository's own, else
     flume's own, and never a kind from a source the host declares, which a
     launch names by its source; where none of the three holds the name,
     the launch is refused naming each kind by that name the host's
     sources hold (4). Naming no version, it takes the version the
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
     change@1, change@2 and change@3 each carry their own construct and
     verify. A kind that lands with no stages may name the kind its
     fixes run as (23). That is a name its reader resolves as a launch's
     name resolves (154), and no part of the package, whose hash covers
     the name and not the kind it names. (flume record 0056's amendment of 2026-11-07.)
158. A kind names nothing a host owns, whichever source declares it: no
     environment, account, pool, stream, location on a host or time an
     agent is kept open (32, 144, 198).
     It may name the agent program it supports, by name, a model, by
     the name its program gives a class of models, and an effort, by its
     program's word (197), and the host binds each through its own
     layers of 32. A kind's declaration that names
     an environment, a time an agent is kept open, or a program by a
     location, refuses the launch naming the field (4). Settings are given to a kind by its name, in
     a repository's or a host's configuration, and join whichever source
     and version the launch's name resolves to (32). A kind's own
     settings, and the file it names for them, are parts of its package
     (157), within its content's hash (156); a kind whose own settings'
     values name a location on a host runs only on the hosts that hold
     it, as one whose prompt names one does (195).
159. The host holds the packages of the kinds from outside it may run
     where its sources say they lie (191), each at its name and version,
     several versions of one name side by side. How a package reaches the
     host, copied by a person or taken from a shared catalogue, is
     outside this statement. Holding a package runs nothing: only a lock
     does (155).
191. The host's configuration declares each source of the kinds from
     outside it holds, in its managed layer (C.7). Each source has a
     declaration of its own, named by the source, which names where the
     source's packages lie and may name where the source declares the
     roles it answers (193). A person, or a program that manages the
     host, writes a source's declaration whole, replaces it whole and
     removes it. None of these touches another source's declaration or
     anything else of the configuration. flume reads the sources as they
     stand at each launch, each wake of a role, each start, each stall,
     each lock its caller asks for and each status. It writes nothing in
     them or where a source's packages or roles lie. A source's
     declaration may be unreadable, or take the
     name of flume's own source, the repository's or a launch's. Such a
     declaration refuses each launch that names its source, naming the
     declaration and why, and no other launch (4); status names it (56).
175. A statechart kind is a statechart in the family's kind format
     (weir 94), built from the stage, session and place templates. Its
     regions run side by side, each in one of its states at a time. A
     state may be final, may carry a decision a person answers, may hold
     regions of its own, and may run a template or another statechart
     inside it with the parameters it gives. A state's transitions out
     are in priority order, each with a named guard over evidence, the
     state it goes to and its named effects. A state that runs the stage
     template is a stage of the kind. It runs its sessions side by side,
     one to each of its agents, which it lists or names by a rule read
     against the place, and joins them by all, any or a count. It names
     its deliverables, each one of the forms of 24, and sends the place
     back to a stage it names up to a bound, past which the place waits
     on its caller (112). A statechart kind that lands may name its landing fix and how
     many it runs (weir 94): when the merge queue sends its place's
     branch back, a conflict with its base or a check of the base
     failing on it, the fix runs as a place of that kind, as a base
     place's does (203), and the statechart never runs again for it;
     how that fix lands beside the statechart's own place is designed
     when flume runs statechart kinds (177). (Weir record 0005, the
     user's, 2026-11-07.) A session is one agent's life, from its start
     through working, waiting and asking to its end or its loss, and the
     place is the worktree its sessions work in (9). A statechart kind
     composes the templates and the atoms by their names, so a kind
     added changes no code of flume's, and one naming a template or an
     atom flume does not bind is refused naming it (4, 178). It carries
     a label, the words a person reads for it. Like every kind it is
     named by its identity, resolved, packaged and locked as 19 and 154
     to 160 say. Its version names one content: a change to what it
     holds is a new version beside the earlier one (154, 156), and a
     place keeps the version and the content it launched with (21).
176. flume runs a statechart kind on the family's engine (weir 96 to
     99), and decides no transition of its own. Each settle of a place
     under a statechart kind reads its evidence once, at one head of the
     place's branch (25), and ticks its statechart once over it. In each
     region the first transition out of its state whose guard holds
     fires. An effect is performed only while the evidence that proves it
     is absent, so a settle repeated performs nothing twice (74). flume
     serves each evidence and performs each effect through the seam its
     atom is bound to (178). It keeps what the engine holds of a place
     in the place's held state, written as every held state is (75,
     103): each region's state and when it was entered, its record and
     counters, and the answers it applied. A decision stands while its
     state is active, and an answer to it is applied once and never
     again (74). Nothing ticks between flume's commands (120): an agent
     going quiet, the host's watch and a caller's command settle a
     place under a statechart kind as under a simple
     kind (46).
177. flume reads and runs both formats side by side. Every release from
     the first that runs statechart kinds runs both, none drops simple
     kinds, and no build or setting of flume runs one format and not the
     other. A simple kind is declared, resolved, locked and run as 18 to
     25 and 140 say whatever statechart kinds come to do, by flume's own
     rules and never on the engine. No simple kind is refused, rewritten
     or run otherwise because statechart kinds exist, and status reports
     its stages' states as 56 says. Neither format is translated into
     the other. A kind declared again in the other format is a new
     version of it beside the earlier one (154, 156), and a place runs
     its kind in the format it launched with (21). A repository, a
     launch and a host may hold kinds of both formats, and flume reads
     each kind's format as the family's format spells it (weir 94),
     never guessing it.
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
    filled in for the place and the stage, with each role's address its
    words may be for, its own stream's by the role alone and every other
    stream's whole, and the words its source gives for what that role
    answers (41, 193). It is the agent's one way to ask for what its
    stage needs: whoever answers the question decides whether it is a
    person's, and how it reaches them (69, 72). No prompt asks an agent
    to submit, merge or push its work (71).
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

30. Each start of a stage of a simple kind, each repetition of a
    repeating stage among them (140), starts exactly one fresh agent,
    working in the place. A place of a simple kind has at most one agent
    at any moment. flume never starts an agent while another of the
    place's is live, and never hands a stage an agent another stage or
    place started. A statechart kind's stage runs its sessions as its
    join says (175), each session one fresh agent of its own, and no
    agent is handed from one session, stage or place to another. A start
    that carries the conversation of its stage's earlier agent (49, 146)
    still starts one fresh agent, under its own identity, and carries
    nothing of another stage's or place's. It opens only while no
    process runs that conversation (207), so no two agents ever go on in
    one session.
31. flume never ends an agent that is not quiet, unless a caller forced
    it. An agent whose state or own work flume cannot read is not quiet,
    and status names what flume cannot read; an agent whose profile
    reads no own work of its program's is read as 171 says. An end flume asked for that
    the agent did not take is reported as a failure, never as done.
32. An agent's program, model, effort (197), mode, instructions, own
    settings (195) and time kept open (198) are resolved when it starts,
    each from the first of these that gives it:
    1. the launch's settings (7);
    2. the host's configuration, for the place's repository, for its
       kind and then for every kind, for the model, the effort, the
       mode, the instructions, own settings and the time kept open
       alone;
    3. the host's configuration, for the kind, for the same alone;
    4. the host's configuration, for the place's stream (143), for the
       same alone;
    5. the host's configuration, for every agent on the host, for the
       same alone;
    6. the repository's settings, for a kind it does not declare, given
       to whichever declaration the kind's name resolves to (19),
       flume's own among them, and then for every kind it runs, its own
       among them;
    7. the kind's declaration, the repository's own where it is the one
       the name resolves to (23);
    8. flume's own default, which names a program only for an agent
       with no pool (173), and keeps an agent open one hour (198).

    Within each, a stage's own setting comes before one given for every
    stage of the kind, and that before one a repository's layer gives
    for every kind. The host's settings for a stream and for every
    agent name no stage, and neither does either layer's word for every
    kind a repository runs. Each setting is taken whole from the first that gives it,
    and each top-level key of a program's own settings is a setting of
    its own, a layer's named file beneath that layer's own keys (195).
    Its environment is the account's chosen for it from
    its pool (145), and nothing else gives one: no layer above names a
    variable, and an agent with no pool runs under the login
    environment alone (29, 144). The launch's settings, the
    repository's and the kind's are those the launch read (8, 20, 21);
    the host's configuration, its accounts among it, is read as it
    stands at the start, its local layer over its managed one (C.7), so
    a start after a change to either takes the change, and an agent
    already started keeps what it started with.
    The repository's settings and its kinds' carry nothing of one host:
    no environment, no stream, no pool, no account and no time an agent
    is kept open, and a kind's
    declaration names a program by its name alone, never by a location
    on a host (144). Where in the terminal an agent runs (107) is read
    from the launch's settings and the stage's declaration, else from
    its place's stream, by its kind and its stage (143, 199). A
    program resolved at a later start that no agent profile binds, or
    that the host's terminal cannot run, or an account's value naming a
    variable the login environment lacks (29), leaves the stage
    refused, naming the program or the variable and where it came from,
    and starts no agent, until a retry (27); so does a mode its
    program's profile has no setting for, a model it names no way to
    give, an effort it does not take, a stage that delivers a plan on a
    program whose profile offers no plan, or a pool that holds no
    account that can run the stage, naming the pool and the stage's
    program where its layers resolve one (145, 162, 164, 169, 172,
    197); and so does a host's own
    setting changed since the launch that its program's profile reserves,
    shaped as a credential, in a file that cannot be read, or that its
    program cannot take, in the words 4 gives (195). Status reports each
    setting and each variable with the agent and where it came from, an
    own setting's named file among it, and the agent program's own
    configuration on the host never chooses one, but the mode where no
    layer gives one (162) and the own settings no layer gives (195).
33. Every agent carries an identity flume gives it, which names its
    repository, its place, its stage and which start of the stage it is,
    and, for a session of a statechart kind's stage, which session
    (175), and which no other live agent on the host carries.
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
    where its program offers them (116, 115), or, where its profile
    reads no such word of its program's, its launcher's word and the
    terminal's reading of the process the launcher became (171); until
    that word the start
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
     conversation with the operator wants. Where the settings name no
     place in the terminal, the agent runs in its place's stream's own:
     the session the stream names for the place's kind's stage, else
     for its kind (199), else the one the host's configuration names for
     the stream, else one named by the stream's name, so every agent of
     a stream is found in the stream's sessions and a person opens each
     by its name. A place in
     the host's default stream runs in flume's own where its stream
     names none for it (143). flume opens,
     sends to and closes every agent's terminal, and no caller does any
     of them itself.
186. A person may ask flume to show them a stream's agents, one
     session at a time, by the session's name: the stream's own part of
     its terminal (107, 190), or a session the stream names for a kind or
     one stage of a kind (199). What a person opens is a session, never a
     stream: a stream's own session bears the stream's name where the
     host names none for it, so a person opens it by that name, and asked
     for no name flume shows the host's default stream's own. The
     session is started first where it does not run, so the agents its
     places open later appear there too. It is shown in the view the
     host's configuration names for the session's stream, else the
     host's, else a window. In a window, the window program named for the stream, else
     the host's, runs nothing but the terminal's own view of that part.
     Its title, for the stream's own session, is the one the host's
     configuration declares for the stream, else the stream's name, and,
     for a session the stream names for a kind or a stage, that
     session's name, so a window manager can file it.
     Where no window program is named, the person is given the view's
     command to run where they like. In the terminal's own
     app, the app is told to show that part, and titles its own window.
     The view and the window program are each the stream's where it
     names one and the host's otherwise, so a person tries a view on one
     stream while the others open as they did. The window is the
     person's: flume keeps, reads, finds
     again and closes nothing of it, opens one only at a person's
     asking, never at a launch, a settle or a start, and opens a second
     at a second asking; neither the window nor the view in it is a
     process of flume's (120). A name that is no session a stream's
     word gives is refused naming each stream's sessions, and a session
     two streams' own words give is refused naming both, each before
     anything is started; and a terminal that holds no part a person can be shown, or offers
     no such view, refuses in its own words (4).
190. Each stream's agents run in a terminal of the stream's own: the one
     the host's configuration names for the stream, else the host's,
     whose parts the sessions the stream names for its kinds and their
     stages are (199).
     It is read at each start, as where in it the agent runs is (107). So a
     host runs streams under different terminals side by side, and a
     person tries a terminal on one stream while the others run as they
     did. An agent stays in the terminal it opened in: flume sends to
     it, reads it and closes it there for as long as it lives. A place
     is tidied in every terminal its agents opened in, whatever the
     configuration names by then (137). A recipient is reached in the
     terminal that names its session (7, 43). A stream whose terminal
     is one flume carries no profile for refuses its launches, its
     starts and its views, naming it, and nothing else (4). Status gives
     each stream's terminal and each agent's, with where it came from
     (56).
199. A stream may name, for a kind, the session of its terminal that
     kind's agents run in, and, for one stage of a kind, the one that
     stage's agents run in. So a host keeps a stream's research and
     design apart from its construction in the terminal. Every place of the stream keeps the
     stream's bound, priority, pool, points, pace and labels alike (70,
     143, 180 to 182). Where the settings name no place in the terminal,
     a stage's agent runs in the session its stream names for its kind's
     stage, else for its kind, else in the stream's own (107). A kind is
     named there by its name, whatever source and version it resolves
     to, as the host's configuration names a kind for a stream or a
     label (19, 143, 180), and a stage by its name in that kind. The host
     names nothing else there: no repository, label, stage of every kind
     or terminal. A session a stream names for a kind or a stage is that
     stream's alone: one another stream's agents run in by that stream's
     word, its own or one it names for a kind or a stage, refuses the
     starts that read it, naming both streams, until the configuration
     is mended (4). The
     session is read at each start from the configuration as it stands
     (32). A change to it takes the next start, and an agent already
     started stays in the session it opened in (190). A session named
     for a kind or a stage the place does not run is ignored. A start
     that reads a stream's table for its kind or its stage holding any
     key but the session and a kind's stages is refused naming the key,
     until the configuration is mended (4). A person opens such a
     session by its name, and is shown it as the stream's own is (186).
     Status gives each session a stream names, with the kinds and stages
     it names it for (56). It gives each agent's session with where it
     came from: the launch, the stream's word for its kind's stage or for
     its kind, the stream's own session, the stream's name, or flume's
     own.
108. An agent never submits, merges or pushes its place's branch. flume
     refuses each such act wherever the agent program lets it, and
     status reports the refusal. A submission that gets past the refusal
     is read as any other of the place's own branch (63).
144. A pool names accounts in order, a strategy, fill-first, least-busy
     or most-left (145), and a threshold (185). An account is an agent
     program and the environment it runs under, which signs it in to an
     allowance of its own, and may state how many agents run on it at
     once. An account's reading is what its program reports (184). Accounts exist only in
     pools. A stage's agent runs under an account of its
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
     resolve, or, where they resolve none, that cannot run the stage
     (173), is not usable for that stage (145).
145. At each start of a stage whose agent has a pool, flume chooses the
     account. An account is usable while it is not spent (146), is not
     past its threshold (185), and has room under the bound it states.
     The account of the intent's affinity for the stage's program (147)
     is taken while it is usable. Otherwise, under fill-first, the first
     usable account in the pool's order; under least-busy, the usable
     account with the fewest of flume's agents running, equals in the
     pool's order; under most-left, the usable account with the most
     left by a fresh reading (184), what an account has left being the
     least that any of its windows leaves, then each usable account with
     no fresh reading, equals in either by the fewest of flume's agents
     running and then in the pool's order. With none usable the stage
     waits for room (70) until one is, and status gives the soonest time
     an account of the pool is neither spent nor past its threshold. A
     stage waits so only while its pool holds an account that can run
     it, spent or without room: one of the program its layers resolve, or, where they
     resolve none, one whose program can run it (144, 173). Where the
     pool holds none, no wait would end, and the stage is refused as 32
     says, naming the pool and the stage's program. The account is chosen
     under the same lock as the room, so two starts never take an
     account's last room between them. A start that carries a lost
     conversation (49) takes the account its lost start ran under first,
     while that account is usable and of the stage's program. That
     account's configuration holds the conversation, and taking it moves
     no intent's affinity (147). Status gives the account with the agent,
     and whether it came from the affinity, the strategy or the
     conversation it carries (56).
146. Where an agent's own record says the account it runs under reached
     a usage limit (151), flume records the account spent until the time
     the record names for the limit to reset, or for an hour where it
     names none its profile reads, in the host's own documents (153), so
     every flume process on the host honours it; flume never asks an
     agent program or its maker whether a limit has reset. A spent
     account is skipped by every start until that time. While it is
     spent for that hour, status gives the words the record gave, so a
     reset the profile could not read is seen (56). An agent so stopped
     is ended once quiet (31), and its stage starts again under a usable
     account of the pool, or waits for one (145): a start of the stage
     (33) that counts toward no bound of the kind's (112) and waits on no
     caller's word. Where the agent's program can carry the stopped
     agent's conversation to the account chosen (179), that start
     carries it, and its agent goes on with the conversation where it
     stopped. Its prompt is then flume's own words alone and the way to
     stop short (28). The words say that its last turn stopped at its
     account's usage limit and that it goes on under an account of its
     pool. Otherwise the stage starts afresh, its prompt with flume's
     own words: that the stage's earlier agent stopped at its account's
     usage limit, and that what it committed and left is in the place;
     then the words the earlier start was given and each answer it took
     in its session (42), so none is lost.
     A start that carries a conversation is not delivered where it is
     never begun (35) or its agent is not the stage's (161): flume ends
     its agent once quiet and starts the stage afresh at once. flume
     copies nothing of one account to another, and changes nothing of
     either. Status says whether the new start carries the conversation
     or, where it does not, why; where the stage moved, from which
     account to which and why; and that the new agent starts with
     nothing the earlier account's prompt cache held (56). A stage whose
     agent ran under no account is read as 43 reads it, with the agent's
     last words.
147. A place serves the intent its launch names, or, where it names
     none, the intent of its repository and base. flume keeps each
     intent's affinity in the host's own documents (153): the stream
     the intent's first agent started in, and, for each agent program
     its agents run, the account the first of them on that program
     started on. Every later start of an agent of a place serving the
     intent, but one that carries a lost conversation (145), is on the
     account of its affinity for the stage's program
     while that account is usable, or, where no layer of 32 names the
     stage's program (173), on the account of its affinity for the
     program its last agent ran, while that account can run the stage;
     and a later place launched for the intent runs in its stream unless
     its launch names another (143). A start on one program leaves the
     intent's account for every other program as it was, and is no move
     of the intent. When the account is spent, is past its threshold
     (185) or has no room, the start goes where 145 chooses and the
     affinity for its program moves with it, and status says the intent
     moved, for which program, from which account to which and why, and
     that its agents on that program start with nothing the earlier
     account's prompt cache held (56). An affinity goes an hour after
     the last place serving its intent is gone.
184. An account's reading is the usage windows its agent program last
     reported for it in a session flume started: for each window, how
     much of it is used and when it resets, which the program gives the
     agent seam as `windows` (211). In each such session, flume's own
     part of the program takes the windows whenever the program says one
     moved, and records them, with when it took them, as the reading of
     the account that start runs under, in the host's own document of
     the account (153), a later reading replacing an earlier one. flume
     reads it at each choice of an account (145) and when status is
     asked (56). flume asks no agent program or its maker how much of an
     allowance is left, reads no account's sign-in, fetches nothing
     (146), and reads no file a host writes for it: the host writes no
     reading. A reading is fresh for fifteen minutes from when flume took
     it. A window whose reset has passed reads as nothing used. An
     account flume runs no agent on keeps its last reading as it ages,
     and one no session of flume's ever reported for has none; a program
     whose profile gives no windows gives its accounts none, which status
     says, and none refuses a start or fails a settle. (flume records
     0055, accepted by the user 2026-11-06, and 0062, accepted by the
     user 2026-11-09)
185. A pool's threshold is a share of a window, a whole percent from 1
     to 100, ninety where the pool states none (C.7). An account whose reading gives any of
     its windows used to the threshold or past it is past its
     threshold until that window resets, however old the reading,
     since a window's use only grows until it resets; where the window
     names no reset, only while the reading is fresh (184). An account
     past its threshold takes no new start under any strategy, the
     intent's affinity's among them (145, 147). Its agents running go
     on where they are, and none is ended or moved for it (31): one
     whose turn stops at the account's usage limit moves as 146 says.
     flume changes nothing of the account's sign-in, and copies, links
     and writes nothing of its environment's (146). A reading never
     shortens or lengthens a spent account's pause, which the agent's
     own record set (146), and flume keeps a reading in the account's
     own document alone (153, 184). Status gives each account's reading,
     each window with its use and its reset, when it was taken and from
     which agent's session, and
     whether it is fresh, or why there is none, and, while the account
     is past its threshold, which window holds it and until when (56).
161. At each start flume records what its agent is to run under: its
     program, its mode where its settings give one (162), its account,
     the conversation it carries where it carries one (49, 146, 179),
     and, for each variable its settings and flume
     give its environment (32, C.4), a digest of the variable's name and
     value keyed by the start's secret, never the value. The agent's
     word that it started (35) is taken only where its program, its
     variables and the conversation it carries, where it carries one,
     match that record. Its mode is compared where its
     profile reads it back: at that word, or at the start's first prompt
     where the program gives its mode only with a prompt it takes. That
     prompt is then taken only where the mode matches, so the agent
     takes no turn in another (169, C.4). An agent whose word shows
     another program, another conversation, or a variable missing or
     with another value, is not the stage's agent, nor is one whose first prompt shows another
     mode. A terminal that brings a pane back without its environment,
     or a person who starts the program again by hand, leaves such an
     agent. flume sends it nothing more, ends it once quiet (31) and
     starts the stage afresh under the settings resolved then, with no
     caller's word and counting toward no bound of the kind's (112). Its
     prompt carries the earlier start's words and answers as 146 says.
     Status says so, naming the mode it started in and each variable
     that differed by its name alone (56). A fresh start that differs again is never
     begun (35), naming the same.
162. An agent's mode is one of its settings (32): how far it may act in
     its place without asking a person, one of flume's four or a value
     of one program's own under that program's name (169). Every layer of 32 may give it, the launch's, the host's, the
     repository's and the kind's, for every stage or for one; a mode
     names nothing a host owns (158), and a host that wants no
     repository or kind to set its agents' reach states the mode in its
     own layers, which come before theirs. Where no layer gives a mode,
     flume gives the agent none, and the account's own configuration of
     its program decides, as it decides everything else flume does not
     give (144). flume's own kinds give their stages' agents `full`, in
     the kind's layer, the last (22; flume record 0064, accepted by the
     user 2026-11-09). A stage that delivers a plan starts its agent in its
     program's planning mode whatever the layers give, and status names
     the stage's deliverable as where that mode came from (163). The
     mode is read at the agent's start, as the rest of its settings are,
     and is what its start records (161), so an agent whose program
     began in another mode, as when the account's configuration refuses
     the one asked, is not the stage's agent. What the agent's mode lets
     it do never widens what flume answers for it (34).
169. A mode is one of flume's four, which mean the same for every
     program: **plan**, which reads the place and changes nothing in it,
     putting its plan for review where its program can (164); **ask**,
     which reads without asking and asks a person before each change to
     a file and each command that is not a read; **edits**, which
     changes files in its place without asking and asks before any
     command that reaches beyond them; and **full**, which acts without
     asking. Each agent profile maps each mode to the setting of its
     program that means it, no wider and no narrower (C.4); where its
     program has none, the profile refuses the mode, naming it and the
     program, so the launch is refused (4), or, at a later start, the
     stage (32). No profile gives its program a wider or a narrower
     setting than the mode. A layer may give, in place of one mode, a
     table of programs, each entry one of the four or a value of that
     program's own that its profile names, as Claude Code's `auto`; the
     table is taken whole from its layer, an agent's entry is its
     program's, and a program the table names no entry for is refused
     as an unmapped mode is, never passing to a later layer. A start
     records the mode as its profile passes it (161), and compares it
     only where the profile reads back the mode its program began in, at
     the start's word or its first prompt (161); status says where it was
     not read back. flume answers no question
     an agent in ask or edits puts (34): such an agent waits asking
     until a person answers it (90). `plan` given to a stage that
     delivers neither a plan nor a conversation refuses the launch,
     since its deliverable could not be written (4).
170. flume runs every agent program the host's terminal can start. Each
     is bound by an agent profile (105): its own, where flume carries
     one, and otherwise the common profile. Each profile's entry for its
     program, its name, the terminal's kind for it, how it is given a
     model, how it is given an effort and the words it takes, and its
     map of modes, is flume's own and checked against the release the
     profile pins (106); an entry may hold only the program's name and
     kind, and then refuses a model, an effort and a mode. Each
     part of the agent seam is built for the program, answered from its
     own record, or degraded as its profile declares (174); status names
     each degraded part with the agent and how it is read, no degraded
     part is read as a built one, and none is read from the terminal
     where the program's profile builds it.
171. Where a program's profile answers a part from no record of the
     program's own, flume reads it so:
     1. started: the start's launcher, flume's own command, run in the
        place under the start's identity and secret before the program,
        compares the start's record with its own environment and the
        program it is to run, as an agent's word would (161), records
        its word with its process, and becomes the program in that
        process; the agent has said it started once the launcher
        recorded that nothing differed and the terminal reads that
        process running the program and ready for input (35). A program
        in the place's pane in any other process is not that start's
        agent;
     2. received: the terminal's word that it saw the turn the sending
        began, working or asking, within the 60 seconds of 38, and not
        received without it (89);
     3. asking: the terminal's reading that the agent waits on a
        question (90);
     4. own work: none once the terminal has read the agent waiting at
        two settles a minute or more apart, and running until then (31,
        91);
     5. ended and last words: the terminal's stopped, and what it shows
        (134, 43, 136);
     6. spent, usage and windows: unknown (146, 151, 152, 211);
     7. send-back, guard and on-quiet: not offered (115, 116, 121), the
        host's watch settling the place, or a command that acts where
        none is kept (119, 208);
     8. plan: not offered (164);
     9. the mode: recorded and not compared (169);
     10. carry: not offered, so a stage whose agent stopped at its
         account's usage limit starts afresh (146, 179);
     11. own settings: no key reserved, and none taken, so own settings
         given for the program refuse the launch, or the stage at a
         later start, until its entry names its release's way (195,
         196).

     Stop-short is the same for every program (92); a program that
     keeps its start's identity and secret from the commands it runs
     cannot stop short, which status says.
172. An agent's model is its program's own name for a model, passed to
     its program as written; flume maps no model's name from one
     program to another. A layer may give, in place of one name, a table
     of programs, taken whole as a mode's is (169). A program whose
     profile names no way to give it a model at its start refuses a
     model given, naming the program: the launch is refused (4), or, at
     a later start, the stage (32).
197. An agent's effort is one of its settings (32): how hard its
     program's model works on each turn, in its program's own word,
     passed to its program at its start as its profile takes it (88);
     flume maps no effort from one program to another and has no scale
     of its own. A layer may give, in place of one word, a table of
     programs, taken whole as a model's is (172). Each profile takes the
     words its program takes, read from the release it pins (170); a
     word its program's profile does not take, or an effort for a
     program whose profile names no way to give one, is refused, naming
     the effort, the program, the stage and where it came from: the
     launch is refused (4), or, at a later start, the stage (32). Where
     no layer gives an effort, flume gives the agent none, and the
     account's own configuration of its program decides (144). Status
     gives the effort with the agent, where it came from and as it was
     passed, never read back, since the program may lower it to what
     the model offers; and where the account's environment names a
     variable its program reads over the effort, status says so,
     naming the variable and never its value (29, 56).
173. Where no layer of 32 names a stage's program and its agent has a
     pool, the account chosen names it (145): the pool's accounts usable
     for the stage are those whose program can run it, its mode mapped
     (169), its model given or none needed (172), its effort taken or
     none given (197), the own settings given
     for that program taken or none given (196), and, for a stage that
     delivers a plan, the plan offered (164). Where there is no pool,
     flume's own default names the program.
195. An agent's own settings are one of its settings (32): a table of
     programs, each entry naming, for its program, a settings file in
     the program's own words and keys given as the program spells them,
     its status line, its renderer, hooks, tools' permissions or what
     its commits and pull requests say about who made them among them.
     Every layer of 32 may give them. A layer's file is read where the
     layer lives: the host's on the host at each start, the
     repository's and the kind's within their repository or package at
     the launch, and the launch's at the launch (21, 157). The file's
     keys lie beneath the layer's own. Each top-level key is a setting
     of its own, taken whole from the first layer that gives it, and
     only the agent's program's entry is taken, so no program is given
     another's. flume reads nothing inside a value, merges no two
     layers' values of one key, reads no `~` or variable in one, never
     passes a named file as it stands, and passes the keys resolved as
     the agent's profile takes them (196), its program laying them over
     its account's configuration as it lays its own. Where no layer
     gives the agent's program a key, flume passes none and the
     account's configuration decides (144). A key the profile names as
     another setting's or the account's, the environment, the model, the
     effort, the mode, a sign-in, the hooks flume's start rests on or a person's
     acceptance of a warning (34), is refused where a layer writes it
     and left out of a named file, naming the key and what owns it. A
     value shaped as a credential is refused before anything holds it,
     naming the key and never the value (29), and so is an entry for a
     program whose profile takes none. The launch is refused so (4), or,
     at a later start, the stage (32). Status gives each key with the
     agent, its layer and its file, and each key left out with its owner
     (56).

### A.5 Prompts

37. flume sends a stage's prompt only once its agent has said it
    started (35) and is waiting, and never into a question the agent
    has put to a person.
38. A prompt is received or sent again. flume reads, within 60 seconds
    of each sending, whether the agent received it, from the agent's
    own word that it received that prompt where its program gives one,
    and otherwise from its own record, or, where its profile reads no
    record of its program's, from the terminal as 171 says. Where the
    terminal
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
     check, never reports it stuck, and never ends it on its own;
     hibernating one whose kind hibernates it ends its agent and keeps
     the conversation (212). A
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
     - a **message** of its notes (53), which reaches the live agent, still
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
     with its notes rather than messaging them. flume never accepts a plan
     on its own and never judges one: whether a plan is good, and who
     reads it, are the caller's.
41. An agent stops short by saying so to flume, with its words, and
    saying which it does: it needs an answer before its stage can
    deliver, or it found work a stage before its own must do again
    (131). It may name the role its words are for, of any stream, by the
    role's address, and a role of the place's own stream by the role
    alone (132, 193). Either is a role a source of the host declares
    with words of what it answers. The stop-short's end then goes to
    that address and not to the place's recipients. A name that is none
    of those is refused, naming them. flume
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
    else exists. Its place waits for its answer or a drop, and the
    agent's words reach the place's recipients, and status, whole and as
    the agent wrote them. The answer, whoever gives it and however it
    reached the caller, is a retry naming the stage with the answer as
    its words (49), or a message (53). While the stage's agent is kept open
    (198), flume hands it the question and the answer as a message is
    handed (54) and records them on the stop-short they answer. The
    stage then carries on in that session under the same start, begun
    again, starting and ending no agent and counting no start (48).
    Otherwise
    the answer is a retry, and the fresh agent's prompt carries the
    question with the answer. Every answer is recorded on the stop-short
    it answers, with who gave it and when. An answer, a retry's or a
    message's, may name the stop-short's key. flume then takes it only
    while the place waits on that stop-short, so a question is answered
    once, whether its answer reaches the agent kept open or a fresh one.
    Where the stage's agent hibernates (212), the answer resumes its
    session as 213 says.
    A second answer, or one that comes after the place moved on, is
    refused naming the answer taken, who gave it and when (49, 53). A
    stage that ended short having found work is sent back as 131 says.
198. An agent that stops short needing an answer is kept open for it
     where its terminal delivers text to a running agent (95), and
     otherwise is not. It is kept open from its stop-short for the time
     its settings give (32), one hour where none gives one, the life of
     its program's prompt cache. That time is flume's own, the same for
     every program and passed to none. It is written `<n>`, `<n>s`,
     `<n>m` or `<n>h`, and `0` keeps no agent open. The launch's settings
     and the host's configuration give it. An agent kept open stays
     live, holding its room and its account (70, 145), and an answer
     that comes then reaches its session (42). It is let go once its
     time has passed, but where its stage hibernates (212) it is
     hibernated then instead, and its answer resumes its session (213).
     It is let go sooner once it is read stopped or its own record says
     its session ended (96, 134), as a restart of the
     host or its terminal leaves it. A conversation's agent so let go
     is carried at its answer's retry (49), and one its terminal brought
     back bare is left in its pane (77). So it is once its account is spent
     (146). A settle reads it let go and records when and why.
     No process of flume's waits for the time (120). Once it is quiet,
     flume ends it (31), freeing its room and its account. The stage
     keeps waiting on its answer (42, 130). A
     stage carried on after its answer is a running stage: its stop
     check, its quiet limit and working past it hold from the answer's
     receipt (44, 110, 118), and its next stop-short is an end of its
     own (43), its agent kept open again.
43. A stage reported lost (45), a prompt never begun (38) and a stage
    reported stuck (44) are ends as a stage's end is, delivered so,
    with what flume read: the agent's last words as its own record
    holds them, the commits on the place's branch since the start,
    for a prompt never begun, what the terminal shows of the agent, and,
    for a conversation lost, whether flume left in its pane an agent the
    terminal brought back (77). A notice of an end is sent into a recipient's
    pane only while it asks no question (37), and otherwise is not sent;
    it is a hand-over, recorded on the terminal's answer with no reading
    back, and the end stays pending for that recipient until it
    confirms it. A notice names the place, the first line of its brief,
    the end and its key, where to read the end whole, and the
    delivery's key by which to confirm it.
    A place's recipient learns a stage's end together with what was
    delivered, the head or the report, and the addresses of what it
    made (129), or with the agent's words, and a submission's outcome
    together with the commit it landed as, or with the merge queue's
    words. No caller needs to read a terminal to learn how a stage or a
    submission ended. Each end is one of weir's deliveries, owed to each
    of its recipients until that recipient confirms it (weir 100 to
    107): the settle that reads it (46) records it once, under its key,
    each of its recipients its readers and its notice its message, and
    hands it to each recipient once, as a notice into the recipient's
    own session at its next wait, by its agent profile's deliver part
    where its program offers one, which leaves what a person typed in
    its input untouched, and otherwise through the terminal into its
    pane (95, 215), where it was handed to that
    recipient by nothing before. A recipient
    named by a role's address is handed it in the pane of that role's
    live run, or of the standing agent its source declares for it (193).
    Where neither is there, the end stays pending, and wakes the
    role where the address has a kind and the end was never handed to
    it (132). Where the terminal has no
    pane to deliver to, the end is read from status (56). A wait is by place, naming its stage or its
    submission: it answers at once with an end pending for this
    recipient, handing it over, and otherwise follows the host's state under a timeout,
    exiting by the outcome or still waiting, driving no settle where a
    caller keeps watch (119, 208); so a caller whose session restarted
    waits again and loses nothing; an end this recipient has confirmed
    it answers as a read, handing nothing over. A caller
    that starts collects every end pending for it, of the places it
    launched or is recipient of, by `flume inbox`, which hands each
    over, and gives it again at every inbox until the recipient
    confirms it. A recipient confirms an end by `flume confirm`, naming
    the delivery's key, or in the wait or the inbox that hands it over,
    saying there that it confirms on receipt (weir 102, 103); flume
    takes a recipient's confirmation from the caller that names it, as
    it takes its inbox, and never confirms for one itself. An end still
    pending once the span the host's configuration sets has passed
    since it was read, a week where it sets none, is expired for that
    recipient: it stays pending, and status, the inbox and a wait show
    it expired, with its recipient, until it confirms it (weir 104). A
    recipient's name under which nothing was ever confirmed is shown as
    such wherever its ends are (weir 106). A recipient no pane holds is sent no
    notice: its ends stay pending until it collects them, by `flume
    inbox` or a wait as itself, so a tidied place's document stays for
    it to read (62). A caller that reads a place's ends from flume names
    itself a recipient so, by a name no pane holds, beside the others
    its launch names (7). A
    drop or a done (52, 114) is an end too, sent as no notice and waking
    no role: it stays pending for each recipient of the place that is
    no role's address, and for no one where every recipient is one. An
    inbox that names a place collects that place's ends alone, so its
    caller collects only what it read. With them it gives every place that waits on
    its caller for which the caller is a recipient, the role its
    stop-short named, or the answerer its stall went to, delivered or
    not. For each it gives the move and since when, the words, key and
    addressee of a stop-short it waits on, and a hold's words. So a
    caller that restarted sees each question still its own. That list,
    status and a read confirm nothing, and neither does a hand-over,
    a timeout or an expiry (weir I9).
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
     and the agent. The limit runs from the stage's beginning, the
     last answer its agent took in its session (42), or the place's last
     head move, whichever is later. flume never ends the
     agent on that account (31), and a conversation's agent is never so
     reported.
45. A stage whose agent stopped with nothing delivered and nothing said
    is reported lost. flume starts no agent for a lost stage on its own
    (48). A caller's retry of a conversation reported lost goes on with
    its agent's conversation (49).
46. A place moves on as soon as a settle reads that it may. A settle
    reads each stage's end, starts the stages waiting for room, as many
    as the host has room for and in priority order (70), and submits a
    place whose last stage delivered. It sends a place back when its
    submission fails, and tidies a place whose work is over (63). flume
    settles a place whenever its agent goes quiet (121), and every place
    on the host whenever a caller keeping watch settles (208). No
    terminal settles a place (122). Each settle reads the outcome of the place's
    open submission (111). Where the merge queue moves only while
    something drives it, the settle drives the place's base one round
    (124). Where no caller keeps watch, flume also settles whenever a
    command of flume's acts (119). Where a caller keeps watch, a place
    moves on within the watch's bound whether or not a caller asks and
    whether or not an agent is in it, and asking only shortens the wait.
    A submitted place's base is driven so at every depth of base places
    alike (202).
119. Where no caller keeps watch over the host (208), flume runs
     attended: every command of flume's that acts on places settles
     every place on its host before it acts. An agent that ended with no
     word from its program, a prompt never received and an agent working
     past its limit are then read only at such a command, since no
     terminal settles (38, 45, 118, 122). Status and a prompt's rendering
     settle nothing (29, 57). flume runs unattended only while a caller
     keeps watch, whatever terminals the host binds (190).
120. flume runs no process of its own between its commands. Every settle
     runs inside a command of flume's, started by an agent going quiet,
     by a caller keeping watch or by any other caller, and never by a
     terminal (122). No command of flume's waits on the merge queue: a
     submission's outcome is read at the settles that follow it (111,
     124).
208. A caller keeps watch over the host by settling every place on it
     on a bound it states to flume, as `flume settle --every <bound>`
     asks. flume keeps in the host's state when the newest such settle
     began and the bound it stated. A caller keeps watch while that
     settle began less than twice its bound ago, so a settle that runs
     as long as its bound keeps it still. The watch is the host's, never
     a terminal's or a place's: on a host that keeps the runner its
     passes keep it (section 9), and any caller of the host's own may,
     a timer among them. A caller keeping watch decides nothing of what
     a settle does (46). Status gives the host's watch, its bound and
     when it last settled, or that no caller keeps it and since when
     (56, 119).
47. A stage or a submission that waits on its caller's word, by the
    launch, by a hold the caller put after it (130), or, for a base
    place's submission, by its kind having no stages (203), starts only
    on a retry that names it (49).
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
     queue. A base place, which has no last stage, is submitted only
     as 203 says.
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
     retry or a drop, and status names why. A base place, whose kind
     names no stage to send it back to, waits on its caller after a
     failed submission as 203 says.
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
     submission does, where the fix round is a stage before the one
     that found; from any other stage, and from a last stage that is
     its kind's fix round, found work is taken as needing an answer
     (42), since no stage before it can do that work again. The
     stages after the fix round run again in order and the place is
     submitted again. A place's goings-back, by submission and by
     finding together, count toward the kind's bound (23), past which
     the place waits on its caller, said and delivered (130, 43). A
     stop-short that needs an answer waits on it, which is a retry (42, 49). So a unit's
     whole course, from its first stage to its landing, with its fixes
     on the way, runs with no agent of a caller's deciding between the
     steps; what a caller decides is what to launch, what to answer, and
     what to do with a place past its bound (70).
202. A branch that work lands on, and that itself lands on another, is
     a base place's: a place whose kind lands and has no stages (18). A
     base place has no worktree. It is its branch and the state flume
     holds of it. Its launch names its base as any launch does. flume
     asks the merge queue to make its branch at the base's current
     revision, as a branch the merge queue lands on (205), and makes
     nothing else. So it checks out nothing (10), and nothing the merge
     queue lands moves under it. Its head is its branch's revision where
     the merge queue's profile says the branch lives (126). A base place runs no agent and has nothing made ready
     (11). It takes no room and no points (70, 165), and is never stuck
     or lost. A launch whose base is a base place's branch makes a place
     cut there (9) that lands there (15), as on any base. A base place's
     own base may be a base place's branch too, at any depth. flume
     names no depth and no use of one: a base place is a kind's shape,
     never a kind flume knows by name.
203. A base place is submitted only on its caller's retry naming the
     submission (47, 49). The retry submits its branch from the
     repository, named by the branch, as the merge queue holds it (117).
     While a place whose base is its branch is live, the retry is
     refused, naming those places. Having no worktree, a base place has
     no inbox to deliver to (133): its submission's outcome is read from
     the merge queue's record of its branch (99), acted on once, and
     delivered to its recipients as any end is (43). A base place waits on the places on its branch while any is live.
     Once none is and it is not submitted, it waits on its caller, and
     may stall (130). While it so waits, unsubmitted or its submission
     failed, with no place on its branch being made or live, each settle
     forecasts its branch's head against its base through the merge
     queue (210; sluice 64). A conflict so forecast with the base
     itself, or a failed or conflicting submission of it, launches on its
     branch a place of the kind its kind names for its fixes, resolved at
     the base place's launch (23), named by the base place's name and the
     fix's number joined by `-`, in its stream, at its priority, serving
     the intent its launch named, delivering to its recipients, and with
     the merge queue's words as its brief; for a conflict, that fix takes
     in the revision the words name (112). A forecast that conflicts only
     with entries queued ahead of it launches nothing and is forecast
     again at the next settle. flume acts on each forecast, by its head
     and its base's revision, and on each submission once. While the fix
     is live no second is launched; each fix counts toward its kind's
     bound (23), one whose launch was refused among them, past which the
     base place waits on its caller, said and delivered (130, 43); a
     refused launch leaves it waiting on its caller with the refusal's
     words; and a kind that names no fix leaves it waiting on its caller
     with the merge queue's words. Its submission stays its caller's
     retry. (flume record 0056, accepted 2026-11-07, and its amendment of the same day.) The
     base place's landing makes its work over (63), and flume tidies it
     as 204 says.
204. A launch on a live place's branch is refused where that place is
     no base place, naming it (10). It is refused
     too where the base place's submission is open or its work is over
     (111, 63). A drop of a base
     place is refused while a place whose base is its branch is live,
     naming those places (52). A base place is tidied with no worktree
     to remove and no teardown to run (64 to 66): its branch goes by the
     merge queue's close into its base (206), never by flume's own
     removal, and its held state goes as any place's (62). A branch the merge queue
     keeps is named once, in the answer to the act that removed the
     place, as 67 names one, and a launch that would make it again is
     refused while it stands (3).

### A.8 Retries, stops, drops and dones

48. flume starts a stage again on its own only when a failed submission
    or a found sends the place back (112, 131), and never bounds how often a caller
    retries. Status gives how many times each stage has started and how
    many times flume submitted the place.
49. A retry starts the stage it names with a fresh agent and the
    retry's words in its prompt, the words of a stop-short the stage
    ended with standing before them, so the agent reads the question
    with its answer (42), and the stages after it then run again
    in order, as 40 and 47 allow; but a retry with words naming a stage
    whose agent is kept open for its answer (198), or hibernates waiting
    on it (212), is that answer, which reaches that session as 42 says,
    or resumes it as 213 says, and restarts no stage. A retry that
    names the submission
    submits the place's head again and starts no agent. A retry names
    any stage of the place's kind, one after the current stage among
    them, or the submission of a kind that lands. It never changes the
    place's kind, brief or base (8), and flume judges no order of stages
    but its own starts (40). A retry that names a stop-short's key is
    refused, naming the place, the answer the stop-short already took,
    who gave it and when, or the move the place waits on now, unless the
    place waits on that stop-short (42).
    A retry of a conversation's stage (109) reported lost (45), or
    whose agent kept open for its answer (198) was lost with its
    terminal or its host (77), goes on with the lost agent's
    conversation where its program can carry it (179). A process may still run that conversation: the lost agent
    its terminal brought back, or one a person started by hand. While
    one does, or while flume cannot read whether one does (207), the
    stage waits for it to end as a stage waits for room (70). flume takes no such process as
    the stage's agent (35, 161), sends it nothing and ends none of them,
    since a person may be talking in it, and status names each process
    (56). The first settle that reads none starts the stage, room
    allowing. Its start is one fresh agent under its own identity (30),
    resuming the lost agent's session. Its prompt is flume's words,
    then the retry's words, then the way to stop short (28). flume's
    words say that its session was lost and goes on here, and that what
    it had running then has stopped.
    The start takes the account the lost start ran under while that
    account is usable, and otherwise the account 145 chooses, waiting
    for one as 145 says, where that account reaches the conversation.
    Where no account it takes reaches the conversation, or its
    transcript is gone, the stage starts afresh with its prompt as for
    any retry. flume's words stand before the retry's there: its earlier
    agent was lost and its conversation could not be carried, and what
    it committed and left is in the place. A carried start
    never begun (35), or whose agent is not the stage's (161), is read
    as 146 reads one: flume ends its agent once it is quiet and starts
    the stage afresh at once. Status says which, and why (56). A
    retry of a stage that is not a conversation carries no conversation,
    and its agent starts from what the place holds. Such a stage's work
    is what its agents committed and left in the place. A lost agent
    stopped at no turn's end, so its conversation tells of work the
    place may no longer hold.
50. A retry ends the place's agent first, one that is not quiet only
    when forced (31), and is refused, naming the place, when the
    place's work is over. A retry that answers an agent kept open (42)
    ends no agent.
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

### A.9 Messages

53. A message hands the agent of a place's current stage its words as
    a prompt, or nothing at all; a message naming a role's address is a
    delivery to that role (214). A message to a place whose stage
    hibernates resumes it, its words the resumed agent's first prompt
    (213). A message to a place with no live agent and no hibernating
    stage, or whose agent is asking, is refused with nothing typed. So
    is a message to a place whose stage ended short needing an answer
    while its agent is neither kept open (198) nor hibernating (212),
    naming the retry that answers it. A message that answers an agent
    kept open or hibernating may name the stop-short's key, and is then
    refused as 49 says unless the place waits on that stop-short (42,
    198).
54. A message never interrupts a working agent: its words reach the
    agent only once it is waiting, by its agent profile's deliver part
    where its program offers one, and otherwise by the terminal (95,
    215). A message not delivered within the bound its caller gives, or
    within ten minutes where it gives none, is refused with nothing
    typed. A message delivered is received or sent again as a prompt is
    (38). An answer handed to an agent kept open (42) is delivered as a
    message is, within the same bound; one not delivered leaves the
    stage waiting on its answer, with nothing recorded.
55. A message never starts, ends, holds or moves a stage, never counts
    as a retry or a finish, and never stands for a deliverable. The
    exceptions are a message that answers an agent kept open (198),
    which carries the stage on in that session (42), and a message to a
    hibernating stage, which resumes it (213).

### A.10 Status

56. For every place on its host, status gives the place's repository,
    kind with its version and the declaration it came from, its name,
    branch, base with where its revision was read (C.1) and mark, and
    whether its kind lands; each stage's
    state, how it ended, and how many times it started; the current
    stage's agent, with its identity, its stream and its account each
    with where it came from (143, 145), its settings each with where it
    came from (32), its own settings each with its layer and its named
    file, and each key left out of a named file with its owner (195),
    its agent state, how much of its input its own
    record says was read from the prompt cache on its first request and
    over its session (152), whether it carries the conversation of
    the stage's agent before it, stopped at its account's usage limit
    or a conversation's reported lost, or why not (49, 146, 179),
    whether the terminal brought it back and flume left it in a lost
    conversation's pane (77), and
    whether it works past its limit (118); whether the current stage
    hibernates, and, of one hibernating, since when and why, its
    hibernate time with where it came from, and each resume, with what
    started it and whether it carried its conversation or why not (212,
    213); each move of a stage or an
    intent from one account to another, with why (146, 147); whether the current stage's
    deliverable exists; the place's submission as the merge queue holds
    it, and how many times flume submitted the place; its change's
    tasks and which are ticked; each act of an agent's that flume
    refused (108); the part a refused stage could not fill (27); the
    words of a stop-short, and whether it needs an answer or found work,
    and, for one needing an answer, whether its agent is kept open and
    until when, or when and why it was let go and whether it is ended
    (198), and each answer the stage's current start took in its
    session, with its question (42), or of a failed
    submission; each end's key, with its delivery's key, its expiry
    and, for each of its recipients, each hand-over of it, whether it is
    pending, expired or delivered and when, and whether the
    recipient's name is known (43; weir 104 to 106); for a stop-short, the role's address it
    named and each answer it took, with who gave it and when (42); the
    place's recipients, each with where it came from; of a place
    waiting on its caller, the move it waits on, since when, a hold's
    words, a hold on the waiting move with its bound or that it lapsed,
    and whether it is stalled (130); the place's points, and
    beside them the time its newest submission spent in the merge queue
    and the time its checks ran (165, 168); for a base place, the kind
    its fixes run as with where it came from, the newest forecast a
    settle read of its branch, when and what it found, and each fix
    flume launched for it, why and how it ended; for a place flume
    launched as a base place's fix, that base place (203) (flume record 0056's amendment of 2026-11-07.); a stage for review's plan
    with where it lives (163); for the host and for each of
    its streams, its agents running, the bound it states, its room, its
    points queued and in flight, and
    the places waiting for room in the order they would start, each with
    its stream, its priority, its points and since when (70, 143), and,
    for one waiting for its conversation to end elsewhere, each process
    that runs it (49, 207); for
    each stream, its answerer with the source that declares it, or that
    it has none (193), its points bound, its pace with the points
    started in its span and when the next of them leaves it, and the
    tokens its
    agents' own records gave (166 to 168); and for each
    pool, its strategy and its threshold, and its accounts, each with
    its agents running, while spent, until when (146), and its reading
    as 185 says; each source the host declares, the kinds it holds by
    identity and the roles it declares, or why they cannot be read (191,
    193); for each role's address an end stands pending for, its
    run, its standing agent, or that it is carried or wakes nothing and
    why (132), and, for a standing role, its place, whether it
    hibernates, the deliveries pending at its address, and each place
    whose work is not over that reports to its address (214); and each end expired for a recipient, of every place,
    with the recipient and whether its name is known (43; weir 104,
    106).
130. A place whose next move is its caller's, a stage or a submission on
     hold (47), a stage ended short needing an answer (42), a stage for
     review (163), a stage
     reported lost (45), a prompt never begun (38), a readiness that failed (12),
     or a kind's last stage delivered where the kind does not land
     (114), waits on that move from the moment flume read it so, and
     status says which move and since when, and, for an answer, whether
     the stage's agent is kept open for it and until when (198); an
     agent let go leaves the move and its since as they were. A caller may put a place's
     next stage or its submission on hold after the launch, with its
     words saying what for, which status gives with the hold's since
     when; a retry naming the stage or the submission ends the hold (47,
     49). A caller may also hold the move the place waits on it for,
     with words saying who makes it and how, such as a role that took
     the question or an answer asked of a person, and a bound after
     which the hold lapses; a later hold on that move replaces it, and a
     retry naming the stage or the submission ends it as the move made.
     A place waiting on its caller under no hold's words for five
     minutes, or for the launch's bound where it sets one, is stalled:
     status says so, and each recipient of the place, the role a
     stop-short it waits on named (41), and the answerer behind the
     place's own stream where it is none of them, is delivered once that
     it is stalled, which move is theirs, and the words, key and
     addressee of the stop-short it waits on (43, 193). A hold on the
     waiting move whose bound passed is no hold from then, and the place
     stalls again. A hold's words are the
     caller's to make good: the event they wait for is the caller's to
     see, and flume watches none and ends no hold itself, but lapses a
     hold on the waiting move once its bound passes (70, 72). A
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
200. A caller may ask flume for its list, which says at a glance what
     flume holds and what a person can open. It gives a line for each
     place on the host that has not landed and was not dropped (63),
     under the place's repository. A place that landed or was dropped
     has nothing left to open, so its line is given only when the
     caller asks for every place, a place tidied whose document stays
     among them then (62). The line gives the place's
     kind and name, the stage it stands at, and its state in the words
     status gives it (56, 139). It names whom a waiting place waits on,
     its caller (130), the host (70) or the merge queue (111). A place
     whose work is over may still stand, and its line then names in a
     word what keeps it: the step its teardown failed at,
     what it holds, its live agent, or that flume cannot read it (64
     to 66, 68). The list gives a line for each stream the host
     declares, with each of its sessions, its own (107) and each it
     names for a kind or a stage (199), and whether each runs now (201).
     The sessions are what a person opens, each by its name (186). The list is read from flume's held state, each live
     agent's own record, and each stream's terminal once, so it answers
     at once however many places stand. It reads no place's worktree,
     branch, deliverable, change or submission, and no agent's state
     in its terminal. It gives none of a place's long words, a
     stop-short's, a hold's, a failure's or a teardown's, which status
     gives of the place. Asking for it settles nothing, starts nothing,
     sends nothing and writes nothing (57).
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
    worktree and no branch, which goes once every end is delivered to
    each of its recipients (weir 107). A drop of it while an end stands
    pending is refused, naming each recipient the end waits on, since
    nothing a recipient has not confirmed is let go of (weir I9). Once
    the document goes flume lets go of its ends' deliveries, and keeps
    each recipient's name known (weir 106, 107); whatever else outlives a place is its caller's
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
    make, the repository's main worktree, a worktree whose agent is
    live, or one in which a process runs its conversation's session
    (207), which it keeps and names until the process ends.
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
    launch that would make it again is refused while it stands (3). A
    base place's branch goes as 204 says.
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
    bound, its stream's agents running are under the stream's less what
    the stream's other labels hold reserved and do not use (181), and an
    account of its pool is usable (145), and, for a place's first start,
    its stream's points bound and pace leave room for its points (166,
    167); otherwise it waits for room, a
    wait that is the host's and never its caller's (130). When a settle
    finds room it starts the stages waiting for it, streams of higher
    priority first and, within a stream, the places of a label below
    what it is owed first (181), then places of higher priority
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
     flight (166), a pace (167), the terminal its agents run in, the
     host's where it states none (190), where in that terminal they
     run, its own name where it states none (107), and, for a kind or
     one stage of a kind, the session of that terminal its agents run in
     instead (199),
     the view a person is
     shown them in and the window program that opens it, each the
     host's where it states none, and the title of a window that shows
     them, its own name where it states none (186). The configuration
     names a repository by its address, `<owner>/<name>` as its clone's
     `origin` remote gives it on its forge, matched exactly, and a
     repository whose clone has no forge origin by its folder; flume
     asks no other tool where a repository is (C.7). (flume record 0055, accepted by the user 2026-11-06) A place's stream is the one its launch names, else the
     stream of the intent it serves (147), else the one the host's
     configuration names for its repository and kind, for its
     repository, or for its kind, in that order, else the host's default
     stream, which holds every place nothing names a stream for. A
     launch naming a stream the host's configuration does not declare
     is refused naming it (4). The host's bound caps every stream's
     agents together, and a stream that states no bound of its own is
     held by the host's alone (70). A stream's pool comes before the
     host's own (144), and a stream's agents take the settings the host's
     configuration gives for the stream (32);
     the host's bound is the host's alone, and its terminal, view and
     window program stand for each stream that names none (186, 190);
     the runs it wakes for roles are its sources', each in the stream its
     address names, with that stream's room, pool and settings (132,
     193). A caller names a stream by
     its name, and the name is all a caller needs of a stream. Status
     gives each place's stream and where it came from (56). A stream
     shares its agents among its places' labels (180, 181), and its
     pool, its points bound and its pace are the one budget its labels
     draw on (182).
180. A kind may declare its label, one word, and a host's configuration
     may give a kind another, for its repository and kind or for its
     kind, in that order, as it gives a stream (143). A place's label is
     the one the host's configuration gives its kind, else its kind's
     own, else none, read at each start from the configuration as it
     stands (32), so a change to it takes the next start and an agent
     already started keeps its share. A label is the kind's word and
     the host's, never flume's: flume gives it no meaning but its share
     of its stream's agents (181), its own kinds declare none, so a host
     gives them theirs, and a label names nothing a host owns (158). A
     place of no label shares the agents no label is owed. Status gives
     each place's label and where it came from (56), and a caller may
     read it for its own use, as a control plane shows a role under the
     column its label names; flume gives it no meaning of its own
     (flume record 0065, proposed).
181. A stream may state, for each label, how many of the stream's
     agents its places are owed, `owed`, and how many of those are held
     for it alone, `reserved`, each a whole number of agents from zero.
     Within the stream, a stage of a label running fewer agents than it
     is owed starts before every stage of a label that runs what it is
     owed or more, whatever their places' priorities, so an agent lent
     while its label had nothing waiting is its own again at the next
     agent to end, and no agent running is ended for it (70). A stage
     starts only while its stream's room passes what the stream's other
     labels hold reserved and do not use, so an agent held reserved
     stays empty for its own label's next stage and is never lent. A
     label holds reserved no more than it is owed. What a stream's
     labels are owed together must not pass its bound: a stream whose
     labels are owed more starts no stage, each refused naming the
     stream and what its labels are owed, until the configuration is
     mended (4). A stream that states no bound owes its labels nothing,
     and status names what they state passed over. What a label is owed
     is of its stream's agents alone: where the host's bound leaves no
     room, a stage of any label waits as 70 says. Status gives each
     stream's labels, each with what it is owed, what it holds
     reserved, its agents running and its stages waiting (56). (flume
     record 0063, accepted by the user 2026-11-09)
182. A label has no pool, account, points bound or pace of its own: its
     stream's pool, points bound and pace are the budget every label of
     the stream draws on (143, 145, 166, 167), and a label shares only
     the stream's agents running (181). A label's table in the host's
     configuration holds `owed` and `reserved` alone, and
     a start that reads any other key in it is refused naming the key
     (4).
183. An MCP server the host's configuration gives its agents may name
     the labels whose places may have it; one that names none is open
     to every label, and a place of a label it does not name, or of no
     label where it names any, is never given it, whatever its kind
     asks for. The list is the server's, kept with its declaration in
     the managed layer (C.7), never a label's or a kind's. How a host's
     servers reach an agent is not decided (section 10).
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
     flume counts no guess against either. A base place has no agents'
     work: its launch gives no points, one that gives them is refused,
     and it is counted against no bound or pace (202). A base place's
     fix, which flume launches (203), gives no points and is counted
     against no bound or pace, as a fix round's start puts no new points
     in flight (166, 167). (flume record 0056's amendment of 2026-11-07.) On a stream that states
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
132. A caller may name a recipient by a role's address,
     `<stream>/<role>`, rather than by a session: the role a source of
     the host declares for a stream the host declares (143, 193). A
     place of any stream may name an address of any other. A run of the
     role is a place of the kind its source names for the address, in
     the address's stream. Its name is the one its source gives it, else
     its stream and its role joined. So at most one run of an address is
     live at once (3), and two streams' runs of one role are two places.
     Its agent takes the address as its session's name. Its repository,
     base, priority, intent, points, brief and settings are those its
     source declares for the address, as a launch's are (7, 32). A run
     is over once its last stage delivers. flume declares it done at the
     settle that reads the delivery, with no caller's word, and tidies
     it (114), so an end that comes later wakes another run. A run's own
     stall goes to the answerer behind its stream and never to its own
     address (130, 193). Where a settle finds an end pending for an
     address that was never handed to it, with no run live or waiting for room, or a caller or
     another tool's carrier asks flume to wake the address, flume
     launches the address's kind at the priority its source declares. A
     wake of an address whose run is live or waiting does nothing. The
     run's start collects every end pending for the address (43), so
     whatever came while no run was live is one run's. An end a run was
     handed and did not confirm stays pending for the address, wakes no
     run again, and is handed to the next run the address's other ends
     wake (43). flume decides
     nothing in this: which address is a place's recipient, what the
     role's kind does and what its run decides are the caller's (69, 70,
     72). Nothing wakes an address no source declares, or two declare,
     or one whose stream the host does not declare.
     Where its source declares it carried, its run is on another host,
     its stream that host's, and its ends stay pending for the tool that
     carries them there. A launch naming an address that wakes nothing
     and is not carried is taken only where an answerer stands behind
     the place's stream (4, 193). Status says the ends pending for each
     address, and whether it is woken, held by a standing agent, carried
     or wakes nothing.
     Its source may instead declare a standing agent for an address: an
     agent flume did not open, in the terminal session it lives in
     (C.7). The source names it by the name the host's terminal knows it
     by. An end for
     that address goes into the standing agent's pane as a notice, as
     any end does (43), and wakes no run. flume opens nothing for the
     address and keeps no watch over it: it delivers at the settles that
     read the end. Where the terminal finds no agent of that name in
     that session, or more than one, the end stays pending, and status
     says where the address lives and why nothing went. The address
     stays the recipient a caller names, so which agent holds it is its
     source's alone, and `flume inbox` collects for it as for any
     recipient; a role that moves from a standing agent to a run changes
     its source's entry for the address and nothing of the host's. An
     entry giving an address both a standing agent and a kind declares
     nothing for it, and status names it, since the two are two agents
     of one role (3, 193).

193. A source the host declares (191) may declare the roles it answers,
     each at its address on a stream the host declares (143). Each role
     runs as one of the source's own kinds, launched with what the
     source declares; or a standing agent holds it (132); or its run is
     on another host, its stream that host's. A role whose kind's stage
     is a conversation that hibernates (212) is a standing role: flume
     keeps one place for it at its address, which takes its work in
     batches (214), hibernates between them, and ends only on its
     caller's finish (109). Its place is a folder of flume's holding a
     checkout of each repository its entry names, detached at its base's
     tip on no branch and moved to the tip at each resume (213), so
     nothing it holds is committed or lands; work that must commit, it
     launches as a place of a kind its entry names, in the repository
     the work is in (214). (flume record 0065, proposed) The source also declares
     the words of what the role answers, and may name the kinds its
     session launches its projects as with the words of when each
     serves, which a stage's prompt gives (28, 214), since a role finds
     no kind it is not told of. flume refuses no kind a role launches
     for its entry not naming it. The host declares the source and its streams and locks its
     kinds, and declares nothing of its roles. The source whose kinds
     run a role declares it once, at an address for each stream it
     answers in. A role a source declares, run or standing, may stand
     behind its address's stream: it is that stream's answerer. A launch
     that names no recipient and runs in no session has the answerer
     behind its stream as its recipient (7). flume delivers every stall
     of a place to that answerer besides the place's recipients and the
     role its stop-short named (130). So a question that no one collects
     or answers within the place's stall bound reaches a run woken, or a
     standing agent told, to answer it. An address two sources declare
     belongs to neither, and so does a stream two roles stand behind: a
     launch that would take either is refused naming both (4). A
     declaration that cannot be read declares nothing, and so does an
     address whose stream the host does not declare where its run is not
     on another host; status names each and why (56). flume decides
     nothing in this (69, 72). Which roles a source declares, which
     stands behind a stream and what its kind or its standing agent does
     are the source's. Which questions a run answers itself, passes to
     another role of any stream or carries to a person, and how, are the
     run's. A stream no role stands behind has no answerer: a launch
     there names its recipient or runs in a session and names no address
     that wakes nothing (4), and its stalls go to the place's recipients
     and the role a stop-short named.

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
    that agent once it is quiet (31). But for a conversation's stage
    (109), flume leaves that agent in its pane, since a person may be
    talking in it, and status and the stage's end say so (43, 56). A
    caller's stop, drop or done ends it as each ends the place's agent
    (51, 52, 114), and a caller's retry waits for it to end (49). Where
    the terminal resumed the lost agent's own session, as herdr does
    (C.5), what a person said to it is in the conversation the retry
    carries.

### A.14 Hibernate and resume

212. A kind may declare that a stage of it hibernates, a conversation's
     or one that is not; flume's own kinds declare none. A stage that
     hibernates is hibernated: a conversation's, once its agent has
     been quiet for its hibernate time with no question open (90), no
     own work running (91) and nothing waiting to be handed to it, or
     at its caller's `flume hibernate`; and any such stage's, once its
     agent kept open for an answer reaches the end of its time (198),
     in place of being let go. Hibernating ends the agent once it is
     quiet (31), keeps the session it ran for a resume (213), and frees
     its room and its account (70, 145). The stage neither ends nor
     moves on, counts no start and no retry (48), and while it
     hibernates it is never stuck, lost or working past its limit (44,
     45, 118). A conversation still ends only on its caller's finish
     (109), and a hibernating stage's place takes a finish, a stop, a
     drop or a done as any place does, with no agent to end. Its
     hibernate time is the time its settings give, in the forms 198
     takes, and otherwise the life of its program's prompt cache, one
     hour, as 198's is, so an agent is kept while its cache still pays
     and let go once it no longer does; `0` never hibernates it on its
     idling. No process of flume's waits for the time (120): a settle
     reads it. A caller's hibernate is refused, naming the place, for a
     stage whose kind does not hibernate it and for a place with no live
     agent, and an agent that is not quiet is hibernated only when
     forced (31). Hibernating is the agent's and never the stage's
     state machine: a retry, a stop, a drop and a done mean what they
     mean of any stage (49 to 52, 114). (flume record 0065, proposed)
213. A resume goes on with a hibernating stage's own session. A caller's
     `flume resume`, a message to the place (53), a delivery to a role
     whose place hibernates (214), and the answer to the stop-short a
     hibernated agent waits on (42) each resume it. A resume starts one
     fresh agent under an identity of its own (30), carrying the
     hibernated agent's conversation where its program can carry it
     (179), on the account the hibernated agent ran under while that
     account is usable and otherwise on the one 145 chooses where it
     reaches the conversation, waiting for room as any start does (70).
     Its prompt is the message's words or the batch's (214), or the
     question with its answer, or, at a bare resume, flume's words
     saying the session resumes; then the way to stop short (28). Where
     no account it takes reaches the conversation, or its transcript is
     gone, the stage starts afresh with that prompt as 49 says of a lost
     conversation, flume's words standing before it: its conversation
     could not be carried, and what it committed and left is in the
     place. A resumed stage is a running stage: its stop check, its
     quiet limit and working past it hold from the resume (44, 110,
     118). A resume never begun, or whose agent is not the stage's, is
     read as 146 reads a carried start. A resume is no retry: it
     restarts no stage, carries no retry's words, and runs no later
     stage again (49). (flume record 0065, proposed)
214. A message or an end for a role (132, 193) is a delivery pending at
     the role's address until the role's session takes it (43; weir 100
     to 107). The session takes every delivery pending for it at once,
     as one prompt, when it next waits, and nothing reaches it while it
     works (54, 215): where the role's place has a live agent, flume
     hands the batch when the agent goes quiet (121); where its stage
     hibernates, the batch resumes it (213); where the role has no
     place, it is woken as 132 says, and its run's first prompt carries
     the batch. A place a role's session launches naming no recipient
     reports to the role's address, its session's name (7, 132), so the
     place's ends wait there with the role's other deliveries and resume
     the role where it hibernates. Which of a batch's items a role takes
     first, which it hands to its own subagents and which it launches as
     places of the kinds its entry names are the role's (193). (flume record 0065, proposed)

<!-- ANCHOR_END: part-a -->
<!-- ANCHOR: part-b -->
## Part B. Contracts across the seams

### B.1 The place

78. **make**: given a repository, a revision, a branch name and a
    location, a worktree there on a new branch at that revision; or a
    refusal because the branch or the location already exists (3, 9).
    No operation of the place seam is asked of a base place, which has
    no worktree: its branch is the merge queue's (202, 205, 206).
79. **ready**: given a place and the revision its launch read, each
    step its merge queue equips it with at that revision, run in the
    place in order with an environment that carries nothing of the
    caller's, each with its outcome and its words, stopping at the first
    that fails (11, 12; record 0036, accepted 2026-11-05).
80. **read**: given a place, its branch, its head, and whether it holds
    a change not committed, a file neither committed nor ignored, or a
    lock (65).
81. **remove**: given a place, its removal with its repository's
    teardown run, or a refusal naming the step that failed (66).
82. **remove-branch**: given a branch and its base, the branch removed
    when it holds no commit whose change the base lacks, or a refusal
    naming the commits it holds (67); never a base place's branch,
    which the merge queue closes (204).
83. The guarantee: make never touches a branch or a location that
    already exists, and each operation is all or nothing.

### B.2 The kinds

84. **read-kinds**: given a repository and a revision, every kind the
    repository declares there, a simple kind with its stages and a
    statechart kind with its statechart; or that its declaration could
    not be read, with the reason (19, 20, 175).
85. The same revision always gives the same kinds, reading changes
    nothing, and a declaration a launch carries is read the same way
    (19). A statechart kind's statechart is given whole, as the family's
    format reads it (weir 81).
160. **read-locked**: given a lock and the host's sources, each kind the
     lock records with its content, and whether its content's hash is
     the one recorded; or that the lock or a package could not be read,
     with the reason (155 to 157). The same lock and sources always give
     the same answer, and reading changes nothing.
192. **read-source**: given where a source's packages lie, the identity
     of every package it holds, and given where it declares its roles,
     each address it declares with the run it names, the standing agent
     that holds it or that it is carried; or that either could not be
     read, with the reason (159, 191, 193). The same place always gives
     the same answer, and
     reading changes nothing.

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
    prompt, and the conversation it carries where it carries one (179),
    how to start that agent so it works in the place under that
    identity, its mode passed as the setting its profile maps it to,
    its model as written, its effort as its profile takes it, and its
    own settings as the layers resolved them, the way its own settings
    part says (29, 32, 33, 169, 172, 195, 196, 197).
135. **started**: given an agent, whether the agent has said it started
     under its start's identity and the settings its start recorded,
     with flume's guard and stop check in force where its program
     offers them; or that it started without them, naming each variable
     that differs by its name and whether its program or, where the
     profile reads it back, its mode did, with the mode it began in, the
     mode read at the start's word or, where the profile reads it only
     with a prompt the program takes, at the start's first prompt; or
     unknown (35, 77, 161, 162, 171).
89. **received**: given an agent and a text, whether the agent received
    the text as a prompt, by its own word where the program gives one,
    or as 171 reads it where its profile reads no record, or unknown
    (38).
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
211. **windows**: given an agent, the usage windows its program last
     reported for the account it runs under, each with how much of it
     is used, from 0 to 100, and when it resets, as the program reports
     them while the agent's session runs; or none yet; or unknown (184,
     185). It is the program's own report, read by flume's own part of
     the program, never asked of the program's maker and never read
     from a sign-in (146). (flume record 0062, accepted by the user
     2026-11-09)
164. **plan**: given an agent working in its program's planning mode,
     the newest plan its own record says it put for review, with where
     the plan lives and when it was written, or none, or unknown; and
     each ask of the agent's to leave that mode declined with flume's
     words, so it stays in it, or that the program gives no way to
     (24, 34, 163). A stage that delivers a plan runs only on a program
     whose profile offers this part (169).
174. **parts**: given a program, which parts of this seam its profile
     answers from the program's own record, and, for each other, that
     it is degraded and how (170, 171).
179. **carry**: given a start whose agent stopped at its account's
     usage limit, or a conversation's start reported lost, or lost
     while kept open (49), or a hibernated start (213), and the
     environment of the account the next start of its stage runs under,
     whether the program can carry that agent's conversation to an
     agent under that account, with what the next start resumes; or why
     it cannot; or that the program gives no way to (49, 146). It is
     read from what the host provides, and flume never makes it so.
     Where it can, the next start's command resumes that conversation
     (88), and its agent's word that it started names the conversation
     it goes on with (161).
207. **live**: whether a process of a program runs a conversation now,
     naming each by its id and when it started; or that none does; or
     unknown, naming what could not be read (30, 49). It is given the
     start whose conversation a start would carry, and the environments
     of the accounts the host's configuration declares for its program. It is read from the program's own record of its running
     sessions and from the host's processes, so a process runs it
     whatever account it runs under and whoever started it. flume ends,
     signals and writes nothing of a process it so reads.
196. **own settings**: the keys of its program's settings that another
     setting or the account owns, each with its owner; and, given a
     program's own settings as the layers resolved them, how the program
     is started with them, by a file the start writes in the place's own
     folder, by arguments or by a variable of the program's, or that the
     program gives no way to take them (195). No release reads its own
     settings back, so a start's record names none and compares none.
215. **deliver**: given an agent and the words of one or more
     messages and notices, those words handed to the agent as one
     prompt the next time it waits, by its program's own channel,
     leaving whatever a person typed in its input untouched; or that
     the program gives no way to, where the terminal hands them (43,
     54, 95, 214; flume record 0065, proposed).
93. The guarantee: each answer is what the agent's own record shows,
    and an answer the record does not give is unknown, never guessed
    from the terminal; but a part the profile declares degraded is
    answered as 171 says, and said so (170).

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
    a hand (38, 53); and, given nothing, whether the terminal delivers
    text to a running agent at all (198).
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
139. **show**: given a place, the clues the terminal shows a person
     beside its agents, or that it shows none. The clues are its current
     stage and that stage's state, its line's short form as status gives
     it (56, 142), and a one-line count of its repository's places on
     its base. A settle calls it whenever it changes one of them. A clue
     is display only: nothing flume decides reads it back, and one that fails to show is
     logged and fails nothing (46, 56).
122. The terminal settles nothing. No operation of it starts a
     settle, keeps watch over the host or says whether flume runs
     attended. Nothing a plugin of it runs does either: flume reads
     attended from the host's watch alone (119, 208). Between flume's commands a place moves at
     its agent's quiet (121) and at the settles of a caller keeping
     watch (46). A plugin of the terminal's may show a person what
     status gives and act through flume's commands at a person's asking
     (60).
187. **attach**: given a part of the terminal, one by its name or the
     terminal's own, and a view, the part shown to a person in it, the
     part started first where it does not run, so the view shows the
     part the terminal's agents open in: for a window, the command that
     shows it, with what the command needs of its environment; for the
     terminal's own app, the running app told to show that part, the
     app titling its own window; or a refusal where the terminal holds
     no part a person can be shown or offers no such view (186).
201. **runs**: given one or more parts of the terminal, each one by its
     name or the terminal's own, whether each runs now, with the name
     the terminal knows it by. Or that the terminal holds no part a
     person can be shown, or that it cannot read a part. The parts are
     read together, in one reading of the terminal. runs starts nothing,
     so a part that does not run stays so (200).
98. The guarantee: open never runs a second agent under an identity
    already live, and close never reports an end that did not happen.
    Every operation answers within a bound the profile states, and one
    the terminal does not answer within it is unknown or a refusal in
    the terminal's words, never waited on.

### B.6 The merge queue

117. **submit**: given a place, its branch submitted to its base with
     the place as its submitter, answered once the merge queue holds it
     and before it decides, with the submission it made; or refused,
     naming why (111). A place's branch goes at the place's head, from
     the place. A base place's, which has no worktree, goes from the
     repository as the merge queue holds it, named by the branch, with
     no worktree as its submitter (203). Submit holds no wait and removes nothing
     (113).
133. **inbox**: given a place, every decided outcome of the place's
     submissions pending for it: landed, with the commit it landed as;
     failed, with the merge queue's words; or in conflict, with the
     files contested; each then recorded by the merge queue as delivered
     to the place; or that the merge queue could not be read (43, 111,
     112). A withdrawal is delivered by nothing, and read from
     read-submission (99). A base place has no inbox: its outcomes are
     read from read-submission (203).
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
     read, or that the merge queue lands no such base. A base no merge
     queue lands, as in a repository with no merge queue bound, is read
     at origin as C.1 says, and at the local branch only where origin
     holds none.
205. **open**: given a repository, a branch and its base, the branch
     made at the base's current revision as one the merge queue lands
     on, with that revision; or a refusal naming why (202). A branch
     already present, or one the merge queue would not land on, is
     refused.
206. **close**: given a repository, a branch the merge queue lands on
     and the branch its work landed into, the branch removed; or kept,
     naming why; or that it is gone (204). A branch with a submission
     still open on it, or with work the other branch lacks, is kept.
210. **forecast**: given a repository, a branch the merge queue lands
     on and its base, the conflicts the branch's head would meet were it
     submitted to the base now, placed after every entry already
     submitted. A clear forecast gives the head and the base's revision
     it was formed on. One in conflict gives those, the files contested,
     each entry ahead it meets, none where it meets the base itself, and
     the merge queue's words. Otherwise it says the merge queue could not
     form it, and why (203; sluice 64, 65). A forecast creates no entry, moves no
     branch, and is never read as a verdict. (flume record 0056's amendment of 2026-11-07.)

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

### B.8 The window

188. **show**: given a command, what it needs of its environment and a
     title, a window of the host's display running the command under
     that title, whatever title the command sets, handed to the display
     so that it is the person's and no process of flume's (120); or,
     where no window program is named, the command for a person to run;
     or a refusal in the window program's words (186).
189. The guarantee: show opens at most one window at each asking and
     runs nothing in it but the command it is given, and answers within
     a bound the profile states, one the display does not answer within
     it a refusal. flume never reads, finds again or closes a window it
     opened.

### B.9 Binding the contracts

105. Each seam is bound by naming one profile of Part C. The terminal
     and the window are bound for each stream, the stream's where it
     names one and the host's otherwise (186, 190), and the store once
     for the host. The place, the change and the
     merge queue once for each repository, by the binding the repository
     declares (20), and none guessed from another tool's files; the
     kinds by the one form every declaration takes (19); the agent for
     each stage, by its settings' program: the program's own profile
     where flume carries one, and otherwise the common profile, for
     every program a terminal starts (170). A repository that names no place
     profile is bound to the one that needs nothing beyond git. One that
     names no change or merge queue leaves that seam unbound, so flume
     assumes no tool (11). A stream and a host that name no window
     program show no window, and give the view's command for a person
     to run (186). Only a kind that lands reaches the merge
     queue (4, 111). Parts A and B do not change to admit a profile.
106. One conformance suite holds every profile to Parts A and B; a
     profile that fails it is not one.
178. Each atom the stage, session and place templates name is bound to
     one operation of one seam above, and served or performed through it
     alone (105): an evidence a guard reads, or an effect a transition
     performs with the evidence that proves it. An atom no operation
     serves is not one flume runs, and a statechart kind that names it is
     refused (4). The conformance suite holds each binding as it holds
     its operation (106).

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
| **git worktree**: every repository; the one place profile | `git worktree add -b <branch> <location> <revision>`, at `$XDG_DATA_HOME/flume/places/<id>/<kind>--<name>`, under flume's own data directory and inside no working tree, `<id>` the repository's (record 0027); a place made before at `<repository>/places/<kind>--<name>` read and tidied where it stands; with no hook run | where sluice is the merge queue, `sluice equip <base> --at <revision> --json` run in the place in the host user's login environment, the revision the launch read, each of its `steps[]` one step of the readiness with its outcome and words (C.6); nothing where no merge queue is bound | `git status --porcelain=v2`; `git worktree list --porcelain` for a lock | `git worktree remove`, with no teardown but sluice's release where sluice is the merge queue (C.6); the branch by `git cherry <base> <branch>`, deleted with `git branch -D` when no line starts with `+` |

There is no worktrunk place profile: a worktree tool's create hooks run
a place's code with the host user's full permissions, outside any
executor, and flume runs no `wt submit` (record 0012), so nothing of a
place needs one (record 0014; sluice record 0013 for its own places). A
repository whose `[profiles]` names `place = "worktrunk"` is refused at
the launch, naming the one profile. A place's branch is `<prefix>/<name>`, the prefix
its kind's. Where a merge queue lands the base, the base's current
revision (9) is where the merge queue's profile says the base lives.
Under sluice, that is `<remote>/<base>` after one fetch when
`.config/sluice.toml` lands the base on a remote, and the local
`<base>` when it lands the base there (C.6). Where no merge queue is
bound, or its profile lands no such base, it is `origin/<base>` after
flume's own fetch, `git fetch origin
+refs/heads/<base>:refs/remotes/origin/<base>`, read at
`refs/remotes/origin/<base>`. The local `<base>` is read only where the
repository has no remote `origin`, or where origin holds no such
branch: that fetch fails, and `git ls-remote --exit-code origin
refs/heads/<base>` exits 2. Status says which (56). Where origin holds the
base, the host's own `<base>` is a copy that may lag it: sluice levels
it only where it lands the branch on a remote (sluice 124), and nothing
else on the host moves it (the runner's record 0019). Any other fetch
that fails refuses the launch (9). A name is refused when `git
check-ref-format` refuses the branch it gives. A base place (202) has
no worktree. The profile gives it the location a place of its kind and
name would have, which names it and where nothing is made, so its launch
is refused where anything stands there (3). No `git worktree` command,
readiness or teardown runs for it. Its head is its branch's revision as
the merge queue's base reads it (126), and the merge queue makes and
closes its branch (205, 206), never `git branch -D`.

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
merge_queue = "sluice"    # reads .config/sluice.toml for where the base lives, and has sluice equip and release each place (C.1, C.6); none when omitted, and a kind that lands is refused (4)
change = "openspec"       # (C.3); none when omitted, and a kind that reads a change is refused (4)

[prompt]
goals = "docs/goals.md"   # the file whose text is the goals (149), relative to the repository, read at the base's revision with the kinds (20); none when omitted

[agents.programs.claude.settings]   # settings for every kind's agents in this repository, its own kinds among them (32); no stage, stream, env or beside
attribution = { commit = "Assisted-by: Claude Code", pr = "" }   # Claude Code's own key, passed as written (195)

[kinds.bump]
version = 2               # status names the kind bump@2 (19); 1 when omitted
branch = "bump"           # the prefix of its places' branches; the kind's name when omitted
starts_unready = false    # whether its first stage starts in a place that could not be made ready (12)
lands = true              # flume submits each place after its last stage (111); false when omitted
label = "construction"    # the kind's label, its share of its stream's agents (180, 181); none when omitted

[kinds.bump.agents]       # settings for every stage's agent; a stage's own come first (23, 32)
program = "claude"
model = "sonnet"

[kinds.bump.agents.programs.claude]   # Claude Code's own settings for bump's agents (195)
file = "claude-bump.json" # a settings file in the program's own words, relative to the declaration's file, its keys beneath `settings`
settings = { tui = "fullscreen" }   # keys as the program spells them, each taken whole

[kinds.change.agents]     # settings for flume's own change@2, which the repository does not redeclare (32)
model = "opus"
mode = "edits"            # the agent's mode: plan, ask, edits or full, or a table of programs (162, 169); the account's own where no layer gives one
effort = "high"           # how hard the agent's model works on each turn, its program's own word or a table of programs (197); the account's own where no layer gives one
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
hibernate = true          # hibernates once idle past its hibernate time, and resumes at a message (212, 213); never when omitted
wait = true               # waits on its caller's word (47)
agents = [{ beside = "operator" }]   # opened beside the pane the launch's settings name as `operator` (107)
on_fail = "code"          # the stage a failed submission sends the place back to (112); this stage when omitted
max_send_backs = 3        # how many times a place may go back before it waits on its caller (112); three when omitted
```

`agents`, `deliverables`, `makes`, `on_fail` and `max_send_backs` are
the kind format's own names. A kind's `[kinds.<kind>.agents]` table
gives settings to every stage's agent, and a stage's own `agents` come
before it (32). A `[kinds.<kind>]` table holding `agents` and no
stages declares no kind: it gives settings to the kind by that name,
whichever kind the name resolves to (19), at whichever source and
version (154, 158), flume's own fix@1, chore@1, change@1, change@2, change@3 and plan@1
among them, and names one stage's by
`[kinds.<kind>.agents.stages.<stage>]`; settings for a stage the kind
does not hold refuse the launch naming the stage (4). A repository's
declaration resolved over by a launch's gives the place nothing of its
own kind's settings. A repository's agents tables give a program, a
model, an effort, a mode and instructions, and carry nothing of one host: an `env` in a
repository's `.config/flume.toml` refuses the launch naming the field
(4), since an environment is an account's alone (144, C.7); so does a
`keep_open` there or in a kind's declaration, since how long an agent
is kept open is the host's or the launch's (198), and a launch gives it
by `flume launch --agent [<stage>.]keep_open=<time>`. `mode`
is a field of every agents table, the kind's, a stage's, the
repository's and the host's (C.7), and of a launch's settings, `flume
launch --agent [<stage>.]mode=<mode>`; its values are flume's four
modes, `plan`, `ask`, `edits` and `full`, or a table of programs,
`mode = { claude = "auto", codex = "edits" }` and `flume launch --agent
[<stage>.]mode.<program>=<value>`, each entry one of the four or a value
of that program's own that its profile names (C.4). One the agent's
profile cannot honour refuses the launch naming it, the program, the
stage and its layer (4, 169). `model` is the program's own name for a
model, or a table of programs in the same form (172). `effort` is a
field of every agents table and of a launch's settings, `flume launch
--agent [<stage>.]effort=<word>`: its program's own word, one its
profile takes, or a table of programs in the same form; one the
agent's profile does not take refuses the launch naming it, the
program, the stage and its layer (4, 197). A stage that
delivers `plan` starts in `plan` whatever the layers give, and only on
a program whose profile offers the plan (163, 164). flume reads `on_fail` and `max_send_backs` on a
simple kind's last stage only, since under flume a stage of a simple
kind fails only by its place's failed submission. A simple kind whose
stage names more than one agent or more than one deliverable is refused
(4, 23). flume ignores a
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

`programs` is a field of every agents table, the kind's, a stage's,
the repository's and the host's (C.7), and of a launch's settings: a
table of programs, each entry flume's, with `file`, a settings file in
the program's own words, and `settings`, keys as the program spells
them, either or both, and any other key of an entry refusing the
launch naming it (195). A file is JSON where its name ends `.json` and
TOML where it ends `.toml`, its top level a table; a declaration's is
relative to the declaration's file and read with it as its prompts are,
and one outside the repository or the package, by `..`, an absolute
path or a link, refuses the launch naming it (157). A launch gives one
key by `flume launch --agent
[<stage>.]programs.<program>.settings.<key>=<value>`, the value read as
JSON where it parses and as the text written otherwise, and a file by
`--agent [<stage>.]programs.<program>.file=<path>`. The `[agents]`
table is flume's, beside `[profiles]` and `[prompt]`, the repository's
and no part of any kind: its settings for every kind it runs, its own
among them, read at the base's revision with the kinds (20, 21) and
beneath its tables for one kind (32). It gives what a repository's
kind tables give, and names no stage, no stream, no `env` and no
`beside`, each refusing the launch naming the field (4); a launch's
declaration and a package's are not read for it.

A statechart kind is a `[kinds.<kind>]` table that holds `regions` in
place of `stages`, spelled as weir's C.4 spells it (175). The kind
format's crate in agentplot/weir reads it, at the one revision of weir
the workspace pins. It runs on the engine, the original Flywheel's
flywheel-engine moved into agentplot/weir beside that crate and taken at
the same revision (176). So the format a kind is read in and the tick
that runs it never come from two revisions. A table that holds both
`regions` and `stages` is refused naming the field (weir 95). While
flume runs no statechart kind, a declaration of one refuses the launch
naming the kind and its format (4).

A kind's identity is written `<source>/<name>@<version>`, as
`flume/change@2` or `acme/review@1` (weir C.4). flume's own source is
`flume`, the repository's own `repo` and a launch's `launch`. `flume
launch --kind` takes `change`, `change@1` or `flume/change@1`, and a
kind from a source the host declares by its source, `acme/review` or
`acme/review@1` (154), and so does a role's `kind` (C.7). A
repository's lock is
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
instead, and `--remove` takes an entry out. `--hash <hash>`, naming
one kind, records it only where its content hashes so, and otherwise
refuses naming both hashes and leaves the lock as it was. It reads
only what the host already holds, fetches nothing, and commits nothing:
its caller commits a repository's lock (155). A package's agents tables
and a kind's declaration from any source carry no `env` and no
`keep_open`, and name a program by its name alone (158); a package's own settings' file is a
part of the package (157).

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
| **change@3** | `change/<name>` | no | yes; `code` | `construct`: `change`, each task naming the narrowest check that shows it done, a test by name, a package's tests or a lint of the files it touched, and none running the repository's whole checks or a task group's; `code`: `tasks`, not repeating, one agent for the whole change; `verify`: `archived`, its prompt running the repository's whole checks once before it checks the work as change@2's does. The newest, so a launch naming no version in a repository whose lock records none runs it (154, 155). (flume record 0054, accepted by the user 2026-11-06) |
| **change@2** | `change/<name>` | no | yes; `code` | `construct`: `change`; `code`: `tasks`, repeating per task group (140); `verify`: `archived`. The verify prompt checks the work against the change and commits its report as `verify.md` in the change's directory. It then archives the change on the place's branch, the report with it, or stops short finding, with what fails, which sends the place back to code (131). The code prompt, sent again with a failed submission's or a finding's words, fixes what they name and records the fix as a task of the change, ticked. The code stage's standing instructions hold what every repetition is told alike; its prompt holds the place's and the change's paths, then its group, the notes' path and its words, which come last (141, 148). The newest of flume's change, taken by a launch that names no version where no lock records one (154) |
| **plan@1** | `plan/<name>` | no | yes; `code` | `plan`: `plan`, in the agent profile's planning mode, ended by its caller's finish (163); `code`: `commits`, fix@1's code stage with the plan accepted, `{{plan}}`, in its prompt, sent again with a failed submission's words |
| **change@1** | `change/<name>` | no | yes; `code` | `construct`: `change`; `code`: `tasks`, not repeating, one agent for the whole change; `verify`: `archived`, as change@2's. Kept beside change@2 (22): a repository picks it by recording `flume/change@1` in its lock, a launch by naming `change@1`, and a place launched at it keeps it (21) |

Each stage of flume's own kinds, from each kind's version after those
above, gives its agents the mode `full` (162, 169), since it works in
its own place with no person watching, and its standing instructions
say that an agent that needs an answer stops short with its words
(28) and never asks through anything else, a card, an inbox, a
message or a question in its pane, whatever a hook, a plugin, a file
or a person's words for every agent tell it; the words name no tool of
anyone's. A version already released keeps its content (157). flume's
own kinds hold none of a person's words: a person's own words for
every agent are the host's `[agents]` table's `instructions` (32), and
their labels are the host's (180). (flume record 0064, accepted by the
user 2026-11-09)

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

### C.4 The agent: Claude Code and the common profile

| operation | how Claude Code satisfies it |
|---|---|
| command | `claude` in the place, with flume's own Claude Code plugin loaded by `--plugin-dir`, which holds every hook below, `--model` from the settings resolved for it (32), `--effort` with the effort they resolve where they give one and nothing where they give none, one of the pinned release's own `low`, `medium`, `high`, `xhigh` and `max`, which the release reads beneath `CLAUDE_CODE_EFFORT_LEVEL` where the agent's environment sets it (197), `--permission-mode` with the value the mode they resolve maps to where they give one and nothing where they give none (162, 169), `--settings <file>` where its own settings resolve to any key, the file `own-settings.json` beside the start's record holding them as one JSON object and never a named file as it stands, and nothing where they resolve to none (195), the standing prompt as `--append-system-prompt-file`, naming a file of the start's own beside its record in the place's own folder that holds it as written, which 2.1.296 reads as it reads `--append-system-prompt`'s text though its help does not list it, so no argument holds the newlines a standing prompt holds, which herdr will not type (148, C.5), and `--exclude-dynamic-system-prompt-sections`, which moves what Claude Code's own system prompt holds of one place and host, its working directory, its environment, its memory's paths and the repository's git status, into the first message, so the system prompt ahead of the standing prompt is the same for every agent of one release. Its environment is the host user's login environment with the resolved environment over it, and `FLUME_AGENT`, `FLUME_SECRET`, `FLUME_PLACE` and `FLUME_STAGE`. `FLUME_AGENT` is the identity, `flume:<repository>:<kind>--<name>:<stage>:<n>`, the repository named by an id taken from its common git directory and `<n>` the stage's start. `FLUME_SECRET` is that start's secret. The program's kind, by which a terminal that starts a known agent program names it, is `claude`. A start that carries a conversation adds `--resume <session>`, the session the carry row names (179). The prompt is sent once the started ack has come and the agent waits, or carried as the command's argument under the printed command (C.5) |
| started | the plugin's SessionStart hook runs `flume ack started` with `FLUME_AGENT`, `FLUME_SECRET`, the plugin's version, the session's id, its transcript's path and the start's source; the ack is taken only while the secret is that start's, and a plugin version other than the binary's is reported. A start with no ack is starting. A session the terminal brought back with a bare `claude --resume`, which loads no `--plugin-dir` and carries no `FLUME_*`, acks nothing, so it is never the stage's agent (77). Before it acks, the hook compares what the agent runs under with the start's record (161): the program, read as C.5's check of a pane's foreground reads it, and, for each variable the record names, the digest of that variable in the hook's own environment, keyed by `FLUME_SECRET`; and, where the record names the session the start resumes, the hook input's `session_id`. Where any differs it acks nothing and records that the start began without its settings, naming each variable that differs and whether the program or the session did. It then starts `flume settle <place>` in the background, so flume ends that agent and starts the stage afresh. It compares no mode. The pinned 2.1.296 gives a SessionStart hook's input no `permission_mode`, so the received row compares the mode at the start's first prompt. The variables a terminal sets for itself, `PATH` and `SHELL` among them, and the login environment beneath the settings are not in the record. The ack records the transcript's length when it first came, and keeps it at every later SessionStart of the start, a compaction's among them. Every reading of the start's transcript reads only what follows that length. So a start that carries a conversation takes none of its earlier agent's turns, background tasks or last words as its own (179) |
| received | the plugin's UserPromptSubmit hook runs `flume ack received` with the submitted prompt's digest, the start's secret and the input's `permission_mode`, which Claude Code fires only when it submits the prompt, a prompt queued while the agent worked among them; text typed and never submitted acks nothing. At the start's first prompt, where the start's record names a mode, the ack first compares it with the input's `permission_mode`, which the pinned 2.1.296 gives a UserPromptSubmit hook's input. Where it differs or is missing, the hook answers a block, which 2.1.296 reads as a blocking error, so the prompt takes no turn. It then acks nothing, records that the start began without its settings, with the mode asked and the mode it began in, and starts `flume settle <place>` in the background. flume sends that agent nothing more, ends it once quiet and starts the stage afresh (161). With no ack, the session's transcript holding the prompt as a user turn, or as a queued `enqueue` record, answers received, and a transcript that cannot be read answers unknown |
| asking | a mark the plugin's hook leaves when the agent opens a question or a plan for a person (PreToolUse on `AskUserQuestion` and `ExitPlanMode`, but never on `ExitPlanMode` in a stage that delivers a plan, which the plan row declines), or Claude Code asks a person's permission (its permission-request or permission-prompt notification hook, where the pinned Claude Code has one), open until the transcript holds the answer, and cleared too at UserPromptSubmit and at SessionStart; the terminal's reading alone never decides it |
| own-work | background tasks the transcript shows started and not finished |
| plan | in a stage that delivers a plan, the plugin's PreToolUse hook on `ExitPlanMode` records the plan the tool's input names, its `planFilePath`, or its `plan` text where it names no file, written by the hook beside the start's record, with the time the hook ran, as the pinned 2.1.296 writes them; it then denies the tool with flume's words, that the plan is put for review and that its notes or an acceptance will come as the next message, so the agent stays in plan mode and ends its turn (163). The newest plan so recorded is the stage's, read at the path recorded |
| stop-short | `flume needs "<words>"` needs an answer, and `flume needs --found "<words>"` found work (41, 131); run by the agent or a process it started, refused unless `FLUME_AGENT` names the agent of the place's current stage and `FLUME_SECRET` is that start's, while the agent is live |
| send-back | the plugin's Stop hook blocks the stop, its reason naming the deliverable and `flume needs`, while the stage's deliverable does not exist, the agent has not stopped short since its stage last began, and no background task runs and no question is open; it never blocks a conversation's agent, and in a stage that delivers a plan it names `ExitPlanMode` as the way to put the plan |
| guard | the plugin's PreToolUse hook refuses a command that runs `sluice submit`, `wt submit`, `wt merge` or `git push`, its reason saying that flume submits the place, and leaves the mark status reads (56) |
| on-quiet | the plugin's Stop hook, each time it lets the agent stop, starts `flume settle <place>` in the background, so the place settles the moment its agent goes quiet (46) |
| ended | the plugin's SessionEnd hook marks the start's session ended; a session killed with no hook reads unknown here, and the terminal's state decides (96, 134) |
| last words | the agent's last message in the session's transcript; where the pinned Claude Code has a StopFailure hook, the plugin records the failure's reason there, a refused sign-in or a usage limit among them, as the agent's last words, which status gives with the agent (43) |
| spent | the StopFailure hook's `error` of `rate_limit` with words that open as the pinned Claude Code's own usage-limit messages do, "You've hit your limit · resets …" and "You've hit your session limit · resets …" among them, recorded by the plugin with the time it ran; a `rate_limit` with other words, a model under high load or the server limiting requests, is no usage limit. The time the limit resets is the words' `resets <when> (<zone>)` part, or, where the limit hit is a budget, their `your <limit> resets <when> (<zone>)` part, its plan limit's reset. `<when>` is as the release's reset formatter writes it in en-US: within a day, a time of day, `3pm` or `3:30pm`, the first such time in the zone after the hook ran; past a day, a date and a time joined by `at`, `Nov 8 at 12am`, the year after the day where it is not the hook's, `Jan 3, 2027 at 3:30pm`. `<zone>` is the zone's IANA name. Where the words have no such part, or one in another form, the record names none (146) |
| usage | the session's transcript: each assistant record's `message.usage`, its `cache_read_input_tokens`, `cache_creation_input_tokens` and `input_tokens`, the first such record's for the first request and their sum for the session, and the sum of its `output_tokens` (152, 168) |
| carry | yes where the start whose conversation it carries has a started ack, and its transcript, as that ack named it, is the same file, by device and inode, as `<home>/projects/<the transcript's folder>/<the transcript's file>`. That start is one that stopped at its limit, a conversation's start reported lost, or a hibernated start (213). `<home>` is the chosen account's `CLAUDE_CONFIG_DIR`, else `~/.claude` of the login environment. The next start then resumes the ack's session by `--resume <session>`. 2.1.296 looks for that session under its own configuration home's `projects` alone, and goes on with it in the same transcript, under the same session. Otherwise it cannot, its words naming `CLAUDE_CONFIG_DIR` and never its value. A lost conversation's start first takes the lost start's own account. That account's configuration home holds the transcript, so its carry needs no shared `projects` (49, 145, 146, 179) |
| deliver | a mod in flume's plugin, a hooks module, hands the words by Claude Code's `$.prompt.submit`, which enters them as a turn queued behind the one running and leaves the input box as the person left it, where the pinned Claude Code runs hooks modules in an interactive session, as 2.1.322 does; otherwise not offered, and the terminal's send hands them (95, 215) |
| live | the started ack's session runs where a `sessions/<pid>.json` under a configuration home gives that `sessionId`, and a process of the host runs with its `pid` and its `procStart`. `<home>` is each account's `CLAUDE_CONFIG_DIR` the host's configuration declares for `claude`, and the login environment's `~/.claude`. It runs too where a process of the host runs `claude` with the session after `--resume` or `-r`, under whatever home. 2.1.296 writes `sessions/<pid>.json` for each session it runs, with its `pid`, `sessionId`, `cwd` and `procStart`. A record whose process no longer runs, or runs from another start, names no live session, as a crash leaves one. Unknown where a home's `sessions` folder cannot be read or the host's processes cannot be listed. Its words give a process's id and start and never a home's path (30, 49, 207; core.30) |
| own settings | the keys below reserved, each with its owner; the rest taken by `--settings`, as the command row says, which the pinned 2.1.296 loads as its flag settings, laid over the user's, the project's and the local settings by its own merge (195, 196) |

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
and never fails or holds up the agent's start or turn. In a session
flume did not start, the plugin's SessionStart hook runs `flume inbox`
as the session the terminal names, confirming on receipt each end it
is handed, since the hook gives it to the agent whole (weir 103). It gives the agent what the inbox
answers as the session's context, and nothing where nothing is pending
or waiting or the terminal names no session. It never holds up the
start (43).

An account of a pool is `claude` and the `CLAUDE_CONFIG_DIR` of its
configuration home, where the account is signed in (144). Two accounts
carry a conversation between them where their configuration homes
share one `projects` folder. A symbolic link from one home's `projects`
to the other's, or from each to a folder of the host's, makes them
share it. That is the host's choice, made once: flume reads it at
each start that could carry a conversation and never makes it. It
shares everything Claude Code keeps of a project there, what its agents
remember of the project among it. Each home keeps its own credentials,
and flume copies, links and writes nothing in either (179). Every
Claude Code start under any home cleans the shared folder of
transcripts older than its home's `cleanupPeriodDays`, thirty days
where it sets none, so a host whose sessions hibernate sets it in every
home, once, longer than any hibernation lasts; that too is the host's
choice, and a resume whose transcript was cleaned starts afresh (213).

Claude Code maps flume's modes (169) to the `--permission-mode` choices
of the pinned 2.1.296: plan to `plan`, the planning mode a stage that
delivers a plan starts in (163), ask to `manual`, edits to
`acceptEdits` and full to `bypassPermissions`. Its own values, given
under `claude` in a table of programs, are those choices, `acceptEdits`,
`auto`, `bypassPermissions`, `manual`, `dontAsk` and `plan`. It reads
the mode back at the start's first prompt, by the UserPromptSubmit
hook input's `permission_mode`, compared with the value passed (161),
and it offers the plan (164). Where the settings
give none, flume passes no `--permission-mode`
and the account's own `settings.json` in its configuration home
decides. A mode the account's configuration does not allow, as
`bypassPermissions` where it disables that mode, starts Claude Code in
another, which the first prompt's comparison finds, blocking that
prompt so the agent takes no turn in it (161); and the
warning Claude Code shows before a session in `bypassPermissions`
where the account has not yet accepted it is one flume never answers
(34). The prompt
cache lives five minutes from its last read by default, and an hour
where the account or the environment enables it, as the pinned Claude
Code decides; so a standing prompt pays wherever agents sharing it start
on one account within that lifetime of each other (147, 148).

Claude Code's own settings are the keys of the pinned 2.1.296's
settings schema (195). Its profile reserves, each with its owner:
`env`, the account's (144); `model`, flume's model (172);
`effortLevel`, flume's effort (197);
`permissions.defaultMode`, flume's mode (162); `apiKeyHelper`,
`awsAuthRefresh`, `awsCredentialExport`, `gcpAuthRefresh`,
`otelHeadersHelper`, `forceLoginMethod` and `forceLoginOrgUUID`, the
account's sign-in (144); `disableAllHooks`, flume's plugin, whose hooks
are the start's ack, the guard and the stop check; and
`skipDangerousModePermissionPrompt` and `skipAutoPermissionPrompt`, a
person's acceptance of a warning, which flume never gives (34). A
reserved key a layer's `settings` writes refuses the launch, or the
stage at a later start; one a named file gives is left out, the rest of
its table kept, and status names it. Its `attribution`, the text its
commits and pull requests carry, empty for none, is an own setting like
any other: `[repos."<repository>".agents.programs.claude.settings]
attribution = { commit = "", pr = "", sessionUrl = false }` starts every
agent in that repository with neither text and no session link. A
`check-tools` test finds `--settings`, the sources' order, the merge
that joins a source's lists with those beneath it, each reserved key
and `attribution`'s two texts in the pinned release, so a bump that
moves one fails the gate.

The program that runs is the one the agent's settings name (32), by
name or by path, and never another a shell finds first. A terminal that
starts a known program by its kind, as herdr does, types the kind's own
name into the pane's shell; such a terminal sets the pane's environment
so that name runs the program the settings name, and checks that it did
before the start counts, as C.5 says.

**The common profile** binds every program flume carries no profile of
its own for (170), each by its entry: its name; the terminal's kind for
it, its name where herdr's kinds hold it; the flag that gives it a
model, where its release has one; the flag that gives it an effort and
the words it takes, where its release has one; its map of flume's
modes; and the
flag that trusts the place, or its folder-trust question and keys,
where it asks one. Each entry's flags are written here once they are
checked against the release the entry pins; until then an entry holds
the name and the kind, refuses a model, an effort and a mode, and starts the
program with neither. Its entries are the 24 kinds herdr 0.9.5's agent
start takes: pi, claude, codex, gemini, cursor, devin, agy, cline, omp,
mastracode, opencode, copilot, kimi, kiro, droid, amp, grok, hermes,
kilo, qodercli, qwen, letta, maki and muse; Claude Code's own profile,
above, takes its entry's place, and a profile of a program's own built
later takes its entry's place for the parts it builds.

| operation | how the common profile satisfies it |
|---|---|
| command | the program in the place, with its entry's model flag, its effort flag and the setting its entry maps the mode to where the settings give them, and `FLUME_AGENT`, `FLUME_SECRET`, `FLUME_PLACE` and `FLUME_STAGE` as for Claude Code, started through the launcher: `flume ack launched`, which the terminal runs in place of the program, reads the start's record in the place's own folder, compares the digest of each variable it names, keyed by `FLUME_SECRET`, and the program it is to run, records its word with its process id beside the start's record, and execs the program with the command's arguments in its own process; where anything differs it records that, execs nothing and starts `flume settle <place>` in the background (161, 171). The program's kind is its entry's. The terminal sends the prompt once the agent has started and waits; under the printed command it is carried as the argument the entry names, and a program whose entry names none cannot run under the printed command |
| started | the launcher's word that nothing differed, with the terminal's reading that the launcher's process runs the program and is ready for input (171) |
| received, asking, own-work, ended, last words | the terminal, as 171 reads it |
| spent, usage | unknown |
| plan, send-back, guard, on-quiet, carry | not offered; the host's watch settles the place, or a command that acts where none is kept (119, 208), and a stage whose agent stopped at its account's limit starts afresh (146, 179) |
| own settings | none reserved and none taken: own settings given for a program of the common profile refuse the launch, or the stage at a later start, until its entry names its release's way, checked against that release (171, 195, 196) |
| stop-short | `flume needs "<words>"` and `flume needs --found "<words>"`, as for Claude Code (41, 131) |
| parts | each part above but command, started and stop-short degraded, named in status with the agent (174) |

A program that asks a question before it starts is held at it and
never begun with the screen (34, 35), unless its entry names the flag
that trusts the place, or the folder-trust question and its keys,
checked against its release.

### C.5 The terminal

| profile | open | send | state | close |
|---|---|---|---|---|
| **herdr** | a pane in the herdr session the launch's settings name, else the one its place's stream names for the place's kind's stage or its kind (199), else the one its place's stream names, by default the stream's name, and flume's own for a place in the host's default stream naming none (107, 143): in each session, one workspace per repository and base, labelled `<repository> <base>` (`flume bolt/the-surfaces`, `sluice main`), made when the first place on that base opens there, and in it one tab per place named `<kind>--<name>`, whose panes are the place's agents that open in that session, so a stage that runs several agents at once splits its place's tab; where the settings name a pane, a split beside that pane instead, as for a conversation, left where its caller put it. The pane is made in the place with the host user's login environment and the agent's environment (C.4) over it set on it, its `PATH` led by a folder of the start's own holding the kind's name linked to the program the settings name, or, for a program the common profile binds, to flume's launcher, which becomes that program (C.4, 171), and its shell one that reads no startup file, so no login shell or rc file of the host's reorders that `PATH`; herdr's agent start runs the program there by the kind its agent profile names, its arguments passed whole, under the agent's herdr name; nothing is typed into the pane's shell. A start whose pane runs anything but the program the settings name is closed and refused, naming what ran, and a program herdr knows no kind for cannot run under herdr (32); nor can a program whose state herdr reads only through its own integration, OMP and MastraCode in 0.9.5, while `herdr integration status` reports that integration not installed, which refuses the launch naming `herdr integration install <name>` (4). The pane is held by its id and its server's socket, and found again by the agent's herdr name where the id no longer answers, as after the pane moves to another workspace: a name of at most 32 of herdr's legal characters made from the identity and unique on the server, a pane found by it taken as the agent's only once herdr lists it under that name. herdr's word that the program is ready is a second signal, never the start (35). A start herdr reads blocked is held at the program's question before it starts: the folder-trust question is answered and herdr waited on until the agent is idle (34), and any other leaves the start never begun with the screen; a start herdr does not see ready within its bound is never begun with the screen (35) | the pane's held input cleared with one ctrl+c while the agent waits, then herdr's prompt to the pane, then received read through the agent (89); a send never leaves text typed: one not received is cleared again before the next | herdr's reading of the agent: working as working; idle and done as waiting, since herdr's done is a finished turn nobody has looked at; blocked as asking only with the agent profile's mark (90), or where the agent's profile reads asking from the terminal (171), and as unknown otherwise; herdr's unknown as unknown; stopped only when the pane is gone, or herdr lists no agent in it and its foreground is the shell, or herdr lists it unrestored after its server's restart | herdr ends the pane and its process group, then reads that it is gone |
| **Rex** | a block in the Rex server of the session the launch's settings name, else the one its place's stream names for the place's kind's stage or its kind (199), else the one its place's stream names, by default the stream's name, and flume's own for a place in the host's default stream naming none (107, 143), each session a Rex server of flume's own: in each server, one Rex session per repository and base, labelled `<repository> <base>`, made when the first place on that base opens there, and in it one window per place labelled `<kind>--<name>`, whose blocks are the place's agents that open in that server, so a stage that runs several agents at once splits its place's window; where the settings name a block, a split beside that block instead, left where its caller put it. The block runs the program by a link of the start's own named for its kind, linked to the program the settings name or, for a program the common profile binds, to flume's launcher (C.4, 171), with no shell, its arguments passed whole, in the place, under the host user's login environment with the agent's environment over it, Rex's own terminal variables kept and nothing else of the Rex server's environment. A start whose block runs anything but the program the settings name is closed and refused, naming what ran, and a program that reports no Program Status (OSC 7501) cannot run under Rex (32). The block is held by its id, its Rex session's id and its server's socket, and Rex keeps a block's id when it moves. The program's first report is Rex's word that it is ready, a second signal, never the start (35). A start whose screen shows the folder-trust question has it answered as under herdr (34); a start whose program reports nothing within its bound, or exits, is never begun, with the screen (35) | the block's held input cleared with one ctrl+c while the agent waits, then the text typed and Enter pressed, then received read through the agent (89); a send never leaves text typed: one not received is cleared again before the next | the program's own report as Rex keeps it: working as working; idle and done as waiting; blocked as asking only with the agent profile's mark (90), or where the agent's profile reads asking from the terminal (171), and as unknown otherwise; error as waiting while the program runs, since a failed turn leaves the agent at its prompt; no report as unknown; stopped only when the block is gone, its program has exited, or its server no longer runs | Rex closes the block, ending its program and every process under it, then reads that it is gone |
| **printed command** | the command printed, the prompt carried in it, for a person to run in the place | refused, so every message is refused, no agent is kept open for an answer (198), and a prompt not received is reported never begun (38) | from the agent profile alone; stopped when its record says the session ended | refused unless the agent's record says the session ended |

Under herdr a session is named `herdr:<pane>@<socket>`, the pane's id
and its server's socket, wherever a recipient or a launching session is
named (7, 43); a role's run is reached in the pane its live start holds,
found again by that start's herdr name as an agent's pane is (132). A
standing agent is reached in the pane herdr lists under its name in its
session. That pane is found again at each delivery, so an agent revived
under the name is found where it is (132).
Nothing is sent to a pane found by a name until herdr lists it under
that name, and its id is recorded before anything is sent to it.

The herdr profile records in the host's state, by id and server, each
workspace and tab it made. It closes a place's tab in each session it
made one in when the place goes, its panes and their process groups
with it (137); and a workspace it made once that workspace holds no
tab of a live place and nothing it did not make. It never closes a workspace, a tab or a pane it did not
make: a workspace of its own where a person opened a pane is left open,
and status names it with what holds it. At each settle that changes one
of a place's clues the profile shows them, and nothing flume decides
reads one back (139). It titles the agent's pane with its stage and
state. It gives the pane the short form of its place's line as its
`flume` token, the row herdr's sidebar shows where the host's rows name
`$flume`. It gives the base's workspace a one-line count of the places
on that base running, asking, waiting on their caller and stalled. flume's herdr
plugin runs no settle and keeps no process that reads flume (122). Its
popup reads status once when a person opens it and again after each
key that acts, and its keys act through flume's commands. At herdr's
startup it writes what herdr's configuration lacks for the popup's key
and the sidebar's rows, which status gives (56). A clue
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
| open | the place's tab in the base's workspace, the one the host's state records as made for the repository and the place's base where `workspace list` (`workspaces[]`, `workspace_id`) still lists it; with none, `workspace create --cwd <place> --env <K=V>… --label "<repository> <base>" --no-focus`, the label whole, since herdr 0.9.5 states no limit on one,, recorded, its `tab.tab_id` renamed `<kind>--<name>` by `tab rename` and its `root_pane.pane_id` the pane; else `tab list --workspace <w>` (`tabs[]`, `label`, `tab_id`) and `pane list --workspace <w>` (`panes[]`, `tab_id`, `pane_id`), a split in the place's tab where one stands, `tab create --workspace <w> --cwd <place> --env <K=V>… --label <kind>--<name> --no-focus` (`tab.tab_id`, `root_pane.pane_id`) where none does, the tab recorded. Beside a named pane, `herdr:<pane>@<socket>` or a `pane list` entry by `pane_id` or `label`: `pane split <pane> --direction right --cwd <place> --env <K=V>… --no-focus` (`pane.pane_id`). Each `--env` is one variable of the host user's login environment (29), read once, with the agent's environment over it, the resolved environment (32) and flume's own, `PATH` led by the start's folder holding `<kind>` linked to the program, and `SHELL` a script in the start's folder, which herdr runs as the pane's shell, setting `SHELL` back to the user's and execing `zsh -f`, `bash --noprofile --norc`, or else `/bin/sh -i`, with `ENV` and `BASH_ENV` unset. Then `agent start <name> --kind <kind> --pane <pane> --timeout 120000 -- <arguments>`, the call bounded at its timeout and ten seconds more: `agent_started` with `interactive_ready` true is herdr's ready; `agent_not_ready` is the start held at a question, read by `pane read <pane> --source visible --format text`, the folder-trust question answered by `agent send-keys <pane> <keys>`, herdr's key names as the agent profile states them, then `agent wait <pane> --until idle --timeout 30000`, and any other question the start never begun with those lines; `timeout` the start never begun with the pane's visible lines; `agent_name_taken` refused, an agent live under the identity (98); `agent_pane_busy`, `agent_pane_not_found`, `invalid_agent_timeout` and `invalid_agent_argument` refused in herdr's words. Once started, `pane process-info --pane <pane>` and the host's process table read the program in the pane's foreground, which must be the one the settings name, by its path or, for a program a script starts, the script's path among its arguments |
| found again | where `pane get <pane>` answers `pane_not_found`, `agent get <name>` and the pane its answer names, taken only where herdr lists that pane's agent under the name, its id then recorded in place of the old; `agent_not_found` leaves the pane gone |
| send | `agent send-keys <pane> ctrl+c`, then `agent prompt <pane> <text>`, with `--wait --until working --until blocked --timeout 60000` where the agent's profile reads no received ack of its program's (171), `agent_prompt_stalled` and `timeout` read as not received |
| state | `pane get <pane>`: `pane_not_found` or `server_not_running` read stopped; `pane.restore_error` set reads stopped; with `pane.agent` set, `pane.agent_status` `working` as working, `idle` and `done` as waiting, `blocked` as asking, `unknown` or anything else as unknown; with no agent, `pane process-info --pane <pane>`, stopped when `process_info.shell_pid` is `process_info.foreground_process_group_id`, unknown otherwise |
| screen | `pane read <pane> --source visible --format text` |
| close | `pane close <pane>`, `pane_not_found` read as already closed; then `pane get <pane>`, gone only on `pane_not_found` |
| tidy | the place's recorded tab: `pane list --workspace <w>` read for panes in it, and a pane flume did not open there keeps it, named; else `tab close <tab>`, a tab already gone read as closed. Then the base's recorded workspace: where `tab list --workspace <w>` holds no tab but those of live places it made and `pane list` no pane it did not open, `workspace close <w>`; otherwise kept, and what holds it named |
| attach | for a window, `<herdr> session attach <name>`, `<herdr>` the full path of the herdr the profile runs, so the window runs the same release whatever its `PATH`; the session's server first found or started headless as the server row says, flume's own session being `flume`; the command's environment is `XDG_CONFIG_HOME` where the profile's calls run under one, which herdr 0.9.5 reads its sessions' home from, and nothing otherwise. For the app, refused: herdr 0.9.5 has no app of its own, and the Herdr app runs on herdr-core, a backend apart with sessions of its own (187) |
| runs | one `herdr session list --json` for every part asked, its `sessions[]` read by `name` and `running` for each, flume's own session being `flume`. A session listed running runs. One listed not running, or not listed, does not, and nothing is started. The call is bounded at one second, so the list answers within its second. A listing not read within it, or refused, is read as not read for every part asked, in herdr's words (201) |
| standing | the agents of a session by name, for an address its source declares a standing agent for (132, 193, C.7). It is read at each delivery and each status, and nothing keeps it. One `herdr session list --json` finds the session by `name` and `running`, flume's own being `flume`. A session not listed running holds no agent, and nothing is started. Then `agent list` on its socket, its `agents[]` read by `name`, `pane_id` and `agent_status`, the status read as the state row reads it. An agent of the name is reached at `herdr:<pane_id>@<socket>`, by the send and state rows, as any recipient's session is. None of the name is said so, and so is more than one. herdr 0.9.5 refuses a second agent of one name on a server, as `agent_name_taken`. A listing refused, or not read within the bound, is not read, in herdr's words |
| show | `pane report-metadata <pane> --source flume --title "<stage> · <state>" --display-agent <kind>--<name> --token flume=<line>`, the line's short form such as `code 1/2 · run 1 · tasks 2/5 · working`; `workspace report-metadata <w> --source flume --token flume=<summary>`, the summary such as `3 running · 1 asking · 1 waiting on caller · 0 stalled`, shown where the host's herdr sidebar rows name `$flume` |

What herdr 0.9.5 was seen to do, which the readings above allow for:
`agent start` types the program's name into the pane's shell, so the
shell's `PATH` and startup files choose which program runs, and hands
it the arguments after `--` byte for byte, 20,000 characters of
instructions with quotes, `$`, backticks and non-ASCII among them,
but refuses, as `invalid_agent_argument`, any argument holding a
control character, a newline or a tab among them, before it types
anything; it
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
before restarting herdr's server on purpose. Where the host's herdr
configuration resumes agents on its restore, herdr brings a Claude Code
agent back by the session its own integration reported, and the agent
goes on in that session's transcript where the login environment's
configuration home reaches it. What a person says to it there is then
in the conversation a retry carries (49, 77). The agent commands take an
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

Under Rex a session is named `rex:<block>@<socket>`, the block's id and
its server's socket, wherever a recipient or a launching session is
named (7, 43); a command run in a block reads its own from `REX_BLOCK`
and `REX_SERVER`, which Rex sets there. A name in another terminal's
form names no session of Rex's. A role's run is reached in the block its
live start holds (132). A standing agent is reached in the block its
session's server lists under its name, a block's label, found again at
each delivery (132). Rex refuses no label twice, so open claims the
identity in the host's state before it makes a block: it writes the
agent's record only where none stands, and a record whose agent does not
read stopped refuses the open (98).

Each of the host's terminal sessions under Rex is a Rex server of
flume's own, listening at `<state>/terminal/rex/<session>.sock` and
keeping its state in a folder beside that socket; a session's name that
makes the path longer than the 104 bytes macOS allows a socket is
refused. The profile starts a session's server where none answers at its
socket, without the sessions it saved, since a block Rex restores runs a
login shell and never its agent (77). It never stops a server, and never
uses the one the Rex app runs for its user. A person sees a session's
server in the Rex app once they add its socket under the app's Remote
Hosts, which attach's refusal names. Only a person adds one: the app
shows no host that `rex hosts add` writes into Rex's list of hosts, and
writes its own back into that list when `rex hosts remove` takes one out.

The Rex profile records in the host's state, by id and server, each Rex
session and window it made. It closes a place's window in each server it
made one in when the place goes, its blocks and their processes with it
(137), and a base's Rex session once that session holds no window of a
live place and nothing it did not make. It never closes a Rex session, a
window or a block it did not make, and status names what holds one it
keeps. At each settle that changes one of a place's clues the profile
labels the place's window `<kind>--<name> · <line>`, the short form of
the place's line, and the base's Rex session `<repository> <base> ·
<count>`, the count of the places on that base running, asking, waiting
on their caller and stalled (139). It finds both by their recorded ids,
so a label is display only, and a block keeps its agent's name as its
label. Rex draws each program's own report on its window's tab. Every Rex
call passes `--autostart=false` and the server's socket, so no call
starts a server of Rex's choosing, and every call is bounded, ten seconds
where the call states none, one that does not answer within it read as
unknown or refused in Rex's words. screen (136) is as many of the block's
last lines as it has rows. Each command and field the profile reads is
checked against the Rex the profile pins from Rex's flake,
0.1.0-preview.14 or later at API revision 12.

What the Rex profile reads of Rex 0.1.0-preview.14, each call
`rex --autostart=false -S unix://<socket> <words>`, its answer JSON on
standard output and a refusal Rex's words on standard error with a
nonzero exit:

| operation | Rex's commands and fields |
|---|---|
| server | `api call server.status` (`instance_id`, `api_revision`); where it answers `no Rex server is running at <socket>`, `server start --state-dir <folder> --restore=false --json`, which starts the server detached in a process group of its own and answers its `pid` and `instance_id`, and answers the running server where another start came first. An `api_revision` below 12 refuses, in Rex's words |
| open | the base's Rex session the host's state records for the server, the repository and the place's base, where `api call session.list` (`sessions[]`, `session_id`) still lists it; with none, `api call session.create` with `label` `<repository> <base>` and one window labelled `<kind>--<name>` holding the block (`session_id`, `initial_windows[0].window_id`, `initial_windows[0].block_ids[0]`), the session and the window recorded; else, where `api call -s <session> session.view` (`windows[]`, `window_id`, `layers[].blocks[].block_id`) lists the place's recorded window, `session.new_split` with `anchor_id` a block of that window, `direction` `horizontal` and `side` `after` (`block_ids[0]`), and where it lists none, `session.new_window` with `window_label` `<kind>--<name>` and `focus` false (`window_id`, `block_ids[0]`), the window recorded. Beside a named block, `rex:<block>@<socket>`, `session.new_split` beside it. The block is the flavor `com.superlogical.terminal.shell` with `label` the agent's Rex name, `f-<place>-<stage>-<start>` lowercased with each character outside `[a-z0-9_-]` made `-`, cut to 119 characters, then `-` and the first 8 hex digits of the identity's SHA-256; its options are `shell` `none`, `cwd` the place, `exit.on_completion` false, and `command` a script in the start's folder, mode 0700, which removes itself and execs `/usr/bin/env -i` with Rex's `TERM`, `COLORTERM`, `TERM_PROGRAM`, `TERM_PROGRAM_VERSION`, `REX_SERVER`, `REX_SESSION` and `REX_BLOCK` kept, each variable of the host user's login environment (29), read once, with the agent's environment over it, the resolved environment (32) and flume's own, `PATH` led by the start's folder holding `<kind>` linked to the program, then that link and the arguments, each quoted whole, so no variable stands in a process's arguments, which every user of the host can read. Then, until 120 seconds have passed, every 250 milliseconds, `block call -s <session> -b <block> process` (`last_exit`, `child.pid`) and `program_status` (`records[]`, `state`, `owner.pid`): a record whose owner is the child is Rex's ready; the folder-trust question on the screen is answered by `send-key` with the keys the agent profile states, which Rex reads by herdr's names, and the block read again until a record comes; `last_exit` set, or the bound passed with no record, is the start never begun, with the screen. Once ready, the host's process table reads the child of the block's `/usr/bin/login`, which must be the program the settings name, by its path or, for a program a script starts, the script's path among its arguments |
| send | `send-key -s <session> -b <block> ctrl+c` where the state row reads waiting; then `send -s <session> -b <block> -- <text>`, in pieces of at most 60,000 bytes cut between characters, since Rex refuses a request over 64 KiB; then `send-key enter`. Where the agent's profile reads no received ack of its program's (171), `events -s <session> --json`, run from before the text is typed until the call ends, gives received as a `program_status_changed` for the block whose record is `working` or `blocked`, within 60 seconds; none within them is not received |
| state | `process`: `block target "<block>" not found`, or no Rex server running at the socket, reads stopped, and `last_exit` set reads stopped; then `program_status`, its newest record by `updated_at` whose `owner.pid` is `child.pid`: `working` as working, `idle` and `done` as waiting, `blocked` as asking, `error` as waiting, none as unknown |
| screen | `capture -s <session> -b <block> --trim` and `block call size` (`rows`), its last `rows` lines |
| close | `block close -s <session> <block>`, a block not found read as already closed; then `process`, gone only on `block target "<block>" not found` or no Rex server running at the socket |
| tidy | the place's recorded window: `session.view` read for blocks in it, and a block flume did not open there keeps it, named; else `session.close_window` with its `window_id`, a window already gone read as closed. Then the base's recorded Rex session: where `session.view` holds no window but those of live places it made and no block it did not open, `session.destroy`; otherwise kept, and what holds it named |
| attach | for a window, refused: Rex 0.1.0-preview.14 has no terminal client, and only its app shows a session. For the app, the session's server found or started as the server row says, then `api call client.list` on it (`clients[]`, `info.kind` `app`, `client_id`), the app listed once a person has added the server's socket under its Remote Hosts, and `-C <client> do session.select session_id=<id>` for the newest Rex session the profile made there. Refused, naming the socket to add, where the app is no client of the server, and in Rex's words where the app refuses, as it does until a person turns on its Remote Control (187) |
| runs | `server.status` at each part's socket, every part asked at once and each call bounded at one second. A server that answers runs. One with no server at its socket does not, and nothing is started. One not answered within its second, or refused otherwise, is not read, in Rex's words; Rex keeps no list of its servers, so each part is its own call (201) |
| standing | the agents of a session by name (132, 193, C.7), read at each delivery and each status, and nothing keeps it. `server.status` at the session's socket: a server not running holds no agent, and nothing is started. Then `session.list` and `session.view` of each of its Rex sessions, every block read by `label` and `block_id`, its state read as the state row reads it. An agent of the name is reached at `rex:<block>@<socket>`, by the send and state rows, as any recipient's session is. None of the name is said so, and so is more than one, since Rex refuses no label twice. A listing refused, or not read within the bound, is not read, in Rex's words |
| show | `api call -s <session> session.set_label` and `session.set_window_label`, on the recorded ids, each label at most 128 characters |
| session | no call: `REX_BLOCK` and `REX_SERVER` of the calling command's environment, both set, read as `rex:<block>@<socket>` |

What Rex 0.1.0-preview.14 was seen to do on macOS, which the readings
above allow for: a terminal block takes no environment of its own, and
its program gets the Rex server's, run under `/usr/bin/login` as root,
which `process` names as the block's child and, where no shell keeps job
control, as its foreground. A command with `shell` `none` runs at once,
its arguments whole. Rex sets `REX_SERVER`, `REX_SESSION`, `REX_BLOCK`,
`TERM_PROGRAM` and `TERM_PROGRAM_VERSION` in a block. `send` returns
once the text is queued and types a newline as a line feed, which
Claude Code 2.1.322 took into one prompt with the text around it; Rex
refuses a request over 64 KiB, and two pieces of 32 KiB arrived whole
and in order. `send-key` reads `down`, `enter`, `ctrl+c`, `escape` and
`shift+tab` as herdr does. Claude Code 2.1.322 reports its own state as
`app=claude-code`: `idle` once up, about a second after its block
opened; `working` from a prompt's first moment, with its tool's activity
as `msg`; `done` at its turn's end, kept until the next; `blocked` with
`kind=question` and the question as `msg` while it asked one; and no
record once it exited. A `blocked` with `kind=permission` was not seen,
the account's settings letting its tools run unasked, and neither was
the folder-trust question, which the account's settings skip. Rex drops
`working` and `blocked` records when the program exits or a shell prompt
begins, and keeps `done` and `error`. A record's owner is the block's
`/usr/bin/login`. `block close` ended the block's program and every
process under it, a child that had left its parent among them. A server
restarted with its saved sessions brought each block back under its id,
label and folder, running the user's login shell with no scrollback and
no record, its program not started again, under a new `instance_id`.
`server start` on a socket of the caller's starts a server detached, and
answers the running one when asked again. The Rex app showed a second
server once a person added its socket under Remote Hosts, and
`session.view` listed a block the person opened there. The app showed no
host `rex hosts add` put in Rex's list of hosts, and wrote the hosts a
person added back into that list within a second of `rex hosts remove`.
The app refused `session.select` as not accepting actions while its
Remote Control setting was off. With it on, `session.select` on the
second server brought the session to the front at the window named,
answering `null`, and no call read back what the app showed. `capture` gives the scrollback with the screen,
and no option limits it to the screen. A socket path longer than 104
bytes failed to bind.

The printed command tidies nothing and shows no clue, since it made
nothing in a terminal. It refuses attach for either view, since it
holds no part of a terminal a person can be shown (187). Its runs
answers that it holds no part, for every part asked (201), and it finds
no standing agent, since it holds no agent a name finds (132). It reads no tool: open prints the line `cd <place> &&`
the command's environment, program, arguments and prompt, and marks it
printed for the identity in the place's folder, refusing to print it
again; its state is unknown, and the core reads its agent stopped once
the agent profile's ended reads yes (134).

herdr-core, which the Herdr app runs on, cmux and TUIOS are
multiplexers a terminal profile may be written for, each checked
against its release. None is written, and a stream or a host naming
one is refused as 190 says. As read on 2026-11-05, cmux's server and
TUIOS's daemon each have a terminal client that attaches to a
session. A profile for either answers attach for a window with that
client's command. herdr-core is shown only by the Herdr app. A profile
for it answers attach for the app by telling the running app to show
the session, and refuses a window.

### C.6 The merge queue: sluice

| operation | how sluice satisfies it |
|---|---|
| submit | flume runs `sluice submit <base> --no-wait --json` in the place, with no multiplexer's session in its environment, so sluice records the place's worktree as the entry's submitter and no session, pushes nothing into any pane, and answers with the entry at once; a refusal is its exit and words. flume never passes `--check` to a submit, and never runs `wt submit`, whose waiting half removes the place (111, 113). (`--check` named by flume record 0056's amendment of 2026-11-07.) A base place's submit runs in the repository, naming its branch as its head (203). |
| inbox | `sluice inbox --json` (sluice clause 51), run in the place, which delivers the place's decided entries pending for it once and marks each delivered; sluice answers nothing again for an outcome already delivered; a withdrawal is read from read-submission (133). None runs for a base place, whose outcomes read-submission gives (203) |
| read-submission | `sluice status <base> --json`, read once for each repository at each ask; the newest entry submitted from the place's branch, whoever submitted it; landed is that entry landed, its landing commit's `Sluice-*` trailers naming it |
| step | nothing: sluice's queue moves on its own once submitted, run by sluice's host process, which the submit starts, and the settle's read of the submission starts it again where work waits and none runs, so the queue moves with nothing installed and never twice (124, 125; sluice 135). A base place's queue onto its own base and its places' queue onto its branch move alike. (sluice record 0093, accepted by the user 2026-11-06, sluice `proposals/host-process-1.md`) |
| open | `sluice branch create <branch> --from <base>`, run in the repository, which makes the branch at the base's current revision where the policy gives it a gate (sluice 104). flume makes no branch sluice lands on itself, since sluice's protection refuses any other making (sluice 106) |
| close | `sluice branch delete <branch> --into <base>`, run in the repository once the base place is removed, which removes the branch only when nothing on it is open and its revision is contained in the base's (sluice 105). A refusal keeps the branch, named (67, 204) |
| forecast | `sluice submit <base> --check --head <branch>`, run in the repository, which forms the candidate sluice 64 forms for a head not yet submitted and submits nothing (203, 210). (flume record 0056's amendment of 2026-11-07.) |

On landing sluice removes nothing, and flume tidies every landed place
itself, through the place profile's teardown (C.1), and its branch as
67 says. Whenever
flume removes a place itself, landed, dropped or done, it first runs
`sluice release` in it as part of the place's teardown (66). sluice runs
the repository's `[tests] release`, which ends what the place's runs
left up, and frees the ports it holds for the place; it says `nothing to
release` when it holds none. A release that fails keeps the place, named
with that step (66). Where the base lives (C.1) is read from the same
`.config/sluice.toml`. A place's readiness is sluice's equipping of it,
`sluice equip`, which reads that policy at the revision flume names and
runs in the place what sluice runs before its own runs (sluice 147).

What the profile reads of sluice 0.55.0, each command run with every
multiplexer's session (`HERDR_*`, `REX_*`, `ZELLIJ*`, `TMUX`, `TMUX_PANE`)
stripped and `GIT_TERMINAL_PROMPT=0`, a refusal read as its JSON
`error.message` where it gives one and its errors otherwise:

| operation | sluice's commands and fields |
|---|---|
| submit | `sluice submit <base> --no-wait --json` answers `{ahead, branch, id}` and nothing more where intake takes the entry at once; the entry is `id`. On a base whose policy takes pull requests, sluice's statement says the submit pushes the place's branch, opens or updates its request and marks it ready, and where the request's conditions do not yet hold, a review among them, answers with the request and what it waits for and no entry (sluice C.5); the place's submission is then open and undecided until intake takes the request (124), and status names what it waits for |
| inbox | `sluice inbox --json` answers `outcomes[]`, each with `state`: `landed` with its commit in `landed_as`; `failed`; `conflict` with the files contested in `conflict.paths`. Each one's words are its `notice`, or where it holds none its `state`, `branch` and the `task` of each of its `failed[]`. A failure's notice names the check that failed, not its log. A conflict's base revision is `tested.on` (`tested: {combination, on, submissions}`), never parsed from the notice; a conflict found while the candidate was formed, before any test, carries no `tested`, and its base is then the base's revision where the profile holds it, `<remote>/<base>` or the local base, read with no fetch |
| read-submission | `sluice overview --json`, each of its `branches[].branch`, then `sluice status <branch> --all --json`, its `submissions[]`: the one with the highest `id` whose `from.worktree` is the place's branch, its `state` `queued` as waiting, `testing` as under test, `landed` (with `landed_as`), `failed`, `conflict` or `withdrawn`; any other state is read as not understood. Its `submitted` is when it was submitted; when it was decided and how long its checks ran are read from sluice's records of the entry and its runs where the pinned sluice gives them, checked against it at the build, and unknown where it does not (168) |
| submit, a base place | `sluice submit <base> --head <branch> --no-wait --json`, run in the repository, since a base place has no worktree. It submits the branch as sluice holds it, the remote's revision where its policy names one, recording no worktree and no session as the entry's submitter, and answers as any submit. No `sluice inbox` runs for it: its outcome is read-submission's entry whose `from.head` is the branch, failed and conflict with the record's words, files and `tested.on`. The profile reads it of the first pinned sluice whose submit takes a head without `--check` (sluice 124 as amended) |
| open, close | `sluice branch create <branch> --from <base> --json` answers the revision the branch was made at. `sluice branch delete <branch> --into <base> --json` answers it removed. Each exits 1 where a branch it names does not exist, which close reads as gone, and 2 on a refusal, its `error.message` the words (sluice C.5's branch row) |
| base | the remote is the `remote` of the base's table under `[branches]` in `.config/sluice.toml`, the base's own or the first pattern with one `*` that names it, read at the local base and else at each remote's tracking copy; where it names one, `git fetch <remote> +refs/heads/<base>:refs/remotes/<remote>/<base>` once, the base at `refs/remotes/<remote>/<base>`; where the base's table names none, the local base; and where the policy names no table for the base, or no revision of it holds a policy, sluice lands no such base, and base says so (126) |
| forecast | `sluice submit <base> --check --head <branch> --json` answers `{conflict, head, onto, ahead}`: `conflict` null and exit 0 where clear; exit 2 with `conflict.paths`, the files contested, and `conflict.with[]`, the entries ahead it meets, each with its `id` and `from`, where it conflicts; a refusal exits 2 with its `error.message`. The profile reads it of sluice 0.71.0 (flume record 0056's amendment of 2026-11-07.) |
| place | `sluice equip <base> --at <revision> --json` in the place as its readiness, its `steps[]` each `{step, passed, words}`, exiting 1 where one failed; an answer with no `steps` read as one failed step, `sluice equip`, with its `error.message`; and `sluice release` as its teardown, handed to the place profile through the binding |

sluice keeps its host state under `$XDG_STATE_HOME/sluice`, and once a
branch has had a submission its protect hook refuses a commit made to
it directly.

### C.7 The store: the host's state directory

The family's storage rule (section 9) settles where flume's state
lives:

- Each place's live state is host state, one document per place under
  `$XDG_STATE_HOME/flume/` (`~/.local/state/flume/`), and goes when the
  place is tidied (62).
- The host's watch is host state too, one document beside the places',
  holding when the newest settle a caller asked as its watch began and
  the bound it stated, written by compare-and-set and by nothing but
  such a settle (208).
- The host's deliveries are host state too, flume's store of weir's
  deliveries (weir 112): one document beside the places', holding
  every record of weir's C.8 for the ends of the host's places in the
  order added, each one object as weir's JSON spells it, written whole
  by compare-and-set, every record or none. It passes weir's pack as a
  deliverer's store (weir 113). A delivery's key is the place as its
  agents name it, the token its launch took, and its end's key, joined
  by `/`, so no two launches of one place share a key. `[host]
  ends_expire`, one time written as `keep_open` is, is the span after
  which an end pending for a recipient is expired, fixed when the end
  is read; a week, `168h`, where it is not given (43; weir 104).
- The host's bound is one word of the host's own configuration,
  `$XDG_CONFIG_HOME/flume/config.toml` (`~/.config/flume/config.toml`):
  `[host] agents = <n>`, how many agents of flume's places the host
  runs at once (70), stated by whoever administers the host. A host
  with no such word states no bound and has no queue.
- The host's configuration has two layers (section 9). `config.toml`
  is the managed one, written by whoever manages the host and never by
  flume. `config.local.toml` beside it is the local one, written by the
  host's operator or by a control plane acting for them, and read over
  the managed one key by key, a key it sets replacing the managed
  one's. The local layer may set only what runs the host's work from
  hour to hour: a stream's `agents`, `priority`, `points`, `pace` and
  `session` and `multiplexer`, and the `session` it names for a kind
  or a kind's stage (107, 143, 166, 167, 190, 199), a label's
  `owed` and `reserved`
  (181), the `stream` a repository or a kind is given and the `label` a
  kind is given (143, 180), and every agents table of the host's, for
  a kind, for a repository and kind, for a repository, for a stream and
  for every agent, each own setting and each named file in one a key of
  its own (32, 195). The accounts, the pools,
  `[host]` and every other table are the managed layer's alone: a local
  layer that sets one is not taken, the start reading the managed
  layer alone and status naming the key, until the local file is
  mended. The managed layer may pin a key the local one could set, by
  `pin` under `[host]`, a list of dotted keys such as
  `"streams.work.agents"`, and a pinned key the local layer sets is
  passed over, status naming it. Status gives every value of the
  host's configuration with the layer it came from (56).
- The host's streams and pools are tables of the same configuration:
  `[streams.<stream>]` with `agents`, its bound, `priority`, zero where
  it gives none, and `pool`; `[pools.<pool>]` with `strategy`,
  `fill-first`, `least-busy` or `most-left`, an optional `threshold`, a
  whole percentage from 1 to 100, 90 where it gives none (185), and
  `accounts`, in order, each with a `name`, a `program`, an `env` read
  as an agents table's is, an optional `agents`, the bound on agents
  running under it, a whole number from 1 (143 to 145). An account
  names no reading: flume takes it from the program (184).
  A stream may also state `points`, the bound on its points in flight
  (166), and `pace`, `{ points = <n>, per = "hour" | "day" | "week" }`
  (167); a stream that states either refuses a launch that gives no
  points (165), which a launch gives by `flume launch --points <n>`.
  A stream may state `multiplexer`, the terminal profile of C.5 its
  agents run in, the host's where it states none (190); `session`,
  where in that terminal they run, its own name where it states none
  (107); in `[streams.<stream>.kinds.<kind>]`, `session`, the session
  of that terminal the kind's agents run in, and, in its
  `.stages.<stage>` table, the one for that stage of the kind, the kind
  named as `[kinds.<kind>]` names it and the stage by its name in that
  kind, each table holding nothing but these and the kind's `stages`
  (199);
  `view`, `terminal` for a window that runs the terminal's
  command or `app` for the terminal's own app, and `terminal_app`, the
  window's profile of C.8, each the host's where it states none (186);
  `title`, the title of a window that shows them, its own name where
  it states none (186); and, in `[streams.<stream>.labels.<label>]`, a
  label's `owed` and `reserved`, each a whole number of agents from
  zero, zero where it gives none (181).
  `[host] pool` is the pool of a place whose stream names none.
  `[host] view` is the view of a stream that names none, `terminal`
  where the host names none either. `[host] terminal_app` is the
  window's profile of a stream that names none, the printed command
  where neither names one. A stream's `view`, `terminal_app` and
  `title` are the managed layer's alone, as `[host]` is. A `view` but
  `terminal` or `app` refuses the configuration, and a `multiplexer` or
  a `terminal_app` naming no profile refuses as 190 and C.8 say. An
  account's `env` is its agents' environment over the login
  environment (32): a leading `~` in a value is the host user's home
  and `$VAR` or `${VAR}` that variable of the host user's login
  environment, never of the caller's session (29), and a variable it
  names that the environment lacks refuses the start naming it. A
  repository, a repository's kind and a kind are given a stream by
  `stream` in `[repos."<repository>"]`, `[repos."<repository>".kinds.<kind>]`
  and `[kinds.<kind>]`, `<repository>` being the repository's address,
  `<owner>/<name>` as its clone's `origin` gives it, or its folder where
  its clone has no forge origin (143) (flume record 0055, accepted by the user 2026-11-06), and a repository's kind and a kind are given a
  label by `label` in the same two kinds' tables (180). The stream
  `default` holds every place nothing
  names a stream for, bounded by the host's bound alone unless a
  `[streams.default]` table states its own. So

  ```toml
  [host]
  agents = 8

  [streams.work]
  agents = 5
  priority = 10
  pool = "work"

  [streams.work.labels.operation]
  owed = 2
  reserved = 1

  [streams.work.labels.construction]
  owed = 2

  [streams.work.kinds.research]
  session = "work-design"

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

  [repos."acme/acme"]
  stream = "work"

  [kinds.research]
  label = "inception"
  ```

  runs acme's places in `work`, up to five of the host's eight agents,
  ahead of `personal`'s, on work-1 until it runs four, is spent or is
  past ninety percent of a window its reading gives, and then on
  work-2, two of work's five owed to operation, one of them
  reserved for it, and two to construction, research's places
  inception's, a research place's agents opening in the session
  `work-design`, which a person opens by that name, and work's other
  agents in `work`, every one of them counted in work's five, while
  `personal` holds at most 8 points in flight
  and starts at most 13 points in any day.
- Each account's spent time and each intent's affinity is host state,
  one document each beside the places' under `$XDG_STATE_HOME/flume/`,
  `accounts/<pool>/<account>.json` and `intents/<digest>.json`, the
  digest the intent's name's or its repository's and base's, written as
  a place's is (146, 147, 153). So is each stream's,
  `streams/<stream>.json`: each charge against its pace, its place,
  points and time, and each agent's tokens at its end, kept a week,
  the longest span a pace names (167, 168).
- An account's reading is part of its document,
  `accounts/<pool>/<account>.json`, written by flume alone, whole by
  compare-and-set, at each report its program makes in a session flume
  started (184, 211): when flume took it, and each window's name as
  the program gives it, its share used, from 0 to 100, and when it
  resets, each time RFC 3339's with its offset. A reading taken
  earlier than the one the document holds is dropped. No host writes
  it, and it holds no credential (flume record 0062, accepted by the
  user 2026-11-09).
- The host's terminal is one word of the same configuration,
  `[host] multiplexer = "<profile>"`, naming a terminal profile of C.5,
  `herdr` or `printed`, the terminal of each stream that names none,
  and the printed command where it names none (105, 190). `[host]
  terminal`, the word a host wrote before, is read as `[host]
  multiplexer`, and a host that gives both is refused naming both. A
  host whose own names no profile refuses every command, naming it, as
  it did before.
- The settings a host gives its agents are tables of the same
  configuration, by kind, `[kinds.<kind>.agents]`, and by repository
  and kind, `[repos."<repository>".kinds.<kind>.agents]`, the
  repository named by its location on the host as a launch names it;
  each gives `model`, `effort`, `mode`, `instructions`, `programs` and
  `keep_open` (C.2, 198), `keep_open` one time, `<n>`, `<n>s`, `<n>m`
  or `<n>h`, and never a table of programs, and
  names one stage's by a further `.stages.<stage>` table (32). So do
  three tables that name no stage: `[repos."<repository>".agents]`, for
  every kind run in the repository, `[agents.streams.<stream>]`, for
  every agent of a stream the configuration declares, and `[agents]`,
  for every agent on the host (32, 143). None of the host's agents
  tables gives a `program`, an `env` or `beside`, and a `stages` table
  under any of the three refuses every launch and start naming it, as
  a stream it does not declare does. A named file of the host's is
  absolute, under `~/` read as the host user's home, or relative to
  the configuration's directory, and read where it leads at each start;
  no `$VAR` is read in its path (195). They are read at each agent's
  start. So `[kinds.change.agents] model = "opus"` and
  `[kinds.fix.agents] model = "sonnet"` run change@2 on opus and fix@1
  on sonnet, under whichever account each stage's pool gives, and

  ```toml
  [agents.programs.claude]
  file = "~/.config/claude/people-settings.json"

  [agents.streams.personal.programs.claude.settings]
  tui = "default"

  [repos."~/Code/upstream-fork".agents.programs.claude.settings]
  attribution = { commit = "", pr = "", sessionUrl = false }
  ```

  gives every agent the keys of the file its people's sessions get,
  but those Claude Code's profile reserves, the personal stream's the
  default renderer over the file's, and every agent in the fork no
  attribution whatever its kind. Settings for a kind or a stage the
  place does not run are ignored.
- A host's sources declare the roles it wakes, and no table of its
  configuration does (193). A source's file may give `roles`, an
  absolute path or one under `~`. That file is the source's own tool's,
  written whole beside it and renamed over it; flume reads it as it
  stands and never writes it. Each entry is a
  `[roles."<stream>/<role>"]` table. It gives `kind`, a name of the
  source's own kinds, its version the locks' (154, 155), and
  `repository`, by its location on the host as a launch names it; an
  entry whose kind's stage is a conversation that hibernates gives
  `repositories` in its place, each so named, and `kinds`, the kinds it
  launches its work as (193). It
  gives `priority`, and `base`, the repository's default branch where it
  names none. It may also give `brief`, `points` and `intent`. Its
  `name` names the run's place, else `<stream>-<role>` does. It may give
  `answers`, the words of what the role answers that a stage's prompt
  gives (28), and `answerer = true`, where the role stands behind its
  address's stream. Under `[roles."<stream>/<role>".agents]` it gives
  the run's settings as a launch's (7). flume launches the run in its
  address's stream. An entry may instead give `agent`, the name the
  host's terminal knows a standing agent by. Beside it, it may give
  `session`, the terminal session the agent lives in, and `answers` and
  `answerer`. An entry naming no session finds its agent in the one the
  host names for its address's stream (143), in that stream's terminal
  (190), and the address's ends go into that agent and wake no run
  (132). Or an entry may give `carried = true`, with an optional
  `answers` and nothing else, for an address whose run is on another
  host. A configuration that gives a `[roles]` table is unreadable,
  naming it and that a source declares a role. An entry declares nothing
  for its address, and status names it, where it
  - names a kind not its source's, an `env`, a pool, an account or a
    `stream`;
  - names in its address a stream the host does not declare, and is
    not carried;
  - gives `agent` beside `kind` or a run's other keys; or
  - mixes `carried` with a run's keys, `agent` or `answerer`.
- The sources the host declares are files of its managed layer,
  `$XDG_CONFIG_HOME/flume/sources/<source>.toml`. Each gives
  `kinds_dir`, an absolute path or one under `~`: the directory holding
  the source's packages, each at `<name>@<version>/` with its
  `kind.toml` at its root (157, 159, 191); and may give `roles`, the
  file in which the source declares its roles (193). flume reads each
  such file
  whose name begins with no `.`, ignores every other entry, and writes
  none; the local layer declares no source.
  `$XDG_DATA_HOME/flume/kinds/<source>/` is host data where a program
  that fetches a source's packages may put them. Several versions of one kind lie side by side, and flume reads
  them and never writes them. The host's lock is
  `$XDG_CONFIG_HOME/flume/flume.lock`, of the host's configuration
  (155, C.2).
- flume keeps nothing that a place's readiness makes: what sluice's
  equipping installs goes where the repository's own tools put it,
  under homes the repository sets.
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
and flume never reads (141), the plan its caller accepted,
`plan.md`, which `{{plan}}` names (163), and each file a start's
command writes for its program beside the start's record, own settings
among them, readable by the host's user alone (196); it goes when the
place is tidied (62).

### C.8 The window

| profile | show |
|---|---|
| **ghostty** | on macOS, `open -na Ghostty.app`, `--env <variable>=<value>` for each variable the command needs, then `--args --title=<title> -e <program> <arguments>`, the display starting Ghostty as a process of its own under the display's environment; `open`'s refusal, a Ghostty not installed among them, refuses in its words, and `open` is bounded at ten seconds. Elsewhere, `ghostty --title=<title> -e <program> <arguments>`, started in a process group of its own with its input and output closed, as a session's server is (C.5), under the host user's login environment with the command's over it and nothing of the calling command's environment, and not waited on; a `ghostty` that cannot be run refuses. Ghostty's `title` holds the window's title whatever the program in it sets |
| **terminal** | on macOS, Terminal.app told by `osascript`, the command's line and the title passed as its arguments, to `do script` the line in a new window, the line being `exec env <variable>=<value> … <program> <arguments>`, each word quoted for a POSIX shell, then to set that tab's `custom title` to the title and its `title displays custom title` true; `osascript` is bounded at ten seconds, and its refusal, Terminal's automation not allowed among them, refuses in its words. Elsewhere refused, Terminal.app being macOS's |
| **printed command** | no window: the command given for the person to run, each variable it needs named before it, as `<variable>=<set>` (32) |

The ghostty profile is checked against Ghostty 1.4.0, whose `title`
forces the window's title and ignores the titles a program inside sets,
whose `-e` runs the command given in place of the shell, and which on
macOS is started by `open -na Ghostty.app --args`, since its command
line starts no window there. The terminal profile is checked against
Terminal 2.15 on macOS 27. Its scripting dictionary answers `do
script` with the new window's tab and gives the tab a `custom title`.
The window's title shows it beside what the person's Terminal profile
shows there. macOS has no setting for a default terminal, and a
`.command` file it opens in Terminal carries no title, so neither
stands for a named window program. A name `terminal_app` gives, a
stream's or the host's, that no profile carries refuses that stream's
view, naming the profiles, and nothing else (C.7).

### C.9 The three setups

Three setups run a host's places with the same state, kept where C.7
keeps it:

| setup | who asks flume | who decides what to launch and what matters most | each place's status and ends go to |
|---|---|---|---|
| on its own | the person, by `/launch` in any session or the herdr plugin's key, and the tools they run: millpond's sends, headwater's fix key and sounding's rounds (section 9) | the person, in their own session | the person, by status, the sidebar and the popup, and the caller that launched the place |
| with crew | the runner, at the asking of crew, its control plane (section 9) | crew's plans, and the user's priorities set on crew's rail, which reach flume as each place's priority (70) | crew, through the runner, which carries each place's status and each end (43) |
| with Boomdrive | the runner, at the asking of Boomdrive's hosted control plane | Boomdrive's planning, and the person on its rail | Boomdrive, through the runner, as with crew |

In every setup flume decides nothing its callers decide (I6), and
submits a landing kind's place through sluice (C.6). Going from one
setup to the next changes only who asks flume and what the local layer
of the host's configuration says, a layer a control plane may write
(C.7). The state flume keeps stays where it is, in the same form, and
Boomdrive imports nothing when it takes over (agentplot/strategy
decision #46, accepted by the user on 2026-11-11).

<!-- ANCHOR_END: part-c -->
<!-- ANCHOR: invariants -->
## 7. Global invariants

- **I1.** A stage ends only at its deliverable, its agent's stop-short,
  or, for a conversation, its caller's finish; never at a quiet terminal
  (39, 41, 109).
- **I2.** A place of a simple kind has at most one agent, and a
  statechart kind's stage runs its sessions as its join says. No agent
  that is not quiet is ended unless a caller forced it (30, 31, 175).
- **I3.** flume submits the places of a kind that lands, and an agent
  never submits. flume never commits, merges or lands, and moves no
  branch but its places' own (14, 71, 108).
- **I4.** flume removes only what it made, and never a commit its base
  lacks (64, 67).
- **I5.** A prompt or a message is received or reported, never left typed
  (38, 53).
- **I6.** flume decides nothing its callers decide: what to launch, save
  the fix a base place's kind names (203) (flume record 0056, accepted 2026-11-07.), each
  place's priority, or when a stage or a submission on hold starts; how
  many agents run at once, on the host and in each of its streams, the
  streams' priorities and the accounts its agents run under are the
  host's facts, which flume keeps to (1, 70, 143, 144).
- **I7.** A place whose kind does not land never reaches the merge
  queue, and a failed submission sends a place back only to the stage
  its kind names (111, 112).
- **I8.** flume runs no process of its own between its commands. An
  agent going quiet settles its place, and a caller keeping watch every
  place, and every settle reads the outcome of
  its open submission and drives its base where the merge queue moves
  only so (124). While no caller keeps watch, every command of flume's
  that acts settles every place first (46, 119, 120, 208).

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
- The callers are the operator, millpond, headwater, sounding, crew
  and the runner, each through flume's command line or a plugin of
  flume's.
- flume is free and open source.
- A kind is written in the family's one kind format. The format is
  defined once in the family's shared crates, in a public repository of
  the family's own, and the family's other tools build on it. flume
  runs the part of a simple kind that 23 names, so a repository's kinds
  keep their meaning in any tool that runs more of the format. It runs
  a statechart kind on the family's engine, which the same shared
  crates carry (175, 176). An elaboration kind is written in the same
  format, with an elaboration section that sounding reads and flume
  ignores.
- The family's storage rule places each piece of state in the lowest of
  five layers that holds every reader it has. The layers are the host,
  the worktree, the clone, a shared branch and the repository's
  content. Host state goes under the host's own directories for config,
  state, data and cache, by its kind. Config comes in two layers: the
  managed one the host's manager writes, and a local one written over
  it by the host's operator or a control plane acting for them; each
  tool names the keys its local layer may set.

The rest of the stack, which a model builds on unless it says why not:

- One static binary, written in Rust, as sluice is, with no daemon of
  its own (120).
- Every answer as JSON on request, the form of (61).
- Three surfaces answering from one core, each a plugin kept outside the
  core as sluice keeps its plugins:
  - a command line: `flume launch`, `status`, `message`, `hibernate`,
    `resume`, `stop`, `retry`,
    `finish`, `drop`, `done`, `tidy` and `prompt`; `kinds lock`, which
    writes a lock (155); `open`, which shows a person a stream's
    agents in its view (186); `list`, which says at a glance what flume
    holds and what a person can open (200); `needs` for an agent;
    `hold`, `wait`, `inbox` and `wake` for its callers; and
    `settle`, which the Claude Code plugin's hooks run at an agent's
    quiet and a caller keeping watch runs with its bound (121, 208);
  - a Claude Code plugin that gives every session `/launch` and serves
    `launch`, `status`, `message`, `wake`, `hibernate` and `resume`
    over MCP, each
    the same act as the command line's (60; flume record 0065, proposed). flume loads it into every agent it starts, and
    its hooks hold the asking mark, the stop check and the guard, and
    settle the place the moment its agent goes quiet;
  - a herdr plugin whose popup gives every place in flight with its
    line, read from status when a person opens it. Its keys open a
    place's pane, message its agent, stop it and retry its stage. The
    sidebar's row on each agent's pane is its place's line, which
    flume's settles show there (139). The plugin runs no settle and
    reads nothing of flume's but at a person's asking (122).
- herdr as the terminal, with flume's plugin for its popup and keys
  (C.5).
- The runner, on a host that keeps one, as the caller that keeps watch,
  which unattended use needs (119, 208): each of its passes runs
  `flume settle --every <bound>` once and awaits it. A host where no
  caller keeps watch runs attended. Its places move at its agents'
  quiet and its callers' commands, each command
  settling every place first, and its queues move in sluice's own host
  process, which a submit and a settle's read start (124, C.6;
  sluice 135).
- The profiles of Part C: plain git worktrees, the kind format in
  `.config/flume.toml`, OpenSpec, Claude Code, herdr, sluice, the
  host's state directory, and Ghostty or Terminal.app as the window
  program where the host or a stream names one. A repository with no `[profiles]` table gets
  plain git worktrees and no change or merge-queue profile (C.2).
- How each caller uses flume:

  | caller | launches | keeps |
  |---|---|---|
  | the operator | `/launch <brief>` in any session, or the herdr plugin's key | nothing; the sidebar shows each agent's place, and the popup every place |
  | millpond | an item's send, as a fix or a change, the item's brief as the launch's | the item's record and its sends, and the landing, written from the merge queue's record of the place's branch |
  | headwater | its fix key, as a fix with the release's brief | nothing |
  | sounding | each round of an elaboration, as a place of the elaboration kind it hands in the launch, a conversation's agent beside the operator's pane | the inputs, the soundings each was based on, the rounds, the operator's notes and decisions, and the record, with each round's conclusion copied from its report; its go-on is a retry with the operator's notes as words, its accept a done or a retry that releases a held submission, and its drop a drop |
  | crew | nothing by a call of its own: it is the runner's control plane, and asks the runner each launch and each act on a place, which the runner carries (the runner's row; crew's record 0056): each unit, chore or fix of a bolt, as a place of flume's own kinds, change, chore or fix, with no stage and no submission on hold, so the kind runs through and its fix round runs on its own (131); each bolt as a base place of a kind crew declares with no stages, on the branch the bolt lands on, its units' places on its branch (202); the bolt submitted by its land once the user sends it and its units are over, which the runner carries as the retry of its base place's submission (203); each agent's settings from crew's roles, marked with the bolt; a review note the user marked fix as a fix launched on the bolt's branch with the note as its brief; a fix of a base whose own checks failed after a landing, as a fix launched on that base with the failure's words as its brief, the merge queue's where it blamed and the check's own otherwise, its submission on hold where the base's landings wait on the user's word outside the merge queue's policy (7, 47) and free where the policy asks the word itself or none, with no bolt's branch between and no other place moved (record 0023) | plans, bolts, proposals, review batches, the rail and its cards; it launches a bolt's work whole, each unit as the work it follows allows, and keeps no slots: the host's room and the queue are flume's, and the user's priorities, set on the rail, reach flume as each place's priority (70); its word to a place, asked of the runner, is a retry answering a stop-short that asked, naming its key (42), with the user's own words where its role put the question to the user on a card its own code raised, or a retry or drop of a place past its kind's bound; it is a source of the host's that declares its roles once, each of a partition's roles at its address in the partition's stream, running crew's one kind for it or held by its standing agent until it moves, and names each place's recipient by the address of the role the work is for, so a role with no live run is woken to collect an end, and each partition's operator stands behind its stream (132, 193); each end is handed to its role's run and delivered once that run's confirm, which the runner carries, names it (43), and it reads the rest from the status the runner carries; a role's own work that lands is a place of its own, so no session of crew's submits; it decides no step between a unit's stages, and runs no agent of its own in the place (records 0010 and 0011) |
  | the runner | each launch its control plane asks, passed as given, a bolt's base place and its units' places among them, each naming the runner itself a recipient beside the role's address its control plane names, which drops no default recipient the address had not dropped already (7). A retry of a base place's submission its control plane asks as a land (203), and a confirm of ends it asks, by `flume confirm` as the recipient it names, of exactly the keys it names (43) | the watch over its host: each pass, keeping or control, runs `flume settle --every <bound>` once and awaits it (208); each place's status, carried to its control plane, a tidied place's from the document kept for its end; each end pending for the runner, of a live place or of a tidied place's document, which it confirms as itself by `flume confirm`, naming each end's delivery key, only once its control plane has taken a report holding it, so the end stays owed until then and no loss of the runner's report loses it (43, 62); nothing else of a place's, and no queue of its own: sluice's rounds are moved by those settles' steps or the host's `sluice run` |

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
  146)? Not decided (record 0020). Where an account has a reading,
  its pool starts nothing on it past its threshold in any window the
  reading gives, its weekly one among them (184, 185; record 0035);
  how one model's share of an account's allowance is spent is still
  not decided, and an account is spent only when its agent's own
  record says so.
- How does an MCP server the host gives its agents reach the agents
  flume starts, and which of them does an agent get (183)? Not
  decided: until it is, an agent takes what its program finds in its
  account's folder and its repository, and no server's `labels` is
  read.
- How does a resumed Claude Code agent's first prompt pass the
  "Resume this conversation?" dialog 2.1.322 opens for a conversation
  idle past its cache, which flume never answers for a person (34, 213)?
  Not decided: by a setting of the program's that keeps it shut, or by
  a resume that sends its prompt only once the agent waits.
- What identity does a resume's agent carry, when a resume counts no
  start of its stage and an identity names the stage's start (30, 48,
  213)? Not decided.

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
  answer comes back within the hour, a retry of construct with the
  answer as its words. Construct's agent takes the question and the
  answer in its session, and carries on there under its first start
  and delivers (42, 49, 198).
- **S5.** On a loaded host a code stage's agent takes four minutes to
  come up. flume reports the start unknown, not failed, and sends the
  prompt once the agent waits for input. It finds the prompt not
  received, sends it once more, and the agent receives it. Nothing is
  left typed in its terminal.
- **S6.** The operator messages a place's agent while it asks a person
  a question, and the message is refused with nothing typed. They
  message it again while it works. The words reach it once it waits for input, and
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
  All three get the same answer, and none starts or messages an agent.
- **S15.** A launch names a kind no declaration holds. It is refused,
  naming the kind, and no worktree, branch or record is made.
- **S16.** A repository's readiness fails at its toolchain. A change's
  place waits, and status names the step and its words. A fix's place
  starts its code stage, its prompt carrying the step and its words.
- **S17.** A code stage's agent is quiet past its limit with nothing
  delivered and nothing said, under an agent program that gives flume
  no way to send it back. Status reports the stage stuck, naming it and
  the agent, and flume does not end it. A message wakes the agent, it
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
- **S27.** No caller keeps watch over the host. A code stage's agent
  is killed with nothing delivered. Nothing
  reads it until the operator next acts through flume, dropping another
  place: that command settles every place first, and status then
  reports the stage lost.
- **S28.** On a host whose runner keeps watch, under herdr with flume's
  plugin, a code stage's agent crashes with nothing delivered, and its
  stop hook never runs. Within the watch's bound, at the runner's next
  pass, with no caller asking, flume reads the stage lost and starts no
  agent. Nothing of herdr's or its plugin's settles it (122).
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
  with no live run and launches the planner's kind as its source
  declares it (193). Two more ends come before the run's agent
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
  under the pool's other account, which cannot reach the agent's
  conversation, with words saying why; status says the stage moved,
  from which account to which, that its conversation stayed behind and
  why, and that the fresh agent starts without the earlier account's
  prompt cache. No caller's word is asked, and the kind's bound is not
  counted (56, 145, 146, 179).
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
- **S60.** The host's source acme holds review@1, and a repository
  declares no `review` and locks nothing. A launch of `acme/review` is
  refused naming acme/review@1 as recorded in no lock, and makes
  nothing; a launch of `review` is refused naming acme/review@1 as the
  host's. Once `flume kinds lock acme/review@1` is run in the repository
  and its lock committed on the base, the launch of `acme/review` runs
  it, and status names `acme/review@1` with its hash (4, 154, 155, 159).
- **S61.** A prompt of the host's acme/review@1 is edited after the
  repository locked it. The next launch of `acme/review` is refused naming
  the kind and both hashes; a place of it launched before the edit runs
  on with the content it launched with (4, 21, 156).
- **S62.** The host's sources hold acme/review@1 and beta/review@3,
  both locked. A launch of `review` is refused naming both as the host's
  sources'; a launch of `beta/review` runs beta/review@3 (4, 154).
- **S63.** A package names its standing instructions at
  `../shared/standing.md`, and another gives its agents an `env`. Each
  launch is refused, the first naming the path outside its package, the
  second the field, and makes nothing (4, 157, 158).
- **S64.** A bolt lands on main, and main's own checks fail at the
  landed revision. Main-level ops launches flume's fix kind on main
  with the failure's words as its brief and the submission on hold,
  since main's landings wait on the user's word that main's policy does
  not ask itself; no bolt is cut and no unit is moved. The code stage
  delivers, the place waits on the hold and status says so; the user's
  send reaches flume as a retry naming the submission, flume submits
  the place to main through the merge queue, and it lands as tested
  (7, 22, 47, 49, 111, 131; record 0023). On a base whose policy asks
  the word itself, as a request's review, the launch holds nothing and
  the request waits for the review (C.6).
- **S65.** A code stage starts under the account work-1, and its program
  comes up in a pane whose environment lacks work-1's
  `CLAUDE_CONFIG_DIR`, as a terminal that brought the pane back without
  its environment leaves it. The SessionStart hook acks nothing and says
  the start began without its settings; flume ends that agent once
  quiet and starts code afresh under work-1 with its environment,
  status naming `CLAUDE_CONFIG_DIR` as missing with no value, and the
  kind's bound is not counted (35, 112, 161).
- **S66.** The host's `[kinds.fix.agents]` gives `mode = "edits"` and
  the repository's gives `mode = "full"`. A fix@1 agent on Claude Code
  starts in edits, passed as `--permission-mode acceptEdits`, status
  naming the host's table as where its mode came from. Another host gives no mode in any layer, and its
  agent starts with no mode passed, in whatever its account's own
  configuration sets; its start records no mode and compares none
  (32, 161, 162).
- **S67.** A stage's settings give `full`, which Claude Code maps to
  `bypassPermissions`, and the account's configuration disables that
  mode, so the program begins in
  another. Its start's word is taken, since its program and variables
  match. Its first prompt shows the other mode: Claude Code's
  UserPromptSubmit hook blocks that prompt, so the agent takes no turn
  in it, and the agent is not the stage's. flume sends it nothing
  more, ends it once quiet and starts the stage afresh. That start
  begins in the other mode again and is never begun, status naming
  the mode asked and the mode it began in (35, 161, 162, C.4).
- **S68.** A caller launches plan@1. The plan stage's agent starts in
  its program's planning mode, reads the place and puts a plan for
  review; flume declines its ask to leave planning, and once it is
  quiet the plan is delivered to the caller, the stage for review. The
  caller shows it to the operator and messages the agent their notes; the
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
- **S71.** A kind's `[kinds.review.agents]` gives `mode = "edits"` and
  names no program. Its stream's pool holds a Claude Code account and a
  Codex account. An agent that starts on the Claude Code account is
  passed `--permission-mode acceptEdits`, one on the Codex account the
  setting Codex's entry maps edits to, and status names `edits` from
  the kind's table for both. The host's `[kinds.review.agents]` then
  gives `mode = { claude = "auto" }`: the next start on the Claude Code
  account is passed `auto`, status naming the host's table and its
  `claude` entry, and the Codex account is not usable for the stage,
  since the host's table is taken whole and names no entry for codex
  (32, 144, 169, 173).
- **S72.** A caller launches plan@1 with `--agent plan.program=codex`.
  Codex's profile offers no plan, so the launch is refused, naming
  codex, the plan stage, and that codex cannot put a plan for review.
  Launched with no program on a stream whose pool holds a Codex account
  and a Claude Code account, the plan stage starts on the Claude Code
  account, and its code stage after it on the same account, by its
  intent's affinity (4, 147, 164, 173).
- **S73.** A stage's settings name the program `amp` and give no model
  and no mode. flume binds it to the common profile. herdr's agent
  start runs amp through flume's launcher, which finds the start's
  record matched and becomes amp in its own process; once herdr reads
  that process ready the agent has started, and the prompt is received
  once herdr sees the turn it began. Status names the agent's
  received, asking, own work, usage limit, plan, send-back, guard and
  on-quiet as degraded, each with how it is read. The agent commits and
  is read waiting at two settles a minute apart: its own work is read
  as none, it is quiet, and the stage delivers. Launched again with a
  model for the stage, it is refused, naming amp, whose entry names no
  way to give a model (35, 38, 170, 171, 172).
- **S74.** A pane's amp is ended and started again by hand in the same
  pane, with no launcher. herdr reads an amp running and ready, but in
  a process other than the one the start's launcher became, so it is
  not the stage's agent: flume ends it once quiet and starts the stage
  afresh, as 161 does for any start that began otherwise (35, 161,
  171).
- **S75.** A stage's settings name the program `omp`, whose state herdr
  0.9.5 reads only through its integration, and `herdr integration
  status` reports it not installed. The launch is refused, naming
  `herdr integration install omp`. Once it is installed, the launch is
  taken (4, 170, C.5).
- **S76.** A repository declares two kinds. review@1 is a simple kind, a
  list of a code stage and a review stage. persona@1 is a statechart
  kind, whose test stage runs one session per persona the place holds
  and joins all. A launch of review@1 runs its stages in order by
  flume's own rules, one agent at a time. A launch of persona@1 runs on
  the engine, each settle ticking it once over evidence read at one
  head: its test stage starts a session for each persona side by side,
  and passes once every one has delivered. On a flume that runs no
  statechart kind, the launch of persona@1 is refused naming it and its
  format, and the launch of review@1 is taken (4, 18, 23, 30, 175 to
  177).
- **S77.** A place is launched under flume's own change@2 on a release
  that runs simple kinds alone. While its code stage repeats, the host
  takes a release that runs statechart kinds too. The place finishes
  under change@2 as it launched, by flume's own rules. Its next
  repetition, its verify stage and its submission run as before, and
  nothing of it runs on the engine (21, 140, 177).
- **S78.** A conversation's agent has talked with the operator for an
  hour under work-1 when its turn fails with work-1's usage limit. The
  pool's other account, work-2, reaches the agent's conversation, as
  the host made it. Once the agent is quiet flume ends it and starts
  the stage under work-2, carrying the conversation. The new agent
  says it started in the conversation its start's record names, and
  its prompt is flume's words alone. It answers the operator's last
  message where the earlier agent stopped. Status says the stage moved
  from work-1 to work-2 with its conversation, and that the new agent
  starts without work-1's prompt cache. No caller's word is asked, and
  the kind's bound is not counted (30, 109, 146, 161, 179).
- **S79.** A code agent stops at its account's usage limit. The start
  that carries its conversation to the pool's other account finds no
  such conversation there, and ends before it says it started. Nothing
  is delivered: flume starts code afresh at once, carrying nothing,
  with words saying the earlier agent stopped at its account's limit.
  Status says the conversation could not be carried and why, and the
  kind's bound is not counted (35, 112, 146, 179).
- **S80.** A kind's code stage runs Claude Code and its review stage
  Codex, and three places of one intent each run code and then review.
  Their stream's fill-first pool holds claude-1, claude-2, codex-1 and
  codex-2. The first code starts on claude-1 and the first review on
  codex-1, and every later code and review of the intent returns to
  them. Status names each start's account as the intent's affinity for
  its program and says the intent never moved. Once claude-1 is spent
  the next code starts on claude-2, and status says the intent moved
  for Claude Code alone; the next review still starts on codex-1 (145,
  147).
- **S81.** A kind names Codex for its review stage, and the stream a
  launch names has a pool of two Claude Code accounts. The launch is
  refused, naming the review stage, codex and the pool. Launched on a
  stream whose pool holds a Codex account, the place runs; the host's
  configuration then drops that account before the review starts, and
  the review is refused, naming the pool and codex, and starts no
  agent, where it would otherwise wait for room no account of the pool
  could ever give (4, 32, 145).
- **S82.** A host declares the streams `work` and `personal`, naming no
  session for either. A place launched on `work` opens its agents in
  herdr's session `work`, in its repository and base's workspace, and
  one on `personal` in the session `personal`; `herdr --session work`
  shows every agent of the work stream. A launch whose settings name
  the session `review` puts its place there whatever its stream, and a
  place on the host's default stream opens in flume's own session (32,
  107, 143).
- **S83.** A host's managed `config.toml` gives the stream `work` six
  agents. A control plane writes `config.local.toml` giving it three
  and a priority of 30; the next start finds room for three, and status
  gives both values from the local layer. The local file then sets
  `[pools.work]` too: no key of it is taken, the start reading the
  managed layer alone, and status names `pools.work`. Once mended, and
  with the managed layer pinning `"streams.work.agents"`, the local
  layer's priority is taken and its agents are passed over, status
  naming the pin (32, 143, C.7).
- **S84.** A host's stream `work` has five agents, and owes the label
  `operation` two of them, keeping one free, and `construction` two.
  With no operation place waiting, four construction places run and a
  research place of no label waits, since the one slot left is kept
  free for operation. An operation place launched then starts at once
  in it. A second operation place waits until the next agent ends, then
  starts before the research place and every construction place,
  whatever their priorities, and no agent running is ended for it (70,
  180, 181).
- **S85.** A host gives flume's own `research` the label `inception`
  by `[kinds.research] label`, and a repository's kind `deploy`
  declares `operation`; the host's `[repos."<repository>".kinds.deploy]`
  gives it `construction` in that repository alone. Status gives each
  place's label and where it came from. A local layer setting
  `streams.work.labels.operation.owed` to three is taken at the next
  start; a managed `[streams.work.labels.operation]` naming a `pool`
  refuses the start naming the key, since seats are the stream's (180
  to 182, C.7).
- **S86.** A stream's pool is most-left over work-1, work-2 and
  work-3. work-1's reading, two minutes old, gives its 5-hour window
  40% used and its 7-day window 80%; work-2's gives 60% and 30%;
  work-3 has no reading, no agent of flume's having run on it. Four places start, each of an intent of
  its own. The first starts on work-2, which has 40 left to work-1's
  20, and the second on work-2 too, its reading unchanged. Once
  work-2's reading is twenty minutes old with none newer, the third
  starts on work-1, the one account with a fresh reading; and once
  work-1 is spent, the fourth starts on work-3, which runs fewer of
  flume's agents than work-2 (145, 147, 184).
- **S87.** A fill-first pool's work-1 runs two of flume's agents when
  its reading gives its 5-hour window 92% used, resetting at 17:00,
  and its pool states no threshold. Both agents work on, and the one
  whose turn stops at work-1's usage limit moves as S55 says. The next
  stage of an intent whose affinity is work-1 starts on work-2, and
  status says the intent moved because work-1 was past its threshold
  in its 5-hour window until 17:00. After 17:00, no newer reading
  reported, a place of another intent starts on work-1, while the
  intent that moved stays on work-2; nothing of work-1's sign-in or
  its folders was changed (31, 145, 147, 185).
- **S88.** Every account of a stage's most-left pool is past its
  threshold or spent: work-1's 7-day window 95% used until Monday at
  08:00, and work-2 spent until 15:00 though its reading gives it 50%
  used. The stage waits for room, on the host and not on its caller,
  and status gives 15:00 as the pool's soonest time; at the first
  settle after 15:00 it starts on work-2. A reading of work-2 reported
  at 14:00 saying 10% used leaves the pause standing until 15:00 (70,
  130, 145, 146, 185).
- **S89.** A repository is cloned on a host for the first time, its
  `.prototools` pinning a moon nothing on the host has installed, and
  its toolchain activating the pins and installing none. A change is
  launched there. Its place's readiness, sluice's equipping of it,
  installs what the place pins, checks moon's version and runs moon's
  setup, each step named in status as it passes, and construct starts
  (11, 12, 20, 79, C.1, C.6; record 0036, accepted 2026-11-05).
- **S90.** A host whose terminal is herdr names Ghostty as its
  terminal app and declares the stream `work` with the title `Work
  Herdr`. It declares the stream `office` with Terminal.app as its own
  terminal app and the title `Office Herdr`. A person asks flume to
  open `work` before any of its places has opened an agent. herdr's
  session `work` is started headless, and a Ghostty window titled
  `Work Herdr` opens attached to it, in which the agents of the next
  place launched on `work` appear. Asked again, flume opens a second
  window. Asked for `office`, it opens a Terminal.app window titled
  `Office Herdr` attached to herdr's session `office`, and asked for
  the default stream, flume's own session in a Ghostty window titled
  `default`. A stream whose view is
  the app is refused in herdr's words, herdr having no app of its own.
  On a host that names no terminal app the same asking for `work`
  gives the command that attaches to the session `work` (107, 143, 186
  to 189).
- **S91.** A host whose terminal is herdr declares the stream `trial`
  with the printed command as its terminal. A place launched on `work`
  opens its agent in herdr's session `work`, and one launched on
  `trial` prints its agent's command. Asked to open
  `trial`, flume refuses, the printed command holding no session. The
  host's local layer then names herdr for `trial`. The trial place's
  printed agent stays as it was, and its next stage opens in herdr's
  session `trial`; status gives each agent's terminal with where it
  came from. A stream naming `cmux`, for which flume carries no profile,
  refuses its launches and its views naming `cmux`, while every other
  stream runs (4, 143, 186, 190).
- **S92.** A repository on a host binds no merge queue, and its remote
  `origin` holds `main` two commits past the host's own `main`, which
  nothing on the host moves. A fix is launched on `main`. flume fetches
  `main` from origin and cuts the place at origin's, and status says
  the base was read at origin. A second fix is launched on `trial`, a
  branch the host holds and origin does not: its place is cut at the
  host's own `trial`, and status says origin holds no `trial`. With
  origin out of reach, a third launch on `main` is refused naming the
  fetch, and nothing is made. In a repository whose sluice lands `main`
  on origin, the place is cut where sluice's profile says, as before
  (9, 56, 126, C.1, C.6).
- **S93.** A script with no terminal session launches a change in the
  stream `east`, naming no recipient, on a host whose source `acme`
  declares runs for `east/operator`, standing behind `east`,
  `east/planner` and `east/ops`, each with its words. The place's
  recipient is `east/operator`. Its construct needs a reading of a
  deployed queue's settings, and stops short naming `ops`, which its
  prompt listed among its own stream's roles. The settle wakes
  `east/ops`. Its run collects the question with its key and the place's
  brief, holds the waiting move, reads the settings, and retries
  construct naming the key within the hour construct's agent is kept
  open. That agent takes the question with the answer in its session and
  carries on under its first start, and status gives the answer on the
  stop-short, from `east/ops`. A retry naming the same key from a
  person's pane a minute later is refused, naming ops's answer and when.
  `east/operator` was woken for none of it (7, 28, 41, 42, 43, 49, 130,
  132, 193, 198).
- **S94.** The operator launches a change in `east` from a herdr pane
  on that host. Its construct stops short needing an answer, naming no
  role. The notice is delivered into the pane, naming the place, its
  brief's first line and the end's key. The pane's agent is restarted
  before it acts. At its start, flume's plugin gives the new agent the
  place waiting on it, with the question and the key. The agent does
  nothing with it. Five minutes after the stop-short the place is
  stalled. The stall, with the question and its key, is delivered to
  the pane and to `east/operator`, whose run is woken (43, 130, 193,
  C.4).
- **S95.** The host's source acme holds review@1 and review@2, both in
  the host's lock. A launch of `acme/review` runs review@2. A program
  renames over `acme.toml` a file naming a directory that holds
  review@2 and review@3, and locks review@3 by `flume kinds lock --host
  --hash`. The next launch of `acme/review` runs review@3, one of
  `acme/review@1` is refused naming review@1 as one acme does not hold,
  and the place of review@2 runs on as launched (21, 154, 155, 159,
  191).
- **S96.** A program writes `bad.toml` into the host's sources with no
  `kinds_dir`. A launch of `bad/x@1` is refused naming the file and
  `kinds_dir`; a launch of `fix` and one of `acme/review@1` go on as
  before, and status names the fault (4, 56, 191).
- **S97.** A host's source holds `fix@1`, locked. A launch of `fix` runs
  flume's own fix@1, and a launch of `<source>/fix` runs the source's
  (154, 191).
- **S98.** A place in `east`, whose recipient is `east/planner`, stops
  short naming `west/design`, a role of another stream, which its
  prompt listed by its address. The run of `west/design`, in `west`,
  takes it, holds the waiting move "on the user's card" for a day, and
  puts it to the user once, keyed by the place and the end. A second run
  of `west/design`, woken by another end, reads the same question, sees
  the hold, and asks the user nothing. The day passes with no answer.
  The hold lapses, and the place's stall is delivered to its owner
  `east/planner`, to `west/design` and to `east/operator`, the door of
  the place's own stream, naming the lapsed hold's words. The
  operator's run holds again naming the question already asked, and
  asks nothing (41, 130, 132, 193).
- **S99.** A host declares the streams `east` and `west` and one
  source, `acme`, holding the package `acme/turn@1`, which the host's
  lock records, and naming the file where acme declares its roles.
  acme's file declares `east/planner` and `west/planner`, each running
  `turn` in one repository, named `east` and `west`; gives
  `east/design` to the standing agent `east-design`; and carries
  `north/planner`, whose stream the host does not declare. The host's
  configuration names no role. Ends come at once for `east/planner` and
  `west/planner`. Two places are launched, `turn--east` in the stream
  `east` and `turn--west` in `west`, and each run collects its own
  address's ends. Each run's turn delivers, and flume declares it done
  and tidies it with no caller's word. The next end for `east/planner`
  launches a new run. An end for `east/design` goes into
  `east-design`'s pane as a notice and launches nothing. acme's file
  then gives `east/design` the kind `turn` in place of the agent, and
  the next end for it launches a run, nothing of the host's changed. A
  launch naming `north/planner` is taken, and its end stays pending,
  status naming the address carried (3, 114, 132, 143, 155, 191, 193).
- **S100.** A host's `[agents.programs.claude]` names the settings file
  its people's sessions get, which gives `tui = "fullscreen"`, a status
  line, an `env`, `permissions` with an `allow` list and a
  `defaultMode`, and `skipDangerousModePermissionPrompt`; its
  `settings` gives a status line of the host's own over the file's, and
  `[agents.streams.work.programs.claude.settings]` another for `work`.
  A repository's `[kinds.fix.agents.programs.claude]` names a file of
  its own giving `alwaysThinkingEnabled`. A fix in `work` starts with a
  file of its start's own holding work's status line, the people's
  file's `tui` and `permissions` without `defaultMode`, and the
  repository's `alwaysThinkingEnabled`, and with no `env` and no
  acceptance; status names each key with its layer and file, and the
  three left out with their owners. A fix in `default` starts with the
  host's status line. A host and a repository that give no entry start
  a fix with nothing passed, the account's configuration deciding (32,
  143, 195, 196).
- **S101.** Each of these launches is refused, naming the key, its layer
  and its file where it came from one, never a value, and makes
  nothing: one whose `--agent` gives Claude Code an `env`; one on a host
  whose own settings give `apiKeyHelper`; one in a repository whose
  kind's agents table gives `permissions.defaultMode`; one giving a
  status line whose command holds a value shaped as a token; one on a
  host whose named file's status line holds one; one on a host whose
  named file does not exist; and one in a repository whose named file
  lies outside it (4, 157, 195).
- **S102.** A host runs places in a fork of a project whose maintainers
  refuse a commit or a pull request that names an agent program, and
  in a repository of its own. The host's `[repos."<fork>".agents]`
  gives Claude Code's attribution with no text and no session link;
  the repository's own `.config/flume.toml` gives its own words in
  `[agents]`. Every agent of every kind in the fork starts with that
  attribution as the host wrote it, status naming it from the host's
  layer for the repository; every agent in the repository with its
  words, from the repository's layer; and an agent in a repository
  neither names with its account's own (32, 195, C.2, C.7).
- **S103.** A role's kind declares one stage whose agent runs on a pool
  of Claude Code accounts, its `[kinds.<kind>.agents]` giving
  `effort = "xhigh"`. One launch gives no effort, and its agent starts
  with `--effort xhigh`, status naming it from the kind. Another gives
  `--agent effort=max`, and its agent starts with `--effort max` from
  the launch. A third gives `--agent effort=med`, which Claude Code's
  profile does not take, and is refused naming `med`, `claude`, the
  stage and the launch, before anything is made. A host with no effort
  in any layer starts its agents with none, at what each account's own
  configuration gives (4, 32, 197, C.4).
- **S104.** A code agent stops short needing an answer on a host whose
  `[agents.streams.<stream>]` gives `keep_open = "10m"`, the host at its
  bound with a second place waiting for room. Status says the place
  waits on an answer, its agent kept open until ten minutes after the
  stop-short. No answer comes. The first settle after that time reads
  the agent let go by its time and, the agent being quiet, ends it, and
  the second place's stage starts in the room it freed. Status says the
  place still waits on an answer, its agent ended, since the
  stop-short. A message of the answer is refused, naming the retry; the
  retry starts a fresh agent whose prompt carries the question and the
  answer (42, 49, 53, 70, 198).
- **S105.** A construct agent stops short needing an answer, and within
  its hour another agent of its account reaches the account's usage
  limit. The next settle reads the account spent and the agent let go,
  and ends it once it is quiet. A second place's construct agent stops
  short, and its pane is gone after its host restarts; the next settle
  reads it let go, ended. Each place waits on its answer with its agent
  ended. Each answer, a retry, starts a fresh agent with the question
  and the answer, the first on another account of its pool (42, 96,
  146, 198).
- **S106.** A host whose terminal is herdr declares the stream `work`,
  naming no session of its own, and names the session `work-design`
  for the kind `research`, and the session `work-review` for the stage
  `review` of the kind `release`. A research place launched on `work`
  opens every stage's agent in herdr's session `work-design`. A release
  launched on `work` opens its review agent in `work-review` and its
  other stages' in `work`. A change and a fix launched on `work` open
  theirs in `work`. All four places count
  toward work's bound, its pool and their labels' shares as any of
  work's places does. A research place launched with `--agent
  session=review` opens every stage in `review`, and a conversation
  stage whose launch names a pane opens beside it. Status gives the
  research agent's session `work-design` from the stream's word for
  its kind, the review agent's `work-review` from its word for the
  stage, and the change's and the fix's `work`, from the stream's name.
  It gives work's sessions as `work`, `work-design` named for research
  and `work-review` named for release's review. When each place goes,
  its tab in each session it opened in is closed (32, 56, 70, 107, 137,
  143, 199).
- **S107.** A person asks flume to open `work-design`. herdr's session
  `work-design` is started headless where it does not run, and a
  window titled `work-design` opens attached to it, in which the next
  research place's agent appears. Asked to open `work`, the session of
  the stream's name, flume shows work's own session under work's
  title. Asked to open `review`, which is no session a stream's word
  gives, flume refuses naming `work`, `work-design` and `work-review`
  and starts nothing. The host's local layer then
  names `work-research` for research in `work`: the research agent
  running stays in `work-design`, and the next research start opens in
  `work-research`. A managed `[streams.work.kinds.research]` that also
  gives `label` refuses the next research start on `work` naming the
  key, and so does one naming `personal`, the session of the stream
  `personal`, naming both streams; every other start runs (4, 186, 190,
  199, C.7).
- **S108.** A host holds fifty places in three repositories. Some
  places' agents work, and one's agent asks a person. One place is held
  by its caller, one waits for room and one is submitted. One landed and
  was tidied, its document kept for an end pending. One landed and its
  teardown failed at `sluice release`, with forty lines of words. The
  host's terminal is herdr, and it declares the streams `work` and
  `office`, herdr's session `work` running and `office` not. A caller
  asks for the list. Within a second flume gives the line of each place
  but the two that landed, under its repository, with its stage and its
  state. The held place waits on its caller, the one waiting for room on
  the host, and the submitted one on the merge queue. Asked for every
  place, flume gives the two landed places' lines too: the tidied one
  reads tidied, and the one whose teardown failed is kept by `sluice
  release`, with none of the teardown's words. The list
  gives a line each for `default`, `work` and `office` with its
  session: `work` runs, and `office` and flume's own do not. No place's
  worktree, change or submission is read, and no agent's state is
  asked of herdr. herdr's session `office` is not started, and nothing
  flume holds changes (57, 62, 63, 66, 70, 130, 200, 201).
- **S109.** On a host whose runner keeps watch, each of its passes
  running `flume settle --every 2m`, a chore's code stage delivers, its
  agent ends, and flume submits the place, which starts sluice's host
  process. No caller asks anything else of flume. At each pass flume
  settles every place, the chore's among them with no agent in it, and
  reads its submission, driving no round of the queue, which sluice's
  host process moves on its own. Where that process ended before the
  submission was decided, the next settle's read starts it again. The
  submission lands, and the next settle delivers the landing to the
  chore's recipient and tidies the place (46, 124, 125, 208, C.6;
  sluice 135).
- **S110.** A caller launches a base place of its own kind with no
  stages on `main`. flume asks sluice to make its branch, makes no
  worktree, and starts no agent. The caller launches two changes on
  that branch: each is cut there, runs through, and is submitted to it,
  and the host's watch steps the branch's queue until both land. The
  base place waits on its caller. The caller retries its submission:
  flume submits its branch by name from the repository, the watch steps
  `main`'s queue until it lands, and flume reads the landing from
  sluice's record of the branch and delivers it to the base place's
  recipient. flume tidies the base place, removing no worktree, and
  sluice removes its branch into `main`. The two changes' places,
  tidied once they landed, took their branches with them. No command
  of the caller's drove any queue (63, 67, 202 to 206).
- **S111.** A caller retries a base place's submission while one change
  on its branch still works. The retry is refused, naming the change.
  The change lands, and the retry submits the base place. While that
  submission is open, a launch of a fix on the base place's branch is
  refused, naming the base place. A launch of any place on a live
  change's branch is refused, naming the change (10, 203, 204).
- **S112.** A base place's kind names no fix, and its submission to
  `main` fails: a check of `main`'s fails on it. (flume record 0056's amendment of 2026-11-07.)
  flume starts nothing; the base place waits on
  its caller with sluice's words, delivered to its recipient. The
  caller launches a fix on the base place's branch with those words as
  its brief. The fix lands on the branch, and the caller retries the
  base place's submission, which lands. Had the submission conflicted,
  the fix's agent would have merged the revision of `main` sluice
  tested against into the fix's branch first (112, 203).
- **S113.** A host restarts while a research place's talk, a
  conversation, waits on its person under work-1. herdr brings the
  agent back bare in its pane, resuming its session. flume reads talk
  lost, delivers it saying it left the agent in its pane, and leaves
  it. The caller retries talk while the person asks the bare agent two
  more questions. talk waits for its conversation to end, status naming
  the bare agent's process, and flume sends it nothing. The person ends
  the bare agent. The next settle starts talk under work-1, resuming
  the session. The new agent says it started in the session its start's
  record names, and its prompt is flume's words. Its conversation holds
  the person's two questions and their answers. Status gives work-1 as
  the conversation's and says the start carries the conversation of
  start 1, lost (43, 45, 49, 56, 77, 145, 161, 179, 207).
- **S114.** A research talk is lost with its terminal under work-1, and
  work-1 is spent until 15:00 when the caller retries it. The pool's
  other account, work-2, reaches the conversation, as the host made it,
  and talk starts under work-2 carrying it. Status says the stage moved
  from work-1 to work-2 with its conversation. On a host whose accounts
  share nothing, talk starts afresh under work-2 with its prompt,
  flume's words and the retry's words. Status then says the
  conversation stayed and why, naming `CLAUDE_CONFIG_DIR` (49, 145,
  146, 179).
- **S115.** A research talk is lost, and its transcript is gone from its
  account's configuration home before the caller retries it. talk
  starts afresh under the same account with its prompt and flume's
  words, and status says its conversation's transcript cannot be read
  (49, 179).
- **S116.** The host restarts while a code stage's agent works, and
  herdr brings the agent back bare. flume reads code lost and ends the
  bare agent once it is quiet. The caller retries code. Its fresh agent
  resumes no conversation, and its prompt is code's with the retry's
  words (39, 45, 49, 77).
- **S117.** Five research talks are lost with their host. Before any
  retry, a caller resumes each one's session by hand, in a pane of its
  own, under work-3 and in another mode. The person talks in them,
  while each talk still reads lost. The caller retries all five.
  Each waits for its conversation to end, status naming its process,
  and flume closes and sends nothing in those panes. The caller drops a
  sixth place whose session a person runs by hand: flume keeps its
  worktree, naming the process, until the process ends. The person
  ends one talk's session. The next settle starts that talk carrying
  its conversation on the account its lost start ran under, with every
  turn the person took by hand, and the other four keep waiting (30,
  49, 56, 64, 145, 179, 207).
- **S118.** A host keeps no runner, and its terminal is herdr with
  flume's plugin. Status says no caller keeps watch. A chore's code
  stage delivers, and the settle its agent's quiet runs ends the agent
  and submits the place (121). Nothing settles after it, herdr and its
  plugin settling nothing, until the operator drops another place, and
  that command settles every place first, stepping the chore's base.
  The runner then starts on the host, its passes running `flume
  settle --every 2m`. Status gives the watch's bound and when it last
  settled, and the chore lands at a later pass with no command of the
  operator's. The runner stops, and four minutes after its last pass
  began status says no caller keeps watch and since when, and the
  operator's next drop settles every place first again (46, 119, 122,
  208).
- **S119.** A change is launched naming no version in a repository
  whose lock records none, and runs change@3. Its construct writes four
  task groups, each task naming its own check, such as one test by name
  or one package's tests, and no task running the repository's whole
  checks. One agent codes the whole change, running each task's check
  as it goes, and status gives its stage as `code` with no group count.
  Its verify stage runs the repository's whole checks once, finds them
  passing and the specs met, and archives the change (22, 154; flume
  record 0054).
- **S120.** A base place's kind names flume's own fix for its fixes,
  and both changes on its branch have landed; no caller
  retries its submission. Another place lands on `main` a change to
  `README.md`, which the base place's branch changed too. At the host's
  next watch, flume forecasts the branch against `main` through sluice
  and finds it in conflict on `README.md` at `main`'s new revision. It
  launches a fix on the branch, named for the base place and its first
  fix, with sluice's words as its brief, in the base place's stream and
  delivering to its recipient. The fix's agent merges that revision in,
  resolves `README.md`, and the fix lands on the branch. The next
  forecast is clear, and the base place waits on its caller, who
  retries its submission, which lands. Status gave the fix as launched
  by flume for the base place. Had `main` moved twice more under it,
  each move conflicting, its kind's bound of two fixes would have been
  spent. The base place would then have waited on its caller, said and
  delivered (23, 43, 130, 203, 210). (flume record 0056's amendment of 2026-11-07.)
- **S121.** The runner launches a fix naming the planner's address and
  itself its recipients. No pane holds the runner's name, so no notice
  of the fix's ends goes to it, and each stays pending for it. The
  fix lands, and the watch's settle that reads the landing tidies it at
  once: its worktree and branch go, and the landing is delivered into
  the planner's run. The place's document stays, pending for the runner
  alone. The runner's next pass reads it from status, landed with its
  commit, and carries it to its control plane. Only once its control
  plane has taken that report does the runner run `flume confirm` as
  itself, naming the delivery key of each end of the fix still pending
  for it. The settle after that removes the document. Had the
  runner's report been lost before its control plane took it, each end
  would still be pending for the runner, and its next pass would carry
  them again. A person who drops another of the runner's places by hand
  leaves its document likewise, its drop pending for the runner. No
  notice of the drop is sent, and no run of the planner is woken for it
  (7, 43, 52, 62, 132; record 0060, accepted by the user 2026-11-08; agentplot/boomdrive record 0030 as amended on 2026-11-09,
  accepted by the user that day).
- **S122.** A unit's construct stops short naming the planner's
  address, and the settle that reads it wakes a planner run. The run's
  start runs `flume inbox` and is handed the stop-short, and the run is
  ended before it answers or confirms it. The stop-short stays pending
  for the address, status giving its hand-over by the inbox, and no
  run is woken for it again. The unit's next end wakes a run, whose
  inbox is handed both; it answers the question and has both keys
  confirmed, by `flume confirm` naming both as the planner's address,
  which the runner runs at the ask of the role's control plane (section
  9, the runner's row), and both are delivered (42, 43, 132; weir 102,
  103; flume record 0061, accepted 2026-11-09; crew's record 0056).
- **S123.** A fix is launched naming a recipient misspelt, and lands.
  No pane holds the name and nothing collects it, so the tidied
  document stays. A week after the landing was read, status gives the
  fix's ends expired for that recipient, a name under which nothing
  was ever confirmed, and the host's status lists them; a drop of the
  document is refused naming the recipient. The operator runs `flume
  confirm` as that name with the ends' keys; they are delivered, the
  name is known, and the next settle removes the document and lets go
  of its deliveries (43, 56, 62; weir 104 to 107; flume record 0061,
  accepted 2026-11-09).

- **S124.** The operator talks with a research place's conversation,
  whose kind hibernates it, and leaves it for the evening. An hour after
  the agent's last turn, with no question open and no own work, the
  host's watch settles and flume hibernates the stage: it ends the
  agent, its room and its account are freed, and status gives the stage
  hibernating since then, idle. Next morning the operator messages the
  place. flume resumes it: a fresh agent under an identity of its own
  goes on with the session on the account it ran under, the message as
  its first prompt, and the conversation carries on until the operator
  finishes it (109, 212, 213, 53; flume record 0065, proposed).
- **S125.** A code stage's agent, of a kind that hibernates, stops short
  needing a person's answer. Kept open its hour (198), it is then
  hibernated in place of being let go, and the place still waits on its
  answer. Three hours later the answer comes as a message naming the
  stop-short's key; flume resumes the agent's session with the question
  and the answer as its prompt, and the stage delivers (42, 198, 212,
  213; flume record 0065, proposed).
- **S126.** A standing ops role is working a failed landing when two
  messages and an end arrive for its address. Nothing is typed into its
  session while it works, and the operator's half-typed words stay in
  its input box. When it goes quiet, flume hands the three as one
  prompt through the Claude Code plugin's deliver mod, and the role
  takes them in its next turn (214, 215, 54, 121; flume record 0065,
  proposed).
- **S127.** A conversation hibernated forty days is resumed on a host
  whose account homes set no `cleanupPeriodDays`. Claude Code cleaned
  its transcript at thirty days, so carry answers that it is gone, and
  the stage starts afresh with flume's words that its conversation could
  not be carried and that what it committed is in the place (179, 213,
  C.4; flume record 0065, proposed).
- **S128.** A standing ops role is asked to roll a fix out to staging
  and to look into a failing nightly job. It launches each as a place of
  a kind its entry names by flume's MCP `launch`, naming no recipient,
  and hibernates. Both
  places run in their own panes, beside every other place in the
  multiplexer. The job's place stops short with a question, which
  reaches the role's address and resumes it; the role answers and
  hibernates again. When both deliver, their ends reach the role as one
  batch, and status gave the two places under the role while they ran
  (7, 132, 193, 213, 214, 56; flume record 0065, proposed).

<!-- ANCHOR_END: scenarios -->
<!-- ANCHOR: deliver -->
## 12. What to deliver

A model of flume that satisfies Parts A and B: its components, a place's
record and its states, how a stage's end is read for each form of
deliverable and for a conversation, how a prompt and a message are
delivered, how the stop check and the guard hold an agent, how a place
is submitted and sent back after a failed submission, how a place
settles while a caller keeps watch over the host and while none does,
and how a place is tidied, with fixed examples, and how a kind, an agent
program and a terminal are added. A conformance suite whose scenarios
each cite the clauses they exercise, failing when a clause is cited by
nothing. The profiles of Part C, each passing the suite.

<!-- ANCHOR_END: deliver -->
