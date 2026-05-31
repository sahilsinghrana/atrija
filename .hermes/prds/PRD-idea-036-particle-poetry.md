# PRD: Particle Poetry Scroll Effect

> **ID:** idea-036
> **Category:** Interactivity
> **Priority:** low
> **Status:** backlog
> **PRD Version:** 1.1
> **Last Updated:** 2026-06-01

---

## 1. Overview

**One-liner:** As visitors scroll through content sections, 3D text particles emerge from the section headings and drift into the Three.js scene, forming fleeting philosophical words and phrases before dissolving.

**Problem:** The scroll-driven experience (idea-020) moves the sky and elements, but there's no textual connection between the content being read and the 3D world. The scene and the words feel disconnected.

**Solution:** When a content section enters the viewport, extract key words from the section's heading and intro text, then spawn them as 3D `TextGeometry` or `Sprite` objects in the Three.js scene. Words float upward and outward, fading over 4-6 seconds. Each section has its own word palette drawn from the section's theme. The effect is purely visual — no audio, no interaction required.

---

## 2. User Stories

- As a visitor, I want to see words from the text I'm reading float into the 3D scene so that the content feels alive and connected to the visual world.
- As a visitor, I want the word particles to be subtle and non-distracting so that they enhance rather than interrupt the reading experience.
- As a visitor on mobile, I want fewer word particles so that the effect doesn't overwhelm the smaller screen or hurt performance.

---

## 3. Technical Specification

### 3.1 Architecture

**New files:**
- `public/js/particle-poetry.js` — Word extraction, 3D text sprite creation, animation, fade logic
- `src/tests/particle-poetry.test.js` — Unit tests

**Modified files:**
- `public/js/scene-init.js` — Import and initialize particle poetry module (single `import` + `initParticlePoetry()` call). **Minimal change — only 2 lines added.**

**Dependencies:**
- Three.js (already loaded)
- `content.json` section headings and intros (for word extraction)
- Existing scroll position tracking (from idea-020 scroll-driven sky)
- Font data (Inter font already loaded via Google Fonts)

### 3.2 Implementation Details

#### Step 1: Word extraction from content
- File: `public/js/particle-poetry.js`
- What to do:
  - Import section text from `content.json` (via fetch or inline JSON)
  - For each section, extract "poetry words": filter out common words (the, a, an, is, of, etc.), keep words with 4+ characters
  - Assign each section a word pool of 8-12 words
  - Map sections to scroll trigger points (e.g., moon section triggers at scroll 0.1, philosophy at 0.3, etc.)
- Expected outcome: A data structure mapping scroll positions to word pools

#### Step 2: Create 3D text sprites
- File: `public/js/particle-poetry.js`
- What to do:
  - Use `CanvasTexture` + `Sprite` approach (not TextGeometry — too expensive for many instances)
  - For each word spawn: create an off-screen canvas, render the word in Inter font at 48px, create `CanvasTexture`, create `Sprite` with that texture
  - Sprite material: `SpriteMaterial({ map: texture, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending })`
  - Position sprites at the section heading's screen position, projected into 3D space
  - Give each sprite a random velocity vector (upward + slight horizontal drift)
  - Add to a `particlePoetryGroup` in the scene
- Expected outcome: Words appear as floating sprites in the 3D scene

#### Step 3: Animate and fade
- File: `public/js/particle-poetry.js`
- What to do:
  - In the update loop, move each sprite by its velocity
  - Fade opacity over lifetime: `opacity = 1.0 - (age / maxAge)` where `maxAge = 5 seconds`
  - Scale down slightly as they age: `scale = 1.0 - (age / maxAge) * 0.3`
  - Remove sprites when `age > maxAge` and dispose texture/material
  - Limit max concurrent sprites: 25 desktop, 12 mobile
  - Spawn rate: max 2 sprites per second per active section
- Expected outcome: Words float upward, fade, and disappear naturally

#### Step 4: Initialize from scene-init.js
- File: `public/js/scene-init.js`
- What to do:
  - Add `import { initParticlePoetry, updateParticlePoetry } from './particle-poetry.js';`
  - Call `initParticlePoetry(scene, camera, contentData);` in init
  - Call `updateParticlePoetry(time, deltaTime, scrollPos);` in animation loop
- Expected outcome: Particle poetry activates as user scrolls

### 3.3 Mobile Considerations

- Max concurrent sprites: 12 (vs 25 desktop)
- Smaller canvas texture size: 128×32 (vs 256×64 desktop)
- Reduced spawn rate: 1 per second (vs 2 per second)
- Use `window.innerWidth < 768` for mobile detection
- Performance budget: Canvas texture creation is the expensive part — pre-render textures for the word pool on init rather than at spawn time

### 3.4 Data Structures

