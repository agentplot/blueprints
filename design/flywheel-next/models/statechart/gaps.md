# Gaps — requirements not satisfied, or found contradictory

By requirement number (1–182 in `requirements.md`). Each entry says what
the model does instead and why. An entry with **decision** is a judgment
the operator may reverse by a response on the file; an entry with
**open** is unsatisfied.

## Part A

- **4 — dictation that undoes or defers, never asserts.** The model
  admits a dictation only for the answers `drop`, `hold`, `release`,
  `send back`, `retire`, `takeover`, `finish`, `close`, `end` — and
  `start` and `stop` on a service, which 47 grants outright — and
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

- **25 with-operator "present".** Present is a human keystroke in the
  pane within 30 minutes (`herdr agent status`). There is no better
  evidence in the givens. The window is in the session binding, not
  the machine. Presence now gates nothing but a rebase and the status
  view, since the type raises no decision. **Decision**.

- **32 "a stated order".** Ready work waits ordered by (unit approval
  time, item ordinal). Elaboration sessions, planning, curation and the
  operator's own session are outside the bound: they are one session
  each and their count is small. **Decision**; if the operator wants
  them counted, the `item.slot_free` binding gains them with no machine
  change.

- **35 "replaced by planning's next proposal, silently".** A superseded
  proposal leaves the plan with no tail entry, so an operator who was
  reading the proposal sees it vanish and a new number appear. The
  register's retired entry lets a reply to the old number be reported
  as unapplicable. Stated; nothing better follows from "silently".

- **47 services belong to the bolt's place only.** The requirement
  says "every open bolt's place carries one service object per
  declaration"; the model reads that literally and instantiates
  declarations only for the operator's place, so a work item's or an
  elaboration's place has no service objects. A session that needs the
  system up in its own place starts it under 45's rule, and that
  process is its own (48); a session that needs the *bolt's* system —
  a test session running acceptance on the merged-back tree — starts
  the bolt's service through the command. **Decision**: one object per
  declaration per bolt; a per-place instantiation would multiply the
  page's service lines by the items in flight and make 48's "one
  record" ambiguous. Also **decision**: a service is never started by
  its declaration alone; the first start is always a response, so
  nothing listens on a host the operator did not ask for. A `start:
  auto` field would be a one-line change to `declare_services` if the
  operator wants it.

