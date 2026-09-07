# Dispatch — captures

What dispatch and the edge adapters capture, what the platform that
runs the hosts reports, and what dispatch needs to exist. Companion to
`model.md`, which states the process model; this file inventories the
events and the needs. The column key, the two channels and what stays
outside are in `../../operation-captures/README.md`, beside the source
studies for switchboard and gvc.

## 1. The capture endpoint and the edge adapters

Capture is decentralized (`model.md` §4, 217g): a host that declares a
source runs its adapter through its own binary and writes the capture
to the blueprints' shared line itself. The endpoint is one door, for
callers that cannot reach a host's binary.

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
the capture, or the host declares that it triages that source
(`model.md` §4, 217h).

**Triage** turns a capture into signals and is the one part that is
judgment (115): one session per capture with material to read, charged
by the tick of the host that declares the source, up to a bound
(`model.md` §3, 217e). The session delivers the signals once; they are
written immutable, each with its excerpt and position (113).

| Source event | Channel | Capture | Signal | Path |
|---|---|---|---|---|
| A chat message forwarded to the bot, with or without one word | capture, through the endpoint | source `discord/<channel>/<message>`, key the message id · the message's own timestamp · the operator who forwarded · the message link | one signal · kind the operator's word, else ask · asserted by the message's author · tags from the word or none · the message as the assertion · none | any move at the next curation run (S21) |
| A meeting transcript: a file dropped in the folder, or a meeting the notes tool serves | capture, by the declaring host's adapter | source `meeting/<meeting id>` or `folder/<file hash>`, key the meeting id and date · the meeting's date, never the drop date · whoever dropped it, or the folder watcher · the transcript path outside version control, or in the raw store | several signals, read by the capture reader · kinds commitment, constraint, question, ask · asserted by the speaker · tags from the topics · one sentence each, with the verbatim excerpt and its position · the claims each argues with | attach, challenge, join, answered or drop, per signal (116) |
| A day of one chat channel, imported | capture, by the declaring host's adapter | source `discord/<channel>/<day>`, key the channel and day · the day · the importer · the export outside version control | as a transcript | as a transcript |
| A conversation on a pull request the machinery did not open (178) | capture, by the adapter on the host holding the App's key | source `github/<repo>/pull/<n>`, key the request number and the last comment id read · the comment times · the adapter, reading the request through the App · the request URL | as a transcript; asserted by each commenter | signal only. Nothing here changes an intent except through curation (20). |

## 2. flywheel-cloud

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

## 3. What dispatch needs to exist

Dispatch is four jobs at once (216, `model.md` §1): the chat presenter
with a stable identity (148, 155), the capture endpoint a delivery
system or a chat calls (106, 112, C.1), the capture-reading triage
session (115), and the chat interpreter that turns free text into one
proposed tool call (194). Each of those needs something to exist. The
table names the need, why, where it is configured, and what it must
never hold. An edge adapter on another host needs none of the
endpoint's rows: it holds that host's push credential and, for a
source read through the App, the App's key placed on that host (207).

