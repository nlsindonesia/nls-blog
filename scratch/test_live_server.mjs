async function test() {
    const res = await fetch('http://localhost:3000/');
    const text = await res.text();
    console.log('Homepage status:', res.status);
    console.log('Includes SSO client:', text.includes('/sso-client.js'));
    console.log('Includes template x-if studentSession:', text.includes('<template x-if="studentSession">'));
    console.log('Includes template x-if !studentSession:', text.includes('<template x-if="!studentSession">'));
    console.log('Includes profile dropdown:', text.includes('profileDropdownOpen'));
    console.log('Includes Yuk Belajar link:', text.includes('https://nls-belajar.vercel.app'));
    
    const osnRes = await fetch('http://localhost:3000/bimbel-osn/');
    const osnText = await osnRes.text();
    console.log('Bimbel OSN status:', osnRes.status);
    console.log('Bimbel OSN SSO client:', osnText.includes('/sso-client.js'));
    console.log('Bimbel OSN template x-if studentSession:', osnText.includes('<template x-if="studentSession">'));
    console.log('Bimbel OSN template x-if !studentSession:', osnText.includes('<template x-if="!studentSession">'));
}
test();
