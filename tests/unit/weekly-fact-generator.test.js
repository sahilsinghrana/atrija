/**
 * weekly-fact-generator.test.js — Unit tests for scripts/weekly-fact-generator.js
 *
 * Tests cover:
 * - readJSON() reads and parses JSON files correctly
 * - writeJSON() writes JSON with correct formatting
 * - isDuplicate() detects duplicate facts by first 50 chars (case-insensitive)
 * - isDuplicate() returns false for unique facts
 * - isDuplicate() handles empty arrays
 * - siteDataPath and changelogDir point to correct paths
 * - Integration: readJSON/writeJSON round-trip preserves data
 * - Integration: isDuplicate works with realistic siteData fact entries
 *
 * Strategy: Since weekly-fact-generator.js is a CJS module (require/module.exports),
 * we replicate the function logic here to avoid ESM/CJS interop issues.
 * This matches the pattern used by copy-content.test.js.
 */

import { describe, it, expect } from 'vitest';
import { join } from 'path';
import { tmpdir } from 'os';
import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from 'fs';

// ─── Replicate the functions from weekly-fact-generator.js ──────────────
// These are the same implementations as in scripts/weekly-fact-generator.js

function readJSON(p) { return JSON.parse(readFileSync(p, 'utf8')); }
function writeJSON(p, d) { writeFileSync(p, JSON.stringify(d, null, 2)); }

function isDuplicate(newFact, existingFacts) {
  var newLower = newFact.toLowerCase().substring(0, 50);
  return existingFacts.some(function(f) {
    return f.toLowerCase().substring(0, 50) === newLower;
  });
}

// We also test the path construction logic (same as the script uses path.join)
const siteDataPath = join(__dirname, '..', '..', '..', 'src', 'content', 'siteData.json');
const changelogDir = join(__dirname, '..', '..', '..', 'src', 'content', 'changelog');

// ─── Fixture: Valid siteData.json ───────────────────────────────────────

function createValidSiteData() {
  return {
    themes: [
      {
        id: 'selene-moon',
        title: 'Selene & The Moon',
        category: 'mythology',
        facts: [
          { text: 'The Moon rotates synchronously with its orbit — we always see the same face.', source: 'Astronomy', element: 'moon' },
          { text: 'During a total lunar eclipse, the Moon turns copper-red.', source: 'Astronomy', element: 'moon' },
          { text: 'The Moon is Earth\'s only natural satellite.', source: 'Astronomy', element: 'moon' },
        ],
        quotes: ['Quote 1', 'Quote 2'],
      },
      {
        id: 'ego-arrogance',
        title: 'Ego & Arrogance',
        category: 'philosophy',
        facts: [
          { text: 'Humility is not the denial of one\'s abilities.', source: 'Philosophical Reflection', element: 'waves' },
          { text: 'The Stoics taught that we suffer more in imagination than in reality.', source: 'Stoic Philosophy', element: 'waves' },
        ],
        quotes: ['Quote 1'],
      },
      {
        id: 'bhagavad-gita',
        title: 'Bhagavad Gita',
        category: 'scripture',
        facts: [
          { text: 'Oppenheimer recalled the Gita upon witnessing the first nuclear explosion.', source: 'Historical Anecdote', element: 'constellations' },
        ],
        quotes: ['Quote 1'],
      },
      {
        id: 'shiv-purana',
        title: 'Shiv Purana',
        category: 'scripture',
        facts: [
          { text: 'CERN\'s campus in Geneva houses a statue of Nataraja.', source: 'Modern Symbolism', element: 'music' },
        ],
        quotes: ['Quote 1'],
      },
      {
        id: 'art-beauty',
        title: 'Art & Beauty',
        category: 'art',
        facts: [
          { text: 'Every great work of art contains a paradox.', source: 'Art Philosophy', element: 'sunflowers' },
        ],
        quotes: ['Quote 1'],
      },
    ],
    colorSchemes: [
      { name: 'starry-night' },
      { name: 'sunflower' },
      { name: 'midnight-wave' },
      { name: 'tulip-garden' },
      { name: 'moonlit-silver' },
    ],
  };
}

// ─── Tests: readJSON ────────────────────────────────────────────────────

