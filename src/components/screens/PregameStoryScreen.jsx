import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore.js';
import { useSound } from '../../hooks/useSound.js';

export default function PregameStoryScreen() {
  const pregame     = useGameStore((s) => s.pregame);
  const beginPhase1 = useGameStore((s) => s.beginPhase1);
  const sounds      = useSound();

  function handleBegin() {
    sounds.click();
    beginPhase1();
  }

  return (
    <div
      className="screen"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #1C0E06 0%, #0D0906 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/assets/game_start.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.15,
        filter: 'blur(4px)',
      }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 750,
          zIndex: 2,
          background: 'linear-gradient(165deg, rgba(28, 18, 12, 0.96) 0%, rgba(18, 11, 7, 0.98) 100%)',
          border: '2px solid #D4952A',
          borderRadius: 16,
          boxShadow: '0 16px 48px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(245, 200, 66, 0.4), inset 0 1px 0 rgba(255,248,231,0.15)',
          padding: '32px 36px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            fontFamily: 'Cinzel Decorative, serif',
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
            color: '#F5C842',
            textAlign: 'center',
            textShadow: '0 2px 12px rgba(0,0,0,0.8)',
            lineHeight: 1.2,
          }}
        >
          {pregame.title}
        </motion.div>

        <div style={{ height: 1, background: 'rgba(245,200,66,0.3)', margin: '4px 0' }} />

        {/* Story text */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            fontFamily: 'Crimson Text, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(0.9rem, 1.8vw, 1.12rem)',
            lineHeight: 1.65,
            color: '#FFF8E7',
            textShadow: '0 1px 4px rgba(0,0,0,0.6)',
            whiteSpace: 'pre-line',
            maxHeight: '50vh',
            overflowY: 'auto',
            paddingRight: 8,
          }}
        >
          {pregame.text}
        </motion.div>

        {/* BEGIN button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{ textAlign: 'center', marginTop: 12 }}
        >
          <motion.button
            onClick={handleBegin}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            style={{
              background: 'linear-gradient(135deg, #C8640A, #D4952A)',
              border: '2px solid #F5C842',
              borderRadius: 8,
              padding: '12px 36px',
              fontFamily: 'Cinzel, serif',
              fontWeight: 700,
              fontSize: 'clamp(0.85rem, 1.6vw, 1.05rem)',
              color: '#FFF8E7',
              cursor: 'pointer',
              letterSpacing: 2,
              textTransform: 'uppercase',
              boxShadow: '0 4px 20px rgba(245,200,66,0.35)',
            }}
          >
            Begin the Journey →
          </motion.button>
        </motion.div>

        <p style={{
          textAlign: 'center',
          fontFamily: 'Cinzel, serif',
          fontSize: '0.65rem',
          color: 'rgba(212,149,42,0.6)',
          letterSpacing: 2,
          margin: 0,
          textTransform: 'uppercase',
        }}>
          25 Questions · 5 Phases · One Supply Chain Crisis
        </p>
      </motion.div>
    </div>
  );
}
