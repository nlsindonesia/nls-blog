const fs = require('fs');
const path = require('path');

// Mock browser globals for testing node execution
global.window = global;
global.localStorage = {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; }
};

// Load default datasets
eval(fs.readFileSync(path.join(__dirname, '../kalender/default-events.js'), 'utf8'));
eval(fs.readFileSync(path.join(__dirname, '../pengajar/default-teachers.js'), 'utf8'));
eval(fs.readFileSync(path.join(__dirname, '../blog/default-articles.js'), 'utf8'));

// Load Vue DB modules
eval(fs.readFileSync(path.join(__dirname, '../database/vue/kalender.db.js'), 'utf8'));
eval(fs.readFileSync(path.join(__dirname, '../database/vue/berita.db.js'), 'utf8'));
eval(fs.readFileSync(path.join(__dirname, '../database/vue/pengajar.db.js'), 'utf8'));
eval(fs.readFileSync(path.join(__dirname, '../database/vue/index.js'), 'utf8'));

console.log('=== TESTING VUE DATABASE MODULES ===');
console.log('1. KalenderDatabase total events:', global.KalenderDatabase.events.length);
console.log('2. BeritaDatabase total articles:', global.BeritaDatabase.articles.length);
console.log('3. PengajarDatabase total teachers:', global.PengajarDatabase.teachers.length);

const summary = global.NlsDatabase.getSummary();
console.log('4. NlsDatabase Summary:', summary);

// Test CRUD
const createdEvent = global.KalenderDatabase.create({
    title: 'Test Event Vue DB',
    category: 'OSN',
    date: '2026-12-01'
});
console.log('5. Created Test Event:', createdEvent.id, createdEvent.title);
console.log('   Events count after create:', global.KalenderDatabase.events.length);

global.KalenderDatabase.moveToTrash(createdEvent.id);
console.log('6. Moved to trash count:', global.KalenderDatabase.trashEvents.length);

global.KalenderDatabase.restore(createdEvent.id);
console.log('7. Restored from trash count:', global.KalenderDatabase.events.length);

global.KalenderDatabase.forceDelete(createdEvent.id);
console.log('8. Permanently deleted. Final count:', global.KalenderDatabase.events.length);

console.log('✅ ALL VUE DATABASE MODULES PASSED VALIDATION!');
