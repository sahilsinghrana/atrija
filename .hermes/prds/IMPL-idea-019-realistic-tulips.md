# Technical Implementation Plan: Realistic Randomized Tulips

> **PRD:** idea-019 v1.1
> **File:** `public/js/scene-init.js`
> **Scope:** Rewrite `makeTulipCanvas()` + update `createTulips()`
> **Estimated commits:** 6 (one per step)

---

## Pre-Implementation Notes

**Current file structure (relevant section):**
- `makeTulipCanvas(size, color, isOpen)` — lines ~354-492
- `createTulips(scene, count)` — lines ~494-542
- Both functions are self-contained; no other code depends on their internals

**Canvas coordinate system:** 160×160px, origin at top-left
- `cx, cy` = center of flower head (80, ~61)
- `headR` = ~38px radius of flower head area
- Stem draws from head bottom to canvas bottom

**Three.js integration:** Canvas → `CanvasTexture` → `THREE.SpriteMaterial` → `THREE.Sprite`

---

## Step 1: Remove Yellow Colors from Palette

**File:** `public/js/scene-init.js`, function `createTulips()`

**Change:** Replace the `colors` array (currently 16 colors including 3 yellows) with a 14-color non-yellow palette.

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

**Validation:** After change, no color should satisfy `G > 180 && R > 200 && B < 100`.

**Commit:** `fix: remove yellow colors from tulip palette (14 non-yellow colors)`

---

## Step 2: Rewrite Closed Tulip (Cup/Bud Shape)

**File:** `public/js/scene-init.js`, function `makeTulipCanvas()`

**Replace:** The entire petal drawing section for the `isOpen === false` branch.

### 2A: Petal Shape — Asymmetric Pointed Tulip Petal

The current symmetric bezier oval produces a blob. Replace with asymmetric pointed petal:

```javascript
// Asymmetric pointed tulip petal
var tipOffset = petalW * 0.1 * (Math.random() - 0.5);  // slight tip asymmetry
var w1 = petalW * (0.7 + Math.random() * 0.15);  // left control width
var w2 = petalW * (0.65 + Math.random() * 0.15); // right control width (different!)
var h1 = petalH * (0.55 + Math.random() * 0.1);  // left control height
var h2 = petalH * (0.5 + Math.random() * 0.1);   // right control height

ctx.moveTo(0, petalH * 0.25);  // base center
ctx.bezierCurveTo(-w1, petalH * 0.1, -w1 * 0.6, -h1, tipOffset, -petalH);
ctx.bezierCurveTo(w2 * 0.6, -h2, w2, petalH * 0.05, 0, petalH * 0.25);
```

### 2B: Petal Arrangement — Cup Formation

Current: All petals at same angle spread, same height. Replace with layered cup:

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
  // ... draw petal with depth shading
}
```

### 2C: Silhouette Requirements

- **Height > Width** (tall cup shape)
- Pointed tips visible at top
- Wider at top than at base
- Inner petals visible through gaps

**Commit:** `feat: redraw closed tulip with asymmetric cup-shaped petals`

---

## Step 3: Rewrite Open Tulip (Bloom Shape)

**File:** `public/js/scene-init.js`, function `makeTulipCanvas()`

**Replace:** The `isOpen === true` branch.

### 3A: Petal Shape — Wide Reflexed Petal

```javascript
var reflexAmount = 0.2 + Math.random() * 0.6;
var petalH = headR * (0.7 + Math.random() * 0.15);
var petalW = headR * (0.4 + Math.random() * 0.15); // wider than closed
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

### 3B: Petal Arrangement — Flat Star Pattern

```javascript
var petalCount = 5 + Math.floor(Math.random() * 3);
var reflexAmount = 0.2 + Math.random() * 0.6;

for (var p = 0; p < petalCount; p++) {
  var angle = (p / petalCount) * Math.PI * 2 - Math.PI / 2;
  var depthFactor = (p % 2 === 0) ? 0.85 : 1.0;
  var spreadR = headR * 0.3; // wider spread than closed
  // ... draw petal with reflex
}
```

### 3C: Silhouette Requirements

- **Width > Height** (wide open flower)
- Petals spread in star pattern
- Gaps between petals visible
- Tips point outward/upward (reflexed)

