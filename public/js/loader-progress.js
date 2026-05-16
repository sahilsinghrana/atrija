(function() {
  var bar = document.getElementById('loader-progress-bar');
  if (!bar) return;
  window.__updateLoaderProgress = function(pct) {
    if (bar) bar.style.width = pct + '%';
  };
  // Simulate progress while waiting
  var fakeProgress = 0;
  var fakeInterval = setInterval(function() {
    fakeProgress += Math.random() * 15;
    if (fakeProgress > 85) { fakeProgress = 85; clearInterval(fakeInterval); }
    if (bar) bar.style.width = fakeProgress + '%';
  }, 300);
  window.__sceneLoadingStarted = function() {
    clearInterval(fakeInterval);
  };
})();
