# Answers to the reconstruction's questions

A fresh model, given only the statement, designed headwater
(`reconstruction-1.md`) and asked 32 questions where the statement was
silent or contradicted itself. A 33rd asks what to call the services
headwater asks, since Flywheel and millpond use "source" for what an
adapter reads. Below, the answer to each and to the statement's own seven
questions, in plain words, as the operator ruled them on 2026-10-19:
every one as `rulings.html` recommends. Each is a clause, a vocabulary
entry or a Part C row of the statement, named beside it.

## Repository, held state and answers

**1. What is "a repository": one clone, or every clone on every host?**
The checkouts that share one held state. Under the git-directory store
that is one clone and its worktrees. Sharing a held state across hosts
waits for a later store profile, as sluice's shared records do, and
stays a question in §10. The vocabulary defines *repository*, and C.6
says a repository is one clone.

**2. Whose repository state does "what headwater holds" answer for, when
checkouts sit at different commits?**
The asker's own, read against what each lookup last answered, as the
model designed it. A dependency no scan has looked for yet is reported
as not yet looked for (17, and *report* in the vocabulary).

**3. An answer also depends on the binding, the asker's credentials, the
clock and headwater's version.**
An answer depends on the repository state, the held state, the binding,
the time and headwater's version, and never on who asks (32). A failed
lookup never erases what a lookup answered before: the held state keeps
the last answer and its time beside the failure, and every report gives
both (64).

**4. Who binds the profiles, and where is the binding read from?**
The repository's authors, in the repository beside the tiers. Where the
repository binds nothing for a seam, every profile that recognises one
of its declarations is bound. Credentials stay the asker's. The authors'
row gives them "which lookups to ask", the tiers declaration answers
**read-binding** (67), and 51 says where the binding comes from.

**28. Do 29 and S9 assume the lookups did not change between scans?**
Yes: S9 compares against the same lookup answers, and 29 and S9 say
so. Notes are read again at each scan of a tier, so upstream's edits
arrive (54).

**29. How are uncommitted changes named, and may a scan of a changed
checkout write?**
A repository state is the checkout as it stands, committed or not, and
every report names its commit and whether it holds uncommitted changes
(31). A scan of a changed checkout writes the held state like any other,
since what headwater keeps is per identity, release and lookup, never
per repository state (63).

**31. What does "as one or the other would have left it" mean for two
scans at once?**
As if one ran after the other: each lookup's answer kept for what it
answers for, the later one winning, and every acknowledgement untouched
(30).

## Pins and identity

**5. The vocabulary's pin is unknown without a single version, but 4
gives a dependency several pins.**
A pin belongs to a declaration. A dependency's pin is the oldest of its
declarations' pins, and unknown when any of them is unknown or two of
them cannot be ordered (*pin* in the vocabulary, and 4).

**6. Which pin does an advisory have to name, and are advisories on
newer releases given?**
A dependency is affected when an advisory names any of its declared pins
(18). A brief also gives every advisory that names the release it moves
to, so a fixer never moves onto a known bad version (26).

**7. One identity per dependency, yet one tool can be `pkg:cargo/x` and
`pkg:github/o/x`.**
The identity is the name the declaration's own ecosystem gives. The same
software published through two ecosystems is two dependencies, with two
lines of versions. A lookup that calls a dependency by another name maps
it to that name and answers for the identity (2).

**8. How do mise tools and Actions become Package URLs?**
A mise tool on a GitHub backend, and every Action, is
`pkg:github/<owner>/<repo>`. A mise core tool maps to its upstream's
GitHub repository. A watch-list entry names its Package URL outright.
C.2 gives the table.

**9. How is a release's version spelled: `v1.2.3` or `1.2.3`, PEP 440's
`1.0` or `1.0.0`?**
In the ecosystem's normal form: PEP 440 normalised, Semantic Versioning
without a `v`. A tag's prefix comes off by the declared tag scheme, and
the tag stays as the link (10, and C.1).

