# Dispatch — the model

What dispatch is, where it runs, and what stays the same wherever it
runs. Written in the voice of `requirements.md`; every statement cites
the requirement it satisfies or the one it proposes. Sources: A.15,
A.17, A.24, B.1, B.5, B.6, C.1, C.2, section 9, `captures.md` beside
this file (what dispatch captures and what it needs to exist), the
source studies in `../../operation-captures/`, and the statechart
model's `sink`, `host`, `surfaces`, `sessions`, `tracker` and
`git-only` bindings.

The short form. Dispatch is not one thing and not one program shape
with two homes. It is four jobs. Three of them are the flywheel's
ordinary machinery given a host to run on; the fourth — reading a
capture — is a session like any other. The "browser model" is one of
the four jobs, done a different way, and covers nothing else. A host
whose declaration takes no work and presents the chat is dispatch, and
the same binary runs it on a laptop, in a multiplexer pane, in a
container, or on an agent platform. Only placement, secrets, network
and model access differ.

## 1. Four jobs

Dispatch is four jobs at once (216, `captures.md` §3). Each has its own reads, writes, needs and failure
mode, and the table keeps them apart because the placements below
split them.

| job | what it does | reads | writes | needs a model | needs a long-lived process | secrets it holds | runs with no host of the operator's awake |
|---|---|---|---|---|---|---|---|
| **presenter** to the chat sink | delivers the numbered decisions and the tail to the chat on the sink's cadence or when due; turns a short reply, a button press or a confirmed proposal into one op-response; reacts ✅ when it is recorded (148, 152–155, 18, 14) | the rail's register, the objects it names, the sink record and its mark (B.1 read, list) | the sink's mark and delivery id; one `op-response` per reply (B.1 write, receive) | no | yes for a chat that pushes replies over a socket; no for a chat that calls a URL on a reply | the bot token; the state-store credential (the App's installation token, C.1; push credential, C.2) | yes — that is its purpose (132, 143, 156) |
| **capture endpoint** | accepts one source event from a caller that cannot write git; writes one capture record with the event key; the same key returns the existing capture and writes nothing (106, 111, 112, S22); writes one signal only for a forwarded single message (S21) | nothing but the existing captures under the key | one capture record; for a forwarded message, one signal record; on the blueprints' shared line under `flywheel/signals/` (203) | no | no — one request, one commit | the inbound secret per caller; the blueprints push credential | yes |
| **triage** | one session per capture with material to read, in a place off the blueprints' shared line; reads the raw material the capture points at; writes the signals once, immutable, with excerpt and position (113, 115) | the capture, its raw material, the standing claims in `openspec/specs/` (108) | the capture's signal records, one commit | yes — this is judgment (115) | no — a bounded session: it starts, delivers, exits (65, 110) | none of its own; a session identity (197) and a scoped token issued into its place (207) | yes when its runner is reachable from where dispatch runs (§5) |
| **the host's agent** for chat | serves the operator's free text on the surface (194): it reads and answers a question with the query tools on its own, and proposes every write as a card with a confirm control, calling the tool on the operator's confirmation. Its interpreter, the function that turns text into a proposed call, resolves names against the live objects; a message that asks for several things yields several proposed calls, one card each, each confirmed and recorded on its own, and a name that resolves to nothing or to two things is asked about, never guessed | the live objects (list and read), the tool catalogue (193), the message and, when it is a reply, the messages it replies to | nothing — each confirmed call is the response, recorded by the tool once (153) | yes — bounded per message | no — one request, one bounded model call | the model credential for that call | yes |

Three rules fall out of the table.

- **Only two jobs need a model, and both are bounded.** Triage is
  one session over one capture. Interpretation is one call over one
  message. Neither is a conversation that persists. Everything either
  needs is in records: the capture, the claims, the objects, the
  catalogue. There is no context to carry between requests and
  therefore nothing to compact (7, 136).
