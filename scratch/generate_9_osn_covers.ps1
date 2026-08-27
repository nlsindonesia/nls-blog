Add-Type -AssemblyName System.Drawing

function Create-RoundedRectanglePath {
    param(
        [System.Drawing.Rectangle]$rect,
        [int]$radius
    )
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $diameter = $radius * 2
    $size = New-Object System.Drawing.Size($diameter, $diameter)
    $arc = New-Object System.Drawing.Rectangle($rect.Location, $size)

    # Top Left
    $path.AddArc($arc, 180, 90)
    # Top Right
    $arc.X = $rect.Right - $diameter
    $path.AddArc($arc, 270, 90)
    # Bottom Right
    $arc.Y = $rect.Bottom - $diameter
    $path.AddArc($arc, 0, 90)
    # Bottom Left
    $arc.X = $rect.Left
    $path.AddArc($arc, 90, 90)

    $path.CloseFigure()
    return $path
}

$width = 1280
$height = 720
$cardW = $width - 120
$cardH = $height - 120

$fontBadge = New-Object System.Drawing.Font('Arial', 13, [System.Drawing.FontStyle]::Bold)
$fontTitle = New-Object System.Drawing.Font('Arial', 32, [System.Drawing.FontStyle]::Bold)
$fontSubTitle = New-Object System.Drawing.Font('Arial', 17, [System.Drawing.FontStyle]::Regular)
$fontFeature = New-Object System.Drawing.Font('Arial', 14.5, [System.Drawing.FontStyle]::Bold)
$fontBoxHeader = New-Object System.Drawing.Font('Arial', 13, [System.Drawing.FontStyle]::Bold)
$fontBoxVal = New-Object System.Drawing.Font('Arial', 34, [System.Drawing.FontStyle]::Bold)
$fontBoxDesc = New-Object System.Drawing.Font('Arial', 12.5, [System.Drawing.FontStyle]::Regular)
$fontBullet = New-Object System.Drawing.Font('Arial', 12, [System.Drawing.FontStyle]::Regular)
$fontFooter = New-Object System.Drawing.Font('Arial', 12, [System.Drawing.FontStyle]::Bold)

$brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$brushLight = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 226, 232, 240))
$brushMuted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 148, 163, 184))

