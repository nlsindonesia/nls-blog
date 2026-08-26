$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/kalender' -UseBasicParsing).Content

Write-Host "=== VERIFYING SUNDAY & TODAY COLORS ON LIVE VERCEL ==="
Write-Host "1. Sunday header CSS present:" $res.Contains('.cal-day-header.sunday')
Write-Host "2. Sunday cell CSS present:" $res.Contains('.cal-cell.sunday')
Write-Host "3. Today cell distinctive glow CSS present:" $res.Contains('rgba(2, 132, 199, 0.28)')
Write-Host "4. Sunday Header HTML class present:" $res.Contains('cal-day-header sunday')
