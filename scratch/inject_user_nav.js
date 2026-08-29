const fs = require('fs');

let html = fs.readFileSync('nlsadmin/index.html', 'utf8');

// 1. Add dataset script in head
if (!html.includes('/database/vue/users.db.js')) {
    html = html.replace('<script src="/blog/default-articles.js"></script>', '<script src="/blog/default-articles.js"></script>\n    <script src="/database/vue/users.db.js"></script>');
}

// 2. Add CSS styles for nav-pill-users, admin-hero-users, submenu-users-active
const cssToAdd = `
        /* User Management Styles */
        .admin-hero-users {
            background: linear-gradient(135deg, #a21caf 0%, #86198f 60%, #0f172a 100%) !important;
            color: #ffffff !important;
            box-shadow: 0 14px 35px -8px rgba(162, 28, 175, 0.4);
        }

        .nav-pill-users {
            background: linear-gradient(135deg, #fae8ff 0%, #f5d0fe 100%) !important;
            color: #86198f !important;
            border: 1px solid #f0abfc !important;
            box-shadow: 0 2px 8px -2px rgba(192, 38, 211, 0.12) !important;
        }
        html.dark .nav-pill-users {
            background: linear-gradient(135deg, #4a044e 0%, #701a75 100%) !important;
            color: #f5d0fe !important;
            border-color: #c026d3 !important;
        }

        .submenu-users-active {
            background-color: #ffffff !important;
            color: #86198f !important;
            border: 1.5px solid #c026d3 !important;
            box-shadow: 0 3px 10px -2px rgba(192, 38, 211, 0.15) !important;
            font-weight: 900 !important;
        }
        html.dark .submenu-users-active {
            background-color: #1e293b !important;
            color: #ffffff !important;
            border: 1.5px solid #e879f9 !important;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45) !important;
        }
`;

if (!html.includes('.nav-pill-users')) {
    html = html.replace('.nav-pill-pengajar {', cssToAdd + '\n        .nav-pill-pengajar {');
}

// 3. Update Breadcrumb
html = html.replace(
    `x-text="activeTab === 'kalender' ? (kalenderView === 'create' ? 'Kalender Event / Create Event' : (kalenderView === 'trash' ? 'Kalender Event / Trash Event' : 'Kalender Event / Present Event')) : (activeTab === 'berita' ? (beritaView === 'create' ? 'Berita & Artikel / Create News' : (beritaView === 'trash' ? 'Berita & Artikel / Trash News' : 'Berita & Artikel / Present News')) : (pengajarView === 'add' ? 'Daftar Pengajar / Add Teacher' : (pengajarView === 'trash' ? 'Daftar Pengajar / Trash Teacher' : 'Daftar Pengajar / Present Teacher')))"`,
    `x-text="activeTab === 'kalender' ? (kalenderView === 'create' ? 'Kalender Event / Create Event' : (kalenderView === 'trash' ? 'Kalender Event / Trash Event' : 'Kalender Event / Present Event')) : (activeTab === 'berita' ? (beritaView === 'create' ? 'Berita & Artikel / Create News' : (beritaView === 'trash' ? 'Berita & Artikel / Trash News' : 'Berita & Artikel / Present News')) : (activeTab === 'users' ? (userView === 'add' ? 'User Management / Add User' : (userView === 'trash' ? 'User Management / Trash User' : 'User Management / Present User')) : (pengajarView === 'add' ? 'Daftar Pengajar / Add Teacher' : (pengajarView === 'trash' ? 'Daftar Pengajar / Trash Teacher' : 'Daftar Pengajar / Present Teacher'))))"`
);

