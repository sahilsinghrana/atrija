// tests/scroll-parallax.test.js
// Red-phase tests: Scroll-driven starry night sky parallax (idea-020)
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Scroll-Driven Sky Parallax (idea-020)', () => {
  const sceneInit = readFileSync(join(process.cwd(), 'public/js/scene-init.js'), 'utf-8');

  // ── Source code structure tests ──

  describe('Scroll state tracking', () => {
    it('has a scrollState object with current, target, and smooth properties', () => {
      expect(sceneInit).toMatch(/scrollState\s*=\s*\{/);
      expect(sceneInit).toMatch(/current\s*:/);
      expect(sceneInit).toMatch(/target\s*:/);
      expect(sceneInit).toMatch(/smooth\s*:/);
    });

    it('initializes scrollState.current and scrollState.target to 0', () => {
      expect(sceneInit).toMatch(/current\s*:\s*0/);
      expect(sceneInit).toMatch(/target\s*:\s*0/);
    });

    it('has a scroll event listener with passive flag', () => {
      expect(sceneInit).toMatch(/addEventListener\s*\(\s*['"]scroll['"]\s*,/);
      expect(sceneInit).toMatch(/passive\s*:\s*true/);
    });

    it('clamps scroll target between 0 and 1', () => {
      expect(sceneInit).toMatch(/Math\s*\.\s*min\s*\(\s*1\s*,/);
      expect(sceneInit).toMatch(/Math\s*\.\s*max\s*\(\s*0\s*,/);
    });

    it('lerps scrollState.current toward target in animation loop', () => {
      expect(sceneInit).toMatch(/scrollState\s*\.\s*current\s*\+=\s*\(\s*scrollState\s*\.\s*target\s*-\s*scrollState\s*\.\s*current\s*\)/);
    });
  });

  describe('Star field depth layers', () => {
    it('creates 3 star layers: starsNear, starsMid, starsFar', () => {
      expect(sceneInit).toMatch(/starsNear/);
      expect(sceneInit).toMatch(/starsMid/);
      expect(sceneInit).toMatch(/starsFar/);
    });

    it('adds all star layers to a starsGroup', () => {
      expect(sceneInit).toMatch(/starsGroup/);
      expect(sceneInit).toMatch(/starsGroup\s*\.\s*add\s*\(\s*starsNear\s*\)/);
      expect(sceneInit).toMatch(/starsGroup\s*\.\s*add\s*\(\s*starsMid\s*\)/);
      expect(sceneInit).toMatch(/starsGroup\s*\.\s*add\s*\(\s*starsFar\s*\)/);
    });

    it('near stars are larger than far stars', () => {
      // Near stars use sizeMult=2.5, far stars use sizeMult=1.2 in createStarLayer calls
      expect(sceneInit).toMatch(/createStarLayer\s*\([^,]+,\s*[^,]+,\s*2\.5/);
      expect(sceneInit).toMatch(/createStarLayer\s*\([^,]+,\s*[^,]+,\s*1\.2/);
    });
  });

  describe('Parallax transforms in animation loop', () => {
    it('applies camera rotation based on scroll position', () => {
      expect(sceneInit).toMatch(/camera\s*\.\s*rotation\s*\.\s*z\s*=/);
      expect(sceneInit).toMatch(/cameraRotationZ/);
    });

    it('applies different rotation rates to each star layer', () => {
      expect(sceneInit).toMatch(/starsNear\s*\.\s*rotation\s*\.\s*y\s*=/);
      expect(sceneInit).toMatch(/starsMid\s*\.\s*rotation\s*\.\s*y\s*=/);
      expect(sceneInit).toMatch(/starsFar\s*\.\s*rotation\s*\.\s*y\s*=/);
    });

    it('moves moon vertically based on scroll position', () => {
      expect(sceneInit).toMatch(/moonGroup\s*\.\s*position\s*\.\s*y\s*=/);
      expect(sceneInit).toMatch(/moonBaseY/);
    });

    it('interpolates background color based on scroll', () => {
      expect(sceneInit).toMatch(/scene\s*\.\s*background\s*=/);
      expect(sceneInit).toMatch(/\.lerp\(/);
    });
  });

  describe('Mobile optimization', () => {
    it('reduces parallax intensity on mobile (60%)', () => {
      expect(sceneInit).toMatch(/mobileIntensityMultiplier\s*[:=]\s*0\.6/);
    });

    it('reduces star counts on mobile', () => {
      // Mobile uses isMobile ? 0.7 : 1.0 multiplier for star counts
      expect(sceneInit).toMatch(/isMobile\s*\?\s*0\.7\s*:\s*1\.0/);
    });

    it('disables background color interpolation on mobile', () => {
      expect(sceneInit).toMatch(/!isMobile/);
      expect(sceneInit).toMatch(/background.*=.*lerp/);
    });
  });

  describe('Performance optimizations', () => {
    it('only updates transforms when scroll delta > 0.001', () => {
      // The implementation stores delta in a variable and checks on next line
      expect(sceneInit).toMatch(/scrollDelta\s*>\s*0\.001/);
      expect(sceneInit).toMatch(/var\s+scrollDelta\s*=\s*Math\s*\.\s*abs/);
    });

    it('caches scrollMax and recalculates on resize', () => {
      expect(sceneInit).toMatch(/scrollMax\s*=/);
      expect(sceneInit).toMatch(/document\s*\.\s*body\s*\.\s*scrollHeight\s*-\s*window\s*\.\s*innerHeight/);
    });

    it('uses parallaxConfig object for rotation values', () => {
      expect(sceneInit).toMatch(/parallaxConfig\s*=\s*(Object\.freeze\s*\(\s*)?\{/);
      expect(sceneInit).toMatch(/cameraRotationZ\s*:/);
      expect(sceneInit).toMatch(/starsNearRotationY\s*:/);
    });
  });
});
