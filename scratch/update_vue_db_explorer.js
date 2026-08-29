const fs = require('fs');

let html = fs.readFileSync('nlsadmin/vue-db.html', 'utf8');

// 1. Add users.db.js in head
html = html.replace(
    '<script src="/database/vue/pengajar.db.js"></script>',
    '<script src="/database/vue/pengajar.db.js"></script>\n    <script src="/database/vue/users.db.js"></script>'
);

// 2. Update Metric cards grid
const metricCards = `
            <!-- Summary Metric Cards (5 Modules) -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                <div @click="activeTab = 'kalender'" class="p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer"
                    :class="activeTab === 'kalender' ? 'bg-sky-950/40 border-sky-500 shadow-lg shadow-sky-500/10 ring-2 ring-sky-500/20' : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600'">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-bold text-sky-400 uppercase tracking-wider">Menu 1</span>
                        <span class="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        </span>
                    </div>
                    <div class="text-2xl font-black text-white mb-1">{{ kalenderStats.total }}</div>
                    <div class="text-xs text-slate-400">Events / Kegiatan</div>
                    <div class="text-[11px] text-sky-400 font-semibold mt-2">kalender.db.js</div>
                </div>

                <div @click="activeTab = 'berita'" class="p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer"
                    :class="activeTab === 'berita' ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/20' : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600'">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider">Menu 2</span>
                        <span class="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                        </span>
                    </div>
                    <div class="text-2xl font-black text-white mb-1">{{ beritaStats.total }}</div>
                    <div class="text-xs text-slate-400">Artikel &amp; Berita CMS</div>
                    <div class="text-[11px] text-emerald-400 font-semibold mt-2">berita.db.js</div>
                </div>

                <div @click="activeTab = 'pengajar'" class="p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer"
                    :class="activeTab === 'pengajar' ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-500/20' : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600'">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-bold text-indigo-400 uppercase tracking-wider">Menu 3</span>
                        <span class="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                        </span>
                    </div>
                    <div class="text-2xl font-black text-white mb-1">{{ pengajarStats.total }}</div>
                    <div class="text-xs text-slate-400">Pengajar &amp; Mentor</div>
                    <div class="text-[11px] text-indigo-400 font-semibold mt-2">pengajar.db.js</div>
                </div>

                <div @click="activeTab = 'users'" class="p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer"
                    :class="activeTab === 'users' ? 'bg-fuchsia-950/40 border-fuchsia-500 shadow-lg shadow-fuchsia-500/10 ring-2 ring-fuchsia-500/20' : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600'">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-bold text-fuchsia-400 uppercase tracking-wider">Menu 4</span>
                        <span class="p-1.5 rounded-lg bg-fuchsia-500/20 text-fuchsia-400">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                        </span>
                    </div>
                    <div class="text-2xl font-black text-white mb-1">{{ usersStats.total }}</div>
                    <div class="text-xs text-slate-400">User &amp; Hak Akses</div>
                    <div class="text-[11px] text-fuchsia-400 font-semibold mt-2">users.db.js</div>
                </div>

                <div @click="activeTab = 'backup'" class="p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer"
                    :class="activeTab === 'backup' ? 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/20' : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600'">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-bold text-amber-400 uppercase tracking-wider">Master Sync</span>
                        <span class="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        </span>
                    </div>
                    <div class="text-2xl font-black text-white mb-1">{{ summary.total_in_trash }}</div>
                    <div class="text-xs text-slate-400">Total di Trash</div>
                    <div class="text-[11px] text-amber-400 font-semibold mt-2">index.js (Master DB)</div>
                </div>
            </div>
`;

html = html.replace(/<!-- Summary Metric Cards -->[\s\S]*?<\/div>\s*<\/div>/, metricCards);

