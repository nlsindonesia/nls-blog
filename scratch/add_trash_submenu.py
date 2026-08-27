import re
import json

file_path = r"c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update Sidebar Submenus

# Kalender Submenus: Add Trash Event submenu button
old_kal_submenu = '''                        <!-- Dropdown Submenu: Create Event & Present Event -->
                        <div x-show="isKalenderDropdownOpen" x-cloak class="border-l-2 border-sky-300 dark:border-sky-800 ml-4 pl-2.5 pt-1 space-y-1.5">
                            <!-- Submenu 1: Create Event -->
                            <button type="button" @click="openCreateEventView()"
                                :class="activeTab === 'kalender' && kalenderView === 'create' ? 'submenu-btn-active' : 'submenu-btn-inactive'"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <span class="w-2 h-2 rounded-full shrink-0 transition-all"
                                        :class="activeTab === 'kalender' && kalenderView === 'create' ? 'bg-sky-600 ring-4 ring-sky-200 dark:ring-sky-900/80 scale-110' : 'bg-slate-300 dark:bg-slate-600'"></span>
                                    <span class="truncate">Create Event</span>
                                </div>
                                <span x-show="activeTab === 'kalender' && kalenderView === 'create'" class="text-[9px] px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-black tracking-wide">Aktif</span>
                            </button>

                            <!-- Submenu 2: Present Event -->
                            <button type="button" @click="openPresentEventView()"
                                :class="activeTab === 'kalender' && kalenderView === 'present' ? 'submenu-btn-active' : 'submenu-btn-inactive'"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <span class="w-2 h-2 rounded-full shrink-0 transition-all"
                                        :class="activeTab === 'kalender' && kalenderView === 'present' ? 'bg-sky-600 ring-4 ring-sky-200 dark:ring-sky-900/80 scale-110' : 'bg-slate-300 dark:bg-slate-600'"></span>
                                    <span class="truncate">Present Event</span>
                                </div>
                                <span class="text-[10px] px-2 py-0.5 rounded-full font-black"
                                    :class="activeTab === 'kalender' && kalenderView === 'present' ? 'bg-sky-600 text-white shadow-2xs' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
                                    x-text="events.length"></span>
                            </button>
                        </div>'''

new_kal_submenu = '''                        <!-- Dropdown Submenu: Create Event, Present Event, & Trash Event -->
                        <div x-show="isKalenderDropdownOpen" x-cloak class="border-l-2 border-sky-300 dark:border-sky-800 ml-4 pl-2.5 pt-1 space-y-1.5">
                            <!-- Submenu 1: Create Event -->
                            <button type="button" @click="openCreateEventView()"
                                :class="activeTab === 'kalender' && kalenderView === 'create' ? 'submenu-btn-active' : 'submenu-btn-inactive'"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <span class="w-2 h-2 rounded-full shrink-0 transition-all"
                                        :class="activeTab === 'kalender' && kalenderView === 'create' ? 'bg-sky-600 ring-4 ring-sky-200 dark:ring-sky-900/80 scale-110' : 'bg-slate-300 dark:bg-slate-600'"></span>
                                    <span class="truncate">Create Event</span>
                                </div>
                                <span x-show="activeTab === 'kalender' && kalenderView === 'create'" class="text-[9px] px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-black tracking-wide">Aktif</span>
                            </button>

                            <!-- Submenu 2: Present Event -->
                            <button type="button" @click="openPresentEventView()"
                                :class="activeTab === 'kalender' && kalenderView === 'present' ? 'submenu-btn-active' : 'submenu-btn-inactive'"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <span class="w-2 h-2 rounded-full shrink-0 transition-all"
                                        :class="activeTab === 'kalender' && kalenderView === 'present' ? 'bg-sky-600 ring-4 ring-sky-200 dark:ring-sky-900/80 scale-110' : 'bg-slate-300 dark:bg-slate-600'"></span>
                                    <span class="truncate">Present Event</span>
                                </div>
                                <span class="text-[10px] px-2 py-0.5 rounded-full font-black"
                                    :class="activeTab === 'kalender' && kalenderView === 'present' ? 'bg-sky-600 text-white shadow-2xs' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
                                    x-text="events.length"></span>
                            </button>

                            <!-- Submenu 3: Trash Event -->
                            <button type="button" @click="openTrashEventView()"
                                :class="activeTab === 'kalender' && kalenderView === 'trash' ? 'submenu-btn-active text-rose-700 dark:text-rose-300' : 'submenu-btn-inactive'"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left group">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <span class="w-2 h-2 rounded-full shrink-0 transition-all"
                                        :class="activeTab === 'kalender' && kalenderView === 'trash' ? 'bg-rose-600 ring-4 ring-rose-200 dark:ring-rose-900/80 scale-110' : 'bg-rose-300 dark:bg-rose-700'"></span>
                                    <span class="truncate flex items-center gap-1">
                                        <span>Trash</span>
                                        <svg class="w-3.5 h-3.5 text-rose-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </span>
                                </div>
                                <span class="text-[10px] px-2 py-0.5 rounded-full font-black"
                                    :class="trashEvents.length > 0 ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'"
                                    x-text="trashEvents.length"></span>
                            </button>
                        </div>'''

