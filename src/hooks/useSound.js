import { useCallback, useRef } from 'react';

/**
 * Web Audio API sound hook.
 * Generates pleasant tones — no external audio files needed.
 * All sounds are silence-safe (catch + ignore if AudioContext unavailable).
 */
export function useSound() {
  const ctxRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      try {
        ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch { return null; }
    }
    return ctxRef.current;
  }, []);

  const playTone = useCallback((freq, type = 'sine', duration = 0.15, gain = 0.3, startDelay = 0) => {
    try {
      const ctx = getCtx();
      if (!ctx) return;
      const osc  = ctx.createOscillator();
      const vol  = ctx.createGain();
      osc.connect(vol);
      vol.connect(ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startDelay);
      vol.gain.setValueAtTime(gain, ctx.currentTime + startDelay);
      vol.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + duration);
      osc.start(ctx.currentTime + startDelay);
      osc.stop(ctx.currentTime + startDelay + duration + 0.01);
    } catch { /* silent fail */ }
  }, [getCtx]);

  const sounds = {
    click: () => playTone(800, 'sine', 0.08, 0.2),

    correct: () => {
      playTone(523, 'sine', 0.15, 0.35);
      playTone(659, 'sine', 0.15, 0.35, 0.1);
      playTone(784, 'sine', 0.25, 0.35, 0.2);
    },

    wrong: () => {
      playTone(300, 'sawtooth', 0.1, 0.3);
      playTone(200, 'sawtooth', 0.15, 0.3, 0.1);
    },

    tick: () => playTone(600, 'square', 0.05, 0.15),

    urgencyTick: () => playTone(880, 'square', 0.08, 0.25),

    move: () => {
      playTone(440, 'sine', 0.08, 0.2);
      playTone(550, 'sine', 0.08, 0.2, 0.06);
    },

    snake: () => {
      playTone(350, 'sawtooth', 0.12, 0.25);
      playTone(250, 'sawtooth', 0.12, 0.25, 0.1);
      playTone(180, 'sawtooth', 0.2, 0.25, 0.2);
    },

    ladder: () => {
      playTone(523, 'triangle', 0.1, 0.3);
      playTone(659, 'triangle', 0.1, 0.3, 0.08);
      playTone(784, 'triangle', 0.1, 0.3, 0.16);
      playTone(1047, 'triangle', 0.2, 0.3, 0.24);
    },

    buzz: () => playTone(660, 'square', 0.12, 0.4),

    winner: () => {
      const notes = [523, 659, 784, 1047, 784, 1047];
      notes.forEach((f, i) => playTone(f, 'triangle', 0.2, 0.4, i * 0.15));
    },

    confetti: () => playTone(1200, 'sine', 0.3, 0.5),
  };

  return sounds;
}
