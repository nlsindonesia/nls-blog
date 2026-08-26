$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/privat' -UseBasicParsing).Content

Write-Host "=== VERIFYING ADJUSTED KEMITRAAN ON LIVE VERCEL ==="
Write-Host "1. icon-mdi-office-building present:" $res.Contains('icon-[mdi--office-building]')
Write-Host "2. icon-mdi-school present:" $res.Contains('icon-[mdi--school]')
Write-Host "3. icon-mdi-shield-check present:" $res.Contains('icon-[mdi--shield-check]')
Write-Host "4. Subtitle customized for privat present:" $res.Contains('Siswa les privat Next Level Study berasal dari berbagai sekolah unggulan')
