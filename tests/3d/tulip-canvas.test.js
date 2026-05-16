// tests/3d/tulip-canvas.test.js
// Red-phase tests: Verify makeTulipCanvas produces valid canvas output
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Tulip Canvas Rendering (idea-019)', () => {
  const sceneInit = readFileSync(join(process.cwd(), 'public/js/scene-init.js'), 'utf-8');

  it('makeTulipCanvas function exists', () => {
    expect(sceneInit).toMatch(/function makeTulipCanvas\s*\(/);
  });

  it('makeTulipCanvas accepts size, color, isOpen parameters', () => {
    expect(sceneInit).toMatch(/function makeTulipCanvas\s*\(\s*size\s*,\s*color\s*,\s*isOpen\s*\)/);
  });

  it('makeTulipCanvas creates a canvas element', () => {
    expect(sceneInit).toMatch(/document\.createElement\s*\(\s*['"]canvas['"]\s*\)/);
  });

  it('makeTulipCanvas returns a canvas', () => {
    // Function should end with returning the canvas
    const funcMatch = sceneInit.match(/function makeTulipCanvas[\s\S]*?^}/m);
    expect(funcMatch).toBeTruthy();
    expect(funcMatch[0]).toMatch(/return\s+c\s*;/);
  });

  it('canvas has width and height set to size parameter', () => {
    expect(sceneInit).toMatch(/c\.width\s*=\s*size/);
    expect(sceneInit).toMatch(/c\.height\s*=\s*size/);
  });

  it('parses hex color to RGB components', () => {
    expect(sceneInit).toMatch(/parseInt\s*\(\s*hexColor/);
  });
});
