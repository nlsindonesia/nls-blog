$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/privat' -UseBasicParsing).Content

Write-Host "=== VERIFYING FIXED ICONS & COMPACT LOGOS ON LIVE VERCEL ==="
Write-Host "1. Iconify mdi-bank present:" $res.Contains('icon-[mdi--bank]')
Write-Host "2. Iconify mdi-school present:" $res.Contains('icon-[mdi--school]')
Write-Host "3. Iconify mdi-check-decagram present:" $res.Contains('icon-[mdi--check-decagram]')
Write-Host "4. Compact logo sizing (max-h-8) present:" $res.Contains('max-h-8')
