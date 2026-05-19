/**
 * Theme Color Scheme Switcher (idea-029)
 * 
 * Lets visitors manually switch between the 5 impressionist color schemes.
 * Persists selection in localStorage. Falls back to daily default on first visit.
 * 
 * Color schemes: starry-night, sunflower, midnight-wave, lily-garden, moonlit-silver
 */
(function() {
  'use strict';

  // ── Color Schemes Data ──────────────────────────────────────────────
  var SCHEMES = [
    {
      id: 'starry-night',
      name: 'Starry Night',
      emoji: '🌙',
      primary: '#1a237e',
      secondary: '#ffd54f',
      accent: '#4fc3f7',
      background: '#0a0a1a',
      text: '#e8e8f0'
    },
    {
      id: 'sunflower',
      name: 'Sunflower',
      emoji: '🌻',
      primary: '#f5c800',
      secondary: '#ff6f00',
      accent: '#2e7d32',
      background: '#1a1200',
      text: '#fff8e1'
    },
    {
      id: 'midnight-wave',
      name: 'Midnight Wave',
      emoji: '🌊',
      primary: '#0d47a1',
      secondary: '#00bcd4',
      accent: '#7c4dff',
      background: '#000a12',
      text: '#b3e5fc'
    },
    {
      id: 'lily-garden',
      name: 'Lily Garden',
      emoji: '🌺',
      primary: '#c62828',
      secondary: '#ff80ab',
      accent: '#00c853',
      background: '#1a0a0a',
      text: '#fce4ec'
    },
    {
      id: 'moonlit-silver',
      name: 'Moonlit Silver',
      emoji: '✨',
      primary: '#90a4ae',
      secondary: '#ffd740',
      accent: '#80deea',
      background: '#0d1117',
      text: '#eceff1'
    }
  ];

  var STORAGE_KEY = 'atrija-theme';
  var isOpen = false;
  var currentScheme = null;

  // ── Apply a color scheme ───────────────────────────────────────────
  function applyScheme(scheme) {
    var r = document.documentElement.style;
    r.setProperty('--color-primary', scheme.primary);
    r.setProperty('--color-secondary', scheme.secondary);
    r.setProperty('--color-accent', scheme.accent);
    r.setProperty('--color-bg', scheme.background);
    r.setProperty('--color-text', scheme.text);
    currentScheme = scheme.id;

    // Update body background to match
    document.body.style.background = scheme.background;

    // Update active state on pills
    var pills = document.querySelectorAll('.theme-switcher-pill');
    pills.forEach(function(pill) {
      var isActive = pill.dataset.scheme === scheme.id;
      pill.classList.toggle('active', isActive);
      pill.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  // ── Get default scheme (daily rotation) ─────────────────────────────
  function getDefaultScheme() {
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now.getTime() - start.getTime();
    var dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return SCHEMES[dayOfYear % SCHEMES.length];
  }

  // ── Initialize: load saved or default ───────────────────────────────
  function initScheme() {
    var saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      // localStorage unavailable
    }

    var scheme;
    if (saved) {
      scheme = SCHEMES.find(function(s) { return s.id === saved; });
    }
    if (!scheme) {
      scheme = getDefaultScheme();
    }
    applyScheme(scheme);
  }

  // ── Build the UI ────────────────────────────────────────────────────
  function buildUI() {
    // Toggle button
    var toggle = document.createElement('button');
    toggle.id = 'theme-switcher-toggle';
    toggle.className = 'theme-switcher-toggle';
    toggle.setAttribute('aria-label', 'Switch color theme');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-haspopup', 'true');
    toggle.innerHTML = '<span class="theme-switcher-icon">🎨</span>';
    toggle.addEventListener('click', function(e) {
      e.stopPropagation();
      togglePanel();
    });

    // Panel
    var panel = document.createElement('div');
    panel.id = 'theme-switcher-panel';
    panel.className = 'theme-switcher-panel';
    panel.setAttribute('role', 'listbox');
    panel.setAttribute('aria-label', 'Color themes');
    panel.setAttribute('aria-hidden', 'true');

    // Header
    var header = document.createElement('div');
    header.className = 'theme-switcher-header';
    header.innerHTML = '<span class="theme-switcher-title">Color Theme</span>';
    var closeBtn = document.createElement('button');
    closeBtn.className = 'theme-switcher-close';
    closeBtn.setAttribute('aria-label', 'Close theme picker');
    closeBtn.innerHTML = '✕';
    closeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      closePanel();
    });
    header.appendChild(closeBtn);
    panel.appendChild(header);

    // Scheme pills
    var list = document.createElement('div');
    list.className = 'theme-switcher-list';
    SCHEMES.forEach(function(scheme) {
      var pill = document.createElement('button');
      pill.className = 'theme-switcher-pill';
      pill.dataset.scheme = scheme.id;
      pill.setAttribute('role', 'option');
      pill.setAttribute('aria-pressed', 'false');
      pill.setAttribute('aria-label', scheme.name + ' theme');
      pill.innerHTML = '<span class="theme-switcher-pill-color" style="background:' + scheme.primary + '"></span><span class="theme-switcher-pill-label">' + scheme.emoji + ' ' + scheme.name + '</span>';
      pill.addEventListener('click', function(e) {
        e.stopPropagation();
        applyScheme(scheme);
        try {
          localStorage.setItem(STORAGE_KEY, scheme.id);
        } catch (e) {}
        closePanel();
      });
      list.appendChild(pill);
    });
    panel.appendChild(list);

    // Append to DOM
    var container = document.getElementById('canvas-container');
    if (container && container.parentNode) {
      container.parentNode.insertBefore(toggle, container);
      container.parentNode.insertBefore(panel, container);
    } else {
      document.body.appendChild(toggle);
      document.body.appendChild(panel);
    }

    // Close on outside click
    document.addEventListener('click', function(e) {
      if (isOpen && !panel.contains(e.target) && e.target !== toggle && !toggle.contains(e.target)) {
        closePanel();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isOpen) {
        closePanel();
        toggle.focus();
      }
    });
  }

  function togglePanel() {
    if (isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  }

  function openPanel() {
    var panel = document.getElementById('theme-switcher-panel');
    var toggle = document.getElementById('theme-switcher-toggle');
    if (!panel || !toggle) return;
    isOpen = true;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
  }

  function closePanel() {
    var panel = document.getElementById('theme-switcher-panel');
    var toggle = document.getElementById('theme-switcher-toggle');
    if (!panel || !toggle) return;
    isOpen = false;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
  }

  // ── Inject CSS ──────────────────────────────────────────────────────
  function injectStyles() {
    var css = [
      /* Toggle button — fixed position, bottom-left to avoid flute button */
      '.theme-switcher-toggle {',
      '  position: fixed;',
      '  bottom: 2rem;',
      '  left: 2rem;',
      '  z-index: 9998;',
      '  width: 48px;',
      '  height: 48px;',
      '  border-radius: 50%;',
      '  border: 1px solid rgba(255,255,255,0.15);',
      '  background: rgba(0,0,0,0.4);',
      '  backdrop-filter: blur(8px);',
      '  -webkit-backdrop-filter: blur(8px);',
      '  cursor: pointer;',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  transition: all 0.3s ease;',
      '  -webkit-tap-highlight-color: transparent;',
      '}',
      '.theme-switcher-toggle:hover,',
      '.theme-switcher-toggle:focus-visible {',
      '  background: rgba(0,0,0,0.6);',
      '  border-color: rgba(255,255,255,0.3);',
      '  transform: scale(1.08);',
      '  outline: none;',
      '}',
      '.theme-switcher-icon {',
      '  font-size: 1.2rem;',
      '  line-height: 1;',
      '}',

      /* Panel */
      '.theme-switcher-panel {',
      '  position: fixed;',
      '  bottom: 5.5rem;',
      '  left: 2rem;',
      '  z-index: 9998;',
      '  min-width: 220px;',
      '  background: rgba(10,10,20,0.92);',
      '  backdrop-filter: blur(16px);',
      '  -webkit-backdrop-filter: blur(16px);',
      '  border: 1px solid rgba(255,255,255,0.1);',
      '  border-radius: 14px;',
      '  box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05);',
      '  opacity: 0;',
      '  transform: translateY(8px) scale(0.96);',
      '  pointer-events: none;',
      '  transition: opacity 0.25s ease, transform 0.25s ease;',
      '}',
      '.theme-switcher-panel.open {',
      '  opacity: 1;',
      '  transform: translateY(0) scale(1);',
      '  pointer-events: auto;',
      '}',

      /* Header */
      '.theme-switcher-header {',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  padding: 0.75rem 1rem;',
      '  border-bottom: 1px solid rgba(255,255,255,0.06);',
      '}',
      '.theme-switcher-title {',
      '  font-family: var(--font-sans);',
      '  font-size: 0.75rem;',
      '  font-weight: 600;',
      '  text-transform: uppercase;',
      '  letter-spacing: 0.06em;',
      '  color: var(--text-tertiary);',
      '}',
      '.theme-switcher-close {',
      '  width: 24px;',
      '  height: 24px;',
      '  border-radius: 50%;',
      '  border: none;',
      '  background: rgba(255,255,255,0.06);',
      '  color: var(--text-tertiary);',
      '  font-size: 0.7rem;',
      '  cursor: pointer;',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  transition: background 0.2s;',
      '}',
      '.theme-switcher-close:hover {',
      '  background: rgba(255,255,255,0.12);',
      '  color: var(--text-primary);',
      '}',

      /* Pill list */
      '.theme-switcher-list {',
      '  padding: 0.5rem;',
      '}',
      '.theme-switcher-pill {',
      '  display: flex;',
      '  align-items: center;',
      '  gap: 0.65rem;',
      '  width: 100%;',
      '  padding: 0.55rem 0.75rem;',
      '  border-radius: 8px;',
      '  border: none;',
      '  background: transparent;',
      '  cursor: pointer;',
      '  transition: background 0.2s;',
      '  -webkit-tap-highlight-color: transparent;',
      '  text-align: left;',
      '}',
      '.theme-switcher-pill:hover,',
      '.theme-switcher-pill:focus-visible {',
      '  background: rgba(255,255,255,0.06);',
      '  outline: none;',
      '}',
      '.theme-switcher-pill.active {',
      '  background: rgba(255,255,255,0.08);',
      '}',
      '.theme-switcher-pill-color {',
      '  width: 18px;',
      '  height: 18px;',
      '  border-radius: 50%;',
      '  flex-shrink: 0;',
      '  border: 2px solid rgba(255,255,255,0.15);',
      '  transition: border-color 0.2s;',
      '}',
      '.theme-switcher-pill.active .theme-switcher-pill-color {',
      '  border-color: rgba(255,255,255,0.4);',
      '}',
      '.theme-switcher-pill-label {',
      '  font-family: var(--font-sans);',
      '  font-size: 0.82rem;',
      '  color: var(--text-secondary);',
      '  line-height: 1.3;',
      '}',
      '.theme-switcher-pill.active .theme-switcher-pill-label {',
      '  color: var(--text-primary);',
      '  font-weight: 500;',
      '}',

      /* Mobile adjustments */
      '@media (max-width: 767px) {',
      '  .theme-switcher-toggle {',
      '    bottom: 1.2rem;',
      '    left: 1.2rem;',
      '    width: 42px;',
      '    height: 42px;',
      '  }',
      '  .theme-switcher-icon { font-size: 1rem; }',
      '  .theme-switcher-panel {',
      '    bottom: 4rem;',
      '    left: 1rem;',
      '    right: 1rem;',
      '    min-width: 0;',
      '  }',
      '}'
    ].join('\n');

    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ── Init ────────────────────────────────────────────────────────────
  // Apply scheme immediately (before DOM ready) to avoid flash
  initScheme();

  // Build UI when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      injectStyles();
      buildUI();
    });
  } else {
    injectStyles();
    buildUI();
  }
})();
