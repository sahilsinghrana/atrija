#!/usr/bin/env bash
# scripts/validate-content.sh — CI-like check for content JSON files
# Runs the validate-content.js module against siteData.json, content.json, and seasons.json
# Exits 0 if valid, 1 if any errors found

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "=== Content JSON Validation ==="
echo ""

node --input-type=module -e "
import { validateAll, formatErrors } from '${PROJECT_DIR}/src/content/validate-content.js';

const result = validateAll({
  siteDataPath: '${PROJECT_DIR}/src/content/siteData.json',
  contentPath: '${PROJECT_DIR}/src/content/content.json',
  seasonsPath: '${PROJECT_DIR}/src/content/seasons.json'
});

console.log(formatErrors(result.siteData));
console.log(formatErrors(result.content));
console.log(formatErrors(result.seasons));

if (!result.valid) {
  const total = result.siteData.errors.length + result.content.errors.length + result.seasons.errors.length;
  console.log('\nFAIL: ' + total + ' validation error(s) found');
  process.exit(1);
} else {
  console.log('\nPASS: All content valid');
}
"
