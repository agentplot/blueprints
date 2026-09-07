# Gaps — requirements not satisfied, or found contradictory

By requirement number (1–231 in `requirements.md`). Each entry says what
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
  scoping; the two share the blueprints repository and the built
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
  organization's `plan` object, since there is no blueprints object
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
  blueprints repository from git. A data product's repository declares no
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
  they arose in — the intent's in the blueprints, the unit's in the built
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

- **195 kinds and capabilities.** A repository lists `kinds:` (plural;
  the earlier singular `kind:` is gone) and `capabilities:` in the
  manifest, and `cell.in_scope` is read from the resolved scope at the
  blueprints' shared head. A cell that leaves scope keeps its record and
  reads as not-applicable through the `out-of-scope` state rather than
  by rewriting the verdict, so a scope that returns recovers the
  verdict and the freshness rules judge it again. The `scope` tool
  rewrites the block's scope line and lock without moving the version,
  on the reading that scope is not the claim's text (105); a
  construction session that cited the claim is untouched, and only the
  fingerprints move. Whether a scope change should be a proposed
  claim amendment on an intent's line instead is **open**; the
  operator's control on the page is the ruling for now. **Decision**.

- **196 / 197 layout and identity.** The herdr workspace, tab and pane
  commands in `profiles/sessions.yaml` (`herdr workspace create
  --label`, `herdr tab create`, `herdr pane split`, `herdr agent start
  --pane`) are written from the intended shape and verified against
  none; if herdr has no tab or pane concept, a workspace per unit and a
  pane per session is the fallback and the binding changes, not the
  machine. **Open**. Tab and workspace removal is a host
  reconciliation (`remove_stale_layout`) rather than an effect of the
  object's own machine, because the object is final by then and runs
  no transition; a workspace may therefore outlive its object by one
  reconciliation tick. **Decision**. The identity token is checked by
  the tool server against the pane the call came from through `herdr
  agent status`; how the pane of a caller is known (a herdr-set
  environment variable, a socket credential) is the multiplexer's, and
  a multiplexer that cannot say which pane a process runs in weakens
  the check to the token alone. **Open**. Denying an agent program's
  own messaging is the place's settings for kinds that have them
  (Claude Code, codex, opencode); a kind with none is trusted to the
  work order. **Decision**.

- **198–202 the map model adopted.** The first-principles model in
  `models/context-map/` (model.md, schema.yaml, example.yaml) is the
  binding: contexts, elements, relationships typed by the fixed DDD
  patterns, links, a shipped vocabulary the organization extends in
  `flywheel/map-vocabulary.yaml`, homes, attachments living with the
  claim, scope computed through homes, derivation from kind and home
  only, one id-keyed difference for current→target and since-review,
  the ledger invariant. **Decision**. `context-map-review.md` is
  superseded where it conflicts: no seam layer, no plane or lane field,
  no runtime on edges, no seamRow, no configurations companion, no
  verifiedFiles; where it agrees (drop the willdan-specific fields,
  ids as diff keys, refs required) it still reads.

  The model's open questions (model.md section 7), carried over:

  1. A claim about every repository of a kind, such as "every service
     has a health endpoint", has nothing to attach to. Options: attach
     to the map itself, scope every homed repository; or attach to
     every element of the kind, scope recomputed as elements are added.
     The first is one attachment and reads kinds into scope, which
     breaks 4.8 for that claim. The second keeps 4.8 and asks the claim
     writer to name many ids. Recommend the second, with the scope tool
     offering "all elements of kind K" as a way to write it.
     **Decision**: the second; the attach tool offers "all elements of
     kind K" and sends one attach per element.
  2. Who moves the current map. A landing that satisfies a claim
     changes what is built. Options: the construction session that
     lands writes current in the same landing; a chore raised by the
     verdict; the same session that moves a claim moves both maps.
     Recommend the first, so current is as-built by the same hand that
     builds. **Decision**: the landing construction session's writeback
     moves the current map (bound in `map_edit`).
  3. Which line the ref check reads for a candidate. A candidate's
     chapter is on its intent's line and not yet on the blueprints' shared
     line. The check on the shared line would fail the ref. Recommend
     the check accept a ref that resolves on any open intent's line,
     and that landing the intent be what turns candidate to settled.
     **Open**, recommendation stands.
  4. Whether a link may cross a partnership or a shared kernel without
     naming which. Currently yes. A stricter rule would ask a crossing
     link to name the relationship id it crosses, so the page can show
     a relationship's traffic. Left open until a map has enough links
     to need it. **Open**.
  5. Whether a relationship's kernel element ids must be homed in both
     repositories, in one, or in a third. A shared kernel is often its
     own repository. Recommend allowing any home, and scope of a claim
     on the kernel be the union of the kernel's homes and both
     contexts'. **Open**, recommendation bound in the scope table.
  6. Whether external contexts may have a ref. An external system is
     not stated by a chapter of the blueprints. Recommend ref optional when
     external is true, status still required. **Open**.
  7. Whether the "moved" difference class should also cover a change
     of context. Moving an element between contexts is a design change
     of a different order than a rename. Recommend yes, called out as
     "moved context". **Open**.
  8. Whether the map page needs a third overlay, verdicts as of a past
     revision, to answer "what got built since I last looked".
     Derivable from the ledger's history. Not needed for 122; left
     open. **Open**.

  Migrating a v1 map (`context-map/maps/*.js`): lanes (`plane`) and
  runtimes become tags (`lane:control`, `runtime:deployed`) under
  facets the organization declares; seam-layer nodes become elements
  of an organization kind (`seam extends service`, or dropped where
  they only carried the runtime switch); the layer field is dropped
  and kinds map to the vocabulary (api, worker, ui → service or its
  extensions; contracts → contract; stores → store extends service;
  events → domain-event); relations become links, with `backed-by` and
  `fronts` folded into `uses` or the organization's kinds; contexts
  gain a home and elements homes where they differ; claim blocks'
  scope lines are lifted into `attaches:` lists — a named-repositories
  scope becomes attachments to the contexts or elements those
  repositories home, an `all` scope to every context; then
  `flywheel map check`. A one-off `flywheel map migrate` in the
  binary; not modelled. **Open**.

