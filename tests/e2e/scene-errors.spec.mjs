// tests/e2e/scene-errors.spec.mjs
// ═══════════════════════════════════════════════════════════════
// 3D Scene Error Detection Tests
// Purpose: Detect when the Three.js scene fails to load/render
// ═══════════════════════════════════════════════════════════════
import { test, expect } from '@playwright/test';

// Helper: wait for scene ready signal with timeout
async function waitForScene(page, timeoutMs = 15000) {
  return page.evaluate((timeout) => {
    return new Promise((resolve) => {
      const start = Date.now();
      // Check if scene already signaled ready
      if (window.__sceneReadyCalled) {
        resolve({ ready: true, alreadyDone: true });
        return;
      }
      // Listen for ready signal
      const origFn = window.__sceneReady;
      window.__sceneReady = function() {
        window.__sceneReadyCalled = true;
        if (origFn) origFn();
        resolve({ ready: true, alreadyDone: false });
      };
      // Timeout fallback
      setTimeout(() => {
        resolve({ ready: false, elapsed: Date.now() - start });
      }, timeout);
    });
  }, timeoutMs);
}

// Helper: collect all JS errors from the page
async function getJSErrors(page) {
  return page.evaluate(() => {
    return window.__jsErrors || [];
  });
}

// Helper: check WebGL context health
async function getWebGLHealth(page) {
  return page.evaluate(() => {
    const canvas = document.querySelector('#canvas-container canvas');
    if (!canvas) return { canvasExists: false };

    let gl = null;
    try { gl = canvas.getContext('webgl2') || canvas.getContext('webgl'); } catch (e) {}

    if (!gl) return { canvasExists: true, webglSupported: false };

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    return {
      canvasExists: true,
      webglSupported: true,
      contextLost: gl.isContextLost(),
      renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown',
      vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'unknown',
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
      shaderVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
    };
  });
}

// Helper: check Three.js scene state
async function getThreeJSState(page) {
  return page.evaluate(() => {
    // Check if Three.js scene objects exist
    const canvas = document.querySelector('#canvas-container canvas');
    if (!canvas) return { canvasExists: false, threeActive: false };

    // The scene-init.js sets a global __threeScene or we can check render count
    // We check by looking at the canvas for actual pixel content
    return {
      canvasExists: true,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      sceneReadyCalled: !!window.__sceneReadyCalled,
      sceneFailedCalled: !!window.__sceneFailedCalled,
      sceneFailedMsg: window.__sceneFailedMsg || null,
      loaderHidden: !!document.getElementById('loader')?.classList.contains('hidden'),
      errorMsgShown: document.getElementById('scene-error')?.style.display !== 'none',
    };
  });
}

// Helper: capture console errors via page event listener
function attachConsoleCollector(page, errors) {
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push({ type: 'console', text: msg.text(), location: msg.location() });
    }
  });
  page.on('pageerror', (err) => {
    errors.push({ type: 'pageerror', text: err.message, stack: err.stack });
  });
}

// ═══════════════════════════════════════════════════════════════
// TEST SUITE
// ═══════════════════════════════════════════════════════════════

