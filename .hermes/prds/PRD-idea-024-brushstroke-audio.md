# PRD: Scroll-Responsive Brushstroke Sound Effects

> **ID:** idea-024
> **Category:** Audio
> **Priority:** medium
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-05-18

---

## 1. Overview

**One-liner:** Generative brushstroke sound effects that play in response to scroll velocity, creating an immersive "painting" audio layer.

**Problem:** The site is visually rich but sonically sparse — the flute click (idea-010) is the only active audio feature. Ambient music (idea-004) was cancelled. Visitors experience the impressionist visuals without any corresponding audio texture.

**Solution:** Use the Web Audio API to generate procedural brushstroke sounds (filtered noise bursts) triggered by scroll events. The faster the user scrolls, the more frequent and intense the sounds. A small audio toggle (speaker icon) lets users mute/unmute. All sounds are synthesized — no audio files needed.

---

## 2. User Stories

- As a visitor, I want to hear subtle brushstroke sounds when I scroll so that the experience feels more immersive and painterly.
- As a visitor, I want the sound intensity to match my scroll speed so it feels natural and responsive.
- As a visitor, I want to mute the sounds easily since I may be in a quiet environment.
- As a visitor, I want the audio to start only after I interact with the page (browser autoplay policy compliance).

---

## 3. Technical Specification

### 3.1 Architecture

- **New file:** `public/js/brushstroke-audio.js` — Standalone Web Audio API module
- **Modified file:** `src/layouts/BaseLayout.astro` — Add the audio toggle button and `<script>` import
- **No server-side changes** — all audio is client-side synthesized
- **No Three.js dependency** — pure Web Audio API

### 3.2 Implementation Details

#### Step 1: Create the brushstroke-audio.js module
- File: `public/js/brushstroke-audio.js`
- What to do:
  - **AudioContext setup:** Create `AudioContext` on first user interaction (click/touch/scroll) to comply with browser autoplay policy. Use `audioContext.resume()` on interaction.
  - **Brushstroke sound synthesis:**
    1. Create a `BufferSource` with a 50-150ms white noise burst
    2. Apply a `BiquadFilter` (bandpass, center frequency ~2000-4000Hz, Q=1.5) to shape it like a brush on canvas
    3. Apply a `GainNode` with a quick attack (5ms) and decay (80-120ms) envelope
    4. Optional: add a subtle `ConvolverNode` with a short impulse response for "room" feel (can skip for v1)
  - **Scroll listener:**
    1. Listen to `wheel` and `touchmove` events
    2. Calculate scroll velocity (deltaY per event, or use a rolling average)
    3. Map velocity to sound parameters:
       - Low velocity (< 50 px/event): single quiet brushstroke, gain 0.05
       - Medium velocity (50-200): normal brushstroke, gain 0.1
       - High velocity (> 200): rapid brushstrokes, gain 0.15, shorter interval
    4. Throttle: minimum 60ms between sounds to avoid audio overload
    5. Randomize filter frequency slightly (±300Hz) per stroke for natural variation
  - **State management:**
    - `isEnabled` flag (default: `true` after first interaction)
    - `isMuted` flag (default: `false`)
    - Persist mute state in `localStorage.getItem('van-gogh-audio-muted')`
  - **Cleanup:** Remove event listeners on page unload; close AudioContext
- Expected outcome: Scroll-responsive brushstroke sounds that feel natural and non-intrusive

#### Step 2: Add the audio toggle button to BaseLayout.astro
- File: `src/layouts/BaseLayout.astro`
- What to do:
  - Add a small audio toggle button (🔊 / 🔇) near the flute button area (bottom-left, offset vertically)
  - Button should be 44×44px minimum, matching the flute button's visual style
  - On click, toggle `brushstrokeAudio.toggleMute()` and update the icon
  - Button should be hidden until the AudioContext is initialized (first interaction), then fade in
- Expected outcome: Users can mute/unmute the brushstroke audio

#### Step 3: Add CSS for the audio toggle
- File: Inject from JS or add to existing CSS
- What to do:
  - Style the audio toggle button to match the flute button aesthetic
  - Position: bottom-left, 16px from left, 80px above flute button (or 66px from bottom)
  - Fade-in animation when first shown (300ms ease)
- Expected outcome: Consistent visual design

