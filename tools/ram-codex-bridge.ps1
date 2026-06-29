# ram-codex-bridge.ps1 - RAM ↔ Codex Hybrid Loop
# Bridge between RAM (local) and Codex (remote thinking engine) via 9router

param(
    [string]$RouterEndpoint = "http://localhost:20128/v1",
    [string]$RouterModel = "auto",  # auto-select best model
    [switch]$Verbose = $true
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$BridgeConfig = @{
    RouterEndpoint = $RouterEndpoint
    RouterModel = $RouterModel
    Timeout = 30
    ThinkingThreshold = 3  # Complexity score > 3 uses Codex
    SystemPrompt = @"
You are Codex, the thinking engine for RAM oracle.

Your role:
- Provide deep reasoning for complex questions
- Analyze patterns and insights
- Help RAM learn and improve
- Respond to RAM's requests via 9router

Keep responses concise but thoughtful.
Support Thai and English.

When RAM asks, think carefully and provide valuable insights that help RAM serve khun-ram better.
"@
}

# ============================================================================
# COMPLEXITY SCORING
# ============================================================================

function Get-QueryComplexity {
    param([string]$Query)

    $score = 0

    # Score based on query characteristics
    if ($Query -match "ทำไม|why|reason|analyze|วิเคราะห์") { $score += 2 }
    if ($Query -match "เปรียบเทียบ|compare|versus|เทียบ") { $score += 2 }
    if ($Query -match "ชาญฉลาด|สั่งสม|wisdom|insight|pattern") { $score += 2 }
    if ($Query -match "ช่วยคิด|think|reason|strategy|กลยุทธ์") { $score += 3 }
    if ($Query -match "research|ค้นหา|ศึกษา") { $score += 2 }
    if ($Query -match "ผู้เชี่ยวชาญ|expert|advice|แนะนำ") { $score += 1 }

    # Length bonus (longer = potentially more complex)
    if ($Query.Length -gt 100) { $score += 1 }
    if ($Query.Length -gt 200) { $score += 1 }

    return [Math]::Min($score, 10)  # Cap at 10
}

function Should-UseCodex {
    param([int]$ComplexityScore)

    return $ComplexityScore -ge $BridgeConfig.ThinkingThreshold
}

# ============================================================================
# 9ROUTER COMMUNICATION
# ============================================================================

function Test-RouterConnection {
    try {
        $response = Invoke-WebRequest -Uri "$($BridgeConfig.RouterEndpoint)/models" `
            -Method GET `
            -TimeoutSec 5 `
            -ErrorAction SilentlyContinue

        if ($response.StatusCode -eq 200) {
            return $true
        }
    } catch {
        return $false
    }
}

function Invoke-RouterDoctor {
    Write-Host ""
    Write-Host "⚠️  9router appears to be down" -ForegroundColor Yellow
    Write-Host "Running diagnostic..." -ForegroundColor Cyan
    Write-Host ""

    try {
        # Try to run 9router doctor
        $output = & 9router doctor 2>&1
        Write-Host $output
        return $true
    } catch {
        Write-Host "❌ 9router doctor not found in PATH" -ForegroundColor Red
        Write-Host "💡 Try: 9router doctor" -ForegroundColor Yellow
        Write-Host ""
        return $false
    }
}

function Send-ToCodex {
    param([string]$Query)

    try {
        $body = @{
            model = if ($BridgeConfig.RouterModel -eq "auto") { "codex" } else { $BridgeConfig.RouterModel }
            messages = @(
                @{
                    role = "system"
                    content = $BridgeConfig.SystemPrompt
                }
                @{
                    role = "user"
                    content = $Query
                }
            )
            temperature = 0.7
            max_tokens = 1000
        } | ConvertTo-Json -Depth 10

        $response = Invoke-RestMethod `
            -Uri "$($BridgeConfig.RouterEndpoint)/chat/completions" `
            -Method POST `
            -Headers @{ "Content-Type" = "application/json" } `
            -Body $body `
            -TimeoutSec $BridgeConfig.Timeout

        if ($response.choices -and $response.choices.Count -gt 0) {
            return @{
                success = $true
                content = $response.choices[0].message.content
                model = $response.model
                usage = $response.usage
            }
        }
    } catch {
        return @{
            success = $false
            error = $_.Exception.Message
        }
    }
}

# ============================================================================
# RAM ↔ CODEX LOOP
# ============================================================================

function Invoke-HybridQuery {
    param(
        [string]$Query,
        [scriptblock]$LocalAnswerHandler,
        [scriptblock]$CodexAnswerHandler
    )

    if ($Verbose) {
        Write-Host "🌉 RAM ↔ Codex Bridge" -ForegroundColor Cyan
        Write-Host "   Query: $Query" -ForegroundColor Gray
    }

    # Score complexity
    $complexity = Get-QueryComplexity -Query $Query
    if ($Verbose) {
        Write-Host "   Complexity: $complexity/10" -ForegroundColor Gray
    }

    # Route decision
    if (Should-UseCodex -ComplexityScore $complexity) {
        if ($Verbose) { Write-Host "   Route: Codex (remote thinking) 🧠" -ForegroundColor Yellow }

        # Check router availability
        if (-not (Test-RouterConnection)) {
            if ($Verbose) {
                Write-Host "   ⚠️  9router not available" -ForegroundColor Yellow
                Write-Host "   Suggestion: Run '9router doctor' in terminal" -ForegroundColor Cyan
                Write-Host "   Using local fallback..." -ForegroundColor Yellow
            }
            return & $LocalAnswerHandler
        }

        # Send to Codex
        $result = Send-ToCodex -Query $Query

        if ($result.success) {
            if ($Verbose) {
                Write-Host "   Response: $(($result.content | Measure-Object -Character).Characters) chars" -ForegroundColor Green
                Write-Host "   Model: $($result.model)" -ForegroundColor Gray
            }
            return & $CodexAnswerHandler -Content $result.content
        } else {
            if ($Verbose) { Write-Host "   ❌ Codex error: $($result.error)" -ForegroundColor Red }
            return & $LocalAnswerHandler
        }
    } else {
        if ($Verbose) { Write-Host "   Route: Local (RAM) 💬" -ForegroundColor Cyan }
        return & $LocalAnswerHandler
    }
}

# ============================================================================
# LEARNING INTEGRATION
# ============================================================================

function Write-CodexLearning {
    param(
        [string]$Query,
        [string]$CodexResponse,
        [string]$RamDecision
    )

    $logsDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\logs"
    if (-not (Test-Path $logsDir)) {
        New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
    }

    $logFile = Join-Path $logsDir "ram-codex-$(Get-Date -Format 'yyyyMMdd').log"

    $entry = @{
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
        query = $Query
        codex_response = $CodexResponse
        ram_decision = $RamDecision
        complexity = Get-QueryComplexity -Query $Query
        source = "ram-codex-bridge"
    }

    $json = $entry | ConvertTo-Json -Compress
    Add-Content -Path $logFile -Value $json -Force
}

# ============================================================================
# EXPORT FOR RAM_CHAT
# ============================================================================

function Get-CodexBridgeInterface {
    return @{
        QueryCodex = { param($q) Invoke-HybridQuery -Query $q @args }
        TestConnection = { Test-RouterConnection }
        GetComplexity = { param($q) Get-QueryComplexity -Query $q }
        LogLearning = { param($q, $r, $d) Write-CodexLearning -Query $q -CodexResponse $r -RamDecision $d }
    }
}

# Main: if called directly, show status
if ($MyInvocation.InvocationName -ne ".") {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Magenta
    Write-Host "║  RAM ↔ CODEX BRIDGE (via 9router)         ║" -ForegroundColor Magenta
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Magenta
    Write-Host ""

    Write-Host "Configuration:" -ForegroundColor Cyan
    Write-Host "  Router: $($BridgeConfig.RouterEndpoint)" -ForegroundColor Gray
    Write-Host "  Model: $($BridgeConfig.RouterModel)" -ForegroundColor Gray
    Write-Host "  Complexity threshold: $($BridgeConfig.ThinkingThreshold)/10" -ForegroundColor Gray
    Write-Host ""

    Write-Host "Testing connection..." -ForegroundColor Cyan
    if (Test-RouterConnection) {
        Write-Host "✓ 9router is reachable" -ForegroundColor Green
        Write-Host "✓ RAM ↔ Codex bridge ready" -ForegroundColor Green
    } else {
        Write-Host "⚠️  9router not reachable" -ForegroundColor Yellow
        Write-Host "   RAM will use local responses" -ForegroundColor Gray
        Write-Host ""
        Write-Host "🔧 If 9router should be running:" -ForegroundColor Cyan
        Write-Host "   Run: 9router doctor" -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "How it works:" -ForegroundColor Cyan
    Write-Host "  1. RAM receives query from user" -ForegroundColor Gray
    Write-Host "  2. Score complexity (0-10)" -ForegroundColor Gray
    Write-Host "  3. If complexity >= 3 → send to Codex" -ForegroundColor Gray
    Write-Host "  4. Codex thinks via 9router" -ForegroundColor Gray
    Write-Host "  5. RAM learns from response" -ForegroundColor Gray
    Write-Host "  6. Return answer to user" -ForegroundColor Gray
    Write-Host ""
}
