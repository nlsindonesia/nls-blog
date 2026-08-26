$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/privat' -UseBasicParsing).Content

Write-Host "=== VERIFYING BULLETPROOF LOGOS ON LIVE VERCEL ==="
Write-Host "1. partner-logo-grid class present:" $res.Contains('partner-logo-grid')
Write-Host "2. partner-logo-item class present:" $res.Contains('partner-logo-item')
Write-Host "3. Inline style constraint present on img:" $res.Contains('max-height: 32px !important')
Write-Host "4. Chips flexbox styling present:" $res.Contains('flex: 1 1 240px; max-width: 280px;')
