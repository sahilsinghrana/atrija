# PRD: Loading Optimizations

> **ID:** idea-009
> **Category:** Performance
> **Priority:** high
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-05-15

---

## 1. Overview

**One-liter:** Drastically reduce time-to-first-meaningful-paint and time-to-interactive by optimizing every layer of the loading pipeline — from initial HTML parse through Three.js scene initialization.

**Problem:** The current loading experience blocks on a full Three.js scene initialization (CDN fetches from esm.sh, 850-line scene-init.js parsing + execution, WebGL context creation, post-processing shader compilation, 2500+ star geometry generation) before the loader fades out. On slower connections or low-end mobile devices, users see a spinning gold ring for 3-8+ seconds with no progress feedback. The loader only fades after `requestAnimationFrame` fires twice (~32-48ms after first frame), but the scene itself may take seconds to become visually "ready." All Three.js code is loaded from esm.sh CDN with no local bundling, meaning 6 separate network round-trips (three.js core + 4 post-processing modules) before any 3D code can execute. Fonts load from Google Fonts with no `font-display: swap` strategy, potentially causing invisible text during loading. No caching headers are configured on Nginx for static assets. SVGs are uncompressed. No lazy loading exists for the 3D scene — it initializes immediately even if the canvas container is below the fold.

**Solution:** Implement a multi-phase loading optimization strategy: (1) preload critical assets (loader CSS, fonts with `font-display: swap`, first shader) via `<link rel="preload">` tags, (2) show a static CSS gradient background immediately as a visual placeholder before any JS loads, (3) lazy-initialize the Three.js scene only when the canvas container enters the viewport using IntersectionObserver, (4) progressively load 3D layers (stars first, then moon, then flowers, then post-processing), (5) add a real progress indicator to the loader that tracks actual module loading milestones, (6) compress SVGs and add proper Nginx caching headers, (7) defer non-critical JS (scroll reveal, flower animations, flute click handler), and (8) reduce initial geometry counts with progressive enhancement after load.

---

## 2. User Stories

- As a visitor on a slow 3G connection, I want to see the page background and text content immediately so that I don't stare at a blank screen.
- As a visitor, I want the loader to show real progress (not just a spinning ring) so that I know the site is actually loading.
- As a visitor on a low-end mobile device, I want the 3D scene to load only when I scroll near it so that the rest of the page is interactive faster.
- As a visitor, I want the site to load instantly on repeat visits so that I don't wait for assets I've already downloaded.
- As a visitor, I want text to be visible immediately (even with fallback fonts) so that I can start reading before custom fonts finish loading.
- As a visitor, I want the loader to disappear as soon as the first visual frame renders, not after a fixed delay.

---

## 3. Technical Specification

### 3.1 Architecture

**Files created/modified:**

| File | Action | Purpose |
|------|--------|---------|
| `src/layouts/BaseLayout.astro` | Modify | Add preload hints, static background placeholder, deferred non-critical scripts |
| `public/css/loader.css` | Modify | Add progress bar styles, faster fade-out transition |
| `public/js/scene-init.js` | Modify | Add progressive layer loading, lazy init via IntersectionObserver, reduced initial geometry |
| `public/js/loader-progress.js` | Create | Lightweight loader progress tracking (loaded before scene-init.js) |
| `public/images/*.svg` | Optimize | Compress all SVGs (svgo or manual) |
| `$PREFIX/etc/nginx/nginx.conf` | Modify | Add caching headers, gzip/brotli compression, ETag support |
| `public/js/scene-lazy-init.js` | Create | Small bootstrap script that observes canvas container and triggers scene-init.js load |

**Dependencies:**
- Existing: `BaseLayout.astro` (loader HTML + CSS link), `scene-init.js` (all Three.js code), `loader.css` (spinner styles), Nginx config
- New: IntersectionObserver API (native, no dependency), `font-display: swap` via Google Fonts URL parameter

### 3.2 Implementation Details

#### Step 1: Static Background Placeholder (Immediate Visual Feedback)
- File: `src/layouts/BaseLayout.astro`
- What to do:
  - Add an inline `<style>` block in `<head>` (before the loader CSS) that sets a Van Gogh-style gradient background on `#canvas-container` and `body`:
    ```css
    body, #canvas-container {
      background: linear-gradient(180deg, #0a0a1a 0%, #0d1b2a 30%, #1b2838 60%, #0a0a1a 100%);
    }
    ```
  - This ensures that even before any JS loads, the page has a visually rich dark blue gradient that matches the Starry Night aesthetic.
  - Add a subtle CSS animation (pulsing radial gradient) to the loader background to make it feel "alive":
    ```css
    #loader {
      background: radial-gradient(ellipse at center, rgba(25, 40, 80, 0.3) 0%, #08080f 70%);
    }
    ```
