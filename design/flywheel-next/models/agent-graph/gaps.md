# Gaps — what the agent-graph model could not satisfy, or found contradictory

By requirement number. Each entry says what the requirement asks, why
the model falls short or the requirements collide, and what the model
does instead. "Decision" is what the definitions under `machines/` do
today; it is not a proposal.

## Contradictions inside the requirements

**A.10.71 vs section 12.** A.10.71 says the same definition is rendered
into diagrams and executed, so the diagram cannot drift. Section 12
asks for diagrams in the `design-diagram` house style, which is
hand-authored SVG with a word budget, a centerpiece and sweeps. A
rendering from `machines/*.yaml` would be a graph layout, not a house
diagram. Decision: the diagrams under `diagrams/` are hand-drawn; every
node, row, store and effect they name carries an `id` in the form
`node-<name>`, `row-<name>`, `store-<name>`, `effect-<name>`, and
`diagrams/check.py` fails when an id has no definition or when a row of
`rows.yaml` appears on no diagram. The picture can be stale in layout
but never in vocabulary. That is weaker than "cannot drift".

**A.15.102 vs S21.** A.15.102 says turning a capture into signals is a
session's judgment and never runs unattended; S21 says forwarding a
chat message with one word yields a capture and one signal and nothing
else happens. Decision: the `forward` adapter writes the one signal
directly, treating the operator's one word as the judgment; every
other adapter (`meeting`, `log`) writes only the capture and leaves the
signals to a `signal-reading` session. The forwarded message is the
excerpt; the kind defaults to `ask` unless the word names one.

**I14 vs section 10 ("how is history kept from growing").** I14 says a
host's memory holds only what git already holds or what is about to be
committed. A reconciler that commits every sighting (working, idle,
head sha) every tick would grow `main` by a commit per session per
tick. Decision: an observation reaches `main` only when it changes a
derived state; other sightings stay in host memory and are re-observed
from herdr and wt after a restart. The justification is that those
sightings are evidence about the world, not state of the flywheel,
and A.8.64 (nothing in memory decides behavior after a restart) holds
because the next tick re-observes. I14 read literally is not met.

**A.7.60 vs S13 takeover.** The machinery never interrupts a working
session, but a host that reconnects after a takeover finds its
activation superseded and must retire its session, which may be
working. Decision: the retire on a superseded activation carries
`now`, on the ground that the operator's `takeover` word authorised
it; the refusal to interrupt yields to the word. The session's commits
in its place are kept and reported.

**A.6.54 vs A.8.65 (one source of truth).** A.6.54 says a finding or
chore is written where the change's other artifacts live (the OpenSpec
change directory) and archived with the change. A.8.65 says one store
proves each state. Decision: the exit record in the state store is the
truth (the `chores` row and the `signal-writer` read it); the session
also writes the finding or chore into the change directory under its
instruction, and that copy is a projection that travels with the
archive. The two can drift only if the session writes one and not the
other, which the reconciler reports as a difference between expected
and delivered.

## Requirements met only in part

**A.2.13 — "the last rendering the operator received".** Whether the
operator read a rendering is not knowable. Decision: received means
delivered: the Discord message posted, or the page loaded with the
rendering id. The tail can therefore show something the operator did
not actually see if the message was posted and never opened. A
`seen` word from the page would tighten it; not modelled.

**A.4.24, A.5.33 — a type corrected by the operator's word.** The row
answers cover correction at proposal time (`type <type>` on an elab
row; `redo` on a unit row). Correction after approval is a dictation
(`elaboration <id> type <type>`, `unit <id> type <type>`) handled by
`instantiate`. For an elaboration it takes effect at the next
activation, so a running session is untouched; for a unit it is
refused once any item has an activation (A.5.49: a type change never
moves a unit in flight) and reported as an unapplied word.

**A.14.92 — a claim's scope corrected by the operator's word.** Scope
lives in the claim block in the chapter, on the books shared line. A
word cannot edit a chapter; the model turns the dictation into a chore
on the books shared line (`chore books: scope of <claim> = …`), which
one session applies and the machinery merges. So the correction takes a
session, not a word alone, and the claim's version moves because its
text moved, which fires planning for every repository in either scope.

**B.1.113 — read as of a point, tracker profile.** GitHub gives a
consistent read per issue, not across issues. The profile re-derives
every decision every tick and has `land` and `archive` re-read their
inputs under the lease immediately before firing; every other effect
is idempotent so a decision on slightly skewed evidence is corrected by
the next tick. A true snapshot is not available; the binding says so
under `adds`.

**B.2.122 — atomic per write, tracker profile.** `write.object` is
several API calls (relabel, milestone, body). Decision: the fenced
block in the body is the truth and is written first; labels and
milestones are projections rewritten from the block each tick, so a
failure between calls leaves a body-only object that the next tick
completes. A reader between the calls sees a whole body and stale
labels, never half a body.

