# AGENTS.md — Van Gogh Website Project (Atrijā)

> **Read this first** before making any changes to this project.

## Critical Rules

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
# Inject cache-busting version for scene-init.js
BUILD_VERSION=$(date +%s)
sed -i "s/BUILD_VERSION/$BUILD_VERSION/g" dist/index.html
cp -r dist/* /data/data/com.termux/files/usr/share/nginx/html/
```

### 2b. Cache Strategy
- **HTML**: `no-cache` — always fresh, users see latest build immediately
- **CSS/JS (bundled by Vite)**: 1 year immutable — filename hash changes on rebuild
- **scene-init.js (public/)**: cache-busted via `?v=TIMESTAMP` on each deploy
- **Images/SVG**: 30 days
- **JSON content**: 5 min (cron updates picked up quickly)
- **Gzip**: enabled for HTML, CSS, JS, JSON, SVG

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

---

## Project Overview
- **Name**: Atrijā (अत्रिज) — Van Gogh impressionist philosophy website
- **Framework**: Astro 4 (Static Site Generation)
- **3D Engine**: Three.js loaded from CDN (esm.sh) in `public/js/scene-init.js`
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
   - `sections.hero.tagline` — Hero tagline HTML
   - `sections.today.heading` — Today section heading
   - `sections.{moon,philosophy,gita,shiva,art}` — Each section's:
     - `label` — Roman numeral label (e.g., "I. The Moon")
     - `heading` — Section heading with `<em>` emphasis
     - `intro` — Intro paragraph text
     - `imageCard` — `{themeIndex, factIndex}` for the image card
     - `facts` — `{themeIndex, slice: [start, end]}` for fact cards
     - `quote` — `{themeIndex, quoteIndex}` for the quote
   - `changelog` — Version + entries (updated by daily cron)

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
  layouts/
    BaseLayout.astro — Global layout, CSS, HTML shell, flute button, moon container
  pages/
    index.astro      — Main page, all sections, uses both content files
public/
  js/
    scene-init.js    — Three.js scene (stars, moon, sunflowers, tulips, flute, waves, notes)
  images/
    moon.svg, sunflowers.svg, tulips.svg, flute.svg, stars.svg, waves.svg
  css/
    loader.css       — Loading screen styles
  assets/            — Generated assets
.hermes/
  kanban.json        — Idea board for TDD workflow
scripts/
  daily-mutate.js    — Daily color/content mutation (updates siteData.json + content.json)
  daily-deploy.sh    — Full mutation → build → deploy pipeline
  kanban-generate.sh — [DEPRECATED] Replaced by pure agent cron job
```

---

## Changelog Architecture

Changelog entries are stored as **date-based files** in `src/content/changelog/` (copied to `public/changelog/` for static serving):

```
src/content/changelog/
  index.json           — Master index: dates metadata, entry counts
  2026-05-14.json      — All entries for May 14
  2026-05-15.json      — All entries for May 15
```

### Entry Format (per date file)
```json
{
  "date": "2026-05-15",
  "entries": [
    {
      "time": "06:00:00",
      "type": "daily-mutation",
      "description": "Daily mutation #135: ...",
      "changes": ["change 1", "change 2"]
    }
  ]
}
```

### Index Format
```json
{
  "version": "1.2.0",
  "lastUpdated": "2026-05-15T13:00:00Z",
  "totalEntries": 6,
  "dates": [
    { "date": "2026-05-15", "entries": 3, "latestType": "daily-mutation", "description": "..." }
  ]
}
```

### Rules
- Each date file contains all entries for that date, sorted by time
- Index keeps only last 30 dates (oldest auto-pruned)
- Same-day entries are differentiated by `time` field
- UI loads index first, then lazy-loads date files on demand
- "Load More" button fetches older dates in batches of 5

### Updating
- `daily-mutate.js` writes to `src/content/changelog/YYYY-MM-DD.json`, updates `index.json`, syncs to `public/changelog/`, AND syncs consolidated entries back to `content.json`'s changelog field (for website display at build time)
- Other cron jobs (background-implement, git-pull-build) write to the same date-based files and sync to `content.json`
- `content.json`'s changelog is auto-synced: deduplicated by (date+type), max 15 entries, sorted chronologically
- The website reads changelog from `content.json` at build time (imported by index.astro)
| Job | Schedule | Purpose |
|-----|----------|---------|
| `van-gogh-kanban-generate` | 2 AM daily | Generate ideas + PRDs (full code review first) |
| `van-gogh-kanban-review` | 3 AM daily | Review all PRDs for quality, feasibility, design alignment |
| `van-gogh-background-implement` | 3AM + 4PM daily | Implement kanban tasks via TDD |
| `van-gogh-implementation-review` | 6AM + 7PM daily | Verify completed implementations (3h after implement) |
| `van-gogh-daily-mutate` | 6 AM daily | Content mutation → build → deploy |
| `van-gogh-daily-deploy` | 6 AM daily | Backup deploy (only if mutate hasn't deployed in 1h) |
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
- Moon: Slow orbit + self-rotation, glow effect, ASCII art overlay with shadow phase animation
- Sunflowers & Tulips: Billboard technique (flower heads face camera via `lookAt()`)
- Flute: 3D model with hover animation, click spawns music notes globally
- Music notes: 30 desktop / 40 mobile, floating sprites
- Waves: GLSL shader, 64×64 segments desktop / 32×32 mobile
- Post-processing: Van Gogh-style shader (skipped on mobile/low-end)

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
