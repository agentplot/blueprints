# The core and its seams

headwater is one core that knows git and reaches everything else
through five seams. Each seam is a contract of Part B, and each is bound
by naming one or more profiles of Part C (51). Parts A and B do not
change to admit a profile.

## The five seams

**The dependency description** (B.1) reads a repository state. It
answers every dependency the state declares, each with its identity,
every declaration of it and the pin each gives, and every declaration
it could not read, with the reason (40). It answers the tiers, each with
its cadence and the identities it names (41). Both answers are the same
for the same repository state, and reading either changes nothing (42).

**The release source** (B.2) lists every release it publishes for an
identity, each with its version, its date, its link and whether the
source has withdrawn it. Where the source cannot be reached, it says so
(43).
It orders two versions of one identity: one is newer, they are the
same, or their order cannot be decided (44). The order is the source's
own, and the same two versions always order the same way (45).

**The notes source** (B.3) gives what upstream wrote of one release,
whole and unchanged, or says upstream wrote nothing (46).

**The advisory source** (B.4) gives every advisory that names one
version of an identity, each with its identity, its severity as the
advisory gives it, and a link (47).

**The store** (B.5) reads a repository's held state with the version it
was read at (48). It writes the next held state all or nothing, and
only if the held state is still at that version (49). It holds nothing in the
repository's content, and every checkout of one repository reaches the
same store (50).

<figure class="hw">
<div class="hw-scroll">
<svg viewBox="0 0 800 368" role="img" aria-label="The core, which knows git and decides what is new, reaches five seams: the dependency description, the release source, the notes source, the advisory source and the store. Under each are its profiles. The first set is the watch list, npm and Python descriptions; deps.dev and GitHub releases; the GitHub release notes; OSV; and the git directory. Later profiles are Cargo, Go, mise, GitHub Actions and container images; a registry's own API and ecosyste.ms; and the changelog.">
<defs>
<marker id="hw-s-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hw-hd"/></marker>
</defs>
<text x="16" y="34" class="hw-th">PROFILES</text>
<text x="16" y="54" class="hw-ma">first set (section 9)</text>
<text x="16" y="72" class="hw-ms">later</text>
<rect x="230" y="24" width="340" height="62" rx="8" class="hw-bx-a"/>
<text x="246" y="50" class="hw-h">the core</text>
<text x="246" y="72" class="hw-s">knows git; decides what is new (Part A)</text>
<text x="784" y="50" text-anchor="end" class="hw-s">Part B: five contracts</text>
<text x="784" y="68" text-anchor="end" class="hw-s">Part C: their profiles</text>
<line x1="400" y1="86" x2="91" y2="135" class="hw-ar" marker-end="url(#hw-s-m)"/>
<line x1="400" y1="86" x2="246" y2="135" class="hw-ar" marker-end="url(#hw-s-m)"/>
<line x1="400" y1="86" x2="401" y2="135" class="hw-ar" marker-end="url(#hw-s-m)"/>
<line x1="400" y1="86" x2="556" y2="135" class="hw-ar" marker-end="url(#hw-s-m)"/>
<line x1="400" y1="86" x2="711" y2="135" class="hw-ar" marker-end="url(#hw-s-m)"/>
<rect x="16" y="140" width="146" height="212" rx="8" class="hw-bx"/>
<text x="28" y="164" class="hw-t">dependency</text>
<text x="28" y="182" class="hw-t">description</text>
<text x="28" y="202" class="hw-ms">B.1</text>
<text x="28" y="230" class="hw-ma">watch list</text>
<text x="28" y="246" class="hw-ma">npm</text>
<text x="28" y="262" class="hw-ma">Python</text>
<text x="28" y="278" class="hw-ms">Cargo</text>
<text x="28" y="294" class="hw-ms">Go</text>
<text x="28" y="310" class="hw-ms">mise</text>
<text x="28" y="326" class="hw-ms">GitHub Actions</text>
<text x="28" y="342" class="hw-ms">container images</text>
<rect x="172" y="140" width="146" height="212" rx="8" class="hw-bx"/>
<text x="184" y="164" class="hw-t">release source</text>
<text x="184" y="202" class="hw-ms">B.2</text>
<text x="184" y="230" class="hw-ma">deps.dev</text>
<text x="184" y="246" class="hw-ma">GitHub releases</text>
<text x="184" y="262" class="hw-ms">a registry's API</text>
<text x="184" y="278" class="hw-ms">ecosyste.ms</text>
<rect x="328" y="140" width="146" height="212" rx="8" class="hw-bx"/>
<text x="340" y="164" class="hw-t">notes source</text>
<text x="340" y="202" class="hw-ms">B.3</text>
<text x="340" y="230" class="hw-ma">GitHub release</text>
<text x="340" y="246" class="hw-ms">changelog</text>
<rect x="484" y="140" width="146" height="212" rx="8" class="hw-bx"/>
<text x="496" y="164" class="hw-t">advisory source</text>
<text x="496" y="202" class="hw-ms">B.4</text>
<text x="496" y="230" class="hw-ma">OSV</text>
<rect x="640" y="140" width="144" height="212" rx="8" class="hw-bx"/>
<text x="652" y="164" class="hw-t">store</text>
<text x="652" y="202" class="hw-ms">B.5</text>
<text x="652" y="230" class="hw-ma">git directory</text>
</svg>
</div>
<figcaption>The core reaches everything that is not git through five seams, and a profile binds each one (51). Each column lists the first set first. A new profile changes nothing in the core: it implements its seam's contract and passes the one suite (52).</figcaption>
</figure>

## Binding

Any number of dependency descriptions, release sources, notes sources
and advisory sources are bound at once, each answering for the
identities it knows, and exactly one store is written (51). A repository
that holds npm packages, Python requirements and a watch list binds all
three descriptions, and deps.dev and GitHub releases each answer for
the identities they know.

## What a source learns

headwater sends a source nothing of the repository but the identities
and versions it asks about (37): no file, no path, no commit. It reaches
a source with the asker's own credentials or with none (38). GitHub
releases are read through the asker's own `gh` sign-in, fifty
repositories a query (C.3). Where two sources disagree about one
release, the report names both and chooses neither (39).

## One suite

One conformance suite holds every profile to Parts A and B, and a
profile that fails it is not one (52). Each of its scenarios cites the
clauses it exercises, and the suite fails when no scenario cites a
clause (section 12). A new profile implements its seam's contract and
passes the suite, and nothing else in headwater changes.

## One binary

headwater is one static binary, written in Rust as sluice is, and gives
every answer as JSON on request (section 9).

Still to rule: questions 4, 11, 32 and 33, in
[Open questions](open.md#the-core-and-its-seams).
