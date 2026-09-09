# The models

Part I says what must hold. The models say how one design satisfies it,
and they name real tools where Part I refuses to. They live outside the
book, in `design/flywheel-next/models/`, because they are checked by a
program rather than read by a person alone.

## The statechart model

`models/statechart/model.md` is the model of record. Every object with a
lifecycle is a hierarchical state machine defined as data, and the
engine is a reconciler: each tick lists objects, reads evidence,
evaluates guards, and performs effects whose proof is absent (83, 86).
Its sections run in reading order. Section 1 says what carries a machine
and what is only a record attribute. Section 2 is the engine, the guard
algebra and the line between engine and domain. Section 3 names every
store and section 4 binds each profile to it. Section 5 derives the rail
and prints the decision catalogue. Sections 6 to 11 cover planning,
lines and places, the ledger, signals, sessions and hosts. Section 12
answers the open questions of Part I one heading at a time, section 14
walks every scenario, and section 15 checks the invariants.

The definitions themselves are beside it:

| where | what it holds |
|---|---|
| `machines/` | one YAML file per machine, plus `atoms.yaml` (one predicate atom per question of evidence, one effect atom per act on the world), `schema.json`, and the type registry |
| `machines/unit-types/`, `machines/elaboration-types/` | the extensible machines an operator may add: `chore`, `fast`, `default`, `persona-test`; `self-closing`, `standing`, `with-operator` |
| `machines/engine/` | the five machines that name no domain object: host, lease, response, rail, sink |
| `profiles/` | the bindings, one file per state store and per surface family |
| `diagrams/` | the pictures, drawn from the definitions and checked against them |
| `conformance/` | the suite every profile must pass unchanged |

## The conformance suite

`conformance/contract/` holds one scenario per operation of Part B.1 and
per guarantee of B.2, exercised through the engine with a toy machine
that shares no atom with the flywheel, so a profile is tested before the
domain is loaded. `conformance/scenarios/` holds the numbered scenarios
of Part I, plus the extras that reach requirements no numbered scenario
touches. Each scenario names the profiles it applies to and states, in a
`satisfies:` list, the clauses it exercises.

## Running the check

From `design/flywheel-next/models/statechart`:

```bash
uv run --with pyyaml --with jsonschema python3 machines/check.py
```

It validates every machine against the schema, resolves every guard and
effect name against the atoms, checks every profile for completeness and
every diagram's state, decision and effect attributes against the
machines so a picture cannot drift from the runtime (83), and closes the
trace to Part I: every machine, decision kind, effect and scenario
carries the clause numbers it satisfies, and the run fails when a number
names no clause or a clause is cited by nothing. Redraw the machine
pictures after any change:

```bash
uv run --with pyyaml python3 machines/render.py
```

## The other two models

`models/context-map/` models the scope surface from first principles:
the bounded contexts, the closed set of relationship patterns, the
schema and an example map. `models/dispatch/` models dispatch as four
jobs rather than one program, with the source studies it was drawn
from. Both are written in the voice of Part I and cite it by number.
