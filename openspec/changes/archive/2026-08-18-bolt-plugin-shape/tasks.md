# Tasks

## Setup
- [x] cut `bolt/plugin-shape` in agentplot/flywheel from `main` at `bb9f491` → `~/.herdr/worktrees/.bare/bolt-plugin-shape`. No post-start hooks configured
- [x] cut `bolt/plugin-shape` in willdan-blueprints from `main` → `~/.herdr/worktrees/blueprints/bolt-plugin-shape`, explicit path because flywheel took the derived one first. No post-start hooks configured
- [x] repo-readiness audit of agentplot/flywheel. OpenSpec root `openspec/`, default schema `spec-driven` — spec agents' `/opsx:ff` binds correctly with no flag. Gates: three checks under `[pre-commit]`, no `[pre-merge]`; `devenv shell -- gates` runs all of them from the one definition the hook uses. No test suite and no `moon`. Seven skills carry `evals/` and no runner exists in `bin/`, `tools/` or `scripts/` — acceptance here is the gates plus the two exercised probes, not an eval run
- [x] `npm ci` in the flywheel bolt worktree — `check-site` needs jsdom and fails closed without it. It does not resolve from `main/` the way blueprints' does, so every construction worktree cut in this repo needs it before its gates mean anything
- [ ] `npm ci` in each construction worktree at cut time, before any gate output from it is trusted
- [x] routed to `intent-flywheel` and observed carried at `bc8e4812`, not closed on its report: `decisions/the-planned-tasks-conductor.md` settled on its Decision — nothing binds `bolt-no-spec`, the charge is the launch. Verified on disk that both the Consequences bullet and the Why phrase now agree, with the only surviving "binds" inside the correction note quoting the old text
- [x] launch recipe for any session in agentplot/flywheel: `claude --plugin-dir /Users/chuck/Code/github_agentplot/flywheel/main --agent <profile> --model <model>`. The flywheel plugin is not enabled in its own repo, so no `flywheel-*` profile resolves in a worktree there and every launch fails. `--plugin-dir` points at the repo's stable `main/` checkout, never at a bolt or construction worktree — otherwise an agent runs on the very machinery this bolt is rewriting, and its skills change under it mid-session
- [x] the first agent in a freshly cut herdr worktree stops on the workspace-trust dialog and never reaches its prompt; clear it with `herdr agent send-keys <name> enter`. Later agents in the same directory skip it
- [x] this machine's nix `claude` wrapper appends `--dangerously-skip-permissions`, which the `claude plugin` subcommands reject, and its `enabled` field reads false even where profiles resolve — so `claude plugin list` is not an oracle for whether a plugin loaded. Found by `spec-plugin-resolution` while choosing the probe
- [x] `herdr tab create` needs `--workspace <id>` or the tab is created in the main workspace with only its cwd set, so the bolt's panes scatter. It emits JSON by default and rejects `--json`

## Spec

Specs run concurrently; the serializations in `proposals.md` bind builds,
not specs. A spec agent writes a change under the built repo's
`openspec/changes/`, so no two collide, and a spec written against a file a
sibling is about to rewrite is the state-claim defect the rule already
answers: cite by anchor or quoted phrase, never by line number, and carry
the build-time re-read task. Blocking each spec on its predecessor's
merge-back would serialize four rounds of spec-review-build-merge to buy
what those two rules already buy.

