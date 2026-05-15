# PRD: Interactive Constellation Drawing

> **ID:** idea-002  
> **Category:** Interactivity  
> **Priority:** low  
> **Status:** backlog  
> **PRD Version:** 1.0  
> **Last Updated:** 2026-05-15

---

## 1. Overview

**One-liner:** Users can click/tap on stars to draw constellation lines between them. Lines glow and fade. Drawn constellations persist in localStorage.

**Problem:** The constellation lines are static and pre-defined. Users have no agency to interact with the night sky.

**Solution:** Add a raycaster-based click handler that detects clicks on star particles. When 2+ stars are selected, draw a glowing line between them. Store drawn lines in localStorage so they persist across sessions. Add a subtle UI hint ("Tap stars to connect them") that fades after first interaction.

---

## 2. User Stories

- As a visitor, I want to click on stars to create my own constellations so I feel connected to the sky.
- As a visitor, I want my drawn constellations to persist when I return so the experience feels personal.
- As a visitor, I want visual feedback (glowing lines, star highlights) so I know my interaction worked.
- As a mobile user, I want tap-to-connect to work naturally with touch events.

---

## 3. Technical Specification

### 3.1 Architecture

- **File modified:** `public/js/scene-init.js`
- **New function:** `initConstellationInteraction(scene, camera, renderer)` — sets up raycaster + click handler
- **New function:** `saveConstellations(lines)` — persists to localStorage
- **New function:** `loadConstellations()` — loads from localStorage, redraws lines
- **New function:** `clearConstellations()` — clears all user-drawn lines
- **Depends on:** THREE.Raycaster, existing star geometry, localStorage API

### 3.2 Implementation Details

#### Step 1: Add constellation interaction module

Add after the shooting stars module:

```javascript
// ── Interactive Constellation Drawing ──
function initConstellationInteraction(vanGoghScene) {
  var scene = vanGoghScene.scene;
  var camera = vanGoghScene.camera;
  var renderer = vanGoghScene.renderer;
  var raycaster = new THREE.Raycaster();
  raycaster.params.Points.threshold = 2.0; // generous hit area
  var mouse = new THREE.Vector2();

  var selectedStars = [];
  var userLines = [];
  var lineMat = new THREE.LineBasicMaterial({ color: 0x88aaff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
  var selectedMat = new THREE.PointsMaterial({ color: 0xffdd88, size: 5.0, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending });

  // UI hint
  var hint = document.createElement('div');
  hint.id = 'constellation-hint';
  hint.textContent = '✦ Tap stars to connect them';
  hint.style.cssText = 'position:fixed;bottom:6rem;left:50%;transform:translateX(-50%);color:rgba(255,255,255,0.4);font-family:Inter,sans-serif;font-size:0.8rem;letter-spacing:0.05em;pointer-events:none;transition:opacity 1s;white-space:nowrap;';
  document.body.appendChild(hint);

  function hideHint() {
    hint.style.opacity = '0';
    setTimeout(function() { hint.remove(); }, 1000);
  }

  function onPointerDown(e) {
    var x = e.clientX || (e.touches && e.touches[0].clientX);
    var y = e.clientY || (e.touches && e.touches[0].clientY);
    if (!x || !y) return;

    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Find star Points objects in scene
    var starObjects = [];
    scene.traverse(function(obj) {
      if (obj.isPoints && obj.geometry && obj.geometry.attributes.size) {
        starObjects.push(obj);
      }
    });

    var intersects = raycaster.intersectObjects(starObjects);
    if (intersects.length > 0) {
      var hit = intersects[0];
      var starPos = hit.point.clone();

      // Check if this star is already selected (within distance threshold)
      var alreadySelected = false;
      for (var i = 0; i < selectedStars.length; i++) {
        if (selectedStars[i].distanceTo(starPos) < 1.5) {
          alreadySelected = true;
          break;
        }
      }

      if (!alreadySelected) {
        selectedStars.push(starPos);

        // Add a temporary highlight sprite at the selected star position
        var hlSprite = new THREE.Sprite(new THREE.SpriteMaterial({
          color: 0xffdd88, transparent: true, opacity: 0.8,
          map: createHighlightTexture(), depthWrite: false
        }));
        hlSprite.position.copy(starPos);
        hlSprite.scale.set(2, 2, 1);
        hlSprite.userData.isHighlight = true;
        scene.add(hlSprite);

        if (selectedStars.length >= 2) {
          // Draw line between last two selected stars
          var lineGeo = new THREE.BufferGeometry().setFromPoints([
            selectedStars[selectedStars.length - 2],
            selectedStars[selectedStars.length - 1]
          ]);
          var line = new THREE.Line(lineGeo, lineMat.clone());
          line.userData.isUserLine = true;
          line.userData.createdAt = Date.now();
          scene.add(line);
          userLines.push(line);

          // Fade in animation
          line.material.opacity = 0;
          var fadeStart = Date.now();
          (function(l) {
            l.userData.animate = function(o, t) {
              var elapsed = (Date.now() - fadeStart) / 1000;
              o.material.opacity = Math.min(0.6, elapsed * 2);
              // Slow fade after 30 seconds
              if (Date.now() - l.userData.createdAt > 30000) {
                o.material.opacity = Math.max(0, 0.6 - (Date.now() - l.userData.createdAt - 30000) / 5000);
              }
            };
          })(line);

          saveConstellations(selectedStars, userLines);
        }

        if (selectedStars.length === 2) hideHint();

        // Reset selection after 3 lines (6 stars) to avoid clutter
        if (selectedStars.length >= 6) {
          setTimeout(function() {
            clearUserLines();
          }, 5000);
        }
      }
    }
  }

  function createHighlightTexture() {
    var c = document.createElement('canvas'); c.width = 32; c.height = 32;
    var ctx = c.getContext('2d');
    var g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, 'rgba(255,220,100,1)');
    g.addColorStop(0.5, 'rgba(255,200,80,0.4)');
    g.addColorStop(1, 'rgba(255,180,50,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(c);
  }

  function clearUserLines() {
    for (var i = userLines.length - 1; i >= 0; i--) {
      scene.remove(userLines[i]);
      userLines[i].geometry.dispose();
      userLines[i].material.dispose();
    }
    userLines = [];
    selectedStars = [];
    // Remove highlight sprites
    var toRemove = [];
    scene.traverse(function(obj) {
      if (obj.userData.isHighlight) toRemove.push(obj);
    });
    toRemove.forEach(function(obj) { scene.remove(obj); });
    localStorage.removeItem('atrija-constellations');
  }

  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('touchstart', onPointerDown, { passive: true });

  // Load saved constellations
  loadConstellations();
}

function saveConstellations(stars, lines) {
  var data = [];
  for (var i = 0; i < lines.length; i++) {
    var positions = lines[i].geometry.attributes.position.array;
    data.push({
      x1: positions[0], y1: positions[1], z1: positions[2],
      x2: positions[3], y2: positions[4], z2: positions[5]
    });
  }
  localStorage.setItem('atrija-constellations', JSON.stringify(data));
}

function loadConstellations() {
  try {
    var data = JSON.parse(localStorage.getItem('atrija-constellations') || '[]');
    // Lines will be redrawn by initConstellationInteraction after scene is ready
    return data;
  } catch(e) { return []; }
}
```

