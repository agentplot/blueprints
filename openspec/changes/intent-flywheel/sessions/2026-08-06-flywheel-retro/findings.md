# Flywheel retrospective — findings

A read of the intent-flywheel conductor, the three bolt conductors it and
the operator started, their sessions and subagents, the `flywheel` OpenSpec
change, the skills and agent profiles, and the repo's git history.

## The frame

This loop was built while it was running. Every defect below was produced
by a machine that was also, in the same hours, designing itself. Several
of them the loop caught and fixed on its own before this read began — spec
review got bounded, the dispatch section got its name, the ADR type came
out of the schema, and a conductor invented `notes.md` because its task
file had stopped being a list. Those landed with the bolts.

So the question this report answers is not "what went wrong." It is: of
the things that went wrong, which ones the loop could not see or could not
fix from inside, and which are cheap to fix now.

All times are UTC as recorded in the transcripts. Git commit times in this
repo are EDT (UTC−4).

---

## What was read

| Source | Count |
|---|---|
| Session transcripts across the ten named project directories | 62 files, 28,972 lines |
| Subagent transcripts under those sessions | 138 files (98 under `bolt-flywheel-machinery` alone) |
| Operator messages, identified and read verbatim | 71 in the flywheel-era sessions, 166 in the operator session |
| `openspec/changes/flywheel` | intent.md, design.md, tasks.md, 27 decision records, 7 session directories |
| Bolt changes | `bolt-flywheel-machinery` (tasks.md 1,464 lines / 149 tasks), `bolt-blueprints-tooling`, `bolt-rocs-records`, `add-flywheel-loops`, 2 archived |
| Schemas | `flywheel-intent`, `flywheel-bolt`, `openspec/config.yaml` |
| Skills and profiles | `flywheel-inception`, `flywheel-construction`, the five session-type skills, `conduct`, 5 agent profiles |
| Git | 305 commits, 42 touching `flywheel/tasks.md`, 18 touching the skills and profiles |

Token accounting comes from the `usage` fields in the transcripts, not from
byte estimates. Across the 138 files: **1.58 billion cache-read tokens,
95.4M cache-write, 7.21M output.** `bolt-flywheel-machinery` and its
subagents account for 1.11 billion of the cache reads and 4.10M of the
output — 57% of the run's output in one bolt.

### State of the tree

Re-checked after both bolts landed. `bolt/flywheel-machinery` and
`bolt/blueprints-tooling` are both fully merged into main — zero commits
ahead. Four spec-driven changes are archived. Every finding below was
verified against main after those landings, not left as first written.

What the loop closed on its own:

- **Spec review is bounded.** `flywheel-construction:104`.
- **The dispatch section exists.** `flywheel-inception:247`, and the role
  list at line 16 names it.
- **The ADR task type is out of the schema.** Zero occurrences in
  `flywheel-intent/schema.yaml`; `openspec/config.yaml:25` reads
  "intent: Design/Writeback/Handoff".

Two of those three need another pass, for reasons below: the review bound
is prescriptive in the wrong direction, and the ADR retirement removed the
type without giving ADRs anywhere else to live.

---

## Operator feedback

Every row is a message typed by the operator. Relayed messages between
conductors were excluded.

