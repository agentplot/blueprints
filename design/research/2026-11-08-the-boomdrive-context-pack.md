# The Boomdrive context pack of 2026-11-04, weighed against the records

The user's chat with Claude of 2026-11-04 about how to think of Boomdrive,
brought into the design on 2026-11-08. The pack is kept whole in the private
agentplot/strategy, `explorations/2026-11-04-boomdrive-context-pack/`, because
parts of it are commercial. This page carries its design substance only, item
by item, each with the mark the pack gave it (Decided, Leaning, Open) and where
the records accepted since stand. Where they differ, the records win: the pack
predates them. Nothing here is a decision. A choice it raises goes to its
record or its research talk.

## Words

- **The pack:** Boom Drive is the family; `boomdrive` is the runner's command
  line; a *drive* is one unit of planning and coordination, usually across
  several repositories, formerly a "flywheel" (Decided).
- **The records:** agentplot/boomdrive record 0028 (accepted 2026-11-07) agrees
  on *drive*, a body of work with its repositories, one Flume stream and one
  branch of its account's crew state, and adds *account*, one enrollment of a
  runner with a control plane, which the pack lacks. crew's "partition" becomes
  "drive" (agentplot/crew record 0054). The rail and the board are crew's two
  surfaces, as the pack has them.

## The tools and the runner

- **Sharp tools, plain command lines, JSON output, agents as the first users**
  (pack, principle): agrees with `design/principles.md` 4.
- **Weir is "the shared library"** (pack): weir's statement has it fix the
  forms the tools meet in, with crates that implement them, the kinds crate
  and now the delivery form (agentplot/weir record 0006, accepted 2026-11-08).
- **`boomdrive` is the one integrator** (pack, Decided): `init` makes a drive,
  `up` runs the adapters, watches the intake and has Flume dispatch, `status`
  is a terminal rail, `login` attaches the drive to the hosted control plane.
  **Superseded in part.** The runner decides nothing a control plane or Flume
  decides (agentplot/boomdrive `core.1`, record 0002): it keeps clones and
  views, takes leased work and launches it into Flume, and its commands are
  `status`, `check`, `drain`, `resume`, `upgrade` and setup (record 0011).
  Planning, the rail and approvals are the control plane's: crew on a host
  (agentplot/crew record 0052), the hosted control plane in boomdrive-cloud.
  Whether a single-player control plane ships inside `boomdrive` rather than
  as crew is open. It is the second milestone's question, below.
- **No `boomdrive drive …` stutter; top-level verbs with `--drive`** (pack):
  no record yet; it binds whoever adds drive verbs to the command line.

## The loop and planning

- **Signals, then gaps, then a plan, then approval, then dispatch, then claims,
  merge and release** (pack): agrees with the loop crew runs today: signals
  curated, units queued, the planner's proposals approved on the rail, Flume's
  places, sluice's landings.
- **Boom finds gaps deterministically, `boom gaps`, into the intake** (Leaning):
  Boom's own design, its card open with the user; the research talk
  `how-boom-fits-flume-and-boomdrive` holds it.
- **Planning is a recipe Flume runs** (Decided in the pack): the direction of
  crew's roles running as Flume kinds (agentplot/crew record 0057). The pack's
  own open question, whether the recipe is Flume's, a repository of its own or
  `boomdrive`'s, stands. The research talk `should-the-main-level-run-on-demand`
  holds it.

## Boom and the drive

- **Boom stays a claims engine, never the coordinator; one Boom store per
  drive, recfiles in git** (Decided): no record contradicts it; Boom's design
  card and the talk above take it. A drive's Boom store would stand beside its
  branch of crew state (record 0028).
- **Where a drive's Boom store is hosted** (Leaning): the hosted control
  plane's choice, open.
- **A vector index in `boom mcp`** (Leaning, defer): no record; deferred.
- **Drives upstream and downstream: intents flow down as signals, progress
  flows back up; a strategy drive's context map translates** (pack): new
  territory. crew's intents live inside one drive, and no record links drives.
- **Peer drives subscribing to each other's claims** (Open, "not yet
  convinced"): new territory.

## Plugins, sites and the record of a release

- **Each tool ships its own Claude Code and herdr plugin** (Leaning): as sluice
  and Flume do today.
- **Each tool's docs are a Starlight site in its own repository; one shared
  theme** (Decided): agrees with sluice's, Flume's, timber's and Boom's `site/`,
  the shared site theme, and Boomdrive's site moving into its repository
  (agentplot/boomdrive record 0025).
- **A tool manifest, typed, generating the switcher, the ecosystem map and
  per-tool diagrams, and `llms.txt` from every site** (pack): new territory,
  the site theme's to own.
- **A chain of signed steps from a release back to the signal behind it**
  (pack): sluice already signs its runs as in-toto's catalogue gives them
  (agentplot/sluice `core.40`), and timber's statement carries claims; no record
  ties the steps to each other by hash yet. New territory.

## Open questions the pack lists, and where each goes

| Question | Where |
|---|---|
| Where a local web view stops, and what it shows first | its research talk, from 2026-11-08 |
| Whether the planning recipe is Flume's, its own, or `boomdrive`'s | `should-the-main-level-run-on-demand` |
| `boom gaps`' output and its signal's form | Boom's design |
| Hosting a drive's Boom store | the hosted control plane |
| Drives linked upstream, downstream or as peers | new territory, no talk yet |
| The release chain's shared form and each tool's step | timber and weir, no talk yet |
| The tool manifest's form and how sites read it | the site theme |
