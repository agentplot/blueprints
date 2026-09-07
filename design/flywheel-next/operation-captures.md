# Operation captures

The inventory of operation events that reach the flywheel. One row per
source event, across the producers the org runs: switchboard, the
dispatcher and the edge adapters on the org's hosts, flywheel-cloud,
and the gvc data pipelines.
Each row says how the event arrives, what the capture and the signal
carry, and where the signal can go.

Two channels exist and no third.

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

## Dispatch and the edge adapters

Dispatch is a host of kind dispatcher: the placement that presents the
chat, serves the capture endpoint, charges triage and interprets free
text for an organization whose other hosts sleep (dispatch model §1,
§2). It is one door for captures, not the only one. Capture is
decentralized (dispatch model §4): any host that declares a source runs
its adapter through its own binary and writes the capture to the blueprints'
shared line itself. The endpoint is for callers that cannot reach a
host's binary.

**The capture endpoint.** Callers: switchboard's `integration-sync`
connector, Datadog's monitor webhook, the gvc job plane on a result,
flywheel-cloud on a host event, and the Discord bot on a forwarded
message or a word. The endpoint does arithmetic only (115). It writes
one capture record: source, event key, event time, who captured,
pointer to raw. A second call with the same event key returns the
existing capture and writes nothing (111, S22). It never writes a
signal, with one exception: a forwarded single message is its own
excerpt, and the endpoint writes its one signal with the kind the
operator's word gave, else ask (S21).

**Edge adapters on hosts.** A file dropped in the org's capture folder,
a meeting the notes tool serves, a day of one chat channel imported,
and a conversation on a pull request are captured by the adapter the
declaring host runs: `flywheel capture <source>` enumerates the source's
events, writes one capture per event under its key, and pushes with
expected-old (162). The adapter needs no inbound secret and no
endpoint; it holds the host's own push credential and nothing else. It
either copies the raw material to the org's raw store before it writes
the capture, or the host declares that it triages that source (dispatch
model §4).

**Triage is the capture-reading session.** Enumerating source events
and writing captures runs unattended. Turning a capture into signals is
judgment and never runs unattended (115). A capture with material to
read charges one session, the capture reader, in a place off the blueprints'
shared line, on the dispatcher or on the host that declares the source.
The session delivers the signals once; they are written immutable, each
with its excerpt and position (113).

| Source event | Channel | Capture | Signal | Path |
|---|---|---|---|---|
| A chat message forwarded to the bot, with or without one word | capture, through the endpoint | source `discord/<channel>/<message>`, key the message id · the message's own timestamp · the operator who forwarded · the message link | one signal · kind the operator's word, else ask · asserted by the message's author · tags from the word or none · the message as the assertion · none | any move at the next curation run (S21) |
| A meeting transcript: a file dropped in the folder, or a meeting the notes tool serves | capture, by the declaring host's adapter | source `meeting/<meeting id>` or `folder/<file hash>`, key the meeting id and date · the meeting's date, never the drop date · whoever dropped it, or the folder watcher · the transcript path outside version control, or in the raw store | several signals, read by the capture reader · kinds commitment, constraint, question, ask · asserted by the speaker · tags from the topics · one sentence each, with the verbatim excerpt and its position · the claims each argues with | attach, challenge, join, answered or drop, per signal (116) |
| A day of one chat channel, imported | capture, by the declaring host's adapter | source `discord/<channel>/<day>`, key the channel and day · the day · the importer · the export outside version control | as a transcript | as a transcript |
| A conversation on a pull request the machinery did not open (178) | capture, by the adapter on the host holding the App's key | source `github/<repo>/pull/<n>`, key the request number and the last comment id read · the comment times · the adapter, reading the request through the App · the request URL | as a transcript; asserted by each commenter | signal only. Nothing here changes an intent except through curation (20). |

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

## What dispatch needs to exist

Dispatch is a host of kind dispatcher, placed where the organization's
other hosts are not always awake (dispatch model §5). It is four jobs
at once: the chat presenter with a stable identity (148, 155), the
capture endpoint a delivery system or a chat calls (106, 112, C.1), the
capture-reading triage session (115), and the chat interpreter that
turns free text into one proposed tool call (194). Each of those needs
something to exist. The table names the need, why, where it is
configured, and what it must never hold. An edge adapter on another
host needs none of the endpoint's rows: it holds that host's push
credential and, for a source read through the App, the App's key placed
on that host (207).

