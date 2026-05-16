// tests/loading/03-client-idle.test.js
// Test: scene-init.js uses client:idle or lazy-init approach
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Loading Optimization: client:idle Hydration', () => {
  it('scene-init.js script tag uses client:idle directive', () => {
    const index = readFileSync(join(process.cwd(), 'src/pages/index.astro'), 'utf-8');
    // Should have client:idle on the scene-init script tag
    expect(index).toMatch(/scene-init\.js[^>]*client:idle/);
  });

  it('scene-init.js script tag does NOT have is:inline', () => {
    const index = readFileSync(join(process.cwd(), 'src/pages/index.astro'), 'utf-8');
    // The scene-init script should NOT use is:inline (client:idle replaces it)
    const scriptMatch = index.match(/<script[^>]*scene-init\.js[^>]*>/);
    expect(scriptMatch).toBeTruthy();
    expect(scriptMatch[0]).not.toMatch(/is:inline/);
  });

  it('scene-lazy-init.js exists as fallback', () => {
    const fs = require('fs');
    const path = join(process.cwd(), 'public/js/scene-lazy-init.js');
    // This file should exist (created in Step 4)
    expect(fs.existsSync(path)).toBe(true);
  });
});
