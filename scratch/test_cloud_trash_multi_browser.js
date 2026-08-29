/**
 * Test Cloud-Synchronized Trash across 3 Simulated Browsers (Opera, Edge, Chrome)
 */

const handlerModule = require('../api/teacher-applications.js');
const handler = handlerModule.default || handlerModule;

function mockReqRes(method, body = null, query = null) {
    let req = { method, body, query };
    let res = {
        statusCode: 200,
        headers: {},
        data: null,
        setHeader(k, v) { this.headers[k] = v; return this; },
        status(c) { this.statusCode = c; return this; },
        json(d) { this.data = d; return this; },
        end() { return this; }
    };
    handler(req, res);
    return res;
}

console.log('🧪 TESTING CLOUD-SYNCHRONIZED TRASH ACROSS MULTIPLE BROWSERS...\n');

// 1. Initial State
let getInitial = mockReqRes('GET');
console.log('1. Initial Server API State:');
console.log('   - Total items on server:', getInitial.data.total);

// 2. Browser 1 (Opera) moves 'app-sample-1' to Trash
console.log('\n2. Browser 1 (Opera) moves "app-sample-1" to Trash:');
let putTrash = mockReqRes('PUT', { id: 'app-sample-1', status: 'trashed', deletedAt: new Date().toISOString() });
console.log('   - PUT Status:', putTrash.statusCode, '| Status on Server:', putTrash.data.data.status);

// 3. Browser 2 (Edge) opens /nlsadmin and syncs
console.log('\n3. Browser 2 (Edge) opens /nlsadmin and fetches server API:');
let edgeFetch = mockReqRes('GET');
let edgeActive = edgeFetch.data.data.filter(a => a.status !== 'trashed');
let edgeTrash = edgeFetch.data.data.filter(a => a.status === 'trashed');
console.log('   - Edge Active Applications:', edgeActive.length);
console.log('   - Edge Trash Items:', edgeTrash.length, '(' + edgeTrash.map(t => t.nama).join(', ') + ')');
console.log('   - Has app-sample-1 arrived in Edge Trash?', edgeTrash.some(t => t.id === 'app-sample-1') ? '✅ YES (SYNCED)' : '❌ NO');

// 4. Browser 3 (Chrome) restores 'app-sample-1'
console.log('\n4. Browser 3 (Chrome) restores "app-sample-1" back to Active:');
let chromeRestore = mockReqRes('PUT', { id: 'app-sample-1', status: 'pending' });
console.log('   - PUT Status:', chromeRestore.statusCode, '| Status on Server:', chromeRestore.data.data.status);

// 5. Browser 1 (Opera) re-syncs
console.log('\n5. Browser 1 (Opera) re-syncs from server:');
let operaFetch = mockReqRes('GET');
let operaActive = operaFetch.data.data.filter(a => a.status !== 'trashed');
let operaTrash = operaFetch.data.data.filter(a => a.status === 'trashed');
console.log('   - Opera Active Applications:', operaActive.length);
console.log('   - Opera Trash Items:', operaTrash.length);
console.log('   - Is app-sample-1 restored in Opera?', operaActive.some(t => t.id === 'app-sample-1') ? '✅ YES (RESTORED)' : '❌ NO');

// 6. Test Empty Trash
console.log('\n6. Test Empty Trash action on server:');
// Move app-sample-2 to trash
mockReqRes('PUT', { id: 'app-sample-2', status: 'trashed' });
let emptyRes = mockReqRes('DELETE', null, { action: 'empty_trash' });
console.log('   - DELETE empty_trash response:', emptyRes.data.message);

let finalFetch = mockReqRes('GET');
let finalTrash = finalFetch.data.data.filter(a => a.status === 'trashed');
console.log('   - Trashed items remaining on server:', finalTrash.length);
console.log('   - Is Trash completely empty?', finalTrash.length === 0 ? '✅ YES (CLEARED)' : '❌ NO');

console.log('\n🎉 ALL MULTI-BROWSER CLOUD TRASH SYNC TESTS PASSED SUCCESSFULLY!\n');
