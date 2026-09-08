# Dispatch — captures

What dispatch and the edge adapters capture, what the platform that
runs the hosts reports, and what dispatch needs to exist; the column
key, the two channels and what stays outside are in
`../../operation-captures/README.md`, beside the source studies for
switchboard and gvc.

## 1. The capture endpoint and the edge adapters

**The capture endpoint's callers** (`model.md` §1): switchboard's
`integration-sync` connector, Datadog's monitor webhook, the gvc job
plane on a result, flywheel-cloud on a host event, the git host's
pull-request webhook on a closed request, and the Discord bot on a
forwarded message or a word.

| Source event | Channel | Capture | Signal | Path |
|---|---|---|---|---|
| A chat message forwarded to the bot, with or without one word | capture, through the endpoint | source `discord/<channel>/<message>`, key the message id · the message's own timestamp · the operator who forwarded · the message link | one signal · kind the operator's word, else ask · asserted by the message's author · tags from the word or none · the message as the assertion · none | any move at the next curation run (S21) |
| A meeting transcript: a file dropped in the folder, or a meeting the notes tool serves | capture, by the declaring host's adapter | source `meeting/<meeting id>` or `folder/<file hash>`, key the meeting id and date · the meeting's date, never the drop date · whoever dropped it, or the folder watcher · the transcript path outside version control, or in the raw store | several signals, read by triage · kinds commitment, constraint, question, ask · asserted by the speaker · tags from the topics · one sentence each, with the verbatim excerpt and its position · the claims each argues with | attach, challenge, join, answered or drop, per signal (116) |
| A day of one chat channel, imported | capture, by the declaring host's adapter | source `discord/<channel>/<day>`, key the channel and day · the day · the importer · the export outside version control | as a transcript | as a transcript |
| A conversation on a pull request the machinery did not open (178) | capture, by the adapter on a host with the App's installation on that repository | source `github/<repo>/pull/<n>`, key the request number and the last comment id read · the comment times · the adapter, reading the request through a scoped installation token (207) · the request URL | as a transcript; asserted by each commenter | signal only. Nothing here changes an intent except through curation (20). |
| A pull request closed without merging, failing a bolt's landing (175) | capture and the `failed landing` notification, through the endpoint on the git host's pull-request webhook, or by the landing host's own observation (`model.md` §1) | source `github/<repo>/pull/<n>/closed`, key the request number and the close event · the close time · the webhook caller at the endpoint, or the landing host · the request URL and the closing comment | kind ask or question, from the closing comment · asserted by whoever closed it · tags the bolt, the repository · the closer's sentence · the claims the bolt's units served | the bolt stays open (40); the comment is signal (178) |

## 2. flywheel-cloud

flywheel-cloud is the app that runs hosts and their networking: the
managed-platform router of 191, exposing each place's services within
the operator's private network. It is a product with a book and
claims, so its operation is observed like any other (182), and the
column **today** names the A.9 kind the event already routes under, or
none.

