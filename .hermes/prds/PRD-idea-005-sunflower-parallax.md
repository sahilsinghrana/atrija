# PRD: Sunflower Field Parallax

> **ID:** idea-005  
> **Category:** 3D Elements  
> **Priority:** high  
> **Status:** done  
> **PRD Version:** 1.0  
> **Last Updated:** 2026-05-15

---

## 1. Overview

**One-liner:** Multi-layer parallax for the sunflower field — foreground flowers sway more and are sharper, background flowers sway less and are blurrier, creating depth.

**Problem:** All sunflowers are in a single layer with uniform scale and animation. The scene lacks depth perception — everything feels flat.

**Solution:** Split sunflowers into 3 depth layers (foreground, midground, background). Each layer has different: scale range, sway amplitude, Z-position, and opacity. Foreground flowers are large, sway dramatically, and are close. Background flowers are small, sway subtly, and are far. Camera movement creates natural parallax between layers.

---

## 2. User Stories

- As a visitor, I want the sunflower field to feel deep and immersive so I feel like I'm standing in a real field.
- As a visitor, I want foreground flowers to be larger and more detailed so they draw my eye.
- As a visitor, I want the parallax effect to be subtle and natural so it enhances rather than distracts.

---

## 3. Technical Specification

### 3.1 Architecture

- **File modified:** `public/js/scene-init.js`
- **Modified function:** `createSunflowers(scene, count)` → refactored into layers
- **New function:** `createSunflowerLayer(scene, count, layerConfig)` — creates one depth layer
- **Depends on:** Existing `makeSunflowerCanvas()`, `VanGoghScene` camera

### 3.2 Implementation Details

#### Step 1: Refactor createSunflowers into layered system

Replace the existing `createSunflowers` function:

```javascript
function createSunflowers(scene, totalCount) {
  // Split into 3 depth layers
  var layers = [
    {
      name: 'background',
      count: Math.floor(totalCount * 0.3),
      scaleRange: [0.4, 0.7],
      zRange: [-15, -8],
      yRange: [-1.5, -0.5],
      swayAmp: 0.03,
      swaySpeed: 0.4,
      opacity: 0.5,
      spreadX: 20
    },
    {
      name: 'midground',
      count: Math.floor(totalCount * 0.4),
      scaleRange: [0.7, 1.2],
      zRange: [-10, -3],
      yRange: [-1.0, 0.0],
      swayAmp: 0.06,
      swaySpeed: 0.6,
      opacity: 0.75,
      spreadX: 16
    },
    {
      name: 'foreground',
      count: Math.floor(totalCount * 0.3),
      scaleRange: [1.2, 1.8],
      zRange: [-6, 0],
      yRange: [-0.5, 0.5],
      swayAmp: 0.12,
      swaySpeed: 0.8,
      opacity: 0.95,
      spreadX: 12
    }
  ];

  // Adjust counts for mobile
  if (isMobile) {
    layers.forEach(function(l) {
      l.count = Math.max(1, Math.floor(l.count * 0.6));
      l.scaleRange = [l.scaleRange[0] * 0.8, l.scaleRange[1] * 0.8];
    });
  }

  var tex = new THREE.CanvasTexture(makeSunflowerCanvas(160));

  layers.forEach(function(layer) {
    for (var i = 0; i < layer.count; i++) {
      var s = layer.scaleRange[0] + Math.random() * (layer.scaleRange[1] - layer.scaleRange[0]);
      var sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
        opacity: layer.opacity
      }));
      sprite.scale.set(1.4 * s, 1.8 * s, 1);

      var x = (Math.random() - 0.5) * layer.spreadX;
      var y = layer.yRange[0] + Math.random() * (layer.yRange[1] - layer.yRange[0]);
      var z = layer.zRange[0] + Math.random() * (layer.zRange[1] - layer.zRange[0]);
      sprite.position.set(x, y, z);

      var ph = Math.random() * Math.PI * 2;
      var baseX = x;
      var baseY = y;

      (function(p, bx, by, sa, ss) {
        sprite.userData.animate = function(o, t) {
          o.position.x = bx + Math.sin(t * ss + p) * sa;
          o.position.y = by + Math.sin(t * ss * 0.7 + p) * sa * 0.5;
          o.material.rotation = Math.sin(t * ss * 0.5 + p) * sa * 0.8;
        };
      })(ph, baseX, baseY, layer.swayAmp, layer.swaySpeed);

      scene.add(sprite);
    }
  });
}
```

