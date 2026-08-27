$htmlFiles = Get-ChildItem -Path "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame" -Include "*.html" -Recurse -File | Where-Object { $_.FullName -notmatch '\\.git\\' }

foreach ($f in $htmlFiles) {
    $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    
    # Check for text-white inside light backgrounds
    # Check for headings or paragraphs with text-white
    $regex = [regex]'(?i)<(h[1-6]|p|span|div|a|button)[^>]*class="([^"]*text-white[^"]*)"[^>]*>'
    $matches = $regex.Matches($content)
    
    foreach ($m in $matches) {
        $tag = $m.Value
        $cls = $m.Groups[2].Value
        
        # If element is not dark-only and has no solid colored background
        if ($cls -notmatch 'dark:text-white' -and 
            $cls -notmatch 'bg-primary\b' -and 
            $cls -notmatch 'bg-action-blue\b' -and 
            $cls -notmatch 'bg-secondary\b' -and 
            $cls -notmatch 'bg-sky-' -and 
            $cls -notmatch 'bg-blue-' -and 
            $cls -notmatch 'bg-indigo-' -and 
            $cls -notmatch 'bg-purple-' -and 
            $cls -notmatch 'bg-slate-[789]' -and 
            $cls -notmatch 'bg-gray-[789]' -and 
            $cls -notmatch 'bg-emerald-' -and 
            $cls -notmatch 'bg-teal-' -and 
            $cls -notmatch 'bg-rose-' -and 
            $cls -notmatch 'bg-red-' -and 
            $cls -notmatch 'bg-amber-' -and 
            $cls -notmatch 'bg-orange-' -and 
            $cls -notmatch 'bg-black' -and 
            $cls -notmatch 'bg-\[\#' -and 
            $cls -notmatch 'bg-gradient' -and
            $tag -notmatch 'style="[^"]*background' -and
            $cls -notmatch 'from-') {
            
            # Find the line number
            $idx = $content.IndexOf($m.Value)
            $lineNo = $content.Substring(0, $idx).Split("`n").Length
            
            # Extract surrounding context (100 chars before and after)
            $start = [Math]::Max(0, $idx - 80)
            $len = [Math]::Min($content.Length - $start, 200)
            $ctx = $content.Substring($start, $len).Replace("`n", " ").Replace("`r", "")
            
            Write-Host "$($f.Name):$lineNo -> $tag"
            Write-Host "    Context: $ctx`n"
        }
    }
}
