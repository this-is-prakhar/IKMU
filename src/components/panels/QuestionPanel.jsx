import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore.js';

export default function QuestionPanel({ onAnswer }) {
  const questions             = useGameStore((s) => s.questions);
  const idx                   = useGameStore((s) => s.currentQuestionIndex);
  const gamePhase             = useGameStore((s) => s.gamePhase);
  const playerAnswers         = useGameStore((s) => s.playerAnswers);
  const activeAnsweringPlayer = useGameStore((s) => s.activeAnsweringPlayer);
  const setActivePlayer       = useGameStore((s) => s.setActiveAnsweringPlayer);
  const buzzLock              = useGameStore((s) => s.buzzLock);
  const players               = useGameStore((s) => s.players);
  const questionResults       = useGameStore((s) => s.questionResults);

  const q = questions[idx];
  if (!q) return null;

  const isFFF       = q.ruleset.mode === 'fastest-finger';
  const isRevealing = gamePhase === 'answerReveal' || gamePhase === 'consequence';

  function handleOption(opt) {
    if (gamePhase !== 'question') return;
    if (isFFF) {
      if (buzzLock === null) return;
      onAnswer(buzzLock, opt);
    } else {
      onAnswer(activeAnsweringPlayer, opt);
    }
  }

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(160deg, rgba(22, 14, 8, 0.94), rgba(12, 8, 5, 0.96))',
      border: '2px solid rgba(245, 200, 66, 0.35)',
      borderRadius: 14,
      boxShadow: '0 8px 32px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,248,231,0.1)',
      padding: '16px 18px',
      gap: 10,
      overflow: 'hidden',
    }}>
      {/* Title & Phase */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          fontFamily: 'Cinzel, serif',
          fontWeight: 700,
          fontSize: 'clamp(0.7rem, 1.2vw, 0.9rem)',
          color: '#F5C842',
          letterSpacing: 1,
          textTransform: 'uppercase',
          textShadow: '0 1px 4px rgba(0,0,0,0.7)',
        }}>
          {q.title}
        </div>
        <div style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '0.65rem',
          color: 'rgba(245,237,208,0.5)',
        }}>
          Q{q.id}
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
              fontSize: 'clamp(0.8rem, 1.3vw, 0.98rem)',
              color: '#FFF8E7',
              lineHeight: 1.45,
              maxHeight: '35%',
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
              fontSize: 'clamp(0.75rem, 1.2vw, 0.92rem)',
              color: '#FFF8E7',
              lineHeight: 1.4,
              maxHeight: '35%',
              overflowY: 'auto',
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

      <div style={{ height: 1, background: 'rgba(245,200,66,0.3)', margin: '2px 0' }} />

      {/* Player Selection Bar (Standard mode) */}
      {!isRevealing && !isFFF && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: '0.65rem', fontFamily: 'Cinzel, serif', color: '#D4952A' }}>
            Selecting for:
          </span>
          {players.map((p, i) => {
            const hasAnswered = playerAnswers[i] !== null;
            const isCurrent = activeAnsweringPlayer === i;
            return (
              <button
                key={p.id}
                onClick={() => setActivePlayer(i)}
                style={{
                  flex: 1,
                  background: isCurrent
                    ? 'linear-gradient(135deg, rgba(245,200,66,0.3), rgba(200,100,10,0.3))'
                    : 'rgba(255,255,255,0.06)',
                  border: `1.5px solid ${isCurrent ? '#F5C842' : 'rgba(255,255,255,0.15)'}`,
                  borderRadius: 6,
                  padding: '3px 6px',
                  fontFamily: 'Cinzel, serif',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: isCurrent ? '#F5C842' : '#FFF8E7',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                }}
              >
                <span>{p.name.split(' ')[0]}</span>
                {hasAnswered && <span style={{ color: '#32CD32' }}>✓ ({playerAnswers[i]})</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* FFF Mode Buzz Status */}
      {!isRevealing && isFFF && (
        <div style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '0.7rem',
          color: buzzLock !== null ? '#F5C842' : '#FF4400',
          textAlign: 'center',
          fontWeight: 700,
          letterSpacing: 1,
          background: 'rgba(0,0,0,0.3)',
          padding: '4px 8px',
          borderRadius: 6,
        }}>
          {buzzLock === null
            ? '⚡ FASTEST FINGER FIRST — Press Q / W / E to Buzz In!'
            : `🔔 ${players[buzzLock]?.name} buzzed in!`
          }
        </div>
      )}

      {/* Option Buttons A / B */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, justifyContent: 'center' }}>
        {(['A', 'B']).map((opt) => {
          const optText = opt === 'A' ? q.optionA : q.optionB;
          const isCorrect = q.correctOption === opt;
          let btnStyle = {
            width: '100%',
            padding: '8px 12px',
            borderRadius: 8,
            border: '1.5px solid rgba(245,200,66,0.3)',
            background: 'rgba(255,248,231,0.06)',
            color: '#FFF8E7',
            fontFamily: 'Crimson Text, serif',
            fontSize: 'clamp(0.78rem, 1.2vw, 0.92rem)',
            lineHeight: 1.35,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.15s ease',
          };

          if (isRevealing) {
            if (isCorrect) {
              btnStyle.border = '2px solid #32CD32';
              btnStyle.background = 'rgba(50,205,50,0.2)';
            }
          }

          const canClick = !isRevealing && (!isFFF || buzzLock !== null);

          return (
            <button
              key={opt}
              style={btnStyle}
              disabled={!canClick}
              onClick={() => handleOption(opt)}
            >
              <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, color: '#F5C842', marginRight: 6 }}>
                {opt}.
              </span>
              {optText}
            </button>
          );
        })}
      </div>

      {/* Results breakdown per player during reveal */}
      {isRevealing && (
        <div style={{
          display: 'flex',
          gap: 6,
          justifyContent: 'space-around',
          background: 'rgba(0,0,0,0.3)',
          padding: '6px 8px',
          borderRadius: 6,
          fontSize: '0.68rem',
          fontFamily: 'Cinzel, serif',
        }}>
          {questionResults.map((r) => (
            <div key={r.playerIdx} style={{ color: r.isCorrect ? '#32CD32' : '#FF4444' }}>
              {players[r.playerIdx]?.name.split(' ')[0]}: {r.answer || 'No Ans'} ({r.delta > 0 ? `+${r.delta}` : r.delta})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
