# Assertion: openspec-devportal's place is settled

- **Repo:** willdan-marketplace
- **State:** open — deferred, asked and left standing
- **Raised by:** bolt-flywheel-machinery, out of its marketplace spec round

## The claim
Either `openspec-devportal` is wired into the bolt loop or it is retired.

## Why
It loses its only in-flow caller when `openspec-construction` retires, but
its input — `openspec/changes/*` — is something bolts keep producing, and it
works standalone.

## Boundaries
Neither wired nor retired today; this records the question, not a lean.
