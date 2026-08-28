import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore.js';

export default function QuestionPanel({ onAnswer }) {
  const questions         = useGameStore((s) => s.questions);
  const idx               = useGameStore((s) => s.currentQuestionIndex);
  const gamePhase         = useGameStore((s) => s.gamePhase);
  const playerAnswers     = useGameStore((s) => s.playerAnswers);
  const buzzLock          = useGameStore((s) => s.buzzLock);
  const buzzIn            = useGameStore((s) => s.buzzIn);
  const players           = useGameStore((s) => s.players);
  const questionResults   = useGameStore((s) => s.questionResults);

  const q = questions[idx];
  if (!q) return null;

  const isFFF       = q.ruleset.mode === 'fastest-finger';
  const isRevealing = gamePhase === 'answerReveal' || gamePhase === 'consequence';

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
      padding: '14px 16px',
      gap: 8,
      overflow: 'hidden',
    }}>
      {/* Question Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(245, 200, 66, 0.25)',
        paddingBottom: 6,
      }}>
        <div style={{
          fontFamily: 'Cinzel, serif',
          fontWeight: 700,
          fontSize: 'clamp(0.75rem, 1.2vw, 0.92rem)',
          color: '#F5C842',
          letterSpacing: 1,
          textTransform: 'uppercase',
          textShadow: '0 1px 4px rgba(0,0,0,0.7)',
        }}>
          {q.title}
        </div>
        <div style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '0.68rem',
          fontWeight: 600,
          color: 'rgba(245, 237, 208, 0.6)',
        }}>
          Q{q.id} of {questions.length}
        </div>
      </div>

      {/* Situation or Explanation */}
      <AnimatePresence mode="wait">
        {!isRevealing ? (
          <motion.div
            key="situation"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            style={{
              fontFamily: 'Crimson Text, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(0.82rem, 1.25vw, 0.98rem)',
              color: '#FFF8E7',
              lineHeight: 1.4,
              maxHeight: '30%',
              overflowY: 'auto',
            }}
          >
            {q.situation}
          </motion.div>
        ) : (
          <motion.div
            key="explanation"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              fontFamily: 'Crimson Text, serif',
              fontSize: 'clamp(0.78rem, 1.2vw, 0.94rem)',
              color: '#FFF8E7',
              lineHeight: 1.4,
              maxHeight: '34%',
              overflowY: 'auto',
              background: 'rgba(0,0,0,0.3)',
              padding: '6px 10px',
              borderRadius: 8,
              border: '1px solid rgba(245,200,66,0.2)',
            }}
          >
            <span style={{ color: '#32CD32', fontWeight: 700 }}>
              ✓ Correct Answer: Option {q.correctOption}
            </span>
            <br />
            {q.explanation}
            <br />
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.7em', color: '#D4952A', letterSpacing: 1 }}>
              💡 {q.concept}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Option Descriptions A & B */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        background: 'rgba(0,0,0,0.25)',
        padding: '6px 8px',
        borderRadius: 8,
        border: '1px solid rgba(245,200,66,0.15)',
        fontSize: 'clamp(0.72rem, 1.1vw, 0.85rem)',
        fontFamily: 'Crimson Text, serif',
        color: 'rgba(255,248,231,0.9)',
        lineHeight: 1.3,
      }}>
        <div style={{ color: isRevealing && q.correctOption === 'A' ? '#32CD32' : '#FFF8E7' }}>
          <strong style={{ color: '#F5C842', fontFamily: 'Cinzel, serif' }}>A.</strong> {q.optionA}
        </div>
        <div style={{ color: isRevealing && q.correctOption === 'B' ? '#32CD32' : '#FFF8E7' }}>
          <strong style={{ color: '#F5C842', fontFamily: 'Cinzel, serif' }}>B.</strong> {q.optionB}
        </div>
      </div>

      {/* Answer Controls: Q1-20 Individual Mode (All 3 Players Answer) */}
      {!isRevealing && !isFFF && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          flex: 1,
          justifyContent: 'center',
        }}>
          <div style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '0.62rem',
            color: '#D4952A',
            letterSpacing: 1,
            textTransform: 'uppercase',
            textAlign: 'center',
          }}>
            All 3 Players Choose A or B:
          </div>

          {players.map((p, i) => {
            const ans = playerAnswers[i];
            return (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: ans !== null
                    ? 'rgba(50, 205, 50, 0.1)'
                    : 'rgba(255, 255, 255, 0.04)',
                  border: `1.5px solid ${ans !== null ? 'rgba(50, 205, 50, 0.4)' : 'rgba(245, 200, 66, 0.25)'}`,
                  borderRadius: 8,
                  padding: '4px 8px',
                  gap: 8,
                }}
              >
                {/* Player Name & Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flex: 1 }}>
                  <img
                    src={p.pawnImage}
                    alt={p.name}
                    style={{ width: 20, height: 24, objectFit: 'contain', flexShrink: 0 }}
                  />
                  <span style={{
                    fontFamily: 'Cinzel, serif',
                    fontWeight: 700,
                    fontSize: 'clamp(0.65rem, 1.1vw, 0.82rem)',
                    color: ans !== null ? '#F5C842' : '#FFF8E7',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {p.name.split(' ')[0]}
                  </span>
                  {ans && (
                    <span style={{
                      fontSize: '0.62rem',
                      fontFamily: 'Cinzel, serif',
                      fontWeight: 700,
                      color: '#32CD32',
                    }}>
                      [Chose {ans}]
                    </span>
                  )}
                </div>

                {/* A / B Button Choices */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => onAnswer(i, 'A')}
                    style={{
                      padding: '4px 14px',
                      borderRadius: 6,
                      border: `1.5px solid ${ans === 'A' ? '#32CD32' : '#D4952A'}`,
                      background: ans === 'A'
                        ? 'linear-gradient(135deg, #1E7B6E, #2FA090)'
                        : 'rgba(245, 200, 66, 0.1)',
                      color: '#FFF8E7',
                      fontFamily: 'Cinzel, serif',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      boxShadow: ans === 'A' ? '0 0 8px rgba(50,205,50,0.5)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    A
                  </button>
                  <button
                    onClick={() => onAnswer(i, 'B')}
                    style={{
                      padding: '4px 14px',
                      borderRadius: 6,
                      border: `1.5px solid ${ans === 'B' ? '#32CD32' : '#D4952A'}`,
                      background: ans === 'B'
                        ? 'linear-gradient(135deg, #1E7B6E, #2FA090)'
                        : 'rgba(245, 200, 66, 0.1)',
                      color: '#FFF8E7',
                      fontFamily: 'Cinzel, serif',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      boxShadow: ans === 'B' ? '0 0 8px rgba(50,205,50,0.5)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    B
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Answer Controls: Q21-25 Fastest Finger First Mode */}
      {!isRevealing && isFFF && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          flex: 1,
          justifyContent: 'center',
        }}>
          {buzzLock === null ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
              <div style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '0.72rem',
                color: '#FF4400',
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}>
                ⚡ FIRST TO BUZZ IN GETS TO ANSWER:
              </div>
              <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                {players.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => buzzIn(i)}
                    style={{
                      flex: 1,
                      padding: '10px 6px',
                      borderRadius: 8,
                      border: '2px solid #FF4400',
                      background: 'linear-gradient(135deg, rgba(200,50,10,0.3), rgba(245,200,66,0.15))',
                      color: '#FFF8E7',
                      fontFamily: 'Cinzel, serif',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      boxShadow: '0 4px 12px rgba(255,68,0,0.3)',
                    }}
                  >
                    <span style={{ fontSize: '0.95rem' }}>🔔 BUZZ</span>
                    <span>{p.name.split(' ')[0]}</span>
                    <span style={{ fontSize: '0.65rem', color: '#F5C842' }}>[Key {['Q', 'W', 'E'][i]}]</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              <div style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '0.78rem',
                color: '#F5C842',
                fontWeight: 700,
                letterSpacing: 1,
              }}>
                🔔 {players[buzzLock]?.name} Buzzed In! Choose:
              </div>
              <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                <button
                  onClick={() => onAnswer(buzzLock, 'A')}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: 8,
                    border: '2px solid #D4952A',
                    background: 'linear-gradient(135deg, #C8640A, #D4952A)',
                    color: '#FFF8E7',
                    fontFamily: 'Cinzel, serif',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(245,200,66,0.3)',
                  }}
                >
                  Option A
                </button>
                <button
                  onClick={() => onAnswer(buzzLock, 'B')}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: 8,
                    border: '2px solid #D4952A',
                    background: 'linear-gradient(135deg, #C8640A, #D4952A)',
                    color: '#FFF8E7',
                    fontFamily: 'Cinzel, serif',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(245,200,66,0.3)',
                  }}
                >
                  Option B
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results Breakdown during Reveal */}
      {isRevealing && (
        <div style={{
          display: 'flex',
          gap: 6,
          justifyContent: 'space-around',
          background: 'rgba(0,0,0,0.4)',
          padding: '8px 10px',
          borderRadius: 8,
          border: '1px solid rgba(245,200,66,0.25)',
          fontSize: '0.72rem',
          fontFamily: 'Cinzel, serif',
        }}>
          {questionResults.map((r) => (
            <div key={r.playerIdx} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: r.isCorrect ? '#32CD32' : '#FF4444',
            }}>
              <span style={{ fontWeight: 700, color: '#FFF8E7' }}>
                {players[r.playerIdx]?.name.split(' ')[0]}
              </span>
              <span>
                {r.answer ? `Chose ${r.answer}` : 'No Answer'} ({r.delta > 0 ? `+${r.delta}` : r.delta})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
