$req = [System.Net.WebRequest]::Create("https://nls-blog-plum.vercel.app/osn")
$req.AllowAutoRedirect = $true
$resp = $req.GetResponse()
$stream = $resp.GetResponseStream()
$reader = New-Object System.IO.StreamReader($stream)
$content = $reader.ReadToEnd()
$reader.Close()
$resp.Close()

Write-Host "=== VERIFYING OSN-ONLY NEWS FILTER ON LIVE VERCEL ==="
Write-Host "1. Has dedicated badge 'Kategori: OSN &amp; Sains':" $content.Contains("Kategori: OSN &amp; Sains")
Write-Host "2. Has OSN-only filter logic:" $content.Contains("toLowerCase().includes('osn')")
Write-Host "3. Has paginatedArticles():" $content.Contains("paginatedArticles()")
Write-Host "4. Has modal reader isReaderOpen:" $content.Contains("isReaderOpen")
