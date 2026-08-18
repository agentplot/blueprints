# Proposals

| proposal | repo | change id | review | status | branch | owner |
|---|---|---|---|---|---|---|
| session profiles and session-type skills | willdan-blueprints | `flywheel-session-profiles` | agent | merged | `build/flywheel-session-profiles` | - |
| the two loop skills, with evals | willdan-blueprints | `flywheel-loop-skills` | agent | merged | `build/flywheel-loop-skills` | - |
| schema artifact instructions | willdan-blueprints | `flywheel-schema-instructions` | agent | merged | `build/flywheel-batch2` | - |
| root CLAUDE.md, whole | willdan-blueprints | `flywheel-entry-points` | agent | merged | `build/flywheel-batch2` | - |
| books/CLAUDE.md, aidlc-design rosters, GLOSSARY (no chapters) | willdan-blueprints | `books-proposals-chapter-retires` | agent | merged | `build/books-proposals-chapter-retires` | - |
| book skills drop the proposals lints | willdan-marketplace | `book-skills-drop-proposals` | agent | merged | `build/book-skills-drop-proposals` | - |
| retire the openspec-construction plugin family | willdan-marketplace | `retire-openspec-construction` | agent | merged | `build/retire-openspec-construction` | - |

## What each proposal carries, and the decision it implements

Every row is derived from a settled decision record under
`openspec/changes/flywheel/decisions/`. A spec agent turns the decision
into a proposal that cites it; it does not re-open it. A decision that
looks wrong is a design finding routed to `intent-flywheel`, never fixed
here.

### `flywheel-session-profiles`
Split `.claude/agents/flywheel-design-session.md` in two — a review
session that works written artifacts through plannotator, and an
interactive design session that builds a surface in lavish — and write the
session-type skills that steer them, with prototypes, research and
writeback among the types. The seven names are settled by the intent on one
rule — **an actor says "session", a way of working never does**: profiles
`flywheel-review-session` and `flywheel-interactive-session`, skills
`flywheel-review`, `flywheel-interactive`, `flywheel-prototype`,
`flywheel-research`, `flywheel-writeback`. The skills lose the `session-`
infix, and the reads-not-builds type is `flywheel-research`: "spike" is
already taken on disk for the opposite meaning — root `CLAUDE.md`, the
`flywheel-intent` schema and `flywheel-inception` all use it for *where
throwaway code is built* — and `research` is the schema's own word for the
task type such a session works. Every profile body carries the
two-things-a-session-writes rule. **All five session-type skills ship with `skill-creator` evals**, the
same bar as the loop skills — the handoff first narrowed this to the two
loop skills and the intent corrected the narrowing as a drafting loss.

Both profile bodies also carry that a session owns a **worktree and a
branch**, not only a directory (`session-worktrees.md`, requested into this
running bolt).

Cites `session-types-are-skills.md` (the type is a skill, not a schema
type, chosen by the conductor at charge time), `design-session-steering.md`
(three steering places, one kind of content each), `agent-profiles.md`
(profiles are thin: identity and edit scope, pointing at skills and schema
instructions), and `blueprints-is-a-built-repo.md` (the rule the profile
bodies carry).

### `flywheel-loop-skills`
Carry the settled batch into `flywheel-inception` — the outer-loop channel
default and the escalation rule, the invoker rule and the conductor's
triage of returned annotations, presentation coaching in the session
section with `branch-topology-diagram` named as a ready tool, the intake
section retitled as dispatch, and the two-things-a-session-writes rule with
the chore route scoped to dispatch at triage — and into
`flywheel-construction` — the construction review bar of adversarial agent
review plus automated testing, with human code review as a request an agent
may make, and the one-proposal bolt. Two additions the intent made after
release: that the operator's phase gate is the brief approval for the
bolt's whole waves, so a bolt conductor does not re-gate each spec agent —
`conduct` rule 5 predates the flywheel and reads as a per-wave gate, which
inside a released bolt is the ceremony `the-gate-is-inline` exists to stop;
and that spec agents sharing a bolt worktree do not commit, the conductor
landing each finished spec by pathspec. That second one is this bolt's own
practice fed back into the skill that will govern the next.

`flywheel-inception` additionally carries the session-worktree spawn recipe
in its conductor section, and in its session section that a session owns a
worktree and a branch (`session-worktrees.md`).

Then run `skill-creator` over both so they ship with evals.

Cites `human-loop-channels.md` (channel by shape, default by loop; the
inner loop minimizes human review), `review-launch-points.md` (the sole
writer invokes the review; feedback returns to the invoker; the conductor
triages into correction, closed decision, or an appended Design task),
`design-session-steering.md` (presentation practice lives in the skill's
session section), `dispatch-singleton-name.md` (the section retitled),
`blueprints-is-a-built-repo.md`, `the-gate-is-inline.md`, and
`every-handoff-is-a-bolt.md` (the one-proposal bolt as a named special
case).

