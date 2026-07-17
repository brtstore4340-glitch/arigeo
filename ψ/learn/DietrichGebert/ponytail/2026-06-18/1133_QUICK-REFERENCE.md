---
name: 1133-quick-reference
description: 
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-15
  source: fleet-memory
---

# Ponytail — Lazy Senior Dev Mode for AI Agents
**Quick Reference Guide**

---

## What is Ponytail?

Ponytail is a skill distribution system that teaches AI agents to write minimal, necessary code instead of over-engineered solutions. It embodies the philosophy of a "lazy senior developer" — not negligent, but efficient. The core belief: **the best code is the code you never wrote**.

### The Problem It Solves
Without guidance, AI agents often:
- Add dependencies when stdlib solutions exist
- Build abstractions that aren't needed yet
- Write boilerplate "for later"
- Create complex solutions when simpler ones work

### The Philosophy
Lazy means efficient, not careless. Ponytail maintains strict standards for:
- Input validation at trust boundaries
- Error handling that prevents data loss
- Security and accessibility
- Everything explicitly requested

But ruthlessly eliminates speculative code, unnecessary abstractions, and over-engineering.

---

## Performance Impact

**Production Results (10 runs median, across Claude Haiku/Sonnet/Opus):**
- **80-94% less code** than baseline
- **3-6x faster** execution
- **42-75% cheaper** per-task cost

Examples from real benchmarks:
| Task | Without Ponytail | With Ponytail | Reduction |
|------|-----------------|---------------|-----------|
| Email Validation | 75 LOC | 3 LOC | 96% |
| Debounce | 116 LOC | 10 LOC | 91% |
| CSV Sum | 20 LOC | 3 LOC | 85% |
| React Countdown | 267 LOC | 9 LOC | 97% |
| Rate Limiting | 128 LOC | 10 LOC | 92% |

---

## Installation

### Claude Code
```bash
/plugin marketplace add DietrichGebert/ponytail
/plugin install ponytail@ponytail
```
Then restart. Requires `node` on PATH (note: non-interactive shell PATH for Nix/nvm users).

### Codex
```bash
codex plugin marketplace add DietrichGebert/ponytail
codex
```
Then open `/plugins`, select Ponytail marketplace, install Ponytail. Open `/hooks`, review and trust the lifecycle hooks. Start new thread.

Also works in Codex desktop app after restart.

### GitHub Copilot CLI
```bash
copilot plugin marketplace add DietrichGebert/ponytail
copilot plugin install ponytail@ponytail
```
In interactive sessions, use slash equivalents: `/plugin marketplace add ...`

Commands are namespaced: `/ponytail:ponytail ultra`, `/ponytail:ponytail-review`

### Pi Agent Harness
```bash
pi install git:github.com/DietrichGebert/ponytail
```

### OpenCode
Add to `opencode.json` in your project:
```json
{ "plugin": ["./.opencode/plugins/ponytail.mjs"] }
```
Reuses `hooks/` and `skills/` from the repo. Auto-loads `AGENTS.md`.

### Gemini CLI
```bash
gemini extensions install https://github.com/DietrichGebert/ponytail
```
Loads ruleset as always-on context. Registers `/ponytail` commands.

### Antigravity CLI (Google's Gemini CLI replacement)
```bash
agy plugin install https://github.com/DietrichGebert/ponytail
```
Converts `/ponytail` commands into skills (type as messages, e.g., `/ponytail-review`).

### OpenClaw
```bash
clawhub install ponytail
```
Also install related skills: `clawhub install ponytail-review`, `ponytail-audit`, `ponytail-debt`.

### Cursor, Windsurf, Cline, GitHub Copilot, Aider, Kiro
Copy the matching rules file from the repo:
- **Cursor**: `.cursor/rules/ponytail.mdc`
- **Windsurf**: `.windsurf/rules/ponytail.md`
- **Cline**: `.clinerules/ponytail.md`
- **GitHub Copilot (editor)**: `.github/copilot-instructions.md`
- **GitHub Copilot CLI (fallback)**: `~/.copilot/copilot-instructions.md` (global) or project-level
- **Kiro**: `.kiro/steering/ponytail.md` → copy to `~/.kiro/steering/` (global) or `.kiro/steering/` (project)
- **VS Code + Codex extension**: Reads `AGENTS.md` (repo root or `~/.codex/AGENTS.md` globally)

### Generic Agents
Copy `AGENTS.md` directly or load `skills/*/SKILL.md` files.

---

## Core Features

### 1. The Laziness Ladder
Before writing code, stop at the **first rung that holds**:

```
1. Does this need to exist?           -> no: skip it (YAGNI)
2. Stdlib does it?                    -> use it
3. Native platform feature?           -> use it (e.g., <input type="date">)
4. Installed dependency?              -> use it (never add new for a few lines)
5. Can this be one line?              -> one line
6. Only then: the minimum that works
```

