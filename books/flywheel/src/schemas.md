# Schemas

An OpenSpec workflow schema is the contract between a change and the
loop that works it. Five schemas exist: `flywheel-intent` binds a
change to the [design loop](design-loop.md); the four `bolt-*` members
bind one to the [construction loop](construction-loop.md), and the
member picked at creation is the bolt type.

## Binding

A change declares its schema in its own directory:

```yaml
# openspec/changes/<slug>/.openspec.yaml
schema: flywheel-intent
```

The project default in `openspec/config.yaml` stays `spec-driven`: a
built repo tracks construction work as ordinary spec-driven changes,
and only the changes the loops own bind a flywheel schema. Resolution
is by name; the installed directory name is the contract.

## flywheel-intent

| Artifact | Generates | Holds |
|---|---|---|
| `intent` | `intent.md` | the charter: destination, map nodes, scope |
| `questions` | `questions/**/*.md` | one record per open question |
| `sessions` | `sessions/**/*` | one directory of deliverables per session |
| `prototypes` | `prototypes/**/*.md` | finding notes from throwaway spikes |

Decision files are session deliverables: a session writes them in the
change directory and synthesizes their content into the design book.
A question's state lives on the tracker item created with its record;
the record holds the prose.

## The bolt schemas and the loop block

Each `bolt-*` member carries two artifact types:

| Artifact | Generates | Holds |
|---|---|---|
| `bolt` | `bolt.md` | the charter: the delivery statement, the unit sequence and price, the merge criteria the landing verifies — born at scaffold from the milestone's description, the planner's summary or the operator's dictated words |
| `unit` | `units/<slug>.md` | one approved unit's document, verbatim — written by the loop at expansion, the moment board approval freezes the card body |

The card body is mutable state on the tracker while unapproved; the
operator's approval freezes it, and expansion copies that frozen text
into the record on the bolt branch. The record mirrors the board
one-to-one: one charter per bolt, one unit file per approved card.
The type lives in the `loop:` block, a named configuration:

| Key | Declares |
|---|---|
| `strategy` | the spec commands run per item: `new+ff`, `ff`, `new+continue` |
| `stages` | the stage set, where it departs from the standard path |
| `hooks` | the review points, named after command boundaries, in run order |
| `extensions` | the sessions attached at those hooks |

| Member | `strategy` | Review stages |
|---|---|---|
| `bolt-default` | `new+ff` | spec, build, verify, review |
| `bolt-quick` | `ff` | spec folded into build; plan mode available |
| `bolt-adversarial` | `new+continue` | adds independent adversarial review before merge |
| `bolt-direct` | `ff` | build and merge only — `stages: [spec, build, merge, land]`; plan mode available |

The repo's merge gate is not a function of the type and runs
unweakened on all four. `openspec` strips unknown top-level keys, so
the `loop:` block is invisible to it: the loop program reads
`schema.yaml` itself, and `openspec schema fork` erases the block from
the copy it writes — a repo customizing a type copies the schema
directory rather than forking it.

## Installation and distribution

The plugin release carries the schemas, one version per machine:
`bin/install-schemas` copies every schema under the plugin's
`schemas/` into `~/.local/share/openspec/schemas/`, where `openspec`
resolves them by name for any repo on that machine. An existing user
copy moves aside as `<name>.replaced`, never destroyed; a repo's own
`openspec/schemas/` copy shadows the user copy when an in-place edit
loop is wanted.

The installer owns the names it wrote and nothing else. An install
prunes its own stale names, so a renamed schema stops resolving under
the old name in the same install that delivers the new one — a
breaking rename ships in one plugin release that does both halves,
and a schema the installer never wrote is never touched.

A schema names its version in calver — `2026.08`, a second cut that
month `2026.08.1` — and a version is immutable: a change ships as the
next calver, never as an edit to a published one. Schemas move
slowly, so versions stay few, every machine can state exactly which
cut it resolves, and the plugin release pins the set it carries.

## Asking the schema

A session never reads a schema by hand. The instruction for any
artifact comes from the CLI, resolved through the change's binding:

```bash
openspec instructions <artifact> --change <slug>
```
