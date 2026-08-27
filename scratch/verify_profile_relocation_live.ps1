$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content

Write-Host "=== VERIFYING PROFILE RELOCATION ON LIVE VERCEL ==="
Write-Host "1. Header contains nlsindonesia profile badge:" $adminRes.Contains('nlsindonesia')
Write-Host "2. Header contains logout button next to Lihat Web:" ($adminRes.Contains('Lihat Web') -and $adminRes.Contains('@click="logout()"'))
Write-Host "3. Sidebar bottom no longer contains old profile footer:" (-not $adminRes.Contains('<!-- Bottom: User Profile & Logout -->'))
