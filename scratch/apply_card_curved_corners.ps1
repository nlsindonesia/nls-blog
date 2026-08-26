$privatPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\privat\index.html"
$themePath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\theme.css"

# 1. Update theme.css
$themeContent = [System.IO.File]::ReadAllText($themePath, [System.Text.Encoding]::UTF8)
if (-not $themeContent.Contains('.pricing-card-curved')) {
    $themeContent += "`r`n`r`n/* Curved borders for Pricing Cards */`r`n.pricing-card-curved {`r`n    border-radius: 36px !important;`r`n}`r`n"
    [System.IO.File]::WriteAllText($themePath, $themeContent, [System.Text.Encoding]::UTF8)
}

# 2. Update privat/index.html
$privatContent = [System.IO.File]::ReadAllText($privatPath, [System.Text.Encoding]::UTF8)

# Replace Card 1 opening tag
$oldCard1 = '<div\s+class="bg-white dark:bg-\[#131D38\] p-8 md:p-9 rounded-\[36px\] border-2 border-sky-100 dark:border-sky-900/60 shadow-lg hover:shadow-2xl hover:border-sky-400 transition-all duration-300 flex flex-col justify-between relative group">'
$newCard1 = '<div style="border-radius: 36px !important;" class="pricing-card-curved bg-white dark:bg-[#131D38] p-8 md:p-9 border-2 border-sky-100 dark:border-sky-900/60 shadow-lg hover:shadow-2xl hover:border-sky-400 transition-all duration-300 flex flex-col justify-between relative group">'

$privatContent = [System.Text.RegularExpressions.Regex]::Replace($privatContent, $oldCard1, $newCard1)

# Replace Card 2 opening tag
$oldCard2 = '<div style="background: linear-gradient\(165deg, #0b224d 0%, #061530 100%\) !important; color: #ffffff !important; border: 2\.5px solid #f59e0b !important; box-shadow: 0 20px 45px -10px rgba\(11, 34, 77, 0\.6\), 0 0 25px rgba\(245, 158, 11, 0\.3\) !important;"\s+class="p-8 md:p-9 rounded-\[36px\] relative flex flex-col justify-between group z-20">'
$newCard2 = '<div style="border-radius: 36px !important; background: linear-gradient(165deg, #0b224d 0%, #061530 100%) !important; color: #ffffff !important; border: 2.5px solid #f59e0b !important; box-shadow: 0 20px 45px -10px rgba(11, 34, 77, 0.6), 0 0 25px rgba(245, 158, 11, 0.3) !important;" class="pricing-card-curved p-8 md:p-9 relative flex flex-col justify-between group z-20">'

$privatContent = [System.Text.RegularExpressions.Regex]::Replace($privatContent, $oldCard2, $newCard2)

# Replace Card 3 opening tag
$oldCard3 = '<div\s+class="bg-white dark:bg-\[#131D38\] p-8 md:p-9 rounded-\[36px\] border-2 border-purple-100 dark:border-purple-900/60 shadow-lg hover:shadow-2xl hover:border-purple-400 transition-all duration-300 flex flex-col justify-between relative group">'
$newCard3 = '<div style="border-radius: 36px !important;" class="pricing-card-curved bg-white dark:bg-[#131D38] p-8 md:p-9 border-2 border-purple-100 dark:border-purple-900/60 shadow-lg hover:shadow-2xl hover:border-purple-400 transition-all duration-300 flex flex-col justify-between relative group">'

$privatContent = [System.Text.RegularExpressions.Regex]::Replace($privatContent, $oldCard3, $newCard3)

[System.IO.File]::WriteAllText($privatPath, $privatContent, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Applied border-radius: 36px !important to all 3 pricing cards!"
