# PRD: Ambient Music Generator

> **ID:** idea-004  
> **Category:** Audio  
> **Priority:** high  
> **Status:** backlog  
> **PRD Version:** 1.0  
> **Last Updated:** 2026-05-15

---

## 1. Overview

**One-liner:** Procedural ambient music using the Web Audio API — flute-like tones that respond to scroll position and time of day, creating an evolving soundscape.

**Problem:** The site is visually rich but has no audio dimension. The flute visual suggests music, but there's none. This is a missed opportunity for immersion.

**Solution:** Create a generative ambient music system using Web Audio API oscillators, filters, and reverb. The music uses pentatonic scales (flute-like), responds to scroll depth (higher pitch/brightness as you scroll), and has a day/night timbral variation. Users can toggle it on/off with a speaker icon. Audio only starts after user interaction (browser autoplay policy).

---

## 2. User Stories

- As a visitor, I want ambient music to start when I click a speaker icon so I control when audio plays.
- As a visitor, I want the music to respond to my scroll position so it feels connected to the content.
- As a visitor, I want the music to be calming and non-repetitive so it enhances rather than distracts.
- As a mobile user, I want the audio to pause when I switch tabs so it doesn't drain battery.

---

## 3. Technical Specification

### 3.1 Architecture

- **New file:** `public/js/ambient-audio.js` — self-contained audio engine
- **File modified:** `src/layouts/BaseLayout.astro` — add speaker toggle button
- **File modified:** `src/pages/index.astro` — add audio init script
- **No external dependencies** — pure Web Audio API
- **Pentatonic scale:** C D E G A (and octaves) — sounds flute-like, always harmonious

### 3.2 Implementation Details

#### Step 1: Create the ambient audio engine

```javascript
// public/js/ambient-audio.js
var AmbientAudio = (function() {
  var ctx = null;
  var masterGain = null;
  var reverbGain = null;
  var dryGain = null;
  var oscillators = [];
  var isPlaying = false;
  var scrollDepth = 0; // 0.0 to 1.0
  var baseFrequencies = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]; // C4-C5 pentatonic

  function createReverb(ctx) {
    var convolver = ctx.createConvolver();
    var rate = ctx.sampleRate;
    var length = rate * 2.5; // 2.5 second reverb
    var impulse = ctx.createBuffer(2, length, rate);
    for (var channel = 0; channel < 2; channel++) {
      var data = impulse.getChannelData(channel);
      for (var i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
      }
    }
    convolver.buffer = impulse;
    return convolver;
  }

  function createDrone(freq, detune) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    var filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.detune.value = detune || 0;

    filter.type = 'lowpass';
    filter.frequency.value = 800;
    filter.Q.value = 1;

    gain.gain.value = 0;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dryGain);
    gain.connect(reverbGain);

    osc.start();

    return { osc: osc, gain: gain, filter: filter, baseFreq: freq };
  }

  function createMelodyNote(freq, startTime, duration) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    var filter = ctx.createBiquadFilter();

    osc.type = 'triangle'; // flute-like
    osc.frequency.value = freq;

    filter.type = 'lowpass';
    filter.frequency.value = 1200 + scrollDepth * 800; // brighter when scrolled

    var attack = 0.3;
    var release = 1.5;
    var vol = 0.08;

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(vol, startTime + attack);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dryGain);
    gain.connect(reverbGain);

    osc.start(startTime);
    osc.stop(startTime + duration + release);
  }

  function scheduleMelody() {
    if (!isPlaying) return;

    var now = ctx.currentTime;
    var noteDuration = 2.5 + Math.random() * 3;
    var numNotes = 2 + Math.floor(Math.random() * 3);

    for (var i = 0; i < numNotes; i++) {
      var freqIndex = Math.floor(Math.random() * baseFrequencies.length);
      var freq = baseFrequencies[freqIndex];
      var startTime = now + i * (noteDuration * 0.6) + Math.random() * 0.5;
      createMelodyNote(freq, startTime, noteDuration);
    }

    // Schedule next melody burst
    var nextBurst = 4000 + Math.random() * 8000; // 4-12 seconds
    setTimeout(scheduleMelody, nextBurst);
  }

  return {
    init: function() {
      if (ctx) return;
      ctx = new (window.AudioContext || window.webkitAudioContext)();

      masterGain = ctx.createGain();
      masterGain.gain.value = 0.3;
      masterGain.connect(ctx.destination);

      dryGain = ctx.createGain();
      dryGain.gain.value = 0.7;
      dryGain.connect(masterGain);

      reverbGain = ctx.createGain();
      reverbGain.gain.value = 0.3;
      var convolver = createReverb(ctx);
      reverbGain.connect(convolver);
      convolver.connect(masterGain);

      // Create 3 drone layers
      oscillators.push(createDrone(130.81, 0));    // C3
      oscillators.push(createDrone(196.00, 5));    // G3 slightly detuned
      oscillators.push(createDrone(261.63, -3));   // C4 slightly detuned

      // Fade in drones
      oscillators.forEach(function(d) {
        d.gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2);
      });
    },

    start: function() {
      if (isPlaying) return;
      isPlaying = true;
      if (ctx.state === 'suspended') ctx.resume();
      scheduleMelody();
    },

    stop: function() {
      isPlaying = false;
      // Fade out drones
      var now = ctx.currentTime;
      oscillators.forEach(function(d) {
        d.gain.gain.linearRampToValueAtTime(0, now + 1);
      });
    },

    setScrollDepth: function(depth) {
      scrollDepth = Math.max(0, Math.min(1, depth));
      // Adjust filter brightness based on scroll
      oscillators.forEach(function(d) {
        d.filter.frequency.value = 600 + scrollDepth * 600;
      });
    },

    setVolume: function(vol) {
      if (masterGain) masterGain.gain.value = Math.max(0, Math.min(1, vol));
    }
  };
})();
```

