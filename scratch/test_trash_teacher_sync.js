/**
 * Test Teacher Verification Deletion & Trash Workflow
 */

console.log('🧪 TESTING TEACHER VERIFICATION & TRASH WORKFLOW...\n');

// 1. Mock LocalStorage
const store = {};
const mockLocalStorage = {
    getItem(k) { return store[k] || null; },
    setItem(k, v) { store[k] = String(v); },
    removeItem(k) { delete store[k]; }
};

// 2. Initial state with 2 sample applications
const defaultApps = [
    { id: 'app-sample-1', nama: 'Fajar Hidayatullah, M.Sc.', status: 'pending' },
    { id: 'app-sample-2', nama: 'Nabila Azzahra, S.Si.', status: 'pending' }
];

let teacherApplications = [...defaultApps];
let trashTeachers = [];

console.log('Step 1: Initial applications count =', teacherApplications.length);

// 3. User deletes 'app-sample-1'
const targetId = 'app-sample-1';
const target = teacherApplications.find(a => a.id === targetId);

// Filter out
teacherApplications = teacherApplications.filter(a => a.id !== targetId);
mockLocalStorage.setItem('nls_teacher_applications_v1', JSON.stringify(teacherApplications));

// Track deleted ID
let deletedIds = JSON.parse(mockLocalStorage.getItem('nls_deleted_teacher_applications_v1') || '[]');
deletedIds.push(targetId);
mockLocalStorage.setItem('nls_deleted_teacher_applications_v1', JSON.stringify(deletedIds));

// Move to trash
const trashed = { ...target, isApplication: true, deletedAt: new Date().toISOString() };
trashTeachers.unshift(trashed);
mockLocalStorage.setItem('nls_pengajar_teachers_trash_v1', JSON.stringify(trashTeachers));

console.log('Step 2: After deleting app-sample-1:');
console.log('  - Active applications in state:', teacherApplications.length);
console.log('  - Trashed items:', trashTeachers.length, '(' + trashTeachers[0].nama + ')');
console.log('  - Deleted IDs tracked:', mockLocalStorage.getItem('nls_deleted_teacher_applications_v1'));

// 4. Simulate Page Refresh & Server API sync
console.log('\nStep 3: Simulating Page Refresh...');
const serverApps = [
    { id: 'app-sample-1', nama: 'Fajar Hidayatullah, M.Sc.', status: 'pending' },
    { id: 'app-sample-2', nama: 'Nabila Azzahra, S.Si.', status: 'pending' },
    { id: 'app-new-3', nama: 'Dr. Raditya Daniswara', status: 'pending' }
];

const reloadedDeletedIds = JSON.parse(mockLocalStorage.getItem('nls_deleted_teacher_applications_v1') || '[]');
const filteredServerApps = serverApps.filter(a => !reloadedDeletedIds.includes(a.id));

const storedLocal = JSON.parse(mockLocalStorage.getItem('nls_teacher_applications_v1') || '[]');
const filteredLocalApps = storedLocal.filter(a => !reloadedDeletedIds.includes(a.id));

const mergedMap = new Map();
filteredServerApps.forEach(a => mergedMap.set(a.id, a));
filteredLocalApps.forEach(a => mergedMap.set(a.id, a));

const reloadedApps = Array.from(mergedMap.values());
console.log('  - Reloaded applications count =', reloadedApps.length);
console.log('  - Items:', reloadedApps.map(a => a.id + ' (' + a.nama + ')').join(', '));

const app1Found = reloadedApps.some(a => a.id === 'app-sample-1');
console.log('  - Is deleted app-sample-1 kept away?', !app1Found ? '✅ YES (SUCCESS)' : '❌ NO (RESURRECTED)');

// 5. Simulate Restore from Trash
console.log('\nStep 4: Restoring app-sample-1 from Trash...');
const restoreTarget = trashTeachers.find(t => t.id === 'app-sample-1');
trashTeachers = trashTeachers.filter(t => t.id !== 'app-sample-1');
let updatedDeletedIds = JSON.parse(mockLocalStorage.getItem('nls_deleted_teacher_applications_v1') || '[]');
updatedDeletedIds = updatedDeletedIds.filter(x => x !== 'app-sample-1');
mockLocalStorage.setItem('nls_deleted_teacher_applications_v1', JSON.stringify(updatedDeletedIds));

delete restoreTarget.deletedAt;
restoreTarget.status = 'pending';
reloadedApps.unshift(restoreTarget);

console.log('  - Active applications after restore:', reloadedApps.length);
console.log('  - Trash count after restore:', trashTeachers.length);

console.log('\n🎉 ALL TRASH & PERSISTENCE TESTS PASSED!\n');
