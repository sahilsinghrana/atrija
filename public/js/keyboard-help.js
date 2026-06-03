/**
 * Keyboard Shortcuts Help Overlay (idea-059)
 *
 * Press '?' anywhere on the site to open a modal overlay listing all
 * available keyboard shortcuts. The modal is styled in the impressionist
 * dark theme with gold accent borders. Includes a brief 'Keyboard
 * Navigation' section explaining the site's keyboard-first design.
 *
 * Implemented as a standalone module with a focus-trap inside the modal
 * for accessibility. Zero scene-init.js changes.
 *
 * Fills a clear UX gap: the site has multiple keyboard-driven features
 * but zero discoverability for them.
 */
(function () {
  'use strict';

  // ── Configuration ──────────────────────────────────────────────
  var MODAL_VISIBLE = false;
  var modalEl = null;
  var previouslyFocused = null;
  var focusableSelectors = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  // ── Shortcut Data ───────────────────────────────────────────────
  var SHORTCUT_GROUPS = [
    {
      label: 'Navigation',
      shortcuts: [
        { keys: ['Tab'], description: 'Move to next interactive element' },
        { keys: ['Shift', 'Tab'], description: 'Move to previous interactive element' },
        { keys: ['Enter'], description: 'Activate focused button or link' },
        { keys: ['Space'], description: 'Activate focused button or link' },
      ],
    },
    {
      label: 'Content & Search',
      shortcuts: [
        { keys: ['/'], description: 'Open content search overlay' },
        { keys: ['Escape'], description: 'Close any open overlay or modal' },
      ],
    },
    {
      label: 'This Help',
      shortcuts: [
        { keys: ['?'], description: 'Open this keyboard shortcuts guide' },
        { keys: ['Escape'], description: 'Close this guide' },
      ],
    },
  ];

  // ── Focus Trap ──────────────────────────────────────────────────
  function getFocusableElements() {
    if (!modalEl) return [];
    var els = modalEl.querySelectorAll(focusableSelectors);
    var result = [];
    for (var i = 0; i < els.length; i++) {
      var style = window.getComputedStyle(els[i]);
      if (style.display !== 'none' && style.visibility !== 'hidden') {
        result.push(els[i]);
      }
    }
    return result;
  }

  function trapFocus(e) {
    if (!MODAL_VISIBLE || e.key !== 'Tab') return;

    var focusable = getFocusableElements();
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }

    var firstFocusable = focusable[0];
    var lastFocusable = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  // ── Inject CSS ──────────────────────────────────────────────────
  function injectStyles() {
    var css = [
      /* Overlay backdrop */
      '.kb-help-overlay {',
      '  position: fixed;',
      '  inset: 0;',
      '  z-index: 100000;',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  background: rgba(0, 0, 0, 0.65);',
      '  backdrop-filter: blur(6px);',
      '  -webkit-backdrop-filter: blur(6px);',
      '  opacity: 0;',
      '  pointer-events: none;',
      '  transition: opacity 0.25s ease;',
      '}',
      '.kb-help-overlay.visible {',
      '  opacity: 1;',
      '  pointer-events: auto;',
      '}',

      /* Modal container */
      '.kb-help-modal {',
      '  position: relative;',
      '  width: 90vw;',
      '  max-width: 540px;',
      '  max-height: 80vh;',
      '  overflow-y: auto;',
      '  background: rgba(12, 12, 28, 0.96);',
      '  backdrop-filter: blur(20px);',
      '  -webkit-backdrop-filter: blur(20px);',
      '  border: 1px solid rgba(255, 213, 79, 0.25);',
      '  border-radius: 18px;',
      '  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.04), 0 0 40px rgba(255, 213, 79, 0.06);',
      '  transform: translateY(12px) scale(0.97);',
      '  transition: transform 0.25s ease;',
      '}',
      '.kb-help-overlay.visible .kb-help-modal {',
      '  transform: translateY(0) scale(1);',
      '}',

      /* Header */
      '.kb-help-header {',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  padding: 1.25rem 1.5rem 1rem;',
      '  border-bottom: 1px solid rgba(255, 255, 255, 0.06);',
      '}',
      '.kb-help-title {',
      '  font-family: var(--font-serif);',
      '  font-size: 1.35rem;',
      '  font-weight: 600;',
      '  color: var(--text-primary);',
      '  letter-spacing: 0.01em;',
      '}',
      '.kb-help-title-accent {',
      '  color: var(--accent-gold);',
      '  font-style: italic;',
      '}',
      '.kb-help-close {',
      '  width: 36px;',
      '  height: 36px;',
      '  border-radius: 50%;',
      '  border: 1px solid rgba(255, 255, 255, 0.1);',
      '  background: rgba(255, 255, 255, 0.04);',
      '  color: var(--text-secondary);',
      '  font-size: 1.1rem;',
      '  line-height: 1;',
      '  cursor: pointer;',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  transition: background 0.2s, color 0.2s, border-color 0.2s;',
      '  -webkit-tap-highlight-color: transparent;',
      '}',
      '.kb-help-close:hover,',
      '.kb-help-close:focus-visible {',
      '  background: rgba(255, 255, 255, 0.1);',
      '  color: var(--text-primary);',
      '  border-color: rgba(255, 213, 79, 0.3);',
      '  outline: none;',
      '}',

      /* Body */
      '.kb-help-body {',
      '  padding: 0.75rem 1.5rem 1.5rem;',
      '}',

      /* Group */
      '.kb-help-group {',
      '  margin-top: 1.25rem;',
      '}',
      '.kb-help-group:first-child {',
      '  margin-top: 0.5rem;',
      '}',
      '.kb-help-group-title {',
      '  font-family: var(--font-sans);',
      '  font-size: 0.72rem;',
      '  font-weight: 600;',
      '  text-transform: uppercase;',
      '  letter-spacing: 0.08em;',
      '  color: var(--accent-gold);',
      '  margin-bottom: 0.6rem;',
      '  padding-bottom: 0.35rem;',
      '  border-bottom: 1px solid rgba(255, 213, 79, 0.1);',
      '}',

      /* Shortcut row */
      '.kb-help-row {',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  padding: 0.5rem 0;',
      '  gap: 1rem;',
      '}',
      '.kb-help-row + .kb-help-row {',
      '  border-top: 1px solid rgba(255, 255, 255, 0.03);',
      '}',
      '.kb-help-desc {',
      '  font-family: var(--font-sans);',
      '  font-size: 0.85rem;',
      '  color: var(--text-secondary);',
      '  line-height: 1.4;',
      '  flex: 1;',
      '}',

      /* Key badges */
      '.kb-help-keys {',
      '  display: flex;',
      '  align-items: center;',
      '  gap: 0.3rem;',
      '  flex-shrink: 0;',
      '}',
      '.kb-help-key {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  min-width: 28px;',
      '  height: 28px;',
      '  padding: 0 0.45rem;',
      '  border-radius: 6px;',
      '  border: 1px solid rgba(255, 255, 255, 0.12);',
      '  border-bottom-color: rgba(255, 255, 255, 0.18);',
      '  background: rgba(255, 255, 255, 0.06);',
      '  color: var(--text-primary);',
      '  font-family: var(--font-sans);',
      '  font-size: 0.75rem;',
      '  font-weight: 500;',
      '  letter-spacing: 0.02em;',
      '  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);',
      '}',
      '.kb-help-key-sep {',
      '  color: var(--text-tertiary);',
      '  font-family: var(--font-sans);',
      '  font-size: 0.7rem;',
      '  margin: 0 0.1rem;',
      '}',

      /* Footer hint */
      '.kb-help-footer {',
      '  margin-top: 1.5rem;',
      '  padding-top: 1rem;',
      '  border-top: 1px solid rgba(255, 255, 255, 0.05);',
      '  text-align: center;',
      '}',
      '.kb-help-footer-text {',
      '  font-family: var(--font-sans);',
      '  font-size: 0.75rem;',
      '  color: var(--text-tertiary);',
      '  line-height: 1.5;',
      '}',
      '.kb-help-footer kbd {',
      '  display: inline-block;',
      '  min-width: 22px;',
      '  height: 22px;',
      '  padding: 0 0.35rem;',
      '  border-radius: 4px;',
      '  border: 1px solid rgba(255, 255, 255, 0.1);',
      '  background: rgba(255, 255, 255, 0.05);',
      '  color: var(--text-secondary);',
      '  font-family: var(--font-sans);',
      '  font-size: 0.7rem;',
      '  font-weight: 500;',
      '  vertical-align: middle;',
      '  line-height: 20px;',
      '  text-align: center;',
      '}',

      /* Mobile adjustments */
      '@media (max-width: 767px) {',
      '  .kb-help-modal {',
      '    width: 94vw;',
      '    max-height: 85vh;',
      '    border-radius: 14px;',
      '  }',
      '  .kb-help-header {',
      '    padding: 1rem 1.1rem 0.8rem;',
      '  }',
      '  .kb-help-title {',
      '    font-size: 1.15rem;',
      '  }',
      '  .kb-help-body {',
      '    padding: 0.5rem 1.1rem 1.2rem;',
      '  }',
      '  .kb-help-row {',
      '    flex-direction: column;',
      '    align-items: flex-start;',
      '    gap: 0.3rem;',
      '  }',
      '  .kb-help-keys {',
      '    align-self: flex-end;',
      '  }',
      '}',

      /* Reduced motion */
      '@media (prefers-reduced-motion: reduce) {',
      '  .kb-help-overlay,',
      '  .kb-help-modal {',
      '    transition: none !important;',
      '  }',
      '}',
      'html[data-reduced-motion="true"] .kb-help-overlay,',
      'html[data-reduced-motion="true"] .kb-help-modal {',
      '  transition: none !important;',
      '}',
    ].join('\n');

    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ── Build Modal DOM ─────────────────────────────────────────────
  function buildKeyBadge(keys) {
    var html = '';
    for (var i = 0; i < keys.length; i++) {
      if (i > 0) {
        html += '<span class="kb-help-key-sep">+</span>';
      }
      html += '<kbd class="kb-help-key">' + escapeHtml(keys[i]) + '</kbd>';
    }
    return html;
  }

  function buildModal() {
    var overlay = document.createElement('div');
    overlay.className = 'kb-help-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Keyboard Shortcuts');
    overlay.id = 'kb-help-overlay';

    var modal = document.createElement('div');
    modal.className = 'kb-help-modal';

    // Header
    var header = document.createElement('div');
    header.className = 'kb-help-header';

    var title = document.createElement('span');
    title.className = 'kb-help-title';
    title.innerHTML = 'Keyboard <span class="kb-help-title-accent">Shortcuts</span>';

    var closeBtn = document.createElement('button');
    closeBtn.className = 'kb-help-close';
    closeBtn.setAttribute('aria-label', 'Close keyboard shortcuts');
    closeBtn.innerHTML = '✕';
    closeBtn.addEventListener('click', hideModal);

    header.appendChild(title);
    header.appendChild(closeBtn);

    // Body
    var body = document.createElement('div');
    body.className = 'kb-help-body';

    // Shortcut groups
    for (var g = 0; g < SHORTCUT_GROUPS.length; g++) {
      var group = SHORTCUT_GROUPS[g];

      var groupEl = document.createElement('div');
      groupEl.className = 'kb-help-group';

      var groupTitle = document.createElement('div');
      groupTitle.className = 'kb-help-group-title';
      groupTitle.textContent = group.label;
      groupEl.appendChild(groupTitle);

      for (var s = 0; s < group.shortcuts.length; s++) {
        var shortcut = group.shortcuts[s];
        var row = document.createElement('div');
        row.className = 'kb-help-row';

        var desc = document.createElement('span');
        desc.className = 'kb-help-desc';
        desc.textContent = shortcut.description;

        var keys = document.createElement('span');
        keys.className = 'kb-help-keys';
        keys.innerHTML = buildKeyBadge(shortcut.keys);

        row.appendChild(desc);
        row.appendChild(keys);
        groupEl.appendChild(row);
      }

      body.appendChild(groupEl);
    }

    // Footer hint
    var footer = document.createElement('div');
    footer.className = 'kb-help-footer';
    var footerText = document.createElement('p');
    footerText.className = 'kb-help-footer-text';
    footerText.innerHTML = 'Press <kbd>?</kbd> anytime to open this guide · <kbd>Esc</kbd> to close';
    footer.appendChild(footerText);
    body.appendChild(footer);

    modal.appendChild(header);
    modal.appendChild(body);
    overlay.appendChild(modal);

    return overlay;
  }

  // ── Show / Hide ─────────────────────────────────────────────────
  function showModal() {
    if (MODAL_VISIBLE) return;

    if (!modalEl) {
      modalEl = buildModal();
      document.body.appendChild(modalEl);
    }

    // Store currently focused element to restore on close
    previouslyFocused = document.activeElement;

    MODAL_VISIBLE = true;
    modalEl.classList.add('visible');
    document.addEventListener('keydown', trapFocus);

    // Focus the close button after a frame so the transition can start
    requestAnimationFrame(function () {
      var closeBtn = modalEl.querySelector('.kb-help-close');
      if (closeBtn) closeBtn.focus();
    });
  }

  function hideModal() {
    if (!MODAL_VISIBLE) return;

    MODAL_VISIBLE = false;
    modalEl.classList.remove('visible');
    document.removeEventListener('keydown', trapFocus);

    // Restore focus to the previously focused element
    if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
      previouslyFocused.focus();
    }
  }

  // ── Keyboard Handler ────────────────────────────────────────────
  function onKeyDown(e) {
    // '?' to open (unless already in an input)
    if (e.key === '?' && !MODAL_VISIBLE) {
      var tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) {
        return;
      }
      e.preventDefault();
      showModal();
      return;
    }

    // Escape to close
    if (e.key === 'Escape' && MODAL_VISIBLE) {
      e.preventDefault();
      hideModal();
      return;
    }
  }

  // ── Helpers ─────────────────────────────────────────────────────
  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  // ── Init ────────────────────────────────────────────────────────
  function init() {
    injectStyles();
    document.addEventListener('keydown', onKeyDown);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
