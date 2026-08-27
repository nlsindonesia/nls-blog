$homeRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/' -UseBasicParsing).Content

Write-Host "=== VERIFYING BUTTON RELOCATION ON LIVE VERCEL ==="
Write-Host "1. Bottom action row present with justify-end:" $homeRes.Contains('mt-8 flex justify-end')
Write-Host "2. Buka Blog Lengkap button present in bottom action row:" $homeRes.Contains('Buka Blog Lengkap')
Write-Host "3. Top bar does not contain Buka Blog Lengkap link:" (-not $homeRes.Contains('<a href="/blog" class="inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline mr-2 self-end sm:self-auto">'))
