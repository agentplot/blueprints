# Multi-tenant flywheel at scale — a brainstorm

## Thesis

The model does not require a resident host per tenant; the phrasing of three clauses does. A tick is already a pure function of fetched state (136, 217a) whose missed runs are caught up idempotently (111, 231), and a host is already allowed to serve several organizations at once (218). A serverless tier is therefore not a new architecture but a host whose tick is *invoked* rather than looped, serving many organizations from one process over a warm cache of their state repositories. What genuinely does not scale is C.2's 30-second bounded poll (165, 166): it is O(tenants) against the git host whether or not anything happened, and it is the only thing in the design that costs money while a tenant sleeps. Replace the poll with notify plus a derived due index and steady-state cost becomes proportional to *activity*, not tenancy. Everything else — object storage instead of git, a shared bot identity, per-run work containers — is an economics optimisation bought later at a named tenant count, and mostly as a third profile (C.3) rather than a weakening of C.2.

---

## 1. Batch tick — one scheduler, many organizations

**Maps onto** `host.yaml`'s `life` region and the tick-as-scheduler clause (231), plus 218. A batch ticker runs the dispatcher declaration (`bound: 0, kinds: [], presents: [chat]`, 217) once per organization, each with its own root under 205's layout.

**Preserves** all of Part B. Each organization's tick is the same fetch → list → read → evaluate → effect (126–131) against its own `flywheel-state`, with its own leases and decision numbers. Nothing crosses (218). I14 holds: the warm cache mirrors only what git already holds.

**Bends** 231's "a host is one long-lived process that the platform's own launcher starts". The host-id-to-process mapping stops being 1:1. 232 anticipates the inverse — several hosts, one computer, separate processes — and this is several hosts, one computer, one process. The heartbeat branch `host/<id>` must still be written per host id or the status view lies about liveness.

**Cost.** 10 tenants: one 1-vCPU container and a 1 GB volume, a rounding error. 1,000: one 2–4 vCPU machine, ~5 GB of bare mirrors, ~3 git round trips/s, tens of dollars a month. 100,000: ~500 GB of mirrors and 300+ round trips/s *if polling* — the batch ticker alone does not reach that scale without idea 3.

**Experiment.** Run `flywheel dispatch` for 50 organizations in one process on a laptop, each with its own root, and run the host scenarios (a host lost, a takeover, a bound reached) against organization 27 while the other 49 tick. Success is the scenario passing unchanged with no lease or decision number leaking between roots.

---

## 2. Store-and-forward gateway — capture as a queue

**Maps onto** the capture endpoint job (216, 217g, 112) and 111's idempotent key.

**Preserves** every invariant cleanly. The endpoint already writes one keyed capture and nothing else, and 217f already says a caller retries while a repeat under the same key writes nothing. A durable queue between the HTTP handler and the commit changes only *when* the commit happens.

**Bends** nothing in Part B, but it opens a window where a capture is accepted and not yet in git, which I14 forbids to be called state. The honest framing: the queue is the caller's retry buffer held on the caller's behalf, and a lost queue is indistinguishable from a caller that never called. Say so explicitly or someone will treat it as durable.

**Cost.** Effectively free at every scale. One HTTP function plus one queue with a tenant key — cheaper than a queue per tenant and equally correct, because the drain is per-organization regardless. 100,000 tenants at a handful of captures a day is dollars.

**Experiment.** Point a Slack Events subscription and a GitHub webhook at a function that enqueues, let the batch ticker drain, send the same event five times, assert one capture record.

---

## 3. Event-driven tick — the due index

**Maps onto** 130 (notify only shortens the wait), 165–166, and 231.

**This is the load-bearing idea.** A tick is due when one of five things is true: the state head moved, a capture arrived, a chat reply arrived, a lease or timer crossed a threshold, or a cadence fired. Four are *events* arriving at an endpoint you already run. Only timers need a clock, and a timer's fire time is computable at write time. So keep a **due index**: one row per organization holding the earliest future time its tick could change anything, written when a tick ends. The scheduler wakes only rows that are due or whose event arrived.

