/**
 * Scroll-Synced Ambient Lighting System (idea-048)
 * 
 * Observes which content section is dominant and smoothly transitions
 * CSS custom properties that drive a fixed ambient overlay.
 * Pure CSS + minimal JS — zero Three.js impact.
 */

(function () {
  'use strict';

  // ── Configuration ──────────────────────────────────────────────
  var SECTION_IDS = ['moon', 'philosophy', 'gita', 'shiva', 'art'];

  var SECTION_LIGHTING = {
    hero:    { hue: 0,   sat: 0,    opacity: 0,   spotlightX: 50, spotlightY: 50 },
    moon:    { hue: 45,  sat: 0.3,  opacity: 0.15, spotlightX: 70, spotlightY: 20 },
    philosophy: { hue: 270, sat: 0.2, opacity: 0.12, spotlightX: 30, spotlightY: 50 },
    gita:    { hue: 200, sat: 0.25, opacity: 0.10, spotlightX: 50, spotlightY: 30 },
    shiva:   { hue: 0,   sat: 0.15, opacity: 0.08, spotlightX: 50, spotlightY: 80 },
    art:     { hue: 30,  sat: 0.35, opacity: 0.18, spotlightX: 60, spotlightY: 40 }
  };

  var TRANSITION_DURATION_MS = 400; // vignette pulse duration
  var LIGHTING_TRANSITION_CSS = 'opacity 1.2s ease-in-out, background 1.5s ease-in-out';

  // ── State ───────────────────────────────────────────────────────
  var currentSection = 'hero';
  var isReducedMotion = false;
  var lowEndDevice = false;
  var overlay = null;
  var pulseTimer = null;

  // ── Feature Detection ──────────────────────────────────────────
  function detectCapabilities() {
    isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Low-end device heuristic: ≤2 CPU cores
    var cores = navigator.hardwareConcurrency || 4;
    lowEndDevice = cores <= 2;
  }

  // ── Create Overlay ──────────────────────────────────────────────
  function createOverlay() {
    overlay = document.createElement('div');
    overlay.id = 'ambient-light-overlay';

    // Inline styles for immediate effect (no FOUC)
    var baseStyles = [
      'position: fixed',
      'inset: 0',
      'pointer-events: none',
      'z-index: 5',
      'will-change: opacity, background',
      'mix-blend-mode: soft-light',
      'opacity: 0'
    ].join('; ');

    // On low-end devices, simplify: no blend mode, solid color
    if (lowEndDevice) {
      baseStyles = baseStyles.replace('mix-blend-mode: soft-light; ', '');
    }

    overlay.style.cssText = baseStyles;

    // Set initial CSS custom properties
    setCustomProperties('hero');

    // Transition (disabled for reduced motion)
    if (!isReducedMotion) {
      overlay.style.transition = LIGHTING_TRANSITION_CSS;
    } else {
      overlay.style.transition = 'none';
    }

    document.body.appendChild(overlay);
    return overlay;
  }

  // ── Set CSS Custom Properties ───────────────────────────────────
  function setCustomProperties(sectionId) {
    var recipe = SECTION_LIGHTING[sectionId] || SECTION_LIGHTING.hero;
    var root = document.documentElement;

    var hslaColor = 'hsla(' + recipe.hue + ', ' + Math.round(recipe.sat * 100) + '%, 50%, ' + recipe.opacity + ')';

    root.style.setProperty('--ambient-color', hslaColor);
    root.style.setProperty('--ambient-hue', recipe.hue);
    root.style.setProperty('--ambient-sat', Math.round(recipe.sat * 100) + '%');
    root.style.setProperty('--ambient-opacity', recipe.opacity);
    root.style.setProperty('--spotlight-x', recipe.spotlightX + '%');
    root.style.setProperty('--spotlight-y', recipe.spotlightY + '%');

    // Update overlay background
    if (overlay) {
      if (lowEndDevice) {
        // Solid color fallback
        overlay.style.background = hslaColor;
      } else {
        // Radial gradient spotlight
        overlay.style.background = 'radial-gradient(ellipse at ' + recipe.spotlightX + '% ' + recipe.spotlightY + ', ' + hslaColor + ' 0%, transparent 70%)';
      }
      overlay.style.opacity = isReducedMotion ? String(recipe.opacity) : '1';
    }
  }

  // ── Vignette Pulse ──────────────────────────────────────────────
  function triggerVignettePulse() {
    if (isReducedMotion || !overlay) return;

    // Clear existing pulse
    if (pulseTimer) {
      clearTimeout(pulseTimer);
      pulseTimer = null;
    }

    overlay.classList.add('vignette-pulse');

    pulseTimer = setTimeout(function () {
      if (overlay) overlay.classList.remove('vignette-pulse');
      pulseTimer = null;
    }, TRANSITION_DURATION_MS);
  }

  // ── Find Dominant Section ──────────────────────────────────────
  function findDominantSection(entries) {
    var best = null;
    var bestRatio = -1;

    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
        bestRatio = entry.intersectionRatio;
        best = entry;
      }
    }

    return best;
  }

  // ── Apply Lighting ──────────────────────────────────────────────
  function applyLighting(sectionId) {
    if (sectionId === currentSection) return;
    currentSection = sectionId;
    setCustomProperties(sectionId);
    triggerVignettePulse();
  }

  // ── IntersectionObserver Setup ──────────────────────────────────
  function setupObserver() {
    var observedElements = [];
    SECTION_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observedElements.push(el);
    });

    if (observedElements.length === 0) return;

    var observerOptions = {
      threshold: [0, 0.25, 0.5, 0.75, 1.0],
      rootMargin: '-10% 0px -10% 0px'
    };

    var observer = new IntersectionObserver(function (entries) {
      var dominant = findDominantSection(entries);
      if (dominant) {
        var sectionId = dominant.target.id;
        if (SECTION_LIGHTING[sectionId]) {
          applyLighting(sectionId);
        }
      }
    }, observerOptions);

    observedElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ── Fallback: Scroll Event (if IntersectionObserver unavailable) ─
  function setupScrollFallback() {
    var ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var scrollY = window.scrollY + window.innerHeight / 2;
          var foundSection = 'hero';

          for (var i = SECTION_IDS.length - 1; i >= 0; i--) {
            var el = document.getElementById(SECTION_IDS[i]);
            if (el) {
              var rect = el.getBoundingClientRect();
              var absTop = rect.top + window.scrollY;
              if (scrollY >= absTop) {
                foundSection = SECTION_IDS[i];
                break;
              }
            }
          }

          applyLighting(foundSection);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ── Init ────────────────────────────────────────────────────────
  function init() {
    detectCapabilities();
    createOverlay();

    if ('IntersectionObserver' in window) {
      // Delay slightly to ensure DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupObserver);
      } else {
        setupObserver();
      }
    } else {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupScrollFallback);
      } else {
        setupScrollFallback();
      }
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for manual triggering / testing
  window.__scrollLighting = {
    applyLighting: applyLighting,
    getCurrentSection: function () { return currentSection; }
  };

})();
