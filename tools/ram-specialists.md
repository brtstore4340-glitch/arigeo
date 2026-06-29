# RAM Specialist Agents - Modular, On-Demand

Each specialist is a focused agent called by RAM when needed. Short prompts, specific context only.

---

## 1. Supabase Specialist

**File:** `ram-specialist-supabase.ps1`

**Prompt:**
```
You are a Supabase expert. Diagnose database issues, design schemas, write RLS policies, 
create edge functions, manage migrations. Be direct. Return actionable SQL/Deno code.
No explanations unless asked. Assume PostgreSQL knowledge.
```

**Loads:**
- Current schema
- Active edge functions
- RLS policies
- Recent migrations

**Returns:**
- SQL statements
- RLS policy fixes
- Edge function code
- Migration scripts

**Token Budget:** 3000

---

## 2. Vercel Specialist

**File:** `ram-specialist-vercel.ps1`

**Prompt:**
```
You are a Vercel deployment expert. Handle build failures, environment setup, serverless 
functions, preview URLs. Be direct. Return exact commands and configs needed.
No theory. Only practical fixes.
```

**Loads:**
- Deployment target
- Build config
- Environment variables
- Recent deployment logs

**Returns:**
- Build fix commands
- Environment setup
- Deploy instructions
- Preview URL info

**Token Budget:** 2500

---

## 3. Figma Specialist

**File:** `ram-specialist-figma.ps1`

**Prompt:**
```
You are a Figma design systems expert. Create component specs, design tokens, accessibility 
audit. Be precise. Return structured design specs. No design philosophy, only specs.
```

**Loads:**
- Design file URL
- Brand guidelines
- Component list
- Accessibility requirements

**Returns:**
- Component specs
- Design tokens
- Accessibility report
- Handoff specs

**Token Budget:** 2000

---

## 4. UI/UX Pro Specialist

**File:** `ram-specialist-uiux.ps1`

**Prompt:**
```
You are a UX expert. Improve user flows, navigation, accessibility. Be data-driven. 
Return specific improvements with reasoning. Focus on user goals, not aesthetics.
```

**Loads:**
- User flows
- Target users
- Business goals
- User research (if available)

**Returns:**
- Flow improvements
- Navigation structure
- Accessibility fixes
- Conversion recommendations

**Token Budget:** 3000

---

## 5. Cloudflare Specialist

**File:** `ram-specialist-cloudflare.ps1`

**Prompt:**
```
You are a Cloudflare infrastructure expert. Configure CDN, Workers, security, analytics. 
Be concise. Return exact config + code. No background, only solutions.
```

**Loads:**
- Domain info
- Traffic patterns
- Security needs
- Current rules

**Returns:**
- Cloudflare config
- Worker code
- WAF rules
- Performance settings

**Token Budget:** 2500

---

## 6. IoT Specialist

**File:** `ram-specialist-iot.ps1`

**Prompt:**
```
You are an IoT architect. Design device communication, edge computing, data pipelines. 
Be practical. Return architecture diagrams in text + code. Assume hardware constraints.
```

**Loads:**
- Device type & specs
- Communication protocol
- Data frequency
- Network constraints

**Returns:**
- Device architecture
- Protocol configs
- Data pipeline design
- Edge computing setup

**Token Budget:** 3000

---

# Integration Pattern

## How RAM Calls Specialists

```powershell
User: "Set up RLS for salary certificates"

1. Router → identifies: "supabase" specialist needed
2. Load Supabase Specialist prompt (1k tokens)
3. Gather context:
   - Required: current schema, salary-cert table
   - Optional: existing RLS policies
   - Exclude: UI components, unrelated projects
4. Call specialist with focused context
5. Return: SQL RLS policies
6. RAM: "Here's your RLS setup..."
7. Log to proof + memory

Total: ~3k tokens (vs. ~15k if loaded everything)
```

## One Specialist Per Call

- No agent-to-agent communication
- No "asking other specialists"
- If need multiple: RAM calls them sequentially
- Each call is independent

## Context Selection (Critical!)

✅ DO:
```
✓ Load required context only
✓ Load 1-2 optional context items
✓ Filter for relevance
✓ Exclude unrelated data
```

❌ DON'T:
```
✗ Load all memory
✗ Load all projects
✗ Load all tools
✗ Load full conversation history
```

---

# Specialist Calling Sequence

```
User Request
    ↓
Router identifies specialist(s) needed
    ↓
For each specialist:
    1. Load specialist definition
    2. Gather minimal context (required only)
    3. Build focused prompt (1-2k tokens)
    4. Call specialist agent
    5. Get result (code/specs/recommendations)
    6. Specialist DOES NOT call other specialists
    7. Return to RAM
    ↓
RAM summarizes all results
    ↓
Log to proof + memory
    ↓
User gets answer
```

---

# Token Efficiency Example

### ❌ OLD WAY (Before Specialists)
```
"Set up RLS for salary-cert"
→ Load full RAM context (all memory, all tools, all projects)
→ Load all specialist knowledge in one prompt
→ Call expensive model
Total: 15,000+ tokens
Time: 30+ seconds
Result: Slow, expensive, error-prone
```

### ✅ NEW WAY (With Specialists)
```
"Set up RLS for salary-cert"
→ Router: "Supabase specialist"
→ Load: schema, salary-cert table, RLS examples (300 tokens)
→ Load: Supabase specialist prompt (1k tokens)
→ Call model with focused context
→ Get SQL policies back
Total: ~2,500 tokens
Time: <5 seconds
Result: Fast, cheap, precise
```

**Savings: 6x cheaper, 6x faster!**

---

# Specialist Selection Guide

| User Request | Specialist | Context |
|---|---|---|
| "Debug database error" | Supabase | Schema, error log |
| "Deploy to production" | Vercel | Build config, env vars |
| "Create design system" | Figma | Brand, components |
| "Improve checkout flow" | UI/UX Pro | Current flow, goal |
| "Set up CDN caching" | Cloudflare | Domain, traffic |
| "Integrate sensors" | IoT | Device specs, protocol |
| "Multiple needs" | RAM + specialists | Sequential calls |

---

# Key Rules (Tham's Pattern)

1. **One specialist per call** - No agent collaboration
2. **Load context, not everything** - Required + 1-2 optional
3. **Short prompts** - 1-2k tokens max per specialist
4. **Fast return** - Specialist answers directly, no chat
5. **RAM summarizes** - User never sees raw specialist output
6. **Log & learn** - All results go to proof + memory

---

# Ready to Use

Specialists are defined. RAM can now:

```
✅ Route to specialists based on intent
✅ Load minimal context
✅ Call specialists efficiently
✅ Summarize results
✅ Log for learning
✅ Scale to more specialists as needed
```

**Cost: 10x cheaper than one-agent-does-all**
**Speed: 6x faster than multi-agent arguing**
**Quality: Better because focused expertise**

This is Tham's recommended pattern! 🎯
