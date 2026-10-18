# Deciding a conclusion

The operator decides each conclusion: on a card, in sounding's herdr
plugin, or on crew's rail. A conclusion gets one decision, and the
operator gives it once (6).

| Answer | What follows |
|---|---|
| Accept | Settles the item. millpond keeps the conclusion as the item's record, and each piece of work the conclusion proposes becomes an item of its own, or an entry in crew's plan. |
| Go on | Starts the next round in the same worktree. The conclusion moves to `rounds/<n>.md`, and the operator's notes join the next session's question. |
| Drop | Records the reason and removes the worktree. |

<figure class="sd-fig">
<div class="sd-scroll">
<svg viewBox="0 0 720 260" role="img" aria-label="sounding open starts the first round. The session works until it concludes, and the sounding waits on the operator. Accept settles it: the conclusion becomes the item's record and its proposed work becomes new items or plan entries. Go on moves the conclusion to rounds/n.md, adds the operator's notes to the question and starts the next round in the same place. Drop records the reason and removes the worktree.">
<defs>
<marker id="sd-d-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="sd-hd"/></marker>
<marker id="sd-d-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="sd-hd-a"/></marker>
<marker id="sd-d-p" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="sd-hd-mp"/></marker>
</defs>
<rect x="10" y="100" width="124" height="50" rx="25" class="sd-bx"/>
<text x="28" y="130" class="sd-tm">sounding open</text>
<line x1="134" y1="125" x2="160" y2="125" class="sd-ar" marker-end="url(#sd-d-m)"/>
<rect x="164" y="90" width="120" height="70" rx="9" class="sd-bx-sd"/>
<text x="178" y="116" class="sd-t">Working</text>
<text x="178" y="136" class="sd-ts">round n</text>
<line x1="284" y1="125" x2="356" y2="125" class="sd-ar-a" marker-end="url(#sd-d-a)"/>
<text x="292" y="116" class="sd-tl">conclude</text>
<rect x="360" y="90" width="160" height="70" rx="9" class="sd-bx-hl"/>
<text x="374" y="116" class="sd-t">Waiting on</text>
<text x="374" y="134" class="sd-t">the operator</text>
<path d="M520,104 L548,104 L548,50 L576,50" class="sd-ar-mp" marker-end="url(#sd-d-p)"/>
<text x="528" y="40" class="sd-tl-mp">accept</text>
<rect x="580" y="20" width="132" height="70" rx="9" class="sd-bx-mp"/>
<text x="594" y="42" class="sd-t">Settled</text>
<text x="594" y="60" class="sd-ts">the item's record;</text>
<text x="594" y="76" class="sd-ts">new items</text>
<path d="M520,146 L548,146 L548,200 L576,200" class="sd-ar" marker-end="url(#sd-d-m)"/>
<text x="542" y="184" class="sd-ts" text-anchor="end">drop</text>
<rect x="580" y="166" width="132" height="70" rx="9" class="sd-bx-dash"/>
<text x="594" y="188" class="sd-t">Dropped</text>
<text x="594" y="206" class="sd-ts">the reason kept,</text>
<text x="594" y="222" class="sd-ts">the worktree gone</text>
<path d="M440,160 L440,196 L224,196 L224,164" class="sd-ar-a" marker-end="url(#sd-d-a)"/>
<text x="250" y="216" class="sd-tl">go on</text>
<text x="250" y="234" class="sd-ts">rounds/&lt;n&gt;.md kept, notes join the question</text>
</svg>
</div>
<figcaption>Each round ends waiting on the operator. Accept and drop end the sounding; go on starts another round in the same place, with the last conclusion kept and the operator's notes in the question.</figcaption>
</figure>

## Accept

Accept ends the sounding and settles its item. millpond keeps the
conclusion as the item's record, and each piece of work the conclusion
proposes becomes an item of its own. In an inbox crew keeps, crew's
planner turns each piece into an entry in its plan. Either way the work
reaches main on a branch of its own, through sluice
([The place](place.md)).

The record outlasts the sounding. When a later signal arrives on the
same subject, curation answers it by naming the conclusion (116), and
the operator is not asked again.

## Go on

Go on starts the next round in the same worktree. The conclusion moves
to `rounds/<n>.md`, and the operator's notes join the next session's
question: what the answer missed, what to try next, what to leave
alone. The start hook hands the new session its question, its sources
and every earlier round ([The question and its sources](question.md)).

## Drop

Drop records the reason and removes the worktree. Nothing from the
place lands. Offers the sounding already made stay in the inbox, since
each is a capture of its own and an unmoved signal is never discarded
(118).

## A conclusion is never a signal

An accepted conclusion enters the inbox as a record, never as a
signal. Three facts about the inbox require it:

- **The item's signals already have their move.** Curation joined them
  into the item, and curation never judges a signal that has a move
  again (107). A conclusion made into a signal would put the same
  subject in front of curation a second time.
- **The operator has already decided it.** Approval given once is never
  asked again (6). A signal would bring the conclusion back as a
  decision, through curation's batches and the item it joined.
- **What the operator accepted settles signals.** Curation answers a
  later signal on the subject with `answered`, naming the conclusion as
  the record that settled it (116).

Only offers come back as signals. An offer is about something beyond
the question, which no move has judged and no decision has settled, so
it starts where every capture starts.

<figure class="sd-fig">
<div class="sd-scroll">
<svg viewBox="0 0 720 240" role="img" aria-label="Two things reach the inbox from a sounding. An accepted conclusion becomes the item's record in millpond, and curation answers a later signal on the same subject by naming it. An offer goes through millpond land as a capture that is its own excerpt, and curation gives its one signal a move.">
<defs>
<marker id="sd-n-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="sd-hd"/></marker>
<marker id="sd-n-p" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="sd-hd-mp"/></marker>
</defs>
<text x="10" y="22" class="sd-th">a conclusion: a record</text>
<rect x="10" y="36" width="170" height="54" rx="9" class="sd-bx-sd"/>
<text x="24" y="58" class="sd-t">Accepted</text>
<text x="24" y="76" class="sd-ts">conclusion</text>
<line x1="180" y1="63" x2="216" y2="63" class="sd-ar-mp" marker-end="url(#sd-n-p)"/>
<rect x="220" y="36" width="190" height="54" rx="9" class="sd-bx-mp"/>
<text x="234" y="58" class="sd-t">The item's record</text>
<text x="234" y="76" class="sd-ts">kept by millpond</text>
<line x1="556" y1="63" x2="414" y2="63" class="sd-ar" marker-end="url(#sd-n-m)"/>
<text x="426" y="55" class="sd-tm">answered</text>
<text x="426" y="82" class="sd-ts">names it (116)</text>
<rect x="560" y="36" width="152" height="54" rx="9" class="sd-bx"/>
<text x="574" y="58" class="sd-t">A later signal</text>
<text x="574" y="76" class="sd-ts">on the subject</text>
<line x1="10" y1="118" x2="712" y2="118" class="sd-ar-d"/>
<text x="10" y="146" class="sd-th">an offer: a capture</text>
<rect x="10" y="160" width="170" height="54" rx="9" class="sd-bx-sd"/>
<text x="24" y="182" class="sd-t">An offer</text>
<text x="24" y="200" class="sd-ts">beyond the question</text>
<line x1="180" y1="187" x2="216" y2="187" class="sd-ar-mp" marker-end="url(#sd-n-p)"/>
<rect x="220" y="160" width="190" height="54" rx="9" class="sd-bx-mp"/>
<text x="234" y="182" class="sd-tm">millpond land</text>
<text x="234" y="200" class="sd-ts">a capture, its own excerpt</text>
<line x1="410" y1="187" x2="556" y2="187" class="sd-ar-mp" marker-end="url(#sd-n-p)"/>
<text x="426" y="179" class="sd-ts">its one signal</text>
<rect x="560" y="160" width="152" height="54" rx="9" class="sd-bx-mp"/>
<text x="574" y="182" class="sd-t">Curation</text>
<text x="574" y="200" class="sd-ts">gives it a move</text>
</svg>
</div>
<figcaption>An accepted conclusion enters the inbox as a record, and curation answers later signals by naming it. Only an offer enters as a capture, and only its signal is curation's to move.</figcaption>
</figure>

## From a question to a landed bump

One question, from the release that raised it to the bump that lands:

1. headwater reports version 5 of a library the repository declares as
   `^4.2`. The release lies outside the declared range, so taking it
   changes the manifest ([headwater's book](../headwater/)).
2. The release lands in millpond as a capture that is its own excerpt.
   Curation joins its signal into an item that asks whether to take
   the release.
3. millpond sends the item to a sounding, with the release's signal and
   capture as its sources.
4. The session reads the notes, makes the bump in its place, and runs
   the repository's checks there to see what breaks.
5. It concludes: take version 5. Its evidence is what the checks showed,
   what it would change is the code the new version touches, and the
   work it proposes is the bump.
6. The operator accepts. millpond keeps the conclusion as the item's
   record, and the bump arrives as a new item.
7. The bump is made on a branch of its own, and sluice lands it.
8. The next signal on the subject reaches curation, which answers it by
   naming the conclusion.

The prototype bump in step 4 never lands. The bump in step 7 does, on
its own branch, through sluice.
