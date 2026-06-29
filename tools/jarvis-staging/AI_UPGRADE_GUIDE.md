# Jarvis v0.2.0 AI Upgrade Guide

> **From Regex Patterns to Intelligent Intent Understanding**

## What's New

Jarvis v0.2 replaces simple regex pattern matching with **AI-powered intent parsing** using Claude, Grok, or Gemini.

### Before (v0.1 - Regex)
```powershell
Pattern: open\s+(.+)
Input:   "open chrome"
Output:  action=open, target=chrome ✓
Input:   "can you open the chrome browser for me?"
Output:  NO MATCH ✗
```

### After (v0.2 - AI)
```powershell
Input:   "open chrome"
AI:      action=open, target=chrome ✓
Input:   "can you open the chrome browser for me?"
AI:      action=open, target=chrome ✓ (understands intent!)
Input:   "ถ่ายภาพหน้าจอ" (Thai: take a screenshot)
AI:      action=screenshot ✓
```

---

## Quick Start (5 minutes)

### Step 1: Get an API Key

Choose ONE provider:

**Option A: Claude (Recommended for Thai)**
```
1. Go to https://console.anthropic.com
2. Create account or login
3. Go to API Keys section
4. Create new key
5. Copy the key
```

**Option B: Grok (Faster, cheaper)**
```
1. Go to https://console.x.ai
2. Create account
3. Create API key
4. Copy the key
```

**Option C: Gemini (Google)**
```
1. Go to https://ai.google.dev
2. Get free API key (no credit card needed)
3. Copy the key
```

### Step 2: Set Environment Variable

In PowerShell (your terminal):

**For Claude:**
```powershell
$env:ANTHROPIC_API_KEY = "sk-ant-v0-..."
```

**For Grok:**
```powershell
$env:GROK_API_KEY = "xai-..."
```

**For Gemini:**
```powershell
$env:GOOGLE_AI_KEY = "AIza..."
```

### Step 3: Test AI Intent Parser

```powershell
cd "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis-staging\core"

# Test Claude
.\jarvis-intent-ai.ps1 -UserInput "take a screenshot" -Provider claude

# Test Grok
.\jarvis-intent-ai.ps1 -UserInput "search for thai language" -Provider grok

# Test Thai command
.\jarvis-intent-ai.ps1 -UserInput "ถ่ายภาพหน้าจอ" -Provider claude
```

### Step 4: Run Jarvis with AI

```powershell
cd "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis-staging"

# With Claude AI
.\START_JARVIS.ps1 -Command "open chrome" -Mode safe

# With Grok AI
$env:GROK_API_KEY = "your-key-here"
.\START_JARVIS_AI.ps1 -Command "can you take a screenshot for me?" -IntentProvider grok
```

---

## Installation

### Option 1: Use New AI-Integrated Version
```powershell
# Replace old START_JARVIS.ps1 with AI version
Copy-Item "START_JARVIS_AI.ps1" "START_JARVIS.ps1" -Force

# Verify
.\START_JARVIS.ps1 -Command "help"
```

### Option 2: Keep Both Versions
```powershell
# Keep original
.\START_JARVIS.ps1 -Command "help"  # Uses regex (v0.1)

# Use AI version
.\START_JARVIS_AI.ps1 -Command "help"  # Uses AI (v0.2)

# Toggle: disable AI, use fallback
.\START_JARVIS_AI.ps1 -Command "help" -UseAI:$false
```

---

## Configuration

### Persistent Environment Setup

To avoid setting API keys each time, add to PowerShell profile:

```powershell
# Open profile editor
notepad $PROFILE

# Add these lines:
$env:ANTHROPIC_API_KEY = "sk-ant-v0-..."
$env:GROK_API_KEY = "xai-..."
$env:GOOGLE_AI_KEY = "AIza..."

# Save and reload PowerShell
& $PROFILE
```

### Switch Providers

```powershell
# Use Claude (default, best for Thai)
.\START_JARVIS_AI.ps1 -Command "help" -IntentProvider claude

# Use Grok (faster)
.\START_JARVIS_AI.ps1 -Command "help" -IntentProvider grok

# Use Gemini
.\START_JARVIS_AI.ps1 -Command "help" -IntentProvider gemini

# Fallback to regex if API fails
.\START_JARVIS_AI.ps1 -Command "help" -UseAI:$false
```

---

## What Each Provider Is Good For

