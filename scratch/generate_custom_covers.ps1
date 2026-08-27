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
$fontTitleLarge = New-Object System.Drawing.Font('Arial', 32, [System.Drawing.FontStyle]::Bold)
$fontSubTitle = New-Object System.Drawing.Font('Arial', 17, [System.Drawing.FontStyle]::Regular)
$fontFeature = New-Object System.Drawing.Font('Arial', 15, [System.Drawing.FontStyle]::Bold)
$fontScoreHeader = New-Object System.Drawing.Font('Arial', 13, [System.Drawing.FontStyle]::Bold)
$fontScoreVal = New-Object System.Drawing.Font('Arial', 44, [System.Drawing.FontStyle]::Bold)
$fontScoreDesc = New-Object System.Drawing.Font('Arial', 13, [System.Drawing.FontStyle]::Regular)
$fontScoreBullet = New-Object System.Drawing.Font('Arial', 12, [System.Drawing.FontStyle]::Regular)
$fontFooter = New-Object System.Drawing.Font('Arial', 12, [System.Drawing.FontStyle]::Bold)

$brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$brushLight = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 226, 232, 240))
$brushMuted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 148, 163, 184))

# Helper to draw graphical bullet points
function Draw-FeatureItem {
    param(
        [System.Drawing.Graphics]$g,
        [int]$x,
        [int]$y,
        [string]$text,
        [System.Drawing.Brush]$bulletBrush,
        [System.Drawing.Brush]$textBrush
    )
    # Glowing bullet icon
    $g.FillEllipse($bulletBrush, $x, $y + 4, 12, 12)
    $g.DrawString($text, $fontFeature, $textBrush, ($x + 22), $y)
}

function Draw-ScoreBullet {
    param(
        [System.Drawing.Graphics]$g,
        [int]$x,
        [int]$y,
        [string]$text,
        [System.Drawing.Brush]$bulletBrush,
        [System.Drawing.Brush]$textBrush
    )
    $g.FillEllipse($bulletBrush, $x, $y + 4, 8, 8)
    $g.DrawString($text, $fontScoreBullet, $textBrush, ($x + 16), $y)
}

# =========================================================================
# BANNER 1: PANDUAN LENGKAP PERSIAPAN SNBT 2027 & SISTEM IRT
# =========================================================================
$bmp1 = New-Object System.Drawing.Bitmap($width, $height)
$g1 = [System.Drawing.Graphics]::FromImage($bmp1)
$g1.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g1.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$bgBrush1 = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(0, 0)),
    (New-Object System.Drawing.Point($width, $height)),
    [System.Drawing.Color]::FromArgb(255, 2, 132, 199),  # Sky-600
    [System.Drawing.Color]::FromArgb(255, 15, 23, 42)   # Dark Slate
)
$g1.FillRectangle($bgBrush1, 0, 0, $width, $height)

$gridPen1 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(25, 255, 255, 255), 1)
for ($x = 0; $x -lt $width; $x += 64) { $g1.DrawLine($gridPen1, $x, 0, $x, $height) }
for ($y = 0; $y -lt $height; $y += 64) { $g1.DrawLine($gridPen1, 0, $y, $width, $y) }

$glowBrush1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, 56, 189, 248))
$g1.FillEllipse($glowBrush1, 800, -100, 600, 600)
$glowBrush1b = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(35, 16, 185, 129))
$g1.FillEllipse($glowBrush1b, 900, 300, 500, 500)

$cardRect1 = New-Object System.Drawing.Rectangle(60, 60, $cardW, $cardH)
$cardPath1 = Create-RoundedRectanglePath $cardRect1 32
$cardBg1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(235, 11, 19, 38))
$cardBorder1 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(140, 56, 189, 248), 2.5)
$g1.FillPath($cardBg1, $cardPath1)
$g1.DrawPath($cardBorder1, $cardPath1)

# Badge Pill
$badgeRect1 = New-Object System.Drawing.Rectangle(105, 105, 300, 44)
$badgePath1 = Create-RoundedRectanglePath $badgeRect1 22
$badgeBg1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 2, 132, 199))
$g1.FillPath($badgeBg1, $badgePath1)
$g1.DrawString('TARGET PTN IMPIAN 2027', $fontBadge, $brushWhite, 125, 117)

# Title & Subtitle with Bounds
$brushSky = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 56, 189, 248))
$brushEmerald = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 52, 211, 153))

$titleRect1 = New-Object System.Drawing.RectangleF(105, 168, 640, 95)
$g1.DrawString("PANDUAN LENGKAP`nPERSIAPAN SNBT 2027", $fontTitleLarge, $brushWhite, $titleRect1)

