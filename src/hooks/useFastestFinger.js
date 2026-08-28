import { useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore.js';

/**
 * Fastest-Finger-First keyboard listener.
 * Active only when current question is in 'fastest-finger' mode and gamePhase is 'question'.
 *
 * Key bindings:
 *   Q → Player 0 buzz in
 *   W → Player 1 buzz in
 *   E → Player 2 buzz in
 *   1 → Player 0 (alt)
 *   2 → Player 1 (alt)
 *   3 → Player 2 (alt)
 *
 *   A / B → Submit answer after buzzing in
 */
export function useFastestFinger() {
  const questions    = useGameStore((s) => s.questions);
  const currentQIdx  = useGameStore((s) => s.currentQuestionIndex);
  const gamePhase    = useGameStore((s) => s.gamePhase);
  const buzzLock     = useGameStore((s) => s.buzzLock);
  const screen       = useGameStore((s) => s.screen);
  const buzzIn       = useGameStore((s) => s.buzzIn);
  const submitAnswer = useGameStore((s) => s.submitAnswer);

  const currentQ = questions[currentQIdx];
  const isFFF    = currentQ?.ruleset?.mode === 'fastest-finger';
  const isActive = screen === 'playing' && isFFF;

  const handleKey = useCallback((e) => {
    if (!isActive) return;
    const key = e.key.toUpperCase();

    // Buzz-in (only when no one is locked)
    if (buzzLock === null && gamePhase === 'question') {
      if (key === 'Q' || key === '1') { buzzIn(0); return; }
      if (key === 'W' || key === '2') { buzzIn(1); return; }
      if (key === 'E' || key === '3') { buzzIn(2); return; }
    }

    // Answer submission (only after buzz-in, during question phase)
    if (buzzLock !== null && gamePhase === 'question') {
      if (key === 'A') { submitAnswer('A'); return; }
      if (key === 'B') { submitAnswer('B'); return; }
    }
  }, [isActive, buzzLock, gamePhase, buzzIn, submitAnswer]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);
}
