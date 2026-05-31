(function() {
  // ═══════════════════════════════════════════════════════
  // Foreground Moon — Artistic Painted Moon on Canvas
  // Draws an impressionist-style moon with brushstroke texture,
  // warm glow, and animated phase shadow.
  // ═══════════════════════════════════════════════════════

  var canvas = document.getElementById('foregroundMoon');
  var shadow = document.getElementById('moonShadow');
  if (!canvas || !shadow) return;

  var ctx = canvas.getContext('2d');
  var W, H, cx, cy, radius;
  var seededRand = null;

  // ── Seeded random for stable texture ──
  function makeSeededRand(seed) {
    var s = seed;
    return function() {
      s = (s * 16807 + 7) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  // ── Resize canvas to match container ──
  function resize() {
    var container = canvas.parentElement;
    var size = container ? container.offsetWidth : 300;
    // Use 2x for retina sharpness
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    W = canvas.width;
    H = canvas.height;
    cx = W / 2;
    cy = H / 2;
    radius = Math.min(W, H) * 0.44;
    seededRand = makeSeededRand(42);
  }

  // ── Draw a single brushstroke dab ──
  function brushDab(x, y, r, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    // Slightly irregular circle for organic feel
    var segments = 8;
    for (var i = 0; i <= segments; i++) {
      var a = (i / segments) * Math.PI * 2;
      var rr = r * (0.85 + seededRand() * 0.3);
      var px = x + Math.cos(a) * rr;
      var py = y + Math.sin(a) * rr;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // ── Draw the moon surface with brushstroke texture ──
  function drawMoonSurface() {
    // Base moon circle — warm off-white
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Background fill — dark
    ctx.fillStyle = '#08080f';
    ctx.fillRect(0, 0, W, H);

    // Moon base color — warm golden-white gradient
    var baseGrad = ctx.createRadialGradient(cx - radius * 0.2, cy - radius * 0.2, radius * 0.1, cx, cy, radius);
    baseGrad.addColorStop(0, '#fff8e0');
    baseGrad.addColorStop(0.4, '#f5e6b8');
    baseGrad.addColorStop(0.7, '#e8d48a');
    baseGrad.addColorStop(1, '#c4a85a');
    ctx.fillStyle = baseGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // ── Brushstroke texture layer ──
    // Concentric-ish dabs radiating from center, with variation
    var dabCount = 180;
    for (var i = 0; i < dabCount; i++) {
      var angle = seededRand() * Math.PI * 2;
      var dist = seededRand() * radius * 0.95;
      var x = cx + Math.cos(angle) * dist;
      var y = cy + Math.sin(angle) * dist;

      // Dab size varies — larger near center, smaller at edges
      var distRatio = dist / radius;
      var dabR = radius * (0.04 + seededRand() * 0.06) * (1 - distRatio * 0.5);

      // Color variation — warm golds, creams, subtle ochres
      var colorRoll = seededRand();
      var color;
      if (colorRoll < 0.3) {
        color = '#fff5d0'; // warm white
      } else if (colorRoll < 0.55) {
        color = '#f0d878'; // golden
      } else if (colorRoll < 0.75) {
        color = '#e0c868'; // deeper gold
      } else if (colorRoll < 0.9) {
        color = '#c8a848'; // ochre
      } else {
        color = '#d4bc6a'; // sand
      }

      // Alpha fades at edges
      var alpha = (0.15 + seededRand() * 0.2) * (1 - distRatio * 0.7);
      brushDab(x, y, dabR, color, alpha);
    }

    // ── Crater-like dark patches ──
    var craters = [
      { ox: -0.25, oy: -0.15, r: 0.18 },
      { ox: 0.15, oy: 0.25, r: 0.14 },
      { ox: -0.1, oy: 0.3, r: 0.1 },
      { ox: 0.3, oy: -0.1, r: 0.12 },
      { ox: -0.35, oy: 0.1, r: 0.08 },
    ];
    for (var c = 0; c < craters.length; c++) {
      var crater = craters[c];
      var craterX = cx + crater.ox * radius;
      var craterY = cy + crater.oy * radius;
      var craterR = crater.r * radius;

      // Dark patch
      var craterGrad = ctx.createRadialGradient(craterX, craterY, 0, craterX, craterY, craterR);
      craterGrad.addColorStop(0, 'rgba(140,110,50,0.25)');
      craterGrad.addColorStop(0.6, 'rgba(120,95,40,0.15)');
      craterGrad.addColorStop(1, 'rgba(100,80,30,0)');
      ctx.fillStyle = craterGrad;
      ctx.beginPath();
      ctx.arc(craterX, craterY, craterR, 0, Math.PI * 2);
      ctx.fill();

      // Highlight rim on one side
      ctx.save();
      ctx.globalAlpha = 0.12;
      ctx.strokeStyle = '#fff0c0';
      ctx.lineWidth = craterR * 0.15;
      ctx.beginPath();
      ctx.arc(craterX - craterR * 0.2, craterY - craterR * 0.2, craterR * 0.7, Math.PI * 0.8, Math.PI * 1.8);
      ctx.stroke();
      ctx.restore();
    }

    // ── Impasto highlight strokes ──
    // Thick paint-like strokes near the terminator area
    var impastoCount = 12;
    for (var i = 0; i < impastoCount; i++) {
      var angle = seededRand() * Math.PI * 2;
      var dist = seededRand() * radius * 0.6;
      var x = cx + Math.cos(angle) * dist;
      var y = cy + Math.sin(angle) * dist;
      var strokeLen = radius * (0.05 + seededRand() * 0.08);
      var strokeW = radius * (0.01 + seededRand() * 0.015);

      ctx.save();
      ctx.globalAlpha = 0.08 + seededRand() * 0.08;
      ctx.strokeStyle = '#fff8d8';
      ctx.lineWidth = strokeW;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle + 0.3) * strokeLen, y + Math.sin(angle + 0.3) * strokeLen);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore(); // end clip
  }

  // ── Draw the halo glow around the moon ──
  function drawHalo() {
    ctx.save();
    // Outer soft glow
    var haloGrad = ctx.createRadialGradient(cx, cy, radius * 0.9, cx, cy, radius * 1.5);
    haloGrad.addColorStop(0, 'rgba(255,220,100,0.12)');
    haloGrad.addColorStop(0.4, 'rgba(255,200,80,0.06)');
    haloGrad.addColorStop(1, 'rgba(255,200,80,0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Inner rim glow
    var rimGrad = ctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius * 1.05);
    rimGrad.addColorStop(0, 'rgba(255,240,180,0)');
    rimGrad.addColorStop(0.5, 'rgba(255,230,150,0.08)');
    rimGrad.addColorStop(1, 'rgba(255,220,120,0)');
    ctx.fillStyle = rimGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ── Apply phase shadow ──
  // phase: 0 = new moon, 0.5 = full moon, 1 = new moon again
  function applyPhaseShadow(phase) {
    // phase 0 = new (all dark), 0.5 = full (all lit), 1 = new
    // We draw a shadow circle that moves across the moon
    var illum = (1 - Math.cos(phase * 2 * Math.PI)) / 2; // 0 to 1

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Shadow position: moves from right to left then back
    // At phase 0 (new): shadow covers everything
    // At phase 0.5 (full): shadow is gone
    // At phase 1 (new): shadow covers everything from other side
    var shadowWidth = radius * 2.2;
    var shadowX;

    if (phase <= 0.5) {
      // Waxing: shadow moves from right to left
      // phase 0 → shadow at right edge, phase 0.5 → shadow gone
      var t = phase / 0.5; // 0 to 1
      shadowX = cx + radius * 1.1 - t * (radius * 2.2);
    } else {
      // Waning: shadow moves from left to right
      var t2 = (phase - 0.5) / 0.5; // 0 to 1
      shadowX = cx - radius * 1.1 + t2 * (radius * 2.2);
    }

    // Draw shadow as a soft-edged dark circle
    var shadowGrad = ctx.createRadialGradient(
      shadowX, cy, 0,
      shadowX, cy, shadowWidth * 0.5
    );
    shadowGrad.addColorStop(0, 'rgba(8,8,15,0.95)');
    shadowGrad.addColorStop(0.6, 'rgba(8,8,15,0.7)');
    shadowGrad.addColorStop(0.85, 'rgba(8,8,15,0.2)');
    shadowGrad.addColorStop(1, 'rgba(8,8,15,0)');

    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.arc(shadowX, cy, shadowWidth * 0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // ── Full render ──
  function render(phase) {
    resize();
    ctx.clearRect(0, 0, W, H);
    drawHalo();
    drawMoonSurface();
    applyPhaseShadow(phase);
  }

  // ── Phase calculation ──
  var lunarCycle = 29.53058867;
  var knownNewMoon = new Date(2000, 0, 6, 18, 14, 0);

  function getCurrentPhase() {
    var daysSinceNew = (Date.now() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    return ((daysSinceNew % lunarCycle) + lunarCycle) % lunarCycle / lunarCycle;
  }

  function getPhaseName(phase) {
    if (phase < 0.0625) return 'New Moon';
    if (phase < 0.1875) return 'Waxing Crescent';
    if (phase < 0.3125) return 'First Quarter';
    if (phase < 0.4375) return 'Waxing Gibbous';
    if (phase < 0.5625) return 'Full Moon';
    if (phase < 0.6875) return 'Waning Gibbous';
    if (phase < 0.8125) return 'Last Quarter';
    if (phase < 0.9375) return 'Waning Crescent';
    return 'New Moon';
  }

  function getMoonEmoji(phase) {
    if (phase < 0.0625) return '🌑';
    if (phase < 0.1875) return '🌒';
    if (phase < 0.3125) return '🌓';
    if (phase < 0.4375) return '🌔';
    if (phase < 0.5625) return '🌕';
    if (phase < 0.6875) return '🌖';
    if (phase < 0.8125) return '🌗';
    if (phase < 0.9375) return '🌘';
    return '🌑';
  }

  // ── Animation loop ──
  // Demo speed: one full cycle per 60 seconds
  var demoSpeedDaysPerSec = lunarCycle / 60;
  var currentPhaseDays = ((Date.now() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24)) % lunarCycle;
  var lastTime = null;

  function animate(ts) {
    if (lastTime === null) lastTime = ts;
    var dt = (ts - lastTime) / 1000;
    lastTime = ts;

    currentPhaseDays = (currentPhaseDays + demoSpeedDaysPerSec * dt) % lunarCycle;
    var phase = currentPhaseDays / lunarCycle;

    render(phase);

    // Update label
    var illum = (1 - Math.cos(phase * 2 * Math.PI)) / 2;
    var label = document.getElementById('moon-phase-label');
    if (label) {
      label.innerHTML = getMoonEmoji(phase) + ' ' + getPhaseName(phase) + ' · ' + Math.round(illum * 100) + '% illuminated';
    }

    requestAnimationFrame(animate);
  }

  // ── Handle resize ──
  window.addEventListener('resize', function() {
    // Re-render on next frame
  });

  // ── Start ──
  requestAnimationFrame(animate);

})();
