$files = @(
    "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html",
    "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\kalender\index.html",
    "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\index.html",
    "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\osn\index.html",
    "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\blog\index.html",
    "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\privat\index.html"
)

# 1. Fix line 2971 in nlsadmin/index.html
$adminPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$adminContent = [System.IO.File]::ReadAllText($adminPath, [System.Text.Encoding]::UTF8)

# Replace broken whatsappMessage
$adminContent = $adminContent.Replace('whatsappMessage: Halo Next Level Study, saya ingin mendaftar kegiatan:  (),', "whatsappMessage: 'Halo Next Level Study, saya ingin mendaftar kegiatan: ' + f.title + ' (' + dateDisplay + ')',")
[System.IO.File]::WriteAllText($adminPath, $adminContent, [System.Text.Encoding]::UTF8)
Write-Host "Fixed line 2971 in nlsadmin/index.html"

# 2. Extract scripts and test syntax
foreach ($fPath in $files) {
    if (Test-Path $fPath) {
        $content = [System.IO.File]::ReadAllText($fPath, [System.Text.Encoding]::UTF8)
        $scriptMatches = [regex]::Matches($content, '(?s)<script\b[^>]*>(.*?)</script>')
        $idx = 0
        foreach ($m in $scriptMatches) {
            $idx++
            $code = $m.Groups[1].Value
            # Check for suspicious unquoted strings or obvious syntax breaks
            if ($code.Contains('Halo Next Level Study') -and -not $code.Contains("'Halo Next Level Study") -and -not $code.Contains('"Halo Next Level Study') -and -not $code.Contains('`Halo Next Level Study')) {
                Write-Host "[ERROR] Unquoted string in $fPath script #$idx"
            }
        }
    }
}