| # | Correction | First said | Repeats | Recurred? |
|---|---|---|---|---|
| 1 | **Jargon.** "I am constantly reading agents talk about seams, lanes, bars, etc. It's too jargony." | 08-03 23:12 | 08-03 23:51, 08-04 18:41, 08-05 13:23, 08-05 15:42, 08-05 15:52, 08-05 16:35, 08-05 20:00, 08-06 02:19 | **Yes — 9 times in 4 days** |
| 2 | **Stop reviewing, start building.** "NO MORE REVIEWS." | 08-06 22:29 | 23:15 "Why are we still running audits? … Just fucking do the construction", 23:21 "Everything's too procedural, with gates" | **Yes — 3 times in 52 min, two violations between** |
| 3 | **Monitor the agents you start.** "how come you didn't monnitor it. did you not load the /conduct skill?" | 08-06 20:22 | 20:41, 21:44, 23:38, 23:48 | **Yes — 5 times** |
| 4 | **The task list keeps growing.** "we keep creating these nested lists of things to do" | 08-04 19:03 | 08-06 23:53 "your task list is STILL growing" | **Yes — twice, 29 hours apart** |
| 5 | **Too much talking, not enough work.** "I need you to be launching design batches and doing work, and not talking to me as much" | 08-06 19:45 | reinforced 23:21 | Partly |
| 6 | **Design sessions and construction are different things.** "The fact that you didn't understand this … means that our skill or agent profile isn't right" | 08-06 19:35 | — | No |
| 7 | **Stop stalling on approval.** "i guess i don't understand why we're not checking off tasks … over indexing on a human phase gate … you can get approval from me with askuser tool" | 08-06 19:57 | — | No. Commit `152908d` later closed **24 rows done and never checked** |
| 8 | **An intent covers the whole thing.** "an intent should cover all of it, not just wave-0" | 08-06 21:40 | — | No |
| 9 | **Close the conductor when its change closes.** | 08-06 21:46 | — | No |
| 10 | **Subagents are not loading their skills.** "i don't think that agent loaded the opsx:apply skill" | 08-06 22:50 | — | No — it stuck |
| 11 | **Reviews should span proposals and should not be mandatory.** "we don't want to be overly prescriptive implying that the conductor must always run a review of a certain type. that's probably the mistake." | 08-06 22:33 | — | No |
| 12 | **Burn the list; keep an audit trail if you must.** | 08-06 23:54 | — | No |
| 13 | **Writebacks went out through the handoff path.** | 08-06 23:52 | — | No |

### The two that cost the most

**#2.** The directive reached `bolt-flywheel-machinery` by herdr prompt at
22:30:39 as "OPERATOR DIRECTIVE — STOP ALL REVIEWS NOW". After it, the bolt
started `rereview4-session-profiles` (22:39:09), `review-books-conventions`
(23:13:11) and `review-retire-construction` (23:13:24) — 13.5M cache-read,
2.29M cache-write, 106k output. The second complaint came two minutes after
the last two started.

**#3's cause is mechanical.** `intent-flywheel` loaded `conduct` at
**20:22:46** — nine seconds after being asked whether it had.
`bolt-flywheel-machinery` never loaded it at all, across 960 turns and 98
subagents, and ran **every one of those subagents through the `Agent` tool
with zero `herdr agent start`**. `conduct`'s rule 1 forbids exactly that,
by name, as standing operator feedback. The conductor never read the rule.

---

## Token waste

### 1. Review rounds — ~131M cache-read, 16M cache-write, 795k output

`bolt-flywheel-machinery` spawned 98 subagents:

| Kind | Agents | Turns | in + cache-write | cache-read | output |
|---|---|---|---|---|---|
| spec | 7 | 2,116 | 45.5M | 355.8M | 928k |
| **review + re-review** | **22** | **1,434** | **15.7M** | **130.2M** | **795k** |
| apply / build | 7 | 1,256 | 7.5M | 180.0M | 501k |
| rename / amend / re-spec | 8 | 780 | 3.8M | 67.5M | 260k |
| unnamed inner agents | 54 | 608 | 5.1M | 26.1M | 413k |

Fourteen were re-reviews (rounds 2–5): 87.8M cache-read, 521k output.
`flywheel-entry-points` went five rounds; `session-profiles` four.

The conductor named the pattern itself at 21:41 and kept going for another
90 minutes, because nothing let it stop.

### 2. Bash used as the file reader — 412 calls, 1.11M chars (~276k tokens)

**1,428 Bash calls returning 2.06M chars**, against **73 `Read` calls** and
**zero `Grep` tool calls** (88 `grep` runs went through Bash).

