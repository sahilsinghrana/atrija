/**
 * scene-bootstrap.test.js — Unit tests for scene bootstrap module
 *
 * Tests cover:
 * - bootScene is exported and is a function
 * - Module imports from correct relative paths (static analysis)
 *
 * Note: Full import of scene-bootstrap.js triggers THREE.js ESM imports
 * from esm.sh which are unavailable in the vitest/jsdom environment.
 * These tests verify the module structure via static analysis instead.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const BOOTSTRAP_PATH = join(
  import.meta.dirname,
  '..',
  '..',
  'public',
  'js',
  'scene',
  'scene-bootstrap.js'
);

// ─── Module Structure Tests ──────────────────────────────────────────

describe('scene-bootstrap module', () => {
  it('exports bootScene function', () => {
    const src = readFileSync(BOOTSTRAP_PATH, 'utf-8');
    expect(src).toMatch(/export\s+function\s+bootScene/);
  });

  it('bootScene takes no parameters', () => {
    const src = readFileSync(BOOTSTRAP_PATH, 'utf-8');
    expect(src).toMatch(/function\s+bootScene\s*\(\s*\)/);
  });

  it('imports VanGoghScene from scene-manager', () => {
    const src = readFileSync(BOOTSTRAP_PATH, 'utf-8');
    expect(src).toMatch(/import\s+\{\s*VanGoghScene\s*\}\s+from\s+["']\.\/scene-manager\.js["']/);
  });

  it('imports all core creation functions from scene-objects', () => {
    const src = readFileSync(BOOTSTRAP_PATH, 'utf-8');
    const requiredImports = [
      'createStars', 'createWaves', 'createCypressTrees',
      'createPaintingReveal', 'createSunflowers', 'createLilies',
      'createTulips', 'createFlute', 'createMusicNotes',
      'createFireflies', 'createConstellations', 'createShootingStars',
      'initConstellationInteraction', 'spawnNotesBurst',
    ];
    for (const imp of requiredImports) {
      expect(src).toContain(imp);
    }
  });

  it('imports moon utilities from scene-utils', () => {
    const src = readFileSync(BOOTSTRAP_PATH, 'utf-8');
    expect(src).toContain('getMoonPhase');
    expect(src).toContain('getMoonPhaseName');
    expect(src).toContain('getMoonEmoji');
  });

  it('imports device detection from scene-config', () => {
    const src = readFileSync(BOOTSTRAP_PATH, 'utf-8');
    expect(src).toContain('isMobile');
    expect(src).toContain('isLowEnd');
    expect(src).toContain('_parallaxObserver');
  });

  it('imports createMoon from scene-moon', () => {
    const src = readFileSync(BOOTSTRAP_PATH, 'utf-8');
    expect(src).toMatch(/import\s+\{\s*createMoon\s*\}\s+from\s+["']\.\/scene-moon\.js["']/);
  });

  it('uses try-catch for error handling', () => {
    const src = readFileSync(BOOTSTRAP_PATH, 'utf-8');
    expect(src).toMatch(/try\s*\{[\s\S]*catch\s*\(/);
  });

  it('references canvas-container element', () => {
    const src = readFileSync(BOOTSTRAP_PATH, 'utf-8');
    expect(src).toContain('canvas-container');
  });

  it('references loader element', () => {
    const src = readFileSync(BOOTSTRAP_PATH, 'utf-8');
    expect(src).toContain('loader');
  });

  it('uses requestAnimationFrame for loader hide', () => {
    const src = readFileSync(BOOTSTRAP_PATH, 'utf-8');
    expect(src).toContain('requestAnimationFrame');
  });

  it('uses setTimeout for delayed flower loading', () => {
    const src = readFileSync(BOOTSTRAP_PATH, 'utf-8');
    expect(src).toMatch(/setTimeout\s*\(/);
  });

  it('respects isLowEnd for reduced geometry', () => {
    const src = readFileSync(BOOTSTRAP_PATH, 'utf-8');
    // Should have conditional logic based on isLowEnd
    expect(src).toMatch(/isLowEnd\s*\?/);
  });
});
