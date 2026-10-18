# The watch list

Some dependencies have no file in the repository that names their
version in a form a program reads: a tool a fleet builds from a pinned
release, whose pin only an evaluation computes. The watch list declares
them.

## What it is

The watch list is a dependency description (C.2): a file naming each
dependency's upstream repository, its tag pattern, its pin and its
tier. headwater reads it as it reads any other declaration, and the pin
is what the file gives. Each entry also carries a name and the files a
bump moves (`design/capture/design.md`).

| an entry holds | for example |
|---|---|
| its name | `mise` |
| its upstream repository | `jdx/mise` |
| its tag pattern | the shape of the tool's release tags |
| its pin | `2026.9.18` |
| its tier | the tier it belongs to |
| the files a bump moves | `packages/mise/default.nix` |

A watch-list entry's identity is the Package URL of its upstream
repository, `pkg:github/jdx/mise` (C.1). GitHub releases lists its
releases, and orders them by Semantic Versioning where the tags parse
and by the watch list's tag pattern otherwise. Where the list says the
version is a calendar version, they compare field by field (C.3).

When a watch list names fourteen tools by their upstream repositories
and tag patterns, headwater reports each release under the same
identity a declaration of that tool would give it (S11). A tool named both in a
watch list and in another declaration is one dependency (2), and each
of its releases is one release.

## The key it gives

A watch-list entry's release keys as `release/<name>/<version>`, under
the name the list gives it, when the Flywheel plugin turns it into a
capture ([Releases as captures](captures.md)).

## The first fleet

swancloud, the first fleet that runs headwater, generates its watch
list from `lib/release-sources.nix`, the list of tools it pins (C.2). The
fleet hands headwater the pins that only Nix evaluates. It commits the
generated file, and a flake check refuses the file when it drifts from
the evaluation, as swancloud already checks its generated task list
(`design/capture/design.md`).

<figure class="hw">
<div class="hw-scroll">
<svg viewBox="0 0 800 200" role="img" aria-label="swancloud's list of the tools it pins, lib/release-sources.nix, is evaluated by Nix, which computes each pin. The watch list is generated from that evaluation and committed, and headwater reads it as a dependency description. A flake check refuses the committed watch list when it drifts from the evaluation.">
<defs>
<marker id="hw-w-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hw-hd"/></marker>
<marker id="hw-w-o" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hw-hd-o"/></marker>
</defs>
<text x="16" y="26" class="hw-th">THE FLEET</text>
<text x="636" y="26" class="hw-th">HEADWATER</text>
<rect x="16" y="40" width="190" height="66" rx="8" class="hw-bx"/>
<text x="28" y="64" class="hw-ms">lib/release-sources.nix</text>
<text x="28" y="88" class="hw-s">the tools the fleet pins</text>
<line x1="206" y1="73" x2="225" y2="73" class="hw-ar" marker-end="url(#hw-w-m)"/>
<rect x="230" y="40" width="172" height="66" rx="8" class="hw-bx"/>
<text x="242" y="64" class="hw-t">Nix evaluates</text>
<text x="242" y="88" class="hw-s">the pins only it can read</text>
<line x1="402" y1="73" x2="421" y2="73" class="hw-ar" marker-end="url(#hw-w-m)"/>
<rect x="426" y="40" width="184" height="66" rx="8" class="hw-bx-a"/>
<text x="438" y="64" class="hw-t">the watch list</text>
<text x="438" y="88" class="hw-s">generated and committed</text>
<line x1="610" y1="73" x2="631" y2="73" class="hw-ar" marker-end="url(#hw-w-m)"/>
<rect x="636" y="40" width="148" height="66" rx="8" class="hw-bx"/>
<text x="648" y="64" class="hw-t">reads it</text>
<text x="648" y="88" class="hw-s">as a declaration (C.2)</text>
<rect x="300" y="138" width="310" height="46" rx="8" class="hw-bx-o"/>
<text x="312" y="158" class="hw-t">a flake check</text>
<text x="312" y="176" class="hw-s">refuses the file when it drifts from Nix</text>
<line x1="518" y1="138" x2="518" y2="111" class="hw-ar-o" marker-end="url(#hw-w-o)"/>
<line x1="316" y1="106" x2="316" y2="134" class="hw-ar-o"/>
</svg>
</div>
<figcaption>The watch list carries what only Nix computes into a file headwater reads. The fleet generates and commits it, and a check that compares it with the evaluation keeps the committed file and the fleet's pins the same.</figcaption>
</figure>

Once headwater reports swancloud's releases, the fleet's own release
adapter retires. Its captures' keys carry on unchanged, because a
watch-list entry keys as that adapter always has.

Still to rule: question 10, with 7, 8 and 14 from other chapters; the
files a bump moves and the key enter the statement in plan step H1. See
[Open questions](open.md#the-watch-list).
