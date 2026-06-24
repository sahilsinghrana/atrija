#!/usr/bin/env node
/**
 * CSS Cache Buster
 *
 * Injects build timestamp as ?v= query parameter to all public CSS files
 * in dist/index.html. This forces browsers to fetch fresh CSS on every build
 * without relying on nginx cache headers alone.
 *
 * Input: dist/index.html (after inject-body.js)
 * Output: dist/index.html (modified in place)
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(__dirname, '..', 'dist', 'index.html');

const BUILD_VERSION = Date.now().toString(36); // compact base-36 timestamp

let html = readFileSync(htmlPath, 'utf-8');

// Replace CSS links with cache-busting version
// Matches: href="/css/filename.css" or href="/css/filename.css?v=..."
// Adds or replaces ?v=BUILD_VERSION
const cssLinkRegex = /href="(\/css\/[^"]+\.css)(\?v=[^"]*)?"/g;
html = html.replace(cssLinkRegex, `href="$1?v=${BUILD_VERSION}"`);

writeFileSync(htmlPath, html, 'utf-8');
console.log(`✓ CSS cache busted (v=${BUILD_VERSION})`);
