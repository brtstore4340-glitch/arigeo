# Ponytail: Code Snippets with Decision Ruleset

## Executive Summary

**Ponytail** — the "lazy senior dev" framework — embeds a decision ladder + ruleset across 13 agent platforms via shared hooks (Node.js lifecycle), plugin manifests (JSON), and extension APIs. The core ruleset is portable and mode-selectable (lite/full/ultra).

---

## 1. AGENTS.md – The Canonical Ruleset

The master decision ladder and behavior rules live in `/AGENTS.md`. This is the source of truth injected into every agent type.

```markdown
# Ponytail, lazy senior dev mode

You are a lazy senior developer. Lazy means efficient, not careless. The best code is the code never written.

Before writing any code, stop at the first rung that holds:

1. Does this need to be built at all? (YAGNI)
2. Does the standard library already do this? Use it.
3. Does a native platform feature cover it? Use it.
4. Does an already-installed dependency solve it? Use it.
5. Can this be one line? Make it one line.
6. Only then: write the minimum code that works.

Rules:

- No abstractions that weren't explicitly requested.
- No new dependency if it can be avoided.
- No boilerplate nobody asked for.
- Deletion over addition. Boring over clever. Fewest files possible.
- Question complex requests: "Do you actually need X, or does Y cover it?"
- Pick the edge-case-correct option when two stdlib approaches are the same size, lazy means less code, not the flimsier algorithm.
- Mark intentional simplifications with a `ponytail:` comment. If the shortcut has a known ceiling (global lock, O(n²) scan, naive heuristic), the comment names the ceiling and the upgrade path.

Not lazy about: input validation at trust boundaries, error handling that prevents data loss, security, accessibility, the calibration real hardware needs (the platform is never the spec ideal, a clock drifts, a sensor reads off), anything explicitly requested. Lazy code without its check is unfinished: non-trivial logic leaves ONE runnable check behind, the smallest thing that fails if the logic breaks (an assert-based demo/self-check or one small test file; no frameworks, no fixtures). Trivial one-liners need no test.

(Yes, this file also applies to agents working on the ponytail repo itself. Especially to them.)
```

---

## 2. Hook: `ponytail-activate.js` – SessionStart Injection

Runs on every session start in Claude Code / Codex. Writes the flag file and emits the ruleset.

```javascript
#!/usr/bin/env node
// ponytail — Claude Code SessionStart activation hook
//
// Runs on every session start:
//   1. Writes flag file at ~/.claude/.ponytail-active (statusline reads this)
//   2. Emits ponytail ruleset as hidden SessionStart context
//   3. Detects missing statusline config and emits setup nudge

const fs = require('fs');
const path = require('path');
const { getDefaultMode, getClaudeDir } = require('./ponytail-config');
const { getPonytailInstructions } = require('./ponytail-instructions');
const {
  clearMode,
  isCodex,
  setMode,
  writeHookOutput,
} = require('./ponytail-runtime');

const claudeDir = getClaudeDir();
const settingsPath = path.join(claudeDir, 'settings.json');

const mode = getDefaultMode();

// "off" mode — skip activation entirely, don't write flag or emit rules
if (mode === 'off') {
  clearMode();
  writeHookOutput('SessionStart', 'off', isCodex ? '' : 'OK');
  process.exit(0);
}

// 1. Write flag file
try {
  setMode(mode);
} catch (e) {
  // Silent fail -- flag is best-effort, don't block the hook
}

// 2. Emit the ponytail ruleset, filtered to the active intensity level.
let output = getPonytailInstructions(mode);

// 3. Detect missing statusline config — nudge Claude to help set it up
if (!isCodex) try {
  let hasStatusline = false;
  if (fs.existsSync(settingsPath)) {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    if (settings.statusLine) {
      hasStatusline = true;
    }
  }

  if (!hasStatusline) {
    const isWindows = process.platform === 'win32';
    const scriptName = isWindows ? 'ponytail-statusline.ps1' : 'ponytail-statusline.sh';
    const scriptPath = path.join(__dirname, scriptName);
    const command = isWindows
      ? `powershell -ExecutionPolicy Bypass -File "${scriptPath}"`
      : `bash "${scriptPath}"`;
    const statusLineSnippet =
      '"statusLine": { "type": "command", "command": ' + JSON.stringify(command) + ' }';
    output += "\n\n" +
      "STATUSLINE SETUP NEEDED: The ponytail plugin includes a statusline badge showing active mode " +
      "(e.g. [PONYTAIL], [PONYTAIL:ULTRA]). It is not configured yet. " +
      "To enable, add this to ~/.claude/settings.json: " +
      statusLineSnippet + " " +
      "Proactively offer to set this up for the user on first interaction.";
  }
} catch (e) {
  // Silent fail — don't block session start over statusline detection
}

writeHookOutput('SessionStart', mode, output);
```

