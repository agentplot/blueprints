# Finding: how the loop programs are actually built today

**Item:** #368 · research · intent/loop-granularity
**Session:** 2026-08-25-loop-programs-as-built
**Read at:** flywheel@`b64c860` (records) / `flywheel/main` working tree, 2026-08-25

Every quote below is verbatim from the file and line named. Nothing here
is inference unless it says so.

---

## 0. The answer in one paragraph

Process granularity is decided in exactly two places, and both are small:
`_flywheel_inbox.server_inbox`, which keys its job table
`(milestone, kind)`, and `_flywheel_server.plan`, which keys its process
registry the same way. **But the parallelism the operator is after is not
blocked by either of them.** The bolt loop already carves a bolt into
per-unit, per-change *batches* — each with its own `build/<change>`
branch, its own worktree, its own herdr pane name, its own type config
and its own built repo — and then drives them **strictly one at a time**
in a plain `for` loop in `BoltLoop.cycle`. The serialization is that
`for` loop, not the process boundary. Meanwhile the intent loop, in the
same repo, already does the opposite: it launches every batch's session
before waiting on any. So the cheapest route to inter-unit parallelism is
the intent loop's launch-all-then-wait shape applied to `cycle`, not a
new process per unit — and a per-unit process additionally has to answer
for four things that are provably bolt-wide and not unit-wide: the bolt
branch and its single worktree, the merge into it, the charter
(`bolt.md`), and the landing.

There is, separately, a **real defect** that the per-unit instinct is
right about and that has nothing to do with parallelism: a unit card's
`Team` is required at expansion and then discarded, so two units on one
bolt naming different hosts route to one host arbitrarily. §3.7.

---

## 1. Where process granularity is decided, and how load-bearing it is

### 1.1 The job table — one job per milestone, by construction

`bin/_flywheel_inbox.py:499` `server_inbox(snapshot, changes_dir=None, sweep=True)`.
Every job is filed through one closure, at `:523`:

```python
    def add(milestone, kind, why):
        jobs.setdefault((milestone, kind), Job(milestone, kind, why))
```

`kind` here is `run` or `archive` — **not** bolt/intent. The key carries
no unit, no batch, no item. `setdefault` is the whole granularity
decision: the first reason for a milestone wins and every later one is
dropped. The file says so explicitly at `:539`:

> **First, so the card's reason wins.** `add` is `setdefault`, so the
> first reason for a milestone is the one reported

The per-item branch at `:597` proves the collapse — it iterates items and
still writes one milestone-keyed job:

```python
        if item.ready or item.in_progress:
            add(item.milestone, "run", f"#{item.number} {item.state or ''}".strip())
```

`Job` itself has three fields (`milestone`, `kind`, `why`) — `_flywheel_inbox.py:492-496`:

```python
@dataclass(frozen=True)
class Job:
    milestone: str
    kind: str      # run | archive
    why: str = ""
```

There is nowhere in the job to put a unit.

**The `why` string is the backoff fingerprint, and on the main-line branch
it is nearly contentless.** `:608`:

```python
            add(item.milestone, "run", f"#{item.number} {item.state or ''}".strip())
```

`Item.state` is the *GitHub issue state*, not the state label —
`Item.state: str = "open"` (`:182`), filled by `from_api` as
`state=raw.get("state", "open")` (`:258`), and `is_open` is
`self.state == "open"` (`:190`). So an ordinary ready-or-in-progress item
produces the reason `#123 open`, identical for `state:ready` and
`state:in-progress`. The server holds a loop on that string
(`_flywheel_server.py:239` `left = held.wait_left(now, job.why)`,
`:655` `held.record_exit(loop.want.why, self.clock())`).

**This has already cost the fleet real time, and the code records it.**
`_flywheel_inbox.py:561-567`:

