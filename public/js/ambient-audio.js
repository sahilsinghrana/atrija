// public/js/ambient-audio.js
// Procedural ambient music engine — pentatonic flute-like soundscape
// Uses Web Audio API: oscillators, filters, reverb convolver
var AmbientAudio = (function() {
  var ctx = null;
  var masterGain = null;
  var reverbGain = null;
  var dryGain = null;
  var oscillators = [];
  var isPlaying = false;
  var scrollDepth = 0; // 0.0 to 1.0
  var baseFrequencies = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]; // C4-C5 pentatonic

  // Detect mobile for performance tuning
  var isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
  var reverbDuration = isMobile ? 1.5 : 2.5;

  function createReverb(ctx) {
    var convolver = ctx.createConvolver();
    var rate = ctx.sampleRate;
    var length = rate * reverbDuration;
    var impulse = ctx.createBuffer(2, length, rate);
    for (var channel = 0; channel < 2; channel++) {
      var data = impulse.getChannelData(channel);
      for (var i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
      }
    }
    convolver.buffer = impulse;
    return convolver;
  }

  function createDrone(freq, detune) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    var filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.detune.value = detune || 0;

    filter.type = 'lowpass';
    filter.frequency.value = 800;
    filter.Q.value = 1;

    gain.gain.value = 0;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dryGain);
    gain.connect(reverbGain);

    osc.start();

    return { osc: osc, gain: gain, filter: filter, baseFreq: freq };
  }

  // Oscillator pool for melody notes — reuse instead of creating new nodes
  var melodyPool = [];
  var MAX_POOLED_OSCILLATORS = 20;

  function getPooledOscillator() {
    if (melodyPool.length > 0) {
      return melodyPool.pop();
    }
    return null;
  }

  function returnToPool(osc, gain, filter) {
    if (melodyPool.length < MAX_POOLED_OSCILLATORS) {
      try {
        osc.disconnect();
        gain.disconnect();
        filter.disconnect();
      } catch (e) {
        // Already disconnected
      }
      melodyPool.push({ osc: osc, gain: gain, filter: filter });
    }
  }

  function createMelodyNote(freq, startTime, duration) {
    var osc = getPooledOscillator();
    var gain, filter;

    if (osc) {
      osc = osc.osc;
      gain = osc.gain;
      filter = osc.filter;
      // Reset
      osc.frequency.value = freq;
      osc.type = 'triangle';
      filter.frequency.value = 1200 + scrollDepth * 800;
    } else {
      osc = ctx.createOscillator();
      gain = ctx.createGain();
      filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.value = freq;

      filter.type = 'lowpass';
      filter.frequency.value = 1200 + scrollDepth * 800;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dryGain);
      gain.connect(reverbGain);
    }

    var attack = 0.3;
    var release = 1.5;
    var vol = 0.08;

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(vol, startTime + attack);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.start(startTime);
    osc.stop(startTime + duration + release);

    // Schedule return to pool after note finishes
    var noteEndTime = (startTime + duration + release - ctx.currentTime) * 1000;
    if (noteEndTime < 0) noteEndTime = 0;
    setTimeout(function() {
      returnToPool(osc, gain, filter);
    }, noteEndTime + 100);
  }

  function scheduleMelody() {
    if (!isPlaying) return;

    var now = ctx.currentTime;
    var noteDuration = 2.5 + Math.random() * 3;
    var numNotes = 2 + Math.floor(Math.random() * 3);

    for (var i = 0; i < numNotes; i++) {
      var freqIndex = Math.floor(Math.random() * baseFrequencies.length);
      var freq = baseFrequencies[freqIndex];
      var startTime = now + i * (noteDuration * 0.6) + Math.random() * 0.5;
      createMelodyNote(freq, startTime, noteDuration);
    }

    // Schedule next melody burst
    var nextBurst = 4000 + Math.random() * 8000; // 4-12 seconds
    setTimeout(scheduleMelody, nextBurst);
  }

  return {
    init: function() {
      if (ctx) return;
      ctx = new (window.AudioContext || window.webkitAudioContext)();

      masterGain = ctx.createGain();
      masterGain.gain.value = 0.3;
      masterGain.connect(ctx.destination);

      dryGain = ctx.createGain();
      dryGain.gain.value = 0.7;
      dryGain.connect(masterGain);

      reverbGain = ctx.createGain();
      reverbGain.gain.value = 0.3;
      var convolver = createReverb(ctx);
      reverbGain.connect(convolver);
      convolver.connect(masterGain);

      // Create 3 drone layers
      oscillators.push(createDrone(130.81, 0));    // C3
      oscillators.push(createDrone(196.00, 5));    // G3 slightly detuned
      oscillators.push(createDrone(261.63, -3));   // C4 slightly detuned

      // Fade in drones
      oscillators.forEach(function(d) {
        d.gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2);
      });
    },

    start: function() {
      if (isPlaying) return;
      isPlaying = true;
      if (ctx.state === 'suspended') ctx.resume();
      scheduleMelody();
    },

    stop: function() {
      isPlaying = false;
      // Fade out drones
      var now = ctx.currentTime;
      oscillators.forEach(function(d) {
        d.gain.gain.linearRampToValueAtTime(0, now + 1);
      });
    },

    setScrollDepth: function(depth) {
      scrollDepth = Math.max(0, Math.min(1, depth));
      // Adjust filter brightness based on scroll
      oscillators.forEach(function(d) {
        d.filter.frequency.value = 600 + scrollDepth * 600;
      });
    },

    setVolume: function(vol) {
      if (masterGain) masterGain.gain.value = Math.max(0, Math.min(1, vol));
    }
  };
})();
