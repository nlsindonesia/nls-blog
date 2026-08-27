# ==============================================================================
# SCRIPT TO APPLY CALENDAR DATE INTERVAL JAVASCRIPT LOGIC ACROSS ALL PAGES
# ==============================================================================

# Helper functions block to inject
$dateRangeHelper = @"
                formatEventDateRange(startDate, endDate) {
                    if (!startDate) return '';
                    if (!endDate || endDate === startDate) {
                        return this.formatDateFull ? this.formatDateFull(startDate) : startDate;
                    }
                    try {
                        const d1 = new Date(startDate);
                        const d2 = new Date(endDate);
                        if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return `${startDate} s/d ${endDate}`;
                        
                        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                        const day1 = d1.getDate();
                        const m1 = months[d1.getMonth()];
                        const y1 = d1.getFullYear();
                        
                        const day2 = d2.getDate();
                        const m2 = months[d2.getMonth()];
                        const y2 = d2.getFullYear();
                        
                        if (y1 === y2 && m1 === m2) {
                            return `${day1} - ${day2} ${m1} ${y1}`;
                        } else if (y1 === y2) {
                            return `${day1} ${m1} - ${day2} ${m2} ${y1}`;
                        } else {
                            return `${day1} ${m1} ${y1} - ${day2} ${m2} ${y2}`;
                        }
                    } catch (e) {
                        return `${startDate} - ${endDate}`;
                    }
                },
"@

# 1. Update nlsadmin/index.html
$adminPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$adminContent = [System.IO.File]::ReadAllText($adminPath, [System.Text.Encoding]::UTF8)

# Inject formatEventDateRange if not present
if (-not $adminContent.Contains('formatEventDateRange(startDate, endDate)')) {
    $adminContent = $adminContent.Replace('getEventCategoryBadge(cat) {', $dateRangeHelper + "`n                getEventCategoryBadge(cat) {")
    Write-Host "Injected formatEventDateRange to nlsadmin."
}

# Update saveEventFromBuilder in nlsadmin
$newSaveBuilder = @"
                saveEventFromBuilder() {
                    const f = this.eventForm;
                    const highlights = f.highlightsRaw ? f.highlightsRaw.split('\n').map(s => s.trim()).filter(Boolean) : [];
                    const endDate = (f.endDate && f.endDate >= f.date) ? f.endDate : '';
                    const dateDisplay = this.formatEventDateRange(f.date, endDate);

                    const eventData = {
                        id: f.id || 'evt-' + Date.now(),
                        title: f.title,
                        category: f.category,
                        jenjang: f.jenjang,
                        jenjangLabel: 'Jenjang ' + f.jenjang,
                        date: f.date,
                        endDate: endDate,
                        time: f.time,
                        mode: f.mode,
                        location: f.location,
                        description: f.description,
                        badgeText: 'Pendaftaran Dibuka',
                        whatsappMessage: `Halo Next Level Study, saya ingin mendaftar kegiatan: ${f.title} (${dateDisplay})`,
                        highlights: highlights
                    };

                    if (f.isEdit) {
                        const idx = this.events.findIndex(e => e.id === eventData.id);
                        if (idx !== -1) this.events[idx] = eventData;
                    } else {
                        this.events.unshift(eventData);
                    }

                    this.saveEventsToStorage();
                    this.showToast('Agenda berhasil disimpan dan langsung live di /kalender!');
                    this.kalenderView = 'present';
                },
"@

$oldSaveBuilderRegex = '(?s)saveEventFromBuilder\s*\(\s*\)\s*\{.*?this\.kalenderView = ''present'';\s*\},'
if ($adminContent -match $oldSaveBuilderRegex) {
    $adminContent = [regex]::Replace($adminContent, $oldSaveBuilderRegex, $newSaveBuilder)
    Write-Host "Updated saveEventFromBuilder in nlsadmin."
}

# Update openCreateEventView in nlsadmin
$adminContent = $adminContent.Replace("date: new Date().toISOString().split('T')[0],", "date: new Date().toISOString().split('T')[0],`n                        endDate: '',")
$adminContent = $adminContent.Replace("date: '2026-08-15',`n                    time:", "date: '2026-08-15',`n                    endDate: '',`n                    time:")
$adminContent = $adminContent.Replace("endDate: '',`n                        endDate: '',", "endDate: '',")