- **203 where files live.** The ledger is not named in 203's list of
  what the machinery writes in the blueprints, but the machinery writes it
  (`record_verdict`), so it lives under the prefix as
  `flywheel/ledger/`; the rendered claims index `flywheel/claims.json`
  the same. **Decision**. Commit types move from the manifest to the
  built repository's `flywheel/commit-types.yaml`, with the manifest
  as fallback, since 203 makes them the repository's declaration; the
  manifest's `unit_types.<type>.commit_type` stays readable for a
  repository that declares none. **Decision**. The shipped
  instructions, schemas, skills and type files sit under the blueprints'
  `flywheel/` too, written by people through chores and read by the
  machinery — the prefix names what is flywheel-facing, not who
  writes it. **Decision**.

- **204–208 bootstrapping and repositories.** The git host must offer
  repository creation under the organization to the App's installation
  token (GitHub: the App needs `administration: write` on the
  organization for `create_repository` and the installation-repository
  endpoint for `extend_installation`); an App without those permissions
  leaves creation to the operator by hand and `covering` to the
  `app-coverage` decision — modelled as the decision, not as a second
  path. **Decision**, permissions **open** against GitHub's current
  App scopes. The template contents (`profiles/host.yaml` `templates:`)
  are listed by path and written nowhere else; the blueprints template's
  `flywheel/` tree and the built template's `openspec/` layout are
  **open** until the set is cut. Joining is a `disk` region beside the
  host's `life` rather than a state before `alive`, so a host record
  the stand-in seeds (already laid out) fires nothing and the scenario
  timings hold; a real host's first tick reads the root and clones
  what is missing. **Decision**. The derivation table (199) is
  shipped data versioned with the set (208): a change re-derives kinds
  and capabilities only, moves no verdict and stales no cell, because
  cells key on claim version and repository and scope comes from
  attachments; it can change what the page says a repository is and
  what planning's work order carries. **Decision**. Adoption of a
  blueprints repository that already has a `flywheel/` tree from an older
  set is an upgrade chore, not an init step; init adds only what is
  missing. **Decision**.

- **209 / 210 one form per kind.** The forms are named in
  `render_status` and the page binding and drawn nowhere yet; the
  plan mockup (`plan-mockup.md`) predates 209 and shows decisions as
  cards but proposals and bolts as lists, so it is behind. The chat
  keeps the forms as one line each, which is 18's rule; a tracker's
  board shows only placement, so the tracker profile's status view is
  the page, not the board. **Decision**. A gathered elaboration's
  surface is one surface reached from each covered intent's thread,
  not one per intent. **Decision**. The explore session's work order
  carries the earlier elaborations' records read-only; nothing in the
  place enforces read-only beyond the writeback fanning out only what
  the session left under each intent's directory (188). **Open**.

