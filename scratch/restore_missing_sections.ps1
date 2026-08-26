$privatPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\privat\index.html"
$currentHtml = [System.IO.File]::ReadAllText($privatPath, [System.Text.Encoding]::UTF8)

# The missing chunk from scratch/missing_chunk.html
$missingChunk = [System.IO.File]::ReadAllText("scratch/missing_chunk.html", [System.Text.Encoding]::UTF8)

# In currentHtml, find </section> of pricing and <!-- ===== POP-UP MODAL FORM KEBUTUHAN PRIVAT SESUAI PAKET ===== -->
$pricingEnd = '</section>'
$modalStart = '<!-- ===== POP-UP MODAL FORM KEBUTUHAN PRIVAT SESUAI PAKET ===== -->'

$pricingEndIdx = $currentHtml.IndexOf($pricingEnd)
# Find the specific </section> of id="paket"
$paketIdx = $currentHtml.IndexOf('id="paket"')
if ($paketIdx -ge 0) {
    $sectionCloseAfterPaket = $currentHtml.IndexOf('</section>', $paketIdx)
    if ($sectionCloseAfterPaket -ge 0) {
        $sectionCloseEnd = $sectionCloseAfterPaket + '</section>'.Length
        $modalIdx = $currentHtml.IndexOf($modalStart, $sectionCloseEnd)
        
        if ($modalIdx -ge 0) {
            # Everything before </section> of #paket
            $before = $currentHtml.Substring(0, $sectionCloseEnd)
            # Everything from modalStart onwards
            $after = $currentHtml.Substring($modalIdx)
            
            $restoredHtml = $before + "`r`n`r`n            " + $missingChunk.Trim() + "`r`n`r`n            " + $after
            
            [System.IO.File]::WriteAllText($privatPath, $restoredHtml, [System.Text.Encoding]::UTF8)
            Write-Host "SUCCESS: Restored Testimoni, FAQ, CTA, and Footer in privat/index.html!"
        } else {
            Write-Host "Error: Could not find modalStart"
        }
    } else {
        Write-Host "Error: Could not find sectionCloseAfterPaket"
    }
} else {
    Write-Host "Error: Could not find id='paket'"
}
