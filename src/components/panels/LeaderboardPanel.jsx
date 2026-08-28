import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore.js';
import { sortLeaderboard } from '../../game-logic/scoring.js';
import { accuracy } from '../../game-logic/scoring.js';

const MEDALS = ['🥇', '🥈', '🥉'];

/**
 * Leaderboard panel framed in winner.png (gold crest).
 * Animates re-sort when positions change.
 */
export default function LeaderboardPanel() {
  const players      = useGameStore((s) => s.players);
  const leaderChanged = useGameStore((s) => s.leaderChanged);
  const sorted       = sortLeaderboard(players);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Frame */}
      <img
        src="/assets/winner.png"
        alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'fill',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '22% 8% 8%',
        gap: 6,
      }}>
        {/* NEW LEADER flash */}
        <AnimatePresence>
          {leaderChanged && (
            <motion.div
              key="new-leader"
              initial={{ scale: 0, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              style={{
                position: 'absolute',
                top: '12%',
                background: 'linear-gradient(135deg, #F5C842, #E86F1F)',
                color: '#1A0D06',
                fontFamily: 'Cinzel, serif',
                fontWeight: 900,
                fontSize: '0.7rem',
                padding: '4px 10px',
                borderRadius: 20,
                letterSpacing: 1,
                boxShadow: '0 4px 16px rgba(245,200,66,0.7)',
                zIndex: 10,
              }}
            >
              ⭐ NEW LEADER!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rankings */}
        {sorted.map((player, rank) => (
          <motion.div
            key={player.id}
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              width: '100%',
              background: rank === 0
                ? 'linear-gradient(90deg, rgba(245,200,66,0.2), transparent)'
                : 'rgba(255,255,255,0.04)',
              borderRadius: 6,
              padding: '4px 6px',
              border: rank === 0 ? '1px solid rgba(245,200,66,0.4)' : '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {/* Medal */}
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>{MEDALS[rank] ?? '🎯'}</span>

            {/* Pawn thumbnail */}
            <img
              src={player.pawnImage}
              alt={player.name}
              style={{ width: 22, height: 28, objectFit: 'contain', objectPosition: 'bottom', flexShrink: 0 }}
            />

            {/* Name + stats */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'Cinzel, serif',
                fontWeight: 700,
                fontSize: 'clamp(0.55rem, 1vw, 0.72rem)',
                color: rank === 0 ? '#F5C842' : '#FFF8E7',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {player.name}
              </div>
              <div style={{
                fontSize: '0.55rem',
                color: 'rgba(245,237,208,0.6)',
                fontFamily: 'Crimson Text, serif',
              }}>
                Tile {player.position} · {player.score}pts · {accuracy(player)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
