// scripts/scene-health-check.js
// ═══════════════════════════════════════════════════════════════
// Lightweight scene health check — runs via Node.js (no browser)
// Can be called by cron jobs to detect if the scene is broken
// Usage: node scripts/scene-health-check.js
// Exit code 0 = healthy, 1 = error detected
// ═══════════════════════════════════════════════════════════════

const http = require('http');
const { execSync } = require('child_process');

const SITE_URL = 'http://127.0.0.1:8080';
const TIMEOUT_MS = 10000;

function fetch(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { timeout: TIMEOUT_MS }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

async function check() {
  const results = { checks: [], errors: [], exitCode: 0 };

  // 1. Check HTTP 200
  try {
    const resp = await fetch(SITE_URL);
    results.checks.push({ name: 'HTTP status', ok: resp.status === 200, detail: resp.status });
    if (resp.status !== 200) results.errors.push(`HTTP ${resp.status}`);
  } catch (e) {
    results.checks.push({ name: 'HTTP status', ok: false, detail: e.message });
    results.errors.push(`HTTP fetch failed: ${e.message}`);
    results.exitCode = 1;
    return results; // Can't continue if site isn't reachable
  }

  // 2. Check HTML contains critical scene elements
  const resp = await fetch(SITE_URL);
  const html = resp.body;

  const criticalElements = [
    { pattern: /id="canvas-container"/, name: 'canvas-container' },
    { pattern: /id="loader"/, name: 'loader element' },
    { pattern: /id="scene-error"/, name: 'error fallback UI' },
    { pattern: /scene-init.*\.js/, name: 'scene-init.js script reference' },
    { pattern: /modulepreload.*esm\.sh\/three/, name: 'Three.js modulepreload' },
    { pattern: /__sceneReady/, name: '__sceneReady handler' },
    { pattern: /__sceneFailed/, name: '__sceneFailed handler' },
  ];

  for (const el of criticalElements) {
    const found = el.pattern.test(html);
    results.checks.push({ name: `HTML: ${el.name}`, ok: found, detail: found ? 'found' : 'MISSING' });
    if (!found) {
      results.errors.push(`Missing: ${el.name}`);
      results.exitCode = 1;
    }
  }

  // 3. Check scene-init.js is accessible
  try {
    // Find the actual hashed filename
    const sceneMatch = html.match(/scene-init-([a-f0-9]+)\.js/);
    if (sceneMatch) {
      const sceneUrl = `${SITE_URL}/js/scene-init-${sceneMatch[1]}.js`;
      const sceneResp = await fetch(sceneUrl);
      results.checks.push({
        name: 'scene-init.js accessible',
        ok: sceneResp.status === 200,
        detail: `HTTP ${sceneResp.status}, ${(sceneResp.body.length / 1024).toFixed(0)}KB`
      });

      if (sceneResp.status === 200) {
        const sceneJs = sceneResp.body;
        const criticalCode = [
          { pattern: /function createStars/, name: 'createStars function' },
          { pattern: /function createMoon/, name: 'createMoon function' },
          { pattern: /function createLilies|function createSunflowers/, name: 'flower functions' },
          { pattern: /EffectComposer/, name: 'EffectComposer import' },
          { pattern: /TextureLoader|\.load\(|textureLoader/, name: 'texture loading' },
          { pattern: /renderer\.render|animate/, name: 'render loop' },
          { pattern: /vertexShader|gl_Position/, name: 'shader code' },
        ];
        for (const code of criticalCode) {
          const found = code.pattern.test(sceneJs);
          results.checks.push({ name: `JS: ${code.name}`, ok: found, detail: found ? 'found' : 'MISSING' });
          if (!found) {
            results.errors.push(`Missing JS: ${code.name}`);
            results.exitCode = 1;
          }
        }
      }
    } else {
      results.checks.push({ name: 'scene-init.js reference', ok: false, detail: 'hashed filename not found in HTML' });
      results.errors.push('scene-init.js hashed filename not found');
      results.exitCode = 1;
    }
  } catch (e) {
    results.checks.push({ name: 'scene-init.js check', ok: false, detail: e.message });
    results.errors.push(`scene-init.js check failed: ${e.message}`);
    results.exitCode = 1;
  }

  // 4. Check moon-phase.js
  try {
    const moonMatch = html.match(/moon-phase-([a-f0-9]+)\.js/);
    if (moonMatch) {
      const moonUrl = `${SITE_URL}/js/moon-phase-${moonMatch[1]}.js`;
      const moonResp = await fetch(moonUrl);
      results.checks.push({
        name: 'moon-phase.js accessible',
        ok: moonResp.status === 200,
        detail: `HTTP ${moonResp.status}`
      });
    }
  } catch (e) {
    results.checks.push({ name: 'moon-phase.js check', ok: false, detail: e.message });
  }

  // 5. Check CSS is accessible
  try {
    const cssMatch = html.match(/main-([a-f0-9]+)\.css/);
    if (cssMatch) {
      const cssUrl = `${SITE_URL}/css/main-${cssMatch[1]}.css`;
      const cssResp = await fetch(cssUrl);
      results.checks.push({
        name: 'main.css accessible',
        ok: cssResp.status === 200,
        detail: `HTTP ${cssResp.status}, ${(cssResp.body.length / 1024).toFixed(0)}KB`
      });
    }
  } catch (e) {
    results.checks.push({ name: 'main.css check', ok: false, detail: e.message });
  }

  // 6. Syntax check scene-init.js (basic)
  // We can't run node --check on the ESM module (uses import/export),
  // but we can check for obvious issues
  try {
    const sceneMatch = html.match(/scene-init-([a-f0-9]+)\.js/);
    if (sceneMatch) {
      const sceneUrl = `${SITE_URL}/js/scene-init-${sceneMatch[1]}.js`;
      const sceneResp = await fetch(sceneUrl);
      const js = sceneResp.body;

      // Check for brace/paren balance
      const openBraces = (js.match(/{/g) || []).length;
      const closeBraces = (js.match(/}/g) || []).length;
      const balanced = openBraces === closeBraces;

      results.checks.push({
        name: 'JS brace balance',
        ok: balanced,
        detail: `open=${openBraces}, close=${closeBraces}`
      });
      if (!balanced) {
        results.errors.push(`Braces unbalanced: ${openBraces} open vs ${closeBraces} close`);
        results.exitCode = 1;
      }

      // Check for obvious truncation (file should end with }); or }})
      const trimmed = js.trim();
      const endsProperly = trimmed.endsWith('}') || trimmed.endsWith('});') || trimmed.endsWith('})();') || trimmed.endsWith('}');
      results.checks.push({
        name: 'JS not truncated',
        ok: endsProperly,
        detail: `ends with: "${trimmed.slice(-20)}"`
      });
      if (!endsProperly) {
        results.errors.push('JS file may be truncated');
        results.exitCode = 1;
      }
    }
  } catch (e) {
    results.checks.push({ name: 'JS syntax check', ok: false, detail: e.message });
  }

  return results;
}

// ═══════════════════════════════════════════════════════════════
// RUN
// ═══════════════════════════════════════════════════════════════
async function main() {
  const start = Date.now();

  try {
    const results = await check();
    const elapsed = Date.now() - start;

    console.log(`\n🎨 Scene Health Check — ${new Date().toISOString()}`);
    console.log(`⏱  Completed in ${elapsed}ms\n`);

    // Print results
    for (const c of results.checks) {
      const icon = c.ok ? '✅' : '❌';
      console.log(`  ${icon} ${c.name}: ${c.detail}`);
    }

    console.log('');
    if (results.exitCode === 0) {
      console.log('🟢 All checks passed — scene is healthy');
    } else {
      console.log(`🔴 ${results.errors.length} error(s) detected:`);
      for (const e of results.errors) console.log(`    ✗ ${e}`);
    }
    console.log('');

    process.exit(results.exitCode);
  } catch (e) {
    console.error(`\n🔨 Health check failed: ${e.message}\n`);
    process.exit(1);
  }
}

main();
