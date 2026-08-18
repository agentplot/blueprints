# Research: does a standalone flywheel repo need a marketplace?

## Question
The target is `github.com/orgs/agentplot/` — one repo, one plugin, a
different org from the Willdan repos that consume it. Does that repo need
its own `marketplace.json`, or can the repo be the plugin?

## Findings

**A marketplace is required, and the repo can be its own.** There is no
direct git-URL install path; every installation resolves through a
marketplace. But a single-plugin repo carries both manifests and points the
marketplace at its own root, so it stays one repo with nothing external:

```
agentplot/flywheel/
  .claude-plugin/
    plugin.json         { "name": "flywheel", ... }
    marketplace.json    { "name": "flywheel",
                          "plugins": [ { "name": "flywheel",
                                         "source": "." } ] }
  skills/
    inception/SKILL.md
    construction/SKILL.md
  agents/
    dispatch.md
    intent-conductor.md
    ...
```

`"source": "."` — the marketplace entry pointing at the repo root where
`plugin.json` lives — is documented as supported from Claude Code
v2.1.196+.

**Install is two steps**, and the two `flywheel`s are independent names:

```
/plugin marketplace add agentplot/flywheel     # owner/repo shorthand
/plugin install flywheel@flywheel              # plugin@marketplace
```

**Skill invocation is `/flywheel:inception`.** The prefix is the plugin
name from `plugin.json`; the marketplace name never appears in an
invocation. This is the rename with reach: the skills stop being
`flywheel-inception` and `flywheel-construction` and become `inception` and
`construction` *inside* the plugin, with the `flywheel:` prefix supplied by
the plugin name. Directory names follow — `skills/inception/`, not
`skills/flywheel-inception/`. Every place that names a skill changes shape,
not just spelling.

**A different org is no constraint.** Public repo works as above. A private
one needs working git credentials — `gh auth setup-git` or an SSH key;
`GITHUB_TOKEN` is reported not to work for `/plugin marketplace add`
(anthropics/claude-code#17201). The rule of thumb: if `git clone` works in
your terminal, it works in Claude Code.

**Development still bypasses all of it.** `claude --plugin-dir
/path/to/flywheel` plus `/reload-plugins`, per
`research-local-plugin-loop.md`. The marketplace matters only for
distribution.

## Confidence
Layout, `"source": "."`, the two-step install, the invocation namespace,
and the private-repo credential behavior are from the official plugin and
marketplace docs. One inference flagged by the research and not confirmed:
which name Claude Code registers the marketplace under when added by GitHub
shorthand — taken to be `marketplace.json`'s `name` field rather than
derived from the repo name. Cheap to verify once the repo exists, and it
only affects the second install argument.

## Feeds
- Decision 2 (what travels) — the repo shape is settled, so the question is
  purely which files, not how they are packaged.
- Decision 3 (when the split lands) — sharpens the sequencing argument. The
  skill rename is not a spelling change but a restructure: directory names,
  the `flywheel-` prefix dropped, and every reference in the profiles, both
  E2E scripts, `conducting.md`, and the schema instructions. Doing it once,
  at the split, is worth more than it looked before this finding.
