# PRD: Realistic Randomized Tulips

> **ID:** idea-019
> **Category:** 3D Elements
> **Priority:** high
> **Status:** backlog
> **PRD Version:** 1.1
> **Last Updated:** 2026-05-20

---

## 1. Overview

**One-liner:** Replace abstract oval tulip shapes with realistic, recognizable tulip flowers — proper cup/bloom forms, 14 non-yellow colors, per-tulip randomization, and petal-level detail.

**Problem:** Current tulips are symmetric bezier ovals rotated around a center — they look like generic colored blobs, not tulips. The open/closed difference is minimal. Yellow colors remain in the palette despite sunflowers owning that space. Every tulip looks identical at the same scale.

**Solution:** Complete rewrite of `makeTulipCanvas()` with proper tulip morphology: asymmetric pointed petals, distinct cup vs bloom silhouettes, per-petal depth shading, wavy edges, and a 14-color non-yellow palette. Add texture caching and per-tulip randomization (petal count, width, height, curl, cup openness).

---

## 2. User Stories

- As a visitor, I want tulips to look like actual tulips (not colored ovals) so the garden feels authentic
- As a visitor, I want each tulip to look unique so the field feels natural and hand-painted
- As a visitor, I want to clearly see the difference between closed (cup) and open (bloom) tulips
- As a visitor, I want tulip colors to be completely distinct from sunflower yellows
- As a visitor on mobile, I want tulips to be clearly visible and detailed even at small sizes

---

## 3. Technical Specification

### 3.1 Architecture

- **File modified:** `public/js/scene-init.js` — `makeTulipCanvas()` function (~lines 354-492)
- **File modified:** `public/js/scene-init.js` — `createTulips()` function (~lines 494-542) — color palette + texture cache
- **No new files** — pure Canvas2D drawing improvement
- **Dependencies:** None

### 3.2 Current State Analysis

| Aspect | Current | Needed |
|--------|---------|--------|
| Petal shape | Symmetric bezier oval | Asymmetric pointed tulip petal |
| Petal count | Fixed: 5 (closed) or 6 (open) | Random: 5-7 per tulip |
| Open vs closed | Slightly wider spread | Dramatically different silhouettes |
| Color palette | 16 colors including 3 yellows | 14 colors, zero yellows |
| Per-petal depth | Same lightness all petals | Back petals darker, front lighter |
| Petal edges | Smooth symmetric bezier | Slightly wavy via random offsets |
| Texture caching | None (new canvas every tulip) | Cache by (color, isOpen) key |
| Mobile visibility | Scale 0.8-1.4, aspect 1.0×1.6 | Keep (already fixed) |

### 3.3 Implementation Details

#### Step 1: Remove All Yellows from Color Palette
- File: `public/js/scene-init.js` — `createTulips()` color array
- Remove: `#e8a020` (golden yellow), `#d4901a` (amber), `#f0c040` (soft gold)
- New 14-color palette:
  ```
  '#e84040' — vivid red
  '#d41a1a' — deep red
  '#e03050' — crimson
  '#c830a0' — magenta
  '#c040b0' — orchid
  '#9040d0' — purple
  '#a030c0' — violet
  '#f05090' — pink
  '#d03070' — rose
  '#f08080' — light salmon
  '#e8a0c0' — pale pink
  '#e87020' — red-orange (not yellow-orange)
  '#f06030' — coral
  '#e05020' — vermillion
  ```
- Validation: No color should have G > 180 AND R > 200 AND B < 100 (yellow range)

#### Step 2: Redraw Closed Tulip (Cup/Bud Shape)
- File: `public/js/scene-init.js` — `makeTulipCanvas()`
- Petal shape: Asymmetric pointed petal using asymmetric bezier curves
  - Narrow at base (width ~15% of height)
  - Widens to ~35% of height at midpoint
  - Tapers to sharp point at top
  - Left edge: gentle outward curve
  - Right edge: slightly different curve (asymmetric, not mirrored)
- Petal arrangement: 5-7 petals in tight cup formation
  - Inner 3 petals: fully visible, upright, overlapping at center
  - Outer 2-4 petals: peeking between inner petals, slightly shorter
  - Petals tilt inward at top (cup shape)