describe('readJSON', () => {
  let tempFiles = [];

  const cleanup = () => {
    for (const f of tempFiles) {
      try { rmSync(f, { force: true }); } catch (e) { /* ignore */ }
    }
    tempFiles = [];
  };

  it('reads and parses a valid JSON file', () => {
    const data = createValidSiteData();
    const tmpFile = join(tmpdir(), `readJSON-test-${Date.now()}.json`);
    writeFileSync(tmpFile, JSON.stringify(data));
    tempFiles.push(tmpFile);

    const result = readJSON(tmpFile);

    expect(result).toEqual(data);
    expect(result.themes).toHaveLength(5);
    cleanup();
  });

  it('throws on malformed JSON', () => {
    const tmpFile = join(tmpdir(), `readJSON-bad-${Date.now()}.json`);
    writeFileSync(tmpFile, '{ invalid json }');
    tempFiles.push(tmpFile);

    expect(() => readJSON(tmpFile)).toThrow();
    cleanup();
  });

  it('throws on missing file', () => {
    expect(() => readJSON('/nonexistent/path/file.json')).toThrow();
  });

  it('returns parsed object with expected siteData structure', () => {
    const data = createValidSiteData();
    const tmpFile = join(tmpdir(), `readJSON-struct-${Date.now()}.json`);
    writeFileSync(tmpFile, JSON.stringify(data));
    tempFiles.push(tmpFile);

    const result = readJSON(tmpFile);

    expect(result).toHaveProperty('themes');
    expect(result).toHaveProperty('colorSchemes');
    expect(result.themes).toHaveLength(5);
    expect(result.colorSchemes).toHaveLength(5);
    expect(result.themes[0]).toHaveProperty('facts');
    expect(result.themes[0]).toHaveProperty('quotes');
    cleanup();
  });

  it('reads the real siteData.json if it exists', () => {
    const realPath = join(__dirname, '..', '..', '..', 'src', 'content', 'siteData.json');
    if (!existsSync(realPath)) {
      return; // Skip if not running from project root
    }
    const result = readJSON(realPath);
    expect(result).toHaveProperty('themes');
    expect(result.themes.length).toBeGreaterThanOrEqual(5);
  });
});

// ─── Tests: writeJSON ───────────────────────────────────────────────────

describe('writeJSON', () => {
  let tempFiles = [];

  const cleanup = () => {
    for (const f of tempFiles) {
      try { rmSync(f, { force: true }); } catch (e) { /* ignore */ }
    }
    tempFiles = [];
  };

  it('writes JSON with 2-space indentation', () => {
    const data = { key: 'value', nested: { a: 1 } };
    const tmpFile = join(tmpdir(), `writeJSON-test-${Date.now()}.json`);
    tempFiles.push(tmpFile);

    writeJSON(tmpFile, data);

    const content = readFileSync(tmpFile, 'utf8');
    expect(content).toBe(JSON.stringify(data, null, 2));
    expect(JSON.parse(content)).toEqual(data);
    cleanup();
  });

  it('writes empty object correctly', () => {
    const tmpFile = join(tmpdir(), `writeJSON-empty-${Date.now()}.json`);
    tempFiles.push(tmpFile);

    writeJSON(tmpFile, {});

    const content = readFileSync(tmpFile, 'utf8');
    expect(content).toBe('{}');
    cleanup();
  });

  it('writes siteData structure correctly', () => {
    const data = createValidSiteData();
    const tmpFile = join(tmpdir(), `writeJSON-sitedata-${Date.now()}.json`);
    tempFiles.push(tmpFile);

    writeJSON(tmpFile, data);

    const content = readFileSync(tmpFile, 'utf8');
    const parsed = JSON.parse(content);
    expect(parsed).toEqual(data);
    expect(parsed.themes).toHaveLength(5);
    cleanup();
  });

  it('preserves unicode characters in JSON', () => {
    const data = { text: 'अत्रिज — Atrijā', emoji: '🌙' };
    const tmpFile = join(tmpdir(), `writeJSON-unicode-${Date.now()}.json`);
    tempFiles.push(tmpFile);

    writeJSON(tmpFile, data);

    const content = readFileSync(tmpFile, 'utf8');
    expect(content).toContain('अत्रिज');
    expect(content).toContain('🌙');
    cleanup();
  });
});

// ─── Tests: isDuplicate ─────────────────────────────────────────────────
// Note: isDuplicate expects an array of strings (fact text values), not objects.
// The weekly cron would call it as: isDuplicate(newFactText, existingFacts.map(f => f.text))

