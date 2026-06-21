# AGENTS.md — Atrijā Website Project

> **Read this first** before making any changes to this project.

## Critical Rules

### 0. Use CodeGraph for Code Intelligence
CodeGraph is installed globally and provides semantic code search via MCP.
Before exploring the codebase with grep/read, **always try CodeGraph first**:

```bash
# Search for symbols
codegraph query "symbol_name" --kind function --limit 10

# Get context for a task (outputs markdown with relevant code)
codegraph context "How does X work?" --format markdown

# Find callers/callees
codegraph callers "function_name"
codegraph callees "function_name"

# Check impact before changing a symbol
codegraph impact "symbol_name"

# Find affected tests
codegraph affected src/file.ts

# List indexed files
codegraph files

# Re-index after large changes
codegraph index --force
```

**Why:** CodeGraph gives pre-indexed knowledge graph — ~25% cheaper, ~62% fewer tool calls vs grep/read exploration. The index is in `.codegraph/` (per-project). Auto-syncs via file watcher.

### 1. ALWAYS Pull Before Making Changes
```bash
cd /root/projects/van-gogh-site
git fetch origin
git pull origin master
```
**Never** start working without pulling first. The cron jobs may have pushed changes.

### 2. Build and Deploy After Changes
```bash
cd /root/projects/van-gogh-site
npm run build
cp -r dist/* /data/data/com.termux/files/usr/share/nginx/html/
```

**Cache strategy (handled by nginx + service worker — do NOT add manual cache-busting):**
- `index.html`: `no-cache, no-store, must-revalidate` + `Pragma: no-cache` — NEVER cached
- `_astro/*` (Vite-bundled JS/CSS with content hashes): `max-age=31536000, immutable` — 1 year
- `css/*`, `js/*` (public assets): `max-age=3600, must-revalidate` — 1 hour
- `images/*` (SVG, PNG): `max-age=2592000` — 30 days
- `content/*.json`: `max-age=300, must-revalidate` — 5 minutes
- Fonts: `max-age=604800` — 7 days
- Service Worker (`public/sw.js`): `networkFirst` for HTML navigation + JSON, `cache-first` for hashed assets. Bump `CACHE_NAME` version when PRECACHE_URLS changes.

**User cache-busting strategy (for returning users with stale assets):**
1. **Service Worker** — `networkFirst` for navigation requests means HTML shell is always fresh from network
2. **Vite content hashing** — `_astro/*` filenames change when content changes (automatic bust)
3. **Nginx `no-store` on HTML** — browsers never cache the entry point
4. **SW cache auto-bump** — Every `npm run build` runs `scripts/bump-sw-cache.js` which increments `CACHE_NAME` (e.g., `atrija-shell-v3` → `v4`). This invalidates the old SW cache on every deploy. Do NOT manually set the version — it's automatic.

**No manual cache-busting needed** — Vite hashes bundled filenames automatically. Nginx serves correct headers per path. Do NOT run `hash-assets.sh` or `BUILD_VERSION` sed — these break the build.

### 2b. Cache Strategy
Nginx handles all cache headers per file type/path (see `/etc/nginx/nginx.conf`). Vite handles content hashing for bundled assets (`_astro/*`). No manual cache-busting needed.

| Asset type | Cache-Control |
|---|---|
| `index.html` | `no-cache, no-store, must-revalidate` |
| `_astro/*` (Vite-bundled) | `public, max-age=31536000, immutable` |
| `*.css` | `public, max-age=3600, must-revalidate` |
| `*.js` | `public, max-age=3600, must-revalidate` |
| `*.svg, *.png, etc` | `public, max-age=2592000` (30 days) |
| `*.woff2, etc` | `public, max-age=604800` (7 days) |
| `*.json` | `public, max-age=300, must-revalidate` (5 min) |

**Do NOT run `hash-assets.sh` or `BUILD_VERSION` sed** — these break the build.

### 3. Git Commit Convention
Use semantic commit messages: `feat:`, `fix:`, `refactor:`, `perf:`, `chore:`, `style:`, `docs:`

### 3b. ALWAYS Commit and Push After Code Changes
```bash
cd /root/projects/van-gogh-site
git add -A
git commit -m "semantic: message"
git push origin master
```
**Never** leave changes uncommitted. Even small fixes must be committed and pushed immediately. This ensures cron jobs and other agents always work with the latest code.

### 4. Never Stop Critical Services
- hermes-gateway (PID 5334), cloudflared (PID 5474), nginx (PID 5414), sshd (PID 5416)

