$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content

Write-Host "=== VERIFYING CKEDITOR WARNING REMOVAL ON LIVE VERCEL ==="
Write-Host "1. CSS cke_notification suppression present:" $adminRes.Contains('.cke_notification_warning')
Write-Host "2. CKEDITOR.config.versionCheck = false present:" $adminRes.Contains('CKEDITOR.config.versionCheck = false')
Write-Host "3. notificationShow event cancel present:" $adminRes.Contains('ev.cancel()')