- **48 the command's refusal of an undeclared name.** `flywheel
  service start web` in a place whose bolt declares no `web` is refused
  with the declared names and the refusal is a thread entry, like a
  hook's. It is not carried to attention, since it is a session's
  mistake and not a machinery problem. **Decision**.

- **52 a take conflict on an intent's line.** The chore that resolves
  it is a unit owned by the intent (`unit.parent: [bolt, intent]`),
  the only unit an intent ever owns. It is the one place a construction
  object hangs off a design object. **Decision**: the alternative — a
  self-closing elaboration as the conflict job — would make the fix an
  approved elaboration nobody proposed, a worse fit for 60's "a chore
  is a unit of the chore type".

- **55 "found by reconciliation".** Stray places are found only by the
  host that holds them (`wt worktree list` is local). A host that is
  gone for good leaves its strays until it returns; the status view
  shows the host gone, not the strays. **Open** by construction: no
  other host can see that disk.

- **58 finding "about the session's own bolt".** A finding about the
  session's bolt becomes a `fast` unit in `proposed` targeting that
  bolt (S28's "routed to it as a proposal"). The requirement says "a
  proposal on the plan for that thread" without saying unit or
  elaboration. **Decision**: unit on the construction side,
  elaboration on the design side.

- **62 "the record never holds the text".** The record holds the
  document's path in the change directory and the offer entry's id.
  When the change is archived the path moves under `archive/`; the
  record's path is resolved through the archive map. Until the archive
  step is built, a record pointing into an archived change is a dangling
  path. **Open** in the OpenSpec archive binding.

- **67 the exit command and a session that never runs it.** A session
  that finishes without `flywheel exit` is idle with no exit entry; a
  self-closing type stalls it after two hours and a stage's join never
  meets. Correct, but slow. The skills instruct every session to end
  with the command; a session that forgets costs two hours. Stated.

- **69 the operator's session "with the machinery's read tools".** The
  `operator-console` agent is given the read side of the `flywheel`
  command (status, plan, the register) and the dictation grammar; it
  cannot run an effect. Whether that is enough of "the machinery's
  tools" is the operator's to say after use. **Decision**.

- **72 "evidence that the session exists".** The pane by name is the
  evidence; herdr's refusal of a duplicate name is what makes the
  retry safe. If herdr does not refuse duplicate names, the binding
  must add the check (`herdr agent status` before start). **Open**
  until verified against herdr.

- **77 two stores that disagree.** Lines and places are proven by git
  while their retry counters, endpoints and hold are in the record. The
  model says git wins. The counters can therefore be one behind after
  a crash between the git effect and the record write; the effect id
  makes the repeat harmless. Stated, not eliminated.

- **82 the bell as a sink.** `herdr surface bell` is assumed as the
  way to ring a named surface. Not verified against herdr. **Open**.

- **89 "nothing else reaches it".** A session on a built repository
  reads that repository whole; the closed set is the handed-in inputs
  plus the repository at the place. Claude Code's own context (its
  global settings, the operator's `CLAUDE.md`) also reaches it.
  **Open**: the place's settings can deny reads outside the place but
  not unload the operator's global instructions.

- **93 "only the session binding is faked".** The stand-in plays
  exits by running the same `flywheel exit|offer|refuse` path, so the
  control plane sees real entries; but the commits a scripted session
  "makes" in its place are files the stand-in writes, not an agent's
  work, so the git effects exercise merges of trivial content. Stated:
  it is what "no agent running" allows.

- **95 dictated scenarios.** The dictation-to-data step is a
  session's judgment; the model provides the schema and the runner.
  Rendering "as a trace a person reads" is `<name>.trace.md`. The
  scenario language cannot express every guard (no arbitrary
  arithmetic) — the same limit as the machines.

- **96 coexistence.** The new flywheel's objects live in
  `flywheel-state` (tracker: its own repository's issues; git-only: the
  same repository as files). It never lists issues of other
  repositories, and it never reads the current flywheel's labels or
  milestones. Places are under a distinct worktree root
  (`~/flywheel-next/places/`), which is also what bounds stray
  reconciliation. Sessions are named with a `fn/` prefix. Satisfied by
  scoping; the two share the books repository and the built
  repositories' shared lines, which they must.

- **97 one source.** Satisfied by the fenced claim block inside the
  chapter. The cost: an mdBook preprocessor
  (`mdbook-flywheel-claims`) and a pre-commit hook to write. Named,
  not built.

- **111 raw material outside version control.** The capture cites a
  `file://` or `https://` pointer. On a second host the pointer may
  not resolve; the model does not replicate raw material. Stated.

- **122 "since the operator last reviewed".** The mark is a response
  `reviewed` given on the review page; it is recorded on the
  organization's `plan` object, since there is no books object
  machine. Slight stretch of "the response is recorded with the object
  it concerns" (153).

- **171 "findings routing".** There is no findings-routing session in
  this model: `record_offers` turns each offer into a record pointing at
  its document, mechanically, and the routing is the operator's answer
  on the resulting proposal. A session that routes findings is one the
  operator may add as a machinery-charged session; the affinity default
  (174) already names where it would run. **Decision**.

- **172 per-unit answers on one proposal.** A per-unit answer on the
  proposal's decision is forwarded to the unit as an op-response of its
  own (`forward_answer`), so the unit's guards are the same whether the
  unit came from a proposal or from a finding. `rename` names the
  proposed bolt and reaches every unit of the proposal targeting it.
  The cost: a proposal's yes cascades over a tick, one unit per object,
  and the plan may show the proposal `approved` a tick before its last
  unit is. **Decision**. A unit dropped inside a proposal is gone
  before the yes; the document still shows it, marked dropped on the
  page.

