---
pattern: Before asserting a deliverable is missing, resolve and search the canonical source — never conclude absence from a stale in-tree mirror/submodule
date: 2026-06-16
source: "rrr: mission-control"
concepts: [verification, ground-truth, maw-locate, oracle-outbox, async-handoff, no-tty-wake]
---

# Resolve the canonical source before declaring something missing

**Context**: Asked to check Aeimathes' `protocol.md` status. I searched the in-tree `aeimathes-oracle` submodule (a stale mirror), found nothing, and reported "not delivered anywhere." It had been DONE for ~2 days in the canonical repo (`~/ghq/.../aeimathes-oracle`), discoverable with one `maw locate aeimathes`.

**Rules (generalizable)**:
1. A confident negative ("X doesn't exist / wasn't done") demands a *complete* search. Resolve the canonical source (`maw locate <oracle>`, registry, remote) and search THAT — submodules and in-tree copies drift.
2. Oracle outbox notes do **not** auto-relay. A "complete" deliverable can sit unread in another agent's `ψ/outbox` for days. When asked for an agent's status, check its canonical-repo outbox first — the answer may already exist.
3. `maw wake -a` cannot attach from a non-interactive/background agent (no TTY); the attach is structurally guaranteed to fail. For interactive boots, write the durable `ψ/inbox/` file (read on RTK) and hand the attach to a human. Don't re-wake to retry attach.

**Ties to recurring pattern**: "acting on assumptions without verifying ground truth" — same family as prior-session errors. The fix is a hard pre-assertion gate: complete the search before stating a negative.
