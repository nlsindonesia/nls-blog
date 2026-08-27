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

$fontPill = New-Object System.Drawing.Font('Arial', 13, [System.Drawing.FontStyle]::Bold)
$fontCategory = New-Object System.Drawing.Font('Arial', 18, [System.Drawing.FontStyle]::Bold)
$fontSubject = New-Object System.Drawing.Font('Arial', 54, [System.Drawing.FontStyle]::Bold)
$fontSub = New-Object System.Drawing.Font('Arial', 21, [System.Drawing.FontStyle]::Regular)
$fontMedalTag = New-Object System.Drawing.Font('Arial', 14, [System.Drawing.FontStyle]::Bold)
$fontBrand = New-Object System.Drawing.Font('Arial', 13, [System.Drawing.FontStyle]::Bold)

function Generate-BrightCanvaBanner {
    param(
        [string]$fileName,
        [string]$subjectName,
        [string]$subTitle,
        [string]$pillText,
        [string]$symbolText,
        [int]$symbolFontSize,
        [System.Drawing.Color]$bgCol1,
        [System.Drawing.Color]$bgCol2,
        [System.Drawing.Color]$primaryCol,
        [System.Drawing.Color]$accentCol
    )

    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # 1. Base Bright Radiant Gradient Background (Canva Fresh & Sunny Look)
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Point(0, 0)),
        (New-Object System.Drawing.Point($width, $height)),
        $bgCol1,
        $bgCol2
    )
    $g.FillRectangle($bgBrush, 0, 0, $width, $height)

    # 2. Cheerful, Bright Canva Blobs and Soft Geometric Circles
    $blobBrush1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(60, $primaryCol.R, $primaryCol.G, $primaryCol.B))
    $g.FillEllipse($blobBrush1, 780, -80, 600, 600)

    $blobBrush2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(75, $accentCol.R, $accentCol.G, $accentCol.B))
    $g.FillEllipse($blobBrush2, 920, 240, 480, 480)

    $blobBrush3 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(45, $accentCol.R, $accentCol.G, $accentCol.B))
    $g.FillEllipse($blobBrush3, -80, 450, 400, 400)

    $blobBrush4 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(35, 255, 255, 255))
    $g.FillEllipse($blobBrush4, 400, -100, 300, 300)

    # 3. Main Center Floating Clean White Card (Canva Style)
    $cardRect = New-Object System.Drawing.Rectangle(70, 70, ($width - 140), ($height - 140))
    $cardPath = Create-RoundedRectanglePath $cardRect 36
    
    # Soft Shadow
    $shadowRect = New-Object System.Drawing.Rectangle(74, 76, ($width - 140), ($height - 140))
    $shadowPath = Create-RoundedRectanglePath $shadowRect 36
    $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(25, 15, 23, 42))
    $g.FillPath($shadowBrush, $shadowPath)

    # Card Body: Crisp Pure White
    $cardBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(252, 255, 255, 255))
    $cardBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(240, 255, 255, 255), 3)
    $g.FillPath($cardBg, $cardPath)
    $g.DrawPath($cardBorder, $cardPath)

    # 4. Top Pill Badge (Bright & Vibrant)
    $pillRect = New-Object System.Drawing.Rectangle(120, 125, 250, 44)
    $pillPath = Create-RoundedRectanglePath $pillRect 22
    $pillBg = New-Object System.Drawing.SolidBrush($primaryCol)
    $g.FillPath($pillBg, $pillPath)

    $brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.DrawString($pillText, $fontPill, $brushWhite, 142, 137)

    # 5. Bold & Crisp Typography (Dark & High Contrast on White)
    $brushDark = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 15, 23, 42))
    $brushPrimary = New-Object System.Drawing.SolidBrush($primaryCol)
    $brushMuted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 100, 116, 139))

    $g.DrawString("TIPS BELAJAR OSN", $fontCategory, $brushPrimary, 120, 205)
    $g.DrawString($subjectName, $fontSubject, $brushDark, 116, 240)
    $g.DrawString($subTitle, $fontSub, $brushMuted, 120, 335)

    # Accent Highlight Bar
    $brushAccent = New-Object System.Drawing.SolidBrush($accentCol)
    $g.FillRectangle($brushAccent, 120, 395, 160, 6)

    # 6. Right Side Bright Medallion Badge (Canva Icon Element)
    $circleCenter = New-Object System.Drawing.Rectangle(820, 175, 290, 290)
    $circlePath = Create-RoundedRectanglePath $circleCenter 145

    # Medallion Gradient (Luminous & Bright)
    $medBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Point(820, 175)),
        (New-Object System.Drawing.Point(1110, 465)),
        $primaryCol,
        $accentCol
    )
    $g.FillPath($medBrush, $circlePath)

    # Inner White Ring
    $innerRingRect = New-Object System.Drawing.Rectangle(835, 190, 260, 260)
    $innerRingPath = Create-RoundedRectanglePath $innerRingRect 130
    $innerRingPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 255, 255, 255), 3)
    $g.DrawPath($innerRingPen, $innerRingPath)

    # Medallion Text (Clean Centered)
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center

    $fontSymbol = New-Object System.Drawing.Font('Arial', $symbolFontSize, [System.Drawing.FontStyle]::Bold)

    $symRect = New-Object System.Drawing.RectangleF(820, 222, 290, 70)
    $g.DrawString($symbolText, $fontSymbol, $brushWhite, $symRect, $sf)

    $tagRect = New-Object System.Drawing.RectangleF(820, 305, 290, 40)
    $g.DrawString("MEDAL TRACK", $fontMedalTag, $brushWhite, $tagRect, $sf)

    $subTagRect = New-Object System.Drawing.RectangleF(820, 348, 290, 35)
    $brushGoldTag = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 255, 255, 255))
    $g.DrawString("SMA & ALUMNI", $fontPill, $brushGoldTag, $subTagRect, $sf)

    # 7. Brand Footer Tag
    $g.DrawString("NEXT LEVEL STUDY  *  EDUKASI & PRESTASI", $fontBrand, $brushMuted, 120, 560)

    # Save Image
    $dest = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\images\blog\$fileName"
    $bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Generated Bright Canva Banner: $fileName"
}