function Generate-SimpleOsnBanner {
    param(
        [string]$fileName,
        [string]$badgeText,
        [string]$titleLine1,
        [string]$titleLine2,
        [string]$subTitle,
        [string[]]$features,
        [string]$boxHeader,
        [string]$boxMain,
        [string]$boxDesc,
        [string[]]$boxBullets,
        [System.Drawing.Color]$gradStart,
        [System.Drawing.Color]$gradEnd,
        [System.Drawing.Color]$accentColor,
        [System.Drawing.Color]$badgeColor
    )

    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Background Gradient
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Point(0, 0)),
        (New-Object System.Drawing.Point($width, $height)),
        $gradStart,
        $gradEnd
    )
    $g.FillRectangle($bgBrush, 0, 0, $width, $height)

    # Subtle Grid Lines
    $gridPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(20, 255, 255, 255), 1)
    for ($x = 0; $x -lt $width; $x += 64) { $g.DrawLine($gridPen, $x, 0, $x, $height) }
    for ($y = 0; $y -lt $height; $y += 64) { $g.DrawLine($gridPen, 0, $y, $width, $y) }

    # Soft glowing radial ambiance
    $glowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(35, $accentColor.R, $accentColor.G, $accentColor.B))
    $g.FillEllipse($glowBrush, 750, -100, 650, 650)
    $glowBrush2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 255, 255, 255))
    $g.FillEllipse($glowBrush2, 850, 250, 500, 500)

    # Clean Glass Card
    $cardRect = New-Object System.Drawing.Rectangle(60, 60, $cardW, $cardH)
    $cardPath = Create-RoundedRectanglePath $cardRect 32
    $cardBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(235, 12, 18, 32))
    $cardBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(140, $accentColor.R, $accentColor.G, $accentColor.B), 2.5)
    $g.FillPath($cardBg, $cardPath)
    $g.DrawPath($cardBorder, $cardPath)

    # Badge Pill
    $badgeRect = New-Object System.Drawing.Rectangle(105, 105, 330, 44)
    $badgePath = Create-RoundedRectanglePath $badgeRect 22
    $badgeBg = New-Object System.Drawing.SolidBrush($badgeColor)
    $g.FillPath($badgeBg, $badgePath)
    $g.DrawString($badgeText, $fontBadge, $brushWhite, 120, 117)

    # Title & Subtitle with Bounds
    $brushAccent = New-Object System.Drawing.SolidBrush($accentColor)
    $titleRect = New-Object System.Drawing.RectangleF(105, 168, 640, 95)
    $fullTitle = "$titleLine1`n$titleLine2"
    $g.DrawString($fullTitle, $fontTitle, $brushWhite, $titleRect)

    $subTitleRect = New-Object System.Drawing.RectangleF(105, 268, 640, 55)
    $g.DrawString($subTitle, $fontSubTitle, $brushAccent, $subTitleRect)

    # Feature Bullets
    $yPos = 335
    foreach ($feat in $features) {
        $g.FillEllipse($brushAccent, 105, $yPos + 4, 11, 11)
        $featRect = New-Object System.Drawing.RectangleF(124, $yPos, 620, 40)
        $g.DrawString($feat, $fontFeature, $brushLight, $featRect)
        $yPos += 45
    }

    # Right Feature Box
    $boxRect = New-Object System.Drawing.Rectangle(775, 110, 385, 420)
    $boxPath = Create-RoundedRectanglePath $boxRect 24
    $boxBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(215, 18, 26, 44))
    $boxBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, $accentColor.R, $accentColor.G, $accentColor.B), 2.5)
    $g.FillPath($boxBg, $boxPath)
    $g.DrawPath($boxBorder, $boxPath)

    $g.DrawString($boxHeader, $fontBoxHeader, $brushAccent, 810, 140)
    $g.DrawString($boxMain, $fontBoxVal, $brushWhite, 805, 175)
    $g.DrawString($boxDesc, $fontBoxDesc, $brushLight, 810, 245)

    # Accent decorative bar
    $g.FillRectangle($brushAccent, 810, 285, 315, 6)

    # Box Bullet Items
    $bPos = 310
    foreach ($b in $boxBullets) {
        $g.FillEllipse($brushAccent, 810, $bPos + 4, 8, 8)
        $g.DrawString($b, $fontBullet, $brushLight, 826, $bPos)
        $bPos += 36
    }

    # Brand Footer
    $g.DrawString('NEXT LEVEL STUDY - PUSAT PEMBINAAN OLIMPIADE SAINS NASIONAL', $fontFooter, $brushMuted, 105, 555)

    $dest = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\images\blog\$fileName"
    $bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Generated: $fileName"
}

# 1. Matematika
Generate-SimpleOsnBanner `
    -fileName "cover-osn-matematika.jpg" `
    -badgeText "OSN MATEMATIKA SMA 2026" `
    -titleLine1 "TIPS BELAJAR JUARA" `
    -titleLine2 "OSN MATEMATIKA SMA" `
    -subTitle "Strategi Penguasaan 4 Pilar: Aljabar, Geometri, Teori Bilangan & Kombinatorika" `
    -features @(
        "Aljabar: Polinomial, Cauchy-Schwarz, AM-GM & Fungsi",
        "Geometri: Kongruensi, Teorema Ceva-Menelaus & Power of Point",
        "Teori Bilangan: Modulo Aritmatika, Keterbagian & Fermat",
        "Kombinatorika: Prinsip Sarang Burung (Pigeonhole) & Counting"
    ) `
    -boxHeader "TARGET MEDALI OSN" `
    -boxMain "MATEMATIKA" `
    -boxDesc "Kunci Sukses: Bukti Logis & Problem Solving" `
    -boxBullets @(
        "Latihan Soal Non-Rutin Proof-Based",
        "Metode Heuristik Polya Step-by-Step",
        "Review Soal OSN-K, OSN-P hingga IMO",
        "Pembinaan Intensif Bersama Medalis"
    ) `
    -gradStart ([System.Drawing.Color]::FromArgb(255, 2, 132, 199)) `
    -gradEnd ([System.Drawing.Color]::FromArgb(255, 15, 23, 42)) `
    -accentColor ([System.Drawing.Color]::FromArgb(255, 56, 189, 248)) `
    -badgeColor ([System.Drawing.Color]::FromArgb(255, 2, 132, 199))