#### Step 2: Integrate into scene init

In `initScene()`, after creating the scene and adding all objects:

```javascript
// After all scene objects are added
initConstellationInteraction(scene);
```

#### Step 3: Add clear button (optional, long-press)

Add a long-press gesture (hold 2 seconds) to clear all user-drawn constellations.

### 3.3 Mobile Considerations

- Touch events supported via `touchstart` listener
- Larger raycaster threshold (2.0) for easier star selection on small screens
- Hint text positioned above the flute button (bottom: 6rem)
- Lines auto-fade after 30 seconds to avoid clutter on small viewports

### 3.4 Data Structures

```json
// localStorage key: "atrija-constellations"
[
  { "x1": -2.0, "y1": 5.0, "z1": -30.0, "x2": 0.0, "y2": 6.0, "z2": -30.0 },
  { "x1": 0.0, "y1": 6.0, "z1": -30.0, "x2": 2.0, "y2": 5.0, "z2": -30.0 }
]
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| localStorage save stores correct format | `tests/unit/constellations.test.js` | `JSON.parse(saved).length === lineCount` |
| localStorage load returns array | `tests/unit/constellations.test.js` | `Array.isArray(loaded)` |
| Clear removes all lines | `tests/unit/constellations.test.js` | `userLines.length === 0 after clear` |
| Line fade starts at 0 opacity | `tests/unit/constellations.test.js` | `line.opacity === 0 initially` |

### 4.2 Green Phase — Implementation

Implement `initConstellationInteraction()`, integrate into scene.

### 4.3 Refactor Phase — Optimization

- Debounce localStorage writes (save every 5 seconds, not every line)
- Pool line geometries instead of creating new ones
- Limit max 10 user-drawn lines to avoid clutter

---

## 5. Acceptance Criteria

- [ ] Clicking/tapping a star selects it (highlight appears)
- [ ] Clicking a second star draws a glowing line between them
- [ ] Lines fade in over 0.5 seconds
- [ ] Lines slowly fade out after 30 seconds
- [ ] Drawn constellations persist in localStorage across page reloads
- [ ] Long-press (2s) clears all user-drawn constellations
- [ ] Hint text "Tap stars to connect them" appears and fades after first interaction
- [ ] Works on both desktop (click) and mobile (tap)
- [ ] All unit tests pass

---

## 6. Dependencies & Risks

**Dependencies:** Existing star `Points` objects in scene, `VanGoghScene` class with camera/renderer references

**Risks:**
- Raycaster may miss star particles if threshold is too small → Use generous threshold (2.0)
- localStorage may be unavailable in private browsing → Wrap in try/catch
- Too many drawn lines could impact performance → Limit to 10, auto-fade after 30s
- Touch events may conflict with scroll → Use `pointerdown` which handles both

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Interactive constellation drawing — tap stars to connect them with glowing lines",
  "changes": [
    "Raycaster-based star selection with touch support",
    "Glowing line drawing between selected stars",
    "localStorage persistence for user constellations",
    "Auto-fade lines after 30 seconds, long-press to clear"
  ]
}
```
