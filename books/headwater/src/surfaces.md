# Askers and surfaces

An asker is whoever asks headwater about a repository: a person, a
coding agent, a surface, a recorder or a scheduler. It decides which
repository and which tiers to ask about, and when. It never changes an
answer by who it is, and never supplies a release or a version order
(section 2). A surface is one way an asker reaches headwater.

## One core, one answer

The same question about the same repository state and the same held
state gets the same answer, whoever asks and through whichever surface
(32). Every surface answers from one core, and no surface computes a
report, a brief, a due tier or an acknowledgement of its own (33).
Nothing headwater reports depends on which surface asked, which
recorder will keep it, or which fixer will act on it, and headwater
needs none of them to answer (34).

Every answer has one form a program reads, the same through every
surface, and that form only ever gains fields (35). A program written
against an early answer keeps reading every later one. The form is
JSON, given on request (section 9).

<figure class="hw">
<div class="hw-scroll">
<svg viewBox="0 0 800 284" role="img" aria-label="Four surfaces, the command line, the Claude Code plugin, the herdr plugin and the Flywheel plugin, each ask one core, which alone computes reports, briefs, due tiers and acknowledgements. The core gives one answer form, JSON that only gains fields, and the same question about the same repository state gets the same answer through every surface.">
<defs>
<marker id="hw-u-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hw-hd"/></marker>
<marker id="hw-u-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hw-hd-a"/></marker>
</defs>
<text x="16" y="24" class="hw-th">SURFACES</text>
<rect x="16" y="36" width="180" height="60" rx="8" class="hw-bx"/>
<text x="28" y="60" class="hw-t">command line</text>
<text x="28" y="80" class="hw-s">a person, a script</text>
<rect x="214" y="36" width="180" height="60" rx="8" class="hw-bx"/>
<text x="226" y="60" class="hw-t">Claude Code plugin</text>
<text x="226" y="80" class="hw-s">at a session's start</text>
<rect x="412" y="36" width="180" height="60" rx="8" class="hw-bx"/>
<text x="424" y="60" class="hw-t">herdr plugin</text>
<text x="424" y="80" class="hw-s">sidebar, popup and key</text>
<rect x="610" y="36" width="174" height="60" rx="8" class="hw-bx"/>
<text x="622" y="60" class="hw-t">Flywheel plugin</text>
<text x="622" y="80" class="hw-s">an adapter part</text>
<line x1="106" y1="96" x2="296" y2="136" class="hw-ar" marker-end="url(#hw-u-m)"/>
<line x1="304" y1="96" x2="362" y2="136" class="hw-ar" marker-end="url(#hw-u-m)"/>
<line x1="502" y1="96" x2="440" y2="136" class="hw-ar" marker-end="url(#hw-u-m)"/>
<line x1="697" y1="96" x2="504" y2="136" class="hw-ar" marker-end="url(#hw-u-m)"/>
<text x="16" y="166" class="hw-s">same question, same state:</text>
<text x="16" y="184" class="hw-s">the same answer (32)</text>
<rect x="200" y="140" width="400" height="58" rx="8" class="hw-bx-a"/>
<text x="216" y="164" class="hw-h">one core</text>
<text x="216" y="186" class="hw-s">reports, briefs, due tiers, acknowledgements (33)</text>
<line x1="400" y1="198" x2="400" y2="223" class="hw-ar-a" marker-end="url(#hw-u-a)"/>
<rect x="200" y="228" width="400" height="40" rx="8" class="hw-bx"/>
<text x="216" y="253" class="hw-t">one answer form</text>
<text x="350" y="253" class="hw-s">JSON that only gains fields (35)</text>
</svg>
</div>
<figcaption>Every surface asks the one core and reads the one form. A person at the command line, an agent in its session and a pane in its sidebar, asking about one repository state, read the same report (S12).</figcaption>
</figure>

## The four surfaces

The Claude Code, herdr and Flywheel surfaces are plugins kept outside
the core, as sluice keeps its plugins (section 9), one per host under
`plugins/` beside the core, `plugins/claude`, `plugins/herdr` and
`plugins/flywheel` (`design/capture/design.md`).

- **The command line** answers any question a person or a script asks,
  rendered for reading or as JSON.
- **The Claude Code plugin** notes new releases at a session's start,
  and hands a release to a background agent in a worktree of its own. A
  colleague who opens a session in a repository is told of the newer
  releases in its favorites tier, with their notes, and nothing in the
  repository changes (S1).
- **The herdr plugin** gives a sidebar row, a popup, and a key that
  hands a release to a new agent in a worktree. A sidebar that asks
  what headwater holds reaches no source however often it redraws
  (17). Where sounding is installed, another key opens a sounding on a
  release that needs judgment (`design/capture/design.md`).
- **The Flywheel plugin** holds one part, an adapter that turns each
  release into a capture ([Releases as captures](captures.md)).

## Telling

headwater tells nobody on its own (section 8). A surface tells, when its
asker asks: the Claude Code plugin at a session's start, the herdr
plugin when its pane is drawn, the Flywheel plugin's adapter when
millpond runs it. A scheduler is an asker like any other.

## Handing a release on

A surface may hand a brief to a fixer, and the change the fixer makes is
the fixer's (36). headwater itself never acts on a release.

In a repository crew runs, the herdr plugin's key hands the release to
millpond as a capture and starts no agent outside crew's plan
([Releases as captures](captures.md#in-a-repository-crew-runs)).

Where sounding is installed, a release that needs judgment can go from
the herdr plugin's key to a [sounding](../sounding/setups.html) instead,
such as a major version or notes that announce breaking changes. The
release's brief is the sounding's source. The plugin hands a brief on,
as any surface may (36). The sounding works the release as one
question in a worktree of its own and ends on a conclusion the operator
decides ([Deciding a conclusion](../sounding/deciding.html)).
The person at the key decides which release needs judgment: headwater
judges no release (11) and acts on none (36)
(`design/capture/design.md`).

Still to rule: question 3 and the names of the questions a surface
asks, in [Open questions](open.md#askers-and-surfaces).
