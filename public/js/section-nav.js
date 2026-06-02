/**
 * Section Progress Navigator — Dot/Bar Scroll Indicator (idea-057)
 *
 * A minimal vertical dot navigation bar fixed to the right edge of the
 * viewport showing all major sections (Hero, Today, Moon, Philosophy,
 * Gita, Shiva, Art, Contemplation, Changelog). Current section is
 * highlighted via IntersectionObserver. Dots are keyboard-navigable
 * (Tab + Enter scrolls to section). On mobile (< 768px), collapses to
 * a subtle thin progress bar.
 *
 * Pure CSS + standalone JS — zero Three.js impact, no scene-init.js changes.
 */
(function () {
  'use strict';

  // ── Configuration ──────────────────────────────────────────────
  var SECTION_IDS = [
    'hero',
    'today',
    'moon',
    'philosophy',
    'gita',
    'shiva',
    'art',
    'koan',
    'changelog',
  ];

  var SECTION_LABELS = {
    hero: 'Hero',
    today: 'Today',
    moon: 'Moon',
    philosophy: 'Philosophy',
    gita: 'Gita',
    shiva: 'Shiva',
    art: 'Art',
    koan: 'Contemplation',
    changelog: 'Changelog',
  };

  var MOBILE_BREAKPOINT = 768;
  var OBSERVER_ROOT_MARGIN = '-10% 0px -10% 0px';
  var OBSERVER_THRESHOLD = [0, 0.25, 0.5, 0.75, 1.0];

  // ── State ───────────────────────────────────────────────────────
  var isReducedMotion = false;
  var isMobile = false;
  var navContainer = null;
  var dots = [];
  var progressBar = null;
  var progressFill = null;
  var currentIndex = -1;
  var ticking = false;

  // ── Feature Detection ──────────────────────────────────────────
  function detectCapabilities() {
    isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  }

  // ── Create Dot Navigation (desktop) ────────────────────────────
  function createDotNav() {
    navContainer = document.createElement('div');
    navContainer.id = 'section-nav';
    navContainer.setAttribute('role', 'navigation');
    navContainer.setAttribute('aria-label', 'Section navigation');
    // Inline styles for immediate render (no FOUC)
    navContainer.style.cssText = [
      'position: fixed',
      'right: 1rem',
      'top: 50%',
      'transform: translateY(-50%)',
      'z-index: 50',
      'display: flex',
      'flex-direction: column',
      'gap: 0.625rem',
      'padding: 0.5rem',
    ].join('; ');

    SECTION_IDS.forEach(function (id, index) {
      var dot = document.createElement('button');
      dot.setAttribute('type', 'button');
      dot.setAttribute('aria-label', 'Go to ' + (SECTION_LABELS[id] || id) + ' section');
      dot.setAttribute('title', SECTION_LABELS[id] || id);
      dot.setAttribute('tabindex', '0');
      dot.dataset.sectionId = id;
      dot.dataset.index = String(index);

      dot.style.cssText = [
        'width: 10px',
        'height: 10px',
        'border-radius: 50%',
        'border: 1.5px solid rgba(255, 213, 79, 0.45)',
        'background: transparent',
        'cursor: pointer',
        'padding: 0',
        'display: block',
        'transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease',
        '-webkit-tap-highlight-color: transparent',
      ].join('; ');

      // Keyboard: Enter/Space scrolls to section
      dot.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          scrollToSection(id);
        }
      });

      // Click scrolls to section
      dot.addEventListener('click', function (e) {
        e.preventDefault();
        scrollToSection(id);
      });

      // Hover tooltip via title attribute (already set)
      dots.push(dot);
      navContainer.appendChild(dot);
    });

    document.body.appendChild(navContainer);
  }

  // ── Create Progress Bar (mobile) ────────────────────────────────
  function createProgressBar() {
    progressBar = document.createElement('div');
    progressBar.id = 'section-progress-bar';
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-label', 'Reading progress');
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', '100');
    progressBar.setAttribute('aria-valuenow', '0');
    progressBar.style.cssText = [
      'position: fixed',
      'top: 0',
      'left: 0',
      'width: 100%',
      'height: 3px',
      'z-index: 50',
      'background: rgba(255, 255, 255, 0.06)',
    ].join('; ');

    progressFill = document.createElement('div');
    progressFill.id = 'section-progress-fill';
    progressFill.style.cssText = [
      'height: 100%',
      'width: 0%',
      'background: linear-gradient(90deg, var(--accent-gold), var(--accent-coral))',
      'transition: width 0.15s ease-out',
    ].join('; ');

    progressBar.appendChild(progressFill);
    document.body.appendChild(progressBar);
  }

  // ── Scroll to Section ───────────────────────────────────────────
  function scrollToSection(id) {
    var el = document.getElementById(id);
    if (!el) return;

    var behavior = isReducedMotion ? 'auto' : 'smooth';
    el.scrollIntoView({ behavior: behavior, block: 'start' });

    // Announce to screen readers
    announceSection(id);
  }

  // ── Screen Reader Announcement ──────────────────────────────────
  function announceSection(id) {
    var announcer = document.getElementById('section-nav-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'section-nav-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      document.body.appendChild(announcer);
    }
    announcer.textContent = 'Navigated to ' + (SECTION_LABELS[id] || id) + ' section';
  }

  // ── Update Active Dot ───────────────────────────────────────────
  function updateActiveDot(index) {
    if (index === currentIndex) return;
    currentIndex = index;

    dots.forEach(function (dot, i) {
      if (i === index) {
        dot.style.background = 'var(--accent-gold)';
        dot.style.borderColor = 'var(--accent-gold)';
        dot.style.transform = 'scale(1.3)';
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.style.background = 'transparent';
        dot.style.borderColor = 'rgba(255, 213, 79, 0.45)';
        dot.style.transform = 'scale(1)';
        dot.removeAttribute('aria-current');
      }
    });
  }

  // ── Update Progress Bar (mobile) ────────────────────────────────
  function updateProgressBar() {
    if (!progressFill) return;

    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;

    var pct = Math.min((scrollTop / docHeight) * 100, 100);
    progressFill.style.width = pct.toFixed(1) + '%';

    if (progressBar) {
      progressBar.setAttribute('aria-valuenow', Math.round(pct).toString());
    }
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

  // ── IntersectionObserver Setup (desktop dots) ───────────────────
  function setupObserver() {
    var observedElements = [];
    SECTION_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observedElements.push(el);
    });

    if (observedElements.length === 0) return;

    var observer = new IntersectionObserver(function (entries) {
      var dominant = findDominantSection(entries);
      if (dominant) {
        var idx = SECTION_IDS.indexOf(dominant.target.id);
        if (idx !== -1) {
          updateActiveDot(idx);
        }
      }
    }, {
      threshold: OBSERVER_THRESHOLD,
      rootMargin: OBSERVER_ROOT_MARGIN,
    });

    observedElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ── Scroll Fallback for Mobile Progress Bar ─────────────────────
  function setupScrollFallback() {
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          // Also try to update dots based on scroll position (desktop fallback)
          if (!isMobile && navContainer) {
            var scrollY = window.scrollY + window.innerHeight / 2;
            var foundIdx = 0;
            for (var i = SECTION_IDS.length - 1; i >= 0; i--) {
              var el = document.getElementById(SECTION_IDS[i]);
              if (el) {
                var rect = el.getBoundingClientRect();
                var absTop = rect.top + window.scrollY;
                if (scrollY >= absTop) {
                  foundIdx = i;
                  break;
                }
              }
            }
            updateActiveDot(foundIdx);
          }

          // Mobile progress bar
          if (isMobile) {
            updateProgressBar();
          }

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ── Handle Resize ───────────────────────────────────────────────
  function handleResize() {
    var wasMobile = isMobile;
    isMobile = window.innerWidth < MOBILE_BREAKPOINT;

    if (isMobile !== wasMobile) {
      // Mode changed — toggle visibility
      if (isMobile) {
        if (navContainer) navContainer.style.display = 'none';
        if (progressBar) progressBar.style.display = 'block';
      } else {
        if (navContainer) navContainer.style.display = 'flex';
        if (progressBar) progressBar.style.display = 'none';
      }
    }
  }

  // ── Init ────────────────────────────────────────────────────────
  function init() {
    detectCapabilities();

    // Always create both; show/hide based on viewport
    createDotNav();
    createProgressBar();

    // Set initial visibility
    if (isMobile) {
      navContainer.style.display = 'none';
      progressBar.style.display = 'block';
    } else {
      navContainer.style.display = 'flex';
      progressBar.style.display = 'none';
    }

    // Setup IntersectionObserver for desktop dots
    if ('IntersectionObserver' in window) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupObserver);
      } else {
        setupObserver();
      }
    }

    // Always setup scroll fallback (handles mobile progress + desktop fallback)
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupScrollFallback);
      document.addEventListener('DOMContentLoaded', updateProgressBar);
    } else {
      setupScrollFallback();
      updateProgressBar();
    }

    // Resize handler
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resumeTimer);
      resizeTimer = setTimeout(handleResize, 200);
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for testing
  window.__sectionNav = {
    scrollToSection: scrollToSection,
    getCurrentIndex: function () { return currentIndex; },
    getSectionIds: function () { return SECTION_IDS.slice(); },
  };

})();
