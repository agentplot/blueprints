# The held state

headwater keeps a little of its own for each repository: the held
state. It holds what headwater needs to answer without asking a source
again, and the acknowledgements people give.

## Outside the repository, shared by every checkout

headwater keeps its held state outside the repository's content (28).
A checkout's status never shows it, and no commit carries it. Every
checkout of one repository shares one held state, so an agent in one
worktree and a pane in another read the same report and see the same
acknowledgements.

The first store keeps it in the files under `<git common dir>/headwater/`,
which every worktree of the repository shares, and keeps notes whole in
the same directory (C.6).

<figure class="hw">
<div class="hw-scroll">
<svg viewBox="0 0 800 256" role="img" aria-label="Three checkouts of one repository, main, fix-acme-ui and bump-acme-client, all resolve to one git common directory, acme-app.git, whose headwater directory holds the held state, notes kept whole and acknowledgements; none of the checkouts holds it. Two scans read the held state at version 7. Scan A writes at version 7 and its write succeeds; scan B then writes at version 7 and is refused, because the held state is no longer at 7.">
<defs>
<marker id="hw-h-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hw-hd"/></marker>
<marker id="hw-h-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hw-hd-a"/></marker>
<marker id="hw-h-o" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hw-hd-o"/></marker>
</defs>
<text x="16" y="26" class="hw-th">CHECKOUTS</text>
<text x="270" y="26" class="hw-th">ONE GIT COMMON DIRECTORY</text>
<text x="580" y="26" class="hw-th">TWO SCANS AT ONCE</text>
<rect x="16" y="40" width="200" height="50" rx="8" class="hw-bx"/>
<text x="28" y="61" class="hw-m">main/</text>
<text x="28" y="80" class="hw-s">a person's checkout</text>
<rect x="16" y="104" width="200" height="50" rx="8" class="hw-bx"/>
<text x="28" y="125" class="hw-m">fix-acme-ui/</text>
<text x="28" y="144" class="hw-s">an agent's worktree</text>
<rect x="16" y="168" width="200" height="50" rx="8" class="hw-bx"/>
<text x="28" y="189" class="hw-m">bump-acme-client/</text>
<text x="28" y="208" class="hw-s">another agent's worktree</text>
<text x="16" y="242" class="hw-s">the held state is in none of them (28)</text>
<line x1="216" y1="65" x2="265" y2="104" class="hw-ar" marker-end="url(#hw-h-m)"/>
<line x1="216" y1="129" x2="265" y2="129" class="hw-ar" marker-end="url(#hw-h-m)"/>
<line x1="216" y1="193" x2="265" y2="154" class="hw-ar" marker-end="url(#hw-h-m)"/>
<rect x="270" y="40" width="250" height="178" rx="8" class="hw-bx"/>
<text x="282" y="62" class="hw-m">acme-app.git/</text>
<text x="282" y="80" class="hw-s">shared by every worktree</text>
<rect x="286" y="94" width="218" height="110" rx="8" class="hw-bx-a"/>
<text x="298" y="116" class="hw-m">headwater/</text>
<text x="298" y="138" class="hw-s">the held state, at a version</text>
<text x="298" y="158" class="hw-s">notes, kept whole</text>
<text x="298" y="178" class="hw-s">acknowledgements</text>
<rect x="580" y="40" width="204" height="78" rx="8" class="hw-bx"/>
<text x="592" y="62" class="hw-t">scan A</text>
<text x="592" y="82" class="hw-s">reads at version 7</text>
<text x="592" y="102" class="hw-la">writes at 7: a new version</text>
<rect x="580" y="140" width="204" height="78" rx="8" class="hw-bx"/>
<text x="592" y="162" class="hw-t">scan B</text>
<text x="592" y="182" class="hw-s">reads at version 7</text>
<text x="592" y="202" class="hw-lo">writes at 7: refused (49)</text>
<line x1="580" y1="90" x2="509" y2="128" class="hw-ar-a" marker-end="url(#hw-h-a)"/>
<line x1="580" y1="180" x2="509" y2="168" class="hw-ar-o" marker-end="url(#hw-h-o)"/>
<text x="580" y="242" class="hw-s">never half written (30)</text>
</svg>
</div>
<figcaption>Every worktree of a repository resolves to one git common directory, so every checkout shares one held state, and none of them holds it (28, 50). A write succeeds only while the held state is still at the version its scan read, all or nothing (49), so two scans at once never leave it half written (30).</figcaption>
</figure>

## Disposable, except acknowledgements

Everything in the held state but acknowledgements can be discarded, and
the next scan rebuilds it with no report changed but the times it gives
(29). A person who deletes the held state apart from its
acknowledgements loses nothing a scan cannot fetch again: the next scan
reports exactly what the last one did, at a new time (S9).
Acknowledgements are the one thing no source can give back.

## Two scans at once

Agents in many checkouts of one repository scan at once (section 9).
Two scans of one repository at once leave the held state as one or the
other would have left it. Neither leaves it half written, and no
acknowledgement is lost (30, S8).

The store has two operations (B.5). A read returns a repository's held
state and the version it was read at (48). A write takes the version
read and the next held state; it is all or nothing, and succeeds only
if the held state is still at the version read (49). The first store
writes a new file beside the old and renames it over the old, under a
lock held for the write (C.6).

## One reading per report

Every report is made from one reading of the repository state (31). A
report never mixes the declarations of two repository states, so a scan
that runs while a checkout moves reports one state whole.

## No credentials

headwater reaches a source with the asker's own credentials or with
none, and never keeps a credential in its held state (38). Every
checkout of the repository shares the held state, and nothing in it
signs in anywhere.

Still to rule: questions 1, 28 and 31, and the statement's own
question on where the held state lives when several hosts share one
repository, in [Open questions](open.md#the-held-state).
