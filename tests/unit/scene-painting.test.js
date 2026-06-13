/**
 * scene-painting.test.js — Unit tests for scene painting reveal module
 *
 * Tests cover:
 * - createPaintingReveal is exported and is a function
 * - updatePaintingReveal is exported and is a function
 * - Module imports from correct relative paths (static analysis)
 * - PlaneGeometry dimensions: mobile (10x7), desktop (14x10)
 * - Segment count: low-end 10, normal 20
 * - Texture loading from Wikimedia Commons URL
 * - ShaderMaterial with paintingRevealVS and paintingRevealFS
 * - Uniforms: uTexture and uRevealProgress
 * - Plane position at (0, 1.5, -15)
 * - Scroll-driven reveal calculation using getBoundingClientRect
 * - Smoothstep easing function for progress interpolation
 * - State stored in scene.userData (_paintingPlane, _paintingRevealState)
 * - Progress clamped to [0, 1] range
 *
 * Note: Full import of scene-painting.js triggers THREE.js ESM imports
 * from esm.sh which are unavailable in the vitest/jsdom environment.
 * These tests verify the module structure via static analysis instead.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const PAINTING_PATH = join(
  import.meta.dirname,
  '..',
  '..',
  'src',
  'js',
  'scene',
  'scene-painting.js'
);

// ─── Module Structure Tests ──────────────────────────────────────────

describe('scene-painting module', () => {
  it('exports createPaintingReveal function', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/export\s+function\s+createPaintingReveal/);
  });

  it('exports updatePaintingReveal function', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/export\s+function\s+updatePaintingReveal/);
  });

  it('imports THREE from "three"', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/import\s+\*\s+as\s+THREE\s+from\s+["']three["']/);
  });

  it('imports paintingRevealVS and paintingRevealFS from scene-shaders', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/import\s+\{\s*paintingRevealVS\s*,\s*paintingRevealFS\s*\}\s+from\s+["']\.\/scene-shaders\.js["']/);
  });

  it('imports isMobile and isLowEnd from scene-config', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/import\s+\{\s*isMobile\s*,\s*isLowEnd\s*\}\s+from\s+["']\.\/scene-config\.js["']/);
  });
});

// ─── Geometry Tests ──────────────────────────────────────────────────

describe('plane geometry', () => {
  it('creates desktop plane geometry 14x10', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/isMobile\s*\?\s*10\s*:\s*14/);
    expect(src).toMatch(/isMobile\s*\?\s*7\s*:\s*10/);
  });

  it('uses 20 vertical segments on non-low-end devices', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/isLowEnd\s*\?\s*10\s*:\s*20/);
  });

  it('uses 1 vertical segment (width) for PlaneGeometry', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/PlaneGeometry\(width,\s*height,\s*1,\s*segs\)/);
  });

  it('creates a THREE.Mesh from plane geometry and shader material', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/new\s+THREE\.Mesh\(geo,\s*mat\)/);
  });
});

// ─── Texture Tests ───────────────────────────────────────────────────

describe('texture configuration', () => {
  it('loads texture from Wikimedia Commons URL', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/upload\.wikimedia\.org/);
  });

  it('uses 800px width for mobile, 1280px for desktop', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/isMobile\s*\?\s*["']800["']\s*:\s*["']1280["']/);
  });

  it('sets colorSpace to SRGBColorSpace', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/texture\.colorSpace\s*=\s*THREE\.SRGBColorSpace/);
  });

  it('sets minFilter to LinearFilter', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/texture\.minFilter\s*=\s*THREE\.LinearFilter/);
  });
});

// ─── Shader Material Tests ───────────────────────────────────────────

describe('shader material', () => {
  it('uses ShaderMaterial with paintingRevealVS vertex shader', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/THREE\.ShaderMaterial/);
    expect(src).toMatch(/vertexShader:\s*paintingRevealVS/);
  });

  it('uses paintingRevealFS fragment shader', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/fragmentShader:\s*paintingRevealFS/);
  });

  it('has uTexture uniform for the painting texture', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/uTexture:\s*\{\s*value:\s*texture\s*\}/);
  });

  it('has uRevealProgress uniform initialized to 0.0', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/uRevealProgress:\s*\{\s*value:\s*0\.0\s*\}/);
  });

  it('shader material is transparent', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/transparent:\s*true/);
  });

  it('shader material has depthWrite false', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/depthWrite:\s*false/);
  });
});

// ─── Plane Position Tests ────────────────────────────────────────────

describe('plane position', () => {
  it('plane is positioned at (0, 1.5, -15)', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/plane\.position\.set\(0,\s*1\.5,\s*-15\)/);
  });

  it('plane is visible by default', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/plane\.visible\s*=\s*true/);
  });

  it('plane is added to scene', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/scene\.add\(plane\)/);
  });
});

// ─── Scene UserData Tests ────────────────────────────────────────────

describe('scene user data storage', () => {
  it('stores painting plane in scene.userData._paintingPlane', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/scene\.userData\._paintingPlane\s*=\s*plane/);
  });

  it('initializes _paintingRevealState with section null and progress 0', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/scene\.userData\._paintingRevealState\s*=\s*\{\s*section:\s*null\s*,\s*progress:\s*0\s*\}/);
  });
});

// ─── Reveal Progress Calculation Tests ───────────────────────────────

describe('reveal progress calculation', () => {
  it('guards against missing _paintingRevealState', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/if\s*\(\s*!scene\.userData\._paintingRevealState\s*\)\s*return/);
  });

  it('caches section element reference', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/state\.section\s*=\s*document\.getElementById\(["']painting-reveal["']\)/);
  });

  it('guards against missing section element', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/if\s*\(\s*!state\.section\s*\)\s*return/);
  });

  it('calculates progress using getBoundingClientRect', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/state\.section\.getBoundingClientRect\(\)/);
  });

  it('progress formula: (vh - rect.top) / (vh + rect.height)', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/vh\s*-\s*rect\.top[\s\S]*\/\s*\(\s*vh\s*\+\s*rect\.height\s*\)/);
  });

  it('clamps progress to [0, 1] range', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/Math\.max\(0,\s*Math\.min\(1,\s*progress\)\)/);
  });

  it('applies smoothstep easing: progress * progress * (3 - 2 * progress)', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/progress\s*\*\s*progress\s*\*\s*\(\s*3\s*-\s*2\s*\*\s*progress\s*\)/);
  });

  it('updates uRevealProgress uniform on the plane material', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/plane\.material\.uniforms\.uRevealProgress\.value\s*=\s*progress/);
  });

  it('guards against missing plane material uniforms', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/if\s*\(\s*plane\s*&&\s*plane\.material\.uniforms\s*\)/);
  });

  it('stores progress in state.progress', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/state\.progress\s*=\s*progress/);
  });
});

// ─── Update Function Signature Tests ─────────────────────────────────

describe('updatePaintingReveal function', () => {
  it('takes scene as parameter', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/function\s+updatePaintingReveal\s*\(\s*scene\s*\)/);
  });
});

// ─── Create Function Signature Tests ─────────────────────────────────

describe('createPaintingReveal function', () => {
  it('takes scene as parameter', () => {
    const src = readFileSync(PAINTING_PATH, 'utf-8');
    expect(src).toMatch(/function\s+createPaintingReveal\s*\(\s*scene\s*\)/);
  });
});