| Provider | Thai | Speed | Cost | Comments |
|----------|------|-------|------|----------|
| **Claude** | ⭐⭐⭐ Best | ⭐⭐ Good | ⭐⭐⭐ ~$0.003/req | Best for language nuance, Thai idioms |
| **Grok** | ⭐⭐ Ok | ⭐⭐⭐ Fast | ⭐⭐⭐ ~$0.002/req | Faster responses, good balance |
| **Gemini** | ⭐⭐ Ok | ⭐⭐⭐ Very Fast | ⭐⭐⭐⭐ Free tier | Best price, smaller context |

**Recommendation:** Start with Claude for Thai support, try Grok if speed/cost matters.

---

## Testing Examples

### Test Natural Language Commands

```powershell
# These all work now:
.\START_JARVIS_AI.ps1 -Command "can you open chrome for me?"
.\START_JARVIS_AI.ps1 -Command "please take a screenshot"
.\START_JARVIS_AI.ps1 -Command "search the web for thai language resources"
.\START_JARVIS_AI.ps1 -Command "what can you do?"
```

### Test Thai Commands

```powershell
# Thai language support (with Claude):
.\START_JARVIS_AI.ps1 -Command "ถ่ายภาพหน้าจอ" -IntentProvider claude
.\START_JARVIS_AI.ps1 -Command "เปิด notepad" -IntentProvider claude
.\START_JARVIS_AI.ps1 -Command "ค้นหาข้อมูล" -IntentProvider claude
```

### Test Confidence Levels

The AI parser returns confidence scores:

```
High confidence (0.95): "take a screenshot"
Medium confidence (0.75): "can you take a screenshot for me please"
Low confidence (0.50): "I need a screenshot but maybe not now"
```

---

## Troubleshooting

### API Key Error
```
Error: ANTHROPIC_API_KEY not set
```
**Fix:** Set the environment variable:
```powershell
$env:ANTHROPIC_API_KEY = "your-key-here"
```

### Slow Responses
```
AI Intent Parser: Taking 5+ seconds
```
**Fix:** Switch to faster provider:
```powershell
.\START_JARVIS_AI.ps1 -Command "help" -IntentProvider grok
```

### AI Parser Fails, Falls Back to Regex
```
⚠️ AI parsing failed, using fallback: Connection timeout
```
**Expected behavior.** Jarvis automatically falls back to regex if:
- API key is invalid
- Network is down
- Rate limit exceeded

To disable AI fallback:
```powershell
.\START_JARVIS_AI.ps1 -Command "help" -UseAI:$false  # Force regex only
```

### Thai Command Not Understood
```
Input: "ถ่ายภาพหน้าจอ"
Output: action=unknown, confidence=0.0
```
**Fix:** Use Claude (best Thai support):
```powershell
.\START_JARVIS_AI.ps1 -Command "ถ่ายภาพหน้าจอ" -IntentProvider claude
```

---

## Files Changed/Added

### New Files
- `jarvis-intent-ai.ps1` — AI intent parser (Claude, Grok, Gemini)
- `jarvis-core-ai-integrated.ps1` — Updated core with AI support
- `START_JARVIS_AI.ps1` — Enhanced start script
- `AI_UPGRADE_GUIDE.md` — This file

### Modified Files
- `jarvis-core.ps1` — Original regex version (still works)
- `START_JARVIS.ps1` — Original version (still works)

### Backward Compatible
✓ Old v0.1 scripts still work  
✓ Can run both versions in parallel  
✓ Easy rollback to regex

---

## Next Steps

1. **Get API key** (5 min) — Choose Claude, Grok, or Gemini
2. **Test AI parser** (2 min) — Run test commands
3. **Deploy** (1 min) — Copy new files or replace START_JARVIS.ps1
4. **Try natural language** (5 min) — Test complex commands
5. **Try Thai** (5 min) — Test Thai language support

---

## Cost Estimate

Approximate API costs at scale:

| Provider | Requests/Day | Cost/Month |
|----------|---------|-----------|
| Claude | 100 | ~$0.09 |
| Grok | 100 | ~$0.06 |
| Gemini | 100 | FREE (free tier) |
| Claude | 1000 | ~$0.90 |
| Grok | 1000 | ~$0.60 |

**Very affordable** for personal assistant use.

---

## References

- **Claude API**: https://docs.anthropic.com
- **Grok API**: https://console.x.ai/docs
- **Gemini API**: https://ai.google.dev/docs
- **Jarvis Local MVP**: https://github.com/.../jarvis-local

---

**Ready to upgrade?** Start with Step 1! 🚀
