# Open questions

What the design does not settle, and where each question is held. A
question leaves this page when the operator rules; the ruling lands in
the design, and the chapter that rests on it is rewritten whole.

## millpond's statement

millpond's statement of invariants, `design/millpond/requirements.md`,
is being written from the capture design (plan step P1). It states the
inbox, the contract's intake, the
seven steps, the reader and curation tools, moves, items and sends, the
three setups, and what millpond never does. A fresh model then
reconstructs millpond from the statement alone, and the operator rules
the questions it asks.

The statement becomes this book's appendix, and the chapters cite its
clauses by number. Until it lands, the chapters rest on the capture
design, `design/capture/design.md`, and cite Flywheel's statement,
which the contract and the inbox are to enter as clauses of their own.

## Decisions awaiting a ruling

The capture design's twelve decisions await the operator's ruling
(`design/capture/plan.md`, step D2). Each chapter states them as the
design has them.

1. headwater is for dependencies and eddy for meetings. The work every
   source shares is millpond's, through the contract
   ([Sources](sources.md)).
2. millpond is a standalone tool, the inbox. It runs adapters, keeps
   captures and signals, serves the tools curation works through, and
   sends an item to a worktree. crew calls its command line as it calls
   sluice's ([Three setups](setups.md)).
3. Flywheel's statement owns the contract and the record formats.
   flywheel-next's crates implement them once, millpond is built on
   them, and Flywheel's host is later built on the same crates
   ([Who owns what](owners.md)).
4. An inbox is a git repository, or a branch in one, in Flywheel's
   formats. crew's partition branches become inboxes, crew's folders
   and the meeting corpus are imported once, and Flywheel reads the
   same inboxes with no import ([The inbox](inbox.md)).
5. The unit of work is an item, the signals curation joined, one or
   many. millpond sends one item to one worktree. Planning across items
   is crew's planner today and Flywheel's later
   ([Items and sends](items.md)).
6. A Claude session works a backlog through millpond's tools,
   proposing moves in batches the operator accepts or changes. herdr
   shows the counts, reviews a batch and sends an item
   ([Curation and moves](curation.md)).
7. A program lists meetings and a session reads them. eddy holds a part
   per meeting service, its Wispr part an MCP client that starts no
   Claude session. Others publish meeting plugins of their own
   ([Sources](sources.md)).
8. An adapter whose source needs no other tool ships inside millpond.
   One that wraps another tool's domain ships with that tool, so
   headwater's and eddy's parts stay theirs ([Sources](sources.md)).
9. "Plugin" names the installable unit in every host, for what
   Flywheel's statement calls a package and a bundle
   ([Running adapters](running.md)).
10. The release adapter lands through millpond on trial before
    headwater exists, so the contract carries live captures first.
11. sounding is a standalone tool that works one question in one
    session, in a worktree of its own, and ends on a conclusion the
    operator accepts, sends back or drops. millpond sends it an item
    that asks a question, an accepted conclusion is the item's record,
    and only a finding beyond the question comes back as a capture
    ([Items and sends](items.md#a-question-sent-to-a-sounding)).
12. flume is a standalone tool that launches and tracks one agent in
    one worktree through a kind's stages on the host it runs on, taken
    from crew's places and stages. millpond's send, headwater's fix
    key, sounding and crew call it; millpond keeps the item's record
    and flume the live state of each place
    ([Items and sends](items.md#a-send)).

## Held by the design

The capture design's own Open section holds these questions:

- **Acknowledging a dropped release.** A curation drop of a release
  signal could acknowledge the release in headwater, so its plugins
  stop showing it. headwater's ruling 24 says a recorder never
  acknowledges.
- **A package manager in the repository's shell** and headwater 5,
  which says reading a repository changes nothing in it. The commands
  headwater runs only read, but entering a repository's shell can
  write, as devenv writes its lock.
- **Where a cursor lives** when a single-host role moves hosts. A lost
  cursor costs one wider listing, which the dedupe absorbs.
- **Attestation in sluice:** sluice signing the verdict it lands, with
  an executor vouched for from outside the team that ran it.
- **How a repository declares its kinds** and their prompts, and how
  crew's stage prompts move into that form.
- **sounding's own details:** the timebox's length and who sets it, how
  a sounding is named, where its files sit and whether they are
  committed, what parks a sounding and resumes it, what accept and drop
  do to its branch, and the fields an offer's capture carries.
  sounding's statement rules them.
- **A standing sounding**, which stays open and starts a round when a
  signal on its subject lands, as Flywheel's standing elaborations do.
- **Where else an accepted conclusion lives.** A repository may keep it
  in its own record, as crew's kits keep `openspec/explorations/`.
- **crew's two open records disagree.** ADR 0019 rests an elaboration
  on an intent and the `new-territory` move, and `curation-and-agenda`
  leaves intents out and replaces that move with `join`. A sounding
  sent from an item settles both, once crew's record says so.

## The family's storage

Plan step D4 sets every piece of state each tool keeps against
Flywheel's state repository. The aim is that moving from a tool on its
own to crew, and then to Flywheel, moves no data. Its ruling sets the storage
profile millpond's statement names, which covers what
[The inbox](inbox.md) keeps in git and on the host.

## Left to the statement

The capture design names these and leaves their form to millpond's
statement or to flywheel-next's crates:

- the keys of `millpond.toml`, beyond what it holds;
- the item record's format and fields, beyond its signals, brief and
  sends (114);
- the key the meeting file gives a transcript;
- the name a send hands flume for an item, from which flume names the
  branch.
