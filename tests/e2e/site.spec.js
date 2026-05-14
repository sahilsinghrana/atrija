// tests/e2e/site.spec.js
import { test, expect } from '@playwright/test';

test.describe('Van Gogh Site — E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Build must be done first; test against the built static files
    await page.goto('http://localhost:8080');
  });

  test('page loads with title "Selene"', async ({ page }) => {
    await expect(page).toHaveTitle(/Selene/);
  });

  test('navigation bar is visible', async ({ page }) => {
    const nav = page.locator('nav.nav');
    await expect(nav).toBeVisible();
  });

  test('logo links to hero', async ({ page }) => {
    const logo = page.locator('a.logo');
    await expect(logo).toHaveText('Selene');
    await expect(logo).toHaveAttribute('href', /#hero/);
  });

  test('hero section renders', async ({ page }) => {
    const hero = page.locator('#hero');
    await expect(hero).toBeVisible();
    await expect(hero.locator('h1')).toHaveText('Selene');
  });

  test('canvas container exists for Three.js', async ({ page }) => {
    const canvas = page.locator('#canvas-container');
    await expect(canvas).toBeAttached();
  });

  test('all main sections are present', async ({ page }) => {
    const sections = ['#today', '#moon', '#philosophy', '#gita', '#shiva', '#art', '#changelog'];
    for (const id of sections) {
      await expect(page.locator(id)).toBeAttached();
    }
  });

  test('today section has a fact card', async ({ page }) => {
    const factCard = page.locator('#today .fact-card');
    await expect(factCard).toBeVisible();
    await expect(factCard.locator('.source')).toBeVisible();
  });

  test('changelog section displays entries', async ({ page }) => {
    const changelog = page.locator('#changelog');
    await expect(changelog).toBeAttached();
    const entries = changelog.locator('.fact-card');
    await expect(entries.first()).toBeVisible();
  });

  test('changelog panel is fixed at bottom right', async ({ page }) => {
    const panel = page.locator('.changelog-panel');
    await expect(panel).toBeAttached();
  });

  test('philosophy section has quote blocks', async ({ page }) => {
    const quotes = page.locator('#philosophy .quote-block');
    await expect(quotes.first()).toBeVisible();
  });

  test('Bhagavad Gita section contains expected content', async ({ page }) => {
    const gita = page.locator('#gita');
    await expect(gita.locator('h2')).toHaveText(/Bhagavad Gita/);
  });

  test('Shiv Purana section contains expected content', async ({ page }) => {
    const shiva = page.locator('#shiva');
    await expect(shiva.locator('h2')).toHaveText(/Shiv Purana/);
  });

  test('CSS variables are set for color scheme', async ({ page }) => {
    const primary = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
    });
    expect(primary).toBeTruthy();
    expect(primary).toMatch(/^#[0-9a-fA-F]{6}$/);
  });
});
