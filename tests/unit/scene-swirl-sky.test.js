/**
 * scene-swirl-sky.test.js — Unit tests for scene swirl sky module
 *
 * Tests cover:
 * - createSwirlSky is exported and is a function
 * - setSwirlSkyColors is exported and is a function
 * - Module imports from correct relative paths (static analysis)
 * - _hash() function: deterministic pseudo-random hash in [0, 1]
 * - createSwirlSky: creates inverted sphere geometry (radius 80, 48x48 segments)
 * - ShaderMaterial with custom vertex and fragment shaders
 * - Vertex shader: swirl rotation, multi-octave noise displacement
 * - Fragment shader: base color, highlight color, warm noise, pulsing brightness
 * - Sky dome render order: -999 (behind everything)
 * - frustumCulled: false (always visible)
 * - BackSide rendering for inverted sphere
 * - depthWrite: false on material
 * - userData.animate updates uTime uniform each frame
 * - setSwirlSkyColors: updates uBaseColor and uHighlightColor uniforms
 * - Uniforms: uTime, uSwirlSpeed (0.08), uBaseColor, uHighlightColor
 *
 * Note: Full import of scene-swirl-sky.js triggers THREE.js ESM imports
 * from esm.sh which are unavailable in the vitest/jsdom environment.
 * These tests verify the module structure via static analysis instead.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const SWIRL_PATH = join(
  import.meta.dirname,
  '..',
  '..',
  'src',
  'js',
  'scene',
  'scene-swirl-sky.js'
);

// ─── Module Structure Tests ──────────────────────────────────────────

describe('scene-swirl-sky module', () => {
  it('exports createSwirlSky function', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/export\s+function\s+createSwirlSky/);
  });

  it('exports setSwirlSkyColors function', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/export\s+function\s+setSwirlSkyColors/);
  });

  it('imports THREE from "three"', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/import\s+\*\s+as\s+THREE\s+from\s+["']three["']/);
  });

  it('has JSDoc module documentation', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/@module\s+scene-swirl-sky/);
  });
});

// ─── Hash Function Tests ─────────────────────────────────────────────

describe('_hash function', () => {
  it('_hash is defined as a function', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/function\s+_hash\s*\(/);
  });

  it('_hash uses Math.sin for pseudo-random generation', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/Math\.sin\(n\)/);
  });

  it('_hash returns value in [0, 1] using fract-like operation', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/x\s*-\s*Math\.floor\(x\)/);
  });

  it('_hash uses seed multiplier 43758.5453', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/43758\.5453/);
  });
});

// ─── Sphere Geometry Tests ───────────────────────────────────────────

describe('sphere geometry', () => {
  it('creates sphere with radius 80', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/SphereGeometry\(80,\s*48,\s*48\)/);
  });

  it('uses 48 segments for both width and height', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/48,\s*48/);
  });

  it('creates a THREE.Mesh from sphere geometry and shader material', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/new\s+THREE\.Mesh\(skyGeo,\s*skyMat\)/);
  });
});

// ─── Shader Material Tests ───────────────────────────────────────────

describe('shader material', () => {
  it('uses ShaderMaterial', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/THREE\.ShaderMaterial/);
  });

  it('uses custom vertex shader (swirlSkyVS)', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/vertexShader:\s*swirlSkyVS/);
  });

  it('uses custom fragment shader (swirlSkyFS)', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/fragmentShader:\s*swirlSkyFS/);
  });

  it('uses BackSide for inverted sphere rendering', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/side:\s*THREE\.BackSide/);
  });

  it('has depthWrite false', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/depthWrite:\s*false/);
  });
});

// ─── Uniform Tests ───────────────────────────────────────────────────

describe('shader uniforms', () => {
  it('has uTime uniform', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/uTime:\s*\{\s*value:\s*0\s*\}/);
  });

  it('has uSwirlSpeed uniform set to 0.08', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/uSwirlSpeed:\s*\{\s*value:\s*0\.08\s*\}/);
  });

  it('has uBaseColor uniform initialized to deep blue (0x0a0a1e)', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/uBaseColor:\s*\{\s*value:\s*new\s+THREE\.Color\(0x0a0a1e\)\s*\}/);
  });

  it('has uHighlightColor uniform initialized to 0x0d1028', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/uHighlightColor:\s*\{\s*value:\s*new\s+THREE\.Color\(0x0d1028\)\s*\}/);
  });

  it('vertex shader declares uTime and uSwirlSpeed uniforms', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/uniform\s+float\s+uTime/);
    expect(src).toMatch(/uniform\s+float\s+uSwirlSpeed/);
  });

  it('fragment shader declares uTime, uBaseColor, uHighlightColor uniforms', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/uniform\s+vec3\s+uBaseColor/);
    expect(src).toMatch(/uniform\s+vec3\s+uHighlightColor/);
  });
});

// ─── Vertex Shader Tests ─────────────────────────────────────────────

describe('vertex shader', () => {
  it('declares varying vWorldPos and vNormal', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/varying\s+vec3\s+vWorldPos/);
    expect(src).toMatch(/varying\s+vec3\s+vNormal/);
  });

  it('defines inline _hash function for GLSL', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/float\s+_hash\s*\(\s*vec3\s+p\s*\)/);
  });

  it('defines noise3D function using hash', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/float\s+noise3D\s*\(\s*vec3\s+p\s*\)/);
  });

  it('applies rotational swirl around Y axis', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/swirlAngle\s*=\s+uTime\s*\*\s+uSwirlSpeed/);
    expect(src).toMatch(/cos\(swirlAngle\)/);
    expect(src).toMatch(/sin\(swirlAngle\)/);
  });

  it('swirl angle depends on elevation (height)', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/elevation\s*=\s*normalizedPos\.y/);
    expect(src).toMatch(/0\.3\s*\+\s*elevation\s*\*\s*0\.7/);
  });

  it('uses multi-octave noise (3 octaves)', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    // Large scale: 0.08 frequency
    expect(src).toMatch(/swirledPos \* 0\.08/);
    // Medium scale: 0.15 frequency
    expect(src).toMatch(/swirledPos \* 0\.15/);
    // Small scale: 0.3 frequency  
    expect(src).toMatch(/swirledPos \* 0\.3/);
  });

  it('applies band factor for displacement bias', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/bandFactor/);
    expect(src).toMatch(/sin\(elevation\s*\*\s*3\.14159\s*\*\s*4\.0/);
  });

  it('displaces vertices along normalized position (inward)', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/pos\s*-\s*normalizedPos\s*\*\s*displacement/);
  });

  it('uses smoothstep interpolation for noise (f * f * (3 - 2f))', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/f\s*\*\s*f\s*\*\s*\(\s*3\.0\s*-\s*2\.0\s*\*\s*f\s*\)/);
  });
});

// ─── Fragment Shader Tests ───────────────────────────────────────────

describe('fragment shader', () => {
  it('computes elevation gradient from world position', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/normalize\(vWorldPos\)\.y/);
  });

  it('uses smoothstep for elevation gradient', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/smoothstep\(-0\.3,\s*0\.6,\s*elevation\)/);
  });

  it('mixes base color with highlight based on gradient', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/mix\(uBaseColor,\s*uHighlightColor,\s*gradient\s*\*\s*0\.3\)/);
  });

  it('adds warm noise glow variation', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/warmNoise/);
    expect(src).toMatch(/vec3\(0\.01,\s*0\.005,\s*0\.0\)/);
  });

  it('applies slow pulsing brightness (sin uTime * 0.15)', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/uTime \* 0\.15/);
  });

  it('pulsing brightness amplitude is 3% (0.03)', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/0\.03 \* sin/);
  });

  it('outputs with alpha 1.0', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/vec4\(color,\s*1\.0\)/);
  });
});

// ─── Sky Dome Render Settings Tests ──────────────────────────────────

describe('sky dome render settings', () => {
  it('renderOrder is -999 (lowest, behind everything)', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/skyDome\.renderOrder\s*=\s*-999/);
  });

  it('frustumCulled is false (always visible)', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/skyDome\.frustumCulled\s*=\s*false/);
  });

  it('sky dome is added to scene', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/scene\.add\(skyDome\)/);
  });
});

// ─── Animation Tests ─────────────────────────────────────────────────

describe('animation', () => {
  it('updates uTime uniform via userData.animate', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/skyDome\.userData\.animate/);
    expect(src).toMatch(/o\.material\.uniforms\.uTime\.value\s*=\s*t/);
  });
});

// ─── Return Value Tests ──────────────────────────────────────────────

describe('createSwirlSky return value', () => {
  it('returns an object with mesh and material', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/return\s*\{\s*mesh:\s*skyDome,\s*material:\s*skyMat\s*\}/);
  });
});

// ─── setSwirlSkyColors Tests ─────────────────────────────────────────

describe('setSwirlSkyColors function', () => {
  it('takes material and colors parameters', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/function\s+setSwirlSkyColors\s*\(\s*material,\s*colors\s*\)/);
  });

  it('guards against missing material or uniforms', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/if\s*\(\s*!material\s*\|\|\s*!material\.uniforms\s*\)\s*return/);
  });

  it('updates uBaseColor when colors.baseColor is provided', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/if\s*\(\s*colors\.baseColor\s*\)/);
    expect(src).toMatch(/material\.uniforms\.uBaseColor\.value\.set\(colors\.baseColor\)/);
  });

  it('updates uHighlightColor when colors.highlightColor is provided', () => {
    const src = readFileSync(SWIRL_PATH, 'utf-8');
    expect(src).toMatch(/if\s*\(\s*colors\.highlightColor\s*\)/);
    expect(src).toMatch(/material\.uniforms\.uHighlightColor\.value\.set\(colors\.highlightColor\)/);
  });
});
