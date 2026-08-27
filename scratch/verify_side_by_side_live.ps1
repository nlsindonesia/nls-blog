$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/kalender' -UseBasicParsing).Content

Write-Host "=== VERIFYING FULL-COLOR SIDE-BY-SIDE ON LIVE VERCEL ==="
Write-Host "1. Grid 12 cols side-by-side present:" $res.Contains('grid-cols-1 lg:grid-cols-12')
Write-Host "2. Right column detail panel present:" $res.Contains('calendar-detail-card')
Write-Host "3. Full-color day headers (senin, selasa, rabu) present:" $res.Contains('cal-day-header senin')
Write-Host "4. Container-wide max-w-1440 present:" $res.Contains('cal-container-wide')
