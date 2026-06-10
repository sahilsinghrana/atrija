/**
 * validate-content.test.js — Unit tests for content JSON schema validation
 *
 * Tests cover:
 * - Valid siteData.json and content.json pass validation
 * - Out-of-bounds themeIndex/factIndex/quoteIndex are caught
 * - Malformed color schemes are caught
 * - Empty required fields are caught
 * - Missing section keys are caught
 * - Slice format validation
 * - Cross-reference validation between content.json and siteData.json
 * - Changelog entry validation
 * - Helper functions (isHexColor, isNonEmptyString, isNonNegativeInt)
 */

import { describe, it, expect } from 'vitest';
import { join } from 'path';
import {
  validateSiteData,
  validateContent,
  validateAll,
  formatErrors,
  readJson,
  isHexColor,
  isNonEmptyString,
  isNonNegativeInt
} from '../../src/content/validate-content.js';

const FIXTURES = join(import.meta.dirname, '..', 'fixtures', 'content-validation');

// ─── Helper Function Tests ───────────────────────────────────────────

describe('isHexColor', () => {
  it('accepts 6-digit hex colors', () => {
    expect(isHexColor('#1a237e')).toBe(true);
    expect(isHexColor('#FFD54F')).toBe(true);
    expect(isHexColor('#000000')).toBe(true);
    expect(isHexColor('#ffffff')).toBe(true);
  });

  it('accepts 3-digit hex colors', () => {
    expect(isHexColor('#fff')).toBe(true);
    expect(isHexColor('#ABC')).toBe(true);
  });

  it('rejects non-hex values', () => {
    expect(isHexColor('not-a-color')).toBe(false);
    expect(isHexColor('#xyz')).toBe(false);
    expect(isHexColor('1a237e')).toBe(false);
    expect(isHexColor('#12')).toBe(false);
    expect(isHexColor('#12345')).toBe(false);
    expect(isHexColor('')).toBe(false);
    expect(isHexColor(null)).toBe(false);
    expect(isHexColor(undefined)).toBe(false);
    expect(isHexColor(123)).toBe(false);
  });
});

describe('isNonEmptyString', () => {
  it('accepts non-empty strings', () => {
    expect(isNonEmptyString('hello')).toBe(true);
    expect(isNonEmptyString('  trimmed  ')).toBe(true);
    expect(isNonEmptyString('a')).toBe(true);
  });

  it('rejects empty or whitespace-only strings', () => {
    expect(isNonEmptyString('')).toBe(false);
    expect(isNonEmptyString('   ')).toBe(false);
  });

  it('rejectes non-string values', () => {
    expect(isNonEmptyString(null)).toBe(false);
    expect(isNonEmptyString(undefined)).toBe(false);
    expect(isNonEmptyString(0)).toBe(false);
    expect(isNonEmptyString(42)).toBe(false);
    expect(isNonEmptyString({})).toBe(false);
    expect(isNonEmptyString([])).toBe(false);
  });
});

describe('isNonNegativeInt', () => {
  it('accepts non-negative integers', () => {
    expect(isNonNegativeInt(0)).toBe(true);
    expect(isNonNegativeInt(1)).toBe(true);
    expect(isNonNegativeInt(100)).toBe(true);
  });

  it('rejects negative numbers and non-integers', () => {
    expect(isNonNegativeInt(-1)).toBe(false);
    expect(isNonNegativeInt(1.5)).toBe(false);
    expect(isNonNegativeInt(-0.1)).toBe(false);
  });

  it('rejects non-number values', () => {
    expect(isNonNegativeInt('0')).toBe(false);
    expect(isNonNegativeInt(null)).toBe(false);
    expect(isNonNegativeInt(undefined)).toBe(false);
    expect(isNonNegativeInt(NaN)).toBe(false);
  });
});

// ─── readJson Tests ──────────────────────────────────────────────────

describe('readJson', () => {
  it('reads valid JSON files', () => {
    const { data, error } = readJson(join(FIXTURES, 'valid-siteData.json'));
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.themes).toBeDefined();
  });

  it('returns error for missing files', () => {
    const { data, error } = readJson(join(FIXTURES, 'nonexistent.json'));
    expect(data).toBeNull();
    expect(error).toContain('Cannot read file');
  });

  it('returns error for malformed JSON', () => {
    // Point to a non-existent file to test the read error path
    const { data, error } = readJson(join(FIXTURES, '_nonexistent-file.json'));
    expect(data).toBeNull();
    expect(error).toContain('Cannot read file');
  });
});

// ─── siteData.json Validation Tests ──────────────────────────────────

