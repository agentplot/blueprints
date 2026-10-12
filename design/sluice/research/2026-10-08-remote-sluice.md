# Remote sluice: what it would be, and whether it is worth having

Research note for the operator, 2026-10-08. Clause numbers are those of
`agentplot/blueprints:design/sluice/requirements.md`; ADRs are sluice's
`docs/adr/0001` to `0007`; rules are `docs/architecture/core.md`.

## 1. The short answer

"Remote sluice" names three separate things, and the operator's question
blends them:

| | idea | what is remote | industry analogue | seams touched |
|---|---|---|---|---|
| **(a)** | remote, confined execution of candidate checks | the place and the executor | Bazel RBE (BuildBuddy, EngFlow, NativeLink, Buildbarn); Nx Agents; a merge queue's CI | place, check (service follows the place) |
| **(b)** | a centralized queue: one coordinator per branch that several hosts submit to | the entries, the lease, the landing | GitHub merge queue, Mergify, Trunk, Aviator, Zuul | branch, driver; the records' location (C.6) |
| **(c)** | a hosted service offering both | everything but the sessions | Nx Cloud, BuildBuddy cloud, Trunk/Aviator/Mergify | none in the core; it is a deployment |

The Bazel analogy is apt for (a) and only for (a). In Bazel's model the
client keeps the graph and the decisions and the server is a dumb pool of
executors plus a content-addressed cache. sluice's core already has that
shape: it is the client (forms candidates, keeps the chain, attributes,
lands) and never runs a check (clause 30, I5). Remote execution is a
check-seam concern, not "sluice as a service".

Hosted merge queues are the analogy for (b), and every one of them makes
the same split: **the queue is central, the checks are delegated to the
customer's CI**. None of them runs tests itself.

Recommendation: build **(a)** next, as a confined-runner profile, because
the shared branch cannot land anything without it (ADR 0007: until a
confined executor exists the shared branch's gate reads missing). Answer
**(b)** in the statement now (it is §10's open question) but build it only
when a second host submits to one branch. Treat **(c)** as a deployment of
(a) and (b), not a design input, and keep it out of the sluice repository
(core.13).

## 2. Remote cache vs remote execution, and where moon stands

**Remote cache**: the client runs the action locally, then looks up and
stores results by a content key. REAPI's `ActionCache` and
`ContentAddressableStorage` services. Turborepo is cache-only over its own
HTTP API, with optional HMAC signing of artifacts
(`TURBO_REMOTE_CACHE_SIGNATURE_KEY`).

**Remote execution**: the client sends an `Action` (a `Command`, an input
root digest, platform properties) to REAPI's `Execution` service; a worker
materializes exactly the input root, runs the command, and writes outputs
to the CAS and the result to the action cache. Platform properties choose
the container image and, on BuildBuddy, the network (`network=off` is the
default for OCI containers). Implemented by Buildbarn, Buildfarm,
BuildGrid, NativeLink, Justbuild, BuildBuddy, EngFlow, Aspect, Flare,
Namespace; spoken by Bazel, Buck2, Pants, Please, BuildStream, recc,
reclient, Siso.

**Distributed task execution without REAPI**: Nx Agents is a purpose-built
scheduler. A coordinator CI job hands whole Nx tasks to agent machines
(hosted Nx Cloud, or "bring your own compute"), sharing results through
Nx's remote cache.

**moon today: remote cache only.** moon's `remote` settings (`api` grpc or
http, `host`, `auth.token`/`auth.headers`, `tls`/`mtls`,
`cache.compression`, `cache.instanceName`, `cache.localReadOnly`,
`cache.verifyIntegrity`, `cache.retryCount`) speak REAPI's cache services
to bazel-remote, Depot or any REAPI v2 cache. Neither the docs nor the
2.x release notes (2.6.0 added HTTP retries and blob-stored hash
manifests) mention the `Execution` service. moon runs every task on the
host that invoked it.

Two consequences for sluice:

1. A REAPI-native check profile would have to turn each moon task into a
   REAPI `Action` itself: an input root from moon's hash manifest, the
   toolchain in a container image, outputs collected. That is building
   moon's missing remote-execution client (recc-style command wrapping
   exists for compilers, not for task runners). It is large, and it fights
   clause 31: a check that needs an emulator or a server brings it up in
   its place through the service seam, and a per-action, network-off REAPI
   sandbox has no place for a service to live in.
