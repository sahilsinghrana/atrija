// tests/unit/shaders.test.js
import { describe, it, expect } from 'vitest';
import { vgVertexShader, vgFragmentShader } from '../../src/shaders/vanGogh.mjs';
import { starVertexShader, starFragmentShader } from '../../src/shaders/stars.mjs';
import { waveVertexShader, waveFragmentShader } from '../../src/shaders/waves.mjs';

describe('Van Gogh Post-Processing Shader', () => {
  it('vertex shader is a non-empty string', () => {
    expect(typeof vgVertexShader).toBe('string');
    expect(vgVertexShader.length).toBeGreaterThan(0);
  });

  it('fragment shader is a non-empty string', () => {
    expect(typeof vgFragmentShader).toBe('string');
    expect(vgFragmentShader.length).toBeGreaterThan(0);
  });

  it('vertex shader contains varying vUv', () => {
    expect(vgVertexShader).toContain('varying vec2 vUv');
  });

  it('vertex shader sets gl_Position', () => {
    expect(vgVertexShader).toContain('gl_Position');
  });

  it('fragment shader declares required uniforms', () => {
    expect(vgFragmentShader).toContain('uniform sampler2D tDiffuse');
    expect(vgFragmentShader).toContain('uniform float uTime');
    expect(vgFragmentShader).toContain('uniform float uStrokeDensity');
    expect(vgFragmentShader).toContain('uniform float uSwirlFrequency');
    expect(vgFragmentShader).toContain('uniform float uColorIntensity');
  });

  it('fragment shader contains swirl distortion logic', () => {
    expect(vgFragmentShader).toContain('swirl');
  });

  it('fragment shader contains brush stroke noise (fbm)', () => {
    expect(vgFragmentShader).toContain('fbm');
  });

  it('fragment shader applies vignette', () => {
    expect(vgFragmentShader).toContain('vignette');
  });

  it('fragment shader boosts saturation', () => {
    expect(vgFragmentShader).toContain('uColorIntensity');
  });
});

describe('Star Field Shader', () => {
  it('vertex shader is a non-empty string', () => {
    expect(typeof starVertexShader).toBe('string');
    expect(starVertexShader.length).toBeGreaterThan(0);
  });

  it('fragment shader is a non-empty string', () => {
    expect(typeof starFragmentShader).toBe('string');
    expect(starFragmentShader.length).toBeGreaterThan(0);
  });

  it('vertex shader declares size attribute', () => {
    expect(starVertexShader).toContain('attribute float size');
  });

  it('vertex shader declares brightness attribute', () => {
    expect(starVertexShader).toContain('attribute float brightness');
  });

  it('fragment shader discards pixels outside radius', () => {
    expect(starFragmentShader).toContain('discard');
  });

  it('fragment shader applies glow effect', () => {
    expect(starFragmentShader).toContain('glow');
  });
});

describe('Wave Shader', () => {
  it('vertex shader is a non-empty string', () => {
    expect(typeof waveVertexShader).toBe('string');
    expect(waveVertexShader.length).toBeGreaterThan(0);
  });

  it('fragment shader is a non-empty string', () => {
    expect(typeof waveFragmentShader).toBe('string');
    expect(waveFragmentShader.length).toBeGreaterThan(0);
  });

  it('vertex shader applies wave displacement', () => {
    expect(waveVertexShader).toContain('uWaveHeight');
    expect(waveVertexShader).toContain('uWaveFrequency');
  });

  it('vertex shader uses time uniform for animation', () => {
    expect(waveVertexShader).toContain('uTime');
  });

  it('fragment shader blends three colors', () => {
    expect(waveFragmentShader).toContain('uColor1');
    expect(waveFragmentShader).toContain('uColor2');
    expect(waveFragmentShader).toContain('uColor3');
  });

  it('fragment shader applies brush stroke texture', () => {
    expect(waveFragmentShader).toContain('stroke');
  });
});
