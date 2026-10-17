# Open questions

What the design does not settle, and where each question is held. The
chapters rest only on what the statement and the capture design settle.
A question leaves this page when the operator rules: the ruling lands in
the statement, and the chapter that rests on it is rewritten whole.

## How the questions are ruled

A fresh model reconstructed headwater from the statement alone,
`design/headwater/models/reconstruction-1.md`, and asked 32 questions
of it. A 33rd asks whether a source should be called a lookup. Plan
step D1 has the operator rule all 33, into
`design/headwater/models/reconstruction-1-answers.md`, and step H1
writes the rulings into the statement as clauses numbered from 53.

Each question below names the clauses it touches and, where it has one,
the model's lean. The statement's own questions (section 10) sit beside
the questions they belong with; the model answers each in its section
11, and those answers wait on the same ruling.

## What a repository depends on

- **5. A pin, or several.** The vocabulary makes a pin one version or
  unknown, yet a dependency declared at several pins is measured from
  the oldest (3, 4, 7). The ruling decides which holds, and what a
  dependency reports when its declarations mix known and unknown pins,
  or give two pins whose order is undecided. The model: the oldest pin,
  and unknown in both other cases.
- **7. One identity across Package URL types.** One tool can be
  `pkg:cargo/x` through one declaration and `pkg:github/o/x` through a
  watch list, and a GitHub Action may be one type to GitHub releases and
  another to ecosyste.ms (2, C.1, S11). Who maps between them, and which
  identity wins?
- **8. From a declaration to a Package URL.** How do the mise and GitHub
  Actions profiles turn a declaration such as `node = "20"`, or a tool
  with a backend prefix, into a Package URL (C.1, C.2, S11)?
- **17. An unreadable declaration with no identity.** It belongs to no
  tier (1, 13, 16). The model reports it in every answer, apart from the
  tiers, and lets it make no tier due; the ruling may instead keep some
  tier incomplete.
- **29. Uncommitted changes.** How does an asker name an uncommitted
  change as part of a repository state, and may a scan of such a state
  write the held state every checkout shares (28, 31)? The model: it
  may, since what is held is kept per identity and the pins stay with
  each reading.
- **30. What the declarations cover.** Do they include npm's dev, peer
  and optional dependencies, Go's indirect requirements, and Cargo's dev
  and build dependencies and workspace members (C.2)? Does a broken
  lockfile make a dependency unread, or its pin unknown (1, 3)? The
  model: unread.
- **Several projects** (section 10). How does a repository holding
  several projects declare one tier across them, and is a dependency in
  two projects one dependency or two (2, 13)? The model: a tier names
  identities, and one identity is one dependency.

## Releases and what is new

- **9. How a release's version is spelled.** GitHub tags (`v1.2.3`,
  `cli-v1.2.3`) and registry versions (`1.2.3`) spell one release
  differently, and PEP 440 orders `1.0` and `1.0.0` as the same while
  their spellings differ (10, 44, C.3). Whose spelling does a release's
  identity carry?
- **12. Sources that disagree.** Is a release that one source lists and
  another has not seen yet a disagreement, and are different dates or
  withdrawn marks? Whose order decides newness when two sources' orders
  differ (8, 39, 44, 51)? The model: the union, with each source's
  answer shown, and a release undecided where the orders conflict.
- **13. The changelog's precedence.** The changelog profile answers only
  where no release body exists (C.4). When both exist and differ, does
  reading only the release body choose between sources, which (39)
  forbids?
- **22. Prereleases.** No newer release may be left out (8), and a
  release source's answer carries no prerelease mark (43). The model
  reports every newer prerelease, marked where the version's grammar
  says so. The statement asks the same (section 10): are prereleases
  reported only where the pin is one, or where a tier asks for them?
- **23. Withdrawn releases.** Is a withdrawn release one "the source
  publishes" (8, 43)? The model reports it with the source's mark. The
  statement also asks what a report says of a pin whose own release was
  withdrawn (section 10); the model gives the same mark on the pin.

## Tiers and scans

- **2. Which repository state a held answer is for.** Read literally,
  asking what headwater holds returns the newest report for each tier,
  whichever checkout made it, with that checkout's pins (17, 31, 32).
  The model keeps what the sources said in place of reports, derives
  each answer from the asker's own reading, and adds a status for a
  dependency no scan has looked for yet.
- **14. Tiers from several descriptions.** Every dependency description
  answers the tiers (41), the first profile reads them from one file,
  and the watch list carries a tier for each entry (C.2). How do the
  answers combine, and which wins?
- **15. One identity in two tiers.** Every dependency then belongs to
  more than one tier, against (13), and headwater may not choose (14).
  The model makes the tiers unreadable: every dependency is unread for
  that reason, and every tier is due.
- **16. The default tier's cadence, and patterns.** Can the tiers file
  set the default tier's cadence, and can a tier name identities by a
  pattern such as `pkg:npm/@acme/*` (41, C.2)?
- **18. A forced scan that fails within the cadence.** By the
  vocabulary, a named-tier scan that comes out incomplete within the
  cadence of the tier's last complete scan leaves the tier not due; by
  (16) it leaves the tier due. The model follows (16).
- **19. A dependency that is never read.** One that no bound profile
  knows, or whose source always refuses, keeps its tier due for ever,
  and every scan of what is due reaches that tier's sources again (15,
  16, 51). Is that intended?
- **20. Whether notes and advisory sources count.** Does an unreached
  notes or advisory source make a tier incomplete, and does the limit
  to due tiers bind advisory queries (15, 16)? The model answers yes to
  both.
