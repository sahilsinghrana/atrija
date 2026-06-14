/**
 * check-bundle-size.test.js — Unit tests for bundle size budget checker
 *
 * Tests cover:
 * - PASS when bundle size is below warn threshold
 * - WARNING when bundle size is between warn and fail thresholds
 * - FAIL when bundle size exceeds fail threshold
 * - ENOENT handling when scene-bundle.js does not exist
 * - Thresholds configurable via environment variables
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkBundleSize, getBundlePath, getThresholds } from '../../scripts/check-bundle-size.js';

describe('check-bundle-size', () => {
  beforeEach(() => {
    delete process.env.BUNDLE_WARN_KB;
    delete process.env.BUNDLE_FAIL_KB;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ─── Size threshold tests ─────────────────────────────────────────────

  it('exits 0 (pass) when bundle is below warn threshold', () => {
    const mockStat = vi.fn().mockReturnValue({ size: 500 * 1024 });
    const result = checkBundleSize(mockStat);
    expect(result.exitCode).toBe(0);
    expect(result.threshold).toBe('pass');
    expect(result.sizeKB).toBe(500);
  });

  it('exits 0 (pass) when bundle is exactly at warn threshold boundary', () => {
    // Exactly 750KB — at the boundary, should pass (not warn)
    const mockStat = vi.fn().mockReturnValue({ size: 750 * 1024 });
    const result = checkBundleSize(mockStat);
    expect(result.exitCode).toBe(0);
    expect(result.threshold).toBe('pass');
  });

  it('exits 0 with warning when bundle is between warn and fail', () => {
    // 800KB — between 750KB warn and 900KB fail
    const mockStat = vi.fn().mockReturnValue({ size: 800 * 1024 });
    const result = checkBundleSize(mockStat);
    expect(result.exitCode).toBe(0);
    expect(result.threshold).toBe('warn');
    expect(result.sizeKB).toBe(800);
  });

  it('exits 0 with warning when bundle is exactly at fail threshold boundary', () => {
    // Exactly 900KB — at the fail boundary, should warn (not fail)
    const mockStat = vi.fn().mockReturnValue({ size: 900 * 1024 });
    const result = checkBundleSize(mockStat);
    expect(result.exitCode).toBe(0);
    expect(result.threshold).toBe('warn');
  });

  it('exits 1 (fail) when bundle exceeds fail threshold', () => {
    // 950KB — above 900KB fail threshold
    const mockStat = vi.fn().mockReturnValue({ size: 950 * 1024 });
    const result = checkBundleSize(mockStat);
    expect(result.exitCode).toBe(1);
    expect(result.threshold).toBe('fail');
    expect(result.sizeKB).toBe(950);
  });

  it('exits 1 (fail) when bundle is significantly over limit', () => {
    // 1500KB — way over limit
    const mockStat = vi.fn().mockReturnValue({ size: 1500 * 1024 });
    const result = checkBundleSize(mockStat);
    expect(result.exitCode).toBe(1);
    expect(result.threshold).toBe('fail');
  });

  it('reports correct fractional KB size', () => {
    // 697387 bytes = ~681KB (current real-world size)
    const mockStat = vi.fn().mockReturnValue({ size: 697387 });
    const result = checkBundleSize(mockStat);
    expect(result.exitCode).toBe(0);
    expect(result.threshold).toBe('pass');
    expect(result.sizeKB).toBeCloseTo(681.0, 0);
  });

  // ─── Error handling ───────────────────────────────────────────────────

  it('propagates ENOENT when scene-bundle.js does not exist', () => {
    const enoent = new Error('ENOENT');
    enoent.code = 'ENOENT';
    const mockStat = vi.fn().mockImplementation(() => { throw enoent; });
    expect(() => checkBundleSize(mockStat)).toThrow('ENOENT');
  });

  it('propagates unexpected errors', () => {
    const mockStat = vi.fn().mockImplementation(() => { throw new Error('EACCES'); });
    expect(() => checkBundleSize(mockStat)).toThrow('EACCES');
  });

  // ─── Configuration tests ──────────────────────────────────────────────

  it('uses custom thresholds from environment variables', () => {
    process.env.BUNDLE_WARN_KB = '600';
    process.env.BUNDLE_FAIL_KB = '800';
    const thresholds = getThresholds();
    expect(thresholds.warnKB).toBe(600);
    expect(thresholds.failKB).toBe(800);
    expect(thresholds.warnBytes).toBe(600 * 1024);
    expect(thresholds.failBytes).toBe(800 * 1024);
  });

  it('uses custom thresholds for size checking', () => {
    process.env.BUNDLE_WARN_KB = '600';
    process.env.BUNDLE_FAIL_KB = '800';
    // 650KB should warn with custom thresholds (between 600 and 800)
    const mockStat = vi.fn().mockReturnValue({ size: 650 * 1024 });
    const result = checkBundleSize(mockStat);
    expect(result.exitCode).toBe(0);
    expect(result.threshold).toBe('warn');
    delete process.env.BUNDLE_WARN_KB;
    delete process.env.BUNDLE_FAIL_KB;
  });

  it('uses default thresholds when env vars not set', () => {
    delete process.env.BUNDLE_WARN_KB;
    delete process.env.BUNDLE_FAIL_KB;
    const thresholds = getThresholds();
    expect(thresholds.warnKB).toBe(750);
    expect(thresholds.failKB).toBe(900);
  });

  it('correctly reads scene-bundle.js path', () => {
    const path = getBundlePath();
    expect(path).toContain('scene-bundle.js');
    expect(path).toContain('public');
    expect(path).toContain('js');
  });

  it('calls statSync with bundle path', () => {
    const mockStat = vi.fn().mockReturnValue({ size: 500 * 1024 });
    const bundlePath = getBundlePath();
    checkBundleSize(mockStat);
    expect(mockStat).toHaveBeenCalledWith(bundlePath);
  });
});