# 2. Fisika
Generate-SimpleOsnBanner `
    -fileName "cover-osn-fisika.jpg" `
    -badgeText "OSN FISIKA SMA 2026" `
    -titleLine1 "TIPS BELAJAR JUARA" `
    -titleLine2 "OSN FISIKA SMA" `
    -subTitle "Pendalaman Mekanika Klasik, Elektromagnetisme, Termodinamika & Optik" `
    -features @(
        "Mekanika Analitik: Dinamika Gerak, Rotasi Benda & Osilasi",
        "Elektrodinamika: Hukum Gauss, Rangkaian & Induksi Faraday",
        "Termodinamika: Mesin Kalor Carnot & Entropi Gas Ideal",
        "Aplikasi Kalkulus Diferensial & Integral dalam Fisika"
    ) `
    -boxHeader "TARGET MEDALI OSN" `
    -boxMain "FISIKA" `
    -boxDesc "Kunci Sukses: Pemodelan Matematis Akurat" `
    -boxBullets @(
        "Visualisasi Diagram Benda Bebas (FBD)",
        "Penguasaan Kalkulus Lanjutan",
        "Eksplorasi Soal IPhO & APhO",
        "Praktikum & Analisis Ketidakpastian"
    ) `
    -gradStart ([System.Drawing.Color]::FromArgb(255, 37, 99, 235)) `
    -gradEnd ([System.Drawing.Color]::FromArgb(255, 15, 23, 42)) `
    -accentColor ([System.Drawing.Color]::FromArgb(255, 96, 165, 250)) `
    -badgeColor ([System.Drawing.Color]::FromArgb(255, 37, 99, 235))

# 3. Kimia
Generate-SimpleOsnBanner `
    -fileName "cover-osn-kimia.jpg" `
    -badgeText "OSN KIMIA SMA 2026" `
    -titleLine1 "TIPS BELAJAR JUARA" `
    -titleLine2 "OSN KIMIA SMA" `
    -subTitle "Kuasai Kimia Fisika, Organik, Anorganik & Kinetika Reaksi Kompleks" `
    -features @(
        "Kimia Fisika: Termodinamika Kimia, Kesetimbangan & Kinetika",
        "Kimia Organik: Mekanisme SN1, SN2, E1, E2 & Stereokimia",
        "Kimia Anorganik: Struktur Atom, Medan Kristal & Kompleks",
        "Kimia Analitik: Titrasi Redoks, Asam-Basa & Elektrokimia"
    ) `
    -boxHeader "TARGET MEDALI OSN" `
    -boxMain "KIMIA" `
    -boxDesc "Kunci Sukses: Mekanisme Reaksi & Stoikiometri" `
    -boxBullets @(
        "Hafalan Logis Mekanisme Reaksi",
        "Pemahaman Stoikiometri Multistep",
        "Analisis Spektroskopi NMR & IR",
        "Pembahasan Soal IChO Terpilih"
    ) `
    -gradStart ([System.Drawing.Color]::FromArgb(255, 13, 148, 136)) `
    -gradEnd ([System.Drawing.Color]::FromArgb(255, 15, 23, 42)) `
    -accentColor ([System.Drawing.Color]::FromArgb(255, 45, 212, 191)) `
    -badgeColor ([System.Drawing.Color]::FromArgb(255, 13, 148, 136))

# 4. Biologi
Generate-SimpleOsnBanner `
    -fileName "cover-osn-biologi.jpg" `
    -badgeText "OSN BIOLOGI SMA 2026" `
    -titleLine1 "TIPS BELAJAR JUARA" `
    -titleLine2 "OSN BIOLOGI SMA" `
    -subTitle "Strategi Pemahaman Biologi Sel, Genetika Molekuler & Fisiologi Organisme" `
    -features @(
        "Biologi Sel & Molekuler: Replikasi DNA, Transkripsi & Translasi",
        "Genetika: Hukum Mendel, Linkage & Rekombinasi Genetik",
        "Anatomi & Fisiologi Komparatif Tumbuhan serta Hewan",
        "Ekologi, Biosistematika & Filogeni Keanekaragaman Hayati"
    ) `
    -boxHeader "TARGET MEDALI OSN" `
    -boxMain "BIOLOGI" `
    -boxDesc "Kunci Sukses: Integrasi Konsep & Analisis Data" `
    -boxBullets @(
        "Kuasai Buku Master Campbell Biology",
        "Analisis Grafik & Eksperimen IBO",
        "Mind-Mapping Kaskade Biokimia",
        "Latihan Soal Reasoning-Heavy"
    ) `
    -gradStart ([System.Drawing.Color]::FromArgb(255, 22, 101, 52)) `
    -gradEnd ([System.Drawing.Color]::FromArgb(255, 15, 23, 42)) `
    -accentColor ([System.Drawing.Color]::FromArgb(255, 74, 222, 128)) `
    -badgeColor ([System.Drawing.Color]::FromArgb(255, 22, 101, 52))

