// tests/unit/sunflower-layers.test.js
// Red-phase tests for idea-005: Sunflower field parallax (3-layer system)
import { describe, it, expect } from 'vitest';

// Import the layer configuration from the scene module
// The implementation should export SUNFLOWER_LAYERS and computeLayerCounts
import { SUNFLOWER_LAYERS, computeLayerCounts, getLayerConfig } from '../../src/lib/sunflower-layers.js';

describe('Sunflower Parallax Layers (idea-005)', () => {
  describe('Layer structure', () => {
    it('creates 3 layers', () => {
      expect(SUNFLOWER_LAYERS.length).toBe(3);
    });

    it('has layers named background, midground, foreground', () => {
      expect(SUNFLOWER_LAYERS[0].name).toBe('background');
      expect(SUNFLOWER_LAYERS[1].name).toBe('midground');
      expect(SUNFLOWER_LAYERS[2].name).toBe('foreground');
    });
  });

  describe('Scale relationships', () => {
    it('foreground larger than background', () => {
      const bg = SUNFLOWER_LAYERS.find(l => l.name === 'background');
      const fg = SUNFLOWER_LAYERS.find(l => l.name === 'foreground');
      expect(fg.scaleRange[0]).toBeGreaterThan(bg.scaleRange[1]);
    });

    it('foreground sways more than background', () => {
      const bg = SUNFLOWER_LAYERS.find(l => l.name === 'background');
      const fg = SUNFLOWER_LAYERS.find(l => l.name === 'foreground');
      expect(fg.swayAmp).toBeGreaterThan(bg.swayAmp);
    });
  });

  describe('Mobile reduces counts', () => {
    it('mobile total is less than desktop total', () => {
      const desktop = computeLayerCounts(16, false);
      const mobile = computeLayerCounts(16, true);
      const desktopSum = desktop.reduce((a, l) => a + l.count, 0);
      const mobileSum = mobile.reduce((a, l) => a + l.count, 0);
      expect(mobileSum).toBeLessThan(desktopSum);
    });
  });

  describe('Total count matches sum of layers', () => {
    it('desktop: sum of layer counts equals totalCount (within floor tolerance)', () => {
      const totalCount = 16;
      const layers = computeLayerCounts(totalCount, false);
      const sum = layers.reduce((a, l) => a + l.count, 0);
      expect(sum).toBeLessThanOrEqual(totalCount);
      expect(sum).toBeGreaterThanOrEqual(totalCount - 4);
    });
  });

  describe('Layer config from getLayerConfig', () => {
    it('returns full config for a named layer', () => {
      const fg = getLayerConfig('foreground');
      expect(fg).toBeDefined();
      expect(fg.name).toBe('foreground');
      expect(fg.scaleRange[0]).toBe(1.2);
      expect(fg.swayAmp).toBe(0.12);
      expect(fg.opacity).toBe(0.95);
    });

    it('background has lower opacity than foreground', () => {
      const bg = getLayerConfig('background');
      const fg = getLayerConfig('foreground');
      expect(bg.opacity).toBeLessThan(fg.opacity);
    });
  });
});
