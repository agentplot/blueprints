# What the settled records do not match on disk

The three records were decided from a design session, not from the tree. These
were found by reading the tree. **None of them reopens a decision** — every
decision they touch stands. What they change is what the split bolt has to do,
and in four cases what it would otherwise do wrong.

Measurements below were taken this session and are, by the state-claim rule's
own corollary, the kind of statement a later reader should re-run rather than
trust.

---

## The manifest's inventory

### 1. "The two skills" is off by five

`.claude/skills/` carries seven flywheel skills, not two:

| skill | lines | evals files |
|---|---|---|
| `flywheel-inception` | 429 | 8 |
| `flywheel-construction` | 366 | 8 |
| `flywheel-interactive` | 96 | 7 |
| `flywheel-writeback` | 97 | 8 |
| `flywheel-review` | 93 | 3 |
| `flywheel-research` | 87 | 2 |
| `flywheel-prototype` | 80 | 2 |

The five session-type skills are the design-session profile split, which
landed. All seven are the tool's by the manifest's own test — is this the
tool's, or is it Willdan's? — so the decision is untouched. The table in
`flywheel-repo-manifest.md` § *The manifest* is not.

The whole travelling set is **63 files, ~4,500 lines** across skills, profiles
and schemas.

### 2. The recorded line counts are off by roughly 3×

The manifest reads `(139L)` and `(110L)`; they are 429 and 366. This is
`split-after-the-runs.md`'s own rule — "no inventory taken today can be
trusted at split time" — coming true against its sibling record within the
day. Noted rather than corrected in place: the counts were true when written
and the record says so.

### 3. Every skill carries an `evals/` directory, and no record names them

38 files across the seven. They are the skills' only tests. They also now have
a runner: **`claude plugin eval [target]`** is a shipped Claude Code command
that runs `evals/**/case.yaml` or `evals/**/prompt.md` + `graders/*.md`
against a plugin, and adds a no-plugin baseline arm. So the evals are not
incidental weight — they are the flywheel repo's test suite the moment they
land, and leaving them behind would ship the machinery untested.

### 4. `flywheel-inception` carries a `reference/` directory too

`reference/herdr.md`. Not named anywhere in the manifest, and it travels with
the skill.

### 5. `add-flywheel-loops` deployed eight spec capabilities the manifest is silent on

`openspec/specs/` holds `flywheel-inception-skill`,
`flywheel-construction-skill`, `flywheel-conductor-profiles`,
`flywheel-session-profiles`, `flywheel-session-type-skills`,
`flywheel-schema-instructions`, `flywheel-session-skill-evals`,
`flywheel-loop-skill-evals`.