#### Step 2: Add speaker toggle button

In `BaseLayout.astro`, add after the flute button:

```html
<button id="audio-toggle" aria-label="Toggle ambient music" style="position:fixed;bottom:2rem;right:6rem;z-index:9999;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.6);width:44px;height:44px;border-radius:50%;cursor:pointer;font-size:1.2rem;display:flex;align-items:center;justify-content:center;transition:all 0.3s;">
  🔇
</button>
```

#### Step 3: Add scroll listener and toggle logic

In `index.astro`, add before `</body>`:

```html
<script is:inline src="/js/ambient-audio.js"></script>
<script is:inline>
(function() {
  var toggle = document.getElementById('audio-toggle');
  var isPlaying = false;

  toggle.addEventListener('click', function() {
    if (!window.AmbientAudio) return;
    if (!isPlaying) {
      AmbientAudio.init();
      AmbientAudio.start();
      toggle.textContent = '🔊';
      toggle.style.color = 'rgba(255,215,79,0.9)';
      toggle.style.borderColor = 'rgba(255,215,79,0.4)';
      isPlaying = true;
    } else {
      AmbientAudio.stop();
      toggle.textContent = '🔇';
      toggle.style.color = 'rgba(255,255,255,0.6)';
      toggle.style.borderColor = 'rgba(255,255,255,0.15)';
      isPlaying = false;
    }
  });

  // Scroll depth → audio brightness
  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        var scrollH = document.documentElement.scrollHeight - window.innerHeight;
        var depth = scrollH > 0 ? window.scrollY / scrollH : 0;
        if (window.AmbientAudio) AmbientAudio.setScrollDepth(depth);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Pause on tab hidden
  document.addEventListener('visibilitychange', function() {
    if (document.hidden && isPlaying && window.AmbientAudio) {
      AmbientAudio.stop();
    } else if (!document.hidden && isPlaying && window.AmbientAudio) {
      AmbientAudio.start();
    }
  });
})();
</script>
```

### 3.3 Mobile Considerations

- Audio context created only after user click (browser autoplay policy)
- Tab visibility API pauses audio when app is backgrounded (battery saving)
- Scroll listener uses `requestAnimationFrame` throttling
- Volume capped at 0.3 to avoid loud surprises on mobile speakers
- Reverb buffer is 2.5s (not 4s) to save memory

### 3.4 Data Structures

```json
{
  "audioState": {
    "isPlaying": false,
    "scrollDepth": 0.5,
    "volume": 0.3,
    "drones": [
      { "freq": 130.81, "type": "sine", "gain": 0.12 },
      { "freq": 196.0, "type": "sine", "gain": 0.12 },
      { "freq": 261.63, "type": "sine", "gain": 0.12 }
    ]
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Audio context creates without error | `tests/unit/ambient-audio.test.js` | `AmbientAudio.init() !== undefined` |
| Start/stop toggles isPlaying | `tests/unit/ambient-audio.test.js` | `isPlaying === true after start()` |
| Scroll depth clamps to [0,1] | `tests/unit/ambient-audio.test.js` | `setScrollDepth(1.5) → depth === 1.0` |
| Volume clamps to [0,1] | `tests/unit/ambient-audio.test.js` | `setVolume(2.0) → gain === 1.0` |

### 4.2 Green Phase — Implementation

Create `ambient-audio.js`, add toggle button, add scroll listener.

### 4.3 Refactor Phase — Optimization

- Reuse oscillator nodes instead of creating new ones for melody
- Use `AudioWorklet` for more complex synthesis if needed later
- Reduce reverb buffer to 1.5s on mobile

---

## 5. Acceptance Criteria

- [ ] Speaker toggle button appears (bottom-right, left of flute)
- [ ] Clicking speaker starts ambient music (pentatonic flute-like tones)
- [ ] Clicking again stops music
- [ ] Music responds to scroll depth (brighter/higher when scrolled down)
- [ ] Music pauses when tab is hidden, resumes when visible
- [ ] No audio autoplay — only starts after user click
- [ ] Volume is gentle (max 0.3) — never jarring
- [ ] Works on both desktop and mobile
- [ ] All unit tests pass

---

## 6. Dependencies & Risks

**Dependencies:** Web Audio API (available in all modern browsers), user interaction for autoplay

**Risks:**
- Browser autoplay policy blocks audio without user gesture → Start only on button click
- Web Audio API may not work in some older browsers → Graceful degradation (no crash)
- Too many oscillators could impact performance → Limit to 3 drones + occasional melody notes
- Reverb convolver uses memory → Keep impulse response short (2.5s)

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Ambient music generator — procedural flute-like soundscape with Web Audio API",
  "changes": [
    "Pentatonic drone + melody system using Web Audio API",
    "Scroll depth controls filter brightness",
    "Speaker toggle button (bottom-right)",
    "Auto-pause on tab hidden, user-gated autoplay"
  ]
}
```
