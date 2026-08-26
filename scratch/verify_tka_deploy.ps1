$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/tka' -UseBasicParsing).Content
Write-Host "Contains Pusmendik Kemendikdasmen:" $res.Contains('Pusmendik Kemendikdasmen')
Write-Host "Contains pusmendik.kemendikdasmen.go.id/tka:" $res.Contains('pusmendik.kemendikdasmen.go.id/tka')
Write-Host "Contains Mata Pelajaran Wajib:" $res.Contains('Mata Pelajaran Wajib')
Write-Host "Contains Mata Pelajaran Pilihan:" $res.Contains('Mata Pelajaran Pilihan')
