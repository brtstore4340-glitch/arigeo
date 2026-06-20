---
name: plan-mode-over-velocity
description: When debugging loops, Plan Mode investigation beats rapid-fire hypothesis testing
metadata:
  type: feedback
---

# Use Plan Mode When Rapid Iteration Starts Failing

## Rule
When you've tried 2+ different fixes on the same issue and they keep failing, **stop and use Plan Mode to investigate root cause** before the next attempt. Velocity without understanding = compound failures.

**Why:** Fast iteration without a hypothesis = each failed fix makes the next harder (code gets messier, context gets lost, user frustration grows).

**How to apply:**
- If same fix is tried 2+ times → pause
- Ask: "Why did this fail?" (not "What else should I try?")
- Use Plan Mode to read code, trace execution, find the real blocker
- Only then pick the next approach
- Cost: 10–15 min investigation upfront saves 40 min of failed deploys downstream

## Session Example

**Bad cycle** (what happened):
1. Try: Copy requests page pattern to dashboard → fail
2. Try: Use countSalaryCertificateRequests() → fail
3. Try: Fetch from API → fail
4. Try: Revert and try repository layer again → fail

**After Plan Mode investigation:**
- Found: `listSalaryCertificateRequests()` caps at 100 max
- Found: `countSalaryCertificateRequests()` already exists and works
- One correct fix: use the existing function correctly

## Related

- [[same-code-different-context]] — execution context matters when copying patterns
- [[root-cause-investigation]] — always verify the actual problem before trying solutions
