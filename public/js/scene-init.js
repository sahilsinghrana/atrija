    // Update time-based atmospheric effects
    var timePreset = getCurrentTimeOfDayPreset();
    
    // Read CSS variables set by time-of-day.js (with graceful fallback)
    var todAmbientColor = null;
    var todStarOpacity = null;
    var todMoonOpacity = null;
    var todWaveTint = null;
    var todFlowerSaturation = null;
    try {
      var rootStyles = getComputedStyle(document.documentElement);
      todAmbientColor = rootStyles.getPropertyValue('--tod-ambient-color');
      todStarOpacity = parseFloat(rootStyles.getPropertyValue('--tod-star-opacity'));
      todMoonOpacity = parseFloat(rootStyles.getPropertyValue('--tod-moon-opacity'));
      todWaveTint = rootStyles.getPropertyValue('--tod-wave-tint');
      todFlowerSaturation = parseFloat(rootStyles.getPropertyValue('--tod-flower-saturation'));
      // Validate values - if any are invalid, we'll fall back to timePreset below
      if (todStarOpacity === null || todStarOpacity === undefined || isNaN(todStarOpacity)) todStarOpacity = null;
      if (todMoonOpacity === null || todMoonOpacity === undefined || isNaN(todMoonOpacity)) todMoonOpacity = null;
      if (todFlowerSaturation === null || todFlowerSaturation === undefined || isNaN(todFlowerSaturation)) todFlowerSaturation = null;
      // Check if CSS variables are actually set (not empty or default)
      if (!todAmbientColor || todAmbientColor === "") todAmbientColor = null;
      if (!todWaveTint || todWaveTint === "") todWaveTint = null;
    } catch (e) {
      // Graceful degradation - if we can't read CSS properties, continue with timePreset only
      console.warn('Failed to read time-of-day CSS variables:', e);
    }
    
    // Apply time-of-day adjustments if CSS variables are available
    if (todAmbientColor || todStarOpacity !== null || todMoonOpacity !== null || todWaveTint || todFlowerSaturation !== null) {
      // Create a copy of timePreset to modify
      var adjustedPreset = JSON.parse(JSON.stringify(timePreset));
      
      // Apply ambient color from CSS variable (if valid)
      if (todAmbientColor) {
        try {
          adjustedPreset.ambientLight.color = new THREE.Color(todAmbientColor.trim());
        } catch (e) {
          console.warn('Invalid ambient color CSS variable:', todAmbientColor);
        }
      }
      
      // Apply star opacity from CSS variable (if valid)
      if (todStarOpacity !== null && !isNaN(todStarOpacity)) {
        // Scale the existing star opacity by the CSS variable value (0-1 range)
        // This allows the CSS variable to act as a multiplier
        if (adjustedPreset.starOpacity !== undefined) {
          adjustedPreset.starOpacity = Math.max(0, Math.min(1, adjustedPreset.starOpacity * todStarOpacity));
        }
      }
      
      // Apply moon opacity from CSS variable (if valid)
      if (todMoonOpacity !== null && !isNaN(todMoonOpacity)) {
        // Scale the existing moon opacity by the CSS variable value (0-1 range)
        if (adjustedPreset.moonOpacity !== undefined) {
          adjustedPreset.moonOpacity = Math.max(0, Math.min(1, adjustedPreset.moonOpacity * todMoonOpacity));
        }
      }
      
      // Apply wave tint from CSS variable (if valid)
      if (todWaveTint) {
        try {
          // Parse the color and apply as a tint/multiplier to wave colors
          var waveColor = new THREE.Color(todWaveTint.trim());
          // Apply as a multiplicative tint to the wave colors
          if (adjustedPreset.waveColor1) adjustedPreset.waveColor1.multiply(waveColor);
          if (adjustedPreset.waveColor2) adjustedPreset.waveColor2.multiply(waveColor);
          if (adjustedPreset.waveColor3) adjustedPreset.waveColor3.multiply(waveColor);
        } catch (e) {
          console.warn('Invalid wave tint CSS variable:', todWaveTint);
        }
      }
      
      // Apply flower saturation from CSS variable (if valid)
      if (todFlowerSaturation !== null && !isNaN(todFlowerSaturation)) {
        // This would be used in the flower material updates if we had access to them
        // For now, we'll store it in the preset for potential future use
        adjustedPreset.flowerSaturation = Math.max(0.5, Math.min(2.0, todFlowerSaturation));
        // Note: Actual flower saturation application would require accessing flower materials
        // which is more complex due to how they're stored
      }
      
      // Use the adjusted preset instead of the original timePreset
      timePreset = adjustedPreset;
    }