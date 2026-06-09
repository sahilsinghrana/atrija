/**
 * scene-flowers.test.js — Unit tests for scene flowers canvas module
 *
 * Tests cover:
 * - makeSunflowerCanvas, makeTulipCanvas, makeLilyCanvas are exported functions
 * - makeTulipStem, makeTulipCup are exported helper functions
 * - Sunflower: stem, leaves, 18 outer petals, 18 inner petals, seed disk, spiral seeds
 * - Tulip: stem with highlights, leaves with gradient, cup with base gradient, 6 petals in 2 layers
 * - Lily: stem, leaves, 6 petals with 3 variants, trumpet shape
 * - All functions use Canvas API and accept size parameters
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const FLOWERS_PATH = join(
  import.meta.dirname,
  '..',
  '..',
  'public',
  'js',
  'scene',
  'scene-flowers.js'
);

// ─── Module Structure Tests ──────────────────────────────────────────

describe('scene-flowers module', () => {
  it('exports makeSunflowerCanvas function', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toMatch(/export\s+function\s+makeSunflowerCanvas/);
  });

  it('exports makeTulipCanvas function', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toMatch(/export\s+function\s+makeTulipCanvas/);
  });

  it('exports makeLilyCanvas function', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toMatch(/export\s+function\s+makeLilyCanvas/);
  });

  it('exports makeTulipStem helper function', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toMatch(/export\s+function\s+makeTulipStem/);
  });

  it('exports makeTulipCup helper function', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toMatch(/export\s+function\s+makeTulipCup/);
  });

  it('imports _seededRand from scene-utils', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toMatch(/import\s+\{\s*_seededRand\s*\}\s+from\s+["']\.\/scene-utils\.js["']/);
  });
});

// ─── Sunflower Canvas Tests ──────────────────────────────────────────

describe('makeSunflowerCanvas', () => {
  it('creates a canvas element with given size', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('document.createElement("canvas")');
    expect(src).toContain('c.width = size');
    expect(src).toContain('c.height = size');
  });

  it('draws a stem with bezier curve', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('ctx.strokeStyle = "#2d5a1e"');
    expect(src).toContain('ctx.bezierCurveTo');
  });

  it('draws two leaves with gradient fill', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('"#3a7a2e"');
    expect(src).toContain('createLinearGradient');
    expect(src).toContain('ctx.fill()');
  });

  it('draws 18 outer petals in gold (#c8920a)', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('petalCount = 18');
    expect(src).toContain('"#c8920a"');
    expect(src).toContain('ctx.ellipse(0, -(r * 0.75), r * 0.13, r * 0.45, 0, 0, Math.PI * 2)');
  });

  it('draws 18 inner petals in brighter gold (#e8a020)', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('"#e8a020"');
    expect(src).toContain('r * 0.68');
  });

  it('draws seed disk with radial gradient (dark center)', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('createRadialGradient(cx, headCy, 0, cx, headCy, r * 0.3)');
    expect(src).toContain('"#3a1a00"');
    expect(src).toContain('"#1a0a00"');
  });

  it('draws 20 seeds in spiral pattern (golden angle)', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('i * 2.399963');
    expect(src).toContain('Math.sqrt(i / 20)');
  });

  it('returns the canvas element', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toMatch(/return\s+c\s*;\s*}/);
  });
});

// ─── Tulip Canvas Tests ──────────────────────────────────────────────

describe('makeTulipCanvas', () => {
  it('accepts size, color, openness, and seed parameters', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toMatch(/function\s+makeTulipCanvas\s*\(\s*size\s*,\s*color\s*,\s*openness\s*,\s*seed\s*\)/);
  });

  it('defaults size to 256, openness to 0.6, seed to 42', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('size || 256');
    expect(src).toContain('openness || 0.6');
    expect(src).toContain('seed || 42');
  });

  it('parses hex color to RGB components', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('color.replace("#", "")');
    expect(src).toContain('parseInt(hex.substring(0, 2), 16)');
    expect(src).toContain('parseInt(hex.substring(2, 4), 16)');
    expect(src).toContain('parseInt(hex.substring(4, 6), 16)');
  });

  it('computes dark and light color variants', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('Math.max(0, rr - 50)'); // dark R
    expect(src).toContain('Math.min(255, rr + 40)'); // light R
  });

  it('calls makeTulipStem for stem rendering', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('makeTulipStem(ctx, cx, size, stemTop, headCy, headR)');
  });

  it('calls makeTulipCup for cup/petal rendering', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('makeTulipCup(');
  });

  it('uses seeded PRNG for petal variation', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('_seededRand(seed)');
    expect(src).toContain('var rand = _seededRand(seed)');
  });
});

// ─── Tulip Stem Tests ────────────────────────────────────────────────

describe('makeTulipStem', () => {
  it('draws main stem with bezier curve in green (#2d5a1e)', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('ctx.strokeStyle = "#2d5a1e"');
    expect(src).toContain('ctx.lineWidth = size * 0.018');
  });

  it('draws highlight stem with lighter green', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('rgba(120,180,60,0.18)');
  });

  it('draws two leaves with linear gradient (dark to light green)', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('"#2d6a1e"');
    expect(src).toContain('"#4a8a30"');
    expect(src).toContain('createLinearGradient');
  });

  it('draws leaf midrib with subtle stroke', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('rgba(80,140,40,0.2)');
    expect(src).toContain('quadraticCurveTo');
  });
});

// ─── Tulip Cup Tests ─────────────────────────────────────────────────

describe('makeTulipCup', () => {
  it('draws cup shape with bezier curves', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('ctx.bezierCurveTo');
    expect(src).toContain('ctx.closePath');
  });

  it('fills cup with vertical gradient (dark at bottom, light at top)', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('createLinearGradient(cx, stemTop, cx, cupCY - cupH * 0.55)');
    expect(src).toContain('baseGrad');
  });

  it('draws 6 individual petals in 2 layers of 3', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toMatch(/layer\s*<\s*2/);
    expect(src).toMatch(/p\s*<\s*3/);
  });

  it('each petal has gradient fill with layer-specific colors', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('layer === 0');
    expect(src).toContain('pg.addColorStop');
  });

  it('draws inner ellipse for cup depth', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('ctx.ellipse');
    expect(src).toContain('rgba(20,40,10,0.25)');
  });

  it('draws stamens when openness > 0.3', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('openness > 0.3');
    expect(src).toContain('"#5a7a3a"'); // stamen color
    expect(src).toContain('"#c8a040"'); // anther color
  });

  it('draws 6 stamens with random lengths', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('s < 6');
    expect(src).toContain('cupH * (0.08 + rand() * 0.06)');
  });
});

// ─── Lily Canvas Tests ───────────────────────────────────────────────

describe('makeLilyCanvas', () => {
  it('accepts size, color, and variant parameters', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toMatch(/function\s+makeLilyCanvas\s*\(\s*size\s*,\s*color\s*,\s*variant\s*\)/);
  });

  it('defaults size to 160', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('size || 160');
  });

  it('draws stem in green (#2d6a1e)', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('"#2d6a1e"');
    expect(src).toContain('size * 0.035'); // line width
  });

  it('draws two leaves with bezier curves', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('"#3a7a2e"');
    expect(src).toContain('bezierCurveTo');
  });

  it('draws 6 petals', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('petalCount = 6');
    expect(src).toContain('p < petalCount');
  });

  it('has 3 variants with different spread/petal size', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('variant === 0');
    expect(src).toContain('variant === 1');
    // variant 2 is the else case
    expect(src).toContain('0.3'); // spread for variant 2
    expect(src).toContain('0.05'); // spread for variant 0
  });

  it('variant 0 has narrow petals (0.18 width ratio)', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('variant === 0 ? 0.18 : variant === 1 ? 0.25 : 0.32');
  });

  it('variant 0 has tall petals (1.1 height ratio)', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('variant === 0 ? 1.1 : variant === 1 ? 0.8 : 0.7');
  });

  it('computes petal color with lightness variation', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('pLightness');
    expect(src).toContain('Math.min(255, Math.max(0, rr + pLightness * 8))');
  });

  it('petals use bezier curves for trumpet shape', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('ctx.bezierCurveTo');
    expect(src).toContain('tipW = petalW * 1.3');
  });

  it('parses hex color to RGB for petal gradient', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('color.replace("#", "")');
    expect(src).toContain('parseInt(hexColor.substring(0, 2), 16)');
  });
});

// ─── Canvas API Usage Tests ──────────────────────────────────────────

describe('canvas API usage', () => {
  it('uses 2D context for all drawing', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('getContext("2d")');
  });

  it('uses save/restore for coordinate transforms', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('ctx.save()');
    expect(src).toContain('ctx.restore()');
  });

  it('uses translate/rotate for petal positioning', () => {
    const src = readFileSync(FLOWERS_PATH, 'utf-8');
    expect(src).toContain('ctx.translate');
    expect(src).toContain('ctx.rotate');
  });
});
