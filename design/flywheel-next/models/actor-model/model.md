# Flywheel next — the actor model

An actor is a name over stored state with a durable mailbox. Its
behaviour is a function of its current state and one input, and its
only outputs are a new state and a list of effects. Hosts, sessions,
intents, bolts, units, work items, planning, curation, the operator and
every plan row are actors. A supervision tree says who owns whom and
what a parent does when a child's runtime attachment is lost. Leases are
actor ownership by a host; the operator's word is a message to a
`decision` actor; the plan is the set of `decision` actors still in
`open`.

The definitions are the model. Everything under `machines/` is data:
one file per actor kind (`machines/actors/*.yaml`, validated by
`machines/schema.json`), the atom registry (`machines/atoms.yaml`), the
operator-extensible type catalogues (`machines/types/*.yaml`), the
record formats (`machines/records.rec`) and the profile bindings
(`machines/bindings/*.yaml`). This document explains those files,
answers section 10, and walks section 11. Where the document and a
definition file disagree, the file is wrong and this document says what
it should say; nothing here is a second source.

Requirement numbers in parentheses refer to `requirements.md`.

## 1. The kernel

### 1.1 An actor is a name over stored state

Every actor has:

| part | what it is | where it lives |
|---|---|---|
| id | `<kind>/<path>` — `bolt/atlas/b-0142`, `wi/atlas/b-0142/u-3/1`, `session/wi/atlas/b-0142/u-3/1/build-1-builder`, `decision/unit/atlas/b-0142/u-3/approve` | the store's key |
| state | one of the kind's named states | the actor's State record |
| fields | the kind's stored attributes | the same record |
| seq | the number of transitions taken; every write bumps it | the same record |
| epoch | the lease epoch the last write was made under | the same record |
| mailbox | messages sent to it and not yet consumed, each with its own id | Message records addressed to the actor |
| notes | discussion about it: questions, answers, session notes (131) | Note records under the actor |

An actor is not a process. No process holds it; a host that holds the
right lease *runs* it, which means: read its record and its mailbox,
read the evidence its clauses ask for, choose a clause, write the
transition. Between ticks the actor is only its records. This is what
makes a restart change nothing (I7), what makes the loss of every host
survivable (§1.7), and what makes the status view derivable from `list`
and `read` alone (133).

### 1.2 Behaviour is receive(state, input)

A kind's definition is its list of receive clauses. Each names the
states it applies in, the input it answers, predicates that must hold,
the state to move to, and the effects to write. The engine takes the
first clause whose `in`, `on` and `when` all hold. There are two inputs:

- **A message** from the mailbox, oldest first by sender seq. Consuming
  it is part of the transition write.
- **The tick**, an unstored input that carries evidence. A clause `on:
  tick` is a reconciliation rule: it fires whenever its predicates hold
  over what `read` returns, and the same reading twice yields the same
  choice (67). A tick clause whose predicates hold but whose `to` is
  `same` and whose effects are all already written is a no-op and
  writes nothing.

Messages are for facts that happened once and must not be re-derived:
a word was given, a session exited, an item merged. Ticks are for facts
that are true of the world and must be re-derived: a place is current,
a landing passed, a digest moved, every unit is merged. The rule for
which to use is in §7.2.

### 1.3 The transition write

One transition is one write to the control plane, and the write carries
everything the transition produced:

```
write {
  actor:     bolt/atlas/b-0142
  seq:       9            # was 8
  epoch:     3            # the holder's lease epoch; refused if stale
  state:     open
  fields:    {merging: wi/atlas/b-0142/u-3/1, …}
  consumed:  [unit/atlas/b-0142/u-3/4/1]         # message ids taken from the mailbox
  outbox:    [{id: bolt/atlas/b-0142/9/1, to: wi/atlas/b-0142/u-3/1, kind: merge-now, …}]
  effects:   [{id: bolt/atlas/b-0142/9/2, name: place.rebase, args: […]}]
  reason:    "in open, on tick: merging == none and merge-queue non-empty"
  evidence:  {point: 2026-09-04T07:41:02Z, merge-queue: [...], merging: none}
}
```

Atomic per write (122) makes the state change, the consumption and the
sends one fact. Single writer per object (121) is the lease epoch: a
write whose epoch is not the current lease's is refused, and the writer
reads again before deciding anything. The `reason` and `evidence` fields
are the audit record (68).

### 1.4 Effects: at most once

Every effect has the identity `<actor>/<seq>/<n>`. Effects fall in two
classes and the class decides how at-most-once falls out.

**Control-plane effects** — `actor.spawn`, `actor.send`, `actor.set`,
`decision.open/amend/withdraw`, `note.append`, `verdict.record`,
`move.record`, `word.consume`, `lease.take` — are the transition write
itself. They happen exactly once because the write is atomic and the
seq moves: a second attempt at the same transition finds the seq
already past and does nothing. `actor.spawn` and `decision.open` are
additionally keyed by the id they create, so a clause that spawns the
same id from two different transitions (a tick clause re-firing after
a partial fetch, say) creates one actor.

**World effects** — `session.start`, `place.ensure`, `line.ensure`,
`line.take-parent`, `place.rebase`, `place.merge-into-line`,
`landing.start`, `archive.change`, `place.remove`, `session.stop`,
`plan.present` — act on herdr, worktrunk, git or Discord. They are
performed *after* the transition write lands, from the outbox the write
recorded. Each carries its identity into the world: the pane is named
by the session id, the worktree by the place, the branch by the line,
the pull request body by the landing id, the Discord message by the
rendering point. The host performing it first reads the world (the same
evidence the tick reads) and skips an effect whose result already
exists. So a world effect is attempted as often as needed and applied
at most once (62, 114): a host that dies between the write and the act
leaves an outbox entry with no result in the world, and the next holder
performs it; a host that dies between the act and its next tick finds
the result in the world and does not act again.

The outbox is therefore the only thing a host must finish after a
write, and it is stored with the write, not in the host's memory (64).

### 1.5 Words: exactly once

The operator's word arrives as a Word record whose id is the platform
message id (`word/discord-1423581234567890`, `word/page-<form nonce>`,
or the commit sha for a direct edit). The word writer (§5.3, §6.3)
creates the record; creating it twice is the same record, so a
duplicate delivery is a no-op at the store (116, 124).

The record is a message to the decision actor named on it. The decision
actor's transition `open → answered` consumes it: the write records the
word id under `consumed`, sets `answered`, and sends `decided` to the
parent in the outbox. All of that is one atomic write. A restart before
the write leaves an open decision with an unconsumed word, and the next
tick applies it; a restart after the write finds the word consumed and
the decision answered, and there is nothing to do. A word arriving at a
decision that is `answered` or `withdrawn` is consumed and handed to the
operator actor as `unappliable`, shown once under ATTENTION (5, 116).

That is the whole mechanism. No process remembers that it applied a
word, and the word is never applied by anything but the one decision
actor it names.

### 1.6 Leases are actor ownership

A lease is a record `{actor, holder, epoch, taken}` on a *root* actor.
Root kinds are those whose subtree is worked on one host at a time:
`org`, `intent`, `bolt`, `planning`, `curation`. Every other kind is
*inherited*: it is run by whoever holds its nearest root ancestor's
lease, and its writes carry that lease's epoch. `host` is its own
record (`lease: self`).

- **Take.** A host lists roots with no holder and takes them oldest
  first (`lease.take`). Exactly one taker succeeds — by push
  compare-and-swap in git-only, by ordered comment in tracker (§6, §5).
  The loser reads again and moves on (S17).
- **Renew.** Renewal is the host's heartbeat, one record per host, not
  a write per lease. A lease is live while its holder's heartbeat is
  younger than the profile's `lease-ttl`.
- **Expire.** When the heartbeat is older than the TTL the lease is
  *expired*: visibly stale on the status view, and untouchable by any
  other host until the org's takeover rule fires (135). The rule is a
  field of the org: `takeover: never` (default; the operator answers
  the `host-stale` attention row) or `after <duration>`. A takeover is
  a message to the taking host; the take bumps the epoch, and every
  later write by the old holder is refused by the fence.
- **Release.** A root that reaches a terminal state releases its lease
  in the same write.

Sessions run on the host that holds the parent's root lease and are
started there; a bolt's items all build on one host. That is a
correctness choice (one holder, one place per item, no cross-host
place), and balancing across hosts is a stated non-goal (§8).

### 1.7 Surviving the loss of every host

Nothing that decides behaviour lives on a host. The central store holds
every actor's state, mailbox, outbox, lease, note, word, verdict,
signal and move. A host's disk holds two kinds of thing: clones and
worktrees of repositories, which are git and are re-made from lines by
`place.ensure`; and a herdr multiplexer with panes, which are
processes.

When every host is lost at once:

1. The stores are intact (120). Every lease's holder now has a stale
   heartbeat.
