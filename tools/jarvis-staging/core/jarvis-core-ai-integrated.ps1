# jarvis-core-ai-integrated.ps1 - Jarvis Core v0.2 (AI-Powered Intent)
# Upgrade: Replace regex patterns with LLM intent understanding

param(
    [string]$Command,
    [string]$Input = "",
    [string]$Mode = "safe",
    [string]$IntentProvider = "claude",  # claude, grok, gemini
    [switch]$DryRun = $false,
    [switch]$UseAI = $true  # Toggle between AI and fallback regex
)

# ============================================================================
# CORE CONFIGURATION
# ============================================================================

$JarvisConfig = @{
    Name = "Jarvis-Local"
    Version = "0.2.0-ai"  # Upgraded from 0.1.0
    Workspace = "D:\01 Main Work\Boots\Agentic AI\mission-control"
    ToolsDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools"
    LogsDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\logs"
    MemoryDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\memory"
    BackupDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\backup"
    ProofLogPath = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\logs\proof-log.jsonl"
    LastBackupTracker = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\LAST_BACKUP_DIR.txt"
    Mode = $Mode
    DryRun = $DryRun
    UseAI = $UseAI
    IntentProvider = $IntentProvider
}

# ============================================================================
# 1. AI-POWERED INTENT PARSER (NEW)
# ============================================================================

