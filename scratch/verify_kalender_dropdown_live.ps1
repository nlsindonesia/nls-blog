$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content

Write-Host "=== VERIFYING KALENDER DROPDOWN & BUILDER ON LIVE VERCEL ==="
Write-Host "1. Dropdown toggle button present:" $adminRes.Contains('toggleKalenderDropdown()')
Write-Host "2. Create Event submenu item present:" $adminRes.Contains('openCreateEventView()')
Write-Host "3. Present Event submenu item present:" $adminRes.Contains('openPresentEventView()')
Write-Host "4. Create Event Builder View present:" $adminRes.Contains('VIEW 1: CREATE / EDIT EVENT BUILDER VIEW')
Write-Host "5. Present Event List View present:" $adminRes.Contains('VIEW 2: PRESENT EVENT')
Write-Host "6. Realtime Live Card Preview present:" $adminRes.Contains('Live Card Preview (/kalender)')
