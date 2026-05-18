# PRD: Shooting Star Particles

> **ID:** idea-001  
> **Category:** 3D Elements  
> **Priority:** medium  
> **Status:** done  
> **PRD Version:** 1.0  
> **Last Updated:** 2026-05-15

---

## 1. Overview

**One-liner:** Random shooting stars that streak across the sky with trailing particles, triggered every 8-15 seconds.

**Problem:** The star field is static and lacks dynamic events. Visitors have no "wow" moments from unexpected celestial activity.

**Solution:** Add a shooting star system that spawns a bright point particle with a trailing tail that arcs across the sky at random angles, lasting 1-2 seconds before fading. Uses the existing star shader infrastructure with modifications for motion trails.

---

## 2. User Stories

- As a visitor, I want to see occasional shooting stars so the sky feels alive and magical.
- As a visitor, I want the shooting stars to have realistic arcs with fading trails so they feel natural.
- As a mobile user, I want fewer shooting stars so my device doesn't lag.

---

## 3. Technical Specification

### 3.1 Architecture

- **File modified:** `public/js/scene-init.js`
- **New function:** `createShootingStars(scene, maxActive)` — manages a pool of shooting star objects
- **New helper:** `spawnShootingStar()` — creates a single shooting star with trail
- **Integration:** Called once during scene init, manages its own lifecycle
- **Depends on:** Existing `VanGoghScene` class, `isMobile` flag

### 3.2 Implementation Details

#### Step 1: Add shooting star data structures

Add after the `createMusicNotes` function (~line 509):

```javascript
// ── Shooting Stars ──
function createShootingStars(scene, maxActive) {
  maxActive = maxActive || (isMobile ? 1 : 2);
  var pool = [];

  // Trail particle system per shooting star
  function spawn() {
    var trailLength = isMobile ? 12 : 20;
    var positions = new Float32Array(trailLength * 3);
    var opacities = new Float32Array(trailLength);

    // Random start position (upper portion of sky sphere)
    var startR = 35 + Math.random() * 10;
    var startTheta = Math.random() * Math.PI * 2;
    var startPhi = Math.random() * Math.PI * 0.4; // upper hemisphere only
    var sx = startR * Math.sin(startPhi) * Math.cos(startTheta);
    var sy = startR * Math.sin(startPhi) * Math.sin(startTheta) + 5;
    var sz = startR * Math.cos(startPhi);

    // Random direction (generally downward arc)
    var dirX = (Math.random() - 0.5) * 0.8;
    var dirY = -0.3 - Math.random() * 0.5;
    var dirZ = (Math.random() - 0.5) * 0.8;
    var speed = 0.15 + Math.random() * 0.15;

    var star = {
      active: true,
      life: 0,
      maxLife: 1.5 + Math.random() * 0.8,
      sx: sx, sy: sy, sz: sz,
      dx: dirX * speed, dy: dirY * speed, dz: dirZ * speed,
      positions: positions,
      opacities: opacities,
      trailLength: trailLength,
      headSize: isMobile ? 3.0 : 4.0,
      headColor: new THREE.Color().setHSL(0.12 + Math.random() * 0.05, 0.8, 0.9)
    };

    // Create trail geometry
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

    var mat = new THREE.PointsMaterial({
      color: star.headColor,
      size: star.headSize,
      transparent: true,
      opacity: 1.0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    var points = new THREE.Points(geo, mat);
    points.userData.shootingStar = star;
    points.userData.animate = function(o, t, dt) {
      var s = o.userData.shootingStar;
      if (!s.active) return;

      s.life += dt;
      if (s.life >= s.maxLife) {
        o.visible = false;
        s.active = false;
        return;
      }

      // Move head
      s.sx += s.dx;
      s.sy += s.dy;
      s.sz += s.dz;

      // Shift trail positions (from tail to head)
      for (var i = s.trailLength - 1; i > 0; i--) {
        s.positions[i * 3] = s.positions[(i - 1) * 3];
        s.positions[i * 3 + 1] = s.positions[(i - 1) * 3 + 1];
        s.positions[i * 3 + 2] = s.positions[(i - 1) * 3 + 2];
        s.opacities[i] = s.opacities[i - 1] * 0.85;
      }
      s.positions[0] = s.sx;
      s.positions[1] = s.sy;
      s.positions[2] = s.sz;
      s.opacities[0] = 1.0;

      // Fade based on life
      var lifeRatio = s.life / s.maxLife;
      var fadeOpacity = lifeRatio < 0.7 ? 1.0 : 1.0 - (lifeRatio - 0.7) / 0.3;
      o.material.opacity = fadeOpacity;
      o.material.size = s.headSize * (0.5 + fadeOpacity * 0.5);

      o.geometry.attributes.position.needsUpdate = true;
      o.geometry.attributes.opacity.needsUpdate = true;
    };

    scene.add(points);
    pool.push({ points: points, star: star });
  }

  // Auto-spawn timer
  var nextSpawn = 8 + Math.random() * 7; // 8-15 seconds

  // Register with scene's animation loop via a manager object
  return {
    update: function(t, dt) {
      nextSpawn -= dt;
      if (nextSpawn <= 0) {
        // Find inactive star to recycle, or spawn new
        var found = false;
        for (var i = 0; i < pool.length; i++) {
          if (!pool[i].star.active) {
            // Recycle
            var s = pool[i].star;
            s.active = true;
            s.life = 0;
            s.maxLife = 1.5 + Math.random() * 0.8;
            // Re-randomize position/direction (same logic as spawn)
            var startR = 35 + Math.random() * 10;
            var startTheta = Math.random() * Math.PI * 2;
            var startPhi = Math.random() * Math.PI * 0.4;
            s.sx = startR * Math.sin(startPhi) * Math.cos(startTheta);
            s.sy = startR * Math.sin(startPhi) * Math.sin(startTheta) + 5;
            s.sz = startR * Math.cos(startPhi);
            s.dx = ((Math.random() - 0.5) * 0.8) * (0.15 + Math.random() * 0.15);
            s.dy = (-0.3 - Math.random() * 0.5) * (0.15 + Math.random() * 0.15);
            s.dz = ((Math.random() - 0.5) * 0.8) * (0.15 + Math.random() * 0.15);
            pool[i].points.visible = true;
            pool[i].points.material.opacity = 1.0;
            found = true;
            break;
          }
        }
        if (!found && pool.length < maxActive) {
          spawn();
        }
        nextSpawn = 8 + Math.random() * 7;
      }
    }
  };
}
```

