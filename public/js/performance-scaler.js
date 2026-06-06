/**
 * Adaptive Performance Quality Scaler (idea-054)
 *
 * A lightweight FPS monitor that dynamically scales 3D scene quality
 * to maintain smooth performance. Tracks rolling average FPS over
 * 60 frames. Quality level persisted in sessionStorage.
 *
 * Quality levels:
 *   high   (≥50 FPS) — full quality, all effects enabled
 *   medium (≥30 FPS) — reduced particles, simplified shaders
 *   low    (<30 FPS)  — minimal effects, best effort frame rate
 *
 * The quality level is set as a `data-quality` attribute on <html>
 * and a custom event `atrija:quality-change` is dispatched with
 * `{ quality, fps, prevQuality }` so other modules can react.
 *
 * Standalone module — no scene-init.js modifications.
 */
(function () {
  'use strict';

  // ── Configuration ──────────────────────────────────────────────
  var STORAGE_KEY = 'atrija-quality-level';
  var FRAME_WINDOW = 60;         // rolling average window
  var HIGH_THRESHOLD = 50;       // FPS ≥ this → high
  var MEDIUM_THRESHOLD = 30;     // FPS ≥ this → medium
  var CHECK_INTERVAL_MS = 1000;  // evaluate quality every 1s
  var SETTLE_DELAY_MS = 3000;    // wait 3s after init before scaling
  var COOLDOWN_MS = 5000;        // min time between quality changes
  var MAX_DOWNGRADES = 3;        // max downgrades per session

  // ── State ───────────────────────────────────────────────────────
  var quality = 'high';
  var prevQuality = 'high';
  var frameTimes = [];
  var lastFrameTime = 0;
  var lastCheckTime = 0;
  var lastChangeTime = 0;
  var downgradeCount = 0;
  var running = false;
  var rafId = null;
  var checkTimer = null;
  var settled = false;

  // ── Helpers ─────────────────────────────────────────────────────

  /**
   * Calculate rolling average FPS from collected frame times.
   * @returns {number} Average FPS, or 0 if insufficient data.
   */
  function calculateFPS() {
    if (frameTimes.length < 10) return 0;

    var sum = 0;
    for (var i = 0; i < frameTimes.length; i++) {
      sum += frameTimes[i];
    }
    var avgDelta = sum / frameTimes.length;
    return avgDelta > 0 ? 1000 / avgDelta : 0;
  }

  /**
   * Determine target quality level from current FPS.
   * @param {number} fps - Current average FPS.
   * @returns {string} Target quality level: 'high', 'medium', or 'low'.
   */
  function fpsToQuality(fps) {
    if (fps >= HIGH_THRESHOLD) return 'high';
    if (fps >= MEDIUM_THRESHOLD) return 'medium';
    return 'low';
  }

  /**
   * Quality level numeric rank for comparison.
   * @param {string} q - Quality level string.
   * @returns {number} Numeric rank (higher = better).
   */
  function qualityRank(q) {
    if (q === 'high') return 3;
    if (q === 'medium') return 2;
    return 1; // low
  }

  // ── Persistence ─────────────────────────────────────────────────

  /**
   * Load persisted quality from sessionStorage.
   * @returns {string|null} Stored quality level or null.
   */
  function loadPersistedQuality() {
    try {
      var stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored === 'high' || stored === 'medium' || stored === 'low') {
        return stored;
      }
    } catch (e) {
      // sessionStorage unavailable
    }
    return null;
  }

  /**
   * Persist current quality to sessionStorage.
   * @param {string} q - Quality level to persist.
   */
  function persistQuality(q) {
    try {
      sessionStorage.setItem(STORAGE_KEY, q);
    } catch (e) {
      // sessionStorage unavailable
    }
  }

  // ── Apply Quality ───────────────────────────────────────────────

  /**
   * Apply a quality change: update DOM attribute, persist, dispatch event.
   * @param {string} newQuality - New quality level.
   * @param {number} fps - Current FPS at time of change.
   */
  function applyQuality(newQuality, fps) {
    if (newQuality === quality) return;

    var now = Date.now();

    // Enforce cooldown between changes
    if (now - lastChangeTime < COOLDOWN_MS) return;

    // Limit downgrades per session to prevent thrashing
    if (qualityRank(newQuality) < qualityRank(quality)) {
      if (downgradeCount >= MAX_DOWNGRADES) return;
      downgradeCount++;
    }

    prevQuality = quality;
    quality = newQuality;
    lastChangeTime = now;

    // Update DOM
    document.documentElement.setAttribute('data-quality', quality);
    persistQuality(quality);

    // Dispatch custom event for other modules
    try {
      window.dispatchEvent(new CustomEvent('atrija:quality-change', {
        detail: { quality: quality, fps: Math.round(fps), prevQuality: prevQuality }
      }));
    } catch (e) {
      // CustomEvent not supported (very old browsers)
    }
  }

  // ── FPS Sampling ────────────────────────────────────────────────

  /**
   * RAF callback: collect frame timing and periodically evaluate quality.
   */
  function sampleFrame(timestamp) {
    if (!running) return;

    if (lastFrameTime > 0) {
      var delta = timestamp - lastFrameTime;

      // Ignore anomalous deltas (tab switch, throttle, etc.)
      if (delta > 0 && delta < 500) {
        frameTimes.push(delta);
        if (frameTimes.length > FRAME_WINDOW) {
          frameTimes.shift();
        }
      }
    }
    lastFrameTime = timestamp;

    rafId = requestAnimationFrame(sampleFrame);
  }

  /**
   * Periodic quality evaluation based on rolling average FPS.
   */
  function evaluateQuality() {
    if (!running || !settled) return;

    var fps = calculateFPS();
    if (fps === 0) return; // not enough data yet

    var target = fpsToQuality(fps);

    // Only apply change if it's a downgrade or a sustained upgrade.
    // For upgrades, require FPS to exceed threshold by 10% to avoid oscillation.
    if (qualityRank(target) > qualityRank(quality)) {
      // Potential upgrade — check with hysteresis
      var upgradeFps = quality === 'low'
        ? MEDIUM_THRESHOLD * 1.1
        : HIGH_THRESHOLD * 1.1;
      if (fps < upgradeFps) return; // not enough margin
    }

    applyQuality(target, fps);
  }

  // ── Visibility Handling ─────────────────────────────────────────

  function onVisibilityChange() {
    if (document.hidden) {
      // Pause sampling when tab is hidden
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      // Reset frame data to avoid stale deltas on return
      frameTimes = [];
      lastFrameTime = 0;
    } else if (running) {
      // Resume sampling
      lastFrameTime = 0;
      rafId = requestAnimationFrame(sampleFrame);
    }
  }

  // ── Init ────────────────────────────────────────────────────────

  /**
   * Initialize the performance scaler.
   * Loads persisted quality, starts FPS sampling, and schedules
   * quality evaluation after the settle delay.
   */
  function init() {
    // Don't run in iframes
    if (window !== window.top) return;

    // Apply persisted quality from previous session
    var stored = loadPersistedQuality();
    if (stored) {
      quality = stored;
      prevQuality = stored;
      document.documentElement.setAttribute('data-quality', quality);
    } else {
      // Set initial quality based on device capability hints
      var cores = navigator.hardwareConcurrency || 4;
      var isMobile = /Mobi|Android/i.test(navigator.userAgent);
      if (isMobile && cores <= 4) {
        quality = 'medium';
        document.documentElement.setAttribute('data-quality', 'medium');
        persistQuality('medium');
      } else if (cores <= 2) {
        quality = 'low';
        document.documentElement.setAttribute('data-quality', 'low');
        persistQuality('low');
      } else {
        document.documentElement.setAttribute('data-quality', 'high');
      }
    }

    // Start RAF sampling
    running = true;
    rafId = requestAnimationFrame(sampleFrame);

    // Settle delay — don't evaluate quality immediately
    setTimeout(function () {
      settled = true;
    }, SETTLE_DELAY_MS);

    // Periodic evaluation
    checkTimer = setInterval(evaluateQuality, CHECK_INTERVAL_MS);

    // Handle tab visibility
    document.addEventListener('visibilitychange', onVisibilityChange, false);
  }

  // ── Public API (for testing / manual control) ──────────────────
  window.__perfScaler = {
    /** Get current quality level. */
    getQuality: function () { return quality; },

    /** Get current average FPS. */
    getFPS: function () { return Math.round(calculateFPS()); },

    /** Manually set quality level. */
    setQuality: function (q) {
      if (q === 'high' || q === 'medium' || q === 'low') {
        applyQuality(q, calculateFPS());
      }
    },

    /** Get frame sample count. */
    getFrameCount: function () { return frameTimes.length; },

    /** Stop the scaler. */
    stop: function () {
      running = false;
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      if (checkTimer) { clearInterval(checkTimer); checkTimer = null; }
    }
  };

  // ── Bootstrap ───────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