| Command | Calls | Result chars |
|---|---|---|
| `cat` | 92 | 315,964 |
| `sed` | 84 | 254,251 |
| `for f in …; do cat` | 41 | 223,767 |
| `grep` | 88 | 139,782 |
| `ls` | 81 | 92,779 |
| `wc` / `head` / `find` | 20 | 72,082 |

Biggest single results: `cat -n tasks.md` (29,500 chars), a three-file
`for … cat` over book chapters (29,094), `sed -n '200,420p'` over
`target.js` (27,599), one recursive `grep -rn` over `books/` (26,944).

`Read` truncates, paginates and gives line numbers. `cat` does none of it.

### 3. Prose between agents — ~330k tokens, and it never leaves context

`bolt-flywheel-machinery` received **90 teammate messages totalling 648,823
characters** and sent **111 `SendMessage` calls totalling 330,733**.
Separately, **119 `herdr agent prompt` calls carried 335,963 characters of
prompt body through Bash.** About 1.32M characters in all.

Individual messages ran to 36,839 characters. Every inbound one stays in
the conductor's context for the rest of the session — which is why that
session reached 353.5M cache reads over 960 turns.

The reports are good writing and five to ten times longer than the decision
they carry.

### 4. Task files that stopped being lists

`flywheel/tasks.md`:

| Time (UTC) | Lines | Tasks | Checked |
|---|---|---|---|
| 16:28 | 45 | 13 | 1 |
| 19:27 | 124 | 26 | 10 |
| 21:45 | 302 | 35 | 18 |
| 23:54 | 643 | 42 | 19 |

Between 21:45 and 23:54 it grew 302 → 643 lines while the checked count
moved by one. `bolt-flywheel-machinery/tasks.md` reached **1,464 lines for
149 tasks** — ten lines per task.

The cause is not volume. It is that nothing said what a task line is for,
so conductors used it to record their own reasoning about orchestration.
Both skills mandate re-reading the change at every turn start, so every
paragraph written into it is re-read for the rest of the run.

*Negative result:* the conductors did **not** waste tokens re-reading whole
files. `bolt-flywheel-machinery` touched `tasks.md` 92 times through Bash
for 43,907 characters total — 477 per call, all targeted slices. Only four
files anywhere were `Read` three or more times in one session, and no
`Grep` pattern was ever repeated. The re-read hypothesis is not supported.

### 5. CLI syntax rediscovered by trial and error — ~50 failed calls

Of 1,428 Bash calls, **91 returned an error**.

- **`herdr worktree create --cwd <a worktree path>`** fails with
  `linked_worktree_source`. Ten failures across **four separate sessions**,
  each followed by `--help` and a retry with the parent path. Four sessions
  paid the same tuition.
- **`git commit -q -- <paths> -m "<msg>"`** — seven failures, one each in
  seven different sessions, all `error: pathspec '-m' did not match`. The
  pathspec rule spelled with `-m` after the `--` separator.
  `openspec/config.yaml:20` still reads "Commit after any artifact change."
- **`herdr agent start --kind`** — one session rediscovered the valid kinds
  from an error message.

### 6. Five reviews that could not have caught the defect

The bolt's 22:31 report records that five reviewers across five rounds read
one `tasks.md` and none noticed it omitted the section's shape, content
order and actor roster — the positive specification lived only in
`design.md`. Roughly 20M cache-read and 150k output on that row's review
rounds. One agent asked to read the file as the builder found six defects
in a single pass.

---

## Skill inefficiency

### 1. Both flywheel skills point at `conduct` and neither says to load it

`flywheel-inception:20` and `flywheel-construction:20` both say the herdr
mechanics "come from the `conduct` skill; this skill does not repeat them."
Neither says *load it*.

**Eight of the twelve flywheel sessions never loaded `conduct`.** The two
that did loaded it late. `bolt-flywheel-machinery` never did, and ran 98
`Agent`-tool subagents against `conduct`'s rule 1.

