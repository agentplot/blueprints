# Reporting to the flywheel team

A team in this herdr session records what you and the user build: `conductor` keeps track, `fable` writes requirements and surface rulings in blueprints, and `explorer` updates the OpenSpec change in flywheel-next. You report; they record. Don't edit blueprints or flywheel-next's `openspec/` yourself.

Report now, and again whenever either of these changes. Cover two things the active change's `tasks.md` doesn't describe:

- **Plans you and the user talked through that nobody has built yet**: what to build next, designs you worked out together, changes to the order of work. Put these first; they are usually what matters most. When a plan lives in a proposal file, name the file and say the user talked it through, so fable ratifies it into the requirements. Say plainly what is still open.
- **Behavior built so far.**

1. Write the report to `~/.local/state/flywheel-team/reports/<YYYYMMDD-HHMM>-<short-slug>.md`. For each plan, give what it is, the user's words that settled it, the order to build it in, and what is still undecided. For each built behavior, give:
   - what the system does now, in the requirements' vocabulary
   - why: the problem it fixed, or the reason the user gave
   - where it lives: files, and commit SHAs where committed
   - whether it changes a page or surface
   - anything the user decided along the way, in their words
   - whether `definitions/`, `conformance/` or `instructions/` were edited by hand
2. Run `herdr agent prompt conductor "Report: <full path>"` without `--wait`.
3. Carry on with the user. Don't wait for the team, and don't prompt fable or explorer.
