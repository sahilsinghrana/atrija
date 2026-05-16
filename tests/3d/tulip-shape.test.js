// tests/3d/tulip-shape.test.js
// Red-phase tests: Verify closed/open tulip shape differences
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Tulip Shape Differences (idea-019)', () => {
  const sceneInit = readFileSync(join(process.cwd(), 'public/js/scene-init.js'), 'utf-8');

  it('closed tulip uses cup/bud formation with layered petals', () => {
    // Should have distinct logic for closed tulips (isOpen === false)
    const funcMatch = sceneInit.match(/function makeTulipCanvas[\s\S]*?^}/m);
    expect(funcMatch).toBeTruthy();
    const funcBody = funcMatch[0];
    // Should check isOpen to differentiate rendering
    expect(funcBody).toMatch(/isOpen/);
  });

  it('closed tulip has height > width silhouette (cup shape)', () => {
    // The closed tulip should have petalH > petalW for cup shape
    const funcMatch = sceneInit.match(/function makeTulipCanvas[\s\S]*?^}/m);
    expect(funcMatch).toBeTruthy();
    const funcBody = funcMatch[0];
    // Should have asymmetric pointed petals for closed tulips
    expect(funcBody).toMatch(/tipOffset|asymmetric|pointed/);
  });

  it('open tulip has width > height silhouette (bloom shape)', () => {
    // The open tulip should have wider petals
    const funcMatch = sceneInit.match(/function makeTulipCanvas[\s\S]*?^}/m);
    expect(funcMatch).toBeTruthy();
    const funcBody = funcMatch[0];
    // Should have reflex amount for open tulips
    expect(funcBody).toMatch(/reflexAmount|reflex/);
  });

  it('closed tulip has inner and outer petal layers', () => {
    const funcMatch = sceneInit.match(/function makeTulipCanvas[\s\S]*?^}/m);
    expect(funcMatch).toBeTruthy();
    const funcBody = funcMatch[0];
    // Should differentiate back/front petals
    expect(funcBody).toMatch(/isBackPetal|backPetal|depthFactor/);
  });

  it('open tulip has wavy petal edges', () => {
    // Wavy edges via pWavyOffset in petal drawing
    expect(sceneInit).toMatch(/pWavyOffset/);
    expect(sceneInit).toMatch(/wavyOffset/);
  });
});
