# PRD: Haptic Pulse — Subtle Device Vibration on Key Interactions

> **ID:** idea-095
> **Category:** Interactivity
> **Priority:** low
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-06-29

---

## 1. Overview

**One-liner:** Key interactions (flute click, section enter, quote change) trigger subtle haptic feedback on supported mobile devices, deepening the tactile connection to the visual experience.

**Problem:** The site is purely visual and auditory (via flute notes) — there's no tactile channel. Mobile users in particular miss a layer of feedback confirming their interactions registered.

**Solution:** A tiny standalone module that uses the Vibration API (`navigator.vibrate`) to emit short, purposeful pulses on specific events: flute click (10ms tick), section enter (15ms soft pulse), quote carousel change (5ms tap), shooting star (20ms sweep). All durations are imperceptibly short to anyone who hasn't felt them but add a subtle "physicality" to the experience. Fully degrades silently on desktop and iOS (no Vibration API). Zero scene-init.js changes.

---

## 2. User Stories

- As a mobile visitor, I want a subtle vibration when I click for a flute note, so I feel the interaction physically.
- As a mobile visitor, I want a gentle pulse when I enter a new section, so the content transition feels tangible.
- As a user who finds vibrations annoying, I want a way to disable them, and I want them off by default if I've never opted in.

---

## 3. Technical Specification

### 3.1 Architecture

**New files:**
- `public/js/haptic-pulse.js` — Standalone IIFE module, loaded via `<script>` tag in BaseLayout.astro

**Existing modules it depends on:**
- Event system: listens for custom DOM events that are already dispatched (`themechange`, quote carousel internal events, etc.)
- No Three.js dependency
- Vibration API (browser-native, Android only)

**How it works:**
- On load, checks `navigator.vibrate` exists — if not, module exits silently
- Default state: disabled until user interacts with any haptic-triggering element (opt-in via first interaction)
- After opt-in, listens for custom events:
  - `flute-click` → vibrate(10)
  - `section-enter` → vibrate([10, 30, 15]) — triple-pulse pattern
  - `quote-change` → vibrate(5)
  - `shooting-star` → vibrate([5, 20, 20]) — rising sweep pattern
- Respects `prefers-reduced-motion` — never vibrates when set
- Stores opt-in preference in `localStorage` so returning users keep their choice

### 3.2 Implementation Details

#### Step 1: Create the haptic module
- File: `public/js/haptic-pulse.js`
- What to do:
  - Check `navigator.vibrate` — if undefined, exit (desktop/iOS)
  - Check `prefers-reduced-motion: reduce` — if true, exit
  - Read `localStorage.getItem('haptic-enabled')` — if `false`, exit (user previously disabled)
  - If no preference stored, wait for first user interaction (click/tap) to enable
  - Define vibration patterns:
    ```js
    const PATTERNS = {
      fluteClick: [10],
      sectionEnter: [10, 30, 15],
      quoteChange: [5],
      shootingStar: [5, 20, 20],
      cometAppear: [3, 50, 3, 50, 3]  // subtle triple-tap
    };
    ```
  - Listen for custom events on `document`
- Expected outcome: Vibration fires on supported devices after first interaction

#### Step 2: Dispatch events from existing modules
- File: Various (flute module, quote-carousel, scroll-lighting, comet)
- What to do:
  - Add `document.dispatchEvent(new CustomEvent('flute-click'))` to the flute click handler
  - Add `document.dispatchEvent(new CustomEvent('section-enter'))` to IntersectionObserver callback
  - Add `document.dispatchEvent(new CustomEvent('quote-change'))` to carousel advance
  - Add `document.dispatchEvent(new CustomEvent('shooting-star'))` to shooting star trigger
  - These are 1-line additions to existing modules
- Expected outcome: Haptic module receives events without modifying scene code

#### Step 3: Add opt-out toggle (accessibility)
- File: `public/js/haptic-pulse.js`
- What to do:
  - Listen for a keyboard shortcut `Shift+H` to toggle haptic on/off
  - Store preference in `localStorage`
  - Announce state via `aria-live` polite region ("Haptics on" / "Haptics off")
