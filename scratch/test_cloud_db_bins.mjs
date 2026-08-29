import { getCloudStore, saveCloudStore } from '../api/cloud-db.js';

console.log('Testing Cloud Database Connector with dedicated bins...');

const store = await getCloudStore();
console.log('Users count:', store.users ? store.users.length : 0);
console.log('Events count:', store.events ? store.events.length : 0);
console.log('Articles count:', store.articles ? store.articles.length : 0);
console.log('Teachers count:', store.teachers ? store.teachers.length : 0);
console.log('Courses count:', store.courses ? store.courses.length : 0);

if (store.users.length >= 8 && store.events.length >= 30 && store.articles.length >= 20 && store.teachers.length >= 10) {
    console.log('✓ All collections successfully verified from Cloud DB!');
} else {
    console.warn('⚠️ Some collections returned fewer items than expected.');
}
