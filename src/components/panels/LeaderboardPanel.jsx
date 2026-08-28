import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore.js';
import { sortLeaderboard, accuracy } from '../../game-logic/scoring.js';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardPanel() {
  const players       = useGameStore((s) => s.players);
  const leaderChanged = useGameStore((s) => s.leaderChanged);
  const sorted        = sortLeaderboard(players);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(165deg, rgba(28, 18, 12, 0.96) 0%, rgba(18, 11, 7, 0.98) 100%)',
      border: '2px solid #D4952A',
      borderRadius: 14,
      boxShadow: '0 8px 32px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(245, 200, 66, 0.4), inset 0 1px 0 rgba(255, 248, 231, 0.15)',
      padding: '12px 14px',
      gap: 8,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(245, 200, 66, 0.25)',
        paddingBottom: 6,
      }}>
        <div style={{
          fontFamily: 'Cinzel, serif',
          fontWeight: 700,
          fontSize: 'clamp(0.72rem, 1.2vw, 0.88rem)',
          color: '#F5C842',
          letterSpacing: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <span>🏆</span> LEADERBOARD
        </div>

        {/* NEW LEADER flash */}
        <AnimatePresence>
          {leaderChanged && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{
                background: 'linear-gradient(135deg, #F5C842, #E86F1F)',
                color: '#1A0D06',
                fontFamily: 'Cinzel, serif',
                fontWeight: 900,
                fontSize: '0.55rem',
                padding: '2px 6px',
                borderRadius: 10,
                letterSpacing: 1,
                boxShadow: '0 0 8px rgba(245,200,66,0.6)',
              }}
            >
              NEW LEADER!
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Rankings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, justifyContent: 'center' }}>
        {sorted.map((player, rank) => (
          <motion.div
            key={player.id}
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              background: rank === 0
                ? 'linear-gradient(90deg, rgba(245,200,66,0.2), rgba(200,100,10,0.1))'
                : 'rgba(255,255,255,0.04)',
              borderRadius: 8,
              padding: '6px 8px',
              border: rank === 0 ? '1.5px solid rgba(245,200,66,0.5)' : '1px solid rgba(255,255,255,0.08)',
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
                fontSize: 'clamp(0.62rem, 1vw, 0.8rem)',
                color: rank === 0 ? '#F5C842' : '#FFF8E7',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {player.name}
              </div>
              <div style={{
                fontSize: '0.58rem',
                color: 'rgba(245,237,208,0.65)',
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
