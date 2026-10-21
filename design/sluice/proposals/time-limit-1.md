# Time limit: a check the limit ended has no outcome

Drafted wording for 66 that tells the checks a run's time limit
ended apart from the checks that ended before it. A check that ended
keeps its outcome. A check the limit ended has none, and sluice records
nothing under its key. Part A amends 66 and gains no clause; the
scenarios gain S55. The operator ratified it on 2026-10-21: its clause
and scenario are in `../requirements.md`, which wins where they differ.

## What it answers

| question | answered by |
|---|---|
| what a check that ended before the limit records | 66: its outcome, under its key (16) |
| what a check the limit ended records | 66: nothing under its key; it has no outcome |
| how the run reads | 66, unchanged: timed out, and failed |
| who is told | 66, 20: the culprit's session, naming each check the limit ended |
| whether the same head lands once the host keeps up | 66, 69: its keys hold no fail from the run the limit ended |

## The problem

66 ends a run that exceeds its time limit with everything it started,
and reads the run as failed. It says nothing of the checks the run held
when the limit came. 16 records every check run on a candidate with its
key and its outcome. A task runner ended by a signal reports the checks
it was running however its handling of the signal leaves them: failed,
when the check's process caught the signal and exited first, and
skipped, when the runner stopped first.

On 2026-10-21 a host under heavy I/O ran a bolt's unit tests for an
hour. The limit ended the run while one test was under two minutes in.
The task runner reported that test failed, sluice recorded the fail
under its key, and the run read timed out. Half an hour later the host
had recovered and the same head ran in a minute; the test passed under
the same key. The key then held a pass and a fail (19), the bolt's
policy reads that as not passed, and the head could land again only if
the operator set the fail aside (116) or a change gave the test new
inputs.

A time limit says how long a run may take. It says nothing of whether a
check the limit ended would have passed.

## What the statement already settles

60 and 114 give a run of a check a third ending besides a pass and a
fail: no outcome, never read as either, and nothing recorded or read
under its key. 115 reads a candidate whose checks could not run as not
passed, "as one whose run its time limit ended is (66)", so the
statement already treats the two endings alike for the candidate. 116
leaves the operator a way to set aside a result sluice should not have
recorded; a fail the time limit produced is one sluice can tell apart
on its own.

## The ruling

> 66. A candidate's checks run under the time limit its branch's policy
>     states. A run that exceeds it is ended with everything it started,
>     recorded as timed out, and read as failed. A check that ended
>     before the limit keeps its outcome. A check the limit ended has
>     none: it is recorded and read under no key (69), and the
>     culprit's session is told it was running when the limit ended the
>     run (20).

The run still reads failed, so a check that never ends fails the entry
that brought it, and that entry's session learns which check the limit
ended (17, 20). What changes is the key. The next candidate that holds
the check runs it again, as it runs any check with no outcome (60), and
a run a slow host ended leaves nothing a later run of the same inputs
has to contradict.

A check ended before the limit when the runner's own record of its end
is from before the limit. sluice reads a check whose end the runner
recorded after the limit, or never recorded, as one the limit ended,
whatever outcome the runner gave it: a runner reports a check its
signal ended as failed or as skipped by the order in which the two
processes stopped.

## For the caller

`sluice submit` on a timed-out run names each test the limit ended,
with its log, and says sluice recorded nothing under its key. On a
slow host, the same head submitted again is tested again; a test that
never ends needs a fix. The operator never sets aside a result for a
run the time limit ended (116), since sluice records none.

## Scenarios

- **S55.** A host under load runs a candidate's checks past its
  branch's time limit. One check passed before the limit; another was
  running when the limit ended the run. The run is recorded as timed
  out, its entry is the culprit, and its session is told the second
  check was running when the limit came. The first check's pass is
  recorded under its key; the second check has no outcome. Once the
  host keeps up, the same head is submitted again, the second check
  passes, and the entry lands (66, 69, 19).

## What it changes elsewhere

- 66 as above. 115's reference to 66 stands.
- sluice: on a run its time limit ended, the moon runner names as left
  without a result each check whose run record is not from before the
  limit, whatever moon reported of it. The core records nothing under
  those checks' keys and names them, with their logs, to the culprit's
  session.
- The site and the plugin's guide: what a timed-out run says, and that
  no result of a run the limit ended needs setting aside.
