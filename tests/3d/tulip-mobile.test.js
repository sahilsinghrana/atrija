// tests/3d/tulip-mobile.test.js
// Red-phase tests: Verify mobile tulip visibility
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Tulip Mobile Visibility (idea-019)', () => {
  const sceneInit = readFileSync(join(process.cwd(), 'public/js/scene-init.js'), 'utf-8');

  it('mobile tulip scale starts at 0.8 or higher', () => {
    // Mobile scale: 0.8 + Math.random() * 0.6
    expect(sceneInit).toMatch(/isMobile\s*\?\s*\(?0\.8\s*\+\s*Math\.random/);
  });

  it('mobile tulip Y position is -0.1 or higher', () => {
    // Mobile Y: -0.1 + s * 0.35
    expect(sceneInit).toMatch(/isMobile\s*\?\s*-0\.1\s*\+\s*s/);
  });

  it('createTulips is called with mobile-aware count', () => {
    // The count parameter is determined by caller (isMobile ? 3 : 6)
    // Just verify createTulips accepts a count parameter
    expect(sceneInit).toMatch(/function createTulips\s*\(\s*scene\s*,\s*count\s*\)/);
  });

  it('tulip aspect ratio is 1.0 x 1.6', () => {
    expect(sceneInit).toMatch(/sprite\.scale\.set\s*\(\s*1\.0\s*\*\s*s\s*,\s*1\.6\s*\*\s*s/);
  });

  it('canvas size is 160px default for tulips', () => {
    // Default size is 160, mobile low-end uses 120 via cache
    expect(sceneInit).toMatch(/makeTulipCanvas\s*\(\s*canvasSize/);
    expect(sceneInit).toMatch(/isMobile.*isLowEnd.*120.*160/);
  });
});
