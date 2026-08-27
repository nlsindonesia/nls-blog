$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content
$blogRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/blog' -UseBasicParsing).Content

Write-Host "=== VERIFYING 'Bimbel NexGen' ON LIVE VERCEL ==="
Write-Host "1. Admin Create News Category Option:" $adminRes.Contains('<option value="Bimbel NexGen">Bimbel NexGen</option>')
Write-Host "2. Admin Present News Category Filter:" $adminRes.Contains('<option value="Bimbel NexGen">Bimbel NexGen</option>')
Write-Host "3. Blog Hero Category Filter Button:" $blogRes.Contains("selectedCategory = 'Bimbel NexGen'")
Write-Host "4. Blog App Categories Array:" $blogRes.Contains("'Bimbel NexGen'")
