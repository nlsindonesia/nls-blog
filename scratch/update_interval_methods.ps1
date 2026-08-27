$files = @(
    "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\kalender\index.html",
    "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\index.html",
    "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\osn\index.html"
)

$targetPattern = '(?s)eventsInCurrentMonth\s*\(\s*\)\s*\{.*?displayedEvents\s*\(\s*\)\s*\{.*?\n\s*\},'

$replacement = @"
eventsInCurrentMonth() {
                    const year = this.currentYear;
                    const month = this.currentMonth;
                    const mStart = `${year}-${String(month + 1).padStart(2, '0')}-01`;
                    const daysInM = new Date(year, month + 1, 0).getDate();
                    const mEnd = `${year}-${String(month + 1).padStart(2, '0')}-${String(daysInM).padStart(2, '0')}`;
                    
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
"@

foreach ($fPath in $files) {
    $content = [System.IO.File]::ReadAllText($fPath, [System.Text.Encoding]::UTF8)
    
    if ($content -match $targetPattern) {
        $content = [regex]::Replace($content, $targetPattern, $replacement)
        Write-Host "Updated eventsInCurrentMonth and displayedEvents in $fPath"
    } else {
        Write-Host "Warning: pattern not matched in $fPath"
    }
    
    # Also ensure dayEvents in calendarCells checks interval
    $cellFilterOld = 'const dayEvents = this.filteredEvents().filter(e => e.date === dateStr);'
    $cellFilterNew = @"
const dayEvents = this.filteredEvents().filter(e => {
                            const eStart = e.date || '';
                            const eEnd = (e.endDate && e.endDate >= e.date) ? e.endDate : e.date;
                            return eStart <= dateStr && eEnd >= dateStr;
                        });
"@
    if ($content.Contains($cellFilterOld)) {
        $content = $content.Replace($cellFilterOld, $cellFilterNew)
        Write-Host "Updated cell filter in $fPath"
    }

    [System.IO.File]::WriteAllText($fPath, $content, [System.Text.Encoding]::UTF8)
}