2. A new host starts, fetches, lists roots, and finds every lease
   expired. It takes none on its own. It runs the org root, which is the
   one root a host does take when expired (the org runs no session, and
   its writes are fenced, so a double run is harmless).
3. The org opens a `host-stale` row per dead host, or, if `takeover:
   after` is set, sends `takeover` for each to the new host.
4. The new host takes the roots, ticks them, and finds every session
   actor's process absent with no terminal exit: each goes `lost`, and
   its parent's supervision clause decides. A work item under its retry
   bound goes back to `placing`: the place is re-made at the head of
   the place's published ref (§9.3), and the stage restarts. An
   elaboration of a self-closing type does the same. A standing or
   with-operator elaboration is never restarted by the machinery: it
   opens an `answer` row asking the operator to restart in place or
   finish (23, I6).
5. The plan before and after is the same set of open decision actors,
   plus the `host-stale` rows (I7).

Work committed in a place and not yet published is the one thing a host
loss costs; §9.3 says when a place is published so that cost is a
stage, never a merge.

### 1.8 The tick loop of a host

The host binary is one loop, with nothing between iterations but what
the store holds:

```
loop every tick-interval, or sooner on notify:
  sync                       # git-only: fetch flywheel-state main; tracker: poll updated_since
  renew heartbeat if due
  take free roots, oldest first, while under bound
  for each root r this host holds, oldest first:
    for each actor a in subtree(r), parents before children:
      inputs = mailbox(a) ++ [tick with evidence]
      for each input, first clause that matches → transition write → outbox
  perform outbox entries whose result the world does not yet show
  rewrite the status projection if this host has the serve role
```

Parents before children within one tick means a parent's send is in the
child's mailbox on the same pass; nothing depends on it, because a
message not seen this tick is seen next tick.

## 2. The actors and the supervision tree

```
org                                     root · one per organization · takeover rule
├─ host/<name>                          self  · scheduler, heartbeat, session slots
├─ operator/org                         inh   · last rendering, dictation inbox, attention
├─ curation/org                         root  · one session per run over unmoved signals
├─ repo/<blueprints>                         inh   · manifest facts for the blueprints repository
│  └─ intent/<subject>                  root  · a line off the blueprints' shared line
│     ├─ elaboration/<n>                inh   · one session, one place, ends by type
│     │  └─ session/…                   inh   · the process, read as evidence
│     ├─ offer/…                        inh   · a finding offered on this thread
│     └─ decision/…                     inh   · approve · propose · close · land-failed
└─ repo/<built>                         inh   · manifest facts for a built repository
   ├─ planning/<repo>                   root  · runs when the ledger digest moves
   │  └─ session/…                      inh
   ├─ unit/<repo>/shared/<offer>        inh   · a chore on the shared line, no bolt
   └─ bolt/<repo>/<id>                  root  · a line off the shared line
      ├─ unit/…                         inh   · approved document → items
      │  └─ work-item/…                 inh   · stages by the pinned type
      │     └─ session/…                inh   · one per stage set member
      ├─ offer/…                        inh   · findings and chores raised here
      └─ decision/…                     inh   · close · claim-moved · land-failed
```

Each kind's file is the behaviour. What follows is what each actor is
for and what it may never do, so the files read in context.

| actor | is | never |
|---|---|---|
| `org` | the root supervisor: spawns repos from the manifest, one curation, one operator; watches heartbeats; applies the takeover rule | runs a session; creates work |
| `host` | a machine running the binary: heartbeat, root leases in a fixed order, session slots up to its bound (29), the probe of herdr for session evidence | decides anything from memory (64) |
| `operator` | the operator's standing record: last rendering and its row numbers (13), dictation inbox (11), unappliable words (5), last review sha (109) | holds a row of its own |
| `repo` | a tracked repository's manifest facts; supervises its lines | has a runtime attachment |
| `intent` | a thread of design work: a line off the blueprints' shared line, elaborations, at most one proposal open (18) | closes itself (19) |
| `elaboration` | one session in one place off the intent's line; its type's `ending` decides how it ends (22) | is split into several sessions (21) |
| `curation` | one bounded session over the unmoved signals, then the applying of its moves and proposed intents | batches signals itself; opens an intent (97) |
| `planning` | one bounded session over one repository's backlog, as-built and open bolts, then the applying of its verdicts and proposed units | creates a unit in any state but `proposed` (4) |
| `bolt` | a line off a built repository's shared line: units, merge queue, operator place, chores, one landing | ages out (30); lands without the word (35) |
| `unit` | an approved document broken into items, pinned to a type version, with dependencies on sibling units | exists as work before approval (32, I1) |
| `work-item` | one task worked through the type's stages in one place; send-backs, blocks and retries recorded | merges itself (39) |
| `session` | the durable record of one process; turns exit records into messages to its parent | moves any other actor (58) |
| `offer` | a finding or chore a session wrote in its place, mirrored as state | interrupts the session (50) |
| `decision` | a plan row: awaits one word, applies it once, tells its parent | re-asks (5) |

Supervision is about attachments, not state. State is never lost, so
the only thing a parent decides on `session.lost` is what to do about
the missing process: `restart-bounded` (work items and self-closing
elaborations, bound by the type), `escalate` (standing elaborations,
hosts), or `ignore` (kinds with no attachment). The `supervision` block
of each file names the choice; the receive clauses carry it out.

## 3. The stores

Every store below names the system that holds it in each profile and
shows one record. Record formats are recutils descriptors in
`machines/records.rec`, versioned and validated on write (101). The
minimal set is nine stores; everything else is a projection.

| store | source of truth for | git-only (`flywheel-state` repo, `main`) | tracker (GitHub) | one record |
|---|---|---|---|---|
| actor state | every object's state, fields, seq, epoch | `actors/<kind>/<id>/state.rec` | the actor's issue: comments folded, body as cache validated by seq | `State` in records.rec |
| mailbox | messages not yet consumed | `actors/<kind>/<id>/mailbox/<msg-id>.rec`, deleted by the consuming commit | `kind: message` comments on the issue; consumed ids listed in the transition comment | `Message` |
| outbox | world effects written and not yet shown by the world | `actors/<kind>/<id>/outbox.rec`, entries removed when the world shows the result | in the transition comment; the next transition comment lists them as performed | `Effect` |
| lease | who holds a root, at which epoch | `actors/<kind>/<id>/lease.rec` | `kind: lease` / `kind: release` comments; earliest after the last release wins | `Lease` |
| heartbeat | a host's liveness | `refs/heads/hosts/<host>`, one commit amended and force-pushed | the host issue's body field `heartbeat:` | committer date / body field |
| word | the operator's word as it arrived | `words/<id>.rec` | a comment on the decision issue carrying the platform message id | `Word` |
| dictation | the operator's word with no row | `dictations/<id>.rec` | `fw2 dictation` issue comments | `Dictation` |
| ledger | verdicts per repository | `ledger/<repo>.rec`, append-only | the same file in `flywheel-state` main | `Verdict` |
| signals | captures, signals, moves | `captures/<key>.rec`, `signals/<id>.rec`, `moves/<signal-id>.rec` | the same files | `Capture`, `Signal`, `Move` |
| notes | discussion about an object (131) | `actors/<kind>/<id>/notes/<seq>.md` | `kind: note` comments | `Note` |
| report | the machinery's own problems (70) | `report/<host>.rec` | `fw2 report <host>` issue comments | `Report` |
| exits | what a session wrote | `<place>/.flywheel/exits.rec`, committed in the place by `flywheel exit` | the same | `Exit` |

Projections, never read as truth: the status view (`status/index.html`
on `refs/heads/status` in git-only; the project board and `fw2 status`
issue body in tracker), the tracker issue body, the plan rendering in
Discord. When a projection drifts from its source the next tick
rewrites it; the tracker body is trusted only when its `seq` equals the
last transition comment's, and a mismatch is reported (66).

The blueprints repository holds what the machinery reads but never owns:
the design book (mdBook), the claims as fenced blocks in chapters
(§10.12), the OpenSpec changes and archived specs, the manifest
(`flywheel/manifest.yaml`), the instruction set
(`flywheel/instructions/`, §4.4), and the type catalogues. Built
repositories hold their as-built (`openspec/specs/`), their persona
definitions, and their own merge gates.

Three records the previous pass left out of `records.rec` are added
now: `Effect` (an outbox entry), `Note`, and `Report`.

## 4. The engine, the domain, and the Rust crates

### 4.1 The line

The engine knows: actor definitions as a schema, the expression
language of `when` clauses, how to pick a clause, how to build a
transition write and an outbox, what a lease and an epoch are, how to
turn `decision` actors in `open` into numbered rows, and the seven
control-plane operations of B.1 as a trait. It knows no domain name:
the words `intent`, `bolt`, `claim`, `verdict` occur nowhere in it (74).
Even `decision` is to the engine only "a kind whose open instances are
presented and whose word-consuming clause is marked exactly-once"; the
kind's file declares that with `presented: true`, and the plan mockup's
classes are the file's `class` values.

