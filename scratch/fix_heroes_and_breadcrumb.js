const fs = require('fs');

let html = fs.readFileSync('nlsadmin/index.html', 'utf8');

// 1. Add hero banner styles in <style>
const heroStyles = `
        /* High Contrast Rich Hero Banners */
        .admin-hero-kalender {
            background: linear-gradient(135deg, #0284c7 0%, #0369a1 60%, #0f172a 100%) !important;
            color: #ffffff !important;
            box-shadow: 0 14px 35px -8px rgba(2, 132, 199, 0.4) !important;
        }
        .admin-hero-berita {
            background: linear-gradient(135deg, #059669 0%, #047857 60%, #0f172a 100%) !important;
            color: #ffffff !important;
            box-shadow: 0 14px 35px -8px rgba(5, 150, 105, 0.4) !important;
        }
        .admin-hero-pengajar {
            background: linear-gradient(135deg, #4f46e5 0%, #4338ca 60%, #0f172a 100%) !important;
            color: #ffffff !important;
            box-shadow: 0 14px 35px -8px rgba(79, 70, 229, 0.4) !important;
        }
        .admin-hero-users {
            background: linear-gradient(135deg, #c026d3 0%, #9333ea 60%, #0f172a 100%) !important;
            color: #ffffff !important;
            box-shadow: 0 14px 35px -8px rgba(192, 38, 211, 0.4) !important;
        }
        .admin-hero-verification {
            background: linear-gradient(135deg, #b45309 0%, #d97706 50%, #1e1b4b 100%) !important;
            color: #ffffff !important;
            box-shadow: 0 14px 35px -8px rgba(217, 119, 6, 0.4) !important;
        }
        .admin-hero-trash {
            background: linear-gradient(135deg, #881337 0%, #be123c 50%, #0f172a 100%) !important;
            color: #ffffff !important;
            box-shadow: 0 14px 35px -8px rgba(190, 18, 60, 0.4) !important;
        }
`;

html = html.replace('.admin-hero-kalender {', heroStyles + '\n        .admin-hero-kalender-old {');

// 2. Replace the banner classes in HTML with explicit hero classes
// Verification Queue banner
html = html.replace(
    'class="bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-900 text-white p-6 sm:p-8 rounded-3xl border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl"',
    'class="admin-hero-verification p-6 sm:p-8 rounded-3xl border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl"'
);

// Trash banners
html = html.replaceAll(
    'class="bg-gradient-to-r from-rose-900 via-slate-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl"',
    'class="admin-hero-trash p-6 sm:p-8 rounded-3xl border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl"'
);

// 3. Update Breadcrumb to use getBreadcrumbTitle()
html = html.replace(
    /x-text="activeTab === 'kalender' \?[\s\S]*?\)\)\)\)"/,
    'x-text="getBreadcrumbTitle()"'
);

// 4. Add getBreadcrumbTitle method into superAdminApp
const breadcrumbMethod = `
                getBreadcrumbTitle() {
                    if (this.activeTab === 'kalender') {
                        if (this.kalenderView === 'create') return 'Kalender Event / Create Event';
                        if (this.kalenderView === 'trash') return 'Kalender Event / Trash Event';
                        return 'Kalender Event / Present Event';
                    }
                    if (this.activeTab === 'berita') {
                        if (this.beritaView === 'create') return 'Berita & Artikel / Create News';
                        if (this.beritaView === 'trash') return 'Berita & Artikel / Trash News';
                        return 'Berita & Artikel / Present News';
                    }
                    if (this.activeTab === 'pengajar') {
                        if (this.pengajarView === 'add') return 'Daftar Pengajar / Add Teacher';
                        if (this.pengajarView === 'verification') return 'Daftar Pengajar / Teacher Verification';
                        if (this.pengajarView === 'trash') return 'Daftar Pengajar / Trash Teacher';
                        return 'Daftar Pengajar / Present Teacher';
                    }
                    if (this.activeTab === 'users') {
                        if (this.userView === 'add') return 'User Management / Add User';
                        if (this.userView === 'trash') return 'User Management / Trash User';
                        return 'User Management / Present User';
                    }
                    return 'Super Admin Portal';
                },
`;

if (!html.includes('getBreadcrumbTitle() {')) {
    html = html.replace('// USER MANAGEMENT DROPDOWN & CRUD METHODS', breadcrumbMethod + '\n                // USER MANAGEMENT DROPDOWN & CRUD METHODS');
}

fs.writeFileSync('nlsadmin/index.html', html, 'utf8');
console.log('✅ Updated hero banner gradients and breadcrumb title handling in nlsadmin/index.html');
