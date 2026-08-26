$root = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame"

# Get all html files
$htmlFiles = Get-ChildItem -Path $root -Filter "*.html" -Recurse | Where-Object { $_.FullName -notmatch '\\\.git\\' }

foreach ($file in $htmlFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $modified = $false

    # Update menu Bimbel TKA description
    if ($content -match '<p class="text-xs text-on-surface-variant">Bimbingan Tes Kemampuan Akademik\.</p>') {
        $content = $content.Replace('<p class="text-xs text-on-surface-variant">Bimbingan Tes Kemampuan Akademik.</p>', '<p class="text-xs text-on-surface-variant">Bimbingan Tes Kemampuan Akademik (Pusmendik).</p>')
        $modified = $true
    }

    # Update menu Try Out TKA description
    if ($content -match '<p class="text-xs text-on-surface-variant">Simulasi Tes Kemampuan Akademik &amp; SNBP\.</p>') {
        $content = $content.Replace('<p class="text-xs text-on-surface-variant">Simulasi Tes Kemampuan Akademik &amp; SNBP.</p>', '<p class="text-xs text-on-surface-variant">Simulasi TKA Pusmendik Kemendikdasmen &amp; SNBP.</p>')
        $modified = $true
    }

    if ($modified) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Updated menus in: " $file.FullName
    }
}

# Update programs/index.html
$progPath = Join-Path $root "programs\index.html"
if (Test-Path $progPath) {
    $pContent = [System.IO.File]::ReadAllText($progPath, [System.Text.Encoding]::UTF8)
    $oldCard = '(?s)<h3 class="text-2xl font-bold text-on-background mb-3 font-heading">Tes Kemampuan Akademik \(TKA\)</h3>\s*<p class="text-on-surface-variant mb-6 flex-grow">.*?</p>'
    $newCard = '<h3 class="text-2xl font-bold text-on-background mb-3 font-heading">Tes Kemampuan Akademik (TKA) Pusmendik</h3>
          <p class="text-on-surface-variant mb-6 flex-grow">Bimbingan resmi mengacu kerangka asesmen Pusmendik Kemendikdasmen RI mencakup Mata Pelajaran Wajib (Matematika, B. Indonesia, B. Inggris) dan Mata Pelajaran Pilihan (Saintek/Soshum/Bahasa/Vokasi) untuk seleksi SNBP & pemetaan akademik terstandar.</p>'
    $pContent = [System.Text.RegularExpressions.Regex]::Replace($pContent, $oldCard, $newCard)
    [System.IO.File]::WriteAllText($progPath, $pContent, [System.Text.Encoding]::UTF8)
    Write-Host "Updated programs/index.html card"
}

