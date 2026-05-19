// ── Impressionist Brushstroke Cursor Trail ──
(function() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var canvas = document.getElementById('brushstroke-canvas');
  if (!canvas) return;
  var isMobile = window.innerWidth < 768;
  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var particles = [];
  var maxParticles = isMobile ? 30 : 50;
  var maxSize = isMobile ? 18 : 25;
  var lastTime = 0;
  function resize() {
    dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });
  var colors = ['#FFD700', '#4169E1', '#228B22', '#FF6347', '#9370DB', '#87CEEB'];
  function getColors() {
    var attr = canvas.getAttribute('data-colors');
    if (attr) return attr.split(',');
    return colors;
  }
  function addVariation(hex) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    var v = 0.15;
    r = Math.min(255, Math.max(0, r + (Math.random() - 0.5) * 255 * v * 2));
    g = Math.min(255, Math.max(0, g + (Math.random() - 0.5) * 255 * v * 2));
    b = Math.min(255, Math.max(0, b + (Math.random() - 0.5) * 255 * v * 2));
    return 'rgb(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ')';
  }
  var prevX = -1, prevY = -1;
  function onMove(x, y) {
    if (prevX < 0) { prevX = x; prevY = y; return; }
    var dx = x - prevX, dy = y - prevY;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 8) return;
    var palette = getColors();
    var color = addVariation(palette[Math.floor(Math.random() * palette.length)]);
    var size = 8 + Math.min(dist * 0.3, maxSize - 8);
    var angle = Math.atan2(dy, dx) + Math.PI / 2;
    particles.push({ x: x, y: y, prevX: prevX, prevY: prevY, color: color, size: size, life: 1.0, angle: angle });
    if (particles.length > maxParticles) particles.shift();
    prevX = x; prevY = y;
  }
  window.addEventListener('mousemove', function(e) { onMove(e.clientX, e.clientY); }, { passive: true });
  window.addEventListener('touchmove', function(e) {
    if (e.touches && e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  var hidden = false;
  document.addEventListener('visibilitychange', function() { hidden = document.hidden; });
  function animate(time) {
    requestAnimationFrame(animate);
    if (hidden) return;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.life -= 0.015;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.globalAlpha = p.life * 0.6;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.prevX, p.prevY);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      ctx.globalAlpha = p.life * 0.2;
      ctx.lineWidth = p.size * 1.8;
      ctx.beginPath();
      ctx.moveTo(p.prevX, p.prevY);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  requestAnimationFrame(animate);
})();
