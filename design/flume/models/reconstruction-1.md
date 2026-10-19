# flume: a model from the statement

Built from `requirements.md` alone. Clause numbers in parentheses are its numbered clauses; `C.n` its Part C tables; `S<n>` its scenarios; `Q10.<n>` the n-th question of its section 10. Where the statement names a tool (git, worktrunk, sluice, OpenSpec, Claude Code, herdr, TOML) it is used only as the statement defines it; what had to be assumed of one is a question at the end.

## The form

The statement is satisfied by a combination of three forms, each forced by a group of clauses:

- **A data model**, because what flume does for a launch is a function of fixed records: the launch (7, 8), the kind as it resolved (19, 21, 23), the place's stages with their start counts (48, 56), and the five deliverable forms (24). Status is a projection of these plus live reads (56, 58).
- **State machines**, one per stage and one per place, because the statement enumerates stage states as a closed list (130–132 of the vocabulary: *stage state*) and fixes which events move between them (12, 38, 40–47, 49–52), and because a place's life has fixed phases ending in removal or a named keep (2, 63–68).
- **Ports and adapters**, because Part B names seven seams with operations and a guarantee each (78–104), Part C binds each with a profile, and 105 says the seams bind per host or per repository and "Parts A and B do not change to admit a profile". The core is written against the ports; every profile is an adapter.

With one small **delivery protocol** inside the agent/terminal port, because a prompt and a tell have a fixed handshake with a bound and a second sending (37, 38, 53, 54) that is neither a state of a record nor a port operation on its own.

Rejected:

- **Event log as the primary record.** 62 says flume keeps only live state and nothing of a tidied place; 58 says every fact of a deliverable, change or submission is read where it lives when asked, "never from a record of its own". A log would be a record flume may not answer from, and the only history the statement wants is a start count (48, 56).
- **Protocol as the primary form.** The seams are operations with pre- and post-conditions (83, 85, 87, 93, 98, 101, 104), not a wire exchange; only prompt delivery (38) is protocol-shaped.
- **Deployment.** flume is one host, one binary, one store (1, section 8 non-goals, section 9); there is nothing to deploy across, and 105 settles the binding per host and per repository.
- **Pure derivation / function.** Tempting from 58 and 77 (re-read everything on return), but the start count, the retry's words, the stop-short words, a stage's on-hold and stopped-by-caller states and the stage's start instant (25: "since its stage started") exist nowhere but in held state, so a record is required (73, 76).

## 1. Shape

```
  callers: operator · millpond · headwater · sounding · crew          (2, 69)
     │            │             │            │           │
     ▼            ▼             ▼            ▼           ▼
  ┌──────────────┐  ┌────────────────────────┐  ┌──────────────────────┐
  │ command line │  │ Claude Code plugin     │  │ herdr plugin         │   surfaces (60, 72, §9)
  │ launch status│  │ /launch · status (MCP) │  │ sidebar · keys       │
  │ tell stop …  │  └───────────┬────────────┘  └──────────┬───────────┘
  └──────┬───────┘              │                          │
         └──────────────────────┼──────────────────────────┘
                                ▼
            ┌───────────────────────────────────────────────┐
            │                   CORE (one)                  │  (60)
            │  launch · retry · tell · stop · drop · tidy   │
            │  status · prompt-render · needs               │
            │  reconcile(place) run by the host's ticker    │  (46)
            └──┬──────┬───────┬──────┬───────┬──────┬───────┘
   seams (B)   │place │kinds  │change│agent  │term. │merge q.│ store
               ▼      ▼       ▼      ▼       ▼      ▼        ▼
   profiles  worktrunk flume  OpenSpec Claude  herdr  sluice   $XDG_STATE_HOME/flume
   (C)       git-wt    TOML            Code   printed          (one per place, versioned)
             ─────── per repository (105) ───┘ └─ per host ─┘  per stage ─┘
                                                        (agent: per stage, 105)
            ─────────────────────────────────────────────────
   the host's git: repository ⊃ { main worktree, places/<kind>--<name> … }   (9, §9)
```

The invariant at the centre, from which every stage transition is read (I1, 25, 39, 41):

```
stage ends  ⇔  ( deliverable(stage) exists, every fact of it read at ONE head H of the
                 place's branch, and made since the stage's start )  ∧  agent quiet
             ∨  ( the current stage's agent said `needs <words>` )

and nothing else: not a quiet terminal, not an ended turn, not a closed pane, not a tell.
```

And the ownership line (I3, I6, 70, 71): flume moves one branch per place, twice (make, remove-branch); everything that lands goes through the merge queue by the agent's hand; what to launch and when a held stage starts is the caller's.

## 2. Values and records

### 2.1 Launch (73–75 of the vocabulary; 2, 7, 8)

```
Launch {
  repository : path on the host                      (2)
  kind       : kind name                             (2, 19)
  brief?     : text, verbatim                        (5; optional per S22 — see Q24)
  name       : text; must give a branch git accepts  (C.1 last paragraph)
  base?      : branch name; default the repository's shared branch (vocab base)
  settings?  : { <stage name>: AgentSettings }       (7, 32)
  holds?     : set of stage names                    (7, 47)
  mark?      : text, opaque to flume                 (7)
  kinds?     : a declaration the launch carries      (19, C.2: `--kinds <file>`)
}
AgentSettings { program?, model?, instructions?, environment?: {k:v}, terminal?: session name }  (vocab settings)
```

### 2.2 Kind and stage declarations (18, 22, 23, C.2)

```
Declaration { source: launch | repository | flume, origin: file path or "built-in", kinds: {name: Kind} }
Kind {
  name, branchPrefix (default = name), startsUnready: bool (default false),
  stages: [Stage]   (one or more, ordered)
}
Stage {
  name, prompt: text (read and inlined at launch, path relative to the declaration file),
  deliverable: Commits | ChangeWritten | TasksTicked | Report{path} | Landing{archived: bool},
  quietLimit?: duration, agent?: AgentSettings, wait: bool (default false)
}
```

"Nothing else a declaration holds changes what flume does" (23): unknown keys are kept for status and ignored.

flume's own declaration (22, C.2 table), fixed:

| kind | prefix | startsUnready | stages |
|---|---|---|---|
| fix | `fix` | yes | `code`→commits; `submit`→landing |
| change | `change` | no | `construct`→change; `code`→tasks; `verify`→report `{{state}}/verify-<n>.md`; `submit`→landing:archived |
| question | `sounding` | no | `round`→report `conclusion.md` |

### 2.3 Place record, the unit of held state (76, 56)