# 1. Matematika (Bright Sky & Sunburst)
Generate-BrightCanvaBanner `
    -fileName "cover-osn-matematika.jpg" `
    -subjectName "MATEMATIKA" `
    -subTitle "Strategi Juara, 4 Pilar Teori & Problem Solving" `
    -pillText "OSN SMA 2026" `
    -symbolText "MATH" `
    -symbolFontSize 40 `
    -bgCol1 ([System.Drawing.Color]::FromArgb(255, 224, 242, 254)) `
    -bgCol2 ([System.Drawing.Color]::FromArgb(255, 186, 230, 253)) `
    -primaryCol ([System.Drawing.Color]::FromArgb(255, 2, 132, 199)) `
    -accentCol ([System.Drawing.Color]::FromArgb(255, 14, 165, 233))

# 2. Fisika (Bright Royal Cyan)
Generate-BrightCanvaBanner `
    -fileName "cover-osn-fisika.jpg" `
    -subjectName "FISIKA" `
    -subTitle "Pemodelan Matematis, Kalkulus & Soal Non-Rutin" `
    -pillText "OSN SMA 2026" `
    -symbolText "PHYS" `
    -symbolFontSize 40 `
    -bgCol1 ([System.Drawing.Color]::FromArgb(255, 238, 242, 255)) `
    -bgCol2 ([System.Drawing.Color]::FromArgb(255, 199, 210, 254)) `
    -primaryCol ([System.Drawing.Color]::FromArgb(255, 37, 99, 235)) `
    -accentCol ([System.Drawing.Color]::FromArgb(255, 79, 70, 229))

# 3. Kimia (Bright Emerald Mint)
Generate-BrightCanvaBanner `
    -fileName "cover-osn-kimia.jpg" `
    -subjectName "KIMIA" `
    -subTitle "Termodinamika, Reaksi Organik & Spektroskopi" `
    -pillText "OSN SMA 2026" `
    -symbolText "CHEM" `
    -symbolFontSize 40 `
    -bgCol1 ([System.Drawing.Color]::FromArgb(255, 204, 251, 241)) `
    -bgCol2 ([System.Drawing.Color]::FromArgb(255, 153, 246, 228)) `
    -primaryCol ([System.Drawing.Color]::FromArgb(255, 13, 148, 136)) `
    -accentCol ([System.Drawing.Color]::FromArgb(255, 5, 150, 105))

