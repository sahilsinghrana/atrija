# 3D Scene Error Detection Plan
## Van Gogh Site (Atrijā) — Comprehensive QA Strategy

### Problem Statement
The Three.js 3D scene can fail silently due to:
1. **Syntax errors** in scene-introduced by agents/cron jobs (unbalanced braces, missing function closures)
2. **CDN import failures** (esm.sh Three.js modules fail to load)
3. **WebGL context loss** (browser kills WebGL due to memory/timeout)
4. **Shader compilation errors** (GLSL syntax errors, unsupported extensions)
5. **Missing textures** (Three.js TextureLoader fails to load SVG/PNG assets)
6. **Runtime errors** (null references, undefined function calls in animation loop)
7. **Truncated files** (write_file partial write leaves file incomplete)

Current detection: Only a 12-second timeout that hides the loader and shows a generic error banner.
No proactive detection, no detailed error reporting, no automated recovery.

---

### Detection Methods

#### 1. Static File Validation (No Browser Needed)
**Script**: `scripts/scene-health-check.js` (Node.js)

Runs via cron job every N minutes. Checks:
- ✅ HTTP 200 on main page
- ✅ HTML contains critical elements (canvas-container, loader, error fallback)
- ✅ scene-init.js HTTP 200 and file size > 0
- ✅ JS brace/paren balance (detects truncation)
- ✅ JS file ends properly (detects incomplete writes)
- ✅ CSS and moon-phase.js accessible
- ✅ Critical functions present in JS (createStars, createMoon, EffectComposer, render loop)

**Limitations**: Can't detect WebGL errors, shader errors, CDN issues, runtime errors

#### 2. Playwright E2E Tests (Browser-Based)
**File**: `tests/e2e/scene-errors.spec.mjs`

Full browser-based checks:
- ✅ `__sceneReady` signal fires within 15s
- ✅ No uncaught JS errors (pageerror event listener)
- ✅ No WebGL/Three.js console errors
- ✅ Canvas exists with valid dimensions (width > 0, height > 0)
- ✅ WebGL context active and not lost
- ✅ Scene failed banner NOT visible
- ✅ Loader disappears (scene finished initialization)
- ✅ Canvas pixels are not blank (scene actually rendered something)
- ✅ All Three.js CDN modules loaded without errors
- ✅ Animation loop is running (WebGL context accessible)
- ✅ Error UI shows with reload button on simulated failure

**Requirements**: Playwright + Chromium installed, browser can reach port 8080

#### 3. Self-Detection in scene-init.js (Runtime)
Add `__sceneFailed(msg)` call at every failure point:
- WebGL context creation failure
- CDN import failure (catch around dynamic import)
- Texture loading failure (TextureLoader.load error callback)
- Shader compilation failure (gl.getShaderParameter check)
- Animation loop error (try-catch around each frame)
- EffectComposer initialization failure

#### 4. Error Collection via page.onerror
Add to scene-init.js init:
```js
window.__jsErrors = [];
window.addEventListener('error', (e) => {
  window.__jsErrors.push({ text: e.message, stack: e.error?.stack });
});
window.onunhandledrejection = (e) => {
  window.__jsErrors.push({ text: e.reason?.message || String(e.reason) });
};
```

---

### Implementation Plan

#### Phase 1: Immediate (Static Health Check)
1. ✅ Create `scripts/scene-health-check.js` — lightweight Node.js checker
2. Add to cron: run every 5 minutes, report errors
3. Exit code 0 = healthy, 1 = broken (agent can act on this)

#### Phase 2: E2E Test Suite (Playwright)
1. ✅ Create `tests/e2e/scene-errors.spec.mjs`
2. Run after every deploy (in CI or deploy script)
3. Run periodically via cron (requires browser)

#### Phase 3: Enhanced Runtime Error Detection
1. Add `window.__jsErrors` collector to scene-init.js init
2. Wrap animation loop in try-catch with `__sceneFailed` call
3. Add WebGL context lost handler
4. Add CDN import error handler
5. Add shader compilation error handler

