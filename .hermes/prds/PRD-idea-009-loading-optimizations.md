# PRD: Loading Optimizations

> **ID:** idea-009
> **Category:** Performance
> **Priority:** high
> **Status:** backlog
> **PRD Version:** 2.0 (Astro-compatible rewrite)
> **Last Updated:** 2026-05-15

---

## 1. Overview

**One-liner:** Drastically reduce time-to-first-meaningful-paint and time-to-interactive by optimizing every layer of the loading pipeline — leveraging Astro's built-in optimizations plus targeted manual improvements.

**Problem:** The current loading experience blocks on a full Three.js scene initialization (CDN fetches from esm.sh, 850-line scene-init.js parsing + execution, WebGL context creation, post-processing shader compilation, 2000+ star geometry generation) before the loader fades out. On slower connections or low-end mobile devices, users see a spinning gold ring for 3-8+ seconds with no progress feedback. All Three.js code loads from esm.sh CDN with no local bundling, meaning 6 separate network round-trips before any 3D code can execute. Fonts load from Google Fonts but without optimal preloading. No caching headers on Nginx. The 1142-line BaseLayout.astro inline `<script>` block contains non-critical JS (scroll reveal, flower animations, flute handler, viewport fix) that runs during page load.

**Solution:** Implement a multi-phase loading optimization strategy that works *with* Astro's architecture:
1. **Astro-level**: Inline critical CSS, use `client:idle` for Three.js hydration, leverage Astro's built-in asset hashing
2. **HTML-level**: Add `<link rel="modulepreload">` for scene-init.js, preload critical SVGs, add static gradient background
3. **JS-level**: Lazy-init Three.js via IntersectionObserver, progressive 3D layer loading, reduced initial geometry
4. **Loader-level**: Add progress bar, faster fade-out
5. **Nginx-level**: Caching headers, gzip compression
6. **Asset-level**: SVG optimization

---

## 2. User Stories

- As a visitor on a slow 3G connection, I want to see the page background and text content immediately so I don't stare at a blank screen.
- As a visitor, I want the loader to show real progress so I know the site is actually loading.
- As a visitor on a low-end mobile device, I want the 3D scene to load only when I scroll near it.
- As a visitor, I want the site to load instantly on repeat visits.
- As a visitor, I want text visible immediately (even with fallback fonts) so I can start reading.
- As a visitor, I want the loader to disappear as soon as the first visual frame renders.

---

## 3. Technical Specification

### 3.1 Architecture

**Files created/modified:**

| File | Action | Purpose |
|------|--------|---------|
| `src/layouts/BaseLayout.astro` | Modify | Inline critical CSS, add preload hints, add progress bar HTML, wrap non-critical JS in `requestIdleCallback`, faster loader fade-out |
| `src/pages/index.astro` | Modify | Replace `is:inline` script with `client:idle` directive for scene-init.js |
| `public/css/loader.css` | Modify | Add progress bar styles, faster fade-out transition |
| `public/js/scene-init.js` | Modify | Progressive layer loading, reduced initial geometry, loader progress callbacks |
| `public/js/loader-progress.js` | Create | Lightweight loader progress tracking (loaded before scene-init) |
| `public/js/scene-lazy-init.js` | Create | IntersectionObserver bootstrap for lazy scene loading |
| `public/images/*.svg` | Optimize | Compress all SVGs |
| `$PREFIX/etc/nginx/nginx.conf` | Modify | Add caching headers, gzip compression |

### 3.2 Implementation Details

#### Step 1: Inline Critical CSS (Astro Optimization)

**File:** `src/layouts/BaseLayout.astro`

Astro already inlines the design tokens and base styles via `<style is:inline>`. This is correct — it eliminates a render-blocking CSS request. However, we can optimize further:

- **Add a static gradient background** inline in `<head>` (before loader CSS loads) so users see a beautiful dark gradient immediately:
  ```html
  <style>
    body, #canvas-container {
      background: linear-gradient(180deg, #0a0a1a 0%, #0d1b2a 30%, #1b2838 60%, #0a0a1a 100%);
    }
  </style>
  ```
  This `<style>` block should be the FIRST element in `<head>`, even before the `<meta>` tags' charset. It's ~200 bytes and ensures immediate visual feedback.