**10. C.3 orders tags by the watch list's pattern, but order takes no
repository input, and authors may not decide order.**
Authors may declare how a dependency's tags spell its versions, never
which of two versions is newer. Listing and order take the identity with
its declared tag scheme, and the order holds per scheme (the authors'
row, *tag scheme* in the vocabulary, and 43 to 45).

**11. Part B never carries a dependency's upstream repository, yet GitHub
releases and both notes profiles need one.**
The release lookup has **locate**: given an identity, where upstream
keeps its releases and notes, or unknown (68). A declaration may state
it too (40), and **read-notes** takes its answer (46).

**30. What do the declarations cover: dev, peer, optional, indirect? Is
a broken lockfile unread or unknown?**
Direct dependencies only: npm's dependencies, dev and optional ones, but
not peer ones; Python's project dependencies and groups; Cargo's normal,
dev and build dependencies of every member; Go requirements not marked
indirect. A lockfile that will not parse makes its dependencies unread.
C.2 says so.

## Lookups and what they say

**12. What counts as two lookups disagreeing, and whose order wins?**
A release one lookup lists and another does not list yet is no
disagreement: lookups lag. Releases merge by identity, each carrying
every lookup's account of it. Where two orders differ, the release is
undecided, with both (39).

**13. Does C.4's changelog, read only where no release body exists,
choose between lookups?**
No. The changelog declines where a release body exists, so only one
lookup answers. A repository that binds both to answer always gets both,
each named. headwater never chooses between answers it received (39, and
C.4).

**20. Do the notes and advisory lookups count toward a complete scan?**
Release and advisory lookups count; notes lookups do not (*complete* in
the vocabulary). A release with unread notes is still reported, and its
notes are read again at the next scan of its tier or by a brief (55).

**21. The notes and advisory reads have no "could not be reached".**
Both have it (46, 47). An unreached advisory lookup makes the
dependency's advisories unread, never "not affected" (18).

**22. A report holds every newer release (8), which leaves no room to
hold back a prerelease, so both of §10's options break it.**
A report holds a newer prerelease only where the pin is a prerelease or
the dependency's tier asks for prereleases (8, 41). A listing carries
the lookup's own prerelease mark, and where it gives none, the version
grammar's (43, and *prerelease* in the vocabulary).

**23. Is a withdrawn release one "the lookup publishes"?**
Yes, with the lookup's withdrawn mark, on a newer release and on the pin
alike. A withdrawn pin is a reason to move, so it shows (8).

**32. Can "a lookup learns nothing but identities and versions" be
checked, given batching and credentials?**
It is checked on recorded requests in the conformance suite. Asking
about many identities at once is allowed. The asker's own credentials
identify the asker by the asker's choice, which is nothing of the
repository (37). Hiding the asker from a lookup is a non-goal.

## Tiers and cadence

**14. Every dependency description reads tiers, yet C.2 has one tiers
file and the watch list a tier column.**
Tiers come from one place only, the tiers declaration. **read-tiers**
is a seam of its own, B.2, and exactly one tiers declaration is read
(51). The watch list has no tier column and is a dependency description
only. C.7 is the tiers declaration's profile.

**15. What happens when two tiers name one identity?**
That dependency is reported unread, naming both tiers, and both tiers
stay due. Every other dependency is reported as usual, and headwater
never picks (57, and 13).

**16. What is the default tier's cadence when a tiers file exists, and
can a tier name identities by pattern?**
The tiers declaration may set the default tier's cadence, seven days
when it does not (41, and C.7). A tier may name identities by a prefix.
A tier that names an identity outright beats one that names it by a
prefix, and two prefixes that both name it are question 15 (57).

**17. Where does a declaration go whose identity cannot be read?**
Into every answer, apart from the tiers. It makes no tier due: scanning
again cannot fix it, and changing the repository can (1).