2. The realistic remote executor for moon is a **whole runner**: a clean
   machine or container that checks out the candidate, brings up declared
   services, runs `moon run` on the affected checks, and writes to the
   remote cache with a credential only it holds. That is what ADR 0004
   already describes as the confined executor, and what every hosted merge
   queue delegates to.

## 3. Hosted merge queues: what they centralize and what they delegate

| queue | central | delegated | notes |
|---|---|---|---|
| GitHub merge queue | queue order, temp branches `gh-readonly-queue/<base>/...`, the merge | CI, triggered by the `merge_group` event; status checks | build concurrency 1 to 100, group size 1 to 100, failed PRs removed and the rest regrouped; "only merge non-failing PRs" toggles attribution |
| Mergify | queue, speculative checks, batching | CI in the customer's infrastructure | on failure removes the PR, rebases the rest, re-runs CI |
| Trunk merge queue | queue; parallel queues inferred from "impacted targets"; batching with bisection; optimistic merging | CI | the lanes of clause 8, inferred from the build graph |
| Aviator MergeQueue | queue; parallel mode from affected targets; stack-aware | CI | self-hosted deployment offered |
| Zuul | dependent pipelines, speculative states, shared queues across projects | its own executors on Nodepool nodes | the only one that also owns execution; a central service |
| bors-ng / homu | "not rocket science": test the merge, then fast-forward | CI | deprecated in favour of GitHub's queue |

Every one of these is a central service, because the forge is central and
the queue's state has to be where every contributor can reach it. sluice's
situation differs in one way that matters: its submitters are agents on
the operator's own hosts, and its branch moves are plain git with
compare-and-swap. A central coordinator is not required for correctness
(section 4b), only for global order.

## 4. Mapping onto sluice's seams

### (a) Remote, confined execution of checks

**What changes in Parts A and B: nothing.** Clause 52 holds. The pieces:

- **Place profile, "pushed candidate"**: materialize (33) pushes the
  candidate revision to a ref the runner can fetch and asks a runner for a
  place on it; release (34) deletes the ref and ends the runner. The
  guarantee (35) is met by a clean checkout of exactly that revision.
- **Check profile, "moon on a runner"**: affected (36) stays local (moon's
  affected projects between the branch and the candidate need only git);
  run (37) is moon's run in the remote place, returning per task its hash
  as key, exit code, whether it was replayed, and the runner's identity as
  executor.
- **Service**: unchanged. The declared-services profile runs inside the
  runner's place; clause 41 is trivially met, one runner per place.
- **Trust**: the runner is the only holder of the remote cache's write
  credential; agent hosts set `cache.localReadOnly` (ADR 0004). The shared
  branch's policy names the runner as a trusted executor (27, 28, 29).

The candidates for the runner, cheapest first:

1. **A local confined container** on the same host: the candidate
   exported read-only into a container with no host mounts and no session
   state, holding the write credential. Not remote at all, but confined.
2. **The forge's CI** (GitHub Actions) on a pushed candidate branch, via
   `workflow_dispatch` or a push trigger. This is what every hosted queue
   does. Note that GitHub push triggers fire for branches and tags, so
   candidates would live under a branch prefix such as `sluice/cand/*`
   rather than an arbitrary ref namespace.
3. **A self-hosted runner pool** (the same workflow on the operator's own
   machines), when CI minutes or latency matter.
4. **REAPI execution** of individual moon tasks, only if moon gains an
   execution client or the per-action sandbox is wanted for trust.

**Design tensions to settle before building it:**

- **What "confined" means.** The vocabulary says an executor is confined
  "when it could not read beyond its declared inputs". A REAPI action with
  an exact input root meets that literally. A CI runner with a clean
  checkout of the candidate can still read undeclared files inside the
  repository; it is confined from the *sessions*, not from its own repo.
  ADR 0004 makes the write credential the boundary, which is the second
  reading. The statement should say which (core.12: change the clause
  first, never work around it here).