**Preserves** 130 exactly — the index only shortens the wait, and an organization with a wrong row still converges under a slow backstop sweep (hourly). 136 holds if and only if the index is a cache: derivable by ticking, never read as truth, its loss costing one sweep.

**Bends** 166's flat 30s bound, which becomes conditional: seconds for an organization with a live webhook, the backstop interval for one without. That is user-visible and belongs in a clause, not in an implementation.

**Cost.** This converts the curve. Steady state tracks active organizations, at an assumed 2% active per minute and 200 ms per tick.

| tenants | active/minute | org-ticks/s | vCPU |
|---|---|---|---|
| 10 | ~0 | <1 | fractional |
| 1,000 | 20 | 0.3 | fractional |
| 100,000 | 2,000 | 33 | ~7 |

Polling at 100,000 means 3,333 round trips/s to the git host forever, which no git host will sell you at any tier.

**Experiment.** Make the tick emit, at exit, the earliest time any guard in the evaluated machines could next become true. Run a week of a real organization and measure how often the prediction is wrong. Above 95% correct the index works; below it, the machines carry hidden wall-clock guards worth finding.

---

## 4. State on object storage — a third profile, not a bent C.2

**Maps onto** C.2 (160–167), I14 and I15 — all explicitly profile-scoped — and C.3's conformance contract (168–170).

**The move.** Do not put git on S3. Bind B.1 to object storage directly: read is a GET of the object's record; write an effect is a conditional PUT keyed by the effect id; lease is a conditional PUT on a lease key with the holder's etag as precondition; list is a prefix listing; notify is the bucket's event notification. S3 conditional writes and DynamoDB conditional puts both give exactly 134 and I15's shape. 168 already says a third profile conforms when it binds every name, meets every guarantee, and passes the conformance suite unchanged — and that suite is written.

**Preserves** all of Parts A and B by construction if the suite passes. Per-tenant KMS keys become a storage detail under I13.

**Bends** nothing, *provided* the git mirror is honest. The temptation is a hybrid with the object store as truth and a git mirror for readability; that holds only while the mirror is a declared projection (142) never read as truth, which I4 demands. The moment a host fetches the mirror before a tick you have two sources of truth. Note also what is lost: 167's "history is the audit record" becomes something you build rather than inherit.

**Cost.** Strictly worse at 10 and 1,000 — a profile written to save nothing. It earns its keep where hosting 100,000 private repositories under one account becomes an economic or terms-of-service problem, somewhere near 10,000. Storage at 5 MB × 100,000 is 500 GB, roughly $12/month plus requests.

**Experiment.** Run the existing conformance suite against a stub object-store binding on ten organizations, including S13 (the stale lease) and S18 (the disconnected host reconciling). If S18 has no meaning without a local commit log, that is the finding.

---

## 5. Which roles must stay resident

**Maps onto** 148 (one presenter per sink), 217d, 241.

| platform | plain replies | buttons, slash commands | resident process |
|---|---|---|---|
| Slack | Events API, HTTP POST | interactivity URL | **no** |
| Discord | gateway websocket only | interactions endpoint URL | **only for plain messages** |
| Teams, Webex | webhook | webhook | no |

The free tier is therefore Slack-first, or Discord in interactions mode: the numbered grammar survives as a slash command (`/fw yes 412`) and the buttons work, and you give up only typing `yes 412` as an ordinary message. 155 permits exactly this — the platform's controls as it provides them, with the numbered grammar beside them.

**On 241.** A shared presenter is not blocked by 241, which constrains pool hosts (the ones that run work), not the dispatcher; 218 positively permits a host serving several organizations. What 218 does constrain is isolation, and a process holding sink leases for a thousand organizations must keep a thousand roots, credential sets and lease branches, and must not let a crash in one organization's tick drop another's. Worth a clause rather than an assumption.

