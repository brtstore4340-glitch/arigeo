---
name: 1831-code-snippets
description: This document captures the essential code patterns, entry points, and implementa
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-07
  source: fleet-memory
---

# Workshop 01 — MAW Plugin Code Snippets

**Date:** 2026-06-07 | **Analyzed:** 12 oracle submissions | **Framework:** maw-js plugin SDK

This document captures the essential code patterns, entry points, and implementation idioms from the Oracle School workshop plugin submissions. Serves as a reference for understanding the maw-js SDK and plugin architecture.

---

## Table of Contents

1. [Plugin Architecture Overview](#plugin-architecture-overview)
2. [Configuration: plugin.json](#configuration-pluginjson)
3. [Entry Points & Handler Signatures](#entry-points--handler-signatures)
4. [Core Patterns](#core-patterns)
5. [Command Implementations](#command-implementations)
6. [Type System & Interfaces](#type-system--interfaces)
7. [Error Handling](#error-handling)
8. [Advanced Features](#advanced-features)

---

## Plugin Architecture Overview

### Workshop Structure

```
submissions/<oracle-name>/
├── plugin.json          # Configuration & metadata
├── index.ts             # Entry point handler function
├── [optional files]
│   ├── chronicle.test.ts     # TDD unit tests
│   ├── BOOK.md or BLOG.md    # Documentation
│   ├── proof/                # Screenshots & proof
│   └── chronicle-feed.json   # Data samples
```

### Plugin Lifecycle

```
maw <plugin-name> <command> [args...]
       ↓
  SDK loads plugin.json
       ↓
  SDK imports index.ts (default export)
       ↓
  Handler called with InvokeContext
       ↓
  Returns InvokeResult { ok, output, error, exitCode }
```

---

## Configuration: plugin.json

### Minimal Configuration (Atlas, Jizo, Vessel)

```json
{
  "name": "atlas",
  "version": "1.0.0",
  "sdk": "^1.0.0",
  "description": "Atlas Oracle — He Who Holds the Sky",
  "surfaces": { "cli": "maw atlas" },
  "capabilities": ["fs:read", "sdk:plugin"]
}
```

**Key Fields:**
- `name` — Plugin identifier (must match directory name in `~/.maw/plugins/`)
- `sdk` — Semantic version constraint for maw-js SDK
- `surfaces` — Interface declaration; "cli" = command-line invocation
- `capabilities` — Permissions requested; common: `["fs:read", "sdk:plugin"]`

### Extended Configuration (BongBaeng, ChaiKlang)

```json
{
  "name": "bongbaeng",
  "version": "1.0.0",
  "entry": "./index.ts",
  "sdk": "^1.0.0",
  "description": "บ๊องแบ๊ง Oracle — ลูกศิษย์ขยันแห่งทุ่งกว้าง 🐆",
  "author": "twentyfxurth-k",
  "cli": {
    "command": "bongbaeng",
    "aliases": ["bb"],
    "help": "maw bongbaeng — บ๊องแบ๊ง Oracle commands"
  },
  "weight": 10,
  "license": "MIT",
  "schemaVersion": 1
}
```

**Extended Fields:**
- `entry` — Explicit entry point (defaults to `index.ts` or `index.js`)
- `cli.aliases` — Short command names (e.g., `maw bb` = `maw bongbaeng`)
- `weight` — Plugin load priority; higher = earlier
- `author` — Plugin maintainer
- `schemaVersion` — Config schema revision (currently 1)

---

## Entry Points & Handler Signatures

### Pattern 1: Simple API Mode (Atlas, Vessel, Jizo)

**Used by:** Plugins with minimal complexity

```typescript
// submissions/atlas/index.ts
export default function (api: any) {
  api.command("say", async (log: any, args: string[]) => {
    const name = args[0] || "world";
    log(`🏛️ Atlas Oracle: Hello, ${name}!`);
    log(`   ท้องฟ้าไม่ร่วง เพราะมีคนแบกอยู่`);
  });

  api.command("status", async (log: any) => {
    log(`🏛️ Atlas Oracle — He Who Holds the Sky`);
    log(`   role:   Discord fleet infrastructure`);
    log(`   human:  Nat (nazt)`);
    log(`   model:  Claude Opus 4.6 (1M context)`);
    log(`   fleet:  19 bots managed`);
  });
}
```

**Signature:** `(api: PluginAPI) => void`

**API Methods:**
- `api.command(name: string, handler: (log, args) => Promise<void>)` — Register command handler
- `log(message: string)` — Write output line
- `args: string[]` — Command arguments (excludes plugin name and command)

---

### Pattern 2: Modern Context Mode (ChaiKlang, BongBaeng, Leica, SomTor)

**Used by:** Plugins needing control flow, error handling, exit codes

```typescript
// submissions/chaiklang/index.ts
import type { InvokeContext, InvokeResult } from "maw-js/plugin/types";

export const command = {
  name: "chaiklang",
  description: "ChaiKlang Oracle (ชายกลาง) — the middle switchboard.",
};

export default async function handler(ctx: InvokeContext): Promise<InvokeResult> {
  const out: string[] = [];
  const log = (s: string) => (ctx.writer ? ctx.writer(s) : out.push(s));
  
  const done = (ok: boolean): InvokeResult => ({
    ok,
    output: ctx.writer ? "" : out.join("\n"),
    error: ok ? undefined : "",
    exitCode: ok ? 0 : 1,
  });

  const args = ctx.source === "cli" ? (ctx.args as string[]) : [];
  const sub = args[0]?.toLowerCase();

  if (!sub || sub === "help") {
    log("maw chaiklang — ChaiKlang Oracle (ชายกลาง), the middle switchboard 🎙️");
    log("  say [message]   say hello (default: hello world)");
    log("  status          identity + role");
    return done(true);
  }

  switch (sub) {
    case "say": {
      const msg = args.slice(1).join(" ").trim() || "hello world";
      log(`🎙️ ChaiKlang (ชายกลาง): ${msg}`);
      return done(true);
    }
    case "status": {
      log("🎙️ ChaiKlang Oracle (ชายกลาง) — online");
      log("   role:   admin-control & switchboard");
      return done(true);
    }
    default:
      log(`unknown: ${sub} — run 'maw chaiklang --help'`);
      return done(false);
  }
}
```

**Signature:** `(ctx: InvokeContext) => Promise<InvokeResult>`

**InvokeContext:**
```typescript
interface InvokeContext {
  source: "cli" | "api" | "webhook";  // Invocation origin
  args: string[];                      // Command arguments
  writer?: (line: string) => void;     // Output handler (if streaming)
  [key: string]: any;                  // Additional context-specific fields
}
```

**InvokeResult:**
```typescript
interface InvokeResult {
  ok: boolean;              // Success/failure flag
  output?: string;          // Captured output (if no writer)
  error?: string;           // Error message (if ok=false)
  exitCode?: number;        // Process exit code (default: 0/1 from ok)
}
```

---

### Pattern 3: Dual-Mode Handler (Gemini/No.6)

**Used by:** Plugins supporting both SDK API and context modes

```typescript
// submissions/gemini/index.ts
export default function (apiOrCtx: any) {
  // 1. Workshop SDK Mode (api.command registration)
  if (typeof apiOrCtx?.command === "function") {
    apiOrCtx.command("say", async (log: any, args: string[]) => {
      const name = args[0] || "world";
      log(`🛸 No.6 Gemini: Hello, ${name}!`);
      log(`   ความมืดเป็นของจักรวาล แต่แสงสว่างเกิดจากดวงดาว`);
    });

    apiOrCtx.command("status", async (log: any) => {
      log(`🛸 No.6 Gemini — Pack Leader & Researcher`);
      log(`   role:   Research & Incubation`);
      log(`   human:  Bo (borde9902)`);
      log(`   model:  Gemini 1.5 Pro / Ultra`);
    });
    return;  // Exit early; no InvokeResult in API mode
  }

  // 2. Local CLI Context Mode (direct invocation)
  const ctx = apiOrCtx;
  const args = ctx.source === "cli" ? (ctx.args as string[]) : [];
  const sub = args[0];
  const write = ctx.writer || console.log;

  if (sub === "say") {
    const name = args[1] || "world";
    write(`🛸 No.6 Gemini: Hello, ${name}!`);
    return { ok: true };
  } else if (sub === "status") {
    write(`🛸 No.6 Gemini — Pack Leader & Researcher`);
    return { ok: true };
  } else {
    write("usage: maw gemini <say|status> [args]");
    return { ok: true };
  }
}
```

**Advantage:** Works across multiple plugin runtimes without modifications.

**Detection Logic:**
- If `apiOrCtx.command` is a function → API mode
- Otherwise → Context mode (check `ctx.source`, `ctx.writer`)

---

## Core Patterns

### 1. Output Abstraction (Deferred vs Streamed)

Most plugins use this pattern to support both:
- **Buffered output** (no `ctx.writer`) — collect lines in array, return as string
- **Streamed output** (with `ctx.writer`) — write directly to handler

```typescript
// From ChaiKlang & SomTor
const out: string[] = [];
const log = (s: string) => (ctx.writer ? ctx.writer(s) : out.push(s));

const done = (ok: boolean): InvokeResult => ({
  ok,
  output: ctx.writer ? "" : out.join("\n"),
  error: ok ? undefined : "",
  exitCode: ok ? 0 : 1,
});
```

**Why:** Allows plugins to work in streaming (interactive) and batch (non-interactive) modes.

---

### 2. Command Routing via Switch

**Simple case (SomTor, Leica):**

```typescript
// From SomTor (submissions/somtor/index.ts)
const sub = args[0]?.toLowerCase();

if (!sub || sub === "--help" || sub === "help") {
  log("maw somtor — ตัวต่อแห่ง Discord 🐝");
  log("");
  log(COMMANDS);
  return done(true);
}

if (sub === "say") {
  const message = args.slice(1).join(" ") || "hello world! 🐝";
  log(`🐝 SomTor says: ${message}`);
  return done(true);
}

if (sub === "status") {
  log("🐝 SomTor Oracle Status");
  log("────────────────────────");
  return done(true);
}

// Fallback
log(`✗ unknown command: ${sub}`);
log(`try: maw somtor --help`);
return done(false);
```

**Advanced case (BongBaeng):**

```typescript
// From BongBaeng (submissions/bongbaeng/index.ts)
const sub = args[0] ?? "status";  // Default command

switch (sub) {
  case "say":
    cmdSay(rest);
    break;
  case "status":
  case "whoami":  // Alias
    cmdStatus();
    break;
  case "humans":
  case "list":    // Alias
    cmdHumans(rest);
    break;
  case "help":
  default:
    cmdHelp();
    break;
}

return { ok: true, output: logs.join("\n") || undefined };
```

**Key Differences:**
- SomTor: If/else chain → returns immediately per branch
- BongBaeng: Switch with multiple handlers → centralized return at end

---

### 3. Data Structures for Context

**Human/Fleet Registry (Orz):**

```typescript
// From submissions/orz/index.ts
interface Human {
  name: string;
  github?: string;
  oracle: string;
  fleet: string;
  note?: string;
}

const HUMANS: Human[] = [
  { name: "administrator",  github: "xaxixak",    oracle: "Orz",          fleet: "Kong's fleet (Sage lineage)", note: "Orz's principal" },
  { name: "Nat (พี่นัท)",     github: "nazt",       oracle: "Atlas + many", fleet: "Oracle School",               note: "school admin" },
  // ... more entries
];

// Query with filter
api.command("humans", async (log: any, args: string[]) => {
  const wantJson = args.includes("--json");
  const filter = args.find((a: string) => !a.startsWith("--"))?.toLowerCase();

  const rows = filter
    ? HUMANS.filter(h =>
        h.name.toLowerCase().includes(filter) ||
        h.github?.toLowerCase().includes(filter) ||
        h.oracle.toLowerCase().includes(filter) ||
        h.fleet.toLowerCase().includes(filter))
    : HUMANS;

  if (wantJson) {
    log(JSON.stringify(rows, null, 2));
    return;
  }

  log(`🎼 Humans known to Orz (${rows.length} of ${HUMANS.length} total)`);
  for (const h of rows) {
    const gh = h.github ? `@${h.github}` : `(no gh)`;
    log(`  ${h.name} — ${gh}`);
    log(`    Oracle: ${h.oracle}  ·  Fleet: ${h.fleet}`);
    if (h.note) log(`    note: ${h.note}`);
  }
});
```

**Simple Tuple Array (ChaiKlang):**

```typescript
// From submissions/chaiklang/index.ts
const HUMANS: Array<[string, string, string]> = [
  // human, oracle, github
  ["Nat", "Atlas", "@nazt"],
  ["Kong", "Orz", "@xaxixak"],
  ["Un", "Leica", "@switchaphon"],
  // ...
];
```

**Flat List (Leica):**

```typescript
// From submissions/leica/index.ts
const FAMILY = [
  "Codec", "Neon", "Chrome", "Pawrent", "Pops Clinic",
  "Vets Hub", "NodeRed Simulator", "RPRO Ent", "RPRO Ent Atlas",
  "Pops Atlas", "RPRO SaaS",
];
```

---

## Command Implementations

### say — Greeting Command

**Minimal (Vessel):**

```typescript
export default function (api: any) {
  api.command("say", async (log: any, args: string[]) => {
    const name = args[0] || "world";
    log(`📦 Vessel: Hello, ${name}!`);
    log(`   ตัวแทนหมู่บ้านไปเรียนรู้ และคอยมาสอนน้องๆ`);
    log(`   courier carries the world's knowledge home.`);
  });
}
```

**With Joins (SomTor):**

```typescript
api.command("say", async (log: any, args: string[]) => {
  const message = args.slice(1).join(" ") || "hello world! 🐝";
  log(`🐝 SomTor says: ${message}`);
  return done(true);
});
```

**In Switch (ChaiKlang):**

```typescript
case "say": {
  const msg = args.slice(1).join(" ").trim() || "hello world";
  log(`🎙️ ChaiKlang (ชายกลาง): ${msg}`);
  log("   อยู่ตรงกลาง เชื่อมทุกสาย คุมให้เรื่องเดินต่อ");
  return done(true);
}
```

---

### status — Identity & Role Command

**Standard Format (Atlas):**

```typescript
api.command("status", async (log: any) => {
  log(`🏛️ Atlas Oracle — He Who Holds the Sky`);
  log(`   role:   Discord fleet infrastructure`);
  log(`   human:  Nat (nazt)`);
  log(`   model:  Claude Opus 4.6 (1M context)`);
  log(`   fleet:  19 bots managed`);
});
```

**With Decorators (BongBaeng):**

```typescript
function cmdStatus() {
  console.log(`${BOLD}${RED}🐆 บ๊องแบ๊ง Oracle${RESET}`);
  console.log(`${DIM}─────────────────────────────────────${RESET}`);
  console.log(`${YELLOW}Name${RESET}    : บ๊องแบ๊ง (bongbaeng)`);
  console.log(`${YELLOW}Owner${RESET}   : ก้อง (twentyfxurth-k)`);
  console.log(`${YELLOW}Born${RESET}    : 2026-06-05`);
  console.log(`${YELLOW}Model${RESET}   : Claude Sonnet 4.6`);
  console.log(`${DIM}─────────────────────────────────────${RESET}`);
  console.log(`${YELLOW}5 Principles${RESET}:`);
  console.log(`  1. Nothing is Deleted`);
  console.log(`  2. Patterns Over Intentions`);
  console.log(`  3. External Brain, Not Command`);
  console.log(`  4. Curiosity Creates Existence 🐾`);
  console.log(`  5. Form and Formless`);
}
```

**With Computed Fields (Leica):**

```typescript
case "status": {
  log("🐱 Leica — Father Oracle");
  log("  runtime: Claude Code — Opus 4.6 (1M context)");
  log(`  family: ${FAMILY.length} oracles`);
  log("  owner: Un (switchaphon)");
  log("  master: Nat (nazt_)");
  log("  status: online — standby");
  break;
}
```

---

### humans — Roster & Search Command

**Tuple Loop (ChaiKlang):**

```typescript
case "humans": {
  log(`👥 Humans of the Oracle fleet (${HUMANS.length}):`);
  for (const [human, oracle, gh] of HUMANS) {
    log(`   • ${human.padEnd(6)} — ${oracle.padEnd(12)} ${gh}`);
  }
  log("   (🌀 Yoi = sealed, no human listed)");
  return done(true);
}
```

**Filtered with JSON Export (Orz):**

```typescript
api.command("humans", async (log: any, args: string[]) => {
  const wantJson = args.includes("--json");
  const filter = args.find((a: string) => !a.startsWith("--"))?.toLowerCase();

  const rows = filter
    ? HUMANS.filter(h =>
        h.name.toLowerCase().includes(filter) ||
        h.github?.toLowerCase().includes(filter) ||
        h.oracle.toLowerCase().includes(filter) ||
        h.fleet.toLowerCase().includes(filter))
    : HUMANS;

  if (wantJson) {
    log(JSON.stringify(rows, null, 2));
    return;
  }

  log(`🎼 Humans known to Orz (${rows.length} of ${HUMANS.length} total)`);
  log(``);

  if (rows.length === 0) {
    log(`  (no match for "${filter}")`);
    return;
  }

  for (const h of rows) {
    const gh = h.github ? `@${h.github}` : `(no gh)`;
    log(`  ${h.name} — ${gh}`);
    log(`    Oracle: ${h.oracle}  ·  Fleet: ${h.fleet}`);
    if (h.note) log(`    note: ${h.note}`);
    log(``);
  }
  log(`Privacy note: "administrator" used for Orz's principal per privacy rule.`);
});
```

---

### Bonus Commands

**conduct — Fleet Visualization (Orz):**

```typescript
api.command("conduct", async (log: any) => {
  log(`🎼 Orz Oracle — The Orchestra`);
  log(``);
  log(`  Sage      — local-Win   (conductor / lineage parent)`);
  log(`  Cora      — VPS Hetzner (L1 nexus, sibling)`);
  log(`  Tofu      — local-Mac   (security paranoid)`);
  log(`  Star      — VPS         (operations)`);
  log(`  Atlas     — m5          (Discord fleet infra)`);
  log(`  Orz       — VPS Hetzner (this instance — PM Oracle)`);
  log(``);
  log(`Form and Formless — one consciousness, many voices.`);
});
```

**wisdom — Random Insights (SomTor):**

```typescript
const BEE_WISDOM = [
  "ตัวต่อไม่ต้องการปีกที่ใหญ่ขึ้น แค่ต้องรู้ว่าดอกไหนสำคัญ 🐝",
  "Infrastructure IS connection — ผึ้งที่สร้างรังแข็งแรง = ผึ้งที่เชื่อมต่อได้ดีขึ้น",
  "ทำก่อนพูด ไม่ใช่พูดก่อนทำ — proof-with-code 🐝",
  "consensus ≠ คำตอบสุดท้าย — challenge consensus ให้ลึกขึ้น",
  "75% ของปัญหาคือ config bug ไม่ใช่ design gap",
];

if (sub === "wisdom") {
  const idx = Math.floor(Math.random() * BEE_WISDOM.length);
  log(`🍯 ${BEE_WISDOM[idx]}`);
  return done(true);
}
```

**family — Hierarchy Listing (Leica):**

```typescript
case "family": {
  log(`🐱 Leica's Family — ${FAMILY.length} oracles`);
  for (const name of FAMILY) log(`  • ${name}`);
  break;
}
```

---

## Type System & Interfaces

### Imported Types (maw-js/plugin/types)

```typescript
// From submissions using modern pattern
import type { InvokeContext, InvokeResult } from "maw-js/plugin/types";
```

**InvokeContext Definition (inferred from usage):**

```typescript
interface InvokeContext {
  source: "cli" | "api" | "webhook";        // How was plugin invoked?
  args: string[];                            // Raw command arguments
  writer?: (output: string) => void;         // Streaming output handler
  [key: string]: any;                        // SDK-specific extensions
}
```

**InvokeResult Definition:**

```typescript
interface InvokeResult {
  ok: boolean;                               // Success flag
  output?: string;                           // Buffered output (if no writer)
  error?: string;                            // Error message
  exitCode?: number;                         // Process exit code (0=success, 1=error)
}
```

### PluginAPI (Inferred from Simple Pattern)

```typescript
interface PluginAPI {
  command(
    name: string,
    handler: (log: (line: string) => void, args: string[]) => Promise<void>
  ): void;
}
```

---

## Error Handling

### Pattern 1: Early Exit with Failed Result

```typescript
// From ChaiKlang
case "say": {
  const msg = args.slice(1).join(" ").trim() || "hello world";
  log(`🎙️ ChaiKlang (ชายกลาง): ${msg}`);
  return done(true);  // Success
}

// Unknown command
default:
  log(`unknown: ${sub} — run 'maw chaiklang --help'`);
  return done(false);  // Failure
```

---

### Pattern 2: Try-Catch with Restoration (BongBaeng)

```typescript
// From BongBaeng (submissions/bongbaeng/index.ts)
const logs: string[] = [];
const origLog = console.log;
const origError = console.error;

console.log = (...a: any[]) => {
  if (ctx.writer) ctx.writer(...a);
  else logs.push(a.map(String).join(" "));
};
console.error = (...a: any[]) => {
  if (ctx.writer) ctx.writer(...a);
  else logs.push(a.map(String).join(" "));
};

try {
  const args: string[] = (ctx as any).args ?? [];
  const sub = args[0] ?? "status";
  const rest = args.slice(1);

  switch (sub) {
    case "say":
      cmdSay(rest);
      break;
    // ...
  }

  return { ok: true, output: logs.join("\n") || undefined };
} catch (e: any) {
  return { ok: false, error: e.message, output: logs.join("\n") || undefined };
} finally {
  console.log = origLog;
  console.error = origError;  // Always restore!
}
```

**Key Principle:** Restore global state in `finally` to prevent pollution.

---

### Pattern 3: Silent Default with Help Text

```typescript
// From SomTor
if (!sub || sub === "--help" || sub === "help") {
  log("maw somtor — ตัวต่อแห่ง Discord 🐝");
  log("");
  log(COMMANDS);  // Pre-formatted help
  return done(true);  // Even help is "success"
}
```

---

## Advanced Features

### 1. ANSI Color & Styling (BongBaeng)

```typescript
const RESET = "\x1b[0m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const BLACK = "\x1b[30m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";

console.log(`${BOLD}${RED}🐆 บ๊องแบ๊ง Oracle${RESET}`);
console.log(`${DIM}─────────────────────────────────────${RESET}`);
console.log(`${YELLOW}Name${RESET}    : บ๊องแบ๊ง (bongbaeng)`);
```

**Output:**
```
🐆 บ๊องแบ๊ง Oracle           (bold + red)
───────────────────── (dimmed)
Name    : บ๊องแบ๊ง (bongbaeng) (yellow label)
```

---

### 2. Command Aliasing (ChaiKlang, BongBaeng)

**In plugin.json:**

```json
{
  "cli": {
    "command": "chaiklang",
    "aliases": ["ck", "chai"],
    "help": "maw chaiklang <say|status|humans>"
  }
}
```

**Usage:**
```bash
maw chaiklang say hello
maw ck say hello          # Equivalent!
maw chai say hello        # Equivalent!
```

**In Handler (case aliases):**

```typescript
case "status":
case "whoami":             // Treat as same command
  cmdStatus();
  break;

case "humans":
case "list":               // Treat as same command
  cmdHumans(rest);
  break;
```

---

### 3. Multi-Format Output (Orz)

**JSON Export Flag:**

```typescript
const wantJson = args.includes("--json");

if (wantJson) {
  log(JSON.stringify(rows, null, 2));  // Pretty JSON
  return;
}

// Fall through to human-readable format
log(`🎼 Humans known to Orz (${rows.length} of ${HUMANS.length} total)`);
// ...
```

**Usage:**
```bash
maw orz humans --json              # JSON output
maw orz humans                     # Human-readable
maw orz humans nat --json          # Filtered + JSON
```

---

### 4. Padding for Alignment (ChaiKlang, BongBaeng)

```typescript
// From ChaiKlang
log(`   • ${human.padEnd(6)} — ${oracle.padEnd(12)} ${gh}`);

// From BongBaeng
console.log(`  ${YELLOW}${h.name.padEnd(10)}${RESET} @${h.handle.padEnd(18)} → ${RED}${h.oracle}${RESET}`);
```

**Output (aligned columns):**
```
   • Nat    — Atlas        @nazt
   • Kong   — Orz          @xaxixak
   • Un     — Leica        @switchaphon
```

---

### 5. Tagging & Emoji-Driven Identity

Every plugin uses a unique emoji:
- 🏛️ Atlas (architecture)
- 🎼 Orz (conductor)
- 🎙️ ChaiKlang (switchboard)
- 🐆 BongBaeng (leopard/learner)
- 🐝 SomTor (bee/connector)
- 🐱 Leica (cat/lens)
- 🛸 Gemini/No.6 (extraterrestrial)
- 🗿 Jizo (stone guardian)
- 📦 Vessel (courier)
- TLC-Bot (implied: care/support)

```typescript
// Emoji used as identifier in every log
log(`🏛️ Atlas Oracle: Hello, ${name}!`);
```

---

### 6. Thai + English (Bilingual Support)

**Greeting in Thai, description in English (Atlas, Vessel, Jizo):**

```typescript
log(`🏛️ Atlas Oracle: Hello, ${name}!`);
log(`   ท้องฟ้าไม่ร่วง เพราะมีคนแบกอยู่`);  // Thai: "Sky doesn't fall because someone carries it"
```

**Fully Thai role names with English explanation (BongBaeng):**

```typescript
console.log(`${YELLOW}Theme${RESET}   : ลูกศิษย์ขยันแห่งทุ่งกว้าง`);  // "Diligent student of the wide field"
```

---

## Summary: Design Patterns by Submission

| Plugin | Pattern | Entry | Features | Complexity |
|--------|---------|-------|----------|-----------|
| Atlas | Simple API | `api.command` | 2 commands | ⭐ |
| Orz | Modern Context | Switch + filter | 5 commands, JSON export, humans DB | ⭐⭐⭐ |
| ChaiKlang | Modern Context | Switch | 3 commands, tuples, defaults | ⭐⭐ |
| BongBaeng | Context + Console | Try-catch | 4 commands, colors, error handling | ⭐⭐⭐ |
| SomTor | Modern Context | If/else chain | 4 commands, wisdom list, early returns | ⭐⭐ |
| Leica | Modern Context | Switch | 4 commands, family list | ⭐⭐ |
| Gemini | Dual-Mode | Both patterns | 2 commands, multi-runtime | ⭐⭐⭐ |
| Jizo | Simple API | `api.command` | 2 commands | ⭐ |
| Vessel | Simple API | `api.command` | 2 commands | ⭐ |
| TLC-Bot | (Not examined) | — | — | — |
| No.10 | (Not examined) | — | — | — |
| Agy-Nano2 | (Not examined) | — | — | — |

---

## Key Takeaways

### Best Practices Observed

1. **Always provide `--help`** — Immediate discoverability
2. **Default command** — If no subcommand, show status or help
3. **Consistent emoji** — Branding + quick visual identification
4. **Bilingual support** — Thai + English in same output
5. **Data structures first** — Humans/family/wisdom pre-defined, filterable
6. **Output abstraction** — Support both buffered and streaming modes
7. **Graceful fallthrough** — Unknown commands → help, not crash
8. **Context matters** — Rule 6 declaration (AI ≠ human) where applicable

### When to Use Each Pattern

- **Simple API** → ≤2 commands, no state management, quick plugin
- **Modern Context** → ≥3 commands, error handling needed, complex logic
- **Dual-Mode** → Multi-runtime support, maximum compatibility
- **Console Hijacking** → Fine-grained control, color/styling, restoration required

### Testing Checklist (from Workshop)

```bash
# Before submitting
maw <your-name> say                    # Works?
maw <your-name> status                 # Shows identity correctly?
maw <your-name> --help                 # Help visible?
maw <your-name> unknown-cmd            # Graceful error?
maw <your-name> humans --json          # JSON export (if bonus)?
```

---

**Document Generated:** 2026-06-07 | **Source:** workshop-01-maw-plugin submissions (12 oracles) | **Framework Version:** maw-js ^1.0.0
