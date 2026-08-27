$adminPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$txt = [System.IO.File]::ReadAllText($adminPath, [System.Text.Encoding]::UTF8)

# Check for double single quotes
$hasDoubleQuotes = $txt.Contains("''")
Write-Host "Contains double single-quotes:" $hasDoubleQuotes

if ($hasDoubleQuotes) {
    # Fix any occurrences
    $txt = $txt.Replace("''present''", "'present'")
    $txt = $txt.Replace("''create''", "'create'")
    $txt = $txt.Replace("''add''", "'add'")
    $txt = $txt.Replace("''kalender''", "'kalender'")
    $txt = $txt.Replace("''berita''", "'berita'")
    $txt = $txt.Replace("''pengajar''", "'pengajar'")
    [System.IO.File]::WriteAllText($adminPath, $txt, [System.Text.Encoding]::UTF8)
    Write-Host "Fixed double single-quotes!"
}

# Verify key elements
Write-Host "Create News button present:" $txt.Contains('Create News')
Write-Host "Present News button present:" $txt.Contains('Present News')
Write-Host "Add Teacher button present:" $txt.Contains('Add Teacher')
Write-Host "Present Teacher button present:" $txt.Contains('Present Teacher')
Write-Host "openCreateNewsView method present:" $txt.Contains('openCreateNewsView()')
Write-Host "openAddTeacherView method present:" $txt.Contains('openAddTeacherView()')
Write-Host "saveTeacherFromBuilder method present:" $txt.Contains('saveTeacherFromBuilder()')
