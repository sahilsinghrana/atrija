#!/usr/bin/env node
// scripts/bump-sw-cache.js — Auto-increment service worker cache version on every build
// This ensures stale SW cache is invalidated on every deploy.
// Called as part of the build pipeline: node scripts/bump-sw-cache.js

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SW_PATH = join(__dirname, '..', 'public', 'sw.js');

const content = readFileSync(SW_PATH, 'utf-8');

// Match: const CACHE_NAME = 'atrija-shell-vN';
const match = content.match(/const CACHE_NAME\s*=\s*'atrija-shell-v(\d+)'/);
if (!match) {
  console.error('[bump-sw] Could not find CACHE_NAME in sw.js');
  process.exit(1);
}

const currentVersion = parseInt(match[1], 10);
const newVersion = currentVersion + 1;
const newContent = content.replace(
  `const CACHE_NAME = 'atrija-shell-v${currentVersion}'`,
  `const CACHE_NAME = 'atrija-shell-v${newVersion}'`
);

writeFileSync(SW_PATH, newContent, 'utf-8');
console.log(`[bump-sw] Cache version: v${currentVersion} → v${newVersion}`);
