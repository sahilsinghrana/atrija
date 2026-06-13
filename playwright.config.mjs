import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Visual Regression Testing Configuration (idea-068)
 *
 * Configures 3 device profiles for visual regression testing:
 * - Mobile:  375×812  (iPhone 12 baseline)
 * - Tablet:  768×1024 (iPad baseline)
 * - Desktop: 1280×720 (small laptop baseline)
 *
 * Visual comparison thresholds:
 * - Pixel difference ratio: 0.1% (allows for minor anti-aliasing / font rendering differences)
 * - Layout-critical tests: 0 pixel diff (structural elements must match exactly)
 *
 * Baselines stored in: tests/visual/baselines/{mobile,tablet,desktop}/
 *
 * Usage:
 *   npx playwright test tests/visual/              # Run all visual tests
 *   npx playwright test tests/visual/ --update     # Update baselines
 *   npm run test:visual                            # Alias for CI (update mode)
 *   npm run test:visual:ci                         # Alias for CI (strict mode)
 */

const VISUAL_THRESHOLD = 0.001; // 0.1% pixel difference allowed

export default defineConfig({
  testDir: './tests/visual',
  testMatch: /\.spec\.(mjs|ts|js)$/,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'tests/visual-report', open: 'never' }]
  ],
  timeout: 60000,
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: VISUAL_THRESHOLD,
      threshold: 0.2,
      animations: 'disabled',
    },
  },
  use: {
    baseURL: process.env.TEST_BASE_URL || 'http://127.0.0.1:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'tablet',
      use: {
        ...devices['iPad (gen 7)'],
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'mobile',
      use: {
        ...devices['iPhone 12'],
        viewport: { width: 375, height: 812 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
