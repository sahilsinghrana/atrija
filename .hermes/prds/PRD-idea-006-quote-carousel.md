# PRD: Philosophy Quote Carousel

> **ID:** idea-006  
> **Category:** UI  
> **Priority:** medium  
> **Status:** backlog  
> **PRD Version:** 1.0  
> **Last Updated:** 2026-05-15

---

## 1. Overview

**One-liner:** Auto-rotating quote cards with fade transitions. Each quote is tied to the current section's visual element and theme.

**Problem:** Quotes are static — one per section. Visitors who scroll back up don't see new content. The rich quote data in `siteData.json` is underutilized.

**Solution:** Replace the single static quote in each section with a carousel that cycles through all quotes for that section's theme. Auto-advances every 8 seconds with a smooth crossfade. Shows quote dots indicator. Pauses on hover/focus. Uses quotes from `siteData.json` based on the section's `themeIndex`.

---

## 2. User Stories

- As a visitor, I want to see multiple quotes per section so I get more philosophical depth.
- As a visitor, I want quotes to change automatically so the page feels alive.
- As a visitor, I want smooth transitions between quotes so it feels elegant.
- As a visitor, I want to see which quote I'm on (dots) so I know how many there are.

---

## 3. Technical Specification

### 3.1 Architecture

- **File modified:** `src/pages/index.astro` — replace static quote with carousel HTML
- **File modified:** `src/layouts/BaseLayout.astro` — add carousel CSS
- **New file:** `public/js/quote-carousel.js` — carousel logic
- **Depends on:** `siteData.json` quotes array, existing section theme indices

### 3.2 Implementation Details

#### Step 1: Update index.astro quote sections

Replace each section's static quote block with a carousel container:

```astro
<!-- In each section, replace the static quote with: -->
<div class="quote-carousel" data-theme-index={sec.moon.quote.themeIndex} data-section="moon">
  <div class="quote-carousel-inner">
    {siteData.themes[sec.moon.quote.themeIndex].quotes.map((q, i) => (
      <div class="quote-card" data-index={i} style={i === 0 ? '' : 'display:none;'}>
        <blockquote class="quote-text" set:html={q.text} />
        <cite class="quote-author">— {q.author}</cite>
        {q.source && <span class="quote-source" set:html={q.source} />}
      </div>
    ))}
  </div>
  <div class="quote-dots">
    {siteData.themes[sec.moon.quote.themeIndex].quotes.map((q, i) => (
      <button class={'quote-dot' + (i === 0 ? ' active' : '')} data-index={i} aria-label={'Quote ' + (i + 1)} />
    ))}
  </div>
</div>
```

#### Step 2: Add carousel CSS to BaseLayout.astro

Add to the `<style is:inline>` block:

```css
/* ── Quote Carousel ── */
.quote-carousel {
  position: relative;
  margin-top: var(--space-lg);
  min-height: 120px;
}
.quote-carousel-inner {
  position: relative;
  overflow: hidden;
}
.quote-card {
  transition: opacity 0.8s ease, transform 0.8s ease;
  opacity: 1;
  transform: translateY(0);
}
.quote-card.hidden {
  opacity: 0;
  transform: translateY(10px);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  pointer-events: none;
}
.quote-dots {
  display: flex;
  gap: 6px;
  justify-content: center;
  margin-top: var(--space-sm);
}
.quote-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.2);
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
  padding: 0;
}
.quote-dot.active {
  background: var(--accent-gold);
  transform: scale(1.2);
}
.quote-dot:hover {
  background: rgba(255,255,255,0.4);
}
```

#### Step 3: Create quote-carousel.js

