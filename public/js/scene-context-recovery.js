/**
 * WebGL Context Loss Recovery — Themed Overlay with Auto-Restore
 *
 * Listens for 'webglcontextlost' and 'webglcontextrestored' events on the
 * #canvas-container canvas. When context is lost, displays a subtle themed
 * overlay explaining that the scene is restoring. On context restore, re-initializes
 * the scene via the existing bootScene() function. After 3 failed restore
 * attempts, shows a graceful fallback message suggesting the user refresh.
 *
 * Loaded via <script> tag in index.astro — BEFORE scene-bundle.js.
 * Zero scene-init.js / scene-bootstrap.js changes. Only wraps the existing
 * canvas element with event listeners and the global bootScene() function.
 *
 * Uses existing CSS custom properties:
 *   --bg, --text-primary, --text-secondary, --accent-gold, --font-serif, --font-sans
 */
(function() {
  'use strict';

  // ── Configuration ──
  var MAX_RESTORE_ATTEMPTS = 3;
  var RESTORE_DELAY_MS = 1500; // Wait before attempting restore (browser needs time)
  var canvasId = 'canvas-container';

  // ── State ──
  var restoreAttempts = 0;
  var overlayCreated = false;
  var isRestoring = false;
  var contextLost = false;

  // ── Check if prefers-reduced-motion is active ──
  function prefersReducedMotion() {
    return window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // ── Get the canvas element ──
  function getCanvas() {
    return document.getElementById(canvasId);
  }

  // ── Create the context loss overlay ──
  function createOverlay() {
    if (overlayCreated) return;
    overlayCreated = true;

    var canvas = getCanvas();
    var parent = canvas ? canvas.parentElement : document.body;

    var overlay = document.createElement('div');
    overlay.id = 'webgl-context-loss-overlay';
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'polite');
    overlay.style.cssText = [
      'position: fixed',
      'inset: 0',
      'z-index: 100000',
      'background: var(--bg, #08080f)',
      'display: flex',
      'flex-direction: column',
      'align-items: center',
      'justify-content: center',
      'padding: 2rem',
      'font-family: var(--font-serif), Georgia, serif',
      'color: var(--text-primary, #e8e6e3)',
      prefersReducedMotion() ? '' : 'opacity: 0; transition: opacity 0.6s ease',
    ].filter(Boolean).join(';');

    // Pulsing restore indicator
    var indicator = document.createElement('div');
    indicator.style.cssText = [
      'width: 48px',
      'height: 48px',
      'border: 2px solid var(--accent-gold, #FFD54F)',
      'border-top-color: transparent',
      'border-radius: 50%',
      prefersReducedMotion() ? '' : 'animation: context-loss-spin 1s linear infinite',
      'margin-bottom: 1.5rem',
    ].join(';');

    // Title
    var title = document.createElement('h2');
    title.textContent = 'Restoring the scene…';
    title.style.cssText = [
      'font-family: var(--font-serif), Georgia, serif',
      'font-size: clamp(1.2rem, 3.5vw, 1.6rem)',
      'font-weight: 400',
      'color: var(--text-primary, #e8e6e3)',
      'margin: 0 0 0.75rem',
      'text-align: center',
      'letter-spacing: 0.02em',
    ].join(';');

    // Description
    var desc = document.createElement('p');
    desc.textContent = 'The 3D graphics context was interrupted. Re-initializing the impressionist night sky…';
    desc.style.cssText = [
      'font-family: var(--font-sans), Inter, sans-serif',
      'font-size: 0.875rem',
      'color: var(--text-secondary, #a09c96)',
      'max-width: 380px',
      'text-align: center',
      'line-height: 1.6',
      'margin: 0',
    ].join(';');

    overlay.appendChild(indicator);
    overlay.appendChild(title);
    overlay.appendChild(desc);

    // Inject keyframe animation for the spinner
    if (!prefersReducedMotion() && !document.getElementById('context-loss-styles')) {
      var style = document.createElement('style');
      style.id = 'context-loss-styles';
      style.textContent = '@keyframes context-loss-spin { to { transform: rotate(360deg); } }';
      document.head.appendChild(style);
    }

    // Insert overlay immediately after the canvas container (or fallback to body)
    if (parent && parent.parentNode) {
      parent.parentNode.insertBefore(overlay, parent.nextSibling);
    } else {
      document.body.appendChild(overlay);
    }

    // Fade in
    if (!prefersReducedMotion()) {
      requestAnimationFrame(function() {
        overlay.style.opacity = '1';
      });
    }
  }

  // ── Remove the overlay ──
  function removeOverlay() {
    var overlay = document.getElementById('webgl-context-loss-overlay');
    if (overlay) {
      if (!prefersReducedMotion()) {
        overlay.style.opacity = '0';
        setTimeout(function() { overlay.remove(); }, 600);
      } else {
        overlay.remove();
      }
    }
  }

  // ── Show final fallback message after exhausting restore attempts ──
  function showFallbackMessage() {
    var overlay = document.getElementById('webgl-context-loss-overlay');
    if (!overlay) {
      createOverlay();
      overlay = document.getElementById('webgl-context-loss-overlay');
    }

    // Update overlay content
    var title = overlay.querySelector('h2');
    if (title) title.textContent = 'Scene unavailable';

    var desc = overlay.querySelector('p');
    if (desc) desc.textContent = 'The 3D scene could not be restored. The content below is still fully accessible. You may refresh the page to try again.';

    // Replace spinner with static icon
    var indicator = overlay.querySelector('div[style*="border-radius: 50%"]');
    if (indicator) {
      indicator.style.animation = 'none';
      indicator.style.borderTopColor = 'var(--accent-gold, #FFD54F)';
      indicator.style.width = '36px';
      indicator.style.height = '36px';
    }

    // Add a refresh button
    var btnWrap = document.createElement('div');
    btnWrap.style.cssText = [
      'display: flex',
      'gap: 1rem',
      'flex-wrap: wrap',
      'justify-content: center',
      'margin-top: 1.5rem',
    ].join(';');

    var refreshBtn = document.createElement('button');
    refreshBtn.textContent = 'Refresh Page';
    refreshBtn.setAttribute('aria-label', 'Refresh the page to try loading the 3D scene again');
    refreshBtn.style.cssText = [
      'font-family: var(--font-serif), Georgia, serif',
      'font-size: 0.9rem',
      'font-weight: 600',
      'letter-spacing: 0.04em',
      'background: transparent',
      'color: var(--accent-gold, #FFD54F)',
      'border: 1px solid var(--accent-gold, #FFD54F)',
      'border-radius: 6px',
      'padding: 0.6rem 1.75rem',
      'cursor: pointer',
      'transition: background 0.2s ease, color 0.2s ease',
    ].join(';');
    refreshBtn.addEventListener('mouseenter', function() {
      refreshBtn.style.background = 'var(--accent-gold, #FFD54F)';
      refreshBtn.style.color = 'var(--bg, #08080f)';
    });
    refreshBtn.addEventListener('mouseleave', function() {
      refreshBtn.style.background = 'transparent';
      refreshBtn.style.color = 'var(--accent-gold, #FFD54F)';
    });
    refreshBtn.addEventListener('click', function() {
      location.reload();
    });

    var continueBtn = document.createElement('button');
    continueBtn.textContent = 'Continue without 3D';
    continueBtn.setAttribute('aria-label', 'Continue browsing without the 3D scene');
    continueBtn.style.cssText = [
      'font-family: var(--font-sans), Inter, sans-serif',
      'font-size: 0.85rem',
      'font-weight: 400',
      'background: transparent',
      'color: var(--text-secondary, #a09c96)',
      'border: 1px solid rgba(255,255,255,0.15)',
      'border-radius: 6px',
      'padding: 0.6rem 1.75rem',
      'cursor: pointer',
      'transition: background 0.2s ease, color 0.2s ease',
    ].join(';');
    continueBtn.addEventListener('mouseenter', function() {
      continueBtn.style.background = 'rgba(255,255,255,0.07)';
      continueBtn.style.color = 'var(--text-primary, #e8e6e3)';
    });
    continueBtn.addEventListener('mouseleave', function() {
      continueBtn.style.background = 'transparent';
      continueBtn.style.color = 'var(--text-secondary, #a09c96)';
    });
    continueBtn.addEventListener('click', function() {
      hideCanvasContainer();
      removeOverlay();
    });

    btnWrap.appendChild(refreshBtn);
    btnWrap.appendChild(continueBtn);
    overlay.appendChild(btnWrap);

    console.warn('[ContextLossRecovery] All', MAX_RESTORE_ATTEMPTS, 'restore attempts exhausted.');
  }

  // ── Hide canvas container when user chooses to continue without 3D ──
  function hideCanvasContainer() {
    var canvas = getCanvas();
    if (canvas) canvas.style.display = 'none';
  }

  // ── Attempt to restore the scene ──
  function attemptRestore() {
    if (isRestoring) return;
    isRestoring = true;
    restoreAttempts++;

    console.log('[ContextLossRecovery] Restore attempt', restoreAttempts, 'of', MAX_RESTORE_ATTEMPTS);

    if (restoreAttempts > MAX_RESTORE_ATTEMPTS) {
      isRestoring = false;
      showFallbackMessage();
      return;
    }

    // Wait a moment for the browser to stabilize after context loss
    setTimeout(function() {
      var bootScene = window.bootScene;
      if (typeof bootScene !== 'function') {
        console.error('[ContextLossRecovery] bootScene function not available.');
        isRestoring = false;
        showFallbackMessage();
        return;
      }

      try {
        bootScene();
        // Success — context was restored
        contextLost = false;
        isRestoring = false;
        removeOverlay();
        console.log('[ContextLossRecovery] Scene restored successfully on attempt', restoreAttempts);
      } catch (err) {
        console.error('[ContextLossRecovery] Restore attempt', restoreAttempts, 'failed:', err);
        isRestoring = false;

        if (restoreAttempts >= MAX_RESTORE_ATTEMPTS) {
          showFallbackMessage();
        } else {
          // Try again after a delay
          attemptRestore();
        }
      }
    }, RESTORE_DELAY_MS);
  }

  // ── Handle WebGL context loss ──
  function onContextLost(event) {
    event.preventDefault(); // Prevent default browser behavior (blank canvas)
    contextLost = true;

    console.warn('[ContextLossRecovery] WebGL context lost.');

    // Show the overlay
    createOverlay();

    // Attempt restore
    attemptRestore();
  }

  // ── Handle WebGL context restored ──
  function onContextRestored(event) {
    console.log('[ContextLossRecovery] WebGL context restored event fired.');

    if (!contextLost) {
      // Context was restored without us losing it (rare edge case)
      return;
    }

    // The browser has restored the context — we need to re-initialize
    // Don't reset contextLost flag yet; attemptRestore will handle success/failure
    if (!isRestoring) {
      attemptRestore();
    }
  }

  // ── Initialize: attach event listeners to the canvas ──
  function init() {
    var canvas = getCanvas();
    if (!canvas) {
      // Canvas not found — might be a non-3D page, silently exit
      return;
    }

    canvas.addEventListener('webglcontextlost', onContextLost, false);
    canvas.addEventListener('webglcontextrestored', onContextRestored, false);

    console.log('[ContextLossRecovery] Initialized — listening for context loss events on #' + canvasId);
  }

  // ── Boot ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already loaded — initialize after a microtask so scene-bundle.js can register first
    Promise.resolve().then(init);
  }
})();
