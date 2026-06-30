# RAM_API_BRIDGE.ps1 - OpenAI-powered API bridge
# Thai-fluent chat with gpt-4o-mini

param(
    [Parameter(Mandatory = $true)]
    [string]$Message
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$BridgeConfig = @{
    Name = "RAM API Bridge - OpenAI"
    Version = "2.0"
    Provider = "openai"
    Model = "gpt-4o-mini"
    ApiKey = $env:OPENAI_API_KEY
    Endpoint = "https://api.openai.com/v1/chat/completions"
}

if (-not $BridgeConfig.ApiKey) {
    $errorOutput = @{
        success = $false
        error = "OPENAI_API_KEY not set in environment"
        message = "ตั้งค่า OPENAI_API_KEY ในไฟล์ .env ของ backend"
        timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ")
    } | ConvertTo-Json
    Write-Output $errorOutput
    exit 1
}

# ============================================================================
# CALL OPENAI API
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
            "Authorization" = "Bearer $($BridgeConfig.ApiKey)"
            "Content-Type" = "application/json"
        }

        $response = Invoke-RestMethod `
            -Uri $BridgeConfig.Endpoint `
            -Method Post `
            -Headers $headers `
            -Body $body `
            -TimeoutSec 15 `
            -ErrorAction Stop

        if ($response.choices -and $response.choices[0].message) {
            return $response.choices[0].message.content
        } else {
            throw "Invalid response from OpenAI API"
        }
    } catch {
        throw "OpenAI API Error: $($_.Exception.Message)"
    }
}


# ============================================================================
# MAIN - Call OpenAI and return response
# ============================================================================

try {
    Write-Host "[RAM Bridge] Processing message from user..." -ForegroundColor Cyan

    $ramResponse = Get-RAMResponse $Message

    # Output as JSON (what the backend expects)
    $output = @{
        message = $ramResponse
        language = if ($Message -match '[฀-๿]') { "Thai" } else { "English" }
        timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ")
        success = $true
        model = $BridgeConfig.Model
    } | ConvertTo-Json -Depth 10

    Write-Output $output
    exit 0
} catch {
    Write-Host "[RAM Bridge ERROR] $($_.Exception.Message)" -ForegroundColor Red

    $error = @{
        message = "Error: $($_.Exception.Message)"
        success = $false
        timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ")
        provider = $BridgeConfig.Provider
    } | ConvertTo-Json

    Write-Output $error
    exit 1
}
