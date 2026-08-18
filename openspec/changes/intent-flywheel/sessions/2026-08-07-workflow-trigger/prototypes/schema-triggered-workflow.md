# Prototype — can a schema instruction trigger a dynamic workflow?

## Question

Three questions, settled together:

1. **Trigger.** Does an agent working a change bound to a custom OpenSpec
   schema author and run a Claude Code dynamic workflow because that
   schema's `apply.instruction` told it to? The predicted failure was the
   `Workflow` tool's opt-in gate: a schema instruction is not a user
   message.
2. **Fan-out.** Does the loop work when the query is over `tasks[]` and an
   **agent** analyses them — no declared dependency edges, no solver?
3. **Rule 1.** A workflow's `agent()` spawns Task-tool subagents, which our
   machinery forbids outright. Do `/workflows` visibility and
   `isolation: 'worktree'` answer what rule 1 exists to protect?

## Where

Throwaway repos at `/tmp/wfprobe/{loopdemo,ctrlC,loop2,loop3,loop4,loop5}`,
none committed anywhere. The Q3 measurement ran against this session's own
worktree, `.bare.sess-workflow-probe` on `sess/workflow-probe`; the three
git worktrees and three branches it created were removed by hand (below).

Versions: `claude` **2.1.221**, `openspec` **1.7.0**.

**Instrument.** Every trigger measurement is a `claude -p` headless
subprocess with `--output-format stream-json --verbose`, so the tool-call
sequence is observed rather than inferred, and each run gets a clean
conversation with no opt-in language in it. This is neither the `Agent`
tool nor a herdr agent; it is a subprocess, chosen because it is the only
instrument that gives an uncontaminated conversation plus a full tool log.
All runs used `--permission-mode bypassPermissions` so a permission denial
could not be mistaken for a refusal to launch.

**Two deviations from the charge, both forced.**

- The charge said build in a spike-repo worktree (`flywheel-prototype`) and
  the operator said not the spike repo. I used `/tmp`. Nothing survives.
- The charge said reuse `sessions/2026-08-07-loop-layer/specimens/workable.mjs`.
  **That file does not exist** — not in this worktree, not on `sess/loop-layer`
  (`git ls-tree -r --name-only sess/loop-layer -- .../2026-08-07-loop-layer/`
  returns four files, no `specimens/`). M9 of that session's `measurements.md`
  describes running it, but it was never committed. I rebuilt it, then the
  operator's correction struck the whole dependency-solver approach, so it
  is dead either way and is not part of this finding.

## Findings

### 1. The opt-in gate is not the obstacle. Instruction compliance is.

**The gate opens.** With `apply.instruction` carrying the workflow prompt
and a user prompt that directs the agent to the instructions, the agent
called `Workflow` in **4 of 4 runs**, on a repo it had never seen, with no
opt-in keyword, no skill, and no session-level setting.

Prompt used (`/tmp/wfprobe/loopdemo`, then `/tmp/wfprobe/loop2`):

> Work the change `demo`. Start by running `openspec instructions apply --change demo`, then do what it tells you to do.

```
$ cd /tmp/wfprobe/loop2 && claude -p "<prompt above>" \
    --permission-mode bypassPermissions --output-format stream-json --verbose
TOOL: Bash → openspec instructions apply --change demo
TOOL: Bash
TOOL: Workflow          ← pass 1
TOOL: Bash / Read / Edit
TOOL: Workflow          ← pass 2
```

So the charge's predicted answer — "it declines, correctly" — **did not
happen, in any run.** Route 2 (skill in the path) and route 3 (session
opt-in) were never needed and are untested.

**Nothing was written ahead of time.** The `apply.instruction` is a prompt;
the agent authored the script itself, inline, each run. Its own opening:

```js
export const meta = {
  name: 'openspec-demo-loop',
  description: 'One construction pass for openspec change "demo": analyse task readiness, then build startable tasks',
  phases: [
    { title: 'Analyse', detail: 'query openspec tasks and infer which are startable now' },
    { title: 'Build',   detail: 'one agent per startable task, writes out/<id>.txt' },
  ],
}
```

It also invented a `StructuredOutput` schema for the analysis phase that
nothing asked for. Two passes in one run means it authored twice.

**The instruction text is what does it.** Control C is the same repo with
every mention of `Workflow` and `Agent` stripped from `apply.instruction`
(`grep -c Workflow schema.yaml` → 0), same directive prompt:

```
$ cd /tmp/wfprobe/ctrlC && claude -p "<same prompt>" ...
TOOL: Bash ×8, Write ×2   ← no Workflow call; tasks done inline
```

So the trigger is the instruction, not ambient willingness to fan out.

**But the trigger is unreliable, and this is the real finding.** With a
cold prompt naming nothing —

> Continue work on the demo change.

— the agent called `Workflow` in **1 of 3 trials**:

| tree | Workflow calls | workflow text in agent's context |
|---|---|---|
| `/tmp/wfprobe/loop3` | 0 | 2 |
| `/tmp/wfprobe/loop4` | 1 | 2 |
| `/tmp/wfprobe/loop5` | 0 | 2 |

The right-hand column is the decisive one
(`grep -c 'Claude Code dynamic workflow' loopN.jsonl`). In **every** cold
trial the agent ran `openspec instructions apply --change demo --json` and
the instruction reached its context. It read the sentence *"Do not work the
tasks one at a time in this conversation"* and then did exactly that:

```
Bash: ... printf 'built 1\n' > out/1.txt && printf 'built 2\n' > out/2.txt
```

The failure mode is not a closed gate that refuses. It is an open gate the
agent walks past — silently, producing plausible output, with no signal that
the loop layer never ran.

### 2. The fan-out works, and the agent infers ordering from prose

