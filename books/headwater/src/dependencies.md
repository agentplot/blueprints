# What a repository depends on

headwater starts from a repository state: the content of a repository at
one commit, together with any uncommitted change the asker names as part
of it. Every bound dependency description reads that state and reports
what it declares (40). headwater reads only the dependencies the state
declares, and invents none (1).

## Declarations and identities

A declaration is one place in a repository state that names a
dependency, with what it says of the version. A dependency entry in
`package.json`, a requirement in `pyproject.toml`, a `FROM` line in a
`Dockerfile` and a `uses:` line in a workflow are each a declaration
(C.2).

Every dependency has exactly one identity, whichever declaration names
it and whichever source publishes it (2). The identity is a Package URL
without its version: `pkg:npm/react`, `pkg:pypi/fastapi`,
`pkg:github/jdx/mise` (C.1). Two declarations of one identity are one
dependency, wherever in the repository they sit.

headwater reports a declaration it cannot read as unread, naming the
declaration and the reason, and never drops it from a report (1). A
dependency left out would read as one with nothing newer. An unread
entry says what is true: headwater does not know.

## The pin

A dependency's pin is the version the repository runs. Each description
reads it where its ecosystem records it: the version a lockfile
resolves for npm, Cargo and Python, an exact `==` requirement for
Python, the version `go.mod` names for Go (C.2). A pin is exactly one
version or unknown (3). A range with no lockfile behind it, a `latest`
tag, a branch or a version prefix names no single version, so its pin is
unknown.

headwater reports a dependency whose pin is unknown as unknown, never as
having nothing newer (3). An asker who reads that nothing is newer can
rely on it.

A dependency declared at more than one pin in one repository state is
reported with every declaration and its pin. A release is newer for it
when it is newer than the oldest of them (4). The report measures from
the declaration that lags, and a fixer sees which one that is.

<!-- File names in a figure are code, which Vale cannot see inside SVG. -->
<!-- vale Vale.Terms = NO -->

<figure class="hw">
<div class="hw-scroll">
<svg viewBox="0 0 800 276" role="img" aria-label="Two declarations name acme-client: pyproject.toml, which uv.lock resolves to 3.2.0, and tools/pyproject.toml, which pins 3.1.0 with ==. Both are the identity pkg:pypi/acme-client, so they are one dependency, and its releases are measured from 3.1.0, the older pin. A third declaration, web/package.json, names acme-fmt with a range and no lockfile, so its pin is unknown.">
<defs>
<marker id="hw-d-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hw-hd"/></marker>
</defs>
<text x="16" y="26" class="hw-th">DECLARATIONS</text>
<text x="360" y="26" class="hw-th">DEPENDENCIES</text>
<text x="610" y="26" class="hw-th">WHAT IS MEASURED</text>
<rect x="16" y="40" width="290" height="58" rx="8" class="hw-bx"/>
<text x="28" y="62" class="hw-m">pyproject.toml</text>
<text x="28" y="84" class="hw-s">acme-client&gt;=3.0, resolved by uv.lock</text>
<rect x="236" y="50" width="60" height="20" rx="4" class="hw-chip"/><text x="266" y="64" text-anchor="middle" class="hw-ma">3.2.0</text>
<rect x="16" y="110" width="290" height="58" rx="8" class="hw-bx"/>
<text x="28" y="132" class="hw-m">tools/pyproject.toml</text>
<text x="28" y="154" class="hw-s">acme_client==3.1.0, no lockfile</text>
<rect x="236" y="120" width="60" height="20" rx="4" class="hw-chip"/><text x="266" y="134" text-anchor="middle" class="hw-ma">3.1.0</text>
<rect x="16" y="200" width="290" height="58" rx="8" class="hw-bx"/>
<text x="28" y="222" class="hw-m">web/package.json</text>
<text x="28" y="244" class="hw-s">&quot;acme-fmt&quot;: &quot;~1.0.0&quot;, no lockfile</text>
<rect x="236" y="210" width="60" height="20" rx="4" class="hw-chip-p"/><text x="266" y="224" text-anchor="middle" class="hw-ms">unknown</text>
<line x1="306" y1="69" x2="355" y2="94" class="hw-ar" marker-end="url(#hw-d-m)"/>
<line x1="306" y1="139" x2="355" y2="114" class="hw-ar" marker-end="url(#hw-d-m)"/>
<line x1="306" y1="229" x2="355" y2="229" class="hw-ar" marker-end="url(#hw-d-m)"/>
<rect x="360" y="76" width="220" height="56" rx="8" class="hw-bx"/>
<text x="372" y="98" class="hw-m">pkg:pypi/acme-client</text>
<text x="372" y="118" class="hw-s">two declarations, one identity (2)</text>
<rect x="360" y="201" width="220" height="56" rx="8" class="hw-bx"/>
<text x="372" y="223" class="hw-m">pkg:npm/acme-fmt</text>
<text x="372" y="243" class="hw-s">one declaration</text>
<line x1="580" y1="104" x2="605" y2="104" class="hw-ar" marker-end="url(#hw-d-m)"/>
<line x1="580" y1="229" x2="605" y2="229" class="hw-ar" marker-end="url(#hw-d-m)"/>
<rect x="610" y="76" width="174" height="56" rx="8" class="hw-bx-a"/>
<text x="622" y="98" class="hw-t">newer than 3.1.0</text>
<text x="622" y="118" class="hw-s">the older of the two (4)</text>
<rect x="610" y="201" width="174" height="56" rx="8" class="hw-bx-o"/>
<text x="622" y="223" class="hw-t">pin unknown</text>
<text x="622" y="243" class="hw-s">never "nothing newer" (3)</text>
</svg>
</div>
<figcaption>Declarations join by identity. <code>acme_client</code> and <code>acme-client</code> are one Package URL, so the two declarations are one dependency, measured from its older pin (2, 4). A range with no lockfile names no single version, and the report says the pin is unknown (3).</figcaption>
</figure>

<!-- vale Vale.Terms = YES -->

## Reading changes nothing

headwater never writes a repository's content, its history or its
configuration (5). A dependency description gives two answers, the
dependencies and the tiers, and both are the same for the same
repository state. Reading either changes nothing (42). Agents in many
checkouts of one repository ask at once (section 9), and a read that
changed anything would change what the others read.

## The descriptions

Each ecosystem's declarations have a profile of their own (C.2): npm,
Python, Cargo, Go, mise, GitHub Actions, container images and the watch
list. The
first set is the watch list, npm and Python (section 9). Each profile
says which files it reads and where it finds the pin, and each reports
the pin as unknown where its files name no single version. The watch
list declares what no other file can, and has a chapter of its own.

Still to rule: questions 5, 7, 8, 17, 29 and 30, in
[Open questions](open.md#what-a-repository-depends-on).
