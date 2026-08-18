# Session: release-prep — staged release material for the open handoff lines

Handoff-type session, 2026-08-10. This directory stages the release
material for every open release-preparation handoff line in
`tasks.md`. Nothing here was sent: no envelope, no bolt change, no
approval asked. The conductor asks the operator once per release batch,
after folding this in, and composes the requests from these drafts.

## The three staged releases

| file | target | takes |
|---|---|---|
| `release-bolt-plugin-shape.md` | new bolt `bolt-plugin-shape` in **agentplot/flywheel** | 8 task lines: the bolt-shape BATCH, skills shed, dispatch triage, prototype-skill fix, design-center promotion, planned-tasks conductor, on-demand state, fleet plugin resolution |
| `release-bolt-gates-and-config.md` | new bolt `bolt-gates-and-config` in **willdan-blueprints** | 4 task lines: config task sections, validate-is-not-evidence, the opsx apply contradiction, the books-gate-and-map BATCH |
| `release-context-map-tool.md` | **existing** `bolt-flywheel-plugin` | 1 task line: the context-map tool with the book skills — its two registry rows already sit `to-spec` in that bolt |

The two pre-declared BATCH groupings each travel as a single handoff: the
bolt-shape BATCH is one proposal in `bolt-plugin-shape`, the
books-gate-and-map BATCH is one proposal in `bolt-gates-and-config`.

## Corrections measured on disk, not inherited

Every repo and criterion below was re-read from disk this session. Three
findings change the drafts against the task lines' own phrasing:

1. **Six lines carry a stale repo label.** The flywheel-repo split landed
   (`assertions/flywheel-repo-split.md`, built 2026-08-10), so the loop
   skills, the bolt schemas, the dispatch profile, and the prototype skill
   now live in `agentplot/flywheel`
   (`/Users/chuck/Code/github_agentplot/flywheel/main`), not in
   blueprints. The assertions `per-proposal-registry`,
   `spec-agent-worktrees`, `adr-trigger`, `bolt-schema-prose`,
   `skills-shed-agent-guidance`, and `dispatch-bolt-triage` all still say
   `Repo: willdan-blueprints`; the staged releases target the repo the
   files are in. Updating the assertions' `Repo:` fields is the
   conductor's edit, not this session's.
2. **`config-task-sections` is mostly built already.**
   `openspec/config.yaml`'s `rules.tasks` on main now names
   Design/Planning/Research/Prototype/Writeback/Handoff plus Verify —
   landed with bolt-loop-layer (commit `6b6a5923`). The residual drift is
   capitalization only: the schema and the live `tasks.md` headings are
   lowercase. The staged row shrinks to that alignment; the conductor may
   instead judge the assertion built and close the line on the evidence
   above.
3. **The `adr-trigger` residual is smaller than the assertion.** On disk,
   `flywheel-intent`'s Handoff instruction already carries the ADR line
   contents (repo, decision, sources, no proposal) and
   `flywheel-construction` already carries the log4brains direct-edit
   passage. What is missing is the linkage — the conductor writes it
   *because a Handoff line named it*, and *first, before the code*.

## What this session did not do

- No task line is checked. A handoff line closes on the bolt conductor's
  receipt, and no request has been sent.
- No assertion `State:` moved. States move to built when evidence lands
  on main.
- The four `not this intent's` lines and the `deferred` devportal line in
  the handoff section were not staged: they are routed elsewhere by their
  own labels.
