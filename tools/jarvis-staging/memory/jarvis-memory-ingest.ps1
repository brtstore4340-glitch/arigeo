# jarvis-memory-ingest.ps1 - Auto-ingest from proof logs
# Converts execution data into actionable learning patterns

param(
    [string]$SourceType = "proof-logs",  # proof-logs, git, manual
    [int]$DaysBack = 7,
    [bool]$Verbose = $false
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$IngestConfig = @{
    ProofLogsDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\logs"
    MemoryDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\memory"
    CoreScript = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis-staging\memory\jarvis-memory-core.ps1"
}

# ============================================================================
# INGEST FUNCTIONS
# ============================================================================

function Read-ProofLogs {
    param([int]$DaysBack)

    $cutoffDate = (Get-Date).AddDays(-$DaysBack)
    $files = Get-ChildItem -Path $IngestConfig.ProofLogsDir -Filter "proof-log*.jsonl" -ErrorAction SilentlyContinue |
        Where-Object { $_.LastWriteTime -gt $cutoffDate }

    $entries = @()
    foreach ($file in $files) {
        $entries += Get-Content $file.FullName | ConvertFrom-Json -AsHashtable
    }

    return $entries
}

function Extract-IntentPatterns {
    param([array]$ProofEntries)

    $patterns = @{}

    foreach ($entry in $ProofEntries) {
        $action = $entry.intent
        $success = $entry.success

        if (-not $patterns[$action]) {
            $patterns[$action] = @{
                action = $action
                success_count = 0
                fail_count = 0
                avg_risk = 0
                examples = @()
            }
        }

        if ($success) {
            $patterns[$action].success_count++
        } else {
            $patterns[$action].fail_count++
        }

        $patterns[$action].examples += @{
            timestamp = $entry.timestamp
            risk_score = $entry.risk_score
            approved = $entry.approved
            success = $success
        }
    }

    return $patterns.Values
}

function Extract-RiskPatterns {
    param([array]$ProofEntries)

    $patterns = @{}

    foreach ($entry in $ProofEntries) {
        $riskLevel = if ($entry.risk_score -lt 25) { "low" }
                     elseif ($entry.risk_score -lt 60) { "medium" }
                     else { "high" }

        $key = "$($entry.intent)_$riskLevel"

        if (-not $patterns[$key]) {
            $patterns[$key] = @{
                action = $entry.intent
                risk_level = $riskLevel
                risk_score = $entry.risk_score
                approved_count = 0
                blocked_count = 0
                success_rate = 0
            }
        }

        if ($entry.approved) {
            $patterns[$key].approved_count++
        } else {
            $patterns[$key].blocked_count++
        }
    }

    return $patterns.Values
}

function Extract-UserPreferences {
    param([array]$ProofEntries)

    $prefs = @{
        preferred_mode = @{}
        preferred_provider = @{}
        command_frequency = @{}
        success_rate = @{ total = 0; succeeded = 0 }
    }

    foreach ($entry in $ProofEntries) {
        $prefs.success_rate.total++
        if ($entry.success) { $prefs.success_rate.succeeded++ }
    }

    if ($prefs.success_rate.total -gt 0) {
        $prefs.success_rate.percentage = [math]::Round(($prefs.success_rate.succeeded / $prefs.success_rate.total) * 100, 2)
    }

    return $prefs
}

function Save-Learnings {
    param(
        [array]$IntentPatterns,
        [array]$RiskPatterns,
        [object]$Preferences
    )

    $coreScript = $IngestConfig.CoreScript

    # Save intent patterns
    foreach ($pattern in $IntentPatterns) {
        $entry = @{
            timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
            type = "intent-pattern"
            action = $pattern.action
            success_count = $pattern.success_count
            fail_count = $pattern.fail_count
            success_rate = if ($pattern.success_count + $pattern.fail_count -gt 0) {
                            [math]::Round($pattern.success_count / ($pattern.success_count + $pattern.fail_count) * 100, 2)
                          } else { 0 }
            examples = $pattern.examples | Select-Object -First 5
        }

        & $coreScript -Operation write -MemoryType learnings -Data $entry -Filename "intent_patterns_$(Get-Date -Format 'yyyyMMdd').jsonl" | Out-Null
    }

    # Save risk patterns
    foreach ($pattern in $RiskPatterns) {
        $entry = @{
            timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
            type = "risk-pattern"
            action = $pattern.action
            risk_level = $pattern.risk_level
            approved_rate = if ($pattern.approved_count + $pattern.blocked_count -gt 0) {
                            [math]::Round($pattern.approved_count / ($pattern.approved_count + $pattern.blocked_count) * 100, 2)
                          } else { 0 }
        }

        & $coreScript -Operation write -MemoryType learnings -Data $entry -Filename "risk_patterns_$(Get-Date -Format 'yyyyMMdd').jsonl" | Out-Null
    }

    # Save preferences
    $prefEntry = @{
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
        type = "user-preferences"
        success_rate = $Preferences.success_rate
    }

    & $coreScript -Operation write -MemoryType learnings -Data $prefEntry -Filename "user_preferences_$(Get-Date -Format 'yyyyMMdd').jsonl" | Out-Null

    return @{
        intent_patterns_saved = $IntentPatterns.Count
        risk_patterns_saved = $RiskPatterns.Count
        preferences_saved = 1
    }
}

# ============================================================================
# MAIN INGEST PIPELINE
# ============================================================================

function Invoke-MemoryIngest {
    if ($Verbose) { Write-Host "🔄 Starting memory ingest..." -ForegroundColor Cyan }

    # Read proof logs
    $proofEntries = Read-ProofLogs -DaysBack $DaysBack
    if ($Verbose) { Write-Host "   Loaded $($proofEntries.Count) proof log entries" }

    # Extract patterns
    $intentPatterns = Extract-IntentPatterns -ProofEntries $proofEntries
    $riskPatterns = Extract-RiskPatterns -ProofEntries $proofEntries
    $preferences = Extract-UserPreferences -ProofEntries $proofEntries

    if ($Verbose) {
        Write-Host "   Found $($intentPatterns.Count) intent patterns"
        Write-Host "   Found $($riskPatterns.Count) risk patterns"
    }

    # Save learnings
    $result = Save-Learnings -IntentPatterns $intentPatterns -RiskPatterns $riskPatterns -Preferences $preferences

    if ($Verbose) {
        Write-Host "✓ Ingest complete" -ForegroundColor Green
        Write-Host "   Patterns saved: $($result.intent_patterns_saved + $result.risk_patterns_saved)"
    }

    return @{
        success = $true
        proof_entries = $proofEntries.Count
        intent_patterns = $intentPatterns.Count
        risk_patterns = $riskPatterns.Count
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
    }
}

# Main execution
if ($MyInvocation.InvocationName -ne ".") {
    Invoke-MemoryIngest | ConvertTo-Json
}