content = content.replace(old_kal_submenu, new_kal_submenu)

# Berita Submenus: Add Trash News submenu button
old_berita_submenu = '''                        <!-- Dropdown Submenu: Create News & Present News -->
                        <div x-show="isBeritaDropdownOpen" x-cloak class="border-l-2 border-emerald-300 dark:border-emerald-800 ml-4 pl-2.5 pt-1 space-y-1.5">
                            <!-- Submenu 1: Create News -->
                            <button type="button" @click="openCreateNewsView()"
                                :class="activeTab === 'berita' && beritaView === 'create' ? 'submenu-berita-active' : 'submenu-btn-inactive'"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <span class="w-2 h-2 rounded-full shrink-0 transition-all"
                                        :class="activeTab === 'berita' && beritaView === 'create' ? 'bg-emerald-600 ring-4 ring-emerald-200 dark:ring-emerald-900/80 scale-110' : 'bg-slate-300 dark:bg-slate-600'"></span>
                                    <span class="truncate">Create News</span>
                                </div>
                                <span x-show="activeTab === 'berita' && beritaView === 'create'" class="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black tracking-wide">Aktif</span>
                            </button>

                            <!-- Submenu 2: Present News -->
                            <button type="button" @click="openPresentNewsView()"
                                :class="activeTab === 'berita' && beritaView === 'present' ? 'submenu-berita-active' : 'submenu-btn-inactive'"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <span class="w-2 h-2 rounded-full shrink-0 transition-all"
                                        :class="activeTab === 'berita' && beritaView === 'present' ? 'bg-emerald-600 ring-4 ring-emerald-200 dark:ring-emerald-900/80 scale-110' : 'bg-slate-300 dark:bg-slate-600'"></span>
                                    <span class="truncate">Present News</span>
                                </div>
                                <span class="text-[10px] px-2 py-0.5 rounded-full font-black"
                                    :class="activeTab === 'berita' && beritaView === 'present' ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
                                    x-text="articles.length"></span>
                            </button>
                        </div>'''

new_berita_submenu = '''                        <!-- Dropdown Submenu: Create News, Present News, & Trash News -->
                        <div x-show="isBeritaDropdownOpen" x-cloak class="border-l-2 border-emerald-300 dark:border-emerald-800 ml-4 pl-2.5 pt-1 space-y-1.5">
                            <!-- Submenu 1: Create News -->
                            <button type="button" @click="openCreateNewsView()"
                                :class="activeTab === 'berita' && beritaView === 'create' ? 'submenu-berita-active' : 'submenu-btn-inactive'"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <span class="w-2 h-2 rounded-full shrink-0 transition-all"
                                        :class="activeTab === 'berita' && beritaView === 'create' ? 'bg-emerald-600 ring-4 ring-emerald-200 dark:ring-emerald-900/80 scale-110' : 'bg-slate-300 dark:bg-slate-600'"></span>
                                    <span class="truncate">Create News</span>
                                </div>
                                <span x-show="activeTab === 'berita' && beritaView === 'create'" class="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black tracking-wide">Aktif</span>
                            </button>

                            <!-- Submenu 2: Present News -->
                            <button type="button" @click="openPresentNewsView()"
                                :class="activeTab === 'berita' && beritaView === 'present' ? 'submenu-berita-active' : 'submenu-btn-inactive'"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <span class="w-2 h-2 rounded-full shrink-0 transition-all"
                                        :class="activeTab === 'berita' && beritaView === 'present' ? 'bg-emerald-600 ring-4 ring-emerald-200 dark:ring-emerald-900/80 scale-110' : 'bg-slate-300 dark:bg-slate-600'"></span>
                                    <span class="truncate">Present News</span>
                                </div>
                                <span class="text-[10px] px-2 py-0.5 rounded-full font-black"
                                    :class="activeTab === 'berita' && beritaView === 'present' ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
                                    x-text="articles.length"></span>
                            </button>

                            <!-- Submenu 3: Trash News -->
                            <button type="button" @click="openTrashNewsView()"
                                :class="activeTab === 'berita' && beritaView === 'trash' ? 'submenu-berita-active text-rose-700 dark:text-rose-300' : 'submenu-btn-inactive'"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left group">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <span class="w-2 h-2 rounded-full shrink-0 transition-all"
                                        :class="activeTab === 'berita' && beritaView === 'trash' ? 'bg-rose-600 ring-4 ring-rose-200 dark:ring-rose-900/80 scale-110' : 'bg-rose-300 dark:bg-rose-700'"></span>
                                    <span class="truncate flex items-center gap-1">
                                        <span>Trash</span>
                                        <svg class="w-3.5 h-3.5 text-rose-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </span>
                                </div>
                                <span class="text-[10px] px-2 py-0.5 rounded-full font-black"
                                    :class="trashArticles.length > 0 ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'"
                                    x-text="trashArticles.length"></span>
                            </button>
                        </div>'''

content = content.replace(old_berita_submenu, new_berita_submenu)

