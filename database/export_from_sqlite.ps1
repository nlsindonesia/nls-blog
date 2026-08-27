# ==============================================================================
# SCRIPT: export_from_sqlite.ps1
# Description: Export SQLite tables to JSON & JavaScript default datasets
# ==============================================================================

$baseDir = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame"
$dbDir = Join-Path $baseDir "database"
$dbPath = Join-Path $dbDir "nls_database.sqlite"

# Find sqlite3
$sqliteExe = "sqlite3"
$wingetPaths = @(
    "C:\Users\vc\AppData\Local\Microsoft\WinGet\Packages\SQLite.SQLite_Microsoft.Winget.Source_8wekyb3d8bbwe\sqlite3.exe",
    "C:\ProgramData\chocolatey\bin\sqlite3.exe"
)
foreach ($p in $wingetPaths) {
    if (Test-Path $p) {
        $sqliteExe = $p
        break
    }
}

if (-not (Test-Path $dbPath)) {
    Write-Host "[ERROR] SQLite database file not found at $dbPath"
    exit 1
}

Write-Host "Exporting data from SQLite ($dbPath)..."

# 1. Export Articles as JSON
$articlesJson = & $sqliteExe $dbPath "SELECT json_group_array(json_object('id', id, 'title', title, 'slug', slug, 'category', category, 'categories', json(categories), 'date', date, 'endDate', end_date, 'author', author, 'status', status, 'coverImage', cover_image, 'focusKeyword', focus_keyword, 'metaTitle', meta_title, 'metaDescription', meta_description, 'canonicalUrl', canonical_url, 'content', content, 'seoScore', seo_score)) FROM articles WHERE is_trashed = 0;"
$articlesJsOut = "window.NLS_DEFAULT_ARTICLES = " + $articlesJson + ";"
[System.IO.File]::WriteAllText((Join-Path $dbDir "articles_export.json"), $articlesJson, [System.Text.Encoding]::UTF8)
Write-Host "• Exported articles to database/articles_export.json"

# 2. Export Events as JSON
$eventsJson = & $sqliteExe $dbPath "SELECT json_group_array(json_object('id', id, 'title', title, 'category', category, 'jenjang', jenjang, 'jenjangLabel', jenjang_label, 'date', date, 'endDate', end_date, 'time', time, 'mode', mode, 'location', location, 'badgeText', badge_text, 'whatsappMessage', whatsapp_message, 'description', description, 'highlights', json(highlights))) FROM events WHERE is_trashed = 0;"
[System.IO.File]::WriteAllText((Join-Path $dbDir "events_export.json"), $eventsJson, [System.Text.Encoding]::UTF8)
Write-Host "• Exported events to database/events_export.json"

# 3. Export Teachers as JSON
$teachersJson = & $sqliteExe $dbPath "SELECT json_group_array(json_object('id', id, 'name', name, 'shortName', short_name, 'photo', photo, 'education', education, 'categories', json(categories), 'jenjang', json(jenjang), 'jenjangLabel', jenjang_label, 'subject', subject, 'subjects', json(subjects), 'kebutuhanPrivat', kebutuhan_privat, 'philosophy', philosophy, 'highlights', json(highlights), 'rating', rating, 'reviewCount', review_count)) FROM teachers WHERE is_trashed = 0;"
[System.IO.File]::WriteAllText((Join-Path $dbDir "teachers_export.json"), $teachersJson, [System.Text.Encoding]::UTF8)
Write-Host "• Exported teachers to database/teachers_export.json"

# 4. Export Applications as JSON
$appsJson = & $sqliteExe $dbPath "SELECT json_group_array(json_object('id', id, 'submittedAt', submitted_at, 'status', status, 'nama', nama, 'panggilan', panggilan, 'wa', wa, 'email', email, 'pendidikan', pendidikan, 'photo', photo, 'categories', json(categories), 'jenjang', json(jenjang), 'jenjangLabel', jenjang_label, 'subject', subject, 'kebutuhanPrivat', kebutuhan_privat, 'philosophy', philosophy, 'highlights', json(highlights), 'portfolio', portfolio, 'notes', notes)) FROM teacher_applications;"
[System.IO.File]::WriteAllText((Join-Path $dbDir "teacher_applications_export.json"), $appsJson, [System.Text.Encoding]::UTF8)
Write-Host "• Exported teacher applications to database/teacher_applications_export.json"

Write-Host "`nAll exports completed successfully!"
