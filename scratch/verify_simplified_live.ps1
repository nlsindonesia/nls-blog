$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/privat' -UseBasicParsing).Content

Write-Host "=== VERIFYING SIMPLIFIED PROGRAM AKADEMIK ON LIVE VERCEL ==="
Write-Host "1. Simplified 4-pillar badge present:" $res.Contains('4 Pilar Fokus Bimbingan')
Write-Host "2. OSN & Olimpiade Global card present:" $res.Contains('OSN &amp; Olimpiade Global')
Write-Host "3. UTBK-SNBT & Ujian Mandiri card present:" $res.Contains('UTBK-SNBT &amp; Ujian Mandiri')
Write-Host "4. TKA SD, SMP & SMA card present:" $res.Contains('TKA SD, SMP &amp; SMA')
