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
    Name = "RAM API Bridge - Ollama"
    Version = "4.0"
    Provider = "ollama"
    Endpoint = "http://localhost:11434/api/chat"
    Model = "neural-chat"  # or "mistral"
}

# ============================================================================
# CALL OLLAMA API
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
            stream = $false
        } | ConvertTo-Json -Depth 10

        $headers = @{
            "Content-Type" = "application/json"
        }

        Write-Host "[Ollama] Connecting to: $($BridgeConfig.Endpoint)" -ForegroundColor Cyan
        Write-Host "[Ollama] Model: $($BridgeConfig.Model)" -ForegroundColor Gray

        $response = Invoke-RestMethod `
            -Uri $BridgeConfig.Endpoint `
            -Method Post `
            -Headers $headers `
            -Body $body `
            -TimeoutSec 60 `
            -ErrorAction Stop

        if ($response.message -and $response.message.content) {
            Write-Host "[Ollama] Response received!" -ForegroundColor Green
            return $response.message.content
        } else {
            throw "Invalid response from Ollama"
        }
    } catch {
        throw "Ollama Error: $($_.Exception.Message)"
    }
}


# ============================================================================
# MAIN - Call Ollama and return response
# ============================================================================

try {
    Write-Host "[RAM Bridge] Calling Ollama..." -ForegroundColor Cyan
    Write-Host "[Ollama] Endpoint: $($BridgeConfig.Endpoint)" -ForegroundColor Gray

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
    Write-Host "[Ollama] Status: Check if Ollama is running at $($BridgeConfig.Endpoint)" -ForegroundColor Yellow
    Write-Host "[Ollama] Tip: Run 'ollama serve' in another terminal" -ForegroundColor Yellow

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