# Pengajar Submenus: Add Trash Teacher submenu button
old_pengajar_submenu = '''                        <!-- Dropdown Submenu: Add Teacher & Present Teacher -->
                        <div x-show="isPengajarDropdownOpen" x-cloak class="border-l-2 border-indigo-300 dark:border-indigo-800 ml-4 pl-2.5 pt-1 space-y-1.5">
                            <!-- Submenu 1: Add Teacher -->
                            <button type="button" @click="openAddTeacherView()"
                                :class="activeTab === 'pengajar' && pengajarView === 'add' ? 'submenu-pengajar-active' : 'submenu-btn-inactive'"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <span class="w-2 h-2 rounded-full shrink-0 transition-all"
                                        :class="activeTab === 'pengajar' && pengajarView === 'add' ? 'bg-indigo-600 ring-4 ring-indigo-200 dark:ring-indigo-900/80 scale-110' : 'bg-slate-300 dark:bg-slate-600'"></span>
                                    <span class="truncate">Add Teacher</span>
                                </div>
                                <span x-show="activeTab === 'pengajar' && pengajarView === 'add'" class="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-black tracking-wide">Aktif</span>
                            </button>

                            <!-- Submenu 2: Present Teacher -->
                            <button type="button" @click="openPresentTeacherView()"
                                :class="activeTab === 'pengajar' && pengajarView === 'present' ? 'submenu-pengajar-active' : 'submenu-btn-inactive'"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <span class="w-2 h-2 rounded-full shrink-0 transition-all"
                                        :class="activeTab === 'pengajar' && pengajarView === 'present' ? 'bg-indigo-600 ring-4 ring-indigo-200 dark:ring-indigo-900/80 scale-110' : 'bg-slate-300 dark:bg-slate-600'"></span>
                                    <span class="truncate">Present Teacher</span>
                                </div>
                                <span class="text-[10px] px-2 py-0.5 rounded-full font-black"
                                    :class="activeTab === 'pengajar' && pengajarView === 'present' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
                                    x-text="teachers.length"></span>
                            </button>
                        </div>'''

new_pengajar_submenu = '''                        <!-- Dropdown Submenu: Add Teacher, Present Teacher, & Trash Teacher -->
                        <div x-show="isPengajarDropdownOpen" x-cloak class="border-l-2 border-indigo-300 dark:border-indigo-800 ml-4 pl-2.5 pt-1 space-y-1.5">
                            <!-- Submenu 1: Add Teacher -->
                            <button type="button" @click="openAddTeacherView()"
                                :class="activeTab === 'pengajar' && pengajarView === 'add' ? 'submenu-pengajar-active' : 'submenu-btn-inactive'"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <span class="w-2 h-2 rounded-full shrink-0 transition-all"
                                        :class="activeTab === 'pengajar' && pengajarView === 'add' ? 'bg-indigo-600 ring-4 ring-indigo-200 dark:ring-indigo-900/80 scale-110' : 'bg-slate-300 dark:bg-slate-600'"></span>
                                    <span class="truncate">Add Teacher</span>
                                </div>
                                <span x-show="activeTab === 'pengajar' && pengajarView === 'add'" class="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-black tracking-wide">Aktif</span>
                            </button>

                            <!-- Submenu 2: Present Teacher -->
                            <button type="button" @click="openPresentTeacherView()"
                                :class="activeTab === 'pengajar' && pengajarView === 'present' ? 'submenu-pengajar-active' : 'submenu-btn-inactive'"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <span class="w-2 h-2 rounded-full shrink-0 transition-all"
                                        :class="activeTab === 'pengajar' && pengajarView === 'present' ? 'bg-indigo-600 ring-4 ring-indigo-200 dark:ring-indigo-900/80 scale-110' : 'bg-slate-300 dark:bg-slate-600'"></span>
                                    <span class="truncate">Present Teacher</span>
                                </div>
                                <span class="text-[10px] px-2 py-0.5 rounded-full font-black"
                                    :class="activeTab === 'pengajar' && pengajarView === 'present' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
                                    x-text="teachers.length"></span>
                            </button>

                            <!-- Submenu 3: Trash Teacher -->
                            <button type="button" @click="openTrashTeacherView()"
                                :class="activeTab === 'pengajar' && pengajarView === 'trash' ? 'submenu-pengajar-active text-rose-700 dark:text-rose-300' : 'submenu-btn-inactive'"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left group">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <span class="w-2 h-2 rounded-full shrink-0 transition-all"
                                        :class="activeTab === 'pengajar' && pengajarView === 'trash' ? 'bg-rose-600 ring-4 ring-rose-200 dark:ring-rose-900/80 scale-110' : 'bg-rose-300 dark:bg-rose-700'"></span>
                                    <span class="truncate flex items-center gap-1">
                                        <span>Trash</span>
                                        <svg class="w-3.5 h-3.5 text-rose-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </span>
                                </div>
                                <span class="text-[10px] px-2 py-0.5 rounded-full font-black"
                                    :class="trashTeachers.length > 0 ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'"
                                    x-text="trashTeachers.length"></span>
                            </button>
                        </div>'''

content = content.replace(old_pengajar_submenu, new_pengajar_submenu)

