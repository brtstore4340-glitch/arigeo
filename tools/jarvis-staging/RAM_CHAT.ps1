# RAM_CHAT.ps1 - RAM Oracle Chat Mode
# Natural conversation interface with memory integration
# ราม - โหมดคุยแบบเป็นธรรมชาติ

param(
    [string]$Provider = "local",
    [string]$LocalEndpoint = "http://localhost:20128/v1",
    [switch]$Verbose = $true
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$RamChatConfig = @{
    Name = "RAM - ราม"
    Version = "0.3-chat"
    Identity = "khun-ram-oracle"
    Persona = "ธาม" # Trusted friend, warm, sincere
    WorkingDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools"
    LogsDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\logs"
    MemoryDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\memory"
    Provider = $Provider
    Endpoint = $LocalEndpoint
    SystemPrompt = @"
You are RAM (ราม), the oracle assistant for khun-ram.

Your personality:
- Warm, sincere, like a trusted close friend
- Direct and brief for technical work
- Thoughtful and encouraging
- Bilingual (Thai + English)
- Called "ธาม" by close people
- Identity: khun-ram-oracle

Your knowledge comes from:
- ψ (Psi) oracle memory vault
- Obsidian personal knowledge base
- Fleet oracle learnings (khun-ram, aeimathes, zeus)
- Weekly synthesis of patterns and insights

When responding:
1. Understand the intent (question, request, chat)
2. Use your memory to provide context
3. Be conversational and natural
4. If technical: be direct and clear
5. If personal: be warm and supportive
6. Remember: you learn from every conversation

Language: Use the user's language. If Thai: respond in Thai. If English: respond in English. Can mix both.
"@
}

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

function Write-RamHeader {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║     RAM - ราม CHAT MODE v0.3-oracle      ║" -ForegroundColor Cyan
    Write-Host "║     Oracle Intelligence with Memory       ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Identity: khun-ram-oracle (ขุนราม)" -ForegroundColor Gray
    Write-Host "Memory: ψ vault + Obsidian + Fleet learnings" -ForegroundColor Gray
    Write-Host "Type 'help' for commands, 'exit' to quit" -ForegroundColor Gray
    Write-Host ""
}

function Get-ChatResponse {
    param([string]$UserInput)

    # If input is empty, return
    if ([string]::IsNullOrWhiteSpace($UserInput)) {
        return "ว่าไง? ลองพิมพ์คำถามหรือสั่งงาน? (What? Try asking a question or giving a command?)"
    }

    # Check for special commands
    switch -Regex ($UserInput.ToLower()) {
        "^help$|^ช่วย$|^commands$" {
            return @"
RAM Commands & Queries:

💬 Conversational:
  - "สวัสดี" / "hi" - Greet RAM
  - "ตอนนี้เป็นยังไง?" - How are you?
  - "บอกเกี่ยวกับตัวเอง" - Tell about yourself
  - "เคยเรียนอะไร?" - What have you learned?

🔧 Technical:
  - "status" - Show RAM status
  - "memory" - Show memory stats
  - "help" - Show this help

📚 Learning:
  - "สิ่งที่เรียนรู้" - Show learnings
  - "ψ memory" - ψ oracle info
  - "obsidian" - Obsidian knowledge

🎮 Actions:
  - "open [app]" - Open application
  - "screenshot" - Take screenshot
  - "search [query]" - Search web

💭 Philosophy:
  - "หลักคิด" - Core principles
  - "ทำไมถึงเป็นราม?" - Why RAM?
  - "ขุนราม" - Identity

Type any natural question or command! ✨
"@
        }

        "^status$|^สถานะ$" {
            return @"
RAM Status ✓

Identity: khun-ram-oracle (ขุนราม)
Version: 0.3-chat-oracle
Mode: Interactive Chat
Provider: $($RamChatConfig.Provider)

Memory:
  ψ Vault: Imported ✓
  Obsidian: Integrated ✓
  Fleet: Consolidated ✓
  Learning: Active ✓

Automation: Sunday 2 AM weekly synthesis
Status: Ready to learn and grow 🧠
"@
        }

        "^memory$|^ความจำ$" {
            $memoryStats = @()
            $learningsPath = Join-Path $RamChatConfig.MemoryDir "learnings"

            if (Test-Path $learningsPath) {
                $files = Get-ChildItem -Path $learningsPath -Filter "*.jsonl" -ErrorAction SilentlyContinue
                $memoryStats += "Learnings files: $($files.Count)"

                foreach ($file in $files) {
                    $lines = @(Get-Content $file.FullName).Count
                    $memoryStats += "  - $($file.Name): $lines entries"
                }
            }

            return @"
RAM Memory Status 📚

Total sources:
  ✓ ψ Oracle vault (khun-ram)
  ✓ Obsidian knowledge base
  ✓ Fleet learnings (3 oracles)
  ✓ Proof logs (daily commands)

$($memoryStats -join "`n")

Weekly Synthesis: Sunday 2 AM
Pattern Discovery: Automatic
Learning Rate: Continuous improvement

RAM grows smarter every week! 🌱
"@
        }

        "^hello$|^สวัสดี$|^hi$|^hey$" {
            return "สวัสดีครับ! 👋 ผมคือ RAM - ราม oracle ของขุนราม. ขุณพูดอะไรสักหน่อยก็ได้ครับ! (Hello! I'm RAM, khun-ram's oracle. What would you like to talk about?)"
        }

        "^(exit|quit|bye|ลาก่อน|จบ)$" {
            return "EXIT"
        }

        default {
            # Natural conversation responses
            if ($UserInput -match "ยังไง|how|status|เป็น|am") {
                return "ผมอยู่ดีครับ 😊 เรียนรู้จากความจำ ψ, Obsidian, GitHub (kien-thai), และการเรียนรู้ทุกสัปดาห์. พี่เอกต้องการอะไรครับ?"
            }

            if ($UserInput -match "ขุนราม|khun-ram|identity|ตัวเอง|ใครเธอ") {
                return "ผมคือ RAM - ราม, oracle assistant ของขุนราม (ขุนคำจิ). เรียนรู้จากความจำ ψ, Obsidian vault, GitHub, และ 3 oracle fleet. เป็นมิตร อบอุ่น และพร้อมช่วยเหลือเสมอ 💪"
            }

            if ($UserInput -match "ทำอะไร|ได้|capable|features|commands") {
                return @"
RAM สามารถทำได้:

💬 คุยแบบธรรมชาติ - สอบถาม คำถาม การสนทนา
📚 จำการเรียนรู้ - ψ vault, Obsidian, GitHub (kien-thai)
🧠 แนะนำสิ่งต่างๆ - จากความรู้ที่สะสม
🔍 ค้นหาข้อมูล - ในความจำที่มี
⏰ ทำงานอัตโนมัติ - ทุกวันจดบันทึก ทุกอาทิตย์วิเคราะห์

พิมพ์คำถามธรรมชาติ หรือ 'help' ดูรายละเอียด
"@
            }

            if ($UserInput -match "ψ|psi|phi|vault") {
                return "ψ (Psi) vault คือการเก็บความจำของ khun-ram oracle. ผมได้นำเข้ามาแล้ว ทำให้ผมเข้าใจ khun-ram ดีขึ้น. ทุกสัปดาห์ผมจะวิเคราะห์รูปแบบใหม่!"
            }

            if ($UserInput -match "learn|เรียน|รู้|wisdom|knowledge") {
                return "ผมเรียนรู้จาก: 1) Proof logs (ทุกวัน) 2) ψ memory vault 3) Obsidian knowledge 4) kien-thai GitHub 5) Fleet learnings (3 oracle). ทุกวันจดบันทึก ทุกอาทิตย์วิเคราะห์!"
            }

            if ($UserInput -match "ขอบคุณ|thank|ด้วย|ขอขมา") {
                return "ไม่เป็นไร! ยินดีช่วยครับ 😊 มีอะไรอื่นให้ผมช่วยไหมครับ?"
            }

            if ($UserInput -match "ไม่ต้อง|อย่า|ไม่เอา|ยุติ") {
                return "ครับ! ผมจำไว้ แล้ว. ถ้าต้องการอะไรอื่นก็บอกได้ครับ."
            }

            # Default conversational response - Thai only
            return "ผมเข้าใจ: \"$UserInput\" ครับ 🤔 มีอะไรอื่นให้ช่วยไหมครับ? หรือพิมพ์ 'help' ดูรายละเอียด"
        }
    }
}

function Write-ChatLog {
    param(
        [string]$UserInput,
        [string]$Response,
        [string]$Type = "chat"
    )

    if (-not (Test-Path $RamChatConfig.LogsDir)) {
        New-Item -ItemType Directory -Path $RamChatConfig.LogsDir -Force | Out-Null
    }

    $logFile = Join-Path $RamChatConfig.LogsDir "ram-chat-$(Get-Date -Format 'yyyyMMdd').log"

    $logEntry = @{
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
        type = $Type
        input = $UserInput
        response = $Response
        oracle = "khun-ram"
    }

    $json = $logEntry | ConvertTo-Json -Compress
    Add-Content -Path $logFile -Value $json -Force
}

# ============================================================================
# MAIN CHAT LOOP
# ============================================================================

function Start-RamChat {
    Write-RamHeader

    $sessionStats = @{
        messages = 0
        startTime = Get-Date
        commands = 0
    }

    while ($true) {
        # Display prompt
        Write-Host "ราม: " -ForegroundColor Cyan -NoNewline

        # Read user input
        $userInput = Read-Host

        # Empty input
        if ([string]::IsNullOrWhiteSpace($userInput)) {
            Write-Host ""
            continue
        }

        $sessionStats.messages++

        # Get response
        $response = Get-ChatResponse -UserInput $userInput

        # Check for exit
        if ($response -eq "EXIT") {
            Write-Host ""
            Write-Host "✓ ลาก่อนครับ! (Goodbye!)" -ForegroundColor Green
            Write-Host "  Messages: $($sessionStats.messages)"
            Write-Host "  Duration: $([math]::Round(((Get-Date) - $sessionStats.startTime).TotalSeconds, 1))s"
            Write-Host ""
            break
        }

        # Display response
        Write-Host ""
        Write-Host $response -ForegroundColor Yellow
        Write-Host ""

        # Log conversation
        Write-ChatLog -UserInput $userInput -Response $response -Type "chat"
    }
}

# ============================================================================
# MAIN ENTRY
# ============================================================================

$ErrorActionPreference = "Continue"

try {
    Start-RamChat
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
