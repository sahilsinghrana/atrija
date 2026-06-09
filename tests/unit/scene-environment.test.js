/**
 * scene-environment.test.js — Unit tests for scene environment module
 *
 * Tests cover:
 * - createWaves, createCypressTrees, createFireflies are exported functions
 * - Wave shader: PlaneGeometry with segments, wave uniforms
 * - Cypress trees: ExtrudeGeometry from Shape, bevel settings, sway animation
 * - Fireflies: BufferGeometry with position/phase/pulseSpeed attributes, damped random walk
 * - Mobile optimizations: reduced segments, count, geometry complexity
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const ENV_PATH = join(
  import.meta.dirname,
  '..',
  '..',
  'public',
  'js',
  'scene',
  'scene-environment.js'
);

// ─── Module Structure Tests ──────────────────────────────────────────

describe('scene-environment module', () => {
  it('exports createWaves function', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toMatch(/export\s+function\s+createWaves/);
  });

  it('exports createCypressTrees function', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toMatch(/export\s+function\s+createCypressTrees/);
  });

  it('exports createFireflies function', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toMatch(/export\s+function\s+createFireflies/);
  });

  it('imports Three.js from esm.sh', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toMatch(/import\s+\*\s+as\s+THREE\s+from\s+["']https:\/\/esm\.sh\/three/);
  });

  it('imports wave and firefly shaders from scene-shaders', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toMatch(/import\s+\{\s*waveVS\s*,\s*waveFS\s*,\s*fireflyVS\s*,\s*fireflyFS\s*\}/);
  });

  it('imports device detection from scene-config', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toMatch(/isMobile\s*,\s*isLowEnd\s*,\s*scrollState/);
  });
});

// ─── Wave Tests ──────────────────────────────────────────────────────

describe('createWaves', () => {
  it('creates a PlaneGeometry with configurable segments', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('PlaneGeometry(30, 20, segs, segs)');
  });

  it('uses 32 segments on low-end, 64 on desktop', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('isLowEnd ? 32 : 64');
  });

  it('rotates plane by -PI*0.45 for angled view', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('rotateX(-Math.PI * 0.45)');
  });

  it('uses ShaderMaterial with wave vertex and fragment shaders', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('ShaderMaterial');
    expect(src).toContain('waveVS');
    expect(src).toContain('waveFS');
  });

  it('has wave uniforms: uTime, uWaveHeight, uWaveFrequency, uColor1/2/3', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('uTime');
    expect(src).toContain('uWaveHeight');
    expect(src).toContain('uWaveFrequency');
    expect(src).toContain('uColor1');
    expect(src).toContain('uColor2');
    expect(src).toContain('uColor3');
  });

  it('wave height is 0.3, frequency is 2.0', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('uWaveHeight: { value: 0.3 }');
    expect(src).toContain('uWaveFrequency: { value: 2.0 }');
  });

  it('uses DoubleSide rendering for waves', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('THREE.DoubleSide');
  });

  it('positions waves at (0, -2, 5)', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('position.set(0, -2, 5)');
  });

  it('animates wave via uTime uniform update', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('o.material.uniforms.uTime.value = t');
  });
});

// ─── Cypress Tree Tests ──────────────────────────────────────────────

describe('createCypressTrees', () => {
  it('creates cypress shape using THREE.Shape with bezier curves', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('new THREE.Shape()');
    expect(src).toContain('bezierCurveTo');
  });

  it('cypress shape has 6 bezier control points (tall flame shape)', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    const bezierMatches = src.match(/bezierCurveTo/g);
    expect(bezierMatches).not.toBeNull();
    expect(bezierMatches.length).toBeGreaterThanOrEqual(6);
  });

  it('uses ExtrudeGeometry with depth 0.15 and bevel', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('ExtrudeGeometry');
    expect(src).toContain('depth: 0.15');
    expect(src).toContain('bevelEnabled: true');
  });

  it('bevel settings: thickness 0.05, size 0.03, segments 1-2', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('bevelThickness: 0.05');
    expect(src).toContain('bevelSize: 0.03');
    expect(src).toContain('bevelSegments: isLowEnd ? 1 : 2');
  });

  it('uses dark material (0x0a0a12) with DoubleSide', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('0x0a0a12');
    expect(src).toContain('DoubleSide');
  });

  it('sets renderOrder to -1 (behind other elements)', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('renderOrder = -1');
  });

  it('defines 5 fixed tree positions', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    const posMatches = src.match(/x:\s*-?\d+/g);
    expect(posMatches).not.toBeNull();
    expect(posMatches.length).toBeGreaterThanOrEqual(5);
  });

  it('trees sway with sin animation at 0.3 Hz', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('Math.sin(t * 0.3 + ph) * 0.03');
  });

  it('trees respond to scroll via rotation.y', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('scrollState.current * 0.005');
  });

  it('non-low-end devices get vertex-level wind animation', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('!isLowEnd');
    expect(src).toContain('posAttr.needsUpdate = true');
  });

  it('stores trees in scene.userData._cypressTrees', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('_cypressTrees');
  });

  it('positions trees at y=-1.5', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('mesh.position.set(p.x, -1.5, p.z)');
  });
});

// ─── Firefly Tests ───────────────────────────────────────────────────

describe('createFireflies', () => {
  it('creates BufferGeometry with position, phase, pulseSpeed attributes', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('BufferGeometry');
    expect(src).toContain('position');
    expect(src).toContain('phase');
    expect(src).toContain('pulseSpeed');
  });

  it('distributes fireflies in a 24x8x18 volume', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('(Math.random() - 0.5) * 24'); // x spread
    expect(src).toContain('-1 + Math.random() * 7');     // y spread
    expect(src).toContain('-5 + Math.random() * 13');     // z spread
  });

  it('uses ShaderMaterial with firefly vertex and fragment shaders', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('fireflyVS');
    expect(src).toContain('fireflyFS');
  });

  it('uses AdditiveBlending for fireflies', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('AdditiveBlending');
  });

  it('firefly size is 5.0 mobile, 8.0 desktop', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('isMobile ? 5.0 : 8.0');
  });

  it('stores firefly data with basePositions and velocities', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('_fireflyData');
    expect(src).toContain('basePositions');
    expect(src).toContain('velocities');
  });

  it('fireflies use damped random walk (0.98 damping factor)', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('velocity.x *= 0.98');
    expect(src).toContain('velocity.y *= 0.98');
    expect(src).toContain('velocity.z *= 0.98');
  });

  it('fireflies reset to base position when exceeding 5 units distance', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('dist > 5');
    expect(src).toContain('pos[i * 3] = bx');
  });

  it('fireflies respond to mouse position (repel within 3 units)', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('mDist < 3.0');
    expect(src).toContain('velocity.x += (mdx / mDist) * 0.05');
  });

  it('mobile skips every other firefly per frame for performance', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('isMobile && i % 2 === t % 2');
  });

  it('stores fireflies in scene.userData._fireflies', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('_fireflies');
  });

  it('pulse speed ranges from 1.0 to 3.0', () => {
    const src = readFileSync(ENV_PATH, 'utf-8');
    expect(src).toContain('1.0 + Math.random() * 2.0');
  });
});
