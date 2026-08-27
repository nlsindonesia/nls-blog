$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content

Write-Host "=== VERIFYING SUBMENU ACTIVE CONCEPT ON LIVE VERCEL ==="
Write-Host "1. .submenu-btn-active class present:" $adminRes.Contains('.submenu-btn-active')
Write-Host "2. .submenu-btn-inactive class present:" $adminRes.Contains('.submenu-btn-inactive')
Write-Host "3. Submenu 1 uses submenu-btn-active:" $adminRes.Contains("activeTab === 'kalender' && kalenderView === 'create' ? 'submenu-btn-active' : 'submenu-btn-inactive'")
Write-Host "4. Submenu 2 uses submenu-btn-active:" $adminRes.Contains("activeTab === 'kalender' && kalenderView === 'present' ? 'submenu-btn-active' : 'submenu-btn-inactive'")
Write-Host "5. Glowing dot indicator present:" $adminRes.Contains('ring-4 ring-sky-200')
