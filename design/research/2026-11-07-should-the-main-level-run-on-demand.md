A research reading, not a decision: whether crew's five main-level roles should run on demand as Flume places rather than stand in herdr panes, read on deneb on 2026-11-07 in the research place `research--should-the-main-level-run-on-demand`. What the user settles goes to agentplot-design as a record; nothing here amends a rule.

# Should crew's main level run on demand?

## In short

- **The move was agreed, and it hasn't happened.** The accepted end state is that no role stands: each run is a turn Flume launches when something waits for the role (record 0047 move 6, record 0049, Flume record 0039). On deneb today every role of every partition stands. crew has built most of its side of the move, but no role has crossed.
- **Two launchers are designed for one thing.** crew's `role-runs` spec has the runner keep a role's run, reading crew's own files. Flume record 0039, later and on the user's ruling, has Flume launch it from crew's roles file, with the runner handing crew's events to Flume by `flume wake`. crew's spec, its usage text and the runner's code still follow the first design. This has to be settled before any role moves.
- **On demand does not save much in tokens for a busy role.** A standing agent's cost comes from the size of its context on each call, not from sitting idle. A run's cost comes from writing its starting context, about 65 to 70 thousand tokens, at every start. For agentplot's busy planner and design agent the two come out roughly even, and which way it tips depends on how many wakes one run absorbs. The real gains and losses are elsewhere.
- **What on demand gains:** no standing context that drifts or gets compacted (agentplot's design agent compacted five times in 30 hours, the planner four), the records as the only memory (`roles.6`), no restart machinery, and an idle partition that holds nothing.
- **What it loses:** answering in seconds, the conversations the user has in the roles' panes (agentplot's planner took about 130 typed messages from the user in 30 hours), asks that arrive while the user is talking with a role, and the coordination roles carry in their heads between turns rather than in records.
- **The user's direction of 2026-11-08 points one way:** "You need to start to cut away from crew even more so that planning sessions and those sorts of things run through Flume, similar to how they would with the real control plane." Their Boom Drive context pack of 2026-11-04, weighed against the records by agentplot-design, has planning as an open-source Flume recipe. Under the records, a control plane (crew now, the hosted one later) decides when a session runs, and a thin runner launches it into Flume. A session is then something a control plane asks the runner for, not a role standing in crew. *The drive's model* maps the five roles onto it, and *Where the recipes live* answers the pack's question of where the planning recipe belongs, which agentplot-design gave this talk.
- **What is still open:** who decides when a session runs (the control plane alone, or Flume on its own as well), how long a session may take to answer, and how the sessions the user talks in behave while they talk. *Shapes to choose between* sets out four shapes, and *Questions for the user* asks the rest.

## What stands today

Read on deneb on 2026-11-07, around 22:00Z.

