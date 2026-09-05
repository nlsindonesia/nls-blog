import { chromium } from 'playwright';

async function inspectCses() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://cses.fi/login', { waitUntil: 'networkidle' });
  
  const formInfo = await page.evaluate(() => {
    return {
      title: document.title,
      inputs: Array.from(document.querySelectorAll('input')).map(i => ({ name: i.name, type: i.type, id: i.id })),
      forms: Array.from(document.querySelectorAll('form')).map(f => ({ action: f.action, method: f.method })),
      bodySnippet: document.body.innerText.slice(0, 400)
    };
  });
  console.log('CSES Login Info:', JSON.stringify(formInfo, null, 2));
  
  // Coba login dengan nls_bot / maman123
  console.log('\nMencoba login dengan nls_bot...');
  await page.fill('input[name="nick"]', 'nls_bot');
  await page.fill('input[name="pass"]', 'maman123');
  await page.click('input[type="submit"]');
  await page.waitForTimeout(3000);
  
  console.log('URL setelah login:', page.url());
  const afterText = await page.evaluate(() => document.body.innerText.slice(0, 400));
  console.log('Isi halaman setelah login:\n', afterText);

  await browser.close();
}

inspectCses().catch(console.error);
