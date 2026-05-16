// tests/loading/01-static-bg.test.js
// Test: Static gradient background visible before JS loads
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Loading Optimization: Static Background', () => {
  it('BaseLayout has inline gradient background as first style in head', () => {
    const layout = readFileSync(join(process.cwd(), 'src/layouts/BaseLayout.astro'), 'utf-8');
    // The very first <style> block in <head> should set a gradient background on body
    const headMatch = layout.match(/<head>([\s\S]*?)<\/head>/);
    expect(headMatch).toBeTruthy();
    const headContent = headMatch[1];
    // Find the first <style> block in head
    const firstStyleMatch = headContent.match(/<style[^>]*>([\s\S]*?)<\/style>/);
    expect(firstStyleMatch).toBeTruthy();
    const firstStyle = firstStyleMatch[1];
    // It should contain a gradient background
    expect(firstStyle).toMatch(/background:\s*linear-gradient/);
    expect(firstStyle).toMatch(/body|#canvas-container/);
  });

  it('gradient style appears before loader CSS link', () => {
    const layout = readFileSync(join(process.cwd(), 'src/layouts/BaseLayout.astro'), 'utf-8');
    const headMatch = layout.match(/<head>([\s\S]*?)<\/head>/);
    const headContent = headMatch[1];
    const gradientPos = headContent.indexOf('linear-gradient');
    const loaderCssPos = headContent.indexOf('/css/loader.css');
    // gradient should come before loader CSS (or at least exist)
    expect(gradientPos).toBeGreaterThan(-1);
    expect(loaderCssPos).toBeGreaterThan(-1);
    expect(gradientPos).toBeLessThan(loaderCssPos);
  });
});