### 3.3 Mobile Considerations

- On mobile:
  - Listen to `touchmove` events in addition to `wheel`
  - Reduce max gain to 0.12 (mobile speakers are closer to ears)
  - Increase minimum interval to 80ms (mobile scroll events fire faster)
  - Respect the device's silent mode where possible (check `navigator.userAgent` for iOS — on iOS, AudioContext requires explicit user gesture)
- Performance budget: Web Audio API is lightweight; noise buffer is ~44100 samples (1 second) reused for all strokes. Max ~15 audio nodes active at any time.

### 3.4 Data Structures

```json
{
  "audioConfig": {
    "bandpassCenterHz": 3000,
    "bandpassQ": 1.5,
    "minIntervalMs": 60,
    "velocityThresholds": {
      "low": 50,
      "medium": 200
    },
    "gainLevels": {
      "low": 0.05,
      "medium": 0.1,
      "high": 0.15
    },
    "strokeDurationMs": {
      "min": 50,
      "max": 150
    }
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| AudioContext created on interaction | `tests/brushstroke-audio.test.js` | `audioContext.state` is `running` after simulated click |
| Scroll triggers sound | `tests/brushstroke-audio.test.js` | After dispatching `wheel` event with deltaY=100, at least one `BufferSource` was started |
| Mute toggle works | `tests/brushstroke-audio.test.js` | After `toggleMute()`, `isMuted` is `true` and no sounds play on scroll |
| Throttle prevents audio overload | `tests/brushstroke-audio.test.js` | 10 rapid scroll events (10ms apart) produce ≤ 3 sounds |
| localStorage persistence | `tests/brushstroke-audio.test.js` | After muting and reloading, `localStorage.getItem('van-gogh-audio-muted')` is `'true'` |
| Velocity-to-gain mapping | `tests/brushstroke-audio.test.js` | deltaY=300 produces higher gain than deltaY=30 |

### 4.2 Green Phase — Implementation

- Implement `brushstroke-audio.js` with AudioContext, noise synthesis, scroll listener, throttle, and mute toggle
- Add toggle button to `BaseLayout.astro`
- Verify all 6 tests pass

### 4.3 Refactor Phase — Optimization

- Pre-generate the noise buffer once and reuse (avoid re-allocating per stroke)
- Add a subtle stereo pan based on scroll direction (left channel for upward scroll, right for downward)
- Consider adding a "volume" slider in the toggle panel (low/medium/high)

---

## 5. Acceptance Criteria

- [ ] Brushstroke sounds play when the user scrolls the page
- [ ] Sound intensity increases with scroll velocity
- [ ] Sounds are throttled to avoid audio overload (max ~15 per second)
- [ ] A mute/unmute toggle button is visible after first interaction
- [ ] Mute state persists across page reloads via localStorage
- [ ] Audio works on mobile (touchmove events, reduced gain)
- [ ] Complies with browser autoplay policy (no sound before user interaction)
- [ ] All 6 unit tests pass
- [ ] No console errors; AudioContext cleanup on page unload

---

## 6. Dependencies & Risks

**Dependencies:**
- Web Audio API (supported in all modern browsers)
- User interaction to initialize AudioContext (browser autoplay policy)

**Risks:**
- **Autoplay policy:** Some browsers (especially iOS Safari) require a direct user gesture to resume AudioContext. Mitigation: show a subtle "tap to enable audio" prompt on first visit, or initialize on the first scroll/touch event.
- **Audio fatigue:** Continuous brushstroke sounds could become annoying. Mitigation: keep gain low (max 0.15), use natural-sounding filtering, and make the mute button prominent.
- **Performance on low-end devices:** Web Audio API is generally fast, but generating many nodes could cause glitches. Mitigation: reuse a single noise buffer, limit concurrent nodes to 5, and use throttling.

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Scroll-responsive brushstroke sound effects — generative Web Audio API synthesis",
  "changes": [
    "Added public/js/brushstroke-audio.js module",
    "Procedural brushstroke sounds via filtered noise bursts",
    "Scroll velocity maps to sound intensity and frequency",
    "Mute/unmute toggle button in BaseLayout.astro",
    "localStorage persistence for mute state",
    "Mobile-optimized with touchmove support and reduced gain"
  ]
}
```
