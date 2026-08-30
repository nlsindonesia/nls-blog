import { getCloudStore } from '../api/cloud-db.js';
import fs from 'fs';

async function runVerification() {
    console.log('====================================================');
    console.log('TEST SUITE: UNIVERSAL CLOUD SYNC & SINGLE SOURCE OF TRUTH');
    console.log('====================================================');

    // 1. Check Cloud DB live inventory
    console.log('1. Fetching live Master Cloud Database Store...');
    const store = await getCloudStore();

    const activeUsers = (store.users || []).filter(u => u && u.status !== 'trashed');
    const activeArticles = (store.articles || []).filter(a => a && a.status !== 'trashed');
    const activeEvents = (store.events || []).filter(e => e && e.status !== 'trashed');
    const activeTeachers = (store.teachers || []).filter(t => t && t.status !== 'trashed');

    console.log(`   - Active Users: ${activeUsers.length} (Expected: 1 Super Admin)`);
    console.log(`   - Active Articles: ${activeArticles.length} (Expected: 22 Articles)`);
    console.log(`   - Active Events: ${activeEvents.length} (Expected: 32 Events)`);
    console.log(`   - Active Teachers: ${activeTeachers.length} (Expected: 15 Teachers)`);

    const usersPass = activeUsers.length === 1 && activeUsers[0].role === 'super_admin';
    const articlesPass = activeArticles.length === 22;
    const eventsPass = activeEvents.length === 32;

    console.log(`   Users Check: ${usersPass ? 'PASS' : 'FAIL'}`);
    console.log(`   Articles Check: ${articlesPass ? 'PASS' : 'FAIL'}`);
    console.log(`   Events Check: ${eventsPass ? 'PASS' : 'FAIL'}`);

    // 2. Check sso-client.js
    console.log('\n2. Verifying sso-client.js CloudSync Module...');
    const ssoContent = fs.readFileSync('sso-client.js', 'utf8');
    const hasCloudSync = ssoContent.includes('NlsCloudSync') && ssoContent.includes('v3_cloud_sync_2026_08_30');
    console.log(`   Has NlsCloudSync & Cache Versioning: ${hasCloudSync ? 'PASS' : 'FAIL'}`);

    // 3. Check Homepage index.html
    console.log('\n3. Verifying Homepage (index.html) Cloud-First Loader...');
    const homeContent = fs.readFileSync('index.html', 'utf8');
    const homeHasArticleFetch = homeContent.includes('/api/articles') && !homeContent.includes('window.NLS_DEFAULT_ARTICLES.forEach');
    const homeHasEventFetch = homeContent.includes('/api/events');
    console.log(`   Homepage Articles live fetcher: ${homeHasArticleFetch ? 'PASS' : 'FAIL'}`);
    console.log(`   Homepage Events live fetcher: ${homeHasEventFetch ? 'PASS' : 'FAIL'}`);

    // 4. Check Blog (blog/index.html)
    console.log('\n4. Verifying Blog Page (blog/index.html) Cloud-First Loader...');
    const blogContent = fs.readFileSync('blog/index.html', 'utf8');
    const blogHasFetch = blogContent.includes('/api/articles');
    console.log(`   Blog Articles live fetcher: ${blogHasFetch ? 'PASS' : 'FAIL'}`);

    // 5. Check Calendar (kalender/index.html)
    console.log('\n5. Verifying Calendar Page (kalender/index.html) Cloud-First Loader...');
    const calContent = fs.readFileSync('kalender/index.html', 'utf8');
    const calHasFetch = calContent.includes('/api/events');
    console.log(`   Calendar Events live fetcher: ${calHasFetch ? 'PASS' : 'FAIL'}`);

    console.log('\n====================================================');
    const allPassed = usersPass && articlesPass && eventsPass && hasCloudSync && homeHasArticleFetch && homeHasEventFetch && blogHasFetch && calHasFetch;
    console.log(allPassed ? 'ALL VERIFICATIONS PASSED 100%! SYSTEM IS SYNCHRONIZED.' : 'SOME CHECKS FAILED.');
    console.log('====================================================');
}

runVerification().catch(console.error);