**B.1.116, C.2.148 — the word from a phone with no host running,
git-only.** The word writer is a host process. With every host stopped
a Discord reply is not recorded until a host returns; the operator can
tell (no ✅ reaction) and can commit a word file from a laptop instead
(S19). The tracker profile does not have this gap: a comment on the
issue is durable without a host. A serverless writer (a GitHub Action
on a repository dispatch) would close it and is a profile choice, not
modelled.

**B.1.117, C.2.150 — notify within a bound, git-only.** A webhook
reaches a host only if the host has a URL GitHub can call. Hosts on the
operator's private network need a tunnel; without one the bound is the
60 s poll. The binding states both; the achievable bound depends on the
operator's network.

**A.4.22 — with-operator presence.** `operator-present` reads herdr's
report of human input age on the pane. If herdr does not expose that,
the fallback is the words `in` and `out` on the elaboration, which
means the operator must say they are present. The type still never
ends the session; only the idle row's suppression depends on it.

**A.2.15 — an annotation on the document is the word, git-only.** The
unit document is served on the plan page with an annotation control;
the control posts through the word writer as `redo: <notes>`. A
comment left on the document by any other means (an editor, a git
commit changing the `.md`) is a hand edit outside the direct-word
table and is reported as drift, not read as a word. In the tracker
profile a comment on the proposal's issue is the word.

**B.6.140 — rich chat controls.** Discord buttons and select menus are
used where they fit a row's answers (yes · drop; finish · keep). A
`redo: <notes>` or a blocked answer needs text and stays a reply or a
page answer. Threaded replies are not used for attribution; the
rendering id in the message is.

**A.13.83 — coexistence.** In both profiles the books repository gains
`signals/`, `ledger/`, `review-marks/` and `flywheel/` directories
beside whatever the current flywheel keeps there. Objects are disjoint
(the `fw:next` label; the separate state repository), but the books
repository is shared, and a chore from either flywheel could touch the
other's directories. Not enforced; a CODEOWNERS rule is the obvious
guard and is not part of the model.

**S19 — a state file edited by hand to close it.** The object's
derived state is not stored, so there is no `State:` line for the
operator to edit unless the file carries one as a projection. Decision:
the first record of every object file carries `State:` written by the
presenter from the derivation each tick; the direct-word table reads a
hand edit to it. A projection line inside the source-of-truth file is
the price of S19; the derivation never reads it.

**A.12.81 — scenarios beside the definitions.** The conformance suite
lives under `conformance/`, a sibling of `machines/`, because section
12 asks for one suite every profile passes and the suite exercises the
contract, not one machine. Per-machine scenarios would live under
`machines/scenarios/`; none are written yet beyond those the suite
already covers.

## Judgment calls that could be read as violations

**I13 and `members: {rule: {files: "personas/*.md"}}`.** A type
definition names a glob read against the repository being worked.
A.5.48 asks for exactly that ("every persona definition matching a
pattern"), so the glob is a domain input about the built repository,
not a storage path of the control plane. `schema.json` forbids `path`
as a key and allows `files` inside a member rule for this reason.

**B.1.112 — "exactly these operations".** The engine also has a
`Process` port (start, observe, tell, retire) and a `Repo` port (head,
take, rebase, merge, land, archive, prepare, remove). Neither is
durable shared state or an operator surface, so neither is a control
plane operation; they are the world the reconciler observes and the
git and runner nodes act on. If a reader counts them as control plane,
the contract has grown by two ports.

**B.5.135 and S13 — takeover "by the stated rule, never by racing".**
The rule is: an effect-only activation is retaken automatically once
the holder's heartbeat is older than `lease-ttl`; a session-backed
activation is retaken only on the word `takeover`, because the session
may still be running on a host that only lost its network. S13's "or
is taken over by the stated rule" is satisfied with the operator in
the rule.

**A.9.69 — expected versus delivered as the first line.** `Expected`
is rendered from the work order and `Delivered` is the session's own
list in its `done` exit. A session that exits `stalled` has no
delivered list; the report shows "nothing delivered" with the last
message. That is the difference, but it is a poor one for a session
that did most of the work and lost its exit block.

## Not modelled

- Multi-operator arbitration (section 8, a non-goal).
- Scheduling across hosts for throughput; the order in `graph.yaml`
  is per host, and which host takes a ready key is whichever reads it
  first (S17 is the only guarantee).
- A third profile (C.3): the binding schema and the suite are what one
  must satisfy; no example is written.
- A per-machine scenario set under `machines/scenarios/` beyond the
  conformance suite.
