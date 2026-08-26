$oldHtml = git show 7c65782~1:privat/index.html | Out-String

$startMarker = "<!-- Testimoni Siswa -->"
$endMarker = "<!-- ===== POP-UP MODAL FORM KEBUTUHAN PRIVAT SESUAI PAKET ===== -->"

$startIdx = $oldHtml.IndexOf($startMarker)
$endIdx = $oldHtml.IndexOf($endMarker)

Write-Host "startIdx: $startIdx, endIdx: $endIdx"

if ($startIdx -ge 0 -and $endIdx -gt $startIdx) {
    $missingChunk = $oldHtml.Substring($startIdx, ($endIdx - $startIdx))
    [System.IO.File]::WriteAllText("scratch/missing_chunk.html", $missingChunk, [System.Text.Encoding]::UTF8)
    Write-Host "Extracted missing chunk! Length: " $missingChunk.Length
} else {
    Write-Host "Error finding markers in oldHtml"
}
