# Jarvis Local MVP - Windows PowerShell Assistant

> "Jarvis does not control the computer directly. Intent flows through a gate."

## Overview

**Jarvis Local MVP** is a Windows-based personal digital assistant built in PowerShell-first architecture. It receives Thai/English voice and text commands, routes them through a safety gate, executes approved actions, and speaks back using local or free Thai TTS.

### Key Features

- **PowerShell-first architecture** — modular, single-machine setup
- **Intent parsing** — understands Thai and English commands
- **Risk gate** — all autonomous actions require safety evaluation
- **Allowlist-based execution** — only approved actions run
- **Local-first design** — works offline with Windows SAPI
- **Proof logging** — every action is logged (audit trail)
- **Monthly memory** — command history and learning capture
- **No API keys in source** — credentials from environment only

### Architecture

```
User Input (voice/text)
    ↓
Intent Parser (command recognition)
    ↓
Risk Gate (evaluate safety)
    ↓
Command Router (which module handles this?)
    ↓
Executor (run if approved)
    ↓
Proof Logger (record what happened)
    ↓
Speak Back (TTS response)
```

### Modules

| Module | Purpose | Status |
|--------|---------|--------|
| **jarvis-core** | Intent parsing, routing, risk gate, execution | ✓ Complete |
| **jarvis-voice** | Local Windows SAPI TTS, placeholders for external | ✓ Complete |
| **jarvis-computer-use** | Screenshot, UI actions, allowlist | ✓ Complete |
| **jarvis-connectors** | File system, browser, Gmail, GitHub placeholders | ✓ Complete |
| **jarvis-memory** | Local JSONL memory, history, monthly summaries | ✓ Complete |
| **jarvis-dashboard** | Status page (planned for v0.2) | — |

## Quick Start

### Prerequisites

- Windows 10+ or Windows Server 2019+
- PowerShell 5.0+
- Path: `D:\01 Main Work\Boots\Agentic AI\mission-control`

### 1. Run Setup

```powershell
cd "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis-staging"
.\RUN_JARVIS_SETUP.ps1
```

**What it does:**
- ✓ Validates workspace paths
- ✓ Creates directory structure
- ✓ Copies modules to install directory
- ✓ Generates configuration
- ✓ Creates backup of staging files
- ✓ Updates `LAST_BACKUP_DIR.txt`
- ✓ Writes proof log

**Dry-run mode:**
```powershell
.\RUN_JARVIS_SETUP.ps1 -DryRun
```

### 2. Review Configuration

Edit the generated config:
```
D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis-config.json
```

Key settings:
- `mode`: "safe" (default), "interactive", "risk-approved"
- `voice_settings.default_voice`: Windows voice name
- `computer_use.require_approval`: Always true for MVP
- `connectors.browser_default`: "chrome", "firefox", "edge"

### 3. Start Jarvis

**Single command:**
```powershell
cd "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis-staging"
.\START_JARVIS.ps1 -Command "help"
.\START_JARVIS.ps1 -Command "screenshot"
.\START_JARVIS.ps1 -Command "search thai language" -DryRun
```

**Interactive mode:**
```powershell
.\START_JARVIS.ps1 -Interactive
jarvis> help
jarvis> status
jarvis> screenshot
jarvis> exit
```

## Commands

### Core Commands

| Command | Description | Risk | Approval |
|---------|-------------|------|----------|
| `help` | Show help text | Low | No |
| `status` | Show Jarvis status | Low | No |
| `screenshot` | Capture screen | Low | No |
| `open <app>` | Open application | Medium | Yes |
| `search <query>` | Google search | Medium | Yes |
| `send <msg>` | Send message | Medium | Yes |
| `list <items>` | List directory | Low | No |

### Examples

```powershell
# Show help
.\START_JARVIS.ps1 -Command "help"

# Take screenshot
.\START_JARVIS.ps1 -Command "screenshot"

# Search for something
.\START_JARVIS.ps1 -Command "search thai tts"

# Open application
.\START_JARVIS.ps1 -Command "open notepad" -Mode interactive

# Dry-run (don't actually execute)
.\START_JARVIS.ps1 -Command "screenshot" -DryRun

# Interactive mode with watchdog disabled
.\START_JARVIS.ps1 -Interactive -SkipWatchdog
```

## Execution Modes

### Safe Mode (Default)
- Low-risk actions execute automatically
- Medium/high-risk actions require approval
- User can interactively approve or deny

```powershell
.\START_JARVIS.ps1 -Command "open chrome" -Mode safe
```

