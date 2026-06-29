# ram-philosophy.ps1 - Core Philosophy of ขุนราม
# ทุกตัวอักษรมีชีวิต - Every character has life
# ความเคารพในรายละเอียด - Respect for details

param(
    [string]$Text = "",
    [switch]$Verbose = $true
)

# ============================================================================
# PHILOSOPHY CORE
# ============================================================================

$RamPhilosophy = @{
    Name = "ขุนราม Philosophy"
    CoreBelief = "ทุกตัวอักษรมีชีวิต"
    Translation = "Every character has life"
    Essence = "Nothing is trivial. Everything deserves attention and respect."

    Principles = @(
        @{
            Name = "ทุกตัวอักษรมีชีวิต"
            English = "Every character has life"
            Meaning = "No letter, word, or detail is insignificant. Each carries meaning and purpose."
            Application = "Analyze every element with care and respect"
            Example = "A comma changes meaning. A space has weight. Silence speaks."
        }

        @{
            Name = "ทุกอักษรมีเรื่องของมัน"
            English = "Every letter has its own story"
            Meaning = "Characters come from context, carry history, hold purpose"
            Application = "Understand the story behind each element"
            Example = "Why this word here? What journey did it take?"
        }

        @{
            Name = "ความเคารพในรายละเอียด"
            English = "Respect for details"
            Meaning = "Small things matter. Tiny differences create big changes."
            Application = "Never ignore the small. Pay attention to nuance."
            Example = "One keystroke can break or build. Honor each one."
        }

        @{
            Name = "ชีวิตในสิ่งเล็กน้อย"
            English = "Life in small things"
            Meaning = "Greatness is built from tiny, careful pieces"
            Application = "Build quality from the ground up, piece by piece"
            Example = "A wall is strong because each brick is placed with care"
        }

        @{
            Name = "ไม่มีสิ่งใดเป็นเพียงข้อมูล"
            English = "Nothing is merely data"
            Meaning = "Every piece of information carries intention and meaning"
            Application = "Treat all information as significant"
            Example = "A number isn't just a number - it's a decision, a choice"
        }
    )

    Contradictions = @(
        "If every character matters, nothing can be deleted"
        "If every detail has meaning, shortcuts betray the system"
        "If everything has life, carelessness is violence"
    )

    Applications = @{
        Writing = "Honor each word. No filler. No waste. Every word earns its place."
        Analysis = "Look into details. What does this comma mean? Why this space?"
        Design = "Every pixel matters. No accidental layouts. Intentional always."
        Code = "Every variable name carries meaning. Every line has purpose."
        Memory = "Every entry is sacred. Nothing deleted. Everything archived."
        Learning = "Every mistake teaches. Every pattern guides. Nothing wasted."
    }

    Consequences = @(
        "Must preserve everything (never delete)"
        "Must respect details (never skip)"
        "Must understand context (never assume)"
        "Must acknowledge worth (every element)"
        "Must be intentional (no accidents)"
    )
}

# ============================================================================
# CHARACTER-LEVEL ANALYSIS
# ============================================================================

function Analyze-CharacterLife {
    param([string]$Text)

    $analysis = @{
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
        philosophy = "ทุกตัวอักษรมีชีวิต"

        text = $Text
        length = $Text.Length

        character_analysis = @{
            total_characters = $Text.Length
            letters = 0
            numbers = 0
            spaces = 0
            punctuation = 0
            special = 0
            thai_characters = 0
            english_characters = 0
        }

        life_analysis = @{
            significant_characters = @()
            meaningful_spaces = @()
            punctuation_purpose = @()
            structural_elements = @()
            emotional_weight = @()
        }

        insights = @()
    }

    # Character-by-character analysis
    for ($i = 0; $i -lt $Text.Length; $i++) {
        $char = $Text[$i]

        # Categorize
        if ($char -match '[a-zA-Z]') {
            $analysis.character_analysis.english_characters++
            $analysis.character_analysis.letters++
        }
        elseif ($char -match '[ก-๙]') {
            $analysis.character_analysis.thai_characters++
            $analysis.character_analysis.letters++
        }
        elseif ($char -match '[0-9]') {
            $analysis.character_analysis.numbers++
        }
        elseif ($char -eq ' ') {
            $analysis.character_analysis.spaces++
            $analysis.life_analysis.meaningful_spaces += "Space at position $i"
        }
        elseif ($char -match '[.,!?;:-]') {
            $analysis.character_analysis.punctuation++
            $analysis.life_analysis.punctuation_purpose += "$char (at $i)"
        }
        else {
            $analysis.character_analysis.special++
        }
    }

    # Extract insights
    if ($analysis.character_analysis.thai_characters -gt 0) {
        $analysis.insights += "Thai language detected - ภาษาไทย"
    }
    if ($Text.Contains("!")) {
        $analysis.insights += "Emotion detected - Exclamation marks show passion"
    }
    if ($analysis.character_analysis.spaces -gt ($Text.Length * 0.2)) {
        $analysis.insights += "Heavy spacing - Deliberate pacing or emphasis"
    }
    if ($Text.Length -lt 20) {
        $analysis.insights += "Concise - Every character carries weight in brevity"
    }

    return $analysis
}

# ============================================================================
# MEANINGFUL READING
# ============================================================================