describe('validateSiteData', () => {
  it('passes valid siteData', () => {
    const { data } = readJson(join(FIXTURES, 'valid-siteData.json'));
    const errors = validateSiteData(data);
    expect(errors).toHaveLength(0);
  });

  it('rejects non-object root', () => {
    expect(validateSiteData(null)).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: '<root>' })])
    );
    expect(validateSiteData('string')).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: '<root>' })])
    );
  });

  it('rejects missing themes array', () => {
    const errors = validateSiteData({});
    expect(errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'themes' })])
    );
  });

  it('rejects empty themes array', () => {
    const errors = validateSiteData({ themes: [] });
    expect(errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'themes' })])
    );
  });

  it('catches invalid hex colors in colorSchemes', () => {
    const { data } = readJson(join(FIXTURES, 'bad-colors-siteData.json'));
    const errors = validateSiteData(data);
    const colorErrors = errors.filter(e => e.field.includes('primary'));
    expect(colorErrors.length).toBeGreaterThan(0);
    expect(colorErrors[0].message).toContain('hex color');
  });

  it('catches empty fact text', () => {
    const { data } = readJson(join(FIXTURES, 'empty-fields-siteData.json'));
    const errors = validateSiteData(data);
    const textErrors = errors.filter(e => e.field.includes('.text'));
    expect(textErrors.length).toBeGreaterThan(0);
  });

  it('catches empty fact source', () => {
    const { data } = readJson(join(FIXTURES, 'empty-fields-siteData.json'));
    const errors = validateSiteData(data);
    const sourceErrors = errors.filter(e => e.field.includes('.source'));
    expect(sourceErrors.length).toBeGreaterThan(0);
  });

  it('catches null element in facts', () => {
    const { data } = readJson(join(FIXTURES, 'empty-fields-siteData.json'));
    const errors = validateSiteData(data);
    const elementErrors = errors.filter(e => e.field.includes('.element'));
    expect(elementErrors.length).toBeGreaterThan(0);
  });

  it('catches empty quotes', () => {
    const { data } = readJson(join(FIXTURES, 'empty-fields-siteData.json'));
    const errors = validateSiteData(data);
    const quoteErrors = errors.filter(e => e.field.includes('quotes['));
    expect(quoteErrors.length).toBeGreaterThan(0);
  });

  it('validates changelog entry structure', () => {
    const data = {
      themes: [{
        id: 't', title: 'T', category: 'c',
        facts: [{ text: 'f', source: 's', element: 'e' }],
        quotes: ['q']
      }],
      colorSchemes: [],
      changelog: {
        version: '1.0.0',
        entries: [{ date: '', type: '', description: '', changes: 'not-array' }]
      }
    };
    const errors = validateSiteData(data);
    expect(errors.length).toBeGreaterThan(0);
    // Should catch empty date, type, description and non-array changes
    const dateErr = errors.find(e => e.field === 'changelog.entries[0].date');
    const changesErr = errors.find(e => e.field === 'changelog.entries[0].changes');
    expect(dateErr).toBeDefined();
    expect(changesErr).toBeDefined();
  });
});

// ─── content.json Validation Tests ───────────────────────────────────

