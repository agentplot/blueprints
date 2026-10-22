# The cache

A cache entry is bytes a build left on any host, named by their digest
and the build identity; any host that built them writes it, and any
host whose build identity matches reads it (52). The same bytes are one
store object whether a cache entry or an artifact names them, and
writing bytes is never an offer (100). It is the lowest of the
three levels of trust: "someone built this", covered by no claim beyond
the writing host's own.

A cache entry is never an artifact (53). Reading one offers nothing and
accepts nothing; no channel, index or policy names one. The same bytes
become an artifact only through a publish, which attaches the claims
that make them worth trusting. A cache entry may be removed at any time,
and a build whose entry is gone builds again (54); nothing accepted or
released is ever removed because of what the cache does.

The cache lives in the same content-addressed store as the artifacts,
under the least-trusted name, which is what lets a cache hit, an
accepted artifact and a released version be the same bytes at three
levels of trust without a copy. Where the store is a registry, the
cache may be a separate, cheaper registry or a local one; the digest is
the same either way (1).

A verifier's rebuild reads no cache entry it did not write (55), so a
poisoned cache input never reaches a version the policy asked to have
rebuilt (30).

moon's output archives are the first cache entries: an archive keyed by
the task hash, pushed by the host that ran the task and replayed by any
worktree or fleet host with the same hash. Nix store paths are the
second, the subject of an [open question](open.md).
