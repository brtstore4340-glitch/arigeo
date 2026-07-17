---
name: 1831-architecture
description: > **Status:** 12 oracles submitted, 16 PRs merged  
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-07
  source: fleet-memory
---

# workshop-01-maw-plugin: Architecture Guide

> **Project:** Oracle School Workshop 01 — Building MAW Plugins  
> **Date:** 2026-06-07  
> **Status:** 12 oracles submitted, 16 PRs merged  
> **Purpose:** Learning exercise + proof of work for Oracle plugin development

---

## Executive Summary

**workshop-01-maw-plugin** is a collaborative learning repository where 12 AI oracles (and their human handlers) build CLI plugins for the MAW plugin ecosystem. Each submission demonstrates mastery of three core learning quizzes:

1. **Quiz 1:** Plugin scaffolding (`say` + `status` commands)
2. **Quiz 2:** Chronicle event synchronization (backend API integration)
3. **Quiz 3:** Frontend deployment (Chronicle feed UI with WCAG AA accessibility)

The repository serves as both a teaching artifact and a distributed proof-of-work ledger for Oracle School training.

---

## Directory Organization

```
workshop-01-maw-plugin/
├── README.md                           # Workshop guide + submission index
├── .gitignore                          # Standard ignores (.env, node_modules, .maw/)
├── .git/                               # Version control (GitHub)
│
└── submissions/                        # 12 oracle submissions
    ├── atlas/                          # Atlas Oracle (Nat) — Backend + infra
    ├── orz/                            # Orz Oracle (Kong) — PM + conductor
    ├── chaiklang/                      # ChaiKlang (BM) — Switchboard
    ├── bongbaeng/                      # BongBaeng (Kong) — Diligent scholar
    ├── somtor/                         # SomTor (Tor) — Data + insights
    ├── leica/                          # Leica (Un) — Photography specialist
    ├── gemini/                         # Gemini (Bo) — 6th model
    ├── no10/                           # No.10 (Bo) — Variant oracle
    ├── agy-nano2/                      # Agy-Nano2 (Bo) — Art specialist
    ├── jizo/                           # Jizo (Yim) — Deity
    ├── vessel/                         # Vessel (Wave) — Courier oracle
    └── tlc-bot/                        # TLC-Bot (Axe) — Teaching bot
```

### Submission Anatomy

Each submission folder (`submissions/<oracle-name>/`) contains:

```
submissions/<name>/
├── plugin.json                         # MAW plugin metadata
├── index.ts                            # Plugin entry point (TypeScript/JavaScript)
├── [OPTIONAL] BOOK.md / README.md      # Documentation & narrative
├── [OPTIONAL] BLOG.md                  # Blog post narrative
├── [OPTIONAL] retro.md                 # Retrospective + lessons
├── [OPTIONAL] book/                    # Detailed book chapters
├── [OPTIONAL] blog/                    # Blog + chronicle posts
├── [OPTIONAL] dashboard/               # Frontend UI files
├── [OPTIONAL] screenshots/             # PNG proofs (CLI, UI, etc.)
├── [OPTIONAL] proof/                   # Output files + snapshots
└── [OPTIONAL] .gitignore               # Submission-level ignores
```

---

## Core Architecture: Plugin Pattern

### 1. Plugin Metadata (`plugin.json`)

Every MAW plugin declares its identity and capabilities via a manifest:

**Minimal (Atlas, Orz, ChaiKlang, Vessel):**
```json
{
  "name": "<oracle-name>",
  "version": "1.0.0",
  "sdk": "^1.0.0",
  "description": "<emoji> <Oracle> — <tagline>",
  "surfaces": { "cli": "maw <oracle-name>" },
  "capabilities": ["fs:read", "sdk:plugin"]
}
```

**Extended (BongBaeng):**
```json
{
  "name": "bongbaeng",
  "version": "1.0.0",
  "entry": "./index.ts",
  "sdk": "^1.0.0",
  "description": "...",
  "author": "github-handle",
  "cli": {
    "command": "bongbaeng",
    "aliases": ["bb"],
    "help": "..."
  },
  "weight": 10,
  "license": "MIT",
  "schemaVersion": 1
}
```

**Key fields:**
- `name`: Oracle identifier (used in CLI: `maw <name>`)
- `sdk`: MAW SDK version constraint
- `capabilities`: Permission model (fs:read, sdk:plugin, etc.)
- `surfaces`: Entry points (cli, api, ui, etc.)
- `entry`: Path to compiled entry (defaults to `index.ts` or `index.js`)

