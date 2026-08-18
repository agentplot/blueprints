# Tasks

Branch shape: nested construction worktrees off each repo's bolt branch,
one per proposal, branch `build/<change-id>` — not `bolt/flywheel-machinery/<...>`,
which git cannot hold beside the bolt branch itself. Acceptance runs on the
bolt branch only, never inside a construction worktree.

Batches, in order: (1) the session profiles **and** the loop skills, which
land together or not at all — the first deletes the profile the second still
launches; (2) the schema instructions and the root entry points, concurrent,
and blocked on batch 1 because the schema enumerates the seven names and the
build reads them off disk; (3) the books conventions, a batch of one for
blast radius; and the two marketplace proposals, serial with each other,
retirement first.

**One cross-repo ordering, settled here rather than at merge time.** The
books work is two halves in two repos, so it cannot be one acceptance batch —
acceptance runs per repo. But the halves are not symmetric about order.
Landing **marketplace first is safe**: its templates repoint at
`books/CLAUDE.md` § *Voice*, and all ten voice parts are already there today,
so the pointer resolves the moment it is written. Landing **blueprints first
opens a window**: the convention drops the proposals-chapter requirement
while the scaffolding skills still render the chapter, so any book scaffolded
in between is born carrying a chapter its own conventions no longer name.
The window is small and nothing breaks in it, which is exactly why it would
go unnoticed. Marketplace lands first.

Spec agents run concurrently in the one bolt worktree, so they share a git
index: the conductor commits each landed spec by pathspec
(`git add openspec/changes/<id>`), never a pathspec-less commit, which
would sweep every sibling's uncommitted work into one commit — **and only
once that agent is idle**, **and the commit itself takes the pathspec too.**

**That third clause is new, and I learned it by breaking it.** `intent-kit-lift`
drained a request into this bolt's `inbox/`: two of my commits carry 20 of its
file renames. I had staged by pathspec every time — and then run a **pathless
`git commit`**, which commits the whole index. `git mv` and `git rm` stage
immediately, so another agent's renames were sitting in the shared index and
my commit took them. Nothing was lost and the content is correct; it is
attributed to the wrong commits, on main, where four agents work one checkout.

`git add <pathspec>` protects against sweeping *unstaged* work. Only
`git commit <pathspec>` protects against sweeping *staged* work. A discipline
that looks complete and covers one of two paths is this bolt's most-repeated
shape, and this is my third instance of it.

- [x] drained the request; the rule now names the commit as well as the add
other; it cannot protect against committing an agent's own directory while
it is mid-edit. I did that: committed a directory on the agent's completion
report, in the same turn I sent it the next round, so one commit's message
describes one amendment and its contents carry half of the next. "Finished"
has to be a property of the *agent*, not of the spec. The sequence that
produces it is the normal one — agent reports, conductor commits, conductor
bounces — and those three feel like a single motion. Routed to
`intent-flywheel`, since the handoff task carries the rule this bolt writes
into `flywheel-construction`. Build is the
same hazard answered a stronger way — a worktree per proposal, so no two
apply agents share an index at all
(→ `openspec/changes/flywheel/decisions/session-worktrees.md`, the same
finding settled on the design side).

## Readiness
- [x] audit willdan-blueprints: ready — `.config/wt.toml` names three
      pre-commit gates (`books` = `python3 books/preview.py --check`,
      `mermaid` = `node books/check-mermaid.mjs`, `map` =
      `node context-map/bin/map-check.mjs`), all three run by `wt merge` on
      the exact landing tree; OpenSpec root is `openspec/` with
      `spec-driven` as the project default. Hooks need a one-time
      `wt config approvals add`; no agent bypasses with `--yes`
- [x] audit willdan-marketplace: **gap** — there is no `.config/wt.toml`, so
      `wt merge` runs no repo gates and the release gate has nothing of the
      repo's own to enforce. OpenSpec root is `openspec/`, schema
      `spec-driven`. What stands in for the gate on this bolt is written
      into the acceptance task below, and the missing config is itself a
      finding to route once this bolt's work is clear of it
- [x] cut the two bolt branches and worktrees — both
      `bolt/flywheel-machinery`, off each repo's `main`:
      blueprints at `~/.herdr/worktrees/.bare/bolt-flywheel-machinery`,
      marketplace at
      `~/.herdr/worktrees/willdan-marketplace/bolt-flywheel-machinery`.
      The second needed an explicit `--path`: herdr derives the path from
      the branch name under the repo's bare-directory label, which is
      `.bare` for every repo in this layout, so same-named bolt branches in
      two repos collide on the default path

