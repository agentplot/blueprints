# Kinds and stages

A kind is a list of stages. Each stage names its prompt, the text its
agent starts from, and its deliverable, what flume reads its end from.
flume runs a place's stages in order, a fresh agent for each, and a
stage starts only once the stage before it has delivered.

## Three kinds

flume ships three kinds, and a repository may declare more.

| Kind | Stages | Its work |
|---|---|---|
| fix | code, then a submission to sluice | a change to the repository that needs no OpenSpec change |
| change | construct, code, verify, then a submission to sluice | an OpenSpec change: written, built task by task, checked against itself, and landed |
| question | a sounding's session | one question, ending on a conclusion |

<figure class="fl-fig">
<div class="fl-scroll">
<svg viewBox="0 0 720 318" role="img" aria-label="The three kinds as rows of stages. A change runs construct, delivering the change committed; code, delivering every task ticked; verify, delivering its report; and a submission, delivering the landing. A fix runs code, delivering a commit made since the stage began, and a submission, delivering the landing. A question runs one stage, a sounding's session, delivering conclusion.md, and has no submission, so nothing lands from it.">
<defs>
<marker id="fl-k-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fl-hd-a"/></marker>
<marker id="fl-k-s" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fl-hd-sl"/></marker>
<marker id="fl-k-d" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fl-hd-sd"/></marker>
</defs>
<text x="10" y="22" class="fl-th">kind</text>
<text x="110" y="22" class="fl-th">stages, each a fresh agent, each ending on its deliverable</text>
<text x="10" y="64" class="fl-tb">change</text>
<rect x="110" y="40" width="110" height="36" rx="7" class="fl-chip-fl"/>
<text x="124" y="63" class="fl-t">construct</text>
<line x1="220" y1="58" x2="246" y2="58" class="fl-ar-a" marker-end="url(#fl-k-a)"/>
<rect x="250" y="40" width="110" height="36" rx="7" class="fl-chip-fl"/>
<text x="264" y="63" class="fl-t">code</text>
<line x1="360" y1="58" x2="386" y2="58" class="fl-ar-a" marker-end="url(#fl-k-a)"/>
<rect x="390" y="40" width="110" height="36" rx="7" class="fl-chip-fl"/>
<text x="404" y="63" class="fl-t">verify</text>
<line x1="500" y1="58" x2="526" y2="58" class="fl-ar-a" marker-end="url(#fl-k-a)"/>
<rect x="530" y="40" width="110" height="36" rx="7" class="fl-chip-fl"/>
<text x="544" y="63" class="fl-t">submission</text>
<line x1="640" y1="58" x2="656" y2="58" class="fl-ar-sl" marker-end="url(#fl-k-s)"/>
<rect x="660" y="40" width="52" height="36" rx="7" class="fl-bx-sl"/>
<text x="686" y="63" class="fl-ts" text-anchor="middle">lands</text>
<text x="110" y="96" class="fl-ts">the change,</text>
<text x="110" y="112" class="fl-ts">committed</text>
<text x="250" y="96" class="fl-ts">every task</text>
<text x="250" y="112" class="fl-ts">ticked</text>
<text x="390" y="96" class="fl-ts">its report</text>
<text x="530" y="96" class="fl-ts">the landing</text>
<text x="10" y="164" class="fl-tb">fix</text>
<rect x="250" y="140" width="110" height="36" rx="7" class="fl-chip-fl"/>
<text x="264" y="163" class="fl-t">code</text>
<line x1="360" y1="158" x2="526" y2="158" class="fl-ar-a" marker-end="url(#fl-k-a)"/>
<rect x="530" y="140" width="110" height="36" rx="7" class="fl-chip-fl"/>
<text x="544" y="163" class="fl-t">submission</text>
<line x1="640" y1="158" x2="656" y2="158" class="fl-ar-sl" marker-end="url(#fl-k-s)"/>
<rect x="660" y="140" width="52" height="36" rx="7" class="fl-bx-sl"/>
<text x="686" y="163" class="fl-ts" text-anchor="middle">lands</text>
<text x="250" y="196" class="fl-ts">a commit since</text>
<text x="250" y="212" class="fl-ts">the stage began</text>
<text x="530" y="196" class="fl-ts">the landing</text>
<text x="10" y="264" class="fl-tb">question</text>
<rect x="110" y="240" width="250" height="36" rx="7" class="fl-bx-sd"/>
<text x="124" y="263" class="fl-t">a sounding's session</text>
<line x1="360" y1="258" x2="386" y2="258" class="fl-ar-sd" marker-end="url(#fl-k-d)"/>
<rect x="390" y="240" width="130" height="36" rx="7" class="fl-bx-sd"/>
<text x="404" y="263" class="fl-tm">conclusion.md</text>
<text x="110" y="296" class="fl-ts">ends on sounding conclude</text>
<text x="548" y="263" class="fl-ts">no submission:</text>
<text x="548" y="279" class="fl-ts">nothing lands from it</text>
</svg>
</div>
<figcaption>A fix runs a change's code and submission stages, without construct or verify. A question is one stage, a sounding's session, and has no submission.</figcaption>
</figure>

