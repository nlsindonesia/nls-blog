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

$fontPill = New-Object System.Drawing.Font('Arial', 14, [System.Drawing.FontStyle]::Bold)
$fontCategory = New-Object System.Drawing.Font('Arial', 20, [System.Drawing.FontStyle]::Bold)
$fontSubject = New-Object System.Drawing.Font('Arial', 54, [System.Drawing.FontStyle]::Bold)
$fontSub = New-Object System.Drawing.Font('Arial', 22, [System.Drawing.FontStyle]::Regular)
$fontMedalTag = New-Object System.Drawing.Font('Arial', 16, [System.Drawing.FontStyle]::Bold)
$fontBrand = New-Object System.Drawing.Font('Arial', 13, [System.Drawing.FontStyle]::Bold)
$fontBigIcon = New-Object System.Drawing.Font('Arial', 40, [System.Drawing.FontStyle]::Bold)

$brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$brushMuted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 241, 245, 249))

function Generate-CanvaStyleBanner {
    param(
        [string]$fileName,
        [string]$subjectName,
        [string]$subTitle,
        [string]$pillText,
        [string]$symbolText,
        [System.Drawing.Color]$col1,
        [System.Drawing.Color]$col2,
        [System.Drawing.Color]$accentCol
    )

    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # 1. Base Rich Smooth Gradient Background (Canva aesthetic)
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Point(0, 0)),
        (New-Object System.Drawing.Point($width, $height)),
        $col1,
        $col2
    )
    $g.FillRectangle($bgBrush, 0, 0, $width, $height)

    # 2. Modern Canva Abstract Curved Shapes & Circles
    $circleBrush1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(35, 255, 255, 255))
    $g.FillEllipse($circleBrush1, 780, -120, 680, 680)

    $circleBrush2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(45, $accentCol.R, $accentCol.G, $accentCol.B))
    $g.FillEllipse($circleBrush2, 860, 220, 520, 520)

    $circleBrush3 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(25, 255, 255, 255))
    $g.FillEllipse($circleBrush3, -100, 420, 450, 450)

    # 3. Main Center Glass Frame (Simple & Clean)
    $frameRect = New-Object System.Drawing.Rectangle(70, 70, ($width - 140), ($height - 140))
    $framePath = Create-RoundedRectanglePath $frameRect 36
    $frameBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(210, 10, 15, 30))
    $frameBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(160, 255, 255, 255), 2.5)
    $g.FillPath($frameBg, $framePath)
    $g.DrawPath($frameBorder, $framePath)

    # 4. Top Minimalist Pill Badge
    $pillRect = New-Object System.Drawing.Rectangle(120, 125, 260, 44)
    $pillPath = Create-RoundedRectanglePath $pillRect 22
    $pillBg = New-Object System.Drawing.SolidBrush($col1)
    $pillBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(200, $accentCol.R, $accentCol.G, $accentCol.B), 2)
    $g.FillPath($pillBg, $pillPath)
    $g.DrawPath($pillBorder, $pillPath)
    $g.DrawString($pillText, $fontPill, $brushWhite, 142, 137)

    # 5. Big Bold Clean Typography (Minimalist & Canva Style)
    $brushAccent = New-Object System.Drawing.SolidBrush($accentCol)
    $g.DrawString("TIPS BELAJAR OSN", $fontCategory, $brushAccent, 120, 205)
    $g.DrawString($subjectName, $fontSubject, $brushWhite, 116, 240)
    $g.DrawString($subTitle, $fontSub, $brushMuted, 120, 335)

    # Clean accent bar under title
    $g.FillRectangle($brushAccent, 120, 395, 180, 6)

    # 6. Right Side Minimalist Medallion Graphic
    $circleCenter = New-Object System.Drawing.Rectangle(820, 180, 280, 280)
    $circlePath = Create-RoundedRectanglePath $circleCenter 140
    $circleMedBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 15, 23, 42))
    $circleMedBorder = New-Object System.Drawing.Pen($brushAccent, 4)
    $g.FillPath($circleMedBg, $circlePath)
    $g.DrawPath($circleMedBorder, $circlePath)

    # Inner subtle glow ring
    $innerGlowPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(80, 255, 255, 255), 2)
    $innerGlowRect = New-Object System.Drawing.Rectangle(835, 195, 250, 250)
    $innerGlowPath = Create-RoundedRectanglePath $innerGlowRect 125
    $g.DrawPath($innerGlowPen, $innerGlowPath)

    # Subject Symbol / Abbreviation
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center

    $symRect = New-Object System.Drawing.RectangleF(820, 230, 280, 70)
    $g.DrawString($symbolText, $fontBigIcon, $brushAccent, $symRect, $sf)

    $tagRect = New-Object System.Drawing.RectangleF(820, 310, 280, 50)
    $g.DrawString("MEDAL TRACK", $fontMedalTag, $brushWhite, $tagRect, $sf)

    $subTagRect = New-Object System.Drawing.RectangleF(820, 355, 280, 40)
    $g.DrawString("SMA & ALUMNI", $fontPill, $brushMuted, $subTagRect, $sf)

    # 7. Brand Footer Tag
    $g.DrawString("NEXT LEVEL STUDY  *  EDUKASI & PRESTASI", $fontBrand, $brushMuted, 120, 560)

    # Save Image
    $dest = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\images\blog\$fileName"
    $bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Generated Canva-Style Banner: $fileName"
}

