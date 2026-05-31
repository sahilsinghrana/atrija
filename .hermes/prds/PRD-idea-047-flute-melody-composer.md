# PRD: Interactive Flute Melody Composer

> **ID:** idea-047
> **Category:** Interactivity
> **Priority:** medium
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-06-01

---

## 1. Overview

**One-liner:** A pixel-art treble clef staff at the bottom of the screen where visitors can click to place音符 that play synthesized flute tones, creating a playable melody instrument overlaid on the 3D scene.

**Problem:** The existing flute click spawns visual music notes but there's no interactive music-making element. Visitors can't create their own melodies or engage musically beyond the visual effect.

**Solution:** A toggleable pixel-art staff overlay (5-line treble clef) rendered as a lightweight Canvas 2D element at the bottom of the viewport. Clicking on the staff places a note at the nearest line/space, which plays a synthesized flute tone via Web Audio API. Active notes glow and connect to the 3D scene's floating music notes. Notes persist for 5 seconds then fade. A small toggle button (🎼) in the corner activates/deactivates the composer. All client-side — no backend.

---

## 2. User Stories

- As a visitor, I want to click on a musical staff to place notes that play flute tones, so that I can create my own melodies while viewing the 3D scene.
- As a visitor, I want the composer to be toggleable, so that it doesn't obstruct the view when I'm not using it.
- As a visitor, I want placed notes to visually connect with the existing floating music notes in the 3D scene, so the experience feels cohesive.
- As a mobile visitor, I want a simplified single-octave staff, so I can still compose melodies on small screens.

---

## 3. Technical Specification

### 3.1 Architecture

**New files:**
- `public/js/flute-composer.js` — Standalone module, loaded as `<script type="module">` in BaseLayout.astro
- No modifications to `scene-init.js` (sacred)
- No modifications to `index.astro` (injected via BaseLayout)

**Existing modules it depends on:**
- Three.js scene (scene-init.js) — reads position of existing music notes to coordinate visual bursts
- Web Audio API (browser native) — oscillator + gain nodes for flute synthesis
- CSS: styled via inline styles in the Canvas element or a small `<style>` block in the script

**Does NOT use:** Audio files, external libraries, backend API calls

### 3.2 Implementation Details

#### Step 1: Create the staff canvas overlay
- File: `public/js/flute-composer.js`
- What to do:
  - Create a fixed-position `<canvas>` element at the bottom of the viewport (height: 120px desktop, 80px mobile)
  - Render a 5-line treble clef staff using Canvas 2D drawing primitives
  - Style: semi-transparent dark background (`rgba(8,8,15,0.85)`), gold/amber line colors matching `--accent-gold`
  - Draw treble clef symbol at the left using simplified paths
  - Add interval markers for each line/space position (mapped to musical pitches)
- Expected outcome: A beautiful pixel-art staff rendered at the bottom of the screen

#### Step 2: Implement note placement and audio synthesis
- File: `public/js/flute-composer.js`
- What to do:
  - Add click event listener on the canvas
  - Map Y coordinate to nearest staff position (line or space)
  - Map staff position to frequency using a pentatonic scale (C5–C7, 8 notes) — pentatonic ensures any combination sounds pleasant
  - Create Web Audio API oscillator: `type: 'sine'` with a gentle `type: 'triangle'` harmonic overlay
  - Quick attack (0.05s), sustain, release (0.3s) envelope via GainNode
  - Place a Canvas 2D note oval at click position with animated glow
  - Emit a burst of 3D music notes at the nearest existing note position (reuse existing note pool from scene-init.js)
  - Note auto-fades after 5 seconds
- Expected outcome: Clicking the staff plays a flute tone and shows a visual note

#### Step 3: Add toggle button and mobile adaptation
- File: `public/js/flute-composer.js`
- What to do:
  - Create a small floating toggle button (🎼 icon, 40px circle) at bottom-right
  - Toggle staff visibility with a slide-up animation (`transform: translateY(100%)` → `translateY(0)`)
  - Detect mobile viewport (< 768px): reduce to a single-octave staff (5 lines, C5–C6 only)
  - Add `prefers-reduced-motion` check: disable glow animation if set
- Expected outcome: Staff toggles smoothly, adapts to mobile

#### Step 4: Coordinate with 3D scene
- File: `public/js/flute-composer.js`
- What to do:
  - When a note is placed, trigger a burst of 3-5 golden particles emitted from the nearest 3D music note position
  - Particles are lightweight CSS `div` elements with `position: absolute`, not Three.js objects
  - Particles float upward over 3 seconds and fade out
  - Use `getBoundingClientRect()` of the canvas to position particles in screen space
