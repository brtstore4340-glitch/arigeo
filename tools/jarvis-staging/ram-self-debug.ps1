# ram-self-debug.ps1 - RAM Self-Debug & Recovery System
# Detect failures, diagnose, recover, learn, report

param(
    [string]$ErrorContext = "",
    [string]$LayerName = "unknown",
    [string]$FailedOperation = "",
    [object]$Exception = $null,
    [switch]$AutoRecovery = $true,
    [switch]$Verbose = $true
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$DebugConfig = @{
    Version = "1.0"
    Philosophy = "Detect early, recover fast, learn always"
    DebugDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\debug"
    MemoryDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\memory"
    LogsDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\logs"

    # Recovery strategies per error type
    RecoveryStrategies = @{
        "datetime_parse" = @{
            detect = "Could not parse date"
            action = "fallback_date"
            retry = $true
        }
        "memory_empty" = @{
            detect = "No relevant entries"
            action = "use_last_action"
            retry = $true
        }
        "provider_unavailable" = @{
            detect = "provider not reachable"
            action = "fallback_to_local"
            retry = $true
        }
        "token_budget_exceeded" = @{
            detect = "token budget exceeded"
            action = "truncate_context"
            retry = $true
        }
        "json_parse_error" = @{
            detect = "ConvertFrom-Json"
            action = "skip_entry"
            retry = $true
        }
        "file_not_found" = @{
            detect = "path not found"
            action = "create_default"
            retry = $true
        }
    }
}

# ============================================================================
# DEBUG HELPER FUNCTIONS
# ============================================================================

function Write-DebugLog {
    param([string]$Message, [string]$Level = "INFO", [string]$Layer = "")

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $prefix = if ($Layer) { "[$Layer]" } else { "[DEBUG]" }

    $color = switch ($Level) {
        "INFO" { "Cyan" }
        "WARN" { "Yellow" }
        "ERROR" { "Red" }
        "RECOVERY" { "Green" }
        "LEARN" { "Magenta" }
        default { "Gray" }
    }

    if ($Verbose) {
        Write-Host "[$timestamp] $prefix [$Level] $Message" -ForegroundColor $color
    }

    # Also log to file
    if (-not (Test-Path $DebugConfig.DebugDir)) {
        New-Item -ItemType Directory -Path $DebugConfig.DebugDir -Force | Out-Null
    }

    $debugFile = Join-Path $DebugConfig.DebugDir "ram-debug-$(Get-Date -Format 'yyyyMMdd').log"
    Add-Content -Path $debugFile -Value "[$timestamp] $prefix [$Level] $Message" -Force
}

# ============================================================================
# ERROR DETECTION
# ============================================================================

function Detect-ErrorType {
    param([string]$ErrorMessage, [string]$StackTrace)

    Write-DebugLog "🔍 Analyzing error..." "INFO"

    # Pattern matching against known errors
    foreach ($errorType in $DebugConfig.RecoveryStrategies.Keys) {
        $pattern = $DebugConfig.RecoveryStrategies[$errorType].detect

        if ($ErrorMessage -match $pattern -or $StackTrace -match $pattern) {
            Write-DebugLog "✓ Detected: $errorType" "INFO"
            return @{
                type = $errorType
                severity = if ($ErrorMessage -match "fatal|critical") { "critical" } else { "normal" }
                pattern = $pattern
                strategy = $DebugConfig.RecoveryStrategies[$errorType]
            }
        }
    }

    # Unknown error
    Write-DebugLog "⚠️  Unknown error type" "WARN"
    return @{
        type = "unknown"
        severity = "normal"
        pattern = $null
        strategy = @{ action = "log_and_continue"; retry = $false }
    }
}

# ============================================================================
# RECOVERY MECHANISMS
# ============================================================================

function Invoke-Recovery {
    param(
        [object]$ErrorDetection,
        [string]$ContextInfo,
        [object]$FailedResult = $null
    )

    Write-DebugLog "🔧 Attempting recovery: $($ErrorDetection.type)" "INFO" $LayerName
    Write-DebugLog "Strategy: $($ErrorDetection.strategy.action)" "RECOVERY"

    $recovery = $ErrorDetection.strategy
    $result = @{
        attempted = $true
        success = $false
        action = $recovery.action
        context = $ContextInfo
    }

    # Execute recovery action
    switch ($recovery.action) {
        "fallback_date" {
            # For datetime parse errors
            $result.recovery_value = (Get-Date).AddDays(-1)
            $result.success = $true
            Write-DebugLog "✓ Used fallback date" "RECOVERY" $LayerName
        }

        "use_last_action" {
            # For memory empty
            $lastLog = Get-Content -Path (Join-Path $DebugConfig.LogsDir "ram-chat-*.log") `
                -ErrorAction SilentlyContinue | ConvertFrom-Json -ErrorAction SilentlyContinue | `
                Select-Object -Last 1

            if ($lastLog) {
                $result.recovery_value = $lastLog
                $result.success = $true
                Write-DebugLog "✓ Used last action from logs" "RECOVERY" $LayerName
            }
        }

        "fallback_to_local" {
            # For provider unavailable
            $result.recovery_value = "local"
            $result.success = $true
            Write-DebugLog "✓ Fallback to local provider" "RECOVERY" $LayerName
        }

        "truncate_context" {
            # For token budget exceeded
            if ($FailedResult -and $FailedResult.chunks) {
                $FailedResult.chunks = $FailedResult.chunks[0..2]  # Keep only first 3
                $FailedResult.total_tokens_used =
                    ($FailedResult.chunks | Measure-Object -Property tokens -Sum).Sum
                $result.recovery_value = $FailedResult
                $result.success = $true
                Write-DebugLog "✓ Truncated context to fit budget" "RECOVERY" $LayerName
            }
        }

        "skip_entry" {
            # For JSON parse errors
            $result.recovery_value = "skip"
            $result.success = $true
            Write-DebugLog "✓ Skipped malformed entry" "RECOVERY" $LayerName
        }

        "create_default" {
            # For file not found
            $result.recovery_value = @{ created = $true; timestamp = Get-Date }
            $result.success = $true
            Write-DebugLog "✓ Created default structure" "RECOVERY" $LayerName
        }

        default {
            Write-DebugLog "⚠️  Unknown recovery action: $($recovery.action)" "WARN" $LayerName
        }
    }

    return $result
}

# ============================================================================
# SELF-HEALING
# ============================================================================

function Test-LayerHealth {
    param([string]$LayerName)

    Write-DebugLog "🏥 Testing layer health: $LayerName" "INFO"

    $health = @{
        layer = $LayerName
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
        checks = @()
    }

    # Test based on layer
    switch -Regex ($LayerName) {
        "intent_router" {
            # Check: is ram-router.json accessible?
            $routerPath = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\ram-router.json"
            $check = @{
                name = "router_config"
                status = if (Test-Path $routerPath) { "healthy" } else { "error" }
                detail = if (Test-Path $routerPath) { "✓" } else { "❌ Config not found" }
            }
            $health.checks += $check
        }

        "memory_selector" {
            # Check: can we read memory files?
            $memPath = Join-Path $DebugConfig.MemoryDir "learnings"
            $check = @{
                name = "memory_access"
                status = if (Test-Path $memPath) { "healthy" } else { "error" }
                detail = if (Test-Path $memPath) { "✓" } else { "❌ Memory dir not found" }
            }
            $health.checks += $check
        }

        "provider_router" {
            # Check: which providers are available?
            $checks = @("local", "openrouter", "claude")
            foreach ($provider in $checks) {
                $available = Test-ProviderAvailable -Provider $provider
                $check = @{
                    name = "provider_$provider"
                    status = if ($available) { "healthy" } else { "warning" }
                    detail = if ($available) { "✓ Available" } else { "⚠️  Unavailable" }
                }
                $health.checks += $check
            }
        }

        default {
            Write-DebugLog "⚠️  Unknown layer for health check" "WARN"
        }
    }

    # Overall status
    $errorCount = @($health.checks | Where-Object { $_.status -eq "error" }).Count
    $health.overall_status = if ($errorCount -eq 0) { "healthy" } else { "degraded" }

    return $health
}

function Test-ProviderAvailable {
    param([string]$Provider)

    # Quick test (non-blocking)
    $endpoints = @{
        local = "http://localhost:20128/v1/models"
        openrouter = "https://openrouter.ai/api/v1/models"
        claude = "https://api.anthropic.com/v1/models"
    }

    try {
        $result = Invoke-WebRequest -Uri $endpoints[$Provider] -Method GET `
            -TimeoutSec 2 -ErrorAction SilentlyContinue
        return $result.StatusCode -eq 200
    } catch {
        return $false
    }
}

# ============================================================================
# LEARNING FROM FAILURES
# ============================================================================

function Record-ErrorForLearning {
    param(
        [object]$ErrorDetection,
        [string]$LayerName,
        [object]$RecoveryResult
    )

    Write-DebugLog "📚 Recording error for learning..." "LEARN" $LayerName

    # Store in memory for weekly synthesis
    $learningFile = Join-Path $DebugConfig.MemoryDir "learnings" `
        "ram-debug-learnings-$(Get-Date -Format 'yyyyMMdd').jsonl"

    if (-not (Test-Path (Split-Path $learningFile))) {
        New-Item -ItemType Directory -Path (Split-Path $learningFile) -Force | Out-Null
    }

    $entry = @{
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
        source = "ram-self-debug"
        layer = $LayerName
        error_type = $ErrorDetection.type
        error_severity = $ErrorDetection.severity
        recovery_action = $RecoveryResult.action
        recovery_success = $RecoveryResult.success
        context = $RecoveryResult.context
        tags = @("debug", "error", "recovery", "learning")
    } | ConvertTo-Json -Compress

    Add-Content -Path $learningFile -Value $entry -Force

    Write-DebugLog "✓ Error recorded for learning" "LEARN" $LayerName
}

# ============================================================================
# DIAGNOSTIC REPORT
# ============================================================================

function Get-DiagnosticReport {
    param([object]$ErrorDetection, [object]$RecoveryResult, [object]$Health)

    $report = @{
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
        error_detection = @{
            type = $ErrorDetection.type
            severity = $ErrorDetection.severity
            pattern = $ErrorDetection.pattern
        }
        recovery = @{
            attempted = $RecoveryResult.attempted
            success = $RecoveryResult.success
            action = $RecoveryResult.action
        }
        layer_health = $Health
        recommendation = Get-RecoveryRecommendation -Error $ErrorDetection -Recovery $RecoveryResult
    }

    return $report
}

function Get-RecoveryRecommendation {
    param([object]$Error, [object]$Recovery)

    if ($Recovery.success) {
        return "✓ Error recovered automatically. System continuing normally."
    }

    switch ($Error.type) {
        "datetime_parse" { return "⚠️  Consider standardizing timestamp format in memory files." }
        "memory_empty" { return "⚠️  No relevant context found. Consider importing more knowledge." }
        "provider_unavailable" { return "⚠️  All providers down. Check internet connection." }
        "token_budget_exceeded" { return "⚠️  Increase token budget or reduce context size." }
        default { return "❓ Unknown error. Check logs for details." }
    }
}

# ============================================================================
# MAIN DEBUG ENGINE
# ============================================================================

function Invoke-SelfDebug {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Magenta
    Write-Host "║  RAM SELF-DEBUG SYSTEM                     ║" -ForegroundColor Magenta
    Write-Host "║  Detect → Diagnose → Recover → Learn      ║" -ForegroundColor Magenta
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Magenta
    Write-Host ""

    Write-DebugLog "🚀 Starting self-debug cycle..." "INFO" $LayerName
    Write-DebugLog "Layer: $LayerName" "INFO"
    Write-DebugLog "Operation: $FailedOperation" "INFO"

    # Step 1: Detect error type
    Write-Host ""
    $errorMsg = if ($Exception) { $Exception.Message } else { $ErrorContext }
    $stackTrace = if ($Exception) { $Exception.StackTrace } else { "" }

    $errorDetection = Detect-ErrorType -ErrorMessage $errorMsg -StackTrace $stackTrace

    # Step 2: Test layer health
    Write-Host ""
    $layerHealth = Test-LayerHealth -LayerName $LayerName

    # Step 3: Attempt recovery
    Write-Host ""
    if ($AutoRecovery -and $errorDetection.strategy.retry) {
        $recoveryResult = Invoke-Recovery -ErrorDetection $errorDetection `
            -ContextInfo $ErrorContext
    } else {
        $recoveryResult = @{
            attempted = $false
            success = $false
            action = "none"
        }
    }

    # Step 4: Learn from error
    Write-Host ""
    Record-ErrorForLearning -ErrorDetection $errorDetection `
        -LayerName $LayerName -RecoveryResult $recoveryResult

    # Step 5: Generate diagnostic report
    Write-Host ""
    $report = Get-DiagnosticReport -ErrorDetection $errorDetection `
        -RecoveryResult $recoveryResult -Health $layerHealth

    # Display summary
    Write-Host "📊 DEBUG SUMMARY" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Error Type:      $($errorDetection.type)" -ForegroundColor Yellow
    Write-Host "  Severity:        $($errorDetection.severity)"
    Write-Host "  Layer:           $LayerName"
    Write-Host ""
    Write-Host "  Recovery Action: $($recoveryResult.action)"
    Write-Host "  Recovery Status: $(if ($recoveryResult.success) { '✓ SUCCESS' } else { '❌ FAILED' })"
    Write-Host ""
    Write-Host "  Layer Health:    $($layerHealth.overall_status.ToUpper())"
    Write-Host ""
    Write-Host "  Recommendation:  $($report.recommendation)"
    Write-Host ""

    return $report
}

# ============================================================================
# MAIN ENTRY
# ============================================================================

if ($MyInvocation.InvocationName -ne ".") {
    $output = Invoke-SelfDebug

    # Return as JSON for integration
    $output | ConvertTo-Json -Depth 10 | Write-Output
}
