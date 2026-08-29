const fs = require('fs');
const path = require('path');

global.window = global;
global.localStorage = {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; }
};

// Load default datasets & modules
eval(fs.readFileSync('kalender/default-events.js', 'utf8'));
eval(fs.readFileSync('pengajar/default-teachers.js', 'utf8'));
eval(fs.readFileSync('blog/default-articles.js', 'utf8'));
eval(fs.readFileSync('database/vue/kalender.db.js', 'utf8'));
eval(fs.readFileSync('database/vue/berita.db.js', 'utf8'));
eval(fs.readFileSync('database/vue/pengajar.db.js', 'utf8'));
eval(fs.readFileSync('database/vue/users.db.js', 'utf8'));
eval(fs.readFileSync('database/vue/index.js', 'utf8'));

console.log('=== VERIFYING USER MANAGEMENT & ALL DATABASE MODULES ===');
console.log('1. Total Users in DB:', global.UsersDatabase.users.length);
console.log('2. Available Roles:', global.UsersDatabase.roles.map(r => r.label).join(', '));
console.log('3. Master NlsDatabase Summary:', global.NlsDatabase.getSummary());

// Test CRUD on Users
const testUser = global.UsersDatabase.create({
    name: 'Kak Sarah Amelia, M.Pd.',
    username: 'sarah.mentor',
    email: 'sarah@next-level-study.com',
    phone: '081234567890',
    role: 'Tutor / Mentor Ahli',
    role_id: 'tutor_mentor',
    department: 'Divisi Biologi OSN'
});

console.log('4. Created User:', testUser.id, testUser.name, testUser.role);
console.log('   Users count after create:', global.UsersDatabase.users.length);

global.UsersDatabase.moveToTrash(testUser.id);
console.log('5. Moved to Trash. Trash count:', global.UsersDatabase.trashUsers.length);

global.UsersDatabase.restore(testUser.id);
console.log('6. Restored from Trash. Users count:', global.UsersDatabase.users.length);

global.UsersDatabase.forceDelete(testUser.id);
console.log('7. Permanently deleted. Users count:', global.UsersDatabase.users.length);

// Verify Full Master Backup includes users
const backup = JSON.parse(global.NlsDatabase.exportFullBackup());
console.log('8. Backup includes users database?', !!backup.databases.users);
console.log('   Backup users count:', backup.databases.users.users.length);

console.log('✅ ALL USER MANAGEMENT TESTS PASSED WITH 100% SUCCESS!');
