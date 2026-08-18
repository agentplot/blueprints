# Decision: the machinery travels, the record and the book stay

## Decision
The split follows one test: is this the tool's, or is it Willdan's?
Anything that travels to `agentplot/flywheel` stops being Willdan-owned, so
the tool takes only what it is made of. **Travelling:** the loop skills,
the agent profiles, every flywheel schema, the `add-flywheel-loops` change
that built them, the context map application, and the book skills.
**Staying in blueprints:** this intent change and its whole record, the two
end-to-end scripts, the two Willdan-flavoured sample changes,
`books/aidlc-design` entire, the `books/CLAUDE.md` and root `CLAUDE.md`
conventions, the map data under `context-map/maps/`, and the generic opsx
commands, `openspec-*` skills, and hooks. The design book stays whole and
unsplit: blueprints describes the method Willdan practices, and the flywheel
repo carries its own docs written fresh rather than chapters emigrated from
a client repo.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/conducting.md` (to be rewritten)
- Produced by: `sessions/2026-08-06-flywheel-own-repo/own-repo.html` — the
  operator selected "machinery travels; record and book stay" and annotated
  two rows against the session's recommendation, both of which stand as his
  word: the sample changes **stay**, and `add-flywheel-loops` **moves**.
- The repo shape came from
  `sessions/2026-08-06-flywheel-own-repo/research-standalone-plugin-repo.md`,
  which settled that a standalone repo can be its own marketplace, so this
  decision is purely which files travel, not how they are packaged.

## The manifest

Travelling to `agentplot/flywheel`:

| From | To | Why |
|---|---|---|
| `.claude/skills/flywheel-*/` — **fifteen skills** as of the loop layer (re-measured 2026-08-10): the two loop skills and the thirteen session types | `skills/<name>/` | They are the plugin. The session-type skills pass the same test. |
| every skill's `evals/` | with its skill | `claude plugin eval` runs them, so they are the repo's test suite the day it lands. Leaving them behind ships the machinery untested. |
| `.claude/skills/_reference/herdr.md` — the one shared copy | `skills/_reference/` | It is how a conductor drives herdr; nothing in it is Willdan's. |
| `.claude/agents/flywheel-*.md` and `.claude/agents/user-*.md` — **nine profiles** as of the loop layer: dispatch, two conductors, three session hosts, three personas | `agents/` | "A marketplace plugin ships the skills and the profiles together, since a skill without its profile leaves the role unassigned" — `decisions/agent-profiles.md`. |
| `openspec/schemas/flywheel-intent/` | `schemas/flywheel-intent/` | Published as a user schema; see below. |
| `openspec/schemas/bolt-{default,quick,deep}/` | `schemas/` | Same (→ `decisions/the-bolt-schema-family.md`). `flywheel-bolt` stays: pre-family, carrying its live blueprints bolts until they archive, then it retires rather than travels. |
| `fleet/flywheel` — the fleet command | `bin/flywheel`, with a `fleet` skill wrapping it and a template manifest | `decisions/fleet-per-org.md`: the command and skill are the plugin's; each org folder keeps its own untracked `fleet.yaml` instance. |
| `openspec/specs/` — the eight capabilities `add-flywheel-loops` deployed | the new repo's spec tree | The operator, 2026-08-10 (→ `questions/deployed-specs-travel.md`): the change and its specs are one subject and move as one. |
| `openspec/changes/add-flywheel-loops/` | the new repo's changes tree | Operator's annotation. It is the change that *built* the machinery, and it still owns remaining implementation and verification tasks (named Out of scope in `intent.md`); that unfinished work belongs with the code it built. |
| `context-map/` — the application | the new repo | Operator's word, 2026-08-07. The map viewer, its schema, and `map-check` are a tool anyone designing a system can use; nothing in them is Willdan's. **The map data does not travel** — the maps describe Willdan systems and stay. There are **three** of them, `current`, `target` and `configurations`, and the third has its own validation arm and its own viewer tab. The tool therefore has to accept a map from outside itself, by CLI or piped JSON, which is the shape that makes it distributable rather than a fixture. Generalizing is not a lift-and-shift: `context-map/schema.json` carries Willdan's own data — `tier` is an enum of Willdan tiers, `$id` names the blueprints host, `^books/` is baked into three patterns, and a description cites a Geo IQ chapter. Moving it unchanged would not satisfy "the data stays". |
| the book skills | the new repo | Operator's word, 2026-08-07. The flywheel writes books, so it has to carry enough about what a book is and how a writeback works to do that in a repo that has never seen `books/CLAUDE.md`. Source material is the `willdan-marketplace` design-book skills, `design-inception` chief among them. |

Staying in blueprints:

| Piece | Why |
|---|---|
| `openspec/changes/flywheel/` — this intent, its decisions, its sessions | One intent = one change on blueprints main is the loop's own rule; the change that establishes it does not break it. Blueprints stays the coordination substrate. |
| `openspec/changes/rocs-record-split/`, `openspec/changes/bolt-rocs-records/` | Operator's annotation, against the session's recommendation that they travel as fixtures. They carry Willdan domain content — ROCS is a Willdan system — and cross-org, Willdan samples do not emigrate. The flywheel repo writes neutral fixtures of its own. |
| Both end-to-end scripts under `sessions/` | "A closed session directory is never rewritten, because it is the trail" — `decisions/session-directories.md`. They are also written against Willdan repos and the Willdan context map. |
| `books/aidlc-design/` (23 chapters, 4342L) | The flywheel is one mechanism inside a method book that also covers phases, foundations, system design, agent workspaces, the worktrunk substrate, session management, commissioning, contracts, and verifications. Roughly four of twenty-three chapters are loop chapters. Moving the book would emigrate nineteen unrelated chapters and bill the new repo for the whole books toolchain. |
| `books/CLAUDE.md`, root `CLAUDE.md` | Blueprints' own authoring conventions. |
| `.claude/commands/opsx/*`, the ten `openspec-*` skills, the three hooks | Generic OpenSpec and books tooling with zero flywheel references. Not flywheel's to take. |

## Consequences
- **The skills restructure, they do not merely rename.** A plugin skill
  invokes as `/<plugin>:<skill>`, so the `flywheel-` prefix is supplied by
  the plugin name and is dropped from both the skill names and their
  directory names: `flywheel-inception` becomes `flywheel:inception`, living
  at `skills/inception/`. Every place that names a skill changes shape.
- **The agent profiles keep their `flywheel-` prefix**, and this asymmetry
  is deliberate. Verified in this session: `claude --agent` resolves a
  plugin agent by its **bare** name as well as its namespaced one —
  `--agent agent-creator` reaches `plugin-dev:agent-creator`. Because the
  bare name is the addressable one, it has to stay globally unique, so
  `flywheel-intent-conductor` keeps its prefix where `inception` sheds one.
  The consequence worth having: **no `herdr agent start … --agent …` line
  anywhere changes** — not in either end-to-end script, not in the skills,
  not in `conduct`.
- **The schemas travel and distribution improves.** `openspec schema which
  --all` reports three sources — `project`, `user`
  (`~/.local/share/openspec/schemas/`), and `package` — and the resolution
  record carries a `shadows` field, so a project copy shadows a user copy.
  Blueprints installs both schemas as user schemas and keeps resolving them
  by name; the in-place edit loop stays available whenever a working copy is
  wanted. `openspec store` exists for registering standalone OpenSpec repos
  machine-wide if a stronger binding is ever needed.
- Appended Handoff task: publish both schemas as user schemas, with a naming
  convention decided at that point — the one user schema already installed
  on this machine uses reverse-DNS and a version
  (`dev.codecorral.intent@2026-03-11.0`), which is the convention to follow
  or consciously depart from.
- The three book Writeback tasks are untouched and proceed independently of
  the split, which is most of the reason the book stays.
- New question, not worked here: `add-flywheel-loops` moving means the new
  repo starts with an OpenSpec changes tree and inherits that change's open
  implementation and verification tasks. Who owns draining them, and under
  which schema they run once they are no longer on blueprints main, is a
  question for the split bolt.
- **And the specs that change deployed go with it, or it does not go.**
  `openspec/specs/` holds eight capabilities `add-flywheel-loops` wrote.
  Moving a change away from the capabilities it deployed leaves both halves
  wrong — the change's deltas cite capabilities its new repo does not hold,
  and blueprints keeps eight capabilities describing machinery it no longer
  has. Either both travel, or the change archives in place and the new repo
  starts clean. Tasked, because the unfinished work and the deployed specs
  are one subject.
- **A decision record's paths are not rewritten by the move.** A record
  describes the state at the moment it was decided, so
  `decisions/agent-profiles.md` naming `.claude/agents/` stays correct
  after the profiles move. Re-pointing it would make the record assert
  something false about its own moment and make the decision sequence
  unreadable as a sequence. The re-edit query excludes `decisions/`,
  `sessions/`, and `changes/archive/` — written into the query, not left to
  the agent running it.
- The inventory in this record was taken on 2026-08-06 from the design
  session and re-measured on 2026-08-07 from the tree; the line counts it
  first carried were off by roughly three times, which is
  `decisions/split-after-the-runs.md`'s own rule coming true against its
  sibling inside a day. Counts here are provisional and re-measured at
  split time; the membership is the decided part.
- One flag raised and not resolved: the machinery was authored inside a
  Willdan client repo and is moving to a different org. Worth an explicit
  confirmation that this is the operator's to move, recorded once, cheaply,
  now.
