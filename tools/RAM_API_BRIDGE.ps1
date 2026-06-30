# RAM_API_BRIDGE.ps1 - Simple API bridge for voice chat
# Accepts a message and returns a RAM response

param(
    [Parameter(Mandatory = $true)]
    [string]$Message,
    [string]$Provider = "local",
    [string]$LocalEndpoint = "http://localhost:20128/v1"
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$BridgeConfig = @{
    Name = "RAM API Bridge"
    Version = "1.0"
    WorkingDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools"
    LogsDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\logs"
    MemoryDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\memory"
    Provider = $Provider
    Endpoint = $LocalEndpoint
}

# ============================================================================
# ATTEMPT TO USE LOCAL ENDPOINT
# ============================================================================

function Get-RAMResponse {
    param([string]$UserMessage)

    # Try local endpoint first (if available)
    if ($BridgeConfig.Provider -eq "local") {
        try {
            $body = @{
                model = "gpt-3.5-turbo"
                messages = @(
                    @{
                        role = "system"
                        content = "You are RAM (ราม), a helpful Oracle assistant. Respond naturally in English or Thai."
                    }
                    @{
                        role = "user"
                        content = $UserMessage
                    }
                )
                temperature = 0.7
                max_tokens = 500
            } | ConvertTo-Json -Depth 10

            $response = Invoke-RestMethod `
                -Uri "$($BridgeConfig.Endpoint)/chat/completions" `
                -Method Post `
                -ContentType "application/json" `
                -Body $body `
                -TimeoutSec 10 `
                -ErrorAction Stop

            if ($response.choices -and $response.choices[0].message) {
                return $response.choices[0].message.content
            }
        } catch {
            # Local endpoint not available, fall through to fallback
        }
    }

    # Fallback: Simple response generator
    return Get-FallbackResponse $UserMessage
}

function Get-FallbackResponse {
    param([string]$UserMessage)

    # Extract intent and provide contextual response
    $lower = $UserMessage.ToLower()

    # Detect language
    $isThai = $lower -match '[฀-๿]'
    $language = if ($isThai) { "Thai" } else { "English" }

    # Simple intent matching
    switch -Regex ($lower) {
        # Greetings
        "^(hello|hi|hey|สวัสดี|หวัดดี)" {
            $responses = @(
                "Hello! I'm RAM, your oracle assistant. How can I help?",
                "Hi there! What would you like to know?",
                "สวัสดี! ฉันคือ ราม ชัย ยินดีที่ได้พบเจอคุณ 🙏"
            )
            return $responses[(Get-Random -Maximum $responses.Count)]
        }

        # Status
        "^(how are you|ยังไง|สบายไหม)" {
            $responses = @(
                "I'm doing well, thank you for asking! Ready to assist.",
                "All systems operational! How can I serve you?",
                "ชีวิตดี ขอบคุณที่ถาม 😊"
            )
            return $responses[(Get-Random -Maximum $responses.Count)]
        }

        # Identity
        "(who|name|ชื่อ|เธอชื่อ)" {
            $responses = @(
                "I'm RAM (ราม), your personal oracle assistant. I learn from your knowledge and grow with you.",
                "You can call me RAM, or ธาม if we're close. I'm here to serve your needs.",
                "ฉันชื่อ ราม (RAM) เลขที่ 01 ของทีม oracle คุณ 🎯"
            )
            return $responses[(Get-Random -Maximum $responses.Count)]
        }

        # Help
        "^(help|assist|what can)" {
            $responses = @(
                "I can help with questions, tasks, learning, problem-solving, and much more! What's on your mind?",
                "I'm here to help! You can ask me questions, have conversations, or work on projects together.",
                "ผมสามารถช่วยเรื่องต่างๆ ได้ เช่น ตอบคำถาม ให้คำแนะนำ หรือเรียนรู้ด้วยกัน"
            )
            return $responses[(Get-Random -Maximum $responses.Count)]
        }

        # Capabilities
        "^(can you|skill|feature|ทำอะไรได้)" {
            $responses = @(
                "I can chat, answer questions, solve problems, analyze information, generate ideas, and learn from our interactions. All in English and Thai!",
                "My skills include reasoning, language understanding (Thai + English), memory integration, and creative problem-solving.",
                "ฉันสามารถคุยได้ ตอบคำถามได้ แก้ปัญหาได้ และเรียนรู้จากการคุยกับคุณ"
            )
            return $responses[(Get-Random -Maximum $responses.Count)]
        }

        # Default
        default {
            # Echo the message back with a thoughtful response
            $responses = @(
                "That's interesting! Tell me more about it.",
                "I understand. How can I help with that?",
                "ขอบคุณที่บอก ผมเข้าใจแล้ว มีอะไรให้ช่วยไหม?",
                "That makes sense. What would you like to do next?"
            )
            return $responses[(Get-Random -Maximum $responses.Count)]
        }
    }
}

# ============================================================================
# MAIN - Return response as JSON
# ============================================================================

try {
    $ramResponse = Get-RAMResponse $Message

    # Output as JSON (what the backend expects)
    $output = @{
        message = $ramResponse
        language = if ($Message -match '[฀-๿]') { "Thai" } else { "English" }
        timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ")
        success = $true
    } | ConvertTo-Json

    Write-Output $output
    exit 0
} catch {
    $error = @{
        message = "Error processing request: $($_.Exception.Message)"
        success = $false
        timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ")
    } | ConvertTo-Json

    Write-Error $error
    exit 1
}
