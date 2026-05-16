// tests/loading/02-preloads.test.js
// Test: Module preload and asset preload tags present
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Loading Optimization: Preload Tags', () => {
  it('has modulepreload for scene-init.js', () => {
    const layout = readFileSync(join(process.cwd(), 'src/layouts/BaseLayout.astro'), 'utf-8');
    expect(layout).toMatch(/<link[^>]*rel="modulepreload"[^>]*href="\/js\/scene-init\.js"/);
  });

  it('has preload for loader.css', () => {
    const layout = readFileSync(join(process.cwd(), 'src/layouts/BaseLayout.astro'), 'utf-8');
    expect(layout).toMatch(/<link[^>]*rel="preload"[^>]*href="\/css\/loader\.css"[^>]*as="style"/);
  });

  it('has preload for critical SVGs (moon.svg, stars.svg)', () => {
    const layout = readFileSync(join(process.cwd(), 'src/layouts/BaseLayout.astro'), 'utf-8');
    expect(layout).toMatch(/<link[^>]*rel="preload"[^>]*href="\/images\/moon\.svg"/);
    expect(layout).toMatch(/<link[^>]*rel="preload"[^>]*href="\/images\/stars\.svg"/);
  });

  it('has font-display: swap in inline CSS', () => {
    const layout = readFileSync(join(process.cwd(), 'src/layouts/BaseLayout.astro'), 'utf-8');
    expect(layout).toMatch(/font-display:\s*swap/);
  });
});
