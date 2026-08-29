import { getCloudStore } from '../api/cloud-db.js';

async function verify() {
    console.log('Fetching users from cloud store via getCloudStore()...');
    const store = await getCloudStore();
    console.log(`Total users in store: ${store.users.length}`);
    store.users.forEach(u => {
        console.log(`- ID: ${u.id} | Name: ${u.name} | Role: ${u.roleLabel || u.role} | Email: ${u.email}`);
    });
}

verify();
