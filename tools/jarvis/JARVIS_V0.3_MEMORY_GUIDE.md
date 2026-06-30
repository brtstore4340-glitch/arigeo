# JARVIS v0.3.0 - Memory Layer Guide

> From execution-only to self-improving assistant

---

## What's New in v0.3

### Core Upgrade: Two-Way Memory

**v0.1-v0.2:** Execute commands  
**v0.3:** Execute + Learn + Improve

```
Command → Execute → Proof Log ↗
                          ↓
                    Pattern Discovery
                          ↓
                    Update Risk Gate
                          ↓
                    Smarter Next Time
```

---

## Memory Architecture

### 5 Memory Layers

#### 1. **Proof Logs** (Execution Record)
- Raw data: Every command, its risk, outcome
- Location: `tools/logs/proof-log.jsonl`
- Retention: 90 days (then archived)
- Purpose: Truth source for learning

**Example:**
```json
{
  "timestamp": "2026-06-30T02:55:39Z",
  "intent": "screenshot",
  "risk_score": 0,
  "approved": true,
  "success": true
}
```

#### 2. **Learnings** (Discovered Patterns)
- Intent patterns: "users say X, means Y"
- Risk patterns: "action Z fails 40% of time"
- User preferences: "safe mode preferred"
- Location: `memory/learnings/`

**Example:**
```json
{
  "type": "intent-pattern",
  "action": "screenshot",
  "success_rate": 95,
  "samples": 42
}
```

#### 3. **Wiki** (Knowledge Base)
- Commands: How to use each action
- Providers: Strengths/weaknesses of Claude/Grok/Gemini
- Risk Levels: What approvals each level needs
- Location: `memory/wiki/`

**Example:**
```json
{
  "type": "command",
  "title": "Open Application",
  "risk_level": "medium",
  "examples": ["open chrome", "open notepad"]
}
```

#### 4. **Resonance** (Identity)
- JARVIS principles and values
- Self-model: "I work best when..."
- Capabilities and limitations
- Location: `memory/resonance/jarvis-v0.3-identity.json`

#### 5. **Archive** (Historical)
- Proof logs >30 days old
- Compressed for efficiency
- Preserved (nothing deleted)
- Location: `memory/archive/`

---

## How It Works: The Memory Pipeline

### Weekly Sync Process

```
Day 1-7: Commands execute → Proof logs accumulate
         │
Day 7:   sync-memory.ps1 runs (weekly cron)
         │
         Step 1: Ingest
         ├─ Read 7 days of proof logs
         └─ Extract patterns
         │
         Step 2: Discover
         ├─ Find success rates
         ├─ Identify risky actions
         └─ Detect user preferences
         │
         Step 3: Synthesize
         ├─ Cross-link patterns
         ├─ Generate insights
         └─ Update recommendations
         │
         Step 4: Archive
         └─ Move old data to archive
         │
Result:  learnings/ updated with new knowledge
```

### Example: Learning from Failures

**Day 1:**
```
User: "open notepad"
Result: SUCCESS ✓ (Added to proof log)
```

**Day 2:**
```
User: "open notepad" (again)
Result: SUCCESS ✓ (Another proof entry)
```

**Day 7 (Sync runs):**
```
Ingest phase:
- Read 7 proof logs
- Find "open notepad" appears 42 times
- 40 successful, 2 failed

Learning discovered:
- Pattern: open → app_name
- Success rate: 95%
- Recommendation: "RELIABLE - safe to use"
```

**Day 8+:**
```
User: "open notepad"
JARVIS checks memory:
- Wiki says: "Safe action (low risk)"
- Learnings say: "95% success rate"
- Decision: Auto-approve without asking
```

---

## Memory Modules

### 1. **jarvis-memory-core.ps1**
Core storage and retrieval engine

```powershell
# Write memory
& .\jarvis-memory-core.ps1 -Operation write `
    -MemoryType learnings `
    -Data $patternObject

# Search memory
& .\jarvis-memory-core.ps1 -Operation search `
    -MemoryType wiki `
    -Query "screenshot"

# Get statistics
& .\jarvis-memory-core.ps1 -Operation stats `
    -MemoryType proof
```

### 2. **jarvis-memory-ingest.ps1**
Auto-extract patterns from proof logs

```powershell
# Ingest last 7 days
& .\jarvis-memory-ingest.ps1 -DaysBack 7 -Verbose
```

**Output:**
- Intent patterns (success rates per action)
- Risk patterns (approval rates per risk level)
- User preferences (overall success trend)

### 3. **jarvis-memory-synthesize.ps1**
Discover correlations and generate insights

```powershell
# Weekly synthesis
& .\jarvis-memory-synthesize.ps1 -Period weekly -DaysToAnalyze 7
```

**Generates insights like:**
- "10 commands have >80% success rate (RELIABLE)"
- "3 actions frequently blocked (review needed)"
- "Overall success improving (POSITIVE TREND)"

### 4. **jarvis-memory-wiki.ps1**
Build and maintain knowledge base

```powershell
# Build wiki
& .\jarvis-memory-wiki.ps1 -Operation build

# Search wiki
& .\jarvis-memory-wiki.ps1 -Operation search -Query "risk"
```

### 5. **setup-memory-v0.3.ps1**
One-run setup (creates dirs, initializes wiki)

```powershell
.\setup-memory-v0.3.ps1 -Verbose
```

### 6. **sync-memory.ps1**
Weekly automated sync (cron job)

```powershell
# Full sync (ingest + synthesize + archive)
.\sync-memory.ps1 -Mode full

