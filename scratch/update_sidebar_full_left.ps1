$adminPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$content = [System.IO.File]::ReadAllText($adminPath, [System.Text.Encoding]::UTF8)

# 1. Update Sidebar CSS for Full Flush Left layout
$oldSidebarCss = @'
        /* =========================================================================
           SIDEBAR EXPAND / COLLAPSE SYSTEM (DESKTOP & MOBILE)
           ========================================================================= */
        .sidebar-expanded {
            width: 270px !important;
            min-width: 270px !important;
            max-width: 270px !important;
            transform: translateX(0) !important;
            opacity: 1 !important;
            visibility: visible !important;
            border-right-width: 1px !important;
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease !important;
        }

        .sidebar-collapsed {
            width: 0px !important;
            min-width: 0px !important;
            max-width: 0px !important;
            padding-left: 0px !important;
            padding-right: 0px !important;
            margin: 0px !important;
            transform: translateX(-100%) !important;
            opacity: 0 !important;
            visibility: hidden !important;
            border-right: none !important;
            overflow: hidden !important;
            pointer-events: none !important;
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease !important;
        }

        @media (max-width: 1023px) {
            .sidebar-mobile-fixed {
                position: fixed !important;
                inset-block: 0 !important;
                left: 0 !important;
                z-index: 50 !important;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
            }
        }
        @media (min-width: 1024px) {
            .sidebar-desktop-sticky {
                position: sticky !important;
                top: 0 !important;
                height: 100vh !important;
            }
        }
'@

$newSidebarCss = @'
        /* =========================================================================
           FULL FLUSH LEFT SIDEBAR SYSTEM (UNRESTRICTED FULL-HEIGHT LEFT DOCK)
           ========================================================================= */
        .sidebar-expanded {
            width: 288px !important;
            min-width: 288px !important;
            max-width: 288px !important;
            transform: translateX(0) !important;
            opacity: 1 !important;
            visibility: visible !important;
            border-right-width: 1.5px !important;
            transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease !important;
        }

        .sidebar-collapsed {
            width: 0px !important;
            min-width: 0px !important;
            max-width: 0px !important;
            padding-left: 0px !important;
            padding-right: 0px !important;
            margin: 0px !important;
            transform: translateX(-100%) !important;
            opacity: 0 !important;
            visibility: hidden !important;
            border-right: none !important;
            overflow: hidden !important;
            pointer-events: none !important;
            transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease !important;
        }

        @media (max-width: 1023px) {
            .sidebar-mobile-fixed {
                position: fixed !important;
                inset-block: 0 !important;
                left: 0 !important;
                top: 0 !important;
                bottom: 0 !important;
                height: 100vh !important;
                z-index: 50 !important;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
            }
        }
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

$content = $content.Replace($oldSidebarCss, $newSidebarCss)

# 2. Update Aside wrapper & Main wrapper
$oldDashboardContainer = '<div x-show="isAuthenticated" x-cloak class="min-h-screen flex bg-slate-100/70 dark:bg-[#070D1E] antialiased">'
$newDashboardContainer = '<div x-show="isAuthenticated" x-cloak class="w-full min-h-screen h-screen flex bg-slate-100/70 dark:bg-[#070D1E] antialiased overflow-hidden">'
$content = $content.Replace($oldDashboardContainer, $newDashboardContainer)

$oldAsideTag = @'
        <aside :class="[
                isSidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed',
                isMobile ? 'sidebar-mobile-fixed' : 'sidebar-desktop-sticky'
            ]"
            class="bg-white dark:bg-[#0F172A] border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 overflow-hidden select-none">
'@

$newAsideTag = @'
        <aside :class="[
                isSidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed',
                isMobile ? 'sidebar-mobile-fixed' : 'sidebar-desktop-sticky'
            ]"
            class="bg-white dark:bg-[#0F172A] border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 overflow-hidden select-none z-30">
'@

$content = $content.Replace($oldAsideTag, $newAsideTag)

[System.IO.File]::WriteAllText($adminPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Upgraded Sidebar to full flush left layout in /nlsadmin!"