# 1. Matematika
Generate-CanvaStyleBanner `
    -fileName "cover-osn-matematika.jpg" `
    -subjectName "MATEMATIKA" `
    -subTitle "Strategi Juara, 4 Pilar Teori & Problem Solving" `
    -pillText "OSN SMA 2026" `
    -symbolText "MATH" `
    -col1 ([System.Drawing.Color]::FromArgb(255, 2, 132, 199)) `
    -col2 ([System.Drawing.Color]::FromArgb(255, 12, 74, 110)) `
    -accentCol ([System.Drawing.Color]::FromArgb(255, 56, 189, 248))

# 2. Fisika
Generate-CanvaStyleBanner `
    -fileName "cover-osn-fisika.jpg" `
    -subjectName "FISIKA" `
    -subTitle "Pemodelan Matematis, Kalkulus & Soal Non-Rutin" `
    -pillText "OSN SMA 2026" `
    -symbolText "PHYSICS" `
    -col1 ([System.Drawing.Color]::FromArgb(255, 37, 99, 235)) `
    -col2 ([System.Drawing.Color]::FromArgb(255, 30, 27, 75)) `
    -accentCol ([System.Drawing.Color]::FromArgb(255, 96, 165, 250))

# 3. Kimia
Generate-CanvaStyleBanner `
    -fileName "cover-osn-kimia.jpg" `
    -subjectName "KIMIA" `
    -subTitle "Termodinamika, Reaksi Organik & Spektroskopi" `
    -pillText "OSN SMA 2026" `
    -symbolText "CHEM" `
    -col1 ([System.Drawing.Color]::FromArgb(255, 13, 148, 136)) `
    -col2 ([System.Drawing.Color]::FromArgb(255, 19, 78, 74)) `
    -accentCol ([System.Drawing.Color]::FromArgb(255, 45, 212, 191))

# 4. Biologi
Generate-CanvaStyleBanner `
    -fileName "cover-osn-biologi.jpg" `
    -subjectName "BIOLOGI" `
    -subTitle "Biologi Sel, Genetika & Analisis Data IBO" `
    -pillText "OSN SMA 2026" `
    -symbolText "BIO" `
    -col1 ([System.Drawing.Color]::FromArgb(255, 22, 101, 52)) `
    -col2 ([System.Drawing.Color]::FromArgb(255, 20, 83, 45)) `
    -accentCol ([System.Drawing.Color]::FromArgb(255, 74, 222, 128))

# 5. Informatika
Generate-CanvaStyleBanner `
    -fileName "cover-osn-informatika.jpg" `
    -subjectName "INFORMATIKA" `
    -subTitle "Competitive Programming C++ & Struktur Data" `
    -pillText "OSN SMA 2026" `
    -symbolText "CODE" `
    -col1 ([System.Drawing.Color]::FromArgb(255, 79, 70, 229)) `
    -col2 ([System.Drawing.Color]::FromArgb(255, 30, 27, 75)) `
    -accentCol ([System.Drawing.Color]::FromArgb(255, 129, 140, 248))

# 6. Astronomi
Generate-CanvaStyleBanner `
    -fileName "cover-osn-astronomi.jpg" `
    -subjectName "ASTRONOMI" `
    -subTitle "Tata Bola Langit, Astrofisika & Mekanika Orbit" `
    -pillText "OSN SMA 2026" `
    -symbolText "ASTRO" `
    -col1 ([System.Drawing.Color]::FromArgb(255, 109, 40, 217)) `
    -col2 ([System.Drawing.Color]::FromArgb(255, 59, 7, 100)) `
    -accentCol ([System.Drawing.Color]::FromArgb(255, 192, 132, 252))

# 7. Kebumian
Generate-CanvaStyleBanner `
    -fileName "cover-osn-kebumian.jpg" `
    -subjectName "KEBUMIAN" `
    -subTitle "Geologi, Meteorologi, Oseanografi & Planetologi" `
    -pillText "OSN SMA 2026" `
    -symbolText "EARTH" `
    -col1 ([System.Drawing.Color]::FromArgb(255, 194, 65, 12)) `
    -col2 ([System.Drawing.Color]::FromArgb(255, 124, 45, 18)) `
    -accentCol ([System.Drawing.Color]::FromArgb(255, 251, 146, 60))

# 8. Ekonomi
Generate-CanvaStyleBanner `
    -fileName "cover-osn-ekonomi.jpg" `
    -subjectName "EKONOMI" `
    -subTitle "Mikro-Makroekonomi, Akuntansi & Isu Finansial" `
    -pillText "OSN SMA 2026" `
    -symbolText "ECON" `
    -col1 ([System.Drawing.Color]::FromArgb(255, 180, 83, 9)) `
    -col2 ([System.Drawing.Color]::FromArgb(255, 120, 53, 15)) `
    -accentCol ([System.Drawing.Color]::FromArgb(255, 251, 191, 36))

# 9. Geografi
Generate-CanvaStyleBanner `
    -fileName "cover-osn-geografi.jpg" `
    -subjectName "GEOGRAFI" `
    -subTitle "Analisis Spasial Keruangan, SIG & Geomorfologi" `
    -pillText "OSN SMA 2026" `
    -symbolText "GEO" `
    -col1 ([System.Drawing.Color]::FromArgb(255, 5, 150, 105)) `
    -col2 ([System.Drawing.Color]::FromArgb(255, 6, 78, 59)) `
    -accentCol ([System.Drawing.Color]::FromArgb(255, 52, 211, 153))

Write-Host "SUCCESS: Generated all 9 Canva-style minimalist banners!"
