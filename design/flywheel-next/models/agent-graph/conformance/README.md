# Conformance suite

One set of scenarios, run as data, that every profile must pass
unchanged. A profile is admitted by passing it (section 12, C.3.152).

Each file is one `kind: scenario` document validated by
`scenario.schema.json` (a superset of the `scenario` definition in
`../machines/schema.json`: the same `given` / `when` / `then` shape,
plus the fault and operation steps a contract test needs). Scenarios
name only evidence and effect names from `../machines/atoms.yaml` and
store names from `../machines/graph.yaml`; the harness maps them
through the profile's binding. Nothing in a scenario names a label, a
column, a file path, a service or a language.

## Files

| file | exercises |
|---|---|
| `c01-read.yaml` | B.1.113 read as of a point; A.8.67 |
| `c02-write-effect.yaml` | B.1.114 write an effect, repeat is a no-op |
| `c03-lease.yaml` | B.1.115 take · renew · release · expire; B.2.121; B.5.135 |
| `c04-present-receive.yaml` | B.1.116 present, receive attributed; B.6.138–139; A.1.5 unapplied handed back |
| `c05-notify.yaml` | B.1.117 notify within the bound; convergence without it |
| `c06-list.yaml` | B.1.118 list in scope; A.13.83 disjoint scope |
| `c07-status-view.yaml` | B.1.119, B.4.128–133 served with no host |
| `c08-durable.yaml` | B.2.120 survives the loss of every host |
| `c09-single-writer.yaml` | B.2.121 two writers of one object; I15 |
| `c10-atomic.yaml` | B.2.122 no reader sees half a write |
| `c11-derivable.yaml` | B.2.123, I7 restart changes nothing |
| `c12-word-once.yaml` | B.2.124, I2 a word delivered twice applies once |
| `s01-approve-from-phone.yaml` | S1 |
| `s05-restart-mid-day.yaml` | S5 |
| `s06-slow-start.yaml` | S6 |
| `s13-host-loses-power.yaml` | S13 |
| `s17-two-hosts-one-unit.yaml` | S17 (stated for git-only; every profile must pass it) |
| `s29-three-items-bound-two.yaml` | S29 |

The remaining scenarios of section 11 are walked in `../model.md` §17
and are data-plane behaviour that the stand-in control plane covers;
they are not profile-conformance tests and are not duplicated here.

## Running

```
fw-scenario run --profile <name> --binding ../machines/bindings/<name>.yaml conformance/
fw-scenario run --profile stand-in conformance/      # the in-memory control plane
```

The harness (`fw-engine`'s scenario runner, §6.4 of the model):

1. loads `../machines/` and refuses to start if the binding leaves an
   evidence or effect name unsatisfied (B.3.127);
2. seeds every store in `given` through the binding's write
   operations, in an isolated scope (a throwaway state repository and
   blueprints repository for git-only; a throwaway organization or a
   `fw:test-<run>` scope label for the tracker);
3. runs each `when` step in order against the profile's real control
   plane, with the world (herdr, wt, the built repository) replaced by
   the stand-in world that `world:` steps drive;
4. asserts `then` against what the control plane returns to `read` and
   `list` afterwards, and against the trace of node firings, effects
   and rows the engine recorded;
5. writes the trace beside the scenario as `<name>.trace.md` (S16).

## Step vocabulary

| step | meaning |
|---|---|
| `tick: {host}` | one engine tick on the named host |
| `receive: {rendering, row, answer, args, by, via}` | a word arrives through the profile's transport |
| `direct: {by, act}` | the operator acts on the store itself; `act` is one of the binding's `direct-word` sightings by meaning |
| `world: {…}` | set what the reconciler will observe next: a session's `observed`, a pane's last message, a place's heads, a gate result |
| `clock: "+15m"` | advance the harness clock |
| `stop` / `start: host` | the machinery process on a host |
| `crash: host` | the host is lost: heartbeat stops, its panes are gone |
| `partition` / `reconnect: host` | the host cannot / can again reach the central service |
| `concurrent: [step, step]` | steps issued in the same instant from different hosts |
| `op: {host, read | list | write-effect | lease | present | notify-off | notify-on | status-view, …}` | a control plane operation called directly, for the contract tests; its result is bound to `as:` |
| `expect-throttle: {…}` | the harness makes the named operation slow (S6) |

`then` fields: `states`, `fired`, `effects`, `writes`, `rows`,
`no-rows`, `no-effects`, `no-writes`, `report` as in
`machines/schema.json`, plus `results` (assertions over values bound
by `as:`) and `latency` (a bound the profile's binding must state and
meet).

## What "unchanged" means

A profile passes when every file here passes with no edit to any file
under `../machines/` except `bindings/<profile>.yaml`, and no edit to
any file here. A profile that needs a scenario changed is not a
profile (C.3.154).
