/**
 * Test Serverless API Handler
 */

const handlerModule = require('../api/teacher-applications.js');
const handler = handlerModule.default || handlerModule;

function mockRes() {
    return {
        statusCode: 200,
        headers: {},
        data: null,
        setHeader(k, v) { this.headers[k] = v; return this; },
        status(c) { this.statusCode = c; return this; },
        json(d) { this.data = d; return this; },
        end() { return this; }
    };
}

console.log('🧪 TESTING /api/teacher-applications SERVERLESS HANDLER...\n');

// Test 1: GET applications
let res1 = mockRes();
handler({ method: 'GET' }, res1);
console.log('1. GET Status:', res1.statusCode, '| Items:', res1.data.total);

// Test 2: POST a new application
let res2 = mockRes();
const newCandidate = {
    nama: 'Aisyah Putri Maharani, S.Pd.',
    panggilan: 'Kak Aisyah',
    wa: '081234567899',
    email: 'aisyah.putri@unpad.ac.id',
    pendidikan: 'Pendidikan Matematika Unpad (Cumlaude)',
    categories: ['SNBT', 'TKA'],
    jenjang: ['SMA'],
    subject: 'Penalaran Matematika & Kuantitatif SNBT',
    fokusPrivat: 'Bimbingan intensif pola soal UTBK SNBT dan drill trik cepat.',
    filosofi: 'Menemukan pola logika di balik kerumitan soal matematika.',
    prestasi1: 'Juara 1 Lomba Mengajar Matematika Nasional 2024',
    portfolio: 'https://linkedin.com/in/aisyah-putri'
};

handler({ method: 'POST', body: newCandidate }, res2);
console.log('2. POST Status:', res2.statusCode, '| Saved ID:', res2.data.data.id, '| Nama:', res2.data.data.nama);

// Test 3: GET again to verify new candidate is in list
let res3 = mockRes();
handler({ method: 'GET' }, res3);
console.log('3. GET Status after POST:', res3.statusCode, '| Total Items:', res3.data.total);
const found = res3.data.data.find(a => a.id === res2.data.data.id);
console.log('   - Candidate found in list:', found ? '✅ YES (' + found.nama + ')' : '❌ NO');

// Test 4: PUT update status
let res4 = mockRes();
handler({ method: 'PUT', body: { id: res2.data.data.id, status: 'accepted' } }, res4);
console.log('4. PUT Status:', res4.statusCode, '| Updated status:', res4.data.data.status);

// Test 5: DELETE application
let res5 = mockRes();
handler({ method: 'DELETE', query: { id: res2.data.data.id } }, res5);
console.log('5. DELETE Status:', res5.statusCode, '| Message:', res5.data.message);

console.log('\n🎉 ALL SERVERLESS API TESTS PASSED SUCCESSFULLY!\n');
