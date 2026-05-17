# PRD: Van Gogh Biography Timeline

> **ID:** idea-025
> **Category:** Content
> **Priority:** medium
**Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-05-18

---

## 1. Overview

**One-liner:** An interactive, scrollable timeline of Van Gogh's life milestones — birth, key paintings, moves, and legacy — displayed as a horizontal card carousel with date markers.

**Problem:** The site showcases Van Gogh's art and philosophy but provides no biographical context. Visitors who don't know his life story miss the emotional weight behind the paintings.

**Solution:** Add a new "Timeline" section to the site with a JSON data file containing ~20-25 key life events. Render them as a horizontal scrolling card deck with year markers, short descriptions, and optional Wikimedia Commons thumbnail images. The section fits between existing content sections and uses the site's design tokens.

---

## 2. User Stories

- As a visitor, I want to browse Van Gogh's life timeline so I can understand the context behind his art.
- As a visitor, I want to see key dates and events at a glance so I don't have to leave the site for biographical info.
- As a visitor, I want the timeline to be visually consistent with the rest of the site so it feels integrated.
- As a visitor, I want the timeline to work on mobile with horizontal swipe navigation.

---

## 3. Technical Specification

### 3.1 Architecture

- **New file:** `src/content/timeline.json` — Timeline event data (20-25 entries)
- **New file:** `src/components/Timeline.astro` — Astro component for the timeline section
- **Modified file:** `src/pages/index.astro` — Import and render the Timeline component in the appropriate section order
- **New file:** `public/js/timeline.js` — Client-side interactivity (scroll/snap, lazy image loading)
- **No Three.js changes** — this is a pure HTML/CSS/JS content section

### 3.2 Implementation Details

#### Step 1: Create the timeline data file
- File: `src/content/timeline.json`
- What to do:
  - Define an array of timeline event objects:
    ```json
    {
      "events": [
        {
          "year": 1853,
          "month": 3,
          "day": 30,
          "title": "Born in Zundert",
          "description": "Vincent Willem van Gogh is born in Zundert, Netherlands, to Theodorus van Gogh and Anna Cornelia Carbentus.",
          "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg/220px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg",
          "imageAlt": "Self-portrait of Vincent van Gogh",
          "category": "personal"
        },
        {
          "year": 1888,
          "month": 10,
          "title": "The Starry Night painted",
          "description": "Van Gogh paints The Starry Night while at the Saint-Paul-de-Mausole asylum in Saint-Rémy-de-Provence.",
          "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/300px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
          "imageAlt": "The Starry Night by Vincent van Gogh",
          "category": "painting"
        }
      ]
    }
    ```
  - Include 20-25 events spanning 1853-1890
  - Categories: `personal`, `painting`, `move`, `letter`, `exhibition`
  - Images from Wikimedia Commons (hotlink URLs, with alt text)
  - Sort chronologically by year/month/day
- Expected outcome: A rich, structured timeline dataset

