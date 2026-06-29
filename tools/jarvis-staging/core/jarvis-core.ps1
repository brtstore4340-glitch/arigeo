# jarvis-core.ps1 - Jarvis Core Logic (Intent Parser, Router, Risk Gate, Executor, Proof Logger)
# PowerShell-first architecture for local Windows assistant

param(
    [string]$Command,
    [string]$Input = "",
    [string]$Mode = "safe",  # safe, interactive, risk-approved
    [switch]$DryRun = $false
)

# ============================================================================
# CORE CONFIGURATION
# ============================================================================

$JarvisConfig = @{
    Name = "Jarvis-Local"
    Version = "0.1.0-mvp"
    Workspace = "D:\01 Main Work\Boots\Agentic AI\mission-control"
    ToolsDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools"
    LogsDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\logs"
    MemoryDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\memory"
    BackupDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\backup"
    ProofLogPath = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\logs\proof-log.jsonl"
    LastBackupTracker = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\LAST_BACKUP_DIR.txt"
    Mode = $Mode
    DryRun = $DryRun
}

# ============================================================================
# 1. INTENT PARSER
# ============================================================================

function Parse-Intent {
    param([string]$UserInput)

    $intent = @{
        raw = $UserInput
        action = ""
        target = ""
        parameters = @{}
        confidence = 0
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
        locale = "th-TH"
    }

    # Simple Thai command parsing (extensible)
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
# 2. RISK GATE
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

    # Allowlist of safe actions
    $safeActions = @("help", "status", "list", "search", "screenshot")

    if ($Intent.action -in $safeActions) {
        $risk.level = "low"
        $risk.riskScore = 0
        $risk.approved = $true
        $risk.allowlist = $true
        $risk.reason = "Action is on safe allowlist"
        return $risk
    }

    # Medium risk actions
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

    # High risk actions (destructive, system-level)
    $highRiskActions = @("delete", "uninstall", "format", "reboot", "shutdown")

    if ($Intent.action -in $highRiskActions) {
        $risk.level = "high"
        $risk.riskScore = 100
        $risk.approved = $false
        $risk.requiresApproval = $true
        $risk.reason = "DESTRUCTIVE ACTION: Explicit approval required"
        return $risk
    }

    # Unknown action
    $risk.level = "unknown"
    $risk.riskScore = 75
    $risk.approved = $false
    $risk.requiresApproval = $true
    $risk.reason = "Unknown action: requires manual review"

    return $risk
}

# ============================================================================
# 3. COMMAND ROUTER
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
# 4. PROOF LOGGER
# ============================================================================

function Write-ProofLog {
    param(
        [hashtable]$Intent,
        [hashtable]$Risk,
        [hashtable]$Route,
        [string]$Result = "pending",
        [string]$Execution = ""
    )

    # Ensure logs directory exists
    if (-not (Test-Path $JarvisConfig.LogsDir)) {
        New-Item -ItemType Directory -Path $JarvisConfig.LogsDir -Force | Out-Null
    }

    $proofEntry = @{
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
        intent = $Intent.action
        input = $Intent.raw
        risk_level = $Risk.level
        risk_score = $Risk.riskScore
        approved = $Risk.approved
        executor = $Route.executor
        handler = $Route.handler
        result = $Result
        execution_mode = $JarvisConfig.Mode
        dry_run = $JarvisConfig.DryRun
        execution_details = $Execution
    }

    $proofJson = $proofEntry | ConvertTo-Json -Compress
    Add-Content -Path $JarvisConfig.ProofLogPath -Value $proofJson -Force

    return $proofEntry
}

# ============================================================================
# 5. EXECUTOR
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

    # Check approval
    if (-not $Risk.approved) {
        $result.error = "BLOCKED: $($Risk.reason)"
        return $result
    }

    # Dry-run mode
    if ($JarvisConfig.DryRun) {
        $result.output = "[DRY-RUN] Would execute: $($Route.handler) from $($Route.executor)"
        $result.success = $true
        return $result
    }

    # Actual execution
    try {
        switch ($Route.handler) {
            "Capture-Screenshot" {
                $screenshotPath = & (Join-Path $JarvisConfig.ToolsDir "jarvis-staging\computer-use\capture-screenshot.ps1")
                $result.output = $screenshotPath
                $result.success = $true
            }
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
# 6. HELPER FUNCTIONS
# ============================================================================

function Get-Help-Text {
    @"
╔════════════════════════════════════════════╗
║          JARVIS LOCAL MVP v0.1.0          ║
║     Windows PowerShell Local Assistant     ║
╚════════════════════════════════════════════╝

COMMANDS:
  help           - Show this help text
  status         - Show Jarvis status
  screenshot     - Capture current screen
  open <app>     - Open application
  search <query> - Search web
  send <msg>     - Send message
  list <items>   - List items

MODE:
  safe           - Default, requires approval for medium/high risk
  interactive    - Ask before actions
  risk-approved  - Skip approval for approved actions

EXAMPLES:
  jarvis.ps1 -Input "help"
  jarvis.ps1 -Input "screenshot" -Mode safe
  jarvis.ps1 -Input "search thai language" -DryRun

For more: https://github.com/.../jarvis-local
"@
}

function Get-Jarvis-Status {
    @"
╔════════════════════════════════════════════╗
║           JARVIS LOCAL STATUS             ║
╚════════════════════════════════════════════╝

Name:     Jarvis-Local
Version:  0.1.0-mvp
Mode:     $($JarvisConfig.Mode)
DryRun:   $($JarvisConfig.DryRun)

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
        $JarvisConfig.MemoryDir,
        $JarvisConfig.BackupDir
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
# 7. MAIN ORCHESTRATION
# ============================================================================

function Main {
    # Validate environment
    if (-not (Validate-Paths)) {
        Write-Error "Path validation failed"
        exit 1
    }

    # Parse user input
    $userInput = $Input -or "help"
    $intent = Parse-Intent -UserInput $userInput

    # Evaluate risk
    $risk = Evaluate-Risk -Intent $intent -Mode $JarvisConfig.Mode

    # Route command
    $route = Route-Command -Intent $intent -Risk $risk

    # Log proof
    $proof = Write-ProofLog -Intent $intent -Risk $risk -Route $route

    # Execute
    $execution = Execute-Intent -Intent $intent -Risk $risk -Route $route

    # Update proof with result
    Write-ProofLog -Intent $intent -Risk $risk -Route $route -Result $execution.success -Execution $execution.output

    # Output
    Write-Output "╔════════════════════════════════════════════╗"
    Write-Output "║              JARVIS EXECUTION             ║"
    Write-Output "╚════════════════════════════════════════════╝"
    Write-Output ""
    Write-Output "Intent:    $($intent.action) (confidence: $($intent.confidence))"
    Write-Output "Risk:      $($risk.level) (score: $($risk.riskScore))"
    Write-Output "Approved:  $($risk.approved)"
    Write-Output "Mode:      $($JarvisConfig.Mode)"
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

# Execute if called directly
if ($MyInvocation.InvocationName -ne ".") {
    Main
}
