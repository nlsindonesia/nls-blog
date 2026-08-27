$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/kalender' -UseBasicParsing).Content

Write-Host "=== VERIFYING KALENDER RENDERING ON LIVE VERCEL ==="
Write-Host "1. getCategoryDotClass method present:" $res.Contains('getCategoryDotClass(cat)')
Write-Host "2. getPillClass method present:" $res.Contains('getPillClass(cat)')
Write-Host "3. Sunday cell class present:" $res.Contains('cal-cell.sunday')
Write-Host "4. Today cell class present:" $res.Contains('cal-cell.today')
Write-Host "5. Sunday header present:" $res.Contains('cal-day-header sunday')
