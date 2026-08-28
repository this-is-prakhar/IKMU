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
    <div className="screen" style={{ background: '#0D0906' }}>
      {/* Single full-page background image */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/assets/game_start.png)',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }} />

      {/* Particle layer */}
      <ParticleLayer />

      {/* Content overlay — just the button at the bottom */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: '100%',
        paddingBottom: 'clamp(40px, 8vh, 80px)',
        gap: 16,
      }}>
        {/* START GAME button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.img
            src="/assets/game_start_button.png"
            alt="Start Game"
            onClick={handleStart}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            style={{
              width: 'clamp(180px, 28vw, 280px)',
              height: 'auto',
              cursor: 'pointer',
              filter: 'drop-shadow(0 4px 16px rgba(245,200,66,0.4))',
              display: 'block',
            }}
          />
        </motion.div>

        {/* Hint text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            fontFamily: 'Crimson Text, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(0.75rem, 1.4vw, 0.95rem)',
            color: 'rgba(245,237,208,0.5)',
          }}
        >
          3 players · 25 questions · 5 phases of supply chain chaos
        </motion.div>
      </div>
    </div>
  );
}