# 2. Update Breadcrumb
old_breadcrumb = '''x-text="activeTab === 'kalender' ? (kalenderView === 'create' ? 'Kalender Event / Create Event' : 'Kalender Event / Present Event') : (activeTab === 'berita' ? (beritaView === 'create' ? 'Berita & Artikel / Create News' : 'Berita & Artikel / Present News') : (pengajarView === 'add' ? 'Daftar Pengajar / Add Teacher' : 'Daftar Pengajar / Present Teacher'))"'''

new_breadcrumb = '''x-text="activeTab === 'kalender' ? (kalenderView === 'create' ? 'Kalender Event / Create Event' : (kalenderView === 'trash' ? 'Kalender Event / Trash Event' : 'Kalender Event / Present Event')) : (activeTab === 'berita' ? (beritaView === 'create' ? 'Berita & Artikel / Create News' : (beritaView === 'trash' ? 'Berita & Artikel / Trash News' : 'Berita & Artikel / Present News')) : (pengajarView === 'add' ? 'Daftar Pengajar / Add Teacher' : (pengajarView === 'trash' ? 'Daftar Pengajar / Trash Teacher' : 'Daftar Pengajar / Present Teacher')))"'''

content = content.replace(old_breadcrumb, new_breadcrumb)

# 3. Add Trash Views to Main Content

# A. Kalender Trash View (insert inside <div x-show="activeTab === 'kalender'"> after <div x-show="kalenderView === 'present'">)
kalender_trash_view = '''
                    <!-- =================================================================
                         VIEW 3: TRASH EVENT (TEMPAT SAMPAH AGENDA TERHAPUS)
                         ================================================================= -->
                    <div x-show="kalenderView === 'trash'" class="space-y-6">
                        <!-- Trash Header Bar -->
                        <div class="bg-gradient-to-r from-rose-900 via-slate-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                            <div>
                                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 mb-2 border border-rose-500/40">
                                    <svg class="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    <span>Tempat Sampah Kalender Event</span>
                                </div>
                                <h2 class="text-xl sm:text-2xl font-black text-white">Trash Kalender Event</h2>
                                <p class="text-xs sm:text-sm text-rose-200/80 mt-1">
                                    Agenda yang dihapus sementara ditampung di sini. Anda dapat memulihkan (Restore) atau menghapus permanen.
                                </p>
                            </div>

                            <div class="flex flex-wrap items-center gap-2">
                                <button type="button" @click="openPresentEventView()"
                                    class="px-4 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                    <span>Kembali ke Present Event</span>
                                </button>
                                <button type="button" @click="emptyTrashEvents()" x-show="trashEvents.length > 0"
                                    class="px-4 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    <span>Kosongkan Semua Trash (<span x-text="trashEvents.length"></span>)</span>
                                </button>
                            </div>
                        </div>

                        <!-- Trash Empty State -->
                        <div x-show="trashEvents.length === 0" class="text-center py-16 bg-white dark:bg-[#131D38] rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 space-y-3">
                            <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </div>
                            <h3 class="text-base font-black text-slate-800 dark:text-slate-200">Trash Kalender Kosong</h3>
                            <p class="text-xs text-slate-500 max-w-sm mx-auto">
                                Belum ada agenda kegiatan yang dihapus ke tempat sampah.
                            </p>
                        </div>

                        <!-- Trashed Events Cards Grid -->
                        <div x-show="trashEvents.length > 0" class="admin-grid-3">
                            <template x-for="event in trashEvents" :key="event.id">
                                <div class="p-5 rounded-2xl bg-white dark:bg-[#131D38] border border-rose-200 dark:border-rose-900/60 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden">
                                    <div class="space-y-2.5">
                                        <div class="flex items-center justify-between gap-1.5 flex-wrap">
                                            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                                x-text="event.category"></span>
                                            <span class="text-[11px] font-bold text-slate-400" x-text="event.date"></span>
                                        </div>

                                        <h4 class="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug line-through opacity-80"
                                            x-text="event.title"></h4>

                                        <div class="text-[11px] text-slate-500 space-y-0.5">
                                            <p><strong class="text-slate-700 dark:text-slate-300">Waktu:</strong> <span x-text="event.time"></span></p>
                                            <p><strong class="text-slate-700 dark:text-slate-300">Dihapus pada:</strong> <span x-text="formatDisplayDate(event.deletedAt)"></span></p>
                                        </div>
                                    </div>

                                    <!-- Trash Actions: Restore & Permanent Delete -->
                                    <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                                        <button type="button" @click="restoreEvent(event.id)"
                                            class="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                            <span>Pulihkan</span>
                                        </button>
                                        <button type="button" @click="permanentDeleteEvent(event.id)"
                                            class="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-xs font-black flex items-center gap-1 cursor-pointer transition-all"
                                            title="Hapus Permanen">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            <span>Hapus Permanen</span>
                                        </button>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>'''

old_kal_present_end = '                    </div>\n\n                <!-- =========================================================================\n                     TAB 2: MANAJEMEN BERITA & ARTIKEL'

