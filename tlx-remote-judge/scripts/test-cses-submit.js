const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function testCsesSubmission() {
  const sessionPath = path.resolve(__dirname, '../session/cses_session.json');
  console.log('Session path exists:', fs.existsSync(sessionPath));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    storageState: fs.existsSync(sessionPath) ? sessionPath : undefined
  });
  const page = await context.newPage();

  // 1. Verify login
  await page.goto('https://cses.fi/problemset/submit/1068/', { waitUntil: 'networkidle' });
  console.log('Current URL:', page.url());
  const bodyText = await page.innerText('body');
  
  if (page.url().includes('/login') || bodyText.includes('Login')) {
    console.log('Session invalid or expired. Performing auto-login...');
    await page.goto('https://cses.fi/login', { waitUntil: 'networkidle' });
    await page.fill('input[name="nick"]', 'nls_bot');
    await page.fill('input[name="pass"]', 'maman123');
    await page.click('input[type="submit"]');
    await page.waitForTimeout(2000);
    await context.storageState({ path: sessionPath });
    console.log('Login successful and session updated!');
    await page.goto('https://cses.fi/problemset/submit/1068/', { waitUntil: 'networkidle' });
  }

  console.log('Page Title:', await page.title());

  // Inspect form elements
  const formElements = await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select')).map(s => ({
      name: s.name,
      options: Array.from(s.options).map(o => ({ value: o.value, text: o.innerText.trim(), selected: o.selected }))
    }));
    const inputs = Array.from(document.querySelectorAll('input')).map(i => ({
      name: i.name,
      type: i.type,
      value: i.value
    }));
    return { selects, inputs };
  });
  console.log('Form Selects:', JSON.stringify(formElements.selects, null, 2));
  console.log('Form Inputs:', JSON.stringify(formElements.inputs, null, 2));

  // Write temporary C++ solution
  const cppCode = `#include <iostream>
using namespace std;
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    long long n;
    if (!(cin >> n)) return 0;
    while (true) {
        cout << n;
        if (n == 1) break;
        cout << " ";
        if (n % 2 == 0) n /= 2;
        else n = 3 * n + 1;
    }
    cout << "\\n";
    return 0;
}
`;
  const tempFile = path.join(os.tmpdir(), 'solution_1068.cpp');
  fs.writeFileSync(tempFile, cppCode, 'utf8');

  // Select language C++
  if (await page.locator('select[name="lang"]').count() > 0) {
    await page.selectOption('select[name="lang"]', 'C++');
  }

  // Upload file
  const fileInput = page.locator('input[type="file"][name="file"]');
  await fileInput.setInputFiles(tempFile);

  console.log('Submitting form...');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('input[type="submit"]')
  ]);

  console.log('After submit URL:', page.url());

  // Wait and poll status on result page
  for (let i = 0; i < 15; i++) {
    const resultData = await page.evaluate(() => {
      // Find status/verdict on page
      const pageText = document.body.innerText;
      const tables = Array.from(document.querySelectorAll('table')).map(t => {
        return Array.from(t.querySelectorAll('tr')).map(r => 
          Array.from(r.querySelectorAll('th, td')).map(c => c.innerText.trim())
        );
      });
      return {
        url: window.location.href,
        title: document.title,
        tables,
        pageSnippet: pageText.slice(0, 1000)
      };
    });

    console.log(`\n--- Poll ${i+1} ---`);
    console.log('Tables:', JSON.stringify(resultData.tables, null, 2));
    
    // Check if result is done
    const tableFlat = JSON.stringify(resultData.tables);
    if (tableFlat.includes('ACCEPTED') || tableFlat.includes('WRONG ANSWER') || tableFlat.includes('TIME LIMIT EXCEEDED') || tableFlat.includes('READY')) {
      if (!tableFlat.includes('PENDING') && !tableFlat.includes('READY')) {
        console.log('Final verdict reached!');
        break;
      }
    }
    await page.waitForTimeout(2000);
    await page.reload({ waitUntil: 'networkidle' });
  }

  if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
  await browser.close();
}

testCsesSubmission().catch(console.error);
