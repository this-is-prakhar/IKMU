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
      {/* Background image — panning */}
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/assets/game_start.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.55) saturate(1.2)',
        }}
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />

      {/* Dark vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(13,9,6,0.8) 100%)',
      }} />

      {/* Particle layer */}
      <ParticleLayer />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 28,
      }}>
        {/* Title logo */}
        <motion.div
          initial={{ y: 60, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.2 }}
          style={{ width: 'min(80vw, 560px)' }}
        >
          <img
            src="/assets/game_start.png"
            alt="Idhar Ka Maal Udhar — Supply Chain Snakes & Ladders"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.8)) drop-shadow(0 0 48px rgba(245,200,66,0.3))',
              borderRadius: 12,
            }}
          />
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(0.8rem, 1.8vw, 1.1rem)',
            color: '#D4952A',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            textAlign: 'center',
          }}
        >
          Supply Chain Snakes &amp; Ladders · A Story-Driven Quiz Game
        </motion.div>

        {/* START GAME button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <button className="start-game-btn" onClick={handleStart}>
            START GAME
          </button>
        </motion.div>

        {/* Players hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
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
