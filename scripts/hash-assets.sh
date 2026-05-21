#!/bin/bash
# scripts/hash-assets.sh — Hash all static assets in dist/ for cache-busting
# Run after `npm run build`, before deploy

set -e

DIST_DIR="/root/projects/van-gogh-site/dist"

cd "$DIST_DIR"

# Generate content hashes for all JS, CSS, SVG files
# Rename files to include hash and update references in index.html

echo "[hash-assets] Hashing static assets..."

# Process JS files
for f in js/*.js; do
  [ -f "$f" ] || continue
  hash=$(md5sum "$f" | cut -c1-8)
  name="${f%.js}"
  newname="${name}-${hash}.js"
  mv "$f" "$newname"
  echo "[hash-assets] $f -> $newname"
done

# Process CSS files
for f in css/*.css; do
  [ -f "$f" ] || continue
  hash=$(md5sum "$f" | cut -c1-8)
  name="${f%.css}"
  newname="${name}-${hash}.css"
  mv "$f" "$newname"
  echo "[hash-assets] $f -> $newname"
done

# Process SVG files
for f in images/*.svg; do
  [ -f "$f" ] || continue
  hash=$(md5sum "$f" | cut -c1-8)
  name="${f%.svg}"
  newname="${name}-${hash}.svg"
  mv "$f" "$newname"
  echo "[hash-assets] $f -> $newname"
done

# Update references in index.html
echo "[hash-assets] Updating index.html references..."

# Replace JS references
for f in js/*.js; do
  [ -f "$f" ] || continue
  basename=$(basename "$f")
  # Extract original name (before hash)
  orig=$(echo "$basename" | sed 's/-[a-f0-9]\{8\}\.js$/.js/')
  if [ "$orig" != "$basename" ]; then
    sed -i "s|/js/$orig|/js/$basename|g" index.html
  fi
done

# Replace CSS references
for f in css/*.css; do
  [ -f "$f" ] || continue
  basename=$(basename "$f")
  orig=$(echo "$basename" | sed 's/-[a-f0-9]\{8\}\.css$/.css/')
  if [ "$orig" != "$basename" ]; then
    sed -i "s|/css/$orig|/css/$basename|g" index.html
  fi
done

# Replace SVG references in inline styles and content.json
for f in images/*.svg; do
  [ -f "$f" ] || continue
  basename=$(basename "$f")
  orig=$(echo "$basename" | sed 's/-[a-f0-9]\{8\}\.svg$/.svg/')
  if [ "$orig" != "$basename" ]; then
    sed -i "s|/images/$orig|/images/$basename|g" index.html
  fi
done

echo "[hash-assets] Done. All assets hashed."