- **Verify `inlineStylesheets` in `astro.config.mjs`**: If not already set, add:
  ```js
  vite: {
    build: {
      cssCodeSplit: false
    }
  }
  ```
  This ensures all CSS is inlined in the HTML, eliminating separate CSS file requests.

**Expected outcome:** Users see a beautiful dark gradient immediately. All CSS is in the HTML — zero render-blocking CSS requests.

#### Step 2: Preload Critical Assets (Astro-Compatible)

**File:** `src/layouts/BaseLayout.astro`

Add `<link>` tags in `<head>` after the font preconnect tags:

```html
<!-- Preload critical assets -->
<link rel="preload" href="/css/loader.css" as="style" />
<link rel="modulepreload" href="/js/scene-init.js" />
<link rel="preload" href="/images/moon.svg" as="image" type="image/svg+xml" />
<link rel="preload" href="/images/stars.svg" as="image" type="image/svg+xml" />
```

**Key difference from v1 PRD:** Use `rel="modulepreload"` for scene-init.js (it's a `type="module"` script). Regular `as="script"` preload doesn't work correctly for ES modules.

**Font preloading:** The Google Fonts URL already has `&display=swap`. Add `font-display: swap` as a fallback in the inline CSS:
```css
@font-face { font-display: swap; }
```

**Expected outcome:** Loader CSS available immediately, module preloaded, fonts render with fallback then swap.

#### Step 3: Astro `client:idle` for Three.js Hydration (Astro Optimization)

**File:** `src/pages/index.astro`

**Current code (line 434):**
```astro
<script type="module" src="/js/scene-init.js" is:inline></script>
```

**Replace with:**
```astro
<script type="module" src="/js/scene-init.js" client:idle></script>
```

**What this does:** Astro's `client:idle` directive delays loading the script until the browser is idle (using `requestIdleCallback` internally). This is the Astro-native way to defer non-critical JS. It's cleaner than a custom IntersectionObserver for the initial load.

**However**, `client:idle` alone doesn't lazy-load based on scroll position. For that, we combine with the IntersectionObserver approach:

**Alternative (more aggressive lazy loading):**
```astro
<!-- Remove the script tag entirely from index.astro -->
<!-- scene-lazy-init.js will dynamically load it when canvas is near viewport -->
```

And add to BaseLayout.astro's inline scripts:
```html
<script src="/js/scene-lazy-init.js" defer></script>
```

**Recommendation:** Use `client:idle` first (simpler, Astro-native). If performance testing shows the scene still blocks interactivity, switch to the IntersectionObserver approach.

**Expected outcome:** Three.js scene loads after the page is idle, not during critical rendering.

#### Step 4: Lazy Load Three.js Scene with IntersectionObserver

**File:** `public/js/scene-lazy-init.js` (new file)

If `client:idle` isn't sufficient, create a bootstrap script:

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

**Expected outcome:** Heavy Three.js scene only loads when user scrolls near canvas.

#### Step 5: Progressive 3D Scene Loading

**File:** `public/js/scene-init.js`

Refactor the `DOMContentLoaded` init to load in phases:

```javascript
document.addEventListener('DOMContentLoaded', function() {
  var c = document.getElementById('canvas-container');
  if (!c) return;
  var scene = new VanGoghScene(c);

  // Phase 1 (immediate): Stars (reduced), basic lights
  var initialStarCount = isLowEnd ? 400 : 800;
  createStars(scene.scene, initialStarCount);
  createMoon(scene.scene);
  createWaves(scene.scene);

  // Fade out loader after first frame
  requestAnimationFrame(function() {
    var l = document.getElementById('loader');
    if (l) l.classList.add('hidden');
  });

  // Phase 2 (after 300ms): Flowers, flute, music notes
  setTimeout(function() {
    createSunflowers(scene.scene, sunflowerCount);
    createTulips(scene.scene, tulipCount);
    createFlute(scene.scene);
    createMusicNotes(scene.scene, noteCount);
  }, 300);

  // Phase 3 (after 800ms): Post-processing, remaining stars
  if (!isLowEnd) {
    setTimeout(function() {
      // Add remaining stars
      createStars(scene.scene, starCount - initialStarCount, /* append */ true);
      // Enable post-processing
      initPostProcessing(scene);
    }, 800);
  }
});
```

**Initial geometry reductions:**
- Stars: 2000→800 (desktop), 1800→400 (mobile) — add rest in Phase 3
- Music notes: 30→15 (desktop), 40→10 (mobile)
- Sunflowers: 16→8 (desktop), 5→3 (mobile)
- Tulips: 8→4 (desktop), 3→2 (mobile)
- Wave segments: 64×64→32×16 (desktop), 32×32→16×16 (mobile)

**Expected outcome:** First frame renders 2-4x faster. Full quality restored progressively.

#### Step 6: Loader Progress Indicator

**File:** `public/css/loader.css`

Add progress bar styles:
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

**File:** `src/layouts/BaseLayout.astro` — Update loader HTML:
```html
<div id="loader">
  <div class="loader-ring"></div>
  <div class="loader-text">Painting the sky<span class="loader-dots"></span></div>
  <div class="loader-progress"><div class="loader-progress-bar" id="loader-progress-bar"></div></div>
</div>
```

**File:** `public/js/loader-progress.js` (new file):
```javascript
(function() {
  var bar = document.getElementById('loader-progress-bar');
  if (!bar) return;
  window.__updateLoaderProgress = function(pct) {
    if (bar) bar.style.width = pct + '%';
  };
  // Simulate progress while waiting
  var fakeProgress = 0;
  var fakeInterval = setInterval(function() {
    fakeProgress += Math.random() * 15;
    if (fakeProgress > 85) { fakeProgress = 85; clearInterval(fakeInterval); }
    if (bar) bar.style.width = fakeProgress + '%';
  }, 300);
  window.__sceneLoadingStarted = function() {
    clearInterval(fakeInterval);
  };
})();
```

Load in BaseLayout.astro `<head>`:
```html
<script src="/js/loader-progress.js"></script>
```

In `scene-init.js`, call `window.__updateLoaderProgress(30)` after CDN fetch, `60` after WebGL init, `90` after first frame, `100` before fade-out.

**Expected outcome:** Users see meaningful progress bar instead of passive spinner.

#### Step 7: Faster Loader Fade-Out

**File:** `public/css/loader.css`

```css
#loader {
  transition: opacity 0.4s ease, visibility 0.4s ease;
}
```

**File:** `public/js/scene-init.js` — Replace double-rAF with single rAF:
```javascript
requestAnimationFrame(function() {
  var l = document.getElementById('loader');
  if (l) l.classList.add('hidden');
});
```

**Expected outcome:** Loader disappears ~100-200ms sooner.

#### Step 8: Defer Non-Critical Inline JS (Astro Pattern)

**File:** `src/layouts/BaseLayout.astro`

The current inline `<script>` block (lines 1046-1139) contains:
1. Flute click handler (lines 1046-1070)
2. Scroll reveal (lines 1072-1085)
3. Flower animations (lines 1086-1121)
4. Mobile viewport fix (lines 1123-1139)

**Wrap the non-critical ones in `requestIdleCallback`:**
```javascript
/* Scroll reveal — deferred */
requestIdleCallback(function() {
  var els = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');
  if (!els.length) return;
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function(el) { io.observe(el); });
});

/* Flower animations — deferred */
requestIdleCallback(function() {
  // ... flower animation code ...
});

/* Mobile viewport fix — deferred */
requestIdleCallback(function() {
  function setVH() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
  }
  setVH();
  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setVH, 100);
  }, {passive:true});
  window.addEventListener('orientationchange', function() {
    setTimeout(setVH, 200);
  });
});
```

**Keep the flute handler as-is** (it needs to be ready for user interaction).

**Why not split into external files?** In Astro, inline scripts in layouts are fine — they're small and don't block rendering when deferred with `requestIdleCallback`. Splitting into separate files would add HTTP requests, which is worse for performance.

**Expected outcome:** Main thread freed for critical rendering. Non-critical scripts execute after browser is idle.

#### Step 9: SVG Image Optimization

**File:** `public/images/*.svg`

```bash
cd /root/projects/van-gogh-site/public/images
for f in *.svg; do
  # Manual optimization (svgo may not be available):
  # 1. Remove XML declaration
  sed -i '1{/<?xml/d}' "$f"
  # 2. Remove comments
  sed -i '/<!--/,/-->/d' "$f"
  # 3. Remove empty lines
  sed -i '/^[[:space:]]*$/d' "$f"
done
```

**Do NOT convert to WebP** — SVGs are used as CSS background images and inlined in the HTML. Converting to WebP would lose the scalability and CSS styling benefits.

**Expected outcome:** SVG file sizes reduced by 30-50%.

#### Step 10: Nginx Caching Strategy

**File:** `$PREFIX/etc/nginx/nginx.conf`

Add inside the `server` block, before the `location /` block:

```nginx
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;
    gzip_min_length 256;

    # Caching headers for static assets
    location ~* \.(js|css)$ {
      expires 1y;
      add_header Cache-Control "public, immutable";
    }
    location ~* \.(svg|png|jpg|webp|woff2?)$ {
      expires 1y;
      add_header Cache-Control "public, immutable";
    }
    location ~* \.html$ {
      expires 1h;
      add_header Cache-Control "public, must-revalidate";
    }
```

**Important:** The `location /` block should come AFTER the specific location blocks. Nginx matches more specific locations first.

**Verify and reload:**
```bash
nginx -t && nginx -s reload
```

**Cache-busting:** Astro already hashes CSS filenames in production builds. For JS files without hashes (like scene-init.js), append a query string version on deploy: `/js/scene-init.js?v=1.3.0`.

**Expected outcome:** Static assets cached for 1 year. HTML revalidated hourly. Gzip reduces transfer sizes by 60-80%.

#### Step 11: Astro-Specific Optimizations

These are optimizations that leverage Astro's built-in features:

**A. `astro.config.mjs` — Ensure optimal build settings:**
```js
export default defineConfig({
  // ... existing config ...
  vite: {
    build: {
      cssCodeSplit: false,  // Single CSS file (inlined by Astro)
      rollupOptions: {
        output: {
          manualChunks: undefined  // Don't split JS (we control loading via phases)
        }
      }
    }
  }
});
```

**B. Use `Astro.prefetch()` for internal navigation** (future enhancement):
If the site adds more pages, add `prefetch` to the layout:
```astro
<head>
  <meta name="astro-prefetch" content="true" />
</head>
```

**C. `content-visibility: auto` for below-fold sections:**
Add to BaseLayout.astro CSS:
```css
.section {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}
```
This tells the browser to skip rendering sections that are off-screen, significantly reducing initial render cost.

**D. `fetchpriority` hints:**
In BaseLayout.astro, add to the loader CSS link:
```html
<link rel="preload" href="/css/loader.css" as="style" fetchpriority="high" />
```

**Expected outcome:** Astro build produces optimized output. Below-fold sections don't block initial render.

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Static background visible before JS loads | `tests/loading/01-static-bg.html` | `body` has gradient background within 50ms |
| Module preload tag present | `tests/loading/02-preloads.js` | `<link rel="modulepreload">` exists for scene-init.js |
| `client:idle` on scene script | `tests/loading/03-client-idle.js` | scene-init.js has `client:idle` or is loaded by lazy-init |
| Progressive loading phases | `tests/loading/04-progressive.js` | Stars render before flowers |
| Progress bar updates | `tests/loading/05-progress.js` | `#loader-progress-bar` width increases 0→100% |
| Loader fades in < 400ms | `tests/loading/06-fade-out.js` | Loader opacity reaches 0 within 400ms |
| SVGs optimized | `tests/loading/07-svg-optimize.js` | No XML declarations, no comments |
| Nginx caching headers | `tests/loading/08-nginx-cache.js` | `Cache-Control: public, immutable` on assets |
| Reduced initial geometry | `tests/loading/09-geometry.js` | Initial star count ≤ 800 (desktop) |
| Non-critical JS deferred | `tests/loading/10-defer.js` | Scroll reveal wrapped in requestIdleCallback |
| `content-visibility` on sections | `tests/loading/11-content-visibility.js` | `.section` has `content-visibility: auto` |

### 4.2 Green Phase — Implementation Order

1. Add inline gradient CSS to `<head>` (Step 1)
2. Add `<link>` preload/modulepreload tags (Step 2)
3. Add `client:idle` to scene-init script tag (Step 3)
4. Create `scene-lazy-init.js` (Step 4)
5. Refactor `scene-init.js` into phased init (Step 5)
6. Create `loader-progress.js` + update loader HTML/CSS (Step 6)
7. Reduce fade-out to 0.4s (Step 7)
8. Wrap non-critical JS in `requestIdleCallback` (Step 8)
9. Optimize SVGs (Step 9)
10. Update nginx.conf (Step 10)
11. Add Astro build optimizations + `content-visibility` (Step 11)

### 4.3 Refactor Phase

- Measure Lighthouse before/after each step
- A/B test progressive loading timing (300ms/800ms phases)
- Evaluate whether `client:idle` or IntersectionObserver lazy init performs better
- Consider vendoring Three.js locally if esm.sh CDN is too slow

---

## 5. Acceptance Criteria

- [ ] Static gradient background visible within 50ms of HTML parse
- [ ] Loader shows progress bar advancing through milestones
- [ ] Loader fades out within 400ms of first frame
- [ ] Three.js scene uses `client:idle` or lazy IntersectionObserver loading
- [ ] First frame with stars renders within 1.5s on 3G / 0.5s on 4G
- [ ] Progressive loading: stars → moon/waves → flowers → post-processing
- [ ] Initial geometry reduced by 60-70%
- [ ] Text visible with fallback fonts within 100ms
- [ ] All SVGs optimized (no XML declarations, no comments)
- [ ] Nginx serves assets with `Cache-Control: public, immutable` (1yr)
- [ ] Nginx serves HTML with `Cache-Control: public, must-revalidate` (1hr)
- [ ] Gzip compression enabled for text assets
- [ ] Non-critical JS deferred via `requestIdleCallback`
- [ ] `content-visibility: auto` on below-fold sections
- [ ] Post-processing shaders skipped on mobile/low-end
- [ ] Lighthouse Performance score ≥ 80 (mobile) / ≥ 90 (desktop)
- [ ] No frame rate drops below 30fps on mobile during progressive loading

---

## 6. Dependencies & Risks

**Dependencies:**
- Astro 4 build pipeline (already in use)
- Nginx with gzip module (`nginx -V` to verify)
- `client:idle` directive (Astro 4 native)
- `requestIdleCallback` (supported in all modern browsers; fallback to `setTimeout(fn, 1)` for Safari)
- IntersectionObserver (fallback to immediate load for older browsers)

**Risks:**
- **`client:idle` vs IntersectionObserver:** `client:idle` is simpler but less precise. Test both and pick the one that gives better Lighthouse scores.
- **CDN dependency:** All Three.js loads from esm.sh. If CDN is slow, 3D won't load. *Mitigation:* Add a 10s timeout that shows static background if scene-init.js fails.
- **Cache invalidation:** 1-year cache on JS means updates need cache-busting. *Mitigation:* Astro hashes CSS. For JS, use query string versioning on deploy.
- **`content-visibility: auto`:** Can cause layout shifts if `contain-intrinsic-size` is wrong. *Mitigation:* Set generous intrinsic sizes and test on multiple viewports.
- **Nginx config:** Modifying system nginx.conf could affect other sites. *Mitigation:* Test with `nginx -t` before reloading.

---

## 7. Changelog Entry

```json
{
  "type": "perf",
  "description": "Loading optimizations: Astro client:idle, progressive 3D layers, SVG compression, Nginx caching, content-visibility, reduced geometry, loader progress bar",
  "changes": [
    "Added static gradient background visible before any JS/CSS loads",
    "Inlined all CSS via Astro cssCodeSplit: false",
    "Added modulepreload for scene-init.js, preload for critical SVGs",
    "Enabled font-display: swap for all custom fonts",
    "Added client:idle directive for Three.js scene hydration",
    "Implemented progressive 3D scene loading (stars → moon → flowers → post-processing)",
    "Added loader progress bar with milestone tracking",
    "Reduced loader fade-out from 800ms to 400ms",
    "Reduced initial geometry counts by 60-70%",
    "Compressed all SVG images (removed XML declarations, comments)",
    "Configured Nginx caching headers (1yr immutable for assets, 1hr revalidate for HTML)",
    "Enabled gzip compression on Nginx",
    "Deferred non-critical JS via requestIdleCallback",
    "Added content-visibility: auto on below-fold sections",
    "Skipped post-processing shaders on mobile/low-end devices"
  ]
}
```