function Parse-Intent-AI {
    param([string]$UserInput)

    $intentAIScript = Join-Path $JarvisConfig.ToolsDir "jarvis-staging\core\jarvis-intent-ai.ps1"

    if (-not (Test-Path $intentAIScript)) {
        Write-Host "⚠️  AI intent parser not found. Using fallback regex." -ForegroundColor Yellow
        return Parse-Intent-Regex -UserInput $UserInput
    }

    try {
        $result = & $intentAIScript `
            -UserInput $UserInput `
            -Provider $JarvisConfig.IntentProvider `
            -DryRun:$JarvisConfig.DryRun

        if ($result.error) {
            Write-Host "⚠️  AI parsing failed, using fallback: $($result.error)" -ForegroundColor Yellow
            return Parse-Intent-Regex -UserInput $UserInput
        }

        return @{
            raw = $UserInput
            action = $result.action
            target = $result.target
            parameters = $result.parameters
            confidence = $result.confidence
            timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
            locale = "th-TH"
            parser = "ai"
            provider = $JarvisConfig.IntentProvider
        }
    }
    catch {
        Write-Host "⚠️  AI parser error, falling back to regex" -ForegroundColor Yellow
        return Parse-Intent-Regex -UserInput $UserInput
    }
}

# ============================================================================
# 2. FALLBACK REGEX INTENT PARSER (Legacy)
# ============================================================================

function Parse-Intent-Regex {
    param([string]$UserInput)

    $intent = @{
        raw = $UserInput
        action = ""
        target = ""
        parameters = @{}
        confidence = 0
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
        locale = "th-TH"
        parser = "regex"
    }

    $patterns = @{
        "open\s+(.+)" = @{ action = "open"; paramKey = "app" }
        "screenshot" = @{ action = "screenshot"; paramKey = "" }
        "search\s+(.+)" = @{ action = "search"; paramKey = "query" }
        "send\s+(.+)" = @{ action = "send"; paramKey = "message" }
        "list\s+(.+)" = @{ action = "list"; paramKey = "target" }
        "help" = @{ action = "help"; paramKey = "" }
        "status" = @{ action = "status"; paramKey = "" }
    }

    foreach ($pattern in $patterns.GetEnumerator()) {
        if ($UserInput -match $pattern.Key) {
            $intent.action = $pattern.Value.action
            if ($pattern.Value.paramKey -and $Matches[1]) {
                $intent.parameters[$pattern.Value.paramKey] = $Matches[1]
            }
            $intent.confidence = 0.85
            break
        }
    }

    if (-not $intent.action) {
        $intent.action = "unknown"
        $intent.confidence = 0.0
    }

    return $intent
}

# ============================================================================
# 3. UNIFIED INTENT PARSER (AI or Fallback)
# ============================================================================

function Parse-Intent {
    param([string]$UserInput)

    if ($JarvisConfig.UseAI) {
        return Parse-Intent-AI -UserInput $UserInput
    } else {
        return Parse-Intent-Regex -UserInput $UserInput
    }
}

# ============================================================================
# 4. RISK GATE (unchanged)
# ============================================================================

function Evaluate-Risk {
    param(
        [hashtable]$Intent,
        [string]$Mode = "safe"
    )

    $risk = @{
        level = "low"
        riskScore = 0
        approved = $false
        reason = ""
        allowlist = $false
        requiresApproval = $false
    }

    $safeActions = @("help", "status", "list", "search", "screenshot")

    if ($Intent.action -in $safeActions) {
        $risk.level = "low"
        $risk.riskScore = 0
        $risk.approved = $true
        $risk.allowlist = $true
        $risk.reason = "Action is on safe allowlist"
        return $risk
    }

    $mediumRiskActions = @("open", "send")

    if ($Intent.action -in $mediumRiskActions) {
        $risk.level = "medium"
        $risk.riskScore = 50
        $risk.reason = "Action requires user confirmation"

        if ($Mode -eq "safe") {
            $risk.approved = $false
            $risk.requiresApproval = $true
        } else {
            $risk.approved = $true
        }
        return $risk
    }

    $highRiskActions = @("delete", "uninstall", "format", "reboot", "shutdown")

    if ($Intent.action -in $highRiskActions) {
        $risk.level = "high"
        $risk.riskScore = 100
        $risk.approved = $false
        $risk.requiresApproval = $true
        $risk.reason = "DESTRUCTIVE ACTION: Explicit approval required"
        return $risk
    }

    $risk.level = "unknown"
    $risk.riskScore = 75
    $risk.approved = $false
    $risk.requiresApproval = $true
    $risk.reason = "Unknown action: requires manual review"

    return $risk
}

# ============================================================================
# 5. COMMAND ROUTER (unchanged)
# ============================================================================

function Route-Command {
    param(
        [hashtable]$Intent,
        [hashtable]$Risk
    )

    $route = @{
        executor = ""
        handler = ""
        module = ""
        approved = $Risk.approved
    }

    switch ($Intent.action) {
        "screenshot" {
            $route.executor = "jarvis-computer-use"
            $route.handler = "Capture-Screenshot"
            $route.module = "computer-use"
        }
        "open" {
            $route.executor = "jarvis-connectors"
            $route.handler = "Open-Application"
            $route.module = "connectors"
        }
        "search" {
            $route.executor = "jarvis-connectors"
            $route.handler = "Search-Web"
            $route.module = "connectors"
        }
        "send" {
            $route.executor = "jarvis-connectors"
            $route.handler = "Send-Message"
            $route.module = "connectors"
        }
        "list" {
            $route.executor = "jarvis-connectors"
            $route.handler = "List-Items"
            $route.module = "connectors"
        }
        "status" {
            $route.executor = "jarvis-core"
            $route.handler = "Get-Status"
            $route.module = "core"
        }
        "help" {
            $route.executor = "jarvis-core"
            $route.handler = "Show-Help"
            $route.module = "core"
        }
        default {
            $route.executor = "jarvis-core"
            $route.handler = "Handle-Unknown"
            $route.module = "core"
        }
    }

    return $route
}

# ============================================================================
# 6. PROOF LOGGER (unchanged)
# ============================================================================

function Write-ProofLog {
    param(
        [hashtable]$Intent,
        [hashtable]$Risk,
        [hashtable]$Route,
        [string]$Result = "pending",
        [string]$Execution = ""
    )

    if (-not (Test-Path $JarvisConfig.LogsDir)) {
        New-Item -ItemType Directory -Path $JarvisConfig.LogsDir -Force | Out-Null
    }

    $proofEntry = @{
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
        intent = $Intent.action
        input = $Intent.raw
        parser = $Intent.parser  # NEW: track which parser was used
        provider = $Intent.provider  # NEW: track AI provider if used
        risk_level = $Risk.level
        risk_score = $Risk.riskScore
        approved = $Risk.approved
        executor = $Route.executor
        handler = $Route.handler
        result = $Result
        execution_mode = $JarvisConfig.Mode
        dry_run = $JarvisConfig.DryRun
        use_ai = $JarvisConfig.UseAI
        execution_details = $Execution
    }

    $proofJson = $proofEntry | ConvertTo-Json -Compress
    Add-Content -Path $JarvisConfig.ProofLogPath -Value $proofJson -Force

    return $proofEntry
}

# ============================================================================
# 7. EXECUTOR (simplified for demo)
# ============================================================================

function Execute-Intent {
    param(
        [hashtable]$Intent,
        [hashtable]$Risk,
        [hashtable]$Route
    )

    $result = @{
        success = $false
        output = ""
        error = ""
        dryRun = $JarvisConfig.DryRun
    }

    if (-not $Risk.approved) {
        $result.error = "BLOCKED: $($Risk.reason)"
        return $result
    }

    if ($JarvisConfig.DryRun) {
        $result.output = "[DRY-RUN] Would execute: $($Route.handler) from $($Route.executor)"
        $result.success = $true
        return $result
    }

    try {
        switch ($Route.handler) {
            "Show-Help" {
                $result.output = Get-Help-Text
                $result.success = $true
            }
            "Get-Status" {
                $result.output = Get-Jarvis-Status
                $result.success = $true
            }
            "Handle-Unknown" {
                $result.error = "Unknown action: $($Intent.action)"
                $result.success = $false
            }
            default {
                $result.error = "Handler not yet implemented: $($Route.handler)"
                $result.success = $false
            }
        }
    }
    catch {
        $result.error = $_.Exception.Message
        $result.success = $false
    }

    return $result
}

# ============================================================================
# 8. HELPERS
# ============================================================================

function Get-Help-Text {
    @"
╔════════════════════════════════════════════╗
║          JARVIS LOCAL v0.2.0-ai           ║
║   AI-Powered Windows Assistant (Alpha)    ║
╚════════════════════════════════════════════╝

POWERED BY: $(if ($JarvisConfig.UseAI) { "$($JarvisConfig.IntentProvider.ToUpper()) AI" } else { "Regex Fallback" })

COMMANDS (natural language now supported):
  "help" or "what can you do?"
  "take a screenshot"
  "open chrome"
  "search for Thai language resources"
  "show status"

Try Thai commands too:
  "ถ่ายภาพหน้าจอ"
  "เปิด notepad"
  "ค้นหาข้อมูล"

For more: https://github.com/.../jarvis-local
"@
}

function Get-Jarvis-Status {
    @"
╔════════════════════════════════════════════╗
║           JARVIS LOCAL STATUS             ║
╚════════════════════════════════════════════╝

Name:       Jarvis-Local
Version:    0.2.0-ai (AI-Powered)
Mode:       $($JarvisConfig.Mode)
DryRun:     $($JarvisConfig.DryRun)
AI Enabled: $($JarvisConfig.UseAI)
Provider:   $($JarvisConfig.IntentProvider.ToUpper())

Workspace:  $($JarvisConfig.Workspace)
Logs:       $($JarvisConfig.LogsDir)
Memory:     $($JarvisConfig.MemoryDir)

Status: ✓ Ready
"@
}

function Validate-Paths {
    $requiredDirs = @(
        $JarvisConfig.ToolsDir,
        $JarvisConfig.LogsDir,
        $JarvisConfig.MemoryDir
    )

    foreach ($dir in $requiredDirs) {
        if (-not (Test-Path $dir)) {
            Write-Error "Required directory missing: $dir"
            return $false
        }
    }

    return $true
}

# ============================================================================
# 9. MAIN ORCHESTRATION
# ============================================================================

function Main {
    if (-not (Validate-Paths)) {
        Write-Error "Path validation failed"
        exit 1
    }

    $userInput = $Input -or "help"

    Write-Host "🧠 Using AI Intent Parser (Alpha)" -ForegroundColor Cyan
    Write-Host "   Provider: $($JarvisConfig.IntentProvider.ToUpper())" -ForegroundColor Gray
    Write-Host ""

    $intent = Parse-Intent -UserInput $userInput
    $risk = Evaluate-Risk -Intent $intent -Mode $JarvisConfig.Mode
    $route = Route-Command -Intent $intent -Risk $risk
    $proof = Write-ProofLog -Intent $intent -Risk $risk -Route $route
    $execution = Execute-Intent -Intent $intent -Risk $risk -Route $route

    Write-ProofLog -Intent $intent -Risk $risk -Route $route -Result $execution.success -Execution $execution.output

    Write-Output "╔════════════════════════════════════════════╗"
    Write-Output "║              JARVIS EXECUTION             ║"
    Write-Output "╚════════════════════════════════════════════╝"
    Write-Output ""
    Write-Output "Input:      $($intent.raw)"
    $providerStr = if ($intent.provider) { "($($intent.provider.ToUpper()))" } else { "" }
    Write-Output "Parser:     $($intent.parser) $providerStr"
    Write-Output "Intent:     $($intent.action) (confidence: $($intent.confidence))"
    Write-Output "Risk:       $($risk.level) (score: $($risk.riskScore))"
    Write-Output "Approved:   $($risk.approved)"
    Write-Output "Mode:       $($JarvisConfig.Mode)"
    Write-Output ""

    if ($execution.success) {
        Write-Output "✓ SUCCESS:"
        Write-Output $execution.output
    } else {
        Write-Output "✗ ERROR:"
        Write-Output $execution.error
    }

    Write-Output ""
    Write-Output "Proof Log: $($JarvisConfig.ProofLogPath)"

    return @{
        success = $execution.success
        intent = $intent
        risk = $risk
        execution = $execution
    }
}

if ($MyInvocation.InvocationName -ne ".") {
    Main
}
