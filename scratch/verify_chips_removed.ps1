$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/privat' -UseBasicParsing).Content

Write-Host "=== VERIFYING 3 PILLAR CHIPS REMOVED ON LIVE VERCEL ==="
Write-Host "Dinas Pendidikan & B2G chip present:" $res.Contains('Dinas Pendidikan &amp; B2G')
Write-Host "SMA Unggulan & Labschool chip present:" $res.Contains('SMA Unggulan &amp; Labschool')
Write-Host "Mitra Resmi & Terverifikasi chip present:" $res.Contains('Mitra Resmi &amp; Terverifikasi')
