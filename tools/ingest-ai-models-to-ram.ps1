# ingest-ai-models-to-ram.ps1 - Import AI Models Knowledge into RAM
# Ingest compact AI models research into RAM's learning system

param(
    [string]$KnowledgeFile = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\jarvis-staging\ai-models-compact-knowledge.json",
    [string]$MemoryDir = "D:\01 Main Work\Boots\Agentic AI\mission-control\tools\memory",
    [switch]$DryRun = $false,
    [switch]$Verbose = $true
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$ModelConfig = @{
    KnowledgeFile = $KnowledgeFile
    MemoryDir = $MemoryDir
    OutputFile = "ai-models-research-$(Get-Date -Format 'yyyyMMdd_HHmmss').jsonl"
    ImportLogFile = "ai-models-ingest-$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
}

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logLine = "[$timestamp] [$Level] $Message"
    Write-Host $logLine -ForegroundColor $(
        switch ($Level) {
            "INFO" { "Cyan" }
            "SUCCESS" { "Green" }
            "WARNING" { "Yellow" }
            "ERROR" { "Red" }
            default { "Gray" }
        }
    )
}

function Convert-ModelsToMemory {
    param([object]$Knowledge)

    Write-Log "Converting models to memory entries..." "INFO"

    $entries = @()

    # Create entry for overall knowledge
    $mainEntry = @{
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
        source = "ai-models-research"
        type = "knowledge-base"
        title = $Knowledge.title
        version = $Knowledge.version
        content_preview = $Knowledge.description
        full_content = $Knowledge | ConvertTo-Json -Depth 10
        tags = @("ai-models", "research", "llm", "efficiency", "knowledge-base")
        models_count = $Knowledge.models.Count
        imported_at = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
    }
    $entries += $mainEntry

    # Create individual entries for each model
    foreach ($model in $Knowledge.models) {
        $modelEntry = @{
            timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
            source = "ai-models-research"
            type = "model-profile"
            model_name = $model.name
            provider = $model.provider
            parameters = $model.parameters
            performance = $model.performance
            strengths = $model.strengths -join ", "
            use_cases = $model.use_cases -join ", "
            efficiency = $model.efficiency
            local_run = $model.local_run
            notes = $model.notes
            full_content = $model | ConvertTo-Json -Depth 5
            tags = @("ai-model", $model.provider.ToLower(), "compact", "research")
            imported_at = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
        }
        $entries += $modelEntry
    }

    Write-Log "Created $($entries.Count) memory entries" "SUCCESS"
    return $entries
}

function Save-MemoryToJSONL {
    param([array]$Entries, [string]$OutputPath)

    Write-Log "Writing to JSONL..." "INFO"
    $outputFile = Join-Path $OutputPath $ModelConfig.OutputFile

    foreach ($entry in $Entries) {
        $json = $entry | ConvertTo-Json -Compress
        Add-Content -Path $outputFile -Value $json -Force
    }

    Write-Log "Saved to: $outputFile" "SUCCESS"
    return $outputFile
}

function New-ImportReport {
    param([object]$Knowledge, [int]$EntryCount, [string]$OutputFile)

    $reportContent = @"
# AI MODELS RESEARCH IMPORT REPORT

**Date**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Knowledge Base**: $($Knowledge.title)
**Version**: $($Knowledge.version)
**Output**: $OutputFile

## Summary

- Models documented: $($Knowledge.models.Count)
- Memory entries created: $EntryCount
- Research quality: Comprehensive comparison across 8 major models

## Models Covered

"@

    foreach ($model in $Knowledge.models) {
        $reportContent += "- **$($model.name)** ($($model.provider), $($model.parameters)) — $($model.performance)`n"
    }

    $reportContent += @"

## Key Findings

### Best Overall: $($Knowledge.comparison_summary.best_overall)
### Best Tiny: $($Knowledge.comparison_summary.best_tiny)
### Best Edge: $($Knowledge.comparison_summary.best_edge_device)
### Best Coding: $($Knowledge.comparison_summary.best_for_coding)

## Insights for RAM

$($Knowledge.key_insights | ForEach-Object { "- $_`n" })

## Recommendations for RAM

$($Knowledge.recommendations_for_ram.integration)

### Suggested Models (in priority order):
$($Knowledge.recommendations_for_ram.recommended | ForEach-Object { "- $_`n" })

## What This Means

RAM now understands:
✓ Small but powerful models exist (Phi, Qwen, Llama 3.2)
✓ 3.8B-7B is the sweet spot for local deployment
✓ Efficiency vs capability tradeoff (can now explain to khun-ram)
✓ When to use which model for which task
✓ How to optimize deployments

## Next Phase: Research Skill

RAM can now:
1. Tell khun-ram which model fits the need
2. Explain efficiency tradeoffs
3. Recommend deployment strategies
4. Suggest optimization techniques

Later: RAM will gain ability to research other topics independently.

## Integration

This knowledge is now in: tools/memory/learnings/$($OutputFile)
Weekly synthesis will incorporate these insights into RAM's understanding.

---

**Research by**: AI Model Knowledge Base 2026-06-30
**Imported for**: RAM Oracle Learning System
**Purpose**: Expand RAM's understanding of modern efficient AI models
"@

    return $reportContent
}

