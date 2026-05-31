# PRD: Van Gogh Color Palette Explorer

> **ID:** idea-049
> **Category:** Content
> **Priority:** low
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-06-01

---

## 1. Overview

**One-liner:** An interactive color palette widget that lets visitors explore the dominant colors from Van Gogh's famous paintings, with each palette revealing the painting's story and how those colors connect to the site's 5 themes.

**Problem:** The site has 5 color schemes (starry-night, sunflower, midnight-wave, tulip-garden, moonlit-silver) but visitors have no way to explore the actual historical palettes behind them or learn about Van Gogh's color theory.

**Solution:** A data-driven color palette explorer rendered as a new scroll-triggered section. Each of Van Gogh's iconic paintings (Starry Night, Sunflowers, Irises, Almond Blossom, Wheatfield with Crows) is represented as a card showing its 5 dominant colors as large swatches. Clicking a swatch reveals the color's hex code, name, and a short note about its emotional/artistic significance. Painting cards are driven by a JSON data file so they can be updated independently. Purely content-driven — no Three.js changes.

---

## 2. User Stories

- As a visitor, I want to see the dominant colors from famous Van Gogh paintings displayed as beautiful color swatches, so I can appreciate his color choices.
- As a visitor, I want to click a color swatch to learn its name and artistic significance, so I understand Van Gogh's color theory.
- As a visitor, I want to see how each painting's palette connects to the site's themes, so the color scheme switcher feels more meaningful.
- As a content editor, I want to add or modify painting palettes by editing a JSON file, so I don't need to touch code.

---

## 3. Technical Specification

### 3.1 Architecture

**New files:**
- `src/content/palettes/paintings.json` — Data file with painting palettes and metadata
- `src/content/palettes/index.json` — Index file listing all paintings and their order
- `public/js/palette-explorer.js` — Standalone module for the UI interaction (loaded in BaseLayout)
- A new section block in `index.astro` within the existing data-driven sections loop (or as a new content section)

**Existing modules it depends on:**
- `siteData.json` — to cross-reference color scheme names
- `content.json` — section text/heading for the palette section
- Astro's static generation — paintings.json is imported at build time

**Does NOT modify:** `scene-init.js`, Three.js scene, or any existing JS modules

### 3.2 Implementation Details

#### Step 1: Create the palette data files
- File: `src/content/palettes/paintings.json`
- What to do:
  - Define an array of painting objects:
    ```json
    [
      {
        "id": "starry-night",
        "title": "The Starry Night",
        "year": 1889,
        "palette": [
          { "hex": "#1B2A4A", "name": "Midnight Blue", "note": "The deep blue of night — Van Gogh wrote that stars made him dream." },
          { "hex": "#4A6FA5", "name": "Cerulean Swirl", "note": "Swirling brushstrokes in blue convey restless energy." },
          { "hex": "#F4D03F", "name": "Star Gold", "note": "Chrome yellow mixed with zinc white — the most luminous pigment available." },
          { "hex": "#2E4057", "name": "Cypress Shadow", "note": "Dark blue-green for the towering cypress, a flame of darkness." },
          { "hex": "#F5E6CC", "name": "Village Warmth", "note": "Warm white with ochre — the humble windows glowing below." }
        ],
        "connection": "starry-night",
        "quote": "Looking at the stars always makes me dream."
      }
    ]
    ```
  - Create 5 paintings matching the 5 site color schemes:
    - "starry-night" → The Starry Night (1889)
    - "sunflower" → Sunflowers (1888)
    - "midnight-wave" → The Sea at Saintes-Maries (1888)
    - "tulip-garden" → Irises (1889) — violet/blue/green palette
    - "moonlit-silver" → Almond Blossom (1890) — white/blue/silver accents
- Expected outcome: A rich JSON data file with historically-informed palettes

#### Step 2: Create the palette explorer UI
- File: `public/js/palette-explorer.js`
- What to do:
  - On DOMContentLoaded, find the palette section element (id: `#palettes`)
  - For each painting in the loaded data, render a card:
    - Painting title + year as header
    - 5 color swatches as horizontal bars (each equal width, ~60px height)
    - Swatches show the hex color as background
    - Below palettes: connection badge linking to theme ("Part of the Sunflower theme")
  - On swatch click: expand a detail panel below the swatch:
    - Shows hex code (with click-to-copy), color name, and artistic note
    - Other cards collapse (accordion behavior)
    - Smooth expand/collapse via `grid-template-rows` or `max-height` CSS transition
  - On painting card header click: show Van Gogh quote related to the painting
- Expected outcome: Interactive, beautiful palette cards with educational content

#### Step 3: Style the palette section
- File: `public/js/palette-explorer.js` (inline styles) OR add rules to `public/css/main.css`
- What to do:
  - Painting cards: `display: grid` layout with subtle borders matching `--text-tertiary`
  - Color swatches: `height: 60px; cursor: pointer; transition: transform 0.2s`
  - Swatch hover: `transform: scaleY(1.15)` to emphasize the color
  - Detail panel: `background: rgba(255,255,255,0.03); padding: 16px; border-radius: 8px`
  - Hex code: `--font-mono` style (monospace), with 📋 copy icon
  - Quote: styled as existing site quotes (serif, italic, `--accent-gold`)
- Expected outcome: Seamless visual integration with the existing site design

