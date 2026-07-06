---
name: parameter-tuning-vs-design-analysis
description: When simple parameters don't fix a problem, the issue is architectural, not calibration
type: learnings
date: 2026-06-23
source: 'rrr: mission-control Phase 13b Component 1'
concepts: [debugging, architecture, design, testing]
---

# Lesson: Architectural Constraints Trump Parameter Tuning

## The Pattern

You've applied the same parameter adjustment 2–3 times and the test still fails. Each attempt moves the needle slightly but doesn't solve the core issue. Different tests start failing as you adjust.

**This is a sign the problem is architectural, not calibration.**

## The Rule

When a simple parameter doesn't fix a problem after 2 attempts:

1. **Stop tuning**
2. **Analyze the architecture**: Is the core model/algorithm designed to support this behavior?
3. **Ask the design question**: Does the specification require this model to do X, or is the test expectation wrong?
4. **Make a decision**: Redesign the model, adjust the test, or accept the gap + document it
5. **Don't loop**: Never try parameter #5 hoping it sticks

## Why This Matters

**Parameter tuning is empirical.** You're fitting a curve to data. If the model's architecture can't support the behavior, no parameter will get you there — you'll just thrash.

**Design analysis is structural.** You're asking "is this model supposed to do this?" That's a yes/no question, not a curve-fitting problem.

## Applied Example: Component 1 Downtrend Test

**Test expectation**: Downtrend [25→1] should predict < 5  
**Model output**: ~5.5–5.98  
**First fix**: Increase trend boost from 0.02 → 0.03 → 5.6 (marginal)  
**Second fix**: Change MA blend from 60/40 → 65/35 → 5.2 (better, but still > 5)  
**Third fix**: Lower confidence floor from 0.6 → 0.54 → still > 5, but now breaks another test  

**Root cause revealed**: 
- MA model blends short (3) and long (13) averages → ~5.1 base
- Trend boost adds ~0.2–0.3
- Result: fundamentally can't get below 5 without breaking the 60%+ blending that makes the model stable

**Right decision**: Accept 14/16 passing, document the limitation. The 60/40 blend is conservative by design (it's supposed to be stable). Forcing it to predict < 5 would make it unstable elsewhere.

## When to Accept the Gap

- Model architecture is sound and intentional
- Gap is small (87.5% vs. 100%)
- Test expectation may be unrealistic
- Cost of fixing = cost of redesigning core model
- Documented limitation is acceptable to stakeholders

### Anti-pattern: Chasing 100% Through Fragile Tuning

If you end up with a parameter value that "works" but you don't understand why, and it breaks something else later, you've created technical debt, not fixed the problem.

## Application to Future Work

- **Before tuning parameters**: Plot expected vs. actual. Ask "does this model architecture support this?"
- **After 2 attempts**: Call a timeout. Escalate to design review.
- **If you must tune**: Understand the math first (what should happen), then verify empirically.
- **Document the gap**: "Model is conservative by design; test expects aggressive behavior" is honest.

## Related Lessons

- [[test-driven-design-vs-empirical-tuning]] (if it exists)
- [[accept-good-enough-with-honesty]] (shipping 87.5% with documentation)
- [[when-to-escalate-design-decisions]] (know when parameter tuning stops working)
