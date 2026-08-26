$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/privat' -UseBasicParsing).Content

Write-Host "=== VERIFYING DAFTAR PRIVAT ON LIVE VERCEL ==="
Write-Host "1. Floating button 'Daftar Privat' present:" $res.Contains('Daftar Privat')
