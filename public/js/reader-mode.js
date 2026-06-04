/**
 * Reader Mode — 3D Canvas Dimmer Toggle (idea-058)
 *
 * A floating eye-icon button (bottom-left, above the footer) that toggles
 * Reader Mode: the Three.js canvas fades to opacity 0.05 and pointer-events
 * none, revealing only the dark gradient background. All text content sections
 * get enhanced readability styling. Toggles back to full 3D on second click.
 *
 * State persists in sessionStorage so the preference survives within a session.
 * Integrates with the existing data-reduced-motion attribute — automatically
 * enters Reader Mode when reduced motion is detected.
 *
 * Pure CSS + minimal JS overlay module. No scene-init.js changes.
 *
 * Addresses both accessibility (users who are overwhelmed by motion) and
 * practical needs (battery saving on mobile).
 */
(function () {
  'use strict';

  // ── Configuration ──────────────────────────────────────────────
  var STORAGE_KEY = 'atrija-reader-mode';
  var READER_MODE_ACTIVE = false;
  var toggleBtn = null;

  // ── Helpers ─────────────────────────────────────────────────────
  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  // ── Persistence ─────────────────────────────────────────────────
  function loadState() {
    try {
      var stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored === 'true') return true;
      if (stored === 'false') return false;
    } catch (e) {
      // sessionStorage unavailable (private browsing, etc.)
    }
    return null; // no stored preference
  }

  function saveState(active) {
    try {
      sessionStorage.setItem(STORAGE_KEY, active ? 'true' : 'false');
    } catch (e) {
      // sessionStorage unavailable
    }
  }

  // ── Reduced Motion Integration ──────────────────────────────────
  function isReducedMotion() {
    return document.documentElement.getAttribute('data-reduced-motion') === 'true';
  }

  // ── Apply / Remove Reader Mode ──────────────────────────────────
  function applyReaderMode() {
    var canvas = document.getElementById('canvas-container');
    if (canvas) {
      canvas.style.opacity = '0.05';
      canvas.style.pointerEvents = 'none';
    }
    document.documentElement.setAttribute('data-reader-mode', 'true');
    READER_MODE_ACTIVE = true;
    saveState(true);

    // Update toggle button state
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-pressed', 'true');
      toggleBtn.setAttribute('aria-label', 'Exit reader mode — restore 3D scene');
      updateToggleIcon(true);
    }
  }

  function removeReaderMode() {
    var canvas = document.getElementById('canvas-container');
    if (canvas) {
      canvas.style.opacity = '';
      canvas.style.pointerEvents = '';
    }
    document.documentElement.removeAttribute('data-reader-mode');
    READER_MODE_ACTIVE = false;
    saveState(false);

    // Update toggle button state
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-pressed', 'false');
      toggleBtn.setAttribute('aria-label', 'Enter reader mode — dim 3D scene for reading');
      updateToggleIcon(false);
    }
  }

  function toggleReaderMode() {
    if (READER_MODE_ACTIVE) {
      removeReaderMode();
    } else {
      applyReaderMode();
    }
  }

  // ── Toggle Button Icon ──────────────────────────────────────────
  function updateToggleIcon(active) {
    if (!toggleBtn) return;
    // Eye icon: open when reader mode off, closed/slashed when on
    if (active) {
      // Slashed eye — reader mode is ON
      toggleBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:22px;height:22px;display:block"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
    } else {
      // Open eye — reader mode is OFF
      toggleBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:22px;height:22px;display:block"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
    }
  }

  // ── Inject CSS ──────────────────────────────────────────────────
  function injectStyles() {
    var css = [
      /* ── Reader Mode Toggle Button ── */
      '.reader-mode-toggle {',
      '  position: fixed;',
      '  bottom: 6rem;',
      '  left: 2rem;',
      '  z-index: 9998;',
      '  width: 48px;',
      '  height: 48px;',
      '  border-radius: 50%;',
      '  background: rgba(255, 213, 79, 0.08);',
      '  border: 1px solid rgba(255, 213, 79, 0.2);',
      '  color: var(--accent-gold);',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  cursor: pointer;',
      '  transition: background 0.3s ease, border-color 0.3s ease, transform 0.2s ease, opacity 0.3s ease;',
      '  -webkit-tap-highlight-color: transparent;',
      '  opacity: 0;',
      '  animation: readerModeFadeIn 0.6s ease 1.2s forwards;',
      '}',
      '.reader-mode-toggle:hover {',
      '  background: rgba(255, 213, 79, 0.15);',
      '  border-color: rgba(255, 213, 79, 0.4);',
      '  transform: scale(1.08);',
      '}',
      '.reader-mode-toggle:active {',
      '  transform: scale(0.95);',
      '}',
      '.reader-mode-toggle:focus-visible {',
      '  outline: 2px solid var(--accent-gold);',
      '  outline-offset: 3px;',
      '}',
      '.reader-mode-toggle[aria-pressed="true"] {',
      '  background: rgba(255, 213, 79, 0.18);',
      '  border-color: rgba(255, 213, 79, 0.45);',
      '  box-shadow: 0 0 12px rgba(255, 213, 79, 0.15);',
      '}',

      '@keyframes readerModeFadeIn {',
      '  from { opacity: 0; transform: translateX(-10px); }',
      '  to   { opacity: 1; transform: translateX(0); }',
      '}',

      /* ── Canvas Container Transition ── */
      '#canvas-container {',
      '  transition: opacity 0.5s ease;',
      '}',

      /* ── Reader Mode: Enhanced Section Readability ── */
      'html[data-reader-mode="true"] .section {',
      '  background: rgba(8, 8, 15, 0.88);',
      '  backdrop-filter: blur(4px);',
      '  -webkit-backdrop-filter: blur(4px);',
      '}',
      'html[data-reader-mode="true"] .section > .section-inner > p {',
      '  font-size: calc(var(--text-base) * 1.08);',
      '  line-height: 1.9;',
      '  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);',
      '}',
      'html[data-reader-mode="true"] .fact-card p {',
      '  font-size: calc(var(--text-base) * 1.05);',
      '  line-height: 1.85;',
      '  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);',
      '}',
      'html[data-reader-mode="true"] .quote-block p {',
      '  font-size: calc(var(--text-lg) * 1.06);',
      '  line-height: 1.65;',
      '  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);',
      '}',
      'html[data-reader-mode="true"] .image-card .card-content p {',
      '  font-size: calc(var(--text-md) * 1.06);',
      '  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);',
      '}',
      'html[data-reader-mode="true"] .today-fact p {',
      '  font-size: calc(var(--text-md) * 1.06);',
      '  line-height: 1.85;',
      '  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);',
      '}',

      /* ── Reader Mode: Subtle section separator enhancement ── */
      'html[data-reader-mode="true"] .section {',
      '  border-top: 1px solid rgba(255, 213, 79, 0.06);',
      '}',

      /* ── Mobile adjustments ── */
      '@media (max-width: 767px) {',
      '  .reader-mode-toggle {',
      '    width: 42px;',
      '    height: 42px;',
      '    bottom: 5.5rem;',
      '    left: 1rem;',
      '  }',
      '  .reader-mode-toggle svg {',
      '    width: 18px;',
      '    height: 18px;',
      '  }',
      '  html[data-reader-mode="true"] .section > .section-inner > p {',
      '    font-size: calc(var(--text-sm) * 1.1);',
      '  }',
      '  html[data-reader-mode="true"] .fact-card p {',
      '    font-size: calc(var(--text-sm) * 1.08);',
      '  }',
      '  html[data-reader-mode="true"] .quote-block p {',
      '    font-size: calc(var(--text-base) * 1.1);',
      '  }',
      '}',

      /* ── Reduced motion: disable transitions ── */
      '@media (prefers-reduced-motion: reduce) {',
      '  #canvas-container {',
      '    transition: none !important;',
      '  }',
      '  .reader-mode-toggle {',
      '    animation: none;',
      '    opacity: 1;',
      '  }',
      '}',
      'html[data-reduced-motion="true"] #canvas-container {',
      '  transition: none !important;',
      '}',
      'html[data-reduced-motion="true"] .reader-mode-toggle {',
      '  animation: none;',
      '  opacity: 1;',
      '}',

      /* ── Print: hide toggle ── */
      '@media print {',
      '  .reader-mode-toggle {',
      '    display: none !important;',
      '  }',
      '}',
    ].join('\n');

    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ── Create Toggle Button ────────────────────────────────────────
  function createToggleButton() {
    var btn = document.createElement('button');
    btn.className = 'reader-mode-toggle';
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', 'Enter reader mode — dim 3D scene for reading');
    btn.id = 'reader-mode-toggle';

    // Set initial icon
    updateToggleIcon(false);

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleReaderMode();
    });

    document.body.appendChild(btn);
    return btn;
  }

  // ── Reduced Motion Listener ─────────────────────────────────────
  function watchReducedMotion() {
    var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    function apply() {
      if (mq.matches) {
        // Auto-enter reader mode when reduced motion is detected
        // (but only if user hasn't explicitly set a preference)
        var stored = loadState();
        if (stored === null && !READER_MODE_ACTIVE) {
          applyReaderMode();
        }
      }
    }
    apply();
    if (mq.addEventListener) {
      mq.addEventListener('change', apply);
    } else if (mq.addListener) {
      mq.addListener(apply);
    }
  }

  // ── Init ────────────────────────────────────────────────────────
  function init() {
    injectStyles();
    toggleBtn = createToggleButton();

    // Check for stored preference
    var stored = loadState();
    if (stored === true) {
      applyReaderMode();
    }

    // Watch for reduced motion changes
    watchReducedMotion();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