- **173 codex and opencode start commands.** The `kinds:` map in the
  session binding is written from each program's documented flags and
  verified against none; the operator edits the line when a program
  changes. Whether each program honours a first message as the work
  order, as Claude Code does, is **open**. Nothing else in the model
  changes per kind.

- **174 the multiplexer session flag.** `herdr agent start --session`
  is assumed as the way to open a pane in a named herdr session, and
  `herdr session new` as the way to create one. Not verified against
  herdr in this model. **Open**.

- **176 checks as findings.** A failed check run is read as a review
  that asks for a change and becomes a proposed chore like a
  CHANGES_REQUESTED review. A check that fails because the shared line
  moved is therefore a chore the operator must decline, since the model
  cannot tell a flake from a finding. **Decision**.

- **179 squash by default.** An item's merge is `git merge --squash`
  and one commit naming the item unless `item_merge: merge` in the
  manifest. The commits the session made in its place are then only in
  the place's reflog until the place is removed; a reviewer who wants
  them reads the request's commits before the landing, which the
  repository's own merge setting shapes. **Decision**.

- **181 / 182 operation is a profile binding.** No machine runs after
  a bolt lands. What operation contributes enters through the capture
  adapters (an incident tracker, a log alert, a review thread, each an
  adapter writing captures in the versioned format) and through
  `line.request_links` read from the git host; what it consumes is the
  books repository from git. A data product's repository declares no
  more than a software repository does. The adapters themselves are
  not in this model, only the formats they write. **Decision**.

- **101 / 116 a challenge stales a verdict.** `cell.challenged` holds
  when a standing challenge move against the cell's claim is dated
  after the verdict's `judged_at`, in every repository that has a
  verdict of that claim; the cell goes `stale`, the fingerprint (which
  hashes the standing challenges in scope) moves, planning is due, and
  its proposal cites the signal. A verdict judged after the challenge
  clears it without the operator; a verdict that finds the claim still
  satisfied is such a verdict, so a challenge the code answers is
  settled by planning's next verdict, and only a `not-satisfied` one
  becomes work. A challenge the operator's response later moves away
  (revive, split) un-stales the cell on the next read. **Decision**.

- **116 the route move.** Curation is a session (58–60), so for a
  signal that argues with no claim it offers a chore or an ask through
  the command like any session; `record_offers` on the curation
  session's exit makes the proposed chore unit on the shared line or
  the ask record, and `record_moves` writes `route <offer entry id>`
  on the signal. No new effect: the offer path already exists. A route
  whose chore is declined leaves the signal routed, not unmoved; the
  operator revives it to have it judged again (107). **Decision**.

- **177 delivery links.** `line.request_links` is read only while the
  bolt's request is open and never under the direct policy: a direct
  landing has no request for a git host or an integration to publish
  links on, and after the request merges the landed bolt's releases
  and environments are operation's (181), reaching the flywheel only
  as signals. Regression results a delivery system posts as check
  runs on the request are read like any check (176) and need nothing
  from the flywheel. **Decision**.

- **182 a chore on the shared line.** When no bolt of the repository
  is open, planning routes a signal from operation as a chore on the
  shared line rather than opening a bolt for it (60). **Decision**.

- **192 the acceptance file.** `write_acceptance` runs in the line's
  `landing` state on a bolt's line, after the final take and before
  `land_line` or `open_request`, so the file is in the landing's
  commit or request; under pull-request a review chore that merges
  afterwards moves the line, and the file is rewritten only if the
  bolt's cited claims changed, which its proof checks. The scenarios
  are copied from the claim blocks at the cited versions rather than
  referenced, so the file stands alone in the built repository. The
  file's format (`flywheel-acceptance/1`) is named in the host binding
  and specified nowhere else yet. **Decision**, format **open**.

