# ==============================================================================
# SCRIPT: init_database.ps1
# Description: Initialize, migrate, and populate Next Level Study SQLite Database
# ==============================================================================

$baseDir = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame"
$dbDir = Join-Path $baseDir "database"
$dbPath = Join-Path $dbDir "nls_database.sqlite"
$schemaPath = Join-Path $dbDir "schema.sql"
$seedSqlPath = Join-Path $dbDir "seed_data.sql"

if (-not (Test-Path $dbDir)) {
    New-Item -ItemType Directory -Path $dbDir -Force | Out-Null
}

# 1. Find sqlite3 executable
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

Write-Host "Using SQLite binary: $sqliteExe"

# 2. Reset / Initialize DB with schema
if (Test-Path $dbPath) {
    Remove-Item -Path $dbPath -Force
    Write-Host "Removed existing database file to perform fresh migration."
}

& $sqliteExe $dbPath ".read '$($schemaPath.Replace('\', '/'))'"
Write-Host "Applied schema.sql successfully."

# Helper function to escape SQL strings
function Sql-Escape([string]$val) {
    if ($null -eq $val) { return "NULL" }
    $escaped = $val.Replace("'", "''")
    return "'$escaped'"
}

$sqlInserts = New-Object System.Text.StringBuilder
$sqlInserts.AppendLine("BEGIN TRANSACTION;") | Out-Null

# 3. Read & Import Articles from blog/default-articles.js
$articlesJsPath = Join-Path $baseDir "blog\default-articles.js"
if (Test-Path $articlesJsPath) {
    $jsContent = [System.IO.File]::ReadAllText($articlesJsPath, [System.Text.Encoding]::UTF8)
    $pattern = '(?s)window\.NLS_DEFAULT_ARTICLES\s*=\s*(\[[\s\S]*\]);?'
    $m = [regex]::Match($jsContent, $pattern)
    if ($m.Success) {
        $raw = $m.Groups[1].Value
        $raw = [regex]::Replace($raw, '(?m)^\s*//.*?$', '')
        $raw = [regex]::Replace($raw, '(?m)//[^"'']+$', '')
        $articles = ConvertFrom-Json $raw
        Write-Host "Found $($articles.Count) articles in default-articles.js"
        foreach ($a in $articles) {
            $categoriesJson = ConvertTo-Json ($a.categories) -Compress
            $sql = "INSERT INTO articles (id, title, slug, category, categories, date, end_date, author, status, cover_image, focus_keyword, meta_title, meta_description, canonical_url, content, seo_score, is_trashed) VALUES (" +
                (Sql-Escape $a.id) + ", " +
                (Sql-Escape $a.title) + ", " +
                (Sql-Escape $a.slug) + ", " +
                (Sql-Escape $a.category) + ", " +
                (Sql-Escape $categoriesJson) + ", " +
                (Sql-Escape $a.date) + ", " +
                (Sql-Escape $a.endDate) + ", " +
                (Sql-Escape $a.author) + ", " +
                (Sql-Escape $a.status) + ", " +
                (Sql-Escape $a.coverImage) + ", " +
                (Sql-Escape $a.focusKeyword) + ", " +
                (Sql-Escape $a.metaTitle) + ", " +
                (Sql-Escape $a.metaDescription) + ", " +
                (Sql-Escape $a.canonicalUrl) + ", " +
                (Sql-Escape $a.content) + ", " +
                ($a.seoScore -as [int]) + ", 0);"
            $sqlInserts.AppendLine($sql) | Out-Null
        }
    }
}

