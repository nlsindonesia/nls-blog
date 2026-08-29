/**
 * Verification Script: Teacher Application Persistence & Admin Verification Pipeline
 */

const fs = require('fs');
const path = require('path');

console.log('========================================================');
console.log('🧪 TESTING TEACHER APPLICATION DATA PIPELINE');
console.log('========================================================\n');

// 1. Check file inclusions
const pengajarHtml = fs.readFileSync(path.join(__dirname, '../pengajar/index.html'), 'utf8');
const adminHtml = fs.readFileSync(path.join(__dirname, '../nlsadmin/index.html'), 'utf8');
const themeJs = fs.readFileSync(path.join(__dirname, '../theme.js'), 'utf8');
const pengajarDbJs = fs.readFileSync(path.join(__dirname, '../database/vue/pengajar.db.js'), 'utf8');

console.log('1. Checking Script Inclusions:');
const pengajarHasThemeJs = pengajarHtml.includes('src="/theme.js"');
const pengajarHasDbJs = pengajarHtml.includes('src="/database/vue/pengajar.db.js"');
const adminHasDbJs = adminHtml.includes('src="/database/vue/pengajar.db.js"');
const adminHasIndexDbJs = adminHtml.includes('src="/database/vue/index.js"');

console.log('   - /pengajar includes /theme.js:', pengajarHasThemeJs ? '✅ PASSED' : '❌ FAILED');
console.log('   - /pengajar includes /database/vue/pengajar.db.js:', pengajarHasDbJs ? '✅ PASSED' : '❌ FAILED');
console.log('   - /nlsadmin includes /database/vue/pengajar.db.js:', adminHasDbJs ? '✅ PASSED' : '❌ FAILED');
console.log('   - /nlsadmin includes /database/vue/index.js:', adminHasIndexDbJs ? '✅ PASSED' : '❌ FAILED');

if (!pengajarHasThemeJs || !pengajarHasDbJs || !adminHasDbJs || !adminHasIndexDbJs) {
    console.error('❌ Script inclusion test failed!');
    process.exit(1);
}

// 2. Simulate LocalStorage and Browser Environment
const localStorageMock = {};
global.localStorage = {
    getItem: (key) => localStorageMock[key] || null,
    setItem: (key, val) => { localStorageMock[key] = String(val); },
    removeItem: (key) => { delete localStorageMock[key]; },
    clear: () => { for (let k in localStorageMock) delete localStorageMock[k]; }
};

global.window = {
    localStorage: global.localStorage,
    dispatchEvent: () => {},
    matchMedia: () => ({ matches: false }),
    open: () => {}
};
global.CustomEvent = function(name, opt) { this.name = name; this.detail = opt ? opt.detail : null; };
global.BroadcastChannel = function(name) { this.name = name; this.postMessage = () => {}; };
global.document = {
    documentElement: { classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false }, style: {} },
    querySelectorAll: () => [],
    addEventListener: () => {},
    body: { style: {} }
};

// 3. Load default teachers and database module
const defaultTeachersJs = fs.readFileSync(path.join(__dirname, '../pengajar/default-teachers.js'), 'utf8');
eval(defaultTeachersJs);
eval(pengajarDbJs);
const db = global.PengajarDatabase || global.window.PengajarDatabase;
console.log('\n2. Testing PengajarDatabase Initial State:');
console.log('   - Total Active Teachers:', db.teachers.length);
console.log('   - Total Pending Applications:', db.getPendingApplications().length);

// 4. Simulate submitting a new teacher application
console.log('\n3. Simulating Form Submission from /pengajar:');
const testApp = {
    id: 'app-test-' + Date.now(),
    nama: 'Dr. Raditya Daniswara, M.Sc.',
    panggilan: 'Kak Radit',
    wa: '081234567890',
    email: 'raditya.daniswara@ugm.ac.id',
    pendidikan: 'S3 Fisika Nuklir & Terapan Universitas Gadjah Mada',
    categories: ['OSN', 'Kurikulum Internasional'],
    jenjang: ['SMP', 'SMA'],
    jenjangLabel: 'SMP & SMA',
    subject: 'Fisika Teori & Relativitas Khusus',
    fokusPrivat: 'Bimbingan seleksi OSN Fisika Nasional & IPhO.',
    filosofi: 'Fisika adalah keindahan logika semesta raya.',
    prestasi1: 'Peraih Medali Emas OSN Fisika Nasional',
    prestasi2: 'Instruktur Utama Pelatnas IPhO 2024',
    prestasi3: 'Alumni S3 Cumlaude UGM',
    portfolio: 'https://drive.google.com/file/d/cv-radit-sample/view'
};

const savedApp = db.submitApplication(testApp);
console.log('   - Submission Created ID:', savedApp.id);
console.log('   - Stored in Database Key "nls_teacher_applications_v1":', !!localStorage.getItem('nls_teacher_applications_v1'));

const storedApps = JSON.parse(localStorage.getItem('nls_teacher_applications_v1') || '[]');
const found = storedApps.find(a => a.id === savedApp.id);
console.log('   - Found in localStorage:', found ? '✅ YES (' + found.nama + ')' : '❌ NO');

// 5. Test Approval Workflow (Admin accepting applicant)
console.log('\n4. Testing Teacher Approval in Admin:');
const prevTeachersCount = db.teachers.length;
const approvedResult = db.approveApplication(savedApp.id);

console.log('   - Application Status after approval:', approvedResult.application.status);
console.log('   - Teachers count before:', prevTeachersCount, '-> after:', db.teachers.length);
console.log('   - Newly published teacher:', approvedResult.teacher.name, `(${approvedResult.teacher.subject})`);

if (approvedResult.application.status === 'accepted' && db.teachers.length === prevTeachersCount + 1) {
    console.log('\n========================================================');
    console.log('🎉 ALL TESTS PASSED! DATA PERSISTENCE PIPELINE IS WORKING');
    console.log('========================================================\n');
} else {
    console.error('❌ Approval workflow test failed!');
    process.exit(1);
}