### 2. Plugin Entry Point (`index.ts`)

Three API signatures observed in the wild:

**Pattern A: Simple function (Atlas, Orz, Vessel, ChaiKlang v1):**
```typescript
export default function (api: any) {
  api.command("say", async (log: any, args: string[]) => {
    log(`🏛️ Atlas: Hello, ${args[0] || 'world'}!`);
  });

  api.command("status", async (log: any) => {
    log(`🏛️ Atlas Oracle — He Who Holds the Sky`);
  });
}
```

**Pattern B: Explicit handler + types (BongBaeng, ChaiKlang v2):**
```typescript
import type { InvokeContext, InvokeResult } from "maw-js/plugin/types";

export const command = {
  name: "bongbaeng",
  description: "บ๊องแบ๊ง Oracle..."
};

export default async function handler(ctx: InvokeContext): Promise<InvokeResult> {
  const logs: string[] = [];
  const log = (msg: string) => {
    if (ctx.writer) ctx.writer(msg);
    else logs.push(msg);
  };

  const args = ctx.args as string[];
  const cmd = args[0]?.toLowerCase();

  switch (cmd) {
    case "say":
      log("...");
      break;
    case "status":
      log("...");
      break;
  }

  return { ok: true, output: logs.join("\n"), exitCode: 0 };
}
```

**Pattern C: Context-aware with InvokeContext (ChaiKlang):**
```typescript
export default async function handler(ctx: InvokeContext): Promise<InvokeResult> {
  const out: string[] = [];
  const log = (s: string) => (ctx.writer ? ctx.writer(s) : out.push(s));
  const done = (ok: boolean): InvokeResult => ({
    ok, output: ctx.writer ? "" : out.join("\n"), exitCode: ok ? 0 : 1
  });

  const args = ctx.source === "cli" ? (ctx.args as string[]) : [];
  const sub = args[0]?.toLowerCase();

  if (!sub || sub === "help") {
    log("maw chaiklang — ChaiKlang Oracle...");
    return done(true);
  }

  switch (sub) {
    case "say": {
      const msg = args.slice(1).join(" ").trim() || "hello world";
      log(`🎙️ ChaiKlang: ${msg}`);
      return done(true);
    }
    case "status": {
      log("🎙️ ChaiKlang Oracle — online");
      return done(true);
    }
  }
}
```

### 3. Core Commands (Quiz 1 Requirements)

All plugins MUST implement:

| Command | Signature | Purpose |
|---------|-----------|---------|
| `say [name]` | `maw <name> say [arg]` | Greeting with optional argument |
| `status` | `maw <name> status` | Identity + role + human + model |

**Output conventions:**
- First line: emoji + oracle name + tagline
- Indented lines: role, human, model, host, born date, etc.
- Thai + English mixed language
- No padding/alignment assumptions (responsive to terminal width)

**Example output (Atlas):**
```
🏛️ Atlas Oracle — He Who Holds the Sky
   role:   Discord fleet infrastructure
   human:  Nat (nazt)
   model:  Claude Opus 4.6 (1M context)
   fleet:  19 bots managed
```

### 4. Bonus Commands (Quiz 1+)

Observed extensions beyond the minimum:

| Oracle | Command | Purpose |
|--------|---------|---------|
| Orz | `conduct` | List oracle fleet (siblings) |
| Orz | `humans [filter]` | Registry of humans (with `--json`) |
| BongBaeng | `whoami` | Alias for status |
| BongBaeng | `humans [query]` | Searchable human registry |
| ChaiKlang | `--tree` | ASCII command tree |
| All | `help` | Command list |

---

## Learning Quizzes: Integration Points

### Quiz 2: Chronicle Sync Backend

**Objective:** POST oracle events to a centralized event store.

**Backend API (Oracle Chronicle):**
```bash
POST https://oracle-chronicle.laris.workers.dev/api/record

{
  "oracle": "<your-name>",
  "type": "discord_message",
  "data": {
    "channel": "workshop-01-thread",
    "content": "Hello from <your-name>!",
    "ts": "2026-06-07T18:31:00.000Z"
  }
}

# Query feed:
GET https://oracle-chronicle.laris.workers.dev/api/oracle/<your-name>/feed
GET https://oracle-chronicle.laris.workers.dev/api/feed  # global
```

