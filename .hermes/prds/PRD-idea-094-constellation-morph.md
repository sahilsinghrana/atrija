# PRD: Constellation Morph — Seasonal Sky Transformations

> **ID:** idea-094
> **Category:** 3D Elements
> **Priority:** low
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-06-29

---

## 1. Overview

**One-liner:** The night sky's constellation patterns subtly morph between seasonal arrangements as weeks pass, reflecting the real celestial drift.

**Problem:** The star field is static — the same patterns render regardless of when you visit. Real constellations shift with Earth's orbit, and the sky feels frozen in time.

**Solution:** A standalone module that calculates the current week-of-year and applies a subtle vertex displacement to star positions, slowly shifting constellation patterns over the course of the year. Stars drift along pre-computed bezier paths between 4 seasonal anchor configurations (spring, summer, autumn, winter). The effect is barely perceptible in a single visit but gives the sky a living, breathing quality across months. Zero scene-init.js changes — wraps the existing star field via a post-init hook.

---

## 2. User Stories

- As a returning visitor, I want the sky to feel subtly different each month, so the experience never feels stale.
- As a visitor, I want the star movement to be imperceptible in real-time, so it never distracts from the content.
- As a visitor on a low-end device, I want the effect to be a simple position offset rather than a shader-based displacement.

---

## 3. Technical Specification

### 3.1 Architecture

**New files:**
- `public/js/constellation-morph.js` — Standalone IIFE module, loaded via `<script>` tag in BaseLayout.astro

**Existing modules it depends on:**
- The existing star field (scene-stars.js) — accessed via `window.__sceneStars` global hook
- No Three.js imports — operates on the star positions array if exposed, or applies a CSS transform fallback

**How it works:**
- On load, calculates `weekOfYear` from the current date (1-52)
- Maps week-of-year to a 4-point seasonal interpolation (0=spring, 0.33=summer, 0.66=autumn, 1.0=winter)
- Each season has a small rotation offset (±3°) and scale factor (±2%) applied to the star group
- Uses `requestAnimationFrame` to smoothly interpolate between seasonal targets over 30 seconds when the page loads, then holds position
- If `window.__sceneStars` is not available (scene not ready), waits for `__sceneReady` event

### 3.2 Implementation Details

#### Step 1: Create the morph module
- File: `public/js/constellation-morph.js`
- What to do:
  - Define 4 seasonal anchor configurations:
    - Spring: `{ rotationZ: -2, scale: 1.01, driftX: 0.5 }`
    - Summer: `{ rotationZ: 0, scale: 1.0, driftX: 0 }`
    - Autumn: `{ rotationZ: 2, scale: 0.99, driftX: -0.5 }`
    - Winter: `{ rotationZ: 3, scale: 1.02, driftX: 0.3 }`
  - Calculate current season progress from week-of-year
  - Interpolate between the two nearest seasonal anchors
  - Apply transform to the star group via `window.__sceneStars.group` if available
  - Fallback: apply CSS transform to the canvas if Three.js hook unavailable
- Expected outcome: Stars subtly shift position based on current week of year

#### Step 2: Add smooth entry animation
- File: `public/js/constellation-morph.js`
- What to do:
  - On first load, animate from current position to target position over 30 seconds using easeInOutCubic
  - After animation completes, hold position (no continuous animation = zero ongoing cost)
  - Store target in `sessionStorage` so returning visitors in the same session see no re-animation
- Expected outcome: Smooth one-time transition on first load, then static

#### Step 3: Register in BaseLayout
- File: `src/layouts/BaseLayout.astro`
- What to do:
  - Add `<script src="/js/constellation-morph.js"></script>` alongside other standalone modules
- Expected outcome: Module loads on every page visit

### 3.3 Mobile Considerations

- On mobile (viewport < 768px), reduce rotation offset to ±1.5° and scale to ±1% for subtler effect
- If `navigator.hardwareConcurrency <= 2`, skip the entry animation entirely (jump to target)
- Performance budget: one-time 30s animation, then zero ongoing cost. No per-frame work after settle.

