# Automation Workflow Improvement Plan

## Date: 2026-06-24
## Current State: 9 cron jobs, 20 backlog tasks, site stable

---

## Problem Statement

The current automation workflow has grown organically — crons were added one at a time, prompts evolved through trial-and-error, and there's no unified orchestration layer. This leads to:

1. **Race conditions** — multiple crons can conflict on git operations
2. **No health-aware deployment** — broken builds can deploy silently
3. **Notification gaps** — delivery errors mean you don't know when things fail
4. **Redundant verification** — 3 crons do browser verification independently
5. **No rollback mechanism** — if a bad deploy goes out, recovery is manual
6. **Kanban drift** — ideas pile up but never get implemented (20 backlog, ~3 implemented/month)

---

## Goals

1. **Zero silent failures** — every deploy is verified, and you're notified
2. **No git conflicts** — crons never collide on repository operations
3. **Health-gated deploys** — only deploy if scene + visual checks pass
4. **Self-healing** — auto-rollback on failed deploy
5. **Efficient verification** — one shared verification step, not 3 redundant ones
6. **Predictable cadence** — clear daily/weekly/monthly rhythms

---

## Proposed Architecture

### Phase 1: Cron Consolidation (Low Risk, High Impact)

**Current: 9 crons → Proposed: 7 crons**

| # | Current | Proposed | Change |
|---|---------|----------|--------|
| 1 | kanban-generate (2 AM) | kanban-generate (2 AM) | No change |
| 2 | kanban-review (3 AM) | **kanban-triage (3 AM)** | Renamed + enhanced: triage also prioritizes, removes duplicates, closes stale ideas |
| 3 | background-implement (3AM+4PM) | background-implement (3AM+4PM) | No change |
| 4 | daily-mutate-deploy (6 AM) | daily-mutate-deploy (6 AM) | Already merged |
| 5 | implementation-review (6AM+7PM) | **REMOVED** | Redundant — ui-test-fix does the same work |
| 6 | content-layout-refresh (12 PM) | content-layout-refresh (12 PM) | No change |
| 7 | git-pull-build (every 3h) | git-pull-build (every 3h) | Add health check integration |
| 8 | ui-test-fix (10AM+10PM) | ui-test-fix (10AM+10PM) | No change — now the primary review |
| 9 | battery-thermal-guard (5min) | battery-thermal-guard (5min) | No change |

**Rationale:**
- `implementation-review` and `ui-test-fix` do nearly the same thing (browser visual check). Removing one eliminates redundancy.
- `kanban-triage` adds value beyond just review — it keeps the backlog clean and prioritized.
- Net token savings: ~1 cron run × 2/day × ~500 tokens = ~1000 tokens/day

### Phase 2: Health-Gated Deployment Pipeline

**Problem:** `git-pull-build` deploys if build succeeds, but doesn't verify the scene actually renders.

**Solution:** Add a 3-stage gate to `git-pull-build`:

```
Stage 1: git pull + npm run build → exit 0?
Stage 2: scene health check (scripts/scene-health-check.cjs) → healthy?
Stage 3: visual smoke test (python3 test-visual.py) → sceneReady?
If all 3 pass → deploy + notify
If any fail → abort + notify + suggest rollback
```

**Implementation:**
- Update `git-pull-build` prompt to include health check and visual verification steps
- Add a `scripts/deploy-rollback.sh` that keeps the last known-good deploy and can restore it
- Update AGENTS.md rule 6h to reflect the 3-stage gate

### Phase 3: Unified Notification System

**Problem:** Crons report independently to "origin" but delivery fails silently.

**Solution:** 
- All crons deliver to `local` (save output to files) — guaranteed to work
- A new lightweight `van-gogh-daily-summary` cron at 7 AM reads the last 24h of outputs and sends ONE consolidated report
- This means you get exactly one notification per day instead of 9 separate ones
- If a cron fails, the summary report shows ❌ for that job

**New cron: `van-gogh-daily-summary` (7 AM)**
- Reads `~/.hermes/cron/output/` for each job's last run
- Checks `last_status` and `last_delivery_error`
- Sends a single formatted report:
  ```
  📊 Daily Report — 2026-06-24
  ✅ daily-mutate-deploy: Deployed abc123
  ✅ git-pull-build: 3 runs, all clean
  ✅ ui-test-fix: No issues
  ❌ kanban-review: Delivery failed (but review completed)
  🔄 background-implement: 2 tasks completed
  ```

### Phase 4: Backlog Auto-Pruning

**Problem:** Backlog grows indefinitely (20 items) but implementation rate is ~3/month.

**Solution:**
- Enhance `kanban-triage` to auto-close ideas that have been in backlog >60 days with no PRD update
- Move auto-closed ideas to a separate `archive/` section (not deleted, just parked)
- Add a "staleness score" — if an idea's PRD hasn't been updated in 30 days, flag it
- This keeps the backlog manageable (target: <15 active items)

### Phase 5: Weekly Review Automation

**Problem:** No cron does a holistic weekly review of the site's health.

**Solution:**
- Add `van-gogh-weekly-review` (Sunday 8 AM)
- Runs the full visual test suite
- Checks bundle size trends (is it growing?)
- Checks test pass rate trends
- Generates a weekly health report
- Suggests which backlog items to prioritize based on current issues found

---

## Implementation Order

| Step | Phase | Task | Effort | Impact |
|------|-------|------|--------|--------|
| 1 | 1 | Remove `implementation-review` cron | 5 min | Medium |
| 2 | 1 | Rename + enhance `kanban-review` → `kanban-triage` | 15 min | Medium |
| 3 | 2 | Add health check to `git-pull-build` prompt | 15 min | High |
| 4 | 2 | Create `scripts/deploy-rollback.sh` | 30 min | High |
| 5 | 3 | Change all crons to `deliver: local` | 5 min | Low |
| 6 | 3 | Create `van-gogh-daily-summary` cron | 20 min | High |
| 7 | 4 | Add auto-pruning logic to kanban-triage | 15 min | Medium |
| 8 | 5 | Create `van-gogh-weekly-review` cron | 20 min | Medium |

**Total effort: ~2 hours**
**Expected outcome: Zero silent failures, no git conflicts, single daily notification, self-healing deploys**

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Silent deploy failures | Unknown (no tracking) | 0 (all caught + notified) |
| Git conflicts between crons | Occasional (3AM overlap) | 0 (sequential gating) |
| Backlog staleness | 20 items, growing | <15 items, pruned weekly |
| Daily notifications received | 0-9 (unpredictable) | 1 (consolidated summary) |
| Rollback capability | Manual only | One-command auto-rollback |
| Health check coverage | Build exit 0 only | 3-stage gate (build + scene + visual) |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Consolidated summary cron fails | Each cron still saves output locally — you can check files directly |
| Health check false positives | Thresholds are lenient (warn at 80% pass rate, fail at 50%) |
| Auto-pruning closes valid ideas | Ideas go to archive, not deleted. Can be reopened. |
| Removing implementation-review loses coverage | ui-test-fix runs 2x/day and is more thorough |
