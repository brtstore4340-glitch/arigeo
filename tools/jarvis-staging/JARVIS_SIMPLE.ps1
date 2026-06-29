# JARVIS_SIMPLE.ps1 - Simplified Interactive Mode
# Direct command processing without complex parameter passing

param(
    [string]$IntentProvider = "local",
    [string]$LocalEndpoint = "http://localhost:20128/v1"
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$JarvisConfig = @{
    Name = "JARVIS-Local"
    Version = "0.3-simple"
    WorkingDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools"
    LogsDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\logs"
    CoreScript = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis\core\jarvis-core-ai-integrated.ps1"
    Provider = $IntentProvider
    Endpoint = $LocalEndpoint
}

# ============================================================================
# INTENT MAPPING
# ============================================================================

$KnownCommands = @{
    "help" = @{ action = "help"; target = "" }
    "status" = @{ action = "status"; target = "" }
    "screenshot" = @{ action = "screenshot"; target = "" }
    "screen" = @{ action = "screenshot"; target = "" }
    "open" = @{ action = "open"; target = "user-specified" }
    "search" = @{ action = "search"; target = "query" }
    "exit" = @{ action = "exit"; target = "" }
    "quit" = @{ action = "exit"; target = "" }
}

# ============================================================================
# SIMPLE INTENT PARSER
# ============================================================================

function Parse-SimpleIntent {
    param([string]$CommandText)

    $cmd = $CommandText.Trim().ToLower()

    # Strip "jarvis>" prefix if user accidentally types it
    if ($cmd.StartsWith("jarvis>")) {
        $cmd = $cmd.Substring(7).Trim()
    }

    $parts = $cmd -split ' ', 2

    # Check known commands
    foreach ($cmd in $KnownCommands.Keys) {
        if ($parts[0] -eq $cmd) {
            return @{
                raw = $Input
                action = $KnownCommands[$cmd].action
                target = if ($parts.Count -gt 1) { $parts[1] } else { $KnownCommands[$cmd].target }
                confidence = 0.9
                parser = "simple"
            }
        }
    }

    # Unknown command
    return @{
        raw = $Input
        action = "unknown"
        target = ""
        confidence = 0.0
        parser = "simple"
    }
}

# ============================================================================
# SAFE EXECUTOR
# ============================================================================

function Execute-SafeIntent {
    param([object]$Intent)

    switch ($Intent.action) {
        "help" {
            Write-Host ""
            Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
            Write-Host "║          JARVIS LOCAL - COMMANDS           ║" -ForegroundColor Cyan
            Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "Available Commands:" -ForegroundColor Green
            Write-Host "  help              Show this help message"
            Write-Host "  status            Show JARVIS status"
            Write-Host "  screenshot        Take a screenshot"
            Write-Host "  open <app>        Open an application"
            Write-Host "  search <query>    Search the web"
            Write-Host "  exit / quit       Exit JARVIS"
            Write-Host ""
            return @{ success = $true; output = "Help displayed" }
        }

        "status" {
            Write-Host ""
            Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
            Write-Host "║           JARVIS LOCAL STATUS             ║" -ForegroundColor Cyan
            Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "Name:       JARVIS Local"
            Write-Host "Version:    0.3-simple"
            Write-Host "Provider:   $($JarvisConfig.Provider)"
            Write-Host "Mode:       Safe (interactive)"
            Write-Host "Status:     ✓ Ready"
            Write-Host ""
            return @{ success = $true; output = "Status displayed" }
        }

        "screenshot" {
            Write-Host ""
            Write-Host "[DRY-RUN] Would execute: Take Screenshot" -ForegroundColor Yellow
            Write-Host "This would capture the current screen."
            Write-Host ""
            return @{ success = $true; output = "Screenshot command received" }
        }

        "open" {
            Write-Host ""
            Write-Host "[DRY-RUN] Would open: $($Intent.target)" -ForegroundColor Yellow
            Write-Host ""
            return @{ success = $true; output = "Open command received for: $($Intent.target)" }
        }

        "search" {
            Write-Host ""
            Write-Host "[DRY-RUN] Would search for: $($Intent.target)" -ForegroundColor Yellow
            Write-Host ""
            return @{ success = $true; output = "Search command received for: $($Intent.target)" }
        }

        "exit" {
            return @{ success = $true; output = "exit" }
        }

        default {
            Write-Host ""
            Write-Host "❌ Unknown command: $($Intent.raw)" -ForegroundColor Red
            Write-Host "Type 'help' for available commands"
            Write-Host ""
            return @{ success = $false; output = "Unknown command" }
        }
    }
}

# ============================================================================
# MAIN INTERACTIVE LOOP
# ============================================================================

function Start-InteractiveLoop {
    Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║     JARVIS LOCAL v0.3-simple             ║" -ForegroundColor Cyan
    Write-Host "║     Simple Interactive Mode              ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Provider:   $($JarvisConfig.Provider)" -ForegroundColor Gray
    Write-Host "Type 'help' for commands, 'exit' to quit" -ForegroundColor Gray
    Write-Host ""

    $session = @{
        commands = 0
        startTime = Get-Date
    }

    while ($true) {
        # Read command from user
        $userInput = Read-Host "jarvis"

        # Empty input
        if ([string]::IsNullOrWhiteSpace($userInput)) {
            continue
        }

        # Parse intent (simple, no parameter passing issues)
        $intent = Parse-SimpleIntent -CommandText $userInput
        $session.commands++

        Write-Host ""
        Write-Host "Input:      $($intent.raw)" -ForegroundColor Gray
        Write-Host "Action:     $($intent.action)" -ForegroundColor Gray
        Write-Host "Confidence: $($intent.confidence)" -ForegroundColor Gray
        Write-Host ""

        # Execute intent
        $result = Execute-SafeIntent -Intent $intent

        # Check for exit
        if ($result.output -eq "exit") {
            Write-Host "✓ Goodbye!" -ForegroundColor Green
            Write-Host ""
            break
        }

        Write-Host ""
    }

    # Session summary
    $duration = (Get-Date) - $session.startTime
    Write-Host "Session Summary:" -ForegroundColor Cyan
    Write-Host "  Commands: $($session.commands)"
    Write-Host "  Duration: $([math]::Round($duration.TotalSeconds, 2))s"
    Write-Host ""
}

# ============================================================================
# MAIN ENTRY
# ============================================================================

$ErrorActionPreference = "Continue"

try {
    Start-InteractiveLoop
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
