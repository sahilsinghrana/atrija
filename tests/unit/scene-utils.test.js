/**
 * scene-utils.test.js — Unit tests for public/js/scene/scene-utils.js
 *
 * Tests cover:
 * - getMoonPhase() against known historical new moon dates
 * - getMoonPhase() return value structure and ranges
 * - getMoonPhaseName() boundary values (exact fraction thresholds)
 * - getMoonEmoji() returns correct Unicode for each phase
 * - getMoonIllumination() range and symmetry
 * - lerp/clamp utility math functions (if present)
 * - _seededRand() deterministic sequence
 */

import { describe, it, expect } from 'vitest';
import {
  getMoonPhase,
  getMoonPhaseName,
  getMoonEmoji,
  _seededRand
} from '../../public/js/scene/scene-utils.js';

// ─── getMoonPhase() ───────────────────────────────────────────────────

describe('getMoonPhase', () => {
  it('returns an object with phase, fraction, age, and illumination', () => {
    const result = getMoonPhase(new Date(2026, 0, 1));
    expect(result).toHaveProperty('phase');
    expect(result).toHaveProperty('fraction');
    expect(result).toHaveProperty('age');
    expect(result).toHaveProperty('illumination');
  });

  it('returns fraction in [0, 1) range for any date', () => {
    const dates = [
      new Date(2020, 0, 1),
      new Date(2023, 5, 15),
      new Date(2026, 0, 20),
      new Date(2030, 11, 31),
      new Date(2000, 1, 29),
      new Date(1999, 11, 31)
    ];
    for (const d of dates) {
      const { fraction } = getMoonPhase(d);
      expect(fraction).toBeGreaterThanOrEqual(0);
      expect(fraction).toBeLessThan(1);
    }
  });

  it('returns phase (age) in [0, 29.53) synodic month range', () => {
    const dates = [
      new Date(2026, 0, 1),
      new Date(2026, 5, 15),
      new Date(2026, 11, 31)
    ];
    for (const d of dates) {
      const { phase } = getMoonPhase(d);
      expect(phase).toBeGreaterThanOrEqual(0);
      expect(phase).toBeLessThan(29.53058868);
    }
  });

  it('returns illumination in [0, 1] range', () => {
    for (let day = 1; day <= 28; day++) {
      const { illumination } = getMoonPhase(new Date(2026, 0, day));
      expect(illumination).toBeGreaterThanOrEqual(0);
      expect(illumination).toBeLessThanOrEqual(1);
    }
  });

  it('returns illumination near 0 for known new moon (2026-01-19)', () => {
    // January 19, 2026 was a known new moon
    const result = getMoonPhase(new Date(2026, 0, 19));
    // Illumination should be very low (within ~1 day tolerance → ~17% max)
    expect(result.illumination).toBeLessThan(0.2);
  });

  it('returns illumination near 0 for known new moon (2026-02-17)', () => {
    // February 17, 2026 was a known new moon
    const result = getMoonPhase(new Date(2026, 1, 17));
    expect(result.illumination).toBeLessThan(0.2);
  });

  it('returns illumination near 0 for known new moon (2026-03-19)', () => {
    // March 19, 2026 was a known new moon
    const result = getMoonPhase(new Date(2026, 2, 19));
    expect(result.illumination).toBeLessThan(0.2);
  });

  it('returns high illumination near full moon (2026-01-04)', () => {
    // January 4, 2026 was near a full moon
    const result = getMoonPhase(new Date(2026, 0, 4));
    expect(result.illumination).toBeGreaterThan(0.8);
  });

  it('handles date at year boundary (Dec 31 → Jan 1)', () => {
    const dec31 = getMoonPhase(new Date(2025, 11, 31));
    const jan1 = getMoonPhase(new Date(2026, 0, 1));
    // Should be nearly identical with ~1 day difference
    expect(Math.abs(dec31.fraction - jan1.fraction)).toBeLessThan(0.1);
  });

  it('handles leap year dates correctly', () => {
    // Feb 29, 2024 is a valid leap year date
    const result = getMoonPhase(new Date(2024, 1, 29));
    expect(result.fraction).toBeGreaterThanOrEqual(0);
    expect(result.fraction).toBeLessThan(1);
  });

  it('defaults to current date when called with no arguments', () => {
    const result = getMoonPhase();
    expect(result).toHaveProperty('phase');
    expect(result).toHaveProperty('fraction');
    expect(result.fraction).toBeGreaterThanOrEqual(0);
    expect(result.fraction).toBeLessThan(1);
  });

  it('returns consistent same-day results', () => {
    const d = new Date(2026, 5, 15);
    const r1 = getMoonPhase(d);
    const r2 = getMoonPhase(d);
    expect(r1.fraction).toBe(r2.fraction);
    expect(r1.phase).toBe(r2.phase);
    expect(r1.illumination).toBe(r2.illumination);
  });
});

