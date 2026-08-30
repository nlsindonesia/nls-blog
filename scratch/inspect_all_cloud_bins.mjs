import { getCloudStore } from '../api/cloud-db.js';

async function inspect() {
    console.log('Fetching live data from Cloud Database...');
    const store = await getCloudStore();
    console.log('\n=== CLOUD DATABASE INVENTORY ===');
    console.log(`1. Users: ${store.users.length}`);
    console.log(`2. Articles: ${store.articles.length} (Active: ${store.articles.filter(a => a.status !== 'trashed').length}, Trashed: ${store.articles.filter(a => a.status === 'trashed').length})`);
    console.log(`3. Events: ${store.events.length} (Active: ${store.events.filter(e => e.status !== 'trashed').length}, Trashed: ${store.events.filter(e => e.status === 'trashed').length})`);
    console.log(`4. Teachers: ${store.teachers.length} (Active: ${store.teachers.filter(t => t.status !== 'trashed').length}, Trashed: ${store.teachers.filter(t => t.status === 'trashed').length})`);
    console.log(`5. Teacher Applications: ${store.teacherApplications.length}`);
    console.log(`6. Courses: ${store.courses.length}`);
    console.log(`7. Quiz Submissions: ${store.quizSubmissions.length}`);
    console.log('=================================');
    
    console.log('\n--- ACTIVE ARTICLES LIST ---');
    store.articles.filter(a => a.status !== 'trashed').forEach((a, i) => {
        console.log(`${i+1}. [${a.id}] ${a.title} (${a.category})`);
    });

    console.log('\n--- ACTIVE EVENTS LIST ---');
    store.events.filter(e => e.status !== 'trashed').forEach((e, i) => {
        console.log(`${i+1}. [${e.id}] ${e.title} (${e.date || e.startDate})`);
    });
}

inspect().catch(console.error);