- **Only one job needs a long-lived process, and only under one kind
  of chat.** A chat whose replies arrive over a socket the bot must
  hold open (Discord's gateway, for plain messages) makes the
  presenter a long-lived process. A chat that calls a URL on a button
  press or a slash command does not. Every other job is one request or
  one tick.
- **The browser model is the host's agent for the page and nothing
  else.** A model in the page's browser answers from the query tools
  and proposes each write as a card, one per thing the message asks
  for, which the operator confirms (194, 216a, surfaces.yaml
  `host_agent.page`). It presents nothing,
  because the page is a sink whose presenter is the host that serves
  it. It captures nothing, because the capture box sends its text to
  the capture tool unparsed (19). It triages nothing, because a capture
  with material to read charges a session, and a page has none. An
  organization running the browser model alone has a plan on the page,
  a capture box, and no chat, no endpoint for webhooks, and no signals
  read out of transcripts. That is a get-started mode, and it is
  named as one in §5.

## 2. The process model: a host of kind dispatcher

Dispatch is a host (149). Its declaration in the manifest takes no
object kinds, no repositories and no unit types, and presents the chat
(model.md §5.5, §11: "a host whose declaration takes no object kind and
presents the chat"). The statechart already has it:
`{name: dispatcher, bound: 0, kinds: [], presents: [chat]}` and the sink
pinned `presenter: dispatcher`. This model adds what such a host also
declares — the callers of its endpoint, the sources it triages, and
the runner its model jobs use — and states what follows.

**One binary.** `flywheel dispatch` is `flywheel host` with that
declaration (model.md §13). It links both state stores, chosen by
the manifest's profile. It joins by `flywheel host join` (205) and
clones the state and the blueprints repositories under its root; it clones
no built repository, because its declaration names none. It
heartbeats as `host/dispatcher` (git-only.yaml `hosts:`), takes the
sink lease or holds the pin, and runs the tick loop every host runs:
fetch, list, read, evaluate, effect (165, 126–131).

**Stateless between ticks.** A tick reads everything it decides on
from the state store (136). The sink's mark says what was delivered
(14). The capture keys say what was captured (111). The signal files
say what was triaged (blueprints.yaml `capture.signals_present`). The
response files say what was answered (137). A restart reads the same
state and reaches the same conclusion (7, S5). Nothing dispatch
remembers in memory decides anything. This is why the "machinery
agent in herdr with the capture box wired to it" framing is wrong: it
puts a conversation where a tick belongs. A long-lived agent
accumulates context and must compact; a host accumulates nothing.
Triage and interpretation are charged per capture and per message,
each with a fresh, closed set of inputs (89), and each is paid for
once.

**Which process runs the model jobs.** The two model jobs are sessions
in the sense of A.7: a bounded goal, a fixed set of exits, inputs
enumerated in a work order, a session identity checked by the tool
server (197). The sessions binding (sessions.yaml) starts a session in
a multiplexer pane. A dispatcher may have no multiplexer — a container
has no herdr. So the sessions binding gains a second **runner**, and
the dispatcher's declaration names one per job:

| runner | what starts the session | tools reached by | needs | fits |
|---|---|---|---|---|
| `pane` | `herdr agent start` in the machinery multiplexer session, as today (174, 196) | the pane's `flywheel` commands and the host's MCP server over stdio | a host with herdr and an agent program signed in (the operator's Claude Code login; no API key) | triage on a laptop or a home host |
| `inproc` | the dispatcher's own bounded agent loop inside the binary: the model called through the SDK, the tools the binary's own catalogue, no process boundary | in-process | an API key, or the runtime's Bedrock or Vertex role (173, 207) | the interpreter everywhere; triage in a container or on a platform |
| `managed` | a session on an agent platform (a Claude managed agent, Bedrock AgentCore) created per capture from a stored agent definition | remote MCP over HTTP to the dispatcher's tool server, carrying the session's identity (197) | the platform's credential; the platform's sandbox reaching the dispatcher over the private network | triage where the operator already runs agents on that platform |

Each runner starts the session with the same work order, the same
instruction data and the same exits (173, 89). The engine sees a
session record and a thread; which runner produced it is a binding.
The interpreter's latency rules out `pane` (a pane takes seconds to
start and the operator is waiting on a reply) and `managed` (a
container per message); it is `inproc` everywhere. Triage takes any
of the three.

**Where the tools are.** The tool server is the binary's (surfaces.yaml
`tools`: "the `flywheel` binary's MCP server and its HTTP twin"). Every
host serves it, the dispatcher included. An agent that shares the
dispatcher's process calls it in-process or over stdio. An agent that
does not — a managed session on a platform — calls it over HTTP with
the identity token start_session issued (197). The HTTP tool server
listens on the private network only (155, 191); a platform whose
sandbox cannot join that network cannot run a `managed` triage session
for this organization, and the manifest is refused when it names one.

**Local to cloud is one shape.** The same binary, declaration and
tick run in every placement. What changes:

| dimension | laptop | multiplexer pane (herdr) | container on a platform | agent platform |
|---|---|---|---|---|
| placement | `flywheel dispatch` as a user process | the same, in a pane of `flywheel-<org>-machinery` (174) | the same, as the container's one process | the same binary as a long-lived session on the platform, or its jobs split (§5) |
| secrets | the operator's keychain or a sealed file under the root | the same | the platform's secret store, injected at start | the platform's vault (managed agents: vault credentials; AgentCore: its identity service) |
| network | the machine's tailnet node | the same | a tailnet node in the container, or the platform router's ingress (191) | the platform's private connectivity (a VPC route, a self-hosted sandbox on the tailnet), else none |
| model access | the operator's login (`pane`), or a key (`inproc`) | the same | a key or the runtime's cloud role (`inproc`) | the platform's own model access |
| endpoint reach | the private network only; public webhooks need a funnel | the same | the private network, plus a public route the operator opens for named callers (46) | the platform's ingress |

Nothing in this table is a machine, an atom or a profile operation.
It is the `hosts.dispatcher` entry of the manifest and the secrets the
operator places (207, `captures.md` §3).

## 3. Notifications and scheduling

**How the machinery reaches dispatch.** It does not. No host, session
or loop addresses dispatch (197: sessions never message; the machinery
speaks through state). The machinery writes state; dispatch reads it.
Two channels make the read prompt, and there is no third:

| channel | git-only (C.2) | tracker (C.1) | bound |
|---|---|---|---|
| notify | the git host's push webhook to the dispatcher's `/hook` when the state repository's shared line moves (166) | the App's `issues`, `issue_comment`, `projects_v2_item` webhooks to the same `/hook` | delivery latency, seconds |
| bounded fetch | `git ls-remote origin main` every 30s, and a fetch before every tick (165) | `issues?since=<mark>` every 30s | 30s |

A notification only shortens the wait (130). A dispatcher that is
never notified still converges by reading. The presenter's due rule is
the sink machine's own: `sink.due` is true when a decision routed to
the chat has a register entry newer than the sink's mark, when the
sink's cadence fired since the mark, or when the operator asked for
the rail (surfaces.yaml `sink.due`). "New decisions" is a notification
kind routed to sinks like any other (82); a construction host that
creates a decision does nothing more than write it.

**How dispatch reaches the chat.** Through its own bot identity (148,
155): the Discord application the manifest names, the token the
operator placed. It posts the rail as one message, one line per
decision and a link to the page (18). It reads replies as the same
bot. It never uses the operator's account and never a channel outside
the organization's (`captures.md` §3, the bot row). Rich controls
are the platform's, used as provided; the numbered grammar always
works beside them (155, 194).

**The triage cadence.** Triage is not curation. Curation clusters
unmoved signals against claims on a cadence or threshold (110,
blueprints.yaml `curation.cadence`, `curation.threshold`) and runs on a host
that declares the machinery role; dispatch does not run it. Triage
turns a capture into signals and runs where the raw material can be
read (§4). Its due rule is the dispatcher's own tick rule, declared in
the manifest beside curation's:

| rule | default | reads |
|---|---|---|
| a capture with material to read and no signals charges a triage session | immediate, subject to the bound | `capture.signals_present` false, the pointer present |
| at most `triage.bound` readers at once | 1 | the dispatcher's session records in a live state (32) |
| a forwarded single message charges no triage session | always | the endpoint wrote its one signal (S21) |
| `triage.cadence` batches readers when the operator prefers a quiet hour | none | `flywheel.yaml` triage.cadence |

Curation's threshold counts unmoved signals; triage's bound counts
running triage sessions. A capture whose triage session stalls is a stalled session
and takes the machinery role's retry rule (65, 70).

**What happens when dispatch is down.** Nothing is lost, and every
part catches up by reading.

| part | while down | on return |
|---|---|---|
| the rail | any host serves the page (148); a decision is state, not a message | the presenter tick finds `sink.due` and posts everything newer than the mark, once (14, 137) |
| replies in chat | the chat keeps them | the presenter reads the channel from its last delivery id; a reply naming a number is applied once by its message id (137, tracker.yaml `receive`) |
| captures from the org's adapters | an adapter that writes git needs no endpoint (§4); a caller of the endpoint gets no answer and retries with backoff, which the manifest requires of every named caller | the first successful call writes the capture; a repeat under the same key is a no-op (111) |
| captures from a third party's webhook | lost unless the sender retries or the git host queued it: under the tracker profile the App's webhook deliveries can be listed and redelivered for a bounded window | the dispatcher's start lists deliveries newer than its mark and replays them through the endpoint |
| triage | captures wait with their pointer; an unmoved signal is never discarded (118) | the tick charges readers up to the bound |
| the sink lease | it expires by the stated rule (150); a host declared to present the chat may take it after expiry, never by racing | the returned dispatcher reads that it lost the lease and does not present until it takes it again |

A dispatcher that is down is a stale host on the status view (141,
host.yaml `life`), visible from the phone, with no machinery of the
operator's involved.

## 4. Satellites and edge capture

**Capture is decentralized.** Any tool that writes a capture record is
an adapter (114). An adapter runs anywhere it can read its source and
write the blueprints repository. The binary is the adapter: `flywheel
capture <source>` (model.md §13) enumerates source events, writes one
capture per event under its key, and pushes to the blueprints' shared line
with expected-old (162). It runs unattended because it is arithmetic
(115), and it runs on the tick: every timed behaviour of a host,
adapters included, is a guard on that host's tick, nothing else keeps
time, and a run missed while the host was down is caught up on the
next one (231). An adapter on the operator's machine — a folder
watcher, the notes tool's meeting list, a day of one chat channel —
writes its captures through its own binary and never through dispatch.
The endpoint exists only for callers that cannot write git: a delivery
system's connector, a monitor's webhook, the chat (112,
`captures.md` §1).

**Two adapters, one key.** Captures, signals and moves are files in
the blueprints repository in every profile (157), under the prefix
`flywheel/signals/` (203). The dispatcher clones the blueprints like
any host (217), so the endpoint writes there and pushes with
expected-old; an edge adapter writes through its own host's checkout
and never through dispatch (217g). Two adapters pushing the same key
at once resolve by the push alone: the push is the compare-and-swap
(162), the loser fetches and finds the key present, and the idempotent
key makes its retry write nothing (111, 231).

**The raw material must be reachable by whoever reads it.** A capture
points at its raw material; the raw material stays outside version
control (111). A transcript on the operator's laptop is reachable by a
triage session on that laptop and by nobody else. The rule: the manifest names
a raw store per source (`captures.md` §3, the storage row); an
adapter either puts the raw material there before it writes the
capture, or the machine holding it declares that it triages that
source. So an edge adapter has two shapes:

| shape | raw material | who triages | fits |
|---|---|---|---|
| **copy then capture** | copied to the org's raw store on the private network — a folder a host serves, a bucket the platform reaches — and the capture points there | the dispatcher's triage session, wherever it runs | an org with a cloud dispatcher and laptops that come and go |
| **capture where it lies** | stays on the machine; the capture points at it by that host's name | that machine, as a host declaring `triage: {sources: [meeting, folder]}` with the `pane` runner and the operator's login | a hobbyist with one machine; an operator who will not copy transcripts anywhere |

Both write the same capture. A triage session that finds its pointer
unreachable exits blocked with the question, and the capture waits
under attention (70, 149). The pointer's reachability is checked before
a triage session is charged, so an unreachable pointer is a decision, not a
stalled session.

**The rule, in three lines.**

- Capture is decentralized: any adapter, any machine, one record per
  event, keyed so twice is once (111, 114).
- Triage is one session per capture, charged by the dispatcher's tick
  or by the host that declares the source, up to a bound (115).
- Presentation is one lease per sink (148).

Dispatch owns none of the three exclusively. It is the placement that
carries them for an organization whose hosts sleep.

## 5. Placements

| placement | process | model access | secrets | network | chat | capture endpoint | triage | what it gives up |
|---|---|---|---|---|---|---|---|---|
| **the browser agent alone** (get-started) | none of dispatch's; the page-serving host's own | a model shipped as a script with the page; inference in the operator's browser; no text leaves the private network (surfaces.yaml `interpreter.page`) | none — no API key exists | works wherever the page does: the host serves the page and the tools over the tailnet (155, 191), the phone runs the model | none | none; the page's capture box is the capture tool (19) | none; captures wait for a host declaring triage | chat, webhooks, transcripts. Every decision is still answerable by control and number. |
| **local dispatcher** | `flywheel dispatch` on the operator's machine, as a process or a pane in `flywheel-<org>-machinery` | `pane` for triage under the operator's Claude Code login; `inproc` for the interpreter with a key, or Bedrock credentials, placed by the operator | bot token, App key or push credential, model key, inbound secrets, in the machine's keychain or a sealed file under the root | the machine's tailnet node; the endpoint reachable on the private network only; a public webhook needs a funnel the operator opens for named callers (46) | the bot, while the machine is awake | yes, private | yes | the rail in chat while the machine sleeps; the sink lease then sits with the pin until the machine wakes |
| **invoked dispatcher** (the hosted tiers) | no process stands: one function per tier, each invocation one organization's tick, woken only through that organization's queue (270) | `inproc` under the tier role, the service's model access metered into the rail, or a key the operator places | the tier's own store; no secret of the organization's is held between ticks | no private network at all: the page and the tool server are served at the tier's name and the identity token is the boundary (191, 291) | the service's Slack or Discord application; Discord free text is a slash-command option, Slack free text arrives over the Events API (277) | yes, one queue per organization behind a shared receiver (271) | yes, for a capture whose whole content is in the queue; raw-material triage goes elsewhere (263) | plain Discord channel replies, which need a gateway socket; and anything that will not fit a fifteen-minute tick |
| **cloud dispatcher** | the same binary, placed as §5.1 lists | `inproc` with a key or the runtime's role; `managed` when the platform's sandbox reaches the tailnet | the platform's secret store or vault; never a key that reaches a host (207) | a tailnet node or the platform router's ingress (191); the endpoint public for named callers with their secrets | the bot, always | yes | yes | nothing of the four; costs a running process |

### 5.1 Cloud targets

The cloud dispatcher runs the same tick loop. Each target is judged
on the same six things.

| target | process shape | secrets | private-network reach to the page and the tool server | cost | MCP transport for a `managed` triage session | verdict |
|---|---|---|---|---|---|---|
| **a container on any platform** (Fly, Cloud Run, ECS, a VM, flywheel-cloud) | long-lived; the Discord gateway stays open; the tick runs on its own clock | the platform's secret store, injected as environment | a tailnet node in the container, or the platform router's ingress that flywheel-cloud already is (191) | one small always-on container | not needed: triage is `inproc` | **the placement for an organization that wants the gateway.** The binary unchanged, one image, plain Discord replies read, and an always-on floor to pay for. |
| **Bedrock AgentCore** | a long-lived runtime session, up to hours, restarted on a schedule; the tick runs inside it | AgentCore's identity service and the runtime's IAM role; Bedrock models with no key (`captures.md` §3, the model row) | a VPC route to the tailnet or to the ingress; without it, none | per-session runtime plus model | AgentCore's gateway speaks MCP; the session reaches the dispatcher's tool server over HTTP with the 197 identity | **as a triage runner for an org already on AWS**, not as the dispatcher process: the presenter's socket and the endpoint want a plain long-lived process. |
| **a Claude managed agent** | one session per run from a stored agent definition; scheduled deployments fire sessions on a cron | vault credentials substituted at egress, never in the sandbox | a self-hosted sandbox on the operator's network reaches the tool server; the cloud sandbox does not | per session plus model | the agent's `mcp_servers` by URL, the credential in a vault | **as a triage runner**, by schedule or per capture, with a self-hosted sandbox; never the presenter or the endpoint. |
| **a function set on any platform** | per request; no socket and no clock of its own; a scheduler fires the tick; the endpoint is a function | the platform's environment or the tier's store | no tailnet node; the page and the tool server are served at the tier's name and the identity token is the boundary instead (191, 291) | near zero at rest | none: the interpreter is `inproc` | **a placement, with a scheduler, a receiver and a served name.** Without those three it is not one. It gives up plain chat replies, which need the gateway; free text arrives as a slash-command option or over Slack's Events API. |

**The transport rule.** An agent that shares a process with the tool
server uses stdio or in-process calls. An agent that does not — every
`managed` session — uses remote MCP over HTTP, and every call carries
the session identity start_session issued, which the tool server
checks (197). No third transport. The agent is a client of the tools
and never serves them. On a self-managed host the tool server listens
on the private network and publishing it beyond is the operator's
choice, recorded as one (46). On a hosted host there is no private
network: the page and the tool server are the same request-invoked
function behind the tier's served name, and the identity token the
server verifies on every call is the boundary (191, 291).

**What ships first.** The browser agent and the local
dispatcher, because both are the binary already specified and neither
needs a platform, a container image or a public route. Then the
invoked dispatcher, because that is what the hosted tiers run: one
function per tier, a queue and a receiver per organization, a
scheduler entry, and the page and tool server at the tier's served
name. The long-lived container stays available for an organization
that wants the gateway socket and plain chat replies. AgentCore and
managed agents come as triage runners in the sessions binding when an
organization already runs its agents there, and as a placement for the
whole dispatcher not at all.

### 5.2 The invoked placement

A function that stands for no time at all is a placement when three
things stand in for what it lacks (217i, 270). The scheduler gives it
the clock: one one-shot entry per organization carrying the due time
that organization's last tick computed, targeting the organization's
queue so a due time is one invoker among the rest. The interactions
endpoint gives it the replies a socket would carry: the receiver
answers inside the platform's deadline, deferring where the platform
asks for that, and the tick posts the real reply within the
interaction token's window or as an ordinary message from the
application. The served name with an identity check gives it the
route: the page and the tool server are the same request-invoked
function behind that name, and the token the server verifies on every
call is the boundary the private network is on a self-managed host
(191, 291). What it gives up is what only a socket delivers, plain
channel replies in Discord, so free text there is the string option of
a slash command while Slack free text arrives over the Events API
(277). Every invoker enqueues on the organization's queue, which
admits one tick of an organization at a time, and a request for the
page is a read and never a tick.

## 6. Installation tiers

The tiers are four, named by what exists on the service side (268), and
the plan ladder is five rungs over them (281).

| tier | sign-in and identity | chat | dispatcher placement | triage runner | audit | what is a manifest binding | what is code |
|---|---|---|---|---|---|---|---|
| **0 · your computer** (Free) | `github`: the page signs in with GitHub's device flow, the GitHub username is the identity, the manifest's `operators:` list is membership (243, 253) | the organization's own Discord or Slack application and bot | the browser agent alone, or the local dispatcher | `pane` under the operator's login; no key | history is the audit (167) | `hosts.<host>.identity: {kind: github}`, `hosts.dispatcher`, `sinks.chat.discord` | the Discord adapter, the local and tailnet routers, the device-flow sign-in |
| **1 · cloud agent** (Hobby) | `frontegg`: the hosted login, the served name registered once on the environment's redirect list (243, 244) | the service's Slack or Discord application, scoped to the organization's channel (277) | the invoked dispatcher: one function per tier, woken through the organization's queue | `inproc` at bound zero, the service's model access under the tier role | history plus the App's own log; every response recorded with who and when (153) | `hosts.<host>.identity: {kind: frontegg, environment, client_id}`, `hosts.<host>.tier: 1`, `sinks.chat.slack` or `.discord` | the receiver, the queue and scheduler bindings, the Frontegg sign-in, the platform router |
| **2 · pools** (Pro, Team) | as tier 1, with roles and ownership held per account and carried in the token (248) | as tier 1 | as tier 1 | as tier 1 | as tier 1, with identity administration a surface of the flywheel (255) | `hosts.<host>.tier: 2`, `pools.<name>` with image, bound, cost and retire time | the pool platform binding, the image builder, the management console |
| **3 · your account** (Enterprise) | as tier 1, with the organization's own directory connected to its account (243) | as tier 1 under the first two shapes; the installer's own applications under the third (303) | three shapes (276, 276a, 304, 305). **Stores only:** the same dispatcher, or one of its own in the service account, assuming a role the organization grants. **Stores and compute:** the binary provisioned into that account by the deployer, with only the registry, the deployer and the identity environment left on the service side. **The whole control plane installed** in the installer's own accounts, sold and installed by us, shown in no marketing and no console | as tier 1, under the granted role | as tier 1, exported from history to the organization's log (167) | `hosts.<host>.tier: 3` and the role, key and store names in the organization's account | the federation binding: the issuer, the tagged web-identity session, the content-free wake. Under the third shape nothing more: the binary reads its service side through the invocation contract alone and cannot tell whose control plane it is (297, 305) |

The line between the columns: an adapter for a chat platform, a
sign-in kind, a router kind and a runner are each one piece of code
in the surface, host or sessions crate, shipped once and named by the
manifest. Which of them an organization uses, on which channel, with
which provider, is data (139, 119). No tier changes a machine
definition, an atom or a profile operation.

## 7. Requirements 216–217k, as ratified

216–217k are ratified requirements of `requirements.md`, A.25. They are
reproduced here because this document is their binding;
`requirements.md` is the contract and this copy may not contradict it.

216. Dispatch is four jobs and no more: the presenter of the chat sink
    (148, 152–155), the capture endpoint for callers that cannot write
    the blueprints repository (106, 112), the capture-reading session (115),
    and the host's agent for chat (194). Each job reads and writes only
    through the state store's operations and tools (125, 193). The
    data plane names none of them (C.1).

216a. A model running in the page's browser is the host's agent for
    the page and nothing else (194). It presents no sink, writes no
    capture except through the capture tool the page already calls
    (19), and reads no capture. An organization may run with no other
    part of dispatch; the rail is then served, answered and captured
    on the page, and nothing arrives through chat or through a
    webhook.

217. Dispatch is a host (149) whose declaration takes no object kind,
    no repository and no unit type, and presents the chat sink; it may
    also declare the callers of its endpoint, the sources it triages,
    and the runner of each model job. It runs the same binary, joins by
    the same command (205), heartbeats, holds its leases and ticks like
    every host, and holds a lease only on a sink (148, 150).

217a. Dispatch is stateless between ticks. Every decision it makes is
    derived from what read and list return: the sink's mark, the
    capture keys, the signal records, the response records (136, 7). A
    restart reads the same state and reaches the same conclusion.
    Nothing dispatch holds in memory decides behavior, and no
    conversation persists across ticks or requests.

217b. The two jobs that need a model — reading a capture and
    interpreting a message — are sessions of A.7: a bounded goal, a
    closed set of inputs (89), a fixed set of exits, an identity the
    tool server checks (197). Each is charged per capture or per
    message and ends when it delivers. Neither carries context from
    one charge to the next.

217c. The sessions binding names a runner per model job: a multiplexer
    pane (173, 174), a bounded loop inside the dispatcher's own
    process, or a session on an agent platform. Every runner starts
    the session with the same work order, instruction data and exits;
    the engine cannot tell them apart. The interpreter's runner
    answers within the operator's patience for a chat reply. A runner
    on an agent platform reaches the tool server only over remote MCP
    with the session's identity, and only across the operator's
    private network (46, 191).

217d. No host, session or loop addresses dispatch. Dispatch learns of
    state through the profile's notify and its bounded fetch (130,
    165, 166) and through nothing else. Dispatch reaches the operator
    through the sink's own identity — the bot the manifest names and
    the token the operator placed — and never through a person's
    account.

