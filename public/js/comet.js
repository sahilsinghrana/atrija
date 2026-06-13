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
 * - Random trajectory across the sky
 * - Fully standalone - no scene-init.js modifications required
 * - Zero dependencies - pure vanilla JavaScript
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
    HEAD_SIZE: 20,           // Base radius of comet head
    HEAD_GLOW: 50,           // Glow radius around head
    TRAIL_LENGTH: 0.3,       // Fraction of screen width for trail
    PARTICLE_COUNT: 30,      // Number of particles in trail
    
    // Colors (CSS format)
    HEAD_COLOR: '#ffff00',   // Bright yellow head
    HEAD_GLOW_COLOR: '#ffff88', // Pale yellow glow
    TRAIL_START_COLOR: '#ffff00', // Yellow start
    TRAIL_END_COLOR: '#ff0000',   // Red end
    PARTICLE_COLOR: '#ffff00',    // Yellow particles
    
    // Z-index positioning (above Three.js canvas, below UI)
    Z_INDEX: 9998
  };

  // ── State ──────────────────────────────────────────────────────
  let state = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    animationFrame: null,
    lastShowTime: 0,
    nextShowTime: 0,
    isVisible: false,
    progress: 0,              // 0 to 1 traversal progress
    startTime: 0,
    duration: 0,
    trajectory: null,         // { startX, startY, endX, endY }
    particles: []             // Array of trail particles
  };

  // ── Initialization ─────────────────────────────────────────────
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    
    createCanvas();
    scheduleNextAppearance();
    
    // Handle resize
    window.addEventListener('resize', onResize);
    onResize(); // Initial sizing
  }

  function createCanvas() {
    state.canvas = document.createElement('canvas');
    state.canvas.style.position = 'fixed';
    state.canvas.style.top = '0';
    state.canvas.style.left = '0';
    state.canvas.style.width = '100%';
    state.canvas.style.height = '100%';
    state.canvas.style.pointerEvents = 'none'; // Don't block interactions
    state.canvas.style.zIndex = CONFIG.Z_INDEX.toString();
    state.canvas.style.display = 'none'; // Hidden by default
    
    document.body.appendChild(state.canvas);
    state.ctx = state.canvas.getContext('2d');
  }

  function onResize() {
    if (!state.canvas) return;
    
    state.width = window.innerWidth;
    state.height = window.innerHeight;
    state.canvas.width = state.width;
    state.canvas.height = state.height;
  }

  // ── Appearance Logic ───────────────────────────────────────────
  function scheduleNextAppearance() {
    const now = Date.now();
    const interval = randomRange(CONFIG.MIN_INTERVAL, CONFIG.MAX_INTERVAL) * 1000;
    state.nextShowTime = now + interval;
  }

  function startComet() {
    if (state.isVisible) return;
    
    state.isVisible = true;
    state.progress = 0;
    state.startTime = performance.now();
    state.duration = randomRange(
      CONFIG.TRAVERSAL_TIME_MIN, 
      CONFIG.TRAVERSAL_TIME_MAX
    ) * 1000; // Convert to milliseconds
    
    // Generate random trajectory (from off-screen to off-screen)
    state.trajectory = generateRandomTrajectory();
    
    // Initialize particle trail
    state.particles = [];
    for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
      state.particles.push(createParticle());
    }
    
    state.canvas.style.display = 'block';
    animate();
  }

  function generateRandomTrajectory() {
    // Start and end points outside the viewport
    const margin = 100; // pixels outside screen
    
    // Randomly choose entry and exit sides
    const sides = ['top', 'bottom', 'left', 'right'];
    const startSide = sides[Math.floor(Math.random() * sides.length)];
    const endSide = sides[Math.floor(Math.random() * sides.length)];
    
    let startX, startY, endX, endY;
    
    // Set start point
    switch (startSide) {
      case 'top':
        startX = randomRange(0, state.width);
        startY = -margin;
        break;
      case 'bottom':
        startX = randomRange(0, state.width);
        startY = state.height + margin;
        break;
      case 'left':
        startX = -margin;
        startY = randomRange(0, state.height);
        break;
      case 'right':
        startX = state.width + margin;
        startY = randomRange(0, state.height);
        break;
    }
    
    // Set end point (different side)
    switch (endSide) {
      case 'top':
        endX = randomRange(0, state.width);
        endY = -margin;
        break;
      case 'bottom':
        endX = randomRange(0, state.width);
        endY = state.height + margin;
        break;
      case 'left':
        endX = -margin;
        endY = randomRange(0, state.height);
        break;
      case 'right':
        endX = state.width + margin;
        endY = randomRange(0, state.height);
        break;
    }
    
    return { startX, startY, endX, endY };
  }

  function createParticle() {
    return {
      x: 0,
      y: 0,
      life: 0,              // 0 to 1
      maxLife: 1,
      size: randomRange(1, 3),
      opacity: randomRange(0.3, 0.8)
    };
  }

  // ── Animation Loop ─────────────────────────────────────────────
  function animate() {
    if (!state.isVisible) {
      cancelAnimationFrame(state.animationFrame);
      state.animationFrame = null;
      return;
    }
    
    // Calculate progress (0 to 1)
    const elapsed = performance.now() - state.startTime;
    state.progress = Math.min(elapsed / state.duration, 1);
    
    // Clear canvas
    state.ctx.clearRect(0, 0, state.width, state.height);
    
    if (state.progress >= 1) {
      // Comet finished traversal
      finishComet();
      return;
    }
    
    // Update particle life
    state.particles.forEach(p => {
      p.life += 1 / 60; // Assume 60fps
      if (p.life >= p.maxLife) {
        // Reset particle
        Object.assign(p, createParticle());
      }
    });
    
    // Render comet
    renderComet();
    
    // Request next frame
    state.animationFrame = requestAnimationFrame(animate);
  }

  function renderComet() {
    if (!state.ctx) return;
    
    // Calculate current position along trajectory
    const px = state.trajectory.startX + (state.trajectory.endX - state.trajectory.startX) * state.progress;
    const py = state.trajectory.startY + (state.trajectory.endY - state.trajectory.startY) * state.progress;
    
    // Draw particle trail (behind head)
    state.particles.forEach(particle => {
      // Interpolate particle position along trajectory
      const particleProgress = state.progress - (particle.life / particle.maxLife) * 0.2; // Trail behind
      if (particleProgress < 0 || particleProgress > 1) return; // Skip if not visible yet
      
      const tx = state.trajectory.startX + (state.trajectory.endX - state.trajectory.startX) * particleProgress;
      const ty = state.trajectory.startY + (state.trajectory.endY - state.trajectory.startY) * particleProgress;
      
      // Draw particle
      state.ctx.beginPath();
      state.ctx.arc(tx, ty, particle.size, 0, Math.PI * 2);
      state.ctx.fillStyle = `rgba(255, 255, 0, ${particle.opacity * (1 - particle.life / particle.maxLife)})`;
      state.ctx.fill();
    });
    
    // Draw comet head glow
    const gradient = state.ctx.createRadialGradient(
      px, py, 0,
      px, py, CONFIG.HEAD_SIZE + CONFIG.HEAD_GLOW
    );
    gradient.addColorStop(0, 'rgba(255, 255, 0, 0.1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.05)');
    gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
    
    state.ctx.beginPath();
    state.ctx.arc(px, py, CONFIG.HEAD_SIZE + CONFIG.HEAD_GLOW, 0, Math.PI * 2);
    state.ctx.fillStyle = gradient;
    state.ctx.fill();
    
    // Draw comet head
    state.ctx.beginPath();
    state.ctx.arc(px, py, CONFIG.HEAD_SIZE, 0, Math.PI * 2);
    state.ctx.fillStyle = CONFIG.HEAD_COLOR;
    state.ctx.fill();
    
    // Add a slight tail effect (lines behind head)
    const tailLength = state.progress * state.width * CONFIG.TRAIL_LENGTH;
    if (tailLength > 5) {
      // Calculate direction vector
      const dx = state.trajectory.endX - state.trajectory.startX;
      const dy = state.trajectory.endY - state.trajectory.startY;
      const length = Math.sqrt(dx * dx + dy * dy);
      const unitX = dx / length;
      const unitY = dy / length;
      
      // Draw fading trail lines
      for (let i = 1; i <= 5; i++) {
        const offset = (i * tailLength) / 5;
        const tx = px - unitX * offset;
        const ty = py - unitY * offset;
        const alpha = 1 - (i / 5);
        const width = 2 * (1 - i / 5);
        
        state.ctx.beginPath();
        state.ctx.moveTo(tx, ty);
        state.ctx.lineTo(tx + unitX * 5, ty + unitY * 5);
        state.ctx.strokeStyle = `rgba(255, 255, 0, ${alpha * 0.3})`;
        state.ctx.lineWidth = width;
        state.ctx.stroke();
      }
    }
  }

  function finishComet() {
    state.isVisible = false;
    state.canvas.style.display = 'none';
    cancelAnimationFrame(state.animationFrame);
    state.animationFrame = null;
    scheduleNextAppearance();
  }

  // ── Utility Functions ──────────────────────────────────────────
  function randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  // ── Start Initialization ───────────────────────────────────────
  init();

})();