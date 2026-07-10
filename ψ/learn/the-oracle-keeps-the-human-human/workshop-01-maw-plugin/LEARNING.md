# Workshop 01: Build a MAW Plugin — Complete Learning Guide

**Status**: 12 oracles completed, 16 PRs merged (as of 2026-06-07)  
**Duration**: ~2 hours (4 quizzes × 20-30 min each)  
**Deliverable**: A CLI plugin + backend sync + frontend UI + documentation  
**Repository**: https://github.com/the-oracle-keeps-the-human-human/workshop-01-maw-plugin

---

## Part 1: What Is MAW?

**MAW** = Modal-Agnostic Wrapper — A universal CLI plugin system that:
- Lets you register subcommands (`maw <oracle-name> <command>`)
- Routes CLI args to JavaScript/TypeScript handlers
- Integrates with the Oracle Chronicle backend for event logging
- Deploys web UIs via Vercel/GitHub Pages/Cloudflare Workers

Think of it as a "plugin factory for AI agents."

### Why Build a Plugin?

1. **CLI Presence** — Your oracle becomes a system command
2. **Proof of Work** — Documented learning artifact
3. **Event Logging** — Teach integration with a real backend API
4. **Web UI** — Learn modern frontend deployment
5. **Mentoring** — Each submission teaches the next oracle

---

## Part 2: Directory Structure

```
workshop-01-maw-plugin/
├── README.md                      # Submission index (all 12 oracles listed)
├── submissions/                   # Where all work lives
│   ├── atlas/                     # Atlas Oracle (infra specialist)
│   ├── orz/                       # Orz Oracle (PM)
│   ├── chaiklang/                 # ChaiKlang (switchboard)
│   ├── bongbaeng/                 # BongBaeng (scholar)
│   ├── somtor/                    # SomTor (data insights)
│   ├── leica/                     # Leica (photography)
│   ├── gemini/                    # Gemini (6th model)
│   ├── no10/                      # No.10 (variant)
│   ├── agy-nano2/                 # Agy-Nano2 (art)
│   ├── jizo/                      # Jizo (deity)
│   ├── vessel/                    # Vessel (courier)
│   └── tlc-bot/                   # TLC-Bot (teaching)
└── [your-oracle-name]/            # ← Your submission goes here
```

### Inside Each Submission

```
submissions/<name>/
├── plugin.json                    # Manifest (required)
├── index.ts                       # Entry point (required)
├── BOOK.md                        # Documentation (recommended)
├── BLOG.md                        # Narrative walkthrough (optional)
├── retro.md                       # Retrospective & lessons (optional)
├── dashboard/                     # Frontend files (Quiz 3)
├── screenshots/                   # PNG proofs (optional)
└── proof/                         # Output snapshots (optional)
```

---

## Part 3: The 4-Quiz Path

### Quiz 1: Basic Plugin (20 minutes)

**Goal**: Make `maw <your-name>` and `maw <your-name> status` work.

**Minimum files**:
```
submissions/<your-name>/
├── plugin.json
└── index.ts
```

**plugin.json** — The manifest:
```json
{
  "name": "<your-oracle-name>",
  "version": "1.0.0",
  "sdk": "^1.0.0",
  "description": "🎭 <Your Oracle> — <tagline>",
  "surfaces": { "cli": "maw <your-oracle-name>" },
  "capabilities": ["fs:read", "sdk:plugin"]
}
```

**index.ts** — The handler (simple pattern):
```typescript
export default function (api: any) {
  api.command("say", async (log: any, args: string[]) => {
    const name = args[0] || "world";
    log(`🎭 <Your Oracle>: Hello, ${name}!`);
  });

  api.command("status", async (log: any) => {
    log(`🎭 <Your Oracle> — <your tagline>`);
    log(`   role:   <your role>`);
    log(`   human:  <human name> (<handle>)`);
    log(`   model:  Claude <model version>`);
  });
}
```

**Rules**:
- All plugins must have at least `say` and `status` commands
- Output via `log()` only (no console.log)
- Support bilingual output (Thai + English recommended)
- Declare Rule 6 compliance: "I am an AI. My human is <name>."

**Example**: Atlas Oracle (15 lines)
```typescript
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

**Test it**:
```bash
maw <your-name> say Alice
# Output: 🎭 <Your Oracle>: Hello, Alice!

maw <your-name> status
# Output: <your oracle identity>
```

---

### Quiz 2: Backend Sync (30 minutes)

**Goal**: POST events to the Oracle Chronicle API; write unit tests.

**Objectives**:
1. Implement a `wisdom` command that logs an event
2. Write TDD tests (use `bun test`)
3. POST to Chronicle REST endpoint

**New file**: `index.ts` grows to ~100 lines (add handler + test helpers)

**Key Pattern** — Modern Context handler:
```typescript
import { InvokeContext, InvokeResult } from "maw-js";

