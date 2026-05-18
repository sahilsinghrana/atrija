# Refactoring Plan: Astro SSG Optimization & Code Quality

## Audit Date: 2026-05-20
## Current Commit: c796343 (checkpoint: before refactoring audit)

---

## Issues Found (Verified)

### 🔴 Critical (Performance/Correctness)

| # | Issue | File | Details |
|---|-------|------|---------|
| C1 | **Post-processing shaders STILL ACTIVE** | `scene-init.js` | EffectComposer + Van Gogh pass + Glitch pass all running every frame. Imports at lines 3-5, composer at line 110, vgPass at line 116, glitchPass at line 119, `composer.render()` at line 189. This is the #1 performance drain — runs 2 full shader passes on every frame. |
| C2 | **`client:idle` on scene-init.js** | `index.astro:434` | Causes race condition — script defers until browser idle, but scene init previously needed to run immediately. Loader may never complete. |
| C3 | **BaseLayout.astro is 1,155 lines / 42KB** | `BaseLayout.astro` | All CSS (design tokens, reset, layout, hero, sections, cards, animations, responsive) in one file. Inlined into every HTML page. Blocks first paint. |

### 🟡 Medium (Code Quality/Dead Code)

| # | Issue | File | Details |
|---|-------|------|---------|
| M1 | **Dead Three.js component files (8 files)** | `src/components/Three/*` | SceneManager.js, Moon.js, Stars.js, Sunflowers.js, Waves.js, Tulips.js, Flute.js, MusicNotes.js — none imported anywhere. ~15KB dead code. |
| M2 | **Dead shader module files (3 files)** | `src/shaders/*.mjs` | vanGogh.mjs, stars.mjs, waves.mjs — not imported by scene-init.js (which has inline shaders). ~4.4KB dead code. |
| M3 | **Dead lib file** | `src/lib/sunflower-layers.js` | Not imported anywhere. ~1.3KB dead code. |
| M4 | **Dead tulip test files (7 files)** | `tests/3d/tulip-*.test.js` | Reference tulip functions that no longer exist. Will fail if run. |
| M5 | **Dead audio toggle code in index.astro** | `index.astro:549-596` | References `AmbientAudio` which doesn't exist. 48 lines of dead JS. |
| M6 | **Inline changelog JS (150+ lines)** | `index.astro:264-415` | Large inline `<script is:inline>` block. Should be external file for caching. |
| M7 | **Inline moon animation in index.astro** | `index.astro:493-547` | Moon ASCII art + phase animation inline. Should be external file. |

### 🟢 Low (Optimizations)

| # | Issue | File | Details |
|---|-------|------|---------|
| L1 | **No `content-visibility: auto`** | `BaseLayout.astro` CSS | Below-fold sections skip rendering. Easy win. |
| L2 | **No `loading="lazy"` on images** | `index.astro` | All section background images load eagerly. |
| L3 | **No `modulepreload` for Three.js CDN** | `BaseLayout.astro` | Three.js is the critical render-blocking resource. |
| L4 | **5 near-identical section blocks** | `index.astro:87-246` | Moon, philosophy, gita, shiva, art sections share identical structure. Could be data-driven loop. |
| L5 | **siteData.json changelog references tulip-garden** | `siteData.json` | Cosmetic — changelog entries mention old name. |

---

## Refactoring Phases

### Phase 1: Critical Fixes (Performance + Correctness)
**Goal: Fix the biggest performance drains and bugs first.**

1. **Remove post-processing pipeline from scene-init.js**
   - Remove EffectComposer, RenderPass, ShaderPass imports (lines 3-5)
   - Remove composer setup (lines 110-120)
   - Remove vgPass/glitchPass references in updateUniforms, onResize, animate
   - Change `this.composer.render()` → `this.renderer.render(this.scene, this.camera)`
   - Remove GLSL shader strings (vgVS, vgFS, glitchVS, glitchFS) — ~60 lines
   - **Impact: ~40% faster frame rate, eliminates 2 full-screen shader passes per frame**

