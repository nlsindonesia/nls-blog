$blogRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/blog' -UseBasicParsing).Content
$homeRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/' -UseBasicParsing).Content

Write-Host "=== VERIFYING BLOG IMAGE SYNCHRONIZATION ON LIVE VERCEL ==="
Write-Host "1. /blog has cover-snbt-2027.jpg mapping:" $blogRes.Contains('cover-snbt-2027.jpg')
Write-Host "2. /blog has cover-osn-silabus.jpg mapping:" $blogRes.Contains('cover-osn-silabus.jpg')
Write-Host "3. /blog has cover-jurusan-kuliah.jpg mapping:" $blogRes.Contains('cover-jurusan-kuliah.jpg')
Write-Host "4. Homepage has cover-snbt-2027.jpg mapping:" $homeRes.Contains('cover-snbt-2027.jpg')
Write-Host "5. Homepage has cover-osn-silabus.jpg mapping:" $homeRes.Contains('cover-osn-silabus.jpg')
Write-Host "6. Homepage has cover-jurusan-kuliah.jpg mapping:" $homeRes.Contains('cover-jurusan-kuliah.jpg')