| Source event | Today | Notification, capture, or both | Capture | Signal | Path |
|---|---|---|---|---|---|
| Host lost: the platform reports the host gone, or its leases lapse unrenewed (150) | lost host | both | source `flywheel-cloud/<host>/lost`, key the host id and the platform's incident id · when the platform saw it go · flywheel-cloud · the platform's event record | kind reaction · asserted by the platform · tags host, the objects it held · "host `<name>` left the fleet holding `<n>` objects; `<cause>`" · flywheel-cloud's claims on host lifetime and scale-in | only where the instance's map homes flywheel-cloud (200, 202): challenge → stale verdict on the platform's claim → planning, on flywheel-cloud's repository. Where the map homes nothing of it, the signal argues with no claim and takes route or drop (116). |
| Planned scale-in or preemption notice from the platform | none | notification only | none | none | the machinery drains the host: nothing new is started, leases release as sessions exit |
| Lease expired on an object with a session behind it (150) | lost host | notification only | none; the host-lost capture carries it | none | the takeover rule names the operator's response for work with a session behind it (150); no signal |
| Place orphaned: a worktree on a host belonging to no live object (55) | none | neither; a recorded effect (79) | none | none | reconciliation removes it, or the operator holds it (55). Machinery, not operation (81). |
| Session bound reached on a host, and ready work has waited past a threshold (32) | none | notification only | none | none | the status view shows the wait and its order (B.4). Never a signal. |
| Disconnected host reconciled on reconnect (151) | none | notification only; both when the reconcile refused a local write | source `flywheel-cloud/<host>/reconcile/<id>`, key the reconcile id · the reconnect time · the host · the reconcile record with the refused writes | kind reaction · asserted by the host · tags host, the objects refused · "host `<name>` worked `<n>` objects offline for `<span>`; `<m>` writes refused on reconnect" · flywheel-cloud's claims on networking | challenge, on flywheel-cloud's repository. The refused writes themselves are decisions on the rail, not signals. |
| Ingress URL for a place changed by the platform router (191) | none | neither; the URL is re-recorded as evidence on the place (46) | none | none | none |
| Session blocked on a question (70) | blocked session | notification only | none | none | the answer arrives on the rail |
| Session stalled (65) | stalled session | notification only | none | none | the stage's retry rule; the rate per type and stage is recorded (70) |
| Landing failed on a conflicting merge (180) | failed landing | notification only | none | none | a chore on the line; at the retry bound a decision: retry or hold |
| New decisions on the rail | new decisions | notification only | none | none | the operator's response |

## 3. What dispatch needs to exist

Dispatch is four jobs at once (216, `model.md` §1): the chat presenter
with a stable identity (148, 155), the capture endpoint (106, 112,
C.1), triage (115), and the host's agent for chat (194). Each of those
needs something to exist. The table names the need, why, where it is
configured, and what it must never hold. An edge adapter on another
host needs none of the endpoint's rows: it holds that host's push
credential and, for a source read through the App, a short-lived
installation token scoped to that repository, never the App's private
key (`model.md` §1, 207). It writes raw payloads to the store of the
storage row only where the manifest names one for its source.

