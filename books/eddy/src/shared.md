# What every part shares

The parts share everything but the service. eddy writes four things
once, and every part calls them: the key's shape, the meeting's
details, the raw layout, and the rule that skips a meeting too short
to hold anything. A part's own code reads its service in the service's
terms and hands the shared code one shape of meeting. The raw layout
has a chapter of its own, [A meeting's raw files](raw.md).

## The key

A part keys a meeting by its service and the meeting's own id:

```
meeting/<service>/<meeting id>
```

`<service>` is the part's name, such as `wispr`, and `<meeting id>` is
the id the service gives the meeting. The key is the meeting's identity:
every host and every run gives one meeting one key, and millpond holds
one capture per key (111). Every meeting key starts with `meeting`, so
none starts with `/`, `captures` or `moves`, which the contract refuses.

The key is what lets a part forget. millpond looks every key up in the
inbox before it writes, so a part keeps no list of what it reported and
may list the same window as often as it likes. What a key cannot do is
join two services: a meeting recorded on two services gets a key from
each, and two captures.

<figure class="fig">
<div class="scroll">
<svg viewBox="0 0 760 300" role="img" aria-labelledby="fk-t fk-d">
<title id="fk-t">One key per meeting per service</title>
<desc id="fk-d">On the left, a part runs at 09:00 and lists meetings m41 and m42, then runs at 12:00 and lists m42 and m43. millpond writes three captures; the second line for m42 is passed over and counted. On the right, one meeting recorded on Wispr Flow and on Webex gets two keys, meeting/wispr/a7f and meeting/webex/9921, and two unread captures. A reader reads them together and writes the second's signals once.</desc>
<defs>
<marker id="fk-h" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hd"/></marker>
<marker id="fk-ho" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hd-o"/></marker>
</defs>
<text x="12" y="22" class="th">ONE MEETING LISTED TWICE</text>
<rect x="12" y="36" width="170" height="74" rx="8" class="bx"/>
<text x="24" y="58" class="t">run, 09:00</text>
<text x="24" y="78" class="tm">meeting/wispr/m41</text>
<text x="24" y="96" class="tm">meeting/wispr/m42</text>
<rect x="12" y="124" width="170" height="74" rx="8" class="bx"/>
<text x="24" y="146" class="t">run, 12:00</text>
<text x="24" y="166" class="tm">meeting/wispr/m42</text>
<text x="24" y="184" class="tm">meeting/wispr/m43</text>
<path d="M182,73 L208,100" class="ar" marker-end="url(#fk-h)"/>
<path d="M182,161 L208,134" class="ar" marker-end="url(#fk-h)"/>
<rect x="212" y="72" width="170" height="90" rx="8" class="bx-acc"/>
<text x="224" y="94" class="t">millpond</text>
<text x="224" y="114" class="ts">three captures;</text>
<text x="224" y="131" class="ts">m42's second line is</text>
<text x="224" y="148" class="ts">passed over and counted</text>
<text x="12" y="236" class="ts">One meeting has one key on every host and in</text>
<text x="12" y="254" class="ts">every run, so a part lists any window again</text>
<text x="12" y="272" class="ts">and keeps no list of what it reported.</text>
<line x1="388" y1="30" x2="388" y2="284" class="rule"/>
<text x="400" y="22" class="th">ONE MEETING RECORDED TWICE</text>
<rect x="400" y="36" width="348" height="50" rx="8" class="bx"/>
<text x="412" y="57" class="t">One meeting</text>
<text x="412" y="75" class="ts">recorded on Wispr Flow and on Webex</text>
<line x1="485" y1="86" x2="485" y2="106" class="ar" marker-end="url(#fk-h)"/>
<line x1="663" y1="86" x2="663" y2="106" class="ar" marker-end="url(#fk-h)"/>
<rect x="400" y="110" width="170" height="40" rx="7" class="bx-soft"/>
<text x="412" y="135" class="tm">meeting/wispr/a7f</text>
<rect x="578" y="110" width="170" height="40" rx="7" class="bx-soft"/>
<text x="590" y="135" class="tm">meeting/webex/9921</text>
<line x1="485" y1="150" x2="485" y2="168" class="ar" marker-end="url(#fk-h)"/>
<line x1="663" y1="150" x2="663" y2="168" class="ar" marker-end="url(#fk-h)"/>
<rect x="400" y="172" width="348" height="40" rx="8" class="bx-acc"/>
<text x="412" y="197" class="t">Two captures, both unread</text>
<line x1="574" y1="212" x2="574" y2="228" class="ar-o" marker-end="url(#fk-ho)"/>
<rect x="400" y="232" width="348" height="52" rx="8" class="bx-ochre"/>
<text x="412" y="254" class="t">A reader reads them together</text>
<text x="412" y="272" class="ts">and writes the second's signals once</text>
</svg>
</div>
<figcaption>The key is a meeting's identity on its service. A window listed twice gives each meeting one capture. A meeting recorded on two services gets two keys and two captures; eddy cannot know they are one meeting, and its reader joins them.</figcaption>
</figure>

A meeting recorded twice is the reader's to join, because only a
reading tells that two transcripts hold one conversation. The reader
reads the two captures together and writes the second's signals once
([millpond's book](../millpond/)).

## The meeting's details

Every part reads four details of a meeting from its service and hands
them to the shared code in one shape:

| Detail | Becomes |
|---|---|
| title | the capture's `title`, the one line a person reads in a list |
| start | the capture's `event_at`, in RFC 3339 |
| length | the input to the skip, below |
| attendees | part of the meeting's record; the contract gives them no field, and [Open questions](open.md) holds where they travel |

## When the meeting started

A meeting capture's `event_at` is when the meeting started, never when a
part listed it or millpond captured it, because weight counts by event
date (118). A meeting a part lists a week late counts from the day it
was held, so a backlog reaches curation in the order its meetings
happened.

## Skipping a short meeting

A part prints no capture for a meeting too short to hold anything. The
meeting's length decides the skip, so every run and every host skips
the same meetings, and a skip needs no record. Where the line falls is
open.
