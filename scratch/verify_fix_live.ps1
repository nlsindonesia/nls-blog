$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/kalender' -UseBasicParsing).Content

Write-Host "=== VERIFYING FIX ON LIVE VERCEL ==="
Write-Host "1. .cal-side-dashboard CSS class present:" $res.Contains('.cal-side-dashboard')
Write-Host "2. cal-col-left and cal-col-right present:" ($res.Contains('cal-col-left') -and $res.Contains('cal-col-right'))
Write-Host "3. Clean text in options:" $res.Contains('Semua Jenis Kegiatan (OSN, SNBT, TKA, Mitra, Dinas)')
Write-Host "4. Clean bullet symbol:" $res.Contains('&bull;')
