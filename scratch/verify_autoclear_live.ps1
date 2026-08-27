$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content

Write-Host "=== VERIFYING AUTO-CLEAR PLACEHOLDER ON LIVE VERCEL ==="
Write-Host "1. clearPlaceholderIfPresent function present:" $adminRes.Contains('clearPlaceholderIfPresent')
Write-Host "2. Focus listener present on inst:" $adminRes.Contains('inst.on(''focus'', clearPlaceholderIfPresent)')
Write-Host "3. Click listener attached on editable:" $adminRes.Contains('editable.attachListener(editable, ''click'', clearPlaceholderIfPresent)')
