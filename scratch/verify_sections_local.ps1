$c = [System.IO.File]::ReadAllText("privat/index.html", [System.Text.Encoding]::UTF8)

Write-Host "=== VERIFYING ALL SECTIONS IN privat/index.html ==="
Write-Host "1. Pricing section present:" $c.Contains('id="paket"')
Write-Host "2. Testimoni Siswa present:" $c.Contains('Apa Kata Mereka?')
Write-Host "3. FAQ present:" $c.Contains('Pertanyaan Umum (Q&A)')
Write-Host "4. CTA present:" $c.Contains('Siap untuk Melejitkan Akademikmu?')
Write-Host "5. Footer present:" $c.Contains('<footer id="kontak"')
Write-Host "6. Modal present:" $c.Contains('id="paketPrivatModalContainer"')
Write-Host "7. Floating Button present:" $c.Contains('Daftar Program')
Write-Host "8. Event Calendar present:" $c.Contains('Kalender Event NLS')