- Expected outcome: Visual connection between 2D staff and 3D scene

### 3.3 Mobile Considerations

- Staff height reduced to 80px on mobile
- Single octave range (C5–C6) to avoid cramped spacing
- Touch events supported (not just click)
- Staff canvas resolution halved on mobile (devicePixelRatio capped at 1)
- Synthesizer voice count limited to 3 simultaneous notes on mobile
- Performance budget: < 1ms per frame (canvas redraw only on interaction)

### 3.4 Data Structures

```json
{
  "staffConfig": {
    "desktop": { "height": 120, "topLineY": 30, "lineSpacing": 12, "noteRadius": 6 },
    "mobile": { "height": 80, "topLineY": 20, "lineSpacing": 10, "noteRadius": 5 }
  },
  "scale": {
    "type": "pentatonic",
    "root": "C5",
    "frequencies": [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5]
  },
  "activeNote": {
    "frequency": 523.25,
    "staffPosition": 2,
    "screenX": 150,
    "screenY": 42,
    "placedAt": 1717200000,
    "duration": 5000
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Staff canvas renders 5 lines | `tests/flute-composer.test.js` | Canvas has 5 horizontal strokes |
| Click maps to nearest staff position | `tests/flute-composer.test.js` | Y→note mapping is correct for all positions |
| Pentatonic scale has 6 frequencies | `tests/flute-composer.test.js` | Scale array length === 6 |
| Web Audio oscillator created on click | `tests/flute-composer.test.js` | AudioContext.createOscillator called once per click |
| Note auto-fades after 5s | `tests/flute-composer.test.js` | Active note removed after 5000ms |
| Toggle button shows/hides staff | `tests/flute-composer.test.js` | Canvas visible class toggles on click |
| Mobile uses single octave | `tests/flute-composer.test.js` | On viewport < 768px, scale limited to C5–C6 |

### 4.2 Green Phase — Implementation

Implement `public/js/flute-composer.js` with:
- `StaffRenderer` class (canvas drawing)
- `FluteSynth` class (Web Audio API)
- `NoteManager` class (placement, fade, coordination)
- Entry point: IIFE that creates canvas, button, and event listeners
- All in one file to avoid build complexity

### 4.3 Refactor Phase — Optimization

- Pool canvas note objects instead of creating/destroying
- Use a single shared AudioContext (lazy init on first click)
- Debounce rapid clicks (min 100ms between notes)
- Reduce particle count on low-end devices (detect via `navigator.hardwareConcurrency`)

---

## 5. Acceptance Criteria

- [ ] Treble clef staff renders at bottom of viewport with 5 lines and clef symbol
- [ ] Clicking any position on staff plays a flute-like tone at the correct pitch
- [ ] Notes placed on staff are visually shown as glowing oval note heads
- [ ] Played notes auto-fade after 5 seconds
- [ ] Toggle button (🎼) shows/hides the staff with smooth slide animation
- [ ] Pentatonic scale ensures any combination of notes sounds pleasant
- [ ] Works on mobile with reduced single-octave staff
- [ ] No modifications to `scene-init.js`
- [ ] No external audio files used (all synthesized via Web Audio API)
- [ ] Respects `prefers-reduced-motion`
- [ ] Max 8 simultaneous notes at any time
- [ ] Performance: no frame drops on mobile (OnePlus Nord CE2 / almonzo-tier hardware)

---

## 6. Dependencies & Risks

**Dependencies:** Web Audio API (available in all modern browsers). No dependencies on existing Three.js modules — purely additive.

**Risks:**
- Web Audio API requires user gesture to start AudioContext → Mitigation: lazy-init AudioContext on first staff click (not on page load)
- Auto-play policies may block audio → Mitigation: only play on explicit user click, no auto-play
- Staff canvas may conflict with existing floating notes → Mitigation: staff positioned at fixed bottom 120px, existing notes float in upper 80% of viewport
- Mobile performance with both Three.js and Canvas 2D → Mitigation: staff canvas uses `requestAnimationFrame` only when visible

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Interactive Flute Melody Composer — clickable staff with synthesized flute tones",
  "changes": [
    "Added public/js/flute-composer.js (standalone module)",
    "Pentatonic scale synthesizer via Web Audio API",
    "Treble clef staff Canvas 2D overlay with toggle button",
    "Coordinated 2D note placement with 3D music note bursts",
    "Mobile-adaptive single-octave staff layout"
  ]
}
```
