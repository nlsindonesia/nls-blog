$req = [System.Net.WebRequest]::Create("https://nls-blog-plum.vercel.app/nlsadmin")
$req.AllowAutoRedirect = $true
$resp = $req.GetResponse()
$stream = $resp.GetResponseStream()
$reader = New-Object System.IO.StreamReader($stream)
$content = $reader.ReadToEnd()
$reader.Close()
$resp.Close()

Write-Host "=== VERIFYING SEARCH BAR ALIGNMENT ON LIVE NLSADMIN ==="
Write-Host "1. Has top-1/2 -translate-y-1/2 icon:" $content.Contains("top-1/2 -translate-y-1/2")
Write-Host "2. Has explicit padding-left 2.75rem:" $content.Contains("padding-left: 2.75rem !important;")
Write-Host "3. Has no mojibake:" (-not $content.Contains("ðŸ"))