# 4. Read & Import Events from kalender/default-events.js
$eventsJsPath = Join-Path $baseDir "kalender\default-events.js"
if (Test-Path $eventsJsPath) {
    $jsContent = [System.IO.File]::ReadAllText($eventsJsPath, [System.Text.Encoding]::UTF8)
    $eventBlocks = [regex]::Matches($jsContent, '(?s)\{\s*id:\s*[\x27"](?<id>[^\x27"]+)[\x27"]\s*,\s*date:\s*[\x27"](?<date>[^\x27"]+)[\x27"]\s*,\s*(endDate:\s*[\x27"](?<endDate>[^\x27"]*)[\x27"]\s*,\s*)?title:\s*[\x27"](?<title>[^\x27"]+)[\x27"]\s*,\s*category:\s*[\x27"](?<category>[^\x27"]+)[\x27"]\s*,\s*jenjang:\s*[\x27"](?<jenjang>[^\x27"]+)[\x27"]\s*,\s*jenjangLabel:\s*[\x27"](?<jenjangLabel>[^\x27"]+)[\x27"]\s*,\s*time:\s*[\x27"](?<time>[^\x27"]+)[\x27"]\s*,\s*mode:\s*[\x27"](?<mode>[^\x27"]+)[\x27"]\s*,\s*location:\s*[\x27"](?<location>[^\x27"]+)[\x27"]\s*,\s*badgeText:\s*[\x27"](?<badgeText>[^\x27"]+)[\x27"]\s*,\s*description:\s*[\x27"](?<description>[^\x27"]+)[\x27"]\s*,\s*highlights:\s*\[(?<highlights>.*?)\]\s*,\s*whatsappMessage:\s*[\x27"](?<whatsappMessage>[^\x27"]+)[\x27"]')
    
    Write-Host "Found $($eventBlocks.Count) events in default-events.js"
    foreach ($eb in $eventBlocks) {
        $id = $eb.Groups['id'].Value
        $date = $eb.Groups['date'].Value
        $endDate = $eb.Groups['endDate'].Value
        $title = $eb.Groups['title'].Value
        $category = $eb.Groups['category'].Value
        $jenjang = $eb.Groups['jenjang'].Value
        $jenjangLabel = $eb.Groups['jenjangLabel'].Value
        $time = $eb.Groups['time'].Value
        $mode = $eb.Groups['mode'].Value
        $location = $eb.Groups['location'].Value
        $badgeText = $eb.Groups['badgeText'].Value
        $description = $eb.Groups['description'].Value
        $rawHighlights = $eb.Groups['highlights'].Value
        $whatsappMessage = $eb.Groups['whatsappMessage'].Value

        # Parse highlights array
        $hlMatches = [regex]::Matches($rawHighlights, '[\x27"](?<hl>[^\x27"]+)[\x27"]')
        $hlArray = @()
        foreach ($hm in $hlMatches) {
            $hlArray += $hm.Groups['hl'].Value
        }
        $highlightsJson = ConvertTo-Json $hlArray -Compress

        $sql = "INSERT INTO events (id, title, category, jenjang, jenjang_label, date, end_date, time, mode, location, badge_text, whatsapp_message, description, highlights, is_trashed) VALUES (" +
            (Sql-Escape $id) + ", " +
            (Sql-Escape $title) + ", " +
            (Sql-Escape $category) + ", " +
            (Sql-Escape $jenjang) + ", " +
            (Sql-Escape $jenjangLabel) + ", " +
            (Sql-Escape $date) + ", " +
            (Sql-Escape $endDate) + ", " +
            (Sql-Escape $time) + ", " +
            (Sql-Escape $mode) + ", " +
            (Sql-Escape $location) + ", " +
            (Sql-Escape $badgeText) + ", " +
            (Sql-Escape $whatsappMessage) + ", " +
            (Sql-Escape $description) + ", " +
            (Sql-Escape $highlightsJson) + ", 0);"
        $sqlInserts.AppendLine($sql) | Out-Null
    }
}