**On the bot identity.** 217d names "the bot the manifest names and the token the operator placed". A zero-setup tier wants the tenant to invite *the platform's* bot instead, which places no secret at all and is therefore better for 207 and 229, not worse. The costs are one sharded gateway connection across every tenant's guild, and an audit line where the bot is the platform's rather than the organization's.

---

## 6. Work sessions as per-run containers

**Maps onto** 240–242, 239, 32 and 52.

**Preserves** all of it — this is what the pool machine already describes. `retire_after: 0` makes a pool host per-run, and nothing in the pool machine requires a host to outlive one session.

**Bends** no requirement, but exposes an unmodelled cost: 205 makes a joining host clone the state, the blueprints and *every tracked built repository*. Per-run, that clone dominates the run. 239's image already exists to satisfy environments, so the natural extension is that the image also carries a warm bare mirror of the tracked repositories, making a join a fetch. Then `pool.image_current` should go false when the repositories move far, not only when the declarations move.

**Cost.** Per-run billing is the point: an organization with no approved work costs nothing. At 100,000 tenants with 1% running work that is 1,000 concurrent containers — real money that tracks revenue, the correct shape. A tier-1 tenant declares `bound: 0` and provisions none.

**Experiment.** Set `retire_after: 0` today and measure wall-clock from `provision_pool_host` to the session's first tool call, split into provision, clone and environment activation. That number decides per-run versus a warm pool.

---

## 7. The tiering

| tier | what it is | dispatcher | work | chat | cost to serve |
|---|---|---|---|---|---|
| 0 | your own computer | local, or browser interpreter only | your machine | whatever you set up | zero |
| 1 | cloud agent, free or cheap | a slot in the shared batch ticker, `bound: 0` | none | the platform's shared bot, interactions mode | cents/tenant/month |
| 2 | pools on demand | the same shared ticker | per-run pool hosts | tier 1's, or your own bot | tracks usage |
| 3 | your own account, by federation | the same dispatcher, assuming a role you create in your account with a per-tick OIDC token | your own pool, from your image, in your account | your own app, or ours | your platform's bill, plus our control plane |

Tier 1 answers "one step above using your own computer": sign in with GitHub, the machinery creates the state repository under the tenant's own account (219 already allows repositories under any account the App reaches), invite a bot, and get a page, a chat, a capture endpoint and triage — with no work sessions, so no compute scaling with anything but the tenant's own activity.

---

## Comparison

| idea | invariants kept | bent | cost at 10 / 1k / 100k | ops burden | tenant sets up |
|---|---|---|---|---|---|
| 1 batch tick | I1–I16, all of B | 231's one process; per-id heartbeat | trivial / tens $ / needs idea 3 | one process, one volume | nothing new |
| 2 gateway queue | all | none; queue must be named non-state | ~0 / ~0 / dollars | a queue and a drain | one URL per caller |
| 3 due index | 130, 136 if cache-only | 166's 30s becomes conditional | ~0 / ~0 / ~7 vCPU | index store, backstop sweep | nothing |
| 4 object store | all, via 168's suite | none if the mirror is a projection; loses inherited 167 | worse / worse / $12+ storage | a whole profile, a new audit story | nothing |
| 5 shared presenter | 148, 218, 155 | 217d's per-org bot identity | ~0 / ~0 / sharded gateway | one bot app, shard management | invite a bot, place no secret |
| 6 per-run work | 240–242, 52 | none; 239's image gains a mirror | n/a / usage / usage | image builds, cold-start budget | nothing |
| 7 tiering | all | none; a manifest binding (217j) | — | a billing boundary | pick a tier |

---

## Recommended path

The physical design this path builds toward is `hosted-design.md`: the machines
that exist per organization, what each holds, and one tick step by step.