new_kal_present_end = '                    </div>\n' + kalender_trash_view + '\n\n                <!-- =========================================================================\n                     TAB 2: MANAJEMEN BERITA & ARTIKEL'

content = content.replace(old_kal_present_end, new_kal_present_end)

# B. Berita Trash View (insert inside <div x-show="activeTab === 'berita'"> after <div x-show="beritaView === 'present'">)
berita_trash_view = '''
                    <!-- =================================================================
                         VIEW 3: TRASH NEWS (TEMPAT SAMPAH BERITA & ARTIKEL TERHAPUS)
                         ================================================================= -->
                    <div x-show="beritaView === 'trash'" class="space-y-6">
                        <!-- Trash Header Bar -->
                        <div class="bg-gradient-to-r from-rose-900 via-slate-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                            <div>
                                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 mb-2 border border-rose-500/40">
                                    <svg class="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    <span>Tempat Sampah Berita &amp; Artikel</span>
                                </div>
                                <h2 class="text-xl sm:text-2xl font-black text-white">Trash Berita &amp; Artikel</h2>
                                <p class="text-xs sm:text-sm text-rose-200/80 mt-1">
                                    Artikel yang dihapus sementara ditampung di sini. Anda dapat memulihkan (Restore) atau menghapus permanen.
                                </p>
                            </div>

                            <div class="flex flex-wrap items-center gap-2">
                                <button type="button" @click="openPresentNewsView()"
                                    class="px-4 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                    <span>Kembali ke Present News</span>
                                </button>
                                <button type="button" @click="emptyTrashArticles()" x-show="trashArticles.length > 0"
                                    class="px-4 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    <span>Kosongkan Semua Trash (<span x-text="trashArticles.length"></span>)</span>
                                </button>
                            </div>
                        </div>

                        <!-- Trash Empty State -->
                        <div x-show="trashArticles.length === 0" class="text-center py-16 bg-white dark:bg-[#131D38] rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 space-y-3">
                            <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </div>
                            <h3 class="text-base font-black text-slate-800 dark:text-slate-200">Trash Berita Kosong</h3>
                            <p class="text-xs text-slate-500 max-w-sm mx-auto">
                                Belum ada artikel berita yang dihapus ke tempat sampah.
                            </p>
                        </div>

                        <!-- Trashed Articles List -->
                        <div x-show="trashArticles.length > 0" class="bg-white dark:bg-[#131D38] rounded-3xl border border-rose-200 dark:border-rose-900/60 overflow-hidden shadow-xs divide-y divide-slate-100 dark:divide-slate-800">
                            <template x-for="art in trashArticles" :key="art.id">
                                <div class="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-rose-50/40 dark:hover:bg-rose-950/20 transition-colors">
                                    <div class="flex items-start gap-3.5 flex-1 min-w-0">
                                        <img :src="art.coverImage || '/nls-logo-300.png'" alt="Cover" class="w-14 h-14 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 opacity-60">
                                        <div class="space-y-1 min-w-0">
                                            <div class="flex items-center gap-2 flex-wrap">
                                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                                    x-text="art.category"></span>
                                                <span class="text-xs text-slate-500 font-medium" x-text="art.date"></span>
                                                <span class="text-xs text-slate-400">•</span>
                                                <span class="text-xs font-bold text-slate-600 dark:text-slate-300" x-text="art.author"></span>
                                            </div>
                                            <h4 class="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate line-through opacity-80" x-text="art.title"></h4>
                                            <p class="text-xs text-slate-400">Dihapus pada: <span x-text="formatDisplayDate(art.deletedAt)"></span></p>
                                        </div>
                                    </div>

                                    <div class="flex items-center gap-2 self-end md:self-auto shrink-0">
                                        <button type="button" @click="restoreArticle(art.id)"
                                            class="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                            <span>Pulihkan</span>
                                        </button>
                                        <button type="button" @click="permanentDeleteArticle(art.id)"
                                            class="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-300 text-xs font-black flex items-center gap-1 transition-all cursor-pointer"
                                            title="Hapus Permanen">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            <span>Hapus Permanen</span>
                                        </button>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>'''

old_berita_end = '                    </div>\n\n                </div>\n\n                <!-- =========================================================================\n                     TAB 3: MANAJEMEN DAFTAR PENGAJAR'

new_berita_end = '                    </div>\n' + berita_trash_view + '\n\n                </div>\n\n                <!-- =========================================================================\n                     TAB 3: MANAJEMEN DAFTAR PENGAJAR'

content = content.replace(old_berita_end, new_berita_end)

