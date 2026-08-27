$adminRes = (Invoke-WebRequest -Uri 'https://nls-blog-plum.vercel.app/nlsadmin' -UseBasicParsing).Content

Write-Host "=== VERIFYING BIMBEL NEXGEN AT THE BOTTOM ON LIVE VERCEL ==="
$matches = [regex]::Matches($adminRes, '(?s)<select x-model="articleEditor\.form\.category".*?<\/select>')
if ($matches.Count -gt 0) {
    Write-Host "Create News Select HTML:"
    Write-Host $matches[0].Value
    $isAtBottom = $matches[0].Value.EndsWith("<option value=`"Bimbel NexGen`">Bimbel NexGen</option>`n                                            </select>") -or $matches[0].Value.Contains("<option value=`"Panduan Beasiswa`">Panduan Beasiswa</option>`n                                                <option value=`"Bimbel NexGen`">Bimbel NexGen</option>")
    Write-Host "Is 'Bimbel NexGen' at bottom position:" $isAtBottom
}