| What | Where it was read | What it says |
|---|---|---|
| Every role stands | `~/.config/crew/teams.json` (version 5, written by swancloud's `lib/crew-teams.nix`) | Four partitions: afterthought, agentplot and madswan on deneb, wldn on chuck-herdr-alpha. Each `flume` object gives all five roles `false`. |
| The standing agents Flume sees | `flume status` (Flume 0.17.0), its addresses | 15 addresses on deneb, each a standing agent from crew's roles file. 13 were found waiting or working. `afterthought-reviewer` and `madswan-reviewer` had no agent of that name. Nothing was pending for any address. |
| crew's roles file | `~/.local/state/crew/flume/roles.toml`, written by crew's follower (record 0057, `teams.25`) | One `agent` and `session` entry per role. The operators carry `answerer = true`; design, planner and ops carry what they answer. |
| crew's kinds folder | `~/.local/share/flume/kinds/crew`, declared by `~/.config/flume/sources/crew.toml` | Empty, as record 0057 decision 5 has it until the first crossing. |
| The host's watch | `flume status`, last line | "no caller keeps watch: every place settles at each command of flume's that acts". Flume record 0051 has the runner's pass keep the watch with `flume settle --every`, but that isn't running on deneb, so deneb runs attended. |
| What runs on the host | `ps` | `boomdrive run` (the runner), `crew-follow` (crew's follower), sluice's drivers. |

What crew has built for a role that runs as its kind (the change `2026-10-31-roles-run-as-flume-kinds`, archived, and the `role-runs` spec):

- **Five kinds** in `plugin/flume/kinds.toml`, `crew-design` through `crew-operator`. Each has one stage, `turn`, which lands nothing and delivers a report; its prompt is `plugin/flume/turn.md`.
- **Asks.** An ask is a record of `asks.rec` on the partition's branch. A tell, crew's notice, a send, a capture, a landing, a card's answer (heard through the follower's `pendingyou watch`), an opening or a batch each writes one, but only for a role that runs as its kind.
- **The turn commands.** `crew role start` takes everything pending, records the turn and prints the brief's path and what it took. `crew role end` answers the turn and writes the report. `crew role open` lets the user open a role to talk, and `crew role land` launches a role's work that lands as a Flume chore place.
- **`roles.rec`.** One record per role that runs as its kind: address, kind, stream, model and effort.
- **The runner's side** (agentplot/boomdrive at 3f428cf, `crates/flywheel-crew/src/roles.rs`). A role is wanted while anything is pending for it. The runner offers its run with `flume launch --kinds <crew's file>` where none stands, and declares it done once its report is written.

What Flume 0.17.0 has (`guides/roles-and-wake.md`, records 0039, 0044, 0051, 0058):

- **Roles from a source's roles file.** A standing agent's entry gives `agent`; a run's entry gives `kind`, a repository, `name`, `intent` and `agents` settings, with the effort setting among them (record 0044, in 0.17.0).
- **`flume wake <address>`.** A settle that finds an end pending for an address with no run launches one inside the settle. `flume inbox` collects a role's ends and the places that wait on it.
- **The answerer behind a stream.** Every stall reaches it.
- **A notice for a role's run waits until the run's start has taken its prompt** (record 0058, 2026-11-07).

### The two launchers

crew's change of 2026-10-31 chose the runner as the launcher, with Flume's own wake rejected in its Decision 1. Its reasons were that Flume then named a role's run by the role alone, so two partitions' planners in one repository would be one place, and that a run Flume launched never ended by itself.

Flume record 0039, accepted 2026-11-05, fixed both: a run is named from its entry, and a run is over at its delivery. Its deciders include the user's ruling "(2) flume starts a role's run, and the runner hands crew's events to flume by `flume wake`". Its amendment of 2026-11-06, and crew's record 0057 of 2026-11-07, have a role cross by its roles-file entry trading `agent` for `kind`.

So two designs now hold for one act:

| | crew's `role-runs` spec, the runner, crew's usage text | Flume record 0039, crew record 0057 |
|---|---|---|
| Who launches a run | the runner, from `roles.rec`, while crew's files say the role is wanted | Flume: on an end pending for the address, or on `flume wake` |
| Where the kind comes from | `--kinds <crew's file>` in the pinned release | a package in crew's kinds folder, locked by the host |
| Who ends a run | the runner declares it done | Flume, at its delivery |
| How a run learns what waits on it | `crew role start` reads asks, and the waiting places from the runner's records | `flume inbox` for Flume's ends and waiting places; crew's asks are still crew's |

Both are partly built. If both were in force, a role whose `flume` names a stream would get a `roles.rec` record, which the runner launches from, and a `kind` entry in `roles.toml`, which Flume wakes from. That is two launchers of one place. Under the family rule (one design, one owner the others call), Step 0 of the design below settles it.

## A standing day, measured

From the transcripts of agentplot's four standing agents, 2026-11-06 22:25Z to 2026-11-08 03:06Z, 30.7 hours, mostly 2026-11-07. Each assistant message is counted once by its id. "Context" is input plus cache reads plus cache writes on a call.

| | design | planner | ops | operator |
|---|---|---|---|---|
| Model calls | 1,311 | 1,120 | 465 | 426 |
| Cache reads (M tokens) | 334.2 | 256.1 | 66.8 | 109.5 |
| Cache writes (M tokens) | 2.17 | 1.59 | 0.77 | 1.16 |
| Output (M tokens) | 0.87 | 0.53 | 0.16 | 0.16 |
| Mean context per call | 255k | 229k | 144k | 257k |
| Median context when woken | 317k | 271k | 153k | 229k |
| Compactions | 5 | 4 | 2 | 1 |
| Woken by a tell or crew's notice | 87 | 172 | 64 | 115 |
| Woken by a card's answer (Pending You's wake) | 30 | 41 | 23 | 0 |
| Woken by a background task ending | 25 | 9 | 23 | 8 |
| Messages typed by the user (including a few compaction carry-overs) | ~35 | ~130 | 14 | 37 |