# C. Pengajar Trash View (insert inside <div x-show="activeTab === 'pengajar'"> after <div x-show="pengajarView === 'present'">)
pengajar_trash_view = '''
                    <!-- =================================================================
                         VIEW 3: TRASH TEACHER (TEMPAT SAMPAH DATA PENGAJAR TERHAPUS)
                         ================================================================= -->
                    <div x-show="pengajarView === 'trash'" class="space-y-6">
                        <!-- Trash Header Bar -->
                        <div class="bg-gradient-to-r from-rose-900 via-slate-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                            <div>
                                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 mb-2 border border-rose-500/40">
                                    <svg class="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    <span>Tempat Sampah Data Pengajar</span>
                                </div>
                                <h2 class="text-xl sm:text-2xl font-black text-white">Trash Data Pengajar</h2>
                                <p class="text-xs sm:text-sm text-rose-200/80 mt-1">
                                    Data guru yang dihapus sementara ditampung di sini. Anda dapat memulihkan (Restore) atau menghapus permanen.
                                </p>
                            </div>

                            <div class="flex flex-wrap items-center gap-2">
                                <button type="button" @click="openPresentTeacherView()"
                                    class="px-4 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                    <span>Kembali ke Present Teacher</span>
                                </button>
                                <button type="button" @click="emptyTrashTeachers()" x-show="trashTeachers.length > 0"
                                    class="px-4 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    <span>Kosongkan Semua Trash (<span x-text="trashTeachers.length"></span>)</span>
                                </button>
                            </div>
                        </div>

                        <!-- Trash Empty State -->
                        <div x-show="trashTeachers.length === 0" class="text-center py-16 bg-white dark:bg-[#131D38] rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 space-y-3">
                            <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </div>
                            <h3 class="text-base font-black text-slate-800 dark:text-slate-200">Trash Pengajar Kosong</h3>
                            <p class="text-xs text-slate-500 max-w-sm mx-auto">
                                Belum ada data pengajar yang dihapus ke tempat sampah.
                            </p>
                        </div>

                        <!-- Trashed Teachers Grid Cards -->
                        <div x-show="trashTeachers.length > 0" class="admin-grid-3">
                            <template x-for="teacher in trashTeachers" :key="teacher.id">
                                <div class="p-5 rounded-3xl bg-white dark:bg-[#131D38] border border-rose-200 dark:border-rose-900/60 shadow-xs flex flex-col justify-between space-y-4">
                                    <div class="space-y-3">
                                        <div class="flex items-start gap-3.5">
                                            <img :src="teacher.photo || '/images/pengajar/mentor-1-math.jpg'" alt="Photo" class="w-14 h-14 rounded-2xl object-cover border border-slate-200 opacity-60 shrink-0 bg-slate-100">
                                            <div class="min-w-0">
                                                <h4 class="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug line-through opacity-80" x-text="teacher.name"></h4>
                                                <p class="text-xs font-bold text-rose-600 dark:text-rose-400 truncate" x-text="teacher.shortName"></p>
                                                <p class="text-[11px] text-slate-500 truncate" x-text="teacher.education"></p>
                                            </div>
                                        </div>

                                        <p class="text-xs text-slate-400">Dihapus pada: <span x-text="formatDisplayDate(teacher.deletedAt)"></span></p>
                                    </div>

                                    <!-- Actions -->
                                    <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                                        <button type="button" @click="restoreTeacher(teacher.id)"
                                            class="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                            <span>Pulihkan</span>
                                        </button>
                                        <button type="button" @click="permanentDeleteTeacher(teacher.id)"
                                            class="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-300 text-xs font-black flex items-center gap-1 transition-all cursor-pointer"
                                            title="Hapus Permanen">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            <span>Hapus Permanen</span>
                                        </button>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>'''

old_pengajar_end = '                    </div>\n                </div>\n\n            </main>'

new_pengajar_end = '                    </div>\n' + pengajar_trash_view + '\n                </div>\n\n            </main>'

content = content.replace(old_pengajar_end, new_pengajar_end)

# 4. Fix symbol mojibake in preview teacher highlights
content = content.replace('<span class="text-indigo-500 font-bold">âœ“</span>', '<span class="text-indigo-500 font-bold">✓</span>')

# 5. Update Alpine.js superAdminApp Data & Methods

# Add trash datasets initialization
old_datasets = '''                teachers: (function() {
                    try {
                        const stored = localStorage.getItem("nls_pengajar_teachers_v1");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                        }
                    } catch (e) {}
                    return (typeof window.NLS_DEFAULT_TEACHERS !== "undefined") ? window.NLS_DEFAULT_TEACHERS : [];
                })(),'''

new_datasets = '''                teachers: (function() {
                    try {
                        const stored = localStorage.getItem("nls_pengajar_teachers_v1");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                        }
                    } catch (e) {}
                    return (typeof window.NLS_DEFAULT_TEACHERS !== "undefined") ? window.NLS_DEFAULT_TEACHERS : [];
                })(),

                // TRASH DATASETS WITH REALTIME LOCALSTORAGE SYNC
                trashEvents: (function() {
                    try {
                        const stored = localStorage.getItem("nls_kalender_events_trash_v1");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed)) return parsed;
                        }
                    } catch (e) {}
                    return [];
                })(),

                trashArticles: (function() {
                    try {
                        const stored = localStorage.getItem("nls_berita_articles_trash_v1");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed)) return parsed;
                        }
                    } catch (e) {}
                    return [];
                })(),

                trashTeachers: (function() {
                    try {
                        const stored = localStorage.getItem("nls_pengajar_teachers_trash_v1");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed)) return parsed;
                        }
                    } catch (e) {}
                    return [];
                })(),'''

