# PRD: Impressionist Brush Stroke Cursor Trail

> **ID:** idea-019
> **Category:** Interactivity
> **Priority:** high
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-05-16

---

## 1. Overview

**One-liner:** Van Gogh-style brush stroke particles that follow the mouse cursor, letting visitors "paint" impressionist strokes onto the scene.

**Problem:** The site has strong visual 3D elements but lacks a direct, playful interaction that connects the visitor to Van Gogh's painting technique. Existing interactions (flute click, constellation drawing) are either momentary or require deliberate clicks — there's no continuous, ambient interactivity.

**Solution:** A canvas overlay that spawns short-lived, textured brush stroke particles along the cursor path. Each stroke is a small, rotated quad with a procedural noise texture, colored from the current section's Van Gogh palette. Strokes fade out over 2-3 seconds. On mobile, this is replaced with a touch-trail variant.

---

## 2. User Stories

- As a visitor, I want to see painterly brush strokes follow my cursor so that I feel like I'm painting the scene myself.
- As a visitor, I want the brush strokes to use colors from the current section's palette so that the experience feels cohesive with the rest of the site.
- As a mobile visitor, I want a simplified touch-trail effect so that I get a similar experience without a mouse.
- As a visitor, I want the effect to be subtle and non-distracting so that it enhances rather than overwhelms the content.

---

## 3. Technical Specification

### 3.1 Architecture

- **New file:** `public/js/brush-stroke-trail.js` — Self-contained module, imported by `scene-init.js`
- **Modified file:** `public/js/scene-init.js` — Add `import './brush-stroke-trail.js'` at the top
- **New file:** `public/assets/brush-stroke.png` — Small (64×64) alpha-only noise texture for brush stroke shape (generated procedurally via canvas, not a static file)
- **No changes to Astro components** — This is purely a client-side Three.js overlay

The system uses a **second Three.js canvas** (or a separate scene composited via CSS) positioned absolutely over the main scene canvas. It uses `pointermove` events to track cursor position and spawns stroke particles into a pool.

### 3.2 Implementation Details

#### Step 1: Create the brush stroke texture generator
- File: `public/js/brush-stroke-trail.js`
- What to do:
  - Create a `generateBrushTexture()` function that draws to an offscreen canvas (128×128)
  - Use `fillRect` with random alpha + `filter: blur(1px)` to create a soft, irregular oval
  - Convert to a `THREE.CanvasTexture` with `THREE.LinearMipmapLinearFilter`
  - The texture should be grayscale alpha only (white with varying alpha)
- Expected outcome: A reusable texture that looks like a single dab of paint

#### Step 2: Create the stroke particle pool
- File: `public/js/brush-stroke-trail.js`
- What to do:
  - Define `const MAX_STROKES = 60` (desktop) / `30` (mobile)
  - Create a pool of `THREE.Mesh` objects with `THREE.PlaneGeometry(1, 1)` and a `THREE.MeshBasicMaterial` using the brush texture
  - Each stroke mesh gets: `position`, `rotation`, `scale`, `opacity`, `color`, `age`, `maxAge`, `velocity`
  - Use `InstancedMesh` for performance if pool exceeds 40 strokes, otherwise plain meshes are fine
  - Strokes are added to a dedicated `THREE.Scene` or `THREE.Group` called `brushGroup`
- Expected outcome: A pool of reusable stroke objects ready to be spawned

#### Step 3: Implement cursor tracking and stroke spawning
- File: `public/js/brush-stroke-trail.js`
- What to do:
  - Listen to `window.addEventListener('pointermove', onPointerMove)`
  - In `onPointerMove`, convert `clientX/clientY` to normalized device coordinates (-1 to +1)
  - Only spawn a new stroke if the cursor has moved at least 15px from the last spawn point (distance threshold)
  - Spawn rate: max 8 strokes per second (throttle with timestamp)
  - On spawn:
    - Pick a random unused stroke from the pool (or oldest if all in use)
    - Set position to cursor NDC
    - Set random rotation: `Math.random() * Math.PI * 2`
    - Set random scale: `0.3 + Math.random() * 0.7` (relative to viewport height, ~2-8vh)
    - Pick color from a palette array matching current section (see Step 5)
    - Set `age = 0`, `maxAge = 2000 + Math.random() * 1000` (2-3 seconds)
    - Set material opacity to `0.6 + Math.random() * 0.4`