The three conductor failures this intent produced are stated as rules
rather than left to be inferred, per the bolt's merge criteria: a conductor
and its sessions write only the change's artifacts and the books and map;
the chore route belongs to dispatch at triage and closes once an intent
owns the work; the conductor drives continuously and the gate authorizes
rather than stalls. Each failure was made by an agent that had already read
the skill, so each also lands in the profile bodies —
`flywheel-session-profiles` for the session profiles, this proposal for
`flywheel-intent-conductor.md` and `flywheel-bolt-conductor.md`.

It also owns the **disposition boundary** with the session-type skills — it
owns `flywheel-inception/SKILL.md`, so what stays in that file is its call.
The generating rule: the criterion for *choosing* a type stays where the
conductor reads it; the practice for *running* one moves to the type skill.
"Review surfaces" stays trimmed, "Prototype when talk stalls" splits, "Write
the destination" and "Batch decisions into one artifact" move whole.

The rule that makes that safe is more valuable than the table:
**a guardrail must not depend on a passage that moves.** The Writeback-scope
rule — a Writeback task targets a book chapter or the map and nothing else —
used to ride on "Write the destination". It is now stated independently
inside the two-things rule, in the skill and in both conductor profiles, so
the bullet can move without carrying it off. Cross-role content stays out of
the trimmed bullet too: the channel matrix, escalation rule, invoker rule
and annotation triage are obeyed by dispatch and both conductors, so they
land as shared rules of their own beside it.

It also owns the **launch-line edits**: `.claude/skills/flywheel-inception/SKILL.md`
and `.claude/agents/flywheel-intent-conductor.md` both spawn
`flywheel-design-session`, which `flywheel-session-profiles` deletes. Those
two lines were missing from this charter while the sibling proposal assumed
them — the reviewer caught the gap. They are named here now, so no proposal
is blocked on work nobody is chartered to do.

This proposal does not touch `.claude/agents/flywheel-dispatch.md`, which
`bolt-dispatch-rename` created and owns. It was `flywheel-intake.md` when
this registry was written; that path was deleted at `6935cbd`, and an
ownership check against a path that cannot exist passes for the wrong
reason.

### `flywheel-schema-instructions`
`flywheel-intent`'s `sessions` instruction gains the launch pointer — a
conductor launches sessions, naming the profiles and the type skills, and
stops there. It is a **second reader** of the seven names
`flywheel-session-profiles` fixes, alongside `flywheel-loop-skills`: an
artifact instruction is static text rendered identically for every session,
so it enumerates both profiles and all five type skills rather than naming
"the" profile of a particular one. Its `tasks` instruction gains that a review round may append a
Design task, keeps one Handoff motion with the one-proposal bolt named as a
special case, and states that a Writeback task is a book chapter or the map
and nothing else. `flywheel-bolt` describes the one-proposal bolt's one-row
registry.

Cites `design-session-steering.md` (the schema carries a pointer and stops
there), `review-launch-points.md` (a review round may append a Design
task), `every-handoff-is-a-bolt.md` (one Handoff motion; the one-proposal
bolt is a special case of it), `blueprints-is-a-built-repo.md` (a Writeback
task is a book chapter or the map and nothing else), and
`three-schemas.md`. `bolt-verification-punt.md` is cited as a constraint:
the bolt schema gains no verification artifact, no docking section, and no
docking column.

### `flywheel-entry-points`
Root `CLAUDE.md`, whole — **three hunks, not one insertion**. It adds the
flywheel entry-point section naming the two schemas, the two skills and the
actor model, carrying one rule: the built-repo rule. And it deletes three
things that are false: the mining clause in the opening
(*"written so future OpenSpec proposals can be carved out of its chapters"*),
the word `proposals` from the conventions list at `:9`, and the `node_modules`
claim in Gates that other worktrees resolve it from the main checkout —
measured false in two separate worktrees, and deleted rather than corrected
because the config is the right owner and prose describing a manual step is
what let the gap sit.

Cites `three-schemas.md` and `agent-profiles.md` for the addition,
`proposals-chapter-retires.md` for the two opening deletions, and
`session-worktrees.md` for the Gates one. The goal that makes the four edits
one proposal: **root `CLAUDE.md` states nothing false.**

### `books-proposals-chapter-retires`

**Delivered half, and the half that did not ship.** This row landed the
chapter requirement's removal — `books/CLAUDE.md`, every book's own
`CLAUDE.md` and `BUILDOUT_PROMPT.md`, the `aidlc-design` rosters, the
voice-rules pointer, the archive pointer. It did **not** land the same-book
link-rule correction: `books/CLAUDE.md:308` on main still reads "**Never**
include `src/` in a cross-book link target. **Never** use `../../`", which
is true only of a flat book and false for the 109 chapters that sit a
directory below `src/`. That section went back to `bolt-blueprints-tooling`,
which had specced it and held it pending an ownership answer; reopening a
landed bolt to add a section it never built is a worse trade than building
it where it is already specced and where its absence blocks that bolt's own
`books-gate-truth` requirement.

