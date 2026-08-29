import handlerApps from '../api/teacher-applications.js';

function createMockReqRes(method, body = null, query = {}) {
    let statusCode = 200;
    let responseData = null;
    const req = { method, body, query, headers: {} };
    const res = {
        setHeader: () => {},
        status: (code) => { statusCode = code; return res; },
        json: (data) => { responseData = data; return res; },
        end: () => res
    };
    return { req, res, getResult: () => ({ statusCode, responseData }) };
}

async function testTeacherPhotoPipeline() {
    console.log('================================================================');
    console.log('   TESTING TEACHER APPLICATION & PHOTO UPLOAD PIPELINE');
    console.log('================================================================');

    const samplePhotoBase64 = 'data:image/jpeg;base64,' + Buffer.from('FAKE_TEST_COMPRESSED_IMAGE_DATA_12345').toString('base64');
    const testAppId = `app-test-${Date.now()}`;

    // 1. Submit teacher application with photo
    const postBody = {
        id: testAppId,
        nama: 'Dr. Sarah Kartika, S.Si., M.Sc.',
        panggilan: 'Kak Sarah',
        wa: '081234567890',
        email: 'sarah.kartika@test.com',
        pendidikan: 'Sains & Matematika ITB (Cumlaude)',
        photo: samplePhotoBase64,
        categories: ['OSN', 'SNBT'],
        jenjang: ['SMA'],
        subject: 'Matematika & Fisika Lanjut',
        fokusPrivat: 'Bimbingan intensif persiapan Olimpiade Sains Nasional (OSN) dan UTBK SNBT.',
        filosofi: 'Belajar sains adalah proses menemukan keindahan hukum alam secara logis dan menyenangkan.',
        highlights: ['Peraih Medali Perak OSN Fisika Nasional', 'Tutor bimbingan 50+ siswa lolos FK UI dan STEI ITB']
    };

    console.log('1. Posting candidate application with profile photo...');
    const postMock = createMockReqRes('POST', postBody);
    await handlerApps(postMock.req, postMock.res);
    const postRes = postMock.getResult();
    
    if (postRes.statusCode !== 201 || !postRes.responseData.data || !postRes.responseData.data.photo) {
        throw new Error(`Failed to save application with photo: ${JSON.stringify(postRes.responseData)}`);
    }
    console.log('✅ Candidate application with photo successfully saved in Cloud DB!');
    console.log('   - ID:', postRes.responseData.data.id);
    console.log('   - Photo length:', postRes.responseData.data.photo.length);

    // 2. Fetch all applications
    console.log('\n2. Fetching applications list to verify photo persistence...');
    const getMock = createMockReqRes('GET');
    await handlerApps(getMock.req, getMock.res);
    const getRes = getMock.getResult();
    
    const found = getRes.responseData.data.find(a => a.id === testAppId);
    if (!found || !found.photo || !found.photo.startsWith('data:image/')) {
        throw new Error('Candidate photo not found in GET response!');
    }
    console.log('✅ Candidate photo verified in list!');
    console.log('   - Applicant Name:', found.nama);
    console.log('   - Photo starts with:', found.photo.slice(0, 30));

    // 3. Clean up test record
    console.log('\n3. Cleaning up test application...');
    const delMock = createMockReqRes('DELETE', null, { id: testAppId });
    await handlerApps(delMock.req, delMock.res);
    console.log('✅ Clean up complete!');

    console.log('\n🎉 ALL TEACHER PHOTO PIPELINE TESTS PASSED 100%!');
}

testTeacherPhotoPipeline().catch(console.error);
