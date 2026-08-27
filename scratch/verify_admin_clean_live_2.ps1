$req = [System.Net.WebRequest]::Create("https://nls-blog-plum.vercel.app/nlsadmin")
$req.AllowAutoRedirect = $true
$resp = $req.GetResponse()
$stream = $resp.GetResponseStream()
$reader = New-Object System.IO.StreamReader($stream)
$content = $reader.ReadToEnd()
$reader.Close()
$resp.Close()

Write-Host "=== VERIFYING NLSADMIN ON LIVE VERCEL ==="
Write-Host "1. Contains mojibake 'ðŸ':" $content.Contains("ðŸ")
Write-Host "2. Has clean 'Semua Kategori':" $content.Contains('<option value="all">Semua Kategori</option>')
Write-Host "3. Has clean 'Semua Bulan 2026':" $content.Contains('<option value="all">Semua Bulan 2026</option>')