**Example:** Date picker
- Without: Install flatpickr, write wrapper component, add stylesheet, discuss timezones
- With: `<input type="date">` (HTML standard, browser-native, works)

### 2. Commands

| Command | Aliases | What it does |
|---------|---------|--------------|
| `/ponytail [lite\|full\|ultra\|off]` | -- | Set intensity level or report current. Default: **full** |
| `/ponytail-review` | `@ponytail-review` (Codex) | Review diff for over-engineering; hands back delete-list |
| `/ponytail-audit` | `@ponytail-audit` | Audit entire repo for over-engineering (not just diff) |
| `/ponytail-debt` | -- | Harvest all `ponytail:` shortcuts into a ledger so deferrals don't rot |
| `/ponytail-help` | -- | Quick reference (this info) |

**Note:** Commands require a skill-capable host (Claude Code, Codex, OpenCode, Gemini, pi). Instruction-only adapters (Cursor, Windsurf, Cline, Copilot, Kiro) load the ruleset without commands.

### 3. Intensity Levels

| Level | Trigger | Behavior |
|-------|---------|----------|
| **lite** | `/ponytail lite` | Build what's asked. Name the lazier alternative in one line. User picks. |
| **full** | `/ponytail` | Ladder enforced. Stdlib -> native -> minimal. **Default.** |
| **ultra** | `/ponytail ultra` | YAGNI extremist. Deletion before addition. Challenge requirements before building. |
| **off** | `/ponytail off` | Disable ponytail mode. Resume with `/ponytail`. |

**Example:** "Add a cache for these API responses"
- **lite:** "Done. FYI: `functools.lru_cache` in one line if you'd rather not own a cache class."
- **full:** "`@lru_cache(maxsize=1000)` on the fetch. Skipped custom cache class; add when lru_cache measurably falls short."
- **ultra:** "No cache until a profiler says so. When it does: `@lru_cache`. Hand-rolled TTL cache class is a bug farm."

### 4. Skill Descriptions

#### **ponytail** -- Main Mode
Forces the laziest solution that actually works. Channels a senior dev who's seen every over-engineered codebase. Supports intensity levels. Trigger: say "ponytail", "be lazy", "lazy mode", "simplest solution", "minimal solution", "YAGNI", "do less", or "shortest path".

#### **ponytail-review** -- Over-Engineering Audit (Diff)
Code review focused **only** on complexity. Finds what to delete: reinvented stdlib, unneeded dependencies, speculative abstractions, dead flexibility. One line per finding: `L<line>: <tag> <what>. <replacement>.`

**Tags:**
- `delete:` dead code, unused flexibility, speculative feature
- `stdlib:` hand-rolled thing stdlib ships (names the function)
- `native:` code doing what the platform already does (names the feature)
- `yagni:` abstraction with one implementation, config nobody sets, layer with one caller
- `shrink:` same logic, fewer lines (shows shorter form)

**Example output:**
```
L12-38: stdlib: 27-line validator class. "@" in email, 1 line. Real validation is confirmation mail.
L4: native: moment.js imported for one format. Intl.DateTimeFormat, 0 deps.
repo.py:L88: yagni: AbstractRepository with one implementation. Inline until second exists.
L52-71: delete: retry wrapper around idempotent local call. Nothing replaces it.
L30-44: shrink: manual loop builds dict. dict(zip(keys, values)), 1 line.

net: -42 lines possible.
```

#### **ponytail-audit** -- Over-Engineering Audit (Full Repo)
Like ponytail-review but scans the entire codebase. One-shot report, ranked biggest cuts first. Ends with `net: -<N> lines, -<M> deps possible.`

**Hunt for:** Deps stdlib/platform already ships, single-implementation interfaces, factories with one product, wrappers that only delegate, files exporting one thing, dead flags/config, hand-rolled stdlib.

#### **ponytail-debt** -- Defer Ledger
Harvests every `ponytail:` comment in the codebase into a tracked ledger. Prevents deliberate shortcuts from quietly becoming permanent.

**Format:** 
```
<file>:<line> -- <what was simplified>. ceiling: <limit>. upgrade: <trigger>.
```

**Example output:**
```
src/cache.py:42 -- global lock for thread safety. ceiling: under 1000 req/sec. upgrade: if throughput exceeds 1000 req/sec.
api/search.py:8 -- naive O(n^2) scan. ceiling: <10k documents. upgrade: if document count > 10k.

5 markers, 0 with no trigger.
```

Flags: `no-trigger` tag for markers missing upgrade paths (rot risk).

#### **ponytail-help** -- Quick Reference
One-shot display of all modes, skills, and commands. Does not change mode or persist anything.

