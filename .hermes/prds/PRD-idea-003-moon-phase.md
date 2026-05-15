# PRD: Moon Phase API Integration

> **ID:** idea-003  
> **Category:** Data  
> **Priority:** medium  
> **Status:** backlog  
> **PRD Version:** 1.0  
> **Last Updated:** 2026-05-15

---

## 1. Overview

**One-liner:** Replace the calculated/cyclical moon phase with real astronomical data, showing the accurate current moon phase based on date.

**Problem:** The current moon phase cycles every 5 seconds for visual effect — it's not astronomically accurate. Visitors who know moon phases will notice this breaks immersion.

**Solution:** Calculate the real moon phase astronomically using a known algorithm (Jean Meeus's "Astronomical Algorithms" simplified). No API needed — pure math based on the synodic month. The ASCII moon shadow overlay updates to show the correct phase for today's date. The 3D moon position can optionally reflect the real moon's ecliptic position.

---

## 2. User Stories

- As a visitor, I want to see the correct current moon phase so the site feels authentic and educational.
- As a visitor, I want the moon phase to update daily without page reload so it's always current.
- As a visitor, I want a label showing the phase name (e.g., "Waxing Gibbous") so I learn something.

---

## 3. Technical Specification

### 3.1 Architecture

- **File modified:** `public/js/scene-init.js` (moon phase calculation + ASCII shadow)
- **File modified:** `src/pages/index.astro` (phase label display)
- **New function:** `getMoonPhase(date)` — returns phase data object
- **New function:** `getMoonPhaseName(phase)` — returns human-readable name
- **No external API** — pure mathematical calculation
- **Depends on:** Existing ASCII moon overlay, `createMoon()` function

### 3.2 Implementation Details

#### Step 1: Add moon phase calculation module

Add at the top of `scene-init.js` (after the `isMobile` declarations):

```javascript
// ── Real Moon Phase Calculation ──
// Based on Jean Meeus's Astronomical Algorithms, simplified
// Accuracy: ±0.5 days for dates 1900-2100
function getMoonPhase(date) {
  date = date || new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  // Julian Date calculation
  var a = Math.floor((14 - month) / 12);
  var y = year + 4800 - a;
  var m = month + 12 * a - 3;
  var jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  // Days since known new moon (Jan 6, 2000 18:14 UTC)
  var daysSinceNew = jd - 2451549.5;
  var synodicMonth = 29.53058868;
  var phase = ((daysSinceNew % synodicMonth) + synodicMonth) % synodicMonth;
  var phaseFraction = phase / synodicMonth; // 0.0 = new moon, 0.5 = full moon

  return {
    phase: phase,           // days into cycle (0 to 29.53)
    fraction: phaseFraction, // 0.0 to 1.0
    age: phase,             // alias
    illumination: (1 - Math.cos(phaseFraction * 2 * Math.PI)) / 2 // 0=new, 1=full
  };
}

function getMoonPhaseName(fraction) {
  if (fraction < 0.0625) return 'New Moon';
  if (fraction < 0.1875) return 'Waxing Crescent';
  if (fraction < 0.3125) return 'First Quarter';
  if (fraction < 0.4375) return 'Waxing Gibbous';
  if (fraction < 0.5625) return 'Full Moon';
  if (fraction < 0.6875) return 'Waning Gibbous';
  if (fraction < 0.8125) return 'Last Quarter';
  if (fraction < 0.9375) return 'Waning Crescent';
  return 'New Moon';
}

function getMoonEmoji(fraction) {
  if (fraction < 0.0625) return '🌑';
  if (fraction < 0.1875) return '🌒';
  if (fraction < 0.3125) return '🌓';
  if (fraction < 0.4375) return '🌔';
  if (fraction < 0.5625) return '🌕';
  if (fraction < 0.6875) return '🌖';
  if (fraction < 0.8125) return '🌗';
  if (fraction < 0.9375) return '🌘';
  return '🌑';
}
```

#### Step 2: Update ASCII moon shadow to use real phase

In the `createMoon()` function, replace the cycling shadow with a real phase-based shadow:

```javascript
// In createMoon(), after creating the moon mesh:
var moonPhase = getMoonPhase();
var phaseFraction = moonPhase.fraction;

// Update ASCII moon shadow position based on real phase
// The shadow overlay translateX is calculated from phase:
// New moon: shadow covers nothing (translateX = -100%)
// Full moon: shadow covers everything (translateX = +100%)
// Waxing: shadow moves left to right
// Waning: shadow moves right to left
function getShadowTranslateX(fraction) {
  if (fraction <= 0.5) {
    // New → Full: shadow retreats from right
    // fraction 0.0 = fully lit (no shadow), 0.5 = fully lit
    // Actually: new moon = dark, full moon = lit
    // fraction 0.0 = new (dark), 0.5 = full (lit)
    // Waxing: right side lit, shadow on left
    return -100 + (fraction * 2 * 100); // -100% to 0%
  } else {
    // Full → New: shadow advances from left
    return ((fraction - 0.5) * 2 * 100); // 0% to 100%
  }
}
```

#### Step 3: Add phase label to the Moon section

In `index.astro`, in the Moon section, add a small phase indicator:

```astro
<!-- After the ASCII moon div -->
<div id="moon-phase-label" style="text-align:center;margin-top:0.5rem;font-size:0.85rem;color:var(--text-tertiary);font-family:var(--font-sans);">
  <!-- Filled by JS -->
</div>
```

Add to `scene-init.js` init:

```javascript
// Set moon phase label
var phaseLabel = document.getElementById('moon-phase-label');
if (phaseLabel) {
  var phase = getMoonPhase();
  var emoji = getMoonEmoji(phase.fraction);
  var name = getMoonPhaseName(phase.fraction);
  phaseLabel.innerHTML = emoji + ' ' + name + ' · ' + Math.round(phase.illumination * 100) + '% illuminated';
}
```

### 3.3 Mobile Considerations

- No changes needed — calculation is pure math, no network request
- Phase label uses same responsive typography as other text
- ASCII moon shadow works identically on mobile

### 3.4 Data Structures

```json
{
  "moonPhase": {
    "phase": 14.765,
    "fraction": 0.5,
    "age": 14.765,
    "illumination": 1.0
  },
  "phaseName": "Full Moon",
  "emoji": "🌕"
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Known new moon date returns ~0 fraction | `tests/unit/moon-phase.test.js` | `getMoonPhase('2000-01-06').fraction ≈ 0` |
| Known full moon date returns ~0.5 fraction | `tests/unit/moon-phase.test.js` | `getMoonPhase('2000-01-21').fraction ≈ 0.5` |
| Phase name for 0.5 is "Full Moon" | `tests/unit/moon-phase.test.js` | `getMoonPhaseName(0.5) === 'Full Moon'` |
| Illumination is 0 at new, 1 at full | `tests/unit/moon-phase.test.js` | `illumination(0) ≈ 0, illumination(0.5) ≈ 1` |
| Returns valid object for current date | `tests/unit/moon-phase.test.js` | `getMoonPhase().fraction >= 0 && <= 1` |

### 4.2 Green Phase — Implementation

Implement `getMoonPhase()`, `getMoonPhaseName()`, update ASCII shadow, add phase label.

### 4.3 Refactor Phase — Optimization

- Cache the phase calculation (only needs to update daily)
- Pre-compute shadow translateX to avoid per-frame calculation

---

## 5. Acceptance Criteria

- [ ] Moon phase is astronomically accurate (±0.5 days) for current date
- [ ] ASCII moon shadow overlay shows correct phase
- [ ] Phase label shows emoji + name + illumination percentage
- [ ] Phase updates daily without page reload
- [ ] No external API calls needed (pure math)
- [ ] Works on both desktop and mobile
- [ ] All unit tests pass

---

## 6. Dependencies & Risks

**Dependencies:** Existing ASCII moon overlay in `index.astro`, `createMoon()` function

**Risks:**
- Julian Date calculation may have edge cases at year boundaries → Test with known dates
- ASCII shadow technique may not perfectly represent all phases → Accept approximation
- Timezone differences could cause off-by-one-day errors → Use local date, not UTC

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Real moon phase — astronomically accurate phase calculation with ASCII shadow + label",
  "changes": [
    "Added getMoonPhase() using Jean Meeus algorithm (no API needed)",
    "ASCII moon shadow now shows real current phase",
    "Phase label: emoji + name + illumination percentage",
    "Auto-updates daily, works offline"
  ]
}
```