```javascript
// public/js/quote-carousel.js
(function() {
  var carousels = document.querySelectorAll('.quote-carousel');
  var INTERVAL = 8000; // 8 seconds

  carousels.forEach(function(carousel) {
    var cards = carousel.querySelectorAll('.quote-card');
    var dots = carousel.querySelectorAll('.quote-dot');
    var current = 0;
    var total = cards.length;
    var timer = null;
    var isPaused = false;

    if (total <= 1) return; // no carousel needed for single quote

    function show(index) {
      cards.forEach(function(card, i) {
        if (i === index) {
          card.style.display = '';
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
          setTimeout(function() {
            if (card.classList.contains('hidden')) {
              card.style.display = 'none';
            }
          }, 800);
        }
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle('active', i === index);
      });
      current = index;
    }

    function next() {
      show((current + 1) % total);
    }

    function start() {
      if (timer) clearInterval(timer);
      timer = setInterval(function() {
        if (!isPaused) next();
      }, INTERVAL);
    }

    // Dot click handlers
    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        var idx = parseInt(dot.dataset.index);
        show(idx);
        start(); // reset timer
      });
    });

    // Pause on hover/focus
    carousel.addEventListener('mouseenter', function() { isPaused = true; });
    carousel.addEventListener('mouseleave', function() { isPaused = false; });
    carousel.addEventListener('focusin', function() { isPaused = true; });
    carousel.addEventListener('focusout', function() { isPaused = false; });

    // Start
    start();
  });
})();
```

#### Step 4: Include the script

In `index.astro`, before `</body>`:

```html
<script is:inline src="/js/quote-carousel.js"></script>
```

### 3.3 Mobile Considerations

- Carousel works identically on mobile (touch doesn't interfere)
- Min-height ensures layout doesn't jump during transitions
- Dots are large enough (8px) for touch targets
- Pause on hover doesn't affect mobile (no hover), but pause on focus does

### 3.4 Data Structures

```json
{
  "carousel": {
    "themeIndex": 0,
    "section": "moon",
    "current": 0,
    "total": 5,
    "interval": 8000,
    "isPaused": false
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Carousel initializes for each section | `tests/unit/quote-carousel.test.js` | `carousels.length === sectionCount` |
| First quote visible, others hidden | `tests/unit/quote-carousel.test.js` | `cards[0].style.display !== 'none'` |
| Next advances to second quote | `tests/unit/quote-carousel.test.js` | `current === 1 after next()` |
| Dots match quote count | `tests/unit/quote-carousel.test.js` | `dots.length === quotes.length` |
| Single quote skips carousel | `tests/unit/quote-carousel.test.js` | `timer === null when total === 1` |

### 4.2 Green Phase — Implementation

Update `index.astro`, add CSS, create `quote-carousel.js`.

### 4.3 Refactor Phase — Optimization

- Use CSS `will-change: opacity` for GPU-accelerated fades
- Lazy-load carousel JS only when section is in viewport
- Reduce interval to 6 seconds if more than 5 quotes

---

## 5. Acceptance Criteria

- [ ] Each section shows a quote carousel (if theme has 2+ quotes)
- [ ] Quotes auto-rotate every 8 seconds with smooth crossfade
- [ ] Dot indicators show current quote position
- [ ] Clicking a dot jumps to that quote and resets timer
- [ ] Carousel pauses on hover/focus, resumes on leave
- [ ] Single-quote sections show static quote (no carousel)
- [ ] Works on both desktop and mobile
- [ ] All unit tests pass

---

## 6. Dependencies & Risks

**Dependencies:** `siteData.json` with quotes arrays, existing section theme indices in `content.json`

**Risks:**
- Quotes of different lengths may cause layout shift → Use `min-height` on carousel
- Too many quotes could make carousel feel rushed → Cap at 6 quotes per section, increase interval
- Auto-rotation may annoy users → Pause on hover/focus, clear visual dots for manual control

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Philosophy quote carousel — auto-rotating quotes with fade transitions and dot indicators",
  "changes": [
    "Replaced static quotes with auto-rotating carousel",
    "8-second interval with crossfade transition",
    "Dot indicators with click-to-jump",
    "Pause on hover/focus, single-quote sections unchanged"
  ]
}
```