`openspec instructions apply --change <id> --json` returns `tasks[]` as
`{id, description, done}` — confirmed, and it is the only structured thing
the loop parses out of OpenSpec:

```
$ openspec instructions apply --change demo --json | keys
changeName changeDir schemaName contextFiles progress tasks state instruction context root
```

The probe's four task lines declare no relationships. Task 3's description
contains the clause *"cannot start until gateway-auth is built"*. The
analysis agent's verdict, from prose alone:

| task | verdict | agent's reason |
|---|---|---|
| 1 gateway-auth (atlas-kit) | startable | self-contained |
| 2 rocs-record-split (rocs-kit) | startable | self-contained, different kit |
| 3 devportal-caller (atlas-kit) | waiting | description says it cannot start until 1 is built |
| 4 legacy-shim | skipped | already `done` |

It did **not** serialise 1 and 3 merely because both are atlas-kit. Pass 1
built `out/1.txt`, `out/2.txt`; pass 2 re-queried and built `out/3.txt`.
That is the design's claimed scenario, reproduced without a solver.

### 3. Rule 1 — isolation answers collision; nothing answers fleet visibility

Measured by running a six-agent workflow against this worktree: three
agents with `isolation: 'worktree'`, three without, each reporting `pwd`,
git toplevel and branch, and appending to a `shared.txt`.

**`isolation: 'worktree'` is real.** Three distinct git worktrees, each on
its own branch, `locked` while running:

```
$ git worktree list | grep claude/worktrees
.bare/.claude/worktrees/wf_c829dc42-df8-1  4f9b12e [worktree-wf_c829dc42-df8-1] locked
.bare/.claude/worktrees/wf_c829dc42-df8-2  4f9b12e [worktree-wf_c829dc42-df8-2] locked
.bare/.claude/worktrees/wf_c829dc42-df8-3  4f9b12e [worktree-wf_c829dc42-df8-3] locked
```

Each agent's `shared.txt` contained only its own line.

**Without isolation, agents run inside the conductor's own working tree, on
the conductor's branch.** All three unisolated agents returned
`toplevel: .bare.sess-workflow-probe`, `branch: sess/workflow-probe` — my
tree, while I was working in it — and all three wrote to one `shared.txt`.
Appends survived here, but three concurrent writers in a live session tree
is precisely the hazard rule 1 names, and a tracked file would have raced.

**herdr cannot see them.** During the run:

```
$ herdr agent list | (count agents, match /wf_|isolated|shared|worktree-/)
herdr agent count: 12
any named wf_/isolated/shared? 0
```

Twelve fleet agents visible, none of them the six that were running. The
operator's fleet view shows the *conductor* working and nothing beneath it.
`/workflows` and the on-disk transcripts
(`subagents/workflows/wf_*/agent-*.jsonl`, one pair per agent) do give
visibility — but only to whoever is looking at that session, not to the
fleet.

**Two costs the design has not accounted for.**

- *Stranding.* Each isolated agent's file stayed uncommitted in its own
  worktree. There is no merge path; output returns only through the agent's
  return value. Isolation buys safety by making the work unreachable.
- *Cleanup debt.* Worktrees are auto-removed only if unchanged. These were
  changed, so three worktrees and three branches persisted after the run
  and I removed them by hand
  (`git worktree remove --force ...`, `git branch -D worktree-wf_*`).
  A bolt that fans out repeatedly accumulates these in the real repo.

**So: partly.** Isolation answers the collision half of rule 1. Neither
`/workflows` nor isolation answers the fleet-visibility half — which, given
the 98-subagent bolt, is the half rule 1 was written for.

### What the design has to become

- `apply.instruction` **can** carry the workflow prompt; no skill is needed
  to open the gate. Route 2 was the expensive contingency and it is not
  required.
- But `apply.instruction` **cannot be relied on alone.** A cold-started
  conductor read the instruction and ignored it in 2 of 3 trials. Whatever
  starts a conductor must direct it at the apply instructions explicitly
  (the phrasing that scored 4/4), or the loop needs a check that notices the
  fan-out did not happen. A silent skip is the dangerous outcome, not a
  refusal.
- Rule 1 cannot be amended to "workflows are fine" on the strength of
  isolation. Either it is amended narrowly — workflow `agent()` permitted
  **with** `isolation: 'worktree'` mandatory for any mutating phase, plus
  an accepted loss of herdr visibility and a named cleanup step — or
  workflow phases launch herdr agents. This prototype does not decide which;
  it establishes that isolation is real, stranding and cleanup debt are
  real, and herdr blindness is total.

### What I did not test

- Routes 2 (skill in the path) and 3 (session-level opt-in) — unnecessary
  once route 1 opened the gate, so their behaviour is unknown.
- Whether an interactive (non-`-p`) session behaves like the headless one.
  Every trigger number here is headless.
- Cold-prompt compliance beyond n=3, and any prompt phrasing between "cold"
  and the 4/4 directive phrasing. The 1-in-3 rate is an existence proof of
  unreliability, not a measured rate.
- Whether a conductor's own agent profile changes compliance — all runs used
  the default profile, none under `flywheel-bolt-conductor`.
- `TaskStop` / per-agent skip from `/workflows`, so operator interruption is
  unverified.
- Anything at bolt scale: largest fan-out here was 3 agents in one phase.
- Whether workflow agents inherit MCP tools or repo hooks.

## Feeds

- The decision on whether the loop layer's text lives in `apply.instruction`
  — **yes, it can**, with a start-prompt or verification requirement
  attached.
- The decision on rule 1 and the `Agent` tool — needs amending for workflows
  or needs herdr-launched phases; the evidence for both sides is above.
- Any bolt scoped around the loop layer should not be scoped until the rule 1
  question is decided, since it determines what a workflow phase may spawn.
