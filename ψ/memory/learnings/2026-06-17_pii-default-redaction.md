---
pattern: Treat phone numbers/names/customer identifiers as PII by default in any shared/vault write — redact unless the channel is explicitly private and the real value was requested
date: 2026-06-17
source: "rrr: mission-control PII lockdown (Grand5 pharmacy case)"
concepts: [pii, compliance, vault-hygiene, data-handling, gitignore]
---

# PII default-redaction, not opt-in

A user's explicit instruction ("phone/name/surname are sensitive, never push, fix it if already pushed") about ONE dataset (pharmacy customer records) surfaced a second, unrelated leak: the user's own real phone number had been written into nine shared `ψ/memory/` retrospective/log files across multiple prior sessions, with zero PII awareness applied at write time.

**The fix that generalizes:** don't wait to be told a specific string is PII. Any phone number, full name, or customer/member identifier appearing in text destined for a shared/vault/repo file should be treated as sensitive by default — mask or omit it — unless the destination is explicitly a private channel AND the user asked for the real value there.

**Audit scope when a PII rule is issued:** check every storage layer, not just the one named. This session the user was thinking about a GitHub push; the actual leak was in the local vault (`ψ/memory/`), never near git. A full audit covers: the working repo, any parent/monorepo, the shared vault, and active worktrees.

**Practical guard:** `.gitignore` patterns for a repo handling personal data should default to blanket-deny on the data directories (`case/`, `*.csv`, `*member*`) rather than trying to allowlist "safe" files — false negatives (a missed sensitive file) are much worse than false positives (an ignored harmless file) for compliance.