### 5. Never Reboot the System

### 6. Cron Job Safety Rules (CRITICAL FOR ALL AUTONOMOUS AGENTS)

**These rules apply to ALL cron jobs and autonomous agents working on this project.**

#### 6a. Scene Code is SACRED
- **NEVER modify `src/js/scene/` modules** unless explicitly instructed by the user
- The scene is built as a separate Vite bundle (`vite-scene.config.js`) that outputs `public/js/scene-bundle.js`
- Source modules are in `src/js/scene/` — 14 ES modules using bare `three` imports (npm, not CDN)
- Build pipeline: `npm run build` = copy-content → vite scene bundle → astro build
- **If you break scene code, the entire 3D scene breaks**
- **Before modifying any scene file**: understand ALL imports/callers via CodeGraph first
- If you need to test scene changes: run `npm run build` (full build includes scene bundle)
- `scene-bundle.js` in `public/js/` is a BUILD OUTPUT — never edit it directly

#### 6a2. NO TEMP FIXES — Root Cause Only (CRITICAL)
- **NEVER apply temporary workarounds** (CDN fallbacks, inline hacks, commented-out code, sed hacks)
- If something is broken, find the ROOT CAUSE and fix it properly
- If a fix requires architecture changes, make the architecture changes — don't paper over the problem
- "Quick fixes" that don't address root causes WILL be reverted
- If you're not confident in a proper fix, ASK first — don't deploy a workaround
- This applies to ALL cron jobs and autonomous agents

#### 6b. Never Revert to Old Commits
- **NEVER run `git revert`, `git reset --hard`, or `git checkout <old-commit>`** unless explicitly instructed
- Previous sessions have broken things by reverting to old commits that removed features
- If something is broken, fix it forward — don't revert

#### 6c. Never Remove Post-Processing Shaders
- The EffectComposer pipeline (painted + Glitch passes) provides the layered/painted visual effect
- **NEVER remove or disable these shaders** — they are the core visual identity of the site
- If shaders cause issues on specific devices, add graceful fallbacks instead of removing them

#### 6d. Never Convert Three.js to SVG or Canvas
- Three.js 3D elements must remain as Three.js — never convert to SVG, Canvas 2D, or static images
- The 3D scene is the primary feature of this website

#### 6d2. Never Re-implement Painting Gallery
- The Gallery component (idea-021) was explicitly removed by user request
- Do NOT create any painting gallery, artwork carousel, or image gallery section
- The site is about the 3D experience, not showcasing external paintings
- This applies to ALL cron jobs and autonomous agents

#### 6e. Content Mutation Rules for Daily Cron
The `van-gogh-daily-mutate` job makes VISIBLE, IMPACTFUL daily changes. Allowed modifications:
- `src/content/siteData.json` — facts, quotes, color schemes, themes
- `src/content/content.json` — section text, imageCard refs, fact refs, changelog
- `public/mutation-assets/YYYY-MM-DD/` — temporary visual assets (SVG, images, video)

**MUST make dramatic visible changes daily:**
- Rewrite hero tagline completely (most visible element)
- Rotate/reorder color schemes (recolors entire site)
- Rewrite all 5 section headings with fresh poetic language
- Rotate facts/quotes to different parts of arrays (not just +1)
- Fully rewrite Today section (heading + intro)
- Generate one temporary visual asset per day (SVG preferred)

**Visual Assets:**
- Generated in `public/mutation-assets/YYYY-MM-DD/` (one folder per day)
- Types: SVG illustration (preferred), image/graphic, video/animation, ASCII art
- Must match impressionist aesthetic and current color palette
- Max 100KB per asset
- Self-cleaning: next day's mutation replaces old assets
- Referenced in `content.json` via `sections.today.visualAsset`
- Do NOT modify core theme, CSS, JS, or templates to display assets

**NEVER modify:** `scene-init.js`, `scene/` modules, `BaseLayout.astro`, `index.astro`, `main.css`, or any JS/CSS files

#### 6f. Background Implementer Constraints
- The `van-gogh-background-implement` job should ONLY implement tasks from the kanban backlog
- **NEVER implement tasks that modify `scene-init.js`** unless the task was explicitly created and approved by the user
- Before implementing any task that touches `public/js/`, verify with: `git log --oneline -5 -- public/js/scene-init.js` to understand recent changes
- Always run `npm run build` after any code change and verify it succeeds before deploying

