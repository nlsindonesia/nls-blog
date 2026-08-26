$kalenderPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\kalender\index.html"
$content = [System.IO.File]::ReadAllText($kalenderPath, [System.Text.Encoding]::UTF8)

# 1. Update CSS styles for Day Headers & Cells
$oldCssPattern = '(?s)\.cal-day-header\.weekend \{.*?\.cal-cell\.selected \{.*?\n        \}'
$newCss = @'
        .cal-day-header.saturday {
            color: #d97706;
            background: #fef3c7;
            border: 1px solid #fde68a;
        }
        html.dark .cal-day-header.saturday {
            color: #fbbf24;
            background: #2e1e0f;
            border-color: #5c3b16;
        }

        .cal-day-header.sunday {
            color: #e11d48 !important;
            background: #ffe4e6 !important;
            border: 1px solid #fecdd3 !important;
            font-weight: 900 !important;
        }
        html.dark .cal-day-header.sunday {
            color: #fb7185 !important;
            background: #38101a !important;
            border-color: #5c1d2e !important;
        }

        .cal-cell {
            min-height: 78px;
            border-radius: 1.125rem;
            padding: 0.5rem;
            display: flex;
            flex-direction: column;
            position: relative;
            border: 1.5px solid #e2e8f0;
            background: #ffffff;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            user-select: none;
        }
        @media (min-width: 640px) {
            .cal-cell {
                min-height: 95px;
                padding: 0.625rem;
            }
        }
        @media (min-width: 1024px) {
            .cal-cell {
                min-height: 118px;
                padding: 0.75rem;
            }
        }
        html.dark .cal-cell {
            background: #16223e;
            border-color: #263654;
        }

        .cal-cell:hover:not(.empty) {
            transform: translateY(-3px);
            border-color: #006493;
            box-shadow: 0 12px 25px -5px rgba(0, 100, 147, 0.18);
            z-index: 10;
        }
        html.dark .cal-cell:hover:not(.empty) {
            border-color: #38bdf8;
            box-shadow: 0 12px 25px -5px rgba(0, 0, 0, 0.6);
        }

        /* Saturday Cell */
        .cal-cell.saturday {
            background: #fffdfa;
            border-color: #fde68a;
        }
        html.dark .cal-cell.saturday {
            background: #17151f;
            border-color: #3b281c;
        }

        /* Sunday Cell (Distinctive Soft Rose Tint & Red Border) */
        .cal-cell.sunday {
            background: #fff5f5 !important;
            border-color: #fecdd3 !important;
        }
        html.dark .cal-cell.sunday {
            background: #1e1117 !important;
            border-color: #4a1523 !important;
        }
        .cal-cell.sunday:hover:not(.empty) {
            border-color: #e11d48 !important;
            box-shadow: 0 12px 25px -5px rgba(225, 29, 72, 0.22) !important;
        }

        /* Today Cell (Prominent Vibrant Glow, Gradient & Standout Border) */
        .cal-cell.today {
            background: linear-gradient(145deg, #e0f2fe 0%, #dbeafe 100%) !important;
            border: 2.5px solid #0284c7 !important;
            box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.28), 0 10px 25px -5px rgba(2, 132, 199, 0.25) !important;
            transform: scale(1.015);
            z-index: 15;
        }
        html.dark .cal-cell.today {
            background: linear-gradient(145deg, #0b2545 0%, #11335e 100%) !important;
            border: 2.5px solid #38bdf8 !important;
            box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.35), 0 10px 25px -5px rgba(0, 0, 0, 0.7) !important;
        }
        .cal-cell.today:hover:not(.empty) {
            transform: scale(1.025) translateY(-2px);
            box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.35), 0 15px 30px -5px rgba(2, 132, 199, 0.3) !important;
        }

        .cal-cell.has-events {
            border-color: #93c5fd;
            box-shadow: 0 2px 8px rgba(0, 100, 147, 0.06);
        }
        html.dark .cal-cell.has-events {
            border-color: #1d4ed8;
        }

        .cal-cell.selected {
            border-color: #006493 !important;
            background: #e0f2fe !important;
            box-shadow: 0 0 0 3px rgba(0, 100, 147, 0.3) !important;
            transform: scale(1.02);
            z-index: 20;
        }
        html.dark .cal-cell.selected {
            background: #172d57 !important;
            border-color: #38bdf8 !important;
            box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.35) !important;
        }
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldCssPattern, $newCss)

# 2. Update 7-Day Header in HTML
$oldHeader = '<div class="cal-day-header weekend">Sabtu</div>' + "`r`n" + '                                <div class="cal-day-header weekend">Minggu</div>'
$newHeader = '<div class="cal-day-header saturday">Sabtu</div>' + "`r`n" + '                                <div class="cal-day-header sunday">Minggu</div>'
$content = $content.Replace($oldHeader, $newHeader)

# 3. Update Today Badge in Cell Top Row
$oldBadge = '<template x-if="cell.isToday">' + "`r`n" + '                                                <span class="px-1.5 py-0.5 rounded-md bg-primary text-white text-[9px] font-black uppercase tracking-wider">Hari Ini</span>' + "`r`n" + '                                            </template>'
$newBadge = '<template x-if="cell.isToday">' + "`r`n" + '                                                <span style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important; color: #ffffff !important;" class="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider shadow-xs">Hari Ini</span>' + "`r`n" + '                                            </template>'
$content = $content.Replace($oldBadge, $newBadge)

# 4. Update JS logic in calendarCells, getCellClasses, and getDateNumberClasses
$oldJsPattern = '(?s)const isWeekend = \(dayOfWeek === 5 \|\| dayOfWeek === 6\);.*?return res;\s*\}'
$newJs = @'
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
                            const el = document.getElementById('detail-kegiatan');
                            if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        }
                    } else {
                        this.selectedDate = cell.dateStr;
                    }
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
                }
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldJsPattern, $newJs)

# 5. Update getDateNumberClasses
$oldNumberJsPattern = '(?s)getDateNumberClasses\(cell\) \{.*?return [^;]+;\s*\}'
$newNumberJs = @'
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
                }
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldNumberJsPattern, $newNumberJs)

[System.IO.File]::WriteAllText($kalenderPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Applied Sunday (Red/Rose) & Today (Distinct Glow & Gradient) styles to kalender/index.html!"
