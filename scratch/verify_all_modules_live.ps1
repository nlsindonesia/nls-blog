$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content

Write-Host "=== VERIFYING ALL DROPDOWNS ON LIVE VERCEL ==="
Write-Host "1. Kalender Dropdown (Create Event & Present Event):" ($adminRes.Contains('Create Event') -and $adminRes.Contains('Present Event'))
Write-Host "2. Berita Dropdown (Create News & Present News):" ($adminRes.Contains('Create News') -and $adminRes.Contains('Present News'))
Write-Host "3. Pengajar Dropdown (Add Teacher & Present Teacher):" ($adminRes.Contains('Add Teacher') -and $adminRes.Contains('Present Teacher'))
Write-Host "4. Submenu CSS Classes Present:" ($adminRes.Contains('.submenu-btn-active') -and $adminRes.Contains('.submenu-berita-active') -and $adminRes.Contains('.submenu-pengajar-active'))
Write-Host "5. No double single-quotes:" (-not $adminRes.Contains("''present''"))