## Spec
- [x] generate proposal in willdan-blueprints: `flywheel-session-profiles`
      — cites `session-types-are-skills.md`, `design-session-steering.md`,
      `agent-profiles.md`, `blueprints-is-a-built-repo.md`. Landed at
      2b461a2, validate green, real deltas (11 requirements, 22 scenarios
      across two capabilities). Names now fixed and binding on siblings:
      profiles `.claude/agents/flywheel-{review,interactive}-session.md`,
      type skills `.claude/skills/flywheel-session-{review,interactive,prototype,spike,writeback}/`.
      Shape rule, as the intent settled it: **an actor says "session", a
      way of working never does** — not the word-order framing this bolt
      first used, which is precisely what two independent reviewers could
      not hold. `flywheel-design-session.md` is deleted; `flywheel-design-session.md` is deleted
      and neither half inherits its name. The fifth type is settled as
      `flywheel-spike`, per the intent's settled list — this bolt had moved
      it to `research` on a reviewer's argument, and that argument is
      routed rather than acted on. The collision is real and unaddressed by
      the decision: on disk "spike" already means *where throwaway code gets
      built* (root `CLAUDE.md`, the schema's spike-repo path,
      `flywheel-inception`'s own delegate line), so under the settled names
      a prototype session builds in the spike repo and a spike session
      builds nothing
- [x] generate proposal in willdan-blueprints: `flywheel-loop-skills`
      — landed at b6922ee, validate `--strict` green, four capabilities.
      The three failures are named requirements in both the skills and the
      conductor profiles, and the evals are specced so they can fail:
      observable expectations only, a negative expectation on every failure
      eval, and each run with and without the skill so an expectation
      passing in both is discarded as evidence
      — cites `human-loop-channels.md`, `review-launch-points.md`,
      `design-session-steering.md`, `dispatch-singleton-name.md`,
      `blueprints-is-a-built-repo.md`, `the-gate-is-inline.md`,
      `every-handoff-is-a-bolt.md`. Must not touch
      `.claude/agents/flywheel-intake.md` — `bolt-dispatch-rename` owns it
- [x] generate proposal in willdan-blueprints: `flywheel-schema-instructions`
      — cites `design-session-steering.md`, `review-launch-points.md`,
      `every-handoff-is-a-bolt.md`, `blueprints-is-a-built-repo.md`,
      `three-schemas.md`, with `bolt-verification-punt.md` as a constraint.
      Landed on the bolt branch at 7a7d735, `openspec validate` green, full
      artifact set, all six cited decisions present
- [x] generate proposal in willdan-blueprints: `flywheel-entry-points`
      — cites `three-schemas.md`, `agent-profiles.md`. Re-specced at d62fcc2
      after a five-gap bounce; originally 6aaaa46,
      validate green, `skip_specs: true` (a prose section in one docs file;
      `openspec/specs/` holds no capability specs to delta against). Names
      the four actors and `.claude/agents/` as a directory rather than
      profile filenames, so it stays correct across both the sibling bolt's
      rename and this bolt's profile split
- [x] generate proposal in willdan-blueprints:
      `books-proposals-chapter-retires` — cites
      `proposals-chapter-retires.md`, `plugin-chapters-fold.md`, with
      `book-decompose-retires.md` as the boundary. Specced, rescoped, and
      landed at 14015f8, validate `--strict` green. Two task groups went to
      the sibling, not one — all of group 7 targeted the plugin too. The
      voice rules get a home in `books/CLAUDE.md` § Voice, verified against
      an inline section list so implementation reads nothing outside
      `books/`. The five tooling consequences are listed in the proposal so
      the seam between the two halves is auditable
- [x] generate proposal in willdan-marketplace: `book-skills-drop-proposals`
      — landed at 9be3fbd, validate `--strict` green, 73 tasks. The scope
      correction landed in full: `references/proposals.md.tmpl` is deleted
      with both render steps, and the two `*-CLAUDE.md.tmpl` files that emit
      the voice pointer a scaffolded book is *born with* now name
      `books/CLAUDE.md` § Voice under a flat rule — no plugin path may
      survive in text rendered into a book. It also wrote the sibling's
      truncation in as a standing verification rule: never pipe a sweep
      through `head`, never a line-oriented `grep -v` where a negative
      lookahead is meant.
      Reported nothing across four idle notifications; the state above is
      read from disk, which is where it should have been read anyway
      — the marketplace half of `proposals-chapter-retires.md`: the four
      book skills and the `book-coherence-reviewer` agent in
      `plugins/system-design-inception/`. Takes the two task groups lifted
      out of `books-proposals-chapter-retires`.
      Scope correction relayed mid-spec: the decision's five consequences
      are not five file edits. Twelve more files in that plugin carry the
      chapter, and the reference templates are *how* the two scaffolding
      skills produce it — a skill that stops creating the chapter while
      still rendering `references/proposals.md.tmpl` and the
      `*-CLAUDE.md.tmpl` files has not stopped. Those templates also emit
      the voice pointer a scaffolded book is born with, which must name
      `books/CLAUDE.md` § Voice and no plugin path
- [x] generate proposal in willdan-marketplace: `retire-openspec-construction`
      — cites `proposals-chapter-retires.md`, `book-decompose-retires.md`.
      Determine the sibling set; `system-design-inception` stays, because
      `book-skills-drop-proposals` edits the book skills it carries. An
      undrawable boundary routes to `intent-flywheel`, not a guess.
      Specced and landed at 7c39725 on the marketplace bolt branch, validate
      green, real deltas (one capability, five requirements). The exclusion
      held under the agent's own scrutiny. Sibling set drawn against all 25
      registered plugins: in go `openspec-construction`,
      `openspec-authoritative-sources`, and the `book-decompose` skill; the
      other exclusions each carry a reason. A test asserts
      `system-design-inception` and `book-decompose-commissioning` survive,
      so a later over-broad cleanup cannot take them

## Review
Every row is review mode `agent`: the decisions are the spec and were
already reviewed as decisions. The reviewer reads the full artifact set
*and* the cited decision records, hunts plumbing-only specs, cross-proposal
drift, unaccounted source material, and ungrounded assumptions, and edits
nothing. A bounce returns the row to `to-spec` with the gaps noted here.

- [x] review `flywheel-session-profiles` (agent) — **BOUNCED**, seven gaps.
      Row returns to `to-spec`. The blocking ones: the review session was
      specced to annotate `intent.md` and generated proposals, which
      `review-launch-points.md` gives to the conductor and the bolt
      conductor — charging a session to run those rounds routes feedback to
      a non-writer, which that decision forbids by name. The two specs
      answer "which profile does a prototype, spike or writeback session
      run under" two different ways, and for writeback neither works, since
      the split is by surface and writeback uses neither. The reads-only
      type is called `spike` while the repo's own vocabulary — root
      `CLAUDE.md`, the schema, `flywheel-inception` — uses `spike` for
      *where throwaway code is built*, so as specced a prototype session
      builds in the spike repo and a spike session builds nothing; the
      schema's word for reads-not-builds is `research`. And the
      two-things rule has one scenario that tests behaviour without a skill
      loaded, and one that only tests that the text is present
- [x] re-review `flywheel-session-profiles` after re-spec (agent) —
      **BOUNCED**, 8 gaps; all seven originals closed and the guardrail
      check passes. Two gaps were mine: the eval scope the intent had
      already settled on a commit this branch lacked, and the
      session-worktree consequence requested into this bolt and never
      chartered. One more was my brief — I checked `lavish-axi` against
      PATH and not against the skill file, which documents
      `npx -y lavish-axi`, so I handed the agent a premise that made every
      correct install trigger a fallback
- [x] re-review `flywheel-session-profiles` after second re-spec (agent) — was — superseded: review phase closed, findings converted to build rulings
      landed at ee8f739, all seven gaps closed, none disputed, validate
      `--strict` green. Briefed on both halves: did the gaps close, and what
      did the rewrite break
- [x] review `flywheel-loop-skills` (agent) — **BOUNCED**, 10 gaps, and the
      three failures were verified landing in both places as acts rather
      than sentences, the profile thickness earned and legible, the launch
      lines exact, the retitle correct against the landed rename, and the
      review bar landed whole.
      The two that matter most are both about text that *stays* rather than
      text that moves. `flywheel-construction/SKILL.md` still routes
      design-level findings "to intake" while the change writes a new
      route-to-dispatch sentence into the same file; and
      `flywheel-inception/SKILL.md:52` still authorizes "non-book writeback
      targets (research docs, the roadmap)" — which would ship in the same
      file as "a book chapter or the context map and nothing else". The
      guardrail work concentrated on the passage that moves and missed the
      contradicting sentence that does not
- [x] re-review `flywheel-loop-skills` after re-spec (agent) — superseded: same
- [x] review `flywheel-schema-instructions` (agent) — **BOUNCED**, five
      gaps. Row returns to `to-spec`. The one that matters most: the
      Writeback closure is broader than its decision.
      `blueprints-is-a-built-repo.md` gives two carve-outs — the change's
      own artifacts under `openspec/changes/<id>/`, and the books and the
      map — and the spec carried only the second, so "every other file
      edit, in any repo" puts the conductor's own `decisions/`, `design.md`
      and `tasks.md` writes on the Handoff side. Written into an
      instruction whose whole purpose is to be read literally. The sibling
      `flywheel-loop-skills` states the same rule correctly, so the two
      surfaces would have contradicted each other. Also: the `sessions`
      pointer is specced in the singular where the design is two profiles
      and five skills, and defers the identifiers to disk discovery when
      they are fixed and committed
- [x] re-review `flywheel-schema-instructions` after re-spec (agent) —
      **BOUNCED**, three gaps, and every one of them is a *new defect
      introduced by the re-spec*. No first-round gap reopened. This is the
      two-half brief paying for itself: a re-review that only re-checked the
      bounce list would have approved it.
      The important one is a three-surface break. Closing the Writeback gap,
      the spec went past "the conductor's own artifacts are not a Handoff"
      to "no task of any type is filed to do it" — which contradicts the
      Design bullet in the same rendered instruction, the Rules block that
      requires a decision record to exist, and the live board, where Design
      tasks whose whole product is a decision record are checked off today.
      The surplus is also the part neither `flywheel-inception` nor the
      conductor profiles carry, so the three surfaces stopped reading as one
      rule at exactly the clause that overshot
- [x] re-review `flywheel-schema-instructions` after second re-spec (agent) — superseded: same
- [x] review `flywheel-entry-points` (agent) — **BOUNCED**, five gaps. Row
      returns to `to-spec`. The reviewer verified every fact in the section
      against disk and upheld the placement, the `skip_specs` call, and the
      scope line — the gaps are all rename-proofing and risk text. The
      section says "four actors, each an agent profile", which asserts an
      actor-to-profile bijection the sibling profile split breaks; and
      "across the built repos the table above names", which excludes
      blueprints — the one repo the reader is standing in, and the repo the
      section's own last paragraph calls a built repo like any other.
      Two risk paragraphs assert coverage that does not exist: one claims
      this bolt's Merge tasks serialize the two bolts' landings, which my
      own tasks.md contradicts, and one claims the split bolt already owns
      the re-edit, which its decision does not say. A risk that says
      "already covered" is the phrasing that guarantees it stays uncovered
- [x] re-review `flywheel-entry-points` after re-spec (agent) — **BOUNCED**,
      three gaps. All five original gaps confirmed closed. One finding was
      withdrawn as my error (it checked the stale worktree copy of this
      change), one is the cross-surface write-scope defect now fixed on all
      three surfaces, and one stands: task 3.1's pathspec closed the
      false-positive direction and left the false-negative open — a bare
      `git diff` is working tree against index, so a builder who commits
      before running it gets an empty result and reads the boundary check as
      satisfied by nothing. It is the change's only mechanical boundary
      proof, since no gate reads root `CLAUDE.md`
- [x] re-review `flywheel-entry-points`, rounds three and four (agent) —
      **APPROVED** on round four, the bolt's first. Four rounds, every bounce
      on a real defect, and the fourth reviewer verified rather than deferred:
      the three-way write-scope clause collapses to one distinct variant
      across all five occurrences; the sibling genuinely carries the
      session-scoped form instead, so excluding it from the diff is right;
      Risk 1's mechanism survived the record moving again. Its four
      enumeration omissions were all true on disk and none could produce a
      wrong edit, so they fold in without a further round
- [x] review `books-proposals-chapter-retires` (agent) — BOUNCED, two blocking, ruled into the build
- [x] review `book-skills-drop-proposals` **and** — built and landed
      `books-proposals-chapter-retires` jointly (agent) — one reviewer, both
      repos, against the one decision they split. Briefed to build the
      consequence-allocation table itself from the decision rather than
      copy either proposal's, and to treat any consequence allocated to
      *nobody* as blocking. Duplication counts as a finding too: the two
      halves each rewrite a proposal-pipeline section and each touch the
      voice rules, and texts that are meant to mirror drift the moment they
      differ
- [x] re-spec `retire-openspec-construction` — all seven gaps closed at
      c1773aa, none disputed, plus one the agent found itself. Its original
      sweep piped through `head -40` and returned exactly 40 lines, so it had
      truncated its own evidence: the real count is 21 hits across 12 files,
      not 14 across nine, and the new file is the *surviving* skill's own,
      which defines itself by contrast with the skill being deleted,
      frontmatter included. The retirement's blast radius is a strict subset
      of its sibling's, which is what makes build-first safe rather than
      merely conventional
- [x] review `retire-openspec-construction` (agent) — **BOUNCED**, seven
      gaps. Row returns to `to-spec`. The sibling-set work held completely
      under independent spot-check, and both verification claims checked out
      to the exact line ranges — so the change does have a gate. The gaps
      are the reference sweep and the coordination text: two `book-decompose`
      references missed outright, which means the change as tasked could not
      pass its own grep task or its own scenario; a task that would have
      stripped the *surviving* skill's name from the file defining its
      output shape; and a newly-dangling README the change itself breaks.
      **One gap was mine** — I rescoped the bolt after this was specced, so
      four places named a blueprints change as the collider and task 1.3
      sent the implementer to the wrong repository
- [x] re-review `retire-openspec-construction` after re-spec (agent) —
      **BOUNCED**, three gaps, two of them created by the previous round's
      fixes. The reviewer re-ran the sweep unpiped and confirmed 21 hits
      across 12 files independently, re-verified both gate claims at their
      exact line ranges, and re-ran both baselines green — so the count that
      arrived with a confession was checked rather than accepted.
      The sharpest gap is that a token grep cannot see a paraphrase: three
      of four sites advertising "book-to-OpenSpec decomposition" are
      untasked, and one task instructing removal of a token from a
      description that contains no such token is a no-op that would have
      reported success.
      The second is a fix of mine that cut through a sentence — narrowing a
      task to "line 7 only" while forbidding line 8, when the sentence spans
      7-9 and line 8 carries the half that must survive
- [x] re-review `retire-openspec-construction` after second re-spec (agent) — BOUNCED, four blocking, ruled into the build

## Build
**Four recurring defects go into the build charge, not another spec round.**
The read-through found them across four authors, which makes them method
rather than habit — and every one is answerable in the charge:

- **absolute line numbers into files the same proposal rewrites** → locate by
  quoted content; the numbers were true when written
- **decision records cited as bare filenames** from changes that do not hold
  them — in the marketplace repo the cited file does not exist at all → the
  charge gives the absolute path
- **"report the finding to the bolt conductor" with no mechanism**, six tasks
  across three proposals → the charge says report to me
- **the positive specification never routed from `tasks.md`** → the charge
  says read the specs and `design.md` beside the tasks, and names the
  particular section each proposal needs

**And the counterexample names the property worth requiring.**
`flywheel-schema-instructions` scores *lowest* on raw specify-versus-constrain
and is the only proposal the reader would hand a builder today — because its
constraints carry their expected values: the artifact ids enumerated, the
registry header quoted in full, the required sentence written out verbatim
including the forbidden variant. The rule is not "specify more". It is
**every check states what it expects to see, and every rewrite states the
sentence it wants.**

**The review phase is closed.** Seven proposals, every one through two to
five independent rounds, and the last rounds were still finding real defects
— which is the argument for stopping, not for continuing. Reviews find things
because reviews always find things; the question is whether the next finding
is worth a round, and it stopped being worth one.

What the outstanding reads produced goes to the apply agents as **build
notes**, not as gates: locate by quoted content because line numbers shift
within a group; the readiness symlink and which repo needs it; and the
specify-versus-constrain gaps, which the apply agent resolves by reading the
spec beside the tasks rather than by another spec round.

- [x] apply `flywheel-session-profiles` (reviewed — every session for the — built and merged back
      rest of this intent reads these profiles, and a wrong body is
      silently wrong for every run after it; review latency is cheaper
      than that)
- [x] apply `flywheel-loop-skills` (reviewed — the skills are the practice. — built and merged back
      "I stated the rule" is exactly the claim an agent makes plausibly and
      wrongly, and each of the three failures was made by an agent that had
      read the skill. `skill-creator` evals add machine proof on top)
      (blocked by: `flywheel-session-profiles` build — `flywheel-inception`'s
      session section names the session-type skills that proposal creates.
      Stronger than an ordering: `flywheel-session-profiles` deletes
      `flywheel-design-session.md` while `flywheel-inception/SKILL.md` and
      `flywheel-intent-conductor.md` still launch it, and this proposal owns
      those launch lines. Neither change is coherent alone, so the two merge
      back together and acceptance batch 1 covers both or neither)
- [x] apply `flywheel-schema-instructions` (reviewed — upgraded from solo. — landed c8b2fb5
      The review found a rule carried with one of its two carve-outs
      missing, which validated green and read fluently. That is precisely
      the failure a solo arrangement does not catch, and the file is an
      instruction every future conductor reads as law)
      (blocked by: `flywheel-session-profiles` build — the `sessions`
      launch pointer names the two design-session profiles and the
      session-type skills, which do not exist on disk until that proposal
      builds. Its tasks read the names off disk and stop rather than invent
      one. Batch 2 must not start before batch 1 has merged back)
- [x] apply `flywheel-entry-points` (solo — one file, small, and the — landed a25d661
      surrounding facts are checkable in a line)
- [x] apply `books-proposals-chapter-retires` (reviewed — the widest blast — landed, link rule excepted
      radius in the bolt: every book's `CLAUDE.md`, four book skills, one
      reviewer agent, and chapter deletions the three gates only partly
      catch)
- [x] apply `retire-openspec-construction` (reviewed — deletions in a shared — built and merged back, 13 tests green
      marketplace, and "no dangling registration" is a both-directions
      claim a solo agent reports green after checking one direction)
- [x] apply `book-skills-drop-proposals` (reviewed — same reason as its — landed 3a85a3b
      blueprints half: the lints being removed are what a skill checks, so
      an over-broad removal is invisible until a book stops being linted)
      (blocked by: `retire-openspec-construction` build — they collide on
      all nine files the retirement touches in that plugin, not the two
      first recorded. Serial on one marketplace worktree, retirement first,
      and the order is not a preference: reversed, the retirement's tasks
      would point at line numbers and quoted text the rewrite had already
      removed)

## Build worktrees — probed before the batch, not during it
- [x] probe a nested `build/<change-id>` worktree end to end and tear it
      down. It cuts cleanly off the bolt branch, but **`node_modules` is
      absent and two of the three gates cannot run**: `check-mermaid.mjs`
      exits with "jsdom not installed — run `npm ci` in the main checkout",
      and the map check needs the same. The repo's `CLAUDE.md` says other
      worktrees "resolve it from there", which is true of the main checkout's
      siblings and **not** of a worktree under `~/.herdr/worktrees/`
- [x] confirm the fix, which `session-worktrees.md` already names for design
      sessions: symlink `node_modules` to the main checkout. With it, all
      three gates run green from the nested worktree — 225 diagrams parse,
      map clean, 8 books built
- [x] the same probe for a marketplace build worktree — **clean, and it
      needed no symlink.** `python3 -m unittest discover tests` → 4 tests OK;
      `marketplace_audit.py --repo . all` → five `[PASS]`, exit 0. Both run
      from a nested `build/<change-id>` worktree with no setup at all,
      because neither depends on `node_modules`. Probe torn down, branch
      deleted, no worktrees left behind.
      Worth recording as the **negative** result rather than an unmentioned
      pass: the blueprints and marketplace build worktrees differ, and an
      apply agent told "symlink `node_modules` first" in the wrong repo
      would waste time looking for a directory that has no reason to exist
      there. The marketplace repo needs nothing; blueprints needs the
      symlink or two of three gates fail

## Line numbers are hints, not locators — a build-time rule for every proposal
Swept the whole bolt after one proposal removed its line-number citations on
its own initiative. Eight survive, in `flywheel-loop-skills` and
`books-proposals-chapter-retires`, and they are the **milder** form: each
cites a file its own change edits, not a sibling's. But the hazard is real
within a single apply run — `flywheel-inception/SKILL.md:52` is a deletion
and `:91` is a launch line, so the first task shifts the second's number
before the second task runs.

Both proposals quote the target text alongside the number, so an apply agent
that reads the quote finds the right place regardless. That is what makes
this a build instruction rather than another review round:


## Sweep methodology — four distinct failures, all in this bolt
Every one produced a real miss, and none was carelessness. Recorded together
because the pattern is that a sweep's *method* fails silently while looking
like diligence.

1. **`head -40` on a grep that returned exactly 40 lines.** The agent
   truncated its own evidence and reported 14 hits where there were 21.
   Never pipe a verification sweep through `head`.
2. **A line-oriented `grep -v` filter.** `book-decompose,` and
   `book-decompose-commissioning` sat on one line, so excluding the second
   hid the first. Use a negative lookahead —
   `grep -rnP 'book-decompose(?!-commissioning)'` — not a line filter.
3. **Grepping for the words the *correction* used.** A sweep for `compress`,
   `lump`, `technically true` missed a table row that said the stale thing in
   the record's own pre-amendment words. A grep for how you phrased a mistake
   will not find where you quoted it.
4. **Grepping for the token instead of reading for the claim.** *"written so
   future OpenSpec proposals can be carved out of its chapters"* contains no
   `proposals.md`, so a token sweep never reached it. Reading for meaning
   then found two more nobody had named — a glossary's **book** entry and a
   buildout prompt's promotion test, both carrying the retired framing
   without any of the search terms.

- [x] I committed failure 4 myself, one turn after recording it. Checking
      whether a proposal had taken the split ruling, I grepped for
      `general shape` and got zero — the proposal says
      *"transcribes **(a) and only (a)**"*, which is the same claim in its
      own notation. I nearly reported a gap that did not exist. Knowing the
      failure mode does not protect you from it, because the whole trap is
      that the search *looks* conclusive: zero hits reads as absence, not as
      a badly chosen term

## The re-wrap route, and why it is worth a clause
A reviewer asked the question I set it — *could a builder following the guard
still produce a rewrite while believing it was subtracting?* — and found the
one route through. Deleting mid-paragraph text leaves the edited lines short
of the file's ~72-column voice, and the same proposal tells the builder to
match that voice. **A builder who reflows the paragraph passes every survival
check verbatim, rewords nothing, and ships a diff that reads as a rewrite.**

Cosmetic in outcome — a bigger diff, not a wrong file. Worth recording
because the shape is not: a guard that names *what must survive* does not
constrain *what may move*, and the two feel like the same thing when you
write the guard. Any deletion task in this bolt that leaves a line mid-voice
has the same route open.


## A prohibition that enumerates phrasings misses the next one
The loop skills forbade a second basis for the host-profile assignment and
then supplied one, twenty lines above, in `SHALL` text. The agent's own
diagnosis is why it survived review twice: the prohibition listed *"which
surface the session reports through"*, and the offending clause said *"the
surface the batch works"*. **The rule could not catch the phrasing the same
document had used.**

The fix is not a longer list. It is the negative stated as a property — *no
profile may be described by the surface its session works* — with the reason
attached, so a reader can test a new phrasing against the reason rather than
against an enumeration. The sibling had already written it that way, which is
why the sibling had no instance of the defect.


## My own silent no-op, and the fix
A registry row sat two owners out of date because a string replacement of
mine matched nothing and said nothing. I have driven this registry by
find-and-replace all session, and a replacement that finds no match is
indistinguishable from one that succeeds — same exit code, same silence, and
the file still validates because the stale row is well-formed.

That is the fourth shape of the same defect this bolt has produced: a
verification that cannot fail. `grep` returning zero on a badly chosen term.
A boundary check against a deleted path. A guard on what survives that does
not constrain what moves. And now an edit that did not happen.

- [x] every registry edit from here asserts its target string is present and
      exits non-zero if it is not, rather than replacing and hoping

## Review checks claims; it does not check executability
The single most valuable finding in this bolt, and it unseated an approval.
I asked the one approved proposal's author to read its own `tasks.md` as a
builder holding only that file and the repo. Six defects, **two of which
would have produced a wrong file** — the section's actual shape and its actor
roster exist only in `design.md`, and `tasks.md` never says so. One task
leads the builder to derive the roster from `ls .claude/agents/`, the exact
mirror two other tasks forbid.

**Five independent reviewers read that file across five rounds and none
caught it**, because the defect is invisible to the question they were asked.
Its author's diagnosis is the finding:

> The deletions were specified late, under review pressure, against text that
> already existed; the addition was specified first, in prose, against text
> that did not. The checking groups grew around the addition and are
> excellent at catching what must not appear — which is why nothing caught
> that what *must* appear was never written down here.

Review pressure hardens the negative checks, because that is what a reviewer
is good at. The positive specification is the part nobody is adversarial
about, so it stays where it was first written.

- [x] the approved row returns to `to-spec`. A change whose tasks cannot
      produce the right file is not approved, whatever five reviewers
      concluded about its claims
- [x] **the fix is not "name the section" — it is carry the content.** I
      expected the answer to be task lines citing `design.md` § *X*. One
      author found better: quote the content verbatim in **one task**, and
      have the others cite that task. *"Use the part (a) wording task 5.2
      quotes verbatim."* A builder holding only `tasks.md` never leaves it,
      and the content has one home instead of a pointer chain into a document
      nobody handed them. Naming a section still sends the builder to a
      second artifact to find the right part of it; a cross-task citation
      resolves inside the file they were given.
- [x] **found from three directions now, which settles that it is
      structural.** An author read-through found it first. An author's
      specify-versus-constrain tally quantified it: 58 tasks, 30 with no
      route to their content, and **zero** sections of `design.md` or either
      spec named anywhere in the file. And a fidelity reviewer hit it
      *incidentally, on the way to a verdict* — a requirement stated for five
      skills with task lines for one, where a builder executing the tasks in
      order rebuilds the exact non-discriminating fixture the previous round
      bounced. Three different readings, three different proposals, one
      shape: **the spec says it, the tasks name the neighbouring outcome, and
      nothing carries the content across.**
- [x] **and I have the same defect one level up.** This file carries build
      instructions an apply agent will never read: the `node_modules`
      symlink, the `build/<change-id>` worktree convention and its base,
      locate-by-quoted-content, line-numbers-are-hints, and which repo needs
      the symlink and which does not. An apply agent gets its proposal's
      `tasks.md` and the repo — **not the bolt's tasks**. Every one of those
      is exactly the kind of thing whose absence produces a confident wrong
      move, which is the class I just unapproved a row over.
      So each build dispatch carries the readiness items in the charge
      itself, and does not rely on the apply agent finding this file. The
      first read-through finding — *"I do not know where to work"* — is the
      instance that proves it: that builder could not find the worktree
      convention because it lives here
- [x] route to `intent-flywheel`: the bolt schema's declared review mode is — routed
      "an independent agent reviews the spec against its cited sources", and
      it demonstrably does not catch this. A build-readiness read is a
      different question from a fidelity read, and this bolt found that out
      one row before building

## A guard cannot see what is uncited, because uncited is the point
The sharpest finding in the bolt, and it defeats a guard I had already
hardened twice. The books half ports proposal slugs out of six chapters
being deleted, and its guard re-derives the population independently — which
I had recorded as the fix.

Independence does not help when both derivations ask the **same wrong
question**. Both test *referent integrity* — does this slug appear outside
the chapters — when the thing at risk is *content preservation*.
`books/rocs-kit/src/proposals.md:1382` is a mermaid build-order graph whose
ten nodes are slugs and whose value **is** the dependency edges between them.
Five of the ten appear in **zero** surviving files. The port discards them
because they are uncited; the guard re-derives and discards them again. Every
check green, the build-order graph for that book gone.

**Being uncited is exactly what makes content self-contained.** A referent
scan is structurally blind to it, and no amount of independence in the
derivation fixes a shared premise.


## Rebase
- [x] merged main into the blueprints bolt branch at a clean moment — no
      agent holding uncommitted work, which is the condition I set after
      committing an agent's directory mid-edit. The branch is current, its
      copy of this registry is now byte-identical to main's, and all three
      gates are green on the merged tree: 8 books built, 225 diagrams parse,
      map clean. That removes the stale-registry trap rather than routing
      around it with per-brief warnings — though the briefs keep naming
      main's path, since the branch will drift again the moment I commit here
- [x] re-merge before acceptance batch 1 if main has moved again — main merged into the bolt branch
      — main has moved (`c59c2a7`, the dispatch rename). Verified disjoint:
      that bolt changed only the two profile paths, so nothing this bolt
      cites by line number moved. Do it between rounds, never while a spec
      agent holds an uncommitted amendment
- [x] after that rebase, sweep the proposals for the `flywheel-intake.md` — swept: only this bolt record names the old path, and it names it as history
      constraint: the file is gone and the ownership boundary now names
      `flywheel-dispatch.md`. A check against a path that cannot exist
      passes for the wrong reason
- [x] rebase the marketplace bolt branch onto its main before acceptance — landed 3a85a3b

## Test

Findings are reports, never fixes. A construction-level finding appends a
task here. A design-level finding — the decision is wrong, not the build —
routes to `intent-flywheel` and is noted here as routed.

## Merge
- [x] merge-back `flywheel-session-profiles` into the blueprints bolt branch — 4 commits, 36 files, gates green
- [x] merge-back `flywheel-loop-skills` into the blueprints bolt branch — 9 commits, 26 files, gates green
- [x] merge-back `flywheel-schema-instructions` into the blueprints bolt branch — 3 commits, 9 files
- [x] merge-back `flywheel-entry-points` into the blueprints bolt branch — same merge
- [x] merge-back `books-proposals-chapter-retires` into the blueprints bolt branch — 11 commits, 18 files
- [x] merge-back `retire-openspec-construction` into the marketplace bolt branch — 6 commits, 57 files
- [x] merge-back `book-skills-drop-proposals` into the marketplace bolt branch — 7 commits, 35 files
- [x] land willdan-blueprints bolt branch on main (full release gate, one — landed 1397895, three gates green by hand
      writer to main at a time — `bolt-dispatch-rename` lands on the same
      main; the two bolts touch disjoint files, so the constraint is
      serialization at the moment of landing, not ordering of the work)
- [x] **before landing either book half: diff `books/CLAUDE.md`'s general — all 12 lines of part (a) verbatim in the template
      shape against `references/books-CLAUDE.md.tmpl` by hand.** No gate in
      either repo compares them, and the S1 contradiction survived two review
      rounds precisely because each proposal asserted the other's compliance
      rather than checking it
- [x] land willdan-marketplace bolt branch on main (full release gate) — landed 3a85a3b, 23 tests
- [x] archive the seven spec-driven changes in their built repos — all seven archived as 2026-08-06-*
- [x] report each landed handoff to `intent-flywheel` (herdr prompt, or — reported with SHAs
      `openspec/changes/flywheel/inbox/` if it is parked), naming the SHAs
      so its six Handoff tasks can be checked off — the books handoff is
      one task served by two proposals, and is not done until both land

## The disposition boundary
The two proposals that share the `flywheel-inception` boundary specced
inverted tables for what leaves it. The governing table is the one
`flywheel-session-profiles` wrote and `flywheel-loop-skills` has executed:
"Review surfaces" stays trimmed, "Prototype when talk stalls" splits, "Write
the destination" and "Batch decisions into one artifact" move whole. The
generating rule is that the criterion for *choosing* a type stays where the
conductor reads it and the practice for *running* one moves to the type
skill.

**The conductor error, recorded because it cost two agents a round.** I sent
the sibling's table to `flywheel-loop-skills` before reading its report, so
it executed that table — while I was separately ruling that its own table
governed and telling the sibling to conform to it. Two agents held
contradictory instructions and a running reviewer held a third. Both were
retracted in one message each, naming the error rather than restating the
answer. The rule for next time is narrow and mine: do not relay one
proposal's decision to the agent that owns the file until that agent has
reported, because until then its own answer is unread and the relay is
guesswork wearing the clothes of a ruling.

**What came out better than either table.** `flywheel-loop-skills` found the
general form: *a guardrail must not depend on a passage that moves.* The
Writeback-scope rule used to ride on "Write the destination", which is why
moving that bullet looked unsafe and why I overruled in the first place.
Stated independently inside the two-things rule — in the skill and in both
conductor profiles — the bullet moves harmlessly. That is strictly better
than choosing between the tables, and it retires my ruling rather than
satisfying it.

- [x] rule the conflict, discover the ruling was built on my own bad relay,
      and retract it to both spec agents and both running reviewers
- [x] **verify the settled table on disk rather than from reports.** Both
      agents' reports described the rows they had written, and one described
      them wrongly — it narrated the superseded table while having written
      the governing one. Read from disk, the two `design.md` tables are
      identical on all four rows, and the writeback guardrail is stated
      independently in both. The artifacts were coherent while the prose
      about them was not. Reports narrate intent; disk carries the work, and
      after two divergences in one bolt the disk reading is not optional

## The bolt change is on main, and the bolt branch's copy is stale
A conductor error affecting every review run so far. This change lives on
blueprints **main** — the conductor owns it there, per the schema — and the
bolt-branch worktree was cut before all but my first commit. So
`openspec/changes/bolt-flywheel-machinery/` *on the bolt branch* still shows
the original six-row registry, none of the rulings, and none of the routed
findings.

I briefed some reviewers with the absolute main path and others with the
worktree, which produced one confident false finding: a reviewer checked
whether a routed finding was noted in the bolt's tasks, found nothing, and
correctly reported the proposal as claiming a routing that had not happened.
It had happened; the note was on main.

- [x] identify the split and withdraw the false finding

## The cross-surface fix: who writes the canonical artifacts
`blueprints-is-a-built-repo.md` compresses two write scopes into one
sentence — "an intent conductor **and its design sessions** write exactly
two things: the change's own artifacts under `openspec/changes/<id>/`, and
the books and the context map." True, because a session directory is under
that path. But read literally by a session, it grants that session
`design.md`, `decisions/` and `tasks.md`, which every other record forbids.

Three proposals carried it faithfully — root `CLAUDE.md`, both loop skills
with both conductor profiles, and the `flywheel-intent` schema instruction.
The compression was about to be installed on the three surfaces an agent
reads first, in a bolt whose subject is stopping agents writing what they
should not.

- [x] fix specified identically for all three: the conductor writes the
      canonical artifacts, its sessions write their session directories
      under it, both write the books and the map. Three parts, no fourth
- [x] `flywheel-schema-instructions` — landed at c0c6969. It found the
      sharper form of the defect: the `sessions` instruction two artifacts
      above already says the conductor is sole writer everywhere else, so
      the lumped clause would have had one schema file contradict itself
- [x] `flywheel-loop-skills` — in flight. The spec files carry the fix; — landed
      `proposal.md` and `design.md` still carry the lumped form
- [x] `flywheel-entry-points` — not started; it is mid-review and takes the — landed
      edit with its next amendment

      **A checkbox of mine was wrong here and a reviewer caught it.** The
      line above read `[x] fix propagated identically to all three` when one
      of three had landed: I checked the box on *sending the instruction*
      rather than on the fix landing. That is dispatch confused with
      completion, and it is worse than an unchecked box — the follow-up
      that would catch it sits directly below, and a builder reading a
      checked line has reason not to look. Status lines record what is true
      on disk, and where a fix spans three artifacts the box splits three
      ways
- [x] the compression itself routed to `intent-flywheel` — the decision is
      not wrong, it is compressed, and the compression is what propagated

## The recurring defect, named so the remaining rounds hunt it
Across every proposal in this bolt, one defect shape keeps returning: **a
claim about a neighbouring artifact's state that the neighbour does not bear
out.** A sibling said to carry a sentence it does not carry; a decision said
to leave a question open that it closed; an archived bolt said to still own a
file; a landing SHA read off the top of `git log`. `flywheel-entry-points`
has produced it three rounds running, and I have produced it twice myself.

It is not carelessness. Every instance was true when written. The bolt has
seven proposals, two repos and a live intent all moving at once, so any
statement about something you do not own has a shelf life.

The proposal that produced it most is also the one that solved it. Its task
4.2 enumerates every neighbour its artifacts assert something about — the
seven decision records, the three siblings, the registry, the archive, the
chapter status — and tells the builder to re-read each from disk, ending
"do not trust this file… every round of review on this proposal has found at
least one such claim gone stale between writing and reading; assume this one
has too." That moves the defect from something rediscovered each round to
something checked once, at build time, when the neighbours have had longest
to move. The remaining reviews are briefed to test that enumeration for
completeness rather than to hunt instances.

The formulation, which a spec agent reached before I did: **the tell is
writing a claim about a neighbour's *state* when the artifact only needed its
*content*.** State claims decay silently; content claims are checkable
against the thing itself. Where a state claim is unavoidable, the durable
form names the **mechanism** rather than its current output — "the split
bolt derives its re-edit list by query" survives; "root `CLAUDE.md` is
absent from that list" did not.

**I had that example inverted, and a reviewer caught it downstream.** I first
wrote it as *"this section is on that list" did not survive*, which is
backwards: root `CLAUDE.md`'s flywheel section **is** a known member today.
The claim that expired was its *absence*. A proposal copied my inversion, so
the erratum travelled as far as the rule did. What actually shifted is
subtler than either version and is the better lesson: the record demoted its
list from an inventory to *"examples of what the query must catch, not the
set"* — so even correct membership is the wrong thing to lean on, and the
query is the only durable referent.

Routed to `intent-flywheel` as a construction practice rule in three parts,
beside the pathspec rule it already took: prefer content claims to state
claims; name the mechanism where a state claim is unavoidable; carry a
build-time re-read task enumerating the neighbours. Not self-amended —
`flywheel-loop-skills` owns the skill and is in review, and a conductor
patching its own scope on the strength of its own experience is the shape
this bolt exists to stop.

**A second vector, found by an agent sweeping work nobody asked it to
re-examine: a claim that goes stale when its *own* change lands.** A delta
spec archives into `openspec/specs/` as a standing contract, so a
locator-plus-"today" claim inside one is *guaranteed* false after the work it
describes succeeds — "today two lines name it", "two survive today". The
split is clean and applies to every proposal here:

> **`tasks.md` may say where a thing is today**, because it is discharged and
> closed. **A spec must state what will be true after the build**, because it
> outlives it. Locators belong in tasks; invariants belong in specs.

Quoted-text anchors are the exception and stay in specs: a delta that says
*remove X* has to name X, and a content anchor survives reformatting where a
line number does not.

That find is also a lesson about sweeps. It survived the previous one because
that sweep grepped for the words the *prose* used — compress, lump,
technically true — and the stale row said the same thing in the *record's old
words* rather than in words about the record. A grep for how you phrased a
mistake will not find the places you quoted it instead.

**A third form, and the worst of them: a *corrected* fact surviving in the
copy nobody re-read.** A coherence pass found one proposal's rationale still
carrying an error that had been corrected two rounds earlier in two other
places — and the same document carried a task written specifically to forbid
that error. The document contained its own guard rail, pointing the other
way, two hundred lines from the violation.

Stale prose reads as stale. A corrected fact reads as authoritative, and
nothing flags it: the correction landed where the reviewer was looking, and
the copy nobody re-read kept the original. Every proposal in this bolt has
been corrected repeatedly in one place at a time, so the standing check is
now **did the correction reach every copy**, not *was it made*.

**The prediction held.** I briefed the batch-1 reviewer that the session
profiles' eval capability — a whole capability written in the previous round
— was the newest and least-swept spec text in the pair. Both of that
proposal's two gaps landed there, and nowhere else. The rule is now
predictive rather than retrospective, which is the only kind worth carrying
into the skills.


The instruction that follows from it, now in every brief: **prefer a claim
that stays true.** "The split bolt derives its re-edit list by query"
survives; "root `CLAUDE.md` is absent from that list" did not. And before
re-validating, sweep your own artifacts for every claim about something you
do not own, re-reading the thing itself rather than your memory of it.

## Seam allocations — the orphans between the two book halves
A joint review derived the consequence table from the decision rather than
from either proposal, and found **four consequences owned by nobody** plus
one settled decision one half never read. Allocating them is the conductor's
job, so each gets an owner here rather than a mention.

- [x] **root `CLAUDE.md:6,9`** — "written so future OpenSpec proposals can be
      carved out of its chapters", and a pointer to the
      proposals/contracts/verifications conventions. Line 9 is the *identical
      sentence* the marketplace half fixes in its own repo. → **`flywheel-entry-points`**,
      which already owns that file and already edits it; giving it to the
      books half would put two proposals in one file. It cites
      `proposals-chapter-retires.md` alongside its own decisions
- [x] **`GLOSSARY.md:54-55`** — *"**proposal** — an entry in a book's
      `proposals.md`, sized so `book-decompose` can carve it into an OpenSpec
      change"*: the repo's glossary defining the central term of the retired
      pipeline, naming both retired things. → **`books-proposals-chapter-retires`**,
      whose scope widens from `books/` to the blueprints-side conventions
      wherever they live. No collision — no other proposal touches it
- [x] **five per-book `CLAUDE.md`/`BUILDOUT_PROMPT.md`/`README.md` copies** —
      the books half's own spec requires them clean and no task opens them.
      → **`books-proposals-chapter-retires`**; a spec requiring what no task
      performs is the gap this bolt has now seen three times
- [x] **`system-commissioning-inception`'s emitted voice pointer** and its
      **fourth copy of the conventions** — a second plugin scaffolding books
      with a plugin-path pointer, breaking the rule the blueprints half is
      establishing. → **`book-skills-drop-proposals`**, which already edits a
      skill in that plugin, so "out of scope" was never available
- [x] **the docking question is closed, and one half calls it open** —
      `bolt-verification-punt.md` settles docking on the individual proposal
      and retires the fog entry. The blueprints half read it and wrote it as
      a requirement; the marketplace half never read it, declares it open,
      and routes a closed question back to the intent. **That is my brief's
      fault** — I named three decisions to that agent and this was the
      fourth
- [x] **named one source — and it was unsatisfiable, which is mine.** I made
      `books/CLAUDE.md` the source and the template its transcription. The
      blueprints half then required verbatim transcribability *including* the
      stage names intent, handoff and bolt; the marketplace half forbids
      exactly those three in a template rendered into arbitrary repos. One
      text had to contain what the other must not, and the blueprints
      verification would have passed vacuously in any repo holding no
      template — certifying a false property.

      Naming a source did not create a transcription. It created two
      independently authored texts with an unearned claim of derivation, and
      the claim is what the reviewer caught rather than the texts.

      **Ruled:** the section splits. `books/CLAUDE.md` carries a general
      shape that is genuinely repo-neutral — a chapter describes a
      destination, what is ready to build is carved out of it and built
      elsewhere, and the book is never edited to record that the work
      happened — plus a blueprints-only paragraph naming the flywheel stages
      and the decision-record citation. The template transcribes the general
      shape only. The derivation claim becomes true of what is shared and
      honest about what is not.
- [x] **the pairing needs a reconciliation step on the bolt.** Nothing — hand-diffed verbatim
      anywhere checks the two texts against each other; the only thing
      holding them together is a claim in each proposal about the other,
      which is exactly how the contradiction survived two rounds. Diff the
      two sections by hand at merge — see the Merge section
- [x] superseded: name one source for the mirrored pipeline text. "Mirror the — books/CLAUDE.md is canonical, string pinned to 560a81e
      wording" has no mechanism and the two sections already diverge:
      blueprints' verification shape is a flat six parts, the template's is
      split into frame and catalog layers. `books/CLAUDE.md` is the source;
      the template transcribes it. Drift is the resting state otherwise

## The routing loop closes, and stales what it closed
A conductor-level instance of the same defect, worth its own note because it
is structural rather than accidental. This bolt routes findings to the
intent; the intent **absorbs them and amends the decisions**; and every
proposal that described the finding as open, or the decision as defective, is
stale the moment it lands.

- [x] swept: `blueprints-is-a-built-repo.md` amended at `4e64ce3` — it now
      opens "Two write scopes, not one, and they are different" and the
      lumped phrase four proposals quote does not occur in it. Their
      write-scope rules now *conform* to the decision rather than
      compensating for it
- [x] swept: `split-after-the-runs.md` records the reference-count finding
      itself — "that count was a point-in-time measurement and is already
      wrong" — names the `sessions` instruction as a known re-edit member,
      and states the list is derived at split time, not inherited
- [x] told all four affected spec agents in one pass rather than letting
      four reviewers find it separately. The `spike` collision stays routed
      in every proposal that carries it — that one is genuinely open

## The routed name came back settled: `research`, not `spike`

The `spike` collision this bolt routed on 2026-08-06 is decided. The intent
fixed `session-types-are-skills.md` at `ce0a8f1`: the record had listed
`flywheel-spike` in its naming bullet and settled `flywheel-research` in the
very next one, and the naming bullet was never updated when the second was
added. Both bullets now say `flywheel-research`, and the record marks which
governs.

This is the routing loop closing exactly as designed, and worth naming as
such: four proposals conformed to the wrong name *and said in writing that
they were conforming under protest*, rather than each fixing it locally.
`flywheel-loop-skills` wrote "this change writes `flywheel-spike` and leaves
the collision to the intent"; `flywheel-schema-instructions` spent three
passages arguing the collision and then conformed. Had any of them fixed it
on its own authority, the four surfaces would now disagree.

- [x] rename `flywheel-spike` → `flywheel-research` on — landed d50c393
      `build/flywheel-session-profiles` — the skill directory itself, its
      `SKILL.md` frontmatter name and description, its `evals/evals.json`
      and `evals/files/charge-mermaid-gate.md`, both profile bodies, and the
      two eval fixtures in sibling skills
      (`flywheel-writeback/evals/files/profile-flywheel-review-session.md`,
      `flywheel-interactive/evals/files/profile-flywheel-interactive-session.md`)
      that quote the profile's type list. An eval fixture naming the wrong
      type hardens it, which is why the fixtures are named here rather than
      left to a directory sweep
- [x] rename on `build/flywheel-loop-skills` — — landed e9cd662
      `flywheel-inception/SKILL.md` (the type-choice line and the roster)
      and `flywheel-inception/evals/evals.json`, where the wrong name sits
      in an `expected_output` and two rubric lines. Same hardening risk,
      one layer up: this eval scores whether a conductor charges the right
      type skill
- [x] rewrite, not substitute, in `flywheel-schema-instructions` — its — landed 067da6e
      `spec.md` says the type "SHALL be named `flywheel-spike`", and its
      proposal and design carry three passages *arguing* the collision
      before conforming to it. A blind rename turns an argument against the
      name into an argument against its replacement. The deferral is
      resolved and the passages say so, or come out
- [x] the rename is a **content change, not a sweep**: every occurrence is
      classified before it is touched — a mechanical name, a passage that
      argues the naming, or a use of "spike" that means the throwaway-code
      repo and must not move at all. `knowledgebase-spike`, "spike repo"
      and "spike-repo path" stay exactly as they are; renaming those would
      manufacture the collision this rename exists to remove
- [x] `flywheel-entry-points` and `books-proposals-chapter-retires` carry no
      occurrence — checked, not assumed
- [x] the sweep is for the **bare word**, not the token. `flywheel-spike`
      was the smaller half; "spike" also stood as a *type* in prose —
      profile `description:` frontmatter, "which type is this session"
      passages, charge templates, and eval `expected_output` lines that
      enumerate types. A profile this bolt built reads "covering the review,
      prototype, spike, and writeback types" and contains the token nowhere,
      so a token grep reports it clean. The five types are review,
      interactive, prototype, research, writeback
- [x] that leak came from the records, not from the build. The decisions — carried
      named the right skill and the wrong type in the same breath, and the
      build copied both faithfully (intent fixed its own prose at
      `d247024`). The lesson for the remaining rounds: **a correction to a
      name is not finished until the word is chased through the prose that
      describes the thing**, because the build agents are faithful copiers
      and will reproduce whatever the record says
- [x] this bolt's own checked history keeps the word. Lines 115–220 and
      1107–1165 record the collision, the conform-under-protest ruling and
      the routing as they happened; rewriting them would erase the evidence
      that the loop worked. Checked tasks never reopen, and a record of a
      wrong name is not the same as a use of it

## Review stops being a phase

Three proposals sat unbuilt behind an open `agent` review while the two
build worktrees ran. Two of them are in willdan-marketplace, which shares no
file with anything batch 1 touches, so the repo was idle for a reason that
did not apply to it. What I had actually recorded for the marketplace pair
was a **landing** order — the book half lands first so blueprints never
scaffolds a chapter its conventions no longer name — and somewhere I let a
landing constraint act like a build constraint. `books-proposals-chapter-retires`
touches `books/` and nothing under `.claude/`; same story.

The merge criterion is not weakened: an independent agent still checks each
proposal against its cited decision records before it merges. What changes
is that the check no longer runs as a phase in front of the build. The
reviewer and the apply agent go out together on the same proposal, reading
different trees — the reviewer the bolt worktree's copy, the builder its own
— and a finding arrives as a build ruling instead of a bounce-and-re-spec
round trip. The criterion was "reviewed before building" because that is
when a finding is cheapest, not because building is what makes it true.

- [x] launched `books-proposals-chapter-retires` (`build/books-proposals-chapter-retires`)
      and `retire-openspec-construction` (`build/retire-openspec-construction`)
      with `review-books-conventions` and `review-retire-construction`
      reading alongside. Both worktrees cut with `git worktree add` from
      each repo's parent working tree: `herdr worktree create` refuses when
      invoked from a linked worktree (`linked_worktree_source`), and every
      repo here is bare-layout, so the conductor's own session is always in
      one
- [x] `node_modules` symlinked into the books build worktree, and
      deliberately NOT into the marketplace one. The asymmetry is the point:
      blueprints needs it for two of three gates, the marketplace repo needs
      it for nothing, and a blanket instruction in the repo that does not
      need it teaches agents to discount instructions
- [x] `book-skills-drop-proposals` stays queued behind the retirement — the — built on the pruned tree
      eleven shared files need the pruned tree as their base. It launches
      when `build/retire-openspec-construction` merges back, not when its
      review returns
- [x] `flywheel-schema-instructions` and `flywheel-entry-points` remain the — both built and landed
      one honest block: they enumerate the seven skill and profile names and
      their build reads them off disk. The rename proves the block was real
      rather than cautious — the names changed underneath them today
- [x] `git commit -- <pathspec>` takes its flags **before** the `--`;
      `git commit -q -- <path> -m <msg>` parses the message as a pathspec
      and dies. The three-clause rule this bolt wrote (add by pathspec,
      only when the agent is idle, commit by pathspec too) was right and
      still cost a failed invocation, because a rule about *what* to pass
      says nothing about *where*. It works: this turn's commit left the
      intent conductor's four in-flight decision edits untouched in the
      working tree

## Seven from the intent's audit — where my registry and its records disagreed

The intent audited every decision record against this bolt's registry and
found seven disagreements. Its records are the authority in all seven. Two
patterns run through them, and both are mine to carry forward: a finding I
routed and then never re-read after it came back allocated, and a list I
recorded as settled that a later record superseded.

The standing rule this produces: **a routed finding is not closed when it
is routed.** This bolt's tasks say "routed to intent-flywheel, not
allocated" in three places where the intent had already absorbed the item
and handed it back. Routing moves the decision, not the accountability.

### Building now

- [x] `flywheel-loop-skills` is missing two decisions it was charged with, — landed e695a1a / 83d28d0
      and its Cites list names neither: `the-run-replaces-the-review.md`
      (`flywheel-construction` states the review bound — one review round
      per proposal — and names the churn signal) and
      `the-conductor-chooses-the-read.md` (the three reads are *instruments
      across the batch*, not steps per proposal: fidelity, buildability,
      coherence, each named for what it catches; the choice is the
      conductor's, against its accountability that the batch is buildable
      and coherent; **no sequence is prescribed**, and `flywheel-bolt`'s
      instructions stop implying a required review type). As it stands the
      skill ships an unbounded review loop with no named instruments — the
      exact state both decisions exist to end. Dispatch after the rename
      lands; two agents in one worktree is how work gets overwritten
- [x] the state-claim rule is **allocated to this bolt**, not out with the — landed a5ec682 and 7b1e356
      intent as this bolt's tasks still say. It rides `flywheel-loop-skills`
      and `flywheel-schema-instructions` rather than being a proposal of its
      own: into `flywheel-construction` (spec agents write these claims),
      `flywheel-inception` (decision records and task lines are full of
      them), and `flywheel-bolt`'s `tasks` instruction as the build-time
      task. Take it **verbatim** from the intent's `tasks.md` Handoff
      section — three parts, two corollaries, the closing warrant. A rule
      about the precision of claims is the last thing to paraphrase

### In review

- [x] the ADR task-type retirement is allocated to — landed 7b1e356
      `flywheel-schema-instructions` and appears nowhere in it. Per
      `adr-is-a-handoff.md`: `flywheel-intent` loses the ADR type, leaving
      **three** typed sections — Design, Writeback, Handoff. The `tasks`
      instruction drops the type and its Consequences line; the tasks
      template and the decision-record template follow; the Handoff
      instruction gains the ADR as a named case, ordered first in its bolt.
      Knock-on: `flywheel-loop-skills` owns the `flywheel-inception`
      task-type list the same decision edits, so the two changes must land
      the same retirement
- [x] **hard precondition, and it blocks the merge, not the build:** — note landed 91d3851
      `openspec/changes/kit-lift/inbox/` must carry a note that the ADR type
      has retired before the schema change lands. That change has an `## ADR`
      section and no `inbox/` directory at all — create the directory with
      the note. Its conductor asked for the trigger at the moment the
      instruction changes. Landing silently strands a live change on a
      section the schema no longer defines

### To-spec

- [x] `flywheel-entry-points` is specced to build a deletion the intent — re-specced 2513a45
      **reversed**. It deletes root `CLAUDE.md`'s `node_modules` claim
      because "the `wt.toml` hook is the durable fix" — that hook is struck
      and there will be no hook. `session-worktrees.md` now says the
      sentence **stands as written**: `createRequire` resolves jsdom from
      any directory, so `bolt-blueprints-tooling`'s resolver fix makes the
      sentence true rather than false. The specced `design.md` section
      headed "The node_modules claim is deleted, not corrected" comes out.
      The re-spec charge must flag this explicitly, because the proposal's
      goal — *root `CLAUDE.md` states nothing false* — is precisely what
      makes the wrong edit feel right to an agent reading it in good faith
- [x] the link-rule correction is allocated here and answered: it goes into
      `books-proposals-chapter-retires`, sent as a build ruling. It cost
      more than it needed to — the offer arrived while that row was
      `to-spec` and I launched the build before answering

### Specced, and genuinely expensive

- [x] `conductor-inception` joins the marketplace retirement on the — landed 9d3891f
      operator's word: its manifest is the flywheel's outer loop under
      another implementation, and it claims to run "as the single
      participant of a Discord bridge", a role `bridged-singleton.md` gives
      to dispatch. Sent as a build ruling. The cost is not the extra plugin
      — it is that the sibling set was *derived* from a stated test, so the
      set is re-drawn and every prior exclusion re-checked against the
      widened test. Appending a member by hand leaves the test and the
      membership disagreeing, and the next reader trusts the test

### My own artifacts

- [x] `bolt.md`'s merge criterion carried the lumped write scope. Fixed to
      the two scopes. An acceptance agent checks builds against that line,
      so the lumped form would have passed a build that implemented it
- [x] the Spec row's "names now fixed and binding on siblings" lists — superseded: the built names are flywheel-{review,interactive,prototype,research,writeback}, no session- infix
      `.claude/skills/flywheel-session-{review,interactive,prototype,spike,writeback}/`
      — both the dropped `session-` infix and the rejected `spike`. It is
      checked history and stays as written, but it is *declared binding on
      siblings*, so a superseding line is needed where siblings will read
      it. The built tree is already correct; the declaration is not
- [x] the build-worktree instruction tells apply agents that "two of the — corrected: ONE gate needs node_modules — map-check imports only node builtins
      three gates cannot run" without `node_modules`. **One** gate is
      blocked. `map-check.mjs` imports only `node:fs`, `node:url` and
      `node:path` and never needed it. An agent told to expect a failure
      that cannot happen learns "the gate is broken, my edit is fine" —
      which is the exact belief that instruction exists to prevent. The
      symlink instruction itself stays correct: the resolver fix has landed
      only on `bolt/blueprints-tooling`, not on main

## Three answers back, and one of them changes a merge step

- [x] the kit-lift inbox note stays a **merge** blocker, confirmed by the
      intent. The note asserts "the ADR type has retired", which is false
      until the schema instruction is on main — a state claim with a shelf
      life, filed in the one place its owner cannot see it decay
- [x] **create `openspec/changes/kit-lift/inbox/` as part of that merge, not — directory and note in one commit
      before.** That change has no `inbox/` today, so an empty directory
      appearing early is itself a signal to its conductor that something has
      arrived. The directory and the note land together or neither lands
- [x] the true-strength rule went back to the intent and is carried on the
      same two proposals as the state-claim rule: state a constraint at its
      **measured** strength, never at its remembered or feared strength; if
      the strength is unknown, say so rather than rounding up; a charge that
      overstates is a charge the next agent is right to discount. It is the
      same mechanism as a superseded list in settled voice — both train a
      reader to weigh the artifact against what they observe, and the
      artifact loses
- [x] the routing rule is now stated **once**, in `flywheel-inception`, with
      both halves: the sending half (the router keeps the item on its own
      frontier until it observes the receiver carrying it; sending closes
      nothing) and the receiving half (a routed finding is not closed when
      it is routed). `flywheel-construction` **points at it and does not
      restate it** — instruction sent to the agent writing that skill,
      because two wordings of one rule is the defect the rule describes

      Worth keeping straight, since this bolt now carries both moves:
      **point** when one statement must stay authoritative; **restate
      independently** when a guardrail would otherwise be carried off by a
      passage that moves (the Writeback-scope rule, which used to ride on a
      bullet that relocated). Getting them the wrong way round produces
      either drift or a guardrail that leaves with its host
- [x] if the widened retirement test catches a survivor, the apply agent
      **reports and does not retire**: that is a scope change and the intent
      places it. Already in the charge; recorded here because the next
      conductor will face the same temptation to absorb a scope change that
      arrives looking like a detail

## The books review: a guard must re-derive the question, not just the answer

`books-proposals-chapter-retires` bounced with two blocking gaps, both sent
as build rulings rather than a re-spec round. The build did not stop.

- [x] **the third guard-that-cannot-fail in this bolt, and the subtlest.**
      Task 3.0 derives the slug population from the chapters being deleted
      rather than from the carrier list — the fix this bolt already made
      once — and 3.0c refuses to read 3.0's *output*. Both correct, and both
      insufficient: the two tasks name the same population by the same
      literal pattern, `### \`slug\``, so the guard inherits the blind spot
      instead of detecting it. `books/cortex-kit/src/proposals.md` puts
      every slug at `####` under `### Active` / `### Queued` groupers, so a
      literal implementer collects **zero cortex-kit slugs** and the guard
      agrees. On disk the count is 158, not the 160 the task asserts

      The generalisation, which is the part worth keeping: **independence of
      output is not independence of definition.** Two derivations of the
      same wrong question always agree. A guard has to re-derive the
      *question* — here, the heading pattern — and not only the answer
- [x] **a seam owned by neither half**, found by the reviewer and not by
      either proposal: seven "this book MUST contain three cross-cutting
      chapters" claims across five files, two of which (`atlas-kit` and
      `rocs-kit`'s `BUILDOUT_PROMPT.md`) are named by no task in either
      repo. Allocated to the blueprints half — they are born instances of a
      template the marketplace half edits, which is the class task 5.3
      already names for its own file and applied to the wrong sentences.
      Neither verify task could catch it: one greps `proposals\.md`, absent
      from those lines; the other greps `proposals` case-sensitively while
      every instance capitalises **P**roposals. A case-sensitive sweep for a
      word that appears capitalised in prose is a guard that cannot fire
- [x] the "verbatim transcription" pair was not verbatim — same four
      clauses, different words, on the one seam no gate spans. Ruled:
      `books/CLAUDE.md` is canonical and the blueprints half writes it as an
      exact quoted string; the marketplace half transcribes *that* string.
      I carry it across, since neither agent can see the other's repo
- [x] carry the canonical string into `book-skills-drop-proposals` before it — handed as the pinned 560a81e string
      builds — it is queued behind the retirement, so this costs nothing now
      and is a hand-diff at merge time if it waits
- [x] withdrew a claim from my own charge: `BUILDOUT_PROMPT.md` does **not**
      omit `SUMMARY.md`. Neither roster is a directory listing; `SUMMARY.md`
      is the comparison target the roster tasks check against, not an entry
      in the set being checked. The registry said otherwise and now says
      this. Sending an apply agent to add a task for a non-entry would have
      produced a roster that fails its own comparison

- [x] `flywheel-entry-points` re-specced at `2513a45` on the bolt branch,
      validate `--strict` green: the `node_modules` deletion is out and the
      sentence stands as written, per `session-worktrees.md`. The agent
      found the deletion argued well from a struck premise, which is why the
      charge said so before it read them — **argument quality is not
      evidence; the record is.** Committed by pathspec while two other
      agents held uncommitted work in the same shared worktree

## Batch 1 merged back, and the merge caught what I would have shipped

- [x] `build/flywheel-session-profiles` (4 commits, 36 files, +1577/-85) and
      `build/flywheel-loop-skills` (9 commits, 26 files, +2168/-223) merged
      into `bolt/flywheel-machinery` through the full gate — 8 books built,
      sidecars validated, 225 diagrams parse, map refs resolve. They landed
      as a pair, as required: the profile split deletes
      `flywheel-design-session.md` while the loop skills still launch it
- [x] **the first merge staged `node_modules`** — the symlink I instructed
      every apply agent to create — and was one step from putting a symlink
      into my personal checkout onto the bolt branch and then onto main.
      `.gitignore:14` reads `node_modules/` **with a trailing slash**, which
      matches directories only. The main checkout holds a real directory and
      is ignored; every build worktree holds a *symlink*, which that pattern
      never matches, so it sits untracked and `wt merge` stages untracked
      files by default. **My own workaround manufactured the hole**: I told
      agents to create the thing the ignore rule does not cover. Excluded
      locally in the shared `.bare/info/exclude` so it cannot recur here
- [x] routed to intent-flywheel: the trailing slash in the committed — routed
      `.gitignore` is a real defect and is **not** this bolt's to fix — repo
      hygiene is in no released handoff, and growing scope past the gate is
      the failure this bolt exists to stop
- [x] two accidents made that survivable and neither is a control: the gates
      ran on the merged tree *before* the commit step, and the commit-message
      generator failed on an unrelated login error, which is the only reason
      I inspected the index at all. A tool breaking bought the catch. The
      merge that finally ran used `--no-commit`, so nothing was staged that
      an agent had not already committed
- [x] `flywheel-schema-instructions` amended at `7b1e356`, validate
      `--strict` green: ADR type retired to a named Handoff case, the
      state-claim rule verbatim in `flywheel-bolt`'s tasks instruction, and
      the kit-lift note recorded as a merge blocker. Its uncommitted edits
      survived two `wt merge` stash/restore cycles in the shared worktree —
      that worked, and it is not a thing to rely on again

- [x] `retire-openspec-construction` merged back into willdan-marketplace's
      `bolt/flywheel-machinery` — 6 commits, 57 files, +574/-3719, tests 13
      passing. Verified against the rulings before merging rather than on
      the agent's word: the third limb is stated in the artifact,
      `agent-workspaces` is recorded as held with its blocking task named,
      the ordering's *reason* is written down beside the mechanism, and
      `conductor-inception`, `openspec-construction` and
      `openspec-authoritative-sources` are gone from `plugins/` while
      `agent-workspaces`, `book-commissioner` and `system-design-inception`
      remain
- [x] `book-skills-drop-proposals` launched on the pruned tree, which is the
      whole point of the serial order. Its task 5.2 — the transcription — is
      held to last: the canonical string is still being written in the other
      repo, and no gate spans the two. The agent asks me for it rather than
      inventing it, which is the only way a verbatim claim survives two
      agents who cannot see each other's repo

## The books and the map are the design loop's, and my build was in the wrong loop

Ruled at `3f35d0e`. A bolt carries **no book-chapter edit and no map move**,
not as a proposal and not as a side effect of one — a chapter is where the
destination is stated, so a bolt editing one is writing design through the
construction gate. The line inside `books/` is **chapter versus machinery,
not path**.

The gap was real and it was in the record, not in the session that tripped
it: the two-write-scopes rule kept sessions out of the canonical artifacts
and said nothing about a session and a released bolt reaching the same books
file from opposite ends of the loop. The intent also found a double charter
— one Handoff line retired the chapters with their books' edits while a
Writeback task gave the same deletion to a session.

- [x] restore the six chapters on `build/books-proposals-chapter-retires`. — 395f26d, src diff empty
      My branch had already deleted all six across `e8d9b1b`, `fee876b` and
      `0718132`, plus their `SUMMARY.md` entries and inbound-link rewrites,
      which are `src/**` too. Restored as a **forward commit**, not by
      rewriting the three: the branch is unmerged so either would work, but
      a restore commit leaves the record legible — the work was done and
      then handed to the other loop, which is what happened. The check I act
      on is `git diff --stat cad8c84..HEAD -- 'books/*/src/**'` returning
      empty
- [x] the evidence moved rather than being binned, which was the intent's
      instruction and the right call: the corrected heading pattern and true
      count, the cortex-kit `####` nesting that makes a `###` sweep collect
      zero, the three live referents, the 34-file inbound-link map, the
      249-dead-link measurement, and the mermaid fence at
      `rocs-kit/src/proposals.md:1382`. Sent to `flywheel-session-1` as a
      **prompt, not a file** — it is the sole writer of its session
      directory, and handing evidence is not a reason to write in it
- [x] told that session the link rule it must write against, since my half
      is fixing it and its half rewrites inbound links: nested chapters need
      `../` forms and a cross-book link from a nested chapter requires
      `../../`, which the current rule forbids
- [x] this row keeps `books/CLAUDE.md` with the link-rule correction, each
      book's `CLAUDE.md` and `BUILDOUT_PROMPT.md`, the `aidlc-design`
      rosters, the voice-rules pointer, the archive pointer, and the
      marketplace book skills. It drops the six deletions, their `SUMMARY`
      entries, and every inbound-link repair into a chapter
- [x] the ruling went against my build and it was the right ruling. Mine was
      the better-evidenced work — reviewed, with the referents and links
      collected — and it was better work in the wrong loop. Ruling for it
      would have settled a scope question by expedience and left the same
      collision waiting for the next book

- [x] content audit before archive, not merely a status read. Every row
      claiming a specific edit was grepped on main: the `flywheel-research`
      skill directory exists, `ADR` is gone from `flywheel-intent`'s schema,
      root `CLAUDE.md` carries the entry-point section and **keeps** the
      `node_modules` sentence, `kit-lift/inbox/` holds the ADR note, and
      `books/CLAUDE.md` no longer requires a proposals chapter. One row
      failed it: the same-book link rule, still uncorrected at
      `books/CLAUDE.md:308`, now recorded as undelivered and routed to
      `bolt-blueprints-tooling`
- [x] **a confirmation is not evidence when the confirmer verified a
      neighbour.** I reported the link rule landed without grepping for it,
      having checked the guides and the gates; the intent checked the guides,
      found them clean, and passed my claim on as fact. Two actors, one
      unchecked claim, both honest. The archive rule this produces: a row
      claiming a specific edit is archived only once that edit is greppable
      on the branch that landed it