The rates for Opus 5.5 (the claude-api skill's model table, cached 2026-10-06) are $4 per million input tokens and $20 per million output. A cache read costs $0.20 per million, 0.05 times input. A cache write costs 1.25 times input with a 5-minute cache and 2 times with a 1-hour cache, and Claude Code's sessions here use the 1-hour cache. The pool's accounts are subscriptions, so the figures below are equivalents for comparing, not a bill. Over the 30.7 hours they come to about $102 for design, $74 for the planner, $23 for ops and $34 for the operator, about $233 in all. About two thirds of that is cache reads, a fifth cache writes and the rest output.

Three readings follow:

- **An idle standing agent costs nothing in tokens.** Every token is spent on a wake. afterthought's and madswan's roles, quieter that day, made 80 to 300 calls each, and every partition's roles are restarted together when crew changes: afterthought's five at 19:15Z.
- **The cost of standing is context size.** Every call re-reads the whole standing context, 230 to 320 thousand tokens at the median for design, the planner and the operator. Context grows until it's compacted, so the memory a standing agent carries between turns is already a summary several times a day.
- **Much of the waking is the roles talking to each other.** The planner took 44 tells from design, 33 from the operator and 26 from ops. The operator took 115 tells, many of them relays between partitions. Each would be an ask, and so a wake, under on demand.

## Is on demand cheaper? A model

A fresh crew session's first call carries 65 to 71 thousand tokens before it has read anything: 64.7k for agentplot-reviewer's fresh start at 03:01Z, and 70.8k for this research place. A turn then reads the brief, what `crew role start` printed and the records it acts on.

For each run:

- **What a run pays once:** writing its starting context, about 70k × $8 per million ≈ $0.56 with a 1-hour cache, or $0.35 with a 5-minute one. It pays less where the role's previous run left the same prefix in the cache, which it can, since a role's run is always the same place.
- **What a run saves on each call:** the difference between the standing context and the run's context, at the cache-read rate. For the planner, a run averaging 120k against the standing 229k saves about $0.022 a call.
- **So a run needs roughly 16 to 25 calls to pay back its start,** plus the calls it spends finding its bearings (reading the brief, the asks, the records), which a standing agent mostly doesn't make.

The planner made 1,120 calls on about 350 wakes, about 3 calls a wake. If a run absorbs four wakes on average (about 90 runs, about 13 calls each), on demand comes out about even with standing. If bursts are rarely coalesced, it costs more. If runs are fewer and longer, it costs less. For ops, whose standing context is already small (144k), on demand saves little per call, but ops is woken less often. The reviewer already starts fresh for each batch.

The number that decides this is how many wakes one run absorbs, and that depends on how bursty each role's events are. The design below measures it with one role before moving the next. Tokens alone are not a reason to make the move.

## What each role gains and loses

| Role | Woken by | Talks with the user | Gains on demand | Loses on demand |
|---|---|---|---|---|
| **Reviewer** | a batch | almost never | Already runs fresh for each batch and is absent on two partitions. Clean: one batch, one run. | Nothing it uses. |
| **Ops** | landings, a red main, deploy cards, tells | rarely (14 in 30 h) | Every event it handles is already a record (a landing's outcome, sluice's words, a card). | Seconds to act on a deploy approved from the phone; ops acts once the run starts. |
| **Operator** | tells and relays between partitions; the user | often (37) | As the stream's door (Flume 0039), a stall reaches it with no pane needed. | It is the user's one door. A question typed to it today is answered at once; on demand it opens a run first. A relay between partitions takes two runs in series, the operator's and then the recipient's, unless a send names its role directly (record 0047 move 6 folds the relay into `crew send`). |
| **Planner** | tells (172), cards (41), the user (~130) | the most | The heaviest context (median 271k) starts fresh, and plan state lives in the plan, not a summary. | The conversation, which the user has with it all day. Sequences told by other roles ("step two's order", "step 2a is done") are carried in its context, not in records. Asks that come while the user talks with it wait for its next run. |
| **Design** | tells (87), cards (30), captures, the user | long talks | The largest context (median 317k), compacted five times in 30 h. | Long talks. Under `turn.md` as written, an open turn takes nothing new, so during a two-hour design talk every capture, tell and card for design waits until the talk ends. |

Two of these losses come from the turn rule rather than from on demand as such. A run that took the user's `open` lasts the conversation (`role-runs`, "A turn the user opened lasts their conversation"). What comes in during it "is not this turn's and waits for the next" (`turn.md`). And one run of a role is live at a time. So a long talk holds the role for its length. Flume already delivers ends as notices into a live run's pane, but crew's asks don't reach a live run.

## Shapes to choose between

Each shape is a way the main level could run. None is chosen here.

**A. Every role on demand, as accepted (record 0047 move 6).** Each event is an ask or an end; a run takes everything pending, acts and ends. The user opens a role to talk. This is the simplest end state, with nothing of crew's standing, but it carries the latency and the talk-holds-the-role cost above.

**B. Event roles on demand, conversational roles standing.** The reviewer and ops run on demand; the operator, the planner and design stand as today. Standing roles keep presence where the user talks, and Flume's standing-agent entry already supports both kinds side by side (record 0039 amendment). This leaves the standing machinery in crew for good (`crew main up`, restarts when due, revive), against record 0047's direction, and the two conversational roles stay the most expensive per call.

**C. On demand, with a run that stays while there is work or talk.** A role's run starts on an ask, as in A. While it is live, new asks and ends for the role are delivered into it, as Flume already delivers ends, rather than waiting for the next run. It ends once it has been idle for a bound with nothing pending, or when the user says they're done. This gives presence while the user is around or the role is busy, and nothing standing when quiet. Under bursts it is cheaper than A, since one run absorbs more wakes. It needs crew's asks to reach a live run: `crew tell` and crew's notices would find the run by its address, as the spec's "A tell finds a standing agent of the role first" already does for a standing agent. A run's idle bound is a stage's lifetime, which makes it Flume's to hold (`roles.5`), not crew's.

**D. Standing, but started fresh at quiet points.** Keep standing agents, and restart them without their conversation once idle with a context past a bound. This saves context without changing how roles are reached. It is crew machinery that record 0047 has leaving, and it keeps every role in a pane.

## The drive's model: sessions a control plane asks for

The user's Boom Drive context pack of 2026-11-04 is kept whole in agentplot/strategy, `explorations/2026-11-04-boomdrive-context-pack/` (on the branch `design/boomdrive-context-pack` at 9cfe134). agentplot-design weighed it item by item against the accepted records in agentplot/blueprints `design/research/2026-11-08-the-boomdrive-context-pack.md`. Where the two differ, the records win, since the pack predates them. The parts that bear on the main level, as that weighing leaves them:

- **A thin runner and a control plane, not one integrator.** The pack had `boomdrive` as "the one integrator": `init`, `up` (run the adapters, watch the intake, have Flume dispatch), a terminal rail in `status`, and `login` to the cloud. That is superseded in part. The runner decides nothing a control plane or Flume decides (boomdrive `core.1`, record 0002). It keeps clones and views, takes leased work and launches it into Flume, and its commands are `status`, `check`, `drain`, `resume`, `upgrade` and setup (boomdrive record 0011). Planning, the rail and approvals are the control plane's: crew on a host (crew record 0052), and the hosted control plane in boomdrive-cloud. Whether a single-player control plane ships inside `boomdrive` rather than as crew is open, the second milestone's question.
- **A drive** is a body of work of one account: its repositories, one Flume stream and one branch of the account's crew state (boomdrive record 0028). crew's "partition" becomes "drive" (crew record 0054). A partition's main level is a drive's main level.
- **The loop.** Signals, then gaps, then a plan, then approval on the rail, then Flume's places and sluice's landings. This agrees with what crew runs today.
- **Planning is a recipe Flume runs** (Decided in the pack). That is the direction of crew's roles running as Flume kinds (crew record 0057). The pack's own question, whether the recipe belongs to Flume, a repository of its own or `boomdrive`, is this talk's (*Where the recipes live*, below).

So the runner as built already has the drive's shape. Its rule `core.1`: "it starts work only as a `flume launch` or a tool command the control plane asked for". A control plane offers each piece of work under a lease (record 0002), and crew is that control plane until a drive's own replaces it (`roles.9`).

| | Decides when | Runs it | What the session is |
|---|---|---|---|
| **Today** | each standing agent, on what reaches its pane | herdr, under crew | a role that stands all day |
| **The drive's model** | the control plane: crew now, the hosted control plane or a single-player one later | the runner asks Flume, as for any leased work; Flume runs the session | a session launched for a purpose (the gaps to plan, a card answered, a landing that failed) that takes what else is pending, acts and ends |

Each role becomes a session of the drive:

- **The planner** becomes the planning recipe: a session launched when signals, gaps or asks gather, producing proposals for the rail. Deciding when to launch it is the control plane's, which is what crew's "a role is wanted while anything is pending" already decides.
- **Design** becomes a session that writes records and rules, and claims once Boom holds them, from what it read or what the user talked through with it.
- **Ops** shrinks to what is left between sluice, Timber and the rail. Landings are approved on the rail and submitted through Flume's base place (crew record 0056); deploys are Timber's; a red main is Flume's fix kind on main (record 0047 move 5). What remains is a session launched on a landing that failed or a deploy waiting for a step.
- **The reviewer** is a session launched for each batch.
- **The operator.** Outside signals land in the intake, the door that stalls reach is Flume's answerer (record 0039), and a message between drives is a record that launches its reader (record 0047 move 6). What is left is a session the user opens to ask where things stand.

Three consequences for the design:

1. **The control plane decides when, and the runner is the one bridge.** A role has to be woken the same way when the control plane is hosted, and a hosted control plane reaches a host only through the runner's outgoing connection (boomdrive `core.3`). So a crew command running `flume wake` on the host itself would be local-only, a path the hosted control plane can't take.
2. **"Cut away from crew" moves the recipes and their prompts out of crew.** crew's plugin carries the five kinds and their briefs today. In the drive's model they are recipes. crew keeps what a control plane keeps: the plan, the asks (what is wanted and why) and the cards (`roles.9`, `roles.5`).
3. **Flume's own wake is a second "when".** Flume wakes a role on an end pending for its address, inside a settle, without the control plane asking (record 0039; `guides/roles-and-wake.md`). That is quick for a place's question, but it decides "when" outside the control plane. Whether both stand is a question for the user, since it reconciles their ruling in Flume record 0039 with their words of 2026-11-08.

### Where the recipes live

agentplot-design's weighing puts the pack's question with this talk: is the planning recipe Flume's, a repository of its own, or `boomdrive`'s? The same question covers the other four roles' recipes. Weighed against the records:

| Home | What the records say |
|---|---|
| **Flume** | Ruled out by Flume's non-goals: "Deciding what to launch, what matters most or what comes next, or planning across places … A team's bolts, its approvals, its review batches … are crew's" (Flume statement, section 8). Flume's own `plan@1` is a plan stage for one change, not a drive's planning. |
| **`boomdrive`, the runner** | Ruled out while the runner stays thin: it "decides nothing the control plane or flume decides" (`core.1`), and a planning recipe decides what to propose. It would be at home there only if a single-player control plane ships inside `boomdrive`, the open second-milestone question, and then it belongs to that control plane, not to the runner. |
| **The control plane, crew** | Where it is today: crew's kinds folder, which crew declares as a Flume source (record 0057). It works for one control plane. A hosted control plane would need its own copy, and keeping it here is what "cut away from crew" is against. |
| **A package of its own** | A Flume kinds package (weir's kinds form) that any control plane declares as its source and the host locks. Its prompts reach the control plane only through a command-line contract both control planes keep: read the plan and what is pending, propose, raise a card, end the turn. That is one recipe for crew, the hosted control plane and a single-player one, and it matches the pack's "the planning recipe is open source" with cloud planning "delegated through the runner". |

The records point to a package of its own, with the contract as its one coupling. crew could carry the package in its kinds folder until a second control plane exists, so long as the recipe speaks only that contract. The contract is crew's command line as the briefs use it today (`crew role start`, `crew role end`, `crew plan propose`, `crew record`, `crew role land`), so naming it is mostly writing down what is there. This is a recommendation for the record, not a decision.

## A design for the move

The order of roles is the user's (Flume record 0039, 2026-11-05: "That order; planner and design agent wait for an effort setting"): the operator, ops, the reviewer, then the planner and design, the last two once Flume gives an agent's effort, which 0.17.0 does. Each step changes only that role's setting: the teams file's `flume` for it, and under (b) its entry in crew's roles file. Nothing of the host's changes (record 0039 decision 13). Before the first role moves, Step 0 has to hold.

### Step 0: before any role moves

1. **One launcher, with the control plane deciding when.** Settle the two designs above into one. crew, as the control plane, decides that a role is wanted, from its asks and the places waiting on the role. The runner turns that into Flume work, as it turns every other piece of work the control plane offers, and Flume runs the session. Within the runner's `core.1` the runner can act in one of two ways, and either is one design with one owner:
   - **(a) A launch, as built.** The runner launches the role's kind with `flume launch`, and declares the run done at its report (`flywheel-crew/src/roles.rs`). The control plane holds "one run at a time". Flume's own wake for the address stays off, so a role's entry in crew's roles file keeps no `kind` and Flume never launches it.
   - **(b) A wake, as the user ruled in Flume record 0039.** The runner carries `flume wake <address>` as a command the control plane asked for, as it carries `sluice branch create`. Flume launches the run from crew's roles-file entry (`kind = "crew/crew-<role>"`, with its repository, name, intent, and agents' model and effort) and ends it at its delivery. Flume holds "one run at a time", and also wakes the role itself on an end pending for its address (the second "when" above). crew's kinds go into the kinds folder as a package the host locks.

   Under either, `crew role start` collects crew's asks and `flume inbox`, and the facts of a run live in one place, `roles.rec` for (a) or `roles.toml` for (b), not both. This is a crew change, a boomdrive change and a record. The family rule asks for one design with one owner, said in the design.

   *Check:* in crew's contract and end-to-end tiers, the runner's tests and Flume's walkthroughs, an ask on a scratch stream's role leads to exactly one run of `crew-<role>`, whichever of the two the record chooses. `crew role start` takes an ask and a Flume end together, `crew role end` delivers, and the run is declared done and tidied. A second ask during the run makes no second run.
2. **How soon a session starts.** The runner sees an ask at its next pass; by default it polls every 60 s and fetches every 120 s (boomdrive `crates/flywheel/src/config.rs`). That interval is the floor on how fast a role answers a tell or a card, locally and with the cloud alike. A shorter interval on the main level's host, or a nudge to the runner when crew writes an ask, would lower it without leaving the runner's path. Under (b), a place's question also wakes the role at once, through Flume's own wake.
3. **The host keeps watch.** Flume record 0051: until a caller runs `flume settle --every`, an end pending for a role with no run is seen only at the next `flume` command anyone runs. *Check:* `flume status` on deneb shows a watch kept, with its bound and last settle.
4. **Effort for each role.** A run's entry gives the role definition's model and effort: design and planner xhigh, ops and reviewer high, operator medium (`plugin/roles/*.md`). *Check:* crew's logic tier pins each entry's `agents`.
5. **Latency, measured.** On deneb, time three paths with a scratch stream's role: a tell, a card answered on the phone (Pending You's notice, the follower, an ask, a wake) and a place's end, each from the event to the run's first act. Today's figure for an idle standing agent is a few seconds. The estimate for on demand is one to four minutes: a push, the wake, a place made, Claude started, `crew role start`, and the brief and records read. That estimate is unmeasured, and the measured number is what the user judges.
6. **The baseline kept.** The table above, per role per day, so each step is compared against it.

