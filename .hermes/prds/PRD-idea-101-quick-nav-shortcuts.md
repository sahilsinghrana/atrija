# PRD: Quick Navigation Keyboard Shortcuts

> **ID:** idea-101
> **Category:** UX
> **Priority:** medium
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-07-08

---

## 1. Overview

**One-liner:** Add direct keyboard shortcuts to jump to specific sections (H for Hero, T for Today, M for Moon, P for Philosophy, S for Shiva/Shakti, A for Art) with visual feedback.

**Problem:** The site has 5+ scroll sections but no way to quickly navigate between them. Users must scroll manually or use Tab repeatedly. The section-nav.js provides dot navigation but requires clicking.

**Solution:** Extend keyboard-help.js to handle single-key shortcuts: H/T/M/P/S/A keys jump to corresponding sections. Visual highlight flashes on the target section. Shift+H shows the help overlay. Zero scene-init.js changes.

---

## 2. User Stories

- As a keyboard user, I want to press M to jump to the Moon section immediately.
- As a returning visitor, I want to memorize shortcuts for quick navigation.
- As a screen reader user, I want announces when jumping to a section.

---

## 3. Technical Specification

### 3.1 Architecture

- **Module:** `public/js/quick-nav.js` — Standalone IIFE module
- **Integration:** Loaded after keyboard-help.js in `index.astro`
- **Event:** Keydown handler for H/T/M/P/S/A keys (with shift check)
- **API:** Uses existing `document.getElementById` to find sections

### 3.2 Implementation Details

```javascript
// public/js/quick-nav.js
(function() {
  'use strict';
  
  const shortcuts = {
    h: 'hero',
    t: 'today-section',
    m: 'moon-section',
    p: 'philosophy-section',
    s: 'shiva-section',
    a: 'art-section'
  };
  
  function navigateToSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Flash highlight
      el.classList.add('nav-highlight');
      setTimeout(() => el.classList.remove('nav-highlight'), 1200);
    }
  }
  
  document.addEventListener('keydown', (e) => {
    // Don't trigger in inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    // Shift+H shows help (handled by keyboard-help.js)
    // Single letter when not shifted
    if (!e.shiftKey && e.key.toLowerCase() in shortcuts) {
      navigateToSection(shortcuts[e.key.toLowerCase()]);
    }
  });
})();
```

CSS for highlight:
```css
.nav-highlight {
  animation: navPulse 1.2s ease-out;
}
@keyframes navPulse {
  0% { box-shadow: 0 0 0 0 var(--accent-gold-a); }
  70% { box-shadow: 0 0 20px 10px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| M key scrolls to moon section | `tests/unit/quick-nav.test.js` | `scrollIntoView` called with moon-section ID |
| Shift+H does not trigger nav | `tests/unit/quick-nav.test.js` | No scroll when Shift is held |
| Input/textarea ignores shortcuts | `tests/unit/quick-nav.test.js` | No nav when e.target is INPUT |
| Visual highlight class added | `tests/unit/quick-nav.test.js` | `nav-highlight` class toggled temporarily |

### 4.2 Green Phase — Implementation

- Create quick-nav.js module
- Add CSS for highlight animation (via injected style tag)
- Load module in index.astro

### 4.3 Refactor Phase — Optimization

- Debounce repeated key presses
- Remove event listener on cleanup

---

## 5. Acceptance Criteria

- [ ] H/T/M/P/S/A keys navigate to corresponding sections
- [ ] Shift+H does NOT trigger navigation (shows help)
- [ ] Shortcuts ignored when typing in input/textarea
- [ ] Visual highlight flashes on target section
- [ ] Smooth scroll behavior used
- [ ] Zero scene-init.js changes
- [ ] All unit tests pass

---

## 6. Dependencies & Risks

**Dependencies:** Section elements with predictable IDs (hero, today-section, moon-section, etc.).

**Risks:** New CSS may conflict with existing styles.

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Added quick navigation keyboard shortcuts for section jumping with visual feedback"
}
```