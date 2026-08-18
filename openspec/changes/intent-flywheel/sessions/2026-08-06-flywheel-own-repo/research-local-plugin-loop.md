# Research: the local development loop for a plugin in its own repo

## Question
If flywheel moves into its own repo and ships as a plugin, can it still be
installed locally such that source edits take effect without a publish or
reinstall cycle? Today every skill, profile, and schema is edited in place
under `.claude/` and takes effect immediately. That is the baseline the
split has to match or knowingly give up.

## Findings

**The dev loop exists and is the documented one.** `claude --plugin-dir
/path/to/flywheel-repo` loads a plugin directly from a directory with no
marketplace and no installation. `/reload-plugins` picks up edits in a
running session — it reloads skills, agents, hooks, MCP servers, and LSP
servers. So the answer to the question that decides the split is yes: the
loop is edit → `/reload-plugins`, not edit → publish → reinstall.

**Marketplace install copies rather than symlinks.** `/plugin marketplace
add <path>` accepts a local filesystem path (absolute or relative, either
the directory or the `marketplace.json` itself), but it copies the
marketplace into `~/.claude/plugins/marketplaces/`. Relative paths inside
`marketplace.json` are reported not to resolve in the copy, installing a
plugin with zero skills (anthropics/claude-code#54967). Pre-creating a
symlink at `~/.claude/plugins/marketplaces/<name>` before adding is the
circulating workaround; symlink-by-default is requested and not shipped.
This matters for testing the *shipping* path, not for the dev loop —
`--plugin-dir` sidesteps it entirely.

**Plugin skills are namespaced, and this is the real cost.** A plugin skill
loads as `/<plugin>:<skill>`; a `.claude/skills/` entry loads as
`/<skill>`. They occupy different namespaces, so a local copy cannot shadow
a plugin skill during development, and every invocation name changes when
flywheel ships as a plugin. `flywheel-inception` and `flywheel-construction`
become plugin-namespaced, and every place that names them — the agent
profiles, the two E2E scripts, `conducting.md`, the schema instructions —
follows. That is a rename with the same blast radius as the dispatch
rename, and it is a consequence of shipping as a plugin at all rather than
of moving repos.

**`${CLAUDE_PLUGIN_ROOT}` resolves in both modes** — to the `--plugin-dir`
directory during development, to `~/.claude/plugins/cache/<plugin>/` after
install. The gotcha is hard-coded absolute paths in hooks and skills, which
work for the author and break for everyone else; every path reference has
to become `${CLAUDE_PLUGIN_ROOT}`-relative before shipping.

## Confidence
The `--plugin-dir` / `/reload-plugins` loop and `${CLAUDE_PLUGIN_ROOT}`
resolution come from the official plugin docs. The marketplace copy defect
comes from a GitHub issue and community posts, not documentation — treat it
as likely-but-unverified, and verify by hand before the shipping path is
designed around it. Namespacing was reported as a hard rule; worth one
direct check, since if a `.claude/` entry *can* shadow a plugin skill the
migration story gets easier.

## Feeds
- Decision 1 (does flywheel move into its own repo) — the loop cost is not
  a blocker; the answer is yes with `--plugin-dir`.
- Decision 3 (when the split lands) — the namespace rename is the sequencing
  argument. Doing it before the two end-to-end runs means the runs exercise
  the shipped names; doing it after means the scripts get renamed twice.