### Step 1: the operator

What changes: the partition's door becomes a run. Stalls in the stream reach it through Flume's answerer, `crew send` to the partition is an ask of it, and the user talks to it by opening it.

*Check before:*
- Flume wakes the operator for a stall with no run live, as Flume's S94 has it.
- A `crew send` from another partition reaches the role it names in one run, or the relay's two runs are accepted.
- The user's first question to a closed operator is answered within the latency they accept.

*Watch after:* how many runs a day, and how many wakes each absorbs.

### Step 2: ops

What changes: landings, red mains and deploy cards wake it.

*Check before:*
- A landing's outcome reaches ops's next run as an ask (built: `role-runs`, "Main-level ops's landing from a run does not wait").
- A deploy card approved on the phone reaches a run.
- `crew bolt submit` from a run returns without waiting.

### Step 3: the reviewer

What changes: `crew review` writes a batch ask, and the run writes the summary and runs `crew review delivered` (built).

*Check before:* one batch, one run, and the planner asked once delivered.

### Step 4: the planner

What changes: the role the user talks with most, and the one most told by other roles.

*Check before:*
- The shape for talking with it is settled (A or C above).
- What it carries between turns lives in records. A sequence another role tells it, and the order of the next landings, is in the plan or a record, not only in a tell's words.
- An ask that comes while the user talks with it is handled as that shape says.

