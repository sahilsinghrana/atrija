# PRD: Realistic Randomized Tulips

> **ID:** idea-019
> **Category:** 3D Elements
> **Priority:** high
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-05-20

---

## 1. Overview

**One-liner:** Replace abstract oval tulip shapes with realistic, randomized tulip flowers that have proper cup/bloom forms, natural color variety (no yellows), and visible differences between open and closed variants.

**Problem:** Current tulips look like generic colored ovals — they don't resemble real tulips at all. The petal shapes are identical bezier curves rotated around a center, producing a flower-like blob rather than a recognizable tulip. Yellow colors conflict with sunflowers.

**Solution:** Redraw the tulip canvas using proper tulip morphology: elongated cup-shaped petals with pointed tips for closed tulips, wider reflexed petals for open tulips, visible petal veining, and a proper 6-petal tulip structure. Use only non-yellow colors (red, pink, purple, white, orange, coral, etc.) since sunflowers own the yellow space.

---

## 2. User Stories

- As a visitor, I want tulips to look like actual tulips so the garden feels authentic and artistic
- As a visitor, I want each tulip to look unique (different colors, open/closed, slight shape variations) so the field feels natural and hand-painted
- As a visitor, I want to see a mix of closed (cup-shaped) and open (blooming) tulips so the scene feels alive and varied
- As a visitor, I want tulip colors to be distinct from sunflowers so each flower type has its own visual identity

---

## 3. Technical Specification

### 3.1 Architecture

- **File modified:** `public/js/scene-init.js` — `makeTulipCanvas()` function (lines ~355-492)
- **File modified:** `public/js/scene-init.js` — `createTulips()` function (lines ~494-540) — color palette update
- **No new files** — this is a canvas drawing improvement only
- **Dependencies:** None — pure Canvas2D drawing

### 3.2 Implementation Details

#### Step 1: Redraw Closed Tulip (Cup Shape)
- File: `public/js/scene-init.js` — `makeTulipCanvas()`
- What to do:
  - Draw 6 elongated petals arranged in a cup formation
  - Each petal: tall narrow shape with pointed tip, slight outward curve at top
  - Petals overlap naturally (inner 3 visible, outer 3 peeking between)
  - Petal shape: use asymmetric bezier — narrow base, widening to mid, tapering to point
  - Add subtle petal vein line from base to tip
  - Petals should form a rounded cup silhouette (wider at top than base)
  - Inner stamens visible at center (small dark dots)
- Expected outcome: Recognizable closed tulip bud/cup shape

#### Step 2: Redraw Open Tulip (Bloom Shape)
- File: `public/js/scene-init.js` — `makeTulipCanvas()`
- What to do:
  - Draw 6 petals that flare outward and reflex (curve backward) at tips
  - Petals wider than closed variant, with wavy/ruffled edges
  - Petals spread more horizontally, showing full flower face
  - Visible center with dark stamens
  - Each petal slightly different size/angle for natural look
- Expected outcome: Recognizable open/blooming tulip

#### Step 3: Color Palette — Remove All Yellows
- File: `public/js/scene-init.js` — `createTulips()` color array
- What to do:
  - Remove: `#e8a020` (golden yellow), `#d4901a` (amber), `#f0c040` (soft gold)
  - Keep/add: reds, pinks, purples, magentas, corals, oranges (not yellow-orange), white/cream, deep rose
  - New palette (12 colors):
    - `#e84040` — vivid red
    - `#d41a1a` — deep red
    - `#e87020` — orange (red-orange, not yellow-orange)
    - `#f05090` — pink
    - `#c830a0` — magenta
    - `#9040d0` — purple
    - `#e03050` — crimson
    - `#c040b0` — orchid
    - `#f06030` — coral orange
    - `#e05020` — vermillion
    - `#d03070` — rose
    - `#a030c0` — violet
    - `#f08080` — light salmon
    - `#e8a0c0` — pale pink
- Expected outcome: No yellow tulips; all colors distinct from sunflower yellows

#### Step 4: Per-Tulip Randomization
- File: `public/js/scene-init.js` — `makeTulipCanvas()`
- What to do:
  - Randomize petal count: 5-7 petals (not always 6)
  - Randomize petal width variation: ±15% per petal
  - Randomize petal height variation: ±10% per petal
  - Randomize cup openness: closed tulips range from tight bud to slightly open
  - Randomize petal tip curl: open tulips have varying degrees of reflex
  - Randomize center size: stamen cluster varies
  - Add slight color warmth variation per petal (±10% RGB shift)
