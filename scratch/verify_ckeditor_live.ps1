$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content

Write-Host "=== VERIFYING CKEDITOR 5 ON LIVE VERCEL ==="
Write-Host "1. CKEditor 5 CDN script included:" $adminRes.Contains('ckeditor5/41.3.1/classic/ckeditor.js')
Write-Host "2. CKEditor wrapper container present:" $adminRes.Contains('ckeditor-wrapper')
Write-Host "3. initCKEditor method present in Alpine:" $adminRes.Contains('initCKEditor()')
Write-Host "4. ClassicEditor.create call configured:" $adminRes.Contains('ClassicEditor.create')
Write-Host "5. CKEditor custom styling present:" $adminRes.Contains('CKEDITOR 5 FULL TOOLBAR STYLING')