# ============================================================================
# MAIN INGEST
# ============================================================================

function Invoke-ModelsIngest {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Magenta
    Write-Host "║  AI MODELS RESEARCH → RAM LEARNING       ║" -ForegroundColor Magenta
    Write-Host "║  Importing Knowledge of Efficient Models  ║" -ForegroundColor Magenta
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Magenta
    Write-Host ""

    # Check file exists
    if (-not (Test-Path $ModelConfig.KnowledgeFile)) {
        Write-Log "❌ Knowledge file not found: $($ModelConfig.KnowledgeFile)" "ERROR"
        return $false
    }

    Write-Log "✓ Knowledge file found" "SUCCESS"
    Write-Host ""

    # Read and parse JSON
    Write-Log "Reading knowledge file..." "INFO"
    try {
        $knowledge = Get-Content -Path $ModelConfig.KnowledgeFile -Raw | ConvertFrom-Json
        Write-Log "✓ Parsed: $($knowledge.title)" "SUCCESS"
    } catch {
        Write-Log "❌ Failed to parse JSON: $_" "ERROR"
        return $false
    }

    Write-Host ""

    # Convert to memory entries
    $entries = Convert-ModelsToMemory -Knowledge $knowledge

    # Create learnings directory
    $learningsDir = Join-Path $ModelConfig.MemoryDir "learnings"
    if (-not (Test-Path $learningsDir)) {
        New-Item -ItemType Directory -Path $learningsDir -Force | Out-Null
    }

    Write-Host ""

    # Save to JSONL
    if (-not $DryRun) {
        $outputFile = Save-MemoryToJSONL -Entries $entries -OutputPath $learningsDir

        # Create report
        $report = New-ImportReport -Knowledge $knowledge -EntryCount $entries.Count -OutputFile $outputFile
        $reportPath = Join-Path $ModelConfig.MemoryDir $ModelConfig.ImportLogFile
        Set-Content -Path $reportPath -Value $report -Force

        Write-Host ""
        Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Green
        Write-Host "║  ✓ AI MODELS IMPORT COMPLETE             ║" -ForegroundColor Green
        Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Green
        Write-Host ""
        Write-Host "RAM now understands:" -ForegroundColor Cyan
        Write-Host "  🤖 $($knowledge.models.Count) efficient AI models"
        Write-Host "  📊 Capability vs efficiency tradeoffs"
        Write-Host "  🎯 Which model for which task"
        Write-Host "  ⚡ Performance characteristics"
        Write-Host "  💾 Memory & resource requirements"
        Write-Host ""
        Write-Host "Models covered:" -ForegroundColor Cyan
        $knowledge.models | ForEach-Object {
            Write-Host "  • $($_.name) ($($_.parameters)) — $($_.provider)"
        }
        Write-Host ""
        Write-Host "Next: Try asking RAM about AI models!" -ForegroundColor Green
        Write-Host "  .\RAM_CHAT.ps1"
        Write-Host "  ราม: มี AI model เล็กแต่เก่งไหม"
        Write-Host ""

        return $true
    } else {
        Write-Log "[DRY-RUN] Would import $($entries.Count) entries" "INFO"
        return $false
    }
}

# ============================================================================
# MAIN ENTRY
# ============================================================================

$ErrorActionPreference = "Continue"

try {
    Invoke-ModelsIngest
} catch {
    Write-Log "ERROR: $($_.Exception.Message)" "ERROR"
    exit 1
}