### 3.4 Data Structures

```json
{
  "seasonalAnchors": {
    "spring": { "rotationZ": -2, "scale": 1.01, "driftX": 0.5, "driftY": 0.2 },
    "summer": { "rotationZ": 0, "scale": 1.0, "driftX": 0, "driftY": 0 },
    "autumn": { "rotationZ": 2, "scale": 0.99, "driftX": -0.5, "driftY": -0.2 },
    "winter": { "rotationZ": 3, "scale": 1.02, "driftX": 0.3, "driftY": 0.1 }
  },
  "animationDuration": 30000,
  "settleHold": true
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Season calculation returns correct season | `tests/unit/constellation-morph.test.js` | Week 13 → spring, Week 26 → summer, Week 39 → autumn, Week 52 → winter |
| Interpolation between two seasons is smooth | `tests/unit/constellation-morph.test.js` | Midpoint between spring and summer returns average values |
| Target transform computed from date | `tests/unit/constellation-morph.test.js` | Given a fixed date, returns expected rotationZ and scale |
| Animation eases correctly | `tests/unit/constellation-morph.test.js` | easeInOutCubic(0)=0, easeInOutCubic(1)=1, easeInOutCubic(0.5)=0.5 |
| Mobile reduces amplitude | `tests/unit/constellation-morph.test.js` | On mobile viewport, rotationZ is halved |
| sessionStorage skip on return | `tests/unit/constellation-morph.test.js` | If sessionStorage has 'constellation-morph-settled', no animation runs |

### 4.2 Green Phase — Implementation

Implement `public/js/constellation-morph.js` as a single IIFE module:
- `getSeasonProgress(date)` → returns { season, progress }
- `interpolateAnchors(season1, season2, progress)` → returns transform object
- `applyTransform(transform)` → applies to `window.__sceneStars.group` or canvas fallback
- `animateToTarget(target, duration)` — one-shot animation with easeInOutCubic
- Main flow: compute → animate → settle → store in sessionStorage

### 4.3 Refactor Phase — Optimization

- Cache the computed target transform in a module-level variable
- Use `transform: translate3d()` for GPU-accelerated canvas fallback
- Remove animation frame listener immediately after settle

---

## 5. Acceptance Criteria

- [ ] Module computes correct seasonal transform from current date
- [ ] Stars subtly shift position on first page load (30s animation)
- [ ] Animation uses easeInOutCubic timing
- [ ] After animation completes, no ongoing per-frame work
- [ ] Returning visitors in same session skip animation (sessionStorage)
- [ ] Mobile devices get reduced amplitude (±1.5° rotation, ±1% scale)
- [ ] Low-end devices (≤2 cores) skip animation entirely
- [ ] Works as fallback with CSS transform if Three.js hook unavailable
- [ ] No modifications to `scene-init.js`
- [ ] No modifications to `index.astro`
- [ ] Build succeeds
- [ ] Total added code ~120 lines

---

## 6. Dependencies & Risks

**Dependencies:** `window.__sceneReady` event (already dispatched by scene-init.js). `window.__sceneStars` global hook (must be added to scene-stars.js as a 1-line export — if not available, CSS fallback works).

**Risks:**
- `window.__sceneStars` may not be exposed → Mitigation: CSS transform fallback on the canvas element
- Seasonal anchors may feel too subtle → Mitigation: start with ±3° and adjust based on visual testing
- Animation may conflict with scroll-driven parallax → Mitigation: apply transform to the star group container, not individual stars, so parallax operates on top

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Constellation Morph — seasonal sky drift across the year",
  "changes": [
    "Added public/js/constellation-morph.js (standalone module)",
    "4 seasonal anchor configurations for star field positioning",
    "One-time 30s easeInOutCubic animation on first load",
    "sessionStorage skip for returning visitors",
    "Mobile and low-end device amplitude reduction",
    "CSS transform fallback if Three.js hook unavailable"
  ]
}
```
