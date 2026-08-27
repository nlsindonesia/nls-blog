$targetExtensions = @("*.html", "*.js", "*.css", "*.md")
$rootDir = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame"

$bullet = [char]0x2022 # •
$check1 = [char]0x2713 # ✓
$check2 = [char]0x2714 # ✔
$endash = [char]0x2013 # –
$emdash = [char]0x2014 # —

# Mojibake string byte sequences in UTF-8 decoded as CP1252:
# • in UTF-8 is 0xE2 0x80 0xA2 => â (0xE2), € (0x80), ¢ (0xA2)
$badBullet = [System.Text.Encoding]::GetEncoding(1252).GetString([byte[]]@(0xE2, 0x80, 0xA2))
# ✓ in UTF-8 is 0xE2 0x9C 0x93 => â (0xE2), œ (0x9C), “ (0x93)
$badCheck1 = [System.Text.Encoding]::GetEncoding(1252).GetString([byte[]]@(0xE2, 0x9C, 0x93))
# ✔ in UTF-8 is 0xE2 0x9C 0x94 => â (0xE2), œ (0x9C), ” (0x94)
$badCheck2 = [System.Text.Encoding]::GetEncoding(1252).GetString([byte[]]@(0xE2, 0x9C, 0x94))

$files = Get-ChildItem -Path $rootDir -Include $targetExtensions -Recurse -File | Where-Object { $_.FullName -notmatch '\\.git\\' }

$count = 0
foreach ($f in $files) {
    $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    $orig = $content
    
    if ($content.Contains($badBullet)) {
        $content = $content.Replace($badBullet, $bullet)
    }
    if ($content.Contains($badCheck1)) {
        $content = $content.Replace($badCheck1, $check1)
    }
    if ($content.Contains($badCheck2)) {
        $content = $content.Replace($badCheck2, $check2)
    }

    if ($content -ne $orig) {
        [System.IO.File]::WriteAllText($f.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "CLEANED MOJIBAKE IN: $($f.Name)"
        $count++
    }
}

Write-Host "Total cleaned files: $count"
