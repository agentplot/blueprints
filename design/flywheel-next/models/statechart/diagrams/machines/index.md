# Machines — rendered

One statechart per machine file, drawn by `machines/render.py` from the definition
itself, so the picture cannot drift from the runtime (83). Regenerate with
`uv run --with pyyaml python3 machines/render.py` from `models/statechart`.

34 machines: 18 object, 11 template, 5 engine.

## Core objects and structural templates (`machines/`)

| machine | kind | tier | version | object | satisfies | diagram |
|---|---|---|---|---|---|---|
| `bolt` | object | core | 2 | bolt | 186, 4, 30, 33, 39, 40, 44, 46, 47, 48, 55, 63, 74, 103, 175, 177 | [bolt.svg](bolt.svg) |
| `capture` | object | core | 2 | capture | 4, 19, 106, 111, 112, 114, 115, 178, 181, 215, 216, 263, 271, 288, 290 | [capture.svg](capture.svg) |
| `claim` | object | core | 4 | claim | 23, 97, 98, 105, 121, 195, 198, 200, 211 | [claim.svg](claim.svg) |
| `curation` | object | core | 4 | curation | 4, 20, 58, 60, 108, 110, 116, 118, 171, 182, 188 | [curation.svg](curation.svg) |
| `elaboration` | object | core | 2 | elaboration | 4, 5, 24, 27, 54, 89, 187, 188, 189, 193, 210 | [elaboration.svg](elaboration.svg) |
| `intent` | object | core | 3 | intent | 20, 21, 22, 23, 49, 54, 109, 117, 187, 189 | [intent.svg](intent.svg) |
| `ledger-cell` | object | core | 4 | ledger-cell | 100, 101, 102, 104, 116, 195, 198, 200, 202 | [ledger-cell.svg](ledger-cell.svg) |
| `line` | template | core | 4 | template | 42, 49, 50, 52, 53, 54, 183, 185, 175, 176, 177, 179, 180, 192 | [line.svg](line.svg) |
| `operator-session` | object | core | 2 | operator-session | 68, 69, 196 | [operator-session.svg](operator-session.svg) |
| `organization` | object | core | 2 | organization | 15, 204, 207, 208, 218, 219, 220, 221, 241, 247, 255, 261, 265, 266, 267, 276, 279, 281, 282, 294, 302, 304, 312 | [organization.svg](organization.svg) |
| `package` | object | core | 1 | package | 5, 204, 207, 224, 228, 229, 284, 286, 287 | [package.svg](package.svg) |
| `place` | template | core | 2 | template | 4, 42, 45, 46, 51, 52, 55, 238, 240 | [place.svg](place.svg) |
| `planning` | object | core | 3 | planning | 4, 28, 29, 60, 64, 98, 101, 102, 104, 171, 172, 182, 198, 199, 200, 202 | [planning.svg](planning.svg) |
| `pool` | object | core | 1 | pool | 204, 230, 239, 240, 241, 242, 264, 275, 289 | [pool.svg](pool.svg) |
| `proposal` | object | core | 2 | proposal | 184, 17, 35, 36, 171, 172, 187 | [proposal.svg](proposal.svg) |
| `repository` | object | core | 1 | repository | 5, 104, 149, 199, 202, 203, 206, 207, 208 | [repository.svg](repository.svg) |
| `service` | object | core | 2 | service | 4, 12, 45, 46, 47, 48, 55, 191, 203 | [service.svg](service.svg) |
| `session` | template | core | 4 | template | 4, 24, 65, 66, 67, 70, 71, 72, 73, 80, 93, 150, 171, 173, 174, 190, 196, 197, 226, 251 | [session.svg](session.svg) |
| `signal` | object | core | 2 | signal | 58, 60, 106, 107, 113, 114, 116, 118 | [signal.svg](signal.svg) |
| `stage` | template | core | 4 | template | 4, 41, 56, 70, 173, 190, 285 | [stage.svg](stage.svg) |
| `unit` | object | core | 4 | unit | 4, 5, 13, 16, 17, 31, 35, 36, 37, 57, 60, 74, 172 | [unit.svg](unit.svg) |
| `work-item` | object | core | 2 | work-item | 4, 32, 38, 41, 42, 43, 57, 74 | [work-item.svg](work-item.svg) |

## Engine machines (`machines/engine/`)

| machine | kind | tier | version | object | satisfies | diagram |
|---|---|---|---|---|---|---|
| `host` | engine | core | 5 | host | 4, 32, 55, 96, 147, 149, 150, 151, 186, 196, 205, 215, 217, 222, 230, 231, 232, 238, 240, 256, 257, 258, 259, 260, 262, 268, 269, 270, 272, 273, 274, 283, 291, 292, 293, 295, 296, 297, 298, 299, 300, 305, 313 | [host.svg](host.svg) |
| `lease` | engine | core | 2 | lease | 128, 134, 147, 149, 150, 232, 238, 278 | [lease.svg](lease.svg) |
| `rail` | engine | core | 3 | rail | 7, 8, 9, 11, 15, 83, 86, 148, 213, 214, 235, 237, 248, 250, 280 | [rail.svg](rail.svg) |
| `response` | engine | core | 3 | response | 1, 3, 4, 6, 12, 137, 153, 154, 193, 194, 233, 234, 235, 246, 249, 251 | [response.svg](response.svg) |
| `sink` | engine | core | 1 | sink | 2, 8, 14, 18, 68, 82, 148, 152, 153, 154, 155, 216, 217, 218, 233, 236, 243, 244, 245, 247, 253, 254, 277, 303, 306, 307, 308, 309, 310, 311 | [sink.svg](sink.svg) |

## Unit types (`machines/unit-types/<machine>@<version>.yaml`)

| machine | kind | tier | version | object | satisfies | diagram |
|---|---|---|---|---|---|---|
| `chore@2` | template | extensible | 2 | template | 60, 61, 63, 91, 123, 190 | [chore@2.svg](chore@2.svg) |
| `default@5` | template | extensible | 5 | template | 37, 41, 99, 120, 190 | [default@5.svg](default@5.svg) |
| `fast@3` | template | extensible | 3 | template | 37, 41, 190 | [fast@3.svg](fast@3.svg) |
| `persona-test@3` | template | extensible | 3 | template | 56, 57, 85, 190 | [persona-test@3.svg](persona-test@3.svg) |

## Elaboration types (`machines/elaboration-types/<machine>@<version>.yaml`)

| machine | kind | tier | version | object | satisfies | diagram |
|---|---|---|---|---|---|---|
| `self-closing@2` | template | extensible | 2 | template | 24, 25, 54, 190 | [self-closing@2.svg](self-closing@2.svg) |
| `standing@2` | template | extensible | 2 | template | 4, 25, 26, 54, 190, 212 | [standing@2.svg](standing@2.svg) |
| `with-operator@3` | template | extensible | 3 | template | 4, 25, 26, 69, 190 | [with-operator@3.svg](with-operator@3.svg) |
