$ErrorActionPreference = "Continue"
$root = "D:\01 Main Work\Boots\Agentic AI\mission-control\arigeo-project"
Set-Location $root
New-Item -ItemType Directory -Force -Path "$root\recovery" | Out-Null

# ===== Pass 1: source maps =====
$maps = Get-ChildItem "$root\.next\server" -Recurse -Filter "*.js.map"
Write-Host "Pass 1: $($maps.Count) map files" -ForegroundColor Cyan

foreach ($mapFile in $maps) {
  try {
    $m = Get-Content $mapFile.FullName -Raw | ConvertFrom-Json
    if (-not $m.sourcesContent) { continue }
    for ($i = 0; $i -lt $m.sources.Count; $i++) {
      $src = $m.sources[$i]
      if ($src -match "(src/.+\.(ts|tsx|css))" -and $src -notmatch "node_modules" -and $m.sourcesContent[$i]) {
        $rel = $Matches[1] -replace "/", "\"
        $out = Join-Path "$root\recovery" $rel
        New-Item -ItemType Directory -Force -Path (Split-Path $out) | Out-Null
        if (-not (Test-Path $out)) {
          $m.sourcesContent[$i] | Set-Content -Encoding UTF8 $out
          Write-Host "  map -> $rel" -ForegroundColor Green
        }
      }
    }
  } catch { Write-Host "  skip $($mapFile.Name): $_" -ForegroundColor Yellow }
}

# ===== Pass 2: carve TSX from webpack pack files =====
# หา marker ของทุกไฟล์ที่รู้ชื่อจาก tsbuildinfo แล้วดึง raw chunk มาไว้ให้ตรวจ
$targets = @(
  "AnimatedGallery", "PurposeSection", "BusinessSection", "QualitySection",
  "SustainabilitySection", "ProductSection", "WhyChooseSection", "NewsSection",
  "ContactSection", "HeroSection", "businessPillars"
)
$packs = Get-ChildItem "$root\.next\cache\webpack" -Recurse -Filter "*.pack"
Write-Host "Pass 2: scanning $($packs.Count) pack files" -ForegroundColor Cyan

foreach ($packFile in $packs) {
  $text = [IO.File]::ReadAllText($packFile.FullName)
  foreach ($t in $targets) {
    $outRaw = "$root\recovery\_pack_$t.txt"
    if (Test-Path $outRaw) { continue }
    # หา pattern ที่บ่งบอกจุดเริ่มไฟล์ TSX
    foreach ($needle in @("function $t", "const $t", "export const $t")) {
      $idx = $text.IndexOf($needle)
      if ($idx -ge 0) {
        $start = [Math]::Max(0, $idx - 2000)
        $len = [Math]::Min(12000, $text.Length - $start)
        $text.Substring($start, $len) | Set-Content -Encoding UTF8 $outRaw
        Write-Host "  pack($($packFile.Name)) -> _pack_$t.txt" -ForegroundColor Green
        break
      }
    }
  }
}

Write-Host ""
Write-Host "=== Inventory ===" -ForegroundColor Cyan
Get-ChildItem "$root\recovery" -Recurse -File |
  Select-Object @{n="File";e={$_.FullName -replace [regex]::Escape("$root\"), ""}}, Length |
  Format-Table -AutoSize
