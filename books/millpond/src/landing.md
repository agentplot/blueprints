# Landing a capture

millpond takes every capture line through the same seven steps, whether
it arrived through `millpond land` or `millpond run`. The steps are the
plumbing every source shares, so no adapter repeats them.

1. **Check it.** A line with a bad key, a missing field or an excerpt
   with no text is refused and named in the run. The rest are taken.
2. **Look up the key** in every capture the inbox holds. A key already
   held is passed over and counted.
3. **Bank the raw files** in the host's raw bank, under the capture's
   name. Raw material never enters git (111).
4. **Write the capture** with a pointer of the form `<host>:<path>`
   (217h).
5. **Write the one signal** of a capture that carries an excerpt.
   millpond cuts the text at a line under the inbox's limit and closes
   it with a line saying how many lines and bytes the raw record holds
   beyond the cut (`signals.6`, `inputs.6`).
6. **Mark the capture unread** when it carries no excerpt, which
   charges a reader.
7. **Record the run:** its counts, its failures, its cursor, and the
   status a fleet's doctor reads from `millpond status --json`.

## A refused line

A refusal costs one line. millpond names the refused line and why in
the run's status and takes every other line of the run. An adapter that
prints one malformed capture among fifty lands forty-nine, and the
fleet sees the fiftieth by name.

## A capture landed twice

Step 2 makes landing idempotent. A key reaches millpond twice when a
run lists a window again, when a second host reports the same event,
or when a run is caught up after the host slept. Each time, millpond
writes nothing for a key the inbox already holds and counts the key as
passed over. The lookup covers every capture the inbox holds, which is
why the work that predates an inbox is imported into it once (see
[The inbox](inbox.md#what-comes-in-once)): after the import, the dedupe
looks in one place.

## The cut

The cut keeps a signal small enough to enter git and to read in a
list, and keeps the whole within reach. millpond cuts the excerpt's
text at a line, never mid-line, under the inbox's limit, which is 8 KiB
unless the inbox's settings say otherwise. The closing line tells a
reader how much of the raw record lies past the cut, and the capture's
pointer leads to it (`signals.6`, `inputs.6`).

The text a signal keeps is the start of the source's own words,
unchanged. No model summarizes or rewords an excerpt on the way in.

## A pointer

The pointer names the host that banked the raw files and the path
under its raw bank, as `<host>:<path>`. A capture is read wherever its
inbox is checked out, so the pointer says which host holds its material
(217h). A raw bank lost with its host costs the material, never the
record: the capture and its signals stay in git.

## The run's status

`millpond status --json` reports, per part and per host, the last run's
exit, its counts, each failed item with what failed and why, the tail
of its standard error, and its cursor. A fleet's doctor reads it to
show a row per part, naming each failed item.
