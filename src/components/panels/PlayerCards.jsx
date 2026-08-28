import { useGameStore } from '../../store/gameStore.js';

export default function PlayerCards() {
  const players               = useGameStore((s) => s.players);
  const activeAnsweringPlayer = useGameStore((s) => s.activeAnsweringPlayer);
  const playerAnswers         = useGameStore((s) => s.playerAnswers);
  const buzzLock              = useGameStore((s) => s.buzzLock);
  const questions             = useGameStore((s) => s.questions);
  const idx                   = useGameStore((s) => s.currentQuestionIndex);
  const isFFF                 = questions[idx]?.ruleset?.mode === 'fastest-finger';

  return (
    <div style={{
      display: 'flex',
      gap: 10,
      height: '100%',
      padding: '4px 8px',
      alignItems: 'stretch',
    }}>
      {players.map((p, i) => {
        const isCurrent = isFFF ? buzzLock === i : activeAnsweringPlayer === i;
        const isBuzzed  = isFFF && buzzLock === i;
        const isLocked  = isFFF && buzzLock !== null && buzzLock !== i;
        const pAnswer   = playerAnswers[i];

        return (
          <div
            key={p.id}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: isCurrent
                ? 'linear-gradient(135deg, rgba(245,200,66,0.18), rgba(200,100,10,0.12))'
                : 'linear-gradient(160deg, rgba(22, 14, 8, 0.85), rgba(12, 8, 5, 0.9))',
              border: `2px solid ${isCurrent ? '#F5C842' : 'rgba(245,200,66,0.2)'}`,
              borderRadius: 12,
              padding: '6px 12px',
              boxShadow: isCurrent ? '0 0 16px rgba(245,200,66,0.35)' : '0 4px 16px rgba(0,0,0,0.5)',
              opacity: isLocked ? 0.45 : 1,
              transition: 'all 0.25s ease',
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
                  filter: isCurrent ? 'drop-shadow(0 0 6px #F5C842)' : 'none',
                }}
              />
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
              {/* Name & Choice badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{
                  fontFamily: 'Cinzel, serif',
                  fontWeight: 700,
                  fontSize: 'clamp(0.68rem, 1.2vw, 0.88rem)',
                  color: isCurrent ? '#F5C842' : '#FFF8E7',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textShadow: isCurrent ? '0 0 8px rgba(245,200,66,0.5)' : 'none',
                }}>
                  {p.name || `Player ${i + 1}`}
                </div>
                {pAnswer && (
                  <span style={{
                    fontSize: '0.6rem',
                    fontFamily: 'Cinzel, serif',
                    fontWeight: 700,
                    color: '#32CD32',
                    background: 'rgba(50,205,50,0.15)',
                    padding: '1px 6px',
                    borderRadius: 8,
                    border: '1px solid rgba(50,205,50,0.3)',
                  }}>
                    {pAnswer}
                  </span>
                )}
              </div>

              {/* Tile position */}
              <div style={{
                fontSize: '0.65rem',
                color: '#D4952A',
                fontFamily: 'Cinzel, serif',
                margin: '1px 0',
              }}>
                🎯 Tile {p.position}
              </div>

              {/* Correct / Wrong / Score */}
              <div style={{
                display: 'flex',
                gap: 8,
                fontSize: '0.62rem',
                fontFamily: 'Crimson Text, serif',
                color: 'rgba(245,237,208,0.75)',
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
