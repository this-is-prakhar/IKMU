import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameStore } from '../../store/gameStore.js';
import { sortLeaderboard, accuracy } from '../../game-logic/scoring.js';
import { useSound } from '../../hooks/useSound.js';

const MEDALS  = ['🥇', '🥈', '🥉'];

export default function EndScreen() {
  const players    = useGameStore((s) => s.players);
  const winner     = useGameStore((s) => s.winner);
  const questions  = useGameStore((s) => s.questions);
  const resetGame  = useGameStore((s) => s.resetGame);
  const sounds     = useSound();
  const sorted     = sortLeaderboard(players);
  const lastQ      = questions[questions.length - 1];

  // Fire confetti + winner sound on mount
  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    sounds.winner();

    // Burst 1
    confetti({ particleCount: 140, spread: 90, origin: { y: 0.55 },
      colors: ['#F5C842', '#E86F1F', '#C8640A', '#FFF8E7', '#1E7B6E'] });

    // Burst 2 from left
    setTimeout(() => confetti({
      particleCount: 80, angle: 60, spread: 55, origin: { x: 0, y: 0.65 },
      colors: ['#F5C842', '#D4952A', '#FF4444'],
    }), 600);

    // Burst 3 from right
    setTimeout(() => confetti({
      particleCount: 80, angle: 120, spread: 55, origin: { x: 1, y: 0.65 },
      colors: ['#F5C842', '#1E7B6E', '#FFF8E7'],
    }), 900);

    // Finale shower
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
        gap: 'clamp(12px, 2.5vh, 28px)',
        padding: 24,
        overflow: 'hidden',
      }}
    >
      {/* Ambient background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/assets/game_start.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.08,
        filter: 'blur(6px)',
      }} />

      {/* WINNER crest + portrait */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
        style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {/* winner.png as crest */}
        <div style={{ position: 'relative', width: 'min(35vw, 220px)' }}>
          <img
            src="/assets/winner.png"
            alt="Winner"
            style={{
              width: '100%', height: 'auto',
              filter: 'drop-shadow(0 8px 32px rgba(245,200,66,0.6)) drop-shadow(0 0 64px rgba(245,200,66,0.2))',
            }}
          />
          {/* Winning pawn portrait centered in crest */}
          {winner && (
            <div style={{
              position: 'absolute',
              top: '15%', left: '50%',
              transform: 'translateX(-50%)',
              width: '50%',
            }}>
              <motion.img
                src={winner.pawnImage}
                alt={winner.name}
                style={{ width: '100%', height: 'auto', objectFit: 'contain', objectPosition: 'bottom' }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          )}
        </div>

        {/* Winner name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            fontFamily: 'Cinzel Decorative, serif',
            fontSize: 'clamp(1.2rem, 3vw, 2rem)',
            color: '#F5C842',
            textShadow: '0 0 24px rgba(245,200,66,0.6), 0 2px 8px rgba(0,0,0,0.8)',
            textAlign: 'center',
            marginTop: -8,
          }}
        >
          🏆 {winner?.name ?? 'Winner'} Wins!
        </motion.div>
      </motion.div>

      {/* Story capstone */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 'min(80vw, 560px)',
          textAlign: 'center',
          fontFamily: 'Crimson Text, serif',
          fontStyle: 'italic',
          fontSize: 'clamp(0.85rem, 1.6vw, 1.05rem)',
          color: 'rgba(245,237,208,0.8)',
          lineHeight: 1.5,
          padding: '12px 20px',
          borderTop: '1px solid rgba(245,200,66,0.3)',
          borderBottom: '1px solid rgba(245,200,66,0.3)',
        }}
      >
        "{lastQ?.consequence}"
      </motion.div>

      {/* Final scores table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
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
              ? 'linear-gradient(135deg, rgba(245,200,66,0.2), rgba(232,111,31,0.1))'
              : 'rgba(255,255,255,0.05)',
            border: `2px solid ${rank === 0 ? 'rgba(245,200,66,0.5)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 12,
            padding: '12px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            minWidth: 130,
          }}>
            <span style={{ fontSize: '1.5rem' }}>{MEDALS[rank]}</span>
            <img
              src={p.pawnImage}
              alt={p.name}
              style={{ width: 44, height: 52, objectFit: 'contain', objectPosition: 'bottom' }}
            />
            <div style={{
              fontFamily: 'Cinzel, serif',
              fontWeight: 700,
              fontSize: 'clamp(0.7rem, 1.3vw, 0.9rem)',
              color: rank === 0 ? '#F5C842' : '#FFF8E7',
              textAlign: 'center',
            }}>
              {p.name}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2px 10px',
              fontSize: '0.7rem',
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

      {/* PLAY AGAIN button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        style={{ position: 'relative', zIndex: 2 }}
      >
        <motion.button
          className="btn-asset"
          onClick={handlePlayAgain}
          style={{ width: 'min(45vw, 260px)' }}
          whileHover={{ scale: 0.96 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 600, damping: 30 }}
        >
          <img src="/assets/game_start_button.png" alt="Play Again" style={{ width: '100%', height: 'auto' }} />
        </motion.button>
        <p style={{
          textAlign: 'center',
          fontFamily: 'Cinzel, serif',
          fontSize: '0.65rem',
          color: 'rgba(245,237,208,0.4)',
          marginTop: 4,
          letterSpacing: 2,
        }}>
          PLAY AGAIN
        </p>
      </motion.div>
    </div>
  );
}