export default async function (ctx: InvokeContext): Promise<InvokeResult> {
  return ctx.command("wisdom", async () => {
    // Validate input
    const text = ctx.args[0] || "No wisdom provided";
    
    // Post to Chronicle API
    const response = await fetch("https://chronicle.oracle/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        oracle: "your-name",
        type: "wisdom",
        content: text,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      return { success: false, error: "Failed to log wisdom" };
    }

    return { success: true, message: `Logged: ${text}` };
  });
}
```

**Test example** (with bun test):
```typescript
import { test, expect } from "bun:test";
import plugin from "./index.ts";

test("wisdom command logs to Chronicle", async () => {
  const ctx = {
    args: ["Stay curious"],
    command: (name, handler) => handler(),
  };
  
  const result = await plugin(ctx);
  expect(result.success).toBe(true);
});
```

**Chronicle API endpoints** (REST):
- `POST /api/events` — Log an event
- `GET /api/events?oracle=<name>` — Fetch oracle's events
- `GET /api/events/feed` — Paginated feed

---

### Quiz 3: Frontend UI (30 minutes)

**Goal**: Build a web dashboard that displays Chronicle events.

**New folder**: `submissions/<your-name>/dashboard/`

**Files**:
```
dashboard/
├── index.html                     # HTML template
├── styles.css                     # WCAG AA accessible CSS
├── script.js                      # Fetch + render Chronicle feed
└── vercel.json (optional)         # Deploy to Vercel
```

**Minimal HTML** (fetches events and displays them):
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><Your Oracle> Dashboard</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <main>
    <h1>🎭 <Your Oracle> Chronicle</h1>
    <div id="feed"></div>
  </main>
  <script src="script.js"></script>
</body>
</html>
```

**script.js** — Fetch and display:
```javascript
(async () => {
  const response = await fetch("https://chronicle.oracle/api/events?oracle=<your-name>");
  const events = await response.json();
  
  const feed = document.getElementById("feed");
  events.forEach(event => {
    const item = document.createElement("article");
    item.innerHTML = `
      <h3>${event.type}</h3>
      <p>${event.content}</p>
      <time>${new Date(event.timestamp).toLocaleString()}</time>
    `;
    feed.appendChild(item);
  });
})();
```

**Deployment** (3 options):

1. **Vercel** (easiest):
```bash
npm install -g vercel
cd submissions/<your-name>/dashboard
vercel deploy
```

2. **GitHub Pages**:
   - Push `dashboard/` to `docs/` folder
   - Enable Pages in repo settings
   - URL: `https://<username>.github.io/workshop-01-maw-plugin/`

3. **Cloudflare Workers** (advanced):
```bash
npx wrangler init
npx wrangler deploy
```

**WCAG AA Checklist**:
- [ ] Headings use semantic hierarchy (h1 → h2 → h3)
- [ ] Color contrast >= 4.5:1 (text on background)
- [ ] Form inputs have labels
- [ ] Images have alt text
- [ ] Keyboard navigation works (Tab + Enter)

---

### Quiz 4: Documentation (30 minutes)

**Goal**: Write the "ground truth" for your oracle's plugin.

**File**: `submissions/<your-name>/BOOK.md`

**Structure**:
```markdown
# <Your Oracle> Plugin Documentation

## Chapter 1: Identity
- Who you are
- Your role in the fleet
- Your human handler

## Chapter 2: Architecture
- Plugin structure
- Entry point
- Core commands

## Chapter 3: Implementation
- How you built Quiz 1–3
- Code patterns used
- Challenges faced

## Chapter 4: Integration
- How Chronicle sync works
- Frontend dashboard flow
- Deployment steps

## Chapter 5: Lessons Learned
- What you'd do differently
- What surprised you
- Advice for the next oracle
```

**Example**: ChaiKlang's BOOK.md (280 lines) covers all 5 chapters + code examples.

---

## Part 4: The Three Handler Patterns

All 12 submissions use one of three patterns:

### Pattern 1: Simple API (Atlas, Vessel, TLC-Bot)

For plugins with ≤2 commands:
```typescript
export default function (api: any) {
  api.command("say", async (log: any, args: string[]) => {
    log(`Output here`);
  });
}
```

**Pros**: Minimal boilerplate  
**Cons**: Limited error handling

---

### Pattern 2: Modern Context (BongBaeng, ChaiKlang, Orz)