#### Step 2: Create the Timeline.astro component
- File: `src/components/Timeline.astro`
- What to do:
  - Import `timeline.json`
  - Render a section with:
    - Section heading: `<h2>Timeline of a Life</h2>` (or similar, matching site's heading style)
    - A horizontal scroll container (`overflow-x: auto`, `scroll-snap-type: x mandatory`)
    - Each event as a card:
      - Year badge (large, prominent, using `--accent-gold`)
      - Title (bold, `--text-primary`)
      - Description (2-3 lines, `--text-secondary`, `line-clamp: 3`)
      - Optional image (lazy-loaded, rounded corners, max-height 180px)
      - Category indicator (small colored dot: gold for painting, blue for personal, coral for move, violet for letter, sage for exhibition)
    - Cards: 280px wide on desktop, 240px on mobile
    - Gap between cards: `var(--space-md)`
    - Scroll snap alignment: `start`
  - Use CSS custom properties from the site's design tokens
  - Add a subtle gradient fade on the right edge to indicate more content
- Expected outcome: A visually consistent timeline section

#### Step 3: Add the Timeline section to index.astro
- File: `src/pages/index.astro`
- What to do:
  - Import the Timeline component: `import Timeline from '../components/Timeline.astro';`
  - Place it after the Art & Beauty section (or at the end, before the footer)
  - Wrap in a `<section id="timeline">` with appropriate spacing
- Expected outcome: The timeline appears on the main page

#### Step 4: Add client-side timeline interactivity
- File: `public/js/timeline.js`
- What to do:
  - On `DOMContentLoaded`:
    1. Find the timeline container
    2. Add left/right arrow buttons for keyboard/mouse navigation (desktop)
    3. Implement lazy loading for images (`loading="lazy"` attribute — native, but ensure it's set)
    4. Add intersection observer to animate cards as they scroll into view (fade-in + slide-up, 200ms stagger)
    5. On mobile, ensure touch scrolling works smoothly (`-webkit-overflow-scrolling: touch`)
  - Keyboard navigation: Left/Right arrows scroll by one card width
  - Respect `prefers-reduced-motion`: disable card entrance animations
- Expected outcome: Smooth, interactive timeline with entrance animations

### 3.3 Mobile Considerations

- On viewport < 768px:
  - Card width: 240px (fits comfortably with 16px side margins)
  - Images: max-height 140px to save vertical space
  - Arrow buttons: hidden (rely on touch swipe)
  - Scroll snap: mandatory for precise card alignment
  - Reduce the number of visible cards to 1 at a time
- Performance budget: Images are lazy-loaded; max 3 images in viewport at once. Total section height: ~400px mobile, ~500px desktop.

### 3.4 Data Structures

```json
{
  "events": [
    {
      "year": 1888,
      "month": 10,
      "day": null,
      "title": "The Starry Night painted",
      "description": "Van Gogh paints The Starry Night while at the Saint-Paul-de-Mausole asylum in Saint-Rémy-de-Provence.",
      "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/300px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
      "imageAlt": "The Starry Night by Vincent van Gogh",
      "category": "painting"
    }
  ]
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Timeline data file is valid JSON | `tests/timeline.test.js` | `JSON.parse(timelineJson)` succeeds and `.events` array has ≥ 20 entries |
| Timeline section renders | `tests/timeline.test.js` | `document.querySelector('#timeline')` is truthy |
| Cards are rendered for each event | `tests/timeline.test.js` | `.timeline-card` count equals `events.length` |
| Images have lazy loading | `tests/timeline.test.js` | All timeline images have `loading="lazy"` attribute |
| Scroll snap is applied | `tests/timeline.test.js` | Container has `scroll-snap-type: x mandatory` |
| Keyboard navigation works | `tests/timeline.test.js` | Right arrow key scrolls container by ~300px |

### 4.2 Green Phase — Implementation

- Create `timeline.json` with 20-25 events
- Create `Timeline.astro` component with card rendering
- Add to `index.astro`
- Create `timeline.js` for interactivity
- Verify all 6 tests pass

### 4.3 Refactor Phase — Optimization

- Add a "filter by category" toggle (show only paintings, only personal events, etc.)
- Add a vertical timeline variant for wider viewports (> 1200px)
- Preload the first 2 images (above the fold) with `<link rel="preload">`

---

## 5. Acceptance Criteria

- [ ] Timeline section appears on the main page with 20-25 life events
- [ ] Each event card shows year, title, description, and optional image
- [ ] Cards are horizontally scrollable with snap alignment
- [ ] Images are lazy-loaded and have alt text
- [ ] Category color dots are visible on each card
- [ ] Works on mobile with touch swipe and single-card view
- [ ] Keyboard navigation (arrow keys) works on desktop
- [ ] Card entrance animations respect `prefers-reduced-motion`
- [ ] All 6 unit tests pass
- [ ] No console errors; images fail gracefully (placeholder if load fails)

---

## 6. Dependencies & Risks

**Dependencies:**
- Wikimedia Commons image URLs must be stable (they are, but hotlinking depends on their CDN)
- Astro component must be placed in the correct section order in `index.astro`

**Risks:**
- **Image hotlinking:** Wikimedia Commons may block or rate-limit hotlinked images. Mitigation: use the Wikimedia API to verify URLs, add `onerror` fallback to a placeholder SVG, or consider downloading key images to `public/images/timeline/`.
- **Content accuracy:** Timeline facts must be historically accurate. Mitigation: source from Wikipedia/Wikidata and cite sources in comments.
- **Content maintenance:** New events would require manual JSON updates. Mitigation: the JSON format is simple and well-documented.

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Van Gogh biography timeline — interactive horizontal card carousel with 20-25 life events",
  "changes": [
    "Added src/content/timeline.json with 20-25 life events",
    "Created src/components/Timeline.astro component",
    "Added timeline section to index.astro",
    "Added public/js/timeline.js for scroll snap and animations",
    "Lazy-loaded Wikimedia Commons images with fallback",
    "Category color coding (painting, personal, move, letter, exhibition)",
    "Mobile-optimized with touch swipe and single-card view"
  ]
}
```
