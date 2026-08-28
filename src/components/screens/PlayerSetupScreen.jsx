import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore.js';
import { useSound } from '../../hooks/useSound.js';

const PAWN_IMAGES = ['/assets/pawn1.png', '/assets/pawn2.png', '/assets/pawn3.png'];
const PAWN_LABELS = ['Uncle Sardar', 'Uncle Grump', 'Uncle Specs'];

export default function PlayerSetupScreen() {
  const players     = useGameStore((s) => s.players);
  const setPlayerName = useGameStore((s) => s.setPlayerName);
  const startGame   = useGameStore((s) => s.startGame);
  const setScreen   = useGameStore((s) => s.setScreen);
  const sounds      = useSound();

  const allFilled = players.every((p) => p.name.trim().length > 0);

  function handleStart() {
    if (!allFilled) return;
    sounds.click();
    startGame();
  }

  return (
    <div
      className="screen"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #1A0D06 0%, #0D0906 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        padding: 24,
      }}
    >
      {/* Decorative header line */}
      <div style={{ textAlign: 'center' }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: 'Cinzel Decorative, serif',
            fontSize: 'clamp(1.2rem, 3vw, 2rem)',
            color: '#F5C842',
            textShadow: '0 2px 16px rgba(245,200,66,0.4)',
            marginBottom: 6,
          }}
        >
          Who's Playing?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            fontFamily: 'Crimson Text, serif',
            fontStyle: 'italic',
            color: '#D4952A',
            fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
          }}
        >
          Enter names for all 3 players to begin the adventure
        </motion.p>
      </div>

      {/* Gold divider */}
      <div style={{ width: 'min(60vw, 400px)', height: 1, background: 'linear-gradient(90deg, transparent, #F5C842, transparent)' }} />

      {/* Player cards */}
      <div style={{
        display: 'flex',
        gap: 'clamp(12px, 3vw, 32px)',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {players.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i + 0.3, type: 'spring', stiffness: 200, damping: 22 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              background: 'linear-gradient(160deg, rgba(200,100,10,0.12), rgba(30,123,110,0.08))',
              border: '2px solid rgba(245,200,66,0.25)',
              borderRadius: 16,
              padding: 'clamp(16px, 3vw, 28px)',
              width: 'clamp(180px, 26vw, 240px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
          >
            {/* Player number */}
            <div style={{
              fontFamily: 'Cinzel, serif',
              fontWeight: 700,
              fontSize: '0.7rem',
              color: '#D4952A',
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}>
              Player {i + 1}
            </div>

            {/* Pawn portrait */}
            <motion.img
              src={PAWN_IMAGES[i]}
              alt={PAWN_LABELS[i]}
              style={{
                width: 'clamp(70px, 12vw, 100px)',
                height: 'auto',
                objectFit: 'contain',
                objectPosition: 'bottom',
                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.7))',
              }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Pawn name */}
            <div style={{
              fontFamily: 'Crimson Text, serif',
              fontStyle: 'italic',
              fontSize: '0.85rem',
              color: 'rgba(245,237,208,0.6)',
            }}>
              {PAWN_LABELS[i]}
            </div>

            {/* Name input */}
            <input
              className="game-input"
              type="text"
              placeholder={`Enter name…`}
              maxLength={20}
              value={p.name}
              onChange={(e) => setPlayerName(i, e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && allFilled) handleStart(); }}
              autoFocus={i === 0}
            />
          </motion.div>
        ))}
      </div>

      {/* Start Quiz button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <motion.button
          className="btn-asset"
          onClick={handleStart}
          disabled={!allFilled}
          style={{
            width: 'min(50vw, 300px)',
            opacity: allFilled ? 1 : 0.4,
            cursor: allFilled ? 'pointer' : 'not-allowed',
            transition: 'opacity 0.3s',
          }}
          whileHover={allFilled ? { scale: 0.96 } : {}}
          whileTap={allFilled ? { scale: 0.92 } : {}}
          transition={{ type: 'spring', stiffness: 600, damping: 30 }}
        >
          <img src="/assets/game_start_button.png" alt="Start Quiz" style={{ width: '100%', height: 'auto' }} />
        </motion.button>
        {!allFilled && (
          <p style={{
            textAlign: 'center',
            fontFamily: 'Crimson Text, serif',
            fontStyle: 'italic',
            fontSize: '0.8rem',
            color: 'rgba(245,237,208,0.4)',
            marginTop: 6,
          }}>
            Fill in all 3 names to continue
          </p>
        )}
      </motion.div>

      {/* Back */}
      <button
        onClick={() => { sounds.click(); setScreen('opening'); }}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'Cinzel, serif',
          fontSize: '0.7rem',
          color: 'rgba(245,237,208,0.35)',
          letterSpacing: 1,
        }}
      >
        ← Back
      </button>
    </div>
  );
}
