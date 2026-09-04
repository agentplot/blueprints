# Conformance suite

One set of scenarios, run as data, that every profile must pass
unchanged (requirements section 12, C.3.152). A profile is admitted when
`flywheel scenario run --profile <name> conformance/` passes with the
machine files byte-identical to `machines/` (their hash is written into
the run record).

Two directories:

- `contract/` — one scenario per operation of B.1 and per guarantee of
  B.2, exercised through the engine with a toy machine that shares no
  atom with the flywheel (`lamp`), so a profile is tested before the
  domain is loaded.
- `scenarios/` — S1 to S34 of the requirements, run over the flywheel's
  own machines. The `profiles:` line of each says which profiles it
  applies to; `all` runs on the stand-in and on every real profile.

## The format

`schema.json` beside this file is the schema. A scenario is:

```yaml
scenario: S1
title: approve a proposed elaboration from the phone
profiles: [all]            # or [git-only], [tracker]
requirements: [A.1.1, A.1.5, A.2.12, I2]
given:                     # the described state of the stores
  objects:
    - {id: intent/atlas-provider-limits, machine: intent, state: {life: open, open.line: current, open.material: settled, open.close: not-offered}}
    - {id: elaboration/atlas-provider-limits/research-1, machine: elaboration, parent: intent/atlas-provider-limits,
       state: {life: proposed}, record: {type: self-closing, type_version: 1}}
  evidence:                # evidence values the stand-in returns; anything unlisted is absent/false/none
    session.pane: {"elaboration/atlas-provider-limits/research-1/self-closing/1": absent}
when:                      # steps in order
  - tick: {}
  - word: {row: elaboration/atlas-provider-limits/research-1/elaboration-proposed, answer: "yes", id: discord/1001}
  - tick: {}
  - evidence: {place.exists: {"…": true}, place.contains_line: {"…": true}}
  - tick: {}
  - word: {row: …, answer: "yes", id: discord/1001}    # the same delivery again
  - tick: {}
then:
  transitions:             # in order, across all ticks
    - {object: elaboration/atlas-provider-limits/research-1, from: proposed, to: approved, word: discord/1001}
    - {object: …, from: approved, to: placing}
  effects:                 # by atom name, with count; a repeat must not add
    - {do: prepare_place, count: 1}
    - {do: start_session, count: 1}
  rows:
    after_tick: 1
    present: []
    absent: [elaboration-proposed]
  writes: {max_per_tick_when_unchanged: 0}
  applied_words: {elaboration/atlas-provider-limits/research-1: [discord/1001]}
```

`when` steps: `tick` (one tick over the scope), `word` (a delivery
through `receive`), `evidence` (the world changed: set stand-in
evidence), `notify` (a notify for an object), `restart` (drop every
in-memory thing and start again), `disconnect` / `reconnect` (git-only
and tracker: the control plane refuses or resumes), `host` (a second
host ticks). `then` clauses are all asserted; an unlisted effect with
count 0 is asserted absent when `effects_closed: true`.

## Running

```bash
flywheel scenario run conformance/                      # stand-in, every file
flywheel scenario run --profile git-only conformance/   # against a temporary bare repository
flywheel scenario run --profile tracker  conformance/   # against a throwaway GitHub repository (needs FLYWHEEL_SANDBOX_REPO)
flywheel scenario run conformance/scenarios/S30.yaml --trace   # writes S30.trace.md
```

The stand-in control plane (`flywheel-scenario`) is an in-memory map
implementing the same `ControlPlane` and `World` traits; the real
profiles run the same files with the sandbox as their store and a
scripted `World` whose herdr, git and wt calls return what the
scenario's `evidence` says.