- **Cadence from start or end** (section 10). Is a cadence measured from
  a complete scan's start or its end (15)? The model: from its start,
  since a report knows only as much as its earliest reading.

## Advisories

- **6. Which pin an advisory names.** With several declared pins, does
  an advisory naming any one of them make the dependency affected? Does
  a report also give the advisories that name each newer release, or
  only a brief does (4, 18)? The model: affected if any declared pin is
  named.
- **21. An unreached advisory or notes source.** A release source can
  say it could not be reached (43); a notes source and an advisory
  source cannot (46, 47), so an unreached advisory source reads as no
  advisories. The model adds the outcome, so headwater never reports a
  dependency as unaffected when the truth is unknown.
- **Advisories and cadence** (section 10). Do advisories wait on a
  tier's cadence, or is every pin's advisory looked for at every scan
  (15, 18)? The model: they wait, and authors who want advisories sooner
  put the dependency in a faster tier.

## Acknowledgements

- **24. Who may acknowledge, and how headwater knows.** The actors
  table gives no actor the decision, an acting session is undefined,
  and at its interface headwater cannot tell a person from a recorder
  that asks to acknowledge (20, 24). What identifies who gave one?
- **25. Undoing and conflict.** Can an acknowledgement be withdrawn or
  replaced? What holds when one person dismisses a release and another
  skips it? The model takes the latest. Does a skipped release return
  when the release that would bring it back is itself withdrawn (20,
  21, 24)?
- **Whose acknowledgement** (section 10). Is an acknowledgement each
  person's or the repository's, and does it travel to another host that
  shares the repository (20, 28)? The model: the repository's, as far as
  the store reaches.
- **A curation drop** (`design/capture/design.md`). A curation drop of a
  release signal could acknowledge the release in headwater, so its
  plugins stop showing it, though a recorder never writes headwater's
  state.

## Briefs and fixers

- **26. What a brief covers.** Only the target release's notes, or
  every release between the pin and the target, which a fixer moving
  several releases needs? What does asking for a brief of a release no
  report holds return (25)? The model refuses.
- **27. A part of the notes, and the way to the rest.** What part may an
  asker ask for, and what is the way to read the whole once the held
  notes are discarded, when asking what headwater holds may reach no
  source (12, 17, 25)? The model: the way is a brief.

## The held state

- **1. What a repository is.** The vocabulary defines a repository
  state and no repository (28, 48, 50, C.6). Read as one clone, one git
  common directory, the first store satisfies (28) and (50); read as
  every clone of one origin across hosts, no profile does. The model:
  one git common directory.
- **28. Whether a rebuild assumes the sources stood still.** If
  upstream edited notes, withdrew a release or published one between
  scans, the rebuilt report differs in more than its times, and after a
  discard every tier is due (11, 29, S9). Are notes read again at every
  scan, as the model does, or kept once?
- **31. What "one or the other" means.** Do two scans at once end as if
  run one after the other, the second written onto the first, as the
  model does (30, 49)? Or does one scan's result stand whole, with the
  other's discarded?
- **Several hosts** (section 10). Where does the held state live when
  several hosts share one repository (28, 50)? Under the first store
  each clone has its own, and one held state across hosts needs a store
  every host reaches.

## The core and its seams

- **4. Who binds the profiles.** If the binding sits in the repository
  state, the authors choose sources, which the actors table does not
  give them; if it is the operator's, the answer depends on it (32, 51).
  The model: the operator's configuration, outside the repository, named
  in every answer.
- **11. A dependency's source repository.** GitHub releases and both
  notes profiles need the dependency's source repository, which another
  profile or a declaration supplies (C.3, C.4). Part B's operations take
  only an identity and a version (43, 46).
- **32. Whether (37) can be checked.** Only against recorded requests. A
  batched query shows a source many of a repository's dependencies at
  once, and the asker's credentials identify the asker. Is either
  "something of the repository"?
- **33. Source or lookup.** The capture design calls what the statement
  calls a source a lookup. Until the ruling lands in the statement, the
  book keeps the statement's word.

## Askers and surfaces

- **3. What else an answer depends on.** An answer depends on more than
  the repository state and the held state (32). It also depends on the
  binding, the clock, headwater's own version and the asker's
  credentials. A private source that one asker reaches and another does
  not changes what the second asker's scan writes. Which of these may
  change an answer (38, 45, 51)?
- **The questions a surface asks.** The core's questions and their
  names come with the rulings. The model names `held`, `scan`, `brief`,
  `acknowledge`, `acknowledgements` and `forget`; plan step H4 names
  `scan`, `notes`, `brief`, `ack` and `overview`.

## Releases as captures

- **Into the statement.** Plan step H1 writes three things in after D1
  and D2: the key a watch-list entry gets, the claims on a watch-list
  entry, and that the Flywheel plugin prints the capture contract. Until
  then the chapter describes `design/capture/design.md`.
- **The capture design's decisions.** Plan step D2 has the operator
  accept or change the design's decisions. Two of them place headwater:
  it is for dependencies and eddy for meetings, and an adapter that
  wraps another tool's domain ships with that tool.

## The watch list

- **10. An order that depends on the watch list.** GitHub releases
  orders tags by the watch list's tag pattern, and compares calendar
  versions where a watch list says so (C.3). Yet the order takes only an
  identity and two versions, and the listing only an identity (6, 43,
  44). A change to the watch list at another commit would
  change the order, against (45), and the authors never decide that a
  release is older than it is.
- **Claims.** A watch-list entry's claims, the files a bump moves,
  enter the statement in step H1 with its key. Questions 7, 8 and 14
  bear on the watch list too.