> Before the per-item loop, so the operator's approval is the reason a
> held loop sees. `add` is setdefault and the backoff releases a hold
> only when a job's reason CHANGES — with the item loop first, a
> milestone held on "#N queued and unbatched" kept that reason through
> a Ready flip, and the operator's approval waited out the full hold
> (observed live: three elaborations approved, sessions ~11 minutes
> late).

That is a granularity failure observed in production: three independent
approvals contended for one milestone-level fingerprint. It was fixed by
reordering which reason wins, not by splitting the loop. A second one is
recorded at `:938-943` — a mis-milestoned plan card "started phantom
bolt loops" — the milestone being what starts a loop.


### 1.2 The process registry — keyed the same way

`bin/_flywheel_server.py:200` `plan(jobs, *, teams=None, host=None, running=(), ...)`.
The key is built at `:220`:

```python
        key = (job.milestone, job.kind)
```

and `running` is documented at `:203` as

> `running` is the set of `(milestone, kind)` keys with a live process
> here.

The live registry matches: `Server.__init__`, `:352`

```python
        self.processes = {}         # (milestone, kind) -> LoopProcess
        self.backoff = {}           # (milestone, kind) -> Backoff
```

and `Server.start`, `:637`:

```python
        self.processes[(want.milestone, want.kind)] = LoopProcess(
```

### 1.3 The command line the process gets

`Server.argv_for`, `:400-415`. The loop is told a slug and nothing
narrower:

```python
        argv = [str(command), "--slug", slug,
                "--org", self.config.org, "--repo", self.config.repo,
                "--project", self.config.project,
                "--repo-dir", str(self.config.loops_cwd)]
```

Its docstring (`:389`) is already emphatic that the process is *not* the
owner of the branch:

> The bolt branch and its worktrees are the loop's to cut and adopt, in the
> built repos — the server passes no worktree.

### 1.4 What else assumes one process per milestone

| Site | Assumption | Line |
|---|---|---|
| `_flywheel_server.loop_log(org, kind, slug)` | one log file per `<kind>-<slug>` | `:93` |
| `Server.write_state` | `rows[milestone] = {...}` — `flywheel status` rows are milestone-keyed; two processes on one milestone overwrite each other | `:472-486` |
| `Server.board_teams()` | `milestone -> Team`; routing is milestone-granular | `:367-381` |
| `Backoff` | fingerprint is the milestone's single `why` string | `:150-183` |
| `_flywheel_ledger` | `<state-home>/<org>/observations/<scope>/`, "scope is `bolt-<slug>`" | `_flywheel_ledger.py:4` |
| `BoltParams.milestone` / `.change_dir` | one change directory per milestone | `_flywheel_bolt_loop.py:971-980` |
| `inbox.bolt_inbox(snapshot, slug)` | the loop's *exact* filter takes a slug only — no unit parameter exists | `_flywheel_inbox.py:744` |
| `_flywheel_inbox.Tracker.snapshot(milestone=…)` | "Built per-milestone when a milestone is given" | `_flywheel_inbox.py:1508-1519` |

**How load-bearing:** the two key sites (§1.1, §1.2) are each one tuple.
Widening them is genuinely small. The eight rows above are the tail, and
they are bookkeeping surfaces — logs, status rows, run records, backoff —
not correctness. The *correctness* cost is entirely in §3.

---

## 2. What the bolt loop does per unit today

### 2.1 Expansion — one card becomes one unit, and a bolt holds many

`_flywheel_bolt_loop.py:1521` `guard_expand`. Its docstring settles that
bolt-of-units is the live model, not a future one:

> Board approval reaches construction here and nowhere else, and it
> reaches it once per APPROVAL rather than once per bolt. A bolt
> carries as many units as the operator approves over its life; each
> expansion adds one beside the units already there and touches
> neither them nor their items.

Expansion runs over **all** the milestone's Ready cards in one pass
(`:1546-1550`):

