# AGENTS.md — Atrijā Website Project

> **Read this first** before making any changes.

## Project Overview
- **Name**: Atrijā (अत्रिज) — impressionist philosophy website
- **Stack**: Astro 4 + Three.js (npm `three@0.160`), GLSL post-processing
- **Scene**: `src/js/scene/` (14 ES modules) → `public/js/scene-bundle.js` (692KB, includes three.js)
- **Build**: `npm run build` = copy-content → vite scene bundle → astro build
- **Deploy**: Nginx port 8080, root `/data/data/com.termux/files/usr/share/nginx/html`
- **Design**: Dark theme (#08080f), impressionist aesthetic

## Critical Rules

### 0. Use CodeGraph First
```bash
codegraph query "symbol" --kind function --limit 10
codegraph context "How does X work?" --format markdown
codegraph callers "fn_name" && codegraph callees "fn_name"
codegraph impact "fn_name" && codegraph index --force
```
~25% cheaper, ~62% fewer tool calls vs grep/read. Index in `.codegraph/`.

### 1. ALWAYS Pull First
```bash
cd /root/projects/van-gogh-site && git fetch origin && git pull origin master
```

### 2. Build & Deploy
```bash
npm run build
cp -r dist/* /data/data/com.termux/files/usr/share/nginx/html/
```

**Cache (nginx handles all headers — do NOT add manual busting):**
- `index.html`: no-cache/no-store — NEVER cached
- `_astro/*`: max-age=31536000, immutable (1yr, Vite content-hashed)
- `*.css, *.js`: max-age=3600 (1hr)
- `*.svg, *.png`: max-age=2592000 (30d)
- `*.woff2`: max-age=604800 (7d)
- `*.json`: max-age=300 (5min)
- SW auto-bump: `scripts/bump-sw-cache.js` runs every build → increments CACHE_NAME
- **Do NOT run `hash-assets.sh` or `BUILD_VERSION` sed** — breaks build

### 3. Git
- Semantic commits: `feat:`, `fix:`, `refactor:`, `perf:`, `chore:`, `style:`, `docs:`
- **ALWAYS commit AND push** after changes: `git add -A && git commit -m "msg" && git push origin master`

### 4. Never Stop Critical Services
hermes-gateway, cloudflared, nginx, sshd

### 5. Never Reboot

### 6. Browser Verification (after deploy)
```bash
DISPLAY=:99 agent-browser --executable-path /usr/bin/chromium open http://127.0.0.1:8080/
DISPLAY=:99 agent-browser screenshot /tmp/verify.png
DISPLAY=:99 agent-browser snapshot 2>&1 | head -20
agent-browser close
```

---

## Cron Job Safety Rules (CRITICAL)

**6a. Scene Code SACRED** — NEVER modify `src/js/scene/` modules unless user instructs. Use CodeGraph for callers first. `scene-bundle.js` is BUILD OUTPUT — never edit.

**6a2. NO TEMP FIXES** — Root cause only. No CDN fallbacks, inline hacks, commented-out code. "Quick fixes" WILL be reverted. ASK if unsure.

**6a3. ASTRO 4.16.19 BODY TAG BUG** — Known issue. `scripts/inject-body.js` fixes it. Do NOT remove `<body>` from components or downgrade Astro.

**6b. Never Revert Old Commits** — Fix forward, never `git revert`/`reset --hard`/`checkout <old>`.

**6c. Never Remove Post-Processing Shaders** — EffectComposer (painted + Glitch) = core visual identity.

**6d. Never Convert Three.js to SVG/Canvas/Static** — 3D scene is primary feature.

**6d2. Never Re-implement Painting Gallery** — Explicitly removed by user.

**6e. Content Mutation Rules** — Only modify: `siteData.json`, `content.json`, `mutation-assets/YYYY-MM-DD/`.
- Must rewrite hero tagline, rotate/reorder color schemes, rewrite all 5 section headings, rotate facts/quotes, rewrite Today section, generate 1 visual asset/day (<100KB, self-cleaning)
- **NEVER modify**: `scene-init.js`, `scene/` modules, `BaseLayout.astro`, `index.astro`, `main.css`, any JS/CSS

**6f. Background Implementer** — Only kanban tasks. Never modify `scene-init.js` without approval.

**6g. Git Pull Build** — `git stash` → pull → `git stash pop`. Abort on conflicts, don't force-resolve.

**6h. Verify Before Deploy** — `npm run build` exit 0 + `curl http://127.0.0.1:8080/` returns 200. Use browser tools (rule 6) for visual verification.

**6i. Kanban Generate** — Only add ideas, never auto-implement.

---

## Content Architecture

### Two Files
1. **`siteData.json`** — 5 themes (Moon/Ego/Gita/Shiv/Art), 5 color schemes, facts[], quotes[]
2. **`content.json`** — Section text (heading/intro/imageCard/facts/quote), changelog, meta

Content access:
```astro
import siteData from '../content/siteData.json';
import content from '../content/content.json';
// Headings: <h2 set:html={sec.moon.heading}>
// Facts: siteData.themes[idx].facts[idx]
```

### Changelog (`src/content/changelog/`)
- Date files: `YYYY-MM-DD.json` → `index.json`
- Entry types: daily-mutation, feature, fix, content, design, refactor, perf, chore
- `van-gogh-daily-mutate` writes entries; auto-synced to `content.json`

---

## File Structure
```
src/content/       siteData.json, content.json, changelog/
src/js/scene/      14 ES modules (DO NOT MODIFY without approval)
src/layouts/       BaseLayout.astro
src/pages/         index.astro
public/css/        main.css, loader.css
public/js/         scene-bundle.js (BUILD OUTPUT), changelog-app.js, moon-phase.js, quote-carousel.js
public/mutation-assets/YYYY-MM-DD/  — Daily visual assets
.hermes/           kanban.json
scripts/           daily-mutate.js, daily-deploy.sh, bump-sw-cache.js, inject-body.js
```

---

## Cron Schedule
| Job | Schedule | Purpose |
|-----|----------|---------|
| van-gogh-kanban-generate | 2 AM | Generate ideas + PRDs |
| van-gogh-kanban-review | 3 AM | Review PRDs quality/feasibility |
| van-gogh-background-implement | 3AM + 4PM | Implement kanban tasks + browser verify |
| van-gogh-daily-mutate | 6 AM | Dramatic visible changes + visual assets |
| van-gogh-daily-deploy | 6 AM | Backup deploy (dedup vs mutate) |
| van-gogh-implementation-review | 6AM + 7PM | Visual review via browser |
| van-gogh-content-layout-refresh | 12 PM | Midday refresh — rotate intros/quotes |
| van-gogh-git-pull-build | Every 3h | Pull + conditional build + browser verify |
| van-gogh-ui-test-fix | 10AM + 10PM | Full browser UI testing + fixes |

**IMPORTANT**: All cron jobs are pure agent prompts — do NOT spawn `hermes agent` subprocesses (causes libuv assertion crashes).

---

## Nginx/Termux Notes
- Config: `$PREFIX/etc/nginx/nginx.conf`, Port 8080
- Reload: `kill -HUP <master_pid>` (never restart)
- **nginx MUST run as `user root;`** (SELinux blocks `nobody`)
- `sendfile off` required on Termux
- Verify with `127.0.0.1:8080` NOT `localhost`
- Check for duplicated `public/js/` assets after deploy (remove if present)