- **212 the surface specification.** `design/flywheel-next/surfaces.md`
  is the first instance, written by hand from the plan mockups rather
  than produced by a session under the shipped producer and schema;
  when the set is cut it should be checked against
  `flywheel/schemas/surface-specification.md` and its mockup citations
  pointed at the change directory records. **Open**. Which claims are
  "about a surface" is read from the claim's attachments and its
  chapter, not from a flag: a claim attached to an element whose kind
  is a surface kind (`ui` in the example vocabulary) or stated in a
  surface-specification chapter. **Decision**.

- **190 producers per deliverable.** The shipped set is a profile
  partial (`profiles/deliverables.yaml`) rather than a machine: it
  binds no evidence and no effect, so `check.py` does not check it
  beyond parsing, and nothing yet verifies that the paths it names
  exist in the blueprints template or that a manifest override names a
  real skill. **Open** in the blueprints template. Construction deliverables
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

- **172 size estimates and actuals.** A slot-day is one session slot
  for one day; the actual is summed from the session records
  (`started_at` to the exit) at landing and written per unit into the
  acceptance file beside the claims, which is where "on the as-built"
  is read to mean, since the machinery writes nothing else beside the
  as-built (192, 203). **Decision**. Calibration is the planner's
  judgment over the actuals its work order carries, by unit type and
  repository; the machinery computes no rate and stores none. The
  estimate is shown on the proposal and corrected by `redo: <notes>`,
  not by a per-unit answer, so the reply grammar is unchanged.
  **Decision**.

- **194 the host's agent.** The job is renamed: the host's agent reads
  and answers with the query tools on its own, and every write is a
  proposed tool call the operator confirms; "interpreter" now names
  only the function that turns text into a proposed call. A message
  that asks for several things yields several cards, each its own
  response with its own id. The page's agent is a model in the browser
  (216a); which model, and whether a page without one falls back to
  controls only, stays **open** in the surface binding. The chat's
  agent is dispatch, so a chat without dispatch running answers
  numbers only. **Decision**.

- **215 adapters.** Seven ship, one kind: an enumerator run by
  `run_adapters` on the host machine's tick. The page's capture box is
  listed as an adapter because it writes one keyed capture per
  submission, though it is the capture tool itself and runs on no
  tick. **Decision**. A webhook adapter needs an inbox the host's
  endpoint fills; on a host with no reachable URL the inbox is empty
  and the source is dispatch's endpoint instead (217g). Stated. The
  adapters' own command lines (`flywheel capture <source>`) are named
  and not yet specified per source. **Open**.

- **216–217k dispatch.** Bound by `models/dispatch/model.md`; nothing
  in `machines/` names dispatch (C.1), so 216 and 217 are cited on the
  sink and capture machines and on `deliver_plan`. The suffixed
  clauses 216a and 217a–k are traced through their base numbers:
  `satisfies` is integer in `schema.json` and `Vec<u32>` in the
  engine, and `check.py` reads a suffixed item as a clause of its base
  and counts it cited when the base is. **Decision**. The dispatch
  model's ten open questions (its section 8) stand.

- **218–222 organizations.** Isolation is by root, state repository,
  blueprints, sinks and register per organization; a host's manifest names
  the organizations it runs and their roots. **Decision**. `remove
  <organization>` is admitted as a dictation under 4 because it
  retires and archives, asserting nothing done; it is reachable only
  from `hosted`, since an organization mid-bootstrap has nothing to
  archive. **Decision**. 222's "the host stops covering the affected
  objects" is bound wider: the disk region leaving `ready` makes
  `lease.coverable` false for every object the host declared, not only
  those under the differing path, because the doctor reports the first
  difference and not a list. **Decision**, conservative. Unreadable
  state (an object file that does not parse) is reported through the
  same decision and never rewritten; the git-only profile cannot stop a
  hand commit from landing, only decline to honour it (gaps 4).