```python
        cards = [c for c in getattr(snapshot, "plan_cards", ())
                 if c.at_ready and c.milestone == self.params.milestone]
```

`_expand_card` (`:1655`) swaps `plan`→`unit`, then creates one work item
per plan-table task, `state:ready`, on the milestone, attached as a
sub-issue of the card (`:1699-1710`).

### 2.2 The unit is already the loop's grouping key

`analyse` (`:752`) — "Group ready items into the batches one session could
take":

> the tracker already carries it as
> the unit an item was released in. Items sharing a parent ride together —
> unless they name distinct changes: an expanded plan task IS its own
> spec-driven change, and each change gets its own batch, its own
> session, and its own `build/<change>` branch (construction-loop.md:
> one writer per branch).

So a `WorkBatch` today ≈ one change ≈ one build branch, and units are
*already* the relatedness boundary above it.

### 2.3 Each unit brings its own type and its own built repo

- `unit_config(batch, snapshot)` (`:3055`) — the unit's `Type:` line
  selects the stage set for *that* batch. `cycle` calls it per batch
  (`:3206`).
- `unit_binding(batch, snapshot)` (`:2995`) — the unit's `System:` line
  resolves *that* batch's built repo out of `--bindings-json`. `cycle`
  calls it per batch (`:3163-3166`).
- `ensure_bolt_worktree` (`:1145`) is written for exactly this:

> the first batch that resolves to a repo is what cuts
> `bolt/<slug>` there, so a bolt spans exactly the repos its units
> name

One bolt milestone can therefore already carry units of different types
targeting different repositories.

### 2.4 The stage labels are written per batch

`cycle`, `:3213-3266` — `set_stage(batch.numbers, …)` for
`STAGE_PLANNED`, `STAGE_BUILT`, `STAGE_VERIFIED`, `STAGE_MERGED`, each
gated on `config.runs(stage)` where `config` is *the unit's*.

### 2.5 Sessions are named per batch, never per milestone

`session_name(prefix, slug)`, `:847`:

```python
def session_name(prefix, slug):
    """`<type>-<topic>`, capped where herdr caps it. ..."""
    return f"{prefix}-{slug}"[:sessions.MAX_NAME]
```

Callers pass the **batch/change** slug: `session_name("spec-writing", change)`
(`:2208`), `session_name("build", batch.slug)` (`:2259`). The intent loop
learned the same lesson the hard way — `_flywheel_intent.py:476`:

