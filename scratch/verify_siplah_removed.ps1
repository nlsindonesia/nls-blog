$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/privat' -UseBasicParsing).Content

Write-Host "=== VERIFYING SIPLAH CARD REMOVED ON LIVE VERCEL ==="
Write-Host "SIPLaH Kemendikbud card present on /privat:" $res.Contains('Terdaftar Resmi di SIPLaH Kemendikbudristek')