#### Phase 4: Automated Recovery
1. Cron job runs health check every 5 min
2. If unhealthy AND git has new commits since last healthy:
   - Identify the bad commit
   - Run `git revert` or `git checkout <last-good-commit> -- public/js/scene-init.js`
   - Rebuild and redeploy
3. If CDN failure detected:
   - Switch to fallback CDN (unpkg.com or cdnjs.cloudflare.com)
   - Rebuild with fallback URLs

---

### Cron Job Specifications

#### Health Check Cron (Every 5 minutes)
```
action: create
schedule: 5m
prompt: |
  Run the scene health check and report issues.
  
  Steps:
  1. cd /root/projects/van-gogh-site && node scripts/scene-health-check.js
  2. If exit code 0, output HEALTHY and do nothing else
  3. If exit code 1, the script already printed the errors
  4. Check: curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8080/
     - If not 200, report nginx may be down (check service)
  5. Check: git log --oneline -5 public/js/scene-init.js
     - Report which commit last modified scene-init.js
  6. If the health check has been failing for >3 consecutive runs:
     - Alert user with specific error details
     - Suggest reverting scene-init.js to last known good commit
  
  Output format:
  - HEALTHY: all checks passed
  - DEGRADED: N checks failed (list them)
  - BROKEN: site unreachable or completely failed
  - RECOVERY SUGGESTION: specific commit to revert to
```

#### E2E Test Cron (Every 6 hours)
```
action: create
schedule: 6h
prompt: |
  Run the Playwright scene error detection tests.
  
  Prerequisites: nginx must be running on port 8080
  
  Steps:
  1. Check nginx is running: curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8080/
     - If not 200, skip and report "nginx not running"
  2. cd /root/projects/van-gogh-site
  3. npx playwright test tests/e2e/scene-errors.spec.mjs --reporter=list
  4. If all tests pass: report "All 12 scene health tests passed"
  5. If any test fails: report which test failed and the error details
  6. If >3 tests fail: alert user with full test output
  
  Note: This requires Chromium to be installed. If playwright fails to
  launch browser, report "Playwright browser not available" and skip.
```

---

### Error Classification

| Error Type | Detection Method | Severity | Auto-Recoverable |
|---|---|---|---|
| Broken JS syntax (braces) | Static health check | 🔴 Critical | Yes — revert file |
| Truncated JS file | Static health check | 🔴 Critical | Yes — revert file |
| Missing HTML elements | Static health check | 🔴 Critical | Rebuild + deploy |
| CDN import failure | Playwright E2E | 🔴 Critical | Switch CDN |
| WebGL context lost | Playwright E2E | 🟡 Medium | Page reload |
| Shader compile error | Playwright E2E + runtime | 🟡 Medium | Revert shader changes |
| Texture load failure | Runtime error handler | 🟡 Medium | Check asset files |
| Animation loop crash | Runtime error handler | 🔴 Critical | Revert scene changes |
| Loader stuck (>12s) | Playwright E2E | 🟠 High | Check CDN/network |

---

### Files Created/Modified

1. **`scripts/scene-health-check.js`** — Node.js static health checker (NEW)
2. **`tests/e2e/scene-errors.spec.mjs`** — Playwright E2E test suite (NEW)
3. **`public/js/scene-init.js`** — Add runtime error handlers (MODIFY — user approval required)

---

### Key Design Decisions

1. **Static first**: The Node.js health check runs without a browser — it's fast, lightweight, and catches the most common issues (syntax errors, truncation, missing files)

2. **No browser required for basic detection**: 80% of scene errors are JS syntax/truncation issues detectable without WebGL

3. **Playwright for deep checks**: Canvas pixel reading, WebGL context health, shader errors — these need a real browser

4. **Error signals in HTML**: The existing `__sceneReady`/`__sceneFailed` pattern is good — expand it with more granular error points

5. **Cron-based detection**: Hermes cron jobs can run checks every 5 min and alert the user proactively, instead of waiting for them to notice
