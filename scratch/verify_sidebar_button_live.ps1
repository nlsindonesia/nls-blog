$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content

Write-Host "=== VERIFYING SIDEBAR BUTTON ON LIVE VERCEL ==="
Write-Host "1. .sidebar-expanded class present:" $adminRes.Contains('.sidebar-expanded')
Write-Host "2. .sidebar-collapsed class present:" $adminRes.Contains('.sidebar-collapsed')
Write-Host "3. Aside uses sidebar-expanded / sidebar-collapsed:" $adminRes.Contains("isSidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'")
Write-Host "4. Hide button present with click handler:" $adminRes.Contains('@click="isSidebarOpen = false"')
