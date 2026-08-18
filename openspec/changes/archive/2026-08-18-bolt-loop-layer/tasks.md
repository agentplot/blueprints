# Tasks

## Spec
- [x] session-type set: enumerated from the existing five as models plus
      the loop-machinery plan's measured scope; the type↔skill↔profile
      table with default models landed in
      openspec/specs/flywheel-session-type-skills/spec.md
- [x] bolt schema family: the three loop shapes and the intent loop
      drafted from the loop-layer page's Mechanics tab; zero mechanism
      words verified before and after the review fixes

## Review
- [x] independent read of the session-type set against
      `session-types-are-the-task-taxonomy` · `agent-profiles` ·
      `session-model-defaults` (declared: agent). Verdict: NOT CLEAR,
      eleven defects — the skills and profiles clean, the structural
      changes unpropagated into the specs and schema. All eleven fixed:
      one canonical two-part host rule in four sites; three-profile /
      thirteen-type counts and the write matrix through every spec; the
      removal guard retargeted at the retired name; the five-vs-six count
      and stale promote scope in the intent schema; the model-default
      column added as the one enumeration and the shared reference
      aligned to it; the `conduct` citation dropped; the work-order
      rename backed by decisions/the-work-order.md and finished;
      reference pointers and opens-no-round lines added to the new
      skills and profiles; `__pycache__` untracked and ignored
- [x] independent read of the schema family against
      `the-bolt-schema-family` · `dynamic-workflows-drive-the-loop` ·
      `the-trigger-lives-in-the-invocation` ·
      `rule-1-amended-for-workflow-sessions` (declared: agent). Verdict:
      NOT CLEAR, nine defects — the four requested mechanical checks all
      passed; the failures were the surrounding tree. All nine fixed:
      `flywheel-bolt` grafted the default loop (a live bolt was bound to
      a loop-less schema, delivering OpenSpec's generic fallback) and
      this change rebound to `bolt-default`; the construction skill's
      review prose now defers depth to the member; bolt-default's depth
      names the independent proposal-review rather than deferring to the
      row; the intent loop states `verify` lines are the conductor's own
      checks, not a session type; the smell check is hosted as a
      code-review session and the skill carries it; both loop skills
      name the family; the bolt-conductor eval fixture re-copied;
      bolt-quick restated declared-review latitude; the config context's
      envelope prose de-agented (7 → 4 hits, remainder are command
      strings)
- [x] independent read of the fleet manifest + command against decisions
      26–29 (declared: agent). Verdict: NOT CLEAR, seventeen defects,
      two blockers proving `up` had never run — `--json` on a command
      without it, pane id read at the wrong nesting. Fixed by rewrite:
      correct payload paths; `-n <name>` at launch replacing the
      rename race; pane-busy polling; orphaned tabs closed on failure;
      host identity by hostname with `--host` override; manifest
      validation; full-line-only comments; conductor prompts are the
      whole `/opsx:apply` invocation; dispatch frontmatter and launch
      line corrected, owner fallback and owner-sense note added; the
      manifest-update rule stated where conductors are hand-started.
      Verified end to end this time: a scratch row started under its
      profile and name, took its prompt, replied, was observed by
      `status`, and was torn down. Deliberate N=1 cut, recorded: the
      multi-host `reach:`/`access:` placement rules wait for a second
      host

## Build
- [x] renames: `flywheel-review` → `flywheel-planning`,
      `flywheel-review-session` → `flywheel-design-session`, every
      reference in the tree — the four surviving mentions are the specs'
      own retired-name guards · 607f3cc2
- [x] eight session-type skills under `.claude/skills/flywheel-*` — the
      seven construction types plus `flywheel-handoff`, which the
      loop-machinery plan measured as uncovered
- [x] `.claude/agents/flywheel-construction-session.md`, with the
      per-type model defaults
- [x] `openspec/schemas/bolt-{default,quick,deep}/` — artifact
      instructions shared from `flywheel-bolt`, only `apply.instruction`
      differs; all four validate; zero mechanism words in every loop
      prompt
- [x] the intent loop shape in `openspec/schemas/flywheel-intent/schema.yaml`
- [x] the invocation phrase in both conductor profiles, with the scoped
      rule-1 amendment landed in both loop skills
- [x] `.claude/skills/_reference/herdr.md` + pointers — the construction
      copy as base, the design-session spawn sequence kept, `conduct`
      retired · c5cbfc45
- [x] `openspec/config.yaml`: envelopes into `context:`, `rules.tasks`
      intent sections corrected
- [x] three persona profiles: user-data-scientist, user-devops-engineer,
      user-app-developer
- [x] `fleet/fleet.yaml` + the `fleet/flywheel` command (up / status) —
      both verbs verified live after the fleet review's rewrite: `up`
      started a scratch row end to end (tab → agent under profile and
      name → prompt → reply → teardown), `status` observed it by name
- [x] `owner:` in `.openspec.yaml` (this bolt's carries it); change → owner
      → DM resolution in the dispatch relay; the prepared release names
      the bolt's owner (intent-conductor profile + flywheel-handoff)
- [x] before merge: re-read every neighbour from disk. The re-read caught
      one stale claim, as warned: sole-writer-conductors.md grants a
      session the decision records for questions it closed firsthand,
      and the profiles drafted here said "never writes a decisions/
      record" — corrected in profiles, inception, and flywheel-planning.
      agent-profiles.md's "no flywheel actor is a Task-tool subagent"
      line predates rule-1-amended-for-workflow-sessions and is the
      intent's to reconcile; reported, not edited.

- [ ] evals for the eight new session-type skills, `skill-creator` run
      over each — owed by `session-types-are-skills.md` and the eval
      specs; not landed in this batch
- [ ] routed to intent-flywheel, not this bolt's:
      `books/aidlc-design/src/conducting.md:101` still carries the
      superseded two-things write scope (a chapter is the design
      loop's); `decisions/agent-profiles.md`'s "no flywheel actor is a
      Task-tool subagent" line predates the rule-1 amendment

## Test
- [x] gates on the bolt branch, rerun after every review round: books ok
      (8 built, sidecars validated), mermaid ok (228 diagrams), map
      clean
- [x] grep-clean: the six surviving `flywheel-review` mentions are all
      the specs' own retired-name guards; zero mechanism words in all
      five loop prompts, re-verified after the depth-wording fixes

## Merge
- [x] `wt merge` bolt/loop-layer onto main, full hooks, --no-squash —
      9 commits, 73 files, landed at ecfb85bc