**Key insight:** The hook injects the full ruleset at session start as hidden context, avoiding re-injection overhead on every turn.

---

## 3. Hook: `ponytail-config.js` – Mode Resolution

Central mode normalizer. Handles environment variable, config file, and default fallbacks across platforms.

```javascript
#!/usr/bin/env node
// ponytail — shared configuration resolver
//
// Resolution order for default mode:
//   1. PONYTAIL_DEFAULT_MODE environment variable
//   2. Config file defaultMode field:
//      - $XDG_CONFIG_HOME/ponytail/config.json (any platform, if set)
//      - ~/.config/ponytail/config.json (macOS / Linux fallback)
//      - %APPDATA%\ponytail\config.json (Windows fallback)
//   3. 'full'

const fs = require('fs');
const path = require('path');
const os = require('os');

const DEFAULT_MODE = 'full';
const VALID_MODES = ['off', 'lite', 'full', 'ultra', 'review'];
const RUNTIME_MODES = ['off', 'lite', 'full', 'ultra'];

function normalizeMode(mode) {
  if (typeof mode !== 'string') return null;
  const normalized = mode.trim().toLowerCase();
  return RUNTIME_MODES.includes(normalized) ? normalized : null;
}

function normalizeConfigMode(mode) {
  if (typeof mode !== 'string') return null;
  const normalized = mode.trim().toLowerCase();
  return VALID_MODES.includes(normalized) ? normalized : null;
}

function normalizePersistedMode(mode) {
  return normalizeMode(mode) || normalizeConfigMode(mode);
}

function getConfigDir() {
  if (process.env.XDG_CONFIG_HOME) {
    return path.join(process.env.XDG_CONFIG_HOME, 'ponytail');
  }
  if (process.platform === 'win32') {
    return path.join(
      process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'),
      'ponytail'
    );
  }
  return path.join(os.homedir(), '.config', 'ponytail');
}

function getConfigPath() {
  return path.join(getConfigDir(), 'config.json');
}

function getClaudeDir() {
  // ponytail: CLAUDE_CONFIG_DIR overrides ~/.claude, matching Claude Code.
  return process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
}

function getDefaultMode() {
  // 1. Environment variable (highest priority)
  const envMode = process.env.PONYTAIL_DEFAULT_MODE;
  if (envMode && VALID_MODES.includes(envMode.toLowerCase())) {
    return envMode.toLowerCase();
  }

  // 2. Config file
  try {
    const configPath = getConfigPath();
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (config.defaultMode && VALID_MODES.includes(config.defaultMode.toLowerCase())) {
      return config.defaultMode.toLowerCase();
    }
  } catch (e) {
    // Config file doesn't exist or is invalid — fall through
  }

  // 3. Default
  return DEFAULT_MODE;
}

function writeDefaultMode(mode) {
  const normalized = normalizeConfigMode(mode);
  if (!normalized) return null;

  const configPath = getConfigPath();
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify({ defaultMode: normalized }, null, 2), 'utf8');
  return normalized;
}

module.exports = {
  DEFAULT_MODE,
  VALID_MODES,
  RUNTIME_MODES,
  getDefaultMode,
  getConfigDir,
  getConfigPath,
  getClaudeDir,
  normalizeMode,
  normalizeConfigMode,
  normalizePersistedMode,
  writeDefaultMode,
};
```

**Key insight:** Centralized resolution order (env > config file > default) avoids duplication across platforms.

---

## 4. Hook: `ponytail-instructions.js` – Mode-Selective Ruleset Filter

Filters the skill body to show only the intensity level requested (lite/full/ultra).