1. Ship the dispatcher first: one Lambda function per tier, each invocation one organization's tick, assuming the tier role with a session tag naming that organization so tagged keys and objects admit only the matching principal. Git-only unchanged, each organization with its own root and heartbeat. It removes the idling VM, and it keeps no state between invocations: the warm cache is one S3 object per organization, a git bundle of two sparse clones downloaded to scratch disk and uploaded back, with no VPC and no mount.
2. Make notify primary and the poll a tiered backstop, with the due index declared as a cache. This flattens the curve; do it before tenant count makes it urgent.
3. Serve tier 1's chat with the platform's own bot in interactions mode, Slack fully and Discord for controls, so no tenant places a secret and no socket is held per tenant.
4. Run pools as Lambda MicroVMs from the organization's image, up to 32 GB of memory and disk with Docker inside and no VPC, one organization per host, terminated at retire with `retire_after: 0`. Fargate in a minimal VPC is the fallback for sessions past eight hours. Measure the cold start before promising per-run billing.
5. Write the object-store profile only when the git host's economics break, near 10,000 tenants, as a C.3 profile passing the conformance suite — never as a weakening of C.2.

---

## Requirement clauses

Ratified as requirements A.34, clauses 268–278, which carry the tiering, the
invoked tick, the capture queue, the warm cache, the scheduling, the pool
placement, the federation upgrade and the shared chat application, and which
amend 231, 166 and 217d in place. The rest of this file is the narrative and
the platform comparison behind them.

---

## Platforms: Fly.io Machines vs Lambda microVMs

Both are Firecracker. The difference is not isolation but the shape of the contract: Lambda sells a bounded invocation with no durable disk, Fly sells a microVM you create, stop and restart with a volume attached. That difference decides both questions below in the same direction.

| | pool host (240–242) | dispatcher, scale-to-zero |
|---|---|---|
| Lambda | **disqualified.** 900-second cap against sessions of minutes to hours; killing one at 15 minutes is exactly the interruption I5 forbids. `/tmp` is ephemeral, 512 MB–10 GB, gone between execution environments, so 205's root cannot persist; EFS over a VPC restores durability but git on NFS is slow and adds cold start. | viable for the capture endpoint and Slack interactions; cannot hold the Discord gateway, so 216's presenter job has no home. |
| Fly Machines | **the fit.** Created on demand from the tenant's image (239) through the Machines API, no execution cap, one volume per machine holding the layout, destroyed or stopped when the queue drains. | Fly Proxy's `auto_start_machines` wakes a stopped machine on an inbound request; `auto_stop_machines = "stop"` or `"suspend"` puts it back. Stopped machines are billed for rootfs only, $0.15/GB per 30 days, no compute. |

**1. The pool.** Fly, and not closely. But note that Fly's *stop* is not the model's *retire*. A stopped machine keeps its host id and stops heartbeating, so `host.yaml`'s life region takes it to stale at five minutes and gone at thirty, raising a takeover decision under attention for a host that is merely parked. Retire should therefore destroy the machine, ending the host object exactly as 240 says, while the volume survives unattached as a cache that the next pool host in that region reattaches. The volume holds only mirrors of what git holds, so I14 is untouched and a lost volume costs a clone.

**2. Dispatchers that scale to zero.** Yes, the proxy can wake a per-tenant dispatcher machine, routed either as one app per tenant or through a router app returning `fly-replay` to the tenant's app and instance. But two things make "pays nothing idle" false before the first tenant.

- **Nothing wakes it for a due tick.** Fly has no cron. A small always-on machine must sweep the due index (245) and start the due tenants' machines through the Machines API. That is one machine you pay for at all times.
- **The 3-second acknowledgement.** Slack and Discord both require an interaction acknowledged within three seconds. A cold wake is microVM start plus process boot plus the fetch of two repositories, roughly one to six seconds, and suspend-resume shortens only the first term. So the store-and-forward receiver of idea 2 is mandatory rather than optional for a scale-to-zero dispatcher, and clause 246 becomes load-bearing. That is a second always-on component.

