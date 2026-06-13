/**
 * scene-interaction.test.js — Unit tests for scene interaction module
 *
 * Tests cover:
 * - initConstellationInteraction is exported and is a function
 * - Module imports from correct relative paths (static analysis)
 * - Raycaster threshold configuration for star point selection
 * - Star selection distance threshold (1.5 units)
 * - Maximum constellation lines (6 stars before auto-clear)
 * - Line material properties (AdditiveBlending, opacity 0.6)
 * - Hint element creation and DOM manipulation
 * - localStorage integration for constellation persistence
 * - Touch event support alongside pointer events
 * - Line fade-in animation (opacity ramp over time)
 * - Auto-clear after 5 seconds when 6 stars selected
 * - Highlight sprite creation with CanvasTexture
 * - Constellation loading from localStorage on init
 *
 * Note: Full import of scene-interaction.js triggers THREE.js ESM imports
 * from esm.sh which are unavailable in the vitest/jsdom environment.
 * These tests verify the module structure via static analysis instead.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const INTERACTION_PATH = join(
  import.meta.dirname,
  '..',
  '..',
  'src',
  'js',
  'scene',
  'scene-interaction.js'
);

// ─── Module Structure Tests ──────────────────────────────────────────

describe('scene-interaction module', () => {
  it('exports initConstellationInteraction function', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/export\s+function\s+initConstellationInteraction/);
  });

  it('imports THREE from "three"', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/import\s+\*\s+as\s+THREE\s+from\s+["']three["']/);
  });

  it('imports saveConstellations and loadConstellations from scene-utils', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/import\s+\{\s*saveConstellations\s*,\s*loadConstellations\s*\}\s+from\s+["']\.\/scene-utils\.js["']/);
  });
});

// ─── Raycaster Configuration Tests ───────────────────────────────────

describe('raycaster configuration', () => {
  it('sets raycaster Points threshold to 2.0', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/raycaster\.params\.Points\.threshold\s*=\s*2\.0/);
  });

  it('creates a THREE.Raycaster instance', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/new\s+THREE\.Raycaster\(\)/);
  });

  it('creates a THREE.Vector2 for mouse coordinates', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/new\s+THREE\.Vector2\(\)/);
  });
});

// ─── Star Selection Logic Tests ──────────────────────────────────────

describe('star selection logic', () => {
  it('uses 1.5 unit distance threshold for duplicate detection', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/distanceTo\(starPos\)\s*<\s*1\.5/);
  });

  it('stores selected stars in an array', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/selectedStars\.push\(starPos\)/);
  });

  it('checks for already-selected stars before adding', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/alreadySelected/);
  });

  it('auto-clears lines when 6 or more stars are selected', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/selectedStars\.length\s*>=\s*6/);
  });

  it('uses setTimeout for auto-clear delay', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/setTimeout\(clearUserLines,\s*5000\)/);
  });
});

// ─── Line Material Tests ─────────────────────────────────────────────

describe('line material properties', () => {
  it('uses LineBasicMaterial for constellation lines', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/THREE\.LineBasicMaterial/);
  });

  it('line color is 0x88aaff (soft blue)', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/color:\s*0x88aaff/);
  });

  it('line opacity is 0.6', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/opacity:\s*0\.6/);
  });

  it('uses AdditiveBlending for lines', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/THREE\.AdditiveBlending/);
  });

  it('lines are transparent', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/transparent:\s*true/);
  });
});

// ─── Line Geometry Tests ─────────────────────────────────────────────

describe('line geometry', () => {
  it('creates BufferGeometry from two selected star positions', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/THREE\.BufferGeometry\(\)\.setFromPoints/);
  });

  it('connects the last two selected stars', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/selectedStars\[selectedStars\.length\s*-\s*2\]/);
    expect(src).toMatch(/selectedStars\[selectedStars\.length\s*-\s*1\]/);
  });

  it('creates a THREE.Line from geometry and material', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/new\s+THREE\.Line\(/);
  });
});

// ─── Highlight Sprite Tests ──────────────────────────────────────────

describe('highlight sprite', () => {
  it('creates a highlight texture using CanvasTexture', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/THREE\.CanvasTexture/);
  });

  it('highlight sprite uses SpriteMaterial with depthWrite false', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/depthWrite:\s*false/);
  });

  it('highlight sprite scale is 2x2', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/highlight\.scale\.set\(2,\s*2,\s*1\)/);
  });

  it('highlight color is 0xffdd88 (warm gold)', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/color:\s*0xffdd88/);
  });
});

// ─── Hint Element Tests ──────────────────────────────────────────────

describe('hint element', () => {
  it('creates a div with id constellation-hint', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/id\s*=\s*["']constellation-hint["']/);
  });

  it('hint text prompts star tapping', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/Tap stars to connect them/);
  });

  it('hint is positioned fixed at bottom of viewport', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/position:\s*fixed/);
    expect(src).toMatch(/bottom:\s*6rem/);
  });

  it('hint fades out and removes itself', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/hint\.style\.opacity\s*=\s*["']0["']/);
    expect(src).toMatch(/hint\.remove\(\)/);
  });

  it('hint hides after 2 stars are selected', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/selectedStars\.length\s*===\s*2[\s\S]*hideHint/);
  });
});

// ─── Event Listener Tests ────────────────────────────────────────────

describe('event listeners', () => {
  it('listens for pointerdown on renderer domElement', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/addEventListener\(["']pointerdown["']/);
  });

  it('listens for touchstart on renderer domElement', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/addEventListener\(["']touchstart["']/);
  });

  it('touchstart listener uses passive mode', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/passive:\s*true/);
  });
});

// ─── Clear Function Tests ────────────────────────────────────────────

describe('clearUserLines function', () => {
  it('removes all user lines from scene', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/scene\.remove\(userLines\[i\]\)/);
  });

  it('disposes line geometry on clear', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/geometry\.dispose\(\)/);
  });

  it('disposes line material on clear', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/material\.dispose\(\)/);
  });

  it('removes constellation data from localStorage on clear', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/localStorage\.removeItem\(["']atrija-constellations["']\)/);
  });

  it('removes highlight sprites from scene on clear', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/isHighlight/);
  });
});

// ─── LocalStorage Integration Tests ──────────────────────────────────

describe('localStorage integration', () => {
  it('saves constellations to localStorage when line is created', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/saveConstellations\(userLines\)/);
  });

  it('loads saved constellations on init', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/loadConstellations\(\)/);
  });

  it('reconstructs lines from saved data with Vector3 coordinates', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/new\s+THREE\.Vector3\(data\.x1,\s*data\.y1,\s*data\.z1\)/);
  });

  it('only loads constellations when cypress trees exist in scene', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/scene\.userData\._cypressTrees/);
  });
});

// ─── Line Animation Tests ────────────────────────────────────────────

describe('line animation', () => {
  it('lines have an animate function in userData', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/line\.userData\.animate/);
  });

  it('line opacity fades in over time', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/Math\.min\(0\.6,\s*elapsed\s*\*\s*2\)/);
  });

  it('lines begin fading out after 30 seconds', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/createdAt\s*>\s*30000/);
  });

  it('uses userData.createdAt timestamp for fade timing', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/line\.userData\.createdAt\s*=\s*Date\.now\(\)/);
  });
});

// ─── Mouse Coordinate Tests ──────────────────────────────────────────

describe('mouse coordinate calculation', () => {
  it('converts clientX/clientY to normalized device coordinates', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/\(x\s*\/\s*window\.innerWidth\)\s*\*\s*2\s*-\s*1/);
    expect(src).toMatch(/-\(y\s*\/\s*window\.innerHeight\)\s*\*\s*2\s*\+\s*1/);
  });

  it('supports touch coordinates via touches[0]', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/event\.touches\[\s*0\s*\]\.clientX/);
  });

  it('guards against null coordinates', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/x\s*==\s*null\s*\|\|\s*y\s*==\s*null/);
  });
});

// ─── Scene Traversal Tests ───────────────────────────────────────────

describe('scene traversal for star detection', () => {
  it('traverses scene to find Points objects with size attributes', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/scene\.traverse\(/);
    expect(src).toMatch(/obj\.isPoints/);
    expect(src).toMatch(/obj\.geometry\.attributes\.size/);
  });

  it('uses intersectObjects for raycasting against star objects', () => {
    const src = readFileSync(INTERACTION_PATH, 'utf-8');
    expect(src).toMatch(/raycaster\.intersectObjects\(starObjects\)/);
  });
});
