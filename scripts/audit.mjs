import { chromium } from '@playwright/test';
import lighthouse from 'lighthouse';
import { mkdirSync, writeFileSync } from 'node:fs';

// Own the browser lifecycle to avoid chrome-launcher temporary-profile cleanup
// races on Windows. The audited development server must already be running.
const browser = await chromium.launch({ args: ['--remote-debugging-port=9228'] });
try {
  const result = await lighthouse('http://127.0.0.1:8766/', {
    port: 9228, logLevel: 'error', output: ['json', 'html'],
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  });
  mkdirSync('artifacts', { recursive: true });
  writeFileSync('artifacts/lighthouse.json', result.report[0]);
  writeFileSync('artifacts/lighthouse.html', result.report[1]);
  for (const [name, category] of Object.entries(result.lhr.categories)) {
    console.log(`${name}: ${Math.round(category.score * 100)}/100`);
  }
} finally { await browser.close(); }
