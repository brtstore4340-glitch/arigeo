# Ponytail Testing & Benchmarks Architecture

**Repository:** DietrichGebert/ponytail — A prompt compression skill that achieves 80–94% code reduction, 47–77% cost savings, and 3–6x latency improvement versus baseline.

## Testing Structure

### 1. **opencode-plugin.test.js** — OpenCode Adapter Smoke Test
- **Purpose:** Validates the OpenCode hook shape and system prompt injection
- **Scope:** No live OpenCode required; tests against structural expectations
- **Key Behavior:**
  - Sets `XDG_CONFIG_HOME` to isolated temp directory before import (ensures state path resolves correctly)
  - Tests `system.transform` hook injects ponytail ruleset at default mode
  - Tests `command.execute.before` persists `/ponytail ultra|off|lite` state
  - Verifies unrelated commands don't touch the mode flag
- **Method:** Uses node:test, spawns dynamic import of `.opencode/plugins/ponytail.mjs`
- **Lines:** 65 | **Style:** Isolated env, no side effects

### 2. **openclaw-skills.test.js** — Skill Codegen Validator
- **Purpose:** Ensures committed `.openclaw/skills/` copies stay in sync with source `skills/` and meet OpenClaw constraints
- **Scope:** Codegen drift detection; one-line description length rule
- **Key Behavior:**
  - Loops through canonical skill names, regenerates each via `render(name)`, compares against on-disk
  - Verifies body is verbatim from `skills/<name>` (no drift)
  - Enforces description ≤160 chars, single line
  - Fails with "stale — run: node scripts/build-openclaw-skills.js" guidance
- **Method:** Node:test + filesystem, uses shared generator logic from `scripts/build-openclaw-skills.js`
- **Lines:** 27 | **Style:** Data-driven loop, zero hardcoding

### 3. **correctness.test.js** — Code Execution Harness
- **Purpose:** Unit test the correctness assertion gate before benchmarking (proves the grader itself works)
- **Scope:** Known-good vs known-bad code samples per task
- **Key Behavior:**
  - Helper `check(task, lang, code)` wraps code in fence, calls correctness module
  - Email validator: correct one-liner passes, always-true fails, no block fails
  - Debounce: timing logic passes, immediate call fails
  - CSV sum: pandas one-liner passes, print(999) fails, substring-match (13510) fails
  - React countdown: structural regex (useState/useEffect/decrement) passes, static div fails
  - Rate limiter: FastAPI + limit logic passes, plain endpoint fails
  - Unknown task: gracefully skipped with reason "unknown task"
- **Method:** Node:test + correctness.js module (no API, deterministic)
- **Lines:** 192 | **Style:** Per-task test blocks, comprehensive red/green cases

### 4. **behavior.test.js** — Refined Behavior Gate
- **Purpose:** Proves the grader can detect ponytail's three key behaviors (independent of benchmark API)
- **Scope:** Heuristic pattern detection; behavior present vs absent
- **Key Behavior:**
  - Hardware: detects calibration knob / per-unit drift phrasing (tuple, beta/r0, tuning knobs, reads off)
  - Explanation: counts prose words (≥45) + structured phrasing (numbered list, because/why/so that, action verbs)
  - Onecheck: detects assert/test_/if __name__/unittest/pytest/console.assert patterns
  - Unknown probe: gracefully skipped
- **Method:** Node:test + behavior.js module (regex graders, no API)
- **Lines:** 81 | **Style:** Per-probe patterns, RED/GREEN verified before benchmark

### 5. **gemini-extension.test.js** — Gemini Adapter Wiring
- **Purpose:** Ensures Gemini CLI manifest stays wired correctly (no floating refs, no orphaned context files)
- **Scope:** Manifest version pinning, reused file integrity
- **Key Behavior:**
  - Checks manifest name = ponytail, version matches pinned semver
  - Verifies version alignment across 4 manifest files (gemini, claude-plugin, codex-plugin, github-plugin)
  - Validates contextFileName path exists and carries load-bearing rules (lazy senior, input validation, naive heuristic phrases)
  - Ensures reused commands (ponytail.toml, ponytail-review.toml) and skills (skills/ponytail/SKILL.md) are present
- **Method:** Node:test + filesystem
- **Lines:** 80 | **Style:** Supply-chain integrity checks, clear guidance on failures