- **187 the proposal's document beside its record.** A proposal's and
  a unit's `document` is a path in the state store beside the proposal
  record (`objects/proposal/<id>/document.md` in git-only, an
  attachment on the decision issue in the tracker), not in any change
  directory; the finding and chore documents of 62 stay in the change
  they arose in — the intent's in the books, the unit's in the built
  repository. A bolt has no change directory anywhere. **Decision**.

- **188 who gathers.** Planning proposes units against a built
  repository's backlog and never an elaboration, so in this model the
  gathering is curation's: a run that proposes elaborations of one
  type on several intents — proposed in the same run, the requirement's
  "at the same time" — may deliver them as one gathering, and
  `gather_elaborations` writes one proposed elaboration on the first
  intent named with `covers` naming all of them. Planning's half of
  "curation or planning" has nothing to attach to until planning
  proposes design work. **Decision**, open on planning's side. The
  gathering is one object owned by the first intent; the other covered
  intents read it through `intent.covered_by` rather than owning a
  record of their own, so one session's exit finishes it once, and an
  intent whose only work was a gathering is offered its close on
  `intent.covered_by = done`, never on a child. The cost: an intent
  covered twice in a row, the later gathering dropped, reads `none` and
  is not offered its close until something else finishes on it; and
  `close_declined_since_last_final` compares only against children,
  so a decline after a gathering's finish is not re-offered by a later
  gathering's finish. Both **open**, both rare. "Answer per intent" is
  `<intent>: drop` — the intent leaves the gathering and its material
  is pending again, to be proposed on its own when the cover ends; a
  per-intent yes is the gathering's yes.

- **188 / 189 records across lines.** A gathering's place is off the
  parent intent's line, where the other covered intents' change
  directories do not exist. The session writes its records for each
  under `openspec/changes/<that intent id>/` in its place, and
  `record_per_intent` commits them onto that intent's line and takes
  them out of the place before `merge_place` runs, so the parent's line
  carries only the parent's records and the book. The book is written
  once, on the parent's line; the other covered intents get the
  chapters only when the parent archives, or by a take of the shared
  line after that. **Decision**. While a gathering is proposed or
  active, `propose_elaboration` holds on every covered intent, so new
  material there waits for the gathering to end rather than joining a
  session already running (21, 189). **Decision**.

- **189 the explore tool.** `explore` with arguments {intents, type}
  writes an elaboration record in `approved` with `covers` = the
  selected intents, parent = the first, type from the argument
  (default `with-operator`), sources = the response id. Every intent
  selected must be open; one that is not is refused with the reason,
  like any tool call that cannot be applied (6). **Decision**.

- **193 / 194 the tool surface and the interpreter.** The catalogue in
  `profiles/surfaces.yaml` is the one list of operations; a machine's
  `{response: <word>}` guards are the tool names, so a tool that no
  machine guards is unapplicable by construction and a guard word that
  no tool carries is unreachable — `check.py` does not yet check the
  two against each other. **Open** in check.py. The page's interpreter
  is a model shipped in the browser so no text leaves the operator's
  network; which model, and whether a page without one (a phone with
  no script) falls back to controls only, is the surface binding's.
  **Open**. The chat interpreter is dispatch, so a chat without
  dispatch running answers numbers only. **Decision**.

- **190 producers per deliverable.** The shipped set is a profile
  partial (`profiles/deliverables.yaml`) rather than a machine: it
  binds no evidence and no effect, so `check.py` does not check it
  beyond parsing, and nothing yet verifies that the paths it names
  exist in the books template or that a manifest override names a
  real skill. **Open** in the books template. Construction deliverables
  (commits, spec, review verdict, as-built statements) are `by-type`:
  produced by the stage's type skill under the type's schema
  instruction, with no review surface, because the requirement's
  shipped set is the book-side set plus the proposal document and the
  verdict. Whether an organization may give a construction deliverable
  a producer of its own — the manifest override accepts any name — is
  allowed by the resolution rule and untested. **Decision**. The
  house style of the diagrams is fixed by their schemas, not by a
  separate style file; a style change is a schema change and so a
  chore. **Decision**.

