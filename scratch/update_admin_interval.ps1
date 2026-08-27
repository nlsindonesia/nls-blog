# ==============================================================================
# SCRIPT TO IMPLEMENT DATE INTERVAL / MULTI-DAY SUPPORT FOR CALENDAR EVENTS
# ==============================================================================

Write-Host "=== APPLYING DATE INTERVAL FEATURE TO NLSADMIN & KALENDER ==="

# 1. Update nlsadmin/index.html Form and JavaScript Methods
$adminPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$adminContent = [System.IO.File]::ReadAllText($adminPath, [System.Text.Encoding]::UTF8)

# Replace Form Date Input with Start Date & End Date (Interval)
$oldFormMeta = @"
                                    <div class="art-meta-row">
                                        <div>
                                            <label class="block mb-1 text-slate-700 dark:text-slate-300 font-bold">Tanggal Kegiatan *</label>
                                            <input type="date" x-model="eventForm.date" required
                                                class="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold">
                                        </div>
                                        <div>
                                            <label class="block mb-1 text-slate-700 dark:text-slate-300 font-bold">Waktu / Jam *</label>
                                            <input type="text" x-model="eventForm.time" required placeholder="08:00 - 11:30 WIB"
                                                class="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs">
                                        </div>
                                        <div>
                                            <label class="block mb-1 text-slate-700 dark:text-slate-300 font-bold">Mode Pelaksanaan *</label>
                                            <input type="text" x-model="eventForm.mode" required placeholder="Online (CBT NLS)"
                                                class="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs">
                                        </div>
                                    </div>
"@

$newFormMeta = @"
                                    <!-- Tanggal Pelaksanaan (Interval / Multi-hari) -->
                                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                        <div>
                                            <label class="block mb-1 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-between">
                                                <span>Tanggal Mulai *</span>
                                                <span class="text-[10px] text-sky-600 font-black">Wajib</span>
                                            </label>
                                            <input type="date" x-model="eventForm.date" required
                                                class="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold focus:ring-2 focus:ring-sky-500">
                                        </div>
                                        <div>
                                            <label class="block mb-1 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-between">
                                                <span>Tanggal Selesai</span>
                                                <span class="text-[10px] text-slate-400 font-medium">Opsional</span>
                                            </label>
                                            <input type="date" x-model="eventForm.endDate" :min="eventForm.date" placeholder="Selesai (Opsional)"
                                                class="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold focus:ring-2 focus:ring-sky-500">
                                        </div>
                                        <div>
                                            <label class="block mb-1 text-slate-700 dark:text-slate-300 font-bold">Waktu / Jam *</label>
                                            <input type="text" x-model="eventForm.time" required placeholder="08:00 - 11:30 WIB"
                                                class="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-sky-500">
                                        </div>
                                        <div>
                                            <label class="block mb-1 text-slate-700 dark:text-slate-300 font-bold">Mode Pelaksanaan *</label>
                                            <input type="text" x-model="eventForm.mode" required placeholder="Online (CBT NLS)"
                                                class="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-sky-500">
                                        </div>
                                    </div>

                                    <!-- Interval Range Realtime Badge -->
                                    <div x-show="eventForm.date && eventForm.endDate && eventForm.endDate > eventForm.date" class="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-between text-xs transition-all">
                                        <div class="flex items-center gap-2">
                                            <span class="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
                                            <span class="font-bold text-slate-700 dark:text-slate-300">Periode Interval:</span>
                                            <span class="font-black text-sky-700 dark:text-sky-300" x-text="formatEventDateRange(eventForm.date, eventForm.endDate)"></span>
                                        </div>
                                        <button type="button" @click="eventForm.endDate = ''" class="text-[11px] text-rose-600 dark:text-rose-400 hover:underline font-bold cursor-pointer">Hapus Interval (1 Hari)</button>
                                    </div>
"@

if ($adminContent.Contains($oldFormMeta)) {
    $adminContent = $adminContent.Replace($oldFormMeta, $newFormMeta)
    Write-Host "Replaced form date meta in nlsadmin."
} else {
    Write-Host "Warning: oldFormMeta exact match not found, checking regex..."
    $adminContent = [regex]::Replace($adminContent, '(?s)<div class="art-meta-row">.*?Tanggal Kegiatan \*.*?</div>\s*</div>', $newFormMeta)
}

# Update preview card date in nlsadmin
$adminContent = $adminContent.Replace('x-text="eventForm.date || ''2026-08-15''"', 'x-text="formatEventDateRange(eventForm.date, eventForm.endDate) || ''2026-08-15''"')
$adminContent = $adminContent.Replace('x-text="event.date"', 'x-text="formatEventDateRange(event.date, event.endDate)"')

[System.IO.File]::WriteAllText($adminPath, $adminContent, [System.Text.Encoding]::UTF8)
Write-Host "Updated nlsadmin/index.html UI elements."