## The stages

| Stage | Its agent | Its deliverable |
|---|---|---|
| construct | writes the OpenSpec change from the brief: its proposal, design, specs and tasks | the change, committed on the place's branch |
| code | builds the work: a fix whole, or a change's tasks one at a time, ticking each as it is done | for a fix, a commit on the branch made since the stage began; for a change, every task ticked |
| verify | checks the code against the change as written, and reports each finding | its report |
| submission | submits the place's branch to sluice, and reads the outcome | the landing: sluice's record that the branch landed on its target |
| a sounding's session | works the question in its place | `conclusion.md`, written by `sounding conclude` |

A stage starts only on the deliverable of the stage before it. code
never starts before the change is committed, and verify never before
every task is ticked, so each stage's agent finds in the place what its
prompt says is there.

A stage's deliverable is something flume reads in the place or on the
host: a file, a commit, ticked tasks, or a record such as sluice's
(`teams.4`). [A stage ends on its deliverable](stage-ends.md) says how
flume reads each one.

## A fix

A fix is work that needs no design of its own: a release to take, a
defect to mend, a file to correct. Its code stage makes the change and
commits it on the place's branch. Its submission stage submits the
branch to sluice and ends when the branch lands.

## A change

A change is work that needs an OpenSpec change first. construct writes
the change and commits it: its proposal, its design, its specs and its
tasks. code works the tasks and ticks each one in `tasks.md` as it is
done. verify checks the code against the change as construct wrote it.
The submission stage submits the branch, which then carries the change
and its code together.

flume reads the change's own files, so status shows its tasks ticked as
code works through them ([Status and live state](status.md)).

## A question

sounding launches the kind question for each sounding. flume makes the
place and starts the round's session there. sounding's Claude Code
plugin hands the session its question, its sources and its earlier
rounds at its start
([sounding's book](../sounding/question.html#questionmd)).

- **The stage ends on `conclusion.md`**, which `sounding conclude`
  writes, or when the session stops on a note saying where the next
  round would start. sounding's stop check holds the session to one of
  the two, so the note is how a question's session stops short
  ([sounding's stop check](../sounding/bounds.html)).
- **Go on starts the stage again** in the same place, with a fresh
  session. The operator's notes join the question, and the place keeps
  the prototype and the files from the round before.
- **Nothing lands from a question.** The kind has no submission stage,
  and sounding's plugin refuses a submission from a sounding's branch
  ([sounding's place](../sounding/place.html)).

sounding's book names a question's branch `sounding/<name>`.
[Open questions](open.md#a-questions-branch) holds which name flume
gives it.

## A repository's own kinds

A repository may declare kinds of its own in the same form: a name,
and a list of stages, each naming its prompt and its deliverable. flume
runs a declared kind as it runs the three it ships, one fresh agent per
stage, each stage ending on its deliverable. How a repository declares
its kinds, and how crew's stage prompts take that form, is on
[Open questions](open.md#a-repositorys-kinds).
