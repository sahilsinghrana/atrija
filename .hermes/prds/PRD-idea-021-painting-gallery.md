# PRD: Van Gogh Painting Gallery Carousel

> **ID:** idea-021
> **Category:** Content
> **Priority:** medium
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-05-17

---

## 1. Overview

**One-liner:** An interactive gallery section showcasing Van Gogh's most famous paintings with lazy-loaded high-resolution images, themed descriptions, and smooth carousel navigation.

**Problem:** The website is inspired by Van Gogh's impressionist style but doesn't showcase any of his actual artwork. Visitors have no reference point for the real paintings that inspire the site's aesthetic.

**Solution:** Add a new "Gallery" section to the page with a horizontally scrollable carousel of Van Gogh's paintings. Each painting card shows the artwork, title, year, and a short thematic description connecting it to the site's philosophy content. Images are lazy-loaded from Wikimedia Commons (free, no API key needed).

---

## 2. User Stories

- As a visitor, I want to see Van Gogh's actual paintings so I can connect the site's aesthetic to the real artwork.
- As a visitor, I want smooth carousel navigation (swipe on mobile, drag/arrows on desktop) so browsing feels natural.
- As a visitor, I want each painting to have context (title, year, description) so I understand its significance.
- As a visitor with slow internet, I want images to load progressively so the page remains fast.

---

## 3. Technical Specification

### 3.1 Architecture

This feature adds a new Astro component for the gallery section and a JSON data file for painting metadata. Images are loaded from Wikimedia Commons URLs (hotlinked, no local storage needed).

**Files created:**
- `src/components/Gallery.astro` — Gallery carousel component
- `src/content/gallery.json` — Painting metadata (title, year, Wikimedia URL, description, theme)

**Files modified:**
- `src/pages/index.astro` — Import and render `<Gallery />` section
- `src/content/siteData.json` — Add gallery section entry (label, heading, intro)

**Dependencies:**
- Astro 4 (component system, `client:visible` directive for lazy hydration)
- No JavaScript framework — vanilla JS for carousel logic within `<script>` tag in Gallery.astro
- Wikimedia Commons for image hosting (free, reliable, CORS-friendly)

### 3.2 Implementation Details

#### Step 1: Create Gallery Data File
- File: `src/content/gallery.json`
- What to do:
  - Create an array of 8–10 Van Gogh paintings with fields: `id`, `title`, `year`, `imageUrl` (Wikimedia Commons direct link), `thumbUrl` (smaller version if available), `description` (2-3 sentences connecting to site themes), `theme` (one of: moon, ego, gita, shiva, art)
  - Suggested paintings: The Starry Night (1889), Sunflowers (1888), Wheatfield with Crows (1890), The Night Café (1888), Self-Portrait (1889), Irises (1889), Café Terrace at Night (1888), Almond Blossom (1890), The Potato Eaters (1885), Bedroom in Arles (1888)
  - Use Wikimedia Commons URLs in format: `https://upload.wikimedia.org/wikipedia/commons/thumb/.../...jpg/800px-...jpg`
- Expected outcome: A JSON file with 8–10 painting entries, ready for the component to consume

#### Step 2: Create Gallery Component
- File: `src/components/Gallery.astro`
- What to do:
  - Frontmatter: `import galleryData from '../content/gallery.json';`
  - Template: Full-width section with `<h2>` heading, horizontal scroll container with painting cards
  - Each card: `<img loading="lazy" src={painting.imageUrl} alt={painting.title} />`, title, year, description
  - Navigation: Left/right arrow buttons (desktop), swipe support (mobile), scroll-snap for card alignment
  - CSS: Use existing design tokens (`--bg`, `--text-primary`, `--accent-gold`, etc.), cards have rounded corners, subtle shadow, max-width 400px per card
  - Scroll-snap: `scroll-snap-type: x mandatory` on container, `scroll-snap-align: start` on cards
  - Progress dots below carousel showing current position
- Expected outcome: A self-contained gallery carousel component

#### Step 3: Add Carousel Interactivity
- File: `src/components/Gallery.astro` (inside `<script>` tag)
- What to do:
  - Arrow button click handlers: `container.scrollBy({ left: cardWidth + gap, behavior: 'smooth' })`
  - Swipe detection: Track `touchstart`/`touchend` deltaX, if > 50px trigger scroll
  - Scroll event: Update active dot indicator
  - Keyboard: Left/Right arrow keys navigate cards when gallery is focused
  - IntersectionObserver: Only load images when card is near viewport (progressive enhancement on top of `loading="lazy"`)
