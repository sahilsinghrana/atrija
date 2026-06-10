/**
 * validate-koans.test.js — Unit tests for koans.json schema validation
 *
 * Tests cover:
 * - Valid koans.json passes validation
 * - Empty text/source/interpretation fields are caught
 * - Empty koans array is caught
 * - Non-object koan entries are caught
 * - Non-string field values are caught
 * - Missing koans array is caught
 * - Null root is caught
 * - validateAll integration with koansPath
 */

import { describe, it, expect } from 'vitest';
import { join } from 'path';
import {
  validateKoans,
  validateAll,
  readJson
} from '../../src/content/validate-content.js';

const FIXTURES = join(import.meta.dirname, '..', 'fixtures', 'content-validation');

// ─── validateKoans Tests ──────────────────────────────────────────────

describe('validateKoans', () => {
  it('passes valid koans.json', () => {
    const data = {
      koans: [
        { text: 'What is the sound of one hand clapping?', source: 'Hakuin Ekaku', interpretation: 'The question dissolves the questioner.' },
        { text: 'Before enlightenment, chop wood, carry water.', source: 'Zen Proverb', interpretation: 'The sacred is not elsewhere.' }
      ]
    };
    const errors = validateKoans(data);
    expect(errors).toHaveLength(0);
  });

  it('rejects null root', () => {
    const errors = validateKoans(null);
    expect(errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: '<root>' })])
    );
  });

  it('rejects non-object root', () => {
    const errors = validateKoans('string');
    expect(errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: '<root>' })])
    );
  });

  it('rejects missing koans array', () => {
    const errors = validateKoans({});
    expect(errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'koans' })])
    );
  });

  it('rejects koans as non-array', () => {
    const errors = validateKoans({ koans: 'not an array' });
    expect(errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'koans' })])
    );
    expect(errors[0].message).toContain('must be an array');
  });

  it('rejects empty koans array', () => {
    const errors = validateKoans({ koans: [] });
    expect(errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'koans' })])
    );
    expect(errors[0].message).toContain('must not be empty');
  });

  it('catches empty text field', () => {
    const data = {
      koans: [
        { text: '', source: 'Source', interpretation: 'Interp' }
      ]
    };
    const errors = validateKoans(data);
    const textErrors = errors.filter(e => e.field === 'koans[0].text');
    expect(textErrors.length).toBeGreaterThan(0);
    expect(textErrors[0].message).toContain('non-empty string "text"');
  });

  it('catches empty source field', () => {
    const data = {
      koans: [
        { text: 'Text', source: '', interpretation: 'Interp' }
      ]
    };
    const errors = validateKoans(data);
    const sourceErrors = errors.filter(e => e.field === 'koans[0].source');
    expect(sourceErrors.length).toBeGreaterThan(0);
    expect(sourceErrors[0].message).toContain('non-empty string "source"');
  });

  it('catches empty interpretation field', () => {
    const data = {
      koans: [
        { text: 'Text', source: 'Source', interpretation: '' }
      ]
    };
    const errors = validateKoans(data);
    const interpErrors = errors.filter(e => e.field === 'koans[0].interpretation');
    expect(interpErrors.length).toBeGreaterThan(0);
    expect(interpErrors[0].message).toContain('non-empty string "interpretation"');
  });

  it('catches non-string text field', () => {
    const data = {
      koans: [
        { text: 123, source: 'Source', interpretation: 'Interp' }
      ]
    };
    const errors = validateKoans(data);
    const textErrors = errors.filter(e => e.field === 'koans[0].text');
    expect(textErrors.length).toBeGreaterThan(0);
  });

  it('catches non-object koan entry', () => {
    const data = {
      koans: ['not an object']
    };
    const errors = validateKoans(data);
    const objErrors = errors.filter(e => e.field === 'koans[0]' && e.message.includes('must be an object'));
    expect(objErrors.length).toBeGreaterThan(0);
  });

  it('catches multiple errors across multiple koans', () => {
    const data = {
      koans: [
        { text: '', source: '', interpretation: '' },
        { text: 'Valid', source: 'Valid', interpretation: 'Valid' },
        { text: 123, source: null, interpretation: undefined }
      ]
    };
    const errors = validateKoans(data);
    // Koan 0: 3 errors (empty text, source, interpretation)
    // Koan 1: 0 errors
    // Koan 2: 3 errors (non-string text, source, interpretation)
    expect(errors.length).toBe(6);
  });

  it('reports correct koan index in error messages', () => {
    const data = {
      koans: [
        { text: 'Valid', source: 'Valid', interpretation: 'Valid' },
        { text: 'Valid', source: 'Valid', interpretation: 'Valid' },
        { text: '', source: 'Valid', interpretation: 'Valid' }
      ]
    };
    const errors = validateKoans(data);
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe('koans[2].text');
    expect(errors[0].message).toContain('index 2');
  });
});

