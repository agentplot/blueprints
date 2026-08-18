# Question: does an agent respond against its work item by ID?

- **State:** closed → decisions/message-envelopes.md · sessions/2026-08-07-loop-layer/
- **Raised by:** code review 2026-08-07 finding 14; operator feedback D3
- **Blocks:** assertions/message-envelopes.md — it is that assertion's header

## The question
When an agent reports back, does the message carry the identifier of the
work item it is about, so the receiver can route it without reading prose?

## What turns on it
Whether an envelope has a machine-readable header or is only a shaped
document. With per-proposal registry files, an ID is what a dynamic
workflow would key on; without one, routing stays a reading task.

## What is already known
It is the same question as what an envelope carries in its header, so it is
answered with the envelopes or not at all. The proposal state ladder
(`to-spec → specced → in-review → approved → building → built → verified →
merged`) exists only in the bolt schema and OpenSpec has no notion of it;
what no document states is which messages move an item along it and what
actions a conductor may take in response.
→ decisions/message-envelopes.md · decisions/a-bolt-bounds-a-delivery.md