$subTitleRect1 = New-Object System.Drawing.RectangleF(105, 268, 640, 55)
$g1.DrawString('Strategi Lolos PTN Favorit dengan Sistem Penilaian IRT (Item Response Theory)', $fontSubTitle, $brushSky, $subTitleRect1)

# Feature Bullets with Glowing Badges
Draw-FeatureItem $g1 105 335 'Pemetaan 7 Subtes TPS & Literasi Bahasa' $brushSky $brushLight
Draw-FeatureItem $g1 105 380 'Analisis Bobot Soal IRT & Simulasi Skor Nasional' $brushEmerald $brushLight
Draw-FeatureItem $g1 105 425 'Jadwal Try Out Intensif CBT Next Level Study' $brushSky $brushLight
Draw-FeatureItem $g1 105 470 'Manajemen Waktu & Strategi Eliminasi Jawaban' $brushEmerald $brushLight

# Right Feature Box
$scoreBoxRect = New-Object System.Drawing.Rectangle(775, 110, 385, 420)
$scoreBoxPath = Create-RoundedRectanglePath $scoreBoxRect 24
$scoreBoxBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(215, 17, 24, 39))
$scoreBoxBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 16, 185, 129), 2.5)
$g1.FillPath($scoreBoxBg, $scoreBoxPath)
$g1.DrawPath($scoreBoxBorder, $scoreBoxPath)

$g1.DrawString('TARGET SKOR IRT PTN', $fontScoreHeader, $brushEmerald, 810, 140)
$g1.DrawString('750+', $fontScoreVal, $brushWhite, 810, 175)
$g1.DrawString('Peluang Lolos ITB, UI, UGM & UNAIR', $fontScoreDesc, $brushSky, 810, 255)

# Score Bars
$g1.FillRectangle((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 14, 165, 233))), 810, 295, 310, 16)
$g1.FillRectangle((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 16, 185, 129))), 810, 325, 280, 16)
$g1.FillRectangle((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 245, 158, 11))), 810, 355, 240, 16)

Draw-ScoreBullet $g1 810 400 '100% CBT Mock Test Interface' $brushSky $brushLight
Draw-ScoreBullet $g1 810 435 'Evaluasi Kelemahan Soal Realtime' $brushEmerald $brushLight
Draw-ScoreBullet $g1 810 470 'Analisis Daya Tampung & Keketatan' $brushSky $brushEmerald

# Brand Footer
$g1.DrawString('NEXT LEVEL STUDY - PUSAT BIMBINGAN UTBK SNBT TERBAIK', $fontFooter, $brushMuted, 105, 555)

$dest1 = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\images\blog\cover-snbt-2027.jpg"
$bmp1.Save($dest1, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g1.Dispose()
$bmp1.Dispose()
Write-Host 'Updated Banner 1: cover-snbt-2027.jpg'


# =========================================================================
# BANNER 2: BEDAH SILABUS & POLA SOAL OSN 2026 JENJANG SMA
# =========================================================================
$bmp2 = New-Object System.Drawing.Bitmap($width, $height)
$g2 = [System.Drawing.Graphics]::FromImage($bmp2)
$g2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g2.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$bgBrush2 = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(0, 0)),
    (New-Object System.Drawing.Point($width, $height)),
    [System.Drawing.Color]::FromArgb(255, 217, 119, 6),  # Amber-600
    [System.Drawing.Color]::FromArgb(255, 15, 23, 42)   # Dark Slate
)
$g2.FillRectangle($bgBrush2, 0, 0, $width, $height)

$gridPen2 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(25, 255, 255, 255), 1)
for ($x = 0; $x -lt $width; $x += 64) { $g2.DrawLine($gridPen2, $x, 0, $x, $height) }
for ($y = 0; $y -lt $height; $y += 64) { $g2.DrawLine($gridPen2, 0, $y, $width, $y) }

$glowBrush2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(45, 245, 158, 11))
$g2.FillEllipse($glowBrush2, 850, -80, 550, 550)
$glowBrush2b = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, 168, 85, 247))
$g2.FillEllipse($glowBrush2b, 750, 250, 550, 550)

$cardRect2 = New-Object System.Drawing.Rectangle(60, 60, $cardW, $cardH)
$cardPath2 = Create-RoundedRectanglePath $cardRect2 32
$cardBg2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(235, 15, 20, 35))
$cardBorder2 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 245, 158, 11), 2.5)
$g2.FillPath($cardBg2, $cardPath2)
$g2.DrawPath($cardBorder2, $cardPath2)