- Silhouette: Rounded cup — wider at top than base, pointed tips visible
- Depth: Back/outer petals 20-30% darker than front/inner petals
- Center: Small dark stamen cluster visible at cup opening
- Vein line: Single subtle line from base to 2/3 height on each petal

#### Step 3: Redraw Open Tulip (Bloom Shape)
- File: `public/js/scene-init.js` — `makeTulipCanvas()`
- Petal shape: Wider, reflexed petals
  - Base width ~25% of height (wider than closed)
  - Petals flare outward then curve backward (reflex) at tips
  - Tips point outward/upward, not inward
  - Wavy edges: add ±2-3px random offset to bezier control points
- Petal arrangement: 5-7 petals spread in a flat star pattern
  - All petals roughly same height
  - Petals spread horizontally (not cupped)
  - Gaps between petals visible
- Silhouette: Wide open flower — much wider than tall
- Center: Visible dark stamens in middle
- Depth: Alternate petals darker/lighter for 3D effect

#### Step 4: Per-Tulip Randomization
- File: `public/js/scene-init.js` — `makeTulipCanvas()`
- Petal count: `5 + Math.floor(Math.random() * 3)` → 5, 6, or 7
- Per-petal width variation: base width × (0.85 + Math.random() * 0.3)
- Per-petal height variation: base height × (0.9 + Math.random() * 0.2)
- Cup openness (closed tulips): 0.0 (tight bud) to 0.4 (slightly open)
- Reflex amount (open tulips): 0.2 (slightly open) to 0.8 (fully reflexed)
- Color warmth shift per petal: ±10% on R, G, B channels independently
- Wavy edge offset: ±(2 + Math.random() * 3) pixels on bezier control points

#### Step 5: Petal Rendering Improvements
- File: `public/js/scene-init.js` — `makeTulipCanvas()`
- 3-stop gradient per petal:
  - Stop 0 (tip): Lightened color (+40 R, +10 G, +10 B, 0.97 alpha)
  - Stop 0.4 (mid): Base color (as-is, 0.92 alpha)
  - Stop 1 (base): Darkened color (-50 R, -30 G, -20 B, 0.78 alpha)
- Edge highlight: Thin line (1px at 160px canvas) along left petal edge, 20% lighter
- Vein line: Subtle line from base to 60% height, 15% darker than base color
- Back petals: Multiply RGB by 0.7-0.8 for depth

#### Step 6: Texture Caching
- File: `public/js/scene-init.js` — `createTulips()`
- Add cache object: `var tulipCache = {};`
- Cache key: `color + '_' + isOpen` (e.g., `"#e84040_true"`)
- Before generating canvas, check cache
- If cached, reuse `CanvasTexture` (create new texture from cached canvas)
- Limit cache to 50 entries (LRU eviction)
- Expected: 6 tulips × 14 colors × 2 states = max 168 textures, but cache keeps it manageable

### 3.4 Mobile Considerations

- Canvas size: 160px (unchanged)
- Tulip count: 3 mobile, 6 desktop (unchanged)
- Scale: 0.8-1.4 mobile, 0.6-1.2 desktop (unchanged)
- Aspect ratio: 1.0 × 1.6 (unchanged)
- Performance: Texture cache ensures max 168 canvas generations per page load (not per frame)
- Draw calls: Unchanged (sprite-based rendering)

### 3.5 Data Structures

