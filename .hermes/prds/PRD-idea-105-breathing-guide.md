# PRD: Breathing Guide Animation

> **ID:** idea-105
> **Category:** UX
> **Priority:** low
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-07-10

---

## 1. Overview

**One-liner:** A calming breathing exercise overlay activated via keyboard shortcut.

**Problem:** No wellness/mindfulness features despite meditation-friendly environment.

**Solution:** Shift+B toggles breathing guide with animated circle (4-second cycles).

---

## 2. User Stories

- As a visitor, I want a breathing guide so I can practice mindfulness.
- As a keyboard user, I want Shift+B to toggle it so it's discoverable.

---

## 3. Technical Specification

### 3.1 Architecture

- Create: `public/js/breathing-guide.js` - Standalone IIFE module
- Modify: `src/pages/index.astro` - Add script tag
- Zero scene-init.js changes

### 3.2 Implementation Details

#### Step 1: Create breathing-guide.js structure
- IIFE with CONFIG (cycle: 4000ms, colors from theme)
- Create canvas overlay with animated circle
- Web Animations API for smooth expansion/contraction

#### Step 2: Keyboard shortcut handler
- Listen for keydown
- Toggle on Shift+B
- Prevent default in input fields

#### Step 3: Animation logic
- Ease-in-out for smooth breathing rhythm
- Circle scale: 0.8x to 1.2x over 4 seconds
- Hold at extremes for 1 second each

### 3.3 Mobile Considerations

- Touch toggle available via floating button (right sidebar)
- Reduced size on small screens
- No audio required

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Shift+B opens overlay | `tests/unit/breathing-guide.test.js` | Overlay visible after keypress |
| Breathing cycle timing | `tests/unit/breathing-guide.test.js` | 4s complete cycle |
| prefers-reduced-motion respected | `tests/unit/breathing-guide.test.js` | No animation when reduced |

---

## 5. Acceptance Criteria

- [ ] Shift+B opens/closes breathing overlay
- [ ] 4-second breathing cycle
- [ ] Circle scales smoothly
- [ ] Zero scene-init.js changes
- [ ] Respects prefers-reduced-motion
