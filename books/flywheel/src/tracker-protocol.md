# The tracker protocol

GitHub Issues on one repo per fleet hold every mutable work item;
durable prose lives in git ([commitment 1](commitments.md)). An item's
labels are its state, its comments are its narrative, and its
milestone is its home loop. Every machinery write runs as the GitHub
App, under the identity `flywheel-token` mints; `flywheel-setup`
converges the labels, the org Project, and its fields.

## Milestones and batches

| Milestone | Holds | Closed by |
|---|---|---|
| `intent/<slug>` | one design thread's questions and writing work | the operator, when the thread is settled |
| `bolt/<slug>` | one bolt's unit cards and the items expansion files beside them; the description carries the bolt summary | the operator, once every unit is merged and every card ruled — the close releases the landing, and the archive follows it |

A batch is a parent issue whose sub-issues are the work one board
approval covers:

| Label | Kind | Born when |
|---|---|---|
| `elaboration` | design work for one [design session](design-loop.md) | dispatch or the operator queues design work on an intent |
| `plan` | one proposed unit on its bolt's milestone, its [unit document](bolt-planning.md) as the card body | the bolt planner creates the milestone and files one card per unit, at board Backlog |
| `unit` | one approved unit's batch parent | the bolt loop expands an approved card — the card becomes the unit |

The batch parent sits on the org Project board and carries GitHub's
native sub-issue progress bar; sub-issues stay off the board, and an
item joins exactly one batch, ever.

An intent carries at most one elaboration awaiting approval: while one
sits at Backlog, newly queued questions join it rather than being born
into a rival batch beside it. Each elaboration is titled
`Elaboration: <slug> — round N`, where N is one more than the number
of elaborations already on that milestone, open or closed; a batch
that gains members after birth keeps the number it was born with. The
number is the operator's reading of the thread — the board shows one
row per round — and nothing consumes the title.

## `state:*` — the queue lifecycle

| Label | Meaning |
|---|---|
| `state:queued` | identified and batched, awaiting approval |
| `state:ready` | approved; the loop picks it up |
| `state:in-progress` | a session is working it |

An open item carries exactly one state label. Only the operator's word
makes ready — the batch moved to board Status Ready; the owning loop
relabels its queued sub-issues `state:ready`, then `state:in-progress`
as it charges each session.

## `stage:*` — the leading edge inside `state:in-progress`

A stage label refines the state label and never replaces it; an item
carries at most one, naming how far it has reached.

| Label | Ladder | Meaning |
|---|---|---|
| `stage:planned` | construction | the item's spec validates |
| `stage:built` | construction | the change is applied; a commit is on the item's branch |
| `stage:verified` | construction | verify came back clean |
| `stage:merged` | construction | on the bolt branch, awaiting the landing |
| `stage:in-session` | design | a design session is carrying it |
| `stage:done` | design | the operator ruled the elaboration finished — written on the batch parent, never per item; the intent loop collects the set on this signal |
| `stage:collected` | design | its deliverables are gathered |

## `closed:*` — the end reasons

| Label | Meaning |
|---|---|
| `closed:done` | finished; evidence on the item |
| `closed:merged` | merged to the bolt branch, awaiting the landing |
| `closed:declined` | not doing it; the reason is on the item |
| `closed:superseded` | overtaken by another item |
| `closed:parked` | waiting on an external event; reopenable |

A closed item carries exactly one reason. A construction item closes
`closed:merged` at merge-back, advancing the unit parent's progress
bar; the landing upgrades the reason to `closed:done` with its SHA.

`needs-operator` marks a live wait: the question is the latest
comment, and whoever applies the answer removes the label. Dispatch's
relay comment marks delivery — the server nudges only undelivered
items and again only when a new question lands, so a delivered relay
is never re-nudged. A relay dispatch cannot deliver goes to the run
record: undeliverability shows in the report, never as a silent
retry.

## Who writes what

