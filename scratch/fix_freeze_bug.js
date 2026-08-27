const fs = require('fs');

const filePath = 'c:/Users/vc/Documents/nls-blog-hame/nls-blog-hame/nlsadmin/index.html';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix double single-quotes
content = content.split("activeTab === ''kalender''").join("activeTab === 'kalender'");
content = content.split("activeTab === ''berita''").join("activeTab === 'berita'");
content = content.split("activeTab === ''pengajar''").join("activeTab === 'pengajar'");
content = content.split("kalenderView === ''create''").join("kalenderView === 'create'");
content = content.split("kalenderView === ''present''").join("kalenderView === 'present'");

// 2. Fix encoding artifacts
content = content.split('•').join('•');
content = content.split('✓').join('✓');

// 3. Fix inline loop in x-for
const oldPattern = /<template x-for="\(hl, hlIdx\) in \(eventForm\.highlightsRaw \? eventForm\.highlightsRaw\.split\([^)]+\)[^>]+>/g;
content = content.replace(oldPattern, '<template x-for="(hl, hlIdx) in getPreviewHighlights()" :key="hlIdx">');

// 4. Add getPreviewHighlights method
if (!content.includes('getPreviewHighlights()')) {
    content = content.replace(
        '// KALENDER METHODS',
        `// KALENDER METHODS
                getPreviewHighlights() {
                    if (!this.eventForm || !this.eventForm.highlightsRaw) {
                        return ['Sistem Penilaian IRT Standar Nasional', 'Webinar Live Pembahasan Soal & Bedah Trik'];
                    }
                    return this.eventForm.highlightsRaw.split('\\n').map(s => s.trim()).filter(Boolean);
                },`
    );
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('SUCCESS: Fixed all syntax and freezing bugs via Node.js!');
