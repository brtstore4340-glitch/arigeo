---
pattern: Distinguish verification work from communication; verify quietly, communicate results
date: 2026-06-27
source: "rrr: c0b782a3"
concepts: [trust, async-work, handoffs, communication]
---

# Verification ≠ Communication

## The Pattern

When resuming async work after context compaction, I tend to re-verify *everything* to build my own confidence, then show the user my verification work.

**Example from this session:**
- Summary said: "manual-with-screenshots.html created, 8 containers, ready to use"
- I did: Read the full HTML file (19 KB), read capture-screenshots.js (7.5 KB), read SCREENSHOT_GUIDE.md (5 KB)
- Result: Confident verification ✓, but wasted user's time watching me verify

**The mistake**: I conflated two different activities:
1. **Verification** (I need to know) — internal, asynchronous, can be hidden
2. **Communication** (user needs to know) — external, immediate, should be concise

## Why This Matters

**Verification costs context.** Re-reading 3 files consumed ~10 minutes of work and several hundred tokens.

**Communication should be cheap.** The user doesn't need to see *how* I verified. They need to know *what* is ready and *what comes next*.

In this session, the correct flow was:
- *I* read files quickly (checksums, head -20, ls -l) to verify
- *I* reported results clearly (✅ all verified, here's the workflow)
- *User* got clarity without watching my process

## When to Verify

**Always verify after resumption** — don't blindly trust prior context.

But **verify *efficiently***:
- Quick integrity checks (file sizes, timestamps, head -20 of content)
- NOT full re-reads unless something looks wrong
- Checksums or content hashes if you need proof

## When to Show Verification

**Almost never.** Show results, not process.

- ✅ "All 3 files verified, ready to deploy"
- ❌ "I read the manual.html file and it has these 8 sections..."

Exception: When verification *itself* is the deliverable (code review, audit report). Then show your work.

## How to Apply

**Resume pattern:**
1. Trust summary but run a quick 30-second verification (ls, head, stat)
2. If anything looks wrong, investigate deeper
3. Report status clearly and move to next step
4. **Don't show the verification process unless user asks**

**Communication pattern:**
- Lead with status (✅ ready, 🟡 waiting, ❌ blocked)
- Then explain what comes next
- Reserve detailed explanations for when user asks "why?"

## Related Memories

- [[feedback_context_window_efficiency]] — spending tokens wisely
- [[feedback_summary_trust]] — when to trust prior context vs verify
- [[feedback_async_handoffs]] — coordination across sessions

---

*Born from: Over-verifying file contents when a quick integrity check would have sufficed. Learning to separate confidence-building from communication.*