- **Where failed runs' records come back from.** moon archives only
  passes (ADR 0004's probe), so a remote fail leaves nothing in the cache
  for sluice to read. The runner must return its run report and run
  record to sluice by another channel: an uploaded blob in the CAS
  (REAPI's CAS stores arbitrary blobs), a CI artifact, or a check run on
  the forge. Core.7 needs the record before the verdict, fails included,
  and its authenticity is a trust question: a forge check run is attested
  by the forge's app identity, a CAS blob by the write credential.
- **Place and check profiles must agree on the place's form without
  calling each other** (core.2). B.2's `run` takes a place, so a remote
  check needs a remote place. The core's place handle has to carry enough
  (a revision and an opaque location) for any check profile to run there.
  Worth an ADR before the first remote profile.

**What it buys**: the shared branch can land at all; agent hosts stop
spending CPU on candidate checks; a candidate's checks no longer contend
with agents' own builds; executors scale independently of agent hosts.

**What it costs**: candidate latency gains a push, a runner start and
toolchain setup (minutes on hosted CI, less with warm self-hosted
runners); a remote cache service to run; a credential to manage; and the
records channel above.

**When it is worth it**: immediately for trust, at one host, because the
shared branch is blocked without it. For speed, once checks on candidates
measurably slow the agents on the same host, roughly when the window times
the number of active branches exceeds what the host's spare cores absorb.

### (b) A centralized queue for one branch across several hosts

This is §10's question. Three shapes, from no coordination to full:

**b0. Each host runs its own sluice and lands by push.** With a
pushed-refs `move` (C.4: a push the remote accepts only from the expected
revision, `git push --force-with-lease=<branch>:<expected>` or a
non-force fast-forward), **I1 and I4 still hold**: a candidate formed on a
stale revision is refused at the remote and re-formed (24). But clause 6
and 7 break across hosts: neither host sees the other's entries, so a
lower-priority entry on host B can land before a higher-priority one on
host A, and an `after` naming another host's entry cannot be honoured.
Conflicts and failures are discovered late and work is thrown away, which
is the race ADR 0002 set out to end. Non-conforming; useful only as a
fallback.

**b1. One coordinator host per branch.** Records stay local to the
coordinator exactly as C.6 and ADR 0007 say; the branch lock (ADR 0005)
still serializes steppers. Other hosts submit through a driver profile
that pushes the head to a ref and writes a submission the coordinator
ingests (an entry ref, or a call over SSH). State (49) is served to other
hosts by the coordinator publishing each entry's state, for instance as a
ref per entry rewritten at every step, which also meets clause 51 for
remote readers. No new process type: the coordinator is just the host
where `sluice run` or the driver's loop runs for that branch. Lowest cost,
one point of failure (a stopped coordinator stalls the branch but loses
nothing, S10).

**b2. No fixed coordinator: entries and lease as refs.** C.4's pushed-refs
sketch taken whole. Entries are JSON blobs under a namespace such as
`refs/sluice/<branch>/entries/<id>`; the chain is leased by compare-and-swap
on `refs/sluice/<branch>/lease`; any host's stepper that wins the lease
steps the branch. This requires changing C.6 (records are no longer local
and never pushed), so the statement changes first (core.12); clause 53's
"one form whatever profile wrote them" means the JSON stays identical and
only its storage moves.

**What the lease is for.** Landing safety does not depend on it: the
move's compare-and-swap (45, 46) already guarantees two moves from one
expected revision never both succeed. The lease protects what the CAS
does not: exactly one culprit, told once (17, 20, I3, core.8), one record
per run (core.7), and no duplicate check work. A lease needs an expiry for
a coordinator that dies; using the lease ref's revision as a fencing token
on every record write keeps a stale holder from writing after expiry.

**Seams and rules**: branch (`move` by push), driver (remote submit, state,
notify), and the records' location. core.4 holds (a session's submit
pushes a head to an entry ref, never the branch). core.10 holds (no port,
no daemon the core starts). core.11 holds for b1 and b2 (records are files
or git objects readable without sluice).

**One forge caveat**: if the branch is protected on GitHub, sluice's push
identity needs a ruleset bypass, and GitHub's own merge queue must be off
for that branch, or the two queues contend.

**When it is worth it**: from the second host that submits to the same
branch. Bolt branches that live on one host never need it. The shared branch
needs it as soon as bolts land from more than one machine. With one
operator and one large machine, not yet.

### (c) A hosted service offering both

Architecturally (c) adds nothing: it is b1 or b2 run on someone else's
machine, plus a runner pool for (a), plus a REAPI cache. Every seam binding
is the same. What it changes is operational (who holds the write
credential, who sees the code) and is a trust question for a policy's
author (27), not for the core. The design should make (c) possible, by
keeping records readable without a sluice process (core.11) and the
executor's identity in every record, and should not assume it.

## 5. Recommended direction and smallest next step

1. **Do (a) first, as a CI runner, not REAPI.** It unblocks the shared
   branch and needs no change to Parts A and B. Smallest step: a spike in
   one repository with (i) a REAPI cache (bazel-remote or NativeLink's
   CAS) whose write credential only CI holds, (ii) agent hosts on
   `cache.localReadOnly`, (iii) a workflow that checks out a pushed
   candidate branch, runs `moon run` on the affected checks, and uploads
   moon's run report and run records, and (iv) a hand-run `sluice step`
   reading those back into records. Measure candidate latency and the
   replay rate.
2. **Before that spike, write two things down**: the meaning of
   "confined" in the statement's vocabulary, and an ADR on how the place
   and check profiles share a place handle (core.2).
3. **Answer §10 in the statement with b1** (one coordinator host per
   branch, other hosts submit by pushed refs, state published as refs), and
   name b2 as the profile to grow into. Build it when a second host first
   submits to the shared branch.
4. **Leave REAPI execution of individual tasks** until moon offers an
   execution client or a policy demands per-action confinement.

## 6. Questions for the operator

1. How many hosts run agents today, and do any two of them submit to the
   same branch? Is the shared branch the only multi-host branch?
2. Does "confined" mean a clean runner that holds the write credential
   (CI-level), or a per-task sandbox that sees only declared inputs
   (REAPI-level)? The statement's wording says the second; ADR 0004 builds
   the first.
3. Is GitHub Actions acceptable as the shared branch's confined executor,
   or must executors run on hardware you control?
4. Do any checks need services (emulators, servers)? If so, REAPI
   per-action execution is ruled out for them, which settles question 2's
   practical answer.
5. Which remote cache: self-hosted bazel-remote or NativeLink, or a hosted
   one? Who holds its write credential?
6. Is a single coordinator host (b1) acceptable, with a stopped
   coordinator stalling but not losing the branch, or is coordinator
   failover a requirement now?
7. Is GitHub's own merge queue on for any branch sluice will land?

## Sources

- moon remote cache guide: https://moonrepo.dev/docs/guides/remote-cache
- moon workspace config, `remote`: https://moonrepo.dev/docs/config/workspace
- moon v2.6.0 release notes: https://newreleases.io/project/github/moonrepo/moon/release/v2.6.0
- REAPI and its implementations: https://github.com/bazelbuild/remote-apis
- Bazel remote execution services list: https://bazel.googlesource.com/bazel/+/HEAD/docs/community/remote-execution-services.mdx
- BuildBuddy RBE platforms (container image, `network`): https://www.buildbuddy.io/docs/rbe-platforms/
- NativeLink: https://github.com/TraceMachina/nativelink
- recc: https://dyn.manpages.debian.org/testing/buildbox/recc.1
- Nx Agents: https://nx.dev/ci/features/distribute-task-execution
- Turborepo remote caching: https://turborepo.dev/docs/core-concepts/remote-caching
- GitHub merge queue: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue
- Mergify speculative merging: https://mergify.com/learn/merge-queue/speculative-merging
- Trunk merge queue vs GitHub: https://trunk.io/trunk-vs-github-merge-queue
- Trunk batching: https://docs.trunk.io/merge-queue/concepts-and-optimizations/batching
- Aviator parallel mode: https://docs.aviator.co/mergequeue/concepts/parallel-mode
- Zuul gating: https://zuul-ci.org/docs/zuul/latest/gating.html
- Merge queue history (bors, homu): https://mergify.com/blog/the-origin-story-of-merge-queues
