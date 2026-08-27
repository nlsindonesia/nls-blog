$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content

Write-Host "=== VERIFYING CKEDITOR FULL SUITE ON LIVE VERCEL ==="
Write-Host "1. CKEditor 4 full-all CDN loaded:" $adminRes.Contains('https://cdn.ckeditor.com/4.22.1/full-all/ckeditor.js')
Write-Host "2. Extra plugins configured (font, colorbutton, justify, tabletools):" $adminRes.Contains('extraPlugins: ''font,colorbutton,justify,table,tabletools,tableresize,autolink''')
Write-Host "3. Font families & sizes defined:" $adminRes.Contains('fontSize_sizes:')
Write-Host "4. Real-time multi-event dynamic sync handler active:" $adminRes.Contains('inst.on(''selectionChange'', syncHandler)')
Write-Host "5. Direct CKEditor instance getData in syncEditorContent:" $adminRes.Contains('CKEDITOR.instances[''editorArea''].getData()')
