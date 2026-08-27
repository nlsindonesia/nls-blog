$files = @(
    "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\kalender\index.html",
    "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\index.html",
    "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\osn\index.html",
    "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
)

$goodEventsInMonth = @'
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
'@

foreach ($fPath in $files) {
    if (Test-Path $fPath) {
        $content = [System.IO.File]::ReadAllText($fPath, [System.Text.Encoding]::UTF8)
        
        # Replace broken eventsInCurrentMonth
        $content = [regex]::Replace($content, '(?s)eventsInCurrentMonth\s*\(\s*\)\s*\{.*?return this\.filteredEvents\(\)\.filter.*?\}\s*\},', $goodEventsInMonth)
        
        [System.IO.File]::WriteAllText($fPath, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Fixed string formatting in $fPath"
    }
}