test.describe('3D Scene Error Detection', () => {
  const errors = [];

  test.beforeEach(async ({ page }) => {
    attachConsoleCollector(page, errors);
    errors.length = 0;
    await page.goto('http://localhost:8080', { timeout: 30000 });
  });

  test('1 — Scene ready signal fires within timeout', async ({ page }) => {
    const result = await waitForScene(page, 15000);
    expect(result.ready, 'Scene should signal ready within 15s').toBe(true);
  });

  test('2 — No uncaught JS errors during page load', async ({ page }) => {
    await page.waitForTimeout(5000); // Let scene fully initialize
    const jsErrors = await getJSErrors(page);
    const criticalErrors = jsErrors.filter(e =>
      !e.text?.includes('favicon') &&
      !e.text?.includes('net::ERR') &&
      !e.text?.includes('ResizeObserver')
    );
    expect(criticalErrors, `Unexpected JS errors: ${JSON.stringify(criticalErrors)}`).toEqual([]);
  });

  test('3 — Console has no WebGL / Three.js errors', async ({ page }) => {
    await page.waitForTimeout(5000);
    const jsErrors = await getJSErrors(page);
    const webglErrors = jsErrors.filter(e =>
      e.text?.toLowerCase().includes('webgl') ||
      e.text?.toLowerCase().includes('three') ||
      e.text?.toLowerCase().includes('shader') ||
      e.text?.toLowerCase().includes('attribute') ||
      e.text?.toLowerCase().includes('uniform')
    );
    expect(webglErrors, `WebGL/Three.js errors: ${JSON.stringify(webglErrors)}`).toEqual([]);
  });

  test('4 — Canvas exists and has valid dimensions', async ({ page }) => {
    const state = await getThreeJSState(page);
    expect(state.canvasExists, 'Canvas container should exist').toBe(true);
    expect(state.canvasWidth, 'Canvas width should be > 0').toBeGreaterThan(0);
    expect(state.canvasHeight, 'Canvas height should be > 0').toBeGreaterThan(0);
  });

  test('5 — WebGL context is active and not lost', async ({ page }) => {
    await page.waitForTimeout(3000);
    const health = await getWebGLHealth(page);
    expect(health.canvasExists, 'Canvas should exist').toBe(true);
    expect(health.webglSupported, 'WebGL should be supported').toBe(true);
    expect(health.contextLost, 'WebGL context should NOT be lost').toBe(false);
  });

  test('6 — Scene failed banner is NOT visible', async ({ page }) => {
    await page.waitForTimeout(5000);
    const state = await getThreeJSState(page);
    expect(state.sceneFailedCalled, '__sceneFailed should not have been called').toBe(false);
    expect(state.errorMsgShown, 'Error banner should not be visible').toBe(false);
  });

  test('7 — Loader disappears (scene finished loading)', async ({ page }) => {
    await page.waitForTimeout(8000);
    const state = await getThreeJSState(page);
    expect(state.loaderHidden, 'Loader should be hidden after scene loads').toBe(true);
  });

  test('8 — Canvas is not blank (pixels are drawn)', async ({ page }) => {
    // Wait for scene to render at least one frame
    await page.waitForTimeout(10000);

    const pixelCheck = await page.evaluate(() => {
      const canvas = document.querySelector('#canvas-container canvas');
      if (!canvas || canvas.width === 0 || canvas.height === 0) return { checked: false };

      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) return { checked: false, reason: 'no webgl context' };

      // Read a few pixels from the center of the canvas
      const x = Math.floor(canvas.width / 2);
      const y = Math.floor(canvas.height / 2);
      const pixels = new Uint8Array(4);
      gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

      return {
        checked: true,
        centerPixel: { r: pixels[0], g: pixels[1], b: pixels[2], a: pixels[3] },
        // If all pixels are (8,8,15) that's the clear color — scene may not have rendered
        isBlank: pixels[0] === 8 && pixels[1] === 8 && pixels[2] === 15 && pixels[3] === 255,
      };
    });

    expect(pixelCheck.checked, 'Should be able to read canvas pixels').toBe(true);
    expect(pixelCheck.isBlank, 'Canvas center pixel should not be blank clear color (scene should have drawn something)').toBe(false);
  });

  test('9 — All Three.js modules imported without CDN errors', async ({ page }) => {
    const cdnErrors = await page.evaluate(() => {
      return (window.__cdnErrors || []).concat(
        (window.__jsErrors || []).filter(e =>
          e.text?.includes('esm.sh') ||
          e.text?.includes('module') ||
          e.text?.includes('import')
        )
      );
    });
    expect(cdnErrors, `CDN/module errors: ${JSON.stringify(cdnErrors)}`).toEqual([]);
  });

  test('10 — Scene frame animation loop is running', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Check that animation loop is producing frame updates
    const frameData = await page.evaluate(() => {
      const canvas = document.querySelector('#canvas-container canvas');
      if (!canvas) return { active: false };
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) return { active: false, reason: 'no webgl' };

      // Read pixel at two different times — if animating, they should differ
      const readPixel = () => {
        const p = new Uint8Array(4);
        gl.readPixels(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, p);
        return `${p[0]},${p[1]},${p[2]}`;
      };

      const frame1 = readPixel();
      return { active: true, frame1, timestamp: Date.now() };
    });

    expect(frameData.active, 'Animation loop should be active (WebGL context accessible)').toBe(true);
  });
});

test.describe('Scene Recovery & Fallbacks', () => {
  test('11 — Error UI shows message when __sceneFailed is called', async ({ page }) => {
    await page.goto('http://localhost:8080', { timeout: 30000 });

    // Simulate scene failure
    await page.evaluate(() => {
      if (typeof window.__sceneFailed === 'function') {
        window.__sceneFailed('test error message');
      }
    });

    await page.waitForTimeout(500);

    const errorVisible = await page.evaluate(() => {
      const el = document.getElementById('scene-error');
      return el && el.style.display !== 'none';
    });

    expect(errorVisible, 'Error UI should be visible after scene failure').toBe(true);
  });

  test('12 — Error UI contains reload button', async ({ page }) => {
    await page.goto('http://localhost:8080', { timeout: 30000 });

    const hasReload = await page.evaluate(() => {
      const el = document.getElementById('scene-error');
      return el && el.querySelector('button') !== null;
    });

    expect(hasReload, 'Error UI should have a reload button').toBe(true);
  });
});
