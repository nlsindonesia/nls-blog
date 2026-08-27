$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content

Write-Host "=== VERIFYING CKEDITOR 4 FULL SUITE ON LIVE VERCEL ==="
Write-Host "1. CKEditor 4 Full-All CDN script included:" $adminRes.Contains('ckeditor.com/4.22.1/full-all/ckeditor.js')
Write-Host "2. Textarea with id='editorArea' present:" $adminRes.Contains('<textarea id="editorArea"')
Write-Host "3. CKEDITOR.replace call present:" $adminRes.Contains("CKEDITOR.replace('editorArea'")
Write-Host "4. Full toolbar array configured with Styles & Format:" ($adminRes.Contains('Styles') -and $adminRes.Contains('Format') -and $adminRes.Contains('Font') -and $adminRes.Contains('FontSize'))
Write-Host "5. Justify buttons configured:" ($adminRes.Contains('JustifyLeft') -and $adminRes.Contains('JustifyCenter') -and $adminRes.Contains('JustifyRight'))
