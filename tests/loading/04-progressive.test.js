// tests/loading/04-progressive.test.js
// Test: Progressive 3D scene loading phases
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Loading Optimization: Progressive Loading', () => {
  it('scene-init.js has phased initialization with setTimeout for delayed loading', () => {
    const scene = readFileSync(join(process.cwd(), 'public/js/scene-init.js'), 'utf-8');
    // Should have setTimeout for delayed flower loading
    expect(scene).toMatch(/setTimeout\s*\(/);
  });

  it('scene-init.js creates stars before flowers in the init section', () => {
    const scene = readFileSync(join(process.cwd(), 'public/js/scene-init.js'), 'utf-8');
    // Find the init section
    const initStart = scene.indexOf('// Phase 1');
    expect(initStart).toBeGreaterThan(-1);
    const initSection = scene.substring(initStart, initStart + 1000);
    const starsPos = initSection.indexOf('createStars');
    const flowersPos = initSection.indexOf('createSunflowers');
    expect(starsPos).toBeGreaterThan(-1);
    expect(flowersPos).toBeGreaterThan(-1);
    expect(starsPos).toBeLessThan(flowersPos);
  });

  it('initial star count is reduced (<=800 desktop, <=400 mobile)', () => {
    const scene = readFileSync(join(process.cwd(), 'public/js/scene-init.js'), 'utf-8');
    // Should have a reduced initial star count variable
    expect(scene).toMatch(/initialStarCount/);
    // Verify the values are reduced
    expect(scene).toMatch(/isLowEnd\s*\?\s*400\s*:\s*800/);
  });

  it('has loader progress callback integration', () => {
    const scene = readFileSync(join(process.cwd(), 'public/js/scene-init.js'), 'utf-8');
    // Should call __updateLoaderProgress at milestones
    expect(scene).toMatch(/__updateLoaderProgress/);
  });
});
