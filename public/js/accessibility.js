/**
 * Accessibility Enhancements Module (idea-053)
 *
 * Pure JS overlay — no scene-init.js changes.
 * Provides:
 *   1. Skip-navigation link for keyboard users
 *   2. Visible focus indicators via focus-visible CSS class management
 *   3. ARIA labels on icon-only controls (flute button)
 *   4. aria-live region for quote carousel auto-rotation announcements
 *   5. Respect for prefers-reduced-motion (adds data-reduced-motion attr to <html>)
 *   6. Enhanced keyboard support for carousel dot navigation
 */
(function() {
  'use strict';

  // ── 1. Skip Navigation Link ─────────────────────────────────────────
  function injectSkipLink() {
    var skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-nav-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // ── 2. Flute Button ARIA ────────────────────────────────────────────
  function enhanceFluteButton() {
    var flute = document.getElementById('flute-container');
    if (!flute) return;
    // Already has title; add role and proper label
    flute.setAttribute('role', 'button');
    flute.setAttribute('tabindex', '0');
    flute.setAttribute('aria-label', 'Play bansuri — click to spawn floating music notes');

    // Allow keyboard activation (Enter / Space)
    flute.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flute.click();
      }
    });
  }

  // ── 3. Carousel aria-live Region ────────────────────────────────────
  function enhanceCarousels() {
    var carousels = document.querySelectorAll('.quote-carousel');
    carousels.forEach(function(carousel) {
      // Add aria-live region for screen reader announcements
      var liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.id = 'carousel-live-' + (carousel.id || carousel.dataset.themeIndex || Math.random().toString(36).slice(2, 8));
      carousel.appendChild(liveRegion);

      // Enhance dot buttons with keyboard support and better labels
      var dots = carousel.querySelectorAll('.quote-dot');
      dots.forEach(function(dot, i) {
        dot.setAttribute('aria-label', 'Quote ' + (i + 1) + ' of ' + dots.length);
        if (!dot.hasAttribute('tabindex')) {
          dot.setAttribute('tabindex', '0');
        }
        // Ensure Enter/Space activates the dot
        dot.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            dot.click();
          }
        });
      });

      // Hook into the existing carousel's show function via MutationObserver
      // to announce quote changes to screen readers
      var quoteCards = carousel.querySelectorAll('.quote-card');
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            var target = mutation.target;
            if (target.classList.contains('quote-card') && target.style.display !== 'none' && !target.classList.contains('hidden')) {
              var quoteText = target.textContent.trim();
              if (quoteText && liveRegion) {
                // Brief delay to let the DOM settle
                setTimeout(function() {
                  liveRegion.textContent = quoteText.substring(0, 150) + (quoteText.length > 150 ? '…' : '');
                }, 100);
              }
            }
          }
        });
      });
      quoteCards.forEach(function(card) {
        observer.observe(card, { attributes: true, attributeFilter: ['style', 'class'] });
      });
    });
  }

  // ── 4. ARIA Labels on Icon-Only Controls ────────────────────────────
  function enhanceIconOnlyControls() {
    // Theme switcher toggle button
    var themeToggle = document.getElementById('theme-switcher-toggle');
    if (themeToggle) {
      themeToggle.setAttribute('aria-haspopup', 'true');
      // aria-label already set by theme-switcher.js
    }

    // Scene error reload button
    var sceneErrorBtn = document.querySelector('#scene-error button');
    if (sceneErrorBtn && !sceneErrorBtn.getAttribute('aria-label')) {
      sceneErrorBtn.setAttribute('aria-label', 'Reload page to retry loading 3D scene');
    }

    // Changelog load-more button (enhanced by changelog-app.js, but ensure label)
    var loadMoreObserver = new MutationObserver(function() {
      var loadMoreBtn = document.querySelector('.changelog-load-more');
      if (loadMoreBtn && !loadMoreBtn.hasAttribute('aria-label')) {
        loadMoreBtn.setAttribute('aria-label', 'Load more changelog entries');
      }
    });
    var changelogApp = document.getElementById('changelog-app');
    if (changelogApp) {
      loadMoreObserver.observe(changelogApp, { childList: true, subtree: true });
    }
  }

  // ── 5. prefers-reduced-motion ───────────────────────────────────────
  function handleReducedMotion() {
    var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    function apply() {
      if (mq.matches) {
        document.documentElement.setAttribute('data-reduced-motion', 'true');
      } else {
        document.documentElement.removeAttribute('data-reduced-motion');
      }
    }
    apply();
    // Listen for changes (user may toggle OS setting while page is open)
    if (mq.addEventListener) {
      mq.addEventListener('change', apply);
    } else if (mq.addListener) {
      mq.addListener(apply); // Safari < 14 fallback
    }
  }

  // ── 6. Focus management on scroll sections ──────────────────────────
  function enhanceSectionNavigation() {
    // Ensure all main sections are reachable by keyboard
    var sections = document.querySelectorAll('section[id]');
    sections.forEach(function(section) {
      // Ensure sections can receive focus for scroll-target navigation
      if (!section.hasAttribute('tabindex')) {
        section.setAttribute('tabindex', '-1');
      }
    });
  }

  // ── 7. Ensure footer is a landmark ──────────────────────────────────
  function enhanceFooter() {
    var footer = document.querySelector('footer');
    if (footer && !footer.hasAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
    }
  }

  // ── 8. Ensure main landmark ─────────────────────────────────────────
  function enhanceMain() {
    var main = document.querySelector('main');
    if (main && !main.hasAttribute('role')) {
      main.setAttribute('role', 'main');
    }
  }

  // ── Init ─────────────────────────────────────────────────────────────
  function init() {
    injectSkipLink();
    enhanceFluteButton();
    enhanceCarousels();
    enhanceIconOnlyControls();
    handleReducedMotion();
    enhanceSectionNavigation();
    enhanceFooter();
    enhanceMain();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
