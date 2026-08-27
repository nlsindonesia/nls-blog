$htmlFiles = Get-ChildItem -Path "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame" -Include "*.html" -Recurse -File | Where-Object { $_.FullName -notmatch '\\.git\\' }

# Patterns of light backgrounds:
# bg-white, bg-slate-50, bg-slate-100, bg-slate-200, bg-gray-50, bg-gray-100, bg-zinc-50, bg-neutral-50, bg-surface, bg-surface-bright, bg-surface-container-low, bg-surface-container-lowest, bg-surface-alt

Write-Host "=== SCANNING FOR WHITE TEXT ON LIGHT BACKGROUNDS IN ALL HTML FILES ==="

foreach ($f in $htmlFiles) {
    $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    
    # Check for buttons, spans, links, headings with text-white inside light cards
    # We check regex pattern for elements where class contains both bg-white (or light) AND text-white
    $regex1 = [regex]'(?i)<[^>]*class="[^"]*\b(bg-white|bg-slate-50|bg-slate-100|bg-gray-50|bg-surface-bright|bg-surface-container-lowest|bg-transparent)\b[^"]*\b(text-white|text-\[#fff\]|text-\[#ffffff\])\b[^"]*"[^>]*>'
    $matches1 = $regex1.Matches($content)
    foreach ($m in $matches1) {
        # filter out if it has dark mode or gradient
        if ($m.Value -notmatch 'dark:bg-' -and $m.Value -notmatch 'bg-gradient' -and $m.Value -notmatch 'from-') {
            Write-Host "$($f.Name) [Match 1]: $($m.Value)"
        }
    }

    # Check for white SVG stroke or fill on light bg
    $regex2 = [regex]'(?i)<svg[^>]*class="[^"]*\b(text-white|stroke-white|fill-white)\b[^"]*"[^>]*>'
    $matches2 = $regex2.Matches($content)
    # Check if inside light section
}
