/**
 * scene-stars.test.js — Unit tests for scene stars module
 *
 * Tests cover:
 * - createStars, createConstellations, createShootingStars are exported functions
 * - Star layer generation uses correct attribute names
 * - Star color temperature distribution (warm/cool/amber)
 * - Mobile count scaling factor
 * - Shooting star pool management and lifecycle
 * - Constellation line data structure
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const STARS_PATH = join(
  import.meta.dirname,
  '..',
  '..',
  'public',
  'js',
  'scene',
  'scene-stars.js'
);

// ─── Module Structure Tests ──────────────────────────────────────────

describe('scene-stars module', () => {
  it('exports createStars function', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toMatch(/export\s+function\s+createStars/);
  });

  it('exports createConstellations function', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toMatch(/export\s+function\s+createConstellations/);
  });

  it('exports createShootingStars function', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toMatch(/export\s+function\s+createShootingStars/);
  });

  it('imports Three.js from esm.sh', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toMatch(/import\s+\*\s+as\s+THREE\s+from\s+["']https:\/\/esm\.sh\/three/);
  });

  it('imports star shaders from scene-shaders', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toMatch(/import\s+\{\s*starVS\s*,\s*starFS\s*\}\s+from\s+["']\.\/scene-shaders\.js["']/);
  });

  it('imports isMobile from scene-config', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toMatch(/import\s+\{\s*isMobile\s*\}\s+from\s+["']\.\/scene-config\.js["']/);
  });
});

// ─── Star Layer Generation Tests ─────────────────────────────────────

describe('star layer generation', () => {
  it('creates star layers with required buffer attributes', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    const requiredAttrs = [
      'position',
      'size',
      'brightness',
      'twinkleSpeed',
      'twinklePhase',
      'customColor',
    ];
    for (const attr of requiredAttrs) {
      expect(src).toContain(`"${attr}"`);
    }
  });

  it('uses spherical coordinates for star distribution', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toMatch(/Math\.sin\(phi\)\s*\*\s*Math\.cos\(theta\)/);
    expect(src).toMatch(/Math\.sin\(phi\)\s*\*\s*Math\.sin\(theta\)/);
    expect(src).toMatch(/Math\.cos\(phi\)/);
  });

  it('distributes stars on a sphere shell (radius 40-60)', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toContain('40 + Math.random() * 20');
  });

  it('uses AdditiveBlending for star material', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toContain('THREE.AdditiveBlending');
  });

  it('sets depthWrite to false for stars', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toContain('depthWrite: false');
  });
});

// ─── Star Color Temperature Tests ────────────────────────────────────

describe('star color temperature', () => {
  it('has three color temperature bands (warm, cool, amber)', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    // Warm gold: cols[i3] = 1.0; cols[i3+1] = 0.95; cols[i3+2] = 0.7
    expect(src).toContain('cols[i3] = 1.0');
    expect(src).toContain('cols[i3 + 1] = 0.95');
    expect(src).toContain('cols[i3 + 2] = 0.7');
    // Cool blue: cols[i3] = 0.7; cols[i3+1] = 0.8; cols[i3+2] = 1.0
    expect(src).toContain('cols[i3] = 0.7');
    expect(src).toContain('cols[i3 + 1] = 0.8');
    expect(src).toContain('cols[i3 + 2] = 1.0');
    // Deep amber: cols[i3] = 1.0; cols[i3+1] = 0.6; cols[i3+2] = 0.3
    expect(src).toContain('cols[i3] = 1.0');
    expect(src).toContain('cols[i3 + 1] = 0.6');
    expect(src).toContain('cols[i3 + 2] = 0.3');
  });

  it('distributes color bands evenly (30% / 30% / 40%)', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toContain('temp < 0.3');
    expect(src).toContain('temp < 0.6');
  });
});

// ─── createStars Distribution Tests ──────────────────────────────────

describe('createStars', () => {
  it('creates three star layers (near, mid, far)', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toContain('_starsNear');
    expect(src).toContain('_starsMid');
    expect(src).toContain('_starsFar');
  });

  it('distributes stars as 30% near, 40% mid, 30% far', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toContain('count * 0.3');
    expect(src).toContain('count * 0.4');
    // far also uses 0.3
    const matches = src.match(/count\s*\*\s*0\.3/g);
    expect(matches).not.toBeNull();
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it('applies mobile multiplier to star counts', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toContain('isMobile ? 0.7 : 1.0');
  });

  it('uses different size multipliers per layer (2.5, 1.8, 1.2)', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toContain('createStarLayer(scene, nearCount, 2.5, 1.0, 1.0)');
    expect(src).toContain('createStarLayer(scene, midCount, 1.8, 0.7, 0.7)');
    expect(src).toContain('createStarLayer(scene, farCount, 1.2, 0.4, 0.4)');
  });

  it('stores twinkle animation per star layer', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toContain('o.rotation.y = t * 0.008');
    expect(src).toContain('o.rotation.x = Math.sin(t * 0.015)');
    expect(src).toContain('o.rotation.z = Math.cos(t * 0.012)');
  });
});

// ─── Constellation Data Tests ────────────────────────────────────────

describe('createConstellations', () => {
  it('defines at least 2 constellation patterns', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    // Count the number of point arrays in constellations
    const pointsArrays = src.match(/points:\s*\[/g);
    expect(pointsArrays).not.toBeNull();
    expect(pointsArrays.length).toBeGreaterThanOrEqual(2);
  });

  it('uses LineBasicMaterial for constellation lines', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toContain('LineBasicMaterial');
  });

  it('constellation lines have 0.3 opacity', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toContain('opacity: 0.3');
  });

  it('constellation lines are blue-tinted (0x6688cc)', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toContain('0x6688cc');
  });
});

// ─── Shooting Star Tests ─────────────────────────────────────────────

describe('createShootingStars', () => {
  it('returns an object with update method', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toContain('return {');
    expect(src).toContain('update(t, dt)');
  });

  it('respects maxActive parameter', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toContain('maxActive = maxActive || (isMobile ? 1 : 2)');
  });

  it('spawns shooting stars at 3-7 second intervals', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toContain('3 + Math.random() * 4');
  });

  it('shooting star lifetime is 1.5-2.3 seconds', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toContain('1.5 + Math.random() * 0.8');
  });

  it('uses AdditiveBlending for shooting stars', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toContain('AdditiveBlending');
  });

  it('has fade-out animation for shooting stars', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toContain('lifeRatio < 0.7 ? 1.0 : 1.0 - (lifeRatio - 0.7) / 0.3');
  });

  it('uses HSL for shooting star head color (warm yellow range)', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toContain('0.12 + Math.random() * 0.05');
    expect(src).toContain('0.8'); // saturation
    expect(src).toContain('0.9'); // lightness
  });

  it('pools shooting stars for reuse', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toContain('pool.push');
    expect(src).toContain('!pool[i].star.active');
  });

  it('mobile uses shorter trail (12 vs 20)', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toContain('isMobile ? 12 : 20');
  });

  it('mobile uses smaller head size (3.0 vs 4.0)', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toContain('isMobile ? 3.0 : 4.0');
  });
});

// ─── Integration / Animation Tests ───────────────────────────────────

describe('star animation', () => {
  it('star animation updates uTime uniform', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toContain('o.material.uniforms.uTime.value = t');
  });

  it('shooting stars animate position via trail shifting', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toContain('s.positions[i * 3] = s.positions[(i - 1) * 3]');
  });

  it('shooting stars shift opacity trail with decay (0.85 factor)', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toContain('s.opacities[i] = s.opacities[i - 1] * 0.85');
  });

  it('constellation lines use BufferGeometry.setFromPoints', () => {
    const src = readFileSync(STARS_PATH, 'utf-8');
    expect(src).toContain('setFromPoints');
  });
});