# 5. Read & Import Teachers from pengajar/default-teachers.js
$teachersJsPath = Join-Path $baseDir "pengajar\default-teachers.js"
if (Test-Path $teachersJsPath) {
    $jsContent = [System.IO.File]::ReadAllText($teachersJsPath, [System.Text.Encoding]::UTF8)
    $pattern = '(?s)window\.NLS_DEFAULT_TEACHERS\s*=\s*(\[[\s\S]*\]);?'
    $m = [regex]::Match($jsContent, $pattern)
    if ($m.Success) {
        $raw = $m.Groups[1].Value
        $raw = [regex]::Replace($raw, '(?m)^\s*//.*?$', '')
        $raw = [regex]::Replace($raw, '(?m)//[^"'']+$', '')
        $teachers = ConvertFrom-Json $raw
        Write-Host "Found $($teachers.Count) teachers in default-teachers.js"
        foreach ($t in $teachers) {
            $categoriesJson = ConvertTo-Json ($t.categories) -Compress
            $jenjangJson = ConvertTo-Json ($t.jenjang) -Compress
            $subjectsJson = ConvertTo-Json ($t.subjects) -Compress
            $highlightsJson = ConvertTo-Json ($t.highlights) -Compress
            $sql = "INSERT INTO teachers (id, name, short_name, photo, education, categories, jenjang, jenjang_label, subject, subjects, kebutuhan_privat, philosophy, highlights, rating, review_count, is_trashed) VALUES (" +
                (Sql-Escape $t.id) + ", " +
                (Sql-Escape $t.name) + ", " +
                (Sql-Escape $t.shortName) + ", " +
                (Sql-Escape $t.photo) + ", " +
                (Sql-Escape $t.education) + ", " +
                (Sql-Escape $categoriesJson) + ", " +
                (Sql-Escape $jenjangJson) + ", " +
                (Sql-Escape $t.jenjangLabel) + ", " +
                (Sql-Escape $t.subject) + ", " +
                (Sql-Escape $subjectsJson) + ", " +
                (Sql-Escape $t.kebutuhanPrivat) + ", " +
                (Sql-Escape $t.philosophy) + ", " +
                (Sql-Escape $highlightsJson) + ", 4.9, 24, 0);"
            $sqlInserts.AppendLine($sql) | Out-Null
        }
    }
}

# 6. Seed Teacher Applications
$sampleApps = @(
    @{
        id = "app-sample-1"
        submitted_at = "2026-08-27T10:30:00.000Z"
        status = "pending"
        nama = "Fajar Hidayatullah, M.Sc."
        panggilan = "Kak Fajar"
        wa = "081234567890"
        email = "fajar.hidayat@gmail.com"
        pendidikan = "S2 Fisika Teori Universitas Indonesia (Medalis Perak OSN Fisika)"
        photo = "/images/pengajar/mentor-2-physics.jpg"
        categories = @("OSN", "Kurikulum Internasional")
        jenjang = @("SMP", "SMA")
        jenjang_label = "SMP & SMA"
        subject = "Fisika Kuantum & Mekanika Lanjut (OSN & IPhO)"
        kebutuhan_privat = "Bimbingan intensif seleksi OSN Fisika tingkat Kabupaten hingga Nasional, serta persiapan IGCSE & A-Level Physics."
        philosophy = "Memahami fenomena alam melalui logika matematika yang elegan dan eksperimen pemikiran."
        highlights = @("Medali Perak OSN Fisika Tingkat Nasional", "Alumni S2 Fisika Universitas Indonesia (Cumlaude)", "Berpengalaman 4+ tahun membimbing 15+ peraih medali OSN-P")
        portfolio = "https://drive.google.com/file/d/sample-cv-fajar/view"
        notes = "Calon mentor sangat direkomendasikan untuk pembinaan OSN Fisika."
    },
    @{
        id = "app-sample-2"
        submitted_at = "2026-08-26T15:45:00.000Z"
        status = "pending"
        nama = "Nabila Azzahra, S.Si."
        panggilan = "Kak Nabila"
        wa = "085712349876"
        email = "nabila.azzahra@ugm.ac.id"
        pendidikan = "Kimia Universitas Gadjah Mada (Top 3 LKTI Nasional)"
        photo = "/images/pengajar/mentor-3-chem.jpg"
        categories = @("OSN", "SNBT")
        jenjang = @("SMA")
        jenjang_label = "SMA & Alumni"
        subject = "Kimia Organik & Stoikiometri UTBK SNBT"
        kebutuhan_privat = "Pemahaman mendalam reaksi organik, termokimia, dan trik cepat penalaran analitik SNBT."
        philosophy = "Kimia bukan menghafal rumus, melainkan memahami interaksi partikel dan aplikasi nyata."
        highlights = @("Juara 1 Lomba Cepat Tepat Kimia Regional Jawa-Bali", "Tutor Kimia UTBK SNBT dengan 92% kelolosan siswa ke PTN Top", "Penulis modul pemantapan stoikiometri intensif")
        portfolio = "https://linkedin.com/in/nabila-azzahra-chem"
        notes = ""
    }
)