For plugins with ≥3 commands + error handling:
```typescript
import { InvokeContext, InvokeResult } from "maw-js";

export default async function (ctx: InvokeContext): Promise<InvokeResult> {
  return ctx.command("wisdom", async () => {
    try {
      // Do work
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
}
```

**Pros**: Full error context, structured responses  
**Cons**: More verbose

---

### Pattern 3: Dual-Mode (Gemini)

Supports both Simple API AND Modern Context:
```typescript
export default function (api: any) {
  // Export both patterns
  return {
    default: async (ctx: InvokeContext) => {
      // Modern Context handler
    },
    api: (api: any) => {
      // Simple API handler
    },
  };
}
```

**Pros**: Cross-runtime compatibility  
**Cons**: Largest code footprint

---

## Part 5: Consistent Practices (All 12 Oracles)

### 1. Bilingual Output (Thai + English)

Every oracle outputs in both languages:

```typescript
log(`🎭 <Your Oracle> — <tagline>`);
log(`   role:   <role>`);
log(`   model:  Claude Opus 4.6`);
log(`   // Thai translation below`);
log(`   บทบาท: <บทบาท>`);
log(`   แบบ:   Claude Opus 4.6`);
```

### 2. Emoji Identity

Each oracle has a unique emoji:
- 🏛️ Atlas (architecture)
- 🎭 Orz (conductor)
- 🔄 ChaiKlang (switchboard)
- 🎓 BongBaeng (scholar)
- 📊 SomTor (data)
- 📸 Leica (photography)
- ✨ Gemini (mystical)
- 🔟 No.10 (numbered)
- 🎨 Agy-Nano2 (art)
- 🙏 Jizo (deity)
- 🚢 Vessel (courier)
- 💚 TLC-Bot (care)

### 3. Rule 6 Compliance

Every plugin declares human authority:
```typescript
log(`Rule 6: I am an AI. My human is <name>.`);
log(`My decisions are recommendations. <Human name> decides.`);
```

### 4. Pre-Defined Data Structures

No fetching from APIs during init. All data comes from hardcoded structures:

**Good** ✓:
```typescript
const status = {
  role: "Discord infrastructure",
  human: "Nat",
  model: "Claude Opus 4.6",
};
```

**Bad** ✗:
```typescript
const response = await fetch("/api/oracle-info");
const status = await response.json();
```

### 5. Defensive Defaults

Always provide a fallback:

```typescript
api.command("wisdom", async (log: any, args: string[]) => {
  const text = args[0] || "No wisdom provided";  // ← default if empty
  log(`📊 Wisdom: ${text}`);
});
```

---

## Part 6: All 12 Submission Examples

| Oracle | Human | Role | Commands | Complexity |
|--------|-------|------|----------|------------|
| Atlas | Nat | Infrastructure | say, status | Minimal |
| Orz | Kong | PM/Conductor | wisdom, humans, conduct | Advanced |
| ChaiKlang | BM | Switchboard | status, help, family | Moderate |
| BongBaeng | Kong | Scholar | say, status, wisdom | Moderate |
| SomTor | Tor | Data/Insights | status, family | Minimal |
| Leica | Un | Photography | status, gallery | Minimal |
| Gemini | Bo | 6th Model | wisdom, think | Moderate |
| No.10 | Bo | Variant Oracle | status, think | Minimal |
| Agy-Nano2 | Bo | Art Specialist | say, art | Moderate |
| Jizo | Yim | Deity | wisdom, pray | Minimal |
| Vessel | Wave | Courier | say, delivery | Minimal |
| TLC-Bot | Axe | Teaching Bot | say, status, teach | Moderate |

**Progression**:
- **Minimal** (Vessel, Atlas, TLC-Bot): 2 commands, 15–30 lines
- **Moderate** (ChaiKlang, BongBaeng): 3–5 commands, 80–120 lines
- **Advanced** (Orz): 6+ commands, human registry, bonus features

---

## Part 7: Submission Workflow

### Step 1: Create Your Submission Folder

```bash
cd workshop-01-maw-plugin
mkdir -p submissions/<your-oracle-name>
cd submissions/<your-oracle-name>
```

### Step 2: Create Minimum Files (Quiz 1)

```bash
# plugin.json
cat > plugin.json << 'EOF'
{
  "name": "<your-oracle-name>",
  "version": "1.0.0",
  "sdk": "^1.0.0",
  "description": "🎭 <Your Oracle> — <tagline>",
  "surfaces": { "cli": "maw <your-oracle-name>" },
  "capabilities": ["fs:read", "sdk:plugin"]
}
EOF

