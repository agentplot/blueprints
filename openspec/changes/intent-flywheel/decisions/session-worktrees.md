# Decision: a session gets its own worktree, cut by worktrunk

## Decision
Every design session runs in its own worktree on its own branch, cut by
worktrunk:

```bash
wt switch --create sess/<slug> --base main --no-cd
herdr tab create --cwd <worktree>     # then herdr agent start in that pane
```

Once the resolver fix lands, a session worktree needs no provisioning at
all. The mermaid gate is the only thing that ever wanted `node_modules`,
and it never needed a local copy — `createRequire` pointed at the main
checkout's `package.json` resolves jsdom from any directory, related to
cwd or not. What the gate needed was a correct answer to *which* worktree
holds one, and the fixed resolver supplies it by testing each worktree
rather than trusting the order `git worktree list` prints. So there is no
cold-start hook in `.config/wt.toml`: a jsdom tree per worktree would be
bolted onto a 0.45 s operation to buy what one resolver gets for free.

**Until that lands, the mechanism to check is `loadJsdom()` in
`books/check-mermaid.mjs`.** While it still reads the first `worktree`
line of `git worktree list --porcelain` — `.bare` in this layout, which
holds no `node_modules` — a fresh worktree fails the mermaid gate at exit
2, and the `PostToolUse` hook on `books/*/src/*.md` turns that into
*refused edits*, so a book writeback session cannot work at all. A session
spawned before the fix symlinks `node_modules` from the main checkout, one
command, and drops the habit afterwards. Read the function rather than
this paragraph to know which regime you are in.

The session commits to `sess/<slug>`. The conductor stays on main and folds
as it does today, with one step added ahead of promotion:
`wt merge --no-remove -C <worktree>`, then the worktree and its branch are
removed. The full gate on the merge is the right gate for a documentation
session — books, mermaid, and map are exactly what it should have to pass.