## Part B

- **129 annotations as the response.** A plannotator annotation set
  comes back as one response (`redo: <the annotations>`, or `yes` when
  the operator approves with no annotation). Several annotation rounds
  on one document are several responses; only the first is applied to
  a `redo`, the rest are unapplicable because the decision is gone.
  **Decision**: a redo round is one response; further notes belong to
  the next proposal's review.

- **130 notify bound.** 30 seconds by poll in both profiles when no
  webhook can reach the host. A host with no reachable URL and no
  poll would not converge faster than its 60-second sweep. Stated.

- **134 single writer, tracker profile.** GitHub gives no
  compare-and-swap on an issue body. The model adds the
  lease-by-ordered-append protocol (comment ids are totally ordered
  and creation is atomic) and a seq check on read-back. It is a
  mechanism the profile adds, as 169 requires, and it is the decision
  in this model most in need of a test against the real service.
  **Decision**, flagged.

- **141 "which host runs it".** The host running a session is the
  lease holder of its owner; the model records `host` on the session
  record as well, from the effect. Both are shown.

- **148 one presenter per sink, the page.** The page sink's presenter
  serves the page at one URL; when the lease moves to another host the
  URL must follow (Tailscale serves one name per host). The model pins
  the page sink in the manifest in practice and leaves the lease for
  the chat, which has no address. **Decision**: pin the page; lease
  the rest.

- **149 "an object no host covers is a decision under attention".**
  The `uncovered` decision is derived from the manifest alone, so a
  host that is declared but never started leaves its objects `free`
  and waiting, not `uncovered`. The host's own `gone` decision covers
  that case only once it has heartbeated at least once. **Open** for a
  host that has never run.

- **150 the takeover rule for session-backed work.** The rule names
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

- **157 "decision" as a tracker item.** In this model a decision is a
  state of its object, not an object; the tracker profile satisfies
  the requirement by having the presenter open one issue per numbered
  decision, closed when the decision is retracted, as a projection
  the operator can answer on. It is a projection written from the
  register, never read as truth, which is what 158 requires of
  anything but the object's record. **Decision**; the cost is one more
  projection to keep from drifting, covered by 3.3.

- **164 the presenter when no host runs.** A phone reply given while
  no presenter is up is not a commit until one starts; the chat
  presenter replays the channel from the sink's last delivery id and
  the ids make each response exactly once. The operator sees no ✅
  until then, which is the truthful signal (154).

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

- **portless as the endpoint source.** Under the portless router,
  `portless list` filtered by the worktree's hash is assumed to name
  every endpoint a place serves. Not verified.

- **191 the routers.** Three routers are bound in `profiles/host.yaml`
  and none is verified: the `tailscale serve --set-path` form and its
  `status --json` output, caddy's admin API route shape, and what a
  managed platform hands a host (an environment variable, a metadata
  endpoint) are written from each tool's documentation. Under the
  tailnet and platform routers the port is hashed from the place's
  path by the machinery itself, the same derivation portless uses, so a
  repository moved between hosts keeps its ports; that derivation is
  the machinery's one piece of routing and it stays a pure function of
  the path. A reverse proxy owned by the flywheel binary — the host
  running its own listener and routing `<place>-<service>` names to
  ports — would be a fourth router the binding could add without a
  machine change; it is an **option, not required**, since every host
  the model runs on already has one of the three. Whether a platform's
  ingress can address one port per place or needs a path per service
  is the platform's; the binding's `endpoint` read takes either.
  **Open** until a host of each kind runs.