The manifest moves the change (operator's annotation) and says nothing about
the specs the change wrote. Moving a change away from the specs it deployed
leaves both halves wrong: the change's spec deltas reference capabilities that
are not in its new repo, and blueprints keeps eight deployed capabilities
describing machinery it no longer holds.

**Decide it explicitly**: either the eight specs travel with the change, or
the change is archived in place and the flywheel repo starts with a clean
changes tree. It is currently at 10 tasks checked and 15 unchecked, which is
the argument the operator's annotation rests on — but the unfinished work and
the deployed specs are the same subject and should go the same way.

---

## The record and the query

### 6. The re-edit query and the closed-session rule contradict each other

Full detail in `migration-plan.md`. Summarised: the query returns 121 files,
76 after excluding `changes/archive/` and `sessions/`, and 19 of those 76 are
this change's own `decisions/` records. `session-directories.md` forbids
touching one set; `split-after-the-runs.md` says re-edit whatever the query
answers. The exclusions have to be written into the query.

### 7. Rewriting a decision record's paths would break the record

Stated separately from 6 because it is a different kind of error. A decision
record describes the state at the moment it was decided.
`decisions/agent-profiles.md` naming `.claude/agents/` is *correct* and stays
correct after the move, because that is where the profiles were when the
decision was made. Re-pointing it at `agents/` in a different repo would make
it assert something false about its own moment, and would make the decision
sequence unreadable as a sequence. Decisions are amended when a decision
changes, not when a path does.

---

## The context map

### 8. There are three maps, not two

`maps/configurations.js` is 436 lines, `map-check.mjs` validates it in a
90-line arm, and the viewer carries a whole tab for it. Any plan scoped to
"two map files" under-counts the extraction by a third.

### 9. The schema carries Willdan's data

`context-map/schema.json`: `tier` is an `enum` of `["cortex", "frameworks",
"platforms", "aidlc"]`; `$id` is `https://willdan-blueprints/…`; `seamRow`'s
description names `books/geo-iq/src/substrate-boundaries.md`; `^books/` is
baked into three patterns. "The data must not move" is therefore not
satisfiable by moving the schema unchanged — this is the finding that shapes
most of `context-map-tool.md`.

### 10. The topology vocabulary is hardcoded twice

`SLOTS`, `STORE_SLOTS` and `FAMS` in `map-check.mjs`; `CFG_GEOM` in the
viewer. Two copies of one vocabulary that can drift silently. This is a defect
in the tool as it stands today, independent of the move — `map-check` could
already accept a combo the viewer cannot draw.

### 11. `context-map/book-grab.js` is a symlink into `books/`

The viewer depends on a file the manifest keeps in blueprints, and no record
names the edge. Not fatal — it becomes an optional integration point — but it
would have been discovered at the worst moment.

---

## Packaging

### 12. `"source": "."` versus `"./"`

`flywheel-own-repo.md` records `"."`. The one proven single-plugin-repo
marketplace on this machine, `mdserve`, writes `"./"`. The new repo uses
`"./"` and `claude plugin validate --strict` passes; whether `"."` also passes
is untested and does not need to be.

### 13. Two things `claude plugin validate --strict` catches that a hand-rolled check would not

Both hit within a minute of the new repo's manifests existing, which is the
argument for using the shipped validator rather than writing one:

- **A plain `README.md` under `agents/` is loaded as an agent profile** and
  fails for having no frontmatter. Directly relevant to the split: `agents/`
  takes `*.md` flat, so anything dropped there that is not a profile becomes a
  broken one. (`skills/` is safe — a skill is discovered as
  `skills/<name>/SKILL.md` and a loose file is ignored.)
- **A `CLAUDE.md` at a plugin root is not loaded for consumers** and warns.
  The new repo uses `AGENTS.md` instead; Claude Code hardcodes discovery of
  both, so contributors lose nothing.

---

## Environment

### 14. The sibling-path protocol crosses two layouts, not just two parents

`flywheel-own-repo.md` flags that agentplot checkouts live under a different
parent than the Willdan repos. They also, today, use a different **layout** —
none of `agentplot`, `agentplot-kit`, `claude-honcho`, `nix-agent-deck` or
`nix-claude-plugins` is bare; all five are plain checkouts. On the operator's
instruction `flywheel` is bare, which makes it the only bare repo in its own
org. Whatever convention the split bolt names for reaching across has to
survive both differences, not one.

---

## Two defects in the material being poached

Both in `willdan-marketplace/main/plugins/system-design-inception/`, which is
itself mid-change. Detail in `book-knowledge.md`; recorded here so they are
not read as fresh discoveries later.

### 15. Its cross-book link rule is wrong

`voice-rules.md` and `book-chapter-ready` step 6 both reject `../../` on the
grounds that "books are siblings — one `../` is correct." False for any
chapter nested below `src/`, which needs two. Blueprints' `books/CLAUDE.md`
carries the corrected depth-aware rule with worked tables. Poaching the
plugin's version would import a rule that rejects valid links.

### 16. `voice-rules.md` has a dangling reference

Step 1 says "flag any whole-word match against the lists above" and there are
no lists above it; the file cites a "step 8" while listing seven steps. The
bolt that dropped its proposals-chapter lints appears to have removed the ban
lists. Read it as an incomplete source.

*(Numbered 15 and 16 because they were found in the same read and belong with
the rest; they are outside blueprints and outside the three records.)*
