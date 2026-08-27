const fs = require('fs');

const CALENDAR_JS_METHODS = `
                // Filtered Events
                filteredEvents() {
                    return this.events.filter(evt => {
                        const matchCat = this.selectedCategory === 'all' || evt.category === this.selectedCategory;
                        const matchJenjang = this.selectedJenjang === 'all' || evt.jenjang === this.selectedJenjang;
                        return matchCat && matchJenjang;
                    });
                },

                eventsInCurrentMonth() {
                    const year = this.currentYear;
                    const month = this.currentMonth;
                    const mStart = year + '-' + String(month + 1).padStart(2, '0') + '-01';
                    const daysInM = new Date(year, month + 1, 0).getDate();
                    const mEnd = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(daysInM).padStart(2, '0');
                    
                    return this.filteredEvents().filter(e => {
                        const eStart = e.date || '';
                        const eEnd = (e.endDate && e.endDate >= e.date) ? e.endDate : e.date;
                        return eStart <= mEnd && eEnd >= mStart;
                    });
                },

                displayedEvents() {
                    if (this.selectedDate) {
                        return this.filteredEvents().filter(e => {
                            const eStart = e.date || '';
                            const eEnd = (e.endDate && e.endDate >= e.date) ? e.endDate : e.date;
                            return eStart <= this.selectedDate && eEnd >= this.selectedDate;
                        });
                    }
                    return this.eventsInCurrentMonth();
                },

                // Calendar Cells Computation (7 Columns: Senin = 0, Minggu = 6)
                get calendarCells() {
                    const cells = [];
                    const year = this.currentYear;
                    const month = this.currentMonth;

                    const firstDayObj = new Date(year, month, 1);
                    let startDay = firstDayObj.getDay(); // 0 = Sun, 1 = Mon ...
                    startDay = (startDay + 6) % 7; // Monday = 0, Sunday = 6

                    const daysInMonth = new Date(year, month + 1, 0).getDate();

                    const now = new Date();
                    const realTodayStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');

                    // Leading empty slots
                    for (let i = 0; i < startDay; i++) {
                        cells.push({
                            isEmpty: true,
                            key: 'empty-' + i
                        });
                    }

                    // Days
                    for (let d = 1; d <= daysInMonth; d++) {
                        const dateStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
                        const dayEvents = this.filteredEvents().filter(e => {
                            const eStart = e.date || '';
                            const eEnd = (e.endDate && e.endDate >= e.date) ? e.endDate : e.date;
                            return eStart <= dateStr && eEnd >= dateStr;
                        });
                        const isToday = (dateStr === realTodayStr);

                        const dayOfWeek = (startDay + d - 1) % 7;
                        const isSaturday = (dayOfWeek === 5);
                        const isSunday = (dayOfWeek === 6);
                        const isWeekend = (isSaturday || isSunday);

                        cells.push({
                            isEmpty: false,
                            dayNumber: d,
                            dateStr: dateStr,
                            key: dateStr,
                            isToday: isToday,
                            isWeekend: isWeekend,
                            isSaturday: isSaturday,
                            isSunday: isSunday,
                            events: dayEvents,
                            hasEvents: dayEvents.length > 0
                        });
                    }

                    return cells;
                },

                onCellClick(cell) {
                    if (cell.isEmpty) return;
                    if (cell.hasEvents) {
                        if (this.selectedDate === cell.dateStr) {
                            this.selectedDate = null;
                        } else {
                            this.selectedDate = cell.dateStr;
                        }
                    } else {
                        this.selectedDate = cell.dateStr;
                    }
                    this.$nextTick(() => this.updateCardHeight());
                },

                getCellClasses(cell) {
                    if (cell.isEmpty) {
                        return 'empty opacity-0 pointer-events-none border-transparent bg-transparent';
                    }
                    let res = '';
                    if (cell.isSunday) res += ' sunday';
                    else if (cell.isSaturday) res += ' saturday weekend';
                    else if (cell.isWeekend) res += ' weekend';

                    if (cell.isToday) res += ' today';
                    if (cell.hasEvents) res += ' has-events';
                    if (this.selectedDate === cell.dateStr) res += ' selected';
                    return res;
                },

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
                        case 'TKA': return 'pill-tka';
                        case 'SNBT': return 'pill-snbt';
                        case 'Mitra Sekolah': return 'pill-mitra';
                        case 'Event Dinas': return 'pill-dinas';
                        default: return 'pill-osn';
                    }
                },

                getEventAdminCardClass(cat) {
                    switch (cat) {
                        case 'OSN': return 'admin-card-osn';
                        case 'TKA': return 'admin-card-tka';
                        case 'SNBT': return 'admin-card-snbt';
                        case 'Mitra Sekolah': return 'admin-card-mitra';
                        case 'Event Dinas': return 'admin-card-dinas';
                        default: return 'admin-card-osn';
                    }
                },

                getCategoryStripe(cat) {
                    switch (cat) {
                        case 'OSN': return 'bg-sky-500';
                        case 'TKA': return 'bg-amber-500';
                        case 'SNBT': return 'bg-emerald-500';
                        case 'Mitra Sekolah': return 'bg-purple-500';
                        case 'Event Dinas': return 'bg-rose-500';
                        default: return 'bg-sky-500';
                    }
                },

                formatEventDateRange(startDate, endDate) {
                    if (!startDate) return '';
                    if (!endDate || endDate === startDate) {
                        return this.formatDateFull ? this.formatDateFull(startDate) : startDate;
                    }
                    try {
                        const d1 = new Date(startDate);
                        const d2 = new Date(endDate);
                        if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return startDate + ' s/d ' + endDate;
                        
                        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                        const day1 = d1.getDate();
                        const m1 = months[d1.getMonth()];
                        const y1 = d1.getFullYear();
                        
                        const day2 = d2.getDate();
                        const m2 = months[d2.getMonth()];
                        const y2 = d2.getFullYear();
                        
                        if (y1 === y2 && m1 === m2) {
                            return day1 + ' - ' + day2 + ' ' + m1 + ' ' + y1;
                        } else if (y1 === y2) {
                            return day1 + ' ' + m1 + ' - ' + day2 + ' ' + m2 + ' ' + y1;
                        } else {
                            return day1 + ' ' + m1 + ' ' + y1 + ' - ' + day2 + ' ' + m2 + ' ' + y2;
                        }
                    } catch (e) {
                        return startDate + ' - ' + endDate;
                    }
                },

                getEventCategoryBadge(cat) {
                    switch (cat) {
                        case 'OSN':
                            return 'bg-white/95 dark:bg-sky-950/90 text-slate-950 dark:text-white font-black border-2 border-sky-400 dark:border-sky-500 shadow-xs';
                        case 'TKA':
                            return 'bg-white/95 dark:bg-amber-950/90 text-slate-950 dark:text-white font-black border-2 border-amber-400 dark:border-amber-500 shadow-xs';
                        case 'SNBT':
                            return 'bg-white/95 dark:bg-emerald-950/90 text-slate-950 dark:text-white font-black border-2 border-emerald-400 dark:border-emerald-500 shadow-xs';
                        case 'Mitra Sekolah':
                            return 'bg-white/95 dark:bg-purple-950/90 text-slate-950 dark:text-white font-black border-2 border-purple-400 dark:border-purple-500 shadow-xs';
                        case 'Event Dinas':
                            return 'bg-white/95 dark:bg-rose-950/90 text-slate-950 dark:text-white font-black border-2 border-rose-400 dark:border-rose-500 shadow-xs';
                        default:
                            return 'bg-white/95 dark:bg-slate-900 text-slate-950 dark:text-white font-black border-2 border-slate-400 shadow-xs';
                    }
                },
`;