- **223–227 machines, types and context.** 223–225 are cited on
  `atoms.yaml` because the registry has no machine of its own.
  **Decision**. 226 is `profiles/context.yaml`; the test that asserts a
  rendered work order equals its row is named (`flywheel render-order`)
  and not built. **Open**. The 24 rulings are in that file's
  `rulings:`; the ones that could not be bound without a new type
  version were bound in the binding instead of the immutable type
  files: the chore type's verdict is dropped from expected when the
  unit names no claim (ruling 8, `deliverables.yaml` resolution)
  rather than by a chore@3; the fast type already names its change
  directory, so no fast@4 (ruling 18). **Decision**. Ruling 22 gives
  the engine windows a manifest key read at load; the machine files
  keep their literals as defaults, so a scenario's timings hold.
  **Decision**. Ruling 24 denies construction sessions the query
  tools on the closed-inputs reading of 89; if a builder needs more
  than the map section 211 gives it, the ruling is the one to
  reverse. **Decision**. 227's stores are named as effects that already
  exist; `record_offers` carries a signal into `flywheel/signals/`
  and is not renamed. **Decision**.

- **228–231 packages and setup.** A package's install decision is the
  only setup item in the count; the `package-secret` and
  `host-enrol-lapsed` decisions are `attention`, outside it, as the
  plan's attention lines are (14). **Decision**. `add-host` carries
  the operator's platform credentials in the call and the binding
  says they are dropped after provisioning; nothing in the model can
  prove a negative, and the platform's own audit is the check. Stated.
  The enrolment token lives in the host record, unspent, for 24h; a
  host adopted by the token alone gets no provisioning and no secrets
  placed — its parts' secrets are the operator's to place, and
  `package.secrets_placed` reads them. **Decision**. 231 is the host
  machine: adapters are the one timed behaviour that was outside it,
  and now `host.adapters_due` is a guard; the launcher entry per
  platform (launchd, systemd, a container entrypoint) is named in the
  host binding and verified against none. **Open**. The package kinds
  chat sink, runner, router and sign-in are the code the dispatch
  model's tiers name (217j); a package of those kinds is a binary
  extension the host loads, and how a static binary loads one — a
  subprocess speaking a fixed protocol, or a rebuild — is **open**.

- **232 several hosts on one computer.** A host's root defaults to
  `~/flywheel/<host>` rather than `~/flywheel`, so a second host on
  the same computer needs no manifest edit for its disk; the
  multiplexer session names gain the host id only when the manifest
  marks the computer shared, keeping 174's defaults for the one-host
  case. **Decision**. The port range is a block per host id folded into
  the place hash, so a place moved between two hosts on one computer
  changes port; 191's "derived from the place" is read as derived from
  the place on its host. **Decision**. `disconnect` in the scenario
  binding cuts the route to the git host and nothing else; a host
  that loses its network also loses its chat and its webhook, which
  the step does not model. Stated.

- **233 the account item.** The local-user case shows the process's
  user name and records it as `given_by`; a page reachable by another
  person on the same computer would record that name too, which is
  the operator's own computer's problem and not the machinery's.
  **Decision**. `configure-organization` edits the manifest as a
  commit on the blueprints' shared line, so a bad save is a bad manifest
  until the next save; the form validates as `flywheel.yaml` is
  validated and refuses what the check refuses. **Decision**. Which
  sign-in kinds ship is the dispatch model's tiers (217j); their
  verifiers are not in this model. **Open**.

- **213, 214 and 229–230 on the mockup.** The rail-and-board mockup
  (`design/flywheel-next/mockups/rail-and-board.html`) illustrates the
  artifact views behind an object (213), the flywheel instrument
  (214), the setup surface with parts and index (229) and adding a
  host (230); its "offer" wording for a part added and awaiting
  install is being replaced by "add", matching 229's states.

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

- **213 artifact views.** Every view reads a repository at the shared
  line; a unit whose change is still on its bolt line and not yet
  landed is read from the bolt line, since the change lives there
  until the landing (37, 213). The tracker profile's status view is
  the page, and the views are the page's; the board shows none.
  **Decision**. The claim view's "every version from history" is
  `git log` over the block's chapter and its lock hashes. Stated.

- **214 the instrument.** Drain's calibration is the ratio of actual
  to estimate over landed units of the same repository and type, 1
  until one lands; a type with no actuals yet reads as estimated.
  **Decision**. The reading sentence's thresholds — one day of runway,
  the bound — are the counts' own and not settings. **Decision**. The
  streak is broken by any op-response, a dictation included, because
  the requirement says "a response from the operator"; an
  acknowledgement of an attention line therefore ends a streak.
  **Decision**, flagged: if the operator wants attention `ok`s not to
  count, the binding's `streak` read changes and no machine does.

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
  a place, which is a rendering of blueprints files at a named commit and
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
