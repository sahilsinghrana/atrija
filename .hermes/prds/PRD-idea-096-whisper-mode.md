# PRD: Whisper Mode — Ambient Soundscape Toggle

> **ID:** idea-096
> **Category:** Audio
> **Priority:** medium
> **Status:** backlog
> **PRD Version:** 1.0
**Last Updated:** 2026-06-29

---

## 1. Overview

**One-liter:** A toggle that layers a subtle, generative ambient soundscape (wind, distant crickets, soft drone) beneath the existing flute clicks, deepening the meditative atmosphere.

**Problem:** The site has flute-click audio (bansuri notes) but no continuous ambient layer. The experience can feel sonically "empty" between interactions, especially for visitors who stay and read.

**Solution:** A standalone Web Audio API module that generates a procedural ambient soundscape — no audio files needed. Uses filtered noise for wind, oscillators with slow LFO modulation for a soft drone, and sparse randomized "chirp" events for insect sounds. Volume is near-subtle (default -30dB). A small toggle button (bottom-right, near existing controls) lets users enable/disable. Respects `prefers-reduced-motion` (disabled by default) and `Save-Data` header. Zero scene-init.js changes.

---

## 2. User Stories

- As a visitor, I want to optionally enable a subtle ambient soundscape, so the site feels more immersive and meditative.
- As a visitor, I want the soundscape to be very quiet and non-intrusive, so it doesn't compete with the flute notes or my own music.
- As a visitor on a metered connection, I want audio to never auto-play or download, so I don't waste data.
- As a visitor who finds audio distracting, I want it off by default with a clear toggle to enable.

---

## 3. Technical Specification

### 3.1 Architecture

**New files:**
- `public/js/whisper-mode.js` — Standalone IIFE module using Web Audio API, loaded via `<script>` tag in BaseLayout.astro

**Existing modules it depends on:**
- Web Audio API (browser native, all modern browsers)
- No Three.js dependency
- No audio files — fully procedural

**How it works:**
- On user clicking the toggle button, creates an `AudioContext` (must be created after user gesture per browser policy)
- Builds a node graph:
  - **Wind layer:** White noise → Bandpass filter (200-800Hz) → Gain (0.05) → LFO-modulated filter cutoff for "gusts"
  - **Drone layer:** Two detuned sine oscillators (55Hz, 55.3Hz) → Lowpass filter → Gain (0.02) → Slow tremolo
  - **Chirp layer:** Randomized short sine bursts (2-4kHz, 50-150ms) at 5-15 second intervals → Gain (0.01)
- Master gain defaults to -30dB (near-silent), user can adjust via slider
- Toggle button: small speaker icon (🔇/🔊) in bottom-right cluster
- State persisted in `localStorage`
- Auto-pauses when tab is hidden (Visibility API)
- Auto-pauses when `Save-Data: on` header detected

### 3.2 Implementation Details

#### Step 1: Create the audio engine
- File: `public/js/whisper-mode.js`
- What to do:
  - Create `WhisperEngine` class/object:
    - `init()` — creates AudioContext, builds node graph, starts oscillators
    - `setVolume(db)` — sets master gain
    - `pause()` — suspends AudioContext
    - `resume()` — resumes AudioContext
    - `destroy()` — closes AudioContext, cleans up nodes
  - Wind: `createBufferSource(whiteNoise) → BiquadFilter(bandpass) → Gain(0.05)`
  - Drone: `OscillatorNode(55Hz, sine) + OscillatorNode(55.3Hz, sine) → BiquadFilter(lowpass, 200Hz) → Gain(0.02)`
  - Chirp: `setInterval(random 5-15s)` → creates short `OscillatorNode` with envelope
- Expected outcome: Procedural ambient soundscape with 3 layers

#### Step 2: Create the toggle UI
- File: `public/js/whisper-mode.js`
- What to do:
  - Create a fixed-position button `<button id="whisper-toggle" aria-label="Toggle ambient soundscape">`
  - Position: bottom-right, above footer, left of existing controls
  - Icon: 🔇 (off) / 🔊 (on)
  - On click: init engine or destroy engine
  - When active, show a subtle volume slider (range input, -60dB to -18dB)
  - Slider hidden by default, appears on hover/tap when active
- Expected outcome: Small, unobtrusive toggle with volume control

#### Step 3: Add lifecycle management
- File: `public/js/whisper-mode.js`
- What to do:
  - Listen for `visibilitychange` — pause on hidden, resume on visible
  - Check `navigator.connection.saveData` — if true, never auto-init
  - Check `prefers-reduced-motion` — if true, default to off
  - Store state in `localStorage` (`whisper-enabled`, `whisper-volume`)
  - On page load, read stored preference but DO NOT auto-play (browser policy)
  - Show a subtle "click to enable whisper mode" hint on first visit
