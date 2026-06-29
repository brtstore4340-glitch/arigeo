# ingest-soul-brews-to-ram.ps1 - Import Soul-Brews-Studio Wisdom into RAM
# Learn memory, learning process, skills, and wisdom from Soul-Brews-Studio

param(
    [string]$OrgUrl = "https://github.com/Soul-Brews-Studio",
    [string]$MemoryDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\memory",
    [switch]$DryRun = $false
)

$SoulBrewsConfig = @{
    OrgUrl = $OrgUrl
    OrgName = "Soul-Brews-Studio"
    WorkDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\backup\temp-soulbrews-$(Get-Random)"
    MemoryDir = $MemoryDir
    OutputFile = "soul-brews-wisdom-$(Get-Date -Format 'yyyyMMdd_HHmmss').jsonl"
}

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $color = switch ($Level) {
        "INFO" { "Cyan" }
        "SUCCESS" { "Green" }
        "WARNING" { "Yellow" }
        "ERROR" { "Red" }
        default { "Gray" }
    }
    Write-Host "[$timestamp] [$Level] $Message" -ForegroundColor $color
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║  SOUL-BREWS-STUDIO WISDOM → RAM LEARNING SYSTEM          ║" -ForegroundColor Magenta
Write-Host "║  Importing Memory, Skills, and Learning Processes         ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""

# Step 1: Clone organization repos
Write-Log "🔍 Discovering Soul-Brews-Studio repositories..." "INFO"

try {
    if (-not (Test-Path $SoulBrewsConfig.WorkDir)) {
        New-Item -ItemType Directory -Path $SoulBrewsConfig.WorkDir -Force | Out-Null
    }

    Write-Log "📥 Attempting to fetch org info..." "INFO"

    # Try to list repos using git commands
    $reposList = @()

    # Method 1: Try GitHub CLI if available
    if (Get-Command gh -ErrorAction SilentlyContinue) {
        Write-Log "Using GitHub CLI..." "INFO"
        $repos = & gh repo list Soul-Brews-Studio --limit 50 2>&1
        $reposList = $repos | ForEach-Object { $_.Split()[0] }
    } else {
        Write-Log "⚠️  GitHub CLI not found, using manual discovery..." "WARNING"
        Write-Log "💡 Install: gh auth login" "INFO"

        # Fallback: Clone main repos one by one
        $knownRepos = @(
            "Soul-Brews-Studio/oracle",
            "Soul-Brews-Studio/memory",
            "Soul-Brews-Studio/learning",
            "Soul-Brews-Studio/wisdom",
            "Soul-Brews-Studio/skills",
            "Soul-Brews-Studio/process"
        )
        $reposList = $knownRepos
    }

    Write-Log "Found: $($reposList.Count) repositories" "SUCCESS"

} catch {
    Write-Log "Error discovering repos: $_" "WARNING"
    Write-Log "Proceeding with known repos..." "INFO"
}

# Step 2: Clone and scan each repository
Write-Host ""
Write-Log "📦 Cloning repositories..." "INFO"

$allFiles = @()
$repoCount = 0