# 5. Informatika / Komputer
Generate-SimpleOsnBanner `
    -fileName "cover-osn-informatika.jpg" `
    -badgeText "OSN INFORMATIKA SMA 2026" `
    -titleLine1 "TIPS BELAJAR JUARA" `
    -titleLine2 "OSN INFORMATIKA SMA" `
    -subTitle "Logika Komputasi, Competitive Programming C++ & Struktur Data Lanjut" `
    -features @(
        "Pemrograman C++ Modern & Standard Template Library (STL)",
        "Paradigma: Greedy, Dynamic Programming & Divide Conquer",
        "Teori Graf: DFS, BFS, Dijkstra, MST & Tree Algorithms",
        "Struktur Data: Segment Tree, Fenwick Tree & Disjoint Set"
    ) `
    -boxHeader "TARGET MEDALI OSN" `
    -boxMain "INFORMATIKA" `
    -boxDesc "Kunci Sukses: Algoritma Efisien O(N log N)" `
    -boxBullets @(
        "Latihan Rutin di Codeforces & TLX",
        "Optimasi Kompleksitas Waktu & Memori",
        "Implementasi Fast I/O & Modular Code",
        "Review Soal OSN & IOI Terkini"
    ) `
    -gradStart ([System.Drawing.Color]::FromArgb(255, 30, 41, 59)) `
    -gradEnd ([System.Drawing.Color]::FromArgb(255, 10, 15, 30)) `
    -accentColor ([System.Drawing.Color]::FromArgb(255, 129, 140, 248)) `
    -badgeColor ([System.Drawing.Color]::FromArgb(255, 99, 102, 241))

# 6. Astronomi
Generate-SimpleOsnBanner `
    -fileName "cover-osn-astronomi.jpg" `
    -badgeText "OSN ASTRONOMI SMA 2026" `
    -titleLine1 "TIPS BELAJAR JUARA" `
    -titleLine2 "OSN ASTRONOMI SMA" `
    -subTitle "Eksplorasi Astrofisika, Mekanika Benda Langit & Tata Koordinat Bola" `
    -features @(
        "Tata Koordinat Bola Langit: Horizon, Ekuatorial & Ekliptika",
        "Mekanika Benda Langit: Hukum Kepler & Gravitasi Newton",
        "Astrofisika Bintang: Radiasi Blackbody & HR-Diagram",
        "Kosmologi Dasar & Instrumentasi Teleskop Pengamatan"
    ) `
    -boxHeader "TARGET MEDALI OSN" `
    -boxMain "ASTRONOMI" `
    -boxDesc "Kunci Sukses: Trigonometri Bola & Fisika Bintang" `
    -boxBullets @(
        "Visualisasi Bola Langit 3 Dimensi",
        "Penguasaan Persamaan Astrofisika",
        "Pengolahan Data Analisis Pengamatan",
        "Latihan Soal Standar IOAA"
    ) `
    -gradStart ([System.Drawing.Color]::FromArgb(255, 49, 46, 129)) `
    -gradEnd ([System.Drawing.Color]::FromArgb(255, 10, 12, 30)) `
    -accentColor ([System.Drawing.Color]::FromArgb(255, 192, 132, 252)) `
    -badgeColor ([System.Drawing.Color]::FromArgb(255, 109, 40, 217))

