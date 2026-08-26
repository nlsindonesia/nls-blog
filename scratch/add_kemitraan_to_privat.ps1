$tentangPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\tentang\index.html"
$privatPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\privat\index.html"

$tentangContent = [System.IO.File]::ReadAllText($tentangPath, [System.Text.Encoding]::UTF8)
$privatContent = [System.IO.File]::ReadAllText($privatPath, [System.Text.Encoding]::UTF8)

# Extract section from tentang
$startMarker = '<!-- ===== 7. JARINGAN MITRA & KOLABORASI RESMI (VIBRANT & COLORFUL) ===== -->'
$endMarker = '<!-- ===== 8. LINIMASA PERJALANAN (REKAM JEJAK STRATEGIS) ===== -->'

$startIdx = $tentangContent.IndexOf($startMarker)
$endIdx = $tentangContent.IndexOf($endMarker)

if ($startIdx -ge 0 -and $endIdx -gt $startIdx) {
    $mitraSection = $tentangContent.Substring($startIdx, ($endIdx - $startIdx)).Trim()
    
    # In privatContent, find where to insert: Right before <!-- Pricing Section -->
    $pricingMarker = '<!-- Pricing Section -->'
    if ($privatContent.Contains($pricingMarker)) {
        $insertIdx = $privatContent.IndexOf($pricingMarker)
        $before = $privatContent.Substring(0, $insertIdx)
        $after = $privatContent.Substring($insertIdx)
        
        $newPrivatContent = $before + $mitraSection + "`r`n`r`n            " + $after
        [System.IO.File]::WriteAllText($privatPath, $newPrivatContent, [System.Text.Encoding]::UTF8)
        Write-Host "SUCCESS: Added Jaringan Kemitraan Resmi & Prestisius section before Pilihan Paket in privat/index.html!"
    } else {
        Write-Host "Error: Could not find pricingMarker in privat/index.html"
    }
} else {
    Write-Host "Error extracting section from tentang/index.html"
}
