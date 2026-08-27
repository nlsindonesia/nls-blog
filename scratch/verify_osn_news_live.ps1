$req = [System.Net.WebRequest]::Create("https://nls-blog-plum.vercel.app/osn")
$req.AllowAutoRedirect = $true
$resp = $req.GetResponse()
$stream = $resp.GetResponseStream()
$reader = New-Object System.IO.StreamReader($stream)
$content = $reader.ReadToEnd()
$reader.Close()
$resp.Close()

Write-Host "=== VERIFYING DYNAMIC NEWS SECTION ON LIVE OSN PAGE ==="
Write-Host "1. Has osnNewsApp():" $content.Contains("osnNewsApp()")
Write-Host "2. Has paginatedArticles():" $content.Contains("paginatedArticles()")
Write-Host "3. Has default-articles.js:" $content.Contains("default-articles.js")
Write-Host "4. Has modal isReaderOpen:" $content.Contains("isReaderOpen")
Write-Host "5. Has numeric pagination buttons:" $content.Contains("setPage(pageNum)")
