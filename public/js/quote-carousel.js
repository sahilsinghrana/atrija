// public/js/quote-carousel.js
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
      for (var i = 0; i < cards.length; i++) {
        if (i === index) {
          cards[i].style.display = '';
          cards[i].classList.remove('hidden');
        } else {
          cards[i].classList.add('hidden');
          (function(card) {
            setTimeout(function() {
              if (card.classList.contains('hidden')) {
                card.style.display = 'none';
              }
            }, 800);
          })(cards[i]);
        }
      }
      for (var j = 0; j < dots.length; j++) {
        dots[j].classList.toggle('active', j === index);
      }
      current = index;
    }

    function next() {
      show((current + 1) % total);
    }

    function start() {
      if (timer) clearInterval(timer);
      timer = setInterval(function() {
        if (!isPaused) next();
      }, INTERVAL);
    }

    for (var d = 0; d < dots.length; d++) {
      (function(dot) {
        dot.addEventListener('click', function() {
          var idx = parseInt(dot.getAttribute('data-index'));
          show(idx);
          start();
        });
      })(dots[d]);
    }

    carousel.addEventListener('mouseenter', function() { isPaused = true; });
    carousel.addEventListener('mouseleave', function() { isPaused = false; });
    carousel.addEventListener('focusin', function() { isPaused = true; });
    carousel.addEventListener('focusout', function() { isPaused = false; });

    start();
  });
})();
