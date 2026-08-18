# Assertion: willdan-marketplace gets a merge gate

- **Repo:** willdan-marketplace
- **State:** open — needs its own intent
- **Raised by:** bolt-flywheel-machinery, out of its marketplace spec round

## The claim
That repo has a `.config/wt.toml` and CI that runs its `tests/` and its
marketplace audit.

## Why
It has neither today, which is how a stale `openspec-batch-orchestrator`
entry survived in `devenv.nix` pointing at a directory that no longer exists.

## Boundaries
Wiring it changes how every future proposal in that repo is verified, so it
is its own intent and is recorded here only so the finding is not lost. A
stray untracked `levi.md` sits at that repo's root — a 39-line personal work
list, unrelated.
