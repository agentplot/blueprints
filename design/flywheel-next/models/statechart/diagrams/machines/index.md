# Machines — rendered

One statechart per machine file, drawn by `machines/render.py` from the definition
itself, so the picture cannot drift from the runtime (83). Regenerate with
`uv run --with pyyaml python3 machines/render.py` from `models/statechart`.

32 machines: 16 object, 11 template, 5 engine.

## Core objects and structural templates (`machines/`)

| machine | kind | version | object | satisfies | diagram |
|---|---|---|---|---|---|
| `bolt` | object | 2 | bolt | 186, 4, 30, 33, 39, 40, 44, 46, 47, 48, 55, 63, 74, 103, 175, 177 | [bolt.svg](bolt.svg) |
| `capture` | object | 1 | capture | 4, 19, 106, 111, 112, 114, 115, 178, 181 | [capture.svg](capture.svg) |
| `claim` | object | 4 | claim | 23, 97, 98, 105, 121, 195, 198, 200, 211 | [claim.svg](claim.svg) |
| `curation` | object | 3 | curation | 4, 20, 58, 60, 108, 110, 116, 118, 171, 182, 188 | [curation.svg](curation.svg) |
| `elaboration` | object | 2 | elaboration | 4, 5, 24, 27, 54, 89, 187, 188, 189, 193, 210 | [elaboration.svg](elaboration.svg) |
| `intent` | object | 3 | intent | 20, 21, 22, 23, 49, 54, 109, 117, 187, 189 | [intent.svg](intent.svg) |
| `ledger-cell` | object | 4 | ledger-cell | 100, 101, 102, 104, 116, 195, 198, 200, 202 | [ledger-cell.svg](ledger-cell.svg) |
| `line` | template | 4 | template | 42, 49, 50, 52, 53, 54, 183, 185, 175, 176, 177, 179, 180, 192 | [line.svg](line.svg) |
| `operator-session` | object | 2 | operator-session | 68, 69, 196 | [operator-session.svg](operator-session.svg) |
| `organization` | object | 1 | organization | 204, 207, 208 | [organization.svg](organization.svg) |
| `place` | template | 2 | template | 4, 42, 45, 46, 51, 52, 55 | [place.svg](place.svg) |
| `planning` | object | 2 | planning | 4, 28, 29, 60, 64, 98, 101, 102, 104, 171, 172, 182, 198, 199, 200, 202 | [planning.svg](planning.svg) |
| `proposal` | object | 2 | proposal | 184, 17, 35, 36, 171, 172, 187 | [proposal.svg](proposal.svg) |
| `repository` | object | 1 | repository | 5, 104, 149, 199, 202, 203, 206, 207, 208 | [repository.svg](repository.svg) |
| `service` | object | 2 | service | 4, 12, 45, 46, 47, 48, 55, 191, 203 | [service.svg](service.svg) |
| `session` | template | 4 | template | 4, 24, 65, 66, 67, 70, 71, 72, 73, 80, 93, 171, 173, 174, 190, 196, 197 | [session.svg](session.svg) |
| `signal` | object | 2 | signal | 58, 60, 106, 107, 113, 114, 116, 118 | [signal.svg](signal.svg) |
| `stage` | template | 3 | template | 4, 41, 56, 70, 173, 190 | [stage.svg](stage.svg) |
| `unit` | object | 3 | unit | 4, 5, 13, 16, 17, 31, 35, 36, 37, 57, 60, 74, 172 | [unit.svg](unit.svg) |
| `work-item` | object | 1 | work-item | 4, 32, 38, 41, 43, 57, 74 | [work-item.svg](work-item.svg) |

## Engine machines (`machines/engine/`)

| machine | kind | version | object | satisfies | diagram |
|---|---|---|---|---|---|
| `host` | engine | 4 | host | 4, 32, 55, 96, 147, 149, 150, 151, 186, 196, 205 | [host.svg](host.svg) |
| `lease` | engine | 2 | lease | 128, 134, 147, 149, 150 | [lease.svg](lease.svg) |
| `plan` | engine | 2 | plan | 7, 8, 9, 11, 15, 83, 86, 148 | [plan.svg](plan.svg) |
| `response` | engine | 3 | response | 1, 3, 4, 6, 12, 137, 153, 154, 193, 194 | [response.svg](response.svg) |
| `sink` | engine | 1 | sink | 2, 8, 14, 18, 68, 82, 148, 152, 155 | [sink.svg](sink.svg) |

## Unit types (`machines/unit-types/`)

| machine | kind | version | object | satisfies | diagram |
|---|---|---|---|---|---|
| `chore` | template | 2 | template | 60, 61, 63, 91, 123, 190 | [chore.svg](chore.svg) |
| `default` | template | 4 | template | 37, 41, 99, 120, 190 | [default.svg](default.svg) |
| `fast` | template | 2 | template | 37, 41, 190 | [fast.svg](fast.svg) |
| `persona-test` | template | 2 | template | 56, 57, 85, 190 | [persona-test.svg](persona-test.svg) |

## Elaboration types (`machines/elaboration-types/`)

| machine | kind | version | object | satisfies | diagram |
|---|---|---|---|---|---|
| `self-closing` | template | 2 | template | 24, 25, 54, 190 | [self-closing.svg](self-closing.svg) |
| `standing` | template | 2 | template | 4, 25, 26, 54, 190, 212 | [standing.svg](standing.svg) |
| `with-operator` | template | 3 | template | 4, 25, 26, 69, 190 | [with-operator.svg](with-operator.svg) |
