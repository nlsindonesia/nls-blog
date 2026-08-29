const fs = require('fs');
const content = fs.readFileSync('nlsadmin/index.html', 'utf8');

// Find the main content wrapper
const mainContentIdx = content.indexOf('<main');
console.log('main tag index:', mainContentIdx);

// Find all tab positions
const tabs = ['kalender', 'berita', 'pengajar', 'users'];
tabs.forEach(t => {
    const idx = content.indexOf(`x-show="activeTab === '${t}'"`);
    console.log(`Tab ${t} x-show index:`, idx);
});

// Check where </main> is
const mainCloseIdx = content.indexOf('</main>');
console.log('</main> index:', mainCloseIdx);