The domain is `machines/`: the definitions, the atom registry, the
type catalogues, the record descriptors. New behaviour is a new clause
or a new atom (75). What forces a need to the domain side: any predicate
that asks a question about the flywheel's objects (`ledger.backlog`,
`claims.standing`, `personas.matching`) or any act that names one
(`verdict.record`, `archive.change`). What may enter the engine: only
something every actor system needs regardless of what it is about — a
new input class, a new supervision policy, a new guarantee of the
control plane. A change to B.1 is a change to the contract and is
written there first (112).

Atoms sit between. An atom is a name with an argument shape (the
registry) and a binding per profile (the bindings). Domain atoms whose
answer is a pure function of other evidence — `ledger.backlog`,
`ledger.digest`, `claims.standing` parsed from chapters, `cadence.due` —
are implemented once in domain code over the raw reads; storage atoms
are implemented per profile.

### 4.2 The crates

The Rust workspace has one binary and six library crates. The boundary
between each pair is one of the lines above.

| crate | holds | depends on | names a domain word? |
|---|---|---|---|
| `fw-engine` | definition schema and loader (serde_yaml), the `when` expression evaluator, clause choice, transition write, outbox, lease and epoch rules, supervision policies, row derivation and numbering, the tick; the `ControlPlane` trait (read, write, lease, present/receive, notify, list, serve) and the `Atoms` trait (evidence by name, effects by name) | serde, thiserror | no |
| `fw-domain` | `machines/**` embedded as data (`include_dir!`), the atom registry, the record descriptors, the pure atom implementations (backlog, digest, claims index over mdBook chapters, type catalogue lookup, cron via `croner`) | fw-engine | yes, in data and in the pure atoms |
| `fw-world` | the world adapters both profiles share: git (shelling to `git`; `gix` for reads), `wt` and `herdr` (shelled, since they are CLIs the operator also runs), `flywheel exit` record validation (`recutils` format via a small parser), Discord (`serenity`), the served page (`axum`) | tokio | no; binds world atoms by name |
| `fw-profile-tracker` | `ControlPlane` for GitHub issues, milestones, Projects v2 (`octocrab` REST + GraphQL for Projects); the storage atoms | fw-engine, fw-world | no |
| `fw-profile-git` | `ControlPlane` for the `flywheel-state` repository: commit, push with stale-base rejection, fetch, the per-host heartbeat ref, the webhook receiver | fw-engine, fw-world | no |
| `fw-standin` | the in-memory `ControlPlane` and `Atoms` over a scenario file's `given` tables; the trace writer | fw-engine | no |
| `fw-host` (binary) | the loop of §1.8; `flywheel up`, `flywheel status`, `flywheel exit`, `flywheel serve`, `flywheel conform` | all | no |

`fw-engine` compiles with no knowledge of `fw-domain`; a test that
loads a made-up definition with kinds `foo` and `bar` runs against
`fw-standin`. `fw-domain` compiles with no knowledge of any profile.
The conformance runner (`flywheel conform --profile <name>`) links
`fw-domain` with any crate implementing `ControlPlane` and runs the
suite in `conformance/` unchanged (152). One static binary per host
(`cargo build --release` with `musl` on Linux, the default target on
macOS) links every profile and picks one from the manifest.

### 4.3 The `when` language

Predicates are atom calls joined by `and`, with `not`, `==`, `!=`, `<`,
`>`, `in`, `exists … in …`, and field access on `self`, `parent`,
`msg`, `type` and `repo`. It is deliberately not Turing complete: no
loops, no assignment, no string building. The definition files use a
few prose predicates where the previous pass had not settled the atom
(for example `"stage.join met over self.sessions"`); each is an atom
to add to the registry before the loader accepts the file, and
`gaps.md` lists them.

### 4.4 Instructions and skills as data

The instruction set — schemas for every artifact, the skill for every
session template, the work-order templates, the default writing rules
of A.16 — lives in the blueprints repository at `flywheel/instructions/` on
the shared line. `instructions.version()` is the sha of that tree at
the shared line's head. A session records the version it started under
(`session.instruction-version`); `work-order.render` materializes that
version into the place's `.claude/` and writes
`.flywheel/work-order.md`. Changing an instruction is a chore on the
blueprints repository (79, 110); it reaches every host when the chore lands
on the shared line, because every host fetches before every tick, and a
session started before it and one after are told apart by the field.
A test renders the prompt for a scenario by calling `work-order.render`
against `fw-standin` with the version pinned (78, 111).

## 5. The control plane — tracker profile

The full binding is `machines/bindings/tracker.yaml`. The shape:

- **One issue per actor** in the organization's `flywheel-state`
  repository, titled `fw2 <kind> <id> · <name>`. The `fw2 ` prefix is
  the scope (83): nothing without it is read or written, and the
  current flywheel's items never carry it.
- **Comments are the journal and the mailbox.** A transition is one
  comment (`kind: transition`) carrying state, fields, seq, epoch, the
  consumed message ids, the outbox, the reason and the evidence. A
  message is a comment on the target's issue (`kind: message`). A lease
  take is a comment (`kind: lease`), a note is a comment, a word is a
  comment. Comments are server-ordered and never edited.
- **The body is a cache.** After each transition the holder rewrites
  the body with the snapshot and its seq. A reader trusts the body only
  if its seq equals the last transition comment's; otherwise it folds
  the comments (123, 142).
- **Milestone** = the intent or bolt the actor belongs to. **Project
  board** `flywheel-next` has four columns, the state classes of 128;
  `status.project` moves the card. The board is the status view (130,
  S12); `flywheel serve` renders the same issues as a page.
- **Record tables** (ledger, signals, captures, moves, words log,
  dictations) are recutils files on `flywheel-state` `main`, laid out
  exactly as in the git-only profile, committed by the lease holder.

### 5.1 The guarantees and the one mechanism added

GitHub gives durable, atomic-per-comment, and listing by search. It
does not give compare-and-swap on issues. The mechanism added for
single writer (153): a lease is taken by *ordered append*. A host
comments `kind: lease · host · epoch`; then it reads the issue's
comments; the earliest lease comment after the last release or expiry
is the holder, by comment id, which GitHub assigns monotonically. A host
that finds an earlier one lost and moves on. Every later transition
comment carries the holder's epoch; readers ignore comments whose
epoch is not the current lease's, and a writer sees it lost on its next
read (121). The mechanism's own state is the lease comments; nothing
else.

Two hosts cannot both commit the same actor's transition because both
would need the same epoch, and only one lease comment is earliest.

### 5.2 Notify and list

Notify is the repository's `issues` and `issue_comment` webhooks to the
host with the serve role, relayed to the others as a message in the
machinery's Discord channel, with a 60 s `updated_since` poll as the
floor (117). List is a search: `repo:org/flywheel-state "fw2 bolt
atlas/" in:title` returns every bolt of a repository; the board's
column is the state class.

### 5.3 The word

Discord: the bot on the word-writer host reads a reply (`yes 2`),
resolves `2` against the rendering the operator last received
(`operator.last-rendering.rows`), and comments on the decision's issue:
`kind: word · id: discord-<message id> · answer: yes · who · when`. It
reacts to the message with ✅ when the comment returns 201 (139). The
page posts to `flywheel serve` on the same host, which writes the same
comment with `id: page-<nonce>`. A board move, an issue close, or a
comment the operator types on the issue is read from the issue timeline
as a `word.direct` (143): the decision's parent consumes it with the
timeline event id as the word id.

## 6. The control plane — git-only profile

The full binding is `machines/bindings/git-only.yaml`. The shape:

- **One repository**, `flywheel-state`, whose `main` is the shared
  line and the only fact. Per-actor directories hold state, lease,
  mailbox, outbox and notes as recutils files; record tables sit beside
  them (§3). One repository, not one per book, so that a single fetch
  is the whole state and a single push is one atomic transition (144).
- **A change of state is a commit** on `main`, carrying `effect:`,
  `reason:` and `evidence:` trailers (145, 151). The push is the
  compare-and-swap (146): a host commits on the `main` it fetched and
  pushes without force; the git host rejects a stale base; the loser
  fetches, drops its commit, and re-runs the tick over the new head.
  Since it holds the lease on everything it writes, the only commits it
  can lose to are another host's writes to *other* actors, so the rerun
  produces the same transition on a new base.
- **A lease is a commit that lands** on `lease.rec` (147). Two hosts
  taking the same root make two commits with the same base; one push
  wins; the other is rejected and, on fetching, sees the winner (S17).
