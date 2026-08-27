$htmlFiles = Get-ChildItem -Path "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame" -Include "*.html" -Recurse -File | Where-Object { $_.FullName -notmatch '\\.git\\' -and $_.FullName -notmatch 'scratch' -and $_.FullName -notmatch '_old' }

foreach ($f in $htmlFiles) {
    $lines = [System.IO.File]::ReadAllLines($f.FullName, [System.Text.Encoding]::UTF8)
    for ($i = 0; $i -lt $lines.Length; $i++) {
        $line = $lines[$i]
        
        if ($line -match 'HUBUNGI KAMI' -and $line -match 'border-white') {
            Write-Host "$($f.FullName):$($i+1) -> $line"
        }
    }
}
