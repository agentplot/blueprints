# Who starts the services tests depend on?

Research for sluice: should the merge queue start test services (databases,
dev servers, emulators), or only run the repository's test command?

## Recommendation

Start nothing. Drop `[services] up/down`. Sluice runs the one test command
(a moon target or a single command) in a clean checkout and reads its exit
status; whatever the tests need is brought up and torn down by the test
harness or the task graph the repository already owns. Every merge queue
surveyed works this way: the queue forms the candidate and waits on a
verdict, and the job definition or test harness owns services.

Sluice still owes the tests a small, tool-neutral contract:

1. **A clean checkout of exactly the candidate**, at a path that is unique
   per candidate and stable for the life of that run.
2. **An identity in the environment**: e.g. `SLUICE_PLACE` (a short unique
   id) and `SLUICE_CHECKOUT` (absolute path). Harnesses use these to name
   databases, compose projects, socket dirs and state dirs, the way
   pytest-xdist uses `worker_id` and Bazel uses `TEST_TMPDIR`.
3. **A private scratch/state directory** inside or beside the checkout
   (Bazel's `TEST_TMPDIR` analogue) so sockets, pid files and data dirs never
   collide across parallel checkouts.
4. **No port allocation by default.** Industry practice is ephemeral ports
   (port 0, testcontainers mapped ports, devenv `ports.*.allocate`). If an
   opt-in is wanted, sluice can export one *hint* (`SLUICE_PORT_BASE`, a
   block reserved per place) without binding or probing anything, but this
   is optional and should not be the main mechanism.
5. **A timeout**, after which sluice kills the run; a timeout is recorded as
   its own outcome, not a pass.
6. **Process cleanup**: run the command in its own process group/session and,
   when the command exits, times out, or the place is removed, signal the
   whole group (TERM, grace period, KILL). This is the one thing the queue
   genuinely must do, because a leaked dev server from candidate N holds a
   port or lock that fails candidate N+1 and gets misattributed. Bazel's
   test runner takes the same stance ("the test runner may kill any stray
   processes").

Where the queue must help: (a) orphaned processes (item 6); (b) port
collisions only when the repo hard-codes ports, which is the repo's bug;
the env identity (item 2) and optionally a port-base hint (item 4) are
sufficient help; (c) daemons that escape the process group (docker
containers, `devenv up -d`, `launchd`): sluice cannot see these, so the repo
should tear them down with its own teardown (moon `cleanup` dep, devenv
`devenv test`, testcontainers Ryuk). Sluice can at most document that
contract, and optionally offer a per-place removal hook, not an up/down pair.

This also fits the rules: core.10 forbids the core starting processes that
outlive a place, binding ports or computing a port; item 4 as a pure hint
might still read as "computing a port", so leaving it out is the safest
reading.

## 1. Test frameworks and runners

The dominant pattern is "the test process owns its dependencies, on
ephemeral ports, and cleans them up".

- **Testcontainers** (all languages): maps container ports to *random free
  host ports* "by design, to avoid port collisions that may arise with
  locally running software or in between parallel test runs"; tests read
  the port with `getMappedPort`.
  https://java.testcontainers.org/features/networking/
  The Ryuk reaper removes labelled containers when the test process exits or
  dies, even on SIGKILL.
  https://golang.testcontainers.org/features/garbage_collector
  https://dotnet.testcontainers.org/api/resource_reaper/
- **Playwright `webServer`**: the test config names a `command` and a `url`;
  Playwright starts it, waits for readiness (`timeout`, default 60 s), and
  kills the process group at the end (`gracefulShutdown` or SIGKILL).
  `reuseExistingServer` is the knob that causes cross-checkout collisions if
  a fixed port is used.
  https://playwright.dev/docs/test-webserver
- **Vitest `globalSetup`**: setup once before workers, teardown after all
  files; values such as a chosen port are passed via `provide`/`inject`.
  https://vitest.dev/config/globalsetup (Jest's `globalSetup`/`globalTeardown`
  is the same shape.)
- **pytest fixtures**: session-scoped fixtures start/stop services; with
  pytest-xdist, per-worker isolation uses `worker_id` (e.g.
  `test_db_{worker_id}`).
  https://pypi.org/project/pytest-xdist/
- **Go `TestMain`** and `httptest.NewServer`: setup/teardown around `m.Run()`;
  `httptest` listens on `127.0.0.1:0` (ephemeral). (Standard library docs:
  https://pkg.go.dev/testing#hdr-Main , https://pkg.go.dev/net/http/httptest)
- **Django**: the test runner creates `test_<NAME>` databases and destroys
  them whether tests pass or fail; `--parallel` clones per worker.
  https://docs.djangoproject.com/en/5.2/topics/testing/overview/
  Rails similarly maintains its test database (`db:test:prepare`) and
  numbers per-worker databases under `parallelize`.
- **Port practice**: ephemeral port 0, testcontainers mapped ports, CI
  services with unspecified host ports. Fixed ports are the anti-pattern
  that breaks parallel runs.

## 2. moon

- `options.persistent: true` marks a long-running task (server, watcher).
  The `server` preset sets persistent, disables cache and `runInCI`, and
  streams output. Persistent tasks default to `runInCI: false`.
  https://moonrepo.dev/docs/config/project
- **moon 1.x (incl. 1.41)**: persistent tasks are collected and run *last*,
  in parallel; non-persistent tasks cannot depend on them. So in 1.x a
  `test` task cannot depend on a `db` server task and have moon start it
  first. https://moonrepo.dev/blog/moon-v1.6
- **moon 2.6+**: dependency `type` was added:
  - `wait`: runs before the task, but the task only waits for it to *start*,
    "not the same as being ready"; may be persistent; "not stopped once this
    task has completed"; keeps running until the pipeline exits.
  - `cleanup`: runs *after* the task even when it fails ("stopping a
    database"); skipped if the task was cache-hydrated.
  - `wait`/`cleanup` deps don't contribute to the hash and always run.
  https://moonrepo.dev/docs/config/project ,
  https://newreleases.io/project/github/moonrepo/moon/release/v2.6.0
- **Limits**: no readiness probe (the test or a wrapper must poll); no
  per-instance port allocation (use env/tokens); the persistent dep lives
  until the `moon run` pipeline exits, so whoever runs `moon run` must let it
  exit and should reap the process group. A `wait` + `cleanup` pair gives a
  repo-owned up/down inside the task graph: exactly the thing sluice's
  `[services]` duplicates. `runInCI` matters: sluice should decide whether
  it presents as CI (`CI=true`), since a task that runs in CI cannot depend
  on one that doesn't.

## 3. devenv

- `devenv test`: builds the environment, starts the defined processes, runs
  `enterTest`, then stops the processes. `wait_for_port <port> <timeout>` is
  provided; the docs point to tasks for richer dependency management.
  https://devenv.sh/tests/
- `processes` (native manager or process-compose): readiness probes (exec,
  HTTP, notify, TCP), `after`/`before` with `@started`/`@ready`/`@completed`.
  `devenv up -d` / `devenv down` for background control.
  https://devenv.sh/processes/
- **Ports**: `ports.<name>.allocate = <base>` finds a free port from the base
  upward, holds it during evaluation, releases it just before start;
  `strict_ports` for deterministic assignment. Documented as letting multiple
  projects run "without manual coordination", which covers parallel
  worktrees on one host. State lives under `$DEVENV_STATE` (per project
  root, so per worktree).
- So a devenv repo's test command is simply `devenv test`, and it brings up
  and tears down its own services with non-colliding ports. Caveat:
  allocation is check-then-release, so a small race between parallel
  checkouts is possible; the fix belongs in devenv/the repo, not sluice.

## 4. Merge queues and CI

No merge queue starts services. The queue forms a candidate and waits for a
status; the CI job definition owns services.

- **GitHub merge queue**: creates `gh-readonly-queue/...` branches and
  dispatches `merge_group` events, then "await[s] a response from your CI
  provider".
  https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue
- **GitHub Actions `services:`**: the *runner* creates a fresh container per
  service per job and destroys it at job end; an unspecified host port is
  randomly assigned and read from `job.services.<id>.ports`. This is the job
  definition, not the queue.
  https://docs.github.com/en/actions/use-cases-and-examples/using-containerized-services/about-service-containers
- **GitLab CI `services:`**: the runner starts service containers at job
  start and removes them when the job ends, reached by alias hostname, no
  host ports.
  https://docs.gitlab.com/ci/services/
- **Zuul** (the original gating speculative queue): "Any setup or artifact
  collection required is the responsibility of the job itself" via
  pre-run/run/post-run/cleanup-run playbooks.
  https://zuul-ci.org/docs/zuul/latest/job-content.html
- **Bors, Mergify, Trunk, Aviator**: all push a candidate branch (e.g.
  `staging`, `trunk-merge/...`, `mq-tmp-...`) and wait for the customer's CI
  statuses. https://docs.trunk.io/merge-queue
- **Buildkite**: services come from the pipeline step (docker-compose
  plugin), not from Buildkite itself.
- **Bazel**: provides `TEST_TMPDIR`, `TEST_SRCDIR`, size-based timeouts;
  "Tests may create subprocesses, but not process groups or sessions"; "the
  test runner may kill any stray processes. Tests should not leak processes".
  Network is opt-out sandboxed; services are started inside the test or via
  a wrapper target. This is the closest analogue to sluice's contract:
  isolated temp dir, env vars, timeout, stray-process kill, and nothing else.
  https://bazel.build/reference/test-encyclopedia
- **Nx**: continuous tasks (`continuous: true`, Nx 21+) are started as deps
  of e2e targets, analogous to moon's `wait` deps; again the task graph, not
  any queue.

## 5. Implications for sluice

- The `[services] up/down` pair duplicates moon `wait`/`cleanup`, devenv
  `devenv test`, Playwright `webServer`, testcontainers and fixtures, and
  it puts a process lifecycle in the core that core.10 already rules out.
- What the queue owns is isolation and hygiene around the one command:
  clean candidate checkout, unique identity in env, private tmp/state dir,
  timeout, kill-the-group on exit/timeout/removal, and recording that the
  run happened (core.7).
- worktrunk already gives per-worktree `hash_port` (10000-19999) and
  `pre-remove`/`post-remove` hooks for stopping dev servers; that is the
  natural home for a repo's per-place teardown on the worktree-tool side.
  https://worktrunk.dev/hook/ Note `hash_port` hashes into a 10k range, so
  collisions between parallel places are possible; ephemeral ports remain
  the safer default.
- Residual risk sluice can't fix: services that escape the process group
  (docker daemons, `devenv up -d`). Document that the test command must
  leave nothing running when it exits; optionally, after a run, report
  (not kill) listeners or containers labelled with `SLUICE_PLACE`.
