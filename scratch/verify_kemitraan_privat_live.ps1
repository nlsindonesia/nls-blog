$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/privat' -UseBasicParsing).Content

Write-Host "=== VERIFYING JARINGAN KEMITRAAN ON /privat LIVE VERCEL ==="
Write-Host "1. Title present:" $res.Contains('Jaringan Kemitraan Resmi &amp; Prestisius')
Write-Host "2. 100+ Sekolah Unggulan present:" $res.Contains('100+ Sekolah Unggulan')
Write-Host "3. SIPLaH Kemendikbud card present:" $res.Contains('Terdaftar Resmi di SIPLaH Kemendikbudristek')
Write-Host "4. Section order check (Kemitraan before Paket):" ($res.IndexOf('Jaringan Kemitraan Resmi') -lt $res.IndexOf('Pilihan Paket Les Privat NLS'))
