#!/usr/bin/env node
// scripts/build.js — Consolidated build pipeline
// Usage: node scripts/build.js

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

function run(cmd, label) {
  console.log(`\n▶ ${label}`);
  try {
    execSync(cmd, { cwd: rootDir, stdio: 'inherit' });
    console.log(`✓ ${label}`);
  } catch (err) {
    console.error(`✗ ${label}`);
    process.exit(1);
  }
}

// Step 1: Copy content files
run('node scripts/copy-content.js', 'Copy content files');

// Step 2: Build scene modules (Vite)
run('node node_modules/vite/bin/vite.js build --config vite-scene.config.js', 'Build scene modules');

// Step 3: Build Astro
run('astro build', 'Build Astro site');

// Step 4: Inject body tags (Astro 4.16.19 bug fix)
run('node scripts/inject-body.js', 'Inject body tags');

// Step 5: Post-build cache busting (single script)
run('node scripts/post-build.js', 'Post-build cache busting');

// Step 6: Deploy to /var/www/html and restart nginx
// (Cybertron kernel VFS page cache requires nginx restart after file overwrite)
console.log('\n▶ Deploy + restart nginx');
execSync('rm -rf /var/www/html/* && cp -r dist/* /var/www/html/', { cwd: rootDir, stdio: 'inherit' });
execSync('fuser -k 8080/tcp 2>/dev/null; sleep 2; nginx -g "daemon on;" 2>&1 | head -3', { cwd: rootDir, stdio: 'inherit' });
console.log('✓ Deployed + nginx restarted');

console.log('\n✅ Build complete!');
