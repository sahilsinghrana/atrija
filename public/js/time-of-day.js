// Time-of-Day Atmosphere System for Van Gogh Website
// Dynamically shifts scene atmosphere based on visitor's local time

(function() {
  // Configuration
  const config = {
    phases: [
      { id: 'dawn', startHour: 5, endHour: 8, bgColor: '#1a1025', ambientColor: '#ffcc66', starOpacity: 0.3, moonOpacity: 0.6, waveTint: '#2a3a5c', flowerSaturation: 1.0 },
      { id: 'day', startHour: 8, endHour: 17, bgColor: '#0d0d1a', ambientColor: '#e8e8ff', starOpacity: 0.0, moonOpacity: 0.2, waveTint: '#1a3050', flowerSaturation: 0.8 },
      { id: 'dusk', startHour: 17, endHour: 20, bgColor: '#1a0f1a', ambientColor: '#ff8866', starOpacity: 0.6, moonOpacity: 0.9, waveTint: '#2a2040', flowerSaturation: 1.1 },
      { id: 'night', startHour: 20, endHour: 5, bgColor: '#08080f', ambientColor: '#6688cc', starOpacity: 1.0, moonOpacity: 1.0, waveTint: '#101830', flowerSaturation: 1.2 }
    ],
    updateIntervalMs: 60000,
    lerpSpeed: 0.02
  };

  // State
  let currentPhase = null;
  let targetValues = {};
  let currentValues = {};
  let updateInterval = null;

  // Initialize the system
  function init() {
    // Set initial values based on current time
    updateValues();
    
    // Apply initial CSS variables
    applyCSSVariables(currentValues);
    
    // Start periodic updates
    startLiveUpdates();
  }

  // Get current time phase and interpolation factor
  function getPhaseAndFactor() {
    const now = new Date();
    const hour = now.getHours() + now.getMinutes() / 60; // Include minutes for smooth interpolation
    
    // Find current phase
    let phase = config.phases[3]; // Default to night
    for (const p of config.phases) {
      if (p.id === 'night') {
        // Special handling for night phase (wraps around)
        if (hour >= p.startHour || hour < p.endHour) {
          phase = p;
          break;
        }
      } else {
        if (hour >= p.startHour && hour < p.endHour) {
          phase = p;
          break;
        }
      }
    }
    
    // Find next phase for interpolation
    let nextPhase = config.phases[0]; // Default to first phase
    let phaseIndex = config.phases.findIndex(p => p.id === phase.id);
    let nextIndex = (phaseIndex + 1) % config.phases.length;
    nextPhase = config.phases[nextIndex];
    
    // Calculate interpolation factor (0 = current phase, 1 = next phase)
    let factor = 0;
    if (phase.id !== 'night') {
      // Normal phases
      const phaseLength = phase.endHour - phase.startHour;
      const hourInPhase = hour - phase.startHour;
      factor = hourInPhase / phaseLength;
    } else {
      // Night phase wraps around
      if (hour >= phase.startHour) {
        // From startHour to 24:00
        const phaseLength = 24 - phase.startHour;
        const hourInPhase = hour - phase.startHour;
        factor = hourInPhase / phaseLength;
      } else {
        // From 0:00 to endHour
        const phaseLength = phase.endHour;
        const hourInPhase = hour;
        factor = hourInPhase / phaseLength;
      }
    }
    
    // Clamp factor between 0 and 1
    factor = Math.max(0, Math.min(1, factor));
    
    return { phase, nextPhase, factor };
  }

  // Update target values based on current time
  function updateValues() {
    const { phase, nextPhase, factor } = getPhaseAndFactor();
    
    // Interpolate between current and next phase
    targetValues = {
      bgColor: interpolateColor(phase.bgColor, nextPhase.bgColor, factor),
      ambientColor: interpolateColor(phase.ambientColor, nextPhase.ambientColor, factor),
      starOpacity: lerp(phase.starOpacity, nextPhase.starOpacity, factor),
      moonOpacity: lerp(phase.moonOpacity, nextPhase.moonOpacity, factor),
      waveTint: interpolateColor(phase.waveTint, nextPhase.waveTint, factor),
      flowerSaturation: lerp(phase.flowerSaturation, nextPhase.flowerSaturation, factor)
    };
    
    // Initialize current values if not set
    if (Object.keys(currentValues).length === 0) {
      currentValues = { ...targetValues };
    }
  }

  // Linear interpolation helper
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // Color interpolation helper (expects hex colors)
  function interpolateColor(color1, color2, factor) {
    // Parse hex colors
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);
    
    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);
    
    const r = Math.round(lerp(r1, r2, factor));
    const g = Math.round(lerp(g1, g2, factor));
    const b = Math.round(lerp(b1, b2, factor));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  // Apply CSS variables to :root
  function applyCSSVariables(values) {
    try {
      document.documentElement.style.setProperty('--tod-bg-shift', values.bgColor);
      document.documentElement.style.setProperty('--tod-ambient-color', values.ambientColor);
      document.documentElement.style.setProperty('--tod-star-opacity', values.starOpacity);
      document.documentElement.style.setProperty('--tod-moon-opacity', values.moonOpacity);
      document.documentElement.style.setProperty('--tod-wave-tint', values.waveTint);
      document.documentElement.style.setProperty('--tod-flower-saturation', values.flowerSaturation);
    } catch (e) {
      // Graceful degradation - if we can't set CSS properties, continue silently
      console.warn('Failed to set CSS variables:', e);
    }
  }

  // Smoothly animate current values toward target values
  function animateValues() {
    // Only animate if we have values to animate
    if (Object.keys(currentValues).length === 0) {
      return;
    }
    
    let needsUpdate = false;
    
    // Animate each value toward its target
    for (const key in targetValues) {
      if (key.includes('Color')) {
        // For colors, we need to interpolate each channel
        currentValues[key] = interpolateColor(currentValues[key], targetValues[key], config.lerpSpeed);
      } else {
        // For numbers, simple lerp
        currentValues[key] = lerp(currentValues[key], targetValues[key], config.lerpSpeed);
      }
      
      // Check if we've reached the target (within threshold)
      if (key.includes('Color')) {
        // Simple check for colors - if any channel is close enough
        needsUpdate = true; // Colors always need update for smooth animation
      } else {
        if (Math.abs(currentValues[key] - targetValues[key]) > 0.001) {
          needsUpdate = true;
        }
      }
    }
    
    // Apply the interpolated values
    applyCSSVariables(currentValues);
    
    // Continue animating if needed
    if (needsUpdate) {
      requestAnimationFrame(animateValues);
    }
  }

  // Start the live update interval
  function startLiveUpdates() {
    // Clear any existing interval
    if (updateInterval) {
      clearInterval(updateInterval);
    }
    
    // Update target values immediately, then start interval
    updateValues();
    // Start animation loop
    requestAnimationFrame(animateValues);
    
    // Set interval to update targets every minute
    updateInterval = setInterval(() => {
      updateValues();
      // Reset current values to force re-animation toward new targets
      // Actually, we'll let the animation continue naturally
    }, config.updateIntervalMs);
  }

  // Stop live updates (for cleanup)
  function stopLiveUpdates() {
    if (updateInterval) {
      clearInterval(updateInterval);
      updateInterval = null;
    }
    // Cancel animation frame
    // Note: We don't have a direct reference to cancel, but it will stop when not re-requested
  }

  // Public API
  window.TimeOfDay = {
    init,
    stopLiveUpdates,
    // For testing
    _getPhaseAndFactor: getPhaseAndFactor,
    _interpolateColor: interpolateColor,
    _lerp: lerp,
    _config: config
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();