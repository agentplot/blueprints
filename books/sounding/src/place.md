# The place

A sounding works in a worktree of the repository its question is about,
on the branch `sounding/<name>`. That worktree is the sounding's place.
The session reads the repository there as it stands, and writes
whatever helps it answer the question, prototype code included.

## A worktree of its own

- **The session that asked keeps its thread.** `/sound` opens a
  sounding in a worktree of its own, and the session that asked goes on
  with its own work undisturbed.
- **A prototype tests an answer against the repository itself.** The
  session can change the code, run it and read what happens, since
  nothing it writes reaches another worktree.
- **Every round of one sounding shares the place.** Go on starts the
  next round in the same worktree, so the prototype, the notes and the
  files carry from one round to the next. Drop records the reason and
  removes the worktree.

## Prototype code never lands from it

Code the session writes in its place tests an answer. It never lands
from the sounding's branch. The work the operator accepts reaches main
on a branch of its own: through an item's worktree or crew's plan, and
through sluice, which tests it as merged before it lands.

sounding's Claude Code plugin holds the rule inside the session: it
refuses a sluice submission from a `sounding/*` branch. A conclusion
says what a prototype showed, and the work it proposes names what to
build ([Deciding a conclusion](deciding.md)).

<figure class="sd-fig">
<div class="sd-scroll">
<svg viewBox="0 0 720 256" role="img" aria-label="The place is a worktree of the repository on the branch sounding/name, holding question.md, conclusion.md, rounds/ and prototype code. The conclusion goes to the operator. Work the operator accepts goes to an item's worktree or crew's plan, on a branch of its own, then through sluice to main. A sluice submission from the sounding's branch is refused.">
<defs>
<marker id="sd-p-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="sd-hd"/></marker>
<marker id="sd-p-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="sd-hd-a"/></marker>
</defs>
<text x="10" y="22" class="sd-th">the place</text>
<text x="290" y="22" class="sd-th">the decision</text>
<text x="480" y="22" class="sd-th">another branch</text>
<rect x="10" y="32" width="244" height="216" rx="10" class="sd-bx-sd"/>
<text x="26" y="56" class="sd-tm">sounding/&lt;name&gt;</text>
<text x="26" y="76" class="sd-ts">a worktree of the repository</text>
<rect x="26" y="90" width="212" height="26" rx="6" class="sd-chip"/>
<text x="38" y="108" class="sd-tm">question.md</text>
<rect x="26" y="122" width="212" height="26" rx="6" class="sd-chip"/>
<text x="38" y="140" class="sd-tm">conclusion.md</text>
<rect x="26" y="154" width="212" height="26" rx="6" class="sd-chip"/>
<text x="38" y="172" class="sd-tm">rounds/</text>
<rect x="26" y="186" width="212" height="44" rx="6" class="sd-chip"/>
<text x="38" y="204" class="sd-t">Prototype code</text>
<text x="38" y="221" class="sd-ts">tests an answer</text>
<path d="M238,135 L262,135 L262,74 L286,74" class="sd-ar-a" marker-end="url(#sd-p-a)"/>
<rect x="290" y="40" width="128" height="70" rx="9" class="sd-bx-hl"/>
<text x="302" y="64" class="sd-t">The operator</text>
<text x="302" y="84" class="sd-ts">decides the</text>
<text x="302" y="100" class="sd-ts">conclusion</text>
<line x1="418" y1="75" x2="476" y2="75" class="sd-ar" marker-end="url(#sd-p-m)"/>
<text x="426" y="66" class="sd-tl">accept</text>
<rect x="480" y="40" width="166" height="70" rx="9" class="sd-bx"/>
<text x="494" y="62" class="sd-t">An item's worktree</text>
<text x="494" y="80" class="sd-ts">or crew's plan, on</text>
<text x="494" y="96" class="sd-ts">a branch of its own</text>
<line x1="563" y1="110" x2="563" y2="146" class="sd-ar" marker-end="url(#sd-p-m)"/>
<rect x="480" y="150" width="166" height="64" rx="9" class="sd-bx"/>
<text x="494" y="174" class="sd-tb">sluice</text>
<text x="494" y="196" class="sd-ts">tests it as merged</text>
<line x1="646" y1="182" x2="662" y2="182" class="sd-ar" marker-end="url(#sd-p-m)"/>
<rect x="666" y="150" width="46" height="64" rx="9" class="sd-bx"/>
<text x="689" y="187" class="sd-t" text-anchor="middle">main</text>
<path d="M238,208 L476,208" class="sd-ar-d" marker-end="url(#sd-p-m)"/>
<path d="M352,198 L368,218 M368,198 L352,218" class="sd-x"/>
<text x="270" y="240" class="sd-ts">a submission from sounding/* is refused</text>
</svg>
</div>
<figcaption>Only the conclusion leaves the place, for the operator. The work they accept reaches main on a branch of its own and through sluice. A submission from the sounding's own branch is refused before it reaches the queue.</figcaption>
</figure>

## The name

A sounding's name appears twice: in its branch, `sounding/<name>`, and
in the key of each capture it offers, `sounding/<name>/<n>`
([Three exits](exits.md#offer)). The name ties the branch and every
offer to the one question they came from.
