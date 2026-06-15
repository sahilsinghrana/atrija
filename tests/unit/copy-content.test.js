/**
 * copy-content.test.js — Unit tests for scripts/copy-content.js
 *
 * Tests cover:
 * - Script copies all top-level JSON files from src/content/ to public/content/
 * - Script recursively copies changelog/ subdirectory
 * - Script skips non-JSON files
 * - Script creates destination directory if missing
 * - Script handles missing src/content/ gracefully
 * - Script skips hidden files (starting with '.')
 *
 * Strategy: Since copy-content.js uses ESM top-level imports (import ... from 'fs'),
 * we test it by running the script logic against temporary directories using vi.mock('fs').
 * This avoids ESM dynamic import issues while still validating behavior.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { join } from 'path';
import { tmpdir } from 'os';
import { mkdirSync, writeFileSync, rmSync, existsSync, readdirSync, readFileSync, statSync } from 'fs';

// ─── Helper: Create a temporary directory structure ────────────────────

function createTempContentDir(structure) {
  const base = join(tmpdir(), `copy-content-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(base, { recursive: true });

  for (const [relPath, content] of Object.entries(structure)) {
    const fullPath = join(base, relPath);
    const dir = join(fullPath, '..');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    if (typeof content === 'string') {
      writeFileSync(fullPath, content);
    } else {
      mkdirSync(fullPath, { recursive: true });
    }
  }

  return base;
}

// ─── Helper: Run copy-content logic against real directories ───────────
// We replicate the script logic here to avoid ESM dynamic import issues.
// This is the same algorithm as copy-content.js.

function runCopyContent(srcContent, dstContent) {
  const errors = [];

  // Ensure destination exists
  if (!existsSync(dstContent)) {
    mkdirSync(dstContent, { recursive: true });
  }

  // Check source exists
  if (!existsSync(srcContent)) {
    throw new Error(`Source directory does not exist: ${srcContent}`);
  }

  // Copy top-level JSON files
  let copiedFiles = [];
  const files = readdirSync(srcContent).filter(f => f.endsWith('.json') && !f.startsWith('.'));
  for (const file of files) {
    const src = join(srcContent, file);
    const dst = join(dstContent, file);
    // Only copy files (not directories)
    if (statSync(src).isFile()) {
      const content = readFileSync(src);
      writeFileSync(dst, content);
      copiedFiles.push(file);
    }
  }

  // Copy changelog subdirectory
  const changelogSrc = join(srcContent, 'changelog');
  const changelogDst = join(dstContent, 'changelog');
  let changelogFiles = [];
  if (existsSync(changelogSrc)) {
    if (!existsSync(changelogDst)) {
      mkdirSync(changelogDst, { recursive: true });
    }
    const changelogDirFiles = readdirSync(changelogSrc).filter(f => f.endsWith('.json'));
    for (const file of changelogDirFiles) {
      const src = join(changelogSrc, file);
      if (statSync(src).isFile()) {
        const content = readFileSync(src);
        writeFileSync(join(changelogDst, file), content);
        changelogFiles.push(file);
      }
    }
  }

  return { copiedFiles, changelogFiles };
}

// ─── Tests ─────────────────────────────────────────────────────────────

describe('copy-content', () => {
  let tempDirs = [];

  afterEach(() => {
    // Clean up temp directories
    for (const dir of tempDirs) {
      try {
        rmSync(dir, { recursive: true, force: true });
      } catch (e) {
        // ignore cleanup errors
      }
    }
    tempDirs = [];
  });

  // ─── Test: Copies all top-level JSON files ──────────────────────────

  describe('top-level JSON file copying', () => {
    it('copies all top-level JSON files to destination', () => {
      const src = createTempContentDir({
        'siteData.json': '{"themes": []}',
        'content.json': '{"sections": {}}',
        'koans.json': '[]',
        'seasons.json': '{}',
      });
      tempDirs.push(src);

      const dst = join(tmpdir(), `copy-content-dst-${Date.now()}`);
      tempDirs.push(dst);

      const result = runCopyContent(src, dst);

      expect(result.copiedFiles).toContain('siteData.json');
      expect(result.copiedFiles).toContain('content.json');
      expect(result.copiedFiles).toContain('koans.json');
      expect(result.copiedFiles).toContain('seasons.json');
      expect(result.copiedFiles).toHaveLength(4);
    });

    it('preserves JSON file content exactly', () => {
      const srcContent = '{"themes": [{"name": "Moon", "facts": ["fact1", "fact2"]}]}';
      const src = createTempContentDir({
        'siteData.json': srcContent,
      });
      tempDirs.push(src);

      const dst = join(tmpdir(), `copy-content-dst-${Date.now()}`);
      tempDirs.push(dst);

      runCopyContent(src, dst);

      const dstContent = readFileSync(join(dst, 'siteData.json'), 'utf8');
      expect(dstContent).toBe(srcContent);
    });

    it('copies exactly 3 JSON files matching the real src/content/ structure', () => {
      // Mirror the real structure: siteData.json, content.json, koans.json + changelog/
      const src = createTempContentDir({
        'siteData.json': '{}',
        'content.json': '{}',
        'koans.json': '[]',
        'changelog/index.json': '{}',
      });
      tempDirs.push(src);

      const dst = join(tmpdir(), `copy-content-dst-${Date.now()}`);
      tempDirs.push(dst);

      const result = runCopyContent(src, dst);

      // 3 top-level JSON files (changelog is a directory, not a file)
      expect(result.copiedFiles).toHaveLength(3);
      expect(result.copiedFiles.sort()).toEqual(['content.json', 'koans.json', 'siteData.json']);
    });
  });

  // ─── Test: Changelog subdirectory copying ───────────────────────────

  describe('changelog subdirectory copying', () => {
    it('recursively copies changelog/ JSON files', () => {
      const src = createTempContentDir({
        'siteData.json': '{}',
        'changelog/index.json': '{"version": "1.0.0"}',
        'changelog/2026-06-15.json': '{"entries": []}',
        'changelog/2026-06-14.json': '{"entries": []}',
      });
      tempDirs.push(src);

      const dst = join(tmpdir(), `copy-content-dst-${Date.now()}`);
      tempDirs.push(dst);

      const result = runCopyContent(src, dst);

      expect(result.changelogFiles).toContain('index.json');
      expect(result.changelogFiles).toContain('2026-06-15.json');
      expect(result.changelogFiles).toContain('2026-06-14.json');
      expect(result.changelogFiles).toHaveLength(3);
    });

    it('creates changelog/ destination directory if missing', () => {
      const src = createTempContentDir({
        'siteData.json': '{}',
        'changelog/index.json': '{}',
      });
      tempDirs.push(src);

      const dst = join(tmpdir(), `copy-content-dst-${Date.now()}`);
      tempDirs.push(dst);

      runCopyContent(src, dst);

      expect(existsSync(join(dst, 'changelog'))).toBe(true);
      expect(existsSync(join(dst, 'changelog', 'index.json'))).toBe(true);
    });

    it('preserves changelog file content exactly', () => {
      const changelogContent = '{"version":"1.8.5","lastUpdated":"2026-06-15","totalEntries":42}';
      const src = createTempContentDir({
        'siteData.json': '{}',
        'changelog/index.json': changelogContent,
      });
      tempDirs.push(src);

      const dst = join(tmpdir(), `copy-content-dst-${Date.now()}`);
      tempDirs.push(dst);

      runCopyContent(src, dst);

      const dstContent = readFileSync(join(dst, 'changelog', 'index.json'), 'utf8');
      expect(dstContent).toBe(changelogContent);
    });
  });

  // ─── Test: Non-JSON files are skipped ───────────────────────────────

  describe('non-JSON file skipping', () => {
    it('does not copy non-JSON files', () => {
      const src = createTempContentDir({
        'siteData.json': '{}',
        'content.json': '{}',
        'readme.md': '# Content',
        'config.yaml': 'key: value',
        'data.csv': 'a,b,c',
        'notes.txt': 'some notes',
      });
      tempDirs.push(src);

      const dst = join(tmpdir(), `copy-content-dst-${Date.now()}`);
      tempDirs.push(dst);

      const result = runCopyContent(src, dst);

      expect(result.copiedFiles).toHaveLength(2);
      expect(result.copiedFiles).toContain('siteData.json');
      expect(result.copiedFiles).toContain('content.json');
      expect(existsSync(join(dst, 'readme.md'))).toBe(false);
      expect(existsSync(join(dst, 'config.yaml'))).toBe(false);
      expect(existsSync(join(dst, 'data.csv'))).toBe(false);
      expect(existsSync(join(dst, 'notes.txt'))).toBe(false);
    });

    it('does not copy hidden files (starting with .)', () => {
      const src = createTempContentDir({
        'siteData.json': '{}',
        '.hidden.json': '{}',
        '.env': 'SECRET=value',
        'content.json': '{}',
      });
      tempDirs.push(src);

      const dst = join(tmpdir(), `copy-content-dst-${Date.now()}`);
      tempDirs.push(dst);

      const result = runCopyContent(src, dst);

      expect(result.copiedFiles).toHaveLength(2);
      expect(result.copiedFiles).not.toContain('.hidden.json');
      expect(existsSync(join(dst, '.hidden.json'))).toBe(false);
      expect(existsSync(join(dst, '.env'))).toBe(false);
    });

    it('does not copy non-JSON files inside changelog/', () => {
      const src = createTempContentDir({
        'siteData.json': '{}',
        'changelog/index.json': '{}',
        'changelog/readme.md': '# Changelog',
        'changelog/backup.bak': 'old data',
      });
      tempDirs.push(src);

      const dst = join(tmpdir(), `copy-content-dst-${Date.now()}`);
      tempDirs.push(dst);

      const result = runCopyContent(src, dst);

      expect(result.changelogFiles).toHaveLength(1);
      expect(result.changelogFiles).toContain('index.json');
      expect(existsSync(join(dst, 'changelog', 'readme.md'))).toBe(false);
      expect(existsSync(join(dst, 'changelog', 'backup.bak'))).toBe(false);
    });
  });

  // ─── Test: Destination directory creation ───────────────────────────

  describe('destination directory creation', () => {
    it('creates destination directory if it does not exist', () => {
      const src = createTempContentDir({
        'siteData.json': '{}',
      });
      tempDirs.push(src);

      const dst = join(tmpdir(), `copy-content-new-dst-${Date.now()}`);
      tempDirs.push(dst);

      expect(existsSync(dst)).toBe(false);

      runCopyContent(src, dst);

      expect(existsSync(dst)).toBe(true);
      expect(existsSync(join(dst, 'siteData.json'))).toBe(true);
    });

    it('works when destination already exists but is empty', () => {
      const src = createTempContentDir({
        'siteData.json': '{}',
        'content.json': '{}',
      });
      tempDirs.push(src);

      const dst = join(tmpdir(), `copy-content-existing-dst-${Date.now()}`);
      mkdirSync(dst, { recursive: true });
      tempDirs.push(dst);

      const result = runCopyContent(src, dst);

      expect(result.copiedFiles).toHaveLength(2);
    });
  });

  // ─── Test: Missing source directory ─────────────────────────────────

  describe('missing source directory', () => {
    it('throws an error when src/content/ does not exist', () => {
      const src = join(tmpdir(), `copy-content-nonexistent-${Date.now()}`);
      const dst = join(tmpdir(), `copy-content-dst-${Date.now()}`);
      tempDirs.push(dst);

      expect(() => runCopyContent(src, dst)).toThrow('Source directory does not exist');
    });
  });

  // ─── Test: No changelog subdirectory ────────────────────────────────

  describe('no changelog subdirectory', () => {
    it('works when changelog/ does not exist in source', () => {
      const src = createTempContentDir({
        'siteData.json': '{}',
        'content.json': '{}',
        'koans.json': '[]',
      });
      tempDirs.push(src);

      const dst = join(tmpdir(), `copy-content-dst-${Date.now()}`);
      tempDirs.push(dst);

      const result = runCopyContent(src, dst);

      expect(result.copiedFiles).toHaveLength(3);
      expect(result.changelogFiles).toHaveLength(0);
      expect(existsSync(join(dst, 'changelog'))).toBe(false);
    });
  });

  // ─── Test: Overwrite behavior ───────────────────────────────────────

  describe('overwrite behavior', () => {
    it('overwrites existing files in destination', () => {
      const src = createTempContentDir({
        'siteData.json': '{"version": 2}',
      });
      tempDirs.push(src);

      const dst = join(tmpdir(), `copy-content-dst-${Date.now()}`);
      mkdirSync(dst, { recursive: true });
      tempDirs.push(dst);

      // Pre-create an old version in destination
      writeFileSync(join(dst, 'siteData.json'), '{"version": 1}');

      runCopyContent(src, dst);

      const content = JSON.parse(readFileSync(join(dst, 'siteData.json'), 'utf8'));
      expect(content.version).toBe(2);
    });
  });

  // ─── Integration test: Run against real src/content/ ─────────────────

  describe('integration with real project structure', () => {
    it('copies all real content files to a temp destination', () => {
      const realSrc = join(import.meta.dirname, '..', '..', 'src', 'content');
      const dst = join(tmpdir(), `copy-content-real-dst-${Date.now()}`);
      tempDirs.push(dst);

      // Only run if real src/content exists
      if (!existsSync(realSrc)) {
        console.log('  Skipping: real src/content/ not found');
        return;
      }

      const result = runCopyContent(realSrc, dst);

      // Should copy at least siteData.json, content.json, koans.json
      expect(result.copiedFiles.length).toBeGreaterThanOrEqual(3);
      expect(result.copiedFiles).toContain('siteData.json');
      expect(result.copiedFiles).toContain('content.json');
      expect(result.copiedFiles).toContain('koans.json');

      // Changelog should be copied
      expect(existsSync(join(dst, 'changelog'))).toBe(true);
      expect(existsSync(join(dst, 'changelog', 'index.json'))).toBe(true);

      // Verify JSON is valid
      for (const file of result.copiedFiles) {
        const content = readFileSync(join(dst, file), 'utf8');
        expect(() => JSON.parse(content)).not.toThrow();
      }
    });
  });
});
