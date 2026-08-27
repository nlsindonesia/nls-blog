$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content

Write-Host "=== VERIFYING SIDEBAR FULL LEFT ON LIVE VERCEL ==="
Write-Host "1. Full width sidebar class 288px present:" $adminRes.Contains('min-width: 288px')
Write-Host "2. Dashboard full width flex container present:" $adminRes.Contains('w-full min-h-screen h-screen flex')
Write-Host "3. Desktop sticky 100vh docking present:" $adminRes.Contains('max-height: 100vh')