- Expected outcome: Strokes appear along the cursor path with natural spacing

#### Step 4: Implement stroke animation and fade
- File: `public/js/brush-stroke-trail.js`
- What to do:
  - In the animation loop (hook into the existing `requestAnimationFrame` in `scene-init.js` or create a separate one):
    - For each active stroke:
      - Increment `age` by `deltaTime`
      - Calculate `lifeRatio = age / maxAge`
      - Fade opacity: `material.opacity = initialOpacity * (1 - lifeRatio * lifeRatio)` (quadratic fade)
      - Slight upward drift: `mesh.position.y += deltaTime * 0.0003` (strokes float up gently)
      - Slight scale growth: `mesh.scale.setScalar(initialScale * (1 + lifeRatio * 0.3))`
    - When `age >= maxAge`, deactivate the stroke (move back to pool, set visible=false)
- Expected outcome: Strokes fade out smoothly while drifting upward and growing slightly

#### Step 5: Connect to section color palettes
- File: `public/js/brush-stroke-trail.js`
- What to do:
  - Define palette arrays matching the 5 themes from `siteData.json`:
    ```js
    const PALETTES = {
      'starry-night': ['#f4d03f', '#2e86c1', '#1a5276', '#fcf3cf', '#85929e'],
      'sunflower':    ['#f1c40f', '#e67e22', '#27ae60', '#f39c12', '#d4ac0d'],
      'midnight-wave':['#1a5276', '#2e86c1', '#154360', '#5dade2', '#2874a6'],
      'tulip-garden':  ['#e74c3c', '#9b59b6', '#f39c12', '#e91e63', '#ff5722'],
      'moonlit-silver':['#d5d8dc', '#aab7b8', '#f4f6f7', '#85929e', '#515a5a']
    };
    ```
  - Detect current section by reading the `data-theme` attribute on `<body>` or the active section in view (use `IntersectionObserver` on section elements)
  - Pick a random color from the active palette for each new stroke
  - Convert hex to `THREE.Color` and apply to `material.color`
- Expected outcome: Brush strokes match the current section's color scheme

#### Step 6: Mobile touch adaptation
- File: `public/js/brush-stroke-trail.js`
- What to do:
  - Detect mobile: `window.innerWidth < 768` or `matchMedia('(pointer: coarse)').matches`
  - On mobile:
    - Reduce `MAX_STROKES` to 30
    - Listen to `touchmove` instead of `pointermove`
    - Increase distance threshold to 25px (fingers are less precise)
    - Reduce stroke scale range to `0.2 + Math.random() * 0.5`
    - Reduce max spawn rate to 5 strokes/second
- Expected outcome: Touch-friendly trail effect on mobile devices

### 3.3 Mobile Considerations

- Viewport < 768px: reduced stroke count (30 vs 60), larger distance threshold, smaller scale range
- Performance budget: max 60 draw calls (desktop) / 30 (mobile). Each stroke is a single plane (2 triangles). Total: 120 triangles desktop, 60 mobile — negligible.
- The brush scene uses `alphaTest: 0.1` to discard fully transparent pixels and reduce overdraw
- On devices with `prefers-reduced-motion`, disable the effect entirely
- The brush canvas uses `pointer-events: none` so it doesn't interfere with scrolling or clicking

### 3.4 Data Structures