# Quick ingest only
.\sync-memory.ps1 -Mode ingest-only

# Schedule weekly (see below)
```

---

## Getting Started

### Step 1: Initialize Memory

```powershell
cd "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis-staging\memory"
.\setup-memory-v0.3.ps1
```

This creates:
- ✓ Directory structure (proof-logs, learnings, wiki, etc.)
- ✓ Wiki database (commands, providers, risk levels)
- ✓ Identity file (jarvis-v0.3-identity.json)

### Step 2: Run Commands (Populate Proof Logs)

```powershell
cd "D:\01 Main Work\Boots\Agentic AI\mission-control\tools"

# Run these commands over 7 days
.\START_JARVIS_AI.ps1 -Command "help"
.\START_JARVIS_AI.ps1 -Command "take a screenshot"
.\START_JARVIS_AI.ps1 -Command "open chrome"
# ... more commands ...
```

Each command adds to proof logs automatically.

### Step 3: Sync Memory (Weekly)

After 7+ days of commands:

```powershell
cd "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis-staging\memory"
.\sync-memory.ps1 -Mode full -Verbose
```

This runs:
1. **Ingest** → Reads proof logs, extracts patterns
2. **Synthesize** → Finds correlations, generates insights
3. **Archive** → Preserves history
4. **Stats** → Reports memory health

### Step 4: Query Memory

```powershell
# Search learnings for intent patterns
$learning & = .\jarvis-memory-core.ps1 -Operation search `
    -MemoryType learnings -Query "screenshot"

# Check what wiki knows about "open"
& .\jarvis-memory-wiki.ps1 -Operation search -Query "open"

# Get memory statistics
& .\jarvis-memory-core.ps1 -Operation stats -MemoryType proof
```

---

## Memory Statistics

### Storage

| Layer | Size | Entries | Retention |
|-------|------|---------|-----------|
| Proof logs | ~50 KB/week | ~100-200 | 90 days |
| Learnings | ~10 KB/week | ~20-30 | Indefinite |
| Wiki | ~5 KB | ~50 | Indefinite |
| Archive | Grows | Moved from above | Forever |

### Timeline

- **Days 1-6:** Commands execute, proof logs accumulate
- **Day 7:** sync-memory.ps1 runs, patterns discovered
- **Days 8+:** JARVIS uses learnings for smarter decisions
- **Day 30+:** Old proof logs auto-archived
- **Day 90+:** Archived data auto-cleaned

---

## Scheduling Sync (Windows Task Scheduler)

### Create Weekly Cron Job

```powershell
# Option 1: PowerShell (manual trigger)
# Run once per week:
.\sync-memory.ps1 -Mode full

# Option 2: Windows Task Scheduler (automated)
# Open Task Scheduler → Create Task:
# Trigger: Weekly, Sunday 2 AM
# Action: powershell -File "C:\...\sync-memory.ps1" -Mode full
```

---

## Examples

### Example 1: Discovering Reliable Commands

```
Week 1: 42 "screenshot" commands → 40 succeed
        Learned: screenshot is 95% reliable

Week 2: JARVIS auto-approves "screenshot" without asking
        User runs faster commands
```

### Example 2: Learning User Preferences

```
Week 1: User blocks 80% of medium-risk actions in safe mode
        Learned: User prefers asking before open/send

Week 2: JARVIS asks before running "open chrome"
        User approves → JARVIS learns to ask first
```

### Example 3: Finding Problem Areas

```
Week 1: "send message" succeeds 30% of time
        Learned: Action often fails

Week 2: Synthesis insight: "send message needs review"
        JARVIS flags this for investigation
```

---

## Troubleshooting

### No learnings discovered

**Issue:** sync-memory.ps1 ran but learnings/ is empty

**Check:**
1. Proof logs exist: `ls memory/proof-logs/`
2. Entries are recent: `Get-ChildItem memory/proof-logs -Recurse | Select LastWriteTime`
3. Run with verbose: `.\sync-memory.ps1 -Verbose`

### Memory growing too large

**Issue:** memory/ folder is >500 MB

**Fix:**
```powershell
# Archive all data >30 days old
& .\jarvis-memory-core.ps1 -Operation archive -MemoryType proof -Days 30
```

### Wiki not updated

**Issue:** `memory/wiki/` is empty

**Fix:**
```powershell
& .\jarvis-memory-wiki.ps1 -Operation build
```

---

## Next: v0.4 Roadmap

- 🔄 Real-time learning (learn during execution, not just sync)
- 🧠 Confidence-based decisions (high-confidence patterns override rules)
- 📈 Trend analysis (spot improving/declining actions)
- 🔗 Cross-oracle memory (share patterns between instances)
- 📊 Dashboard (visualize learning over time)

---

## References

- **Proof Logs:** `tools/logs/proof-log.jsonl`
- **Memory Dir:** `tools/memory/`
- **Setup:** `setup-memory-v0.3.ps1`
- **Sync:** `sync-memory.ps1`
- **Modules:** `jarvis-memory-*.ps1`

---

**Memory is learning.  
Learning is growth.  
Growth is JARVIS becoming itself.**