# Badge Pill
$badgeRect2 = New-Object System.Drawing.Rectangle(105, 105, 330, 44)
$badgePath2 = Create-RoundedRectanglePath $badgeRect2 22
$badgeBg2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 217, 119, 6))
$g2.FillPath($badgeBg2, $badgePath2)
$g2.DrawString('OLIMPIADE SAINS NASIONAL 2026', $fontBadge, $brushWhite, 120, 117)

# Title & Subtitle with Bounds
$brushGold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 251, 191, 36))
$brushPurple = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 192, 132, 252))

$titleRect2 = New-Object System.Drawing.RectangleF(105, 168, 640, 95)
$g2.DrawString("BEDAH SILABUS &`nPOLA SOAL OSN 2026", $fontTitleLarge, $brushGold, $titleRect2)

$subTitleRect2 = New-Object System.Drawing.RectangleF(105, 268, 640, 55)
$g2.DrawString('Strategi Penguasaan Konsep Lanjutan & Problem Solving Medalis SMA', $fontSubTitle, $brushPurple, $subTitleRect2)

# Features with Glowing Badges
Draw-FeatureItem $g2 105 335 '9 Bidang Sains: Matematika, Fisika, Kimia, Biologi...' $brushGold $brushLight
Draw-FeatureItem $g2 105 380 'Pola Soal Non-Rutin & Logika Heuristik Olimpiade' $brushPurple $brushLight
Draw-FeatureItem $g2 105 425 'Silabus Resmi BPTI Kemendikbudristek Jenjang SMA' $brushGold $brushLight
Draw-FeatureItem $g2 105 470 'Mentorship Langsung Bersama Tutor Medalis Juara' $brushPurple $brushLight

# Right Feature Box
$medalBoxRect = New-Object System.Drawing.Rectangle(775, 110, 385, 420)
$medalBoxPath = Create-RoundedRectanglePath $medalBoxRect 24
$medalBoxBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(215, 28, 25, 60))
$medalBoxBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 251, 191, 36), 2.5)
$g2.FillPath($medalBoxBg, $medalBoxPath)
$g2.DrawPath($medalBoxBorder, $medalBoxPath)

$g2.DrawString('PROGRAM PEMBINAAN OSN', $fontScoreHeader, $brushGold, 810, 140)
$g2.DrawString('MEDALIS', $fontScoreVal, $brushWhite, 805, 175)
$g2.DrawString('Track Emas / Perak / Perunggu', $fontScoreDesc, $brushPurple, 810, 255)

$fontFormula = New-Object System.Drawing.Font('Arial', 15, [System.Drawing.FontStyle]::Italic)
$g2.DrawString('Integral f(x)dx  |  F = m.a  |  E = mc2', $fontFormula, $brushGold, 810, 300)
$g2.DrawString('Delta G = Delta H - T.Delta S  |  PV = nRT', $fontFormula, $brushGold, 810, 335)

Draw-ScoreBullet $g2 810 390 'Pembahasan Soal OSN-K, OSN-P, OSN-N' $brushGold $brushLight
Draw-ScoreBullet $g2 810 425 'Trik Cepat & Pembuktian Teorema' $brushPurple $brushLight
Draw-ScoreBullet $g2 810 460 'Lolos Pelatnas Olimpiade Internasional' $brushGold $brushGold

# Brand Footer
$g2.DrawString('NEXT LEVEL STUDY - PUSAT PEMBINAAN OLIMPIADE SAINS NASIONAL', $fontFooter, $brushMuted, 105, 555)

$dest2 = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\images\blog\cover-osn-silabus.jpg"
$bmp2.Save($dest2, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g2.Dispose()
$bmp2.Dispose()
Write-Host 'Updated Banner 2: cover-osn-silabus.jpg'


# =========================================================================
# BANNER 3: TIPS MEMILIH JURUSAN KULIAH SESUAI MINAT, BAKAT, & KARIER
# =========================================================================
$bmp3 = New-Object System.Drawing.Bitmap($width, $height)
$g3 = [System.Drawing.Graphics]::FromImage($bmp3)
$g3.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g3.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$bgBrush3 = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(0, 0)),
    (New-Object System.Drawing.Point($width, $height)),
    [System.Drawing.Color]::FromArgb(255, 124, 58, 237), # Violet-600
    [System.Drawing.Color]::FromArgb(255, 15, 23, 42)   # Dark Slate
)
$g3.FillRectangle($bgBrush3, 0, 0, $width, $height)

$gridPen3 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(25, 255, 255, 255), 1)
for ($x = 0; $x -lt $width; $x += 64) { $g3.DrawLine($gridPen3, $x, 0, $x, $height) }
for ($y = 0; $y -lt $height; $y += 64) { $g3.DrawLine($gridPen3, 0, $y, $width, $y) }