// ─── Fixture-Based Tests ──────────────────────────────────────────────

describe('validateKoans with fixtures', () => {
  it('passes valid-koans.json fixture', () => {
    const { data } = readJson(join(FIXTURES, 'valid-koans.json'));
    const errors = validateKoans(data);
    expect(errors).toHaveLength(0);
  });

  it('catches empty text in empty-text-koans.json fixture', () => {
    const { data } = readJson(join(FIXTURES, 'empty-text-koans.json'));
    const errors = validateKoans(data);
    expect(errors.some(e => e.field === 'koans[1].text')).toBe(true);
  });

  it('catches empty source in empty-source-koans.json fixture', () => {
    const { data } = readJson(join(FIXTURES, 'empty-source-koans.json'));
    const errors = validateKoans(data);
    expect(errors.some(e => e.field === 'koans[0].source')).toBe(true);
  });

  it('catches empty interpretation in empty-interpretation-koans.json fixture', () => {
    const { data } = readJson(join(FIXTURES, 'empty-interpretation-koans.json'));
    const errors = validateKoans(data);
    expect(errors.some(e => e.field === 'koans[0].interpretation')).toBe(true);
  });

  it('catches empty array in empty-array-koans.json fixture', () => {
    const { data } = readJson(join(FIXTURES, 'empty-array-koans.json'));
    const errors = validateKoans(data);
    expect(errors.some(e => e.field === 'koans' && e.message.includes('must not be empty'))).toBe(true);
  });

  it('catches non-object entry in non-object-koan.json fixture', () => {
    const { data } = readJson(join(FIXTURES, 'non-object-koan.json'));
    const errors = validateKoans(data);
    expect(errors.some(e => e.field === 'koans[1]' && e.message.includes('must be an object'))).toBe(true);
  });

  it('catches non-string text in non-string-text-koans.json fixture', () => {
    const { data } = readJson(join(FIXTURES, 'non-string-text-koans.json'));
    const errors = validateKoans(data);
    expect(errors.some(e => e.field === 'koans[0].text')).toBe(true);
  });

  it('catches koans-not-array.json fixture', () => {
    const { data } = readJson(join(FIXTURES, 'koans-not-array.json'));
    const errors = validateKoans(data);
    expect(errors.some(e => e.field === 'koans' && e.message.includes('must be an array'))).toBe(true);
  });

  it('catches null-koans.json fixture', () => {
    const { data } = readJson(join(FIXTURES, 'null-koans.json'));
    const errors = validateKoans(data);
    expect(errors.some(e => e.field === '<root>')).toBe(true);
  });
});

// ─── validateAll Integration Tests ────────────────────────────────────

describe('validateAll with koans', () => {
  it('validates koans.json via validateAll', () => {
    const result = validateAll({
      siteDataPath: join(FIXTURES, 'valid-siteData.json'),
      contentPath: join(FIXTURES, 'valid-content.json'),
      seasonsPath: join(FIXTURES, 'valid-seasons.json'),
      koansPath: join(FIXTURES, 'valid-koans.json')
    });
    expect(result.valid).toBe(true);
    expect(result.koans.valid).toBe(true);
    expect(result.koans.errors).toHaveLength(0);
  });

  it('detects errors in malformed koans via validateAll', () => {
    const result = validateAll({
      siteDataPath: join(FIXTURES, 'valid-siteData.json'),
      contentPath: join(FIXTURES, 'valid-content.json'),
      seasonsPath: join(FIXTURES, 'valid-seasons.json'),
      koansPath: join(FIXTURES, 'empty-text-koans.json')
    });
    expect(result.valid).toBe(false);
    expect(result.koans.valid).toBe(false);
    expect(result.koans.errors.length).toBeGreaterThan(0);
  });

  it('includes koans errors in total error count', () => {
    const result = validateAll({
      siteDataPath: join(FIXTURES, 'valid-siteData.json'),
      contentPath: join(FIXTURES, 'valid-content.json'),
      seasonsPath: join(FIXTURES, 'valid-seasons.json'),
      koansPath: join(FIXTURES, 'empty-text-koans.json')
    });
    expect(result.valid).toBe(false);
    // koans has errors, so overall should be invalid
    expect(result.koans.errors.length).toBeGreaterThan(0);
  });
});