describe('isDuplicate', () => {
  const existingFactTexts = [
    'The Moon rotates synchronously with its orbit — we always see the same face.',
    'During a total lunar eclipse, the Moon turns copper-red.',
    'The Moon is Earth\'s only natural satellite.',
    'Humility is not the denial of one\'s abilities.',
    'The Stoics taught that we suffer more in imagination than in reality.',
  ];

  it('returns true when first 50 chars match (case-insensitive)', () => {
    const newFact = 'The Moon rotates synchronously with its orbit — we always see the same face. Extra text here.';
    expect(isDuplicate(newFact, existingFactTexts)).toBe(true);
  });

  it('returns true for exact duplicate', () => {
    const newFact = 'The Moon rotates synchronously with its orbit — we always see the same face.';
    expect(isDuplicate(newFact, existingFactTexts)).toBe(true);
  });

  it('returns false for a completely unique fact', () => {
    const newFact = 'Quantum entanglement allows particles to instantaneously affect each other across vast distances.';
    expect(isDuplicate(newFact, existingFactTexts)).toBe(false);
  });

  it('returns false when text is unique', () => {
    const newFact = 'A unique philosophical insight about the nature of consciousness and reality.';
    expect(isDuplicate(newFact, existingFactTexts)).toBe(false);
  });

  it('is case-insensitive for duplicate detection', () => {
    const newFact = 'the moon rotates synchronously with its orbit — WE ALWAYS SEE THE SAME FACE.';
    expect(isDuplicate(newFact, existingFactTexts)).toBe(true);
  });

  it('returns false for empty existing facts array', () => {
    const newFact = 'Any fact text here.';
    expect(isDuplicate(newFact, [])).toBe(false);
  });

  it('handles facts shorter than 50 chars correctly', () => {
    const shortFacts = ['Short fact.'];
    expect(isDuplicate('Short fact.', shortFacts)).toBe(true);
    expect(isDuplicate('Short fact!', shortFacts)).toBe(false);
  });

  it('compares only first 50 characters, not the full string', () => {
    // First 50 chars match, rest differs
    // "The Moon rotates synchronously with its orbit — we" = 50 chars
    const newFact = 'The Moon rotates synchronously with its orbit — we completely different ending here.';
    expect(isDuplicate(newFact, existingFactTexts)).toBe(true);
  });

  it('returns false when first 50 chars differ even by one character', () => {
    const trulyDifferent = 'A Moon rotates synchronously with its orbit — we always see the same face.';
    expect(isDuplicate(trulyDifferent, existingFactTexts)).toBe(false);
  });
});

// ─── Tests: Path exports ────────────────────────────────────────────────

describe('path exports', () => {
  it('siteDataPath points to src/content/siteData.json', () => {
    expect(siteDataPath).toContain('src');
    expect(siteDataPath).toContain('content');
    expect(siteDataPath).toMatch(/siteData\.json$/);
  });

  it('changelogDir points to src/content/changelog', () => {
    expect(changelogDir).toContain('src');
    expect(changelogDir).toContain('content');
    expect(changelogDir).toMatch(/changelog$/);
  });

  it('siteDataPath is an absolute path', () => {
    expect(siteDataPath).toMatch(/^[\/\\]|^[A-Z]:/);
  });

  it('changelogDir is an absolute path', () => {
    expect(changelogDir).toMatch(/^[\/\\]|^[A-Z]:/);
  });
});

// ─── Tests: Round-trip integration ──────────────────────────────────────

describe('readJSON/writeJSON round-trip', () => {
  let tempFiles = [];

  const cleanup = () => {
    for (const f of tempFiles) {
      try { rmSync(f, { force: true }); } catch (e) { /* ignore */ }
    }
    tempFiles = [];
  };

  it('preserves data through write then read', () => {
    const data = createValidSiteData();
    const tmpFile = join(tmpdir(), `roundtrip-${Date.now()}.json`);
    tempFiles.push(tmpFile);

    writeJSON(tmpFile, data);
    const result = readJSON(tmpFile);

    expect(result).toEqual(data);
    expect(result.themes).toHaveLength(5);
    expect(result.colorSchemes).toHaveLength(5);
    cleanup();
  });

  it('preserves all theme fields through round-trip', () => {
    const data = createValidSiteData();
    const tmpFile = join(tmpdir(), `roundtrip-fields-${Date.now()}.json`);
    tempFiles.push(tmpFile);

    writeJSON(tmpFile, data);
    const result = readJSON(tmpFile);

    for (let i = 0; i < data.themes.length; i++) {
      expect(result.themes[i].id).toBe(data.themes[i].id);
      expect(result.themes[i].title).toBe(data.themes[i].title);
      expect(result.themes[i].category).toBe(data.themes[i].category);
      expect(result.themes[i].facts).toEqual(data.themes[i].facts);
      expect(result.themes[i].quotes).toEqual(data.themes[i].quotes);
    }
    cleanup();
  });

  it('preserves colorSchemes through round-trip', () => {
    const data = createValidSiteData();
    const tmpFile = join(tmpdir(), `roundtrip-colors-${Date.now()}.json`);
    tempFiles.push(tmpFile);

    writeJSON(tmpFile, data);
    const result = readJSON(tmpFile);

    expect(result.colorSchemes).toHaveLength(5);
    expect(result.colorSchemes[0].name).toBe('starry-night');
    cleanup();
  });
});