Pointing at a second skill is the defect, not the phrasing. A skill that
delegates its most-violated rules to a document the reader may never open
has no way to bind anyone. Both skills survived the bolt with this
unchanged.

### 2. Two skills publish two different lists of sanctioned vocabulary

`flywheel-inception:122` names seven terms; `flywheel-construction:81`
names four. Both claim to be the whole set, and they disagree about
`decision`, `proposal`, `fog` and `frontier`. An agent that loads only the
construction skill is told `decision` is not sanctioned vocabulary while
writing decision records.

### 3. The ADR type was removed without giving ADRs a home

`decisions/adr-is-a-handoff.md` retired the type because an ADR writes into
a built repo and the two-things rule makes that a handoff. The reasoning is
sound and the schema is clean. What no record now states is **where a bolt
conductor writes an ADR** — and construction is exactly where the material
for one exists. Today the only mention of ADRs anywhere in the machinery is
one line in `flywheel-interactive/SKILL.md:33`, which the retirement left
behind.

This is a live gap, not a stale pointer.

### 4. `conduct` is written for a topology the flywheel does not use

`conduct` is organised around waves, briefs in GitHub issues, and per-wave
operator approval. Its **rule 5** — "The operator reviews wave briefs before
launch … Present the brief; wait for the go" — was read by
`bolt-dispatch-rename` as a per-wave gate inside released work, and the
intent conductor had to overrule it at 21:02. That will recur for every
bolt conductor that loads it.

### 5. The review bound is now prescriptive in the other direction

`flywheel-construction:104` reads "A proposal gets **one review round**."
That fixes the runaway and creates the opposite failure: a one-line edit to
a text file now carries a mandated review, and a genuinely risky proposal
is capped at one. Review is a judgement about the cost of a wrong success
claim. Neither "always" nor "once" is that judgement.

### 6. Things an agent had to ask that the skill should have answered

Ten `AskUserQuestion` calls across the flywheel sessions. Two were skill
gaps: the singleton's name (already settled in `dispatch-singleton-name.md`
while the profile file and skill section still said intake), and worktree
isolation cost (a measurement, not a decision).

One actively cost time: at 22:22 an operator release had to be relayed by a
second session because "the ADR question form swallowed the composer." A
blocking question form in a long-lived conductor pane blocks the operator
from typing anything else into that pane.

### 7. Negative results

- **The rename protocol did not fail.** No mangled rename appears in any
  flywheel session. The ceremony is cheap and it worked.
- **Prompt-submission checks did not fail.** The one delivery defect was
  different — a slash command typed as prose in a charge body, which never
  loads the skill. Caught at 22:50, recorded as `bc73e48`, fixed in every
  later charge.
- **Inbox draining behaved.** No case of an agent appending a drained
  request instead of re-walking the sequence.

---

## Jargon

### The governing rule reaches almost none of the material

`books/CLAUDE.md` carries the ban list — hedges; metaphor used as
justification (*load-bearing, first-class, source of truth*); undefined
structural jargon (*seam, lane, bar, spine, rung, face*); performative
emphasis; soft sales; meta-narration. It governs `books/` alone.

Decision records, `tasks.md`, bolt artifacts, session reports, commit
messages and agent-to-agent prose are all outside it. The only rule that
reaches them is one bullet: "Plain language everywhere. The flywheel's
terms … are the whole private vocabulary." No ban list, no glossary, no
check, and no sentence saying the set is closed.

### Inventory, on main after both bolts landed