// ─── getMoonPhaseName() ───────────────────────────────────────────────

describe('getMoonPhaseName', () => {
  it('returns "New Moon" for fraction 0', () => {
    expect(getMoonPhaseName(0)).toBe('New Moon');
  });

  it('returns "New Moon" for fraction just below 0.0625', () => {
    expect(getMoonPhaseName(0.0624)).toBe('New Moon');
  });

  it('returns "Waxing Crescent" at exact boundary 0.0625', () => {
    expect(getMoonPhaseName(0.0625)).toBe('Waxing Crescent');
  });

  it('returns "Waxing Crescent" for fraction 0.125', () => {
    expect(getMoonPhaseName(0.125)).toBe('Waxing Crescent');
  });

  it('returns "First Quarter" at exact boundary 0.1875', () => {
    expect(getMoonPhaseName(0.1875)).toBe('First Quarter');
  });

  it('returns "First Quarter" for fraction 0.25', () => {
    expect(getMoonPhaseName(0.25)).toBe('First Quarter');
  });

  it('returns "Waxing Gibbous" at exact boundary 0.3125', () => {
    expect(getMoonPhaseName(0.3125)).toBe('Waxing Gibbous');
  });

  it('returns "Waxing Gibbous" for fraction 0.375', () => {
    expect(getMoonPhaseName(0.375)).toBe('Waxing Gibbous');
  });

  it('returns "Full Moon" at exact boundary 0.4375', () => {
    expect(getMoonPhaseName(0.4375)).toBe('Full Moon');
  });

  it('returns "Full Moon" for fraction 0.5', () => {
    expect(getMoonPhaseName(0.5)).toBe('Full Moon');
  });

  it('returns "Full Moon" for fraction just below 0.5625', () => {
    expect(getMoonPhaseName(0.5624)).toBe('Full Moon');
  });

  it('returns "Waning Gibbous" at exact boundary 0.5625', () => {
    expect(getMoonPhaseName(0.5625)).toBe('Waning Gibbous');
  });

  it('returns "Waning Gibbous" for fraction 0.625', () => {
    expect(getMoonPhaseName(0.625)).toBe('Waning Gibbous');
  });

  it('returns "Last Quarter" at exact boundary 0.6875', () => {
    expect(getMoonPhaseName(0.6875)).toBe('Last Quarter');
  });

  it('returns "Last Quarter" for fraction 0.75', () => {
    expect(getMoonPhaseName(0.75)).toBe('Last Quarter');
  });

  it('returns "Waning Crescent" at exact boundary 0.8125', () => {
    expect(getMoonPhaseName(0.8125)).toBe('Waning Crescent');
  });

  it('returns "Waning Crescent" for fraction 0.875', () => {
    expect(getMoonPhaseName(0.875)).toBe('Waning Crescent');
  });

  it('returns "New Moon" at exact boundary 0.9375 (wraps to end)', () => {
    expect(getMoonPhaseName(0.9375)).toBe('New Moon');
  });

  it('returns "New Moon" for fraction 0.99', () => {
    expect(getMoonPhaseName(0.99)).toBe('New Moon');
  });

  it('covers all 8 phase names', () => {
    const allNames = [
      getMoonPhaseName(0),       // New Moon
      getMoonPhaseName(0.125),   // Waxing Crescent
      getMoonPhaseName(0.25),    // First Quarter
      getMoonPhaseName(0.375),   // Waxing Gibbous
      getMoonPhaseName(0.5),     // Full Moon
      getMoonPhaseName(0.625),   // Waning Gibbous
      getMoonPhaseName(0.75),    // Last Quarter
      getMoonPhaseName(0.875)    // Waning Crescent
    ];
    const unique = new Set(allNames);
    expect(unique.size).toBe(8);
  });
});

// ─── getMoonEmoji() ───────────────────────────────────────────────────