- Expected outcome: Users see a beautiful dark gradient immediately on page load, not a flat black screen.

#### Step 2: Preload Critical Assets
- File: `src/layouts/BaseLayout.astro`
- What to do:
  - Add `<link rel="preload">` tags in `<head>` after the existing font preconnect tags:
    ```html
    <link rel="preload" href="/css/loader.css" as="style" />
    <link rel="preload" href="/js/scene-init.js" as="script" crossorigin />
    ```
  - Add `&display=swap` to the Google Fonts URL (it already uses `display=swap` — verify and ensure it's present):
    ```html
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Inter:wght@300;400;500;600&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap" rel="stylesheet" />
    ```
  - Add `font-display: swap` as a fallback in the `@font-face` declarations (inline style):
    ```css
    @font-face { font-display: swap; }
    ```
  - Preload the most critical SVG images:
    ```html
    <link rel="preload" href="/images/moon.svg" as="image" type="image/svg+xml" />
    <link rel="preload" href="/images/stars.svg" as="image" type="image/svg+xml" />
    ```
- Expected outcome: Loader CSS is available immediately, fonts render with fallback then swap, critical images are fetched early.

#### Step 3: Font Loading Optimization
- File: `src/layouts/BaseLayout.astro`
- What to do:
  - Verify Google Fonts URL has `&display=swap` (already present in current code).
  - Add a small inline script that adds a `fonts-loaded` class to `<html>` when fonts are ready:
    ```html
    <script>
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function() {
        document.documentElement.classList.add('fonts-loaded');
      });
    }
    </script>
    ```
  - Update the font-family declarations to use a progressive fallback stack:
    ```css
    --font-serif: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    ```
  - (Optional, future) Consider subsetting fonts to only include Latin + Devanagari characters actually used on the site. This can be done by adding `&text=` parameter to Google Fonts URL with specific characters, or by self-hosting subset fonts.
- Expected outcome: Text is visible immediately with system fonts, then smoothly swaps to custom fonts when loaded. No invisible text (FOIT).

#### Step 4: Lazy Load Three.js Scene with IntersectionObserver
- File: `public/js/scene-lazy-init.js` (new file)
- What to do:
  - Create a small bootstrap script (~20 lines) that:
    1. Checks if `#canvas-container` exists
    2. Uses IntersectionObserver to detect when the canvas container is within 200px of the viewport
    3. When triggered, dynamically creates a `<script type="module" src="/js/scene-init.js">` element and appends it to `<head>`
    4. Falls back to immediate load if IntersectionObserver is not supported
    ```javascript
    (function() {
      var container = document.getElementById('canvas-container');
      if (!container) return;
      function loadScene() {
        var s = document.createElement('script');
        s.type = 'module';
        s.src = '/js/scene-init.js';
        document.head.appendChild(s);
      }
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function(entries) {
          if (entries[0].isIntersecting) {
            loadScene();
            io.disconnect();
          }
        }, { rootMargin: '200px 0px' });
        io.observe(container);
      } else {
        loadScene();
      }
    })();
    ```
  - Update `src/pages/index.astro` line 434: Replace the inline `<script type="module" src="/js/scene-init.js">` with:
    ```html
    <script src="/js/scene-lazy-init.js" defer></script>
    ```
- Expected outcome: The heavy Three.js scene (CDN fetches + 850 lines of JS + WebGL init) only loads when the user scrolls near the canvas container. The rest of the page (text content, sections, quotes) becomes interactive much faster.

#### Step 5: Progressive 3D Scene Loading
- File: `public/js/scene-init.js`
- What to do:
  - Refactor the scene initialization to load in phases:
    - **Phase 1 (immediate):** Create renderer, camera, basic lights, stars (reduced count: 800 desktop / 400 mobile)
    - **Phase 2 (after first frame):** Add moon, waves
    - **Phase 3 (after 500ms):** Add sunflowers, tulips, flute, music notes
    - **Phase 4 (after 1000ms):** Add post-processing passes (Van Gogh + glitch shaders)
  - Implement using `requestIdleCallback` or `setTimeout` for phases 2-4:
    ```javascript
    // After initial scene setup + first render
    requestAnimationFrame(function() {
      // Phase 1: Stars already loaded, fade out loader
      fadeOutLoader();
      // Phase 2: Moon + waves
      setTimeout(function() { initMoon(); initWaves(); }, 0);
      // Phase 3: Flowers + flute
      setTimeout(function() { initFlowers(); initFlute(); }, 500);
      // Phase 4: Post-processing
      setTimeout(function() { initPostProcessing(); }, 1000);
    });
    ```
  - Reduce initial star count from 2500/1500 to 800/400, then add remaining stars in Phase 3:
    ```javascript
    var initialStarCount = isLowEnd ? 400 : 800;
    var finalStarCount = isLowEnd ? 1500 : 2500;
    // ... create initial stars ...
    // In Phase 3:
    addRemainingStars(finalStarCount - initialStarCount);
    ```
  - Reduce initial wave segments from 64×64/32×32 to 32×16/16×16, then increase in Phase 4.
- Expected outcome: The first frame renders much faster (fewer draw calls, no post-processing compilation), and additional visual layers are added progressively. Users see a starry sky within 1-2 seconds instead of waiting for the full scene.

#### Step 6: Loader Progress Indicator
- File: `public/css/loader.css`
- What to do:
  - Add a progress bar element to the loader:
    ```css
    #loader .loader-progress {
      width: 120px;
      height: 2px;
      background: rgba(255, 213, 79, 0.1);
      border-radius: 1px;
      margin-top: 1.5rem;
      overflow: hidden;
    }
    #loader .loader-progress-bar {
      width: 0%;
      height: 100%;
      background: linear-gradient(90deg, rgba(255,213,79,0.3), #ffd54f);
      border-radius: 1px;
      transition: width 0.3s ease;
    }
    ```
  - Add the progress bar HTML to the loader in `BaseLayout.astro`:
    ```html
    <div id="loader">
      <div class="loader-ring"></div>
      <div class="loader-text">Painting the sky<span class="loader-dots"></span></div>
      <div class="loader-progress"><div class="loader-progress-bar" id="loader-progress-bar"></div></div>
    </div>
    ```
- File: `public/js/loader-progress.js` (new file)
- What to do:
  - Create a tiny script (< 1KB) that updates the progress bar based on milestones:
    ```javascript
    (function() {
      var bar = document.getElementById('loader-progress-bar');
      if (!bar) return;
      var milestones = [];
      // Called by scene-init.js at key points
      window.__updateLoaderProgress = function(pct) {
        if (bar) bar.style.width = pct + '%';
      };
      // Simulate progress while waiting for scene-init
      var fakeProgress = 0;
      var fakeInterval = setInterval(function() {
        fakeProgress += Math.random() * 15;
        if (fakeProgress > 85) { fakeProgress = 85; clearInterval(fakeInterval); }
        if (bar) bar.style.width = fakeProgress + '%';
      }, 300);
      // Stop fake progress when scene takes over
      window.__sceneLoadingStarted = function() {
        clearInterval(fakeInterval);
      };
    })();
    ```
  - Load this script in `BaseLayout.astro` before the scene-lazy-init script:
    ```html
    <script src="/js/loader-progress.js"></script>
    ```
  - In `scene-init.js`, call `window.__updateLoaderProgress(30)` after CDN modules are fetched, `window.__updateLoaderProgress(60)` after WebGL context is created, `window.__updateLoaderProgress(90)` after first frame renders, and `window.__updateLoaderProgress(100)` before fading out the loader.
- Expected outcome: Users see a meaningful progress bar that advances through loading stages instead of a passive spinner.

#### Step 7: Faster Loader Fade-Out
- File: `public/css/loader.css`
- What to do:
  - Reduce the loader fade-out transition from `0.8s` to `0.4s`:
    ```css
    #loader {
      transition: opacity 0.4s ease, visibility 0.4s ease;
    }
    ```
  - Add a slight scale-down effect for a more polished feel:
    ```css
    #loader.hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transform: scale(1.02);
    }
    #loader {
      transition: opacity 0.4s ease, visibility 0.4s ease, transform 0.4s ease;
    }
    ```
- File: `public/js/scene-init.js`
- What to do:
  - Change the double-rAF fade-out to a single rAF (the double-rAF was added to ensure the first frame is painted, but with progressive loading, the first frame of stars is sufficient):
    ```javascript
    // Replace the double rAF with:
    requestAnimationFrame(function() {
      var l = document.getElementById('loader');
      if (l) l.classList.add('hidden');
    });
    ```
- Expected outcome: Loader disappears ~100-200ms sooner, and the transition feels snappier.

#### Step 8: Defer Non-Critical JavaScript
- File: `src/layouts/BaseLayout.astro`
- What to do:
  - Add `defer` attribute to the scroll reveal script (currently inline, wrap in external file or add defer):
    ```html
    <script>
    // Wrap the scroll reveal IIFE in a DOMContentLoaded check
    // or move to an external file with defer
    </script>
    ```
  - Move the flower animation script (lines 1086-1121) to an external file `public/js/flower-anim.js` and load with `defer`:
    ```html
    <script src="/js/flower-anim.js" defer></script>
    ```
  - Move the flute click handler (lines 1046-1070) to an external file `public/js/flute-handler.js` and load with `defer`:
    ```html
    <script src="/js/flute-handler.js" defer></script>
    ```
  - Move the mobile viewport fix (lines 1123-1139) to an external file `public/js/viewport-fix.js` and load with `defer`:
    ```html
    <script src="/js/viewport-fix.js" defer></script>
    ```
  - Alternatively, keep them inline but wrap in `requestIdleCallback` to avoid blocking the main thread during initial load:
    ```javascript
    requestIdleCallback(function() {
      // scroll reveal, flower anim, flute handler, viewport fix
    });
    ```
- Expected outcome: The main thread is freed up for critical rendering and Three.js initialization. Non-critical interactivity scripts execute after the page is visually ready.

#### Step 9: SVG Image Optimization
- File: `public/images/*.svg` (all SVG files)
- What to do:
  - Run all SVGs through SVGO optimization:
    ```bash
    cd /root/projects/van-gogh-site/public/images
    npx svgo --pretty --indent=2 --multipass moon.svg sunflowers.svg tulips.svg flute.svg stars.svg waves.svg
    ```
  - Manual optimizations if SVGO is not available:
    - Remove XML declaration (`<?xml version="1.0"?>`)
    - Remove comments
    - Remove empty groups (`<g></g>`)
    - Round path coordinates to 2 decimal places
    - Remove unnecessary `xmlns` attributes on inner elements
    - Collapse `style` attributes where possible
  - Consider creating WebP versions of complex SVGs as fallbacks for browsers that render WebP more efficiently:
    ```bash
    # Only if SVGs are very complex (many paths)
    # Convert to WebP at 85% quality
    # cwebp -q 85 moon.svg -o moon.webp
    ```
  - Update references in `scene-init.js` to use WebP where available with SVG fallback:
    ```javascript
    // Use picture element or check WebP support
    var useWebP = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
    var ext = useWebP ? '.webp' : '.svg';
    ```
- Expected outcome: SVG file sizes reduced by 30-60%, faster parsing and rendering. WebP fallbacks for complex images on supported browsers.

#### Step 10: Nginx Caching Strategy
- File: `$PREFIX/etc/nginx/nginx.conf` (Termux system file)
- What to do:
  - Add caching headers for static assets:
    ```nginx
    # In the server block
    location ~* \.(js|css)$ {
      expires 1y;
      add_header Cache-Control "public, immutable";
      add_header Vary "Accept-Encoding";
    }
    location ~* \.(svg|png|jpg|webp|woff2?)$ {
      expires 1y;
      add_header Cache-Control "public, immutable";
    }
    location ~* \.html$ {
      expires 1h;
      add_header Cache-Control "public, must-revalidate";
    }
    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;
    gzip_min_length 256;
    # Enable ETag for cache validation
    etag on;
    ```
  - Add security headers that also help with caching:
    ```nginx
    add_header X-Content-Type-Options "nosniff" always;
    ```
  - Reload nginx after changes:
    ```bash
    nginx -s reload
    ```
- Expected outcome: Static assets (JS, CSS, images, fonts) are cached by the browser for 1 year. HTML is revalidated hourly (important for daily content mutations). Gzip reduces transfer sizes by 60-80% for text assets. Repeat visits load almost instantly.

#### Step 11: Reduce Three.js Init Time (Geometry Optimization)
- File: `public/js/scene-init.js`
- What to do:
  - Reduce initial geometry counts across the board:
    - Stars: 2500 → 800 (desktop), 1500 → 400 (mobile) — add rest progressively
    - Wave segments: 64×64 → 32×16 (desktop), 32×32 → 16×16 (mobile)
    - Music notes: 30 → 15 (desktop), 40 → 10 (mobile)
    - Sunflowers: Reduce by 50% initially
    - Tulips: Reduce by 50% initially
  - Use `BufferGeometryUtils.mergeGeometries()` (from examples/jsm/utils/) to batch star particles into a single draw call (already using BufferGeometry, but ensure it's a single geometry object).
  - Set `powerPreference: 'low-power'` (already done — keep this).
  - Reduce initial pixel ratio cap from 1.5 to 1.0 for the first 2 seconds, then increase:
    ```javascript
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowEnd ? 1.0 : 1.0));
    // After 2 seconds, bump up:
    setTimeout(function() {
      scene.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowEnd ? 1.0 : 1.5));
    }, 2000);
    ```
  - Skip post-processing entirely on low-end devices (already partially done — make it more aggressive):
    ```javascript
    if (isLowEnd) {
      // Skip both Van Gogh and glitch passes, just use raw renderer
      this.composer = null; // Use renderer directly
    }
    ```
- Expected outcome: First frame renders 2-4x faster on low-end devices. Full quality is restored progressively after initial load.

#### Step 12: Service Worker for Offline/Instant Loading (Future Enhancement)
- File: `public/sw.js` (new file)
- What to do:
  - Create a minimal service worker that caches all static assets:
    ```javascript
    const CACHE_NAME = 'vangogh-v1';
    const ASSETS = [
      '/', '/css/loader.css', '/js/scene-init.js', '/js/scene-lazy-init.js',
      '/js/loader-progress.js', '/images/moon.svg', '/images/stars.svg',
      '/images/sunflowers.svg', '/images/tulips.svg', '/images/flute.svg',
      '/images/waves.svg'
    ];
    self.addEventListener('install', e => {
      e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
      self.skipWaiting();
    });
    self.addEventListener('fetch', e => {
      e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
    });
    ```
  - Register in `BaseLayout.astro`:
    ```html
    <script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
    </script>
    ```
- Expected outcome: After first visit, the site loads instantly from cache (including Three.js modules). Note: This is a future enhancement — the CDN-based Three.js loading from esm.sh may complicate SW caching.

### 3.3 Mobile Considerations

- **Lazy loading:** The IntersectionObserver lazy init is especially impactful on mobile, where the canvas container is often below the fold. Mobile users get text content immediately without waiting for 3D.
- **Reduced geometry:** All initial geometry counts are reduced by 60-70% on mobile (isLowEnd check). Full counts are restored after 2-3 seconds if the device can handle it.
- **Post-processing:** Van Gogh + glitch shaders are skipped entirely on mobile (isLowEnd). The raw Three.js render is still beautiful with the star/wave/moon scene.
- **Pixel ratio:** Capped at 1.0 on mobile to avoid rendering at 2x/3x resolution on high-DPI mobile screens.
- **Font loading:** `font-display: swap` is critical on mobile where custom font downloads can take 2-5 seconds on slow connections.
- **Performance budget:**
  - Max initial draw calls: 5 (stars 1, moon 1, waves 1, background 1, UI 1)
  - Max initial triangles: 5,000 (stars as point sprites don't count as triangles)
  - Max texture memory: 2MB (SVGs are tiny, no raster textures)
  - Target time-to-first-frame: < 1.5s on 3G, < 0.5s on 4G
  - Target time-to-interactive: < 3s on 3G, < 1s on 4G
- **Touch events:** The flute click handler uses `addEventListener('click', ...)` which has a 300ms delay on some mobile browsers. Consider adding `touch-action: manipulation` to the flute container or using `pointerdown` event.

### 3.4 Data Structures

```json
{
  "loadingPhases": [
    { "id": 1, "name": "critical-html", "description": "HTML + CSS parsed, static background shown", "targetTime": "0ms" },
    { "id": 2, "name": "loader-visible", "description": "Loader screen with progress bar visible", "targetTime": "50ms" },
    { "id": 3, "name": "modules-fetched", "description": "Three.js CDN modules fetched", "targetTime": "1000ms" },
    { "id": 4, "name": "webgl-ready", "description": "WebGL context created, basic scene rendered", "targetTime": "1500ms" },
    { "id": 5, "name": "first-frame", "description": "First frame with stars rendered, loader fades", "targetTime": "2000ms" },
    { "id": 6, "name": "scene-complete", "description": "All 3D layers loaded, post-processing active", "targetTime": "4000ms" }
  ],
  "geometryBudgets": {
    "desktop": { "initialStars": 800, "finalStars": 2500, "initialWaves": "32x16", "finalWaves": "64x64", "initialNotes": 15, "finalNotes": 30 },
    "mobile": { "initialStars": 400, "finalStars": 1500, "initialWaves": "16x16", "finalWaves": "32x32", "initialNotes": 10, "finalNotes": 40 }
  },
  "cachingPolicy": {
    "js": "1 year, immutable",
    "css": "1 year, immutable",
    "images": "1 year, immutable",
    "html": "1 hour, must-revalidate",
    "fonts": "1 year, immutable"
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Static background visible before JS loads | `tests/loading/01-static-bg.html` | `body` has gradient background within 50ms of HTML parse |
| Preload tags present in head | `tests/loading/02-preloads.js` | `<link rel="preload">` exists for loader.css, scene-init.js, moon.svg, stars.svg |
| Font-display swap enabled | `tests/loading/03-fonts.js` | Google Fonts URL contains `display=swap`; text visible with fallback font |
| Lazy init script loads scene on scroll | `tests/loading/04-lazy-init.js` | scene-init.js NOT in DOM initially; added when canvas-container is within 200px of viewport |
| Progressive loading phases execute | `tests/loading/05-progressive.js` | Stars render before moon; moon renders before flowers; flowers before post-processing |
| Progress bar updates | `tests/loading/06-progress.js` | `#loader-progress-bar` width increases from 0% to 100% during loading |
| Loader fades in < 400ms | `tests/loading/07-fade-out.js` | Loader `opacity` reaches 0 within 400ms of first frame |
| SVGs are optimized | `tests/loading/08-svg-optimize.js` | All SVG files < 5KB; no XML declarations; no comments |
| Nginx caching headers set | `tests/loading/09-nginx-cache.js` | `Cache-Control: public, immutable` on JS/CSS/image assets; `must-revalidate` on HTML |
| Reduced initial geometry | `tests/loading/10-geometry.js` | Initial star count ≤ 800 (desktop) or ≤ 400 (mobile); wave segments ≤ 32×16 |
| Non-critical JS deferred | `tests/loading/11-defer.js` | Scroll reveal, flower anim, flute handler don't block first paint |

### 4.2 Green Phase — Implementation

What code makes the tests pass:
1. Add inline gradient CSS to BaseLayout.astro `<head>` (Step 1)
2. Add `<link rel="preload">` tags (Step 2)
3. Verify `display=swap` in font URL + add font-loading class (Step 3)
4. Create `scene-lazy-init.js` with IntersectionObserver (Step 4)
5. Refactor `scene-init.js` into phased initialization (Step 5)
6. Create `loader-progress.js` + update loader HTML/CSS (Step 6)
7. Reduce fade-out transition to 0.4s (Step 7)
8. Move non-critical scripts to deferred external files (Step 8)
9. Run SVGO on all SVG files (Step 9)
10. Update nginx.conf with caching headers + gzip (Step 10)
11. Reduce initial geometry counts in scene-init.js (Step 11)

### 4.3 Refactor Phase — Optimization

- Measure actual performance with Lighthouse before/after each step
- A/B test progressive loading timing (500ms/1000ms phases) to find optimal balance
- Consider inlining critical CSS (loader + design tokens) directly in `<head>` to eliminate one network request
- Evaluate whether esm.sh CDN is faster than bundling Three.js locally (measure TTFB for CDN vs local)
- If CDN is slower, consider vendoring Three.js core into `public/js/vendor/three.module.js` to eliminate 5 network round-trips
- Consider using `<link rel="modulepreload">` for scene-init.js if browser support is sufficient
- Evaluate `content-visibility: auto` on below-fold sections to reduce initial rendering cost
- Consider `fetchpriority="high"` on the loader CSS and `fetchpriority="low"` on scene-init.js preload

---

## 5. Acceptance Criteria

- [ ] Static gradient background is visible within 50ms of HTML parse (before any JS/CSS loads)
- [ ] Loader shows a progress bar that advances through loading milestones (0% → 30% → 60% → 90% → 100%)
- [ ] Loader fades out within 400ms of first frame render (down from 800ms)
- [ ] Three.js scene initializes only when canvas container is within 200px of viewport (lazy loading)
- [ ] First frame with stars renders within 1.5s on 3G / 0.5s on 4G
- [ ] Progressive loading: stars → moon/waves → flowers → post-processing (each phase adds visual richness)
- [ ] Initial geometry counts reduced by 60-70% (stars: 800/400, waves: 32×16/16×16)
- [ ] Text is visible with fallback fonts within 100ms (font-display: swap working)
- [ ] All SVG files are optimized (no XML declarations, no comments, 30-60% size reduction)
- [ ] Nginx serves JS/CSS/images with `Cache-Control: public, immutable` and 1-year expiry
- [ ] Nginx serves HTML with `Cache-Control: public, must-revalidate` and 1-hour expiry
- [ ] Gzip compression enabled for text assets (JS, CSS, SVG, HTML)
- [ ] Non-critical JS (scroll reveal, flowers, flute, viewport fix) doesn't block first paint
- [ ] Post-processing shaders skipped on mobile/low-end devices
- [ ] Site loads from cache on repeat visits (no re-download of static assets)
- [ ] Lighthouse Performance score ≥ 80 (mobile) / ≥ 90 (desktop)
- [ ] No frame rate drops below 30fps on mobile during progressive loading

---

## 6. Dependencies & Risks

**Dependencies:**
- Astro 4 build pipeline (no changes needed, just file edits)
- Nginx on Termux (must have gzip module enabled; verify with `nginx -V`)
- IntersectionObserver API (supported in all modern browsers; fallback to immediate load for older)
- SVGO for SVG optimization (can be done manually if `npx svgo` unavailable)
- esm.sh CDN availability (if CDN is down, site won't have 3D — consider local fallback)

**Risks:**
- **CDN dependency:** All Three.js code loads from esm.sh. If the CDN is slow or down, the 3D scene won't load. *Mitigation:* Consider vendoring Three.js as a local fallback, or add a timeout that shows a static background if scene-init.js fails to load within 10s.
- **Lazy loading delay:** If the user scrolls to the canvas container before scene-init.js has loaded, they'll see a brief empty container. *Mitigation:* The 200px rootMargin provides a head start. Also, the static gradient background ensures it never looks broken.
- **Progressive loading complexity:** Phased initialization adds complexity to scene-init.js. *Mitigation:* Keep the phase logic simple (setTimeout-based) and well-commented. Each phase is independent.
- **Nginx config changes:** Modifying the system nginx.conf could affect other sites on Termux. *Mitigation:* Only add location blocks specific to this site's asset types. Test with `nginx -t` before reloading.
- **Cache invalidation:** 1-year cache on JS/CSS means updates won't reach users immediately. *Mitigation:* Astro's build process generates hashed filenames for CSS. For JS files without hashes, use query string versioning (`/js/scene-init.js?v=2`) when deploying breaking changes.
- **Service worker complexity:** SW caching can make development harder (stale assets). *Mitigation:* Mark SW as a future enhancement (Step 12). Implement only after all other optimizations are stable.

---

## 7. Changelog Entry

```json
{
  "type": "perf",
  "description": "Loading optimizations: lazy scene init, progressive 3D layers, SVG compression, Nginx caching, font-display swap, reduced geometry counts, loader progress bar",
  "changes": [
    "Added static gradient background visible before JS loads",
    "Preloaded critical assets (loader CSS, scene-init.js, moon SVG, stars SVG)",
    "Enabled font-display: swap for all custom fonts",
    "Lazy-loaded Three.js scene via IntersectionObserver (200px rootMargin)",
    "Implemented progressive 3D scene loading (stars → moon → flowers → post-processing)",
    "Added loader progress bar with milestone tracking",
    "Reduced loader fade-out from 800ms to 400ms",
    "Reduced initial geometry counts by 60-70% (progressive enhancement)",
    "Compressed all SVG images with SVGO",
    "Configured Nginx caching headers (1yr immutable for assets, 1hr revalidate for HTML)",
    "Enabled gzip compression on Nginx for text assets",
    "Deferred non-critical JS (scroll reveal, flowers, flute handler, viewport fix)",
    "Skipped post-processing shaders on mobile/low-end devices"
  ]
}
```
