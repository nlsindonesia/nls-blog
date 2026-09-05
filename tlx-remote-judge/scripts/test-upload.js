const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const os = require('os');

async function test() {
  const sessionFile = path.resolve(__dirname, '../session/tlx_session.json');
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ storageState: sessionFile });
  const page = await ctx.newPage();

  console.log('Navigating to problem...');
  await page.goto('https://tlx.toki.id/problems/troc-30/A', { waitUntil: 'networkidle' });

  // Create temp file
  const tmpFile = path.join(os.tmpdir(), 'solution.cpp');
  fs.writeFileSync(tmpFile, `#include <iostream>
using namespace std;
int main() {
    int n, m;
    if (cin >> n >> m) {
        if (n % m == 0) cout << "BISA\\n";
        else cout << "TIDAK\\n";
    }
    return 0;
}`, 'utf8');

  console.log('Finding file input: input[name="sourceFiles.source"]...');
  const fileInput = page.locator('input[name="sourceFiles.source"]');
  await fileInput.setInputFiles(tmpFile);
  console.log('File set!');

  await page.waitForTimeout(1000);

  // Check if submit button is enabled
  const submitBtn = page.locator('button[type="submit"]:has-text("Submit")');
  const isDisabled = await submitBtn.getAttribute('disabled');
  const cls = await submitBtn.getAttribute('class');
  console.log('Submit button disabled attr:', isDisabled);
  console.log('Submit button classes:', cls);

  if (isDisabled === null && !cls.includes('bp6-disabled')) {
    console.log('🚀 Submit button is ENABLED! Clicking submit now...');
    await submitBtn.click();
    console.log('Clicked submit! Waiting 5s...');
    await page.waitForTimeout(5000);
    console.log('Current URL after submit:', page.url());
    console.log('Body snippet:', (await page.textContent('body')).slice(0, 500));
  } else {
    console.log('Still disabled. Checking why...');
  }

  await browser.close();
}

test().catch(console.error);
