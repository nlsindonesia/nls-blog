$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/privat' -UseBasicParsing).Content

Write-Host "=== VERIFYING LIVE SECTIONS ON VERCEL ==="
Write-Host "1. Pricing section present:" $res.Contains('id="paket"')
Write-Host "2. Testimoni Siswa present:" $res.Contains('Apa Kata Mereka?')
Write-Host "3. FAQ present:" $res.Contains('Pertanyaan Umum (Q&A)')
Write-Host "4. CTA present:" $res.Contains('Siap untuk Melejitkan Akademikmu?')
Write-Host "5. Footer present:" $res.Contains('<footer id="kontak"')
Write-Host "6. Modal present:" $res.Contains('id="paketPrivatModalContainer"')
Write-Host "7. Floating Button present:" $res.Contains('Daftar Program')
Write-Host "8. Curved Pill Reguler:" $res.Contains('border-radius: 9999px')