### Step 5: design

What changes: long talks and captures.

*Check before:* the same as the planner, and a day of captures coalesced into a few runs.

### After the five

The standing path leaves crew in a landing of its own: `crew main up`'s standing roles, restarts when due, revive and the standing entries (record 0047, `roles.8` on main). The roles file then holds only runs' entries and the answerers.

Then the recipes leave crew. The five kinds and the briefs that are their prompts become a package of their own, as *Where the recipes live* recommends, speaking to the control plane only through its command-line contract. crew keeps the plan, the asks and the cards, as a control plane does, until a drive's own control plane replaces it (`roles.9`).

## Questions for the user

1. **How long may a role take to answer?** The estimate is one to four minutes from a tell or a card's answer to the role acting, against seconds today. Is that acceptable for every role, or only for some (ops and the reviewer, say), with the roles you talk to answering at once?
2. **How should the roles you talk to behave?** For the operator, the planner and design, which shape: A (on demand, opened to talk, holding the role while you talk), B (standing), C (on demand, with a run that stays while there is work or talk and takes new asks into it), or D (standing, started fresh at quiet points)?
3. **Is cost part of the reason for the move?** The measurement says on demand is roughly even with standing for the busy roles, so if cost matters, one role's day measured on demand settles it before the rest move.
4. **Who decides when a session runs?** Either the control plane alone (crew now, the cloud later), with the runner launching (a) or waking (b) on its word, or Flume as well, waking a role on its own whenever a place's question waits for it (b). The second is quicker for a question but decides "when" outside the control plane.

