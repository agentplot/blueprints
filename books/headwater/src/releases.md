# Releases and what is new

A release is one version of a dependency that its source publishes,
with its date and a link to it. For each dependency, headwater asks
every bound release source that knows its identity for the releases it
publishes (43), and sets each one against the pin.

## Newer, by the source's own order

A release is newer than a pin only by the dependency's own version
order: how its source orders its versions (6). headwater never orders
two versions by their dates, by their names' spelling, or by the order
a source lists them. A backport published today is older than last
month's major release, and headwater reports the same newer releases
whichever order a source lists them in.

Each ecosystem brings its own order (C.3). Semantic Versioning 2.0.0
orders npm, Cargo and GitHub tags that parse, PEP 440 orders PyPI, and
Go's module rules order Go. A calendar version compares field by field
where a watch list says so. The same two versions always order the same
way (45).

headwater reports a release whose order against the pin cannot be
decided as undecided, beside the newer ones (7). It never counts such a
release as newer and never leaves it out, so the asker sees it and
decides.

## Every newer release, and only those

A report holds every release newer than the pin that the source
publishes, and none that is not newer (8). A fixer moving a dependency
three releases forward reads what upstream wrote of each of the three.

## Inside or outside the declared range

The capture design settles one more mark on each release, and the
statement takes it at plan step H1 (`design/capture/design.md`).
headwater marks each release inside or outside the range its
declaration gives, such as `^1.4` or `>=1.4,<2`, which the dependency
description carries. The package manager takes a release inside the
range by changing only the lockfile. A release outside it changes the
manifest, as a major release does. headwater reports both, so a major
release is never hidden (8).

Each declaration's range marks the release on its own. A release of a
dependency declared in two places can be inside one range and outside
the other, and the brief names both declarations (4, 26).

## The pin alone decides

The pin alone decides what is new (9). headwater reads no record of
what it reported before to decide it, so every scan reports a release
until the pin reaches or passes it, or an acknowledgement leaves it
out (21). A fixer clears a release by moving the pin: the bump lands,
the next reading has the new pin, and the releases it reaches leave the
report with nothing else written (S4).

<figure class="hw">
<div class="hw-scroll">
<svg viewBox="0 0 800 306" role="img" aria-label="Before: on a version axis with 2.0.0, 2.1.4, 2.2.0, 2.2.1 and 2.3.0, the pin is 2.1.4. The three releases newer than the pin are reported, and 2.0.0, older than the pin, never is. After a fixer's bump to 2.3.0 lands, the pin moves to 2.3.0 and no release is reported, with no acknowledgement written.">
<defs>
<marker id="hw-r-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hw-hd"/></marker>
<marker id="hw-r-o" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hw-hd-o"/></marker>
</defs>
<text x="16" y="26" class="hw-th">BEFORE: THE PIN IS 2.1.4</text>
<text x="770" y="62" text-anchor="end" class="hw-s">newer, by the source's own order (6)</text>
<rect x="378" y="72" width="344" height="62" rx="8" class="hw-band-a"/>
<line x1="40" y1="96" x2="768" y2="96" class="hw-axis" marker-end="url(#hw-r-m)"/>
<rect x="222" y="44" width="56" height="20" rx="4" class="hw-bx-o"/><text x="250" y="58" text-anchor="middle" class="hw-lo">pin</text>
<line x1="250" y1="64" x2="250" y2="88" class="hw-ar-o"/>
<circle cx="110" cy="96" r="6" class="hw-dot"/>
<circle cx="250" cy="96" r="7" class="hw-pin"/>
<circle cx="420" cy="96" r="6" class="hw-dot-a"/>
<circle cx="550" cy="96" r="6" class="hw-dot-a"/>
<circle cx="680" cy="96" r="6" class="hw-dot-a"/>
<text x="110" y="124" text-anchor="middle" class="hw-m">2.0.0</text>
<text x="250" y="124" text-anchor="middle" class="hw-m">2.1.4</text>
<text x="420" y="124" text-anchor="middle" class="hw-m">2.2.0</text>
<text x="550" y="124" text-anchor="middle" class="hw-m">2.2.1</text>
<text x="680" y="124" text-anchor="middle" class="hw-m">2.3.0</text>
<text x="110" y="152" text-anchor="middle" class="hw-s">older: never reported</text>
<text x="386" y="152" class="hw-la">reported: every release newer than the pin (8)</text>
<text x="16" y="190" class="hw-th">AFTER A FIXER'S BUMP TO 2.3.0 LANDS</text>
<path d="M258,212 L640,212" class="hw-ar-o" marker-end="url(#hw-r-o)"/>
<text x="400" y="206" class="hw-lo">the pin moves</text>
<line x1="40" y1="242" x2="768" y2="242" class="hw-axis" marker-end="url(#hw-r-m)"/>
<rect x="652" y="200" width="56" height="20" rx="4" class="hw-bx-o"/><text x="680" y="214" text-anchor="middle" class="hw-lo">pin</text>
<line x1="680" y1="220" x2="680" y2="234" class="hw-ar-o"/>
<circle cx="110" cy="242" r="6" class="hw-dot"/>
<circle cx="250" cy="242" r="6" class="hw-dot"/>
<circle cx="420" cy="242" r="6" class="hw-dot"/>
<circle cx="550" cy="242" r="6" class="hw-dot"/>
<circle cx="680" cy="242" r="7" class="hw-pin"/>
<text x="110" y="270" text-anchor="middle" class="hw-m">2.0.0</text>
<text x="250" y="270" text-anchor="middle" class="hw-m">2.1.4</text>
<text x="420" y="270" text-anchor="middle" class="hw-m">2.2.0</text>
<text x="550" y="270" text-anchor="middle" class="hw-m">2.2.1</text>
<text x="680" y="270" text-anchor="middle" class="hw-m">2.3.0</text>
<text x="16" y="296" class="hw-la">reported: none, and no acknowledgement was written (9)</text>
</svg>
</div>
<figcaption>The pin alone decides what is new (9). The source's own order places each release (6), the report holds every release newer than the pin (8), and a landed bump clears them by moving the pin (S4).</figcaption>
</figure>

