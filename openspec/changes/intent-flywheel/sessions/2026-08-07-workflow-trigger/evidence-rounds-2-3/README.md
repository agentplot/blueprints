# Rounds 2-3 evidence — schema-triggered workflow: reliability, cause, and where the trigger lives

Everything here is under `/tmp/wfprobe/`. Nothing was written into blueprints;
the session worktree was torn down before this round began.

Versions: `claude` 2.1.221, `openspec` 1.7.0. Every trial is a `claude -p`
headless subprocess, `--permission-mode bypassPermissions`, `HERDR_ENV=1`,
`--output-format stream-json --verbose`.

## The five arms

| arm | template | invocation | profile | n |
|---|---|---|---|---|
| **S1** | `r2base` | `openspec instructions apply --change bolt-abc --json \| jq -r .instruction` + "do what it says" | default | 8 |
| **S2** | `r2starve2` | same as S1 | default | 8 |
| **A** | `r2base` | `/opsx:apply build a dynamic workflow with the instructions for bolt-abc` | default | 8 |
| **B** | `r2base` | same as A | `--agent flywheel-bolt-conductor` | 8 |
| **C** | `r2detect` | `Continue work on the bolt-abc change.` (cold) | default | 8 |

S2 is S1's schema plus an explicit prohibition on the conductor querying the
task list itself. C is S1's schema plus a "report the run ID" clause.

## Results

| arm | fired | re-queried tasks | built inline | fabricated ids |
|---|---|---|---|---|
| S1 | 7/8 | 7/8 | 0 | 0 |
| S2 | **8/8** | **1/8** | 0 | 0 |
| A | 8/8 | 8/8 | 0 | 0 |
| B | 8/8 | 8/8 | 0 | 0 |
| C | 5/8 | 8/8 | 1 | **0** |

## Directories

- `schemas/` — the exact `apply.instruction` text for each variant, plus
  `opsx-apply-command.md`, the `/opsx:apply` command definition. Read that
  one: its step 3 runs the full `--json` and its step 6 says to implement
  tasks one at a time, which is what the schema instruction forbids.
- `scripts/` — **49 files: 45 workflow scripts the agents authored, and 4
  `*.NO-SCRIPT.txt` markers.** The markers are the walk-pasts (`S1-6`, `C-1`,
  `C-2`, `C-3`); an absence is evidence. No script was written in advance by
  me — every one of the 45 was authored by the agent under test, at run time,
  from the prompt in `apply.instruction`.
- `transcripts/` — one `<arm>-<n>.jsonl` per trial, full tool-call stream.
- `outputs/` — the `out/*.txt` each trial produced; `EMPTY.txt` where a trial
  produced none.
- `results/` — one JSON line per trial from `summarize.mjs`.

## To check the claims, a reader needs

- **"the conductor already holds the tasks"** → `transcripts/S1-*.jsonl`, the
  Bash commands. 7 of 8 ran the unfiltered `--json` after the filtered one.
- **"the prohibition is what makes starving stick"** → `schemas/r2starve2.schema.yaml`
  against `schemas/r2base.schema.yaml`, and `results/S2.results` vs `S1.results`.
- **"rule 1 does not suppress the workflow"** → `transcripts/B-*.jsonl`; 7 of 8
  loaded `flywheel-construction`, which carries the rule, and all 8 fired.
  `B-4`'s final text is the one that states the override out loud.
- **"the detector is not confabulated"** → `results/C.results`: `claimedIds`
  equals `realIds` in all 5 fired trials, `fabricated` empty in all 8.
- **"no authored script isolates"** → `grep -l isolation scripts/*.js` returns
  nothing across all 45.

## Two caveats about this evidence

- The `/tmp` templates are **not git repositories**, so no `wf_*` worktree
  capture exists for round 2. It would have been empty regardless: none of the
  45 scripts requested `isolation: 'worktree'`. The round-1 worktree
  measurement stands as the only direct evidence on that.
- `summarize.mjs`'s first `inlineBuild` regex produced false positives by
  matching verification reads (`cat out/*.txt`, `2>&1`). It was corrected and
  all arms re-scored; the numbers above are post-correction. The uncorrected
  pass claimed 2 inline builds each in S1 and S2 that did not happen.


---

# Round 3 — does the trigger work from the INVOCATION alone?

Rounds 1-2 never tested this. Every round-2 schema still carried the keyword
(`r2base` 5 mentions of "Workflow", `r2starve2` 7, `r2detect` 7), so arms A and
B firing 8/8 could not separate prompt from schema.

Round 3 strips the schema. `schemas/r3strip.schema.yaml` describes the loop's
SHAPE only - analyse which tasks can start, build the startable ones, re-query
each pass. Audited: **0 occurrences of "workflow", 0 of "agent"**, in the file
and in the delivered `.instruction` payload.

| arm | schema | invocation | profile | fired |
|---|---|---|---|---|
| **P** | stripped | `/opsx:apply build a dynamic workflow with the instructions for bolt-abc` | default | **8/8** |
| **PS** | stripped | as P, but naming the `Workflow` tool outright | default | **8/8** |
| **PC** | stripped | as P | `--agent flywheel-bolt-conductor` | **8/8** |

24 of 24 fired. The trigger does not need to be in the schema.

## Shape, with only the prompt carrying it

| arm | Analyse+Build present | >2 phases | agents per script |
|---|---|---|---|
| P | 7/8 | 6/8 | 2-4 |
| PS | 7/8 | 8/8 | 3 |
| PC | 8/8 | 8/8 | 3-4 |

- All 24 trials produced the correct final state: `out/1.txt`, `out/2.txt`,
  `out/3.txt`, with task 3 staged after task 1.
- **25 of 26 authored scripts built an explicit multi-pass loop** (`while (pass
  < 6)`, re-querying each pass) rather than one pass driven from outside. The
  shape did not degrade; the loop moved INTO the workflow.
- The drift is additive: most scripts invented a third phase (`Record`,
  `Land`, `Commit`, `Checkoff`) to tick tasks off. Two collapsed the phases
  into `Pass 1..N` instead of `Analyse`/`Build`.
- `0 of 26` round-3 scripts used `isolation: 'worktree'` - now **0 of 71**
  across rounds 2 and 3 combined.
- Under the conductor profile, 5 of 8 PC trials had loaded
  `flywheel-construction` (the rule-1 skill) and fired anyway.

## No walk-pasts to characterise

The charge asked what a non-firing stripped-schema trial does instead. **There
were none** - 24/24 fired, so that question has no data in round 3. The only
walk-past evidence remains round 2's arm C (`scripts/C-{1,2,3}.NO-SCRIPT.txt`
and their transcripts).

## Round 1's ctrlC is not a counterexample

`ctrlC` fired 0, but its prompt was "Work the change `demo`... then do what it
tells you to do" - which names no workflow either. With the keyword absent from
BOTH schema and prompt, nothing fires; with it in either one, it fires. ctrlC
and arm P agree.

## Round 3 files

- `schemas/r3strip.schema.yaml` - the stripped instruction, the artifact under test.
- `scripts/P-*.js`, `PS-*.js`, `PC-*.js` - 26 scripts authored with no schema
  keyword to copy from.
- `transcripts/P*-*.jsonl`, `outputs/P*-*/`, `results/P*.results`.
