// tests/loading/04-progressive.test.js
// Test: Scene bundle exists and scene-bootstrap module is loaded
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Loading Optimization: Scene Loading', () => {
  it('scene-bundle.js exists in public/js/', () => {
    const bundlePath = join(process.cwd(), 'public/js/scene-bundle.js');
    expect(existsSync(bundlePath)).toBe(true);
  });

  it('scene-bundle.js is a valid bundled file (not empty)', () => {
    const bundlePath = join(process.cwd(), 'public/js/scene-bundle.js');
    const stat = require('fs').statSync(bundlePath);
    expect(stat.size).toBeGreaterThan(100000); // > 100KB, bundled file
  });

  it('index.astro loads scene-bundle.js (not scene-init.js)', () => {
    const index = readFileSync(join(process.cwd(), 'src/pages/index.astro'), 'utf-8');
    expect(index).toMatch(/scene-bundle\.js/);
    expect(index).not.toMatch(/scene-init\.js/);
  });

  it('loader-boot.js exists as standalone module', () => {
    const path = join(process.cwd(), 'public/js/loader-boot.js');
    expect(existsSync(path)).toBe(true);
  });
});
