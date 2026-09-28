import { test, expect } from '@playwright/test';

test('loads with local assets, no JS errors, and no horizontal overflow', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400 && response.url().startsWith('http://127.0.0.1')) errors.push(response.url()); });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText("Hi, I'm Daniel.");
  await expect(page.locator('.brand img')).toHaveAttribute('src', './assets/images/daniel-avatar.png');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', './assets/images/daniel-avatar.png');
  await expect(page.locator('.project-card')).toHaveCount(6);
  for (const image of await page.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(element => element.complete && element.naturalWidth > 0)).toBe(true);
  }
  await page.locator('#contact').scrollIntoViewIfNeeded();
  const broken = await page.locator('img').evaluateAll(images => images.filter(image => !image.complete || !image.naturalWidth).map(image => image.src));
  expect(broken).toEqual([]);
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const resources = await page.evaluate(() => performance.getEntriesByType('resource').map(entry => entry.name));
  expect(resources.every(url => url.startsWith('http://127.0.0.1'))).toBe(true);
});

test('experience supports mouse and keyboard with accurate details', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Current role', exact: true })).toBeVisible();
  await expect(page.locator('.experience-item')).toHaveCount(1);
  await expect(page.locator('.experience-item .company-name')).toContainText('Billennium');
  await expect(page.locator('#experience')).not.toContainText(/Nokia|RedPanda|Electric Panda|DANIELOZA|Earlier work/i);
  const detail = page.locator('.experience-item').first();
  await detail.locator('summary').click();
  await expect(detail).toHaveAttribute('open', '');
  await expect(detail.getByText(/AcrPull permission issue/)).toBeVisible();
  await detail.locator('summary').press('Enter');
  await expect(detail).not.toHaveAttribute('open', '');
  await detail.locator('summary').press('Space');
  await expect(detail).toHaveAttribute('open', '');
  await page.locator('.more-projects summary').click();
  await expect(page.locator('.more-projects-list a')).toHaveCount(6);
});

test('theme respects system preference and persists a manual choice', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('no public CV; project links, anchors, and copy-email feedback work', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Download CV' })).toHaveCount(0);
  await expect(page.locator('a[download], a[href$=".pdf"]')).toHaveCount(0);
  const pdf = await page.request.get('/assets/Daniel_Danek_CV.pdf');
  expect(pdf.status()).toBe(404);
  await page.getByRole('link', { name: 'Explore projects', exact: true }).click();
  await expect(page).toHaveURL(/#projects$/);
  await page.getByRole('navigation').getByRole('link', { name: 'Projects', exact: true }).click();
  await expect(page).toHaveURL(/#projects$/);
  await page.getByRole('navigation').getByRole('link', { name: 'Contact', exact: true }).click();
  await page.getByRole('button', { name: 'Copy email address' }).click();
  await expect(page.getByRole('status')).toHaveText('Email copied.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('kontakt.danieldanek@gmail.com');
});

test('reduced-motion and no-JavaScript keep content accessible', async ({ page, browser }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await page.locator('.hero').evaluate(element => getComputedStyle(element).opacity)).toBe('1');
  expect(await page.locator('html').evaluate(element => getComputedStyle(element).scrollBehavior)).toBe('auto');
  const context = await browser.newContext({ javaScriptEnabled: false });
  const plain = await context.newPage();
  await plain.goto('http://127.0.0.1:8766/');
  await plain.locator('.experience-item summary').first().click();
  await expect(plain.getByText(/AcrPull permission issue/)).toBeVisible();
  expect(await plain.locator('.hero').evaluate(element => getComputedStyle(element).opacity)).toBe('1');
  await context.close();
});

test('captures a readable preview in both themes', async ({ page }, testInfo) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await page.goto('/');
  for (const image of await page.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(element => element.complete && element.naturalWidth > 0)).toBe(true);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `artifacts/${testInfo.project.name}-light.png`, scale: 'css' });
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await page.screenshot({ path: `artifacts/${testInfo.project.name}-dark.png`, scale: 'css' });
  await page.locator('.projects-intro').scrollIntoViewIfNeeded();
  await page.screenshot({ path: `artifacts/${testInfo.project.name}-projects.png`, scale: 'css' });
});
