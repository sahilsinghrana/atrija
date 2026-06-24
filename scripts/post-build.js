#!/usr/bin/env node
// scripts/post-build.js — Single post-build cache busting script
// Handles: SW cache version increment + asset cache headers
// Replaces: bump-sw-cache.js + css-cache-bust.js (consolidated)

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

// ─── Step 1: Service Worker cache version bump ───────────────────────────────
const swPath = join(rootDir, 'public', 'sw.js');
if (existsSync(swPath)) {
  const swContent = readFileSync(swPath, 'utf-8');
  const match = swContent.match(/const CACHE_NAME\s*=\s*'atrija-shell-v(\d+)'/);
  if (match) {
    const newVersion = parseInt(match[1], 10) + 1;
    const updated = swContent.replace(
      `const CACHE_NAME = 'atrija-shell-v${match[1]}'`,
      `const CACHE_NAME = 'atrija-shell-v${newVersion}'`
    );
    writeFileSync(swPath, updated, 'utf-8');
    console.log(`✓ SW cache bumped to v${newVersion}`);
  } else {
    console.warn('⚠ SW cache version pattern not found');
  }
}

// ─── Step 2: Update SW precache list to match current assets ─────────────────
// Scan dist/_astro/ for actual JS/CSS files and update PRECACHE_URLS
const { readdirSync } = await import('fs');
const astroDir = join(distDir, '_astro');
if (existsSync(astroDir)) {
  const files = readdirSync(astroDir);
  const jsFiles = files.filter(f => f.endsWith('.js')).map(f => `/js/${f}`);
  const cssFiles = files.filter(f => f.endsWith('.css')).map(f => `/css/${f}`);

  // Also check public/js/ for standalone modules
  const publicJsDir = join(rootDir, 'public', 'js');
  const publicJsFiles = existsSync(publicJsDir)
    ? readdirSync(publicJsDir).filter(f => f.endsWith('.js')).map(f => `/js/${f}`)
    : [];

  // Merge and deduplicate
  const allJs = [...new Set([...jsFiles, ...publicJsFiles])];
  const allCss = [...new Set(cssFiles)];

  // Read current sw.js and update PRECACHE_URLS
  let sw = readFileSync(swPath, 'utf-8');
  
  // Find all href="/js/..." and href="/css/..." in dist/index.html to discover assets
  const indexPath = join(distDir, 'index.html');
  if (existsSync(indexPath)) {
    const html = readFileSync(indexPath, 'utf-8');
    const scriptSrcs = [...html.matchAll(/src="(\/js\/[^"]+\.js)"/g)].map(m => m[1]);
    const linkHrefs = [...html.matchAll(/href="(\/css\/[^"]+\.css)"/g)].map(m => m[1]);
    
    const allAssets = [...new Set([
      '/',
      '/css/loader.css',
      ...linkHrefs,
      ...scriptSrcs,
    ])];

    // Replace PRECACHE_URLS array
    const precacheStart = sw.indexOf('const PRECACHE_URLS = [');
    const precacheEnd = sw.indexOf('];', precacheStart);
    if (precacheStart !== -1 && precacheEnd !== -1) {
      const newPrecache = `const PRECACHE_URLS = ${JSON.stringify(allAssets, null, 2)
        .replace(/"/g, "'")
        .replace(/\[/g, '[\n  ')
        .replace(/\]/g, '\n]')};`;
      sw = sw.substring(0, precacheStart) + newPrecache + sw.substring(precacheEnd + 2);
      writeFileSync(swPath, sw, 'utf-8');
      console.log(`✓ SW precache updated (${allAssets.length} assets)`);
    }
  }
}

console.log('✓ Post-build cache busting complete');