- Expected outcome: Smooth, accessible carousel with multiple input methods

#### Step 4: Integrate into Main Page
- File: `src/pages/index.astro`
- What to do:
  - Import: `import Gallery from '../components/Gallery.astro';`
  - Add `<Gallery />` section after the Art & Beauty section (before footer)
  - Add gallery section metadata to `content.json`: `sections.gallery` with `label: "Gallery"`, `heading`, `intro`
- Expected outcome: Gallery appears as a new section on the main page

### 3.3 Mobile Considerations

- Cards are full-width minus padding (max 1 card visible at a time on mobile)
- Swipe gestures are primary navigation on mobile (arrows hidden or minimized)
- Images use `loading="lazy"` and `decoding="async"` for performance
- Max image width: 800px (Wikimedia provides multiple sizes)
- Touch scroll is native (no JS interception of scroll events)
- Performance budget: Max 10 images × ~150KB each = 1.5MB total, lazy-loaded so initial load is ~300KB

### 3.4 Data Structures

```json
{
  "paintings": [
    {
      "id": "starry-night",
      "title": "The Starry Night",
      "year": 1889,
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/800px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
      "description": "Painted during Van Gogh's stay at Saint-Rémy, this swirling night sky captures the artist's turbulent inner world — a visual echo of the moon theme's contemplation of light in darkness.",
      "theme": "moon"
    }
  ]
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Gallery data has 8+ entries | `tests/gallery.test.js` | `galleryData.paintings.length >= 8` |
| All entries have required fields | `tests/gallery.test.js` | Every entry has `id`, `title`, `year`, `imageUrl`, `description`, `theme` |
| Image URLs are valid URLs | `tests/gallery.test.js` | All `imageUrl` values start with `https://` |
| Gallery component renders | `tests/gallery.test.js` | Component output contains `<section` and at least one `<img` |
| Carousel has scroll-snap | `tests/gallery.test.js` | Container CSS includes `scroll-snap-type: x mandatory` |

### 4.2 Green Phase — Implementation

- Create `gallery.json` with 8–10 painting entries
- Build `Gallery.astro` component with carousel markup and interactivity
- Integrate into `index.astro`
- Add section metadata to `content.json`

### 4.3 Refactor Phase — Optimization

- Add image error fallback (placeholder SVG if Wikimedia image fails to load)
- Preload first 2 images with `<link rel="preload">` for LCP optimization
- Add `will-change: transform` on carousel container during active scroll
- Consider adding a lightbox mode for full-size viewing on click

---

## 5. Acceptance Criteria

- [ ] Gallery section appears on the main page with 8–10 Van Gogh paintings
- [ ] Each painting card shows image, title, year, and description
- [ ] Carousel scrolls horizontally with smooth scroll-snap
- [ ] Arrow buttons work on desktop (left/right navigation)
- [ ] Swipe gestures work on mobile
- [ ] Progress dots update to show current position
- [ ] Images are lazy-loaded (don't load until near viewport)
- [ ] Gallery uses existing design tokens (no new colors/fonts)
- [ ] Section has proper heading and intro text from content.json
- [ ] All unit tests pass
- [ ] No console errors

---

## 6. Dependencies & Risks

**Dependencies:**
- Wikimedia Commons image URLs must be verified and stable (they are — Wikimedia is highly reliable)
- `content.json` must be updated with gallery section metadata
- Page must have enough height for the new section (no layout overflow issues)

**Risks:**
- **Wikimedia hotlink blocking**: Wikimedia allows hotlinking, but if they change policy, images break. Mitigation: Add error fallback with placeholder SVG.
- **Image load time**: High-res images may be slow on poor connections. Mitigation: Lazy loading + progressive JPEGs from Wikimedia.
- **Content.json bloat**: Adding gallery metadata to content.json is minimal risk — it's a small addition.
- **Carousel accessibility**: Ensure keyboard navigation and ARIA labels are present for screen readers.

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Van Gogh painting gallery carousel — browse famous artworks with themed descriptions",
  "changes": [
    "Added gallery.json with 8-10 Van Gogh painting entries",
    "Created Gallery.astro component with horizontal scroll carousel",
    "Swipe navigation on mobile, arrow buttons on desktop",
    "Lazy-loaded images from Wikimedia Commons",
    "Scroll-snap alignment and progress dot indicators",
    "Integrated gallery section into main page"
  ]
}
```