| Need | Why | Where it is configured | What it must never hold |
|---|---|---|---|
| A GitHub App for the instance, installed on the blueprints repository, every built repository the manifest lists, and the state repository. Permissions: contents read and write, pull requests read, checks read, deployments read; under the tracker profile also issues read and write and projects read and write. Webhooks: `push`, `pull_request`, `check_run`, `deployment_status`; under the tracker profile also `issues`, `issue_comment`, `projects_v2_item`. | Contents write is how signal and capture records reach the blueprints repository (157) and how a response becomes a commit under the git-only profile (164). Pull requests, checks and deployments read are the check-run channel and the links on an open request (176, 177). Under the tracker profile every object with a rail-facing lifecycle is an item, so issues and projects write are how that state is written at all (C.1, 157). The webhooks are notify (130, 166, `model.md` §3): the capture endpoint is woken, never polled. | The manifest names the App id and the installation. The private key is a secret the operator places in the host's secret store; dispatch reads it at start. | A token for any person. Repository admin. Write beyond the permissions the profile names. A checkout of a built repository: dispatch writes records, never code. |
| The Discord bot token and application id, and the equivalent for any other chat the profile binds (152, 155) | The presenter delivers the rail and receives the short reply through the bot's own stable identity (148). | The manifest names the application id, the guild and the channel per org. The bot token is a secret the operator places. | The operator's own account credentials. Any channel outside the org's guild. |
| Model access: API keys, or Bedrock or Vertex credentials when the org runs its models there. One model per role, declared per the manifest's defaults (173): the host's agent's model, triage's model. | The host's agent resolves names against live objects and proposes one tool call (194). Triage is judgment, never unattended (115). Both are sessions the machinery charges and take the role's default (173). | The manifest names the kind and model per role. Keys and cloud credentials are secrets the operator places; when the org runs on Bedrock, the runtime's own role carries them and no key exists. | A key that reaches any host. A model choice that overrides a unit type's or stage's own (173). |
| Membership in the operator's private network: a tailnet node, or the managed platform's ingress (191) | The page is served on the private network and every chat rendering links to it (155). Dispatch must reach the page to link it and, when it presents, serve it (148). Nothing beyond the private network is published unless the operator says so (46). | The manifest names the router per host; dispatch is one host of that declaration. The node key or the ingress binding is placed by the operator or issued by the platform. | A public hostname. A route to a place's services: dispatch reads the rail, never a running prototype. |
| Credentials on the state repository: push as compare-and-swap (162) | Under the git-only profile the response and every effect are commits; the push is the single-writer guarantee (134, 162). The one named writer that turns a phone reply into a commit (164) is the dispatcher where the instance has one, and the page-serving host in the browser-agent-only placement (216a, `model.md` §5). | The App's contents permission on the state repository; no separate credential. | A deploy key or a personal token. Force-push. |
| The capture endpoint's inbound secret for webhook callers: switchboard's `integration-sync`, Datadog's monitor webhook, the gvc job plane, flywheel-cloud | Captures are appended by adapters at any rate (106); the endpoint must know a caller is one of the org's producers and not the open internet. An adapter on a host is not a caller: it writes git with the host's own credential and holds no inbound secret. | The manifest names the callers. Each caller's secret is placed by the operator on both sides: in the host's secret store for dispatch, and in the producer's own configuration. The git host's own webhooks arrive under the App's webhook secret and need no caller secret. | One shared secret for every caller. Any secret in the capture record or the signal. A secret for an adapter that writes through its host's binary. |
| Storage for the raw material captures cite: transcripts, logs, exports, the drawer conversation (111) | A capture holds a pointer to the raw material; the raw material stays outside version control (111). The triage session opens it; nothing else does. An edge adapter copies its raw material here before it writes the capture where the manifest names a store for its source; where it names none, the host holding the material declares that it triages that source (`model.md` §4, 217h). | The manifest names the bucket or folder per source. Access rides on dispatch's runtime identity, and on the declaring host's for a source it triages itself. | The raw material itself in any record (62, 111). Retention shorter than the oldest unmoved signal (118). |

**What the operator places.** Every secret in the table is placed by
the operator in the host's secret store, and no agent may create,
rotate, or move one. A missing secret is a decision under attention
for the operator (149), never a value an agent supplies.

## 4. Questions

Each is marked **answered**, with the requirement that answers it, or
**open**, with what remains. Dispatch's own open questions — the
gateway, the agent's context, endpoint reachability, the fallback
presenter, `managed` triage, retention, the bound, the browser model's
size, one dispatcher per instance — are in `model.md` §8.

- **Self-observation.** *Answered.* 81 draws the line at the
  machinery: its own trouble is reported through the record and never
  filed as work, which is why most rows of §2 are notifications only.
  A platform event is a signal (182) that argues with a claim only
  where the instance's map homes flywheel-cloud, since a claim
  attaches to the map and scopes to the repositories homing its target
  (200, 202); in an instance whose map homes nothing of
  flywheel-cloud the signal argues with no claim and takes route or
  drop (116). The instance's own book is a curated source exactly when
  it is in the fleet, and by no other rule.
- **Findings that clear themselves.** *Open.* The reconciler raises
  and clears findings on its own. A signal whose source event has
  cleared before curation runs takes one move, made once (107): drop,
  with the clear as the reason, or answered, naming the clearing event
  as the record that settled it (116). Which move curation's rule
  gives, and whether the clearing event is itself captured so the
  answer has a record to name, is for the switchboard study and the
  curation instructions to settle.