```json
{
  "stroke": {
    "mesh": "THREE.Mesh",
    "position": { "x": 0, "y": 0 },
    "rotation": 0,
    "scale": 0.5,
    "initialOpacity": 0.8,
    "color": "#f4d03f",
    "age": 0,
    "maxAge": 2500,
    "active": false
  },
  "config": {
    "maxStrokes": 60,
    "spawnDistanceThreshold": 15,
    "maxSpawnRate": 8,
    "mobileMaxStrokes": 30,
    "mobileSpawnDistanceThreshold": 25,
    "mobileMaxSpawnRate": 5
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Brush texture generates without error | `tests/brush-stroke/texture.test.js` | `generateBrushTexture()` returns a valid `THREE.CanvasTexture` |
| Stroke pool initializes with correct count | `tests/brush-stroke/pool.test.js` | Pool contains exactly `MAX_STROKES` meshes, all inactive |
| Stroke spawns on cursor move | `tests/brush-stroke/spawn.test.js` | After simulating pointermove, at least one stroke is active |
| Stroke respects distance threshold | `tests/brush-stroke/spawn.test.js` | Two pointermove events 5px apart produce only 1 stroke |
| Stroke fades over time | `tests/brush-stroke/animation.test.js` | After advancing age past maxAge, stroke is inactive |
| Mobile config is applied | `tests/brush-stroke/mobile.test.js` | When viewport < 768, maxStrokes equals 30 |
| Palette colors are valid hex | `tests/brush-stroke/palette.test.js` | All palette entries are valid 6-digit hex colors |
| prefers-reduced-motion disables effect | `tests/brush-stroke/a11y.test.js` | When reduced motion is set, no strokes spawn |

### 4.2 Green Phase — Implementation

- Implement `brush-stroke-trail.js` with all functions described in Section 3.2
- Import it in `scene-init.js` with `import './brush-stroke-trail.js'`
- Verify the module initializes without errors in the browser console
- Verify strokes appear when moving the cursor over the canvas

### 4.3 Refactor Phase — Optimization

- Replace individual `THREE.Mesh` objects with `THREE.InstancedMesh` if draw call count is a concern
- Cache the brush texture instead of regenerating on each module load
- Use object pooling with a free-list pattern instead of scanning for inactive strokes
- Batch color updates via `InstancedMesh.setColorAt()` instead of per-mesh material updates
- Profile with Chrome DevTools: ensure no frame drops below 55fps on mid-range mobile (Moto G Power equivalent)

---

## 5. Acceptance Criteria

- [ ] Brush stroke particles appear when moving the cursor over the 3D canvas
- [ ] Strokes use colors from the current section's Van Gogh palette
- [ ] Strokes fade out over 2-3 seconds with quadratic easing
- [ ] Strokes drift upward and scale slightly as they age
- [ ] Maximum 60 concurrent strokes on desktop, 30 on mobile
- [ ] Distance threshold prevents stroke clustering (min 15px apart)
- [ ] Effect is disabled when `prefers-reduced-motion` is set
- [ ] Touch events produce a trail on mobile devices
- [ ] No frame rate drops below 55fps on desktop, 30fps on mobile
- [ ] Brush canvas does not interfere with scroll or click interactions
- [ ] All unit tests pass

---

## 6. Dependencies & Risks

**Dependencies:**
- Three.js must be loaded (already available via `scene-init.js`)
- The main scene canvas must be accessible for coordinate mapping
- `siteData.json` color palettes are used as reference but are hardcoded in the JS module (no runtime import needed)

**Risks:**
- **Performance on low-end devices:** Mitigated by reduced stroke count on mobile and `prefers-reduced-motion` check
- **Z-index conflicts with existing UI:** The brush canvas must be positioned between the Three.js scene and the HTML content. Use `z-index` layering: scene (0), brush trail (5), content (10)
- **Texture looks artificial:** The procedural noise texture may not look painterly enough. Mitigation: iterate on the `generateBrushTexture()` function — add multiple overlapping ellipses with varying alpha
- **Color palette sync:** If the user scrolls quickly, the palette may not update immediately. Mitigation: use `IntersectionObserver` with a 200ms debounce

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Impressionist brush stroke cursor trail — painterly particles follow the mouse using Van Gogh palette colors",
  "changes": [
    "Added brush-stroke-trail.js module with procedural brush texture generation",
    "Stroke particle pool with 60 desktop / 30 mobile max concurrent strokes",
    "Section-aware color palette matching (5 Van Gogh themes)",
    "Mobile touch-trail adaptation with reduced particle count",
    "Respects prefers-reduced-motion accessibility setting",
    "Quadratic fade-out with upward drift animation"
  ]
}
```

---

## Reviewer Notes (2026-05-19)

**ORPHANED — ID CONFLICT.** This PRD file references `idea-019` but the kanban's idea-019 is "Realistic Randomized Tulips" (done). This PRD describes "Impressionist Brush Stroke Cursor Trail" which is a different feature. The brushstroke cursor trail concept exists on the kanban as idea-022. This file is a duplicate/orphan from an earlier generation and should be deleted or renamed to avoid confusion.