217e. Triage is distinct from curation. Curation gives signals their
    moves on its own cadence and threshold (110). Triage turns one
    capture into its signals, charged by the tick of the host that
    declares the capture's source, immediately or on a cadence the
    manifest names, up to a bound of readers at once (32). A forwarded
    single message charges no triage session (S21).

217f. When dispatch is down nothing is lost. Decisions are state and
    any host serves the page (148). Replies wait in the chat and are
    applied once by their delivery id when the presenter returns
    (137). A caller of the endpoint retries; a repeat under the same
    key writes nothing (111). A capture waits with its pointer; an
    unmoved signal is never discarded (118). The sink's lease expires
    by the stated rule and never by racing (150).

217g. Capture is decentralized. Any adapter that can read its source
    and push to the blueprints repository writes captures through its own
    binary, from any machine, and never through dispatch (114). The
    endpoint is for callers that cannot write git. Triage reads every
    capture wherever it was written.

217h. A capture's pointer is reachable by whichever host reads it. The
    manifest names a raw store per source; an adapter puts the raw
    material there before writing the capture, or the host that holds
    it declares that it triages that source. A triage session is not charged
    for a pointer that cannot be reached; the capture is a decision
    under attention instead (149).

217i. The placements of dispatch are: the browser agent alone,
    the dispatcher on the operator's machine or in its multiplexer,
    the dispatcher in a long-lived process on a platform, and the
    invoked dispatcher of 270, which is a placement in its own right
    and is the one the hosted tiers use. All run
    the same declaration. What differs between them is placement,
    the store the secrets are placed in, the network route, and the
    model access (191, 207) — all named in the manifest and none in a
    machine, an atom or a profile operation. A placement that cannot
    hold a socket, a clock and a private-network route is not a
    placement for the presenter or the endpoint.

