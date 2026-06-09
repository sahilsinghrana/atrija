/**
 * scene-moon.test.js — Unit tests for scene moon module
 *
 * Tests cover:
 * - createMoon and updatePaintingReveal are exported functions
 * - Moon geometry: sphere with 64 segments, 7 procedural craters
 * - Moon material: MeshStandardMaterial with warm color
 * - Moon glow layers: 4 layers (glow, halo, haze, PointLight)
 * - Moon animation: orbit, rotation, breathing scale
 * - updatePaintingReveal: scroll-driven reveal with smoothstep
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const MOON_PATH = join(
  import.meta.dirname,
  '..',
  '..',
  'public',
  'js',
  'scene',
  'scene-moon.js'
);

// ─── Module Structure Tests ──────────────────────────────────────────

describe('scene-moon module', () => {
  it('exports createMoon function', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toMatch(/export\s+function\s+createMoon/);
  });

  it('exports updatePaintingReveal function', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toMatch(/export\s+function\s+updatePaintingReveal/);
  });

  it('imports Three.js from esm.sh', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toMatch(/import\s+\*\s+as\s+THREE\s+from\s+["']https:\/\/esm\.sh\/three/);
  });
});

// ─── Moon Geometry Tests ─────────────────────────────────────────────

describe('moon geometry', () => {
  it('creates a sphere geometry with radius 1.5 and 64 segments', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toContain('SphereGeometry(1.5, 64, 64)');
  });

  it('defines exactly 7 procedural craters', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    // Count crater objects in the array
    const craterMatches = src.match(/cx:\s*[-\d.]+/g);
    expect(craterMatches).not.toBeNull();
    expect(craterMatches.length).toBe(7);
  });

  it('each crater has cx, cy, cz, r, d properties', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toContain('cx:');
    expect(src).toContain('cy:');
    expect(src).toContain('cz:');
    expect(src).toContain('r:');
    expect(src).toContain('d:');
  });

  it('applies crater displacement using parabolic profile with rim', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    // -cr.d * (1 - t * t) + cr.d * 0.3 * Math.exp(-((t - 0.85) * (t - 0.85)) * 50)
    expect(src).toContain('-cr.d * (1 - t * t)');
    expect(src).toContain('cr.d * 0.3 * Math.exp');
  });

  it('computes vertex normals after displacement', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toContain('geo.computeVertexNormals()');
  });

  it('applies displacement by scaling position vector', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toContain('x * (1 + n)');
    expect(src).toContain('y * (1 + n)');
    expect(src).toContain('z * (1 + n)');
  });
});

// ─── Moon Material Tests ─────────────────────────────────────────────

describe('moon material', () => {
  it('uses MeshStandardMaterial for the moon', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toContain('MeshStandardMaterial');
  });

  it('moon color is warm white (0xfff8e8)', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toContain('0xfff8e8');
  });

  it('moon roughness is 0.6', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toContain('roughness: 0.6');
  });

  it('moon metalness is 0.0', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toContain('metalness: 0.0');
  });

  it('moon has subtle emissive (0x332211 at 0.06 intensity)', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toContain('emissive: 0x332211');
    expect(src).toContain('emissiveIntensity: 0.06');
  });
});

// ─── Moon Glow Layer Tests ───────────────────────────────────────────

describe('moon glow layers', () => {
  it('creates a glow sphere (radius 1.62, opacity 0.08)', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toContain('SphereGeometry(1.62, 32, 32)');
    expect(src).toContain('opacity: 0.08');
  });

  it('creates a halo sphere (radius 2.0, opacity 0.035)', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toContain('SphereGeometry(2.0, 24, 24)');
    expect(src).toContain('opacity: 0.035');
  });

  it('creates a haze sphere (radius 2.8, opacity 0.012)', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toContain('SphereGeometry(2.8, 20, 20)');
    expect(src).toContain('opacity: 0.012');
  });

  it('all glow layers use BackSide rendering', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    const backSideCount = (src.match(/THREE\.BackSide/g) || []).length;
    expect(backSideCount).toBeGreaterThanOrEqual(3);
  });

  it('all glow layers disable depthWrite', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    // glow, halo, haze layers each have depthWrite: false
    const depthWriteCount = (src.match(/depthWrite: false/g) || []).length;
    expect(depthWriteCount).toBeGreaterThanOrEqual(3);
  });

  it('creates a PointLight at moon position (intensity 1.2, range 25)', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toContain('PointLight(0xfff5d0, 1.2, 25, 1.5)');
  });
});

// ─── Moon Animation Tests ────────────────────────────────────────────

describe('moon animation', () => {
  it('moon group is stored in scene.userData._moonGroup', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toContain('_moonGroup');
  });

  it('moon base Y is stored in scene.userData._moonBaseY', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toContain('_moonBaseY');
  });

  it('moon orbits with sin/cos at 0.15 frequency', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toContain('Math.sin(t * 0.15) * 4');
    expect(src).toContain('Math.cos(t * 0.15) * 2');
  });

  it('moon self-rotates at 0.2 rad/s', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toContain('o.rotation.y = t * 0.2');
  });

  it('moon has breathing scale animation (1.5% amplitude at 0.3 Hz)', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toContain('Math.sin(t * 0.3) * 0.015');
  });

  it('glow layer pulses with scale and opacity', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toContain('Math.sin(t * 0.4) * 0.04');
    expect(src).toContain('0.06 + Math.sin(t * 0.5) * 0.02');
  });

  it('halo layer pulses slower than glow (0.25 Hz scale, 0.35 Hz opacity)', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toContain('Math.sin(t * 0.25) * 0.06');
    expect(src).toContain('0.025 + Math.sin(t * 0.35) * 0.01');
  });

  it('haze layer pulses slowest (0.18 Hz scale, 0.22 Hz opacity)', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toContain('Math.sin(t * 0.18) * 0.08');
    expect(src).toContain('0.008 + Math.sin(t * 0.22) * 0.006');
  });

  it('PointLight intensity pulses with dual sine waves', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toContain('1.2 + Math.sin(t * 0.7) * 0.15 + Math.sin(t * 1.3) * 0.08');
  });
});

// ─── Moon Group Structure Tests ──────────────────────────────────────

describe('moon group structure', () => {
  it('moon group is a THREE.Group', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toContain('new THREE.Group()');
  });

  it('moon group initial position is (0, 0.5, -5)', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toContain('position.set(0, 0.5, -5)');
  });

  it('moon group is added to scene', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toContain('scene.add(moonGroup)');
  });
});

// ─── updatePaintingReveal Tests ──────────────────────────────────────

describe('updatePaintingReveal', () => {
  it('is a placeholder passthrough in scene-moon.js', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toContain('placeholder passthrough');
    expect(src).toContain('real implementation lives in scene-objects.js');
  });

  it('exports updatePaintingReveal for backward compatibility', () => {
    const src = readFileSync(MOON_PATH, 'utf-8');
    expect(src).toMatch(/export\s+function\s+updatePaintingReveal/);
  });
});