- **Heartbeats** are one commit per host on `refs/heads/hosts/<host>`,
  amended and force-pushed every three minutes. History never grows;
  the committer date is the liveness (§10.15). Expiry: heartbeat older
  than 15 minutes.
- **Notify** is the git host's push webhook on `main` to the serve
  host, relayed on Discord; every host also polls `git ls-remote` every
  60 s and fetches before every tick (149, 150). No tick decides on a
  read older than 60 s.
- **The status view** is `status/index.html` on `refs/heads/status`,
  one amended commit, rewritten by the serve host after any write under
  its leases and by any host after a takeover. It is readable with no
  host running through the git host's raw file URL — a repository read,
  which is inside what the git host may be depended on for — and it
  says the sha and time it was built from (132, S20).
- **The word** returns through one named writer: the Discord bot and
  page server on the host with role `word-writer`, which write
  `words/<id>.rec` in one commit and push; the ✅ reaction (or the
  page's "recorded" mark) is written only after the push lands (148).
  If that host is down the word waits in Discord; on return the bot
  reads channel history from the last message id it recorded in the
  operator actor, and each message becomes the same file it would have
  been.

### 6.1 A disconnected host

May: keep ticking every root it holds against its last fetched `main`;
commit locally on `main`; start, observe and retire its own sessions;
open decisions on its own actors; perform world effects on its own
places. May not: take a new lease, renew its heartbeat (it cannot push;
it will look stale and may be taken over by the rule), apply a word (a
word is on `main`, which it cannot see), or present the plan. On
reconnect it fetches and rebases its local commits onto the new `main`.
Files it holds leases on have no other writer, so the rebase is clean
unless its lease was taken over, in which case `lease.rec` conflicts;
it then discards every commit under that root, stops the root's
sessions (`host.yaml`, the fenced clause), and reports (136, S18).

### 6.2 The layout, one object

```
actors/bolt/atlas/b-0142/
  state.rec          id kind version state seq epoch + fields
  lease.rec          holder epoch taken
  outbox.rec         effects not yet shown by the world
  mailbox/
    unit_atlas_b-0142_u-3/4/1.rec     one pending message
  notes/
    0007.md
decisions/bolt/atlas/b-0142/close/9f2a/state.rec
```

Directory ids use `/` for hierarchy and encode the sender's `/` as `_`
inside a message file name, so that a mailbox is a flat directory.

## 7. How the plan is derived

### 7.1 A row is an actor awaiting a message

A plan row is a `decision` actor in `open`. Its id is
`decision/<parent>/<kind>[/<key>]`, chosen by the parent's `decisions`
block. The plan at any moment is:

```
rows     = list(decision, state = open)
classes  = group rows by class: approve · decide · answer
numbers  = 1.. over rows sorted by (class order, parent kind order, parent creation seq)
attention = operator.attention ++ report entries of severity attention not yet rendered
since    = operator.since(operator.last-rendering.point)
```

`plan.present` renders that and `rendering.mark` records the point and
the `{number: decision-id}` map, so that `yes 2` an hour later still
resolves to the decision row 2 named then (13, 16). Nothing in a
process is consulted; a restart derives the same plan (6, I7).

### 7.2 What makes a row impossible to miss

Every `decision.open` sits in a parent clause, and the clause is one of
two shapes:

- **Opened by a tick predicate** (`unit/approve` while proposed;
  `bolt/close` when every unit is merged; `bolt/claim-moved` when a
  cited claim's standing version is newer; `intent/close`;
  `org/host-stale`). The predicate is over `read` and `list`, so the
  row is re-derived on every tick until the decision actor exists, and
  the actor's id makes the re-derivation a no-op once it does. A host
  that missed the moment sees the condition on its next tick.
- **Opened in the same write as the message that made the situation**
  (`work-item/answer` on `session.exited blocked`; `elaboration/idle` on
  `session.idle`; `offer/finding` on the offer's first tick after the
  session's exit record spawned it). The message is consumed and the
  decision spawned atomically; there is no state in which the fact is
  recorded and the row is not.

Retraction is the same in reverse: a `withdraw` in the clause that
makes the decision moot (a new unit approved withdraws the close; the
session working again withdraws the idle row), and the row kind's
`retracted-by` names it (8, I3). Answered decisions stay as records:
`self/approve never answered` is a predicate, so an approval is never
re-asked (5, S1). A keyed decision (`close/<digest of merged units>`) is
a genuinely new question when the key changes, and the previous
answer stays attached to its key.

### 7.3 Yes to all, and the count

`yes all` answers every row of class `approve` and nothing else; the
word writer expands it to one Word record per decision (10). A chore
group is several `offer/chore` decisions rendered on one line with pick
letters (`4 pick a c` → two words). ATTENTION and SINCE are outside
the count and are not decisions; the `host-stale` row is the one
attention entry that takes a word, and it is a decision of the org.

## 8. How planning finds bolts

Planning is an actor per built repository (§10.10), a root, and it runs
as a session with a closed input set (77). The set is assembled by
`planning.yaml`'s `idle → running` clause:

| input | atom | what it holds |
|---|---|---|
| backlog | `ledger.backlog(repo)` | every standing claim in scope with no satisfied or not-applicable verdict at the standing version, plus verdicts whose evidence is gone (89) |
| verdicts | `ledger.verdicts(repo)` | latest per claim, so the session reuses rather than re-judges (88) |
| as-built | `asbuilt.statements(repo, head)` | what the software does, each statement naming `claim@version` (86) |
| open bolts | `actor.children(repo/<r>, bolt, [open, closable])` with each bolt's units and the claims they cite | what each open bolt already holds (26) |
| requests | `planning.requests` | routed findings, asks, redo notes, `bolt.landed` |
| baseline | `ledger.verdicts(repo)` empty | the first run for a repository (91) |

The session proposes units; each names `target: {open: <bolt-id>}` or
`{new: <proposed name>}`. The applying clause spawns each unit in
`proposed` with that target, and the unit's `approve` row shows it (14).
The operator's routing words (`bolt <name>`, `new bolt <name>`,
`rename <name>`) change the unit's `target` and reopen the same
decision id, so the yes that follows is the approval and the routing
words are recorded as the answers before it (S27). A `{new: name}`
target becomes a real bolt only when the unit is approved: the unit's
approve clause spawns `bolt/<repo>/<id>` in `proposed`, and the bolt's
first `unit.approved` message creates the line (4, 27). The name is a
field; the id is a sequence number the repo assigns.

What tells planning the backlog changed: nothing tells it. `ledger.digest`
is derived on every tick from the ledger, the standing claims, the
requests and the claim moves against open bolts, and `idle → running`
fires when it differs from `last-digest`. Messages (`route`, `redo`,
`bolt.landed`) enter the digest through `requests`, so they change it
too; they shorten the wait and are never the only way (25, 117).

## 9. Lines and places

### 9.1 The rule

Both sides are the same shape (42):

```
blueprints repo:  shared line ── intents/<id> ── elab/<id>/<n>      (elaboration place)
built repo:  shared line ── bolts/<id> ──── wi/<id>/<n>         (work item place)
                                       └─── operator place at the bolt line's head
```

A **line takes its parent** (`line.take-parent`, a merge the machinery
performs) at three moments (43): when a place is first made off it
(`elaboration approved → placing`, `work-item queued → placing` while
`line.behind-parent`); before it lands (`bolt closable → landing`,
`intent closing`); and on the repository's cadence (`take-cadence`, a
cron expression in the manifest, checked by `cadence.due` against
`last-take` on every tick, only when nothing is merging and no place
is being made).

A **place takes its line** (`place.rebase`) after any sibling place
merges into the line (`bolt.item.merged` sends `line-moved` to every
sibling item in a stage) and after a cadence take. The item forwards
`rebase-when-idle` to its sessions; a session acts on it only in
`idle` with `place.clean`, then `session.deliver`s a note saying what
moved (44, 60, I5). A working session's place is not touched (S32).

**A conflict never leaves a half-done tree** (45): `place.rebase`
returns `conflict` after aborting, the session actor reports
`rebase-conflict` to its item, the item goes to `conflict`, counts a
retry, and delivers the conflict as a job to the same session in the
same place. When that session exits done the item rebases again. Past
the type's retry bound the item stops and opens a `stopped` row. A
line's own take that conflicts (`line.take-parent` → conflict) leaves
the line untouched and is reported; the bolt's chore unit collects it
as a job on the bolt's line.

**What proves a place is current** before a session starts: the
`placing → staged` (and `placing → running`) clause requires
`place.exists`, `place.current` (the line's head is an ancestor of the
place's HEAD, `git merge-base --is-ancestor`), and `place.clean` (no
rebase or merge in progress, no uncommitted change). No session starts
in a place that is behind its line (I16).

### 9.2 The operator's place