2. **Fix `client:idle` → eager load on scene-init.js**
   - Change `client:idle` to no directive on line 434 of index.astro
   - **Impact: Fixes loader race condition, scene initializes immediately**

3. **Remove dead audio toggle code from index.astro**
   - Delete lines 549-596 (the `<script is:inline>` block referencing AmbientAudio)
   - **Impact: Removes 48 lines of dead JS, eliminates console errors**

### Phase 2: Dead Code Elimination
**Goal: Remove all unused files. Zero risk.**

4. **Delete `src/components/Three/` directory** (8 files, ~15KB)
5. **Delete `src/shaders/` directory** (3 files, ~4.4KB)
6. **Delete `src/lib/sunflower-layers.js`** (1 file, ~1.3KB)
7. **Delete `tests/3d/tulip-*.test.js`** (7 files)
8. **Delete unused test files** in `tests/loading/` and `tests/unit/` that reference removed code

### Phase 3: CSS/JS Extraction (Caching + Performance)
**Goal: Move inline code to cacheable external files.**

9. **Extract BaseLayout CSS to `public/css/main.css`**
   - Move all `<style>` blocks from BaseLayout.astro to external CSS file
   - Keep only critical above-fold styles inline (loader, canvas-container bg, hero)
   - Link main.css with `<link rel="stylesheet" href="/css/main.css">`
   - **Impact: HTML drops from ~45KB to ~8KB, CSS cached across builds**

10. **Extract changelog JS to `public/js/changelog-app.js`**
    - Move inline `<script is:inline>` block (lines 264-415) to external file
    - Replace with `<script type="module" src="/js/changelog-app.js">`
    - **Impact: ~150 lines removed from HTML, JS cached**

11. **Extract moon animation to `public/js/moon-phase.js`**
    - Move inline `<script is:inline>` block (lines 493-547) to external file
    - Replace with `<script type="module" src="/js/moon-phase.js">`
    - **Impact: ~55 lines removed from HTML**

### Phase 4: Browser-Level Optimizations
**Goal: Add Astro/HTML-level performance hints.**

12. **Add `content-visibility: auto` to `.section` CSS**
    ```css
    .section {
      content-visibility: auto;
      contain-intrinsic-size: 0 500px;
    }
    ```
    - **Impact: Off-screen sections skip rendering, faster scroll**

13. **Add `loading="lazy"` to section background images**
    - Add to all `<div class="card-bg">` elements
    - **Impact: Below-fold images load on demand**

14. **Add `modulepreload` for Three.js CDN**
    ```html
    <link rel="modulepreload" href="https://esm.sh/three@0.160.0" />
    ```
    - **Impact: Three.js starts loading earlier, faster scene init**

15. **Add `fetchpriority="high"` to critical preload links**
    - Already partially done on loader.css, add to scene-init.js preload

### Phase 5: Architecture (Structural)
**Goal: Reduce duplication, improve maintainability.**

16. **Convert 5 identical section blocks to data-driven loop in index.astro**
    - Define section config array in frontmatter
    - Loop over it to generate sections
    - **Impact: ~150 lines of template → ~30 lines**

17. **Rename tulip-garden → lily-garden in siteData.json changelog entries**
    - Cosmetic fix for consistency

---

## Expected Impact Summary

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| BaseLayout.astro | 1,155 lines / 42KB | ~150 lines / 6KB | -87% |
| index.astro | 598 lines / 42KB | ~200 lines / 12KB | -67% |
| HTML output (inline CSS) | ~45KB CSS in HTML | ~2KB CSS in HTML | -95% |
| Shader passes per frame | 2 (Van Gogh + Glitch) | 0 | -100% |
| Dead code files | 19 files (~21KB) | 0 | -100% |
| `content-visibility` | None | All 5 sections | ✅ |
| Lazy images | 0 | All section images | ✅ |
| Module preloads | 0 | Three.js CDN | ✅ |
| Frame rate (est.) | ~30fps mobile | ~50fps mobile | +67% |
| FCP improvement | baseline | ~40% faster | ✅ |

---

## Execution Order
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5
Commit after each phase. Build + deploy after Phase 1, 3, 4, 5.
