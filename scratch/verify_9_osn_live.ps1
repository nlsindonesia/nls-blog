$articlesJs = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/blog/default-articles.js' -UseBasicParsing).Content

Write-Host "=== VERIFYING 9 OSN ARTICLES ON LIVE VERCEL ==="
Write-Host "1. Matematika article:" $articlesJs.Contains('art-osn-matematika')
Write-Host "2. Fisika article:" $articlesJs.Contains('art-osn-fisika')
Write-Host "3. Kimia article:" $articlesJs.Contains('art-osn-kimia')
Write-Host "4. Biologi article:" $articlesJs.Contains('art-osn-biologi')
Write-Host "5. Informatika article:" $articlesJs.Contains('art-osn-informatika')
Write-Host "6. Astronomi article:" $articlesJs.Contains('art-osn-astronomi')
Write-Host "7. Kebumian article:" $articlesJs.Contains('art-osn-kebumian')
Write-Host "8. Ekonomi article:" $articlesJs.Contains('art-osn-ekonomi')
Write-Host "9. Geografi article:" $articlesJs.Contains('art-osn-geografi')
Write-Host "10. All 9 cover image paths present:" (
    $articlesJs.Contains('cover-osn-matematika.jpg') -and
    $articlesJs.Contains('cover-osn-fisika.jpg') -and
    $articlesJs.Contains('cover-osn-kimia.jpg') -and
    $articlesJs.Contains('cover-osn-biologi.jpg') -and
    $articlesJs.Contains('cover-osn-informatika.jpg') -and
    $articlesJs.Contains('cover-osn-astronomi.jpg') -and
    $articlesJs.Contains('cover-osn-kebumian.jpg') -and
    $articlesJs.Contains('cover-osn-ekonomi.jpg') -and
    $articlesJs.Contains('cover-osn-geografi.jpg')
)
