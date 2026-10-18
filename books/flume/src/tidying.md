# Tidying

A place lasts as long as its work. flume tidies a place once its work
lands or its launch is dropped, and its agent has stopped (`teams.1`).
It removes the worktree, and deletes the branch unless the branch holds
work its target lacks.

## When a place's work is over

- **Landed:** sluice's record shows the place's branch landed on its
  target.
- **Dropped:** the caller dropped the launch, as sounding's drop does
  for a sounding, or the operator did.

flume tidies a place when it reads that its work is over, and
`flume tidy` runs the same pass on demand. When flume cannot read
whether a place's work is over, it removes nothing (`plan.9`).

## What flume removes

flume removes only places it made: worktrees directly under
`<repository>/places/`, each on the branch of a launch flume made
(`plan.9`). It never removes:

- the repository's main checkout;
- a worktree made by hand, or by another tool;
- a locked worktree;
- a worktree with modified files, or untracked files that are not
  ignored.

A place kept for one of these reasons stays in status, named with the
reason ([Status and live state](status.md)).

## Through the repository's own tool

flume removes a place through the repository's own worktree tool, such
as worktrunk's `wt remove`, so the repository's remove hooks run.
Whatever the repository stood up for that worktree goes with it: a
database, a dev server, a test service (`plan.9`). A hook that fails
keeps the worktree, and flume names it.

## The branch

When the worktree goes, flume judges its branch against its target with
`git cherry` (`plan.10`):

- a branch holding a commit whose patch the target lacks is kept and
  named;
- a branch holding nothing beyond its target is deleted.

`git cherry` compares patches, so a commit that reached the target
under another id, as a rebase gives it, counts as landed, and a patch
found nowhere in the target keeps the branch. A branch kept by mistake
costs a deletion by hand; a branch deleted by mistake loses the work.

<figure class="fl-fig">
<div class="fl-scroll">
<svg viewBox="0 0 720 328" role="img" aria-label="Tidying a place. Its work must be over, landed or dropped with its agent stopped; otherwise it is still running. flume must have made it, under places/ on a launch's branch; otherwise it is never touched. It must be clean and unlocked; otherwise it is kept and named. Then flume removes it through the repository's worktree tool with its hooks, and a hook that fails keeps it, named. Its branch is judged with git cherry against its target: a branch holding a patch the target lacks is kept and named, and one holding nothing beyond its target is deleted.">
<defs>
<marker id="fl-t-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fl-hd"/></marker>
<marker id="fl-t-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fl-hd-a"/></marker>
</defs>
<text x="10" y="22" class="fl-th">the worktree</text>
<rect x="10" y="36" width="150" height="72" rx="9" class="fl-bx"/>
<text x="24" y="60" class="fl-t">Work over</text>
<text x="24" y="78" class="fl-ts">landed or dropped,</text>
<text x="24" y="94" class="fl-ts">its agent stopped</text>
<line x1="160" y1="72" x2="180" y2="72" class="fl-ar" marker-end="url(#fl-t-m)"/>
<rect x="184" y="36" width="150" height="72" rx="9" class="fl-bx"/>
<text x="198" y="60" class="fl-t">flume made it</text>
<text x="198" y="78" class="fl-ts">under places/, on</text>
<text x="198" y="94" class="fl-ts">a launch's branch</text>
<line x1="334" y1="72" x2="354" y2="72" class="fl-ar" marker-end="url(#fl-t-m)"/>
<rect x="358" y="36" width="150" height="72" rx="9" class="fl-bx"/>
<text x="372" y="60" class="fl-t">Clean, unlocked</text>
<text x="372" y="78" class="fl-ts">no modified or</text>
<text x="372" y="94" class="fl-ts">untracked files</text>
<line x1="508" y1="72" x2="528" y2="72" class="fl-ar-a" marker-end="url(#fl-t-a)"/>
<rect x="532" y="36" width="180" height="72" rx="9" class="fl-bx-fl"/>
<text x="546" y="60" class="fl-t">Removed</text>
<text x="546" y="78" class="fl-ts">by the repository's tool,</text>
<text x="546" y="94" class="fl-ts">its hooks run</text>
<text x="24" y="130" class="fl-ts">if not: still running</text>
<text x="198" y="130" class="fl-ts">if not: never touched</text>
<line x1="433" y1="108" x2="433" y2="140" class="fl-ar" marker-end="url(#fl-t-m)"/>
<text x="440" y="128" class="fl-ts">if not</text>
<rect x="358" y="144" width="150" height="48" rx="9" class="fl-bx-dash"/>
<text x="372" y="165" class="fl-t">Kept, named</text>
<text x="372" y="182" class="fl-ts">in status</text>
<path d="M566,108 L566,168 L512,168" class="fl-ar" marker-end="url(#fl-t-m)"/>
<text x="574" y="138" class="fl-ts">a hook fails</text>
<text x="10" y="222" class="fl-th">its branch</text>
<path d="M666,108 L666,226" class="fl-ar-a" marker-end="url(#fl-t-a)"/>
<rect x="580" y="230" width="132" height="64" rx="9" class="fl-bx-hl"/>
<text x="594" y="254" class="fl-tm">git cherry</text>
<text x="594" y="274" class="fl-ts">against its target</text>
<path d="M580,252 L560,252 L560,244 L534,244" class="fl-ar" marker-end="url(#fl-t-m)"/>
<rect x="290" y="222" width="240" height="44" rx="8" class="fl-bx-dash"/>
<text x="304" y="240" class="fl-t">Kept, named</text>
<text x="304" y="257" class="fl-ts">holds a patch its target lacks</text>
<path d="M580,274 L560,274 L560,294 L534,294" class="fl-ar" marker-end="url(#fl-t-m)"/>
<rect x="290" y="272" width="240" height="44" rx="8" class="fl-bx"/>
<text x="304" y="290" class="fl-t">Deleted</text>
<text x="304" y="307" class="fl-ts">holds nothing beyond its target</text>
</svg>
</div>
<figcaption>Each gate that does not hold leaves the place where it is. A place flume made, whose work is over and whose tree is clean, goes through the repository's own tool, and its branch goes only when it holds nothing its target lacks.</figcaption>
</figure>

## A launch dropped part way

A launch dropped before its work lands leaves a branch with the commits
its stages made: a construct's change, a code stage's work. Tidying
keeps that branch and names it, so the work stays reachable until
someone deletes the branch by hand.
