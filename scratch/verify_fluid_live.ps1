$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/privat' -UseBasicParsing).Content

Write-Host "=== VERIFYING FLUID SUBJECT EXPLORER ON LIVE VERCEL ==="
Write-Host "1. Active subjek reactive state present:" $res.Contains('activeSubjek: \x27matematika\x27') -or $res.Contains("activeSubjek: 'matematika'")
Write-Host "2. Pill buttons present:" $res.Contains('Pilih &amp; Konsultasi Subjek Ini')
Write-Host "3. Topic spotlight present:" $res.Contains('Topik &amp; Materi Spesifik')