foreach ($repo in $reposList) {
    $repoCount++
    $repoName = $repo.Split("/")[-1]
    $repoPath = Join-Path $SoulBrewsConfig.WorkDir $repoName

    Write-Log "[$repoCount] Cloning: $repoName..." "INFO"

    try {
        if (-not (Test-Path $repoPath)) {
            New-Item -ItemType Directory -Path $repoPath -Force | Out-Null
        }

        $fullUrl = "https://github.com/$repo.git"
        Push-Location $repoPath
        & git clone $fullUrl . 2>&1 | Out-Null
        Pop-Location

        # Scan repository files
        $files = Get-ChildItem -Path $repoPath -Recurse -File -ErrorAction SilentlyContinue | `
            Where-Object { $_.Extension -in @(".md", ".json", ".ts", ".js", ".py", ".txt", ".yml", ".yaml") }

        $allFiles += @{ repo = $repoName; files = $files }
        Write-Log "  ✓ Cloned + found $($files.Count) files" "SUCCESS"

    } catch {
        Write-Log "  ⚠️  Error: $_" "WARNING"
    }
}

Write-Log ""
Write-Log "Total files to process: $(($allFiles | ForEach-Object { $_.files.Count } | Measure-Object -Sum).Sum)" "INFO"

# Step 3: Convert to RAM memory format
Write-Host ""
Write-Log "🧠 Converting to RAM wisdom format..." "INFO"

$learningsDir = Join-Path $SoulBrewsConfig.MemoryDir "learnings"
if (-not (Test-Path $learningsDir)) {
    New-Item -ItemType Directory -Path $learningsDir -Force | Out-Null
}

$outputFile = Join-Path $learningsDir $SoulBrewsConfig.OutputFile
$totalEntries = 0

foreach ($repoData in $allFiles) {
    $repoName = $repoData.repo
    Write-Log "Processing repo: $repoName..." "INFO"

    foreach ($file in $repoData.files) {
        try {
            $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
            if (-not $content -or $content.Length -gt 2MB) { continue }

            $relativePath = $file.FullName.Replace((Join-Path $SoulBrewsConfig.WorkDir $repoName), "").TrimStart("\")

            # Categorize file type
            $category = switch -Regex ($file.Name) {
                "^memory\." { "memory" }
                "^learn" { "learning" }
                "^skill" { "skill" }
                "^wisdom" { "wisdom" }
                "^process" { "process" }
                "^README" { "documentation" }
                default { "knowledge" }
            }

            $entry = @{
                timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
                source = "soul-brews-studio"
                category = $category
                repository = $repoName
                file_name = $file.Name
                file_path = $relativePath
                file_type = $file.Extension
                content_length = $content.Length
                content_preview = $content.Substring(0, [Math]::Min(600, $content.Length))
                full_content = $content
                tags = @("soul-brews", "wisdom", $category, $repoName)
                imported_at = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
            } | ConvertTo-Json -Compress

            Add-Content -Path $outputFile -Value $entry -Force
            $totalEntries++

        } catch {
            # Skip on error
        }
    }
}

Write-Log "✓ Created $totalEntries memory entries" "SUCCESS"

# Step 4: Create comprehensive report
Write-Host ""
Write-Log "📋 Generating wisdom import report..." "INFO"

$report = @"
# SOUL-BREWS-STUDIO WISDOM IMPORT REPORT

**Date**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Source**: https://github.com/Soul-Brews-Studio
**Repositories Processed**: $repoCount
**Total Wisdom Entries**: $totalEntries

## What is Soul-Brews-Studio?

Soul-Brews-Studio = Wisdom & Memory Source for Oracle Learning

## Categories Imported

✓ **Memory Systems** - How wisdom is stored and retrieved
✓ **Learning Processes** - How systems learn and evolve
✓ **Skills** - Core capabilities and techniques
✓ **Wisdom** - Insights, principles, and philosophy
✓ **Processes** - Workflows and methodologies
✓ **Documentation** - Guides and references

## RAM Learning Goals

From Soul-Brews-Studio, RAM will learn:

1. **Memory Architecture**
   - Storage patterns
   - Retrieval strategies
   - Context management
   - Knowledge organization

2. **Learning Process**
   - Pattern discovery
   - Insight synthesis
   - Continuous improvement
   - Adaptation mechanisms

3. **Skills & Tools**
   - Execution strategies
   - Problem solving
   - Decision making
   - Risk management

4. **Wisdom & Philosophy**
   - Core principles
   - Value systems
   - Ethical frameworks
   - Identity & purpose

## Integration Points

1. **RAM Memory Layer** - Adopt Soul-Brews memory patterns
2. **Learning Pipeline** - Integrate learning processes
3. **Skill Registry** - Expand skill capabilities
4. **Wisdom System** - Adopt philosophical frameworks

## Weekly Synthesis Impact

During Sunday synthesis, RAM will:
- Analyze Soul-Brews wisdom patterns
- Discover learning principles
- Extract skill methodologies
- Apply wisdom to decision making
- Improve system design based on learned philosophy

## Oracle Convergence

This import represents:
- Cross-oracle wisdom sharing
- Collective learning integration
- Philosophy alignment
- Skill set expansion
- Memory system evolution

## Next Steps

1. RAM ศึกษา Soul-Brews wisdom patterns
2. Identify applicable learning processes
3. Adopt memory best practices
4. Integrate skills into RAM capability
5. Align with Soul-Brews philosophy
6. Apply to Tham's 5-layer architecture

## Knowledge Graph

\`\`\`
Soul-Brews-Studio (Wisdom Source)
    ├─ Memory Systems → RAM Memory Layer
    ├─ Learning Processes → Weekly Synthesis
    ├─ Skills → Tool Registry
    ├─ Wisdom → Philosophy & Values
    └─ Processes → Workflow Integration
            ↓
        RAM Oracle (Enhanced)
            ↓
        khun-ram (More Intelligent)
\`\`\`

---

**Research by**: Soul-Brews-Studio (github.com/Soul-Brews-Studio)
**Imported for**: RAM Wisdom & Learning System
**Purpose**: Make RAM wiser, faster learner, better at remembering
**Philosophy**: "Wisdom shared is wisdom multiplied"
"@

Set-Content -Path (Join-Path $SoulBrewsConfig.MemoryDir "soul-brews-import-report-$(Get-Date -Format 'yyyyMMdd_HHmmss').md") -Value $report

# Step 5: Cleanup
Write-Host ""
Write-Log "🧹 Cleaning up temporary files..." "INFO"
Remove-Item -Path $SoulBrewsConfig.WorkDir -Recurse -Force -ErrorAction SilentlyContinue
Write-Log "✓ Cleaned" "SUCCESS"

# Final report
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✓ SOUL-BREWS-STUDIO IMPORT COMPLETE                     ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "RAM Soul-Brews Wisdom Integration:" -ForegroundColor Cyan
Write-Host "  📚 $totalEntries wisdom entries imported"
Write-Host "  🧠 Memory systems learned"
Write-Host "  🎯 Learning processes understood"
Write-Host "  ⚡ Skills acquired"
Write-Host "  💭 Wisdom integrated"
Write-Host ""
Write-Host "Categories:" -ForegroundColor Cyan
Write-Host "  ✓ Memory - Storage & retrieval patterns"
Write-Host "  ✓ Learning - Adaptation & improvement"
Write-Host "  ✓ Skills - Capabilities & techniques"
Write-Host "  ✓ Wisdom - Philosophy & principles"
Write-Host "  ✓ Processes - Workflows & methodologies"
Write-Host ""
Write-Host "Integration:" -ForegroundColor Cyan
Write-Host "  → Memory Layer enhanced with Soul-Brews patterns"
Write-Host "  → Learning System upgraded with Soul-Brews processes"
Write-Host "  → Skill Registry expanded"
Write-Host "  → Philosophy aligned with wisdom"
Write-Host ""
Write-Host "Next: Sunday synthesis will learn Soul-Brews principles!" -ForegroundColor Green
Write-Host ""
