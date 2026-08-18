# Bolt notes — the audit log

Why this file exists: `tasks.md` is the checklist the conductor drives
construction from, and it had grown to 1706 lines because every ruling
arrived with its reasoning attached and nothing was ever removed. A task
list that must be read end to end to find the open work has stopped being
a task list.

So the reasoning lives here and the work lives there. A section moves here
once it holds no open task — the finding, the rule it produced, and the
evidence, kept because the next bolt inherits the lesson and not the
checkbox. Nothing here is actionable; if something here needs doing, it is
in the wrong file.

## The delta test
A bolt-level call, made once here rather than re-argued per proposal. Two
of these proposals edit a `CLAUDE.md` and split on whether that needs
requirement deltas. The test is **not** prose-versus-code:

> Does the text create a checkable obligation on artifacts other than
> itself? If yes it is a requirement and gets a delta with scenarios. If it
> only tells a reader where to look, `skip_specs: true` is right.

`books/CLAUDE.md`'s conventions pass — a book either carries a proposals
chapter or it does not, and a skill lints for it, so a scaffolded book can
be caught non-conforming. Root `CLAUDE.md`'s entry points fail — nothing
downstream can violate a pointer. A requirement reading "root `CLAUDE.md`
SHALL contain a section naming the schemas" is the plumbing-only spec this
bolt's own review bar tells reviewers to hunt.

`flywheel-session-profiles` and `flywheel-loop-skills` pass for a different
reason: they fix names other proposals read, which is a real cross-proposal
contract and exactly what a delta is for.

## The guard I demanded cannot fail
Round two, I bounced the books half for ordering its slug collection after
the deletions with only prose to order them, and demanded a guard: assert
every collected slug landed somewhere before any deletion runs. It was
added. It is the fifth instance in this bolt of a check satisfiable by doing
the wrong thing.

The guard asserts *every slug collected in 3.0* landed. **Collect the wrong
set and it passes.** And the set is wrong in both directions: eight files in
scope carry no slug at all, while `books/atlas-kit/src/verification.md` — out
of scope — carries eleven, **ten of which appear in no other surviving
file**. The guard goes green over ten slugs that vanish with the chapter.

The fix is to derive the scope from the chapters' own `###` headings rather
than from the carrier list, so the guard's input cannot be smaller than the
thing it guards. Recorded because I wrote the guard, specified its assertion,
and did not ask what its input was — which is the same omission as every
other instance of this class.

**Two rules came out of the fix, both better than the fix.** The agent named
its own pattern: *sizing work from the callers instead of from the thing
being deleted* — twice now in this proposal. Derive a population from what is
being removed, which is definitionally complete, not from what points at it,
which is neither complete nor sound.

And the guard now **re-derives its population independently** rather than
reading the port's output. *A guard that shares its input with the thing it
guards is not a guard* — it can only catch a failure to execute, never a
failure to scope, and scoping is where both errors were.

## What the re-reviews are catching
Recorded because it changes how the remaining rounds are run. Every
completed first review bounced, and the first completed **re**-review
bounced too — on three defects that did not exist before the fix. The
pattern is consistent: closing a gap under review pressure tends to
overshoot the decision, and the overshoot validates green and reads
fluently. A re-review scoped to "did the listed gaps close" would have
passed all three.

So every re-review in this bolt is briefed on two halves, the second being
*what did the rewrite break*, with a standing instruction to label each
finding as a first-round gap still open or a new defect. Those mean
different things about the agent and about the artifact, and only the
second kind tells you the review pressure itself is doing damage.

## Joint findings from the machinery pair — allocated
A reviewer holding both proposals found three things neither could see
alone. Allocating them is mine.

- [x] **the conductor-facing clause riding a moved passage** → `flywheel-session-profiles`.
      "Batch decisions into one artifact" moves whole into
      `flywheel-interactive`, and it ends "the consequences become appended
      tasks … *when the conductor folds them in*" — a statement about what
      the conductor does, landing in a skill whose own spec says a session
      reports an outcome and never appends a task. Both proposals' generating
      rule is that cross-role content is pointed at, not moved; the rule was
      applied to the table's rows and not to the sentence inside one
- [x] **root `CLAUDE.md`'s false `node_modules` claim** → `flywheel-entry-points`,
      which owns the file. `session-worktrees.md` tasks its **deletion**, not
      its correction, because the durable fix is the `wt.toml` hook and a
      narrowed sentence would document the workaround as the design. The
      `.config/wt.toml` half belongs to a separately released handoff and is
      not this bolt's