# Update programs/tes-kemampuan-akademik/index.html
$tkaProgPath = Join-Path $root "programs\tes-kemampuan-akademik\index.html"
if (Test-Path $tkaProgPath) {
    $tpContent = [System.IO.File]::ReadAllText($tkaProgPath, [System.Text.Encoding]::UTF8)
    
    $oldTkaProgDesc = '(?s)<p class="text-lg text-on-surface-variant leading-relaxed max-w-xl">\s*Pendalaman materi spesifik untuk ujian mandiri PTN dan kebutuhan seleksi akademik berbasis mapel\.\s*</p>'
    $newTkaProgDesc = '<p class="text-lg text-on-surface-variant leading-relaxed max-w-xl">
              Program bimbingan komprehensif mengacu langsung pada kerangka asesmen resmi <strong>Pusat Asesmen Pendidikan (Pusmendik) Kemendikdasmen RI</strong> untuk persiapan pelaporan capaian akademik terstandar nasional, seleksi SNBP, dan pemetaan kelulusan PTN.
            </p>'
    $tpContent = [System.Text.RegularExpressions.Regex]::Replace($tpContent, $oldTkaProgDesc, $newTkaProgDesc)

    $oldFeatures = '(?s)<ul class="space-y-4">.*?</ul>'
    $newFeatures = @'
<ul class="space-y-4">
    <li class="flex items-start gap-4">
        <div class="mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-indigo-50">
            <svg class="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
        </div>
        <span class="text-on-surface-variant leading-relaxed font-medium"><strong>Mata Pelajaran Wajib</strong>: Bahasa Indonesia, Matematika, dan Bahasa Inggris sesuai silabus resmi Pusmendik</span>
    </li>
    <li class="flex items-start gap-4">
        <div class="mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-indigo-50">
            <svg class="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
        </div>
        <span class="text-on-surface-variant leading-relaxed font-medium"><strong>Mata Pelajaran Pilihan</strong>: Saintek (Matematika Lanjut, Fisika, Kimia, Biologi), Soshum (Ekonomi, Geografi, Sosiologi, Sejarah, PPKn), Bahasa Asing, & Vokasi SMK</span>
    </li>
    <li class="flex items-start gap-4">
        <div class="mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-indigo-50">
            <svg class="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
        </div>
        <span class="text-on-surface-variant leading-relaxed font-medium">Latihan 4 format soal resmi: PG Sederhana, PG Kompleks, PG Majemuk (Benar/Salah), & Menjodohkan</span>
    </li>
    <li class="flex items-start gap-4">
        <div class="mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-indigo-50">
            <svg class="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
        </div>
        <span class="text-on-surface-variant leading-relaxed font-medium">Simulasi CBT terstandar nasional dan analisis skor IRT untuk strategi kelulusan jalur SNBP</span>
    </li>
</ul>
<div class="mt-6 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between gap-4">
    <div class="text-xs text-indigo-950 font-medium">
        <span class="font-bold">Rujukan Resmi:</span> Portal Pusmendik Kemendikdasmen RI
    </div>
    <a href="https://pusmendik.kemendikdasmen.go.id/tka/tka/view/mata-pelajaran-wajib/sma" target="_blank" rel="noopener noreferrer"
        class="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors inline-flex items-center gap-1 shrink-0">
        <span>Buka Silabus Pusmendik</span>
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
    </a>
</div>
'@
    $tpContent = [System.Text.RegularExpressions.Regex]::Replace($tpContent, $oldFeatures, $newFeatures)
    [System.IO.File]::WriteAllText($tkaProgPath, $tpContent, [System.Text.Encoding]::UTF8)
    Write-Host "Updated programs/tes-kemampuan-akademik/index.html details"
}

# Update privat/index.html & theme.js
$privatPath = Join-Path $root "privat\index.html"
if (Test-Path $privatPath) {
    $prContent = [System.IO.File]::ReadAllText($privatPath, [System.Text.Encoding]::UTF8)
    $prContent = $prContent.Replace("'Tes Kemampuan Akademik (TKA Saintek/Soshum)'", "'Tes Kemampuan Akademik (TKA Pusmendik - Mapel Wajib & Pilihan)'")
    [System.IO.File]::WriteAllText($privatPath, $prContent, [System.Text.Encoding]::UTF8)
    Write-Host "Updated privat/index.html"
}

$themeJsPath = Join-Path $root "theme.js"
if (Test-Path $themeJsPath) {
    $tJsContent = [System.IO.File]::ReadAllText($themeJsPath, [System.Text.Encoding]::UTF8)
    $tJsContent = $tJsContent.Replace("tagline: 'Akademik Harian, TKA & Persiapan SNBT'", "tagline: 'Akademik Harian, TKA Pusmendik & Persiapan SNBT'")
    $tJsContent = $tJsContent.Replace("'Tes Kemampuan Akademik (TKA Saintek/Soshum)'", "'Tes Kemampuan Akademik (TKA Pusmendik - Mapel Wajib & Pilihan)'")
    [System.IO.File]::WriteAllText($themeJsPath, $tJsContent, [System.Text.Encoding]::UTF8)
    Write-Host "Updated theme.js"
}

Write-Host "FINISHED APPLYING TKA PUSMENDIK STANDARDS EVERYWHERE!"
