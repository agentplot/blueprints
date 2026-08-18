# Decision: the standing singleton is called dispatch

## Decision
The standing singleton is **dispatch**. The agent profile is
`flywheel-dispatch`, the herdr agent name is `dispatch`, and the skill
section that steers it is "Dispatch — raw idea → the right place, and the
relay in both directions". The name replaces `intake` everywhere it
appears: the profile file, the `flywheel-inception` skill, the end-to-end
scripts, and the agent-name convention that sits beside `intent-<slug>`
and `bolt-<slug>`.

The name is chosen for what the actor does outbound. It starts intent
conductors on the operator's word, prompts running conductors, and drops
requests into a parked change's `inbox/` — every path out of the singleton
is a dispatch. Triage names only the sorting half, and the sorting is the
cheap half; routing is the work.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/authoring-capabilities.md` and
  `conducting.md` (both to be rewritten)
- Produced by: the operator's word, given directly to this conductor when
  the name was put to him with `Triage`, `Switchboard`, and `Dispatch` as
  the candidates. `decisions/bridged-singleton.md` had left the name open —
  "Triage" was recorded there as a suggestion and explicitly not his word.
- The question was worth asking before the rewrites rather than after: the
  name appears in the profile, both skills, and the end-to-end scripts, so
  every one of those edits would have been done twice.

## Consequences
- The `flywheel-intake` profile becomes `flywheel-dispatch`, and the
  `flywheel-inception` skill's intake section is retitled and rewritten to
  carry both halves — routing raw ideas, and relaying inner-loop
  escalations to the operator and answers back.
- The end-to-end scripts are already written to the destination name, so
  the profile rename lands before either run starts or §1's first command
  fails. Noted on both session READMEs.
- "Dispatch" collides mildly with job-queue vocabulary, so the chapters say
  *dispatch* the actor, never *dispatching* the verb, when a sentence could
  be read either way.
- Unblocks the `conducting.md` / `authoring-capabilities.md` writeback,
  which was held on the name.
- Rests on `decisions/bridged-singleton.md`, which established that the
  actor is no longer named for intake.