- [x] **the `ADR` task type** → routed to `intent-flywheel`, not allocated.
      The schema defines a fourth type writing into a built repo; the
      two-things rule makes every built-repo edit a handoff. Both cannot be
      followed, the vocabulary is live in three places, and the conductor
      requirement enumerates only three types — so a conductor meeting an ADR
      task has no stated move. It spans two proposals mid-review here, but
      the rule is the intent's and the schema text is downstream of it

## Routed to intent-flywheel
Design-level findings out of the spec round. Not bolt tasks, not fixed
here — relayed by herdr prompt on 2026-08-06 and recorded so the routing
is not lost if the answer is slow.

- [x] routed: `decisions/split-after-the-runs.md` calls the two conventions
      proposals unaffected by the split to `agentplot/flywheel`. Right about
      where the file lives, wrong about its contents — the flywheel section
      this bolt adds to root `CLAUDE.md` names `flywheel-inception`,
      `flywheel-construction` and `.claude/agents/`, all of which the split
      renames or relocates. The split bolt's re-edit list should gain it.
      Found by the `flywheel-entry-points` spec agent; carried in that
      proposal's `design.md` as a risk, not acted on
- [x] routed, **verified and quantified rather than relayed**: the books
      gate does not resolve intra-book link targets. A spec agent flagged it
      as a possibility from fourteen atlas-kit chapters linking
      `(proposals.md)` from subdirectories; I checked and
      `books/preview.py --check` reports ok on a tree holding **249 dead
      same-book links across 44 files** (cross-book `../<book>/` forms
      excluded as site-relative by design). About 45 have nothing to do with
      this bolt — chapters in subdirectories linking siblings as if they sat
      at `src/` root, and one book that does not exist. The retirement will
      incidentally clear four fifths of the dead links in the books and
      leave the hole that let them accumulate
- [x] routed: the settled name `flywheel-spike` crosses the repo's existing
      use of "spike" for the place throwaway code is built, so a prototype
      session builds in the spike repo and a spike session builds nothing.
      Conforming to the decision meanwhile — the naming decision settles the
      shape and lists the fifth name in passing without addressing the
      collision, and the same argument that moved the profile names applies:
      this is the moment before they harden across four surfaces and become
      the public invocation surface
- [x] routed: the release gate is both Discord-shaped and blocking.
      `the-gate-is-inline.md` puts it in the Discord cell;
      `human-loop-channels.md` defines that cell as non-blocking, with the
      agent continuing on whatever the answer does not gate. A release gate
      blocks by definition. The specs describe the gate faithfully to both
      records and say nothing about blocking, so a builder will hit it
- [x] routed: dispatch's relay half has no channel cell.
      `human-loop-channels.md` names triage as the Discord-first exception,
      but post-`dispatch-singleton-name.md` triage is only the sorting half
      — the relay half, escalations out and answers back, is equally
      Discord-shaped and uncovered by the matrix as written
- [x] routed: `design-session-steering.md` still carries "whether session
      types would be better as OpenSpec schema types" as an open question;
      `session-types-are-skills.md` settled it. Cleanup
- [x] routed, **the general form rather than two instances**:
      `split-after-the-runs.md` weighed the ordering on a reference count
      it explicitly qualified "measured against the current tree" — "four
      profile lines, two `SKILL.md` frontmatter names, one internal
      cross-reference, one line of `E2E-construction.md`, zero in the
      schemas, zero in `books/`". This bolt's whole job is to add
      references, and it invalidates that count in at least three places:
      root `CLAUDE.md` gains three, `flywheel-schema-instructions` puts
      seven into `flywheel-intent`'s `sessions` instruction against the
      "zero in the schemas" line, and `flywheel-loop-skills` adds more.
      That is not a defect in any proposal — the decision authorised
      hardening in place — but both the split bolt's re-edit list and the
      cheapness argument behind the ordering rest on a number this bolt is
      multiplying. The list should be derived when the split opens, not
      inherited from the count
- [x] routed, **needs attention rather than a decision**: five parked design
      books are untracked in the wrong repo.
      `books/aidlc-design/BUILDOUT_PROMPT.md:88` names
      `books/_automation-migrate/`, which does not exist in blueprints. It
      exists in willdan-marketplace — state-engine, conductor,
      session-orchestrator, issue-pipeline, hil-gateway — and `git status`
      there shows it `??`, beside `books/_superseded/` and a stray
      `levi.md`. Untracked is one `git clean` from gone. Outside this
      bolt's scope, and not something to move on a conductor's own
      initiative