| Need | Why | Where it is configured | What it must never hold |
|---|---|---|---|
| A GitHub App for the organization, installed on the blueprints repository, every built repository the manifest lists, and the state repository. Permissions: contents read and write, pull requests read, checks read, deployments read. Webhooks: `push`, `pull_request`, `check_run`, `deployment_status`. | Contents write is how signal and capture records reach the blueprints repository (157) and how a response becomes a commit under the git-only profile (164). Pull requests, checks and deployments read are the check-run channel and the links on an open request (176, 177). The webhooks are notify (130, 166): the capture endpoint is woken, never polled. | The manifest names the App id and the installation. The private key is a secret the operator places in the org's sealed store; dispatch reads it at start. | A token for any person. Repository admin. Write on anything but contents. A checkout of a built repository: dispatch writes records, never code. |
| The Discord bot token and application id, and the equivalent for any other chat the profile binds (152, 155) | The presenter delivers the plan to the chat sink and receives the short reply; the bot is its stable identity (148). Rich controls are the platform's, used as provided (155). | The manifest names the application id, the guild and the channel per org. The bot token is a secret the operator places. | The operator's own account credentials. Any channel outside the org's guild. |
| Model access: API keys, or Bedrock or Vertex credentials when the org runs its models there. One model per role, declared per the manifest's defaults (173): the interpreter's model, triage's model. | The interpreter resolves names against live objects and proposes one tool call (194). Triage is judgment, never unattended (115). Both are sessions the machinery charges and take the role's default (173). | The manifest names the kind and model per role. Keys and cloud credentials are secrets the operator places; when the org runs on Bedrock, the runtime's own role carries them and no key exists. | A key that reaches any host. A model choice that overrides a unit type's or stage's own (173). |
| Membership in the operator's private network: a tailnet node, or the managed platform's ingress (191) | The page is served on the private network and every chat rendering links to it (155). Dispatch must reach the page to link it and, when it presents, serve it (148). Nothing beyond the private network is published unless the operator says so (46). | The manifest names the router per host; dispatch is one host of that declaration. The node key or the ingress binding is placed by the operator or issued by the platform. | A public hostname. A route to a place's services: dispatch reads the plan, never a running prototype. |
| Credentials on the state repository: push as compare-and-swap (162) | Under the git-only profile the response and every effect are commits; the push is the single-writer guarantee (134, 162). Dispatch is the one named writer that turns a phone reply into a commit (164). | The App's contents permission on the state repository; no separate credential. | A deploy key or a personal token. Force-push. |
| The capture endpoint's inbound secret for webhook callers: switchboard's `integration-sync`, Datadog's monitor webhook, the gvc job plane, flywheel-cloud | Captures are appended by adapters at any rate (106); the endpoint must know a caller is one of the org's producers and not the open internet. An adapter on a host is not a caller: it writes git with the host's own credential and holds no inbound secret. | The manifest names the callers. Each caller's secret is placed by the operator on both sides: in the org's sealed store for dispatch, and in the producer's own configuration. | One shared secret for every caller. Any secret in the capture record or the signal. A secret for an adapter that writes through its host's binary. |
| Storage for the raw material captures cite: transcripts, logs, exports, the drawer conversation (111) | A capture holds a pointer to the raw material; the raw material stays outside version control (111). The reader session opens it; nothing else does. An edge adapter copies its raw material here before it writes the capture, unless its host declares that it triages the source (dispatch model §4). | The manifest names the bucket or folder per source. Access rides on dispatch's runtime identity, and on the declaring host's for a source it triages itself. | The raw material itself in any record (62, 111). Retention shorter than the oldest unmoved signal (118). |
| Its own lease as presenter (148) | Exactly one presenter delivers the plan to each sink at a time. Dispatch holds that lease or the manifest pins it. A host that takes the presenter role while dispatch holds the lease is a race, and races are forbidden (150). | The manifest either pins dispatch as presenter for the chat sink or lets it take the lease within its declaration (149). The lease is a record in the state, taken and renewed like any other (128). | A lease on any object a host works: intents, bolts, units, sessions. Dispatch presents and captures; it never runs a loop. |

**What the manifest names.** The App id and installation, the chat
application id and channel, the model per role, the router and the
network dispatch sits on, the webhook callers, the raw-material store,
and whether dispatch is pinned as presenter. All of that is data, read
at start, reviewable in git.

**What the operator places, and no agent invents or copies.** The
App's private key, the bot token, model keys or cloud credentials, the
network node key, and each caller's inbound secret. They live in the
org's sealed store under the runtime's identity. No session sees them,
no record cites them, and no agent may create, rotate, or move one; a
missing secret is a decision under attention for the operator (149),
never a value an agent supplies.

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
  blueprints repository in every profile (157). The dispatcher clones the
  blueprints repository like any host (dispatch model §2), so the endpoint
  writes there with expected-old; an edge adapter writes through its
  own host's checkout. Which profile operation each write is, and
  whether two adapters pushing the same key at once resolve to one
  capture by the push alone, is not settled.
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
