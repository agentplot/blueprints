# The order, and how anyone would know it worked

`split-after-the-runs.md` settles that the split lands as one bolt after both
end-to-end runs. This is the inside of that bolt: the sequence, what is broken
in blueprints while each step runs, and an acceptance built on the checklist
already recorded rather than replacing it.

## The sequence

| # | step | what is broken in blueprints while it runs |
|---|---|---|
| **0** | the repo exists, empty of machinery, gates green | nothing — **done this session** |
| **1** | generic book conventions written in the flywheel repo (`book-knowledge.md`) — new writing, not a move | nothing |
| **2** | context-map tool built in `tools/context-map/`, de-hardcoded per `context-map-tool.md`, **copied not moved** | nothing — blueprints still runs its own copy |
| **3** | blueprints switches to the packaged tool | the `map` pre-commit gate, for the length of the step; the map's URL and its `_site` publish path both change |
| **4** | both schemas published as user schemas and **resolving** | nothing — a user copy is shadowed by the project copy, so both exist and both resolve |
| **5** | skills, profiles, schemas and evals move; skills drop the `flywheel-` prefix; the project schema copies are deleted; the re-edit query runs | every live reference to `.claude/skills/flywheel-*` and `.claude/agents/flywheel-*`; blueprints' own conductors cannot resolve their skills until the plugin is installed there |
| **6** | install the plugin in blueprints; run acceptance | — |

### The ordering constraint no record states: 4 before 5

`openspec schema which --all` reports three sources — `project`, `user`,
`package` — and the resolution record carries a `shadows` field, so a project
copy shadows a user copy. Publish the user schemas **first** and the project
copies can then be deleted with the binding already live underneath, invisibly
to every open change. Reversed, every change bound to `flywheel-intent` or
`flywheel-bolt` loses its schema for the width of the gap.

`flywheel-repo-manifest.md` lists publishing as an appended Handoff task and
lists the schemas as travelling, without saying which happens first. It is one
sentence and it is the difference between a no-op and an outage.

### Why 2 copies rather than moves

Steps 2 and 3 are separable, and separating them is what makes step 3 safe:
the tool exists and is exercised in its new home while blueprints is still
running the old one, so the switch is a switch rather than a leap. Step 3 is
the riskiest step in the plan and should be its own proposal with the gate as
its acceptance.

## The re-edit query, and the exclusions it needs

`split-after-the-runs.md` is right that the list is **derived by query at split
time, not inherited**. Run today, over the tree as it stands:

```
grep -rIlE 'flywheel-inception|flywheel-construction|flywheel-interactive|\
flywheel-prototype|flywheel-research|flywheel-review|flywheel-writeback|\
\.claude/skills/flywheel|\.claude/agents/|openspec/schemas/flywheel' \
  --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=_site .
```

**121 files.** Excluding `changes/archive/` and every `sessions/` directory:
**76.**

That exclusion is not a convenience. `session-directories.md` settles that a
closed session directory is never rewritten, because it is the trail — and ten
session directories under this change alone name the old paths. As the two
records stand they contradict each other: one says derive the list by query,
the other says do not touch most of what the query returns. **State the
exclusions in the query or the acceptance can never pass.**

The remaining 76 partition three ways, and the partition is the actual
deliverable of the query:

### Must re-edit — the live machinery and the live instructions

- the 5 agent profiles under `.claude/agents/`
- the 7 skills under `.claude/skills/flywheel-*/` — `SKILL.md`, the
  `evals/` trees, and `flywheel-inception/reference/herdr.md`
- `openspec/schemas/flywheel-intent/schema.yaml` — its `sessions` instruction
  names two profile paths and five skill paths
- root `CLAUDE.md` — its flywheel section names both skills, `.claude/agents/`,
  and both schema paths
- `books/aidlc-design/src/authoring-capabilities.md` and `foundations.md` —
  the two chapters that name the skills
- the live `tasks.md` of every open change that references them:
  `flywheel`, `add-flywheel-loops`, `bolt-blueprints-tooling`,
  `bolt-flywheel-machinery`, `spike-context-cleanup`

### Must NOT re-edit — the record

- everything under `openspec/changes/archive/`
- every `sessions/` directory
- **the nineteen `openspec/changes/flywheel/decisions/*.md` that name a
  machinery path.** A decision record is authoritative on its decision and
  describes the state at the moment it was made. Rewriting
  `agent-profiles.md`'s paths to post-split names would make it assert
  something that was not true when it was decided, and would quietly destroy
  the ability to read the record as a sequence. Decisions are amended when a
  decision changes, not when a path does.

