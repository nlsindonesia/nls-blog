$htmlFiles = Get-ChildItem -Path "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame" -Include "*.html" -Recurse -File | Where-Object { $_.FullName -notmatch '\\.git\\' -and $_.FullName -notmatch 'scratch' -and $_.FullName -notmatch '_old' }

Write-Host "=== PRECISE HTML-LEVEL CONTRAST AUDIT ==="

foreach ($f in $htmlFiles) {
    $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    
    # 1. Search for any text-white inside elements that are on light backgrounds without dark mode
    # Regex finds tags with class="... text-white ..."
    $matches = [regex]::Matches($content, '<([a-zA-Z0-9]+)[^>]*class="([^"]*text-white[^"]*)"[^>]*>')
    
    foreach ($m in $matches) {
        $tag = $m.Groups[1].Value
        $class = $m.Groups[2].Value
        
        # If class has dark:text-white, it is intentional for dark mode
        if ($class -match '\bdark:text-white\b') { continue }
        
        # Check if the class itself has a solid background that makes text-white visible:
        $hasSolidBg = $class -match '\b(bg-primary|bg-action-blue|bg-secondary|bg-sky-[5-9]00|bg-blue-[5-9]00|bg-indigo-[5-9]00|bg-purple-[5-9]00|bg-emerald-[5-9]00|bg-teal-[5-9]00|bg-rose-[5-9]00|bg-red-[5-9]00|bg-amber-[6-9]00|bg-orange-[5-9]00|bg-slate-[7-9]00|bg-gray-[7-9]00|bg-black|bg-\[\#FF8A00\]|bg-\[\#0284c7\]|bg-\[\#004B70\]|bg-\[\#0B5A8A\]|bg-\[\#131D38\]|bg-\[\#006493\]|bg-\[\#004d73\]|bg-\[\#e11d48\]|bg-\[\#059669\]|bg-\[\#7c3aed\]|bg-\[\#d97706\]|bg-\[\#0d9488\]|bg-\[\#ea580c\]|bg-gradient|from-)\b'
        $hasInlineBg = $m.Value -match 'style="[^"]*background'
        
        if (-not $hasSolidBg -and -not $hasInlineBg) {
            # Find line number
            $idx = $content.IndexOf($m.Value)
            $lineNo = $content.Substring(0, $idx).Split("`n").Length
            
            # Check context before the element to see parent section class
            $beforeCtx = $content.Substring([Math]::Max(0, $idx - 300), [Math]::Min(300, $idx))
            
            # If parent section is dark or image overlay (e.g., bg-black, bg-slate-900, bg-gradient, hero, overlay, video)
            $isInsideDarkSection = $beforeCtx -match '(bg-gradient|from-|bg-slate-900|bg-black|bg-primary|bg-secondary|overlay|aspect-video|blog-hero|hero|dark:)'
            
            if (-not $isInsideDarkSection) {
                Write-Host "[$($f.Name):$lineNo] <$tag class='$class'>"
            }
        }
    }
}
