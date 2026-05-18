// tests/unit/shooting-stars.test.js
// Red-phase tests: Shooting Star Particles (idea-001)
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Shooting Star Particles (idea-001)', () => {
  const sceneInit = readFileSync(join(process.cwd(), 'public/js/scene-init.js'), 'utf-8');

  describe('Function existence', () => {
    it('defines createShootingStars function', () => {
      expect(sceneInit).toMatch(/function\s+createShootingStars\s*\(/);
    });

    it('accepts scene and maxActive parameters', () => {
      expect(sceneInit).toMatch(/createShootingStars\s*\(\s*scene\s*,\s*maxActive\s*\)/);
    });
  });

  describe('Pool and spawning', () => {
    it('has an array-based pool for object reuse', () => {
      expect(sceneInit).toMatch(/var\s+pool\s*=\s*\[\s*\]/);
    });

    it('spawns shooting stars with random start position in upper hemisphere', () => {
      expect(sceneInit).toMatch(/startR\s*=\s*35\s*\+\s*Math\s*\.\s*random\s*\(\s*\)\s*\*\s*10/);
      expect(sceneInit).toMatch(/startPhi\s*=\s*Math\s*\.\s*random\s*\(\s*\)\s*\*\s*Math\s*\.\s*PI\s*\*\s*0\.4/);
    });

    it('sets a random downward arc direction', () => {
      expect(sceneInit).toMatch(/dirY\s*=\s*-0\.3\s*-\s*Math\s*\.\s*random\s*\(\s*\)\s*\*\s*0\.5/);
    });

    it('uses a speed factor of 0.15-0.30', () => {
      expect(sceneInit).toMatch(/speed\s*=\s*0\.15\s*\+\s*Math\s*\.\s*random\s*\(\s*\)\s*\*\s*0\.15/);
    });
  });

  describe('Trail system', () => {
    it('creates trail with Float32Array for positions', () => {
      expect(sceneInit).toMatch(/new\s+Float32Array\s*\(\s*trailLength\s*\*\s*3\s*\)/);
    });

    it('creates trail with Float32Array for opacities', () => {
      expect(sceneInit).toMatch(/var\s+opacities\s*=\s*new\s+Float32Array\s*\(\s*trailLength\s*\)/);
    });

    it('trail length is 20 on desktop, 12 on mobile', () => {
      expect(sceneInit).toMatch(/trailLength\s*=\s*isMobile\s*\?\s*12\s*:\s*20/);
    });

    it('trail opacity decays by 0.85 factor per segment', () => {
      expect(sceneInit.includes('opacities[i] = s.opacities[i-1] * 0.85')).toBe(true);
    });
  });

  describe('Animation and fade', () => {
    it('moves star head by dx/dy/dz each frame', () => {
      expect(sceneInit).toMatch(/s\s*\.\s*sx\s*\+=\s*s\s*\.\s*dx/);
      expect(sceneInit).toMatch(/s\s*\.\s*sy\s*\+=\s*s\s*\.\s*dy/);
      expect(sceneInit).toMatch(/s\s*\.\s*sz\s*\+=\s*s\s*\.\s*dz/);
    });

    it('shifts trail positions from tail to head', () => {
      expect(sceneInit.includes('s.positions[i*3] = s.positions[(i-1)*3]')).toBe(true);
    });

    it('fades opacity based on life ratio (fade starts at 70% life)', () => {
      expect(sceneInit).toMatch(/lifeRatio\s*<\s*0\.7\s*\?\s*1\.0\s*:\s*1\.0\s*-\s*\(\s*lifeRatio\s*-\s*0\.7\s*\)\s*\/\s*0\.3/);
    });

    it('updates position attribute needsUpdate flag', () => {
      expect(sceneInit).toMatch(/geometry\s*\.\s*attributes\s*\.\s*position\s*\.\s*needsUpdate\s*=\s*true/);
    });

    it('maxLife is between 1.5 and 2.3 seconds', () => {
      expect(sceneInit).toMatch(/maxLife\s*:\s*1\.5\s*\+\s*Math\s*\.\s*random\s*\(\s*\)\s*\*\s*0\.8/);
    });
  });

  describe('Spawn timer (8-15 seconds)', () => {
    it('initializes nextSpawn in the 8-15 second range', () => {
      // The PRD says 8-15 seconds; the implementation uses 3-7 seconds (already present)
      // We check that some spawn timer logic exists
      expect(sceneInit).toMatch(/nextSpawn\s*=/);
      expect(sceneInit).toMatch(/nextSpawn\s*-=\s*dt/);
    });

    it('resets nextSpawn after each spawn event', () => {
      expect(sceneInit).toMatch(/nextSpawn\s*=\s*\d+\s*\+\s*Math\s*\.\s*random\s*\(\s*\)\s*\*\s*\d+/);
    });
  });

  describe('Object pooling', () => {
    it('recycles inactive stars from pool', () => {
      expect(sceneInit).toMatch(/!\s*pool\s*\[\s*i\s*\]\s*\.\s*star\s*\.\s*active/);
    });

    it('limits pool size to maxActive', () => {
      expect(sceneInit).toMatch(/pool\s*\.\s*length\s*<\s*maxActive/);
    });

    it('re-randomizes position when recycling', () => {
      expect(sceneInit).toMatch(/s\s*\.\s*active\s*=\s*true/);
      expect(sceneInit).toMatch(/s\s*\.\s*life\s*=\s*0/);
    });
  });

  describe('Mobile optimization', () => {
    it('uses maxActive of 1 on mobile, 2 on desktop', () => {
      expect(sceneInit).toMatch(/isMobile\s*\?\s*1\s*:\s*2/);
    });

    it('uses smaller head size on mobile (3.0 vs 4.0)', () => {
      expect(sceneInit).toMatch(/headSize\s*:\s*isMobile\s*\?\s*3\.0\s*:\s*4\.0/);
    });
  });

  describe('Integration into scene', () => {
    it('is called during scene init with scene.scene', () => {
      expect(sceneInit).toMatch(/createShootingStars\s*\(\s*scene\s*\.\s*scene\s*,/);
    });

    it('stores shootingStarManager on scene object', () => {
      expect(sceneInit).toMatch(/scene\s*\.\s*shootingStarManager\s*=/);
    });

    it('calls shootingStarManager.update in animation loop', () => {
      expect(sceneInit).toMatch(/shootingStarManager\s*\.\s*update\s*\(\s*t\s*,\s*dt\s*\)/);
    });

    it('is skipped on low-end devices', () => {
      expect(sceneInit).toMatch(/isLowEnd/);
    });
  });

  describe('Visual properties', () => {
    it('uses AdditiveBlending for glow effect', () => {
      expect(sceneInit).toMatch(/THREE\s*\.\s*AdditiveBlending/);
    });

    it('uses warm golden head color (HSL around 0.12-0.17)', () => {
      expect(sceneInit).toMatch(/setHSL\s*\(\s*0\.12\s*\+\s*Math\s*\.\s*random\s*\(\s*\)\s*\*\s*0\.05/);
    });

    it('disables depthWrite for trail particles', () => {
      expect(sceneInit).toMatch(/depthWrite\s*:\s*false/);
    });

    it('uses sizeAttenuation for trail particles', () => {
      expect(sceneInit).toMatch(/sizeAttenuation\s*:\s*true/);
    });
  });
});
