const { getCloudStore, saveCloudStore } = require('../api/cloud-db.js');

async function testProcessSync() {
    console.log('--- TEST: REAL CROSS-PROCESS / CROSS-BROWSER PERSISTENCE ---');
    const store = await getCloudStore();
    console.log('Current items in Cloud DB:');
    console.log(JSON.stringify(store.teacherApplications, null, 2));

    // Admin rejects applicant
    const app = store.teacherApplications[0];
    if (app) {
        app.status = 'rejected';
        app.note = 'Ditolak via Super Admin Portal';
        await saveCloudStore({ teacherApplications: store.teacherApplications });
        console.log('Updated app status to:', app.status);
    }

    // Fresh fetch (simulating totally separate browser/container)
    const freshStore = await getCloudStore();
    console.log('Fresh store verification:');
    console.log('Status:', freshStore.teacherApplications[0]?.status);
    console.log('Note:', freshStore.teacherApplications[0]?.note);
}

testProcessSync();
