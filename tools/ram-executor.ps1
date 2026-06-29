# ram-executor.ps1 - Layer 3: Safe Command Execution with Debug
# Execute commands through allowlist with risk gates & self-debug integration

param(
    [string]$Intent = "unknown",
    [string]$Command = "",
    [hashtable]$Parameters = @{},
    [int]$RiskLevel = 0,
    [switch]$DryRun = $false,
    [switch]$Verbose = $true
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$ExecutorConfig = @{
    Version = "1.0"
    Philosophy = "Safe first, execute smart, always prove it"
    SafeMode = $true
    RequireApproval = @{ high = $true; medium = $false; low = $false }
    DebugEnabled = $true
    ProofDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\logs"
}

# Allowlist: what RAM is allowed to do
$AllowedActions = @{
    # System commands
    "system.status" = @{ executor = "Get-RamStatus"; risk = 0; needs_approval = $false }
    "system.help" = @{ executor = "Show-RamHelp"; risk = 0; needs_approval = $false }
    "system.screenshot" = @{ executor = "Take-Screenshot"; risk = 1; needs_approval = $false }
    "system.backup" = @{ executor = "Run-Backup"; risk = 2; needs_approval = $true }

    # File operations
    "file.read" = @{ executor = "Read-FileContent"; risk = 1; needs_approval = $false }
    "file.write" = @{ executor = "Write-FileContent"; risk = 2; needs_approval = $true }
    "file.convert_pdf" = @{ executor = "Convert-PDF"; risk = 1; needs_approval = $false }

    # Git operations
    "git.status" = @{ executor = "Get-GitStatus"; risk = 0; needs_approval = $false }
    "git.log" = @{ executor = "Get-GitLog"; risk = 0; needs_approval = $false }
    "git.diagnose" = @{ executor = "Diagnose-GitIssue"; risk = 1; needs_approval = $false }

    # App operations
    "app.open" = @{ executor = "Open-App"; risk = 1; needs_approval = $false }

    # Memory operations
    "memory.query" = @{ executor = "Query-Memory"; risk = 0; needs_approval = $false }
    "memory.record" = @{ executor = "Record-Memory"; risk = 1; needs_approval = $false }

    # Dangerous (requires high approval)
    "system.delete" = @{ executor = "BLOCKED"; risk = 10; needs_approval = "always" }
    "system.format" = @{ executor = "BLOCKED"; risk = 10; needs_approval = "always" }
}

# ============================================================================
# EXECUTION ENGINE
# ============================================================================

function Write-ExecLog {
    param([string]$Message, [string]$Level = "INFO")
    $color = switch ($Level) {
        "INFO" { "Cyan" }
        "EXEC" { "Green" }
        "RISK" { "Yellow" }
        "BLOCK" { "Red" }
        default { "Gray" }
    }
    if ($Verbose) {
        Write-Host "[$Level] $Message" -ForegroundColor $color
    }
}

function Test-IntentAllowed {
    param([string]$Intent)

    Write-ExecLog "🔍 Checking allowlist: $Intent" "INFO"

    if ($AllowedActions.ContainsKey($Intent)) {
        $action = $AllowedActions[$Intent]

        if ($action.executor -eq "BLOCKED") {
            Write-ExecLog "❌ BLOCKED: $Intent (too dangerous)" "BLOCK"
            return @{ allowed = $false; reason = "action blocked"; action = $action }
        }

        Write-ExecLog "✓ Allowed: $Intent" "EXEC"
        return @{ allowed = $true; action = $action }
    }

    Write-ExecLog "⚠️  Unknown intent: $Intent" "RISK"
    return @{ allowed = $false; reason = "unknown intent"; action = $null }
}

function Check-RiskGate {
    param([int]$Risk, [bool]$NeedsApproval)

    Write-ExecLog "⚠️  Risk level: $Risk/10" "RISK"

    $decision = @{
        risk_level = $Risk
        needs_approval = $NeedsApproval
        auto_approved = $false
        reason = ""
    }

    if ($Risk -ge 7) {
        $decision.needs_approval = $true
        $decision.reason = "High-risk operation"
    }

    if ($DryRun) {
        Write-ExecLog "🏃 DRY-RUN mode: would execute but not actually running" "INFO"
        $decision.auto_approved = $true
        $decision.reason = "Dry-run mode"
    }

    return $decision
}

function Invoke-SafeExecution {
    param([string]$Intent, [hashtable]$AllowedAction)

    Write-ExecLog "🚀 Executing: $Intent" "EXEC"

    try {
        # Simulated execution
        $result = @{
            intent = $Intent
            status = "success"
            timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
            executor = $AllowedAction.executor
            output = "Execution completed successfully"
            dry_run = $DryRun
        }

        Write-ExecLog "✓ Executed successfully" "EXEC"
        return $result

    } catch {
        Write-ExecLog "❌ Execution failed: $_" "BLOCK"

        return @{
            intent = $Intent
            status = "error"
            error = $_.Exception.Message
            timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
            executor = $AllowedAction.executor
        }
    }
}

# ============================================================================
# MAIN EXECUTOR
# ============================================================================

function Invoke-RamExecutor {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Magenta
    Write-Host "║  RAM EXECUTOR - Layer 3                    ║" -ForegroundColor Magenta
    Write-Host "║  Safe execution with risk gates           ║" -ForegroundColor Magenta
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Magenta
    Write-Host ""

    Write-ExecLog "Intent: $Intent | Risk: $RiskLevel/10" "INFO"

    # Step 1: Check allowlist
    Write-Host ""
    $allowCheck = Test-IntentAllowed -Intent $Intent

    if (-not $allowCheck.allowed) {
        Write-Host "❌ EXECUTION BLOCKED" -ForegroundColor Red
        Write-Host "   Reason: $($allowCheck.reason)" -ForegroundColor Yellow
        Write-Host ""

        return @{
            intent = $Intent
            status = "blocked"
            reason = $allowCheck.reason
            timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
        }
    }

    # Step 2: Risk gate
    Write-Host ""
    $riskCheck = Check-RiskGate -Risk $RiskLevel -NeedsApproval $allowCheck.action.needs_approval

    if ($riskCheck.needs_approval -and -not $riskCheck.auto_approved) {
        Write-Host "⚠️  REQUIRES APPROVAL" -ForegroundColor Yellow
        Write-Host "   Risk: $($riskCheck.reason)" -ForegroundColor Gray
        Write-Host ""
        return @{
            intent = $Intent
            status = "waiting_approval"
            reason = $riskCheck.reason
            timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
        }
    }

    # Step 3: Execute
    Write-Host ""
    $execResult = Invoke-SafeExecution -Intent $Intent -AllowedAction $allowCheck.action

    # Step 4: Return proof
    Write-Host ""
    Write-Host "✓ EXECUTION RESULT" -ForegroundColor Green
    Write-Host "   Status: $($execResult.status)"
    Write-Host "   Timestamp: $($execResult.timestamp)"
    Write-Host ""

    return $execResult
}

# ============================================================================
# MAIN ENTRY
# ============================================================================

if ($MyInvocation.InvocationName -ne ".") {
    $output = Invoke-RamExecutor

    # Return as JSON
    $output | ConvertTo-Json -Depth 10 | Write-Output
}
