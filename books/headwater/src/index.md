# headwater

headwater tells a repository which releases of what it depends on are
newer than what it runs. It reads what the repository declares, asks
where each dependency is published, and reports every newer release with
the words upstream wrote for it. It looks often for the dependencies the
repository's authors care most about, and less often for the rest. It
never changes the repository, never judges what a release means, and
never acts on one: a person or an agent decides, and the change is
theirs (5, 36).

<!-- File names in a figure are code, which Vale cannot see inside SVG. -->
<!-- vale Vale.Terms = NO -->

<figure class="hw">
<div class="hw-scroll">
<svg viewBox="0 0 800 336" role="img" aria-label="headwater reads a repository state's declarations, gives each dependency one identity and one pin, asks the release, notes and advisory sources about those identities, and reports every release newer than each pin with its notes and advisories. An asker hands a release to a fixer, who moves the pin; the repository's own gate lands the change, and the next reading has the new pin.">
<defs>
<marker id="hw-i-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hw-hd"/></marker>
<marker id="hw-i-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hw-hd-a"/></marker>
<marker id="hw-i-o" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hw-hd-o"/></marker>
</defs>
<text x="16" y="30" class="hw-th">REPOSITORY STATE</text>
<text x="210" y="30" class="hw-th">DEPENDENCIES</text>
<text x="426" y="30" class="hw-th">SOURCES</text>
<text x="596" y="30" class="hw-th">REPORT</text>
<rect x="16" y="44" width="164" height="150" rx="8" class="hw-bx"/>
<text x="28" y="66" class="hw-t">declarations</text>
<rect x="28" y="78" width="140" height="20" rx="4" class="hw-chip-p"/><text x="36" y="92" class="hw-m">package.json</text>
<rect x="28" y="102" width="140" height="20" rx="4" class="hw-chip-p"/><text x="36" y="116" class="hw-m">package-lock.json</text>
<rect x="28" y="126" width="140" height="20" rx="4" class="hw-chip-p"/><text x="36" y="140" class="hw-m">pyproject.toml</text>
<rect x="28" y="150" width="140" height="20" rx="4" class="hw-chip-p"/><text x="36" y="164" class="hw-m">uv.lock</text>
<text x="28" y="186" class="hw-s">read, never written (5)</text>
<line x1="180" y1="119" x2="205" y2="119" class="hw-ar" marker-end="url(#hw-i-m)"/>
<rect x="210" y="44" width="196" height="150" rx="8" class="hw-bx"/>
<text x="222" y="70" class="hw-m">pkg:npm/acme-ui</text>
<text x="222" y="88" class="hw-s">pin 2.1.4</text>
<text x="222" y="116" class="hw-m">pkg:pypi/acme-client</text>
<text x="222" y="134" class="hw-s">pin 3.1.0, the older of two (4)</text>
<text x="222" y="176" class="hw-s">one identity each (2)</text>
<line x1="406" y1="119" x2="421" y2="119" class="hw-ar" marker-end="url(#hw-i-m)"/>
<rect x="426" y="44" width="150" height="150" rx="8" class="hw-bx"/>
<rect x="438" y="58" width="126" height="24" rx="5" class="hw-chip"/><text x="448" y="74" class="hw-ma">release source</text>
<rect x="438" y="88" width="126" height="24" rx="5" class="hw-chip"/><text x="448" y="104" class="hw-ma">notes source</text>
<rect x="438" y="118" width="126" height="24" rx="5" class="hw-chip"/><text x="448" y="134" class="hw-ma">advisory source</text>
<text x="438" y="166" class="hw-s">asked identities and</text>
<text x="438" y="182" class="hw-s">versions only (37)</text>
<line x1="576" y1="119" x2="591" y2="119" class="hw-ar-a" marker-end="url(#hw-i-a)"/>
<rect x="596" y="44" width="188" height="150" rx="8" class="hw-bx-a"/>
<text x="608" y="68" class="hw-t">every release newer</text>
<text x="608" y="86" class="hw-t">than each pin (8)</text>
<text x="608" y="110" class="hw-m">acme-ui 2.2.0 2.3.0</text>
<text x="608" y="128" class="hw-m">acme-client 3.2.0 3.3.1</text>
<text x="608" y="154" class="hw-s">upstream's notes, whole (12)</text>
<text x="608" y="174" class="hw-s">advisories apart (19)</text>
<line x1="690" y1="194" x2="690" y2="231" class="hw-ar" marker-end="url(#hw-i-m)"/>
<rect x="596" y="236" width="188" height="80" rx="8" class="hw-bx"/>
<text x="608" y="260" class="hw-t">askers</text>
<text x="608" y="280" class="hw-s">a person, an agent, a pane,</text>
<text x="608" y="296" class="hw-s">a recorder: one answer (32)</text>
<line x1="596" y1="276" x2="495" y2="276" class="hw-ar" marker-end="url(#hw-i-m)"/>
<text x="506" y="268" class="hw-la">a brief (25)</text>
<rect x="250" y="236" width="240" height="80" rx="8" class="hw-bx"/>
<text x="262" y="260" class="hw-t">a fixer</text>
<text x="262" y="280" class="hw-s">moves a pin, and the repository's</text>
<text x="262" y="296" class="hw-s">own gate decides whether it lands</text>
<path d="M250,276 L98,276 L98,199" class="hw-ar-o" marker-end="url(#hw-i-o)"/>
<text x="108" y="230" class="hw-lo">the next reading</text>
<text x="108" y="246" class="hw-lo">has the new pin (9)</text>
</svg>
</div>
<figcaption>headwater reads and reports; a fixer changes. Nothing headwater does writes the repository (5). Once a landed change moves a pin, the next scan stops reporting every release the new pin reaches (9).</figcaption>
</figure>

