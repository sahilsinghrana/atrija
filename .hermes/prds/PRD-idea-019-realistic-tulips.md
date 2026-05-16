# PRD: Realistic Randomized Tulips

> **ID:** idea-019
> **Category:** 3D Elements
> **Priority:** high
> **Status:** backlog
> **PRD Version:** 1.2
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

### 3.3 Implementation Plan

#### Step 1: Remove All Yellows from Color Palette

**File:** `public/js/scene-init.js` — `createTulips()` color array

Remove: `#e8a020` (golden yellow), `#d4901a` (amber), `#f0c040` (soft gold)

New 14-color palette:
```javascript
var colors = [
  '#e84040',  // vivid red
  '#d41a1a',  // deep red
  '#e03050',  // crimson
  '#c830a0',  // magenta
  '#c040b0',  // orchid
  '#9040d0',  // purple
  '#a030c0',  // violet
  '#f05090',  // pink
  '#d03070',  // rose
  '#f08080',  // light salmon
  '#e8a0c0',  // pale pink
  '#e87020',  // red-orange
  '#f06030',  // coral
  '#e05020',  // vermillion
];
```

Validation: No color should have `G > 180 && R > 200 && B < 100`.

**Commit:** `fix: remove yellow colors from tulip palette (14 non-yellow colors)`

---

#### Step 2: Rewrite Closed Tulip (Cup/Bud Shape)

**File:** `public/js/scene-init.js` — `makeTulipCanvas()`

**Petal shape — asymmetric pointed tulip petal:**
```javascript
var tipOffset = petalW * 0.1 * (Math.random() - 0.5);
var w1 = petalW * (0.7 + Math.random() * 0.15);  // left control width
var w2 = petalW * (0.65 + Math.random() * 0.15); // right control width (different!)
var h1 = petalH * (0.55 + Math.random() * 0.1);  // left control height
var h2 = petalH * (0.5 + Math.random() * 0.1);   // right control height

ctx.moveTo(0, petalH * 0.25);
ctx.bezierCurveTo(-w1, petalH * 0.1, -w1 * 0.6, -h1, tipOffset, -petalH);
ctx.bezierCurveTo(w2 * 0.6, -h2, w2, petalH * 0.05, 0, petalH * 0.25);
```

**Petal arrangement — layered cup formation:**
```javascript
var petalCount = 5 + Math.floor(Math.random() * 3); // 5-7
var cupOpenness = Math.random() * 0.4; // 0.0 (tight) to 0.4 (slightly open)

for (var p = 0; p < petalCount; p++) {
  var angle = (p / petalCount) * Math.PI * 2 - Math.PI / 2;
  var isBackPetal = (p % 2 === 0);
  var depthFactor = isBackPetal ? (0.7 + Math.random() * 0.1) : 1.0;
  var petalH = headR * (isBackPetal ? 0.7 : 0.9) * (0.9 + Math.random() * 0.2);
  var petalW = headR * 0.28 * (0.85 + Math.random() * 0.3);
  var tiltAngle = angle + Math.PI / 2 + cupOpenness * (isBackPetal ? 0.3 : 0.15);
  var spreadR = isBackPetal ? headR * 0.15 : headR * 0.25;
  // draw petal with depth shading
}
```

**Silhouette requirements:** Height > Width, pointed tips visible, wider at top than base, inner petals visible through gaps.

**Commit:** `feat: redraw closed tulip with asymmetric cup-shaped petals`

---

#### Step 3: Rewrite Open Tulip (Bloom Shape)

**File:** `public/js/scene-init.js` — `makeTulipCanvas()`

**Petal shape — wide reflexed petal:**
```javascript
var reflexAmount = 0.2 + Math.random() * 0.6;
var petalH = headR * (0.7 + Math.random() * 0.15);
var petalW = headR * (0.4 + Math.random() * 0.15);
var wave1 = 2 + Math.random() * 3;
var wave2 = 2 + Math.random() * 3;

ctx.moveTo(0, petalH * 0.15);
ctx.bezierCurveTo(
  -petalW * 1.1 + wave1, petalH * 0.05,
  -petalW * 0.9 - wave1, -petalH * 0.5,
  -petalW * 0.3, -petalH * (0.7 + reflexAmount * 0.3)
);
ctx.bezierCurveTo(
  petalW * 0.5 + wave2, -petalH * 0.4,
  petalW * 1.0 - wave2, petalH * 0.0,
  0, petalH * 0.15
);
```

**Petal arrangement — flat star pattern:**
```javascript
var petalCount = 5 + Math.floor(Math.random() * 3);
var reflexAmount = 0.2 + Math.random() * 0.6;

for (var p = 0; p < petalCount; p++) {
  var angle = (p / petalCount) * Math.PI * 2 - Math.PI / 2;
  var depthFactor = (p % 2 === 0) ? 0.85 : 1.0;
  var spreadR = headR * 0.3;
  // draw petal with reflex
}
```

**Silhouette requirements:** Width > Height, star pattern, gaps between petals, tips reflexed outward.

**Commit:** `feat: redraw open tulip with wide reflexed bloom petals`

---

#### Step 4: Per-Tulip Randomization

**File:** `public/js/scene-init.js` — `makeTulipCanvas()`

**Add at top of function (after color parsing):**
```javascript
var petalCount = 5 + Math.floor(Math.random() * 3);
var curlFactor = 0.3 + Math.random() * 0.3;
var widthVar = 0.85 + Math.random() * 0.3;
var cupOpenness = Math.random() * 0.4;
var reflexAmount = 0.2 + Math.random() * 0.6;
var warmthShift = (Math.random() * 0.2) - 0.1; // ±10%
```

