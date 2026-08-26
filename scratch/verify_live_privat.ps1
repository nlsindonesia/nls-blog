$res = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/privat' -UseBasicParsing).Content

Write-Host "=== VERIFYING LIVE PRIVAT MODAL ==="
Write-Host "1. Single Row Flex Container:" ($res.Contains('flex flex-row items-center gap-1.5 sm:gap-2.5 mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 w-full'))
Write-Host "2. Reguler Tab with dynamic gradient:" ($res.Contains("background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%)"))
Write-Host "3. Intensif Tab with dynamic gradient:" ($res.Contains("background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"))
Write-Host "4. Internasional Tab with dynamic gradient:" ($res.Contains("background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)"))
Write-Host "5. Manual Mata Pelajaran Input:" ($res.Contains('$store.paketPrivat.formData.mataPelajaran'))
Write-Host "6. 4 Sesi per Bulan Option:" ($res.Contains('4 Sesi / Bulan (1x seminggu - Ringan / Pengenalan)'))
Write-Host "7. Offline Transport Fee Info Rp 50.000:" ($res.Contains('Rp 50.000 / pertemuan'))
Write-Host "8. Reguler SNBT / Kedinasan Focus:" ($res.Contains('Persiapan SNBT / Tes Mandiri PTN / Kedinasan'))
Write-Host "9. High-contrast check styling without disappearing text:" ($res.Contains('bg-sky-100/90 dark:bg-sky-950/80 border-sky-500 text-slate-900 dark:text-white font-bold ring-1 ring-sky-400 shadow-2xs'))
