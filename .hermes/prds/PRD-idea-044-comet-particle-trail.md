# PRD: Comet with Particle Trail

> **ID:** idea-044
> **Category:** 3D Elements
> **Priority:** medium
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-05-24

---

## 1. Overview

**One-liner:** A majestic comet with a glowing particle trail that slowly crosses the 3D sky every 3-5 minutes, evoking the cosmic grandeur of Van Gogh's Starry Night.

**Problem:** The current sky has twinkling stars (idea-001), shooting stars (idea-001), and a moon — but no large celestial bodies. Van Gogh's Starry Night features prominent swirling forms that some astronomers believe represent comets or cosmic energy. The sky feels complete but lacks a "grand event" — something that makes visitors look up and watch in wonder.

**Solution:** A comet object (bright white-blue sphere with intense glow) that enters from one side of the sky and slowly traverses to the other side over 30-60 seconds. It leaves a persistent particle trail (100-200 particles desktop, 50-80 mobile) that fades over ~10 seconds. The comet appears every 3-5 minutes with randomized entry/exit angles. Triggered in the `animate()` loop via a timer. The comet does NOT orbit — it's a one-shot crossing event.

**Distinction from idea-001 (Shooting Stars):** Shooting stars are quick streaks (1-2 seconds) with small particle bursts. The comet is a large, bright, slow-moving object with a long persistent trail that takes 30-60 seconds to cross. Comets are rare events (3-5 min intervals) vs shooting stars (8-15 seconds).

---

## 2. User Stories

- As a visitor, I want to occasionally see a majestic comet cross the sky so I feel a sense of cosmic wonder.
- As a visitor, I want the comet trail to linger and fade naturally so it feels painterly and organic.
- As a visitor, I want the comet to appear at unpredictable angles so each sighting feels unique.
- As a visitor on mobile, I want a simplified but still beautiful comet so my device stays responsive.

---

## 3. Technical Specification

### 3.1 Architecture

- **Modified file:** `public/js/scene-init.js` — Comet system added to the Three.js scene
- **No other files changed** — this is purely a 3D scene addition
- Adds to the existing `animate()` loop with a timer-based trigger
- Uses Three.js `THREE.Points` for the particle trail with custom shader material

### 3.2 Implementation Details

#### Step 1: Comet head mesh
- File: `public/js/scene-init.js`
- What to do:
  - Create a small sphere geometry (radius 0.3, 8 segments) with `MeshBasicMaterial` color `0xddeeff`
  - Add a glow effect: a larger transparent sphere (radius 0.8, 8 segments) with `MeshBasicMaterial` color `0xaaccff`, opacity 0.3, `transparent: true`
  - Group both meshes into a `THREE.Group` called `cometGroup`
  - Position off-screen initially; set `cometGroup.visible = false`
- Expected outcome: A bright glowing comet head ready to be animated

#### Step 2: Particle trail system
- File: `public/js/scene-init.js`
- What to do:
  - Create `THREE.BufferGeometry` with 200 particle positions (desktop) or 80 (mobile)
  - Each particle has: position (x,y,z), age (seconds), maxAge (8-12 seconds random)
  - Use `THREE.Points` with a simple `PointsMaterial`: size 0.08, color `0x88aaff`, `transparent: true`, opacity 0.6, `blending: THREE.AdditiveBlending`
  - In the animate loop: when comet is active, emit 2-3 new particles per frame at the comet's current position
  - Each frame, age all particles and reduce opacity based on `age/maxAge`
  - Remove particles older than maxAge (or just set opacity to 0)
- Expected outcome: A glowing particle trail that follows the comet and fades naturally

#### Step 3: Comet trajectory and trigger
- File: `public/js/scene-init.js`
- What to do:
  - In the `animate()` loop, maintain a `cometTimer` counter (seconds)
  - When `cometTimer >= nextCometTime` (random 180-300 seconds):
    - Set comet start position at sky edge (random angle, distance 50-80 units, y: 15-35)
    - Set comet end position at opposite sky edge
    - Calculate velocity vector for 30-60 second crossing
    - Set `cometGroup.visible = true`, reset particle ages
  - Each frame while comet is active: move comet along trajectory, emit trail particles
  - When comet reaches end position: set `cometGroup.visible = false`, reset timer with new random interval
- Expected outcome: Comet crosses sky every 3-5 minutes with smooth trajectory

### 3.3 Mobile Considerations

- On viewport < 768px:
  - Trail particles: 80 max (vs 200 desktop)
  - Emission rate: 1 particle per frame (vs 2-3)
  - Comet head: smaller glow sphere (radius 0.6 vs 0.8)
  - No reduction in visibility distance — comet should be just as noticeable
- Performance budget: Additions of ~80 draw calls for particles; `THREE.Points` is a single draw call

### 3.4 Data Structures

