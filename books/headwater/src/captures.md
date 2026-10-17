# Releases as captures

Some repositories keep what they hear as work to curate. headwater feeds
them through its Flywheel plugin, whose one part is an adapter that
turns each release into a capture (section 9). millpond keeps captures
in an inbox, and [millpond's book](../millpond/) defines
[the capture contract](../millpond/contract.html),
[the inbox](../millpond/inbox.html) and
[curation](../millpond/curation.html). What follows is what headwater
puts into each capture.

## A recorder like any other

The adapter is a recorder: a program that keeps what it hears as its own
records. It asks headwater as any asker does, decides how it records
each release, and never writes headwater's state (section 2). headwater
never knows which inbox records its releases (`design/capture/design.md`)
and needs no recorder to answer (34).

## One capture per release

`headwater capture` prints one capture line for each release headwater
reports (`design/capture/design.md`):

- `source` is `release`, and `event_at` is when the release was
  published, never when headwater found it;
- `raw` holds the notes whole, and what the source answered;
- the excerpt is the notes, asserted by the upstream, of kind `ask`. It
  asserts "`<name>` `<version>` is released; the repository pins
  `<pin>`", and argues with the declarations a bump moves.

A release is its own excerpt: upstream's notes are the quote, so no
reader session reads it into signals.

## The key

A capture's [key](../millpond/contract.html#the-key) is a source
event's identity, the same from every host and every run. headwater keys a release in
one of two ways:

- an entry of a watch list keys as `release/<name>/<version>`, under the
  name the list gives it, the key swancloud's release adapter has used
  since its first landing;
- every other release keys by its identity,
  `release/<type>/<namespace>/<name>/<version>`, from its Package URL.

Because the pin alone decides what is new (9), the adapter prints a
release at every run until the pin moves, and
[millpond's dedupe](../millpond/landing.html#a-capture-landed-twice)
lands it once (S6).

<figure class="hw">
<div class="hw-scroll">
<svg viewBox="0 0 800 256" role="img" aria-label="Over four days, headwater reports mise 2026.10.10 against the pin 2026.9.18 on days 1, 2 and 3, and the adapter prints the same key, release/mise/2026.10.10, each day. millpond lands the capture on day 1 and passes over the key on days 2 and 3. A fixer's bump lands before day 4, the pin is 2026.10.10, nothing is newer, and the adapter prints no line.">
<defs>
<marker id="hw-c-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hw-hd"/></marker>
</defs>
<text x="193" y="24" text-anchor="middle" class="hw-ms">day 1</text>
<text x="363" y="24" text-anchor="middle" class="hw-ms">day 2</text>
<text x="533" y="24" text-anchor="middle" class="hw-ms">day 3</text>
<text x="703" y="24" text-anchor="middle" class="hw-ms">day 4</text>
<text x="16" y="68" class="hw-th">HEADWATER</text>
<text x="16" y="133" class="hw-th">CAPTURE</text>
<text x="16" y="200" class="hw-th">MILLPOND</text>
<rect x="110" y="38" width="166" height="50" rx="8" class="hw-bx"/>
<text x="122" y="58" class="hw-s">pin 2026.9.18</text>
<text x="122" y="78" class="hw-m">reports 2026.10.10</text>
<rect x="280" y="38" width="166" height="50" rx="8" class="hw-bx"/>
<text x="292" y="58" class="hw-s">pin 2026.9.18</text>
<text x="292" y="78" class="hw-m">reports 2026.10.10</text>
<rect x="450" y="38" width="166" height="50" rx="8" class="hw-bx"/>
<text x="462" y="58" class="hw-s">pin 2026.9.18</text>
<text x="462" y="78" class="hw-m">reports 2026.10.10</text>
<rect x="620" y="38" width="166" height="50" rx="8" class="hw-bx"/>
<text x="632" y="58" class="hw-s">pin 2026.10.10</text>
<text x="632" y="78" class="hw-s">nothing newer</text>
<line x1="193" y1="88" x2="193" y2="110" class="hw-ar" marker-end="url(#hw-c-m)"/>
<line x1="363" y1="88" x2="363" y2="110" class="hw-ar" marker-end="url(#hw-c-m)"/>
<line x1="533" y1="88" x2="533" y2="110" class="hw-ar" marker-end="url(#hw-c-m)"/>
<rect x="110" y="114" width="166" height="28" rx="5" class="hw-chip"/><text x="193" y="132" text-anchor="middle" class="hw-ma" style="font-size:10.5px">release/mise/2026.10.10</text>
<rect x="280" y="114" width="166" height="28" rx="5" class="hw-chip"/><text x="363" y="132" text-anchor="middle" class="hw-ma" style="font-size:10.5px">release/mise/2026.10.10</text>
<rect x="450" y="114" width="166" height="28" rx="5" class="hw-chip"/><text x="533" y="132" text-anchor="middle" class="hw-ma" style="font-size:10.5px">release/mise/2026.10.10</text>
<text x="703" y="132" text-anchor="middle" class="hw-s">no line</text>
<line x1="193" y1="142" x2="193" y2="165" class="hw-ar" marker-end="url(#hw-c-m)"/>
<line x1="363" y1="142" x2="363" y2="165" class="hw-ar" marker-end="url(#hw-c-m)"/>
<line x1="533" y1="142" x2="533" y2="165" class="hw-ar" marker-end="url(#hw-c-m)"/>
<rect x="110" y="170" width="166" height="50" rx="8" class="hw-bx-a"/>
<text x="122" y="191" class="hw-t">lands the capture</text>
<text x="122" y="209" class="hw-s">once, by its key</text>
<rect x="280" y="170" width="166" height="50" rx="8" class="hw-bx"/>
<text x="292" y="191" class="hw-s">key already held:</text>
<text x="292" y="209" class="hw-s">passed over</text>
<rect x="450" y="170" width="166" height="50" rx="8" class="hw-bx"/>
<text x="462" y="191" class="hw-s">key already held:</text>
<text x="462" y="209" class="hw-s">passed over</text>
<rect x="620" y="170" width="166" height="50" rx="8" class="hw-bx-d"/>
<text x="632" y="200" class="hw-s">nothing to land</text>
<line x1="618" y1="34" x2="618" y2="228" class="hw-ar-o"/>
<text x="618" y="248" text-anchor="middle" class="hw-lo">a fixer's bump lands</text>
</svg>
</div>
<figcaption>headwater keeps no list of what it reported, so it reports the release at every scan until the pin moves (9). The adapter prints the same key each time, and millpond lands the capture once (S6). The bump that moves the pin is the only thing that stops the line.</figcaption>
</figure>

## In a repository crew runs

In a repository crew runs, a bump comes only as a chore crew's planner
makes from an item. There the herdr plugin's fix key hands the release
to millpond as a capture, and no agent starts outside crew's plan
(`design/capture/design.md`). The release then reaches a landed bump by
the path every capture takes. Curation routes its signal into an item,
and the planner proposes the chore. A team bumps the
dependency with headwater's brief in hand, and sluice lands the
change. The next scan no longer reports the release, because the pin
moved, and nobody wrote an acknowledgement
([millpond's account](../millpond/items.html#a-release-from-capture-to-landed-bump)).

## Where the adapter lives

The adapter is headwater's because it wraps headwater's domain, and it
lives in `plugins/flywheel` beside headwater's core. millpond runs it
like any other adapter part, on the schedule its inbox's settings give
it (`design/capture/design.md`).

Not yet in the statement: the key, the files a bump of a watch-list
entry moves, and the capture lines, which plan step H1 writes in. See
[Open questions](open.md#releases-as-captures).