| Need | Why | Where it is configured | What it must never hold |
|---|---|---|---|
| A GitHub App for the organization, installed on the blueprints repository, every built repository the manifest lists, and the state repository. Permissions: contents read and write, pull requests read, checks read, deployments read. Webhooks: `push`, `pull_request`, `check_run`, `deployment_status`. | Contents write is how signal and capture records reach the blueprints repository (157) and how a response becomes a commit under the git-only profile (164). Pull requests, checks and deployments read are the check-run channel and the links on an open request (176, 177). The webhooks are notify (130, 166): the capture endpoint is woken, never polled. | The manifest names the App id and the installation. The private key is a secret the operator places in the org's sealed store; dispatch reads it at start. | A token for any person. Repository admin. Write on anything but contents. A checkout of a built repository: dispatch writes records, never code. |
| The Discord bot token and application id, and the equivalent for any other chat the profile binds (152, 155) | The presenter delivers the plan to the chat sink and receives the short reply; the bot is its stable identity (148). Rich controls are the platform's, used as provided (155). | The manifest names the application id, the guild and the channel per org. The bot token is a secret the operator places. | The operator's own account credentials. Any channel outside the org's guild. |
| Model access: API keys, or Bedrock or Vertex credentials when the org runs its models there. One model per role, declared per the manifest's defaults (173): the interpreter's model, triage's model. | The interpreter resolves names against live objects and proposes one tool call (194). Triage is judgment, never unattended (115). Both are sessions the machinery charges and take the role's default (173). | The manifest names the kind and model per role. Keys and cloud credentials are secrets the operator places; when the org runs on Bedrock, the runtime's own role carries them and no key exists. | A key that reaches any host. A model choice that overrides a unit type's or stage's own (173). |
| Membership in the operator's private network: a tailnet node, or the managed platform's ingress (191) | The page is served on the private network and every chat rendering links to it (155). Dispatch must reach the page to link it and, when it presents, serve it (148). Nothing beyond the private network is published unless the operator says so (46). | The manifest names the router per host; dispatch is one host of that declaration. The node key or the ingress binding is placed by the operator or issued by the platform. | A public hostname. A route to a place's services: dispatch reads the plan, never a running prototype. |
| Credentials on the state repository: push as compare-and-swap (162) | Under the git-only profile the response and every effect are commits; the push is the single-writer guarantee (134, 162). Dispatch is the one named writer that turns a phone reply into a commit (164). | The App's contents permission on the state repository; no separate credential. | A deploy key or a personal token. Force-push. |
| The capture endpoint's inbound secret for webhook callers: switchboard's `integration-sync`, Datadog's monitor webhook, the gvc job plane, flywheel-cloud | Captures are appended by adapters at any rate (106); the endpoint must know a caller is one of the org's producers and not the open internet. An adapter on a host is not a caller: it writes git with the host's own credential and holds no inbound secret. | The manifest names the callers. Each caller's secret is placed by the operator on both sides: in the org's sealed store for dispatch, and in the producer's own configuration. | One shared secret for every caller. Any secret in the capture record or the signal. A secret for an adapter that writes through its host's binary. |
| Storage for the raw material captures cite: transcripts, logs, exports, the drawer conversation (111) | A capture holds a pointer to the raw material; the raw material stays outside version control (111). The reader session opens it; nothing else does. An edge adapter copies its raw material here before it writes the capture, unless its host declares that it triages the source (`model.md` §4, 217h). | The manifest names the bucket or folder per source. Access rides on dispatch's runtime identity, and on the declaring host's for a source it triages itself. | The raw material itself in any record (62, 111). Retention shorter than the oldest unmoved signal (118). |
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

## 4. Questions

Each is marked **answered**, with the requirement that answers it, or
**open**, with what remains.

- **Who holds the checkout.** *Answered.* Captures, signals and moves
  are files in the blueprints repository in every profile (157), under
  the prefix `flywheel/signals/` (203). The dispatcher clones the
  blueprints like any host (217), so the endpoint writes there and
  pushes with expected-old; an edge adapter writes through its own
  host's checkout and never through dispatch (217g). Two adapters
  pushing the same key at once resolve by the push alone: the push is
  the compare-and-swap (162), the loser fetches and finds the key
  present, and the idempotent key makes its retry write nothing (111,
  231).
- **The portal ask's tracker item.** *Answered.* The capture is the
  source: one per ask, keyed by dispatch's id for the drawer
  conversation (111). A signal is never a tracker item (157), so the
  item dispatch files per ask is at most a projection written from the
  capture and its signal's move, never read as truth (76). The item
  that has a lifecycle is the proposed intent the join move produces
  (116), and the drawer lists the person's asks from the captures and
  their moves.
- **Self-observation.** *Answered.* 81 draws the line at the
  machinery: its own trouble is reported through the record and never
  filed as work, which is why most rows of §2 are notifications only.
  A platform event is a signal (182) that argues with a claim only
  where the organization's map homes flywheel-cloud, since a claim
  attaches to the map and scopes to the repositories homing its target
  (200, 202); in an organization whose map homes nothing of
  flywheel-cloud the signal argues with no claim and takes route or
  drop (116). The flywheel's own book is a curated source exactly when
  it is in the fleet, and by no other rule.
- **Findings that clear themselves.** *Open.* The reconciler raises
  and clears findings on its own. A signal whose source event has
  cleared before curation runs takes one move, made once (107): drop,
  with the clear as the reason, or answered, naming the clearing event
  as the record that settled it (116). Which move curation's rule
  gives, and whether the clearing event is itself captured so the
  answer has a record to name, is for the switchboard study and the
  curation instructions to settle.