```javascript
#!/usr/bin/env node
// Shared Ponytail instruction builder for Claude hooks and Pi extension.

const fs = require('fs');
const path = require('path');
const { DEFAULT_MODE, normalizeMode, normalizePersistedMode } = require('./ponytail-config');

const INDEPENDENT_MODES = new Set(['review']);
const SKILL_PATH = path.join(__dirname, '..', 'skills', 'ponytail', 'SKILL.md');

function filterSkillBodyForMode(body, mode) {
  const effectiveMode = normalizeMode(mode) || DEFAULT_MODE;
  const withoutFrontmatter = String(body || '').replace(/^---[\s\S]*?---\s*/, '');

  // Only the intensity table rows and worked examples are mode-specific, and
  // both are keyed by a mode name (lite/full/ultra). A bullet whose label is
  // not a mode — e.g. "No unrequested abstractions: ..." — is a normal rule
  // and must be kept verbatim.
  return withoutFrontmatter
    .split(/\r?\n/)
    .filter((line) => {
      const tableLabel = line.match(/^\|\s*\*\*(.+?)\*\*\s*\|/);
      if (tableLabel) {
        const labelMode = normalizeMode(tableLabel[1].trim());
        if (labelMode) return labelMode === effectiveMode;
      }

      const exampleLabel = line.match(/^-\s*([^:]+):\s*/);
      if (exampleLabel) {
        const labelMode = normalizeMode(exampleLabel[1].trim());
        if (labelMode) return labelMode === effectiveMode;
      }

      return true;
    })
    .join('\n');
}

function getFallbackInstructions(mode) {
  return 'PONYTAIL MODE ACTIVE — level: ' + mode + '\n\n' +
    'You are a lazy senior developer. Lazy means efficient, not careless. The best code is the code never written.\n\n' +
    '## Persistence\n\n' +
    'ACTIVE EVERY RESPONSE. No drift back to over-building. Still active if unsure. Off only: "stop ponytail" / "normal mode".\n\n' +
    'Current level: **' + mode + '**. Switch: `/ponytail lite|full|ultra`.\n\n' +
    '## The ladder\n\n' +
    'Before any code, stop at the first rung that holds:\n' +
    '1. Does this need to be built at all? (YAGNI)\n' +
    '2. Does the standard library do this? Use it.\n' +
    '3. Does a native platform feature cover it? Use it.\n' +
    '4. Does an already-installed dependency solve it? Use it.\n' +
    '5. Can this be one line? Make it one line.\n' +
    '6. Only then: write the minimum code that works.\n\n' +
    '## Rules\n\n' +
    'No abstractions that were not requested. No avoidable dependencies. No boilerplate nobody asked for. ' +
    'Deletion over addition. Boring over clever. Fewest files possible. ' +
    'Ship the lazy version and question the complex request in the same response — never stall. ' +
    'Between two same-size stdlib options, pick the one correct on edge cases. ' +
    'Mark intentional simplifications with a `ponytail:` comment — a shortcut with a known ceiling names the ceiling and the upgrade path in the comment.\n\n' +
    '## Output\n\n' +
    'Code first. Then at most three short lines: what was skipped, when to add it. ' +
    'If the explanation is longer than the code, delete the explanation. ' +
    'Explanation the user explicitly asked for is not debt, give it in full.\n\n' +
    '## When NOT to be lazy\n\n' +
    'Never simplify away: input validation at trust boundaries, error handling that prevents data loss, ' +
    'security measures, accessibility basics, the calibration real hardware needs (the platform is never the spec ideal), anything the user explicitly asked to keep. ' +
    'Lazy code without its check is unfinished: non-trivial logic leaves ONE runnable check behind (assert-based demo/self-check or one small test file; no frameworks). Trivial one-liners need no test.\n\n' +
    '## Boundaries\n\n' +
    'Ponytail governs what you build, not how you talk. "stop ponytail" or "normal mode": revert. Level persists until changed or session end.';
}

function getPonytailInstructions(mode) {
  const configuredMode = normalizePersistedMode(mode) || DEFAULT_MODE;

  if (INDEPENDENT_MODES.has(configuredMode)) {
    return 'PONYTAIL MODE ACTIVE — level: ' + configuredMode + '. Behavior defined by /ponytail-' + configuredMode + ' skill.';
  }

  const effectiveMode = normalizeMode(configuredMode) || DEFAULT_MODE;

  try {
    return 'PONYTAIL MODE ACTIVE — level: ' + effectiveMode + '\n\n' +
      filterSkillBodyForMode(fs.readFileSync(SKILL_PATH, 'utf8'), effectiveMode);
  } catch (e) {
    return getFallbackInstructions(effectiveMode);
  }
}

module.exports = {
  filterSkillBodyForMode,
  getFallbackInstructions,
  getPonytailInstructions,
};
```