217j. The installation tiers are bindings. A chat platform's adapter, a
    sign-in kind, a router kind and a runner are each code shipped
    once; which an organization uses is data (139). Every response is
    recorded with who gave it and when (153) at every tier; an
    organization that needs the record elsewhere exports it from
    history (167).

217k. Dispatch is installed by the machinery from the manifest and
    never by hand: `flywheel init` records that the organization's
    dispatcher exists and where it is placed (204); the placement's
    own step — a process, a pane, a container, a platform session —
    is an effect with a proof, repeatable, and the secrets it needs
    are placed by the operator and are a decision under attention
    until they are (207). Upgrading dispatch is upgrading the binary
    on that placement; a dispatcher running an older binary than the
    manifest's stamped version is visible on the status view (208).

## 8. Open questions

1. **Discord's gateway and per-request placements.** Plain replies in
   a channel need a socket held open; interactions over a URL give
   buttons and slash commands only. Is a placement that keeps the
   numbered grammar as a slash command (`/answer 412 yes`) and drops
   plain replies acceptable as a reduced presenter, or is a socket a
   requirement of the chat sink?
2. **The interpreter's context.** One message is often a reply to a
   proposal the bot posted. How many messages of the thread does the
   interpreter read, and does it read them from the chat platform or
   from the response records? The former is stateless; the latter is
   derivable.
