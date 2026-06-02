# PRD: Scroll-Synced Ambient Lighting System

> **ID:** idea-048
> **Category:** UI
> **Priority:** low
> **Status:** done
> **PRD Version:** 1.0
> **Last Updated:** 2026-06-01
> **Review:** ✅ Reviewed 2026-06-02 — implementation verified, tests pass (no new failures), build succeeds, site deployed. Scroll-lighting.js correctly implements IntersectionObserver-driven ambient overlay with per-section lighting recipes. All 12 acceptance criteria met. CSS includes proper reduced-motion and low-end device support. Verdict: DONE.

---

## 1. Overview

**One-liter:** As visitors scroll through the five content sections, smoothly shifting ambient CSS lighting effects (gradient overlays, spotlight washes, and vignette pulses) reflect the emotional tone of each section's theme.

**Problem:** The 3D scene and the scroll content feel disconnected — the page layout is uniform regardless of which section is in view, missing an opportunity to reinforce each section's emotional atmosphere through lighting.

**Solution:** A lightweight, CSS-driven ambient lighting system where each of the 5 content sections has an associated "lighting recipe" (gradient color, vignette intensity, spotlight position). As the user scrolls, an IntersectionObserver tracks which section is dominant and smoothly transitions the CSS custom properties that control the page's ambient overlay. This creates a cinematic feeling of shifting atmosphere as you move through the content. Pure CSS + minimal JS — zero impact on the Three.js scene.

---

## 2. User Stories

- As a visitor, I want the ambient lighting to shift as I scroll between sections, so that each section feels emotionally distinct.
- As a visitor, I want lighting transitions to be smooth and gradual, so the experience feels cinematic rather than jarring.
- As a visitor, I want the lighting theme to match the content — warm gold for Moon, violet for Philosophy, orange for Art, etc.
- As a visitor on a low-end device, I want the effect to gracefully degrade to simple background color shifts if GPU compositing is limited.

---

## 3. Technical Specification

### 3.1 Architecture

**New files:**
- `public/js/scroll-lighting.js` — Standalone module, loaded as `<script type="module">` in BaseLayout.astro
- No modifications to `scene-init.js` (sacred)
- No modifications to `index.astro` (injected via BaseLayout)

**Existing modules it depends on:**
- CSS custom properties defined in `BaseLayout.astro` (`:root` design tokens)
- IntersectionObserver API (browser native)
- CSS transitions for smooth interpolation

**How it works:**
- A single fixed-position overlay `<div id="ambient-light-overlay">` sits between the Three.js canvas and the scroll content (z-index between them)
- The overlay uses `mix-blend-mode: multiply` and `pointer-events: none` so it doesn't interfere with interaction
- CSS custom properties `--ambient-hue`, `--ambient-sat`, `--ambient-opacity`, `--spotlight-x`, `--spotlight-y` control the overlay's appearance
- IntersectionObserver tracks which section is >50% visible
- On section change, JS updates the CSS custom properties, and CSS `transition: 1.2s ease-in-out` handles the smooth interpolation

### 3.2 Implementation Details

#### Step 1: Create the ambient overlay element
- File: `public/js/scroll-lighting.js`
- What to do:
  - Create a fixed-position `<div id="ambient-light-overlay">` with:
    - `position: fixed; inset: 0; pointer-events: none;`
    - `z-index: 5` (between canvas z-index and content z-index)
    - `mix-blend-mode: soft-light`
    - `opacity: var(--ambient-opacity, 0)`
    - `background: radial-gradient(ellipse at var(--spotlight-x, 50%) var(--spotlight-y, 50%), var(--ambient-color, transparent) 0%, transparent 70%)`
    - `transition: opacity 1.2s ease-in-out, background 1.5s ease-in-out`
  - Append to `document.body`
- Expected outcome: An invisible overlay div exists, ready to receive lighting values