#### Step 2: Update counts in initScene

```javascript
// In initScene():
var sunflowerCount = isMobile ? 10 : 16; // total across all layers
createSunflowers(scene.scene, sunflowerCount);
```

#### Step 3: Add subtle camera parallax enhancement

The existing camera drift already creates parallax. Enhance it slightly:

```javascript
// In VanGoghScene.animate(), enhance camera drift:
this.camera.position.x = Math.sin(t * 0.15) * 0.6; // was 0.4
this.camera.position.y = 2 + Math.sin(t * 0.1) * 0.35; // was 0.25
```

### 3.3 Mobile Considerations

- Total sunflower count reduced to 10 (from 16 desktop)
- Scale ranges reduced to 80% of desktop
- 3 layers still maintained but with fewer flowers each
- Background layer opacity reduced to 0.4 (less visual clutter on small screen)

### 3.4 Data Structures

```json
{
  "layer": {
    "name": "foreground",
    "count": 5,
    "scaleRange": [1.2, 1.8],
    "zRange": [-6, 0],
    "yRange": [-0.5, 0.5],
    "swayAmp": 0.12,
    "swaySpeed": 0.8,
    "opacity": 0.95,
    "spreadX": 12
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Creates 3 layers | `tests/unit/sunflower-layers.test.js` | `layers.length === 3` |
| Foreground larger than background | `tests/unit/sunflower-layers.test.js` | `fg.scaleRange[0] > bg.scaleRange[1]` |
| Foreground sways more than background | `tests/unit/sunflower-layers.test.js` | `fg.swayAmp > bg.swayAmp` |
| Mobile reduces counts | `tests/unit/sunflower-layers.test.js` | `mobileCount < desktopCount` |
| Total count matches sum of layers | `tests/unit/sunflower-layers.test.js` | `sum(layer.count) === totalCount` |

### 4.2 Green Phase — Implementation

Refactor `createSunflowers()` into layered system, update counts.

### 4.3 Refactor Phase — Optimization

- Use texture LOD (smaller canvas for background layer)
- Reduce geometry complexity for background flowers
- Consider instanced rendering for same-layer flowers

---

## 5. Acceptance Criteria

- [ ] Sunflowers split into 3 depth layers (background, midground, foreground)
- [ ] Foreground flowers are larger (1.2-1.8x) and sway more
- [ ] Background flowers are smaller (0.4-0.7x) and sway less
- [ ] Background flowers are more transparent (0.5 opacity)
- [ ] Parallax effect visible during camera drift
- [ ] Mobile: 10 total flowers, desktop: 16 total
- [ ] No frame rate drops below 30fps on mobile
- [ ] All unit tests pass

---

## 6. Dependencies & Risks

**Dependencies:** Existing `createSunflowers()`, `makeSunflowerCanvas()`, `VanGoghScene` camera drift

**Risks:**
- Too many total flowers could impact mobile FPS → Reduce mobile count, use opacity to hide background
- Parallax may be too subtle → Enhance camera drift amplitude
- Layer boundaries may be visible → Overlap Z-ranges slightly

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Sunflower field parallax — 3 depth layers with scale/sway/opacity variation",
  "changes": [
    "Split sunflowers into background/midground/foreground layers",
    "Foreground: large, opaque, dramatic sway; Background: small, transparent, subtle sway",
    "Enhanced camera drift for visible parallax",
    "Mobile: 10 flowers, Desktop: 16 flowers"
  ]
}
```
