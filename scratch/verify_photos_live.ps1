$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/privat' -UseBasicParsing).Content

Write-Host "=== VERIFYING PHOTO CARDS ON LIVE VERCEL ==="
Write-Host "1. fokus-osn.jpg present:" $res.Contains('/images/privat/fokus-osn.jpg')
Write-Host "2. fokus-snbt.jpg present:" $res.Contains('/images/privat/fokus-snbt.jpg')
Write-Host "3. fokus-tka.jpg present:" $res.Contains('/images/privat/fokus-tka.jpg')
Write-Host "4. fokus-internasional.jpg present:" $res.Contains('/images/privat/fokus-internasional.jpg')
