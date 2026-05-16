// tests/3d/tulip-colors.test.js
// Red-phase tests: Verify tulip color palette has no yellows
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Tulip Color Palette (idea-019)', () => {
  const sceneInit = readFileSync(join(process.cwd(), 'public/js/scene-init.js'), 'utf-8');

  it('createTulips function exists with color array', () => {
    expect(sceneInit).toMatch(/function createTulips\s*\(/);
  });

  it('color array contains 14 colors', () => {
    // Extract the colors array from createTulips
    const funcMatch = sceneInit.match(/function createTulips[\s\S]*?var colors = \[([\s\S]*?)\];/);
    expect(funcMatch).toBeTruthy();
    const colorsStr = funcMatch[1];
    // Count hex color entries
    const colorMatches = colorsStr.match(/'#[0-9a-fA-F]{6}'/g);
    expect(colorMatches).toBeTruthy();
    expect(colorMatches.length).toBe(14);
  });

  it('no color in tulip palette is yellow (G>180 AND R>200 AND B<100)', () => {
    const funcMatch = sceneInit.match(/function createTulips[\s\S]*?var colors = \[([\s\S]*?)\];/);
    expect(funcMatch).toBeTruthy();
    const colorsStr = funcMatch[1];
    const colorMatches = colorsStr.match(/'#[0-9a-fA-F]{6}'/g);
    expect(colorMatches).toBeTruthy();

    for (const colorStr of colorMatches) {
      const hex = colorStr.replace(/'/g, '').replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const isYellow = g > 180 && r > 200 && b < 100;
      expect(isYellow).toBe(false);
    }
  });

  it('palette includes red variants', () => {
    // Should have at least one vivid red and one deep red
    expect(sceneInit).toMatch(/'#e84040'/);  // vivid red
    expect(sceneInit).toMatch(/'#d41a1a'/);  // deep red
  });

  it('palette includes pink/rose variants', () => {
    expect(sceneInit).toMatch(/'#f05090'/);  // pink
    expect(sceneInit).toMatch(/'#d03070'/);  // rose
  });

  it('palette includes purple/violet variants', () => {
    expect(sceneInit).toMatch(/'#9040d0'/);  // purple
    expect(sceneInit).toMatch(/'#a030c0'/);  // violet
  });

  it('palette includes coral/vermillion variants', () => {
    expect(sceneInit).toMatch(/'#f06030'/);  // coral
    expect(sceneInit).toMatch(/'#e05020'/);  // vermillion
  });

  it('palette does NOT contain golden yellow, amber, or soft gold', () => {
    // These are the yellow colors that should be removed from tulip palette
    // Check only within the tulip colors array in createTulips
    const funcMatch = sceneInit.match(/function createTulips[\s\S]*?var colors = \[([\s\S]*?)\];/);
    expect(funcMatch).toBeTruthy();
    const colorsStr = funcMatch[1];
    expect(colorsStr).not.toMatch(/'#e8a020'/);  // golden yellow
    expect(colorsStr).not.toMatch(/'#d4901a'/);  // amber
    expect(colorsStr).not.toMatch(/'#f0c040'/);  // soft gold
  });
});