### Interactive Mode
- Every action prompts user before execution
- User can review before approving

```powershell
.\START_JARVIS.ps1 -Interactive -Mode interactive
```

### Risk-Approved Mode
- All approved actions execute without prompting
- Only blocked actions prevent execution
- For scripting/automation

```powershell
.\START_JARVIS.ps1 -Command "screenshot" -Mode risk-approved
```

## Risk Gate Examples

### Low Risk (Auto-Execute)
- `help`, `status`, `list`, `screenshot` — No approval needed

### Medium Risk (Approval Required)
- `open <app>` — User must confirm
- `search <query>` — User must confirm
- `send <msg>` — User must confirm

### High Risk (Blocked)
- `delete-file` — BLOCKED
- `uninstall-software` — BLOCKED
- `format-drive` — BLOCKED
- `shutdown` — BLOCKED
- `reboot` — BLOCKED

## Directory Structure

```
D:\01 Main Work\Boots\Agentic AI\mission-control\
├── tools/
│   ├── jarvis-staging/                 # Source files
│   │   ├── core/
│   │   │   └── jarvis-core.ps1
│   │   ├── voice/
│   │   │   └── jarvis-voice.ps1
│   │   ├── computer-use/
│   │   │   └── jarvis-computer-use.ps1
│   │   ├── connectors/
│   │   │   └── jarvis-connectors.ps1
│   │   ├── memory/
│   │   │   └── jarvis-memory.ps1
│   │   ├── RUN_JARVIS_SETUP.ps1
│   │   ├── START_JARVIS.ps1
│   │   ├── config.example.json
│   │   └── README_JARVIS_LOCAL.md
│   │
│   ├── jarvis/                         # Installed modules
│   │   ├── core/
│   │   ├── voice/
│   │   ├── computer-use/
│   │   ├── connectors/
│   │   └── memory/
│   │
│   ├── logs/                           # Execution logs
│   │   ├── proof-log.jsonl
│   │   └── setup-proof-*.json
│   │
│   ├── screenshots/                    # Captured images
│   ├── voice-output/                   # TTS output files
│   ├── memory/                         # Command history
│   ├── backup/                         # Setup backups
│   ├── jarvis-config.json              # Active configuration
│   ├── action-queue.jsonl              # Pending actions
│   ├── action-allowlist.json           # Allowed actions
│   └── LAST_BACKUP_DIR.txt             # Last backup path
```

## Logging & Proof

All actions are logged in JSONL format (one JSON object per line):

### Proof Log
```json
{
  "timestamp": "2026-06-30T01:37:00.123Z",
  "intent": "screenshot",
  "input": "screenshot",
  "risk_level": "low",
  "risk_score": 0,
  "approved": true,
  "executor": "jarvis-computer-use",
  "handler": "Capture-Screenshot",
  "result": true,
  "execution_mode": "safe",
  "dry_run": false
}
```

### Command History
```json
{
  "timestamp": "2026-06-30T01:37:00.123Z",
  "category": "command",
  "data": {
    "intent": "help",
    "input": "help",
    "result": true
  }
}
```

View logs:
```powershell
# View proof log
Get-Content "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\logs\proof-log.jsonl" | ConvertFrom-Json | Select -Last 5

# View command history
Get-Content "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\memory\command-history.jsonl" -Tail 10
```

## Memory & History

Jarvis maintains local memory in JSONL format:

```powershell
# List recent commands
.\jarvis-staging\START_JARVIS.ps1 -Command "memory --action history"

# Generate monthly summary
.\jarvis-staging\START_JARVIS.ps1 -Command "memory --action summarize"

# Export memory
.\jarvis-staging\START_JARVIS.ps1 -Command "memory --action export --format csv"

# Cleanup old memory (>90 days)
.\jarvis-staging\START_JARVIS.ps1 -Command "memory --action cleanup"
```

## Voice & TTS

### Local TTS (Default)
Uses Windows SAPI (free, offline, no API key needed):

```powershell
# List available voices
.\jarvis-staging\START_JARVIS.ps1 -Command "voice --action list-voices"

# Set preferred voice
.\jarvis-staging\START_JARVIS.ps1 -Command "voice --action set-voice --voice 'Microsoft Zira Desktop'"
```

### External TTS (Optional)
For better Thai support, set environment variables:

```powershell
# Google TTS
$env:GOOGLE_TTS_KEY = "your-key-here"

# OpenAI TTS
$env:OPENAI_API_KEY = "sk-..."

# Grok TTS (xAI)
$env:GROK_API_KEY = "your-key-here"
```