#### Step 2: Define lighting recipes per section
- File: `public/js/scroll-lighting.js`
- What to do:
  - Create a `sectionLighting` map:
    - `moon`: `{ hue: 45, sat: 0.3, opacity: 0.15, spotlightX: 70, spotlightY: 20 }` — warm gold, upper-right (moon position)
    - `philosophy`: `{ hue: 270, sat: 0.2, opacity: 0.12, spotlightX: 30, spotlightY: 50 }` — soft violet, left-center
    - `gita`: `{ hue: 200, sat: 0.25, opacity: 0.10, spotlightX: 50, spotlightY: 30 }` — calm blue, top-center
    - `shiva`: `{ hue: 0, sat: 0.15, opacity: 0.08, spotlightX: 50, spotlightY: 80 }` — deep red, bottom-center
    - `art`: `{ hue: 30, sat: 0.35, opacity: 0.18, spotlightX: 60, spotlightY: 40 }` — warm orange, right-center
  - Hero section (above first section): `{ hue: 0, sat: 0, opacity: 0 }` — no overlay
- Expected outcome: Each section has a unique lighting recipe

#### Step 3: Implement IntersectionObserver scroll tracking
- File: `public/js/scroll-lighting.js`
- What to do:
  - Create IntersectionObserver with `threshold: [0, 0.25, 0.5, 0.75, 1.0]` and `rootMargin: '-10% 0px -10% 0px'`
  - Observe all 5 section elements (by their `id` attributes: `#moon`, `#philosophy`, `#gita`, `#shiva`, `#art`)
  - On each observation callback, find the entry with the highest `intersectionRatio`
  - If the dominant section has changed, call `applyLighting(sectionId)`
  - `applyLighting(id)` sets CSS custom properties on `:root`:
    ```js
    document.documentElement.style.setProperty('--ambient-color', `hsla(${recipe.hue}, ${recipe.sat * 100}%, 50%, ${recipe.opacity})`);
    document.documentElement.style.setProperty('--spotlight-x', `${recipe.spotlightX}%`);
    document.documentElement.style.setProperty('--spotlight-y', `${recipe.spotlightY}%`);
    ```
- Expected outcome: Scrolling between sections smoothly transitions the ambient overlay

#### Step 4: Add vignette pulse on section entry
- File: `public/js/scroll-lighting.js`
- What to do:
  - On section change, briefly increase overlay opacity by +0.05 for 400ms, then return to normal
  - Implemented via adding a CSS class `vignette-pulse` to the overlay, then removing it after 400ms
  - The pulse class: `opacity: calc(var(--ambient-opacity) + 0.05) !important; transition: opacity 0.4s ease-out`
- Expected outcome: A subtle "breathing" vignette pulse when entering a new section

#### Step 5: Graceful degradation
- File: `public/js/scroll-lighting.js`
  - Check `window.matchMedia('(prefers-reduced-motion: reduce)')` — if true, disable transitions (set duration to 0)
  - Check `navigator.hardwareConcurrency` — if ≤ 2, reduce overlay complexity (solid color instead of radial gradient)
  - If IntersectionObserver is not supported (very old browsers), fall back to scroll event throttled to 200ms
- Expected outcome: Works on all devices, degrades gracefully

### 3.3 Mobile Considerations

- Overlay uses `will-change: opacity, background` for GPU compositing
- On mobile, reduce spotlight ellipse size (50% instead of 70%) for sharper effect
- IntersectionObserver rootMargin adjusted to `-5% 0px -5% 0px` for shorter mobile viewports
- Performance budget: overlay is a single div with CSS transitions — near-zero JS cost after init
- No additional draw calls (pure CSS compositing)

### 3.4 Data Structures