$glowBrush3 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(45, 168, 85, 247))
$g3.FillEllipse($glowBrush3, 850, -80, 550, 550)
$glowBrush3b = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, 244, 63, 94))
$g3.FillEllipse($glowBrush3b, 750, 250, 550, 550)

$cardRect3 = New-Object System.Drawing.Rectangle(60, 60, $cardW, $cardH)
$cardPath3 = Create-RoundedRectanglePath $cardRect3 32
$cardBg3 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(235, 18, 15, 38))
$cardBorder3 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 168, 85, 247), 2.5)
$g3.FillPath($cardBg3, $cardPath3)
$g3.DrawPath($cardBorder3, $cardPath3)

# Badge Pill
$badgeRect3 = New-Object System.Drawing.Rectangle(105, 105, 310, 44)
$badgePath3 = Create-RoundedRectanglePath $badgeRect3 22
$badgeBg3 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 147, 51, 234))
$g3.FillPath($badgeBg3, $badgePath3)
$g3.DrawString('PANDUAN KARIER & KULIAH', $fontBadge, $brushWhite, 125, 117)

# Title & Subtitle with Bounds
$brushRose = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 251, 113, 133))

$titleRect3 = New-Object System.Drawing.RectangleF(105, 168, 640, 95)
$g3.DrawString("TIPS MEMILIH`nJURUSAN KULIAH PTN", $fontTitleLarge, $brushWhite, $titleRect3)

$subTitleRect3 = New-Object System.Drawing.RectangleF(105, 268, 640, 55)
$g3.DrawString('Formula 3A: Aptitude, Affinity, & Application Menuju Karier Masa Depan', $fontSubTitle, $brushRose, $subTitleRect3)

# Features with Glowing Badges
Draw-FeatureItem $g3 105 335 'Pemetaan Minat, Bakat, & Karakteristik Diri' $brushRose $brushLight
Draw-FeatureItem $g3 105 380 'Analisis Prospek Karier & Industri Global 2026-2030' $brushPurple $brushLight
Draw-FeatureItem $g3 105 425 'Strategi Pemilihan Jurusan SNBP & SNBT Anti-Salah Jurusan' $brushRose $brushLight
Draw-FeatureItem $g3 105 470 'Rasio Keketatan & Passing Grade Program Studi Favorit' $brushPurple $brushLight

# Right Feature Box
$careerBoxRect = New-Object System.Drawing.Rectangle(775, 110, 385, 420)
$careerBoxPath = Create-RoundedRectanglePath $careerBoxRect 24
$careerBoxBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(215, 38, 18, 55))
$careerBoxBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 244, 63, 94), 2.5)
$g3.FillPath($careerBoxBg, $careerBoxPath)
$g3.DrawPath($careerBoxBorder, $careerBoxPath)

$g3.DrawString('FORMULA 3A NLS', $fontScoreHeader, $brushRose, 810, 140)
$g3.DrawString('FORMULA 3A', $fontScoreVal, $brushWhite, 805, 175)
$g3.DrawString('Kunci Sukses Menentukan Jurusan PTN', $fontScoreDesc, $brushLight, 810, 255)

$fontFormula3A = New-Object System.Drawing.Font('Arial', 14, [System.Drawing.FontStyle]::Bold)
$g3.DrawString('1. Aptitude (Bakat & Potensi Akademik)', $fontFormula3A, $brushRose, 810, 300)
$g3.DrawString('2. Affinity (Passion & Minat Belajar)', $fontFormula3A, $brushRose, 810, 340)
$g3.DrawString('3. Application (Peluang Karier Kerja)', $fontFormula3A, $brushRose, 810, 380)

Draw-ScoreBullet $g3 810 435 'Konsultasi 1-on-1 dengan Mentor PTN' $brushLight $brushLight
Draw-ScoreBullet $g3 810 470 'Tes Minat Bakat & Jurusan Rekomendasi' $brushRose $brushRose

# Brand Footer
$g3.DrawString('NEXT LEVEL STUDY - KONSULTASI PEMILIHAN JURUSAN & KARIER PTN', $fontFooter, $brushMuted, 105, 555)

$dest3 = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\images\blog\cover-jurusan-kuliah.jpg"
$bmp3.Save($dest3, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g3.Dispose()
$bmp3.Dispose()
Write-Host 'Updated Banner 3: cover-jurusan-kuliah.jpg'

Write-Host 'SUCCESS: All 3 banners regenerated cleanly without encoding issues!'
