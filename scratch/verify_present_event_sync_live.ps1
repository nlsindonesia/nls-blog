function CheckPage($url, $pageName) {
    $req = [System.Net.WebRequest]::Create($url)
    $req.AllowAutoRedirect = $true
    $resp = $req.GetResponse()
    $stream = $resp.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $content = $reader.ReadToEnd()
    $reader.Close()
    $resp.Close()

    Write-Host "=== VERIFYING $pageName ==="
    Write-Host "1. Has getEventAdminCardClass:" $content.Contains("getEventAdminCardClass(event.category)")
    Write-Host "2. Has getCategoryStripe:" $content.Contains("getCategoryStripe(event.category)")
    Write-Host "3. Has getEventCategoryBadge:" $content.Contains("getEventCategoryBadge(event.category)")
    Write-Host "4. Has amber clock icon box:" $content.Contains("bg-amber-500/20")
    Write-Host "5. Has teal screen icon box:" $content.Contains("bg-teal-500/20")
}

CheckPage "https://nls-blog-plum.vercel.app/kalender" "KALENDER PAGE (/kalender)"
CheckPage "https://nls-blog-plum.vercel.app/osn" "OSN PAGE (/osn)"
