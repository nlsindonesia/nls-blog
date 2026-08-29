const { getCloudStore, saveCloudStore } = require('../api/cloud-db.js');

async function test() {
    console.log('1. Reading current cloud store...');
    const store = await getCloudStore();
    console.log('Applications in store:', store.teacherApplications.length);

    console.log('2. Adding new application "Y A (Kak Ss)" with status "rejected"...');
    store.teacherApplications = [
        {
            id: 'app-y-a-1',
            nama: 'Y A',
            panggilan: 'Ss',
            wa: '4',
            email: 'hamemanyu@gmail.com',
            status: 'rejected',
            submittedAt: new Date().toISOString()
        }
    ];
    await saveCloudStore({ teacherApplications: store.teacherApplications });
    console.log('Saved to Cloud DB!');

    console.log('3. Re-fetching from Cloud DB (simulating Browser B on separate computer/instance)...');
    const storeB = await getCloudStore();
    console.log('Browser B fetched applications:', storeB.teacherApplications);
}

test();
