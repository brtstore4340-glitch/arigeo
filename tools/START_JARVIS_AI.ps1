# START_JARVIS_AI.ps1 - Start Jarvis with AI Intent Parser (v0.2.0-ai)
# AI-Powered Windows Assistant with Claude, Grok, or Gemini

param(
    [string]$Command = "",
    [string]$Mode = "safe",
    [string]$IntentProvider = "claude",  # claude, grok, gemini
    [switch]$Interactive = $false,
    [switch]$DryRun = $false,
    [switch]$UseAI = $true,
    [switch]$SkipWatchdog = $false
)

$ErrorActionPreference = "Continue"

# ============================================================================
# CONFIGURATION LOADER
# ============================================================================

function Load-JarvisConfig {
    $configPath = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis-config.json"

    if (-not (Test-Path $configPath)) {
        Write-Host "⚠️  Config not found. Run RUN_JARVIS_SETUP.ps1 first." -ForegroundColor Yellow
        # Continue anyway with defaults
    }

    $config = @{
        install_dir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis"
        workspace = "D:\01 Main Work\Boots\Agentic AI\mission-control"
        logging = @{
            logs_dir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\logs"
        }
    }

    try {
        if (Test-Path $configPath) {
            $loaded = Get-Content $configPath | ConvertFrom-Json
            $config = $loaded
        }
    }
    catch {
        Write-Host "⚠️  Could not parse config, using defaults" -ForegroundColor Yellow
    }

    return $config
}

# ============================================================================
# MAIN ORCHESTRATOR
# ============================================================================

function Start-JarvisLoop {
    param(
        [string]$InitialCommand = "",
        [string]$Mode = "safe",
        [string]$IntentProvider = "claude"
    )

    $config = Load-JarvisConfig

    Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║    JARVIS LOCAL v0.2.0-ai - RUNNING       ║" -ForegroundColor Cyan
    Write-Host "║       AI-Powered Intent Parser            ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🧠 AI Provider:  $($IntentProvider.ToUpper())" -ForegroundColor Green
    Write-Host "Mode:            $Mode" -ForegroundColor Gray
    Write-Host "DryRun:          $DryRun" -ForegroundColor Gray
    Write-Host "AI Enabled:      $UseAI" -ForegroundColor Gray
    Write-Host ""

    $continuLoop = $true
    $loopCount = 0
    $sessionStart = Get-Date

    while ($continuLoop) {
        $loopCount++

        # Get input
        if ($InitialCommand -and $loopCount -eq 1) {
            $userInput = $InitialCommand
            Write-Host "💬 Input: $userInput" -ForegroundColor Magenta
        } elseif ($Interactive) {
            $userInput = Read-Host "jarvis> "
            if ($userInput -eq "exit" -or $userInput -eq "quit") {
                $continuLoop = $false
                break
            }
        } else {
            break  # Non-interactive, single command
        }

        Write-Host ""

        # Load AI core module
        $aiCoreScript = Join-Path $config.install_dir "core\jarvis-core-ai-integrated.ps1"
        $fallbackCoreScript = Join-Path $config.install_dir "core\jarvis-core.ps1"

        $coreScript = if (Test-Path $aiCoreScript) { $aiCoreScript } else { $fallbackCoreScript }

        if (-not (Test-Path $coreScript)) {
            Write-Error "Core module not found: $coreScript"
            break
        }

        # Execute core logic with AI
        try {
            & $coreScript `
                -Command $userInput `
                -Mode $Mode `
                -IntentProvider $IntentProvider `
                -DryRun:$DryRun `
                -UseAI:$UseAI
        } catch {
            Write-Error "Execution error: $($_.Exception.Message)"
        }

        Write-Host ""

        # After first command, exit unless interactive
        if (-not $Interactive) {
            $continuLoop = $false
        }
    }

    # Session summary
    $sessionEnd = Get-Date
    $duration = $sessionEnd - $sessionStart

    Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║           SESSION COMPLETED              ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Commands:   $loopCount"
    Write-Host "Duration:   $($duration.TotalSeconds)s"
    Write-Host "Provider:   $($IntentProvider.ToUpper())"
    Write-Host "Mode:       $Mode"
    Write-Host ""
}

# ============================================================================
# ENVIRONMENT VALIDATION
# ============================================================================

function Validate-Environment {
    Write-Host "Validating environment..." -ForegroundColor Yellow

    # Check PowerShell version
    if ($PSVersionTable.PSVersion.Major -lt 5) {
        Write-Error "PowerShell 5.0 or later required"
        exit 1
    }
    Write-Host "  ✓ PowerShell $($PSVersionTable.PSVersion.Major).$($PSVersionTable.PSVersion.Minor)"

    # Check API key for chosen provider
    if ($UseAI) {
        $apiKeyVar = switch ($IntentProvider.ToLower()) {
            "claude" { "ANTHROPIC_API_KEY" }
            "grok" { "GROK_API_KEY" }
            "gemini" { "GOOGLE_AI_KEY" }
            default { "" }
        }

        if ($apiKeyVar) {
            $apiKey = Get-ChildItem "Env:\$apiKeyVar" -ErrorAction SilentlyContinue
            if (-not $apiKey) {
                Write-Host "  ⚠️  $apiKeyVar not set" -ForegroundColor Yellow
                Write-Host "     Set it with: `$env:$apiKeyVar = 'your-key-here'" -ForegroundColor Yellow
                Write-Host "     Will fallback to regex if needed" -ForegroundColor Yellow
            } else {
                Write-Host "  ✓ $apiKeyVar detected"
            }
        }
    }

    Write-Host ""
}

