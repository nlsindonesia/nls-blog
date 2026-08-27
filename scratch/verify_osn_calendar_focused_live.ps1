$req = [System.Net.WebRequest]::Create("https://nls-blog-plum.vercel.app/osn")
$req.AllowAutoRedirect = $true
$resp = $req.GetResponse()
$stream = $resp.GetResponseStream()
$reader = New-Object System.IO.StreamReader($stream)
$content = $reader.ReadToEnd()
$reader.Close()
$resp.Close()

Write-Host "=== VERIFYING FOCUSED OSN CALENDAR ON LIVE VERCEL ==="
Write-Host "1. Has dedicated badge 'Kategori Khusus: OSN &amp; Sains':" $content.Contains("Kategori Khusus: OSN &amp; Sains")
Write-Host "2. Has OSN-only calendar filter:" $content.Contains("toUpperCase().includes('OSN')")
Write-Host "3. Has Agenda OSN Bulan Ini counter:" $content.Contains("Agenda OSN Bulan Ini")
Write-Host "4. Has Buka Kalender Penuh link:" $content.Contains("Buka Kalender Penuh")