---

## Configuration

### Default Mode
Set for every new session. Three ways (order of precedence):

**Environment Variable (highest priority):**
```bash
export PONYTAIL_DEFAULT_MODE=ultra
```

**Config File:**
- Linux/Mac: `~/.config/ponytail/config.json`
- Windows: `%APPDATA%\ponytail\config.json`

```json
{ "defaultMode": "lite" }
```

**Default:** `full` (ladder enforced, stdlib first, minimal output)

To disable auto-activation on session start:
```json
{ "defaultMode": "off" }
```
Then activate manually with `/ponytail` when wanted.

### Resolution Order
1. Environment variable (`PONYTAIL_DEFAULT_MODE`)
2. Config file (`defaultMode` field)
3. Hardcoded default: `full`

---

## Rules & Principles

### Never Simplify Away
- Input validation at trust boundaries
- Error handling that prevents data loss
- Security measures
- Accessibility basics
- Anything explicitly requested
- Hardware calibration (real clocks drift, sensors read off)

### Always Mark Simplifications
Mark intentional shortcuts with a `ponytail:` comment naming the ceiling and upgrade path:

```python
# ponytail: global lock, per-account locks if throughput > 1000 req/sec
with lock:
    process_request()
```

```javascript
// ponytail: naive O(n^2) scan, adequate < 10k items, switch to index if larger
for (const a of items) {
  for (const b of items) {
    // ...
  }
}
```

Non-trivial logic (branches, loops, parsers, money/security paths) leaves **one runnable check** behind: an assert-based `demo()`, `__main__` self-check, or one small test file. No frameworks, no fixtures unless asked. Trivial one-liners need no test -- YAGNI applies to tests too.

### Key Principles
- **No unrequested abstractions:** No interface with one implementation, factory for one product, config for a value that never changes
- **No boilerplate:** No scaffolding "for later"
- **Deletion over addition:** Boring over clever (clever is what someone debugs at 3am)
- **Fewest files possible:** Shortest working diff wins
- **Question complex requests:** Ship the lazy version and question it: "Did X; Y covers it. Need full X? Say so."
- **Edge-case correctness:** Two stdlib options, same size? Take the edge-case-correct one

---

## Usage Examples

### Example 1: Email Validation
**Task:** Write a Python function that validates email addresses.

**Without Ponytail (75 lines):**
- Builds regex validator
- Adds advanced version with detailed feedback
- Recommends third-party library `email-validator`
- Includes multiple test cases
- Compares methods in a table

**With Ponytail (3 lines):**
```python
import re

def is_valid_email(email: str) -> bool:
    return bool(re.match(r'^[^@]+@[^@]+\.[^@]+$', email))
```

**What was skipped:** RFC 5322 parser, DNS MX lookup, confirmation email. Add when you actually need to reject `user+tag@sub.domain.co.uk` or catch typos -- until then, this catches 99% of "oops I fat-fingered it" cases.

### Example 2: Debounce Function
**Task:** Add debounce to a search input. Currently fires API call on every keystroke.

**Without Ponytail (116+ lines):**
- Basic debounce function
- Enhanced version with loading state
- Error handling
- Response checking
- Display functions

**With Ponytail (10 lines):**
```javascript
const search = async (q) => {
  const r = await fetch(`/api/search?q=${q}`);
  return r.json();
};

input.addEventListener('input', e => {
  clearTimeout(timeout);
  timeout = setTimeout(() => search(e.target.value), 300);
});
```

**What was skipped:** Loading indicator abstraction, error UI (confirm email first). Add error handling when API actually fails; loading UI when requests take >1s.

### Example 3: HTML Date Picker
**Task:** Build a date picker component.

**Without Ponytail:**
- Install flatpickr library
- Create wrapper component
- Add CSS stylesheet
- Handle timezone logic
- Write tests

**With Ponytail:**
```html
<!-- ponytail: browser has one -->
<input type="date">
```

Native HTML element, zero dependencies, keyboard accessible, mobile-friendly.

---

## Common Patterns

### Pattern: Library vs. Native
```
Requested: "Build a date picker"

With ponytail:
<input type="date">  

Why: Browser has it. Works everywhere. Zero maintenance.
Add when: you need custom styling the native picker doesn't allow.
```

### Pattern: Stdlib vs. Hand-Rolled
```python
Requested: "Cache API responses"

With ponytail:
@functools.lru_cache(maxsize=128)
def fetch_user(id):
    return api.get(f"/users/{id}")

Why: Stdlib does TTL, per-instance, thread-safe.
Add when: measured profiling shows lru_cache is the bottleneck.
```

