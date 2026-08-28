import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore.js';
import { useSound } from '../../hooks/useSound.js';

const PHASE_COLORS = {
  1: { bg: '#8B2635', accent: '#FF6644', icon: '🔥' },
  2: { bg: '#1A4A2E', accent: '#32CD32', icon: '📦' },
  3: { bg: '#1A3A5C', accent: '#4488FF', icon: '🚚' },
  4: { bg: '#4A2E1A', accent: '#FFB347', icon: '🤝' },
  5: { bg: '#2E1A4A', accent: '#9B59B6', icon: '🌟' },
};

export default function PhaseTransitionCard() {
  const phases          = useGameStore((s) => s.phases);
  const pendingPhaseId  = useGameStore((s) => s.pendingPhaseId);
  const phaseTransDone  = useGameStore((s) => s.phaseTransitionDone);
  const sounds          = useSound();

  const phase  = phases.find((p) => p.id === pendingPhaseId) ?? phases[0];
  const colors = PHASE_COLORS[phase?.id] ?? PHASE_COLORS[1];

  // Auto-advance after 3 seconds
  useEffect(() => {
    const t = setTimeout(() => phaseTransDone(), 3400);
    return () => clearTimeout(t);
  }, [pendingPhaseId]);

  const romanNumerals = ['', 'I', 'II', 'III', 'IV', 'V'];

  return (
    <div
      className="screen phase-overlay"
      onClick={phaseTransDone}
      style={{ cursor: 'pointer' }}
    >
      {/* Radial glow background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, ${colors.bg}cc 0%, #0D0906 70%)`,
      }} />

      {/* Letterhead frame */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
        padding: 32,
      }}>
        {/* Phase icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20, delay: 0.1 }}
          style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', filter: 'drop-shadow(0 0 24px rgba(0,0,0,0.8))' }}
        >
          {colors.icon}
        </motion.div>

        {/* "Phase" label */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{
            fontFamily: 'Cinzel, serif',
            fontWeight: 400,
            fontSize: 'clamp(0.9rem, 2vw, 1.3rem)',
            color: '#D4952A',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
          }}
        >
          Phase {romanNumerals[phase?.id] ?? ''}
        </motion.div>

        {/* Phase name */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
          style={{ position: 'relative' }}
        >
          {/* Letterhead banner */}
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <img
              src="/assets/Letterhead.png"
              alt=""
              style={{
                width: 'min(80vw, 560px)',
                height: 'auto',
                display: 'block',
                filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.8))',
              }}
            />
            {/* Phase name text overlaid on Letterhead */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 15%',
            }}>
              <div style={{
                fontFamily: 'Cinzel Decorative, serif',
                fontWeight: 700,
                fontSize: 'clamp(0.9rem, 2.5vw, 1.6rem)',
                color: '#F5C842',
                textShadow: '0 2px 12px rgba(0,0,0,0.8)',
                textAlign: 'center',
                lineHeight: 1.2,
              }}>
                {phase?.name}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Question range */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
            color: colors.accent,
            letterSpacing: '0.2em',
          }}
        >
          Questions {phase?.questionRange?.[0]} – {phase?.questionRange?.[1]}
        </motion.div>

        {/* Gold divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          style={{
            width: 'min(40vw, 300px)',
            height: 2,
            background: 'linear-gradient(90deg, transparent, #F5C842, transparent)',
          }}
        />

        {/* Click to continue hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0, 1] }}
          transition={{ delay: 1.5, duration: 1, repeat: Infinity }}
          style={{
            fontFamily: 'Crimson Text, serif',
            fontStyle: 'italic',
            fontSize: '0.8rem',
            color: 'rgba(245,237,208,0.5)',
          }}
        >
          tap to continue…
        </motion.div>
      </div>
    </div>
  );
}