**Key insight:** Mode filtering happens at hook time or skill composition, avoiding per-turn overhead.

---

## 5. Extension: `pi-extension/index.js` – Claude Code Command Integration

Registers `/ponytail` command and manages session mode state.

```javascript
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  DEFAULT_MODE,
  getDefaultMode,
  normalizeMode,
  normalizeConfigMode,
  normalizePersistedMode,
  writeDefaultMode,
} = require("../hooks/ponytail-config.js");
const { getPonytailInstructions, filterSkillBodyForMode } = require("../hooks/ponytail-instructions.js");

export { filterSkillBodyForMode };
export const readDefaultMode = getDefaultMode;

export function resolveSessionMode(entries, fallbackMode = DEFAULT_MODE) {
  const fallback = normalizePersistedMode(fallbackMode) || DEFAULT_MODE;
  if (!Array.isArray(entries)) return fallback;

  for (let i = entries.length - 1; i >= 0; i -= 1) {
    const entry = entries[i];
    if (entry?.type !== "custom" || entry?.customType !== "ponytail-mode") continue;

    const mode = normalizePersistedMode(entry?.data?.mode);
    if (mode) return mode;
  }

  return fallback;
}

export function parsePonytailCommand(text, defaultMode = DEFAULT_MODE) {
  const fallback = normalizePersistedMode(defaultMode) || DEFAULT_MODE;
  const normalizedText = String(text || "").trim().toLowerCase();

  if (!normalizedText) {
    return { type: "set-mode", mode: fallback === "off" ? "full" : fallback };
  }

  const [primary, secondary] = normalizedText.split(/\s+/);

  if (primary === "status") return { type: "status" };

  if (primary === "default") {
    const mode = normalizeConfigMode(secondary);
    return mode ? { type: "set-default", mode } : { type: "invalid", reason: "invalid-default-mode" };
  }

  const mode = normalizeMode(primary);
  return mode ? { type: "set-mode", mode } : { type: "invalid", reason: "invalid-mode", mode: primary };
}

export { writeDefaultMode };

export default function ponytailExtension(pi) {
  let currentMode = DEFAULT_MODE;
  let configuredDefaultMode = getDefaultMode();

  const setMode = (mode, ctx) => {
    const normalized = normalizePersistedMode(mode);
    if (!normalized) return;

    currentMode = normalized;
    pi.appendEntry("ponytail-mode", { mode: normalized });
    ctx?.ui?.notify?.(`Ponytail mode set to ${normalized}.`, "info");
  };

  const sendAlias = (skillName, args, ctx) => {
    const normalized = String(args || "").trim();
    const message = normalized ? `${skillName} ${normalized}` : skillName;

    if (ctx?.isIdle?.() === false) {
      pi.sendUserMessage(message, { deliverAs: "followUp" });
      ctx?.ui?.notify?.(`${skillName} queued as follow-up.`, "info");
      return;
    }

    pi.sendUserMessage(message);
  };

  pi.registerCommand("ponytail", {
    description: "Set or report Ponytail mode",
    handler: async (args, ctx) => {
      const parsed = parsePonytailCommand(args, configuredDefaultMode);

      if (parsed.type === "status") {
        ctx?.ui?.notify?.(`Ponytail: current ${currentMode} • default ${configuredDefaultMode}`, "info");
        return;
      }

      if (parsed.type === "set-default") {
        const written = writeDefaultMode(parsed.mode);
        if (written) {
          configuredDefaultMode = getDefaultMode();
          const message = configuredDefaultMode === written
            ? `Default Ponytail mode set to ${written}.`
            : `Saved default ${written}, but env override keeps default at ${configuredDefaultMode}.`;
          ctx?.ui?.notify?.(message, "info");
        }
        return;
      }

      if (parsed.type === "set-mode") {
        setMode(parsed.mode, ctx);
        return;
      }

      ctx?.ui?.notify?.("Unknown or unsupported /ponytail mode.", "warning");
    },
  });

  pi.registerCommand("ponytail-review", {
    description: "Run /skill:ponytail-review",
    handler: (_args, ctx) => sendAlias("/skill:ponytail-review", "", ctx),
  });

  pi.registerCommand("ponytail-audit", {
    description: "Run /skill:ponytail-audit",
    handler: (_args, ctx) => sendAlias("/skill:ponytail-audit", "", ctx),
  });

  pi.registerCommand("ponytail-debt", {
    description: "Run /skill:ponytail-debt",
    handler: (_args, ctx) => sendAlias("/skill:ponytail-debt", "", ctx),
  });

  pi.registerCommand("ponytail-help", {
    description: "Run /skill:ponytail-help",
    handler: (_args, ctx) => sendAlias("/skill:ponytail-help", "", ctx),
  });

  pi.on("input", async (event) => {
    if (event?.source === "extension") return;

    const text = String(event?.text || "");
    if (currentMode !== "off" && /\b(stop ponytail|normal mode)\b/i.test(text)) {
      setMode("off");
    }
  });

  pi.on("session_start", async (_event, ctx) => {
    const entries = ctx?.sessionManager?.getBranch?.() || ctx?.sessionManager?.getEntries?.() || [];
    configuredDefaultMode = getDefaultMode();
    currentMode = resolveSessionMode(entries, configuredDefaultMode);
  });

  pi.on("before_agent_start", async (event) => {
    if (!currentMode || currentMode === "off") return;
    return { systemPrompt: `${event.systemPrompt}\n\n${getPonytailInstructions(currentMode)}` };
  });
}
```