const files = [
    'c:\\Users\\vc\\Documents\\nls-blog-hame\\nls-blog-hame\\kalender\\index.html',
    'c:\\Users\\vc\\Documents\\nls-blog-hame\\nls-blog-hame\\index.html',
    'c:\\Users\\vc\\Documents\\nls-blog-hame\\nls-blog-hame\\osn\\index.html'
];

files.forEach(fPath => {
    let content = fs.readFileSync(fPath, 'utf8');
    const regex = /(\/\/ Filtered Events|filteredEvents\(\)\s*\{)[\s\S]*?getEventCategoryBadge\(cat\)[\s\S]*?default:[\s\S]*?\};?\s*\},/m;
    if (regex.test(content)) {
        content = content.replace(regex, CALENDAR_JS_METHODS.trim());
        fs.writeFileSync(fPath, content, 'utf8');
        console.log('Successfully updated:', fPath);
    } else {
        console.log('Regex not matched for:', fPath);
    }
});

// Update nlsadmin/index.html
const adminPath = 'c:\\Users\\vc\\Documents\\nls-blog-hame\\nls-blog-hame\\nlsadmin\\index.html';
let adminContent = fs.readFileSync(adminPath, 'utf8');
const adminFormatMethod = `
                formatEventDateRange(startDate, endDate) {
                    if (!startDate) return '';
                    if (!endDate || endDate === startDate) {
                        return this.formatDateFull ? this.formatDateFull(startDate) : startDate;
                    }
                    try {
                        const d1 = new Date(startDate);
                        const d2 = new Date(endDate);
                        if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return startDate + ' s/d ' + endDate;
                        
                        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                        const day1 = d1.getDate();
                        const m1 = months[d1.getMonth()];
                        const y1 = d1.getFullYear();
                        
                        const day2 = d2.getDate();
                        const m2 = months[d2.getMonth()];
                        const y2 = d2.getFullYear();
                        
                        if (y1 === y2 && m1 === m2) {
                            return day1 + ' - ' + day2 + ' ' + m1 + ' ' + y1;
                        } else if (y1 === y2) {
                            return day1 + ' ' + m1 + ' - ' + day2 + ' ' + m2 + ' ' + y1;
                        } else {
                            return day1 + ' ' + m1 + ' ' + y1 + ' - ' + day2 + ' ' + m2 + ' ' + y2;
                        }
                    } catch (e) {
                        return startDate + ' - ' + endDate;
                    }
                },
`;

const adminRegex = /formatEventDateRange\(startDate,\s*endDate\)[\s\S]*?return startDate[\s\S]*?\};?\s*\},/m;
if (adminRegex.test(adminContent)) {
    adminContent = adminContent.replace(adminRegex, adminFormatMethod.trim());
    fs.writeFileSync(adminPath, adminContent, 'utf8');
    console.log('Successfully updated formatEventDateRange in nlsadmin.');
} else {
    // Check general formatEventDateRange in admin
    const adminRegex2 = /formatEventDateRange\(startDate,\s*endDate\)[\s\S]*?\},/m;
    if (adminRegex2.test(adminContent)) {
        adminContent = adminContent.replace(adminRegex2, adminFormatMethod.trim());
        fs.writeFileSync(adminPath, adminContent, 'utf8');
        console.log('Successfully updated formatEventDateRange (pattern 2) in nlsadmin.');
    }
}
