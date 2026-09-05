# Operation captures

The inventory of operation events that reach the flywheel. One row per
source event, across the producers the org runs: switchboard, the
flywheel's dispatch agent, flywheel-cloud, and the gvc data pipelines.
Each row says how the event arrives, what the capture and the signal
carry, and where the signal can go.

Two channels exist and no third.

- **Check runs on the pull request.** While a bolt is open in landing
  under pull-request policy, the request's reviews and check results
  are evidence on the bolt. A check that fails is a finding on the
  bolt; an accepted finding is a chore on the bolt line (176).
- **Captures through the org's dispatch agent.** Everything else
  arrives as a capture: one record per source event, written by an
  adapter without judgment, and read into signals by a session with
  judgment (106, 111, 112, 115). Curation gives every signal its one
  move (107).

What stays outside.

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

Column key. **Channel** is check run, capture, or link. **Capture** lists
the fields of 111: source · event time · who captured · pointer to raw.
The event key that makes a second capture of the same event a no-op is
named with the source. **Signal** lists the fields of 113: kind · asserted
by · subject tags · assertion · claims argued with. **Path** is the move
curation may give (116) or the route planning may take (34, 60), or the
check-run path of 176.

## Switchboard

Switchboard's bus carries twenty event types. Six of them reach the
flywheel. The rest are platform-internal or are links.

| Source event | Channel | Capture | Signal | Path |
|---|---|---|---|---|
| `finding.raised` from the reconciler: an undeclared manifest parameter, a version held twice by hand, a stale registry, an environment resolving another's namespace, drift on a stack | capture | source `switchboard/<tenant>/<env>/finding`, key the `FINDING#` id · `raisedAt` · the `integration-sync` connector posting to the capture endpoint · the `FINDING#` row and its event-archive id | kind constraint · asserted by the reconciler · tags app, env, repository, the parameter or stack named · "the template for `<app>` declares `<param>`; the settings for `<env>` do not" · the claim the app's manifest chapter makes about that parameter, when the repository is in the fleet | challenge → the claim's verdict goes stale → planning; route as a chore on the open bolt of that repository's line, else on the shared line. Drop when the reconciler has already cleared it. |
| Datadog monitor webhook firing on stable after a landing | capture | source `switchboard/<tenant>/<env>/finding`, key the `FINDING#` id the inbound webhook wrote · the monitor's trigger time · `integration-sync` · the `FINDING#` row, the monitor id, the Datadog event link | kind ask · asserted by the monitor, named · tags app, env `stable`, the version tag, the landed bolt read from the as-built ledger (A.14) · "monitor `<name>` breached on `<version>` within `<n>` hours of landing `<bolt>`" · the claims the landed bolt's units served | challenge → stale verdict → planning. While the bolt is still in every view (186) the offer is a chore on the bolt; after, a unit or a chore on an open bolt on that line (182). |
| A failed regression step on a release bench, after landing | capture | source `switchboard/<tenant>/release/<rel>/step/<id>`, key the step id at its run · the step's `ran_at` · `integration-sync` on the suite's finding · the step record and its screenshot | kind ask · asserted by the executor: the QA person or the agent runner · tags app, the version under test, the area the suite drew from · "step `<title>` failed against `<version>` on bench `<name>`: `<detail>`" · the claims behind the pull requests the suite was generated from | challenge → stale verdict → planning; chore on an open bolt on the app's line, else a unit. |
| A failed regression step on a PR ephemeral, while the bolt is open in landing under pull-request policy | check run | none; the check result is evidence on the bolt (176) | none | finding on the bolt → accepted → chore on the bolt line → the request updates (176) |
| `deploy.failed` for a landed bolt's version | capture | source `switchboard/<tenant>/<env>/deploy/<DEP#>`, key the deploy row id and its identity · the status change time · `integration-sync` · the deploy row's evidence: change set id, stack events | kind ask · asserted by the deploy executor · tags app, env, version, the landed bolt · "deploy of `<version>` to `<env>` failed: `<detail>`" · none by default; a claim on deployability when the book states one | route → chore on the open bolt of the line, else the shared line. Drop when a retry under the same identity later reads `deploy.done`. |
| `deploy.failed` for a PR ephemeral, while the bolt is open in landing | check run | none; switchboard posts the GitHub check and Deployment status through its App | none | finding on the bolt (176) |
| A portal ask: a person on a product page reports a problem or suggests a change through Ask dispatch | capture | source `portal/<tenant>/<app>/ask`, key dispatch's own id for the drawer conversation · when the person sent it · dispatch, as the org's GitHub App · the drawer transcript, outside version control | kind ask or question, as the person's words say · asserted by the person, by their sign-in identity · tags the product, the service, the environment they were on · the person's sentence, with dispatch's one or two clarifying answers folded in · a claim when the person disputes stated behavior | join → a proposed intent citing it; attach when an open intent fits; answered when a standing claim or an archived intent already settles it |
| `deploy.done`, `release.approved`, `record.written`, `channel.moved`, `service.changed`, `dataplane.registered`, the three `schema.*`, `access.changed`, `ephemeral.expired`, `pr.opened`, `pr.closed` | link, or nothing | none | none | never a signal. On an open request the check and Deployment status are links on the bolt (177). After landing they are the delivery system's (181). |

