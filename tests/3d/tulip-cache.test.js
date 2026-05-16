// tests/3d/tulip-cache.test.js
// Red-phase tests: Verify texture caching system
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Tulip Texture Cache (idea-019)', () => {
  const sceneInit = readFileSync(join(process.cwd(), 'public/js/scene-init.js'), 'utf-8');

  it('has a tulipCache object at module level', () => {
    expect(sceneInit).toMatch(/var tulipCache\s*=\s*\{\s*\}/);
  });

  it('has a TULIP_CACHE_MAX constant', () => {
    expect(sceneInit).toMatch(/var TULIP_CACHE_MAX\s*=\s*50/);
  });

  it('has a getCachedTulip function', () => {
    expect(sceneInit).toMatch(/function getCachedTulip\s*\(\s*color\s*,\s*isOpen\s*\)/);
  });

  it('cache key combines color and isOpen', () => {
    expect(sceneInit).toMatch(/var key\s*=\s*color\s*\+\s*['_]\s*_\s*[']\s*\+\s*isOpen/);
  });

  it('cache returns existing canvas on hit', () => {
    expect(sceneInit).toMatch(/if\s*\(\s*tulipCache\s*\[\s*key\s*\]\s*\)/);
  });

  it('cache evicts oldest entry when at capacity', () => {
    expect(sceneInit).toMatch(/keys\.length\s*>=\s*TULIP_CACHE_MAX/);
    expect(sceneInit).toMatch(/delete tulipCache/);
  });

  it('createTulips uses getCachedTulip instead of direct makeTulipCanvas', () => {
    // After implementation, createTulips should call getCachedTulip
    const funcMatch = sceneInit.match(/function createTulips[\s\S]*?^}/m);
    expect(funcMatch).toBeTruthy();
    expect(funcMatch[0]).toMatch(/getCachedTulip/);
  });
});