# 4. Biologi (Bright Spring Meadow)
Generate-BrightCanvaBanner `
    -fileName "cover-osn-biologi.jpg" `
    -subjectName "BIOLOGI" `
    -subTitle "Biologi Sel, Genetika & Analisis Data IBO" `
    -pillText "OSN SMA 2026" `
    -symbolText "BIO" `
    -symbolFontSize 42 `
    -bgCol1 ([System.Drawing.Color]::FromArgb(255, 220, 252, 231)) `
    -bgCol2 ([System.Drawing.Color]::FromArgb(255, 187, 247, 208)) `
    -primaryCol ([System.Drawing.Color]::FromArgb(255, 22, 163, 74)) `
    -accentCol ([System.Drawing.Color]::FromArgb(255, 16, 185, 129))

# 5. Informatika (Bright Lilac Violet)
Generate-BrightCanvaBanner `
    -fileName "cover-osn-informatika.jpg" `
    -subjectName "INFORMATIKA" `
    -subTitle "Competitive Programming C++ & Struktur Data" `
    -pillText "OSN SMA 2026" `
    -symbolText "INFO" `
    -symbolFontSize 40 `
    -bgCol1 ([System.Drawing.Color]::FromArgb(255, 243, 232, 255)) `
    -bgCol2 ([System.Drawing.Color]::FromArgb(255, 224, 231, 255)) `
    -primaryCol ([System.Drawing.Color]::FromArgb(255, 99, 102, 241)) `
    -accentCol ([System.Drawing.Color]::FromArgb(255, 139, 92, 246))

# 6. Astronomi (Bright Cosmic Peach Lavender)
Generate-BrightCanvaBanner `
    -fileName "cover-osn-astronomi.jpg" `
    -subjectName "ASTRONOMI" `
    -subTitle "Tata Bola Langit, Astrofisika & Mekanika Orbit" `
    -pillText "OSN SMA 2026" `
    -symbolText "ASTRO" `
    -symbolFontSize 36 `
    -bgCol1 ([System.Drawing.Color]::FromArgb(255, 250, 232, 255)) `
    -bgCol2 ([System.Drawing.Color]::FromArgb(255, 245, 208, 254)) `
    -primaryCol ([System.Drawing.Color]::FromArgb(255, 147, 51, 234)) `
    -accentCol ([System.Drawing.Color]::FromArgb(255, 192, 38, 211))

# 7. Kebumian (Bright Peach Coral)
Generate-BrightCanvaBanner `
    -fileName "cover-osn-kebumian.jpg" `
    -subjectName "KEBUMIAN" `
    -subTitle "Geologi, Meteorologi, Oseanografi & Planetologi" `
    -pillText "OSN SMA 2026" `
    -symbolText "EARTH" `
    -symbolFontSize 36 `
    -bgCol1 ([System.Drawing.Color]::FromArgb(255, 255, 237, 213)) `
    -bgCol2 ([System.Drawing.Color]::FromArgb(255, 254, 215, 170)) `
    -primaryCol ([System.Drawing.Color]::FromArgb(255, 234, 88, 12)) `
    -accentCol ([System.Drawing.Color]::FromArgb(255, 249, 115, 22))

# 8. Ekonomi (Bright Honey Amber)
Generate-BrightCanvaBanner `
    -fileName "cover-osn-ekonomi.jpg" `
    -subjectName "EKONOMI" `
    -subTitle "Mikro-Makroekonomi, Akuntansi & Isu Finansial" `
    -pillText "OSN SMA 2026" `
    -symbolText "ECON" `
    -symbolFontSize 40 `
    -bgCol1 ([System.Drawing.Color]::FromArgb(255, 254, 243, 199)) `
    -bgCol2 ([System.Drawing.Color]::FromArgb(255, 253, 230, 138)) `
    -primaryCol ([System.Drawing.Color]::FromArgb(255, 217, 119, 6)) `
    -accentCol ([System.Drawing.Color]::FromArgb(255, 245, 158, 11))

# 9. Geografi (Bright Tropical Teal)
Generate-BrightCanvaBanner `
    -fileName "cover-osn-geografi.jpg" `
    -subjectName "GEOGRAFI" `
    -subTitle "Analisis Spasial Keruangan, SIG & Geomorfologi" `
    -pillText "OSN SMA 2026" `
    -symbolText "GEO" `
    -symbolFontSize 42 `
    -bgCol1 ([System.Drawing.Color]::FromArgb(255, 207, 250, 254)) `
    -bgCol2 ([System.Drawing.Color]::FromArgb(255, 165, 243, 252)) `
    -primaryCol ([System.Drawing.Color]::FromArgb(255, 13, 148, 136)) `
    -accentCol ([System.Drawing.Color]::FromArgb(255, 6, 182, 212))

Write-Host "SUCCESS: Generated all 9 Refined Bright Canva-Style Banners!"
