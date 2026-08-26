$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/privat' -UseBasicParsing).Content

Write-Host "=== VERIFYING PILIHAN SUBJEK PRIVAT ON LIVE VERCEL ==="
Write-Host "1. Subjek title present:" $res.Contains('Pilihan Subjek Les Privat')
Write-Host "2. Matematika topic chips present:" $res.Contains('Aljabar &amp; Geometri')
Write-Host "3. Sains topic chips present:" $res.Contains('Fisika &amp; Astronomi')
Write-Host "4. Informatika topic chips present:" $res.Contains('OSN Informatika')
Write-Host "5. Humaniora topic chips present:" $res.Contains('Ekonomi &amp; Akuntansi')