# Update editEvent in nlsadmin
$newEditEvent = @"
                editEvent(event) {
                    this.activeTab = 'kalender';
                    this.kalenderView = 'create';
                    this.isKalenderDropdownOpen = true;
                    this.eventForm = {
                        ...event,
                        endDate: event.endDate || '',
                        isEdit: true,
                        highlightsRaw: event.highlights ? event.highlights.join('\n') : ''
                    };
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                },
"@
$oldEditEventRegex = '(?s)editEvent\s*\(\s*event\s*\)\s*\{.*?window\.scrollTo\(\{\s*top:\s*0,\s*behavior:\s*''smooth''\s*\}\);\s*\},'
if ($adminContent -match $oldEditEventRegex) {
    $adminContent = [regex]::Replace($adminContent, $oldEditEventRegex, $newEditEvent)
    Write-Host "Updated editEvent in nlsadmin."
}

# Update present event card date display in nlsadmin
$adminContent = $adminContent.Replace('x-text="formatDateFull ? formatDateFull(event.date) : event.date"', 'x-text="formatEventDateRange ? formatEventDateRange(event.date, event.endDate) : (formatDateFull ? formatDateFull(event.date) : event.date)"')

[System.IO.File]::WriteAllText($adminPath, $adminContent, [System.Text.Encoding]::UTF8)
Write-Host "Updated nlsadmin/index.html JavaScript methods."


# 2. Update Public Calendar Pages: kalender/index.html, index.html, osn/index.html
$publicFiles = @(
    "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\kalender\index.html",
    "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\index.html",
    "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\osn\index.html"
)

foreach ($fPath in $publicFiles) {
    $content = [System.IO.File]::ReadAllText($fPath, [System.Text.Encoding]::UTF8)
    
    # Inject formatEventDateRange if missing
    if (-not $content.Contains('formatEventDateRange(startDate, endDate)')) {
        $content = $content.Replace('getEventCategoryBadge(cat) {', $dateRangeHelper + "`n                getEventCategoryBadge(cat) {")
        Write-Host "Injected formatEventDateRange to $fPath"
    }

    # Update eventsInCurrentMonth for interval overlap
    $oldMonthFilter = 'const ymPrefix = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, ''0'')}`;`n                    return this.filteredEvents().filter(evt => evt.date.startsWith(ymPrefix));'
    $newMonthFilter = @"
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
"@
    if ($content.Contains($oldMonthFilter)) {
        $content = $content.Replace($oldMonthFilter, $newMonthFilter)
        Write-Host "Updated eventsInCurrentMonth in $fPath"
    }

    # Update displayedEvents for interval match
    $oldDisplayed = 'if (this.selectedDate) {`n                        return this.filteredEvents().filter(evt => evt.date === this.selectedDate);`n                    }'
    $newDisplayed = @"
if (this.selectedDate) {
                        return this.filteredEvents().filter(e => {
                            const eStart = e.date || '';
                            const eEnd = (e.endDate && e.endDate >= e.date) ? e.endDate : e.date;
                            return eStart <= this.selectedDate && eEnd >= this.selectedDate;
                        });
                    }
"@
    if ($content.Contains($oldDisplayed)) {
        $content = $content.Replace($oldDisplayed, $newDisplayed)
        Write-Host "Updated displayedEvents in $fPath"
    }

    # Update calendarCells dayEvents filter
    $oldDayEvents = 'const dayEvents = this.filteredEvents().filter(e => e.date === dateStr);'
    $newDayEvents = @"
const dayEvents = this.filteredEvents().filter(e => {
                            const eStart = e.date || '';
                            const eEnd = (e.endDate && e.endDate >= e.date) ? e.endDate : e.date;
                            return eStart <= dateStr && eEnd >= dateStr;
                        });
"@
    if ($content.Contains($oldDayEvents)) {
        $content = $content.Replace($oldDayEvents, $newDayEvents)
        Write-Host "Updated calendarCells dayEvents in $fPath"
    }

    # Update card date display
    $content = $content.Replace('x-text="formatDateFull ? formatDateFull(event.date) : event.date"', 'x-text="formatEventDateRange ? formatEventDateRange(event.date, event.endDate) : (formatDateFull ? formatDateFull(event.date) : event.date)"')

    [System.IO.File]::WriteAllText($fPath, $content, [System.Text.Encoding]::UTF8)
}

Write-Host "=== ALL FILES UPDATED FOR DATE INTERVALS ==="