content = content.replace(old_datasets, new_datasets)

# Add openTrash methods and replace delete methods with soft delete & restore & permanent delete
old_kal_open = '''                openPresentEventView() {
                    this.activeTab = 'kalender';
                    this.kalenderView = 'present';
                    this.isKalenderDropdownOpen = true;
                    if (this.isMobile) this.isSidebarOpen = false;
                },'''

new_kal_open = '''                openPresentEventView() {
                    this.activeTab = 'kalender';
                    this.kalenderView = 'present';
                    this.isKalenderDropdownOpen = true;
                    if (this.isMobile) this.isSidebarOpen = false;
                },

                openTrashEventView() {
                    this.activeTab = 'kalender';
                    this.kalenderView = 'trash';
                    this.isKalenderDropdownOpen = true;
                    if (this.isMobile) this.isSidebarOpen = false;
                },'''

content = content.replace(old_kal_open, new_kal_open)

old_kal_delete = '''                deleteEvent(id) {
                    if (confirm('Apakah Anda yakin ingin menghapus agenda ini?')) {
                        this.events = this.events.filter(e => e.id !== id);
                        this.saveEventsToStorage();
                        this.showToast('Agenda berhasil dihapus!');
                    }
                },'''

new_kal_delete = '''                deleteEvent(id) {
                    const target = this.events.find(e => e.id === id);
                    if (!target) return;
                    if (confirm(`Apakah Anda yakin ingin memindahkan agenda "${target.title}" ke Trash?`)) {
                        this.events = this.events.filter(e => e.id !== id);
                        const trashed = JSON.parse(JSON.stringify(target));
                        trashed.deletedAt = new Date().toISOString();
                        this.trashEvents.unshift(trashed);
                        this.saveEventsToStorage();
                        this.saveTrashEventsToStorage();
                        this.showToast('Agenda berhasil dipindahkan ke Trash Event!');
                    }
                },

                restoreEvent(id) {
                    const target = this.trashEvents.find(e => e.id === id);
                    if (!target) return;
                    this.trashEvents = this.trashEvents.filter(e => e.id !== id);
                    delete target.deletedAt;
                    this.events.unshift(target);
                    this.saveEventsToStorage();
                    this.saveTrashEventsToStorage();
                    this.showToast(`Agenda "${target.title}" berhasil dipulihkan!`);
                },

                permanentDeleteEvent(id) {
                    if (confirm('Apakah Anda yakin ingin menghapus agenda ini secara permanen dari Trash?')) {
                        this.trashEvents = this.trashEvents.filter(e => e.id !== id);
                        this.saveTrashEventsToStorage();
                        this.showToast('Agenda telah dihapus secara permanen!');
                    }
                },

                emptyTrashEvents() {
                    if (confirm('Apakah Anda yakin ingin mengosongkan semua agenda di Trash Event? Tindakan ini tidak dapat dibatalkan.')) {
                        this.trashEvents = [];
                        this.saveTrashEventsToStorage();
                        this.showToast('Trash Event telah dikosongkan!');
                    }
                },

                saveTrashEventsToStorage() {
                    localStorage.setItem('nls_kalender_events_trash_v1', JSON.stringify(this.trashEvents));
                },'''

content = content.replace(old_kal_delete, new_kal_delete)

# Berita methods
old_berita_open = '''                openPresentNewsView() {
                    this.activeTab = 'berita';
                    this.beritaView = 'present';
                    this.articleEditor.isOpen = false; this.beritaView = 'present';
                    this.isBeritaDropdownOpen = true;
                    if (this.isMobile) this.isSidebarOpen = false;
                },'''

new_berita_open = '''                openPresentNewsView() {
                    this.activeTab = 'berita';
                    this.beritaView = 'present';
                    this.articleEditor.isOpen = false; this.beritaView = 'present';
                    this.isBeritaDropdownOpen = true;
                    if (this.isMobile) this.isSidebarOpen = false;
                },

                openTrashNewsView() {
                    this.activeTab = 'berita';
                    this.beritaView = 'trash';
                    this.articleEditor.isOpen = false;
                    this.isBeritaDropdownOpen = true;
                    if (this.isMobile) this.isSidebarOpen = false;
                },'''

content = content.replace(old_berita_open, new_berita_open)

old_art_delete = '''                deleteArticle(id) {
                    if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
                        this.articles = this.articles.filter(a => a.id !== id);
                        this.saveArticlesToStorage();
                        this.showToast('Artikel berhasil dihapus!');
                    }
                },'''