- [x] bolt-shape → `bolt-schema-shape`, landed a3469ed, amendment edcfc5a. The main spec's one-round review bound is REMOVED and replaced by the judgement wording the on-disk skill already carries, keeping the churn signal, the binary call and the not-run recording. The amendment was staged while its agent still read `working`, against the rule that artifacts land only once the agent is idle; verified settled afterwards — no writes followed and the four paths matched the report — but the landing was out of order, not merely lucky
- [~] skills-shed → agent `spec-skills-shed` running, slug `conductor-skills-shed`; writes against `skills/construction/SKILL.md` as bolt-shape will leave it
- [x] dispatch-triage → `dispatch-bolt-triage`, landed 9d3c6b1, amendment 8c721a9. The profile defers the state enumeration to the fleet skill rather than restating it, so the one-enumeration rule survives the growth
- [x] prototype-location → `prototype-isolated-repo`, landed d246b7f, amendment 61c13a9 covering the one clause in live sibling change `add-flywheel-loops` whose unsynced delta would otherwise carry the mandate back into a main spec
- [x] design-center → `design-center-skill`, landed 6c6e9d4. The blueprints deletion is a task in its change, performed later on the blueprints bolt worktree. Its build task counts `skills/README.md`'s directory total at build time rather than incrementing a remembered number — `planned-tasks` adds a directory too
- [x] planned-tasks → `planned-tasks-skill`, landed f021080. Named `skills/planned-tasks/`, adding no term to the closed six. Its work order misdirected the vocabulary to the built repo's config; it lives in blueprints' `openspec/config.yaml` and the plugin repo's carries none — the agent found it anyway
- [x] on-demand-state → `on-demand-fleet-state`, landed 9d3c6b1, validate green. Scope confirmed to include `template-fleet.yaml`, which carries the two-state set twice
- [x] plugin-resolution → `fleet-plugin-resolution`, landed. The probe was measured rather than assumed: an unresolvable profile exits 1 in under a second with the error on stderr, before any API call. The fallback is NAMED, never auto-applied; auto-retry is recorded as a non-goal
- [x] gate-machinery → `desk-round-release-gate`, landed abd5941; 4/4 artifacts with the build-time re-read task present, so the dropped-constraints addendum took. Re-dispatched to cover all twelve places the superseded phrasing stands, not the five it first found
- [ ] merge-gate-fires → agentplot/flywheel (spec agent, Fable) (blocked by: `bolt-gates-and-config`'s probe recipe, which arrives once that bolt has run it for real. The spec reproduces the defect on this repo before proposing a hook point; speccing a fix for a defect not observed here is what the row exists to avoid)

## Review
- [ ] bolt-shape (agent, declared): read against `assertions/per-proposal-registry.md`, `assertions/spec-agent-worktrees.md`, `assertions/adr-trigger.md`, `assertions/bolt-schema-prose.md`
- [ ] skills-shed (agent, declared): read against `assertions/skills-shed-agent-guidance.md`, `questions/skill-register.md`, `decisions/the-four-home-test.md`
- [ ] planned-tasks (agent, declared): read against `assertions/planned-tasks-conductor.md`
- [ ] merge-gate-fires (agent, declared): a gate reporting green without running is the failure that hides every other failure, so the read confirms the probe was run on this repo and observed the checks, not that the config looks right
- [ ] gate-machinery (agent, declared): read against `decisions/the-gate-is-inline.md` as it now stands and `decisions/bolt-type-is-the-operators-choice.md`. The record reverses a reading it first carried, so the read confirms the rule is stated once and identically in all three files and that no superseded phrasing survives
- [ ] buildability read across the batch once the first wave is specced — four rows write new files from scratch (`skills/design-center/`, the planned-tasks skill, the directory-registry instruction, the triage test) and have no existing text to anchor against. Also carries two re-warranted rules the authoring agents flagged for independent eyes: `prototype-isolated-repo`'s kept-but-re-warranted "no type named spike" prohibition, and `design-center-skill`'s rewritten Provenance section

## Build

Builds serialize on shared files, per `proposals.md`:
`skills/construction/SKILL.md` takes bolt-shape then skills-shed;
`skills/inception/SKILL.md` takes skills-shed, planned-tasks,
gate-machinery; `bin/flywheel` and `skills/fleet/SKILL.md` take
on-demand-state then plugin-resolution. Each build rebases on the bolt
branch first, so a later builder works the file its predecessor left.

- [ ] bolt-shape on `build/bolt-shape` off `bolt/plugin-shape` (arrangement TBD at approval)
- [ ] skills-shed on `build/skills-shed`
- [ ] dispatch-triage on `build/dispatch-triage`
- [ ] prototype-location on `build/prototype-location`
- [ ] design-center on `build/design-center` in both repos
- [ ] planned-tasks on `build/planned-tasks`
- [ ] on-demand-state on `build/on-demand-state`
- [ ] plugin-resolution on `build/plugin-resolution`
- [ ] gate-machinery on `build/gate-machinery`
- [ ] merge-gate-fires on `build/merge-gate-fires`
- [ ] every spec carries a build-time task enumerating the neighbours it asserts something about — decision records, sibling proposals, this registry, the archive — instructing the builder to re-read each from disk, and ending: do not trust this file; every round of review here has found at least one such claim gone stale between writing and reading, so assume this one has too

## Test
- [ ] acceptance batch 1 on `bolt/plugin-shape` in agentplot/flywheel
- [ ] acceptance batch 2 on `bolt/plugin-shape` in agentplot/flywheel
- [ ] `flywheel status` renders running · on-demand · parked
- [ ] a fleet launch against a deliberately broken plugin source reports the failure and names `--plugin-dir <checkout>`; the output goes in the evidence
- [ ] no reference to `design-center` dangles in either repo after the move
- [ ] the built `skills/planned-tasks/` agrees with the amended `decisions/the-planned-tasks-conductor.md`: the charge is the launch, and nothing is described as binding `bolt-no-spec`. The spec was written from the Decision before the record was amended, so this confirms rather than assumes the agreement

## Merge
- [x] direct edit, no row: `skills/_reference/herdr.md`'s two stale merge claims, landed on the bolt branch at `cf211b6`, gates green. Taken as a direct edit under the loop's-own-machinery exception (a rule contradicting a measured fact). Dispatch routed the squash line; the sentence three lines above it — that the gate runs the checks, so the green is produced by the tool — is the same defect and the load-bearing one, since it is what tells every conductor to trust an exit code, so both were corrected. The replacement names `~/.config/worktrunk/config.toml` as the source of merge behavior rather than restating today's values as a new default to memorize. The reference's unmeasured claim that the message generator "is not logged in" was dropped rather than carried forward
- [ ] every merge-back and landing runs the repo's `.config/wt.toml` checks by hand on the rebased tree and records the output on its task line — `wt merge`'s exit code is not evidence until `bolt-gates-and-config`'s merge-gate-runs row lands. Both this bolt's repos declare checks under `[pre-commit]` with no `[pre-merge]`, which is the shape the failure was measured on
- [ ] land agentplot/flywheel `bolt/plugin-shape` on its main (full gate); record SHA and the by-hand check output
- [ ] land willdan-blueprints `bolt/plugin-shape` on main (full gate); record SHA and the by-hand check output
- [ ] archive the built repos' spec-driven changes
- [ ] report the eight landed handoff lines back to `intent-flywheel`
