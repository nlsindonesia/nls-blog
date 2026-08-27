$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content

Write-Host "=== VERIFYING ARTICLE EDITOR & SIDEBAR FIX ON LIVE VERCEL ==="
Write-Host "1. .art-editor-container present:" $adminRes.Contains('.art-editor-container')
Write-Host "2. .art-meta-row present:" $adminRes.Contains('.art-meta-row')
Write-Host "3. Fixed grid in editor present:" $adminRes.Contains('<div class="art-editor-container">')
Write-Host "4. Sidebar icon style updated:" $adminRes.Contains('bg-slate-100 dark:bg-slate-800 text-slate-600')