```json
{
  "particlePoetry": {
    "desktop": { "maxSprites": 25, "spawnRate": 2, "maxAge": 5.0, "textureSize": [256, 64] },
    "mobile": { "maxSprites": 12, "spawnRate": 1, "maxAge": 4.0, "textureSize": [128, 32] },
    "sections": [
      {
        "id": "moon",
        "triggerScroll": 0.1,
        "words": ["luminous", "orbit", "tidal", "silver", "eclipse", "crescent", "radiance", "night"]
      },
      {
        "id": "philosophy",
        "triggerScroll": 0.3,
        "words": ["consciousness", "existence", "truth", "beauty", "soul", "wisdom", "being", "mind"]
      }
    ]
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Word extraction filters common words | `tests/particle-poetry.test.js` | `"the moon is bright"` → `["moon", "bright"]` |
| Section word pools have 8-12 words | `tests/particle-poetry.test.js` | `wordPool.length >= 8 && <= 12` |
| Sprite creation uses CanvasTexture | `tests/particle-poetry.test.js` | `sprite.material.map.isCanvasTexture === true` |
| Sprites fade over lifetime | `tests/particle-poetry.test.js` | `opacity < 1.0` after 2.5s with maxAge 5s |
| Max sprite limit enforced | `tests/particle-poetry.test.js` | Active sprites never exceed limit |
| Mobile uses reduced counts | `tests/particle-poetry.test.js` | `maxSprites === 12` when mobile |

### 4.2 Green Phase — Implementation

Create `public/js/particle-poetry.js` with `initParticlePoetry(scene, camera, contentData)` and `updateParticlePoetry(time, deltaTime, scrollPos)` exports. Use CanvasTexture + Sprite approach for performance.

### 4.3 Refactor Phase — Optimization

- Pre-render all word textures during init (avoid runtime canvas creation)
- Object pooling for sprites (reuse disposed sprites instead of creating new ones)
- Use `SharedArrayBuffer` for word texture atlas (single texture, UV offset per sprite)
- Reduce draw calls by batching sprites with same texture

---

## 5. Acceptance Criteria

- [ ] Words from each section appear as 3D sprites when that section scrolls into view
- [ ] Sprites float upward and fade over 4-6 seconds
- [ ] Max 25 concurrent sprites on desktop, 12 on mobile
- [ ] No frame rate drops below 30fps on mobile
- [ ] Words are extracted from actual content.json section text
- [ ] Effect is subtle and doesn't obstruct reading
- [ ] All unit tests pass
- [ ] No modifications to scene-init.js beyond 2 import/init lines
- [ ] Build passes (`npm run build` exit code 0)

---

## 6. Dependencies & Risks

**Dependencies:**
- Three.js Sprite, SpriteMaterial, CanvasTexture (all core Three.js)
- `content.json` must be fetchable at runtime (already served as static JSON)
- Inter font must be loaded before text rendering (already loaded via Google Fonts in BaseLayout)

**Risks:**
- Canvas texture creation at runtime can cause jank → Mitigation: pre-render all textures during init
- Too many sprites could impact fill rate on low-end GPUs → Mitigation: strict sprite limit, additive blending is cheap
- Word extraction might produce odd words from formatted text → Mitigation: strip HTML tags before extraction, use a curated stop-word list
- Text rendering in canvas may not match site font exactly → Mitigation: use system fallback font if Inter isn't loaded yet, or wait for `document.fonts.ready`

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Particle poetry: 3D word sprites emerge from content sections as you scroll",
  "changes": [
    "Added public/js/particle-poetry.js module",
    "CanvasTexture + Sprite approach for performant 3D text particles",
    "Word extraction from content.json section headings and intros",
    "Per-section word pools with scroll-triggered spawning",
    "25 sprites desktop / 12 mobile, additive blending, 5s lifetime",
    "Integrated into scene-init.js with minimal 2-line addition"
  ]
}
```

---

## Reviewer Notes (2026-05-24)

**Quality Check**: Well-structured PRD. The CanvasTexture + Sprite approach is the right performance choice over TextGeometry. Good word extraction logic with stop-word filtering.

**Design Alignment**: This bridges the content and 3D worlds elegantly — words from the text becoming part of the visual scene is very impressionist in spirit. The per-section word pools add thematic coherence.

**Feasibility**: The `content.json` fetch at runtime needs to use a relative path (`/content/content.json`) since it's served as a static asset. Pre-rendering word pools at build time via the Astro component frontmatter would be even better — avoids the runtime fetch entirely.

**Risk**: Canvas texture creation at runtime can cause jank. The PRD correctly identifies pre-rendering as the mitigation. Implement this during the Green phase, not as a refactor.

**Scope**: Low priority is appropriate. The 2-line scene-init.js integration is minimal.

---

## Reviewer Notes (2026-06-01)

**Priority Adjustment**: Changed from `medium` → `low`. This is a nice-to-have visual effect that depends on scroll-driven content reading. It should not take priority over core 3D elements or performance fixes.

**Status**: Backlog — no implementation attempted. Ready for pickup.
