# Session: flywheel repo split

**Change:** `flywheel` · **Type:** research + planning · **Date:** 2026-08-06

## Charge

Stand up `agentplot/flywheel` and write the plan for moving the machinery
into it later. Given directly by the operator, outside the loop — no bolt, no
proposals, no spec agents.

Three settled records are the ground this builds on and none of them is
reopened here: `decisions/flywheel-own-repo.md` (the repo and how it
installs), `decisions/flywheel-repo-manifest.md` (what travels and what
stays), `decisions/split-after-the-runs.md` (the sequencing).

Three questions were named as the plan's real content:

1. Moving `flywheel-writeback` means moving the knowledge of **what a book
   is** — and that knowledge lives in `books/CLAUDE.md`, which stays.
2. The **context map becomes a distributable tool**, and its data does not
   travel with it.
3. The **order and the acceptance** — what moves when, what breaks at each
   step, and how anyone would know the move worked.

## What was done, not just planned

`agentplot/flywheel` exists and is standing: public, bare layout under
`Code/github_agentplot/flywheel/`, both `.claude-plugin/` manifests, OpenSpec
initialised under `spec-driven`, a README written fresh, a GitHub Pages
landing page, and four gates wired into three callers (`wt` pre-commit,
devenv, CI). **No machinery moved.** Each shipped directory carries a note
saying what lands in it.

## What this directory holds

| file | what it settles |
|---|---|
| `book-knowledge.md` | where the flywheel's generic knowledge of what a book is lives, what to poach from `system-design-inception`, and two defects to fix rather than copy |
| `context-map-tool.md` | the context map as a distributable tool — packaging, subcommands, config, the viewer, de-hardcoding the topology vocabulary, version pinning |
| `migration-plan.md` | six steps, what breaks in blueprints at each, and an acceptance built on the one already recorded |
| `flags.md` | sixteen places where the records do not match the tree, found by reading it — none reopening a decision |

## The three things worth carrying out of here

**The manifest's inventory is wrong in every dimension that matters.** Seven
skills travel, not two; each carries an `evals/` directory (38 files across
them) that `claude plugin eval` runs; the two named skills are 429L and 366L,
not the recorded 139L and 110L; and `add-flywheel-loops` deployed eight spec
capabilities under `openspec/specs/` that no record mentions. The decision —
machinery travels, record and book stay — is untouched by any of this. The
manifest table is not.

**The re-edit query needs its exclusions stated or it can never pass.**
Run today it names **121 files**, and **76** after dropping
`changes/archive/` and `sessions/`. Of those 76, nineteen are this change's
own `decisions/` records. Rewriting a settled decision's paths would make it
assert something false about its own moment. `migration-plan.md` partitions
the answer set into re-edit, never-re-edit, and judgment.

**The schema carries Willdan's data, so "the data must not move" is not
satisfiable by moving the schema unchanged.** `context-map/schema.json`
enumerates Willdan's four tiers in an `enum`, names willdan-blueprints in its
`$id`, and describes `seamRow` by pointing at a geo-iq chapter. The tool has
to stop carrying repo-specific constants before it can be anyone else's.

## What was verified by running it, not by reading

- `claude plugin validate <path> --strict` ships with Claude Code and its own
  help names CI as the use case. It caught two real defects in the new repo
  within a minute of the manifests existing.
- `claude plugin eval` runs `evals/**` against a plugin, with a no-plugin
  baseline arm — which makes the seven `evals/` directories a live test suite
  the moment they land, not dead weight.
- **Claude Code puts an installed plugin's `bin/` on `PATH`**, and only inside
  a session: eight are on this session's PATH, and a clean login shell
  (`env -i … zsh -lc`) has none. This decides the context-map packaging.
- Installed plugins live at
  `~/.claude/plugins/cache/<marketplace>/<plugin>/<version>/` — the version is
  a path segment, which makes it a usable pin.
- The single-plugin-repo marketplace entry that works on this machine
  (`mdserve`) writes `"source": "./"`, where `flywheel-own-repo.md` records
  `"."`. The new repo uses `"./"` and validates clean.

## Not worked here

The four open questions `2026-08-06-flywheel-own-repo` left for the split bolt
stand: the sibling-path convention across orgs, who drains
`add-flywheel-loops`' remaining tasks, explicit confirmation that machinery
authored in a Willdan client repo is the operator's to move, and which name
Claude Code registers a marketplace under by GitHub shorthand. The last is now
cheap and named as a step in `migration-plan.md` — the repo exists, so it is
one command with nothing at stake.