**Key insight:** The extension manages session-level mode state and re-injects the ruleset on agent start.

---

## 6. Plugin Manifests – Cross-Platform Declaration

### 6a. Claude Code (`.claude-plugin/plugin.json`)

```json
{
  "name": "ponytail",
  "version": "4.7.0",
  "description": "Lazy senior dev mode. Forces the simplest, shortest solution that actually works: YAGNI, stdlib first, no unrequested abstractions.",
  "author": {
    "name": "Dietrich Gebert",
    "url": "https://github.com/DietrichGebert"
  }
}
```

### 6b. Codex (`.codex-plugin/plugin.json`)

```json
{
  "name": "ponytail",
  "version": "4.7.0",
  "description": "Lazy senior dev mode. Forces the simplest, shortest solution that actually works: YAGNI, stdlib first, no unrequested abstractions.",
  "author": {
    "name": "Dietrich Gebert",
    "url": "https://github.com/DietrichGebert"
  },
  "homepage": "https://github.com/DietrichGebert/ponytail",
  "repository": "https://github.com/DietrichGebert/ponytail",
  "license": "MIT",
  "keywords": ["yagni", "minimalism", "code-review", "productivity"],
  "skills": "./skills/",
  "interface": {
    "displayName": "Ponytail",
    "shortDescription": "Lazy senior developer mode",
    "longDescription": "Prefer YAGNI, the standard library, native platform features, and the smallest correct implementation.",
    "developerName": "Dietrich Gebert",
    "category": "Productivity",
    "capabilities": ["Instructions", "Lifecycle hooks"],
    "websiteURL": "https://github.com/DietrichGebert/ponytail",
    "defaultPrompt": [
      "Use Ponytail mode for this task.",
      "Review this diff for over-engineering.",
      "Find the smallest correct implementation."
    ],
    "brandColor": "#111111",
    "composerIcon": "./assets/logo.png",
    "logo": "./assets/logo.png"
  }
}
```

### 6c. GitHub Copilot (`.github/plugin/plugin.json`)

```json
{
  "name": "ponytail",
  "description": "Lazy senior dev mode. Forces the simplest, shortest solution that actually works: YAGNI, stdlib first, no unrequested abstractions.",
  "version": "4.7.0",
  "author": {
    "name": "Dietrich Gebert",
    "url": "https://github.com/DietrichGebert"
  },
  "homepage": "https://github.com/DietrichGebert/ponytail",
  "repository": "https://github.com/DietrichGebert/ponytail",
  "license": "MIT",
  "keywords": ["yagni", "minimalism", "code-review", "productivity"],
  "commands": "commands/",
  "skills": "skills/",
  "hooks": "hooks/copilot-hooks.json"
}
```