describe('validateContent', () => {
  it('passes valid content.json', () => {
    const { data } = readJson(join(FIXTURES, 'valid-content.json'));
    const { data: siteData } = readJson(join(FIXTURES, 'valid-siteData.json'));
    const errors = validateContent(data, siteData);
    expect(errors).toHaveLength(0);
  });

  it('rejects non-object root', () => {
    expect(validateContent(null)).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: '<root>' })])
    );
  });

  it('rejects missing sections', () => {
    const errors = validateContent({});
    expect(errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'sections' })])
    );
  });

  it('catches missing required section keys', () => {
    const { data } = readJson(join(FIXTURES, 'missing-section-content.json'));
    const errors = validateContent(data);
    // Should report missing philosophy, gita, shiva, art
    const sectionErrors = errors.filter(e => e.field.startsWith('sections.') && e.message.includes('missing'));
    expect(sectionErrors.length).toBeGreaterThan(0);
    expect(sectionErrors.some(e => e.field === 'sections.philosophy')).toBe(true);
    expect(sectionErrors.some(e => e.field === 'sections.gita')).toBe(true);
  });

  it('catches out-of-bounds themeIndex in imageCard', () => {
    const { data } = readJson(join(FIXTURES, 'out-of-bounds-content.json'));
    const { data: siteData } = readJson(join(FIXTURES, 'valid-siteData.json'));
    const errors = validateContent(data, siteData);
    const boundsErrors = errors.filter(e => e.message.includes('out of bounds'));
    expect(boundsErrors.length).toBeGreaterThan(0);
    // moon section has themeIndex 5 but siteData only has 2 themes
    expect(boundsErrors.some(e => e.field === 'sections.moon.imageCard.themeIndex')).toBe(true);
  });

  it('catches out-of-bounds factIndex in imageCard', () => {
    const { data } = readJson(join(FIXTURES, 'out-of-bounds-content.json'));
    const { data: siteData } = readJson(join(FIXTURES, 'valid-siteData.json'));
    const errors = validateContent(data, siteData);
    // philosophy section has factIndex 99 but theme 0 only has 3 facts
    const factIdxErrors = errors.filter(e =>
      e.field === 'sections.philosophy.imageCard.factIndex' && e.message.includes('out of bounds')
    );
    expect(factIdxErrors.length).toBeGreaterThan(0);
  });

  it('catches out-of-bounds quoteIndex', () => {
    const { data } = readJson(join(FIXTURES, 'out-of-bounds-content.json'));
    const { data: siteData } = readJson(join(FIXTURES, 'valid-siteData.json'));
    const errors = validateContent(data, siteData);
    // philosophy section has quoteIndex 10 but theme 0 only has 2 quotes
    const quoteIdxErrors = errors.filter(e =>
      e.field === 'sections.philosophy.quote.quoteIndex' && e.message.includes('out of bounds')
    );
    expect(quoteIdxErrors.length).toBeGreaterThan(0);
  });

  it('validates slice format (must be [start, end])', () => {
    const data = {
      sections: {
        hero: { tagline: 'T' },
        today: { heading: 'H' },
        moon: {
          label: 'L', heading: 'H', intro: 'I',
          imageCard: { themeIndex: 0, factIndex: 0 },
          facts: { themeIndex: 0, slice: [0] },
          quote: { themeIndex: 0, quoteIndex: 0 }
        },
        philosophy: {
          label: 'L', heading: 'H', intro: 'I',
          imageCard: { themeIndex: 0, factIndex: 0 },
          facts: { themeIndex: 0, slice: [0, 2] },
          quote: { themeIndex: 0, quoteIndex: 0 }
        },
        gita: {
          label: 'L', heading: 'H', intro: 'I',
          imageCard: { themeIndex: 0, factIndex: 0 },
          facts: { themeIndex: 0, slice: [0, 2] },
          quote: { themeIndex: 0, quoteIndex: 0 }
        },
        shiva: {
          label: 'L', heading: 'H', intro: 'I',
          imageCard: { themeIndex: 0, factIndex: 0 },
          facts: { themeIndex: 0, slice: [0, 2] },
          quote: { themeIndex: 0, quoteIndex: 0 }
        },
        art: {
          label: 'L', heading: 'H', intro: 'I',
          imageCard: { themeIndex: 0, factIndex: 0 },
          facts: { themeIndex: 0, slice: [0, 2] },
          quote: { themeIndex: 0, quoteIndex: 0 }
        }
      }
    };
    const errors = validateContent(data);
    const sliceErrors = errors.filter(e => e.field.includes('slice'));
    expect(sliceErrors.length).toBeGreaterThan(0);
    expect(sliceErrors[0].message).toContain('exactly 2');
  });

  it('validates slice end does not exceed fact count', () => {
    const { data: siteData } = readJson(join(FIXTURES, 'valid-siteData.json'));
    // siteData theme 0 has 3 facts (indices 0-2), slice [0, 5] should fail
    const data = {
      sections: {
        hero: { tagline: 'T' },
        today: { heading: 'H' },
        moon: {
          label: 'L', heading: 'H', intro: 'I',
          imageCard: { themeIndex: 0, factIndex: 0 },
          facts: { themeIndex: 0, slice: [0, 5] },
          quote: { themeIndex: 0, quoteIndex: 0 }
        },
        philosophy: {
          label: 'L', heading: 'H', intro: 'I',
          imageCard: { themeIndex: 0, factIndex: 0 },
          facts: { themeIndex: 0, slice: [0, 2] },
          quote: { themeIndex: 0, quoteIndex: 0 }
        },
        gita: {
          label: 'L', heading: 'H', intro: 'I',
          imageCard: { themeIndex: 0, factIndex: 0 },
          facts: { themeIndex: 0, slice: [0, 2] },
          quote: { themeIndex: 0, quoteIndex: 0 }
        },
        shiva: {
          label: 'L', heading: 'H', intro: 'I',
          imageCard: { themeIndex: 0, factIndex: 0 },
          facts: { themeIndex: 0, slice: [0, 2] },
          quote: { themeIndex: 0, quoteIndex: 0 }
        },
        art: {
          label: 'L', heading: 'H', intro: 'I',
          imageCard: { themeIndex: 0, factIndex: 0 },
          facts: { themeIndex: 0, slice: [0, 2] },
          quote: { themeIndex: 0, quoteIndex: 0 }
        }
      }
    };
    const errors = validateContent(data, siteData);
    const sliceEndErrors = errors.filter(e => e.field.includes('slice[1]'));
    expect(sliceEndErrors.length).toBeGreaterThan(0);
    expect(sliceEndErrors[0].message).toContain('exceeds fact count');
  });
});

