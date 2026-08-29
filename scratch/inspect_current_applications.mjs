import { getCloudStore } from '../api/cloud-db.js';

async function check() {
    const store = await getCloudStore();
    console.log('Teacher applications count in Cloud DB:', store.teacherApplications ? store.teacherApplications.length : 0);
    if (store.teacherApplications && store.teacherApplications.length > 0) {
        store.teacherApplications.forEach((app, idx) => {
            console.log(`\nApp ${idx + 1}:`);
            console.log('ID:', app.id);
            console.log('Nama:', app.nama || app.name);
            console.log('Photo exists:', !!app.photo);
            console.log('Photo length:', app.photo ? app.photo.length : 0);
            console.log('Photo preview:', app.photo ? app.photo.slice(0, 100) : 'none');
        });
    }
}

check().catch(console.error);