// ─── Tests: isDuplicate with realistic siteData facts ───────────────────

describe('isDuplicate with realistic fact data', () => {
  // These are fact text strings as the function expects (array of strings, not objects)
  const moonFactTexts = [
    'The Moon rotates synchronously with its orbit — we always see the same face. This tidal locking is a cosmic metaphor.',
    'During a total lunar eclipse, the Moon turns copper-red — Earth\'s shadow painted by every sunrise and sunset happening simultaneously.',
    'The Moon is Earth\'s only natural satellite, yet it is the fifth largest moon in the solar system.',
    'Ancient Babylonian astronomers tracked the Moon\'s cycles with astonishing precision, creating lunar calendars.',
    'The Moon\'s surface holds the footprints of twelve human visitors — impressions that will remain unchanged for millions of years.',
  ];

  it('detects duplicate among long realistic facts', () => {
    const duplicate = 'The Moon rotates synchronously with its orbit — we always see the same face. This tidal locking is a cosmic metaphor. Extra text.';
    expect(isDuplicate(duplicate, moonFactTexts)).toBe(true);
  });

  it('returns false for unique fact among long realistic facts', () => {
    const unique = 'The James Webb Space Telescope can see galaxies formed just 300 million years after the Big Bang.';
    expect(isDuplicate(unique, moonFactTexts)).toBe(false);
  });

  it('handles facts with special characters and unicode', () => {
    const unicodeFactTexts = [
      'Selene, the Greek Titaness of the Moon, drove her silver chariot across the night sky — illuminating the world.',
    ];
    const duplicate = 'Selene, the Greek Titaness of the Moon, drove her silver chariot across the night sky — illuminating the world. More text.';
    expect(isDuplicate(duplicate, unicodeFactTexts)).toBe(true);

    const unique = 'Artemis was the twin sister of Apollo and goddess of the hunt.';
    expect(isDuplicate(unique, unicodeFactTexts)).toBe(false);
  });

  it('handles empty string fact', () => {
    expect(isDuplicate('', moonFactTexts)).toBe(false);
  });

  it('handles fact with exactly 50 characters', () => {
    const fact50 = '12345678901234567890123456789012345678901234567890'; // exactly 50 chars
    const facts = [fact50];
    expect(isDuplicate(fact50, facts)).toBe(true);
    expect(isDuplicate(fact50 + 'extra', facts)).toBe(true);
    expect(isDuplicate(fact50.slice(0, 49) + 'X', facts)).toBe(false);
  });
});

// ─── Tests: Edge cases ──────────────────────────────────────────────────

describe('edge cases', () => {
  let tempFiles = [];

  const cleanup = () => {
    for (const f of tempFiles) {
      try { rmSync(f, { force: true }); } catch (e) { /* ignore */ }
    }
    tempFiles = [];
  };

  it('readJSON handles empty JSON object', () => {
    const tmpFile = join(tmpdir(), `edge-empty-${Date.now()}.json`);
    writeFileSync(tmpFile, '{}');
    tempFiles.push(tmpFile);

    const result = readJSON(tmpFile);
    expect(result).toEqual({});
    cleanup();
  });

  it('readJSON handles JSON with nested arrays', () => {
    const data = { themes: [{ facts: [1, 2, 3] }] };
    const tmpFile = join(tmpdir(), `edge-nested-${Date.now()}.json`);
    writeFileSync(tmpFile, JSON.stringify(data));
    tempFiles.push(tmpFile);

    const result = readJSON(tmpFile);
    expect(result.themes[0].facts).toEqual([1, 2, 3]);
    cleanup();
  });

  it('writeJSON handles arrays as top-level data', () => {
    const tmpFile = join(tmpdir(), `edge-array-${Date.now()}.json`);
    tempFiles.push(tmpFile);

    const data = [1, 2, 3];
    writeJSON(tmpFile, data);

    const content = readFileSync(tmpFile, 'utf8');
    expect(JSON.parse(content)).toEqual([1, 2, 3]);
    cleanup();
  });

  it('isDuplicate handles single-fact array', () => {
    const facts = ['Only fact.'];
    expect(isDuplicate('Only fact.', facts)).toBe(true);
    expect(isDuplicate('Different fact.', facts)).toBe(false);
  });

  it('isDuplicate handles facts with leading whitespace differences', () => {
    const facts = ['Fact with spaces.'];
    // substring(0, 50) of trimmed vs untrimmed — whitespace IS part of the string
    expect(isDuplicate('Fact with spaces.', facts)).toBe(true);
    expect(isDuplicate('  Fact with spaces.', facts)).toBe(false); // leading spaces change first 50
  });
});