- [x] routed: the handoff's "five deleted chapters" is wrong on disk — the
      aidlc-design rosters name one, `proposals.md`; the other four left
      when the chapters were deleted in `1b96a08`. The real drift is the
      reverse: both rosters omit three chapters that exist. `bolt.md`
      inherited the wrong phrasing from the handoff and is corrected — the
      criterion is that the rosters match disk
- [x] routed: `book-decompose-retires.md` says the family retirement covers
      `book-decompose` and no separate proposal is needed. True in intent,
      false in location — the skill lives inside
      `plugins/system-design-inception/`, the plugin the retirement must not
      take. It resolves cleanly in construction, but the record reads as if
      the skill were inside the retiring family
- [x] routed: `conductor-inception` has no decision covering it — an
      inception orchestrator that plans across workflows and decomposes
      intents, which is what dispatch and the intent conductor now do. It
      survives the retirement on the boundary as written (that boundary
      retires *construction* plugins) while looking superseded, and no
      record says either way
- [x] routed: `openspec-devportal` loses its only in-flow caller once
      `openspec-construction` goes. Its input still exists — bolts produce
      `openspec/changes/*` — but nothing invokes it. Whether the flywheel
      should call it, and from which loop, is undecided
- [x] routed: willdan-marketplace has no gate — no `.config/wt.toml`, and CI
      runs neither `tests/` nor the marketplace audit. Not a general
      grumble: it is how a stale `openspec-batch-orchestrator` entry
      survived in `devenv.nix` pointing at a directory that no longer
      exists. This bolt sweeps that one entry and writes a parity
      requirement, but wiring the gate changes how every future proposal in
      that repo is verified, so it is a decision and not a construction
      detail
- [x] routed: `openspec/config.yaml`'s project context tells every agent
      here to "Commit after any artifact change", which cannot hold once
      more than one agent shares a working tree — five spec agents shared
      this bolt worktree's index. Handled locally by running them under an
      explicit do-not-commit instruction and committing by pathspec, but the
      instruction as written invites the failure `session-worktrees.md` just
      settled on the design side. Deliberately NOT added to this bolt: it is
      in no released handoff, and growing scope past the gate is the failure
      this bolt exists to stop

## A mechanism is not a justification

The intent placed both held survivors and adopted the third limb
(`9be8103`). The retirement test now reads: built on the retiring
`src/proposals.md` chapter, **or** on the OpenSpec-decomposition practice
the bolt loop supersedes, **or** claims a role the flywheel has given
elsewhere. `conductor-inception` retires on the third alone, and the limb is
stated in the artifact rather than only applied — a set whose stated test
does not select its members teaches the next reader to trust the test and
get the wrong answer.

- [x] `book-commissioner` survives: it dispatches commissioning steps inside
      one repo's commissioning book, and the flywheel gave that role to
      nobody — commissioning books are co-located with the repo they
      commission and sit outside the actor model. `hil-gateway` is a
      transport it writes to, not a bridge it claims;
      `bridged-singleton.md` governs who is *the participant* in a channel,
      not who may emit an envelope. Its recorded reason is rewritten against
      all three limbs
- [x] `agent-workspaces` is **held, not cleared** — pending the intent's open
      Writeback task recording that `session-management.md` and
      `agent-workspaces.md` still carry a generic board and work-item model
      predating the flywheel. A plugin cannot be retired for claiming a role
      while the chapter that would define that role is unwritten; doing so
      settles a design question by side effect. The task is named in the
      record so this round's survival is never read later as a clearance
- [x] write the ordering's **reason** into `retire-openspec-construction`'s — landed 0a41b03
      `design.md` — the six sites and the sibling task that removes each —
      while the reviewer's evidence still exists. The rule the intent took
      from this, credited to the reviewer: **where an artifact names a
      mechanism that constrains order, coupling or membership, it states the
      fact that makes the constraint correct, not the mechanism that makes
      it stick.** Sibling of the state-claim rule — content survives,
      enforcement decays into superstition. The pair here recorded only the
      halt, so the guard would have outlived its argument and then looked
      arbitrary
- [x] the books guard is the sharper form of a defect the intent had already
      sent the sibling bolt: a guard sharing its *input* with the thing it
      guards. Same population, same literal pattern — independence of
      output, none of definition, so both are wrong together and agree

