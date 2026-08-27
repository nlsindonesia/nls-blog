$htmlFiles = Get-ChildItem -Path "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame" -Include "*.html" -Recurse -File | Where-Object { $_.FullName -notmatch '\\.git\\' }

$suspicious = @()

foreach ($f in $htmlFiles) {
    $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    
    # Matches elements with class containing text-white or style containing color: white
    $regex = [regex]'<([a-zA-Z0-9]+)[^>]*class="([^"]*text-white[^"]*)"[^>]*>'
    $matches = $regex.Matches($content)
    
    foreach ($m in $matches) {
        $cls = $m.Groups[2].Value
        
        # Check if the class itself does not have a solid dark bg
        # e.g., bg-primary, bg-sky-, bg-blue-, bg-indigo-, bg-slate-800, bg-slate-900, bg-black, bg-emerald-, bg-rose-, bg-amber-, bg-[#FF8A00], bg-[#0284c7], bg-[#131D38], bg-gradient-
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
            $cls -notmatch 'bg-zinc-[789]' -and 
            $cls -notmatch 'bg-neutral-[789]' -and 
            $cls -notmatch 'bg-emerald-' -and 
            $cls -notmatch 'bg-teal-' -and 
            $cls -notmatch 'bg-rose-' -and 
            $cls -notmatch 'bg-red-' -and 
            $cls -notmatch 'bg-amber-' -and 
            $cls -notmatch 'bg-orange-' -and 
            $cls -notmatch 'bg-black' -and 
            $cls -notmatch 'bg-\[\#' -and 
            $cls -notmatch 'bg-gradient' -and
            $cls -notmatch 'from-') {
            
            $matchStr = $m.Value
            if ($matchStr.Length -gt 160) { $matchStr = $matchStr.Substring(0, 160) + "..." }
            $suspicious += [PSCustomObject]@{
                File = $f.Name
                Snippet = $matchStr
                Class = $cls
            }
        }
    }
}

Write-Host "Found $($suspicious.Count) suspicious text-white instances without inline dark background:"
$suspicious | ForEach-Object {
    Write-Host "- [$($_.File)] $($_.Snippet)"
}