// 4. Add Sidebar Menu 4
const sidebarMenu4 = `
                    <!-- Menu 4: User Management with Expandable Submenu Dropdown -->
                    <div class="space-y-1">
                        <button type="button" @click="toggleUserDropdown()"
                            :class="activeTab === 'users' ? 'nav-pill-users font-black' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'"
                            class="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs transition-all cursor-pointer text-left group">
                            <div class="flex items-center gap-3">
                                <span class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs transition-colors"
                                    :class="activeTab === 'users' ? 'bg-fuchsia-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-fuchsia-600 group-hover:text-white'">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                </span>
                                <span class="truncate">User Management</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-fuchsia-100 dark:bg-fuchsia-950 text-fuchsia-800 dark:text-fuchsia-200"
                                    x-text="users.length"></span>
                                <svg class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200"
                                    :class="isUserDropdownOpen ? 'rotate-180 text-fuchsia-600' : ''"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </button>

                        <!-- Dropdown Submenu: Add User, Present User, & Trash User -->
                        <div x-show="isUserDropdownOpen" x-cloak class="border-l-2 border-fuchsia-300 dark:border-fuchsia-800 ml-4 pl-2.5 pt-1 space-y-1.5">
                            <!-- Submenu 1: Add User -->
                            <button type="button" @click="openAddUserView()"
                                :class="activeTab === 'users' && userView === 'add' ? 'submenu-users-active' : 'submenu-btn-inactive'"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <span class="w-2 h-2 rounded-full shrink-0 transition-all"
                                        :class="activeTab === 'users' && userView === 'add' ? 'bg-fuchsia-600 ring-4 ring-fuchsia-200 dark:ring-fuchsia-900/80 scale-110' : 'bg-slate-300 dark:bg-slate-600'"></span>
                                    <span class="truncate">Add User</span>
                                </div>
                                <span x-show="activeTab === 'users' && userView === 'add'" class="text-[9px] px-1.5 py-0.5 rounded-full bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-300 font-black tracking-wide">Aktif</span>
                            </button>

                            <!-- Submenu 2: Present User -->
                            <button type="button" @click="openPresentUserView()"
                                :class="activeTab === 'users' && userView === 'present' ? 'submenu-users-active' : 'submenu-btn-inactive'"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <span class="w-2 h-2 rounded-full shrink-0 transition-all"
                                        :class="activeTab === 'users' && userView === 'present' ? 'bg-fuchsia-600 ring-4 ring-fuchsia-200 dark:ring-fuchsia-900/80 scale-110' : 'bg-slate-300 dark:bg-slate-600'"></span>
                                    <span class="truncate">Present User</span>
                                </div>
                                <span class="text-[10px] px-2 py-0.5 rounded-full font-black"
                                    :class="activeTab === 'users' && userView === 'present' ? 'bg-fuchsia-600 text-white shadow-2xs' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
                                    x-text="users.length"></span>
                            </button>

                            <!-- Submenu 3: Trash User -->
                            <button type="button" @click="openTrashUserView()"
                                :class="activeTab === 'users' && userView === 'trash' ? 'submenu-users-active text-rose-700 dark:text-rose-300' : 'submenu-btn-inactive'"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left group">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <span class="w-2 h-2 rounded-full shrink-0 transition-all"
                                        :class="activeTab === 'users' && userView === 'trash' ? 'bg-rose-600 ring-4 ring-rose-200 dark:ring-rose-900/80 scale-110' : 'bg-rose-300 dark:bg-rose-700'"></span>
                                    <span class="truncate flex items-center gap-1">
                                        <span>Trash</span>
                                        <svg class="w-3.5 h-3.5 text-rose-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </span>
                                </div>
                                <span class="text-[10px] px-2 py-0.5 rounded-full font-black"
                                    :class="trashUsers.length > 0 ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'"
                                    x-text="trashUsers.length"></span>
                            </button>
                        </div>
                    </div>
`;

if (!html.includes('<!-- Menu 4: User Management')) {
    html = html.replace('</nav>\n\n                <!-- Vue 3 Database Explorer Hub -->', sidebarMenu4 + '\n                </nav>\n\n                <!-- Vue 3 Database Explorer Hub -->');
}

fs.writeFileSync('nlsadmin/index.html', html, 'utf8');
console.log('✅ Updated header, CSS, breadcrumb, and sidebar navigation for User Management');
