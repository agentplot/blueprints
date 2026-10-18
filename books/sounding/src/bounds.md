# The stop check and the timebox

Two bounds keep a round from going nowhere. The stop check holds its
end, and the timebox holds its length. Between them, every round leaves
something the operator or the next round can start from.

## The stop check

The stop check runs when the session tries to stop. sounding's Claude
Code plugin runs it as a hook at the session's end. It lets the session
stop when it has written a conclusion, or a note saying where the next
round would start. Otherwise it sends the session back to write one.

A session that stops on a conclusion hands the operator something to
decide. A session that stops on a note hands the next round a place to
begin. Either way, what the round learned outlives the session's own
scrollback.

## The timebox

Each round has a timebox. When it runs out, the session concludes with
what it knows: the answer as far as it got, its evidence, and what
stays open.

A question that needs more than one round gets one round at a time. The
operator reads each round's conclusion and answers go on when the
question deserves another. A round that has used its time comes back to
the operator before any more time goes into it.

## A round, end to end

<figure class="sd-fig">
<div class="sd-scroll">
<svg viewBox="0 0 720 290" role="img" aria-label="A round starts when the start hook hands the session its question, sources and earlier rounds. The session works, offering and asking along the way. When it has an answer, or its timebox runs out, it runs sounding conclude and the conclusion goes to the operator. When it tries to stop, the stop check lets it stop only on a conclusion or a note saying where the next round would start, and otherwise sends it back to work.">
<defs>
<marker id="sd-b-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="sd-hd"/></marker>
<marker id="sd-b-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="sd-hd-a"/></marker>
</defs>
<rect x="10" y="100" width="140" height="80" rx="9" class="sd-bx"/>
<text x="24" y="124" class="sd-t">Start hook</text>
<text x="24" y="144" class="sd-ts">question, sources,</text>
<text x="24" y="160" class="sd-ts">earlier rounds</text>
<line x1="150" y1="140" x2="186" y2="140" class="sd-ar" marker-end="url(#sd-b-m)"/>
<rect x="190" y="30" width="180" height="210" rx="10" class="sd-bx-sd"/>
<text x="206" y="58" class="sd-tb">Working</text>
<text x="206" y="82" class="sd-ts">reads, tries, writes</text>
<text x="206" y="100" class="sd-ts">in its place</text>
<text x="206" y="132" class="sd-ts">offers and asks</text>
<text x="206" y="150" class="sd-ts">along the way</text>
<text x="206" y="220" class="sd-tl">one round</text>
<line x1="370" y1="55" x2="406" y2="55" class="sd-ar" marker-end="url(#sd-b-m)"/>
<line x1="370" y1="135" x2="406" y2="135" class="sd-ar" marker-end="url(#sd-b-m)"/>
<line x1="370" y1="215" x2="406" y2="215" class="sd-ar" marker-end="url(#sd-b-m)"/>
<rect x="410" y="30" width="150" height="50" rx="8" class="sd-bx"/>
<text x="424" y="60" class="sd-t">Has an answer</text>
<rect x="410" y="110" width="150" height="50" rx="8" class="sd-bx"/>
<text x="424" y="132" class="sd-t">The timebox</text>
<text x="424" y="150" class="sd-ts">runs out</text>
<rect x="410" y="190" width="150" height="50" rx="8" class="sd-bx"/>
<text x="424" y="220" class="sd-t">Tries to stop</text>
<path d="M560,55 L578,55 L578,82 L596,82" class="sd-ar-a" marker-end="url(#sd-b-a)"/>
<path d="M560,135 L578,135 L578,108 L596,108" class="sd-ar-a" marker-end="url(#sd-b-a)"/>
<rect x="600" y="56" width="112" height="78" rx="9" class="sd-bx-hl"/>
<text x="614" y="80" class="sd-tm">conclude</text>
<text x="614" y="100" class="sd-ts">to the</text>
<text x="614" y="116" class="sd-ts">operator</text>
<line x1="560" y1="215" x2="596" y2="215" class="sd-ar" marker-end="url(#sd-b-m)"/>
<rect x="600" y="180" width="112" height="70" rx="9" class="sd-bx-hl"/>
<text x="614" y="202" class="sd-t">Stop check</text>
<text x="614" y="220" class="sd-ts">a conclusion</text>
<text x="614" y="236" class="sd-ts">or a note</text>
<path d="M656,250 L656,272 L280,272 L280,244" class="sd-ar-d" marker-end="url(#sd-b-m)"/>
<text x="300" y="265" class="sd-ts">neither written: sent back to work</text>
</svg>
</div>
<figcaption>A round ends on a conclusion when the session has an answer or its timebox runs out. A session that tries to stop sooner stops only on a conclusion or a note saying where the next round would start; otherwise the stop check sends it back.</figcaption>
</figure>

A round that ends on a conclusion waits on the operator's decision. Go
on starts the next round in the same place, with the operator's notes
added to the question ([Deciding a conclusion](deciding.md)).