| Term | skills + profiles | schemas + config | root CLAUDE.md | flywheel change | Status |
|---|---|---|---|---|---|
| bolt / intent / decision / handoff | 80 / 50 / 21 / 10 | 43 / 34 / 30 / 5 | — | high | Sanctioned |
| writeback | 43 | 6 | 0 | 97 | **Not on either list** |
| **surface** (noun) | **52** | 2 | 0 | 69 | **Banned by `books/CLAUDE.md`** |
| shape (noun) | 6 | 0 | 1 | 50 | Not on either list |
| **state claim** | **8** | 0 | 0 | 5 | **Coined 08-06 21:53** |
| fog | 5 | 3 | 1 | 16 | Sanctioned |
| frontier | 5 | 1 | 0 | 5 | Sanctioned |
| **seam** | **2** | 0 | 0 | 20 | **Banned; operator said it was eradicated** |
| load-bearing | 0 | 0 | 0 | 4 | On the ban list |
| limb | 0 | 0 | 0 | 3 | Coined 08-06 23:24 |

### The landing made it worse, and that is the finding

The bolt whose subject was the loop's own machinery rewrote both skills,
split the session profile, and added five session-type skills. In the
skills and profiles, before that landing and after:

| Term | Before | After | Change |
|---|---|---|---|
| surface | 10 | **52** | ×5.2 |
| state claim | 0 | **8** | new |
| seam | 0 | **2** | new |

The corpus grew from 7 files to 12, so some rise is expected. The
composition is the point:

- **`surface` is now the most-used banned word in the governing skills.**
  `books/CLAUDE.md` names it as the example of what not to write; each of
  the five new session-type skills carries it.
- **`state claim` was coined by a spec agent at 21:53 and is now a section
  heading in `flywheel-inception`** — about six hours from one subagent's
  phrasing to a rule every actor loads, with no definition anywhere.
- **`seam` entered the skills for the first time**, after the operator had
  said "i thought we eradicated this."

A skill cannot govern the bolt that rewrites it, and no merge criterion
read the prose. That is the argument for putting the rule in
`openspec/config.yaml`, which every `openspec instructions` call carries.

### Entry points, traced

**`surface` was installed by the skill itself.** `flywheel-inception` uses
it as a heading concept — "**Review surfaces**: plannotator for written
artifacts … lavish for built interactive surfaces", "whether the operator
is reading a document or working a surface". Agents are conforming to the
skill, not defying the ban list.

**`shape` the same.** `flywheel-construction` had "**Branch shape**"; 50
uses follow in the change, most not about branches — "the shape of the
mistake", "shape decides which channel", "the repo shape".

**`limb` — coined and amplified in two minutes, with timestamps.**

| Time | Event |
|---|---|
| 23:24:43 | bolt → intent: "What is missing is a THIRD LIMB…" |
| ~23:25 | Commit `9be8103`: "the retirement test grows a third limb" |
| 23:26:08 | intent → bolt: "THIRD LIMB: CONFIRMED AND ADOPTED" |

Nobody defined it. It means *clause*.

**`state claim` / `content claim` — coined by a subagent, adopted upward.**
The bolt's 21:53 report says so: "THE FORMULATION, which one of my spec
agents got to before I did." Within an hour it was a routed finding, a
rule, a commit subject (`50b431e`), and instructions in three later
charges. Unlike `limb` this one names a real distinction — but it was
promoted to a section heading in the governing skill without ever being
defined or added to the sanctioned list.

### Commit messages: the most-copied corpus, drifted in one day

Classifying all 305 commit subjects — noun-phrase opening rather than an
imperative verb, and two clauses joined by a comma:

| Date | Commits | Noun-phrase | Two-clause |
|---|---|---|---|
| 06-10 → 08-02 | 27 | 1 | 2 |
| 08-03 | 24 | 0 | 2 |
| 08-04 | 28 | 1 | 2 |
| 08-05 | 33 | 2 | 1 |
| **08-06** | **190** | **116** | **62** |

Before 08-06: "write the flywheel-inception skill", "close the
chapters-and-channels batch". After 21:00: "content survives, enforcement
decays into superstition", "the newest paragraph is the least-reviewed
one", "a guard sharing its input with the thing it guards is not a guard".

These are conclusions, not descriptions. `9be8103` names neither the file
it changed nor what it changed.

Two mechanisms, both findable:

1. **Destination voice leaking out of `books/`.** "State what the system
   does. Do not narrate the act of designing it." Applied to a commit
   subject that becomes "the gate authorizes release" instead of "make the
   gate authorize release". Nothing says the voice rule stops at the
   chapter.
2. **`wt merge` instructs imitation.** Its squash-message prompt, visible
   in the transcripts, contains *"Match the style of commits being
   squashed"*, and it is fed the recent subjects. A style that appears once
   propagates into every squash after it. The `git-commit` skill is plain
   Conventional Commits and says nothing about epigrams — so this is
   imitation, not instruction.

### How much of this is the model rather than the repo?

Worth separating, because the remedies differ. What the evidence supports:
the four traced coinages above entered through repo artifacts — a skill
heading, a subagent's report, a commit subject — and each has a timestamp
and a propagation path. Those are repo problems and repo-fixable.

What it does not settle is the baseline: whether an agent starting from an
empty repo would still reach for *surface*, *shape* and aphoristic commit
subjects. Nothing in the transcripts isolates that. Two things are known:
no skill in this machine or any installed plugin uses an output-style
frontmatter field, and there is no `~/.claude/output-styles/` directory —
so whether a skill can pin an output style is unverified here and needs
checking against the Claude Code docs rather than assuming.

This bears directly on the ban-list question: **a ban list governs what
agents write, not what they read.** If the tendency is upstream of the
repo, a ban list narrows the gap without closing it, and the repo-side
fixes below are worth doing for the traced cases regardless — because those
are demonstrably self-inflicted.

### The sanctioned set

Reviewing the seven against use:

- **intent, bolt, decision, handoff, proposal** — earn their place. Each
  names a thing with a schema, a directory and a lifecycle.
- **writeback** — 163 uses and on neither list, despite being a typed
  section heading. Add it.
- **fog** — 25 uses, all substitutable by *open questions*. The schema
  installs it: `intent.md` section 4 is "Fog — what is not yet decided, as
  questions", which puts the plain phrase directly beside the coinage that
  replaces it. Drop it.
- **frontier** — 14 uses, all meaning "the open items in tasks.md". Drop
  it.
- **phase gate** — drop it. What it names is an **approval**, and the
  mechanism is the conductor asking for one. Naming the mechanism "phase
  gate" is what turned an approval into ceremony; the operator's own
  correction at 19:57 was that the loop was "over indexing on a human phase
  gate" while the fix was simply to ask.

Net: **intent, bolt, decision, handoff, proposal, writeback** — six, each
naming a schema object. Approvals are called approvals.

---

## Cross-cutting causes

**1. A rule stated once, in one place, does not reach the surface that
needs it.** The ban list is in `books/`; the material that broke it is in
`openspec/changes/`. The herdr rules are in `conduct`; the sessions that
needed them never loaded it. The pathspec rule was on a bolt branch; the
sessions that got it wrong read `openspec/config.yaml` on main. In every
case the rule existed and was correct.

**2. The loop records rules faster than it propagates them.** Twenty-seven
decision records in one day, each staling every artifact that described it
as open. The bolt: "Every finding I route to you comes back as an amended
decision, and the amendment stales every proposal that described the
finding as open. I swept five of seven proposals for exactly that this
round."

**3. Nothing said what any artifact was *for*.** Task lines had an append
rule and no definition. Reports had required content and no length. Review
had a mode and no round limit. Findings had a routing rule and no closure
rule. Each is defensible alone; together they produce "Everything's too
procedural, with gates." Every bound that exists today was added by the
operator saying stop.

**4. Agents took their style from the artifacts they read, because those
were the only style signal available.** Commit subjects, coinages and
report length all propagated by imitation within hours. Two loops are
mechanical and fixable — the `wt merge` squash-style instruction, and
decision records read as exemplars. The rest follows from cause 1.

---

## Recommendations

Ranked by value over effort. Items 1–4 are the ones worth doing first.

