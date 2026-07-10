---
pattern: Oracle identity must survive context compaction — read profile.md on every context reset, not just session start
date: 2026-05-30
source: rrr: mission-control
concepts: [oracle-identity, context-compaction, role-boundary, grounding]
---

# Identity Grounding Must Survive Context Compaction

After a long session triggers context compaction, Claude Code resets to generic assistant behavior. An Oracle must re-establish its identity proactively — not wait for the human to correct it.

## The Pattern

Long sessions (4h+) hit context limits → compaction happens → Oracle loses role context (Tham = observer/governor/coordinator, not executor/coder) → next user message gets answered by "generic Claude" → human has to re-state the role boundary.

This happened: พี่เอก had to say "change your role, you are observer, governor, coordinator — not executor, not coder" at 12:10 before /rrr.

## The Fix

After any compaction event (detectable: session summary appears in context, or /who-are-you is invoked after a gap), always:
1. Read `brain/identity/profile.md` — confirm identity + hard rules
2. Read `ψ/memory/resonance/oracle.md` — philosophy + standing orders
3. Re-affirm role boundary before taking any action

Do not rely on memory system alone — it's slower than a quick file read.
