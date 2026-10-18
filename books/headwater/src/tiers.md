# Tiers and scans

A repository's authors watch a few of its dependencies closely and the
rest less often. headwater looks often for the first and less often for
the rest, and the authors say which is which.

## Tiers

A tier is a named set of a repository's dependencies, with a cadence.
Every dependency of a repository state belongs to exactly one tier
(13), and the default tier holds every dependency no other tier names.
headwater reads the tiers and their cadences from the repository state
(14), through each dependency description's answer of the tiers, each
with its cadence and the identities it names (41). headwater never moves
a dependency between tiers and never changes a cadence. The authors
decide both, in the repository, where a change to them lands like any
other change.

The first profile reads the tiers from `.config/headwater.toml`: each
tier's name, its cadence and the identities it names. A repository with
no such file has the default tier alone, with a cadence of seven days
(C.2).

## Cadence and due

A tier's cadence is the longest time it may go without a complete scan
while scans are asked for. headwater runs no schedule of its own: an
asker asks, at a session's start, on a timer or by hand, and the cadence
decides how much of each scan reaches a source.

A scan is one reading of a repository state's dependencies and of the
sources of those in the tiers it covers. It is complete for a tier when
every dependency of the tier was read and every source reached. A tier
is due when its cadence has passed since its last complete scan, or
when it has never had one.

A scan of what is due reaches the sources of the due tiers'
dependencies and of no others (15). A scan of a named tier reaches its
sources whether or not it is due. A session that starts every hour and
asks for what is due reaches a source only when a tier's cadence has
passed.

## An incomplete scan

A scan that leaves a tier incomplete reports every dependency it could
read, reports the rest as unread with the reason, and leaves the tier
due (16). A source that cannot be reached costs its own dependencies and
nothing else: the scan reports the tier's other dependencies, and the
next scan of what is due tries again (S3).

<figure class="hw">
<div class="hw-scroll">
<svg viewBox="0 0 800 210" role="img" aria-label="A timeline of a tier with a three-day cadence. A complete scan on day 0 leaves it fresh. Asking what headwater holds on day 2 reaches no source. The tier falls due on day 3. A scan on day 4 cannot reach one source, so the tier stays due. A complete scan on day 6 leaves it fresh until day 9.">
<text x="784" y="26" text-anchor="end" class="hw-th">ONE TIER, CADENCE THREE DAYS</text>
<rect x="60" y="62" width="225" height="40" class="hw-band-a"/>
<rect x="285" y="62" width="225" height="40" class="hw-band-o"/>
<rect x="510" y="62" width="225" height="40" class="hw-band-a"/>
<rect x="735" y="62" width="35" height="40" class="hw-band-o"/>
<text x="70" y="87" class="hw-la">fresh</text>
<text x="295" y="87" class="hw-lo">due</text>
<text x="520" y="87" class="hw-la">fresh</text>
<text x="741" y="87" class="hw-lo">due</text>
<line x1="40" y1="116" x2="780" y2="116" class="hw-axis"/>
<line x1="60" y1="110" x2="60" y2="122" class="hw-tick"/>
<line x1="135" y1="110" x2="135" y2="122" class="hw-tick"/>
<line x1="210" y1="110" x2="210" y2="122" class="hw-tick"/>
<line x1="285" y1="110" x2="285" y2="122" class="hw-tick"/>
<line x1="360" y1="110" x2="360" y2="122" class="hw-tick"/>
<line x1="435" y1="110" x2="435" y2="122" class="hw-tick"/>
<line x1="510" y1="110" x2="510" y2="122" class="hw-tick"/>
<line x1="585" y1="110" x2="585" y2="122" class="hw-tick"/>
<line x1="660" y1="110" x2="660" y2="122" class="hw-tick"/>
<line x1="735" y1="110" x2="735" y2="122" class="hw-tick"/>
<text x="60" y="140" text-anchor="middle" class="hw-ms">day 0</text>
<text x="135" y="140" text-anchor="middle" class="hw-ms">1</text>
<text x="210" y="140" text-anchor="middle" class="hw-ms">2</text>
<text x="285" y="140" text-anchor="middle" class="hw-ms">3</text>
<text x="360" y="140" text-anchor="middle" class="hw-ms">4</text>
<text x="435" y="140" text-anchor="middle" class="hw-ms">5</text>
<text x="510" y="140" text-anchor="middle" class="hw-ms">6</text>
<text x="585" y="140" text-anchor="middle" class="hw-ms">7</text>
<text x="660" y="140" text-anchor="middle" class="hw-ms">8</text>
<text x="735" y="140" text-anchor="middle" class="hw-ms">9</text>
<circle cx="60" cy="116" r="7" class="hw-dot-a"/>
<circle cx="210" cy="116" r="6" class="hw-dot"/>
<circle cx="360" cy="116" r="7" class="hw-dot-x"/>
<circle cx="510" cy="116" r="7" class="hw-dot-a"/>
<text x="52" y="50" class="hw-t">complete scan</text>
<line x1="60" y1="56" x2="60" y2="107" class="hw-lead"/>
<text x="360" y="50" text-anchor="middle" class="hw-t">incomplete scan</text>
<line x1="360" y1="56" x2="360" y2="107" class="hw-lead"/>
<text x="510" y="50" text-anchor="middle" class="hw-t">complete scan</text>
<line x1="510" y1="56" x2="510" y2="107" class="hw-lead"/>
<text x="210" y="168" text-anchor="middle" class="hw-t">asked what it holds</text>
<text x="210" y="186" text-anchor="middle" class="hw-s">no source reached (17)</text>
<text x="360" y="168" text-anchor="middle" class="hw-s">one source unreached,</text>
<text x="360" y="186" text-anchor="middle" class="hw-s">still due (16)</text>
<text x="770" y="186" text-anchor="end" class="hw-ms">days</text>
</svg>
</div>
<figcaption>A tier is due when its cadence has passed since its last complete scan, or when it has never had one. An incomplete scan leaves it due (16), and asking what headwater holds reaches no source and writes nothing (17).</figcaption>
</figure>

## Asking what headwater holds

Asking what headwater holds reaches no source and writes nothing (17).
The answer is the newest report for each tier, and says when each was
made and whether its tier is due. A scan of what is due, asked when no
tier is due, reaches no source either. A session that starts again an
hour after its first is told the same releases and when they were found
(S2).

Still to rule: questions 2, 14, 15, 16, 18, 19 and 20, and the
statement's own question on when a cadence starts, in
[Open questions](open.md#tiers-and-scans).
