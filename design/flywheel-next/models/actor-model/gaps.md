# Gaps — requirements not satisfied, satisfied only in part, or found contradictory

By requirement number. "Decided" means the model chose a reading and
`model.md` §12 records it; "open" means the requirement cannot be met
as written and says why.

## Contradictions and near-contradictions

- **45 vs I1** — "the conflict becomes a job for a session in that
  place … the machinery retries the take when the session exits done"
  covers a *place* rebase cleanly (the item's session already exists).
  For a *line* take (`line.take-parent` on the cadence or before
  landing) there is no session and no place; a job the machinery makes
  on its own is work without an approval (I1). Decided: a conflicting
  line take is offered as a chore on the bolt, keyed by the shared
  head; the operator's yes is the approval and the chore session
  reconciles in a place off the bolt's line. The line stays behind
  until the word. The pre-landing take's conflict therefore blocks the
  landing on a row, which is 45's "waits on the operator" one step
  early.
- **3 / 143 vs 138** — a direct act on the state (a hand edit of
  `state.rec`, a board move) is the word, but 138 asks the word to be
  recorded "with the row it answers" before work follows. A direct act
  answers no row. Decided: the commit sha or timeline event id is the
  word id, the object is the one edited, and `row` is empty; the
  decision actors the act makes moot are withdrawn in the consuming
  write.
- **22 (with-operator) vs 64** — "neither ends it nor asks about it
  while the operator is present" needs presence as evidence; no store
  or tool gives it (herdr reports the pane's process state, not who is
  looking). Decided: a with-operator elaboration is never asked about
  and ends only by a dictated `finish`. If the operator walks away for
  a week nothing offers it; the status view shows it idle.
- **29 vs 134** — "ready work waits in a stated order" is satisfied per
  host (request order); with root leases on bolts, a bolt's items wait
  on the bolt's holder even when another host has free slots. This is
  a stated narrowing (§12.1), not a contradiction, because scheduling
  across hosts for performance is a non-goal (§8), but an operator with
  one large bolt and two hosts will notice it.
- **120 vs a place's commits** — durable covers what a write reports
  as written; a session's commits in its place are host-local until
  published. Decided: publish on every exit (§9.3). The work since the
  last exit is lost with the host; the requirement is met for state and
  narrowed for places.

## Satisfied only in part

- **41** — ports derived from the place and processes tethered to it
  are worktrunk's (`wt tether`, portless); the model requires the rule
  and binds `place.ensure`/`place.remove` to it but does not model a
  repository's own server instructions.
- **82 / S16** — the grammar of a dictated scenario and the `scenario`
  session template are named, not specified. The conformance files
  show the target shape.
- **118 (tracker)** — GitHub's issue search index is eventually
  consistent; a `list` by title prefix can miss an issue created
  seconds ago. The binding uses `GET /repos/…/issues?since=` with a
  local title filter for `list`, and a direct title lookup for the
  spawn no-op check, never search. Latency is inside the 60 s notify
  bound; it is still a weaker `list` than git-only's directory read.
- **119 / 130 (git-only)** — the status page is readable with no host
  through the git host's raw file URL of a private repository, which
  needs a token on the phone. Readable, but not by an unauthenticated
  link; GitHub Pages was rejected because the git-only profile may
  depend on the host only for repositories, pushes and webhooks
  (section 9).
- **140** — rich Discord controls (buttons, select menus) are bound to
  the same Word records the reply grammar produces; which rows carry
  which controls is a rendering choice left to the bot's template and
  not modelled.
- **133 "what landed in a period"** — derived from bolt and intent
  actors in `landed`/`closed` and the date of the transition write
  (commit date in git-only; comment date in tracker). Works; there is
  no `landed-at` field, so the derivation reads history rather than a
  record.
- **61 / S6** — assumes `herdr agent start --name` is idempotent on
  the pane name (a second start finds the first). If herdr does not
  give that, the binding must read `herdr agent status` immediately
  before every start, which narrows the window without closing it.

## Predicates the definitions still write in prose

The `when` language (§4.3) accepts only atom calls. These clauses still
carry prose and need an atom or a rewrite before the loader accepts
them; each is a small addition to `atoms.yaml`:

- `bolt.yaml`: "exists unit u of self citing claim c@v" → `unit.cites`;
  "digest of merged unit ids" → `actor.digest(children, states)`.
- `work-item.yaml`: "stage has a next stage" / "stage is last" →
  `stage.next`; "self.state entered from merging" → a field
  `conflict-from`.
- `operator.yaml`: `apply-dictation` is a family of clauses, one per
  dictation target; the file lists them in a note rather than as
  clauses.
- `org.yaml`: "the freshest host" → `host.freshest`.
- `intent.yaml`: "for each group g in msg.text" (split) → the word's
  text parsed by the word writer into structured `groups`.

## Not attempted

- **C.3** — no third profile; the conformance suite is what one must
  pass.
- **Multi-operator** — one operator actor; a second operator's word is
  the same word writer with a different `who`.
