# Open questions

What the design does not settle, and where each question is held. A
question leaves this page when the operator rules; the ruling lands in
the design, and the chapter that rests on it is rewritten whole.

## flume's statement

flume's statement of invariants, `design/flume/requirements.md`, is to
come (`design/capture/plan.md`, step L1). It is written from the
capture design and from the crew rules flume takes over, `teams.1`–`4`,
`teams.11`, `teams.15` and `plan.9`, `10`, `12`, `17`. It states a
launch, places, kinds and stages, prompt delivery, stage ends, status,
tidying, and what flume never does. A fresh model then reconstructs
flume from the statement alone, and the operator rules the questions
it asks.

The statement becomes this book's appendix, and the chapters cite its
clauses by number. Until it lands, the chapters rest on the capture
design, `design/capture/design.md`, and cite crew's rules by id. crew's
record gains an ADR, "crew calls flume for each place and stage", and
the rules flume takes over are amended to name it (plan steps C1 and
C7).

## The decision awaiting a ruling

The capture design's decision 12 awaits the operator's ruling
(`design/capture/plan.md`, step D2). Each chapter states it as the
design has it.

12. flume is a standalone tool that launches and tracks one agent in
    one worktree through a kind's stages on the host it runs on, taken
    from crew's places and stages. millpond's send, headwater's fix
    key, sounding and crew call it; millpond keeps the item's record
    and flume the live state of each place
    ([Who launches](launchers.md)).

## Held by the design

### A repository's kinds

The capture design's own Open section asks how a repository declares
its kinds and their prompts, and how crew's stage prompts move into
that form. crew's units run stages flume's change does not name, a fix
round, a settle stage and a merge stage (`teams.14`, `teams.17`), so
the form decides how crew's work runs on flume
([Kinds and stages](kinds.md#a-repositorys-own-kinds)).

## A question's branch

The capture design gives a question's place two branch names. flume
names a place's branch `<kind>/<name>`, which makes a question's
`question/<name>`. The section on sounding names it `sounding/<name>`,
"which flume makes and runs as the kind `question`", and sounding's
guard refuses a submission from `sounding/*`
([sounding's place](../sounding/place.html)). One name stands, or a
kind names its branch's prefix.

## Left to the statement

The capture design leaves these details of flume's open. Where a
chapter needed an answer, it takes crew's, as the rule cited beside
each says, and the statement confirms or changes it.

### What `/launch` takes

`/launch <brief>` names only a brief. Which repository and kind it
takes, and the name flume gives its place, are left to the statement,
and the same holds for the herdr plugin's launch key
([Who launches](launchers.md#from-the-operator)).

### The rest of flume's details

- **Where the declaration that readies a place lives.** The design says
  "the repository's own declaration of what a worktree needs". The
  chapters take crew's: the toolchain and the runner's setup the
  repository declares for sluice (`plan.17`).
- **A place that cannot be made ready.** crew starts a fix's agent all
  the same, told the failed step and its words, since a fix is how a
  broken branch is repaired (`teams.3`). It refuses a unit's or a
  chore's stage until its place is ready (`plan.17`). Which kinds start
  their agent when readying fails.
- **Where a place's branch starts, and its target.** A launch names a
  repository, a kind, a brief and a name, and no branch to start from
  or land on. millpond's and headwater's launches land on the
  repository's shared branch, and crew's on a bolt.
- **Deliverables the design does not name.** For a fix's code stage
  the chapters take a commit made since the stage began, as crew's
  settle stage has (`teams.14`). Where verify's report sits, and
  whether a finding verify marks fix runs code once more, as crew's
  fix round does (`teams.17`).
- **A change's submission:** whether the stage archives the OpenSpec
  change on its branch before it submits, as crew's merge stage does
  (`teams.17`).
- **How a caller drops a launch.** The command line names `launch`,
  `status`, `tell`, `stop`, `retry` and `tidy`. How a caller marks a
  launch dropped, so tidying takes its place, as sounding's drop and
  crew's drop of a fix need.
- **How crew starts one stage.** crew starts each stage of its work
  through flume and reads its end from status (plan step C7). How it
  starts one stage in a place flume made, a settle stage or a fix round
  among them, which no kind names.
- **crew's names.** crew names a fix's branch for its bolt as well as
  its own name (`teams.3`), and flume names a place's branch
  `<kind>/<name>`. How crew's names take flume's form is settled when
  crew's rules are amended (C1, C7).
- **flume's limit:** how long a stage stays quiet before flume reports
  it stuck, and who sets it.
- **Reading a question in the pane.** crew reads a question open in an
  agent's pane from a mark its own hook leaves until the transcript
  holds the answer (`teams.11`). flume's Claude Code plugin, as the
  design gives it, holds `/launch` and the status tool and no hook. How
  flume gets that second reading.
- **A printed command:** how a stage's agent started as a command the
  operator runs carries its prompt, and how flume reads that it accepts
  input with no herdr pane to read.
- **Agents other than Claude Code.** flume confirms a prompt, and reads
  what an agent that stopped short needs, from the agent's transcript.
  Flywheel's statement makes nothing in its machinery depend on one
  agent program's transcript (173). Which agents flume starts, and how
  it reads another program's record.
- **What accept and drop do to a question's place.** sounding's
  statement rules what accept does to a sounding's worktree and branch,
  and whether drop deletes the branch, and with them when flume tidies
  a question's place
  ([sounding's open questions](../sounding/open.html)).
- **Launching on another host.** flume runs on one host and launches
  there. How a caller on one host reaches the flume of another, as a
  crew team on a remote host needs.