**The better first step is still the batch ticker**, for a reason worth stating plainly: per-tenant machines buy no requirement purity that the batch ticker lacks. 241 constrains pool hosts, not the dispatcher, and 218 positively permits one host serving several organizations, so neither 241 nor 217d is bent either way. The only clause the batch ticker bends is 231. Against that, per-tenant machines add three moving parts (per-tenant app or replay router, per-tenant volume, scheduler machine) to reach the same two always-on components, and their storage has the wrong granularity: the smallest Fly volume is 1 GB, so a tenant holding 30 MB of warm clones still pays for 1 GB, a floor of $0.15 per tenant per month, or $15,000 a month at 100,000 tenants for space barely used. A shared cache pays for bytes actually held and evicts the cold ones. Per-tenant machines earn their place at tiers 2 and 3, where the tenant pays and isolation is the product.

**3. What a dispatcher-tier tick touches.** The dispatcher's declaration names no repository and no unit type (217), so it clones no built repository.

- **Fetches** the state repository's shared line, with its lease and host branches read by `ls-remote`, and the blueprints repository's shared line.
- **Pushes** to the state repository: object records and thread entries, response records, its lease on the sink, its own host heartbeat branch, run records and the status page. To the blueprints repository it pushes only under the `flywheel/` prefix (203): captures from the endpoint job, signals from triage. Moves belong to curation, which is not dispatch's job.
- **Never** a built repository, a place, a worktree, or the raw material a capture points at, which stays outside version control (111).

The cache follows from that. The state repository is one record file per object plus append-only threads, with history dominating because every effect is a commit — single-digit to low tens of megabytes. The blueprints repository is read only for the manifest, the claims (157) and `flywheel/`, so a blobless partial clone with a sparse checkout of those three holds tens of megabytes rather than the whole book. Budget 10–50 MB per tenant: 10–50 GB at 1,000 tenants, 1–5 TB at 100,000. At that size the cache must be evictable, which is exactly what clause 245 already grants it and what a per-tenant volume cannot be without destroying the tenant's host.

---

## AWS options

The product in question is **AWS Lambda MicroVMs**, generally available 22 June 2026 — a Firecracker primitive *beside* Lambda functions, not a longer function. It does **not** carry the 15-minute cap and its disk is not `/tmp`. A microVM has a fixed **8-hour** maximum lifetime, up to 32 GB of disk that survives suspend and resume, its own HTTPS endpoint with port-scoped JWE tokens, egress to the internet or a VPC, and `run` / `suspend` / `resume` / `terminate` as explicit API calls. It is the closest thing AWS sells to a Fly Machine. Two facts bound it: the 8-hour ceiling is not adjustable, and the disk dies with the microVM — there is no detachable volume, so Fly's "the volume outlives the machine" trick has no AWS equivalent inside the primitive.

