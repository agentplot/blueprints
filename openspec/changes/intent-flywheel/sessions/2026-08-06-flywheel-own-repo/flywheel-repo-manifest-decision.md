# Decision: the machinery travels, the record and the book stay

## Decision
The split follows one test: is this the tool's, or is it Willdan's?
Anything that travels to `agentplot/flywheel` stops being Willdan-owned, so
the tool takes only what it is made of. **Travelling:** the two skills, the
four agent profiles, the two OpenSpec schemas, and the
`add-flywheel-loops` change that built them. **Staying in blueprints:**
this intent change and its whole record, the two end-to-end scripts, the
two Willdan-flavoured sample changes, `books/aidlc-design` entire, the
`books/CLAUDE.md` and root `CLAUDE.md` conventions, and the generic opsx
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
| `.claude/skills/flywheel-inception/` (139L) | `skills/inception/` | It is the plugin. |
| `.claude/skills/flywheel-construction/` (110L) | `skills/construction/` | Same. |
| `.claude/agents/flywheel-*.md` (4 files, 97L) | `agents/` | "A marketplace plugin ships the skills and the profiles together, since a skill without its profile leaves the role unassigned" — `decisions/agent-profiles.md`. |
| `openspec/schemas/flywheel-intent/` (251L) | `schemas/flywheel-intent/` | Published as a user schema; see below. |
| `openspec/schemas/flywheel-bolt/` (135L) | `schemas/flywheel-bolt/` | Same. |
| `openspec/changes/add-flywheel-loops/` | the new repo's changes tree | Operator's annotation. It is the change that *built* the machinery, and it still owns remaining implementation and verification tasks (named Out of scope in `intent.md`); that unfinished work belongs with the code it built. |

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
- One flag raised and not resolved: the machinery was authored inside a
  Willdan client repo and is moving to a different org. Worth an explicit
  confirmation that this is the operator's to move, recorded once, cheaply,
  now.
