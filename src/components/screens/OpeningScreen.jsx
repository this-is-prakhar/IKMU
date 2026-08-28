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
      {/* Full-screen background illustration */}
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
        background: 'radial-gradient(ellipse at center, transparent 60%, rgba(13,9,6,0.4) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Particle layer */}
      <ParticleLayer />

      {/* START GAME Button centered on the Y-axis on the right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 30 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.3 }}
        style={{
          position: 'absolute',
          right: 'clamp(24px, 5vw, 70px)',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <motion.img
          src="/assets/game_start_button.png"
          alt="Start Game"
          onClick={handleStart}
          whileHover={{ scale: 1.08, filter: 'drop-shadow(0 8px 28px rgba(245,200,66,0.85))' }}
          whileTap={{ scale: 0.93 }}
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
            scale: { type: 'spring', stiffness: 400, damping: 20 },
          }}
          style={{
            width: 'clamp(180px, 22vw, 290px)',
            height: 'auto',
            cursor: 'pointer',
            filter: 'drop-shadow(0 6px 24px rgba(245,200,66,0.65))',
            display: 'block',
          }}
        />
      </motion.div>
    </div>
  );
}