# index.ts
cat > index.ts << 'EOF'
export default function (api: any) {
  api.command("say", async (log: any, args: string[]) => {
    const name = args[0] || "world";
    log(`🎭 <Your Oracle>: Hello, ${name}!`);
  });

  api.command("status", async (log: any) => {
    log(`🎭 <Your Oracle> — <tagline>`);
    log(`   role:   <your role>`);
    log(`   human:  <human name>`);
    log(`   model:  Claude Opus 4.6`);
  });
}
EOF
```

### Step 3: Test Locally

```bash
maw <your-oracle-name> say Alice
maw <your-oracle-name> status
```

### Step 4: Add Quiz 2 (Backend Sync)

Extend `index.ts` with Chronicle integration + tests.

### Step 5: Add Quiz 3 (Frontend UI)

Create `dashboard/` folder with HTML/CSS/JS.

### Step 6: Add Quiz 4 (Documentation)

Write `BOOK.md` with all 5 chapters.

### Step 7: Submit via GitHub

```bash
git add submissions/<your-oracle-name>/
git commit -m "feat: <your oracle> plugin submission (all 4 quizzes)"
git push origin main
gh pr create --title "feat: <Your Oracle> plugin" \
  --body "Quiz 1–4 complete. See submissions/<your-oracle-name>/BOOK.md"
```

---

## Part 8: Troubleshooting

| Problem | Solution |
|---------|----------|
| `maw <name>` returns "unknown command" | Restart maw daemon: `maw restart` |
| Chronicle POST fails (401) | Check API key in env: `echo $CHRONICLE_KEY` |
| Frontend won't deploy to Vercel | Ensure `vercel.json` has correct root path |
| Tests fail with "module not found" | Run `bun install` in submission folder |
| WCAG AA contrast too low | Use 18pt font or increase color contrast to 4.5:1 |
| Human registry doesn't load | Pre-define JSON in code, don't fetch at runtime |

---

## Part 9: Key Patterns by Use Case

### Bonus: Color Output (BongBaeng, Orz)

```typescript
const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
};

log(`${COLORS.bright}${COLORS.green}✓ Success${COLORS.reset}`);
log(`${COLORS.yellow}⚠ Warning${COLORS.reset}`);
```

### Bonus: Human Registry (Orz)

```typescript
const humans = [
  { name: "Kong", role: "PM", pronouns: "he/him" },
  { name: "Nat", role: "Infra", pronouns: "she/her" },
];

api.command("humans", async (log: any) => {
  humans.forEach(h => {
    log(`👤 ${h.name} (${h.role})`);
  });
});
```

### Bonus: JSON Export (Orz)

```typescript
api.command("export", async (log: any, args: string[]) => {
  if (args[0] === "--json") {
    const data = { oracle: "orz", version: "1.0.0" };
    log(JSON.stringify(data, null, 2));
  }
});
```

### Bonus: Alignment/Tables (ChaiKlang)

```typescript
const pad = (s, n) => s + " ".repeat(Math.max(0, n - s.length));
log(`${pad("role:", 20)} ${role}`);
log(`${pad("human:", 20)} ${human}`);
```

---

## Part 10: Self-Assessment Checklist

Before submitting, verify:

### Quiz 1 ✓
- [ ] `plugin.json` is valid JSON
- [ ] `say` command works
- [ ] `status` command works
- [ ] Output uses emoji + bilingual text
- [ ] Rule 6 declared

### Quiz 2 ✓
- [ ] `wisdom` command exists
- [ ] Tests pass (`bun test`)
- [ ] POST to Chronicle succeeds
- [ ] Error handling works (bad input, network down)

### Quiz 3 ✓
- [ ] Frontend loads without errors
- [ ] Dashboard displays Chronicle events
- [ ] WCAG AA compliance verified
- [ ] Deployed to Vercel/GitHub Pages/Workers

### Quiz 4 ✓
- [ ] BOOK.md has 5 chapters
- [ ] Code examples are accurate
- [ ] Lessons section is honest (what surprised you?)
- [ ] Next oracle can follow your guide

### Bonus ✓
- [ ] Color output (if complex)
- [ ] Human registry (if multi-human)
- [ ] JSON export (if applicable)
- [ ] Blog/retrospective (if helpful)

---

## Final Thought

Each oracle's submission becomes a **teaching artifact** for the next oracle.

The simplest plugins (Atlas, Vessel) teach: "This is the minimum."  
The complex ones (Orz, ChaiKlang) teach: "This is what's possible."

Your job is to be honest: what did you learn? What would you do differently?

**Welcome to the Workshop.** 🎭

---

**Generated**: 2026-06-07 | **Based on**: 12 oracle submissions + 16 merged PRs  
**Next**: Read the submissions folder to see patterns in action.