| candidate | max run | disk | start | idle cost | isolation, keys | price shape | fit for (a) pool / (b) dispatcher / (c) capture |
|---|---|---|---|---|---|---|---|
| **Lambda MicroVMs** (GA 2026-06-22) | 8 h, fixed | 32 GB, snapshot-backed, destroyed at terminate | seconds from snapshot; resume "near-instant" | no compute while suspended; ~$0.08/GB-month snapshot, ~$0.0038/GB to suspend, ~$0.00155/GB to resume | own kernel, memory and disk per VM; port-scoped JWE tokens; build and execution IAM roles; **no customer-managed key documented** for images or snapshots | ~$0.0997/vCPU-hour (ARM, us-east-1) + snapshot + egress; baseline ≤4 vCPU/8 GB bursting to 4× | (a) **yes, if a session fits 8 h**; (b) yes; (c) no |
| Lambda function | 15 min | `/tmp`, 512 MB–10 GB, ephemeral | ms with SnapStart | zero | per-invocation environment; CMK supported | per GB-ms | (a) no; (b) **yes**; (c) yes |
| Lambda durable functions (Dec 2025; CMK Jul 2026) | 366 days by checkpoint-and-replay | none of its own | ms | zero between steps | CMK supported | per step plus state | (a) no — replay is not a shell; (b) the tick's orchestrator; (c) no |
| Lambda managed instances (re:Invent 2025) | function limits, on EC2 | instance storage | no cold start | you pay for the instances | EC2-level | EC2 rates, Savings Plans, up to 72% off | none of the three; it removes cold starts, not the cap |
| Bedrock AgentCore Runtime | 8 h per session, microVM destroyed and memory sanitized after | ephemeral, per session | ~2–6 s cold; sub-second off its warm pool | billed on active CPU only; no idle charge | one microVM per session id | ~$0.0895/vCPU-hour, ~$0.00945/GB-hour | (a) right shape, no durable disk, ARM64 container contract; (b) no; (c) no |
| ECS Fargate task (+ EBS attach, 2024) | unbounded | 20–200 GiB ephemeral, or an EBS volume attached to the task | 20–40 s | zero at zero tasks | task-level; EBS with a per-tenant CMK | per vCPU-second and GB-second | (a) **the no-cap fallback**; (b) too slow to wake for a 3 s ack; (c) no |
| App Runner | unbounded | ephemeral | — | never zero; in maintenance mode as of 2026 | service-level | per instance-hour | none |
| EC2 + warm pool | unbounded | EBS, survives stop | seconds to tens of seconds | stopped: EBS only | full VM; per-tenant CMK on the volume | EC2 + EBS | (a) tier 3; (b) no; (c) no |
| API Gateway → SQS, direct | n/a | n/a | milliseconds | zero | queue-level, KMS on the queue | per request | (c) **yes** — acknowledges well inside 3 s with no compute in the path |
| EventBridge Scheduler | n/a | n/a | — | zero | — | per invocation | the sweeper Fly lacks — wakes due tenants with no always-on machine |

**On per-tenant encryption.** The microVM security surface names build and execution roles and port-scoped tokens, and no customer-managed key for images or snapshots — SnapStart takes `--kms-key-arn`, MicroVMs do not. So per-tenant encryption under I13 lives in the *data*: S3, DynamoDB, EBS and EFS each take a per-tenant CMK. The compute is isolated but the key story is the store's.

### Recommended AWS mapping

1. **Tier 1 dispatcher** — a Lambda function behind a function URL for the webhook and interaction paths, plus EventBridge Scheduler sweeping the due index (245) and invoking the batch tick per organization. Warm clones live in one EFS filesystem mounted from the VPC, keyed by organization, evictable.
2. **Capture (c)** — API Gateway REST integrated directly to SQS, no compute in the acknowledgement path, drained per organization by the same tick. Clause 246 stays load-bearing.
3. **Tier 2 pool (a)** — Lambda MicroVMs launched from the organization's image (239), one per work session, terminated at retire. ECS Fargate with an attached EBS volume is the fallback for any session that will not fit 8 hours.
4. **Tier 3** — the tenant's own account by OIDC federation: one IAM role there trusting our issuer with a subject naming the organization, and the key, the cache object, the queue and the pool image all living in that account. We store no credential; deleting the role ends our access.

**The AWS advantage over Fly is the scheduler.** Fly has no cron, so a scale-to-zero dispatcher there still pays for one always-on machine to sweep the due index and one to hold the 3-second acknowledgement. On AWS both of those are managed and bill per event: EventBridge Scheduler for the sweep, API Gateway to SQS for the ack. A tenant that does nothing costs storage only, with no always-on component at all.

### Retire versus suspend

The same ruling the Fly section makes, with one addition. `suspend-microvm` is not the model's *retire*: a suspended microVM keeps its host id and stops heartbeating, so `host.yaml`'s life region takes it to stale at five minutes and gone at thirty, raising a takeover decision under attention for a host that is merely parked. **Retire must call `terminate-microvm`**, ending the host object exactly as 240 says.