```json
{
  "sectionLighting": {
    "hero":    { "hue": 0,   "sat": 0,    "opacity": 0,   "spotlightX": 50, "spotlightY": 50 },
    "moon":    { "hue": 45,  "sat": 0.3,  "opacity": 0.15, "spotlightX": 70, "spotlightY": 20 },
    "philosophy": { "hue": 270, "sat": 0.2, "opacity": 0.12, "spotlightX": 30, "spotlightY": 50 },
    "gita":    { "hue": 200, "sat": 0.25, "opacity": 0.10, "spotlightX": 50, "spotlightY": 30 },
    "shiva":   { "hue": 0,   "sat": 0.15, "opacity": 0.08, "spotlightX": 50, "spotlightY": 80 },
    "art":     { "hue": 30,  "sat": 0.35, "opacity": 0.18, "spotlightX": 60, "spotlightY": 40 }
  },
  "cssCustomProperties": {
    "--ambient-color": "hsla(hue, sat*100%, 50%, opacity)",
    "--spotlight-x": "spotlightX%",
    "--spotlight-y": "spotlightY%",
    "--ambient-opacity": "opacity"
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Overlay div created on init | `tests/scroll-lighting.test.js` | `#ambient-light-overlay` exists in DOM |
| Lighting recipes have all 5 sections | `tests/scroll-lighting.test.js` | `sectionLighting` has keys: moon, philosophy, gita, shiva, art |
| applyLighting sets CSS properties | `tests/scroll-lighting.test.js` | After applyLighting('moon'), `--ambient-color` is `hsla(45, 30%, 50%, 0.15)` |
| IntersectionObserver tracks sections | `tests/scroll-lighting.test.js` | Observer is created with correct threshold array |
| Vignette pulse class added/removed | `tests/scroll-lighting.test.js` | `vigvette-pulse` class present for 400ms after section change |
| Reduced motion disables transitions | `tests/scroll-lighting.test.js` | When prefers-reduced-motion, transition duration is 0 |

### 4.2 Green Phase — Implementation

Implement `public/js/scroll-lighting.js` as a single IIFE module:
- Creates overlay div
- Defines `sectionLighting` map
- Sets up IntersectionObserver
- Exports `applyLighting()` for potential manual triggering
- Handles graceful degradation

### 4.3 Refactor Phase — Optimization

- Cache `getComputedStyle` reads
- Use `requestAnimationFrame` for the vignette pulse timer instead of `setTimeout`
- Consider using CSS `@property` for typed custom properties (smoother transitions in Chrome)

---

## 5. Acceptance Criteria

- [ ] Ambient overlay div renders between canvas and content layers
- [ ] Each of the 5 content sections has a unique lighting recipe
- [ ] Scrolling to a new section smoothly transitions the ambient lighting over 1.2–1.5s
- [ ] Moon section shows warm gold spotlight in upper-right
- [ ] Philosophy section shows soft violet spotlight left-center
- [ ] Art section shows warm orange spotlight right-center
- [ ] Vignette pulse effect triggers on section entry
- [ ] `prefers-reduced-motion` disables all transitions
- [ ] No modifications to `scene-init.js`
- [ ] No modifications to `index.astro`
- [ ] Works on mobile with adjusted spotlight size
- [ ] Performance: < 0.5ms JS per scroll event, CSS transitions handled by compositor

---

## 6. Dependencies & Risks

**Dependencies:** IntersectionObserver API (supported in all modern browsers). CSS `mix-blend-mode` (supported in all modern browsers). No dependencies on Three.js or other scripts.

**Risks:**
- `mix-blend-mode` may not work as expected on all mobile GPUs → Mitigation: fallback to simple opacity-based overlay without blend mode
- Overlay z-index may conflict with existing elements → Mitigation: z-index 5, between canvas (z-index ~0-1) and content (z-index ~10)
- IntersectionObserver may fire rapidly during fast scroll → Mitigation: only update on section change (debounce by checking currentSection !== newSection)
- CSS custom properties may not transition smoothly in all browsers → Mitigation: use explicit `transition` property on the overlay div

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Scroll-Synced Ambient Lighting — cinematic atmosphere shifts per content section",
  "changes": [
    "Added public/js/scroll-lighting.js (standalone module)",
    "CSS ambient overlay with radial-gradient spotlight per section",
    "IntersectionObserver-driven section detection",
    "Smooth 1.2s CSS transitions between lighting themes",
    "Vignette pulse effect on section entry",
    "Graceful degradation for reduced-motion and low-end devices"
  ]
}
```
