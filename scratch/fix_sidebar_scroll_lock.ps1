$adminPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$content = [System.IO.File]::ReadAllText($adminPath, [System.Text.Encoding]::UTF8)

# 1. Add html, body height 100% & overflow hidden to <style>
$oldBodyStyle = @'
    <style>
        [x-cloak] { display: none !important; }
        body { font-family: 'Inter', sans-serif; }
'@

$newBodyStyle = @'
    <style>
        [x-cloak] { display: none !important; }
        html, body {
            height: 100%;
            height: 100dvh;
            margin: 0;
            padding: 0;
            overflow: hidden;
            font-family: 'Inter', sans-serif;
        }
'@

$content = $content.Replace($oldBodyStyle, $newBodyStyle)

# 2. Update sidebar-desktop-sticky in CSS
$oldDesktopSticky = @'
        @media (min-width: 1024px) {
            .sidebar-desktop-sticky {
                position: sticky !important;
                top: 0 !important;
                left: 0 !important;
                bottom: 0 !important;
                height: 100vh !important;
                max-height: 100vh !important;
            }
        }
'@

$newDesktopSticky = @'
        @media (min-width: 1024px) {
            .sidebar-desktop-sticky {
                position: relative !important;
                height: 100% !important;
                height: 100dvh !important;
                max-height: 100dvh !important;
            }
        }
'@

$content = $content.Replace($oldDesktopSticky, $newDesktopSticky)

# 3. Update dashboard and right main wrapper
$oldDashboardDiv = '<div x-show="isAuthenticated" x-cloak class="w-full min-h-screen h-screen flex bg-slate-100/70 dark:bg-[#070D1E] antialiased overflow-hidden">'
$newDashboardDiv = '<div x-show="isAuthenticated" x-cloak class="w-full h-full h-screen h-[100dvh] flex bg-slate-100/70 dark:bg-[#070D1E] antialiased overflow-hidden">'
$content = $content.Replace($oldDashboardDiv, $newDashboardDiv)

$oldRightDiv = '<div class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">'
$newRightDiv = '<div class="flex-1 flex flex-col min-w-0 h-full h-screen h-[100dvh] overflow-hidden">'
$content = $content.Replace($oldRightDiv, $newRightDiv)

[System.IO.File]::WriteAllText($adminPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Configured independent scrolling so sidebar stays completely stationary when content is scrolled!"