**Per-petal randomization (inside loop):**
```javascript
var pWidthVar = widthVar * (0.85 + Math.random() * 0.3);
var pHeightVar = 0.9 + Math.random() * 0.2;
var pWavyOffset = 2 + Math.floor(Math.random() * 3);
var pLightness = (p < petalCount / 2) ? (15 + Math.floor(Math.random() * 10)) : (-10 + Math.floor(Math.random() * 15));
```

**Color warmth shift:**
```javascript
rr = Math.min(255, Math.max(0, rr + Math.round(rr * warmthShift)));
gg = Math.min(255, Math.max(0, gg + Math.round(gg * warmthShift * 0.5)));
bb = Math.min(255, Math.max(0, bb + Math.round(bb * warmthShift * 0.3)));
```

**Commit:** `feat: add per-tulip randomization (petal count, size, curl, warmth)`

---

#### Step 5: Petal Rendering Improvements

**File:** `public/js/scene-init.js` — `makeTulipCanvas()`

**Extract petal drawing into a helper function:**
```javascript
function drawTulipPetal(ctx, petalH, petalW, depthFactor, lightness, wavyOffset) {
  var r = Math.min(255, Math.max(0, (rr + lightness) * depthFactor));
  var g = Math.min(255, Math.max(0, (gg + lightness) * depthFactor));
  var b = Math.min(255, Math.max(0, (bb + lightness) * depthFactor));

  // 3-stop gradient
  var pg = ctx.createLinearGradient(0, -petalH, 0, petalH * 0.3);
  pg.addColorStop(0, 'rgba('+Math.min(255,r+40)+','+Math.min(255,g+10)+','+Math.min(255,b+10)+',0.97)');
  pg.addColorStop(0.4, 'rgba('+r+','+g+','+b+',0.92)');
  pg.addColorStop(1, 'rgba('+Math.max(0,r-50)+','+Math.max(0,g-30)+','+Math.max(0,b-20)+',0.78)');
  ctx.fillStyle = pg;

  // Asymmetric bezier with wavy edges
  var tipX = petalW * 0.08 * (Math.random() - 0.5);
  var w1 = petalW * (0.7 + Math.random() * 0.15);
  var w2 = petalW * (0.65 + Math.random() * 0.15);
  var h1 = petalH * (0.55 + Math.random() * 0.1);
  var h2 = petalH * (0.5 + Math.random() * 0.1);

  ctx.beginPath();
  ctx.moveTo(0, petalH * 0.25);
  ctx.bezierCurveTo(-w1, petalH * 0.1, -w1 * 0.6 + wavyOffset, -h1, tipX, -petalH);
  ctx.bezierCurveTo(w2 * 0.6 - wavyOffset, -h2, w2, petalH * 0.05, 0, petalH * 0.25);
  ctx.fill();

  // Edge highlight
  ctx.strokeStyle = 'rgba('+Math.min(255,r+50)+','+Math.min(255,g+30)+','+Math.min(255,b+20)+',0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-w1 * 0.3, petalH * 0.2);
  ctx.quadraticCurveTo(-w1 * 0.5, 0, tipX * 0.5, -petalH * 0.7);
  ctx.stroke();

  // Vein line
  ctx.strokeStyle = 'rgba('+Math.max(0,r-30)+','+Math.max(0,g-20)+','+Math.max(0,b-15)+',0.15)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(0, petalH * 0.2);
  ctx.quadraticCurveTo(petalW * 0.05, petalH * 0.05, tipX * 0.3, -petalH * 0.4);
  ctx.stroke();
}
```

Replace inline petal drawing in both open/closed branches with:
```javascript
drawTulipPetal(ctx, petalH, petalW, depthFactor, pLightness, pWavyOffset);
```

**Commit:** `feat: add petal gradients, edge highlights, vein lines, depth shading`

---

#### Step 6: Texture Caching

**File:** `public/js/scene-init.js` — module level + `createTulips()`

**Add cache at module level (before `createTulips`):**
```javascript
var tulipCache = {};
var TULIP_CACHE_MAX = 50;

function getCachedTulip(color, isOpen) {
  var key = color + '_' + isOpen;
  if (tulipCache[key]) {
    tulipCache[key].lastUsed = Date.now();
    return tulipCache[key].canvas;
  }
  // Evict oldest if at capacity
  var keys = Object.keys(tulipCache);
  if (keys.length >= TULIP_CACHE_MAX) {
    var oldestKey = keys[0];
    var oldestTime = tulipCache[oldestKey].lastUsed;
    for (var i = 1; i < keys.length; i++) {
      if (tulipCache[keys[i]].lastUsed < oldestTime) {
        oldestKey = keys[i];
        oldestTime = tulipCache[keys[i]].lastUsed;
      }
    }
    delete tulipCache[oldestKey];
  }
  var canvas = makeTulipCanvas(160, color, isOpen);
  tulipCache[key] = { canvas: canvas, lastUsed: Date.now() };
  return canvas;
}
```

**In `createTulips()`, replace:**
```javascript
var tex = new THREE.CanvasTexture(makeTulipCanvas(160, color, isOpen));
```
**With:**
```javascript
var cachedCanvas = getCachedTulip(color, isOpen);
var tex = new THREE.CanvasTexture(cachedCanvas);
```

**Commit:** `perf: add tulip texture caching with LRU eviction at 50 entries`

---

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
