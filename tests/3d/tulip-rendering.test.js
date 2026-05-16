// tests/3d/tulip-rendering.test.js
// Red-phase tests: Verify petal rendering improvements
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Tulip Petal Rendering (idea-019)', () => {
  const sceneInit = readFileSync(join(process.cwd(), 'public/js/scene-init.js'), 'utf-8');

  it('has a drawTulipPetal helper function', () => {
    expect(sceneInit).toMatch(/function drawTulipPetal\s*\(/);
  });

  it('drawTulipPetal accepts depthFactor and lightness params', () => {
    expect(sceneInit).toMatch(/function drawTulipPetal\s*\([^)]*depthFactor[^)]*lightness[^)]*\)/);
  });

  it('petals use 3-stop gradients', () => {
    const funcMatch = sceneInit.match(/function makeTulipCanvas[\s\S]*?^}/m);
    expect(funcMatch).toBeTruthy();
    const funcBody = funcMatch[0];
    // Should have 3 addColorStop calls in gradient
    const gradientMatches = funcBody.match(/addColorStop/g);
    expect(gradientMatches).toBeTruthy();
    expect(gradientMatches.length).toBeGreaterThanOrEqual(3);
  });

  it('petals have edge highlights', () => {
    // Edge highlights are in drawTulipPetal helper
    expect(sceneInit).toMatch(/edge highlight/i);
    expect(sceneInit).toMatch(/strokeStyle/);
  });

  it('petals have vein lines', () => {
    // Vein lines are in drawTulipPetal helper
    expect(sceneInit).toMatch(/vein line/i);
    expect(sceneInit).toMatch(/quadraticCurveTo/);
  });

  it('back petals are darker than front petals (depth shading)', () => {
    const funcMatch = sceneInit.match(/function makeTulipCanvas[\s\S]*?^}/m);
    expect(funcMatch).toBeTruthy();
    const funcBody = funcMatch[0];
    // Should have depthFactor < 1.0 for back petals
    expect(funcBody).toMatch(/isBackPetal.*0\.7|depthFactor.*0\.7/);
  });
});