### 1. Absorb `conduct` into the flywheel skills; stop pointing at it

Do not add "load the `conduct` skill". Take the content.

Each flywheel skill gains a short section in its own words covering the
multiplexer and agent-to-agent communication: what a pane and an agent are,
how a conductor addresses one, how a session reports back, and the
detection line `test "${HERDR_ENV:-}" = 1`. Beneath it, a bundled reference
file — `.claude/skills/flywheel-construction/reference/herdr.md` — carrying
the explicit invocations an agent needs, spelled out rather than described:

- `herdr worktree create --cwd <the repo's parent workspace path>` — not a
  worktree path; that returns `linked_worktree_source`.
- `herdr agent start <name> --kind claude --pane <pane> -- --agent <profile>`,
  with the valid kinds listed.
- the rename-then-confirm sequence before any charge.
- `git add <paths>` then `git commit -- <paths>` — never `-a`, never
  `add -A`, never `-m` after the `--` separator.

This closes the correction repeated five times, the 98-subagent rule
violation, the ~50 failed CLI calls, and the `conduct` rule-5 collision at
once — because a rewritten reference states what this loop does, and does
not carry a wave-and-brief topology the flywheel never used.

### 2. `Read` files, `Grep` to search

One line in each skill's shared rules: read with `Read`, search with
`Grep`; Bash is for commands that change state — git, openspec, herdr, wt,
the gates — and for the gates' own output. Two lines against ~276k tokens
per run of the size measured.

### 3. Say what a task is

**A bolt's `tasks.md` holds orchestration steps and nothing else.** Every
line is a step in dispatching, tracking, or landing a subagent's work: what
gets spawned, what it is charged with, what state it moved to, what blocks
it. It is not a scratchpad, and a conductor does not need one — the
reasoning belongs in the report it sends and in the decision records the
intent holds. Where a ruling has to survive, it goes to the intent as a
finding, not into the task file as a paragraph.

An intent's `tasks.md` holds the same discipline against its three typed
sections: a line is a checkbox, a blocker and a pointer.

### 4. Approvals, not gates

Remove "phase gate" from the vocabulary and from both skills. State the
behaviour instead: **when a conductor needs the operator's approval it asks
for it, with `AskUserQuestion`, and keeps working on anything the answer
does not block.** A conductor expecting asynchronous prompts does not hold
a blocking question form open in its pane.

### 5. Review is a judgement, not a rule

Replace the one-round bound with the criterion. A conductor **may** add a
review task for a proposal where a plausible-but-wrong success claim would
be expensive and no mechanical check would catch it; it need not for small
edits to text files, and it may run more than one round where the risk
warrants. Reviews may span proposals rather than being one per row. When
re-reviews start bouncing on defects the fixes introduced, that is the
signal to stop reading and build. A declared review that is not run is
recorded as not run.

### 6. Give ADRs a home on the construction side

The retirement was right and it left a hole. A bolt conductor is where the
material for an ADR exists, and it should be able to write one. Settle
where an ADR lands, who writes it, and whether it needs a tracked task —
see item 7, which it is a case of.

### 7. Let a bolt conductor improve itself cheaply

Name the edits a bolt conductor may make directly, without a nested
construction worktree and without a tracked proposal: `CLAUDE.md`, ADRs,
and the loop's own machinery where the change is small and self-evident.
Everything else stays inside the tracked path.

Both skills must also tell agents to catch up on their base branch rather
than drifting from it — `wt step rebase` is the primitive, and it is what
`wt merge` runs anyway.

### 8. Conductors on main work in worktrees

An intent or bolt conductor editing on blueprints main shares one index
with every sibling — the collision this loop hit repeatedly. Each should
cut its own worktree for its edits and merge back when it dispatches a
session. This has to be cheap: no test run, no server, no acceptance suite.

### 9. One closed vocabulary list, in `openspec/config.yaml`