#### 6g. Git Pull Build Safety
- The `van-gogh-git-pull-build` job should ALWAYS `git stash` before pulling, then `git stash pop` after
- If there are conflicts, DO NOT force-resolve — abort and notify the user
- After pulling, always run `npm run build` to verify the build still works

#### 6h. Verify Before Deploying
- After ANY code change, run: `npm run build` and verify exit code is 0
- After building, verify: `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8080/` returns 200
- If build fails, DO NOT deploy — fix the issue first

#### 6i. Kanban Generate Constraints
- The `van-gogh-kanban-generate` job should ONLY add new ideas to the backlog
- **NEVER auto-implement ideas** — implementation requires user approval
- New ideas should be well-scoped and not conflict with existing features

---

## Project Overview
- **Name**: Atrijā (अत्रिज) — impressionist philosophy website
- **Framework**: Astro 4 (Static Site Generation)
- **3D Engine**: Three.js (npm `three@0.160`), bundled separately via Vite into `public/js/scene-bundle.js`
- **Scene Source**: `src/js/scene/` — 14 ES modules with bare `three` imports
- **Build Pipeline**: `npm run build` = copy-content → `vite build --config vite-scene.config.js` → `astro build`
- **Scene Loading**: `<script type="module" src="/js/scene-bundle.js" defer>` in index.astro body, auto-boots on load
- **Design**: Dark theme (#08080f), impressionist aesthetic, GLSL post-processing
- **Deploy**: Nginx on port 8080, root `/data/data/com.termux/files/usr/share/nginx/html`

---

## Content Architecture (IMPORTANT)

### Two Content Files

1. **`src/content/siteData.json`** — Themes, color schemes, facts, quotes
   - 5 themes: Moon, Ego, Bhagavad Gita, Shiv Purana, Art & Beauty
   - 5 color schemes: starry-night, sunflower, midnight-wave, tulip-garden, moonlit-silver
   - Each theme has `.facts[]` and `.quotes[]`
   - Daily rotation via `dayOfYear % length`

2. **`src/content/content.json`** — **Text content updated by cron jobs**
   - `sections.hero.tagline` — Hero tagline HTML (rewritten daily)
   - `sections.today.heading` — Today section heading
   - `sections.today.visualAsset` — Daily visual asset: `{ type, path, description }`
   - `sections.{moon,philosophy,gita,shiva,art}` — Each section's:
     - `label` — Roman numeral label (e.g., "I. The Moon")
     - `heading` — Section heading with `<em>` emphasis (rewritten daily)
     - `intro` — Intro paragraph text
     - `imageCard` — `{themeIndex, factIndex}` for the image card
     - `facts` — `{themeIndex, slice: [start, end]}` for fact cards
     - `quote` — `{themeIndex, quoteIndex}` for the quote
   - `changelog` — Version + entries (updated by daily cron)
   - `meta` — `{ version, lastUpdated, updatedBy, season }`

### How index.astro Uses Content
```astro
import siteData from '../content/siteData.json';
import content from '../content/content.json';
const sec = content.sections;
// Section headings: <h2 set:html={sec.moon.heading}>
// Section intros: <p set:html={sec.moon.intro}>
// Image cards: fact from siteData.themes[sec.moon.imageCard.themeIndex].facts[sec.moon.imageCard.factIndex]
// Fact cards: slice from siteData.themes[sec.moon.facts.themeIndex].facts
// Quotes: siteData.themes[sec.moon.quote.themeIndex].quotes[sec.moon.quote.quoteIndex]
```

---

## File Structure
```
src/
  content/
    siteData.json    — Themes, colors, facts, quotes (structured data)
    content.json     — Section text content (updated by cron)
    changelog/       — Date-based changelog files (YYYY-MM-DD.json + index.json)
  layouts/
    BaseLayout.astro — Global layout, HTML shell, flute button, critical CSS
  pages/
    index.astro      — Main page, data-driven sections, uses both content files
public/
  css/
    main.css         — All design tokens, layout, components (cached 1yr immutable)
    loader.css       — Loading screen styles
  js/
    scene-bundle.js  — BUILD OUTPUT (Vite self-contained bundle: three.js + all scene modules)
    changelog-app.js — Changelog UI
    moon-phase.js    — Moon phase display
    quote-carousel.js— Quote carousel
    loader-progress.js — Loader progress bar
  mutation-assets/   — Daily visual assets (auto-generated)
    YYYY-MM-DD/      — One folder per day
.hermes/
  kanban.json        — Idea board for TDD workflow
  refactoring-plan.md — Refactoring audit and plan
scripts/
  daily-mutate.js    — Daily color/content mutation (updates siteData.json + content.json)
  daily-deploy.sh    — Full mutation → build → deploy pipeline
```

## CSS Architecture
- **Critical above-fold CSS**: Inline in BaseLayout.astro (body bg, canvas-container bg)
- **Main stylesheet**: `public/css/main.css` — all design tokens, layout, components, responsive
- **Loader stylesheet**: `public/css/loader.css` — loading screen
- **Cache strategy**: main.css served with `Cache-Control: max-age=31536000, immutable` (filename hashed by Vite for bundled assets; main.css in public/ uses query string versioning)

## Three.js Scene Architecture

### Build Pipeline
1. Source modules: `src/js/scene/*.js` — 14 ES modules, bare `three` imports (npm)
2. Bundle: `vite build --config vite-scene.config.js` → `public/js/scene-bundle.js` (692KB, includes three.js)
3. Deploy: Astro copies `public/js/` to `dist/js/`
4. Load: `<script type="module" src="/js/scene-bundle.js" defer>` in `index.astro`
5. Auto-boot: `scene-bootstrap.js` detects browser and auto-calls `bootScene()` on DOMContentLoaded

### Scene Modules (`src/js/scene/`)
- `scene-bootstrap.js` — Entry point, bootScene() function, initializes all objects
- `scene-manager.js` — VanGoghScene class (renderer, camera, animation loop)
- `scene-config.js` — Config constants (SSR-safe: all browser APIs guarded)
- `scene-objects.js` — All 3D objects (stars, sunflowers, lilies, flute, notes, fireflies, etc.)
- `scene-moon.js` — Moon mesh with procedural craters and glow
- `scene-flowers.js` — Canvas texture sprite generation (sunflowers, lilies)
- `scene-painting.js` — Painting reveal effect
- `scene-notes.js` — Music note sprites
- `scene-interaction.js` — Mouse/touch interaction
- `scene-utils.js` — Utility functions (moon phase, etc.)
- `scene-swirl-sky.js` — Swirl sky shader
- `scene-lighting.js` — Lighting setup

### File Descriptions
    scene-bootstrap.js — bootScene() entry point (auto-boots in browser)
    scene-bundle.js    — Build output (Vite-bundled scene + three.js) — DO NOT EDIT

## Section Architecture (index.astro)
- 5 content sections generated from data-driven loop (`sections` array in frontmatter)
- Each section has: id, key, image, carousel flag
- Sections with carousel (moon, philosophy, gita): quote-carousel with auto-rotation
- Sections without carousel (shiva, art): single quote-block
- All section content comes from `content.json` via `sec[key]`
- All facts/quotes come from `siteData.json` via theme/quote indices

## Changelog System

Changelog entries are stored as **date-based files** in `src/content/changelog/` (copied to `public/changelog/` for static serving):

```
src/content/changelog/
  index.json           — Master index: version, dates metadata, entry counts
  2026-05-14.json      — All entries for May 14
  2026-05-15.json      — All entries for May 15
```

### Entry Format (per date file)
```json
{
  "date": "2026-06-09",
  "entries": [
    {
      "time": "06:00:00",
      "type": "daily-mutation",
      "description": "Daily mutation #161: lily-garden colors, new tagline, headings rewritten, SVG asset",
      "changes": [
        "Color scheme: lily-garden (passionate summer)",
        "Hero tagline: 'Where twilight gathers the day's last glow'",
        "All 5 section headings rewritten",
        "Fact/quote indices rotated across all sections",
        "Today section fully rewritten",
        "Visual asset: midsummer-meadow.svg (224KB)"
      ]
    }
  ]
}
```

### Index Format
```json
{
  "version": "1.8.5",
  "lastUpdated": "2026-06-09T12:12:00.000Z",
  "totalEntries": 29,
  "dates": [
    { "date": "2026-06-09", "entries": 1, "latestType": "daily-mutation", "description": "..." }
  ]
}
```

### Entry Types
- `daily-mutation` — content changes (tagline, colors, headings, facts, quotes, visual assets)
- `feature` — new features from kanban implementation
- `fix` — bug fixes
- `content` — content-only changes (intros, rotations)
- `design` — visual/layout changes
- `refactor` — code refactoring
- `perf` — performance improvements
- `chore` — maintenance tasks

### Rules
- Each date file contains all entries for that date, sorted by time
- Index keeps only last 30 dates (oldest auto-pruned)
- Same-day entries are differentiated by `time` field
- UI loads index first, then lazy-loads date files on click-to-expand
- Changelog UI supports click/keyboard to expand individual date cards

### Updating
- `van-gogh-daily-mutate` writes to `src/content/changelog/YYYY-MM-DD.json`, updates `index.json`, syncs to `public/changelog/`, AND syncs to `content.json`'s changelog field
- `van-gogh-background-implement` writes implementation entries to the same date files
- `van-gogh-git-pull-build` writes build/deploy entries
- `content.json`'s changelog is auto-synced: deduplicated by (date+type), max 15 entries, sorted chronologically
- The website reads changelog from `content.json` at build time (imported by index.astro)
| Job | Schedule | Purpose |
|-----|----------|---------|
| `van-gogh-kanban-generate` | 2 AM daily | Generate ideas + PRDs (full code review first) |
| `van-gogh-kanban-review` | 3 AM daily | Review all PRDs for quality, feasibility, design alignment |
| `van-gogh-background-implement` | 3AM + 4PM daily | Implement kanban tasks via TDD (with full testing protocol) |
| `van-gogh-daily-mutate` | 6 AM daily | Content mutation — dramatic visible changes + visual assets → build → deploy |
| `van-gogh-daily-deploy` | 6 AM daily | Backup deploy (only if mutate hasn't deployed in 1h) |
| `van-gogh-implementation-review` | 6AM + 7PM daily | Verify completed implementations (3h after implement) |
| `van-gogh-content-layout-refresh` | 12 PM daily | Midday content refresh — rotate intros/quotes, clean old assets |
| `van-gogh-git-pull-build` | Every 3h | Git pull + conditional build + changelog |

**IMPORTANT**: All cron jobs are pure Hermes agent prompts. Do NOT call `hermes agent` subprocesses or shell scripts from within cron jobs — this causes libuv assertion crashes on Cybertron Linux. Do all work directly using file tools.

---

## Design Tokens (in BaseLayout.astro `:root`)
- **Colors**: `--bg`, `--text-primary`, `--text-secondary`, `--text-tertiary`, `--accent-gold`, `--accent-blue`, `--accent-coral`, `--accent-violet`, `--sage`
- **Typography**: `--text-xs` through `--text-hero` (1.25 ratio)
- **Spacing**: `--space-xs` through `--space-3xl`
- **Fonts**: `--font-serif` (Cormorant Garamond), `--font-sans` (Inter), `--font-devanagari` (Noto Sans Devanagari)

---

## Three.js Scene (scene-init.js)
- Stars: 2500 desktop / 1500 mobile, custom twinkling shader with size + brightness oscillation
- Moon: Slow orbit + self-rotation, glow effect, foreground canvas-painted artistic moon overlay
- Sunflowers & Tulips: Billboard technique (flower heads face camera via `lookAt()`)
- Flute: 3D model with hover animation, click spawns music notes globally
- Music notes: 30 desktop / 40 mobile, floating sprites
- Waves: GLSL shader, 64×64 segments desktop / 32×32 mobile
- Post-processing: painted-style shader (skipped on mobile/low-end)

---

## Updating Text Content
To update the website text content, edit **`src/content/content.json`**:
- Change `sections.*.heading` for section headings
- Change `sections.*.intro` for intro paragraphs
- Change `sections.*.imageCard` to point to different facts
- Change `sections.*.facts.slice` to show different fact ranges
- The daily cron job (`daily-mutate.js`) also updates this file

---

## Nginx Config
- Config: `$PREFIX/etc/nginx/nginx.conf` (Termux)
- Root: `/data/data/com.termux/files/usr/share/nginx/html/`
- Port: 8080
- Reload: `kill -HUP <master_pid>`
- Verify: `curl http://127.0.0.1:8080/` (NOT localhost)
- **Termux SELinux constraint**: nginx MUST run as `user root;` (not `nobody`). Android SELinux blocks the `nobody` worker from accessing `app_data_file` contexts in `/data/data/com.termux/`. Ifnginx stops responding, check: `ps aux | grep nginx` → restart with `nginx -c $PREFIX/etc/nginx/nginx.conf`.
- **sendfile**: Must be `off` on Termux (known Android filesystem incompatibility).
- **Duplicated public/js/ assets**: After deploying with `cp -r dist/*`, check that `public/js/` has NOT accumulated duplicate copies of `changelog/`, `content/`, `css/`, `images/`, `mutation-assets/`, or `sw.js` from the `public/` root. These are build artifacts that should only exist in `public/`, not `public/js/`. Remove them if present.