- Expected outcome: Every tulip looks unique, natural variation

#### Step 5: Petal Rendering Improvements
- File: `public/js/scene-init.js` — `makeTulipCanvas()`
- What to do:
  - Use 3-stop gradient per petal: light edge → base color → dark center
  - Add thin highlight line along petal edge (lighter than base)
  - Add subtle vein line from petal base to mid-point
  - Petal edges: slightly wavy (use small random offsets on bezier control points)
  - Ensure petals behind are darker (depth shading)
- Expected outcome: Petals look 3D and organic, not flat colored shapes

### 3.3 Mobile Considerations

- Canvas size: keep 160px for foreground tulips (already used)
- No shader changes needed — pure Canvas2D
- Tulip count on mobile: 3 (unchanged)
- Scale on mobile: 0.8-1.4 (unchanged from previous fix)
- Performance: Canvas texture generated once per tulip, rendered as sprite — no performance impact

### 3.4 Data Structures

```json
{
  "tulip": {
    "color": "#e84040",
    "isOpen": true,
    "petalCount": 6,
    "petalWidthVar": 0.85,
    "petalHeightVar": 1.1,
    "curlFactor": 0.4,
    "cupOpenness": 0.3
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Tulip canvas renders without error | `tests/3d/tulip-canvas.test.js` | `makeTulipCanvas(160, '#e84040', true)` returns valid canvas |
| Closed tulip has cup shape | `tests/3d/tulip-canvas.test.js` | Canvas has dark center pixels (stamen) surrounded by petal colors |
| Open tulip has wider spread | `tests/3d/tulip-canvas.test.js` | Open tulip canvas has color pixels further from center than closed |
| No yellow in color palette | `tests/3d/tulip-colors.test.js` | `createTulips` color array contains no hex values where R>200 AND G>180 AND B<100 |
| Each tulip gets unique texture | `tests/3d/tulip-randomization.test.js` | Two calls to `makeTulipCanvas` with same params produce different pixel data |
| Tulip sprite visible on mobile scale | `tests/3d/tulip-mobile.test.js` | Sprite scale >= 0.8 on mobile |

### 4.2 Green Phase — Implementation

Implement the 5 steps above in order. Each step should be a separate commit.

### 4.3 Refactor Phase — Optimization

- Reuse canvas for same color/openness combo (texture cache)
- Reduce canvas size for background tulips (80px instead of 160px)
- Batch petal drawing to minimize canvas state changes

---

## 5. Acceptance Criteria

- [ ] Closed tulips look like recognizable tulip buds (cup shape, pointed petals)
- [ ] Open tulips look like blooming tulips (wide, reflexed petals)
- [ ] No tulip uses yellow or yellow-adjacent colors
- [ ] Each tulip has visible petal structure (not a colored blob)
- [ ] At least 12 distinct colors in the palette
- [ ] Per-tulip randomization produces visibly different flowers
- [ ] Petals have gradient shading (light edge → dark center)
- [ ] Works on mobile with 3 tulips at scale 0.8-1.4
- [ ] No frame rate impact (canvas generated once, rendered as sprite)

---

## 6. Dependencies & Risks

**Dependencies:** None — pure Canvas2D drawing, no new libraries

**Risks:**
- Over-detailed petals may not read at small mobile scales → Mitigation: keep petal shapes bold and simple, test at mobile scale early
- Too many canvas textures could use memory → Mitigation: cache textures by (color, isOpen) key
- Color palette may clash with dark background → Mitigation: test all 12 colors against #08080f bg, ensure minimum brightness

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Realistic randomized tulips — proper cup/bloom shapes, 12 non-yellow colors, per-tulip variation",
  "changes": [
    "Redraw tulip canvas with proper petal morphology (pointed cup petals, reflexed bloom petals)",
    "Remove all yellow colors from tulip palette (12 colors: red, pink, purple, magenta, coral, orange, rose, violet, etc.)",
    "Add per-tulip randomization: petal count 5-7, width/height variation, curl factor",
    "Add petal gradients (3-stop), edge highlights, and vein lines",
    "Cache textures by (color, isOpen) for performance"
  ]
}
```
