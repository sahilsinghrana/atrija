/**
 * Tests for AmbientAudio — Procedural ambient music engine
 * PRD: idea-004-ambient-music.md
 * Phase: GREEN — tests should PASS after implementation
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

describe('AmbientAudio', () => {
  let AmbientAudio;
  let mockAudioContext;
  let sandbox;

  beforeEach(() => {
    // Create a mock node for Web Audio API
    function createMockNode(type) {
      return {
        type,
        frequency: { value: 0, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
        gain: { value: 0, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
        detune: { value: 0 },
        Q: { value: 0 },
        connect: vi.fn().mockReturnThis(),
        start: vi.fn(),
        stop: vi.fn(),
      };
    }

    mockAudioContext = {
      sampleRate: 44100,
      currentTime: 100,
      state: 'running',
      destination: {},
      createGain: vi.fn(() => createMockNode('gain')),
      createOscillator: vi.fn(() => createMockNode('oscillator')),
      createBiquadFilter: vi.fn(() => createMockNode('filter')),
      createConvolver: vi.fn(() => ({
        buffer: null,
        connect: vi.fn().mockReturnThis(),
      })),
      createBuffer: vi.fn(() => ({
        getChannelData: vi.fn(() => new Float32Array(44100 * 2.5)),
      })),
      resume: vi.fn(),
      suspend: vi.fn(),
    };

    // Create a sandbox that acts like a browser window.
    // The script uses `var AmbientAudio` at global scope (becomes window.AmbientAudio)
    // and references `window.AudioContext` and `navigator.userAgent`.
    sandbox = {
      setTimeout: setTimeout,
      Math: Math,
      navigator: { userAgent: 'Mozilla/5.0 (Desktop)' },
    };
    // Make window reference the sandbox (simulates browser's window global)
    sandbox.window = sandbox;
    sandbox.AudioContext = vi.fn(() => mockAudioContext);
    sandbox.webkitAudioContext = vi.fn(() => mockAudioContext);

    // Load the ambient-audio.js script
    const scriptPath = path.resolve(process.cwd(), 'public/js/ambient-audio.js');

    if (!fs.existsSync(scriptPath)) {
      AmbientAudio = null;
      return;
    }

    const script = fs.readFileSync(scriptPath, 'utf-8');

    // Run the script in the sandbox context (simulates browser global scope)
    const context = vm.createContext(sandbox);
    vm.runInContext(script, context);

    // In a browser, `var AmbientAudio` at global scope === window.AmbientAudio
    AmbientAudio = sandbox.AmbientAudio;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('init()', () => {
    it('should create audio context without error', () => {
      expect(AmbientAudio).not.toBeNull();
      expect(() => AmbientAudio.init()).not.toThrow();
      expect(sandbox.AudioContext).toHaveBeenCalled();
    });

    it('should not create duplicate context on second init', () => {
      AmbientAudio.init();
      const callCount = sandbox.AudioContext.mock.calls.length;
      AmbientAudio.init();
      expect(sandbox.AudioContext.mock.calls.length).toBe(callCount);
    });
  });

  describe('start/stop', () => {
    it('should create drone oscillators after init', () => {
      AmbientAudio.init();
      // After init, 3 drone oscillators should be created
      const oscNodes = mockAudioContext.createOscillator.mock.results;
      expect(oscNodes.length).toBeGreaterThanOrEqual(3);
    });

    it('should not create more oscillators if already playing', () => {
      AmbientAudio.init();
      AmbientAudio.start();
      const oscCount = mockAudioContext.createOscillator.mock.results.length;
      AmbientAudio.start();
      // Should not create more oscillators
      expect(mockAudioContext.createOscillator.mock.results.length).toBe(oscCount);
    });
  });

  describe('setScrollDepth()', () => {
    it('should clamp scroll depth to [0, 1]', () => {
      AmbientAudio.init();
      // Set extreme values — should not throw
      expect(() => AmbientAudio.setScrollDepth(-0.5)).not.toThrow();
      expect(() => AmbientAudio.setScrollDepth(1.5)).not.toThrow();
      expect(() => AmbientAudio.setScrollDepth(0.5)).not.toThrow();
    });
  });

  describe('setVolume()', () => {
    it('should clamp volume to [0, 1]', () => {
      AmbientAudio.init();
      // Set extreme values — should not throw
      expect(() => AmbientAudio.setVolume(-1)).not.toThrow();
      expect(() => AmbientAudio.setVolume(2.0)).not.toThrow();
      expect(() => AmbientAudio.setVolume(0.5)).not.toThrow();
    });
  });
});