foreach ($app in $sampleApps) {
    $catJson = ConvertTo-Json ($app.categories) -Compress
    $jnjJson = ConvertTo-Json ($app.jenjang) -Compress
    $hlJson = ConvertTo-Json ($app.highlights) -Compress
    $sql = "INSERT INTO teacher_applications (id, submitted_at, status, nama, panggilan, wa, email, pendidikan, photo, categories, jenjang, jenjang_label, subject, kebutuhan_privat, philosophy, highlights, portfolio, notes) VALUES (" +
        (Sql-Escape $app.id) + ", " +
        (Sql-Escape $app.submitted_at) + ", " +
        (Sql-Escape $app.status) + ", " +
        (Sql-Escape $app.nama) + ", " +
        (Sql-Escape $app.panggilan) + ", " +
        (Sql-Escape $app.wa) + ", " +
        (Sql-Escape $app.email) + ", " +
        (Sql-Escape $app.pendidikan) + ", " +
        (Sql-Escape $app.photo) + ", " +
        (Sql-Escape $catJson) + ", " +
        (Sql-Escape $jnjJson) + ", " +
        (Sql-Escape $app.jenjang_label) + ", " +
        (Sql-Escape $app.subject) + ", " +
        (Sql-Escape $app.kebutuhan_privat) + ", " +
        (Sql-Escape $app.philosophy) + ", " +
        (Sql-Escape $hlJson) + ", " +
        (Sql-Escape $app.portfolio) + ", " +
        (Sql-Escape $app.notes) + ");"
    $sqlInserts.AppendLine($sql) | Out-Null
}

# 7. Seed Programs Catalog
$programs = @(
    @{ id = "prog-osn"; title = "Bimbel Olimpiade Sains Nasional (OSN)"; slug = "bimbel-osn"; category = "Bimbel OSN"; jenjang = "SD, SMP, SMA"; desc = "Pembinaan intensif 9 bidang sains bersama mentor medalis nasional dan internasional." },
    @{ id = "prog-snbt"; title = "Bimbel Persiapan UTBK-SNBT"; slug = "bimbel-snbt"; category = "Bimbel SNBT"; jenjang = "SMA & Alumni"; desc = "Simulasi try out berbasis IRT presisi, drilling penalaran skolastik, dan bedah trik pengerjaan cepat." },
    @{ id = "prog-tka"; title = "Bimbel Tes Kemampuan Akademik (TKA)"; slug = "bimbel-tka"; category = "Bimbel TKA"; jenjang = "SMP & SMA"; desc = "Pemantapan materi akademik mendalam untuk ujian sekolah unggulan dan seleksi masuk perguruan tinggi." },
    @{ id = "prog-nexgen"; title = "Nexgen Academy (Bimbel Offline Bekasi)"; slug = "nexgen"; category = "Nexgen Academy"; jenjang = "SD, SMP, SMA"; desc = "Kelas tatap muka eksklusif dengan fasilitas modern, studio CBT, dan pendampingan mentor juara." },
    @{ id = "prog-privat"; title = "Program Les Privat 1-on-1"; slug = "privat"; category = "Privat"; jenjang = "SD, SMP, SMA, Internasional"; desc = "Mentoring personal 1 siswa 1 mentor dengan kurikulum fleksibel: Nasional, Cambridge IGCSE, A-Level, & IB Diploma." },
    @{ id = "prog-mitra-sekolah"; title = "Kemitraan Sekolah & In-House Training"; slug = "mitra-sekolah"; category = "Mitra Sekolah"; jenjang = "Institusi Sekolah"; desc = "Penyelenggaraan try out akbar sekolah, pelatihan guru, dan karantina persiapan olimpiade." },
    @{ id = "prog-mitra-dinas"; title = "Kemitraan Dinas Pendidikan & B2G"; slug = "mitra-dinas"; category = "Mitra Dinas"; jenjang = "Dinas & Lembaga"; desc = "Program pembinaan sains daerah skala besar dan pengadaan resmi institusi terdaftar SIPLaH." }
)

