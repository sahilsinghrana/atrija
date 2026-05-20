(function() {
  'use strict';

  // ── State ──
  let scale = 1;
  let panX = 0;
  let panY = 0;
  let isPanning = false;
  let panStartX = 0;
  let panStartY = 0;
  let panStartPanX = 0;
  let panStartPanY = 0;
  const MIN_SCALE = 1;
  const MAX_SCALE = 3;
  const SCALE_STEP = 0.25;

  // ── DOM refs ──
  const viewport = document.getElementById('pe-viewport');
  const container = document.getElementById('pe-image-container');
  const zoomLevel = document.getElementById('pe-zoom-level');
  const zoomInBtn = document.getElementById('pe-zoom-in');
  const zoomOutBtn = document.getElementById('pe-zoom-out');
  const zoomResetBtn = document.getElementById('pe-zoom-reset');
  const panel = document.getElementById('pe-panel');
  const panelClose = document.getElementById('pe-panel-close');
  const panelTitle = document.getElementById('pe-panel-title');
  const panelDesc = document.getElementById('pe-panel-description');
  const panelTech = document.getElementById('pe-panel-technique');
  const panelQuote = document.getElementById('pe-panel-quote-text');
  const overlay = document.getElementById('pe-overlay');
  const hotspots = document.querySelectorAll('.pe-hotspot');

  if (!viewport || !container) return;

  // ── Transform helper ──
  function applyTransform() {
    container.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
    if (zoomLevel) {
      zoomLevel.textContent = Math.round(scale * 100) + '%';
    }
  }

  // ── Zoom ──
  function setZoom(newScale, centerX, centerY) {
    const oldScale = scale;
    scale = Math.round(Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale)) * 100) / 100;

    if (scale !== oldScale && centerX !== undefined && centerY !== undefined) {
      // Zoom toward cursor position
      const rect = viewport.getBoundingClientRect();
      const cx = centerX - rect.left - rect.width / 2;
      const cy = centerY - rect.top - rect.height / 2;
      panX = cx - (cx - panX) * (scale / oldScale);
      panY = cy - (cy - panY) * (scale / oldScale);
    }

    // Constrain pan
    constrainPan();
    applyTransform();

    // Enable/disable panning cursor
    if (scale > 1) {
      viewport.style.cursor = 'grab';
    } else {
      viewport.style.cursor = 'default';
      panX = 0;
      panY = 0;
      applyTransform();
    }
  }

  function constrainPan() {
    if (scale <= 1) {
      panX = 0;
      panY = 0;
      return;
    }
    const rect = viewport.getBoundingClientRect();
    const scaledW = rect.width * scale;
    const scaledH = rect.height * scale;
    const maxPanX = (scaledW - rect.width) / 2;
    const maxPanY = (scaledH - rect.height) / 2;
    panX = Math.max(-maxPanX, Math.min(maxPanX, panX));
    panY = Math.max(-maxPanY, Math.min(maxPanY, panY));
  }

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => setZoom(scale + SCALE_STEP));
  }
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => setZoom(scale - SCALE_STEP));
  }
  if (zoomResetBtn) {
    zoomResetBtn.addEventListener('click', () => {
      scale = 1;
      panX = 0;
      panY = 0;
      applyTransform();
      viewport.style.cursor = 'default';
    });
  }

  // ── Mouse wheel zoom (desktop) ──
  viewport.addEventListener('wheel', function(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP;
    setZoom(scale + delta, e.clientX, e.clientY);
  }, { passive: false });

  // ── Pan (mouse) ──
  viewport.addEventListener('mousedown', function(e) {
    if (scale <= 1) return;
    isPanning = true;
    panStartX = e.clientX;
    panStartY = e.clientY;
    panStartPanX = panX;
    panStartPanY = panY;
    viewport.style.cursor = 'grabbing';
    e.preventDefault();
  });

  document.addEventListener('mousemove', function(e) {
    if (!isPanning) return;
    const dx = e.clientX - panStartX;
    const dy = e.clientY - panStartY;
    panX = panStartPanX + dx;
    panY = panStartPanY + dy;
    constrainPan();
    applyTransform();
  });

  document.addEventListener('mouseup', function() {
    if (isPanning) {
      isPanning = false;
      viewport.style.cursor = scale > 1 ? 'grab' : 'default';
    }
  });

  // ── Touch: pinch-to-zoom + single-finger pan ──
  let touchStartDist = 0;
  let touchStartScale = 1;
  let touchMidX = 0;
  let touchMidY = 0;

  viewport.addEventListener('touchstart', function(e) {
    if (e.touches.length === 2) {
      // Pinch start
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartDist = Math.sqrt(dx * dx + dy * dy);
      touchStartScale = scale;
      touchMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      touchMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
    } else if (e.touches.length === 1 && scale > 1) {
      // Pan start
      isPanning = true;
      panStartX = e.touches[0].clientX;
      panStartY = e.touches[0].clientY;
      panStartPanX = panX;
      panStartPanY = panY;
    }
  }, { passive: false });

  viewport.addEventListener('touchmove', function(e) {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (touchStartDist > 0) {
        const newScale = touchStartScale * (dist / touchStartDist);
        setZoom(newScale, touchMidX, touchMidY);
      }
    } else if (e.touches.length === 1 && isPanning) {
      e.preventDefault();
      const dx = e.touches[0].clientX - panStartX;
      const dy = e.touches[0].clientY - panStartY;
      panX = panStartPanX + dx;
      panY = panStartPanY + dy;
      constrainPan();
      applyTransform();
    }
  }, { passive: false });

  viewport.addEventListener('touchend', function() {
    isPanning = false;
    touchStartDist = 0;
  });

  // ── Panel ──
  function openPanel(hotspot) {
    const label = hotspot.dataset.label || '';
    const description = hotspot.dataset.description || '';
    const technique = hotspot.dataset.technique || '';
    const quote = hotspot.dataset.quote || '';

    panelTitle.textContent = label;
    panelDesc.textContent = description;
    panelTech.textContent = technique;
    panelQuote.textContent = quote;

    panel.classList.add('pe-panel-open');
    panel.setAttribute('aria-hidden', 'false');
    if (overlay) {
      overlay.classList.add('pe-overlay-visible');
      overlay.setAttribute('aria-hidden', 'false');
    }
  }

  function closePanel() {
    panel.classList.remove('pe-panel-open');
    panel.setAttribute('aria-hidden', 'true');
    if (overlay) {
      overlay.classList.remove('pe-overlay-visible');
      overlay.setAttribute('aria-hidden', 'true');
    }
  }

  if (panelClose) {
    panelClose.addEventListener('click', closePanel);
  }
  if (overlay) {
    overlay.addEventListener('click', closePanel);
  }

  // Close on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closePanel();
    }
  });

  // Hotspot click
  hotspots.forEach(function(spot) {
    spot.addEventListener('click', function(e) {
      e.stopPropagation();
      openPanel(spot);
    });
  });

  // ── Progressive image loading ──
  const img = document.getElementById('pe-image');
  if (img) {
    // The browser handles srcset/sizes natively for responsive loading
    // We add a load handler to swap to high-res after initial render
    const largeSrc = img.getAttribute('srcset')?.split(',').pop()?.trim().split(' ')[0];
    if (largeSrc) {
      const highResImg = new Image();
      highResImg.onload = function() {
        img.src = largeSrc;
      };
      highResImg.src = largeSrc;
    }
  }

  // ── Initial transform ──
  applyTransform();
})();
