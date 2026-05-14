# AGENTS.md — Van Gogh Website Project Instructions

> **Read this file first** before making any changes to this project.

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
npm run build
cp -r dist/* /data/data/com.termux/files/usr/share/nginx/html/
```

### 3. Git Commit Convention
Use semantic commit messages:
- `feat:` new feature
- `fix:` bug fix
- `refactor:` code restructuring
- `perf:` performance improvement
- `chore:` maintenance (deps, config)
- `style:` CSS/styling changes
- `docs:` documentation

### 4. Never Stop Critical Services
- hermes-gateway (PID 5334)
- cloudflared (PID 5474)
- nginx (PID 5414)
- sshd (PID 5416)

### 5. Never Reboot the System

## Project Structure
- **Framework**: Astro 4 (Static Site Generation)
- **3D Engine**: Three.js loaded from CDN (esm.sh)
- **Styling**: Inline `<style is:inline>` (global, no scoping)
- **Deploy**: Nginx on port 8080, root `/data/data/com.termux/files/usr/share/nginx/html`
- **Data**: `src/content/siteData.json` (themes, colors, changelog)
- **Kanban**: `.hermes/kanban.json` (idea board)

## Cron Jobs Active
| Job | Schedule | Purpose |
|-----|----------|---------|
| van-gogh-kanban-generate | 2 AM daily | Generate new ideas, advance TDD pipeline |
| van-gogh-daily-deploy | 6 AM daily | Content mutation → build → deploy |
| van-gogh-background-implement | 10AM/2PM/6PM | Implement kanban tasks via TDD |
| van-gogh-git-pull-build | Every 3h | Git pull + conditional build |

## Design Tokens
All CSS uses custom properties defined in `:root`:
- Colors: `--bg`, `--text-primary`, `--accent-gold`, etc.
- Typography: `--text-xs` through `--text-hero`
- Spacing: `--space-xs` through `--space-3xl`
- Fonts: `--font-serif`, `--font-sans`, `--font-devanagari`

## Three.js Scene
- Scene init: `public/js/scene-init.js`
- Loaded via `<script type="module">` from CDN
- Post-processing shader skipped on mobile/low-end
- Stars: 2500 desktop / 1500 mobile with twinkling shader
- Moon: orbiting + self-rotating with glow
- Flowers: billboard technique (face camera)
