# Acknowledgements

The pin alone decides what is new (9), so a release a repository will
never take stays in every report until something leaves it out. An
acknowledgement does that: a person's word, or an acting session's, on
one release of one dependency.

## Dismissed and skipped

An acknowledgement is one of two kinds.

- A **dismissed** release is left out of reports (21).
- A **skipped** release is left out until a release newer than it is
  published. headwater then reports that newer release with the skipped
  one beside it (21). A person who skipped a release sees it again when
  its successor arrives, next to what replaced it.

## Who gives one

An acknowledgement is only ever given by a person or an acting session,
for one release of one dependency (20). headwater never infers one, and
never gives one when a pin moves. A recorder never writes headwater's
state (section 2), so a program that keeps what it hears gives no
acknowledgement either.

Every acknowledgement names who gave it and when, and stays readable
after the release it acknowledges leaves every report (24).
Acknowledgements are the one part of the held state that no scan can
rebuild (29), because only a person or an acting session can give them.

## What it never touches

An acknowledgement never changes a pin, a version order or an advisory
(22). It decides which releases a report shows, and nothing else. An
asker may always ask for a report that disregards every
acknowledgement, and gets the report the pins alone decide (23).

## Over time

One dependency, `pkg:pypi/acme-client`, pinned at 3.1.0, with an
advisory ADV-1 that names 3.1.0:

| step | what happens | reported as newer | ADV-1 |
|---|---|---|---|
| 1 | a scan | 3.2.0, 3.3.1 | affected |
| 2 | a person dismisses 3.2.0 | 3.3.1 | affected |
| 3 | a person skips 3.3.1 | none | affected (22) |
| 4 | upstream publishes 3.4.0; a scan | 3.4.0, with 3.3.1 beside it as skipped | affected |
| 5 | a fixer moves the pin to 3.4.0, the change lands; a scan | none | not affected: it does not name 3.4.0 |

At every step a report that disregards acknowledgements shows every
release newer than the pin (23). After step 5 both acknowledgements
stay readable (24), and the pin's move neither gave nor removed one
(20, S4). The advisory stood through steps 2 to 4, though a person had
dismissed the release that would fix it (S10).

Still to rule: questions 24 and 25, the statement's own question on
whose acknowledgement it is, and whether a curation drop acknowledges,
in [Open questions](open.md#acknowledgements).
