import { chromium } from 'playwright';
import fs from 'fs';
import os from 'os';
import path from 'path';

async function testSubmitClick() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: 'session/tlx_session.json' });
  const page = await context.newPage();
  await page.goto('https://tlx.toki.id/problems/troc-30/A', { waitUntil: 'networkidle' });
  
  const tempPath = path.join(os.tmpdir(), 'test_sol.cpp');
  fs.writeFileSync(tempPath, '#include <iostream>\nusing namespace std;\nint main(){ int n,m; if(cin>>n>>m){ if(n%m==0) cout<<"BISA\\n"; else cout<<"TIDAK\\n"; } return 0; }');
  
  const fileInput = page.locator('input[name="sourceFiles.source"]');
  await fileInput.setInputFiles(tempPath);
  await page.waitForTimeout(1000);
  
  const submitBtn = page.locator('button[type="submit"]:has-text("Submit"), button[type="submit"]:has-text("Kirim")').first();
  console.log('Clicking Submit button...');
  await submitBtn.click();
  
  console.log('Waiting 5s...');
  await page.waitForTimeout(5000);
  
  console.log('Current URL after submit:', page.url());
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 500));
  console.log('Page Text snippet:\n', bodyText);
  
  const links = await page.evaluate(() => Array.from(document.querySelectorAll('a')).map(a => a.href).filter(h => h.includes('submission')));
  console.log('Submission Links found:', links);
  
  const tables = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('table')).map(t => ({
      headers: Array.from(t.querySelectorAll('th')).map(th => th.innerText.trim()),
      rows: Array.from(t.querySelectorAll('tr')).map(r => Array.from(r.querySelectorAll('td')).map(td => td.innerText.trim()))
    }));
  });
  console.log('Tables found:', JSON.stringify(tables, null, 2));

  await browser.close();
}

testSubmitClick().catch(console.error);
