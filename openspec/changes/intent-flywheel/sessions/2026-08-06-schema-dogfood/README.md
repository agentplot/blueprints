# Session: schema-dogfood

## Charge
- Change: flywheel
- Directory: sessions/2026-08-06-schema-dogfood/
- Tasks: research: do the schema instructions alone produce correct
  artifacts — author this intent from `openspec instructions <artifact>
  --change flywheel` with no flywheel skill loaded, and tighten what reads
  wrong. (`add-flywheel-loops` task 1.5.)

## Produced
- No separate report file — the artifacts the session wrote *are* the
  finding: this change's `intent.md`, `decisions/`, `tasks.md`, and this
  directory. This README is the session's row in `design.md`.

## Delivered
- The instructions carry: Destination / Map / Scope / Fog came out right
  from the intent instruction alone, the typed task sections from the tasks
  instruction, and the decision record shape from the decisions instruction.
  The Map section needed a judgment the instruction does not cover — an
  intent that moves no map nodes — and the sample intents' own answer
  (name the governing artifacts instead) was what made it obvious.
- One real gap: `sessions/<date>-<slug>/` was named in the intent
  instruction and in the actor model but was not a declared artifact, so
  nothing stated who names a session directory, what happens when two
  collide, or how a report gets promoted out of one → closed as
  `decisions/session-directories.md`, and the schema now declares it.
- One defect fixed on the way: `openspec/config.yaml`'s tasks rule was an
  unquoted YAML scalar containing `intent: ` and `bolt: `, so it parsed as
  a mapping and the CLI silently dropped it from every artifact's
  instructions.
- A plannotator round on the intent found two artifact instructions vague,
  and closing that out settled the shape of design output → closed as
  `decisions/design-catalog.md`: `design.md` is the catalog, files are
  stored once, every report belongs to a session. `decisions` now also says
  a decision closes on the operator's word wherever it is given — this
  review round being the example — not only inside a session or behind a
  prototype.
- The two channel questions in the intent's Fog were narrower than the
  design behind them, and broadened: which human-in-the-loop channel applies
  when, and where plannotator and lavish are launched from.