## To carry to agentplot-design

- The user's words of 2026-11-08, given to this talk: "You need to start to cut away from crew even more so that planning sessions and those sorts of things run through Flume, similar to how they would with the real control plane." They bear on records 0047 (move 6), 0049 and 0057, on Flume record 0039, and on where the recipes live.
- This talk's recommendation for where the recipes live, the pack's question agentplot-design gave it: a package of their own, with a command-line contract to the control plane as their one coupling.
- What the user settles on the questions above.

## Sources

- crew records 0047 (moves 5 and 6), 0049 (parts 1 to 4) and 0057 (decisions 1 to 6).
- crew's `role-runs` spec, and the archived change `2026-10-31-roles-run-as-flume-kinds`: its design's Decisions 1, 6, 7 and 13, *Risks* and *Open Questions*.
- crew's `plugin/flume/kinds.toml`, `plugin/flume/turn.md`, `plugin/roles/*.md` (models and effort), `plugin/lib/runner.py` (`role_run`, `role_launch`) and `plugin/bin/crew`'s usage.
- Rules `roles.5`, `roles.6`, `roles.7`, `state.4` and `teams.25`.
- agentplot/flume at 4b2f3eca: records 0039 (and its amendment of 2026-11-06), 0044, 0051 and 0058, `site/src/content/docs/guides/roles-and-wake.md`, `flume wake --help` and `flume inbox --help`.
- agentplot/boomdrive at 3f428cf: `crates/flywheel-crew/src/roles.rs`, `crates/flywheel/src/config.rs`, `docs/architecture/core.md` (`core.1`, `core.2`, `core.3`, `core.9`) and record 0002.
- The user's Boom Drive context pack of 2026-11-04, in agentplot/strategy at `explorations/2026-11-04-boomdrive-context-pack/` (branch `design/boomdrive-context-pack`, 9cfe134): its README and files 01, 02, 03 and 06.
- agentplot-design's weighing of the pack, agentplot/blueprints `design/research/2026-11-08-the-boomdrive-context-pack.md`, and the Flume statement's non-goals (`design/flume/requirements.md`, section 8), both on blueprints main.
- agentplot/boomdrive records 0011 (the runner's commands) and 0028 (account and drive).
- deneb on 2026-11-07: `~/.config/crew/teams.json`, `~/.config/flume/config.toml`, `~/.config/flume/sources/crew.toml`, `~/.local/state/crew/flume/roles.toml`, `~/.local/share/flume/kinds/crew`, `flume status`, `herdr agent list`, `ps`.
- Transcripts of agentplot-design, agentplot-planner, agentplot-ops, agentplot-operator and agentplot-reviewer (sessions cef0cac9, fae160b6, 8e6907a3, 055802a2 and db3171be), and of afterthought's and madswan's roles in `~/.claude-sub-amadden/projects/-Users-chuck-Code-github-afterthought-blueprints-main/`, read by a script in the session's scratchpad.
- Opus 5.5's rates: the claude-api skill bundled with Claude Code 2.1.319, its model table and `shared/prompt-caching.md`.