Every open bolt has `operator-place`, a worktree at the line's head
made by the bolt's first `unit.approved` and rebased after every merge
and every take (40). No session is ever given it; processes started in
it are tethered to it (`wt tether`) and its ports hash from it (41), so
the operator runs the bolt beside the items' places on one host (S28).

### 9.3 Publishing a place

A place is a worktree on the holder's disk; its commits are host-local
until merged. To bound what a host loss costs, the session actor
publishes the place on every exit record (`place.publish`, an effect
added to the registry by this pass: `git push -f origin
HEAD:refs/places/<place>`, idempotent by ref). A takeover host makes
the place at `refs/places/<place>` when it exists and at the line's
head otherwise. What is lost is at most the work since the last exit,
and the stage restarts; a merged item is never lost because the merge
pushed the line.

### 9.4 Refusals

Every place is made with hooks (`pre-push`, `pre-commit` on protected
refs, a `wt` guard on worktree creation) that refuse a session's attempt
to create a branch, push a line, merge or land, and write a Refusal
record to `.flywheel/refusals.rec`. The session actor reads it as
evidence and reports it (39, S15). The session's own commits inside its
place are the one thing the hooks admit.

## 10. The questions of section 10

### 10.1 Which objects carry a machine, and how do the machines relate?

Every durable object is an actor and every actor carries a machine:
org, host, operator, repo, intent, elaboration, curation, planning,
bolt, unit, work-item, session, offer, decision. The things that are
attributes rather than actors: a claim (a fenced block in a chapter,
read as evidence), a verdict (a ledger record), a signal, a capture, a
move (records with no state of their own), a line and a place (git
objects, read as evidence and changed by effects), a chore (a `unit` of
the chore type, never its own kind), a landing (a field of the bolt or
intent plus `landing.result` evidence), and a stage (a field of the
work item, read from the type catalogue).

The machines relate by *supervision*, which is parenthood: a child's id
is prefixed by its parent's, a parent spawns its children, a child's
messages go to its parent, and the parent's supervision block decides
what happens when the child's attachment is lost. There is no nesting
of one machine inside another's states and no composition of
definitions; a parent reads a child's state through `actor.state` and
`actor.count` and a child reads its parent's fields through `parent.`.
That keeps every file a flat list of clauses and every clause
testable alone.

### 10.2 Where does event-driven behaviour meet reconciliation?

At the session actor. Below it is the world: a herdr pane, a worktree,
exit records. The session actor's tick clauses turn that evidence into
messages — `session.started`, `session.idle`, `session.exited`,
`session.lost` — and those messages are the only events in the system
that originate outside a transition write. Above the session actor
everything is either a message sent by a transition or a tick predicate
over the store. So reconciliation (the tick over evidence) *produces*
events, and events (messages) *drive* the durable machines; a durable
machine never reads herdr, and the session actor never decides what an
exit means (58). The one other reconciliation-to-event boundary is the
word writer, which turns a Discord message or a page choice into a Word
record; the decision actor's tick consumes it.

### 10.3 Where does the agent's free reasoning sit?

Inside the session's job and nowhere else. A session is given a place,
a work order, and an instruction set (77); what it does with them is
its own. Its exits are kept to the fixed set by three things: `flywheel
exit` is the only way to write `exits.rec` and validates against the
`Exit` descriptor (`done | blocked | finding | chore | signal`, plus
`stalled` which only the machinery writes); the session actor's clauses
match only those kinds, so an unknown record is reported and ignored;
and the place's hooks refuse every act on a line (§9.4). A session
cannot reach the control plane at all: it has no token, and the
machinery's own commands refuse to run inside a place with an active
session id.

### 10.4 How is the plan derived, and what makes it impossible to miss a row?

Answered in §7. Rows are actors; `list(decision, open)` is the plan;
every opening is either a tick predicate re-derived until the actor
exists or the same atomic write as the message that made the
situation.

### 10.5 What is the minimal set of stores, and what proves each state?

Nine stores (§3): actor state, mailbox, outbox, lease, heartbeat, word
and dictation, ledger, signals (with captures and moves), notes and
report, and the session's exits in its place. For every state of every
actor the proof is the actor's State record in the store the profile
names; the record's `evidence` field says what the transition was
decided on. The tracker issue body, the status view, the plan rendering
and the board are projections. Drift is detected by seq (tracker body)
or by the built-from sha (status page), and the next tick rewrites the
projection from the source; a projection is never patched by hand (66,
129).

### 10.6 How does curation connect without the flywheel batching signals?

Curation is one actor with a cadence and a threshold, and it reads
signals only through one atom, `signals.unmoved()`, whose answer is the
set of Signal records with no Move record. The actor does not batch:
adapters append signals at any rate; the actor's `idle → running`
clause fires when the cadence is due or the count passes the threshold
and hands the exact ids to one session, which judges them. A person
writing Move and Intent records by hand is the same actor's applying
clause done by hand (97). Curation never opens an intent; it spawns one
in `proposed`, which is a row (96).

### 10.7 Where does the ledger live, who writes a verdict, and how does a stale verdict become a row?

The ledger is `ledger/<repo>.rec` on `flywheel-state` `main` in both
profiles, append-only, latest verdict per claim. A verdict is written
by the machinery from a session's judgment: the work item's `judging`
clause records the verdicts a review stage's exits carry (87), and
planning's applying clause records the scope and existing-code verdicts
its session made. No process computes a verdict.

A verdict falls stale when its claim's version moves or its evidence
reference is gone from the as-built. Both are read, not stored:
`ledger.backlog` includes such claims, so `ledger.digest` moves, so
planning runs, so a unit is proposed, so an `approve` row opens. A
moved claim cited by an open bolt is a second, immediate row: the
bolt's `claim-moved` tick predicate compares each cited version with
`claims.standing()` on every tick (90, S9). Neither row depends on
anyone noticing the change.

### 10.8 Which profile is built first, and what proves a second conforms?

Git-only first. It has the smaller surface (one repository, one push
primitive, one webhook), its single-writer guarantee comes from the git
host with no added mechanism, and every record table the tracker
profile needs is already its layout. The tracker profile then adds one
`ControlPlane` implementation and reuses the tables.

The proof a second profile conforms is `flywheel conform --profile
tracker` running `conformance/` unchanged: the same scenario files,
the same definitions, the same expected transitions, effects and rows,
against the real service. A profile is admitted when every scenario
passes and every atom name in `atoms.yaml` has a line in its binding
(127, 152).

### 10.9 Where is the line between an engine primitive and a domain atom?

§4.1. The engine has primitives for what every actor system needs:
inputs, clause choice, writes, leases, supervision, presentation of
`presented` kinds. Everything that asks about or acts on the flywheel's
objects is an atom. A new need goes to the domain side whenever its
name would be a flywheel word; it goes to the engine only when it is a
new kind of input, guarantee or policy that a definition about
anything else would also need, and then B.1 is amended first.

### 10.10 Where does planning sit?

A machine per built repository, a root actor `planning/<repo>` spawned
by the repo actor. Not a stage of the bolt, because planning sees every
open bolt and proposes units for several; not an elaboration type,
because it runs on the built side against the ledger. What tells it the
backlog changed is the derived digest (§8); it sees the open bolts
through `actor.children(repo, bolt, [open, closable])` and their units'
`claims` fields.

### 10.11 What is the cadence rule, and what proves a place is current?

§9.1: first place, before landing, and `take-cadence` per repository;
`place.exists ∧ place.current ∧ place.clean` before any session
starts.

### 10.12 Claims: OpenSpec blocks by anchor, or fenced blocks with a hash lock?

Fenced `claim` blocks inside the chapter that explains them, with a
hash lock. The block carries `name`, `version`, `scope`, `scenarios`
and the statement; `flywheel claims index` generates `claims.rec` with
the lock as the sha256 of the normalized block text. The archive step
refuses a text change whose version did not move, so version moves
only when text moves (84). OpenSpec requirement blocks are what the
built side's as-built statements are written in, each tagged
`claim: name@version`, so the two sides meet by name and version
without an anchor into the book. An anchor would let the chapter and
the claim drift apart on a rename; the fenced block keeps them one
source.

### 10.13 What is the layout of state in git, and what does a race look like?

One repository, one shared branch, one directory per object with one
file per store (§6.2). Not one branch per host merged into main,
because a merge would be a second write of the same fact and the push
compare-and-swap already gives single-writer; not one file per state
change, because the commit is the state change and history holds it.

A race: hosts A and B both fetch `main` at sha `m1`, both see
`bolt/atlas/b-0143` with no holder, both commit `lease.rec` on top of
`m1`, both push. The git host accepts the first push and rejects the
second as stale. B fetches, sees A's lease, discards its commit, and
takes the next free root. If both hold different roots and write
different objects on the same base, the second push is still rejected;
B fetches and rebases its commit, which touches only files A did not,
and pushes again. No merge commit is ever made on `main`.

