# Gaps — requirements not satisfied, or found contradictory

By requirement number. Each entry says what the model does instead and
why. An entry with **decision** is a judgment the operator may reverse
by a word on the file; an entry with **open** is unsatisfied.

## Part A

- **A.2.9 / S9 "offers two rows".** S9 says the next planning "offers
  two rows: amend the bolt, or land it and follow". The mockup's row 9
  shows one `claim-moved` row with two answers. **Decision**: one row
  with two answers, on the bolt, created by the citation region
  (`bolt.open[citations].moved`), not by planning. Planning follows
  the answer. A row per answer would double-count the same decision in
  the plan's count.

- **A.2.10 "yes all".** The bot expands `yes all` into one word per
  approve row of the rendering, each with its own id. If the rendering
  changed between delivery and reply, a row that is gone gets
  `word-unapplicable` and comes back under attention once. **Decision**:
  expansion at the bot; the engine never sees `all`.

- **A.4.22 with-operator "present".** "Present" is read as a human
  keystroke in the pane within 30 minutes (`herdr agent status`).
  There is no better evidence in the givens. **Decision**; the window
  is in the profile binding, not the machine.

- **A.5.29 "a stated order".** Ready work waits ordered by (unit
  approval time, item ordinal). Elaboration sessions, planning and
  curation are outside the bound: they are one session each and their
  count is small. **Decision**; if the operator wants them counted, the
  `item.slot_free` binding gains them with no machine change.

- **A.5.45 conflict job's session.** Which session works a take
  conflict on a bolt's line: the model uses a `fast` unit's build
  session with a conflict job, scoped to the seeded place. This
  creates a unit the operator did not approve. **Decision**: the
  conflict unit is created in `approved` with the bolt close word (or
  the cadence rule the operator set) as its approval that can be
  pointed to (I1). It is the weakest I1 case in the model.

- **A.6.50 finding "about the session's own bolt".** A finding about
  the session's bolt becomes a `fast` unit in `proposed` targeting that
  bolt (S28's "routed to it as a proposal"). The requirement says "a
  proposal on the plan for that thread" without saying unit or
  elaboration. **Decision**: unit on the construction side, elaboration
  on the design side.

- **A.7.61 "evidence that the session exists".** The pane by name is
  the evidence; herdr's refusal of a duplicate name is what makes the
  retry safe. If herdr does not refuse duplicate names, the profile
  must add the check (`herdr agent status` before start). **Open**
  until verified against herdr.

- **A.8.66 two stores that disagree.** Lines and places are proven by
  git while their retry counters are in the record. The model says git
  wins. The counters can therefore be one behind after a crash between
  the git effect and the record write; the effect id makes the repeat
  harmless. Stated, not eliminated.

- **A.11.77 "nothing else reaches it".** A session on a built
  repository reads that repository whole; the closed set is the
  `.flywheel/` inputs plus the repository at the place. Claude Code's
  own context (its global settings, the operator's `CLAUDE.md`) also
  reaches it. **Open**: the place's settings can deny reads outside
  the place but not unload the operator's global instructions.

- **A.12.82 dictated scenarios.** The dictation-to-data step is a
  session's judgment; the model provides the schema and the runner.
  Rendering "as a trace a person reads" is `<name>.trace.md`. The
  scenario language cannot express every guard (no arbitrary
  arithmetic) — the same limit as the machines.

- **A.13.83 coexistence.** The new flywheel's objects live in
  `flywheel-state` (tracker: its own repository's issues; git-only: the
  same repository as files). It never lists issues of other
  repositories, and it never reads the current flywheel's labels or
  milestones. Places are under a distinct worktree root
  (`~/flywheel-next/places/`). Sessions are named with a `fn/` prefix.
  Satisfied by scoping; the two share the books repository and the
  built repositories' shared lines, which they must.

- **A.14.84 one source.** Satisfied by the fenced claim block inside
  the chapter. The cost: an mdBook preprocessor
  (`mdbook-flywheel-claims`) and a pre-commit hook to write. Named,
  not built.

- **A.15.98 raw material outside version control.** The capture cites
  a `file://` or `https://` pointer. On a second host the pointer may
  not resolve; the model does not replicate raw material. Stated.

- **A.16.109 "since the operator last reviewed".** The mark is a word
  `reviewed` given on the review page; it is recorded on the books
  object's thread. There is no books object machine; the word is
  attributed to the organization's `plan` object. Slight stretch of
  "the word is recorded with the object it concerns" (B.6.138).

## Part B

- **B.1.117 notify bound.** 30 seconds by poll in both profiles when
  no webhook can reach the host. A host with no reachable URL and no
  poll would not converge faster than its 60-second sweep. Stated.

- **B.2.121 single writer, tracker profile.** GitHub gives no
  compare-and-swap on an issue body. The model adds the
  lease-by-ordered-append protocol (comment ids are totally ordered
  and creation is atomic) and a seq check on read-back. It is a
  mechanism the profile adds, as C.3.153 requires, and it is the
  decision in this model most in need of a test against the real
  service. **Decision**, flagged.

- **B.4.128 "which host runs it".** The host running a session is the
  lease holder of its owner; the model records `host` on the session
  record as well, from the effect. Both are shown.

## Part C

- **C.2 status "served without any host of the operator's running"
  against section 9 "the git host provides exactly this and no
  more".** A git host that offers only branch updates and a webhook
  cannot serve a page. The model commits `status.html` on `main` and
  says the operator reads it as a file of the branch (GitHub's file
  view, or a clone). If the file view counts as "another service of
  the host", S20 is unsatisfied in the strictest reading. **Open** as
  an interpretation; the model states it.

- **C.1 "an item per object" against A.15.100 signals.** Signals,
  captures, moves, claims and the ledger are files in the books
  repository in every profile, not tracker items. Reason: A.15.101
  requires stable, versioned file formats that adapters and pre-existing
  captures write without conversion, and twenty issues per meeting
  would be the plan's failure mode moved to the tracker. **Decision**:
  "every object's state" in C.1.141 is read as every object with a
  plan-facing lifecycle; the books-held objects are the same in both
  profiles (`profiles/books.yaml`).

- **C.2.148 the scribe when no host runs.** A phone reply given while
  no host is up is not a commit until a host starts; the bot replays
  the channel from the last delivered message id and the ids make each
  word exactly once. The operator sees no ✅ until then, which is the
  truthful signal (B.6.139).

## Section 7

- **I13 against `persona-test.yaml`'s `pattern: "personas/*.md"`.** A
  unit type file names a path pattern. It is operator data in the type
  catalogue, read against the repository being worked, not a store of
  the machinery's own. **Decision**: I13 is about the machinery's
  stores, services and fields; a rule the operator writes into a type
  may name what the operator's repository holds.

- **I14 "a host's memory and disk hold only what git already holds".**
  The place's `.flywheel/` (exit, offers, notes) is on disk and not in
  git until copied. The model treats it as "about to be committed"; a
  host lost before the copy loses an exit record, and the session is
  then `lost`, which the owner restarts. Stated.

## Section 9

- **"Small durable tables may be recutils files in git."** Used for the
  ledger, signals, moves, object records and threads. recutils has no
  Rust crate; the model parses the subset it writes (`%rec`, `field:
  value`, multi-line values by `+`) in `flywheel-domain`. Named.

- **`herdr agent` command surface.** The bindings assume `start --name
  --cwd`, `status <name>`, `send <name> <text>`, `stop <name>`, and
  last-activity and last-keystroke times in `status`. Not verified
  against herdr in this model.
