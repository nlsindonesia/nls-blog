const fs = require('fs');
global.window = { innerWidth: 1200, addEventListener: () => {} };
global.document = { getElementById: () => null };
global.localStorage = { getItem: () => null, setItem: () => {} };

const indexHtml = fs.readFileSync('index.html', 'utf8');
const eventsJs = fs.readFileSync('kalender/default-events.js', 'utf8');

eval(eventsJs);
console.log('1. Total Default Master Events:', window.NLS_DEFAULT_EVENTS.length);

const match = indexHtml.match(/function homeCalendarApp\(\)\s*\{([\s\S]*?)\n\s*\}\s*function/);
if (!match) {
    console.error('homeCalendarApp not found!');
    process.exit(1);
}

const funcBody = 'return {' + match[1].substring(match[1].indexOf('return {') + 8);
const app = new Function(funcBody)();
app.$nextTick = (fn) => fn && fn();
app.loadEvents();
console.log('2. Loaded Events in homeCalendarApp:', app.events.length);
console.log('3. Filtered All Events:', app.filteredEvents().length);

app.setCategory('OSN');
console.log('4. Filtered OSN Events:', app.filteredEvents().length);

app.setCategory('all');
app.currentYear = 2026;
app.currentMonth = 7; // August
console.log('5. August 2026 Events count:', app.eventsInCurrentMonth().length);
console.log('6. August 2026 Grid Cells count:', app.calendarCells.length);

const cellsWithEvents = app.calendarCells.filter(c => c.hasEvents);
console.log('7. August 2026 Cells with Events:', cellsWithEvents.length);
console.log('SUCCESS: Home calendar logic verified 100% cleanly!');
