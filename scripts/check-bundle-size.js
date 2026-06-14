#!/usr/bin/env node
/**
 * check-bundle-size.js — Bundle size budget guard rail
 *
 * Reads the built scene-bundle.js file size and compares against
 * configurable thresholds. Exits 0 (pass), 0 with warning, or 1 (fail).
 *
 * Environment variables:
 *   BUNDLE_WARN_KB  — Warning threshold in KB (default: 750)
 *   BUNDLE_FAIL_KB  — Failure threshold in KB (default: 900)
 *
 * Usage:
 *   node scripts/check-bundle-size.js
 *   BUNDLE_WARN_KB=700 BUNDLE_FAIL_KB=850 node scripts/check-bundle-size.js
 */

import { statSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUNDLE_PATH = resolve(__dirname, '..', 'public', 'js', 'scene-bundle.js');

/**
 * Get configured thresholds from environment variables.
 * @returns {{ warnBytes: number, failBytes: number, warnKB: number, failKB: number }}
 */
export function getThresholds() {
  const WARN_KB = parseInt(process.env.BUNDLE_WARN_KB || '750', 10);
  const FAIL_KB = parseInt(process.env.BUNDLE_FAIL_KB || '900', 10);
  return { warnBytes: WARN_KB * 1024, failBytes: FAIL_KB * 1024, warnKB: WARN_KB, failKB: FAIL_KB };
}

export function getBundlePath() {
  return BUNDLE_PATH;
}

/**
 * Check the bundle size against thresholds.
 * Uses the provided statFn for file access (enables testing).
 * @param {Function} [statFn] — Optional statSync override for testing
 * @returns {{ exitCode: number, sizeKB: number, threshold: string }}
 */
export function checkBundleSize(statFn) {
  const doStat = statFn || statSync;
  const thresholds = getThresholds();

  let stats;
  try {
    stats = doStat(BUNDLE_PATH);
  } catch (err) {
    throw err;
  }

  const sizeBytes = stats.size;
  const sizeKB = sizeBytes / 1024;

  if (sizeBytes > thresholds.failBytes) {
    return { exitCode: 1, sizeKB, threshold: 'fail' };
  }
  if (sizeBytes > thresholds.warnBytes) {
    return { exitCode: 0, sizeKB, threshold: 'warn' };
  }
  return { exitCode: 0, sizeKB, threshold: 'pass' };
}

function main() {
  try {
    const result = checkBundleSize();
    const thresholds = getThresholds();
    const sizeKB = result.sizeKB.toFixed(1);

    if (result.exitCode === 1) {
      console.error(`✖ FAIL: scene-bundle.js is ${sizeKB}KB (limit: ${thresholds.failKB}KB)`);
      console.error(`  Reduce bundle size by at least ${(result.sizeKB - thresholds.failKB).toFixed(1)}KB before deploying.`);
      process.exit(1);
    }

    if (result.threshold === 'warn') {
      console.warn(`⚠ WARNING: scene-bundle.js is ${sizeKB}KB (warn threshold: ${thresholds.warnKB}KB)`);
      console.warn(`  Consider optimizing to stay under ${thresholds.warnKB}KB.`);
      process.exit(0);
    }

    console.log(`✔ PASS: scene-bundle.js is ${sizeKB}KB (under ${thresholds.warnKB}KB warn threshold)`);
    process.exit(0);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error(`✖ check-bundle-size: scene-bundle.js not found at ${BUNDLE_PATH}`);
      console.error('  Run "npm run build:scene" first.');
    } else {
      console.error(`✖ check-bundle-size: unexpected error: ${err.message}`);
    }
    process.exit(1);
  }
}

// Only run main when executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