Then use:
```powershell
.\START_JARVIS.ps1 -Command "voice --action tts --provider google"
```

## Computer Use & Allowlist

### Safe Actions (Auto-Execute)
```powershell
.\START_JARVIS.ps1 -Command "screenshot"
```

### Approval-Required Actions
```powershell
.\START_JARVIS.ps1 -Command "open notepad" -Mode interactive
```

### Queue Actions
```powershell
# Queue an action (requires approval later)
.\START_JARVIS.ps1 -Command "queue-action --action open-app --target chrome"

# List pending actions
.\START_JARVIS.ps1 -Command "list-queue"

# Approve action
.\START_JARVIS.ps1 -Command "approve-action --id abc123"

# Execute approved queue
.\START_JARVIS.ps1 -Command "execute-queue"
```

## API Keys & Secrets

**IMPORTANT:** Never store API keys in source code!

All credentials must come from environment variables:

```powershell
# Set before running Jarvis
$env:GITHUB_TOKEN = "ghp_..."
$env:GMAIL_CREDS = "path/to/credentials.json"
$env:OPENAI_API_KEY = "sk-..."

# Then run
.\START_JARVIS.ps1 -Command "status"
```

Or add to PowerShell profile:
```powershell
# ~/.profile or $PROFILE
$env:GITHUB_TOKEN = "ghp_..."
```

## Troubleshooting

### Setup Fails: Path Not Found
```powershell
# Verify workspace exists
Test-Path "D:\01 Main Work\Boots\Agentic AI\mission-control"

# Verify staging directory
Test-Path "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis-staging"
```

### Config Not Found
```powershell
# Re-run setup
.\RUN_JARVIS_SETUP.ps1

# Check proof log
Get-Content "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\logs\setup-proof-*.json" | ConvertFrom-Json
```

### Voice Not Working
```powershell
# List available voices
& "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis\voice\jarvis-voice.ps1" -Action "list-voices"

# Test local TTS
& "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis\voice\jarvis-voice.ps1" -Action "tts" -Text "Hello"
```

### Screenshot Fails
```powershell
# Check screenshot directory exists
Test-Path "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\screenshots"

# Try directly
& "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis\computer-use\jarvis-computer-use.ps1" -Action "screenshot"
```

## Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `GITHUB_TOKEN` | GitHub API access | Optional |
| `GITHUB_USER` | GitHub username | Optional |
| `GMAIL_CREDS` | Gmail OAuth2 credentials | Optional |
| `GOOGLE_TTS_KEY` | Google Cloud TTS API | Optional |
| `OPENAI_API_KEY` | OpenAI API key | Optional |
| `GROK_API_KEY` | Grok API key | Optional |

## Security Rules

1. ✓ **No destructive commands without explicit approval**
2. ✓ **All API keys from environment, never hardcoded**
3. ✓ **Every action logged to proof-log.jsonl**
4. ✓ **Allowlist-based execution only**
5. ✓ **Monthly audit of command history**
6. ✓ **Backup of configuration before changes**

## Next Steps (v0.2 Roadmap)

- [ ] Web dashboard for status and logs
- [ ] Advanced Thai language NLP
- [ ] Gmail integration with OAuth2
- [ ] Calendar integration
- [ ] GitHub issue/PR automation
- [ ] AI-powered intent understanding (optional Grok API)
- [ ] Voice input (STT) via Azure Speech or Google Cloud
- [ ] Multi-user mode with role-based access
- [ ] Mobile app for remote commands

## Support & References

### Proof Log Locations
- Setup: `D:\01 Main Work\Boots\Agentic AI\mission-control\tools\logs\setup-proof-*.json`
- Runtime: `D:\01 Main Work\Boots\Agentic AI\mission-control\tools\logs\proof-log.jsonl`

### Configuration
- Active: `D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis-config.json`
- Template: `config.example.json` (in this directory)

### Memory & History
- Command history: `tools\memory\command-history.jsonl`
- Interaction log: `tools\memory\interaction-log.jsonl`
- Summaries: `tools\memory\summaries\summary-YYYY-MM.json`

### Modules
- Source: `tools\jarvis-staging\` (staging)
- Installed: `tools\jarvis\` (production)

## License & Attribution

**Jarvis Local MVP** — Built with PowerShell and love.

- Architecture: Modular, PowerShell-first
- Design: Intent → Risk Gate → Executor → Proof
- Philosophy: "Jarvis does not control the computer directly"

---

**Last Updated:** 2026-06-30
**Version:** 0.1.0-mvp
**Status:** Ready for local testing
