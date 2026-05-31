#!/bin/bash
# scripts/pre-deploy-check.sh — Run before every deploy to catch common bugs
set -e

PROJECT_DIR="/root/projects/van-gogh-site"
JS_FILE="$PROJECT_DIR/public/js/scene-init.js"

echo "=== Pre-Deploy Checks ==="

# 1. Build must succeed
echo "[1/5] Building..."
cd "$PROJECT_DIR" && npm run build > /dev/null 2>&1
echo "  ✓ Build passed"

# 2. scene-init.js must be parseable (braces balanced)
echo "[2/5] Checking scene-init.js syntax..."
python3 "$PROJECT_DIR/scripts/check-syntax.py" "$JS_FILE"
echo "  ✓ Syntax checks passed"

# 3. Check that __sceneReady and __sceneFailed exist
echo "[3/5] Checking scene lifecycle hooks..."
python3 -c "
with open('$JS_FILE') as f:
    content = f.read()
for fn in ['__sceneReady', '__sceneFailed']:
    if fn not in content:
        print(f'  ✗ {fn}() not found in scene-init.js')
        exit(1)
print('  ✓ __sceneReady and __sceneFailed present')
"

# 4. HTTP test
echo "[4/5] HTTP test..."
sleep 1
STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://127.0.0.1:8080/)
if [ "$STATUS" = "200" ]; then
    echo "  ✓ Site responds with HTTP 200"
else
    echo "  ✗ Site returned HTTP $STATUS"
    exit 1
fi

# 5. Verify scene-init.js is referenced in built HTML
echo "[5/5] Checking built HTML references scene-init.js..."
if grep -q 'scene-init' "$PROJECT_DIR/dist/index.html"; then
    echo "  ✓ scene-init.js referenced in index.html"
else
    echo "  ✗ scene-init.js NOT found in built index.html"
    exit 1
fi

echo ""
echo "=== All checks passed ✓ ==="