**Commit:** `feat: redraw open tulip with wide reflexed bloom petals`

---

## Step 4: Per-Tulip Randomization

**File:** `public/js/scene-init.js`, function `makeTulipCanvas()`

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

## Step 5: Petal Rendering Improvements

**File:** `public/js/scene-init.js`, function `makeTulipCanvas()`

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

**Replace inline petal drawing in both branches with:**
```javascript
drawTulipPetal(ctx, petalH, petalW, depthFactor, pLightness, pWavyOffset);
```

**Commit:** `feat: add petal gradients, edge highlights, vein lines, depth shading`

---

## Step 6: Texture Caching

**File:** `public/js/scene-init.js`, function `createTulips()`

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

## Complete Function Signatures (After All Changes)

```javascript
// Module-level
var tulipCache = {};
var TULIP_CACHE_MAX = 50;
function getCachedTulip(color, isOpen) { /* ... */ }
function drawTulipPetal(ctx, petalH, petalW, depthFactor, lightness, wavyOffset) { /* ... */ }

function makeTulipCanvas(size, color, isOpen) {
  // 1. Parse color to RGB
  // 2. Per-tulip randomization (petalCount, curlFactor, widthVar, etc.)
  // 3. Apply warmth shift to RGB
  // 4. Draw stem + leaves (keep existing)
  // 5. Draw petals using drawTulipPetal() helper
  //    - Closed: cup formation, inner/outer layers, depth shading
  //    - Open: star pattern, reflexed petals, wavy edges
  // 6. Draw stamen + pollen (keep existing)
  return c;
}

function createTulips(scene, count) {
  // 1. 14-color non-yellow palette
  // 2. For each tulip:
  //    - color = random from palette
  //    - isOpen = Math.random() > 0.5
  //    - canvas = getCachedTulip(color, isOpen)
  //    - tex = new THREE.CanvasTexture(canvas)
  //    - sprite = new THREE.Sprite with tex
  //    - position, scale, animate
  // 3. scene.add(sprite)
}
```

---

## Testing Strategy

### Visual Testing (Primary)
Use `browser_vision` to verify after each step:

1. **Closed tulip** — cup shape, pointed tips, height > width
2. **Open tulip** — wide bloom, reflexed petals, width > height
3. **Color variety** — multiple colors visible, no yellows
4. **Mobile viewport** — 3 tulips visible at mobile scale
5. **Desktop viewport** — 6 tulips, all different colors/shapes

### Unit Tests
```javascript
// tests/3d/tulip-canvas.test.js
test('makeTulipCanvas returns valid canvas', () => {
  const c = makeTulipCanvas(160, '#e84040', true);
  expect(c).toBeInstanceOf(HTMLCanvasElement);
});

// tests/3d/tulip-colors.test.js
test('no yellow in palette', () => {
  const colors = getTulipColors();
  colors.forEach(hex => {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    expect(!(g > 180 && r > 200 && b < 100)).toBe(true);
  });
});

// tests/3d/tulip-cache.test.js
test('cache returns same canvas for same key', () => {
  const c1 = getCachedTulip('#e84040', true);
  const c2 = getCachedTulip('#e84040', true);
  expect(c1).toBe(c2);
});
```

---

## Deployment Checklist

For each step:
```bash
cd /root/projects/van-gogh-site
npm run build
BUILD_VERSION=$(date +%s)
sed -i "s/BUILD_VERSION/$BUILD_VERSION/g" dist/index.html
cp -r dist/* /data/data/com.termux/files/usr/share/nginx/html/
git add -A && git commit -m "step N: description" && git push origin master
```

- [ ] Step 1: Remove yellows — verify no yellow tulips
- [ ] Step 2: Closed tulip rewrite — verify cup shape (height > width)
- [ ] Step 3: Open tulip rewrite — verify bloom shape (width > height)
- [ ] Step 4: Randomization — verify variety across page loads
- [ ] Step 5: Rendering — verify gradients, highlights, veins
- [ ] Step 6: Texture cache — verify no FPS drop
- [ ] Final: Mobile — 3 tulips visible, scale 0.8-1.4
- [ ] Final: Desktop — 6 tulips, all different
