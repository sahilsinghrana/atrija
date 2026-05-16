# PRD: Impressionist Brushstroke Cursor Trail

> **ID:** idea-022
> **Category:** Shaders
> **Priority:** medium
> **Status:** backlog
> **PRD Version:** 1.0
**Last Updated:** 2026-05-17

---

## 1. Overview

**One-liner:** A custom cursor that leaves painterly brushstroke trails as the visitor moves their mouse, creating an interactive Van Gogh-style painting effect on a canvas overlay.

**Problem:** The site has beautiful 3D elements but the cursor interaction is minimal (only the flute click spawns notes). There's an opportunity to make every mouse movement feel like painting.

** Solution:** Overlay a transparent `<canvas>` element on top of the Three.js scene that captures mouse/touch movement and renders short-lived brushstroke particles. Each particle is a textured streak that fades out over 1.5–2 seconds, using colors sampled from the current site theme's palette.

---

## 2. User Stories

- As a visitor, I want my cursor to leave painterly trails so that I feel like I'm painting the scene myself.
- As a visitor, I want the brushstrokes to use Van Gogh's color palette so they match the site's aesthetic.
- As a mobile user, I want touch movements to create the same effect so the experience is consistent.
- As a visitor, I want the trails to fade naturally so the canvas doesn't become cluttered.

---

## 3. Technical Specification

### 3.1 Architecture

This feature adds a new canvas overlay and a self-contained JavaScript module for brushstroke particle management. It reads the current theme's color palette from the DOM (injected by Astro) and uses it for stroke colors.

**Files created:**
- `public/js/brushstroke-cursor.js` — Brushstroke particle system

**Files modified:**
- `src/layouts/BaseLayout.astro` — Add `<canvas id="brushstroke-canvas">` overlay and script tag
- `public/js/scene-init.js` — Export current theme color palette for brushstroke module to consume

**Dependencies:**
- Canvas 2D API (no additional libraries)
- Theme color palette from `siteData.json` (passed via `data-` attribute or global variable)
- Mouse/touch events on `window`

### 3.2 Implementation Details

#### Step 1: Create Canvas Overlay
- File: `src/layouts/BaseLayout.astro`
- What to do:
  - Add `<canvas id="brushstroke-canvas">` as a fixed-position overlay (z-index above Three.js canvas but below UI elements like nav)
  - CSS: `position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 10;`
  - Add `<script src="/js/brushstroke-canvas.js" defer></script>` before closing `</body>`
  - Pass current theme colors via `<canvas data-colors="#ffd700,#87ceeb,#ff6b6c,#9b59b6,#2ecc71">` (derived from active color scheme)
- Expected outcome: A transparent canvas overlay covering the entire viewport

#### Step 2: Implement Brushstroke Particle System
- File: `public/js/brushstroke-cursor.js`
- What to do:
  - Initialize canvas: `const canvas = document.getElementById('brushstroke-canvas'); const ctx = canvas.getContext('2d');`
  - Set canvas size to `window.innerWidth × innerHeight` (update on resize)
  - Create `particles[]` array to track active brushstrokes
  - On `mousemove`/`touchmove`: Create new particle at cursor position with:
    - `x`, `y` (current position)
    - `prevX`, `prevY` (previous position — for stroke direction)
    - `color` (random from theme palette)
    - `size` (random 8–25px based on movement speed)
    - `life` (1.0, decrements each frame)
    - `angle` (perpendicular to movement direction for brushstroke shape)
  - In `requestAnimationFrame` loop:
    - For each particle: Draw an elongated ellipse/stroke from `prevX,prevY` to `x,y` with `ctx.globalAlpha = life`, using `ctx.lineCap = 'round'`
    - Decrement `life` by 0.015 per frame (~67 frames = ~1.1s at 60fps)
    - Remove particles where `life <= 0`
    - `ctx.clearRect()` each frame (particles redraw every frame with fading alpha)
  - Limit max particles to 50 (remove oldest when exceeded)
- Expected outcome: Painterly trails follow cursor movement, fading over ~1 second

#### Step 3: Theme Color Integration
- File: `public/js/brushstroke-cursor.js`
- What to do:
  - Read colors from canvas `data-colors` attribute: `canvas.dataset.colors.split(',')`
  - On each particle creation, pick a random color from the palette
  - Add slight random variation (±15% RGB) to each stroke for natural variation
  - If no data-colors attribute, default to Van Gogh palette: `['#FFD700', '#4169E1', '#228B22', '#FF6347', '#9370DB', '#87CEEB']`
- Expected outcome: Brushstroke colors match the current site theme