A tool that remembered what it had shown would need that memory kept,
shared between checkouts and repaired when it went wrong. headwater
keeps none, so two checkouts at one pin always agree.

## One identity for ever

A release's identity is its dependency's identity and its version,
written as the Package URL with its version:
`pkg:github/jdx/mise@2026.10.10` (10, C.1). Every scan, every surface
and every host names the same release the same way, so an asker can key
on it. A recorder that hears of a release every day keeps it once (S6).

## What upstream wrote

A release reaches the asker with what its source published of it: its
version, its date, its link and its notes (11). Notes are what upstream
wrote of a release, as upstream wrote it. headwater never summarises,
rewords, translates, ranks or judges a release, and no model reads notes
inside headwater. The asker judges, from upstream's own words.

A notes source gives them (46). The first is the body of the GitHub
release at the version's tag in the dependency's source repository.
Where no release body exists, the second reads the version's section
of that repository's `CHANGELOG.md` at the tag (C.4).

Every report and every brief gives each release's notes whole, or the
part an asker asked for together with a way to read the whole again
(12). A release whose notes run to forty kibibytes reaches a session as
the part the session asked for, with the way to the rest, and not one
word of what arrives is changed (S7). headwater keeps no part of notes
it cannot give whole.

## Where headwater asks

A source's answer is reported as that source gave it. Where two
sources disagree about one release, the report names both and chooses
neither (39). The first release sources are deps.dev, queried in
batches by Package URL with no key, and GitHub releases, read through
the asker's own sign-in (C.3, section 9). What a source learns of the
repository is in [The core and its seams](seams.md).

The capture design settles where headwater asks first, and the
statement takes it at plan step H1 (`design/capture/design.md`).
headwater asks each ecosystem's own package manager first, read-only in
the repository's own shell, so it sees the registries the repository is
configured for, private ones among them. It asks `npm view` and
`npm outdated`, `go list -m -versions`, `mise ls-remote`, and the
configured registry's index for Python and Cargo. deps.dev, GitHub and
ecosyste.ms answer where no package manager runs or none exists, and
OSV answers for advisories.

Still to rule: questions 9, 12, 13, 22 and 23, and the statement's own
questions on prereleases and withdrawn releases; the range and the
package managers enter the statement at plan step H1. See
[Open questions](open.md#releases-and-what-is-new).
