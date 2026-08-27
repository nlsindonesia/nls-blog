$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content

Write-Host "=== VERIFYING INDEPENDENT SCROLL LOCK ON LIVE VERCEL ==="
Write-Host "1. html, body overflow: hidden present:" $adminRes.Contains('overflow: hidden')
Write-Host "2. html, body height: 100dvh present:" $adminRes.Contains('height: 100dvh')
Write-Host "3. Dashboard h-full flex overflow-hidden present:" $adminRes.Contains('w-full h-full h-screen h-[100dvh] flex')
Write-Host "4. Main content isolated overflow-y-auto present:" $adminRes.Contains('main class="flex-1 overflow-y-auto admin-scrollbar')
