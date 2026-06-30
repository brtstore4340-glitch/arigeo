# RAM_API_BRIDGE.ps1 - 9router Local Bridge
# Thai-fluent chat via local 9router orchestrator

param(
    [Parameter(Mandatory = $true)]
    [string]$Message
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$BridgeConfig = @{
    Name = "RAM API Bridge - 9router"
    Version = "3.0"
    Provider = "9router"
    Endpoint = "http://localhost:20128/v1/chat/completions"
    Model = "gpt-4o-mini"  # 9router routes to best model
}

# ============================================================================
# CALL 9ROUTER API
# ============================================================================

function Get-RAMResponse {
    param([string]$UserMessage)

    try {
        $body = @{
            model = $BridgeConfig.Model
            messages = @(
                @{
                    role = "system"
                    content = @"
You are RAM (ราม), an intelligent Oracle assistant for khun-ram. Your personality:
- Warm, sincere, like a trusted friend
- Fluent in both Thai and English
- Direct and helpful
- Smart and thoughtful
- Called "ธาม" by close people
- Identity: khun-ram-oracle

Respond naturally. If user speaks Thai, respond in Thai. If English, respond in English.
Keep responses concise but meaningful.
"@
                }
                @{
                    role = "user"
                    content = $UserMessage
                }
            )
            temperature = 0.7
            max_tokens = 500
        } | ConvertTo-Json -Depth 10

        $headers = @{
            "Content-Type" = "application/json"
        }

        Write-Host "[9router] Connecting to: $($BridgeConfig.Endpoint)" -ForegroundColor Cyan

        $response = Invoke-RestMethod `
            -Uri $BridgeConfig.Endpoint `
            -Method Post `
            -Headers $headers `
            -Body $body `
            -TimeoutSec 30 `
            -ErrorAction Stop

        if ($response.choices -and $response.choices[0].message) {
            Write-Host "[9router] Response received from 9router" -ForegroundColor Green
            return $response.choices[0].message.content
        } else {
            throw "Invalid response from 9router"
        }
    } catch {
        throw "9router Error: $($_.Exception.Message)"
    }
}


# ============================================================================
# MAIN - Call 9router and return response
# ============================================================================

try {
    Write-Host "[RAM Bridge] Calling 9router..." -ForegroundColor Cyan
    Write-Host "[9router] Endpoint: $($BridgeConfig.Endpoint)" -ForegroundColor Gray

    $ramResponse = Get-RAMResponse $Message

    # Output as JSON (what the backend expects)
    $output = @{
        message = $ramResponse
        language = if ($Message -match '[฀-๿]') { "Thai" } else { "English" }
        timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ")
        success = $true
        provider = $BridgeConfig.Provider
        model = $BridgeConfig.Model
    } | ConvertTo-Json -Depth 10

    Write-Output $output
    exit 0
} catch {
    Write-Host "[RAM Bridge ERROR] $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "[9router] Status: Check if 9router is running at $($BridgeConfig.Endpoint)" -ForegroundColor Yellow

    $error = @{
        message = "Error: $($_.Exception.Message)"
        success = $false
        timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ")
        provider = $BridgeConfig.Provider
        endpoint = $BridgeConfig.Endpoint
    } | ConvertTo-Json

    Write-Output $error
    exit 1
}
