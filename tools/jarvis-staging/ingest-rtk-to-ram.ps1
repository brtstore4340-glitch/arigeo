# ingest-rtk-to-ram.ps1 - Import RTK (Rate Token Keeper) into RAM
# Learn token optimization & efficiency patterns from RTK framework

param(
    [string]$RepoUrl = "https://github.com/rtk-ai/rtk",
    [string]$MemoryDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\memory",
    [switch]$DryRun = $false
)

$RtkConfig = @{
    RepoUrl = $RepoUrl
    RepoName = "rtk"
    ClonePath = "D:\01 Main Work\Boots\Agentic AI\mission-control\backup\temp-rtk-$(Get-Random)"
    MemoryDir = $MemoryDir
    OutputFile = "rtk-token-optimization-$(Get-Date -Format 'yyyyMMdd_HHmmss').jsonl"
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║  RTK TOKEN OPTIMIZATION → RAM LEARNING    ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""

Write-Host "📥 Cloning RTK repository..." -ForegroundColor Cyan
try {
    if (-not (Test-Path $RtkConfig.ClonePath)) {
        New-Item -ItemType Directory -Path $RtkConfig.ClonePath -Force | Out-Null
    }
    
    Push-Location $RtkConfig.ClonePath
    & git clone $RepoUrl . 2>&1 | ForEach-Object { Write-Host "  $_" }
    Pop-Location
    
    Write-Host "✓ Repository cloned" -ForegroundColor Green
} catch {
    Write-Host "❌ Clone failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔍 Scanning RTK files..." -ForegroundColor Cyan

$files = Get-ChildItem -Path $RtkConfig.ClonePath -Recurse -File -ErrorAction SilentlyContinue | `
    Where-Object { $_.Extension -in @(".md", ".ts", ".js", ".py", ".json", ".txt") }

Write-Host "Found: $($files.Count) files" -ForegroundColor Green

Write-Host ""
Write-Host "💾 Converting to RAM memory format..." -ForegroundColor Cyan

$learningsDir = Join-Path $RtkConfig.MemoryDir "learnings"
if (-not (Test-Path $learningsDir)) {
    New-Item -ItemType Directory -Path $learningsDir -Force | Out-Null
}

$outputFile = Join-Path $learningsDir $RtkConfig.OutputFile
$count = 0

foreach ($file in $files) {
    try {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
        if (-not $content -or $content.Length -gt 1MB) { continue }
        
        $relativePath = $file.FullName.Replace($RtkConfig.ClonePath, "").TrimStart("\")
        
        $entry = @{
            timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
            source = "rtk-token-optimization"
            repo = "rtk-ai/rtk"
            file_name = $file.Name
            file_path = $relativePath
            file_type = $file.Extension
            title = $file.BaseName
            content_length = $content.Length
            content_preview = $content.Substring(0, [Math]::Min(500, $content.Length))
            full_content = $content
            tags = @("rtk", "token-optimization", "efficiency", "ai-research")
            imported_at = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
        } | ConvertTo-Json -Compress
        
        Add-Content -Path $outputFile -Value $entry -Force
        $count++
        
        if ($count % 10 -eq 0) {
            Write-Host "  ✓ Processed $count files..."
        }
    } catch {
        # Skip on error, continue
    }
}

Write-Host "✓ Created $count memory entries" -ForegroundColor Green

Write-Host ""
Write-Host "📋 Creating report..." -ForegroundColor Cyan

$report = @"
# RTK TOKEN OPTIMIZATION KNOWLEDGE BASE

**Date**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Source**: https://github.com/rtk-ai/rtk
**Entries**: $count

## What is RTK?

RTK = Rate Token Keeper - Framework for optimizing token usage in AI systems.

## RAM Learning Goals

RAM will learn:
- ✓ Token optimization techniques
- ✓ Rate limiting strategies
- ✓ Efficiency patterns
- ✓ Cost reduction methods
- ✓ Context window management

## Integration Points

1. **Codex Communication** - RTK patterns for efficient API calls
2. **Memory Management** - Token budgeting in learning pipeline
3. **Query Optimization** - Complexity scoring with token awareness
4. **Fallback Strategy** - Smart token usage decisions

## Weekly Synthesis

Sunday synthesis will:
- Analyze RTK patterns
- Discover token optimization opportunities
- Apply learnings to RAM-Codex loop
- Reduce API costs over time

## Next Steps

1. RAM ศึกษา RTK patterns
2. Identify token-saving opportunities
3. Apply to Codex integration
4. Measure token efficiency improvements

---

**Research by**: RTK AI (github.com/rtk-ai/rtk)
**Imported for**: RAM Token Optimization Learning
**Purpose**: Make RAM smarter about token usage
"@

Set-Content -Path (Join-Path $RtkConfig.MemoryDir "rtk-import-report-$(Get-Date -Format 'yyyyMMdd_HHmmss').md") -Value $report

Write-Host ""
Write-Host "🧹 Cleaning up..." -ForegroundColor Cyan
Remove-Item -Path $RtkConfig.ClonePath -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✓ Cleaned" -ForegroundColor Green

Write-Host ""
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✓ RTK IMPORT COMPLETE                   ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "RAM Token Optimization Knowledge:" -ForegroundColor Cyan
Write-Host "  📚 $count RTK knowledge entries"
Write-Host "  🎯 Token optimization patterns"
Write-Host "  💡 Efficiency strategies"
Write-Host "  📊 Cost reduction techniques"
Write-Host "  ⚡ Context window management"
Write-Host ""
Write-Host "Next: RAM will learn RTK patterns during Sunday synthesis!" -ForegroundColor Green
Write-Host ""
