$root = "D:\01 Main Work\Boots\Agentic AI\mission-control\arigeo-project"
$skip = "node_modules|\.next|\.vercel|recovery|_claude-draft-components|arigeo-web-draft|\.git"

$files = Get-ChildItem $root -Recurse -File | Where-Object { $_.FullName -notmatch $skip }
$fixed = 0

foreach ($f in $files) {
  # อ่านหัวไฟล์เช็คว่าเป็น envelope ไหม
  $head = [IO.File]::ReadAllText($f.FullName, [Text.Encoding]::UTF8)
  if ($head -notmatch '^\s*\{"data":"') { continue }

  try {
    $obj = $head | ConvertFrom-Json
    $bytes = [Convert]::FromBase64String($obj.data)
    [IO.File]::WriteAllBytes($f.FullName, $bytes)
    $fixed++
    Write-Host "decoded: $($f.FullName -replace [regex]::Escape("$root\"), '')" -ForegroundColor Green
  } catch {
    Write-Host "FAILED : $($f.Name) - $_" -ForegroundColor Red
  }
}

Write-Host ""
Write-Host "Decoded $fixed files" -ForegroundColor Cyan

# ตรวจผล: ไฟล์สำคัญต้องอ่านรู้เรื่อง
Write-Host "`n--- package.json ---" -ForegroundColor Cyan
Get-Content "$root\package.json" -TotalCount 8
Write-Host "`n--- next.config.mjs ---" -ForegroundColor Cyan
Get-Content "$root\next.config.mjs"
