/**
 * scene-notes.test.js — Unit tests for scene notes (flute + music notes) module
 *
 * Tests cover:
 * - createFlute is exported and is a function
 * - createMusicNotes is exported and is a function
 * - spawnNotesBurst is exported and is a function
 * - Flute geometry: cylinder body, 6 finger holes, mouth piece
 * - Flute material: MeshStandardMaterial with gold color
 * - Flute position and rotation in scene
 * - Flute animation: gentle rotation and vertical bob
 * - Music note geometry: sphere head, cylinder stem, cone flag
 * - Music note colors: 5 distinct colors (gold, coral, blue, purple, teal)
 * - Music note animation: rise speed, rotation, drift, opacity pulse
 * - Mobile scale factor for music notes (1.2 mobile, 0.6 desktop)
 * - spawnNotesBurst creates SVG flute element at cursor position
 * - spawnNotesBurst creates floating note symbols (♪♫♩♬♭♮♯)
 * - spawnNotesBurst uses CSS animations (noteFloat)
 * - spawnNotesBurst auto-cleans DOM elements after timeout
 * - Module imports from correct relative paths (static analysis)
 *
 * Note: Full import of scene-notes.js triggers THREE.js ESM imports
 * from esm.sh which are unavailable in the vitest/jsdom environment.
 * These tests verify the module structure via static analysis instead.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const NOTES_PATH = join(
  import.meta.dirname,
  '..',
  '..',
  'src',
  'js',
  'scene',
  'scene-notes.js'
);

// ─── Module Structure Tests ──────────────────────────────────────────

describe('scene-notes module', () => {
  it('exports createFlute function', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/export\s+function\s+createFlute/);
  });

  it('exports createMusicNotes function', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/export\s+function\s+createMusicNotes/);
  });

  it('exports spawnNotesBurst function', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/export\s+function\s+spawnNotesBurst/);
  });

  it('imports THREE from "three"', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/import\s+\*\s+as\s+THREE\s+from\s+["']three["']/);
  });

  it('imports isMobile from scene-config', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/import\s+\{\s*isMobile\s*\}\s+from\s+["']\.\/scene-config\.js["']/);
  });
});

// ─── Flute Geometry Tests ────────────────────────────────────────────

describe('flute geometry', () => {
  it('creates flute body as CylinderGeometry(0.06, 0.06, 2.5, 12)', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/CylinderGeometry\(0\.06,\s*0\.06,\s*2\.5,\s*12\)/);
  });

  it('rotates flute body by Math.PI * 0.15', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/rotation\.z\s*=\s*Math\.PI\s*\*\s*0\.15/);
  });

  it('creates 6 finger holes as small cylinders', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/for\s*\(\s*let\s+i\s*=\s*0\s*;\s*i\s*<\s*6\s*;\s*i\+\+\s*\)/);
  });

  it('finger holes are spaced 0.25 units apart', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/-0\.8\s*\+\s*i\s*\*\s*0\.25/);
  });

  it('creates mouth piece as a separate cylinder', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/mouth\.position\.set\(0,\s*1\.35,\s*0\)/);
  });
});

// ─── Flute Material Tests ────────────────────────────────────────────

describe('flute material', () => {
  it('body uses MeshStandardMaterial with gold color 0xd4a833', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/color:\s*0xd4a833/);
  });

  it('body roughness is 0.3 and metalness is 0.6', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/roughness:\s*0\.3/);
    expect(src).toMatch(/metalness:\s*0\.6/);
  });

  it('finger holes are dark colored (0x1a1a1a)', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/color:\s*0x1a1a1a/);
  });

  it('mouth piece has higher metalness (0.7) than body', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/color:\s*0xc49833[\s\S]*?metalness:\s*0\.7/);
  });
});

// ─── Flute Position and Animation Tests ──────────────────────────────

describe('flute position and animation', () => {
  it('flute is positioned at (3, 1, -2)', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/group\.position\.set\(3,\s*1,\s*-2\)/);
  });

  it('flute rotation.y is -0.3', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/group\.rotation\.y\s*=\s*-0\.3/);
  });

  it('flute animates with gentle z rotation (sin wave)', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/Math\.sin\(t\s*\*\s*0\.2\)\s*\*\s*0\.05/);
  });

  it('flute animates with vertical bob (sin wave)', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/Math\.sin\(t\s*\*\s*0\.4\)\s*\*\s*0\.1/);
  });

  it('flute animation is stored in userData.animate', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/group\.userData\.animate/);
  });

  it('flute group is added to scene', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/scene\.add\(group\)/);
  });
});

// ─── Music Note Geometry Tests ────────────────────────────────────────

describe('music note geometry', () => {
  it('creates note head as SphereGeometry(0.06, 8, 8)', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/SphereGeometry\(0\.06,\s*8,\s*8\)/);
  });

  it('creates note stem as CylinderGeometry(0.008, 0.008, 0.2, 4)', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/CylinderGeometry\(0\.008,\s*0\.008,\s*0\.2,\s*4\)/);
  });

  it('creates note flag as ConeGeometry(0.04, 0.08, 4)', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/ConeGeometry\(0\.04,\s*0\.08,\s*4\)/);
  });

  it('each note is wrapped in a THREE.Group', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/new\s+THREE\.Group\(\)/);
  });

  it('all notes are added to a noteGroup', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/noteGroup\.add\(noteWrapper\)/);
  });
});

// ─── Music Note Color Tests ──────────────────────────────────────────

describe('music note colors', () => {
  it('uses 5 distinct note colors', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/0xffd54f/);  // gold
    expect(src).toMatch(/0xff8a65/);  // coral
    expect(src).toMatch(/0x4fc3f7/);  // blue
    expect(src).toMatch(/0xb388ff/);  // purple
    expect(src).toMatch(/0x80cbc4/);  // teal
  });

  it('note colors cycle with modulo (i % noteColors.length)', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/noteColors\[i\s*%\s*noteColors\.length\]/);
  });

  it('note material uses emissive with 0.4 intensity', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/emissiveIntensity:\s*0\.4/);
  });

  it('note material uses AdditiveBlending', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/THREE\.AdditiveBlending/);
  });

  it('note material has depthWrite false', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/depthWrite:\s*false/);
  });

  it('note material opacity is 0.7', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/opacity:\s*0\.7/);
  });
});

// ─── Music Note Animation Tests ──────────────────────────────────────

describe('music note animation', () => {
  it('notes rise with random speed (0.03-0.07)', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/0\.03\s*\+\s*Math\.random\(\)\s*\*\s*0\.04/);
  });

  it('notes drift horizontally with sine wave', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/Math\.sin\(t\s*\*\s*df\s*\+\s*dp\)\s*\*\s*da/);
  });

  it('notes rotate on Y axis with sine wave', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/o\.rotation\.y\s*=\s*Math\.sin\(t\s*\*\s*rsp\s*\+\s*rph\)\s*\*\s*0\.5/);
  });

  it('notes pulse opacity with sine wave', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/0\.3\s*\+\s*Math\.sin\(t\s*\*\s*2\s*\+\s*rph\)\s*\*\s*0\.35/);
  });

  it('notes reset to bottom when they exceed resetY', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/o\.position\.y\s*=\s*-4\s*-\s*Math\.random\(\)\s*\*\s*4/);
  });

  it('resetY is randomized between 5 and 9', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/5\s*\+\s*Math\.random\(\)\s*\*\s*4/);
  });
});

// ─── Music Note Scale Tests ──────────────────────────────────────────

describe('music note scale', () => {
  it('mobile scale factor is 1.2', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/isMobile\s*\?\s*1\.2\s*:\s*0\.6/);
  });

  it('desktop scale factor is 0.6', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/isMobile\s*\?\s*1\.2\s*:\s*0\.6/);
  });
});

// ─── Spawn Notes Burst Tests ─────────────────────────────────────────

describe('spawnNotesBurst function', () => {
  it('accepts cx, cy, and optional count parameter (default 6)', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/spawnNotesBurst\s*\(\s*cx\s*,\s*cy\s*,\s*count\s*=\s*6\s*\)/);
  });

  it('creates a div element for the flute SVG', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/document\.createElement\(["']div["']\)/);
  });

  it('flute element is positioned fixed at cursor', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/position:\s*fixed/);
    expect(src).toMatch(/z-index:\s*9998/);
  });

  it('flute animates in with scale and rotation', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/scale\(0\.5\)\s*rotate\(-8deg\)/);
    expect(src).toMatch(/scale\(1\)\s*rotate\(-2deg\)/);
  });

  it('flute fades out after 1500ms', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/setTimeout[\s\S]*?1500/);
  });

  it('flute element is removed from DOM after fade', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/fluteEl\.parentNode\.removeChild\(fluteEl\)/);
  });
});

// ─── Note Symbol Tests ───────────────────────────────────────────────

describe('floating note symbols', () => {
  it('uses 7 music symbol types', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/♪/);
    expect(src).toMatch(/♫/);
    expect(src).toMatch(/♩/);
    expect(src).toMatch(/♬/);
    expect(src).toMatch(/♭/);
    expect(src).toMatch(/♮/);
    expect(src).toMatch(/♯/);
  });

  it('uses 7 distinct CSS colors for note symbols', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/#ffd54f/);
    expect(src).toMatch(/#ff8a65/);
    expect(src).toMatch(/#4fc3f7/);
    expect(src).toMatch(/#b388ff/);
    expect(src).toMatch(/#80cbc4/);
    expect(src).toMatch(/#fff8e1/);
    expect(src).toMatch(/#ffcc80/);
  });

  it('note symbols are positioned fixed at cursor offset', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/position:\s*fixed/);
    expect(src).toMatch(/z-index:\s*9999/);
  });

  it('note symbols use noteFloat CSS animation for 2s', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/animation:\s*noteFloat\s*2s\s*ease-out\s*forwards/);
  });

  it('note symbols are removed after 2100ms', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/2100/);
  });

  it('note symbols are spawned with 70ms stagger', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/i\s*\*\s*70/);
  });

  it('note font size is randomized between 1.0 and 1.8rem', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/1\.0\s*\+\s*Math\.random\(\)\s*\*\s*0\.8/);
  });
});

// ─── Note Position Distribution Tests ────────────────────────────────

describe('note position distribution', () => {
  it('notes are randomly distributed in X (-9 to 9)', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/\(Math\.random\(\)\s*-\s*0\.5\)\s*\*\s*18/);
  });

  it('notes are randomly distributed in Y (-6 to 6)', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/\(Math\.random\(\)\s*-\s*0\.5\)\s*\*\s*12/);
  });

  it('notes are randomly distributed in Z (-7 to 7)', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/\(Math\.random\(\)\s*-\s*0\.5\)\s*\*\s*14/);
  });
});

// ─── Flute SVG Content Tests ─────────────────────────────────────────

describe('flute SVG content', () => {
  it('flute SVG uses linear gradient for bamboo texture', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/linearGradient/);
    expect(src).toMatch(/bambooGrad/);
  });

  it('flute SVG has highlight gradient', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/highlightGrad/);
  });

  it('flute SVG includes finger hole ellipses', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/ellipse[\s\S]*?fill=["']#1a1a1a/);
  });

  it('flute SVG includes mouth piece ellipse', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/ellipse[\s\S]*?fill=["']#3a2a1a/);
  });

  it('flute SVG includes tassel decoration', () => {
    const src = readFileSync(NOTES_PATH, 'utf-8');
    expect(src).toMatch(/#cc2244/);
  });
});