```
Place {
  key        : { repository, kind, name }            unique among live places (3)
  repoId     : short id derived from the repository's common git directory (for identities, 33)
  branch     : "<prefix>/<name>"                     (9, C.1)
  location   : "<repository>/places/<kind>--<name>"  (C.1)
  base, baseRev: the base's revision the place was cut from (9)
  declaration: Declaration snapshot, the kind inlined with its prompts (21)
  brief?, mark?, settings, holds                      (7, 8)
  readiness  : { steps: [{name, ok, words}], failedStep?: name }   (12, 79)
  stages     : [StageRec], in the kind's order
  phase      : making | live | over | kept             (2, 63–68)
  over?      : { by: landed{commit} | dropped{at, forced} }
  kept?      : { why: uncommitted | untracked | lock | teardown{step, words} | unreadable, names: [..] }  (65, 66, 68)
  bound      : seconds, the reconcile cadence status states (46)
  version    : store version (102, 103)
}
StageRec {
  name
  state      : not-reached | on-hold | waiting-readiness | started | begun | never-begun |
               stuck | lost | stopped | delivered | ended-short | refused        (vocab stage state; `refused` added, see Q25)
  starts     : count of agents ever started for this stage (48)
  attempt?   : {                                         the live or last attempt
     startedAt, startHead: commit at start               (25: "since the stage started")
     words?   : the retry's words                        (49)
     agent    : { identity, resolved: {program, model, instructions}, terminal: handle, record: agent-record ref }
     prompt   : { text, sendings: 0|1|2, receivedAt? }   (38)
     quietSince?                                         (44)
     agentEnded: bool                                    (40: delivered, then agent ended)
  }
  end?       : delivered{ what: head | reportPath | landedCommit, at } | short{ words, at }   (43)
}
```

Nothing of a deliverable, a change or a submission is cached in `Place` (58); `end.what` is what was reported at the moment of ending (43), kept so a caller that was not watching can read it, and is labelled as of that moment.

### 2.4 Identity (33)

`flume:<repoId>:<kind>--<name>:<stage>:<starts>` — names the place and the stage, differs per attempt, and is unique on the host among live agents because at most one agent per place is live (30) and `starts` never repeats. The `<repoId>` is needed because two repositories on one host may both have a `fix/x` (33 says "on the host").

### 2.5 Deliverable values (24)

| form | the facts, all read at one head H (25) | "since start" |
|---|---|---|
| commits | H and the set `commits(H) \ commits(startHead)` | that set is non-empty |
| change written | `read-change(H, name)`: exists ∧ planningComplete | the newest commit on H touching the change is in `commits(H) \ commits(startHead)` |
| tasks ticked | `read-change(H, name)`: tasks non-empty ∧ all ticked | the commit that ticked the last one is since start (same test) |
| report | the file at the resolved path exists | its write time > `startedAt`, or it did not exist at start |
| landing | `read-submission(repo, branch)` = landed{commit L} ∧ (archived ⇒ `read-change(L, name).archived`) | the submission's landed time > `startedAt` |

## 3. Derivations and decisions

### 3.1 Kind resolution (4, 19, 20, 21)

```
resolveKind(launch):
  decls = [launch.kinds?, read-kinds(repo, baseRev), flume.builtin]         # in that precedence (19)
  for d in decls:  if d holds launch.kind: return snapshot(d, launch.kind)  # prompts inlined (21)
  refuse "kind <kind> resolves to no declaration"                          # (4), nothing made
```
`read-kinds` that "could not be read" (84) with the launch not carrying the kind: refuse naming the kind and the reason (4). A kind whose deliverable form flume cannot read (a sixth form, a `report:` with a part it cannot fill at launch): refuse naming the kind (4).

### 3.2 Base revision and branch (9, C.1)

```
baseRev  = landsOnRemote(repo) ? (fetch origin; rev-parse origin/<base>) : rev-parse <base>
branch   = "<kind.branchPrefix>/<name>";  refuse if git check-ref-format refuses it
location = "<repository>/places/<kind>--<name>"
```
`landsOnRemote` is the merge-queue profile's to say (C.1 "when the repository's merge queue lands on a remote"); see Q23 for where that is read.

### 3.3 Launch refusals (2, 3, 4, 27)

