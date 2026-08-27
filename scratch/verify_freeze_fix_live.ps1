$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content

Write-Host "=== VERIFYING FREEZE FIX ON LIVE VERCEL ==="
Write-Host "1. Valid activeTab === 'kalender' present:" $adminRes.Contains("activeTab === 'kalender'")
Write-Host "2. Valid kalenderView === 'create' present:" $adminRes.Contains("kalenderView === 'create'")
Write-Host "3. Valid kalenderView === 'present' present:" $adminRes.Contains("kalenderView === 'present'")
Write-Host "4. No double single quotes:" (-not $adminRes.Contains("''kalender''"))
Write-Host "5. getPreviewHighlights() template present:" $adminRes.Contains('getPreviewHighlights()')
