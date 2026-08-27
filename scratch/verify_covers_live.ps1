$articlesJs = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/blog/default-articles.js' -UseBasicParsing).Content
$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content

Write-Host "=== VERIFYING NEW ARTICLE COVERS ON LIVE VERCEL ==="
Write-Host "1. cover-snbt-2027.jpg present in dataset:" $articlesJs.Contains('cover-snbt-2027.jpg')
Write-Host "2. cover-osn-silabus.jpg present in dataset:" $articlesJs.Contains('cover-osn-silabus.jpg')
Write-Host "3. cover-jurusan-kuliah.jpg present in dataset:" $articlesJs.Contains('cover-jurusan-kuliah.jpg')
Write-Host "4. Cover migration mapping in nlsadmin:" $adminRes.Contains('defaultCovers')