Refuse, naming what stands, when: a live place has the same key; `branch` exists; anything exists at `location`; the kind reads a change (any stage's deliverable is change, tasks or landing:archived) and `read-change(baseRev, name)` exists, open or archived; the kind is unresolved; a `holds` or `settings` key names no stage of the kind; the fetch fails (Q54); a stage prompt asks for `{{brief}}` and the launch gave none (27, S22 — refused at the stage; the launch refuses up front only for parts known never to be fillable later, Q25). A refused launch leaves nothing (2): the order of making in 4.1 guarantees it.

### 3.4 A deliverable counting (24, 25)

```
deliverable(place, stage) -> Some(what) | None | Unreadable:
  H = head(place.branch)                                 # ONE read; every fact below uses H
  match stage.deliverable:
    Commits:       new = commits(H) - commits(attempt.startHead); new≠∅ ? Some(head=H) : None
    ChangeWritten: c = read-change(H, place.name); c.exists ∧ c.planningComplete ∧ changeCommitSince(H) ? Some(head=H) : None
    TasksTicked:   c = read-change(H, place.name); c.exists ∧ c.tasks≠∅ ∧ ∀t ticked ∧ changeCommitSince(H) ? Some(head=H) : None
    Report{p}:     f = resolve(p); exists(f) ∧ writtenSince(f, attempt.startedAt) ? Some(report=f) : None
    Landing{arch}: s = read-submission(repo, place.branch)
                   s = CouldNotRead ? Unreadable
                   : s = landed{L, at} ∧ at > startedAt ∧ (¬arch ∨ read-change(L, name).archived) ? Some(landed=L) : None
```
`changeCommitSince(H)`: the newest commit reachable from H that touches the change's folder is not reachable from `startHead`. A read at H is never paired with a read at a later head (25): if the branch moves while reading, the result is discarded and read again.

### 3.5 Agent state and quiet (vocab *agent state*, *quiet*; 31, 40, 44, 91, 96)

```
agentState(a) = terminal.state(a) ∈ {working, waiting, stopped, unknown}, with
                asking = agent.asking(a)                     # the agent record's mark, never the terminal alone (C.4, C.5)
quiet(a)      = agentState(a) ∈ {waiting, stopped} ∧ ¬asking(a) ∧ agent.own-work(a) = none
```
`own-work = unknown` or `state = unknown` ⇒ not quiet (Q8): flume never ends what it cannot read to be quiet (31), and a stage with an unreadable agent is neither ended nor stuck; status names what it cannot read.

### 3.6 Stuck and lost (44, 45)

```
stuck(stage) = attempt live ∧ quiet(agent) ∧ agentState ≠ stopped ∧ deliverable = None ∧ no stop-short
               ∧ now − attempt.quietSince > (stage.quietLimit ?? flume.defaultQuiet)
lost(stage)  = agentState = stopped ∧ deliverable = None ∧ no stop-short
```
`quietSince` is set when flume first reads the agent quiet after the stage began and cleared when it reads it working, asking, with own work, or when `head(branch)` changes (Q7). Asking is never stuck (44). A deliverable that appears ends a stuck stage as any other.

### 3.7 Prompt delivery, received or sent again (37, 38, 89, 95)

```
deliver(agent, text, bound):
  wait until agentState = waiting ∧ ¬asking            # never into a question (37), never interrupts (54)
  if agent.received(text): return Received             # never send what was received (38)
  terminal.send(text) or return Refused
  within bound: if agent.received(text): return Received
  terminal.send(text) or return Refused                # the one second sending
  within bound: if agent.received(text): return Received
  return NotReceived
```
For a stage's prompt: `NotReceived` ⇒ stage state `never-begun`. For a tell: `Refused`/`NotReceived` ⇒ the tell is refused with nothing typed (54); `send`'s guarantee is that nothing is left typed for a hand (95). A terminal whose `send` is refused (C.5 printed command) gets one sending only, inside the command, so a prompt not received by the bound is `never-begun` (C.5 row; conflicts with "sends it once more" in 38 — Q17).

### 3.8 Prompt rendering (27, 28, 29, C.2)

Parts and their sources:

| part | from | empty ⇒ |
|---|---|---|
| `{{brief}}` | launch | refuse the stage, naming `brief` (S22) |
| `{{name}}` `{{kind}}` `{{stage}}` `{{branch}}` `{{base}}` `{{place}}` | place | never empty |
| `{{change}}` | `openspec/changes/<name>` under the place (Q52) | never empty |
| `{{report}}` | the stage's resolved report path | refuse if the stage has no report deliverable |
| `{{words}}` | the retry | refuse when bare and no retry words; `{{#words}}…{{/words}}` renders nothing |
| `{{unready}}` | readiness's failed step and words (12) | refuse when bare and readiness did not fail; use the section form |
| `{{needs}}` | `flume needs "<words>"` with the identity (C.4) | never empty; every prompt must contain it (28) |
| `{{submit}}` | `how-to-submit(place)` = `wt submit <base>` (C.6) | refuse if the stage's deliverable is not landing and the part is asked (defensible either way; Q25) |

`flume prompt <place> <stage>` renders the same text and starts nothing (29). A stage prompt lacking `{{needs}}` is a declaration flume cannot run: refuse at launch (28, 4).

### 3.9 Settings resolution (32)

`resolved(stage) = launch.settings[stage] ⊕ stage.agent ⊕ flume.default`, field by field, first non-empty wins; `environment` merges with the launch's over the declaration's. The host's own configuration of the agent program is overridden on the command line (C.4: `--model`, `--append-system-prompt`).

### 3.10 Work over and tidy (63–68, 80–82)

```
over(place)  = place.over ≠ none           # set by: landing deliverable read landed (63), or drop (52)
tidy(place):                               # run by reconcile and by `flume tidy`
  if ¬over: return NotOver
  if any agent of the place is live: return AgentLive                   (64)
  r = place.read(place)                                                   (80)
  if r.uncommittedChange ∨ r.untrackedFile ∨ r.lock: keep(why, names); return Kept   (65)
  place.remove(place) or keep(teardown{step, words}); return Kept         (66, 81)
  place.remove-branch(branch, base) → Removed | Kept{commits}             (67, 82)
  if branch kept: status names it (the record stays until the branch is gone? — no: 62) → record the branch's keep in the answer, then
  delete the place's folder under the store and the place record         (62, C.7)
```
Where `over` cannot be read because the merge queue could not be read (99), nothing is removed (68). The branch kept under 67 outlives the record (62): the tidy's answer names it, and the caller keeps it (Q16 settles the consequence: a relaunch with the same name is refused until a hand removes the branch, 3).

The `git cherry` test (C.1) is the "judged by the change each commit makes, never by ancestry alone" of 67: a commit whose patch the base holds under another hash (landed squashed, or inside another place's landing) counts as held.

### 3.11 Reconcile, the one place where stages move (40, 44, 45, 46)

```
reconcile(place):               # safe to repeat (74); per-place CAS (75)
  if place.phase = making: finish or undo the launch (4.1 step order)
  if place.phase ∈ {over, kept}: tidy(place); return
  s = current stage; a = s.attempt
  if s.state = started:         # waiting on the agent coming up
      if agentState(a) = stopped: s.state = lost; return
      if agentState(a) = waiting ∧ ¬asking: deliver prompt (3.7) → begun | never-begun
      return
  if s.state ∈ {begun, stuck, delivered ∧ ¬agentEnded}:
      d = deliverable(place, s)
      if a.shortWords: s.state = ended-short (set by `needs`, 5.9) ; return
      if agentState(a) = stopped ∧ d = None: s.state = lost; return
      if d = Some(what):
          s.state = delivered; s.end = delivered{what}
          if s.deliverable is Landing ∧ landed: place.over = landed{L}       (63)
          if quiet(a): terminal.close(a) → ok ? a.agentEnded = true : report failure (31)
          if a.agentEnded ∧ ¬over(place) ∧ s not last:
              n = next stage; n.state = (n in holds ∨ n.wait) ? on-hold : start(n)   (40, 47)
          return
      if stuck(s): s.state = stuck else if s.state = stuck: s.state = begun   (44)
```
A place's reconcile never reads or writes another place (17). The ticker runs `reconcile` over every live place every `bound` seconds and at once after any act on the place; a caller's ask only shortens the wait (46).

### 3.12 Start a stage (29, 30, 32, 33, 35)

```
start(place, stage, words?):
  refuse if any agent of the place is live                         (30)
  text = render(stage, place, words)  or refuse naming the part    (27)
  stage.starts += 1
  identity = "flume:<repoId>:<kind>--<name>:<stage>:<starts>"
  cmd = agent.command(resolved(stage), place, identity, text)
  h = terminal.open(place, cmd, identity)  or refuse               (94, 98)
  stage.attempt = { startedAt: now, startHead: head(branch), words, agent{identity, resolved, h}, prompt{text, sendings: 0} }
  stage.state = started
```
The start is judged by the terminal and the agent record showing the agent (35): until they do, status says agent state `unknown`, never failed (S5). Readiness failure on the first stage: `waiting-readiness` unless `startsUnready`, in which case start with `{{unready}}` filled (12).

## 4. Operations

Every operation reads the store, acts, and writes with the version read (102, 103); a failed write re-reads and re-decides (75). Every answer is one JSON document of a form that only gains fields (61).

### 4.1 launch (1–8)

Preconditions: 3.3. Effects, in this order so a failure at any step leaves nothing (2, 76):

1. Resolve kind, branch, location, baseRev; render every stage's prompt as far as the launch can fill it (3.8); check 3.3.
2. Store: create the record with `phase: making` — an atomic create that fails if the key exists (75; S11's loser fails here or at step 3).
3. `place.make(repo, baseRev, branch, location)`; on refusal, delete the record and refuse naming what stands.
4. `place.ready(place)`: record each step; stop at the first failure.
5. First stage: `on-hold` if in `holds` or `wait`; else `waiting-readiness` if readiness failed and `¬startsUnready`; else `start`.
6. Store: `phase: live`; answer with the place's record and the first stage's state. No wait on the agent (6).

Crash between 2 and 6: on return (77) a `making` record with no worktree is deleted; one with a worktree continues from the step its record reached.

### 4.2 status (56–62)

Preconditions: none. Effects: none (57). For each place (or the one asked): the record, plus live reads at one head per place: `deliverable(place, current)`, `read-change(H, name)` tasks, `read-submission`, `agentState`, `asking`, `own-work`, `stuck`, with each read's failure named rather than guessed. The same core function serves all three surfaces (60).

### 4.3 tell (53–55)

Preconditions: the place has a live agent; it is not asking (refuse with nothing typed); words non-empty. Effects: `deliver(agent, words, bound)` per 3.7, waiting for `waiting`; `Received` ⇒ done; else refused with nothing typed. No stage field changes (55).

### 4.4 stop (51)

Preconditions: the place has a live agent (none ⇒ already done, 74). If `¬quiet(agent)` and not forced ⇒ refuse naming the agent's state. Effects: `terminal.close(agent)`; refusal ⇒ reported as failure (31). Stage state `stopped`; nothing else moves (S20).

### 4.5 retry (47–50)

Preconditions: place not over (50; refuse naming the place, S21); the named stage (default: current) is a stage of the kind; words may be empty unless the prompt needs them (27). If a live agent: close it under the stop's rules (50; forced ends a non-quiet one). Effects: every stage after the named one returns to `not-reached` with its `end` cleared (starts kept); `start(place, stage, words)`; readiness is re-run first when the named stage is the first and readiness had failed (Q11). A stage on hold starts only this way (47).

### 4.6 drop (52)

Preconditions: place live; a live agent not quiet is ended only when forced (else refuse). Effects: `place.over = dropped{at, forced}`; close the agent; nothing more starts; reconcile tidies (3.10). A second drop changes nothing (74).

### 4.7 tidy (63–68)

Runs 3.10 now for one place or all; the answer names each place removed, kept (with why) or not over.

### 4.8 prompt (29)

Renders `render(stage, place, words?)` and prints it; writes nothing; refuses naming the part when one is empty.

### 4.9 needs, the agent's stop-short (36, 41, 92, C.4)

Preconditions: the caller carries `FLUME_AGENT`; it equals the identity of the place's current stage's live attempt (any other ⇒ refused, 41); words non-empty. Effects: `attempt.shortWords = words`; the stage becomes `ended-short` at once (reconcile also reads it); the agent is not ended by this (it may keep running; the place waits for a retry or drop, 42, and a retry's close applies 31).

## 5. Seams as ports, and what each profile binds

| port (B) | operations | guarantee | profile (C) binds |
|---|---|---|---|
| place (78–83) | make, ready, read, remove, remove-branch | make touches nothing existing; all-or-nothing | **worktrunk**: `wt switch --create <branch> --base <rev> --no-cd` at `<repo>/places/<kind>--<name>`, create hooks run; ready = `.config/sluice.toml`'s toolchain then runner setup in sluice's cleaned environment; read = `git status --porcelain=v2` + `git worktree list --porcelain` for a lock; remove = `wt remove --no-delete-branch` (pre/post-remove hooks); remove-branch = `git cherry <base> <branch>` then `git branch -D` when no `+` line. **git worktree**: `git worktree add -b`, same ready/read/branch, `git worktree remove`, no teardown |
| kinds (84–85) | read-kinds | same revision ⇒ same kinds; pure | **flume TOML**: `.config/flume.toml` at baseRev; a launch's file; built-in; prompt paths relative to the file |
| change (86–87) | read-change | pure per revision | **OpenSpec**: `openspec/changes/<name>/` present; `openspec status --change <name> --json`.isPlanningComplete; tasks = `- [ ]`/`- [x]` lines of `tasks.md`; archived = `openspec/changes/archive/<date>-<name>/`; spec-driven schema read from files, others through `openspec` (59) |
| agent (88–93) | command, received, asking, own-work, stop-short | answers are the agent's own record; else unknown | **Claude Code**: `claude` with `--model`, `--append-system-prompt`, env `FLUME_AGENT`/`FLUME_PLACE`/`FLUME_STAGE`; received = transcript holds the prompt as a user turn; asking = flume's hook's mark until the transcript holds the answer; own-work = background tasks started and not finished in the transcript; stop-short = `flume needs "<words>"` |
| terminal (94–98) | open, send, state, close | open never doubles a live identity; close never lies | **herdr**: pane in the named session (flume's own by default), tab `<kind>--<name>`, pane+agent named by identity; send = herdr's prompt then `received`; state = working→working, idle→waiting, done→stopped, blocked→asking only with the agent's mark; close = end pane + process group, read it gone. **printed command**: command printed with the prompt in it; send refused; state from the agent record alone; close refused unless the record says the session ended |
| merge queue (99–101) | read-submission, how-to-submit | landed only when the queue landed that branch | **sluice**: `sluice status <base> --json`, newest entry from the branch; landed with `Sluice-*` trailers naming the commit; how-to-submit = `wt submit <base>` |
| store (102–104) | read, write (CAS) | nothing in repository content; one store per host | **state directory**: `$XDG_STATE_HOME/flume/`, one document per place with a version beside it; write = new file beside, rename over, under a lock |

Binding (105): terminal and store once per host; place, kinds, change and merge queue once per repository; agent per stage from its settings. Adding a kind is a TOML table (C.2); adding an agent program is a new agent adapter chosen by `settings.program`; adding a terminal is a new terminal adapter chosen per host. The conformance suite (106) runs sections 8 and 10's scenarios against each adapter, each scenario citing its clauses, and fails when a clause is cited by nothing (section 12).

## 6. Storage (C.7, 73–77, 102–104)

```
$XDG_STATE_HOME/flume/                      (~/.local/state/flume/)
  lock                                      the write lock (C.7)
  places/<repoId>/<kind>--<name>/
    place.json                              the Place record; `version` inside it
    place.json.tmp-<pid>                    written then renamed over place.json
    files/                                  the place's own folder, `{{state}}` (C.2, C.7): verify-<n>.md …
  host.json                                 the host's bindings: terminal profile, flume's herdr session, bound, default quiet
```
`read` returns every `place.json` with its version; `write(version, next)` takes the lock, re-reads the version, refuses if changed, writes beside and renames (103). Creating a place is `O_EXCL` on its folder (75, S11). Removing a place deletes its folder last (62). Nothing is under a repository (73, 104). All flume processes on the host share it (104); the ticker and a CLI invocation serialise through the lock and the version.

## 7. Lifecycles

### 7.1 A place

```
            launch                                 landing read landed (63) / drop (52)
 (none) ───────────► making ──► live ─────────────────────────────────────► over
            │ refuse   │ make/ready            ▲                               │ tidy (3.10)
            ▼          │ fails: undo           │ retry (not over)              ▼
         (none) ◄──────┘                       │                ┌─────────┬─────────────┐
                                               │                ▼         ▼             ▼
                                        (stages run)        removed    kept{why}   not removed
                                                            (record     (record     (unreadable, 68;
                                                             gone, 62)  stays,      tried again)
                                                                        tidy again
                                                                        on ask)
```
A `question` place whose one stage delivered stays `live` until dropped (S18): nothing lands, so nothing is over.

### 7.2 A stage

```
                    launch / previous delivered & agent ended (40)
 not-reached ─────┬────────────────────────► started ──prompt received (38)──► begun
                  │ in holds / wait (47)        │ ▲                              │
                  ├──► on-hold ──retry──────────┘ │                              │
                  │ readiness failed, ¬unready(12)│                              │
                  └──► waiting-readiness ─retry───┘                              │
                                                                                  │
   started ──two sendings not received──► never-begun ──retry──► started         │
   started ──agent stopped──────────────► lost ──retry──► started                │
                                                                                  │
   begun ◄─────────────── activity, head moved ─────────────── stuck             │
   begun ──quiet past limit, nothing delivered/said (44)──► stuck                │
   begun|stuck ──deliverable exists (24,25)──► delivered ──agent quiet──► (agent ended, next stage)
   begun|stuck ──`needs` from this agent (41)──► ended-short ──retry──► started
   begun|stuck ──agent stopped, nothing delivered/said (45,77)──► lost
   any with a live agent ──stop (51)──► stopped ──retry──► started
   any ──render refuses a part (27)──► refused ──retry (with words)──► started
   delivered ──retry naming it (49)──► started  (stages after it → not-reached)
   any ──drop (52)──► (frozen; agent ended; place over)
```
Holds: `on-hold` is entered only from `not-reached` when the stage is reached (40) or at launch (2). A tell changes no edge (55). The `delivered` state has two moments: deliverable read (status: `deliverable: true`, `state: delivered`) and the agent ended (`agentEnded: true`), after which the next stage starts; between them the agent may still be working or on own work (S1: "goes quiet once the run passes").

### 7.3 An agent (per attempt)

`unknown → waiting → (working ↔ waiting ↔ asking)* → stopped`, read, never driven, except `close` (31) and the two answers flume gives (34: folder trust only).

## 8. Concurrency (30, 74, 75, 104)

- All mutation goes through `write(version)`; a loser re-reads and re-decides, so two acts on one place leave it as one or the other would (75).
- Place creation is an atomic create on the key's folder (4.1 step 2), so of two simultaneous launches with one key exactly one proceeds (S11); the second guard is `make`'s own refusal of an existing branch or location (83).
- One agent per place is enforced twice: `start` refuses while an attempt is live (30), and `terminal.open` refuses a live identity (98).
- The ticker and any number of CLI, MCP and sidebar invocations may run `reconcile` on the same place at once; each is idempotent (74): starting a stage already started is a no-op because the record shows the attempt; sending a prompt already received is skipped (38); closing a stopped agent is a no-op; tidying a removed place finds no record.
- Across places nothing is shared but the store lock, held only for a write (17, 70): there is no scheduler, queue or cap.
- Reads for status are per place and parallel; each place's facts are read at one head (25, 58).

## 9. Surfaces (60, 61, 72, section 9)

| surface | gives | notes |
|---|---|---|
| command line | `flume launch|status|tell|stop|retry|drop|tidy|prompt`, `flume needs` for an agent, `--json` on every one | the reference surface; the other two call the same core |
| Claude Code plugin | `/launch <brief>` in any session; `status` over MCP | `/launch` names the session's repository; the brief is the slash command's text, verbatim (5) |
| herdr plugin | sidebar: every place with kind, stage, agent state, tasks ticked; keys: open pane, tell, stop, retry | reads `status --json`; writes nothing of its own (60) |

Every surface shows only what flume reports when asked (72); none computes an end, a status or a tidy (60). The ticker (3.11) is the one resident process; which surface or system service hosts it is Q1.

## 10. Worked example

Host `atlas`, `$XDG_STATE_HOME=/home/op/.local/state`. Repository `/home/op/code/acme`, `repoId = acme-7d1e`, shared branch `main`, remote `origin`; its merge queue (sluice) lands on the remote. `.config/flume.toml` at `origin/main` declares one kind, `bump` (the C.2 sample). `.config/sluice.toml` declares two readiness steps, `toolchain` and `setup`. flume's herdr session is `flume`; bound 15 s; default quiet 30 m.

### 10.1 S1 — headwater's fix lands

```
10:00:00 launch{repository:/home/op/code/acme, kind:fix, name:serde-1.0.219,
               brief:"Bump serde to 1.0.219 (release notes: …)", mark:"headwater release=serde-1.0.219"}
  fetch origin → origin/main = 3f9c2a1; read-kinds(3f9c2a1) = {bump}; fix → flume's own (19)
  branch fix/serde-1.0.219 ok; location /home/op/code/acme/places/fix--serde-1.0.219 absent; no live key; fix reads no change
  store: create places/acme-7d1e/fix--serde-1.0.219/place.json v1 {phase: making}
  make: wt switch --create fix/serde-1.0.219 --base 3f9c2a1 --no-cd      → worktree at location
  ready: toolchain ok ("rust 1.82 present"); setup ok ("deps fetched")
  start(code): identity flume:acme-7d1e:fix--serde-1.0.219:code:1
     render: brief ✓ needs ✓ (no {{words}} bare)      startHead 3f9c2a1  startedAt 10:00:07
     open: herdr session flume, tab fix--serde-1.0.219, pane named by identity
  store v2 {phase: live, stages: [code: started ×1, submit: not-reached]}
10:00:07 launch answers (JSON) — agent state unknown; no wait (6)
10:00:35 tick: state waiting, not asking → send prompt → 10:00:40 received → code: begun
10:04:12 agent commits 8a4d0e2 "chore(deps): bump serde to 1.0.219", starts `cargo test` as a background task, ends its turn
10:04:15 tick: H=8a4d0e2; commits(H)\commits(3f9c2a1)={8a4d0e2} → deliverable Some(head 8a4d0e2);
         own-work running → not quiet → code: delivered, agentEnded false (status: deliverable true, agent waiting on own work)
10:11:02 run passes; agent ends turn; tick: quiet → close(code:1) ok → agentEnded; submit not in holds →
         start(submit): identity …:submit:1, prompt carries {{submit}} = `wt submit main`; startedAt 10:11:05
10:12:30 agent runs wt submit main; sluice status main --json: entry {branch fix/serde-1.0.219, state waiting}
10:13:00 status: submit begun, deliverable false, submission {state: under test}
10:25:40 sluice lands it as c0ffee1 (trailers name fix/serde-1.0.219); tick: read-submission = landed{c0ffee1, 10:25:40 > 10:11:05}
         → submit delivered{landed c0ffee1}; place.over = landed{c0ffee1}; agent quiet → close ok
10:25:55 tick: tidy: no live agent; read: clean, no lock; wt remove --no-delete-branch (hooks run);
         git cherry main fix/serde-1.0.219 → "- 8a4d0e2" (no +) → git branch -D fix/serde-1.0.219;
         delete files/ and place.json. status no longer lists the place (62); headwater kept nothing (§9 table)
```

### 10.2 S2 — millpond's change, all four stages

```
launch{kind: change, name: rate-limit-headers, brief: <item ITM-412's text>, mark: "millpond item=ITM-412 send=2"}
  base 3f9c2a1; read-change(3f9c2a1, rate-limit-headers) = absent (3 ok); branch change/rate-limit-headers
construct:1  startHead 3f9c2a1. Agent commits 5e1a9b0 adding openspec/changes/rate-limit-headers/{proposal,design,tasks}.md (5 tasks, none ticked)
  tick: H=5e1a9b0; read-change(H): exists, isPlanningComplete true, newest change commit 5e1a9b0 ∉ commits(3f9c2a1) → delivered; quiet → close → start code:1 (startHead 5e1a9b0)
code:1       commits 7c2…, 9d4… tick two tasks → status: tasks 2/5, deliverable false; … 4 commits later head b61…, 5/5
  tick: all ticked, newest change commit b61… since 5e1a9b0 → delivered; quiet → close → start verify:1
verify:1     report path = {{state}}/verify-1.md = /home/op/.local/state/flume/places/acme-7d1e/change--rate-limit-headers/files/verify-1.md
  agent writes it 11:40:12 (> startedAt 11:31:00) → delivered → start submit:1 (prompt: archive the change on the branch, then `wt submit main`)
submit:1     agent commits the archive move to openspec/changes/archive/2026-10-17-rate-limit-headers/, runs wt submit main
  lands as d00d5e7 at 12:03; read-change(d00d5e7, rate-limit-headers).archived = true → delivered{landed d00d5e7}; over; tidy removes place and branch
millpond read every end from status --json; no terminal (S2 last sentence)
```

### 10.3 S4 — a construct stops short, and crew retries with words

```
crew: launch{kind: unit (from --kinds /home/op/.local/share/crew/kinds.toml: construct→change, code→tasks, review→report:{{state}}/review-<n>.md, submit→landing:archived),
             name: auth-cache, brief: …, holds: {code, review, submit}, settings: {construct: {model: opus}, …}, mark: "team=swc-1 slot=2"}
construct:1 agent runs: flume needs "The brief names two designs, token bucket and sliding window; which one?"
  needs: FLUME_AGENT = flume:acme-7d1e:unit--auth-cache:construct:1 = current attempt's identity ✓ → construct: ended-short{words}; code stays on-hold (42)
status --json .stages[0] = {name: construct, state: ended-short, starts: 1, end: {short: {words: "The brief names two designs, …"}}}
conductor: flume retry /home/op/code/acme unit auth-cache --stage construct --words "Token bucket; sliding window is auth-cache-2's."
  agent construct:1 is idle, not asking, no own work → quiet → close ok; start construct:2 with {{words}} filled; startHead unchanged (no commit was made)
```

### 10.4 S6 — a tell

```
flume tell acme change rate-limit-headers "Keep the existing RateLimit middleware; add no crate."
  agent asking (hook mark open) → refused {reason: "agent is asking", typed: false}
again at 10:51:03 while working → deliver waits; 10:52:10 waiting & not asking → send → received 10:52:12 → {delivered: true}
  code:1 unchanged: state begun, starts 1
```

### 10.5 S7 — crew holds stages as an orchestrator

Two launches, `unit auth-cache` and `unit auth-cache-2`, each with `holds: {code, review, submit}`. Both constructs deliver; each place's next stage is `on-hold`; flume starts nothing (47). crew: `flume retry … auth-cache --stage code` starts `code:1` in one place. flume makes no third place; the cap and the slots are crew's (70). crew reads each end from `status --json` and marks by `mark`.

### 10.6 S9 / S18 — drops that keep a branch

`flume drop acme fix serde-tls` (agent waiting, quiet): over = dropped; close ok; tidy: read clean; `wt remove --no-delete-branch`; `git cherry main fix/serde-tls` → `+ 9b7f1e3` → branch kept; answer `{removed: true, branch: {kept: "fix/serde-tls", commits: ["9b7f1e3"]}}`; record deleted. A relaunch of `fix serde-tls` is refused "branch fix/serde-tls exists" until a hand removes it (3). sounding's `question tls-rotation`: `round:1` writes `conclusion.md` → delivered; `retry --words "<operator's notes>"` → `round:2`, `conclusion.md` rewritten (write time > start) → delivered; drop → branch `sounding/tls-rotation` with prototype commits kept and named.

### 10.7 S12 — host restart

On return the ticker reads every `place.json`; for `change rate-limit-headers` `code:1`, the terminal reports no pane under its identity and the agent record shows the session ended → `lost`; nothing starts (45, 77). crew or millpond retries.

## 11. The statement's section-10 questions

| | question | the model's answer |
|---|---|---|
| Q10.1 | own work: how read, and when unreadable | from the agent record's background tasks (C.4), never the terminal; `unknown` ⇒ not quiet: the stage neither ends nor goes stuck, and status names "own work unknown" (3.5). Carried as Q8 since the statement does not pick. |
| Q10.2 | does a deliverable send a place back | no: 48 and 49 make every return a caller's retry; a verify report's findings are a caller's to read and retry `code` on (non-goal: judging content). |
| Q10.3 | does a caller learn an end by asking or by being told | by asking status (43, 46, 72): flume tells no one; a surface shows what it reports. 43's "whoever waits on a stage" is satisfied by status carrying the end with its head, report or landing commit, or the words. |
| Q10.4 | quiet limit default and clock | not in the statement: Q7 (default 30 m from flume's first reading of quiet after the agent's last act, reset when the head moves). |
| Q10.5 | does a retry re-run readiness | not in the statement: Q11 (default: only a retry of the first stage of a place whose readiness failed, from the launch-time steps). |
| Q10.6 | terminal resumes an agent after restart | the stage's agent is the one whose identity is live in the terminal and whose agent record is the one the attempt recorded; a resumed pane that satisfies both continues the stage; else lost (77). Q14 on the record match. |
| Q10.7 | how a stop-short is known to be the agent's | `FLUME_AGENT` equal to the current attempt's identity, the attempt live (C.4, 41); anything stronger is Q15. |
| Q10.8 | a launch whose branch a dropped place left | refused until the branch goes (3: "its branch … already exists"); flume never takes it (67). Answered. |
| Q10.9 | prompt under a terminal that cannot send | one sending, inside the command (C.4, C.5); not received by the bound ⇒ never begun; no second sending exists. Conflicts with 38's "sends it once more": Q17. |
| Q10.10 | repository-declared deliverable forms | no: five forms (24), a sixth refuses the kind (4). A command that must pass is a later stage's agent's or the merge queue's (non-goals). Answered. |
| Q10.11 | several agents per stage | no: one agent per place (30), one deliverable per stage (18); parallelism is several places, a caller's (70). Answered. |
| Q10.12 | how long on hold before reported | never by flume; status shows `on-hold` with `since` (Q20 default). |
| Q10.13 | a place whose caller is gone | flume records no owner (69: the same for every caller); any caller may stop, retry or drop by key; the mark is for finding, not for ownership (7). Q21. |
| Q10.14 | status reads every deliverable at each ask | yes (58): one head per place, places in parallel, `status <place>` scoped; nothing cached. Q22 on cost. |
| Q10.15 | where a repository's binding is read | not in the statement: Q23 (blocking). |

## 12. Scenarios against the model

| | verdict | note |
|---|---|---|
| S1 | holds | 10.1; the agent's own work keeps the delivered stage from ending until quiet (40, 3.5). |
| S2 | holds | 10.2; tasks 2/5 then 5/5 from `read-change` at one head (58). |
| S3 | holds-if | own-work is readable from the agent record (C.4); if it reads `unknown`, the model still does not end or stick the stage (3.5), so the scenario holds either way, but the end at "last task ticked and quiet" needs own-work read as none. |
| S4 | holds | 10.3; `needs` accepted only from the current attempt (4.9). |
| S5 | holds | start reported `unknown` until the terminal shows the agent (35, 3.12); 3.7 sends once more; nothing typed (95). Needs the bound in 3.7 to be longer than the coming-up (Q9: the bound runs from `waiting`, not from `open`). |
| S6 | holds | 10.4. |
| S7 | holds | 10.5. |
| S8 | holds | landing is read from the merge queue's submission of the place's own branch (99, 101); another place's landing has no such entry; the place's next stage stays `on-hold`. |
| S9 | holds | 10.6; `git cherry` shows `+`. |
| S10 | holds | 3.10: `read` names the file, keep; `remove` names the step, keep. |
| S11 | holds | 8: atomic create, then `make`'s refusal; the loser's refusal names the place. |
| S12 | holds | 10.7. |
| S13 | holds | the kind is snapshotted with its prompts at launch (2.3, 3.1); a later launch reads the new base revision. |
| S14 | holds | 9: one core; the sidebar reads `status --json`; status writes nothing (57). |
| S15 | holds | 3.1 refuses before 4.1 step 2. |
| S16 | holds | 4.1 step 5: `change` → `waiting-readiness`; `fix` (`startsUnready`) starts with `{{unready}}` filled. holds-if the fix prompt uses `{{unready}}` in its section form or the launch is otherwise refused (3.8). |
| S17 | holds | 3.6, 3.11: stuck reported, not ended; a tell wakes it; the deliverable ends the stage. |
| S18 | holds | 10.6; the second `conclusion.md` counts by write time (Q3). |
| S19 | holds | `read-submission` reports `removed as the cause of a failure`; the stage goes on (39); the newest submission landed after start ends it. |
| S20 | holds | 4.4. |
| S21 | holds | 4.5 precondition. |
| S22 | holds-if | the stage is refused at its start and reported `refused` (Q25); the place may already exist when the first stage is refused unless the launch pre-renders `{{brief}}` (3.3). |

## Questions

Each is a decision the statement leaves to a builder. **blocking**: the model cannot be built the same way twice without it. **can default**: the default given is what this model takes.

1. **Who runs the autonomous move-on (46, 40, 72)?** "within a bound it states, whether or not a caller asks" needs a resident process; section 9 names one static binary and three plugins and no daemon. Options: (a) a `flume watch` process per host, started by the first launch under a lock and by the herdr plugin; (b) a system timer the operator installs; (c) only on asks (fails 46). Guessing wrong: without (a) or (b), a stage ends only when someone asks, and S1's unattended run never lands. **blocking**; this model assumes (a) and states `bound` in status.
2. **"A commit made since the stage started" (24, 25).** By committer time, or by ancestry from the head at start? An agent that amends, rebases onto the base, or resets changes either answer. Options: ancestry (`commits(H) \ commits(startHead)`), time, or both. Guessing wrong: a rebase onto a moved base makes every old commit "new" by ancestry; a clock skew makes a new commit "old" by time. **can default**: ancestry, with `startHead` recorded in the attempt.
3. **"A report written since the stage started" (24) at a path reused across retries** (`conclusion.md`, S18). Write time vs. content vs. absence at start. **can default**: write time after `startedAt`, host clock; the `verify-<n>.md` convention avoids the question for the change kind.
4. **A landing "since the stage started" (24) when the submission was made in an earlier stage** (a fix's code agent runs `wt submit` itself). Is the landing counted for the submit stage, and does the place go over before submit starts (63 vs. 40)? **can default**: over wins; a landed place starts no further stage and is tidied (3.11); the submit stage stays `not-reached`.
5. **Tasks ticked with zero tasks (24).** Vacuous truth would end `code` the instant it starts. **can default**: at least one task is required; status shows `0/0`.
6. **Which commit "makes" a change written (24).** The change's folder spans several files; "in a commit made since the stage started" — the newest commit touching the folder, or the one setting planning complete? **can default**: newest commit touching `openspec/changes/<name>/`.
7. **The quiet limit's default and its clock (44, Q10.4).** None given; C.2's example says `45m`. **can default**: 30 m from flume's first reading of quiet with nothing delivered, reset by any non-quiet reading or a head move.
8. **Own work `unknown` (91, Q10.1).** Treat as quiet (risk: ending an agent mid-run, I2) or not quiet (risk: a delivered stage that never ends until forced). **can default**: not quiet; status says so; a caller may force a retry.
9. **The prompt bound (38) and when it starts.** From `open`, or from the agent first `waiting`? S5 has a four-minute start that must not count. **can default**: 60 s per sending, from the sending.
10. **flume's own tell bound (54).** **can default**: 10 min.
11. **Does a retry re-run readiness (11, 49, Q10.5)?** 12 says a failed readiness leaves the first stage waiting, and nothing but a retry starts a waiting stage; a retry that does not re-run readiness can never clear the wait. **can default**: a retry of the first stage re-runs the launch-time readiness steps when they had failed; no other retry runs them.
12. **The git-worktree profile's location (C.1).** Only the worktrunk row gives a path. **can default**: the same `<repository>/places/<kind>--<name>`.
13. **The identity's form and the repository component (33, C.5).** Two repositories on one host may share `<kind>--<name>`; herdr's tab is named `<kind>--<name>` alone. **can default**: `flume:<repoId>:<kind>--<name>:<stage>:<n>`; tabs collide only in name, panes never.
14. **After a restart, what makes a resumed agent the stage's (35, 77, Q10.6)?** Identity in the terminal alone, or identity plus the agent record (session) the attempt recorded? A resumed pane under the same identity but a new session would be a second agent the stage never started. **can default**: both must match.
15. **Authenticating `needs` (41, 92).** `FLUME_AGENT` is an environment variable any process in the place can copy. Options: identity only; a per-attempt token; the terminal's own account of which pane ran it. **can default**: identity plus a per-attempt token in the environment, accepted while the attempt is live; a child of the agent is the agent's.
16. **A refused tidy's branch after the record goes (62, 67).** The branch outlives every record of flume's; nothing lists it. **can default**: the tidy's answer names it once; a relaunch is refused until a hand removes it (3). A `flume branches` listing of orphans would be a surface addition.
17. **38 against C.5's printed command.** 38 requires a second sending; a printed command cannot send (95 refused). The C.5 row resolves it by reporting never-begun, so the clause's "sends once more" cannot hold for that profile, and 106's suite must allow it. **can default**: the suite treats the second sending as "where `send` is not refused".
18. **Which stage state a refused stage has (27, vocab stage state).** The list has no `refused`; an unfillable part is neither lost, short nor never-begun. **can default**: add `refused{part}`, cleared by a retry whose words fill it or by nothing.
19. **When a part is checked (27, S22).** At launch for every stage (refuses the whole launch, leaving nothing) or at each stage's start (the place exists, the first stage is refused)? S22 says "the stage is refused". **can default**: launch checks what only the launch can fill (`{{brief}}`), refusing the launch; a stage checks the rest at its start.
20. **Is a brief required (2 vs. S22)?** 2 says a launch names a brief; S22 has a launch that gave none. **can default**: optional at launch; required by any stage that asks.
21. **Ownership of a place (69, 70, Q10.13).** No owner is recorded; any caller may drop another's place by key. **can default**: no ownership; the mark is informational.
22. **Status cost (58, Q10.14).** Reading each place's change through `openspec` and its submission through `sluice status` on every sidebar refresh across many repositories. Options: parallel reads per place, a scoped `status <place>`, or a short-lived read cache (which 58 forbids for the facts). **can default**: parallel, scoped, no cache; `sluice status` once per repository per ask.
23. **Where a repository's profiles are bound (105, Q10.15).** Per repository, but the C.2 TOML declares only kinds; whether `worktrunk` vs. `git worktree`, whether the queue lands on a remote (C.1), and whether OpenSpec's reader is needed are nowhere declared. Options: a `[profiles]` table in `.config/flume.toml` at the base revision; host settings keyed by repository; detection from files (`.config/wt.toml`, `.config/sluice.toml`), which 11 ("assumes no tool") leans against. Guessing wrong changes the base revision a place is cut from (9). **blocking**; this model reads a `[profiles]` table at the base revision with flume's defaults where absent.
24. **Retry naming a stage later than the current (47, 49).** crew's "starts each stage on hold with a retry" means a retry names the next stage; may it name one two ahead, skipping an undelivered stage? **can default**: allowed; flume judges nothing of order beyond 40's own starts.
25. **A `{{submit}}` or `{{report}}` asked by a stage without that deliverable (27, 28).** Refuse the stage or fill it anyway? **can default**: fill `{{submit}}` for any stage (the way exists regardless); refuse `{{report}}` where no report deliverable gives a path.
26. **The agent's base environment (11, 29, C.4).** Readiness runs with nothing of the caller's; the agent's environment is "the settings' own" beside `FLUME_*`, on top of what? **can default**: a login-shell environment of the host's user with the place as working directory, nothing of the caller's session.
27. **How flume's `asking` hook and the folder-trust answer are installed (34, C.4).** 32 says the host's configuration never chooses the agent's settings, yet a hook must be configured. **can default**: a settings file of flume's passed on the command line, holding the hook alone.
28. **Store version granularity (103, C.7).** One version per place document or one for the whole store? **can default**: per place, with an atomic create for new places.
29. **Two live places whose changes share a name (3, 26).** A `change x` and a `unit x` both read a change named `x` on different branches; once one lands, the other's `landing:archived` reads an archive it did not make. **can default**: refuse a launch whose kind reads a change while any live place of the repository with such a kind has the same name.
30. **A fetch at launch that fails (C.1, 9).** Refuse, or cut from the local base? **can default**: refuse naming the fetch, since 9 forbids a copy that may lag.
31. **What the external tools must provide, as black boxes.** Needed from sluice: how `.config/sluice.toml`'s toolchain and setup steps are read and run "in sluice's cleaned environment", and the schema of `sluice status <base> --json` (branch field, state names, landing commit, landed time). From OpenSpec: how the spec-driven schema is recognised from files, and `openspec status` output. From worktrunk: `wt switch --create … --no-cd` placing the worktree at the given path, and `wt remove --no-delete-branch`'s refusal on uncommitted changes. From herdr: a session/tab/pane API that names a pane, prompts it, reads working/idle/done/blocked, ends a process group. From Claude Code: transcript location and the user-turn form, background-task entries, hook installation, `--append-system-prompt`. From git: `cherry`, `worktree list --porcelain` locks, `check-ref-format`. **blocking** only in that each adapter cannot be written without it; the core can.

Counts: 31 questions, 3 blocking (1, 23, 31), 28 can default.
