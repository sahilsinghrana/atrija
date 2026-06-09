/**
 * validate-changelog.test.js — Unit tests for changelog date-file validation
 *
 * Tests cover:
 * - Valid changelog date file passes validation
 * - Missing time field is caught
 * - Invalid entry type enum is caught
 * - Empty entries array is caught
 * - Missing date field is caught
 * - Invalid date format is caught
 * - Empty string in changes array is caught
 * - Non-object root is caught
 * - Non-array entries is caught
 * - Description exceeding 200 characters is caught
 * - Report mode includes changelog result
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { join } from 'path';
import { mkdirSync, writeFileSync, rmSync, readFileSync } from 'fs';
import {
  validateChangelogDateFile,
  validateChangelogDir,
  validateAll,
} from '../../src/content/validate-content.js';

const FIXTURES = join(import.meta.dirname, '..', 'fixtures', 'content-validation');

// Helper to create temp directories with files
function setupTmpDir(name, files) {
  const tmpDir = join('/tmp', name);
  mkdirSync(tmpDir, { recursive: true });
  for (const [fname, content] of Object.entries(files)) {
    writeFileSync(join(tmpDir, fname), typeof content === 'string' ? content : JSON.stringify(content));
  }
  return tmpDir;
}

// ─── Valid Changelog Tests ────────────────────────────────────────────

describe('validateChangelogDateFile', () => {
  it('passes a valid changelog date file', () => {
    const data = {
      date: '2026-06-10',
      entries: [
        {
          time: '03:00:00',
          type: 'feature',
          description: 'A valid changelog entry',
          changes: ['Change 1', 'Change 2']
        }
      ]
    };
    const errors = validateChangelogDateFile(data, 'test.json');
    expect(errors).toHaveLength(0);
  });

  it('accepts all valid entry types', () => {
    const types = ['daily-mutation', 'feature', 'fix', 'content', 'design', 'refactor', 'perf', 'chore'];
    for (const type of types) {
      const data = {
        date: '2026-06-10',
        entries: [{ time: '10:00:00', type, description: 'Test', changes: ['c'] }]
      };
      const errors = validateChangelogDateFile(data, 'test.json');
      expect(errors).toHaveLength(0);
    }
  });

  it('accepts the valid fixture file', () => {
    const data = JSON.parse(readFileSync(join(FIXTURES, 'valid-changelog-date.json'), 'utf8'));
    const errors = validateChangelogDateFile(data, 'test.json');
    expect(errors).toHaveLength(0);
  });

  it('accepts multiple entries in a single file', () => {
    const data = {
      date: '2026-06-10',
      entries: [
        { time: '03:00:00', type: 'daily-mutation', description: 'Morning mutation', changes: ['c1'] },
        { time: '12:00:00', type: 'feature', description: 'Afternoon feature', changes: ['c2'] },
        { time: '18:30:00', type: 'fix', description: 'Evening fix', changes: ['c3'] }
      ]
    };
    const errors = validateChangelogDateFile(data, 'test.json');
    expect(errors).toHaveLength(0);
  });
});

// ─── Non-Object Root Tests ────────────────────────────────────────────

describe('validateChangelogDateFile non-object root', () => {
  it('rejects null root', () => {
    expect(validateChangelogDateFile(null, 'test.json')).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: '<root>' })])
    );
  });

  it('rejects string root', () => {
    expect(validateChangelogDateFile('string', 'test.json')).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: '<root>' })])
    );
  });

  it('rejects number root', () => {
    expect(validateChangelogDateFile(42, 'test.json')).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: '<root>' })])
    );
  });
});

// ─── Missing Date Field Tests ─────────────────────────────────────────

describe('validateChangelogDateFile missing date', () => {
  it('catches missing date field', () => {
    const data = JSON.parse(readFileSync(join(FIXTURES, 'missing-date-changelog.json'), 'utf8'));
    const errors = validateChangelogDateFile(data, 'test.json');
    expect(errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'date' })])
    );
    expect(errors[0].message).toContain('non-empty string');
  });

  it('catches empty date string', () => {
    const data = {
      date: '',
      entries: [{ time: '03:00:00', type: 'feature', description: 'test', changes: ['c'] }]
    };
    const errors = validateChangelogDateFile(data, 'test.json');
    expect(errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'date' })])
    );
  });
});

// ─── Invalid Date Format Tests ────────────────────────────────────────

describe('validateChangelogDateFile invalid date format', () => {
  it('catches invalid date format (month 13, day 45)', () => {
    const data = JSON.parse(readFileSync(join(FIXTURES, 'invalid-date-changelog.json'), 'utf8'));
    const errors = validateChangelogDateFile(data, 'test.json');
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'date',
          message: expect.stringContaining('YYYY-MM-DD')
        })
      ])
    );
  });

  it('catches non-date string', () => {
    const data = {
      date: 'not-a-date',
      entries: [{ time: '03:00:00', type: 'feature', description: 'test', changes: ['c'] }]
    };
    const errors = validateChangelogDateFile(data, 'test.json');
    const dateErrors = errors.filter(e => e.field === 'date');
    expect(dateErrors.length).toBeGreaterThan(0);
    expect(dateErrors[0].message).toContain('YYYY-MM-DD');
  });
});

// ─── Entries Validation Tests ─────────────────────────────────────────

describe('validateChangelogDateFile entries validation', () => {
  it('rejects non-array entries', () => {
    const data = { date: '2026-06-10', entries: 'not-an-array' };
    const errors = validateChangelogDateFile(data, 'test.json');
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'entries',
          message: expect.stringContaining('must be an array')
        })
      ])
    );
  });

  it('rejects empty entries array', () => {
    const data = { date: '2026-06-10', entries: [] };
    const errors = validateChangelogDateFile(data, 'test.json');
    expect(errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'entries' })])
    );
    expect(errors[0].message).toContain('must not be empty');
  });
});

// ─── Missing Time Field Tests ─────────────────────────────────────────

describe('validateChangelogDateFile missing time', () => {
  it('catches missing/empty time field', () => {
    const data = JSON.parse(readFileSync(join(FIXTURES, 'missing-time-changelog.json'), 'utf8'));
    const errors = validateChangelogDateFile(data, 'test.json');
    const timeErrors = errors.filter(e => e.field === 'entries[1].time');
    expect(timeErrors.length).toBeGreaterThan(0);
    expect(timeErrors[0].message).toContain('time');
  });

  it('catches invalid time format', () => {
    const data = {
      date: '2026-06-10',
      entries: [{ time: '3am', type: 'feature', description: 'test', changes: ['c'] }]
    };
    const errors = validateChangelogDateFile(data, 'test.json');
    const timeErrors = errors.filter(e => e.field === 'entries[0].time');
    expect(timeErrors.length).toBeGreaterThan(0);
    expect(timeErrors[0].message).toContain('HH:MM:SS');
  });
});

// ─── Invalid Type Enum Tests ──────────────────────────────────────────

describe('validateChangelogDateFile invalid type', () => {
  it('catches invalid entry type', () => {
    const data = JSON.parse(readFileSync(join(FIXTURES, 'invalid-type-changelog.json'), 'utf8'));
    const errors = validateChangelogDateFile(data, 'test.json');
    const typeErrors = errors.filter(e => e.field === 'entries[0].type');
    expect(typeErrors.length).toBeGreaterThan(0);
    expect(typeErrors[0].message).toContain('must be one of');
  });

  it('catches empty type string', () => {
    const data = {
      date: '2026-06-10',
      entries: [{ time: '03:00:00', type: '', description: 'test', changes: ['c'] }]
    };
    const errors = validateChangelogDateFile(data, 'test.json');
    const typeErrors = errors.filter(e => e.field === 'entries[0].type');
    expect(typeErrors.length).toBeGreaterThan(0);
  });
});

// ─── Description Length Tests ─────────────────────────────────────────

describe('validateChangelogDateFile description', () => {
  it('catches missing description', () => {
    const data = {
      date: '2026-06-10',
      entries: [{ time: '03:00:00', type: 'feature', changes: ['c'] }]
    };
    const errors = validateChangelogDateFile(data, 'test.json');
    const descErrors = errors.filter(e => e.field === 'entries[0].description');
    expect(descErrors.length).toBeGreaterThan(0);
  });

  it('catches description exceeding 200 characters', () => {
    const longDesc = 'A'.repeat(201);
    const data = {
      date: '2026-06-10',
      entries: [{ time: '03:00:00', type: 'feature', description: longDesc, changes: ['c'] }]
    };
    const errors = validateChangelogDateFile(data, 'test.json');
    const descErrors = errors.filter(e => e.field === 'entries[0].description');
    expect(descErrors.length).toBeGreaterThan(0);
    expect(descErrors[0].message).toContain('200');
  });

  it('accepts description at exactly 200 characters', () => {
    const exactDesc = 'A'.repeat(200);
    const data = {
      date: '2026-06-10',
      entries: [{ time: '03:00:00', type: 'feature', description: exactDesc, changes: ['c'] }]
    };
    const errors = validateChangelogDateFile(data, 'test.json');
    expect(errors).toHaveLength(0);
  });
});

// ─── Changes Array Tests ──────────────────────────────────────────────

describe('validateChangelogDateFile changes', () => {
  it('catches non-array changes', () => {
    const data = {
      date: '2026-06-10',
      entries: [{ time: '03:00:00', type: 'feature', description: 'test', changes: 'string' }]
    };
    const errors = validateChangelogDateFile(data, 'test.json');
    expect(errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'entries[0].changes' })])
    );
  });

  it('passes empty changes array (no elements to validate)', () => {
    const data = JSON.parse(readFileSync(join(FIXTURES, 'empty-changes-changelog.json'), 'utf8'));
    const errors = validateChangelogDateFile(data, 'test.json');
    const changeErrors = errors.filter(e => e.field.includes('changes'));
    expect(changeErrors).toHaveLength(0);
  });

  it('catches empty string in changes array', () => {
    const data = JSON.parse(readFileSync(join(FIXTURES, 'empty-change-string-changelog.json'), 'utf8'));
    const errors = validateChangelogDateFile(data, 'test.json');
    const changeErrors = errors.filter(e => e.field === 'entries[0].changes[1]');
    expect(changeErrors.length).toBeGreaterThan(0);
    expect(changeErrors[0].message).toContain('non-empty string');
  });
});

// ─── Directory Validation Tests ───────────────────────────────────────

describe('validateChangelogDir', () => {
  it('returns correct count for empty directory', () => {
    const tmpDir = setupTmpDir('empty-changelog-test', {});
    try {
      const result = validateChangelogDir(tmpDir);
      expect(result.changelog.valid).toBe(true);
      expect(result.changelog.filesChecked).toBe(0);
      expect(result.fileResults).toHaveLength(0);
    } finally {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('reports directory not found', () => {
    const result = validateChangelogDir('/nonexistent/path');
    expect(result.changelog.valid).toBe(false);
    expect(result.changelog.errors[0].field).toBe('<dir>');
  });

  it('validates fixture files', () => {
    const validContent = readFileSync(join(FIXTURES, 'valid-changelog-date.json'), 'utf8');
    const tmpDir = setupTmpDir('valid-changelog-dir-test', {
      '2026-06-10.json': validContent
    });
    try {
      const result = validateChangelogDir(tmpDir);
      expect(result.changelog.valid).toBe(true);
      expect(result.changelog.filesChecked).toBe(1);
    } finally {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('skips index.json', () => {
    const validContent = readFileSync(join(FIXTURES, 'valid-changelog-date.json'), 'utf8');
    const tmpDir = setupTmpDir('skip-index-test', {
      'index.json': '{"version":"1.0.0"}',
      '2026-06-10.json': validContent
    });
    try {
      const result = validateChangelogDir(tmpDir);
      expect(result.changelog.filesChecked).toBe(1); // Only date file, not index
    } finally {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('detects malformed fixture files', () => {
    const invalidContent = readFileSync(join(FIXTURES, 'invalid-type-changelog.json'), 'utf8');
    const tmpDir = setupTmpDir('malformed-changelog-dir-test', {
      '2026-06-10.json': invalidContent
    });
    try {
      const result = validateChangelogDir(tmpDir);
      expect(result.changelog.valid).toBe(false);
      expect(result.changelog.errors.length).toBeGreaterThan(0);
    } finally {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});

// ─── Integration: validateAll with changelog ──────────────────────────

describe('validateAll with changelog', () => {
  it('includes changelog result when changelogDirPath is provided', () => {
    const result = validateAll({
      siteDataPath: join(FIXTURES, 'valid-siteData.json'),
      contentPath: join(FIXTURES, 'valid-content.json'),
      seasonsPath: join(FIXTURES, 'valid-seasons.json'),
      changelogDirPath: join(FIXTURES, '..', '..', '..', 'src', 'content', 'changelog')
    });
    expect(result.changelog).toBeDefined();
    expect(result.changelog).not.toBeNull();
    expect(result.changelog.filesChecked).toBeGreaterThan(0);
  });

  it('omits changelog result when no changelogDirPath provided', () => {
    const result = validateAll({
      siteDataPath: join(FIXTURES, 'valid-siteData.json'),
      contentPath: join(FIXTURES, 'valid-content.json'),
      seasonsPath: join(FIXTURES, 'valid-seasons.json')
    });
    expect(result.changelog).toBeNull();
  });

  it('reports invalid when changelog date files are malformed', () => {
    const tmpDir = setupTmpDir('all-malformed-test', {
      '2026-06-10.json': readFileSync(join(FIXTURES, 'invalid-type-changelog.json'), 'utf8')
    });
    try {
      const result = validateAll({
        siteDataPath: join(FIXTURES, 'valid-siteData.json'),
        contentPath: join(FIXTURES, 'valid-content.json'),
        seasonsPath: join(FIXTURES, 'valid-seasons.json'),
        changelogDirPath: tmpDir
      });
      expect(result.changelog.valid).toBe(false);
      expect(result.valid).toBe(false);
    } finally {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});