#### Step 2: Integrate into scene init

In the `initScene()` function (around line 640-660), add:

```javascript
var shootingStarManager = createShootingStars(scene.scene, isMobile ? 1 : 2);
```

Then in the animation loop, call `shootingStarManager.update(t, dt)` each frame.

#### Step 3: Add delta time to animation loop

Modify the `VanGoghScene.animate()` method to compute `dt` and pass it to all `userData.animate` callbacks:

```javascript
var dt = this.clock.getDelta();
// In the objects loop:
if (o.userData.animate) o.userData.animate(o, t, dt);
```

### 3.3 Mobile Considerations

- Max 1 active shooting star at a time (vs 2 on desktop)
- Trail length: 12 particles (vs 20 on desktop)
- Head size: 3.0 (vs 4.0 on desktop)
- Same spawn interval (8-15s) — fewer concurrent stars is enough

### 3.4 Data Structures

```json
{
  "shootingStar": {
    "active": true,
    "life": 0.5,
    "maxLife": 2.0,
    "sx": 10.0, "sy": 15.0, "sz": -20.0,
    "dx": 0.1, "dy": -0.05, "dz": 0.08,
    "trailLength": 20,
    "headSize": 4.0,
    "headColor": "#ffdd88"
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Shooting star pool creates correct count | `tests/unit/shooting-stars.test.js` | `pool.length <= maxActive` |
| Shooting star spawns within 8-15s | `tests/unit/shooting-stars.test.js` | `nextSpawn` in range [8, 15] |
| Shooting star trail fades over time | `tests/unit/shooting-stars.test.js` | `opacity decreases as life increases` |
| Mobile uses reduced counts | `tests/unit/shooting-stars.test.js` | `isMobile ? trailLength === 12 : trailLength === 20` |

### 4.2 Green Phase — Implementation

Implement `createShootingStars()` and integrate into scene init.

### 4.3 Refactor Phase — Optimization

- Object pooling to avoid GC from spawning/destroying particles
- Reuse buffer geometries instead of creating new ones
- Reduce trail update to every other frame on mobile

---

## 5. Acceptance Criteria

- [ ] Shooting stars appear every 8-15 seconds
- [ ] Each shooting star has a visible trailing tail of 12-20 particles
- [ ] Trail fades from head to tail (head brightest)
- [ ] Shooting star arcs across sky and fades out over 1.5-2.3 seconds
- [ ] Max 1 concurrent on mobile, 2 on desktop
- [ ] No frame rate drops below 30fps on mobile
- [ ] All unit tests pass
- [ ] Changelog entry added

---

## 6. Dependencies & Risks

**Dependencies:** Existing `VanGoghScene` animation loop, `isMobile` flag

**Risks:**
- Trail particles may not render if `sizeAttenuation` is wrong → Test with different camera distances
- Too many concurrent shooting stars could impact mobile FPS → Limit to 1 on mobile
- Buffer geometry updates every frame could be expensive → Use `needsUpdate = true` selectively

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Shooting stars — random celestial streaks with fading trails, every 8-15 seconds",
  "changes": [
    "Added createShootingStars() with particle trail system",
    "Object pooling for performance",
    "Mobile: 1 star max, 12 trail particles; Desktop: 2 stars, 20 trail particles"
  ]
}
```

---

## Reviewer Notes (2026-05-19)

**Status updated to DONE** (matching kanban). Note: The implementation likely differs from this PRD's technical spec — the PRD references `VanGoghScene` class and `EffectComposer` which were removed in the architecture refactoring. The actual implementation uses the current IIFE-based scene architecture.
