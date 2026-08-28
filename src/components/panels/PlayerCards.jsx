import { useGameStore } from '../../store/gameStore.js';

/**
 * Bottom bar — 3 player cards: portrait, name, tile, correct/wrong counts, score.
 * Current turn's card is highlighted with gold border + glow.
 */
export default function PlayerCards() {
  const players    = useGameStore((s) => s.players);
  const turnIdx    = useGameStore((s) => s.currentTurnPlayerIndex);
  const buzzLock   = useGameStore((s) => s.buzzLock);
  const questions  = useGameStore((s) => s.questions);
  const idx        = useGameStore((s) => s.currentQuestionIndex);
  const isFFF      = questions[idx]?.ruleset?.mode === 'fastest-finger';

  return (
    <div style={{
      display: 'flex',
      gap: 8,
      height: '100%',
      padding: '4px 12px',
      alignItems: 'stretch',
    }}>
      {players.map((p, i) => {
        const isActive  = isFFF ? buzzLock === i : turnIdx === i;
        const isBuzzed  = isFFF && buzzLock === i;
        const isLocked  = isFFF && buzzLock !== null && buzzLock !== i;

        return (
          <div
            key={p.id}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: isActive
                ? 'linear-gradient(135deg, rgba(245,200,66,0.15), rgba(232,111,31,0.1))'
                : 'rgba(255,255,255,0.04)',
              border: `2px solid ${isActive ? '#F5C842' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 10,
              padding: '6px 10px',
              boxShadow: isActive ? '0 0 16px rgba(245,200,66,0.3)' : 'none',
              opacity: isLocked ? 0.45 : 1,
              transition: 'all 0.3s ease',
            }}
          >
            {/* Pawn portrait */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img
                src={p.pawnImage}
                alt={p.name}
                style={{
                  width: 44,
                  height: 52,
                  objectFit: 'contain',
                  objectPosition: 'bottom',
                  filter: isActive ? 'drop-shadow(0 0 6px #F5C842)' : 'none',
                }}
              />
              {/* FFF buzz-in key badge */}
              {isFFF && (
                <span className={`buzz-key${isBuzzed ? ' active' : ''}`} style={{
                  position: 'absolute', top: -4, right: -8, fontSize: '0.55rem',
                }}>
                  {['Q','W','E'][i]}
                </span>
              )}
            </div>

            {/* Stats */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Name */}
              <div style={{
                fontFamily: 'Cinzel, serif',
                fontWeight: 700,
                fontSize: 'clamp(0.65rem, 1.2vw, 0.85rem)',
                color: isActive ? '#F5C842' : '#FFF8E7',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textShadow: isActive ? '0 0 8px rgba(245,200,66,0.5)' : 'none',
              }}>
                {p.name || `Player ${i + 1}`}
              </div>

              {/* Tile position */}
              <div style={{
                fontSize: '0.65rem',
                color: '#D4952A',
                fontFamily: 'Cinzel, serif',
              }}>
                🎯 Tile {p.position}
              </div>

              {/* Correct / Wrong / Score */}
              <div style={{
                display: 'flex',
                gap: 6,
                fontSize: '0.6rem',
                fontFamily: 'Crimson Text, serif',
                color: 'rgba(245,237,208,0.7)',
              }}>
                <span style={{ color: '#32CD32' }}>✓{p.correct}</span>
                <span style={{ color: '#FF4444' }}>✗{p.wrong}</span>
                <span style={{ color: '#F5C842', fontWeight: 700 }}>{p.score}pts</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
