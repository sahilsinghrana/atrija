(function() {
  var container = document.getElementById('moonContainer');
  var shadow = document.getElementById('moonShadow');
  if (!container || !shadow) return;

  // Create canvas
  var canvas = document.createElement('canvas');
  canvas.id = 'moonCanvas';
  canvas.style.cssText = 'width:100%;height:100%;display:block;';
  container.insertBefore(canvas, shadow);

  // Moon phase calculation
  var lunarCycle = 29.53058867;
  var knownNewMoon = new Date(2000, 0, 6, 18, 14, 0);
  var daysSinceNew = (Date.now() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  var currentPhaseDays = ((daysSinceNew % lunarCycle) + lunarCycle) % lunarCycle;

  var demoSpeedDaysPerSec = lunarCycle / 60;
  var lastTime = null;
  var currentTranslate = 0;
  var targetTranslate = 0;

  function phaseToTranslate(phaseDays) {
    var pf = phaseDays / lunarCycle;
    var illum = (1 - Math.cos(pf * 2 * Math.PI)) / 2 * 100;
    return pf < 0.5 ? -(100 - illum) : (100 - illum);
  }

  currentTranslate = phaseToTranslate(currentPhaseDays);
  targetTranslate = currentTranslate;

  function drawMoon() {
    var rect = container.getBoundingClientRect();
    var size = Math.min(rect.width, rect.height);
    if (size <= 0) return;

    // Use 2x for retina
    var dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    var cx = size / 2;
    var cy = size / 2;
    var r = size * 0.42;

    // Clear
    ctx.clearRect(0, 0, size, size);

    // Draw moon glow
    var glowGrad = ctx.createRadialGradient(cx, cy, r * 0.8, cx, cy, r * 1.3);
    glowGrad.addColorStop(0, 'rgba(255,248,220,0.3)');
    glowGrad.addColorStop(0.5, 'rgba(255,248,220,0.1)');
    glowGrad.addColorStop(1, 'rgba(255,248,220,0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.3, 0, Math.PI * 2);
    ctx.fill();

    // Draw moon body
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    // Moon base color
    var moonGrad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
    moonGrad.addColorStop(0, '#fffef5');
    moonGrad.addColorStop(0.5, '#f5f0e0');
    moonGrad.addColorStop(1, '#e8e0c8');
    ctx.fillStyle = moonGrad;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    // Draw craters
    var craters = [
      { x: -0.25, y: -0.15, s: 0.18, c: 'rgba(200,190,170,0.4)' },
      { x: 0.15, y: 0.25, s: 0.14, c: 'rgba(190,180,160,0.35)' },
      { x: -0.1, y: 0.3, s: 0.1, c: 'rgba(210,200,180,0.3)' },
      { x: 0.3, y: -0.2, s: 0.12, c: 'rgba(200,190,170,0.35)' },
      { x: -0.35, y: 0.1, s: 0.08, c: 'rgba(195,185,165,0.3)' },
      { x: 0.05, y: -0.35, s: 0.09, c: 'rgba(205,195,175,0.25)' },
      { x: 0.2, y: 0.05, s: 0.11, c: 'rgba(190,180,160,0.3)' },
      { x: -0.15, y: -0.4, s: 0.07, c: 'rgba(200,190,170,0.25)' },
    ];

    craters.forEach(function(cr) {
      var craterX = cx + cr.x * r;
      var craterY = cy + cr.y * r;
      var craterR = cr.s * r;
      var grad = ctx.createRadialGradient(craterX, craterY, 0, craterX, craterY, craterR);
      grad.addColorStop(0, cr.c);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(craterX, craterY, craterR, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw phase shadow
    var phase = currentPhaseDays / lunarCycle;
    var illum = (1 - Math.cos(phase * 2 * Math.PI)) / 2;

    ctx.fillStyle = 'rgba(8,8,15,0.85)';
    ctx.beginPath();

    if (phase < 0.5) {
      // Waxing: shadow on right
      ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2, false);
      var shadowWidth = r * (1 - illum * 2);
      ctx.ellipse(cx + r * (1 - illum), cy, Math.abs(shadowWidth), r, 0, Math.PI / 2, -Math.PI / 2, false);
    } else {
      // Waning: shadow on left
      ctx.arc(cx, cy, r, Math.PI / 2, -Math.PI / 2, false);
      var shadowWidth = r * (illum * 2 - 1);
      ctx.ellipse(cx - r * (1 - illum), cy, Math.abs(shadowWidth), r, 0, -Math.PI / 2, Math.PI / 2, false);
    }

    ctx.fill();
    ctx.restore();

    // Moon edge highlight
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Initial draw
  drawMoon();

  // Resize handler
  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(drawMoon, 100);
  });

  // Phase animation
  function animate(ts) {
    if (lastTime === null) lastTime = ts;
    var dt = (ts - lastTime) / 1000;
    lastTime = ts;
    currentPhaseDays = (currentPhaseDays + demoSpeedDaysPerSec * dt) % lunarCycle;
    targetTranslate = phaseToTranslate(currentPhaseDays);
    currentTranslate += (targetTranslate - currentTranslate) * 0.04;
    shadow.style.transform = 'translateX(' + currentTranslate.toFixed(3) + '%)';
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
