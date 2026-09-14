# Storefront: the first scenario

**Status: second pass, expanded from the agreed outline.** Still not
action-by-action; that is the next pass.

## One scenario system

There is one scenario mechanism, not two. The YAML that the acceptance
set already uses to prove the machinery against the model is the same
YAML a demo runs on. A file describes a project: its `given:` state at a
moment, and now an ordered list of actions that happen next.

What a demo adds to that file is not a second format. It is three
optional parts:

- **`actions:`** — the ordered list. A test scenario that only asserts a
  moment simply has none.
- **`bundle/`** — the artifacts, beside the scenario file.
- **`tour:`** — a line of copy per action, for the overlay.

A demo scenario with no tour copy is a long test. A test scenario given
tour copy is a demo. The same runner plays both, so a demo that drifts
from the machinery fails as a test, which is the whole reason to keep
them one thing.

## The bundle

A scenario is a directory, not a file:

```
scenarios/storefront/
  scenario.yaml
  bundle/
    research/declines.md
    prototype/retry-report.html
    planning/bolt-plan.md
    build/status-writer.diff
    review/checkout-findings.md
```

The demo instance has real repositories on disk. When the machinery
starts a session and stalls, the tour machinery copies that session's
artifact out of the bundle into the place the real session would have
written it, and reports the exit. The artifact is a real file at a real
path from that moment on — the UI is not showing a picture of a
deliverable, it is showing the deliverable.

## How an action runs

Each click advances one action. Where the action is a session's delivery,
the sequence the viewer sees is:

1. The machinery starts the session and the object shows it working.
2. The overlay says what the session is doing — **"agent works"** — and
   holds for about two seconds.
3. The artifact is copied from the bundle into the repository.
4. The session's exit is reported, the tick runs, and whatever it raises
   appears.

The pause is theatre and should look like it: a deliberate beat so the
viewer can see cause and effect, not a fake progress bar pretending to
be work.

The clock advances with the actions rather than with wall time, so
things age, leases come due and "seen 07:40" means something, without
anyone waiting.

There is no stepping backwards. To see an earlier moment, apply the
scenario to an earlier action number into a fresh instance.

## Viewing a deliverable

A deliverable is a file at a path, so the page links to it: markdown
rendered inline, HTML opened at its own address. That needs nothing new
and keeps the demo honest, because it is exactly what a real session
would leave behind.

Richer interactive reports — Plannotator, Lavish, or something of our
own — are a separate decision and not one this scenario needs. I would
leave the seam at "a session delivers files" and take that question up
when a real session wants to deliver something a browser cannot already
open.

## The project

A team is building **Storefront**, a web application that sells things:
a catalogue, a cart, and checkout with card payments. Two repositories,
`storefront` for the application and `payments` for the service that
talks to the card processor. One operator, several sessions.

Deliberately ordinary, so what the viewer learns is the flywheel's shape
rather than the domain's.

## The arc

Seven stages, roughly thirty actions.

### 1. Something arrives

Captures land from several sources, so the viewer sees that the flywheel
takes input from wherever the team already works:

- **A meeting transcript** — one capture that a reader turns into many
  signals, several of which are about the same thing. This is the one
  that shows grouping, and it should be long enough that the grouping is
  not obvious at a glance.
- **A raw capture typed on the page** — one person, one sentence, no
  ceremony.
- **A message forwarded from chat** — already its own excerpt, one
  capture and one signal.
- **An operational signal** — a declined-payment rate crossing a
  threshold on the running service, arriving with no human involved.

Not all of these are worked through to construction. Some exist to show
that captures accumulate and that not everything becomes work.

*What the viewer learns: the flywheel starts with noise, from everywhere,
and noise is kept.*

### 2. The noise becomes a subject

The captures cross the threshold and a curation session is charged. The
operator moves signals on the page: joining several transcript signals
and the operational one into a single subject about declining cards,
routing one to an existing intent, dropping a duplicate, and leaving
others unmoved. An intent is proposed and the first numbered decision
appears.

*What the viewer learns: the operator curates, the machinery counts and
proposes, and every decision is a number answerable anywhere.*

### 3. Understanding before building

Elaborations are proposed against the intent and approved: research into
why cards decline, a prototype of a retry strategy. Each starts, stalls,
and delivers from the bundle — `research/declines.md` read inline,
`prototype/retry-report.html` opened at its own address. One session
comes back with a question instead of an answer, and the question is on
the rail as a numbered decision.

*What the viewer learns: work is understood before it is planned, a
deliverable is a real artifact, and a session that needs the operator
can ask.*

### 4. The plan

Planning reads the elaborations and the book and proposes a bolt plan
spanning both repositories: units with their dependencies, reviewed as
one document. The operator sends one unit back with notes and approves
the revision.

*What the viewer learns: the plan is one document reviewed whole, and
redo is a first-class answer.*

### 5. Construction

The bolt opens and units move through the lanes. Several run at once;
one fails review and goes round again; one waits visibly on a
dependency. Each session delivers from the bundle — a spec, a diff, a
review with findings.

*What the viewer learns: the board is where work lives, parallelism is
normal, and a failure is a lane rather than an alarm.*

### 6. Landing, and what it changed

Units merge, the bolt lands, and the writeback says what is now true in
the chapter and claim the work concerned. A service is declared and
started; the operation lane shows it running.

*What the viewer learns: the loop closes back to the documents, and what
it built is now something it operates.*

### 7. The next turn

A new operational signal arrives from the running service — the same
kind that started stage 1, now on a project that is not empty. The tour
ends on a board that looks like a real morning.

*What the viewer learns: this is a loop, and steady state is the point.*

## Decisions taken

- The machinery runs for real and stalls at the session boundary; the
  scenario supplies what the session would have delivered.
- Artifacts are hand-authored per scenario and live in the scenario's
  own bundle.
- The tour is an overlay and part of the product, the way a new member
  is onboarded.
- The clock advances per action; each click is one action; a session's
  delivery shows a held beat first.
- No stepping backwards; apply to an action number instead.
- One YAML mechanism shared with the acceptance set.

## Open for the next pass

- Whether answering off-script continues, returns, or is refused.
- How the tour overlay is written — one voice throughout, or per stage.
- Whether a scenario names its repositories' starting content, or starts
  them empty and lets the bundle fill them.
- What the acceptance set asserts about a demo scenario, given it now
  runs one.
