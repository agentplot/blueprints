# Conformance suite

One set of scenarios, run as data, that every profile must pass
unchanged (requirements section 12, 168). A profile is admitted when
`flywheel scenario run --profile <name> conformance/` passes with the
machine files byte-identical to `machines/` (their hash is written into
the run record).

Two directories:

- `contract/` — one scenario per operation of B.1, per guarantee of
  B.2, and one for the binding itself, exercised through the engine
  with a toy machine that shares no atom with the flywheel (`lamp`), so
  a profile is tested before the domain is loaded.
- `scenarios/` — S1 to S34 of the requirements, run over the flywheel's
  own machines; X1 to X9 for the requirements the numbered scenarios
  do not reach; T1 for the tracker's direct action. The `profiles:`
  line of each says which profiles it applies to; `all` runs on the
  stand-in and on every real profile.

Every scenario states the requirements it exercises in `satisfies:`;
`machines/check.py` fails when a number names no requirement or a
requirement is cited by nothing.

## The format

`schema.json` beside this file is the schema. A scenario is:

```yaml
scenario: S1
title: approve a proposed elaboration from the phone
profiles: [all]            # or [git-only], [tracker], [stand-in]
satisfies: [1, 6, 13, 24]
invariants: [I1, I2]
given:                     # the described state of the stores
  objects:
    - {id: intent/atlas-provider-limits, machine: intent, state: {life: open, line: current, open.material: settled, open.close: not-offered}}
    - {id: elaboration/atlas-provider-limits/research-1, machine: elaboration, parent: intent/atlas-provider-limits,
       state: {life: proposed}, record: {type: self-closing, type_version: 1}}
  evidence:                # evidence values the stand-in returns; anything unlisted is absent/false/none
    session.pane: {"elaboration/atlas-provider-limits/research-1/self-closing/1": absent}
  register: {elaboration/atlas-provider-limits/research-1/elaboration-proposed: 7, next: 8}
  marks: {chat: now}
  script:                  # what the stand-in sessions play (93)
    "elaboration/atlas-provider-limits/research-1/self-closing/1":
      - {after: 2m, pane: present, activity: working}
      - {after: 40m, exit: done, deliverables: [note], commits: [research.md]}
when:                      # steps in order
  - tick: {}
  - response: {decision: elaboration/atlas-provider-limits/research-1/elaboration-proposed, answer: "yes", id: discord/1001}
  - tick: {}
  - evidence: {place.exists: {"…": true}, place.contains_line: {"…": true}}
  - tick: {}
  - response: {number: 7, answer: "yes", id: discord/1001}    # the same delivery again, by number
  - tick: {}
then:
  transitions:             # in order, across all ticks
    - {object: elaboration/atlas-provider-limits/research-1, from: proposed, to: approved, response: discord/1001}
    - {object: …, from: approved, to: placing}
  effects:                 # by atom name, with count; a repeat must not add
    - {do: prepare_place, count: 1}
    - {do: start_session, count: 1}
  decisions:
    - {after_step: 1, present: [], absent: [elaboration-proposed], numbers: {…: 7}}
  writes: {max_per_tick_when_unchanged: 0}
  applied_responses: {elaboration/atlas-provider-limits/research-1: [discord/1001]}
```

`when` steps: `tick` (one tick over the scope), `response` (a delivery
through `receive`: an answer by decision id or by number, or a dictation
naming an object), `evidence` (the world changed: set stand-in
evidence), `script` (seed or extend what the stand-in sessions play),
`notify` (a notify for an object), `restart` (drop every in-memory
thing and start again), `disconnect` / `reconnect` (git-only and
tracker: the control plane refuses or resumes), `host` (a second host
ticks), `direct` (the operator acts on the store, the chat, the tracker
or a pane by hand), `files` (books or built repository files the world
reports). `then` clauses are all asserted; an unlisted effect with count
0 is asserted absent when `effects_closed: true`.

## The stand-in sessions

`profiles/sessions-stand-in.yaml` binds the session evidence and
effects to a scripted player. `start_session` records the id and plays
the script entries for it at their offsets: a pane appearing, activity,
a keystroke, an exit reported by running the same `flywheel exit`
command a session would, offers by `flywheel offer`, a refusal by
`flywheel refuse`, commits made into the place with git. Only this
binding is faked (93); the control plane, the engine, the git effects
on real (sandbox) repositories, the plan and the page run as built. A
scenario may set the session evidence names directly in an `evidence`
step instead; the script is the way to say what a session would have
done.

## Running

```bash
flywheel scenario run conformance/                      # stand-in control plane, stand-in sessions, every file
flywheel scenario run --profile git-only conformance/   # against a temporary bare repository
flywheel scenario run --profile tracker  conformance/   # against a throwaway GitHub repository (needs FLYWHEEL_SANDBOX_REPO)
flywheel scenario run conformance/scenarios/S30.yaml --trace   # writes S30.trace.md
```

The stand-in control plane (`flywheel-scenario`) is an in-memory map
implementing the same `ControlPlane` and `World` traits; the real
profiles run the same files with the sandbox as their store, the
scripted `Sessions` stand-in, and a `World` whose git and wt calls run
against sandbox repositories.