This partition is not in any record and it needs to be, because the natural
reading of "grep the tree and re-edit whatever answers" gets it wrong in
exactly the expensive direction.

### Judgment, named so nobody has to invent an answer at 2am

`add-flywheel-loops` moves (operator's annotation), and it names the old paths
throughout its `proposal.md`, `design.md`, `tasks.md` and two spec deltas. If
it moves it is re-edited to the new names, because in its new home the old
paths are simply wrong. That is a rewrite of a live change, not of a record,
so it belongs in the first partition — but it is the one member whose
classification is a call rather than a fact.

## Acceptance

`flywheel-repo-manifest.md` and `split-after-the-runs.md` carry five items.
All five are kept. Four are added, because the five cover packaging and
nothing else — and packaging is the half an end-to-end run cannot exercise but
also the half least likely to be what actually breaks.

### Kept

1. **Install clean.** `/plugin marketplace add agentplot/flywheel`, then
   `/plugin install flywheel@flywheel`. Record which name the marketplace
   registers under — the one inference `flywheel-own-repo.md` flagged and did
   not confirm. It is now a one-command check against a live repo with nothing
   at stake, and it should be run before anything depends on the answer.
   `claude plugin validate --strict` is the mechanical half and already runs in
   the new repo's CI on every push.
2. **Launch all five profiles.** `claude --agent flywheel-<name>` for each;
   the **bare** name must resolve, which is the whole reason the profiles keep
   their prefix while the skills drop theirs.
3. **Invoke both loop skills namespaced** — `/flywheel:inception`,
   `/flywheel:construction` — and the five session-type skills the manifest
   does not name: `/flywheel:interactive`, `/flywheel:prototype`,
   `/flywheel:research`, `/flywheel:review`, `/flywheel:writeback`.
4. **Both schemas resolve from `user`.** `openspec schema which flywheel-intent`
   and `flywheel-bolt` report source `user` with an empty `shadows` in
   blueprints.
5. **No absolute path survives `${CLAUDE_PLUGIN_ROOT}`.** Now
   `scripts/check-paths.mjs` in the new repo's CI rather than a grep run once —
   it covers `skills/`, `agents/`, `schemas/`, `tools/`, `bin/`, `hooks/`,
   `commands/`, and it fails the build.

### Added

6. **A live intent survives the schema swap.** Pick one open change on
   blueprints main. `openspec validate <id>` before step 4 and after step 5;
   the result must be identical. Packaging being correct says nothing about
   whether the record still resolves, and the record is what the loop runs on.

7. **A writeback runs end to end in a repo with no `books/CLAUDE.md`.** The
   only real test that the book-conventions reference works: a scratch repo
   with a two-chapter book and no authoring convention of its own, a charge
   naming the writeback type, and a chapter rewritten in destination voice with
   the gates green. Run against blueprints it proves nothing, because
   blueprints has the 508-line binding that would have carried it anyway.

8. **The map gate is green in blueprints from the packaged tool**, and
   `context-map build` output opens with zero sibling `<script src>` tags.
   Plus one negative: `context-map check` must **fail** on a deliberately
   mistyped slot id in `configurations.js` — the proof that the topology
   vocabulary is validated rather than merely relocated. A de-hardcoding that
   is not checked is a hardcoding with extra steps.

9. **The re-edit query returns empty over the first partition**, with the
   exclusions above written into the command rather than applied by hand.

### Once the skills land

10. **`claude plugin eval .` green** in the flywheel repo. All seven skills
    carry `evals/` — 38 files across them — and `claude plugin eval` runs
    exactly that shape (`evals/**/case.yaml` or `prompt.md` + `graders/`), with
    a no-plugin baseline arm. The CI step is already written and no-ops until
    the directories arrive, so it starts biting on the commit that lands them
    rather than on the day somebody remembers.

## What this does not settle

The four questions `2026-08-06-flywheel-own-repo` left open are still open.
Three are unchanged. The fourth — which name Claude Code registers a
marketplace under by GitHub shorthand — is now acceptance item 1 and costs one
command.

Two more surfaced from the tree and are in `flags.md`: what happens to the
eight spec capabilities `add-flywheel-loops` deployed under `openspec/specs/`,
and whether the flywheel repo's OpenSpec ends up carrying a `spec-driven`
change from another repo's tree.
