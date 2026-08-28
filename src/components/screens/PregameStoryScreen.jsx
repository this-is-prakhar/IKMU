import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore.js';
import { useSound } from '../../hooks/useSound.js';

export default function PregameStoryScreen() {
  const pregame    = useGameStore((s) => s.pregame);
  const beginPhase1 = useGameStore((s) => s.beginPhase1);
  const sounds     = useSound();
  const [revealed, setRevealed] = useState(false);

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
      {/* Subtle background texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/assets/game_start.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.06,
        filter: 'blur(4px)',
      }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 800,
          zIndex: 2,
        }}
      >
        {/* Outer frame — messages.png style */}
        <div style={{ position: 'relative' }}>
          <img
            src="/assets/messages.png"
            alt=""
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              filter: 'drop-shadow(0 16px 48px rgba(0,0,0,0.9))',
            }}
          />

          {/* Story content overlaid on scroll */}
          <div style={{
            position: 'absolute',
            top: '12%', left: '12%', right: '12%', bottom: '15%',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            overflow: 'hidden',
          }}>
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                fontFamily: 'Cinzel Decorative, serif',
                fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                color: '#F5C842',
                textAlign: 'center',
                textShadow: '0 2px 12px rgba(0,0,0,0.7)',
                lineHeight: 1.2,
              }}
            >
              {pregame.title}
            </motion.div>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(245,200,66,0.4)', flexShrink: 0 }} />

            {/* Story text — scroll reveal */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                style={{
                  fontFamily: 'Crimson Text, serif',
                  fontStyle: 'italic',
                  fontSize: 'clamp(0.82rem, 1.6vw, 1.05rem)',
                  lineHeight: 1.6,
                  color: '#FFF8E7',
                  textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                  whiteSpace: 'pre-line',
                }}
              >
                {pregame.text}
              </motion.div>
            </div>

            {/* BEGIN button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              style={{ textAlign: 'center', flexShrink: 0, paddingTop: 4 }}
            >
              <motion.button
                onClick={handleBegin}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                style={{
                  background: 'linear-gradient(135deg, #C8640A, #D4952A)',
                  border: '2px solid #F5C842',
                  borderRadius: 8,
                  padding: '10px 32px',
                  fontFamily: 'Cinzel, serif',
                  fontWeight: 700,
                  fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
                  color: '#FFF8E7',
                  cursor: 'pointer',
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  boxShadow: '0 4px 20px rgba(245,200,66,0.3)',
                }}
              >
                Begin the Journey →
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Subtitle below frame */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            textAlign: 'center',
            fontFamily: 'Cinzel, serif',
            fontSize: '0.65rem',
            color: 'rgba(212,149,42,0.6)',
            letterSpacing: 2,
            marginTop: 12,
            textTransform: 'uppercase',
          }}
        >
          25 Questions · 5 Phases · One Supply Chain Crisis
        </motion.p>
      </motion.div>
    </div>
  );
}
