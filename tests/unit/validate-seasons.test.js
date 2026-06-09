/**
 * validate-seasons.test.js — Unit tests for seasons.json schema validation
 *
 * Tests cover:
 * - Valid seasons.json passes validation
 * - Invalid month values (0, 13) are caught
 * - Missing color scheme keys are caught
 * - Negative/zero weights are caught
 * - Invalid flowerEmphasis enum values are caught
 * - Missing skyToneShift channels are caught
 * - Empty particleEffect is caught
 * - Missing fact theme keys are caught
 * - Missing season keys (spring, summer, autumn, winter) are caught
 * - Non-object root is caught
 * - Missing seasons top-level key is caught
 * - validateAll includes seasons result
 */

import { describe, it, expect } from 'vitest';
import { join } from 'path';
import {
  validateSeasons,
  validateAll,
  readJson
} from '../../src/content/validate-content.js';

const FIXTURES = join(import.meta.dirname, '..', 'fixtures', 'content-validation');

// ─── Valid Seasons Tests ─────────────────────────────────────────────

describe('validateSeasons', () => {
  it('passes valid seasons.json', () => {
    const { data } = readJson(join(FIXTURES, 'valid-seasons.json'));
    const errors = validateSeasons(data);
    expect(errors).toHaveLength(0);
  });

  it('rejects non-object root', () => {
    expect(validateSeasons(null)).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: '<root>' })])
    );
    expect(validateSeasons('string')).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: '<root>' })])
    );
    expect(validateSeasons(42)).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: '<root>' })])
    );
  });

  it('rejects missing seasons top-level key', () => {
    const errors = validateSeasons({ notSeasons: {} });
    expect(errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'seasons' })])
    );
  });

  it('rejects non-object seasons value', () => {
    const errors = validateSeasons({ seasons: 'not-an-object' });
    expect(errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'seasons' })])
    );
  });
});

// ─── Missing Season Key Tests ────────────────────────────────────────

describe('validateSeasons missing season keys', () => {
  it('catches missing summer, autumn, winter when only spring exists', () => {
    const { data } = readJson(join(FIXTURES, 'missing-season-key-seasons.json'));
    const errors = validateSeasons(data);
    expect(errors.some(e => e.field === 'seasons.summer')).toBe(true);
    expect(errors.some(e => e.field === 'seasons.autumn')).toBe(true);
    expect(errors.some(e => e.field === 'seasons.winter')).toBe(true);
  });
});

// ─── Invalid Month Value Tests ───────────────────────────────────────

describe('validateSeasons invalid month values', () => {
  it('catches month value 0 (below range)', () => {
    const { data } = readJson(join(FIXTURES, 'malformed-seasons.json'));
    const errors = validateSeasons(data);
    const monthErrors = errors.filter(e => e.field.includes('months[0]'));
    expect(monthErrors.length).toBeGreaterThan(0);
    expect(monthErrors[0].message).toContain('1-12');
  });

  it('catches month value 13 (above range)', () => {
    const { data } = readJson(join(FIXTURES, 'malformed-seasons.json'));
    const errors = validateSeasons(data);
    const monthErrors = errors.filter(e => e.field.includes('months[2]'));
    expect(monthErrors.length).toBeGreaterThan(0);
    expect(monthErrors[0].message).toContain('1-12');
  });
});

// ─── Color Scheme Weight Tests ───────────────────────────────────────

describe('validateSeasons colorSchemeWeights', () => {
  it('catches missing moonlit-silver key in spring', () => {
    const { data } = readJson(join(FIXTURES, 'malformed-seasons.json'));
    const errors = validateSeasons(data);
    const missingKeyErrors = errors.filter(e =>
      e.field === 'seasons.spring.colorSchemeWeights.moonlit-silver' &&
      e.message.includes('Missing required')
    );
    expect(missingKeyErrors.length).toBeGreaterThan(0);
  });

  it('catches negative weight value', () => {
    const { data } = readJson(join(FIXTURES, 'malformed-seasons.json'));
    const errors = validateSeasons(data);
    const negWeightErrors = errors.filter(e =>
      e.field === 'seasons.spring.colorSchemeWeights.starry-night' &&
      e.message.includes('>= 1')
    );
    expect(negWeightErrors.length).toBeGreaterThan(0);
  });

  it('catches zero weight value', () => {
    const { data } = readJson(join(FIXTURES, 'malformed-seasons.json'));
    const errors = validateSeasons(data);
    const zeroWeightErrors = errors.filter(e =>
      e.field === 'seasons.spring.colorSchemeWeights.sunflower' &&
      e.message.includes('>= 1')
    );
    expect(zeroWeightErrors.length).toBeGreaterThan(0);
  });
});

