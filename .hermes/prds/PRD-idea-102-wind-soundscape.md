# PRD: Procedural Wind Sound Layer

> **ID:** idea-102
> **Category:** Audio
> **Priority:** low
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-07-08

---

## 1. Overview

**One-liner:** Add an optional wind soundscape layer that can be toggled independently, using the Web Audio API to generate procedural wind tones without audio files.

**Problem:** The site has a flute click (idea-010) but no ambient background. Users may appreciate a subtle wind sound that complements the 3D scene's impressionist aesthetic. Currently, the Whisper Mode PRD (idea-096) covers this but is on backlog and broader in scope.

**Solution:** Create `public/js/wind-soundscape.js` — a standalone module that generates wind via Web Audio's noise buffer + low-pass filter modulation. Toggle via Shift+W. Resides at -30dB (inaudible but perceptible). Respects `prefers-reduced-motion` and `Save-Data`. No audio files needed.

---

## 2. User Stories

- As a meditative user, I want subtle wind to enhance the contemplative atmosphere.
- As a user with `prefers-reduced-motion`, I want audio disabled automatically.
- As a mobile user, I want audio to pause when the tab is hidden.

---

## 3. Technical Specification

### 3.1 Architecture

- **Module:** `public/js/wind-soundscape.js` — Standalone IIFE
- **API:** Web Audio API (OscillatorNode + AudioBufferSourceNode for noise)
- **Toggle:** Shift+W keyboard shortcut
- **Storage:** `sessionStorage` for mute state
- **Lifecycle:** Pauses on `visibilitychange`, respects `Save-Data` header

### 3.2 Implementation Details

```javascript
// public/js/wind-soundscape.js
(function() {
  'use strict';
  
  // Check for reduced motion / save-data
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = matchMedia('(prefers-reduced-data: reduce)').matches;
  if (reduced || saveData) return; // Silent no-op
  
  let audioCtx, windNode, gainNode, isPlaying = false;
  const KEY = 'atrija-wind-muted';
  
  function initAudio() {
    if (audioCtx) return audioCtx;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // Create noise buffer (2-second white noise)
    const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 2, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    // Loop noise with modulated gain
    windNode = audioCtx.createBufferSource();
    windNode.buffer = buffer;
    windNode.loop = true;
    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.03; // -30dB
    // Low-pass filter sweeping for wind effect
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    windNode.connect(filter).connect(gainNode).connect(audioCtx.destination);
    return audioCtx;
  }
  
  function toggle() {
    if (reduced || saveData) return;
    if (!isPlaying) {
      initAudio();
      windNode.start();
      isPlaying = true;
    } else {
      windNode.stop();
      isPlaying = false;
    }
  }
  
  // Keyboard toggle
  document.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.key === 'W') {
      toggle();
    }
  });
  
  // Pause on hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && isPlaying) {
      windNode.stop();
      isPlaying = false;
    }
  });
})();
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| AudioContext created on first toggle | `tests/unit/wind-soundscape.test.js` | `audioCtx instanceof AudioContext` |
| Noise buffer connects correctly | `tests/unit/wind-soundscape.test.js` | `windNode.loop === true` |
| Respects prefers-reduced-motion | `tests/unit/wind-soundscape.test.js` | No audioContext when reduced motion |
| Respects Save-Data | `tests/unit/wind-soundscape.test.js` | No audioContext when Save-Data |
| Shift+W toggles playback | `tests/unit/wind-soundscape.test.js` | `isPlaying` toggles on key event |
| Pauses on visibility change | `tests/unit/wind-soundscape.test.js` | `isPlaying === false` when hidden |

### 4.2 Green Phase — Implementation

- Create wind-soundscape.js module
- Load in index.astro via `<script is:inline src="/js/wind-soundscape.js">`

### 4.3 Refactor Phase — Optimization

- Use `AnalyserNode` for smoother gain modulation
- Add fade in/out on toggle

---

## 5. Acceptance Criteria

- [ ] Wind soundscape plays when toggled via Shift+W
- [ ] Default gain is -30dB (barely perceptible)
- [ ] Respects `prefers-reduced-motion` (disabled by default)
- [ ] Respects `Save-Data` (disabled by default)
- [ ] Auto-pauses on tab visibility hidden
- [ ] No audio files required
- [ ] All unit tests pass

---

## 6. Dependencies & Risks

**Dependencies:** Web Audio API support, no external libraries.

**Risks:** Audio may not work on iOS without user gesture. Use resume() on key press.

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Added procedural wind soundscape layer via Web Audio API with Shift+W toggle"
}
```