## The flywheel dispatch agent

Dispatch is the org's standing agent, hosted in the org's own account,
woken by tracker events and the operator's word. It is the one door for
captures.

**The capture endpoint.** Callers: switchboard's `integration-sync`
connector, the Discord bot on a forwarded message or a word, a file
dropped in the org's capture folder, the gvc job plane on a result,
flywheel-cloud on a host event. The endpoint does arithmetic only (115).
It writes one capture record: source, event key, event time, who
captured, pointer to raw. A second call with the same event key returns
the existing capture and writes nothing (111, S22). It never writes a
signal, with one exception: a forwarded single message is its own
excerpt, and the endpoint writes its one signal with the kind the
operator's word gave, else ask (S21).

**Triage is the capture-reading session.** Enumerating source events
and writing captures runs unattended. Turning a capture into signals is
judgment and never runs unattended (115). A capture with material to
read charges one session, the capture reader, in a place off the books'
shared line. The session delivers the signals once; they are written
immutable, each with its excerpt and position (113).

| Source event | Channel | Capture | Signal | Path |
|---|---|---|---|---|
| A chat message forwarded to the bot, with or without one word | capture | source `discord/<channel>/<message>`, key the message id · the message's own timestamp · the operator who forwarded · the message link | one signal · kind the operator's word, else ask · asserted by the message's author · tags from the word or none · the message as the assertion · none | any move at the next curation run (S21) |
| A meeting transcript: a file dropped in the folder, or a meeting the notes tool serves | capture | source `meeting/<meeting id>` or `folder/<file hash>`, key the meeting id and date · the meeting's date, never the drop date · whoever dropped it, or the folder watcher · the transcript path outside version control | several signals, read by the capture reader · kinds commitment, constraint, question, ask · asserted by the speaker · tags from the topics · one sentence each, with the verbatim excerpt and its position · the claims each argues with | attach, challenge, join, answered or drop, per signal (116) |
| A day of one chat channel, imported | capture | source `discord/<channel>/<day>`, key the channel and day · the day · the importer · the export outside version control | as a transcript | as a transcript |
| A conversation on a pull request the machinery did not open (178) | capture | source `github/<repo>/pull/<n>`, key the request number and the last comment id read · the comment times · the tracker webhook forwarded by the reconcile function · the request URL | as a transcript; asserted by each commenter | signal only. Nothing here changes an intent except through curation (20). |

## flywheel-cloud

flywheel-cloud is the app that runs hosts and their networking: it is
the managed-platform router of 191, and it exposes each place's services
within the operator's private network. It is a product with a book and
claims, so its operation is observed like any other (182). The
machinery's own trouble is reported through the record and never filed
as work (81); the platform's trouble is a signal against the platform's
claims. The column **today** names the A.9 kind the event already
routes under, or none.

| Source event | Today | Notification, capture, or both | Capture | Signal | Path |
|---|---|---|---|---|---|
| Host lost: the platform reports the host gone, or its leases lapse unrenewed (150) | lost host | both | source `flywheel-cloud/<host>/lost`, key the host id and the platform's incident id · when the platform saw it go · flywheel-cloud · the platform's event record | kind reaction · asserted by the platform · tags host, the objects it held · "host `<name>` left the fleet holding `<n>` objects; `<cause>`" · flywheel-cloud's claims on host lifetime and scale-in | challenge → stale verdict on the platform's claim → planning, on flywheel-cloud's repository |
| Planned scale-in or preemption notice from the platform | none | notification only | none | none | the machinery drains the host: nothing new is started, leases release as sessions exit |
| Lease expired on an object with a session behind it (150) | lost host | notification only | none; the host-lost capture carries it | none | the takeover rule names the operator's response for work with a session behind it (150); no signal |
| Place orphaned: a worktree on a host belonging to no live object (55) | none | neither; a recorded effect (79) | none | none | reconciliation removes it, or the operator holds it (55). Machinery, not operation (81). |
| Session bound reached on a host, and ready work has waited past a threshold (32) | none | notification only | none | none | the status view shows the wait and its order (B.4). Never a signal. |
| Disconnected host reconciled on reconnect (151) | none | notification only; both when the reconcile refused a local write | source `flywheel-cloud/<host>/reconcile/<id>`, key the reconcile id · the reconnect time · the host · the reconcile record with the refused writes | kind reaction · asserted by the host · tags host, the objects refused · "host `<name>` worked `<n>` objects offline for `<span>`; `<m>` writes refused on reconnect" · flywheel-cloud's claims on networking | challenge, on flywheel-cloud's repository. The refused writes themselves are decisions on the plan, not signals. |
| Ingress URL for a place changed by the platform router (191) | none | neither; the URL is re-recorded as evidence on the place (46) | none | none | none |
| Session blocked on a question (70) | blocked session | notification only | none | none | the answer arrives on the plan |
| Session stalled (65) | stalled session | notification only | none | none | the stage's retry rule; the rate per type and stage is recorded (70) |
| Landing failed because the pull request was closed (175) | failed landing | both | source `github/<repo>/pull/<n>/closed`, key the request number and close event · the close time · the tracker webhook · the request URL and the closing comment | kind ask or question, from the closing comment · asserted by whoever closed it · tags the bolt, the repository · the closer's sentence · the claims the bolt's units served | the bolt stays open (40); the comment is signal (178) |
| Landing failed on a conflicting merge (180) | failed landing | notification only | none | none | a chore on the line; at the retry bound a decision: retry or hold |
| New decisions on the plan | new decisions | notification only | none | none | the operator's response |