#### Step 4: Performance Optimization
- File: `public/js/brushstroke-cursor.js`
- What to do:
  - Throttle particle creation: Max 1 particle per 16ms (1 frame) to prevent flooding on fast mouse movement
  - Use `ctx.beginPath()` / `ctx.stroke()` per particle (not fill — faster)
  - On mobile: Reduce max particles to 30, reduce max size to 18px
  - Disable entirely on `prefers-reduced-motion: reduce` media query
  - Pause animation loop when tab is hidden (`document.visibilityState`)
- Expected outcome: 60fps on desktop and mobile, respects accessibility preferences

### 3.3 Mobile Considerations

- Touch events (`touchmove`) create particles at touch position
- Reduced particle count (30 vs 50) and max size (18px vs 25px) on mobile
- Canvas uses `devicePixelRatio` for crisp rendering: `canvas.width = window.innerWidth * dpr`
- `pointer-events: none` ensures canvas doesn't block touch interactions with underlying content
- Performance budget: Canvas 2D is very lightweight — even 50 particles at 60fps is < 1ms per frame

### 3.4 Data Structures

```json
{
  "particle": {
    "x": 450.5,
    "y": 320.0,
    "prevX": 448.0,
    "prevY": 318.5,
    "color": "#FFD700",
    "size": 15,
    "life": 1.0,
    "angle": 0.785
  },
  "config": {
    "maxParticles": 50,
    "lifeDecay": 0.015,
    "minSize": 8,
    "maxSize": 25,
    "throttleMs": 16,
    "mobileMaxParticles": 30,
    "mobileMaxSize": 18
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Canvas element exists in DOM | `tests/brushstroke.test.js` | `document.getElementById('brushstroke-canvas') !== null` |
| Canvas covers full viewport | `tests/brushstroke.test.js` | `canvas.width === window.innerWidth` and `canvas.height === window.innerHeight` |
| Mousemove creates particle | `tests/brushstroke.test.js` | After dispatching `mousemove` event, `particles.length > 0` |
| Particles fade over time | `tests/brushstroke.test.js` | After 100 frames, `particle.life < 0.5` |
| Max particles enforced | `tests/brushstroke.test.js` | After 100 mouse events, `particles.length <= 50` |
| Respects prefers-reduced-motion | `tests/brushstroke.test.js` | When `prefers-reduced-motion: reduce`, animation loop is not running |

### 4.2 Green Phase — Implementation

- Create canvas overlay in BaseLayout.astro
- Implement brushstroke-cursor.js particle system
- Add theme color integration
- Add mobile and accessibility optimizations

### 4.3 Refactor Phase — Optimization

- Use offscreen canvas for particle texture (pre-render brushstroke shape once, reuse)
- Batch draw calls: Group particles by color and stroke once per color instead of per-particle
- Add subtle texture to strokes using `ctx.createPattern()` with a noise texture
- Consider adding a "clear" button or auto-clear after 5 seconds of inactivity

---

## 5. Acceptance Criteria

- [ ] Canvas overlay covers the entire viewport without blocking interactions
- [ ] Mouse movement creates painterly brushstroke trails
- [ ] Trails fade out over ~1–2 seconds naturally
- [ ] Colors are sampled from the current theme's palette
- [ ] Max 50 particles on desktop, 30 on mobile
- [ ] Touch events create trails on mobile
- [ ] `prefers-reduced-motion: reduce` disables the effect entirely
- [ ] Animation pauses when tab is hidden
- [ ] No frame rate drops below 55fps on desktop
- [ ] All unit tests pass
- [ ] No console errors

---

## 6. Dependencies & Risks

**Dependencies:**
- BaseLayout.astro must include the canvas element and script tag
- Theme color palette must be available as a `data-` attribute on the canvas
- Canvas 2D API (universally supported — no polyfill needed)

**Risks:**
- **Canvas z-index conflicts**: Canvas must be above Three.js canvas (z-index 10) but below modals/nav (z-index 100+). Mitigation: Use `z-index: 10` and verify no UI elements are below this.
- **High DPI blurriness**: Must account for `devicePixelRatio` when setting canvas dimensions. Mitigation: Multiply width/height by dpr, use CSS to set display size.
- **Battery drain on mobile**: Continuous rAF loop drains battery. Mitigation: Pause when tab is hidden, reduce particle count, respect `prefers-reduced-motion`.
- **Color palette changes**: If theme changes dynamically, brushstroke colors should update. Mitigation: Re-read `data-colors` on each particle creation (not cached at init).

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Impressionist brushstroke cursor trail — painterly strokes follow your cursor",
  "changes": [
    "Added brushstroke-canvas overlay with Canvas 2D particle system",
    "Brushstroke particles follow mouse/touch movement with fading trails",
    "Colors sampled from current theme palette with natural variation",
    "Respects prefers-reduced-motion accessibility setting",
    "Pauses animation when tab is hidden to save battery",
    "Mobile-optimized with reduced particle count and size"
  ]
}
```
