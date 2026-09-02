const fs = require('fs');
const cp = require('child_process');

try {
    // 1. Extract clean version
    const cleanBuf = cp.execSync('git show ca82eb6:nlsadmin/index.html', { encoding: 'buffer' });
    fs.writeFileSync('nlsadmin/index.html', cleanBuf);
    console.log("Extracted clean version from git.");

    // 2. Read it back as string
    let content = fs.readFileSync('nlsadmin/index.html', 'utf8');

    // 3. Inject Trash HTML
    function getTrashHTML(catName) {
        return `
                            <!-- Submenu: Trash ${catName} -->
                            <button type="button" @click="openLmsCategory('${catName}', 'trash')"
                                :class="activeTab === 'lms_courses' && lmsCategory === '${catName}' && lmsLevel === 'trash' ? 'submenu-btn-active text-rose-700 dark:text-rose-300' : 'submenu-btn-inactive'"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left group mt-1 border-t border-slate-100 dark:border-slate-800/60 pt-2">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <span class="w-2 h-2 rounded-full shrink-0 transition-all"
                                        :class="activeTab === 'lms_courses' && lmsCategory === '${catName}' && lmsLevel === 'trash' ? 'bg-rose-600 ring-4 ring-rose-200 dark:ring-rose-900/80 scale-110' : 'bg-rose-300 dark:bg-rose-700'"></span>
                                    <span class="truncate flex items-center gap-1">
                                        <span>Trash</span>
                                        <svg class="w-3.5 h-3.5 text-rose-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </span>
                                </div>
                                <span class="text-[10px] px-2 py-0.5 rounded-full font-black"
                                    :class="getTrashedCoursesByCategory('${catName}').length > 0 ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'"
                                    x-text="getTrashedCoursesByCategory('${catName}').length"></span>
                            </button>
        `;
    }

    content = content.replace(/(<div x-show="isSchoolDropdownOpen".*?SMA \/ MA.*?<\/button>\s*)(<\/div>)/s, '$1\n' + getTrashHTML('School') + '\n$2');
    content = content.replace(/(<div x-show="isOlimpiadeDropdownOpen".*?Internasional.*?<\/button>\s*)(<\/div>)/s, '$1\n' + getTrashHTML('Olimpiade') + '\n$2');
    content = content.replace(/(<div x-show="isTkaDropdownOpen".*?TKA SMA.*?<\/button>\s*)(<\/div>)/s, '$1\n' + getTrashHTML('TKA') + '\n$2');
    content = content.replace(/(<div x-show="isCollegeDropdownOpen".*?Kedinasan.*?<\/button>\s*)(<\/div>)/s, '$1\n' + getTrashHTML('Collage Preparation') + '\n$2');

    // 4. Inject Main View
    content = content.replace(/<!-- Course Cards Grid -->\s*<template x-if="getFilteredLmsCourses\(\)\.length === 0">/, 
`<!-- Course Cards Grid -->
                    <div x-show="lmsLevel !== 'trash'" class="space-y-6">
                    <template x-if="getFilteredLmsCourses().length === 0">`);

    const trashUI = `
                        <!-- Trash Header -->
                        <div class="bg-gradient-to-r from-rose-900 via-slate-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                            <div>
                                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 mb-2 border border-rose-500/40">
                                    <svg class="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    <span>Tempat Sampah <span x-text="lmsCategory"></span></span>
                                </div>
                                <h2 class="text-xl sm:text-2xl font-black text-white">Trash LMS Courses</h2>
                                <p class="text-xs sm:text-sm text-rose-200/80 mt-1">Kelas yang dihapus sementara ditampung di sini. Anda dapat memulihkan (Restore) atau menghapus permanen.</p>
                            </div>
                            <div>
                                <button type="button" @click="emptyLmsTrash(lmsCategory)" x-show="getTrashedCoursesByCategory(lmsCategory).length > 0"
                                    class="px-4 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    <span>Kosongkan Kategori Ini</span>
                                </button>
                            </div>
                        </div>

                        <!-- Trash Empty -->
                        <template x-if="getTrashedCoursesByCategory(lmsCategory).length === 0">
                            <div class="text-center py-16 bg-white dark:bg-[#131D38] rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 space-y-3">
                                <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </div>
                                <h3 class="text-base font-black text-slate-800 dark:text-slate-200">Tempat Sampah Kosong</h3>
                                <p class="text-xs text-slate-500">Tidak ada kelas yang dihapus di kategori ini.</p>
                            </div>
                        </template>

                        <!-- Trash Grid -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <template x-for="course in getTrashedCoursesByCategory(lmsCategory)" :key="course.id">
                                <div class="rounded-3xl bg-white dark:bg-[#131D38] border border-rose-200 dark:border-rose-900/60 p-5 sm:p-6 flex flex-col justify-between space-y-4 relative overflow-hidden shadow-sm">
                                    <div class="space-y-3">
                                        <div class="flex items-center gap-2 flex-wrap">
                                            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300" x-text="course.category"></span>
                                            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300" x-text="course.level"></span>
                                        </div>
                                        <div>
                                            <h3 class="text-base font-black text-slate-900 dark:text-white leading-snug line-through opacity-80" x-text="course.title"></h3>
                                            <p class="text-xs text-slate-500 mt-1">Dihapus pada: <span x-text="formatDisplayDate(course.deletedAt)"></span></p>
                                        </div>
                                    </div>
                                    <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                                        <button type="button" @click="restoreLmsCourse(course.id)"
                                            class="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-black flex items-center gap-1.5 transition-all">
                                            <span>Pulihkan</span>
                                        </button>
                                        <button type="button" @click="permanentDeleteLmsCourse(course.id)"
                                            class="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300 text-xs font-black flex items-center gap-1.5 transition-all">
                                            <span>Hapus Permanen</span>
                                        </button>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
    `;

    content = content.replace(/(<\/button>\s*<\/div>\s*<\/div>\s*<\/template>\s*<\/div>\s*)(<\/div>\s*<!-- =========================================================================\s*TAB 6: KALENDER EVENT)/s, '$1\n                    </div>\n\n                    <!-- TRASH VIEW -->\n                    <div x-show="lmsLevel === \'trash\'" class="space-y-6" x-cloak>\n' + trashUI + '\n$2');

    // 5. Inject Logic
    const trashLogic = `
                getTrashedCoursesByCategory(cat) {
                    if (!this.trashCourses || !Array.isArray(this.trashCourses)) return [];
                    return this.trashCourses.filter(c => c.category === cat);
                },
                emptyLmsTrash(cat) {
                    if (confirm('Hapus PERMANEN semua kelas terhapus di kategori ' + cat + '? Data tidak bisa dikembalikan.')) {
                        this.trashCourses = this.trashCourses.filter(c => c.category !== cat);
                        localStorage.setItem("nls_lms_courses_trash_v1", JSON.stringify(this.trashCourses));
                        this.showToast('Semua trash di kategori ' + cat + ' berhasil dikosongkan.');
                    }
                },
                restoreLmsCourse(id) {
                    const idx = this.trashCourses.findIndex(c => c.id === id);
                    if (idx !== -1) {
                        const [restored] = this.trashCourses.splice(idx, 1);
                        restored.status = 'published';
                        delete restored.deletedAt;
                        this.courses.unshift(restored);
                        this.saveCoursesToStorage();
                        localStorage.setItem("nls_lms_courses_trash_v1", JSON.stringify(this.trashCourses));
                        this.showToast('Kelas berhasil dipulihkan.');
                    }
                },
                permanentDeleteLmsCourse(id) {
                    if (confirm('Hapus PERMANEN kelas ini? Data materi dan soal akan hilang selamanya.')) {
                        const idx = this.trashCourses.findIndex(c => c.id === id);
                        if (idx !== -1) {
                            this.trashCourses.splice(idx, 1);
                            localStorage.setItem("nls_lms_courses_trash_v1", JSON.stringify(this.trashCourses));
                            this.showToast('Kelas berhasil dihapus permanen.');
                        }
                    }
                },
    `;

    content = content.replace(/(deleteCourse\(id\) \{.*?this\.saveCoursesToStorage\(\);\s*this\.showToast\('Course berhasil dipindahkan ke Tempat Sampah\.'\);\s*\n\s*\}\s*\n\s*\}\s*,)/s, '$1\n' + trashLogic);

    fs.writeFileSync('nlsadmin/index.html', content, 'utf8');
    console.log("Successfully fixed mojibake and re-applied Trash UI & Logic.");

} catch(e) {
    console.error("Error:", e);
}
