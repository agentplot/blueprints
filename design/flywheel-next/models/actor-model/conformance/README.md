# Conformance suite

One set of scenarios, run as data, that every profile must pass
unchanged (requirement 152). A scenario is `given` (tables the stand-in
control plane loads, or the real profile is seeded with), `when` (ticks,
messages, words, crashes, clock moves), and `then` (the transitions,
effects, rows and writes asserted, and the guarantees named). The
runner is `flywheel conform --profile <stand-in|git-only|tracker>
[scenario…]`; against a real profile it seeds a scratch scope
(`fw2-conform-<run id>` in the tracker, a throwaway `flywheel-state`
branch in git-only) and tears it down.

Every operation of B.1 and every guarantee of B.2 is exercised by at
least one scenario; `suite.yaml` is the index and says which. The
domain scenarios at the end (S1, S29, S19) run the real definitions in
`../machines/` through the same runner and are the shape a dictated
scenario (S16) is turned into.

## Scenario shape

```yaml
id: C05
title: a word delivered twice is applied once
exercises: {operations: [present-receive], guarantees: [word-once]}
profiles: [all]
given:
  clock: 2026-09-04T07:40:00Z
  actors:
    - {id: unit/atlas/b-0142/u-3, state: proposed, seq: 1, epoch: 1}
    - {id: decision/unit/atlas/b-0142/u-3/approve, state: open, seq: 0, parent: unit/atlas/b-0142/u-3, class: approve, answers: [yes, drop, redo]}
  leases: [{actor: bolt/atlas/b-0142, holder: host/studio, epoch: 1}]
  rendering: {point: 2026-09-04T07:40:00Z, rows: {2: decision/unit/atlas/b-0142/u-3/approve}}
  world: {}
when:
  - word: {source: discord-1423581234567890, text: "yes 2", who: chuck}
  - word: {source: discord-1423581234567890, text: "yes 2", who: chuck}
  - tick: host/studio
  - tick: host/studio
then:
  words: [{id: word/discord-1423581234567890, count: 1}]
  transitions:
    - {actor: decision/unit/atlas/b-0142/u-3/approve, from: open, to: answered, consumed: [word/discord-1423581234567890]}
    - {actor: unit/atlas/b-0142/u-3, from: proposed, to: approved}
  messages: [{to: unit/atlas/b-0142/u-3, kind: decided, count: 1}]
  rows: []
  writes-after: 0        # the second tick writes nothing
```

`then.transitions` is an ordered subset: every listed transition must
occur in that order; unlisted transitions are allowed unless
`then.exact: true`. `then.rows` is the whole plan after the last step.
`then.writes-after` counts writes made by the last `when` step.