### 10.14 How does the phone reply become a commit, and how is the status page served with no central process?

§6.3. The bot on the word-writer host commits `words/<discord message
id>.rec` and pushes; the ✅ reaction is written after the push lands.
The status page is `status/index.html` on `refs/heads/status`,
rewritten by the serve host after any write under its leases, and by
any host after a takeover; it is read through the git host's raw file
URL with the phone's token, and it says the sha and time it was built
from. Between the last host stopping and the next starting the page is
what it was at the last write, which is what 132 asks for.

### 10.15 How is history kept from growing without bound?

- Heartbeats are one amended commit on a per-host ref, force-pushed;
  `main` never sees them.
- Leases change only on take, release and takeover, not on renewal.
- The status page lives on its own single-commit ref.
- Verdicts are appended only when a session judged (I10); `ledger.rec`
  grows by real judgments only.
- Mailbox files are deleted by the consuming commit; history keeps
  them, as it should.
- Ticks that change nothing write nothing (67).
- `main`'s history is the audit record and is meant to grow with
  events; a yearly `git gc` and, if ever needed, a shallow re-root of
  `flywheel-state` with the old history archived, are operator chores.

### 10.16 What replaces a tracker's comment thread in git-only, and how does a session leave a note?

`actors/<kind>/<id>/notes/<seq>.md`, one file per note with the `Note`
header, appended by `note.append`. A session writes to
`.flywheel/notes.rec` in its place with `flywheel note`; the session
actor's tick reads it and appends a Note to the parent (the item or
elaboration), so the operator sees it on the status view and on the
item's page. A question and its answer are two notes on the item as
well as the `answer` decision's record (131).

## 11. The scenarios

Each walk names the actors and their states, the messages, the effects,
the rows opened and retracted, and the records written. Ids are
abbreviated after first use. "Row" means a `decision` actor in `open`.

### S1 — an elaboration approved from the phone

- Rows: `decision/intent/atlas-provider-limits/propose` open, class
  approve, listed as row 1 in the 07:40 rendering.
- Word: the operator replies `yes 1`. The bot writes
  `word/discord-…` naming that decision. Decision `open → answered`:
  `word.consume`, `decided{propose, yes}` to the intent, one write.
- Intent `open`, on `decided`: spawns `elaboration/…/1` in `approved`
  with `source` = the finding, clears `proposed-elaborations`.
- Elaboration `approved → placing`: `line.take-parent` if behind,
  `place.ensure(blueprints, intents/…, elab/…/1)`. Next tick
  `placing → running`: spawns `session/…/1` in `requested`.
- Host tick: slot free → `start`; session `requested → starting`,
  effects `work-order.render`, `session.start`. Work starts.
- Nothing later re-asks: the decision is `answered`; the intent's
  `propose` predicate requires `not decision.open(self/propose)` and
  there is no second `propose-elaboration` message. A second `yes 1`
  is the same word id and a no-op. A restart re-derives the plan and
  finds no open decision for it.

### S2 — a standing prototype goes idle

- Elaboration of type `prototype` (`ending: standing`) in `running`;
  its session in `working`.
- Session tick: `session.process == idle` → `working → idle`, sends
  `session.idle{at}`. Elaboration `running → idle`: sets `idle-since`,
  `decision.open(idle, <at>)`. Row: "idle prototype plan-derivation ·
  standing · idle 14h → finish · keep".
- No effect touches the process: the standing type has `stall-bound:
  none` and `restart-bound: 0`, and no clause of the elaboration sends
  `retire` without a `finish` word (23, I6). The pane and its tethered
  servers stay up on the host.
- Next morning the row still stands; the operator opens the prototype
  in its place. `keep` → `idle → running` with no effect; a later
  idle opens a new row keyed by its own time.

### S3 — a chore offered and accepted

- Build session in `working` writes `exit/3 kind: chore about: blueprints
  repo: blueprints line: shared text: AGENTS.md stale` with `flywheel
  exit`, then finishes its job and writes `exit/4 kind: done`.
- Session tick: the chore exit spawns `offer/<session>/exit-3` in
  `offered` with `repo: blueprints, line: shared`; the session continues
  untouched (50). The done exit sends `session.exited{done}`.
- Offer tick: `decision.open(chore)`; row 4 "chores blueprints · 1 · a stale
  AGENTS.md → yes · pick a · no".
- Word `yes 4` → decision answered → offer `decided{chore, yes}` →
  `offered → accepted`, sends `chore.accepted{line: shared}` to
  `repo/blueprints`.
- Repo on `chore.accepted`: spawns `unit/blueprints/shared/<offer>` of type
  `chore` in `approved` with `bolt: none`, `approved-by: <word id>`.
  Unit `approved → building` (no deps): sends `go` to its one item.
  Item `queued → placing`: `place.ensure(blueprints, shared, wi/…)`;
  `placing → staged`: one `fixer` session. Session exits done; item
  `judging → merge-ready`; with `bolt: none` the item's `merge-now`
  comes from the repo's clause for shared-line chores: `chore.merge` =
  `landing.start(blueprints, wi/…, policy, id)`, and `merged` when
  `landing.result == passed`.
- No bolt actor was spawned (I8); the chore type has `change-directory:
  false`, so no OpenSpec change was created.

### S4 — a finding dropped

- Session writes `exit/2 kind: finding about: intent/atlas-…`. Session
  tick spawns `offer/<session>/exit-2 {kind: finding, thread:
  intent/atlas-…}` in `offered`. Offer tick opens `finding`; row
  "finding on intent atlas-… → elaboration · unit · drop".
- Word `drop` → offer `offered → dropped`, `outcome: dropped`. The
  intent never received `propose-elaboration`; no elaboration, no
  session, no place exists. The offer record and the exit record remain
  as the archive of the change (54).

### S5 — the machinery restarted mid-day

- Every host process stops. Panes in herdr are separate processes and
  keep running. Stores are unchanged.
- Hosts restart: fetch, list, re-adopt their own leases (same host id,
  same epoch, no write), tick. Every session actor reads
  `session.process` as before; every tick predicate reads the same
  evidence; every `decision.open` finds its id existing. No write is
  made (67). `list(decision, open)` is the same set; the rendering is
  identical and `rendering.mark` does not move because nothing differs
  from `last-rendering`.

### S6 — a slow start

- Session `requested → starting`: `session.start` (effect id
  `<session>/1/2`) issues `herdr agent start --name <session-id>`. The
  command times out at 30 s; the actor does not care about its return.
- Ticks: `session.process == absent` and `now − started ≥
  start-retry-interval` (60 s) → the clause re-issues `session.start`.
  herdr's start is idempotent on the pane name: a second issue finds
  the pane being created and returns it. At two minutes
  `session.process == working` → `starting → working`,
  `session.started` to the parent. One pane exists; nothing was
  reported (61).

### S7 — an intent's close

- Intent `open`; elaborations all `finished`; no `propose` open. Tick
  predicate holds → `decision.open(close, <digest of finished ids>)`.
  Row 7 "close intent loop-granularity · all 4 done → close · keep
  open".
- Word `7 close` → intent `open → closing`. Closing tick:
  `line.take-parent(blueprints, intents/…, shared)`, `archive.change`
  (OpenSpec archive on the line: the change's specs become the standing
  set), `landing.start(blueprints, intents/…, policy, <id>/1)`. Landing
  passes → `closing → closed`: `line.remove`, standing places removed,
  lease released. Records archived with the line; nothing else moved:
  the only other actor that reads this is every planning actor's
  digest, which is S27.

### S8 — twenty signals from a meeting

- An adapter writes `captures/meeting-2026-09-02-atlas-sync.rec` and
  twenty `signals/…/01..20.rec`. `signals.unmoved()` = 20 ≥ threshold →
  curation `idle → running`: `place.ensure(blueprints, shared,
  curation/41)`, session spawned with the twenty ids and the claims
  index in its work order.
- Session exits done with deliverables: 20 moves, 2 proposed intents.
  Curation `running → applying → idle`: 20 `move.record`s (6 attach, 9
  drop, 5 join), two `actor.spawn(intent, …, proposed)`, `evidence`
  messages to the six intents attached to, a note on the planning
  actor of the challenged claim's repos.
- Two rows open (`intent/…/approve` for each), each showing weight
  from its `signals` field: "5 signals · 1 source · 1d". Every signal's
  move is a file the operator can read.

### S9 — a claim moved under an open bolt

- Build session on bolt `plan-rows` writes a finding about the intent
  that owns claim `providers/one-writer@3`. It is about another thread,
  so the session actor appends it as a Signal of kind `ask` (50);
  curation attaches it to the intent; the intent's `propose` row opens
  with a writing elaboration; the operator approves; the elaboration
  amends the chapter, the claim (now `@4`) and the map in one commit and
  exits done; the intent's close row opens; the operator closes; the
  line lands; `claims.standing()` now says `@4`.
