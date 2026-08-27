$snbt = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/images/blog/cover-snbt-2027.jpg' -Method Head).StatusCode
$osn = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/images/blog/cover-osn-silabus.jpg' -Method Head).StatusCode
$jurusan = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/images/blog/cover-jurusan-kuliah.jpg' -Method Head).StatusCode

Write-Host "SNBT Cover HTTP Status:" $snbt
Write-Host "OSN Cover HTTP Status:" $osn
Write-Host "Jurusan Cover HTTP Status:" $jurusan
