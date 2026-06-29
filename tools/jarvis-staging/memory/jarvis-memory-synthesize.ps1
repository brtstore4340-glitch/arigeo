# jarvis-memory-synthesize.ps1 - Weekly pattern synthesis
# Discovers correlations and generates insights

param(
    [string]$Period = "weekly",  # daily, weekly, monthly
    [int]$DaysToAnalyze = 7,
    [bool]$Verbose = $false
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$SynthConfig = @{
    MemoryDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\memory"
    CoreScript = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis-staging\memory\jarvis-memory-core.ps1"
}

# ============================================================================
# SYNTHESIS FUNCTIONS
# ============================================================================

function Analyze-IntentSuccessCorrelations {
    param([array]$Learnings)

    $correlations = @{}

    foreach ($entry in $Learnings) {
        if ($entry.type -eq "intent-pattern") {
            $correlations[$entry.action] = @{
                action = $entry.action
                success_rate = $entry.success_rate
                samples = $entry.examples.Count
                recommendation = if ($entry.success_rate -gt 80) {
                                    "RELIABLE: Safe to use"
                                  } elseif ($entry.success_rate -gt 60) {
                                    "CAUTION: Sometimes fails"
                                  } else {
                                    "HIGH RISK: Needs review"
                                  }
            }
        }
    }

    return $correlations.Values
}

function Discover-RiskTrends {
    param([array]$Learnings)

    $trends = @{
        high_risk_actions = @()
        improved_actions = @()
        declining_actions = @()
    }

    foreach ($entry in $Learnings) {
        if ($entry.type -eq "risk-pattern") {
            if ($entry.approved_rate -lt 30) {
                $trends.high_risk_actions += @{
                    action = $entry.action
                    risk_level = $entry.risk_level
                    approval_rate = $entry.approved_rate
                    note = "Frequently blocked - possible user preference"
                }
            }
        }
    }

    return $trends
}

function Identify-UserBehavior {
    param([array]$Learnings)

    $behavior = @{
        success_rate = 0
        active_commands = @()
        preferred_modes = @()
        learning_curve = "IMPROVING"
    }

    foreach ($entry in $Learnings) {
        if ($entry.type -eq "user-preferences") {
            $behavior.success_rate = $entry.success_rate.percentage
        }
    }

    return $behavior
}

function Generate-Insights {
    param(
        [object]$IntentCorrelations,
        [object]$RiskTrends,
        [object]$UserBehavior
    )

    $insights = @()

    # Insight 1: Success trends
    $reliableCount = ($IntentCorrelations | Where-Object { $_.success_rate -gt 80 }).Count
    if ($reliableCount -gt 0) {
        $insights += @{
            type = "positive"
            title = "Reliable Commands"
            description = "$reliableCount commands have >80% success rate"
            priority = "low"
        }
    }

    # Insight 2: Risk trends
    if ($RiskTrends.high_risk_actions.Count -gt 0) {
        $insights += @{
            type = "warning"
            title = "High-Risk Actions Detected"
            description = "$($RiskTrends.high_risk_actions.Count) actions are frequently blocked"
            actions = @("Review user preferences", "Consider whitelist changes")
            priority = "medium"
        }
    }

    # Insight 3: User learning
    if ($UserBehavior.success_rate -gt 85) {
        $insights += @{
            type = "positive"
            title = "Improving Performance"
            description = "Overall success rate is $($UserBehavior.success_rate)%"
            priority = "low"
        }
    }

    return $insights
}

function Create-SynthesisSummary {
    param(
        [object]$IntentCorrelations,
        [object]$RiskTrends,
        [object]$UserBehavior,
        [array]$Insights
    )

    return @{
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
        period = $Period
        days_analyzed = $DaysToAnalyze

        summary = @{
            total_reliable_commands = ($IntentCorrelations | Where-Object { $_.success_rate -gt 80 }).Count
            total_risky_commands = ($IntentCorrelations | Where-Object { $_.success_rate -lt 60 }).Count
            overall_success_rate = $UserBehavior.success_rate
            high_risk_actions = $RiskTrends.high_risk_actions.Count
        }

        insights = $Insights

        recommendations = @(
            "Review commands with <60% success rate"
            "Monitor user behavior patterns"
            "Update risk gate thresholds if needed"
            "Archive old learnings for memory efficiency"
        )
    }
}

# ============================================================================
# MAIN SYNTHESIS PIPELINE
# ============================================================================

function Invoke-MemorySynthesis {
    if ($Verbose) { Write-Host "🧠 Starting memory synthesis..." -ForegroundColor Cyan }

    # Read learnings
    $learnings = & $SynthConfig.CoreScript -Operation read -MemoryType learnings | Where-Object { $_ }

    if ($Verbose) { Write-Host "   Loaded $($learnings.Count) learning entries" }

    # Analyze patterns
    $intentCorr = Analyze-IntentSuccessCorrelations -Learnings $learnings
    $riskTrends = Discover-RiskTrends -Learnings $learnings
    $userBehavior = Identify-UserBehavior -Learnings $learnings

    if ($Verbose) {
        Write-Host "   Found $($intentCorr.Count) intent correlations"
        Write-Host "   Detected $($riskTrends.high_risk_actions.Count) high-risk patterns"
    }

    # Generate insights
    $insights = Generate-Insights -IntentCorrelations $intentCorr -RiskTrends $riskTrends -UserBehavior $userBehavior

    # Create summary
    $summary = Create-SynthesisSummary -IntentCorrelations $intentCorr -RiskTrends $riskTrends -UserBehavior $userBehavior -Insights $insights

    # Save synthesis
    & $SynthConfig.CoreScript -Operation write -MemoryType learnings -Data $summary -Filename "synthesis_$(Get-Date -Format 'yyyyMMdd').jsonl" | Out-Null

    if ($Verbose) {
        Write-Host "✓ Synthesis complete" -ForegroundColor Green
        Write-Host "   Generated $($insights.Count) insights"
    }

    return $summary
}

# Main execution
if ($MyInvocation.InvocationName -ne ".") {
    Invoke-MemorySynthesis | ConvertTo-Json -Depth 5
}
