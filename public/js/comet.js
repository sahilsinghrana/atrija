/**
 * Comet with Particle Trail (idea-044)
 *
 * A majestic comet with glowing particle trail that slowly crosses the sky.
 * Implemented as a standalone HTML5 Canvas overlay positioned over the Three.js scene.
 *
 * Features:
 * - Appears every 3-5 minutes at random intervals
 * - Large, slow-moving comet (30-60 second crossing time)
 * - Glowing particle trail using Canvas gradient effects
 * - Random trajectory across the sky (entry/exit on different edges)
 * - Fully standalone — no scene-bootstrap.js modifications required
 * - Zero dependencies — pure vanilla JavaScript
 * - Respects prefers-reduced-motion
 *
 * @module comet
 */
(function () {
  'use strict';

  // ── Configuration ──────────────────────────────────────────────
  const CONFIG = {
    // Time between comet appearances (seconds)
    MIN_INTERVAL: 180,   // 3 minutes
    MAX_INTERVAL: 300,   // 5 minutes

    // Comet traversal time (seconds)
    TRAVERSAL_TIME_MIN: 30,
    TRAVERSAL_TIME_MAX: 60,

    // Comet properties
    HEAD_SIZE: 6,            // Base radius of comet head (px)
    HEAD_GLOW: 40,           // Glow radius around head (px)
    TRAIL_WIDTH: 3,          // Width of the main trail (px)
    PARTICLE_COUNT: 40,      // Number of particles in trail

    // Colors
    HEAD_COLOR: 'rgba(255, 255, 200, 1.0)',
    GLOW_INNER: 'rgba(255, 255, 100, 0.6)',
    GLOW_OUTER: 'rgba(255, 200, 50, 0.0)',
    TRAIL_COLOR: 'rgba(255, 220, 80, 0.5)',
    PARTICLE_COLOR_R: 255,
    PARTICLE_COLOR_G: 230,
    PARTICLE_COLOR_B: 100,

    // Z-index positioning (above Three.js canvas, below UI)
    Z_INDEX: 9998,

    // Check interval for scheduling (ms)
    SCHEDULE_CHECK_INTERVAL: 5000
  };

  // ── State ──────────────────────────────────────────────────────
  var state = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    animationFrame: null,
    scheduleTimer: null,
    nextShowTime: 0,
    isVisible: false,
    progress: 0,              // 0 to 1 traversal progress
    startTime: 0,
    duration: 0,
    trajectory: null,         // { startX, startY, endX, endY }
    particles: [],            // Array of trail particles
    reducedMotion: false
  };

  // ── Initialization ─────────────────────────────────────────────
  function init() {
    // Respect prefers-reduced-motion
    state.reducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (state.reducedMotion) return;

    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', onDomReady);
    } else {
      onDomReady();
    }
  }

  function onDomReady() {
    createCanvas();
    scheduleNextAppearance();
    startScheduleChecker();

    // Handle resize
    window.addEventListener('resize', onResize);
    onResize();
  }

  function createCanvas() {
    state.canvas = document.createElement('canvas');
    state.canvas.style.position = 'fixed';
    state.canvas.style.top = '0';
    state.canvas.style.left = '0';
    state.canvas.style.width = '100%';
    state.canvas.style.height = '100%';
    state.canvas.style.pointerEvents = 'none';
    state.canvas.style.zIndex = CONFIG.Z_INDEX.toString();
    state.canvas.style.display = 'none';
    state.canvas.setAttribute('aria-hidden', 'true');

    document.body.appendChild(state.canvas);
    state.ctx = state.canvas.getContext('2d');
  }

  function onResize() {
    if (!state.canvas) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.width = window.innerWidth;
    state.height = window.innerHeight;
    state.canvas.width = state.width * dpr;
    state.canvas.height = state.height * dpr;
    state.canvas.style.width = state.width + 'px';
    state.canvas.style.height = state.height + 'px';
    state.ctx.scale(dpr, dpr);
  }

  // ── Scheduling ─────────────────────────────────────────────────
  function startScheduleChecker() {
    // Check every 5 seconds if it's time to show the comet
    state.scheduleTimer = setInterval(function () {
      if (!state.isVisible && Date.now() >= state.nextShowTime) {
        startComet();
      }
    }, CONFIG.SCHEDULE_CHECK_INTERVAL);
  }

  function scheduleNextAppearance() {
    var interval = randomRange(CONFIG.MIN_INTERVAL, CONFIG.MAX_INTERVAL) * 1000;
    state.nextShowTime = Date.now() + interval;
  }

  // ── Comet Lifecycle ────────────────────────────────────────────
  function startComet() {
    if (state.isVisible) return;

    state.isVisible = true;
    state.progress = 0;
    state.startTime = performance.now();
    state.duration = randomRange(
      CONFIG.TRAVERSAL_TIME_MIN,
      CONFIG.TRAVERSAL_TIME_MAX
    ) * 1000;

    // Generate trajectory from one edge to a different edge
    state.trajectory = generateRandomTrajectory();

    // Initialize particle trail
    state.particles = [];
    for (var i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
      state.particles.push(createParticle());
    }

    state.canvas.style.display = 'block';
    animate();
  }

  function generateRandomTrajectory() {
    var margin = 80; // pixels outside screen
    var w = state.width;
    var h = state.height;

    // Define four edges: top, right, bottom, left
    var edges = ['top', 'right', 'bottom', 'left'];
    var startEdge = edges[Math.floor(Math.random() * edges.length)];
    // Pick a different edge for exit
    var remaining = edges.filter(function (e) { return e !== startEdge; });
    var endEdge = remaining[Math.floor(Math.random() * remaining.length)];

    var startX, startY, endX, endY;

    switch (startEdge) {
      case 'top':
        startX = randomRange(0, w);
        startY = -margin;
        break;
      case 'right':
        startX = w + margin;
        startY = randomRange(0, h);
        break;
      case 'bottom':
        startX = randomRange(0, w);
        startY = h + margin;
        break;
      case 'left':
        startX = -margin;
        startY = randomRange(0, h);
        break;
    }

    switch (endEdge) {
      case 'top':
        endX = randomRange(0, w);
        endY = -margin;
        break;
      case 'right':
        endX = w + margin;
        endY = randomRange(0, h);
        break;
      case 'bottom':
        endX = randomRange(0, w);
        endY = h + margin;
        break;
      case 'left':
        endX = -margin;
        endY = randomRange(0, h);
        break;
    }

    return { startX: startX, startY: startY, endX: endX, endY: endY };
  }

  function createParticle() {
    return {
      offsetX: randomRange(-0.02, 0.02),  // Relative offset behind comet
      offsetY: randomRange(-0.01, 0.01),
      size: randomRange(1, 3),
      opacity: randomRange(0.2, 0.7),
      drift: randomRange(-0.3, 0.3)       // Lateral drift speed
    };
  }

  // ── Animation Loop ─────────────────────────────────────────────
  function animate() {
    if (!state.isVisible) {
      cancelAnimationFrame(state.animationFrame);
      state.animationFrame = null;
      return;
    }

    var elapsed = performance.now() - state.startTime;
    state.progress = Math.min(elapsed / state.duration, 1);

    // Clear canvas
    state.ctx.clearRect(0, 0, state.width, state.height);

    if (state.progress >= 1) {
      finishComet();
      return;
    }

    // Render comet
    renderComet();

    // Request next frame
    state.animationFrame = requestAnimationFrame(animate);
  }

  function renderComet() {
    if (!state.ctx || !state.trajectory) return;

    var traj = state.trajectory;
    var w = state.width;
    var h = state.height;

    // Calculate current head position
    var hx = traj.startX + (traj.endX - traj.startX) * state.progress;
    var hy = traj.startY + (traj.endY - traj.startY) * state.progress;

    // Direction vector (normalized)
    var dx = traj.endX - traj.startX;
    var dy = traj.endY - traj.startY;
    var len = Math.sqrt(dx * dx + dy * dy);
    var ux = dx / len;
    var uy = dy / len;

    // Perpendicular for trail spread
    var px = -uy;
    var py = ux;

    // Trail length proportional to screen size
    var trailLen = Math.max(w, h) * 0.25 * Math.min(state.progress * 4, 1);

    // ── Draw main trail (gradient line behind head) ──
    if (trailLen > 5) {
      var trailEndX = hx - ux * trailLen;
      var trailEndY = hy - uy * trailLen;

      // Wide glowing trail
      state.ctx.beginPath();
      state.ctx.moveTo(hx + px * CONFIG.TRAIL_WIDTH, hy + py * CONFIG.TRAIL_WIDTH);
      state.ctx.lineTo(trailEndX + px * 1, trailEndY + py * 1);
      state.ctx.lineTo(trailEndX - px * 1, trailEndY - py * 1);
      state.ctx.lineTo(hx - px * CONFIG.TRAIL_WIDTH, hy - py * CONFIG.TRAIL_WIDTH);
      state.ctx.closePath();

      var trailGrad = state.ctx.createLinearGradient(hx, hy, trailEndX, trailEndY);
      trailGrad.addColorStop(0, CONFIG.TRAIL_COLOR);
      trailGrad.addColorStop(1, 'rgba(255, 150, 30, 0.0)');
      state.ctx.fillStyle = trailGrad;
      state.ctx.fill();
    }

    // ── Draw particles along trail ──
    for (var i = 0; i < state.particles.length; i++) {
      var particle = state.particles[i];
      // Particle position: behind the head, spread along trail
      var behind = (i / state.particles.length) * trailLen;
      var spread = particle.drift * behind * 0.5;
      var age = (i / state.particles.length); // 0 = near head, 1 = far tail

      var ppx = hx - ux * behind + px * spread;
      var ppy = hy - uy * behind + py * spread;

      // Fade with age
      var alpha = particle.opacity * (1 - age) * (1 - state.progress * 0.5);
      if (alpha < 0.01) continue;

      state.ctx.beginPath();
      state.ctx.arc(ppx, ppy, particle.size * (1 - age * 0.5), 0, Math.PI * 2);
      state.ctx.fillStyle = 'rgba(' +
        CONFIG.PARTICLE_COLOR_R + ',' +
        CONFIG.PARTICLE_COLOR_G + ',' +
        CONFIG.PARTICLE_COLOR_B + ',' +
        alpha + ')';
      state.ctx.fill();
    }

    // ── Draw comet head glow ──
    var glowRadius = CONFIG.HEAD_SIZE + CONFIG.HEAD_GLOW;
    var gradient = state.ctx.createRadialGradient(
      hx, hy, 0,
      hx, hy, glowRadius
    );
    gradient.addColorStop(0, CONFIG.GLOW_INNER);
    gradient.addColorStop(0.3, 'rgba(255, 200, 50, 0.2)');
    gradient.addColorStop(1, CONFIG.GLOW_OUTER);

    state.ctx.beginPath();
    state.ctx.arc(hx, hy, glowRadius, 0, Math.PI * 2);
    state.ctx.fillStyle = gradient;
    state.ctx.fill();

    // ── Draw comet head core ──
    state.ctx.beginPath();
    state.ctx.arc(hx, hy, CONFIG.HEAD_SIZE, 0, Math.PI * 2);
    state.ctx.fillStyle = CONFIG.HEAD_COLOR;
    state.ctx.fill();
  }

  function finishComet() {
    state.isVisible = false;
    state.canvas.style.display = 'none';
    if (state.animationFrame) {
      cancelAnimationFrame(state.animationFrame);
      state.animationFrame = null;
    }
    scheduleNextAppearance();
  }

  // ── Utility Functions ──────────────────────────────────────────
  function randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  // ── Cleanup on page unload ─────────────────────────────────────
  window.addEventListener('beforeunload', function () {
    if (state.scheduleTimer) clearInterval(state.scheduleTimer);
    if (state.animationFrame) cancelAnimationFrame(state.animationFrame);
  });

  // ── Start ──────────────────────────────────────────────────────
  init();
})();