What differs from Fly is where the warm mirror can then live. Fly's volume survives its machine and is reattached by the next pool host in the region; a microVM's 32 GB disk is destroyed with it. So on AWS the mirror has to live somewhere the host does not own — baked into the image (248's "what an image carries is what a joining host does not clone"), or on an EFS filesystem mounted over the VPC, or pulled from an S3 cache at join. That is a real consequence for 239 and 248, and it should be stated as a binding rather than left to the platform.

Second, **the 8-hour ceiling is a clause-level fact, not an implementation detail.** A work session that would run past eight hours is interrupted, which is exactly what I5 forbids, and unlike Fly's uncapped machine there is no configuration that lifts it. Either the pool machine states that a session is bounded and what happens when the bound is reached, or the AWS pool tier binds to Fargate instead. This is the honest version of the owner's question: AWS's microVM product does not carry Lambda's 15-minute cap, but it carries a cap, and the model has to say what a capped host does.

### Dev environments inside a microVM

**Size.** Baseline is set on the *image*, vCPU scales with memory at 2 GB per vCPU, and a running microVM bursts vertically to 4× its baseline. The ceiling is **8 GB / 4 vCPU baseline, peaking to 32 GB / 16 vCPU, with 32 GB of disk** — and disk is tied to size, so the 32 GB figure is only available at the top.

| baseline | peak | max disk | endpoint bandwidth |
|---|---|---|---|
| 2 GB, 1 vCPU (default) | 8 GB, 4 vCPU | 8 GB | 4 MB/s |
| 4 GB, 2 vCPU | 16 GB, 8 vCPU | 16 GB | 8 MB/s |
| 8 GB, 4 vCPU | 32 GB, 16 vCPU | 32 GB | 16 MB/s |

**No VPC required.** Outbound is public internet by default through the AWS-managed `INTERNET_EGRESS` connector; a customer-managed VPC egress connector is optional and buys only private-resource reachability. Inbound is a dedicated HTTPS endpoint per microVM, routed to port 8080 unless a header says otherwise, authenticated by a port-scoped JWE token, with `NO_INGRESS` available to close it. That matters for 205's root: a pool host needs no VPC, no subnet and no security group to clone from GitHub.

**Docker inside: yes.** The image sets `additionalOsCapabilities: ["ALL"]`, which grants the elevated Linux capabilities — mounting filesystems, creating network namespaces, eBPF — *inside the VM isolation boundary*, without touching the host or any other microVM. This is the privileged mode Fargate refuses, made safe by the hypervisor rather than by the kernel. Aidan Steele ran `dockerd` in one on launch day (23 June 2026) with two fixes worth writing into 239's image: start it as `dockerd --containerd=/run/containerd/containerd.sock`, and pass `--dns 169.254.169.253` to containers, because outbound UDP is blocked and the default resolver is a localhost stub that containers cannot see. So devcontainer features, docker-in-docker, testcontainers, `docker compose`, nix and devenv, language toolchains and Postgres or SQLite as ordinary processes all work. What does **not** work is nested virtualization: Firecracker exposes no `/dev/kvm`, so no VM-in-VM, no Android emulator, no `qemu-system` acceleration.

**Against the alternatives.** Fargate goes larger — 16 vCPU and 120 GB per task with a real EBS volume — but has no privileged mode, so Docker-in-Docker is impossible there and a build that shells out to `docker` fails. EC2 remains the only place with both real Docker and nested virtualization, on a metal instance. Bedrock AgentCore's Code Interpreter is a sandbox for running a snippet, not an environment you install into. On the axis that matters for 32 and 52 — *can the environment the manifest declares actually be built and run* — Lambda MicroVMs is the only serverless AWS option that clears the bar, and it clears it at 4 vCPU sustained with 32 GB of disk.