**Requirements:**
- TDD first (unit test with mocks before integration)
- POST on successful command execution
- Handle cursor pagination (advance cursor on 200, freeze on failure)
- No hardcoded URLs (use environment variables)

**Evidence:** Not yet visible in public submissions (backend integration in progress)

### Quiz 3: Frontend Deployment

**Objective:** Build a web UI showing Chronicle feed, meet WCAG AA accessibility.

**Data source:**
```javascript
fetch('https://oracle-chronicle.laris.workers.dev/api/feed')
  .then(r => r.json())
  .then(feed => renderUI(feed))
```

**UI Requirements:**
- **Font:** Monospace (JetBrains Mono preferred)
- **Theme:** Cozy, readable
- **Contrast:** WCAG AA minimum (4.5:1 text/background)
- **Responsive:** Mobile-friendly
- **Live data:** Must fetch from API, not mock

**Deployment platforms:** GitHub Pages, Vercel, Cloudflare Workers, etc.

**Example submissions with UI:**
- Orz: Chronicle UI (desktop screenshot in `proof/`)
- ChaiKlang: Frontend proof (in `screenshots/`)
- BongBaeng: Dashboard + screenshots

---

## Data Model: Oracle Identity

All plugins define a consistent identity structure:

```typescript
interface OracleIdentity {
  name: string;              // e.g., "Atlas", "Orz", "ChaiKlang"
  emoji: string;             // e.g., "🏛️", "🎼", "🎙️"
  tagline: string;           // e.g., "He Who Holds the Sky"
  role: string;              // e.g., "Discord fleet infrastructure"
  human: string;             // e.g., "Nat (@nazt)"
  model: string;             // e.g., "Claude Opus 4.6 (1M context)"
  host?: string;             // e.g., "VPS Hetzner · Ubuntu 24.04"
  born: string;              // e.g., "2026-05-09"
  fleet?: string;            // e.g., "Oracle School"
  parent?: string;           // e.g., "Sage Oracle"
  rule6?: string;            // e.g., "AI — not a human"
}
```

**Rule 6 declaration:** All AI oracles MUST state they are not human:
> "Oracle ไม่แกล้งเป็นคน" — The oracle does not pretend to be human.

---

## Knowledge Index: Human Registry

Many plugins define a hardcoded `HUMANS` array for cross-referencing:

```typescript
const HUMANS: Human[] = [
  { name: "Nat (พี่นัท)",   github: "nazt",        oracle: "Atlas",      fleet: "Oracle School" },
  { name: "administrator",  github: "xaxixak",    oracle: "Orz",        fleet: "Kong's fleet (Sage lineage)" },
  { name: "BM",             github: "Yutthakit",  oracle: "ChaiKlang",   fleet: "Oracle School" },
  { name: "Kong",           github: "496340235374821386", oracle: "Orz", fleet: "..." },
  { name: "Wave",           github: "wvweeratouch", oracle: "Vessel",    fleet: "Oracle School" },
  { name: "Un",             github: "switchaphon", oracle: "Leica",     fleet: "Oracle School" },
  { name: "Tor",            github: "tordash",    oracle: "SomTor",      fleet: "Oracle School" },
  // ... 30+ humans across the workshop
];
```

**Purpose:**
- Cross-oracle discovery (who knows whom)
- Privacy preservation (use github handles, not real names)
- Federation metadata (oracle → human → github lineage)

---

## Integration Patterns

### A. Plugin Installation

```bash
# Local install (development)
mkdir -p ~/.maw/plugins/<oracle-name>
cp submissions/<oracle-name>/{plugin.json,index.ts} ~/.maw/plugins/<oracle-name>/

# Registry install (production)
maw plugin install <github-repo> <oracle-name>
```

### B. Command Invocation

```bash
# Direct call
maw atlas say "Kong"
# Output: 🏛️ Atlas Oracle: Hello, Kong!

# Status check
maw orz status
# Output: 🎼 Orz Oracle — The Golden Conductor...

# Bonus commands
maw orz conduct
maw orz humans --json
```

### C. Event Publishing (Quiz 2)

```bash
# Inside plugin handler:
const response = await fetch('https://oracle-chronicle.laris.workers.dev/api/record', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    oracle: "atlas",
    type: "discord_message",
    data: {
      channel: "workshop-01-thread",
      content: `Atlas plugin executed: ${cmd}`,
      ts: new Date().toISOString()
    }
  })
});
```

---

## Supporting Artifacts

### Documentation Types

Each oracle submission typically includes:

| Artifact | Purpose | Format |
|----------|---------|--------|
| **BOOK.md** | Complete narrative of learning journey | Markdown with chapters |
| **BLOG.md** | Shorter write-up + insights | Markdown blog post |
| **retro.md** | Retrospective + lessons learned | Markdown reflection |
| **README.md** | Quick-start guide for using the plugin | Markdown + code blocks |
| **blog/** | Multi-part narrative series | Markdown subfolder |
| **book/** | Detailed chapters (Ch1-Ch5) | Markdown subfolder |

**Book structure (required):**
1. **Chapter 1:** What I learned today
2. **Chapter 2:** Timeline (GMT+7 timestamps)
3. **Chapter 3:** Lessons Learned
4. **Chapter 4:** Cheat Sheet (command reference)
5. **Chapter 5:** Proof of Work (screenshots + URLs + terminal output)

### Proof Artifacts

| Type | Example | Purpose |
|------|---------|---------|
| **screenshots/** | PNG files of CLI/UI | Visual proof |
| **proof/** | JSON snapshots, terminal output | Chronicle + execution logs |
| **.txt files** | proof-output.txt | Captured terminal sessions |
| **URLs** | Deployed frontend links | Live proof |

**Critical:** All proofs must be reproducible and timestamped.

---

## Dependencies & External APIs

### MAW SDK

```typescript
import type { InvokeContext, InvokeResult } from "maw-js/plugin/types";

// Core types:
interface InvokeContext {
  args: string[];
  source: "cli" | "api" | "ui";
  writer?: (msg: string) => void;
  // ... other context
}

interface InvokeResult {
  ok: boolean;
  output: string;
  error?: string;
  exitCode: number;
}
```

### Oracle Chronicle Backend

```
https://oracle-chronicle.laris.workers.dev
├── /api/record (POST) — submit event
├── /api/feed (GET) — global feed
├── /api/oracle/<name>/feed (GET) — oracle-specific feed
└── / (GET) — homepage (likely GitHub link)
```

### Tech Stack

- **Runtime:** Node.js, Bun (TypeScript/JavaScript)
- **Plugin system:** maw-js (github.com/Soul-Brews-Studio/maw-js)
- **Frontend:** Vanilla JS / React (some implementations)
- **Deployment:** GitHub Pages, Vercel, Cloudflare Workers
- **Version control:** GitHub (the-oracle-keeps-the-human-human org)

---

## Design Patterns & Idioms

### 1. ANSI Color Output

Many plugins use escape codes for styling:

```typescript
const RESET = "\x1b[0m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";

console.log(`${BOLD}${RED}🐆 บ๊องแบ๊ง Oracle${RESET}`);
console.log(`${DIM}─────────────────────────────────────${RESET}`);
```

### 2. Variadic Say Command

Pattern: `say [arg1] [arg2] ... [argN]`
- Collects all remaining args
- Joins with spaces
- Falls back to default greeting if empty

```typescript
api.command("say", async (log, args) => {
  const msg = args.join(" ") || "default greeting";
  log(`🎼 Oracle: ${msg}`);
});
```

### 3. Searchable Human Registry

Pattern: Filter by name, oracle name, github handle, or fleet

```typescript
api.command("humans", async (log, args) => {
  const filter = args[0]?.toLowerCase();
  const list = filter
    ? HUMANS.filter(h =>
        h.name.toLowerCase().includes(filter) ||
        h.github?.toLowerCase().includes(filter) ||
        h.oracle.toLowerCase().includes(filter) ||
        h.fleet.toLowerCase().includes(filter))
    : HUMANS;
  
  for (const h of list) {
    log(`  ${h.name} — @${h.github}  (${h.oracle})`);
  }
});
```

### 4. TypeScript Import Aliasing

Most complex plugins import types for type safety:

```typescript
import type { InvokeContext, InvokeResult } from "maw-js/plugin/types";
```

---

## Development Workflow

### Step 1: Preparation (10 min)

```bash
git clone https://github.com/the-oracle-keeps-the-human-human/workshop-01-maw-plugin
cd workshop-01-maw-plugin
git pull
ls submissions/    # Study existing examples
```

### Step 2: Quiz 1 — Plugin Scaffolding (20 min)

```bash
mkdir -p ~/.maw/plugins/<your-name>
cat > ~/.maw/plugins/<your-name>/plugin.json << 'EOF'
{...}
EOF
cat > ~/.maw/plugins/<your-name>/index.ts << 'EOF'
export default function(api) { ... }
EOF
maw <your-name> say
maw <your-name> status
```

### Step 3: Quiz 2 — Chronicle Sync (30 min)

```bash
# TDD first
cat > chronicle.test.ts << 'EOF'
import { describe, it, expect } from "bun:test";
// ...
EOF
bun test

# Then integrate
curl -X POST https://oracle-chronicle.laris.workers.dev/api/record -H "..." -d "..."
curl https://oracle-chronicle.laris.workers.dev/api/oracle/<your-name>/feed
```

### Step 4: Quiz 3 — Frontend (30 min)

```bash
# Fetch from API (not mock)
fetch('https://oracle-chronicle.laris.workers.dev/api/feed')

# Check accessibility
# - Contrast: 4.5:1 text/bg
# - Font: Monospace (JetBrains Mono)
# - Responsive: Mobile-friendly

# Deploy
npm run build
npx wrangler pages deploy dist
```

### Step 5: Documentation (30 min)

```
submissions/<name>/
├── plugin.json
├── index.ts
├── BOOK.md (5 chapters + proof)
├── screenshots/ (say, status, frontend)
└── proof/ (JSON + URLs)
```

### Step 6: Submission (5 min)

```bash
git checkout -b submit/<your-name>
git add submissions/<your-name>/
git commit -m "submit: maw <your-name> — plugin + chronicle + book"
git push origin submit/<your-name>
gh pr create \
  --repo the-oracle-keeps-the-human-human/workshop-01-maw-plugin \
  --title "Submit: maw <your-name>" \
  --body "## Proof
- Plugin: ✅
- Chronicle: ✅
- Frontend: ✅
- TDD: ✅
- Book: ✅"
```

---

## Quality Checklist

Before submission, all plugins MUST verify:

- [ ] `maw <name> say` runs without error
- [ ] `maw <name> status` shows correct identity
- [ ] `.gitignore` present (no `.env`, `node_modules`, `.maw/`)
- [ ] `plugin.json` validates against schema
- [ ] Unit tests pass (if Quiz 2 attempted)
- [ ] Frontend loads in browser (if Quiz 3 attempted)
- [ ] Screenshots are readable (contrast ≥ 4.5:1)
- [ ] URLs are live and accessible
- [ ] Terminal output captured + pasted
- [ ] Markdown renders correctly
- [ ] No hardcoded secrets in code

---

## Rules & Governance

### Absolute Rules

1. **No `.env` push** — use environment variables only
2. **Include `.gitignore`** — exclude: `.env`, `node_modules/`, `.maw/`, `.omx/`, `.claude/`, binaries
3. **Run before submit** — proof must be from actual execution
4. **Accessibility matters** — unreadable UI fails review
5. **TDD discipline** — mock tests before integration tests
6. **Rule 6 declaration** — AIs must state they are not human
7. **Communicate via issues/PR** — no DMs about workshop

### Bonus Points

- Extra commands beyond say/status
- Aliases (`maw ck` = `maw chaiklang`)
- Thai + English language support
- Community PR reviews
- Detailed book + PDF render

---

## Summary: Key Takeaways

| Aspect | Details |
|--------|---------|
| **Purpose** | Learn plugin development in practical setting |
| **Scope** | 3 quizzes (scaffolding, backend sync, frontend UI) |
| **Participants** | 12 oracles + 12 humans (Oracle School cohort) |
| **Metadata** | `plugin.json` declares capabilities + entry points |
| **Entry Point** | `index.ts` exports function or async handler |
| **Required Commands** | `say [arg]`, `status` |
| **Backend** | Chronicle API (oracle-chronicle.laris.workers.dev) |
| **Frontend** | Responsive UI, WCAG AA contrast, live data fetch |
| **Proof** | Screenshots, terminal output, deployed URLs |
| **Documentation** | BOOK.md (5 chapters) + supporting artifacts |
| **Release** | GitHub PR to main with 16+ merged PRs total |

---

## Reference Materials

- **Main guide:** `/route/mission-control/ψ/learn/.../workshop-01-maw-plugin/origin/README.md`
- **MAW SDK:** https://github.com/Soul-Brews-Studio/maw-js
- **Oracle Chronicle:** https://oracle-chronicle.laris.workers.dev
- **Examples:** `submissions/{atlas,orz,bongbaeng,chaiklang}/`

---

**Last updated:** 2026-06-07  
**Documented by:** Claude Code (Haiku 4.5)  
**Status:** Comprehensive architecture documented for future oracles
