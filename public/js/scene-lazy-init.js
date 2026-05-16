(function() {
  var container = document.getElementById('canvas-container');
  if (!container) return;
  function loadScene() {
    var s = document.createElement('script');
    s.type = 'module';
    s.src = '/js/scene-init.js?v=' + (window.__BUILD_VERSION || Date.now());
    document.head.appendChild(s);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        loadScene();
        io.disconnect();
      }
    }, { rootMargin: '200px 0px' });
    io.observe(container);
  } else {
    loadScene();
  }
})();
