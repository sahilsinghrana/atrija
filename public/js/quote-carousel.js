// ── Philosophy Quote Carousel ──
(function() {
  var carousels = document.querySelectorAll('.quote-carousel');
  var INTERVAL = 8000;
  carousels.forEach(function(carousel) {
    var cards = carousel.querySelectorAll('.quote-card');
    var dots = carousel.querySelectorAll('.quote-dot');
    var current = 0;
    var total = cards.length;
    var timer = null;
    var isPaused = false;
    if (total <= 1) return;
    function show(index) {
      cards.forEach(function(card, i) {
        if (i === index) {
          card.style.display = '';
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
          setTimeout(function() {
            if (card.classList.contains('hidden')) card.style.display = 'none';
          }, 800);
        }
      });
      dots.forEach(function(dot, i) { dot.classList.toggle('active', i === index); });
      current = index;
    }
    function next() { show((current + 1) % total); }
    function start() {
      if (timer) clearInterval(timer);
      timer = setInterval(function() { if (!isPaused) next(); }, INTERVAL);
    }
    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        show(parseInt(dot.dataset.index));
        start();
      });
    });
    carousel.addEventListener('mouseenter', function() { isPaused = true; });
    carousel.addEventListener('mouseleave', function() { isPaused = false; });
    carousel.addEventListener('focusin', function() { isPaused = true; });
    carousel.addEventListener('focusout', function() { isPaused = false; });
    start();
  });
})();
