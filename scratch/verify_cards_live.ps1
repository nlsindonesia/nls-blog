$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/privat' -UseBasicParsing).Content

Write-Host "=== VERIFYING REVISED PRICING CARDS ON LIVE VERCEL ==="
Write-Host "1. Contains 'Paket Exclusive':" $res.Contains('Paket Exclusive')
Write-Host "2. Contains 'Paket Juara':" $res.Contains('Paket Juara')
Write-Host "3. Reguler - Pendampingan siswa Kurikulum Nasional:" $res.Contains('Pendampingan siswa Kurikulum Nasional')
Write-Host "4. Reguler - Persiapan TKA SD, SMP, SMA:" $res.Contains('Persiapan TKA SD, SMP, SMA')
Write-Host "5. Exclusive - Persiapan OSN Tingkat Kota/Provinsi (SD, SMP, SMA):" $res.Contains('Persiapan OSN Tingkat Kota/Provinsi (SD, SMP, SMA)')
Write-Host "6. Exclusive - Pendampingan siswa SD/SMP Kurikulum Internasional:" $res.Contains('Pendampingan siswa SD/SMP Kurikulum Internasional')
Write-Host "7. Exclusive - Persiapan SNBT / Mandiri:" $res.Contains('Persiapan SNBT / Mandiri')
Write-Host "8. Juara - Persiapan OSN Tingkat Semifinal/Final (SD, SMP, SMA):" $res.Contains('Persiapan OSN Tingkat Semifinal/Final (SD, SMP, SMA)')
Write-Host "9. Juara - Pendampingan siswa SMA Kurikulum Internasional:" $res.Contains('Pendampingan siswa SMA Kurikulum Internasional')
Write-Host "10. Juara - Persiapan Kompetisi Internasional seperti AMO, SEAMO dan sebagainya:" $res.Contains('Persiapan Kompetisi Internasional seperti AMO, SEAMO dan sebagainya')