There is no `--no-hooks`. This repo configures **no** lifecycle hooks at
all — `.config/wt.toml` carries only the `wt list` URL column and the
`pre-commit` gate, and its own header says why: worktrees here are made by
`wt`, by herdr, and by hand, so startup was moved to the one event all
three share. Passing `--no-hooks` would suppress nothing today and would
silently skip whatever hook is added first. It is left off deliberately.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/conducting.md`
- Produced by: the operator's word, in two parts. First the condition —
  worktree-per-session is acceptable if the worktrees are lightweight,
  because flywheel sessions only edit documentation, so they must bypass
  the lifecycle hooks or run lightweight ones; whatever wins must not make
  spawning a session expensive. Then the correction, when the conductor
  proposed a bare `git worktree add`: "should still use herdr or worktrunk
  for consistency."
- The failure that opened it: the book-writeback session's five chapter
  deletions landed in the repo-split session's commit, because two sessions
  sharing a working tree share a git index and a pathspec-less `git commit`
  takes whatever a sibling has staged
  (`sessions/2026-08-06-book-writeback/report.md` finding 4).

## Measured, in this repo, 2026-08-06
- `wt switch --create … --no-cd`: **0.45 s**.
- `map-check.mjs` (clean) and `preview.py --check` (8 books) run green from
  a new worktree. `check-mermaid.mjs` does **not** — see the next two
  bullets, which supersede the first reading of this one.
- The tree was never the problem; the resolver was. `check-mermaid.mjs`
  exits **2** from a fresh worktree, which is a loud failure and never a
  false green, and root `CLAUDE.md`'s "other worktrees resolve it from
  there" is what the fixed resolver makes true rather than what it
  contradicts. Re-measured here from an unrelated cwd:
  `createRequire('<main>/package.json')('jsdom')` loads.
- **One of the three gates is blocked, not two.** Measured by
  `bolt-blueprints-tooling` in a herdr-cut worktree with no `node_modules`
  present: `check-mermaid.mjs` exits 2, `map-check.mjs` exits 0 (clean),
  `preview.py --check` exits 0 (8 books). `map-check.mjs` imports only
  `node:fs`, `node:url`, and `node:path` — it never needed `node_modules`
  and never will.

  This record first said two, on a report it did not measure. The root
  cause is unchanged and was found by `bolt-dispatch-rename`:
  `check-mermaid.mjs`'s `mainWorktree()` takes the first `worktree` line of
  `git worktree list --porcelain`, which in this bare layout is `.bare`
  rather than `main/` where `npm ci` ran, so `loadJsdom()` finds nothing.
  The resolver is still the fix and a provisioning hook is still only the
  convenience — a hook alone papers over `wt`-cut worktrees and leaves
  every herdr-cut one broken. Only the blast radius was overstated.

**What the measurement does not prove.** "No preview server started" was
observed in a *shell* in the new worktree, not in a Claude session. The
books preview and the openspecui backend are started by the **SessionStart**
hook in `.claude/settings.json`, which fires for any Claude session in any
worktree and is not a `wt` hook at all — so no worktree flag suppresses it,
and the probe never triggered it. A real session in a session worktree will
bring up both. Whether that is a cost worth removing is genuinely open: a
writeback session rewriting chapters plausibly *wants* the preview, and a
review session working plannotator does not. Left as a question rather than
asserted either way, because the original requirement — spawning a session
must not be expensive — was aimed at provisioning, and provisioning is
0.45 s.

## Why not staging discipline alone
Commit-by-explicit-pathspec was the zero-infrastructure alternative and it
closes the instance rather than the failure class. The index collision was
one symptom of a shared checkout; `map-check --write` mutates files a
sibling may be reading, and `preview.py --check` builds every book
including one a sibling is mid-write on. Neither is a staging mistake, so
no staging rule reaches them.

It survives as a standing rule anyway, because the conductor still commits
on main where a session's fold may be in flight: an actor stages and
commits the paths it wrote — never `-a`, never `add -A`, never a
pathspec-less `git commit`.

## Consequences
- `flywheel-inception`'s conductor section carries the spawn recipe, and
  its session section carries that a session owns a worktree and a branch,
  not just a directory. Both design-session profiles say the same.
- The fold gains one step: merge the session branch through the gate before
  promoting. `decisions/design-catalog.md` is unaffected — files still stay
  where they were written.
- Teardown joins the conductor's duties per `conduct`: a session is not
  done until its worktree and branch are gone.
- Amends `decisions/sole-writer-conductors.md` in scope rather than in
  substance: one writer per file was the guarantee, and it did not reach a
  shared index or a shared tree. It now does, because sessions no longer
  share either.
- Nothing is tasked in `.config/wt.toml`, and root `CLAUDE.md`'s claim
  that other worktrees resolve `node_modules` from the main checkout
  stands as written — the resolver fix riding `bolt-blueprints-tooling`'s
  books-gate proposal makes the sentence true instead of editing it.
  The residual case the hook would have covered is a repo where no
  worktree has ever run `npm ci`, which the gate's own error message
  already names.
- **SessionStart does not start the books preview in a session worktree.**
  Settled on the operator's word: a writeback session does not need hot
  reload, and the watcher is not free. It runs `mdbook build` on every
  save, and deleting a chapter is two edits — remove the file, remove its
  `SUMMARY.md` entry — so a rebuild landing between them has mdbook write
  the chapter back as a stub. That is how
  `sessions/2026-08-06-kit-books-proposals-retire/` produced a resurrected
  `books/atlas-kit/src/proposals.md` that no gate then caught.

  The watcher exists to serve a human browsing the books. An agent
  rewriting a chapter is not browsing, so in a session worktree it buys
  nothing and manufactures a defect class. Chapter work is verified by
  `python3 books/preview.py --check` — the same one-shot build CI runs —
  not by watching a page.

  Tasked as a handoff: the hook starts the preview where someone is
  actually looking and stays out of session and construction worktrees.
  `openspecui` is a separate question and is not closed here — a conductor
  genuinely reads that board, and it does not rebuild the books.
- Requested into the running bolt rather than filed as a new one, since
  `bolt-flywheel-machinery` owns the skill and profile files and had not yet
  specced them.