| Actor | Writes |
|---|---|
| the loops, as the app | milestone and item creation when expanding an approved plan, state moves inside an approved batch, `stage:*` moves, closures with their reason, the comments carrying merge SHAs and session reports |
| the bolt planner, as the app | the bolt milestone with its summary, and one plan card per unit at Backlog — its only tracker writes |
| dispatch, as the app, on the operator's dictation | a plan card for work the operator states exactly — the milestone created when no open bolt fits, the card at Backlog, never Status Ready: the word that authorizes filing is not the gesture that starts the work |
| the operator | board Status Ready — the approval — `stage:done` on the finished elaboration, milestone closes |
| dispatch, as the app | question items, milestone routing at triage, relay comments on `needs-operator` items |

No other actor creates tracker items, and nothing is created for an
unapproved plan beyond its one card. Findings about the machinery are
never issues; they travel through [run reports](observation.md)
([commitment 4](commitments.md)).

## Inbox filters — the tracker is the only bus

| Consumer | Filter |
|---|---|
| server | milestones with a job: an open `intent/*` or `bolt/*` milestone holding an open `state:ready` or `state:in-progress` item, a `closed:merged` item awaiting its landing, or a batch at Ready; a plan card at Ready awaiting expansion; a system whose plan cards are missing or stale once its book has settled, or whose specs a landing just advanced — the planner is charged; plus closed milestones whose change still sits in `openspec/changes/` |
| bolt loop | its unit cards at board Status Ready, not yet expanded — expansion turns each card into its unit, files its sub-issues, and consumes the Ready status — plus open items on `bolt/<slug>` at `state:ready`, queued sub-issues relabelled first |
| intent loop | the same filter on `intent/<slug>`, plus elaborations at `stage:done` whose set is not yet collected |
| dispatch | open issues with no milestone (triage), and items labelled `needs-operator` (relay) |

These filters are the whole coordination model: a discovery is an
issue, an escalation is a label, a completion is item state — no
session, loop, or server messages another.

## The org Project

The Project is a view over the issues, never a second store: its one
native fact is a batch's Status, whose move to Ready is the operator's
approval. Batch parents carry the fields; sub-issues carry none.

| Field | Purpose |
|---|---|
| Status | single select: `Backlog` (batched, awaiting approval), `Ready` (approved; work starts) |
| Team | single select of addresses, `<operator>@<host>` (`afterthought@mac-studio`), one option per manifest host — the planner sets it when filing a plan card, the milestone inherits it at expansion, and expansion refuses a card without one: an unroutable bolt is a defect at approval time, not a discovery at runtime |
| Quarter | single select; slices the Roadmap and Landed views — the planner sets the current quarter when filing a plan card |
| Start, Target | dates; the Roadmap lays batches out by them — expansion stamps Start with the approval date and Target with Start plus the unit's price, so a unit still open past its Target reads as running over at a glance. Unapproved cards carry no dates: nothing has committed to them |

| View | Filter |
|---|---|
| Kanban | `is:open no:parent-issue`, Status columns Backlog and Ready only, sorted by Target |
| Roadmap | `is:open no:parent-issue`, grouped by Milestone, laid out by Start/Target, month zoom, sliced by Quarter |
| Triage | `is:open no:milestone`, oldest first — self-populating, since auto-add pulls in every open issue |
| Waiting On Me | `is:open label:needs-operator` |
| In Flight | `is:open label:state:in-progress` — running work, visible after its consumed approval leaves the Kanban lanes |
| Landed | `is:closed label:closed:done`, sliced by Quarter |

Views cannot be created through the API; `flywheel-setup` copies them
from a hand-built template project, one per org.

## The board through one bolt

What the operator sees, in order, from planning run to archive:

| Moment | On the board |
|---|---|
| a planning run returns | the bolt milestone with its summary, and one `plan` card per unit in Kanban's Backlog column |
| the operator moves a card to Ready | the server starts the bolt loop |
| the first pass expands the plan | the milestone and items exist; the card is now the unit, its Ready status consumed, its sub-issue progress bar at zero; Kanban shows only the cards still awaiting approval |
| sessions work the items | In Flight lists each `state:in-progress` item with its `stage:*` leading edge |
| an item merges back | the unit's progress bar ticks; the item leaves In Flight as `closed:merged` |
| the operator closes the milestone | the close releases the landing: items upgrade to `closed:done` with the landing commit and appear in Landed; the archive follows, and the board is quiet again |

Any card whose presence is not explained by this table traces back
through the [run record](observation.md), which names the pass and
the reason for every write.
