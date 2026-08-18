# Prototype finding — where the dynamic-workflow trigger lives, and what rule 1 is worth against it

Three rounds, 70 headless trials, all under `claude` 2.1.221 / `openspec`
1.7.0. Every trial is a `claude -p` subprocess with
`--output-format stream-json --verbose` and `--permission-mode
bypassPermissions`, so the tool-call sequence is observed, not inferred, and
no permission denial can masquerade as a refusal. Full evidence is committed
in the session directory:

- round 1 → `sessions/2026-08-07-workflow-trigger/evidence/`
- rounds 2–3 → `sessions/2026-08-07-workflow-trigger/evidence-rounds-2-3/`
  (49 + 26 authored scripts, 40 + 24 transcripts, per-trial results,
  and every schema variant verbatim; its `README.md` maps each claim to the
  file that proves it)

The round-1 write-up with its full method and deviations is preserved at
`sessions/2026-08-07-workflow-trigger/prototypes/schema-triggered-workflow.md`.

## The four findings

### 1. The trigger lives in the invocation, and only needs to live there

With `apply.instruction` stripped of every mention of workflows and agents —
audited: 0 occurrences in the file and in the delivered payload — the
invocation `/opsx:apply build a dynamic workflow with the instructions for
<change>` fired **24 of 24** across three arms (plain, tool named outright,
and under the real `flywheel-bolt-conductor` profile). Round 1's stripped
control agrees from the other side: keyword absent from *both* schema and
prompt → 0 fires. In either one → it fires.

Stripping the schema *improved* the result: **25 of 26 authored scripts
built an explicit multi-pass loop** (re-query each pass) versus the
single-pass shape the schema-triggered runs tended to. The schema describes
the loop's shape; the invocation carries the trigger.
→ `decisions/the-trigger-lives-in-the-invocation.md`

### 2. The schema-only trigger is real but unreliable, and its failure is silent

`apply.instruction` alone opened the gate 4/4 when the prompt directed the
agent at the instructions, and 1/3 on a cold prompt — with the instruction
demonstrably in context each time. The walk-past produces plausible output
(`printf > out/1.txt`) with no signal that the loop layer never ran. Round
2's detector arm showed a run-ID reporting clause is honest — claimed IDs
equalled real IDs in all fired trials, zero fabricated — so the loop text's
"report the run ID" requirement is a workable check.
→ `questions/workflow-trigger-reliability.md` (closed by finding 1)

### 3. Rule 1 does not suppress the workflow — and that is a finding about rules, not workflows

Under `--agent flywheel-bolt-conductor`, with `flywheel-construction` (which
carries "never through the `Agent` tool" and the 98-subagent story) loaded
in 7 of 8 trials, the workflow fired **8/8**. One trial stated the override
aloud; **seven fired without remarking on the tension at all**. A schema
instruction silently overrode an operator's hard rule. The sharpened
question — is a rule that schema text can quietly override a rule at all —
is the open blocker on the whole loop-layer handoff.
→ `questions/rule-1-and-workflow-agents.md`

### 4. Nothing isolates unless made to, and herdr sees none of it

`isolation: 'worktree'` works when requested — real worktrees, own branches,
no write collisions — but **0 of 71 agent-authored scripts across rounds 2–3
requested it**. Unisolated agents run inside the conductor's own working
tree on the conductor's branch. During a six-agent run, `herdr agent list`
showed twelve fleet agents and none of the six. Isolated worktrees with
changes are not auto-removed and their output has no merge path — stranding
and cleanup debt are real costs, corroborated since by eight leftover
`wf_*` worktrees found in knowledgebase-spike. Any loop prompt must
*mandate* isolation for mutating phases; the feature will not volunteer it.

## Also measured

- The fan-out itself works: an agent infers ordering from task prose alone —
  no declared edges, no solver — and stages a dependent task to pass 2.
- Starving the conductor of the task list (an explicit prohibition on
  querying it) sticks: re-queries dropped 7/8 → 1/8. That arm was a lab rig
  for isolation of variables, not the adopted design; the adopted
  invocation is `/opsx:apply`.
- `/opsx:apply`'s own command text runs the full `--json` (step 3) and says
  to implement tasks one at a time (step 6) — adjacent text contradicting
  the loop, tasked for the machinery batch.

## Feeds

- `decisions/the-trigger-lives-in-the-invocation.md` — settled by round 3.
- `questions/workflow-trigger-reliability.md` — closed; the invocation
  phrasing plus the run-ID check is the answer.
- `questions/rule-1-and-workflow-agents.md` — open, sharpened by round 2;
  blocks the loop-layer handoff.