# ============================================================================
# HELP
# ============================================================================

function Show-Help {
    Write-Host @"
╔════════════════════════════════════════════════════════════════╗
║              JARVIS LOCAL v0.2.0-ai - HELP                   ║
║         AI-Powered Windows Assistant (Alpha)                  ║
╚════════════════════════════════════════════════════════════════╝

USAGE:
  .\START_JARVIS_AI.ps1 [OPTIONS]

OPTIONS:
  -Command <string>       Single command to execute
  -Interactive            Start interactive mode (loop)
  -Mode <string>          safe (default), interactive, risk-approved
  -IntentProvider <string> claude (default), grok, gemini
  -UseAI <bool>          Enable AI intent parser (default: true)
  -DryRun                Simulate without executing
  -SkipWatchdog          Disable watchdog timer

EXAMPLES:
  # Single command with AI (Claude)
  .\START_JARVIS_AI.ps1 -Command "open chrome"

  # With Grok AI
  .\START_JARVIS_AI.ps1 -Command "take a screenshot" -IntentProvider grok

  # Thai language (best with Claude)
  .\START_JARVIS_AI.ps1 -Command "ถ่ายภาพหน้าจอ" -IntentProvider claude

  # Fallback to regex (no API needed)
  .\START_JARVIS_AI.ps1 -Command "help" -UseAI:$false

  # Interactive mode
  .\START_JARVIS_AI.ps1 -Interactive

  # Test without executing
  .\START_JARVIS_AI.ps1 -Command "open chrome" -DryRun

ENVIRONMENT VARIABLES:
  ANTHROPIC_API_KEY    Claude API key (https://console.anthropic.com)
  GROK_API_KEY         Grok API key (https://console.x.ai)
  GOOGLE_AI_KEY        Gemini API key (https://ai.google.dev)

UPGRADE GUIDE:
  See: AI_UPGRADE_GUIDE.md in this directory

MORE:
  https://github.com/.../jarvis-local
"@
}

# ============================================================================
# MAIN ENTRY POINT
# ============================================================================

# Validate environment
Validate-Environment

# Show help if no command
if (-not $Command -and -not $Interactive) {
    Show-Help
    exit 0
}

# Start main loop
if ($Command) {
    Start-JarvisLoop -InitialCommand $Command -Mode $Mode -IntentProvider $IntentProvider
} elseif ($Interactive) {
    Start-JarvisLoop -Mode $Mode -IntentProvider $IntentProvider
}
