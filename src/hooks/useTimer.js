import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore.js';

/**
 * Drives the countdown timer via setInterval.
 * Watches timerActive; when it becomes true, starts ticking once/second.
 * Calls timerExpired() when timeLeft reaches 0.
 */
export function useTimer() {
  const timerActive = useGameStore((s) => s.timerActive);
  const tickTimer   = useGameStore((s) => s.tickTimer);
  const timerExpired = useGameStore((s) => s.timerExpired);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (timerActive) {
      intervalRef.current = setInterval(() => {
        const { timeLeft, timerActive: active } = useGameStore.getState();
        if (!active) { clearInterval(intervalRef.current); return; }
        if (timeLeft <= 1) {
          clearInterval(intervalRef.current);
          timerExpired();
        } else {
          tickTimer();
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerActive]);
}
