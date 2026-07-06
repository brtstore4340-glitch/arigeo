---
pattern: test assertions must match implementation semantics — verify the algorithm before writing the assertion
date: 2026-06-01
source: rrr: mission-control
concepts: [testing, vitest, percentile, assertions, llmops]
---

# Test Assertions Must Match Implementation Semantics

When writing unit tests for mathematical/algorithmic code, verify which algorithm the implementation uses *before* writing the expected value.

## The incident

Built `buildEvalReport()` with nearest-rank percentile (`Math.ceil((p/100) * n) - 1`). Wrote a test expecting p95 of [100..1000] (10 items) to be 950 — assuming linear interpolation. The function returns 1000 (index 9, nearest-rank). 1 test failed.

## The rule

For any function with a non-obvious algorithm (percentile, rounding, binning):
1. Trace through the implementation once manually with the test input
2. Write the assertion from that result
3. Add a comment explaining which formula you verified

## Why it matters

A test that passes for the wrong reason is worse than a test that fails. Here, the test correctly failed — but only because I ran it. In a CI environment where no one reads the failure reason carefully, a "wrong algorithm but close enough" test might be corrected to match the wrong behavior instead of the code.

## Related

- [[2026-05-31_git-index-recovery-and-vitest-wsl-budget]] — same session pattern of running vitest multiple times
