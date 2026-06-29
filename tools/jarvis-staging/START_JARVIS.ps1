# START_JARVIS.ps1 - Start Jarvis Local MVP Main Loop
# Handles command input, routing, and orchestration

param(
    [string]$Command = "",
    [string]$Mode = "safe",  # safe, interactive, risk-approved
    [switch]$Interactive = $false,
    [switch]$DryRun = $false,
    [switch]$SkipWatchdog = $false
)

$ErrorActionPreference = "Continue"

# ============================================================================
# CONFIGURATION LOADER
# ============================================================================

function Load-JarvisConfig {
    $configPath = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis-config.json"

    if (-not (Test-Path $configPath)) {
        Write-Error "Config not found. Run RUN_JARVIS_SETUP.ps1 first."
        exit 1
    }

    $config = Get-Content $configPath | ConvertFrom-Json
    return $config
}

# ============================================================================
# MAIN ORCHESTRATOR
# ============================================================================

function Start-JarvisLoop {
    param(
        [string]$InitialCommand = "",
        [string]$Mode = "safe"
    )

    $config = Load-JarvisConfig
    $installDir = $config.install_dir
    $loopCount = 0
    $sessionStart = Get-Date

    Write-Host "╔════════════════════════════════════════════╗"
    Write-Host "║      JARVIS LOCAL MVP - RUNNING          ║"
    Write-Host "╚════════════════════════════════════════════╝"
    Write-Host ""
    Write-Host "Mode:     $Mode"
    Write-Host "DryRun:   $DryRun"
    Write-Host "Config:   $($config.workspace)"
    Write-Host ""

    $continuLoop = $true

    while ($continuLoop) {
        $loopCount++

        # Get input
        if ($InitialCommand -and $loopCount -eq 1) {
            $userInput = $InitialCommand
            Write-Host "Input: $userInput"
        } elseif ($Interactive) {
            $userInput = Read-Host "jarvis> "
            if ($userInput -eq "exit" -or $userInput -eq "quit") {
                $continuLoop = $false
                break
            }
        } else {
            break  # Non-interactive, single command
        }

        # Load core module
        $coreScript = "$installDir\core\jarvis-core.ps1"
        if (-not (Test-Path $coreScript)) {
            Write-Error "Core module not found: $coreScript"
            break
        }

        # Execute core logic
        try {
            & $coreScript -Input $userInput -Mode $Mode -DryRun:$DryRun
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

    Write-Host "╔════════════════════════════════════════════╗"
    Write-Host "║           SESSION COMPLETED              ║"
    Write-Host "╚════════════════════════════════════════════╝"
    Write-Host ""
    Write-Host "Commands processed: $loopCount"
    Write-Host "Duration: $($duration.TotalSeconds)s"
    Write-Host "Mode: $Mode"

    # Log session
    Log-Session -LoopCount $loopCount -Duration $duration -Config $config
}

# ============================================================================
# SESSION LOGGING
# ============================================================================

function Log-Session {
    param(
        [int]$LoopCount,
        [timespan]$Duration,
        $Config
    )

    $sessionLog = @{
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ"
        type = "session"
        commands_processed = $LoopCount
        duration_seconds = [int]$Duration.TotalSeconds
        mode = $Mode
        dry_run = $DryRun
    }

    $logsDir = $Config.logging.logs_dir
    $sessionLogPath = "$logsDir\sessions-$(Get-Date -Format 'yyyyMMdd').jsonl"

    $sessionJson = $sessionLog | ConvertTo-Json -Compress
    Add-Content -Path $sessionLogPath -Value $sessionJson
}

# ============================================================================
# WATCHDOG TIMER (Optional)
# ============================================================================

function Start-Watchdog {
    param(
        [int]$TimeoutSeconds = 3600  # 1 hour default
    )

    if ($SkipWatchdog) {
        return
    }

    Write-Host "[Watchdog] Started (timeout: ${TimeoutSeconds}s)"

    # Create a timer job that monitors the main process
    $timerScript = {
        param([int]$Timeout)
        Start-Sleep -Seconds $Timeout
        Write-Host "[Watchdog] TIMEOUT - Force stopping Jarvis"
        exit 1
    }

    Start-Job -ScriptBlock $timerScript -ArgumentList $TimeoutSeconds | Out-Null
}

# ============================================================================
# ENVIRONMENT VALIDATION
# ============================================================================

function Validate-Environment {
    Write-Host "Validating environment..."

    # Check PowerShell version
    if ($PSVersionTable.PSVersion.Major -lt 5) {
        Write-Error "PowerShell 5.0 or later required"
        exit 1
    }
    Write-Host "  ✓ PowerShell $($PSVersionTable.PSVersion.Major).$($PSVersionTable.PSVersion.Minor)"

    # Check config
    $config = Load-JarvisConfig
    if (-not $config) {
        Write-Error "Configuration invalid"
        exit 1
    }
    Write-Host "  ✓ Configuration loaded"

    # Check installation
    $installDir = $config.install_dir
    $requiredModules = @(
        "core\jarvis-core.ps1",
        "voice\jarvis-voice.ps1",
        "computer-use\jarvis-computer-use.ps1",
        "connectors\jarvis-connectors.ps1",
        "memory\jarvis-memory.ps1"
    )

    foreach ($module in $requiredModules) {
        $modulePath = Join-Path $installDir $module
        if (Test-Path $modulePath) {
            Write-Host "  ✓ $module"
        } else {
            Write-Error "Missing module: $module"
        }
    }

    Write-Host ""
}

# ============================================================================
# MAIN ENTRY POINT
# ============================================================================

# Validate environment
Validate-Environment

# Start watchdog if needed
if (-not $SkipWatchdog) {
    Start-Watchdog -TimeoutSeconds 3600
}

# Start main loop
if ($Command) {
    # Single command mode
    Start-JarvisLoop -InitialCommand $Command -Mode $Mode
} elseif ($Interactive) {
    # Interactive mode
    Start-JarvisLoop -Mode $Mode
} else {
    # Show usage
    Write-Host "Usage:"
    Write-Host "  .\START_JARVIS.ps1 -Command 'help'"
    Write-Host "  .\START_JARVIS.ps1 -Command 'screenshot' -Mode safe"
    Write-Host "  .\START_JARVIS.ps1 -Interactive"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Command <string>    Single command to execute"
    Write-Host "  -Interactive         Start interactive mode (loop)"
    Write-Host "  -Mode <string>       safe (default), interactive, risk-approved"
    Write-Host "  -DryRun             Simulate without executing"
    Write-Host "  -SkipWatchdog       Disable watchdog timer"
}
