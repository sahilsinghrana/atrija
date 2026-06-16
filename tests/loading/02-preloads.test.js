// tests/loading/02-preloads.test.js
// Test: Preload tags present for critical assets
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Loading Optimization: Preload Tags', () => {
  it('has preload for loader.css', () => {
    const layout = readFileSync(join(process.cwd(), 'src/layouts/BaseLayout.astro'), 'utf-8');
    expect(layout).toMatch(/<link[^>]*rel="preload"[^>]*href="\/css\/loader\.css"[^>]*as="style"/);
  });

  it('has preload for main.css', () => {
    const layout = readFileSync(join(process.cwd(), 'src/layouts/BaseLayout.astro'), 'utf-8');
    expect(layout).toMatch(/<link[^>]*rel="preload"[^>]*href="\/css\/main\.css"[^>]*as="style"/);
  });

  it('has preconnect for Google Fonts', () => {
    const layout = readFileSync(join(process.cwd(), 'src/layouts/BaseLayout.astro'), 'utf-8');
    expect(layout).toMatch(/<link[^>]*rel="preconnect"[^>]*href="https:\/\/fonts\.googleapis\.com"/);
    expect(layout).toMatch(/<link[^>]*rel="preconnect"[^>]*href="https:\/\/fonts\.gstatic\.com"/);
  });

  it('has font-display: swap in Google Fonts link', () => {
    const layout = readFileSync(join(process.cwd(), 'src/layouts/BaseLayout.astro'), 'utf-8');
    // font-display=swap is encoded as &display=swap in the Google Fonts URL
    expect(layout).toMatch(/&display=swap/);
  });
});
