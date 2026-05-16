#!/bin/bash
# scripts/daily-deploy.sh — Full daily mutation pipeline: content → build → deploy
# Called by cron to update site content, colors, changelog, and deploy

set -e

PROJECT_DIR="/root/projects/van-gogh-site"
DEPLOY_DIR="/data/data/com.termux/files/usr/share/nginx/html"

echo "[daily-deploy] Starting daily mutation pipeline..."

cd "$PROJECT_DIR"

# Step 1: Run daily content mutation (colors, changelog)
echo "[daily-deploy] Step 1: Content mutation..."
node scripts/daily-mutate.js

# Step 2: Build the site
echo "[daily-deploy] Step 2: Building site..."
npm run build 2>&1 | tail -5

# Step 3: Deploy to Nginx
echo "[daily-deploy] Step 3: Deploying to Nginx..."
# Inject cache-busting version into scene-init.js script tag
BUILD_VERSION=$(date +%s)
sed -i "s/BUILD_VERSION/$BUILD_VERSION/g" dist/index.html
cp -r dist/* "$DEPLOY_DIR/"
echo "[daily-deploy] Deployed to $DEPLOY_DIR (v$BUILD_VERSION)"

# Step 4: Verify deployment
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8080/)
if [ "$HTTP_CODE" = "200" ]; then
  echo "[daily-deploy] ✅ Deployment verified (HTTP $HTTP_CODE)"
else
  echo "[daily-deploy] ⚠️ Deployment check returned HTTP $HTTP_CODE"
fi

# Step 5: Git commit
echo "[daily-deploy] Step 5: Git commit..."
cd "$PROJECT_DIR"
git add -A
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
git commit -m "chore: daily mutation + deploy — $TIMESTAMP" --allow-empty 2>/dev/null || echo "[daily-deploy] Nothing to commit"

echo "[daily-deploy] ✅ Pipeline complete at $TIMESTAMP"