```json
{
  "tulipConfig": {
    "color": "#e84040",
    "isOpen": true,
    "petalCount": 6,
    "petalWidthVar": [0.85, 1.15],
    "petalHeightVar": [0.9, 1.1],
    "curlFactor": 0.4,
    "cupOpenness": 0.0,
    "reflexAmount": 0.6,
    "wavyEdgePx": [2, 5],
    "depthShading": [0.7, 1.0]
  },
  "cache": {
    "key": "#e84040_true",
    "canvas": "<Canvas>",
    "texture": "<CanvasTexture>",
    "lastUsed": 1716200000
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Tulip canvas renders | `tests/3d/tulip-canvas.test.js` | `makeTulipCanvas(160, '#e84040', true)` returns valid canvas |
| Closed tulip is taller than wide | `tests/3d/tulip-shape.test.js` | Closed tulip bounding box: height > width |
| Open tulip is wider than tall | `tests/3d/tulip-shape.test.js` | Open tulip bounding box: width > height |
| No yellow in palette | `tests/3d/tulip-colors.test.js` | No color in array has G>180 AND R>200 AND B<100 |
| Randomization produces different canvases | `tests/3d/tulip-random.test.js` | Two calls with same params produce different pixel data |
| Texture cache works | `tests/3d/tulip-cache.test.js` | Same (color, isOpen) returns cached texture |
| Petal count varies | `tests/3d/tulip-random.test.js` | 100 tulips have petal counts in range [5, 7] |
| Mobile scale >= 0.8 | `tests/3d/tulip-mobile.test.js` | All mobile tulip sprites have scale >= 0.8 |

### 4.2 Green Phase — Implementation

Implement steps 1-6 in order. Each step is a separate commit:
1. `fix: remove yellow colors from tulip palette`
2. `feat: redraw closed tulip with proper cup shape`
3. `feat: redraw open tulip with reflexed bloom shape`
4. `feat: add per-tulip randomization (petal count, size, curl)`
5. `feat: add petal gradients, edge highlights, vein lines, depth shading`
6. `perf: add texture caching by (color, isOpen)`

### 4.3 Refactor Phase — Optimization

- LRU cache eviction at 50 entries
- Reduce canvas size to 120px for mobile tulips (saves 33% memory)
- Batch petal drawing to minimize canvas save/restore calls
- Pre-compute color lightened/darkened variants

---

## 5. Acceptance Criteria

- [ ] Closed tulips look like recognizable tulip buds (tall cup shape, pointed tips, inward-tilted petals)
- [ ] Open tulip silhouette is clearly wider than tall (reflexed petals, star pattern)
- [ ] No tulip uses yellow or yellow-adjacent colors (verified: zero colors with G>180 AND R>200 AND B<100)
- [ ] 14 distinct non-yellow colors in palette
- [ ] Each tulip looks visibly different (randomization working)
- [ ] Petal count varies between 5-7
- [ ] Back petals are darker than front petals (depth shading)
- [ ] Petals have visible gradient (light tip → dark base)
- [ ] Petal edges are slightly wavy (not perfectly smooth)
- [ ] Texture cache prevents duplicate canvas generation
- [ ] Works on mobile: 3 tulips at scale 0.8-1.4, clearly visible
- [ ] No frame rate impact (canvas generated once per tulip, rendered as sprite)

---

## 6. Dependencies & Risks

**Dependencies:** None — pure Canvas2D drawing, no new libraries

**Risks:**
- Over-detailed petals won't read at small mobile scales → Mitigation: keep shapes bold, test at 0.8 scale early, use 160px canvas
- Asymmetric petals may look broken if bezier offsets are too large → Mitigation: cap wavy offset at ±5px, test visually
- 168 possible texture combinations (14 colors × 2 states × 6 counts) → Mitigation: LRU cache at 50 entries, most combos won't appear in single view
- Color palette may have low contrast against dark bg → Mitigation: ensure all colors have at least one channel > 120

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Realistic randomized tulips — proper cup/bloom shapes, 14 non-yellow colors, per-tulip variation",
  "changes": [
    "Remove all yellow colors from tulip palette (14 colors: red, crimson, magenta, orchid, purple, violet, pink, rose, salmon, pale pink, red-orange, coral, vermillion)",
    "Redraw closed tulip: asymmetric pointed petals in cup formation, inner/outer petal layers, depth shading",
    "Redraw open tulip: wide reflexed petals in star pattern, wavy edges, visible stamens",
    "Add per-tulip randomization: petal count 5-7, width/height ±15%, curl, cup openness, reflex amount",
    "Add petal rendering: 3-stop gradients, edge highlights, vein lines, per-petal color warmth shift",
    "Add texture caching by (color, isOpen) with LRU eviction at 50 entries"
  ]
}
```
