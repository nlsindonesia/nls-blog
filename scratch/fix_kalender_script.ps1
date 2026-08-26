$kalenderPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\kalender\index.html"
$content = [System.IO.File]::ReadAllText($kalenderPath, [System.Text.Encoding]::UTF8)

$oldPattern = '(?s)getDateNumberClasses\(cell\) \{.*?formatDateFull\(dateStr\) \{.*?return `\$\{dayName\}, \$\{d\} \$\{this\.monthNames\[m\]\} \$\{y\}`;\s*\}\s*\}\s*;\s*\}'

$newMethods = @'
getDateNumberClasses(cell) {
                    if (this.selectedDate === cell.dateStr) {
                        return 'text-primary dark:text-sky-400 font-black scale-110';
                    }
                    if (cell.isToday) {
                        return 'text-[#0284c7] dark:text-sky-300 font-black text-sm scale-105';
                    }
                    if (cell.isSunday) {
                        return 'text-rose-600 dark:text-rose-400 font-black';
                    }
                    if (cell.isSaturday) {
                        return 'text-amber-600/90 dark:text-amber-400/90 font-bold';
                    }
                    if (cell.hasEvents) {
                        return 'text-slate-900 dark:text-white font-black';
                    }
                    return 'text-slate-600 dark:text-slate-400 font-semibold';
                },

                getPillClass(cat) {
                    switch (cat) {
                        case 'OSN': return 'pill-osn';
                        case 'SNBT': return 'pill-snbt';
                        case 'TKA': return 'pill-tka';
                        case 'Mitra Sekolah': return 'pill-mitra';
                        case 'Event Dinas': return 'pill-dinas';
                        default: return 'pill-osn';
                    }
                },

                getCategoryDotClass(cat) {
                    switch (cat) {
                        case 'OSN': return 'bg-[#0284c7]';
                        case 'SNBT': return 'bg-[#ea580c]';
                        case 'TKA': return 'bg-[#0d9488]';
                        case 'Mitra Sekolah': return 'bg-[#7c3aed]';
                        case 'Event Dinas': return 'bg-[#e11d48]';
                        default: return 'bg-primary';
                    }
                },

                getCategoryStripe(cat) {
                    switch (cat) {
                        case 'OSN': return 'bg-[#0284c7]';
                        case 'SNBT': return 'bg-[#ea580c]';
                        case 'TKA': return 'bg-[#0d9488]';
                        case 'Mitra Sekolah': return 'bg-[#7c3aed]';
                        case 'Event Dinas': return 'bg-[#e11d48]';
                        default: return 'bg-primary';
                    }
                },

                getCategoryBadgeClass(cat) {
                    switch (cat) {
                        case 'OSN':
                            return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800';
                        case 'SNBT':
                            return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800';
                        case 'TKA':
                            return 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800';
                        case 'Mitra Sekolah':
                            return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
                        case 'Event Dinas':
                            return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
                        default:
                            return 'bg-slate-100 text-slate-700 border-slate-200';
                    }
                },

                getKebutuhanForCategory(cat) {
                    if (cat === 'OSN' || cat === 'SNBT' || cat === 'TKA') return 'Bimbel Online';
                    if (cat === 'Mitra Sekolah') return 'Mitra Sekolah';
                    if (cat === 'Event Dinas') return 'Mitra Dinas';
                    return 'Privat';
                },

                formatDateFull(dateStr) {
                    if (!dateStr) return '';
                    const parts = dateStr.split('-');
                    if (parts.length !== 3) return dateStr;
                    const y = parseInt(parts[0], 10);
                    const m = parseInt(parts[1], 10) - 1;
                    const d = parseInt(parts[2], 10);
                    const dt = new Date(y, m, d);
                    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                    const dayName = days[dt.getDay()];
                    return `${dayName}, ${d} ${this.monthNames[m]} ${y}`;
                }
            };
        }
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldPattern, $newMethods)

[System.IO.File]::WriteAllText($kalenderPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Cleaned up and restored all JavaScript methods in kalender/index.html!"