### 6d. Gemini Extension (`gemini-extension.json`)

```json
{
  "name": "ponytail",
  "version": "4.7.0",
  "description": "Lazy senior dev mode. Forces the simplest, shortest solution that actually works: YAGNI, stdlib first, no unrequested abstractions.",
  "contextFileName": "AGENTS.md"
}
```

**Key insight:** Different platforms link to the ruleset differently:
- Claude/Codex: full plugin manifest with skills + hooks
- Copilot: commands + skills + hooks
- Gemini: simple context file reference (AGENTS.md)
- OpenCode: plugin module loader (opencode.json → .opencode/plugins/ponytail.mjs)

### 6e. GitHub Copilot Instructions (`.github/copilot-instructions.md`)

Same as AGENTS.md (verbatim copy for Copilot).

---

## 7. Real-World Examples – Before/After

### Example 1: Date Picker

**Task:** "Add a date picker to this form."

**Without Ponytail:**
```bash
npm install flatpickr
```
```jsx
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { useEffect, useRef } from "react";

export default function DatePicker({ value, onChange, minDate, maxDate }) {
  const inputRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    instanceRef.current = flatpickr(inputRef.current, {
      defaultDate: value,
      minDate,
      maxDate,
      dateFormat: "Y-m-d",
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
**1 dependency + 30 lines**

**With Ponytail:**
```html
<!-- ponytail: browser has one -->
<input type="date">
```
**0 dependencies + 1 line.** Native, accessible, localized, keyboard-navigable, mobile-friendly.

---

### Example 2: Email Validation

**Task:** "Validate an email address in Python."

**Without Ponytail:**
```python
import re

EMAIL_PATTERN = re.compile(
    r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
)

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


def validate_email(email: str) -> bool:
    """Convenience wrapper around EmailValidator."""
    return EmailValidator().validate(email)
```
**27 lines. Still rejects valid addresses and accepts invalid ones.**

**With Ponytail:**
```python
# ponytail: good enough, real validation is sending the mail
"@" in email and "." in email.split("@")[-1]
```
Or, if thorough validation is needed:
```python
# ponytail: stdlib covers this
from email.utils import parseaddr
"@" in parseaddr(email)[1]
```
**1 line + honest answer:** Let the confirmation email reject it.

---

## 8. Summary: Pattern for Ruleset Portability

| Component | Purpose | Shared Across |
|-----------|---------|---------------|
| `AGENTS.md` | Master ruleset + decision ladder | All 13 platforms |
| `ponytail-config.js` | Mode resolution (env → file → default) | Node.js hooks + Pi extension |
| `ponytail-instructions.js` | Mode-filtered ruleset injection | Node.js hooks + Pi extension |
| `ponytail-activate.js` | SessionStart hook (writes flag, injects rules) | Claude Code + Codex |
| `pi-extension/index.js` | Claude Code command integration | Claude Code only |
| `.claude-plugin/plugin.json` | Plugin manifest | Claude Code |
| `.codex-plugin/plugin.json` | Plugin manifest | Codex |
| `.github/plugin/plugin.json` | Plugin manifest | GitHub Copilot CLI |
| `.github/copilot-instructions.md` | Copilot-native instructions | GitHub Copilot CLI |
| `gemini-extension.json` | Gemini context reference | Google Gemini |
| `opencode.json` + `.opencode/plugins/` | OpenCode plugin loader | OpenCode |

**Portability strategy:**
1. **Core ruleset** (AGENTS.md) is language-agnostic prose — copied verbatim to each platform's native instruction format.
2. **Shared hooks** (Node.js) handle mode resolution and filtering — reused across platforms that support Node.js lifecycle hooks.
3. **Platform-specific entry points** (commands, extensions, context files) delegate to shared config/instructions modules.
4. **One-line examples** with `ponytail:` comments mark intentional shortcuts and upgrade paths.

---

Generated 2026-06-17 from: `/home/user/ghq/github.com/DietrichGebert/ponytail`
