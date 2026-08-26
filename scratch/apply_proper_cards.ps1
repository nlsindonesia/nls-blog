$privatPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\privat\index.html"
$content = [System.IO.File]::ReadAllText($privatPath, [System.Text.Encoding]::UTF8)

# Reguler replacement
$oldReguler = '(?s)<!-- Diperuntukan Untuk \(Reguler\) -->.*?</div>\s*<div class="my-6 pt-5 pb-2 border-t'
$newReguler = @'
<!-- Diperuntukkan Untuk (Reguler) -->
                                <div class="mb-6 space-y-2">
                                    <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                                        <span class="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                                        <span>Diperuntukkan Untuk:</span>
                                    </div>
                                    <div class="space-y-2">
                                        <div class="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-2.5 transition-all hover:border-sky-300 shadow-2xs">
                                            <span class="w-5 h-5 rounded-md bg-[#0284c7] text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 shadow-xs">1</span>
                                            <span class="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug">Pendampingan siswa Kurikulum Nasional</span>
                                        </div>
                                        <div class="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-2.5 transition-all hover:border-sky-300 shadow-2xs">
                                            <span class="w-5 h-5 rounded-md bg-[#0284c7] text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 shadow-xs">2</span>
                                            <span class="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug">Persiapan TKA SD, SMP, SMA</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="my-6 pt-5 pb-2 border-t
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldReguler, $newReguler)

# Exclusive replacement
$oldExclusive = '(?s)<!-- Diperuntukan Untuk \(Exclusive\) -->.*?</div>\s*<div style="border-color: rgba\(255, 255, 255, 0\.15\);"'
$newExclusive = @'
<!-- Diperuntukkan Untuk (Exclusive) -->
                                <div class="mb-6 space-y-2">
                                    <div style="background: rgba(245, 158, 11, 0.2); border: 1px solid rgba(245, 158, 11, 0.5); color: #fde047;" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider">
                                        <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                                        <span>Diperuntukkan Untuk:</span>
                                    </div>
                                    <div class="space-y-2">
                                        <div style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(245, 158, 11, 0.35);" class="p-2.5 rounded-xl flex items-start gap-2.5 transition-all hover:border-amber-400 shadow-2xs backdrop-blur-xs">
                                            <span style="background: linear-gradient(135deg, #f59e0b, #d97706); color: #0b1727;" class="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 shadow-xs">1</span>
                                            <span style="color: #f8fafc !important;" class="text-xs font-bold leading-snug">Persiapan OSN Tingkat Kota/Provinsi (SD, SMP, SMA)</span>
                                        </div>
                                        <div style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(245, 158, 11, 0.35);" class="p-2.5 rounded-xl flex items-start gap-2.5 transition-all hover:border-amber-400 shadow-2xs backdrop-blur-xs">
                                            <span style="background: linear-gradient(135deg, #f59e0b, #d97706); color: #0b1727;" class="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 shadow-xs">2</span>
                                            <span style="color: #f8fafc !important;" class="text-xs font-bold leading-snug">Pendampingan siswa SD/SMP Kurikulum Internasional</span>
                                        </div>
                                        <div style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(245, 158, 11, 0.35);" class="p-2.5 rounded-xl flex items-start gap-2.5 transition-all hover:border-amber-400 shadow-2xs backdrop-blur-xs">
                                            <span style="background: linear-gradient(135deg, #f59e0b, #d97706); color: #0b1727;" class="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 shadow-xs">3</span>
                                            <span style="color: #f8fafc !important;" class="text-xs font-bold leading-snug">Persiapan SNBT / Mandiri</span>
                                        </div>
                                    </div>
                                </div>

                                <div style="border-color: rgba(255, 255, 255, 0.15);"
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldExclusive, $newExclusive)

# Juara replacement
$oldJuara = '(?s)<!-- Diperuntukan Untuk \(Juara\) -->.*?</div>\s*<div class="my-6 pt-5 pb-2 border-t'
$newJuara = @'
<!-- Diperuntukkan Untuk (Juara) -->
                                <div class="mb-6 space-y-2">
                                    <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                        <span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                        <span>Diperuntukkan Untuk:</span>
                                    </div>
                                    <div class="space-y-2">
                                        <div class="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-2.5 transition-all hover:border-purple-300 shadow-2xs">
                                            <span class="w-5 h-5 rounded-md bg-[#7c3aed] text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 shadow-xs">1</span>
                                            <span class="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug">Persiapan OSN Tingkat Semifinal/Final (SD, SMP, SMA)</span>
                                        </div>
                                        <div class="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-2.5 transition-all hover:border-purple-300 shadow-2xs">
                                            <span class="w-5 h-5 rounded-md bg-[#7c3aed] text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 shadow-xs">2</span>
                                            <span class="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug">Pendampingan siswa SMA Kurikulum Internasional</span>
                                        </div>
                                        <div class="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-2.5 transition-all hover:border-purple-300 shadow-2xs">
                                            <span class="w-5 h-5 rounded-md bg-[#7c3aed] text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 shadow-xs">3</span>
                                            <span class="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug">Persiapan Kompetisi Internasional seperti AMO, SEAMO dan sebagainya</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="my-6 pt-5 pb-2 border-t
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldJuara, $newJuara)

[System.IO.File]::WriteAllText($privatPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Applied proper beautiful cards layout to privat/index.html!"
