# Reporting to the flywheel team

A team in this herdr session records what you and the user build: `conductor` keeps track, `fable` writes requirements and surface rulings in blueprints, and `explorer` updates the OpenSpec change in flywheel-next. You report; they record. Don't edit blueprints or flywheel-next's `openspec/` yourself.

Report now, covering everything built so far that the active change's `tasks.md` doesn't describe, and again whenever you and the user change how the system behaves.

1. Write the report to `~/.local/state/flywheel-team/reports/<YYYYMMDD-HHMM>-<short-slug>.md`. For each behavior, give:
   - what the system does now, in the requirements' vocabulary
   - why: the problem it fixed, or the reason the user gave
   - where it lives: files, and commit SHAs where committed
   - whether it changes a page or surface
   - anything the user decided along the way, in their words
   - whether `definitions/`, `conformance/` or `instructions/` were edited by hand
2. Run `herdr agent prompt conductor "Report: <full path>"` without `--wait`.
3. Carry on with the user. Don't wait for the team, and don't prompt fable or explorer.