### Pattern: Validation
```python
Requested: "Validate incoming JSON data"

With ponytail:
import json

try:
    data = json.loads(request_body)
    required_fields = {'name', 'email'}
    if not required_fields <= data.keys():
        raise ValueError("Missing required fields")
except json.JSONDecodeError:
    raise ValueError("Invalid JSON")

Why: Validates at trust boundary. Prevents data corruption.
Never skip: input validation at trust boundaries.
```

### Pattern: Error Handling
```javascript
Requested: "Process uploaded files"

With ponytail:
const files = req.files;
if (!files || files.length === 0) {
    throw new Error("No files provided");
}

Why: Prevents silent failures and data loss.
Never skip: error handling that prevents data loss.
```

---

## Deferred Shortcuts Ledger

Ponytail lets you defer upgrades by marking them with comments. `/ponytail-debt` collects them:

```python
# ponytail: single regex match, O(n^2) if n>10k users, upgrade to indexed search
for user in users:
    if pattern.match(user.email):
        results.append(user)
```

Later, query debt ledger:
```
/ponytail-debt
```

Returns:
```
module.py:42 -- O(n^2) regex search. ceiling: works for <10k users. upgrade: if user count > 10k.

1 marker, 0 with no trigger. Review when metrics alert.
```

This prevents shortcuts from rotting into permanent hacks.

---

## Testing with Ponytail

### Minimal Test Pattern
Non-trivial logic gets one runnable check. Frameworks optional:

```python
# instead of pytest + fixtures
def test_email_validator():
    assert is_valid_email("user@example.com")
    assert not is_valid_email("invalid@")

if __name__ == "__main__":
    test_email_validator()
    print("✓ All checks passed")
```

**One file, zero dependencies, runs standalone.**

Trivial one-liners need no test -- YAGNI applies to tests too.

---

## Deactivating Ponytail

Say any of:
- "stop ponytail"
- "normal mode"
- `/ponytail off`

Resume anytime with `/ponytail`.

**Level persists** until changed or session end.

---

## Troubleshooting

### "node is not on PATH"
Ponytail runs two lifecycle hooks (startup and mode-change activation). These are optional -- skills still work without them; activation just stays quiet instead of erroring on every prompt.

**Fix:** Ensure `node` is on non-interactive shell PATH. For Nix/nvm users, add Node to your shell config.

### "Commands not working"
Commands require a skill-capable host. Instruction-only adapters (Cursor, Windsurf, Cline, Copilot, Kiro, Antigravity) load the ruleset but don't add `/ponytail` commands. Type requests into chat instead: "Be in ponytail lite mode", "Review this for over-engineering".

### "How do I update?"
**Claude Code:**
- Auto-update: Open `/plugin`, Marketplaces, select ponytail, Enable auto-update. Claude Code pulls at startup.
- Manual: `/plugin marketplace update ponytail` -> `/reload-plugins`

**Other hosts:** Follow host-specific update flow.

---

## Key Files in the Repo

| File | Purpose |
|------|---------|
| `AGENTS.md` | Compact always-on ruleset (copy into agent instruction files) |
| `skills/ponytail/SKILL.md` | Main lazy mode skill definition |
| `skills/ponytail-review/SKILL.md` | Over-engineering review skill |
| `skills/ponytail-audit/SKILL.md` | Full-repo audit skill |
| `skills/ponytail-debt/SKILL.md` | Defer ledger skill |
| `skills/ponytail-help/SKILL.md` | Quick reference skill |
| `docs/agent-portability.md` | Maps host-specific adapter files |
| `examples/` | Real benchmark outputs (email, debounce, CSV, timer, rate-limit) |
| `benchmarks/` | Reproducible benchmark suite (10 runs per model) |

---

## Quick Facts

- **License:** MIT
- **Requires:** `node` on PATH (optional, for lifecycle hooks)
- **Default mode:** `full`
- **Version:** 0.1.0+
- **Works with:** 13+ agents (Claude Code, Codex, OpenCode, Gemini, pi, GitHub Copilot CLI, Antigravity, OpenClaw, Cursor, Windsurf, Cline, GitHub Copilot editor, Kiro)

---

## Philosophy Summary

> "He says nothing. He writes one line. It works."

Ponytail embodies the lazy senior developer archetype -- someone who:
- Has seen every over-engineered codebase
- Been paged at 3am for one
- Knows the difference between lazy (efficient) and negligent (careless)
- Never cuts validation, security, or accessibility
- Ruthlessly questions whether code needs to exist at all

The result: **less code, faster execution, lower cost, higher maintainability.**

---

## Further Reading

- **Full README:** https://github.com/DietrichGebert/ponytail
- **Benchmarks (reproducible):** `npx promptfoo eval -c benchmarks/promptfooconfig.yaml`
- **Agent Portability:** How Ponytail works across 13+ different AI agents
- **Examples:** Real model output side-by-side (email, debounce, CSV, countdown, rate-limit)
