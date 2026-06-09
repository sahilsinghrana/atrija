/**
 * scene-config.test.js — Unit tests for scene configuration module
 *
 * Tests cover:
 * - parallaxConfig frozen object values
 * - scrollState default values
 * - isMobile/isLowEnd boolean types (runtime values)
 * - parallaxConfig immutability
 */

import { describe, it, expect } from 'vitest';
import {
  isMobile,
  isLowEnd,
  scrollState,
  parallaxConfig,
} from '../../public/js/scene/scene-config.js';

// ─── parallaxConfig Tests ────────────────────────────────────────────

describe('parallaxConfig', () => {
  it('is a frozen object', () => {
    expect(Object.isFrozen(parallaxConfig)).toBe(true);
  });

  it('has cameraRotationZ of 0.03', () => {
    expect(parallaxConfig.cameraRotationZ).toBe(0.03);
  });

  it('has starsNearRotationY of 0.02', () => {
    expect(parallaxConfig.starsNearRotationY).toBe(0.02);
  });

  it('has starsMidRotationY of 0.01', () => {
    expect(parallaxConfig.starsMidRotationY).toBe(0.01);
  });

  it('has starsFarRotationY of 0.005', () => {
    expect(parallaxConfig.starsFarRotationY).toBe(0.005);
  });

  it('has moonVerticalOffset of 0.5', () => {
    expect(parallaxConfig.moonVerticalOffset).toBe(0.5);
  });

  it('has mobileIntensityMultiplier of 0.6', () => {
    expect(parallaxConfig.mobileIntensityMultiplier).toBe(0.6);
  });

  it('has exactly 6 config keys', () => {
    expect(Object.keys(parallaxConfig)).toHaveLength(6);
  });

  it('all config values are numbers', () => {
    for (const key of Object.keys(parallaxConfig)) {
      expect(typeof parallaxConfig[key]).toBe('number');
    }
  });

  it('rotation values are small (parallax subtlety)', () => {
    expect(parallaxConfig.cameraRotationZ).toBeLessThan(0.1);
    expect(parallaxConfig.starsNearRotationY).toBeLessThan(0.1);
    expect(parallaxConfig.starsMidRotationY).toBeLessThan(0.1);
    expect(parallaxConfig.starsFarRotationY).toBeLessThan(0.1);
  });

  it('cannot be modified (frozen)', () => {
    expect(() => {
      parallaxConfig.cameraRotationZ = 999;
    }).toThrow();
    expect(parallaxConfig.cameraRotationZ).toBe(0.03);
  });
});

// ─── scrollState Tests ───────────────────────────────────────────────

describe('scrollState', () => {
  it('has current of 0', () => {
    expect(scrollState.current).toBe(0);
  });

  it('has target of 0', () => {
    expect(scrollState.target).toBe(0);
  });

  it('has smooth of 0.05', () => {
    expect(scrollState.smooth).toBe(0.05);
  });

  it('has exactly 3 keys', () => {
    expect(Object.keys(scrollState)).toHaveLength(3);
  });

  it('all values are numbers', () => {
    expect(typeof scrollState.current).toBe('number');
    expect(typeof scrollState.target).toBe('number');
    expect(typeof scrollState.smooth).toBe('number');
  });

  it('smooth value is between 0 and 1 (lerp factor)', () => {
    expect(scrollState.smooth).toBeGreaterThan(0);
    expect(scrollState.smooth).toBeLessThan(1);
  });
});

// ─── Device Detection Tests ──────────────────────────────────────────

describe('device detection', () => {
  it('isMobile is a boolean', () => {
    expect(typeof isMobile).toBe('boolean');
  });

  it('isLowEnd is a boolean', () => {
    expect(typeof isLowEnd).toBe('boolean');
  });

  it('if isMobile is true, isLowEnd should also be true', () => {
    // isLowEnd = isMobile || navigator.hardwareConcurrency <= 4
    // So if isMobile is true, isLowEnd must be true
    if (isMobile) {
      expect(isLowEnd).toBe(true);
    }
  });
});
