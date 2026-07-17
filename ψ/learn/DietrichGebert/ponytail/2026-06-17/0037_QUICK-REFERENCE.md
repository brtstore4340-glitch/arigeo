---
name: 0037-quick-reference
description: **Ponytail** is a "lazy senior developer mode" plugin for AI agents that enforce
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-15
  source: fleet-memory
---

# Ponytail Quick Reference

## What It Does

**Ponytail** is a "lazy senior developer mode" plugin for AI agents that enforces the principle: *the best code is the code you never write.* It reduces code bloat by 80–94%, latency by 3–6×, and API costs by 47–77% by forcing agents to check six rungs of the ladder before writing new code—YAGNI first, stdlib second, native features third, existing dependencies fourth, one-liners before anything else, and only then the minimum working solution.

The ruleset works on 13 different agent tools and comes with four companion skills: `/ponytail-review` (audit diffs), `/ponytail-audit` (audit whole repo), `/ponytail-debt` (harvest deferred shortcuts), and `/ponytail-help` (quick guide).

---

## Installation by Agent Tool

### Claude Code (Claude Code IDE plugin)

```bash
/plugin marketplace add DietrichGebert/ponytail
/plugin install ponytail@ponytail
```

Once installed, activate via `/ponytail [lite|full|ultra|off]` command, or set default level with `PONYTAIL_DEFAULT_MODE` env var.

### Codex (AI IDE)

In Codex CLI:
```bash
codex plugin marketplace add DietrichGebert/ponytail
codex
```

Then in Codex UI: open `/plugins`, find Ponytail marketplace, select and install. Open `/hooks`, review and trust its two lifecycle hooks, start new thread. Same install covers Codex desktop app (restart after install).

Commands invoked with `@` prefix (e.g., `@ponytail-review`).

### GitHub Copilot CLI

```bash
copilot plugin marketplace add DietrichGebert/ponytail
copilot plugin install ponytail@ponytail
```

In interactive Copilot CLI session, use `/plugin` slash equivalents. Copilot namespaces commands by plugin name:
```
/ponytail:ponytail ultra
/ponytail:ponytail-review
```

### Pi Agent Harness

```bash
pi install git:github.com/DietrichGebert/ponytail
```

Skills and lifecycle hooks auto-load; commands available.

### OpenCode

Run OpenCode from a checkout of this repo. Add to your project's `opencode.json`:

```json
{ "plugin": ["./.opencode/plugins/ponytail.mjs"] }
```

For shared checkout across projects, use absolute path. Injects ruleset every turn, registers `/ponytail` slash commands (`lite/full/ultra/off` levels).

### Gemini CLI (and Antigravity CLI via migration)

```bash
gemini extensions install https://github.com/DietrichGebert/ponytail
```

Loads ruleset always-on and registers `/ponytail` commands. Skills activate when needed.

