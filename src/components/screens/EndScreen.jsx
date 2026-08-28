import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameStore } from '../../store/gameStore.js';
import { sortLeaderboard, accuracy } from '../../game-logic/scoring.js';
import { useSound } from '../../hooks/useSound.js';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function EndScreen() {
  const players   = useGameStore((s) => s.players);
  const winner    = useGameStore((s) => s.winner);
  const questions = useGameStore((s) => s.questions);
  const resetGame = useGameStore((s) => s.resetGame);
  const sounds    = useSound();
  const sorted    = sortLeaderboard(players);
  const lastQ     = questions[questions.length - 1];

  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    sounds.winner();

    confetti({ particleCount: 140, spread: 90, origin: { y: 0.55 },
      colors: ['#F5C842', '#E86F1F', '#C8640A', '#FFF8E7', '#1E7B6E'] });

    setTimeout(() => confetti({
      particleCount: 80, angle: 60, spread: 55, origin: { x: 0, y: 0.65 },
      colors: ['#F5C842', '#D4952A', '#FF4444'],
    }), 600);

    setTimeout(() => confetti({
      particleCount: 80, angle: 120, spread: 55, origin: { x: 1, y: 0.65 },
      colors: ['#F5C842', '#1E7B6E', '#FFF8E7'],
    }), 900);

    setTimeout(() => confetti({
      particleCount: 200, spread: 140, origin: { y: 0.3 },
      colors: ['#F5C842', '#E86F1F', '#C8640A', '#FFF8E7', '#1E7B6E', '#9B59B6'],
    }), 1600);
  }, []);

  function handlePlayAgain() {
    sounds.click();
    resetGame();
  }

  return (
    <div
      className="screen"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #1C1005 0%, #0D0906 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(10px, 2vh, 24px)',
        padding: 24,
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/assets/game_start.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.15,
        filter: 'blur(6px)',
      }} />

      {/* Winner Crest Box */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'linear-gradient(160deg, rgba(22, 14, 8, 0.94), rgba(12, 8, 5, 0.96))',
          border: '2.5px solid #F5C842',
          borderRadius: 20,
          padding: '20px 40px',
          boxShadow: '0 12px 48px rgba(0,0,0,0.8), 0 0 32px rgba(245,200,66,0.3)',
        }}
      >
        <div style={{ fontSize: '3rem', filter: 'drop-shadow(0 0 16px #F5C842)' }}>👑</div>

        {winner && (
          <motion.img
            src={winner.pawnImage}
            alt={winner.name}
            style={{ width: 70, height: 80, objectFit: 'contain', objectPosition: 'bottom', margin: '4px 0' }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            fontFamily: 'Cinzel Decorative, serif',
            fontSize: 'clamp(1.3rem, 3vw, 2rem)',
            color: '#F5C842',
            textShadow: '0 0 24px rgba(245,200,66,0.6), 0 2px 8px rgba(0,0,0,0.8)',
            textAlign: 'center',
          }}
        >
          🏆 {winner?.name ?? 'Winner'} Wins!
        </motion.div>
      </motion.div>

      {/* Story Capstone */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 'min(85vw, 600px)',
          textAlign: 'center',
          fontFamily: 'Crimson Text, serif',
          fontStyle: 'italic',
          fontSize: 'clamp(0.85rem, 1.6vw, 1.05rem)',
          color: 'rgba(245,237,208,0.85)',
          lineHeight: 1.5,
          padding: '10px 20px',
          borderTop: '1px solid rgba(245,200,66,0.3)',
          borderBottom: '1px solid rgba(245,200,66,0.3)',
        }}
      >
        "{lastQ?.consequence}"
      </motion.div>

      {/* Final Scores Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {sorted.map((p, rank) => (
          <div key={p.id} style={{
            background: rank === 0
              ? 'linear-gradient(135deg, rgba(245,200,66,0.22), rgba(232,111,31,0.12))'
              : 'rgba(255,255,255,0.05)',
            border: `2px solid ${rank === 0 ? 'rgba(245,200,66,0.55)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 12,
            padding: '10px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            minWidth: 120,
          }}>
            <span style={{ fontSize: '1.4rem' }}>{MEDALS[rank]}</span>
            <img
              src={p.pawnImage}
              alt={p.name}
              style={{ width: 40, height: 48, objectFit: 'contain', objectPosition: 'bottom' }}
            />
            <div style={{
              fontFamily: 'Cinzel, serif',
              fontWeight: 700,
              fontSize: 'clamp(0.7rem, 1.2vw, 0.88rem)',
              color: rank === 0 ? '#F5C842' : '#FFF8E7',
              textAlign: 'center',
            }}>
              {p.name}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2px 8px',
              fontSize: '0.68rem',
              fontFamily: 'Cinzel, serif',
              color: 'rgba(245,237,208,0.7)',
            }}>
              <span>Tile:</span>     <span style={{ color: '#D4952A', fontWeight: 700 }}>{p.position}</span>
              <span>Score:</span>    <span style={{ color: '#F5C842', fontWeight: 700 }}>{p.score}pts</span>
              <span>✓ Right:</span>  <span style={{ color: '#32CD32' }}>{p.correct}</span>
              <span>✗ Wrong:</span>  <span style={{ color: '#FF4444' }}>{p.wrong}</span>
              <span>Accuracy:</span> <span style={{ color: '#D4952A' }}>{accuracy(p)}</span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* PLAY AGAIN Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        style={{ position: 'relative', zIndex: 2 }}
      >
        <motion.button
          className="btn-asset"
          onClick={handlePlayAgain}
          style={{ width: 'min(45vw, 240px)' }}
          whileHover={{ scale: 0.96 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 600, damping: 30 }}
        >
          <img src="/assets/game_start_button.png" alt="Play Again" style={{ width: '100%', height: 'auto' }} />
        </motion.button>
      </motion.div>
    </div>
  );
}