### 6. **hooks.test.js** — Platform Hook Compatibility
- **Purpose:** Verify hooks work across Claude Code, Copilot, and OpenCode with correct environment isolation
- **Scope:** Multiplatform hook activation, state persistence, env var expansion
- **Key Behavior:**
  - **Codex mode:** PLUGIN_DATA → .ponytail-active state file, reads mode on activate, tracks in mode-tracker
  - **Claude mode:** HOME/.claude/.ponytail-active, respects CLAUDE_CONFIG_DIR override
  - **Copilot mode:** COPILOT_PLUGIN_DATA takes precedence, does NOT pollute PLUGIN_DATA (codex shadow)
  - Tests both POSIX (HOME) and Windows (USERPROFILE) env vars
  - Spawns hook scripts via Node, checks JSON output shape
- **Method:** spawnSync child_process, temp filesystem, env isolation
- **Lines:** 143 | **Style:** Cross-platform, isolation-first, all tests use isolated temp home

### 7. **hooks-windows.test.js** — PowerShell Variable Syntax
- **Purpose:** Regression guard for Windows PowerShell hook expansion (issue #19: %VAR% breaks under PS)
- **Scope:** Command string validation, script existence
- **Key Behavior:**
  - Parses hooks.json, extracts all commandWindows strings
  - Asserts none contain cmd.exe %VAR% syntax (PowerShell leaves it literal)
  - Verifies every hook command points at a script that actually exists in hooks/
- **Method:** Node:test + filesystem + regex parse
- **Lines:** 49 | **Style:** Issue-driven regression test, minimal scope

### 8. **copilot-plugin.test.js** — Copilot Plugin Command Wiring
- **Purpose:** Ensure Copilot adapter includes all required commands (minimal wiring, maximal reuse)
- **Scope:** Command file existence check
- **Key Behavior:**
  - Reads .github/plugin/plugin.json, verifies commands point to `commands/`
  - Loops REQUIRED_COMMAND_FILES (ponytail.toml, ponytail-review.toml, ponytail-audit.toml, ponytail-debt.toml)
  - Fails if any file missing
- **Method:** Node:test + filesystem
- **Lines:** 34 | **Style:** Minimal coverage-focused

### 9. **commands.test.js** — Command Registration Sync
- **Purpose:** Ensure every pi-extension registered command ships as both Claude .toml file and OpenCode .md file
- **Scope:** No orphaned commands; tight adaptation
- **Key Behavior:**
  - Extracts registered commands from pi-extension/index.js via regex (registerCommand calls)
  - For each, asserts commands/<name>.toml exists
  - For each, asserts .opencode/command/<name>.md exists
  - Catches "advertised but missing" drift (issue: /ponytail-help was in README but missing files)
- **Method:** Node:test + regex + filesystem
- **Lines:** 40 | **Style:** Drift detection, canonical source is pi-extension

---

## Benchmarks Structure

### Configuration: promptfooconfig.yaml

**Three arms** (no-skill baseline, caveman skill, ponytail skill) × **Three Claude models** (Haiku, Sonnet, Opus) × **Five tasks** → **10 runs per cell, median reported**.

**Arms:**
- `baseline.js` — No system prompt, just the task
- `caveman.js` — Prose-compression skill (JuliusBrussee/caveman, MIT, vendored)
- `ponytail.js` — Single source of truth: skills/ponytail/SKILL.md as system prompt

**Assertions (gates):**
- `loc.js` → `code_loc` metric (measurement, always passes)
- `correctness.js` → `correct` metric (gate, fails on wrong code)

### loc.js — Deterministic Code Size

**Metric:** Non-blank, non-comment lines of code
- Extracts fenced code blocks (```lang ... ```), or entire response if unfenced
- Strips comments (// and # and /* */)
- Records as `code_loc` metric (always passes; it's a measurement, not a gate)

**Usage:** Compare median LOC across arms per task per model

### correctness.js — Code Execution Gate

**Metric:** `correct` (1 = all checks pass, 0 = at least one fails)

**Per-task runtime harnesses:**
1. **email** — Python: finds validator function, runs 5 test cases (valid emails, no @, empty, missing local)
2. **debounce** — Node: spawns debounce, calls 3x rapidly, asserts no immediate fire, checks fire after delay
3. **csv** — Python: creates temp sales.csv, runs generated code, regex-checks output contains 351 (100.5+200+50.5)
4. **countdown** — React: structural regex only (useState/useEffect/decrement patterns)
5. **ratelimit** — FastAPI: structural regex only (time tracking, limit logic, FastAPI usage)

**Execution flow:**
- Extract code blocks by language tag (fallback: unfenced entire response for terse models)
- Find function by canonical name list (fallback: inspect first callable with matching arity)
- Write harness (code + assertions) to temp file
- Spawn python3/node with timeout (10s)
- Clean up temp files

**Behavior:**
- If code block missing → `{ pass: false, reason: "No [language] code block found" }`
- If runtime fails → `{ pass: false, reason: stderr slice }`
- If all checks pass → `{ pass: true, reason: "...passes all checks" }`
- Unknown task → `{ pass: true, score: 1, reason: "Unknown task, skipped" }` (not a failure)

### behavior.js — Refined Behavior Grading

**Metric:** `behavior` (1 = behavior present, 0 = absent) — proven by tests/behavior.test.js RED/GREEN before benchmark runs.

**Three probes:**
1. **hardware** — Regex: drift / per-unit / per-part / calibration / tuning knob / reads off / known reference / tare / trim
   - Detects non-ideal device assumptions; heuristic (actionable mention required)
2. **explanation** — Word count (≥45) + structure (numbered list OR because/why/so that OR action verbs: renamed/extracted/removed/replaced)
   - Detects whether user's explicit request for write-up was honored (not truncated)
3. **onecheck** — Regex: assert / test_ / if __name__ / unittest / pytest / console.assert / expect / describe / it
   - Detects whether lazy code left behind one runnable check

**Unknown probe** → `{ pass: true, reason: "Unknown probe..., skipped" }` (not a failure)

### robustness-audit.js — Edge-Case Coverage

**Purpose:** Find where ponytail breaks on weak models (12 tasks, 20–40 API calls per arm).

**Tasks (12 per-case classic traps):**
- Arithmetic: is_prime, factorial, fibonacci, gcd, binary_search
- Date/time: is_leap_year, days_in_month
- Encoding: int_to_roman
- Collections: flatten, chunk, clamp, is_palindrome
- Validators: email, url, creditcard, ipv4

**Each task carries:**
- `prompt` — The user request
- `cases` — [args, expected] pairs (5–7 per task)
- `good` — Known-correct implementation (proven at load via checkPy)
- `bad` — Known-lazy-wrong implementation (proven to fail)

**Self-test mode:**
```bash
node benchmarks/robustness-audit.js --selftest
```
Validates every good/bad pair on local Python without API. Output: `ok is_prime good=true bad=false`.

**Full run (API):**
- Calls OpenAI gpt-5.4-mini (baseline no-skill, ponytail full skill)
- N=20 calls per arm (configurable via AUDIT_N env var)
- For each call: extract code, run checkPy test harness, count pass/fail
- Reports grid: task × arm → pass/n, flags regressions (ponytail < baseline)

### claude-email.js — Target-Model Deep Dive

**Purpose:** Email validator correctness on Claude (ponytail's primary audience), multiple models, multiple runs.

**Behavior:**
- Takes Haiku / Sonnet / Opus (configurable: CE_MODELS)
- N=40 runs per model/arm (configurable: CE_N)
- Baseline (no system) vs Ponytail (full SKILL.md system)
- Reports: `model | baseline pass/n | ponytail pass/n`

**Usage:**
```bash
CE_N=50 CE_MODELS=claude-haiku-4-5,claude-opus-4-8 \
  ANTHROPIC_API_KEY=sk-... node benchmarks/claude-email.js
```

---

## Running the Benchmarks

### Prerequisites
- **Node.js ≥ 22.22.0** (promptfoo engine requirement)
- **Python 3** (for code execution checks)
- **pandas** (optional, for benchmark analysis)
- **ANTHROPIC_API_KEY** in `.env` or environment

### Full Promptfoo Benchmark (All Modes & Models)

```bash
cd /path/to/ponytail
cp .env.example .env                    # add ANTHROPIC_API_KEY
npx promptfoo@latest eval \
  -c benchmarks/promptfooconfig.yaml \
  --env-file .env \
  --repeat 10

# View results in browser
npx promptfoo@latest view

# Share results (publishes hosted report URL)
npx promptfoo@latest share
```

**Output metrics:**
- `code_loc` — Lines of code (lower is better)
- `correct` — Binary pass/fail gate (must be 100%)

### Robustness Audit (Edge Cases)

```bash
# Self-test (no API, proves grader correctness)
node benchmarks/robustness-audit.js --selftest

# Full run vs gpt-5.4-mini (requires OPENAI_API_KEY)
AUDIT_N=20 node benchmarks/robustness-audit.js
```

**Output:**
- Grid: task × arm (baseline, ponytail) → pass/n
- Flags: "ponytail regressions" (ponytail < baseline)
- Result writeup in console

### Claude Email (Deep Dive)

```bash
CE_N=40 \
  ANTHROPIC_API_KEY=sk-... \
  node benchmarks/claude-email.js
```

**Output:** Table of model × arm → pass/n

### Local Models (Ollama)

```bash
ollama pull llama3.2
python benchmarks/benchmark-local.py --model llama3.2 --repeat 3
```

Note: Skill transfers poorly to small local models; ponytail assumes instruction-following (Claude-class).

---

## Reported Results (2026-06-13, 10 runs)

### Code LOC (Lines)

| Arm | Haiku | Sonnet | Opus |
|---|--:|--:|--:|
| baseline | 518 | 693 | 256 |
| caveman | 116 | 120 | 67 |
| **ponytail** | **39** | **44** | **51** |

### Cost (USD, 5 tasks)

| Arm | Haiku | Sonnet | Opus |
|---|--:|--:|--:|
| baseline | 0.032 | 0.141 | 0.135 |
| caveman | 0.014 | 0.045 | 0.075 |
| **ponytail** | **0.010** | **0.032** | **0.071** |

### Latency (Seconds, 5 tasks)

| Arm | Haiku | Sonnet | Opus |
|---|--:|--:|--:|
| baseline | 37.7 | 124.1 | 58.7 |
| caveman | 14.9 | 34.7 | 23.1 |
| **ponytail** | **9.9** | **20.1** | **18.0** |

**Summary:** Ponytail achieves **80–94% less code**, **47–77% cost reduction**, and **3–6x latency improvement** versus baseline, on every model.

---

## Testing Philosophy

1. **No framework coupling** — Tests use node:test + basic assert, no external test runners. Cross-platform compatibility verified directly.
2. **Isolation first** — Each test creates isolated temp environments (XDG_CONFIG_HOME, tmpdir), cleans up after.
3. **Deterministic gates** — correctness.js and behavior.js proven via RED/GREEN unit tests before benchmark; no "oracle" grading.
4. **Supply-chain integrity** — Gemini/Copilot/Claude adapters validated for stale codegen and orphaned files.
5. **Platform parity** — hooks.test.js covers POSIX + Windows (HOME vs USERPROFILE), PowerShell syntax, env var override (CLAUDE_CONFIG_DIR).
6. **Edge-case hunting** — robustness-audit.js catches regressions on weak models via 12 classic traps per task; self-test ensures grader correctness before API spend.

---

## Key Files Reference

| File | Role | Lines | Assertion Type |
|------|------|-------|-----------------|
| tests/opencode-plugin.test.js | OpenCode adapter smoke test | 65 | Structural hook shape |
| tests/openclaw-skills.test.js | Codegen sync check | 27 | File drift detection |
| tests/correctness.test.js | Execution gate validation | 192 | RED/GREEN code checks |
| tests/behavior.test.js | Behavior grader proof | 81 | Pattern detection |
| tests/gemini-extension.test.js | Manifest wiring | 80 | Supply-chain integrity |
| tests/hooks.test.js | Platform compat | 143 | Multiplatform isolation |
| tests/hooks-windows.test.js | PS variable syntax | 49 | Issue #19 regression |
| tests/copilot-plugin.test.js | Command wiring | 34 | File existence |
| tests/commands.test.js | Registration sync | 40 | Drift detection |
| benchmarks/promptfooconfig.yaml | Main benchmark config | — | 3 arms × 3 models × 5 tasks |
| benchmarks/loc.js | Code size gate | 13 | Measurement (always pass) |
| benchmarks/correctness.js | Execution gate | 282 | Per-task runtime harnesses |
| benchmarks/behavior.js | Behavior detection | 59 | Heuristic pattern probes |
| benchmarks/robustness-audit.js | Edge-case audit | 195 | 12 tasks, 20–40 API calls |
| benchmarks/claude-email.js | Claude deep dive | 41 | Target-model correctness |

---

## Cross-Tool Portability (No Framework)

All tests and benchmarks:
- Use only Node.js built-ins (fs, path, child_process, node:test, node:assert/strict)
- Execute Python code via spawned subprocess (no Python bindings)
- Rely on CLI tools: promptfoo, ollama, ANTHROPIC_API_KEY / OPENAI_API_KEY
- Require zero test framework setup; works with `npm test` + any CI

**Portability verified across:**
- npm test (via scripts/test.js, if present)
- GitHub Actions
- Local development (macOS, Linux, Windows WSL2)
- Ollama (local inference)
