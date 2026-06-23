/**
 * Scene Boot Error Boundary — Themed Error Overlay with Recovery
 *
 * Wraps the existing bootScene() call with a try/catch that displays a
 * themed error overlay when the 3D scene fails to initialize. Provides
 * Retry and Continue-without-3D buttons.
 *
 * Loaded via <script> tag BEFORE scene-bundle.js in index.astro.
 * Zero scene-init.js / scene-bootstrap.js changes.
 *
 * Uses existing CSS custom properties:
 *   --bg, --text-primary, --text-secondary, --accent-gold, --font-serif, --font-sans
 */
(function() {
  'use strict';

  // ── State ──
  var MAX_RETRIES = 3;
  var retryCount = 0;
  var overlayCreated = false;

  // ── Check if prefers-reduced-motion is active ──
  function prefersReducedMotion() {
    return window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // ── Create the error overlay DOM ──
  function createOverlay(errorMsg) {
    if (overlayCreated) return;
    overlayCreated = true;

    // Overlay container
    var overlay = document.createElement('div');
    overlay.id = 'scene-error-overlay';
    overlay.setAttribute('role', 'alert');
    overlay.setAttribute('aria-live', 'assertive');
    overlay.style.cssText = [
      'position: fixed',
      'inset: 0',
      'z-index: 100000',
      'background: var(--bg)',
      'display: flex',
      'flex-direction: column',
      'align-items: center',
      'justify-content: center',
      'padding: 2rem',
      'font-family: var(--font-serif)',
      'color: var(--text-primary)',
      prefersReducedMotion() ? '' : 'opacity: 0; transition: opacity 0.5s ease',
    ].filter(Boolean).join(';');

    // Icon
    var icon = document.createElement('div');
    icon.textContent = '✦';
    icon.style.cssText = [
      'font-size: 2.5rem',
      'color: var(--accent-gold)',
      'margin-bottom: 1.5rem',
      prefersReducedMotion() ? '' : 'animation: scene-error-pulse 3s ease-in-out infinite',
    ].filter(Boolean).join(';');

    // Title
    var title = document.createElement('h2');
    title.textContent = 'The scene could not load';
    title.style.cssText = [
      'font-family: var(--font-serif)',
      'font-size: clamp(1.4rem, 4vw, 2rem)',
      'font-weight: 400',
      'color: var(--text-primary)',
      'margin: 0 0 0.75rem',
      'text-align: center',
      'letter-spacing: 0.02em',
    ].join(';');

    // Description
    var desc = document.createElement('p');
    desc.textContent = 'The 3D experience encountered an error during initialization. You may try again or continue browsing the content.';
    desc.style.cssText = [
      'font-family: var(--font-sans)',
      'font-size: 0.875rem',
      'color: var(--text-secondary)',
      'max-width: 420px',
      'text-align: center',
      'line-height: 1.6',
      'margin: 0 0 1.5rem',
    ].join(';');

    // Error detail (collapsible)
    if (errorMsg) {
      var detailWrap = document.createElement('details');
      detailWrap.style.cssText = [
        'margin-bottom: 1.5rem',
        'max-width: 420px',
        'width: 100%',
      ].join(';');

      var detailSummary = document.createElement('summary');
      detailSummary.textContent = 'Technical details';
      detailSummary.style.cssText = [
        'font-family: var(--font-sans)',
        'font-size: 0.75rem',
        'color: var(--text-secondary)',
        'cursor: pointer',
        'user-select: none',
        'text-align: center',
        'margin-bottom: 0.5rem',
      ].join(';');

      var detailPre = document.createElement('pre');
      detailPre.textContent = errorMsg;
      detailPre.style.cssText = [
        'font-family: monospace',
        'font-size: 0.7rem',
        'color: var(--text-secondary)',
        'background: rgba(255,255,255,0.04)',
        'border: 1px solid rgba(255,255,255,0.08)',
        'border-radius: 6px',
        'padding: 0.75rem',
        'white-space: pre-wrap',
        'word-break: break-word',
        'max-height: 120px',
        'overflow-y: auto',
        'margin: 0',
      ].join(';');

      detailWrap.appendChild(detailSummary);
      detailWrap.appendChild(detailPre);
    }

    // Button container
    var btnWrap = document.createElement('div');
    btnWrap.style.cssText = [
      'display: flex',
      'gap: 1rem',
      'flex-wrap: wrap',
      'justify-content: center',
    ].join(';');

    // Retry button
    var retryBtn = document.createElement('button');
    retryBtn.textContent = 'Retry';
    retryBtn.setAttribute('aria-label', 'Retry loading the 3D scene');
    retryBtn.style.cssText = [
      'font-family: var(--font-serif)',
      'font-size: 0.9rem',
      'font-weight: 600',
      'letter-spacing: 0.04em',
      'background: transparent',
      'color: var(--accent-gold)',
      'border: 1px solid var(--accent-gold)',
      'border-radius: 6px',
      'padding: 0.6rem 1.75rem',
      'cursor: pointer',
      'transition: background 0.2s ease, color 0.2s ease',
    ].join(';');
    retryBtn.addEventListener('mouseenter', function() {
      retryBtn.style.background = 'var(--accent-gold)';
      retryBtn.style.color = 'var(--bg)';
    });
    retryBtn.addEventListener('mouseleave', function() {
      retryBtn.style.background = 'transparent';
      retryBtn.style.color = 'var(--accent-gold)';
    });
    retryBtn.addEventListener('click', function() {
      retryBootScene();
    });

    // Continue button
    var continueBtn = document.createElement('button');
    continueBtn.textContent = 'Continue without 3D';
    continueBtn.setAttribute('aria-label', 'Continue browsing without the 3D scene');
    continueBtn.style.cssText = [
      'font-family: var(--font-sans)',
      'font-size: 0.85rem',
      'font-weight: 400',
      'background: transparent',
      'color: var(--text-secondary)',
      'border: 1px solid rgba(255,255,255,0.15)',
      'border-radius: 6px',
      'padding: 0.6rem 1.75rem',
      'cursor: pointer',
      'transition: background 0.2s ease, color 0.2s ease',
    ].join(';');
    continueBtn.addEventListener('mouseenter', function() {
      continueBtn.style.background = 'rgba(255,255,255,0.07)';
      continueBtn.style.color = 'var(--text-primary)';
    });
    continueBtn.addEventListener('mouseleave', function() {
      continueBtn.style.background = 'transparent';
      continueBtn.style.color = 'var(--text-secondary)';
    });
    continueBtn.addEventListener('click', function() {
      continueWithoutScene();
    });

    btnWrap.appendChild(retryBtn);
    btnWrap.appendChild(continueBtn);

    // Assemble
    overlay.appendChild(icon);
    overlay.appendChild(title);
    overlay.appendChild(desc);
    if (detailWrap) overlay.appendChild(detailWrap);
    overlay.appendChild(btnWrap);

    // Inject keyframe animation for the pulsing icon
    if (!prefersReducedMotion() && !document.getElementById('scene-error-styles')) {
      var style = document.createElement('style');
      style.id = 'scene-error-styles';
      style.textContent = '@keyframes scene-error-pulse { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.15); } }';
      document.head.appendChild(style);
    }

    document.body.appendChild(overlay);

    // Fade in
    if (!prefersReducedMotion()) {
      requestAnimationFrame(function() {
        overlay.style.opacity = '1';
      });
    }
  }

  // ── Remove the error overlay ──
  function removeOverlay() {
    var overlay = document.getElementById('scene-error-overlay');
    if (overlay) {
      if (!prefersReducedMotion()) {
        overlay.style.opacity = '0';
        setTimeout(function() { overlay.remove(); }, 500);
      } else {
        overlay.remove();
      }
    }
  }

  // ── Retry bootScene ──
  function retryBootScene() {
    retryCount++;
    removeOverlay();

    var originalBootScene = window.bootScene;
    if (typeof originalBootScene !== 'function') {
      showError('bootScene function is not available.');
      return;
    }

    try {
      originalBootScene();
    } catch (err) {
      console.error('[SceneErrorBoundary] Retry', retryCount, 'failed:', err);
      if (retryCount >= MAX_RETRIES) {
        showFinalError(err);
      } else {
        showError(err.message || String(err));
      }
    }
  }

  // ── Continue without 3D ──
  function continueWithoutScene() {
    // Hide the loader
    var loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');

    // Remove error overlay
    removeOverlay();

    // Hide canvas container so it doesn't show a blank space
    var canvas = document.getElementById('canvas-container');
    if (canvas) canvas.style.display = 'none';

    // Ensure content sections are visible
    var sections = document.querySelectorAll('section, .section');
    sections.forEach(function(s) {
      s.style.visibility = 'visible';
      s.style.opacity = '1';
    });
  }

  // ── Show error (with retry/continue if under max retries) ──
  function showError(errorMsg) {
    overlayCreated = false;
    createOverlay(errorMsg);

    // Update retry button text to show remaining attempts
    var retryBtn = document.querySelector('#scene-error-overlay button[aria-label*="Retry"]');
    if (retryBtn) {
      var remaining = MAX_RETRIES - retryCount;
      retryBtn.textContent = 'Retry (' + remaining + ' left)';
    }
  }

  // ── Show final error after exhausting retries ──
  function showFinalError(err) {
    overlayCreated = false;
    createOverlay(err ? (err.message || String(err)) : 'Unknown error');

    // Replace retry button with a refresh button
    var retryBtn = document.querySelector('#scene-error-overlay button[aria-label*="Retry"]');
    if (retryBtn) {
      retryBtn.textContent = 'Refresh Page';
      retryBtn.onclick = function() { location.reload(); };
    }

    // Update description
    var desc = document.querySelector('#scene-error-overlay p');
    if (desc) {
      desc.textContent = 'The 3D scene failed to load after ' + MAX_RETRIES + ' attempts. You may refresh the page or continue browsing the content.';
    }

    // Log the final error
    console.error('[SceneErrorBoundary] All', MAX_RETRIES, 'retries exhausted. Scene unavailable.');
  }

  // ── Wrap bootScene BEFORE scene-bundle.js auto-boots ──
  // scene-bootstrap.js registers: window.bootScene = bootScene;
  // and auto-boots via: Promise.resolve().then(() => bootScene())
  // We need to wrap window.bootScene AFTER it's defined by the module
  // but BEFORE it auto-boots. Since this script runs before scene-bundle.js,
  // we intercept by wrapping later via a property getter/setter.

  var wrappedSceneReady = false;

  // Wrap __sceneFailed to show our overlay instead of the basic #scene-error div
  var originalSceneFailed = window.__sceneFailed;
  window.__sceneFailed = function(msg) {
    console.error('[SceneErrorBoundary] Scene failed:', msg);

    if (retryCount < MAX_RETRIES) {
      showError(msg);
    } else {
      showFinalError(msg);
    }

    // Also call the original __sceneFailed (if defined by BaseLayout loader script)
    // but prevent it from showing the basic error div since we have our overlay
    if (typeof originalSceneFailed === 'function' && !overlayCreated) {
      originalSceneFailed(msg);
    }
  };

  // Intercept bootScene assignment — scene-bundle.js sets window.bootScene = bootScene
  // We wrap it so our error boundary catches errors
  var _bootScene = null;
  Object.defineProperty(window, 'bootScene', {
    get: function() {
      return _bootScene;
    },
    set: function(fn) {
      _bootScene = fn;
      // Wrap the assigned function with our error boundary
      var wrapped = function() {
        try {
          fn();
        } catch (err) {
          console.error('[SceneErrorBoundary] bootScene threw:', err);
          if (retryCount < MAX_RETRIES) {
            showError(err.message || String(err));
          } else {
            showFinalError(err);
          }
        }
      };
      // Replace the original so auto-boot calls our wrapped version
      _bootScene = wrapped;
    },
    configurable: true
  });

})();
