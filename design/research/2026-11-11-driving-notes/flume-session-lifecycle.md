# Flume: session lifecycle, auto-suspend, account pools

## Problem
Places (coding pipelines and open-ended exploration/design/research sessions) currently live forever in Herdr until manually closed. Want: sessions that can be shut down and reactivated any time, visible and controllable from the Boom Drive Cloud UI, with **auto-suspend**.

## Core idea
The terminal is disposable; the session is not. Claude Code persists the conversation to disk and can resume by session ID, and the worktree stays on disk. A live block is a cache Flume can rebuild.

## Session states
- **live** — has a block/pane; block ID recorded.
- **dormant** — no terminal; fully resumable.
- **closed** — finished; archived.

Session record (owned by Flume): agent kind, conversation/session ID, working dir / worktree, position in the place's state machine, account-pool assignment, **a copy of the transcript**. Block ID only while live.

## Operations
- **Suspend**: wait for OSC 7501 `idle`/`done` (never kill mid-turn) → archive transcript → close block → mark dormant.
- **Resume**: restore transcript into place → launch agent with its resume command in the right dir (`rex run` / Herdr equivalent) → record new block ID → continue the state machine.
- Works on both Herdr and Rex; does not depend on Rex shipping native agent restore.

## Policy (Flume-owned, per place type)
- Coding places: suspend automatically when the pipeline reaches archive.
- Exploration/research places: **auto-suspend** after an idle period.
- Cloud UI = list of sessions with wake/sleep, regardless of whether anything is running.

## Transcript ownership
- Claude Code purges old transcripts (`cleanupPeriodDays`; default believed to be 30 days). Cleanup runs at startup against whatever config dir is in use.
- Mitigations:
  1. Each pool account gets a Flume-owned config dir; agents launch with `CLAUDE_CONFIG_DIR` pointing there.
  2. Flume writes that dir's settings with a very high `cleanupPeriodDays`.
  3. Flume archives each transcript into its own store on suspend, so dormancy never depends on Claude Code's cleanup.
- **(unverified)** No known flag to resume from an arbitrary file path; `--resume` takes an ID and looks under `<config>/projects/<path-keyed-by-cwd>/`. So Flume copies (or symlinks) the transcript back into place before resuming. Check `claude --help` on the current version.

## Account pools
- Places are pinned to a pool; a subscription in the pool can expire mid-run.
- **(unverified)** Transcripts are plain JSONL not tied to the subscription. Moving a session = copy the JSONL into the other account's config dir under the same cwd key, then resume there. Same approach barbasol-can uses for cross-host moves.
- Resuming on another account and resuming on another host become the same operation.
- **Test by hand once** before building on it.
- **Credentials risk**: on Linux the login likely lives in the config dir; on macOS it may go to the Keychain, which could break per-account config dirs on Macs. Test early.

## Related signal
Account-pool health (quota low/expired) is a natural Millpond signal that triggers moving dormant/active sessions.
