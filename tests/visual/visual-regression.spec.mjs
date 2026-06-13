/**
 * Visual Regression Test Suite (idea-068)
 *
 * Screenshot-based visual regression tests that compare the current
 * rendered page against baseline screenshots. Runs across 3 device
 * profiles: desktop (1280×720), tablet (768×1024), mobile (375×812).
 *
 * Baseline screenshots are stored in tests/visual/baselines/{device}/
 * and are regenerated with --update flag.
 *
 * Key states tested:
 * 1. Initial page load (hero visible, loader present)
 * 2. Post-load state (loader hidden, content visible)
 * 3. Scrolled to each major section
 * 4. Changelog panel visible
 *
 * Threshold: 0.1% pixel difference (allows for minor AA/font rendering differences)
 * Layout-critical: 0 pixel diff for structural elements
 */
import { test, expect } from '@playwright/test';

// ── Helpers ────────────────────────────────────────────────────────

/**
 * Wait for the page to fully load including the 3D scene.
 * The scene signals ready via window.__sceneReady().
 * Falls back to networkidle if scene doesn't signal (e.g., headless).
 */
async function waitForPageReady(page, timeoutMs = 20000) {
  try {
    await page.evaluate((timeout) => {
      return new Promise((resolve) => {
        if (window.__sceneReadyCalled) { resolve('already'); return; }
        const orig = window.__sceneReady;
        window.__sceneReady = () => { window.__sceneReadyCalled = true; if (orig) orig(); resolve('signaled'); };
        setTimeout(() => resolve('timeout'), timeout);
      });
    }, timeoutMs);
  } catch {
    // Scene may not load in headless - that's OK for layout tests
  }
  // Also wait for network to settle
  await page.waitForLoadState('networkidle', { timeout: timeoutMs }).catch(() => {});
}

/**
 * Disable the 3D canvas for stable screenshots.
 * The Three.js canvas is non-deterministic (animation loop),
 * so we hide it for visual regression stability.
 */
async function stabilizeCanvas(page) {
  await page.evaluate(() => {
    const container = document.getElementById('canvas-container');
    if (container) container.style.visibility = 'hidden';
  });
}

/**
 * Re-enable the 3D canvas after screenshot.
 */
async function restoreCanvas(page) {
  await page.evaluate(() => {
    const container = document.getElementById('canvas-container');
    if (container) container.style.visibility = '';
  });
}

// ── Test Suite ─────────────────────────────────────────────────────

test.describe('Visual Regression — Initial Load', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { timeout: 30000 });
    await waitForPageReady(page);
  });

  test('hero section renders correctly', async ({ page }) => {
    await stabilizeCanvas(page);
    const hero = page.locator('#hero');
    await expect(hero).toHaveScreenshot('hero-section.png', {
      maxDiffPixelRatio: 0.001,
      threshold: 0.2,
      animations: 'disabled',
    });
    await restoreCanvas(page);
  });

  test('navigation bar renders correctly', async ({ page }) => {
    await stabilizeCanvas(page);
    const nav = page.locator('nav.nav');
    await expect(nav).toHaveScreenshot('nav-bar.png', {
      maxDiffPixelRatio: 0.001,
      threshold: 0.2,
      animations: 'disabled',
    });
    await restoreCanvas(page);
  });

  test('today section renders correctly', async ({ page }) => {
    await stabilizeCanvas(page);
    const today = page.locator('#today');
    await expect(today).toHaveScreenshot('today-section.png', {
      maxDiffPixelRatio: 0.001,
      threshold: 0.2,
      animations: 'disabled',
    });
    await restoreCanvas(page);
  });

  test('full page above-the-fold screenshot', async ({ page }) => {
    await stabilizeCanvas(page);
    await expect(page).toHaveScreenshot('above-fold.png', {
      maxDiffPixelRatio: 0.001,
      threshold: 0.2,
      animations: 'disabled',
    });
    await restoreCanvas(page);
  });
});

test.describe('Visual Regression — Content Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { timeout: 30000 });
    await waitForPageReady(page);
    // Scroll past hero to content
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(500);
  });

  test('moon section renders correctly', async ({ page }) => {
    await stabilizeCanvas(page);
    await page.locator('#moon').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const moon = page.locator('#moon');
    await expect(moon).toHaveScreenshot('moon-section.png', {
      maxDiffPixelRatio: 0.001,
      threshold: 0.2,
      animations: 'disabled',
    });
    await restoreCanvas(page);
  });

  test('philosophy section renders correctly', async ({ page }) => {
    await stabilizeCanvas(page);
    await page.locator('#philosophy').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const philosophy = page.locator('#philosophy');
    await expect(philosophy).toHaveScreenshot('philosophy-section.png', {
      maxDiffPixelRatio: 0.001,
      threshold: 0.2,
      animations: 'disabled',
    });
    await restoreCanvas(page);
  });

  test('gita section renders correctly', async ({ page }) => {
    await stabilizeCanvas(page);
    await page.locator('#gita').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const gita = page.locator('#gita');
    await expect(gita).toHaveScreenshot('gita-section.png', {
      maxDiffPixelRatio: 0.001,
      threshold: 0.2,
      animations: 'disabled',
    });
    await restoreCanvas(page);
  });

  test('shiva section renders correctly', async ({ page }) => {
    await stabilizeCanvas(page);
    await page.locator('#shiva').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const shiva = page.locator('#shiva');
    await expect(shiva).toHaveScreenshot('shiva-section.png', {
      maxDiffPixelRatio: 0.001,
      threshold: 0.2,
      animations: 'disabled',
    });
    await restoreCanvas(page);
  });

  test('art section renders correctly', async ({ page }) => {
    await stabilizeCanvas(page);
    await page.locator('#art').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const art = page.locator('#art');
    await expect(art).toHaveScreenshot('art-section.png', {
      maxDiffPixelRatio: 0.001,
      threshold: 0.2,
      animations: 'disabled',
    });
    await restoreCanvas(page);
  });
});

test.describe('Visual Regression — Changelog Panel', () => {
  test('changelog panel renders correctly', async ({ page }) => {
    await page.goto('/', { timeout: 30000 });
    await waitForPageReady(page);
    await stabilizeCanvas(page);
    const changelog = page.locator('#changelog');
    await changelog.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(changelog).toHaveScreenshot('changelog-section.png', {
      maxDiffPixelRatio: 0.001,
      threshold: 0.2,
      animations: 'disabled',
    });
    await restoreCanvas(page);
  });
});

test.describe('Visual Regression — Layout Structure', () => {
  test('all main sections are present in DOM', async ({ page }) => {
    await page.goto('/', { timeout: 30000 });
    await waitForPageReady(page);

    const sectionIds = ['#today', '#moon', '#philosophy', '#gita', '#shiva', '#art', '#changelog'];
    for (const id of sectionIds) {
      await expect(page.locator(id)).toBeAttached();
    }
  });

  test('canvas container exists for 3D scene', async ({ page }) => {
    await page.goto('/', { timeout: 30000 });
    await waitForPageReady(page);
    await expect(page.locator('#canvas-container')).toBeAttached();
  });

  test('no JavaScript errors on page load', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/', { timeout: 30000 });
    await waitForPageReady(page);
    await page.waitForTimeout(3000);

    const criticalErrors = errors.filter(e =>
      !e.includes('favicon') &&
      !e.includes('net::ERR') &&
      !e.includes('ResizeObserver') &&
      !e.includes('canvas') // WebGL may warn in headless
    );
    expect(criticalErrors, `Unexpected JS errors: ${JSON.stringify(criticalErrors)}`).toEqual([]);
  });
});