#### Step 4: Add to the content pipeline
- File: `src/content/content.json`
- What to do:
  - Add a new section entry under `sections.palettes`:
    ```json
    {
      "label": "VI. Color",
      "heading": "The <em>Palettes</em> of Van Gogh",
      "intro": "Van Gogh didn't just paint — he orchestrated color. Each palette reveals his emotional state and artistic vision...",
      "palettes": true
    }
    ```
- What to do in `index.astro`:
  - Add `palettes` to the sections array in frontmatter
  - Add a conditional block: `{% if section.palettes %}` renders the palette section with an empty container div (`id="palette-container"`) that `palette-explorer.js` populates
  - The paintings.json data is imported and passed as a JSON script tag:
    ```astro
    <script type="application/json" id="palette-data">
      {JSON.stringify(paintings)}
    </script>
    ```
- Expected outcome: Palette section appears in the content flow, data-driven like other sections

### 3.3 Mobile Considerations

- Painting cards stack vertically on mobile
- Color swatches reduced to 40px height
- Detail panel becomes full-width overlay instead of inline expansion
- Copy-to-clipboard uses `navigator.clipboard.writeText()` with fallback to `document.execCommand('copy')`
- Touch-friendly tap targets (min 44px)
- Performance: No JS animation beyond CSS transitions — near-zero cost

### 3.4 Data Structures

```json
{
  "id": "sunflowers",
  "title": "Sunflowers",
  "year": 1888,
  "palette": [
    {
      "hex": "#E8A317",
      "name": "Chrome Yellow",
      "note": "Van Gogh's signature pigment — he used it so heavily it became his artistic identity.",
      "pigment": "Lead chromate"
    },
    {
      "hex": "#C48900",
      "name": "Deep Ochre",
      "note": "The dying petals — Van Gogh painted sunflowers at every stage of life.",
      "pigment": "Yellow ochre"
    }
  ],
  "connection": "sunflower",
  "quote": "The sunflower is mine, in a way.",
  "source": "Musée d'Orsay / Wikipedia Commons"
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| paintings.json has 5 entries | `tests/palettes.test.js` | `paintings.length === 5` |
| Each painting has 5 colors | `tests/palettes.test.js` | Every entry has `palette.length === 5` |
| Each hex code is valid format | `tests/palettes.test.js` | Matches `/^#[0-9A-Fa-f]{6}$/` |
| Each painting has a connection to a site theme | `tests/palettes.test.js` | `connection` value is one of the 5 color scheme names |
| Palette cards render on init | `tests/palette-explorer.test.js` | Number of `.palette-card` elements === 5 |
| Clicking swatch shows detail | `tests/palette-explorer.test.js` | Detail panel visible after swatch click |
| Clicking another swatch collapses previous | `tests/palette-explorer.test.js` | Only one detail panel open at a time |
| Clicking hex code copies to clipboard | `tests/palette-explorer.test.js` | `navigator.clipboard.writeText` called with hex value |

### 4.2 Green Phase — Implementation

- Create `src/content/palettes/paintings.json` with 5 painting entries
- Create `public/js/palette-explorer.js` with:
  - `PaletteExplorer` class (init, renderCards, bindEvents)
  - Accordion logic for detail panels
  - Clipboard copy with fallback
- Update `content.json` with palette section metadata
- Update `index.astro` to include palette section in the loop

### 4.3 Refactor Phase — Optimization

- Lazy-load `palette-explorer.js` only when the palette section enters viewport (IntersectionObserver)
- Pre-compute luminance for each swatch to auto-contrast text (light swatches get dark text)
- Add keyboard navigation (Tab between swatches, Enter to expand)

---

## 5. Acceptance Criteria

- [ ] `src/content/palettes/paintings.json` contains 5 paintings with historically-informed palettes
- [ Each painting card shows title, year, and 5 color swatches
- [ ] Clicking a color swatch reveals hex code, color name, and artistic note
- [ ] Accordion behavior: only one swatch detail open at a time
- [ ] Clicking hex code copies it to clipboard
- [ ] Each painting card shows which site theme it connects to
- [ ] Clicking painting title shows a Van Gogh quote
- [ ] Palette section integrates into the existing content flow via `index.astro`
- [ ] Mobile-responsive: swatches and cards adapt to narrow viewports
- [ ] No modifications to `scene-init.js`
- [ ] Color swatches have proper contrast for text overlays
- [ ] Works without JavaScript enhancement (cards still show as static colored bars)

---

## 6. Dependencies & Risks

**Dependencies:** None beyond the existing Astro build pipeline. `paintings.json` is imported at build time — no runtime API calls.

**Risks:**
- Van Gogh painting images may raise copyright concerns → Mitigation: only use color data (hex values), no painting images. Quotes are public domain.
- Color accuracy of historical pigments → Mitification: add a disclaimer that colors are approximations based on digital reproductions.
- `navigator.clipboard` requires HTTPS → Mitigation: fallback to `document.execCommand('copy')` for HTTP/localhost
- Palette section adds height to the page → Mitigation: cards use `content-visibility: auto` for off-screen cards

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Van Gogh Color Palette Explorer — interactive color swatches from 5 iconic paintings",
  "changes": [
    "Added src/content/palettes/paintings.json (5 painting palettes, data-driven)",
    "Added public/js/palette-explorer.js (standalone module)",
    "Click-to-expand color details: hex code, pigment name, artistic notes",
    "Themed palette-to-site-scheme cross-references",
    "Clipboard copy for hex codes with fallback",
    "New content section in index.astro data loop"
  ]
}
```