- Expected outcome: Respects user preferences and browser policies

### 3.3 Mobile Considerations

- AudioContext creation requires user gesture — toggle button satisfies this
- On mobile, reduce chirp frequency (8-20s intervals) to save battery
- Suspend AudioContext when tab backgrounded (saves ~5% battery/hour)
- Volume slider uses touch-friendly sizing (44px hit target)
- Performance budget: Web Audio API runs on separate thread — near-zero main thread cost

### 3.4 Data Structures

```json
{
  "layers": {
    "wind": { "type": "noise", "filter": "bandpass", "freq": [200, 800], "gain": 0.05 },
    "drone": { "type": "oscillator", "freq": [55, 55.3], "waveform": "sine", "gain": 0.02 },
    "chirp": { "type": "random-burst", "freq": [2000, 4000], "interval": [5000, 15000], "duration": [50, 150], "gain": 0.01 }
  },
  "masterVolume": -30,
  "storageKeys": {
    "enabled": "whisper-enabled",
    "volume": "whisper-volume"
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Engine initializes on user gesture | `tests/unit/whisper-mode.test.js` | After toggle click, AudioContext exists |
| Wind layer produces audio | `tests/unit/whisper-mode.test.js` | Wind node graph has noise source → filter → gain |
| Drone layer has detuned oscillators | `tests/unit/whisper-mode.test.js` | Two oscillators at 55Hz and 55.3Hz |
| Chirp fires at random intervals | `tests/unit/whisper-mode.test.js` | setInterval callback creates oscillator within 5-15s |
| Volume control adjusts master gain | `tests/unit/whisper-mode.test.js` | Setting volume to -20dB updates masterGain.value |
| Pause on tab hidden | `tests/unit/whisper-mode.test.js` | visibilitychange (hidden) calls context.suspend() |
| Resume on tab visible | `tests/unit/whisper-mode.test.js` | visibilitychange (visible) calls context.resume() |
| Save-Data prevents init | `tests/unit/whisper-mode.test.js` | When saveData is true, toggle click does not init |
| Reduced motion defaults off | `tests/unit/whisper-mode.test.js` | When reduced motion, stored state defaults to false |
| localStorage persistence | `tests/unit/whisper-mode.test.js` | Toggle state and volume stored in localStorage |

### 4.2 Green Phase — Implementation

Implement `public/js/whisper-mode.js`:
- `WhisperEngine` with init/setVolume/pause/resume/destroy
- Node graph construction (wind, drone, chirp)
- Toggle button UI with ARIA
- Volume slider
- Lifecycle management (visibility, saveData, reduced motion)
- localStorage persistence

### 4.3 Refactor Phase — Optimization

- Use `AudioWorklet` for noise generation if available (lower CPU)
- Pre-generate noise buffer once, loop it (no per-frame audio generation)
- Debounce volume slider input (update on change, not input)

---

## 5. Acceptance Criteria

- [ ] Toggle button visible in bottom-right control cluster
- [ ] Clicking toggle initializes Web Audio API soundscape
- [ ] Three audio layers: wind, drone, chirp
- [ ] Master volume defaults to -30dB (near-silent)
- [ ] Volume slider allows -60dB to -18dB adjustment
- [ ] Audio pauses when tab is hidden, resumes when visible
- [ ] `Save-Data: on` prevents initialization
- [ ] `prefers-reduced-motion` defaults to off
- [ ] State persisted in localStorage
- [ ] No audio files downloaded — fully procedural
- [ ] No auto-play — requires user gesture to start
- [ ] No modifications to `scene-init.js`
- [ ] Build succeeds
- [ ] Total added code ~180 lines

---

## 6. Dependencies & Risks

**Dependencies:** Web Audio API (all modern browsers). AudioContext requires user gesture (toggle button satisfies this). No external audio files.

**Risks:**
- iOS Safari may suspend AudioContext aggressively → Mitigation: resume on visibility change, handle `state === 'interrupted'`
- Some users may find any audio annoying → Mitigation: off by default, very low volume, easy toggle
- Procedural audio may sound "cheap" → Mitigation: careful tuning of filter frequencies and gain levels, test with real users
- Battery drain on mobile → Mitigation: suspend on tab hidden, low CPU node graph

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Whisper Mode — procedural ambient soundscape toggle",
  "changes": [
    "Added public/js/whisper-mode.js (standalone Web Audio module)",
    "3 procedural layers: wind, drone, chirp",
    "Toggle button with volume slider",
    "Visibility API auto-pause/resume",
    "Save-Data and reduced-motion respect",
    "localStorage persistence",
    "Zero audio files — fully procedural"
  ]
}
```