# 7. Kebumian
Generate-SimpleOsnBanner `
    -fileName "cover-osn-kebumian.jpg" `
    -badgeText "OSN KEBUMIAN SMA 2026" `
    -titleLine1 "TIPS BELAJAR JUARA" `
    -titleLine2 "OSN KEBUMIAN SMA" `
    -subTitle "Kuasai 4 Pilar: Geologi, Meteorologi, Oseanografi & Astronomi Planet" `
    -features @(
        "Geologi: Tektonik Lempeng, Petrologi Batuan & Mineralogi",
        "Meteorologi: Dinamika Atmosfer, Sirkulasi Angin & Cuaca",
        "Oseanografi: Arus Termohalin, Pasang Surut & Gelombang Laut",
        "Geofisika, Kebencanaan Alam & Astronomi Tata Surya"
    ) `
    -boxHeader "TARGET MEDALI OSN" `
    -boxMain "KEBUMIAN" `
    -boxDesc "Kunci Sukses: Analisis Sistem Bumi Terpadu" `
    -boxBullets @(
        "Identifikasi Mineral & Batuan Lapangan",
        "Interpretasi Peta Geologi & Sinoptik",
        "Pemahaman Siklus Geokimia Global",
        "Latihan Soal Silabus IESO"
    ) `
    -gradStart ([System.Drawing.Color]::FromArgb(255, 180, 83, 9)) `
    -gradEnd ([System.Drawing.Color]::FromArgb(255, 15, 23, 42)) `
    -accentColor ([System.Drawing.Color]::FromArgb(255, 251, 191, 36)) `
    -badgeColor ([System.Drawing.Color]::FromArgb(255, 217, 119, 6))

# 8. Ekonomi
Generate-SimpleOsnBanner `
    -fileName "cover-osn-ekonomi.jpg" `
    -badgeText "OSN EKONOMI SMA 2026" `
    -titleLine1 "TIPS BELAJAR JUARA" `
    -titleLine2 "OSN EKONOMI SMA" `
    -subTitle "Strategi Mikroekonomi, Makroekonomi, Akuntansi & Kebijakan Fiskal" `
    -features @(
        "Mikroekonomi: Elastisitas, Struktur Pasar & Surplus Produsen",
        "Makroekonomi: Pendapatan Nasional, Inflasi & Kebijakan Moneter",
        "Akuntansi Keuangan: Siklus Akuntansi Jasa & Dagang",
        "Perdagangan Internasional, Kurs Valas & Neraca Pembayaran"
    ) `
    -boxHeader "TARGET MEDALI OSN" `
    -boxMain "EKONOMI" `
    -boxDesc "Kunci Sukses: Logika Kurva & Jurnal Akuntansi" `
    -boxBullets @(
        "Analisis Pergeseran Kurva Ekuilibrium",
        "Keterampilan Jurnal Penyesuaian Akuntansi",
        "Studi Kasus Isu Finansial Global",
        "Latihan Soal Standar IEO"
    ) `
    -gradStart ([System.Drawing.Color]::FromArgb(255, 161, 98, 7)) `
    -gradEnd ([System.Drawing.Color]::FromArgb(255, 15, 23, 42)) `
    -accentColor ([System.Drawing.Color]::FromArgb(255, 253, 224, 71)) `
    -badgeColor ([System.Drawing.Color]::FromArgb(255, 161, 98, 7))

# 9. Geografi
Generate-SimpleOsnBanner `
    -fileName "cover-osn-geografi.jpg" `
    -badgeText "OSN GEOGRAFI SMA 2026" `
    -titleLine1 "TIPS BELAJAR JUARA" `
    -titleLine2 "OSN GEOGRAFI SMA" `
    -subTitle "Geomorfologi, Klimatologi, Penginderaan Jauh (SIG) & Tata Ruang Wilayah" `
    -features @(
        "Geografi Fisik: Geomorfologi, Hidrologi & Biogeografi Lanjut",
        "Geografi Manusia: Dinamika Kependudukan & Geopolitik",
        "Penginderaan Jauh & Sistem Informasi Geografis (SIG)",
        "Manajemen Lingkungan Hidup & Mitigasi Bencana Wilayah"
    ) `
    -boxHeader "TARGET MEDALI OSN" `
    -boxMain "GEOGRAFI" `
    -boxDesc "Kunci Sukses: Analisis Spasial & Pemetaan" `
    -boxBullets @(
        "Interpretasi Citra Satelit & Peta Tematik",
        "Analisis Keruangan Komprehensif",
        "Keterampilan Fieldwork Eksplorasi",
        "Latihan Soal Silabus iGeo"
    ) `
    -gradStart ([System.Drawing.Color]::FromArgb(255, 5, 150, 105)) `
    -gradEnd ([System.Drawing.Color]::FromArgb(255, 15, 23, 42)) `
    -accentColor ([System.Drawing.Color]::FromArgb(255, 110, 231, 183)) `
    -badgeColor ([System.Drawing.Color]::FromArgb(255, 5, 150, 105))

Write-Host "SUCCESS: Regenerated all 9 OSN subject banners with clean spacing!"
