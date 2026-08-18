# Tasks

## Spec
- [x] enumerate the moved tree before moving — the migrate script's
      lists, measured on main at bf9d146a; the reviewer's diff -r found
      no "Only in" on either side
- [ ] spec the context-map tool row (`opsx ff` in agentplot/flywheel)
      from `assertions/context-map-tool.md` and the release staging
      note; re-read the three maps and `schema.json`'s Willdan residue
      from disk at spec time
- [ ] spec the book-skills row from the same assertion and
      `assertions/marketplace-poach-defects.md`; the two defects named
      and their fixes specified, never copied

## Parked (operator park order 2026-08-10, run wf_583753f4-85a stopped)
- [ ] three unfolded branches off `bolt/flywheel-plugin` in
      agentplot/flywheel, worktrees kept, sessions stopped before
      reporting so every tree is unvalidated and ungated:
      `build/spec-context-map-tool` (spec draft 98eecd0),
      `build/spec-book-skills` (spec draft 9ae2a81),
      `build/eval-suites` (conversion a45994a; whether the nine new
      suites exist is unmeasured). Nothing merged past bb9f491. On
      resume: verify each tree, land what holds, then the pending
      proposal-review; the two rows' build wait on
      `bolt-gates-and-config`'s `gates-books-and-map` row stands

## Review
- [x] independent read of the plugin core and fleet layer (declared:
      agent). Verdict: NOT CLEAR, thirteen defects — completeness,
      profile-name asymmetry, frontmatter, and fixtures all clean; the
      damage in the schema copy, the fleet command, and overclaiming
      docs. Twelve fixed at bb9f491: the intent schema's session
      instruction speaks the plugin namespace; the naming rule teaches
      `flywheel:<type>`; the fleet skill gives the on-PATH invocation;
      the parser stops absorbing top-level keys and stripping quotes
      inconsistently; both tab-orphan paths clean up; the site and
      .gitkeep describe nine profiles; bin/tools docs match placement;
      the github_ session-name strip is documented; install-schemas
      moves an existing copy aside instead of deleting it. The
      thirteenth is recorded, not fixed: the 34 travelled eval cases are
      in a legacy evals.json format `claude plugin eval` does not read —
      conversion is open work below, and every doc claim now says so
- [x] independent read of blueprints-consumes (declared: agent).
      Verdict: NOT CLEAR, three defects, deletion itself clean. All
      fixed: the plugin pushed before the deletion merges; enablement
      moved into the tracked settings.json via devenv.nix (worktree
      delivery — the reviewer's hazard analysis was exact); the config
      context names the bolt family
- [ ] independent proposal-review of the two context-map-release specs
      once specced (declared: agent), against the assertion, the
      staging note, and the cited decisions

## Build
- [x] agentplot/flywheel: skills/ populated — prefix dropped, evals and
      `_reference/` along, internal names rewritten, stale READMEs
      replaced
- [x] agentplot/flywheel: agents/ populated — nine profiles, prefixes
      kept; two frontmatter colons the strict validator caught fixed on
      the way in
- [x] agentplot/flywheel: schemas/ populated — flywheel-intent (its
      session instruction rewritten to the plugin namespace),
      bolt-{default,quick,deep}
- [x] agentplot/flywheel: bin/flywheel + skills/fleet/ + template
      manifest, per fleet-per-org
- [x] agentplot/flywheel: openspec tree receives add-flywheel-loops and
      the eight capabilities, verbatim
- [x] agentplot/flywheel: plugin.json/marketplace.json at 0.1.0; repo
      gates green
- [x] willdan-blueprints: moved machinery removed; plugin enabled in the
      tracked settings; four user schemas installed; namespace sweep;
      repo fleet/ retired; org fleet.yaml live at the org root — a fresh
      session probe sees flywheel:fleet
- [x] the packaging checklist: installs from the pushed GitHub
      marketplace (declared in tracked settings); `claude --agent
      flywheel-dispatch` launched the plugin profile headless and
      answered in its new voice; schemas resolve from the user source
      (`openspec instructions` returns the real loop for bolt-default
      changes with no project copy); check-paths clean; blueprints
      grep-clean
- [ ] convert the seven travelled eval suites to the `case.yaml` /
      `prompt.md` format `claude plugin eval` reads, and write suites
      for the nine skills without any (seven construction types,
      handoff, fleet)

## Test
- [x] both repos' gates green: plugin validate --strict ×2, check-paths,
      check-site (plus parser regression checks); blueprints books /
      mermaid / map
- [x] a fleet smoke run against the org-root manifest: walk-up discovery
      found /Users/chuck/Code/clients/github_willdan/fleet.yaml from
      inside blueprints and refused to run outside the named session,
      naming `herdr --session willdan` — the full in-session run is the
      operator's, after attaching that session once

## Merge
- [x] agentplot/flywheel merged and pushed: b5d308b (the machinery) +
      bb9f491 (the review's twelve fixes)
- [x] willdan-blueprints merged: 61d16424
