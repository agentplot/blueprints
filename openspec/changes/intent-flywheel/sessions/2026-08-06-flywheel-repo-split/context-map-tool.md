# The context map becomes a tool, and its data stays

## What is actually there

Read on disk today, because the framing this started from ("the viewer, a
schema, a checker, and two map files") under-counts it in two places.

| piece | lines | what in it is Willdan's |
|---|---|---|
| `context-map/schema.json` | 170 | `tier` is an `enum` of Willdan's four tiers; `$id` is `https://willdan-blueprints/…`; `seamRow`'s description names `books/geo-iq/src/substrate-boundaries.md`; `^books/` is baked into three patterns |
| `context-map/bin/map-check.mjs` | 429 | `ROOT` is two directories up from the script; `MAP_KEYS` is fixed at `["current","target"]`; `SLOTS`, `STORE_SLOTS` and `FAMS` hardcode Willdan's topology vocabulary |
| `system-context-map.html` | 1576 | `TIER_ORDER` / `TIER_LABEL`; the page title; three sibling `<script src>` tags; `CFG_GEOM`, a per-slot pixel geometry; a default entrypoint of `workbench-app` |
| `maps/current.js` + `maps/target.js` | 1577 | data — stays |
| `maps/configurations.js` | 436 | data — stays |
| `context-map/book-grab.js` | — | a **symlink** to `books/book-grab.js` |

Two corrections to the premise, both consequential:

- **There are three maps, not two.** `configurations.js` is real, the checker
  validates it in a 90-line arm, and the viewer has a whole tab for it.
- **The schema is not neutral.** "The data must not move" cannot be satisfied
  by moving `schema.json` unchanged — Willdan's tier names are *in* it.

## The principle

**The tool carries zero repo-specific constants. Every vocabulary is declared
data, validated against a schema.**

Everything below follows from that. Where something is hardcoded today it gets
de-hardcoded, not fenced off into a repo-local corner — a constant fenced off
is a constant that comes back, and it comes back in two copies.

## 1. It ships inside the plugin, as `bin/context-map`

```
agentplot/flywheel/
  bin/context-map                 entry point — 3 lines, imports the CLI
  tools/context-map/
    bin/cli.mjs                   argument parsing, subcommand dispatch
    lib/{load,schema,check,build}.mjs
    schema.json                   the generic core
    viewer/index.html             one file, with an injection point
    references/context-map-authoring.md
```

**Claude Code puts an installed plugin's `bin/` directory on `PATH`.** Verified
this session: eight plugin bin directories are on this session's `PATH`, under
`~/.claude/plugins/cache/<marketplace>/<plugin>/<version>/bin`. So a consuming
repo's gate is just `context-map check`. No npm, no registry, no wrapper, no
`${CLAUDE_PLUGIN_ROOT}` gymnastics.

Zero dependencies, so a bare `node` runs it — the property `map-check.mjs`
already has and states as deliberate.

### The one gap, named

The `PATH` injection is **session-scoped**. Also verified: a clean login shell
(`env -i HOME=… zsh -lc 'echo $PATH'`) carries none of them. So
`context-map check` resolves for anything launched from inside a Claude Code
session — every flywheel actor, and the `wt merge` an agent runs — but not a
hand-run `wt hook pre-commit` in a bare terminal.

A ~12-line shim committed in the consuming repo closes it:

```sh
#!/bin/sh
# context-map/bin/context-map — resolve the tool wherever we are running.
if command -v context-map >/dev/null 2>&1; then exec context-map "$@"; fi
V=$(sed -n 's/.*"version" *: *"\([^"]*\)".*/\1/p' "$(dirname "$0")/../config.json")
T="$HOME/.claude/plugins/cache/flywheel/flywheel/$V/bin/context-map"
[ -x "$T" ] || { echo "context-map $V not installed — /plugin install flywheel@flywheel" >&2; exit 2; }
exec "$T" "$@"
```

`.config/wt.toml` calls the shim, so both worlds work and neither silently
runs a different version.

## 2. Version pinning falls out of the install path

`~/.claude/plugins/cache/<marketplace>/<plugin>/<version>/` puts the version in
the path, so the consuming repo pins by naming it:

```jsonc
// context-map/config.json
"tool": { "plugin": "flywheel@flywheel", "version": "0.3.0" }
```

A wrong pin fails on a missing directory — loudly, with the version in the
message. That is better than a lockfile, where a resolution mistake is silent.
`check` also prints its own version in its summary line, so a stale pin is
visible in any gate log without anyone going looking.

**Rejected: an npm package.** `@agentplot/context-map`, or
`npm i -D github:agentplot/flywheel#v0.3.0`. It buys a second distribution
channel, a second version to keep in step with the plugin's, and a release
cadence — to solve a CI problem that does not exist. Blueprints' map gate runs
in `.config/wt.toml` `[pre-commit]` and in no workflow; there is no CI caller
to serve. Keeping the tool zero-dependency keeps npm available later as a
`package.json` `bin` entry if a caller outside Claude Code ever appears.

**Rejected: vendoring a copy per repo.** That is the problem being solved.

## 3. One binary, subcommands

```
context-map check [--write] [--quiet]     what map-check.mjs does today
context-map serve [--port N] [--open]     build in memory, serve, live-reload on map edits
context-map build --out <dir>             emit one standalone HTML
context-map init                          scaffold context-map/ into a repo
```

The checker and the viewer share the map loader, the schema, and the
ref-resolution logic. Two binaries duplicate all three and give two things to
version.

**Rejected: keeping `map-check` separate** on the grounds that gates only need
the checker. The cost of another subcommand is one switch arm; the cost of a
second artifact is a second release.

## 4. The viewer stays one file, and becomes more self-contained

`build` emits **one HTML with the maps inlined**. No sibling `<script src>`,
no symlink, and no "open the page from the repo root" constraint — which the
current viewer documents as its own failure mode, in its own error string:

> `context-map/maps/…js did not load — open the page from the repo root so the
> relative <script src> resolves.`

The viewer source stays one file in the tool with an injection point; `serve`
does the same substitution in memory and re-injects on change.

What is lost: edit-and-refresh on a `file://` page. `serve` with live-reload
is strictly better than the refresh it replaces, and the built artifact becomes
a single publishable, mailable file — which is also exactly what a Pages job
wants to upload.

## 5. Config, and the Willdan data coming out of the schema

```jsonc
// context-map/config.json — in the consuming repo
{
  "title": "Willdan platform — living system context map",
  "tool":  { "plugin": "flywheel@flywheel", "version": "0.3.0" },
  "refRoot": "books",
  "slug": "mdbook",
  "maps": {
    "current": "maps/current.js",
    "target":  "maps/target.js",
    "configurations": "maps/configurations.js"
  },
  "tiers": [
    { "id": "cortex",     "label": "Cortex" },
    { "id": "frameworks", "label": "Frameworks" },
    { "id": "platforms",  "label": "Platforms" },
    { "id": "aidlc",      "label": "AIDLC" }
  ],
  "viewerScripts": ["../books/book-grab.js"],
  "annotations": ["seamRow"]
}
```

- **`tiers`** leaves the schema's `enum` and becomes a declared vocabulary the
  checker validates against, and the viewer's `TIER_ORDER` / `TIER_LABEL` read
  from. Single most important extraction: the shipped schema today literally
  enumerates one client's tiers.
- **`refRoot`** replaces the three `^books/` patterns. **This is the whole
  answer to how ref-resolution travels into a consuming repo's `books/`:** the
  checker never needs to know what a book is. It needs a repo root, a required
  prefix, and a heading slugger. Refs stay repo-relative strings; the checker
  resolves `<repoRoot>/<ref>` and enforces the prefix from config. A repo that
  keeps its design docs somewhere other than `books/` sets `refRoot` and
  everything else is unchanged.
- **`slug`** names the anchor algorithm. `map-check.mjs`'s own comment spells
  out mdBook's slugger and points out it does *not* collapse consecutive
  spaces — which is not GitHub's behaviour. `"mdbook"` is the default,
  `"github"` the alternative. Today this is an undocumented assumption.
- **`annotations`** declares which repo-specific keys may appear in an
  element's `x: {}` bag. `seamRow` leaves the core schema entirely; blueprints'
  data survives a mechanical rename (`seamRow: 12` → `x: { seamRow: 12 }`) and
  the viewer renders declared `x` keys as tags, which is what it already does
  for `seamRow` specifically.

The schema itself leaves blueprints. It is the contract, not the data, and
`context-map/schema.json` stops existing there. What blueprints keeps is
`config.json`, its three map files, and a short repo-local README.

## 6. The `configurations` topology gets de-hardcoded, and then it travels

Its slot ids, its fams and its per-slot pixel geometry are constants in **two**
places today — `map-check.mjs` (`SLOTS`, `STORE_SLOTS`, `FAMS`) and the viewer
(`CFG_GEOM`) — which is already one copy too many, and they can drift from
each other silently.

They become declared data at the top of `configurations.js`, beside the data
that uses them:

```js
slots: [
  { id:"APP",    label:"App",       kind:"component",  box:{x:255, y:25,  w:200, h:58} },
  { id:"GW",     label:"Gateway",   kind:"component",  box:{…} },
  { id:"KITAPI", label:"Kit API",   kind:"api-column", box:{x:515, y:185, w:215, h:58} },
  { id:"WH",     label:"Warehouse", kind:"store",      box:{…} },
  …
],
fams: [ {id:"stack", label:"Stack"}, {id:"kit", label:"Kit"}, … ],
```

Everything hardcoded then derives from the declaration:

- `STORE_SLOTS` becomes `slots.filter(s => s.kind === "store")`, so the
  `needsFam` rule follows from a slot's kind instead of a second parallel list
  that can fall out of step with the first;
- `CFG_GEOM` reads `slots[].box`;
- the magic `CFG_GEOM.KITAPI` fallback becomes the explicit
  `kind: "api-column"`;
- the two reserved edge endpoints — `"E"` for the entrypoint and `"APIS"` for
  the api column — get declared as reserved rather than left as string
  literals in an `if`.

The declaration is validated by its own schema section, so a typo in a slot id
fails the gate instead of drawing a blank box.

With that done the configurations **capability** is generic and travels with
the tool, and blueprints' `configurations.js` becomes pure data like the other
two maps.

**Rejected: leaving configurations behind as a repo-local extension module**,
with the tool growing a plugin hook for it. It keeps the constants alive
somewhere, adds a plugin mechanism to a tool that otherwise needs none, and
means the next repo that wants an entrypoints × configurations view writes the
whole thing again.

Pixel geometry as data is still a drawing expressed as numbers, and that is
honest here for a specific reason: the current layout is a fixed grid of
absolute boxes that the viewer never computes. Nothing is being generalised
away — the numbers are simply moving from code to the file they describe.

## 7. `book-grab.js` is an integration point, never a dependency

`config.viewerScripts[]` is inlined into the built page. Blueprints keeps
owning `books/book-grab.js`; the tool never carries books tooling and never
requires it. Absent the key, the grab UI is simply not there and everything
else works. That also removes the symlink, which is a file the manifest keeps
in blueprints and which the viewer today depends on without any record naming
the edge.

## 8. Where the map's authoring rules go

`context-map/README.md` is 190 lines and mixes two documents: how the model
works (the four-layer schema, the relation table, the editing procedure, the
headless verification command) and what Willdan's two maps contain (geo-iq
seam rows, `cortex-kit/src/surface-configurations.md`, the tier names).

It splits. The tool ships its own README plus
`references/context-map-authoring.md`, which `flywheel:writeback` points at
exactly the way it points at the book conventions. Blueprints keeps a short
repo-local README covering its own three maps and its own tier vocabulary.

## What this costs blueprints

One migration step, and it is the riskiest in the plan — step 3 in
`migration-plan.md`. Concretely: add `config.json` and the shim, add `slots`
and `fams` to `configurations.js`, rename `seamRow` into `x`, delete
`schema.json` and `bin/`, rewire the `map` line in `.config/wt.toml`, replace
the root `system-context-map.html` with a built artifact, and update
`deploy-books.yml`, which currently copies `context-map/` into `_site/`.

The map gate is down for the length of that step and nothing else in the repo
is affected. It should be its own proposal with the gate as its acceptance.
