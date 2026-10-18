# Glossary

The words of the design, each defined once. flume has no statement
yet, so the capture design (`design/capture/design.md`) is the binding
copy. The words of millpond and of crew that millpond's book defines
are [millpond's book](../millpond/glossary.html)'s, word for word, and
a sounding's words are [sounding's book](../sounding/glossary.html)'s.
A number in parentheses cites Flywheel's statement, and a rule id in
backticks cites crew's `docs/architecture/`.

Three words mean one thing elsewhere and another here. millpond's
**kind** is a signal's type, one of five, while flume's is a launch's
list of stages. An item's **brief** in millpond, and a release's in
headwater, each becomes a launch's brief when its caller launches it.
sounding's **question** is what a sounding works, while flume's is the
kind that runs a sounding's session. Each word keeps its meaning in the
book it belongs to.

## flume's words

| word | meaning |
|---|---|
| **agent** | the program a stage starts in a place, fresh for each stage, in a herdr pane or as a command flume prints; it is working, waiting or stopped |
| **brief** | the text a launch hands its first stage's agent: an item's brief from millpond, a release's from headwater, a question from sounding, or the operator's own words |
| **change** | the kind whose stages are construct, code, verify and a submission; its work is an OpenSpec change |
| **code** | the stage that builds the work: a fix whole, or a change's tasks, each ticked as it is done |
| **construct** | a change's first stage, which writes the OpenSpec change from the brief and commits it |
| **deliverable** | what flume reads a stage's end from, in the place or on the host: a file, a commit, ticked tasks, or a record such as sluice's |
| **fix** | the kind whose stages are code and a submission; its work needs no OpenSpec change |
| **flume** | the tool that launches and tracks one agent in one worktree through a kind's stages, on the host it runs on, and tidies the place when the work lands or is dropped |
| **kind** | a list of stages, each naming its prompt and its deliverable: fix, change, question, or one a repository declares |
| **launch** | one start of work, given by a caller: a repository, a kind, a brief and a name; one launch is one place |
| **live state** | what flume reports of a place while it runs: its kind, stage, agent, deliverable and submission; it goes when the place is tidied |
| **never started** | a stage whose prompt the agent's transcript still lacks after a second sending |
| **OpenSpec change** | a change written as OpenSpec keeps one: its proposal, design, specs and tasks, in the repository |
| **place** | a worktree flume makes for one launch, at `<repository>/places/<kind>--<name>` on the branch `<kind>/<name>`, made ready by the repository's declaration; flume removes it once the work lands or the launch is dropped |
| **prompt** | the text a stage's agent is sent at its start, confirmed in the agent's transcript |
| **question** | the kind with one stage, a sounding's session, which ends on `sounding conclude` and has no submission |
| **ready** | a place is ready once the toolchain its repository declares and its runner's setup have run in it |
| **stage** | one step of a kind, worked by one fresh agent from its prompt, ending on its deliverable or on its agent stopping short |
| **stop short** | an agent ending without its stage's deliverable and saying what it needs |
| **stopped** | the state of an agent that has exited |
| **stuck** | a stage quiet past flume's limit with no deliverable and no word of what it needs; reported, never ended |
| **submission** | a fix's and a change's last stage, which submits the place's branch to sluice and ends on its landing; in sluice, one head offered to one branch ([sluice's glossary](../sluice/glossary.html)) |
| **target** | the branch a place's work lands on through sluice; tidying judges the place's branch against it |
| **tell** | text for a place's agent, which reaches it as a prompt or not at all (`teams.11`) |
| **tidy** | to remove a place whose work landed or was dropped, through the repository's own worktree tool, with its branch unless the branch holds a patch its target lacks |
| **transcript** | an agent's own record of its session, where flume confirms a prompt and reads what an agent that stopped short needs |
| **unknown** | a start flume cannot yet read, its transcript not written; flume watches it until the transcript tells |
| **verify** | a change's stage that checks the code against the change as written and reports each finding |
| **waiting** | the state of an agent that stopped short and said what it needs, or that waits on a question in its pane |
| **working** | the state of an agent at work on its stage |

## crew's words

| word | meaning |
|---|---|
| **conductor** | in crew, the agent that runs one team's work through its stages |
| **dispatcher** | in crew, the agent that gives each team its next bolt |
| **fix round** | in crew, a fresh code stage after verify that fixes each finding verify marked fix (`teams.17`) |
| **merge stage** | in crew, a unit's last stage, which archives its OpenSpec change on its branch and submits it to the bolt (`teams.17`) |
| **settle stage** | in crew, a stage that resolves a conflict between two units in the later unit's place (`teams.14`) |
| **slot** | in crew, one of a team's positions for work in flight, holding one unit, chore or fix and its agent at a time |

## Words from sounding's book

sounding's book defines these, and this page gives its definitions
word for word.

| word | meaning |
|---|---|
| **conclusion** | what a sounding ends on: the answer, its evidence, what it would change, the work it proposes and what stays open; the operator accepts it, sends it back for another round, or drops it |
| **drop** | the operator's answer that records the reason and removes the sounding's worktree |
| **go on** | the operator's answer that starts the next round in the same worktree: the conclusion moves to `rounds/<n>.md` and the operator's notes join the question; the herdr plugin's send back |
| **round** | one session's run at the question, from its start hook to its conclusion; go on starts the next |
| **sounding** | one question, worked by one session in one place, ending on one conclusion; also the tool that runs them |
| **stop check** | the hook at a session's end that sends it back unless it wrote a conclusion or a note saying where the next round would start |
| **waiting on the operator** | the state of a sounding whose conclusion, or whose ask, the operator has not answered |

## Words from millpond's book

millpond's book defines these, and this page gives its definitions
word for word.

| word | meaning |
|---|---|
| **bolt** | in crew, a team's branch of work: its units and chores land on it, and it lands on the shared branch |
| **capture** | the record of one source event: its key, its source, its event date and a pointer to its raw material; the same event captured twice is one capture (111) |
| **chore** | in crew, a piece of work that needs no design of its own, such as a tool's bump; a `route` move offers one |
| **inbox** | a git repository, or a branch in one, holding captures, signals, moves and items in Flywheel's record formats |
| **item** | the unit of work: the signals curation joined, one or many, with its brief and its sends; Flywheel's proposed intent (109) |
| **operator** | the person who accepts or changes each batch of moves, sends items, and decides each conclusion; on its own, the user |
| **planner** | crew's agent that orders items across teams and turns each into a chore or a unit |
| **send** | millpond giving one item to flume, as a fix or a change with its brief, or an item that asks a question to a sounding |
| **unit** | in crew, one designed piece of a team's work, landed on its bolt |