- Bolt `plan-rows` tick: unit `status-writer` cites `@3`,
  `claims.standing()[…].version == 4` → `decision.open(claim-moved,
  providers/one-writer@3)`. Row 9 "moved claim … v3→v4 · bolt plan-rows
  cites v3 · 2 items in flight → amend bolt · land and follow".
- Planning's digest also moved (the `@4` claim has no verdict), so
  planning runs and proposes a unit; that is the follow-up.
- `amend` → bolt sends `redo` to planning, which proposes the amendment
  as units on this bolt; `follow` → a note; nothing in flight is
  rewritten or restarted by the machinery (90).

### S10 — a repository joins the fleet

- The manifest gains `new-repo`. Org tick spawns `repo/new-repo`; repo
  tick spawns `planning/new-repo` with `last-digest: none`. The digest
  of an empty ledger with claims in scope differs from `none` →
  `idle → running` with `baseline: true`.
- The session judges every claim in scope once: 11 unmet, 6
  not-applicable, 3 satisfied by existing code, and lists 8 chores and
  3 units. Applying (`baseline == true`): every verdict recorded to
  `ledger/new-repo.rec`, one `decision.open(baseline)`. Row 6
  "baseline new-repo · 11 claims unmet · 8 chores · 3 units → yes ·
  pick · later".
- The six not-applicable verdicts stay at the claims' versions; the
  backlog never includes them again (88).

### S11 — forty commits, no claim changed

- The built repository's shared line moves forty times. Nothing in the
  model reads the built repository's commits except `asbuilt.statements`
  and the `evidence` references of verdicts. The evidence references
  (spec paths and anchors) still resolve; no claim version moved; so
  `ledger.backlog` and `ledger.digest` are unchanged and planning's
  `idle → running` predicate is false on every tick. No verdict is
  written (I10); no decision opens; the plan does not change.

### S12 — the status view from the phone

- Tracker: the operator opens the project board `flywheel-next`; the
  columns are the four classes; each card is an issue whose body shows
  state, holder (from the root's lease comment) and the holder's
  heartbeat age. Git-only: the operator opens the raw URL of
  `status/index.html` on `refs/heads/status`; the page lists every
  bolt, unit, item and session by class, the holder, and the heartbeat
  age, and says "as of <sha> <time>". No host is involved in either
  read (119, 130).

### S13 — a host loses power mid-build

- Host `mac-mini` holds `bolt/atlas/b-0142`; item `u-3/1` is `staged`
  with a build session `working`. Power is lost. Its heartbeat ref
  stops moving.
- Host `studio` ticks: `lease.holder(b-0142) == mac-mini`; it does not
  touch the bolt. After 15 minutes `lease.expired` is true; the status
  view shows the bolt, item and session with holder `mac-mini · last
  seen 41m`. Org tick opens `host-stale/mac-mini+3`; ATTENTION shows
  "host mac-mini last seen 41m · holds wi-#418 → takeover on studio ·
  wait".
- If mac-mini returns first: it re-adopts its lease (same epoch), the
  session actor reads `session.process == absent` (herdr did not
  survive the power loss) → `lost` → item `staged → placing` with
  `retries + 1`, the place still exists on disk and is current, and
  the stage restarts. The org withdraws the attention row.
- If the operator says `takeover`: org sends `takeover{from: mac-mini,
  epoch: 3}` to studio; studio's `lease.take` bumps the epoch to 4;
  the session goes `lost`; the item re-places at `refs/places/…` or
  the line's head; the stage restarts once on studio. When mac-mini
  returns its writes carry epoch 3 and are refused; its fenced clause
  stops its orphan panes. The build never ran twice (135).

### S14 — sent back twice, passes the third time

- Item type `default`, `retry-bound: 2`. Review stage exits
  `not-done` → `judging → placing`: `send-backs + {review → build,
  reason}`, `retries: 1`, `stage: build`. Build runs (`build-2-builder`),
  exits done; review runs (`review-2-reviewer`), `not-done` again →
  `retries: 2`, `stage: build`. Build 3, review 3 exits done →
  `records-verdict` writes the verdict → `merge-ready` →
  `merge-request` to the bolt → `merge-now` → `merging` → `merged`.
- Bolt: every unit merged → `closable`, `close` row → word → landing →
  `landed`.
- The item's `ran` field lists all seven sessions by stage and
  `send-backs` holds both with `retries` 2 ≤ bound 2; a third send-back
  would have opened `stopped`.

### S15 — a session tries to create a line

- Session in `working` runs `git checkout -b feature/x && git push -u
  origin feature/x`. The place's `pre-push` hook refuses any ref that
  is not the place's own and appends a Refusal record. Session tick:
  `session.refusals` has an unseen record → `report.append(warn, …)`.
  The place was made by `place.ensure` before the session started, the
  session's commits are on the place's HEAD, and the repository's
  branches are unchanged; the item's merge is `place.merge-into-line`
  by the machinery.

### S16 — a dictated scenario

- The operator dictates "a unit with two independent items and a
  third that depends on both, host bound two: both run, the third
  waits". A scenario session (the `scenario` template) turns it into
  `conformance/scenarios/…yaml` with `given`, `when`, `then`.
  `flywheel conform --profile stand-in <file>` runs it against
  `fw-standin`, asserts the transitions, effects and rows, and writes
  the trace as a table the operator reads (S29 is that file).

### S17 — two hosts take the same unit *(git-only)*

- Both hosts fetch `main` at `m1`, where `unit/atlas/b-0143/u-1` has
  just been approved and its bolt `bolt/atlas/b-0143` has no lease.
  The unit is inherited; the race is for the bolt's root lease. Both
  commit `actors/bolt/atlas/b-0143/lease.rec` on `m1` and push. One
  push lands; the other is rejected as stale. The loser fetches, sees
  the winner's lease, discards its commit, takes the next free root.
  The winner ticks the bolt, the unit, the item, and starts one
  session.

### S18 — a host's network drops for an hour *(git-only)*

- Host `studio` holds `bolt/atlas/b-0142`. Its fetch fails; it keeps
  ticking against its last `main`, commits locally, runs the build,
  merges the item into the bolt's line locally (the line push fails
  and is retried as an outbox entry). It cannot renew its heartbeat.
  Other hosts see it stale after 15 minutes; with `takeover: never`
  they do nothing.
- On reconnect: fetch; rebase its local commits onto the new `main`;
  they touch only its own actors, so the rebase is clean; push lands;
  outbox pushes of the bolt line land. The status page is rewritten by
  the serve host. Nothing it did not own was written; the other hosts'
  commits in the hour are the base it rebased onto (149).

### S19 — the operator edits a state file by hand *(git-only)*

- The operator sets `state: closing` in
  `actors/intent/loop-granularity/state.rec` and commits with their own
  author, pushes. Every host fetches before its next tick.
  `words.for` binds "a state.rec changed by a commit whose author is
  not a host" as a `word.direct` message with the commit sha as the
  word id. The intent's `word.direct` clause consumes it, withdraws its
  open decisions, and proceeds as if the close row had been answered
  (3, 143). The holder's next transition write rebases on the
  operator's commit as usual.

### S20 — the status page six hours after the last host stopped *(git-only)*

- `refs/heads/status` holds the page as rewritten after the last write
  under the serve host's leases. The page header says "as of
  <sha> · 2026-09-03 23:12". The operator's phone reads the raw URL.
  Nothing else exists to consult, and the page says so.

### S21 — a forwarded chat message

- The operator forwards a Discord message to the capture channel with
  the word `idea`. The bot writes `dictations/discord-<id>.rec {text,
  target: capture}`. The operator actor's tick applies it:
  `capture.record(discord/<channel>/<message id>, …)` and one
  `signal.append` with the assertion as the message text and a link
  back. No curation runs unless the threshold is reached; no row opens.

### S22 — the same transcript imported twice

- The import adapter computes the capture key from the source event
  (`meeting/2026-09-02/atlas-sync`). On the second day
  `capture.exists(key)` is true; the adapter writes nothing and the
  signal-reading session is not charged. One capture, signals read
  once (98).

### S23 — a proposed intent dropped

- Intent `proposed` with five signals; word `drop` → `dropped`; five
  `move.record(s, drop, intent id, 'proposed intent dropped by word
  …')`. `signals.unmoved()` no longer lists them; the next curation
  run's job names only unmoved ids, so it cannot see them (94, 104).

### S24 — a dropped signal revived

- Dictation `revive signal/…/07` → the operator actor's tick:
  `move.record(signal, revived, none, 'dictation …')`, which replaces
  the standing move with one curation treats as absent. The signal is
  in the next run's job.

### S25 — a claim amended, reviewed from the phone