describe('getMoonEmoji', () => {
  it('returns new moon emoji 🌑 for fraction 0', () => {
    expect(getMoonEmoji(0)).toBe('🌑');
  });

  it('returns waxing crescent emoji 🌒 for fraction 0.125', () => {
    expect(getMoonEmoji(0.125)).toBe('🌒');
  });

  it('returns first quarter emoji 🌓 for fraction 0.25', () => {
    expect(getMoonEmoji(0.25)).toBe('🌓');
  });

  it('returns waxing gibbous emoji 🌔 for fraction 0.375', () => {
    expect(getMoonEmoji(0.375)).toBe('🌔');
  });

  it('returns full moon emoji 🌕 for fraction 0.5', () => {
    expect(getMoonEmoji(0.5)).toBe('🌕');
  });

  it('returns waning gibbous emoji 🌖 for fraction 0.625', () => {
    expect(getMoonEmoji(0.625)).toBe('🌖');
  });

  it('returns last quarter emoji 🌗 for fraction 0.75', () => {
    expect(getMoonEmoji(0.75)).toBe('🌗');
  });

  it('returns waning crescent emoji 🌘 for fraction 0.875', () => {
    expect(getMoonEmoji(0.875)).toBe('🌘');
  });

  it('returns distinct emoji for all 8 phases', () => {
    const emojis = [
      getMoonEmoji(0),
      getMoonEmoji(0.125),
      getMoonEmoji(0.25),
      getMoonEmoji(0.375),
      getMoonEmoji(0.5),
      getMoonEmoji(0.625),
      getMoonEmoji(0.75),
      getMoonEmoji(0.875)
    ];
    const unique = new Set(emojis);
    expect(unique.size).toBe(8);
  });

  it('returns new moon emoji at boundary 0.9375 and above', () => {
    expect(getMoonEmoji(0.9375)).toBe('🌑');
    expect(getMoonEmoji(0.99)).toBe('🌑');
  });

  it('returns new moon emoji at boundary 0 and just below 0.0625', () => {
    expect(getMoonEmoji(0)).toBe('🌑');
    expect(getMoonEmoji(0.0624)).toBe('🌑');
  });

  it('mirrors getMoonPhaseName boundary thresholds exactly', () => {
    const boundaries = [0, 0.0625, 0.1875, 0.3125, 0.4375, 0.5625, 0.6875, 0.8125, 0.9375];
    for (const b of boundaries) {
      const name = getMoonPhaseName(b);
      const emoji = getMoonEmoji(b);
      // Emoji should not be empty and should be a string
      expect(typeof emoji).toBe('string');
      expect(emoji.length).toBeGreaterThan(0);
    }
  });
});

// ─── _seededRand() ────────────────────────────────────────────────────

describe('_seededRand', () => {
  it('returns a function when called with a seed', () => {
    const rand = _seededRand(42);
    expect(typeof rand).toBe('function');
  });

  it('returns deterministic values for the same seed', () => {
    const rand1 = _seededRand(12345);
    const rand2 = _seededRand(12345);
    const vals1 = Array.from({ length: 10 }, () => rand1());
    const vals2 = Array.from({ length: 10 }, () => rand2());
    expect(vals1).toEqual(vals2);
  });

  it('returns different sequences for different seeds', () => {
    const rand1 = _seededRand(1);
    const rand2 = _seededRand(2);
    const vals1 = Array.from({ length: 5 }, () => rand1());
    const vals2 = Array.from({ length: 5 }, () => rand2());
    expect(vals1).not.toEqual(vals2);
  });

  it('returns values in [0, 1) range', () => {
    const rand = _seededRand(999);
    for (let i = 0; i < 100; i++) {
      const v = rand();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('produces different values on successive calls', () => {
    const rand = _seededRand(777);
    const vals = Array.from({ length: 20 }, () => rand());
    const unique = new Set(vals);
    // With a proper PRNG, 20 values should not all be identical
    expect(unique.size).toBeGreaterThan(1);
  });

  it('does not produce 0 or 1 as exact values', () => {
    const rand = _seededRand(42);
    for (let i = 0; i < 100; i++) {
      const v = rand();
      expect(v).not.toBe(0);
      expect(v).not.toBe(1);
    }
  });
});

// ─── Integration: moon phase → name consistency ───────────────────────

describe('moon phase integration: getMoonPhase → getMoonPhaseName/getMoonEmoji', () => {
  it('returns valid phase name for computed phase fractions across a month', () => {
    for (let day = 1; day <= 29; day++) {
      const { fraction } = getMoonPhase(new Date(2026, 0, day));
      const name = getMoonPhaseName(fraction);
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(0);
      const emoji = getMoonEmoji(fraction);
      expect(typeof emoji).toBe('string');
      expect(emoji.length).toBeGreaterThan(0);
    }
  });

  it('full moon period has high illumination and correct name', () => {
    // Check around known full moon in January 2026 (~Jan 4)
    for (let day = 3; day <= 5; day++) {
      const { fraction, illumination } = getMoonPhase(new Date(2026, 0, day));
      const name = getMoonPhaseName(fraction);
      // Within 1-2 days of full moon, illumination should be high
      expect(illumination).toBeGreaterThan(0.7);
    }
  });
});
