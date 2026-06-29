# schedule-weekly-sync.ps1 - Automate weekly memory sync
# Creates Windows Task Scheduler job to run sync-memory.ps1 every week

param(
    [string]$DayOfWeek = "Sunday",
    [string]$StartTime = "02:00:00",
    [switch]$RunNow = $false,
    [bool]$Verbose = $true
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$ScheduleConfig = @{
    TaskName = "JARVIS-Memory-Weekly-Sync"
    TaskPath = "\JARVIS\Memory\"
    Description = "Auto-sync JARVIS memory: ingest logs, discover patterns, synthesize insights"

    SyncScript = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis-staging\memory\sync-memory.ps1"
    LogDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\logs"

    DayOfWeek = $DayOfWeek
    StartTime = $StartTime
}

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

function Test-AdminPrivileges {
    $isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    return $isAdmin
}

function Create-SyncTask {
    if ($Verbose) { Write-Host "📅 Creating scheduled task..." }

    # Task action: run PowerShell with sync script
    $action = New-ScheduledTaskAction `
        -Execute "powershell.exe" `
        -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$($ScheduleConfig.SyncScript)`" -Mode full -Verbose" `
        -WorkingDirectory (Split-Path $ScheduleConfig.SyncScript)

    if ($Verbose) { Write-Host "   ✓ Task action configured" }

    # Task trigger: weekly at specified day/time
    $trigger = New-ScheduledTaskTrigger `
        -Weekly `
        -DaysOfWeek $ScheduleConfig.DayOfWeek `
        -At $ScheduleConfig.StartTime

    if ($Verbose) { Write-Host "   ✓ Trigger configured: $($ScheduleConfig.DayOfWeek) at $($ScheduleConfig.StartTime)" }

    # Task settings
    $settings = New-ScheduledTaskSettingsSet `
        -AllowStartIfOnBatteries `
        -DontStopIfGoingOnBatteries `
        -StartWhenAvailable `
        -RunOnlyIfNetworkAvailable `
        -MultipleInstances IgnoreNew

    if ($Verbose) { Write-Host "   ✓ Task settings configured" }

    # Principal: run as SYSTEM (has permission to access memory dirs)
    $principal = New-ScheduledTaskPrincipal `
        -UserID "SYSTEM" `
        -LogonType ServiceAccount `
        -RunLevel Highest

    if ($Verbose) { Write-Host "   ✓ Principal configured (SYSTEM account)" }

    # Create the task
    Register-ScheduledTask `
        -TaskName $ScheduleConfig.TaskName `
        -TaskPath $ScheduleConfig.TaskPath `
        -Action $action `
        -Trigger $trigger `
        -Settings $settings `
        -Principal $principal `
        -Description $ScheduleConfig.Description `
        -Force | Out-Null

    if ($Verbose) { Write-Host "   ✓ Task registered successfully" }
}

function Verify-Task {
    $task = Get-ScheduledTask -TaskName $ScheduleConfig.TaskName -TaskPath $ScheduleConfig.TaskPath -ErrorAction SilentlyContinue

    if ($task) {
        if ($Verbose) {
            Write-Host ""
            Write-Host "📋 Task Details:" -ForegroundColor Cyan
            Write-Host "   Name: $($task.TaskName)"
            Write-Host "   Path: $($task.TaskPath)"
            Write-Host "   Status: $($task.State)"
            Write-Host "   Next Run: $($task.Triggers[0].StartBoundary)"
        }
        return $true
    }
    return $false
}

function Enable-Task {
    if ($Verbose) { Write-Host "🔄 Enabling task..." }
    Enable-ScheduledTask -TaskName $ScheduleConfig.TaskName -TaskPath $ScheduleConfig.TaskPath | Out-Null
    if ($Verbose) { Write-Host "   ✓ Task enabled" }
}

function Run-TaskNow {
    if ($Verbose) { Write-Host "▶️  Running sync now..." }
    Start-ScheduledTask -TaskName $ScheduleConfig.TaskName -TaskPath $ScheduleConfig.TaskPath | Out-Null
    if ($Verbose) { Write-Host "   ✓ Sync started (check logs in 1-2 minutes)" }
}

function Write-ScheduleLog {
    $logFile = Join-Path $ScheduleConfig.LogDir "JARVIS_SYNC_SCHEDULE_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"

    $logContent = @"
================================================================================
JARVIS MEMORY SYNC AUTOMATION LOG
================================================================================

Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

TASK SCHEDULED:
  Name: $($ScheduleConfig.TaskName)
  Path: $($ScheduleConfig.TaskPath)
  Frequency: Weekly on $($ScheduleConfig.DayOfWeek)
  Time: $($ScheduleConfig.StartTime)
  Script: $($ScheduleConfig.SyncScript)

BEHAVIOR:
  ✓ Runs automatically every $($ScheduleConfig.DayOfWeek) at $($ScheduleConfig.StartTime)
  ✓ Ingests proof logs from past 7 days
  ✓ Discovers intent patterns
  ✓ Discovers risk patterns
  ✓ Generates insights
  ✓ Archives old data
  ✓ Logs results to: $($ScheduleConfig.LogDir)

WHAT THIS MEANS FOR JARVIS:
  - Proof logs accumulate daily from .\START_JARVIS_AI.ps1 executions
  - Every $($ScheduleConfig.DayOfWeek) at $($ScheduleConfig.StartTime), sync runs automatically
  - Learnings are discovered and saved to memory/learnings/
  - JARVIS gets smarter without manual intervention

NEXT SYNC:
  First run: Next $($ScheduleConfig.DayOfWeek) at $($ScheduleConfig.StartTime)
  Check logs: $($ScheduleConfig.LogDir)\MEMORY_SYNC_*.log

MANUAL OVERRIDE:
  To run sync immediately:
  Start-ScheduledTask -TaskName "$($ScheduleConfig.TaskName)" -TaskPath "$($ScheduleConfig.TaskPath)"

  To disable:
  Disable-ScheduledTask -TaskName "$($ScheduleConfig.TaskName)" -TaskPath "$($ScheduleConfig.TaskPath)"

STATUS: ✓ Automated
================================================================================
"@

    Set-Content -Path $logFile -Value $logContent -Force
    if ($Verbose) { Write-Host "   ✓ Schedule log: $logFile" }
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  JARVIS WEEKLY SYNC AUTOMATION SETUP       ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check admin privileges
if (-not (Test-AdminPrivileges)) {
    Write-Host "❌ ERROR: This script requires Administrator privileges" -ForegroundColor Red
    Write-Host ""
    Write-Host "Solution: Run PowerShell as Administrator and try again:" -ForegroundColor Yellow
    Write-Host "  1. Right-click PowerShell → Run as administrator"
    Write-Host "  2. Re-run: .\schedule-weekly-sync.ps1"
    Write-Host ""
    exit 1
}

if ($Verbose) { Write-Host "✓ Running with Administrator privileges" }

# Create task
try {
    Create-SyncTask

    # Verify creation
    if (Verify-Task) {
        Write-Host "✓ Task created and verified" -ForegroundColor Green

        # Enable task
        Enable-Task

        # Write log
        Write-ScheduleLog

        # Optionally run now
        if ($RunNow) {
            Write-Host ""
            Run-TaskNow
        }

        # Summary
        Write-Host ""
        Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Green
        Write-Host "║   ✓ AUTOMATION SETUP COMPLETE              ║" -ForegroundColor Green
        Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Green
        Write-Host ""
        Write-Host "Weekly sync will run automatically:" -ForegroundColor Cyan
        Write-Host "  Every $($ScheduleConfig.DayOfWeek) at $($ScheduleConfig.StartTime)" -ForegroundColor Gray
        Write-Host ""
        Write-Host "What happens each week:" -ForegroundColor Cyan
        Write-Host "  1️⃣  Ingests 7 days of proof logs"
        Write-Host "  2️⃣  Discovers intent success patterns"
        Write-Host "  3️⃣  Identifies risk trends"
        Write-Host "  4️⃣  Generates insights & recommendations"
        Write-Host "  5️⃣  Archives old data (preserves history)"
        Write-Host ""
        Write-Host "JARVIS learns automatically. No manual work needed!" -ForegroundColor Green
        Write-Host ""

    } else {
        Write-Host "❌ Task creation failed" -ForegroundColor Red
        exit 1
    }

} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  1. Ensure PowerShell is running as Administrator"
    Write-Host "  2. Check that path is correct: $($ScheduleConfig.SyncScript)"
    Write-Host "  3. Verify Task Scheduler service is running"
    exit 1
}