new_art_delete = '''                deleteArticle(id) {
                    const target = this.articles.find(a => a.id === id);
                    if (!target) return;
                    if (confirm(`Apakah Anda yakin ingin memindahkan artikel "${target.title}" ke Trash?`)) {
                        this.articles = this.articles.filter(a => a.id !== id);
                        const trashed = JSON.parse(JSON.stringify(target));
                        trashed.deletedAt = new Date().toISOString();
                        this.trashArticles.unshift(trashed);
                        this.saveArticlesToStorage();
                        this.saveTrashArticlesToStorage();
                        this.showToast('Artikel berhasil dipindahkan ke Trash Berita!');
                    }
                },

                restoreArticle(id) {
                    const target = this.trashArticles.find(a => a.id === id);
                    if (!target) return;
                    this.trashArticles = this.trashArticles.filter(a => a.id !== id);
                    delete target.deletedAt;
                    this.articles.unshift(target);
                    this.saveArticlesToStorage();
                    this.saveTrashArticlesToStorage();
                    this.showToast(`Artikel "${target.title}" berhasil dipulihkan!`);
                },

                permanentDeleteArticle(id) {
                    if (confirm('Apakah Anda yakin ingin menghapus artikel ini secara permanen dari Trash?')) {
                        this.trashArticles = this.trashArticles.filter(a => a.id !== id);
                        this.saveTrashArticlesToStorage();
                        this.showToast('Artikel telah dihapus secara permanen!');
                    }
                },

                emptyTrashArticles() {
                    if (confirm('Apakah Anda yakin ingin mengosongkan semua artikel di Trash Berita? Tindakan ini tidak dapat dibatalkan.')) {
                        this.trashArticles = [];
                        this.saveTrashArticlesToStorage();
                        this.showToast('Trash Berita telah dikosongkan!');
                    }
                },

                saveTrashArticlesToStorage() {
                    localStorage.setItem('nls_berita_articles_trash_v1', JSON.stringify(this.trashArticles));
                },'''

content = content.replace(old_art_delete, new_art_delete)

# Pengajar methods
old_pengajar_open = '''                openPresentTeacherView() {
                    this.activeTab = 'pengajar';
                    this.pengajarView = 'present';
                    this.isPengajarDropdownOpen = true;
                    if (this.isMobile) this.isSidebarOpen = false;
                },'''

new_pengajar_open = '''                openPresentTeacherView() {
                    this.activeTab = 'pengajar';
                    this.pengajarView = 'present';
                    this.isPengajarDropdownOpen = true;
                    if (this.isMobile) this.isSidebarOpen = false;
                },

                openTrashTeacherView() {
                    this.activeTab = 'pengajar';
                    this.pengajarView = 'trash';
                    this.isPengajarDropdownOpen = true;
                    if (this.isMobile) this.isSidebarOpen = false;
                },'''

content = content.replace(old_pengajar_open, new_pengajar_open)

old_teacher_delete = '''                deleteTeacher(id) {
                    if (confirm('Apakah Anda yakin ingin menghapus pengajar ini?')) {
                        this.teachers = this.teachers.filter(t => t.id !== id);
                        this.saveTeachersToStorage();
                        this.showToast('Pengajar berhasil dihapus!');
                    }
                },'''

new_teacher_delete = '''                deleteTeacher(id) {
                    const target = this.teachers.find(t => t.id === id);
                    if (!target) return;
                    if (confirm(`Apakah Anda yakin ingin memindahkan pengajar "${target.name}" ke Trash?`)) {
                        this.teachers = this.teachers.filter(t => t.id !== id);
                        const trashed = JSON.parse(JSON.stringify(target));
                        trashed.deletedAt = new Date().toISOString();
                        this.trashTeachers.unshift(trashed);
                        this.saveTeachersToStorage();
                        this.saveTrashTeachersToStorage();
                        this.showToast('Pengajar berhasil dipindahkan ke Trash Pengajar!');
                    }
                },

                restoreTeacher(id) {
                    const target = this.trashTeachers.find(t => t.id === id);
                    if (!target) return;
                    this.trashTeachers = this.trashTeachers.filter(t => t.id !== id);
                    delete target.deletedAt;
                    this.teachers.unshift(target);
                    this.saveTeachersToStorage();
                    this.saveTrashTeachersToStorage();
                    this.showToast(`Pengajar "${target.name}" berhasil dipulihkan!`);
                },

                permanentDeleteTeacher(id) {
                    if (confirm('Apakah Anda yakin ingin menghapus data pengajar ini secara permanen dari Trash?')) {
                        this.trashTeachers = this.trashTeachers.filter(t => t.id !== id);
                        this.saveTrashTeachersToStorage();
                        this.showToast('Pengajar telah dihapus secara permanen!');
                    }
                },

                emptyTrashTeachers() {
                    if (confirm('Apakah Anda yakin ingin mengosongkan semua data di Trash Pengajar? Tindakan ini tidak dapat dibatalkan.')) {
                        this.trashTeachers = [];
                        this.saveTrashTeachersToStorage();
                        this.showToast('Trash Pengajar telah dikosongkan!');
                    }
                },

                saveTrashTeachersToStorage() {
                    localStorage.setItem('nls_pengajar_teachers_trash_v1', JSON.stringify(this.trashTeachers));
                },

                formatDisplayDate(isoStr) {
                    if (!isoStr) return '-';
                    try {
                        const d = new Date(isoStr);
                        if (isNaN(d.getTime())) return isoStr;
                        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
                        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
                    } catch (e) {
                        return isoStr;
                    }
                },'''

content = content.replace(old_teacher_delete, new_teacher_delete)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS: Added Trash Submenus and Soft-Delete Engine to all 3 modules in Super Admin!")
