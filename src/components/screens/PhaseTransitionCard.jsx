import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore.js';

const PHASE_COLORS = {
  1: { bg: '#8B2635', accent: '#FF6644', icon: '🔥' },
  2: { bg: '#1A4A2E', accent: '#32CD32', icon: '📦' },
  3: { bg: '#1A3A5C', accent: '#4488FF', icon: '🚚' },
  4: { bg: '#4A2E1A', accent: '#FFB347', icon: '🤝' },
  5: { bg: '#2E1A4A', accent: '#9B59B6', icon: '🌟' },
};

export default function PhaseTransitionCard() {
  const phases         = useGameStore((s) => s.phases);
  const pendingPhaseId = useGameStore((s) => s.pendingPhaseId);
  const phaseTransDone = useGameStore((s) => s.phaseTransitionDone);

  const phase  = phases.find((p) => p.id === pendingPhaseId) ?? phases[0];
  const colors = PHASE_COLORS[phase?.id] ?? PHASE_COLORS[1];

  useEffect(() => {
    const t = setTimeout(() => phaseTransDone(), 3200);
    return () => clearTimeout(t);
  }, [pendingPhaseId]);

  const romanNumerals = ['', 'I', 'II', 'III', 'IV', 'V'];

  return (
    <div
      className="screen phase-overlay"
      onClick={phaseTransDone}
      style={{ cursor: 'pointer' }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, ${colors.bg}cc 0%, #0D0906 70%)`,
      }} />

      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        padding: 32,
      }}>
        {/* Phase icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20, delay: 0.1 }}
          style={{ fontSize: 'clamp(3rem, 7vw, 4.5rem)', filter: 'drop-shadow(0 0 24px rgba(0,0,0,0.8))' }}
        >
          {colors.icon}
        </motion.div>

        {/* Phase number */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{
            fontFamily: 'Cinzel, serif',
            fontWeight: 700,
            fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
            color: '#D4952A',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
          }}
        >
          PHASE {romanNumerals[phase?.id] ?? ''}
        </motion.div>

        {/* Phase name banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
          style={{
            background: 'linear-gradient(160deg, rgba(22, 14, 8, 0.95), rgba(12, 8, 5, 0.98))',
            border: '2px solid rgba(245, 200, 66, 0.4)',
            borderRadius: 14,
            padding: '18px 36px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
            textAlign: 'center',
            maxWidth: 'min(85vw, 600px)',
          }}
        >
          <div style={{
            fontFamily: 'Cinzel Decorative, serif',
            fontWeight: 700,
            fontSize: 'clamp(1rem, 2.8vw, 1.8rem)',
            color: '#F5C842',
            textShadow: '0 2px 12px rgba(0,0,0,0.8)',
            lineHeight: 1.25,
          }}>
            {phase?.name}
          </div>
        </motion.div>

        {/* Question range */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
            color: colors.accent,
            letterSpacing: '0.2em',
          }}
        >
          Questions {phase?.questionRange?.[0]} – {phase?.questionRange?.[1]}
        </motion.div>

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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0, 1] }}
          transition={{ delay: 1.2, duration: 1, repeat: Infinity }}
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
