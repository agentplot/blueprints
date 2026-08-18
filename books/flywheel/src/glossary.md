# Glossary

The flywheel's ubiquitous language. One definition per term; prose
elsewhere in the book uses these terms and never paraphrases them.
Terms follow Domain-Driven Design names where a DDD pattern applies.

**operator** — the human who owns the flywheel's judgment: answers
questions, approves chapters and plans, reads run reports.
One person per fleet in practice; the role, not the head-count, is
what the design fixes.

**built repo** — a repository the flywheel drives work into. It
carries an OpenSpec root, merge gates, and a worktree layout the
construction loop assumes. The flywheel's own repo is a built repo
like any other.

**design book** — the destination-first mdBook for one system; the
only durable statement of where that system is going. Chapters are
settled enough to build from without further interviewing.

**intent** — one design thread for one subject: a milestone
(`intent/<slug>`) holding questions and scheduled writing work, plus a
change directory in git holding its records. An intent burns
questions into decisions and synthesizes them into the design book.

**question** — a unit of uncertainty, filed as a tracker item on an
intent. The only work object that reaches the operator unsolicited.

**decision** — the resolution of one or more questions, written by a
design session as a file in the intent's change directory. A decision
is the session's deliverable; its content is synthesized into the
design book, and the file carries only what the chapter cannot — the
options weighed and the reasons against the losers.

**elaboration** — a batch of design work: a parent tracker item whose
sub-issues are the questions and writing tasks one design session
works. One elaboration is one round of its intent, and its title
carries the round's number.

**bolt** — the operator's delivery boundary: a milestone
(`bolt/<slug>`) and a branch, alive for days, holding the units built
inside it and landing to main once. The bolt type chosen at creation
sets which review stages its loop schedules.

**bolt plan** — the derived cut of construction work: the difference
between a design book and a built repo's implemented specs, carved
into a bolt of sequenced units, every task citing the chapters it
derives from. Written by the bolt planner as documents made for an
annotation round — the bolt summary on the milestone, one unit
document per card — each unit approved by the operator moving its
card to Ready.

**bolt planner** — the session the server charges when a system's
cards are missing or stale on a settled book, after a landing, or on
the operator's ask. It reads the design book, the implemented specs,
and the changes in flight; its only tracker write is the plan cards
it files at Backlog.

**board approval** — the operator's one approval gesture: moving a
batch's card to Ready on the org Project board. It approves an
elaboration for design or a plan card for construction, and it is
doable from a phone.

**unit** — one batch of construction work inside a bolt: a plan card
the operator approved, expanded by the bolt loop into the batch
parent whose sub-issues are its tasks. Several units land on one bolt
over its life.

**work order** — the prompt a loop composes to charge a session: an
invocation line naming the command or skill, then a brief. Work
orders carry the change id and the goal; they carry no tracker
narrative.

**session** — one agent process working one charge: a design session,
a construction session, or dispatch. Sessions hold the judgment the
loop programs deliberately lack.

**dispatch** — the standing singleton session that triages raw ideas
into tracker items and relays questions between the operator and the
machinery. GitHub and chat only; no checkout.

**run record** — the machine-readable account a loop appends as it
acts: every tracker write with its reason and the board view it lands
in, every session charged and its outcome, every merge. The record of
the two inputs build-time tests cannot pin — what sessions did, and
what the tracker was made to say.

**hold** — the state of a loop the operator is repairing: each pass
writes the tracker writes it intends and waits for `flywheel
approve`. A trusted loop runs unheld; the run record is written
either way.

**run report** — the operator-facing rendering of a run record: what
changed on the board and why, expected versus actual where a session
was involved, mismatches first. The evaluation surface for the
machinery; findings about the machinery travel here, never into the
tracker.

**fleet** — the set of hosts and loops one operator runs for one
GitHub organization, declared in `fleet.yaml` and driven by the
server.

**server** — the daemon (`flywheel server`) that reconciles every
sixty seconds: reads the tracker, starts one loop process per
milestone with work, stops nothing by force, records what it does.

**machinery** — the flywheel itself: the loop programs, the server,
the schemas, the session profiles. Distinct from every built repo it
drives, including its own.
