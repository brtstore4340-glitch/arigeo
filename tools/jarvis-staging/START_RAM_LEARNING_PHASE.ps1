# START_RAM_LEARNING_PHASE.ps1
# Initialize 7-Day Learning Phase for RAM Oracle
# Day 1: June 30, 2026 → Day 7: July 6, 2026

param(
    [switch]$SkipChecks = $false,
    [switch]$Verbose = $true
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$LearningPhase = @{
    Version = "1.0"
    StartDate = Get-Date -Format "yyyy-MM-dd"
    EndDate = (Get-Date).AddDays(7) -Format "yyyy-MM-dd"
    Duration = "7 days"
    Objectives = @(
        "Daily interaction logging",
        "Pattern discovery from proof logs",
        "Memory ingestion from interactions",
        "Specialist agent learning",
        "Risk gate optimization",
        "Response time improvement"
    )
    BasePath = "D:\01 Main Work\Boots\Agentic AI\mission-control"
}

function Write-Phase {
    param([string]$Message, [string]$Level = "INFO")
    $color = switch ($Level) {
        "START" { "Green" }
        "DAY" { "Cyan" }
        "GOAL" { "Yellow" }
        "READY" { "Magenta" }
        default { "Gray" }
    }
    Write-Host "[$Level] $Message" -ForegroundColor $color
}

# ============================================================================
# PRE-FLIGHT CHECKS
# ============================================================================

function Test-LearningPhaseSetup {
    Write-Host ""
    Write-Phase "╔════════════════════════════════════════════╗" "READY"
    Write-Phase "║  RAM 7-DAY LEARNING PHASE INITIALIZATION   ║" "READY"
    Write-Phase "╚════════════════════════════════════════════╝" "READY"
    Write-Host ""

    Write-Phase "Checking system setup..." "INFO"

    $checks = @{
        "Core modules" = @(
            "$($LearningPhase.BasePath)\tools\ram-router.json",
            "$($LearningPhase.BasePath)\tools\ram-executor.ps1",
            "$($LearningPhase.BasePath)\tools\ram-proof-logger.ps1"
        )
        "Memory system" = @(
            "$($LearningPhase.BasePath)\tools\memory\learnings",
            "$($LearningPhase.BasePath)\tools\logs"
        )
        "Specialists" = @(
            "$($LearningPhase.BasePath)\tools\ram-specialist-registry.json"
        )
    }

    $allPass = $true
    foreach ($category in $checks.Keys) {
        Write-Host "  $category:" -ForegroundColor Cyan
        foreach ($path in $checks[$category]) {
            if (Test-Path $path) {
                Write-Host "    ✓ $([System.IO.Path]::GetFileName($path))" -ForegroundColor Green
            } else {
                Write-Host "    ✗ Missing: $path" -ForegroundColor Red
                $allPass = $false
            }
        }
    }

    Write-Host ""
    if ($allPass) {
        Write-Phase "✓ All systems ready" "READY"
        return $true
    } else {
        Write-Phase "❌ Missing components. Please run setup first." "ERROR"
        return $false
    }
}

# ============================================================================
# LEARNING PHASE SETUP
# ============================================================================

function Initialize-LearningPhase {
    Write-Host ""
    Write-Phase "🚀 Initializing learning phase..." "START"

    # Create learning phase log
    $logDir = Join-Path $LearningPhase.BasePath "tools\logs"
    if (-not (Test-Path $logDir)) {
        New-Item -ItemType Directory -Path $logDir -Force | Out-Null
    }

    $phaseLog = @{
        start_date = $LearningPhase.StartDate
        end_date = $LearningPhase.EndDate
        duration = $LearningPhase.Duration
        status = "ACTIVE"
        initialized_at = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
        objectives = $LearningPhase.Objectives
        daily_targets = @(
            "Day 1: Baseline - test all commands, log responses"
            "Day 2-3: Specialist learning - use specialists, track accuracy"
            "Day 4-5: Optimization - analyze patterns, improve routing"
            "Day 6-7: Synthesis prep - prepare for Sunday synthesis"
        )
        proof_logs = "tools/logs/ram-proof-*.log"
        memory_logs = "tools/memory/learnings/"
        system_status = "✓ Ready"
    } | ConvertTo-Json -Depth 10

    $phaseFile = Join-Path $logDir "ram-learning-phase-$(Get-Date -Format 'yyyyMMdd').json"
    Set-Content -Path $phaseFile -Value $phaseLog -Force

    Write-Phase "✓ Learning phase initialized" "START"
    Write-Phase "  Start: $($LearningPhase.StartDate)" "INFO"
    Write-Phase "  End: $($LearningPhase.EndDate)" "INFO"
    Write-Phase "  Log: $phaseFile" "INFO"
}

# ============================================================================
# DAILY CHECKLIST CREATION
# ============================================================================

function Create-DailyChecklists {
    Write-Host ""
    Write-Phase "📋 Creating daily learning checklists..." "INFO"

    $checklistDir = Join-Path $LearningPhase.BasePath "tools\logs\learning-phase"
    if (-not (Test-Path $checklistDir)) {
        New-Item -ItemType Directory -Path $checklistDir -Force | Out-Null
    }

    $dailyGoals = @(
        @{
            day = 1
            date = (Get-Date -Format "yyyy-MM-dd")
            theme = "Baseline & Discovery"
            tasks = @(
                "[ ] Test: ram help",
                "[ ] Test: ram status",
                "[ ] Test: ram screenshot",
                "[ ] Test: ram open notepad",
                "[ ] Log all outputs to proof logger",
                "[ ] Verify memory ingestion"
            )
            focus = "Establish baseline, verify all systems work"
        }
        @{
            day = 2
            date = (Get-Date).AddDays(1) -Format "yyyy-MM-dd"
            theme = "Specialist Testing"
            tasks = @(
                "[ ] Use Supabase Specialist (if DB task)",
                "[ ] Use Git Specialist (if git task)",
                "[ ] Use Vercel Specialist (if deployment task)",
                "[ ] Log specialist responses",
                "[ ] Compare specialist vs core performance"
            )
            focus = "Test specialist agents, measure accuracy"
        }
        @{
            day = 3
            date = (Get-Date).AddDays(2) -Format "yyyy-MM-dd"
            theme = "Pattern Discovery"
            tasks = @(
                "[ ] Use at least 3 different specialists",
                "[ ] Document routing decisions",
                "[ ] Note which specialists most helpful",
                "[ ] Monitor memory growth"
            )
            focus = "Identify patterns in specialist usage"
        }
        @{
            day = 4
            date = (Get-Date).AddDays(3) -Format "yyyy-MM-dd"
            theme = "Optimization"
            tasks = @(
                "[ ] Analyze proof logs from Day 1-3",
                "[ ] Identify slow paths",
                "[ ] Test optimizations",
                "[ ] Measure improvement"
            )
            focus = "Optimize based on early learnings"
        }
        @{
            day = 5
            date = (Get-Date).AddDays(4) -Format "yyyy-MM-dd"
            theme = "Consultant Testing"
            tasks = @(
                "[ ] Use Consultant Specialist for research",
                "[ ] Test with architecture question",
                "[ ] Test with optimization question",
                "[ ] Log recommendations"
            )
            focus = "Test research/strategy layer"
        }
        @{
            day = 6
            date = (Get-Date).AddDays(5) -Format "yyyy-MM-dd"
            theme = "Synthesis Preparation"
            tasks = @(
                "[ ] Review all 5 days of logs",
                "[ ] Identify key learnings",
                "[ ] Document patterns discovered",
                "[ ] Prepare for Sunday synthesis"
            )
            focus = "Get ready for weekly synthesis"
        }
        @{
            day = 7
            date = (Get-Date).AddDays(6) -Format "yyyy-MM-dd"
            theme = "Final Integration"
            tasks = @(
                "[ ] Complete remaining tests",
                "[ ] Final optimization runs",
                "[ ] Prepare for Sunday synthesis (2 AM)"
            )
            focus = "Final tests before automatic synthesis"
        }
    )

    foreach ($checklist in $dailyGoals) {
        $checklistJson = $checklist | ConvertTo-Json -Depth 10
        $fileName = Join-Path $checklistDir "day-$($checklist.day)-checklist.json"
        Set-Content -Path $fileName -Value $checklistJson -Force
        Write-Phase "✓ Created: Day $($checklist.day) - $($checklist.theme)" "DAY"
    }

    Write-Phase "All checklists created" "START"
}

# ============================================================================
# MEMORY MONITORING SETUP
# ============================================================================

function Setup-MemoryMonitoring {
    Write-Host ""
    Write-Phase "📚 Setting up memory monitoring..." "INFO"

    $monitorConfig = @{
        daily_ingest = $true
        track_proof_logs = $true
        monitor_memory_growth = $true
        synthesis_schedule = "Sunday 2:00 AM"
        learning_objectives = @(
            "Discover command patterns",
            "Optimize specialist routing",
            "Identify performance bottlenecks",
            "Learn user preferences",
            "Build confidence in recommendations"
        )
    } | ConvertTo-Json -Depth 10

    $monitorFile = Join-Path $LearningPhase.BasePath "tools\logs\memory-monitor-config.json"
    Set-Content -Path $monitorFile -Value $monitorConfig -Force

    Write-Phase "✓ Memory monitoring configured" "INFO"
}

# ============================================================================
# LAUNCH SUMMARY
# ============================================================================

function Show-LaunchSummary {
    Write-Host ""
    Write-Phase "╔════════════════════════════════════════════╗" "READY"
    Write-Phase "║     🚀 RAM LEARNING PHASE ACTIVATED        ║" "READY"
    Write-Phase "╚════════════════════════════════════════════╝" "READY"
    Write-Host ""

    Write-Phase "Schedule:" "INFO"
    Write-Phase "  📅 Start: $($LearningPhase.StartDate)" "INFO"
    Write-Phase "  📅 End: $($LearningPhase.EndDate)" "INFO"
    Write-Phase "  ⏰ Duration: 7 days" "INFO"
    Write-Host ""

    Write-Phase "Daily Goals:" "GOAL"
    Write-Phase "  Day 1: Baseline testing & discovery" "GOAL"
    Write-Phase "  Day 2-3: Specialist agent learning" "GOAL"
    Write-Phase "  Day 4-5: Pattern optimization" "GOAL"
    Write-Phase "  Day 6-7: Synthesis preparation" "GOAL"
    Write-Host ""

    Write-Phase "What RAM will learn:" "INFO"
    foreach ($obj in $LearningPhase.Objectives) {
        Write-Phase "  ✓ $obj" "INFO"
    }
    Write-Host ""

    Write-Phase "Auto-Synthesis:" "INFO"
    Write-Phase "  📊 Sunday 2 AM: Weekly pattern analysis" "INFO"
    Write-Phase "  🧠 Automatic improvement recommendations" "INFO"
    Write-Phase "  💾 Memory growth tracking" "INFO"
    Write-Host ""

    Write-Phase "Start with:" "GOAL"
    Write-Phase "  .\RAM_CHAT.ps1" "GOAL"
    Write-Phase "  or" "GOAL"
    Write-Phase "  .\RAM_SIMPLE.ps1" "GOAL"
    Write-Host ""

    Write-Phase "Learning phase is LIVE! 🎯" "READY"
    Write-Phase "RAM is ready to learn from your interactions." "READY"
    Write-Host ""
}

# ============================================================================
# MAIN ENTRY
# ============================================================================

function Invoke-LearningPhaseStart {
    if (-not $SkipChecks) {
        if (-not (Test-LearningPhaseSetup)) {
            return $false
        }
    }

    Initialize-LearningPhase
    Create-DailyChecklists
    Setup-MemoryMonitoring
    Show-LaunchSummary

    return $true
}

# ============================================================================
# RUN
# ============================================================================

$ErrorActionPreference = "Continue"

try {
    $success = Invoke-LearningPhaseStart
    if ($success) {
        exit 0
    } else {
        exit 1
    }
} catch {
    Write-Phase "ERROR: $_" "ERROR"
    exit 1
}