**18. The vocabulary's *due* and 16 disagree after an incomplete scan
of a named tier.**
A tier is due when it was never scanned, when its newest scan was
incomplete, or when its cadence has passed since its last complete scan
(*due* in the vocabulary).

**19. A dependency no lookup can ever read keeps its tier due for ever.**
A dependency no bound release lookup knows is reported as known to no
lookup, and does not count against completeness (58, and *complete* in
the vocabulary). A lookup that fails does count, until it answers.

## Acknowledgements, briefs and notes

**24. Who may acknowledge, and how does headwater know who?**
Only an explicit request that names who gives it, the asker's git
identity by default. headwater records the name and never authenticates
it (20). The operator decides which releases are dismissed or skipped,
in their own word or through a person or session they let act for them.
A recorder never acknowledges (the operator's and the recorder's rows).

**25. Can an acknowledgement be undone, or conflict with another?**
A later acknowledgement may withdraw an earlier one, and all stay
readable. The latest for a release decides (60). A skip comes back only
when a newer release that is not withdrawn is listed (21).

**26. What does a brief cover, and what of a release no report holds?**
The target's notes and the notes of every release between the pin and
the target, since a fixer crossing several releases needs each breaking
change (*brief* in the vocabulary). A release no report holds, with
acknowledgements set aside, gets no brief (25).

**27. What "part" of notes may an asker take, and what is the way to
read the whole?**
A leading portion of the size the asker asks for, cut back to the end of
a line. The way to the whole is a brief, which may reach the notes
lookup (12).

## A word shared with Flywheel

**33. The statement calls deps.dev, GitHub, ecosyste.ms and OSV
sources, and Flywheel calls a source what an adapter captures from.**
headwater's are lookups: a lookup is anything headwater asks for an
identity's releases, notes or advisories. "Source" stays Flywheel's and
millpond's, and to them headwater as a whole is one source among many.
The statement says lookup throughout, and Part B's operations keep their
names.

## The statement's own seven questions

**§1. Prereleases.** As question 22 (8).

**§2. Withdrawn releases and pins.** As question 23 (8).

**§3. Do advisories wait on a tier's cadence?** No. Every scan reads the
advisories of every known pin, whatever tier is due (59), and the limit
to due tiers binds release lookups only (15). It is one batched query,
and an advisory on what runs matters more than a release.

**§4. Whose is an acknowledgement?** The repository's: each person's
would make an answer depend on who asks. It holds for every asker and
travels as far as the store reaches (61).

**§5. Held state across hosts.** As question 1: a later store profile,
which is §10's one question.

**§6. Several projects in one repository.** One identity in two projects
is one dependency, with every declaration and its pin (2). A tier names
it once for all of them.

**§7. Is a cadence measured from a scan's start or its end?** From its
start: a report knows no more than its earliest lookup (*due* in the
vocabulary).

## Written in with the rulings

The capture design's step H1 adds these to the statement, with the
clauses after 52:

- each release marked inside or outside the range each declaration gives
  (56), the range carried by the dependency description (40);
- a declaration's claims, the other places a move changes, in every
  brief (26, 40);
- a declaration's label, which every answer gives beside the identity
  (53), and the key a watch-list entry's capture gets (§9);
- the Flywheel plugin as the adapter millpond runs, built with the
  family's shared crates, printing the capture contract (§9);
- each ecosystem's package manager as a lookup, run read-only in the
  repository's own shell, with deps.dev where none runs (65, and C.3);
- a brief naming the move as the ecosystem spells it (27, 66, and C.2),
  and carrying what the published package changed between the pin and
  the release (62, 69, and C.4).

The family's storage rulings set C.6 and C.7. A repository is one clone,
and its held state and acknowledgements stay in the clone's git
directory. A fleet dismisses a release with a curation drop, never an
acknowledgement. A repository declares itself to headwater in
`.config/headwater.toml`.
