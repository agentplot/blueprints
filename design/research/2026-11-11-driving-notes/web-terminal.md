# Boom Drive Cloud: web terminal

## Goal
Web-based terminal in Boom Drive Cloud that tunnels back to the running multiplexer on a host.

## Herdr vs Rex
- **Herdr**: original plan; mirrors the multiplexer's screen.
- **Rex**: different model — each client receives raw PTY bytes and runs its own emulator. A web terminal is just another Rex client: tunnel to the server, subscribe to a block's output, render with xterm.js or libghostty compiled to WebAssembly. Each viewer gets its own scrollback and sizing.

## Unknowns
- Whether Rex's client streaming protocol is documented like the server API, or would need to be reverse-engineered from the CLI.
- Superlogical has announced web access with live sharing. The Rex side may not need building at all — possibly just tunnel to their web client.

## Recommendation
Treat the web terminal as a seam: a Herdr implementation and a Rex implementation. Build Herdr's now; wait to see what Rex ships before writing the Rex side. Tunnel via the `boomdrive` runner (consistent with "cloud reaches hosts only through the runner").
