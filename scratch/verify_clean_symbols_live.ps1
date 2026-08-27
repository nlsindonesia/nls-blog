$pages = @(
    "https://nls-blog-plum.vercel.app/kalender",
    "https://nls-blog-plum.vercel.app/osn",
    "https://nls-blog-plum.vercel.app/nlsadmin",
    "https://nls-blog-plum.vercel.app/blog",
    "https://nls-blog-plum.vercel.app/tka"
)

foreach ($url in $pages) {
    $req = [System.Net.WebRequest]::Create($url)
    $req.AllowAutoRedirect = $true
    $resp = $req.GetResponse()
    $stream = $resp.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $content = $reader.ReadToEnd()
    $reader.Close()
    $resp.Close()

    Write-Host "Verifying $url :"
    Write-Host "  - Has 'â€¢':" $content.Contains("â€¢")
    Write-Host "  - Has 'â':" $content.Contains("â")
}