```json
{
  "comet": {
    "intervalSeconds": [180, 300],
    "crossingSeconds": [30, 60],
    "trailParticles": 200,
    "trailParticlesMobile": 80,
    "trailLifetimeSeconds": [8, 12],
    "headColor": "0xddeeff",
    "glowColor": "0xaaccff",
    "trailColor": "0x88aaff"
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Comet group exists | `tests/comet.test.js` | `cometGroup` is a `THREE.Group` with `visible` property |
| Comet head has two meshes | `tests/comet.test.js` | `cometGroup.children.length === 2` (head + glow) |
| Trail uses THREE.Points | `tests/comet.test.js` | `trailPoints` is instance of `THREE.Points` |
| Comet triggers within interval | `tests/comet.test.js` | After mocking time, comet becomes visible within 180-300s |
| Comet trail particles emit | `tests/comet.test.js` | Active comet produces particles with age < maxAge |
| Trail particles fade over time | `tests/comet.test.js` | Particle opacity decreases as age approaches maxAge |
| Comet invisible between events | `tests/comet.test.js` | `cometGroup.visible === false` when timer < nextCometTime |

### 4.2 Green Phase — Implementation

- Add comet head, trail system, and trigger logic to `scene-init.js`
- Verify all 7 tests pass
- Verify build succeeds: `npm run build`

### 4.3 Refactor Phase — Optimization

- Use instanced buffer for trail particles to reduce memory allocations
- Add subtle color shift to trail (blue → white → warm) for painterly effect
- Add a faint secondary "dust" trail with larger, more transparent particles

---

## 5. Acceptance Criteria

- [ ] Comet appears every 3-5 minutes with randomized trajectory
- [ ] Comet head is a bright white-blue sphere with soft glow
- [ ] Comet takes 30-60 seconds to cross the sky
- [ ] Particle trail follows the comet and fades over 8-12 seconds
- [ ] Trail uses additive blending for ethereal glow
- [ ] Mobile uses reduced particle count (80 vs 200)
- [ ] No frame rate drops below 30fps on mobile
- [ ] All 7 unit tests pass
- [ ] No console errors
- [ ] Does not interfere with existing shooting stars (idea-001) or moon

---

## 6. Dependencies & Risks

**Dependencies:**
- Existing Three.js scene in `scene-init.js` (present)
- Existing `animate()` loop (present)

**Risks:**
- **Performance on low-end devices:** 200 particles with additive blending could be costly. Mitigation: reduce count on mobile, use simple `PointsMaterial` (no custom shader needed).
- **Comet frequency too high/low:** 3-5 minutes is a starting point. Mitigation: make interval configurable; adjust based on user feedback.
- **Comet path looks unnatural:** Random angles might produce paths that go "upside down." Mitigation: constrain entry/exit angles to upper hemisphere (y > 5).

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Majestic comet with glowing particle trail crosses the sky every 3-5 minutes",
  "changes": [
    "Added comet head mesh (bright sphere + glow) to scene-init.js",
    "Particle trail system with 200 particles (80 mobile) and additive blending",
    "Randomized trajectory: entry angle, crossing time (30-60s), interval (3-5 min)",
    "Trail particles age and fade over 8-12 seconds",
    "Mobile-optimized with reduced particle count",
    "Distinct from shooting stars: slower, larger, rarer, persistent trail"
  ]
}
```

---

## Reviewer Notes (2026-05-24)

**Quality Check**: Well-written PRD with clear distinction from shooting stars. The particle trail system is well-specified with good mobile considerations.

**Design Alignment**: The comet as a "grand event" is a great concept — it creates moments of wonder that visitors will remember. The 3-5 minute interval is frequent enough to be seen but rare enough to feel special.

**Feasibility**: This PRD modifies `scene-init.js` directly (SACRED file). The implementation adds comet head meshes, particle trail system, and trigger logic — this is a significant addition to scene-init.js, not a minimal change. **Recommendation**: Refactor to use a standalone `public/js/comet.js` module with a 2-line import/init in scene-init.js, following the pattern from idea-035 and idea-041.

**Risk**: The particle trail (200 particles desktop) uses `THREE.Points` which is a single draw call — this is fine. But the comet timer logic adds complexity to the animate loop. Keep it simple.

**Scope**: Medium is appropriate, but the scene-init.js changes need to be refactored to a standalone module first.

---

## Reviewer Notes (2026-06-01)

**Architecture Update**: This PRD now REQUIRES standalone module pattern. The comet system must be `public/js/comet.js` — a self-contained module exporting `initComet(scene)` and `updateComet(time, deltaTime)`. scene-init.js gets exactly 2 lines added (import + init call). No other scene-init.js modifications. The comet timer, particle trail, and head mesh all live in comet.js.

**Status**: Backlog — no implementation attempted. Depends only on existing Three.js scene (no other feature dependencies).

**Priority**: Low — This is a nice-to-have "grand event" visual. While well-designed, it adds complexity to the animate loop. Consider lowering priority if backlog grows.
