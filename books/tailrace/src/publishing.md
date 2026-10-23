# A landing becomes a version

## Only a landing is published

A publish begins with one question: has the branch landed this
revision? A revision the branch has not landed is refused naming the
branch, and nothing is offered (14). sluice's log answers for a branch
sluice runs; the branch's history answers for any other (C.5, C.6). A
session's head, a candidate under test and a worktree's uncommitted
tree are never published.

## The build left it; tailrace reads it

A publish offers only bytes a build left (15). It asks the build for the
outputs the repository's authors declared, through the build's own seam:
with moon, one run of the declared tasks, which replays what is cached
and runs what is not (C.3), and where the landing carries verdicts, an
output whose build identity no verdict names is refused (15). The build answers, for each output, the build
identity it came from, the build's outcome and where the files are
(75). The asking is one call for every declared output, and an answer
that leaves one unmade refuses the version whole (74). An output passes
only when the build reports a pass and, where the landing carries
verdicts, a verdict with a pass names its identity; either alone is not
a pass (111). Nothing of a version is offered while an output is unread
or its build did not pass; such a version is refused whole, naming the
output (16).

The build identity is the join. sluice's verdict for the landing names
the task hash each check passed on; the provenance tailrace attaches
names the task hash the outputs came from (13). Where the publishing
tasks are among the gate's required tasks, the two hashes are the same
number by construction, and a verdict joins "these checks passed" to
"these bytes were built" with no second reading.

## The version

The version is the history's, never the publisher's (21). The authors'
rule reads the landed revision and the tags before it and derives one
version; the same revision under the same rule always derives the same
one. The rule the family builds on is git-cliff over conventional
commits: a feature or a fix since the last tag makes a release,
anything else a prerelease (section 9).

The rule runs per unit (123). The authors declare each unit by its
outputs, the paths whose changes version it and the prefix its tags
carry, and a repository that declares none is one unit over the whole
tree. A landing that touches one unit's paths alone gives that unit a
version and the others none (124): an SDK package, a service image and
an infrastructure template in one repository each keep their own tag
series, and a publish names the unit it is for, or every unit a commit
since its last tag touched. A unit's channels name only its versions
(125).

A version's name is its unit's, claimed before anything is packed under
it (22): the publish records it against the revision in the
repository's shared history, as a tag pushed first, and a name already
recorded against another revision refuses the publish naming both. One
publish gives every artifact of the unit that one version (110). Two publishers
racing on one landing both end at the same index (18); a repeat whose
projection packs different bytes is refused naming the artifact, and
the name stays with the first index; two landings racing on one version
leave one of them to derive the next.

The build never knows the version (24). Outputs are version-free and
expensive, cached and verified under the gate; packaging is cheap and
takes the version as its argument, writing it into the bytes only where
the ecosystem's form requires it. npm's tarball carries it; a Go module
does not; a jar carries it in its name. So a build is the same build
whatever version it later becomes, and a release never has to rebuild.

pack is the ecosystem's own packager, run against the outputs the
build left, with the version handed over the way that packager already
takes it (C.11): `npm pkg set version` before `npm pack`, Maven's
`revision` property, `dotnet pack --no-build`, a Cargo manifest edit
before `cargo package --no-verify`. tailrace never opens an archive to
edit it. A compiled binary prints the revision and the build identity,
and `tailrace status` says which version that revision became.

<figure class="tr">
<svg viewBox="0 0 800 260" role="img" aria-label="sluice lands revision C; the version is derived from history and tagged; the publish reads the build's cached outputs, packs each with the version, offers the artifacts, then the index, and attaches provenance and sluice's verdicts. The build never knew the version.">
<rect x="16" y="40" width="150" height="70" rx="8" class="tr-bx"/>
<text x="28" y="66" class="tr-t">sluice lands C</text>
<text x="28" y="88" class="tr-s">verdicts signed (78)</text>
<line x1="166" y1="75" x2="206" y2="75" class="tr-ar"/>
<rect x="210" y="40" width="150" height="70" rx="8" class="tr-bx"/>
<text x="222" y="66" class="tr-t">version(C)</text>
<text x="222" y="88" class="tr-s">from history, tagged first (21, 22)</text>
<line x1="360" y1="75" x2="400" y2="75" class="tr-ar"/>
<rect x="404" y="40" width="170" height="70" rx="8" class="tr-bx"/>
<text x="416" y="66" class="tr-t">read outputs</text>
<text x="416" y="88" class="tr-s">replayed by hash; never built here (15)</text>
<line x1="574" y1="75" x2="614" y2="75" class="tr-ar"/>
<rect x="618" y="40" width="166" height="70" rx="8" class="tr-bx"/>
<text x="630" y="66" class="tr-t">pack with version</text>
<text x="630" y="88" class="tr-s">only where the form needs it (24)</text>
<line x1="700" y1="110" x2="700" y2="150" class="tr-ar"/>
<rect x="404" y="154" width="380" height="80" rx="8" class="tr-bx-a"/>
<text x="416" y="180" class="tr-t">offer artifacts, then the index (17)</text>
<text x="416" y="202" class="tr-s">attach provenance and the carried verdicts (12, 13)</text>
<text x="416" y="222" class="tr-s">answer: index digest, version, every digest (19)</text>
<text x="28" y="200" class="tr-s">nothing here moves a channel (20)</text>
</svg>
</figure>

## The index is the publish

Artifacts are offered first, by digest, and nothing is visible as a
version until its index is in the store (17). A publish that fails
halfway leaves digests in the store, which is harmless, and no index and
no version. A publish ends with an answer a program reads: the index's
digest, the version, each artifact's digest and ecosystem name, and
where each claim is attached (19). That answer is what another system
consumes where tailrace publishes and something else promotes.

A publish offers and does nothing more (20). Whoever runs it, a person
in a worktree, a watcher that follows sluice's log, or a plan's step,
has moved no channel and reached no environment.
