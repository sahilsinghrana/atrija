# AGENTS.md — Atrijā Website Project

> **Read this first** before making any changes.

## Project Overview
- **Name**: Atrijā (अत्रिज) — impressionist philosophy website
- **Stack**: Astro 4 + Three.js (npm `three@0.160`), GLSL post-processing
- **Scene**: `src/js/scene/` (27+ ES modules) → bundled by Vite → `dist/_astro/scene-*.js`
- **Build**: `npm run build` = copy-content → vite scene bundle → astro build → css cache-bust
- **Deploy**: Nginx port 8080, root `/data/data/com.termux/files/usr/share/nginx/html`
- **Design**: Dark theme (#08080f), impressionist aesthetic
- **Domain**: rexx.sahilrana.in (Cloudflare proxied)

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
- `*.css, *.js` (public): max-age=3600 (1hr) — cache-busted via build timestamp query string
- `*.svg, *.png`: max-age=2592000 (30d)
- `*.woff2`: max-age=604800 (7d)
- `*.json`: max-age=300 (5min)
- SW auto-bump: `scripts/bump-sw-cache.js` runs every build → increments CACHE_NAME
- CSS cache-bust: `scripts/css-cache-bust.js` runs at end of build → injects `?v=timestamp` into CSS links
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

Or use the test script:
```bash
python3 test-visual.py http://127.0.0.1:8080
```

---

## Cron Job Safety Rules (CRITICAL)

**6a. Scene Code SACRED** — NEVER modify `src/js/scene/` modules unless user instructs. Use CodeGraph for callers first. Scene JS in `_astro/` is BUILD OUTPUT — never edit.

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
- `van-gogh-daily-mutate-deploy` writes entries; auto-synced to `content.json`

---

## File Structure
```
src/content/       siteData.json, content.json, changelog/
src/js/scene/      27+ ES modules (DO NOT MODIFY without approval)
src/layouts/       BaseLayout.astro
src/pages/         index.astro
public/css/        main.css, loader.css, daily-theme.css
public/js/         changelog-app.js, moon-phase.js, quote-carousel.js, performance-scaler.js,
                   content-prefetch.js, scene-error-boundary.js, scene-context-recovery.js,
                   comet.js, content-search.js, section-nav.js, reader-mode.js,
                   keyboard-help.js, theme-switcher.js
public/mutation-assets/YYYY-MM-DD/  — Daily visual assets
.hermes/           kanban.json
scripts/           daily-mutate.js, bump-sw-cache.js, inject-body.js, css-cache-bust.js,
                   check-bundle-size.js, scene-health-check.cjs
```

---

## Cron Schedule (10 jobs — implemented 2026-06-24)
| Job | Schedule | Purpose | Delivery |
|-----|----------|---------|----------|
| van-gogh-kanban-generate | 2 AM | Generate ideas + PRDs | local |
| van-gogh-kanban-triage | 3 AM | Review, prioritize, prune stale ideas | local |
| van-gogh-background-implement | 3AM + 4PM | Implement kanban tasks + browser verify | local |
| van-gogh-daily-mutate-deploy | 6 AM | Dramatic visible changes + visual assets + deploy | local |
| van-gogh-git-pull-build | Every 3h | Pull + health-gated 3-stage deploy | local |
| van-gogh-daily-summary | 7 AM | Consolidated daily health report | **origin** |
| van-gogh-content-layout-refresh | 12 PM | Midday refresh — rotate intros/quotes | local |
| van-gogh-ui-test-fix | 10AM + 10PM | Full browser UI testing + fixes | local |
| van-gogh-weekly-review | Sunday 8AM | Weekly trends: bundle size, tests, cron success | **origin** |
| battery-thermal-guard | Every 5m | Battery thermal protection | local |

**IMPORTANT**: All cron jobs are pure agent prompts — do NOT spawn `hermes agent` subprocesses (causes libuv assertion crashes).

**Deployment Safety:** `git-pull-build` uses a 3-stage gate: (1) build exit 0, (2) scene health check, (3) visual smoke test. All must pass before deploy. Git lock at `/tmp/van-gogh-git.lock` prevents pull collisions. Rollback: `scripts/deploy-rollback.sh restore`.

**Notification Pattern:** 8 crons save output locally. 2 crons (daily-summary, weekly-review) deliver to origin with consolidated reports.

---

## Nginx/Termux Notes
- Config: `$PREFIX/etc/nginx/nginx.conf`, Port 8080
- Reload: `kill -HUP <master_pid>` (never restart)
- **nginx MUST run as `user root;`** (SELinux blocks `nobody`)
- `sendfile off` required on Termux
- Verify with `127.0.0.1:8080` NOT `localhost`
- Check for duplicated `public/js/` assets after deploy (remove if present)

---

## Current Architecture (2026-06)
- **Scene modules**: All Three.js code in `src/js/scene/` as ES modules with bare `three` imports (no CDN/esm.sh)
- **Vite bundling**: Scene modules bundled by Vite into hashed chunks in `dist/_astro/`
- **CSS**: main.css + daily-theme.css + loader.css — cache-busted via build timestamp
- **Service Worker**: `public/sw.js` with versioned cache (auto-bumped every build)
- **Testing**: vitest + jsdom, tests in `tests/unit/` and `tests/loading/`
- **ESLint**: Flat config with @eslint/js + typescript-eslint + eslint-plugin-astro
