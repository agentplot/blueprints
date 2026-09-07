# Operation captures

The inventories of the operation events each source emits and which of
them become captures. One file per source, one row per source event.
Each row says how the event arrives, what the capture and the signal
carry, and where the signal can go.

| file | source | what it inventories |
|---|---|---|
| `switchboard.md` | switchboard, the delivery system | twenty bus event types, of which six reach the flywheel |
| `gvc.md` | the gvc data pipelines | checks, jobs, graph builds and checkouts on a data product |

The events dispatch itself captures — a chat message forwarded to the
bot, a meeting transcript, a day of one chat channel, a conversation on
a pull request — and the events of flywheel-cloud, the platform that
runs the hosts, are inventoried with the dispatch model in
`../models/dispatch/captures.md`. Dispatch, capture at the edge and the
cloud dispatcher are one thing (216–217k), so their captures and what
dispatch needs to serve them are one document.

## How these read against the requirements

- **A.15 — signals and curation (106–118, 215).** Gives the record
  each row fills. A capture is one per source event with its key, so
  twice is once (111); it is written by an adapter's arithmetic (115)
  on the tick of the host that declares the source (215, 231), and
  read into signals (113) by a triage session that host charges (217e).
  The **Capture** and **Signal** columns are those fields. The **Path**
  column is the move curation gives (107, 116).
- **A.19 — operation (181–182, 186, 192).** Places the sources.
  Operation is observed and never run; a landed bolt's releases,
  environments and runs are the delivery system's, and what the
  flywheel receives are signals through adapters and links through
  evidence (181). Every anomaly, incident or review enters as a signal
  and is routed by curation and planning (182). A data product is
  worked the same way as software (182), which is why gvc has an
  inventory of its own.
- **A.22 — endpoints and routing (191).** Says how a caller reaches
  the flywheel. The capture endpoint is served by the dispatcher
  behind the host's router, within the operator's private network; a
  caller that cannot reach any host's binary posts there (215), and
  every other adapter writes git through its own host (217g).
- **The dispatch model** (`../models/dispatch/model.md` §1, §3, §4 and
  `captures.md`) names who serves the endpoint, who charges the
  reader, what each caller needs to be admitted, and where the raw
  material a capture cites must be (217h).

## Two channels, and no third

- **Check runs on the pull request.** While a bolt is open in landing
  under pull-request policy, the request's reviews and check results
  are evidence on the bolt. A check that fails is a finding on the
  bolt; an accepted finding is a chore on the bolt line (176).
- **Captures.** Everything else arrives as a capture: one record per
  source event, written by an adapter without judgment, and read into
  signals by a session with judgment (106, 111, 112, 115). An adapter
  runs on whichever host declares the source and writes its captures
  through that host's own binary, `flywheel capture <source>`, pushed
  to the blueprints' shared line under the event key (114, 162). The
  capture endpoint on the dispatch host exists for callers that cannot
  reach a host's binary: a delivery system's connector, a monitor's
  webhook, a job plane, a chat. Both write the same record, and a
  second write under the same key is a no-op. Curation gives every
  signal its one move (107).

## What stays outside

- Links after landing stay with the delivery system. A landed bolt's
  releases, environments and runs are operation; the flywheel observes
  them through signals and never runs them (181). Links on an open
  request are surfaced on the bolt by an adapter and nothing depends on
  them (177).
- A pull request opened by hand, outside any bolt, is signal only. Its
  conversation may be captured (178). Nothing in it changes an intent
  except through curation (20).
- Switchboard's release-manager and approver queues are not the plan.
  An update-available row and an awaiting-gate row are switchboard's
  decisions for switchboard's people. The operator's response never
  answers them and they never wait on the plan.
- A session's finding about another thread is a signal the machinery
  writes itself (58, 62). It has no source event and is not in this
  inventory.

## Column key

**Channel** is check run, capture, or link. **Capture** lists the
fields of 111: source · event time · who captured · pointer to raw. The
event key that makes a second capture of the same event a no-op is
named with the source. **Signal** lists the fields of 113: kind ·
asserted by · subject tags · assertion · claims argued with. **Path**
is the move curation may give (116) or the route planning may take
(34, 60), or the check-run path of 176.

## Questions

Each is marked **answered**, with the requirement that answers it, or
**open**, with what remains for the source study to settle.

- **The event key (111).** *Answered for the channel, open for the
  key.* A source event is captured once, under one key (111, 231). A
  check result on an open request is evidence on the bolt and never a
  capture (176), so a `deploy.failed` on a pull-request ephemeral takes
  the check-run channel and a `deploy.failed` on a landed version takes
  the capture channel; a landed bolt has no open request, so no event
  takes both. What the key is per source stays with the source: a
  switchboard finding raised, cleared and raised again is the
  `FINDING#` id or the id with its `raisedAt`; a Datadog monitor that
  fires and recovers, and a regression step re-run at the same
  release, have the same choice. Each source file names its answer in
  the Capture column and the choice is reviewable there.
- **Weight by event date (118).** *Answered for the date, open for a
  re-raise.* Event time is `raisedAt`, `ran_at`, the meeting's date, or
  the message's own timestamp, never the webhook delivery or the
  import; weight counts by that date and the status view shows the age
  of unmoved signals by source (118). A transcript imported a month
  late weighs at the meeting's date. Which date weighs for a finding
  that clears and returns, the first raise or the latest, follows the
  key chosen above.
- **Events that must never become signals.** *Answered for where the
  list lives, open for its content.* An adapter is an enumerator of
  its source's events, shipped or added as a package that declares
  what it enumerates (215, 228); an event type the adapter does not
  enumerate is never captured, so the never-list is the adapter's
  declaration and not the model's. A notification about the machinery
  itself is 81's and never work; a pane the operator killed by hand
  (4), a stray place (55) and an expired lease (150) are machinery. For
  switchboard the proposed list is every type other than
  `finding.raised`, `deploy.failed` and the portal ask, and the
  release-manager and approver queues; whether that is the list is for
  the switchboard study.
