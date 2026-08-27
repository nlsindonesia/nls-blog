$blogRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/blog' -UseBasicParsing).Content

Write-Host "=== VERIFYING PROPER CUSTOM DROPDOWN ON LIVE VERCEL ==="
Write-Host "1. Custom trigger button present:" $blogRes.Contains('@click="isCatMenuOpen = !isCatMenuOpen"')
Write-Host "2. Dedicated icon badge container present:" $blogRes.Contains('w-7 h-7 rounded-xl bg-sky-100')
Write-Host "3. Flyout menu list present:" $blogRes.Contains('x-show="isCatMenuOpen"')
Write-Host "4. Checkmark indicators present:" $blogRes.Contains('x-show="selectedCategory === cat"')
Write-Host "5. No native select overlapping issue:" (-not $blogRes.Contains('<select x-model="selectedCategory"'))
