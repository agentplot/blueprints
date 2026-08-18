# Evidence — the workflow-trigger prototype, round 1

The finding is `../prototypes/schema-triggered-workflow.md`. This directory is
what it was measured on. It is here because the first charge said the
throwaway "is not committed anywhere", which killed the evidence along with
the scaffolding — the authored workflow scripts and the transcripts ARE the
result, not scaffolding around it.

## What to read first

`authored-workflows/` — the scripts the agents wrote, extracted from the
transcripts. **Nothing was pre-authored**; each is what one agent composed on
the spot from the schema's `apply.instruction`. Four scripts, 84-109 lines.

`schemas/<trial>-schema.yaml` — the `apply.instruction` under test in each
tree. `ctrlC-schema.yaml` is the control, with every mention of `Workflow`
and `Agent` stripped.

`transcripts/` — raw session JSONL, one per trial.

## The trials, and what each one did

| trial | arm | Workflow calls |
|---|---|---|
| `route1`, `route1-pass2` | directive prompt | 1 each |
| `loop2-run` | directive prompt | 1 |
| `loop3` | cold prompt | **0** |
| `loop4` | cold prompt | 1 |
| `loop5` | cold prompt | **0** |
| `ctrlC` | control - `Workflow` stripped from the instruction | **0** |

Extracting the scripts reproduces the finding's counts independently of the
prose: the control never fires, two of three cold trials never fire, and every
directive trial does.

## Tool sequence per trial

```
ctrlC          8xBash -> 2xWrite -> 2xBash
loop2-run      2xBash -> Workflow -> Bash -> Read -> Edit -> Workflow -> Bash
loop3          2xBash -> 4xRead -> 3xBash -> Edit -> 2xBash -> Edit -> Bash -> Skill -> 2xBash
loop4          4xBash -> Workflow -> Bash
loop5          6xBash -> Read -> Edit -> 2xBash -> Edit -> Bash -> Skill -> 2xBash
route1-pass2   2xBash -> 4xRead -> 2xBash -> Workflow -> Bash -> 2xEdit
route1         3xBash -> Workflow -> Bash -> Edit
```

`loop3` and `loop5` are the walk-past: the agent queried OpenSpec, read the
instruction, and then wrote the output files itself with Bash. Nothing
distinguishes them from a successful run except the absence of `Workflow`.

## Not preserved

The `out/*.txt` files each trial produced, and the git worktrees the workflow
created (`wf_*`, removed by hand after the run). Round 2 preserves as it goes.
