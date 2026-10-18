# Open questions

What the design does not settle, and where each question is held. A
question leaves this page when it is ruled; the ruling lands in the
record that holds it, and the chapter that rests on it is rewritten
whole.

## Awaiting a ruling

The capture design's decisions await the operator's ruling, plan step
D2 in `design/capture/plan.md`. Two of them are eddy's. A program lists
meetings and a session reads them: eddy holds a part per meeting
service, its Wispr part an MCP client that starts no Claude session,
and others publish meeting plugins of their own. An adapter that wraps
another tool's domain ships with that tool, so eddy's parts stay
eddy's. A third reaches a meeting's signals downstream: an item that
asks a question goes to a sounding, whose accepted conclusion is the
item's record. Until they are ruled, every chapter describes a design, and no
statement stands behind it.

## Held for eddy's statement

eddy has no statement of invariants yet. It is to come, written from
the capture design and reconstructed as headwater's was, and the book
then includes it as an appendix by anchor, as sluice's book does. Each question below
is the statement's to settle.

- **What a cursor marks.** A service makes a transcript some time after
  its meeting ends. A cursor at the newest meeting's start passes over
  a meeting whose transcript was not ready when the part listed it. A
  cursor at when the service made each transcript available does not,
  and neither does a listing whose window overlaps the last, since
  millpond's dedupe makes an overlap free.
- **A failed fetch and the cursor.** A run that ends in `done` advances
  its cursor even when it names failed meetings. A part whose cursor
  passes a meeting it failed to fetch never lists that meeting again.
  The lean is a cursor that stops before the run's earliest failure.
- **The meeting's own id.** A service may give every occurrence of a
  recurring meeting one id, and a transcript an id of its own. The key
  needs the id of the one recorded occurrence, and `teams` and `webex`
  each name which id that is. An id holding a `/` becomes one segment
  of the key.
- **Where length and attendees travel.** The contract gives them no
  field. They travel in the raw files, as a header of the plain copy
  or a file of their own, or in a field Flywheel's statement adds to
  the capture.
- **How short is too short.** The length below which a part skips a
  meeting, whether it is part configuration, and whether a skipped
  meeting counts in the `done` line's `listed`.
- **The raw files' names and the plain copy's line.** The two files'
  names, and what one line of the plain copy holds: its time, its
  speaker and its words. `transcript.json` and `turns.txt` in
  [Running a part](contract.md) stand in until the statement names
  them.
- **The command's name.** [Running a part](contract.md) uses
  `eddy capture <service>`, after headwater's `headwater capture`.
- **What a part's configuration holds.** Whatever `CAPTURE_CONFIG`
  names for a meeting part beyond the sign-in: an account, the skip's
  length, the generic part's endpoint.
- **A sign-in nearing its end.** A fleet's doctor warns as a part's
  sign-in nears its end (plan step S5). The contract has no line for a
  sign-in's health, so the part reports it through its run's status,
  a command of its own, or a field the contract gains.

## Held for the conformance pack

flywheel-next publishes the pack with its meeting checks (plan step
F2). Which checks those are is the pack's to say. The design implies
the shared parts of a meeting capture: the key's shape, `source`
`meeting`, `event_at` at the meeting's start, no excerpt, and the raw
layout.

## Held for the contribution model

- **Where the generic MCP part ships, and how it keys.** eddy's
  Flywheel plugin is the home that fits the rule that a part wrapping a
  tool's domain ships with that tool. Its key's service segment comes
  from the endpoint its configuration names.
- **Whether eddy publishes its shared code.** A published part depends
  on flywheel-next's capture crate. It gets eddy's key shape, raw
  layout and skip only if eddy publishes them as a library, and
  otherwise writes its own to pass the meeting checks.

## Held by the capture design

The capture design's own open section holds one question that reaches
eddy's parts: **where a cursor lives** when a single-host role moves
hosts. A lost cursor costs one wider listing, which the dedupe absorbs.

## Held for the first run

The meeting corpus already read is imported once into its inbox, keyed
by its folders' names (plan step E2,
[what comes in once](../millpond/inbox.html#what-comes-in-once)). A meeting in that corpus that a
part lists again gets a second capture under eddy's key. The part's
first cursor can start where the corpus ends, or a reader can join the
two as a meeting recorded twice. Which of those holds is for the step
that first runs eddy on a fleet (plan step S5).
