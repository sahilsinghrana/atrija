#!/usr/bin/env node
// scripts/copy-content.js — Copy JSON content files to public/ for client-side fetch
import { mkdirSync, copyFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = join(__dirname, '..');
const SRC_CONTENT = join(PROJECT_DIR, 'src', 'content');
const DST_CONTENT = join(PROJECT_DIR, 'public', 'content');

// Ensure destination exists
if (!existsSync(DST_CONTENT)) {
  mkdirSync(DST_CONTENT, { recursive: true });
}

// Copy top-level JSON files (siteData.json, content.json, koans.json)
const files = readdirSync(SRC_CONTENT).filter(f => f.endsWith('.json') && !f.startsWith('.'));
for (const file of files) {
  copyFileSync(join(SRC_CONTENT, file), join(DST_CONTENT, file));
}

// Copy changelog subdirectory
const changelogSrc = join(SRC_CONTENT, 'changelog');
const changelogDst = join(DST_CONTENT, 'changelog');
if (existsSync(changelogSrc)) {
  if (!existsSync(changelogDst)) {
    mkdirSync(changelogDst, { recursive: true });
  }
  const changelogFiles = readdirSync(changelogSrc).filter(f => f.endsWith('.json'));
  for (const file of changelogFiles) {
    copyFileSync(join(changelogSrc, file), join(changelogDst, file));
  }
}

console.log('[copy-content] Content JSON files copied to public/content/');
