import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore.js';
import ParticleLayer from '../ui/ParticleLayer.jsx';
import { useSound } from '../../hooks/useSound.js';

export default function OpeningScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const sounds    = useSound();

  function handleStart() {
    sounds.click();
    setScreen('playerSetup');
  }

  return (
    <div className="screen" style={{ background: '#0D0906', overflow: 'hidden' }}>
      {/* Single full-screen fitted background image */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/assets/game_start.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      }} />

      {/* Subtle vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(13,9,6,0.6) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Particle layer */}
      <ParticleLayer />

      {/* Content overlay — only START GAME button and footer hint at the bottom */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: '100%',
        paddingBottom: 'clamp(36px, 7vh, 70px)',
        gap: 14,
      }}>
        {/* START GAME button */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.img
            src="/assets/game_start_button.png"
            alt="Start Game"
            onClick={handleStart}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            style={{
              width: 'clamp(200px, 26vw, 320px)',
              height: 'auto',
              cursor: 'pointer',
              filter: 'drop-shadow(0 6px 20px rgba(245,200,66,0.5))',
              display: 'block',
            }}
          />
        </motion.div>

        {/* Footer Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            fontFamily: 'Crimson Text, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(0.78rem, 1.4vw, 0.98rem)',
            color: 'rgba(255,248,231,0.7)',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
          }}
        >
          3 players · 25 questions · 5 phases of supply chain chaos
        </motion.div>
      </div>
    </div>
  );
}
