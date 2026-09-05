import { chromium } from 'playwright';
import fs from 'fs';
import os from 'os';
import path from 'path';

async function testEnable() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: 'session/tlx_session.json' });
  const page = await context.newPage();
  await page.goto('https://tlx.toki.id/problems/troc-30/A', { waitUntil: 'networkidle' });
  
  const tempPath = path.join(os.tmpdir(), 'test_sol.cpp');
  fs.writeFileSync(tempPath, '#include <iostream>\nusing namespace std;\nint main(){ int n,m; if(cin>>n>>m){ if(n%m==0) cout<<"BISA\\n"; else cout<<"TIDAK\\n"; } return 0; }');
  
  const fileInput = page.locator('input[name="sourceFiles.source"]');
  await fileInput.setInputFiles(tempPath);
  await page.waitForTimeout(1000);
  
  const state = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button[type="submit"]')).map(b => ({
      text: b.innerText.trim(),
      disabled: b.disabled,
      classes: b.className
    }));
    return btns;
  });
  console.log('Submit Buttons State after setInputFiles:', JSON.stringify(state, null, 2));
  await browser.close();
}

testEnable().catch(console.error);