**How the miss survived two confirmations**, which is the part worth
keeping: I reported the correction as landed without grepping for it — I had
verified the *guides* were clean and the gates were green, and inferred the
rest. The intent then checked the guides, found them clean, and repeated my
claim onward as fact. Two actors confirmed a thing neither had checked,
because each checked the **adjacent** thing. A confirmation is not evidence
when the confirmer verified a neighbour.

Drop the per-book `src/proposals.md` requirement from `books/CLAUDE.md` and
rewrite its proposal-pipeline section as chapter → intent → handoff → bolt.

**This proposal deletes no chapter and repairs no chapter link.** The six
`src/proposals.md` chapters, their `SUMMARY.md` entries and every inbound
link into them are the intent's Writeback work, carried on
`sess/kit-books-proposals-retire` — the books and the map are the design
loop's exclusively, and a bolt editing a chapter is writing design through
the construction gate (`blueprints-is-a-built-repo`, closed at `3f35d0e`).
The line inside `books/` is **chapter versus machinery, not path**.

Stated here as an exclusion rather than left to silence, because the row is
what an apply agent reads to learn its job and what a reviewer reads to
judge it. Described the old way, a **correct** build looks incomplete
against its own description, and the obvious remedy — add the deletions
back — reconstructs the collision the ruling exists to end. This branch
touches zero files under `books/*/src/`, and that is the finished state, not
a gap.

The slug and inbound-link evidence this row's review produced went to that
session as a prompt rather than being binned: a bare deletion strands
exactly what the audit found.

Also carries `books/aidlc-design/`'s own `CLAUDE.md` and
`BUILDOUT_PROMPT.md`, whose criterion is that their rosters **match disk**.
The drift runs both ways: both name `proposals.md`, which is gone, and both
omit `choosing-worktrunk.md`, `session-management.md` and
`worktrunk-substrate.md`, which exist — `BUILDOUT_PROMPT.md` also omits
`authoring-capabilities.md`. It does **not** omit `SUMMARY.md`, which this
record claimed: neither roster is a directory listing, and `SUMMARY.md` is
the comparison target both roster tasks correctly check against rather than
an entry in the set being checked. And the voice-rules pointer in
every book's `CLAUDE.md`, which aims into the `system-design-inception`
plugin and needs a home inside `books/`.

`BUILDOUT_PROMPT.md:88` points at `books/_automation-migrate/`, a blueprints
path that has never existed. The five parked automation books it names were
found untracked in willdan-marketplace — this bolt routed that — and now
live at `../../session-archive/old-books/_automation-migrate/`, so the
pointer names the archive or is deleted.

Cites `proposals-chapter-retires.md` and `plugin-chapters-fold.md`.
`book-decompose-retires.md` is cited as the boundary: `book-decompose` is
not retargeted here, and `authoring-capabilities.md` lists no decomposition
capability at all.

### `book-skills-drop-proposals`
The other half of the same decision, in the repo that actually holds the
files. In `willdan-marketplace`'s `plugins/system-design-inception/`:
`book-suite-scaffold` and `book-add-system` stop creating the chapter,
`book-chapter-ready` drops its proposals-shape lints, and
`book-coherence-audit` with its `book-coherence-reviewer` agent drop the
`unmineable-proposal` finding type.

Cites `proposals-chapter-retires.md`, whose Consequences name these five
edits directly.

The handoff released this and `books-proposals-chapter-retires` as one
proposal. They are two because the conventions live in blueprints and the
skills live in the marketplace, and an OpenSpec change is applied in one
repo. Nothing about what gets built changed; the pair implements one
decision and reviews against it together.

### `retire-openspec-construction`
Retire the `openspec-construction` plugin family in `willdan-marketplace` —
it and its marketplace siblings are superseded by the flywheel plugin
rather than repointed at a new source. The retirement leaves no dangling
registration: every plugin in `marketplace.json` exists on disk and every
plugin on disk is registered.

Cites `proposals-chapter-retires.md` (the construction plugins built on the
chapter retire with it) and `book-decompose-retires.md` (`book-decompose`
retires with the family, and nothing replaces it).

The sibling set was the one thing this proposal had to determine rather
than read off the decision. Drawn against all 25 registered plugins, on the
test *built on the retiring chapter, or on the decomposition practice the
bolt loop supersedes*: in go `openspec-construction`,
`openspec-authoritative-sources`, and the `book-decompose` skill; everything
else is excluded with a reason. `system-design-inception` survives — it
carries the book skills `book-skills-drop-proposals` edits, and
`book-decompose-retires.md`'s own enumeration of seven surviving book skills
confirms only the eighth dies.
