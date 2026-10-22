# Consumers

A consumer reads an artifact in its ecosystem's own form, as that
ecosystem's clients read it, and never needs tailrace's vocabulary (46).
npm reads a registry, Maven a repository, pip an index, Go a module
proxy, Cargo a registry, NuGet a feed. tailrace renders each from the
store: a consumer layout (glossary).

## The policy is applied at the render

A consumer layout holds only versions whose claims satisfy the policy
the layout was rendered under (47). A version the policy refuses is
absent from the layout, and the refusal is answered to whoever asked for
the layout, naming the version and the claim found wanting (99). The client
sees only what it may install; the person who ran the sync sees why
something is missing. The layout is never a source of truth (48):
rendering it again from the same store under the same policy gives the
same layout, and deleting it costs nothing but the next render.

## Sync, and serve where a client needs it

Most ecosystems read a local registry from disk: Maven and Gradle a
`file://` repository, Go a proxy directory, Cargo a local registry per
lockfile, NuGet a folder feed, Python a `file://` index or `find-links`
(C.11). For those, `sync` is the whole consumer side: it reads what the
repository's lockfiles pin, fills each layout with exactly those
versions (50), and the client's own configuration points at the layout.
npm reads no files, so `serve` is a localhost server over the same
layout, speaking the registry protocol, and a request for a version the
layout lacks runs the same render on demand.

The address a client records is the same on every host (49): a fixed
name for the served registry, a fixed path for a layout. A lockfile
written on one machine names no host and no store of one owner, so the
same lockfile installs on every machine and in every account.

A layout that cannot be refreshed answers what it holds and says when it
was last rendered (51). It never answers an absent version as refused,
or a refused one as absent (58).

<figure class="tr">
<svg viewBox="0 0 800 250" role="img" aria-label="The store on the left. sync renders, under a policy, one consumer layout per ecosystem on the host: a maven2 repository, a Go proxy directory, a PEP 503 index, a cargo local registry, and an npm registry layout which serve answers over HTTP. The lockfile pins what is fetched; a refused version is reported to the person, not the client.">
<rect x="16" y="60" width="150" height="130" rx="8" class="tr-bx-a"/>
<text x="91" y="90" text-anchor="middle" class="tr-t">the store</text>
<text x="91" y="112" text-anchor="middle" class="tr-s">artifacts + claims</text>
<line x1="166" y1="125" x2="246" y2="125" class="tr-ar"/>
<text x="206" y="112" text-anchor="middle" class="tr-s">sync</text>
<text x="206" y="146" text-anchor="middle" class="tr-s">under a policy (47)</text>
<rect x="250" y="16" width="300" height="218" rx="8" class="tr-bx"/>
<text x="262" y="40" class="tr-th">LAYOUTS ON THE HOST (48)</text>
<text x="262" y="68" class="tr-m">maven/   maven2 + checksums</text>
<text x="262" y="92" class="tr-m">go/      module proxy layout</text>
<text x="262" y="116" class="tr-m">pypi/    simple index</text>
<text x="262" y="140" class="tr-m">cargo/   local registry</text>
<text x="262" y="164" class="tr-m">nuget/   folder feed</text>
<text x="262" y="188" class="tr-m">npm/     registry read layout</text>
<text x="262" y="216" class="tr-s">one blob store; every file a link (1)</text>
<line x1="550" y1="188" x2="610" y2="188" class="tr-ar"/>
<rect x="614" y="160" width="170" height="56" rx="8" class="tr-bx"/>
<text x="626" y="184" class="tr-t">serve</text>
<text x="626" y="204" class="tr-s">npm reads no files (86)</text>
<rect x="614" y="16" width="170" height="120" rx="8" class="tr-bx"/>
<text x="626" y="40" class="tr-t">clients</text>
<text x="626" y="62" class="tr-s">mvn, go, pip, cargo, nuget</text>
<text x="626" y="82" class="tr-s">read files (46)</text>
<text x="626" y="104" class="tr-s">lockfiles name no host (49)</text>
<line x1="550" y1="100" x2="610" y2="80" class="tr-ar"/>
</svg>
</figure>

## What a consumer never gets

A consumer layout holds what the repository publishes and nothing from
a public registry (section 8). Third-party packages come from where
they always came from, pinned by the lockfile; tailrace is not a proxy
for npmjs or PyPI. Python is the one ecosystem whose client, given two
indexes, picks the highest version across both, so there the layout is
either the only index or a per-package one, and never an extra index
beside PyPI.
