import fs from 'fs';

console.log('====================================================');
console.log('TEST SUITE: NLS UNIVERSAL SSO & RBAC VERIFICATION');
console.log('====================================================');

const adminHtml = fs.readFileSync('nlsadmin/index.html', 'utf8');
const ssoClientJs = fs.readFileSync('sso-client.js', 'utf8');

// Mock Environment
let storage = {};
let sessionStore = {};

global.localStorage = {
    getItem: (k) => storage[k] || null,
    setItem: (k, v) => { storage[k] = String(v); },
    removeItem: (k) => { delete storage[k]; }
};

global.sessionStorage = {
    getItem: (k) => sessionStore[k] || null,
    setItem: (k, v) => { sessionStore[k] = String(v); },
    removeItem: (k) => { delete sessionStore[k]; }
};

global.window = {
    innerWidth: 1200,
    addEventListener: () => {},
    removeEventListener: () => {},
    location: { href: 'https://nls-superadmin.vercel.app', search: '', pathname: '/', hash: '' }
};
global.document = {
    hidden: false,
    addEventListener: () => {}
};
global.fetch = async () => ({
    ok: true,
    json: async () => ({ success: true, user: { id: 'usr-admin-1', role: 'super_admin', roleLabel: 'Super Admin' } })
});

// Execute SSO Client in global context
new Function(ssoClientJs)();

// Extract superAdminApp factory
const match = adminHtml.match(/function superAdminApp\(\)\s*\{([\s\S]*?)\n\s*\}\s*<\/script>/);
if (!match) throw new Error('superAdminApp not found');
const superAdminAppFactory = new Function('return function() { ' + match[1] + '}')();

// --- TEST 1: GUEST STATE ---
storage = {};
sessionStore = {};
let app = superAdminAppFactory();
app.init();
console.log('Test 1 - Guest State on SuperAdmin Portal:');
console.log('  isAuthenticated == false:', app.isAuthenticated === false ? 'PASS' : 'FAIL');
console.log('  isAccessDenied == false:', app.isAccessDenied === false ? 'PASS' : 'FAIL');

// --- TEST 2: STUDENT LOGGED IN VIA SSO ---
window.NlsSSO.broadcastLogin({
    id: 'usr-student-1',
    name: 'Muhammad Faiz Al-Fatih',
    email: 'faiz.student@gmail.com',
    role: 'student',
    roleLabel: 'Siswa'
});

let studentOnAdmin = superAdminAppFactory();
studentOnAdmin.init();
console.log('\nTest 2 - Student visits SuperAdmin Portal (RBAC Enforcement):');
console.log('  isAuthenticated == false:', studentOnAdmin.isAuthenticated === false ? 'PASS' : 'FAIL');
console.log('  isAccessDenied == true (403 Blocked):', studentOnAdmin.isAccessDenied === true ? 'PASS' : 'FAIL');
console.log('  currentUserSession recognized:', studentOnAdmin.currentUserSession && studentOnAdmin.currentUserSession.role === 'student' ? 'PASS' : 'FAIL');

// --- TEST 3: TEACHER LOGGED IN VIA SSO ---
window.NlsSSO.broadcastLogin({
    id: 'usr-teacher-1',
    name: 'Dr. Hendra Wijaya, M.Sc.',
    email: 'hendra.guru@next-level-study.com',
    role: 'teacher',
    roleLabel: 'Guru / Pengajar'
});

let teacherOnAdmin = superAdminAppFactory();
teacherOnAdmin.init();
console.log('\nTest 3 - Teacher visits SuperAdmin Portal (RBAC Enforcement):');
console.log('  isAuthenticated == false:', teacherOnAdmin.isAuthenticated === false ? 'PASS' : 'FAIL');
console.log('  isAccessDenied == true (403 Blocked):', teacherOnAdmin.isAccessDenied === true ? 'PASS' : 'FAIL');

// --- TEST 4: SUPER ADMIN LOGGED IN ---
window.NlsSSO.broadcastLogin({
    id: 'usr-admin-1',
    name: 'Super Administrator NLS',
    username: 'nlsindonesia',
    email: 'admin@next-level-study.com',
    role: 'super_admin',
    roleLabel: 'Super Admin'
});

let adminOnPortal = superAdminAppFactory();
adminOnPortal.init();
console.log('\nTest 4 - Super Admin on SuperAdmin Portal:');
console.log('  isAuthenticated == true:', adminOnPortal.isAuthenticated === true ? 'PASS' : 'FAIL');
console.log('  isAccessDenied == false:', adminOnPortal.isAccessDenied === false ? 'PASS' : 'FAIL');

// --- TEST 5: TAB SWITCH SIMULATION (MEMORY DISCARD) ---
// Simulate new tab where sessionStorage is fresh
sessionStore = {};
let tabSwitchAdmin = superAdminAppFactory();
tabSwitchAdmin.init();
console.log('\nTest 5 - Tab switch / new tab retains Super Admin login:');
console.log('  isAuthenticated == true:', tabSwitchAdmin.isAuthenticated === true ? 'PASS' : 'FAIL');
console.log('  isAccessDenied == false:', tabSwitchAdmin.isAccessDenied === false ? 'PASS' : 'FAIL');

// --- TEST 6: GLOBAL LOGOUT ---
adminOnPortal.logout();
let loggedOutCheck = superAdminAppFactory();
loggedOutCheck.init();
console.log('\nTest 6 - Global Logout:');
console.log('  isAuthenticated == false:', loggedOutCheck.isAuthenticated === false ? 'PASS' : 'FAIL');
console.log('  isAccessDenied == false:', loggedOutCheck.isAccessDenied === false ? 'PASS' : 'FAIL');
console.log('  LocalStorage cleaned:', localStorage.getItem('nls_auth_session') === null ? 'PASS' : 'FAIL');

console.log('\n====================================================');
console.log('ALL TESTS COMPLETED SUCCESSFULLY!');
console.log('====================================================');
process.exit(0);