3. **Endpoint reachability for a local dispatcher.** A monitor's
   webhook from the open internet cannot reach a tailnet node. Does the
   local placement open a funnel for named callers, or does every
   third-party webhook go through an org adapter that retries?
4. **A host that presents the chat as a fallback.** When the
   dispatcher is down and the lease expires, may a construction host
   declared with `presents: [chat]` take it, and does the bot token
   then live on that host too (207 forbids a key that reaches a host;
   the bot token is not a model key)?
5. **`managed` triage and the self-hosted sandbox.** A managed agent's
   cloud sandbox cannot reach the private network. Is a self-hosted
   sandbox on the tailnet an acceptable runner, given that it is a
   process of the operator's again, or does `managed` reduce to
   AgentCore with a VPC route?
6. **Copy-then-capture and retention.** The raw store's retention must
   exceed the oldest unmoved signal (118). Who enforces that, and what
   happens to a capture whose raw material was removed after its
   signals were read?
7. **Triage bound versus curation threshold.** Both are numbers in the
   manifest. Should the status view show unread captures by source
   beside unmoved signals by source (118), so a stalled triage is as
   visible as a stalled curation?
8. **The agent model's size in the browser.** A phone runs a
   small model. Is the browser agent's job narrowed to name
   resolution over the live objects with the tool chosen by control,
   so that a small model suffices, or does it propose the tool too?
9. **One dispatcher per organization.** 148 allows one presenter per
    sink. Two dispatchers — one local, one cloud — could split the
    jobs: the cloud one presents and captures, the local one triages
    with the operator's login. Is that two hosts with two
    declarations, which 217 already admits, or a case to forbid?