- Expected outcome: Users can easily disable haptics without digging into settings

### 3.3 Mobile Considerations

- Only activates on devices with Vibration API (Android Chrome, Samsung Internet)
- iOS Safari has no Vibration API — module exits silently (no errors)
- Vibration durations are all <25ms total — purposeful but not jarring
- `prefers-reduced-motion` disables entirely
- Performance budget: zero — vibration is a hardware-level operation with no JS overhead

### 3.4 Data Structures

```json
{
  "patterns": {
    "fluteClick": [10],
    "sectionEnter": [10, 30, 15],
    "quoteChange": [5],
    "shootingStar": [5, 20, 20],
    "cometAppear": [3, 50, 3, 50, 3]
  },
  "storageKey": "haptic-enabled",
  "keyboardToggle": "Shift+H",
  "optInTrigger": "first-interaction"
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Module detects Vibration API | `tests/unit/haptic-pulse.test.js` | `isSupported()` returns true when `navigator.vibrate` exists |
| Reduced motion disables module | `tests/unit/haptic-pulse.test.js` | If `prefers-reduced-motion: reduce`, `init()` exits without listeners |
| First interaction enables haptics | `tests/unit/haptic-pulse.test.js` | After click event, haptic-enabled is stored in localStorage |
| Pattern dispatch triggers vibration | `tests/unit/haptic-pulse.test.js` | Dispatching 'flute-click' calls `navigator.vibrate([10])` |
| Opt-out via Shift+H | `tests/unit/haptic-pulse.test.js` | Shift+H sets `localStorage['haptic-enabled']` to 'false' |
| Disabled state blocks vibration | `tests/unit/haptic-pulse.test.js` | When disabled, dispatching events does NOT call vibrate |
| No vibration on unsupported devices | `tests/unit/haptic-pulse.test.js` | Without `navigator.vibrate`, all calls no-op |

### 4.2 Green Phase — Implementation

Implement `public/js/haptic-pulse.js`:
- Feature detection layer (`isSupported()`)
- Opt-in logic (first click enables)
- Event listeners for custom events
- Pattern library
- Keyboard toggle (Shift+H)
- localStorage persistence

### 4.3 Refactor Phase — Optimization

- Debounce rapid-fire events (max 1 vibration per 100ms)
- Use a single event delegation listener on `document` rather than per-element

---

## 5. Acceptance Criteria

- [ ] Module activates only on devices with Vibration API
- [ ] Haptics disabled by default until first user interaction (opt-in)
- [ ] Flute click triggers 10ms vibration
- [ ] Section enter triggers triple-pulse [10, 30, 15]
- [ ] Quote change triggers 5ms tap
- [ ] Shooting star triggers sweep [5, 20, 20]
- [ ] `prefers-reduced-motion` disables all vibration
- [ ] Shift+H toggles haptics on/off with persistence
- [ ] No errors on desktop/iOS (graceful no-op)
- [ ] No modifications to `scene-init.js`
- [ ] Build succeeds
- [ ] Total added code ~80 lines

---

## 6. Dependencies & Risks

**Dependencies:** Vibration API (Android only). No desktop support — this is intentional. Must ensure existing modules dispatch custom events (1-line additions to flute handler, quote-carousel, scroll-lighting, comet).

**Risks:**
- Some Android devices have no vibrator (tablets) → `navigator.vibrate` returns false, module no-ops
- Over-vibration could annoy users → Mitigation: opt-in model, max 25ms per event, debounce
- iOS never supports this → Mitigation: intentional — desktop users don't expect haptics

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Haptic Pulse — subtle vibration feedback on key interactions",
  "changes": [
    "Added public/js/haptic-pulse.js (standalone module)",
    "Opt-in model: first interaction enables haptics",
    "5 vibrational patterns for different events",
    "Shift+H keyboard toggle with localStorage persistence",
    "Respects prefers-reduced-motion",
    "Graceful no-op on unsupported devices (desktop/iOS)"
  ]
}
```
