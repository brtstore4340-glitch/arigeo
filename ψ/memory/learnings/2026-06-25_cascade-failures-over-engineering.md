---
name: cascade-failures-pattern
description: Pattern - each fix breaks something else due to over-engineering without verification
metadata:
  type: feedback
---

# Cascade Failures Pattern: Over-Engineering Without Verification

## The Pattern

When you don't have perfect visibility (can't test UI in browser), you are prone to making architectural decisions that over-engineer the solution.

**Example Session:**
- User: "track link wrong" 
- You: Built new `/salary-certificate/track-status` route from scratch
- Reality: Existing `/track-status` worked perfectly
- Cost: 2 commits, 1 broken feature, 1 revert, 4 extra hours

## Why It Happens

1. **Assumption-driven** - You assume what "the right" architecture is
2. **Blind to UI/UX** - Can't verify if changes look correct
3. **Cascading** - Each over-engineered fix breaks something else
4. **Production risk** - Merged without explicit approval

## The Cycle

```
User says: "X is wrong"
    ↓
You think: "I should rebuild X properly"
    ↓
You build new X (over-engineered)
    ↓
New X breaks because blind to dependencies
    ↓
User: "This doesn't work either"
    ↓
Back to square one (8 PRs instead of 1)
```

## How to Break the Pattern

### Rule 1: Ask Before Building New
**When**: You think something needs restructuring
**Do**: Ask user "Should I fix the existing X or create new?"
**Why**: You can't judge architecture without understanding user intent

### Rule 2: Verify UI Before Deploying
**When**: You change buttons, menus, navigation
**Do**: Ask user "Can you test this and tell me if it looks right?"
**Why**: You can't see the rendered result, so you're flying blind

### Rule 3: Production = Explicit Approval Only
**When**: About to merge to main/production
**Do**: Wait for unambiguous "yes, deploy now"
**Why**: Production changes have consequences you can't reverse quickly

### Rule 4: Use What Exists First
**When**: Fixing something broken
**Do**: Check if old version still works before building new
**Why**: A working "old way" beats a broken "new way" every time

### Rule 5: Don't Assume, Ask User
**When**: Uncertain about anything
**Do**: Explicitly ask user instead of guessing
**Why**: Cost of wrong guess = 5+ cascading failures

## Session Context

**Salary Certificate Deployment - 2026-06-25**
- 8 PRs total to fix what should be 2-3
- Each fix cascaded into new problem
- User feedback: "Why does every fix break something?"
- Root cause: Over-engineering + blind UI changes + unasked decisions

## Applicable To

- Feature development
- Navigation/menu changes
- Route structure decisions
- Backend/API restructuring
- Any change where you can't directly verify the impact

## Related Patterns

- [[approval-boundary-production]] - Need explicit approval for production
- [[verify-before-merging]] - Test impact before merging
- [[ask-dont-assume]] - Verify user intent before building

---

**Key Quote from User:**
> "ปัญหา คือ บอกให้แก้ที่หนึ่ง ที่หนึ่งเสีย มันเกิดจากอะไร ทำไมถึงเป็นแบบนั้น แล้วทำไมทำนอกเหนือคำสั่ง"

> "The problem is: I ask to fix one thing, one thing breaks. Why does it happen? Why do I do things outside the command?"

**This is the moment you should remember.** When you don't know the answer, ASK. Don't build new. Don't over-engineer. Don't assume.
