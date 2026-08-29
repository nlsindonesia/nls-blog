import fs from 'fs';
import path from 'path';

function findHtml(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            if (!['.git', 'node_modules', '.gemini', 'scratch', 'nlsadmin', 'login', 'belajar'].includes(file)) {
                findHtml(filePath, fileList);
            }
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

const htmlFiles = findHtml('.');

const ssoHeadTag = `    <!-- NLS Universal Cross-Subdomain SSO Client -->\n    <script src="/sso-client.js"></script>\n</head>`;

const newNavTag = `<nav x-data="{ 
        isMobileMenuOpen: false, 
        activeDesktopMenu: null,
        studentSession: null,
        profileDropdownOpen: false,
        initAuth() {
            const syncSession = (session) => {
                if (session) {
                    this.studentSession = {
                        name: session.name || 'Siswa NLS',
                        nisn: session.nisn || 'NISN: Terdaftar',
                        school: session.school || '',
                        targetProgram: session.targetProgram || 'Program NLS',
                        avatar: session.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
                        role: session.role || 'student',
                        roleLabel: (session.role === 'teacher' || (session.roleLabel && session.roleLabel.includes('Guru'))) ? 'Guru Aktif' : ((session.role === 'super_admin') ? 'Super Admin' : 'Siswa Aktif')
                    };
                } else {
                    this.studentSession = null;
                }
            };

            try {
                const local = (window.NlsSSO && window.NlsSSO.getLocalSession()) || 
                              (function() {
                                  try {
                                      const s = localStorage.getItem('nls_student_auth_session') || localStorage.getItem('nls_auth_session');
                                      return s ? JSON.parse(s) : null;
                                  } catch(e) { return null; }
                              })();
                syncSession(local);
            } catch(e) {
                this.studentSession = null;
            }

            if (window.NlsSSO) {
                window.NlsSSO.onSessionChange((session, isLoggedIn) => {
                    syncSession(session);
                });
            }
        },
        logoutStudent() {
            if (window.NlsSSO) {
                window.NlsSSO.broadcastLogout();
            } else {
                localStorage.removeItem('nls_student_auth_session');
                localStorage.removeItem('nls_auth_session');
            }
            this.studentSession = null;
            this.profileDropdownOpen = false;
            this.isMobileMenuOpen = false;
        }
    }"
    x-init="initAuth()"
    @click.outside="activeDesktopMenu = null; profileDropdownOpen = false"`;

const desktopActionsReplacement = `            <!-- Authenticated Student Avatar Dropdown (Replaces 'Yuk Belajar' When Logged In) -->
            <template x-if="studentSession">
                <div class="relative" @click.outside="profileDropdownOpen = false">
                    <button type="button" @click.stop="profileDropdownOpen = !profileDropdownOpen"
                        class="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all cursor-pointer shadow-xs">
                        <img :src="studentSession.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'" 
                            alt="Avatar Siswa" class="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-600">
                        <div class="flex flex-col text-left">
                            <span class="text-xs font-black text-slate-900 dark:text-white leading-tight" x-text="studentSession.name ? studentSession.name.split(' ')[0] : 'Siswa'"></span>
                            <span class="text-[10px] font-extrabold text-[#9A4B16] dark:text-amber-400 leading-tight" x-text="studentSession.roleLabel || 'Siswa Aktif'"></span>
                        </div>
                        <svg class="w-3.5 h-3.5 text-slate-500 ml-0.5 transition-transform duration-200" :class="profileDropdownOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                    </button>

                    <!-- Dropdown Menu -->
                    <div x-show="profileDropdownOpen" x-cloak
                        x-transition:enter="transition ease-out duration-150"
                        x-transition:enter-start="opacity-0 translate-y-2 scale-95"
                        x-transition:enter-end="opacity-100 translate-y-0 scale-100"
                        x-transition:leave="transition ease-in duration-100"
                        x-transition:leave-start="opacity-100 translate-y-0 scale-100"
                        x-transition:leave-end="opacity-0 translate-y-2 scale-95"
                        class="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl p-3 z-50 space-y-2">
                        
                        <!-- Student Info Card Header -->
                        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 flex items-center gap-3">
                            <img :src="studentSession.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'" 
                                alt="Avatar Siswa" class="w-10 h-10 rounded-full object-cover border-2 border-primary/20">
                            <div class="flex flex-col min-w-0">
                                <span class="text-xs font-black text-slate-900 dark:text-white truncate" x-text="studentSession.name"></span>
                                <span class="text-[11px] text-slate-500 dark:text-slate-400 truncate" x-text="studentSession.nisn || studentSession.school"></span>
                                <span class="text-[10px] font-bold text-indigo-600 dark:text-indigo-400" x-text="studentSession.targetProgram || 'Program NLS'"></span>
                            </div>
                        </div>

                        <!-- Action Links -->
                        <div class="space-y-1">
                            <a href="https://nls-belajar.vercel.app/" target="_blank"
                                class="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-primary/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors">
                                <span class="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">🚀</span>
                                <div class="flex flex-col">
                                    <span>Buka Portal Belajar (LMS)</span>
                                    <span class="text-[10px] text-slate-400 font-normal">Akses modul, video, &amp; kuis</span>
                                </div>
                            </a>

                            <a href="https://nls-belajar.vercel.app/profil/saya" target="_blank"
                                class="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-primary/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors">
                                <span class="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400">👤</span>
                                <div class="flex flex-col">
                                    <span>Profil Saya &amp; Riwayat Kelas</span>
                                    <span class="text-[10px] text-slate-400 font-normal">Lihat data &amp; skor tryout</span>
                                </div>
                            </a>
                        </div>

                        <div class="border-t border-slate-100 dark:border-slate-800 pt-1">
                            <button type="button" @click="logoutStudent()"
                                class="w-full flex items-center gap-2 p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-extrabold transition-colors cursor-pointer">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                                <span>Keluar (Logout)</span>
                            </button>
                        </div>
                    </div>
                </div>
            </template>

            <!-- Guest Action: Yuk Belajar (When NOT Logged In) -->
            <template x-if="!studentSession">
                <a href="https://nls-belajar.vercel.app" target="_blank" class="bg-[#FF8A00] text-white px-6 py-3 rounded-full text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all inline-block">
                    Yuk Belajar
                </a>
            </template>`;

const mobileActionsReplacement = `        <div class="flex flex-col gap-3 pt-2">
            <!-- Mobile Authenticated Student Card (When Logged In) -->
            <template x-if="studentSession">
                <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div class="flex items-center gap-3">
                        <img :src="studentSession.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'" 
                            alt="Avatar Siswa" class="w-10 h-10 rounded-full object-cover border border-primary/20">
                        <div class="flex flex-col min-w-0">
                            <span class="text-xs font-black text-slate-900 dark:text-white truncate" x-text="studentSession.name"></span>
                            <span class="text-[10px] font-extrabold text-[#9A4B16] dark:text-amber-400" x-text="studentSession.roleLabel || 'Siswa Aktif'"></span>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2 pt-1">
                        <a href="https://nls-belajar.vercel.app/" target="_blank" class="py-2 px-3 rounded-xl bg-primary text-white text-center text-xs font-bold shadow-xs">Portal LMS 🚀</a>
                        <button type="button" @click="logoutStudent()" class="py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-center text-xs font-bold border border-rose-200 dark:border-rose-900/60 cursor-pointer">Keluar 🚪</button>
                    </div>
                </div>
            </template>

            <!-- Mobile Guest Action: Yuk Belajar (When NOT Logged In) -->
            <template x-if="!studentSession">
                <a href="https://nls-belajar.vercel.app" target="_blank" @click="isMobileMenuOpen = false" class="text-center bg-[#FF8A00] text-white font-bold py-3 rounded-full shadow-md hover:shadow-lg transition-all">Yuk Belajar</a>
            </template>
        </div>`;

let updatedCount = 0;

htmlFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Add sso-client.js if missing
    if (!content.includes('/sso-client.js') && content.includes('</head>')) {
        content = content.replace('</head>', ssoHeadTag);
    }

    // 2. Update nav x-data if standard nav is present
    if (content.includes('isMobileMenuOpen: false') && !content.includes('studentSession: null')) {
        content = content.replace(/<nav\s+x-data="\{[\s\S]*?isMobileMenuOpen:\s*false[\s\S]*?\}"[\s\S]*?@click\.outside="[\s\S]*?"/i, newNavTag);
    }

    // 3. Update desktop Yuk Belajar button
    const desktopRegex = /<div class="(?:hidden lg:flex|lg:flex hidden) items-center gap-3">([\s\S]*?)<\/div>\s*(?:<!--[\s\S]*?-->\s*)?(?=<div class="flex items-center gap-2 lg:hidden">|<div class="flex items-center gap-3 lg:hidden">)/i;
    const match = content.match(desktopRegex);
    if (match) {
        let inner = match[1];
        const themeBtnMatch = inner.match(/<button type="button" class="theme-toggle-btn[\s\S]*?<\/button>/i);
        const themeBtn = themeBtnMatch ? themeBtnMatch[0] : '';
        const newInner = `\n            ${themeBtn}\n\n${desktopActionsReplacement}\n        `;
        content = content.replace(desktopRegex, `<div class="hidden lg:flex items-center gap-3">${newInner}</div>\n`);
    }

    // 4. Update mobile actions container
    const mobileRegex = /<div class="flex flex-col gap-3 pt-2">([\s\S]*?)<\/div>\s*<\/div>\s*<\/nav>/i;
    if (mobileRegex.test(content)) {
        content = content.replace(mobileRegex, `${mobileActionsReplacement}\n    </div>\n</nav>`);
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        updatedCount++;
        console.log('Updated:', filePath);
    }
});

console.log(`Successfully updated ${updatedCount} HTML pages!`);