> a name shared BETWEEN batches did the opposite: round
> two reused round one's idle pane, the reuse path sent no new order,
> and the loop marked work settled that no session ever saw (observed
> live: the site intent's #301 and #302). The batch's first item number
> makes the name per-batch

**Consequence for the granularity question: pane names do not collide
between units. The reuse-by-name rule is not an obstacle to per-unit
processes, and it is not what serializes them today either.**

### 2.6 Where it already runs in parallel — and where it serializes

**It serializes.** `BoltLoop.cycle`, `:3193`:

```python
        for batch, binding in resolved:
```

and inside that body every stage is a blocking call — `self._drive(batch,
"spec", …)` at `:3210`, `"build"` at `:3237`, `"verify"` at `:3257`,
`"merge"` at `:3268` — each of which launches a session and waits for it
(`BoltLoop.drive`, `:1319`, then `settle`, `:1344`). Batch *B* does not
begin its spec session until batch *A* has merged, failed, or paused.

That is the whole of the serialization. It is **not** the merge gate:
`merge_stage`'s own docstring, `:2612`, says the merge is not what
serializes —

> Serialization is the caller's — `run` merges in a plain loop.

**The intent loop, in the same repo, already does the other thing.**
`_flywheel_intent.py:951-962`:

```python
            # Every batch launches before any is waited on: the sessions run in
            # parallel, the WAITING is the loop's and is serial, and so is the
            # merging that follows it — one writer to the base branch at a time.
            live = []
            for batch, row in zip(batches, plan):
                ...
                spec, handle = dispatch_batch(batch, writer, runner, config, clock)
                ...
                live.append((batch, spec, handle))
            ...
            for batch, spec, handle in live:
                land(batch, spec, handle, writer, runner, tracker, config, ...)
```

So the shape that gets inter-unit parallelism inside one process is
already written, tested and running — one loop over.

### 2.7 Cross-unit dependencies are already handled *inside* one process

- `after_split` (`:798`) — "an item whose `After:` names a task not yet
  merged waits".
- `_predecessor_in` (`:1583`) — a card blocked by a **sibling unit on the
  same milestone** defers until every one of that unit's work items is
  closed. Its docstring names the deadlock this replaced:

> Closure of the blocker itself is the wrong predicate under
> bolt-of-units, and provably deadlocking. A blocking card is now a
> sibling unit on the same milestone; the loop closes a unit card
> `closed:done` only AFTER the bolt lands, and the landing waits on
> the milestone's open unit cards.

Both of these read the milestone-wide snapshot the single process holds.

---

## 3. What a per-unit process would have to own or share

### 3.1 The bolt branch and its worktree — **shared, and unlocked**

`ensure_bolt_worktree(repo)` (`:1145`) memoizes per repo *within a
process* (`self._bolt_worktrees`) and otherwise adopts by path via
`worktree_for` (`:1057`), whose docstring says:

> Idempotent: an existing worktree for the branch is adopted by path.

Idempotent **across restarts**, not across concurrent processes. Two
per-unit processes on one bolt would both adopt the same worktree path
for `bolt/<slug>` in the same repo and both run `wt merge` in it. There is
no lock anywhere in `bin/`. This is the single hardest thing a per-unit
split has to answer.

### 3.2 The merge — **shared target, serialized only by being one caller**

`merge_stage` (`:2612`) runs, in the shared bolt worktree:

```python
            proc = self.shell(["wt", "merge", branch, "--no-remove"],
                              cwd=bolt_worktree)
```

and on green archives the change and commits *in that same worktree*
(`:2673-2681`). Concurrent processes would interleave `wt merge`, `git
merge --abort` (`:2647`), `openspec archive` and `git commit -m` in one
working tree. The conflict path is already the documented failure mode —
`:2626`:

> a CONFLICT means a sibling moved under this branch — an agent seat is
> reserved for that, stubbed today to a pause the operator works by hand.

Per-unit processes make that path common rather than exceptional.

### 3.3 The charter and the change directory — **shared**

`BoltParams.change_dir` (`:975`) is one directory per milestone;
`guard_scaffold` (`:1746`) writes `bolt.md` into it; `guard_charter`
(`:1944`) maintains it; `merge_criteria()` (`:2150`) reads it. N processes
would race the scaffold and the charter writes into one records checkout,
which must additionally be **on main** (`records_checkout`, `:1726`).

### 3.4 The landing — **bolt-wide, and explicitly not a unit's**

`holding_cards` (`:3538`) states it outright:

> The landing is the bolt's boundary, not a unit's: one landing carries
> the branch to main for every unit the milestone holds.

`close_unit_parents` (`:2940`) agrees:

> A bolt milestone holds as many units as the operator has approved
> cards on it, and one landing serves them all — so this closes
> **every** open unit on the milestone, not one.

`land_stage` (`:2773`) reads `snapshot.on(self.params.milestone)` and
upgrades every `closed:merged` item on the milestone. `landing_wanted`
(`:3489`) reasons over the milestone's whole unlanded set. **A per-unit
process cannot own the landing.** It needs either a milestone-scoped
landing process beside the unit processes, or an election.

### 3.5 Expansion — **bolt-wide, and prior to units existing**

`guard_expand` (`:1521`) finds Ready `plan` cards on the milestone. A card
that has not been expanded *is not yet a unit*, so no per-unit process
exists to expand it. Expansion needs a milestone-scoped actor too.

### 3.6 Tracker writes and the API budget — **multiplied**

Each cycle's snapshot is repo-wide, not milestone-wide, before filtering:

- `open_issues()` (`_flywheel_inbox.py:1410`) — every open issue in the
  repo, `--paginate --slurp`.
- `merge_closed_issues()` (`:1423`) — every `closed:merged` issue.
- `board_items()` (`:1453`) — the whole GraphQL project, paginated.
- `closed_milestones()` (`:1444`).
- one `blocked_by` GET per open item on the milestone (`:1533`), one
  `sub_issues` GET per unit/elaboration (`:1544`), and one `blocked_by`
  GET **per open plan card repo-wide** (`:1562-1567`).

N per-unit processes multiply all of that by N, every cycle, against one
App token whose retry discipline is a single shared wrapper
(`_flywheel_gh.py`). The design record already prices a false-positive
process start as cheap (`loop-programs.md:46-49`); it does not price N
concurrent full-repo snapshots.

### 3.7 Herdr panes and the session runner — **not a problem** (§2.5)

Names are batch-scoped in both loops. This is the one shared resource the
per-unit split does *not* have to solve.

### 3.8 Routing — **the one thing per-unit genuinely fixes**

`_expand_card` requires a Team and says why (`:1656-1664`):

```python
        if not card.team:
            # The unroutable thing is the UNIT, not the bolt: the bolt's
            # other units and their items are untouched by this refusal.
```

And then nothing reads `card.team` again — `grep -rn "\.team" bin/*.py`
returns exactly that one line plus the server's milestone-keyed
`board_teams`. Routing is decided at `_flywheel_server.py:221`:

```python
        team = board_teams.get(job.milestone)
```

built from `Server.board_teams()` (`:367-381`), which is
`milestone -> Team` with a Ready row preferred and otherwise
`table.setdefault(milestone, team)` — first row wins.

**Therefore: two units on one bolt naming different hosts route to one
host, chosen by board row order.** The loop refuses an unrouted unit as
"a defect at approval time" and then cannot honour the routing it
demanded. This is a defect independent of parallelism, and it is the one
argument for per-unit granularity that a `for`-loop rewrite does *not*
answer. Queued as a discovery.

---

## 4. Where `design/loop-programs.md` and the code disagree

Quoted by anchor. The record is `flywheel/main/design/loop-programs.md`,
"Status: RELEASED to construction by the operator, 2026-08-13".

### 4.1 The record predates bolt-of-units entirely

`loop-programs.md` never uses the word "unit". Its bolt loop is
`:68-69`:

> query+guards -> spec (per strategy) -> apply -> verify -> merge
> -> land -> bookkeeping -> re-query ... STOP

and its guards are `:71-73`:

> GUARDS every cycle, idempotent, writes-only actions ... (Flip-consume
> relabel; discovery routing by the merge-criteria test;
> scaffold-if-missing.)

The code has, beyond those: `guard_expand` (`:1521`, "-1 — expansion"),
`guard_charter` (`:1944`), `guard_stages` (`:1425`), `unit_config`
(`:3055`), `unit_binding` (`:2995`), `close_unit_parents` (`:2940`),
`holding_cards` (`:3538`), `_predecessor_in` (`:1583`). **The record is
silent on the entire object the granularity question is about.** That is
the largest disagreement, and it is an omission rather than a
contradiction.

### 4.2 The intent loop's guard list is misquoted in the code

`loop-programs.md:144-145`:

> query+guards (scaffold-if-missing, flip-consume, handoff birth,
> compose) -> typed design sessions -> collect deliverables ->
> merge sess/* branches -> re-query ... STOP

`_flywheel_intent.py:3-7` presents itself as quoting that passage:

> `design/loop-programs.md`, "The intent loop":
>
>     query+guards (flip-consume, ready-consume, compose) ->
>     typed design sessions -> collect deliverables ->
>     merge sess/* branches -> re-query ... STOP

The code silently substituted its own list. `grep -n "scaffold"
bin/_flywheel_intent.py` returns nothing: **the intent loop has no
scaffold-if-missing guard**, contrary to `loop-programs.md:148-153`
("Guard 0 is scaffold-if-missing, exactly as on the bolt loop and as a
program step"). `handoff birth` is also gone — superseded by the bolt
planner (`Server.plan_runs`, `_flywheel_server.py:534`), which the record
does not mention. `ready-consume` (`_flywheel_inbox.ready_consume_plan`,
`:777`) is new and unrecorded.

### 4.3 The bolt type list is wrong

`loop-programs.md:106-129` names four types and settles plan mode as
bolt-quick's alone (`:112-113`):

> Plan-mode is bolt-quick-only — settled, no more back-and-forth.

`ls schemas/` returns five: `bolt-adversarial bolt-default bolt-direct
**bolt-plan** bolt-quick`. `schemas/bolt-plan/schema.yaml` is a type of
its own, and `LoopConfig.mode` (`_flywheel_bolt_loop.py:167`) is a
per-type field, not a per-bolt declaration:

```python
    mode: str = "spec"          # spec | plan — the construction path
```

The book (`books/flywheel/src/construction-loop.md`, "Unit types") has
already moved to five and to "The type is a unit's choice, named on its
unit document's `Type:` line"; the record has not.

### 4.4 The merge's serialization is described at the wrong level

`loop-programs.md:88-89`:

> MERGE, a static loop step — no session: `wt merge` through the
> gate, **serialized per target branch**

`merge_stage`'s docstring (`:2617-2618`) says the opposite about where the
serialization lives:

> Serialization is the caller's — `run` merges in a plain loop.

There is no per-target-branch serialization mechanism in the code. The
merges are serial only because the caller is a `for` loop in one process
(§2.6). The record's phrasing implies a property that would survive
concurrency; the code's does not.

### 4.5 Review is a separate stage in the record, a sub-step in the code

`loop-programs.md:80-84` describes REVIEW as a first-class thing between
verify and merge. In the code `review_stage` (`:2526`) is called from
inside `verify_stage` (`:2449`), and `LoopConfig.stages`'s legal set is
`DEFAULT_STAGES = ("spec", "build", "verify", "merge", "land")`
(`:154`) — "review" is not a declarable stage. `LoopConfig.validate`
(`:206`) would **raise** on a type declaring `stages: [... review ...]`.

### 4.7 The record's own history already reversed a per-unit choice

`PlanCard.bolt`, `_flywheel_inbox.py:341-355`:

> The bolt milestone this unit belongs to: the one the planner
> filed the card onto, and nothing else.
>
> **No fallback to the title slug.** The planner creates the milestone
> and files the card onto it, so a card arrives already knowing where
> it belongs; a name synthesized from a title is not a milestone the
> tracker holds, and routing work to one **starts a loop on a milestone
> that does not exist** while the card's own bolt goes unstarted.

and `PlanCard.slug`, `:335-339`:

> The unit name the card's title carries. Still the card's parsed
> name — for the change id and the log line — **but no longer a source
> of milestones**

A unit's own name once produced a milestone, i.e. once effectively gave a
unit its own loop, and that was deliberately removed. Whatever the
granularity decision is, it should be made knowing this ground was
crossed once already in the other direction.

### 4.6 What the record got right and the code kept

The over-approximation asymmetry (`:46-49`) is quoted verbatim in
`server_inbox`'s docstring (`_flywheel_inbox.py:515-517`). The
completion-signal resolution R1 (`:237-246`) is implemented exactly —
`argv_for`'s docstring (`_flywheel_server.py:381-385`) makes a point of it:

> **Nothing here names a completion signal, because there is nothing
> to name.**

The backoff (`_flywheel_server.py:150`) is the honest exception, and says
so:

> This is not in the record. It is named on #74 for review rather than
> smuggled in.

---

## 5. What the per-unit change would actually cost

Stated as the edits it implies. The list is what the code says, not an
estimate of effort.

### 5.1 The mechanical widening — small

1. `_flywheel_inbox.Job` — add a unit field; `server_inbox`'s `add` key
   becomes `(milestone, unit, kind)`; the `setdefault`-wins-first comments
   at `:539` and `:552` need rewriting per-unit.
2. `_flywheel_inbox.bolt_inbox(snapshot, slug)` (`:744`) — takes a unit
   and filters `ready`/`in_progress` to that unit's sub-issues. The
   record's rule "a loop filter must be exact" applies here: the filter
   must be exactly one unit's items, and items born outside a unit (the
   landing's fix item, `:2870-2880`) have no unit to belong to.
3. `_flywheel_server`: `plan()` key (`:220`), `Server.processes` /
   `Server.backoff` (`:352-353`), `Server.start` (`:637`), `loop_log`
   (`:93`), `Server.write_state` rows (`:472-486`), `argv_for` (`:400`)
   plus a `--unit` option on `bin/flywheel-bolt-loop`.
4. `_flywheel_ledger` scope (`:4`) — `bolt-<slug>-u<n>`, and whatever
   renders run reports learns to merge N scopes per bolt.
5. `BoltParams` — a unit field; `BoltLoop.cycle` filters `batches` to it.

### 5.2 The coordination that does not exist yet — not small

6. **A lock on `bolt/<slug>`'s worktree and the merge into it.** Nothing
   in `bin/` locks anything today. Either a real lock, or a
   milestone-scoped merge actor the unit processes hand branches to.
7. **A milestone-scoped owner for expansion, the charter, and the
   landing** (§3.4, §3.5) — three guards and one stage that are provably
   bolt-wide. In practice: a milestone process that runs the guards and
   the landing, plus N unit processes that run spec→build→verify→merge.
   That is *two* process kinds where there is one.
8. **Cross-unit deferral across processes.** `_predecessor_in` (`:1583`)
   reads the milestone snapshot; per-unit it becomes a cross-process wait
   with its own liveness question ("which of us re-checks, how often").
9. **`route_findings` (`:3411`)** runs once per *run* over the
   milestone's queued items. N processes → N findings-routing sessions
   over an overlapping queue.
10. **N× the API budget** (§3.6) with no batching layer to add it to.

### 5.3 The alternative the code already contains — one edit

Rewrite `BoltLoop.cycle`'s `for batch, binding in resolved:` (`:3193`)
into the intent loop's shape at `_flywheel_intent.py:951-962`: launch
every batch's first stage, then wait, then merge serially. It buys
inter-unit *and* intra-unit parallelism, keeps one process per milestone,
keeps the bolt worktree single-writer, keeps expansion/charter/landing
where they provably belong, and adds zero API cost. It does **not** fix
per-unit host routing (§3.8), which is a separate one-line-ish fix at
`_flywheel_server.py:221` reading the unit's Team rather than the
milestone's.

---

## 6. Decisions this feeds

- **Is the loop's unit of drive the milestone or the unit?** The evidence
  says: keep the process per milestone, move the parallelism into
  `cycle`, and fix routing at the unit. §2.6, §3.4, §5.3.
- **If per-unit is chosen anyway**, it is two process kinds, not one, and
  it needs a lock the codebase has never needed before. §5.2.
- **`design/loop-programs.md` needs a writeback regardless.** It is silent
  on units, misdescribes the intent guards, names four types where there
  are five, and describes a merge serialization the code does not
  implement. §4.


---

## 7. Found along the way

Three things this investigation turned up that are outside item #368's
scope and are queued as their own items rather than fixed here.

### 7.1 A unit card's `Team` is demanded and then discarded

Evidence in §3.8. `_expand_card` refuses a card with no Team
(`_flywheel_bolt_loop.py:1656`) calling an unrouted unit "a defect at
approval time"; `grep -rn "\.team" bin/*.py` shows that line is the only
reader of `card.team`. Routing is decided from
`Server.board_teams()`'s `milestone -> Team` map
(`_flywheel_server.py:367-381`, `:221`), where among non-Ready rows
`table.setdefault(milestone, team)` means first row wins. Two units on
one bolt naming different hosts route to one host, chosen by board row
order, silently.

**The fix, concretely:** carry the unit onto the job (`Job` gains a unit
field, `server_inbox` keys per unit) *or*, without changing granularity,
have the bolt loop refuse expansion of a card whose Team disagrees with
the milestone's other expanded units — a check in `_expand_card` beside
the existing no-Team refusal, which turns a silent misroute into the
same visible refusal.

### 7.2 The backoff fingerprint cannot tell ready from in-progress

Evidence in §1.1. `server_inbox`'s main-line reason is
`f"#{item.number} {item.state or ''}"` (`_flywheel_inbox.py:608`) and
`Item.state` is GitHub's open/closed (`:182`, `:258`), so both a
`state:ready` and a `state:in-progress` item render `#N open`. A
milestone whose reason is already `#N open` from an in-progress item and
which then gains a *newly ready* item on a different unit sees no
fingerprint change, so `Backoff.wait_left` (`_flywheel_server.py:174`)
keeps holding — up to `BACKOFF_MAX_S = 900`. This is the same failure
class as the recorded 11-minute delay at `_flywheel_inbox.py:561-567`,
which was fixed for plan cards and Ready batches by reordering, and left
standing here.

**The fix, concretely:** one word — `item.state` → the state label, e.g.
`f"#{item.number} {'ready' if item.ready else 'in-progress'}"`. The
existing tests that assert on `why` strings would move with it.

### 7.3 The plan-mode work order tells the session to cut its own worktree

`worktree_for`'s docstring states the rule
(`_flywheel_bolt_loop.py:1058-1060`):

> The loop is the worktree orchestrator — worktrunk's agent-handoff
> pattern: the orchestrator creates the worktree and the session is
> born inside it. **No order ever tells a session to run `wt switch`.**

`plan_mode_build` follows it — it calls `self.batch_worktree(batch, repo)`
(`:2356`) and launches the session with that as `cwd` (`:2361`). But the
brief it sends says (`:2410-2412`):

```python
            f"Worktree: in \"{repo}\" run  wt switch --create "
            f"build/{batch.slug} --base {self.params.bolt_branch} --no-cd  and work "
            f"there. ..."
```

The session is already in that worktree. The sibling briefs say the
opposite and say it well — `spec_brief` (`:2249-2251`): "You are IN the
build/{batch.slug} worktree, already cut from {bolt_branch} by the loop —
work here, and never create a branch or worktree."

**The fix, concretely:** replace the `Worktree:` paragraph in
`plan_brief` (`:2410-2413`) with `spec_brief`'s sentence.

### 7.4 Noted, not queued

`ready_consume_plan` (`_flywheel_inbox.py:777`) is wired into
`IntentInbox.spent_ready` (`:899`) and applied by the intent loop
(`_flywheel_intent.py:431`), but `BoltInbox` has no equivalent and the
bolt loop never consumes a spent Ready. On the normal path this cannot
bite — `_expand_card` calls `clear_board_status` at `:1710`, so an
expanded unit carries no board Status. It would bite only a unit the
operator flips to Ready *after* expansion, which would then keep its
milestone reporting a job on every sweep until the milestone closes
(the failure `_flywheel_inbox.py:527-531` describes and bounds). Left
as an observation for the elaboration rather than a queued item,
because whether that flip is a legal gesture is a design question this
batch cannot settle.
