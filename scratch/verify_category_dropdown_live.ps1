$blogRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/blog' -UseBasicParsing).Content

Write-Host "=== VERIFYING CATEGORY DROPDOWN AT RED X POSITION ON LIVE VERCEL ==="
Write-Host "1. Category dropdown select present:" $blogRes.Contains('<select x-model="selectedCategory"')
Write-Host "2. Dropdown has 'Semua Kategori':" $blogRes.Contains('<option value="all">Semua Kategori</option>')
Write-Host "3. Dropdown has 'Bimbel NexGen' at bottom:" $blogRes.Contains('<option value="Bimbel NexGen">Bimbel NexGen</option>')
Write-Host "4. Results header bar has flex-row with dropdown:" $blogRes.Contains('flex flex-col sm:flex-row sm:items-center justify-between')
Write-Host "5. Clean bullet &bull; present:" $blogRes.Contains('&bull;')
