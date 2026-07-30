$root = "D:\01 Main Work\Boots\Agentic AI\mission-control\arigeo-project"
$packs = Get-ChildItem "$root\.next\cache\webpack" -Recurse -Filter "*.pack"

# needle เจาะจงต่อไฟล์ที่ยังขาด
$searches = @(
  @{ name = "Header";      needles = @("function Header", "const Header", "useTranslations(`"Header", "useTranslations('Header") },
  @{ name = "Footer";      needles = @("function Footer", "const Footer") },
  @{ name = "Hero";        needles = @("function Hero(", "const Hero =") },
  @{ name = "layout";      needles = @("generateStaticParams", "NextIntlClientProvider") },
  @{ name = "page";        needles = @("export default function", "HomePage", "IndexPage") },
  @{ name = "request";     needles = @("getRequestConfig") },
  @{ name = "globals_css"; needles = @("@tailwind base", "tailwind base") }
)

foreach ($packFile in $packs) {
  $text = [IO.File]::ReadAllText($packFile.FullName)
  foreach ($s in $searches) {
    $out = "$root\recovery\_pack_$($s.name).txt"
    if (Test-Path $out) { continue }
    foreach ($n in $s.needles) {
      $idx = $text.IndexOf($n)
      if ($idx -ge 0) {
        $start = [Math]::Max(0, $idx - 3000)
        $len = [Math]::Min(15000, $text.Length - $start)
        $text.Substring($start, $len) | Set-Content -Encoding UTF8 $out
        Write-Host "pack($($packFile.Name)) [$n] -> _pack_$($s.name).txt" -ForegroundColor Green
        break
      }
    }
  }
}
Get-ChildItem "$root\recovery" -Filter "_pack_*" | Select-Object Name, Length
