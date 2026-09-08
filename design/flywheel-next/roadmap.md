# Roadmap

Five phases, each the size of one bolt plan, each run on real willdan work
before the next starts. The Rust prototype at flywheel-next/main is the
implementation seed from phase 1 on; there is no separate model sync once it
starts, the definitions are the model. The existing flywheel keeps running
willdan until phase 2 lands and is never modified.

| phase | name | what is real at the end | requirements |
|---|---|---|---|
| 1 | The loop | One organization, one laptop host. Captures land, the tick evaluates the machines, decisions are raised and delivered to the page and one chat sink, responses are recorded, the run record is readable. Statechart machines and profiles run from their definitions, on the git-only profile: state is the state repository, no tracker. No construction | A.1–A.16, A.22–A.24, A.38 (306–311, 314), B, C.2 |
| 2 | Construction | Units and bolts land on willdan repositories: spec, build, review, merge, landing by pull request; the tracker profile (C.1) joins here for willdan's board. Claims are standing OpenSpec requirement blocks in the blueprints' `openspec/specs/` with no book yet; the ledger holds verdicts; planning reads the backlog and proposes units and bolts against them (A.14, 28, 102, 104); scope comes from the map derived from the manifest, one context per repository, until the operator draws one (199a). Sessions charged by the machinery on the pane runner. The flywheel instrument reads runway, feed, pressure and drain. willdan moves off the old flywheel and is building from the flywheel from here on | A.5, A.14, A.17–A.21, A.27 (types) |
| 3 | Context | The book, its chapters including claims by anchor; the hand-drawn context map replacing the derived one; OpenSpec artifact views in the dock; packages and the package store; scenario packs behind their flag | A.21, A.26–A.28, 195–202 |
| 4 | Dispatch | Dispatch as a host: the four jobs, the receiver, the interpreter in the page's browser and in-process, triage placements, several organizations on one host, users and ownership, environments | A.25, A.26, A.29, A.30 |
| 5 | Scale | The hosted tiers: identity by Frontegg, the per-tier dispatcher, queues, cache, scheduler, pools, tenancy and encryption, plans and presets, the management console, the MCP endpoint, federation into the customer's account | A.31–A.36 |

## Repositories

| repository | what it is |
|---|---|
| `agentplot/blueprints` (public) | this design: requirements, surfaces, models, proposals, roadmap, the generic track |
| `agentplot/flywheel-next` (public) | the binary, open source; the prototype is its seed; work is OpenSpec changes, one per phase named for it (`the-loop` is phase 1), each artifact reviewed before the next, `apply` after the tasks review |
| `agentplot/flywheel-cloud` (private) | the control plane (A.37); source-available to enterprise customers; Switchboard composition |

Each repository's AGENTS.md states the line between them and points back here.

## Phase gates

A phase ends when its scenarios pass in conformance and the willdan operator
has run a week on it. Phase 2 is the only phase that retires something: the
old flywheel stops serving willdan when phase 2's landing has worked for a
week, and the old repository is archived unchanged.

## The generic track

Runs beside the ladder, not on it. It starts after phase 1 with Mad Swan's
billing operations (generic/billing-brief.md) as the first organization with
records and no code, on a laptop host, then a cloud agent at phase 5. Its
machines are drafted (generic/machines/) and lean on eight growth points
(generic/README.md); each growth point becomes a requirement clause when the
phase that needs it opens:

| growth point | lands in phase |
|---|---|
| an organization with no built repository | 2 |
| domain record sets declared by a package, recutils descriptors as the write gate | 3 |
| timers declared by the type, a suppressed stage | 3 |
| scheduled producers | 3 |
| aggregate units | 3 |
| elaboration on a unit; a proposal whose yes sends mail | 3 (the A.20 amendment) |
| adapters as packages: Paperless, Zoho Books, WorkDrive, OnPay, mail | 4 |
| the operator as a data source: a decision whose answer is a capture | 1 |

The four kinds stay core through phase 5. Whether the vocabulary itself
becomes a package is decided at the end of phase 5 with the billing run as
evidence.

## The commercial ladder

Free ships with phase 1 (the binary on your computer). Hobby, Pro and Team
ship with phase 5 in that order, each on a real organization first: Hobby on
Mad Swan billing, Team on willdan. Enterprise, tier 3 in both shapes, follows
the first customer who needs it. Tier 3's third shape — the whole control plane
installed in the customer's own accounts, sold and installed by us and shown in
no marketing and no console (A.37, 296–305) — follows the first customer who
needs that; the willdan-owned control plane deployed in switchboard is the first
instance.

## What is not scheduled

Rebuilding rail-and-board's map view on the adopted model (S69) and the open
surface items in surfaces.md are worked when the phase whose surface they
touch opens. The 390px header overflow is no longer among them: the phone is
a phase 1 requirement (A.38, 306–314) and the mockups render at 390px (314). proposals/hosted-design-review.md's
unverified facts are checked when phase 5 opens.