Six terms — intent, bolt, decision, handoff, proposal, writeback — in the
`context:` block, so every `openspec instructions` call carries it and no
bolt can rewrite it out of a skill. Remove both divergent lists from the
skills. Add the sentence that makes the set closed: *a term outside this
list that is not an ordinary technical word is a defect; use the plain word
or add the term to this list in the same commit.* "Are the whole private
vocabulary" describes a set without forbidding additions, which is how
fourteen terms arrived in one day without anyone breaking a rule.

### 10. Scope the voice rule past `books/`

`books/CLAUDE.md`'s Voice section becomes the repo's voice rule, referenced
from root `CLAUDE.md`, stating its scope: it governs every written artifact
— chapters, decision records, task lines, bolt artifacts, session reports
and commit subjects — with destination voice and the no-iteration-history
rule applying to chapters only.

### 11. Break the two imitation loops

- `decisions` artifact instruction, both schemas: *earlier records in this
  directory are evidence about the design, not models for the prose.*
- Root `CLAUDE.md`: *a commit subject names what changed, imperatively;
  destination voice is for chapters, not for git.* And stop feeding `wt`'s
  squash-message generator "match the style of commits being squashed"
  against a corpus of aphorisms — pin it to Conventional Commits or state
  the subject rule in the template.

### 12. Clean the traced jargon in this repo

The four traced terms entered through this repo's own artifacts, so they
are ours to remove: `surface` in the skills and profiles (52), `seam` (2 in
the skills, 20 in the change), `shape` where it is not about a branch, and
`state claim` — which needs either a definition and a place on the list, or
a plain replacement.

### 13. Shorter reports

A report to a conductor or the operator states three things and stops: what
was found, the evidence for it, and what it asks the reader to decide or
do. Length is the problem, not content — inbound reports ran to 36,839
characters and stayed in the receiving conductor's context for the rest of
its run. Where the reasoning behind a finding matters, it belongs in the
decision record the finding produces, which is where a later reader will
look for it.

### 14. Check whether a skill can pin an output style

Unverified and worth ten minutes: no skill in this machine or any installed
plugin uses an output-style frontmatter field, and no `~/.claude/output-styles/`
directory exists. If Claude Code supports it, the flywheel skills are the
right place to pin a plain-language style, and it addresses the share of
the jargon that is upstream of the repo — which items 9 to 12 cannot.

---

## Open questions

**Where do ADRs live now?** Item 6. The type is gone from the intent schema
and nothing on the construction side replaced it.

**Is the ban list worth it if context arrives cluttered from elsewhere?**
Partly answered above: the four traced coinages are self-inflicted and
repo-fixable, so items 9–12 pay for themselves on those. Whether they close
the remaining gap depends on item 14, which is unmeasured.

**Would a builder read-through before build have caught the wrong-file
class?** It did once — one agent, told to read `tasks.md` as if it were the
builder and say where it would get stuck, found six defects that five
review rounds missed. Whether that is worth one pass per proposal, or is
just what a competent apply agent does anyway, is a judgement call and is
the operator's.

## What could not be determined

**Whether the review rounds were net negative.** They cost 130M cache-read
and 795k output and found real defects. What the transcripts cannot show is
what those defects would have cost had they landed. *Settled by:* running
the next bolt under item 5 and comparing the defect rate at merge.

**Whether the `Agent` tool cost anything beyond visibility.** The 98
subagents produced good work. The measurable harm is that the operator
could not see them. *Settled by:* running one bolt each way.

**Reasoning-token volume.** `thinking` blocks are not stored in these
transcripts, so "long thinking before a trivially checkable fact" could not
be tested. Output tokens are a lower bound.

**Whether every operator message was caught.** Messages were identified by
excluding tool results, system reminders, task notifications, command
output, hook output and inter-agent relays. Relays are the risk: several
arrive as ordinary user turns beginning "Operator directive, relayed
verbatim…". Those were treated as relays except where a second session
confirms the operator typed them. If any relay was typed directly, the
correction count is one or two higher, not lower.
