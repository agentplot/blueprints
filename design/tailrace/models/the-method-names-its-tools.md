# The Method names its tools

A design note for the madswan planner, 2026-10-26, on the user's word on
proposal 14: "cross-reference these sections to the tools pages as
they're being worked on", the one-agent-one-worktree diagram "grounded in
sluice", and the never-prove-twice diagram "grounded in tailrace and
sluice now." It says what links where and what each diagram draws from
the statements. The planner turns it into one flywheel-web unit beside
the two diagram units of proposal 106.

## Each principle names the tools that realise it

Every principle page carries a short strip, "In the tools", naming the
tool pages the principle is built from, product page first where the tool
has one, the design book where it does not. The strip is data in the
page's frontmatter, so the Tools page and the principle pages never
disagree, and the outline keeps the clause numbers the strip does not
show.

| principle | tools | what the link lands on |
|---|---|---|
| One shell | sluice | `sluice exec`: a check runs in the place's own shell, the one the repository declares |
| One agent, one worktree | sluice, flume | sluice: a session submits and never merges (1, 2); a place gets its ports on the host and its servers end with it (30, 31, I5, record 0016). flume: one agent launched in one worktree |
| Capture at the source | millpond, headwater, eddy | adapters write captures once; millpond records each event once |
| Intents and bolts | crew, flywheel-next | bolts and units; a bolt lands on the shared line as one |
| Two loops, one gate | tailrace, sluice | tailrace: the word is a promotion (97), asked by whatever carries the card (C.16); sluice: landing is automatic on green (4) |
| Order at landing, never at start | sluice | clauses 3, 6, 7, 10 to 12, 17, 18 |
| Never prove twice | tailrace, sluice | below |
| Secrets by declaration | sluice | a run gets the host's shared caches and nothing else outside its place (35); a cold check gets none |
| Measure the fleet | crew, sounding | the records the collectors read |

The Tools page gains tailrace, which it lacks today, in the same voice as
the others: "tailrace carries what the merge queue lands into a store you
own, names each piece by its content, keeps channels and the environments
that follow them, and serves consumers in their ecosystem's own form." Its
"The Method joins them" paragraph gains one sentence: the work lands
through sluice, and tailrace carries the landing to a channel and to
every environment that follows it.

## The two diagrams, grounded

**One agent, one worktree.** Three places side by side, each an agent's,
each with the block of ports sluice held for it on the host, each checked
free (C.1, the git worktree profile), its emulator and dev servers bound
to those ports and ending with the place (record 0016, core.10). Each
submits its head to the line and none merges (1); the queue performs
every landing (2). The agent that reaches into another's server is
refused by the sandbox, which opens a place its own ports and the host's
declared caches and nothing else (35). The caption names sluice and
worktrunk; the clause numbers stay in the outline.

**Never prove twice.** The cache in the middle is tailrace's store
holding moon's cache entries, each named by the task's hash and shared by
every checkout on the host (52 to 55, 100, C.11's moon row). Four places
run the same check: a worktree, a second worktree, CI and the queue. The
first run fills the cache; the next three replay. Who writes it: the
landing's host, after sluice's push, pushes the archives the landing's
verdicts name (Bolt 3's push after a landing), and only a signer the
policy names counts (sluice 104, 108). Beside the cache, the queue's own
record keeps a fail the cache never remembers: sluice records every run
with its key, outcome and executor before any verdict reads it, a fail
exactly as a pass (sluice core.7, clauses 15, 16, 19). One input changes
and only that check runs again, which is moon's declared inputs. The
caption names moon, sluice and tailrace.

## What this does not do

It adds no clause numbers to the site's pages: the strip and the
captions name tools and link pages; the outline keeps the numbers, as it
does now. It does not restate a tool's design: a link lands on the tool's
own page or book section.
