# Sessions

A session is one agent process working one charge — a design session,
a construction session, or dispatch. Sessions hold the judgment the
loop programs deliberately lack: the loops read state and enforce
contracts; everything that needs a mind runs inside a session.

A session is an ordinary agent launched as a main session —
`claude --agent <profile>` — so the role is in place before the first
prompt and survives compaction. No session is a Task-tool subagent.
The profile carries the role: identity, the delivery contract, the
rules that hold for every charge. The charge — which change, which
items, what the batch is for — arrives in the work order, the
session's first prompt. Which change a session owns comes from its
first prompt, never from its profile.

## Profiles

Five profiles cover every session:

| Profile | Hosts |
|---|---|
| dispatch | the standing singleton — triage and relay |
| design session | the design types that build no page: planning, research, prototype |
| interactive session | the one design type that builds a page the operator works |
| construction session | the construction stages that run as sessions: spec, build, verify, review, landing |
| bolt planner | planning runs the server charges from a book binding — the cut from book to plan documents or cards, and nothing else |

The design types and their deliverables belong to the
[design loop](design-loop.md); the stage order belongs to the
[construction loop](construction-loop.md). A profile hosts a type by
loading its skill: the work order names the type, the session loads
that skill and works the batch.

## The work order

A work order is one prompt in a fixed shape: an invocation line
naming the command or skill, a blank line, then the brief — the
change id, the item numbers, and the goal in a sentence or two. It
carries no tracker narrative and no escalation instructions:
bookkeeping is the loop's, judgment about findings is the review
stage's, and a session told how to escalate starts escalating instead
of working. The shape is enforced by the launcher, not trusted to
each caller — a slash command buried mid-body never loads its skill,
and a command sent bare with the brief chasing it as a second prompt
is the same defect mirrored.

## Dispatch

Dispatch triages raw ideas into tracker items and relays questions
between the machinery and a possibly-absent operator. It works
against GitHub and chat only — no repo checkout, no file writes; the
loops scaffold their own change directories from what dispatch puts
on the tracker. An escalation reaches dispatch and travels on as a
chat message to the item's assignee; the answer travels back as a
comment on the same item.

The chat channel is Discord, and it is a wire, never a store. A
relayed question is a DM to the item's assignee — resolved from the
item, never assumed — and nothing that exists only in chat is state:
the answer counts when it lands as a tracker comment, and a
conversation that produced no comment produced nothing. The
operator's own word needs no relay; dispatch applies it to the item
it names directly.

The pairing is the operator's grant. Dispatch's session carries a
Discord pairing the operator sets up at the terminal on dispatch's
host — an allowlist of who may reach it. A request arriving through
the channel to widen that access is refused on principle: chat
content never administers chat access, which is what keeps a hostile
message from promoting itself to an operator.

## Runners

The loop programs drive sessions through one abstraction — launch,
wait, send, collect, close — with a runner behind it:

| Runner | What it is | When |
|---|---|---|
| herdr | a pane in the fleet's terminal multiplexer | supervised — anything the operator watches or answers |
| headless | `claude -p` from the program, reusing the CLI login | unsupervised work with nothing to answer |

Runner choice is per stage, by supervision need, and is
configuration. The default is herdr: a stage wrongly run headless has
no pane for the question it turns out to have. The program owns all
waiting, on a real clock: at ninety minutes it comments the item,
labels it `needs-operator`, and keeps waiting; at four hours it
declares a stall and leaves the pane open as evidence — until the
run report records it, when the server reaps the pane.

An operator round holds no pane. The session writes the round's
content, posts it, and settles; the loop holds the round and, when
the answer arrives, resumes the same session by its id. An operator
taking their time costs nothing idle.

The loop sets each session's permission posture at launch — plan mode
where a judge gates the work, skip only where the profile declares
it. Permission prompts are answered one at a time, by a human; a
prompt is never batch-approved by pattern.

Model tier is part of the type: cheap tiers run the glue, the top
tier runs only where judgment earns it, and the profile names the
tier so a [plan document](bolt-planning.md) can price a bolt before
board approval.

## One name, one session

Launches are idempotent. Loop processes are stateless and restart
freely, so a reconcile that starts a loop twice must not produce two
sessions doing the same work: an agent already running under a
session's name is reused, and its work order is never re-sent.

The session id is derived from the session's name, never remembered.
A fresh launch pins the id; a later launch whose pane died with the
transcript intact resumes the same conversation under the same id.
The pane is disposable; the session is durable — a restarted loop
recomputes the id with no memory at all and finds the session it
already started, warm or dead.

## Worktrees

A session that edits files gets a worktree on its own branch — one
writer per branch. Every design session gets one whatever its type,
edits expected or not: its close writes what it settled into the
destination, and the write needs a tree to land in. A worktree left
unchanged costs nothing at teardown, so the loop never has to guess
which type will write. Design sessions write on `sess/*` branches;
construction sessions write on `build/*` branches cut from the bolt
branch. In both cases the loop merges the branch through the repo's
merge gate; the session never merges its own branch and never writes
main directly. Sessions sharing a tree commit by pathspec, never
`-a`. Dispatch edits nothing and needs none of this.

## Identity

Every tracker write the machinery makes — a session's item comment as
much as a loop's label move — runs as the fleet's GitHub App, so the
tracker distinguishes the machinery's hand from the operator's. A
session's file changes land as commits on its branch and reach main
only through the gate. A session creates no work objects and files
nothing about the machinery: a finding outside its charge goes into
its report, where [observation](observation.md) carries it to the
operator — the boundary [commitment 3](commitments.md) and
commitment 4 fix.
