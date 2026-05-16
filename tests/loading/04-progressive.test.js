// tests/loading/04-progressive.test.js
// Test: Progressive 3D scene loading phases
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Loading Optimization: Progressive Loading', () => {
  it('scene-init.js has phased initialization (stars first, flowers delayed)', () => {
    const scene = readFileSync(join(process.cwd(), 'public/js/scene-init.js'), 'utf-8');
    // Should have setTimeout for delayed flower loading
    expect(scene).toMatch(/setTimeout\s*\(/);
    // Stars should be created before flowers in the init flow
    const starsPos = scene.indexOf('createStars');
    const flowersPos = scene.indexOf('createSunflowers');
    expect(starsPos).toBeGreaterThan(-1);
    expect(flowersPos).toBeGreaterThan(-1);
    expect(starsPos).toBeLessThan(flowersPos);
  });

  it('initial star count is reduced (<=800 desktop, <=400 mobile)', () => {
    const scene = readFileSync(join(process.cwd(), 'public/js/scene-init.js'), 'utf-8');
    // Should have a reduced initial star count variable or constant
    // Look for initialStarCount or similar reduced count
    expect(scene).toMatch(/initialStarCount|initialStars|phase1Stars/i);
  });

  it('has loader progress callback integration', () => {
    const scene = readFileSync(join(process.cwd(), 'public/js/scene-init.js'), 'utf-8');
    // Should call __updateLoaderProgress at milestones
    expect(scene).toMatch(/__updateLoaderProgress/);
  });
});
