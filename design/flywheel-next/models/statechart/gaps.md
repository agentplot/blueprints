# Gaps — requirements not satisfied, or found contradictory

By requirement number (1–169 in `requirements.md`). Each entry says what
the model does instead and why. An entry with **decision** is a judgment
the operator may reverse by a response on the file; an entry with
**open** is unsatisfied.

## Part A

- **4 — dictation that undoes or defers, never asserts.** The model
  admits a dictation only for the answers `drop`, `hold`, `release`,
  `send back`, `retire`, `takeover`, `finish`, `close`, `end` — and
  `start` and `stop` on a service, which 46 grants outright — and
  makes any other dictation `unapplicable`. "Send back to a stage"
  sends the item to the stage its type names for the current stage's
  `on_fail`, not to an arbitrary stage the operator picks. **Decision**:
  a stage chosen freely would need the operator to know the type's
  internals; the type's own send-back target is what the requirement's
  "a stage" is read to mean. `close` by dictation on an intent is
  honoured only when its close is offered (every elaboration done);
  closing an intent with running elaborations would retire design work
  the operator approved, which reads as more than deferring it.
  **Decision**. Also **open**: a direct write to the state
  store that asserts work done (S19's mechanism used the wrong way) is
  refused and reported, but the git-only profile cannot stop the commit
  from landing; it can only decline to honour it.

- **10 / S9 "offers two decisions".** S9 says the next planning
  "offers two decisions: amend the bolt, or land it and follow". The
  mockup shows one `claim-moved` decision with two answers. **Decision**:
  one decision with two answers, on the bolt, created by the citation
  region (`bolt.open[citations].moved`), not by planning. Planning
  follows the answer. A decision per answer would double-count the same
  choice in the plan's count.

- **11 "yes all".** The presenter expands `yes all` into one response
  per approve decision it delivered, each with its own id. If a
  decision was retracted between delivery and reply, that response is
  `response-unapplicable` and comes back under attention once.
  **Decision**: expansion at the presenter; the engine never sees `all`.

- **15 "given once and never reused" across re-offers.** A decision
  state that is left and re-entered — a bolt close withdrawn by new
  work and offered again, a deferred unit re-proposed — is a new
  decision with a new number, because its id carries the state's
  `entered_at`. The operator therefore sees a new number for what may
  read as the same question. **Decision**: a re-entered decision is a
  changed question; a reply meant for the old one must not land on it.
  The register keeps retracted entries thirty days so the old number
  still resolves and is reported.

- **24 with-operator "present".** Present is a human keystroke in the
  pane within 30 minutes (`herdr agent status`). There is no better
  evidence in the givens. The window is in the session binding, not
  the machine. Presence now gates nothing but a rebase and the status
  view, since the type raises no decision. **Decision**.

- **31 "a stated order".** Ready work waits ordered by (unit approval
  time, item ordinal). Elaboration sessions, planning, curation and the
  operator's own session are outside the bound: they are one session
  each and their count is small. **Decision**; if the operator wants
  them counted, the `item.slot_free` binding gains them with no machine
  change.

- **34 "replaced by planning's next proposal, silently".** A superseded
  proposal leaves the plan with no tail entry, so an operator who was
  reading the proposal sees it vanish and a new number appear. The
  register's retired entry lets a reply to the old number be reported
  as unapplicable. Stated; nothing better follows from "silently".

- **46 services belong to the bolt's place only.** The requirement
  says "every open bolt's place carries one service object per
  declaration"; the model reads that literally and instantiates
  declarations only for the operator's place, so a work item's or an
  elaboration's place has no service objects. A session that needs the
  system up in its own place starts it under 44's rule, and that
  process is its own (47); a session that needs the *bolt's* system —
  a test session running acceptance on the merged-back tree — starts
  the bolt's service through the command. **Decision**: one object per
  declaration per bolt; a per-place instantiation would multiply the
  page's service lines by the items in flight and make 47's "one
  record" ambiguous. Also **decision**: a service is never started by
  its declaration alone; the first start is always a response, so
  nothing listens on a host the operator did not ask for. A `start:
  auto` field would be a one-line change to `declare_services` if the
  operator wants it.

- **47 the command's refusal of an undeclared name.** `flywheel
  service start web` in a place whose bolt declares no `web` is refused
  with the declared names and the refusal is a thread entry, like a
  hook's. It is not carried to attention, since it is a session's
  mistake and not a machinery problem. **Decision**.

- **49 a take conflict on an intent's line.** The chore that resolves
  it is a unit owned by the intent (`unit.parent: [bolt, intent]`),
  the only unit an intent ever owns. It is the one place a construction
  object hangs off a design object. **Decision**: the alternative — a
  self-closing elaboration as the conflict job — would make the fix an
  approved elaboration nobody proposed, a worse fit for 57's "a chore
  is a unit of the chore type".

- **52 "found by reconciliation".** Stray places are found only by the
  host that holds them (`wt worktree list` is local). A host that is
  gone for good leaves its strays until it returns; the status view
  shows the host gone, not the strays. **Open** by construction: no
  other host can see that disk.

- **55 finding "about the session's own bolt".** A finding about the
  session's bolt becomes a `fast` unit in `proposed` targeting that
  bolt (S28's "routed to it as a proposal"). The requirement says "a
  proposal on the plan for that thread" without saying unit or
  elaboration. **Decision**: unit on the construction side,
  elaboration on the design side.

- **59 "the record never holds the text".** The record holds the
  document's path in the change directory and the offer entry's id.
  When the change is archived the path moves under `archive/`; the
  record's path is resolved through the archive map. Until the archive
  step is built, a record pointing into an archived change is a dangling
  path. **Open** in the OpenSpec archive binding.

- **64 the exit command and a session that never runs it.** A session
  that finishes without `flywheel exit` is idle with no exit entry; a
  self-closing type stalls it after two hours and a stage's join never
  meets. Correct, but slow. The skills instruct every session to end
  with the command; a session that forgets costs two hours. Stated.

- **66 the operator's session "with the machinery's read tools".** The
  `operator-console` agent is given the read side of the `flywheel`
  command (status, plan, the register) and the dictation grammar; it
  cannot run an effect. Whether that is enough of "the machinery's
  tools" is the operator's to say after use. **Decision**.

- **69 "evidence that the session exists".** The pane by name is the
  evidence; herdr's refusal of a duplicate name is what makes the
  retry safe. If herdr does not refuse duplicate names, the binding
  must add the check (`herdr agent status` before start). **Open**
  until verified against herdr.

- **74 two stores that disagree.** Lines and places are proven by git
  while their retry counters, endpoints and hold are in the record. The
  model says git wins. The counters can therefore be one behind after
  a crash between the git effect and the record write; the effect id
  makes the repeat harmless. Stated, not eliminated.

- **79 the bell as a sink.** `herdr surface bell` is assumed as the
  way to ring a named surface. Not verified against herdr. **Open**.

- **86 "nothing else reaches it".** A session on a built repository
  reads that repository whole; the closed set is the handed-in inputs
  plus the repository at the place. Claude Code's own context (its
  global settings, the operator's `CLAUDE.md`) also reaches it.
  **Open**: the place's settings can deny reads outside the place but
  not unload the operator's global instructions.

- **90 "only the session binding is faked".** The stand-in plays
  exits by running the same `flywheel exit|offer|refuse` path, so the
  control plane sees real entries; but the commits a scripted session
  "makes" in its place are files the stand-in writes, not an agent's
  work, so the git effects exercise merges of trivial content. Stated:
  it is what "no agent running" allows.

- **92 dictated scenarios.** The dictation-to-data step is a
  session's judgment; the model provides the schema and the runner.
  Rendering "as a trace a person reads" is `<name>.trace.md`. The
  scenario language cannot express every guard (no arbitrary
  arithmetic) — the same limit as the machines.

- **93 coexistence.** The new flywheel's objects live in
  `flywheel-state` (tracker: its own repository's issues; git-only: the
  same repository as files). It never lists issues of other
  repositories, and it never reads the current flywheel's labels or
  milestones. Places are under a distinct worktree root
  (`~/flywheel-next/places/`), which is also what bounds stray
  reconciliation. Sessions are named with a `fn/` prefix. Satisfied by
  scoping; the two share the books repository and the built
  repositories' shared lines, which they must.

- **94 one source.** Satisfied by the fenced claim block inside the
  chapter. The cost: an mdBook preprocessor
  (`mdbook-flywheel-claims`) and a pre-commit hook to write. Named,
  not built.

- **108 raw material outside version control.** The capture cites a
  `file://` or `https://` pointer. On a second host the pointer may
  not resolve; the model does not replicate raw material. Stated.

- **119 "since the operator last reviewed".** The mark is a response
  `reviewed` given on the review page; it is recorded on the
  organization's `plan` object, since there is no books object
  machine. Slight stretch of "the response is recorded with the object
  it concerns" (150).

## Part B

- **126 annotations as the response.** A plannotator annotation set
  comes back as one response (`redo: <the annotations>`, or `yes` when
  the operator approves with no annotation). Several annotation rounds
  on one document are several responses; only the first is applied to
  a `redo`, the rest are unapplicable because the decision is gone.
  **Decision**: a redo round is one response; further notes belong to
  the next proposal's review.

- **127 notify bound.** 30 seconds by poll in both profiles when no
  webhook can reach the host. A host with no reachable URL and no
  poll would not converge faster than its 60-second sweep. Stated.

- **131 single writer, tracker profile.** GitHub gives no
  compare-and-swap on an issue body. The model adds the
  lease-by-ordered-append protocol (comment ids are totally ordered
  and creation is atomic) and a seq check on read-back. It is a
  mechanism the profile adds, as 168 requires, and it is the decision
  in this model most in need of a test against the real service.
  **Decision**, flagged.

- **138 "which host runs it".** The host running a session is the
  lease holder of its owner; the model records `host` on the session
  record as well, from the effect. Both are shown.

- **145 one presenter per sink, the page.** The page sink's presenter
  serves the page at one URL; when the lease moves to another host the
  URL must follow (Tailscale serves one name per host). The model pins
  the page sink in the manifest in practice and leaves the lease for
  the chat, which has no address. **Decision**: pin the page; lease
  the rest.

- **146 "an object no host covers is a decision under attention".**
  The `uncovered` decision is derived from the manifest alone, so a
  host that is declared but never started leaves its objects `free`
  and waiting, not `uncovered`. The host's own `gone` decision covers
  that case only once it has heartbeated at least once. **Open** for a
  host that has never run.

- **147 the takeover rule for session-backed work.** The rule names
  the operator's `takeover` answer on the host's decision, or the
  24-hour bound. A session whose host is gone keeps running unattended
  for up to 24 hours if the operator does not answer; it cannot merge
  (its place's lease is stale) and cannot be told anything. Stated.

## Part C

- **C.2 status "served without any host of the operator's running"
  against section 9 "the git host provides exactly this and no
  more".** A git host that offers only branch updates and a webhook
  cannot serve a page. The model commits `status.html` on `main` and
  says the operator reads it as a file of the branch (GitHub's file
  view, or a clone). If the file view counts as "another service of
  the host", S20 is unsatisfied in the strictest reading. **Open** as
  an interpretation; the model states it.

- **154 "decision" as a tracker item.** In this model a decision is a
  state of its object, not an object; the tracker profile satisfies
  the requirement by having the presenter open one issue per numbered
  decision, closed when the decision is retracted, as a projection
  the operator can answer on. It is a projection written from the
  register, never read as truth, which is what 155 requires of
  anything but the object's record. **Decision**; the cost is one more
  projection to keep from drifting, covered by 3.3.

- **161 the presenter when no host runs.** A phone reply given while
  no presenter is up is not a commit until one starts; the chat
  presenter replays the channel from the sink's last delivery id and
  the ids make each response exactly once. The operator sees no ✅
  until then, which is the truthful signal (151).

## Section 7

- **I13 against `persona-test.yaml`'s `pattern: "personas/*.md"`.** A
  unit type file names a path pattern. It is operator data in the type
  catalogue, read against the repository being worked, not a store of
  the machinery's own. **Decision**: I13 is about the machinery's
  stores, services and fields; a rule the operator writes into a type
  may name what the operator's repository holds.

- **I14 world evidence.** Panes, heads, gates and worktree listings are
  re-observed each tick; the place's disk is work, not state. The one
  thing on a host's disk that is neither is the work order handed into
  a place, which is a rendering of books files at a named commit and
  is re-rendered from them after a restart. Satisfied as stated.

## Section 9

- **Recutils.** Used for the ledger, signals, moves, object records and
  threads; the binary parses the subset it writes (`%rec`, `field:
  value`, multi-line values by `+`) and links no GNU tool. Named.

- **`herdr agent` and `herdr surface` command surface.** The bindings
  assume `agent start --name --cwd`, `agent status <name>` with
  last-activity and last-keystroke times, `agent send`, `agent stop`,
  and `surface bell <surface> <text>`. Not verified against herdr in
  this model.

- **plannotator and lavish as review surfaces.** The bindings assume
  plannotator can be opened on a document with a decision number and
  returns its annotations to a URL the presenter serves, and that
  lavish pages return feedback the same way. Not verified in this
  model.

- **`wt tether` as the process binding.** The service binding assumes
  `wt tether start --name <n> -- <cmd>`, `wt tether status <n>` with
  present/exited and the exit status, `wt tether stop <n>`, `wt tether
  log <n> --tail`, refusal of a duplicate name, and that `wt worktree
  remove` ends every tether of the worktree. Not verified against
  worktrunk in this model; if the tether has no status surface the
  binding falls back to a pid file under the place's `.flywheel/` and
  the port's listener.

- **portless as the endpoint source.** `portless list` filtered by the
  worktree's hash is assumed to name every endpoint a place serves.
  Not verified.