// ─── Flower Emphasis Enum Tests ──────────────────────────────────────

describe('validateSeasons flowerEmphasis', () => {
  it('catches invalid flowerEmphasis value', () => {
    const { data } = readJson(join(FIXTURES, 'malformed-seasons.json'));
    const errors = validateSeasons(data);
    const emphasisErrors = errors.filter(e =>
      e.field === 'seasons.spring.flowerEmphasis' &&
      e.message.includes('must be one of')
    );
    expect(emphasisErrors.length).toBeGreaterThan(0);
  });
});

// ─── Sky Tone Shift Tests ────────────────────────────────────────────

describe('validateSeasons skyToneShift', () => {
  it('catches non-number r channel', () => {
    const { data } = readJson(join(FIXTURES, 'malformed-seasons.json'));
    const errors = validateSeasons(data);
    const rErrors = errors.filter(e =>
      e.field === 'seasons.spring.skyToneShift.r' &&
      e.message.includes('must be a number')
    );
    expect(rErrors.length).toBeGreaterThan(0);
  });

  it('catches missing b channel', () => {
    const { data } = readJson(join(FIXTURES, 'malformed-seasons.json'));
    const errors = validateSeasons(data);
    const bErrors = errors.filter(e =>
      e.field === 'seasons.spring.skyToneShift.b'
    );
    expect(bErrors.length).toBeGreaterThan(0);
  });
});

// ─── Particle Effect Tests ───────────────────────────────────────────

describe('validateSeasons particleEffect', () => {
  it('catches empty particleEffect string', () => {
    const { data } = readJson(join(FIXTURES, 'malformed-seasons.json'));
    const errors = validateSeasons(data);
    const particleErrors = errors.filter(e =>
      e.field === 'seasons.spring.particleEffect' &&
      e.message.includes('non-empty string')
    );
    expect(particleErrors.length).toBeGreaterThan(0);
  });
});

// ─── Fact Theme Weight Tests ─────────────────────────────────────────

describe('validateSeasons factThemeWeights', () => {
  it('catches missing art key in spring', () => {
    const { data } = readJson(join(FIXTURES, 'malformed-seasons.json'));
    const errors = validateSeasons(data);
    const missingKeyErrors = errors.filter(e =>
      e.field === 'seasons.spring.factThemeWeights.art' &&
      e.message.includes('Missing required')
    );
    expect(missingKeyErrors.length).toBeGreaterThan(0);
  });

  it('catches negative fact theme weight', () => {
    const { data } = readJson(join(FIXTURES, 'malformed-seasons.json'));
    const errors = validateSeasons(data);
    const negErrors = errors.filter(e =>
      e.field === 'seasons.spring.factThemeWeights.moon' &&
      e.message.includes('>= 1')
    );
    expect(negErrors.length).toBeGreaterThan(0);
  });

  it('catches zero fact theme weight', () => {
    const { data } = readJson(join(FIXTURES, 'malformed-seasons.json'));
    const errors = validateSeasons(data);
    const zeroErrors = errors.filter(e =>
      e.field === 'seasons.spring.factThemeWeights.ego' &&
      e.message.includes('>= 1')
    );
    expect(zeroErrors.length).toBeGreaterThan(0);
  });
});

// ─── Integration: validateAll with seasons ───────────────────────────

describe('validateAll with seasons', () => {
  it('includes seasons result in validateAll output', () => {
    const result = validateAll({
      siteDataPath: join(FIXTURES, 'valid-siteData.json'),
      contentPath: join(FIXTURES, 'valid-content.json'),
      seasonsPath: join(FIXTURES, 'valid-seasons.json')
    });
    expect(result.seasons).toBeDefined();
    expect(result.seasons.valid).toBe(true);
    expect(result.valid).toBe(true);
  });

  it('reports invalid when seasons.json is malformed', () => {
    const result = validateAll({
      siteDataPath: join(FIXTURES, 'valid-siteData.json'),
      contentPath: join(FIXTURES, 'valid-content.json'),
      seasonsPath: join(FIXTURES, 'malformed-seasons.json')
    });
    expect(result.seasons.valid).toBe(false);
    expect(result.seasons.errors.length).toBeGreaterThan(0);
    expect(result.valid).toBe(false);
  });

  it('reports invalid when seasons.json is missing', () => {
    const result = validateAll({
      siteDataPath: join(FIXTURES, 'valid-siteData.json'),
      contentPath: join(FIXTURES, 'valid-content.json'),
      seasonsPath: join(FIXTURES, 'nonexistent-seasons.json')
    });
    expect(result.seasons.valid).toBe(false);
    expect(result.seasons.errors[0].field).toBe('<file>');
    expect(result.valid).toBe(false);
  });
});
