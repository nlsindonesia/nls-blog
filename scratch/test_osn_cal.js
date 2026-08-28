const fs = require('fs');
global.window = { innerWidth: 1200, addEventListener: () => {} };
global.document = { getElementById: () => null };
global.localStorage = { getItem: () => null, setItem: () => {} };

const osnHtml = fs.readFileSync('osn/index.html', 'utf8');
const eventsJs = fs.readFileSync('kalender/default-events.js', 'utf8');

eval(eventsJs);

const match = osnHtml.match(/function osnCalendarApp\(\)\s*\{([\s\S]*?)\n\s*\}\s*<\/script>/);
const funcBody = 'return {' + match[1].substring(match[1].indexOf('return {') + 8);
const app = new Function(funcBody)();
app.$nextTick = (fn) => fn && fn();
app.loadEvents();

console.log('--- STRICT OSN ONLY CALENDAR REPORT ---');
console.log('OSN Total Events Count:', app.filteredEvents().length);
for (let m = 0; m < 12; m++) {
    app.currentMonth = m;
    const evts = app.eventsInCurrentMonth();
    if (evts.length > 0) {
        console.log(`[${app.monthNames[m]} 2026]: ${evts.length} event(s)`);
        evts.forEach(e => console.log(`   - (${e.date}) [${e.jenjang || 'Semua'}] ${e.title}`));
    }
}
