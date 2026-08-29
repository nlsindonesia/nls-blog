import { getCloudStore, saveCloudStore } from '../api/cloud-db.js';

async function debug() {
    console.log('--- Step 1: getCloudStore() ---');
    let store = await getCloudStore();
    console.log('Got store:', store);

    console.log('\n--- Step 2: saveCloudStore() ---');
    const saveRes = await saveCloudStore({
        teacherApplications: [
            { id: 'app-test-999', nama: 'Y A', status: 'rejected' }
        ]
    });
    console.log('saveCloudStore success?:', saveRes);

    console.log('\n--- Step 3: getCloudStore() again ---');
    let storeAfter = await getCloudStore();
    console.log('Got store after save:', storeAfter);
}

debug();