// 3. Add Users Tab view
const usersTabSection = `
            <!-- Database Tab 4: User Management -->
            <div v-show="activeTab === 'users'" class="bg-slate-800/80 rounded-3xl border border-slate-700 p-6 space-y-6">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700">
                    <div>
                        <div class="flex items-center gap-2">
                            <h2 class="text-xl font-bold text-white">Database: User Management &amp; Roles</h2>
                            <code class="text-xs bg-slate-900 text-fuchsia-400 px-2 py-0.5 rounded border border-slate-700">/database/vue/users.db.js</code>
                        </div>
                        <p class="text-xs text-slate-400 mt-1">Mengelola akun administrator, koordinator divisi, hak akses peran, dan direktori pengguna internal.</p>
                    </div>

                    <div class="flex items-center gap-2">
                        <input v-model="usersSearch" type="text" placeholder="Cari user..." class="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500">
                        <button @click="resetUsers()" class="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-slate-200">Reset Default</button>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs text-slate-300">
                        <thead class="bg-slate-900/60 text-slate-400 uppercase text-[10px] font-black border-b border-slate-700">
                            <tr>
                                <th class="py-3 px-4">ID</th>
                                <th class="py-3 px-4">Nama Lengkap &amp; Username</th>
                                <th class="py-3 px-4">Peran (Role)</th>
                                <th class="py-3 px-4">Email &amp; WhatsApp</th>
                                <th class="py-3 px-4">Status</th>
                                <th class="py-3 px-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-700/60">
                            <tr v-for="usr in filteredUsers" :key="usr.id" class="hover:bg-slate-700/30 transition-colors">
                                <td class="py-3 px-4 font-mono text-[11px] text-fuchsia-400">{{ usr.id }}</td>
                                <td class="py-3 px-4 font-bold text-white">
                                    <div class="flex items-center gap-2.5">
                                        <img :src="usr.avatar || '/nls-logo-300.png'" class="w-7 h-7 rounded-lg object-cover border border-slate-700">
                                        <div>
                                            <div>{{ usr.name }}</div>
                                            <div class="text-[10px] text-slate-400 font-normal">@{{ usr.username }} &bull; {{ usr.department }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="py-3 px-4">
                                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-800">{{ usr.role }}</span>
                                </td>
                                <td class="py-3 px-4 font-mono text-[11px]">
                                    <div>{{ usr.email }}</div>
                                    <div class="text-emerald-400 font-sans text-[10px]">{{ usr.phone }}</div>
                                </td>
                                <td class="py-3 px-4">
                                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                                        :class="usr.status === 'Aktif' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'">{{ usr.status }}</span>
                                </td>
                                <td class="py-3 px-4 text-right">
                                    <button @click="deleteUser(usr.id)" class="text-rose-400 hover:text-rose-300 font-bold hover:underline">Trash</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
`;

if (!html.includes('<!-- Database Tab 4: User Management -->')) {
    html = html.replace('<!-- Database Tab: Master Backup & Restore -->', usersTabSection + '\n\n            <!-- Database Tab: Master Backup & Restore -->');
}

// 4. Update Vue script logic in vue-db.html
const vueScriptUpdate = `
                const usersSearch = ref('');
                const usersDb = window.UsersDatabase;

                const usersStats = computed(() => ({
                    total: usersDb ? usersDb.users.length : 0,
                    trash: usersDb ? usersDb.trashUsers.length : 0
                }));

                const filteredUsers = computed(() => {
                    if (!usersDb) return [];
                    return usersDb.search(usersSearch.value);
                });

                function deleteUser(id) {
                    if (confirm('Pindahkan user ini ke trash?')) {
                        usersDb.moveToTrash(id);
                    }
                }

                function resetUsers() {
                    if (confirm('Reset database users ke default seed?')) {
                        usersDb.resetToDefault();
                    }
                }
`;

html = html.replace('return {', vueScriptUpdate + '\n                return {\n                    usersSearch,\n                    usersStats,\n                    filteredUsers,\n                    deleteUser,\n                    resetUsers,');

fs.writeFileSync('nlsadmin/vue-db.html', html, 'utf8');
fs.writeFileSync('nlsadmin/vue-db/index.html', html, 'utf8');
console.log('✅ Updated nlsadmin/vue-db.html and nlsadmin/vue-db/index.html with User Management tab and metrics');