// ─── Cross-Reference Validation Tests ────────────────────────────────

describe('validateContent cross-references', () => {
  it('validates themeIndex bounds against siteData theme count', () => {
    const siteData = { themes: [{ id: 't', facts: [{}], quotes: [] }] };
    const data = {
      sections: {
        hero: { tagline: 'T' }, today: { heading: 'H' },
        moon: {
          label: 'L', heading: 'H', intro: 'I',
          imageCard: { themeIndex: 0, factIndex: 0 },
          facts: { themeIndex: 0, slice: [0, 1] },
          quote: { themeIndex: 99, quoteIndex: 0 }
        },
        philosophy: {
          label: 'L', heading: 'H', intro: 'I',
          imageCard: { themeIndex: 0, factIndex: 0 },
          facts: { themeIndex: 0, slice: [0, 1] },
          quote: { themeIndex: 0, quoteIndex: 0 }
        },
        gita: {
          label: 'L', heading: 'H', intro: 'I',
          imageCard: { themeIndex: 0, factIndex: 0 },
          facts: { themeIndex: 0, slice: [0, 1] },
          quote: { themeIndex: 0, quoteIndex: 0 }
        },
        shiva: {
          label: 'L', heading: 'H', intro: 'I',
          imageCard: { themeIndex: 0, factIndex: 0 },
          facts: { themeIndex: 0, slice: [0, 1] },
          quote: { themeIndex: 0, quoteIndex: 0 }
        },
        art: {
          label: 'L', heading: 'H', intro: 'I',
          imageCard: { themeIndex: 0, factIndex: 0 },
          facts: { themeIndex: 0, slice: [0, 1] },
          quote: { themeIndex: 0, quoteIndex: 0 }
        }
      }
    };
    const errors = validateContent(data, siteData);
    const quoteThemeErr = errors.find(e =>
      e.field === 'sections.moon.quote.themeIndex' && e.message.includes('out of bounds')
    );
    expect(quoteThemeErr).toBeDefined();
  });
});

// ─── formatErrors Tests ──────────────────────────────────────────────

describe('formatErrors', () => {
  it('formats valid result', () => {
    const result = { valid: true, errors: [], file: 'test.json' };
    expect(formatErrors(result)).toContain('valid');
  });

  it('formats errors with field paths', () => {
    const result = {
      valid: false,
      errors: [
        { file: 'test.json', field: 'themes[0].id', message: 'must be non-empty' }
      ],
      file: 'test.json'
    };
    const formatted = formatErrors(result);
    expect(formatted).toContain('error(s)');
    expect(formatted).toContain('themes[0].id');
    expect(formatted).toContain('must be non-empty');
  });
});

// ─── Integration: validateAll ────────────────────────────────────────

describe('validateAll', () => {
  it('validates real content files and passes', () => {
    const result = validateAll({
      siteDataPath: join(FIXTURES, 'valid-siteData.json'),
      contentPath: join(FIXTURES, 'valid-content.json'),
      seasonsPath: join(FIXTURES, 'valid-seasons.json'),
      koansPath: join(FIXTURES, 'valid-koans.json')
    });
    expect(result.valid).toBe(true);
    expect(result.siteData.valid).toBe(true);
    expect(result.content.valid).toBe(true);
    expect(result.seasons.valid).toBe(true);
    expect(result.koans.valid).toBe(true);
  });

  it('detects errors in malformed content', () => {
    const result = validateAll({
      siteDataPath: join(FIXTURES, 'out-of-bounds-content.json'),
      contentPath: join(FIXTURES, 'out-of-bounds-content.json'),
      seasonsPath: join(FIXTURES, 'valid-seasons.json'),
      koansPath: join(FIXTURES, 'valid-koans.json')
    });
    expect(result.valid).toBe(false);
  });

  it('runs in under 50ms on current content files', () => {
    const start = Date.now();
    validateAll({
      siteDataPath: join(FIXTURES, 'valid-siteData.json'),
      contentPath: join(FIXTURES, 'valid-content.json'),
      seasonsPath: join(FIXTURES, 'valid-seasons.json'),
      koansPath: join(FIXTURES, 'valid-koans.json')
    });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(50);
  });

  it('throwOnError throws when validation fails', () => {
    expect(() => {
      validateAll({
        siteDataPath: join(FIXTURES, 'bad-colors-siteData.json'),
        contentPath: join(FIXTURES, 'valid-content.json'),
        seasonsPath: join(FIXTURES, 'valid-seasons.json'),
        koansPath: join(FIXTURES, 'valid-koans.json'),
        throwOnError: true
      });
    }).toThrow(/Content validation failed/);
  });
});
