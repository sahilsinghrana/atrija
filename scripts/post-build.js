#!/usr/bin/env node
// scripts/post-build.js — Single post-build cache busting script
// Handles: SW cache version increment + asset precache list (both public/ and dist/)

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

// ─── Step 1: Service Worker cache version bump ───────────────────────────────
const swPath = join(rootDir, 'public', 'sw.js');
const distSwPath = join(distDir, 'sw.js');
if (existsSync(swPath)) {
  const swContent = readFileSync(swPath, 'utf-8');
  const match = swContent.match(/const CACHE_NAME\s*=\s*'atrija-shell-v(\d+)'/);
  if (match) {
    const newVersion = parseInt(match[1], 10) + 1;
    const oldName = `atrija-shell-v${match[1]}`;
    const newName = `atrija-shell-v${newVersion}`;
    
    // Update source
    const updated = swContent.replace(
      `const CACHE_NAME = '${oldName}'`,
      `const CACHE_NAME = '${newName}'`
    );
    writeFileSync(swPath, updated, 'utf-8');
    
    // Also update dist/sw.js (already copied by Astro build)
    if (existsSync(distSwPath)) {
      let distSw = readFileSync(distSwPath, 'utf-8');
      distSw = distSw.replace(
        `const CACHE_NAME = '${oldName}'`,
        `const CACHE_NAME = '${newName}'`
      );
      writeFileSync(distSwPath, distSw, 'utf-8');
    }
    console.log(`✓ SW cache bumped to v${newVersion}`);
  } else {
    console.warn('⚠ SW cache version pattern not found');
  }
}

// ─── Step 2: Update SW precache list to match current assets ─────────────────
// Scan dist/index.html to discover actual JS/CSS files
const indexPath = join(distDir, 'index.html');
if (existsSync(swPath) && existsSync(indexPath)) {
  const html = readFileSync(indexPath, 'utf-8');
  const scriptSrcs = [...html.matchAll(/src="(\/js\/[^"]+\.js)"/g)].map(m => m[1]);
  const linkHrefs = [...html.matchAll(/href="(\/css\/[^"]+\.css)"/g)].map(m => m[1]);
  
  // Also add _astro CSS (Vite-hashed)
  const astroDir = join(distDir, '_astro');
  const astroExists = existsSync(astroDir);
  const astroCss = astroExists
    ? readdirSync(astroDir).filter(f => f.endsWith('.css')).map(f => `/_astro/${f}`)
    : [];
  
  const allAssets = [...new Set([
    '/',
    '/css/loader.css',
    ...linkHrefs,
    ...astroCss,
    ...scriptSrcs,
  ])];

  // Update both public/sw.js and dist/sw.js
  const swFiles = [swPath];
  if (existsSync(distSwPath)) swFiles.push(distSwPath);
  
  for (const filePath of swFiles) {
    let sw = readFileSync(filePath, 'utf-8');
    const precacheStart = sw.indexOf('const PRECACHE_URLS = [');
    const precacheEnd = sw.indexOf('];', precacheStart);
    if (precacheStart !== -1 && precacheEnd !== -1) {
      const newPrecache = `const PRECACHE_URLS = ${JSON.stringify(allAssets, null, 2)
        .replace(/"/g, "'")
        .replace(/\[/g, '[\n  ')
        .replace(/\]/g, '\n]')};`;
      sw = sw.substring(0, precacheStart) + newPrecache + sw.substring(precacheEnd + 2);
      writeFileSync(filePath, sw, 'utf-8');
    }
  }
  console.log(`✓ SW precache updated (${allAssets.length} assets)`);
}

console.log('✓ Post-build cache busting complete');