- Writing elaboration commits the chapter, the fenced claim (version
  moved, lock recomputed) and the context map together, as the
  instruction set in force requires (107). `flywheel serve /review`
  renders `git diff <operator.last-reviewed>..shared` restricted to
  chapters and the map, with the changed claim blocks and map nodes as
  the entry points and the previous version beside (109). Nothing is
  stored for it; `reviewed{sha}` updates the operator actor when the
  operator opens it.

### S26 — a unit type added

- The operator commits `persona-tested` to `types/unit-types.yaml`
  (version 4 of the catalogue). Its test stage says `sessions: {rule:
  personas.matching, pattern: "personas/*.md"}`, `join: all`. The next
  unit of that type pins `type-version: 4` at approval. Its item's
  `placing → staged` clause resolves the set: three files → three
  sessions; five → five. `ran` records them; each session's exits are
  read as one set at the join; every finding, chore and signal is
  recorded by the session actor's clauses. A unit in flight under
  version 3 reads only its pinned version (49).

### S27 — one intent, two repositories

- The intent lands; two claims become standing with scope covering
  `atlas` and `switchboard`. Both planning actors' digests move; each
  runs once. `atlas` proposes two units with `target: {new:
  atlas-provider-limits}`; `switchboard` proposes one with `target:
  {open: bolt/switchboard/b-0090}`.
- The operator: `3 rename retry` → the atlas unit's target name changes
  and its row stands; `5 new bolt other` → the switchboard unit's
  target becomes `{new: other}`. Then `yes 3 5`: each unit's approve
  clause spawns its bolt in `proposed` and sends `unit.approved`; two
  bolts open with no order between them (27).

### S28 — a bolt open for three weeks

- Bolt `open`; after each `item.merged` the operator place is rebased.
  The operator runs the system there, finds a bug, dictates `unit on
  atlas/b-0142: status page drops the host column when narrow`. The
  operator actor's tick spawns `unit/atlas/b-0142/u-5` in `approved`
  with `approved-by: dictation/…` (11, 31, I1). Next day a finding from
  a session on `b-0150` names `b-0142`; the offer's `finding` row →
  `unit` → planning's `route` request → planning proposes
  `unit/atlas/b-0142/u-6` with deps → its row → `yes`. Both build; the
  close row opens when every unit is merged; the operator closes.

### S29 — three items, bound two, restart between

- Unit with items 1, 2, 3 where 3 depends on 1 and 2. Dependencies
  between items of one unit are the unit's `deps` over sibling units in
  the definition; the document here lists 3 as its own unit depending
  on the unit of 1 and 2. Both items go `placing → staged`; two
  sessions `requested`. Host bound 2: both start.
- Unit 3 is `waiting`. Items 1 and 2 merge; unit 1–2 goes `merged`;
  unit 3 `waiting → building`; item 3 `queued → placing → staged`;
  session `requested`. A restart happens here: the host re-adopts its
  lease, reads the session in `requested`, and `host.next-requested`
  returns it once; `session.start` is idempotent on the pane name. One
  session starts (29).

### S30 — a session exits blocked

- Build session writes `exit/3 kind: blocked question: …`. Session
  `working → blocked`, `session.exited{blocked}`. Item `staged →
  blocked`: `blocks + {stage: build, question}`, `decision.open(answer,
  hash)`, a Note. Row 10 "blocked wi-#418 build · plan-rows · '…' ·
  session alive → reply on page". The bolt's other items continue to
  merge (59).
- The operator answers on the page → decision answered → item `blocked
  → staged`, `blocks[last].answer`, a Note, `resume{answer}` to the
  session. Session `blocked`, process present → `working`,
  `session.deliver(answer)` while the pane is idle. The type's block
  count is `count(blocks)` over items of the type, moved by one.

### S31 — yes at 07:40, look again at 16:00

- Word at 07:40 → unit approved → items → sessions → stages → merges,
  all by clauses with no word (12). `rendering.mark` recorded 07:40.
  At 16:00 the plan's SINCE lists `operator.since(07:40)`: the items'
  `merged`, the unit's `merged`; the only new row is the bolt's `close`
  (35). Nothing was nudged: no clause of any actor waits for anything
  but a message, evidence, or a decision of class approve/decide/answer.

### S32 — two units side by side, one merges

- Items A and B `staged`, sessions `working`. A exits done, review
  passes, `merge-ready → merging → merged`; bolt on `item.merged`
  rebases the operator place and sends `line-moved` to B. B's item
  forwards `rebase-when-idle` to its session, which is `working`: the
  clause records `rebase-pending` and does nothing (60, I5).
- B's session goes `idle`: the session's `rebase-when-idle` clause
  fires: `place.rebase` → `conflict`, aborted; `rebase-conflict` to the
  item → `conflict`, `retries: 1`, the conflict delivered as a job.
  The session resolves it in its place and exits done; item
  `conflict → staged`, `place.rebase` clean; the stage completes;
  merge retries and lands.

### S33 — a bolt takes the shared line each morning; the landing fails

- `take-cadence: "0 6 * * *"`; every tick at 06:00 with `merging ==
  none` fires `line.take-parent`, sets `last-take`, rebases the
  operator place, sends `line-moved` to items in a stage.
- `closable` → word `yes` → `landing`: `line.take-parent` once more,
  `landing.start(pull-request)`: `gh pr create` then `gh pr merge
  --auto`. The gates fail: `landing.result == failed` → `landing →
  open`, `landing-failed: <reason>`, `decision.open(land-failed,
  <landing id>)`, a Note. No session is asked anything; `retry` reopens
  the close (36).

### S34 — a research elaboration and a standing prototype on one intent

- Research (self-closing) session exits done → elaboration `running →
  merging`, `retire` to the session; merging tick:
  `place.merge-into-line(elab/…/1, intents/…)`, `place.remove` →
  `finished`. The line moved, so the intent sends `line-moved` to the
  prototype elaboration, which forwards `rebase-when-idle`; the
  prototype's session is idle; `place.rebase` clean; the place is kept
  (47).
- The close row opens (`actor.count(elaboration, finished) > 0`, none
  in progress — the standing prototype counts as `idle`, which is in
  the not-finished set, so the close row waits for `finish`). After
  `finish` and its merge, the close row opens; `close` → closing →
  archive → landing passes → the two claims are standing on the shared
  line; every planning actor in scope runs.

## 12. Decisions this pass made

Decisions the requirements left open, recorded so they are not
re-argued. Each is reversible by editing a definition file.

1. **Roots are org, intent, bolt, planning, curation.** A bolt's items
   all build on the bolt's holder; a host that is at its bound queues
   the bolt's sessions in request order rather than spilling them to
   another host. Correctness over throughput.
2. **The takeover rule defaults to `never`**; the operator's word on
   the `host-stale` row is the takeover. `after <duration>` is a field
   of the org for operators who prefer it.
3. **Places are published on every exit** (`place.publish` to
   `refs/places/<place>`), so a takeover restarts a stage from the last
   exit rather than from the line's head.
4. **`with-operator` ends only by a dictated `finish`.** Presence
   cannot be evidenced, so the machinery never asks.
5. **Heartbeats and the status page live on single-commit refs**, not
   on `main`.
6. **Claims are fenced blocks with a hash lock**, not OpenSpec
   requirement anchors.
7. **The tracker profile takes leases by ordered comment**, the one
   mechanism GitHub does not give.
8. **Git-only is built first.**
9. **A chore on the shared line is a unit under the repo actor**, with
   `bolt: none`, so the chore type has one definition on both lines.
10. **The status page in git-only is read through the raw file URL**,
    not GitHub Pages, so the git host is used only for repositories,
    pushes and webhooks.

## 13. The diagrams

Four pictures under `diagrams/`, one per actor family, each stating
its claim in the title and validated with `xmllint`, `measure.py` and
a rendered check.

| file | family | claim | rows and ledger |
|---|---|---|---|
| `actor-kernel.svg` | kernel: org, host, operator, decision | an actor is a name over stored state; a host runs it under a lease and remembers nothing | decision actors are the plan; `decision.open` is in the transition write; the ledger is one of the record tables |
| `actor-design-side.svg` | intent, elaboration, curation, offer, session | signals become intents and standing claims; every row is a decision actor with one opening and one retracting clause | approve, propose, close, idle, answer and finding rows placed where their clauses fire; the ledger is never written here, only its digest moves |
| `actor-construction-side.svg` | planning, bolt, unit, work-item, session | one yes drives unit → items → stages → merges → close row; planning reads the ledger, the review stage writes it | unit, close, claim-moved, land-failed, answer, stopped and chore rows; `verdict.record` from the review stage and from planning's applying step |
| `actor-word-path.svg` | the word in transit | one reply becomes one record keyed by its message id, consumed by one decision actor in one write | a trace of S1/S31 across a restart and a duplicate delivery |
