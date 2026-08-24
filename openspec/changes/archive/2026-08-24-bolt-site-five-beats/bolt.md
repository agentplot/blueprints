# Bolt: site-five-beats

## Scope

This bolt rebuilds the flywheel Pages site (`site/`, the `flywheel`
binding) to the five-beat teaching order intent/site-teaches-the-system
settled: a split-hero home page for the stranger who has installed
nothing (`site/index.html`), an `overview.html` carrying the operator
reference the home page sheds, and three scrollytelling concept-tour
pages (`site/tour-*.html`) — export backoff, onboarding email order,
dashboard dark theme — each one idea walked end to end. Three units,
five changes (`index.html`, `overview.html`, the three tour pages), one
repo; `scripts/check-site.mjs` stays green at every merge. This bolt
takes the plan-mode path, available on `bolt-quick` and no other type:
no spec stage runs — each unit binds straight to a plan-mode build, and
the unit card the operator approves, with its cited sources, is the
plan.

## Sources

- intent/site-teaches-the-system — the milestone description states this
  bolt rebuilds the site to the teaching order this intent settled, and
  this bolt's plan is that milestone. The intent's closed decision
  `openspec/changes/site-teaches-the-system/decisions/page-teaching-order.md`
  sets the five beats and demotes operator content off the home page;
  verified present at that path in this repo today, still in its
  pre-amendment wording (beat 4 there reads "the gate," not yet carrying
  the "Your approval" closure `coupling-word.md` makes). The intent's
  assertions — `assertions/home-page-five-beats.md`,
  `assertions/overview-page.md`, `assertions/concept-tour-pages.md` —
  name each unit's content and cite session
  `sessions/2026-08-18-beats-and-tour/`.
- `openspec/changes/site-teaches-the-system/decisions/coupling-word.md`
  — the milestone's cited source for this bolt's wording rule. Verified
  NOT present anywhere in this repo's history (`git log --all -- '**/
  coupling-word.md'` finds nothing here); it exists only in the built
  repo `flywheel`, on commit `faedc0ac`, on branch
  `sess/planning-site-teaches-the-system` — not on that repo's `main`
  either. Construction sessions on this bolt read it from that tree at
  build time, not from this note.

## Repos

- flywheel · bolt branch `bolt/site-five-beats`

## Merge criteria

`scripts/check-site.mjs` stays green at every merge to the bolt branch —
the milestone's own condition, and one of the `flywheel` repo's three
automatic `[pre-merge]` hooks (`validate-manifests.sh`, `check-paths.mjs`,
`check-site.mjs`), verified at `.config/wt.toml` lines 45-48 on that
repo's `main`. The other two hooks apply unconditionally to any change in
that repo; this bolt's charter names `check-site.mjs` specifically
because every change here touches `site/`. `bolt-quick` schedules no
review step (`loop.extensions: []` in `schemas/bolt-quick/schema.yaml`),
so this bolt sets no further review requirement beyond that automatic
check; the merge gate itself (`wt merge`, the repo's hooks) is always
implied and never weakened.

Every unit built under this bolt follows the wording rule its cited
decision closes: the coupling is named "approval" throughout, never
"gate," never "release," outside a quoted literal of machinery output
(`decisions/coupling-word.md`, cited in Sources).

Landing: merge
