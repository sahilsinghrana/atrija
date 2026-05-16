// tests/3d/tulip-random.test.js
// Red-phase tests: Verify per-tulip randomization
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Tulip Randomization (idea-019)', () => {
  const sceneInit = readFileSync(join(process.cwd(), 'public/js/scene-init.js'), 'utf-8');

  it('petal count is randomized between 5-7', () => {
    // Should have: 5 + Math.floor(Math.random() * 3)
    expect(sceneInit).toMatch(/5\s*\+\s*Math\.floor\s*\(\s*Math\.random\s*\(\s*\)\s*\*\s*3\s*\)/);
  });

  it('has curlFactor randomization', () => {
    expect(sceneInit).toMatch(/curlFactor\s*=\s*0\.3\s*\+\s*Math\.random\s*\(\s*\)\s*\*\s*0\.3/);
  });

  it('has widthVar randomization', () => {
    expect(sceneInit).toMatch(/widthVar\s*=\s*0\.85\s*\+\s*Math\.random\s*\(\s*\)\s*\*\s*0\.3/);
  });

  it('has cupOpenness randomization', () => {
    expect(sceneInit).toMatch(/cupOpenness\s*=\s*Math\.random\s*\(\s*\)\s*\*\s*0\.4/);
  });

  it('has reflexAmount randomization', () => {
    expect(sceneInit).toMatch(/reflexAmount\s*=\s*0\.2\s*\+\s*Math\.random\s*\(\s*\)\s*\*\s*0\.6/);
  });

  it('has warmthShift for color variation', () => {
    expect(sceneInit).toMatch(/warmthShift\s*=\s*\(Math\.random\s*\(\s*\)\s*\*\s*0\.2\s*\)\s*-\s*0\.1/);
  });

  it('has per-petal width variation', () => {
    expect(sceneInit).toMatch(/pWidthVar\s*=\s*widthVar\s*\*\s*\(0\.85\s*\+\s*Math\.random/);
  });

  it('has per-petal height variation', () => {
    expect(sceneInit).toMatch(/pHeightVar\s*=\s*0\.9\s*\+\s*Math\.random/);
  });

  it('has per-petal wavy offset', () => {
    expect(sceneInit).toMatch(/pWavyOffset\s*=\s*2\s*\+\s*Math\.floor\s*\(\s*Math\.random/);
  });

  it('has per-petal lightness variation for depth', () => {
    expect(sceneInit).toMatch(/pLightness/);
  });
});