For **Antigravity CLI** (Google's rename of Gemini CLI):
```bash
agy plugin install https://github.com/DietrichGebert/ponytail
```

Converts `/ponytail` commands into skills; invoke as chat messages (e.g., `/ponytail-review` as a message).

### OpenClaw

```bash
clawhub install ponytail
```

Installs from ClawHub. Also available: `clawhub install ponytail-review`, `clawhub install ponytail-audit`, `clawhub install ponytail-debt`, `clawhub install ponytail-help`.

Without ClawHub: copy `.openclaw/skills/ponytail` directory into `~/.openclaw/skills/`.

### Editor Adapters (Instruction-Only Mode)

For **Cursor**, **Windsurf**, **Cline**, **Kiro**, **GitHub Copilot Editor**, **Aider**: copy rules from repo:

- **Cursor**: copy `.cursor/rules/ponytail.mdc`
- **Windsurf**: copy `.windsurf/rules/ponytail.md`
- **Cline**: copy `.clinerules/ponytail.md`
- **Kiro**: copy `.kiro/steering/ponytail.md` to `~/.kiro/steering/` (global) or `.kiro/steering/` (project)
- **GitHub Copilot (editor)**: copy `.github/copilot-instructions.md`, or global at `~/.copilot/copilot-instructions.md`
- **Aider**: uses `AGENTS.md`

VS Code with Codex extension reads `AGENTS.md` from project root or `~/.codex/AGENTS.md` globally—no setup needed.

---

## Key Features & Examples

### Core Philosophy: Six Rungs

Before writing any code, stop at the first rung that holds:

1. **Does this need to exist?** → skip it (YAGNI—You Aren't Gonna Need It)
2. **Does stdlib do it?** → use it
3. **Does a native platform feature cover it?** → use it
4. **Is there an installed dependency?** → use it
5. **Can this be one line?** → make it one line
6. **Only then**: write the minimum code that works

### Example: Email Validation

**Without Ponytail** (27 lines):
```python
import re
EMAIL_PATTERN = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
class EmailValidator:
    """Validates email addresses against RFC-like rules."""
    def __init__(self, pattern: re.Pattern = EMAIL_PATTERN):
        self.pattern = pattern
    def validate(self, email: str) -> bool:
        if not isinstance(email, str):
            raise TypeError("email must be a string")
        email = email.strip()
        if not email:
            return False
        return bool(self.pattern.match(email))
```

**With Ponytail** (1 line):
```python
# ponytail: good enough, real validation is sending the mail
"@" in email and "." in email.split("@")[-1]
```

Or stdlib-first (2 lines):
```python
from email.utils import parseaddr
"@" in parseaddr(email)[1]
```

### Example: Date Picker

**Without Ponytail** (30 lines + 1 dependency):
```jsx
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { useEffect, useRef } from "react";
export default function DatePicker({ value, onChange, minDate, maxDate }) {
  const inputRef = useRef(null);
  const instanceRef = useRef(null);
  useEffect(() => {
    instanceRef.current = flatpickr(inputRef.current, {
      defaultDate: value, minDate, maxDate, dateFormat: "Y-m-d",
      onChange: ([date]) => onChange(date),
    });
    return () => instanceRef.current?.destroy();
  }, []);
  useEffect(() => {
    instanceRef.current?.setDate(value, false);
  }, [value]);
  return <input ref={inputRef} className="date-picker" />;
}
```

**With Ponytail** (1 line, 0 dependencies):
```html
<!-- ponytail: browser has one -->
<input type="date">
```

Native, accessible, localized, keyboard-navigable, mobile-friendly.

### Marking Shortcuts

Use `ponytail:` comments to mark intentional simplifications and name their upgrade path:

```python
# ponytail: O(n²) scan; upgrade path: hash table if n > 10000
for item in items:
    if item in reference_list:
        pass
```

---

## Configuration

### Environment Variables

- **`PONYTAIL_DEFAULT_MODE`**: Set to `lite`, `full`, `ultra`, or `off` to set default intensity for new sessions

### Config Files

Optional files for default settings:

- **Linux/macOS**: `~/.config/ponytail/config.json`
- **Windows**: `%APPDATA%\ponytail\config.json`

Example:
```json
{ "defaultMode": "full" }
```

### `.env` File

For development/benchmarking (gitignored):
```
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Commands (Skill-Capable Hosts Only)

Available on Claude Code, Codex, OpenCode, Gemini/Antigravity CLI, and pi harness. Not on editor adapters.

| Command | What It Does |
|---------|--------------|
| `/ponytail [lite\|full\|ultra\|off]` | Set intensity or toggle off. No argument reports current level. |
| `/ponytail-review` | Review current diff for over-engineering; returns delete list. |
| `/ponytail-audit` | Audit entire repo for over-engineering, not just the diff. |
| `/ponytail-debt` | Harvest all deferred `ponytail:` shortcuts into a ledger. |
| `/ponytail-help` | Quick reference for commands above. |

**Note on Codex**: Invoke with `@` prefix (e.g., `@ponytail-review`).

---

## Supported Agent Tools (13)

Ponytail ships installers and rule files for:

1. **Claude Code** (plugin via marketplace)
2. **Codex** (plugin with lifecycle hooks)
3. **GitHub Copilot CLI** (plugin namespaced)
4. **Pi Agent Harness** (package install)
5. **OpenCode** (plugin via `.mjs`)
6. **Gemini CLI** (extension install)
7. **Antigravity CLI** (plugin install, converted to skills)
8. **OpenClaw** (skill via ClawHub)
9. **Cursor** (instruction-only, `.cursor/rules/ponytail.mdc`)
10. **Windsurf** (instruction-only, `.windsurf/rules/ponytail.md`)
11. **Cline** (instruction-only, `.clinerules/ponytail.md`)
12. **Kiro** (instruction-only, `.kiro/steering/ponytail.md`)
13. **GitHub Copilot (editor)** (instruction-only, `.github/copilot-instructions.md`)

Additional editors with read-only support: **Aider** (reads `AGENTS.md`), **VS Code Codex** (reads `AGENTS.md` from project or `~/.codex/`).

---

## Rule Summary

- No abstractions that weren't explicitly requested.
- No new dependency if it can be avoided.
- No boilerplate nobody asked for.
- Deletion over addition. Boring over clever. Fewest files possible.
- Question complex requests: "Do you actually need X, or does Y cover it?"
- When two stdlib approaches are equal size, pick the edge-case-correct one.
- Mark intentional simplifications with a `ponytail:` comment naming the ceiling and upgrade path.

**Not lazy about**: input validation at trust boundaries, error handling that prevents data loss, security, accessibility, platform calibration (clocks drift, sensors read off), anything explicitly requested. Non-trivial logic always leaves ONE runnable check (assert-based demo or one small test; no frameworks).

---

## Performance Metrics (Benchmark Data)

Five everyday tasks tested across Haiku, Sonnet, and Opus; 10 runs each:

- **Code reduction**: 80–94% fewer lines than no-skill baseline
- **Cost reduction**: 47–77% cheaper than no-skill baseline
- **Speed**: 3–6× faster than no-skill baseline

Ponytail vs. caveman skill: Ponytail wins on every model and every task tested.

See `benchmarks/` and `benchmarks/results/` for full methodology and production-grade task examples.

---

## References

- **GitHub**: https://github.com/DietrichGebert/ponytail
- **License**: MIT
- **Current Version**: 4.7.0
- **Author**: Dietrich Gebert