<!-- vale Vale.Terms = YES -->

## Why it exists

A repository runs versions of things published elsewhere, and upstream
keeps publishing. Dependency updaters make the change as well: they
open a branch per bump and wait for a review. Where agents work in
worktrees, a change already has its own path: a worktree, the
repository's gate, a landing through sluice. What the
agents lack is the knowledge to start from: which releases exist that
the repository does not run, what upstream said of each, and which
advisories name a version it runs.

headwater supplies that knowledge and stops there. swancloud, the first
fleet to run it, watches the tools it pins with a release adapter of its
own, which finds releases and reads their notes. headwater does that
work for any repository, for every dependency a profile can read
(Part C).

## What it promises

- **The pin alone decides what is new** (9). headwater keeps no record
  of what it reported, so a release stays in every report until the pin
  reaches it or an acknowledgement leaves it out (21). A fixer clears a
  release by landing the bump.
- **Upstream's words arrive as upstream wrote them** (11). headwater
  gives each release's notes whole, or the part asked for with a way to
  read the rest (12), and no model reads them inside headwater.
- **A release has one name for ever**: its dependency's identity and
  its version (10). A recorder that keys on it keeps each release once.
- **Asking what headwater holds costs no source anything** (17). The
  answer comes from what headwater keeps, and writes nothing.
- **Only acknowledgements cannot be rebuilt** (29). The next scan
  rebuilds everything else headwater keeps.
- **Every asker gets the same answer** (32). A person at the command
  line, an agent at a session's start and a pane in herdr's sidebar ask
  one core and read one form (33, 35).

## Where it stops

headwater moves no pin, builds nothing, tests nothing and lands
nothing. A fixer does that, and the repository's own gate decides
whether it lands. headwater reports what the repository's authors
chose, never what those dependencies depend on in turn; a vulnerability
scanner reads the whole graph. It never summarises notes or judges a
release. It tells nobody on its own: a surface tells, when its asker
asks. Licences and bills of materials are outside it (section 8).

## Where it sits

headwater stands alone, with plugins for Claude Code and herdr. Its
Flywheel plugin holds an adapter part that prints each release as a
capture for [millpond](../millpond/), the inbox, which lands each
release once and lets curation turn it into work. Whatever bump comes
of it lands through [sluice](../sluice/). headwater never knows which
inbox records its releases (`design/capture/design.md`).

A release that needs judgment, such as a major version or notes that
announce breaking changes, can go from headwater's herdr plugin to a
[sounding](../sounding/). A sounding is one question, worked by one
session in one place, ending on a conclusion the operator decides.

## How to read this book

The chapters follow a release from the declaration that names its
dependency, through the scan that finds it and the brief a fixer reads,
to the capture that records it. The glossary defines each term once. The open questions page lists
what the operator has yet to rule, grouped by the chapter each ruling
would change.

The appendix is the statement of invariants, included from
`design/headwater/requirements.md`. Part A is what must hold of
headwater, Part B its contracts across five seams, and Part C the
profiles that satisfy them. A number in parentheses cites a clause of
it.
