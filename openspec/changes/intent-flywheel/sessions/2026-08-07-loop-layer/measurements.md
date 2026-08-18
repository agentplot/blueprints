# Measurements — what was run, and what came back

Tree: `sess/loop-layer` at the time of the run, worktree
`.bare.sess-loop-layer`. OpenSpec **1.7.0**, resolved from
`/nix/store/i87anfw33x7r4w08b54bj09nqf7wr9kl-openspec-1.7.0`.

Every claim on the page cites one of these. Where a claim is a measurement
rather than a decision, it is the one to distrust and re-run.

## M1 — OpenSpec exposes a dependency query, at artifact granularity only

```
$ openspec status --change flywheel --json
```

Returns `artifacts[]`, each `{id, outputPath, status, requires[]}` and, when
blocked, `missingDeps[]`. Statuses are `done | skipped | ready | blocked`
(`dist/core/change-status-policy.d.ts`). `ready` is computed as *every
dependency completed* — `ArtifactGraph.getNextArtifacts`, `graph.js` — so
`ready` IS the workable-now query the fan-out wants.

The graph comes from `requires:` on each artifact in `schema.yaml`, and from
nowhere else.

## M2 — There is no task-level dependency anywhere in OpenSpec

The zod schema for an artifact (`dist/core/artifact-graph/types.d.ts`) is
exactly `{id, generates, description, template, instruction?, requires[]}`.
`apply` is `{requires[], tracks?, instruction?}`. Nothing else exists.

`tasks.md` is opaque to the CLI apart from a checkbox count:

```
$ openspec list --json
  { "name": "flywheel", "completedTasks": 37, "totalTasks": 67, ... }
```

`apply.tracks: tasks.md` names the file and parses nothing inside it. No
command takes a task, a proposal, or any sub-change item as an argument.

## M3 — "done" is file existence, so the intent graph is already saturated

`detectCompleted` (`dist/core/artifact-graph/state.js`) calls
`artifactOutputExists`. An artifact generating a glob is `done` the moment
one file matches it. Measured on this change:

| artifact | generates | status |
|---|---|---|
| intent | `intent.md` | done |
| decisions | `decisions/**/*.md` | done |
| questions | `questions/**/*.md` | done |
| assertions | `assertions/**/*.md` | done |
| sessions | `sessions/**/*` | done |
| design | `design.md` | done |
| prototypes | `prototypes/**/*.md` | **ready** |
| tasks | `tasks.md` | done |

Seven of eight are `done` and the eighth is `ready`. The graph has nothing
left to say about this intent and will never say anything again. **An
intent conductor cannot drive its loop from the artifact graph** — not
because the query is missing, but because it answers a question about
artifact creation, and the intent's remaining work is 30 unchecked task
lines the graph cannot see.

## M4 — A `workflow:` key in the schema is silently dropped, and validate says ✓

The decisive one. `SchemaYamlSchema` uses zod `$strip`, so unknown keys are
discarded rather than rejected. Probed directly against the parser:

```
$ node -e "import('.../artifact-graph/schema.js').then(m =>
    console.log(JSON.stringify(m.parseSchema(yaml))))"
```

with an artifact carrying `workflow: |` and `session_type: design`. Both
keys are absent from the parse output. Then end to end, through the CLI,
with a scratch project at `/tmp/osx-probe`:

```
$ openspec schema validate probe
Note: Schema commands are experimental and may change.
✓ Schema 'probe' is valid

$ openspec instructions b --change demo --json | keys
['changeName','artifactId','schemaName','changeDir','planningHome',
 'outputPath','resolvedOutputPath','existingOutputPaths','description',
 'instruction','template','dependencies','unlocks','root']
workflow present? False
```

A schema author adding a `workflow:` block gets a green validate and a
no-op. This is worse than an error, and it is the reason the workflow text
has to go into a field that already exists.

## M5 — The four carriers that do survive to an agent

| carrier | scope | reaches the agent as |
|---|---|---|
| `artifact.instruction` | one artifact | `instruction` in `openspec instructions <artifact>` |
| `artifact.template` (file under `schemas/<name>/templates/`) | one artifact | `template` |
| `apply.instruction` | the whole change | `openspec instructions apply --change <id>` |
| `openspec/config.yaml` `context:` | every change, every call | `context` |
| `openspec/config.yaml` `rules: {<artifact-id>: [...]}` | one artifact id, every schema | `rules` |

`generateInstructions` (`dist/core/artifact-graph/instruction-loader.js`)
assembles exactly these.

## M6 — `openspec instructions` requires an artifact argument

```
$ openspec instructions --change flywheel
✖ Error: Missing required argument <artifact>. Valid artifacts:
  intent decisions questions assertions sessions design prototypes tasks
```

There is no whole-change instruction dump except `instructions apply`.

## M7 — `openspec/config.yaml` contradicts the schema it ships beside

`rules.tasks` reads:

> Typed sections are the contract (intent: Design/Writeback/Handoff; bolt:
> Spec/Review/Build/Test/Merge).

`flywheel-intent/schema.yaml`'s `tasks` instruction defines the intent's
sections as **design / planning / research / prototype / writeback /
handoff**, and `tasks.md` on disk uses those six plus `verify`. Both reach
the same agent in the same call — `rules` and `instruction` are sibling
fields of one payload — and both are in settled voice.

## M8 — No frontmatter key pairs a skill to an agent type, in either direction

Every `SKILL.md` reachable from this machine (467 files, under
`~/.claude/skills`, `~/.claude/plugins`, `.claude/skills`), by key:

```
description name license metadata version allowed-tools user-invocable
compatibility argument-hint disable-model-invocation tools context title
```

Every agent definition (104 files):

```
name description model tools color assistant user permissionMode proactive
```

A skill cannot name an agent type; an agent cannot name a skill. The
charge names both because nothing else can. `skill-creator` documents
`name` and `description` as the required pair and adds no agent field.

## M9 — The proposal-directory query, built and run

`specimens/workable.mjs`, node builtins only, over
`specimens/proposals/` — four proposal files with `state` and `needs`
frontmatter. The operator's stated scenario, reproduced:

```
$ node workable.mjs --dir proposals
workable now (deps at merged):
  to-spec    gateway-auth  [atlas-kit]  review:agent
  building   rocs-record-split  [rocs-kit]  review:agent
blocked:
  to-spec    devportal-caller  [atlas-kit]  waits on: gateway-auth

# gateway-auth reaches merged; re-query
$ node workable.mjs --dir proposals
workable now (deps at merged):
  to-spec    devportal-caller  [atlas-kit]  review:human
  building   rocs-record-split  [rocs-kit]  review:agent
blocked:
```

Two come back on the first pass, the third on the second once what it
waited on is merged. Dependency-aware fan-out, re-queried each pass, with
no OpenSpec feature behind it.

## M10 — The lavish steering source is installed

`~/.claude/skills/lavish/SKILL.md` exists (13k). The page could be built.
`lavish-axi` is not on `PATH`, which is the documented healthy state;
`npx -y` fetched it for `design` and every `playbook` call.
