$kalenderPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\kalender\index.html"
$content = [System.IO.File]::ReadAllText($kalenderPath, [System.Text.Encoding]::UTF8)

$oldPattern = '(?s)jenjangLabel\(\) \{.*?eventsInCurrentMonth\(\) \{'

$newMethods = @'
jenjangLabel() {
                    if (this.selectedJenjang === 'all') return 'Semua Jenjang';
                    if (this.selectedJenjang === 'SD') return 'Jenjang SD/MI';
                    if (this.selectedJenjang === 'SMP') return 'Jenjang SMP/MTs';
                    if (this.selectedJenjang === 'SMA') return 'Jenjang SMA/SMK';
                    if (this.selectedJenjang === 'Guru / Instansi') return 'Guru & Instansi';
                    return this.selectedJenjang;
                },

                countByCategory(cat) {
                    return this.events.filter(e => e.category === cat).length;
                },

                setCategory(cat) {
                    this.selectedCategory = cat;
                    this.selectedDate = null;
                    this.$nextTick(() => this.updateCardHeight());
                },

                setJenjang(jenjang) {
                    this.selectedJenjang = jenjang;
                    this.selectedDate = null;
                    this.$nextTick(() => this.updateCardHeight());
                },

                setMonth(mIdx) {
                    this.currentMonth = mIdx;
                    this.selectedDate = null;
                    this.$nextTick(() => this.updateCardHeight());
                },

                resetFilters() {
                    this.selectedCategory = 'all';
                    this.selectedJenjang = 'all';
                    this.selectedDate = null;
                    this.$nextTick(() => this.updateCardHeight());
                },

                prevMonth() {
                    if (this.currentMonth === 0) {
                        this.currentMonth = 11;
                        this.currentYear--;
                    } else {
                        this.currentMonth--;
                    }
                    this.selectedDate = null;
                    this.$nextTick(() => this.updateCardHeight());
                },

                nextMonth() {
                    if (this.currentMonth === 11) {
                        this.currentMonth = 0;
                        this.currentYear++;
                    } else {
                        this.currentMonth++;
                    }
                    this.selectedDate = null;
                    this.$nextTick(() => this.updateCardHeight());
                },

                goToToday() {
                    const now = new Date();
                    this.currentYear = 2026;
                    this.currentMonth = now.getFullYear() === 2026 ? now.getMonth() : 7;
                    this.selectedDate = null;
                    this.$nextTick(() => this.updateCardHeight());
                },

                // Filtered Events
                filteredEvents() {
                    return this.events.filter(evt => {
                        const matchCat = this.selectedCategory === 'all' || evt.category === this.selectedCategory;
                        const matchJenjang = this.selectedJenjang === 'all' || evt.jenjang === this.selectedJenjang;
                        return matchCat && matchJenjang;
                    });
                },

                eventsInCurrentMonth() {
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldPattern, $newMethods)

[System.IO.File]::WriteAllText($kalenderPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Cleaned up Alpine methods in kalender/index.html!"