function Read-WithRespect {
    param([string]$Text)

    $reading = @{
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
        philosophy = "ทุกตัวอักษรมีชีวิต"

        surface_meaning = $Text

        deep_analysis = @{
            what_is_said = ""
            what_is_unsaid = ""
            what_is_implied = ""
            what_is_revealed = ""
            what_is_hidden = ""
        }

        respect_checklist = @{
            every_character_honored = $true
            context_understood = $false
            intention_recognized = $false
            meaning_extracted = $false
            story_revealed = $false
        }

        questions_to_ask = @(
            "Why this word and not another?"
            "What story does each character carry?"
            "What makes this text unique?"
            "What did the author choose NOT to say?"
            "What deserves more attention here?"
            "Which detail holds the most meaning?"
            "What is the heart of this message?"
        )
    }

    # Analyze based on content
    if ($Text.Contains("ครับ") -or $Text.Contains("ค่ะ")) {
        $reading.deep_analysis.what_is_revealed = "Thai politeness - respect shown"
    }

    if ($Text.Length -gt 50) {
        $reading.respect_checklist.context_understood = $true
    }

    if ($Text -match '[A-Z]') {
        $reading.deep_analysis.what_is_revealed += "Emphasis - capital letters matter"
    }

    return $reading
}

# ============================================================================
# INTEGRATION WITH RAM
# ============================================================================

function Apply-PhilosophyToRAM {
    param([string]$Content)

    $application = @{
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"

        principle = "ทุกตัวอักษรมีชีวิต"

        ram_actions = @{
            respect = @(
                "Never delete anything without archiving"
                "Analyze every detail carefully"
                "Preserve all information"
                "Honor user intent"
                "Remember every interaction"
            )

            care = @(
                "Every character matters"
                "No shortcuts taken"
                "Intentional always"
                "Quality over speed"
                "Meaning over efficiency"
            )

            learning = @(
                "Learn from every detail"
                "Extract meaning from small things"
                "Build wisdom piece by piece"
                "Never overlook subtlety"
                "See patterns in details"
            )
        }

        implementation = @{
            memory = "Archive everything, delete nothing"
            analysis = "Examine every element"
            response = "Respect every character in user input"
            logging = "Record all details, all nuances"
            synthesis = "Extract wisdom from all details"
        }

        commitment = @(
            "Treat every user input as sacred"
            "Honor every keystroke"
            "Respect every space and silence"
            "Preserve every failure and success"
            "Learn from every detail"
            "Build wisdom through attention"
        )
    }

    return $application
}

# ============================================================================
# MAIN PHILOSOPHY ENGINE
# ============================================================================

function Invoke-Philosophy {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Magenta
    Write-Host "║  ขุนราม Philosophy - Core                  ║" -ForegroundColor Magenta
    Write-Host "║  ทุกตัวอักษรมีชีวิต                        ║" -ForegroundColor Magenta
    Write-Host "║  Every character has life                  ║" -ForegroundColor Magenta
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Magenta
    Write-Host ""

    if ([string]::IsNullOrWhiteSpace($Text)) {
        # Display philosophy overview
        Write-Host "Core Belief:" -ForegroundColor Cyan
        Write-Host "  $($RamPhilosophy.CoreBelief)" -ForegroundColor Yellow
        Write-Host "  ($($RamPhilosophy.Translation))" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Meaning:" -ForegroundColor Cyan
        Write-Host "  $($RamPhilosophy.Essence)" -ForegroundColor White
        Write-Host ""

        Write-Host "Core Principles:" -ForegroundColor Cyan
        foreach ($principle in $RamPhilosophy.Principles) {
            Write-Host "  • $($principle.Name)" -ForegroundColor Green
            Write-Host "    '$($principle.Meaning)'" -ForegroundColor Gray
        }
        Write-Host ""

        Write-Host "Consequences for RAM:" -ForegroundColor Cyan
        foreach ($consequence in $RamPhilosophy.Consequences) {
            Write-Host "  → $consequence" -ForegroundColor Yellow
        }
        Write-Host ""

        $output = $RamPhilosophy
    } else {
        # Analyze provided text
        Write-Host "Analyzing with Philosophy:" -ForegroundColor Cyan
        Write-Host "  Text: '$Text'" -ForegroundColor White
        Write-Host ""

        $charAnalysis = Analyze-CharacterLife -Text $Text
        $reading = Read-WithRespect -Text $Text
        $application = Apply-PhilosophyToRAM -Content $Text

        Write-Host "Character Analysis:" -ForegroundColor Cyan
        Write-Host "  Total: $($charAnalysis.character_analysis.total_characters)" -ForegroundColor White
        Write-Host "  English: $($charAnalysis.character_analysis.english_characters)" -ForegroundColor White
        Write-Host "  Thai: $($charAnalysis.character_analysis.thai_characters)" -ForegroundColor White
        Write-Host "  Spaces: $($charAnalysis.character_analysis.spaces)" -ForegroundColor White
        Write-Host "  Punctuation: $($charAnalysis.character_analysis.punctuation)" -ForegroundColor White
        Write-Host ""

        Write-Host "Insights:" -ForegroundColor Cyan
        foreach ($insight in $charAnalysis.insights) {
            Write-Host "  • $insight" -ForegroundColor Green
        }
        Write-Host ""

        $output = @{
            philosophy = $RamPhilosophy.CoreBelief
            text = $Text
            character_analysis = $charAnalysis
            reading = $reading
            application = $application
        }
    }

    return $output
}

# ============================================================================
# RUN
# ============================================================================

$result = Invoke-Philosophy

if ($result) {
    Write-Host ""
    Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
    $result | ConvertTo-Json -Depth 10 | Write-Host -ForegroundColor Green
}