## gvc data pipelines

A data product is worked the same way as software: a repository, its
bolts, and an operation seen through signals (182). GVC reports on a
commit through checks and jobs, one record per `(branch, commit, name)`,
and Switchboard never sees a GVC commit.

| Source event | Channel | Capture | Signal | Path |
|---|---|---|---|---|
| Extraction job `failed` on a producer run after a push to the shared line | capture | source `gvc/<repo>/checks/<branch>/<sha>/extraction`, key the job identity `(repo, sha, extraction, params)` · the record's `ran_at` · the job plane on `result.json`, posting to the capture endpoint · the `.log` beside the record | kind ask · asserted by the extraction job · tags repository, the warehouse and release it is bound to, the batch `<pipeline>@<ran_at>` · the record's `detail` line · the claims the product's book makes on its extractors and readers | challenge → stale verdict → planning; a chore on the open bolt of that repository's line, else a unit |
| Extraction job or a declared check `failed` on a bolt's pull request | check run | none; the record's `.log` is the Checks tab (176) | none | finding on the bolt → chore on the bolt line |
| A declared check `failed` on the shared line after landing: `assertion-schema`, `division-coverage` | capture | as the extraction job, key `(repo, sha, check name)` | kind constraint · asserted by the check, named · tags repository, branch, the policy owner · the `detail` line · the claim that states the policy | challenge → stale verdict → planning |
| Anomaly in a graph build: the identity-keyed build `(repo, head.sha, scope)` fails, or the catalog subgraph the builder wrote disagrees with what the readers expect | capture; when the build ran as a stack's custom resource, the same event is switchboard's `deploy.failed` and is captured once under that key | source `gvc/<repo>/build/<sha>/<scope>`, key the build identity · the build's run time · the job plane, or `integration-sync` for the stack path · the build log and the subgraph it wrote | kind ask · asserted by the builder · tags repository, head, scope, the app that bakes it · "build of `<repo>@<sha>` at scope `<scope>` `<failed | wrote a subgraph missing <label>>`" · the claims on the catalog subgraph contract | challenge → stale verdict → planning; chore or unit on the repository's line |
| A vintage that publishes rows a newer vintage already claimed, seen at checkout | capture | source `gvc/<repo>/checkout/<id>`, key the checkout id · the checkout time · the workbench or the stack that read it · the checkout's resolution log | kind question · asserted by the reader · tags repository, the leaf `(item, partition, fp)` · "newest vintage did not win for `<key>` at `<sha>`" · the claim on vintage resolution | challenge; a chore when the book's rule is clear, else a question on a proposed intent |

## Open questions

- **Deduplication (111).** A switchboard finding is raised, cleared, and
  raised again. One capture or three? The key is the `FINDING#` id or
  the id with its `raisedAt`. The same question holds for a Datadog
  monitor that fires and recovers, and for a regression step re-run at
  the same release. A `deploy.failed` reaches the flywheel twice, as an
  event through `integration-sync` and as a GitHub check on the request:
  one source event, two channels. Which is the event key, and does the
  check-run channel ever write a capture at all?
- **Weight by event date (118).** Event time is `raisedAt`, `ran_at`,
  the meeting's date, or the message's own timestamp, never the webhook
  delivery or the import. For a finding that clears and returns, which
  date weighs: the first raise or the latest? A transcript imported a
  month late weighs at the meeting's date; the status view should say
  that the signal is old and new at once.
- **Events that must never become signals.** Proposed: every
  switchboard type other than `finding.raised`, `deploy.failed` and the
  portal ask; the release-manager and approver queues; every A.9
  notification about the machinery itself (81); a pane the operator
  killed by hand (4); a stray place; a lease that expired. Is that the
  list, and does it live in the model or in the manifest's adapter
  configuration (114)?
- **Who holds the checkout.** Signals and captures are files in the
  books repository in every profile (157). Dispatch is tracker-only and
  has no checkout. The endpoint writes the capture where, and through
  which profile operation?
- **The portal ask's tracker item.** Dispatch files one tracker item
  per ask today and lists the person's items back in the drawer. A
  signal is never an item (157). The item is a projection of the
  capture, or the capture is written from the item; the model must say
  which is the source (76).
- **Self-observation.** flywheel-cloud's events argue with claims in
  the flywheel's own books. Is the flywheel's own book a curated source
  like any other, or does 81's rule keep the machinery's platform out of
  curation?
- **Findings that clear themselves.** The reconciler raises and clears
  findings on its own. A signal whose source event has cleared before
  curation runs: drop, with the clear as the reason, or attach anyway
  because it happened?