foreach ($p in $programs) {
    $featuresJson = '["Kurikulum Terstruktur", "Mentor Medalis", "Platform CBT Interaktif", "Rapor & Analisis Nilai"]'
    $sql = "INSERT INTO programs (id, title, slug, category, jenjang, description, features, link_url, is_active) VALUES (" +
        (Sql-Escape $p.id) + ", " +
        (Sql-Escape $p.title) + ", " +
        (Sql-Escape $p.slug) + ", " +
        (Sql-Escape $p.category) + ", " +
        (Sql-Escape $p.jenjang) + ", " +
        (Sql-Escape $p.desc) + ", " +
        (Sql-Escape $featuresJson) + ", " +
        (Sql-Escape ("/" + $p.slug)) + ", 1);"
    $sqlInserts.AppendLine($sql) | Out-Null
}

# 8. Seed System Settings
$settings = @(
    @{ key = "site_name"; val = "Next Level Study (NLS)"; desc = "Nama Situs Resmi" },
    @{ key = "site_tagline"; val = "Era Baru Pendidikan: Ekosistem Bimbingan OSN, SNBT, & Les Privat Terdepan"; desc = "Tagline Brand" },
    @{ key = "contact_whatsapp"; val = "+62 851-6307-0002"; desc = "Nomor Resmi WhatsApp Hotline" },
    @{ key = "contact_email"; val = "nextlevelstudyindonesia@gmail.com"; desc = "Email Resmi NLS" },
    @{ key = "office_address"; val = "Jalan Pahlawan No. 26, Duren Jaya, Bekasi Timur, Jawa Barat 17111"; desc = "Alamat Kantor Pusat" },
    @{ key = "database_version"; val = "1.0.0"; desc = "Versi Skema Relasional SQLite" },
    @{ key = "last_sync_time"; val = (Get-Date -Format "o"); desc = "Waktu Sinkronisasi Database Terakhir" }
)

foreach ($s in $settings) {
    $sql = "INSERT INTO system_settings (key, value, description) VALUES (" +
        (Sql-Escape $s.key) + ", " +
        (Sql-Escape $s.val) + ", " +
        (Sql-Escape $s.desc) + ");"
    $sqlInserts.AppendLine($sql) | Out-Null
}

$sqlInserts.AppendLine("COMMIT;") | Out-Null

# Save SQL Seed file
[System.IO.File]::WriteAllText($seedSqlPath, $sqlInserts.ToString(), [System.Text.Encoding]::UTF8)
Write-Host "Generated seed_data.sql file successfully."

# Execute seed data into SQLite database
& $sqliteExe $dbPath ".read '$($seedSqlPath.Replace('\', '/'))'"
Write-Host "Imported all seed data into nls_database.sqlite successfully!"

# 9. Verify Table Counts
Write-Host "`n=== SQLITE DATABASE SUMMARY & VERIFICATION ==="
$tables = @("articles", "events", "teachers", "teacher_applications", "programs", "system_settings")
foreach ($t in $tables) {
    $count = & $sqliteExe $dbPath "SELECT COUNT(*) FROM $t;"
    Write-Host "• Table [$t]: $count records"
}
